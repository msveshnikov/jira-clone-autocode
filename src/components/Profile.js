import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
    Typography,
    Avatar,
    Paper,
    Grid,
    TextField,
    Button,
    CircularProgress,
    Box,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';
import { getUser, updateUser, deleteProject } from '../services/apiService';

const Profile = () => {
    const { userId } = useParams();
    const { user: currentUser } = useContext(AuthContext);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        bio: ''
    });
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUser(userId);
                setUser(userData);
                setFormData({
                    name: userData.name,
                    email: userData.email,
                    role: userData.role,
                    bio: userData.bio || ''
                });
                setIsLoading(false);
            } catch (error) {
                setIsError(true);
                setIsLoading(false);
            }
        };
        fetchUser();
    }, [userId]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUser(userId, formData);
            setUser({ ...user, ...formData });
            setEditMode(false);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleDeleteProject = (projectId) => {
        setProjectToDelete(projectId);
        setConfirmDelete(true);
    };

    const confirmDeleteProject = async () => {
        try {
            await deleteProject(projectToDelete);
            setUser({
                ...user,
                projects: user.projects.filter((project) => project._id !== projectToDelete)
            });
            setConfirmDelete(false);
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    if (isLoading) return <CircularProgress />;
    if (isError) return <Typography color="error">Error loading user data</Typography>;
    if (!user) return <Typography>User not found</Typography>;

    return (
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Grid container spacing={3} alignItems="center">
                <Grid item>
                    <Avatar src={user.avatar} alt={user.name} sx={{ width: 100, height: 100 }} />
                </Grid>
                <Grid item xs>
                    {editMode ? (
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                margin="normal"
                                name="name"
                                label="Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                name="email"
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                name="role"
                                label="Role"
                                value={formData.role}
                                onChange={handleInputChange}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                name="bio"
                                label="Bio"
                                multiline
                                rows={4}
                                value={formData.bio}
                                onChange={handleInputChange}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2 }}
                            >
                                Save
                            </Button>
                            <Button onClick={() => setEditMode(false)} sx={{ mt: 2, ml: 2 }}>
                                Cancel
                            </Button>
                        </form>
                    ) : (
                        <>
                            <Typography variant="h4">{user.name}</Typography>
                            <Typography variant="subtitle1">{user.email}</Typography>
                            <Typography variant="body1">{user.role}</Typography>
                            <Typography variant="body2" sx={{ mt: 2 }}>
                                {user.bio}
                            </Typography>
                            {(currentUser._id === user._id || currentUser.role === 'admin') && (
                                <Button onClick={() => setEditMode(true)} sx={{ mt: 2 }}>
                                    Edit Profile
                                </Button>
                            )}
                        </>
                    )}
                </Grid>
            </Grid>
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6">Projects</Typography>
                <List>
                    {user.projects?.map((project) => (
                        <ListItem key={project._id}>
                            <ListItemText primary={project.name} />
                            <ListItemSecondaryAction>
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => handleDeleteProject(project._id)}
                                >
                                    <Delete />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6">Skills</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {user.skills?.map((skill) => (
                        <Chip key={skill} label={skill} />
                    ))}
                </Box>
            </Box>
            <Dialog
                open={confirmDelete}
                onClose={() => setConfirmDelete(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{'Confirm Delete'}</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this project?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDelete(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDeleteProject} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default Profile;
