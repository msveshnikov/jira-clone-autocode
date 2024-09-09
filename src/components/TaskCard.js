import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Select,
    MenuItem,
    Button,
    Box,
    Chip,
    Grid,
    FormControl,
    InputLabel,
    IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    fetchTask,
    updateTask,
    deleteTask,
    logTime,
    addAttachment,
    removeAttachment
} from '../services/apiService';

const TaskCard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [task, setTask] = useState({
        title: '',
        description: '',
        points: 0,
        priority: 'low',
        status: 'todo',
        assignedTo: '',
        timeSpent: 0,
        attachments: []
    });
    const [timeToLog, setTimeToLog] = useState(0);
    const [newAttachment, setNewAttachment] = useState('');

    const { data: fetchedTask, isLoading, isError } = useQuery(['task', id], () => fetchTask(id));

    const updateTaskMutation = useMutation(updateTask, {
        onSuccess: () => {
            queryClient.invalidateQueries(['task', id]);
        }
    });

    const deleteTaskMutation = useMutation(deleteTask, {
        onSuccess: () => {
            navigate('/');
        }
    });

    const logTimeMutation = useMutation(logTime, {
        onSuccess: () => {
            queryClient.invalidateQueries(['task', id]);
        }
    });

    const addAttachmentMutation = useMutation(addAttachment, {
        onSuccess: () => {
            queryClient.invalidateQueries(['task', id]);
            setNewAttachment('');
        }
    });

    const removeAttachmentMutation = useMutation(removeAttachment, {
        onSuccess: () => {
            queryClient.invalidateQueries(['task', id]);
        }
    });

    useEffect(() => {
        if (fetchedTask) {
            setTask(fetchedTask);
        }
    }, [fetchedTask]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTask((prevTask) => ({
            ...prevTask,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateTaskMutation.mutate({ id, ...task });
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            deleteTaskMutation.mutate(id);
        }
    };

    const handleLogTime = () => {
        logTimeMutation.mutate({ taskId: id, timeSpent: timeToLog });
        setTimeToLog(0);
    };

    const handleAddAttachment = () => {
        addAttachmentMutation.mutate({
            taskId: id,
            attachment: { id: Date.now(), url: newAttachment }
        });
    };

    const handleRemoveAttachment = (attachmentId) => {
        removeAttachmentMutation.mutate({ taskId: id, attachmentId });
    };

    if (isLoading) return <Typography>Loading...</Typography>;
    if (isError) return <Typography>Error loading task</Typography>;

    const priorityColors = {
        low: 'success',
        medium: 'warning',
        high: 'error'
    };

    return (
        <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Title"
                                name="title"
                                value={task.title}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                multiline
                                rows={4}
                                value={task.description}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Points"
                                name="points"
                                type="number"
                                value={task.points}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>Priority</InputLabel>
                                <Select
                                    name="priority"
                                    value={task.priority}
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value="low">Low</MenuItem>
                                    <MenuItem value="medium">Medium</MenuItem>
                                    <MenuItem value="high">High</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    name="status"
                                    value={task.status}
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value="todo">To Do</MenuItem>
                                    <MenuItem value="inProgress">In Progress</MenuItem>
                                    <MenuItem value="done">Done</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Assigned To"
                                name="assignedTo"
                                value={task.assignedTo}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ mt: 2, mb: 2 }}>
                                <Chip
                                    label={task.priority.toUpperCase()}
                                    color={priorityColors[task.priority]}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1">
                                Time Spent: {task.timeSpent} hours
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <TextField
                                    label="Log Time"
                                    type="number"
                                    value={timeToLog}
                                    onChange={(e) => setTimeToLog(Number(e.target.value))}
                                    sx={{ mr: 2 }}
                                />
                                <Button variant="outlined" onClick={handleLogTime}>
                                    Log Time
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1">Attachments</Typography>
                            {task.attachments.map((attachment) => (
                                <Box
                                    key={attachment.id}
                                    sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
                                >
                                    <Typography>{attachment.url}</Typography>
                                    <IconButton
                                        onClick={() => handleRemoveAttachment(attachment.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            ))}
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <TextField
                                    label="New Attachment URL"
                                    value={newAttachment}
                                    onChange={(e) => setNewAttachment(e.target.value)}
                                    sx={{ mr: 2 }}
                                />
                                <Button variant="outlined" onClick={handleAddAttachment}>
                                    Add Attachment
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                <Button type="submit" variant="contained" color="primary">
                                    Update Task
                                </Button>
                                <Button variant="contained" color="error" onClick={handleDelete}>
                                    Delete Task
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    );
};

export default TaskCard;
