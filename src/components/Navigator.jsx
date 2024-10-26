import { useState } from "react";
import NavigatorBtn from "./NavigatorBtn.jsx";

export default function Navigator() {
  // State to keep track of the active view
  const [activeView, setActiveView] = useState("menu");

  // Function to render the content based on the active view
  const renderContent = () => {
    switch (activeView) {
      case "Supply Search":
        return (
          <div>
            <div>Supply Search Screen</div>
            <button
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mt-4"
              onClick={() => setActiveView("menu")}
            >
              Back
            </button>
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
            <div className="">Please select an option from the navigation panel.</div>
            <div className="w-full align-center">
              <NavigatorBtn text="Supply Search" onClick={() => setActiveView("Supply Search")} />
              <NavigatorBtn text="Shelter Locations" onClick={() => setActiveView("Shelter Locations")} />
              <NavigatorBtn text="Evacuation Zones" onClick={() => setActiveView("Evacuation Zones")} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="Nav align-center">
      {renderContent()} {/* Render the active content or navigation menu */}
    </div>
  );
}
