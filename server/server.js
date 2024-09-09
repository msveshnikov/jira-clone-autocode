import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import path from 'path';

import User from './model/User.js';
import Project from './model/Project.js';
import Sprint from './model/Sprint.js';
import Task from './model/Task.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.static(path.join(__dirname, '../build')));

app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  const task = new Task(req.body);
  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/sprints', async (req, res) => {
  try {
    const sprints = await Sprint.find();
    res.json(sprints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/sprints', async (req, res) => {
  const sprint = new Sprint(req.body);
  try {
    const newSprint = await sprint.save();
    res.status(201).json(newSprint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/sprints/:id', async (req, res) => {
  try {
    const updatedSprint = await Sprint.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedSprint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/sprints/:id', async (req, res) => {
  try {
    await Sprint.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sprint deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/projects', async (req, res) => {
  const project = new Project(req.body);
  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  const user = new User(req.body);
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});