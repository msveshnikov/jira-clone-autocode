/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
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
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import {
    fetchTask,
    updateTask,
    deleteTask,
    logTime,
    addAttachment,
    removeAttachment,
    addComment,
    removeComment,
    assignTask,
    updateTaskDueDate
} from '../services/apiService';

const TaskCard = ({ id, onAssign, onUpdateDueDate }) => {
    const [task, setTask] = useState({
        title: '',
        description: '',
        points: 0,
        priority: 'low',
        status: 'todo',
        assignedTo: '',
        timeSpent: 0,
        attachments: [],
        comments: [],
        dueDate: null
    });
    const [timeToLog, setTimeToLog] = useState(0);
    const [newAttachment, setNewAttachment] = useState('');
    const [newComment, setNewComment] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadTask = async () => {
            try {
                const taskData = await fetchTask(id);
                setTask(taskData);
                setLoading(false);
            } catch (err) {
                setError('Error loading task');
                setLoading(false);
            }
        };
        loadTask();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTask((prevTask) => ({
            ...prevTask,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateTask({ id, ...task });
        } catch (err) {
            setError('Error updating task');
        }
    };

    const handleDelete = () => {
        setConfirmDelete(true);
    };

    const confirmDeleteTask = async () => {
        try {
            await deleteTask(id);
            setConfirmDelete(false);
        } catch (err) {
            setError('Error deleting task');
        }
    };

    const handleLogTime = async () => {
        try {
            await logTime(id, timeToLog);
            setTask((prevTask) => ({
                ...prevTask,
                timeSpent: prevTask.timeSpent + timeToLog
            }));
            setTimeToLog(0);
        } catch (err) {
            setError('Error logging time');
        }
    };

    const handleAddAttachment = async () => {
        try {
            const attachment = await addAttachment(id, newAttachment);
            setTask((prevTask) => ({
                ...prevTask,
                attachments: [...prevTask.attachments, attachment]
            }));
            setNewAttachment('');
        } catch (err) {
            setError('Error adding attachment');
        }
    };

    const handleRemoveAttachment = async (attachmentId) => {
        try {
            await removeAttachment(id, attachmentId);
            setTask((prevTask) => ({
                ...prevTask,
                attachments: prevTask.attachments.filter((a) => a._id !== attachmentId)
            }));
        } catch (err) {
            setError('Error removing attachment');
        }
    };

    const handleAddComment = async () => {
        try {
            const comment = await addComment(id, newComment);
            setTask((prevTask) => ({
                ...prevTask,
                comments: [...prevTask.comments, comment]
            }));
            setNewComment('');
        } catch (err) {
            setError('Error adding comment');
        }
    };

    const handleRemoveComment = async (commentId) => {
        try {
            await removeComment(id, commentId);
            setTask((prevTask) => ({
                ...prevTask,
                comments: prevTask.comments.filter((c) => c._id !== commentId)
            }));
        } catch (err) {
            setError('Error removing comment');
        }
    };

    const handleAssign = async (userId) => {
        try {
            await assignTask(id, userId);
            onAssign(id, userId);
        } catch (err) {
            setError('Error assigning task');
        }
    };

    const handleDueDateChange = async (e) => {
        const newDueDate = e.target.value;
        try {
            await updateTaskDueDate(id, newDueDate);
            onUpdateDueDate(id, newDueDate);
            setTask((prevTask) => ({ ...prevTask, dueDate: newDueDate }));
        } catch (err) {
            setError('Error updating due date');
        }
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Card>
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
                                    <MenuItem value="inprogress">In Progress</MenuItem>
                                    <MenuItem value="readytotest">Ready to Test</MenuItem>
                                    <MenuItem value="codereview">Code Review</MenuItem>
                                    <MenuItem value="qa">QA</MenuItem>
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
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Due Date"
                                type="date"
                                value={task.dueDate ? task.dueDate.split('T')[0] : ''}
                                onChange={handleDueDateChange}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ mt: 2, mb: 2 }}>
                                <Chip label={task.priority.toUpperCase()} color="primary" />
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
                            <List>
                                {task.attachments?.map((attachment) => (
                                    <ListItem key={attachment._id}>
                                        <ListItemText primary={attachment.name} />
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() =>
                                                    handleRemoveAttachment(attachment._id)
                                                }
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <TextField
                                    label="New Attachment URL"
                                    value={newAttachment}
                                    onChange={(e) => setNewAttachment(e.target.value)}
                                    sx={{ mr: 2 }}
                                />
                                <Button
                                    variant="outlined"
                                    onClick={handleAddAttachment}
                                    startIcon={<AttachFileIcon />}
                                >
                                    Add Attachment
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1">Comments</Typography>
                            <List>
                                {task.comments?.map((comment) => (
                                    <ListItem key={comment._id}>
                                        <ListItemText
                                            primary={comment.text}
                                            secondary={`By ${comment.author}`}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() => handleRemoveComment(comment._id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <TextField
                                    label="New Comment"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    sx={{ mr: 2 }}
                                />
                                <Button variant="outlined" onClick={handleAddComment}>
                                    Add Comment
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
            <Dialog
                open={confirmDelete}
                onClose={() => setConfirmDelete(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{'Confirm Delete'}</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this task?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDelete(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDeleteTask} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default TaskCard;
