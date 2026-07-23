import { createClient } from "@supabase/supabase-js";
import { loadState, saveState, mergeState } from "./core.js";

/* ----------------------- SUPABASE SYNC -----------------------
   localStorage stays the fast local cache and first paint.
   Supabase is the source of truth: one row per user in `user_state`,
   the whole state blob as jsonb. Merge is monotonic (see mergeState). */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "[lexis] Missing Supabase config: " +
      [!SUPABASE_URL && "VITE_SUPABASE_URL", !SUPABASE_ANON_KEY && "VITE_SUPABASE_ANON_KEY"]
        .filter(Boolean)
        .join(" and ") +
      " not set. Auth and sync will not work. " +
      "Locally: copy .env.local.example to .env.local and fill it in. " +
      "On Vercel: set both in Project Settings → Environment Variables (the VITE_ prefix is required)."
  );
}

// Placeholder values keep createClient from throwing at import time when the
// env vars are missing; every request then fails visibly instead of cryptically.
export const supabase = createClient(
  SUPABASE_URL || "https://missing-env-var.invalid",
  SUPABASE_ANON_KEY || "missing-env-var"
);

/* Read the remote blob for a user. Returns null if no row yet. */
export async function loadRemote(userId) {
  const { data, error } = await supabase
    .from("user_state")
    .select("state")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    console.error("[lexis] loadRemote failed:", error.message);
    return null;
  }
  return data ? data.state : null;
}

/* Upsert the whole blob for a user (one row per user, keyed on user_id). */
export async function saveRemote(userId, state) {
  const { _memoryOnly, ...clean } = state;
  const { error } = await supabase
    .from("user_state")
    .upsert(
      { user_id: userId, state: clean, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );
  if (error) console.error("[lexis] saveRemote failed:", error.message);
}

/* Hydrate on login: read local, read remote, merge monotonically,
   write the merged result back to both sides, return it. */
export async function hydrate(userId) {
  const local = await loadState();
  const remote = await loadRemote(userId);
  const merged = mergeState(local, remote);
  await saveState(merged);
  await saveRemote(userId, merged);
  return merged;
}

/* Debounced remote write: local writes are immediate (saveState),
   remote writes coalesce so a burst of reviews is one upsert. */
const DEBOUNCE_MS = 1200;
let timer = null;
let pending = null;

export function persist(userId, state) {
  pending = { userId, state };
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    const p = pending;
    pending = null;
    saveRemote(p.userId, p.state);
  }, DEBOUNCE_MS);
}

/* Immediate write, cancelling any pending debounce. Use on sign-out
   and beforeunload so the last few seconds of work are not lost. */
export function flush(userId, state) {
  if (timer) clearTimeout(timer);
  timer = null;
  pending = null;
  return saveRemote(userId, state);
}
