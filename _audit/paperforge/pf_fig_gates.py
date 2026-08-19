#!/usr/bin/env python3
"""PAPERFORGE STAGE 2 gates — every check must pass before the sheet ships.
G1 count/uniqueness · G2 XML-valid both styles · G3 determinism
G4 palette-lock · G5 byte budget · G6 no external refs/scripts · G7 canvas lock"""
import re, sys, xml.etree.ElementTree as ET
sys.path.insert(0, "/home/user/_audit/paperforge")
from pf_figkit import PALETTES
from pf_templates import TEMPLATES

ALLOWED = set()
for pal in PALETTES.values():
    ALLOWED.update(pal.values())
HEX = re.compile(r"#[0-9a-fA-F]{3,8}")

checks = 0
fails = []

def gate(cond, label):
    global checks
    checks += 1
    if not cond:
        fails.append(label)

gate(len(TEMPLATES) == 12, "template count == 12")
ids = [t[0] for t in TEMPLATES]
gate(len(set(ids)) == len(ids), "template ids unique")

sizes = []
for tid, _t, _l, fn, params in TEMPLATES:
    for style in ("dark", "white"):
        pal = PALETTES[style]
        svg1 = fn(pal, **params)
        svg2 = fn(pal, **params)
        gate(svg1 == svg2, "%s/%s deterministic" % (tid, style))
        try:
            ET.fromstring(svg1)
            ok_xml = True
        except Exception:
            ok_xml = False
        gate(ok_xml, "%s/%s XML parses" % (tid, style))
        cols = set(HEX.findall(svg1))
        bad = cols - ALLOWED
        gate(not bad, "%s/%s palette-lock (%s)" % (tid, style, sorted(bad) if bad else ""))
        gate('viewBox="0 0 1200 700"' in svg1, "%s/%s canvas" % (tid, style))
        ext_scan = svg1.replace('xmlns="http://www.w3.org/2000/svg"', "")
        gate("<script" not in ext_scan and "http" not in ext_scan and "@import" not in ext_scan,
             "%s/%s no external/script" % (tid, style))
        badurl = [u for u in re.findall(r"url\(([^)]*)\)", svg1) if not u.startswith("#")]
        gate(not badurl, "%s/%s only-internal url()" % (tid, style))
        sizes.append((tid, style, len(svg1.encode("utf-8"))))
        gate(len(svg1.encode("utf-8")) <= 16384, "%s/%s <=16KB (%d)" % (tid, style, len(svg1.encode("utf-8"))))

mx = max(sizes, key=lambda s: s[2])
avg = sum(s[2] for s in sizes) / len(sizes)
print("figures rendered: %d (%d templates × 2 styles)" % (len(sizes), len(TEMPLATES)))
for tid, style, sz in sizes:
    print("  %-20s %-6s %5d B" % (tid, style, sz))
print("max %d B (%s/%s) · avg %d B" % (mx[2], mx[0], mx[1], avg))
if fails:
    print("\nFAILED %d/%d:" % (len(fails), checks))
    for x in fails:
        print("  ✗", x)
    sys.exit(1)
print("\n✔ FIG GATES PASSED: %d/%d checks, %d templates × 2 styles, palette-locked, deterministic." % (checks, checks, len(TEMPLATES)))
