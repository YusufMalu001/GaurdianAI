# GuardianAI - Comprehensive Safety Ecosystem

GuardianAI is an end-to-end, real-time personal safety and risk assessment platform. It combines a mobile application for end-users, a robust Node.js backend, and a Python-powered AI Engine to provide real-time SOS tracking, dynamic safe route optimization, and proactive risk classification.

## 🚀 Features

- **Real-Time SOS Ecosystem**: Immediate emergency triggering with WebSocket-based live GPS tracking.
- **AI-Driven Risk Assessment**: Predictive safety scoring based on historical data, crowd density, and geographical features.
- **Dynamic Safe Routing**: Intelligent route optimization to suggest the safest paths rather than just the fastest.
- **Trusted Contacts**: Automated notifications and live location sharing with designated emergency contacts.
- **Data Simulation & Pipeline**: Robust synthetic data generation and processing for AI model training and testing.

## 🏗️ System Architecture

The project is divided into four main microservices/modules:

### 1. `guardian-app` (Mobile Application)
A cross-platform mobile application built with React Native and Expo.
- **Tech Stack**: React Native, Expo Router, Zustand (State Management), React Native Maps, Expo Location, Socket.IO Client.
- **Role**: Provides the user interface for triggering SOS alerts, viewing safe routes, and managing trusted contacts.

### 2. `backend` (Node.js API & WebSocket Server)
The core backend service connecting the mobile app and the AI engine.
- **Tech Stack**: Node.js, Express, Prisma (PostgreSQL), WebSockets / Socket.IO, JWT Auth.
- **Role**: Manages users, trusted contacts, handles emergency WebSocket connections for real-time tracking, and proxies requests to the AI engine.

### 3. `ai-engine` (Python AI Service)
An intelligent predictive engine exposed via a REST API.
- **Tech Stack**: Python, FastAPI, Scikit-Learn, XGBoost, GeoPandas, NumPy.
- **Role**: Performs safety classification, crowd simulation, and route optimization algorithms.

### 4. `data-pipeline` (Data Management)
Scripts and utilities for handling dataset operations.
- **Tech Stack**: Python, Faker, Pandas.
- **Role**: Generates synthetic demographic and incident data, processes raw datasets, and seeds the PostgreSQL database.

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- PostgreSQL Database
- Expo CLI

### 1. Backend Setup
```bash
cd backend
npm install
# Configure your .env file with DATABASE_URL and JWT_SECRET
npx prisma migrate dev
npm run dev
```

### 2. AI Engine Setup
```bash
cd ai-engine
python -m venv venv
# Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Mobile App Setup
```bash
cd guardian-app
npm install
# Configure your constants with local network IPs for the backend & AI engine
npx expo start
```

### 4. Data Pipeline (Optional)
If you want to seed the database with synthetic testing data:
```bash
cd data-pipeline
pip install -r requirements.txt
python seed_database.py
```

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🛡️ License

Distributed under the MIT License.
