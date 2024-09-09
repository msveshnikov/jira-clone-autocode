// src/services/apiService.js

import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'jira_clone_data';

const initialData = {
    tasks: [
        {
            id: uuidv4(),
            title: 'Implement user authentication',
            description: 'Set up user registration and login functionality',
            points: 5,
            priority: 'High',
            status: 'To Do',
            timeSpent: 0,
            attachments: [],
            comments: [],
            assignedTo: '',
            order: 0
        },
        {
            id: uuidv4(),
            title: 'Design sprint board UI',
            description: 'Create wireframes and mockups for the sprint board interface',
            points: 3,
            priority: 'Medium',
            status: 'In Progress',
            timeSpent: 0,
            attachments: [],
            comments: [],
            assignedTo: '',
            order: 1
        },
        {
            id: uuidv4(),
            title: 'Implement drag-and-drop functionality',
            description: 'Add the ability to drag and drop task cards between columns',
            points: 8,
            priority: 'High',
            status: 'In Progress',
            timeSpent: 0,
            attachments: [],
            comments: [],
            assignedTo: '',
            order: 2
        },
        {
            id: uuidv4(),
            title: 'Write unit tests for API endpoints',
            description: 'Create comprehensive unit tests for all backend API endpoints',
            points: 5,
            priority: 'Medium',
            status: 'Done',
            timeSpent: 0,
            attachments: [],
            comments: [],
            assignedTo: '',
            order: 3
        }
    ],
    sprints: [
        {
            id: uuidv4(),
            name: 'Sprint 1',
            startDate: '2023-05-01',
            endDate: '2023-05-14',
            tasks: []
        }
    ],
    statuses: ['To Do', 'In Progress', 'Ready to Test', 'Code Review', 'QA', 'Done'],
    workflows: [
        {
            id: uuidv4(),
            name: 'Default',
            statuses: ['To Do', 'In Progress', 'Ready to Test', 'Code Review', 'QA', 'Done']
        }
    ]
};

const loadData = () => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : initialData;
};

