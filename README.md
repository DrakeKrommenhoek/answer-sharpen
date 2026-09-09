# Sharpen

**A twenty-eight day challenge you take with one person.**

An interactive preview, built for Joe in September 2026. Five minutes, best on a
phone. It ends with five open questions.

`index.html` is the page. `sharpen.json` is its content, fetched at runtime, so
the preview and the shipping content stay in step rather than drifting.

No build step, no dependencies, no analytics.

**`sharpen.json` here is a copy.** The canonical file is
`content/sharpen.json` in `the-answer-movement-app`, where it is gated by
`tools/validate-sharpen.js` and by weekly-audit check 8. Refresh with
`cp content/sharpen.json ../answer-sharpen/sharpen.json`.

---

## What Sharpen is

The daily practice in The Answer Movement stays exactly as it is: the workout,
the letter, the one action. Sharpen sits beside it and holds one other person.

- **You keep your own 28 days.** Two individual streaks, side by side, never
  sorted. Each survives the other resting.
- **One number belongs to both.** The days you both showed up. It climbs and it
  holds. It travels in one direction, so it can never become something to defend
  or to lie about.
- **Day 28 arrives together**, because every member is already on the same
  calendar day.

Vocabulary: you **Sharpen** with a partner, inside a **Circle** of eight, held by
an **Anchor** who is a member one cycle further along.

## The four rules the design is built on

1. **Presence, and presence alone.** You see the day a friend showed up. A quiet
   day stays quiet, and the screen keeps their place.
2. **Nothing breakable is jointly owned.**
3. **Appreciation is the only thing you can send.** No nudge, no reminder, no
   prod.
4. **The journal never leaves the phone.** A first name, a date and a number are
   the only things that would ever travel.

## Why this lives in its own repository

The main app registers a service worker at **root scope**, and its navigation
handler serves the app shell for every path except one hardcoded exception. Any
HTML page added to that origin is served the app instead of itself for anyone who
has the PWA installed, and that includes the branch preview URLs, since opening a
preview root installs the same service worker there.

This repository gives the preview an origin where **no service worker has ever
been registered**, which is the only reliable guarantee. Verified end to end.

## Safety

- Writes **zero** storage keys. Opening it leaves a real member's practice,
  streak and grace days exactly as they were.
- Registers no service worker.
- The practice day is **computed from the date, never typed.**
- All copy passes the affirmative rule: zero Tier 1 negations.

## Deploying

Import into Vercel and accept the defaults. There is no framework and no
configuration: it serves one static file from the repository root, so the bare
domain is the preview.

## Related

The research behind every decision here, plus the build plan, live in
`the-answer-movement-app` under `docs/research/` and `docs/plans/`.
