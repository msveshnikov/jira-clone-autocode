import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import apiService, {
    loginUser,
    logoutUser,
    getCurrentUser,
    registerUser,
    createProject,
    updateUserPreferences
} from '../services/apiService';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            apiService.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser();
        } else {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchUser = async () => {
        try {
            const userData = await getCurrentUser();
            setUser(userData);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Error fetching user:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

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
            navigate('/');
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const register = async (email, password, name) => {
        try {
            const data = await registerUser({ email, password, name });
            localStorage.setItem('token', data.token);
            apiService.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            setUser(data.user);
            setIsAuthenticated(true);
            navigate('/');
            return true;
        } catch (error) {
            console.error('Registration error:', error);
            return false;
        }
    };

    const logout = () => {
        logoutUser();
        localStorage.removeItem('token');
        localStorage.removeItem('rememberMe');
        delete apiService.defaults.headers.common['Authorization'];
        setUser(null);
        setIsAuthenticated(false);
        setCurrentProject(null);
        navigate('/login');
    };

    const createNewProject = async (projectData) => {
        try {
            const newProject = await createProject(projectData);
            return newProject;
        } catch (error) {
            console.error('Create project error:', error);
            return null;
        }
    };

    const selectProject = (project) => {
        setCurrentProject(project);
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

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated,
        setIsAuthenticated,
        createProject: createNewProject,
        selectProject,
        currentProject,
        updateUserPreferences: updatePreferences
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default AuthProvider;
