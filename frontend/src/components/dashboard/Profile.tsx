import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    Box,
    Container,
    Typography,
    Avatar,
    TextField,
    Paper,
    Button,
    Divider,
    useTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';

const Profile: React.FC = () => {
    const { currentUser } = useAuth();
    const [editMode, setEditMode] = useState(false);
    const [username, setUsername] = useState(currentUser?.username || '');
    const [email, setEmail] = useState(currentUser?.email || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const theme = useTheme();
    const navigate = useNavigate();

    const handleSave = async () => {
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const response = await axios.put('/profile/update', {
                id: currentUser?.id,
                username,
                email,
                password: password || undefined, // Only send password if it's being updated
            });

            if (response.data.success) {
                alert('Profile updated successfully');
                setEditMode(false);
            }
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.error || 'Failed to update profile');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, mb: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        width: '100%',
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center', // Center the avatar horizontally
                            alignItems: 'center',    // Center the avatar vertically (if needed)
                            mb: 5,
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 150,
                                height: 150,
                                bgcolor: theme.palette.primary.main,
                                fontSize: '3.5rem',
                            }}
                        >
                            {currentUser?.username?.[0].toUpperCase() || 'U'}
                        </Avatar>
                    </Box>

                    <Typography variant="h4" component="h3" sx={{ mt: 1, mb: 3, textAlign: 'center' }}>
                        My Profile
                    </Typography>

                    <Box component="form" sx={{ width: '100%' }}>
                        <TextField
                            label="Username"
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={!editMode}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            value={email}
                            disabled={true}
                            sx={{ mb: 2 }}
                        />
                        {editMode && (
                            <>
                                <TextField
                                    label="New Password"
                                    type="password"
                                    fullWidth
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    helperText="Leave blank if you don’t want to change"
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Confirm Password"
                                    type="password"
                                    fullWidth
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    sx={{ mb: 2 }}
                                />
                            </>
                        )}

                        {editMode ? (
                            <>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    startIcon={<SaveIcon />}
                                    sx={{ mt: 2, mb: 1 }}
                                    onClick={handleSave}
                                >
                                    Save Changes
                                </Button>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="error"
                                    startIcon={<CancelIcon />}
                                    onClick={() => setEditMode(false)}
                                >
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button
                                fullWidth
                                variant="contained"
                                color="secondary"
                                startIcon={<EditIcon />}
                                sx={{ mt: 2 }}
                                onClick={() => setEditMode(true)}
                            >
                                Edit Profile
                            </Button>
                        )}

                        <Divider sx={{ my: 2 }}>
                            <Typography color="text.secondary">OR</Typography>
                        </Divider>

                        <Typography align="center" sx={{ mt: 2 }}>
                            Go back to{' '}
                            <Button color="primary" onClick={() => navigate('/')}>
                                Dashboard
                            </Button>
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Profile;