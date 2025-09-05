import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import DoctorNavbar from "../components/doctorNavbar";
import DoctorProfile from "../components/doctorProfile.js";
import Chart from "../components/Chart.js";
import "../styles/Clinician.css";
export default function PatientAppointments() {
  const { patientId } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [newRecommendation, setNewRecommendation] = useState("");

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

  const handleEditClick = (apptId, currentRec) => {
    setEditingId(apptId);
    setNewRecommendation(currentRec || "");
  };

  const handleSave = (apptId) => {
  fetch(`http://127.0.0.1:8000/appointments/${apptId}/recommendation`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ recommendation: newRecommendation }),
})

      .then((res) => res.json())
      .then((updated) => {
        setAppointments((prev) =>
          prev.map((appt) =>
            appt.id === apptId ? { ...appt, recommendation: newRecommendation } : appt
          )
        );
        setEditingId(null);
        setNewRecommendation("");
      })
      .catch((err) => console.error("Failed to update recommendation:", err));
  };

  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="dashboard-container">
      <DoctorNavbar/>
      <div className="main-content">
      <DoctorProfile/>
      <div className="patient-appointments">
        <div className="heading">
          <h4>Symptom History for Patient {patientId}</h4>
          <h4 className="back"><Link to="/clinician">Back to Patient List</Link></h4>
        </div>
      <div className="patient-list">
        <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Symptoms</th>
            <th>Advice</th>
            <th>Action</th>
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
                  {editingId === appt.id ? (
                    <input
                      type="text"
                      value={newRecommendation}
                      onChange={(e) => setNewRecommendation(e.target.value)}
                    />
                  ) : (
                    appt.recommendation || "No advice yet"
                  )}
                </td>
                <td>
                  {editingId === appt.id ? (
                    <button onClick={() => handleSave(appt.id)}>Save</button>
                  ) : (
                    <button onClick={() => handleEditClick(appt.id, appt.recommendation)}>
                      Add / Edit
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>    
    </div>
    <Chart/>
  </div>
  );
}
