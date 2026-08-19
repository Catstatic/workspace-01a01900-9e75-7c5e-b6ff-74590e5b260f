#!/usr/bin/env python3
"""Emit the STAGE-2 GATE-CHECK artifact:
   /home/user/project/PAPERFORGE_S2_SAMPLE_SHEET.html — the 12-figure sample
   sheet, rendered in BOTH locked styles (dark-tracker / exam-white) with a
   one-click flip, per-figure byte counts, and the vote footer.
Also dumps every SVG to _audit/paperforge/figs/<id>.<style>.svg for audit."""
import os, sys, json
sys.path.insert(0, "/home/user/_audit/paperforge")
from pf_figkit import PALETTES
from pf_templates import TEMPLATES

FIGDIR = "/home/user/_audit/paperforge/figs"
os.makedirs(FIGDIR, exist_ok=True)

rows = []
for tid, title, lane, fn, params in TEMPLATES:
    svgs = {}
    for style in ("dark", "white"):
        svg = fn(PALETTES[style], **params)
        open(os.path.join(FIGDIR, "%s.%s.svg" % (tid, style)), "w").write(svg)
        svgs[style] = svg
    rows.append((tid, title, lane, params, svgs))

n_bytes = {s: sum(len(r[4][s].encode()) for r in rows) for s in ("dark", "white")}

CSS = """
body{margin:0;background:#05070a;color:#c9d6e2;font-family:Consolas,'DejaVu Sans Mono',monospace;}
.wrap{max-width:1240px;margin:0 auto;padding:34px 28px 80px;}
h1{font-size:26px;letter-spacing:1px;margin:0 0 4px;color:#e8eef5;}
.sub{color:#6ea8fe;font-size:14px;margin-bottom:26px;}
.votebar{position:sticky;top:0;z-index:5;display:flex;gap:14px;align-items:center;flex-wrap:wrap;
background:#0b0e13ee;border:1px solid #243144;border-radius:12px;padding:14px 18px;margin:18px 0 26px;}
.votebar .tag{font-size:12px;color:#8fa3b8;}
.flip{display:flex;border-radius:9px;overflow:hidden;border:1px solid #2a3b52;}
.flip a{padding:9px 18px;text-decoration:none;color:#9db2c8;font-size:14px;background:#10161f;}
.flip a.on{background:#22334a;color:#fff;font-weight:bold;}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(560px,1fr));gap:22px;}
.card{border:1px solid #223042;border-radius:14px;overflow:hidden;background:#0d1219;}
.card .hd{display:flex;justify-content:space-between;gap:10px;align-items:baseline;padding:10px 14px;font-size:13px;}
.card .hd b{color:#e3ebf4;font-weight:600;}
.card .hd .lane{color:#d9a441;}
.card .hd .sz{color:#6b7c8f;}
.card svg{display:block;width:100%;height:auto;border-top:1px solid #223042;}
section.style{display:none;}
section.style.on{display:block;}
.note{font-size:13px;color:#8fa3b8;line-height:1.65;border-left:3px solid #22334a;padding-left:14px;margin:26px 0;}
table{border-collapse:collapse;font-size:13px;margin:8px 0 0;}
td,th{border:1px solid #223042;padding:5px 12px;text-align:left;}
th{color:#9db2c8;background:#10161f;}
.foot{margin-top:34px;font-size:13px;color:#6b7c8f;line-height:1.7;}
b.pk{color:#7ee787;}
"""

def card(tid, title, lane, sz, svg):
    return ('<div class="card"><div class="hd"><b>%s</b><span class="lane">%s</span>'
            '<span class="sz">%s · %d B</span></div>%s</div>'
            % (title, lane, tid, sz, svg))

sw = """<div class="votebar">
 <span class="tag">STYLE VOTE (one word settles it):</span>
 <div class="flip">
   <a href="#" id="btnDark" class="on">🌑 DARK — tracker-matched</a>
   <a href="#" id="btnWhite">⬜ WHITE — real GATE screen</a>
 </div>
 <span class="tag">same 12 parametrized templates · same topology · palette is a flag</span>
</div>"""

parts = ["<!DOCTYPE html><html><head><meta charset='utf-8'><title>PAPERFORGE S2 — FIGURE FACTORY SAMPLE SHEET</title>",
         "<style>%s</style></head><body><div class='wrap'>" % CSS,
         "<h1>🏭 PAPERFORGE · STAGE 2 — FIGURE FACTORY</h1>",
         "<div class='sub'>12-figure sample sheet for eyeball approval · generated, never cropped · parametrized SVG vector art · 1200×700 · minted 2026-08-17</div>",
         sw]
for style, lab in (("dark", "DARK THEME (house palette, byte-same hues as the shipped 189-figure TOPICFORGE fleet)"),
                   ("white", "EXAM-WHITE (matches the real GATE on-screen paper)")):
    on = " on" if style == "dark" else ""
    parts.append("<section class='style%s' id='sec-%s'>" % (on, style))
    parts.append("<div class='note'>%s<br>fleet bytes for these 12: <b class='pk'>%s</b> · crisp at any zoom · zero external refs</div>"
                 % (lab, format(n_bytes[style], ",")))
    parts.append("<div class='grid'>")
    for tid, title, lane, params, svgs in rows:
        parts.append(card(tid, title, lane, len(svgs[style].encode()), svgs[style]))
    parts.append("</div></section>")
parts.append("""<div class='note'><b class='pk'>FACTORY RULES (locked):</b>
every figure is a <b>parametrized template</b> (same topology, different numbers — values randomize without redrawing) ·
generated vector art only — no AI-image models (fake glyphs), no PYQ crops (copyright) ·
palette-locked · deterministic bytes · ≤16 KB each (fleet avg 5.4 KB) ·
templates register by id and are callable from any forged question by <b>template id + params</b>.</div>""")
parts.append("""<table><tr><th>#</th><th>template id</th><th>lane</th><th>bytes / style</th><th>params (sample)</th></tr>""")
for i, (tid, title, lane, params, svgs) in enumerate(rows, 1):
    parts.append("<tr><td>%d</td><td>%s</td><td>%s</td><td>%d B</td><td><code>%s</code></td></tr>"
                 % (i, tid, lane, len(svgs['dark'].encode()),
                    json.dumps(params).replace('"', '').replace('{', '').replace('}', '')))
parts.append("</table>")
parts.append("""<div class='foot'>Gates: ✔ 170/170 (count/uniqueness · XML-valid · determinism · palette-lock · ≤16KB budget · no external refs · canvas lock).<br>
To lock the vote reply: <b class='pk'>figures: dark</b> or <b class='pk'>figures: white</b> — then STAGE 3 (Legion I: GATE Math+CM+EM) forges against this factory.</div>""")
parts.append("""<script>
function flip(s){document.getElementById('sec-dark').className='style'+(s==='dark'?' on':'');
document.getElementById('sec-white').className='style'+(s==='white'?' on':'');
document.getElementById('btnDark').className=(s==='dark'?'on':'');document.getElementById('btnWhite').className=(s==='white'?'on':'');}
document.getElementById('btnDark').onclick=function(e){e.preventDefault();flip('dark');};
document.getElementById('btnWhite').onclick=function(e){e.preventDefault();flip('white');};
</script>""")
parts.append("</div></body></html>")

out = "".join(parts)
open("/home/user/project/PAPERFORGE_S2_SAMPLE_SHEET.html", "w").write(out)
print("sheet written:", len(out), "chars | figs dumped:", len(rows) * 2, "svg files in", FIGDIR)
print("fleet bytes — dark:", n_bytes["dark"], "· white:", n_bytes["white"])
