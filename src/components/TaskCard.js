import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Card, CardContent, Typography, TextField, Select, MenuItem, Button } from '@mui/material';
import { fetchTask, updateTask } from '../services/apiService';

const TaskCard = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [task, setTask] = useState({
        title: '',
        description: '',
        points: 0,
        priority: 'low'
    });

    const { data: fetchedTask, isLoading, isError } = useQuery(['task', id], () => fetchTask(id));

    const updateTaskMutation = useMutation(updateTask, {
        onSuccess: () => {
            queryClient.invalidateQueries(['task', id]);
        }
    });

    useEffect(() => {
        if (fetchedTask) {
            setTask(fetchedTask);
        }
    }, [fetchedTask]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTask((prevTask) => ({
            ...prevTask,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateTaskMutation.mutate({ id, ...task });
    };

    if (isLoading) return <Typography>Loading...</Typography>;
    if (isError) return <Typography>Error loading task</Typography>;

    return (
        <Card>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Title"
                        name="title"
                        value={task.title}
                        onChange={handleInputChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Description"
                        name="description"
                        multiline
                        rows={4}
                        value={task.description}
                        onChange={handleInputChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Points"
                        name="points"
                        type="number"
                        value={task.points}
                        onChange={handleInputChange}
                    />
                    <Select
                        fullWidth
                        margin="normal"
                        label="Priority"
                        name="priority"
                        value={task.priority}
                        onChange={handleInputChange}
                    >
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                    </Select>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{ marginTop: '1rem' }}
                    >
                        Update Task
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default TaskCard;
