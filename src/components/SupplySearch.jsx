import React, { useEffect, useState } from 'react';

export default function SupplySearch({ features }) {
  const [steps, setSteps] = useState(null);
  const [featureSummary, setFeatureSummary] = useState([]);
  const homeCoordinates = [-82.4572, 27.9506]; // Replace with actual user coordinates if available

  // Function to summarize features by type
  const summarizeFeatures = () => {
    const summary = features.reduce((acc, feature) => {
      const type = feature.properties.class || 'Unknown Type';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const summaryArray = Object.entries(summary).map(([type, count]) => ({
      type,
      count,
    }));

    setFeatureSummary(summaryArray);
  };

  // Prompt to send to the API
  const promptText = `
  Given the following list of facilities nearby, generate a JSON array with up to 5 steps of recommended actions for hurricane preparation. Each step should be in the format: 
  { "step": <number>, "action": "<action description>" }
  
  Only use facilities from the list provided, and do not add any additional facilities. If there are specific items to get from these facilities, mention them explicitly. Keep the response in pure JSON format without any additional text or explanations. 
  
  Facilities available:
  ${features.map((feature) => feature.properties.name).join(", ")}
  
  Example format:
  [
    { "step": 1, "action": "Go to Walmart to buy bottled water and canned food." },
    { "step": 2, "action": "Fill your gas tank at the nearby gas station." }
  ]
  `;
  

  const fetchSteps = async () => {
    try {
      const response = await fetch('http://localhost:2020/api/generate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputText: promptText }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch steps');
      }
  
      const data = await response.json();
      let generatedText = data?.results?.[0]?.generated_text?.trim();
      console.log('Generated Text:', generatedText); // Debugging
  
      // Extract JSON part only (between the first '[' and the last ']')
      const jsonStartIndex = generatedText.indexOf('[');
      const jsonEndIndex = generatedText.lastIndexOf(']');
      if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
        generatedText = generatedText.slice(jsonStartIndex, jsonEndIndex + 1);
      }
  
      // Try parsing the JSON
      const parsedSteps = JSON.parse(generatedText);
      setSteps(Array.isArray(parsedSteps) ? parsedSteps : []);
    } catch (error) {
      console.error('Error fetching steps:', error);
      setSteps([{ step: 'Error', action: 'Failed to fetch or parse steps from API.' }]);
    }
  };
  
  

  useEffect(() => {
    summarizeFeatures();
    fetchSteps();
  }, [features]);

  return (
    <div>
      <h1>Recommended Steps</h1>
      <div>
        <h2>Feature Summary</h2>
        <ul>
          {featureSummary.map(({ type, count }) => (
            <li key={type}>
              {count} {type}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Steps</h2>
        <ul>
          {Array.isArray(steps) && steps.length > 0 ? (
            steps.map((step) => (
              <li key={step.step}>
                {step.step}: {step.action}
              </li>
            ))
          ) : (
            <li>No steps available</li>
          )}
        </ul>
      </div>
    </div>
  );
}
