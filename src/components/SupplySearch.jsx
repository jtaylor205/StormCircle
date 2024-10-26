import * as React from "react";
import RadiusAdjust from "./RadiusAdjust";
export default function SupplySearch({ radius, setRadius, setActiveView}) {
  return (
    <>
    <button
        className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
        onClick={() => setActiveView("menu")} // Attach the onClick event
      >
        Back
      </button>
      <RadiusAdjust radius={radius} setRadius={setRadius} />
    </>
  );
}
