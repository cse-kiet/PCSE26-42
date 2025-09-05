import pandas as pd
import numpy as np
import pickle
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import os
import argparse

def train_model(data_path, model_path):
    print(f"Loading dataset from {data_path}...")
    data = pd.read_csv(data_path)

    symptom_columns = data.columns[1:-1]
    all_symptoms = set()
    for col in symptom_columns:
        all_symptoms.update(data[col].dropna().unique())
    all_symptoms = sorted(all_symptoms)

    print(f"Extracted {len(all_symptoms)} unique symptoms.")

    for symptom in all_symptoms:
        data[symptom] = data[symptom_columns].apply(lambda row: int(symptom in row.values), axis=1)

    data['emotion'] = 'neutral'

    emotion_encoder = LabelEncoder()
    data['emotion_encoded'] = emotion_encoder.fit_transform(data['emotion'])

    X = data[list(all_symptoms) + ['emotion_encoded']]
    y = data['Disease']

    disease_encoder = LabelEncoder()
    y_encoded = disease_encoder.fit_transform(y)

    X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

    print(f"Training model on {len(X_train)} samples...")
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)

    print("✅ Accuracy:", clf.score(X_test, y_test) * 100)
    print(classification_report(y_test, clf.predict(X_test)))

    model_data = {
        "model": clf,
        "symptom_list": list(all_symptoms),
        "emotion_encoder": emotion_encoder,
        "disease_encoder": disease_encoder
    }

    os.makedirs(os.path.dirname(model_path), exist_ok=True)

    with open(model_path, "wb") as f:
        pickle.dump(model_data, f)

    print(f"💾 Model saved to {model_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--data', type=str, required=True, help='Path to Symptom2Disease CSV dataset')
    parser.add_argument('--model_path', type=str, default="server/app/models/disease_model.pkl", help="Path to save trained model")
    args = parser.parse_args()

    train_model(args.data, args.model_path)
