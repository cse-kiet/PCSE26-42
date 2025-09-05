import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import './App.css';

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import PatientDashboard from "./pages/PatientDashboard";
import ClinicianDashboard from "./pages/ClinicianDashboard";
import EditProfile from "./components/editProfile";
import DoctorPatient from "./components/DoctorPatient";
import PatientList from "./components/PatientList";
import PatientAppointments from "./components/PatientAppointments";
function App() {
  return (
  <Router>
 
    <Routes>
     
    <Route path="/" element={<Home />}/>
    <Route path="/login/:role" element={<Login />}/>
    <Route path="/register/:role" element={<Register/>}/>
    <Route path="/patient" element={<PatientDashboard />}/>
    <Route path="/clinician" element={<ClinicianDashboard />}/>
    <Route path="/editprofile/:role" element={<EditProfile/>}></Route>
    <Route path="/doctor/patient/:id" element={<DoctorPatient/>}></Route>
    <Route path="/patients" element={<PatientList />} />
    <Route path="/profile/patient/:patientId" element={<PatientAppointments />} />
  </Routes>

</Router>
     );
}
export default App;
// In your router config



