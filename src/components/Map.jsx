// MapComponent.js
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { FaLocationArrow } from "react-icons/fa";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
const TILEQUERY_URL = "https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/tilequery";
const GEOCODING_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places";

export default function Map({ radius }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [features, setFeatures] = useState([]); // State to store features with geocoded names

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initializeMap = (location) => {
      const initialLocation = location || [-74.5, 40];

      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        center: initialLocation,
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
              "circle-radius": radius,
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

        queryFeaturesWithinRadius(initialLocation, radius);
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

  useEffect(() => {
    if (mapRef.current && mapRef.current.isStyleLoaded() && mapRef.current.getLayer("pulsing-ring")) {
      mapRef.current.setPaintProperty("pulsing-ring", "circle-radius", radius);
      if (userLocation) {
        queryFeaturesWithinRadius(userLocation, radius);
      }
    }
  }, [radius]);

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

  // Function to query features within the radius using Tilequery API and reverse geocode each feature
  const queryFeaturesWithinRadius = async (center, radius, namedPOIs = new Set(), attempts = 0) => {
    const [lng, lat] = center;
    const url = `${TILEQUERY_URL}/${lng},${lat}.json?radius=${radius * 20}&limit=50&layers=poi_label&access_token=${mapboxgl.accessToken}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      // Filter for relevant POI features based on properties like "class" and "category"
      const poiFeatures = data.features.filter((feature) => {
        const { class: featureClass, category, type } = feature.properties;
        const isPOI = featureClass === "poi" || featureClass === "landmark" || category || type;
        return isPOI && featureClass !== "sidewalk" && featureClass !== "pedestrian";
      });
  
      // Retrieve names for POIs through reverse geocoding if necessary
      const newFeaturesWithNames = await Promise.all(
        poiFeatures.map(async (feature) => {
          const { geometry, properties } = feature;
          const coordinates = geometry?.coordinates;
          let name = properties.name || (coordinates && (await reverseGeocode(coordinates))) || "Unnamed POI";
  
          // Filter out names that resemble addresses
          const addressPattern = /\d+.*(Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr)/i;
          if (addressPattern.test(name)) {
            name = "Unnamed POI"; // Mark it as unnamed if it's an address-like name
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
  
      // Add only unique, named POIs to the accumulated set
      newFeaturesWithNames.forEach((feature) => {
        if (feature.properties.name !== "Unnamed POI") {
          namedPOIs.add(JSON.stringify(feature)); // Using JSON string to ensure uniqueness
        }
      });
  
      // Check if we have reached 50 unique named POIs or need to requery
      if (namedPOIs.size >= 50 || attempts >= 5) {
        // Convert the set back to an array and parse the JSON to get the original structure
        const uniqueNamedPOIs = Array.from(namedPOIs).map((poi) => JSON.parse(poi));
        setFeatures(uniqueNamedPOIs.slice(0, 50)); // Display only the first 50 named POIs
        console.log("Final unique POI list:", uniqueNamedPOIs.slice(0, 50));
      } else {
        // Retry to fill up to 50 unique named POIs if we haven't reached the attempt limit
        console.log(`Retrying for more unique named POIs, attempt ${attempts + 1}`);
        queryFeaturesWithinRadius(center, radius, namedPOIs, attempts + 1);
      }
    } catch (error) {
      console.error("Error fetching features:", error);
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
          <h3 className="font-bold">Features Within Radius:</h3>
          <ul>
            {features.map((feature, index) => (
              <li key={index}>
                <strong>Name:</strong> {feature.properties.name} <br />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
