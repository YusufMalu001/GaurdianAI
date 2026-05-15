import os
import pandas as pd
import psycopg2
from psycopg2.extras import execute_values
import json

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "guardian_db")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASS = os.getenv("DB_PASS", "postgrespassword")

def connect_db():
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS
        )
        return conn
    except Exception as e:
        print(f"Error connecting to DB: {e}")
        return None

def seed_crimes(conn, csv_path):
    df = pd.read_csv(csv_path)
    # Ensure columns match DB
    cursor = conn.cursor()
    
    insert_query = """
    INSERT INTO crime_incidents (incident_type, severity, description, reported_at, location, source)
    VALUES %s
    """
    
    # We use ST_SetSRID(ST_MakePoint(longitude, latitude), 4326) for PostGIS
    values = []
    for _, row in df.iterrows():
        # format: (incident_type, severity, description, reported_at, ST_GeomFromText, source)
        values.append((
            row['incident_type'],
            row['severity'],
            row['description'],
            row['reported_at'],
            f"SRID=4326;POINT({row['longitude']} {row['latitude']})",
            row['source']
        ))
        
    execute_values(cursor, insert_query, values)
    conn.commit()
    print(f"Seeded {len(df)} crime incidents.")

def seed_crowds(conn, csv_path):
    df = pd.read_csv(csv_path)
    cursor = conn.cursor()
    
    insert_query = """
    INSERT INTO crowd_density_zones (zone_name, density_level, footfall_estimate, boundary)
    VALUES %s
    """
    
    values = []
    for _, row in df.iterrows():
        # creating a small synthetic bounding box around the point
        lat, lon = row['latitude'], row['longitude']
        offset = 0.005 # approx 500m
        poly = f"SRID=4326;POLYGON(({lon-offset} {lat-offset}, {lon+offset} {lat-offset}, {lon+offset} {lat+offset}, {lon-offset} {lat+offset}, {lon-offset} {lat-offset}))"
        
        values.append((
            row['zone_name'],
            row['density_level'],
            row['footfall_estimate'],
            poly
        ))
        
    execute_values(cursor, insert_query, values)
    conn.commit()
    print(f"Seeded {len(df)} crowd zones.")

if __name__ == "__main__":
    conn = connect_db()
    if conn:
        print("Connected to database. Seeding data...")
        output_dir = os.path.join(os.path.dirname(__file__), "output")
        crime_csv = os.path.join(output_dir, "synthetic_crime_data.csv")
        crowd_csv = os.path.join(output_dir, "synthetic_crowd_data.csv")
        
        if os.path.exists(crime_csv):
            seed_crimes(conn, crime_csv)
        else:
            print("Crime CSV not found.")
            
        if os.path.exists(crowd_csv):
            seed_crowds(conn, crowd_csv)
        else:
            print("Crowd CSV not found.")
            
        conn.close()
        print("Seeding complete.")
    else:
        print("Could not seed database because connection failed.")
