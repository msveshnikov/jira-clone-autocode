# JIRA Clone (built by [AutoCode](https://autocode.work) in 20 minutes)

A lightweight project management tool inspired by JIRA, built with React and featuring a mocked
backend.

![alt text](image.png)

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

1. Customizable Workflows

    - Allow users to define custom statuses and transitions
    - Drag-and-drop cards between columns

2. Reporting and Analytics

    - Sprint burndown charts
    - Velocity tracking
    - Custom report generation

3. Mobile Responsiveness

    - Optimize UI for various screen sizes
    - Develop native mobile apps for iOS and Android

4. Advanced Search and Filtering

    - Implement full-text search across all project data
    - Save and share custom filters

5. Time Tracking

    - Built-in time logging for tasks
    - Timesheet reports and export options

6. File Attachments

    - Allow file uploads for tasks
    - Integration with cloud storage services

7. Performance Optimization

    - Implement lazy loading for large datasets
    - Optimize React rendering with memoization techniques

8. User Authentication and Authorization

    - Implement secure login and registration
    - Role-based access control

9. Real-time Collaboration

    - Implement WebSocket for live updates
    - Add commenting system on task cards

10. Integration with Version Control

    - Link commits and pull requests to tasks
    - Automatic status updates based on code changes

11. Customizable Dashboard

    - Personalized widgets and metrics
    - Drag-and-drop layout customization

12. Accessibility Improvements
    - Implement ARIA attributes
    - Ensure keyboard navigation support

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

-   allow backlog ordering (by mouse, keep position,  it always returns back, add order prop to ask)
-   on Update task, remember changes!!
-   Remember status of task in localStorage, it always reset to default
-   Fix query.js:317 Error: Task not found
    at fetchTask (apiService.js:56:1)

