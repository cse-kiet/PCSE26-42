from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import os
import pickle
import csv

router = APIRouter()

MODEL_PATH = os.path.join("app", "models", "disease_model.pkl")
SYMPTOM_TXT_FALLBACK = os.path.join("app", "ml", "symptom_list.txt")
CSV_FALLBACK_PATHS = [
    os.path.join("app", "ml", "Symptom2Disease.csv"),
    os.path.join("Symptom2Disease.csv"),
]


# ---------------- Load model and encoders ----------------
# Make model loading resilient so the API can start even if sklearn binary/wheel is incompatible.
model = None
emotion_encoder = None
disease_encoder = None
symptom_list: List[str] = []
_disease_symptoms_map = None  # type: ignore

def _load_model_safely():
    global model, symptom_list, emotion_encoder, disease_encoder
    if model is not None and symptom_list:
        return
    try:
        with open(MODEL_PATH, "rb") as f:
            model_data = pickle.load(f)
        model = model_data.get("model")
        # Deduplicate and normalize symptom list
        loaded_symptoms = list(model_data.get("symptom_list", []) or [])
        normalized = [str(s).strip() for s in loaded_symptoms if str(s).strip()]
        symptom_list = sorted(set(normalized))
        emotion_encoder = model_data.get("emotion_encoder")
        disease_encoder = model_data.get("disease_encoder")
    except Exception:
        # Fallback: load symptom list from text file if available
        if os.path.exists(SYMPTOM_TXT_FALLBACK):
            try:
                with open(SYMPTOM_TXT_FALLBACK, "r", encoding="utf-8") as fh:
                    tmp = []
                    for line in fh:
                        name = line.strip()
                        if name:
                            tmp.append(name)
                    symptom_list = sorted(set(tmp))
            except Exception:
                pass
        # Fallback: parse CSV to get symptom universe if available
        if not symptom_list:
            for csv_path in CSV_FALLBACK_PATHS:
                if os.path.exists(csv_path):
                    try:
                        _load_disease_symptoms_from_csv(csv_path)
                        break
                    except Exception:
                        continue
        # Leave model as None to indicate dummy mode


def _load_disease_symptoms_from_csv(csv_path: str):
    global _disease_symptoms_map, symptom_list
    diseases = {}
    all_symptoms = set()
    with open(csv_path, newline="", encoding="utf-8") as csvfile:
        reader = csv.reader(csvfile)
        rows = list(reader)
        if not rows:
            return
        header = rows[0]
        # assume first column = Disease, last may be label again; symptoms are middle columns
        symptom_cols = header[1:-1] if len(header) > 2 else header[1:]
        for row in rows[1:]:
            if not row:
                continue
            disease = row[0].strip()
            entries = [s.strip() for s in row[1:1+len(symptom_cols)] if s and s.strip()]
            sset = set(entries)
            if disease:
                diseases[disease] = sset
                all_symptoms.update(sset)
    _disease_symptoms_map = diseases
    if not symptom_list:
        symptom_list = sorted(all_symptoms)


def _predict_by_overlap(input_symptoms: List[str], emotion: str) -> str:
    # Ensure CSV fallback is loaded
    if _disease_symptoms_map is None:
        for csv_path in CSV_FALLBACK_PATHS:
            if os.path.exists(csv_path):
                try:
                    _load_disease_symptoms_from_csv(csv_path)
                    break
                except Exception:
                    continue
    if not _disease_symptoms_map:
        return "General Checkup"
    input_set = set([s.strip() for s in input_symptoms if s and s.strip()])
    if not input_set:
        return "General Checkup"
    best_disease = "General Checkup"
    best_score = -1.0
    for disease, sym_set in _disease_symptoms_map.items():
        if not sym_set:
            continue
        inter = len(input_set & sym_set)
        union = len(input_set | sym_set)
        jaccard = inter / union if union else 0.0
        score = jaccard
        # light emotion heuristic: stress slightly favors conditions commonly stress-related
        if "stress" in emotion or "anxious" in emotion:
            if any(key in disease.lower() for key in ["hypertension", "migraine", "heart"]):
                score += 0.05
        if score > best_score:
            best_score = score
            best_disease = disease
    return best_disease

# ---------------- Request Schema ----------------
class PredictRequest(BaseModel):
    symptoms: List[str]
    emotional_state: str
# ---------------- Routes ----------------
@router.get("/symptoms")
def get_symptoms():
    _load_model_safely()
    print(symptom_list)
    return {"symptoms": sorted(set(symptom_list))}

# ✅ New endpoint to get symptom count
@router.get("/symptom_count")
def get_symptom_count():
    _load_model_safely()
    return {"count": len(symptom_list)}

@router.post("/predict")
def predict_disease(request: PredictRequest):
    _load_model_safely()
    input_symptoms = request.symptoms
    print(input_symptoms)
    emotion = request.emotional_state.lower()

    # --- Normalize symptoms ---
    # Build mapping: "acidity" -> " acidity"
    symptom_map = {s.strip(): s for s in symptom_list}
    normalized_input = [symptom_map.get(s.strip(), s) for s in input_symptoms]

    if not symptom_list:
        # No data available; return a safe default
        predicted_disease = "General Checkup"
    elif model is None or disease_encoder is None:
        # CSV-based heuristic when model is unavailable
        predicted_disease = _predict_by_overlap(normalized_input, emotion)
    else:
        # Create feature vector aligned with model's symptom_list
        symptom_vector = [1 if symptom in normalized_input else 0 for symptom in symptom_list]

        try:
            emotion_encoded = emotion_encoder.transform([emotion])[0]
        except Exception:
            emotion_encoded = 0  # default to neutral

        import pandas as pd
        # Use model’s own feature names if available
        if hasattr(model, "feature_names_in_"):
            expected_columns = list(model.feature_names_in_)
        else:
            expected_columns = symptom_list + ["emotion"]

        input_df = pd.DataFrame(
            [symptom_vector + [emotion_encoded]],
            columns=expected_columns
        )

        prediction_index = model.predict(input_df)[0]
        predicted_disease = disease_encoder.inverse_transform([prediction_index])[0]

    # ---------------- Emotion Insights ----------------
    if "stress" in emotion or "anxious" in emotion:
        emotion_insight = "Stress detected. May contribute to hypertension, migraines, or heart problems."
    elif "sad" in emotion or "depressed" in emotion:
        emotion_insight = "Low emotional state. May reduce immunity and worsen chronic illness."
    elif "happy" in emotion or "relaxed" in emotion:
        emotion_insight = "Positive emotional state! This helps in recovery and well-being."
    else:
        emotion_insight = "Emotion noted. Maintain physical and mental health."

    return {
        "predicted_disease": predicted_disease,
        "emotion_insight": emotion_insight
    }
