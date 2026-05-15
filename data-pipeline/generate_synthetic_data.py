import pandas as pd
import numpy as np
import json
import os
from faker import Faker
import random
from datetime import datetime, timedelta

fake = Faker()

# Define bounding boxes for cities
CITIES = {
    "Indore": {"lat_min": 22.6, "lat_max": 22.8, "lon_min": 75.8, "lon_max": 76.0},
    "Delhi": {"lat_min": 28.5, "lat_max": 28.8, "lon_min": 77.0, "lon_max": 77.3},
    "Mumbai": {"lat_min": 18.9, "lat_max": 19.2, "lon_min": 72.8, "lon_max": 73.0},
    "Bangalore": {"lat_min": 12.8, "lat_max": 13.1, "lon_min": 77.5, "lon_max": 77.8}
}

INCIDENT_TYPES = ['Robbery', 'Assault', 'Harassment', 'Kidnapping', 'Theft', 'Cyber Crime', 'Accident']
SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

def random_coordinates(city):
    bounds = CITIES[city]
    lat = random.uniform(bounds["lat_min"], bounds["lat_max"])
    lon = random.uniform(bounds["lon_min"], bounds["lon_max"])
    return lat, lon

def generate_crime_incidents(num_records=500):
    records = []
    for _ in range(num_records):
        city = random.choice(list(CITIES.keys()))
        lat, lon = random_coordinates(city)
        # Weight incidents towards night time
        hour = np.random.choice(
            np.arange(24), 
            p=[0.08]*5 + [0.02]*13 + [0.05]*6 # higher prob 0-4am and 18-23pm
        )
        date = fake.date_between(start_date='-1y', end_date='today')
        dt = datetime(date.year, date.month, date.day, hour, random.randint(0, 59))
        
        records.append({
            "incident_type": random.choice(INCIDENT_TYPES),
            "severity": random.choice(SEVERITIES),
            "description": fake.sentence(),
            "reported_at": dt.strftime('%Y-%m-%d %H:%M:%S'),
            "latitude": lat,
            "longitude": lon,
            "city": city,
            "source": random.choice(['NCRB_MOCK', 'USER_REPORT'])
        })
    return pd.DataFrame(records)

def generate_crowd_zones(num_records=200):
    records = []
    for _ in range(num_records):
        city = random.choice(list(CITIES.keys()))
        lat, lon = random_coordinates(city)
        density = random.choice(['LOW', 'MEDIUM', 'HIGH'])
        if density == 'LOW':
            footfall = random.randint(0, 50)
        elif density == 'MEDIUM':
            footfall = random.randint(51, 200)
        else:
            footfall = random.randint(201, 1000)
            
        records.append({
            "zone_name": f"{city} Sector {random.randint(1, 100)}",
            "density_level": density,
            "footfall_estimate": footfall,
            "latitude": lat,
            "longitude": lon,
            "city": city
        })
    return pd.DataFrame(records)

if __name__ == "__main__":
    output_dir = os.path.join(os.path.dirname(__file__), "output")
    os.makedirs(output_dir, exist_ok=True)
    
    print("Generating synthetic crime data...")
    crimes_df = generate_crime_incidents(1000)
    crimes_df.to_csv(os.path.join(output_dir, "synthetic_crime_data.csv"), index=False)
    
    print("Generating synthetic crowd zones...")
    crowd_df = generate_crowd_zones(500)
    crowd_df.to_csv(os.path.join(output_dir, "synthetic_crowd_data.csv"), index=False)
    
    print("Generation complete! Data saved to data-pipeline/output/")
