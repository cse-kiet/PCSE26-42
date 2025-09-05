import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "../styles/register.css";
import Navbar from "../components/Navbar";
export default function Register() {
  const { role } = useParams(); // "patient" or "doctor"
  const navigate = useNavigate();
  const BASE_URL = "http://127.0.0.1:8000";

  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    phone: "",
    specialization: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let body = {
      username: formData.username,
      full_name: formData.full_name,
      email: formData.email,
      password: formData.password,
      role: role.toUpperCase(), // PATIENT / DOCTOR
      phone: formData.phone,
    };

    if (role === "patient") {
      body.age = formData.age;
      body.gender = formData.gender;
    } else if (role === "doctor") {
      body.specialization = formData.specialization;
    }

    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully!`);
        navigate(`/login/${role}`);
      } else {
        alert(`Registration failed: ${data.detail || JSON.stringify(data)}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend!");
    }
  };

  return (
    <div>
      <Navbar/>
    <div className="reg-container">
      <div>
         
      </div>
<div>
<form className="reg-form" onSubmit={handleSubmit}>
      <h2>{role === "patient" ? "Patient Signup 🤒" : "Doctor Signup 👩‍⚕️"}</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <br/>
        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
          required
        />
        <br/>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        /><br/>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br/>
        {role === "patient" && (
          <>
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              required
            /><br/>
            <input
              type="text"
              name="gender"
              placeholder="Gender"
              value={formData.gender}
              onChange={handleChange}
              required
            />
          </>
        )}

        {role === "doctor" && (
          <input
            type="text"
            name="specialization"
            placeholder="Specialization"
            value={formData.specialization}
            onChange={handleChange}
            required
          /> 
        )}<br/>

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
<br/><br/>
        <button type="submit">Register</button>
          <p>Already have an account?</p>
      <Link to={`/login/${role}`}>
        <button>Login as {role === "patient" ? "Patient" : "Doctor"}</button>
      </Link>
      </form>
</div>
      

     </div>
    </div>
  );
}
