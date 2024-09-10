# Task Model Documentation

## Overview

This file (`server/model/Task.js`) defines the Mongoose schema and model for tasks in the project
management application. It's part of the server-side codebase and is crucial for handling
task-related operations in the database.

The Task model represents individual tasks within projects and sprints, containing various
properties such as title, description, status, assignee, and more. It also includes methods for task
manipulation and static methods for querying tasks.

## Schema Definition

The `taskSchema` defines the structure of a task document in the MongoDB database:

-   `title`: String (required, trimmed)
-   `description`: String (trimmed)
-   `points`: Number (default: 0)
-   `priority`: String (enum: 'low', 'medium', 'high', default: 'medium')
-   `status`: String (enum: 'todo', 'inprogress', 'codereview', 'readytotest', 'qa', 'done',
    default: 'todo')
-   `timeSpent`: Number (default: 0)
-   `attachments`: Array of objects (name: String, url: String)
-   `comments`: Array of objects (text: String, author: ObjectId reference to User, createdAt: Date)
-   `assignedTo`: ObjectId (reference to User)
-   `project`: ObjectId (reference to Project)
-   `sprint`: ObjectId (reference to Sprint)
-   `order`: Number (default: 0)
-   `dueDate`: Date
-   `createdAt`: Date (default: current date)
-   `updatedAt`: Date (default: current date)

## Methods

### Pre-save Hook

```javascript
taskSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});
```

This hook updates the `updatedAt` field before saving the document.

### Instance Methods

1. `addComment(text, author)`

    - Adds a new comment to the task
    - Parameters:
        - `text`: String (comment content)
        - `author`: ObjectId (reference to User)
    - Returns: Promise (saved task)

2. `addAttachment(name, url)`

    - Adds a new attachment to the task
    - Parameters:
        - `name`: String (attachment name)
        - `url`: String (attachment URL)
    - Returns: Promise (saved task)

3. `updateStatus(newStatus)`

    - Updates the task's status
    - Parameters:
        - `newStatus`: String (new status value)
    - Returns: Promise (saved task)

4. `assignTo(userId)`

    - Assigns the task to a user
    - Parameters:
        - `userId`: ObjectId (reference to User)
    - Returns: Promise (saved task)

5. `logTime(time)`

    - Logs time spent on the task
    - Parameters:
        - `time`: Number (time to add)
    - Returns: Promise (saved task)

6. `updateOrder(newOrder)`
    - Updates the task's order
    - Parameters:
        - `newOrder`: Number (new order value)
    - Returns: Promise (saved task)

### Static Methods

1. `findByProject(projectId)`

    - Finds tasks by project ID
    - Parameters:
        - `projectId`: ObjectId
    - Returns: Promise (array of tasks sorted by order)

2. `findBySprint(sprintId)`

    - Finds tasks by sprint ID
    - Parameters:
        - `sprintId`: ObjectId
    - Returns: Promise (array of tasks sorted by order)

3. `findByStatus(status)`

    - Finds tasks by status
    - Parameters:
        - `status`: String
    - Returns: Promise (array of tasks sorted by order)

4. `findByAssignee(userId)`
    - Finds tasks assigned to a specific user
    - Parameters:
        - `userId`: ObjectId
    - Returns: Promise (array of tasks sorted by order)

## Usage Examples

```javascript
// Create a new task
const newTask = new Task({
    title: 'Implement user authentication',
    description: 'Set up JWT-based authentication for the API',
    priority: 'high',
    project: projectId
});
await newTask.save();

// Add a comment to a task
await task.addComment('This looks good!', userId);

// Update task status
await task.updateStatus('inprogress');

// Find tasks for a specific project
const projectTasks = await Task.findByProject(projectId);

// Find tasks assigned to a user
const userTasks = await Task.findByAssignee(userId);
```

## Integration with Other Models

The Task model references other models in the application:

-   `User`: for task assignment and comment authorship
-   `Project`: to associate tasks with projects
-   `Sprint`: to associate tasks with sprints

These relationships allow for complex queries and data relationships within the application.
