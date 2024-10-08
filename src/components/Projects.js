import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    CircularProgress,
    IconButton,
    Chip,
    Snackbar,
    Alert,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import { Add, Edit, Delete, Search, PersonAdd, PersonRemove } from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';
import {
    getUserProjects,
    createUserProject,
    updateProject,
    deleteProject,
    getAllUsers,
    addUserToProject,
    removeUserFromProject,
    generateBacklog
} from '../services/apiService';

const Projects = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openUserDialog, setOpenUserDialog] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [projectData, setProjectData] = useState({
        name: '',
        description: '',
        generateBacklog: false
    });
    const [editingProject, setEditingProject] = useState(null);
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [allUsers, setAllUsers] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isGeneratingBacklog, setIsGeneratingBacklog] = useState(false);
    const { user, selectProject } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
        fetchAllUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        setFilteredProjects(
            projects.filter(
                (project) =>
                    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    project.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, projects]);

    const fetchProjects = async () => {
        if (user) {
            try {
                setIsLoading(true);
                const fetchedProjects = await getUserProjects();
                setProjects(fetchedProjects);
                setFilteredProjects(fetchedProjects);
                setIsLoading(false);
            } catch (err) {
                setError('Error loading projects');
                setIsLoading(false);
            }
        }
    };

    const fetchAllUsers = async () => {
        try {
            const users = await getAllUsers();
            setAllUsers(users);
        } catch (err) {
            setError('Error loading users');
        }
    };

    const handleOpenDialog = (project = null) => {
        if (project) {
            setProjectData({
                name: project.name,
                description: project.description,
                generateBacklog: false
            });
            setEditingProject(project);
        } else {
            setProjectData({ name: '', description: '', generateBacklog: false });
            setEditingProject(null);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setProjectData({ name: '', description: '', generateBacklog: false });
        setEditingProject(null);
    };

    const handleInputChange = (e) => {
        const { name, value, checked } = e.target;
        setProjectData({ ...projectData, [name]: name === 'generateBacklog' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProject) {
                await updateProject({ id: editingProject._id, ...projectData });
                setSnackbar({
                    open: true,
                    message: 'Project updated successfully',
                    severity: 'success'
                });
            } else {
                const newProject = await createUserProject(projectData);
                if (projectData.generateBacklog) {
                    setIsGeneratingBacklog(true);
                    await generateBacklog(newProject._id, projectData.description);
                    setIsGeneratingBacklog(false);
                }
                setSnackbar({
                    open: true,
                    message: 'Project created successfully',
                    severity: 'success'
                });
            }
            fetchProjects();
            handleCloseDialog();
        } catch (err) {
            setSnackbar({ open: true, message: 'Error saving project', severity: 'error' });
            setIsGeneratingBacklog(false);
        }
    };

    const handleOpenDeleteDialog = (project) => {
        setProjectToDelete(project);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setProjectToDelete(null);
    };

    const handleDeleteProject = async () => {
        try {
            await deleteProject(projectToDelete._id);
            fetchProjects();
            handleCloseDeleteDialog();
            setSnackbar({
                open: true,
                message: 'Project deleted successfully',
                severity: 'success'
            });
        } catch (err) {
            setSnackbar({ open: true, message: 'Error deleting project', severity: 'error' });
        }
    };

    const handleSelectProject = (project) => {
        selectProject(project);
        navigate(`/project/${project._id}`);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    const handleOpenUserDialog = (project) => {
        setSelectedProject(project);
        setOpenUserDialog(true);
    };

    const handleCloseUserDialog = () => {
        setOpenUserDialog(false);
        setSelectedProject(null);
    };

    const handleAddUser = async (userId) => {
        try {
            await addUserToProject(selectedProject._id, userId);
            fetchProjects();
            setSnackbar({
                open: true,
                message: 'User added to project successfully',
                severity: 'success'
            });
        } catch (err) {
            setSnackbar({ open: true, message: 'Error adding user to project', severity: 'error' });
        }
    };

    const handleRemoveUser = async (userId) => {
        try {
            await removeUserFromProject(selectedProject._id, userId);
            fetchProjects();
            setSnackbar({
                open: true,
                message: 'User removed from project successfully',
                severity: 'success'
            });
        } catch (err) {
            setSnackbar({
                open: true,
                message: 'Error removing user from project',
                severity: 'error'
            });
        }
    };

    if (isLoading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Projects
            </Typography>
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={() => handleOpenDialog()}
                        fullWidth
                    >
                        Create New Project
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={8}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search projects..."
                        InputProps={{
                            startAdornment: <Search color="action" />
                        }}
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                {filteredProjects.map((project) => (
                    <Grid item xs={12} sm={6} md={4} key={project._id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{project.name}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {project.description}
                                </Typography>
                                <Chip
                                    label={`Owner: ${project.owner.name}`}
                                    size="small"
                                    sx={{ mt: 1 }}
                                />
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={() => handleSelectProject(project)}>
                                    Open
                                </Button>
                                <IconButton
                                    size="small"
                                    onClick={() => handleOpenDialog(project)}
                                    aria-label="edit"
                                >
                                    <Edit />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    onClick={() => handleOpenDeleteDialog(project)}
                                    aria-label="delete"
                                >
                                    <Delete />
                                </IconButton>
                                {user._id === project.owner._id && (
                                    <IconButton
                                        size="small"
                                        onClick={() => handleOpenUserDialog(project)}
                                        aria-label="manage users"
                                    >
                                        <PersonAdd />
                                    </IconButton>
                                )}
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{editingProject ? 'Edit Project' : 'Create New Project'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Project Name"
                        type="text"
                        fullWidth
                        value={projectData.name}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Description"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={projectData.description}
                        onChange={handleInputChange}
                    />
                    {!editingProject && (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={projectData.generateBacklog}
                                    onChange={handleInputChange}
                                    name="generateBacklog"
                                />
                            }
                            label="AI generate your backlog"
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} color="primary" disabled={isGeneratingBacklog}>
                        {editingProject ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{'Delete Project'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete the project {projectToDelete?.name}? This
                        action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteProject} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openUserDialog} onClose={handleCloseUserDialog}>
                <DialogTitle>Manage Project Users</DialogTitle>
                <DialogContent>
                    <List>
                        {allUsers.map((u) => (
                            <ListItem sx={{ mt: 3 }} key={u._id}>
                                <ListItemText primary={u.name} secondary={u.email} />
                                <ListItemSecondaryAction>
                                    {selectedProject?.users?.some((pu) => pu._id === u._id) ? (
                                        <IconButton
                                            edge="end"
                                            aria-label="remove"
                                            onClick={() => handleRemoveUser(u._id)}
                                        >
                                            <PersonRemove />
                                        </IconButton>
                                    ) : (
                                        <IconButton
                                            edge="end"
                                            aria-label="add"
                                            onClick={() => handleAddUser(u._id)}
                                        >
                                            <PersonAdd />
                                        </IconButton>
                                    )}
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseUserDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
            {isGeneratingBacklog && (
                <Dialog open={isGeneratingBacklog}>
                    <DialogContent>
                        <CircularProgress />
                        <Typography>Generating backlog...</Typography>
                    </DialogContent>
                </Dialog>
            )}
        </Container>
    );
};

Projects.propTypes = {
    user: PropTypes.object,
    selectProject: PropTypes.func
};

export default Projects;
