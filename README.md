# Dev Blog API - NestJS

## Description

DevBlog is a simple CMS to manage users, articles and tags, this project is built with NestJS.

#### Database Schema
![](https://raw.githubusercontent.com/michaelcardoza/dev-blog-api-nestjs/main/.docs/diagram-db.png)

## Installation

```bash
$ npm install
```

## Running the app

Duplicate `.env.example` and rename it to `.env`

```bash
# Create the database with Docker
$ docker compose up -d

# Run migrations and seeders
$ npm run migrations:run
$ npm run seed:run

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Stay in touch

- Author - [Michael Cardoza](https://github.com/michaelcardoza)
- Linkedin - [@michaelcardozam](https://www.linkedin.com/in/michaelcardozam/)
