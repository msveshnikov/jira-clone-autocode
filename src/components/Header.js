import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    useTheme,
    useMediaQuery,
    Box,
    Menu,
    MenuItem,
    Avatar
} from '@mui/material';
import { Brightness4, Brightness7, Menu as MenuIcon, AccountCircle } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import { clearToken } from '../services/apiService';

const Header = ({ toggleDarkMode, darkMode }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [anchorEl, setAnchorEl] = useState(null);
    const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
    const { user, setUser } = useContext(AuthContext);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleUserMenuOpen = (event) => {
        setUserMenuAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setUserMenuAnchorEl(null);
    };

    const handleLogout = () => {
        clearToken();
        setUser(null);
        handleUserMenuClose();
    };

    return (
        <AppBar position="static">
            <Toolbar sx={{ width: '100%', maxWidth: 'none' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    {isMobile && (
                        <>
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                onClick={handleMenuOpen}
                                sx={{ mr: 2 }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem component={Link} to="/backlog" onClick={handleMenuClose}>
                                    Backlog
                                </MenuItem>
                                <MenuItem component={Link} to="/" onClick={handleMenuClose}>
                                    Sprint Board
                                </MenuItem>
                            </Menu>
                        </>
                    )}
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        JIRA
                    </Typography>
                    {!isMobile && (
                        <>
                            <Button color="inherit" component={Link} to="/backlog">
                                Backlog
                            </Button>
                            <Button color="inherit" component={Link} to="/">
                                Sprint Board
                            </Button>
                        </>
                    )}
                    <IconButton
                        color="inherit"
                        onClick={toggleDarkMode}
                        aria-label="toggle dark mode"
                    >
                        {darkMode ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>
                    {user ? (
                        <>
                            <IconButton
                                color="inherit"
                                onClick={handleUserMenuOpen}
                                aria-label="user menu"
                            >
                                <Avatar alt={user.name} src={user.avatar} />
                            </IconButton>
                            <Menu
                                anchorEl={userMenuAnchorEl}
                                open={Boolean(userMenuAnchorEl)}
                                onClose={handleUserMenuClose}
                            >
                                <MenuItem onClick={handleUserMenuClose}>Profile</MenuItem>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <IconButton color="inherit" aria-label="login">
                            <AccountCircle />
                        </IconButton>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

Header.propTypes = {
    toggleDarkMode: PropTypes.func.isRequired,
    darkMode: PropTypes.bool.isRequired
};

export default Header;
