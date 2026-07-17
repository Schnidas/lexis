import React, { useState, useEffect, useRef } from "react";
import { BANK } from "./bank.js";
import { MOVES } from "./moves.js";
import {
  INTERVALS, DAILY_NEW, FLOOR_NEW, todayStr,
  computeStreak, dueReviews, unlearnedFamilies, familyMatch, T, S,
} from "./core.js";

/* ----------------------- UI PIECES ----------------------- */

export function Label({ children, style }) {
  return <div style={{ ...S.label, ...style }}>{children}</div>;
}

export function Progress({ current, total }) {
  return (
    <div style={{ display: "flex", gap: 5, margin: "4px 0 26px" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          height: 2, flex: 1,
          background: i < current ? T.accent : T.rule,
          transition: "background .3s ease-out",
        }} />
      ))}
    </div>
  );
}

/* ----------------------- SCREENS ----------------------- */

export function Home({ state, begin, browse }) {
  const streak = computeStreak(state.history);
  const due = dueReviews(state).length;
  const learned = Object.keys(state.words).length;
  const remaining = BANK.length - learned;
  const todayDone = state.history[todayStr()];

  return (
    <div className="lexis-fade">
      <div style={{ padding: "56px 0 8px" }}>
        <Label>Retrieval-first eloquence training</Label>
        <h1 style={S.h1}>Lexis</h1>
      </div>
      <hr style={S.rule} />

      <div style={{ display: "flex", gap: 36, margin: "26px 0 34px", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontFamily: T.display, fontSize: 40 }}>{streak}</div>
          <Label>day streak</Label>
        </div>
        <div>
          <div style={{ fontFamily: T.display, fontSize: 40, color: due > 0 ? T.accent : T.ink }}>{due}</div>
          <Label>due for review</Label>
        </div>
        <div>
          <div style={{ fontFamily: T.display, fontSize: 40 }}>{learned}<span style={{ fontSize: 20, color: T.faint }}> / {BANK.length}</span></div>
          <Label>families acquired</Label>
        </div>
      </div>

      {todayDone && (todayDone.newWords > 0 || todayDone.reviews > 0) && (
        <p style={{ ...S.small, marginBottom: 20 }}>
          Today so far: {todayDone.newWords} new, {todayDone.reviews} reviewed. Momentum held.
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 380 }}>
        <button className="lexis-btn" style={S.btn(true)} onClick={() => begin("full")}
          disabled={remaining === 0 && due === 0}>
          Full session · {Math.min(DAILY_NEW, remaining)} new{due > 0 ? ` + ${due} reviews` : ""}
        </button>
        <button className="lexis-btn" style={S.btn(false)} onClick={() => begin("floor")}
          disabled={remaining === 0 && due === 0}>
          Floor day · {Math.min(FLOOR_NEW, remaining)} word, three minutes
        </button>
        {due > 0 && (
          <button className="lexis-btn" style={S.btn(false)} onClick={() => begin("review")}>
            Reviews only · {due}
          </button>
        )}
        <button className="lexis-btn" style={{ ...S.btn(false), border: `1px solid ${T.rule}`, color: T.faded }} onClick={browse}>
          The ledger · words and moves
        </button>
      </div>

      {state._memoryOnly && (
        <p style={{ ...S.small, marginTop: 24, color: T.accent }}>
          Your browser is blocking storage (private mode?). Progress will not persist; switch to a normal window.
        </p>
      )}

      <hr style={{ ...S.rule, marginTop: 40 }} />
      <p style={{ ...S.small, fontStyle: "italic" }}>
        Rule one: a missed day is never made up. Rule two: on bad days, take the floor. The streak is the product.
      </p>
    </div>
  );
}

