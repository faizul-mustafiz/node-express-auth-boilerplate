# Node Express Authentication Boilerplate

This is a boilerplate/starter project to start building a `production`/`staging`/`development` environment ready REST API's based on Express.js.

This app comes with many build-in features like `JWT`, `authentication`, `authorization`, different security `middleware to sanitize requests`, `logging`, `testing`, `Swagger documentation`, `error handling` and deploy applications with few command as `Docker Container` or `Kubernetes` and automation of testing and building using `GitHub Actions`. You can build your application on top of these features already configured.

This application leverages technologies like `Node.js`, `Express`, `MongoDB`, `Redis/Redis Cluster`, `JWT`, `Docker`, `Docker Hub`, `Kubernetes`, `CI/CD using GitHub Action`. This application is build with the mindset of maintaining industry good practices of developing on Node.js and Express.

## Table of contents

- Quick Start
- Features
- Project Structure
- Environment Variables
- API Documentation
- API Endpoints
- Testing
- CI using GitHub Actions
- Deployment Process
- Authentication and Authorization Flow
- Forgot Password Flow
- Client Application Creation
- Conclusion

## Quick Start

To get started with the project quickly do these steps

Clone the repo:

```
https://github.com/faizul-mustafiz/node-express-auth-boilerplate
```

Install the dependencies:

```
npm install
# OR
npm ci
```

Set the environment variables:
To run the project set up the environment variables. An `env.example` file is present listing the necessary variables of the project.
Make new file name `.env` at the root of the project and edit them with your config.

Run the project locally:

```
npm start
```

## Features

