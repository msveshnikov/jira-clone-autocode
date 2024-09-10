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
        const taskData = data;
        const response = await apiService.put(`/tasks/${taskId}`, taskData);
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

export const updateSprint = async (sprintId, sprintData) => {
    try {
        const response = await apiService.put(`/sprints/${sprintId}`, sprintData);
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

export const moveTask = async (taskId, newStatus) => {
    try {
        const response = await apiService.put(`/tasks/${taskId}/status`, { status: newStatus });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const addTaskToSprint = async (taskId, sprintId) => {
    try {
        const response = await apiService.put(`/tasks/${taskId}/sprint/${sprintId}`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const removeTaskFromSprint = async (taskId) => {
    try {
        const response = await apiService.delete(`/tasks/${taskId}/sprint`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const getWorkflows = async () => {
    try {
        const response = await apiService.get('/workflows');
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const createWorkflow = async (workflowData) => {
    try {
        const response = await apiService.post('/workflows', workflowData);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const updateWorkflow = async (workflowId, workflowData) => {
    try {
        const response = await apiService.put(`/workflows/${workflowId}`, workflowData);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const deleteWorkflow = async (workflowId) => {
    try {
        await apiService.delete(`/workflows/${workflowId}`);
        return true;
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
        const response = await apiService.post(`/tasks/${taskId}/log-time`, { timeSpent });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const addAttachment = async (taskId, attachment) => {
    try {
        const formData = new FormData();
        formData.append('attachment', attachment);
        const response = await apiService.post(`/tasks/${taskId}/attachments`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
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

export const updateTaskOrder = async (taskId, newOrder) => {
    try {
        const response = await apiService.put(`/tasks/${taskId}/order`, { order: newOrder });
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

export const getProjects = async () => {
    try {
        const response = await apiService.get('/projects');
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const createProject = async (projectData) => {
    try {
        const response = await apiService.post('/projects', projectData);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const updateProject = async (projectId, projectData) => {
    try {
        const response = await apiService.put(`/projects/${projectId}`, projectData);
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

export const logoutUser = () => {
    localStorage.removeItem('token');
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

export const getUser = async (userId) => {
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

export default apiService;
