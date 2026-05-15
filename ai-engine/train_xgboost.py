import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pickle

def train_model():
    print("Preparing synthetic dataset for AI training...")
    # Generate synthetic training data for danger probability prediction
    np.random.seed(42)
    n_samples = 5000
    
    # Features
    crime_history = np.random.uniform(0, 1, n_samples)
    time_of_day = np.random.uniform(0, 24, n_samples)
    crowd_density = np.random.uniform(0, 1, n_samples)
    route_isolation = np.random.uniform(0, 1, n_samples)
    
    # Target function (Danger Probability)
    # Higher crime history, late night (time_of_day near 0-4 or 20-24), high isolation = High Danger
    night_factor = np.where((time_of_day < 5) | (time_of_day > 21), 0.8, 0.2)
    danger_prob = (crime_history * 0.4) + (night_factor * 0.3) + (route_isolation * 0.4) - (crowd_density * 0.2)
    danger_prob = np.clip(danger_prob, 0, 1)
    
    # Labels for binary classification (Dangerous > 0.6)
    labels = (danger_prob > 0.6).astype(int)
    
    X = pd.DataFrame({
        'crime_history': crime_history,
        'time_of_day': time_of_day,
        'crowd_density': crowd_density,
        'route_isolation': route_isolation
    })
    y = labels
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training XGBoost Model...")
    model = xgb.XGBClassifier(eval_metric='logloss')
    model.fit(X_train, y_train)
    
    preds = model.predict(X_test)
    accuracy = accuracy_score(y_test, preds)
    print(f"Model trained. Validation Accuracy: {accuracy * 100:.2f}%")
    
    # Save the model
    with open("xgboost_danger_model.pkl", "wb") as f:
        pickle.dump(model, f)
    print("Model saved to xgboost_danger_model.pkl")

if __name__ == "__main__":
    train_model()
