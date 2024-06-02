import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import AddAsset from "./components/AddAsset";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Register Page */}
        <Route path="/register" element={<Register />} />

        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Home Page */}
        <Route path="/" element={<HomePage />} />

        {/* Home Page */}
        <Route path="/addDevice" element={<AddAsset />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
