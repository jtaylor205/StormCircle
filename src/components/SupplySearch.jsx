import React, { useEffect, useState } from 'react';

export default function SupplySearch({ features }) {
  const [steps, setSteps] = useState(null);
  const [featureSummary, setFeatureSummary] = useState('');
  const [loading, setLoading] = useState(false); // New state for loading

  const typeMapping = {
    food_and_drink_stores: 'Food and Drink Stores',
    medical: 'Medical Suppliers',
  };
  
  // Function to summarize features by type (but only include food and drink or medical)
  const summarizeFeatures = () => {
    const summary = features.reduce((acc, feature) => {
      const rawType = feature.properties.class;
      
      // Only include food_and_drink_stores or medical
      if (rawType === 'food_and_drink_stores' || rawType === 'medical') {
        const type = typeMapping[rawType]; // Use the mapped name
        acc[type] = (acc[type] || 0) + 1;
      }
  
      return acc;
    }, {});
  
    // Create JSX elements with bold counts for each feature type
    const summaryElements = Object.entries(summary).map(([type, count]) => (
      <span key={type}>
        <strong>{count}</strong> {type}
      </span>
    ));
    
    // Join the elements with 'and' between them
    const summarySentence = summaryElements.length > 0 
      ? <>Located {summaryElements.reduce((prev, curr, index) => [prev, index > 0 ? ' and ' : '', curr])} in your area.</>
      : 'No relevant facilities found in your area.';
    
    setFeatureSummary(summarySentence);
  };

  // Prompt to send to the API
  const promptText = `
  Given the following list of facilities nearby, generate a JSON array with up to 5 steps of recommended actions for hurricane preparation. No perishable foods. Make sure to include at least 1 medical supply statement, 1 food statement, and 1 gas statement. Each step should be in the format: 
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
    setLoading(true); // Set loading to true when fetching starts
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
    } finally {
      setLoading(false); // Set loading back to false when the request is finished
    }
  };
  
  

  useEffect(() => {
    summarizeFeatures();
  }, [features]);

  return (
    <div>
      <div>
        <h2 className='my-3 italic'>{featureSummary}</h2>
      </div>
      <div>
        <button 
          onClick={fetchSteps} 
          className="mt-4 align-center mb-3 hover:bg-green-700 hover:text-white text-green-700 font-semibold py-2 px-4 border border-green-700 rounded duration-100"
        >
          Generate Guide
        </button>
        <div className='my-3 bg-white rounded p-5'>
          <ul>
            {loading ? ( // Show "Loading..." if loading is true
              <li>Loading...</li>
            ) : steps && steps.length > 0 ? (
              steps.map((step) => (
                <li className='my-1.5' key={step.step}>
                  <b className='text-bold'>{step.step}</b>: {step.action}
                </li>
              ))
            ) : (
              <li>Create your guide to get started!</li> // Show original message if not loading
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
