import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Status from './model/Status.js';
import Workflow from './model/Workflow.js';
import User from './model/User.js';
import Task from './model/Task.js';
import Sprint from './model/Sprint.js';
import Project from './model/Project.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const loadInitialData = async () => {
    const initialData = JSON.parse(
        fs.readFileSync(path.join(__dirname, 'initial_data.json'), 'utf8')
    );

    for (const user of initialData.users) {
        await User.findOneAndUpdate(
            { email: user.email },
            { ...user },
            { upsert: true, new: true }
        );
    }

    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
        throw new Error('Admin user not found. Please create an admin user first.');
    }

    for (const status of initialData.statuses) {
        await Status.findOneAndUpdate(
            { name: status.name },
            { ...status },
            { upsert: true, new: true }
        );
    }

    for (const workflow of initialData.workflows) {
        await Workflow.findOneAndUpdate(
            { name: workflow.name },
            { ...workflow },
            { upsert: true, new: true }
        );
    }

    for (const project of initialData.projects) {
        const newProject = await Project.findOneAndUpdate(
            { name: project.name },
            {
                ...project,
                owner: adminUser._id,
                workflow: await Workflow.findOne({ name: 'Default' })
            },
            { upsert: true, new: true }
        );

        for (const sprint of initialData.sprints) {
            await Sprint.findOneAndUpdate(
                { name: sprint.name },
                {
                    ...sprint,
                    project: newProject._id
                },
                { upsert: true, new: true }
            );
        }

        const activeSprint = await Sprint.findOne({
            project: newProject._id,
            status: 'active'
        });

        for (const task of initialData.tasks) {
            await Task.findOneAndUpdate(
                { title: task.title, project: newProject._id },
                {
                    ...task,
                    project: newProject._id,
                    sprint: activeSprint ? activeSprint._id : null,
                    assignedTo: await User.findOne({ email: task.assignee })
                },
                { upsert: true, new: true }
            );
        }
    }
};
