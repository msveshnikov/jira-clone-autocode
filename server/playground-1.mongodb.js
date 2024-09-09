/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// Select the database to use.
use('jira_clone');

// Create collections
db.createCollection('users');
db.createCollection('projects');
db.createCollection('sprints');
db.createCollection('tasks');

// Insert sample users
db.users.insertMany([
    {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date()
    }
]);

// Insert sample projects
db.projects.insertMany([
    {
        name: 'Project Alpha',
        description: 'A sample project',
        createdBy: 'john_doe',
        createdAt: new Date(),
        updatedAt: new Date()
    }
]);

// Insert sample sprints
db.sprints.insertMany([
    {
        name: 'Sprint 1',
        projectId: db.projects.findOne({ name: 'Project Alpha' })._id,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 14)),
        createdAt: new Date(),
        updatedAt: new Date()
    }
]);

// Insert sample tasks
db.tasks.insertMany([
    {
        title: 'Implement user authentication',
        description: 'Add user login and registration functionality',
        points: 5,
        priority: 'high',
        status: 'todo',
        projectId: db.projects.findOne({ name: 'Project Alpha' })._id,
        sprintId: db.sprints.findOne({ name: 'Sprint 1' })._id,
        assignedTo: 'john_doe',
        createdBy: 'jane_smith',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        title: 'Design landing page',
        description: 'Create a responsive design for the landing page',
        points: 3,
        priority: 'medium',
        status: 'inprogress',
        projectId: db.projects.findOne({ name: 'Project Alpha' })._id,
        sprintId: db.sprints.findOne({ name: 'Sprint 1' })._id,
        assignedTo: 'jane_smith',
        createdBy: 'john_doe',
        createdAt: new Date(),
        updatedAt: new Date()
    }
]);

// Create indexes
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });
db.projects.createIndex({ name: 1 }, { unique: true });
db.tasks.createIndex({ projectId: 1, status: 1 });
db.tasks.createIndex({ sprintId: 1 });

// Sample queries

// Find all tasks in a specific sprint
db.tasks.find({ sprintId: db.sprints.findOne({ name: 'Sprint 1' })._id }).toArray();

// Find all high priority tasks
db.tasks.find({ priority: 'high' }).toArray();

// Find all tasks assigned to a specific user
db.tasks.find({ assignedTo: 'john_doe' }).toArray();

// Update task status
db.tasks.updateOne(
    { title: 'Implement user authentication' },
    { $set: { status: 'inprogress', updatedAt: new Date() } }
);

// Add a comment to a task
db.tasks.updateOne(
    { title: 'Implement user authentication' },
    {
        $push: {
            comments: {
                text: 'Started working on this task',
                author: 'john_doe',
                createdAt: new Date()
            }
        },
        $set: { updatedAt: new Date() }
    }
);

// Get tasks with comments
db.tasks.find({ comments: { $exists: true, $ne: [] } }).toArray();
