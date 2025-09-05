import React from 'react';

const SymptomsComponent = ({ patient }) => {
  return (
    <div className="symptoms-card">
      <h3>Patient Symptoms & Data</h3>
      <div className="data-item">
        <strong>Physical Symptoms:</strong>
        <p>{patient.symptoms}</p>
      </div>
      <div className="data-item">
        <strong>Emotional State:</strong>
        <p>{patient.emotionalData}</p>
      </div>
      <div className="data-item">
        <strong>Cross-Domain Insights:</strong>
        <p>This is where the EmoHealth Nexus analyzes correlations between {patient.symptoms} and {patient.emotionalData}.</p>
      </div>
    </div>
  );
};

export default SymptomsComponent;