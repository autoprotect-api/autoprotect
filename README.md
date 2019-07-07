# autoprotect
A web service that automatically protects master branches of newly created repositories in an organization

This service is implemented using the [Serverless framework](https://serverless.com/) and is deployed as an [AWS Lambda function](https://aws.amazon.com/lambda/) written in [Node.js](https://nodejs.org/en/)

It is currently deployed on this URL - https://tmnpqu76x2.execute-api.us-east-1.amazonaws.com/dev/autoprotect

The web service can be tested with a POST HTTPS call with the same payload as the one carried by the request issued by the webhook (see below).

It is invoked by a webhook configured on the autoprotect-api organization which is triggered by the create event for branches on repos owned by the organization. The webhook sends a POST request with a [predetermined payload](https://developer.github.com/v3/activity/events/types/#createevent) which is parsed by the service and used in API calls that it makes using the [Octokit REST NPM package](https://github.com/octokit/rest.js) 

The web service issues one API command to protect the master branch, if the payload from the webhook indicates that a master branch was created. On success of this call, the service issues a second API call, to create an issue in the repo, which says that the repo had its master branch autoprotected, and includes an @-mention for me, @evgenyrahman

For local development, please install the Node.js runtime (version 10+) and install the Serverless NPM package

```
npm -g install serverless
```

Please ensure that you have [your credentials for AWS set up in your local environment](https://serverless.com/framework/docs/providers/aws/guide/credentials/)

From the root path of this repo, you can then run the command

```
sls deploy
```

to deploy a new version of the function to AWS

You can call

```
sls logs -f autoprotect
```

to check the logs of the Lambda function and check invokation details
