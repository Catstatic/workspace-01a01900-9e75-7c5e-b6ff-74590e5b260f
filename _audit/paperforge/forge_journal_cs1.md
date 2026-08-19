# PAPERFORGE — FORGE JOURNAL · LEGION CS-I (S5 · CSIR-NET pattern)

**Bank:** `paperforge-bank-cs1.js` · 75 original questions · max score **200** (capped by official attempt limits) · duration 3 h 00 m
**Composition:** 75 single-correct MCQ · Part A 20 (attempt ≤15, +2/−0.5) · Part B 25 (attempt ≤20, +3.5/−0.875) · Part C 30 (attempt ≤20, +5/−1.25) · lanes: aptitude 20 + 8 physics lanes
**Minted:** 2026-08-18 · **Status:** SEALED ✅

## The double-solve law (PAPERFORGE Four Laws, law 3)

Every question was solved **twice, independently**:

1. **AUTHOR-SOLVE** — the worked solution embedded in the bank (`sol` field),
   written at authoring time, rendered in the vault review.
2. **AUDIT-SOLVE** — performed after authoring, without re-reading the author's
   derivation, in one of two tiers:
   * **T1** — every *number* that appears in a key was recomputed from first
     principles by `audit_legion1.py` (independent formulas/constants).
     Result this mint: **120/120 — PASSED (43 independent numeric recomputations matching keyed option faces + 77 scheme assertions mirroring SIM_LIMITS exactly)**.
   * **T2** — symbolic/conceptual items re-derived on paper **and** machine-
     swept for key well-formedness (MCQ key in range, no duplicate options,
     MSQ key non-empty + sorted, NAT key numeric or `lo to hi` window,
     solution present and clean). Result this mint: **60/60 — PASSED** by
     `gen_forge_journal.py` (this generator; the run that produced this file).

Cross-battery status at seal time: `replay_pf.js` 60 Q green ·
`kcheck_pf.js` 599 KaTeX-strict segments, 0 failures · `pf_fig_gates.py` 170/170 ·
`smoke39_paperforge_cs1.js` 34/34 (triple-bank vault + CSIR caps end-to-end vs real tracker boot).

## Per-question ledger

