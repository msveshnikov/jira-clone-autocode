import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import PropTypes from 'prop-types';
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
import { useAuth } from '../contexts/AuthContext';

const TaskCard = () => {
    const { taskId, projectId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuth();
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

    const {
        data: fetchedTask,
        isLoading,
        isError
    } = useQuery(['task', taskId], () => fetchTask(taskId));

    const updateTaskMutation = useMutation(updateTask, {
        onSuccess: () => {
            queryClient.invalidateQueries(['task', taskId]);
            queryClient.invalidateQueries(['tasks', projectId]);
        }
    });

    const deleteTaskMutation = useMutation(deleteTask, {
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks', projectId]);
            navigate(`/project/${projectId}`);
        }
    });

    const logTimeMutation = useMutation(logTime, {
        onSuccess: () => {
            queryClient.invalidateQueries(['task', taskId]);
        }
    });

    const addAttachmentMutation = useMutation(addAttachment, {
        onSuccess: () => {
            queryClient.invalidateQueries(['task', taskId]);
            setNewAttachment('');
        }
    });

    const removeAttachmentMutation = useMutation(removeAttachment, {
        onSuccess: () => {
            queryClient.invalidateQueries(['task', taskId]);
        }
    });

    const addCommentMutation = useMutation(addComment, {
        onSuccess: () => {
            queryClient.invalidateQueries(['task', taskId]);
            setNewComment('');
        }
    });

    const removeCommentMutation = useMutation(removeComment, {
        onSuccess: () => {
            queryClient.invalidateQueries(['task', taskId]);
        }
    });

    const assignTaskMutation = useMutation(assignTask, {
        onSuccess: () => {
            queryClient.invalidateQueries(['task', taskId]);
        }
    });

    const updateTaskDueDateMutation = useMutation(updateTaskDueDate, {
        onSuccess: () => {
            queryClient.invalidateQueries(['task', taskId]);
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
        updateTaskMutation.mutate({ id: taskId, ...task });
    };

    const handleDelete = () => {
        setConfirmDelete(true);
    };

    const confirmDeleteTask = () => {
        deleteTaskMutation.mutate(taskId);
        setConfirmDelete(false);
    };

    const handleLogTime = () => {
        logTimeMutation.mutate({ taskId, timeSpent: timeToLog });
        setTimeToLog(0);
    };

    const handleAddAttachment = () => {
        addAttachmentMutation.mutate({
            taskId,
            attachment: { name: newAttachment, url: newAttachment }
        });
    };

    const handleRemoveAttachment = (attachmentId) => {
        removeAttachmentMutation.mutate({ taskId, attachmentId });
    };

    const handleAddComment = () => {
        addCommentMutation.mutate({
            taskId,
            comment: { text: newComment, author: user.id }
        });
    };

    const handleRemoveComment = (commentId) => {
        removeCommentMutation.mutate({ taskId, commentId });
    };

    const handleAssign = (userId) => {
        assignTaskMutation.mutate({ taskId, assigneeId: userId });
    };

    const handleDueDateChange = (e) => {
        const newDueDate = e.target.value;
        updateTaskDueDateMutation.mutate({ taskId, dueDate: newDueDate });
    };

    const handleCancel = () => {
        navigate(`/project/${projectId}`);
    };

    if (isLoading) return <Typography>Loading...</Typography>;
    if (isError) return <Typography>Error loading task</Typography>;

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
                                    <ListItem key={attachment.id}>
                                        <ListItemText primary={attachment.name} />
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() =>
                                                    handleRemoveAttachment(attachment.id)
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
                                    <ListItem key={comment.id}>
                                        <ListItemText
                                            primary={comment.text}
                                            secondary={`By ${comment.author}`}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() => handleRemoveComment(comment.id)}
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
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleCancel}
                                >
                                    Cancel
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

TaskCard.propTypes = {
    id: PropTypes.string,
    projectId: PropTypes.string
};

export default TaskCard;
