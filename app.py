#!/usr/bin/env python3
from aws_cdk import App, Environment
from backend_stack import BackendStack
from portafolio_website_stack import PortfolioWebsiteStack
import os

app = App()

# Define the environment with account and region
env = Environment(
    account=os.environ["CDK_DEFAULT_ACCOUNT"],
    region=os.environ["CDK_DEFAULT_REGION"]
)

# Create backend stack first with environment
backend_stack = BackendStack(
    app,
    "BackendStack",
    domain_name="",
    env=env
)

# Create portfolio website stack and pass the hosted_zone
portfolio_stack = PortfolioWebsiteStack(
    app,
    "PortfolioWebsiteStack",
    domain_name="",
    hosted_zone=backend_stack.hosted_zone,
    env=env
)

app.synth()