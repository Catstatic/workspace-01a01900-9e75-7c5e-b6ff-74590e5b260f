#!/usr/bin/env python3
"""FIGFORGE collision audit: flag strokes that cross text glyph boxes.
Checks <path>/<line> primitives against every <text> box in each figure."""
import os, re, sys, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

TRE = re.compile(r'<text x="([\d.-]+)" y="([\d.-]+)" font-size="([\d.]+)"[^>]*'
                 r'text-anchor="(start|middle|end)"[^>]*>(.*?)</text>')
PRE = re.compile(r'<path d="([^"]+)" fill="([^"]*)" stroke="([^"]+)"[^>]*?/?>')
LRE = re.compile(r'<line x1="([\d.-]+)" y1="([\d.-]+)" x2="([\d.-]+)" y2="([\d.-]+)"[^>]*stroke-width="([\d.]+)"')
NUM = re.compile(r"-?\d+\.?\d*")


def flatten(d):
    pts, i, n = [], 0, len(d)
    cur = None
    while i < n:
        c = d[i]
        if c in "ML":
            xy = NUM.findall(d[i + 1: i + 60])[:2]
            x, y = float(xy[0]), float(xy[1])
            consumed = d.index(" ", i + 2) if " " in d[i + 1: i + 62] else i + 2
            # simpler: advance past the two numbers
            m = re.match(r"[ML]\s*(-?\d+\.?\d*)[ ,](-?\d+\.?\d*)", d[i:])
            i += m.end()
            if c == "M":
                cur = None
            if cur is not None:
                pts.append((cur, (x, y)))
            cur = (x, y)
        elif c == "C":
            m = re.match(r"C\s*" + r"\s*(-?\d+\.?\d*)[ ,]?" * 5 + r"(-?\d+\.?\d*)", d[i:])
            v = [float(t) for t in NUM.findall(d[i + 1: i + m.end()])[:6]]
            i += m.end()
            x0, y0 = cur
            p0 = (x0, y0)
            for k in range(1, 17):
                t = k / 16.0
                mt = 1 - t
                bx = mt**3 * x0 + 3 * mt * mt * t * v[0] + 3 * mt * t * t * v[2] + t**3 * v[4]
                by = mt**3 * y0 + 3 * mt * mt * t * v[1] + 3 * mt * t * t * v[3] + t**3 * v[5]
                pts.append((p0, (bx, by)))
                p0 = (bx, by)
            cur = (v[4], v[5])
        elif c == "Z":
            i += 1
        else:
            i += 1
    return pts


def seg_hits_rect(p, q, r):
    (x0, y0, x1, y1) = r
    # Liang-Barsky clip test
    dx, dy = q[0] - p[0], q[1] - p[1]
    t0, t1 = 0.0, 1.0
    for pp, qq in ((-dx, p[0] - x0), (dx, x1 - p[0]), (-dy, p[1] - y0), (dy, y1 - p[1])):
        if pp == 0:
            if qq < 0:
                return False
        else:
            t = qq / pp
            if pp < 0:
                t0 = max(t0, t)
            else:
                t1 = min(t1, t)
            if t0 > t1:
                return False
    return True


def audit(fid, svg):
    hits = []
    texts = []
    for m in TRE.finditer(svg):
        x, y, size = float(m.group(1)), float(m.group(2)), float(m.group(3))
        anchor, s = m.group(4), re.sub(r"<[^>]+>", "", m.group(5))
        s = s.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
        w = len(s) * 0.6 * size
        if anchor == "start":
            xA, xB = x, x + w
        elif anchor == "end":
            xA, xB = x - w, x
        else:
            xA, xB = x - w / 2, x + w / 2
        pad = 5
        texts.append((s, (xA - pad, y - 0.80 * size - pad, xB + pad, y + 0.24 * size + pad), y))
    boxes = [r for _, r, _ in texts]
    def covered(r, y):
        for o in boxes:
            if o is r:
                continue
            if o[0] <= r[0] and o[2] >= r[2] and abs(o[3] - r[3]) < 15:
                return True
        return False
    texts = [(s, r) for s, r, y in texts if not covered(r, y)]
    strokes = []
    for m in PRE.finditer(svg):
        d, fill, col = m.group(1), m.group(2), m.group(3)
        if fill not in ("none", ""):
            continue
        segs = flatten(d)
        curved = "C" in d
        if curved:
            xs = [p for seg in segs for p in seg]
            ys = [q[1] for seg in segs for q in seg]
            xs = [s[0] for s in segs] + [s[1] for s in segs]
            bbox = (min(x for x, _ in [p for seg in segs for p in seg]),
                    min(y for _, y in [p for seg in segs for p in seg]),
                    max(x for x, _ in [p for seg in segs for p in seg]),
                    max(y for _, y in [p for seg in segs for p in seg]))
            strokes.append((segs, col, bbox))
        else:
            strokes.append((segs, col, None))
    for m in LRE.finditer(svg):
        x1, y1, x2, y2, w = (float(m.group(k)) for k in range(1, 6))
        col = m.group(0)
        cm = re.search(r'stroke="(#[0-9a-f]+)"', col)
        if w < 3.5:      # ignore faint guides/grid lines
            continue
        strokes.append(([( (x1, y1), (x2, y2) )], cm.group(1) if cm else "?", None))
    for s, r in texts:
        for segs, col, bbox in strokes:
            if bbox is not None:      # curved: only when text fully inside path bbox
                if not (r[0] >= bbox[0] and r[2] <= bbox[2] and r[1] >= bbox[1] and r[3] <= bbox[3]):
                    continue
            for p, q in segs:
                if seg_hits_rect(p, q, r):
                    hits.append((s, col))
                    break
    return hits


def main():
    mods = ("cf_wave1_a", "cf_wave1_b", "cf_wave2_a", "cf_wave2_b",
            "cf_wave3_a", "cf_wave3_b")
    defs = {}
    for mod in mods:
        m = __import__(mod)
        figs = m.build() if hasattr(m, "build") else m.FIGS
        for d in figs:
            defs[d["id"]] = d["svg"]
    only = sys.argv[1:]
    total = 0
    for fid in sorted(defs):
        if only and fid not in only:
            continue
        hits = audit(fid, defs[fid])
        if hits:
            total += len(hits)
            print(fid)
            for s, col in hits:
                print("   hit %-6s on %r" % (col, s[:44]))
    print("TOTAL HITS:", total)


if __name__ == "__main__":
    main()
