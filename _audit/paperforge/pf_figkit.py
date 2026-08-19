#!/usr/bin/env python3
"""PAPERFORGE STAGE 2 — FIGURE FACTORY core kit.
Parametrized SVG vector construction, per op law:
  generate, never crop · deterministic · compact bytes · palette-locked
  same topology, different numbers = reusable templates.
Dark palette is byte-identical to the shipped TOPICFORGE fleet palette."""
import math

CELL = (1200, 700)  # plan-locked canvas ~1200x700

PALETTES = {
    # dark = tracker-matched (TOPICFORGE house palette, exact)
    "dark": dict(bg="#0b0e13", ink="#9db2c8", axis="#405060", grid="#405060",
                 a1="#6ea8fe", a2="#d9a441", a3="#e5534b", a4="#2ea043",
                 a5="#7ee787", muted="#6b7c8f", dash="#6b7c8f"),
    # white = real-GATE-screen exam style
    "white": dict(bg="#ffffff", ink="#1c2733", axis="#2b2b2b", grid="#d0d7de",
                  a1="#1559c7", a2="#9a6a00", a3="#c0392b", a4="#1e7e34",
                  a5="#1e7e34", muted="#57606a", dash="#8b949e"),
}

def f(v):
    """deterministic float format (2dp, no -0)"""
    s = "%.2f" % v
    if s == "-0.00":
        s = "0.00"
    return s.rstrip("0").rstrip(".") if "." in s else s

def esc(t):
    return (str(t).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))

