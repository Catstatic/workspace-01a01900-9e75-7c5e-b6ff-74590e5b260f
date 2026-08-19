#!/usr/bin/env python3
"""FIGFORGE wave-2 part B: QM x2, thermo x2, thermo+electronics x2,
electronics x3, atomic x3, math-advanced x1. All real-math curves."""
import math
from cf_kernel import Plot, PAL

P = PAL
QM = "Quantum Mechanics.md"
TH = "thermodynamics.md"
TE = "thermo+ electronics+ experimental methods.md"
EL = "CSIR_NET_Electronics_Notes.md"
AM = "atomic and molecular physics.md"
MMA = "math methods advanced.md"
FIGS = []


def reg(doc, fid, anchor, hide, skip, title, cap, svg):
    FIGS.append(dict(doc=doc, id=fid, anchor=anchor, hide=hide, skip=skip,
                     title=title, cap=cap, svg=svg))


# ---------------------------------------------------------- QM: Stern-Gerlach
def qm_stern():
    pl = Plot()
    # collimator -> magnet gap -> detector plate
    pl.rect(60, 300, 60, 90, P["axis"], 3)
    pl.text(90, 350, "oven", 18, P["muted"], "middle")
    pl.line(120, 335, 300, 335, P["a2"], 3)
    pl.poly([(300, 328), (340, 335), (300, 342)], P["a2"], 3)
    # magnet: flat S (top), pointed N (bottom)
    pl.rect(380, 170, 300, 80, P["a1"], 4)
    pl.text(530, 222, "S  (flat pole)", 21, P["a1"], "middle")
    pl.poly([(380, 470), (680, 470), (620, 390), (440, 390)], P["a3"], 4, close=True)
    pl.text(530, 445, "N  (pointed pole)", 21, P["a3"], "middle")
    # field arrows (denser near the point)
    for x in (450, 530, 610):
        pl.arrow(x, 388, x, 320, P["muted"], 2)
    pl.text(700, 300, "dB/dz != 0", 20, P["muted"], "start")
    # parabolic trajectories
    def parab(x0, x1, y0, dy):
        pl.poly([(x0 + t * (x1 - x0), y0 + dy * t * t) for t in
                 [i / 40.0 for i in range(41)]], P["a4"], 3)
    parab(340, 990, 335, 45)
    parab(340, 990, 335, -45)
    pl.text(700, 250, "m = +1/2", 20, P["a4"], "start")
    pl.text(700, 420, "m = -1/2", 20, P["a4"], "start")
    # detector plate + two spots
    pl.rect(990, 200, 22, 260, P["axis"], 3)
    pl.dot(1001, 290, 10, P["a2"])
    pl.dot(1001, 380, 10, P["a2"])
    pl.text(925, 505, "TWO spots:", 20, P["a2"], "start")
    pl.text(925, 533, "space quantised -", 18, P["muted"], "start")
    pl.text(925, 557, "no classical smear", 18, P["muted"], "start")
    pl.text(60, 640, "Ag atoms (S = 1/2) split into exactly 2S+1 = 2 spots - space quantisation", 21, P["muted"], "start")
    pl.text(60, 46, "STERN-GERLACH EXPERIMENT", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------- QM: radial V_eff
def qm_veff():
    pl = Plot()
    pl.frame(120, 80, 1160, 600, xlab="r", ylab="V_eff(r)")
    pl.domain(0, 10, -1.6, 3.0)
    for l, col in [(0, P["muted"]), (1, P["a1"]), (2, P["a2"])]:
        pl.curve(lambda r, ll=l: ll * (ll + 1) / (2 * r * r) - 1 / r if r > 0.02 else None, 400, col, 4 if l else 3)
    pl.axes(xticks=[(2, ""), (4, ""), (6, ""), (8, "")], yticks=[(-1, ""), (0, "0"), (1, "1"), (2, "2")])
    pl.mtext(6.05, 1.66, "l = 0 : pure Coulomb -1/r", 20, P["muted"], "start")
    pl.mtext(6.05, 1.40, "l = 1 : + l(l+1)/2r^2 wall", 20, P["a1"], "start")
    pl.mtext(6.05, 1.14, "l = 2 : steeper well farther out", 20, P["a2"], "start")
    pl.mtext(3.4, -1.35, "centrifugal barrier keeps l > 0 states off the origin", 21, P["a4"], "start")
    pl.hline(0, P["axis"], 2)
    pl.text(120, 46, "RADIAL EFFECTIVE POTENTIAL (HYDROGENIC)", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------- TH: Carnot cycle
def th_carnot():
    pl = Plot()
    pl.frame(120, 80, 1160, 600, xlab="V", ylab="P")
    pl.domain(0.6, 4.6, 0.2, 2.9)
    nR, T1, T2 = 1.0, 2.4, 1.5
    g = 5 / 3
    Va = 1.0
    Vb = 1.6
    Vc = Vb * (T1 / T2) ** (1 / (g - 1))
    Vd = Va * (T1 / T2) ** (1 / (g - 1))
    iso1 = lambda V: nR * T1 / V
    iso2 = lambda V: nR * T2 / V
    kB = nR * T1 * Vb ** (g - 1)
    kA = nR * T1 * Va ** (g - 1)
    adb = lambda V: kB / V ** g
    ada = lambda V: kA / V ** g
    xs = lambda a, b2, n=26: [a + (b2 - a) * i / n for i in range(n + 1)]
    # enclosed area FIRST (translucent, beneath everything)
    pts = [(V, iso1(V)) for V in xs(Va, Vb)] + [(V, adb(V)) for V in xs(Vb, Vc)] +           [(V, iso2(V)) for V in xs(Vc, Vd)] + [(V, ada(V)) for V in xs(Vd, Va)]
    pl.poly([(pl.mx(x), pl.my(y)) for x, y in pts], "none", 0, close=True, fill=P["a2"], op=0.22)
    pl.axes(xticks=[(Va, "Va"), (Vb, "Vb"), (Vd, "Vd"), (Vc, "Vc")],
            yticks=[(nR * T1 / Va, "Pmax")])
    # cycle legs on top (isotherms = hot red / cold blue, adiabats = green)
    pl.curve(lambda V: iso1(V) if Va - 0.02 <= V <= Vb else None, 160, P["a3"], 6)
    pl.curve(lambda V: adb(V) if Vb <= V <= Vc else None, 200, P["a4"], 4)
    pl.curve(lambda V: iso2(V) if Vd - 0.02 <= V <= Vc else None, 160, P["a1"], 6)
    pl.curve(lambda V: ada(V) if Va <= V <= Vd else None, 200, P["a4"], 4)
    for x, y, s2, c in [(Va, iso1(Va), "A", "a3"), (Vb, iso1(Vb), "B", "a3"),
                        (Vc, iso2(Vc), "C", "a1"), (Vd, iso2(Vd), "D", "a1")]:
        offs={"A":(-0.12,0.2,"end"),"B":(0.12,0.2,"start"),"C":(0.12,-0.18,"start"),"D":(-0.02,0.2,"middle")}[s2]
        pl.mdot(x, y, 7, P[c]); pl.mtext(x + offs[0], y + offs[1], s2, 25, P[c], offs[2])
    pl.mtext(2.45, 1.32, "W_net = area", 23, P["ink"], "middle")
    pl.mtext(1.7, 2.74, "A->B : absorbs Q1 at T1 (isotherm)", 19, P["a3"], "start")
    pl.mtext(4.54, 1.92, "C->D : rejects Q2 at T2 (isotherm)", 19, P["a1"], "end")
    pl.mtext(0.72, 0.52, "D->A : adiabatic compression", 19, P["a4"], "start")
    pl.mtext(4.54, 2.36, "B->C : adiabatic expansion (P V^g = const)", 19, P["a4"], "end")
    pl.mtext(4.52, 0.62, "eta = 1 - T2/T1 (hard ceiling)", 20, P["a2"], "end")
    pl.text(120, 46, "CARNOT ENGINE ON THE P-V PLANE", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------- TH: phase diagram
def th_phase():
    pl = Plot()
    pl.frame(120, 80, 1160, 600, xlab="T", ylab="P")
    pl.domain(0, 10, 0, 8)
    pl.axes(xticks=[], yticks=[], box=False)
    # sublimation curve (origin-ish to triple), fusion curve (steep up), vaporization (triple to critical)
    TP = (3.0, 2.0); CP = (8.2, 6.1)
    pl.curve(lambda T: 2.0 * math.exp(-1.1 * (TP[0] - T)) if T <= TP[0] else None, 200, P["a1"], 5)
    pl.curve(lambda T: TP[1] + (CP[1] - TP[1]) * (1 - math.exp(-(T - TP[0]) / 2.4)) / (1 - math.exp(-(CP[0] - TP[0]) / 2.4)) if TP[0] <= T <= CP[0] else None, 300, P["a1"], 5)
    pl.curve(lambda T: TP[1] + 1.55 * (T - TP[0]) + 0.10 * (T - TP[0]) ** 2 if TP[0] <= T <= 9.6 else None, 200, P["a1"], 5)
    pl.mdot(TP[0], TP[1], 9, P["a2"]); pl.mtext(TP[0] + 0.25, TP[1] - 0.36, "TRIPLE POINT", 23, P["a2"], "start")
    pl.mdot(CP[0], CP[1], 8, P["a3"])
    pl.mtext(CP[0] - 0.2, CP[1] + 0.42, "critical point (line ENDS)", 21, P["a3"], "end")
    pl.mtext(1.05, 5.9, "SOLID", 32, P["ink"], "middle")
    pl.mtext(5.6, 5.3, "LIQUID", 32, P["ink"], "middle")
    pl.mtext(5.7, 1.0, "GAS", 32, P["ink"], "middle")
    pl.mtext(0.35, 1.1, "sublimation", 19, P["muted"], "start")
    pl.mtext(6.6, 4.05, "vaporisation", 19, P["muted"], "start")
    pl.mtext(6.4, 6.9, "fusion (negative slope for water!)", 19, P["muted"], "start")
    pl.mtext(0.35, 7.5, "Gibbs phase rule at triple point:  F = C - P + 2 = 0  (invariant)", 21, P["a4"], "start")
    pl.text(120, 46, "P-T PHASE DIAGRAM OF A PURE SUBSTANCE", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------- TE: Langevin
def te_langevin():
    pl = Plot()
    pl.frame(120, 80, 1160, 600, xlab="x = mu B / kT", ylab="L(x)")
    pl.domain(0, 10, 0, 1.1)
    L = lambda x: 1 / math.tanh(x) - 1 / x if x > 1e-9 else 0.0
    pl.axes(xticks=[(2, "2"), (4, "4"), (6, "6"), (8, "8")], yticks=[(1 / 3, "1/3"), (1, "1")])
    pl.mtext(0.22, 1.045, "(saturation)", 19, P["muted"], "start")
    pl.curve(L, 500, P["a1"], 5)
    pl.seg([(0, 0), (3.0, 1.0)], P["a2"], 3, dash="9 7")
    pl.mtext(4.7, 0.66, "small x: L = x/3 (Curie regime)", 20, P["a2"], "start")
    pl.hline(1, P["muted"], 2, "6 8")
    pl.mtext(6.3, 1.045, "x >> 1: moments fully aligned (L -> 1)", 21, P["muted"], "start")
    pl.mtext(0.25, 0.55, "M = N mu L(x)", 24, P["a4"], "start")
    pl.mtext(0.25, 0.44, "chi = N mu^2 mu0 / 3 kT  (Curie law)", 20, P["a4"], "start")
    pl.text(120, 46, "LANGEVIN PARAMAGNETISM", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------- TE: BEC condensate
def te_bec():
    pl = Plot()
    pl.frame(120, 80, 1160, 600, xlab="T / Tc", ylab="fraction")
    pl.domain(0, 1.6, 0, 1.12)
    frac = lambda t: 1 - t ** 1.5 if t <= 1 else 0.0
    pl.axes(xticks=[(1, "Tc")], yticks=[(1, "1")])
    pl.curve(frac, 400, P["a1"], 5)
    pl.curve(lambda t: t ** 1.5 if t <= 1 else 1.0, 400, P["a2"], 4)
    pl.vline(1, P["a3"], 2, "6 8")
    pl.mtext(0.38, 0.18, "condensate: 1 - (T/Tc)^1.5", 19, P["a1"], "start")
    pl.mtext(1.03, 1.055, "thermal (excited) fraction", 20, P["a2"], "start")
    pl.mtext(1.05, 0.55, "T >= Tc : all atoms thermal", 20, P["a3"], "start")
    pl.mtext(0.04, 1.055, "macroscopic occupation of the ground state", 19, P["muted"], "start")
    pl.text(120, 46, "BOSE-EINSTEIN CONDENSATE FRACTION", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------- EL: zener
def el_zener():
    pl = Plot()
    pl.frame(140, 80, 1160, 600, xlab="V (V)", ylab="I (mA)")
    pl.domain(-7, 2, -6, 4)
    pl.axes(xticks=[(-6, "-Vz  (-6 V)"), (0, "0"), (0.7, "+0.7")], yticks=[(-5, "-5"), (0, "0")])
    Is, nVt = 1e-3, 0.052
    def iv(V):
        if V > -6:
            return Is * (math.exp(V / nVt) - 1) * 1.0
        return -0.02 - (V + 6) / 0.5
    pl.curve(lambda V: iv(V) if V <= 0.81 else None, 900, P["a1"], 5)
    pl.hline(0, P["muted"], 1, "3 6")
    pl.vline(-6, P["a3"], 2, "6 7", y0=-6, y1=0)
    pl.mtext(-5.85, -4.4, "ZENER region: sharp breakdown, Vz constant", 20, P["a3"], "start")
    pl.mtext(0.55, 2.9, "forward: normal diode", 20, P["a1"], "end")
    pl.mtext(-5.9, 0.35, "regulator use: hold REVERSE Vz, series R eats the rest", 19, P["a4"], "start")
    pl.mtext(-5.9, -0.45, "slope 1/rz -> rz small = good regulation", 19, P["muted"], "start")
    pl.text(120, 46, "ZENER DIODE I-V - BUILT FOR BREAKDOWN", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------- EL: MOSFET family
def el_mosfet():
    pl = Plot()
    pl.frame(140, 80, 1160, 600, xlab="VDS (V)", ylab="ID")
    pl.domain(0, 10, 0, 10.5)
    pl.axes(xticks=[(2, ""), (4, ""), (6, ""), (8, "")], yticks=[])
    K = 0.55
    for vgs, col in [(3, P["muted"]), (4, P["a1"]), (5, P["a2"]), (6, P["a4"])]:
        vov = vgs - 2.0
        def idd(v, vov=vov):
            if v < vov:
                return K * (2 * vov * v - v * v)
            return K * vov * vov * (1 + 0.015 * v)
        pl.curve(idd, 420, col, 4)
        pl.mtext(9.9, idd(10) + 0.18, "VGS=%d V" % vgs, 20, col, "end")
    pl.curve(lambda v: K * v * v / 1.15 if v <= 8.4 else None, 200, P["a3"], 3, dash="10 7")
    pl.mtext(5.1, 8.3, "ohmic | saturation  boundary  (VDS = VGS - VT)", 19, P["a3"], "start")
    pl.mtext(0.9, 0.85, "ohmic (linear)", 20, P["muted"], "start")
    pl.mtext(9.7, 1.7, "ID_sat = (K/2)(VGS-VT)^2", 20, P["muted"], "end")
    pl.text(120, 46, "MOSFET OUTPUT CHARACTERISTICS", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------- EL: op-amp golden rules
def el_opamp():
    pl = Plot()
    # triangle
    pl.poly([(430, 150), (430, 480), (740, 315)], P["a1"], 4, close=True)
    pl.text(455, 250, "-", 34, P["ink"], "middle")
    pl.text(455, 400, "+", 30, P["ink"], "middle")
        # input resistor + virtual ground node
    pl.zigzag(120, 250, 330, 250, 6, 13, P["a2"], 3)
    pl.text(225, 222, "R1", 22, P["a2"], "middle")
    pl.line(330, 250, 430, 250, P["axis"], 3)
    pl.circle(330, 250, 7, P["a4"], 2)
    pl.text(80, 258, "Vin", 22, P["ink"], "middle")
    pl.ground(430, 400, P["a3"], 3)
    pl.text(80, 292, "VIRTUAL GROUND (V- = V+ = 0)", 19, P["a4"], "start")
    # feedback
    pl.line(330, 250, 330, 120, P["axis"], 3)
    pl.zigzag(330, 120, 660, 120, 6, 13, P["a3"], 3)
    pl.line(660, 120, 790, 120, P["axis"], 3)
    pl.line(790, 120, 790, 250, P["axis"], 3)
    pl.line(740, 315, 790, 315, P["axis"], 3)
    pl.line(790, 250, 790, 315, P["axis"], 3)
    pl.text(500, 92, "Rf", 22, P["a3"], "middle")
    pl.text(862, 300, "Vout", 22, P["ink"], "start")
    pl.arrow(740, 315, 850, 315, P["a4"], 4)
    # rules box
    rules = ["RULE 1:  no current into the inputs", "RULE 2:  negative feedback forces  V+ = V-",
             "=>  I1 = Vin/R1 flows ENTIRELY through Rf", "=>  Vout = -(Rf/R1) Vin   (exact, not approximate)"]
    for i, r in enumerate(rules):
        pl.text(120, 560 + i * 40, r, 22, P["a4" if i > 1 else "muted"], "start")
    pl.text(110, 46, "OP-AMP GOLDEN RULES AT WORK", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------- AM: line shapes
def am_lineshape():
    pl = Plot()
    pl.frame(120, 80, 1160, 600, xlab="detuning  (nu - nu0)", ylab="intensity")
    pl.domain(-4, 4, 0, 1.12)
    lor = lambda x: (0.5 ** 2) / (x * x + 0.5 ** 2)
    gau = lambda x: math.exp(-((x / 0.72) ** 2))
    pl.axes(xticks=[(-2, ""), (0, "0"), (2, "")], yticks=[(0.5, "1/2"), (1, "peak")])
    pl.curve(lor, 600, P["a1"], 5)
    pl.curve(gau, 400, P["a3"], 4)
    pl.mtext(3.92, 0.17, "LORENTZIAN: fat 1/x^2 wings", 20, P["a1"], "end")
    pl.mtext(-3.95, 0.72, "GAUSSIAN: tight exp(-x^2) wings", 20, P["a3"], "start")
    pl.marrows(-0.5, 0.56, 0.5, 0.56, P["a2"], 3)
    pl.marrows(0.5, 0.56, -0.5, 0.56, P["a2"], 3)
    pl.mtext(0, 0.64, "same FWHM", 20, P["a2"])
    pl.mtext(-3.9, 1.04, "real lines = VOIGT (convolution of both)", 20, P["a4"], "start")
    pl.text(120, 46, "SPECTRAL LINE PROFILES - LORENTZ vs GAUSS", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------- AM: Morse potential
def am_morse():
    pl = Plot()
    pl.frame(120, 80, 1160, 600, xlab="r - re", ylab="V(r)")
    pl.domain(-0.9, 3.4, -1.15, 1.5)
    a = 0.9
    morse = lambda x: (1 - math.exp(-a * x)) ** 2 - 1
    pl.axes(xticks=[(0, "0 (re)")], yticks=[(-1, "-De"), (0, "0")])
    pl.curve(morse, 600, P["a1"], 5)
    pl.curve(lambda x: a * a * x * x - 1, 300, P["muted"], 3, dash="8 7")
    pl.hline(-1, P["muted"], 1, "3 6", x0=-0.9, x1=0)
    # vibrational levels, anharmonic spacing shrinking; each spans wall to wall
    E, dE = -0.975, 0.145
    n = 0
    while E < -0.02 and n < 9:
        s = math.sqrt(max(E + 1, 1e-9))
        xl = -math.log(1 + s) / a
        xr = -math.log(1 - s) / a
        pl.hline(E, P["a2"], 2, "5 6", x0=xl + 0.04, x1=xr - 0.04)
        E += dE * (1 - 0.16 * n)
        n += 1
    pl.mtext(3.3, -0.50, "ANHARMONIC (Morse):", 20, P["a1"], "end")
    pl.mtext(3.3, -0.68, "levels converge to De", 19, P["a1"], "end")
    pl.mtext(-0.82, 1.28, "harmonic parabola (small oscillations)", 19, P["muted"], "start")
    pl.mtext(-0.2, 0.12, "dissociation limit De", 19, P["muted"], "start")
    pl.text(120, 46, "MORSE POTENTIAL vs HARMONIC APPROXIMATION", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------- AM: rotational spectrum
def am_rotational():
    pl = Plot()
    pl.frame(110, 120, 1160, 620, xlab="", ylab="")
    pl.domain(0, 11, -0.6, 6.4)
    B = 0.11
    # LEFT: ladder
    pl.text(320, 104, "TERM LADDER   F(J) = B J (J+1)", 22, P["ink"], "middle", weight="bold")
    for j in range(8):
        E = B * j * (j + 1)
        pl.seg([(0.7, E), (2.6, E)], P["a1"], 4)
        dy = {0: -0.14, 1: 0.20}.get(j, 0.03)
        pl.mtext(2.75, E + dy, "J=%d" % j, 19, P["muted"], "start")
        if j < 7:
            pl.marrows(1.15, E, 1.15, E + B * ((j + 1) * (j + 2) - j * (j + 1)), P["a2"], 2)
    pl.mtext(3.7, 5.75, "Delta E = 2B(J+1):", 20, P["a2"], "start")
    pl.mtext(3.7, 5.42, "gaps GROW up the ladder", 20, P["a2"], "start")

    # RIGHT: stick spectrum with intensity envelope
    pl.text(865, 104, "ABSORPTION LINES  (spacing 2B)", 22, P["ink"], "middle", weight="bold")
    def inten(J):
        return (2 * J + 1) * math.exp(-B * J * (J + 1) / 0.30)
    for J in range(8):
        x = 5.2 + J * 0.62
        h = inten(J) * 3.6
        pl.seg([(x, 0), (x, h)], P["a3"], 6)
        pl.mtext(x, -0.32, "%d-%d" % (J, J + 1), 16, P["muted"])
    env = [(5.2 + J * 0.62, inten(J) * 3.6) for J in [i / 5.0 for i in range(41)]]
    pl.seg(env, P["a2"], 3)
    pl.mtext(8.35, 4.75, "intensity ~ (2J+1) x", 18, P["a2"], "start")
    pl.mtext(8.35, 4.42, "Boltzmann factor", 18, P["a2"], "start")
    pl.mtext(7.6, 0.55, "line positions:  4B, 6B, 8B ...", 19, P["a4"], "start")
    pl.text(110, 60, "ROTATIONAL ABSORPTION - THE RIGID ROTOR", 30, P["ink"], "start", weight="bold")
    pl.text(110, 662, "left: E ladder, allowed Delta J = +1 jumps  |  right: equally spaced microwave lines", 20, P["muted"], "start")
    return pl.emit()


# ---------------------------------------------------------- MMA: Green's function
def mm_green():
    pl = Plot()
    pl.frame(120, 80, 1160, 600, xlab="t", ylab="response")
    pl.domain(-1.2, 10, -1.25, 1.6)
    pl.axes(xticks=[(0, "t = tau (impulse)")], yticks=[(0, "0"), (1, "")])
    # impulse spike
    pl.arrow(pl.mx(0), pl.my(0), pl.mx(0), pl.my(1.5), P["a3"], 4)
    pl.mtext(0.15, 1.55, "delta(t - tau)", 22, P["a3"], "start")
    # causal response: y = 0 before, decaying oscillation after
    pl.seg([(-1.2, 0), (0, 0)], P["a1"], 5)
    pl.curve(lambda t: math.exp(-0.22 * t) * math.sin(1.9 * t) if t >= 0 else None, 600, P["a1"], 5)
    pl.curve(lambda t: math.exp(-0.22 * t), 300, P["muted"], 2, dash="6 8")
    pl.curve(lambda t: -math.exp(-0.22 * t), 300, P["muted"], 2, dash="6 8")
    pl.mtext(4.05, 1.14, "G = e^{-g(t-tau)} sin(w(t-tau))/w,", 20, P["a1"], "start")
    pl.mtext(4.05, 0.88, "zero for t < tau (causality)", 20, P["a4"], "start")
    pl.mtext(-1.1, -1.05, "y(t) = integral G(t,tau) f(tau) dtau  -  impulse response stitches every answer", 21, P["muted"], "start")
    pl.text(120, 46, "GREEN'S FUNCTION - IMPULSE => DRIVEN RESPONSE", 30, P["ink"], "start", weight="bold")
    return pl.emit()


def build():
    del FIGS[:]
    reg(QM, "ff-qm-stern", "stern-gerlach", "Pointed Pole Piece", 0,
        "Stern-Gerlach apparatus",
        "Silver atoms through an inhomogeneous magnet land in TWO discrete spots - direct proof of space quantisation of spin-1/2. Replaces the old ASCII sketch.",
        qm_stern())
    reg(QM, "ff-qm-veff", "central potential reduction", "Centrifugal Barrier", 0,
        "Radial effective potential",
        "The l(l+1)/2mr^2 centrifugal wall stacked on the Coulomb -1/r: higher-l states are expelled from the origin, which is why 2p never feels the contact term. Replaces the old ASCII sketch.",
        qm_veff())
    reg(TH, "ff-th-carnot", "second law of thermodynamics", None, 2,
        "Carnot cycle on P-V",
        "Two isotherms bridged by two adiabats; the enclosed area is W_net and the efficiency 1 - T2/T1 caps every engine. Shaded with the true PV^gamma adiabats.",
        th_carnot())
    reg(TH, "ff-th-phase", "phase equilibria", None, 1,
        "P-T phase diagram",
        "Sublimation, fusion and vaporisation lines meeting at the triple point; the vaporisation line terminates at the critical point. Gibbs rule gives F = 0 at the triple point.",
        th_phase())
    reg(TE, "ff-te-langevin", "classical langevin theory", "Langevin Function L(x)", 0,
        "Langevin function",
        "L(x) = coth x - 1/x: Curie-law linear onset x/3 at weak field, saturation at 1 for strong field - the classical theory of paramagnetism in one curve. Replaces the old ASCII sketch.",
        te_langevin())
    reg(TE, "ff-te-bec", "derivation of critical temperature", "Condensate Fraction", 0,
        "BEC condensate fraction",
        "N0/N = 1 - (T/Tc)^(3/2): below Tc the ground state devours a macroscopic fraction of atoms while the thermal cloud empties. Replaces the old ASCII sketch.",
        te_bec())
    reg(EL, "ff-el-zener", "zener diode", None, 1,
        "Zener I-V and regulation",
        "Forward it is a normal diode; the sharp reverse knee at -Vz with tiny dynamic resistance is the whole point of a Zener regulator. Plotted from the piecewise device model.",
        el_zener())
    reg(EL, "ff-el-mosfet", "mosfet", None, 1,
        "MOSFET output family",
        "ID-VDS curves stepped by VGS: ohmic triangle at low VDS, saturation plateau beyond VDS = VGS - VT, boundary parabola drawn from the same model.",
        el_mosfet())
    reg(EL, "ff-el-opamp", "ideal op-amp characteristics", None, 1,
        "Op-amp golden rules",
        "Inverting amplifier anatomy: virtual ground at the minus input, input current wholly diverted into Rf, exact gain -Rf/R1 - the two rules doing all the work.",
        el_opamp())
    reg(AM, "ff-am-lineshape", "width of spectral lines", "LORENTZIAN (Natural/Pressure)", 0,
        "Lorentzian vs Gaussian profiles",
        "Same FWHM, different souls: homogeneous broadening (natural/pressure) has fat 1/x^2 Lorentz wings, thermal Doppler is a tight Gaussian - real lines are the Voigt convolution. Replaces the old ASCII sketch.",
        am_lineshape())
    reg(AM, "ff-am-morse", "anharmonic oscillator model", "Morse Potential Curve", 0,
        "Morse potential and vibrational levels",
        "The anharmonic well: De(1 - e^{-a(r-re)})^2 with levels crowding toward dissociation, against the harmonic parabola that only works for small oscillations. Replaces the old ASCII sketch.",
        am_morse())
    reg(AM, "ff-am-rot", "rigid rotor model", "Rotational Absorption Spectrum", 0,
        "Rotational absorption spectrum",
        "Rigid rotor: growing ladder gaps 2B(J+1) collapse to perfectly equally spaced microwave lines, heights set by the (2J+1)e^{-E/kT} population envelope. Replaces the old ASCII sketch.",
        am_rotational())
    reg(MMA, "ff-mm-green", "green", None, 1,
        "Green's function impulse response",
        "A delta kick at t = tau produces the causal decaying oscillation G(t,tau); convolution with any drive f(tau) synthesises every particular solution - the whole point of the method.",
        mm_green())
    return FIGS
