#!/usr/bin/env node
// Content gate for the Sharpen preview.
//
// Two files are checked: sharpen.json (the practice layer) and
// emotional-net-worth.json (Joe's framework, added 2026-09-11). Both are
// member-facing, so both live under the same four rules: zero Tier 1
// negations, Tier 2 absence framing reported, zero contractions, zero em
// dashes. The lexicon is the vendored copy in tools/lib.
//
// Usage:  node tools/validate.js [--strict]
'use strict';

const fs = require('fs');
const path = require('path');
const A = require('./lib/affirmative.js');

const ROOT = path.join(__dirname, '..');
const strict = process.argv.includes('--strict');
const errors = [];
const warns = [];
const err = (w, m) => errors.push(`${w}: ${m}`);
const warn = (w, m) => warns.push(`${w}: ${m}`);

// JVLF forbids contractions and allows possessives. "'s" is a contraction only
// after these words; everywhere else it belongs to a noun. Mirrors
// findContractions() in the app repo's validate-content.js, which is where this
// distinction was worked out.
const S_CONTRACTION_HEADS = new Set(['it', 'that', 'there', 'here', 'what', 'let', 'she', 'he', 'who', 'where', 'how']);
function findContractions(text) {
  const hits = [];
  const re = /\b([A-Za-z]+)(['’])(t|re|ll|ve|m|d|s)\b/g;
  let m;
  while ((m = re.exec(text))) {
    const head = m[1].toLowerCase();
    if ((m[3] === 's' || m[3] === 'd') && !S_CONTRACTION_HEADS.has(head)) continue; // possessive
    hits.push(m[1] + m[2] + m[3]);
  }
  return hits;
}

// ── The one deliberate carve-out ────────────────────────────────────────────
// Joe's six transformations begin at shame, blame, guilt, fear, anger and
// resentment. Three of those are Tier 2 words, and Tier 2 exists to catch copy
// that paints absence. Here the naming IS the mechanism: the framework's whole
// claim is that an emotion carries information, and that meeting it by name is
// what turns it into an asset. A pair that could never say where it starts
// could never show where it leads.
//
// So the carve-out is as narrow as it can be. It applies to ONE field, the
// `from` of a transformation pair, it is checked against a closed list, and the
// destination and the line beside it are scanned exactly like every other
// string. Tier 1 still blocks here, as everywhere.
const TRANSFORMATION_FROM = new Set([
  'shame', 'blame', 'guilt', 'fear', 'anger', 'resentment',
]);

function checkCopy(where, text, opts) {
  opts = opts || {};
  if (typeof text !== 'string') { err(where, 'expected a string'); return; }
  const neg = A.findNegations(text);
  if (neg.length) err(where, `negation (${A.summarize(neg)}) in "${text}"`);
  if (!opts.allowAbsence) {
    const abs = A.findAbsenceFraming(text);
    if (abs.length) warn(where, `absence framing (${A.summarize(abs)}) in "${text}"`);
  }
  const con = findContractions(text);
  if (con.length) err(where, `contraction (${con.join(', ')}) in "${text}"`);
  if (text.includes('—')) err(where, `em dash in "${text}"`);
}

function read(file) {
  try { return JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8')); }
  catch (e) { err(file, `unreadable: ${e.message}`); return null; }
}

// ── sharpen.json: every string, since the app validator owns the structure ──
const sharpen = read('sharpen.json');
if (sharpen) {
  const walk = (node, p) => {
    if (typeof node === 'string') return checkCopy(`sharpen.json ${p}`, node);
    if (Array.isArray(node)) return node.forEach((v, i) => walk(v, `${p}[${i}]`));
    if (node && typeof node === 'object') {
      for (const [k, v] of Object.entries(node)) walk(v, p ? `${p}.${k}` : k);
    }
  };
  walk(sharpen, '');
  if ((sharpen.circle || {}).size !== 8) err('sharpen.json circle.size', 'eight is the maximum');
}

// ── emotional-net-worth.json ────────────────────────────────────────────────
const enw = read('emotional-net-worth.json');
if (enw) {
  const F = 'emotional-net-worth.json';
  if ((enw.meta || {}).name !== 'The Emotional Net Worth Plan') {
    err(`${F} meta.name`, 'expected "The Emotional Net Worth Plan"');
  }
  ['analogy', 'equation', 'informationLine'].forEach(k => {
    const v = (enw.premise || {})[k];
    if (!v) err(`${F} premise.${k}`, 'missing'); else checkCopy(`${F} premise.${k}`, v);
  });
  // The equation is the spine of the metaphor.
  const eq = (enw.premise || {}).equation || '';
  if (!/Emotional Net Worth *=/.test(eq)) err(`${F} premise.equation`, 'expected the equation to state Emotional Net Worth');
  if (eq.includes('-') && !eq.includes('−')) {
    warn(`${F} premise.equation`, 'uses a hyphen where a true minus sign (−) reads better');
  }

  const assets = enw.assets || [];
  if (assets.length < 8) err(`${F} assets`, `expected at least eight, found ${assets.length}`);
  assets.forEach((a, i) => checkCopy(`${F} assets[${i}]`, a));

  const pairs = (enw.transformations || {}).pairs || [];
  if (pairs.length !== 6) err(`${F} transformations.pairs`, `Joe named six, found ${pairs.length}`);
  checkCopy(`${F} transformations.intro`, (enw.transformations || {}).intro || '');
  const seenFrom = new Set();
  pairs.forEach((t, i) => {
    const w = `${F} transformations.pairs[${i}]`;
    if (!TRANSFORMATION_FROM.has(t.from)) {
      err(`${w}.from`, `expected one of the six Joe named, found ${JSON.stringify(t.from)}`);
    }
    if (seenFrom.has(t.from)) err(`${w}.from`, `duplicate: ${t.from}`);
    seenFrom.add(t.from);
    // The carve-out, applied to exactly this field and nothing else.
    checkCopy(`${w}.from`, t.from, { allowAbsence: true });
    checkCopy(`${w}.to`, t.to);
    checkCopy(`${w}.line`, t.line);
    // A pair that ends where it began has lost the point.
    if (t.from === t.to) err(`${w}`, 'a transformation needs somewhere to go');
  });

  const steps = enw.steps || [];
  if (steps.length !== 6) err(`${F} steps`, `Joe named six, found ${steps.length}`);
  steps.forEach((s, i) => {
    const w = `${F} steps[${i}]`;
    if (s.n !== i + 1) err(`${w}.n`, `expected ${i + 1}, found ${s.n}`);
    ['title', 'line', 'detail'].forEach(k => checkCopy(`${w}.${k}`, s[k]));
    if (!['daily', 'weekly'].includes(s.cadence)) {
      err(`${w}.cadence`, `expected "daily" or "weekly", found ${JSON.stringify(s.cadence)}`);
    }
  });
  // Step six is the weekly one, and the rest are daily deposits.
  const weekly = steps.filter(s => s.cadence === 'weekly').map(s => s.n);
  if (weekly.join(',') !== '6') {
    err(`${F} steps`, `review and rebalance is the weekly step; weekly steps found: ${weekly.join(',') || 'none'}`);
  }

  const ic = enw.innerChild || {};
  ['line', 'note', 'echo'].forEach(k => {
    if (!ic[k]) err(`${F} innerChild.${k}`, 'missing'); else checkCopy(`${F} innerChild.${k}`, ic[k]);
  });
  // The rhyme with the circle's answer is the point, so it is asserted.
  if (ic.line && !/I see you/.test(ic.line)) {
    err(`${F} innerChild.line`, 'the loving internal parent opens with "I see you"');
  }
  const circleAnswer = (((sharpen || {}).restPathways || {}).options || [])
    .filter(o => o.id === 'reach').map(o => o.circleResponse)[0];
  if (circleAnswer && ic.line && !/I see you/.test(circleAnswer)) {
    err(`${F} innerChild.echo`, 'the circle and the inner parent are meant to open with the same words');
  }

  const lay = enw.layering || [];
  if (lay.length !== 4) err(`${F} layering`, `expected four, found ${lay.length}`);
  lay.forEach((l, i) => ['part', 'does'].forEach(k => checkCopy(`${F} layering[${i}].${k}`, l[k])));

  const wr = enw.weeklyReview || {};
  const qs = wr.questions || [];
  if (qs.length !== 5) err(`${F} weeklyReview.questions`, `Joe wrote five, found ${qs.length}`);
  ['title', 'intro', 'placement'].forEach(k => wr[k] && checkCopy(`${F} weeklyReview.${k}`, wr[k]));
  qs.forEach((q, i) => {
    checkCopy(`${F} weeklyReview.questions[${i}]`, q);
    if (!q.trim().endsWith('?')) err(`${F} weeklyReview.questions[${i}]`, 'a review question ends in a question mark');
  });

  (enw.sharpenFit || []).forEach((f, i) =>
    ['piece', 'already'].forEach(k => checkCopy(`${F} sharpenFit[${i}].${k}`, f[k])));
}

// ── report ──────────────────────────────────────────────────────────────────
console.log('\n═ Sharpen content');
if (sharpen) console.log(`  sharpen.json · circle of ${(sharpen.circle || {}).size}`);
if (enw) {
  console.log(`  emotional-net-worth.json · ${(enw.assets || []).length} assets · ` +
    `${((enw.transformations || {}).pairs || []).length} transformations · ` +
    `${(enw.steps || []).length} steps · ${((enw.weeklyReview || {}).questions || []).length} weekly questions`);
}
if (errors.length) {
  console.log(`\n  ${errors.length} error(s):`);
  errors.forEach(e => console.log(`    ✗ ${e}`));
}
if (warns.length) {
  console.log(`\n  ${warns.length} warning(s) for Joe:`);
  warns.forEach(w => console.log(`    · ${w}`));
}
if (!errors.length && !warns.length) console.log('\n  Clean. Structure and language both hold.');

process.exit(errors.length || (strict && warns.length) ? 1 : 0);
