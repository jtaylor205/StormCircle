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
            <div className="text-3xl font-bold mb-2 text-blue-700">Supply Search</div>
            <SupplySearch setActiveView={setActiveView} features={features} activeView={activeView}/>
            <button
              className="mt-4 align-center mb-3 hover:bg-blue-700 hover:text-white text-blue-700 font-semibold py-2 px-4 border border-blue-500 rounded duration-100"
              onClick={handleBackToMenu} // Use the back handler
            >
              Back
            </button>
          </div>
        );
      case "Shelter Marker":
        return (
          <div>
            <div className="text-3xl font-bold mb-2 text-blue-700">Shelter Marker</div>
            <SheltersSearch onCountyChange={onCountyChange} clearSelection={selectedCounties} // Reset when navigated
            />
            <button
              className="align-center mb-3 hover:bg-blue-700 hover:text-white text-blue-700 font-semibold py-2 px-4 border border-blue-500 rounded duration-100"
              onClick={handleBackToMenu} // Use the back handler
            >
              Back
            </button>
          </div>
        );
      default:
        return (
          <div>
            <div className="text-5xl font-bold mb-2 text-blue-700">Storm Circle</div>
            <div className="text-sm text-blue-700 italic mb-4">Your Hurricane Safety Hub!</div>
            <div className="w-full align-center">
              <NavigatorBtn text="Supply Search" onClick={() => setActiveView("Supply Search")} />
                <div className="mb-2">
                    Create an action plan with <b className='font-bold'>Supply Search</b>!
                    <div className="text-sm mt-1">
                    Leverage the power of IBM Watsonx to analyze nearby retail stores and medical providers. 
                    Based on your location, generate a personalized outline on what to do to ensure 
                    you're fully prepared for the hurricane.
                    </div> 
                </div>
              <NavigatorBtn text="Shelter Marker" onClick={() => setActiveView("Shelter Marker")} />
                <div className="mb-2">
                    Find Nearby Shelters with <b className='font-bold'>Shelter Marker</b>! 
                    <div className="text-sm mt-1">
                    Access real-time evacuation shelter data to easily locate safe havens in your county. 
                    Get instant navigation to the nearest shelter and ensure your safety during a hurricane.
                    </div>
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
