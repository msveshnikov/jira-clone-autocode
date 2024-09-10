# Workflow Model Documentation

## Overview

This file (`server/model/Workflow.js`) defines the Mongoose schema and model for the Workflow entity
in the project. It's part of the server-side data model, likely used in a task management or project
tracking application.

The Workflow model represents a series of statuses that tasks or projects can progress through. It's
an essential component for organizing and tracking the progress of work items within the system.

## Schema Definition

```javascript
const workflowSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    statuses: [
        {
            type: String,
            required: true
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
```

### Fields

-   `name`: A unique string identifier for the workflow.
-   `statuses`: An array of strings representing the different stages or states in the workflow.
-   `createdAt`: A timestamp of when the workflow was created.
-   `updatedAt`: A timestamp of when the workflow was last updated.

## Middleware

### Pre-save Hook

```javascript
workflowSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});
```

This middleware updates the `updatedAt` field with the current timestamp before saving a document.

### Pre-findOneAndUpdate Hook

```javascript
workflowSchema.pre('findOneAndUpdate', function (next) {
    this.set({ updatedAt: Date.now() });
    next();
});
```

This middleware updates the `updatedAt` field with the current timestamp when using the
`findOneAndUpdate` method.

## Model Creation

```javascript
const Workflow = mongoose.model('Workflow', workflowSchema);
```

Creates and exports the Mongoose model for Workflow.

## Usage

To use this model in other parts of the application:

```javascript
import Workflow from '../model/Workflow.js';

// Create a new workflow
const newWorkflow = new Workflow({
    name: 'Software Development',
    statuses: ['Backlog', 'In Progress', 'Review', 'Done']
});

// Save the workflow
await newWorkflow.save();

// Find a workflow
const workflow = await Workflow.findOne({ name: 'Software Development' });

// Update a workflow
await Workflow.findOneAndUpdate(
    { name: 'Software Development' },
    { $push: { statuses: 'Testing' } }
);
```

## Role in the Project

This Workflow model is likely used in conjunction with other models like `Task`, `Sprint`, and
`Project`. It provides a flexible way to define and manage different workflows that can be
associated with tasks or projects in the system.

The model allows the application to:

1. Define custom workflows for different types of projects or teams.
2. Track the progress of tasks through predefined stages.
3. Maintain a history of workflow changes through the `createdAt` and `updatedAt` fields.

It plays a crucial role in the server-side logic, potentially interacting with API endpoints that
manage workflows and integrate with the front-end components like `SprintBoard.js` or `TaskCard.js`
to display and update task statuses based on the defined workflows.