| id | lane · subtopic | type | marks | diff | key | audit-solve trail |
|----|-----------------|------|-------|------|-----|-------------------|
| PF-CS-A01 | aptitude · number-series | MCQ | 2M | seed | A | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-A02 | aptitude · averages | MCQ | 2M | seed | B | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-A03 | aptitude · speed-distance | MCQ | 2M | seed | C | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-A04 | aptitude · profit-loss | MCQ | 2M | standard | A | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-A05 | aptitude · probability | MCQ | 2M | standard | B | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-A06 | aptitude · coding | MCQ | 2M | seed | C | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CS-A07 | aptitude · permutations | MCQ | 2M | standard | D | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-A08 | aptitude · geometry | MCQ | 2M | standard | A | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CS-A09 | aptitude · clocks | MCQ | 2M | standard | B | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-A10 | aptitude · series | MCQ | 2M | seed | C | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-A11 | aptitude · boats-streams | MCQ | 2M | standard | D | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-A12 | aptitude · percentage | MCQ | 2M | standard | A | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-A13 | aptitude · probability | MCQ | 2M | standard | B | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CS-A14 | aptitude · syllogism | MCQ | 2M | standard | C | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CS-A15 | aptitude · data-interpretation | MCQ | 2M | standard | D | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-A16 | aptitude · ages | MCQ | 2M | standard | A | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-A17 | aptitude · work-time | MCQ | 2M | standard | B | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-A18 | aptitude · number-series | MCQ | 2M | apex | C | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-A19 | aptitude · series | MCQ | 2M | standard | D | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-A20 | aptitude · cubes | MCQ | 2M | apex | A | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-B01 | mathphys · vector-calculus | MCQ | 3.5M | seed | B | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CS-B02 | mathphys · linear-algebra | MCQ | 3.5M | standard | C | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CS-B03 | mathphys · fourier-series | MCQ | 3.5M | apex | D | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CS-B04 | classical · torque | MCQ | 3.5M | standard | A | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-B05 | classical · gravitation | MCQ | 3.5M | standard | B | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CS-B06 | classical · atwood | MCQ | 3.5M | standard | C | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CS-B07 | emtheory · electrostatics | MCQ | 3.5M | seed | D | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CS-B08 | emtheory · capacitance | MCQ | 3.5M | standard | A | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CS-B09 | emtheory · magnetostatics | MCQ | 3.5M | standard | B | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-B10 | emtheory · em-waves | MCQ | 3.5M | seed | C | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CS-B11 | quantum · photons | MCQ | 3.5M | standard | D | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-B12 | quantum · square-well | MCQ | 3.5M | standard | A | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CS-B13 | quantum · formalism | MCQ | 3.5M | seed | B | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CS-B14 | quantum · harmonic-oscillator | MCQ | 3.5M | standard | C | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CS-B15 | thermo · phase-equilibria | MCQ | 3.5M | seed | D | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-B16 | thermo · carnot | MCQ | 3.5M | seed | A | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-B17 | thermo · entropy | MCQ | 3.5M | standard | B | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-B18 | electronics · amplifiers | MCQ | 3.5M | standard | C | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CS-B19 | electronics · sources | MCQ | 3.5M | seed | D | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CS-B20 | electronics · digital | MCQ | 3.5M | standard | A | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-B21 | atnuc · nuclear-structure | MCQ | 3.5M | seed | B | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CS-B22 | atnuc · nuclear-size | MCQ | 3.5M | standard | C | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-B23 | solidstate · crystal-structure | MCQ | 3.5M | standard | D | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-B24 | solidstate · semiconductors | MCQ | 3.5M | seed | A | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-B25 | solidstate · band-theory | MCQ | 3.5M | standard | B | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CS-C01 | mathphys · complex-analysis | MCQ | 5M | standard | C | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CS-C02 | mathphys · fourier-transform | MCQ | 5M | standard | D | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-C03 | mathphys · linear-algebra | MCQ | 5M | apex | A | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CS-C04 | mathphys · vector-calculus | MCQ | 5M | standard | B | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CS-C05 | classical · rockets | MCQ | 5M | standard | C | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-C06 | classical · central-forces | MCQ | 5M | apex | D | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CS-C07 | classical · projectile | MCQ | 5M | seed | A | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-C08 | classical · oscillations | MCQ | 5M | apex | B | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CS-C09 | emtheory · electrostatics | MCQ | 5M | standard | C | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CS-C10 | emtheory · capacitance | MCQ | 5M | standard | D | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-C11 | emtheory · method-of-images | MCQ | 5M | apex | A | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CS-C12 | emtheory · optics | MCQ | 5M | standard | B | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CS-C13 | quantum · tunneling | MCQ | 5M | apex | C | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CS-C14 | quantum · hydrogen | MCQ | 5M | standard | D | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CS-C15 | quantum · perturbation | MCQ | 5M | apex | A | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CS-C16 | quantum · uncertainty | MCQ | 5M | standard | B | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CS-C17 | thermo · otto-cycle | MCQ | 5M | standard | C | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-C18 | thermo · radiation | MCQ | 5M | standard | D | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-C19 | thermo · ideal-gas | MCQ | 5M | standard | A | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-C20 | thermo · mixing | MCQ | 5M | apex | B | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-C21 | electronics · bridges | MCQ | 5M | standard | C | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-C22 | electronics · opamp | MCQ | 5M | standard | D | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-C23 | atnuc · semf | MCQ | 5M | apex | A | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-C24 | atnuc · radioactivity | MCQ | 5M | apex | B | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-C25 | solidstate · fermi-gas | MCQ | 5M | standard | C | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-C26 | solidstate · crystal-structure | MCQ | 5M | standard | D | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-C27 | solidstate · effective-mass | MCQ | 5M | apex | A | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-C28 | solidstate · diffraction | MCQ | 5M | standard | B | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CS-C29 | electronics · digital | MCQ | 5M | standard | C | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CS-C30 | thermo · kinetic-theory | MCQ | 5M | standard | D | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |

## Standing notes

* Negative marking (MCQ only): −1/3 of 1-mark, −2/3 of 2-mark. MSQ & NAT: no
  negative; MSQ graded all-or-nothing per GATE convention.
* NAT keys may be a point value or an official-style `lo to hi` window; the
  cockpit grades inside-window as correct.
* The bank note cites this journal; the journal is regenerated (and the sweep
  re-run) whenever the bank changes. A stale journal is a forge-law violation.
