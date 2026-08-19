# OPERATION FIGFORGE — Content Vault Inline Figure Fleet

*drafted & wave-1 shipped: 2026-08-18 · wave-2 shipped: 2026-08-18 · status: **WAVES 1+2 SHIPPED — 55 figures — PROOF PASSED (49 blocks)** — factory-grade figures live INSIDE the Content Vault between the theory blocks of all 12 subject docs; 30 of them replace the legacy ASCII-art sketches, 25 fill foundational gaps. Engine = ROUND 32 masters (`ins30_figs_css.css` / `ins30_figs_js.js`, registered in `verify_insertions.js`), data companion = `content-figs.js` (deterministic, palette-locked, AI-GENERATED).*

## Architecture (locked)

| piece | where | law |
|---|---|---|
| figure factory | `_audit/figforge/` (`cf_kernel.py` on the PAPERFORGE `pf_figkit` palette + `cf_wave1_a/b.py` generators + `cf_build.py` builder-gates) | true-math curves only — every plot computed from the real formula; no clipart |
| data companion | `project/content-figs.js` → `window.CONTENT_FIGS` | rebuilt deterministically by `cf_build.py`; hash recorded in `cf_manifest.json` |
| engine | ROUND 32 masters, embedded before the `topicforge-map.js` seam | heading-fingerprint anchors (KaTeX-proof), inject after vault render via MutationObserver; `hide` defs conceal the matching ASCII `pre` and the figure lands exactly where the sketch was; reading-order FIG numbering; idempotent |
| QA | `cf_build.py` gates (XML · palette ≤9 locked colors · ≤30 KB/fig · anchors exist in real docs · hide targets exist · determinism · no `$` in SVG = KaTeX-safe · no external refs) + `smoke41_figforge_wave1.js` (28/28 end-to-end, wave-agnostic counts off `cf_manifest.json`) + full cairosvg raster eyeball of every figure | zero tolerance |

## WAVE 1 — 31 figures (✅ shipped 2026-08-18)

| doc | figs | highlights |
|---|---|---|
| nuclear & particle | 4 | Woods-Saxon ρ(r) · SEMF B/A curve · Gamow tunnelling · mass parabolas — **all 4 replace ASCII** |
| condensed matter | 4 | SC/BCC/FCC cells · monatomic & diatomic phonon dispersion · Kronig-Penney bands — **all 4 replace ASCII** |
| classical mech | 3 | pendulum phase portrait (separatrix) · effective potential/orbits · LAB-vs-CM — **all replace ASCII** |
| atomic & molecular | 2 | DFT window functions · helium singlet/triplet Grotrian — **both replace ASCII** |
| quantum mech | 4 | infinite well · oscillator Hermite states · barrier tunnelling · hydrogen radial P(r) |
| thermodynamics | 3 | Maxwell speeds · FD/BE/MB trio · Planck vs Rayleigh-Jeans |
| EM theory | 4 | exact 2-charge dipole field · interface boundary rules · skin depth · Snell geometry |
| math methods | 2 | Bessel J₀/J₁/J₂ · Gibbs phenomenon |
| electronics notes | 3 | diode I-V · BJT load line · rectifier+filter ripple |
| thermo+electronics | 1 | Landau double well |
| CM·EMT·QM advanced | 1 | WKB turning points |

## WAVE 2 — +24 figures (✅ shipped 2026-08-18) → 55 total, all 12 docs covered

| doc | adds | figures |
|---|---|---|
| nuclear & particle | +4 → 8 | shapes & Q-sign · deuteron well + leakage · shell-model magic ladder · Breit-Wigner FWHM — **all replace ASCII** |
| condensed matter | +5 → 9 | HCP cell · Lennard-Jones (no hide) · superconducting gap · phonon-roton Landau spectrum · edge+screw dislocations — **4 replace ASCII** |
| classical mech | +2 → 5 | τ–Δ fixed-point map · m–M–m triatomic normal modes — **both replace ASCII** |
| quantum mech | +2 → 6 | Stern-Gerlach apparatus · radial V_eff walls — **both replace ASCII** |
| thermodynamics | +2 → 5 | Carnot P–V (true PV^γ adiabats) · P–T phase diagram (no hides) |
| thermo+electronics | +2 → 3 | Langevin L(x) · BEC condensate fraction — **both replace ASCII** |
| electronics notes | +3 → 6 | Zener breakdown · MOSFET output family · op-amp golden rules (no hides) |
| atomic & molecular | +3 → 5 | Lorentz vs Gauss line profiles · Morse + converging levels · rigid-rotor ladder→sticks — **all replace ASCII** |
| math methods advanced | +1 → 1 | Green's function causal impulse response (first figure in the 12th doc) |

**Wave-2 disclosed deviations** (honest ledger): the wave-2 candidate list promised Ewald sphere, XRD pattern, Schmidt lines, quark octets, Hall geometry, Yukawa, finite well, 2D Bravais — those 8 were **deferred**; W2 instead prioritised **killing remaining ASCII sketches** (17 of its 24 figures conceal a `pre`) plus the highest-yield foundational plots (Carnot, phase, LJ, roton, morse, op-amp). *(Count correction: wave-2 ASCII kills = 17, running total = 30 kills / 55 figures — an earlier chat summary said 19/32; verified off the shipped defs.)* smoke41 converted to wave-agnostic counts (reads `cf_manifest.json`), so future waves never break it again. Raster-QA defects caught & fixed before ship: deuteron wavefunction redrawn (sine→exponential match), roton curve rebuilt through phonon/maxon/roton points, fixed-point labels re-zoned to the correct regions, Carnot adiabats made distinct solid legs, ~20 label clips/collisions repaired, Morse levels made wall-to-wall.

## Wave candidates (queued, say the word)

- **W3**: Schmidt proton/neutron lines · quark-model octet + decuplet grids · Ewald sphere · XRD σ/2θ · Hall geometry · Yukawa potential · finite square well · 2D Bravais net · lock-in/boxcar · liquid-crystal phases · ESR hyperfine tree · laser 3/4-level · Fabry-Perot · Kurie plot · Wu-experiment
- **W4**: aptitude-content vault figures (GA DI set: bar/line/pie exemplars, Venn, clock, boats/trains) + remaining advanced-math sketches

## Incident log (honest ledger)

- 2026-08-18: a bad re-embed one-liner matched a generic 60-char comment run and truncated the tracker to 9.0 MB. **Fully recovered** from `/tmp/arena-workspace/hydrate.zip` (workspace hydration snapshot = sealed S7 state) → re-embedded R32 via the safe marker-keyed script → **PROOF PASSED (49 blocks)** within the session. Permanent fix: `reembed_ins30.js` locates spans by the unique ROUND-32 banner marker only; `apply_ins30.js` refuses generic head markers. Companions/masters were never at risk (all live outside the tracker).
- Test-side catch: `String.replace(tag, body-with-$$)` silently collapsed `$$` math to `$` in smoke41's companion inlining (jsdom only) — fixed with a function replacement; deserves its name in the hall of footguns.
