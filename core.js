import { BANK } from "./bank.js";

/* ----------------------- SRS + STATE ----------------------- */

export const INTERVALS = [1, 3, 7, 16, 35, 90];
export const STORAGE_KEY = "lexis_state_v1";
export const DAILY_NEW = 5;
export const FLOOR_NEW = 1;

export function todayStr(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}
export function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}
export function addDays(dateStr, n) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export const emptyState = {
  words: {},        // id -> { learnedOn, stage, nextDue, lapses, sentences: [] }
  history: {},      // dateStr -> { newWords, reviews }
  movesSeen: [],    // move ids in order seen
  lastActive: null,
};

export async function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    return { ...emptyState };
  } catch (e) {
    // Private-browsing modes can block storage; run memory-only rather than crash.
    return { ...emptyState, _memoryOnly: true };
  }
}
export async function saveState(state) {
  try {
    const { _memoryOnly, ...clean } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
  } catch (e) { /* non-fatal: quota or private mode */ }
}

export function computeStreak(history) {
  let streak = 0;
  let day = todayStr();
  const active = (d) => history[d] && (history[d].newWords > 0 || history[d].reviews > 0);
  if (!active(day)) day = todayStr(-1); // today not done yet doesn't break streak
  while (active(day)) {
    streak += 1;
    day = addDays(day, -1);
  }
  return streak;
}

export function dueReviews(state) {
  const t = todayStr();
  return Object.entries(state.words)
    .filter(([, w]) => w.nextDue <= t)
    .map(([id]) => id)
    .sort((a, b) => state.words[a].nextDue.localeCompare(state.words[b].nextDue));
}

export function unlearnedFamilies(state) {
  return BANK.filter((f) => !state.words[f.id]);
}

/* Sentence gate: require one family member (with naive suffix tolerance) */
export function familyMatch(text, family) {
  const lower = " " + text.toLowerCase() + " ";
  for (const m of family.members) {
    const base = m.w.toLowerCase().replace(/\s*\(.*\)/, "");
    const stems = [base];
    if (base.endsWith("e")) stems.push(base.slice(0, -1)); // temper->tempering ok anyway; elide->eliding
    for (const s of stems) {
      const re = new RegExp("\\b" + s.replace(/[-]/g, "\\-") + "(s|es|ed|d|ing|ly|ity|ness)?\\b", "i");
      if (re.test(lower)) return m.w;
    }
  }
  return null;
}

/* ----------------------- STYLES ----------------------- */

export const css = `
  @keyframes lexisFade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
  .lexis-root { animation: lexisFade .5s cubic-bezier(.22,1,.36,1); }
  .lexis-fade { animation: lexisFade .45s cubic-bezier(.22,1,.36,1); }
  .lexis-btn { transition: background .18s ease-out, color .18s ease-out, border-color .18s ease-out, opacity .18s; cursor: pointer; }
  .lexis-btn:hover:not(:disabled) { opacity: .85; }
  .lexis-btn:disabled { opacity: .35; cursor: default; }
  .lexis-input:focus { outline: none; border-color: #973c2b !important; }
  .lexis-row:hover { background: rgba(151,60,43,0.05); }
`;

export const T = {
  paper: "#f5f0e6",
  paperDeep: "#ece5d6",
  ink: "#241f1a",
  faded: "#6f665a",
  faint: "#a2988a",
  rule: "#d8cfbd",
  accent: "#973c2b",
  green: "#3d5c50",
  display: 'Didot, "Bodoni MT", "Playfair Display", "Times New Roman", serif',
  body: '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif',
};

export const S = {
  root: { background: T.paper, minHeight: "100vh", color: T.ink, fontFamily: T.body, padding: "0 20px 80px" },
  shell: { maxWidth: 640, margin: "0 auto" },
  label: { fontFamily: T.body, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: T.faded },
  rule: { border: "none", borderTop: `1px solid ${T.rule}`, margin: "20px 0" },
  h1: { fontFamily: T.display, fontWeight: 400, fontSize: 52, letterSpacing: "0.04em", margin: "0" },
  btn: (primary) => ({
    fontFamily: T.body, fontSize: 15, padding: "13px 22px",
    background: primary ? T.ink : "transparent",
    color: primary ? T.paper : T.ink,
    border: `1px solid ${T.ink}`, borderRadius: 2,
  }),
  btnAccent: { fontFamily: T.body, fontSize: 15, padding: "13px 22px", background: T.accent, color: T.paper, border: `1px solid ${T.accent}`, borderRadius: 2 },
  small: { fontSize: 13, color: T.faded },
  textarea: {
    width: "100%", boxSizing: "border-box", minHeight: 96, padding: 14,
    fontFamily: T.body, fontSize: 16, lineHeight: 1.55, color: T.ink,
    background: "#fbf8f1", border: `1px solid ${T.rule}`, borderRadius: 2, resize: "vertical",
  },
  input: {
    width: "100%", boxSizing: "border-box", padding: "12px 14px",
    fontFamily: T.body, fontSize: 17, color: T.ink,
    background: "#fbf8f1", border: `1px solid ${T.rule}`, borderRadius: 2,
  },
};

