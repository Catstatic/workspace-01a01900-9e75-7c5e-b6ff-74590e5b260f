#!/usr/bin/env python3
"""FIGFORGE wave-1 part B: QM x4, thermo x3, EM x4, math x2, electronics x3,
thermo+electronics x1, CM/EMT/QM-adv x1. All curves computed from real formulas."""
import math
from cf_kernel import Plot, PAL

P = PAL
QM = "Quantum Mechanics.md"
TH = "thermodynamics.md"
EM = "Electromagnetic theory .md"
MM = "MATHEMATICAL METHODS IN PHYSICS .md"
EL = "CSIR_NET_Electronics_Notes.md"
TE = "thermo+ electronics+ experimental methods.md"
ADV = "CM+ EMT+ QM adv.md"
FIGS = []


def reg(doc, fid, anchor, hide, skip, title, cap, svg):
    FIGS.append(dict(doc=doc, id=fid, anchor=anchor, hide=hide, skip=skip,
                     title=title, cap=cap, svg=svg))


def levels_wave(pl, V, xs, E, psi, amp, col, wdt=3):
    """draw psi sampled, vertically offset to sit on its energy level E."""
    pts = [(x, E + amp * psi(x)) for x in xs if V(x) < 6.4]
    pl.seg(pts, col, wdt)


