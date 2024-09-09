import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchTasks, updateTask } from '../services/apiService';

const SprintBoard = () => {
    const [columns, setColumns] = useState({
        todo: { title: 'To Do', items: [] },
        inProgress: { title: 'In Progress', items: [] },
        done: { title: 'Done', items: [] }
    });

    const queryClient = useQueryClient();
    const { data: tasks, isLoading, isError } = useQuery('tasks', fetchTasks);

    const updateTaskMutation = useMutation(updateTask, {
        onSuccess: () => {
            queryClient.invalidateQueries('tasks');
        }
    });

    useEffect(() => {
        if (tasks) {
            const newColumns = { ...columns };
            tasks.forEach((task) => {
                const column = task.status.toLowerCase().replace(' ', '');
                if (newColumns[column]) {
                    newColumns[column].items.push(task);
                }
            });
            setColumns(newColumns);
        }
    }, [columns, tasks]);

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
                ...removed,
                status: destColumn.title
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

    if (isLoading) return <Typography>Loading...</Typography>;
    if (isError) return <Typography>Error loading tasks</Typography>;

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Sprint Board
            </Typography>
            <DragDropContext onDragEnd={onDragEnd}>
                <Grid container spacing={3}>
                    {Object.entries(columns).map(([columnId, column]) => (
                        <Grid item xs={12} sm={4} key={columnId}>
                            <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
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
                                                    key={task.id}
                                                    draggableId={task.id}
                                                    index={index}
                                                >
                                                    {(provided) => (
                                                        <Paper
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            sx={{
                                                                p: 2,
                                                                mb: 2,
                                                                bgcolor: 'background.paper'
                                                            }}
                                                        >
                                                            <Typography variant="subtitle1">
                                                                {task.title}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                            >
                                                                Points: {task.points} | Priority:{' '}
                                                                {task.priority}
                                                            </Typography>
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
        </Box>
    );
};

export default SprintBoard;
