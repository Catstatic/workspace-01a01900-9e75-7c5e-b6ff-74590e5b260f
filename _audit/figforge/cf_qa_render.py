#!/usr/bin/env python3
"""FIGFORGE QA raster: render chosen figure ids (or ALL) to /tmp PNGs."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import cairosvg

defs = {}
for mod in ("cf_wave1_a", "cf_wave1_b", "cf_wave2_a", "cf_wave2_b",
            "cf_wave3_a", "cf_wave3_b"):
    m = __import__(mod)
    build = getattr(m, "build", None)
    figs = build() if build else m.FIGS
    for d in figs:
        defs[d["id"]] = d

want = sys.argv[1:]
if not want or want == ["ALL"]:
    want = list(defs)
missing = [w for w in want if w not in defs]
if missing:
    print("MISSING:", missing); sys.exit(1)
os.makedirs("/home/user/_audit/figforge/qa", exist_ok=True)
for w in want:
    out = "/home/user/_audit/figforge/qa/%s.png" % w
    cairosvg.svg2png(bytestring=defs[w]["svg"].encode(),
                     write_to=out, output_width=1100, output_height=640)
    print(out, len(defs[w]["svg"]))
