#!/usr/bin/env python3
"""Bake the S2 factory figures referenced by Legion I questions into
_audit/paperforge/figs_live.json (template id -> dark-theme SVG string)."""
import json, sys
sys.path.insert(0, "/home/user/_audit/paperforge")
from pf_figkit import PALETTES
from pf_templates import TEMPLATES

NEEDED = {"mp-contour-poles": dict(poles=2)}
reg = {t[0]: t for t in TEMPLATES}
out = {}
for tid, params in NEEDED.items():
    tid_, title, lane, fn, default = reg[tid]
    svg = fn(PALETTES["dark"], **params)
    out[tid] = svg
    print("baked", tid, len(svg.encode()), "bytes")
json.dump(out, open("/home/user/_audit/paperforge/figs_live.json", "w"))
print("figs_live.json written")
