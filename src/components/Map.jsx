// MapComponent.js
import React, { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import { FaLocationArrow } from "react-icons/fa";

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
      mapRef.current.easeTo({
        zoom: 16.25,
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
            "circle-pitch-alignment": "map",
          }
        });
      }
    });
  };

  const resetToUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = [position.coords.longitude, position.coords.latitude];
          if (mapRef.current) {
            mapRef.current.flyTo({ center: userLocation, zoom: 16.25, speed: 1.2 });
          }
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = [position.coords.longitude, position.coords.latitude];
          initializeMap(userLocation);

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
