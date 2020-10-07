# Remind Clone Web Server

## Start development server

```sh
npm run dev
```

## Start development server (debugging)

This script prints out every error message possible in the application to ease the debugging process. It also automatically restarts the server after a file save. 

```sh
npm run debug
```

## Building the database in local MySQL Server

1. Create `remind_clone` database in your local MySQL Server by running `CREATE DATABASE remind_clone;`.

2. Create an `.env` file from the given `.env.example` file to configure MySQL Server connection. For example:

```
DATABASE_NAME=remind_clone
DATABASE_PASSWORD=password
DATABASE_HOST=localhost
DATABASE_USERNAME=root
```

3. Execute this command `npm run migrate:up`. This will run the latest migration files found in `/databases/migrations`.

## Add placeholder data

```sh
npm run seed:run
```
