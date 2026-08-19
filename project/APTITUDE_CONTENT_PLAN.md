# 🧠 OPERATION APTIFORGE — APTITUDE CONTENT FORGE PLAN
### GATE GA + CSIR Part A · full syllabus-locked study content with worked examples · lands in the tracker's CONTENT section
*drafted: 2026-08-13 · status: ✅✅ **APTIFORGE COMPLETE — C0→C5 ALL SHIPPED** (2026-08-14): 12 modules live (95 cards · 118 formula rows · 99 worked examples · 66 anchor-atoms covered, 758 unique math strings, ~23.1k words across 140,323 rendered chars) · `_audit/apti_gates.js` **18/18 green** (758 formulas KaTeX-strict · 99/99 derivations re-computed · coverage + style lint) · **C5 INTEGRATION SHIPPED**: `aptitude-content.js` (177,828 B) self-mounts into `window.LOCAL_CONTENT_DATA` via **R28** (one registered surgical pair — script tag before `</head>`, zero base rewrites) → **Content Vault now serves 24 note sets (12 physics + 12 🧠 aptitude)** with search, outline, KaTeX, font controls · proof chain green: **PROOF PASSED** (40 masters · 74 surgical hooks · baseline byte-parity) · 40 inline scripts 0 syntax errors · battery **units 481/481 · smokes 436/436** (unit24 + smoke25 new: real vault + real companions + real KaTeX end-to-end) · sister ops unlocked: 🎯 TOPICFORGE T0 drills what APTIFORGE teaches · 🏭 PAPERFORGE · 🎖 MISSION VIVA · **post-C5 vault hardening shipped (2026-08-14): R29 (inline-math parking — math now immune to the italicizer — + pipe-table renderer + code-fence token restore + table CSS) + R30 (esc() on math restoration) retired ALL legacy physics-doc artifacts: 40 tables / 266 rows now render, 8,052 physics math segments KaTeX-strict-clean, 0 errors / 0 residue / 0 lone-$ across all 24 vault docs; unit26 (28,013 checks) + flipped smoke26 (246 hard-gate asserts) lock it***

---

## 🧭 THE MISSION (your words, formalized)

| Your ask | The spec it becomes |
|---|---|
| Aptitude content in the content section | New **🧠 APTITUDE chapter** in the tracker's content library — new companion file `aptitude-content.js`, same architecture as `content-data.js` |
| For both GATE and CSIR | Every card/example tagged `GATE` / `CSIR` / `BOTH`; two exam lenses over one shared core (~70% overlap, honestly tagged) |
| Full required content | **12 modules** covering the complete official GA/Part-A syllabus — anchor list below; coverage is machine-proven, not vibes |
| Example problems | **~100 worked examples**, every one with stepwise solution + trap callout + exam-frequency tag |
| No writing errors, no LaTeX errors | **Triple gate**: script re-computes every numeric answer · the tracker's own math renderer must parse 100% of formula strings in a jsdom smoke · human grammar pass before each module ships |
| Content from anywhere OK | Text always **re-written in our own words** (no coaching-verbatim — paper-trail hygiene); the physics of the ideas stays public-domain textbook level |
| Cropped images allowed | Crop policy below — permitted, attributed, compressed, syllabus-only |
| Nothing out of syllabus | **Anchor lock**: module may only contain items mapped to an anchor; an automated test fails the build if any card falls outside the anchor table |
| All syllabus covered | Coverage matrix test: every anchor maps to ≥1 concept card + ≥2 worked examples. 0 gaps or it doesn't ship |

---

## 📜 THE TWO OFFICIAL ANCHOR SETS (the fence — nothing outside, nothing missing)

### GATE General Aptitude — 15 of 100 marks · 10 Qs (5 × 1-mark, 5 × 2-mark) · MCQ −⅓/−⅔ negative · **C0-verified verbatim against the official GATE 2026 GA syllabus PDF (IIT Guwahati, gate2026.iitg.ac.in)**
1. **Verbal Aptitude** — English grammar: tenses, articles, adjectives, prepositions, conjunctions, verb–noun agreement **& other parts of speech** · reading comprehension · narrative sequencing · basic vocabulary: words, idioms, phrases in context.
2. **Quantitative Aptitude** — data interpretation (data graphs: bar graphs, pie charts, other data graphs · 2- & 3-dimensional plots · **maps** · tables) · numerical computation & estimation · ratios & percentages · powers, exponents & logarithms · permutations & combinations · series · mensuration & geometry · elementary statistics & probability.
3. **Analytical Aptitude** — logic: deduction & induction · analogy · numerical relations & reasoning.
4. **Spatial Aptitude** — transformation of shapes: translation, rotation, scaling · mirroring · assembling & grouping · paper folding & cutting · patterns in 2D & 3D.

