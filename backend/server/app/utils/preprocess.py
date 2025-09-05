def get_emotion_insight(emotion: str, disease: str = None):
    insights = {
        "happy": {
            "message": "😊 A positive emotional state enhances immunity and supports recovery.",
            "risk": "Minimal. Continue maintaining emotional well-being."
        },
        "sad": {
            "message": "😔 Sadness may lead to fatigue and suppressed immunity.",
            "risk": "Higher risk of depression, hormonal imbalance, or gut-related issues."
        },
        "stressed": {
            "message": "😣 Stress negatively impacts cardiovascular and nervous systems.",
            "risk": "Increased risk of heart disease, headaches, and mental fatigue."
        },
        "angry": {
            "message": "😠 Anger spikes blood pressure and can worsen existing inflammation.",
            "risk": "Elevated risk of stroke, hypertension, or digestive disorders."
        },
        "anxious": {
            "message": "😟 Anxiety weakens immunity and causes hormonal imbalance.",
            "risk": "Higher risk of insomnia, IBS, and respiratory issues."
        },
        "tired": {
            "message": "😴 Exhaustion signals imbalance and can slow healing.",
            "risk": "Prone to immune deficiency, frequent infections, or chronic fatigue syndrome."
        },
        "neutral": {
            "message": "🙂 Balanced state. Emotional health is stable.",
            "risk": "Continue with regular sleep, hydration, and mental health routines."
        }
    }

    return insights.get(emotion.lower(), {
        "message": "Emotional state not recognized. Try using 'happy', 'sad', 'anxious', etc.",
        "risk": "Unclear risk due to unrecognized emotional input."
    })