class Fig:
    def __init__(self, pal):
        self.p = pal
        self.parts = []
        self.defs = []
        self._marker_added = set()

    # -- primitives (all attribute style, no inline css strings) -------------
    def raw(self, s):
        self.parts.append(s)

    def line(self, x1, y1, x2, y2, stroke=None, w=2, dash=None, cap="round"):
        d = ' stroke-dasharray="%s"' % dash if dash else ""
        self.parts.append('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="%s"%s stroke-linecap="%s"/>'
                          % (f(x1), f(y1), f(x2), f(y2), stroke or self.p["ink"], w, d, cap))

    def path(self, d, stroke=None, w=2, fill="none", dash=None, op=None):
        dd = ' stroke-dasharray="%s"' % dash if dash else ""
        o = ' opacity="%s"' % op if op else ""
        self.parts.append('<path d="%s" fill="%s" stroke="%s" stroke-width="%s" stroke-linejoin="round" stroke-linecap="round"%s%s/>'
                          % (d, fill, stroke or self.p["ink"], w, dd, o))

    def poly(self, pts, stroke=None, w=2, fill="none", dash=None, close=False, op=None):
        d = "M" + " L".join("%s %s" % (f(x), f(y)) for x, y in pts) + (" Z" if close else "")
        self.path(d, stroke, w, fill, dash, op)

    def circle(self, cx, cy, r, stroke=None, w=2, fill="none"):
        self.parts.append('<circle cx="%s" cy="%s" r="%s" fill="%s" stroke="%s" stroke-width="%s"/>'
                          % (f(cx), f(cy), f(r), fill, stroke or self.p["ink"], w))

    def dot(self, cx, cy, r=5, fill=None):
        self.parts.append('<circle cx="%s" cy="%s" r="%s" fill="%s"/>'
                          % (f(cx), f(cy), f(r), fill or self.p["ink"]))

    def cross(self, cx, cy, r=7, stroke=None, w=3):
        c = stroke or self.p["a3"]
        self.line(cx - r, cy - r, cx + r, cy + r, c, w)
        self.line(cx - r, cy + r, cx + r, cy - r, c, w)

    def rect(self, x, y, w, h, stroke=None, sw=2, fill="none", dash=None, rx=0):
        d = ' stroke-dasharray="%s"' % dash if dash else ""
        self.parts.append('<rect x="%s" y="%s" width="%s" height="%s" rx="%s" fill="%s" stroke="%s" stroke-width="%s"%s/>'
                          % (f(x), f(y), f(w), f(h), rx, fill, stroke or self.p["ink"], sw, d))

    def text(self, x, y, s, size=26, fill=None, anchor="middle", rotate=None, weight=None, style=None):
        a = ""
        if rotate is not None:
            a += ' transform="rotate(%s %s %s)"' % (f(rotate), f(x), f(y))
        if weight:
            a += ' font-weight="%s"' % weight
        if style:
            a += ' font-style="%s"' % style
        self.parts.append('<text x="%s" y="%s" font-size="%s" fill="%s" text-anchor="%s" font-family="Consolas,DejaVu Sans Mono,Menlo,monospace"%s>%s</text>'
                          % (f(x), f(y), size, fill or self.p["ink"], anchor, a, esc(s)))

    # -- composites ----------------------------------------------------------
    def marker(self, color):
        mid = "m" + color.replace("#", "")
        if mid in self._marker_added:
            return mid
        self._marker_added.add(mid)
        self.defs.append('<marker id="%s" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="%s"/></marker>'
                         % (mid, color))
        return mid

    def arrow(self, x1, y1, x2, y2, stroke=None, w=3, dash=None):
        c = stroke or self.p["ink"]
        mid = self.marker(c)
        d = ' stroke-dasharray="%s"' % dash if dash else ""
        self.parts.append('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="%s" stroke-linecap="round" marker-end="url(#%s)"%s/>'
                          % (f(x1), f(y1), f(x2), f(y2), c, w, mid, d))

    def arrow_path(self, d, stroke=None, w=3, dash=None):
        c = stroke or self.p["ink"]
        mid = self.marker(c)
        dd = ' stroke-dasharray="%s"' % dash if dash else ""
        self.parts.append('<path d="%s" fill="none" stroke="%s" stroke-width="%s" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#%s)"%s/>'
                          % (d, c, w, mid, dd))

    def axes(self, ox, oy, w, h, xlab=None, ylab=None, wpx=None):
        """simple L axes: origin (ox,oy), x to the right, y up. arrows at ends."""
        self.arrow(ox, oy, ox + (wpx or w), oy, self.p["axis"], 3)
        self.arrow(ox, oy, ox, oy - h, self.p["axis"], 3)
        if xlab:
            self.text(ox + (wpx or w) + 14, oy + 8, xlab, 26, self.p["ink"], "start")
        if ylab:
            self.text(ox - 14, oy - h - 14, ylab, 26, self.p["ink"], "end")

    def zigzag(self, x1, y1, x2, y2, teeth=6, amp=16, stroke=None, w=3):
        """resistor zigzag between two points (horizontal/vertical/general)."""
        dx, dy = x2 - x1, y2 - y1
        L = math.hypot(dx, dy)
        ux, uy = dx / L, dy / L
        px, py = -uy, ux
        n = teeth * 2
        pts = [(x1, y1)]
        for i in range(1, n):
            t = i / n
            bx, by = x1 + dx * t, y1 + dy * t
            off = amp if i % 2 == 1 else -amp
            pts.append((bx + px * off, by + py * off))
        pts.append((x2, y2))
        self.poly(pts, stroke or self.p["ink"], w)

    def ground(self, x, y, stroke=None, w=3):
        c = stroke or self.p["ink"]
        self.line(x, y, x, y + 26, c, w)
        for i, ww in enumerate([34, 22, 10]):
            self.line(x - ww, y + 26 + i * 11, x + ww, y + 26 + i * 11, c, w)

    def hatch(self, x1, y1, dx, dy, n, ln=26, stroke=None, w=2):
        """n short parallel ticks starting at (x1,y1) stepping (dx,dy)."""
        import math as _m
        L = _m.hypot(dx, dy) or 1
        ux, uy = dx / L, dy / L
        for i in range(n):
            x, y = x1 + ux * i * (L / max(n - 1, 1)), y1 + uy * i * (L / max(n - 1, 1))
            self.line(x, y, x + (-uy) * ln, y + ux * ln, stroke or self.p["muted"], w)

    def emit(self):
        defs = "<defs>%s</defs>" % "".join(self.defs) if self.defs else ""
        body = '<rect x="0" y="0" width="1200" height="700" fill="%s"/>' % self.p["bg"]
        return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700" '
                'font-family="Consolas,DejaVu Sans Mono,Menlo,monospace">%s%s%s</svg>'
                % (defs, body, "".join(self.parts)))
