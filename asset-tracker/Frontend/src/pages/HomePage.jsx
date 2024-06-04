import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "../components/Navbar/AppBar";
import MapComponent from "../components/Map/Map";
// import TestMap from "../components/Map/test";

const HomePage = () => {
  const navigate = useNavigate();
  const [locationMarkers, setLocationMarkers] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!localStorage.getItem("asset-tracker-user-info")) {
          navigate("/login");
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (localStorage.getItem("asset-tracker-user-info")) navigate("/");
  }, []);

  return (
    <>
      <AppBar setLocationMarkers={setLocationMarkers} />
      {locationMarkers ? (
        <MapComponent locationMarkers={locationMarkers} />
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <h1>◀️ Select a device from the menu</h1>
        </div>
      )}
    </>
  );
};

export default React.memo(HomePage);
