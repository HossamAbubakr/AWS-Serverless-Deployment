# Toddy, AWS Serverless Deployment

## Table of Contents

- [Summary](#Summary)

- [Technologies](#Technologies)

- [Testing](#Testing)

- [Structure](#Structure)

- [Configuration](#Configuration)

- [Deployment](#Deployment)

## Summary

This serverless todo app was configured and deployed to AWS as part of my **AWS Cloud Developer Nanodegree from Udacity**.

**It demonstrates my understanding and ability to configure the following :**

#### AWS services

AWS IAM   
AWS X-Ray    
AWS Lambda     
AWS DynamoDB    
AWS API Gateway    

#### Serverless Framework AWS Configuration

Setup Serverless.   
Configure Xray.   
Configure Serverless plugins.   
Configure API authenticator.   
Configure IAM roles and permissions.   
Configure Serverless environment variables.    
Create DynamoDB.   
Create Lambda functions.   
Create and attach policies.   
Create Serverless YAML file.  

#### Deployment

Serverless framework was used for configuring and deploying all the services. 

#### Development  

Create and integrate Lambda functions.   
Implement Auth0 JWKS for authentication.  
Interact with AWS services using the aws-sdk library.   
Implement AWS Xray for logging and monitoring of the application.


## Technologies

React was used for the frontend.   
Lambda functions were used for the backend.  
DynamoDB was the database service of choice.   
Typescript was used as the language of choice.   
Serverless Framework was used for configuration and deployment.    

## Testing

The project includes a Postman Collection Json file that can be imported for testing in /testing

## Structure

```
|   README.md
|
+---backend
|   |   package-lock.json
|   |   package.json
|   |   serverless.yml
|   |   tsconfig.json
|   |   webpack.config.js
|   |
|   \---src
|       +---auth
|       |       Jwt.ts
|       |       JwtPayload.ts
|       |       utils.ts
|       |
|       +---businessLogic
|       |       todos.ts
|       |
|       +---dataLayer
|       |       todosAccess.ts
|       |
|       +---lambda
|       |   |   utils.ts
|       |   |
|       |   +---auth
|       |   |       auth0Authorizer.ts
|       |   |
|       |   \---http
|       |           createTodo.ts
|       |           deleteTodo.ts
|       |           generateUploadUrl.ts
|       |           getTodos.ts
|       |           updateTodo.ts
|       |
|       +---models
|       |       TodoItem.ts
|       |       TodoUpdate.ts
|       |
|       +---requests
|       |       CreateTodoRequest.ts
|       |       UpdateTodoRequest.ts
|       |
|       \---utils
|               logger.ts
|
+---client
|   |   package-lock.json
|   |   package.json
|   |   README.md
|   |   tsconfig.json
|   |
|   +---public
|   |       favicon.ico
|   |       index.html
|   |       manifest.json
|   |
|   \---src
|       |   App.css
|       |   App.tsx
|       |   config.ts
|       |   index.css
|       |   index.tsx
|       |   logo.svg
|       |   react-app-env.d.ts
|       |   routing.tsx
|       |   serviceWorker.ts
|       |
|       +---api
|       |       todos-api.ts
|       |
|       +---auth
|       |       Auth.js
|       |
|       +---components
|       |       Callback.tsx
|       |       EditTodo.tsx
|       |       LogIn.tsx
|       |       NotFound.tsx
|       |       Todos.tsx
|       |
|       +---images
|       |       Logo.png
|       |
|       \---types
|               CreateTodoRequest.ts
|               Todo.ts
|               UpdateTodoRequest.ts
|
+---images
|       Add attachment.PNG
|       API gateway.PNG
|       Attachment added.PNG
|       CloudFormation.PNG
|       CloudWatch.PNG
|       Deployment.PNG
|       DynamoDB.PNG
|       import-collection-1.png
|       import-collection-2.png
|       import-collection-3.png
|       import-collection-4.png
|       import-collection-5.png
|       Lambda.PNG
|       New Todo.PNG
|       S3.PNG
|       Todo updated.PNG
|       XRay.PNG
|
\---testing
        postman_collection.json
```

## Configuration

The serverless file includes all the configuration you need.

But you will have to make the following changes to the following files:

Go to
**/backend/serverless.yaml**   

and replace
```
org: [ORG NAME]
```
With your organization name in your serverless account

replace
```
region: ${opt:region, '[REGION]'}
```
With your desired deployment region ex: us-east-1

replace
```
ATTACHMENTS_BUCKET: [NAME]-todos-attachments-${self:provider.stage}
```
With your desired attachment S3 bucket name

replace
```
AUTH_0_JWKS: [JWKS LINK]
```
With your Auth0 JWKS link

Go to
**/client/src/config.ts**   
After deploying the backend

replace   

```
const apiId = 'APP ID'
```

With the id of your lambda functions after deployment

replace   

```
domain: 'DOMAIN',        // Auth0 domain
clientId: 'CLIENT ID',  // Auth0 client id
```

With your Auth0 app domain and client ID

## Deployment

### 1. Backend

Configure Serverless

```shell
serverless login
# Configure serverless to use the AWS credentials to deploy the application
sls config credentials --provider aws --key YOUR_ACCESS_KEY_ID --secret YOUR_SECRET_KEY --profile serverless
```

Deploy   
```shell
serverless deploy
```

View the end points to configure the client
Deploy   
```shell
serverless info
```

### 2. Frontend

After following the configuration steps above
```shell
npm start
```


