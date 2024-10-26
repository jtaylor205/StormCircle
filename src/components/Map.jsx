// MapComponent.js
import React, { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

export default function Map() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null); // Ref to store the actual marker (pin)

  const initializeMap = (center) => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: center,
      zoom: 5,
      pitch: 45,
      bearing: 0,
      style: "mapbox://styles/j-taylor/cm2pi61u300ef01ph12le6si4",
    });

    mapRef.current.on("load", () => {
      // Set initial zoom, pitch, and bearing animation
      mapRef.current.easeTo({
        zoom: 16.25,
        pitch: 52,
        bearing: 15,
        duration: 2000,
        easing: (t) => t,
      });

      // Add the marker source and layer if they don't already exist
      if (!mapRef.current.getSource("marker-source")) {
        mapRef.current.addSource("marker-source", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: []
          }
        });

        mapRef.current.addLayer({
          id: "pulsing-ring",
          type: "circle",
          source: "marker-source",
          paint: {
            "circle-radius": 70,
            "circle-color": "blue",
            "circle-opacity": 0.2,
            "circle-stroke-width": 1,
            "circle-stroke-color": "blue",
            "circle-pitch-alignment": "map", // Aligns the circle with map pitch
          }
        });
      }
    });

    // Add click event to place both a pulsing ring and a marker
    mapRef.current.on("click", (e) => {
      const coordinates = e.lngLat;

      // Update the GeoJSON source with the new marker location for the pulsing ring
      if (mapRef.current.getSource("marker-source")) {
        mapRef.current.getSource("marker-source").setData({
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [coordinates.lng, coordinates.lat]
              }
            }
          ]
        });
      }

      // Remove the existing actual marker if there is one
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Create a new actual marker (pin) and set it to markerRef
      markerRef.current = new mapboxgl.Marker()
        .setLngLat([coordinates.lng, coordinates.lat])
        .addTo(mapRef.current);
    });
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = [position.coords.longitude, position.coords.latitude];
          initializeMap(userLocation);
        },
        (error) => {
          console.error("Error fetching location:", error);
          initializeMap([-74.5, 40]);
        }
      );
    } else {
      console.error("Geolocation not supported by this browser.");
      initializeMap([-74.5, 40]);
    }

    return () => mapRef.current && mapRef.current.remove();
  }, []);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-[100vh] rounded-lg border-4 border-blue-500 overflow-hidden"
    />
  );
}
