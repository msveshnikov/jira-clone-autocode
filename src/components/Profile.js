import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Typography,
    Avatar,
    Paper,
    Grid,
    TextField,
    Button,
    CircularProgress
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { getUser, updateUser } from '../services/apiService';
import PropTypes from 'prop-types';

const Profile = () => {
    const { userId } = useParams();
    const { user: currentUser } = useAuth();
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        bio: ''
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUser();
                setUser(userData);
                setFormData({
                    name: userData.name,
                    email: userData.email,
                    role: userData.role,
                    bio: userData.bio || ''
                });
                setLoading(false);
            } catch (error) {
                setError('Error fetching user data');
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId, currentUser]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedUser = await updateUser(user.id, formData);
            setUser(updatedUser);
            setEditMode(false);
        } catch (error) {
            setError('Error updating user data');
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;
    if (!user) return <Typography>User not found</Typography>;

    return (
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Grid container spacing={3} alignItems="center">
                <Grid item>
                    <Avatar src={user.avatar} alt={user.name} sx={{ width: 100, height: 100 }} />
                </Grid>
                <Grid item xs>
                    {editMode ? (
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                margin="normal"
                                name="name"
                                label="Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                name="email"
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                name="role"
                                label="Role"
                                value={formData.role}
                                onChange={handleInputChange}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                name="bio"
                                label="Bio"
                                multiline
                                rows={4}
                                value={formData.bio}
                                onChange={handleInputChange}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2 }}
                            >
                                Save
                            </Button>
                            <Button onClick={() => setEditMode(false)} sx={{ mt: 2, ml: 2 }}>
                                Cancel
                            </Button>
                        </form>
                    ) : (
                        <>
                            <Typography variant="h4">{user.name}</Typography>
                            <Typography variant="subtitle1">{user.email}</Typography>
                            <Typography variant="body1">{user.role}</Typography>
                            <Typography variant="body2" sx={{ mt: 2 }}>
                                {user.bio}
                            </Typography>
                            {(currentUser.id === user.id || currentUser.role === 'admin') && (
                                <Button onClick={() => setEditMode(true)} sx={{ mt: 2 }}>
                                    Edit Profile
                                </Button>
                            )}
                        </>
                    )}
                </Grid>
            </Grid>
        </Paper>
    );
};

Profile.propTypes = {
    userId: PropTypes.string
};

export default Profile;
