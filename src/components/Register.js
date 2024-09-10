import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Grid,
    Paper,
    Alert,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        acceptTerms: false
    });
    const [errors, setErrors] = useState({});
    const [alertMessage, setAlertMessage] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();
    const { register } = useContext(AuthContext);

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === 'acceptTerms' ? checked : value
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'You must accept the terms of use';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const success = await register(formData.email, formData.password, formData.name);
                if (success) {
                    setAlertMessage('Registration successful.');
                    navigate('/login');
                } else {
                    setAlertMessage('Registration failed. Please try again.');
                }
            } catch (error) {
                setAlertMessage('Registration error. Please try again.');
            }
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper
                elevation={3}
                sx={{
                    mt: 8,
                    p: 4,
                    backgroundColor: theme.palette.background.paper
                }}
            >
                <Typography component="h1" variant="h5" align="center">
                    Register
                </Typography>
                {alertMessage && (
                    <Alert severity="info" onClose={() => setAlertMessage('')} sx={{ mt: 2 }}>
                        {alertMessage}
                    </Alert>
                )}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                error={!!errors.password}
                                helperText={errors.password}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Confirm Password"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="acceptTerms"
                                        checked={formData.acceptTerms}
                                        onChange={handleChange}
                                        color="primary"
                                    />
                                }
                                label="I accept the terms of use"
                            />
                            {errors.acceptTerms && (
                                <Typography color="error" variant="caption">
                                    {errors.acceptTerms}
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Register
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link to="/login" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default Register;
