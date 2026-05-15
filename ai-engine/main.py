from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import pickle
import pandas as pd
import os
from route_optimizer import generate_routes

app = FastAPI(title="Guardian AI Engine - Hackathon Edition", version="2.0.0")

class Location(BaseModel):
    lat: float
    lon: float

class RouteRequest(BaseModel):
    origin: Location
    destination: Location
    time_of_day: str

class ZonePredictionRequest(BaseModel):
    crime_history: float
    time_of_day: float
    crowd_density: float
    route_isolation: float

@app.get("/")
def read_root():
    return {"status": "online", "service": "Guardian AI Engine"}

@app.post("/calculate-route")
def calculate_route(request: RouteRequest):
    routes = generate_routes(
        {"lat": request.origin.lat, "lon": request.origin.lon},
        {"lat": request.destination.lat, "lon": request.destination.lon}
    )
    return {"routes": routes}

@app.post("/predict-zone-danger")
def predict_zone_danger(req: ZonePredictionRequest):
    model_path = "xgboost_danger_model.pkl"
    if not os.path.exists(model_path):
        return {"error": "Model not trained yet. Run train_xgboost.py"}
        
    with open(model_path, "rb") as f:
        model = pickle.load(f)
        
    # Prepare input
    df = pd.DataFrame([{
        'crime_history': req.crime_history,
        'time_of_day': req.time_of_day,
        'crowd_density': req.crowd_density,
        'route_isolation': req.route_isolation
    }])
    
    # Predict probabilities
    prob = model.predict_proba(df)[0]
    danger_prob = float(prob[1]) # Probability of class 1 (Dangerous)
    
    return {
        "danger_probability": danger_prob,
        "classification": "DANGEROUS" if danger_prob > 0.6 else ("RISKY" if danger_prob > 0.3 else "SAFE")
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
