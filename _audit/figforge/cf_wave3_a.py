#!/usr/bin/env python3
"""FIGFORGE wave-3 part A: nuclear x6, condensed matter x5, classical x1.
All hide legacy ASCII pres; anchors are real heading fingerprints."""
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


# ------------------------------------------------- N1: Bohr-Wheeler fission barrier
def nuc_fission():
    pl = Plot()
    pl.frame(120, 80, 1160, 600, xlab="deformation", ylab="E / E0")
    pl.domain(0, 1.45, 0.78, 1.14)
    # liquid-drop energy over deformation: surface rises, Coulomb falls,
    # total has a barrier then plunges - drawn from an explicit model
    f = lambda e: 1.0 + 0.062 * e * e - 0.098 * e ** 3
    xb = 2 * 0.062 / (3 * 0.098)
    pl.axes(xticks=[(0, "sphere"), (xb, "saddle"), (1.38, "scission")],
            yticks=[(0.9, ""), (1.0, "E0")], xlab="")
    pl.text(660, 626, "deformation", 26, P["ink"], "middle")
    pl.curve(f, 400, P["a1"], 5)
    pl.vline(xb, P["a2"], 2, "6 8", y0=0.78, y1=f(xb))
    pl.mdot(0.0, 1.0, 8, P["a4"])
    pl.mdot(xb, f(xb), 8, P["a2"])
    pl.mdot(1.32, f(1.32), 8, P["a3"])
    pl.mtext(0.1, 0.955, "spherical (metastable)", 20, P["a4"], "start")
    pl.mtext(0.68, 1.075, "saddle = fission barrier Bf", 21, P["a2"], "start")
    pl.mtext(1.29, 0.830, "runaway -> scission:", 20, P["a3"], "end")
    pl.mtext(1.29, 0.803, "two fragments + 200 MeV", 20, P["a3"], "end")
    pl.mtext(0.06, 1.105, "liquid drop:", 20, P["muted"], "start")
    pl.mtext(0.06, 1.078, "surface tension pushes UP,", 20, P["muted"], "start")
    pl.mtext(0.06, 1.051, "Coulomb repulsion pulls DOWN", 20, P["muted"], "start")
    pl.text(120, 46, "FISSION BARRIER - THE BOHR-WHEELER LANDSCAPE", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ------------------------------------------------- N2: Schmidt lines
def nuc_schmidt():
    pl = Plot()
    pl.frame(150, 80, 1160, 600, xlab="j", ylab="mu / muN")
    pl.domain(0.5, 6.5, -2.6, 9.2)
    pl.axes(xticks=[(1, "1"), (2, "2"), (3, "3"), (4, "4"), (5, "5"), (6, "6")],
            yticks=[(-2, "-2"), (0, "0"), (2, "2"), (4, "4"), (6, "6"), (8, "8")])
    # single-particle moments: gl(p)=1, gs(p)=5.586 ; gl(n)=0, gs(n)=-3.826
    gsp, gsn = 5.586, -3.826
    def mu(gl, gs, j, su):
        l = j - 0.5 if su > 0 else j + 0.5
        if su > 0:
            return gl * l + gs / 2.0
        return gl * j - (j / (j + 1.0)) * (gs - 2 * gl) / 2.0
    seg = lambda j2, fn: [(j / 20, fn(j / 20)) for j in range(10, int(j2 * 20) + 1, 2)]
    pl.curve(lambda j: mu(1, gsp, j, +1), 60, P["a3"], 4, dash="12 7")
    pl.curve(lambda j: mu(1, gsp, j, -1), 60, P["a3"], 4)
    pl.curve(lambda j: mu(0, gsn, j, +1) if j <= 6.5 else None, 60, P["a1"], 4, dash="12 7")
    pl.curve(lambda j: mu(0, gsn, j, -1), 60, P["a1"], 4)
    pts = [(0.5, 2.98, "3H", "a3"), (0.5, -2.127, "3He", "a1"), (0.5, -0.283, "15N", "a3"),
           (2.5, 4.72, "17F", "a3"), (2.5, -1.894, "17O", "a1"), (1.5, 0.391, "39K", "a3"),
           (3.5, -1.594, "41Ca", "a1"), (4.5, 4.11, "209Bi", "a3")]
    for j, m, lab, c in pts:
        pl.mdot(j, m, 7, P[c])
        pl.mtext(j + 0.09, m + 0.34, lab, 18, P["ink"], "start")
    pl.mtext(6.4, j_s := mu(1, gsp, 6.5, 1) + 0.35, "p: j = l + 1/2", 20, P["a3"], "end")
    pl.mtext(6.4, mu(1, gsp, 6.5, -1) + 0.35, "p: j = l - 1/2", 20, P["a3"], "end")
    pl.mtext(6.4, mu(0, gsn, 6.5, -1) + 0.35, "n: j = l - 1/2", 20, P["a1"], "end")
    pl.mtext(3.2, -2.28, "n: j = l + 1/2 (flat at -1.913)", 20, P["a1"], "start")
    pl.mtext(0.75, 8.7, "measured moments huddle NEAR the Schmidt lines, never on them", 20, P["muted"], "start")
    pl.mtext(0.75, 8.25, "->  core polarisation + meson exchange quench the simple model", 20, P["muted"], "start")
    pl.text(150, 46, "SCHMIDT LINES - MAGNETIC MOMENTS vs j", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ------------------------------------------------- N3: Kurie plot
def nuc_kurie():
    pl = Plot()
    pl.frame(120, 80, 1160, 600, xlab="E", ylab="")
    pl.domain(0, 10, 0, 10)
    pl.axes(xticks=[], yticks=[])
    # two sub-panels fenced inside one data box via explicit x-windows
    for x, xx in [(1.0, 4.4), (5.6, 9.6)]:
        pl.seg([(x, 0.5), (x, 9.4)], P["axis"], 3)
        pl.seg([(x, 0.5), (xx, 0.5)], P["axis"], 3)
    # left: raw Fermi spectrum N ~ p^2 (E0-E)^2 (window x in [1,4.4], e = x-1)
    e0 = 3.4
    raw = lambda e: (e * e) * ((e0 - e) ** 2) if 0 <= e <= e0 else None
    r0 = raw(1.7) / 8.2
    pl.curve(lambda x: raw(x - 1) / r0 if 1.02 <= x <= 1 + e0 else None, 300, P["a1"], 4)
    pl.mtext(2.7, 9.0, "raw spectrum  N(E)", 20, P["a1"])
    pl.mtext(3.9, 2.6, "phase space:", 18, P["muted"], "start")
    pl.mtext(3.9, 2.3, "p^2 (E0 - E)^2", 18, P["muted"], "start")
    # right: Kurie transform linearises it (window x in [5.6,9.6], e = x-5.6)
    kk = 3.5
    pl.curve(lambda x: 8.6 * (1 - (x - 5.6) / kk) + 0.6 if 5.6 <= x <= 5.6 + kk else None,
             200, P["a2"], 5)
    pl.mdot(5.6 + kk, 0.62, 7, P["a3"])
    pl.mtext(7.6, 9.0, "Kurie plot  sqrt(N / p^2 F)", 20, P["a2"])
    pl.mtext(6.05, 8.62, "allowed decay ->", 19, P["muted"], "start")
    pl.mtext(6.05, 8.32, "a dead straight line", 19, P["muted"], "start")
    pl.mtext(9.5, 0.16, "intercept = E0", 19, P["a2"], "end")
    pl.mtext(6.0, 2.5, "terminal curvature", 18, P["a3"], "start")
    pl.mtext(6.0, 2.2, "weighs the neutrino", 18, P["a3"], "start")
    pl.text(120, 640, "Beta spectrum divided by phase space collapses to a line hitting zero exactly at E0.", 20, P["muted"], "start")
    pl.text(120, 46, "BETA SPECTRUM -> KURIE PLOT (FERMI THEORY)", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ------------------------------------------------- N4: reaction kinematics + Q
def nuc_kin():
    pl = Plot()
    # LEFT: collision picture
    pl.line(90, 300, 260, 300, P["a1"], 4)
    pl.arrow(200, 300, 285, 300, P["a1"], 4)
    pl.text(120, 272, "projectile a (p_a)", 20, P["a1"], "start")
    pl.circle(330, 300, 26, P["axis"], 4, fill=P["bg"])
    pl.text(330, 308, "X", 24, P["ink"], "middle")
    pl.text(230, 352, "target at rest", 18, P["muted"], "start")
    pl.arrow(368, 282, 560, 195, P["a2"], 4)
    pl.text(400, 180, "b (E_b, p_b)", 20, P["a2"], "start")
    pl.line(440, 244, 440, 288, P["muted"], 2, dash="4 6")
    pl.text(448, 270, "theta", 18, P["muted"], "start")
    pl.arrow(368, 318, 560, 420, P["a4"], 4)
    pl.text(430, 420, "Y  recoils", 20, P["a4"], "middle")
    pl.text(90, 140, "a + X  ->  b + Y", 30, P["ink"], "start", weight="bold")
    # RIGHT: Q bookkeeping
    x0 = 700
    pl.text(x0, 150, "Q-value bookkeeping", 25, P["ink"], "start", weight="bold")
    pl.line(x0, 210, x0 + 380, 210, P["a1"], 4)
    pl.text(x0, 196, "m_a + m_X  (before)", 20, P["a1"], "start")
    pl.line(x0 + 60, 320, x0 + 380, 320, P["a2"], 4)
    pl.text(x0 + 60, 306, "m_b + m_Y  (after)", 20, P["a2"], "start")
    pl.arrow(x0 + 380, 240, x0 + 380, 290, P["a3"], 3)
    pl.text(x0 - 55, 272, "Q = (m_before - m_after) c^2", 21, P["a3"], "start")
    pl.text(x0, 390, "Q > 0  exothermic: energy released", 21, P["a4"], "start")
    pl.text(x0, 428, "Q < 0  endothermic: needs threshold", 21, P["a3"], "start")
    pl.text(x0, 466, "E_thr = -Q (1 + m_a / m_X)", 21, P["ink"], "start")
    pl.text(90, 640, "Energy + momentum conserve at once - Q and the angle pin down every momentum.", 20, P["muted"], "start")
    pl.text(90, 46, "REACTION KINEMATICS AND THE Q-VALUE", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ------------------------------------------------- N5: octet + decuplet
def nuc_octet():
    pl = Plot()
    def grid(cx, cy, sx, sy, rows):
        for i in range(-2, 3):
            pl.line(cx - 2 * sx + i * 0, cy + i * sy, cx + 2 * sx + i * 0, cy + i * sy, P["axis"], 1)
        # light diagonals for I3
        for k in (-1.5, -0.5, 0.5, 1.5):
            pl.line(cx + k * sx, cy - 3.2 * sy, cx + k * sx, cy + 1.2 * sy, P["muted"], 1, dash="3 7")
    # OCTET (left): charge along rows (I3), strangeness down columns (S)
    cx, cy, sx, sy = 330, 250, 150, 120
    pl.text(cx, 100, "BARYON OCTET  (J^P = 1/2+)", 24, P["ink"], "middle", weight="bold")
    oc = [(-0.5, 0, "n", "a1"), (0.5, 0, "p", "a1"),
          (-1, -1, "Sigma-", "a2"), (0, -1, "", "a2"), (0.24, -1, "", "a3"),
          (1, -1, "Sigma+", "a2"),
          (-0.5, -2, "Xi-", "a4"), (0.5, -2, "Xi0", "a4")]
    for i3, s, lab, col in oc:
        x, y = cx + i3 * sx, cy - s * sy
        pl.dot(x, y, 12, P[col])
        if lab:
            pl.text(x + 0, y + 32, lab, 19, P["ink"], "middle")
    pl.text(348, cy + 152, "Sigma0, Lambda0", 17, P["ink"], "middle")
    pl.text(510, 256, "S = 0", 17, P["muted"], "start")
    pl.text(510, 376, "S = -1", 17, P["muted"], "start")
    pl.text(510, 496, "S = -2", 17, P["muted"], "start")
    pl.text(cx, 566, "quarks: u d s only", 20, P["muted"], "middle")
    # DECUPLET (right)
    dx = 850
    pl.text(dx, 100, "BARYON DECUPLET  (J^P = 3/2+)", 24, P["ink"], "middle", weight="bold")
    rows = [("D-  D0  D+  D++", 250, "a1"), ("S*-  S*0  S*+", 342, "a2"),
            ("Xi*-  Xi*0", 434, "a4"), ("OMEGA-", 526, "a3")]
    for labs, y, col in rows:
        parts = labs.split()
        n = len(parts)
        for i, lab in enumerate(parts):
            x = dx + (i - (n - 1) / 2.0) * sx * 0.62
            pl.dot(x, y, 12, P[col])
            pl.text(x, y + 30, lab.replace("D", "Delta").replace("S*", "Sigma*").replace("Xi*", "Xi*").replace("OMEGA-", "Omega-"), 19, P["ink"], "middle")
    pl.text(dx, 604, "Omega- predicted BEFORE discovery (1962/64)", 20, P["a3"], "middle")
    pl.text(90, 640, "Weight diagrams of SU(3) flavour: charge runs along the rows, strangeness down the columns.", 20, P["muted"], "start")
    pl.text(90, 46, "THE EIGHTFOLD WAY - OCTET & DECUPLET", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ------------------------------------------------- N6: Wu experiment
def nuc_wu():
    pl = Plot()
    # LEFT: polarised Co-60 with asymmetric emission
    pl.circle(300, 330, 46, P["a3"], 4, fill=P["bg"])
    pl.text(300, 320, "60Co", 23, P["ink"], "middle")
    pl.text(300, 344, "(J=5)", 18, P["muted"], "middle")
    pl.arrow(300, 400, 300, 500, P["a1"], 4)      # spin DOWN (B aligned)
    pl.text(312, 470, "nuclear spin J", 18, P["a1"], "start")
    for dx_, dy_, L in [(-150, -110, 210), (150, -110, 210), (-170, 60, 135), (170, 60, 135), (0, -150, 230)]:
        u = (dx_ ** 2 + dy_ ** 2) ** 0.5
        sx_, sy_ = 300 + 54 * dx_ / u, 330 + 54 * dy_ / u
        pl.arrow(sx_, sy_, 300 + dx_, 330 + dy_, P["a2"], 3 if L < 200 else 6)
    pl.text(90, 128, "electrons fire OPPOSITE the spin", 19, P["a2"], "start")
    pl.text(300, 600, "cooled + B-field aligned", 19, P["muted"], "middle")
    # RIGHT: angular distribution  I(theta) = 1 + A v/c P cos(theta),  A = -1
    pl.frame(650, 90, 1150, 580, xlab="", ylab="I(theta)")
    pl.domain(-1.15, 1.15, 0, 2.1)
    pl.axes(xticks=[(-1, "-1"), (0, "0"), (1, "+1")], yticks=[(1, "1"), (2, "2")])
    pl.text(1136, 670, "cos(theta)", 24, P["ink"], "end")
    pl.curve(lambda c: 1 - 0.85 * c, 80, P["a1"], 5)
    pl.hline(1, P["muted"], 2, "5 8")
    pl.mtext(-0.5, 2.08, "I(theta) = 1 + A P v/c cos(th)", 19, P["a1"], "start")
    pl.mtext(-0.5, 1.76, "fits A = -1 : maximal violation", 19, P["a3"], "start")
    pl.mtext(-0.98, 0.42, "mirror world (P):", 19, P["muted"], "start")
    pl.mtext(-0.98, 0.2, "world flipped -> PARITY VIOLATED", 19, P["a3"], "start")
    pl.text(90, 46, "WU EXPERIMENT (1957) - PARITY FALLS IN WEAK DECAYS", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ------------------------------------------------- CM1: 1D Brillouin zone + folding
def cm_bz():
    pl = Plot()
    pl.frame(130, 80, 1160, 600, xlab="k", ylab="E(k)")
    pl.domain(-3.4, 3.4, 0, 6)
    pi = math.pi
    pl.axes(xticks=[(-pi, "-pi/a"), (0, "0"), (pi, "+pi/a")], yticks=[])
    E = lambda k: 0.5 * k * k
    pl.curve(lambda k: E(k) if -2.35 <= k <= 2.35 else None, 300, P["muted"], 3, dash="6 8")
    for G, col in [(-2 * pi, P["a3"]), (0, P["a3"]), (2 * pi, P["a3"])]:
        pl.curve(lambda k: E(k + G) if -pi <= k <= pi else None, 200, col, 5)
    pl.vline(-pi, P["a2"], 3, "8 6")
    pl.vline(pi, P["a2"], 3, "8 6")
    pl.mtext(2.68, 5.62, "at +/- pi/a: standing waves,", 19, P["a2"], "end")
    pl.mtext(2.68, 5.32, "Bragg gaps open every band", 19, P["a2"], "end")
    pl.mtext(-2.8, 5.4, "free-electron parabola", 19, P["muted"], "start")
    pl.mtext(-2.8, 5.08, "(dashed, extended zone)", 19, P["muted"], "start")
    pl.mtext(-1.6, 0.98, "reduced zone:", 19, P["a3"], "start")
    pl.mtext(-1.6, 0.70, "fold by G = 2pi/a", 19, P["a3"], "start")
    pl.text(130, 46, "FIRST BRILLOUIN ZONE - FOLDING E(k) BACK HOME", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ------------------------------------------------- CM2: bonding classification
def cm_classif():
    pl = Plot()
    cards = [(150, 120, "IONIC", "a2", ["e- transferred", "NaCl, CsCl", "hard, brittle", "insulator"]),
             (640, 120, "COVALENT", "a1", ["e- shared (directional)", "diamond, Si", "very hard", "insulator"]),
             (150, 390, "METALLIC", "a3", ["electron sea", "Na, Cu", "ductile, shiny", "conductor"]),
             (640, 390, "MOLECULAR", "a4", ["van der Waals", "Ar, I2, CH4", "soft, low mp", "insulator"])]
    for x, y, name, col, rows in cards:
        pl.rect(x, y, 420, 220, P[col], 3)
        pl.text(x + 210, y + 46, name, 27, P[col], "middle", weight="bold")
        # mini bond glyph
        if name == "IONIC":
            pl.circle(x + 150, y + 110, 16, P[col], 3)
            pl.circle(x + 210, y + 110, 22, P["a1"], 3)
            pl.arrow(x + 172, y + 110, x + 182, y + 110, P["a3"], 2)
        elif name == "COVALENT":
            pl.circle(x + 170, y + 110, 17, P[col], 3)
            pl.circle(x + 230, y + 110, 17, P[col], 3)
            pl.line(x + 176, y + 110, x + 224, y + 110, P["ink"], 6)
        elif name == "METALLIC":
            for k in range(5):
                pl.circle(x + 130 + 34 * (k % 3), y + 84 + 28 * (k // 3), 13, P[col], 2)
            for k in range(3):
                pl.dot(x + 196 + 30 * k, y + 96 + 8 * ((k * 37) % 3), 4, P["a2"])
        else:
            pl.circle(x + 160, y + 110, 15, P[col], 2)
            pl.circle(x + 245, y + 110, 15, P[col], 2)
            pl.line(x + 185, y + 110, x + 220, y + 110, P["muted"], 2, dash="2 6")
        for i, r in enumerate(rows):
            pl.text(x + 210, y + 148 + i * 19, r, 19, P["ink"], "middle")
    pl.text(90, 660, "Bond type chooses the lattice, hardness, melting point - and whether the band is full.", 20, P["muted"], "start")
    pl.text(90, 46, "THE FOUR BOND SPECIES OF SOLIDS", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ------------------------------------------------- CM3: Kronig-Penney f(alpha a)
def cm_kronigfun():
    pl = Plot()
    pl.frame(130, 80, 1160, 600, xlab="", ylab="f(alpha a)")
    pl.domain(-0.4, 13.4, -1.75, 2.6)
    Pi = 2.0
    f = lambda x: Pi * math.sin(x) / x + math.cos(x) if x != 0 else 1 + Pi
    pl.axes(xticks=[(math.pi, "pi"), (2 * math.pi, "2pi"), (3 * math.pi, "3pi"), (4 * math.pi, "4pi")],
            yticks=[(-1, "-1"), (0, "0"), (1, "+1")])
    # forbidden zones |f|>1 shaded
    xs = [i * 13.4 / 1600 for i in range(1601)]
    run, last = None, None
    for x in xs:
        bad = abs(f(x)) > 1
        if bad and run is None:
            run = x
        if not bad and run is not None:
            pl.shade_v(run, x, P["a3"], 0.12)
            run = None
    if run is not None:
        pl.shade_v(run, 13.4, P["a3"], 0.12)
    pl.hline(1, P["a2"], 2, "7 7")
    pl.hline(-1, P["a2"], 2, "7 7")
    pl.curve(f, 900, P["a1"], 5)
    pl.mtext(3.55, 2.3, "allowed band", 20, P["a4"], "start")
    pl.mtext(2.4, 1.55, "shaded = FORBIDDEN gap (no real k)", 20, P["a3"], "start")
    pl.mtext(5.4, -1.42, "gaps narrow as alpha a grows", 20, P["muted"], "start")
    pl.text(1182, 610, "alpha  a", 26, P["ink"], "end")
    pl.text(240, 46, "KRONIG-PENNEY:  P sin(aa)/(aa) + cos(aa)", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ------------------------------------------------- CM4: Josephson junction
def cm_joseph():
    pl = Plot()
    # LEFT: SIS sandwich
    pl.rect(120, 240, 150, 190, P["a1"], 4)
    pl.rect(390, 240, 150, 190, P["a1"], 4)
    pl.rect(270, 230, 120, 210, P["a2"], 4)
    pl.text(195, 462, "SC-1", 22, P["a1"], "middle")
    pl.text(330, 462, "oxide ~1 nm", 19, P["a2"], "middle")
    pl.text(465, 462, "SC-2", 22, P["a1"], "middle")
    pl.arrow(215, 330, 445, 330, P["a4"], 4)
    pl.text(330, 305, "Cooper pairs tunnel (phase locked)", 19, P["a4"], "middle")
    # RIGHT: I = Ic sin(phi)
    pl.frame(650, 90, 1160, 560, xlab="phase  phi", ylab="I")
    pl.domain(-0.6, 6.9, -1.5, 1.7)
    pl.axes(xticks=[(0, "0"), (math.pi, "pi"), (2 * math.pi, "2pi")], yticks=[(-1, "-Ic"), (1, "+Ic")])
    pl.curve(lambda x: math.sin(x), 300, P["a1"], 5)
    pl.mtext(0.75, 1.14, "I = Ic sin(phi)", 22, P["a1"], "start")
    pl.hline(0, P["axis"], 2)
    pl.mtext(0.2, -1.3, "DC: |I| < Ic  ->  V = 0", 19, P["a2"], "start")
    pl.mtext(0.2, -1.02, "AC at bias V: f = 2eV/h", 19, P["a4"], "start")
    pl.text(90, 46, "JOSEPHSON JUNCTION - SUPERCURRENT ACROSS A BARRIER", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ------------------------------------------------- CM5: liquid-crystal phases
def cm_liquid():
    pl = Plot()
    rng_v = [13, 71, 29, 97, 53, 41, 89, 3, 61, 17, 83, 47, 59, 23, 79, 31, 67, 11, 43, 101]
    def rods(cx, cy, n, mode, col):
        for i in range(n):
            if mode in ("sm", "chol"):
                col_i, row_i = i % 5, i // 5
                x = cx - 76 + col_i * 38 + ((i * 29 + 11) % 10) - 5
                y = cy - 80 + row_i * 34 + ((i * 17 + 5) % 8) - 4
            else:
                x = cx + ((i * 53 + rng_v[i % len(rng_v)]) % 190) - 95
                y = cy + ((i * 37 + rng_v[(i + 7) % len(rng_v)]) % 150) - 75
            if mode == "iso":
                ang = (i * 67 + 23) % 180
            elif mode == "nem":
                ang = 90 + ((i * 13 + rng_v[i % len(rng_v)]) % 26) - 13
            elif mode == "sm":
                ang = 90 + ((row_i * 7 + i * 3) % 14) - 7
            else:
                ang = 90 + (row_i - 3.0) * 22 + ((i * 5) % 8) - 4
            a = math.radians(ang)
            L = 20 if mode in ("iso", "nem") else 14
            pl.line(x - L * math.cos(a), y - L * math.sin(a), x + L * math.cos(a), y + L * math.sin(a), col, 4)
    panels = [(230, "ISOTROPIC", "iso", "a3", "no order - liquid"),
              (510, "NEMATIC", "nem", "a1", "oriented, free centres"),
              (790, "SMECTIC", "sm", "a2", "oriented + LAYERS"),
              (1050, "CHOLESTERIC", "chol", "a4", "director twists")]
    for cx, name, mode, col, sub in panels:
        pl.rect(cx - 115, 190, 230, 250, P["axis"], 2)
        rods(cx, 315, 26, mode, P[col])
        pl.text(cx, 170, name, 23, P[col], "middle", weight="bold")
        pl.text(cx, 468, sub, 19, P["muted"], "middle")
    pl.arrow(357, 315, 383, 315, P["muted"], 3)
    pl.arrow(637, 315, 663, 315, P["muted"], 3)
    pl.text(510, 560, "heating  ---->  orientational then positional order melt away", 21, P["ink"], "middle")
    pl.text(90, 640, "Rod-like molecules: isotropic -> nematic (direction only) -> smectic (direction + layers).", 20, P["muted"], "start")
    pl.text(90, 46, "LIQUID-CRYSTAL PHASES - ORDER BETWEEN LIQUID & SOLID", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ------------------------------------------------- CL1: hard-sphere scattering
def cl_hardsphere():
    pl = Plot()
    cx, cy, R = 330, 330, 120
    pl.circle(cx, cy, R, P["a1"], 5)
    for i, frac in enumerate([0.25, 0.55, 0.8, 0.97]):
        b = frac * R
        y = cy - b
        al = math.asin(frac)
        hitx = cx - R * math.cos(al)
        pl.arrow(70, y, hitx, y, P["a2"], 3)
        # specular reflection about the radial normal (canvas coords):
        # outgoing direction = (-cos 2a, -sin 2a) for upper-half hits
        rx_ = -math.cos(2 * al)
        ry_ = -math.sin(2 * al)
        pl.arrow(hitx, y, hitx + 190 * rx_, y + 190 * ry_, P["a3"], 3)
        pl.text(74, y - 10, "b" + str(i + 1) if i else "b", 17, P["a2"], "start")
    pl.text(460, 240, "specular bounce off", 18, P["muted"], "start")
    pl.text(460, 268, "the surface normal:", 18, P["muted"], "start")
    pl.text(460, 296, "b = R sin(alpha),", 18, P["ink"], "start")
    pl.text(460, 324, "theta = pi - 2 alpha", 18, P["ink"], "start")
    # RIGHT: theta(b)
    pl.frame(760, 90, 1140, 560, xlab="", ylab="theta(b)")
    pl.domain(0, 1.12, 0, 3.4)
    pl.axes(xticks=[(0.5, "0.5"), (1, "R")], yticks=[(math.pi / 2, "pi/2"), (math.pi, "pi")])
    pl.text(1180, 626, "b / R", 24, P["ink"], "end")
    pl.curve(lambda b: math.pi - 2 * math.asin(min(b, 0.999)), 200, P["a1"], 5)
    pl.mtext(0.42, 2.4, "small b -> big deflection", 19, P["a2"], "start")
    pl.hline(math.pi, P["muted"], 1, "5 8")
    pl.text(70, 648, "hard sphere: dsigma/dOmega = R^2/4 (isotropic) - integrates to pi R^2", 20, P["a4"], "start")
    pl.text(70, 46, "HARD-SPHERE SCATTERING - IMPACT PARAMETER TO DEFLECTION", 30, P["ink"], "start", weight="bold")
    return pl.emit()


def build():
    del FIGS[:]
    reg(NUC, "ff-nuc-fission", "bohr-wheeler", "Slight Prolate", 0,
        "Liquid-drop fission barrier",
        "Surface energy rises, Coulomb energy falls as the drop deforms; their sum crests at the saddle then runs away to scission. Replaces the old ASCII sketch.",
        nuc_fission())
    reg(NUC, "ff-nuc-schmidt", "schmidt formulas", "Proton Schmidt Lines", 0,
        "Schmidt magnetic-moment lines",
        "Single-particle Shell-model moments versus j for proton and neutron states, with the classic measured isotopes huddling near the lines. Replaces the old ASCII sketch.",
        nuc_schmidt())
    reg(NUC, "ff-nuc-kurie", "theory of beta-decay & kurie plot", "N(p) ^", 0,
        "Beta spectrum and Kurie plot",
        "Phase-space-shaped beta spectrum linearised by the Kurie transform; endpoint gives E0 and any terminal curvature betrays a neutrino mass. Replaces the old ASCII sketch.",
        nuc_kurie())
    reg(NUC, "ff-nuc-kin", "reaction kinematics", "Target X (at rest)", 0,
        "Reaction kinematics and Q",
        "a + X -> b + Y with Q from the mass balance and the endothermic threshold E_thr = -Q(1 + m_a/m_X). Replaces the old ASCII sketch.",
        nuc_kin())
    reg(NUC, "ff-nuc-octet", "decuplet", "Baryon Octet (J^P = 1/2+)", 0,
        "SU(3) octet and decuplet",
        "The Eightfold Way weight diagrams: charge along the rows, strangeness down the columns - the Omega- hole predicted its discovery. Replaces the old ASCII sketch.",
        nuc_octet())
    reg(NUC, "ff-nuc-wu", "wu", "Spin Alignment J", 0,
        "Wu parity-violation experiment",
        "Polarised cobalt-60 betas fire preferentially opposite the nuclear spin, I ~ 1 + A P v/c cos theta with A = -1 - the mirror world is not this world. Replaces the old ASCII sketch.",
        nuc_wu())
    reg(CM, "ff-cm-bz", "first brillouin zone construction", "1D Brillouin Zone:", 0,
        "First Brillouin zone construction",
        "The free-electron parabola folded back by G = 2pi/a into the reduced zone; Bragg standing waves at +/-pi/a open the band gaps. Replaces the old ASCII sketch.",
        cm_bz())
    reg(CM, "ff-cm-classif", "classification of solids by bonding", "Classifications of Soli", 0,
        "Four bonding species",
        "Ionic, covalent, metallic and molecular bonds: who owns the electrons decides the lattice, hardness, melting point and conduction. Replaces the old ASCII sketch.",
        cm_classif())
    reg(CM, "ff-cm-kronigfun", "dirac comb", "f(αa)", 0,
        "Kronig-Penney band condition",
        "P sin(aa)/(aa) + cos(aa) with the |f| <= 1 window: excursions beyond +/-1 are exactly the forbidden gaps. Replaces the old ASCII sketch.",
        cm_kronigfun())
    reg(CM, "ff-cm-joseph", "josephson", "Superconductor 1", 0,
        "Josephson junction",
        "A nanometre oxide between superconductors still carries a resistance-free current I = Ic sin(phi); biased, it oscillates at 2eV/h. Replaces the old ASCII sketch.",
        cm_joseph())
    reg(CM, "ff-cm-liquid", "liquid crystal phases", "Isotropic", 0,
        "Liquid-crystal phases",
        "Isotropic, nematic, smectic and cholesteric order: direction first, layers next, helical twist for the chiral phase. Replaces the old ASCII sketch.",
        cm_liquid())
    reg(CL, "ff-cl-hardsphere", "hard sphere scattering", "Scatterer", 0,
        "Hard-sphere scattering",
        "Specular reflection from the contact point converts impact parameter to deflection, theta = pi - 2 asin(b/R) - isotropic cross-section pi R^2. Replaces the old ASCII sketch.",
        cl_hardsphere())
    return FIGS
