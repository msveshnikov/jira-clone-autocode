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
    DialogActions,
    Card,
    CardContent,
    Divider
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
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
        <Box sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
            <Card elevation={3}>
                <CardContent>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item>
                            <Avatar src={user.avatar} alt={user.name} sx={{ width: 120, height: 120 }} />
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
                                    <Box sx={{ mt: 2 }}>
                                        <Button type="submit" variant="contained" color="primary">
                                            Save
                                        </Button>
                                        <Button onClick={() => setEditMode(false)} sx={{ ml: 2 }}>
                                            Cancel
                                        </Button>
                                    </Box>
                                </form>
                            ) : (
                                <>
                                    <Typography variant="h4" gutterBottom>{user.name}</Typography>
                                    <Typography variant="subtitle1" color="textSecondary" gutterBottom>{user.email}</Typography>
                                    <Typography variant="body1" gutterBottom>{user.role}</Typography>
                                    <Typography variant="body2" sx={{ mt: 2 }}>{user.bio}</Typography>
                                    {(currentUser._id === user._id || currentUser.role === 'admin') && (
                                        <Button
                                            startIcon={<Edit />}
                                            onClick={() => setEditMode(true)}
                                            sx={{ mt: 2 }}
                                            variant="outlined"
                                        >
                                            Edit Profile
                                        </Button>
                                    )}
                                </>
                            )}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Card sx={{ mt: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Skills</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {user.skills?.map((skill) => (
                            <Chip key={skill} label={skill} variant="outlined" />
                        ))}
                    </Box>
                </CardContent>
            </Card>

            <Card sx={{ mt: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Projects</Typography>
                    <List>
                        {user.projects?.map((project) => (
                            <React.Fragment key={project._id}>
                                <ListItem>
                                    <ListItemText primary={project.name} secondary={project.description} />
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
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                </CardContent>
            </Card>

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
        </Box>
    );
};

export default Profile;