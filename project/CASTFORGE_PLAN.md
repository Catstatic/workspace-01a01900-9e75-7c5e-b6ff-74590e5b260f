# 🎭 OPERATION CASTFORGE — PERSONA EXPANSION
### new characters with their own ULTIMATE treatments: IGRIS (System) · HUO YUHAO of Soul Land 2 (Spirit Realm, beside Tang San) · GEHRMAN SPARROW & THE FOOL (Beyonder/LotM)
*drafted: 2026-08-13 · status: ✅ BUILT — shipped in R26 (persona grafts + voice routing live; 676 unit+smoke assertions green) · sister op: 🎨 SKINFORGE (theme roster surgery — independent, either order works)*

---

## 🏛️ VERIFIED CAST ARCHITECTURE (how existing personas carry their "ultimate" look)

| Layer | Pattern | Live examples |
|---|---|---|
| Persona registry | `VOICES = { id: {label, greeting, role, description, signature} }` — in-world original copy | ayanokoji, horikita, jinwoo, kirito, tangsan, klein, feynman… (13 entries) |
| Ultimate theme CSS | combined selector family `body.theme-<theme>.voice-<persona> {…}` — full token re-skin + bespoke ornaments | shrek×tangsan: **43 rules** · physics×physguy: 43 · white×ryuuen: 76 · physics×feynman: 15 |
| Ambient overlays | per-theme `#fx<Name>` nodes; signature personas get component layers | `#fxSystem`, `#fxShrek`, `#feynmanComponents` |
| Game mapping | `modeForTheme()` branches on voice classes as well as themes | horikita/ichinose/sakayanagi→memory · ryuuen→target · feynman→feynman · astro→gravity |
| Picker | voice dropdown auto-lists personas for `supportsVoice` themes | System→Jinwoo · Spirit Realm→Tang San · Beyonder→Klein |

**Forge rule:** a new persona ships only when it has ALL FIVE layers filled — registry copy + combined-CSS family (peer-sized, not a stub) + overlay animation + game mapping + battery proof. "Amazing ultimate" is a checklist, not a vibe.

---

## 🆕 THE FOUR NEW SOULS

### 1. `voice-igris` — in **theme-system** (Solo Leveling)
**IGRIS — the Blood-Red Commander.** Baran's knight, kneeling only to the Shadow Monarch.
- Palette: throne-shadow black `#050510` (inherits System) · blood-crimson `#e0242a` · knight-armor silver `#c4cbd8` · ember glow `#ff6b3d`
- Overlay `#fxIgris`: crimson plume sway behind panel headers · slow greatsword glint sweep · helm-crest pulse on focus/timer events (reduced-motion off-switch honored)
- Signature moves: deep-red variant of the shadow-soldier particles already alive in `#fxSystem` (Jinwoo keeps shadow-blue — two commanders, two colors)
- Game mapping: **target** (the knight's duel) — Jinwoo keeps shadow

### 2. `voice-huoyuhao` — in **theme-shrek** (Spirit Realm · Soul Land **2**, per your order — NOT Soul Land 1)
**HUO YUHAO (short: SPIRIT EYES).** The Spirit-Eyed Ice Emperor — Soul Land 2's protagonist, standing beside Tang San, never replacing him.
- Palette: realm deep-night `#070a1a` (inherits) · spirit-eye violet-gold `#b98cff` · glacial ice-blue `#8fd8ff` · soul-ring gold `#d4a857`
- Overlay `#fxHuoYuhao`: Eye of Destiny iris-bloom breathing at panel crests · ice-crystal motes drifting UP through spirit-ring halos (his rings render violet-ice where Tang San's stay gold-blue, so the two eras read at a glance)
- Game mapping: **spirit** (same realm, his own wavelength)
- Canon guard: copy, colors, and role text sourced from Soul Land 2 identity only — zero Soul-Land-1 bleed (Tang San's file stays untouched)

### 3. `voice-gehrman` — in **theme-lotm** (Beyonder)
**GEHRMAN SPARROW** (canon spelling — your "Geihman" noted and corrected). The cold bounty hunter of the Sea of Fog.
- Palette: storm-gray `#2a2f38` · fog-silver `#9aa3ad` · bounty gold `#c8985a` (ties to parchment base) · gunpowder ember `#b45309`
- Overlay `#fxGehrman`: gun-smoke wisps curling off card edges · raven motes crossing ambient slow · faint crosshair shimmer on interactive targets
- Game mapping: **target** (hunter's instinct — Klein keeps mystery)

### 4. `voice-fool` — in **theme-lotm** (Beyonder)
**THE FOOL.** The great existence above the gray fog, host of the Tarot Club — mystery incarnate.
- Palette: fog-of-history gray `#8b93a0` · starlight silver `#e3e8f2` · ancient-castle crimson `#7f1d2d` · parchment amber `#e0b878`
- Overlay `#fxFool`: layered gray fog rising from the footer with tarot glints (☆ motes) orbiting · constellation threads between panel corners · long-slow "above the fog" vignette breathe
- Game mapping: **mystery** (Klein's own chair — The Fool takes the seat, Klein keeps his field coat)
- Beyonder's picker then reads: **KLEIN · GEHRMAN · THE FOOL** — the full ascension line

---

## 🛠️ SEAMS PER PERSONA (×4, grep-verifiable at gate)

1. `VOICES` registry entry — label/greeting/role/description/signature, original in-world copy
2. `body.theme-<theme>.voice-<persona>` CSS family (~40+ rules, peer-sized: full token reskin + ornaments + panel/command-center/boot harmony)
3. Overlay node + animation CSS (`#fx<Persona>`), reduced-motion respected, pointer-events none
4. `modeForTheme()` persona branch
5. Picker verification (auto from registry — no UI surgery, theme `supportsVoice` already true for system/shrek/lotm)
6. Tests: smoke13 cast table rows + registry-integrity units extended
7. Orphan sweep: no `voice-igris|huoyuhao|gehrman|fool` dangling refs

**IP hygiene (binding):** original palettes, self-drawn SVG/CSS motifs, original in-world copy. No traced character art, no copied novel prose, no web images.

## ✅ PROOF BATTERY (house standard)

- **Unit**: all four ids in VOICES with complete 5-field copy · each has ≥20 combined-CSS rules hitting live tokens · overlay node exists per persona · game-mapping branch returns the specified mode · reduced-motion kill-switch present.
- **jsdom smoke**: per persona — add classes → computed token shift asserted · overlay in DOM · picker lists the persona under its theme (System: JINWOO + **IGRIS**; Spirit Realm: TANG SAN + **HUO YUHAO**; Beyonder: KLEIN + **GEHRMAN** + **THE FOOL**) · boot + command center render clean under each.
- **Visual gate**: one screen-tour per persona for your eyeballs before sealing.
- **House battery**: byte-parity PROOF + full syntax sweep + every existing suite stays green.

## 🙏 ONE-LINE ANSWERS (defaults pre-picked)

| # | Item | Default |
|---|---|---|
| 1 | Game mappings | igris→target · huoyuhao→spirit · gehrman→target · fool→mystery |
| 2 | Picker labels | IGRIS · HUO YUHAO "SPIRIT EYES" · GEHRMAN SPARROW · THE FOOL |
| 3 | Animation intensity | ambient-low, surge on wins/completions (same as house fx) |

> Light it with **"BUILD CASTFORGE"** — all four forged + battery + screen tour in one pass. Pairs naturally with SKINFORGE (Batman/Moon Knight/Kaiju-8 worlds land in the same sitting if you say both).
