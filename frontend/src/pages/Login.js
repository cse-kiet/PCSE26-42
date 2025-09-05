import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/login.css";

export default function Login() {
  const { role } = useParams(); // "patient" or "doctor"
  const navigate = useNavigate();

  const BASE_URL = "http://127.0.0.1:8000";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async(e) => {
    e.preventDefault();
    const body={email,password};
  try{
      const response=await fetch(`${BASE_URL}/auth/login`,{
      method:"POST",
      headers:{ "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data=await response.json();
      
      if(response.ok){
        localStorage.setItem("token",data.access_token);
        localStorage.setItem("user",JSON.stringify(data.user));
        
        alert(`${role.charAt(0).toUpperCase()+role.slice(1)} logged in successfully`);
  
          if(role==="patient")navigate("/patient")
          else navigate("/clinician");
      }else{
        alert("login failed");
      }
    
  }catch(err){
    console.error(err);
    alert("error connecting to backend");
  }
} 
  return (
    <div className="login" >
      <Navbar/>
      <div className="auth-container">
     
      <div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Sign in</h2>
        <label>Email</label><br/>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br/>
        <label>Password</label><br/>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <br />
        <button type="submit">Sign In</button>
      </form>

      </div>
       <div>
              <p>Welcome to {role==="patient"?"Patient 🤒" :"Doctor 👩‍⚕️"} login</p>
              <p>Don't have an account?</p>
      <Link to={`/register/${role}`}>
        <button>Sign up</button>
      </Link>

      </div>
</div>      
    </div>
  );
}
