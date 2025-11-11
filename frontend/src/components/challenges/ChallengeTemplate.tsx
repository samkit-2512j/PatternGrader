import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { styled } from '@mui/system';
import MonacoEditor from '@monaco-editor/react';
import axios from 'axios';

const EditorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  backgroundColor: '#ffffff',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

interface Question {
  question_id: number;
  design_pattern: string;
  context: string;
  code: string;
}

const ChallengeTemplate: React.FC = () => {
  const { challenge } = useParams<{ challenge: string }>();
  const [code, setCode] = useState('// Write your Java code here\n');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [question, setQuestion] = useState<Question | null>(null);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const navigate = useNavigate();

  // Fetch user details from the backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setFetchingUser(true);
        const response = await axios.get('/dashboard', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUserId(response.data.user.id);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch user details');
      } finally {
        setFetchingUser(false);
      }
    };

    fetchUser();
  }, []);

  // Fetch question based on challenge topic
  useEffect(() => {
    const fetchQuestion = async () => {
      if (!challenge) return;
      
      try {
        setLoadingQuestion(true);
        const response = await axios.get(`/api/question/${challenge}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            id: userId || '',
          },
        });
        
        const fetchedQuestion = response.data.question;
        setQuestion(fetchedQuestion);
        setCode(fetchedQuestion.code || '// Write your code here\n');
      } catch (err: any) {
        console.error('Error fetching question:', err);
        setError(err.response?.data?.error || 'Failed to fetch question details');
      } finally {
        setLoadingQuestion(false);
      }
    };

    if (userId) {
      fetchQuestion();
    }
  }, [challenge, userId]);

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || '');
  };

  const handleSubmit = async () => {
    if (!userId || !question) {
      console.error('User ID or question not available');
      setError('User ID or question not available. Please try again.');
      return;
    }

    try {
      setLoading(true);
      console.log("Submitting with data:", {
        user_id: userId,
        question_id: question.question_id.toString(),
        username: localStorage.getItem('username') || 'anonymous',
        llm_response: code.substring(0, 1000000)  // Limit code size to prevent issues
      });
      
      const response = await axios.post('/api/submission/create', {
        user_id: userId,
        question_id: question.question_id.toString(),
        username: localStorage.getItem('username') || 'anonymous',
        llm_response: code.substring(0, 1000000)  // Limit code size to prevent issues
      });
      
      console.log('Submission successful:', response.data);
      
      // Make sure we get the rating info from the response
      const ratingChange = response.data.rating_change || 0;
      const oldRating = response.data.old_rating || 0;
      const newRating = response.data.new_rating || 0;
      
      // Log rating changes for debugging
      console.log(`Rating change: ${oldRating} -> ${newRating} (${ratingChange > 0 ? '+' : ''}${ratingChange})`);
      
      // Navigate directly to the submission page with the submission ID in the URL
      // Also pass rating information as state
      navigate(`/submission/${response.data.submission_id}`, {
        state: {
          ratingChange: ratingChange,
          oldRating: oldRating,
          newRating: newRating
        }
      });
    } catch (error: any) {
      console.error('Error submitting code:', error);
      const errorMessage = error.response?.data?.error || 'Failed to submit code. Please try again.';
      setError(`Submission error: ${errorMessage}`);
      
      // Display the error to the user
      setTimeout(() => setError(null), 10000); // Clear error after 10 seconds to give user time to read it
    } finally {
      setLoading(false);
    }
  };

  if (fetchingUser || loadingQuestion) {
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
        {challenge?.replace(/-/g, ' ').toUpperCase() || 'Challenge'}
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, mt: 4 }}>
        {/* Question Section */}
        <Paper elevation={3} sx={{ flex: 1, p: 3, maxHeight: '70vh', overflow: 'auto' }}>
          <Typography variant="h6" gutterBottom>
            Problem Statement
          </Typography>
          {question ? (
            <>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold' }}>
                Question ID: {question.question_id}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {question.context}
              </Typography>
            </>
          ) : (
            <Typography variant="body1" color="text.secondary">
              No question available for this challenge.
            </Typography>
          )}
        </Paper>

        {/* Code Editor Section */}
        <EditorContainer sx={{ flex: 2, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Code Editor
          </Typography>
          <MonacoEditor
            height="400px"
            defaultLanguage="java"
            value={code}
            onChange={handleEditorChange}
            options={{
              theme: 'vs-light',
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
            }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleSubmit}
            disabled={loading || !question}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </EditorContainer>
      </Box>
    </Container>
  );
};

export default ChallengeTemplate;