import aws_cdk as core
import aws_cdk.assertions as assertions

from patricio_maya_cv.patricio_maya_cv_stack import PatricioMayaCvStack

# example tests. To run these tests, uncomment this file along with the example
# resource in patricio_maya_cv/patricio_maya_cv_stack.py
def test_sqs_queue_created():
    app = core.App()
    stack = PatricioMayaCvStack(app, "patricio-maya-cv")
    template = assertions.Template.from_stack(stack)

#     template.has_resource_properties("AWS::SQS::Queue", {
#         "VisibilityTimeout": 300
#     })
