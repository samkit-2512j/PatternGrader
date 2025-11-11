import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { patternService, Pattern, PatternProgress } from '../../services/patternService';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
  Divider
} from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const DesignPatternLesson: React.FC = () => {
  const { category, pattern } = useParams<{ category: string; pattern: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [patternData, setPatternData] = useState<Pattern | null>(null);
  const [progress, setProgress] = useState<PatternProgress | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: string }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [sectionLoading, setSectionLoading] = useState(false);
  const [completingLesson, setCompletingLesson] = useState(false);
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser || !pattern) return;

      try {
        // Fetch pattern data and user progress in parallel
        const [patternData, userProgress] = await Promise.all([
          patternService.getPattern(pattern),
          patternService.getUserProgress(currentUser?.id, pattern)
        ]);

        if (!patternData) {
          setError('Pattern not found');
          return;
        }

        setPatternData(patternData);
        // Initialize with default progress if none exists
        setProgress(userProgress || {
          userId: currentUser?.id,
          patternId: pattern,
          completedSections: [],
          quizAnswers: {},
          quizScore: 0,
          isCompleted: false,
          lastUpdated: new Date()
        });
        setLoading(false);
      } catch (error) {
        setError('Error loading pattern data');
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, pattern]);

  const handleNext = async () => {
    if (!currentUser || !patternData || !pattern) return;

    try {
      setSectionLoading(true);

      // Only update section progress if we're within the sections array bounds
      if (activeStep >= 0 && activeStep < patternData.sections.length) {
        const currentSection = patternData.sections[activeStep];

        // Only update if section hasn't been completed
        if (!progress?.completedSections.includes(currentSection.title)) {
          await patternService.updateSectionProgress(
            currentUser?.id,
            pattern,
            currentSection.title,
            true
          );

          // Update local progress state
          setProgress((prev) => {
            if (!prev) return {
              userId: currentUser?.id,
              patternId: pattern,
              completedSections: [currentSection.title],
              quizAnswers: {},
              quizScore: 0,
              isCompleted: false,
              lastUpdated: new Date()
            };

            return {
              ...prev,
              completedSections: [...prev.completedSections, currentSection.title],
              lastUpdated: new Date()
            };
          });
        }
      }

      // Move to next step immediately
      setActiveStep((prevStep) => prevStep + 1);
      setSectionLoading(false);
    } catch (error) {
      console.error('Error updating progress:', error);
      setError('Failed to update progress');
      setSectionLoading(false);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleQuizAnswer = (questionId: string, answer: string) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleQuizSubmit = async () => {
    if (!currentUser || !pattern || !patternData) return;

    const score = await patternService.submitQuiz(currentUser?.id, pattern, quizAnswers);
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  const handleCompleteLesson = async () => {
    if (!currentUser || !pattern || !category) return;
    
    try {
      setCompletingLesson(true);
      // Create a unique lesson ID that includes category and pattern
      const lessonId = `${category}/${pattern}`;
      
      // Remove the '/api' prefix to match the backend route
      const response = await axios.post('/learning/complete-lesson', 
        { lesson_id: lessonId },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        if (response.data.alreadyCompleted) {
          setCompletionMessage('You have already completed this lesson.');
        } else {
          setCompletionMessage('Lesson completed successfully! Your progress has been updated.');
        }
        
        // Navigate after a small delay to show the message
        setTimeout(() => {
          navigate('/learn');
        }, 2000);
      }
    } catch (error) {
      console.error('Error completing lesson:', error);
      setCompletionMessage('Failed to mark lesson as completed. Please try again.');
    } finally {
      setCompletingLesson(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !patternData) {
    return (
      <Container>
        <Alert severity="error">{error || 'Pattern not found'}</Alert>
      </Container>
    );
  }

  const isQuizSection = activeStep === patternData.sections.length;
  const allQuestionsAnswered = patternData.questions.every(
    (q) => quizAnswers[q.id]
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumb Navigation */}
      <Breadcrumbs separator="›" sx={{ mb: 3 }}>
        <Link
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/learn');
          }}
        >
          Learning
        </Link>
        <Link
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/learn/${category}`);
          }}
        >
          {category}
        </Link>
        <Typography color="text.primary">{patternData.name}</Typography>
      </Breadcrumbs>

      {/* Progress Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {patternData.sections.map((section, index) => (
          <Step key={section.title}>
            <StepLabel>{section.title}</StepLabel>
          </Step>
        ))}
        <Step>
          <StepLabel>Quiz</StepLabel>
        </Step>
      </Stepper>

      {/* Content Section */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        {!isQuizSection ? (
          // Section Content
          <>
            <Typography variant="h4" gutterBottom>
              {patternData.sections[activeStep].title}
            </Typography>
            <Typography paragraph>
              {patternData.sections[activeStep].content}
            </Typography>
            {patternData.sections[activeStep].code && (
              <Box sx={{ my: 3 }}>
                <SyntaxHighlighter
                  language="typescript"
                  style={materialDark}
                  showLineNumbers
                >
                  {patternData.sections[activeStep].code || ''}
                </SyntaxHighlighter>
              </Box>
            )}
          </>
        ) : (
          // Quiz Section
          <>
            <Typography variant="h4" gutterBottom>
              Knowledge Check
            </Typography>
            {quizSubmitted ? (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Quiz Results
                </Typography>
                <Typography>
                  You scored {quizScore} out of {patternData.questions.length}
                </Typography>
                {patternData.questions.map((question) => (
                  <Box key={question.id} sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {question.text}
                    </Typography>
                    <Typography
                      color={
                        quizAnswers[question.id] === question.correctAnswer
                          ? 'success.main'
                          : 'error.main'
                      }
                    >
                      Your answer: {quizAnswers[question.id]}
                    </Typography>
                    <Typography color="success.main">
                      Correct answer: {question.correctAnswer}
                    </Typography>
                    <Typography sx={{ mt: 1 }} color="text.secondary">
                      {question.explanation}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box>
                {patternData.questions.map((question) => (
                  <Box key={question.id} sx={{ mb: 4 }}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">{question.text}</FormLabel>
                      <RadioGroup
                        value={quizAnswers[question.id] || ''}
                        onChange={(e) =>
                          handleQuizAnswer(question.id, e.target.value)
                        }
                      >
                        {question.options.map((option) => (
                          <FormControlLabel
                            key={option}
                            value={option}
                            control={<Radio />}
                            label={option}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </Box>
                ))}
              </Box>
            )}
          </>
        )}
      </Paper>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button
          variant="contained"
          onClick={handleBack}
          startIcon={<NavigateBeforeIcon />}
          disabled={activeStep === 0 || sectionLoading}
        >
          Previous
        </Button>
        {isQuizSection ? (
          !quizSubmitted ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleQuizSubmit}
              disabled={!allQuestionsAnswered || sectionLoading}
              endIcon={<CheckCircleIcon />}
            >
              {sectionLoading ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleCompleteLesson}
              endIcon={<NavigateNextIcon />}
              disabled={completingLesson}
            >
              {completingLesson ? 'Completing...' : 'Complete Lesson'}
            </Button>
          )
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={<NavigateNextIcon />}
            disabled={activeStep === patternData.sections.length || sectionLoading}
          >
            {sectionLoading ? 'Loading...' : 'Next'}
          </Button>
        )}
      </Box>
      
      {/* Completion Message */}
      {completionMessage && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {completionMessage}
        </Alert>
      )}
    </Container>
  );
};

export default DesignPatternLesson;