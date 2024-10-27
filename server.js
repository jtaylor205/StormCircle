require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); // Import `fetch` dynamically for Node.js

const app = express();
const PORT = 2020;

app.use(cors());
app.use(express.json());

app.post('/api/generate-text', async (req, res) => {
  const { inputText } = req.body;

  try {
    const response = await fetch('https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_IBM_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        input: inputText,
        parameters: {
          decoding_method: 'greedy',
          max_new_tokens: 200,
          min_new_tokens: 0,
          stop_sequences: [],
          repetition_penalty: 1,
        },
        model_id: 'ibm/granite-13b-chat-v2',
        project_id: '55363775-1ea6-4ef3-8235-a55a697c29df',
        moderations: {
          hap: { input: { enabled: true, threshold: 0.5, mask: { remove_entity_value: true } }, output: { enabled: true, threshold: 0.5, mask: { remove_entity_value: true } } },
          pii: { input: { enabled: true, threshold: 0.5, mask: { remove_entity_value: true } }, output: { enabled: true, threshold: 0.5, mask: { remove_entity_value: true } } },
        },
      }),
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch data from IBM API' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error calling IBM API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.post('/api/generate-text', async (req, res) => {
    const inputText = req.body.inputText;
    const response = await fetch('https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_IBM_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        input: inputText,
        parameters: {
          decoding_method: 'greedy',
          max_new_tokens: 200,
          min_new_tokens: 0,
          stop_sequences: [],
          repetition_penalty: 1
        },
        model_id: 'ibm/granite-13b-chat-v2',
      })
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch data from IBM API' });
    }

    const data = await response.json();
    res.json(data);
});
