# TaskCard Component Documentation

## Overview

The `TaskCard` component is a React component that displays and allows editing of a single task in a card format. It's part of a larger project structure, likely a task management or project management application. This component fetches task data, displays it in an editable form, and allows users to update the task details.

## File Location

`src/components/TaskCard.js`

## Dependencies

- React
- React Router
- React Query
- Material-UI (MUI)
- Custom API service (`../services/apiService`)

## Component Structure

The `TaskCard` component is a functional component that uses React hooks for state management and data fetching.

## Main Functionalities

1. Fetches task data based on the task ID from the URL
2. Displays task details in an editable form
3. Allows updating of task details
4. Shows task priority as a colored chip

## Hooks Used

- `useState`: For local state management of the task data
- `useEffect`: To update local state when fetched data changes
- `useParams`: To access the task ID from the URL
- `useQuery`: For fetching task data
- `useMutation`: For updating task data

## Props

This component doesn't accept any props. It relies on the URL parameter for the task ID.

## State

The component maintains a local state `task` with the following structure:

```javascript
{
  title: string,
  description: string,
  points: number,
  priority: 'low' | 'medium' | 'high',
  status: 'todo' | 'inProgress' | 'done',
  assignedTo: string
}
```

## Functions

### `handleInputChange`

Handles changes in form inputs and updates the local state.

Parameters:
- `e`: React's synthetic event

### `handleSubmit`

Handles form submission and triggers the update mutation.

Parameters:
- `e`: React's synthetic event

## Rendering

The component renders a Material-UI `Card` containing a form with the following fields:

- Title (TextField)
- Description (TextField, multiline)
- Points (TextField, number type)
- Priority (Select)
- Status (Select)
- Assigned To (TextField)

It also displays a chip showing the task priority with a color corresponding to the priority level.

## Error Handling

- Displays a loading message while fetching task data
- Displays an error message if task data fetching fails

## Usage

This component is typically used in conjunction with React Router, where it's rendered when navigating to a specific task's edit page. For example:

```jsx
<Route path="/task/:id" element={<TaskCard />} />
```

## Integration with Project

- Utilizes the `apiService.js` for API calls (`fetchTask` and `updateTask`)
- Likely used within `SprintBoard.js` or as a standalone page for task editing
- Adheres to the project's theme and styling conventions (potentially defined in `utils/theme.js`)

## Notes

- The component uses React Query for data fetching and caching, which helps in managing server state and provides automatic refetching and cache invalidation.
- The priority colors are hardcoded in the component, which might be better placed in a constants file or theme configuration for better maintainability.

This documentation provides a comprehensive overview of the `TaskCard` component, its functionality, and its role within the project structure. It should help developers understand how to use, maintain, and potentially extend this component.