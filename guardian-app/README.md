# Guardian – AI Women Safety App

## 🛡️ Overview
**Guardian** is a futuristic AI-powered women safety application built with **React Native (Expo)** for the mobile frontend and **Node.js + Express + WebSocket** for the backend.

---

## 📂 Project Structure
```
guardian-app/
├── app/              # Expo Router screens (Auth, Onboarding, Tabs, SOS)
├── components/       # Reusable UI, Map, SOS, Dashboard components
├── constants/        # Colors, Theme, Routes, Config
├── hooks/            # useLocation, useSafetyScore, useEmergency, useNotifications
├── store/            # Zustand state stores (auth, user, safety, route)
├── services/         # API clients, WebSocket, AI risk prediction, GPS tracker
├── backend/          # Express + WebSocket server
└── database/         # PostgreSQL schema
```

---

## 🚀 Getting Started

### Frontend (Expo)
```bash
cd guardian-app
npm install
npm run web        # Run on browser (localhost:8081)
npm run android    # Run on Android emulator
npm run ios        # Run on iOS simulator
```

### Backend
```bash
cd guardian-app/backend
npm install
npm run dev        # Runs on localhost:3001
```

---

## 🎨 Design System
| Token | Value |
|---|---|
| Primary BG | `#050505` |
| Purple | `#7B2FF7` |
| Pink | `#FF2E88` |
| Cyan | `#00E5C3` |
| Danger | `#FF3B3B` |

---

## 📱 Screens
| # | Screen | Route |
|---|---|---|
| 1 | Splash | `/` |
| 2 | Onboarding | `/onboarding/screen1–3` |
| 3 | Login | `/(auth)/login` |
| 4 | Register | `/(auth)/register` |
| 5 | Dashboard | `/(tabs)/home` |
| 6 | Safe Map | `/(tabs)/map` |
| 7 | Heatmap | `/(tabs)/heatmap` |
| 8 | AI Insights | `/(tabs)/insights` |
| 9 | Profile | `/(tabs)/profile` |
| 10 | SOS Emergency | `/sos/emergency` |
| 11 | Notifications | `/notifications` |
| 12 | Settings | `/settings` |
| 13 | Offline Mode | `/offline-mode` |

---

## 🔑 Key Features
- **AI Safety Score** – Real-time area risk assessment
- **SOS Button** – 3-second hold triggers emergency alert
- **Live Tracking** – GPS streaming via WebSocket
- **Community Heatmap** – Crowdsourced incident mapping (Leaflet)
- **AI Insights** – Weekly trend analytics (Chart.js)
- **Offline Mode** – Works without internet for emergency SOS

---

## 🛠️ Tech Stack
| Layer | Technology |
|---|---|
| Mobile | React Native + Expo Router |
| State | Zustand |
| Maps | Leaflet.js (web iframe) |
| Charts | Chart.js |
| Backend | Node.js + Express + WebSocket (ws) |
| Database | PostgreSQL |
| Auth | JWT + bcrypt |
