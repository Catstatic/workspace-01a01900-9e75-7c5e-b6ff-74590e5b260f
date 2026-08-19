#!/usr/bin/env python3
"""FIGFORGE wave-3 part B: atomic x6, thermo+electro x3, QM x2.
All hide legacy ASCII pres; anchors are real heading fingerprints."""
import math
from cf_kernel import Plot, PAL

P = PAL
QM = "Quantum Mechanics.md"
TE = "thermo+ electronics+ experimental methods.md"
AM = "atomic and molecular physics.md"
FIGS = []


def reg(doc, fid, anchor, hide, skip, title, cap, svg):
    FIGS.append(dict(doc=doc, id=fid, anchor=anchor, hide=hide, skip=skip,
                     title=title, cap=cap, svg=svg))


# ------------------------------------------------- AM1: ESR hyperfine trees
def am_esr():
    pl = Plot()
    rows = [("H  (I = 1/2):  2 lines", [1, 1], "a1", 150),
            ("D  (I = 1):  triplet  1:1:1", [1, 1, 1], "a2", 300),
            ("CH3:  quartet  1:3:3:1", [1, 3, 3, 1], "a3", 460)]
    for name, ints, col, y in rows:
        pl.text(120, y - 38, name, 22, P[col], "start", weight="bold")
        pl.line(120, y, 900, y, P["axis"], 3)
        n = len(ints)
        gap = 70 if n < 4 else 58
        x0 = 590 - gap * (n - 1) / 2.0
        for i, hgt in enumerate(ints):
            x = x0 + i * gap
            pl.line(x, y, x, y - 22 - 58 * hgt / 3.0, P[col], 6)
        pl.text(920, y + 7, "spacing a (hyperfine)", 19, P["muted"], "start")
        if n >= 2:
            pl.arrow(x0, y + 30, x0 + gap, y + 30, P["muted"], 2)
            pl.arrow(x0 + gap, y + 30, x0, y + 30, P["muted"], 2)
    pl.text(120, 560, "n equivalent nuclei of spin I  ->  2 n I + 1 equally spaced lines;", 21, P["ink"], "start")
    pl.text(120, 598, "intensities follow the binomial coefficients (Pascal rule).", 21, P["muted"], "start")
    pl.text(90, 46, "ESR HYPERFINE SPLITTING - COUNTING THE NEIGHBOURS", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ------------------------------------------------- AM2: Raman scattering
def am_raman():
    pl = Plot()
    # LEFT: level diagram
    lv = [(60, 520, "v = 0", "a1"), (60, 400, "v = 1", "a2"), (60, 190, "virtual", "muted")]
    for x, y, lab, col in lv:
        pl.line(x, y, x + 330, y, P[col], 4 if lab != "virtual" else 2)
        pl.text(x + 6, y - 12, lab, 19, P[col], "start")
    pl.arrow(120, 520, 120, 196, P["a1"], 4)          # pump up
    pl.text(96, 370, "h nu_0", 19, P["a1"], "end")
    pl.arrow(160, 190, 160, 516, P["muted"], 3)       # Rayleigh
    pl.text(165, 350, "Rayleigh", 19, P["muted"], "start")
    pl.arrow(230, 190, 230, 396, P["a2"], 4)          # Stokes
    pl.text(236, 300, "Stokes", 19, P["a2"], "start")
    pl.text(236, 322, "(less energy)", 17, P["a2"], "start")
    pl.arrow(330, 400, 330, 196, P["a4"], 3)          # anti-Stokes pump from v=1
    pl.arrow(360, 190, 360, 276, P["a4"], 4)          # anti-Stokes down
    pl.text(372, 250, "anti-Stokes", 19, P["a4"], "start")
    # RIGHT: spectrum sticks
    pl.frame(560, 90, 1160, 560, xlab="", ylab="")
    pl.domain(-10, 10, 0, 10)
    pl.axes(xticks=[(-6, "-Dnu"), (0, "0"), (6, "+Dnu")], yticks=[])
    pl.seg([(0, 0), (0, 9.3)], P["muted"], 5)
    pl.seg([(-6, 0), (-6, 4.6)], P["a2"], 5)
    pl.seg([(6, 0), (6, 2.1)], P["a4"], 5)
    pl.seg([(-3, 0), (-3, 1.2)], P["a2"], 3)
    pl.seg([(3, 0), (3, 0.55)], P["a4"], 3)
    pl.mtext(0.6, 9.45, "Rayleigh (huge)", 19, P["muted"], "start")
    pl.mtext(-6.6, 5.0, "Stokes", 19, P["a2"], "end")
    pl.mtext(6.6, 2.5, "anti-Stokes", 19, P["a4"], "start")
    pl.mtext(-6.6, 0.9, "(brighter side)", 17, P["muted"], "end")
    pl.text(544, 84, "I", 22, P["ink"], "end")
    pl.text(1160, 640, "nu - nu0", 24, P["ink"], "end")
    pl.text(60, 590, "vibrational Raman: selection rule  Dv = +/-1 ;", 18, P["ink"], "start")
    pl.text(60, 618, "rotational Raman:  DJ = 0, +/-2  ->  spacing 4B", 18, P["ink"], "start")
    pl.text(90, 46, "RAMAN SCATTERING - STOKES vs ANTI-STOKES", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ------------------------------------------------- helper for laser level diagrams
def _laser(three):
    pl = Plot()
    if three:
        L = [("E3", 150, "pump band", "a1"), ("E2", 330, "METASTABLE (ms)", "a2"), ("E1", 540, "ground", "axis")]
        arrows = [((240, 540), (240, 156), "a1", "pump (lamp)", 4),
                  ((300, 154), (300, 326), "muted", "fast non-radiative", 3),
                  ((400, 334), (400, 536), "a3", "LASER  694.3 nm (ruby)", 6)]
    else:
        L = [("E3", 150, "pump band", "a1"), ("E2", 300, "METASTABLE", "a2"),
             ("E1", 440, "empties fast", "a4"), ("E0", 560, "ground", "axis")]
        arrows = [((240, 560), (240, 156), "a1", "810 nm pump", 4),
                  ((300, 154), (300, 296), "muted", "fast decay", 3),
                  ((420, 304), (420, 436), "a3", "LASER  1064 nm (Nd:YAG)", 6),
                  ((520, 444), (520, 556), "muted", "fast decay", 3)]
    for name, y, note, col in L:
        pl.line(150, y, 700, y, P[col], 5)
        pl.text(715, y + 8, name, 23, P[col], "start")
        pl.text(715, y + 32, note, 18, P["muted"], "start")
    for (x1, y1), (x2, y2), col, lab, w in arrows:
        up = y2 < y1
        lx = x2 + 16 if up else x2 + 24
        pl.arrow(x1, y1, x2, y2, P[col], w)
        pl.text(lx, (y1 + y2) / 2 + 8, lab, 20, P[col], "start")
    pl.text(90, 640, "Population inversion between E2 and the lower laser level = the whole game.", 20, P["muted"], "start")
    return pl


def am_laser3():
    pl = _laser(True)
    pl.text(90, 46, "THREE-LEVEL LASER (RUBY) - PUMP, RAIN, LASE", 30, P["ink"], "start", weight="bold")
    pl.text(90, 96, "Lower laser level IS the ground state: >50% of atoms must be pumped up - hard work.", 21, P["a3"], "start")
    return pl.emit()


def am_laser4():
    pl = _laser(False)
    pl.text(90, 46, "FOUR-LEVEL LASER (Nd:YAG) - EASY INVERSION", 30, P["ink"], "start", weight="bold")
    pl.text(90, 96, "Lower laser level E1 sits empty by construction: tiny pump power inverts E2.", 21, P["a4"], "start")
    return pl.emit()


# ------------------------------------------------- AM5: GaAs two-valley band
def am_gaas():
    pl = Plot()
    pl.frame(130, 80, 1160, 600, xlab="", ylab="E(k)")
    pl.domain(-1.2, 6.4, -0.2, 1.6)
    pl.axes(xticks=[(0, "G  (k=0)"), (4.1, "L point"), (5.3, "X point")], yticks=[(0.31, "0.31 eV"), (0.55, "EX")])
    # Gamma valley: light mass -> sharp parabola; L: heavy, offset up; X shadow
    pl.curve(lambda k: 0.5 * (k / 1.05) ** 2 if k <= 1.75 else None, 200, P["a1"], 5)
    pl.curve(lambda k: 0.31 + 0.5 * ((k - 4.1) / 1.6) ** 2 if 2.6 <= k <= 5.6 else None, 200, P["a2"], 5)
    pl.curve(lambda k: 0.55 + 0.5 * ((k - 5.3) / 2.1) ** 2 if 3.9 <= k <= 6.3 else None, 200, P["muted"], 4, dash="8 6")
    pl.mtext(0.3, 0.42, "G valley:", 20, P["a1"], "start")
    pl.line(372, 372, 296, 322, P["a1"], 2)
    pl.mtext(0.3, 0.65, "light mass m* = 0.067 m0", 20, P["a1"], "start")
    pl.mtext(0.3, 0.88, "high mobility ~ 8000", 20, P["a1"], "start")
    pl.mtext(4.2, 0.06, "L valley: heavy, slow", 20, P["a2"], "start")
    pl.line(1296, 477, 1135, 409, P["a2"], 2)
    pl.mtext(4.55, 1.5, "spill into slow valley", 18, P["muted"], "start")
    pl.mtext(4.55, 1.26, "pushed past 0.31 eV", 18, P["muted"], "start")
    pl.marrows(2.3, 0.74, 3.8, 0.56, P["a3"], 4)
    pl.mtext(2.05, 0.95, "field > 3.3 kV/cm", 20, P["a3"], "start")
    pl.text(1192, 688, "k", 26, P["ink"], "end")
    pl.text(60, 688, "Transferred-electron physics: fast drift ends in the heavy L valley - v DROPS with V.", 18, P["muted"], "start")
    pl.text(130, 46, "GaAs CONDUCTION BAND - THE TWO VALLEYS", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ------------------------------------------------- AM6: sodium term scheme
def am_alkali():
    pl = Plot()
    pl.frame(120, 80, 1160, 600, xlab="", ylab="E - E(3s)")
    pl.domain(0, 10, 0, 10)
    pl.axes(xticks=[], yticks=[])
    cols = [(1.6, "S terms (sharp)"), (4.6, "P terms (principal)"), (7.6, "D terms (diffuse)")]
    levels = [[(0.0, "3s"), (3.1, "4s"), (4.7, "5s"), (5.7, "6s"), (6.4, "limit")],
              [(2.1, "3p"), (4.1, "4p"), (5.3, "5p"), (6.1, "limit")],
              [(3.6, "3d"), (5.0, "4d"), (5.9, "limit")]]
    for (xc, name), lv in zip(cols, levels):
        pl.mtext(xc + 0.55, 9.55, name, 19, P["ink"], "middle", weight="bold")
        for y, lab in lv:
            yv = 0.8 + y
            dash = "4 6" if lab == "limit" else None
            pl.seg([(xc - 0.7, yv), (xc + 1.8, yv)], P["a1"] if name[0] == "S" else (P["a2"] if name[0] == "P" else P["a4"]), 4, dash=dash)
            pl.mtext(xc + 1.95, yv + 0.1, lab, 18, P["muted"], "start")
    # D lines 3p -> 3s : 589 nm
    pl.marrows(3.4, 2.9, 2.3, 0.9, P["a3"], 4)
    pl.marrows(3.53, 2.9, 2.43, 0.9, P["a3"], 3)
    pl.mtext(3.7, 1.6, "D1/D2: 589.6 / 589.0 nm", 20, P["a3"], "start")
    # a series progression toward limit
    for tgt in (4.9, 6.1, 6.55):
        pl.marrows(2.3, 0.9, 3.95, tgt, P["muted"], 2)
    pl.mtext(10.0, 7.75, "series converge to the", 19, P["muted"], "end")
    pl.mtext(10.0, 7.48, "ionisation limit", 19, P["muted"], "end")
    pl.arrow(946, 216, 790, 238, P["muted"], 2)
    pl.mtext(8.3, 2.9, "screening: S deepest,", 17, P["ink"], "start")
    pl.mtext(8.3, 2.6, "P higher, D ~ H-like", 17, P["ink"], "start")
    pl.text(120, 46, "ALKALI (Na) TERM SCHEME & THE D LINES", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ------------------------------------------------- TE1: Gunn diode I-V
def te_gunniv():
    pl = Plot()
    pl.frame(130, 80, 1160, 600, xlab="V", ylab="I")
    pl.domain(0, 3.6, 0, 2.1)
    PTS = [(0, 0), (0.65, 0.62), (1.3, 1.0), (1.85, 0.72), (2.35, 0.56), (3.4, 0.82)]
    def cr(t, a, b2, c, d):
        t2, t3 = t * t, t * t * t
        return 0.5 * ((2 * b2) + (-a + c) * t + (2 * a - 5 * b2 + 4 * c - d) * t2 + (-a + 3 * b2 - 3 * c + d) * t3)
    def iv(v):
        X = [q[0] for q in PTS]
        if v >= X[-1]:
            return None
        i = max(j for j in range(len(X) - 1) if X[j] <= v)
        y = lambda k: PTS[min(max(k, 0), len(PTS) - 1)][1]
        return cr((v - X[i]) / (X[i + 1] - X[i]), y(i - 1), y(i), y(i + 1), y(i + 2))
    pl.shade_v(1.3, 2.35, P["a3"], 0.10)
    pl.axes(xticks=[(1.3, "V_th"), (3, "")], yticks=[(1, "I_peak")])
    pl.curve(iv, 500, P["a1"], 5)
    pl.mdot(1.3, 1.0, 7, P["a2"])
    pl.mdot(2.35, 0.56, 7, P["a3"])
    pl.mtext(1.42, 1.08, "threshold", 19, P["a2"], "start")
    pl.mtext(2.3, 0.34, "valley (domains shuttle)", 19, P["a3"], "start")
    pl.mtext(1.55, 1.75, "NEGATIVE differential resistance:", 20, P["a3"], "start")
    pl.mtext(1.55, 1.52, "dI/dV < 0  ->  microwave oscillation", 20, P["muted"], "start")
    pl.mtext(0.28, 0.35, "ohmic rise", 20, P["a1"], "start")
    pl.text(130, 46, "GUNN DIODE I-V - THE NEGATIVE-RESISTANCE HILL", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ------------------------------------------------- TE2: gas-detector voltage regions
def te_detector():
    pl = Plot()
    pl.frame(130, 80, 1160, 600, xlab="applied voltage  V", ylab="collected charge (log)")
    pl.domain(0, 10, 0, 10)
    pl.axes(xticks=[], yticks=[])
    def seg2(pts, col, w=4):
        pl.seg(pts, col, w)
    # ionisation plateau then proportional climb then GM plateau (beta & alpha curves)
    seg2([(0.3, 1.2), (1.4, 2.6), (2.8, 2.6), (4.6, 5.6), (5.6, 5.9), (6.0, 6.4), (8.6, 6.4), (9.7, 8.6)], P["a1"], 5)
    seg2([(0.3, 0.5), (1.4, 1.5), (2.8, 1.5), (4.6, 3.9), (5.6, 4.2), (6.0, 4.6), (8.6, 4.6), (9.7, 6.9)], P["a2"], 4)
    pl.mtext(9.7, 1.9, "beta", 20, P["a2"], "end")
    pl.mtext(9.7, 7.4, "alpha", 20, P["a1"], "end")
    labs = [(1.55, 0.35, "ionisation"), (3.7, 7.6, "proportional x10^3-5"),
            (7.3, 7.3, "Geiger-Mueller"), (5.05, 6.7, "limited"), (9.15, 9.3, "discharge!")]
    for x, y, s in labs:
        pl.mtext(x, y, s, 19, P["ink"], "middle")
    for x0, x1, lab in [(0.4, 1.6, "recombination")]:
        pl.mtext((x0 + x1) / 2, 8.6, lab, 16, P["muted"], "middle")
    for x in (1.4, 2.8, 4.6, 5.6, 6.0, 8.6):
        pl.vline(x, P["muted"], 1, "3 8")
    pl.mtext(0.55, 9.4, "plateaus = sweet spots: every ion pair is counted the same", 19, P["a4"], "start")
    pl.text(130, 46, "GAS DETECTOR VOLTAGE REGIONS", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ------------------------------------------------- TE3: 1D Ising heat capacity
def te_ising():
    pl = Plot()
    pl.frame(140, 80, 1160, 600, xlab="kT / J", ylab="C / Nk")
    pl.domain(0, 3.2, 0, 1.15)
    pl.axes(xticks=[(0.8336, "T_hump ~ 0.834 J/k"), (1, ""), (2, ""), (3, "")], yticks=[(0.439, "0.439")])
    C = lambda t: (1 / t) ** 2 / (math.cosh(1.0 / t) ** 2) if t > 0.02 else 0.0
    pl.curve(C, 500, P["a1"], 5)
    tp = 0.8336
    pl.vline(tp, P["a2"], 2, "6 8", y0=0, y1=C(tp))
    pl.mdot(tp, C(tp), 7, P["a2"])
    pl.mtext(0.2, 0.62, "C/Nk = (J/kT)^2 sech^2(J/kT)  -  exact", 21, P["a1"], "start")
    pl.mtext(1.35, 0.83, "broad SCHOTTKY hump only:", 21, P["a2"], "start")
    pl.mtext(1.35, 0.60, "correlations switch on gradually;", 20, P["muted"], "start")
    pl.mtext(1.35, 0.38, "NO sharp Tc in 1D (DOGMA)", 20, P["a3"], "start")
    pl.text(140, 46, "1D ISING HEAT CAPACITY - HOT BUT NEVER ORDERED", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ------------------------------------------------- QM1: linear Stark n=2
def qm_stark():
    pl = Plot()
    pl.frame(140, 90, 1160, 600, xlab="electric field  E0", ylab="E")
    pl.domain(0, 1.15, -1.35, 1.35)
    pl.axes(xticks=[(0, "E0 = 0"), (1, "E0")], yticks=[(0, "E(2)")])
    pl.line(pl.mx(0.001), pl.my(0), pl.mx(0.12), pl.my(0), P["ink"], 8)
    pl.mtext(0.13, 0.18, "n = 2 level (4-fold degenerate)", 20, P["ink"], "start")
    for k, col, lab in [(1, "a3", "shifts +3 e a0 E0  (1 state)"),
                        (0, "a2", "unshifted  (2 states)"),
                        (-1, "a1", "shifts -3 e a0 E0  (1 state)")]:
        pl.curve(lambda f, kk=k: kk * f, 40, P[col], 4)
        pl.mtext(1.16, k, lab, 19, P[col], "end")
    pl.mtext(0.35, 0.86, "splitting is LINEAR in the field", 20, P["a4"], "start")
    pl.mtext(0.35, 1.06, "(hydrogen's accidental degeneracy)", 19, P["a4"], "start")
    pl.mtext(0.5, -1.13, "psi mixes l = 0,1  ->  parity is lost, a dipole is born", 19, P["muted"], "start")
    pl.text(140, 52, "LINEAR STARK EFFECT IN HYDROGEN (n = 2)", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ------------------------------------------------- QM2: exchange splitting (helium)
def qm_exchange():
    pl = Plot()
    # THREE panels: unperturbed | + Coulomb J | +/- exchange K
    def lvl(xc, y, w, col, lab, sub, wl=5):
        pl.line(xc - w, y, xc + w, y, P[col], wl)
        pl.text(xc + w + 14, y + 7, lab, 20, P[col], "start")
        if sub:
            pl.text(xc + w + 14, y + 30, sub, 17, P["muted"], "start")
    yU, yJ, yP, yT = 170, 260, 380, 490
    xc1, xc2, xc3 = 240, 640, 1040
    lvl(xc1 - 100, yU, 90, "ink", "Ea + Eb", "unperturbed")
    # panel connectors
    pl.arrow(xc1 - 6, (yU + yJ) / 2 + 25, xc1 - 6, yJ - 8, P["muted"], 2)
    lvl(xc2 - 460, yJ, 90, "a2", "Ea + Eb + J", "direct Coulomb, both spins")
    pl.arrow(xc2 - 466, (yJ + yP) / 2 + 15, xc2 - 466, yP - 8, P["muted"], 2)
    pl.arrow(xc2 - 466, (yJ + yT) / 2 - 15, xc2 - 466, yT + 8, P["muted"], 2)
    lvl(xc3 - 320, yP, 90, "a3", "J + K : SINGLET (S=0, 1 state)", "symmetric space - PARA")
    lvl(xc3 - 320, yT, 90, "a1", "J - K : TRIPLET (S=1, 3 states)", "antisymmetric space - ORTHO")
    pl.text(120, 580, "K > 0  ->  triplet lies LOWER: same orbital, opposite spins keeps the electrons apart (Hund).", 20, P["muted"], "start")
    pl.text(120, 620, "Pauli demands total antisymmetry: spin pairing dictates the spatial energy. That is exchange.", 20, P["muted"], "start")
    pl.text(90, 46, "DIRECT vs EXCHANGE INTEGRALS - WHY HELIUM SPLITS INTO PARA & ORTHO", 30, P["ink"], "start", weight="bold")
    return pl.emit()


def build():
    del FIGS[:]
    reg(AM, "ff-am-esr", "hyperfine structure splitting in esr", "ESR HYPERFINE", 0,
        "ESR hyperfine line counting",
        "2nI+1 equally spaced lines from n equivalent nuclei with binomial intensities - the spectrum reads off the radical's neighbourhood. Replaces the old ASCII sketch.",
        am_esr())
    reg(AM, "ff-am-raman", "quantum theory and selection rules", "RAMAN SCATTERING", 0,
        "Raman Stokes and anti-Stokes",
        "The photon trades a quantum with the molecule: down-shifted Stokes and weaker up-shifted anti-Stokes flank a huge Rayleigh line. Replaces the old ASCII sketch.",
        am_raman())
    reg(AM, "ff-am-laser3", "three-level laser", "THREE-LEVEL", 0,
        "Three-level laser scheme",
        "Ruby anatomy: pump band, metastable shelf, laser back to the GROUND state - over half the atoms must go up. Replaces the old ASCII sketch.",
        am_laser3())
    reg(AM, "ff-am-laser4", "four-level laser", "FOUR-LEVEL", 0,
        "Four-level laser scheme",
        "Nd:YAG anatomy: the lower laser level drains itself, so inversion is nearly free - the commercially dominant design. Replaces the old ASCII sketch.",
        am_laser4())
    reg(AM, "ff-am-gaas", "gunn diode", "Conduction Band E(k) Structure of GaAs", 0,
        "GaAs two-valley conduction band",
        "A light fast Gamma valley with a heavy slow L valley 0.31 eV above: field-driven transfer between them is the GaAs Gunn effect. Replaces the old ASCII sketch.",
        am_gaas())
    reg(AM, "ff-am-alkali", "spectral series of alkali", "Alkali Transitions", 0,
        "Sodium term scheme and D lines",
        "S, P, D term ladders converging to the ionisation limit; the 3p -> 3s D1/D2 doublet at 589 nm. Replaces the old ASCII sketch.",
        am_alkali())
    reg(TE, "ff-te-gunniv", "gunn diode", "Gunn Diode I-V Curv", 0,
        "Gunn diode negative resistance",
        "I-V climbs, crests at threshold, then droops into the domain region dI/dV < 0 that self-oscillates at microwave frequency. Replaces the old ASCII sketch.",
        te_gunniv())
    reg(TE, "ff-te-detector", "radiation detectors", "Gas Detector Voltage Re", 0,
        "Gas-detector voltage regions",
        "Collected charge versus bias through recombination, ionisation plateau, proportional avalanche and Geiger-Mueller plateau, ending in discharge. Replaces the old ASCII sketch.",
        te_detector())
    reg(TE, "ff-te-ising", "zero external field", "1D Ising Heat Capaci", 0,
        "1D Ising heat capacity",
        "Exact C/Nk = (J/kT)^2 sech^2(J/kT): a broad Schottky hump and NO finite-temperature phase transition. Replaces the old ASCII sketch.",
        te_ising())
    reg(QM, "ff-qm-stark", "applications of tipt", "Unperturbed (n=2)", 0,
        "Linear Stark effect at n=2",
        "The four-fold degenerate n=2 shell fans out linearly with field, +3ea0E0 / 0 / -3ea0E0, once parity is lost to the mixing. Replaces the old ASCII sketch.",
        qm_stark())
    reg(QM, "ff-qm-exchange", "exchange interaction", "Unperturbed Level E_a", 0,
        "Exchange splitting of helium",
        "The direct integral J raises both spin states; the exchange integral K then splits singlet above triplet - Pauli shapes the spectrum. Replaces the old ASCII sketch.",
        qm_exchange())
    return FIGS
