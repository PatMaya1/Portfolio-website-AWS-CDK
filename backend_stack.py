from aws_cdk import (
    Stack,
    aws_route53 as route53,
    CfnOutput,
    Fn,
    Token,
)
from constructs import Construct

class BackendStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, domain_name: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Create Route 53 Hosted Zone
        self.hosted_zone = route53.HostedZone(
            self, 
            "HostedZone",
            zone_name=domain_name,
            comment="Hosted zone for domain"
        )

        # Output the hosted zone ID
        CfnOutput(
            self,
            "HostedZoneId",
            value=self.hosted_zone.hosted_zone_id,
            description="Hosted Zone ID"
        )

        # Output the name servers using Fn.join
        CfnOutput(
            self,
            "NameServers",
            value=Fn.join(",", Token.as_list(self.hosted_zone.hosted_zone_name_servers)),
            description="Name servers for the hosted zone"
        )
