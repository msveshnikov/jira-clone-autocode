# Server Documentation

## Overview

This file (`server.js`) is the main entry point for the backend server of the JIRA-like project
management application. It sets up an Express.js server, connects to a MongoDB database, and defines
various API endpoints for managing tasks, sprints, projects, users, statuses, and workflows.

## Dependencies

-   express: Web application framework
-   mongoose: MongoDB object modeling tool
-   cors: Cross-Origin Resource Sharing middleware
-   dotenv: Loads environment variables from a .env file
-   helmet: Helps secure Express apps with various HTTP headers
-   morgan: HTTP request logger middleware
-   url: For URL resolution and parsing
-   path: Utilities for working with file and directory paths
-   fs: File system module

## Models

The server uses the following MongoDB models:

-   User
-   Project
-   Sprint
-   Task
-   Status
-   Workflow

## Configuration

1. The server uses environment variables loaded from a `.env` file.
2. CORS is configured to allow specific origins.
3. Express middleware is set up for JSON parsing, security (helmet), and logging (morgan).
4. MongoDB connection is established using the `MONGODB_URI` environment variable.

## Initial Data Loading

The `loadInitialData` function loads initial data from `initial_data.json` into the database if the
database is empty.

## API Endpoints

### Tasks

-   GET `/tasks`: Retrieve all tasks
-   GET `/tasks/:id`: Retrieve a specific task
-   POST `/tasks`: Create a new task
-   PUT `/tasks/:id`: Update a specific task
-   DELETE `/tasks/:id`: Delete a specific task

### Sprints

-   GET `/sprints`: Retrieve all sprints
-   POST `/sprints`: Create a new sprint
-   PUT `/sprints/:id`: Update a specific sprint
-   DELETE `/sprints/:id`: Delete a specific sprint

### Projects

-   GET `/projects`: Retrieve all projects
-   POST `/projects`: Create a new project
-   PUT `/projects/:id`: Update a specific project
-   DELETE `/projects/:id`: Delete a specific project

### Users

-   GET `/users`: Retrieve all users
-   POST `/users`: Create a new user
-   PUT `/users/:id`: Update a specific user
-   DELETE `/users/:id`: Delete a specific user

### Statuses

-   GET `/statuses`: Retrieve all statuses

### Workflows

-   GET `/workflows`: Retrieve all workflows

## Error Handling

Each endpoint includes basic error handling, returning appropriate HTTP status codes and error
messages.

## Usage Examples

### Creating a new task

```javascript
fetch('http://localhost:5000/tasks', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        title: 'New Task',
        description: 'Task description',
        status: 'To Do',
        assignee: 'user_id'
    })
})
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error('Error:', error));
```

### Retrieving all projects

```javascript
fetch('http://localhost:5000/projects')
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error('Error:', error));
```

## Project Structure Context

This `server.js` file is located in the `server` directory of the project. It interacts with the
MongoDB models defined in the `model` subdirectory and uses the `initial_data.json` file for seeding
the database. The server is designed to work with the React frontend located in the `src` directory,
providing the necessary API endpoints for the application's functionality.

## Running the Server

To start the server, run:

```bash
node server/server.js
```

The server will start on the port specified in the `PORT` environment variable or default to
port 5000.
