# LEXIS

Retrieval-first vocabulary and eloquence trainer. 40 word families, forced sentence production, spaced repetition (1/3/7/16/35/90 days), 15 rhetorical moves.

## Run locally
```bash
npm install
npm run dev
```

## Deploy
Vite + React, static output, no backend, no env vars. Push to GitHub, import into Vercel, done. Vercel auto-detects Vite.

## Data
Progress lives in `localStorage` under `lexis_state_v1`, per-browser. Clearing site data resets progress. No accounts, no server, nothing to leak.

## Structure
Everything is in `src/App.jsx` on purpose: word bank (`BANK`), rhetorical moves (`MOVES`), SRS logic, and UI. To add a word family, append to `BANK` following the existing shape.
