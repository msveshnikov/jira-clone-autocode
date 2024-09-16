import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Typography,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Paper,
    Box,
    CircularProgress
} from '@mui/material';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import {
    fetchBacklogTasks,
    updateTaskOrder,
    createSprint,
    updateSprint,
    getSprints,
    searchTasks,
    deleteTask,
    moveTaskBetweenSprintsOrBacklog
} from '../services/apiService';
import { Search } from '@mui/icons-material';
import TaskCard from './TaskCard';
import { TaskTable } from './TaskTable';

const Backlog = () => {
    const [open, setOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [sprintDialogOpen, setSprintDialogOpen] = useState(false);
    const [newSprint, setNewSprint] = useState({
        name: '',
        startDate: '',
        endDate: '',
        goal: ''
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [tasks, setTasks] = useState([]);
    const [sprints, setSprints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { projectId } = useParams();

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
        const search = async () => {
            try {
                const searchResults = await searchTasks(projectId, searchQuery);
                setTasks(searchResults);
            } catch (err) {
                setError('Error searching tasks');
            }
        };
        if (searchQuery) {
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

    const handleAddTask = () => {
        setEditingTask(null);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingTask(null);
    };

    const onDragEnd = async (result) => {
        if (!result.destination) return;

        const sourceId = result.source.droppableId;
        const destinationId = result.destination.droppableId;
        const taskId = result.draggableId;

        if (sourceId === destinationId) {
            await updateTaskOrder({ id: taskId, order: result.destination.index });
        } else {
            const sprintId = destinationId === 'backlog' ? null : destinationId;
            await moveTaskBetweenSprintsOrBacklog(
                projectId,
                taskId,
                sprintId,
                result.destination.index
            );
        }
        const updatedTasks = await fetchBacklogTasks(projectId);
        setTasks(updatedTasks);
    };

    const handleTaskClick = (taskId) => {
        setEditingTask(tasks.find((task) => task._id === taskId));
        setOpen(true);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setOpen(true);
    };

    const handleDeleteTask = async (taskId) => {
        await deleteTask(taskId);
        const updatedTasks = await fetchBacklogTasks(projectId);
        setTasks(updatedTasks);
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

    const handleUpdate = async (taskId) => {
        const updatedTasks = await fetchBacklogTasks(projectId);
        setTasks(updatedTasks);
        setOpen(false);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box sx={{ my: 3, width: '100%', overflowX: 'auto' }}>
            <Container maxWidth={false}>
                <Box sx={{ display: 'flex', mb: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddTask}
                        sx={{ mr: 2 }}
                    >
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
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="backlog" type="TASK">
                        {(provided) => (
                            <Box {...provided.droppableProps} ref={provided.innerRef}>
                                {sprints.map((sprint) => (
                                    <Paper
                                        key={sprint._id}
                                        sx={{ p: 2, mb: 2 }}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                mb: 2
                                            }}
                                            {...provided.dragHandleProps}
                                        >
                                            <Typography variant="h6">
                                                {sprint.name} (
                                                {new Date(sprint.startDate).toLocaleDateString()} -{' '}
                                                {new Date(sprint.endDate).toLocaleDateString()})
                                            </Typography>
                                            {sprint.status === 'planning' && (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleStartSprint(sprint._id)}
                                                >
                                                    Start Sprint
                                                </Button>
                                            )}
                                            {sprint.status === 'active' && (
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => handleCloseSprint(sprint._id)}
                                                >
                                                    Close Sprint
                                                </Button>
                                            )}
                                        </Box>
                                        <Droppable droppableId={sprint._id} type="TASK">
                                            {(provided) => (
                                                <Box
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                >
                                                    <TaskTable
                                                        tasks={tasks?.filter(
                                                            (task) => task.sprint === sprint._id
                                                        )}
                                                        provided={provided}
                                                        handleTaskClick={handleTaskClick}
                                                        handleEditTask={handleEditTask}
                                                        handleDeleteTask={handleDeleteTask}
                                                    />
                                                </Box>
                                            )}
                                        </Droppable>
                                    </Paper>
                                ))}
                                <Paper sx={{ p: 2, mb: 2 }}>
                                    <Typography variant="h6">Backlog</Typography>
                                    <Droppable droppableId="backlog" type="TASK">
                                        {(provided) => (
                                            <Box
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                            >
                                                <TaskTable
                                                    tasks={tasks?.filter((task) => !task.sprint)}
                                                    provided={provided}
                                                    handleTaskClick={handleTaskClick}
                                                    handleEditTask={handleEditTask}
                                                    handleDeleteTask={handleDeleteTask}
                                                />
                                            </Box>
                                        )}
                                    </Droppable>
                                </Paper>
                                {provided.placeholder}
                            </Box>
                        )}
                    </Droppable>
                </DragDropContext>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
                    <DialogContent>
                        <TaskCard
                            id={editingTask?._id}
                            projectId={projectId}
                            onUpdate={handleUpdate}
                            onDelete={() => {}}
                        />
                    </DialogContent>
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
