/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Switch } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';

const Header = ({ toggleDarkMode, darkMode }) => {
    const { user, logout } = useContext(AuthContext);

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    JIRA Clone
                </Typography>
                <Button color="inherit" component={Link} to="/">
                    Backlog
                </Button>
                <Button color="inherit" component={Link} to="/sprint-board">
                    Sprint Board
                </Button>
                <IconButton color="inherit" onClick={toggleDarkMode}>
                    {darkMode ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
                <Switch checked={darkMode} onChange={toggleDarkMode} color="default" />
                {user ? (
                    <>
                        <Typography variant="subtitle1" sx={{ mr: 2 }}>
                            {user.name}
                        </Typography>
                        <Button color="inherit" onClick={logout}>
                            Logout
                        </Button>
                    </>
                ) : (
                    <Button color="inherit" component={Link} to="/login">
                        Login
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
