import React, { useState } from 'react';
import axios from 'axios'; // Optional but simplifies requests

const HurricanePrep = () => {
  const [response, setResponse] = useState(null);

  const generateRecommendations = async () => {
    const data = {
      input: `You are a hurricane expert...`, // Your input text here
      parameters: {
        decoding_method: "sample",
        max_new_tokens: 200,
        min_new_tokens: 0,
        random_seed: null,
        stop_sequences: [],
        temperature: 0.89,
        top_k: 50,
        top_p: 1,
        repetition_penalty: 1
      },
      model_id: "google/flan-t5-xxl",
      project_id: "55363775-1ea6-4ef3-8235-a55a697c29df",
      moderations: {
        hap: {
          input: { enabled: true, threshold: 0.5, mask: { remove_entity_value: true }},
          output: { enabled: true, threshold: 0.5, mask: { remove_entity_value: true }}
        },
        pii: {
          input: { enabled: true, threshold: 0.5, mask: { remove_entity_value: true }},
          output: { enabled: true, threshold: 0.5, mask: { remove_entity_value: true }}
        }
      }
    };

    try {
      const result = await axios.post(process.env.REACT_APP_WATSONX_URL, data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_WATSONX_API_KEY}`
        }
      });

      setResponse(result.data);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    }
  };

  return (
    <div>
      <button onClick={generateRecommendations}>Get Hurricane Prep Recommendations</button>
      {response && (
        <div>
          <h3>Recommended Places:</h3>
          <p>{response.recommended}</p>
          <h3>Items List:</h3>
          <p>{response.items}</p>
        </div>
      )}
    </div>
  );
};

export default HurricanePrep;
