// App.js
import React, { useState } from "react";
import Map from "./components/Map.jsx";
import Navigator from "./components/Navigator.jsx";

export default function App() {
  const [selectedCounties, setSelectedCounties] = useState([]);
  const [features, setFeatures] = useState([]);
  const [activeView, setActiveView] = useState("menu");
  // Function to update selected counties
  const handleCountyChange = (counties) => {
    setSelectedCounties(counties);
  };

  return (
    <div>
      <Navigator onCountyChange={handleCountyChange} features={features} activeView={activeView} setActiveView={setActiveView}/>
      <Map selectedCounties={selectedCounties} setFeatures={setFeatures} features={features} activeView={activeView} />
    </div>
  );
}
