# 🎨 OPERATION SKINFORGE — THEME ROSTER SURGERY
### OUT: Escape Room + Backrooms · IN: KAIJU NO. 8 (flagship "ultimate") + BATMAN + MOON KNIGHT
*drafted: 2026-08-13 · status: ✅ BUILT — shipped in R26 (43 surgical pairs, byte-parity PROOF PASSED, 676 unit+smoke assertions green) · sister op: 🎭 CASTFORGE (CASTFORGE_PLAN.md — persona ultimates living inside the themes; either order works) · house discipline: tracked seams only — every cut & graft listed below, zero cowboy edits*

---

## 📋 CURRENT ROSTER (10 themes, verified in the deliverable today)

| Theme id | Picker label | Bound voice | Game mode | CSS rules | FX layer |
|---|---|---|---|---|---|
| theme-white | WHITE ROOM | (any) | memory | 357 | #fxWhite |
| theme-physics | PHYSICS LAB | feynman/astro/physguy | feynman·gravity | 76 | #fxGate |
| theme-shrek | SPIRIT REALM (Soul Land) | tangsan | spirit | 69 | #fxShrek/#fxSpirits |
| theme-system | SYSTEM (Solo Leveling) | jinwoo | shadow | 40 | #fxSystem |
| theme-aincrad | AINCRAD (SAO) | kirito | cascade | 29 | #fxAincrad |
| theme-lotm | BEYONDER (LotM) | klein | mystery | 27 | #fxLotm |
| theme-neon | NEON (Cyberpunk) | — | runner | 15 | #fxNeon |
| theme-black | BLACK ROOM | — | cipher | 13 | #fxBlack |
| **theme-escape** | ESCAPE ROOM | — | cipher (shares black) | 3 | #fxEscape |
| **theme-backrooms** | THE BACKROOMS | — | maze | 4 | #fxBackrooms |

Architecture: picker options are generated from a `THEMES = {id: {label, shortLabel, swatchColors[4], description, supportsVoice, themeVoice}}` registry → CSS lives as `body.theme-<id> {…}` rule families → ambient `<div id="fx<Name>">` overlay per theme → `modeForTheme()` maps theme → break-game mode.

---

## ✂️ PART 1 — THE CUT (2 themes out, 7 seams each)

For **theme-escape** and **theme-backrooms**:

| # | Seam | What's removed |
|---|---|---|
| 1 | `THEMES` registry | both entries (picker rebuilds itself — no UI surgery needed) |
| 2 | CSS rule families | 3 + 4 `body.theme-*` rules + their `#fxEscape`/`#fxBackrooms` animation CSS |
| 3 | FX DOM nodes | the two ambient overlay divs |
| 4 | `modeForTheme()` | backrooms→maze branch; escape half of the `black‖escape`→cipher branch (black keeps cipher) |
| 5 | Tests | smoke13 + any suite row referencing the two ids — updated in same round |
| 6 | Docs/strings | any label mention of the two themes inside the app copy |
| 7 | Orphan sweep | grep-proof: `theme-escape` / `theme-backrooms` / `fxEscape` / `fxBackrooms` = **0 hits** in the shipped file |

Salvage note: the `maze` game mode code itself **stays** in the game library — it just loses its trigger… until Moon Knight inherits it below. Nothing playable is deleted.

---

## 🌟 PART 2 — THE FORGE (3 themes in)

| | `theme-kaiju8` 🦖 (FLAGSHIP) | `theme-batman` 🦇 | `theme-moonknight` 🌙 |
|---|---|---|---|
| Label | **KAIJU NO. 8** | THE DARK KNIGHT | MOON KNIGHT |
| Vibe | kaiju-blue bio-energy tearing through a midnight Defense-Force HUD | Gotham noir: rain-black steel + bat-signal gold | moonlit marble: silver sheen over Khonshu gold |
| swatchColors | `#05070f` · `#00e5ff` · `#7df9ff` · `#ff3355` (kaiju core red) | `#0a0a0c` · `#ffd60a` · `#9aa5b1` · `#1b2735` | `#0d1021` · `#e8e6df` · `#d4af37` · `#5eead4` |
| FX layer (new, CSS/SVG only) | `#fxKaiju8`: pulsing energy-vein veins + faint scanline grid; "ULTIMATE" flourish — veins surge on task completion (class hook, reduced-motion respected) | `#fxBatman`: slow bat-signal beacon sweep through skyline silhouette (original SVG geometry) | `#fxMoonknight`: drifting crescent arc + starfield parallax |
| `modeForTheme` | **lattice** (breach-grid defense — gives our newest game a home) | **cipher** (detective decoding) | **maze** (tomb of Khonshu — adopts the orphaned mode so the cut loses nothing) |
| supportsVoice | false | false | false |

**IP hygiene (binding):** original palettes + self-drawn geometric SVG motifs only. No copied logos, no traced bat-symbol, no manga frames, no web images. Inspired-by, never traced-from.

**Per-theme graft seams (mirror of the cut):** registry entry → `body.theme-<id>` CSS family (full token coverage: bg/surface/ink/accent/glow/borders + panel + command-center + boot overlay harmony) → fx CSS + DOM node → `modeForTheme` branch → picker verified (auto) → tests extended.

---

## ✅ PART 3 — PROOF BATTERY (per house standard)

- **Unit**: registry integrity — every THEMES id has ≥1 CSS rule + fx node + valid 4-color swatch + game-mode mapping; **zero orphan refs** to `escape/backrooms/fxEscape/fxBackrooms` post-cut; the three new ids resolve end-to-end; maze/cipher/lattice mappings present exactly once.
- **jsdom smoke**: switch to each new theme → body class applies → computed tokens match the spec table → fx layer in DOM → `modeForTheme()` returns lattice/cipher/maze; picker contains KAIJU NO. 8/DARK KNIGHT/MOON KNIGHT and NOT the removed two; boot overlay + command center render unbroken under each.
- **Visual gate**: one screenshot-style review pass per theme for you before sealing (eyeball approvals like the bg gallery did).
- **House battery**: byte-parity PROOF + full script syntax sweep + every existing suite stays green (test rows for removed ids rewritten in the same round).

## 🙏 WHAT I NEED FROM YOU (defaults pre-picked — answer only if you disagree)

| # | Item | Default |
|---|---|---|
| 1 | Kaiju No. 8 accent | kaiju-blue `#00e5ff` + core-red flash (alt: Defense-Force jade `#00e5a0`) |
| 2 | Game pairings | kaiju8→lattice · batman→cipher · moonknight→maze |
| 3 | Picker labels | KAIJU NO. 8 · THE DARK KNIGHT · MOON KNIGHT |
| 4 | FX intensity | ambient-low by default (reading-first), surging only on wins — kaiju8 gets the "ultimate" treatment as promised |

> One line to light it: **"BUILD SKINFORGE"** — cut + graft + full battery in one round, then you tour the three new worlds.
