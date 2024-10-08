import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import apiService, {
    loginUser,
    getCurrentUser,
    registerUser,
    createUserProject,
    updateUserPreferences,
    getUserProjects
} from '../services/apiService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    const fetchUser = useCallback(async () => {
        try {
            const userData = await getCurrentUser();
            setUser(userData);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchProjects = useCallback(async () => {
        try {
            const projectsData = await getUserProjects();
            setProjects(projectsData);
            if (projectsData.length > 0 && !currentProject) {
                setCurrentProject(projectsData[0]);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    }, [currentProject]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            apiService.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser();
            fetchProjects();
        } else {
            setLoading(false);
        }
    }, [fetchUser, fetchProjects]);

    const login = async (email, password, rememberMe) => {
        try {
            const data = await loginUser({ email, password });
            localStorage.setItem('token', data.token);
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            } else {
                localStorage.removeItem('rememberMe');
            }
            apiService.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            setUser(data.user);
            setIsAuthenticated(true);
            fetchProjects();
            navigate('/');
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const register = async (email, password, name) => {
        try {
            await registerUser({ email, password, name });
            navigate('/login');
            return true;
        } catch (error) {
            console.error('Registration error:', error);
            return false;
        }
    };

    const logout = async () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('rememberMe');
            delete apiService.defaults.headers.common['Authorization'];
            setUser(null);
            setIsAuthenticated(false);
            setCurrentProject(null);
            setProjects([]);
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const createProject = async (projectData) => {
        try {
            const newProject = await createUserProject(projectData);
            setProjects([...projects, newProject]);
            return newProject;
        } catch (error) {
            console.error('Create project error:', error);
            return null;
        }
    };

    const selectProject = (project) => {
        setCurrentProject(project);
        localStorage.setItem('currentProject', JSON.stringify(project));
    };

    const updatePreferences = async (preferences) => {
        try {
            const updatedPreferences = await updateUserPreferences(preferences);
            setUser((prevUser) => ({ ...prevUser, preferences: updatedPreferences }));
            return updatedPreferences;
        } catch (error) {
            console.error('Update user preferences error:', error);
            return null;
        }
    };

    useEffect(() => {
        const savedProject = localStorage.getItem('currentProject');
        if (savedProject) {
            setCurrentProject(JSON.parse(savedProject));
        }
    }, []);

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated,
        setIsAuthenticated,
        createProject,
        selectProject,
        currentProject,
        updatePreferences,
        projects,
        fetchProjects
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default AuthProvider;
