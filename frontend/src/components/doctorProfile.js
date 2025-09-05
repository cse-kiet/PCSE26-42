import React, { useState ,useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";
import "../styles/ppic.css";
export default function DoctorProfile(){
    const user=JSON.parse(localStorage.getItem("user"));
    const[profile,setProfile]=useState({
        full_name:"",
        specialization:"",
        experience:"",
        hospital:"",
        profile_image:""

    });
    const BASE_URL= "http://127.0.0.1:8000";

    useEffect(()=>{
        axios.get(`${BASE_URL}/profile/doctor/${user.id}`,{
            headers:{Authorization:`Bearer ${localStorage.getItem("token")}`},
        }).then((res)=>{
            setProfile({
                full_name:res.data.full_name,
                specialization:res.data.specialization,
                experience:res.data.experience,
                hospital:res.data.hospital,
                profile_image:res.data.profile_image
            });
        }).catch((err)=>console.error(err));
    },[user.id]);
    
    return(
       
        <div  className="Drprofile">
            
            <div className='DrPic'><img src={profile.profile_image ? `${BASE_URL}/${profile.profile_image}` : "../images/women.jpg" }width="200px" height="200px" alt="patient profile"></img></div>
            <div className='Doctorinfo'>
                    <p><i><em>Name : </em>  {profile.full_name}</i></p>
                    <p><i><em>Specialization:</em>  {profile.specialization}</i></p>
                    <p><i><em>Experience :</em>    {profile.experience}</i></p>
                     <p><i><em>Hospital :</em>    {profile.hospital}</i></p>
                
            </div>
        
        </div>
    )
}