/* --- Review card: retrieval, not recognition --- */
export function ReviewCard({ family, onResult, index, total }) {
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [auto, setAuto] = useState(null); // 'exact' | 'family' | null
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current && inputRef.current.focus(); }, [family.id]);

  const check = () => {
    const a = answer.trim().toLowerCase();
    if (!a) return;
    if (a === family.head.toLowerCase()) setAuto("exact");
    else if (family.members.some((m) => m.w.toLowerCase().replace(/\s*\(.*\)/, "") === a)) setAuto("family");
    else setAuto(null);
    setRevealed(true);
  };

  return (
    <div className="lexis-fade" key={family.id}>
      <Label>Retrieve · {index + 1} of {total}</Label>
      <Progress current={index} total={total} />

      <p style={{ fontSize: 14, color: T.faded, margin: "0 0 6px" }}>{family.pos} · one word:</p>
      <p style={{ fontFamily: T.display, fontSize: 26, lineHeight: 1.3, margin: "0 0 24px" }}>
        “{family.core}”
      </p>

      {!revealed ? (
        <>
          <input
            ref={inputRef}
            className="lexis-input"
            style={S.input}
            value={answer}
            placeholder="Pull it from memory. First letter: it starts with “"
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && check()}
          />
          <p style={{ ...S.small, marginTop: 8 }}>Hint: begins with “{family.head[0]}”. Any word from the family counts.</p>
          <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
            <button className="lexis-btn" style={S.btn(true)} onClick={check} disabled={!answer.trim()}>Check</button>
            <button className="lexis-btn" style={{ ...S.btn(false), border: `1px solid ${T.rule}`, color: T.faded }}
              onClick={() => { setAuto(null); setRevealed(true); }}>
              I don't have it
            </button>
          </div>
        </>
      ) : (
        <>
          <hr style={S.rule} />
          <div style={{ fontFamily: T.display, fontSize: 34, color: auto ? T.green : T.accent }}>{family.head}</div>
          {auto === "family" && <p style={S.small}>You gave a family member. That counts; the neighborhood is the goal.</p>}
          <p style={{ fontSize: 15, color: T.faded, margin: "10px 0 0", fontStyle: "italic" }}>{family.example}</p>
          <div style={{ marginTop: 22, display: "flex", gap: 10 }}>
            {auto ? (
              <button className="lexis-btn" style={S.btnAccent} onClick={() => onResult(true)}>Next</button>
            ) : (
              <>
                <button className="lexis-btn" style={S.btn(true)} onClick={() => onResult(true)}>I had it</button>
                <button className="lexis-btn" style={S.btn(false)} onClick={() => onResult(false)}>Missed it · reset to tomorrow</button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* --- Learn card: family + forced sentence --- */
export function LearnCard({ family, onDone, index, total }) {
  const [sentence, setSentence] = useState("");
  const matched = familyMatch(sentence, family);
  const wordCount = sentence.trim().split(/\s+/).filter(Boolean).length;
  const ready = matched && wordCount >= 6;

  return (
    <div className="lexis-fade" key={family.id}>
      <Label>Acquire · {index + 1} of {total}</Label>
      <Progress current={index} total={total} />

      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <span style={{ fontFamily: T.display, fontSize: 44 }}>{family.head}</span>
        <span style={{ ...S.small, fontStyle: "italic" }}>{family.pos}</span>
      </div>
      <p style={{ fontSize: 18, margin: "6px 0 20px" }}>{family.core}</p>

      <Label style={{ marginBottom: 10 }}>The family · learn the distinctions</Label>
      <div>
        {family.members.map((m) => (
          <div key={m.w} className="lexis-row" style={{ display: "flex", gap: 14, padding: "9px 6px", borderTop: `1px solid ${T.rule}` }}>
            <span style={{ minWidth: 118, fontWeight: 700, fontSize: 15 }}>{m.w}</span>
            <span style={{ fontSize: 15, color: T.faded }}>{m.n}</span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 15, fontStyle: "italic", color: T.faded, margin: "18px 0" }}>{family.example}</p>
      <p style={{ fontSize: 14, color: T.accent, margin: "0 0 22px" }}>◆ {family.tip}</p>

      <hr style={S.rule} />
      <Label style={{ marginBottom: 8 }}>Now produce it · this is the part that counts</Label>
      <p style={{ ...S.small, margin: "0 0 10px" }}>
        Write one real sentence, about your actual life or work, using any word from this family. Six words minimum. No sentence, no next word.
      </p>
      <textarea
        className="lexis-input"
        style={S.textarea}
        value={sentence}
        onChange={(e) => setSentence(e.target.value)}
        placeholder={`A sentence about The Den, The Helix, the market, anything real...`}
      />
      <p style={{ ...S.small, marginTop: 8, color: matched ? T.green : T.faint }}>
        {matched ? `Detected: “${matched}”` : "No family word detected yet"} · {wordCount} words
      </p>
      <button className="lexis-btn" style={{ ...S.btnAccent, marginTop: 14 }} disabled={!ready}
        onClick={() => onDone(sentence.trim())}>
        Locked in · next
      </button>
    </div>
  );
}

/* --- Move card --- */
export function MoveCard({ move, onDone }) {
  return (
    <div className="lexis-fade">
      <Label>Today's rhetorical move</Label>
      <div style={{ fontFamily: T.display, fontSize: 34, margin: "10px 0 14px" }}>{move.name}</div>
      <p style={{ fontSize: 16, lineHeight: 1.55 }}>{move.what}</p>
      <div style={{ background: T.paperDeep, padding: "16px 18px", borderRadius: 2, margin: "18px 0" }}>
        <Label style={{ marginBottom: 6 }}>The frame</Label>
        <p style={{ margin: 0, fontSize: 15 }}>{move.frame}</p>
      </div>
      <Label style={{ marginBottom: 6 }}>In the wild</Label>
      <p style={{ fontSize: 15, fontStyle: "italic", color: T.faded }}>{move.example}</p>
      <p style={{ ...S.small, marginTop: 16 }}>Assignment: use this move once, out loud, in a real conversation today.</p>
      <button className="lexis-btn" style={{ ...S.btn(true), marginTop: 18 }} onClick={onDone}>Finish session</button>
    </div>
  );
}

/* --- Done --- */
export function Done({ summary, home }) {
  return (
    <div className="lexis-fade" style={{ paddingTop: 60 }}>
      <Label>Session complete</Label>
      <div style={{ fontFamily: T.display, fontSize: 44, margin: "8px 0 20px" }}>Good.</div>
      <p style={{ fontSize: 16 }}>
        {summary.reviews > 0 && <>Retrieved <b>{summary.reviews}</b> from memory. </>}
        {summary.learned.length > 0 && <>Acquired <b>{summary.learned.length}</b> new: {summary.learned.join(", ")}. </>}
        {summary.move && <>Move of the day: <b>{summary.move}</b>.</>}
      </p>
      {summary.sentences.length > 0 && (
        <>
          <hr style={S.rule} />
          <Label style={{ marginBottom: 10 }}>What you wrote today</Label>
          {summary.sentences.map((s, i) => (
            <p key={i} style={{ fontSize: 15, fontStyle: "italic", color: T.faded, margin: "8px 0" }}>“{s}”</p>
          ))}
        </>
      )}
      <button className="lexis-btn" style={{ ...S.btn(true), marginTop: 26 }} onClick={home}>Back to the desk</button>
    </div>
  );
}

/* --- Ledger: browse acquired words + all moves --- */
export function Ledger({ state, home }) {
  const [tab, setTab] = useState("words");
  const learned = Object.keys(state.words);
  return (
    <div className="lexis-fade" style={{ paddingTop: 40 }}>
      <Label>The ledger</Label>
      <div style={{ display: "flex", gap: 18, margin: "14px 0 6px" }}>
        {["words", "moves"].map((t) => (
          <button key={t} className="lexis-btn"
            style={{ background: "none", border: "none", padding: "4px 0", fontFamily: T.display, fontSize: 26,
              color: tab === t ? T.ink : T.faint, borderBottom: tab === t ? `2px solid ${T.accent}` : "2px solid transparent" }}
            onClick={() => setTab(t)}>
            {t === "words" ? `Words · ${learned.length}` : `Moves · ${MOVES.length}`}
          </button>
        ))}
      </div>
      <hr style={S.rule} />

      {tab === "words" && (
        learned.length === 0
          ? <p style={S.small}>Nothing acquired yet. The ledger fills as you work.</p>
          : BANK.filter((f) => state.words[f.id]).map((f) => {
              const w = state.words[f.id];
              return (
                <div key={f.id} style={{ padding: "14px 0", borderBottom: `1px solid ${T.rule}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontFamily: T.display, fontSize: 22 }}>{f.head}</span>
                    <span style={{ ...S.small }}>next review {w.nextDue} · stage {w.stage + 1}/{INTERVALS.length}</span>
                  </div>
                  <p style={{ ...S.small, margin: "4px 0 0" }}>{f.core}</p>
                  {w.sentences.slice(-1).map((s, i) => (
                    <p key={i} style={{ fontSize: 14, fontStyle: "italic", color: T.faded, margin: "6px 0 0" }}>“{s}”</p>
                  ))}
                </div>
              );
            })
      )}

      {tab === "moves" && MOVES.map((m) => (
        <div key={m.id} style={{ padding: "14px 0", borderBottom: `1px solid ${T.rule}` }}>
          <span style={{ fontFamily: T.display, fontSize: 22 }}>{m.name}</span>
          <p style={{ ...S.small, margin: "4px 0 0" }}>{m.what}</p>
          <p style={{ fontSize: 14, color: T.accent, margin: "6px 0 0" }}>{m.frame}</p>
        </div>
      ))}

      <button className="lexis-btn" style={{ ...S.btn(false), marginTop: 26 }} onClick={home}>Back</button>
    </div>
  );
}

