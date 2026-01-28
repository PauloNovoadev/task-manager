# Task Manager API

This project is the backend of a Task Manager application built with Node.js, Express, and PostgreSQL.
It provides user authentication using JWT, secure password storage with bcrypt, and a complete CRUD
for tasks associated with each authenticated user.

The main goal of this project is to consolidate backend concepts such as authentication,
authorization, relational database modeling, and layered architecture.

**Features**

- User registration
- User login with JWT authentication
- Secure password hashing with bcrypt
- Protected routes using authentication middleware
- Full CRUD for tasks
- Each user can access only their own tasks

**Technologies**

- Node.js
- Express
- PostgreSQL
- JSON Web Token (JWT)
- bcrypt
- pg (node-postgres)

**Requirements**

- Node.js (version 18 or higher recommended)
- PostgreSQL running locally

**Environment Configuration**

Create a `.env` file inside the `backend` folder with the following variables:

NODE_ENV=development  
PORT=3000  

DB_HOST=localhost  
DB_PORT=5432  
DB_USER=postgres  
DB_PASSWORD=your_password  
DB_NAME=task_manager  

JWT_SECRET=your_jwt_secret  
JWT_EXPIRES_IN=1h  

**Database Structure**

Users table:

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

Tasks table:

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  CONSTRAINT tasks_user_fk
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

**Installation**

Inside the `backend` folder, install the dependencies:

npm install

**Running the Project**

Start the backend server with:

node src/server.js

The server will be available at:

http://localhost:3000

**Authentication**

User registration:

POST /auth/register

Body:
{
  "email": "user@email.com",
  "password": "123456"
}

User login:

POST /auth/login

Body:
{
  "email": "user@email.com",
  "password": "123456"
}

Response:
{
  "message": "login successful",
  "token": "JWT_TOKEN"
}

The returned token must be sent in protected routes using the header:

Authorization: Bearer JWT_TOKEN

**Protected Routes**

User profile:

GET /profile

**Task Management**

Create task:

POST /tasks

Body:
{
  "title": "My first task"
}

List tasks:

GET /tasks

Update task:

PUT /tasks/:id

Body:
{
  "completed": true
}

or

{
  "title": "New title"
}

Delete task:

DELETE /tasks/:id

**Testing**

All routes can be tested using Postman or Insomnia by sending the JWT token
in the Authorization header using the Bearer Token format.

**Notes**

- Users cannot access or modify tasks belonging to other users
- User deletion is not implemented (MVP scope)
- This project focuses on backend development and future integration with a React frontend
