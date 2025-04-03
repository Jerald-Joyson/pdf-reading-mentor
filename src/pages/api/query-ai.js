// File: src/pages/api/query-ai.js
import axios from 'axios';

const apiKey = process.env.HUGGING_FACE_API_KEY;

const query = async (question, context) => {
  const response = await axios.post('https://api-inference.huggingface.co/models/deepset/bert-base-cased-squad2', {
    inputs: {
      question: question,
      context: context
    },
    options: {
      wait_for_model: true,
      use_cache: true
    }
  }, {
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  });

  return response.data; // Should return { score, start, end, answer }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { conversation, context } = req.body;

    if (!conversation || !context) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const question = conversation[conversation.length - 1]?.content;
    const answer = await query(question, context);

    return res.status(200).json({ answer }); // Ensure this matches the expected structure
  } catch (error) {
    console.error('API handler error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}