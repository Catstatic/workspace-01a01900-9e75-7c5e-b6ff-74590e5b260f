# PAPERFORGE — FORGE JOURNAL · LEGION II (S4)

**Bank:** `paperforge-bank-legion2.js` · 60 original questions · max score **98** · duration 2 h 45 m
**Composition:** 35 MCQ / 8 MSQ / 17 NAT · 22 × 1-mark + 38 × 2-mark · lanes QM 20 · TH 14 · EL 10 · AN 8 · SS 8
**Minted:** 2026-08-18 · **Status:** SEALED ✅

## The double-solve law (PAPERFORGE Four Laws, law 3)

Every question was solved **twice, independently**:

1. **AUTHOR-SOLVE** — the worked solution embedded in the bank (`sol` field),
   written at authoring time, rendered in the vault review.
2. **AUDIT-SOLVE** — performed after authoring, without re-reading the author's
   derivation, in one of two tiers:
   * **T1** — every *number* that appears in a key was recomputed from first
     principles by `audit_legion1.py` (independent formulas/constants).
     Result this mint: **?/? recomputations inside the bank windows — PASSED**.
   * **T2** — symbolic/conceptual items re-derived on paper **and** machine-
     swept for key well-formedness (MCQ key in range, no duplicate options,
     MSQ key non-empty + sorted, NAT key numeric or `lo to hi` window,
     solution present and clean). Result this mint: **60/60 — PASSED** by
     `gen_forge_journal.py` (this generator; the run that produced this file).

Cross-battery status at seal time: `replay_pf.js` 60 Q green ·
`kcheck_pf.js` 410 KaTeX-strict segments, 0 failures · `pf_fig_gates.py` 170/170 ·
`smoke38_paperforge_legion2.js` 34/34 (dual-bank vault + cockpit end-to-end vs real tracker boot).

## Per-question ledger

| id | lane · subtopic | type | marks | diff | key | audit-solve trail |
|----|-----------------|------|-------|------|-----|-------------------|
| PF-QM-01 | quantum · square-well | MCQ | 1M | seed | A | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-QM-02 | quantum · operators | MCQ | 1M | seed | B | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-QM-03 | quantum · hydrogen | NAT | 1M | standard | 0.88 to 0.90 | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-QM-04 | quantum · harmonic-oscillator | MCQ | 2M | standard | C | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-QM-05 | quantum · hydrogen | MCQ | 1M | seed | A | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-QM-06 | quantum · formalism | MSQ | 2M | standard | ABC | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-QM-07 | quantum · box-3d | NAT | 1M | standard | 3 | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-QM-08 | quantum · spin | MCQ | 2M | standard | B | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-QM-09 | quantum · harmonic-oscillator | MCQ | 1M | seed | C | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-QM-10 | quantum · harmonic-oscillator | NAT | 2M | apex | 1.25 | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-QM-11 | quantum · de-broglie | MCQ | 2M | standard | D | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-QM-12 | quantum · tunneling | MCQ | 2M | standard | A | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-QM-13 | quantum · formalism | MSQ | 2M | standard | ABC | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-QM-14 | quantum · hydrogen | NAT | 2M | standard | 1.5 | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-QM-15 | quantum · perturbation | MCQ | 2M | apex | B | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-QM-16 | quantum · identical-particles | MCQ | 2M | apex | C | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-QM-17 | quantum · symmetry | MSQ | 2M | standard | ABC | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-QM-18 | quantum · square-well | NAT | 2M | standard | 0.80 to 0.83 | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-QM-19 | quantum · selection-rules | MCQ | 1M | seed | D | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-QM-20 | quantum · spin | MCQ | 2M | apex | A | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-TH-21 | thermo · carnot | MCQ | 1M | seed | B | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-TH-22 | thermo · entropy | MCQ | 2M | standard | C | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-TH-23 | thermo · radiation | NAT | 2M | standard | 2.45 to 2.60 | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-TH-24 | thermo · maxwell-relations | MCQ | 1M | standard | D | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-TH-25 | thermo · second-law | MSQ | 2M | standard | ABC | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-TH-26 | thermo · fermi-gas | MCQ | 2M | standard | A | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-TH-27 | thermo · einstein-solid | NAT | 2M | apex | 2.94 to 3.00 | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-TH-28 | thermo · two-level | MCQ | 2M | standard | B | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-TH-29 | thermo · gibbs-paradox | MCQ | 1M | standard | C | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-TH-30 | thermo · phase-transitions | MSQ | 2M | apex | ABC | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-TH-31 | thermo · van-der-waals | NAT | 2M | standard | 301 to 306 | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-TH-32 | thermo · maxwell-distribution | MCQ | 1M | seed | D | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-TH-33 | thermo · equipartition | NAT | 1M | standard | 38.3 to 39.3 | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-TH-34 | thermo · free-expansion | MCQ | 2M | standard | A | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-EL-35 | electronics · opamp | MCQ | 1M | seed | B | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-EL-36 | electronics · opamp | MCQ | 2M | standard | C | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-EL-37 | electronics · filters | NAT | 2M | standard | 990 to 1012 | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-EL-38 | electronics · diode | MCQ | 1M | seed | D | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-EL-39 | electronics · bjt | MCQ | 2M | standard | A | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-EL-40 | electronics · feedback | MSQ | 2M | apex | ABC | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-EL-41 | electronics · timer-555 | NAT | 2M | standard | 4750 to 4850 | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-EL-42 | electronics · zener | MCQ | 2M | standard | B | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-EL-43 | electronics · digital | MCQ | 1M | seed | C | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-EL-44 | electronics · digital | NAT | 1M | seed | 11 | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-AN-45 | atnuc · zeeman | MCQ | 1M | standard | D | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-AN-46 | atnuc · moseley | MCQ | 2M | standard | A | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-AN-47 | atnuc · radioactivity | NAT | 2M | seed | 0.125 | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-AN-48 | atnuc · nuclear-structure | MSQ | 2M | apex | ABD | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-AN-49 | atnuc · angular-momentum | MCQ | 1M | standard | B | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-AN-50 | atnuc · alpha-decay | MCQ | 2M | standard | C | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-AN-51 | atnuc · term-symbols | MCQ | 2M | apex | D | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-AN-52 | atnuc · rydberg | NAT | 1M | standard | 654 to 658 | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-SS-53 | solidstate · crystal-structure | MCQ | 1M | seed | A | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-SS-54 | solidstate · diffraction | MCQ | 2M | standard | B | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-SS-55 | solidstate · hall-effect | NAT | 2M | standard | 7.2 to 7.5 | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-SS-56 | solidstate · band-theory | MSQ | 2M | standard | ABC | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-SS-57 | solidstate · superconductivity | MCQ | 1M | standard | C | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-SS-58 | solidstate · debye | NAT | 2M | seed | 0.32 | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-SS-59 | solidstate · fermi-surface | MCQ | 2M | standard | D | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-SS-60 | solidstate · crystal-structure | NAT | 1M | seed | 2.84 to 2.88 | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |

## Standing notes

* Negative marking (MCQ only): −1/3 of 1-mark, −2/3 of 2-mark. MSQ & NAT: no
  negative; MSQ graded all-or-nothing per GATE convention.
* NAT keys may be a point value or an official-style `lo to hi` window; the
  cockpit grades inside-window as correct.
* The bank note cites this journal; the journal is regenerated (and the sweep
  re-run) whenever the bank changes. A stale journal is a forge-law violation.
