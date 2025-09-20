# MERN Blog 

Full-stack MERN blogging platform with JWT auth, MongoDB Atlas, React + Redux Toolkit, and SCSS. Frontend deploys on Vercel; backend can deploy to Render/Railway (or as Vercel Serverless functions optional).

## Apps
- frontend: React + Vite + Redux Toolkit + SCSS
- backend: Node.js + Express + Mongoose + JWT + CORS

## Quick Start

1) Copy env templates and fill values

```
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

2) Install deps

```
npm run install:all
```

3) Run dev (concurrently)

```
npm run dev
```

4) Build both

```
npm run build
```

## Deployment
- Frontend: Vercel (connect `frontend` folder)
- Backend: Render or Railway (connect `backend` folder). Set env vars from `backend/.env.example`.

See Deployment section at bottom for detailed steps.

---

## Folder Structure

```
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    utils/
    app.ts
    server.ts
  package.json
  tsconfig.json
  .env.example
  Procfile

frontend/
  src/
    app/
    features/
    pages/
    components/
    styles/
    main.tsx
    App.tsx
  index.html
  vite.config.ts
  package.json
  .env.example
```

---

## Deployment (Step-by-step)

### MongoDB Atlas
1. Create a free cluster
2. Create a Database User and allow access from 0.0.0.0/0 (or VPC/IPs)
3. Grab the connection string and set `MONGO_URI` in backend env

### Backend on Render
1. Push repo to GitHub
2. In Render, create a new Web Service
3. Select `backend` directory as root
4. Build Command: `npm ci && npm run build`
5. Start Command: `node dist/server.js`
6. Set env vars: `MONGO_URI`, `JWT_SECRET`, `PORT` (optional), `CORS_ORIGIN` (your Vercel domain)

### Backend on Railway
1. New Project -> Deploy from GitHub
2. Select the repo and `backend` as root
3. Railway auto-installs; set variables in Settings -> Variables
4. Start Command: `node dist/server.js`

### Frontend on Vercel
1. New Project -> Import Git Repository
2. Set Root Directory to `frontend`
3. Framework Preset: Vite
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add env `VITE_API_BASE_URL` pointing to backend URL

### Optional: Backend as Vercel Serverless
- Move/duplicate Express handlers into `api/*.ts` with `vercel.json` configured. This repo is set up primarily for Render/Railway for simplicity.


