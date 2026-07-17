import React, { useState, useEffect } from "react";
import { BANK } from "./bank.js";
import { MOVES } from "./moves.js";
import {
  INTERVALS, DAILY_NEW, FLOOR_NEW, todayStr, addDays,
  loadState, saveState, dueReviews, unlearnedFamilies, css, T, S,
} from "./core.js";
import { Home, ReviewCard, LearnCard, MoveCard, Done, Ledger } from "./screens.jsx";

/* ----------------------- APP ----------------------- */

export default function App() {
  const [state, setState] = useState(null);
  const [screen, setScreen] = useState("home"); // home | session | ledger | done
  const [queue, setQueue] = useState({ reviews: [], learns: [], move: null });
  const [pos, setPos] = useState({ phase: "review", i: 0 });
  const [summary, setSummary] = useState({ reviews: 0, learned: [], sentences: [], move: null });

  useEffect(() => { loadState().then(setState); }, []);
  useEffect(() => { if (state) saveState(state); }, [state]);

  if (!state) {
    return (
      <div style={{ ...S.root, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{css}</style>
        <div style={{ fontFamily: T.display, fontSize: 28, color: T.faded }}>Lexis</div>
      </div>
    );
  }

  const bumpHistory = (field) => {
    setState((prev) => {
      const t = todayStr();
      const day = prev.history[t] || { newWords: 0, reviews: 0 };
      return { ...prev, history: { ...prev.history, [t]: { ...day, [field]: day[field] + 1 } }, lastActive: t };
    });
  };

  const begin = (mode) => {
    const reviews = dueReviews(state);
    const fresh = unlearnedFamilies(state);
    const nNew = mode === "review" ? 0 : mode === "floor" ? FLOOR_NEW : DAILY_NEW;
    const learns = fresh.slice(0, nNew).map((f) => f.id);
    const revCap = mode === "floor" ? reviews.slice(0, 3) : reviews;
    const move = mode === "review" ? null : MOVES[state.movesSeen.length % MOVES.length];
    setQueue({ reviews: revCap, learns, move });
    setSummary({ reviews: 0, learned: [], sentences: [], move: move ? move.name : null });
    setPos({ phase: revCap.length > 0 ? "review" : learns.length > 0 ? "learn" : "move", i: 0 });
    setScreen("session");
  };

  const advance = (phase, i) => {
    const { reviews, learns, move } = queue;
    if (phase === "review" && i + 1 < reviews.length) return setPos({ phase, i: i + 1 });
    if (phase === "review" || (phase === "learn" && false)) {
      if (learns.length > 0 && phase === "review") return setPos({ phase: "learn", i: 0 });
    }
    if (phase === "learn" && i + 1 < learns.length) return setPos({ phase: "learn", i: i + 1 });
    if ((phase === "review" || phase === "learn") && move) return setPos({ phase: "move", i: 0 });
    finish();
  };

  const finish = () => {
    if (queue.move) {
      setState((prev) => prev.movesSeen.includes(queue.move.id) && prev.movesSeen[prev.movesSeen.length - 1] === queue.move.id
        ? prev
        : { ...prev, movesSeen: [...prev.movesSeen, queue.move.id] });
    }
    setScreen("done");
  };

  const onReview = (id, correct) => {
    setState((prev) => {
      const w = prev.words[id];
      const stage = correct ? Math.min(w.stage + 1, INTERVALS.length - 1) : 0;
      return {
        ...prev,
        words: { ...prev.words, [id]: { ...w, stage, lapses: w.lapses + (correct ? 0 : 1), nextDue: addDays(todayStr(), INTERVALS[stage]) } },
      };
    });
    bumpHistory("reviews");
    setSummary((s) => ({ ...s, reviews: s.reviews + 1 }));
    advance("review", pos.i);
  };

  const onLearn = (id, sentence) => {
    setState((prev) => ({
      ...prev,
      words: { ...prev.words, [id]: { learnedOn: todayStr(), stage: 0, nextDue: addDays(todayStr(), INTERVALS[0]), lapses: 0, sentences: [sentence] } },
    }));
    bumpHistory("newWords");
    const fam = BANK.find((f) => f.id === id);
    setSummary((s) => ({ ...s, learned: [...s.learned, fam.head], sentences: [...s.sentences, sentence] }));
    advance("learn", pos.i);
  };

  const byId = (id) => BANK.find((f) => f.id === id);

  return (
    <div className="lexis-root" style={S.root}>
      <style>{css}</style>
      <div style={S.shell}>
        {screen === "home" && <Home state={state} begin={begin} browse={() => setScreen("ledger")} />}
        {screen === "ledger" && <Ledger state={state} home={() => setScreen("home")} />}
        {screen === "done" && <Done summary={summary} home={() => setScreen("home")} />}
        {screen === "session" && (
          <div style={{ paddingTop: 40 }}>
            {pos.phase === "review" && queue.reviews[pos.i] && (
              <ReviewCard
                family={byId(queue.reviews[pos.i])}
                index={pos.i} total={queue.reviews.length}
                onResult={(ok) => onReview(queue.reviews[pos.i], ok)}
              />
            )}
            {pos.phase === "learn" && queue.learns[pos.i] && (
              <LearnCard
                family={byId(queue.learns[pos.i])}
                index={pos.i} total={queue.learns.length}
                onDone={(sentence) => onLearn(queue.learns[pos.i], sentence)}
              />
            )}
            {pos.phase === "move" && queue.move && (
              <MoveCard move={queue.move} onDone={finish} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
