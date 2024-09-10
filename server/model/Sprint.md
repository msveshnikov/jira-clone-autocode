# Sprint Model Documentation

## Overview

This file (`Sprint.js`) defines the MongoDB schema and model for the Sprint entity in the project
management application. It's located in the `server/model` directory, indicating it's part of the
server-side data model.

The Sprint model represents a time-boxed iteration in an Agile project management framework. It
includes properties such as name, start and end dates, associated tasks, project reference, status,
and goal. The model also provides various methods for managing tasks, calculating progress, and
transitioning sprint states.

## Schema Definition

```javascript
const sprintSchema = new mongoose.Schema({
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    status: {
        type: String,
        enum: ['planning', 'active', 'completed'],
        default: 'planning'
    },
    goal: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
```

## Middleware

### Pre-save Hook

```javascript
sprintSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});
```

This middleware updates the `updatedAt` field before saving the document.

## Instance Methods

### addTask(taskId)

Adds a task to the sprint if it's not already included.

-   Parameters: `taskId` (ObjectId)
-   Returns: Promise (saved sprint document)

### removeTask(taskId)

Removes a task from the sprint.

-   Parameters: `taskId` (ObjectId)
-   Returns: Promise (saved sprint document)

### getTaskCount()

Returns the number of tasks in the sprint.

-   Returns: Number

### getTotalPoints()

Calculates the total points of all tasks in the sprint.

-   Returns: Promise (Number)

### getCompletedTaskCount()

Counts the number of completed tasks in the sprint.

-   Returns: Promise (Number)

### getProgress()

Calculates the progress percentage of the sprint.

-   Returns: Promise (Number) - Percentage of completed tasks

### start()

Transitions the sprint from 'planning' to 'active' status.

-   Throws: Error if the sprint is not in 'planning' status
-   Returns: Promise (saved sprint document)

### complete()

Transitions the sprint from 'active' to 'completed' status.

-   Throws: Error if the sprint is not in 'active' status
-   Returns: Promise (saved sprint document)

## Static Methods

### getActiveSprint(projectId)

Finds the active sprint for a given project.

-   Parameters: `projectId` (ObjectId)
-   Returns: Promise (Sprint document or null)

### getUpcomingSprints(projectId)

Retrieves all planned sprints for a project, sorted by start date.

-   Parameters: `projectId` (ObjectId)
-   Returns: Promise (Array of Sprint documents)

### getCompletedSprints(projectId)

Retrieves all completed sprints for a project, sorted by end date (descending).

-   Parameters: `projectId` (ObjectId)
-   Returns: Promise (Array of Sprint documents)

## Usage Examples

```javascript
// Create a new sprint
const newSprint = new Sprint({
    name: 'Sprint 1',
    startDate: new Date('2023-06-01'),
    endDate: new Date('2023-06-14'),
    project: projectId,
    goal: 'Implement user authentication'
});
await newSprint.save();

// Add a task to the sprint
await newSprint.addTask(taskId);

// Start the sprint
await newSprint.start();

// Get sprint progress
const progress = await newSprint.getProgress();

// Complete the sprint
await newSprint.complete();

// Get active sprint for a project
const activeSprint = await Sprint.getActiveSprint(projectId);

// Get upcoming sprints for a project
const upcomingSprints = await Sprint.getUpcomingSprints(projectId);
```

## Role in the Project

The Sprint model is a crucial part of the project management application. It interacts with other
models like Task and Project to organize work into time-boxed iterations. This model would be used
by the server-side logic (likely in route handlers or controllers) to manage sprint-related
operations and provide data to the front-end components like `SprintBoard.js`.
