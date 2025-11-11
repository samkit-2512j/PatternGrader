import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardActionArea,
  Chip,
  Container,
  Paper,
  Divider,
  Tooltip,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CodeIcon from '@mui/icons-material/Code';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import BugReportIcon from '@mui/icons-material/BugReport';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

interface ChallengeItem {
  id: string;
  title: string;
  completed: boolean;
  description: string;
  locked?: boolean;
}

interface ChallengeCategory {
  category: string;
  items: ChallengeItem[];
  isCompleted?: boolean;
}

const challengesData: ChallengeCategory[] = [
  {
    category: 'Beginner',
    items: [
      { id: 'simple-refactoring', title: 'Simple Refactoring', completed: false, description: 'Apply basic design patterns to refactor poorly written code.' },
      { id: 'pattern-identification', title: 'Pattern Identification', completed: false, description: 'Identify design patterns in existing codebases.' },
      { id: 'implement-singleton', title: 'Implement Singleton', completed: false, description: 'Create a proper singleton implementation with thread safety.' },
      { id: 'builder-pattern', title: 'Builder Pattern', completed: false, description: 'Implement the Builder pattern for a complex object creation.' },
      { id: 'adapter-pattern', title: 'Adapter Pattern', completed: false, description: 'Create an adapter to make incompatible interfaces work together.' },
      { id: 'facade-pattern', title: 'Facade Pattern', completed: false, description: 'Simplify a complex subsystem using the Facade pattern.' },
    ]
  },
  {
    category: 'Intermediate',
    items: [
      { id: 'factory-method', title: 'Factory Method Challenge', completed: false, description: 'Implement a flexible object creation system using the Factory Method pattern.' },
      { id: 'observer-pattern', title: 'Observer Pattern Implementation', completed: false, description: 'Create a reactive system using the Observer pattern.' },
      { id: 'strategy-pattern', title: 'Strategy Pattern Refactoring', completed: false, description: 'Refactor existing code to use the Strategy pattern for better flexibility.' },
    ]
  },
  {
    category: 'Advanced',
    items: [
      { id: 'complex-decorator', title: 'Complex Decorator System', completed: false, description: 'Build a multi-layered decorator system for a document processing application.' },
      { id: 'microservices-patterns', title: 'Microservices Patterns', completed: false, description: 'Apply design patterns specific to microservice architecture.' },
      { id: 'pattern-combinations', title: 'Pattern Combinations', completed: false, description: 'Solve a complex problem using multiple design patterns together.' },
    ]
  }
];

const getCategoryIcon = (category: string) => {
  switch(category) {
    case 'Beginner': return <CodeIcon fontSize="large" color="info" />;
    case 'Intermediate': return <AutoFixHighIcon fontSize="large" color="warning" />;
    case 'Advanced': return <BugReportIcon fontSize="large" color="error" />;
    default: return <CodeIcon fontSize="large" />;
  }
};

