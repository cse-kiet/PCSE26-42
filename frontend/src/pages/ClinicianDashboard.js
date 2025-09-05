import React, { useState, Link } from 'react';
import "../styles/Clinician.css";
import DoctorProfile from "../components/doctorProfile.js";
import PatientList from "../components/PatientList.js";
import DoctorNavbar from "../components/doctorNavbar.js"
  export default function ClinicianDashBoard(){
  return (
    <div className="dashboard-container">
     <DoctorNavbar/>
      <div className="main-content">
         <DoctorProfile/>
         <PatientList/>
        </div>
    </div>
  );
};
