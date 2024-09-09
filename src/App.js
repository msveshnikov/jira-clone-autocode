import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from 'react-query';
import createCustomTheme from './utils/theme';
import Backlog from './components/Backlog';
import SprintBoard from './components/SprintBoard';
import TaskCard from './components/TaskCard';
import Header from './components/Header';
import { Container } from '@mui/material';

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
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <div
                        className="App"
                        style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
                    >
                        <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
                        <Container maxWidth={false} style={{ flexGrow: 1, padding: 0 }}>
                            <Routes>
                                <Route path="/" element={<SprintBoard />} />
                                <Route path="/backlog" element={<Backlog />} />
                                <Route path="/task/:id" element={<TaskCard />} />
                            </Routes>
                        </Container>
                    </div>
                </ThemeProvider>
            </Router>
        </QueryClientProvider>
    );
}

export default App;
