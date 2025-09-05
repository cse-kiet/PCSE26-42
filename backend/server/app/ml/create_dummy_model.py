import pickle
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression

# Symptoms aur diseases
symptom_list = ["fever","cough","headache"]
emotion_encoder = LabelEncoder().fit(["neutral","happy","sad","stressed"])
disease_encoder = LabelEncoder().fit(["flu","cold","migraine"])

# Dummy model training
X = [
    [1,0,0,0],  # fever + neutral
    [0,1,0,1],  # cough + stressed
    [0,0,1,0],  # headache + neutral
]
y = [0,1,2]
model = LogisticRegression()
model.fit(X, y)

# Save pickle
with open("train_model.pkl", "wb") as f:
    pickle.dump({
        "model": model,
        "symptom_list": symptom_list,
        "emotion_encoder": emotion_encoder,
        "disease_encoder": disease_encoder
    }, f)

print("✅ Dummy model created successfully!")
