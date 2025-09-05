import React from 'react';
import "../styles/wearable.css";
export default function wearable_data(){
    return(
        <div>
            <div className="activities-card">
                <h2>Today's health Track</h2>
                <div className="card">
                    <p><strong>Sleep:</strong> 6hr 20min</p>
                <p><strong>Pulse:</strong> 102 bpm</p>
                <p><strong>Steps:</strong> 4250 steps</p>
                <br/>
                 <p><strong>Blood Pressure:</strong> 750</p>
                </div>
                
            </div>
            
        </div>
    )
}