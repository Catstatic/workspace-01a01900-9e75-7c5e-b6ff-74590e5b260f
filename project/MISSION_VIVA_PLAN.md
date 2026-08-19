# 🚀 MISSION VIVA — SCIENTIST INTERVIEW COMMAND SYSTEM
### a single self-contained HTML for ISRO · DRDO · BARC interviews — open file, train, walk in, conquer
*drafted: 2026-08-13 · status: blueprint locked, awaiting green light · codename: OP LIFTOFF · build style: stepwise, one file, zero network, zero logins*

---

## 🎖️ THE PHILOSOPHY

> Panels at these three organizations don't test *coverage* — they test **depth-under-pressure**:
> fundamentals at first principle, **"why?" asked five times in a row**, YOUR final-year project, composure, and whether you've bothered to learn what the organization actually does.
> So the app is not a question reader. It is a **sparring partner + armory + mission computer**, trained on the exact anatomy of these three panels.

**Honesty clause (binding, printed in-app too):** no file can *guarantee* a selection — panels are live humans. What MISSION VIVA guarantees is that going through it end-to-end covers *everything trainable*: content, structure, delivery, composure, logistics. If it's trainable, it's in here.

---

## 🧬 THE THREE PANELS — anatomy (verified against official portals at build stage S0)

| | **ISRO** (ICRB / Scientist-SC) | **DRDO** (RAC / CEPTAM tracks) | **BARC** (OCES/DGFS) |
|---|---|---|---|
| Gate to interview | GATE/own written shortlist (per cycle) | GATE/NET shortlist (RAC Scientist-B) or written (CEPTAM) | GATE score *or* BARC online exam |
| Panel shape | 6–10 members, ~20–30 min | 5–8 members, ~20–40 min | 5–9 members, **long technical grill (often 45–90 min)** |
| Flavor | favorite-subjects deep dive + project + basic HR | fundamentals + applied/defense context + project | first-principles derivations, rapid basics, legendary why-chains |
| Org-awareness expected | missions, centers, launch vehicles | labs, systems, current programs | reactors, radiation safety, OCES structure |
| Post-interview | merit → medical → appointment | merit → medical/police verification | interview → training school (1 yr) → posting |
| 2026-cycle data | ⟳ fetched & cited at S0 (isro.gov.in careers) | ⟳ (rac.gov.in) | ⟳ (barc.gov.in OCES portal) |

Every interview-facing number/date in the app carries a `sourceNote` + verification date; stale-fact warnings surface in the dossier instead of silently lying.

---

## 🏗️ THE DECK — 12 MODULES (each: purpose → interactions → volume)

### 1. 🛰️ MISSION CONTROL *(home panel)*
Countdown to each target interview (user-set dates) · readiness radar per subject · today's forged plan (auto-composed from weak spots + SRS due-cards + one mock segment) · streak flames · "LAST SESSION" resume chip.

### 2. 🗂️ ORG DOSSIERS
Per org: what it does in 10 lines · centers/labs map list (VSSC, SAC, PRL, DRDL, ASL, BARC Mumbai/IGCAR…) · selection pipeline diagram · pay/level overview · work-culture notes · *"know your employer"* flash-pack. All fact-cited.

### 3. ⚔️ THE SPARRING HALL — interview simulator (the crown jewel)
- **Panel personas, not one flat voice:** *The Fundamentalist* (why-chain interrogations) · *The Sniper* (rapid one-liners) · *The Skeptic* (trap framing, "are you sure?") · *The Mentor* (coaching lulls). Persona mix mirrors the chosen org's style.
- **Modes:** `WHY-CHAIN` (every answer drilled 5 whys deep) · `RAPID FIRE` (60s volleys) · `DEEP DIVE` (one topic to bedrock) · `FULL BOARD` (timed 30/45/60-min simulated panel with mixed personas) · `SILENCE DRILL` (pause-tolerance training).
- **Answer paths:** typed mode instantly · **VOICE MODE** (local Web Speech API: interviewer speaks via speech-synthesis, you answer by mic, transcript captured) — fully on-device, zero keys; gracefully degrades to typed where unsupported.
- **Post-mortem report:** structure rubric (define → derive → example → boundary), depth reached, hesitations, traps caught/missed, self-score sliders → trend lines.
- Volume at full forge: **~1,500 interview questions** (org-tagged, subject-tagged, why-chained), ~250 trap patterns, ~120 full-board compositions.

