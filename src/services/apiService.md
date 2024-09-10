# API Service Documentation

## Overview

The `apiService.js` file is a core component of the Jira project, providing a simulated API service
for managing tasks, sprints, workflows, and other related data. It uses local storage to persist
data, making it suitable for frontend development and testing without a backend server.

This service includes methods for CRUD operations on tasks, sprints, and workflows, as well as
utility functions for managing statuses, searching tasks, logging time, and handling attachments.

## Key Components

### Constants

-   `STORAGE_KEY`: The key used for storing data in local storage.
-   `initialData`: Default data structure with sample tasks, sprints, statuses, and workflows.

### Helper Functions

-   `loadData()`: Retrieves data from local storage or returns initial data if not found.
-   `saveData(data)`: Saves the current data state to local storage.
-   `delay(ms)`: Simulates API latency by introducing a delay.

### ApiService Object

This object contains all the methods for interacting with the simulated API.

## Methods

### Task Management

#### `fetchBacklogTasks()`

-   **Description**: Retrieves all tasks that are not assigned to any sprint.
-   **Returns**: Promise<Array> - An array of task objects.
-   **Usage**:
    ```javascript
    const backlogTasks = await ApiService.fetchBacklogTasks();
    ```

#### `fetchTasks()`

-   **Description**: Retrieves all tasks.
-   **Returns**: Promise<Array> - An array of all task objects.
-   **Usage**:
    ```javascript
    const allTasks = await ApiService.fetchTasks();
    ```

#### `fetchTask(taskId)`

-   **Description**: Retrieves a specific task by its ID.
-   **Parameters**:
    -   `taskId` (string): The ID of the task to fetch.
-   **Returns**: Promise<Object> - The task object.
-   **Throws**: Error if the task is not found.
-   **Usage**:
    ```javascript
    const task = await ApiService.fetchTask('task-id-123');
    ```

#### `createTask(taskData)`

-   **Description**: Creates a new task.
-   **Parameters**:
    -   `taskData` (Object): The data for the new task.
-   **Returns**: Promise<Object> - The newly created task object.
-   **Usage**:
    ```javascript
    const newTask = await ApiService.createTask({
        title: 'New Task',
        description: 'Task description'
    });
    ```

#### `updateTask(taskId, updatedData)`

-   **Description**: Updates an existing task.
-   **Parameters**:
    -   `taskId` (string): The ID of the task to update.
    -   `updatedData` (Object): The updated task data.
-   **Returns**: Promise<Object> - The updated task object.
-   **Throws**: Error if the task is not found.
-   **Usage**:
    ```javascript
    const updatedTask = await ApiService.updateTask('task-id-123', { status: 'In Progress' });
    ```

#### `deleteTask(taskId)`

-   **Description**: Deletes a task.
-   **Parameters**:
    -   `taskId` (string): The ID of the task to delete.
-   **Returns**: Promise<boolean> - True if the task was successfully deleted.
-   **Throws**: Error if the task is not found.
-   **Usage**:
    ```javascript
    const isDeleted = await ApiService.deleteTask('task-id-123');
    ```

### Sprint Management

#### `getSprints()`

-   **Description**: Retrieves all sprints.
-   **Returns**: Promise<Array> - An array of sprint objects.
-   **Usage**:
    ```javascript
    const sprints = await ApiService.getSprints();
    ```

#### `createSprint(sprintData)`

-   **Description**: Creates a new sprint.
-   **Parameters**:
    -   `sprintData` (Object): The data for the new sprint.
-   **Returns**: Promise<Object> - The newly created sprint object.
-   **Usage**:
    ```javascript
    const newSprint = await ApiService.createSprint({
        name: 'Sprint 2',
        startDate: '2023-05-15',
        endDate: '2023-05-28'
    });
    ```

#### `updateSprint(sprintId, updatedData)`

-   **Description**: Updates an existing sprint.
-   **Parameters**:
    -   `sprintId` (string): The ID of the sprint to update.
    -   `updatedData` (Object): The updated sprint data.
-   **Returns**: Promise<Object> - The updated sprint object.
-   **Throws**: Error if the sprint is not found.
-   **Usage**:
    ```javascript
    const updatedSprint = await ApiService.updateSprint('sprint-id-123', { endDate: '2023-05-30' });
    ```

#### `deleteSprint(sprintId)`

-   **Description**: Deletes a sprint.
-   **Parameters**:
    -   `sprintId` (string): The ID of the sprint to delete.
-   **Returns**: Promise<boolean> - True if the sprint was successfully deleted.
-   **Throws**: Error if the sprint is not found.
-   **Usage**:
    ```javascript
    const isDeleted = await ApiService.deleteSprint('sprint-id-123');
    ```

### Status Management

#### `getStatuses()`

-   **Description**: Retrieves all available statuses.
-   **Returns**: Promise<Array> - An array of status strings.
-   **Usage**:
    ```javascript
    const statuses = await ApiService.getStatuses();
    ```

#### `updateStatuses(newStatuses)`

-   **Description**: Updates the list of available statuses.
-   **Parameters**:
    -   `newStatuses` (Array): The new list of status strings.
-   **Returns**: Promise<Array> - The updated list of statuses.
-   **Usage**:
    ```javascript
    const updatedStatuses = await ApiService.updateStatuses([
        'To Do',
        'In Progress',
        'Review',
        'Done'
    ]);
    ```

### Task and Sprint Interactions

#### `moveTask(taskId, newStatus)`

-   **Description**: Moves a task to a new status.
-   **Parameters**:
    -   `taskId` (string): The ID of the task to move.
    -   `newStatus` (string): The new status for the task.
-   **Returns**: Promise<Object> - The updated task object.
-   **Throws**: Error if the task is not found.
-   **Usage**:
    ```javascript
    const movedTask = await ApiService.moveTask('task-id-123', 'In Progress');
    ```

