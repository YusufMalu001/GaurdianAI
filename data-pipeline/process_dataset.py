import pandas as pd
import geopandas as gpd
from shapely.geometry import Point
from sqlalchemy import create_engine
import datetime

DB_URL = "postgresql://postgres:postgrespassword@localhost:5432/guardian_db"

def determine_severity(crime_type):
    critical = ['Rape / Gang Rape', 'Murder', 'Kidnapping', 'Acid Attack']
    high = ['Robbery', 'Assault', 'Domestic Violence', 'Sexual Harassment']
    medium = ['Theft', 'Snatching', 'Stalking', 'Cyber Crime']
    low = ['Pickpocketing', 'Verbal Abuse', 'Eve Teasing']
    
    ct_upper = str(crime_type).upper()
    for c in critical:
        if c.upper() in ct_upper: return 'CRITICAL'
    for c in high:
        if c.upper() in ct_upper: return 'HIGH'
    for c in medium:
        if c.upper() in ct_upper: return 'MEDIUM'
    return 'LOW'

def process_dataset():
    print("Loading dataset...")
    df = pd.read_excel("../Indore_Women_Safety_Enhanced_With_Coordinates.xlsx")
    
    # Drop rows without coordinates just in case
    df = df.dropna(subset=['Latitude', 'Longitude'])
    
    print(f"Loaded {len(df)} records. Processing...")
    
    records = []
    for idx, row in df.iterrows():
        # Create timestamp from year and random month/day (assuming synthetic data)
        # Or just use current timestamp for hackathon demo
        reported_at = datetime.datetime(int(row['Year']), 6, 15, 12, 0, 0)
        
        severity = determine_severity(row['Crime Type'])
        desc = f"Area: {row['Area / Location']}. Time: {row['High Risk Time']} ({row['Peak Hours']}). Lighting: {row['Lighting Condition']}. Notes: {row['Notes / Source']}"
        
        records.append({
            'incident_type': str(row['Crime Type']),
            'severity': severity,
            'description': desc,
            'reported_at': reported_at,
            'source': 'SYNTHETIC_DATASET',
            'latitude': float(row['Latitude']),
            'longitude': float(row['Longitude'])
        })
    
    processed_df = pd.DataFrame(records)
    
    # Convert to GeoDataFrame
    geometry = [Point(xy) for xy in zip(processed_df.longitude, processed_df.latitude)]
    gdf = gpd.GeoDataFrame(processed_df, geometry=geometry)
    gdf.set_crs(epsg=4326, inplace=True)
    
    print("Connecting to DB...")
    engine = create_engine(DB_URL)
    
    # We will use raw SQL to insert so we match the init.sql schema perfectly
    print("Inserting into database...")
    with engine.begin() as conn:
        # Clear existing synthetic data to avoid duplicates if re-run
        conn.execute("DELETE FROM crime_incidents WHERE source = 'SYNTHETIC_DATASET'")
        
        for idx, row in gdf.iterrows():
            geom_wkt = row['geometry'].wkt
            conn.execute(f"""
                INSERT INTO crime_incidents (incident_type, severity, description, reported_at, location, source)
                VALUES (%s, %s, %s, %s, ST_GeomFromText(%s, 4326), %s)
            """, (row['incident_type'], row['severity'], row['description'], row['reported_at'], geom_wkt, row['source']))
            
    print("Data ingestion complete!")

if __name__ == "__main__":
    process_dataset()
