# Status Model Documentation

## Overview

This file (`server/model/Status.js`) defines the Mongoose schema and model for the Status entity in the project management application. The Status model represents different states or stages that tasks can be in within a workflow or project.

## Schema Definition

The `statusSchema` is defined with the following fields:

- `name`: String (required, unique, trimmed)
- `description`: String (trimmed)
- `color`: String (default: '#000000')
- `order`: Number (default: 0)
- `isDefault`: Boolean (default: false)
- `createdAt`: Date (default: current date/time)
- `updatedAt`: Date (default: current date/time)

### Fields Description

- `name`: The unique identifier for the status (e.g., "To Do", "In Progress", "Done").
- `description`: An optional description of the status.
- `color`: A hexadecimal color code to visually represent the status.
- `order`: A number to determine the display order of statuses.
- `isDefault`: Indicates if this status is the default one for new tasks.
- `createdAt`: Timestamp of when the status was created.
- `updatedAt`: Timestamp of when the status was last updated.

## Pre-save Hook

A pre-save hook is defined to automatically update the `updatedAt` field with the current date/time before saving the document:

```javascript
statusSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});
```

## Model Creation

The Mongoose model `Status` is created from the `statusSchema`:

```javascript
const Status = mongoose.model('Status', statusSchema);
```

## Usage

To use the Status model in other parts of the application:

1. Import the model:

```javascript
import Status from '../model/Status.js';
```

2. Create a new status:

```javascript
const newStatus = new Status({
    name: 'In Review',
    description: 'Tasks that are being reviewed',
    color: '#FFA500',
    order: 2
});

await newStatus.save();
```

3. Query statuses:

```javascript
const allStatuses = await Status.find();
const defaultStatus = await Status.findOne({ isDefault: true });
```

4. Update a status:

```javascript
await Status.updateOne({ name: 'In Review' }, { color: '#FF4500' });
```

5. Delete a status:

```javascript
await Status.deleteOne({ name: 'Obsolete Status' });
```

## Role in the Project

The Status model is a crucial part of the project management system. It is used in conjunction with other models like `Task`, `Sprint`, and `Workflow` to define and manage the states of tasks throughout the project lifecycle. The Status entities created from this model will be used to categorize and visualize tasks in components like `SprintBoard` and `Backlog`.

## Related Files

- `server/model/Task.js`: Likely references the Status model to assign statuses to tasks.
- `server/model/Workflow.js`: May use the Status model to define sequences of statuses in a workflow.
- `src/components/SprintBoard.js`: Probably uses Status data to organize and display tasks.
- `src/components/TaskCard.js`: Might display the status of a task using data from this model.

By providing a flexible and customizable Status model, the application allows for tailored project management workflows that can adapt to various team needs and methodologies.