#### `addTaskToSprint(taskId, sprintId)`

-   **Description**: Adds a task to a sprint.
-   **Parameters**:
    -   `taskId` (string): The ID of the task to add.
    -   `sprintId` (string): The ID of the sprint to add the task to.
-   **Returns**: Promise<Object> - The updated sprint object.
-   **Throws**: Error if the task or sprint is not found.
-   **Usage**:
    ```javascript
    const updatedSprint = await ApiService.addTaskToSprint('task-id-123', 'sprint-id-456');
    ```

#### `removeTaskFromSprint(taskId, sprintId)`

-   **Description**: Removes a task from a sprint.
-   **Parameters**:
    -   `taskId` (string): The ID of the task to remove.
    -   `sprintId` (string): The ID of the sprint to remove the task from.
-   **Returns**: Promise<Object> - The updated sprint object.
-   **Throws**: Error if the task or sprint is not found.
-   **Usage**:
    ```javascript
    const updatedSprint = await ApiService.removeTaskFromSprint('task-id-123', 'sprint-id-456');
    ```

### Workflow Management

#### `getWorkflows()`

-   **Description**: Retrieves all workflows.
-   **Returns**: Promise<Array> - An array of workflow objects.
-   **Usage**:
    ```javascript
    const workflows = await ApiService.getWorkflows();
    ```

#### `createWorkflow(workflowData)`

-   **Description**: Creates a new workflow.
-   **Parameters**:
    -   `workflowData` (Object): The data for the new workflow.
-   **Returns**: Promise<Object> - The newly created workflow object.
-   **Usage**:
    ```javascript
    const newWorkflow = await ApiService.createWorkflow({
        name: 'Custom Workflow',
        statuses: ['New', 'Active', 'Resolved', 'Closed']
    });
    ```

#### `updateWorkflow(workflowId, updatedData)`

-   **Description**: Updates an existing workflow.
-   **Parameters**:
    -   `workflowId` (string): The ID of the workflow to update.
    -   `updatedData` (Object): The updated workflow data.
-   **Returns**: Promise<Object> - The updated workflow object.
-   **Throws**: Error if the workflow is not found.
-   **Usage**:
    ```javascript
    const updatedWorkflow = await ApiService.updateWorkflow('workflow-id-123', {
        name: 'Updated Workflow'
    });
    ```

#### `deleteWorkflow(workflowId)`

-   **Description**: Deletes a workflow.
-   **Parameters**:
    -   `workflowId` (string): The ID of the workflow to delete.
-   **Returns**: Promise<boolean> - True if the workflow was successfully deleted.
-   **Throws**: Error if the workflow is not found.
-   **Usage**:
    ```javascript
    const isDeleted = await ApiService.deleteWorkflow('workflow-id-123');
    ```

### Utility Functions

#### `searchTasks(query)`

-   **Description**: Searches for tasks based on a query string.
-   **Parameters**:
    -   `query` (string): The search query.
-   **Returns**: Promise<Array> - An array of matching task objects.
-   **Usage**:
    ```javascript
    const searchResults = await ApiService.searchTasks('user authentication');
    ```

#### `logTime(taskId, timeSpent)`

-   **Description**: Logs time spent on a task.
-   **Parameters**:
    -   `taskId` (string): The ID of the task.
    -   `timeSpent` (number): The amount of time spent in hours.
-   **Returns**: Promise<Object> - The updated task object.
-   **Throws**: Error if the task is not found.
-   **Usage**:
    ```javascript
    const updatedTask = await ApiService.logTime('task-id-123', 2.5);
    ```

#### `addAttachment(taskId, attachment)`

-   **Description**: Adds an attachment to a task.
-   **Parameters**:
    -   `taskId` (string): The ID of the task.
    -   `attachment` (Object): The attachment object to add.
-   **Returns**: Promise<Object> - The updated task object.
-   **Throws**: Error if the task is not found.
-   **Usage**:
    ```javascript
    const updatedTask = await ApiService.addAttachment('task-id-123', {
        id: 'att-1',
        name: 'document.pdf',
        url: 'https://example.com/document.pdf'
    });
    ```

#### `removeAttachment(taskId, attachmentId)`

-   **Description**: Removes an attachment from a task.
-   **Parameters**:
    -   `taskId` (string): The ID of the task.
    -   `attachmentId` (string): The ID of the attachment to remove.
-   **Returns**: Promise<Object> - The updated task object.
-   **Throws**: Error if the task or attachment is not found.
-   **Usage**:
    ```javascript
    const updatedTask = await ApiService.removeAttachment('task-id-123', 'att-1');
    ```

#### `clearToken()`

-   **Description**: Clears the authentication token from local storage.
-   **Usage**:
    ```javascript
    ApiService.clearToken();
    ```

## Project Integration

This `apiService.js` file is located in the `src/services` directory and serves as the main
interface for data management in the Jira project. It is used by various components throughout the
application to fetch, create, update, and delete data related to tasks, sprints, and workflows.

The service simulates a backend API by using local storage, which allows for easy frontend
development and testing without the need for a real backend server. This approach makes the project
more portable and easier to set up for development purposes.

When integrating this service into the project, components can import and use the specific methods
they need. For example, the `Backlog.js` component might use `fetchBacklogTasks()` to display tasks
not assigned to any sprint, while the `SprintBoard.js` component could use `getSprints()` and
`fetchTasks()` to populate the sprint board with relevant tasks.

The `AuthContext.js` file in the `src/context` directory might use the `clearToken()` method when
handling user logout functionality.

By centralizing all API calls in this service, the project maintains a clean separation of concerns
and makes it easier to switch to a real backend API in the future by updating only this file.
