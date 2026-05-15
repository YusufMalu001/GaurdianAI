# Guardian App

## Overview
Expo frontend for the Guardian women safety platform. The mobile app now talks to the separate backend for auth, safety scoring, routing, SOS, and WebSocket alerts.

## Structure
```text
guardian-app/
├── app/              # Expo Router screens
├── components/       # Reusable UI and screen components
├── constants/        # Theme, colors, runtime config
├── hooks/            # App hooks such as location, notifications, safety score
├── services/         # API clients, WebSocket client, GPS tracker
└── store/            # Zustand stores used by the app
```

## Getting Started
```bash
cd guardian-app
npm install
npm start
```

Set these env vars when needed:

- `EXPO_PUBLIC_API_URL`
- `EXPO_PUBLIC_WS_URL`
