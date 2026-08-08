# Luxury Spa Booking Platform

Production-ready MERN monorepo for a luxury spa booking platform.

## Folders

- `frontend` - React, Vite, TypeScript, and TailwindCSS UI.
- `backend` - Node.js, Express, and TypeScript API.

## Phase 1 Commands

```bash
npm install
npm run dev:frontend
npm run dev:backend
npm run lint
npm run typecheck
npm run build
```

## Backend Database

The backend supports MongoDB for booking data.

1. Add MongoDB connection string in `backend/.env`:

```bash
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net
MONGODB_DB_NAME=kavi-dall-spa
```

2. Start backend:

```bash
npm run dev:backend
```

If `MONGODB_URI` is empty, bookings still work with temporary in-memory storage.
