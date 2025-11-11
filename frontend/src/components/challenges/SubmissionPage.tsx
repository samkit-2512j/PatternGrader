import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom'; 
import axios from 'axios'; // Import axios for API calls
import {
    Box,
    Typography,
    Button,
    Paper,
    Stack,
    IconButton,
    Modal,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
    CircularProgress
} from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Confetti from 'react-confetti';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ErrorIcon from '@mui/icons-material/Error';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CloseIcon from '@mui/icons-material/Close';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const code = `public class HelloWorld {
  public static void main(String[] args) {
    System.out.println("Hello, world!");
  }
}`;

const SubmissionPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { submissionId } = useParams<{ submissionId: string }>();
    
    const [score, setScore] = useState<number>(0);
    const [designPattern, setDesignPattern] = useState<string>("");
    const [questionId, setQuestionId] = useState<number>(0);
    const [ratingChange, setRatingChange] = useState<number>(0);
    const [oldRating, setOldRating] = useState<number>(0);
    const [newRating, setNewRating] = useState<number>(0);
    
    const passed = score >= 70; // Define passing score
    const [errors, setErrors] = useState<string[]>([]);

    const [open, setSubmissionOpen] = useState(false);
    const [evaluationOpen, setEvaluationOpen] = useState(false);
    const [llmSolutionOpen, setLLMSolutionOpen] = useState(false);
    const [submissionDetails, setSubmissionDetails] = useState<any>(null);
    const [evaluationDetails, setEvaluationDetails] = useState<any>(null);
    const [llmSolution, setLLMSolution] = useState<string>('');
    const [copied, setCopied] = useState(false);
    const [llmCopied, setLLMCopied] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch submission details using the URL parameter
    useEffect(() => {
        const fetchSubmissionDetails = async () => {
            if (!submissionId) return;
            
            try {
                setLoading(true);
                const response = await axios.get(`/api/submission/${submissionId}`);
                const data = response.data;
                
                setSubmissionDetails(data);
                setScore(data.score);
                setQuestionId(parseInt(data.question_id));
                
                // Get rating information if available
                // For newly created submissions this will come from state/location
                // For directly accessed submissions, we'll try to calculate
                if (location.state && location.state.ratingChange !== undefined) {
                    setRatingChange(location.state.ratingChange);
                    setOldRating(location.state.oldRating);
                    setNewRating(location.state.newRating);
                } else {
                    // Try to calculate from the score if we don't have the data
                    const estimatedChange = data.score - 70; // Using 70 as threshold
                    setRatingChange(estimatedChange);
                    
                    // If we have current_rating from the API response
                    if (data.current_rating !== undefined) {
                        setNewRating(data.current_rating);
                        setOldRating(Math.round((data.current_rating - estimatedChange) * 10) / 10);
                    }
                }
                
                // Set evaluation details if available
                if (data.evaluation_data) {
                    setEvaluationDetails(data.evaluation_data);
                }
                
                // Fetch question details to get design pattern
                try {
                    // Don't directly use question_id as the path parameter
                    // Instead, use a separate endpoint to fetch question by ID
                    const questionResponse = await axios.get(`/api/question-by-id/${data.question_id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            id: localStorage.getItem('userId') || '',
                        }
                    });
                    
                    // If this endpoint isn't available, fallback to showing just the score without pattern info
                    if (questionResponse.data && questionResponse.data.question) {
                        setDesignPattern(questionResponse.data.question.design_pattern || "");
                    }
                } catch (err) {
                    console.error('Error fetching question details:', err);
                    // Don't let this error block the submission page from showing
                    // Just continue without the design pattern info
                }
            } catch (error) {
                console.error('Error fetching submission details:', error);
                // Handle error appropriately
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissionDetails();
    }, [submissionId, location.state]);

    const handleViewLLMSolution = async () => {
        setLLMSolutionOpen(true);
        try {
            setLoading(true);
            // Now this will call our implemented backend endpoint
            const response = await axios.get(`/api/llm-solution/${questionId}`);
            if (response.data && response.data.solution) {
                setLLMSolution(response.data.solution);
            } else {
                setLLMSolution(`// Error: Solution not found for ${designPattern} pattern`);
            }
        } catch (error) {
            console.error('Error fetching LLM solution:', error);
            setLLMSolution(`// Error fetching solution.
// Here's a generic example of the ${designPattern} pattern:
            
public class Solution {
    // Generic implementation would demonstrate ${designPattern} pattern
}`);
        } finally {
            setLoading(false);
        }
    };

    // Fetch submission details without opening modal
    const fetchSubmissionDetailsWithoutModal = async () => {
        if (!submissionId || submissionId === "submission_id_placeholder") return;
        
        try {
            setLoading(true);
            const response = await axios.get(`/api/submission/${submissionId}`);
            setSubmissionDetails(response.data);
        } catch (error) {
            console.error('Error fetching submission details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewSubmission = () => {
        setSubmissionOpen(true);
    };

    const handleViewEvaluation = () => {
        setEvaluationOpen(true);
        // Now we're using the evaluation_data directly from the submission
        // instead of generating it here
    };

    const handleCloseSubmission = () => {
        setSubmissionOpen(false);
    };

    const handleCloseEvaluation = () => {
        setEvaluationOpen(false);
    };

    const handleCloseLLMSolution = () => {
        setLLMSolutionOpen(false);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(submissionDetails?.llm_response || '');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // reset after 2s
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    const handleCopyLLMSolution = async () => {
        try {
            await navigator.clipboard.writeText(llmSolution);
            setLLMCopied(true);
            setTimeout(() => setLLMCopied(false), 2000); // reset after 2s
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    interface AnimatedCircularProgressProps {
        color: string;
        target: number;
        shouldAnimate: boolean;
    }

    const [hasAnimated, setHasAnimated] = useState(false);

    // Fetch submission details when component mounts but don't open the modal
    useEffect(() => {
        if (submissionId && submissionId !== "submission_id_placeholder") {
            fetchSubmissionDetailsWithoutModal();
        }
        
        const animatedOnce = sessionStorage.getItem('hasAnimatedProgress');
        if (!animatedOnce) {
            sessionStorage.setItem('hasAnimatedProgress', 'true');
            setHasAnimated(true);
        }
    }, [submissionId]);

    const AnimatedCircularProgress: React.FC<AnimatedCircularProgressProps> = ({
        color,
        target,
        shouldAnimate,
    }) => {
        const [progress, setProgress] = useState(shouldAnimate ? 0 : target);

        useEffect(() => {
            if (!shouldAnimate) return;

            const timer = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= target) {
                        clearInterval(timer);
                        return target;
                    }
                    return prev + 1;
                });
            }, 15);

            return () => clearInterval(timer);
        }, [shouldAnimate, target]);

        return (
            <Box position="relative" display="inline-flex" justifyContent="center">
                <CircularProgress
                    variant="determinate"
                    value={progress}
                    size={180}
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
        );
    };

    const useWindowSize = () => {
        const [size, setSize] = useState({
            width: window.innerWidth,
            height: window.innerHeight
        });

        useEffect(() => {
            const handleResize = () => {
                setSize({
                    width: window.innerWidth,
                    height: window.innerHeight
                });
            };

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }, []);

        return size;
    };

    const progressColor = passed ? '#2E7D32' : '#D32F2F';
    const { width, height } = useWindowSize();

    // Render rating change component
    const renderRatingChange = () => {
        if (ratingChange === 0) return null;
        
        const isPositive = ratingChange > 0;
        
        return (
            <Box 
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mb: 2,
                    p: 1,
                    borderRadius: 1,
                    bgcolor: isPositive ? 'rgba(46, 125, 50, 0.1)' : 'rgba(211, 47, 47, 0.1)'
                }}
            >
                {isPositive ? (
                    <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                ) : (
                    <TrendingDownIcon color="error" sx={{ mr: 1 }} />
                )}
                <Typography 
                    variant="body1" 
                    color={isPositive ? 'success.main' : 'error.main'}
                    sx={{ fontWeight: 'bold' }}
                >
                    Rating: {oldRating} {isPositive ? '+' : ''}{ratingChange} = {newRating}
                </Typography>
            </Box>
        );
    };

    // Handle navigation to challenges menu
    const handleBackToChallenges = () => {
        navigate('/challenges');
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Box sx={{ maxWidth: 600, mx: 'auto', mt: 8 }}>
                <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                    {passed && (
                        <Confetti
                            width={width}
                            height={height}
                            numberOfPieces={250}
                            gravity={0.2}
                            recycle={false} // Only play once
                        />
                    )}
                    {/* Circular Progress */}
                    <AnimatedCircularProgress
                        color={progressColor}
                        target={score}
                        shouldAnimate={hasAnimated}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
                        {passed ? (
                            <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
                        ) : (
                            <ErrorIcon color="error" sx={{ fontSize: 60 }} />
                        )}
                    </Box>

                    {/* Heading and Description */}
                    {passed ? (
                        <>
                            <Typography variant="h4" gutterBottom>
                                Congratulations!
                            </Typography>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                You passed with a score of {score}%
                            </Typography>
                        </>
                    ) : (
                        <>
                            <Typography variant="h4" gutterBottom>
                                Try Again
                            </Typography>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                You scored {score}%. Let's work on the issues below:
                            </Typography>

                            {/* Error list */}
                            {errors.length > 0 && (
                                <List>
                                    {errors.map((err, idx) => (
                                        <ListItem key={idx}>
                                            <ListItemIcon>
                                                <ErrorIcon color="error" />
                                            </ListItemIcon>
                                            <ListItemText primary={err} />
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </>
                    )}

                    {/* Display Rating Change */}
                    {renderRatingChange()}

                    {/* Action Buttons */}
                    <Stack spacing={2} direction="column" sx={{ mt: 3 }}>
                        <Button
                            variant="contained"
                            startIcon={<VisibilityIcon />}
                            onClick={handleViewSubmission}
                        >
                            View Submission
                        </Button>

                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<AssessmentIcon />}
                            onClick={handleViewEvaluation}
                        >
                            View Evaluation
                        </Button>

                        <Button
                            variant="text"
                            startIcon={<LightbulbIcon />}
                            onClick={handleViewLLMSolution}
                            color="primary"
                        >
                            View LLM Solution
                        </Button>
                        
                        {/* Back to Challenges button */}
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={handleBackToChallenges}
                            sx={{ mt: 2 }}
                        >
                            Back to Challenges
                        </Button>
                    </Stack>
                </Paper>
            </Box>

            {/* Submission Modal with scrollable content */}
            <Modal
                open={open}
                onClose={handleCloseSubmission}
                aria-labelledby="submission-modal-title"
                aria-describedby="submission-modal-description"
            >
                <Paper variant='elevation' square sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 700,
                    maxHeight: '80vh', // Limit max height to 80% of viewport height
                    bgcolor: '#0F1729',
                    boxShadow: 24,
                    p: 4,
                    display: 'flex', 
                    flexDirection: 'column', // Organize content vertically
                    overflow: 'hidden', // Hide overflow on the container
                }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" id="submission-modal-title">
                            Submission Details
                        </Typography>
                        <IconButton onClick={handleCloseSubmission}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box 
                        sx={{ 
                            position: 'relative', 
                            mb: 3, 
                            flexGrow: 1, // Take remaining space
                            overflow: 'auto', // Add scrollbar to this box
                        }}
                    >
                        {/* Copy Icon */}
                        <Tooltip title={copied ? 'Copied!' : 'Copy'} arrow>
                            <IconButton
                                onClick={handleCopy}
                                sx={{
                                    position: 'sticky', // Make it sticky so it's always visible
                                    top: 8,
                                    right: 8,
                                    float: 'right', // Float to right
                                    zIndex: 10, // Ensure it's above the code
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    }
                                }}
                            >
                                <ContentCopyIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        {/* Code Block */}
                        <SyntaxHighlighter
                            language="java"
                            style={oneDark}
                            wrapLongLines
                            customStyle={{
                                padding: '1.5rem 1rem',
                                borderRadius: '8px',
                                fontSize: '0.95rem',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                overflow: 'visible', // Allow the code to be visible in scroll container
                            }}
                            codeTagProps={{
                                style: {
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                }
                            }}
                        >
                            {submissionDetails?.llm_response || 'No submission details available'}
                        </SyntaxHighlighter>
                    </Box>
                </Paper>
            </Modal>

            {/* Also make the other modals scrollable */}
            {/* Evaluation Modal */}
            <Modal
                open={evaluationOpen}
                onClose={handleCloseEvaluation}
                aria-labelledby="evaluation-modal-title"
                aria-describedby="evaluation-modal-description"
            >
                <Paper variant='elevation' square sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 700,
                    maxHeight: '80vh',
                    bgcolor: '#0F1729',
                    boxShadow: 24,
                    p: 4,
                    overflow: 'auto', // Make scrollable
                }}>
                    {/* ...existing code... */}
                    <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" id="evaluation-modal-title">
                                Code Evaluation
                            </Typography>
                            <IconButton onClick={handleCloseEvaluation}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        
                        {evaluationDetails && (
                            <Box sx={{ color: 'white' }}>
                                <Typography variant="h6" color="success.main" sx={{ mb: 1, mt: 2 }}>
                                    Strengths
                                </Typography>
                                <List>
                                    {evaluationDetails.strengths && evaluationDetails.strengths.map((strength: string, index: number) => (
                                        <ListItem key={index}>
                                            <ListItemIcon>
                                                <CheckCircleIcon color="success" />
                                            </ListItemIcon>
                                            <ListItemText primary={strength} />
                                        </ListItem>
                                    ))}
                                </List>

                                <Typography variant="h6" color="warning.main" sx={{ mb: 1, mt: 3 }}>
                                    Areas for Improvement
                                </Typography>
                                <List>
                                    {evaluationDetails.improvements && evaluationDetails.improvements.map((improvement: string, index: number) => (
                                        <ListItem key={index}>
                                            <ListItemIcon>
                                                <ErrorIcon color="warning" />
                                            </ListItemIcon>
                                            <ListItemText primary={improvement} />
                                        </ListItem>
                                    ))}
                                </List>
                                
                                {/* Add design pattern implementation feedback if available */}
                                {evaluationDetails.design_pattern_implementation && (
                                    <>
                                        <Typography variant="h6" color="info.main" sx={{ mb: 1, mt: 3 }}>
                                            Design Pattern Implementation
                                        </Typography>
                                        <Typography variant="body1" sx={{ ml: 2 }}>
                                            {evaluationDetails.design_pattern_implementation}
                                        </Typography>
                                    </>
                                )}
                                
                                {/* Add code quality analysis if available */}
                                {evaluationDetails.code_quality_analysis && (
                                    <>
                                        <Typography variant="h6" color="info.main" sx={{ mb: 1, mt: 3 }}>
                                            Code Quality Analysis
                                        </Typography>
                                        <Typography variant="body1" sx={{ ml: 2 }}>
                                            {evaluationDetails.code_quality_analysis}
                                        </Typography>
                                    </>
                                )}
                                
                                {/* Add additional feedback if available */}
                                {evaluationDetails.additional_feedback && (
                                    <>
                                        <Typography variant="h6" color="info.main" sx={{ mb: 1, mt: 3 }}>
                                            Additional Feedback
                                        </Typography>
                                        <Typography variant="body1" sx={{ ml: 2 }}>
                                            {evaluationDetails.additional_feedback}
                                        </Typography>
                                    </>
                                )}
                            </Box>
                        )}
                    </Box>
                </Paper>
            </Modal>

            {/* LLM Solution Modal */}
            <Modal
                open={llmSolutionOpen}
                onClose={handleCloseLLMSolution}
                aria-labelledby="llm-solution-modal-title"
                aria-describedby="llm-solution-modal-description"
            >
                <Paper variant='elevation' square sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 700,
                    maxHeight: '80vh',
                    bgcolor: '#0F1729',
                    boxShadow: 24,
                    p: 4,
                    display: 'flex', 
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" id="llm-solution-modal-title">
                            LLM Optimal Solution
                        </Typography>
                        <IconButton onClick={handleCloseLLMSolution}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box 
                        sx={{ 
                            position: 'relative', 
                            mb: 3,
                            flexGrow: 1,
                            overflow: 'auto',
                        }}
                    >
                        {/* Copy Icon */}
                        <Tooltip title={llmCopied ? 'Copied!' : 'Copy'} arrow>
                            <IconButton
                                onClick={handleCopyLLMSolution}
                                sx={{
                                    position: 'sticky',
                                    top: 8,
                                    right: 8,
                                    float: 'right',
                                    zIndex: 10,
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    }
                                }}
                            >
                                <ContentCopyIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        {/* LLM Solution Code Block */}
                        <SyntaxHighlighter
                            language="java"
                            style={oneDark}
                            wrapLongLines
                            customStyle={{
                                padding: '1.5rem 1rem',
                                borderRadius: '8px',
                                fontSize: '0.95rem',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                overflow: 'visible',
                            }}
                            codeTagProps={{
                                style: {
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                }
                            }}
                        >
                            {loading ? 'Loading solution...' : llmSolution}
                        </SyntaxHighlighter>
                    </Box>
                </Paper>
            </Modal>
        </>
    );
};

export default SubmissionPage;