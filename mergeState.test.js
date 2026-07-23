// Throwaway spec for mergeState. No test runner needed:
//   node mergeState.test.js
import assert from "node:assert/strict";
import { mergeState } from "./core.js";

const word = (over = {}) => ({
  learnedOn: "2026-07-01", stage: 1, nextDue: "2026-07-10", lapses: 0, sentences: ["s1"], ...over,
});

let n = 0;
const test = (name, fn) => { fn(); n += 1; console.log(`  ok ${n}. ${name}`); };

test("higher stage wins (either side)", () => {
  const a = { words: { w: word({ stage: 3, nextDue: "2026-08-01" }) } };
  const b = { words: { w: word({ stage: 1, nextDue: "2026-09-09" }) } };
  assert.equal(mergeState(a, b).words.w.stage, 3);
  assert.equal(mergeState(a, b).words.w.nextDue, "2026-08-01");
  assert.equal(mergeState(b, a).words.w.stage, 3);
});

test("stage tie broken by later nextDue", () => {
  const a = { words: { w: word({ stage: 2, nextDue: "2026-07-10" }) } };
  const b = { words: { w: word({ stage: 2, nextDue: "2026-07-20" }) } };
  assert.equal(mergeState(a, b).words.w.nextDue, "2026-07-20");
  assert.equal(mergeState(b, a).words.w.nextDue, "2026-07-20");
});

test("sentences union, no duplicates", () => {
  const a = { words: { w: word({ sentences: ["one", "two"] }) } };
  const b = { words: { w: word({ sentences: ["two", "three"] }) } };
  assert.deepEqual(mergeState(a, b).words.w.sentences, ["one", "two", "three"]);
});

test("disjoint words union", () => {
  const a = { words: { x: word() } };
  const b = { words: { y: word({ stage: 4 }) } };
  const m = mergeState(a, b);
  assert.deepEqual(Object.keys(m.words).sort(), ["x", "y"]);
  assert.equal(m.words.y.stage, 4);
});

test("earliest learnedOn kept, max lapses", () => {
  const a = { words: { w: word({ learnedOn: "2026-06-01", lapses: 2, stage: 0 }) } };
  const b = { words: { w: word({ learnedOn: "2026-07-01", lapses: 5, stage: 3 }) } };
  const m = mergeState(a, b);
  assert.equal(m.words.w.learnedOn, "2026-06-01");
  assert.equal(m.words.w.lapses, 5);
});

test("history takes max per date, unions dates", () => {
  const a = { history: { "2026-07-01": { newWords: 5, reviews: 2 }, "2026-07-02": { newWords: 1, reviews: 0 } } };
  const b = { history: { "2026-07-01": { newWords: 3, reviews: 9 }, "2026-07-03": { newWords: 0, reviews: 4 } } };
  assert.deepEqual(mergeState(a, b).history, {
    "2026-07-01": { newWords: 5, reviews: 9 },
    "2026-07-02": { newWords: 1, reviews: 0 },
    "2026-07-03": { newWords: 0, reviews: 4 },
  });
});

test("movesSeen union preserves order, longer list is base", () => {
  const a = { movesSeen: ["m1", "m2", "m3"] };
  const b = { movesSeen: ["m2", "m4"] };
  assert.deepEqual(mergeState(a, b).movesSeen, ["m1", "m2", "m3", "m4"]);
  assert.deepEqual(mergeState(b, a).movesSeen, ["m1", "m2", "m3", "m4"]);
});

test("lastActive is the later of the two", () => {
  assert.equal(mergeState({ lastActive: "2026-07-01" }, { lastActive: "2026-07-15" }).lastActive, "2026-07-15");
  assert.equal(mergeState({ lastActive: "2026-07-15" }, { lastActive: null }).lastActive, "2026-07-15");
});

test("null / undefined inputs do not throw", () => {
  assert.doesNotThrow(() => mergeState(null, null));
  assert.doesNotThrow(() => mergeState(undefined, { words: { w: word() } }));
  const m = mergeState(null, { words: { w: word() }, lastActive: "2026-07-01" });
  assert.equal(m.words.w.stage, 1);
  assert.deepEqual(mergeState(null, null), { words: {}, history: {}, movesSeen: [], lastActive: null });
});

test("re-merging an already-merged state is stable (idempotent)", () => {
  const a = {
    words: { x: word({ stage: 2 }), y: word({ sentences: ["a"] }) },
    history: { "2026-07-01": { newWords: 2, reviews: 3 } },
    movesSeen: ["m1", "m2"],
    lastActive: "2026-07-01",
  };
  const b = {
    words: { y: word({ stage: 5, sentences: ["b"] }), z: word() },
    history: { "2026-07-01": { newWords: 4, reviews: 1 } },
    movesSeen: ["m3"],
    lastActive: "2026-07-11",
  };
  const m1 = mergeState(a, b);
  assert.deepEqual(mergeState(m1, m1), m1);   // self-merge is a no-op
  assert.deepEqual(mergeState(m1, b), m1);    // re-applying an input changes nothing
  assert.deepEqual(mergeState(m1, a), m1);
});

console.log(`\nAll ${n} mergeState tests passed.`);
