/* global use, db */

// Select the database to use.
use('scrum');
db.tasks.deleteMany({});

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
        owner: 'john_doe',
        members: ['john_doe', 'jane_smith'],
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

// Find all projects owned by a specific user
db.projects.find({ owner: 'john_doe' }).toArray();

// Find all projects where a user is a member
db.projects.find({ members: 'jane_smith' }).toArray();

// Add a new member to a project
db.projects.updateOne(
    { name: 'Project Alpha' },
    { $addToSet: { members: 'new_member' }, $set: { updatedAt: new Date() } }
);

// Remove a member from a project
db.projects.updateOne(
    { name: 'Project Alpha' },
    { $pull: { members: 'jane_smith' }, $set: { updatedAt: new Date() } }
);

// Change project owner
use('scrum');
db.projects.updateOne(
    { name: 'SCRUM Clone' },
    {
        $set: {
            members: [
                {
                    $oid: '66e08a9a1e11f85f96239cf1'
                }
            ],
            updatedAt: new Date()
        }
    }
);
