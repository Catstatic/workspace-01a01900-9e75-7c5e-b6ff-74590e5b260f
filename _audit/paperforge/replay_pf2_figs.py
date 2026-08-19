#!/usr/bin/env python3
"""S4 figure bake — MERGES Legion II figures into figs_live.json without
touching the Legion I contour entry (both banks read this file)."""
import json, sys
sys.path.insert(0, "/home/user/_audit/paperforge")
from pf_figkit import PALETTES
from pf_templates import TEMPLATES

NEEDED = {
  "qm-well-states": dict(levels=3),
  "th-carnot-pv": dict(),
  "el-opamp-inverting": dict(),
  "am-zeeman-triplet": dict(),
}
reg = {t[0]: t for t in TEMPLATES}
out = json.load(open("/home/user/_audit/paperforge/figs_live.json"))
for tid, params in NEEDED.items():
    tid_, title, lane, fn, default = reg[tid]
    svg = fn(PALETTES["dark"], **params)
    out[tid] = svg
    print("baked", tid, len(svg.encode()), "bytes")
json.dump(out, open("/home/user/_audit/paperforge/figs_live.json", "w"))
print("figs_live.json:", len(out), "entries")
# render QA rasters
import cairosvg
for tid in NEEDED:
    cairosvg.svg2png(bytestring=out[tid].encode(), write_to=f"/tmp/s4fig_{tid}.png", output_width=600)
print("rasters in /tmp/s4fig_*.png")
