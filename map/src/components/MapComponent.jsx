import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix the default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapComponent = () => {
  const [storeLocations, setStoreLocations] = useState([]);
  const [userLocation, setUserLocation] = useState([51.505, -0.09]); // Default center
  const [nearestStores, setNearestStores] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStoreLocations = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/stores");
        setStoreLocations(response.data);
      } catch (error) {
        console.error("Error fetching store locations:", error);
      }
    };

    fetchStoreLocations();
  }, []);

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
          setError(null);
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setError("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              setError("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              setError("The request to get user location timed out.");
              break;
            default:
              setError("An unknown error occurred.");
              break;
          }
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const handleFindStores = () => {
    const sortedStores = storeLocations
      .map((store) => ({
        ...store,
        distance: Math.sqrt(
          Math.pow(store.latitude - userLocation[0], 2) +
            Math.pow(store.longitude - userLocation[1], 2)
        ),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);

    setNearestStores(sortedStores);
  };

  return (
    <div>
      <div>
        <button onClick={handleGeolocation}>Use My Location</button>
        <button onClick={handleFindStores}>Find Nearest Stores</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
      <MapContainer
        center={userLocation}
        zoom={13}
        style={{ height: "50vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {nearestStores.map((store) => (
          <Marker key={store._id} position={[store.latitude, store.longitude]}>
            <Popup>
              <strong>{store.name}</strong>
              <br />
              {store.address}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div>
        <h2>Nearest Stores</h2>
        <ul>
          {nearestStores.map((store) => (
            <li key={store._id}>
              {store.name} - {store.address}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MapComponent;


