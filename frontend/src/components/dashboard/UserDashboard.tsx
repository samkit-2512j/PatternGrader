import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import SchoolIcon from '@mui/icons-material/School';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Box,
    Container,
    Typography,
    Avatar,
    useTheme,
    Accordion,
    Card,
    CardContent,
    Button,
    Paper,
    Alert,
    CircularProgress,
    Stack,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CodeIcon from '@mui/icons-material/Code';
import ArticleIcon from '@mui/icons-material/Article';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ShowChartIcon from '@mui/icons-material/ShowChart';

// Define interface for dashboard data
interface DashboardData {
    user: {
        id: string;
        username: string;
        email: string;
        rating?: number;
        last_5_ratings?: number[];
    };
    progress: {
        learning: number;
        challenges: number;
    };
    recent_activities: {
        lessons: string[];
        submissions: string[];
    };
}

const UserDashboard: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/dashboard', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setDashboardData(response.data);
            } catch (err: any) {
                setError(err.response?.data?.error || 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    interface AnimatedCircularProgressProps {
        icon: React.ReactNode;
        label: string;
        color: string;
        target: number;
    }

    const AnimatedCircularProgress: React.FC<AnimatedCircularProgressProps> = ({ icon, label, color, target }) => {
        const [progress, setProgress] = useState(0);

        useEffect(() => {
            const timer = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= target) {
                        clearInterval(timer);
                        return target;
                    }
                    return prev + 10;
                });
            }, 15);
            return () => clearInterval(timer);
        }, [target]);

        return (
            <Box
                sx={{
                    bgcolor: '#0d1b2a',
                    color: 'white',
                    px: 6,
                    py: 8,
                    borderRadius: 3,
                    width: '35%', // Reduced from 40%
                    textAlign: 'center',
                    boxShadow: '0px 0px 20px rgba(0,0,0,0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={2}>
                    {icon}
                    <Typography variant="h6" fontWeight="bold" sx={{ mt: -3, ml: 2, fontSize: '1.8rem' }}>
                        {label}
                    </Typography>
                </Box>

                <Box position="relative" display="inline-flex" justifyContent="center">
                    <CircularProgress
                        variant="determinate"
                        value={progress}
                        size={150} // Smaller size (was 180)
                        thickness={5}
                        sx={{ color, mt: 5 }}
                    />
                    <Box
                        position="absolute"
                        top={0}
                        bottom={0}
                        left={0}
                        right={0}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Typography variant="h5" component="div" color="white" sx={{ mt: 5 }}>
                            {`${Math.round(progress)}%`}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        );
    };

    if (error) {
        return (
            <Container>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    const renderProgressSection = () => {
        return (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={6} justifyContent="center" sx={{ mt: 10 }}>
                <AnimatedCircularProgress
                    icon={<SchoolIcon sx={{ color: '#3f8efc', fontSize: '2rem', mt: -3 }} />}
                    label="LEARNING"
                    color="#3f8efc"
                    target={dashboardData?.progress.learning || 0}
                />
                <Box
                    sx={{
                        bgcolor: '#0d1b2a',
                        color: 'white',
                        px: 6,
                        py: 8,
                        borderRadius: 3,
                        width: '35%', // Reduced from 40%
                        textAlign: 'center',
                        boxShadow: '0px 0px 20px rgba(0,0,0,0.4)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={2}>
                        <FlashOnIcon sx={{ color: '#f4a261', fontSize: '2rem', mt: -3 }} />
                        <Typography variant="h6" fontWeight="bold" sx={{ mt: -3, ml: 2, fontSize: '1.8rem' }}>
                            COMPETITIVE RATING
                        </Typography>
                    </Box>

                    <Box 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            mt: 5
                        }}
                    >
                        <Typography 
                            variant="h2" 
                            component="div" 
                            color="#f4a261" 
                            sx={{ 
                                fontWeight: 'bold', 
                                fontSize: '4.5rem', // Reduced from 5rem
                            }}
                        >
                            {dashboardData?.user?.rating || 0}
                        </Typography>
                    </Box>
                </Box>
            </Stack>
        );
    }

    // New rating history chart component
    const renderRatingHistory = () => {
        const ratings = dashboardData?.user?.last_5_ratings || [];
        
        // If there are no ratings, show a message
        if (ratings.length === 0) {
            return (
                <Box
                    sx={{
                        bgcolor: '#0d1b2a',
                        color: 'white',
                        px: 6,
                        py: 4,
                        borderRadius: 3,
                        width: '80%',
                        mx: 'auto',
                        mt: 4,
                        mb: 4,
                        textAlign: 'center',
                        boxShadow: '0px 0px 20px rgba(0,0,0,0.4)',
                    }}
                >
                    <Typography variant="h6">No rating history available</Typography>
                </Box>
            );
        }

        // Calculate chart dimensions
        const chartHeight = 250;
        const chartWidth = '90%';
        const chartPadding = 40;
        const maxRating = Math.max(...ratings, 100); // Use at least 100 as max for scaling
        const minRating = Math.min(...ratings, 0); // Use 0 as min by default
        const range = maxRating - minRating;
        
        // Calculate positions for points
        const points = ratings.map((rating, index) => {
            // Normalize y position (higher rating = higher position on chart)
            const normalizedY = 1 - ((rating - minRating) / range);
            // Calculate y position (with padding)
            const y = chartPadding + (normalizedY * (chartHeight - (chartPadding * 2)));
            // Calculate x position (evenly spaced)
            const segmentWidth = 100 / (Math.max(1, ratings.length - 1));
            const x = index * segmentWidth;
            
            return { x, y, rating };
        });
        
        return (
            <Box
                sx={{
                    bgcolor: '#0d1b2a',
                    color: 'white',
                    px: 6,
                    py: 4,
                    borderRadius: 3,
                    width: '80%',
                    mx: 'auto',
                    mt: 4,
                    mb: 4,
                    textAlign: 'center',
                    boxShadow: '0px 0px 20px rgba(0,0,0,0.4)',
                }}
            >
                <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={2}>
                    <ShowChartIcon sx={{ color: '#f4a261', fontSize: '2rem' }} />
                    <Typography variant="h6" fontWeight="bold" sx={{ ml: 1, fontSize: '1.8rem' }}>
                        RATING HISTORY
                    </Typography>
                </Box>
                
                <Box 
                    sx={{ 
                        height: `${chartHeight}px`, 
                        width: chartWidth,
                        mx: 'auto',
                        mt: 3,
                        mb: 1,
                        position: 'relative',
                        borderLeft: '1px solid rgba(255,255,255,0.2)',
                        borderBottom: '1px solid rgba(255,255,255,0.2)',
                    }}
                >
                    {/* Y-axis labels */}
                    <Box 
                        sx={{
                            position: 'absolute',
                            left: -40,
                            top: 0,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            {Math.round(maxRating)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {Math.round(minRating)}
                        </Typography>
                    </Box>
                    
                    {/* X-axis labels */}
                    <Box
                        sx={{
                            position: 'absolute',
                            width: '100%',
                            bottom: -25,
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        {ratings.map((_, index) => (
                            <Typography 
                                key={index} 
                                variant="caption" 
                                color="text.secondary"
                            >
                                #{ratings.length - index}
                            </Typography>
                        ))}
                    </Box>
                    
                    {/* Use SVG for drawing lines to ensure proper connections */}
                    <svg
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            overflow: 'visible',
                            zIndex: 1,
                        }}
                    >
                        {points.length > 1 && points.map((point, index, arr) => {
                            if (index === 0) return null; // Skip the first point (no line before it)
                            
                            const prevPoint = arr[index - 1];
                            return (
                                <line
                                    key={`line-${index}`}
                                    x1={`${prevPoint.x}%`}
                                    y1={prevPoint.y}
                                    x2={`${point.x}%`}
                                    y2={point.y}
                                    stroke="#f4a261"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            );
                        })}
                    </svg>
                    
                    {/* Draw points on the chart */}
                    {points.map((point, index) => (
                        <Box
                            key={`point-${index}`}
                            sx={{
                                position: 'absolute',
                                left: `${point.x}%`,
                                top: point.y,
                                width: 12,
                                height: 12,
                                bgcolor: '#f4a261',
                                borderRadius: '50%',
                                transform: 'translate(-50%, -50%)',
                                boxShadow: '0 0 10px rgba(244, 162, 97, 0.7)',
                                '&:hover': {
                                    transform: 'translate(-50%, -50%) scale(1.3)',
                                    boxShadow: '0 0 20px rgba(244, 162, 97, 0.9)',
                                    cursor: 'pointer',
                                },
                                transition: 'all 0.2s ease-in-out',
                                zIndex: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: -35,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    bgcolor: 'rgba(13, 27, 42, 0.8)',
                                    padding: '4px 8px',
                                    borderRadius: 1,
                                    visibility: 'hidden',
                                    opacity: 0,
                                    transition: 'all 0.2s ease-in-out',
                                    '.MuiBox-root:hover > &': {
                                        visibility: 'visible',
                                        opacity: 1,
                                    },
                                    zIndex: 3,
                                }}
                            >
                                <Typography variant="body2">
                                    {point.rating.toFixed(1)}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>

                {/* Rating values display */}
                <Box
                    sx={{
                        display: 'flex', 
                        justifyContent: 'space-between',
                        mt: 3,
                        px: 2
                    }}
                >
                    {ratings.map((rating, index) => (
                        <Box key={index} sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {rating.toFixed(1)}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        );
    };

    const renderRecentLessons = () => {
        return (
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <MenuBookIcon fontSize="large" color="primary" />
                        <Typography variant="h5" component="h2" sx={{ ml: 2, fontWeight: 600 }}>
                            Lessons
                        </Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <List sx={{ mt: -2, width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        {dashboardData?.recent_activities.lessons && dashboardData.recent_activities.lessons.length > 0 ? (
                            dashboardData.recent_activities.lessons.map((lesson, index) => (
                                <ListItem 
                                    key={index} 
                                    component="button"
                                    onClick={() => navigate(`/learn/${lesson}`)}
                                    sx={{ 
                                        cursor: 'pointer',
                                        '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' } 
                                    }}
                                >
                                    <ListItemIcon>
                                        <ArticleIcon sx={{ fontSize: 28 }} color="primary" />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={lesson} 
                                        primaryTypographyProps={{ 
                                            fontSize: '1.3rem',
                                            color: theme.palette.primary.main
                                        }} 
                                    />
                                </ListItem>
                            ))
                        ) : (
                            <ListItem>
                                <ListItemText primary="No recent lessons" />
                            </ListItem>
                        )}
                    </List>
                </AccordionDetails>
            </Accordion>
        )
    }

    const renderRecentChallenges = () => {
        return (
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CodeIcon fontSize="large" color="secondary" />
                        <Typography variant="h5" component="h2" sx={{ ml: 2, fontWeight: 600 }}>
                            Submissions
                        </Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <List sx={{ mt: -2, width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        {dashboardData?.recent_activities.submissions && dashboardData.recent_activities.submissions.length > 0 ? (
                            dashboardData.recent_activities.submissions.map((submission, index) => (
                                <ListItem key={index}>
                                    <ListItemIcon>
                                        <CheckCircleOutlineIcon sx={{ fontSize: 32 }} color="secondary" />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={`Submission ID: ${submission}`} 
                                        primaryTypographyProps={{ fontSize: '1.3rem' }} 
                                        secondary={
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                color="primary"
                                                sx={{
                                                    cursor: 'pointer',
                                                    textDecoration: 'underline',
                                                    '&:hover': {
                                                        color: 'secondary.main',
                                                    },
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent accordion from toggling
                                                    navigate(`/submission/${submission}`);
                                                }}
                                            >
                                                View Details
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            ))
                        ) : (
                            <ListItem>
                                <ListItemText primary="No recent submissions" />
                            </ListItem>
                        )}
                    </List>
                </AccordionDetails>
            </Accordion>
        )
    }

    const renderRecentActivitySection = () => {
        // Get the most recent lesson for the Resume Learning button
        const mostRecentLesson = dashboardData?.recent_activities.lessons && 
                               dashboardData.recent_activities.lessons.length > 0 ? 
                               dashboardData.recent_activities.lessons[0] : 
                               'creational-patterns/singleton'; // Default if no recent lessons
        
        return (
            <Box sx={{ mt: 10, mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Recent Activities
                </Typography>
                <Stack direction="column" spacing={1} sx={{ mt: 10 }}>
                    {renderRecentLessons()}
                    {renderRecentChallenges()}
                </Stack>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="outlined"
                        startIcon={<SchoolIcon />}
                        onClick={() => navigate(`/learn/${mostRecentLesson}`)}
                        sx={{
                            alignItems: 'center',
                            color: 'white',
                            px: 4,
                            py: 1.5,
                            fontSize: '1.1rem',
                            mt: 5,
                            textTransform: 'none',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                            transition: 'all 0.3s ease-in-out',
                            display: 'flex',
                            '&:hover': {
                                background: '#1976d2',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 25px rgba(39, 35, 35, 0.3)',
                            },
                            '&:active': {
                                transform: 'scale(0.98)',
                            },
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span>Resume Learning</span>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                {[0, 1, 2].map((delay, index) => (
                                    <KeyboardArrowRightIcon
                                        key={index}
                                        sx={{
                                            color: 'white',
                                            fontSize: '1.1rem',
                                            animation: 'arrowMove 1.2s infinite',
                                            animationDelay: `${delay * 0.15}s`,
                                            '@keyframes arrowMove': {
                                                '0%': { transform: 'translateX(0)' },
                                                '50%': { transform: 'translateX(4px)' },
                                                '100%': { transform: 'translateX(0)' },
                                            },
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Button>
                </Box>
            </Box>
        )
    }

    const renderLearningMode = () => {
        return (
            <Card sx={{ textAlign: 'center', p: 2, flex: 1 }}>
                <CardContent>
                    <SchoolIcon color="primary" sx={{ fontSize: 60, mb: 1 }} />
                    <Typography variant="h5">Learning Mode</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                        Learn design patterns with interactive tutorials.
                    </Typography>
                    <Button
                        variant="outlined"
                        sx={{
                            alignItems: 'center',
                            color: 'white',
                            px: 4,
                            py: 1.5,
                            fontSize: '1.1rem',
                            mt: 5,
                            textTransform: 'none',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                                background: '#1976d2',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 25px rgba(39, 35, 35, 0.3)',
                            },
                            '&:active': {
                                transform: 'scale(0.98)',
                            },
                        }}
                        onClick={() => navigate('/learn')}
                    >
                        Start Learning
                    </Button>
                </CardContent>
            </Card>
        )
    }

    const renderChallengeMode = () => {
        return (
            <Card sx={{ textAlign: 'center', p: 2, flex: 1 }}>
                <CardContent>
                    <FlashOnIcon color="secondary" sx={{ fontSize: 60, mb: 1 }} />
                    <Typography variant="h5">Challenge Mode</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                        Test your skills with coding challenges.
                    </Typography>
                    <Button
                        variant="outlined"
                        color='secondary'
                        sx={{
                            alignItems: 'center',
                            color: 'white',
                            px: 4,
                            py: 1.5,
                            fontSize: '1.1rem',
                            mt: 5,
                            textTransform: 'none',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                                background: '#F97316',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 25px rgba(39, 35, 35, 0.3)',
                            },
                            '&:active': {
                                transform: 'scale(0.98)',
                            },
                        }}
                        onClick={() => navigate('/challenges')}
                    >
                        Take Challenge
                    </Button>
                </CardContent>
            </Card >
        )
    }

    const renderModes = () => {
        return (
            <Stack sx={{ mt: 10 }} spacing={3} direction={{ xs: 'column', md: 'row' }}>
                {renderLearningMode()}
                {renderChallengeMode()}
            </Stack>
        )
    }

    return (
        <Box sx={{ px: 35, py: 10 }}>
            {/* Welcome Section */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Avatar sx={{ width: 150, height: 150, mx: 'auto', bgcolor: 'primary.main', fontSize: '3rem' }}>
                    {dashboardData?.user.username?.[0].toUpperCase() || currentUser?.email?.[0].toUpperCase() || 'U'}
                </Avatar>
                <Typography variant="h4" sx={{ mt: 5 }}>
                    Welcome back, {dashboardData?.user.username || 'User'}!
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 2 }}>
                    {dashboardData?.user.email || currentUser?.email}
                </Typography>
            </Box>

            {renderProgressSection()}
            {renderRatingHistory()}
            {renderRecentActivitySection()}
            {renderModes()}
        </Box >
    );
};

export default UserDashboard;