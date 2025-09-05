import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Get logged-in user from localStorage
    const doctorData = JSON.parse(localStorage.getItem("user"));
    if (!doctorData || doctorData.role !== "DOCTOR") {
      setError("Doctor not found. Please login again.");
      setLoading(false);
      return;
    }

    const doctorId = doctorData.id;

    // Fetch patients for this doctor
    fetch(`http://127.0.0.1:8000/doctor/patients?doctor_id=${doctorId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setPatients(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching patients:", err);
        setError("Failed to fetch patients.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading patients...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="patient-list">
      <h3>Patients List</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Mobile No.</th>
          </tr>
        </thead>
        <tbody>
          {patients.length === 0 ? (
            <tr>
              <td colSpan="4">No patients found</td>
            </tr>
          ) : (
            patients.map((patient) => (
              <tr
                key={patient.id}
                onClick={() => navigate(`/profile/patient/${patient.id}`)}
              >
                <td>{patient.full_name}</td>
                <td>{patient.age}</td>
                <td>{patient.gender}</td>
                <td>{patient.phone}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
