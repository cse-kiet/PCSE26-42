import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function RecomendationCard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
   const user = JSON.parse(localStorage.getItem("user"));
   console.log(user.id);
  const patientId=user.id;
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/appointments/patient/${patientId}`)
      .then((res) => res.json())
      .then((data) => {
        setAppointments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching appointments:", err);
        setError("Failed to fetch appointments.");
        setLoading(false);
      });
  }, [patientId]);


  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="recomendationCard">
      <div className="patient-appointments">
        <div className="headings">
          <h4>Recommendation's history </h4>
        </div>
      <div className="patient-list">
        <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Symptoms</th>
            <th>Advice</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length === 0 ? (
            <tr>
              <td colSpan="4">No appointments found</td>
            </tr>
          ) : (
            appointments.map((appt) => (
              <tr key={appt.id}>
                <td>{new Date(appt.date).toLocaleString()}</td>
                <td>{appt.symptoms}</td>
                <td>
        
                  {appt.recommendation || "No advice yet"}
                  
                </td>
                <td>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
  </div>
  );
}
