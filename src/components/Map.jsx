import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { FaLocationArrow } from "react-icons/fa";

import sheltersData from './shelters.json'; // Adjust path to your JSON file

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
const TILEQUERY_URL = "https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/tilequery";
const GEOCODING_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places";
const RADIUS_METERS = 100000; // 3 miles in meters

export default function Map() {
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

        if (!mapRef.current.getSource("marker-source")) {
          mapRef.current.addSource("marker-source", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: initialLocation,
                  },
                },
              ],
            },
          });
        }

        if (!mapRef.current.getLayer("pulsing-ring")) {
          mapRef.current.addLayer({
            id: "pulsing-ring",
            type: "circle",
            source: "marker-source",
            paint: {
              "circle-radius": RADIUS_METERS,
              "circle-color": "blue",
              "circle-opacity": 0.3,
              "circle-stroke-width": 1,
              "circle-stroke-color": "blue",
              "circle-pitch-alignment": "map",
            },
          });
        }

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
  const addMarkersToMap = (pois) => {
    // Clear previous markers
    poiMarkers.forEach((marker) => marker.remove());
    
    // Add new markers
    const newMarkers = pois.map((poi) => {
      if (poi.coordinates) {
        const marker = new mapboxgl.Marker({ color: "red" })
          .setLngLat(poi.coordinates)
          .addTo(mapRef.current);

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
      {features.length > 0 && (
        <div className="absolute bottom-10 left-10 p-4 bg-white rounded shadow-md max-w-xs max-h-64 overflow-y-auto">
          <h3 className="font-bold">Essential POIs Within 3 Miles:</h3>
          <ul>
            {features.map((feature, index) => (
              <li key={index}>
                <strong>Name:</strong> {feature.properties.name} <br />
                <strong>Type:</strong> {feature.properties.class || "Unknown"} <br />
                <strong>Coordinates:</strong> {feature.coordinates ? feature.coordinates.join(", ") : "N/A"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
