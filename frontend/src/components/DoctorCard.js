import React, { useEffect, useState } from "react";
import axios from "axios";
export default function DoctorCard({selectedSymptoms}) {
  const [doctors, setDoctors] = useState([]);
  const user=JSON.parse(localStorage.getItem("user"));
  
  useEffect(() => {
    fetch("http://127.0.0.1:8000/patient/doctors")
      .then((res) => res.json())
      .then((data) => setDoctors(data))
      .catch((err) => console.error("Error fetching doctors:", err));
  }, []);

  const bookAppointment=async(doctorId)=>{
    try{
      await axios.post("http://127.0.0.1:8000/appointments/",{
        doctor_id:doctorId,
        patient_id:user?.id,
        symptoms:selectedSymptoms.join(", "),
        date:new Date().toISOString(),
      });
      alert("Appointment successfull");
    }catch(error){
      console.error(error);
      alert('Failed to book appointment');
    }
  };
  return (
    <div className="doctor-grid">
       <div className="doctor-card">             
      <h2>Available Doctors</h2>
      <ul>
        {doctors.map((doc) => (
          <li key={doc.doctor_user_id}>
            <strong>{doc.full_name}</strong>
            <br />
            {doc.email}
            <br />
            Specialization: {doc.specialization}<br/>
            Experience: 5 years
          Hospital:MAX Hospital
         
            <br/>
            <button onClick={()=>bookAppointment(doc.doctor_user_id)}>Get Medical Advice</button>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
}
