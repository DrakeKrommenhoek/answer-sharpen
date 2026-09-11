// Affirmative-language lexicon and scanner for The Answer Movement.
//
// VENDORED COPY. The canonical file is tools/lib/affirmative.js in
// the-answer-movement-app, where the month validator, the app-copy audit and
// the Answer bot all import it. This copy exists so this repository can gate
// its own content while Sharpen is still being shaped here.
// Refresh with:
//   cp ../the-answer-movement-app/tools/lib/affirmative.js tools/lib/affirmative.js
//
// JVLF §2 (docs/jvlf.md) — "Affirmative Construction Only":
//   "Instead of describing absence, it declares presence.
//    Instead of referencing limitation, it declares capacity."
//
// This module is the machine-readable form of that rule. It is shared by
// tools/validate-content.js (enforces on month JSON) and tools/audit-copy.js
// (reports on in-app copy).
//
// WHY THIS EXISTS: on 2026-08-28 a Day 28 line reading "not a performance and
// not a streak to protect" reached a founding user's screen. The intent was
// right and the construction was inverted — it painted the very picture it
// meant to rule out. A human reading pass had already missed it twice.
// Operation "No N Word September" is the standing answer: every negation
// particle in month copy is a build-time finding, every week, forever.
//
// Zero dependencies. Node >= 18.
'use strict';

// ── TIER 1 — negation particles ──────────────────────────────────────────────
// These invert a sentence. There is no context in journal-facing copy where
// one of these is the strongest available construction, so `--strict` treats
// every hit as an error. Anything genuinely needing one goes in the allowlist
// with a written reason.
const NEGATION_WORDS = [
  'not', 'no', 'never', 'none', 'nothing', 'nobody', 'no one', 'nowhere',
  'neither', 'nor', 'cannot', 'without', 'lacks', 'lack', 'lacking',
];

// Contracted negations. The contraction scan already flags these on style
// grounds; they are listed here so the negation count is honest either way.
const NEGATION_CONTRACTIONS = [
  "can't", "won't", "don't", "doesn't", "didn't", "isn't", "aren't", "wasn't",
  "weren't", "haven't", "hasn't", "hadn't", "shouldn't", "wouldn't",
  "couldn't", "ain't", "mustn't", "needn't",
];

// ── TIER 2 — absence and limitation framing ──────────────────────────────────
// Grammatically affirmative, imaginatively negative. "Do not let the streak
// break" and "protect the streak from breaking" paint the same picture. These
// warn rather than fail: some are load-bearing domain words (a streak does
// reset; a day is missed) and the call belongs to Joe.
const ABSENCE_WORDS = [
  'fail', 'fails', 'failed', 'failing', 'failure',
  'avoid', 'avoids', 'avoiding', 'refuse', 'refuses',
  'quit', 'quits', 'quitting', 'give up', 'gave up',
  'lose', 'loses', 'losing', 'lost',
  'weak', 'weakness', 'weaker',
  'impossible', 'hardly', 'barely', 'rarely', 'seldom',
  'shame', 'shameful', 'guilt', 'guilty',
  'struggle', 'struggles', 'struggling',
  'doubt', 'doubts', 'fear', 'fears', 'afraid',
  'worry', 'worries', 'worrying',
  'wrong', 'broken', 'punish', 'punishment',
];

// Words whose ordinary sense is affirmative and whose negative twin is a false
// hit. Checked before ABSENCE_WORDS. "Lost in the movement" and "a hard set"
// are the practice, so the scanner stays quiet on them.
const ABSENCE_EXEMPT_PHRASES = [
  'lost in', 'lose yourself', 'losing yourself', 'lose track',
  'work hard', 'hard work', 'hard-won',
];

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Whole-word, case-insensitive, apostrophe-tolerant (straight and curly).
function buildRe(words) {
  const alts = words
    .slice()
    .sort((a, b) => b.length - a.length)      // longest-first so "no one" beats "no"
    .map(w => escapeRe(w).replace(/'/g, "['’]"))
    .join('|');
  return new RegExp(`(?<![\\w'’-])(${alts})(?![\\w'’-])`, 'gi');
}

const NEGATION_RE = buildRe([...NEGATION_WORDS, ...NEGATION_CONTRACTIONS]);
const ABSENCE_RE  = buildRe(ABSENCE_WORDS);

// A hit carries enough context that a reader can judge it without opening the
// file: the word, where it sits, and the clause around it.
function hitsFor(text, re, exemptPhrases) {
  if (typeof text !== 'string' || !text) return [];
  const lower = text.toLowerCase();
  const exemptSpans = [];
  for (const phrase of (exemptPhrases || [])) {
    let from = 0, at;
    while ((at = lower.indexOf(phrase, from)) !== -1) {
      exemptSpans.push([at, at + phrase.length]);
      from = at + 1;
    }
  }
  const out = [];
  re.lastIndex = 0;
  let m;
  while ((m = re.exec(text))) {
    const start = m.index, end = start + m[0].length;
    if (exemptSpans.some(([a, b]) => start >= a && end <= b)) continue;
    out.push({
      word: m[0],
      index: start,
      context: excerpt(text, start, end),
    });
  }
  return out;
}

function excerpt(text, start, end, pad = 34) {
  const a = Math.max(0, start - pad), b = Math.min(text.length, end + pad);
  return (a > 0 ? '…' : '') +
         text.slice(a, start) + '»' + text.slice(start, end) + '«' + text.slice(end, b) +
         (b < text.length ? '…' : '');
}

function findNegations(text) { return hitsFor(text, NEGATION_RE, null); }
function findAbsenceFraming(text) { return hitsFor(text, ABSENCE_RE, ABSENCE_EXEMPT_PHRASES); }

// Render a hit list compactly for one-line reporting.
function summarize(hits) {
  const seen = new Map();
  for (const h of hits) {
    const k = h.word.toLowerCase();
    seen.set(k, (seen.get(k) || 0) + 1);
  }
  return [...seen.entries()].map(([w, n]) => (n > 1 ? `${w} ×${n}` : w)).join(', ');
}

module.exports = {
  NEGATION_WORDS, NEGATION_CONTRACTIONS, ABSENCE_WORDS, ABSENCE_EXEMPT_PHRASES,
  findNegations, findAbsenceFraming, summarize, excerpt,
};
