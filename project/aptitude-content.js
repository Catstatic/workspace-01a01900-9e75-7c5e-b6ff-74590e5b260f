/* ============================================================================
   APTIFORGE · aptitude-content.js — GATE GA + CSIR-NET Part A study content
   Architecture mirrors content-data.js: a window.*_CONTENT_DATA map of
   markdown docs for the vault, PLUS window.*_CONTENT_META with structured
   example records so the zero-error gates can machine-verify every number
   and every formula string (KaTeX 0.16.11 = the tracker's own renderer).
   C1: pilot A6 DATA INTERPRETATION (CSIR-7 · GATE-2 DI atoms)
   C2: core numeracy wing — A1 Number Sense · A2 Algebra/Series ·
       A3 Counting & Probability · A4 Time/Work/Speed · A5 Geometry
   C3: reasoning wing — A7 Logic Core · A8 Puzzles & Codes · A9 Spatial Lab
   Anchors locked at C0 (2026-08-14); GATE-2/CSIR-5 extended at C2;
   GATE-3/GATE-4/CSIR-6 extended at C3.
   ============================================================================ */
(function(){
'use strict';

/* ---------------------------------------------------------------- anchors */
const ANCHORS = {
  /* GATE GA wing 2 (Quantitative Aptitude) — C0-verified verbatim.
     First 7 atoms = the data-interpretation subtopic (A6's fence);
     final 7 = the remaining GA-quant subtopics (numerical computation &
     estimation · ratios & percentages · powers/exponents/logarithms ·
     P&C · series · mensuration & geometry · probability). */
  'GATE-2': ['tables','pie-charts','bar-charts','line-charts','2D-3D-plots','maps','elementary-statistics',
             'numerical-computation-estimation','ratios-percentages','powers-exponents-logarithms',
             'permutations-combinations','series','mensuration-geometry','probability'],
  'CSIR-7': ['tables','bar-pie-line','slopes-areas','maxima-minima','mean-median-mode-from-plots','nested-shares'],
  /* CSIR Part A · numerical ability — verbatim official umbrella list */
  'CSIR-5': ['number-system','hcf-lcm','averages','percentages','profit-loss','ratio-proportion',
             'time-work','time-speed-distance','si-ci','exponents-logarithms','p-and-c','probability',
             'series-progressions'],
  /* == C3 extension: reasoning wing == */
  /* GATE wing 3 (Analytical Aptitude) — verbatim: "logic: deduction & induction ·
     analogy · numerical relations & reasoning" */
  'GATE-3': ['deduction-induction','analogy','numerical-relations'],
  /* GATE wing 4 (Spatial Aptitude) — verbatim: "transformation of shapes:
     translation, rotation, scaling · mirroring · assembling & grouping ·
     paper folding & cutting · patterns in 2D & 3D" */
  'GATE-4': ['shape-transformations','mirroring','assembling-grouping','paper-folding-cutting','2D-3D-patterns'],
  /* CSIR Part A · reasoning — published breakdown under the official umbrella
     "General Science, Quantitative Reasoning & Analysis and Research Aptitude" */
  'CSIR-6': ['series-completion','coding-decoding','analogies-classification','blood-relations',
             'direction-sense','seating-arrangement','puzzles','syllogisms','venn-diagrams',
             'clocks-calendars-dice'],
  /* == C4 extension: verbal + gen-science == */
  /* GATE wing 1 (Verbal Aptitude) — verbatim: "English grammar: tenses, articles,
     adjectives, prepositions, conjunctions, verb-noun agreement & other parts of
     speech · reading comprehension · narrative sequencing · basic vocabulary:
     words, idioms, phrases in context" */
  'GATE-1': ['grammar-tenses-articles','grammar-prepositions-conjunctions','grammar-agreement',
             'parts-of-speech','reading-comprehension','narrative-sequencing','vocabulary-idioms-phrases'],
  /* CSIR Part A · general science umbrella — "General Science" at published level */
  'CSIR-8': ['everyday-phenomena','units-measurement','scientific-reasoning'],
  /* META-ANCHOR (honesty-flagged): A12 Exam Craft is plan module #12 — exam
     *technique*, not an official syllabus wing. Registered here so the coverage
     gate can hold it to the same ≥1 card + ≥1 example discipline as real anchors. */
  'CRAFT': ['option-elimination','backsolving-estimation','guessing-ev','time-allocation']
};
/* HONESTY FLAG: 'geometry-mensuration' is not a verbatim CSIR-5 atom.
   CSIR Part A *does* ask area/volume items under its official umbrella
   "Quantitative Reasoning & Analysis", so A5 claims it under this flagged
   allowance; the coverage gate treats it as legal only via this list. */
const UMBRELLA_ATOMS = { 'CSIR-5': ['geometry-mensuration'] };

/* --------------------------------------------------------- module content */
const MODULE_A6 = {
  id: 'A6',
  title: 'Data Interpretation & Graph Reading',
  file: '🧠 A6 · Data Interpretation & Graph Reading.md',
  anchors: ['CSIR-7','GATE-2'],
  anchorAtoms: {
    'CSIR-7': ['tables','bar-pie-line','slopes-areas','maxima-minima','mean-median-mode-from-plots','nested-shares'],
    'GATE-2': ['tables','pie-charts','bar-charts','line-charts','2D-3D-plots','maps','elementary-statistics']
  },
  register: 'formula-first + trap callouts',
  figureStyle: 'dark (matches content section)',
  stage: 'C1 pilot',

  /* ----- concept cards: the idea, stated once, stated right ----- */
  cards: [
    { id:'A6-C1', covers:['tables','2D-3D-plots','maps','bar-pie-line'], head: 'The Read Order',
      md: String.raw`Every DI figure is read in ONE fixed order, never freestyle:

**Title → Axes → Units → Legend → Gridlines.** The title tells you what the number means ("production", "export", "cumulative rainfall"); the axes tell you what moves against what; the **units** tell you the multiplier hiding in the corner ($\times 10^3$, "in lakhs", "per hundred"); the legend splits the series; the gridlines are your ruler. 90-second rule: spend the first 10 of them on units alone.

> For map-based and pseudo-3D figures the same order holds: legend/shading classes act as the units layer. On 3D bar surfaces, always align the bar's top with the **back-wall grid**, not the floor — the floor grid is drawn in perspective and lies.`
    },
    { id:'A6-C2', covers:['tables'], head: 'Units Audit',
      md: String.raw`Tables cheat through units, never through arithmetic. Before touching any number, circle: the header unit ("in thousands", "in ₹ lakh"), whether a column is **cumulative** or per-period, and whether percentages are of the row, of the column, or of the grand total. A table that says "units in thousands" and shows 48 means 48,000 — and every option downstream assumes you noticed.

**Percentage points vs percent**: rising from 40% to 44% is a **4 percentage point** rise but a **10%** relative rise. Examiners monetize the confusion; the two phrases are never interchangeable.`
    },
    { id:'A6-C3', covers:['pie-charts','tables','nested-shares'], head: 'Shares and Part–Whole',
      md: String.raw`One identity powers all share questions:

$$\text{share} = \frac{\text{part}}{\text{whole}} \qquad \text{share\%} = \frac{\text{part}}{\text{whole}} \times 100\%$$

For pies, the whole is $360^\circ$ and the "part" may arrive as an angle:

$$\text{value} = \text{total} \times \frac{\theta}{360^\circ} \qquad \theta = 3.6^\circ \text{ per } 1\%$$

For stacked bars, the "whole" is the bar's full height; read each segment as upper edge minus lower edge. Always sanity-check with the neighbours: if the slice looks like a quarter, the number must land near $25\%$ — if your arithmetic says $12\%$, you divided in the wrong order.`
    },
    { id:'A6-C4', covers:['bar-charts','line-charts'], head: 'Percent-Change Discipline',
      md: String.raw`$$\%\text{ change} = \frac{V_{\text{new}} - V_{\text{old}}}{V_{\text{old}}} \times 100\%$$

The denominator is **always the earlier (base) value**, and the sign matters: a negative result is a decrease, full stop — converting it to a positive "10% decrease" mid-calculation is how −10 becomes +10 by answer time. When the stem says "greatest percentage increase", rank the signed values; a decrease never wins.

Reflex check: a risefrom 120→150 looks identical in absolute size to 150→180 (+30 each), but the percentages are $25\%$ and $20\%$ — the base shrinks the rate as the series grows.`
    },
    { id:'A6-C5', covers:['slopes-areas','line-charts','maxima-minima'], head: 'Slope Is Rate, Height Is Level',
      md: String.raw`On a line chart of value vs interval, the slope is the rate of change:

$$m = \frac{\Delta y}{\Delta x}$$

The **highest point is not the fastest growth** — apex questions constantly swap the two. The fastest *absolute* growth is the steepest segment (largest $\Delta y$ per $\Delta x$); the fastest *percentage* growth additionally divides by $V_{\text{old}}$. CSIR asks both wordings within the same paper, often from the same graph.

Maxima/minima are read as **turning points of the polyline**, not of its endpoint: a series ending at its peak has no maximum at the end — it has a maximum *everywhere it turns back down*.`
    },
    { id:'A6-C6', covers:['slopes-areas','maxima-minima'], head: 'Area Under a Kinked Line = Total',
      md: String.raw`When the y-axis is a **rate** and the x-axis is **time**, the area under the polyline is the accumulated total (rain harvested, distance covered, energy drawn). Split it into trapezoids, one per segment:

$$A_{i} = \frac{y_i + y_{i+1}}{2}\,\Delta x \qquad\Rightarrow\qquad A_{\text{total}} = \sum_i \frac{y_i + y_{i+1}}{2}\,\Delta x$$

Never shortcut it as "peak × full duration" — that prices in the corners the line never visits. The trapezoid sum is exact for piecewise-linear data and is a standing CSIR favourite precisely because one lazy rectangle ruins it.`
    },
    { id:'A6-C7', covers:['mean-median-mode-from-plots','elementary-statistics','bar-charts'], head: 'Grouped Bars → Weighted Mean',
      md: String.raw`Bar heights are **frequencies**, not values. For categories $x_i$ with bar heights $f_i$:

$$\bar{x} = \frac{\sum_i f_i x_i}{\sum_i f_i}$$

Use the class midpoint for banded categories (a 10–20 bar reads $x_i = 15$). The unweighted shortcut $\bar{x} = \frac{5+15+25+35}{4}$ is the planted trap: it pretends every bar hides the same number of observations, which is exactly what the bars are there to deny.`
    },
    { id:'A6-C8', covers:['mean-median-mode-from-plots','elementary-statistics'], head: 'Median and Mode by Eye',
      md: String.raw`**Mode** is the tallest bar — no computation. **Median** from bars: cumulate the frequencies left to right until you pass $N/2$; the bar you stop at is the median class. Both are 15-second reads if the cumulative discipline is there:

$$\text{median class} = \text{first class with cumulative frequency} \ge \frac{N}{2}$$

From a plain line chart with $N$ ordered points, the median is the middle ordinate (or the mean of the two middle ordinates for even $N$) — but **only after sorting by value**, and line charts are usually drawn sorted by *time*, not by value. Sort first, read second.`
    },
    { id:'A6-C9', covers:['nested-shares','tables','maps'], head: 'Statement-Verification Protocol',
      md: String.raw`"Which of the following statements is correct?" questions pay full marks for three checks, so price them that way: evaluate **every** option numerically before committing, in this order —

1. the option that *looks* true (usually the planted trap),
2. the two computational middles,
3. the leftover.

A statement dies on one counterexample; do not average the evidence. For nested shares (state inside nation, district inside state), shares multiply:

$$\text{nested share} = s_1 \times s_2 \qquad \text{(never } s_1 + s_2 \text{)}$$

Addition is for disjoint parts of the same whole; multiplication is for parts of parts.`
    },
    { id:'A6-C10', covers:['2D-3D-plots','maxima-minima','maps'], head: 'The Trap Anthology',
      md: String.raw`The five recurring ambushes on CSIR/GATE data figures:

1. **Base-year drag** — percent taken off the wrong denominator (always $V_{\text{old}}$).  
2. **Absolute-relative swap** — biggest bar rise is not biggest % rise.  
3. **Cumulative masquerade** — a cumulative plot's *level* answers *increment* questions only after differencing.  
4. **Height-vs-slope swap** — apex of the curve vs steepest segment (see C5).  
5. **Nested share addition** — $40\%$ of a $30\%$ slice is $12\%$, not $70\%$.

Every worked example below names its trap; by A6's speed sheet they should be reflex, not recall.`
    },
  ],

  /* ----- formula sheet: every usable identity, gate-checked ----- */
  formulas: [
    { name:'Share of whole',       tex: String.raw`\text{share\%} = \dfrac{\text{part}}{\text{whole}} \times 100\%` },
    { name:'Pie angle ↔ share',    tex: String.raw`\text{value} = \text{total}\times\dfrac{\theta}{360^\circ}` },
    { name:'Percent change',       tex: String.raw`\%\Delta = \dfrac{V_{\text{new}}-V_{\text{old}}}{V_{\text{old}}}\times 100\%` },
    { name:'Growth rate (slope)',  tex: String.raw`m = \dfrac{\Delta y}{\Delta x}` },
    { name:'Trapezoid area',       tex: String.raw`A_{\text{total}} = \sum_i \dfrac{y_i + y_{i+1}}{2}\,\Delta x_i` },
    { name:'Weighted mean',        tex: String.raw`\bar{x} = \dfrac{\sum_i f_i x_i}{\sum_i f_i}` },
    { name:'Median class rule',    tex: String.raw`\text{first class with } F_{\text{cum}} \ge N/2` },
    { name:'Nested share',         tex: String.raw`s_{\text{nested}} = s_1 \times s_2` },
    { name:'Ratio of averages',    tex: String.raw`\rho = \dfrac{\bar{x}_B}{\bar{x}_A} = \dfrac{\frac{1}{n}\sum B_i}{\frac{1}{m}\sum A_j}` },
    { name:'Percentage-point gap', tex: String.raw`\Delta_{\text{pp}} = p_2 - p_1 \quad (\text{not } \tfrac{p_2-p_1}{p_1})` },
  ],

  /* ----- worked examples: seed → standard → apex, traps named -----
     verify.expr uses only the example's own givens; the arithmetic gate
     re-evaluates it and compares against verify.value within verify.tol   */
  examples: [
    { id:'A6-E1', exam:'BOTH', anchor:'CSIR-7', covers:['tables'],
      difficulty:'seed',
      stem: String.raw`**Table read — share of total.** Students enrolled in five institutes (in hundreds), as a table:

*A: 240 · B: 300 · C: 180 · D: 420 · E: 260*

What percentage of the total enrolment is in institute C?`,
      solution: String.raw`Total $= 240+300+180+420+260 = 1400$ (hundred).

$$\text{share}_C = \frac{180}{1400}\times 100\% = 12.857\% \approx 12.9\%$$`,
      trap: 'The table says "in hundreds" — but since shares are ratios, the multiplier cancels; the trap is banking 180/1400 as the answer *in percent* without the ×100.',
      verify: { value: 12.857, expr: '(180/(240+300+180+420+260))*100', tol: 0.01, unit: '%' } },

    { id:'A6-E2', exam:'BOTH', anchor:'GATE-2', covers:['pie-charts'],
      difficulty:'seed',
      stem: String.raw`**Pie read — angle to value.** A family's monthly budget of ₹4,80,000 is split into sectors; "Food" subtends $54^\circ$. What is the monthly food spend?`,
      solution: String.raw`$$\text{share} = \frac{54^\circ}{360^\circ} = 0.15 = 15\%$$
$$\text{Food} = 480000 \times 0.15 = 72{,}000$$`,
      trap: 'A 54° slice is NOT 54% — it is 54/3.6 = 15%. Confusing degrees with percent is the single most-set pie trap.',
      verify: { value: 72000, expr: '(54/360)*480000', tol: 1, unit: '₹' } },

    { id:'A6-E3', exam:'CSIR', anchor:'CSIR-7', covers:['bar-charts','bar-pie-line'],
      difficulty:'standard',
      stem: String.raw`**Bar read — greatest percentage jump.** Yearly output (units): 2019: 120, 2020: 150, 2021: 135, 2022: 180. Between which consecutive years was the **percentage** increase the greatest?`,
      solution: String.raw`$$r_{19\to20} = \frac{150-120}{120} = 25\%$$
$$r_{20\to21} = \frac{135-150}{150} = -10\% \;\;(\text{a decrease — disqualified})$$
$$r_{21\to22} = \frac{180-135}{135} = \frac{45}{135} = 33\tfrac{1}{3}\%$$

Greatest percentage increase: **2021→2022, at $33\tfrac{1}{3}\%$**.`,
      trap: 'The largest absolute rise (+30, twice) is a decoy — 45 on a base of 135 beats 30 on a base of 120, but only after dividing by the base.',
      verify: { value: 33.333, expr: '((180-135)/135)*100', tol: 0.01, unit: '%' } },

    { id:'A6-E4', exam:'CSIR', anchor:'CSIR-7', covers:['line-charts','slopes-areas','bar-pie-line','maxima-minima'],
      difficulty:'standard',
      stem: String.raw`**Line read — fastest growth segment.** Sales (₹ lakh) over 2018–2022: 48, 60, 90, 84, 120. Over which year-to-year interval was the absolute growth the largest?`,
      solution: String.raw`Slopes ($\Delta$ per year):
$$\Delta_{18\to19} = 12,\quad \Delta_{19\to20} = 30,\quad \Delta_{20\to21} = -6,\quad \Delta_{21\to22} = 36$$

Largest: **2021→2022 with $\Delta = 36$ lakh** — the steepest segment, even though the series's highest point (120) sits at the end.`,
      trap: 'Height-vs-slope swap: the 2022 peak (120) is the level, not the growth — the winner is the steepest *segment between* two points (2021→2022, slope 36 vs 30).',
      verify: { value: 36, expr: '(120-84)', tol: 0.001, unit: 'lakh' } },

    { id:'A6-E5', exam:'BOTH', anchor:'CSIR-7', covers:['bar-charts','mean-median-mode-from-plots','elementary-statistics'],
      difficulty:'standard',
      stem: String.raw`**Frequency bars — weighted mean.** Students' score bands: 0–10: 4 students, 10–20: 6, 20–30: 10, 30–40: 5. Estimate the mean score using class midpoints.`,
      solution: String.raw`Midpoints: $5, 15, 25, 35$. Total students $N = 4+6+10+5 = 25$.

$$\bar{x} = \frac{(5\times 4)+(15\times 6)+(25\times 10)+(35\times 5)}{25} = \frac{20+90+250+175}{25} = \frac{535}{25} = 21.4$$`,
      trap: 'The unweighted midpoint average $(5+15+25+35)/4 = 20$ is the planted distractor — the 20–30 band alone holds 10 of the 25 students, dragging the true mean right of centre.',
      verify: { value: 21.4, expr: '((5*4)+(15*6)+(25*10)+(35*5))/(4+6+10+5)', tol: 0.001, unit: 'marks' } },

    { id:'A6-E6', exam:'CSIR', anchor:'CSIR-7', covers:['slopes-areas','line-charts','2D-3D-plots'],
      difficulty:'standard',
      stem: String.raw`**Area under rate — total production.** A pump's flow rate (units/hour) follows the piecewise-linear graph through $(0,0),\ (1,40),\ (2,40),\ (3,80),\ (4,80)$. Total units pumped in 4 hours?`,
      solution: String.raw`Sum trapezoids segment by segment ($\Delta x = 1$ h):
$$A = \frac{0+40}{2} + \frac{40+40}{2} + \frac{40+80}{2} + \frac{80+80}{2}$$
$$A = 20 + 40 + 60 + 80 = 200 \text{ units}$$`,
      trap: 'Peak × duration ($80 \times 4 = 320$) prices in triangles the graph never fills; the kinked line only averages its endpoints, trapezoid by trapezoid.',
      verify: { value: 200, expr: '((0+40)/2)+((40+40)/2)+((40+80)/2)+((80+80)/2)', tol: 0.001, unit: 'units' } },

    { id:'A6-E7', exam:'GATE', anchor:'GATE-2', covers:['tables','elementary-statistics'],
      difficulty:'standard',
      stem: String.raw`**Compare averages.** Yield trials (q/ha) of two wheat varieties over three plots each — A: 42, 48, 54 · B: 36, 54, 60. By what percentage is B's average yield higher than A's?`,
      solution: String.raw`$$\bar{A} = \frac{42+48+54}{3} = 48, \qquad \bar{B} = \frac{36+54+60}{3} = 50$$
$$\frac{\bar{B}-\bar{A}}{\bar{A}}\times 100\% = \frac{2}{48}\times 100\% = 4\tfrac{1}{6}\% \approx 4.2\%$$`,
      trap: 'Averaging the per-plot percentage differences (14.3%, 12.5%, 11.1% → 12.6%) is wrong: the question asks for the percent gap *of the averages* — compare the means, then divide.',
      verify: { value: 4.1667, expr: '((((36+54+60)/3)-((42+48+54)/3))/((42+48+54)/3))*100', tol: 0.01, unit: '%' } },

    { id:'A6-E8', exam:'BOTH', anchor:'GATE-2', covers:['line-charts','elementary-statistics','2D-3D-plots'],
      difficulty:'apex',
      stem: String.raw`**Statement verification.** Two products' revenue (₹ lakh): P: 80 (2020) → 120 (2021) · Q: 100 (2020) → 120 (2021). Evaluate: **(A)** P's increase was twice Q's increase · **(B)** Q grew faster in percentage terms · **(C)** P's 2021 revenue is 150% of Q's · **(D)** The combined 2020 revenue was ₹200 lakh. Which statement is correct?`,
      solution: String.raw`Check all four, in writing:

$$\Delta P = 120-80 = 40,\qquad \Delta Q = 120-100 = 20,\qquad \frac{\Delta P}{\Delta Q} = \frac{40}{20} = 2$$

* (A) $\Delta P = 120-80 = 40$, $\Delta Q = 120-100 = 20$ → $40 = 2\times 20$ ✔ **true**
* (B) $\%\Delta P = 50\%$, $\%\Delta Q = 20\%$ → false (P grew faster)
* (C) $120/120 = 100\%$ → false (they are equal, not 150%)
* (D) $80+100 = 180 \neq 200$ → false

Only **(A)** survives.`,
      trap: '(B) seduces because Q is "the bigger product" — but growth percentage punishes the larger base: 20 on 100 = 20% vs 40 on 80 = 50%. Size of level and size of growth run opposite here.',
      verify: { value: 2, expr: '(120-80)/(120-100)', tol: 0.001, unit: '× ratio' } },

    { id:'A6-E9', exam:'CSIR', anchor:'CSIR-7', covers:['bar-pie-line','mean-median-mode-from-plots','maxima-minima'],
      difficulty:'standard',
      stem: String.raw`**Above-average count.** Yearly rainfall (cm): 48, 60, 90, 84, 120. In how many years was rainfall above the five-year average?`,
      solution: String.raw`$$\bar{x} = \frac{48+60+90+84+120}{5} = \frac{402}{5} = 80.4 \text{ cm}$$

Above 80.4: **90, 84, and 120 → 3 years**.`,
      trap: 'The mean eats all five years — including the below-par ones (48, 60). Recomputing the mean "of the above-average years only" is circular and double-counts.',
      verify: { value: 3, expr: '((48>((48+60+90+84+120)/5))+(60>((48+60+90+84+120)/5))+(90>((48+60+90+84+120)/5))+(84>((48+60+90+84+120)/5))+(120>((48+60+90+84+120)/5)))', tol: 0, unit: 'years' } },

    { id:'A6-E10', exam:'CSIR', anchor:'CSIR-7', covers:['nested-shares','maps','tables'],
      difficulty:'apex',
      stem: String.raw`**Nested shares from a shaded map.** A state-wise production map shades State X at 40% of national output; within X, district Y contributes 30% of X's output. If national output is 2.5 lakh tonnes, what is Y's output?`,
      solution: String.raw`Nested shares multiply:
$$s_Y = 0.40 \times 0.30 = 0.12 = 12\% \text{ of national}$$
$$Y = 0.12 \times 250000 = 30{,}000 \text{ tonnes}$$`,
      trap: '$0.40 + 0.30 = 70\\%$ is the headline trap — nested percentages of *parts* multiply; only disjoint parts of the *same* whole add.',
      verify: { value: 30000, expr: '0.40*0.30*250000', tol: 1, unit: 'tonnes' } },
  ],

  /* ----- speed sheet: the 60-second pre-exam glance ----- */
  speedSheet: String.raw`## ⚡ A6 SPEED SHEET — 60 seconds before the paper

**Read order:** title → axes → **units** → legend → gridlines.
**Share** $= \text{part}/\text{whole}\times 100\%$ · **pie:** $1\% = 3.6^\circ$ · angle $\neq$ percent.
**%\change:** divide by $V_{\text{old}}$, keep the sign.
**Slope** $=\Delta y/\Delta x$ = rate. Tallest point $\neq$ fastest growth.
**Area** under a rate line $=\sum \tfrac{y_i+y_{i+1}}{2}\Delta x$ = total.
**Bars are frequencies:** $\bar{x} = \sum f_i x_i / \sum f_i$ (use midpoints). Unweighted midpoint average = trap.
**Median class:** first bar where cumulative $\ge N/2$. **Mode** = tallest bar.
**Nested shares multiply** ($0.4 \times 0.3 = 0.12$). **Percentage point** $\neq$ percent.
**Statement questions:** compute ALL options; the pretty one is the trap.
3D figures: read heights against the **back wall**. Cumulative plots: difference first, answer second.`
};

/* ======================================================= module A1 (C2) */
const MODULE_A1 = {
  id: 'A1',
  title: 'Number Sense & Arithmetic Toolkit',
  file: '🧠 A1 · Number Sense & Arithmetic Toolkit.md',
  anchors: ['CSIR-5','GATE-2'],
  anchorAtoms: {
    'CSIR-5': ['number-system','hcf-lcm','averages','percentages','profit-loss','ratio-proportion','si-ci'],
    'GATE-2': ['numerical-computation-estimation','ratios-percentages']
  },
  register: 'formula-first + trap callouts',
  figureStyle: 'dark (matches content section)',
  stage: 'C2 core numeracy',

  cards: [
    { id:'A1-C1', covers:['number-system'], head: 'The Divisibility Grammar',
      md: String.raw`Every "is it divisible" question in these exams is one of four reflexes, in this order:

**By 3 or 9 — digit sum.** Add the digits; if the sum is divisible by 3 (or 9), so is the number. Works because $10 \equiv 1 \pmod 9$, so place value contributes nothing. **By 4 or 8 — tail digits.** Last two digits decide 4 (last three decide 8), because $100$ and $1000$ are already multiples. **By 11 — alternating sum.** $d_1 - d_2 + d_3 - \cdots$ from either end; if that is a multiple of 11, the original is. **Casting out nines** as a checksum: both sides of a hand computation must share a digital root — if they don't, a carry went wrong, and the options were built on that exact slip.` },
    { id:'A1-C2', covers:['hcf-lcm'], head: 'The HCF–LCM Engine',
      md: String.raw`Prime-factor both numbers. **HCF** = shared primes at the *smaller* power; **LCM** = all primes at the *larger* power. For exactly two numbers:

$$\gcd(a,b) \times \mathrm{lcm}(a,b) = a \times b$$

Synchronization stems ("bells toll every 12, 18, 30 s — when together again?") are LCM in costume: "together again" = common multiple. Measurement stems ("largest square tile that paves 12 m × 18 m exactly") are HCF in costume: "largest that fits both" = common divisor. The product rule is a **two-number** identity — for three numbers it silently breaks, which is why the apex examples never quote it there.` },
    { id:'A1-C3', covers:['percentages','ratios-percentages'], head: 'Percent Is a Per-Cent Machine',
      md: String.raw`One identity, infinite uses:

$$x\% \text{ of } y = \frac{x}{100} \times y = y\% \text{ of } x$$

The commutativity is a tactical weapon: 8% of 25 is ugly, but 25% of 8 is 2 — same answer, three seconds saved. **Successive changes multiply, never add:** after $+a\%$ then $+b\%$,

$$\%\Delta_{\text{net}} = a + b + \frac{ab}{100}$$

so +20% then −10% nets $20 - 10 - 2 = +8\%$, not +10%. A rise *of* x% and a rise *to* x% are different sentences; read the preposition before touching the calculator.` },
    { id:'A1-C4', covers:['ratio-proportion','ratios-percentages'], head: 'Ratio Is a Scaling Class',
      md: String.raw`$a : b$ names a whole family $\{ak, bk\}$ — the same information as the fraction $a/b$. Dividing a total $T$ in the ratio $a:b:c$ gives shares

$$\text{share}_i = \frac{a_i}{a+b+c}\,T$$

Chain ratios through the middle term: A:B = 2:3 and B:C = 4:5 align only when B wears the same number in both — LCM(3,4) = 12, giving **A:B:C = 8:12:15**. The need to bridge through the shared quantity is the standard CSIR stem; the wrong move is writing 2:3:5 directly by gluing the unmatched ends.` },
    { id:'A1-C5', covers:['averages'], head: 'Averages Are Totals in Disguise',
      md: String.raw`$$\bar{x} = \frac{\sum x_i}{n} \iff \sum x_i = n\,\bar{x}$$

The mean exists to be converted into a total and back. New member joins: new total $=$ old total $+$ new value, then re-divide. Wrong entry corrected: the *total* moves by (correct − wrong), not the average. Combined groups:

$$\bar{x}_{\text{all}} = \frac{n_1\bar{x}_1 + n_2\bar{x}_2}{n_1 + n_2}$$

— weights mandatory. The grand mean is the mean of the means **only when the groups are equal**, and examiners build a distractor on the unweighted version every single time.` },
    { id:'A1-C6', covers:['profit-loss'], head: 'Profit & Loss on the Price Grid',
      md: String.raw`Three prices — cost (CP), marked (MP), selling (SP) — and two rates hanging between them:

$$\text{profit\%} = \frac{SP - CP}{CP} \times 100\% \qquad \text{discount\%} = \frac{MP - SP}{MP} \times 100\%$$

The denominators differ and that is the entire subject: **profit is priced on CP, discount on MP.** A mark-up of 50% followed by a 20% discount therefore nets $1.5 \times 0.8 = 1.20$, i.e. +20% on cost — never $50 - 20 = 30\%$. When two successive discounts are offered, they multiply the same way: $0.9 \times 0.9 = 0.81$ is a 19% total discount, not 18%.` },
    { id:'A1-C7', covers:['si-ci'], head: 'SI Grows Linearly, CI Compounds',
      md: String.raw`$$SI = \frac{PRT}{100} \qquad\qquad A = P\left(1 + \frac{r}{100}\right)^{t}$$

Simple interest is the same slab of $Pr/100$ every year; compound interest adds last year's interest to the base, so it is a geometric progression wearing a banking stem (bridge: A2-C7). For a two-year window the difference collapses to one clean identity:

$$CI - SI = P\left(\frac{r}{100}\right)^{2} \quad (\text{2 years only})$$

That form is the single most-repeated CSIR Part A interest question this decade. For three years it changes shape — the two-year shortcut applied to a three-year stem is a named trap.` },
    { id:'A1-C8', covers:['numerical-computation-estimation'], head: 'Estimate First, Compute Second',
      md: String.raw`GA options are spaced a factor of 2–10 apart; they are begging to be eliminated by bracketing. Round each factor to a friendly anchor ($19.95 \to 20$, $5.04 \to 5$, $24.8 \to 25$), multiply, and the surviving option is usually alone. Audits that take one second each:

* **Order of magnitude** — count digits before any digit-checking; a misplaced decimal is the most common expensive error.
* **Last digit / parity** — a product of an even and an odd number cannot end in 3.
* **Sanity direction** — a 19% growth cannot produce a smaller number; a 45% share cannot exceed half.

Do the estimate *before* the exact arithmetic, so a sign slip has something to collide with.` },
  ],

  formulas: [
    { name:'Percent of',           tex: String.raw`x\% \text{ of } y = \dfrac{x}{100}\,y` },
    { name:'Successive change',    tex: String.raw`\%\Delta = a + b + \dfrac{ab}{100}` },
    { name:'Reverse percent',      tex: String.raw`V_{\text{old}} = \dfrac{V_{\text{new}}}{1 + r/100}` },
    { name:'HCF×LCM (2 numbers)', tex: String.raw`\gcd(a,b)\,\mathrm{lcm}(a,b) = ab` },
    { name:'Ratio share',          tex: String.raw`\text{share}_i = \dfrac{a_i}{\sum a}\,T` },
    { name:'Combined mean',        tex: String.raw`\bar{x} = \dfrac{n_1\bar{x}_1 + n_2\bar{x}_2}{n_1+n_2}` },
    { name:'Profit %',             tex: String.raw`\text{profit\%} = \dfrac{SP-CP}{CP}\times 100\%` },
    { name:'Discount chain',       tex: String.raw`SP = MP\,(1-\tfrac{d_1}{100})(1-\tfrac{d_2}{100})` },
    { name:'Simple interest',      tex: String.raw`SI = \dfrac{PRT}{100}` },
    { name:'Compound amount',      tex: String.raw`A = P\left(1+\dfrac{r}{100}\right)^{t}` },
    { name:'CI−SI (2 yr)',         tex: String.raw`CI - SI = P\left(\dfrac{r}{100}\right)^{2}` },
    { name:'Divisibility by 9',    tex: String.raw`n \equiv \text{digit-sum}(n) \pmod 9` },
  ],

  examples: [
    { id:'A1-E1', exam:'BOTH', anchor:'GATE-2', covers:['percentages','ratios-percentages'],
      difficulty:'seed',
      stem: String.raw`**Percent increase.** A town's population of 45,000 grows by 12% in a year. What is the new population?`,
      solution: String.raw`$$45000 \times \left(1 + \frac{12}{100}\right) = 45000 \times 1.12 = 50{,}400$$`,
      trap: String.raw`Adding $12$ to $45{,}000$ or computing only the *increase* ($5400$) and reporting it as the population — the stem asks for the new total, so the $1 +$ inside the bracket is non-negotiable.`,
      verify: { value: 50400, expr: '45000*(1+12/100)', tol: 0.001, unit: 'people' } },

    { id:'A1-E2', exam:'BOTH', anchor:'CSIR-5', covers:['ratio-proportion','ratios-percentages'],
      difficulty:'seed',
      stem: String.raw`**Divide in a ratio.** ₹1,080 is split between two brothers in the ratio 4:5. How much does the elder (larger share) receive?`,
      solution: String.raw`Total parts $= 4 + 5 = 9$.
$$\text{elder} = \frac{5}{9} \times 1080 = 5 \times 120 = 600$$
So the elder receives **₹600**.
*(And the younger gets $4 \times 120 = 480$; the two shares sum back to $1080$ — free checksum.)*`,
      trap: String.raw`Taking $5/4 \times 1080$ (part-to-part on the total) or splitting 1080 in half first and then ratio-ing. Shares are always *part of the sum of parts*, never of another part.`,
      verify: { value: 600, expr: '1080*(5/(4+5))', tol: 0.001, unit: '₹' } },

    { id:'A1-E3', exam:'CSIR', anchor:'CSIR-5', covers:['hcf-lcm'],
      difficulty:'standard',
      stem: String.raw`**Product rule.** The HCF of two numbers is 6 and their LCM is 180. One number is 36. Find the other.`,
      solution: String.raw`$$\gcd \times \mathrm{lcm} = a \times b \;\Rightarrow\; b = \frac{6 \times 180}{36} = \frac{1080}{36} = 30$$
*(Check: $\gcd(36,30) = 6$ ✓ and $\mathrm{lcm}(36,30) = 180$ ✓.)*`,
      trap: String.raw`This identity is valid for exactly **two** numbers. Stems with three numbers offering the same shortcut are bait — with three numbers, $\gcd \times \mathrm{lcm}$ has no fixed relation to the product.`,
      verify: { value: 30, expr: '(6*180)/36', tol: 0.001, unit: '' } },

    { id:'A1-E4', exam:'CSIR', anchor:'CSIR-5', covers:['averages'],
      difficulty:'standard',
      stem: String.raw`**Average update.** The average score of 9 players is 50. A tenth player joins and scores 86. What is the new average?`,
      solution: String.raw`$$\text{old total} = 9 \times 50 = 450$$
$$\bar{x}_{\text{new}} = \frac{450 + 86}{10} = \frac{536}{10} = 53.6$$`,
      trap: String.raw`Averaging 50 and 86 to get 68 treats the two groups as equal in size — the 9 players outweigh the newcomer nine to one, so the answer must sit near 50, nowhere near 68.`,
      verify: { value: 53.6, expr: '((9*50)+86)/10', tol: 0.001, unit: 'runs' } },

    { id:'A1-E5', exam:'BOTH', anchor:'CSIR-5', covers:['profit-loss','percentages'],
      difficulty:'standard',
      stem: String.raw`**Profit percent.** A trader buys a mixer at ₹240 and sells it at ₹276. What is the profit percentage?`,
      solution: String.raw`$$\text{profit\%} = \frac{276 - 240}{240} \times 100\% = \frac{36}{240} \times 100\% = 15\%$$`,
      trap: String.raw`Dividing by the selling price ($36/276 = 13.04\%$) is the classic mirror-trap: profit and loss percentages ride on the **cost** price unless the stem explicitly says "on the selling price".`,
      verify: { value: 15, expr: '((276-240)/240)*100', tol: 0.001, unit: '%' } },

    { id:'A1-E6', exam:'CSIR', anchor:'CSIR-5', covers:['si-ci'],
      difficulty:'standard',
      stem: String.raw`**CI − SI gap.** For a principal of ₹8,000 at 10% per annum over 2 years, by how much does compound interest exceed simple interest?`,
      solution: String.raw`Two-year identity:
$$CI - SI = P\left(\frac{r}{100}\right)^{2} = 8000 \times (0.1)^2 = 8000 \times 0.01 = 80$$
*(Audit: $SI = \frac{8000 \times 10 \times 2}{100} = 1600$; $CI = 8000(1.1)^2 - 8000 = 9680 - 8000 = 1680$; gap $= 80$ ✓.)*`,
      trap: String.raw`The identity holds for **two years only**. For three years the gap is $P(r/100)^2(3 + r/100)$ — applying the squared form to a 3-year stem undercounts the third year's interest-on-interest.`,
      verify: { value: 80, expr: '8000*((10/100)*(10/100))', tol: 0.001, unit: '₹' } },

    { id:'A1-E7', exam:'CSIR', anchor:'CSIR-5', covers:['percentages','ratios-percentages'],
      difficulty:'apex',
      stem: String.raw`**Successive changes.** The price of a stock rises 20% in January and falls 10% in February. What is the net percentage change over the two months?`,
      solution: String.raw`$$\%\Delta = a + b + \frac{ab}{100} = 20 + (-10) + \frac{20 \times (-10)}{100} = 10 - 2 = +8\%$$
Multiplier view: $1.20 \times 0.90 = 1.08$ → the stock ends **8% above** its December price.`,
      trap: String.raw`$20 - 10 = +10\%$ is the headline distractor. The February fall acts on a *larger* (post-rise) base, so it eats 2 extra percentage points — the $ab/100$ term is the price of the base shift.`,
      verify: { value: 8, expr: '((1+20/100)*(1-10/100)-1)*100', tol: 0.001, unit: '%' } },

    { id:'A1-E8', exam:'GATE', anchor:'GATE-2', covers:['numerical-computation-estimation'],
      difficulty:'standard',
      stem: String.raw`**Estimation bracket.** Choose the closest value of $\dfrac{49.98 \times 10.1}{24.9}$: (A) 2 · (B) 20 · (C) 200 · (D) 2000.`,
      solution: String.raw`Round to anchors: $49.98 \to 50$, $10.1 \to 10$, $24.9 \to 25$.
$$\frac{50 \times 10}{25} = \frac{500}{25} = 20$$
Only **(B) 20** survives the order-of-magnitude audit ($50 \times 10 = 500$ is two digits; dividing by 25 stays two digits).`,
      trap: String.raw`This question's real payload is the decimal-point discipline: the exact value $\approx 20.27$ sits between options by a factor of ten on each side, so any placement error is fatal while any rounding error is free.`,
      verify: { value: 20, expr: '(50*10)/25', tol: 0.001, unit: '' } },

    { id:'A1-E9', exam:'CSIR', anchor:'CSIR-5', covers:['number-system','averages'],
      difficulty:'standard',
      stem: String.raw`**Divisibility check.** What is the remainder when $2^{10} + 3^{5}$ is divided by 7?`,
      solution: String.raw`$$2^{10} + 3^{5} = 1024 + 243 = 1267$$
$$1267 = 7 \times 181 + 0 \;\Rightarrow\; \text{remainder} = 0$$`,
      trap: String.raw`Remainder-hopping ($2^{10} \bmod 7$ plus $3^{5} \bmod 7$ each computed differently and then re-added wrongly) fails when the sum overshoots 7 and is never re-reduced. Computing the small total first is safer at this size.`,
      verify: { value: 0, expr: '((2**10)+(3**5))%7', tol: 0, unit: '' } },

    { id:'A1-E10', exam:'GATE', anchor:'GATE-2', covers:['percentages','ratios-percentages','numerical-computation-estimation'],
      difficulty:'apex',
      stem: String.raw`**Election margin.** Of 8,500 valid votes, the winner takes 62%. By how many votes did the winner beat the loser?`,
      solution: String.raw`Loser's share $= 100\% - 62\% = 38\%$; margin share $= 62\% - 38\% = 24\%$.
$$\text{margin} = \frac{24}{100} \times 8500 = 24 \times 85 = 2040 \text{ votes}$$`,
      trap: String.raw`Answering the winner's count ($0.62 \times 8500 = 5270$) instead of the **margin** — the stem asks for the *difference*, and $5270$ is always printed as an option to catch exactly that.`,
      verify: { value: 2040, expr: '8500*(0.62-0.38)', tol: 0.001, unit: 'votes' } },
  ],

  speedSheet: String.raw`## ⚡ A1 SPEED SHEET — 60 seconds before the paper

**Percent:** $x\% \text{ of } y = y\% \text{ of } x$ · successive: $a+b+\tfrac{ab}{100}$ (signs included).
**Reverse:** old $= \dfrac{\text{new}}{1+r/100}$ — never subtract r% of the *new* value.
**Ratio:** part $= \frac{a_i}{\sum a}T$ · chain A:B, B:C through LCM of B.
**HCF×LCM** $= ab$ for **two** numbers only. "Together again" → LCM · "largest that fits" → HCF.
**Averages:** convert to **total**, mutate, re-divide. Combined mean is weighted.
**Profit on CP · discount on MP.** Successive discounts multiply.
**$SI=\frac{PRT}{100}$** · $CI$: $A=P(1+\tfrac{r}{100})^t$ · 2-yr gap $=P(\tfrac{r}{100})^2$.
**Divisibility:** digit-sum (3,9) · tail digits (4,8) · alternating sum (11).
**Estimate first:** anchors → order of magnitude → parity → then exact arithmetic.`
};

/* ======================================================= module A2 (C2) */
const MODULE_A2 = {
  id: 'A2',
  title: 'Algebra, Series & Progressions',
  file: '🧠 A2 · Algebra, Series & Progressions.md',
  anchors: ['CSIR-5','GATE-2'],
  anchorAtoms: {
    'CSIR-5': ['exponents-logarithms','series-progressions'],
    'GATE-2': ['powers-exponents-logarithms','series']
  },
  register: 'formula-first + trap callouts',
  figureStyle: 'dark (matches content section)',
  stage: 'C2 core numeracy',

  cards: [
    { id:'A2-C1', covers:['powers-exponents-logarithms','exponents-logarithms'], head: 'Exponent Grammar',
      md: String.raw`Three laws run the whole wing:

$$a^m \cdot a^n = a^{m+n} \qquad (a^m)^n = a^{mn} \qquad a^{-n} = \frac{1}{a^n}, \quad a^{1/n} = \sqrt[n]{a}$$

Everything else is commentary: $\dfrac{a^m}{a^n} = a^{m-n}$ is law 1 wearing division, and $a^0 = 1$ is what law 1 forces when $m = -n$. Memorized-power spine worth having cold: $2^{10} = 1024 \approx 10^3$ (the estimation bridge), squares to $25^2 = 625$, cubes to $12^3 = 1728$. The product-to-power confusion — writing $2^3 \times 2^4 = 2^{12}$ — is the single most common exponent bleed.` },
    { id:'A2-C2', covers:['exponents-logarithms','powers-exponents-logarithms'], head: 'The Logarithm Is a Question',
      md: String.raw`$\log_b x$ asks: *"to what power must $b$ be raised to get $x$?"* Every log law is an exponent law wearing a question mark:

$$\log(xy) = \log x + \log y \qquad \log\tfrac{x}{y} = \log x - \log y \qquad \log(x^n) = n\log x$$

Change of base: $\log_b x = \dfrac{\log x}{\log b}$ (any base, both sides the same). And the two reflexes: $\log_b 1 = 0$ for **every** base (because $b^0 = 1$), and $\log_b b = 1$. The law that *doesn't* exist — $\log(x+y)$ has no expansion — is printed as an option in both exams.` },
    { id:'A2-C3', covers:['series-progressions','series'], head: 'AP Anatomy',
      md: String.raw`An arithmetic progression adds the same $d$ every step. Its two workhorses:

$$a_n = a + (n-1)d \qquad S_n = \frac{n}{2}\left(2a + (n-1)d\right) = \frac{n}{2}(a + \ell)$$

The $n-1$ is not decoration: the first term is reached after **zero** steps, so the $n$-th term needs only $n-1$ jumps. Sum trick worth internalizing — the mean of an AP equals the mean of its first and last terms, so $S_n = n \times \tfrac{a+\ell}{2}$. Three numbers in AP are parameterized as $a-d,\ a,\ a+d$: symmetric, and the sum collapses to $3a$ instantly.` },
    { id:'A2-C4', covers:['series-progressions','series'], head: 'GP Anatomy',
      md: String.raw`A geometric progression multiplies by the same $r$ every step:

$$a_n = a\,r^{\,n-1} \qquad S_n = a\,\frac{r^n - 1}{r - 1}\ (r \neq 1) \qquad S_\infty = \frac{a}{1-r}\ (|r|<1)$$

Same counting discipline as the AP: $n$ terms, but the exponent runs only to $n-1$. The infinite sum exists **only** when $|r| < 1$ — a stem summing $1 + 2 + 4 + \cdots$ "to infinity" is divergent bait. Compound interest is a GP with ratio $(1 + r/100)$; population doubling is a GP with ratio 2 (bridge: A1-C7).` },
    { id:'A2-C5', covers:['series'], head: 'Series-Recognition Grammar',
      md: String.raw`Odd-one-out and next-term stems yield to a four-step interrogation, in order:

1. **Differences constant?** → arithmetic.
2. **Ratios constant?** → geometric.
3. **Second differences constant?** → quadratic pattern ($n^2$, $n(n+1)$, …).
4. **Alternating?** → two interleaved series; unpick them separately.

After that, suspect squares/cubes $\pm k$, primes, or digit operations. The discipline is to *name* the rule before extrapolating — a series continued by the wrong named rule is the whole design of the odd-one-out distractor set.` },
    { id:'A2-C6', covers:['series-progressions','series'], head: 'Special Sums Worth Owning',
      md: String.raw`$$1+2+\cdots+n = \frac{n(n+1)}{2} \qquad 1^2+\cdots+n^2 = \frac{n(n+1)(2n+1)}{6}$$

$$1^3 + \cdots + n^3 = \left(\frac{n(n+1)}{2}\right)^2$$

The first sum is Gauss's pairing (first+last, $n/2$ pairs); the cubes identity — sum of cubes equals the *square* of the sum — is a favourite "spot the structure" stem. Summing $1+3+5+\cdots$ (first $n$ odds) gives exactly $n^2$: the difference of consecutive squares is the next odd number, which is why square-spotting works in card A2-C5.` },
    { id:'A2-C7', covers:['powers-exponents-logarithms','series'], head: 'Log–Exponential Bridge & Estimation',
      md: String.raw`With $\log_{10} 2 \approx 0.3010$ (given in the paper when needed), every power of 2 becomes decimal-sized: $2^{10} = 1024 \Rightarrow \log_{10} 1024 = 10 \times 0.3010 = 3.010 \Rightarrow 2^{10} \approx 10^3$. That one bridge powers all "order of magnitude of $2^{40}$" stems:

$$2^{40} = (2^{10})^4 \approx (10^3)^4 = 10^{12}$$

Estimation questions never need the full expansion — they need the exponent of 10, and the $\approx 10^3$ anchor delivers it in one look.` },
    { id:'A2-C8', covers:['series-progressions','series','powers-exponents-logarithms'], head: 'Mixed-Series Trap Anthology',
      md: String.raw`The recurring ambushes in the series wing:

1. **$n$ vs $n-1$** — first term at jump zero (AP) / exponent zero (GP).  \n2. **Sum-vs-term swap** — the stem asks $S_n$, the reflex computes $a_n$ (or back).  \n3. **$S_\infty$ without $|r|<1$** — divergence check first, always.  \n4. **Log of a sum** — $\log(x+y) \neq \log x + \log y$; no law exists.  \n5. **Doubling-forever** — a quadratic series ($n(n+1)$) mistaken for GP doubling at the second step only.` },
  ],

  formulas: [
    { name:'Product of powers',  tex: String.raw`a^m a^n = a^{m+n}` },
    { name:'Power of power',     tex: String.raw`(a^m)^n = a^{mn}` },
    { name:'Negative exponent',  tex: String.raw`a^{-n} = \dfrac{1}{a^n}` },
    { name:'Log product law',    tex: String.raw`\log(xy) = \log x + \log y` },
    { name:'Log power law',      tex: String.raw`\log(x^n) = n\log x` },
    { name:'Change of base',     tex: String.raw`\log_b x = \dfrac{\log x}{\log b}` },
    { name:'AP nth term',        tex: String.raw`a_n = a + (n-1)d` },
    { name:'AP sum',             tex: String.raw`S_n = \dfrac{n}{2}(a+\ell)` },
    { name:'GP nth term',        tex: String.raw`a_n = a\,r^{\,n-1}` },
    { name:'GP sum',             tex: String.raw`S_n = a\,\dfrac{r^n-1}{r-1}` },
    { name:'GP infinite sum',    tex: String.raw`S_\infty = \dfrac{a}{1-r}\ (|r|<1)` },
    { name:'First n naturals',   tex: String.raw`\sum_{k=1}^{n} k = \dfrac{n(n+1)}{2}` },
  ],

  examples: [
    { id:'A2-E1', exam:'BOTH', anchor:'GATE-2', covers:['powers-exponents-logarithms'],
      difficulty:'seed',
      stem: String.raw`**Exponent arithmetic.** Evaluate $2^{10} \times 2^{5} \div 2^{12}$.`,
      solution: String.raw`$$2^{10} \times 2^{5} \div 2^{12} = 2^{10+5-12} = 2^{3} = 8$$
*(Audit by expansion: $1024 \times 32 = 32{,}768$; $32{,}768 / 4096 = 8$ ✓.)*`,
      trap: String.raw`Multiplying the exponents ($10 \times 5 / 12$, a non-integer red flag) or adding under division as $10 + 5 + 12$. Products add exponents; quotients subtract them.`,
      verify: { value: 8, expr: '(1024*32)/4096', tol: 0.001, unit: '' } },

    { id:'A2-E2', exam:'BOTH', anchor:'GATE-2', covers:['powers-exponents-logarithms','exponents-logarithms'],
      difficulty:'seed',
      stem: String.raw`**Log read.** Given $\log_{10} 2 = 0.3010$, find $\log_{10} 32$.`,
      solution: String.raw`$$32 = 2^5 \;\Rightarrow\; \log_{10} 32 = 5 \times \log_{10} 2 = 5 \times 0.3010 = 1.5050$$`,
      trap: String.raw`$\log 2 + \log 2 + \cdots$ five times also works, but $32 \times 0.3010 = 9.63$ (multiplying the *argument* by the log) is the designed error — the 5 belongs outside as a multiplier, because $32 = 2^5$.`,
      verify: { value: 1.505, expr: '5*0.301', tol: 0.0001, unit: '' } },

    { id:'A2-E3', exam:'CSIR', anchor:'CSIR-5', covers:['series-progressions'],
      difficulty:'standard',
      stem: String.raw`**AP term.** An arithmetic progression begins 5, 9, 13, … What is its 15th term?`,
      solution: String.raw`$a = 5$, $d = 9 - 5 = 4$.
$$a_{15} = a + (15-1)\,d = 5 + 14 \times 4 = 5 + 56 = 61$$`,
      trap: String.raw`Using $15 \times 4$ instead of $14 \times 4$ (giving 65, which is printed). The first term is term number 1 at **zero** gaps — the 15th term sits $15-1 = 14$ gaps out.`,
      verify: { value: 61, expr: '5+((15-1)*4)', tol: 0.001, unit: '' } },

    { id:'A2-E4', exam:'CSIR', anchor:'CSIR-5', covers:['series-progressions'],
      difficulty:'standard',
      stem: String.raw`**AP sum.** Find the sum of the first 20 terms of the AP $3, 7, 11, \ldots$`,
      solution: String.raw`$a = 3$, $d = 4$, $n = 20$:
$$S_{20} = \frac{20}{2}\left(2 \times 3 + 19 \times 4\right) = 10 \times (6 + 76) = 10 \times 82 = 820$$`,
      trap: String.raw`The Gauss shortcut $\frac{n}{2}(a+\ell)$ needs the last term $\ell = a_{20} = 3 + 76 = 79$ first; substituting $d$ where $\ell$ belongs ($10 \times (3+4) = 70$) is the stocked wrong answer.`,
      verify: { value: 820, expr: '10*((2*3)+(19*4))', tol: 0.001, unit: '' } },

    { id:'A2-E5', exam:'BOTH', anchor:'CSIR-5', covers:['series-progressions','exponents-logarithms'],
      difficulty:'standard',
      stem: String.raw`**GP term.** A bacterial colony triples every hour, starting from 2 colonies. How many colonies after 7 rounds of multiplication (i.e. the 8th term of the progression)?`,
      solution: String.raw`$a = 2$, $r = 3$, and the 8th term carries exponent $8 - 1 = 7$:
$$a_8 = a\,r^{7} = 2 \times 3^{7} = 2 \times 2187 = 4374$$`,
      trap: String.raw`Exponent confusion is the whole question: "after 7 hours" is the **8th** term with exponent 7, not exponent 8 ($2 \times 3^8 = 13{,}122$ — the planted overshoot).`,
      verify: { value: 4374, expr: '2*(3**7)', tol: 0.001, unit: 'colonies' } },

    { id:'A2-E6', exam:'GATE', anchor:'GATE-2', covers:['series'],
      difficulty:'standard',
      stem: String.raw`**Infinite GP.** Evaluate $1 + \dfrac{1}{2} + \dfrac{1}{4} + \dfrac{1}{8} + \cdots$ to infinity.`,
      solution: String.raw`$a = 1$, $r = \tfrac{1}{2}$ with $|r| < 1$, so the sum converges:
$$S_\infty = \frac{a}{1-r} = \frac{1}{1-\frac12} = \frac{1}{\frac12} = 2$$`,
      trap: String.raw`Applying the formula without the $|r|<1$ check — a series like $1 + 2 + 4 + \cdots$ "sums to $\frac{1}{1-2} = -1$" only if you let the formula lie. Convergence first, formula second.`,
      verify: { value: 2, expr: '1/(1-0.5)', tol: 0.001, unit: '' } },

    { id:'A2-E7', exam:'CSIR', anchor:'CSIR-5', covers:['series','series-progressions'],
      difficulty:'apex',
      stem: String.raw`**Odd one out.** In the series $2, 6, 12, 20, 32, 42, 56$, exactly one term is wrong. Which number should stand in its place?`,
      solution: String.raw`Differences: $4, 6, 8, \mathbf{12}, 10, 14$ — irregular. Try the named pattern $n(n+1)$:
$$1{\cdot}2=2,\; 2{\cdot}3=6,\; 3{\cdot}4=12,\; 4{\cdot}5=20,\; \mathbf{5{\cdot}6=30},\; 6{\cdot}7=42,\; 7{\cdot}8=56$$
Every term fits except the fifth: **32 should be 30**.`,
      trap: String.raw`Reading the series as doubling ($2, 6, 12$ look "roughly ×2, ×2") accepts 32 as fine and moves on. Naming the rule $n(n+1)$ — not vibes — is what convicts 32.`,
      verify: { value: 30, expr: '5*6', tol: 0.001, unit: '' } },

    { id:'A2-E8', exam:'GATE', anchor:'GATE-2', covers:['powers-exponents-logarithms','series'],
      difficulty:'apex',
      stem: String.raw`**Log equation.** Solve for positive $x$: $\log_{10} x + \log_{10}(x - 3) = 1$.`,
      solution: String.raw`Combine: $\log_{10}\big(x(x-3)\big) = 1 \Rightarrow x(x-3) = 10^1 = 10$.
$$x^2 - 3x - 10 = 0 \;\Rightarrow\; x = \frac{3 + \sqrt{9 + 40}}{2} = \frac{3 + 7}{2} = 5$$
(The other root, $-2$, is rejected — a logarithm's argument must be positive.)
*Check: $\log 5 + \log 2 = \log 10 = 1$ ✓.*`,
      trap: String.raw`Splitting into $\log x + \log x - \log 3$ (inventing a law) or — subtler — keeping both quadratic roots. The domain filter ($x > 3$ here, since $x-3 > 0$) is part of the answer, not an afterthought.`,
      verify: { value: 5, expr: '(3+Math.sqrt(9+40))/2', tol: 0.001, unit: '' } },
  ],

  speedSheet: String.raw`## ⚡ A2 SPEED SHEET — 60 seconds before the paper

**Exponents:** products add, powers multiply, negatives flip: $a^m a^n = a^{m+n}$ · $(a^m)^n = a^{mn}$ · $a^{-n} = 1/a^n$. · $2^{10} = 1024 \approx 10^3$.
**Logs:** $\log(xy)$ adds · $\log(x/y)$ subtracts · $\log x^n = n\log x$ · $\log_b x = \frac{\log x}{\log b}$ · $\log 1 = 0$ · **no law for $\log(x+y)$**.
**AP:** $a_n = a + (n-1)d$ · $S_n = \frac{n}{2}(a+\ell)$ · three-in-AP: take $a-d,\,a,\,a+d$.
**GP:** $a_n = ar^{n-1}$ · $S_n = a\frac{r^n-1}{r-1}$ · $S_\infty = \frac{a}{1-r}$ only if $|r|<1$ · CI is a GP.
**Sums:** $\sum k = \frac{n(n+1)}{2}$ · odds sum to $n^2$.
**Series stems:** differences → ratios → second differences → alternating split. **Name the rule first.**
**Counting discipline:** $n$ terms = $n-1$ gaps/exponent jumps.`
};

/* ======================================================= module A3 (C2) */
const MODULE_A3 = {
  id: 'A3',
  title: 'Counting & Probability',
  file: '🧠 A3 · Counting & Probability.md',
  anchors: ['CSIR-5','GATE-2'],
  anchorAtoms: {
    'CSIR-5': ['p-and-c','probability'],
    'GATE-2': ['permutations-combinations','probability']
  },
  register: 'formula-first + trap callouts',
  figureStyle: 'dark (matches content section)',
  stage: 'C2 core numeracy',

  cards: [
    { id:'A3-C1', covers:['p-and-c','permutations-combinations'], head: 'The Slot Machine (Multiplication Principle)',
      md: String.raw`If a task is done in independent stages with $n_1, n_2, \ldots, n_k$ options per stage, the total number of outcomes is

$$n_1 \times n_2 \times \cdots \times n_k$$

Draw the slots first, then fill the counts. "3-digit numbers using 1–9 without repetition" is three slots: $9 \times 8 \times 7$ — each filled slot shrinks the next only because repetition is banned. If repetition is allowed, every slot keeps all 9. The stem's repetition clause is the entire question; underline it before counting.` },
    { id:'A3-C2', covers:['permutations-combinations','p-and-c'], head: 'Permutations = Order Matters',
      md: String.raw`$$P(n,r) = \frac{n!}{(n-r)!} \qquad \text{all } n \text{ in a line: } n! \qquad \text{around a circle: } (n-1)!$$

Line-ups, rankings, codes, "first/second/third prize" — anything where swapping two names produces a *different* outcome is a permutation. The circular count $(n-1)!$ removes the $n$ rotations that are really the same seating (fix one person, arrange the rest). Bead necklaces divide once more by 2 for flipping, but CSIR/GATE rarely go past circles.` },
    { id:'A3-C3', covers:['permutations-combinations','p-and-c'], head: "Combinations = Order Doesn't Matter",
      md: String.raw`\binom{n}{r} = \frac{n!}{r!\,(n-r)!} \qquad \binom{n}{r} = \binom{n}{n-r}

Committees, teams, hands of cards: choosing $r$ from $n$ where the internal order is irrelevant. The $r!$ in the denominator *is* the de-ordering — it's exactly the number of ways the chosen $r$ could have been lined up. Quick computation: cancel before multiplying, $\binom{8}{3} = \frac{8 \times 7 \times 6}{3 \times 2 \times 1} = 56$, never compute the factorials raw. The symmetry $\binom{n}{r} = \binom{n}{n-r}$ halves the work: $\binom{10}{8} = \binom{10}{2} = 45$.` },
    { id:'A3-C4', covers:['probability'], head: '"At Least One" → Complement',
      md: String.raw`$$P(\text{at least one}) = 1 - P(\text{none})$$

Direct counting of "at least one" splays into overlapping cases and double-counts; the complement is one clean case. "At least one head in 3 tosses" $= 1 - (\tfrac{1}{2})^3 = \tfrac{7}{8}$, in a single line. The same move solves "at least one six in 4 dice throws" and "at least one defective in a sample". Reflex: the phrase *at least* should physically push your pen toward $1 - P(\text{none})$.` },
    { id:'A3-C5', covers:['probability'], head: 'Classical Probability = Counting in a Ratio',
      md: String.raw`$$P(E) = \frac{\text{favourable outcomes}}{\text{total outcomes}} \qquad (\text{all equally likely})$$

Know the standard sample spaces cold: one die $\to 6$; two dice $\to \mathbf{36}$ ordered pairs (sum 7 has 6 of them — the maximum); a coin flipped $n$ times $\to 2^n$; a card deck $\to 52 = 4$ suits × 13 ranks, 12 face cards, 26 red. Two-dice sums are triangular — 2 and 12 get one pair each, 7 gets six — so "sum 7" is six times as likely as "sum 2", a ratio the options love to flatten.` },
    { id:'A3-C6', covers:['probability'], head: 'Union, Intersection, Exclusion',
      md: String.raw`$$P(A \cup B) = P(A) + P(B) - P(A \cap B)$$

The subtraction of the overlap is not optional — without it the intersection is counted twice. Mutually exclusive events have $P(A \cap B) = 0$, and only then do bare probabilities add. In counting form, the same correction is $|A \cup B| = |A| + |B| - |A \cap B|$, the engine behind "divisible by 2 **or** 3" stems: add the two counts, then remove the multiples of 6 you counted twice.` },
    { id:'A3-C7', covers:['probability'], head: 'Independence & the Replacement Clause',
      md: String.raw`Independent events multiply:

$$P(A \cap B) = P(A)\,P(B) \quad (\text{independent})$$

Two separate dice are independent; two draws from one bag are independent **only with replacement**. Without replacement the second probability re-denominates: drawing 2 reds from 5 red + 3 blue without replacement is $\tfrac{5}{8} \times \tfrac{4}{7}$, not $\tfrac{5}{8} \times \tfrac{5}{8}$. The stem's replacement clause is the entire design — "with" keeps the denominator, "without" shrinks both numerator and denominator.` },
    { id:'A3-C8', covers:['probability'], head: 'Conditional Probability Lite',
      md: String.raw`$$P(A \mid B) = \frac{P(A \cap B)}{P(B)}$$

Conditioning is a change of universe: once $B$ is known, the sample space shrinks to $B$'s outcomes only. GATE/CSIR stay at this level — box-choice and card-given-colour stems — so the table method suffices: write joint probabilities in a grid, restrict to the row/column the condition names, renormalize. The two directions are different numbers in general: $P(A \mid B) \neq P(B \mid A)$, and confusing them is the stocked trap (worked in E8).` },
  ],

  formulas: [
    { name:'Slots principle',      tex: String.raw`N = n_1 \times n_2 \times \cdots \times n_k` },
    { name:'Permutations',         tex: String.raw`P(n,r) = \dfrac{n!}{(n-r)!}` },
    { name:'Combinations',         tex: String.raw`\binom{n}{r} = \dfrac{n!}{r!(n-r)!}` },
    { name:'Combination symmetry', tex: String.raw`\binom{n}{r} = \binom{n}{n-r}` },
    { name:'Circular seating',     tex: String.raw`(n-1)!` },
    { name:'Classical P',          tex: String.raw`P(E) = \dfrac{|E|}{|S|}` },
    { name:'Complement',           tex: String.raw`P(A^\prime) = 1 - P(A)` },
    { name:'Union',                tex: String.raw`P(A \cup B) = P(A) + P(B) - P(A \cap B)` },
    { name:'Independence',         tex: String.raw`P(A \cap B) = P(A)\,P(B)` },
    { name:'Conditional',          tex: String.raw`P(A \mid B) = \dfrac{P(A \cap B)}{P(B)}` },
  ],

  examples: [
    { id:'A3-E1', exam:'BOTH', anchor:'CSIR-5', covers:['p-and-c'],
      difficulty:'seed',
      stem: String.raw`**Slots.** How many 3-digit numbers can be formed using the digits 1–9, with no digit repeated?`,
      solution: String.raw`Three slots; each choice shrinks the pool:
$$9 \times 8 \times 7 = 504$$`,
      trap: String.raw`With repetition allowed the count would be $9^3 = 729$ — the repetition clause is the entire question. (Zero is not in the digit pool here, so no leading-zero surgery is needed; if 0 were allowed, the hundreds slot would be handled first.)`,
      verify: { value: 504, expr: '9*8*7', tol: 0.001, unit: 'numbers' } },

    { id:'A3-E2', exam:'GATE', anchor:'GATE-2', covers:['permutations-combinations'],
      difficulty:'standard',
      stem: String.raw`**Committee.** In how many ways can a committee of 3 be chosen from 8 candidates?`,
      solution: String.raw`Order inside a committee is irrelevant:
$$\binom{8}{3} = \frac{8 \times 7 \times 6}{3 \times 2 \times 1} = \frac{336}{6} = 56$$`,
      trap: String.raw`Answering $P(8,3) = 336$ counts each committee $3! = 6$ times — once per internal ordering. "Choose/select/committee" → combination; "arrange/rank/prize" → permutation.`,
      verify: { value: 56, expr: '(8*7*6)/(3*2*1)', tol: 0.001, unit: 'committees' } },

    { id:'A3-E3', exam:'CSIR', anchor:'CSIR-5', covers:['p-and-c'],
      difficulty:'standard',
      stem: String.raw`**Together-gluing.** Five people stand in a row. In how many arrangements do two particular friends stand next to each other?`,
      solution: String.raw`Glue the pair into one block: 4 blocks arrange in $4!$ ways; the block's own members swap in $2!$:
$$4! \times 2! = 24 \times 2 = 48$$`,
      trap: String.raw`Forgetting the internal $2!$ (answering 24) or the gluing itself (answering $5! = 120$). Constraint questions always price the constraint **and** the constraint's internal freedom.`,
      verify: { value: 48, expr: '(4*3*2*1)*(2*1)', tol: 0.001, unit: 'arrangements' } },

    { id:'A3-E4', exam:'BOTH', anchor:'CSIR-5', covers:['probability'],
      difficulty:'seed',
      stem: String.raw`**One die.** A fair die is rolled once. What is the probability of a multiple of 3?`,
      solution: String.raw`Favourable: $\{3, 6\}$ — two of six equally likely faces.
$$P = \frac{2}{6} = \frac{1}{3} \approx 0.3333$$`,
      trap: String.raw`Counting $\{0, 3, 6\}$ (a die has no 0) or assuming "multiples of 3" means only 3. Quiet enumeration beats memory at seed level.`,
      verify: { value: 0.3333, expr: '2/6', tol: 0.001, unit: 'probability' } },

    { id:'A3-E5', exam:'GATE', anchor:'GATE-2', covers:['probability'],
      difficulty:'standard',
      stem: String.raw`**Two dice.** Two fair dice are thrown. What is the probability that the sum equals 8?`,
      solution: String.raw`Ordered pairs summing to 8: $(2,6), (3,5), (4,4), (5,3), (6,2)$ — five of the 36 ordered outcomes.
$$P = \frac{5}{36} \approx 0.1389$$`,
      trap: String.raw`Treating the outcomes as unordered pairs ($21$ of them) changes the sample space — then $5/21$ looks right but is wrong, because unordered pairs are **not equally likely**: $(4,4)$ arrives once, $(2,6)$ twice.`,
      verify: { value: 0.1389, expr: '5/36', tol: 0.001, unit: 'probability' } },

    { id:'A3-E6', exam:'CSIR', anchor:'CSIR-5', covers:['probability'],
      difficulty:'standard',
      stem: String.raw`**Without replacement.** A bag holds 5 red and 3 blue balls. Two balls are drawn one after another without replacement. What is the probability that both are red?`,
      solution: String.raw`The second draw re-denominates:
$$P = \frac{5}{8} \times \frac{4}{7} = \frac{20}{56} = \frac{5}{14} \approx 0.3571$$`,
      trap: String.raw`With-replacement arithmetic ($\frac{5}{8} \times \frac{5}{8} = \frac{25}{64} \approx 0.39$) is the printed distractor. After one red leaves the bag, only 4 reds remain among 7 balls.`,
      verify: { value: 0.3571, expr: '(5/8)*(4/7)', tol: 0.001, unit: 'probability' } },

    { id:'A3-E7', exam:'BOTH', anchor:'GATE-2', covers:['probability','permutations-combinations'],
      difficulty:'standard',
      stem: String.raw`**At least one.** A fair coin is tossed 3 times. What is the probability of getting at least one head?`,
      solution: String.raw`Complement — the only failure is TTT:
$$P(\text{at least one H}) = 1 - \left(\frac{1}{2}\right)^3 = 1 - \frac{1}{8} = \frac{7}{8} = 0.875$$`,
      trap: String.raw`Adding $\frac12 + \frac12 + \frac12 = 1.5$ produces a probability above 1 — the loudest possible alarm that events were double-counted. Any $P > 1$ is a structural error, not bad luck.`,
      verify: { value: 0.875, expr: '1-((1/2)*(1/2)*(1/2))', tol: 0.001, unit: 'probability' } },

    { id:'A3-E8', exam:'GATE', anchor:'GATE-2', covers:['probability'],
      difficulty:'apex',
      stem: String.raw`**Conditioning direction.** Box A holds 3 red, 2 blue; box B holds 1 red, 4 blue. A box is chosen at random (each with probability 1/2) and one ball is drawn; it is red. What is the probability it came from box A?`,
      solution: String.raw`$$P(A \mid R) = \frac{P(A)\,P(R \mid A)}{P(A)\,P(R \mid A) + P(B)\,P(R \mid B)} = \frac{\frac12 \cdot \frac35}{\frac12 \cdot \frac35 + \frac12 \cdot \frac15} = \frac{0.30}{0.40} = 0.75$$`,
      trap: String.raw`Swapping the conditioning direction: $P(R \mid A) = \frac35 = 0.6$ is the stocked wrong answer. The *evidence* (red drawn) re-weights the boxes — equal priors become 3:1 posteriors because A is thrice as red-friendly.`,
      verify: { value: 0.75, expr: '((1/2)*(3/5))/(((1/2)*(3/5))+((1/2)*(1/5)))', tol: 0.001, unit: 'probability' } },
  ],

  speedSheet: String.raw`## ⚡ A3 SPEED SHEET — 60 seconds before the paper

**Slots first:** stages multiply — $n_1 n_2 \cdots n_k$. Repetition clause decides if slots shrink.
**Order matters** → $P(n,r) = \frac{n!}{(n-r)!}$ · **doesn't** → $\binom{n}{r} = \frac{n!}{r!(n-r)!}$ · circle: $(n-1)!$ · together: glue $\times$ internal swaps.
**Classical P** $= \frac{|E|}{|S|}$ — two dice: ordered 36, sum-8 has 5, sum-7 has 6.
**"At least one"** $= 1 - P(\text{none})$. "Or" $=$ add, **subtract the overlap**.
**Independent** → multiply. **Without replacement** → both numerator and denominator shrink.
**Conditional:** $P(A \mid B) = \frac{P(A \cap B)}{P(B)}$ — restrict the universe, and never swap the direction.
**Any probability > 1 or < 0 = structural error.**`
};

/* ======================================================= module A4 (C2) */
const MODULE_A4 = {
  id: 'A4',
  title: 'Time, Work, Speed & Distance',
  file: '🧠 A4 · Time, Work, Speed & Distance.md',
  anchors: ['CSIR-5'],
  anchorAtoms: {
    'CSIR-5': ['time-work','time-speed-distance']
  },
  register: 'formula-first + trap callouts',
  figureStyle: 'dark (matches content section)',
  stage: 'C2 core numeracy',

  cards: [
    { id:'A4-C1', covers:['time-work'], head: 'Work Is a Rate',
      md: String.raw`"A finishes the job in $T$ days" is a rate statement: A does $\tfrac{1}{T}$ of the job per day. Combined work adds rates:

$$\frac{1}{t_{\text{together}}} = \frac{1}{T_A} + \frac{1}{T_B} \qquad\Rightarrow\qquad t_{\text{together}} = \frac{T_A T_B}{T_A + T_B}$$

Never average the times ($(12 + 18)/2 = 15$ is the stocked wrong answer): times divide work, rates share it. Men-and-days stems chain the same idea — twice the men halves the days; the *amount of work* is the only invariant.` },
    { id:'A4-C2', covers:['time-work'], head: 'The LCM-Unit Trick',
      md: String.raw`Working in fractions ($\tfrac{1}{12} + \tfrac{1}{18}$) is where slips breed. Instead, **declare the total job as LCM of the times**. A does it in 12 days, B in 18: set $W = 36$ units. Then A's rate is 3 units/day, B's is 2 units/day, together 5 units/day, time $= 36/5 = 7.2$ days — integers all the way down.

The trick scales to every variant: partial work ("after 4 days A leaves") is just unit bookkeeping; efficiency ratios become unit rates directly ("A twice as efficient as B" → rates 2u and 1u).` },
    { id:'A4-C3', covers:['time-work'], head: 'Pipes: Signs Carry Meaning',
      md: String.raw`Inlets are positive rates, outlets (leaks, drains) are negative — the only place in Part A where a rate arrives with a minus sign:

$$\frac{1}{t} = \frac{1}{T_{\text{fill}}} + \frac{1}{T_{\text{fill}2}} - \frac{1}{T_{\text{empty}}}$$

If the net comes out negative, the tank never fills (and the honest answer is "never" — some answer keys include it). The LCM-unit trick absorbs the sign for free: an 8-hour leak on a 24-unit tank just contributes $-3$ units/hour.` },
    { id:'A4-C4', covers:['time-speed-distance'], head: 'The Speed Triangle & Unit Conversion',
      md: String.raw`$$d = v\,t \qquad v = \frac{d}{t} \qquad t = \frac{d}{v}$$

All three forms are one triangle; cover the quantity you want. The conversion is a fixed pair of multipliers:

$$1 \text{ km/h} = \frac{5}{18} \text{ m/s} \qquad 1 \text{ m/s} = \frac{18}{5} \text{ km/h}$$

Choosing the direction: km/h → m/s shrinks the number (multiply by 5/18), so if your m/s answer is *bigger* than the km/h figure, you multiplied the wrong way. 72 km/h = 20 m/s — the pair CSIR reuses the most.` },
    { id:'A4-C5', covers:['time-speed-distance'], head: 'Relative Speed: The Direction Sign',
      md: String.raw`Two movers on one line share one clock:

$$v_{\text{rel}} = v_1 + v_2 \ (\text{opposite directions}) \qquad v_{\text{rel}} = |v_1 - v_2| \ (\text{same direction})$$

Opposite-direction meetings close the gap at the *sum*; same-direction chases close it at the *difference*. The whole art is deciding which number is "the gap": for two trains crossing, the gap is the sum of lengths; for a man walking inside a moving train, it's just the train's length.` },
    { id:'A4-C6', covers:['time-speed-distance'], head: 'Trains: What Counts as the Gap',
      md: String.raw`A train crossing a **pole/man/post** covers only its own length; crossing a **platform/bridge** covers its own length plus the platform's; crossing **another train** covers the sum of both lengths at relative speed.

$$t_{\text{pole}} = \frac{L_{\text{train}}}{v} \qquad t_{\text{platform}} = \frac{L_{\text{train}} + L_{\text{platform}}}{v} \qquad t_{\text{two trains}} = \frac{L_1 + L_2}{v_{\text{rel}}}$$

Nine of ten train errors are gap errors (used 240 m instead of 600 m); the tenth is forgetting the 5/18 unit conversion. Convert first, then pick the gap.` },
    { id:'A4-C7', covers:['time-speed-distance'], head: 'Boats: The Stream Adds and Subtracts',
      md: String.raw`$$v_{\text{down}} = b + s \qquad v_{\text{up}} = b - s \qquad\Rightarrow\qquad b = \frac{v_{\text{down}} + v_{\text{up}}}{2}, \quad s = \frac{v_{\text{down}} - v_{\text{up}}}{2}$$

The stream is a conveyor belt: it helps one way and hurts the other by the same $s$. A round trip is never at still-water speed — the upstream leg resists longer, so total time always *exceeds* the still-water estimate. That inequality is a free option eliminator before any arithmetic.` },
    { id:'A4-C8', covers:['time-speed-distance'], head: 'Average Speed Is Harmonic',
      md: String.raw`Same distance at two speeds: the average is the **harmonic** mean, never the arithmetic:

$$\bar{v} = \frac{2 v_1 v_2}{v_1 + v_2} \quad (\text{equal distances}) \qquad\qquad \bar{v} = \frac{v_1 + v_2}{2} \quad (\text{equal times})$$

40 km/h out and 60 km/h back over equal distances averages $48$, not $50$ — the slow leg owns more of the clock. The mnemonic: *distances → harmonic · times → arithmetic*. Races and head-start stems ("A beats B by 20 m or 4 s") convert between metres and seconds using the loser's speed: B runs those 20 m in 4 s, so $v_B = 5$ m/s.` },
  ],

  formulas: [
    { name:'Speed triangle',      tex: String.raw`d = vt` },
    { name:'km/h → m/s',         tex: String.raw`v\ (\text{m/s}) = v\ (\text{km/h}) \times \dfrac{5}{18}` },
    { name:'Combined work',       tex: String.raw`t = \dfrac{T_A T_B}{T_A + T_B}` },
    { name:'Net pipe rate',       tex: String.raw`\dfrac{1}{t} = \dfrac{1}{T_1} + \dfrac{1}{T_2} - \dfrac{1}{T_{\text{out}}}` },
    { name:'Relative speed',      tex: String.raw`v_{\text{rel}} = v_1 \pm v_2` },
    { name:'Train + platform',    tex: String.raw`t = \dfrac{L_t + L_p}{v}` },
    { name:'Boats',               tex: String.raw`v_{\text{down}} = b + s,\ \ v_{\text{up}} = b - s` },
    { name:'Boat & stream speed', tex: String.raw`b = \dfrac{v_d + v_u}{2},\ \ s = \dfrac{v_d - v_u}{2}` },
    { name:'Average speed (eq. dist.)', tex: String.raw`\bar{v} = \dfrac{2 v_1 v_2}{v_1 + v_2}` },
    { name:'Circular same-dir meeting', tex: String.raw`T = \dfrac{L}{|v_1 - v_2|}` },
  ],

  examples: [
    { id:'A4-E1', exam:'CSIR', anchor:'CSIR-5', covers:['time-work'],
      difficulty:'seed',
      stem: String.raw`**Combined work.** A can finish a job in 12 days, B in 18 days. Working together, how long do they take?`,
      solution: String.raw`Rates add:
$$t = \frac{1}{\frac{1}{12} + \frac{1}{18}} = \frac{T_A T_B}{T_A + T_B} = \frac{12 \times 18}{12 + 18} = \frac{216}{30} = 7.2 \text{ days}$$`,
      trap: String.raw`Averaging the days ($(12+18)/2 = 15$) or adding them (30) — times don't combine; *rates* do. Sanity wall: together must be faster than the faster worker alone, i.e. under 12 days.`,
      verify: { value: 7.2, expr: '(12*18)/(12+18)', tol: 0.001, unit: 'days' } },

    { id:'A4-E2', exam:'BOTH', anchor:'CSIR-5', covers:['time-work'],
      difficulty:'standard',
      stem: String.raw`**Worker leaves midway.** A alone needs 10 days, B alone needs 15 days. They work together for 4 days, then A leaves. How many more days does B need to finish?`,
      solution: String.raw`LCM-unit trick: $W = \mathrm{lcm}(10,15) = 30$ units; rates 3 and 2 units/day → 5/day together.
$$W_{\text{done}} = 4 \times 5 = 20 \text{ units}; \qquad t_B = \frac{30 - 20}{2} = 5 \text{ days}$$`,
      trap: String.raw`Continuing both workers to the end (answering the *total* project time, 6 days) or deducting 4 days from B's solo 15. After A leaves, only B's **2 units/day** faces the remaining 10 units.`,
      verify: { value: 5, expr: '(30-(((30/10)+(30/15))*4))/(30/15)', tol: 0.001, unit: 'days' } },

    { id:'A4-E3', exam:'CSIR', anchor:'CSIR-5', covers:['time-work'],
      difficulty:'standard',
      stem: String.raw`**Pipe with a leak.** Tap A fills a tank in 6 hours, tap B in 12 hours, and a drain C empties it in 24 hours. All three open: when is the tank full?`,
      solution: String.raw`$$t = \frac{1}{\frac16 + \frac1{12} - \frac1{24}} = \frac{1}{\frac{4 + 2 - 1}{24}} = \frac{24}{5} = 4.8 \text{ hours}$$`,
      trap: String.raw`Adding all three rates ($\tfrac{4+2+1}{24} \to \tfrac{24}{7} \approx 3.43$ h) treats the leak as a filler. The drainer's rate enters with a **minus** — it is the only signed-rate object in Part A.`,
      verify: { value: 4.8, expr: '1/((1/6)+(1/12)-(1/24))', tol: 0.001, unit: 'hours' } },

    { id:'A4-E4', exam:'BOTH', anchor:'CSIR-5', covers:['time-speed-distance'],
      difficulty:'seed',
      stem: String.raw`**Unit conversion.** Convert 72 km/h to metres per second.`,
      solution: String.raw`$$72 \times \frac{5}{18} = 4 \times 5 = 20 \text{ m/s}$$`,
      trap: String.raw`Multiplying by $18/5$ (getting 259.2 m/s — a jet, not a bus). km/h → m/s must **shrink** the number: the metre figure is always smaller than the kilometre figure for the same physical speed.`,
      verify: { value: 20, expr: '72*(5/18)', tol: 0.001, unit: 'm/s' } },

    { id:'A4-E5', exam:'CSIR', anchor:'CSIR-5', covers:['time-speed-distance'],
      difficulty:'standard',
      stem: String.raw`**Train and platform.** A 240-metre train running at 54 km/h crosses a platform 360 m long. How long does the crossing take?`,
      solution: String.raw`Convert: $54 \times \frac{5}{18} = 15$ m/s. Gap = train + platform:
$$t = \frac{240 + 360}{15} = \frac{600}{15} = 40 \text{ seconds}$$`,
      trap: String.raw`Using only the train's length (16 s) — till the tail clears the platform, the front has travelled **platform + train**. And skipping the 5/18 conversion ($600/54$) mixes units in one division.`,
      verify: { value: 40, expr: '(240+360)/(54*(5/18))', tol: 0.001, unit: 's' } },

    { id:'A4-E6', exam:'BOTH', anchor:'CSIR-5', covers:['time-speed-distance'],
      difficulty:'standard',
      stem: String.raw`**Boat round trip.** A boat's still-water speed is 10 km/h and the stream runs at 2 km/h. How long does a 48 km downstream + 48 km upstream round trip take?`,
      solution: String.raw`$$v_{\text{down}} = 12 \text{ km/h}, \quad v_{\text{up}} = 8 \text{ km/h}$$
$$t = \frac{48}{12} + \frac{48}{8} = 4 + 6 = 10 \text{ hours}$$`,
      trap: String.raw`Assuming still-water speed for both legs ($96/10 = 9.6$ h) — the slow upstream leg owns more clock than the fast leg saves. Round trips resist: real time always *exceeds* the still-water estimate.`,
      verify: { value: 10, expr: '(48/(10+2))+(48/(10-2))', tol: 0.001, unit: 'hours' } },

    { id:'A4-E7', exam:'CSIR', anchor:'CSIR-5', covers:['time-speed-distance'],
      difficulty:'apex',
      stem: String.raw`**Average speed.** A car covers a stretch at 40 km/h and returns over the same stretch at 60 km/h. What is its average speed for the round trip?`,
      solution: String.raw`Equal distances → harmonic mean:
$$\bar{v} = \frac{2 \times 40 \times 60}{40 + 60} = \frac{4800}{100} = 48 \text{ km/h}$$
*(Audit with a 120 km stretch: 3 h out + 2 h back = 240/5 = 48 ✓.)*`,
      trap: String.raw`The arithmetic mean 50 km/h is the planted answer — it would be right only for equal *times*. Over equal distances the slow leg dominates the clock, dragging the average below 50.`,
      verify: { value: 48, expr: '(2*40*60)/(40+60)', tol: 0.001, unit: 'km/h' } },

    { id:'A4-E8', exam:'CSIR', anchor:'CSIR-5', covers:['time-speed-distance'],
      difficulty:'apex',
      stem: String.raw`**Same-direction chase.** Two runners start together on a 400 m circular track at 6 m/s and 4 m/s, running in the same direction. After how many seconds does the faster runner first lap the slower?`,
      solution: String.raw`Same direction → relative speed is the difference:
$$T = \frac{L}{|v_1 - v_2|} = \frac{400}{6 - 4} = \frac{400}{2} = 200 \text{ seconds}$$`,
      trap: String.raw`Adding the speeds ($400/10 = 40$ s) applies the *opposite-direction* rule to a chase. In a chase the faster gains only $6 - 4 = 2$ m every second, so lapping 400 m costs 200 s.`,
      verify: { value: 200, expr: '400/(6-4)', tol: 0.001, unit: 's' } },
  ],

  speedSheet: String.raw`## ⚡ A4 SPEED SHEET — 60 seconds before the paper

**Work:** rates add, times don't. $t = \frac{T_A T_B}{T_A + T_B}$ · LCM-unit trick makes it integers.
**Pipes:** outlets enter with a **minus**. Net negative → never fills.
**Conversion:** km/h $\times \frac{5}{18}$ → m/s (shrinks). 72 km/h = 20 m/s.
**Relative speed:** opposite → add · chase → subtract.
**Trains:** pole = own length · platform = both lengths · two trains = sum at $v_{\text{rel}}$.
**Boats:** $b \pm s$; round trip always slower than the still-water estimate.
**Average speed:** equal distances → $\frac{2v_1v_2}{v_1+v_2}$ (harmonic, below the arithmetic mean).
**Circular track, same direction:** lap again every $\frac{L}{|v_1 - v_2|}$.`
};

/* ======================================================= module A5 (C2) */
const MODULE_A5 = {
  id: 'A5',
  title: 'Geometry & Mensuration',
  file: '🧠 A5 · Geometry & Mensuration.md',
  anchors: ['CSIR-5','GATE-2'],
  anchorAtoms: {
    'CSIR-5': ['geometry-mensuration'],
    'GATE-2': ['mensuration-geometry']
  },
  register: 'formula-first + trap callouts',
  figureStyle: 'dark (matches content section)',
  stage: 'C2 core numeracy',

  cards: [
    { id:'A5-C1', covers:['mensuration-geometry','geometry-mensuration'], head: 'Triangle Grammar',
      md: String.raw`The four non-negotiables: angles sum to $180^\circ$; an exterior angle equals the sum of the two remote interior angles; any side is shorter than the sum of the other two (triangle inequality — the eliminator of impossible options); and Pythagoras for right triangles,

$$a^2 + b^2 = c^2$$

Standard triples pay rent constantly: $3\!-\!4\!-\!5$ and its doubles ($6\!-\!8\!-\!10$, $9\!-\!12\!-\!15$), $5\!-\!12\!-\!13$, $8\!-\!15\!-\!17$, $7\!-\!24\!-\!25$. Spotting a scaled triple turns a root-extraction into pattern-matching — E1 is a $9\!-\!12\!-\!15$, i.e. $3\times(3\!-\!4\!-\!5)$.` },
    { id:'A5-C2', covers:['mensuration-geometry','geometry-mensuration'], head: 'Circle Grammar',
      md: String.raw`$$C = 2\pi r \qquad A = \pi r^2 \qquad \text{sector} = \frac{\theta}{360^\circ}\,\pi r^2 \qquad \text{arc} = \frac{\theta}{360^\circ}\,2\pi r$$

Radius vs diameter is the split where half of all circle errors happen — $r$ appears in every formula, while stems love quoting the diameter. A tangent meets the radius at exactly $90^\circ$ (the right-angle that builds construction stems). Sectors and arcs are pure fractions of the full circle: the $\theta/360^\circ$ share, nothing more.` },
    { id:'A5-C3', covers:['mensuration-geometry','geometry-mensuration'], head: 'Quadrilaterals & Polygons Table',
      md: String.raw`Areas on one shelf: parallelogram $= bh$ · rhombus $= \tfrac{d_1 d_2}{2}$ (diagonals!) · trapezium $= \tfrac{(a+b)}{2}h$ · square $= a^2$, diagonal $= a\sqrt{2}$.

Every $n$-gon: interior angles sum to $(n-2) \times 180^\circ$, so each angle of a regular $n$-gon is $\tfrac{(n-2)180^\circ}{n}$. The hexagon ($120^\circ$) and pentagon ($108^\circ$) are the two the exams actually use. The rhombus trap is permanent: its area formula wants the *diagonals*, and a stem that gives sides plus one diagonal is asking you to Pythagoras the second half-diagonal first.` },
    { id:'A5-C4', covers:['mensuration-geometry','geometry-mensuration'], head: 'Similarity Is Scaling',
      md: String.raw`Similar figures share shape, differ only by the scale factor $k$ of their sides. Lengths scale by $k$, areas by $k^2$, volumes by $k^3$:

$$\frac{A_1}{A_2} = k^2 \qquad \frac{V_1}{V_2} = k^3$$

The $k$-vs-$k^2$ swap is the single most-printed distractor in the mensuration wing — a triangle twice as wide is **four** times as heavy in area. Same logic with units: doubling every dimension of a box octuples the paint bill's cousin (volume) but only quadruples the paint (surface).` },
    { id:'A5-C5', covers:['mensuration-geometry','geometry-mensuration'], head: 'The 3D Solids Shelf',
      md: String.raw`The five solids on one shelf (volume · surface notes):

* **Cube, side $a$** — $V = a^3$ · surface $6a^2$ · body diagonal $a\sqrt{3}$
* **Cuboid** — $V = \ell b h$ · surface $2(\ell b + bh + \ell h)$
* **Cylinder** — $V = \pi r^2 h$ · curved $2\pi r h$ · total $2\pi r(r+h)$
* **Cone** — $V = \tfrac{1}{3}\pi r^2 h$ · slant $\ell = \sqrt{r^2 + h^2}$ · curved $\pi r \ell$
* **Sphere** — $V = \tfrac{4}{3}\pi r^3$ · surface $4\pi r^2$

Two traps live here rent-free: the cone's slant $\ell$ is not its height $h$ (curved surface uses $\ell$), and melt-recast stems conserve **volume**, never surface area.` },
    { id:'A5-C6', covers:['mensuration-geometry','geometry-mensuration'], head: 'Coordinate Basics',
      md: String.raw`$$d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2} \qquad \text{midpoint} = \left(\frac{x_1+x_2}{2}, \frac{y_1+y_2}{2}\right) \qquad m = \frac{y_2 - y_1}{x_2 - x_1}$$

Distances hide inside geometry stems ("is this triangle right/isosceles?" → compute all three side-lengths). Slope is rise over run with the same point-order in numerator and denominator; swapping order in only one of them flips the sign. A quadrilateral's type (square vs rhombus vs rectangle) is settled by comparing **side lengths and diagonals** computed with the distance formula — not by looking.` },
    { id:'A5-C7', covers:['mensuration-geometry','geometry-mensuration'], head: 'The Two Special Triangles',
      md: String.raw`$$45^\circ\!-\!45^\circ\!-\!90^\circ:\ \ 1 : 1 : \sqrt{2} \qquad\qquad 30^\circ\!-\!60^\circ\!-\!90^\circ:\ \ 1 : \sqrt{3} : 2$$

Every height-and-shadow stem reduces to these: shadow equals height at $45^\circ$; at $30^\circ$ the shadow is $h\sqrt{3}$; at $60^\circ$ it is $h/\sqrt{3}$. The trigonometry you need is exactly $\tan 30^\circ = \tfrac{1}{\sqrt3}$, $\tan 45^\circ = 1$, $\tan 60^\circ = \sqrt3$ — three values, no calculator.` },
    { id:'A5-C8', covers:['mensuration-geometry','geometry-mensuration'], head: 'Dissection & the π Discipline',
      md: String.raw`Shaded-area stems decompose: **shaded = whole − parts**, and the parts are always primitives (sector, triangle, semicircle). Square with an inscribed circle: shaded corners $= a^2 - \pi (a/2)^2$.

The π discipline that halves error rates: keep $\pi$ symbolic to the last line; choose $\tfrac{22}{7}$ when a 7 divides a radius or diameter, $3.14$ otherwise; cancel π across the two sides whenever a stem compares or recasts. And run the unit audit — a length answer in cm² or a volume in cm² flags itself.` },
  ],

  formulas: [
    { name:'Pythagoras',        tex: String.raw`c^2 = a^2 + b^2` },
    { name:'Triangle area',     tex: String.raw`A = \dfrac{1}{2}\,b\,h` },
    { name:'Heron',             tex: String.raw`A = \sqrt{s(s-a)(s-b)(s-c)},\ s = \tfrac{a+b+c}{2}` },
    { name:'Circle C & A',      tex: String.raw`C = 2\pi r,\ \ A = \pi r^2` },
    { name:'Sector area',       tex: String.raw`A = \dfrac{\theta}{360^\circ}\,\pi r^2` },
    { name:'Trapezium area',    tex: String.raw`A = \dfrac{(a+b)}{2}\,h` },
    { name:'Polygon angle sum', tex: String.raw`(n-2)\times 180^\circ` },
    { name:'Distance formula',  tex: String.raw`d = \sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}` },
    { name:'Cylinder volume',   tex: String.raw`V = \pi r^2 h` },
    { name:'Cone slant & CSA',  tex: String.raw`\ell = \sqrt{r^2+h^2},\ \ \text{CSA} = \pi r \ell` },
    { name:'Sphere V & SA',     tex: String.raw`V = \dfrac{4}{3}\pi r^3,\ \ \text{SA} = 4\pi r^2` },
    { name:'Similarity scaling', tex: String.raw`A \propto k^2,\ \ V \propto k^3` },
  ],

  examples: [
    { id:'A5-E1', exam:'BOTH', anchor:'GATE-2', covers:['mensuration-geometry'],
      difficulty:'seed',
      stem: String.raw`**Pythagoras.** A right triangle has legs 9 cm and 12 cm. Find the hypotenuse.`,
      solution: String.raw`$$c = \sqrt{9^2 + 12^2} = \sqrt{81 + 144} = \sqrt{225} = 15 \text{ cm}$$
*(Triple spot: $9\!-\!12\!-\!15 = 3\times(3\!-\!4\!-\!5)$.)*`,
      trap: String.raw`$9 + 12 = 21$ happens under time pressure more often than anyone admits; and $\sqrt{81} + \sqrt{144} = \sqrt{225}$ is false step-by-step — roots don't distribute over sums. Square, add, root: in that order.`,
      verify: { value: 15, expr: 'Math.sqrt((9*9)+(12*12))', tol: 0.001, unit: 'cm' } },

    { id:'A5-E2', exam:'CSIR', anchor:'CSIR-5', covers:['geometry-mensuration'],
      difficulty:'standard',
      stem: String.raw`**Rolling wheel.** A wheel of radius 28 cm makes 25 complete revolutions. What distance does it travel?`,
      solution: String.raw`One revolution = one circumference. With $\pi = \tfrac{22}{7}$ (radius divisible by 7):
$$d = 25 \times 2\pi r = 25 \times 2 \times \frac{22}{7} \times 28 = 25 \times 176 = 4400 \text{ cm} = 44 \text{ m}$$`,
      trap: String.raw`Using the diameter as if it were the radius doubles the answer (88 m), and leaving the result in centimetres when the options are in metres is the unit trap that trails every rolling-wheel stem.`,
      verify: { value: 4400, expr: '25*2*(22/7)*28', tol: 0.5, unit: 'cm' } },

    { id:'A5-E3', exam:'GATE', anchor:'GATE-2', covers:['mensuration-geometry'],
      difficulty:'standard',
      stem: String.raw`**Trapezium.** A trapezium's parallel sides are 10 cm and 16 cm, with 7 cm between them. Find its area.`,
      solution: String.raw`$$A = \frac{(a+b)}{2}\,h = \frac{10 + 16}{2} \times 7 = 13 \times 7 = 91 \text{ cm}^2$$`,
      trap: String.raw`$(10 + 16) \times 7 = 182$ skips the halving — the mean of the parallel sides is the effective width. Reading 16 as the height (confusing slant side with perpendicular gap) is the second stocked error.`,
      verify: { value: 91, expr: '((10+16)/2)*7', tol: 0.001, unit: 'cm²' } },

    { id:'A5-E4', exam:'BOTH', anchor:'GATE-2', covers:['mensuration-geometry'],
      difficulty:'standard',
      stem: String.raw`**Similarity scaling.** Two similar triangles have corresponding sides in the ratio 2:5. The smaller triangle's area is 12 cm². Find the larger's area.`,
      solution: String.raw`Areas scale by $k^2$:
$$A_{\text{large}} = 12 \times \left(\frac{5}{2}\right)^2 = 12 \times \frac{25}{4} = 75 \text{ cm}^2$$`,
      trap: String.raw`Scaling by $k$ instead of $k^2$ ($12 \times 2.5 = 30$) is the single most-printed distractor in this wing. Lengths scale once, areas twice, volumes three times.`,
      verify: { value: 75, expr: '12*((5/2)**2)', tol: 0.001, unit: 'cm²' } },

    { id:'A5-E5', exam:'CSIR', anchor:'CSIR-5', covers:['geometry-mensuration'],
      difficulty:'standard',
      stem: String.raw`**Cone curved surface.** A cone has base radius 7 cm and height 24 cm. Find its curved surface area (use $\pi = \tfrac{22}{7}$).`,
      solution: String.raw`The slant carries the surface, so derive it first (a $7\!-\!24\!-\!25$ triple):
$$\ell = \sqrt{7^2 + 24^2} = \sqrt{625} = 25 \text{ cm}$$
$$\text{CSA} = \pi r \ell = \frac{22}{7} \times 7 \times 25 = 550 \text{ cm}^2$$`,
      trap: String.raw`Using the height in place of the slant ($\tfrac{22}{7} \times 7 \times 24 = 528$) — the curved surface unwraps to a sector whose radius is the **slant**, not the vertical height.`,
      verify: { value: 550, expr: '(22/7)*7*Math.sqrt((7*7)+(24*24))', tol: 0.5, unit: 'cm²' } },

    { id:'A5-E6', exam:'GATE', anchor:'GATE-2', covers:['mensuration-geometry'],
      difficulty:'standard',
      stem: String.raw`**Coordinate distance.** Find the distance between the points $(1, 2)$ and $(7, 10)$.`,
      solution: String.raw`$$d = \sqrt{(7-1)^2 + (10-2)^2} = \sqrt{36 + 64} = \sqrt{100} = 10$$`,
      trap: String.raw`Mixing point order between the two components ($(7-1)$ with $(2-10)$) still works here only by sign luck — keep the subtraction order identical in both brackets and the squares take care of the rest.`,
      verify: { value: 10, expr: 'Math.sqrt(((7-1)**2)+((10-2)**2))', tol: 0.001, unit: '' } },

    { id:'A5-E7', exam:'CSIR', anchor:'CSIR-5', covers:['geometry-mensuration'],
      difficulty:'apex',
      stem: String.raw`**Melt and recast.** A solid metal sphere of radius 3 cm is melted and recast into a cylinder of radius 2 cm. What is the cylinder's height?`,
      solution: String.raw`Volume is conserved; π cancels across the equation:
$$\frac{4}{3}\pi (3)^3 = \pi (2)^2 h \;\Rightarrow\; 36\pi = 4\pi h \;\Rightarrow\; h = 9 \text{ cm}$$`,
      trap: String.raw`Conserving surface area instead of volume — melting preserves *amount of metal* (volume), and the surface usually grows. Also: using diameter 4 as the cylinder's radius turns $h$ into $2.25$, the stocked mirror-answer.`,
      verify: { value: 9, expr: '((4/3)*(3*3*3))/(2*2)', tol: 0.001, unit: 'cm' } },

    { id:'A5-E8', exam:'BOTH', anchor:'CSIR-5', covers:['geometry-mensuration','mensuration-geometry'],
      difficulty:'apex',
      stem: String.raw`**Dissected square.** A square of side 14 cm has its largest possible circle inscribed. What is the area of the four corners left outside the circle? (Use $\pi = \tfrac{22}{7}$.)`,
      solution: String.raw`The inscribed circle's radius is half the side: $r = 7$.
$$A_{\text{corners}} = 14^2 - \pi r^2 = 196 - \frac{22}{7} \times 49 = 196 - 154 = 42 \text{ cm}^2$$`,
      trap: String.raw`Taking $r = 14$ (side, not half-side) makes the "circle" bigger than the square — $196 - 616 < 0$ should loudly reject itself. Negative area is the geometry version of probability > 1: a structural alarm.`,
      verify: { value: 42, expr: '(14*14)-((22/7)*7*7)', tol: 0.5, unit: 'cm²' } },
  ],

  speedSheet: String.raw`## ⚡ A5 SPEED SHEET — 60 seconds before the paper

**Triangles:** angles sum $180^\circ$ · $c^2 = a^2 + b^2$ · triples $3\!-\!4\!-\!5,\ 5\!-\!12\!-\!13,\ 8\!-\!15\!-\!17,\ 7\!-\!24\!-\!25$.
**Circles:** $C = 2\pi r$, $A = \pi r^2$ · sector = $\frac{\theta}{360^\circ}$ of the whole · **radius, not diameter**.
**Quads:** parallelogram $bh$ · rhombus $\frac{d_1 d_2}{2}$ · trapezium $\frac{a+b}{2}h$ · $n$-gon angles $(n-2)180^\circ$.
**Similarity:** sides $k$ → areas $k^2$ → volumes $k^3$.
**Solids:** cylinder $\pi r^2 h$ · cone $\frac13\pi r^2 h$ with slant $\ell = \sqrt{r^2+h^2}$ (CSA uses $\ell$!) · sphere $\frac43\pi r^3$, $4\pi r^2$.
**Melt-recast:** conserve **volume** · π cancels.
**Coordinates:** $d = \sqrt{\Delta x^2 + \Delta y^2}$.
**π discipline:** symbolic till the end · $\tfrac{22}{7}$ when 7 divides, else 3.14 · unit² vs unit³ audit.`
};

/* ======================================================= module A7 (C3) */
const MODULE_A7 = {
  id: 'A7',
  title: 'Logical Reasoning Core',
  file: '🧠 A7 · Logical Reasoning Core.md',
  anchors: ['CSIR-6','GATE-3'],
  anchorAtoms: {
    'CSIR-6': ['syllogisms','venn-diagrams','analogies-classification'],
    'GATE-3': ['deduction-induction','analogy','numerical-relations']
  },
  register: 'formula-first + trap callouts',
  figureStyle: 'dark (matches content section)',
  stage: 'C3 reasoning wing',

  cards: [
    { id:'A7-C1', covers:['deduction-induction'], head: 'Deduction vs Induction',
      md: String.raw`**Deduction** moves from a rule to a guaranteed case: *all metals expand when heated; iron is a metal; therefore iron expands.* If the premises are true and the form is valid, the conclusion cannot fail. **Induction** moves from observed cases to a probable rule: *the series 2, 4, 6, 8, … suggests "even numbers"* — strong evidence, never certainty.

The exams test the *boundary*: a stem that observes three cases and claims the rule is deduction-flavoured bait. The fix is procedural — for any stated conclusion ask: "do the premises make this **inescapable**, or merely likely?" Only inescapable earns a "follows".` },
    { id:'A7-C2', covers:['syllogisms'], head: 'Syllogism = Set Arithmetic',
      md: String.raw`Every syllogism is a claim about circles (sets) overlapping. Translate first:

$$\text{All A are B} \equiv A \subseteq B \qquad \text{No A is B} \equiv A \cap B = \varnothing \qquad \text{Some A are B} \equiv A \cap B \neq \varnothing$$

Then a conclusion "follows" only if it holds in **every** drawing consistent with the premises — draw the extreme cases, not the typical one. The single most reliable score move on CSIR Part A logic: *try to break the conclusion*. If one legal picture breaks it, it does not follow.` },
    { id:'A7-C3', covers:['syllogisms'], head: 'The Four Premises & The Middle Term',
      md: String.raw`Syllogisms chain through a **middle term** that must be *distributed* (spoken of in full extent) at least once. The safe chains:

$$\text{All A are B} + \text{All B are C} \Rightarrow \text{All A are C}$$

Deceptively close invalid forms are the stock distractors: **All A are B + All C are B** proves nothing (A and C both sit inside B without touching); **Some A are B + All B are C** yields only "Some A are C" — never "All". And from "All A are B", the only free conversion is "**Some B are A**" — full reversal ("All B are A") is the classic planted conclusion.` },
    { id:'A7-C4', covers:['venn-diagrams'], head: 'Venn Counting: 2-Set Engine',
      md: String.raw`$$|A \cup B| = |A| + |B| - |A \cap B| \qquad \text{neither} = N - |A \cup B|$$

Everything in 2-set Venn work is those two lines. The subtraction repairs double-counting — the overlap was priced into both $|A|$ and $|B|$. "Only A" $= |A| - |A \cap B|$: the named-set figure always *includes* the overlap, which is exactly the adjustment forgetters make. When the stem says "35 play cricket", it means 35 **including** the dual players.` },
    { id:'A7-C5', covers:['venn-diagrams'], head: 'Venn Counting: 3-Set Engine',
      md: String.raw`$$|A \cup B \cup C| = |A|+|B|+|C| - |A\cap B| - |B\cap C| - |C\cap A| + |A \cap B \cap C|$$

The signs alternate: add singles, subtract pairs, add back the triple (it was added 3 times, subtracted 3 times — net zero until restored). Bookkeeping discipline: solve the **innermost region first** (all three), then pairs, then singles — outside-in collapses every time. A "none of the three" cell completes the census: all regions must sum to $N$.` },
    { id:'A7-C6', covers:['analogy','analogies-classification'], head: 'Analogy: Name the Relation First',
      md: String.raw`A : B :: C : ? is never solved by matching surface vibes; the bridge is a **named relation** — part:whole, tool:action, unit:quantity, synonym, degree, cause:effect, letter-shift, $n \to n^2$. State it in a sentence *before* looking at the options: "B is the square of A". Then test candidates against the sentence, and require the relation in the **same direction** (A:B reversed kills the candidate).

Classification (odd-one-out) is analogy's twin: four items share a named property, one fails it. The examiner's craft is making two surface properties compete — e.g. "all even" vs "all perfect squares"; the correct partition is the one where **exactly one** item breaks away.` },
    { id:'A7-C7', covers:['numerical-relations'], head: 'Translating Words into Equations',
      md: String.raw`Numerical-relations stems are worded arithmetic; the dictionary is tiny and fixed: *"is"* → $=$ · *"of"* → $\times$ · *"times as old as"* → multiplication · *"more than"* → $+$ · *"years ago/hence"* → subtract/add on the person's own timeline.

The discipline is one unknown per person and one equation per sentence-clause:

$$\text{father} = 3s \quad\text{now;}\qquad \text{father} + 12 = 2(s + 12) \quad\text{in 12 years}$$

Two clauses, two equations, done. The scorched-earth error is freezing ages — every person's clock advances together, so "+12" applies to **every** variable.` },
    { id:'A7-C8', covers:['syllogisms','venn-diagrams','analogies-classification','deduction-induction'], head: 'Logic Trap Anthology',
      md: String.raw`The recurring ambushes in the reasoning wing:

1. **Typical-picture bias** — a conclusion true in the obvious Venn drawing but breakable in an extreme one.  \n2. **Full reverse** — "All B are A" from "All A are B"; only *some* reverses.  \n3. **Frozen ages** — advancing one person's clock but not the other's.  \n4. **Inclusive sets** — "35 play cricket" already contains the both-players; subtracting them again empties the middle.  \n5. **Double property** — odd-one-out with two plausible rules; the intended rule separates exactly one.` },
  ],

  formulas: [
    { name:'Union (2 sets)',      tex: String.raw`|A \cup B| = |A| + |B| - |A \cap B|` },
    { name:'Neither',             tex: String.raw`\text{neither} = N - |A \cup B|` },
    { name:'Only A',              tex: String.raw`|A|_{\text{only}} = |A| - |A \cap B|` },
    { name:'Union (3 sets)',      tex: String.raw`|\cup_i S_i| = \sum|S_i| - \sum|S_i \cap S_j| + |S_1 \cap S_2 \cap S_3|` },
    { name:'Valid chain',         tex: String.raw`A \subseteq B,\ B \subseteq C \ \Rightarrow\ A \subseteq C` },
    { name:'Safe conversion',     tex: String.raw`\text{All A are B} \Rightarrow \text{Some B are A}` },
    { name:'Induction pattern',   tex: String.raw`\Delta a_n = \text{const} \Rightarrow a_n = a + (n-1)d` },
    { name:'Age invariance',      tex: String.raw`(f + k) - (s + k) = f - s` },
  ],

  examples: [
    { id:'A7-E1', exam:'BOTH', anchor:'GATE-3', covers:['deduction-induction'],
      difficulty:'seed',
      stem: String.raw`**Induction step.** A sequence runs 2, 4, 6, 8, … Continuing the pattern, what is the 5th term?`,
      solution: String.raw`Constant difference $d = 2$ (induction from four observations — the pattern, once named, does the work):
$$a_5 = 2 + (5-1)\times 2 = 10$$`,
      trap: String.raw`Induction proposes, it never proves — the honest wording is "continuing *the pattern*". What is scored is the named rule (add 2) applied correctly, not philosophical certainty.`,
      verify: { value: 10, expr: '2+((5-1)*2)', tol: 0.001, unit: '' } },

    { id:'A7-E2', exam:'BOTH', anchor:'CSIR-6', covers:['venn-diagrams'],
      difficulty:'seed',
      stem: String.raw`**Venn union.** In a class of 40, 25 play cricket and 18 play football; 8 play both. How many play at least one of the two games?`,
      solution: String.raw`$$|C \cup F| = |C| + |F| - |C \cap F| = 25 + 18 - 8 = 35$$`,
      trap: String.raw`$25 + 18 = 43$ counts the 8 dual players twice — and 43 > 40 should veto itself. Any region-count exceeding the population is the same structural alarm as a probability above 1.`,
      verify: { value: 35, expr: '(25+18)-8', tol: 0.001, unit: 'students' } },

    { id:'A7-E3', exam:'CSIR', anchor:'CSIR-6', covers:['syllogisms'],
      difficulty:'standard',
      stem: String.raw`**Universal premise.** All 24 students in a row are wearing blue. Every student wearing blue in the row has passed. How many of the 24 could possibly have **failed**?`,
      solution: String.raw`Premise chain: blue $=$ all 24 $\Rightarrow$ all 24 passed.
$$\text{possible failures among the 24} = 24 - 24 = 0$$
The universal premise leaves no escape hatch — a failed blue-wearer would contradict the second premise directly.`,
      trap: String.raw`"Some" and "possibly" phrasing tempts students to leave room ("maybe 1 or 2"). A universal premise (**all**) is an airtight container: zero exceptions is the only consistent answer.`,
      verify: { value: 0, expr: '24-24', tol: 0, unit: 'students' } },

    { id:'A7-E4', exam:'GATE', anchor:'GATE-3', covers:['analogy'],
      difficulty:'standard',
      stem: String.raw`**Number analogy.** $7 : 49 :: 9 : \; ?$`,
      solution: String.raw`Name the relation: second $=$ square of the first.
$$9 : 9^2 = 9 : 81$$`,
      trap: String.raw`The surface delta ($49 - 7 = 42$, so $9 + 42 = 51$) treats the analogy as subtraction — but the rule must hold for the **first** pair as a named relation: $7 \times 7 = 49$ names a law; $7 + 42 = 49$ names a coincidence.`,
      verify: { value: 81, expr: '9*9', tol: 0.001, unit: '' } },

    { id:'A7-E5', exam:'CSIR', anchor:'CSIR-6', covers:['venn-diagrams'],
      difficulty:'standard',
      stem: String.raw`**Neither region.** Of 60 students, 35 play cricket, 28 play football and 12 play both. How many play neither game?`,
      solution: String.raw`$$|C \cup F| = 35 + 28 - 12 = 51$$
$$\text{neither} = N - |C \cup F| = 60 - 51 = 9$$`,
      trap: String.raw`Forgetting the overlap ($60 - 35 - 28 = -3$) produces a *negative population* — the strongest possible self-veto, and it appears purely because the 12 were subtracted where they were never added.`,
      verify: { value: 9, expr: '60-(35+28-12)', tol: 0.001, unit: 'students' } },

    { id:'A7-E6', exam:'BOTH', anchor:'GATE-3', covers:['numerical-relations'],
      difficulty:'standard',
      stem: String.raw`**Age relation.** A father is three times as old as his son. Twelve years from now he will be twice as old as the son. How old is the son now?`,
      solution: String.raw`Let the son be $s$. Then father $= 3s$, and both clocks advance:
$$3s + 12 = 2(s + 12) \;\Rightarrow\; 3s + 12 = 2s + 24 \;\Rightarrow\; s = 12$$`,
      trap: String.raw`Advancing only one clock ($3s + 12 = 2s$) gives nonsense; freezing both gives $3s = 2s$ contradictions. The "+12" must ride on **every** person in the stem — else the age gap silently changes.`,
      verify: { value: 12, expr: '((2*12)-12)/(3-2)', tol: 0.001, unit: 'years' } },

    { id:'A7-E7', exam:'CSIR', anchor:'CSIR-6', covers:['syllogisms','venn-diagrams'],
      difficulty:'apex',
      stem: String.raw`**Break-the-conclusion.** Statements: All pens are books. All books are chairs. Conclusions: (I) All pens are chairs. (II) All chairs are pens. How many conclusions follow?`,
      solution: String.raw`Chain the premises: pens $\subseteq$ books $\subseteq$ chairs, so (I) follows.
(II) is the full-reversal trap: draw books = chairs with pens a tiny region inside — premises hold, (II) fails.
$$\text{valid conclusions} = 1 + 0 = 1$$`,
      trap: String.raw`(II) *feels* true when the sets are drawn equal — but a conclusion must survive **every** legal drawing, not the prettiest one. One counter-picture kills it.`,
      verify: { value: 1, expr: '(1+0)', tol: 0, unit: 'conclusions' } },

    { id:'A7-E8', exam:'GATE', anchor:'GATE-3', covers:['numerical-relations','deduction-induction'],
      difficulty:'apex',
      stem: String.raw`**Cascade relation.** In an office, every senior supervises exactly 4 juniors, and every junior is supervised by exactly one senior. If there are 15 seniors, how many office members are there in total?`,
      solution: String.raw`$$\text{juniors} = 15 \times 4 = 60$$
$$\text{total} = 15 + 60 = 75$$`,
      trap: String.raw`Answering 60 (juniors only) when "total members" was asked — the seniors themselves count. Reading the requested quantity one clause short of the full stem is the costliest cheap error in this wing.`,
      verify: { value: 75, expr: '(15*4)+15', tol: 0.001, unit: 'members' } },

    { id:'A7-E9', exam:'CSIR', anchor:'CSIR-6', covers:['analogies-classification'],
      difficulty:'standard',
      stem: String.raw`**Odd one out.** Of $121,\ 144,\ 169,\ 190$, exactly one breaks the group property. Name the offset of the wrong term from the term that *should* stand in its place.`,
      solution: String.raw`Name the property: $121 = 11^2$, $144 = 12^2$, $169 = 13^2$ — consecutive perfect squares; the fourth should be $14^2 = 196$.
$$\text{offset} = 196 - 190 = 6$$
So 190 is the odd one out, off its rightful square by exactly 6.`,
      trap: String.raw`Two surface rules compete here — "all three-digit numbers" includes 190, so that property is useless; the intended rule must separate **exactly one** item. If your named property splits the set 3–1 you have found it; 2–2 splits are the examiner's decoy grammar.`,
      verify: { value: 6, expr: '(14*14)-190', tol: 0.001, unit: 'offset' } },
  ],

  speedSheet: String.raw`## ⚡ A7 SPEED SHEET — 60 seconds before the paper

**Deduction** = inescapable from premises · **Induction** = probable from cases. "Follows" = survives every drawing.
**Syllogism:** translate to sets · All→Some is the *only* free conversion · middle term must be distributed · one counter-picture kills a conclusion.
**Venn:** $|A \cup B| = |A|+|B|-|A \cap B|$ · neither $= N - \cup$ · 3-set: singles $+$ pairs $-$ triple $+$ · innermost region first.
**Analogy:** name the relation in a sentence before touching options · direction matters.
**Numeric relations:** is→= · of→× · advance **every** clock · answer the *full* question.` };

/* ======================================================= module A8 (C3) */
const MODULE_A8 = {
  id: 'A8',
  title: 'Arrangement, Puzzles & Codes',
  file: '🧠 A8 · Arrangement, Puzzles & Codes.md',
  anchors: ['CSIR-6'],
  anchorAtoms: {
    'CSIR-6': ['coding-decoding','blood-relations','direction-sense','seating-arrangement','puzzles','clocks-calendars-dice','series-completion']
  },
  register: 'formula-first + trap callouts',
  figureStyle: 'dark (matches content section)',
  stage: 'C3 reasoning wing',

  cards: [
    { id:'A8-C1', covers:['coding-decoding'], head: 'Coding Grammars',
      md: String.raw`Every letter code in Part A belongs to one of four grammars — identify which before decoding anything:

1. **Caesar shift** — every letter moves $\pm k$ along the alphabet (DOG $\to$ GRJ is $+3$).
2. **Reversal** — the word is written backwards, possibly before/after shifting.
3. **Positional swap** — letters trade places in a fixed pattern (1↔3, 2↔4).
4. **Substitution table** — arbitrary pairs given by the stem itself.

Decode by *writing the alphabet spine* once (A=1 … Z=26) and mapping letter by letter. Never decode all four options — decode the target word and match; reverse-engineering every option quadruples the clock cost.` },
    { id:'A8-C2', covers:['coding-decoding','series-completion'], head: 'The Letter–Number Spine',
      md: String.raw`$$A=1,\ B=2,\ \ldots,\ Z=26 \qquad \text{reverse: } A=26,\ B=25,\ \ldots \ (\text{partner} = 27 - n)$$

Letter series are number series in costume: A, C, F, J, O, ? becomes $1, 3, 6, 10, 15, ?$ — differences $2, 3, 4, 5$, so the next is $15 + 6 = 21 = U$. Always convert to the number spine first; the pattern grammar of A2-C5 (differences → product → alternating) then applies unchanged. Opposite-letter pairs (A↔Z, B↔Y) sum to 27 — a three-second check that kills half the code traps.` },
    { id:'A8-C3', covers:['blood-relations'], head: 'The Blood-Tree Protocol',
      md: String.raw`Relation chains survive only as a drawn tree. Protocol:

1. Start from the speaker (or the named anchor), mark gender unknowns with a $\square$.
2. Walk one possessive at a time — "my grandfather's only son" is two steps, not one.
3. Collapse: "X's only son", when X is *my* grandparent, lands on my parent — gender resolves only where the stem (or the options) forces it.

The canonical trap chain — "she is the daughter of my grandfather's only son" — resolves grandfather $\to$ my parent $\to$ that parent's daughter $=$ **my sister** (or the speaker herself, if female). Draw it, then answer.` },
    { id:'A8-C4', covers:['direction-sense'], head: 'Direction Sense = Vector Walk',
      md: String.raw`Track the walk as $(x, y)$: East $+x$, North $+y$; left/right turns rotate the current heading $90^\circ$ — never re-anchor to the page.

$$d_{\text{final}} = \sqrt{x^2 + y^2} \qquad \text{direction from start} = \text{quadrant of } (x, y)$$

The examiner's lever is the turn sequence: "turns left, walks 5, turns right…" Each turn updates the heading first; the walk adds along the *new* heading. Final displacement cares only about the net vector — total distance walked is a different number and is the stocked distractor pair.` },
    { id:'A8-C5', covers:['seating-arrangement'], head: 'Seating: Fix, Then Place',
      md: String.raw`Linear row with a named seat: fix the constrained person(s), arrange the rest — each fixed element removes a factorial layer. Circular table: **fix one person outright** (rotations are identical), and only then place constraints; direction language changes meaning in a circle — "to the immediate left" depends on the facing convention (faces in: standard).

Unplaceable stems use dangling clues ("C sits somewhere between A and D"); park those, place the hard constraints (adjacent pairs, exact positions) first, and let the soft clues collapse last. A constraint map discarded mid-solve is where seating questions eat ten minutes.` },
    { id:'A8-C6', covers:['clocks-calendars-dice'], head: 'Clock Angles & Calendar Odd Days',
      md: String.raw`$$\theta = \left|30H - \frac{11}{2}M\right| \quad (\text{take } \min(\theta,\ 360^\circ - \theta))$$

The hour hand creeps $0.5^\circ$ per minute — the formula prices that in. Hands coincide every $\tfrac{720}{11}$ minutes ($\approx 65\tfrac{5}{11}$), not every 65.

Calendars run on **odd days** $=$ total days $\bmod 7$: normal year $= +1$, leap year $= +2$ ($366 \bmod 7$). A leap year counts only when February 29 actually falls inside the window — century years ($1900$, $2100$) are *not* leap unless divisible by 400.` },
    { id:'A8-C7', covers:['clocks-calendars-dice'], head: 'Dice: Opposites and Views',
      md: String.raw`A standard die fixes opposite pairs: $1\!-\!6,\ 2\!-\!5,\ 3\!-\!4$ (sum 7). From views, the logic is set subtraction:

* Two views share **one** face → the unshared visible faces of the two views are opposite.
* Two views share **two** faces → the third faces are opposite each other.
* One view shows three faces → none of those three can be opposite each other.

A face can never be opposite its own visible neighbour — half the wrong options are just that clause ignored.` },
    { id:'A8-C8', covers:['puzzles'], head: 'Puzzle Protocol (Jugs, Crossings, Weighings)',
      md: String.raw`Resource puzzles dissolve into a state list, not inspiration. Jugs: states are $(a, b)$ contents; legal moves are six — fill, empty, pour — per jug; the target is reached when $a$ or $b$ holds the wanted value. With a 5 L and 3 L jug, $5 - 3 = 2$ and $2 + 2 = 4$ — every jug answer is built from signed jug-size sums.

River crossings: the escort object returns each trip, so count *crossings*, not people-moves. Pan balances: each weighing splits the candidate space 3 ways, so $n$ weighings discriminate up to $3^n$ cases ($n = 2 \to 9$ coins). The protocol beats the flash of insight every time the stakes are two marks.` },
  ],

  formulas: [
    { name:'Letter spine',        tex: String.raw`A=1,\ Z=26;\ \ \text{reverse partner} = 27 - n` },
    { name:'Caesar shift',        tex: String.raw`c_i = p_i + k \pmod{26}` },
    { name:'Displacement',        tex: String.raw`d = \sqrt{x^2 + y^2}` },
    { name:'Clock angle',         tex: String.raw`\theta = \left|30H - \tfrac{11}{2}M\right|` },
    { name:'Hands coincide',      tex: String.raw`T = \dfrac{720}{11} \text{ min}` },
    { name:'Odd days (leap)',     tex: String.raw`366 \bmod 7 = 2,\ \ 365 \bmod 7 = 1` },
    { name:'Die opposites',       tex: String.raw`1\!-\!6,\ 2\!-\!5,\ 3\!-\!4 \ (\text{sum } 7)` },
    { name:'Circle seating',      tex: String.raw`(n-1)! \ \text{arrangements}` },
    { name:'Pan balance reach',   tex: String.raw`n \text{ weighings} \to 3^n \text{ cases}` },
    { name:'Jug algebra',         tex: String.raw`\text{target} = a V_1 \pm b V_2` },
  ],

  examples: [
    { id:'A8-E1', exam:'BOTH', anchor:'CSIR-6', covers:['coding-decoding'],
      difficulty:'seed',
      stem: String.raw`**Caesar shift.** In a code, DOG is written as GRJ. Confirming the same rule, what is the letter-spine sum ($A=1 \ldots Z=26$) of the coded word?`,
      solution: String.raw`The shift is $+3$ (D→G, O→R, G→J — consistent on all three). Coded letters on the spine:
$$G + R + J = 7 + 18 + 10 = 35$$`,
      trap: String.raw`Summing the *original* letters ($4+15+7 = 26$) instead of the coded ones — the stem prices the coded word. Also: the shift must hold for **all three** letters before the grammar is confirmed.`,
      verify: { value: 35, expr: '(4+3)+(15+3)+(7+3)', tol: 0.001, unit: '' } },

    { id:'A8-E2', exam:'CSIR', anchor:'CSIR-6', covers:['blood-relations'],
      difficulty:'seed',
      stem: String.raw`**Family chain.** Pointing to a photograph, Asha said, "He is the son of my mother's only daughter." How is he related to Asha — and what is the generation gap between them (same generation = 0)?`,
      solution: String.raw`Walk the possessives from Asha: my mother's only daughter $=$ **Asha herself**; his mother is Asha.
$$\text{generation gap} = 1 \text{ (one generation down: her son)}$$`,
      trap: String.raw`"My mother's daughter" could mean a sister — but the word **only** collapses it onto Asha. Jumping chains ("mother's… → sibling-ish") without walking each possessive is how "brother" gets printed on the answer sheet.`,
      verify: { value: 1, expr: '(1)', tol: 0, unit: 'generation gap' } },

    { id:'A8-E3', exam:'CSIR', anchor:'CSIR-6', covers:['direction-sense'],
      difficulty:'standard',
      stem: String.raw`**Vector walk.** A man walks 3 km north, then 4 km east. How far is he from the starting point?`,
      solution: String.raw`Net vector $(x, y) = (4, 3)$:
$$d = \sqrt{4^2 + 3^2} = \sqrt{16 + 9} = \sqrt{25} = 5 \text{ km}$$`,
      trap: String.raw`Total distance walked ($3 + 4 = 7$ km) is the paired distractor — displacement closes the triangle with Pythagoras. Direction and distance are separate questions; do not answer one with the other.`,
      verify: { value: 5, expr: 'Math.sqrt((4*4)+(3*3))', tol: 0.001, unit: 'km' } },

    { id:'A8-E4', exam:'CSIR', anchor:'CSIR-6', covers:['seating-arrangement'],
      difficulty:'standard',
      stem: String.raw`**Fixed seat.** Five people A, B, C, D, E sit in a row. If A must occupy the middle seat, in how many ways can the five be seated?`,
      solution: String.raw`Fix A in seat 3; the other four arrange freely:
$$4! = 4 \times 3 \times 2 \times 1 = 24$$`,
      trap: String.raw`Answering $5! = 120$ ignores the constraint; placing A in "any of 5 seats then arranging" ($5 \times 24$) double-counts the fix. Hard constraint first — each one removed before the free arrangement costs a factorial layer.`,
      verify: { value: 24, expr: '4*3*2*1', tol: 0.001, unit: 'ways' } },

    { id:'A8-E5', exam:'BOTH', anchor:'CSIR-6', covers:['clocks-calendars-dice'],
      difficulty:'standard',
      stem: String.raw`**Clock angle.** What is the angle between the two hands of a clock at 3:30?`,
      solution: String.raw`$$\theta = \left|30H - \frac{11}{2}M\right| = \left|30(3) - \frac{11}{2}(30)\right| = |90 - 165| = 75^\circ$$`,
      trap: String.raw`Answering $90^\circ$ freezes the hour hand at the 3 — by 3:30 it has crept $15^\circ$ toward 4. The $\tfrac{11}{2}$ multiplier is exactly the minute hand's rate (6°/min) minus that creep (0.5°/min).`,
      verify: { value: 75, expr: 'Math.abs((30*3)-((11/2)*30))', tol: 0.001, unit: 'degrees' } },

    { id:'A8-E6', exam:'BOTH', anchor:'CSIR-6', covers:['series-completion','coding-decoding'],
      difficulty:'standard',
      stem: String.raw`**Letter series.** Complete: A, C, F, J, O, ? — give the spine number ($A = 1$) of the missing letter.`,
      solution: String.raw`Spine numbers: $1, 3, 6, 10, 15$ — differences $2, 3, 4, 5$, growing by 1:
$$\text{next} = 15 + 6 = 21 \;\Rightarrow\; U$$`,
      trap: String.raw`Reading the gaps as constant ($+2$ or $+3$ forever) or pattern-spotting on the *shapes* of letters — the number spine is what exposes the $2, 3, 4, 5$ ladder.`,
      verify: { value: 21, expr: '15+6', tol: 0.001, unit: 'letter number' } },

    { id:'A8-E7', exam:'CSIR', anchor:'CSIR-6', covers:['puzzles'],
      difficulty:'apex',
      stem: String.raw`**Jug puzzle.** With unmarked 5-litre and 3-litre jugs and unlimited water, exactly 4 litres must end in the 5-litre jug. The route builds it as $5 - 3$ saved twice. Verify the total.`,
      solution: String.raw`$$5 - 3 = 2 \text{ L saved; repeat: } 2 + 2 = 4 \text{ L}$$
Full route: fill 5 → pour into 3 (2 L left in the 5) → empty the 3 → move the 2 across → fill 5 again → top up the 3 (absorbs just 1) → $5 - 1 = 4$ L remains in the big jug.`,
      trap: String.raw`Estimating "about four fifths" by eye is impossible with unmarked jugs — they are integer machines: every reachable amount is a signed sum $5a + 3b$. If the target can't be formed that way, it can't be formed at all.`,
      verify: { value: 4, expr: '(5-3)+(5-3)', tol: 0.001, unit: 'litres' } },

    { id:'A8-E8', exam:'CSIR', anchor:'CSIR-6', covers:['clocks-calendars-dice','puzzles'],
      difficulty:'apex',
      stem: String.raw`**Die face.** A standard die (opposite faces sum to 7) shows 4 on top. Which number is on the bottom face?`,
      solution: String.raw`$$\text{opposite} = 7 - 4 = 3$$`,
      trap: String.raw`One view alone only rules out 4's four visible neighbours — "not adjacent" still leaves two candidates. The sum-7 convention of a *standard* die is a stated given, not something to derive from the view.`,
      verify: { value: 3, expr: '7-4', tol: 0.001, unit: '' } },
  ],

  speedSheet: String.raw`## ⚡ A8 SPEED SHEET — 60 seconds before the paper

**Codes:** spine A=1…Z=26 first · shift → reversal → swap → substitution · opposite partners sum to 27.
**Letter series = number series:** convert, then ladder the differences.
**Blood:** tree it from the speaker, one possessive per step, gender resolved last.
**Directions:** net vector $(x, y)$ · displacement $\sqrt{x^2+y^2}$ ≠ distance walked.
**Seating:** hard constraints first · circle: fix one outright, $(n-1)!$.
**Clocks:** $\theta = |30H - \tfrac{11}{2}M|$ · coincide every $\tfrac{720}{11}$ min.
**Calendars:** odd days $\bmod 7$ · leap $+2$, normal $+1$ · centuries need ÷400.
**Dice:** opposites sum to 7 · adjacent is never opposite.
**Puzzles:** state lists, not inspiration · jugs = signed sums · balance reach $= 3^n$.`
};

/* ======================================================= module A9 (C3) */
const MODULE_A9 = {
  id: 'A9',
  title: 'Spatial Aptitude Lab',
  file: '🧠 A9 · Spatial Aptitude Lab.md',
  anchors: ['GATE-4','CSIR-6'],
  anchorAtoms: {
    'GATE-4': ['shape-transformations','mirroring','assembling-grouping','paper-folding-cutting','2D-3D-patterns'],
    'CSIR-6': ['series-completion','puzzles']
  },
  register: 'formula-first + trap callouts',
  figureStyle: 'dark (matches content section)',
  stage: 'C3 reasoning wing',

  cards: [
    { id:'A9-C1', covers:['shape-transformations'], head: 'The Movement Grammar',
      md: String.raw`Three primitives generate every 2D transformation stem:

* **Translation** — slides; nothing changes orientation or size.
* **Rotation** — turns about a fixed point; a shape rotated $90^\circ$ four times returns to itself. Order of rotation steps matters when combined with mirrors.
* **Scaling** — stretches by $k$; area multiplies by $k^2$ (bridge: A5-C4).

Procedural rule: apply transformations to **one distinctive feature** (an arrowhead, a shaded corner) and track it — not the whole shape. Whole-shape re-drawing under time pressure is where orientation flips happen.` },
    { id:'A9-C2', covers:['mirroring'], head: 'Mirror & Water Images',
      md: String.raw`A **mirror image** (vertical mirror) swaps left and right; a **water image** (horizontal) swaps top and bottom. Both reverse handedness — an "R" becomes a backwards R, never a normal one.

The highest-scoring application is the mirror-clock:

$$t_{\text{mirror}} = 11{:}60 - t_{\text{real}} \qquad (12{:}00 \text{ becomes the symmetric reference})$$

Letter audit worth memorizing: A, H, I, M, O, T, U, V, W, X, Y are vertically symmetric (unchanged in a vertical mirror); B, C, D, E, H, I, O, X survive a horizontal one. Any option showing an asymmetric letter unchanged is eliminated for free.` },
    { id:'A9-C3', covers:['assembling-grouping'], head: 'Embedded-Figure Counting Protocol',
      md: String.raw`"How many triangles/squares in this figure?" is a census problem, not a spotting contest. Protocol: count by **size class**, smallest first, and exhaust each class before moving up.

Grids: an $n \times n$ square grid contains

$$\sum_{k=1}^{n} k^2 = 1^2 + 2^2 + \cdots + n^2 \text{ squares}$$

A triangle with its base split into $m$ segments and all cevians meeting at the apex contains $\tfrac{m(m+1)}{2}$ triangles. Diagonals in rectangles need *both* steps: axis-aligned squares, then tilted ones — the tilted class is the one everyone drops.` },
    { id:'A9-C4', covers:['paper-folding-cutting'], head: 'Paper Folding → Cutting → Punching',
      md: String.raw`Each fold doubles the layers. After $k$ folds the paper has $2^k$ layers, so $p$ punches through all layers open

$$\text{holes} = p \times 2^k$$

on full unfolding — **unless a punch lands on a crease or an edge**, where two mirror-holes coincide into one (punch on a fold line halves that punch's yield). Mirror the hole pattern back across the *last* fold first, then work backwards fold by fold. The fold sequence's order (vertical-then-horizontal vs the reverse) changes hole positions, not their count — position questions track order, count questions don't.` },
    { id:'A9-C5', covers:['2D-3D-patterns'], head: 'Nets, Faces, and the Solid Audit',
      md: String.raw`A cube net folds into 6 faces; opposite-face logic never trusts screen distance — flat adjacency need not survive the fold. The reliable procedure: choose one square as the base, mentally fold its neighbours up around it, and let the last square land where it must. Two squares separated by exactly one square in a **straight strip of the net** end up on opposite faces — but verify by the fold-walk whenever the strip bends. A solid's inventory always satisfies Euler:

$$V - E + F = 2$$

so a cube ($V=8, F=6$) must have $E = 12$ — miscounted nets fail this audit immediately.` },
    { id:'A9-C6', covers:['2D-3D-patterns','puzzles'], head: 'Painted-Cube Taxonomy',
      md: String.raw`An $n \times n \times n$ cube painted on all faces and diced into unit cubes sorts its pieces into exactly four census classes:

$$ \text{3 faces} = 8 \ (\text{corners}) \qquad \text{2 faces} = 12(n-2) \ (\text{edges}) $$
$$ \text{1 face} = 6(n-2)^2 \ (\text{face-centres}) \qquad \text{0 faces} = (n-2)^3 \ (\text{core}) $$

The four classes always sum to $n^3$ — run that census check before answering. "Painted on some faces only" variants re-assign corners/edges by adjacency to painted faces; the frame (corners, edges, centres) still organizes the count.` },
    { id:'A9-C7', covers:['series-completion'], head: 'Figure-Series Protocol',
      md: String.raw`Figure series are number series wearing shapes: each attribute — position, rotation, shading, element count — follows its own series. The protocol is to **split attributes immediately**:

* Count: elements per frame form a number series ($3, 5, 7, \ldots$).
* Rotation: the anchor item turns by a fixed angle each frame ($45^\circ$, $90^\circ$).
* Position: elements hop corners in a fixed direction (clockwise, one step).

Lock each attribute's law independently; the answer must satisfy **all** laws simultaneously, and option sets are built so that satisfying only two of three laws lands on the planted wrong cell.` },
    { id:'A9-C8', covers:['shape-transformations','mirroring','puzzles'], head: 'Spatial Trap Anthology',
      md: String.raw`The recurring ambushes in the spatial wing:

1. **Rotation↔mirror swap** — a $180^\circ$ rotation is not a mirror image; handedness is preserved by rotation, reversed by mirrors.  \n2. **Crease punch** — holes on a fold line count once, not twice.  \n3. **Tilted-class blindness** — counting only axis-aligned squares.  \n4. **Net memory** — rigid "opposite face" charts misapplied; re-fold from a chosen base face instead.  \n5. **Census break** — painted-cube classes that don't sum to $n^3$ were miscounted.` },
  ],

  formulas: [
    { name:'Rotation period',      tex: String.raw`T = \dfrac{360^\circ}{\theta}` },
    { name:'Mirror clock',         tex: String.raw`t_{\text{mirror}} = 11{:}60 - t_{\text{real}}` },
    { name:'Grid squares',         tex: String.raw`\sum_{k=1}^{n} k^2 \ (\text{in an } n\times n \text{ grid})` },
    { name:'Triangles, base split', tex: String.raw`\dfrac{m(m+1)}{2}` },
    { name:'Fold layers',          tex: String.raw`2^k \ \text{layers after } k \text{ folds}` },
    { name:'Euler audit',          tex: String.raw`V - E + F = 2` },
    { name:'Painted: 3 faces',     tex: String.raw`8 \ (\text{corners, always})` },
    { name:'Painted: 2 faces',     tex: String.raw`12(n-2)` },
    { name:'Painted: 1 face',      tex: String.raw`6(n-2)^2` },
    { name:'Painted: 0 faces',     tex: String.raw`(n-2)^3` },
  ],

  examples: [
    { id:'A9-E1', exam:'BOTH', anchor:'GATE-4', covers:['shape-transformations'],
      difficulty:'seed',
      stem: String.raw`**Rotation return.** A figure is rotated $90^\circ$ clockwise in each successive frame. Starting from the original, how many frames until the figure first looks identical to the start?`,
      solution: String.raw`$$T = \frac{360^\circ}{90^\circ} = 4 \text{ frames}$$`,
      trap: String.raw`The identical-look return is about the **whole figure** — an asymmetric element returns only after the full $360^\circ$, even if a symmetric part *seems* aligned at $180^\circ$.`,
      verify: { value: 4, expr: '360/90', tol: 0.001, unit: 'frames' } },

    { id:'A9-E2', exam:'GATE', anchor:'GATE-4', covers:['mirroring'],
      difficulty:'seed',
      stem: String.raw`**Mirror clock.** A clock in the mirror reads 4:30. What is the real time? (Give minutes elapsed since 12:00.)`,
      solution: String.raw`$$t_{\text{real}} = 11{:}60 - 4{:}30 = 7{:}30$$
In minutes since 12:00: $(7 \times 60) + 30 = 450$.`,
      trap: String.raw`Subtracting from 12:00 mechanically ($12{:}00 - 4{:}30 = 7{:}30$ works here by luck) — the borrow-safe form is $11{:}60$; against 4:45 the careless 12:00 subtraction breaks ($12 - 4$, $00 - 45$ dead-ends).`,
      verify: { value: 450, expr: '((11*60)+60)-((4*60)+30)', tol: 0.001, unit: 'min' } },

    { id:'A9-E3', exam:'CSIR', anchor:'GATE-4', covers:['assembling-grouping'],
      difficulty:'standard',
      stem: String.raw`**Square census.** How many squares does a $3 \times 3$ grid contain in total?`,
      solution: String.raw`Count by size class:
$$\underbrace{9}_{1\times1} + \underbrace{4}_{2\times2} + \underbrace{1}_{3\times3} = 14 \text{ squares}$$`,
      trap: String.raw`Answering 9 counts only the unit cells; 13 ($= 14-1$) drops the outer square. Size-class exhaustion is the only spray-proof method.`,
      verify: { value: 14, expr: '9+4+1', tol: 0.001, unit: 'squares' } },

    { id:'A9-E4', exam:'GATE', anchor:'GATE-4', covers:['2D-3D-patterns','puzzles'],
      difficulty:'standard',
      stem: String.raw`**Painted cube.** A $3 \times 3 \times 3$ cube is painted on all faces and cut into unit cubes. How many small cubes have exactly two painted faces?`,
      solution: String.raw`$$12(n-2) = 12 \times (3-2) = 12$$
*(Census check: $8$ corners $+ 12$ edges $+ 6$ face-centres $+ 1$ core $= 27 = 3^3$ ✓.)*`,
      trap: String.raw`Assigning two-face status to face-centre cubes ($6(n-2)^2 = 6$) — two painted faces **only** live on edges, corners excluded. The census sum to $n^3$ is the self-audit that catches the swap.`,
      verify: { value: 12, expr: '12*(3-2)', tol: 0.001, unit: 'cubes' } },

    { id:'A9-E5', exam:'BOTH', anchor:'GATE-4', covers:['paper-folding-cutting'],
      difficulty:'standard',
      stem: String.raw`**Fold and punch.** A square sheet is folded in half vertically, then in half horizontally. Two holes are punched through the folded stack, neither on a crease. How many holes appear when the sheet is fully unfolded?`,
      solution: String.raw`Two folds $\Rightarrow 2^2 = 4$ layers; each punch threads all four:
$$\text{holes} = 2 \times 2^2 = 8$$`,
      trap: String.raw`Counting $2 + 2 = 4$ (adding instead of layering) or $2 \times 2 \times 2 \times 2 = 16$ (double-charging the folds-fold relation, $2^k$, not $2k$). Crease punches are the one exception — and this stem rules them out explicitly.`,
      verify: { value: 8, expr: '2*(2**2)', tol: 0.001, unit: 'holes' } },

    { id:'A9-E6', exam:'CSIR', anchor:'CSIR-6', covers:['2D-3D-patterns','puzzles'],
      difficulty:'standard',
      stem: String.raw`**Net logic.** A die numbered 1–6 (opposite faces sum to 7) is unfolded. In the flat net, face 1 is adjacent to faces 2, 3, 4 and 5. Which number is on the face opposite 1?`,
      solution: String.raw`A cube face has exactly four neighbours and one opposite. All four neighbours of 1 are named ($2, 3, 4, 5$):
$$\text{opposite of } 1 = 21 - (1 + 2 + 3 + 4 + 5) = 6$$`,
      trap: String.raw`Trying to read "opposite" off the flat net by screen distance — net adjacency ≠ cube adjacency. Count the neighbours: whoever isn't adjacent and isn't the face itself is the opposite.`,
      verify: { value: 6, expr: '21-(1+2+3+4+5)', tol: 0.001, unit: '' } },

    { id:'A9-E7', exam:'GATE', anchor:'GATE-4', covers:['assembling-grouping'],
      difficulty:'apex',
      stem: String.raw`**Triangle census.** A triangle has its base divided into 4 segments, with lines from the apex to every division point. How many triangles does the figure contain?`,
      solution: String.raw`Every triangle is a choice of any 2 of the... — count by right-edge class instead: apex fixed, each pair of base division-points pairs with the apex:
$$\frac{m(m+1)}{2} = \frac{4 \times 5}{2} = 10 \text{ triangles}$$`,
      trap: String.raw`Counting only the 4 small slices plus the big outer one (5) ignores the composited middles. Pairs of base points: $\binom{5}{2} = 10$ — same census, combinatorial cross-check.`,
      verify: { value: 10, expr: '(4*5)/2', tol: 0.001, unit: 'triangles' } },

    { id:'A9-E8', exam:'CSIR', anchor:'CSIR-6', covers:['series-completion'],
      difficulty:'apex',
      stem: String.raw`**Figure series.** A figure series shows dot clusters of 3, 5, 7, 9 in successive frames (all other attributes unchanged). How many dots must the next frame carry?`,
      solution: String.raw`Attribute split: only the count varies, as an arithmetic ladder with $d = 2$:
$$a_5 = 9 + 2 = 11 \text{ dots}$$`,
      trap: String.raw`Answer sets commonly include a cell with the right count but a rotated inner mark (or the right mark with $10$ dots) — satisfying two of three attribute laws is the planted cell. All laws must pass.`,
      verify: { value: 11, expr: '9+2', tol: 0.001, unit: 'dots' } },
  ],

  speedSheet: String.raw`## ⚡ A9 SPEED SHEET — 60 seconds before the paper

**Track one feature** through transforms — not the whole shape.
**Mirror** = left/right swap · water = top/bottom · mirror clock: $11{:}60 - t$. Rotation keeps handedness, mirrors flip it.
**Census by size class:** $n \times n$ grid → $\sum k^2$ squares · base split $m$ → $m(m+1)/2$ triangles · don't skip the tilted class.
**Folds:** $k$ folds = $2^k$ layers · holes $= p \times 2^k$ · crease punch counts once.
**Nets:** pick a base face, walk neighbours · audit: $V - E + F = 2$.
**Painted cube:** 8 corners · $12(n-2)$ edges · $6(n-2)^2$ centres · $(n-2)^3$ core · **sum must be** $n^3$.
**Figure series:** split count / rotation / position into separate laws — the answer passes **all** of them.`
};

/* ======================================================= module A10 (C4) */
const MODULE_A10 = {
  id: 'A10',
  title: 'Verbal Aptitude Gym',
  file: '🧠 A10 · Verbal Aptitude Gym.md',
  anchors: ['GATE-1'],
  anchorAtoms: {
    'GATE-1': ['grammar-tenses-articles','grammar-prepositions-conjunctions','grammar-agreement',
               'parts-of-speech','reading-comprehension','narrative-sequencing','vocabulary-idioms-phrases']
  },
  register: 'rule-first + trap callouts',
  figureStyle: 'dark (matches content section)',
  stage: 'C4 verbal + science + craft',

  cards: [
    { id:'A10-C1', covers:['grammar-tenses-articles'], head: 'Articles Are About Sound, Not Spelling',
      md: String.raw`**a / an** is chosen by the *sound* that follows, not the letter: **an** MBA (vowel sound "em"), **a** university (consonant sound "yoo"). **the** points at something specific or already mentioned — "I saw *a* dog; *the* dog was huge." Abstract nouns and plurals used generally take **no article**: "Honesty is the best policy," not "The honesty…".

GA's favourite rigged sentence: "He is an university student" — looks right (vowel letter u), sounds wrong (consonant glide /j/). Read article questions *aloud in your head*; your ear catches what your eye misses.` },
    { id:'A10-C2', covers:['grammar-tenses-articles'], head: 'Tenses: Two Clocks, One Rule',
      md: String.raw`GA tenses reduce to anchoring on a timeline. The three highest-yield rules:

1. **Past perfect for the earlier of two pasts**: "By the time the guests *arrived*, she *had finished* cooking." The past-perfect verb is the one that happened **first**.
2. **Present perfect connects past to now** — never with a finished time word: "I *have lived* here since 2019" ✓ · "I have lived here in 2019" ✗ (finished time → simple past: "I lived here in 2019").
3. **Present continuous for the arranged future**: "We *are leaving* tomorrow" — not "we will be leave".

When two options differ only in tense, draw the timeline. Most GA tense items die to a single arrow.` },
    { id:'A10-C3', covers:['grammar-agreement'], head: 'Agreement: Find the Real Subject',
      md: String.raw`The verb agrees with the *head noun* of the subject phrase, not the nearest noun. "The quality of the apples **was** poor" — head is *quality*, not *apples*. The three manufactured traps:

* **Neither/either of + plural noun** still takes a singular verb: "Neither of the boys **has** come."
* **"The number of X is"** (singular, the count itself) vs **"A number of X are"** (plural, the members).
* **Interrupters** — clauses stuffed between subject and verb: "The captain, along with his men, **was** rescued."

Strip the sentence to *bare subject + verb* before choosing; agreement errors hide in the stuffing.` },
    { id:'A10-C4', covers:['grammar-prepositions-conjunctions'], head: 'Prepositions Are Memory + Collocations',
      md: String.raw`Prepositions come in two piles: **grammar-driven** and **collocation memory**.

Grammar-driven (rule-learnable): *at* clock times (at 5 pm) · *on* days & dates (on Monday, on 3rd March) · *in* months/years/enclosed spaces (in July, in 2024, in the hall) · *since* + starting point (since 2019) · *for* + duration (for five years).

Collocation memory (must be owned, no rule): good **at** · interested **in** · depend **on** · consist **of** · different **from** · accuse **of** · insist **on** · afraid **of**. Conjunctions complete the card: *although* pairs with a comma clause, never with *but* ("Although he was tired, he worked" ✓ — "Although…but" ✗).` },
    { id:'A10-C5', covers:['parts-of-speech'], head: 'Parts of Speech: Function Before Form',
      md: String.raw`A word's class is its **job in this sentence**, not its dictionary label: "The *run* was easy" (noun) vs "They *run* daily" (verb) vs "a *run-down* house" (adjective). GA asks you to count or identify, and the reliable protocol is slot-testing:

* **Noun** slots after a/the/this and can pluralize.
* **Adjective** sits before a noun or after is/seem/become ("the *lazy* cat", "the cat seemed *lazy*").
* **Adverb** answers how/when/how much ("sing *sweetly*", "*very* tall" — adverbs can modify adjectives!).
* **Verb** carries the tense (only verbs accept -ed/-ing endings in the predicate).

The classic bleed: adverbs that modify adjectives ("*extremely* difficult") get counted as adjectives.` },
    { id:'A10-C6', covers:['reading-comprehension'], head: 'RC: The Passage Is the Whole Universe',
      md: String.raw`Reading comprehension questions have one commandment: **the answer lives in the passage, not in what you know**. Even if the passage says the moon is made of cheese, questions are answered about *that* moon. Work protocol:

1. Read the **first question first** (not all of them), so the passage is read with a target.
2. Structure-mark while reading: claim → evidence → contrast words (*however, but, although*) — GA answers hide at the contrast.
3. For inference items, apply the strict test: the correct statement must be **true if the passage is true**; "reasonable in real life" is not a criterion.

Trap grammar: options that repeat passage words but change the **scope** ("all scientists" when the passage said "some") are the standard wrong answer.` },
    { id:'A10-C7', covers:['narrative-sequencing'], head: 'Sequencing: Chain the Pronouns and Time Words',
      md: String.raw`Narrative sequencing (para-jumbles) is solved by *local glue*, not global feel. Two glues run almost every item:

* **Pronoun chains** — a sentence starting "He/This/These…" must follow the sentence that introduces the noun it points at. It can never open the paragraph.
* **Time/order markers** — "First… Then… Finally…", "In 1990… By 1995…", "Initially… Later…".

Procedure: find the opener (defines its terms, no backward-pointing pronoun), then chain pairs. If sentences P→Q are a chained pair, the correct option is whichever keeps the pair intact — often 3 of 4 options break one chain and die in seconds.` },
    { id:'A10-C8', covers:['vocabulary-idioms-phrases'], head: 'Vocabulary & Idioms: Context Replaces the Dictionary',
      md: String.raw`GA vocabulary is tested *in context* — the sentence around the word carries the meaning. Decode the tone (positive/negative) and role (praise/criticism/amount) before matching options: "His *meticulous* notes impressed the examiners" — the praise-frame lets you kill "careless" instantly even if "meticulous" was unknown to you.

Idioms are frozen phrases whose meaning is *not* the sum of their words: **spill the beans** = reveal a secret, **a blessing in disguise** = hidden good, **once in a blue moon** = very rarely, **hit the nail on the head** = say exactly the right thing. Never interpret idioms literally-in-part: "kick the bucket" questions are scored on the *phrase*, and a partial-literal reading is the planted distractor.` },
  ],

  formulas: [
    { name:'Sound rule (a/an)',   tex: String.raw`\text{an} + \text{vowel SOUND} \quad (\text{an MBA, but a university})` },
    { name:'Interrupter strip',   tex: String.raw`\text{head noun of subject phrase} \to \text{verb number}` },
    { name:'Past perfect clock',  tex: String.raw`\text{earlier past} = \text{had} + V_3` },
    { name:'Present perfect ban', tex: String.raw`\text{have} + V_3 \;\;\not\!\!\leftarrow\;\; \text{finished time word}` },
    { name:'Time prepositions',   tex: String.raw`\text{at} < \text{day} \to \text{on};\ \ \text{month/year} \to \text{in}` },
    { name:'Since vs for',        tex: String.raw`\text{since} + \text{point},\ \ \text{for} + \text{duration}` },
    { name:'RC strict test',      tex: String.raw`\text{passage true} \Rightarrow \text{answer statement true}` },
    { name:'Sequencing glue',     tex: String.raw`\text{pronoun sentence} \neq \text{opener}` },
  ],

  examples: [
    { id:'A10-E1', exam:'GATE', anchor:'GATE-1', covers:['grammar-tenses-articles'],
      difficulty:'seed',
      stem: String.raw`**Article audit.** Four sentences: (i) He is an university student. (ii) She gave me a useful book. (iii) I visited the Taj Mahal last year. (iv) Mount Everest is a highest peak. How many are error-free **in their articles**?`,
      solution: String.raw`Sound rule, sentence by sentence: (i) "university" begins with a /ju/ consonant glide → needs **a**, wrong. (ii) "useful" the same → **a** correct ✓. (iii) specific monument takes **the** ✓. (iv) superlative needs **the** highest, wrong.
$$\text{error-free} = 0 + 1 + 1 + 0 = 2$$`,
      trap: String.raw`The ear-vs-eye switch: "university" and "useful" start with a vowel *letter* but a consonant **sound** (/j/). Article choice follows pronunciation — spelling is the decoy.`,
      verify: { value: 2, expr: '(0+1+1+0)', tol: 0, unit: 'sentences' } },

    { id:'A10-E2', exam:'BOTH', anchor:'GATE-1', covers:['grammar-tenses-articles'],
      difficulty:'seed',
      stem: String.raw`**Tense match.** "I ___ (live) in Kochi since 2019." How many of these four fills are grammatical: (a) live · (b) am living · (c) have lived · (d) lived?`,
      solution: String.raw`"Since 2019" connects a past start to the present → present perfect is mandatory:
$$\text{only (c) works} \;\Rightarrow\; 0 + 0 + 1 + 0 = 1$$`,
      trap: String.raw`Simple past with "since" ("I lived here since 2019") is the regional-English echo that the option set amplifies; since-as-starting-point pairs only with perfect forms, never finished-time verbs.`,
      verify: { value: 1, expr: '(0+0+1+0)', tol: 0, unit: 'options' } },

    { id:'A10-E3', exam:'GATE', anchor:'GATE-1', covers:['grammar-tenses-articles'],
      difficulty:'standard',
      stem: String.raw`**Earlier of two pasts.** "By the time the inspector arrived, the staff ___ (hide) the records." Of the four fills — (a) hid, (b) had hidden, (c) have hidden, (d) were hiding — how many place the hiding strictly before the arrival?`,
      solution: String.raw`Two past events, hiding first → past perfect:
$$\text{only (b) had hidden} \;\Rightarrow\; 0 + 1 + 0 + 0 = 1$$`,
      trap: String.raw`(a) "hid" puts both events on one flat timeline, losing the ordering the stem cares about. "By the time + simple past" is the signature that demands had + V₃ for the earlier event.`,
      verify: { value: 1, expr: '(0+0+1+0)', tol: 0, unit: 'options' } },

    { id:'A10-E4', exam:'BOTH', anchor:'GATE-1', covers:['grammar-prepositions-conjunctions'],
      difficulty:'standard',
      stem: String.raw`**Preposition fills.** "The seminar is ___ Monday ___ 5 p.m. ___ the main hall." How many of the three blanks take a *time* preposition (as opposed to a place preposition)?`,
      solution: String.raw`___ Monday → **on** (day, time) · ___ 5 p.m. → **at** (clock time) · ___ the main hall → **in** (enclosed place).
$$\text{time prepositions} = 1 + 1 + 0 = 2$$`,
      trap: String.raw`"In Monday" and "on 5 p.m." are the classic swap pair; the ladder is at < on-day < in-month — a clock time is always *at*, never *on*.`,
      verify: { value: 2, expr: '(1+1+0)', tol: 0, unit: 'blanks' } },

    { id:'A10-E5', exam:'GATE', anchor:'GATE-1', covers:['grammar-agreement'],
      difficulty:'standard',
      stem: String.raw`**Singular or plural.** Three stems: (i) Neither of the solutions ___ acceptable. (ii) The number of applicants ___ doubled. (iii) A number of applicants ___ rejected. How many take a **singular** verb?`,
      solution: String.raw`(i) Neither of → singular (**is**). (ii) *The number of* = the count itself → singular (**has**). (iii) *A number of* = several members → plural (**were**).
$$\text{singular verbs} = 1 + 1 + 0 = 2$$`,
      trap: String.raw`The number / a number is the most rigged pair in GA grammar: *the* refers to the statistic (singular), *a* to the people (plural). Agreement follows the head noun, never the closer word.`,
      verify: { value: 2, expr: '(1+1+0)', tol: 0, unit: 'verbs' } },

    { id:'A10-E6', exam:'BOTH', anchor:'GATE-1', covers:['reading-comprehension'],
      difficulty:'standard',
      stem: String.raw`**Strict inference.** Passage: "Plants bend toward light because the hormone auxin gathers on the shaded side and lengthens those cells. Gardeners rotate pots so no side stays shaded." How many of these four statements must be true if the passage is: (i) Auxin lengthens lit-side cells. (ii) Auxin lengthens shaded-side cells. (iii) Rotation evens out auxin distribution. (iv) Auxin is a fertilizer.`,
      solution: String.raw`(i) contradicts (shaded, not lit) ✗. (ii) is the passage's claim ✓. (iii) follows — rotation prevents any side staying shaded, so auxin never pools ✓. (iv) passage never says fertilizer ✗.
$$\text{supported} = 0 + 1 + 1 + 0 = 2$$`,
      trap: String.raw`(i) flips one word (lit ↔ shaded) and harvests skim-readers; (iv) imports outside "plant + chemical = fertilizer" common sense. The passage is the whole universe — nothing enters from real life.`,
      verify: { value: 2, expr: '(0+1+1+0)', tol: 0, unit: 'statements' } },

    { id:'A10-E7', exam:'GATE', anchor:'GATE-1', covers:['narrative-sequencing'],
      difficulty:'standard',
      stem: String.raw`**Para-jumble.** P: "Finally, he signed the contract." · Q: "After weeks of negotiation, the two firms agreed in principle." · R: "But the lawyers then spent days drafting the actual text." · S: "Both CEOs announced the deal at a press meet." In the correct narrative order, which **position** does sentence P occupy?`,
      solution: String.raw`Glue the chain: Q opens ("agreed in principle", no backward pronoun) → R follows ("but the lawyers *then*" contrasts with agreement) → P ("*Finally*, he signed") resolves the draft → S closes with the announcement...
$$\text{order } Q \to R \to P \to S \;\Rightarrow\; P \text{ is in position } 3$$`,
      trap: String.raw`Letting the announcement (S) precede the signing — press meets announce *signed* deals, so S must outrank P. Time-markers ("after", "then", "finally") outrank intuition when re-ordering.`,
      verify: { value: 3, expr: '(3)', tol: 0, unit: 'position' } },

    { id:'A10-E8', exam:'BOTH', anchor:'GATE-1', covers:['parts-of-speech'],
      difficulty:'standard',
      stem: String.raw`**Adjective census.** In the sentence "The tall, lazy cat chased a frightened mouse into the small hole", how many words are functioning as adjectives?`,
      solution: String.raw`Slot-test each candidate: *tall* (before noun "cat") ✓ · *lazy* ✓ · *frightened* (before "mouse") ✓ · *small* (before "hole") ✓.
$$\text{adjectives} = 1 + 1 + 1 + 1 = 4$$
("The/a" are articles-determiners, not adjectives, in modern GA grammar.)`,
      trap: String.raw`Counting "chased" (verb of the clause) because past participles *look* adjectival — function decides: *chased* carries the tense here, *frightened* merely describes the noun.`,
      verify: { value: 4, expr: '(1+1+1+1)', tol: 0, unit: 'adjectives' } },

    { id:'A10-E9', exam:'GATE', anchor:'GATE-1', covers:['grammar-tenses-articles','grammar-agreement','grammar-prepositions-conjunctions','parts-of-speech'],
      difficulty:'apex',
      stem: String.raw`**Error hunt.** "An university team, along with its coaches, were felicitated on Monday at a grand function." How many grammatical errors does the sentence contain?`,
      solution: String.raw`(1) "An university" → **a** university (/ju/ sound). (2) "along with its coaches" is an interrupter — head subject *team* is singular → **was**, not *were*. "on Monday" ✓ · "at a grand function" ✓.
$$\text{errors} = 1 + 1 = 2$$`,
      trap: String.raw`Fixing only the visible article and missing the agreement interrupter (or "correcting" the right parts to new wrong ones, e.g. changing "on Monday" to "in Monday") — error-hunt scoring counts *all* faults, so audit every slot: article → verb number → prepositions.`,
      verify: { value: 2, expr: '(1+1)', tol: 0, unit: 'errors' } },

    { id:'A10-E10', exam:'BOTH', anchor:'GATE-1', covers:['vocabulary-idioms-phrases'],
      difficulty:'apex',
      stem: String.raw`**Idiom match.** Four idioms, four candidate meanings: (a) spill the beans — reveal a secret · (b) once in a blue moon — very rarely · (c) a blessing in disguise — an obvious curse · (d) hit the nail on the head — speak/act exactly right. How many pairs are matched correctly?`,
      solution: String.raw`(a) ✓ exact · (b) ✓ exact · (c) ✗ a blessing in disguise is a *hidden* good, the opposite of an obvious curse · (d) ✓ exact.
$$\text{correct pairs} = 1 + 1 + 0 + 1 = 3$$`,
      trap: String.raw`Partial-literal bait: "blessing" sounds positive either way, so a flipped second half ("obvious curse") slips past unless the whole idiom is checked word-by-word against the frozen meaning. Idioms resist decomposition.`,
      verify: { value: 3, expr: '(1+1+0+1)', tol: 0, unit: 'pairs' } },
  ],

  speedSheet: String.raw`## ⚡ A10 SPEED SHEET — 60 seconds before the paper

**Articles:** sound not spelling — *an* MBA but *a* university · no article for general abstracts.
**Tenses:** earlier past = had + V₃ · since + perfect (never finished-time) · present continuous = fixed future.
**Agreement:** strip to head subject · neither/either of + plural noun → singular · THE number = singular, A number = plural.
**Prepositions:** at-clock · on-day · in-month · since+point, for+duration · collocations owned (good at, depend on).
**POS:** function over form · adjective before noun / after is-seem · adverbs can modify adjectives.
**RC:** passage is the whole universe · scope-words (all/some) are the planted swap.
**Sequencing:** pronoun sentence ≠ opener · chain time-markers · kill options that break one pair.
**Idioms:** frozen meanings, no decomposition · verify all four pairs.`
};

/* ======================================================= module A11 (C4) */
const MODULE_A11 = {
  id: 'A11',
  title: 'Everyday General Science',
  file: '🧠 A11 · Everyday General Science.md',
  anchors: ['CSIR-8'],
  anchorAtoms: {
    'CSIR-8': ['everyday-phenomena','units-measurement','scientific-reasoning']
  },
  register: 'formula-first + trap callouts',
  figureStyle: 'dark (matches content section)',
  stage: 'C4 verbal + science + craft',

  cards: [
    { id:'A11-C1', covers:['units-measurement'], head: 'SI Units: The Seven-Unit Spine',
      md: String.raw`All measurement questions bolt onto seven SI base units: **metre** (length) · **kilogram** (mass — the only base unit carrying a prefix) · **second** (time) · **ampere** (current) · **kelvin** (temperature) · **mole** (amount) · **candela** (luminous intensity). Derived stars: force = newton ($kg\,m\,s^{-2}$), energy = joule ($N \cdot m$), power = watt ($J\,s^{-1}$).

The exam's play is always *unit mismatch*: values quoted in grams-centimetres mixing with SI. **Convert first, calculate second** — a number whose units don't simplify to the expected final unit is wrong no matter how clean the arithmetic looks.` },
    { id:'A11-C2', covers:['units-measurement'], head: 'Temperature: Three Scales, Two Bridges',
      md: String.raw`$$F = \frac{9}{5}C + 32 \qquad K = C + 273.15$$

Two anchors make conversions instant: $0^\circ C = 32^\circ F = 273.15\,K$ (water freezes) and $100^\circ C = 212^\circ F$ (water boils). Daily-life reflex: $37^\circ C$ body temperature $= 98.6^\circ F$. The trap that recurs every cycle: °C differences vs °C absolute — a rise of 10°C is a rise of 18°F, but 10°C absolute is 50°F. Difference conversions skip the +32.` },
    { id:'A11-C3', covers:['everyday-phenomena'], head: 'Heat Landmarks in Daily Life',
      md: String.raw`The four everyday-heat facts CSIR repeats:

1. **Pressure cooker** — raising pressure raises water's boiling point, so food cooks faster (hotter steam, not "more heat").
2. **Perspiration cools** — evaporation takes latent heat from the skin.
3. **Sea breeze** — land heats faster than water by day; warm air rises over land, cooler sea air rushes in (reverses at night).
4. **Hot water freezes-pipes burst** — water is densest at $4^\circ C$; ice is less dense and expands, bursting pipes and floating on lakes (life survives under ice).` },
    { id:'A11-C4', covers:['everyday-phenomena'], head: 'Sound, Light & the Kitchen-Lab Anthology',
      md: String.raw`The everyday optics/acoustics shelf: **sky is blue** — air molecules scatter short (blue) wavelengths ~6× more than red (why sunsets redden: blue scattered out of the direct beam). **Straw works by air pressure** — you reduce pressure inside; the atmosphere pushes the drink up, not you pulling. **Lightning seen before thunder** — light arrives ~instantly, sound at ~340 m/s; every 3 s of delay ≈ 1 km of distance. **Echo needs distance** — the ear resolves two sounds only ~0.1 s apart, so a clean echo needs ≥ ~17 m of wall distance.` },
    { id:'A11-C5', covers:['units-measurement','everyday-phenomena'], head: 'Electricity at Home',
      md: String.raw`$$\text{energy} = \text{power} \times \text{time} \qquad 1 \text{ kWh} = 1 \text{ unit} = 3.6 \times 10^6 \text{ J}$$

A 100 W bulb for 10 hours = 1 kWh = "1 unit" on the bill — the kWh→J bridge is the standing measurement item. Safety trio: fuses carry current in **series** (they must melt first); earthing protects by offering a low-resistance path; and the human-current scale is milliampere-dangerous — 230 V hurts because of the current it drives through body resistance, not the number 230 alone.` },
    { id:'A11-C6', covers:['scientific-reasoning'], head: 'The Scientific Method in Five Moves',
      md: String.raw`GA's "scientific reasoning" items test the *process*, not trivia:

1. **Observation** — a pattern noticed.
2. **Hypothesis** — a testable, falsifiable explanation (a claim that *could* be wrong is the entry ticket).
3. **Prediction** — "if the hypothesis holds, then X must happen".
4. **Controlled experiment** — change **one** variable, hold the rest; the un-changed ones are controls.
5. **Conclusion** — support or falsify; one counter-example outweighs a thousand agreeing cases.

The named fallacies to recognize: *correlation ≠ causation*; and a non-falsifiable claim ("it works because it works") isn't science, however true it feels.` },
    { id:'A11-C7', covers:['everyday-phenomena'], head: 'Measurement Instruments Around You',
      md: String.raw`Everyday instruments map to the quantities they measure, and GA asks exactly those pairings: **barometer** → atmospheric pressure (a falling barometer predicts rain — low pressure draws moisture-bearing winds) · **thermometer** → temperature · **hygrometer** → humidity · **anemometer** → wind speed · **odometer** → distance travelled · **voltmeter/ammeter** → potential difference / current.

Method questions also hide here: a clinical thermometer's constriction holds the mercury up after removal (so it can be read at leisure — and must be shaken down); a measuring cylinder reads at the bottom of the meniscus (water concaves) but the top of mercury's (it convexes); and every instrument's reading begins with its **least count** — the smallest division it can honestly report, the everyday face of measurement error.` },
  ],

  formulas: [
    { name:'C → F',                tex: String.raw`F = \dfrac{9}{5}C + 32` },
    { name:'C → K',                tex: String.raw`K = C + 273.15` },
    { name:'Echo distance',        tex: String.raw`d = \dfrac{v_{snd}\, t}{2}` },
    { name:'Thunder gap',          tex: String.raw`\text{3 s delay} \approx \text{1 km}` },
    { name:'Power & energy',       tex: String.raw`E = P\,t` },
    { name:'kWh to joules',        tex: String.raw`1 \text{ kWh} = 3.6 \times 10^6 \text{ J}` },
    { name:'Density',              tex: String.raw`\rho = \dfrac{m}{V}` },
    { name:'Controlled experiment', tex: String.raw`\text{variables changed} = 1 \ (\text{rest controlled})` },
  ],

  examples: [
    { id:'A11-E1', exam:'BOTH', anchor:'CSIR-8', covers:['units-measurement'],
      difficulty:'seed',
      stem: String.raw`**Base-unit census.** Of the seven SI base units, exactly one carries a metric prefix in its own name. How many of these are SI base units: metre, gram, second, newton, mole, kelvin, ampere?`,
      solution: String.raw`Base units in the list: metre ✓ · **gram ✗ (the base unit is the kilogram)** · second ✓ · newton ✗ (derived, $kg\,m\,s^{-2}$) · mole ✓ · kelvin ✓ · ampere ✓.
$$\text{base units} = 1 + 0 + 1 + 0 + 1 + 1 + 1 = 5$$

(The prefix-carrying base unit — the question's opening clue — is the kilogram itself.)`,
      trap: String.raw`Counting "gram" as base because it feels elementary — the SI mass base is the **kilogram**, the only base unit born with a prefix. Newton is the second decoy: famous but derived.`,
      verify: { value: 5, expr: '(1+0+1+0+1+1+1)', tol: 0, unit: 'units' } },

    { id:'A11-E2', exam:'CSIR', anchor:'CSIR-8', covers:['units-measurement'],
      difficulty:'seed',
      stem: String.raw`**Temperature bridge.** Normal human body temperature is $37^\circ C$. Express it in Fahrenheit.`,
      solution: String.raw`$$F = \frac{9}{5}(37) + 32 = 66.6 + 32 = 98.6^\circ F$$`,
      trap: String.raw`Applying the bridge as "differences" ($\tfrac{9}{5} \times 37 = 66.6$ and stopping) — absolute °C→°F needs the +32 offset. Offsets vanish only when converting *differences*, not readings.`,
      verify: { value: 98.6, expr: '(37*(9/5))+32', tol: 0.001, unit: '°F' } },

    { id:'A11-E3', exam:'CSIR', anchor:'CSIR-8', covers:['everyday-phenomena','units-measurement'],
      difficulty:'standard',
      stem: String.raw`**Echo distance.** A student shouts toward a distant wall and hears the echo exactly 2.0 s later. Taking the speed of sound as 340 m/s, how far is the wall?`,
      solution: String.raw`The 2.0 s covers the round trip — there and back:
$$d = \frac{v\,t}{2} = \frac{340 \times 2.0}{2} = 340 \text{ m}$$`,
      trap: String.raw`Reporting $680$ m prices the **round trip** as one-way. Echo stems always halve: the sound spends half the time coming home.`,
      verify: { value: 340, expr: '(340*2)/2', tol: 0.001, unit: 'm' } },

    { id:'A11-E4', exam:'BOTH', anchor:'CSIR-8', covers:['everyday-phenomena'],
      difficulty:'standard',
      stem: String.raw`**Everyday mechanism.** A pressure cooker cooks food faster than an open pot mainly because: (A) the lid reduces heat loss · (B) high pressure raises the boiling point of water · (C) steam transfers more latent heat than flame · (D) metal conducts heat better when sealed. How many of these give the *primary physical reason*?`,
      solution: String.raw`Physics: at the cooker's ~2 atm, water boils at ~120°C instead of 100°C — the hotter cooking medium speeds the chemistry of cooking. (A), (C), (D) may be true-ish side effects, but only (B) is the primary mechanism.
$$\text{primary reasons} = 0 + 1 + 0 + 0 = 1$$`,
      trap: String.raw`"Conserves heat" (A) is the seductive near-truth — every closed vessel does that slightly, but only the pressure-boiling-point link explains *faster* cooking. Match the mechanism to the effect asked.`,
      verify: { value: 1, expr: '(0+1+0+0)', tol: 0, unit: 'reasons' } },

    { id:'A11-E5', exam:'BOTH', anchor:'CSIR-8', covers:['units-measurement','everyday-phenomena'],
      difficulty:'standard',
      stem: String.raw`**The electricity bill.** A 2000 W room heater runs for 4 hours a day. How many "units" (kWh) does it consume in 30 days?`,
      solution: String.raw`$$E = P \times t = 2 \text{ kW} \times (4 \times 30) \text{ h} = 2 \times 120 = 240 \text{ kWh} = 240 \text{ units}$$
*(= $240 \times 3.6 \times 10^6 = 8.64 \times 10^8$ J if the SI figure is asked.)*`,
      trap: String.raw`Multiplying 2000 (watts) directly by hours and then reading the answer as kWh — the kW conversion must happen *before* (or be divided out after). A 240,000 "unit" bill is the misplaced-decimal signature.`,
      verify: { value: 240, expr: '(2000/1000)*4*30', tol: 0.001, unit: 'kWh' } },

    { id:'A11-E6', exam:'CSIR', anchor:'CSIR-8', covers:['scientific-reasoning'],
      difficulty:'apex',
      stem: String.raw`**Controlled experiment.** A student claims a fertilizer boosts plant growth and sets up four pots: (P1) fertilizer + daily watering, (P2) fertilizer + weekly watering, (P3) no fertilizer + daily watering, (P4) fertilizer + double sunlight. To fairly test the fertilizer's effect, how many of P2–P4 are valid controls for comparing against P1?`,
      solution: String.raw`A valid control changes **exactly one** variable — here, fertilizer alone:
* P2: changes **watering** too ✗
* P3: identical except fertilizer ✓
* P4: changes **sunlight** too ✗
$$\text{valid controls} = 0 + 1 + 0 = 1$$`,
      trap: String.raw`Accepting any pot that differs from P1 as "a control" — a control that changes two variables can never isolate the fertilizer's effect; if P4 outgrows P1, sunlight gets the credit and the conclusion is dead on arrival.`,
      verify: { value: 1, expr: '(0+1+0)', tol: 0, unit: 'controls' } },
  ],

  speedSheet: String.raw`## ⚡ A11 SPEED SHEET — 60 seconds before the paper

**SI spine:** m, kg, s, A, K, mol, cd — mass base is the *kilogram* (prefix included); newton is derived.
**Temperature:** $F = \tfrac{9}{5}C + 32$ · body $37^\circ C = 98.6^\circ F$ · differences skip the +32.
**Echo:** $d = vt/2$ — round trip halves · thunder gap: 3 s ≈ 1 km.
**Everyday heat:** pressure cooker → higher boiling point · sweat cools by evaporation · sea breeze by day · water densest at 4°C.
**Home electricity:** $E = Pt$ · 1 kWh = 1 unit = $3.6 \times 10^6$ J · fuse in series.
**Scientific method:** hypothesis must be falsifiable · change ONE variable · correlation ≠ causation.`
};

/* ======================================================= module A12 (C4) */
const MODULE_A12 = {
  id: 'A12',
  title: 'Exam Craft',
  file: '🧠 A12 · Exam Craft.md',
  anchors: ['CRAFT'],
  anchorAtoms: {
    'CRAFT': ['option-elimination','backsolving-estimation','guessing-ev','time-allocation']
  },
  register: 'rule-first + trap callouts',
  figureStyle: 'dark (matches content section)',
  stage: 'C4 verbal + science + craft',

  cards: [
    { id:'A12-C1', covers:['option-elimination'], head: 'The Option-Elimination Protocol',
      md: String.raw`A 4-option MCQ is really four true/false questions wearing a trench coat. Read the stem, then **audit each option in writing order** — kill before you solve. The kill hierarchy, cheapest first:

1. **Dimensional/units veto** — answer demands cm², option claims cm → dead.
2. **Sign & direction veto** — a probability > 1, a negative count, a negative efficiency → dead.
3. **Magnitude bracket** — rough numbers (A1-C8) knock out options 10× off.
4. **Structure veto** — an MCQ stem saying "A and B" where option 3 contains "A but not B" → dead without arithmetic.

Two kills turn a 25% blind guess into a 50% shot — and A12-C3 shows that shot is worth +0.5 marks of expected value in CSIR, every single time.` },
    { id:'A12-C2', covers:['backsolving-estimation'], head: 'Back-Solve: Let the Options Do the Work',
      md: String.raw`When the stem asks "find x" and the options list four candidate values, the exam has handed you 4 free test subjects. Substitute the options into the stem's conditions instead of deriving x from scratch — **start from the middle option**; if it overshoots, skip to the smaller one (values are usually ordered).

Back-solving cuts hardest on: equations ("which x satisfies 3x + 7 = 25"), divisibility stems, age problems, and DI statement-verification. It is also the *verification* layer for a derived answer: once you solve forward to x = 6, the 10-second plug-back to confirm $3(6) + 7 = 25$ is the cheapest mark-insurance in the paper.` },
    { id:'A12-C3', covers:['guessing-ev'], head: 'The Expected-Value Ledger of Guessing',
      md: String.raw`With $n$ options, probability $p$ of being right, mark $M$, and penalty $d$ per wrong:

$$EV = pM - (1-p)d$$

**GATE GA (4 options):** blind guess at $p = \tfrac14$: $EV = \tfrac14 M - \tfrac34 \cdot \tfrac{M}{3} = 0$ (penalty is exactly calibrated). Penalty drops to *zero* for MSQ/NAT — **never leave a GATE NAT unattempted.** One elimination at 1-mark makes EV positive: $EV = \tfrac13(1) - \tfrac23 \cdot \tfrac13 = +\tfrac19$.

**CSIR Part A (4 options, −0.5, M = 2):** blind: $EV = \tfrac14(2) - \tfrac34(0.5) = +0.125 > 0$. **Always answer all of Part A** — even blind guesses pay rent. One elimination: $EV = \tfrac13(2) - \tfrac23(0.5) = +\tfrac13$.

**No negative anywhere? Attempt everything. No exceptions.**` },
    { id:'A12-C4', covers:['time-allocation'], head: 'The Time-Ledger',
      md: String.raw`Budget in *marks per minute*, not feelings: GATE GA = 15 of 100 marks in 180 min ≈ expected 27 min for the full GA section; CSIR Part A = 30 of 200 in 180 min → the section deserves ~27–30 min by the same proportion, but are *discounted-risk* marks (easier, and −0.5 is small) → many toppers take Part A **first** as a warm-up.

The three-pass method: **Pass 1** — sweep the paper solving only what reads as ≤2-minute work, flagging everything longer. **Pass 2** — the flagged fights, longest-EV first. **Pass 3** — scoring sweep: verify negatives, fill **every** CSIR Part A gap and every GATE NAT gap with the best available answer. Never leave ≥5 unanswered minutes; an unanswered question has EV exactly 0, which is the worst number on the ledger.` },
    { id:'A12-C5', covers:['backsolving-estimation'], head: 'Estimation as Armour',
      md: String.raw`Every answer passes through **three eliminative gates** before it is believed:

1. **Decimal veto** — count the expected digits; a 3-digit answer from a 2-digit computation means a factor-of-100 slip.
2. **Parity/self-consistency** — averages must lie between the data's min and max; areas must be positive; discount prices must be less than the marked price.
3. **Cross-method** — DI table arithmetic: add column-wise too and compare (the total row must agree both ways).

Each gate is 5 seconds; the cumulative marks saved by a habitual last gate before bubbling far exceed the time cost of the check.` },
    { id:'A12-C6', covers:['option-elimination','time-allocation'], head: 'The Craft Trap Anthology',
      md: String.raw`The six recurring self-inflicted wounds:

1. **Blank-phobia blindness** — guessing GATE GA 4-option MCQs blind (EV = 0) when two more minutes of elimination work would make it positive.  \n2. **NAT blank** — leaving a GATE NAT empty costs marks with **zero** downside protection.  \n3. **Sunk-cost fights** — a 5-minute battle with a 2-marker while six 2-markers wait unread.  \n4. **"I know this" rush** — deriving from memory and skipping the option-elimination read that would've killed the planted lookalike.  \n5. **Range violation** — bubbling an answer outside the data's bracket because no sanity gate ran.  \n6. **Bubbling last-minute mass-changes** — changing three answers in the final 60 seconds without re-reading any of them; changed answers need the *fresh-eye* test or stay.` },
  ],

  formulas: [
    { name:'Guess EV (general)',        tex: String.raw`EV = pM - (1-p)\,d` },
    { name:'Gate GA blind MCQ',         tex: String.raw`EV = \tfrac{1}{4}M - \tfrac{3}{4}\cdot\tfrac{M}{3} = 0` },
    { name:'Gate 1-elimination',        tex: String.raw`EV = \tfrac{1}{3}(1) - \tfrac{2}{3}\cdot\tfrac{1}{3} = +\tfrac{1}{9}` },
    { name:'CSIR blind guess',          tex: String.raw`EV = \tfrac{1}{4}(2) - \tfrac{3}{4}(0.5) = +0.125` },
    { name:'CSIR 1-elimination',        tex: String.raw`EV = \tfrac{1}{3}(2) - \tfrac{2}{3}(0.5) = +\tfrac{1}{3}` },
    { name:'Time-per-mark budget',      tex: String.raw`t_{\text{section}} = \dfrac{\text{marks}_{\text{section}}}{\text{marks}_{\text{total}}} \times T` },
    { name:'Elimination power',         tex: String.raw`k \text{ kills} \Rightarrow p = \dfrac{1}{4-k}` },
    { name:'Answer vetoes',             tex: String.raw`\text{dim} \;\vee\; \text{sign} \;\vee\; \text{bracket} \;\vee\; \text{structure}` },
  ],

  examples: [
    { id:'A12-E1', exam:'CSIR', anchor:'CRAFT', covers:['guessing-ev'],
      difficulty:'seed',
      stem: String.raw`**Blind-guess ledger.** In CSIR Part A (4 options, +2 marks, −0.5 wrong), a candidate answers all 15 with pure blind guesses. What is the expected value **per question**?`,
      solution: String.raw`$$EV = \frac14(2) - \frac34(0.5) = 0.5 - 0.375 = +0.125 \text{ marks}$$
Over 15 blind questions: $15 \times 0.125 = 1.875$ expected marks — better than the 0 that blanks guarantee.`,
      trap: String.raw`Psychology fights the math here: the *fear* of −0.5 makes blank feel "safe", but blank is EV = 0 and blind is EV = +0.125. In CSIR, **every unanswered Part A question is a slow leak of free marks.**`,
      verify: { value: 0.125, expr: '(0.25*2)-(0.75*0.5)', tol: 0.001, unit: 'marks' } },

    { id:'A12-E2', exam:'GATE', anchor:'CRAFT', covers:['guessing-ev'],
      difficulty:'seed',
      stem: String.raw`**GATE calibration.** For a GATE GA 1-mark MCQ (4 options, −1/3 penalty), what is the expected value of a completely blind guess?`,
      solution: String.raw`$$EV = \frac14(1) - \frac34 \times \frac{1}{3} = \frac14 - \frac14 = 0$$`,
      trap: String.raw`This is exactly calibrated: GATE set the penalty to make blind EV = 0. Blind, you can only *break even* — the plays that pay are elimination (EV > 0) and the penalty-free NAT/MSQ types.`,
      verify: { value: 0, expr: '(0.25*1)-(0.75*(1/3))', tol: 0.001, unit: 'marks' } },

    { id:'A12-E3', exam:'CSIR', anchor:'CRAFT', covers:['option-elimination','guessing-ev'],
      difficulty:'standard',
      stem: String.raw`**One kill changes everything.** In a CSIR Part A question, a student eliminates one option confidently and guesses among the remaining three. What is the expected value per such question?`,
      solution: String.raw`$$EV = \frac13(2) - \frac23(0.5) = \frac{2}{3} - \frac{1}{3} = +\frac{1}{3} \approx 0.333 \text{ marks}$$`,
      trap: String.raw`Students treat elimination work as "wasted if I can't fully solve" — but each kill converts +0.125 EV into +0.333 EV. A single good elimination nearly triples the yield per guess.`,
      verify: { value: 0.3333, expr: '((1/3)*2)-((2/3)*0.5)', tol: 0.001, unit: 'marks' } },

    { id:'A12-E4', exam:'BOTH', anchor:'CRAFT', covers:['backsolving-estimation'],
      difficulty:'standard',
      stem: String.raw`**Back-solve instead of solve.** Which value of $x$ satisfies $3x + 7 = 25$? Options: (A) 4 · (B) 6 · (C) 8 · (D) 10. Verify forward after picking.`,
      solution: String.raw`Back-solve from the middle: (B) $3(6) + 7 = 18 + 7 = 25$ ✓ — done in one substitution.
$$\text{chosen option} = \text{(B)},\quad x = 6$$
Forward check: $x = \frac{25 - 7}{3} = \frac{18}{3} = 6$ agrees.`,
      trap: String.raw`Substitution order matters: starting at (A) costs up to three trials; starting middle (B or C) costs at most two. The options aren't just the answer — they're free lab equipment.`,
      verify: { value: 6, expr: '(25-7)/3', tol: 0.001, unit: '' } },

    { id:'A12-E5', exam:'GATE', anchor:'CRAFT', covers:['option-elimination','backsolving-estimation'],
      difficulty:'standard',
      stem: String.raw`**Bracket the answer.** Estimate $\dfrac{408 \times 0.49}{19.6}$: (A) 0.1 · (B) 1 · (C) 10 · (D) 100. Which option survives the order-of-magnitude veto?`,
      solution: String.raw`Anchors: $408 \to 400$, $0.49 \to 0.5$, $19.6 \to 20$:
$$\frac{400 \times 0.5}{20} = \frac{200}{20} = 10$$
Only **(C) 10** survives; the neighbouring options are 10× off on each side.`,
      trap: String.raw`The design of the options (0.1 / 1 / 10 / 100) tells you this is a **decimal-place** question, not an arithmetic one — exact computation ($10.2$) is a luxury the clock rarely funds.`,
      verify: { value: 10, expr: '(400*0.5)/20', tol: 0.001, unit: '' } },

    { id:'A12-E6', exam:'GATE', anchor:'CRAFT', covers:['time-allocation'],
      difficulty:'apex',
      stem: String.raw`**Three-pass audit.** A GATE candidate budgets section time proportionally: GA is 15 of 100 marks in 180 min. Of the budgeted GA time, the three-pass method spends pass 1 (70%), pass 2 (25%), pass 3 (5%). How many minutes should pass 1 (the quick-solve sweep) get if the full GA budget is spent?`,
      solution: String.raw`$$t_{\text{GA}} = \frac{15}{100} \times 180 = 27 \text{ min}$$
$$t_{\text{pass 1}} = 0.70 \times 27 = 18.9 \text{ min} \ (\approx 19)$$`,
      trap: String.raw`Skipping the discipline when "the going is good" — candidates routinely give a hard 2-marker 8 minutes inside pass 1, quietly bankrupting the whole budget. The pass-1 rule is a hard ceiling: ≤2 minutes per item, flag everything longer.`,
      verify: { value: 18.9, expr: '(15/100)*180*0.70', tol: 0.001, unit: 'min' } },
  ],

  speedSheet: String.raw`## ⚡ A12 SPEED SHEET — 60 seconds before the paper

**Kill hierarchy:** units → sign → magnitude bracket → structure. Kill first, solve second.
**Back-solve** from the middle option; plug back to verify every derived answer.
**EV:** GATE 4-option blind = 0 (calibrated) · **CSIR blind = +0.125 → answer ALL of Part A** · GATE NAT/MSQ: no penalty, never blank.
**One elimination** lifts CSIR guess EV to +1/3 — elimination work always pays.
**Time-ledger:** marks-proportional budget · 3-pass (70/25/5) · pass-1 ceiling 2 min per item.
**Last gates before bubbling:** decimal count · parity/range · column-total cross-check.
**Zero-EV moves:** blank where blind pays · sunk-cost fights · unfounded last-second changes.`
};

/* ------------------------------------------- markdown renderer --------- */
function renderModule(m){
  const L = [];
  L.push('# 🧠 APTITUDE · ' + m.id + ': ' + m.title.toUpperCase());
  L.push('');
  L.push('> forge: APTIFORGE ' + (m.stage || 'C1 pilot') + ' · anchors: ' + m.anchors.join(' + ') + ' · register: ' + m.register);
  L.push('');
  L.push('---');
  L.push('');
  L.push('# PART 1 · CONCEPT CARDS');
  m.cards.forEach(c=>{ L.push(''); L.push('## ' + c.id + ' — ' + c.head); L.push(''); L.push(c.md); });
  L.push(''); L.push('---'); L.push('');
  L.push('# PART 2 · FORMULA SHEET');
  L.push('');
  L.push('*Every usable identity, machine-verified — lean on these, derive nothing twice.*');
  m.formulas.forEach(function(f,i){ L.push((i+1) + '. **' + f.name + ':** $' + f.tex + '$'); });
  L.push(''); L.push('---'); L.push('');
  L.push('# PART 3 · WORKED EXAMPLES (seed → standard → apex)');
  m.examples.forEach(e=>{
    L.push('');
    L.push('## ' + e.id + ' · ' + e.exam + ' · ' + e.difficulty.toUpperCase());
    L.push('*anchor: ' + e.anchor + ' · covers: ' + e.covers.join(', ') + '*');
    L.push('');
    L.push(e.stem);
    L.push('');
    L.push('**Solution.** ' + e.solution);
    L.push('');
    L.push('> 🩸 **WHERE STUDENTS BLEED:** ' + e.trap);
  });
  L.push(''); L.push('---'); L.push('');
  L.push(m.speedSheet);
  L.push('');
  return L.join('\n');
}

/* ------------------------------------------------------------ registration */
const MODULES = [MODULE_A1, MODULE_A2, MODULE_A3, MODULE_A4, MODULE_A5, MODULE_A6,
                 MODULE_A7, MODULE_A8, MODULE_A9, MODULE_A10, MODULE_A11, MODULE_A12];
const DATA = {};
MODULES.forEach(function(m){ DATA[m.file] = renderModule(m); });

/* SELF-MOUNT (C5): the Content Vault reads only window.LOCAL_CONTENT_DATA and
   falls back to the filename for labels, so merging here is enough — the 12 🧠
   aptitude docs appear in the vault subject list with zero base-code rewrites.
   Loading order is guaranteed by the tracker's script-tag sequence
   (content-data.js → aptitude-content.js → vault builder script). */
window.LOCAL_CONTENT_DATA = Object.assign(window.LOCAL_CONTENT_DATA || {}, DATA);

window.APTITUDE_CONTENT_DATA = DATA;
window.APTITUDE_CONTENT_META = {
  version: 'C4',
  anchorsOfficial: ANCHORS,
  umbrellaAtoms: UMBRELLA_ATOMS,
  modules: MODULES.map(function(m){ return {
    id: m.id, title: m.title, file: m.file, anchors: m.anchors, anchorAtoms: m.anchorAtoms, stage: m.stage,
    cards: m.cards.map(function(c){ return {id:c.id, covers:c.covers}; }),
    formulaCount: m.formulas.length,
    examples: m.examples.map(function(e){ return {id:e.id, exam:e.exam, anchor:e.anchor, covers:e.covers, difficulty:e.difficulty, verify:e.verify}; })
  }; })
};
})();
