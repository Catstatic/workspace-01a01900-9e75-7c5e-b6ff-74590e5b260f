#!/usr/bin/env python3
"""FIGFORGE wave-2 part A: nuclear x4, condensed matter x5, classical x2."""
import math
from cf_kernel import Plot, PAL

P = PAL
NUC = "nuclear and particle physics.md"
CM = "condensed matter.md"
CL = "classical mechanics.md"
FIGS = []


def reg(doc, fid, anchor, hide, skip, title, cap, svg):
    FIGS.append(dict(doc=doc, id=fid, anchor=anchor, hide=hide, skip=skip,
                     title=title, cap=cap, svg=svg))


# ------------------------------------------------------- nuclear 1: deformation shapes
def nuc_shape():
    pl = Plot()
    def ell(cx, cy, a, b, col, lab, sub):
        pts = [(cx + a * math.cos(t), cy + b * math.sin(t)) for t in
               [2 * math.pi * i / 90 for i in range(91)]]
        pl.poly(pts, col, 4, close=True)
        # symmetry axis z: vertical dashed line through the shape
        pl.line(cx, cy - b - 16, cx, cy + b + 16, P["muted"], 2, dash="4 8")
        pl.text(cx + 9, cy - b - 24, "z", 20, P["muted"], "start")
        pl.text(cx, cy + max(a, b) + 46, lab, 27, P["ink"], "middle", weight="bold")
        pl.text(cx, cy + max(a, b) + 82, sub, 21, P["muted"], "middle")
    ell(230, 320, 90, 190, P["a1"], "PROLATE", "Q > 0  (cigar, long axis)")
    ell(600, 320, 130, 130, P["muted"], "SPHERICAL", "Q = 0  (magic shells)")
    ell(970, 320, 190, 90, P["a3"], "OBLATE", "Q < 0  (pancake)")
    pl.text(110, 640, "Dashed line = symmetry axis z.  Prolate: charge along z.  Oblate: flattened along z.", 21, P["muted"], "start")
    pl.text(110, 60, "NUCLEAR SHAPES & THE QUADRUPOLE MOMENT SIGN", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ------------------------------------------------------- nuclear 2: deuteron well
def nuc_deuteron():
    pl = Plot()
    pl.frame(150, 90, 1160, 600, xlab="r", ylab="V(r)")
    pl.domain(0, 10, -6.5, 1.8)
    pl.axes(xticks=[(2.1, "R = 2.1 fm"), (5, ""), (8, "")], yticks=[(-5, "-V0"), (-2.225, "")])
    pl.seg([(0, -5), (2.1, -5), (2.1, 0), (10, 0)], P["axis"], 5)
    pl.hline(-2.225, P["a2"], 3, "10 6")
    pl.mtext(9.8, -2.6, "single bound state, E = -2.225 MeV", 20, P["a2"], "end")
    # wavefunction plotted on its energy baseline: sine hump inside (KR ~ pi/2,
    # just-barely-bound), matched exponential leakage outside
    K = 1.575 / 2.1
    def u(r):
        if r <= 2.1:
            return math.sin(K * r)
        return math.sin(K * 2.1) * math.exp(-0.55 * (r - 2.1))
    pl.curve(lambda r: -2.225 + 2.5 * u(r), 500, P["a1"], 4)
    pl.vline(2.1, P["muted"], 2, "5 7", y0=-6.5, y1=0)
    pl.mtext(0.35, 0.4, "u(r): sine hump inside", 21, P["a1"], "start")
    pl.mtext(3.6, -3.9, "exponential tail OUTSIDE (loose binding)", 21, P["a1"], "start")
    pl.mtext(0.35, -4.6, "depth-range:  pi^2 hbar^2 / 4 mu R^2 =< V0  (just barely)", 20, P["muted"], "start")
    pl.mtext(4.6, 1.1, "no excited bound states - triplet np only", 21, P["a4"], "start")
    pl.text(150, 52, "DEUTERON - THE SHALLOWEST BOUND NUCLEUS", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ------------------------------------------------------- nuclear 3: shell model levels
def nuc_shell():
    pl = Plot()
    pl.frame(100, 80, 1160, 620, xlab="", ylab="energy")
    pl.domain(0, 10, -1.25, 10.4)
    pl.axes(xticks=[], yticks=[], box=False)
    # LEFT: harmonic-oscillator N shells (degenerate)
    pl.mtext(4.55, 9.85, "HO shells (all degenerate)", 20, P["muted"], "end")
    ho = [("1s", 0.6, "2"), ("1p", 1.9, "8"), ("1d 2s", 3.3, "20"), ("1f 2p", 4.8, "40"),
          ("1g 2d 3s", 6.4, "70"), ("1h 2f 3p", 8.1, "112")]
    for lab, y, tot in ho:
        pl.seg([(1.0, y), (3.9, y)], P["a1"], 8)
        pl.mtext(2.45, y + 0.22, lab, 19, P["ink"])
        pl.mtext(0.85, y + 0.06, tot, 20, P["a2"], "end")
    for y in (2.65, 4.1, 5.6, 7.25, 8.9):
        pl.seg([(0.7, y), (4.2, y)], P["muted"], 1, dash="3 7")
    pl.mtext(2.55, -0.62, "HO gaps: 2, 8, 20, 40 (wrong past 20)", 17, P["muted"])
    pl.seg([(4.75, -0.8), (4.75, 9.6)], P["muted"], 2, dash="6 8")
    pl.mtext(5.05, 9.85, "+ spin-orbit:  j = l +/- 1/2", 20, P["muted"], "start")
    # RIGHT: split levels (energy, label, occupancy colour, magic subtotal)
    rows = [("1s1/2", 0.45, P["a1"], "2"),
            ("1p3/2", 1.2, P["a1"], None), ("1p1/2", 1.5, P["a1"], "8"),
            ("1d5/2", 2.4, P["a2"], None), ("2s1/2", 2.7, P["a2"], None), ("1d3/2", 3.0, P["a2"], "20"),
            ("1f7/2", 3.9, P["a3"], "28"),
            ("2p3/2", 4.8, P["a4"], None), ("1f5/2", 5.1, P["a4"], None), ("2p1/2", 5.4, P["a4"], None), ("1g9/2", 5.7, P["a4"], "50"),
            ("1g7/2", 6.6, P["a5"], None), ("2d5/2", 6.9, P["a5"], None), ("3s1/2", 7.2, P["a5"], None), ("2d3/2", 7.5, P["a5"], None), ("1h11/2", 7.8, P["a5"], "82"),
            ("1h9/2", 8.7, P["a3"], None), ("2f7/2", 9.0, P["a3"], None), ("3p3/2", 9.3, P["a3"], "126")]
    for lab, y, col, magic in rows:
        pl.seg([(5.7, y), (8.4, y)], col, 4)
        pl.mtext(5.55, y + 0.05, lab, 15, P["ink"], "end")
        if magic:
            pl.mtext(8.55, y + 0.06, magic, 20, P["a2"], "start")
    for y in (0.82, 1.95, 3.45, 4.35, 6.15, 8.25):
        pl.seg([(5.4, y), (8.75, y)], P["a2"], 2, dash="3 7")
    pl.mtext(7.0, -0.62, "intruders: 2, 8, 20, 28, 50, 82, 126 = MAGIC", 17, P["a2"])
    pl.text(100, 46, "SHELL MODEL - WHERE MAGIC NUMBERS COME FROM", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ------------------------------------------------------- nuclear 4: Breit-Wigner
def nuc_breit():
    pl = Plot()
    pl.frame(190, 90, 1160, 600, xlab="E", ylab="sigma(E)")
    pl.domain(-6, 6, 0, 1.25)
    E0, G = 0.0, 2.0
    bw = lambda E: 1.0 / ((E - E0) ** 2 + (G / 2) ** 2)
    n0 = bw(0)
    pl.axes(xticks=[(-1, "E0 - G/2"), (0, "E0"), (1, "E0 + G/2")], yticks=[(1.0, "max"), (0.5, "1/2")])
    pl.curve(lambda E: bw(E) / n0, 700, P["a1"], 5)
    pl.hline(0.5, P["a2"], 2, "8 7")
    pl.vline(-1, P["a2"], 2, "6 7", y0=0, y1=0.5)
    pl.vline(1, P["a2"], 2, "6 7", y0=0, y1=0.5)
    pl.marrows(-1, 0.56, 1, 0.56, P["a2"], 3)
    pl.marrows(1, 0.56, -1, 0.56, P["a2"], 3)
    pl.mtext(0, 0.64, "FWHM = Gamma", 23, P["a2"])
    pl.mdot(0, 1.0, 7, P["a3"])
    pl.mtext(0.35, 1.09, "resonance peak  ~  1 / (E-E0)^2 + (G/2)^2", 22, P["a3"], "start")
    pl.mtext(5.85, 0.42, "compound nucleus", 20, P["muted"], "end")
    pl.mtext(5.85, 0.22, "tau = hbar / Gamma", 20, P["muted"], "end")
    pl.text(190, 52, "BREIT-WIGNER SINGLE-LEVEL RESONANCE", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ------------------------------------------------------- CM 5: HCP cell
def cm_hcp():
    pl = Plot()
    def hexag(cx, cy, r, col, dash=None):
        pts = [(cx + r * math.cos(math.radians(30 + 60 * i)), cy + r * math.sin(math.radians(30 + 60 * i)) / 2.2) for i in range(7)]
        pl.poly(pts, col, 3, close=True, dash=dash)
    def atom(x, y, r, col):
        pl.circle(x, y, r, col, 3, fill=P["bg"])
    # base hexagon
    bxc, byc, rr = 420, 470, 190
    hexag(bxc, byc, rr, P["axis"])
    hexag(bxc, 220, rr, P["axis"])           # top hexagon
    for i in range(6):
        x1 = bxc + rr * math.cos(math.radians(30 + 60 * i)); y1 = byc + rr * math.sin(math.radians(30 + 60 * i)) / 2.2
        x2 = bxc + rr * math.cos(math.radians(30 + 60 * i)); y2 = 220 + rr * math.sin(math.radians(30 + 60 * i)) / 2.2
        pl.line(x1, y1, x2, y2, P["muted"], 3)
        atom(x1, y1, 15, P["a1"]); atom(x2, y2, 15, P["a1"])
    # mid-plane triangle atoms
    for ang in (60, 180, 300):
        x = bxc + rr * 0.52 * math.cos(math.radians(ang)); y = 345 + rr * 0.52 * math.sin(math.radians(ang)) / 2.2
        atom(x, y, 15, P["a2"])
    pl.arrow(bxc + rr + 70, byc, bxc + rr + 70, 220, P["a3"], 3)
    pl.arrow(bxc + rr + 70, 220, bxc + rr + 70, byc, P["a3"], 3)
    pl.text(bxc + rr + 90, 352, "c", 27, P["a3"], "start")
    pl.text(915, 235, "HCP", 40, P["ink"], "middle", weight="bold")
    for i, t in enumerate(["12 corners + 2 face centres", "+ 3 mid-plane atoms (triangle)",
                           "= 6 atoms per unit cell", "ideal c/a = 1.633 · CN 12 · 74%"]):
        pl.text(762, 320 + i * 56, "·", 26, P["a2"], "start")
        pl.text(784, 320 + i * 56, t, 22, P["ink"], "start")
    pl.text(110, 60, "HEXAGONAL CLOSE-PACKED CELL", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ------------------------------------------------------- CM 6: Lennard-Jones
def cm_lj():
    pl = Plot()
    pl.frame(120, 80, 1160, 600, xlab="r / sigma", ylab="V(r) / eps")
    pl.domain(0.85, 3.2, -1.25, 2.2)
    lj = lambda r: 4 * (r ** -12 - r ** -6)
    pl.axes(xticks=[(1, ""), (1.122, "2^(1/6)"), (2, "2"), (3, "3")], yticks=[(-1, "-eps"), (0, "0"), (1, "")])
    pl.curve(lj, 700, P["a1"], 5)
    pl.hline(-1, P["muted"], 2, "6 8", x0=0.85, x1=1.122)
    pl.vline(1.122, P["a2"], 2, "6 8", y0=-1, y1=0)
    pl.mdot(1.122, -1, 8, P["a2"])
    pl.mtext(1.35, -0.85, "minimum: bound pair, r0 = 2^(1/6) sigma", 22, P["a2"], "start")
    pl.marrows(1.01, 0.5, 0.95, 1.6, P["a3"], 4)
    pl.mtext(1.02, 1.75, "repulsive wall  ~ 1/r^12", 22, P["a3"], "start")
    pl.marrows(2.2, -0.3, 2.8, -0.12, P["a4"], 4)
    pl.mtext(2.0, -0.5, "attraction ~ -1/r^6 (van der Waals)", 22, P["a4"], "start")
    pl.text(120, 46, "LENNARD-JONES (6-12) PAIR POTENTIAL", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ------------------------------------------------------- CM 7: superconducting gap DoS
def cm_scdos():
    pl = Plot()
    pl.frame(110, 90, 1160, 600, xlab="", ylab="")
    # two-panel: energy band picture (left) + DoS (right)
    pl.domain(0, 10, 0, 3.4)
    pl.seg([(0.6, 0.75), (4.4, 0.75)], P["a1"], 5)   # EF line normal
    pl.mtext(0.55, 0.97, "EF", 22, P["a1"], "end")
    pl.seg([(0.6, 2.45), (4.4, 2.45)], P["muted"], 3)
    pl.mtext(2.5, 2.7, "conduction states (normal metal)", 20, P["muted"])
    pl.mtext(2.5, 0.42, "filled up to EF", 20, P["muted"])
    pl.text(130, 110, "NORMAL", 26, P["ink"], "start", weight="bold")
    # right: SC with gap
    pl.text(620, 110, "SUPERCONDUCTOR  (T < Tc)", 26, P["ink"], "start", weight="bold")
    pl.seg([(6.0, 2.0), (9.6, 2.0)], P["a1"], 4)
    pl.seg([(6.0, 1.2), (9.6, 1.2)], P["a1"], 4)
    pl.seg([(6.0, 1.6), (9.6, 1.6)], P["muted"], 2, dash="5 7")
    pl.mtext(9.75, 1.68, "EF", 22, P["a1"], "start")
    pl.parts.append('<rect x="%s" y="%s" width="%s" height="%s" fill="%s" opacity="0.14"/>'
                    % (pl.mx(6.0), pl.my(2.0), pl.mx(9.6) - pl.mx(6.0), pl.my(1.2) - pl.my(2.0), P["a2"]))
    pl.marrows(5.75, 1.2, 5.75, 2.0, P["a2"], 3)
    pl.marrows(5.75, 2.0, 5.75, 1.2, P["a2"], 3)
    pl.mtext(5.6, 1.62, "2 DELTA", 22, P["a2"], "end")
    # coherence peaks in DoS: sketch at bottom right
    pl.mtext(5.5, 0.42, "DoS piles up at the gap edges;", 20, P["muted"], "start")
    pl.mtext(5.5, 0.13, "pair breaking costs 2 Delta = 3.53 kB Tc", 20, P["a4"], "start")
    pl.text(110, 56, "THE SUPERCONDUCTING ENERGY GAP", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ------------------------------------------------------- CM 8: roton dispersion
def cm_roton():
    pl = Plot()
    pl.frame(140, 80, 1160, 600, xlab="p", ylab="E(p)")
    pl.domain(0, 3.4, 0, 2.6)
    # Catmull-Rom through the physical landmarks: linear phonon start,
    # maxon bump, roton dip at (p0, Delta), rising free-particle-like tail
    PTS = [(0, 0), (0.55, 1.28), (1.5, 0.92), (2.35, 1.45), (3.3, 2.4)]
    def cr(t, p0, p1, p2, p3):
        t2, t3 = t * t, t * t * t
        return 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2
                      + (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
    def E(p):
        X = [q[0] for q in PTS]
        if p <= 0:
            return 0.0
        if p >= X[-1]:
            return None
        i = max(j for j in range(len(X) - 1) if X[j] <= p)
        x0, x1 = X[i], X[i + 1]
        y = lambda k: PTS[min(max(k, 0), len(PTS) - 1)][1]
        return cr((p - x0) / (x1 - x0), y(i - 1), y(i), y(i + 1), y(i + 2))
    pl.axes(xticks=[(0, "0"), (1.5, "p0"), (2, ""), (3, "")], yticks=[(0.92, "Delta"), (2.2, "")])
    pl.seg([(0, 0), (2.5, 1.532)], P["a2"], 3, dash="3 8")   # slope = vc ray
    pl.curve(E, 600, P["a1"], 5)
    pl.mdot(1.5, 0.92, 8, P["a3"])
    pl.mtext(1.72, 0.66, "ROTON: E = Delta at p0", 22, P["a3"], "start")
    pl.mtext(0.30, 0.52, "phonon: E = c p", 21, P["a4"], "end")
    pl.mtext(0.72, 1.47, "maxon", 19, P["muted"], "start")
    pl.mtext(2.62, 1.52, "slope E/p = vc (Landau):", 20, P["a2"], "start")
    pl.mtext(2.62, 1.28, "superfluid below vc", 20, P["a2"], "start")
    pl.mtext(2.62, 2.48, "free tail ~ p^2/2m", 20, P["muted"], "start")
    pl.text(140, 46, "HELIUM-II EXCITATION SPECTRUM (PHONON-ROTON)", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ------------------------------------------------------- CM 9: dislocations
def cm_disloc():
    pl = Plot()
    # LEFT: edge dislocation
    pl.text(320, 80, "EDGE DISLOCATION", 28, P["ink"], "middle", weight="bold")
    x0, y0, dx, dy = 120, 150, 44, 44
    for r in range(9):
        yy = y0 + r * dy
        xs = []
        for c in range(11):
            xx = x0 + c * dx
            if r >= 5 and c > 5:
                xx += 8
            xs.append(xx)
        for c, xx in enumerate(xs):
            pl.circle(xx, yy, 7, P["a1"], 2)
    for r in range(4):
        pl.circle(x0 + 5.5 * dx, y0 + r * dy, 7, P["a2"], 2)   # extra half-plane
    pl.line(x0 + 5.5 * dx, y0 + 4.2 * dy, x0 + 5.5 * dx + 34, y0 + 4.2 * dy, P["a3"], 4)
    pl.line(x0 + 5.5 * dx + 34, y0 + 4.2 * dy, x0 + 5.5 * dx + 34, y0 + 4.2 * dy + 34, P["a3"], 4)
    pl.text(x0 + 5.5 * dx + 66, y0 + 4.55 * dy + 6, "T (extra half-plane)", 20, P["a3"], "start")
    pl.text(x0 + 5.5 * dx + 8, y0 + 6.55 * dy, "Burgers vector b", 20, P["a4"], "middle")
    pl.arrow(x0 + 3 * dx, y0 + 5.6 * dy + 8, x0 + 8 * dx, y0 + 5.6 * dy + 8, P["a4"], 3)
    # RIGHT: screw dislocation spiral sketch
    pl.text(880, 80, "SCREW DISLOCATION", 28, P["ink"], "middle", weight="bold")
    cx, cy = 880, 380
    for i in range(46):
        t = i / 5
        r = 26 + 5.2 * t
        pl.circle(cx + r * math.cos(t) * 1.5, cy + r * math.sin(t), 6, P["a1" if i % 7 else "a2"], 2)
    pl.arrow(cx, cy, cx + 150, cy, P["a4"], 3)
    pl.text(cx + 10, cy + 125, "b PARALLEL to line", 20, P["a4"], "middle")
    pl.text(110, 660, "Edge: half-plane, b perpendicular to line  ·  Screw: spiral ramp, b parallel to line", 21, P["muted"], "start")
    pl.text(110, 46, "LINE DEFECTS - THE TWO DISLOCATION SPECIES", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ------------------------------------------------------- CL 1: stability tau-Delta plane
def cl_stability():
    pl = Plot()
    pl.frame(140, 90, 1160, 620, xlab="tau  (trace)", ylab="Delta  (det)")
    pl.domain(-8, 8, -3, 9)
    par = lambda t: t * t / 4.0
    pl.axes(xticks=[(-6, ""), (0, "0"), (6, "")], yticks=[(0, "0"), (4, ""), (8, "")])
    pl.curve(lambda t: par(t), 400, P["a2"], 4)
    pl.hline(0, P["axis"], 3)
    pl.vline(0, P["axis"], 3)
    pl.parts.append('<rect x="%s" y="%s" width="%s" height="%s" fill="%s" opacity="0.12"/>'
                    % (pl.mx(-8), pl.my(9), pl.mx(8) - pl.mx(-8), pl.my(0) - pl.my(9), P["a2"]))
    txt = [(-4.4, 6.6, "SPIRALS  (Delta > tau^2/4)", "a1"), (4.3, 6.6, "SPIRALS", "a1"),
           (-3.2, 4.55, "stable focus", "a4"), (3.25, 4.55, "unstable focus", "a3"),
           (-3.7, 1.35, "stable node", "a4"), (3.95, 1.35, "unstable node", "a3"),
           (0, -1.5, "SADDLES  (Delta < 0)", "a3")]
    for x, y, s, c in txt:
        pl.mtext(x, y, s, 21, P[c])
    pl.mtext(0, 8.55, "Delta = tau^2 / 4  (degenerate: stars / improper nodes)", 19, P["a2"])
    pl.mtext(-0.35, 0.5, "centres on tau = 0 line", 19, P["a1"], "end")
    pl.text(120, 52, "FIXED-POINT MAP OF x'=Ax  -  THE tau-Delta PLANE", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ------------------------------------------------------- CL 2: coupled oscillator modes
def cl_coupled():
    pl = Plot()
    def spring(x1, y, x2, col):
        pl.zigzag(x1, y, x2, y, 7, 13, col, 3)
    def mass(cx, cy, col, lab):
        pl.rect(cx - 26, cy - 26, 52, 52, col, 3)
        pl.text(cx, cy + 8, lab, 22, P["ink"], "middle")
    # chain
    pl.line(60, 220, 60, 420, P["axis"], 5)
    pl.hatch(60, 235, 0, 155, 8, -20, P["muted"], 2)
    pl.line(1140, 220, 1140, 420, P["axis"], 5)
    pl.hatch(1140, 235, 0, 155, 8, 20, P["muted"], 2)
    spring(60, 320, 300, P["a2"])
    mass(340, 320, P["a1"], "m")
    spring(380, 320, 640, P["a4"])
    mass(680, 320, P["a1"], "M")
    spring(720, 320, 900, P["a4"])
    mass(940, 320, P["a1"], "m")
    spring(980, 320, 1140, P["a2"])
    pl.text(340, 440, "x1", 22, P["muted"], "middle"); pl.text(680, 440, "x2", 22, P["muted"], "middle"); pl.text(940, 440, "x3", 22, P["muted"], "middle")
    # modes row
    pl.text(130, 540, "MODE 1 (symmetric):  x2 = 2 x1 = 2 x3,  w1 = sqrt(k/m)", 23, P["a4"], "start")
    pl.text(130, 588, "MODE 2 (antisymmetric):  x2 = 0, x1 = -x3,  w2 = sqrt((k + 2 k')/m)", 23, P["a3"], "start")
    pl.text(130, 636, "eigenvectors of  K phi = w^2 M phi  -  solve det(K - w^2 M) = 0", 21, P["muted"], "start")
    pl.text(110, 46, "LINEAR TRIATOMIC CHAIN - NORMAL MODES (CO2 MODEL)", 30, P["ink"], "start", weight="bold")
    return pl.emit()


def build():
    del FIGS[:]
    reg(NUC, "ff-nuc-shape", "electric quadrupole moment", "Prolate (Q > 0)", 0,
        "Nuclear shapes and the sign of Q",
        "Prolate cigars concentrate charge along the symmetry axis (Q > 0); oblate pancakes flatten it (Q < 0); magic-shell nuclei are spherical. Replaces the old ASCII sketch.",
        nuc_shape())
    reg(NUC, "ff-nuc-deuteron", "square well potential solution", "V(r)", 0,
        "Deuteron square-well bound state",
        "The np triplet sits at -2.225 MeV in a ~2.1 fm well: single sine hump inside, exponential leakage outside, and no excited bound states. Replaces the old ASCII sketch.",
        nuc_deuteron())
    reg(NUC, "ff-nuc-shell", "hamiltonian and spin-orbit coupling", "Harmonic Oscillator Levels", 0,
        "Shell-model level order",
        "Spin-orbit coupling splits each N-shell by j = l +/- 1/2, pulling high-j intruders across the gaps - that is what prints the magic numbers 2, 8, 20, 28, 50, 82, 126. Replaces the old ASCII sketch.",
        nuc_shell())
    reg(NUC, "ff-nuc-breit", "breit-wigner", "Cross-Section σ(E)", 0,
        "Breit-Wigner resonance shape",
        "Compound-nucleus resonance: Lorentzian peak at E0 with full width Gamma, lifetime tau = hbar/Gamma. Replaces the old ASCII sketch.",
        nuc_breit())
    reg(CM, "ff-cm-hcp", "quantitative analysis of cubic", "Top atom (height c/2)", 0,
        "HCP unit cell",
        "Hexagonal close packing: 12 corner + 2 face + 3 mid-plane atoms = 6 per cell, ideal c/a = 1.633, packing 74% - the third member of the structure trio. Replaces the old ASCII sketch.",
        cm_hcp())
    reg(CM, "ff-cm-lj", "lennard-jones", None, 1,
        "Lennard-Jones pair potential",
        "The 6-12 potential: 1/r^12 repulsive core, -1/r^6 van der Waals tail, equilibrium at r0 = 2^(1/6) sigma with depth eps - the bonding model for inert-gas solids.",
        cm_lj())
    reg(CM, "ff-cm-scdos", "fundamentals of superconductivity", "Normal Metal", 0,
        "Superconducting gap 2 Delta",
        "Below Tc a gap 2 Delta = 3.53 kB Tc opens symmetric about the Fermi level; quasiparticle states pile up as coherence peaks at both gap edges. Replaces the old ASCII sketch.",
        cm_scdos())
    reg(CM, "ff-cm-roton", "superfluidity", "Roton Minimum", 0,
        "He-II phonon-roton spectrum",
        "Linear phonon onset, roton dip Delta, free-particle tail; the Landau critical velocity min(E/p) is why helium flows without friction below it. Replaces the old ASCII sketch.",
        cm_roton())
    reg(CM, "ff-cm-disloc", "line defects", "Edge Dislocation", 0,
        "Edge and screw dislocations",
        "Edge = extra half-plane with Burgers vector perpendicular to the line; screw = spiral ramp with b parallel. Replaces the old ASCII sketch.",
        cm_disloc())
    reg(CL, "ff-cl-stability", "stability analysis", "Delta (Determinant)", 0,
        "Fixed-point stability map",
        "Classification of linear fixed points in the (trace, determinant) plane: saddles below the axis, nodes vs foci split by the tau^2 = 4 Delta parabola, stable on the left. Replaces the old ASCII sketch.",
        cl_stability())
    reg(CL, "ff-cl-coupled", "coupled oscillations", "m              M", 0,
        "Coupled-oscillator normal modes",
        "The m - M - m chain (the CO2 model): symmetric and antisymmetric eigenmodes come straight from det(K - w^2 M) = 0. Replaces the old ASCII sketch.",
        cl_coupled())
    return FIGS
