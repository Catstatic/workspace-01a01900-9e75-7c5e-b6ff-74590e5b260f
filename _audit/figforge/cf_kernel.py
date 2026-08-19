#!/usr/bin/env python3
"""FIGFORGE kernel — content-vault inline figures.
Extends the PAPERFORGE Fig kit (same palette-lock, same visual language)
with plot/axes helpers so true math curves are drawn, not clipart."""
import sys, math
sys.path.insert(0, "/home/user/_audit/paperforge")
from pf_figkit import Fig, PALETTES, f, esc   # noqa

PAL = PALETTES["dark"]          # house default: dark locked
W, H = 1200, 700


class Plot(Fig):
    """A Fig plus a math->px plotting frame."""

    def __init__(self):
        super().__init__(PAL)

    # -- frame: left/top/right/bottom pixel box ------------------------------
    def frame(self, L=120, T=70, R=1160, B=600, xlab="", ylab="", xunit="", yunit=""):
        self.L, self.T, self.R, self.B = L, T, R, B
        self.xa = self.xb = self.ya = self.yb = None
        self._xlab, self._ylab = xlab, ylab
        self._xunit, self._yunit = xunit, yunit

    def domain(self, xa, xb, ya, yb):
        self.xa, self.xb, self.ya, self.yb = xa, xb, ya, yb

    def mx(self, x):
        return self.L + (x - self.xa) / (self.xb - self.xa) * (self.R - self.L)

    def my(self, y):
        return self.B - (y - self.ya) / (self.yb - self.ya) * (self.B - self.T)

    # -- axes furniture ------------------------------------------------------
    def axes(self, xticks=None, yticks=None, grid=True, box=False, xlab=None, ylab=None):
        """xticks/yticks: list of (value, label). grid: dashed light lines."""
        p = self.p
        if grid and xticks:
            for v, _ in xticks:
                self.line(self.mx(v), self.T, self.mx(v), self.B, p["muted"], 1, dash="3 7")
        if grid and yticks:
            for v, _ in yticks:
                self.line(self.L, self.my(v), self.R, self.my(v), p["muted"], 1, dash="3 7")
        if box:
            self.rect(self.L, self.T, self.R - self.L, self.B - self.T, p["axis"], 3)
        else:
            self.arrow(self.L, self.B, self.R + 30, self.B, p["axis"], 3)
            self.arrow(self.L, self.B, self.L, self.T - 30, p["axis"], 3)
        lx = xlab if xlab is not None else self._xlab
        ly = ylab if ylab is not None else self._ylab
        if lx:
            self.text(self.R + 22, self.B + 26, lx, 28, p["ink"], "end")
        if ly:
            self.text(self.L - 72, (self.T + self.B) / 2, ly, 26, p["ink"], "middle", rotate=-90)
        for v, lab in (xticks or []):
            x = self.mx(v)
            self.line(x, self.B, x, self.B + 10, p["axis"], 3)
            if lab:
                self.text(x, self.B + 40, lab, 24, p["ink"])
        for v, lab in (yticks or []):
            y = self.my(v)
            self.line(self.L - 10, y, self.L, y, p["axis"], 3)
            if lab:
                self.text(self.L - 20, y + 8, lab, 24, p["ink"], "end")

    # -- data ----------------------------------------------------------------
    def curve(self, fxy, n=300, stroke=None, w=4, dash=None):
        """fxy: function over [xa,xb] -> y (may return None to break the path)."""
        pts, segs, cur = None, [], []
        for i in range(n + 1):
            x = self.xa + (self.xb - self.xa) * i / n
            try:
                y = fxy(x)
            except Exception:
                y = None
            if y is None or y != y or abs(y) == float("inf"):
                if len(cur) > 1:
                    segs.append(cur)
                cur = []
                continue
            cur.append((self.mx(x), self.my(y)))
        if len(cur) > 1:
            segs.append(cur)
        for c in segs:
            self.poly(c, stroke or self.p["a1"], w, dash=dash)

    def seg(self, pts, stroke=None, w=4, dash=None, closed=False, fill="none", op=None):
        """math-coords polyline."""
        self.poly([(self.mx(x), self.my(y)) for x, y in pts], stroke or self.p["a1"],
                  w, dash=dash, close=closed, fill=fill, op=op)

    def vline(self, x, stroke=None, w=2, dash="8 8", y0=None, y1=None):
        self.line(self.mx(x), self.my(self.ya if y0 is None else y0),
                  self.mx(x), self.my(self.yb if y1 is None else y1),
                  stroke or self.p["muted"], w, dash=dash)

    def hline(self, y, stroke=None, w=2, dash="8 8", x0=None, x1=None):
        self.line(self.mx(self.xa if x0 is None else x0), self.my(y),
                  self.mx(self.xb if x1 is None else x1), self.my(y),
                  stroke or self.p["muted"], w, dash=dash)

    def shade_v(self, x0, x1, fill=None, op=0.13):
        X0, X1 = self.mx(x0), self.mx(x1)
        self.parts.append('<rect x="%s" y="%s" width="%s" height="%s" fill="%s" opacity="%s"/>'
                          % (f(min(X0, X1)), f(self.T), f(abs(X1 - X0)), f(self.B - self.T),
                             fill or self.p["a4"], op))

    def mtext(self, x, y, s, size=26, fill=None, anchor="middle", rotate=None, weight=None, style=None):
        self.text(self.mx(x), self.my(y), s, size, fill or self.p["ink"], anchor, rotate, weight, style)

    def mdot(self, x, y, r=6, fill=None):
        self.dot(self.mx(x), self.my(y), r, fill or self.p["a2"])

    def marrows(self, x1, y1, x2, y2, stroke=None, w=3):
        self.arrow(self.mx(x1), self.my(y1), self.mx(x2), self.my(y2), stroke or self.p["ink"], w)

    # -- title/legend ----------------------------------------------------------
    def title(self, s, sub=None):
        self.text(600, 42, s, 34, self.p["ink"], "middle", weight="bold")
        if sub:
            self.text(600, 82, sub, 24, self.p["muted"])

    def legend(self, items, x=None, y=110, size=24):
        """items: [(colorkey, label, dash or '')] drawn top-right column."""
        x = x if x is not None else self.R - 14
        for i, (ck, lab, dash) in enumerate(items):
            yy = y + i * (size + 14)
            self.line(x - 190, yy - size * 0.32, x - 150, yy - size * 0.32,
                      self.p[ck] if ck in self.p else ck, 5, dash=dash or None)
            self.text(x - 140, yy, lab, size, self.p["ink"], "start")

    def note(self, x, y, s, size=24, fill=None, anchor="start"):
        self.text(x, y, s, size, fill or self.p["muted"], anchor)
