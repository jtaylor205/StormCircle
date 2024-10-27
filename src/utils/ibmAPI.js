// ibmAPI.js
export const callIBMTextGenerationAPI = async (features, homeCoordinates) => {
    const url = "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29";
    const headers = {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.REACT_APP_IBM_ACCESS_TOKEN}`
    };
  
    // Create a location-based prompt
    const locationsList = features.map((f) => `${f.properties.name} (${f.coordinates.join(', ')})`).join(', ');
    const prompt = `You are an expert in hurricane preparation. The user is located at coordinates ${homeCoordinates.join(
      ', '
    )} and has the following nearby locations available: ${locationsList}. Provide a list of recommended steps for hurricane preparation, prioritizing locations by proximity.`;
  
    const body = {
      input: prompt,
      parameters: {
        decoding_method: "greedy",
        max_new_tokens: 200,
        min_new_tokens: 0,
        stop_sequences: [],
        repetition_penalty: 1
      },
      model_id: "google/flan-ul2",
      project_id: "55363775-1ea6-4ef3-8235-a55a697c29df",
      moderations: {
        hap: {
          input: {
            enabled: true,
            threshold: 0.5,
            mask: { remove_entity_value: true }
          },
          output: {
            enabled: true,
            threshold: 0.5,
            mask: { remove_entity_value: true }
          }
        },
        pii: {
          input: {
            enabled: true,
            threshold: 0.5,
            mask: { remove_entity_value: true }
          },
          output: {
            enabled: true,
            threshold: 0.5,
            mask: { remove_entity_value: true }
          }
        }
      }
    };
  
    const response = await fetch(url, {
      headers,
      method: "POST",
      body: JSON.stringify(body)
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch data from IBM API");
    }
  
    return await response.json();
  };
  