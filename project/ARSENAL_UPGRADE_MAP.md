# ⚔️ THE ARSENAL — AIR-1 UPGRADE MAP
### every weapon checked · what's forged · what's still missing
*audit run: 2026-08-13 against the live build (45.2 MB, 34 scripts, all suites green)*

---

## ✅ TIER 0 — ALREADY IN YOUR HANDS (verified in the file)

| Weapon | Where it lives | Proof it exists |
|---|---|---|
| **Boot Command Center** (auto-greet, live card, quote bank) | startup overlay | 64 quotes, R13 |
| **Rotating backdrops + 🎲 shuffle** | boot overlay | 4 embedded frames, R14–16 |
| **Daily Command Center card** (weakest subject, high-ROI next, triage) | dashboard | `panel-dashboard` |
| **PYQ war table** (229 refs) | `panel-pyq` | official answers untouched ✔ |
| **Mock test engine + history** | `panel-mocks` | 106 refs, simHistory |
| **SRS review system** | review list | 87 refs |
| **Focus/Pomodoro timer** | `panel-focus` | 56 timer refs |
| **Scientific calculator** | `panel-calculator` | 12 refs |
| **Feynman teach-back tracker** | `panel-method` | 84 refs |
| **XP / levels / badges** | gamification core | 309 XP + 27 badge refs |
| **Streak system** | daily tracking | 25 refs |
| **Study heatmap** | history | 36 refs |
| **AI adapter (provider-agnostic)** | `callAi` | no hardcoded keys ever ✔ |
| **AI usage ledger** | AiUsage | 11 counters |
| **Mistake notebook** | 15 refs | error log exists |
| **Week planner** | `panel-weekly` | roadmap + weekly |
| **Backup / export / import** | `panel-data` | never carries AI keys ✔ |
| **Break games** (12 modes × 4 levels) | GameForge | chess commentator too |
| **AI question gen + mystery cases** | GameForge | ✦ AI-GENERATED labelled |

> **Verdict:** the base arsenal is S-rank. What follows is the gap between *"complete tracker"* and *"AIR-1 machine"*.

---

## 🔥 TIER 1 — MISSING WEAPONS (priority order, highest ROI first)

### 1. 🎯 READINESS ENGINE — *"AIR-1 probability meter"*
**Gap:** `readiness: 0`, `rankPredict: 0`, `forecast: 0` — nowhere does the file tell you *how close to AIR-1 you actually are*.
**Build:** one score (0–100) computed from: syllabus %, mock trend slope, PYQ accuracy by weightage, SRS retention, revision freshness. Rendered as the **Monarch Gauge** on the dashboard — a ring that fills as you climb.
**Why first:** everything else is a weapon; this is the HUD that tells you when to strike.

### 2. ✂️ CUTOFF INTELLIGENCE LAB — *"know thy enemy"*
**Gap:** `cutoff: 0` — zero cutoff data anywhere.
**Build:** year-wise qualifying cutoffs + AIR-1 marks for GATE PH & CSIR-NET Physics (hardcoded data, user-verifiable), a "distance to cutoff" line vs your mock average, and a **marks-to-rank regression chart**. Local data only, honest labels on estimates.
**ROI:** converts vague anxiety into a numeric gap — "you are 14 marks off AIR-1 pace".

### 3. 🧪 SUBJECT & CHAPTER TESTS — *"mid-size battles between PYQs and mocks"*
**Gap:** engine has full mocks + PYQ singles, but no 25-Q / 10-Q timed subject tests.
**Build:** assemble mini-tests from the PYQ bank by subject (Mechanics-only, EM-only…), 25-question format with real marking scheme, stored in a new history lane. Pure reuse of mock machinery.

### 4. 🔁 SMART REVISION LOOM — *"spaced repetition on steroids"*
**Gap:** SRS exists but is passive — nothing *pushes* today's decay forecast.
**Build:** "revision pressure" forecast per topic (SRS due-count × topic weight × days-since-touched), auto-seeded into the Command Center as the top triage card every morning. **The loom weaves; you just wear it.**

### 5. 📝 FORMULA ARMORY — *"every equation, one keystroke away"*
**Gap:** formulas are scattered (35 refs) across games; no searchable vault.
**Build:** collapsible per-chapter formula sheets (your own + canonical), search-as-you-type, auto-pulls equations you missed in mocks. Exportable one-pager for exam-eve.

