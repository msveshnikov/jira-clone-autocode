import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './context/AuthContext';
import createCustomTheme from './utils/theme';
import Backlog from './components/Backlog';
import SprintBoard from './components/SprintBoard';
import TaskCard from './components/TaskCard';
import Header from './components/Header';

const queryClient = new QueryClient();

function App() {
    const [darkMode, setDarkMode] = useState(false);
    const theme = createCustomTheme(darkMode ? 'dark' : 'light');

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <AuthProvider>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <div className="App">
                            <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
                            <Routes>
                                <Route path="/" element={<Backlog />} />
                                <Route path="/sprint-board" element={<SprintBoard />} />
                                <Route path="/task/:id" element={<TaskCard />} />
                            </Routes>
                        </div>
                    </ThemeProvider>
                </AuthProvider>
            </Router>
        </QueryClientProvider>
    );
}

export default App;
