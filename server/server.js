import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';

import User from './model/User.js';
import Project from './model/Project.js';
import Sprint from './model/Sprint.js';
import Task from './model/Task.js';
import Status from './model/Status.js';
import Workflow from './model/Workflow.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
    cors({
        origin: [
            'https://jira.autocode.work',
            'http://localhost:5000',
            'http://localhost:3000',
            '*'
        ],
        optionsSuccessStatus: 200
    })
);
app.use(express.json());
app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(morgan('dev'));

mongoose.connect(process.env.MONGODB_URI, {});

const loadInitialData = async () => {
    const initialData = JSON.parse(
        fs.readFileSync(path.join(__dirname, 'initial_data.json'), 'utf8')
    );

    for (const status of initialData.statuses) {
        await new Status(status).save();
    }

    for (const workflow of initialData.workflows) {
        await new Workflow(workflow).save();
    }

    for (const user of initialData.users) {
        await new User(user).save();
    }
    for (const task of initialData.tasks) {
        await new Task(task).save();
    }

    for (const sprint of initialData.sprints) {
        await new Sprint(sprint).save();
    }
    for (const project of initialData.projects) {
        await new Project(project).save();
    }
};

mongoose.connection.once('open', async () => {
    const count = await Task.countDocuments();
    if (count === 0) {
        await loadInitialData();
    }
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.post('/auth/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = new User({ email, password, name });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, userId: user._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/tasks', authenticateToken, async (req, res) => {
    try {
        const tasks = await Task.find().sort({ order: 1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/tasks/:id', authenticateToken, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/tasks', authenticateToken, async (req, res) => {
    const task = new Task({ ...req.body, project: req.body.projectId });
    try {
        const newTask = await task.save();
        const project = await Project.findById(req.body.projectId);
        await project.addTaskToBacklog(newTask._id);
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/tasks/:id', authenticateToken, async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/tasks/:id', authenticateToken, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        const project = await Project.findById(task.project);
        await project.removeTaskFromBacklog(task._id);
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/sprints', authenticateToken, async (req, res) => {
    try {
        const sprints = await Sprint.find();
        res.json(sprints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/sprints', authenticateToken, async (req, res) => {
    const sprint = new Sprint({ ...req.body, project: req.body.projectId });
    try {
        const newSprint = await sprint.save();
        const project = await Project.findById(req.body.projectId);
        await project.addSprint(newSprint._id);
        res.status(201).json(newSprint);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/sprints/:id', authenticateToken, async (req, res) => {
    try {
        const updatedSprint = await Sprint.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        res.json(updatedSprint);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/sprints/:id', authenticateToken, async (req, res) => {
    try {
        const sprint = await Sprint.findById(req.params.id);
        if (!sprint) {
            return res.status(404).json({ message: 'Sprint not found' });
        }
        const project = await Project.findById(sprint.project);
        await project.removeSprint(sprint._id);
        await Sprint.findByIdAndDelete(req.params.id);
        res.json({ message: 'Sprint deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/sprints/:id/start', authenticateToken, async (req, res) => {
    try {
        const sprint = await Sprint.findById(req.params.id);
        if (!sprint) {
            return res.status(404).json({ message: 'Sprint not found' });
        }
        await sprint.start();
        res.json(sprint);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/sprints/:id/complete', authenticateToken, async (req, res) => {
    try {
        const sprint = await Sprint.findById(req.params.id);
        if (!sprint) {
            return res.status(404).json({ message: 'Sprint not found' });
        }
        await sprint.complete();
        res.json(sprint);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/projects', authenticateToken, async (req, res) => {
    try {
        const projects = await Project.find({ members: req.user.id });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/projects', authenticateToken, async (req, res) => {
    const project = new Project({ ...req.body, owner: req.user.id, members: [req.user.id] });
    try {
        const newProject = await project.save();
        const user = await User.findById(req.user.id);
        await user.addProject(newProject._id);
        res.status(201).json(newProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/projects/:id', authenticateToken, async (req, res) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        res.json(updatedProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/projects/:id', authenticateToken, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this project' });
        }
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/users', authenticateToken, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/users/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.id !== req.params.id) {
            return res.status(403).json({ message: 'Not authorized to update this user' });
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/statuses', authenticateToken, async (req, res) => {
    try {
        const statuses = await Status.find().sort({ order: 1 });
        res.json(statuses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/workflows', authenticateToken, async (req, res) => {
    try {
        const workflows = await Workflow.find();
        res.json(workflows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/tasks/:id/comments', authenticateToken, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        const comment = await task.addComment(req.body.text, req.user.id);
        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/tasks/:id/attachments', authenticateToken, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        const attachment = await task.addAttachment(req.body.name, req.body.url);
        res.status(201).json(attachment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/tasks/:id/status', authenticateToken, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        const updatedTask = await task.updateStatus(req.body.status);
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/tasks/:id/assign', authenticateToken, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        const updatedTask = await task.assignTo(req.body.userId);
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/tasks/:id/log-time', authenticateToken, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        const updatedTask = await task.logTime(req.body.time);
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/tasks/:id/order', authenticateToken, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        const updatedTask = await task.updateOrder(req.body.order);
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/tasks/search', authenticateToken, async (req, res) => {
    try {
        const query = req.query.q;
        const tasks = await Task.find({ $text: { $search: query } });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
