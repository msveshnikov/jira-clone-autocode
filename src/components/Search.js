import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { searchTasks } from '../services/apiService';
import TaskCard from './TaskCard';

const Search = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openTaskId, setOpenTaskId] = useState(null);
    const { projectId } = useParams();
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search).get('q') || '';

    useEffect(() => {
        if (searchQuery) {
            performSearch();
        } else {
            setSearchResults([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, projectId]);

    const performSearch = async () => {
        setLoading(true);
        setError(null);
        try {
            const results = await searchTasks(projectId, searchQuery);
            setSearchResults(results);
        } catch (err) {
            setError('Error searching tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenTask = (taskId) => {
        setOpenTaskId(taskId);
    };

    const handleCloseTask = () => {
        setOpenTaskId(null);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Search Results
            </Typography>
            {loading && <CircularProgress />}
            {error && <Typography color="error">{error}</Typography>}
            <Grid container spacing={3}>
                {searchResults.map((task) => (
                    <Grid item xs={12} sm={6} md={4} key={task._id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{task.title}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {task.description}
                                </Typography>
                                <Typography variant="body2">Status: {task.status}</Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    size="small"
                                    color="primary"
                                    onClick={() => handleOpenTask(task._id)}
                                >
                                    View Details
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Dialog open={!!openTaskId} onClose={handleCloseTask} maxWidth="md" fullWidth>
                <DialogTitle>
                    Task Details
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseTask}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500]
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {openTaskId && (
                        <TaskCard
                            onDelete={() => setOpenTaskId(null)}
                            onUpdate={() => setOpenTaskId(null)}
                            id={openTaskId}
                            projectId={projectId}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default Search;
