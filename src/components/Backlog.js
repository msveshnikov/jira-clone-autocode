import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Paper,
    Box,
    Chip,
    CircularProgress
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { fetchBacklogTasks, createTask, updateTaskOrder } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

const Backlog = () => {
    const [open, setOpen] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        points: 0,
        priority: 'low',
        assignedTo: '',
        status: 'todo'
    });
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: tasks, isLoading, isError } = useQuery('backlogTasks', fetchBacklogTasks);

    const createTaskMutation = useMutation(createTask, {
        onSuccess: () => {
            queryClient.invalidateQueries('backlogTasks');
            handleClose();
        }
    });

    const updateTaskOrderMutation = useMutation(updateTaskOrder, {
        onSuccess: () => {
            queryClient.invalidateQueries('backlogTasks');
        }
    });

    useEffect(() => {
        const savedTasks = localStorage.getItem('backlogTasks');
        if (savedTasks) {
            queryClient.setQueryData('backlogTasks', JSON.parse(savedTasks));
        }
    }, [queryClient]);

    useEffect(() => {
        if (tasks) {
            localStorage.setItem('backlogTasks', JSON.stringify(tasks));
        }
    }, [tasks]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setNewTask({
            title: '',
            description: '',
            points: 0,
            priority: 'low',
            assignedTo: '',
            status: 'todo'
        });
    };

    const handleCreateTask = () => {
        createTaskMutation.mutate(newTask);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask({ ...newTask, [name]: value });
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedTasks = Array.from(tasks);
        const [reorderedItem] = reorderedTasks.splice(result.source.index, 1);
        reorderedTasks.splice(result.destination.index, 0, reorderedItem);

        reorderedTasks.forEach((task, index) => {
            updateTaskOrderMutation.mutate({ id: task.id, order: index });
        });
    };

    const handleTaskClick = (taskId) => {
        navigate(`/task/${taskId}`);
    };

    const priorityColors = {
        low: 'success',
        medium: 'warning',
        high: 'error'
    };

    if (isLoading) return <CircularProgress />;
    if (isError) return <Typography>Error loading tasks</Typography>;

    return (
        <Box sx={{ my: 3, width: '100%', overflowX: 'auto' }}>
            <Container maxWidth={false}>
                <Typography variant="h4" gutterBottom>
                    Backlog
                </Typography>
                <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2 }}>
                    Add Task
                </Button>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="backlog">
                        {(provided) => (
                            <TableContainer
                                component={Paper}
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Points</TableCell>
                                            <TableCell>Priority</TableCell>
                                            <TableCell>Assigned To</TableCell>
                                            <TableCell>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {tasks.map((task, index) => (
                                            <Draggable
                                                key={task.id}
                                                draggableId={task.id.toString()}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <TableRow
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        onClick={() => handleTaskClick(task.id)}
                                                        sx={{ cursor: 'pointer' }}
                                                    >
                                                        <TableCell>{task.title}</TableCell>
                                                        <TableCell>{task.points}</TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={task.priority.toUpperCase()}
                                                                color={
                                                                    priorityColors[task.priority]
                                                                }
                                                            />
                                                        </TableCell>
                                                        <TableCell>{task.assignedTo}</TableCell>
                                                        <TableCell>{task.status}</TableCell>
                                                    </TableRow>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Droppable>
                </DragDropContext>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Add New Task</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            name="title"
                            label="Title"
                            type="text"
                            fullWidth
                            value={newTask.title}
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
                            value={newTask.description}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="dense"
                            name="points"
                            label="Points"
                            type="number"
                            fullWidth
                            value={newTask.points}
                            onChange={handleInputChange}
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Priority</InputLabel>
                            <Select
                                name="priority"
                                value={newTask.priority}
                                onChange={handleInputChange}
                            >
                                <MenuItem value="low">Low</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="high">High</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            margin="dense"
                            name="assignedTo"
                            label="Assigned To"
                            type="text"
                            fullWidth
                            value={newTask.assignedTo}
                            onChange={handleInputChange}
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status"
                                value={newTask.status}
                                onChange={handleInputChange}
                            >
                                <MenuItem value="todo">To Do</MenuItem>
                                <MenuItem value="inProgress">In Progress</MenuItem>
                                <MenuItem value="done">Done</MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleCreateTask} color="primary">
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

Backlog.propTypes = {
    tasks: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string,
            points: PropTypes.number.isRequired,
            priority: PropTypes.oneOf(['low', 'medium', 'high']).isRequired,
            assignedTo: PropTypes.string,
            status: PropTypes.oneOf(['todo', 'inProgress', 'done']).isRequired
        })
    )
};

export default Backlog;
