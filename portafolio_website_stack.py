#!/usr/bin/env python3
from aws_cdk import (
    Stack,
    CfnOutput,
    RemovalPolicy,
    aws_s3 as s3,
    aws_cloudfront as cloudfront,
    aws_cloudfront_origins as origins,
    aws_certificatemanager as acm,
    Duration,
    aws_route53 as route53,
    aws_route53_targets as targets,
    aws_s3_deployment as s3deploy,
    aws_iam as iam,
)
from constructs import Construct

class PortfolioWebsiteStack(Stack):     
    def __init__(self, scope: Construct, construct_id: str, domain_name: str, hosted_zone: route53.IHostedZone, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Website bucket creation
        website_bucket = s3.Bucket(
            self, "WebsiteBucket",
            bucket_name=domain_name.lower(),
            website_index_document="index.html",
            website_error_document="error.html",
            public_read_access=True,
            block_public_access=s3.BlockPublicAccess.BLOCK_ACLS,
            removal_policy=RemovalPolicy.DESTROY,
        )

        # Certificate creation
        certificate = acm.Certificate(
            self, "SiteCertificate",
            domain_name=domain_name,
            validation=acm.CertificateValidation.from_dns(),
        )
        
        # CloudFront distribution
        distribution = cloudfront.Distribution(
            self, "WebsiteDistribution",
            default_behavior=cloudfront.BehaviorOptions(
                origin=origins.S3Origin(website_bucket),
                viewer_protocol_policy=cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                cache_policy=cloudfront.CachePolicy.CACHING_OPTIMIZED,
                origin_request_policy=cloudfront.OriginRequestPolicy.CORS_S3_ORIGIN,
                allowed_methods=cloudfront.AllowedMethods.ALLOW_GET_HEAD,
            ),
            domain_names=[domain_name],
            certificate=certificate,
            default_root_object="index.html",
            error_responses=[
                cloudfront.ErrorResponse(
                    http_status=403,
                    response_http_status=200,
                    response_page_path="/index.html",
                    ttl=Duration.minutes(30)
                ),
                cloudfront.ErrorResponse(
                    http_status=404,
                    response_http_status=200,
                    response_page_path="/index.html",
                    ttl=Duration.minutes(30)
                )
            ]
        )


        # Create A record
        route53.ARecord(
            self, "SiteAliasRecord",
            zone=hosted_zone,  # Use the passed hosted_zone parameter
            record_name=domain_name.split(".")[0] if domain_name.count(".") > 1 else None,
            target=route53.RecordTarget.from_alias(
                targets.CloudFrontTarget(distribution)
            )
        )

        # Create AAAA record
        route53.AaaaRecord(
            self, "SiteAliasRecordIPv6",
            zone=hosted_zone,  # Use the passed hosted_zone parameter
            record_name=domain_name.split(".")[0] if domain_name.count(".") > 1 else None,
            target=route53.RecordTarget.from_alias(
                targets.CloudFrontTarget(distribution)
            )
        )

        # Deploy website content
        s3deploy.BucketDeployment(
            self, "DeployWebsite",
            sources=[s3deploy.Source.asset("./website")],
            destination_bucket=website_bucket,
            distribution=distribution,
            distribution_paths=["/*"]
        )

        # Outputs
        CfnOutput(
            self, "BucketName",
            value=website_bucket.bucket_name,
            description="Nombre del bucket S3 creado"
        )

        CfnOutput(
            self, "S3WebsiteURL",
            value=website_bucket.bucket_website_url,
            description="URL directa del sitio web S3 (sin CloudFront)"
        )

        CfnOutput(
            self, "DistributionId",
            value=distribution.distribution_id,
            description="ID de la distribución CloudFront"
        )

        CfnOutput(
            self, "CloudFrontDomainName",
            value=distribution.domain_name,
            description="Nombre de dominio de CloudFront"
        )