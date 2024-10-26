// ibmApi.js
export const callIBMTextGenerationAPI = async (inputText) => {
    const response = await fetch('https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_IBM_ACCESS_TOKEN}` // Access token from env variable
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
        project_id: '55363775-1ea6-4ef3-8235-a55a697c29df',
        moderations: {
          hap: {
            input: {
              enabled: true,
              threshold: 0.5,
              mask: {
                remove_entity_value: true
              }
            },
            output: {
              enabled: true,
              threshold: 0.5,
              mask: {
                remove_entity_value: true
              }
            }
          },
          pii: {
            input: {
              enabled: true,
              threshold: 0.5,
              mask: {
                remove_entity_value: true
              }
            },
            output: {
              enabled: true,
              threshold: 0.5,
              mask: {
                remove_entity_value: true
              }
            }
          }
        }
      })
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch data from IBM API');
    }
  
    const data = await response.json();
    return data;
  };
  