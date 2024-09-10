# Project Model Documentation

## Overview

This file (`server/model/Project.js`) defines the Mongoose schema and model for the Project entity in the application. It's a crucial part of the server-side data model, representing projects within the project management system.

The Project model includes various fields such as name, description, owner, members, sprints, backlog, and workflow. It also provides several methods for managing project data and relationships.

## Schema Definition

```javascript
const projectSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    sprints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sprint' }],
    backlog: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    workflow: { type: mongoose.Schema.Types.ObjectId, ref: 'Workflow' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
```

## Methods

### Pre-save Hook

```javascript
projectSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});
```

Updates the `updatedAt` field before saving the document.

### Instance Methods

#### addMember(userId)
- **Description**: Adds a user to the project's members list.
- **Parameters**: `userId` (ObjectId) - The ID of the user to add.
- **Returns**: Promise resolving to the updated project document.

#### removeMember(userId)
- **Description**: Removes a user from the project's members list.
- **Parameters**: `userId` (ObjectId) - The ID of the user to remove.
- **Returns**: Promise resolving to the updated project document.

#### addSprint(sprintId)
- **Description**: Adds a sprint to the project's sprints list.
- **Parameters**: `sprintId` (ObjectId) - The ID of the sprint to add.
- **Returns**: Promise resolving to the updated project document.

#### removeSprint(sprintId)
- **Description**: Removes a sprint from the project's sprints list.
- **Parameters**: `sprintId` (ObjectId) - The ID of the sprint to remove.
- **Returns**: Promise resolving to the updated project document.

#### addTaskToBacklog(taskId)
- **Description**: Adds a task to the project's backlog.
- **Parameters**: `taskId` (ObjectId) - The ID of the task to add.
- **Returns**: Promise resolving to the updated project document.

#### removeTaskFromBacklog(taskId)
- **Description**: Removes a task from the project's backlog.
- **Parameters**: `taskId` (ObjectId) - The ID of the task to remove.
- **Returns**: Promise resolving to the updated project document.

#### setWorkflow(workflowId)
- **Description**: Sets the project's workflow.
- **Parameters**: `workflowId` (ObjectId) - The ID of the workflow to set.
- **Returns**: Promise resolving to the updated project document.

### Static Methods

#### findByMember(userId)
- **Description**: Finds all projects that a user is a member of.
- **Parameters**: `userId` (ObjectId) - The ID of the user.
- **Returns**: Promise resolving to an array of project documents.

#### findByOwner(ownerId)
- **Description**: Finds all projects owned by a specific user.
- **Parameters**: `ownerId` (ObjectId) - The ID of the owner.
- **Returns**: Promise resolving to an array of project documents.

## Usage Examples

```javascript
// Create a new project
const newProject = new Project({
    name: 'My New Project',
    description: 'This is a sample project',
    owner: userId
});
await newProject.save();

// Add a member to the project
await newProject.addMember(memberId);

// Remove a member from the project
await newProject.removeMember(memberId);

// Add a sprint to the project
await newProject.addSprint(sprintId);

// Find projects by member
const memberProjects = await Project.findByMember(userId);

// Find projects by owner
const ownedProjects = await Project.findByOwner(ownerId);
```

## Role in the Project

This Project model is a core component of the server-side architecture. It interacts with other models like User, Sprint, Task, and Workflow to create a comprehensive project management system. The model is likely used in various API endpoints for creating, updating, and querying project data.

In the overall project structure, this file is part of the `server/model` directory, indicating its role in defining the data model for the backend server. It works in conjunction with other model files in the same directory to create a cohesive data structure for the application.