# PAPERFORGE — ORACLE ASSEMBLY LOG (S6)

minted: 2026-08-18 · assembler: `_audit/paperforge/forge_oracle.js` · seeds sealed per paper

## blueprint inputs (read live from `paperforge-blueprint.json`)

| quantity | value |
|---|---|
| subject lane targets /55 | MP 5 · CM 8 · EM 9 · QM 11 · TH 6 · EL 4 · AN 5 · SS 7 |
| lane 1-mark quota | MP 2 · CM 4 · EM 4 · QM 5 · TH 3 · EL 2 · AN 2 · SS 3 |
| subject type targets /55 | MCQ 27 · MSQ 11 · NAT 17 (tolerance ±2) |
| pool | LEGION I 60 + LEGION II 60 = 120 audited originals |

## papers minted

| paper | seed | GA set | subject type mix | marks | pool draw |
|---|---|---|---|---|---|
| A | 2701 | `pfga_a.js` (10 fresh) | 36 MCQ / 10 MSQ / 19 NAT | 100 | pf-oracle-ga-a:10 · pf-legion-2:33 · pf-legion-1:22 |
| B | 2702 | `pfga_b.js` (10 fresh) | 35 MCQ / 11 MSQ / 19 NAT | 100 | pf-oracle-ga-b:10 · pf-legion-1:22 · pf-legion-2:33 |
| C | 2703 | `pfga_c.js` (10 fresh) | 35 MCQ / 11 MSQ / 19 NAT | 100 | pf-oracle-ga-c:10 · pf-legion-2:33 · pf-legion-1:22 |

## pairwise overlap (subject pool is 120 for 165 slots — honest disclosure)

- pf-oracle-a vs pf-oracle-b: 38 shared subject/GA items
- pf-oracle-a vs pf-oracle-c: 36 shared subject/GA items
- pf-oracle-b vs pf-oracle-c: 37 shared subject/GA items

Policy: zero repeats WITHIN a paper; GA sets exclusive per paper; overlap exists only
across papers and only in lanes thinner than the blueprint demands (logged above).
Subject items carry their full audit chain from the source legion (forge journals I/II);
GA sets audited fresh in `audit_oracle.py`.