function ChallengesMenu() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [challenges, setChallenges] = useState<ChallengeCategory[]>(challengesData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Simplified data fetching
  useEffect(() => {
    const fetchUserData = async () => {
      if (!localStorage.getItem('userId')) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      try {
        // Direct approach to get the data
        const userId = localStorage.getItem('userId') || '';
        console.log(`Fetching data for user ID: ${userId}`);
        
        const response = await axios.get('/api/user/completed-challenges', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            id: userId,
          },
        });
        
        // Log full response for debugging
        console.log('Full API response:', response.data);
        
        // Process challenges data
        const { completed_challenges, topics } = response.data;
        
        // Update challenges with completion data
        const updatedChallenges = challenges.map(category => {
          const updatedItems = category.items.map(item => {
            // Check if this challenge topic exists in the completed topics data
            const topicData = topics[item.id];
            
            // Mark as completed if the user has completed this challenge
            // or if the entire topic is completed
            const completed = topicData?.isCompleted || false;
            
            // Lock items if the topic is completed
            const locked = topicData?.isCompleted || false;
            
            return {
              ...item,
              completed,
              locked
            };
          });
          
          // Check if all challenges in this category are completed
          const isCompleted = updatedItems.every(item => item.completed);
          
          return {
            ...category,
            items: updatedItems,
            isCompleted
          };
        });
        
        setChallenges(updatedChallenges);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChallengeClick = (categoryId: string, challengeId: string, locked: boolean = false) => {
    if (locked) {
      // Do not navigate if the topic is locked
      return;
    }
    navigate(`/challenges/${categoryId}/${challengeId}`);
  };

  const handleRandomQuestion = () => {
    // Get all available challenges that aren't locked
    const availableChallenges: {categoryId: string, challengeId: string}[] = [];
    
    challenges.forEach(category => {
      category.items.forEach(item => {
        if (!item.locked) {
          availableChallenges.push({
            categoryId: category.category.toLowerCase().replace(/\s+/g, '-'),
            challengeId: item.id
          });
        }
      });
    });
    
    if (availableChallenges.length > 0) {
      const randomIndex: number = Math.floor(Math.random() * availableChallenges.length);
      const { categoryId, challengeId }: { categoryId: string; challengeId: string } = availableChallenges[randomIndex];
      navigate(`/challenges/${categoryId}/${challengeId}`);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h5">Loading challenges...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h5" color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ fontWeight: 700, textAlign: 'center', mb: 4 }}
        >
          Coding Challenges
        </Typography>
        
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ mb: 3, textAlign: 'center' }}
        >
          Apply your design pattern knowledge with hands-on coding challenges
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<ShuffleIcon />}
            onClick={handleRandomQuestion}
            sx={{ py: 1.5, px: 4 }}
          >
            Attempt a Random Question
          </Button>
        </Box>

        {challenges.map((category) => (
          <Box key={category.category} sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {getCategoryIcon(category.category)}
              <Typography variant="h4" component="h2" sx={{ ml: 2 }}>
                {category.category}
              </Typography>
              {category.isCompleted && (
                <Chip 
                  icon={<CheckCircleIcon />} 
                  label="All Completed!" 
                  color="success" 
                  sx={{ ml: 2 }}
                />
              )}
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              gap: 3,
              mt: 2
            }}>
              {category.items.map((challenge) => (
                <Box 
                  key={challenge.id} 
                  sx={{ 
                    width: {
                      xs: '100%',
                      sm: 'calc(50% - 24px)',
                      md: 'calc(33.333% - 24px)'
                    }
                  }}
                >
                  <Tooltip title={challenge.locked ? "All challenges in this topic completed!" : ""}>
                    <Card 
                      sx={{ 
                        height: '220px', // Reduced fixed height
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: challenge.locked ? 'none' : 'translateY(-4px)',
                          boxShadow: challenge.locked ? 2 : 6
                        },
                        position: 'relative',
                        border: '1px solid',
                        borderColor: challenge.completed ? 'success.main' : 'transparent',
                        opacity: challenge.locked ? 0.7 : 1,
                      }}
                    >
                      {challenge.completed && (
                        <Box 
                          sx={{ 
                            position: 'absolute', 
                            top: 10, 
                            right: 10,
                            bgcolor: 'success.main',
                            color: 'white',
                            borderRadius: '50%',
                            width: 24,
                            height: 24,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            zIndex: 1
                          }}
                        >
                          ✓
                        </Box>
                      )}
                      {challenge.locked && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(0,0,0,0.1)',
                            zIndex: 2,
                            backdropFilter: 'blur(2px)'
                          }}
                        >
                          <LockIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                        </Box>
                      )}
                      <CardActionArea 
                        sx={{ height: '100%' }}
                        onClick={() => handleChallengeClick(
                          category.category.toLowerCase().replace(/\s+/g, '-'), 
                          challenge.id,
                          challenge.locked
                        )}
                        disabled={challenge.locked}
                      >
                        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', py: 2 }}> {/* Reduced padding */}
                          <Typography variant="h6" component="h3" sx={{ mb: 1 }}> {/* Reduced margin */}
                            {challenge.title}
                          </Typography>
                          <Box sx={{ mb: 1 }}> {/* Reduced margin */}
                            {challenge.completed && (
                              <Chip 
                                label="Completed" 
                                size="small" 
                                color="success"
                              />
                            )}
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {challenge.description}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Tooltip>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Container>
  );
}

export default ChallengesMenu;