import React, { useState } from "react";
import { css, T, S } from "./core.js";
import { supabase } from "./sync.js";

/* ----------------------- LOGIN -----------------------
   Email + password, open signups, email confirmation off.
   Progress made on this device before signing in is kept:
   hydrate() merges the local blob into the account on first login. */

export default function Login() {
  const [mode, setMode] = useState("signin"); // signin | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (busy || !email.trim() || !password) return;
    setBusy(true);
    setError(null);
    // MAGIC LINK SWAP POINT: to switch to magic link later, replace this
    // signInWithPassword/signUp block with
    //   supabase.auth.signInWithOtp({ email })
    // drop the password field above, and show a "check your email" note here.
    const { error: err } =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email: email.trim(), password })
        : await supabase.auth.signUp({ email: email.trim(), password });
    // Success needs no handling: onAuthStateChange in App.jsx picks up the session.
    if (err) setError(err.message);
    setBusy(false);
  };

  return (
    <div className="lexis-root" style={S.root}>
      <style>{css}</style>
      <div style={S.shell}>
        <div className="lexis-fade">
          <div style={{ padding: "56px 0 8px" }}>
            <div style={S.label}>Retrieval-first eloquence training</div>
            <h1 style={S.h1}>Lexis</h1>
          </div>
          <hr style={S.rule} />

          <div style={{ ...S.label, margin: "26px 0 14px" }}>
            {mode === "signin" ? "Sign in · progress follows you" : "Create account · takes ten seconds"}
          </div>

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 380 }}>
            <input
              className="lexis-input"
              style={S.input}
              type="email"
              value={email}
              placeholder="Email"
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="lexis-input"
              style={S.input}
              type="password"
              value={password}
              placeholder="Password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="lexis-btn" style={S.btn(true)} type="submit" disabled={busy || !email.trim() || !password}>
              {busy ? "One moment…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          {error && (
            <p style={{ ...S.small, color: T.accent, marginTop: 14 }}>{error}</p>
          )}

          <p style={{ ...S.small, marginTop: 22 }}>
            {mode === "signin" ? "No account yet?" : "Already have an account?"}{" "}
            <button
              className="lexis-btn"
              style={{ background: "none", border: "none", padding: 0, fontFamily: T.body, fontSize: 13, color: T.accent, textDecoration: "underline" }}
              onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); }}
            >
              {mode === "signin" ? "Create one" : "Sign in"}
            </button>
          </p>

          <hr style={{ ...S.rule, marginTop: 40 }} />
          <p style={{ ...S.small, fontStyle: "italic" }}>
            An account keeps your streak and your ledger on every device. Anything already on this one merges in.
          </p>
        </div>
      </div>
    </div>
  );
}
