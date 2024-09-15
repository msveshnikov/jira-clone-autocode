import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    CircularProgress,
    Button,
    TextField
} from '@mui/material';
import {
    fetchTasks,
    updateTask,
    getSprints,
    closeSprint,
    searchTasks,
    assignTask,
    updateTaskDueDate
} from '../services/apiService';
import TaskCard from './TaskCard';
import { useTheme } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';

const SprintBoard = () => {
    const { projectId } = useParams();
    const theme = useTheme();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [columns, setColumns] = useState({
        todo: { title: 'To Do', items: [] },
        inprogress: { title: 'In Progress', items: [] },
        codereview: { title: 'Code Review', items: [] },
        readytotest: { title: 'Ready to Test', items: [] },
        qa: { title: 'QA', items: [] },
        done: { title: 'Done', items: [] }
    });
    const [selectedTask, setSelectedTask] = useState(null);
    const [activeSprint, setActiveSprint] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [tasks, setTasks] = useState([]);
    const [, setSprints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tasksData, sprintsData] = await Promise.all([
                    fetchTasks(projectId),
                    getSprints(projectId)
                ]);
                setTasks(tasksData);
                const active = sprintsData.find((sprint) => sprint.status === 'active');
                setActiveSprint(active);
                setIsLoading(false);
            } catch (err) {
                setError('Error loading data');
                setIsLoading(false);
            }
        };
        fetchData();
    }, [projectId]);

    useEffect(() => {
        if (tasks && activeSprint) {
            const newColumns = { ...columns };
            Object.keys(newColumns).forEach((key) => {
                newColumns[key].items = [];
            });
            tasks.forEach((task) => {
                if (task.sprint === activeSprint._id) {
                    const column = task.status.toLowerCase().replace(' ', '');
                    if (newColumns[column]) {
                        newColumns[column].items.push(task);
                    }
                }
            });
            setColumns(newColumns);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tasks, activeSprint]);

    useEffect(() => {
        const searchTasksAsync = async () => {
            if (searchQuery) {
                try {
                    const searchResults = await searchTasks(projectId, searchQuery);
                    setTasks(searchResults);
                } catch (err) {
                    setError('Error searching tasks');
                }
            } else {
                try {
                    const tasksData = await fetchTasks(projectId);
                    setTasks(tasksData);
                } catch (err) {
                    setError('Error fetching tasks');
                }
            }
        };
        searchTasksAsync();
    }, [searchQuery, projectId]);

    const onDragEnd = async (result) => {
        if (!result.destination) return;
        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                }
            });

            try {
                await updateTask({
                    id: removed._id,
                    status: destination.droppableId
                });
            } catch (err) {
                setError('Error updating task status');
            }
        } else {
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems
                }
            });
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

    const handleTaskClick = (task) => {
        setSelectedTask(task);
    };

    const handleCloseDialog = () => {
        setSelectedTask(null);
    };

    const handleCloseSprint = async () => {
        if (activeSprint) {
            try {
                await closeSprint(activeSprint._id);
                const updatedSprints = await getSprints(projectId);
                setSprints(updatedSprints);
                setActiveSprint(null);
            } catch (err) {
                setError('Error closing sprint');
            }
        }
    };

    const handleBackToBacklog = () => {
        navigate(`/project/${projectId}/backlog`);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleAssignTask = async (taskId, userId) => {
        try {
            await assignTask(taskId, userId);
            const updatedTasks = await fetchTasks(projectId);
            setTasks(updatedTasks);
        } catch (err) {
            setError('Error assigning task');
        }
    };

    const handleUpdateDueDate = async (taskId, dueDate) => {
        try {
            await updateTaskDueDate(taskId, dueDate);
            const updatedTasks = await fetchTasks(projectId);
            setTasks(updatedTasks);
        } catch (err) {
            setError('Error updating due date');
        }
    };

    if (isLoading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Sprint Board
            </Typography>
            {activeSprint ? (
                <>
                    <Typography variant="h6" gutterBottom>
                        Active Sprint: {activeSprint.name}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                        <Button variant="contained" onClick={handleCloseSprint} sx={{ mr: 2 }}>
                            Close Sprint
                        </Button>
                        <Button variant="outlined" onClick={handleBackToBacklog}>
                            Back to Backlog
                        </Button>
                        <TextField
                            label="Search tasks"
                            variant="standard"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            sx={{ ml: 2, mt:-2}}
                        />
                    </Box>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Grid container spacing={2}>
                            {Object.entries(columns).map(([columnId, column]) => (
                                <Grid item xs={12} sm={6} md={4} lg={2} key={columnId}>
                                    <Paper
                                        sx={{ p: 2, bgcolor: 'background.default', height: '100%' }}
                                    >
                                        <Typography variant="h6" gutterBottom>
                                            {column.title}
                                        </Typography>
                                        <Droppable droppableId={columnId}>
                                            {(provided) => (
                                                <Box
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    sx={{ minHeight: 500 }}
                                                >
                                                    {column.items.map((task, index) => (
                                                        <Draggable
                                                            key={task._id}
                                                            draggableId={task._id}
                                                            index={index}
                                                        >
                                                            {(provided) => (
                                                                <Paper
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    sx={{
                                                                        p: 1,
                                                                        mb: 1,
                                                                        bgcolor: 'background.paper',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                    onClick={() =>
                                                                        handleTaskClick(task)
                                                                    }
                                                                >
                                                                    <Typography variant="subtitle2">
                                                                        {task.title}
                                                                    </Typography>
                                                                    <Box sx={{ mt: 1 }}>
                                                                        <Chip
                                                                            label={`Points: ${task.points}`}
                                                                            size="small"
                                                                            sx={{ mr: 1 }}
                                                                        />
                                                                        <Chip
                                                                            label={task.priority}
                                                                            size="small"
                                                                            sx={{
                                                                                bgcolor:
                                                                                    getPriorityColor(
                                                                                        task.priority
                                                                                    ),
                                                                                color: 'white'
                                                                            }}
                                                                        />
                                                                    </Box>
                                                                </Paper>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </Box>
                                            )}
                                        </Droppable>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </DragDropContext>
                </>
            ) : (
                <Typography>No active sprint. Please start a sprint from the Backlog.</Typography>
            )}
            <Dialog open={!!selectedTask} onClose={handleCloseDialog}>
                <DialogTitle>Task Details</DialogTitle>
                <DialogContent>
                    {selectedTask && (
                        <TaskCard
                            id={selectedTask._id}
                            onAssign={handleAssignTask}
                            onUpdateDueDate={handleUpdateDueDate}
                            currentUser={user}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default SprintBoard;
