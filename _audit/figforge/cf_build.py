#!/usr/bin/env python3
"""FIGFORGE builder + gates.
Merges wave modules -> /home/user/project/content-figs.js (window.CONTENT_FIGS)
+ cf_manifest.json. Gates: XML-valid SVG, palette lock, byte budget, anchor
presence in the real docs, ASCII-hide target presence, determinism, no exrefs."""
import json, hashlib, importlib, os, re, sys
import xml.etree.ElementTree as ET

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import cf_wave1_a, cf_wave1_b, cf_wave2_a, cf_wave2_b   # noqa
import cf_wave3_a, cf_wave3_b   # noqa

OUT = "/home/user/project/content-figs.js"
MANIFEST = os.path.join(HERE, "cf_manifest.json")
CONTENT = {}
exec(open("/home/user/project/content-data.js").read().replace(
    "window.LOCAL_CONTENT_DATA", "LOCAL_CONTENT_DATA"), {"CONTENT_DATA": None},
    CONTENT) if False else None
sys.path.insert(0, "/tmp/domt/node_modules")  # noop guard


def load_docs():
    src = open("/home/user/project/content-data.js").read()
    m = re.search(r"JSON\.parse\(\s*\n?\"(.*)\"\s*\);?\s*$", src, re.S)
    raw = m.group(1)
    # decode the JS string literal: it is a JSON-escaped string already
    return json.loads(json.loads('"%s"' % raw))


PALETTE = {"#405060", "#6ea8fe", "#d9a441", "#e5534b", "#9db2c8",
           "#6b7c8f", "#2ea043", "#7ee787", "#0b0e13"}


def norm(s):
    return re.sub(r"[^a-z0-9]+", "", s.lower())


def headings(md):
    return [norm(l.split(None, 1)[1]) for l in md.split("\n")
            if re.match(r"^#{1,4}\s+", l)]


def pres_after(md, anchor_norm):
    """list of fenced code blocks that occur after the anchor heading line."""
    lines = md.split("\n")
    start = None
    for i, l in enumerate(lines):
        m = re.match(r"^#{1,4}\s+(.+)$", l)
        if m and anchor_norm in norm(m.group(1)):
            start = i
            break
    if start is None:
        return None
    blocks, cur, inb = [], None, False
    for l in lines[start:]:
        if re.match(r"^```", l.strip()):
            if inb:
                blocks.append("\n".join(cur))
                cur, inb = None, False
            else:
                cur, inb = [], True
            continue
        if inb:
            cur.append(l)
    return blocks


def main():
    mods = [cf_wave1_a, cf_wave1_b, cf_wave2_a, cf_wave2_b, cf_wave3_a, cf_wave3_b]
    defs = [d for m in mods for d in m.build()]
    docs = load_docs()
    errors, notes = [], []

    # gate: anchors exist as headings, hide targets exist in a following pre
    for d in defs:
        md = docs.get(d["doc"])
        if md is None:
            errors.append("%s: missing doc %s" % (d["id"], d["doc"]))
            continue
        an = norm(d["anchor"])
        if not any(an in h for h in headings(md)):
            errors.append("%s: anchor '%s' not found in %s" % (d["id"], d["anchor"], d["doc"]))
        if d.get("hide"):
            blocks = pres_after(md, an) or []
            if not any(d["hide"] in b for b in blocks):
                errors.append("%s: hide target '%s' not found in a pre after anchor" % (d["id"], d["hide"]))

    # gate: svg validity, palette, size, no external refs
    sizes = []
    for d in defs:
        svg = d["svg"]
        try:
            ET.fromstring(svg)
        except Exception as e:
            errors.append("%s: XML invalid: %s" % (d["id"], e))
        bad = set(re.findall(r"#[0-9a-fA-F]{3,6}", svg)) - PALETTE
        if bad:
            errors.append("%s: palette breach %s" % (d["id"], sorted(bad)))
        probe = svg.replace('xmlns="http://www.w3.org/2000/svg"', "")
        if re.search(r"https?:|<script|image\s|url\((?!#)", probe):
            errors.append("%s: external reference in svg" % d["id"])
        sizes.append(len(svg))
        if len(svg) > 30720:
            errors.append("%s: svg over 30KB budget (%d)" % (d["id"], len(svg)))
        if "$" in svg:
            errors.append("%s: KaTeX-safety breach ('$' inside svg)" % d["id"])

    payload = {"v": 2, "wave": 3, "docs": {}}
    for d in defs:
        payload["docs"].setdefault(d["doc"], []).append(
            dict(id=d["id"], anchor=d["anchor"], hide=d.get("hide"), skip=d.get("skip", 0),
                 title=d["title"], cap=d["cap"], svg=d["svg"]))
    js = ("/* ============================================================\n"
          "   FIGFORGE waves 1-3 - content-vault inline figure fleet (AI-GENERATED).\n"
          "   Deterministic parametric SVGs (dark palette lock). Companion of the\n"
          "   ROUND 32 engine; consumed by window.CONTENT_FIGS.\n"
          "   ============================================================ */\n"
          "window.CONTENT_FIGS = " + json.dumps(payload, ensure_ascii=False) + ";\n")

    h_new = hashlib.sha256(js.encode()).hexdigest()
    if os.path.exists(OUT):
        h_old_on_disk = hashlib.sha256(open(OUT, "rb").read()).hexdigest()
        notes.append("rebuild: hash %s (prev %s)" % (h_new[:12], h_old_on_disk[:12]))
    open(OUT, "w", encoding="utf-8").write(js)

    # determinism: rebuild and compare
    defs2 = [d for m in mods for d in m.build()]
    same = all(a["svg"] == b["svg"] for a, b in zip(defs, defs2))
    if not same or len(defs) != len(defs2):
        errors.append("determinism check failed")

    manifest = dict(figures=[dict(id=d["id"], doc=d["doc"], bytes=len(d["svg"])) for d in defs],
                    total=len(defs), bytes=sum(sizes), avg=sum(sizes) // len(sizes),
                    max=max(sizes), sha256=h_new)
    json.dump(manifest, open(MANIFEST, "w"), indent=1)

    print("FIGS: %d across %d docs | js %d bytes | svg avg %d B max %d B"
          % (len(defs), len(payload["docs"]), len(js), manifest["avg"], manifest["max"]))
    per = {}
    for d in defs:
        per[d["doc"]] = per.get(d["doc"], 0) + 1
    for k, v in sorted(per.items()):
        print("  %2d  %s" % (v, k))
    for n in notes:
        print(" ", n)
    if errors:
        print("\nGATE FAILURES:")
        for e in errors:
            print("  ✗", e)
        sys.exit(1)
    print("✔ FIGFORGE GATES PASSED — %d/%d (xml · palette · budget · anchors · hides · determinism · no-exref)"
          % (len(defs), len(defs)))


if __name__ == "__main__":
    main()
