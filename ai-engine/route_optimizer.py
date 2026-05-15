import random
import math

def calculate_route_safety_score(crowd_density, lighting_score, police_access, crime_probability, isolation_score):
    """
    RouteSafetyScore = (CrowdDensity * 0.25) + (LightingScore * 0.15) + (PoliceAccess * 0.15) - (CrimeProbability * 0.30) - (IsolationScore * 0.15)
    """
    score = (crowd_density * 0.25) + (lighting_score * 0.15) + (police_access * 0.15) - (crime_probability * 0.30) - (isolation_score * 0.15)
    # Normalize roughly to 0-100 scale for UI
    normalized = min(100, max(0, (score + 0.45) * 100))
    return normalized

def generate_routes(origin, destination):
    """
    Simulates a routing engine (e.g., A* or OSRM) by generating a fastest and a safer route.
    """
    dist_km = math.sqrt((origin['lat'] - destination['lat'])**2 + (origin['lon'] - destination['lon'])**2) * 111
    base_time_mins = max(5, int(dist_km * 3))

    # 1. Fastest Route (Direct but risky)
    fastest_route = {
        "type": "FASTEST",
        "time_mins": base_time_mins,
        "risk_level": "HIGH",
        "safety_score": 42.5,
        "metrics": {
            "crowd_density": 0.2,
            "lighting_score": 0.4,
            "police_access": 0.3,
            "crime_probability": 0.8,
            "isolation_score": 0.7
        },
        "path": [
            {"lat": origin['lat'], "lon": origin['lon']},
            {"lat": (origin['lat'] + destination['lat'])/2 + 0.005, "lon": (origin['lon'] + destination['lon'])/2},
            {"lat": destination['lat'], "lon": destination['lon']}
        ]
    }
    
    # 2. Safer Route (Longer but safe)
    safe_metrics = {
        "crowd_density": 0.8,
        "lighting_score": 0.9,
        "police_access": 0.8,
        "crime_probability": 0.1,
        "isolation_score": 0.2
    }
    safer_score = calculate_route_safety_score(**safe_metrics)
    
    safer_route = {
        "type": "SAFER",
        "time_mins": base_time_mins + 4, # 4 mins longer
        "risk_level": "LOW",
        "safety_score": safer_score,
        "safety_improvement": f"+{int(safer_score - fastest_route['safety_score'])}%",
        "metrics": safe_metrics,
        "path": [
            {"lat": origin['lat'], "lon": origin['lon']},
            {"lat": (origin['lat'] + destination['lat'])/2 - 0.015, "lon": (origin['lon'] + destination['lon'])/2 + 0.01}, # Detour through safe area
            {"lat": destination['lat'], "lon": destination['lon']}
        ]
    }

    return [fastest_route, safer_route]

if __name__ == "__main__":
    res = generate_routes({"lat": 22.7, "lon": 75.8}, {"lat": 22.75, "lon": 75.85})
    print(res)
