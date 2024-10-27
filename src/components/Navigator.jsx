import { useState } from "react";
import NavigatorBtn from "./NavigatorBtn.jsx";
import SheltersSearch from "./SheltersSearch.jsx";
import SupplySearch from "./SupplySearch";

export default function Navigator({ onCountyChange, features}) {
  const [activeView, setActiveView] = useState("menu");
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
            <SupplySearch setActiveView={setActiveView} features={features}/>
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
                <div className="mb-2">
                    Create a Preparation Plan with <bold className='font-bold'>Supply Search</bold>! 
                    Leverage the power of IBM Watsonx to analyze nearby retail stores and medical providers. Based on your location, 
                    IBM's Watsonx will generate a personalized outline on what to purchase and where to go to ensure 
                    you're fully prepared for the hurricane.
                </div>
              <NavigatorBtn text="Shelter Locations" onClick={() => setActiveView("Shelter Marker")} />
                <div className="mb-2">
                    Find Nearby Shelters with <bold className='font-bold'>Shelter Marker</bold>! 
                    Access real-time evacuation shelter data to easily locate safe havens in your county. 
                    Get instant navigation to the nearest shelter and ensure your safety during a hurricane.
                </div>
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
