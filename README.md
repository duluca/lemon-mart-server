# LemonMart Server <img src="https://user-images.githubusercontent.com/822159/76695774-8f44e180-6659-11ea-9dea-23cd61fbd2f4.png" alt="LemonMart Server" width="36"/>

> Easy to learn and use TypeScript Node.js server using [Minimal MEAN](https://github.com/duluca/minimal-mean) for [Lemon Mart](https://github.com/duluca/lemon-mart)

[![CircleCI](https://circleci.com/gh/duluca/lemon-mart-server/tree/master.svg?style=svg)](https://circleci.com/gh/duluca/lemon-mart-server/tree/master)
[![DeepScan grade](https://deepscan.io/api/teams/1906/projects/7949/branches/88772/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=1906&pid=7949&bid=88772)
[![Coverage Status](https://coveralls.io/repos/github/duluca/lemon-mart-server/badge.svg?branch=master)](https://coveralls.io/github/duluca/lemon-mart-server?branch=master)

**Watch the video:** [Do More with Less: Full Stack TypeScript](https://youtu.be/gi1neXh0uKE?list=PLtevgo7IoQizTQdXtRKEXGguTQbL0F01_)

**Get the book:** Lemon Mart Server is covered in my book _Angular for Enterprise-Ready Web Applications_. You can get it on https://AngularForEnterprise.com.

## Setup

- Install [Node.js](https://nodejs.org/en/) v8.3+
- Recommended Editor/IDE: [Visual Studio Code](https://code.visualstudio.com/)
- For a **magical** development experience download these VS Code Extensions:
  - Configure my preferred [extentions.json](https://gist.github.com/duluca/6bbd3c687beb6c84cb475fdf3eaa06f0#file-extensions-json) and [settings.json](https://gist.github.com/duluca/6bbd3c687beb6c84cb475fdf3eaa06f0#file-settings-json) files.
- `npm install`
- This will kick off a script, which will run `npm install` on all child folders.
- Run `npm run init:env` to configure your environment variables in `.env` files

### Manually Setup Environment Variables

> Skip over this if you ran the automated command

- Define a `.env` file at the root of the project and set the MongoDB admin passowrd. Do NOT commit this file.

```Bash
MONGODB_ADMIN_PASS=your_password_goes_here
MONGODB_APPLICATION_DATABASE=app_db_name
MONGODB_APPLICATION_USER=app_user
MONGODB_APPLICATION_PASS=app_password
MONGO_URI=uri_to_mongodb
```

- See more details about the MongoDB Docker container at [excellalabs/mongo](https://github.com/excellalabs/mongo-docker) which also contains instructions on how to set things up on AWS ECS.

  > In your server application use the application information to connect to the database.
  > Sample connection URI: `mongodb://app_user:app_password@localhost:27017/app_db_name?readPreference=primary`

- Sample `.env` file. **Note:** In configuring the `MONGO_URI`, instead of localhost or an IP address, you must specify `database` which is the name of the container as defined in `docker-compose.yml` file.

```Bash
MONGODB_ADMIN_PASS=admin
MONGODB_APPLICATION_DATABASE=acme
MONGODB_APPLICATION_USER=john.smith
MONGODB_APPLICATION_PASS=g00fy
MONGO_URI=mongodb://john.smith:g00fy@database/acme
```

- You need a seperate `.env` file under Server for development purposses. **Note:** We specify localhost, not the docker-compose name here.

```Bash
MONGO_URI=mongodb://john.smith:g00fy@localhost:27017/acme
```

## Run

- From the root directory run `npm start`
  - This will kick off `docker-compose up` which will build and configure your web app, server and database.
  - Angular Web App: http://localhost:8080
  - Server: http://localhost:3000
  - Database: http://localhost:27017
- Run `npm stop` or `npm clean` to stop or clean Docker's cache.

## Development

- For development purposes run each service individually
  - Angular Web App: `cd web-app` then `npm start` -- which utilizes `ng serve` and will give you livereload. To debug use Augury
  - Server: `cd server` then `npm start` or use the debugger within VS Code (debug configuration is already included)
  - Database: `npm start:database` from the root

## Architecture

- web-app: This folder contains the client side Angular app, configured using [Angular CLI](https://github.com/angular/angular-cli) along with its own individual Node.js server
- server: This folder contains the server side Node.js app that can be used to serve REST APIs and it is capable of connecting to MongoDB
- [document-ts](https://github.com/duluca/documentts): The library to connect and query Mongo in an async, flexible and convenient manner
- [duluca/minimal-mongo](https://hub.docker.com/r/duluca/minimal-mongo): A fully-featured Mongo image (with Auth and SSL) inherited from the official image.

## Continuous Integration and Hosting

- CI is implemented on CircleCI [![CircleCI](https://circleci.com/gh/duluca/lemon-mart-server/tree/master.svg?style=svg)](https://circleci.com/gh/duluca/lemon-mart-server/tree/master)
- Hosted on AWS ECS
  - You'll need to individually publish your Docker containers to ECS
  - Then update `docker-compose.aws.yml` to pull from the ECS repository
  - Run `npm run publish:aws` on the root folder to create the task definition
  - You'll need to create a new service and attach this task definition to it
  - See the [Step-by-Step AWS ECS Guide](https://gist.github.com/duluca/ebcf98923f733a1fdb6682f111b1a832#file-step-by-step-how-to-for-aws-ecs-md) on how to create container repositories, and attaching a task definition to a service [here](https://gist.github.com/duluca/ebcf98923f733a1fdb6682f111b1a832#file-step-by-step-how-to-for-aws-ecs-md).
  - See the [Configuring AWS ECS to have access to AWS EFS Guide](https://gist.github.com/duluca/ebcf98923f733a1fdb6682f111b1a832#file-awc-ecs-access-to-aws-efs-md) to persist data using MongoDB [here](https://gist.github.com/duluca/ebcf98923f733a1fdb6682f111b1a832#file-awc-ecs-access-to-aws-efs-md).
