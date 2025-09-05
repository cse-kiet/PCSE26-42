import joblib
import numpy as np
import os

# Load the trained model
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'disease_model.pkl')
model = joblib.load(MODEL_PATH)

# Load all symptoms used in training
SYMPTOMS_LIST_PATH = os.path.join(os.path.dirname(__file__), 'symptom_list.txt')
with open(SYMPTOMS_LIST_PATH, 'r') as f:
    all_symptoms = [line.strip() for line in f.readlines()]

def predict_disease(symptoms: list, emotion: str):
    input_vector = [1 if symptom in symptoms else 0 for symptom in all_symptoms]

    # Optional: Modify based on emotion
    emotion_weights = {
        'happy': 1.0,
        'sad': 1.05,
        'angry': 1.1,
        'anxious': 1.15,
        'depressed': 1.2
    }

    emotion_factor = emotion_weights.get(emotion.lower(), 1.0)
    adjusted_vector = np.array(input_vector) * emotion_factor

    # Predict
    prediction = model.predict([adjusted_vector])[0]
    return prediction
