import React, { useState, useEffect, useContext } from 'react';
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
  DialogContentText,
  DialogActions,
  CircularProgress,
  IconButton,
  Chip,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';
import {
  getUserProjects,
  createUserProject,
  updateProject,
  deleteProject,
} from '../services/apiService';

const Projects = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [projectData, setProjectData] = useState({ name: '', description: '' });
  const [editingProject, setEditingProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { user, selectProject } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
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
        setSnackbar({ open: true, message: 'Project updated successfully', severity: 'success' });
      } else {
        await createUserProject(projectData);
        setSnackbar({ open: true, message: 'Project created successfully', severity: 'success' });
      }
      fetchProjects();
      handleCloseDialog();
    } catch (err) {
      setSnackbar({ open: true, message: 'Error saving project', severity: 'error' });
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
      setSnackbar({ open: true, message: 'Project deleted successfully', severity: 'success' });
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
              startAdornment: <Search color="action" />,
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
                <Chip label={`Owner: ${project.owner.name}`} size="small" sx={{ mt: 1 }} />
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
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Project"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the project {projectToDelete?.name}? This action cannot be undone.
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
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Projects;