### 4. 📚 SUBJECT ARMORY (interview-tuned content, not textbook dumps)
CM · EM · QM · Thermo/Stat · Math Phys · Electronics · AMOP · **Nuclear (BARC-weighted)** · SSP · **Space science & orbital mechanics (ISRO flavor)** · **Radar/sensor fundamentals (DRDO flavor)** · Radiation protection basics (BARC flavor).
Per topic: 1-page "fundamentals that get asked" sheet · 30–60 rapid Q&A · 5–10 board-style derivations · famous traps · *say-it-in-2-minutes* summary drill.

### 5. ✍️ DERIVATION DOJO
**50 chalkboard must-knows**, ladder-reveal style (step → hidden → next), e.g. EM wave eqn from Maxwells · H-atom energy levels outline · Maxwell relations · radioactive chain law · SEMF term-by-term · Carnot efficiency · partition function → thermo quantities · Fresnel coefficients sketch. Each with "what the panel interrupts to ask" sidebars.

### 6. 🧪 PROJECT PRESENTATION LAB
Your final-year/research project weaponized: 8-beat narrative arc builder (fill-in → generates your pitch) · anticipated cross-question generator by domain keywords · "no big project" contingency scripts · demo-day talking points · how to present a *coursework* project honestly and strongly.

### 7. 🎖️ HR & OFFICER CRAFT
Tell-me-about-yourself forge (interactive 90-sec builder) · strengths/weaknesses with scientist framing · "Why ISRO/DRDO/BARC?" specific-answer forges (org-flavored, anti-generic) · scenario answers (remote postings, security sensitivity, hierarchy, research-vs-service) · document checklist engine (per org, per cycle format) · dress/etiquette/body-language micro-lessons · **voice pacing trainer** (speech-rate meter via the same local voice path).

### 8. 📡 SIGNAL WATCH (current affairs, org-scoped)
ISRO mission timeline cards (Chandrayaan line, Gaganyaan, NISAR, Aditya...) · DRDO systems cards · BARC reactor/facility cards · space-policy basics · *"how to answer if asked about a mission you missed"* recovery scripts. Pack is **data-separated and refreshable** (re-verify & swap without code edits).

### 9. 🃏 FLASHCARD VAULT (spaced repetition)
Constants/values, formula one-liners, org facts, mission dates, units — **SM-2-style local scheduler**, due-queue drives Mission Control plan, per-card ease tracked. ~800 cards at full forge. Study streaks feed gamification.

### 10. 🧯 STRESS INOCULATION BAY
Distraction mode (controlled interruptions mid-answer) · hostile-face timer pressure · "explain like I'm five / explain like I'm a colleague" instant toggles · post-mortems that grade composure separately from content.

### 11. 📜 EXPERIENCE CHRONICLES
Structure-of-experience library: anonymized *patterns* of past interviews (how panels open, how they pivot, how they close) per org — clearly labeled **reconstructed patterns, not verbatim leaks**. First-principles problems boards are known to love, grouped by subject.

### 12. ⏱️ PRE-FLIGHT COMMAND (D-7 / D-1)
Countdown checklists · travel & venue planner fields · documents packer (tick-off, per org) · sleep/caffeine protocol card · morning warm-up set (10 gentle questions to get the voice online) · *walk-in mantra* screen.

---

## 🎨 PRESENTATION SYSTEM

- **Layout:** left command rail (module icons) · main stage · right context rail (timer/streak/current-mode chips) — responsive down to 720p laptop.
- **Themes (original art, zero org IP — no logos, no copied insignia; geometric launch/defense/reactor motifs only):**
  `PAD 39A` (launch-night navy + telemetry cyan) · `WAR ROOM` (olive steel + amber grids) · `REACTOR HALL` (coolant white-blue + graphite) · `CIVIL SERVICE` (clean light officewear, the calm theme).