- **Dependency Management:** with [npm](https://www.npmjs.com/)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) with object data modeling wing [Mongoose](https://www.npmjs.com/package/mongoose)
- **Cache Database:** [Redis](https://redis.io/) with object data modeling wing [Mongoose](https://www.npmjs.com/package/mongoose)
- **Authentication and Authorization:**Custom implementation of [JWT](https://jwt.io/)
- **Validation:** request data validation using [Joi](https://www.npmjs.com/package/joi)
- **Logging:** using [Winston](https://www.npmjs.com/package/winston) and [Morgan](https://www.npmjs.com/package/morgan)
- **Testing:** using [Mocha](https://mochajs.org/) and [Chai.js](https://www.chaijs.com/)
- **Error Handling:** Centralized error handling with base error handler class and other errors extending base error handler class
- **API documentation:** with [OpenAPI 3.0 specification](https://www.openapis.org/) using [Swagger](https://swagger.io/) and [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)
- **Environment variables:** using [dotenv](https://www.npmjs.com/package/dotenv)
- **Security:** Implementation of API Key and API secret with only trusted application validation and device info encryption using API secret with json-ed-aes package
- **CORS:** Cross-Origin Resource-Sharing enabled using [cors](https://www.npmjs.com/package/cors)
- **CI:** continuous integration with [GitHub Actions](https://docs.github.com/en/actions)
- **Containerization:** using [Docker](https://docs.docker.com/) or [Docker Compose](https://docs.docker.com/compose/) and [Docker Hub](https://hub.docker.com/) as image repository
- **Container Orchestration:** using Kubernetes for production and stage. For dev environment [Kubernetes](https://kubernetes.io/docs/home/) inside [minikube](https://minikube.sigs.k8s.io/docs/start/)
- **Linting:** using [Prettier](https://prettier.io/) and [pretty-quick](https://www.npmjs.com/package/pretty-quick)
- **Git Hooks:** with [Husky](https://www.npmjs.com/package/husky) and [pretty-quick](https://www.npmjs.com/package/pretty-quick)
- **Reverse Proxy:** reverse proxy and load balancing using [Nginx](https://www.nginx.com/)

## Project Structure

```
|--.github             # github action config files
|--.husky              # github hooks config files
|--deployments         # kubernetes config files
|--docker-compose      # docker compose config files
|--src\v1
    |--configs\        # config of plugins and environments
    |--controllers\    # route controller functions
    |--docs\           # swagger documentation files
    |--enums\          # required enums
    |--environments\   # different types of environment configuration
    |--errors\         # Error handling files fro different types of error
    |--generators\     # generator functions of different values
    |--helpers\        # route controller helpers functions
    |--logger\         # base logger and file logger config files
    |--middlewares\    # express middlewares related to auth and validation
    |--module-test\    # plugins module custom test methods
    |--nginx\          # docker configs and docker file for nginx
    |--plugins\        # plugins for project like redis and mongodb
    |--responses\      # success response object builder
    |--routes\         # route definitions
    |--test\           # unit test definition functions
    |--utility\        # utility functions
    |--validators\     # request validator functions
    |--app.js          # express application init and injections
|--.dockerignore       # docker ignore lists
|--.env.example        # env file example
|--.gitignore          # git ignore list
|--.mocharc.json       # mocha config
|--.prettierignore     # prettier ignore list
|--.prettierrc         # prettier config
|--index.js            # application entry point, server, shutdown
|--package-lock.json
|--package.json
|--README.md
```

## Environment Variables

The environment variables example can be found in `.env.example` and edit these fields in `.env` file

```
#app environment variables
API_PROTOCOL="http"
API_HOST="0.0.0.0"
API_PORT=3030
BASE_API_ROUTE="/api/v1"

# redis environment variables
# this url is for redis configured is redis-Labs/docker container/Kubernetes cluster
REDIS_URL="your-redis-labs-connection-string"

# redis test environment variables
REDIS_URL_TEST="your-redis-test-db-connection-string"

# mongodb environment variables
MONGO_URL="your-mongo-connection-string"

# mongodb test environment variables
MONGO_URL_TEST="your-mongo-test-db-connection-string"

# encryption and decryption environment variables
HASHING_ALGORITHM='AES-GCM'

# JWT environment variables
ACCESS_TOKEN_EXPIRY_TIME=10800
REFRESH_TOKEN_EXPIRY_TIME=43200

VERIFY_TOKEN_SECRET="Your verify token secret"
VERIFY_TOKEN_EXPIRY_TIME=3600

RESET_PASSWORD_TOKEN_SECRET="Your reset password token secret"
RESET_PASSWORD_TOKEN_EXPIRY_TIME=3600

CHANGE_PASSWORD_TOKEN_SECRET="Your change password token secret"
CHANGE_PASSWORD_TOKEN_EXPIRY_TIME=3600

PUBLIC_KEY="your-public-key"
PRIVATE_KEY="your-private-Key"
```

there is a generator file `/src/v1/generators/key.generator.js` you can generate JWT keys form here. The JWT encryption and decryption is based on `{ algorithm: 'ES512' }` so you need to generate public key and private key using openssl commands.

Run this commands to generate a private key and public key and then update the `.env` file with those keys.

```
# For PRIVATE_KEY
openssl ecparam -genkey -name secp521r1 -noout -out private-key-name.pem

# For PRIVATE_KEY
openssl ec -in private-key-name.pem -pubout -out public-key-name.pem

# To get the keys
cat private-key-name.pem
cat public-key-name.pem
```

## API Documentation

Documentation is available at `http://{host}:{port}/v1/docs` you can see the schema definition and routes definition and response definition with examples. Test the API endpoints from here as well.

## API Endpoints

### Auth

- `[POST]` sign-up: `http://{host}:{port}/api/v1/auth/sign-up`
- `[POST]` sign-in: `http://{host}:{port}/api/v1/auth/sign-in`
- `[POST]` sign-out: `http://{host}:{port}/api/v1/auth/sign-out`
- `[POST]` verify: `http://{host}:{port}/api/v1/auth/verify`
- `[POST]` forgot-password: `http://{host}:{port}/api/v1/auth/forgot-password`
- `[POST]` change-password: `http://{host}:{port}/api/v1/auth/change-password`
- `[POST]` refresh: `http://{host}:{port}/api/v1/auth/refresh`
- `[POST]` revoke-access-token: `http://{host}:{port}/api/v1/auth/revoke-at`
- `[POST]` revoke-refresh-token: `http://{host}:{port}/api/v1/auth/revoke-rt`

### Users

- `[GET]` get-all-user: `http://{host}:{port}/api/v1/users`
- `[GET]` get-one-user: `http://{host}:{port}/api/v1/users/{userId}`
- `[POST]` update-one-user: `http://{host}:{port}/api/v1/users/{userId}`
- `[DELETE]` delete-one-user: `http://{host}:{port}/api/v1/users/{userId}`

### Applications

- `[GET]` get-all-application: `http://{host}:{port}/api/v1/applications`
- `[GET]` get-one-application: `http://{host}:{port}/api/v1/applications/{appId}`
- `[POST]` update-one-application: `http://{host}:{port}/api/v1/applications/{appId}`
- `[DELETE]` delete-one-application: `http://{host}:{port}/api/v1/applications/{appId}`

## Testing

By default the application is tested before every commit using `github hooks` and while performing CI integration using `github actions`.
For testing Mocha and Chai.js is used. you can see the test command in `package.json` file.

**Note:** You need to add two keys in `.env` file `REDIS_TEST_URL` and `MONGO_TEST_URL` as the test files deletes all the collection data in mongo for test purpose and flush redis db for redis data. So if you do this on your main collection or redis then you will lose all data after test.

### Run this command to test manually

```
npm test
```

## CI using GitHub Actions

Continues Integration is performed using github actions. Go inside the `.github/workflows` directory and see inside `auth-app.ci.dev.yaml`.
This workflow has two major jobs

- Run test
- push image to Docker-Hub`
  You need to add multiple repository secrets to pass the build arguments and docker hub credentials for this docker-hub image push.
  These are the secrets you need to add in github to run the workflow

```
secrets.DOCKERHUB_USERNAME                  # Docker hub username
secrets.DOCKERHUB_TOKEN                     # Docker hub token
secrets.API_PORT                            # app running port
secrets.API_HOST                            # app host name
secrets.BASE_API_ROUTE                      # app base route
secrets.REDIS_URL                           # redis db/index url for app
secrets.REDIS_URL_TEST                      # redis deb/index url for test
secrets.MONGO_URL                           # mongo main db url
secrets.MONGO_URL_TEST                      # mongo test db url
secrets.ACCESS_TOKEN_EXPIRY_TIME            # access token expiry time
secrets.REFRESH_TOKEN_EXPIRY_TIME           # refresh token expiry time
secrets.VERIFY_TOKEN_SECRET                 # verify token secret
secrets.VERIFY_TOKEN_EXPIRY_TIME            # verify token expiry time
secrets.CHANGE_PASSWORD_TOKEN_SECRET        # change password token secret
secrets.CHANGE_PASSWORD_TOKEN_EXPIRY_TIME   # change password token expiry time
secrets.PUBLIC_KEY                          # access and refresh token public key for
                                              ({algorithm: 'ES512' })
secrets.PRIVATE_KEY                         # access and refresh token private key for
                                              ({algorithm: 'ES512' })
```

## Deployment Process

### Using Docker Compose

The base `Dockerfile` is configured for GitHub Actions as all the environment variables are passed as build arguments from github repository secrets. Use the `Dockerfile` inside `docker-compose` directory.

`docker-compose.yaml` file pulls application image from docker hub. if you want to build and run image form locally you need to update the `docker-compose.yaml` file

the compose file will start redis, application and nginx inside same network and there are 4 instance of application which is load balanced inside nginx config. You will also need to update the `.env` file key `REDIS_URL` with docker container url.

MongoDB Atlas is used so just need to update the MONGO_URL key in .env

Now run docker compose up command

```
docker compose up -d
```

and to stop run this command

```
docker compose down
```

### Using Kubernetes

To deploy the application in kubernetes you need to go inside the `deployments` directory and inside there are two sub directory `dev` and `redis`. you need to configure `redis cluster` first inside the kubernetes cluster.

apply the redis config yaml files in kubernetes cluster in this order

```
kubectl apply -f redis-namespace.yaml
```

then go inside `using-development` directory and apply the configs in this order

```
# redis configMap config file
kubectl apply -f redis-configMap.yaml

# redis persistent volume claim config file
kubectl apply -f redis-pvc.yaml

# redis cluster master node deployment config file
kubectl apply -f redis-primary.yaml

# redis cluster master node service config file
kubectl apply -f redis-primary-svc.yaml

# redis cluster replica node deployment config file
kubectl apply -f redis-replica.yaml

# redis cluster replica node deployment config file
kubectl apply -f redis-replica-svc.yaml
```

After redis cluster is configured now you need to deploy the application configs files inside kubernetes cluster. Go inside `dev` directory and apply the configs in this order

```
kubectl apply -f dev-namespace.yaml

kubectl apply -f auth.yaml

kubectl apply -f auth-svc.yaml

kubectl apply -f auth-ingress.yaml
```

now you need to add the host name(`api.auth.com`) defined inside `auth-ingress.yaml` in your dns resolver. In case of local machine go to
`/etc/hosts` and add the host name as such

```
127.0.0.1   api.auth.com
```

**Note:** If you are using minikube for your kubernetes testing make sure to start minikube using this command

```
minikube start
```

and this auth-ingress exposes the port in host machine on `port 80`.
So if you have any servers running on port 80 stop them first and then run this command to access your application deployed in minikube kubernetes.

```
minikube tunnel
```

## Authentication and Authorization Flow

This application uses JWT authentication system. Pair of JWT (access and refresh) tokens are provided when successfully sign-up or sign-in. This application is specific for registered applications.
The concept is Client application who are willing to use this application need to register as an application first and then on successful registration `API_KEY` `API_SECRET` `APP_ID` is provided and client application needs to append these as custom header. The `API_SECRET` is provided for once and client applications should store them.

**Custom Headers:**

- X-APP-ID
- X-API-KEY
- X-API-SECRET
- X-APP-VERSION
- x-DEVICE-INFO

for security purpose to stop ddos attack and any malicious behavior there is an extra security check in `sign-up` `sign-in` and `forgot-password` routes as they are public. Client applications need to encrypt their device info json using `API_SECRET` key and [json-ed-aes](https://www.npmjs.com/package/@faizul-mustafiz/json-ed-aes) as encryption handler. This npm package takes a `json object` and `secret_key` then encrypts device info.
Now when a client application requests for sign-up/sign-in/forgot password needs to add one new header

- X-DEVICE-INFO
  Then server checks if the request is from a registered application and using `app_id` it gets the stored `api_secret` and decrypt the `device-info` if all goes well the request is passed to controller.

There are multi layers of middleware for authentication and authorization with custom validation middleware. After passing the middlewares injected on routes a request is passed to designated controller.

### Sing Up

For `sign-up` process user requests at `http://{host}:{port}/api/v1/auth/sign-up` this route with `custom headers`. Then client application will get a `verify_token` and `verify_code`. Using this verification code in body and token as `Authorization` header users will complete sign-up at route `http://{host}:{port}/api/v1/auth/verify`.
On completing sign-up a new user is created and provided with `accessToken` and `refreshToken`

### Sing In

Like `sign-up` process user requests at `http://{host}:{port}/api/v1/auth/sign-in` for `sign-in` process with `custom headers`. Then client application will get a `verify_token` and `verify_code`. Using this verification code in body and token as `Authorization` header users will complete sign-up at route `http://{host}:{port}/api/v1/auth/verify`.
On completing sign-up a new user is created and provided with `accessToken` and `refreshToken`

### Sign Out

There are two different routes for revoking accessToken and refreshToken. It is encouraged to `revoke-at` and `revoke-rt` for sign out but there is also a simpler version where only refresh-token is needed and revoked.

All the required fields, headers, schemas, response schemas are described inside swagger documentation.

## Forgot Password Flow

Just like sign-up and sign-in users request for forgot password at `http://{host}:{port}/api/v1/auth/forgot-password` this route. Here user is provided with change-password token and change-password code. then user request with the code and new-password inside request body and then token as Authorization header at `http://{host}:{port}/api/v1/auth/change-password`. Client applications need to add the custom headers for this rout as mentioned earlier.

## Client Application Creation

For now registering `client application` is only supported by admin and can be further modified for dynamic application creation.

## Conclusion

This application is a starting point for Express REST API's development with authentication, security and Error Handling out of the box with industry good practice and users can edit them as they develope and add new features. To put all things together in this boilerplate I have used my experience of developing REST API's and countless documents on every topic and good practices and many problems I faced in my development carrier.
