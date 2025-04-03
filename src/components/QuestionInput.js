import React, { useState } from 'react';
import { FiSend, FiLoader } from 'react-icons/fi';

const QuestionInput = ({ onAskQuestion, isLoading, disabled }) => {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim() && !isLoading) {
      onAskQuestion(question);
      setQuestion('');
    }
  };

  return (
    <div className="w-full" aria-label="Ask a question about the document">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about the document..."
          disabled={disabled || isLoading}
          className="w-full p-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          aria-label="Question input"
        />
        <button
          type="submit"
          disabled={disabled || isLoading || !question.trim()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          aria-label="Submit question"
        >
          {isLoading ? (
            <FiLoader className="w-5 h-5 animate-spin" />
          ) : (
            <FiSend className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
};

export default QuestionInput;