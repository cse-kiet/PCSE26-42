import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DoctorNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear saved auth data
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // if you stored token separately
    
    // Redirect to login (or landing page)
    navigate("/");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>EmoHeath Nexus</h2>
      </div>
      <ul className="nav-menu">
        <li className="nav-item">
          <a href="#" className="nav-link">Dashboard</a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link">Patients</a>
        </li>
        <li className="nav-item">
          <a href="/editProfile/doctor" className="nav-link">Profile</a>
        </li>
        
        <li className="nav-item">
          <a className="nav-link" onClick={handleLogout}>Logout</a>
        </li>
      </ul>
    </div>
  );
}
