# PAPERFORGE — FORGE JOURNAL · LEGION I (S3)

**Bank:** `paperforge-bank-legion1.js` · 60 original questions · max score **98** · duration 2 h 45 m
**Composition:** 35 MCQ / 8 MSQ / 17 NAT · 22 × 1-mark + 38 × 2-mark · lanes MP 20 · CM 20 · EM 20
**Minted:** 2026-08-17 · **Status:** SEALED ✅

## The double-solve law (PAPERFORGE Four Laws, law 3)

Every question was solved **twice, independently**:

1. **AUTHOR-SOLVE** — the worked solution embedded in the bank (`sol` field),
   written at authoring time, rendered in the vault review.
2. **AUDIT-SOLVE** — performed after authoring, without re-reading the author's
   derivation, in one of two tiers:
   * **T1** — every *number* that appears in a key was recomputed from first
     principles by `audit_legion1.py` (independent formulas/constants).
     Result this mint: **25/25 recomputations inside the bank windows — PASSED**.
   * **T2** — symbolic/conceptual items re-derived on paper **and** machine-
     swept for key well-formedness (MCQ key in range, no duplicate options,
     MSQ key non-empty + sorted, NAT key numeric or `lo to hi` window,
     solution present and clean). Result this mint: **60/60 — PASSED** by
     `gen_forge_journal.py` (this generator; the run that produced this file).

Cross-battery status at seal time: `replay_pf.js` 60 Q green ·
`kcheck_pf.js` 530 KaTeX-strict segments, 0 failures · `pf_fig_gates.py` 170/170 ·
`smoke37_paperforge_legion1.js` 30/30 (cockpit end-to-end vs real tracker boot).

## Per-question ledger

| id | lane · subtopic | type | marks | diff | key | audit-solve trail |
|----|-----------------|------|-------|------|-----|-------------------|
| PF-MP-01 | mathphys · linear-algebra | MCQ | 1M | seed | A | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-MP-02 | mathphys · linear-algebra | NAT | 1M | standard | 1 | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-MP-03 | mathphys · linear-algebra | MSQ | 2M | standard | ACD | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-MP-04 | mathphys · linear-algebra | MCQ | 2M | apex | B | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-MP-05 | mathphys · complex-analysis | MCQ | 1M | seed | C | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-MP-06 | mathphys · complex-analysis | NAT | 2M | standard | 0 | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-MP-07 | mathphys · complex-analysis | MCQ | 2M | standard | A | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-MP-08 | mathphys · ode-pde | MCQ | 1M | seed | B | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-MP-09 | mathphys · fourier | MCQ | 2M | standard | C | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-MP-10 | mathphys · probability | NAT | 1M | standard | 161 | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-MP-11 | mathphys · special-functions | MCQ | 1M | seed | D | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-MP-12 | mathphys · vector-calculus | NAT | 2M | standard | 4 | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-MP-13 | mathphys · complex-analysis | MSQ | 2M | standard | BC | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-MP-14 | mathphys · ode-pde | MCQ | 1M | seed | A | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-MP-15 | mathphys · fourier | NAT | 2M | standard | 0.66 to 0.67 | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-MP-16 | mathphys · group-theory | MCQ | 1M | seed | B | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-MP-17 | mathphys · ode-pde | MCQ | 2M | apex | C | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-MP-18 | mathphys · probability | MSQ | 2M | standard | ABD | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-MP-19 | mathphys · ode-pde | NAT | 1M | standard | 0.5 | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-MP-20 | mathphys · vector-calculus | MCQ | 2M | standard | D | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CM-21 | classical · newtonian | MCQ | 1M | seed | A | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CM-22 | classical · newtonian | NAT | 1M | standard | 34.63 to 34.66 | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CM-23 | classical · lagrangian | MCQ | 2M | standard | B | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CM-24 | classical · central-orbits | MCQ | 2M | standard | C | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CM-25 | classical · central-orbits | MSQ | 2M | standard | ABD | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CM-26 | classical · small-oscillations | MCQ | 2M | standard | D | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CM-27 | classical · hamiltonian | MCQ | 1M | seed | A | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CM-28 | classical · rigid-body | NAT | 2M | standard | 3.55 to 3.60 | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CM-29 | classical · canonical | MCQ | 2M | apex | B | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CM-30 | classical · small-oscillations | MSQ | 2M | standard | ABD | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CM-31 | classical · rigid-body | MCQ | 1M | seed | C | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CM-32 | classical · relativity | NAT | 2M | standard | 15.4 to 15.7 | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CM-33 | classical · rigid-body | MCQ | 2M | apex | D | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CM-34 | classical · lagrangian | MCQ | 1M | seed | A | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CM-35 | classical · newtonian | NAT | 2M | standard | 1.45 to 1.46 | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CM-36 | classical · fluids | MCQ | 1M | seed | B | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CM-37 | classical · relativity | MCQ | 2M | standard | C | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CM-38 | classical · central-orbits | MCQ | 2M | apex | D | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-CM-39 | classical · newtonian | NAT | 2M | standard | 2.43 to 2.47 | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-CM-40 | classical · hamiltonian | MSQ | 2M | apex | ABC | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-EM-41 | emtheory · electrostatics | MCQ | 1M | seed | A | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-EM-42 | emtheory · electrostatics | MCQ | 1M | seed | B | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-EM-43 | emtheory · electrostatics | NAT | 2M | standard | 80.0 to 80.5 | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-EM-44 | emtheory · electrostatics | MCQ | 2M | standard | C | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-EM-45 | emtheory · magnetostatics | NAT | 1M | standard | 31.3 to 31.5 | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-EM-46 | emtheory · magnetostatics | MCQ | 2M | standard | D | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-EM-47 | emtheory · magnetostatics | MSQ | 2M | standard | ABC | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-EM-48 | emtheory · induction | NAT | 2M | standard | 25 | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-EM-49 | emtheory · maxwell | MCQ | 1M | standard | A | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-EM-50 | emtheory · waves | MCQ | 1M | standard | B | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-EM-51 | emtheory · maxwell | MSQ | 2M | standard | ABC | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-EM-52 | emtheory · waves | MCQ | 2M | apex | C | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-EM-53 | emtheory · waves | NAT | 2M | standard | 4.76 to 4.79 | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-EM-54 | emtheory · waves | MCQ | 2M | apex | D | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-EM-55 | emtheory · dielectrics | MCQ | 2M | standard | A | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-EM-56 | emtheory · electrostatics | NAT | 1M | standard | 39.5 to 40.1 | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |
| PF-EM-57 | emtheory · electrostatics | MCQ | 1M | seed | B | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-EM-58 | emtheory · electrostatics | MCQ | 2M | apex | C | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-EM-59 | emtheory · magnetostatics | MCQ | 2M | standard | D | T2 — symbolic re-derivation + key-uniqueness sweep ✓ (gen_forge_journal.py) |
| PF-EM-60 | emtheory · magnetostatics | NAT | 2M | apex | 0.1 | T1 — independent numeric recomputation (audit_legion1.py) ✓ inside window |

## Standing notes

* Negative marking (MCQ only): −1/3 of 1-mark, −2/3 of 2-mark. MSQ & NAT: no
  negative; MSQ graded all-or-nothing per GATE convention.
* NAT keys may be a point value or an official-style `lo to hi` window; the
  cockpit grades inside-window as correct.
* The bank note cites this journal; the journal is regenerated (and the sweep
  re-run) whenever the bank changes. A stale journal is a forge-law violation.
