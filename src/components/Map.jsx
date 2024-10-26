import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { FaLocationArrow } from "react-icons/fa";
import sheltersData from './shelters.json';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
const TILEQUERY_URL = "https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/tilequery";
const GEOCODING_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places";
const RADIUS_METERS = 100000; // 3 miles in meters

// Geocoding API function using fetch
const geocodeAddress = async (address) => {
  const accessToken = mapboxgl.accessToken;
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      address
    )}.json?access_token=${accessToken}`
  );
  const data = await response.json();
  if (data.features && data.features.length > 0) {
    return data.features[0].geometry.coordinates;
  }
  return null;
};

export default function Map({ selectedCounties }) {
  const [shelterMarkers, setShelterMarkers] = useState([]); // Store shelter markers
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [features, setFeatures] = useState([]); // State to store filtered POIs with geocoded names
  const [poiMarkers, setPoiMarkers] = useState([]); // State to store POI markers

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initializeMap = (location) => {
      const initialLocation = location || [-82.4572, 27.9506]; // Tampa, FL

      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        center: initialLocation,
        zoom: 12,
        pitch: 45,
        bearing: 0,
        style: "mapbox://styles/j-taylor/cm2pi61u300ef01ph12le6si4",
      });

      mapRef.current.on("load", () => {
        mapRef.current.easeTo({
          zoom: 14,
          pitch: 52,
          bearing: 15,
          duration: 2000,
          easing: (t) => t,
        });

        const userMarker = document.createElement("div");
        userMarker.style.cssText = `
          height: 12px;
          width: 12px;
          border: 1.5px solid #fafafa;
          border-radius: 50%;
          background-color: #38bdf8;
          box-shadow: 0px 0px 4px 2px rgba(14,165,233,1);
        `;
        markerRef.current = new mapboxgl.Marker(userMarker)
          .setLngLat(initialLocation)
          .addTo(mapRef.current);

        queryFeaturesWithinRadius(initialLocation, RADIUS_METERS);
        addShelterMarkers(selectedCounties);
      });
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = [position.coords.longitude, position.coords.latitude];
          setUserLocation(location);
          initializeMap(location);
        },
        (error) => {
          console.error("Error fetching location:", error);
          initializeMap();
        }
      );
    } else {
      initializeMap();
    }
  }, [mapContainerRef.current]);
  
    // Function to add shelter markers to the map
  const addShelterMarkers = async (counties) => {
    if (!mapRef.current) return; // Make sure the map is initialized

    // Remove existing markers from the map
    shelterMarkers.forEach((marker) => marker.remove());
    const newMarkers = [];

    // Loop through selected counties and add shelter markers
    for (const county of counties) {
      const countyData = sheltersData.Tampa_Bay_Area_Shelters[county];
      for (const shelterType of Object.keys(countyData)) {
        const shelters = countyData[shelterType];
        shelters.forEach(async (shelter) => {
          const { Name, Address } = shelter;

          // Fetch geocoded coordinates for the shelter's address
          const coords = await geocodeAddress(Address);

          if (coords) {
            // Create a popup with the shelter's name and a navigation link
            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <strong>${Name}</strong><br />
              <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${coords[1]},${coords[0]}', '_blank')">Navigate</button>
            `);

            // Add a marker for the shelter at the geocoded coordinates
            const marker = new mapboxgl.Marker()
              .setLngLat(coords)
              .setPopup(popup)
              .addTo(mapRef.current);

            newMarkers.push(marker);
          } else {
            console.error(`Failed to geocode address for ${Name}`);
          }
        });
      }
    }

    setShelterMarkers(newMarkers); // Store the new markers
  };

  // Function to query POIs within the radius and filter for essential services
  const queryFeaturesWithinRadius = async (center, radius, requiredCount = 50) => {
    const [lng, lat] = center;
    let allFeatures = new Set();
    const maxIterations = 20; // Define a max number of iterations to avoid infinite loops

    // Define a set of offsets to query around the center
    const offsets = [
      [0, 0], // Center
      [0.001, 0], [0, 0.001], [-0.001, 0], [0, -0.001], // Small offsets in each direction
      [0.002, 0.002], [-0.002, 0.002], [0.002, -0.002], [-0.002, -0.002], // Slightly larger offsets
      // Add more offsets as needed
    ];

    // Helper function to check if we have reached the desired number of unique features
    const hasEnoughFeatures = () => allFeatures.size >= requiredCount;

    try {
      let iteration = 0;

      while (!hasEnoughFeatures() && iteration < maxIterations) {
        for (const [offsetLng, offsetLat] of offsets) {
          if (hasEnoughFeatures()) break;

          const queryLng = lng + offsetLng * iteration;
          const queryLat = lat + offsetLat * iteration;
          const url = `${TILEQUERY_URL}/${queryLng},${queryLat}.json?radius=${radius}&limit=50&layers=poi_label&access_token=${mapboxgl.accessToken}`;
          
          const response = await fetch(url);
          const data = await response.json();

          // Filter essential POIs based on keywords
          const essentialPOIs = data.features.filter((feature) => {
            const { category, name, class: featureClass, type } = feature.properties;
            const keywords = ["grocery", "supermarket", "hospital", "pharmacy", "gas station", "publix", "food_and_drink_stores", "hardware", "medical"];
            return keywords.some((keyword) =>
              [category, name, featureClass, type].some((property) => property && property.toLowerCase().includes(keyword))
            );
          });

          // Retrieve names for POIs and filter out address-like names
          const featuresWithNames = await Promise.all(
            essentialPOIs.map(async (feature) => {
              const { geometry, properties } = feature;
              const coordinates = geometry?.coordinates;
              let name = properties.name || (coordinates && (await reverseGeocode(coordinates))) || "Unnamed POI";
              
              const addressPattern = /\b\d+.*\b(Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Way|Place|Pl)\b/i;
              if (addressPattern.test(name)) {
                name = "Unnamed POI";
              }

              return {
                ...feature,
                properties: {
                  ...properties,
                  name,
                },
                coordinates,
              };
            })
          );

          // Add only unique features
          featuresWithNames.forEach((feature) => {
            if (feature.properties.name !== "Unnamed POI" && !Array.from(allFeatures).some((f) => f.properties.name === feature.properties.name)) {
              allFeatures.add(feature);
            }
          });
        }
        
        iteration += 1;
      }

      const finalFeatures = Array.from(allFeatures).slice(0, requiredCount);
      setFeatures(finalFeatures); // Update features state
      addMarkersToMap(finalFeatures); // Add markers for each POI
      console.log("Final essential POIs:", finalFeatures);
    } catch (error) {
      console.error("Error fetching features:", error);
    }
  };

  // Function to add markers for each POI