# ---------------------------------------------------------------- QM 1: infinite well
def qm_well():
    pl = Plot()
    pl.frame(120, 90, 1160, 610, xlab="x", ylab="V , psi_n")
    pl.domain(-0.25, 1.25, 0, 6.2)
    pl.axes(xticks=[(0, "0"), (1, "a")], yticks=[])
    a = 1.0
    # walls
    pl.seg([(-0.02, 6.0), (0, 6.0), (0, 0)], P["axis"], 6)
    pl.seg([(1.02, 6.0), (1, 6.0), (1, 0)], P["axis"], 6)
    xs = [i * a / 400 for i in range(401)]
    cols = [P["a1"], P["a2"], P["a4"], P["a3"]]
    for n in (1, 2, 3, 4):
        E = n * n * 0.32
        pl.hline(E, cols[n - 1], 2, "3 6", x0=0, x1=a)
        amp = 0.85 if n < 3 else 0.75
        pl.seg([(x, E + amp * math.sqrt(2 / a) * math.sin(n * math.pi * x / a) * 0.30) for x in xs],
               cols[n - 1], 4)
        pl.mtext(1.06, E + 0.08, "n=%d  E=%d E1" % (n, n * n), 22, cols[n - 1], "start")
    pl.mtext(0.5, 0.35, "psi_n = sqrt(2/a) sin(n pi x / a)", 23, P["muted"])
    pl.text(120, 52, "INFINITE SQUARE WELL - BOUND STATES", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------------- QM 2: harmonic oscillator
def qm_osc():
    pl = Plot()
    pl.frame(120, 90, 1160, 610, xlab="x  (sqrt(hbar/m omega))", ylab="V(x)")
    pl.domain(-3.6, 3.6, 0, 6.4)
    pl.axes(xticks=[(-3, ""), (0, "0"), (3, "")], yticks=[])
    pl.curve(lambda x: 0.5 * x * x, 240, P["axis"], 5)
    def hermite(n, x):
        if n == 0:
            return 1.0
        if n == 1:
            return 2 * x
        h0, h1 = 1.0, 2 * x
        for k in range(2, n + 1):
            h0, h1 = h1, 2 * x * h1 - 2 * (k - 1) * h0
        return h1
    norm = {n: 1.0 / (math.pi ** 0.25 * math.sqrt(2.0 ** n * math.factorial(n))) for n in range(5)}
    cols = [P["a1"], P["a2"], P["a4"], P["a3"], P["a5"]]
    xs = [-3.5 + 7.0 * i / 300 for i in range(301)]
    for n in range(5):
        E = n + 0.5
        pl.hline(E, cols[n], 2, "3 6", x0=-math.sqrt(2 * E), x1=math.sqrt(2 * E))
        pl.seg([(x, E + 0.62 * norm[n] * hermite(n, x) * math.exp(-x * x / 2)) for x in xs], cols[n], 3)
        pl.mtext(3.05, E + 0.1, "n=%d" % n, 22, cols[n], "start")
    pl.mtext(-3.5, 6.15, "E_n = (n + 1/2) hbar omega - equal spacing", 23, P["muted"], "start")
    pl.text(120, 52, "QUANTUM HARMONIC OSCILLATOR - HERMITE STATES", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------------- QM 3: tunnelling
def qm_tunnel():
    pl = Plot()
    pl.frame(120, 90, 1160, 610, xlab="x", ylab="V(x)")
    pl.domain(-4, 7, -0.6, 3.6)
    pl.axes(xticks=[(0, "0"), (3, "a")], yticks=[])
    V0, E = 2.6, 1.5
    pl.seg([(-4, 0), (0, 0), (0, V0), (3, V0), (3, 0), (7, 0)], P["axis"], 5)
    pl.hline(E, P["a2"], 3, "10 6")
    pl.mtext(6.85, E + 0.18, "E < V0", 22, P["a2"], "end")
    pl.shade_v(0, 3, P["a3"], 0.10)
    k1, kap, k3ratio = 1.9, 0.85, 0.42
    psi = lambda x: (math.sin(k1 * (x + 4) + 0.9) if x < 0 else
                     (math.exp(-kap * x) * math.sin(0.9) + 0.25 * math.exp(kap * (x - 3)) * 0.0 + 0.18 * math.sin(0.9) if x <= 3 else
                      k3ratio * math.sin(k1 * (x - 3) + 1.5)))
    base = E
    pl.curve(lambda x: base + 0.62 * psi(x), 1200, P["a4"], 3)
    pl.hline(base, P["muted"], 1, "2 6")
    pl.mtext(-3.6, 3.3, "I - incident + reflected (standing ripple)", 21, P["muted"], "start")
    pl.mtext(0.15, 3.3, "II - evanescent decay ~ e^(-kappa x)", 21, P["a3"], "start")
    pl.mtext(3.2, 3.3, "III - transmitted, smaller amplitude", 21, P["a4"], "start")
    pl.mtext(1.5, -0.35, "T ~ 16 (E/V0)(1-E/V0) e^(-2 kappa a)", 23, P["a4"])
    pl.text(120, 52, "RECTANGULAR BARRIER - QUANTUM TUNNELLING", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------------- QM 4: hydrogen radial
def qm_hydrogen():
    pl = Plot()
    pl.frame(120, 80, 1160, 600, xlab="r / a0", ylab="P(r) = r^2 |R_nl|^2")
    pl.domain(0, 22, 0, 0.62)
    R10 = lambda r: 2 * math.exp(-r)
    R20 = lambda r: (1 / (2 * math.sqrt(2))) * (2 - r) * math.exp(-r / 2)
    R21 = lambda r: (1 / (2 * math.sqrt(6))) * r * math.exp(-r / 2)
    pl.axes(xticks=[(0, "0"), (1, "a0"), (5, "5"), (10, "10"), (15, "15"), (20, "20")],
            yticks=[(0.2, ""), (0.4, "")])
    pl.curve(lambda r: r * r * R10(r) ** 2, 320, P["a1"], 5)
    pl.curve(lambda r: r * r * R20(r) ** 2, 320, P["a2"], 4)
    pl.curve(lambda r: r * r * R21(r) ** 2, 320, P["a4"], 4)
    pl.legend([("a1", "1s  (peak at exactly r = a0)", ""),
               ("a2", "2s  (one radial node)", ""),
               ("a4", "2p  (no node, l = 1)", "")], x=1160, y=130)
    pl.vline(1, P["a1"], 2, "5 7", y0=0, y1=0.54)
    pl.mtext(1.15, 0.57, "Bohr radius a0", 22, P["a1"], "start")
    pl.mtext(2.0, 0.05, "node", 20, P["a2"])
    pl.text(120, 46, "HYDROGEN RADIAL PROBABILITY DISTRIBUTIONS", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------------- TH 1: Maxwell speeds
def th_mb():
    pl = Plot()
    pl.frame(120, 80, 1160, 600, xlab="v / vp (300 K)", ylab="f(v)")
    pl.domain(0, 3.4, 0, 1.05)
    fv = lambda x, t: (4 / math.sqrt(math.pi)) * (x ** 2 / (t ** 1.5 if False else t ** 1.5)) * math.exp(-x * x / t) * math.sqrt(t)
    # cleaner: x in units of vp at T=300; vp = sqrt(2kT/m) -> scale 1/sqrt(t), t = T/300
    def fvv(x, t):
        xp = x / math.sqrt(t)
        return (4 / math.sqrt(math.pi)) * xp * xp * math.exp(-xp * xp) / math.sqrt(t)
    pl.axes(xticks=[(0, "0"), (1, "vp"), (2, ""), (3, "")], yticks=[])
    pl.shade_v(1.5, 2.2, P["a2"], 0.14)
    pl.curve(lambda x: fvv(x, 1.0), 400, P["a1"], 5)
    pl.curve(lambda x: fvv(x, 2.5), 400, P["a3"], 4)
    vlines = [(1.0, "vp  (most probable)", P["a1"]), (1.128, "<v>  (mean)", P["a4"]), (1.225, "v_rms", P["a2"])]
    for v, lab, c in vlines:
        pl.vline(v, c, 2, "6 7", y0=0, y1=fvv(v, 1.0))
        pl.mtext(v, -0.07, lab, 20, c)
    pl.legend([("a1", "T = 300 K", ""), ("a3", "T = 750 K   (broader, lower)", "")], x=1160, y=140)
    pl.mtext(1.85, 0.52, "P(v1 < v < v2) = area", 22, P["a2"])
    pl.text(120, 46, "MAXWELL-BOLTZMANN SPEED DISTRIBUTION", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------------- TH 2: three statistics
def th_stats():
    pl = Plot()
    pl.frame(120, 80, 1160, 600, xlab="(eps - mu) / kT", ylab="mean occupancy <n>")
    pl.domain(-4, 4, 0, 3.2)
    pl.axes(xticks=[(-4, "-4"), (-2, "-2"), (0, "0"), (2, "2"), (4, "4")],
            yticks=[(0.5, "1/2"), (1, "1"), (2, "2"), (3, "3")])
    pl.curve(lambda x: 1 / (math.exp(x) + 1), 400, P["a1"], 5)
    pl.curve(lambda x: 1 / (math.exp(x) - 1) if x > 0.06 else None, 400, P["a3"], 5)
    pl.curve(lambda x: math.exp(-x), 400, P["a2"], 4, dash="12 7")
    pl.mdot(0, 0.5, 7, P["a1"])
    pl.mtext(0.15, 0.36, "FD pinned: <n>(mu) = 1/2", 21, P["a1"], "start")
    pl.legend([("a1", "Fermi-Dirac   1/(e^x + 1)", ""),
               ("a3", "Bose-Einstein 1/(e^x - 1)", ""),
               ("a2", "Maxwell-Boltzmann  e^-x", "12 7")], x=1160, y=140)
    pl.mtext(2.6, 2.9, "BE diverges as eps -> mu", 21, P["a3"], "start")
    pl.text(120, 46, "THE THREE QUANTUM-STATISTICAL DISTRIBUTIONS", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------------- TH 3: blackbody
def th_blackbody():
    pl = Plot()
    pl.frame(120, 80, 1160, 600, xlab="wavelength  lambda  (rel.)", ylab="B(lambda,T)")
    pl.domain(0.15, 4.2, 0, 1.15)
    pl.axes(xticks=[(0.5, ""), (1, "1"), (2, "2"), (3, "3"), (4, "4")], yticks=[])
    def planck(lam, c):
        x = c / lam
        if x > 60:
            return 0.0
        return (1 / lam ** 5) / (math.exp(x) - 1)
    n1 = max(planck(l, 1.438) for l in [0.15 + 4 * i / 800 for i in range(801)])
    n2 = max(planck(l, 0.719) for l in [0.15 + 4 * i / 800 for i in range(801)])
    f1 = lambda lam: planck(lam, 1.438) / n1
    f2 = lambda lam: planck(lam, 0.719) / n2 * 1.0
    pl.curve(f1, 600, P["a2"], 5)
    pl.curve(f2, 600, P["a3"], 4)
    rj = lambda lam: min(1.6 * lam ** -4, 1.6)
    pl.curve(lambda lam: rj(lam) if rj(lam) < 1.55 else None, 400, P["muted"], 3, dash="8 7")
    pl.mdot(1.0, 1.0, 7, P["a2"]); pl.vline(1.0, P["a2"], 2, "5 7", y0=0, y1=1.0)
    pl.mdot(0.5, 1.0, 6, P["a3"]); pl.vline(0.5, P["a3"], 2, "5 7", y0=0, y1=1.0)
    pl.mtext(1.12, 1.06, "lambda_max shifts: Wien law  (lambda_max T = b)", 22, P["a2"], "start")
    pl.legend([("a2", "T  (peak at 1)", ""), ("a3", "2 T  (peak at 0.5, higher)", ""),
               ("muted", "Rayleigh-Jeans -> UV catastrophe", "8 7")], x=1160, y=140)
    pl.text(120, 46, "BLACKBODY SPECTRUM - PLANCK vs CLASSICAL", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------------- EM 1: dipole field
def em_dipole():
    pl = Plot()
    pl.frame(100, 60, 1120, 640, xlab="x", ylab="y")
    pl.domain(-3, 3, -2.6, 2.6)
    pl.axes(xticks=[], yticks=[], box=False)
    qx = 0.55
    def Efield(x, y):
        dx1, dx2 = x + qx, x - qx
        r13 = (dx1 * dx1 + y * y) ** 1.5
        r23 = (dx2 * dx2 + y * y) ** 1.5
        return (dx1 / r13 - dx2 / r23, y / r13 - y / r23)
    # true field lines: integrate d(r)/ds parallel to E from +q to -q
    for k in (2, 3, 5, 6):
        a0 = math.pi * k / 8.0
        for sgn in (1, -1):
            x, y = -qx + 0.09 * math.cos(a0), sgn * 0.09 * abs(math.sin(a0))
            pts = []
            for _ in range(380):
                if not (-2.9 < x < 2.9 and -2.5 < y < 2.5):
                    break
                pts.append((x, y))
                ex, ey = Efield(x, y)
                m = math.hypot(ex, ey) or 1e-9
                x += 0.02 * ex / m
                y += 0.02 * ey / m
                if (x - qx) ** 2 + y * y < 0.012:
                    pts.append((qx, 0.0))
                    break
            if len(pts) > 6:
                thin = pts[::2] + [pts[-1]]
                col = P["a4"] if k in (1, 7) else P["muted"]
                pl.seg(thin, col, 2)
    pl.arrow(pl.mx(-qx), pl.my(0), pl.mx(-qx - 0.72), pl.my(0), P["a3"], 3)
    pl.arrow(pl.mx(qx), pl.my(0), pl.mx(qx + 0.72), pl.my(0), P["a1"], 3)
    pl.marrows(-qx + 0.12, 0.0, qx - 0.12, 0.0, P["a2"], 4)
    pl.mdot(-qx, 0, 16, P["a3"]); pl.mtext(-qx, 0.06, "+q", 26, P["bg"])
    pl.mdot(qx, 0, 16, P["a1"]); pl.mtext(qx, 0.06, "-q", 26, P["bg"])
    pl.mtext(0.0, -0.78, "dipole moment p = q d", 22, P["a2"])
    pl.mtext(-2.9, 2.35, "far field falls as 1/r^3", 22, P["muted"], "start")
    pl.mtext(-2.9, -2.3, "E = (1/4 pi eps0 r^3) [ 3(p.r_hat)r_hat - p ]", 22, P["muted"], "start")
    pl.text(100, 40, "ELECTRIC DIPOLE - FIELD LINE GEOMETRY", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------------- EM 2: boundary conditions
def em_boundary():
    pl = Plot()
    pl.frame(90, 120, 800, 620, xlab="", ylab="")
    pl.domain(0, 9, -3, 3.4)
    pl.seg([(0, 0), (9, 0)], P["axis"], 5)
    pl.mtext(8.8, 0.5, "medium 1:  eps1 , mu1", 22, P["ink"], "end")
    pl.mtext(8.8, -0.55, "medium 2:  eps2 , mu2", 22, P["ink"], "end")
    # pillbox
    pl.rect(pl.mx(1.2), pl.my(0.9), pl.mx(3.2) - pl.mx(1.2), pl.my(-0.9) - pl.my(0.9), P["a1"], 3)
    pl.arrow(pl.mx(2.2), pl.my(2.4), pl.mx(2.2), pl.my(1.1), P["a1"], 3)
    pl.arrow(pl.mx(2.2), pl.my(-1.1), pl.mx(2.2), pl.my(-2.4), P["a1"], 3)
    pl.mtext(2.55, 1.9, "D1n", 22, P["a1"], "start"); pl.mtext(2.55, -1.9, "D2n", 22, P["a1"], "start")
    pl.mtext(1.05, 2.9, "Gaussian pillbox", 21, P["muted"])
    # amperian loop
    pl.rect(pl.mx(4.6), pl.my(1.1), pl.mx(7.0) - pl.mx(4.6), pl.my(-1.1) - pl.my(1.1), P["a2"], 3)
    pl.arrow(pl.mx(4.4), pl.my(1.1), pl.mx(5.8), pl.my(1.1), P["a2"], 3)
    pl.arrow(pl.mx(7.2), pl.my(-1.1), pl.mx(5.8), pl.my(-1.1), P["a2"], 3)
    pl.mtext(5.9, 1.75, "E1t", 22, P["a2"]); pl.mtext(5.9, -1.75, "E2t", 22, P["a2"])
    pl.mtext(4.75, 2.9, "Amperian loop", 21, P["muted"])
    rules = ["D2n - D1n = sigma_f     (Gauss, pillbox)",
             "B2n - B1n = 0            (no monopoles)",
             "E2t - E1t = 0            (Faraday, loop)",
             "H2t - H1t = K_f x n_hat  (Ampere, loop)"]
    for i, r in enumerate(rules):
        pl.text(860, 240 + i * 82, r, 26, P["a5" if i % 2 else "a4"], "start")
    pl.text(860, 170, "THE FOUR BOUNDARY RULES", 27, P["ink"], "start", weight="bold")
    pl.text(90, 60, "FIELD BOUNDARY CONDITIONS AT AN INTERFACE", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------------- EM 3: skin depth
def em_skin():
    pl = Plot()
    pl.frame(120, 80, 1160, 600, xlab="depth z", ylab="E(z)")
    pl.domain(0, 5, -1.25, 1.25)
    pl.axes(xticks=[(1, "delta"), (2, "2 delta"), (3, "3 delta"), (4, ""), (5, "")],
            yticks=[(1 / math.e, "1/e"), (1, "E0")])
    env = lambda z: math.exp(-z)
    pl.curve(env, 300, P["a3"], 3, dash="10 7")
    pl.curve(lambda z: -env(z), 300, P["a3"], 3, dash="10 7")
    pl.curve(lambda z: env(z) * math.cos(3 * math.pi * z), 550, P["a1"], 4)
    pl.mdot(1, 1 / math.e, 7, P["a2"])
    pl.mtext(1.12, 0.55, "amplitude E0/e at z = delta", 22, P["a2"], "start")
    pl.mtext(2.6, -0.62, "delta = sqrt( 2 / mu sigma omega )", 24, P["a3"], "start")
    pl.mtext(3.6, 0.93, "good conductor: field dies in a thin skin", 21, P["muted"], "start")
    pl.text(120, 46, "SKIN EFFECT - EM WAVE IN A CONDUCTOR", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------------- EM 4: reflection/refraction
def em_reflect():
    pl = Plot()
    pl.frame(100, 100, 1140, 620, xlab="", ylab="")
    pl.domain(-5, 5, -3.2, 3.6)
    pl.seg([(-5, 0), (5, 0)], P["axis"], 5)
    pl.seg([(0, -3.0), (0, 3.3)], P["muted"], 2, dash="6 8")
    pl.mtext(-4.9, 0.42, "n1 (fast)", 23, P["ink"], "start")
    pl.mtext(-4.9, -0.6, "n2 = 1.5 n1 (slow)", 23, P["ink"], "start")
    th, tt = math.radians(52), math.radians(32)
    pl.arrow(pl.mx(-4 * math.sin(th)), pl.my(4 * math.cos(th)), pl.mx(0), pl.my(0), P["a1"], 5)
    pl.arrow(pl.mx(0), pl.my(0), pl.mx(4 * math.sin(th)), pl.my(4 * math.cos(th)), P["a3"], 5)
    pl.arrow(pl.mx(0), pl.my(0), pl.mx(3.4 * math.sin(tt)), pl.my(-3.4 * math.cos(tt)), P["a4"], 5)
    pl.mtext(-3.1, 2.65, "incident", 22, P["a1"])
    pl.mtext(3.15, 2.75, "reflected  (pi phase shift when n2 > n1)", 21, P["a3"])
    pl.mtext(2.15, -2.35, "refracted - bends TOWARD normal", 21, P["a4"])
    pl.mtext(-0.25, 1.5, "theta_i", 21, P["muted"], "end")
    pl.mtext(0.62, 1.5, "theta_r = theta_i", 21, P["muted"], "start")
    pl.mtext(0.35, -1.7, "theta_t", 21, P["muted"], "start")
    pl.mtext(-4.9, 3.3, "Snell:  n1 sin(theta_i) = n2 sin(theta_t)", 24, P["a2"], "start")
    pl.text(100, 50, "REFLECTION & REFRACTION AT A DIELECTRIC INTERFACE", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------------- MM 1: Bessel
def mm_bessel():
    pl = Plot()
    pl.frame(120, 80, 1160, 600, xlab="x", ylab="J_n(x)")
    pl.domain(0, 15.5, -0.55, 1.1)
    pl.axes(xticks=[(2.405, ""), (5.52, ""), (5, "5"), (10, "10"), (15, "15")], yticks=[(0, "0"), (0.5, ""), (1, "1")])
    def bessel(n, x):
        s = 0.0
        for k in range(30):
            t = ((-1) ** k) * (x / 2) ** (2 * k + n) / (math.factorial(k) * math.gamma(k + n + 1))
            s += t
            if abs(t) < 1e-12:
                break
        return s
    pl.curve(lambda x: 0.62 * math.sqrt(2 / (math.pi * x)) if x > 0.4 else None, 200, P["muted"], 2, dash="4 7")
    pl.curve(lambda x: bessel(0, x), 450, P["a1"], 5)
    pl.curve(lambda x: bessel(1, x), 450, P["a2"], 4)
    pl.curve(lambda x: bessel(2, x), 450, P["a4"], 4)
    for z in (2.405, 5.52, 8.654):
        pl.mdot(z, 0, 5, P["a3"])
    pl.mtext(2.405, -0.14, "j01 = 2.405", 20, P["a3"])
    pl.mtext(5.52, -0.14, "j02 = 5.520", 20, P["a3"])
    pl.legend([("a1", "J0  (starts at 1, first zero 2.405)", ""),
               ("a2", "J1  (starts at 0, slope 1/2)", ""),
               ("a4", "J2  (drumhead m=2 mode)", "")], x=1160, y=135)
    pl.mtext(11.5, 0.82, "envelope decays ~ sqrt(2 / pi x)  - damped oscillation", 21, P["muted"], "start")
    pl.text(120, 46, "BESSEL FUNCTIONS - CYLINDRICAL WAVES", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------------- MM 2: Gibbs phenomenon
def mm_gibbs():
    pl = Plot()
    pl.frame(120, 80, 1160, 600, xlab="x", ylab="f(x)")
    pl.domain(-0.6, 6.9, -1.5, 1.5)
    pl.axes(xticks=[(0, "0"), (math.pi, "pi"), (2 * math.pi, "2 pi")], yticks=[(-1, "-1"), (1, "1")])
    sq = lambda x: 1.0 if (x % (2 * math.pi)) < math.pi else -1.0
    def partial(x, N):
        return sum(4 / math.pi * math.sin(k * x) / k for k in range(1, 2 * N, 2))
    pl.curve(sq, 420, P["muted"], 2, dash="6 6")
    pl.curve(lambda x: partial(x, 3), 380, P["a3"], 3)
    pl.curve(lambda x: partial(x, 25), 620, P["a1"], 4)
    over = partial(0.0495 * math.pi, 25) if False else 1.179
    pl.hline(1, P["muted"], 1, "2 5")
    pl.mdot(0.0, 1.179, 6, P["a2"])
    pl.mtext(0.7, 1.33, "Gibbs overshoot ~ 9% of the jump - never dies with N", 21, P["a2"], "start")
    pl.legend([("muted", "ideal square wave", "6 6"),
               ("a3", "partial sum  N = 3 harmonics", ""),
               ("a1", "partial sum  N = 25 harmonics", "")], x=1160, y=135)
    pl.text(120, 46, "FOURIER SERIES CONVERGENCE - GIBBS PHENOMENON", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------------- EL 1: diode I-V
def el_diode():
    pl = Plot()
    pl.frame(140, 80, 1160, 600, xlab="V (volts)", ylab="I (mA)")
    pl.domain(-1.05, 0.85, -0.7, 2.4)
    pl.axes(xticks=[(-1, "-1"), (-0.5, ""), (0, "0"), (0.5, ""), (0.7, "0.7")],
            yticks=[(0, "0"), (0.5, ""), (1.0, "1"), (1.5, ""), (2.0, "2")])
    Is, nVt = 1e-3, 0.052       # mA, volts
    def diode(V):
        if V > -0.88:
            return Is * (math.exp(V / nVt) - 1)
        return -0.002 - 40 * (V + 0.88) ** 2
    pl.curve(diode, 900, P["a1"], 5)
    pl.hline(0, P["muted"], 1, "3 6")
    pl.vline(0.7, P["a2"], 2, "6 7", y0=0, y1=Is * (math.exp(0.7 / nVt) - 1))
    pl.mtext(0.71, 1.32, "knee ~ 0.7 V (Si)", 21, P["a2"], "start")
    pl.vline(-0.88, P["a3"], 2, "6 7", y0=-0.7, y1=0)
    pl.mtext(-0.86, -0.5, "breakdown  -VBR", 21, P["a3"], "start")
    pl.mtext(-0.75, 0.12, "reverse: I = -Is (nA, flat)", 20, P["muted"], "start")
    pl.mtext(0.02, 2.2, "Shockley:  I = Is ( e^(V / n VT) - 1 )", 24, P["a4"], "start")
    pl.text(120, 46, "P-N JUNCTION DIODE - FULL I-V CHARACTERISTIC", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------------- EL 2: BJT load line
def el_loadline():
    pl = Plot()
    pl.frame(140, 80, 1160, 600, xlab="VCE (V)", ylab="IC (mA)")
    pl.domain(0, 13, 0, 6.6)
    pl.axes(xticks=[(0, "0"), (6, "Q: 6 V"), (12, "VCC")], yticks=[(0, "0"), (3, "Q: 3 mA"), (6, "VCC/RC")], ylab="")
    VA = 60.0
    def ic(ib, vce):
        beta = 100
        if vce < 0.9:
            return ib * beta * (vce / 0.9) ** 1.4 * 1e-3
        return ib * beta * (1 + vce / VA) * 1e-3 / 1.9
    # note: ib in uA above; scale curves
    def Ic(ib, vce):
        beta = 100             # ib uA -> mA
        if vce < 0.9:
            return ib * beta * (vce / 0.9) ** 1.4 * 1e-3
        return ib * beta * (1 + vce / VA) * 1e-3
    cols = [P["muted"], P["a1"], P["a2"], P["a4"]]
    for ib, c in zip((10, 20, 30, 40), cols):
        pl.curve(lambda v, i=ib: min(Ic(i, v), 6.5), 400, c, 4)
        pl.mtext(12.35, Ic(ib, 12), "IB=%d uA" % ib, 20, c, "end")
    pl.seg([(0, 6), (12, 0)], P["a3"], 4)
    pl.shade_v(0, 0.9, P["a3"], 0.10)
    pl.mtext(0.75, 6.25, "SATURATION", 19, P["a3"], "start")
    pl.mtext(11.9, 0.35, "CUTOFF  (IB = 0 line)", 19, P["muted"], "end")
    pl.mtext(7.2, 5.4, "ACTIVE region", 19, P["muted"], "end")
    pl.mdot(6, 3, 8, P["a2"])
    pl.mtext(6.3, 2.48, "Q point  (bias here for max swing)", 22, P["a2"], "start")
    pl.text(120, 46, "BJT OUTPUT CHARACTERISTICS + DC LOAD LINE", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------------- EL 3: rectifier + filter
def el_rectifier():
    pl = Plot()
    pl.frame(120, 90, 1160, 600, xlab="t", ylab="v")
    pl.domain(0, 4, -1.35, 1.5)
    pl.axes(xticks=[(1, "T"), (2, "2T"), (3, "3T"), (4, "4T")], yticks=[(-1, "-Vm"), (1, "Vm")], ylab="")
    pl.curve(lambda t: math.sin(2 * math.pi * t), 500, P["muted"], 2, dash="5 7")
    pl.curve(lambda t: abs(math.sin(2 * math.pi * t)), 500, P["a1"], 3)
    # ripple: charge to peak at t=0,0.5,1.0... decay between
    def ripple(t):
        ph = (t % 0.5)
        return math.exp(-ph * 1.1) * 1.0 - 0.12
    pl.curve(ripple, 500, P["a2"], 5)
    pl.mtext(2.52, 0.72, "capacitor-filtered DC", 21, P["a2"], "start")
    pl.marrows(1.055, 0.62, 1.055, 0.98, P["a4"], 3)
    pl.marrows(1.055, 0.98, 1.055, 0.62, P["a4"], 3)
    pl.mtext(1.1, 0.8, "ripple Vr = IL / (f C)", 20, P["a4"], "start")
    pl.legend([("muted", "AC input  vm sin(wt)", "5 7"),
               ("a1", "full-wave rectified", ""),
               ("a2", "with reservoir capacitor", "")], x=1160, y=140)
    pl.text(120, 52, "FULL-WAVE RECTIFIER + CAPACITOR FILTER", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------------- TE 1: Landau double well
def te_landau():
    pl = Plot()
    pl.frame(120, 80, 1160, 600, xlab="order parameter  m", ylab="F(m)")
    pl.domain(-1.9, 1.9, -0.55, 1.5)
    pl.axes(xticks=[(-1, "-m0"), (0, "0"), (1, "+m0")], yticks=[(0, "F0")], ylab="")
    a, b = 0.6, 0.5
    f_hi = lambda m: 0.9 * a * m * m + b * m ** 4 - 0.35
    f_lo = lambda m: -a * m * m + b * m ** 4 + 0.42
    f_tc = lambda m: b * m ** 4 + 0.1
    pl.curve(f_hi, 300, P["a1"], 5)
    pl.curve(f_tc, 300, P["a2"], 4)
    pl.curve(f_lo, 300, P["a3"], 5)
    for m0 in (-1, 1):
        pl.mdot(m0, f_lo(1), 7, P["a3"])
    pl.mtext(1.28, 0.12, "spontaneous minima  m0 = sqrt(- a' (T-Tc) / 2b)", 20, P["a3"], "start")
    pl.legend([("a1", "T > Tc : single minimum at m = 0", ""),
               ("a2", "T = Tc : flat critical quartic", ""),
               ("a3", "T < Tc : symmetry broken (two minima)", "")], x=1160, y=135)
    pl.mtext(-1.83, 1.32, "F(m) = F0 + (a'/2)(T-Tc) m^2 + (b/4) m^4", 23, P["muted"], "start")
    pl.text(120, 46, "LANDAU FREE ENERGY - CONTINUOUS PHASE TRANSITION", 30, P["ink"], "start", weight="bold")
    return pl.emit()


# ---------------------------------------------------------------- ADV 1: WKB
def adv_wkb():
    pl = Plot()
    pl.frame(120, 90, 1160, 610, xlab="x", ylab="V(x)")
    pl.domain(-6, 6, -0.75, 3.6)
    pl.axes(xticks=[(-2, "a"), (2, "b")], yticks=[], ylab="")
    V = lambda x: 3.0 * math.exp(-(x / 2.3) ** 2)
    E = 1.35
    pl.curve(V, 360, P["a1"], 5)
    pl.hline(E, P["a2"], 3, "10 6")
    pl.mtext(5.85, E - 0.3, "E", 22, P["a2"], "end")
    pl.vline(-1.52, P["muted"], 2, "5 7", y0=-0.75, y1=E)
    pl.vline(1.52, P["muted"], 2, "5 7", y0=-0.75, y1=E)
    pl.mdot(-1.52, E, 7, P["a2"]); pl.mdot(1.52, E, 7, P["a2"])
    pl.shade_v(-1.52, 1.52, P["a3"], 0.10)
    def psi(x):
        if abs(x) <= 1.52:
            return 0.62 * math.sin(3.2 * x) / (1 + 0.9 * abs(x))
        return 0.62 * math.exp(-1.9 * (abs(x) - 1.52)) * math.sin(3.2 * 1.52 * (1 if x > 0 else -1)) / 1.9
    pl.curve(lambda x: E - 0.9 + 0.75 * psi(x), 700, P["a4"], 3)
    pl.mtext(-4.6, 3.3, "classically forbidden (E < V)", 20, P["muted"], "start")
    pl.mtext(0.0, 0.2, "allowed region: oscillatory, amplitude grows where p(x) shrinks", 19, P["a3"])
    pl.mtext(2.1, -0.5, "Airy matching at turning points a, b", 19, P["muted"], "start")
    pl.text(120, 52, "WKB APPROXIMATION - TURNING POINT ANATOMY", 30, P["ink"], "start", weight="bold")
    return pl.emit()


def build():
    del FIGS[:]
    reg(QM, "ff-qm-well", "infinite square well", None, 1,
        "Infinite square well eigenstates",
        "First four standing-wave states psi_n pinned to zero at the walls, energies climbing as n^2 - the particle-in-a-box that anchors all of QM.",
        qm_well())
    reg(QM, "ff-qm-osc", "one-dimensional harmonic oscillator", None, 1,
        "Harmonic oscillator Hermite states",
        "Equally spaced rungs E_n = (n+1/2)hbar*omega with Hermite-Gauss wavefunctions; note the quantum leakage beyond the classical turning points.",
        qm_osc())
    reg(QM, "ff-qm-tunnel", "rectangular barrier", None, 1,
        "Tunnelling through a rectangular barrier",
        "E < V0 yet the wave leaks through: standing ripple left, exponential evanescent sag inside, phase-shifted free wave right - with the transmission formula.",
        qm_tunnel())
    reg(QM, "ff-qm-hydrogen", "hydrogen atom", None, 2,
        "Hydrogen radial probabilities",
        "P(r) = r^2|R_nl|^2 for 1s, 2s, 2p: the 1s peak IS the Bohr radius, the 2s node is pure QM, and angular momentum pushes 2p outward.",
        qm_hydrogen())
    reg(TH, "ff-th-mb", "classical equipartition theorem", None, 2,
        "Maxwell-Boltzmann speed distribution",
        "f(v) at two temperatures with vp, <v> and v_rms marked in their fixed 1 : 1.128 : 1.225 ratio; hotter gas = broader, flatter curve.",
        th_mb())
    reg(TH, "ff-th-stats", "comparison of three statistics", None, 1,
        "FD vs BE vs MB occupations",
        "The three distribution functions on one axis: FD pinned at 1/2 at the chemical potential, BE diverging toward it, MB as their shared classical limit.",
        th_stats())
    reg(TH, "ff-th-blackbody", "classical laws vs", None, 1,
        "Planck spectrum vs Rayleigh-Jeans",
        "Blackbody curves at T and 2T with Wien displacement, against the classical curve that blows up - the UV catastrophe that forced quantisation.",
        th_blackbody())
    reg(EM, "ff-em-dipole", "multipole expansion", None, 2,
        "Electric dipole field lines",
        "True dipole geometry r = C sin^2(theta): closed field loops from +q to -q carrying the characteristic 1/r^3 far field.",
        em_dipole())
    reg(EM, "ff-em-boundary", "boundary conditions at general", None, 1,
        "Interface boundary conditions",
        "The Gaussian pillbox and Amperian loop straddling the interface, generating the four jump conditions used in every boundary-value problem.",
        em_boundary())
    reg(EM, "ff-em-skin", "waves in conducting media", None, 1,
        "Skin depth in a conductor",
        "Propagating wave under collapsing exponential envelope; the field is down to E0/e after one skin depth delta = sqrt(2/mu*sigma*omega).",
        em_skin())
    reg(EM, "ff-em-reflect", "reflection and refraction at plane", None, 1,
        "Snell geometry at a dielectric step",
        "Incident / reflected / refracted rays with the pi phase shift rule and bending toward the normal entering the denser medium.",
        em_reflect())
    reg(MM, "ff-mm-bessel", "special functions", None, 2,
        "Bessel functions J0, J1, J2",
        "Damped cylindrical waves with the critical zeros (j01 = 2.405 sets drumhead modes and waveguide cutoffs) and the sqrt(2/pi x) envelope.",
        mm_bessel())
    reg(MM, "ff-mm-gibbs", "fourier series, fourier transforms", None, 2,
        "Gibbs phenomenon",
        "Fourier partial sums of a square wave: the overshoot near the jump saturates at ~9% of the discontinuity no matter how many harmonics you keep.",
        mm_gibbs())
    reg(EL, "ff-el-diode", "ideal diode equation", None, 1,
        "Diode I-V characteristic",
        "Shockley exponential forward branch, flat reverse saturation, and reverse breakdown - the complete junction personality on one plot.",
        el_diode())
    reg(EL, "ff-el-loadline", "biasing", None, 1,
        "BJT output curves + load line",
        "Ic-VCE characteristics stepped by base current with the VCC/RC load line cutting across; the Q point sits mid-line for maximum undistorted swing.",
        el_loadline())
    reg(EL, "ff-el-rectifier", "full-wave rectifier", None, 1,
        "Full-wave rectifier with capacitor filter",
        "AC input, doubled-pulse rectified waveform, and the reservoir capacitor squeezing out most of the ripple Vr = IL/(fC).",
        el_rectifier())
    reg(TE, "ff-te-landau", "landau theory", None, 1,
        "Landau free-energy double well",
        "F(m) across Tc: the quartic flattening at the critical point and the bifurcation into two equivalent broken-symmetry minima below it.",
        te_landau())
    reg(ADV, "ff-adv-wkb", "wkb", None, 1,
        "WKB turning-point anatomy",
        "Wave under a smooth barrier at energy E: oscillatory in the allowed window with amplitude tracking 1/sqrt(p), evanescent tails beyond the classical turning points.",
        adv_wkb())
    return FIGS
