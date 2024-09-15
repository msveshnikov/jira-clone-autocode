import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import createCustomTheme from './utils/theme';
import Backlog from './components/Backlog';
import SprintBoard from './components/SprintBoard';
import TaskCard from './components/TaskCard';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Projects from './components/Projects';
import Profile from './components/Profile';
import { Container } from '@mui/material';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import PropTypes from 'prop-types';

function PrivateRoute({ children }) {
    const { isAuthenticated, loading } = useContext(AuthContext);
    if (loading) return null;
    return isAuthenticated ? children : <Navigate to="/login" />;
}

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired
};

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
                                            <Projects />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/project/:projectId"
                                    element={
                                        <PrivateRoute>
                                            <SprintBoard />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/project/:projectId/backlog"
                                    element={
                                        <PrivateRoute>
                                            <Backlog />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/project/:projectId/task/:taskId"
                                    element={
                                        <PrivateRoute>
                                            <TaskCard />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/profile"
                                    element={
                                        <PrivateRoute>
                                            <Profile />
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
    );
}

export default App;
