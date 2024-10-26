import React, { useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import { FaLocationArrow } from "react-icons/fa";

import sheltersData from './shelters.json'; // Adjust path to your JSON file

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

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
  const markerRef = useRef(null); // Ref to store the actual user marker (pin)

  // Initialize the map and center it at a specific location
  const initializeMap = (center) => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: center,
      zoom: 5,
      pitch: 45,
      bearing: 0,
      style: "mapbox://styles/j-taylor/cm2pi61u300ef01ph12le6si4",
    });

    // Fly the map to a specific zoom level and pitch
    mapRef.current.on("load", () => {
      mapRef.current.easeTo({
        zoom: 16.25,
        pitch: 52,
        bearing: 15,
        duration: 2000,
        easing: (t) => t,
      });

      addShelterMarkers(selectedCounties); // Add shelter markers based on the selected counties
    });
  };

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

  // Function to reset the map view to the user's current location
  const resetToUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = [position.coords.longitude, position.coords.latitude];
          if (mapRef.current) {
            mapRef.current.flyTo({ center: userLocation, zoom: 16.25, speed: 1.2 });
            // Update the user marker position
            if (markerRef.current) {
              markerRef.current.setLngLat(userLocation);
            } else {
              // Add the user marker if it hasn't been created yet
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
                .setLngLat(userLocation)
                .addTo(mapRef.current);
            }
          }
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    }
  };

  // On mount, initialize the map and set the user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = [position.coords.longitude, position.coords.latitude];
          initializeMap(userLocation);

          // Add a marker for the user's location
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
            .setLngLat(userLocation)
            .addTo(mapRef.current);
        },
        (error) => {
          console.error("Error fetching location:", error);
          initializeMap([-82.4572, 27.9506]); // Fallback to Tampa Bay coordinates
        }
      );
    } else {
      console.error("Geolocation not supported by this browser.");
      initializeMap([-82.4572, 27.9506]); // Fallback to Tampa Bay coordinates
    }

    // Clean up the map instance when the component unmounts
    return () => mapRef.current && mapRef.current.remove();
  }, []);

  // Update shelter markers when selected counties change
  useEffect(() => {
    addShelterMarkers(selectedCounties);
  }, [selectedCounties]);

  return (
    <div>
      <div
        ref={mapContainerRef}
        className="w-full h-[100vh] rounded-lg border-4 border-blue-500 overflow-hidden"
      />

      <button
        onClick={resetToUserLocation}
        className="Reset"
      >
        <FaLocationArrow />
      </button>
    </div>
  );
}
