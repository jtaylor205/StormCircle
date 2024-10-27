// App.js
import React, { useState } from "react";
import Map from "./components/Map.jsx";
import Navigator from "./components/Navigator.jsx";

export default function App() {
  const [selectedCounties, setSelectedCounties] = useState([]);
  const [features, setFeatures] = useState([]);

  // Function to update selected counties
  const handleCountyChange = (counties) => {
    setSelectedCounties(counties);
  };

  return (
    <div>
      <Navigator onCountyChange={handleCountyChange} features={features} />
      <Map selectedCounties={selectedCounties} setFeatures={setFeatures} features={features} />
    </div>
  );
}
