import pandas as pd
import json

def calculate_safety_score(crime_density, violent_crime_weight, night_crime_weight, crowd_activity, police_proximity):
    """
    SafetyScore = 100 - (CrimeDensity * 25) - (ViolentCrimeWeight * 30) - (NightCrimeWeight * 20) + (CrowdActivity * 10) + (PoliceProximity * 15)
    """
    score = 100 - (crime_density * 25) - (violent_crime_weight * 30) - (night_crime_weight * 20) + (crowd_activity * 10) + (police_proximity * 15)
    return max(0, min(100, score)) # Clamp between 0 and 100

def classify_zone(score):
    if score >= 75:
        return "SAFE"
    elif score >= 45:
        return "RISKY"
    else:
        return "DANGEROUS"

def generate_safety_zones():
    # Load hotspots
    try:
        with open("hotspots.json", "r") as f:
            hotspots = json.load(f)
    except FileNotFoundError:
        print("Run clustering_engine.py first.")
        return

    zones = []
    for hs in hotspots:
        # Synthesize weights based on density for demonstration
        crime_density = min(1.0, hs['crime_count'] / 50.0) 
        violent_crime_weight = 0.5 if hs['density_level'] == 'HIGH' else 0.2
        night_crime_weight = 0.6
        crowd_activity = 0.8 if hs['density_level'] == 'LOW' else 0.3
        police_proximity = 0.5
        
        score = calculate_safety_score(crime_density, violent_crime_weight, night_crime_weight, crowd_activity, police_proximity)
        classification = classify_zone(score)
        
        zones.append({
            "zone_id": hs['cluster_id'],
            "center_lat": hs['center_lat'],
            "center_lon": hs['center_lon'],
            "safety_score": round(score, 2),
            "classification": classification,
            # Create a simple bounding box or radius for GeoJSON polygon
            "radius_km": 1.0 + (crime_density * 2) 
        })
    
    with open("safety_zones.json", "w") as f:
        json.dump(zones, f, indent=4)
        
    print(f"Generated {len(zones)} safety zones. Saved to safety_zones.json")

if __name__ == "__main__":
    generate_safety_zones()
