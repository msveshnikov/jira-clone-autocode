/* eslint-disable react/prop-types */
import React from 'react';
import {
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Chip,
    useTheme
} from '@mui/material';
import { Draggable } from 'react-beautiful-dnd';
import { Delete, Edit } from '@mui/icons-material';

export const TaskTable = ({
    provided,
    tasks,
    handleTaskClick,
    handleEditTask,
    handleDeleteTask
}) => {
    const theme = useTheme();

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

    return (
        <TableContainer component={Paper} {...provided.droppableProps} ref={provided.innerRef}>
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
                    {tasks?.map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id.toString()} index={index}>
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
                                    <TableCell onClick={() => handleTaskClick(task._id)}>
                                        {task.title}
                                    </TableCell>
                                    <TableCell onClick={() => handleTaskClick(task._id)}>
                                        {task.points}
                                    </TableCell>
                                    <TableCell onClick={() => handleTaskClick(task._id)}>
                                        <Chip
                                            label={task.priority.toUpperCase()}
                                            size="small"
                                            sx={{
                                                bgcolor: getPriorityColor(task.priority),
                                                color: 'white'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell onClick={() => handleTaskClick(task._id)}>
                                        {task.assignedTo}
                                    </TableCell>
                                    <TableCell onClick={() => handleTaskClick(task._id)}>
                                        {task.status}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => handleEditTask(task)}
                                            size="small"
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleDeleteTask(task._id)}
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
    );
};
