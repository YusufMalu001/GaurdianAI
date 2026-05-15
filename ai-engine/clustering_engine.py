import pandas as pd
import geopandas as gpd
from sklearn.cluster import DBSCAN
import numpy as np
from sqlalchemy import create_engine
import json

DB_URL = "postgresql://postgres:postgrespassword@localhost:5432/guardian_db"

def cluster_crimes():
    print("Connecting to DB to fetch crime incidents...")
    engine = create_engine(DB_URL)
    
    # Normally we'd fetch from DB. For now, we mock if DB is down.
    try:
        query = "SELECT id, incident_type, severity, ST_X(location) as lon, ST_Y(location) as lat FROM crime_incidents"
        df = pd.read_sql(query, engine)
    except Exception as e:
        print("DB connection failed, falling back to local file for clustering simulation...")
        df = pd.read_excel("../Indore_Women_Safety_Enhanced_With_Coordinates.xlsx")
        df = df.rename(columns={'Latitude': 'lat', 'Longitude': 'lon'})
        df['severity'] = 'HIGH' # Mock

    if len(df) == 0:
        print("No data to cluster.")
        return

    # Extract coordinates for clustering
    coords = df[['lat', 'lon']].to_numpy()
    
    # Run DBSCAN (eps in radians for Haversine, or just simple euclidean for small city range)
    # Indore is roughly around lat 22.7, lon 75.8. 
    # 0.01 degrees is ~1km
    db = DBSCAN(eps=0.015, min_samples=5, metric='euclidean').fit(coords)
    df['cluster'] = db.labels_
    
    # Generate Hotspots
    hotspots = []
    for cluster_id in set(db.labels_):
        if cluster_id == -1: continue # Noise
        
        cluster_points = df[df['cluster'] == cluster_id]
        
        # Calculate cluster center
        center_lat = cluster_points['lat'].mean()
        center_lon = cluster_points['lon'].mean()
        crime_count = len(cluster_points)
        
        # Calculate density
        density_level = "HIGH" if crime_count > 20 else ("MEDIUM" if crime_count > 10 else "LOW")
        
        hotspots.append({
            "cluster_id": int(cluster_id),
            "center_lat": center_lat,
            "center_lon": center_lon,
            "crime_count": crime_count,
            "density_level": density_level
        })
    
    print(f"Generated {len(hotspots)} crime hotspots.")
    
    # Save to JSON for backend/frontend use (if DB not available)
    with open("hotspots.json", "w") as f:
        json.dump(hotspots, f, indent=4)
        
    print("Hotspots saved to hotspots.json")

if __name__ == "__main__":
    cluster_crimes()