const saveData = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ApiService = {
    fetchBacklogTasks: async () => {
        await delay(100);
        const data = loadData();
        return data.tasks.filter((task) => !task.sprintId).sort((a, b) => a.order - b.order);
    },

    fetchTasks: async () => {
        await delay(100);
        const data = loadData();
        return data.tasks;
    },

    fetchTask: async (taskId) => {
        await delay(100);
        const data = loadData();
        const task = data.tasks.find((t) => t.id === taskId);
        if (!task) throw new Error('Task not found');
        return task;
    },

    createTask: async (taskData) => {
        await delay(100);
        const data = loadData();
        const newTask = {
            id: uuidv4(),
            ...taskData,
            status: 'To Do',
            timeSpent: 0,
            attachments: [],
            comments: [],
            order: data.tasks.length
        };
        data.tasks.push(newTask);
        saveData(data);
        return newTask;
    },

    updateTask: async (taskId, updatedData) => {
        await delay(100);
        const data = loadData();
        const taskIndex = data.tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
            data.tasks[taskIndex] = { ...data.tasks[taskIndex], ...updatedData };
            saveData(data);
            return data.tasks[taskIndex];
        }
        throw new Error('Task not found');
    },

    deleteTask: async (taskId) => {
        await delay(100);
        const data = loadData();
        const taskIndex = data.tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
            data.tasks.splice(taskIndex, 1);
            saveData(data);
            return true;
        }
        throw new Error('Task not found');
    },

    getSprints: async () => {
        await delay(100);
        const data = loadData();
        return data.sprints;
    },

    createSprint: async (sprintData) => {
        await delay(100);
        const data = loadData();
        const newSprint = {
            id: uuidv4(),
            ...sprintData,
            tasks: []
        };
        data.sprints.push(newSprint);
        saveData(data);
        return newSprint;
    },

    updateSprint: async (sprintId, updatedData) => {
        await delay(100);
        const data = loadData();
        const sprintIndex = data.sprints.findIndex((sprint) => sprint.id === sprintId);
        if (sprintIndex !== -1) {
            data.sprints[sprintIndex] = { ...data.sprints[sprintIndex], ...updatedData };
            saveData(data);
            return data.sprints[sprintIndex];
        }
        throw new Error('Sprint not found');
    },

    deleteSprint: async (sprintId) => {
        await delay(100);
        const data = loadData();
        const sprintIndex = data.sprints.findIndex((sprint) => sprint.id === sprintId);
        if (sprintIndex !== -1) {
            data.sprints.splice(sprintIndex, 1);
            saveData(data);
            return true;
        }
        throw new Error('Sprint not found');
    },

    getStatuses: async () => {
        await delay(100);
        const data = loadData();
        return data.statuses;
    },

    updateStatuses: async (newStatuses) => {
        await delay(100);
        const data = loadData();
        data.statuses = newStatuses;
        saveData(data);
        return data.statuses;
    },

    moveTask: async (taskId, newStatus) => {
        await delay(100);
        const data = loadData();
        const taskIndex = data.tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
            data.tasks[taskIndex].status = newStatus;
            saveData(data);
            return data.tasks[taskIndex];
        }
        throw new Error('Task not found');
    },

    addTaskToSprint: async (taskId, sprintId) => {
        await delay(100);
        const data = loadData();
        const taskIndex = data.tasks.findIndex((task) => task.id === taskId);
        const sprintIndex = data.sprints.findIndex((sprint) => sprint.id === sprintId);
        if (taskIndex !== -1 && sprintIndex !== -1) {
            data.tasks[taskIndex].sprintId = sprintId;
            data.sprints[sprintIndex].tasks.push(taskId);
            saveData(data);
            return data.sprints[sprintIndex];
        }
        throw new Error('Task or Sprint not found');
    },

    removeTaskFromSprint: async (taskId, sprintId) => {
        await delay(100);
        const data = loadData();
        const taskIndex = data.tasks.findIndex((task) => task.id === taskId);
        const sprintIndex = data.sprints.findIndex((sprint) => sprint.id === sprintId);
        if (taskIndex !== -1 && sprintIndex !== -1) {
            delete data.tasks[taskIndex].sprintId;
            const taskIndexInSprint = data.sprints[sprintIndex].tasks.indexOf(taskId);
            if (taskIndexInSprint !== -1) {
                data.sprints[sprintIndex].tasks.splice(taskIndexInSprint, 1);
            }
            saveData(data);
            return data.sprints[sprintIndex];
        }
        throw new Error('Task or Sprint not found');
    },

    getWorkflows: async () => {
        await delay(100);
        const data = loadData();
        return data.workflows;
    },

    createWorkflow: async (workflowData) => {
        await delay(100);
        const data = loadData();
        const newWorkflow = {
            id: uuidv4(),
            ...workflowData
        };
        data.workflows.push(newWorkflow);
        saveData(data);
        return newWorkflow;
    },

    updateWorkflow: async (workflowId, updatedData) => {
        await delay(100);
        const data = loadData();
        const workflowIndex = data.workflows.findIndex((workflow) => workflow.id === workflowId);
        if (workflowIndex !== -1) {
            data.workflows[workflowIndex] = { ...data.workflows[workflowIndex], ...updatedData };
            saveData(data);
            return data.workflows[workflowIndex];
        }
        throw new Error('Workflow not found');
    },

    deleteWorkflow: async (workflowId) => {
        await delay(100);
        const data = loadData();
        const workflowIndex = data.workflows.findIndex((workflow) => workflow.id === workflowId);
        if (workflowIndex !== -1) {
            data.workflows.splice(workflowIndex, 1);
            saveData(data);
            return true;
        }
        throw new Error('Workflow not found');
    },

    searchTasks: async (query) => {
        await delay(100);
        const data = loadData();
        const lowercaseQuery = query.toLowerCase();
        return data.tasks.filter(
            (task) =>
                task.title.toLowerCase().includes(lowercaseQuery) ||
                task.description.toLowerCase().includes(lowercaseQuery)
        );
    },

    logTime: async (taskId, timeSpent) => {
        await delay(100);
        const data = loadData();
        const taskIndex = data.tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
            data.tasks[taskIndex].timeSpent += timeSpent;
            saveData(data);
            return data.tasks[taskIndex];
        }
        throw new Error('Task not found');
    },

    addAttachment: async (taskId, attachment) => {
        await delay(100);
        const data = loadData();
        const taskIndex = data.tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
            data.tasks[taskIndex].attachments.push(attachment);
            saveData(data);
            return data.tasks[taskIndex];
        }
        throw new Error('Task not found');
    },

    removeAttachment: async (taskId, attachmentId) => {
        await delay(100);
        const data = loadData();
        const taskIndex = data.tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
            const attachmentIndex = data.tasks[taskIndex].attachments.findIndex(
                (att) => att.id === attachmentId
            );
            if (attachmentIndex !== -1) {
                data.tasks[taskIndex].attachments.splice(attachmentIndex, 1);
                saveData(data);
                return data.tasks[taskIndex];
            }
        }
        throw new Error('Task or attachment not found');
    },

    addComment: async (taskId, comment) => {
        await delay(100);
        const data = loadData();
        const taskIndex = data.tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
            const newComment = {
                id: uuidv4(),
                ...comment,
                createdAt: new Date().toISOString()
            };
            data.tasks[taskIndex].comments.push(newComment);
            saveData(data);
            return newComment;
        }
        throw new Error('Task not found');
    },

    removeComment: async (taskId, commentId) => {
        await delay(100);
        const data = loadData();
        const taskIndex = data.tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
            const commentIndex = data.tasks[taskIndex].comments.findIndex(
                (comment) => comment.id === commentId
            );
            if (commentIndex !== -1) {
                data.tasks[taskIndex].comments.splice(commentIndex, 1);
                saveData(data);
                return true;
            }
        }
        throw new Error('Task or comment not found');
    },

    updateTaskOrder: async (taskId, newOrder) => {
        await delay(100);
        const data = loadData();
        const taskIndex = data.tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
            data.tasks[taskIndex].order = newOrder;
            saveData(data);
            return data.tasks[taskIndex];
        }
        throw new Error('Task not found');
    }
};

export const {
    fetchBacklogTasks,
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
    getSprints,
    createSprint,
    updateSprint,
    deleteSprint,
    getStatuses,
    updateStatuses,
    moveTask,
    addTaskToSprint,
    removeTaskFromSprint,
    getWorkflows,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    searchTasks,
    logTime,
    addAttachment,
    removeAttachment,
    addComment,
    removeComment,
    updateTaskOrder
} = ApiService;

export default ApiService;
