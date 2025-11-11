import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PrivateRoute from './components/auth/PrivateRoute';
import DesignPatternsMenu from './components/learning/DesignPatternsMenu';
import DesignPatternLesson from './components/learning/DesignPatternLesson';
import ChallengesMenu from './components/challenges/ChallengesMenu';
import Navbar from './components/layout/Navbar';
import UserDashboard from './components/dashboard/UserDashboard';
import SubmissionPage from './components/challenges/SubmissionPage';
import Profile from './components/dashboard/Profile';
import { CssBaseline, ThemeProvider, createTheme, Box } from '@mui/material';
import ChallengeTemplate from './components/challenges/ChallengeTemplate';

// Create a theme instance
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6', // Bright blue
      light: '#60a5fa',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#f97316', // Bright orange
      light: '#fb923c',
      dark: '#ea580c',
    },
    background: {
      default: '#0f172a', // Dark blue background
      paper: '#1e293b', // Slightly lighter blue
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
    },
    success: {
      main: '#22c55e',
      light: '#1e293b',
      dark: '#15803d',
    },
    error: {
      main: '#ef4444',
    },
    warning: {
      main: '#f97316',
    },
    info: {
      main: '#3b82f6',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#475569 #1e293b",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#1e293b",
            width: 8,
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#475569",
            minHeight: 24,
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
            backgroundColor: "#64748b",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#64748b",
          },
        },
      },
    },
  },
});


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{
            minHeight: '100vh',
            bgcolor: 'background.default'
          }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <Box sx={{ pt: 2 }}>
                      <UserDashboard />
                    </Box>
                  </>
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <Box sx={{ pt: 2 }}>
                      <Profile />
                    </Box>
                  </>
                </PrivateRoute>
              } />
              <Route path="/learn" element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <Box sx={{ pt: 2 }}>
                      <DesignPatternsMenu />
                    </Box>
                  </>
                </PrivateRoute>
              } />
              <Route path="/learn/:category/:pattern" element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <DesignPatternLesson />
                  </>
                </PrivateRoute>
              } />
              <Route path="/challenges" element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <Box sx={{ pt: 2 }}>
                      <ChallengesMenu />
                    </Box>
                  </>
                </PrivateRoute>
              } />
              <Route path="/challenges/:category/:challenge" element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <Box sx={{ pt: 2 }}>
                      <ChallengeTemplate />
                    </Box>
                  </>
                </PrivateRoute>
              } />
              <Route path="/submit" element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <Box sx={{ pt: 2 }}>
                      <SubmissionPage />
                    </Box>
                  </>
                </PrivateRoute>
              } />
              <Route path="/submission" element={<SubmissionPage />} />
              <Route path="/submission/:submissionId" element={<SubmissionPage />} />
            </Routes>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
