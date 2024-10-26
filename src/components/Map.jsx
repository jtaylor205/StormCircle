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
    // Initialize the Mapbox map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: center, // Use the user's location as the center
      zoom: 16, // Set initial zoom level
      pitch: 45,
      bearing: 0,
      style: "mapbox://styles/j-taylor/cm2pi61u300ef01ph12le6si4",
    });

    // Animate the zoom, pitch, and bearing when the map loads
    mapRef.current.on("load", () => {
      mapRef.current.easeTo({
        zoom: 16.25,
        pitch: 52,
        bearing: 15,
        duration: 2000,
        easing: (t) => t,
      });

      // Add a pulsing ring around the marker (if necessary)
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

    // Place a marker at the clicked location (if desired)
    // mapRef.current.on("click", (e) => {
    //   const coordinates = e.lngLat;

    //   // Update the pulsing ring location
    //   if (mapRef.current.getSource("marker-source")) {
    //     mapRef.current.getSource("marker-source").setData({
    //       type: "FeatureCollection",
    //       features: [
    //         {
    //           type: "Feature",
    //           geometry: {
    //             type: "Point",
    //             coordinates: [coordinates.lng, coordinates.lat]
    //           }
    //         }
    //       ]
    //     });
    //   }

    //   // Remove the existing marker if one exists
    //   if (markerRef.current) {
    //     markerRef.current.remove();
    //   }

    //   // Add a new marker at the clicked location
    //   markerRef.current = new mapboxgl.Marker()
    //     .setLngLat([coordinates.lng, coordinates.lat])
    //     .addTo(mapRef.current);
    // });
  };

  useEffect(() => {
    // Fetch the user's current location using the Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = [position.coords.longitude, position.coords.latitude];

          // Initialize the map centered on the user's location
          initializeMap(userLocation);

          // Add a blue marker with shadow at the user's location
          if (mapRef.current) {
            const userMarker = document.createElement("div");
            userMarker.style.cssText = `
              height: 12px;
              width: 12px;
              border: 1.5px solid #fafafa;
              border-radius: 50%;
              background-color: #38bdf8;
              box-shadow: 0px 0px 4px 2px rgba(14,165,233,1);
            `;
            markerRef.current = new mapboxgl.Marker(userMarker) // Use custom blue marker element
              .setLngLat(userLocation) // Set marker at user's location
              .addTo(mapRef.current);
          }
        },
        (error) => {
          console.error("Error fetching location:", error);
          // Fallback to a default location (e.g., New York City) if there's an error
          initializeMap([-74.5, 40]);
        }
      );
    } else {
      console.error("Geolocation not supported by this browser.");
      initializeMap([-74.5, 40]); // Fallback to default location if Geolocation is not supported
    }

    // Cleanup on component unmount
    return () => mapRef.current && mapRef.current.remove();
  }, []);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-[100vh] rounded-lg border-4 border-blue-500 overflow-hidden"
    />
  );
}
