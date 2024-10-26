// MapComponent.js
import React, { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
<<<<<<< HEAD
=======
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

export default function Map() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = [position.coords.longitude, position.coords.latitude];
          
          mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            center: userLocation,
            zoom: 9,
            style: "mapbox://styles/j-taylor/cm2pi61u300ef01ph12le6si4",
          });
        },
        (error) => {
          console.error("Error fetching location:", error);
          mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            center: [-74.5, 40],
            zoom: 9,
            style: "mapbox://styles/mapbox/navigation-night-v1",
          });
        }
      );
    } else {
      console.error("Geolocation not supported by this browser.");
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        center: [-74.5, 40],
        zoom: 9,
        style: "mapbox://styles/mapbox/navigation-night-v1",
      });
    }

    return () => mapRef.current && mapRef.current.remove();
  }, []);

  return <div ref={mapContainerRef} style={{ width: "100%", height: "100vh" }} />;
}
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
>>>>>>> adcbc8b (push)
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

export default function Map() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
<<<<<<< HEAD
=======
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

>>>>>>> ffbef86 (removed radius)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = [position.coords.longitude, position.coords.latitude];
          
          mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            center: userLocation,
            zoom: 9,
            style: "mapbox://styles/j-taylor/cm2pi61u300ef01ph12le6si4",
          });
        },
        (error) => {
          console.error("Error fetching location:", error);
          mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            center: [-74.5, 40],
            zoom: 9,
            style: "mapbox://styles/mapbox/navigation-night-v1",
          });
        }
      );
    } else {
      console.error("Geolocation not supported by this browser.");
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        center: [-74.5, 40],
        zoom: 9,
        style: "mapbox://styles/mapbox/navigation-night-v1",
      });
    }

    return () => mapRef.current && mapRef.current.remove();
  }, []);

<<<<<<< HEAD
  return <div ref={mapContainerRef} style={{ width: "100%", height: "100vh" }} />;
=======
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
>>>>>>> ffbef86 (removed radius)
}
