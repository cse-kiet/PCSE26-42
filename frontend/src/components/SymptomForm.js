import React, { useState, useEffect } from "react";
import "../styles/symptomForm.css";
import DoctorCard from "./DoctorCard.js";

export default function SymptomForm({ onSubmitSymptoms}) {
  const BASE_URL = "http://127.0.0.1:8000";

  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [emotion, setEmotion] = useState("");
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  // Fetch symptoms from backend
  useEffect(() => {
    const fetchSymptoms = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/predict/symptoms`);
        const data = await response.json();
        setSymptoms(data.symptoms || []); // ensure array
      } catch (err) {
        console.error("Error fetching symptoms:", err);
        setError("Failed to load symptoms.");
        setSymptoms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSymptoms();
  }, []);

  //  Group symptoms by first letter
  const groupedSymptoms = (symptoms || []).reduce((groups, symptom) => {
     const cleanSym = symptom.trimStart(); // remove spaces + underscores
    const letter = cleanSym[0].toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(cleanSym);
    return groups;
  }, {});

  const handleCheckboxChange = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };



  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!emotion || selectedSymptoms.length === 0) {
    alert("Please select at least one symptom and choose your emotional state.");
    return;
  }

  // Convert frontend "stomach pain" → backend "stomach_pain"
  const normalizedSymptoms = selectedSymptoms.map((sym) =>
    sym.trim().replace(/ /g, "_")
  );

  const body = {
    symptoms: normalizedSymptoms,  // send underscored version
    emotional_state: emotion,
  };

  console.log("Sending to backend:", body);

  try {
    const response = await fetch(`${BASE_URL}/predict/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Prediction result:", data);
      setPrediction(data);
    } else {
      setPrediction({ error: data.detail || "Prediction failed" });
    }
  } catch (err) {
    console.error(err);
    alert("Error connecting to backend!");
  }
};


  //  Handle loading & error state
  if (loading) return <p>Loading symptoms...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <div className="symptom-container">
        <h2>
          <em>Diseases and Conditions</em>
        </h2>
        <h4>Easy-to-understand answers about diseases and conditions</h4>
        <br />
        <h5>Find diseases and conditions by first letter</h5>

        <form onSubmit={handleSubmit}>
          {/* Alphabet List */}
          <div className="alphabet-list">
            {Object.keys(groupedSymptoms)
              .sort()
              .map((letter) => (
                <span
                  key={letter}
                  className={`alphabet-item ${
                    expandedGroup === letter ? "active" : ""
                  }`}
                  onClick={() =>
                    setExpandedGroup(expandedGroup === letter ? null : letter)
                  }
                >
                  {letter}
                </span>
              ))}
          </div>

          {/* Show Symptoms BELOW the alphabet list */}
          {expandedGroup && (
            <div className="symptom-list-expanded">
              {groupedSymptoms[expandedGroup].map((symptom, index) => (
                <label key={index} className="symptom-item">
                  <input
                    type="checkbox"
                    value={symptom}
                    checked={selectedSymptoms.includes(symptom)}
                    onChange={() => handleCheckboxChange(symptom)}
                  />
                  {symptom.replace(/_/g, " ")}
                </label>
              ))}
            </div>
          )}

          {/* Show selected symptoms */}
          {selectedSymptoms.length > 0 && (
            <div className="selected-symptoms">
              <h4> Selected Symptoms:</h4>
              <ul>
                {selectedSymptoms.map((sym, idx) => (
                  <li key={idx}>{sym.replace(/_/g, " ")}</li>
                ))}
              </ul>
            </div>
          )}

          <br />
          <select
            value={emotion}
            onChange={(e) => setEmotion(e.target.value)}
            required
          >
            <option value="">Describe Your Emotional State</option>
            <option value="anxious">Anxious</option>
            <option value="stressed">Stressed</option>
            <option value="sad">Sad</option>
          </select>
          <br />
          <button type="submit" className="btn-primary">
            Submit Symptoms
          </button>
        </form>
      </div>

      {/* Prediction & Doctors */}
      {prediction && (
        <div className="prediction-result">
          {prediction.error ? (
            <p style={{ color: "Red" }}>{prediction.error}</p>
          ) : (
            <>
              <p>
                <em>Predicted Disease:</em> {prediction.predicted_disease}
              </p>
              <p>
                <em>Emotion Insights:</em> {prediction.emotion_insight}
              </p>
               <DoctorCard selectedSymptoms={selectedSymptoms} /> {/* will fetch doctors */}
            </>
          )}
        </div >
      )}
    </div>
  );
}
