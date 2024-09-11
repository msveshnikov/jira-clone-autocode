import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    CircularProgress,
    IconButton,
    Tab,
    Tabs
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
    fetchBacklogTasks,
    createTask,
    updateTaskOrder,
    createSprint,
    updateSprint,
    getSprints,
    updateTask,
    deleteTask,
    searchTasks
} from '../services/apiService';
import { useTheme } from '@mui/material/styles';
import { Delete, Edit, Search } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Backlog = () => {
    const [open, setOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        points: 0,
        priority: 'low',
        status: 'todo'
    });
    const [sprintDialogOpen, setSprintDialogOpen] = useState(false);
    const [newSprint, setNewSprint] = useState({
        name: '',
        startDate: '',
        endDate: '',
        goal: ''
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [view, setView] = useState('backlog');
    const [tasks, setTasks] = useState([]);
    const [sprints, setSprints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const theme = useTheme();
    const { projectId } = useParams();
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tasksData, sprintsData] = await Promise.all([
                    fetchBacklogTasks(projectId),
                    getSprints(projectId)
                ]);
                setTasks(tasksData);
                setSprints(sprintsData);
                setLoading(false);
            } catch (err) {
                setError('Error loading data');
                setLoading(false);
            }
        };
        fetchData();
    }, [projectId]);

    useEffect(() => {
        if (searchQuery) {
            const search = async () => {
                try {
                    const searchResults = await searchTasks(projectId, searchQuery);
                    setTasks(searchResults);
                } catch (err) {
                    setError('Error searching tasks');
                }
            };
            search();
        } else {
            const refreshTasks = async () => {
                try {
                    const tasksData = await fetchBacklogTasks(projectId);
                    setTasks(tasksData);
                } catch (err) {
                    setError('Error refreshing tasks');
                }
            };
            refreshTasks();
        }
    }, [projectId, searchQuery]);

    const handleOpen = () => {
        setEditingTask(null);
        setNewTask({
            title: '',
            description: '',
            points: 0,
            priority: 'low',
            status: 'todo'
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingTask(null);
        setNewTask({
            title: '',
            description: '',
            points: 0,
            priority: 'low',
            status: 'todo'
        });
    };

    const handleCreateTask = async () => {
        try {
            if (editingTask) {
                await updateTask({ id: editingTask._id, ...newTask });
            } else {
                await createTask(projectId, newTask);
            }
            const updatedTasks = await fetchBacklogTasks(projectId);
            setTasks(updatedTasks);
            handleClose();
        } catch (err) {
            setError('Error creating/updating task');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask({ ...newTask, [name]: value });
    };

    const onDragEnd = async (result) => {
        if (!result.destination) return;

        const reorderedTasks = Array.from(tasks);
        const [reorderedItem] = reorderedTasks.splice(result.source.index, 1);
        reorderedTasks.splice(result.destination.index, 0, reorderedItem);

        setTasks(reorderedTasks);

        try {
            await Promise.all(
                reorderedTasks.map((task, index) => updateTaskOrder({ id: task._id, order: index }))
            );
        } catch (err) {
            setError('Error updating task order');
        }
    };

    const handleTaskClick = (taskId) => {
        navigate(`/project/${projectId}/task/${taskId}`);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setNewTask({
            title: task.title,
            description: task.description,
            points: task.points,
            priority: task.priority,
            status: task.status
        });
        setOpen(true);
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await deleteTask(taskId);
            const updatedTasks = await fetchBacklogTasks(projectId);
            setTasks(updatedTasks);
        } catch (err) {
            setError('Error deleting task');
        }
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

    const handleCreateSprint = async () => {
        try {
            await createSprint(projectId, newSprint);
            const updatedSprints = await getSprints(projectId);
            setSprints(updatedSprints);
            handleSprintDialogClose();
        } catch (err) {
            setError('Error creating sprint');
        }
    };

    const handleStartSprint = async (sprintId) => {
        try {
            await updateSprint({ id: sprintId, status: 'active' });
            const updatedSprints = await getSprints(projectId);
            setSprints(updatedSprints);
        } catch (err) {
            setError('Error starting sprint');
        }
    };

    const handleCloseSprint = async (sprintId) => {
        try {
            await updateSprint({ id: sprintId, status: 'completed' });
            const updatedSprints = await getSprints(projectId);
            setSprints(updatedSprints);
        } catch (err) {
            setError('Error closing sprint');
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleViewChange = (event, newView) => {
        setView(newView);
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box sx={{ my: 3, width: '100%', overflowX: 'auto' }}>
            <Container maxWidth={false}>
                <Typography variant="h4" gutterBottom>
                    Project Management
                </Typography>
                <Tabs value={view} onChange={handleViewChange} sx={{ mb: 2 }}>
                    <Tab label="Backlog" value="backlog" />
                    <Tab label="Sprint" value="sprint" />
                </Tabs>
                <Box sx={{ display: 'flex', mb: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mr: 2 }}>
                        Add Task
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleSprintDialogOpen}
                        sx={{ mr: 2 }}
                    >
                        Create Sprint
                    </Button>
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: <Search />
                        }}
                    />
                </Box>
                {view === 'backlog' && (
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
                                                <TableCell>Actions</TableCell>
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
                                                            sx={{
                                                                cursor: 'pointer',
                                                                height: '40px'
                                                            }}
                                                        >
                                                            <TableCell
                                                                onClick={() =>
                                                                    handleTaskClick(task._id)
                                                                }
                                                            >
                                                                {task.title}
                                                            </TableCell>
                                                            <TableCell
                                                                onClick={() =>
                                                                    handleTaskClick(task._id)
                                                                }
                                                            >
                                                                {task.points}
                                                            </TableCell>
                                                            <TableCell
                                                                onClick={() =>
                                                                    handleTaskClick(task._id)
                                                                }
                                                            >
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
                                                            <TableCell
                                                                onClick={() =>
                                                                    handleTaskClick(task._id)
                                                                }
                                                            >
                                                                {task.assignedTo}
                                                            </TableCell>
                                                            <TableCell
                                                                onClick={() =>
                                                                    handleTaskClick(task._id)
                                                                }
                                                            >
                                                                {task.status}
                                                            </TableCell>
                                                            <TableCell>
                                                                <IconButton
                                                                    onClick={() =>
                                                                        handleEditTask(task)
                                                                    }
                                                                    size="small"
                                                                >
                                                                    <Edit />
                                                                </IconButton>
                                                                <IconButton
                                                                    onClick={() =>
                                                                        handleDeleteTask(task._id)
                                                                    }
                                                                    size="small"
                                                                >
                                                                    <Delete />
                                                                </IconButton>
                                                            </TableCell>
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
                )}
                {view === 'sprint' && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h5" gutterBottom>
                            Sprints
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Start Date</TableCell>
                                        <TableCell>End Date</TableCell>
                                        <TableCell>Goal</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sprints.map((sprint) => (
                                        <TableRow key={sprint._id}>
                                            <TableCell>{sprint.name}</TableCell>
                                            <TableCell>{sprint.status}</TableCell>
                                            <TableCell>
                                                {new Date(sprint.startDate).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(sprint.endDate).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>{sprint.goal}</TableCell>
                                            <TableCell>
                                                {sprint.status === 'planning' && (
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        size="small"
                                                        onClick={() =>
                                                            handleStartSprint(sprint._id)
                                                        }
                                                    >
                                                        Start Sprint
                                                    </Button>
                                                )}
                                                {sprint.status === 'active' && (
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        size="small"
                                                        onClick={() =>
                                                            handleCloseSprint(sprint._id)
                                                        }
                                                    >
                                                        Close Sprint
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
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
                            {editingTask ? 'Update' : 'Create'}
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
            </Container>
        </Box>
    );
};

export default Backlog;
