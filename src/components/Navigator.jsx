// Navigator.js
import { useState } from "react";
import NavigatorBtn from "./NavigatorBtn";
import SupplySearch from "./SupplySearch";

export default function Navigator({ radius, setRadius }) {
  const [activeView, setActiveView] = useState("menu");

  const renderContent = () => {
    switch (activeView) {
      case "Supply Search":
        return (
          <div>
            <SupplySearch radius={radius} setRadius={setRadius} setActiveView={setActiveView}/>
          </div>
        );
      case "Shelter Locations":
        return (
          <div>
            <div>Shelter Locations Screen</div>
            <button
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mt-4"
              onClick={() => setActiveView("menu")}
            >
              Back
            </button>
          </div>
        );
      case "Evacuation Zones":
        return (
          <div>
            <div>Evacuation Zones Screen</div>
            <button
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mt-4"
              onClick={() => setActiveView("menu")}
            >
              Back
            </button>
          </div>
        );
      default:
        return (
          <div>
            <div className="text-3xl font-bold mb-2">Storm Circle</div>
            <div>Please select an option from the navigation panel.</div>
            <div className="w-full align-center">
              <NavigatorBtn text="Supply Search" onClick={() => setActiveView("Supply Search")} />
              <NavigatorBtn text="Shelter Locations" onClick={() => setActiveView("Shelter Locations")} />
              <NavigatorBtn text="Evacuation Zones" onClick={() => setActiveView("Evacuation Zones")} />
              {/* Add RadiusAdjust here for adjusting the radius */}
              
            </div>
          </div>
        );
    }
  };

  return (
    <div className="Nav align-center">
      {renderContent()}
    </div>
  );
}
