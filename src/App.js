// App.js
import React, { useState } from "react";
import Navigator from "./components/Navigator";
import Map from "./components/Map";

export default function App() {
  const [radius, setRadius] = useState(100); // Shared radius state

  return (
    <div className="app-container">
      <Navigator radius={radius} setRadius={setRadius} />
      <Map radius={radius} setRadius={setRadius} />
    </div>
  );
}
