import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css"
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
export default function Home() {
  return (
    <div className="home-container">
         <Navbar/>
      <div className="hero">
        <div className="hero-text">
          <h1>EmoHealth Nexus</h1>
          <span className="tagline">"Where feelings meet health, and early insights save lives." 💙</span>
          <p>
            Predict secondary diseases by combining emotional health and physical symptoms.
          </p>
         
        </div>
        
     
      </div>
      <div className="EmohealthInfo">
          <h2>Welcome to EmoHealthNexus</h2>
          <p>At EmoHealth, we are committed to supporting your mental and physical well-being<br/> through innovative, personalized healthcare solutions.<br/>Our platform provides seamless access to expert advice, <br/>reliable resources, and real-time support. <br/>
            <span> <h4>Choose Your role</h4></span>
           <div className="role">
             
              <div className="patient"><a href="/login/patient">Patient 🤒</a></div>
              <div className="doctor"><a href="/login/doctor">Doctor 👩‍⚕️</a></div>
            </div>
          </p>
        </div>
        <div className="mental-health">
            <img src="images/mentalhealth2.png" alt="mental health and emotions" className="mental-health-image">
                    
                </img>
            
           <div className="mental-health-text">
                <h2>Because your emotions tell a story your body can’t hide</h2>
                <p>
                Your health isn’t just numbers and charts – it’s feelings, moods, and
                moments you live every day 😊.
                <br />
                Our platform listens not only to your symptoms but also to the<br/> emotions
                behind them, helping you understand how <br/>your mental state connects to your
                physical well-being.
                <br />
                <em className="crisplines">“It’s like having a friend who notices the little changes you might overlook.”</em>
                </p>
         </div>
     </div>
        <div className="physical-health">
           
            <div className="physical-health-text">
            <h2>Stop the Next Problem Before It Starts</h2>
               <p>Sometimes, one health issue hides 
                clues about another <br/>brewing in the background.
                We help you spot these <br/>hidden links early-
                so you can take charge before things get serious.<br/> 
                <em className="crisplines">"Think of it as shining a light into the corners of <br/>your health story that you didn’t even know existed."</em></p>  
            </div>
            <img src="images/heart.jpg" alt="secondary disease correlation" className="physical-health-image"></img>
            
           
               </div>
      <h2 className="features-title">Key Features</h2>
      <div className="features">
        <div className="feature-card">
          <h3>🩺 Predict Disease</h3>
          <p>Get predictions for potential secondary diseases based on your symptoms.</p>
        </div>
        <div className="feature-card">
          <h3> Emotion Tracking</h3>
          <p>Integrate wearable data to see how emotions affect your health.</p>
        </div>
        <div className="feature-card">
          <h3>📊 Disease Correlation</h3>
          <p>Visualize disease relationships for better prevention and care.</p>
        </div>
      </div>
      <Footer/>
    </div>
    
  );
}
