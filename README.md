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

-   allow backlog ordering (by mouse, keep position,  it always returns back, add order prop to ask)
-   on Update task, remember changes!!
-   Remember status of task in localStorage, it always reset to default
-   show comments in task view, allow add them!
-   update status when dragging in Sprint view (for example to QA column)
-   update task button should close task window and actually update it!