# JIRA Clone Project Documentation

## Project Overview

This project is a lightweight JIRA-inspired project management tool built with React and MongoDB. It aims to provide essential project management features in a user-friendly interface.

### Key Features

- Backlog management
- Sprint board
- Task cards with detailed information
- Customizable workflows

## Architecture

The project follows a client-server architecture:

### Frontend
- Built with React
- Uses Material-UI for styling
- Implements React Router for navigation
- Utilizes React Query for state management and API interactions

### Backend
- Node.js with Express.js
- MongoDB database
- RESTful API design

### Docker
- Containerized application for easy deployment
- Separate containers for frontend, backend, and MongoDB

## Module Interactions

1. **Frontend Components**:
   - `Backlog.js`: Manages the project backlog
   - `SprintBoard.js`: Handles the sprint board view
   - `TaskCard.js`: Renders individual task details
   - `Header.js`: Provides navigation and app-wide controls

2. **API Service**:
   - `apiService.js`: Centralizes API calls to the backend

3. **Backend Models**:
   - `Project.js`: Defines project schema
   - `Sprint.js`: Manages sprint information
   - `Task.js`: Handles task data
   - `User.js`: User management
   - `Workflow.js`: Customizable workflow definitions
   - `Status.js`: Task status definitions

4. **Server**:
   - `server.js`: Main entry point for the backend, sets up Express and MongoDB connection

## Installation and Setup

### Prerequisites
- Node.js (v14+)
- Docker and Docker Compose

### Local Development

1. Clone the repository:
   ```
   git clone [repository-url]
   cd jira-clone
   ```

2. Install dependencies:
   ```
   npm install
   cd server && npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. In a separate terminal, start the backend:
   ```
   cd server && npm start
   ```

### Docker Deployment

1. Build and run the Docker containers:
   ```
   docker-compose up --build
   ```

2. Access the application at `http://localhost:8787`

## Usage Instructions

1. **Backlog Management**:
   - Add new tasks to the backlog
   - Prioritize tasks by dragging and dropping

2. **Sprint Planning**:
   - Create a new sprint
   - Move tasks from backlog to sprint

3. **Task Management**:
   - Update task status on the sprint board
   - Edit task details by clicking on a task card

4. **Workflow Customization**:
   - Modify workflow stages in the settings (to be implemented)

## API Documentation

The backend provides the following main endpoints:

- `GET /api/tasks`: Retrieve all tasks
- `POST /api/tasks`: Create a new task
- `GET /api/tasks/:id`: Get a specific task
- `PUT /api/tasks/:id`: Update a task
- `DELETE /api/tasks/:id`: Delete a task

(Note: Implement proper authentication and authorization for these endpoints in a production environment)

## Future Enhancements

- User authentication and authorization
- Drag-and-drop functionality for task management
- Advanced search and filtering capabilities
- Reporting features (burndown charts, velocity metrics)
- Mobile responsiveness
- Task commenting system
- Custom fields for tasks
- Integration with version control systems

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature-branch-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-branch-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.

---

This documentation provides a comprehensive overview of the JIRA Clone project, including its architecture, setup instructions, and usage guidelines. It serves as a starting point for developers to understand and contribute to the project.