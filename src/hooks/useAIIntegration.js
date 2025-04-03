// File: src/hooks/useAIIntegration.js
import { useState, useCallback } from 'react';
import axios from 'axios';

const useAIIntegration = (pdfText) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [answer, setAnswer] = useState('');
  const [conversation, setConversation] = useState([]);

  const prepareContext = useCallback(() => {
    if (!pdfText || pdfText.length === 0) {
      return 'No document content available.';
    }
    return pdfText.map(page => {
      const pageContent = Array.isArray(page.content) 
        ? page.content.map(item => item.text || '').join(' ')
        : (typeof page.content === 'string' ? page.content : 'Empty page');
      return `[Page ${page.pageNumber}] ${pageContent}`;
    }).join('\n\n').slice(0, 10000);
  }, [pdfText]);

  const askQuestion = useCallback(async (question) => {
    if (!question.trim()) {
      setError('Please provide a question');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let context = "No document content available.";
      try {
        context = prepareContext();
      } catch (err) {
        console.error('Error preparing context:', err);
      }

      const newConversation = [
        ...conversation,
        { role: 'user', content: question }
      ];
      
      setConversation(newConversation);

      console.log('Sending request to API with:', {
        conversation: newConversation,
        contextLength: context.length
      });

      const response = await axios.post('/api/query-ai', {
        conversation: newConversation,
        context: context,
      });

      console.log('API Response:', response.data);

      const aiResponse = response.data?.answer || { answer: "Sorry, I couldn't process your question." };
      
      // Enhance the answer with surrounding context
      let enhancedAnswer = aiResponse.answer;
      if (aiResponse.start !== undefined && aiResponse.end !== undefined) {
        const start = Math.max(0, aiResponse.start - 50); // 50 characters before
        const end = Math.min(context.length, aiResponse.end + 50); // 50 characters after
        enhancedAnswer = context.slice(start, end).trim();
      }

      setAnswer(enhancedAnswer);
      setConversation(prev => [
        ...prev,
        { 
          role: 'assistant', 
          answer: enhancedAnswer,
          metadata: { 
            score: aiResponse.score,
            start: aiResponse.start,
            end: aiResponse.end
          }
        }
      ]);
    } catch (err) {
      console.error('Error querying AI:', err);
      if (err.response) {
        setError(`Error ${err.response.status}: ${err.response.data.error || 'Unknown error'}`);
      } else if (err.request) {
        setError('No response received from server. Please try again.');
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [pdfText, conversation, prepareContext]);

  const clearConversation = useCallback(() => {
    setConversation([]);
    setAnswer('');
    setError(null);
  }, []);

  return {
    askQuestion,
    clearConversation,
    answer,
    conversation,
    isLoading,
    error
  };
};

export default useAIIntegration;