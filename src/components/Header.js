import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
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
import {
    Brightness4,
    Brightness7,
    Menu as MenuIcon,
    ExitToApp,
    Search
} from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';

const Header = ({ toggleDarkMode, darkMode }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [anchorEl, setAnchorEl] = useState(null);
    const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
    const { user, logout, currentProject } = useContext(AuthContext);
    const navigate = useNavigate();

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
        logout();
        handleUserMenuClose();
        navigate('/login');
    };

    const renderMenuItems = () => (
        <>
            <MenuItem component={Link} to="/" onClick={handleMenuClose}>
                Projects
            </MenuItem>
            {currentProject && (
                <>
                    <MenuItem
                        component={Link}
                        to={`/project/${currentProject._id}/backlog`}
                        onClick={handleMenuClose}
                    >
                        Backlog
                    </MenuItem>
                    <MenuItem
                        component={Link}
                        to={`/project/${currentProject._id}`}
                        onClick={handleMenuClose}
                    >
                        Sprint Board
                    </MenuItem>
                </>
            )}
        </>
    );

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
                                {renderMenuItems()}
                            </Menu>
                        </>
                    )}
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        JIRA
                    </Typography>
                    {!isMobile && (
                        <>
                            <Button color="inherit" component={Link} to="/">
                                Projects
                            </Button>
                            {currentProject && (
                                <>
                                    <Button
                                        color="inherit"
                                        component={Link}
                                        to={`/project/${currentProject._id}/backlog`}
                                    >
                                        Backlog
                                    </Button>
                                    <Button
                                        color="inherit"
                                        component={Link}
                                        to={`/project/${currentProject._id}`}
                                    >
                                        Sprint Board
                                    </Button>
                                </>
                            )}
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
                                <MenuItem
                                    component={Link}
                                    to="/profile"
                                    onClick={handleUserMenuClose}
                                >
                                    Profile
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>
                                    <ExitToApp fontSize="small" sx={{ mr: 1 }} />
                                    Logout
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <Button color="inherit" component={Link} to="/login">
                            Login
                        </Button>
                    )}
                    <IconButton color="inherit" aria-label="search">
                        <Search />
                    </IconButton>
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