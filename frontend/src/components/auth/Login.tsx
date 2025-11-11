import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Divider
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);

      await login(email, password);

      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
          DesignDojo
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom align="center" sx={{ fontWeight: 400, color: 'text.secondary', mb: 4 }}>
          Learn Design Better
        </Typography>

        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2, bgcolor: 'background.paper' }}>
          <Typography variant="h4" component="h3" gutterBottom align="center" sx={{ mb: 3 }}>
            Welcome Back
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 2, mb: 2, py: 1.5, fontSize: '1.1rem' }}
              disabled={loading}
            >
              Sign In
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography color="text.secondary">OR</Typography>
            </Divider>

            <Typography align="center" sx={{ mt: 2 }}>
              Don't have an account? <Link to="/register" style={{ color: 'primary.main', textDecoration: 'none', fontWeight: 500 }}>Create Account</Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;