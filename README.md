# Task Manager API

This project is the backend of a Task Manager application built with Node.js, Express, and PostgreSQL.
It provides user authentication using JWT, secure password storage with bcrypt, and a complete CRUD
for tasks associated with each authenticated user.

The main goal of this project is to consolidate backend concepts such as authentication,
authorization, relational database modeling, and layered architecture.

# Backend

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
  status TEXT NOT NULL DEFAULT 'todo',
  created_at TIMESTAMP DEFAULT now(),
  CONSTRAINT tasks_user_fk
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT tasks_status_check
    CHECK (status IN ('todo', 'in_progress', 'done'))
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

Body (update title):
{
  "title": "New title"
}

Body (update status):
{
  "status": "in_progress"
}

- todo
- in_progress
- done

Delete task:

DELETE /tasks/:id

**Testing**

All routes can be tested using Postman or Insomnia by sending the JWT token
in the Authorization header using the Bearer Token format.

**Notes**

- Users cannot access or modify tasks belonging to other users
- User deletion is not implemented (MVP scope)

# Frontend

Frontend of the Task Manager application built with React and Vite.  
This project is responsible for the entire user interface, JWT-based authentication flow, consumption of the backend REST API, and task management for the authenticated user.

The frontend depends on an external backend API and does not function independently without it.

The application provides a complete task management experience, including authentication, task creation and editing, multiple task states, filtering, and a light/dark theme with persistence.

Main features:
- User registration
- User login with JWT authentication
- Protected routes for authenticated users
- Task creation
- Task listing per authenticated user
- Inline task title editing
- Task status management with three states: pending, in progress, and completed
- Task deletion
- Task filtering by status
- Light and dark theme toggle with persistence in local storage
- Visual feedback for asynchronous actions
- Automatic logout on invalid or expired token

Technologies used:
- React
- Vite
- React Router DOM

Requirements:
- Node.js version 18 or higher
- Backend application running and accessible via URL

Environment configuration:
The frontend requires the backend API base URL to be defined.  
Create a `.env` file in the root of the `frontend` folder with the following content:

VITE_API_URL=http://localhost:3000

Dependency installation:
Inside the `frontend` directory, install dependencies with:

npm install

Running the project in development mode:
With the backend already running, start the frontend with:

npm run dev

By default, the application will be available at:
http://localhost:5173

Authentication flow:
After a successful login, the JWT token returned by the backend is stored locally in the browser.  
This token is automatically sent with protected requests.  
If the backend responds with an authorization error, the user is logged out and redirected to the login page.

Important notes:
- This frontend fully depends on the backend to function correctly
- The backend must allow CORS requests from the frontend domain
- The `.env` file must not be committed to the repository
- The project was developed with a focus on clean architecture, good practices, and a clear user flow