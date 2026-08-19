#!/usr/bin/env python3
"""Emit /home/user/project/PAPERFORGE_S1_BLUEPRINT.md — the Stage-1 readable
approval table, built deterministically from paperforge-blueprint.json."""
import json

bp = json.load(open('/home/user/project/paperforge-blueprint.json'))
Y = ["gate2020", "gate2024", "gate2025"]
LANES = ["mathphys", "classical", "emtheory", "quantum", "thermo",
         "electronics", "atomic", "nuclear", "solidstate"]
LANE_T = {"mathphys": "Math Physics", "classical": "Classical Mech",
          "emtheory": "EM Theory", "quantum": "Quantum Mech",
          "thermo": "Thermo+Stat", "electronics": "Electronics",
          "atomic": "Atomic/Molec/Opt", "nuclear": "Nuclear+Particle",
          "solidstate": "Solid State", "aptitude": "General Aptitude"}

src_rows = [
    ("GATE 2020 Question Paper (1).pdf", "16→17", "65/65", "10 GA + 55 PH", "100", "UNKEYED (paper only)"),
    ("GATE-Solution-2024_compressed (1).pdf", "50", "65/65", "10 GA + 55 PH", "100", "fiziks solved key 65/65"),
    ("GATE-Physics-2025_Question-Paper.pdf", "21", "65/65", "10 GA + 55 PH", "100", "fiziks solved key 65/65"),
]

def types_line(y):
    t = bp["years"][y]["typesByPart"]
    ga = ", ".join("%s %d" % (k, v) for k, v in sorted(t["GA"].items()))
    ph = ", ".join("%s %d" % (k, v) for k, v in sorted(t["PH"].items()))
    return "GA: " + ga + " · PH: " + ph

L = []
A = L.append
A("# 🏭 PAPERFORGE · STAGE 1 EXTENSION — THE COMPLETED GATE TREND LINE")
A("### 2020 + 2024 + 2025 mined, structured & classified · the three holes in the weightage map are closed")
A("*minted: 2026-08-17 · op law compliant: mining only, zero problems forged, official PYQ banks untouched, shipped TOPICFORGE map/fleet untouched*")
A("")
A("---")
A("")
A("## 1 · SOURCE VERIFICATION (your three PDFs)")
A("")
A("| file | PDF pages | questions parsed | section split | marks-sum | answer keys |")
A("|---|---|---|---|---|---|")
for r in src_rows:
    A("| " + " | ".join(r) + " |")
A("")
A("All three are fiziks reproductions of the official GATE PH papers (65-question structure intact in each). "
  "2020 is question-paper-only; 2024/2025 carry fiziks' solved answer keys inline.")
A("")
A("## 2 · STRUCTURE CONFORMANCE (every year matches the official GATE skeleton)")
A("")
A("| check | GATE 2020 | GATE 2024 | GATE 2025 |")
A("|---|---|---|---|")
A("| total questions | 65 ✅ | 65 ✅ | 65 ✅ |")
A("| GA / PH | 10 / 55 | 10 / 55 | 10 / 55 |")
A("| 1-mark / 2-mark | 30 / 35 | 30 / 35 | 30 / 35 |")
A("| paper marks | 100 | 100 | 100 |")
A("")
A("Type detail, per year:")
A("")
A("| year | GA types | PH types |")
A("|---|---|---|")
for y, lab in zip(Y, ("2020", "2024", "2025")):
    t = bp["years"][y]["typesByPart"]
    ga = ", ".join("%s %d" % (k, v) for k, v in sorted(t["GA"].items()))
    ph = ", ".join("%s %d" % (k, v) for k, v in sorted(t["PH"].items()))
    A("| " + lab + " | " + ga + " | " + ph + " |")
A("")
A("2020 (correctly) shows **zero MSQ** — MSQ was introduced in GATE 2021. 2024/2025 each carry 16–17 MSQ, the modern signature.")
A("")
A("## 3 · LANE CARTOGRAPHY — per-year physics weights (classified questions)")
A("")
A("| lane | 2020 | 2024 | 2025 | 3-yr total | share of classified PH |")
A("|---|---|---|---|---|---|")
tot_classified_ph = sum(bp["combined"]["laneTotals"][l] for l in LANES)
for l in LANES:
    a = bp["years"]["gate2020"]["lanes"][l]["total"]
    b = bp["years"]["gate2024"]["lanes"][l]["total"]
    c = bp["years"]["gate2025"]["lanes"][l]["total"]
    t = bp["combined"]["laneTotals"][l]
    share = 100.0 * t / tot_classified_ph
    A("| %s | %d | %d | %d | **%d** | %.1f%% |" % (LANE_T[l], a, b, c, t, share))
