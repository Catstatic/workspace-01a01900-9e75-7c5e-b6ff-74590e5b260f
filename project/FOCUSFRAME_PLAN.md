# 📖 OPERATION FOCUSFRAME — TEAL GOAL BRACKETS & READING TIMER
### a focus mode for the CONTENT section: bracket today's reading goal with two draggable teal lines · auto-estimated timer · click to start
*drafted: 2026-08-13 · status: ✅ BUILT — shipped in R27 (masters ins25_css/ins25_js · 1 registered surgical pair: backup sweep skips fg:* keys so goal state never rides backups · byte-parity PROOF PASSED · 790 unit+smoke assertions green)*

---

## 🧭 THE BRIEF (your words → the spec)

| Your ask (verbatim meaning) | The spec it becomes |
|---|---|
| "focus mode when I am in content section completing today's part" | **FOCUSFRAME toggle** living in the content section header (📖 button + hotkey `Ctrl+F` free — final bind at build; stays out of the way when off) |
| "a teal line which will be opener and closer of the part we are gonna cover" | **Two teal lines** — `GOAL START` (top) and `GOAL END` (bottom) — full-width, 2px teal with a soft glow, always labeled |
| "I must be able to move the teal line down or up to how much ever" | **Free drag** (mouse + touch), and arrow-key nudge for precision; lines **snap to block boundaries** — they can rest between paragraphs/cards, never slicing mid-sentence; START can never cross END |
| "whatever is enclosed in that teal line will be my set goal to complete today" | The enclosed region = **today's goal**, persisted per content-item (survives reload; own localStorage key, never in backup payloads — house rule) |
| "timer based on content between these teal lines… adjusts on how big or small the content is" | Timer chip **recomputes live** every drop: more text → more minutes, instantly |
| "timer must be set at average reading speed" | **Reading model** (below) — WPM default + per-figure/equation loading, because physics notes aren't a novel |
| "when I click on timer then my reading time has started" | Chip click = **state machine**: `READY (≈ your estimate) → RUNNING → tap pauses → target reached = DONE state` — gentle, no hard cutoff |
| "content between the teal lines must be coloured with faded teal… highly faded… but I must see it's there" | **Whisper tint**: goal region background = teal at ~6% alpha (readable first, visible second); nothing else changes |
| "don't change the colour of letters and titles" | **Typing untouched** — zero color/typography overrides on text, titles, links; ONLY a background layer. Enforced by test (computed text colors identical with feature ON vs OFF) |

---

## 🎚️ THE READING MODEL (how "≈ 24 MIN" gets computed)

```
minutes = words/WPM  +  20s × display-equations
                     +  15s × figures
                     +  10s × worked-example blocks
clamp: 1 … 180 min · WPM default 200, chip dropdown: 120 / 160 (study pace) / 200 / 260
```
- Word count from the enclosed blocks' real text.
- WPM + display values tunable once, remembered; if it consistently over/under-shoots for you, one tweak fixes every future goal.
- Estimate shown BEFORE start ("≈ 24 MIN — click to start"), so you size the bracket to the time you actually have today.

## 🟩 THE LOOK (locked)

- Lines: `2px` teal (matches tracker accent family), 65% opacity soft glow, tiny `⠿` grab handle + label chip (`GOAL START ▲ / GOAL END ▼`).
- Tint: `rgba(teal, 0.06)` background on enclosed blocks — a ±3-step strength slider in the chip (default = whisper).
- Chip: floats docked to the END line (moves with it), shows state: `≈ 24 MIN · CLICK TO START` → `18:32 left · 5:41 read` (running shows countdown + elapsed) → `⏸ paused` → `✔ goal window done`.
- When it finishes it doesn't scream — one soft toast + chip turns "done" state. No alarms, no popups.

## 💾 STATES & MEMORY

```
OFF        → toggle on → brackets appear at last-saved (or content top/bottom first time)
SET        → lines placed, chip shows estimate
RUNNING    → click started; elapsed persists across reloads (crash-safe)
PAUSED     → re-click
DONE       → elapsed ≥ estimate; "MARK COMPLETE" clears the bracket and logs the session
```
- Goal is **per content item**: switch topics → each remembers its own bracket.
- Completed sessions can log into the existing **focus panel history** (one optional wiring, flagged at build).

## 🛠️ BUILD SHAPE (house rules)

- One new master block pair (CSS + JS), ids/classes `fg-` prefixed; zero surgical base edits.
- Drag engine: pointer events, block-walk snapping, live recount on `pointerup` (and throttled during drag).
- a11y: lines are `role="slider"` with aria-valuetext = block position; keyboard-arrow nudge; respects reduced-motion (glow pulse off).
- Nothing loads anything: no network, no AI, no new dependencies.

## ✅ PROOF BATTERY (per house standard)

- **Unit**: estimate math (WPM rounding, figure/equation adders, clamps) · snap enforcement (never mid-block, START < END always) · state machine transitions · persistence round-trip · WPM-change recompute.
- **jsdom smoke**: mount on a content fixture → brackets render → programmatic drag → tint lands ONLY on enclosed blocks → computed **text colors unchanged** (your explicit red line, tested) → timer text == estimate math → click starts → reload restores.
- **House battery**: byte-parity PROOF PASSED + full script syntax sweep + every existing unit/smoke stays green.

## 🙏 WHAT I NEED FROM YOU (defaults exist — answer only if you have opinions)

| # | Item | Default if silent |
|---|---|---|
| 1 | Default reading speed | 200 WPM (study pace 160 available in chip) |
| 2 | Tint strength | whisper (~6% alpha), ± slider built in |
| 3 | Chip dock | rides the END line (always visible while reading) |
| 4 | Hotkey | `Ctrl+F` if free in tracker, else `Ctrl+J` — I'll pick a non-colliding pair at build |

> One line to light it: **"BUILD FOCUSFRAME"** (optional tweaks after you see it — this one is small enough to forge in a single round and show, not stage-gate).
