import React, { useState ,useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";
import "../styles/ppic.css";
export default function PatientProfile(){
    const user=JSON.parse(localStorage.getItem("user"));
    const[profile,setProfile]=useState({
        full_name:"",
        blood_group:"",
        age:"",
        profile_image:"",
        medical_history:""

    });
    const BASE_URL= "http://127.0.0.1:8000";

    useEffect(()=>{
        axios.get(`${BASE_URL}/profile/patient/${user.id}`,{
            headers:{Authorization:`Bearer ${localStorage.getItem("token")}`},
        }).then((res)=>{
            setProfile({
                full_name:res.data.full_name,
                blood_group:res.data.blood_group,
                age:res.data.age,
                medical_history:res.data.medical_history,
                profile_image:res.data.profile_image
            });
        }).catch((err)=>console.error(err));
    },[user.id]);
    
    return(
       
        <div  className="profile">
            <div className='ProfilePic'><img src={profile.profile_image ? `${BASE_URL}/${profile.profile_image}` : "../images/women.jpg" }width="250px" alt="patient profile"></img></div>
            <div className='Patientinfo'>
                    <p>Name :   {profile.full_name}</p>
                    <p>Blood Group:  {profile.blood_group}</p>
                    <p>Age :    {profile.age}</p>
                     <p>Medical History :    {profile.medical_history}</p>
                
            </div>
        
        </div>
    )
}