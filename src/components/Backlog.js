import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
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
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { fetchBacklogTasks, createTask, updateTask } from '../services/apiService';

const Backlog = () => {
  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', points: 0, priority: 'low' });
  const queryClient = useQueryClient();

  const { data: tasks, isLoading, isError } = useQuery('backlogTasks', fetchBacklogTasks);

  const createTaskMutation = useMutation(createTask, {
    onSuccess: () => {
      queryClient.invalidateQueries('backlogTasks');
      handleClose();
    },
  });

  const updateTaskMutation = useMutation(updateTask, {
    onSuccess: () => {
      queryClient.invalidateQueries('backlogTasks');
    },
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewTask({ title: '', description: '', points: 0, priority: 'low' });
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
      updateTaskMutation.mutate({ ...task, order: index });
    });
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>Error loading tasks</Typography>;

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Backlog
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Task
      </Button>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="backlog">
          {(provided) => (
            <List {...provided.droppableProps} ref={provided.innerRef}>
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                  {(provided) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <ListItemText
                        primary={task.title}
                        secondary={`Points: ${task.points} | Priority: ${task.priority}`}
                      />
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreateTask} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Backlog;