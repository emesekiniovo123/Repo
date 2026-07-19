<<<<<<< HEAD
# Book Review API

A RESTful API built with Node.js and Express.js.

## Features

- View all books
- Search books by ISBN
- Search books by author
- Search books by title
- View reviews
- Register users
- Login with JWT
- Session support
- Add reviews
- Update own reviews
- Delete own reviews

## Installation

```bash
npm install
```

## Start the server

```bash
npm start
```

The server runs on:

```
http://localhost:5000
```

## API Endpoints

### Public

GET /books

GET /books/isbn/:isbn

GET /books/author/:author

GET /books/title/:title

GET /books/review/:isbn

POST /register

POST /login

### Protected

POST /auth/review/:isbn

PUT /auth/review/:isbn

DELETE /auth/review/:isbn



=======
# Repo
my project
>>>>>>> b3e93c0439889ff7ce76e42e76a4052443e6c728
