import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useState } from "react";
import { useEffect } from "react";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = ({ locationMarkers }) => {
  const [markers, setMarkers] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setMarkers(await JSON.parse(locationMarkers));
    }
    fetchData();
  }, [locationMarkers]);

  return markers ? (
    <MapContainer
      zoom={7}
      style={{ height: "100vh", width: "100%" }}
      center={markers.centrePoint}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {markers.locData.map((marker, index) => (
        <Marker key={index} position={[marker.lat, marker.lon]}>
          <Popup>{marker.popup}</Popup>
        </Marker>
      ))}
    </MapContainer>
  ) : (
    <></>
  );
};

export default MapComponent;