A("| *unclassified (counted openly)* | 13 | 10 | 5 | 28 | — |")
A("")
A("**Read:** QM is the heaviest modern lane (29 across 3 yrs, 21% of classified PH load) with a spike in 2025 (14); "
  "EM is the steadiest performer (7·9·9); Classical holds 6–8/yr; Solid State resurged 5→7→6; "
  "Atomic/Molecular nearly vanished this window (1·1·2) — a rotation signal, not a deletion. "
  "Math-Phys dipped to 2 in 2025 (its concepts hide inside other lanes' questions some years).")
A("")
A("## 4 · TOP SUBTOPIC PICKS PER YEAR (for the prophecy model)")
A("")
for y, lab in zip(Y, ("2020", "2024", "2025")):
    subs = []
    for l in LANES:
        for sid, h in bp["years"][y]["lanes"][l]["subs"].items():
            subs.append((h, LANE_T[l] + "/" + sid))
    subs.sort(key=lambda x: (-x[0], x[1]))
    top = ", ".join("%s×%d" % (s, h) for h, s in subs[:6])
    A("- **%s:** %s" % (lab, top))
A("")
A("## 5 · DRILL-ROSTER DELTA (TOPICFORGE's 28 repeat-offenders vs the 3 new years — report only)")
A("")
A("| rank | concept | old sessions | +2020 | +2024 | +2025 | sessions if re-mined |")
A("|---|---|---|---|---|---|---|")
for d in bp["rosterDelta"]:
    nh = d["newYearHits"]
    A("| %d | %s | %d | %s | %s | %s | **%d** |" % (
        d["rank"], d["id"], d["oldSessions"],
        nh["2020"] or "—", nh["2024"] or "—", nh["2025"] or "—",
        d["sessionsIfRemined"]))
A("")
A("Every drill concept stays ≥3 sessions — none drop off; several strengthen. The shipped 700-problem drill fleet's premise is confirmed against the newest papers.")
A("")
A("## 6 · HONESTY LEDGER (what this data is — and is not)")
A("")
A("- **Keys:** 2024/2025 keys are **fiziks' solved keys** (65/65 each) — coaching-expert keys, *not* the official IIT key sheet; fiziks historically matches official keys on ~all items, and GATE 2024 GA Q7 & Q10 are recorded as **MTA** (marks-to-all). "
  "**GATE 2020 ships UNKEYED** — the supplied PDF has no answers. To key it, supply the fiziks 2020 *solutions* PDF (or official key), same as you did for 2024.")
A("- **Figure-dependent questions** (options live in images; kept with `figure-dependent-options` flag): 2020: Q9, Q44 · 2024: Q15, Q16, Q18, Q19, Q22, Q24, Q56, Q57 · 2025: Q5, Q8, Q10, Q41.")
A("- **Math-glyph caveat:** PDF text extraction mangles TeX glyphs; stems are analytically perfect for keyword mining/cartography but are **not** display-grade transcriptions. Any future *playable* use of these years inside the tracker must be re-typeset question-by-question (Stage 3-style forge discipline).")
A("- **Classification:** 167/195 (85.6%) lane-classified by the T0 taxonomy (28 unclassified counted openly: 13/10/5) — above the T0 fleet's 80% line.")
A("- **Touch discipline:** nothing shipped was modified — `topicforge-map.js`, all 10 banks, the drill fleet, the tracker HTML: all byte-identical. New artifacts: `paperforge-blueprint.json` + this doc (project) and `gate20{20,24,25}.json` / `.tagged.json` (audit).")
A("")
A("## 7 · STAGE BOARD")
A("")
A("| stage | state |")
A("|---|---|")
A("| S0 Schema & Arena | ✅ shipped earlier (FORGE_BANKS namespace + vault shell) |")
A("| S1 Cartography | ✅ **extended 2026-08-17 — GATE line now spans 2016→2026 with zero skipped years** · blueprint above awaits your eyeball |")
A("| S2 Figure Factory | 🔒 awaits NEXT |")
A("| S3 Legion I (GATE Math+CM+EM) | 🔒 awaits NEXT |")
A("| S4 Legion II | 🔒 |")
A("| S5 CSIR Contingent | 🔒 (marking-scheme confirmation item still open) |")
A("| S6 Prophecy | 🔒 (feeds on this table) |")
A("| S7 Integration & QA | 🔒 |")
A("")
A("> Say **“FORGE STAGE 2”** (figure style: dark-theme vs exam-white is still a one-word open vote) or **“FORGE STAGE 3”** and the line starts moving again.")
A("")

open('/home/user/project/PAPERFORGE_S1_BLUEPRINT.md', 'w').write("\n".join(L))
print("PAPERFORGE_S1_BLUEPRINT.md written:", len("\n".join(L)), "chars,", len(L), "lines")
