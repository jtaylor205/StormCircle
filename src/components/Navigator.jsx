import { useState } from "react";
import NavigatorBtn from "./NavigatorBtn.jsx";
import SheltersSearch from "./SheltersSearch.jsx";
import SupplySearch from "./SupplySearch";

export default function Navigator({ onCountyChange, features, activeView, setActiveView}) {
  const [selectedCounties, setSelectedCounties] = useState([]); // Keep track of selected counties

  // Clear selected counties and go back to menu
  const handleBackToMenu = () => {
    setSelectedCounties([]); // Clear selected counties
    onCountyChange([]); // Notify the parent (App.js) about the cleared counties
    setActiveView("menu"); // Go back to the menu
  };

  const renderContent = () => {
    switch (activeView) {
      case "Supply Search":
        return (
          <div>
            <div className="text-3xl font-bold mb-2">Supply Search Screen</div>
            <SupplySearch setActiveView={setActiveView} features={features} activeView={activeView}/>
            <button
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mt-4"
              onClick={handleBackToMenu} // Use the back handler
            >
              Back
            </button>
          </div>
        );
      case "Shelter Locations":
        return (
          <div>
            <div className="text-3xl font-bold mb-2">Shelter Locations</div>
            <SheltersSearch
              onCountyChange={onCountyChange}
              clearSelection={selectedCounties} // Reset when navigated
            />
            <button
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mt-4"
              onClick={handleBackToMenu} // Use the back handler
            >
              Back
            </button>
          </div>
        );
      default:
        return (
          <div>
            <div className="text-3xl font-bold mb-2">Storm Circle</div>
            <div className="w-full align-center">
              <NavigatorBtn text="Supply Search" onClick={() => setActiveView("Supply Search")} />
              <NavigatorBtn text="Shelter Locations" onClick={() => setActiveView("Shelter Locations")} />
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