- **Boot Command Center** (proven pattern from the tracker): date, countdowns, one line of doctrine, daily directive. Static-first, pre-paint.
- Motion: whisper-level by default, reduced-motion honored; celebration surges on milestones only.
- Sound: optional WebAudio clicks/whoosh — default OFF.
- Typography: system stack, print-clean; file opens and *reads like a dossier* even with every effect off.

## 🗄️ DATA ARCHITECTURE

```
window.MV_BANKS     = interview questions {n, org[], subject, q, model, whyChain[L1..L5], trap?, difficulty}
window.MV_ARMORY    = topic sheets & derivations {topic, sheet, rapid[], derivations[{steps[], interrupts[]}]}
window.MV_CHRONICLES= experience patterns {org, phase, patternNotes}
window.MV_SIGNAL    = current-affairs cards {org, title, fact, sourceNote, verifiedOn}
localStorage keys:  mv_progress_v1 · mv_srs_v1 · mv_mocks_v1 · mv_settings_v1 — separate, small, never exported into backup payloads
```

## ⚖️ BUILD LAWS (carried from the tracker forge)

1. **Self-contained** — one HTML; images/SVG embedded as data-URIs; opens anywhere, works offline forever.
2. **No network, no secrets, no external services.** Voice features use on-device browser APIs only; optional AI feedback module is disabled-by-default, key-never-stored.
3. **Original content** — model answers, chronicles, cards written fresh; facts cited; no coaching-book verbatim.
4. **Honest labels** — pattern questions ≠ "actual leaked questions"; everywhere.
5. **Proof from day one** — block-registry audit + syntax sweep + unit/jsdom suites each stage; nothing ships red.
6. **Lean growth** — stage-size budget table below; no 5-MB surprise drops.

## 🗺️ STAGES (you say NEXT at each gate)

```
S0 · SCHEMAT & SHELL    → verified org pipeline data + deck skeleton + themes + boot center      [small]
S1 · MISSION CONTROL    → dashboard, countdowns, planner, streaks
S2 · ARMORY I           → CM/EM/QM/Thermo sheets + rapids + dojo subset
S3 · ARMORY II          → MathPhys/Electronics/AMOP/Nuclear/SSP + flavors (space/radar/radiation)
S4 · SPARRING HALL      → simulator engine, personas, typed mode, post-mortems
S5 · VOICE & PRESSURE   → voice mode, stress bay, pacing meter
S6 · HR + PROJECT + FLIGHT CRAFT
S7 · SIGNAL WATCH + FLASHCARDS + CHRONICLES
S8 · FULL BOARDS + GAUNTLET QA → 120 board compositions, final battery, polish, delivery
```

| Stage gauge | est. file growth | est. content |
|---|---|---|
| S0–S1 | +0.3 MB | shell + 2 themes |
| S2–S3 | +1.2 MB | ~700 Q&A · 50 derivations · 12 topic sheets |
| S4–S5 | +0.6 MB | engine + ~800 Sparring items wired |
| S6–S8 | +1.0 MB | ~300 HR/project · 800 flashcards · 120 boards |
| **Total** | **≈3 MB single file** | opens instantly, lives on a pendrive |

## 🙏 WHAT I NEED FROM YOU (6 answers, one line each)

| # | Item | Default if silent |
|---|---|---|
| 1 | Target posts | ISRO Scientist-SC · BARC OCES · DRDO (RAC vs CEPTAM — pick or both) |
| 2 | Attempt cycle | 2026 (dates settable later either way) |
| 3 | Your 3–4 "favorite subjects" to declare | QM · EM · Nuclear · Math Phys (changeable in-app) |
| 4 | Project domain (for the Lab module) | fill-in template stays generic until you give it |
| 5 | Theme vote | PAD 39A default · others built in same pass |
| 6 | Voice mode | build it (recommended) — needs mic permission at runtime, nothing else |

> Say **"FORGE S0"** and the first sealed stage of MISSION VIVA lands with proof battery.
> The tracker trains your *papers*. MISSION VIVA trains the *room*. Together: 360°.
