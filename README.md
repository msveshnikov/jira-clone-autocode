# JIRA Clone (built by [AutoCode](https://autocode.work) in 20 minutes)

A lightweight project management tool inspired by JIRA, built with React and featuring a mocked
backend.

![alt text](image-1.png)


# DEMO

https://jira-clone-autocode.netlify.app/

## Features

-   Backlog: Manage and prioritize your project tasks
-   Sprint Board: Visualize and track progress during sprints
-   Generate prop types always
-   Task Cards: Detailed view for individual tasks
    -   title
    -   description
    -   points
    -   priority

## Planned Enhancements


## Project Structure

```
src/
├── components/
│   ├── Backlog.js
│   ├── Header.js
│   ├── SprintBoard.js
│   └── TaskCard.js
├── context/
│   └── AuthContext.js
├── services/
│   └── apiService.js
├── utils/
│   └── theme.js
├── App.js
└── index.js
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

## TODO


### 1. Prioritized Features for Next Sprint

1. **Implement Backlog Ordering**
   - Allow users to reorder tasks in the backlog using drag-and-drop
   - Add an 'order' property to tasks and persist the order
   - Explanation: This is a core feature for any project management tool and will significantly improve usability

2. **Persist Task Updates**
   - Ensure that task updates (status, description, etc.) are saved and remembered
   - Implement proper state management and API calls
   - Explanation: Currently, changes aren't persisting, which is a critical bug affecting user experience

3. **Add Comments to Tasks**
   - Implement a comment system for tasks
   - Allow users to view and add comments in the task view
   - Explanation: This feature enhances collaboration and communication within the team

4. **Improve Sprint Board Functionality**
   - Update task status when dragged to different columns (e.g., QA)
   - Persist these status changes
   - Explanation: This will make the Sprint Board more interactive and useful for tracking progress

5. **Enhance Task Update UX**
   - Modify the update task flow to close the task window upon successful update
   - Ensure the UI reflects the changes immediately
   - Explanation: This will provide better feedback to users and improve the overall user experience