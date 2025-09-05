import pickle
import numpy as np

# Load the model and symptom list (used for creating the correct feature vector)
with open("app/ml/disease_model.pkl", "rb") as f:
    model_data = pickle.load(f)

model = model_data["model"]
symptom_list = model_data["symptom_list"]

def preprocess_input(symptoms, other_symptoms=None):
    """
    Convert symptoms into input vector for the model.
    Symptoms not in symptom_list are ignored (except 'other_symptoms' which we can log optionally).
    """
    input_vector = [0] * len(symptom_list)

    for sym in symptoms:
        if sym in symptom_list:
            idx = symptom_list.index(sym)
            input_vector[idx] = 1

    return np.array([input_vector])

def generate_emotion_insights(emotion: str) -> str:
    """
    Returns an insight message based on emotional state.
    """
    emotion = emotion.lower()
    if emotion in ["stressed", "anxious", "worried"]:
        return "Your stress level seems high. Stress can worsen or trigger certain conditions like migraines, heart issues, and hypertension. Consider practicing relaxation techniques or consulting a counselor."
    elif emotion in ["sad", "depressed"]:
        return "Low emotional state can lead to weakened immunity and higher risk of chronic conditions. Take care of your mental well-being."
    elif emotion in ["happy", "relaxed"]:
        return "Great to see you're feeling positive! Good emotional health supports physical well-being."
    else:
        return "Emotional state noted. Please ensure emotional and physical wellness go hand in hand."

