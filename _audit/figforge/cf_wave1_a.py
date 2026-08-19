#!/usr/bin/env python3
"""FIGFORGE wave-1 part A: nuclear x4, condensed matter x4, atomic x2, classical x3.
Every curve is computed from the real formula — no freehand clipart."""
import math
from cf_kernel import Plot, PAL

P = PAL
NUC = "nuclear and particle physics.md"
CM = "condensed matter.md"
AM = "atomic and molecular physics.md"
CL = "classical mechanics.md"
FIGS = []


def reg(doc, fid, anchor, hide, skip, title, cap, svg):
    FIGS.append(dict(doc=doc, id=fid, anchor=anchor, hide=hide, skip=skip,
                     title=title, cap=cap, svg=svg))


# ---------------------------------------------------------------- nuclear 1: Woods-Saxon
def nuc_woods_saxon():
    pl = Plot()
    pl.frame(120, 80, 1160, 600, xlab="r  (fm)", ylab="rho(r)")
    pl.domain(0, 11, 0, 1.22)
    R, a = 6.5, 0.55
    rho = lambda r: 1.0 / (1.0 + math.exp((r - R) / a))
    def solve(f, tgt, lo, hi):
        for _ in range(60):
            mid = (lo + hi) / 2
            if (f(lo) - tgt) * (f(mid) - tgt) <= 0:
                hi = mid
            else:
                lo = mid
        return (lo + hi) / 2
    r90 = solve(rho, 0.9, 0, 11)
    r10 = solve(rho, 0.1, 0, 11)
    pl.shade_v(r90, r10, P["a2"], 0.14)
    pl.axes(xticks=[(0, "0"), (2, "2"), (4, "4"), (6, "6"), (8, "8"), (10, "10")],
            yticks=[(0, "0"), (0.5, "rho0/2"), (1.0, "rho0")])
    pl.curve(rho, 400, P["a1"], 5)
    pl.hline(1.0, P["muted"], 2, "6 8")
    pl.hline(0.5, P["muted"], 2, "6 8")
    pl.vline(R, P["a2"], 2, "6 8", y0=0, y1=1.0)
    for rv, lab in [(r90, "r90"), (r10, "r10")]:
        pl.vline(rv, P["a4"], 2, "4 6", y0=0, y1=rho(rv))
    pl.mdot(R, 0.5, 7, P["a2"])
    pl.mtext(R + 0.25, 0.42, "( R1/2 = R0 * A^(1/3) , rho0/2 )", 24, P["a2"], "start")
    pl.marrows(r90, 1.10, r10, 1.10, P["a4"], 3)
    pl.marrows(r10, 1.10, r90, 1.10, P["a4"], 3)
    pl.mtext((r90 + r10) / 2, 1.17, "skin  t = 4.4 a = 2.4 fm", 24, P["a4"])
    pl.mtext(9.4, 0.96, "rho0 = 0.17 nucleons/fm^3", 23, P["muted"], "start")
    pl.text(120, 46, "WOODS-SAXON (FERMI) CHARGE DENSITY", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------------- nuclear 2: B/A curve
def nuc_ba_curve():
    pl = Plot()
    pl.frame(120, 80, 1160, 600, xlab="mass number  A", ylab="B/A (MeV)")
    pl.domain(0, 245, 0, 10)
    av, asf, ac = 15.8, 17.8, 0.71
    def ba(A, Zfrac=0.5):
        Z = Zfrac * A
        vf = 15.8 - 17.8 * A ** (-1 / 3) - ac * Z * Z / A ** (4 / 3)
        vf -= 23.7 * (A - 2 * Z) ** 2 / (A * A)
        return vf
    curve = lambda A: ba(A, 0.5 if A < 40 else 0.5 - 0.1 * (A - 40) / 200)
    pl.axes(xticks=[(0, "0"), (25, "25"), (56, "56"), (100, "100"), (150, "150"), (200, "200"), (238, "238")],
            yticks=[(2, "2"), (4, "4"), (6, "6"), (8, "8"), (8.8, "")])
    pl.shade_v(2, 56, P["a4"], 0.10)
    pl.shade_v(56, 245, P["a3"], 0.07)
    pl.curve(lambda A: curve(A) if A >= 2 else None, 480, P["a1"], 5)
    pl.mdot(56, curve(56), 8, P["a2"])
    pl.mtext(62, 9.3, "56Fe / 62Ni  peak - most bound", 24, P["a2"], "start")
    pl.mdot(4, 7.07, 7, P["a3"])
    pl.mtext(9, 7.5, "4He doubly magic - above SEMF curve", 23, P["a3"], "start")
    pl.mdot(238, curve(238), 6, P["a5"])
    pl.mtext(205, 6.4, "238U", 23, P["a5"], "start")
    pl.mtext(26, 1.2, "FUSION  (joining releases energy)", 24, P["a4"])
    pl.mtext(150, 1.2, "FISSION  (splitting releases energy)", 24, P["a3"])
    pl.text(120, 46, "BINDING ENERGY PER NUCLEON  (SEMF)", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------------- nuclear 3: Gamow tunnelling
def nuc_gamow():
    pl = Plot()
    pl.frame(110, 80, 1160, 600, xlab="r", ylab="V(r)")
    pl.domain(0, 30, -3.2, 4.2)
    R, b, Vc, Q = 6.0, 19.5, 4.5, 1.15
    Vfull = lambda r: -2.6 if r <= R else Vc * R / r
    pl.shade_v(R, b, P["a2"], 0.10)
    pl.axes(xticks=[(R, "R"), (b, "b")], yticks=[], box=False)
    pl.curve(lambda r: Vfull(r) if r > 0.3 else None, 600, P["a1"], 5)
    pl.hline(Q, P["a2"], 3, "10 6")
    pl.mtext(27.5, Q + 0.28, "E = Q-alpha", 24, P["a2"], "end")
    pl.vline(b, P["muted"], 2, "5 7", y0=-3.2, y1=Q)
    # wavefunction: oscillate inside, decay in barrier, oscillate smaller k outside
    def psi(r):
        if r <= R:
            return 0.55 * math.sin(2.6 * r)
        if r <= b:
            return 0.55 * math.sin(2.6 * R) * math.exp(-(r - R) * 0.62)
        amp = 0.55 * math.sin(2.6 * R) * math.exp(-(b - R) * 0.62)
        return amp * 1.9 * math.sin(1.5 * (r - b) + 0.6)
    base = -2.0
    pl.curve(lambda r: base + 0.85 * psi(r), 900, P["a4"], 3)
    pl.hline(base, P["muted"], 1, "2 6")
    pl.mtext(3.0, 3.5, "nuclear well  (r < R)", 23, P["muted"])
    pl.mtext(12.7, 3.5, "COULOMB BARRIER  ~ 2Ze^2 / 4 pi eps0 r", 23, P["a2"])
    pl.mtext(12.7, -2.9, "Gamow factor  G ~  ln(T) / (-2)  ->  T = e^(-2G)", 24, P["a4"])
    pl.text(110, 46, "ALPHA DECAY - QUANTUM TUNNELLING (GAMOW)", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------------- nuclear 4: mass parabolas
def nuc_massparabola():
    pl = Plot()
    # Left panel: odd-A. Right panel: even-A.
    def panel(L, Rr, title):
        pl.frame(L, 110, Rr, 560, xlab="Z", ylab="M(Z)")
        pl.domain(-9, 9, 0, 10)
        pl.axes(xticks=[(0, "Z0")], yticks=[], box=False)
        pl.text((L + Rr) / 2, 80, title, 28, P["ink"], "middle", weight="bold")
    panel(110, 590, "ODD A  -  single parabola")
    par = lambda z, c: 1.2 + 0.09 * (z ** 2) + c
    pl.curve(lambda z: par(z, 0), 220, P["a1"], 5)
    pl.mdot(0, par(0, 0), 8, P["a2"])
    pl.mtext(0.4, 0.7, "one stable isobar", 23, P["a2"], "start")
    for z in (3, 5.5):
        pl.marrows(z, par(z, 0), z - 2.2, par(z - 2.2, 0), P["a3"], 3)
    for z in (-3, -5.5):
        pl.marrows(z, par(z, 0), z + 2.2, par(z + 2.2, 0), P["a4"], 3)
    pl.mtext(4.9, 8.6, "beta- (Z -> Z+1)", 22, P["a3"])
    pl.mtext(-4.9, 8.6, "beta+ / EC", 22, P["a4"])
    panel(660, 1140, "EVEN A  -  two parabolas")
    pl.curve(lambda z: par(z, 0), 220, P["a1"], 5)
    pl.curve(lambda z: par(z, 2.2), 220, P["a3"], 5)
    for z in (-2, 0, 2):
        pl.mdot(z, par(z, 0), 7, P["a1"])
    for z in (-3, -1, 1, 3):
        pl.mdot(z, par(z, 2.2), 6, P["a3"])
    pl.marrows(2, par(2, 0) + 0.2, 0.4, par(0.4, 0) + 0.3, P["a2"], 3)
    pl.marrows(-1, par(-1, 2.2) - 0.2, -0.25, par(-0.25, 0) + 0.35, P["a2"], 3)
    pl.mtext(0.5, 3.6, "pair gap  2 delta", 23, P["a2"], "start")
    pl.text(110, 46, "MASS PARABOLAS & BETA-STABILITY VALLEY (fixed A)", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------------- CM 1: cubic cells
def cm_cells():
    pl = Plot()
    def cube(cx, cy, s, kind, label):
        dx, dy = s * 0.42, -s * 0.30
        vx = [(cx, cy), (cx + s, cy), (cx + s, cy - s), (cx, cy - s),
              (cx + dx, cy + dy), (cx + s + dx, cy + dy), (cx + s + dx, cy - s + dy), (cx + dx, cy - s + dy)]
        edges = [(0, 1), (1, 2), (2, 3), (3, 0), (4, 5), (5, 6), (6, 7), (7, 4), (0, 4), (1, 5), (2, 6), (3, 7)]
        back = {4, 7, 3}
        def atom(x, y, r, col):
            pl.circle(x, y, r, col, 3, fill=P["bg"])
        # back atoms first
        for i, (x, y) in enumerate(vx):
            if i in back:
                atom(x, y, s * 0.085, P["muted"])
        if kind == "bcc":
            atom((vx[0][0] + vx[6][0]) / 2, (vx[0][1] + vx[6][1]) / 2, s * 0.10, P["a2"])
        if kind == "fcc":
            for a, b2 in [(0, 2), (4, 6), (0, 5), (1, 7), (0, 6), (2, 7)]:
                atom((vx[a][0] + vx[b2][0]) / 2, (vx[a][1] + vx[b2][1]) / 2, s * 0.085, P["a4"])
        for a, b2 in edges:
            col = P["muted"] if (a in back and b2 in back) else P["axis"]
            pl.line(vx[a][0], vx[a][1], vx[b2][0], vx[b2][1], col, 3,
                    dash="5 6" if (a in back and b2 in back) else None)
        for i, (x, y) in enumerate(vx):
            if i not in back:
                atom(x, y, s * 0.085, P["a1"])
        pl.text(cx + s / 2 + dx / 2, cy - s + dy - 28, label, 28, P["ink"], "middle", weight="bold")
    s = 170
    cube(130, 470, s, "sc", "SIMPLE CUBIC")
    cube(490, 470, s, "bcc", "BCC")
    cube(850, 470, s, "fcc", "FCC")
    for x, t in [(215, "1 atom/cell  CN 6  pack 52%"),
                 (575, "2 atoms/cell  CN 8  pack 68%"),
                 (935, "4 atoms/cell  CN 12  pack 74%")]:
        pl.text(x, 545, t, 23, P["muted"], "middle")
    pl.circle(160, 620, 10, P["a1"], 3, fill=P["bg"]); pl.text(185, 628, "corner (shared x8)", 23, P["ink"], "start")
    pl.circle(430, 620, 10, P["a2"], 3, fill=P["bg"]); pl.text(455, 628, "body centre", 23, P["ink"], "start")
    pl.circle(640, 620, 10, P["a4"], 3, fill=P["bg"]); pl.text(665, 628, "face centre (shared x2)", 23, P["ink"], "start")
    pl.text(110, 60, "CUBIC BRAVAIS CELLS - THE WORKHORSE TRIO", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------------- CM 2: monatomic dispersion
def cm_disp_mono():
    pl = Plot()
    pl.frame(120, 80, 1160, 600, xlab="k", ylab="omega(k)")
    pl.domain(-1.6, 1.6, 0, 2.45)
    w = lambda k: 2 * abs(math.sin(math.pi * k / 2))
    pl.axes(xticks=[(-1, "-pi/a"), (0, "0"), (1, "pi/a")], yticks=[(2, "w0")])
    # extended-zone ghosts
    for sh in (-2, 2):
        pl.curve(lambda k, s=sh: w(k + s), 300, P["muted"], 2, dash="5 8")
    pl.curve(w, 400, P["a1"], 5)
    pl.seg([(-0.34, 0.68), (0.34, 0)], P["a2"], 3, dash="8 6")
    pl.mtext(0.55, 0.5, "slope = sound speed  vs = a sqrt(K/m)", 23, P["a2"], "start")
    pl.vline(1, P["a3"], 2, "6 8"); pl.vline(-1, P["a3"], 2, "6 8")
    pl.mtext(1.0, 2.28, "1st Brillouin zone edge", 23, P["a3"])
    pl.mtext(0.0, 2.34, "w0 = 2 sqrt(K/m)  -  standing wave, vg = 0 at edge", 22, P["muted"])
    pl.text(120, 46, "1D MONATOMIC CHAIN - PHONON DISPERSION", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------------- CM 3: diatomic dispersion
def cm_disp_dia():
    pl = Plot()
    pl.frame(120, 80, 1160, 600, xlab="k", ylab="omega(k)")
    pl.domain(0, 1.0, 0, 2.6)
    m1, m2, K = 1.0, 1.9, 1.0
    def w2(sign, k):
        s = math.sin(math.pi * k / 2) ** 2
        base = K * (1 / m1 + 1 / m2)
        disc = math.sqrt(base * base - 4 * K * K * s / (m1 * m2))
        return math.sqrt(max(base + sign * disc, 0))
    wlo, whi_a = w2(-1, 0), w2(1, 0)
    wlo_b, whi_b = w2(-1, 1), w2(1, 1)
    pl.shade_v = pl.shade_v  # noqa
    # band gap shading: horizontal strip
    pl.parts.append('<rect x="%s" y="%s" width="%s" height="%s" fill="%s" opacity="0.14"/>'
                    % (pl.L, pl.my(whi_b), pl.R - pl.L, pl.my(wlo_b) - pl.my(whi_b), P["a3"]))
    pl.axes(xticks=[(0, "0"), (1, "pi/a")], yticks=[])
    pl.curve(lambda k: w2(1, k), 320, P["a3"], 5)
    pl.curve(lambda k: w2(-1, k), 320, P["a1"], 5)
    pl.hline(wlo_a := w2(-1, 0), P["muted"], 1, "2 6")
    pl.mtext(0.55, whi_a + 0.13, "OPTICAL branch (out-of-phase, IR active)", 24, P["a3"], "start")
    pl.mtext(0.10, w2(-1, 0.45) - 0.22, "ACOUSTIC branch (in-phase)", 24, P["a1"], "start")
    pl.mtext(0.5, (wlo_b + whi_b) / 2, "FREQUENCY GAP  (no propagating mode)", 22, P["a3"])
    pl.mdot(1, wlo_b, 6, P["a1"]); pl.mdot(1, whi_b, 6, P["a3"])
    pl.text(120, 46, "1D DIATOMIC CHAIN - OPTICAL + ACOUSTIC PHONONS", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------------- CM 4: Kronig-Penney bands
def cm_kronig():
    pl = Plot()
    pl.frame(120, 80, 1160, 600, xlab="alpha a", ylab="f(alpha a)")
    pl.domain(0, 16.5, -2.6, 2.6)
    Pbar = 3 * math.pi / 2
    fos = lambda x: math.cos(x) + Pbar * (math.sin(x) / x if x else 1.0)
    pl.shade_v = pl.shade_v
    pl.parts.append('<rect x="%s" y="%s" width="%s" height="%s" fill="%s" opacity="0.12"/>'
                    % (pl.L, pl.my(1.0), pl.R - pl.L, pl.my(-1.0) - pl.my(1.0), P["a4"]))
    pl.axes(xticks=[(math.pi, "pi"), (2 * math.pi, "2pi"), (3 * math.pi, "3pi"), (4 * math.pi, "4pi"), (5 * math.pi, "5pi")],
            yticks=[(-1, "-1"), (0, "0"), (1, "+1")])
    pl.curve(fos, 1600, P["a1"], 4)
    pl.hline(1, P["a2"], 2, "8 6"); pl.hline(-1, P["a2"], 2, "8 6")
    # allowed bands: intervals of x with |f|<=1 -> thick green segments on the axis
    segs, cur = [], None
    for i in range(3201):
        x = 16.5 * i / 3200
        ok = abs(fos(x)) <= 1
        if ok and cur is None:
            cur = x
        if not ok and cur is not None:
            segs.append((cur, x)); cur = None
    if cur is not None:
        segs.append((cur, 16.5))
    for a, b in segs[:6]:
        pl.line(pl.mx(a), pl.B + 62, pl.mx(b), pl.B + 62, P["a4"], 9)
    pl.text(pl.mx(2.2), pl.B + 96, "allowed energy bands", 23, P["a4"], "start")
    pl.mtext(15.9, 1.35, "|f| <= 1 : allowed", 22, P["a4"], "end")
    pl.mtext(15.9, -1.7, "|f| > 1 : forbidden gap", 22, P["a3"], "end")
    pl.text(120, 46, "KRONIG-PENNEY MODEL - ORIGIN OF BANDS & GAPS", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------------- atomic 1: FFT windows
def am_windows():
    pl = Plot()
    pl.frame(110, 80, 1160, 600, xlab="sample n / N", ylab="w(n)")
    pl.domain(0, 1, 0, 1.16)
    rect = lambda t: 1.0
    hann = lambda t: 0.5 * (1 - math.cos(2 * math.pi * t))
    hamm = lambda t: 0.54 - 0.46 * math.cos(2 * math.pi * t)
    pl.axes(xticks=[(0, "0"), (0.25, "0.25"), (0.5, "0.5"), (0.75, "0.75"), (1, "1")],
            yticks=[(0.5, "0.5"), (1.0, "1.0")])
    pl.curve(rect, 60, P["a3"], 4, dash="10 7")
    pl.curve(hamm, 240, P["a2"], 4)
    pl.curve(hann, 240, P["a1"], 5)
    pl.legend([("a3", "Rectangular  (sidelobes -13 dB)", "10 7"),
               ("a2", "Hamming  (-42 dB)", ""),
               ("a1", "Hann  (-31 dB)", "")], x=1160, y=140)
    pl.mtext(0.5, 0.63, "smooth taper kills spectral leakage", 23, P["muted"])
    pl.text(110, 46, "WINDOW FUNCTIONS FOR DFT SIGNAL RECOVERY", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------------- atomic 2: helium terms
def am_helium():
    pl = Plot()
    pl.frame(110, 80, 1160, 620, xlab="", ylab="E (eV)")
    pl.domain(0, 10, -0.8, 26.5)
    pl.axes(xticks=[], yticks=[(0, "0"), (10, "10"), (20, "20"), (24.59, "24.6")])
    colx = [2.2, 4.2, 6.2, 8.2]
    pl.mtext(2.2, -0.55, "SINGLETS  (S = 0)", 24, P["a1"])
    pl.mtext(7.2, -0.55, "TRIPLETS  (S = 1)", 24, P["a3"])
    # levels: (x, eV, label)
    levs = [(2.2, 0.0, "1s2  1S0  ground"), (2.2, 20.62, "1s2s 1S0"), (2.2, 21.22, "1s2p 1P1"),
            (2.2, 22.92, "1s3s 1S0"), (2.2, 23.09, "1s3p 1P1"),
            (7.2, 19.82, "1s2s 3S1"), (7.2, 20.96, "1s2p 3P"), (7.2, 22.72, "1s3s 3S1"), (7.2, 23.01, "1s3p 3P")]
    for x, e, lab in levs:
        pl.seg([(x - 0.75, e), (x + 0.75, e)], P["a1"] if x < 5 else P["a3"], 5)
        pl.mtext(x + 0.9, e + 0.08, lab, 20, P["ink"], "start")
    pl.hline(24.59, P["a2"], 3, "10 7")
    pl.mtext(8.9, 25.15, "ionisation limit 24.59 eV", 22, P["a2"], "end")
    pl.marrows(2.2, 21.22, 2.2, 0.15, P["a4"], 3)
    pl.mtext(2.5, 11.0, "58.4 nm  (allowed)", 21, P["a4"], "start")
    pl.arrow(pl.mx(7.2), pl.my(20.96), pl.mx(2.2), pl.my(0.35), P["muted"], 2)
    pl.mtext(5.6, 12.4, "intercombination - spin forbidden", 20, P["muted"])
    pl.text(110, 46, "HELIUM ENERGY LEVELS - SINGLET / TRIPLET SPLIT", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------------- classical 1: pendulum portrait
def cl_pendulum():
    pl = Plot()
    pl.frame(120, 80, 1160, 600, xlab="theta", ylab="p = theta-dot")
    pl.domain(-3.8, 3.8, -4.6, 4.6)
    pl.axes(xticks=[(-math.pi, "-pi"), (0, "0"), (math.pi, "pi")], yticks=[(0, "0")])
    def contour(E):
        up, dn = [], []
        for i in range(241):
            th = -3.8 + 7.6 * i / 240
            v = 2 * (E + math.cos(th))
            if v < 0:
                if len(up) > 1:
                    yield up, dn
                up, dn = [], []
                continue
            up.append((th, math.sqrt(v)))
            dn.append((th, -math.sqrt(v)))
        if len(up) > 1:
            yield up, dn
    for E, col, wdt in [(-0.5, P["a1"], 4), (1.0, P["a2"], 5),
                        (2.2, P["a4"], 3), (4.0, P["a4"], 3)]:
        for up, dn in contour(E):
            pl.seg(up, col, wdt)
            pl.seg(dn, col, wdt)
    pl.mdot(0, 0, 8, P["a1"])
    pl.mtext(0.25, -0.55, "centre (stable)", 22, P["a1"], "start")
    for sx in (-math.pi, math.pi):
        pl.dot(pl.mx(sx), pl.my(0), 7, P["a3"])
    pl.mtext(math.pi - 0.15, 0.55, "saddle (inverted)", 22, P["a3"], "end")
    pl.mtext(-3.55, 1.6, "separatrix  E = mgl", 24, P["a2"])
    pl.mtext(1.2, 3.9, "rotation (running)", 23, P["a4"])
    pl.mtext(0.9, -1.4, "libration (oscillation)", 23, P["a1"])
    pl.text(120, 46, "PENDULUM PHASE PORTRAIT - SEPARATRIX ANATOMY", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------------- classical 2: effective potential
def cl_veff():
    pl = Plot()
    pl.frame(120, 80, 1160, 600, xlab="r", ylab="V_eff(r)")
    pl.domain(0, 9, -1.35, 3.2)
    vel = lambda r: 1.0 / (r * r) - 2.0 / r     # L^2/2m = 1, k = 2
    pl.axes(xticks=[(1, "r0"), (2, ""), (4, ""), (6, ""), (8, "")], yticks=[(-1, "-E0"), (0, "0"), (2, "")])
    pl.shade_v = pl.shade_v
    pl.curve(lambda r: vel(r) if r > 0.58 else None, 900, P["a1"], 5)
    pl.curve(lambda r: 1 / (r * r) if r > 0.58 else None, 500, P["muted"], 2, dash="4 7")
    pl.mtext(5.6, 3.0, "centrifugal wall  L^2 / 2 m r^2", 21, P["muted"], "start")
    pl.mtext(4.35, -1.5, "-k / r attraction", 21, P["muted"], "start")
    vmin = -1.0
    pl.mdot(1, vmin, 7, P["a1"]); pl.mtext(1.25, vmin - 0.22, "circular orbit", 22, P["a1"], "start")
    for E, col, lab in [(-0.45, P["a4"], "E < 0 : ellipse (bound)"), (0.0, P["a2"], "E = 0 : parabola"),
                        (0.8, P["a3"], "E > 0 : hyperbola")]:
        pl.hline(E, col, 3, "10 6")
        pl.mtext(8.9, E - 0.22 if E != 0 else E + 0.24, lab, 22, col, "end")
    # turning points for E=-0.45
    lo, hi = 0.62, 8
    xs = [i * 0.001 for i in range(620, 8000)]
    tp = [x for x in xs if abs(vel(x) + 0.45) < 0.004]
    if len(tp) >= 2:
        pl.mdot(tp[0], -0.45, 6, P["a4"]); pl.mdot(tp[-1], -0.45, 6, P["a4"])
        pl.mtext((tp[0] + tp[-1]) / 2, -0.7, "turning points  r1 , r2   (dr/dt = 0)", 21, P["a4"])
    pl.text(120, 46, "CENTRAL FORCE - EFFECTIVE POTENTIAL & ORBIT TYPES", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------------- classical 3: LAB vs CM
def cl_labcm():
    pl = Plot()
    def ball(x, y, r, col, lab, sub=None):
        pl.circle(x, y, r, col, 4, fill=P["bg"])
        pl.text(x, y - r - 16, lab, 24, P["ink"], "middle", weight="bold")
        if sub:
            pl.text(x, y + r + 30, sub, 20, P["muted"], "middle")
    pl.line(600, 90, 600, 660, P["muted"], 2, dash="8 10")
    pl.text(300, 110, "LAB FRAME", 30, P["ink"], "middle", weight="bold")
    pl.text(905, 110, "CM FRAME", 30, P["ink"], "middle", weight="bold")
    # LAB before
    ball(150, 240, 26, P["a1"], "m1", "v0 -->")
    pl.arrow(185, 240, 285, 240, P["a2"], 4)
    ball(420, 240, 30, P["a3"], "m2", "at rest")
    pl.text(300, 320, "BEFORE", 20, P["muted"], "middle")
    # LAB after
    ball(300, 470, 26, P["a1"], "m1")
    pl.arrow(320, 452, 430, 380, P["a2"], 4)
    pl.text(450, 370, "v1' , angle theta", 21, P["a2"], "start")
    pl.arrow(320, 488, 445, 545, P["a4"], 4)
    pl.text(455, 575, "v2' , angle phi", 21, P["a4"], "start")
    pl.text(300, 620, "AFTER", 20, P["muted"], "middle")
    # CM before
    ball(760, 240, 26, P["a1"], "m1")
    pl.arrow(790, 240, 880, 240, P["a2"], 4)
    ball(1040, 240, 30, P["a3"], "m2")
    pl.arrow(1010, 240, 920, 240, P["a4"], 4)
    pl.text(905, 300, "total momentum = 0", 21, P["muted"], "middle")
    # CM after: back-to-back on circle
    pl.circle(905, 470, 105, P["muted"], 2)
    ball(905 - 74, 470 - 74, 26, P["a1"], "m1")
    pl.arrow(905 - 52, 470 - 52, 905 + 20, 470 + 20, P["muted"], 0)  # noop keep
    ball(905 + 74, 470 + 74, 30, P["a3"], "m2")
    pl.arrow(905 - 95, 470 - 95, 905 - 160, 470 - 160, P["a2"], 4)
    pl.arrow(905 + 95, 470 + 95, 905 + 160, 470 + 160, P["a4"], 4)
    pl.text(905, 620, "back-to-back · single scattering angle THETA", 21, P["muted"], "middle")
    pl.text(110, 46, "ELASTIC COLLISION - LAB vs CENTRE-OF-MASS", 30, P["ink"], "start", weight="bold")
    return pl.emit()


def build():
    del FIGS[:]
    reg(NUC, "ff-nuc-woodssaxon", "woods-saxon", "Density ρ(r)", 0,
        "Woods-Saxon nuclear charge density",
        "Fermi profile rho(r) with half-density radius R1/2 and 90-10% skin thickness t = 4.4 a. Replaces the old ASCII sketch.",
        nuc_woods_saxon())
    reg(NUC, "ff-nuc-ba-curve", "binding energy per nucleon", "B/A (MeV)", 0,
        "Binding energy per nucleon curve",
        "SEMF prediction B/A vs A: fusion slope, 56Fe/62Ni peak, fission tail, and the doubly-magic 4He outlier. Replaces the old ASCII sketch.",
        nuc_ba_curve())
    reg(NUC, "ff-nuc-gamow", "gamow theory", "Coulomb Barrier", 0,
        "Gamow theory of alpha decay",
        "Alpha particle facing the Coulomb barrier: oscillatory wave inside the nucleus, exponential attenuation across the barrier, free wave outside. Replaces the old ASCII sketch.",
        nuc_gamow())
    reg(NUC, "ff-nuc-massparabola", "mass parabolas", "Odd-A: Single Parabola", 0,
        "SEMF mass parabolas",
        "Fixed-A isobar masses: odd-A nuclei sit on one parabola (single stable isobar); even-A nuclei split by the pairing term 2 delta. Replaces the old ASCII sketch.",
        nuc_massparabola())
    reg(CM, "ff-cm-cells", "quantitative analysis of cubic", "Simple Cubic (SC)", 0,
        "SC / BCC / FCC unit cells",
        "The three cubic Bravais cells with atom sharing, coordination number and packing fraction. Replaces the old ASCII sketch.",
        cm_cells())
    reg(CM, "ff-cm-disp-mono", "1d monatomic", "1D Monatomic Dispersion", 0,
        "Monatomic chain dispersion",
        "omega(k) = 2 sqrt(K/m) |sin(ka/2)| in the first Brillouin zone; sound speed at k->0, standing waves at the zone edge. Replaces the old ASCII sketch.",
        cm_disp_mono())
    reg(CM, "ff-cm-disp-dia", "1d diatomic", "1D Diatomic Dispersion", 0,
        "Diatomic chain: optical + acoustic branches",
        "Two atoms per basis split the dispersion: in-phase acoustic band and out-of-phase optical band separated by a frequency gap. Replaces the old ASCII sketch.",
        cm_disp_dia())
    reg(CM, "ff-cm-kronig", "kronig-penney", "f(αa)", 0,
        "Kronig-Penney band condition",
        "f(alpha a) = cos(alpha a) + P sin(alpha a)/(alpha a): propagation exists only where |f| <= 1 - the mathematical origin of allowed bands and forbidden gaps. Replaces the old ASCII sketch.",
        cm_kronig())
    reg(AM, "ff-am-windows", "windowing functions", "RECTANGULAR:", 0,
        "DFT window functions",
        "Rectangular vs Hamming vs Hann tapers: smooth edges trade main-lobe width for far lower sidelobes (less spectral leakage). Replaces the old ASCII sketch.",
        am_windows())
    reg(AM, "ff-am-helium", "helium atom problem", "HELIUM ATOM STATES", 0,
        "Helium singlet-triplet Grotrian diagram",
        "Exchange splitting divides He into non-mixing singlet (para) and triplet (ortho) ladders; the intercombination line is spin-forbidden. Replaces the old ASCII sketch.",
        am_helium())
    reg(CL, "ff-cl-pendulum", "phase portraits", "p (momentum)", 0,
        "Pendulum phase portrait",
        "Libration inside the separatrix, rotation outside, saddles at the inverted position - the textbook dynamical-systems picture. Replaces the old ASCII sketch.",
        cl_pendulum())
    reg(CL, "ff-cl-veff", "radial equation of motion", "V_eff(r)", 0,
        "Effective potential & orbit classification",
        "V_eff = L^2/2mr^2 - k/r: energy of the orbit (ellipse / parabola / hyperbola) read straight off the turning points. Replaces the old ASCII sketch.",
        cl_veff())
    reg(CL, "ff-cl-labcm", "kinematics in laboratory", "LAB FRAME", 0,
        "Collision kinematics: LAB vs CM",
        "The same elastic collision in both frames; in the CM frame the motion is back-to-back with a single scattering angle. Replaces the old ASCII sketch.",
        cl_labcm())
    return FIGS
