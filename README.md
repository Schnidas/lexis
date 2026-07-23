# LEXIS

Retrieval-first vocabulary and eloquence trainer. 40 word families, forced sentence production, spaced repetition (1/3/7/16/35/90 days), 15 rhetorical moves.

## Run locally
```bash
npm install
cp .env.local.example .env.local   # fill in the two Supabase values
npm run dev
```

## Deploy
Vite + React, static output, hosted on Vercel. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel → Project Settings → Environment Variables **before** deploying — the build passes without them but the live app breaks at runtime.

## Accounts & sync
Auth and storage are Supabase (email + password, open signups, email confirmation off). Setup, one time:

1. Create a Supabase project, run `supabase-setup.sql` in the SQL editor. It creates the single `user_state` table (one jsonb row per user), enables RLS with per-user policies, and adds the PostgREST grants that projects created after 2026-05-30 require.
2. Turn off email confirmation: Authentication → Sign In / Up → Email → disable "Confirm email".
3. Put the project URL and anon key in `.env.local` (local) and Vercel env vars (prod). The anon key is public by design; the `service_role` key must never appear in this repo or the frontend.
4. Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` as GitHub Actions secrets — `.github/workflows/keepalive.yml` pings the REST API daily so the free-tier project doesn't pause after 7 idle days.

## Data
`localStorage` (`lexis_state_v1`) stays as the fast local cache and first paint; Supabase is the source of truth. On login the local and remote blobs are merged monotonically (progress only goes up — see `mergeState` in `core.js`) and written back to both. After that, local writes are immediate and remote writes are debounced ~1.2s, with a flush on sign-out and `beforeunload`.

## Structure
Flat at the repo root, no `src/`: `core.js` (SRS logic, state, merge, styles), `bank.js`/`bank-a.js`/`bank-b.js` (word families), `moves.js` (rhetorical moves), `screens.jsx` (UI screens), `Login.jsx` (auth screen), `sync.js` (Supabase client + sync), `App.jsx` (shell + auth gate). To add a word family, append to the bank following the existing shape.
