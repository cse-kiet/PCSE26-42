import React from 'react';
import { useNavigate } from "react-router-dom";
import "../styles/navbar.css";

export default function PatientNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear saved auth data
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // if you stored token separately
    
    // Redirect to login (or landing page)
    navigate("/");
  };

  return (
    <div>
      <div className="nav">
        <a href="/editprofile/patient">Profile</a>
        <a href="/patient">Dashboard</a>
        <button onClick={handleLogout} className="right logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}
