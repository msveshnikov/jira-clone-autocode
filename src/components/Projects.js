import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    DialogActions,
    CircularProgress,
    IconButton,
    Chip
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { getProjects, createProject, updateProject, deleteProject } from '../services/apiService';

const Projects = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [projectData, setProjectData] = useState({ name: '', description: '' });
    const [editingProject, setEditingProject] = useState(null);
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, selectProject } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const fetchProjects = async () => {
        if (user) {
            try {
                setIsLoading(true);
                const fetchedProjects = await getProjects();
                setProjects(fetchedProjects);
                setIsLoading(false);
            } catch (err) {
                setError('Error loading projects');
                setIsLoading(false);
            }
        }
    };

    const handleOpenDialog = (project = null) => {
        if (project) {
            setProjectData({ name: project.name, description: project.description });
            setEditingProject(project);
        } else {
            setProjectData({ name: '', description: '' });
            setEditingProject(null);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setProjectData({ name: '', description: '' });
        setEditingProject(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProjectData({ ...projectData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProject) {
                await updateProject({ id: editingProject._id, ...projectData });
            } else {
                await createProject(projectData);
            }
            fetchProjects();
            handleCloseDialog();
        } catch (err) {
            setError('Error saving project');
        }
    };

    const handleDeleteProject = async (projectId) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await deleteProject(projectId);
                fetchProjects();
            } catch (err) {
                setError('Error deleting project');
            }
        }
    };

    const handleSelectProject = (project) => {
        selectProject(project);
        navigate(`/project/${project._id}`);
    };

    if (isLoading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Projects
            </Typography>
            <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
                sx={{ mb: 2 }}
            >
                Create New Project
            </Button>
            <Grid container spacing={3}>
                {projects.map((project) => (
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
                                    onClick={() => handleDeleteProject(project._id)}
                                    aria-label="delete"
                                >
                                    <Delete />
                                </IconButton>
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} color="primary">
                        {editingProject ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Projects;