// File: src/components/AIResponseArea.js
import React from 'react';

const AIResponseArea = ({ conversation, isLoading }) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!conversation || conversation.length === 0) {
    return <div>No conversation</div>;
  }

  const lastMessage = conversation[conversation.length - 1];
  const answer = lastMessage?.answer; // This is now a string
  const metadata = lastMessage?.metadata || {}; // Extract metadata if it exists

  if (!answer) {
    return <div>No answer</div>;
  }

  return (
    <div>
      <h2>Answer:</h2>
      <p>{answer}</p>
      {metadata.score !== undefined && <p>Score: {metadata.score}</p>}
      {metadata.start !== undefined && <p>Start: {metadata.start}</p>}
      {metadata.end !== undefined && <p>End: {metadata.end}</p>}
    </div>
  );
};

export default AIResponseArea;