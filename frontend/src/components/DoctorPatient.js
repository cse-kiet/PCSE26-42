import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function DoctorPatientProfile() {
  const { id } = useParams(); // user_id of the patient
  const [profile, setProfile] = useState(null);
  const BASE_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    axios
      .get(`${BASE_URL}/patient/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("Error fetching patient:", err));
  }, [id]);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="profile">
      <h3>Patient Profile</h3>
      <img
        src={
          profile.profile_image
            ? `${BASE_URL}/${profile.profile_image}`
            : "../images/women.jpg"
        }
        alt="patient"
        width="250px"
      />
      <div className="Patientinfo">
        <p>Name: {profile.full_name}</p>
        <p>Email: {profile.email}</p>
        <p>Phone: {profile.phone}</p>
        <p>Gender: {profile.gender}</p>
        <p>Age: {profile.age}</p>
        <p>Blood Group: {profile.blood_group}</p>
        <p>Medical History: {profile.medical_history}</p>
      </div>
    </div>
  );
}