// Function to add markers for each POI with popups
// Function to add markers for each POI with popups
const addMarkersToMap = (pois) => {
  // Clear previous markers
  poiMarkers.forEach((marker) => marker.remove());

  // Add new markers with popups
  const newMarkers = pois.map((poi) => {
    if (poi.coordinates) {
      const displayType = poi.properties.class.replace(/_/g, ' ');
      // Create a popup with the POI's name
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <strong>${poi.properties.name}</strong><br />
          <em>Type:</em> ${displayType || "Unknown"}
        `);

      // Create the marker and attach the popup
      const marker = new mapboxgl.Marker({ color: "red" })
        .setLngLat(poi.coordinates)
        .setPopup(popup) // Attach the popup to the marker
        .addTo(mapRef.current);

      marker.getElement().addEventListener('click', () => {
        console.log(`Marker clicked: ${poi.properties.name}`);
      });

      return marker;
    }
    return null;
  }).filter(Boolean); // Remove null values from the array

  setPoiMarkers(newMarkers);
};



  // Reverse Geocode function
  const reverseGeocode = async (coordinates) => {
    const url = `${GEOCODING_URL}/${coordinates[0]},${coordinates[1]}.json?access_token=${mapboxgl.accessToken}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.features[0]?.place_name || "Unnamed";
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
      return "Unnamed";
    }
  };

  // Update shelter markers when selected counties change
  useEffect(() => {
    addShelterMarkers(selectedCounties);
  }, [selectedCounties]);

  return (
    <div>
      <div ref={mapContainerRef} className="w-full h-[100vh] rounded-lg border-4 border-blue-500 overflow-hidden" />
      <button
        onClick={() => {
          if (userLocation) {
            mapRef.current.flyTo({ center: userLocation, zoom: 16.25, speed: 1.2 });
          }
        }}
        className="Reset absolute top-5 right-5 z-10 p-2 bg-white rounded-full shadow-md"
      >
        <FaLocationArrow />
      </button>
    </div>
  );
}
