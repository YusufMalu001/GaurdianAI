import random
import math
import json

def simulate_crowd_and_isolation(hour_of_day, location_type):
    """
    Simulates crowd density and isolation score based on time of day and location type.
    Location Types: 'COMMERCIAL', 'RESIDENTIAL', 'HIGHWAY', 'MARKET'
    """
    # Base density
    density = 0.0
    isolation = 1.0
    
    if location_type == 'MARKET':
        # High activity in evening, low at night
        if 10 <= hour_of_day <= 21:
            density = random.uniform(0.7, 1.0)
            isolation = random.uniform(0.0, 0.2)
        else:
            density = random.uniform(0.0, 0.2)
            isolation = random.uniform(0.7, 1.0)
            
    elif location_type == 'COMMERCIAL':
        # Office rush hours
        if 8 <= hour_of_day <= 11 or 17 <= hour_of_day <= 20:
            density = random.uniform(0.6, 0.9)
            isolation = random.uniform(0.1, 0.3)
        elif 11 < hour_of_day < 17:
            density = random.uniform(0.4, 0.6)
            isolation = random.uniform(0.3, 0.5)
        else:
            density = random.uniform(0.0, 0.1)
            isolation = random.uniform(0.8, 1.0)
            
    elif location_type == 'HIGHWAY':
        # Consistent low density, high isolation especially at night
        density = random.uniform(0.1, 0.3)
        if 22 <= hour_of_day or hour_of_day <= 5:
            isolation = 1.0
        else:
            isolation = random.uniform(0.5, 0.8)
            
    elif location_type == 'RESIDENTIAL':
        # Steady medium/low activity
        if 6 <= hour_of_day <= 22:
            density = random.uniform(0.3, 0.5)
            isolation = random.uniform(0.4, 0.6)
        else:
            density = random.uniform(0.0, 0.1)
            isolation = random.uniform(0.7, 0.9)
            
    return {
        "hour": hour_of_day,
        "location_type": location_type,
        "crowd_density": round(density, 2),
        "isolation_score": round(isolation, 2)
    }

def generate_city_wide_simulation():
    # Simulate a few representative zones in Indore for the hackathon
    zones = [
        {"name": "Rajwada (Market)", "type": "MARKET", "lat": 22.7196, "lon": 75.8577},
        {"name": "Vijay Nagar (Commercial)", "type": "COMMERCIAL", "lat": 22.7533, "lon": 75.8937},
        {"name": "Super Corridor (Highway)", "type": "HIGHWAY", "lat": 22.7485, "lon": 75.8271},
        {"name": "Sudama Nagar (Residential)", "type": "RESIDENTIAL", "lat": 22.6961, "lon": 75.8361}
    ]
    
    simulation_results = []
    
    for zone in zones:
        for hour in range(0, 24):
            sim = simulate_crowd_and_isolation(hour, zone['type'])
            sim['zone_name'] = zone['name']
            sim['lat'] = zone['lat']
            sim['lon'] = zone['lon']
            simulation_results.append(sim)
            
    with open("crowd_simulation.json", "w") as f:
        json.dump(simulation_results, f, indent=4)
        
    print(f"Generated {len(simulation_results)} simulated crowd points across 24 hours.")

if __name__ == "__main__":
    generate_city_wide_simulation()