### CSIR-NET Part A — 20 Qs offered / 15 to attempt · 2 marks each · −0.5 (25%) wrong · 30 of 200 marks · **C0-verified against CSIR-HRDG's live exam-scheme page (csirhrdg.res.in): "max 20 questions of General Aptitude · answer any 15 · two marks each · 30 out of 200 · negative marking for wrong answers"**

---

## 🔐 C0 VERIFICATION RECORD (2026-08-14)

| # | Claim in fence | Source checked | Verdict |
|---|---|---|---|
| 1 | GATE GA topics (all 4 wings) | GATE 2026 official GA syllabus PDF, IIT Guwahati — `gate2026.iitg.ac.in/doc/GATE2026_Syllabus/GA_2026_Syllabus.pdf` | ✅ **verbatim match**; two micro-edits merged in: "other parts of speech" (grammar wing) and "maps" (DI wing) |
| 2 | GATE marking 15/100, 10 Qs | GATE 2026 Information Brochure + Question-Paper-Pattern page (gate2026.iitg.ac.in) | ✅ GA = 15 of 100, 10 Qs; Q1–Q5 = 1-mark, Q6–Q10 = 2-mark (confirmed in 2026 CE/DA/XH question papers) |
| 3 | GATE negative −⅓ / −⅔ | Same brochure: "For a 1-mark MCQ, 1/3 will be deducted… For 2-mark MCQ, 2/3… no negative marking for MSQ/NAT" | ✅ verbatim |
| 4 | CSIR Part A: 20 offered / 15 attempt / 2 marks / 30 of 200 | CSIR-HRDG live exam-scheme page (csirhrdg.res.in, fetched 2026-08-14) | ✅ verbatim |
| 5 | CSIR Part A negative = 0.5 (25%) | CSIR-HRDG page states negative marking exists but **omits the quantum**; 0.5 (25%) confirmed by consistent cluster (Indian Express education 2025, PW 2025 pattern tables, historical Part A key sheets) | ⚠️ locked at **0.5 (25%)** — the one number to re-eyeball when NTA's next CSIR info bulletin drops |

**Honesty stamp on CSIR topic decomposition:** CSIR-HRDG publishes Part A structure + "General Science, Quantitative Reasoning & Analysis and Research Aptitude" umbrella — the anchors 5–8 below are the standard published breakdown (number system…clocks/dice); nothing in them conflicts with the official umbrella.
5. **Numerical ability** — number system · HCF/LCM · averages · percentages · profit & loss · ratio & proportion · time & work · time, speed & distance · simple & compound interest · exponents & logarithms · P&C · probability · series & progressions.
6. **Reasoning** — series completion · coding–decoding · analogies & classification · blood relations · direction sense · seating arrangement · puzzles · syllogisms & statement–conclusion · Venn diagrams · clocks, calendars & dice.
7. **Data interpretation & graphical analysis** — tables · bar/pie/line charts · reading slopes, areas, maxima/minima · mean–median–mode from plots.
8. **General science** — everyday physical phenomena · units & measurement · scientific reasoning & method — strictly at the exam's published level, no thesis-grade tangents.

> Marking numbers above = the commonly published schemes; both get one final web-verification pass against the latest GATE/CSIR-HRDG bulletins at stage C0 (you spot-check the links).

---

## 📚 THE 12 MODULES (the build list)

| # | Module | Covers anchors | Example target |
|---|---|---|---|
| A1 | **Number Sense & Arithmetic Toolkit** — number system, HCF/LCM, averages, %, profit–loss, ratio, SI/CI | CSIR 5 · GATE 2 | 10 |
| A2 | **Algebra, Series & Progressions** — exponents/logs, identities, AP/GP/HP, number-series pattern grammar | BOTH | 8 |
| A3 | **Counting & Probability** — P&C machinery, coins/dice/cards, basic conditional probability | BOTH | 8 |
| A4 | **Time, Work, Speed & Distance** — work pipes, trains, boats, relative speed, races | CSIR-heavy | 8 |
| A5 | **Geometry & Mensuration** — triangles/circles/quads, 2D→3D solids, surface & volume, coordinate basics | BOTH | 8 |
| A6 | **Data Interpretation & Graph Reading** — tables, bar/pie/line, slope & area tricks, stat-from-graph | CSIR 7 · GATE 2 | 10 |
| A7 | **Logical Reasoning Core** — deduction/induction, syllogisms, statement–conclusion, Venn logic | BOTH | 8 |
| A8 | **Arrangement, Puzzles & Codes** — blood relations, directions, seating, coding–decoding, clocks/calendars/dice | CSIR 6 | 8 |
| A9 | **Spatial Aptitude Lab** — rotations/reflections, paper fold & cut, 2D↔3D assembly, pattern matrices | GATE 4 · CSIR 6 | 8 |
| A10 | **Verbal Aptitude Gym** — grammar rule cards (tenses/articles/prepositions/agreement), comprehension method, sequencing, vocab-in-context | GATE 1 | 10 |
| A11 | **Everyday General Science** — measurement & units, common phenomena, scientific-reasoning drills | CSIR 8 | 6 |
| A12 | **Exam Craft** — option elimination, back-solving from choices, approximation, expected-value of guessing under −0.5 vs −⅓/−⅔, time allocation | BOTH | 6 |

