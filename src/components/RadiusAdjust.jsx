// RadiusAdjust.js
import * as React from "react";

export default function RadiusAdjust({ radius, setRadius }) {
  const handleSliderChange = (event) => {
    setRadius(Number(event.target.value));
  };

  return (
    <div className="radius-adjust-container">
      <label htmlFor="radiusSlider" className="text-sm font-medium">
        Adjust Radius:
      </label>
      <input
        id="radiusSlider"
        type="range"
        min="100"
        max="300"
        value={radius}
        onChange={handleSliderChange}
        className="w-full mt-2"
      />
    </div>
  );
}
