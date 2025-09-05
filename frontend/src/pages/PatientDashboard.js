import React from "react";
import PatientNavbar from "../components/PatientNavbar";
import SymptomForm from "../components/SymptomForm";
import WearableData from "../components/wearable_data";
import PatientProfile from "../components/PatientProfile";
import Chart from "../components/Chart";
import RecommendationCard from "../components/RecommendationCard";
import "../styles/patientDashboard.css"
export default function PatientDashboard(){
    return (
        <div>
            <PatientNavbar/>
            <div className="grids">
                <div className="leftgrid">
                <PatientProfile/>
                 <RecommendationCard/>
                <WearableData/>
                 
                </div>
                <div className="rightgrid">
                    <SymptomForm/>
                    
                    <Chart/>
                    
                </div>
               
            </div>
             </div>
    );
}