### 6. 🧭 EXAM-DAY SIMULATOR — *"rehearse D-Day like it's a raid"*
**Gap:** mocks are untimed-ish; no strict 3-hour virtual-calculator-ONLY mode with section rules.
**Build:** proctor mode — hard 180-min clock, lock-out of other tabs, virtual calculator modal, question palette (answered/marked/not-visited like the real GATE CBT), post-mortem with per-question time heat.

---

## ⚡ TIER 2 — FORCE MULTIPLIERS (after Tier 1)

### 7. 🗺️ CONCEPT DEPENDENCY GRAPH — *"the skill tree"*
Visual prerequisite web (Mechanics → Lagrangian → CM advanced…). Nodes color by mastery. Clicking a weak node shows what to fix *first*. `mastery: 3 refs` exists as data — this is its face.

### 8. 🤖 AI COACH ORACLE — *"weekly tactical briefing"*
`aiCoach: 0` currently. One click: AI reads your week's stats (via existing adapter) and writes a 6-line war briefing — what improved, what's bleeding, next week's attack order. Fully labelled AI-GENERATED, works with any provider key you set.

### 9. 📖 DOUBT CRYPT — *"never lose a question twice"*
`doubt: 12` refs but no workflow. Upgrade: doubt inbox → statuses (unresolved → solver-found → understood → revisitable), link each doubt to its topic so it resurfaces in SRS.

### 10. 🛡️ ANTI-SILLY-MISTAKE FIELD
Mistake notebook exists; add **mistake taxonomy** (concept / calc-slip / misread / time-panic) with per-type counters, and a pre-mock "your top 2 trap types this month" banner. AIR-1 is decided by silly mistakes, not knowledge gaps.

### 11. ⏳ COUNTDOWN CONDUIT
`countdown: 20` refs but check it shows BOTH exams with an exam-mode switch (GATE focus ↔ CSIR focus) — targets, weightages and the Command Center re-weight per active exam.

### 12. 📦 PRINT / WAR-REPORT
`print: 14` refs. Add one-tap **Weekly War Report** (print CSS): stats + weak areas + plan — paper you can stick on a wall.

---

## 🌌 TIER 3 — ENDGAME FLEXES (when Tier 1–2 feel routine)

- **13. Solo-Learning Party Mode** — shareable read-only "progress card" link/screenshot generators (no server, canvas-rendered image).
- **14. Voice-brief playback** — the AI briefing read by your chosen voice (the infra is already there from earlier rounds).
- **15. Offline YouTube/embed library** — curated per-chapter resource links already in `panel-resources`; add progress-tracking per resource.
- **16. GATE ↔ CSIR syllabus DIFF view** — `syllabus: 28` refs but no diff lens: "topics in CSIR but not GATE" and vice versa, so nothing leaks between the two fronts.

---

## 📊 THE GAP SUMMARY

| Dimension | Coverage today | AIR-1 standard |
|---|---|---|
| Tracking & triage | ████████░░ 80% | needs Readiness Engine |
| Practice volume | ████████░░ 85% | needs subject/mini tests |
| Exam-realism | ██████░░░░ 60% | needs D-Day Simulator |
| Target awareness | ████░░░░░░ 40% | needs Cutoff Lab |
| Retention loop | ███████░░░ 70% | needs Revision Loom push |
| Meta-learning (mistakes/doubts) | █████░░░░░ 50% | taxonomy + crypt workflow |
| Fitness of arsenal overall | **~63%** | **Tier 1 closes most of it** |

---

## 🗡️ RECOMMENDED STRIKE ORDER
1. **Readiness Engine** (the HUD)
2. **Cutoff Intelligence Lab** (the target)
3. **Revision Loom push** (the daily driver)
4. **Subject mini-tests** (the volume)
5. **D-Day Simulator** (the rehearsal)
6. Formula Armory + rest of Tier 2

> *"You don't rise to AIR-1 the day of the exam. You fall to the level of your systems. Here — we're building the system."* 🎲

---
*Nothing above touches official PYQ answers, scores, marking, or attempt limits. AI stays provider-agnostic, labelled, keyless. Single file, localStorage, your data yours. Point at a number and it gets forged next.*
