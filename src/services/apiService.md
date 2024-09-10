# API Service Documentation

## Overview

The `apiService.js` file is a crucial part of the project's frontend, located in the `src/services`
directory. It provides a centralized service for making HTTP requests to the backend API. This
service utilizes Axios for HTTP communication and includes error handling, authentication token
management, and various API endpoint functions.

## Key Features

-   Axios instance configuration with base URL and default headers
-   Automatic token inclusion in request headers
-   Centralized error handling
-   API functions for tasks, sprints, statuses, workflows, and more

## Configuration

```javascript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const apiService = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});
```

The `apiService` is configured with a base URL (defaulting to `http://localhost:5000` if not
specified in environment variables) and default headers.

## Authentication

```javascript
apiService.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

This interceptor automatically includes the authentication token in the request headers if available
in local storage.

## Error Handling

```javascript
const handleApiError = (error) => {
    // ... error handling logic
};
```

The `handleApiError` function provides centralized error handling for all API requests, logging
errors and throwing appropriate exceptions.

## API Functions

### Tasks

#### `fetchBacklogTasks()`

-   **Description**: Fetches all backlog tasks
-   **Returns**: Array of task objects
-   **Usage**: `const backlogTasks = await fetchBacklogTasks();`

#### `fetchTasks()`

-   **Description**: Fetches all tasks
-   **Returns**: Array of task objects
-   **Usage**: `const tasks = await fetchTasks();`

#### `fetchTask(taskId)`

-   **Description**: Fetches a specific task by ID
-   **Parameters**: `taskId` (string/number) - The ID of the task
-   **Returns**: Task object
-   **Usage**: `const task = await fetchTask('123');`

#### `createTask(taskData)`

-   **Description**: Creates a new task
-   **Parameters**: `taskData` (object) - The task data
-   **Returns**: Created task object
-   **Usage**:
    `const newTask = await createTask({ title: 'New Task', description: 'Task description' });`

#### `updateTask(data)`

-   **Description**: Updates an existing task
-   **Parameters**: `data` (object) - The task data including `id`
-   **Returns**: Updated task object
-   **Usage**: `const updatedTask = await updateTask({ id: '123', title: 'Updated Task' });`

#### `deleteTask(taskId)`

-   **Description**: Deletes a task
-   **Parameters**: `taskId` (string/number) - The ID of the task to delete
-   **Returns**: `true` if successful
-   **Usage**: `await deleteTask('123');`

### Sprints

#### `getSprints()`

-   **Description**: Fetches all sprints
-   **Returns**: Array of sprint objects
-   **Usage**: `const sprints = await getSprints();`

#### `createSprint(sprintData)`

-   **Description**: Creates a new sprint
-   **Parameters**: `sprintData` (object) - The sprint data
-   **Returns**: Created sprint object
-   **Usage**:
    `const newSprint = await createSprint({ name: 'Sprint 1', startDate: '2023-05-01' });`

#### `updateSprint(sprintId, sprintData)`

-   **Description**: Updates an existing sprint
-   **Parameters**:
    -   `sprintId` (string/number) - The ID of the sprint
    -   `sprintData` (object) - The updated sprint data
-   **Returns**: Updated sprint object
-   **Usage**: `const updatedSprint = await updateSprint('123', { name: 'Updated Sprint 1' });`

#### `deleteSprint(sprintId)`

-   **Description**: Deletes a sprint
-   **Parameters**: `sprintId` (string/number) - The ID of the sprint to delete
-   **Returns**: `true` if successful
-   **Usage**: `await deleteSprint('123');`

### Statuses

#### `getStatuses()`

-   **Description**: Fetches all statuses
-   **Returns**: Array of status objects
-   **Usage**: `const statuses = await getStatuses();`

#### `updateStatuses(statusesData)`

-   **Description**: Updates statuses
-   **Parameters**: `statusesData` (object) - The updated statuses data
-   **Returns**: Updated statuses object
-   **Usage**:
    `const updatedStatuses = await updateStatuses({ todo: 'To Do', inProgress: 'In Progress' });`

### Workflows

#### `getWorkflows()`

-   **Description**: Fetches all workflows
-   **Returns**: Array of workflow objects
-   **Usage**: `const workflows = await getWorkflows();`

#### `createWorkflow(workflowData)`

-   **Description**: Creates a new workflow
-   **Parameters**: `workflowData` (object) - The workflow data
-   **Returns**: Created workflow object
-   **Usage**:
    `const newWorkflow = await createWorkflow({ name: 'New Workflow', steps: ['Todo', 'In Progress', 'Done'] });`

#### `updateWorkflow(workflowId, workflowData)`

-   **Description**: Updates an existing workflow
-   **Parameters**:
    -   `workflowId` (string/number) - The ID of the workflow
    -   `workflowData` (object) - The updated workflow data
-   **Returns**: Updated workflow object
-   **Usage**: `const updatedWorkflow = await updateWorkflow('123', { name: 'Updated Workflow' });`

#### `deleteWorkflow(workflowId)`

-   **Description**: Deletes a workflow
-   **Parameters**: `workflowId` (string/number) - The ID of the workflow to delete
-   **Returns**: `true` if successful
-   **Usage**: `await deleteWorkflow('123');`

### Other Functions

The file includes additional functions for various operations such as:

-   Moving tasks between statuses
-   Adding/removing tasks to/from sprints
-   Searching tasks
-   Logging time
-   Managing attachments and comments
-   Updating task order, status, and assignment
-   Updating task due dates

Each of these functions follows a similar pattern of making an API request and handling errors using
the `handleApiError` function.

## Usage in the Project

This `apiService.js` file serves as the central point for all API communications in the frontend
application. Components and other parts of the application can import and use these functions to
interact with the backend, ensuring consistent error handling and authentication across all API
calls.

For example, in a React component:

```javascript
import { fetchTasks, createTask } from '../services/apiService';

function TaskList() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        async function loadTasks() {
            const fetchedTasks = await fetchTasks();
            setTasks(fetchedTasks);
        }
        loadTasks();
    }, []);

    const handleAddTask = async (newTaskData) => {
        const createdTask = await createTask(newTaskData);
        setTasks([...tasks, createdTask]);
    };

    // ... rest of the component
}
```

This structure allows for easy maintenance and updates to API interactions across the entire
application.
