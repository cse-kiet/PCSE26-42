from pydantic import BaseModel
from typing import List, Optional

class PredictionRequest(BaseModel):
    symptoms: List[str]
    other_symptoms: Optional[str] = None
    emotion: str

class PredictionResponse(BaseModel):
    predicted_disease: str
    emotion_insights: str
