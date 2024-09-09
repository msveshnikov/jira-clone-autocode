/* eslint-disable react/prop-types */
import React from 'react';
import { Link } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    useTheme,
    useMediaQuery,
    Box
} from '@mui/material';
import { Brightness4, Brightness7, Menu } from '@mui/icons-material';

const Header = ({ toggleDarkMode, darkMode }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <AppBar position="static">
            <Toolbar sx={{ width: '100%', maxWidth: 'none' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    {isMobile && (
                        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                            <Menu />
                        </IconButton>
                    )}
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        JIRA Clone
                    </Typography>
                    {!isMobile && (
                        <>
                            <Button color="inherit" component={Link} to="/">
                                Backlog
                            </Button>
                            <Button color="inherit" component={Link} to="/sprint-board">
                                Sprint Board
                            </Button>
                        </>
                    )}
                    <IconButton color="inherit" onClick={toggleDarkMode}>
                        {darkMode ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
