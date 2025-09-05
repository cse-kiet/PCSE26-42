import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function EditProfile() {
  const { role } = useParams(); // expects URL like /edit-profile/patient
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    gender: "",
    medical_history:"",
    profile_image: null, // matches backend
    specialization: "",
    experience: "",
    hospital: "",
    age: "",
    blood_group: "", // matches backend
  });

  const BASE_URL = "http://127.0.0.1:8000";

  // Fetch current profile details
  const fetchProfile = () => {
    axios
      .get(`${BASE_URL}/profile/${role}/${user.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setFormData((prev) => ({
          ...prev,
          ...res.data, // backend returns merged User + Profile info
        }));
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchProfile();
  }, [role, user.id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit update
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("full_name", formData.full_name);
    data.append("email", formData.email || "");
    data.append("phone", formData.phone || "");
    data.append("gender", formData.gender || "");
    if (role === "patient") {
      if (formData.age) data.append("age", formData.age);
  if (formData.blood_group) data.append("blood_group", formData.blood_group);
  if (formData.medical_history) data.append("medical_history", formData.medical_history);
   

    }
    if (role === "doctor") {
      data.append("specialization", formData.specialization || "");
      data.append("experience", formData.experience || "");
      data.append("hospital", formData.hospital || "");
       data.append("avatar", formData.avatar || "");
    }
    if (formData.profile_image) data.append("profile_image", formData.profile_image);
     if (formData.avatar) data.append("avatar", formData.avatar);
     
    axios
      .put(`${BASE_URL}/profile/${role}/${user.id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        alert("Profile updated successfully ✅");
        fetchProfile(); // re-fetch profile after update
      })
      .catch((err) => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit} className="edit-profile-form">
      {/* Common (User table) */}
      <input
        type="text"
        name="full_name"
        value={formData.full_name}
        onChange={handleChange}
        placeholder="Full Name"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        disabled // usually email shouldn't be editable
      />
      <input
        type="text"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone"
      />

      {/* Patient fields */}
      {role === "patient" && (
        <>
          <input
            type="number"
            name="age"
            value={formData.age??""}
            onChange={handleChange}
            placeholder="Age"
          />
          <input
            type="text"
            name="blood_group"
            value={formData.blood_group??""}
            onChange={handleChange}
            placeholder="Blood Group"
          />
          <input
            type="text"
            name="medical_history"
            value={formData.medical_history??""}
            onChange={handleChange}
            placeholder="medical history"
          />
        </>
      )}

      {/* Doctor fields */}
      {role === "doctor" && (
        <>
          <input
            type="text"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            placeholder="Specialization"
          />
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="Experience"
          />
          <input
            type="text"
            name="hospital"
            value={formData.hospital}
            onChange={handleChange}
            placeholder="Hospital"
          />
        </>
      )}

      <select name="gender" value={formData.gender} onChange={handleChange}>
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      <input type="file" name="profile_image" onChange={handleChange} />
      <button type="submit">Update Profile</button>
    </form>
  );
}
