import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { patternService, Pattern, PatternProgress } from '../../services/patternService';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  LinearProgress,
  Chip,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface CategoryProgress {
  [key: string]: {
    completed: number;
    total: number;
  };
}

const categories = {
  'creational-patterns': {
    title: 'Creational Patterns',
    description: 'Design patterns that deal with object creation mechanisms.',
    patterns: ['singleton', 'factory', 'builder', 'prototype', 'abstract-factory']
  },
  'structural-patterns': {
    title: 'Structural Patterns',
    description: 'Design patterns that deal with object composition and relationships.',
    patterns: ['adapter', 'bridge', 'composite', 'decorator', 'facade']
  },
  'behavioral-patterns': {
    title: 'Behavioral Patterns',
    description: 'Design patterns that deal with communication between objects.',
    patterns: ['observer', 'strategy', 'command', 'state', 'template']
  }
};

const DesignPatternsMenu: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ [key: string]: PatternProgress }>({});
  const [categoryProgress, setCategoryProgress] = useState<CategoryProgress>({});

  useEffect(() => {
    const fetchProgress = async () => {
      if (!currentUser) return;

      try {
        const progressData: { [key: string]: PatternProgress } = {};
        const categoryStats: CategoryProgress = {};

        // Fetch progress for each pattern in each category
        for (const [categoryId, category] of Object.entries(categories)) {
          categoryStats[categoryId] = { completed: 0, total: category.patterns.length };

          for (const patternId of category.patterns) {
            const patternProgress = await patternService.getUserProgress(
              currentUser?.id,
              patternId
            );

            if (patternProgress) {
              progressData[patternId] = patternProgress;
              if (patternProgress.isCompleted) {
                categoryStats[categoryId].completed++;
              }
            }
          }
        }

        setProgress(progressData);
        setCategoryProgress(categoryStats);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching progress:', error);
        setError('Failed to load progress data');
        setLoading(false);
      }
    };

    fetchProgress();
  }, [currentUser]);

  const handlePatternClick = async (categoryId: string, patternId: string) => {
    if (!currentUser) return;

    try {
      // Update the user's last_lesson in the backend
      await axios.put('/profile/update', {
        email: currentUser.email, // Use email to identify the user
        last_lesson: `${categoryId}/${patternId}`, // Update last_lesson with the selected pattern
      });

      // Navigate to the selected pattern
      navigate(`/learn/${categoryId}/${patternId}`);
    } catch (error) {
      console.error('Error updating last lesson:', error);
      setError('Failed to update last lesson');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Design Patterns Learning Path
      </Typography>
      <Typography variant="body1" paragraph>
        Master software design patterns through interactive lessons and hands-on examples.
      </Typography>

      {Object.entries(categories).map(([categoryId, category], categoryIndex) => (
        <Box key={categoryId} sx={{ mb: 6 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              {category.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {category.description}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {category.patterns.map((patternId, index) => {
              const patternProgress = progress[patternId];
              // Remove the locking mechanism to make all patterns available
              const isLocked = false; // Previously checked if previous category was completed
              const completedSections = patternProgress?.completedSections.length || 0;

              return (
                <Box 
                  key={patternId}
                  sx={{ 
                    width: {
                      xs: '100%',
                      sm: 'calc(50% - 24px)',
                      md: 'calc(33.333% - 24px)'
                    }
                  }}
                >
                  <Card
                    elevation={3}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      opacity: isLocked ? 0.7 : 1  // This will always be 1 now
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          {patternId
                            .split('-')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')}
                        </Typography>
                        {patternProgress?.isCompleted && (
                          <CheckCircleIcon color="success" />
                        )}
                      </Box>
                      {completedSections > 0 && (
                        <>
                          <LinearProgress
                            variant="determinate"
                            value={(completedSections / 5) * 100}
                            sx={{ mb: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {completedSections} of 5 sections completed
                          </Typography>
                        </>
                      )}
                    </CardContent>
                    <Divider />
                    <CardActions>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => handlePatternClick(categoryId, patternId)}
                        disabled={isLocked} // This will always be false (enabled)
                        endIcon={isLocked ? <LockIcon /> : <ArrowForwardIcon />}
                      >
                        {isLocked ? 'Locked' : 'Start Learning'} 
                      </Button>
                    </CardActions>
                  </Card>
                </Box>
              );
            })}
          </Box>
        </Box>
      ))}
    </Container>
  );
};

export default DesignPatternsMenu;