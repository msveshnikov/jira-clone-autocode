/* eslint-disable react/prop-types */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            apiService.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const response = await apiService.get('/users/me');
            setUser(response.data);
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
            const response = await apiService.post('/auth/login', { email, password });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            } else {
                localStorage.removeItem('rememberMe');
            }
            apiService.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(user);
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
            const response = await apiService.post('/auth/register', { email, password, name });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            apiService.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(user);
            setIsAuthenticated(true);
            navigate('/');
            return true;
        } catch (error) {
            console.error('Registration error:', error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('rememberMe');
        delete apiService.defaults.headers.common['Authorization'];
        setUser(null);
        setIsAuthenticated(false);
        navigate('/login');
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated,
        setIsAuthenticated
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
