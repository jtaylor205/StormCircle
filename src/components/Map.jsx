// MapComponent.js
import React, { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
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
