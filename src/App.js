/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from 'react-query';
import createCustomTheme from './utils/theme';
import Backlog from './components/Backlog';
import SprintBoard from './components/SprintBoard';
import TaskCard from './components/TaskCard';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import { Container } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const queryClient = new QueryClient();

function PrivateRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return null;
    return user ? children : <Navigate to="/login" />;
}

function App() {
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });
    const theme = createCustomTheme(darkMode ? 'dark' : 'light');

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <AuthProvider>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <div
                            className="App"
                            style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
                        >
                            <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
                            <Container maxWidth={false} style={{ flexGrow: 1, padding: 0 }}>
                                <Routes>
                                    <Route
                                        path="/"
                                        element={
                                            <PrivateRoute>
                                                <SprintBoard />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/backlog"
                                        element={
                                            <PrivateRoute>
                                                <Backlog />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/task/:id"
                                        element={
                                            <PrivateRoute>
                                                <TaskCard />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />
                                </Routes>
                            </Container>
                        </div>
                    </ThemeProvider>
                </AuthProvider>
            </Router>
        </QueryClientProvider>
    );
}

export default App;
