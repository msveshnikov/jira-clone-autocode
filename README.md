# SCRUM (built by [AutoCode](https://autocode.work) in 20 minutes)

A lightweight project management tool, built with React and MongoDB

![alt text](image-1.png)

## DEMO

https://jira.autocode.work/

## Features

- Backlog: Manage and prioritize your project tasks
- Sprint Board: Visualize and track progress during sprints
- User Authentication: Secure login and user management
- Projects: Manage multiple projects
- Search: Find tasks quickly
- Profile: User profile management

## Planned Enhancements

- Drag-and-Drop Functionality: Enhance user experience for task management
- Reporting: Implement burndown charts and sprint velocity metrics
- Task Comments: Implement a comment system for tasks
- Custom Fields: Allow users to add custom fields to tasks
- Version Control Integration: Link tasks to Git commits or pull requests
- Workflow Customization: Allow users to define custom workflows
- Time Tracking: Implement time logging and estimation features
- Integration with External Tools: Connect with popular development tools
- Mobile App: Develop a responsive mobile application
- Notifications: Implement real-time notifications for task updates

## Project Structure

```
src/
├── components/
│   ├── Backlog.js
│   ├── Header.js
│   ├── Login.js
│   ├── Profile.js
│   ├── Projects.js
│   ├── Register.js
│   ├── Search.js
│   ├── SprintBoard.js
│   ├── TaskCard.js
│   └── TaskTable.js
├── contexts/
│   └── AuthContext.js
├── services/
│   └── apiService.js
├── utils/
│   └── theme.js
├── App.js
└── index.js
server/
├── model/
│   ├── Project.js
│   ├── Sprint.js
│   ├── Status.js
│   ├── Task.js
│   ├── User.js
│   └── Workflow.js
└── server.js
```

## Technical Improvements

- Implement server-side rendering for improved performance
- Optimize API integration and data fetching strategies
- Enhance security measures (e.g., input validation, XSS protection)
- Implement proper error handling and logging
- Optimize database queries and implement indexing
- Set up monitoring and alerting systems
- Implement rate limiting and request throttling
- Containerize the application using Docker for easier deployment
- Implement CI/CD pipeline for automated testing and deployment
- Optimize frontend bundle size and implement code splitting

## Getting Started

1. Clone the repository
2. Install dependencies:
   - Frontend: `cd src && npm install`
   - Backend: `cd server && npm install`
3. Start the development servers:
   - Frontend: `npm start`
   - Backend: `npm run dev`

## Documentation

Comprehensive documentation is available in the `docs` folder, including:

- Application description
- Release notes
- Privacy policy
- Social media content
- API documentation
- User guides

## Deployment

The application is containerized using Docker. To deploy:

1. Build the Docker images:
   ```
   docker-compose build
   ```
2. Run the containers:
   ```
   docker-compose up -d
   ```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

# TODO

-   reorder other tasks from the same sprint/backlog (so if I set order=2 previous order==2 should
    be 3 and so on)