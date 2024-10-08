import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const apiService = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

apiService.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const handleApiError = (error) => {
    if (error.response) {
        console.error('API Error:', error.response.data);
        throw error.response.data;
    } else if (error.request) {
        console.error('Network Error:', error.request);
        throw new Error('Network error. Please try again.');
    } else {
        console.error('Error:', error.message);
        throw error;
    }
};

export const fetchBacklogTasks = async (projectId) => {
    try {
        const response = await apiService.get(`/projects/${projectId}/tasks?status=backlog`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const fetchTasks = async (projectId) => {
    try {
        const response = await apiService.get(`/projects/${projectId}/tasks`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const fetchTask = async (taskId) => {
    try {
        const response = await apiService.get(`/tasks/${taskId}`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const createTask = async (projectId, taskData) => {
    try {
        const response = await apiService.post(`/projects/${projectId}/tasks`, taskData);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const updateTask = async (data) => {
    try {
        const taskId = data.id;
        const response = await apiService.put(`/tasks/${taskId}`, data);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const deleteTask = async (taskId) => {
    try {
        await apiService.delete(`/tasks/${taskId}`);
        return true;
    } catch (error) {
        handleApiError(error);
    }
};

export const getSprints = async (projectId) => {
    try {
        const response = await apiService.get(`/projects/${projectId}/sprints`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const createSprint = async (projectId, sprintData) => {
    try {
        const response = await apiService.post(`/projects/${projectId}/sprints`, sprintData);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const updateSprint = async (data) => {
    try {
        const sprintId = data.id;
        const response = await apiService.put(`/sprints/${sprintId}`, data);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const deleteSprint = async (sprintId) => {
    try {
        await apiService.delete(`/sprints/${sprintId}`);
        return true;
    } catch (error) {
        handleApiError(error);
    }
};

export const getStatuses = async () => {
    try {
        const response = await apiService.get('/statuses');
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const updateStatuses = async (statusesData) => {
    try {
        const response = await apiService.put('/statuses', statusesData);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const searchTasks = async (projectId, query) => {
    try {
        const response = await apiService.get(
            `/projects/${projectId}/tasks/search?q=${encodeURIComponent(query)}`
        );
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const logTime = async (taskId, timeSpent) => {
    try {
        const response = await apiService.post(`/tasks/${taskId}/log-time`, { time: timeSpent });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const addAttachment = async (taskId, attachment) => {
    try {
        const response = await apiService.post(`/tasks/${taskId}/attachments`, { url: attachment });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const removeAttachment = async (taskId, attachmentId) => {
    try {
        await apiService.delete(`/tasks/${taskId}/attachments/${attachmentId}`);
        return true;
    } catch (error) {
        handleApiError(error);
    }
};

export const addComment = async (taskId, comment) => {
    try {
        const response = await apiService.post(`/tasks/${taskId}/comments`, { text: comment });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const removeComment = async (taskId, commentId) => {
    try {
        await apiService.delete(`/tasks/${taskId}/comments/${commentId}`);
        return true;
    } catch (error) {
        handleApiError(error);
    }
};

export const updateTaskOrder = async (data) => {
    try {
        const taskId = data.id;
        const response = await apiService.put(`/tasks/${taskId}/order`, { order: data.order });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const assignTask = async (taskId, assigneeId) => {
    try {
        const response = await apiService.put(`/tasks/${taskId}/assign`, { userId: assigneeId });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const updateTaskDueDate = async (taskId, dueDate) => {
    try {
        const response = await apiService.put(`/tasks/${taskId}`, { dueDate });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const startSprint = async (sprintId) => {
    try {
        const response = await apiService.post(`/sprints/${sprintId}/start`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const closeSprint = async (sprintId) => {
    try {
        const response = await apiService.post(`/sprints/${sprintId}/complete`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const getUserProjects = async () => {
    try {
        const response = await apiService.get('/projects');
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const createUserProject = async (projectData) => {
    try {
        const response = await apiService.post('/projects', projectData);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const updateProject = async (data) => {
    try {
        const projectId = data.id;
        const response = await apiService.put(`/projects/${projectId}`, data);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const deleteProject = async (projectId) => {
    try {
        await apiService.delete(`/projects/${projectId}`);
        return true;
    } catch (error) {
        handleApiError(error);
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await apiService.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await apiService.post('/auth/login', credentials);
        localStorage.setItem('token', response.data.token);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await apiService.get('/users/me');
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const updateUserPreferences = async (preferences) => {
    try {
        const response = await apiService.put('/users/preferences', preferences);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const getUser = async () => {
    try {
        const response = await apiService.get(`/users/me`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const updateUser = async (userId, userData) => {
    try {
        const response = await apiService.put(`/users/${userId}`, userData);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const moveTaskBetweenSprintsOrBacklog = async (projectId, taskId, sprintId, order) => {
    try {
        const response = await apiService.put(`/projects/${projectId}/tasks/${taskId}/move`, {
            sprintId,
            order
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const getAllUsers = async () => {
    try {
        const response = await apiService.get('/users');
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const addUserToProject = async (projectId, userId) => {
    try {
        const response = await apiService.post(`/projects/${projectId}/members`, { userId });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const removeUserFromProject = async (projectId, userId) => {
    try {
        const response = await apiService.delete(`/projects/${projectId}/members/${userId}`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const getProjectUsers = async (projectId) => {
    try {
        const response = await apiService.get(`/projects/${projectId}/members`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const generateBacklog = async (projectId, projectDescription) => {
    try {
        const response = await apiService.post(`/projects/${projectId}/generate-backlog`, {
            projectDescription
        });

        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export default apiService;
