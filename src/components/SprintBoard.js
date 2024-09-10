import React, { useState, useEffect } from 'react';
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
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
    fetchTasks,
    updateTask,
    getSprints,
    updateSprint,
    closeSprint,
    searchTasks,
    assignTask,
    updateTaskDueDate
} from '../services/apiService';
import TaskCard from './TaskCard';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';

const SprintBoard = () => {
    const { projectId } = useParams();
    const theme = useTheme();
    const navigate = useNavigate();
    const { user } = useAuth();
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

    const queryClient = useQueryClient();
    const {
        data: tasks,
        isLoading: isTasksLoading,
        isError: isTasksError
    } = useQuery(['tasks', projectId], () => fetchTasks(projectId));

    const { data: sprints, isLoading: isSprintsLoading } = useQuery(['sprints', projectId], () =>
        getSprints(projectId)
    );

    const updateTaskMutation = useMutation(updateTask, {
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks', projectId]);
        }
    });

    const updateSprintMutation = useMutation(updateSprint, {
        onSuccess: () => {
            queryClient.invalidateQueries(['sprints', projectId]);
        }
    });

    const closeSprintMutation = useMutation(closeSprint, {
        onSuccess: () => {
            queryClient.invalidateQueries(['sprints', projectId]);
        }
    });

    const searchTasksMutation = useMutation(searchTasks, {
        onSuccess: (data) => {
            queryClient.setQueryData(['tasks', projectId], data);
        }
    });

    const assignTaskMutation = useMutation(assignTask, {
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks', projectId]);
        }
    });

    const updateTaskDueDateMutation = useMutation(updateTaskDueDate, {
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks', projectId]);
        }
    });

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
    }, [tasks, activeSprint]);

    useEffect(() => {
        if (sprints) {
            const active = sprints.find((sprint) => sprint.status === 'active');
            setActiveSprint(active);
        }
    }, [sprints]);

    useEffect(() => {
        if (searchQuery) {
            searchTasksMutation.mutate({ projectId, query: searchQuery });
        } else {
            queryClient.invalidateQueries(['tasks', projectId]);
        }
    }, [searchQuery, projectId, queryClient, searchTasksMutation]);

    const onDragEnd = (result) => {
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

            updateTaskMutation.mutate({
                id: removed._id,
                status: destination.droppableId
            });
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

    const handleCloseSprint = () => {
        if (activeSprint) {
            closeSprintMutation.mutate(activeSprint._id);
        }
    };

    const handleBackToBacklog = () => {
        navigate(`/project/${projectId}/backlog`);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleAssignTask = (taskId, userId) => {
        assignTaskMutation.mutate({ taskId, userId });
    };

    const handleUpdateDueDate = (taskId, dueDate) => {
        updateTaskDueDateMutation.mutate({ taskId, dueDate });
    };

    if (isTasksLoading || isSprintsLoading) return <CircularProgress />;
    if (isTasksError) return <Typography>Error loading tasks</Typography>;

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
                    </Box>
                    <TextField
                        label="Search tasks"
                        variant="outlined"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        sx={{ mb: 2 }}
                    />
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
            <Dialog open={!!selectedTask} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>Task Details</DialogTitle>
                <DialogContent>
                    {selectedTask && (
                        <TaskCard
                            id={selectedTask._id}
                            projectId={projectId}
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
