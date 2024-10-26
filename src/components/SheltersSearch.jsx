import React, { useState, useEffect } from "react";
import sheltersData from './shelters.json'; // Adjust path to your JSON file

export default function SheltersSearch({ onCountyChange, clearSelection }) {
  const [selectedCounties, setSelectedCounties] = useState([]);

  // Handle checkbox changes
  const handleCountyChange = (e) => {
    const county = e.target.value;
    const updatedCounties = e.target.checked
      ? [...selectedCounties, county] // Add county
      : selectedCounties.filter((c) => c !== county); // Remove county

    setSelectedCounties(updatedCounties);
    onCountyChange(updatedCounties); // Notify the parent (App component)
  };

  // Clear selected counties when the clearSelection prop is reset
  useEffect(() => {
    if (clearSelection.length === 0) {
      setSelectedCounties([]); // Reset selection state
    }
  }, [clearSelection]);

  // Get available counties from the shelter data
  const availableCounties = Object.keys(sheltersData.Tampa_Bay_Area_Shelters);

  return (
    <div className="county-selector">
      <h3 className="mb-2">Select counties to view shelters</h3>
      {availableCounties.map((county) => {
        const displayCounty = county.replace(/_/g, ' '); // Display county without underscores
        return (
          <div key={county} className="flex items-center mb-4">
            <input
              type="checkbox"
              value={county} // Keep the original value with underscores
              onChange={handleCountyChange}
              className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            /> 
            <label>{displayCounty}</label> {/* Display county without underscores */}
          </div>
        );
      })}
    </div>
  );
}
