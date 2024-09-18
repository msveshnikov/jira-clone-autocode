import React, { useState, useEffect, useContext } from 'react';
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
    DialogActions,
    Link
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
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
    updateTaskDueDate,
    createTask,
    getAllUsers
} from '../services/apiService';
import { AuthContext } from '../contexts/AuthContext';

const TaskCard = ({ id, onDelete, onUpdate, projectId }) => {
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
    const { user } = useContext(AuthContext);
    const [timeToLog, setTimeToLog] = useState(0);
    const [newAttachment, setNewAttachment] = useState('');
    const [newComment, setNewComment] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const loadTask = async () => {
            if (id) {
                const taskData = await fetchTask(id);
                setTask(taskData);
            } else {
                setTask({
                    title: '',
                    description: '',
                    points: 0,
                    priority: 'low',
                    status: 'todo',
                    assignedTo: '',
                    timeSpent: 0,
                    timeEstimate: 0,
                    attachments: [],
                    comments: [],
                    dueDate: null,
                    subtasks: [],
                    dependencies: []
                });
            }
            setLoading(false);
        };
        const loadUsers = async () => {
            const usersData = await getAllUsers();
            setUsers(usersData);
        };
        loadTask();
        loadUsers();
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
        if (id) {
            await updateTask({ id, ...task });
        } else {
            await createTask(projectId, task);
        }
        onUpdate(task);
    };

    const handleDelete = () => {
        setConfirmDelete(true);
    };

    const confirmDeleteTask = async () => {
        await deleteTask(id);
        setConfirmDelete(false);
        onDelete(id);
    };

    const handleLogTime = async () => {
        await logTime(id, timeToLog);
        setTask((prevTask) => ({
            ...prevTask,
            timeSpent: prevTask.timeSpent + timeToLog
        }));
        setTimeToLog(0);
    };

    const handleAddAttachment = async () => {
        const attachment = await addAttachment(id, newAttachment);
        setTask((prevTask) => ({
            ...prevTask,
            attachments: [...prevTask.attachments, attachment]
        }));
        setNewAttachment('');
    };

    const handleRemoveAttachment = async (attachmentId) => {
        await removeAttachment(id, attachmentId);
        setTask((prevTask) => ({
            ...prevTask,
            attachments: prevTask.attachments.filter((a) => a._id !== attachmentId)
        }));
    };

    const handleAddComment = async () => {
        await addComment(id, newComment);
        setTask((prevTask) => ({
            ...prevTask,
            comments: [...prevTask.comments, { text: newComment, author: { name: user.name } }]
        }));
        setNewComment('');
    };

    const handleRemoveComment = async (commentId) => {
        await removeComment(id, commentId);
        setTask((prevTask) => ({
            ...prevTask,
            comments: prevTask.comments.filter((c) => c._id !== commentId)
        }));
    };

    const handleAssign = async (e) => {
        const userId = e.target.value;
        await assignTask(id, userId);
        setTask((prevTask) => ({ ...prevTask, assignedTo: userId }));
    };

    const handleDueDateChange = async (e) => {
        const newDueDate = e.target.value;
        await updateTaskDueDate(id, newDueDate);
        setTask((prevTask) => ({ ...prevTask, dueDate: newDueDate }));
    };

    const truncateUrl = (url, maxLength = 50) => {
        if (url?.length <= maxLength) return url;
        return url?.substring(0, maxLength - 3) + '...';
    };

    if (loading) return <Typography>Loading...</Typography>;

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
                                required
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
                            <FormControl fullWidth>
                                <InputLabel>Assigned To</InputLabel>
                                {users.length > 0 && (
                                    <Select
                                        name="assignedTo"
                                        value={task.assignedTo || ''}
                                        onChange={handleAssign}
                                    >
                                        <MenuItem value="">Unassigned</MenuItem>
                                        {users.map((user) => (
                                            <MenuItem key={user._id} value={user._id}>
                                                {user?.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            </FormControl>
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
                                <Button
                                    variant="outlined"
                                    onClick={handleLogTime}
                                    startIcon={<AccessTimeIcon />}
                                >
                                    Log Time
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1">Attachments</Typography>
                            <List>
                                {task.attachments?.map((attachment) => (
                                    <ListItem key={attachment._id}>
                                        <ListItemText
                                            primary={
                                                <Link
                                                    href={attachment.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    sx={{
                                                        wordBreak: 'break-all',
                                                        display: 'inline-block',
                                                        maxWidth: '100%',
                                                        padding: '4px 8px',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                                        }
                                                    }}
                                                >
                                                    {truncateUrl(attachment.url)}
                                                </Link>
                                            }
                                        />
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
                                    sx={{ mr: 2, flexGrow: 1 }}
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
                                            secondary={`By ${comment.author?.name} on ${new Date(
                                                comment.createdAt
                                            ).toLocaleString()}`}
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
                                    sx={{ mr: 2, flexGrow: 1 }}
                                />
                                <Button variant="outlined" onClick={handleAddComment}>
                                    Add Comment
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                <Button type="submit" variant="contained" color="primary">
                                    {id ? 'Update Task' : 'Create Task'}
                                </Button>
                                {id && (
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={handleDelete}
                                    >
                                        Delete Task
                                    </Button>
                                )}
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
    onDelete: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    projectId: PropTypes.string
};

export default TaskCard;
