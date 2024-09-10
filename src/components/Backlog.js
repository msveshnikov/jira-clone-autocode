import React, { useState } from 'react';
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
import {
    fetchBacklogTasks,
    createTask,
    updateTaskOrder,
    createSprint,
    updateSprint,
    getSprints
} from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const Backlog = () => {
    const [open, setOpen] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        points: 0,
        priority: 'low',
        // assignedTo: '',
        status: 'todo'
    });
    const [sprintDialogOpen, setSprintDialogOpen] = useState(false);
    const [newSprint, setNewSprint] = useState({
        name: '',
        startDate: '',
        endDate: '',
        goal: ''
    });
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const theme = useTheme();

    const { data: tasks, isLoading, isError } = useQuery('backlogTasks', fetchBacklogTasks);
    const { data: sprints } = useQuery('sprints', getSprints);

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

    const createSprintMutation = useMutation(createSprint, {
        onSuccess: () => {
            queryClient.invalidateQueries('sprints');
            handleSprintDialogClose();
        }
    });

    const updateSprintMutation = useMutation(updateSprint, {
        onSuccess: () => {
            queryClient.invalidateQueries('sprints');
        }
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setNewTask({
            title: '',
            description: '',
            points: 0,
            priority: 'low',
            // assignedTo: '',
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
            updateTaskOrderMutation.mutate({ id: task._id, order: index });
        });
    };

    const handleTaskClick = (taskId) => {
        navigate(`/task/${taskId}`);
    };

    const getPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return theme.palette.error.main;
            case 'medium':
                return theme.palette.warning.main;
            case 'low':
                return theme.palette.success.main;
            default:
                return theme.palette.text.secondary;
        }
    };

    const handleSprintDialogOpen = () => setSprintDialogOpen(true);
    const handleSprintDialogClose = () => {
        setSprintDialogOpen(false);
        setNewSprint({
            name: '',
            startDate: '',
            endDate: '',
            goal: ''
        });
    };

    const handleSprintInputChange = (e) => {
        const { name, value } = e.target;
        setNewSprint({ ...newSprint, [name]: value });
    };

    const handleCreateSprint = () => {
        createSprintMutation.mutate(newSprint);
    };

    const handleStartSprint = (sprintId) => {
        updateSprintMutation.mutate({ id: sprintId, status: 'active' });
    };

    const handleCloseSprint = (sprintId) => {
        updateSprintMutation.mutate({ id: sprintId, status: 'completed' });
    };

    if (isLoading) return <CircularProgress />;
    if (isError) return <Typography>Error loading tasks</Typography>;

    return (
        <Box sx={{ my: 3, width: '100%', overflowX: 'auto' }}>
            <Container maxWidth={false}>
                <Typography variant="h4" gutterBottom>
                    Backlog
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpen}
                    sx={{ mr: 2, mb: 2 }}
                >
                    Add Task
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSprintDialogOpen}
                    sx={{ mb: 2 }}
                >
                    Create Sprint
                </Button>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="backlog">
                        {(provided) => (
                            <TableContainer
                                component={Paper}
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                <Table size="small">
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
                                                key={task._id}
                                                draggableId={task._id.toString()}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <TableRow
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        onClick={() => handleTaskClick(task._id)}
                                                        sx={{ cursor: 'pointer', height: '40px' }}
                                                    >
                                                        <TableCell>{task.title}</TableCell>
                                                        <TableCell>{task.points}</TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={task.priority.toUpperCase()}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: getPriorityColor(
                                                                        task.priority
                                                                    ),
                                                                    color: 'white'
                                                                }}
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
                        {/* <TextField
                            margin="dense"
                            name="assignedTo"
                            label="Assigned To"
                            type="text"
                            fullWidth
                            value={newTask.assignedTo}
                            onChange={handleInputChange}
                        /> */}
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status"
                                value={newTask.status}
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
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleCreateTask} color="primary">
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={sprintDialogOpen} onClose={handleSprintDialogClose}>
                    <DialogTitle>Create New Sprint</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            name="name"
                            label="Sprint Name"
                            type="text"
                            fullWidth
                            value={newSprint.name}
                            onChange={handleSprintInputChange}
                        />
                        <TextField
                            margin="dense"
                            name="startDate"
                            label="Start Date"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={newSprint.startDate}
                            onChange={handleSprintInputChange}
                        />
                        <TextField
                            margin="dense"
                            name="endDate"
                            label="End Date"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={newSprint.endDate}
                            onChange={handleSprintInputChange}
                        />
                        <TextField
                            margin="dense"
                            name="goal"
                            label="Sprint Goal"
                            type="text"
                            fullWidth
                            multiline
                            rows={4}
                            value={newSprint.goal}
                            onChange={handleSprintInputChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleSprintDialogClose}>Cancel</Button>
                        <Button onClick={handleCreateSprint} color="primary">
                            Create Sprint
                        </Button>
                    </DialogActions>
                </Dialog>
                {sprints && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h5" gutterBottom>
                            Sprints
                        </Typography>
                        {sprints.map((sprint) => (
                            <Box key={sprint._id} sx={{ mb: 2 }}>
                                <Typography variant="h6">{sprint.name}</Typography>
                                <Typography>Status: {sprint.status}</Typography>
                                <Typography>
                                    Start Date: {new Date(sprint.startDate).toLocaleDateString()}
                                </Typography>
                                <Typography>
                                    End Date: {new Date(sprint.endDate).toLocaleDateString()}
                                </Typography>
                                {sprint.status === 'planning' && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleStartSprint(sprint._id)}
                                        sx={{ mr: 2, mt: 1 }}
                                    >
                                        Start Sprint
                                    </Button>
                                )}
                                {sprint.status === 'active' && (
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleCloseSprint(sprint._id)}
                                        sx={{ mt: 1 }}
                                    >
                                        Close Sprint
                                    </Button>
                                )}
                            </Box>
                        ))}
                    </Box>
                )}
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
            status: PropTypes.oneOf([
                'todo',
                'inprogress',
                'readytotest',
                'codereview',
                'qa',
                'done'
            ]).isRequired
        })
    )
};

export default Backlog;
