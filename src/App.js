// App.js
import React, { useState } from "react";
import Map from "./components/Map.jsx";
import Navigator from "./components/Navigator.jsx";
import Checklist from "./components/Checklist.jsx";

export default function App() {
  const [selectedCounties, setSelectedCounties] = useState([]);

  // Function to update selected counties
  const handleCountyChange = (counties) => {
    setSelectedCounties(counties);
  };

  // List of items for the checklist
  const checklistItems = ["Water", "Food", "Flashlight", "Batteries", "First Aid Kit"];

  return (
    <div>
      <Navigator onCountyChange={handleCountyChange} />
      <Checklist items={checklistItems} />
      <Map selectedCounties={selectedCounties} />
    </div>
  );
}