**One module's stamp:**
```
concept cards   → the idea, stated once, stated right
formula sheet   → every usable identity, LaTeX-rendered, gate-checked
worked examples → 6–10 per module, exam-shaped stems, laddered easy→vicious,
                  each: full stepwise solution + "where students bleed" trap callout
                  + tag {exam: GATE|CSIR|BOTH, anchor: A-x, difficulty: seed|standard|apex}
speed sheet     → 60-second revision card (last glance before exam)
```

---

## 🖼️ IMAGE POLICY (your cropping permission, hardened)

- **Allowed:** figure crops from aptitude papers / textbooks / owned PDFs for *illustration* (a geometry figure, a DI chart, a folding pattern), each: compressed (JPEG q80 / PNG-8, target ≤60 KB), data-URI embedded, carrying a `sourceNote` credit line, and **re-drawn as clean SVG whenever the physics allows** (original vector beats cropped pixels — same rule as PAPERFORGE's Stage 2).
- **Never:** out-of-syllabus material (no CAT-level combinatorics monsters GATE/CSIR never ask), no watermarked coaching pages verbatim, no images that carry a third party's question text wholesale. Examples' numbers are re-rolled so nothing is a photocopy.
- Every image ships only if it renders in the content panel smoke test (jsdom, zero 404s/malformed URIs).

## 🚫 THE ZERO-ERROR GATES (because you flinched at "LaTeX error")

1. **Math gate:** every formula string parsed by the tracker's own renderer in a jsdom render-smoke → **100% parse, 0 errors**.
2. **Arithmetic gate:** a node checker re-computes every worked example's final numeric answer from its own steps → mismatch = build fails.
3. **Coverage gate:** anchor table ↔ module mapping test → 100% anchors covered, 0 out-of-syllabus cards.
4. **English gate:** spell/grammar pass + style-lint (no broken sentences, consistent notation) before any module is called done.
5. **Integrity gate (the usual house rules):** byte-parity verify + 39-script syntax sweep + full unit/smoke battery stay green after integration.

---

## 🗺️ STAGES & GATES (you say NEXT at each gate)

```
C0 · ANCHOR LOCK      → final anchor table web-verified (GATE + CSIR-HRDG bulletins) · module list here approved by you
                        GATE: you read the fence = the promise
C1 · PILOT MODULE     → A6 Data Interpretation forged end-to-end (richest CSIR signal) — suggested; your pick wins
                        GATE: you read 3 examples, nod the register
C2 · CORE NUMERACY    → A1, A2, A3, A4, A5
C3 · REASONING WING   → A7, A8, A9
C4 · VERBAL + GSCI + CRAFT → A10, A11, A12
C5 · INTEGRATION & QA → aptitude-content.js + 🧠 panel mount (one registered insertion, zero base rewrites)
                        + full proof battery + coverage/zero-error suites; deliver updated tracker
```

**Volume estimate:** ~100 worked examples · ~150–220 concept/formula cards · 12 speed sheets · companion ≈ 0.3–0.5 MB text (+ crops). No new engine — the existing content renderer does the lifting.

---

## 🙏 WHAT I NEED FROM YOU (tiny)

| # | Item | Options | Blocking? |
|---|---|---|---|
| 1 | Pilot module pick | A6 Data Interpretation (recommended) or any # | one word |
| 2 | Register | **formula-first + trap callouts** (recommended) vs narrative textbook tone | one word |
| 3 | Image style for re-drawn figures | match content section look (dark) / exam-white | one word (or "same as Stage-2 figure vote whenever that lands") |

> Syllabus teaches, drills grind, papers crown: 🧠 APTIFORGE → 🎯 TOPICFORGE lane 10 → 🏭 PAPERFORGE GA sections. Three ops, one bloodstream.
> Say **"FORGE C0"** (with pilot/register/style if you have opinions) and the anchor table gets verified and locked.
