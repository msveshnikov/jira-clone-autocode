import fs from 'fs';
import path from 'path';
import Status from './model/Status';
import Workflow from './model/Workflow';
import User from './model/User';
import Task from './model/Task';
import Sprint from './model/Sprint';
import Project from './model/Project';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const loadInitialData = async () => {
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
