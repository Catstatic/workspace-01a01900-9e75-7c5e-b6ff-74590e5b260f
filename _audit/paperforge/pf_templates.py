#!/usr/bin/env python3
"""PAPERFORGE STAGE 2 — the 12 launch figure templates.
Every template: fn(pal, **params) -> SVG string. Pure constructible geometry,
byte-lean, palette-locked. Deterministic in (params, palette)."""
import math
from pf_figkit import Fig, f

# ---------------------------------------------------------------- 1 · QM
def qm_well_states(pal, levels=4, Llab="L"):
    g = Fig(pal)
    x0, x1, floor, top = 330, 870, 600, 90
    g.line(x0, floor, x1, floor, pal["axis"], 3)
    g.arrow(x1, floor, x1 + 140, floor, pal["axis"], 3)
    g.text(x1 + 150, floor + 8, "x", 26, pal["ink"], "start")
    g.text(x0, floor + 34, "0", 24, pal["muted"])
    g.text(x1, floor + 34, Llab, 24, pal["muted"])
    for X in (x0, x1):
        g.line(X, floor, X, top, pal["axis"], 5)
        g.hatch(X + (0 if X == x0 else 0), floor - 20, (0 if X == x0 else 0), -1,
                8, ln=-24 if X == x0 else 24, stroke=pal["muted"], w=2)
        g.text(X + (-26 if X == x0 else 26), top + 6, "∞", 30, pal["muted"],
               "end" if X == x0 else "start")
    g.text(x0 - 26, floor - 10, "V(x)", 24, pal["muted"], "end")
    scale, yb = 460.0 / (levels * levels), 585
    for n in range(1, levels + 1):
        yn = yb - scale * n * n
        g.line(x0, yn, x1, yn, pal["dash"], 1, dash="5 9")
        amp = 34.0 - 3 * n
        pts = []
        L = x1 - x0
        for i in range(61):
            xx = x0 + L * i / 60.0
            yy = yn - amp * math.sin(n * math.pi * (i / 60.0))
            pts.append((xx, yy))
        ac = [pal["a1"], pal["a2"], pal["a4"], pal["a3"]][(n - 1) % 4]
        g.poly(pts, ac, 3)
        g.text(x1 + 36, yn + 6, "n=%d" % n, 22, ac, "start")
        g.text(x1 + 36, yn + 32, "E%s" % ("₁₂₃₄"[n - 1]), 20, pal["muted"], "start")
    g.text(x0, 70, "ψₙ(x) on quantized levels", 22, pal["muted"], "start")
    return g.emit()

# ---------------------------------------------------------------- 2 · CM
def cm_phase_portrait(pal, orbits=3, w0lab="ω₀"):
    g = Fig(pal)
    cx, cy, spr, spt = 600, 350, 80.0, 200.0 / math.pi  # y px/unit, x px/rad
    g.arrow(cx - 470, cy, cx + 470, cy, pal["axis"], 3)
    g.arrow(cx, cy + 250, cx, cy - 280, pal["axis"], 3)
    g.text(cx + 472, cy + 8, "θ", 26, pal["ink"], "start")
    g.text(cx - 10, cy - 288, "θ̇", 26, pal["ink"], "end")
    for lab, th in (("−2π", -2 * math.pi), ("−π", -math.pi), ("π", math.pi), ("2π", 2 * math.pi)):
        X = cx + th * spt
        g.line(X, cy - 8, X, cy + 8, pal["axis"], 2)
        g.text(X, cy + 34, lab, 20, pal["muted"])
    g.text(cx, cy + 34, "0", 20, pal["muted"])
    # separatrices ω = ±2ω0 cos(θ/2), dashed
    for sgn in (1, -1):
        pts = []
        for i in range(81):
            th = -math.pi + 2 * math.pi * i / 80.0
            pts.append((cx + th * spt, cy - sgn * spr * 2 * math.cos(th / 2)))
        g.poly(pts, pal["a3"], 2, dash="8 8")
    # closed orbits: ellipse families about stable centres 0, ±2π
    # (ω0=1 → b_px = a_px·spr/spt·? kept strictly inside the separatrix, b<160)
    for cθ, base in ((0.0, [(50.0, 63.0), (90.0, 113.0), (125.0, 157.0)]),
                     (-2 * math.pi, [(90.0, 113.0)]), (2 * math.pi, [(90.0, 113.0)])):
        for j in range(min(orbits, len(base))):
            a, b = base[j]
            pts = []
            for i in range(73):
                t = 2 * math.pi * i / 72.0
                pts.append((cx + cθ * spt + a * math.cos(t), cy - b * math.sin(t)))
            g.poly(pts, pal["a1"], 2)
    # sense arrows
    g.arrow(cx + 125, cy - 4, cx + 125, cy + 26, pal["a1"], 2)
    g.arrow(cx - 125, cy + 4, cx - 125, cy - 26, pal["a1"], 2)
    g.arrow(cx + 150, cy - 132, cx + 128, cy - 142, pal["a3"], 2)
    g.text(cx, 84, "pendulum phase portrait — separatrix dashed", 22, pal["muted"])
    return g.emit()

# ---------------------------------------------------------------- 3 · ELECTRONICS
def el_opamp_inverting(pal, rin="10 kΩ", rf="100 kΩ"):
    g = Fig(pal)
    p = pal
    g.poly([(560, 250), (560, 490), (800, 370)], p["a1"], 4, close=True)
    g.text(600, 306, "−", 30, p["ink"], "start")
    g.text(600, 452, "+", 28, p["ink"], "start")
    # input leg
    g.circle(205, 300, 9, p["ink"], 3)
    g.text(190, 262, "V_in", 24, p["ink"])
    g.line(214, 300, 315, 300, p["ink"], 3)
    g.zigzag(315, 300, 475, 300, 6, 15, p["a2"], 3)
    g.line(475, 300, 560, 300, p["ink"], 3)
    g.dot(475, 300, 6)
    g.text(395, 268, "R_in", 24, p["a2"])
    # (+) grounded
    g.line(560, 440, 490, 440, p["ink"], 3)
    g.line(490, 440, 490, 515, p["ink"], 3)
    g.ground(490, 515, p["ink"], 3)
    # feedback leg
    g.line(475, 300, 475, 185, p["ink"], 3)
    g.line(475, 185, 520, 185, p["ink"], 3)
    g.zigzag(520, 185, 690, 185, 6, 15, p["a2"], 3)
    g.line(690, 185, 850, 185, p["ink"], 3)
    g.line(850, 185, 850, 370, p["ink"], 3)
    g.text(605, 152, "R_f", 24, p["a2"])
    # output
    g.line(800, 370, 920, 370, p["ink"], 3)
    g.dot(850, 370, 6)
    g.circle(925, 370, 9, p["ink"], 3)
    g.text(948, 378, "V_out", 24, p["ink"], "start")
    g.text(600, 600, "A_v = −R_f/R_in   (%s → %s)" % (rin, rf), 24, p["muted"])
    g.text(600, 80, "inverting amplifier", 22, p["muted"])
    return g.emit()

# ---------------------------------------------------------------- 4 · OPTICS
def op_thin_lens(pal, u="30 cm", f="15 cm"):
    g = Fig(pal)
    p = pal
    ax, cxl = 400, 600
    g.arrow(90, ax, 1110, ax, p["axis"], 3)
    # biconvex lens
    g.parts.append('<ellipse cx="600" cy="400" rx="38" ry="210" fill="none" stroke="%s" stroke-width="4"/>' % p["a1"])
    g.arrow(600, 186, 600, 158, p["a1"], 3)
    g.arrow(600, 614, 600, 642, p["a1"], 3)
    fpx, upx = 180, 300
    ox, otip = cxl - upx, ax - 130
    vpx = fpx * upx // (upx - fpx)
    ix, itip = cxl + vpx, ax + 195
    for X, lab in ((cxl - fpx, "F"), (cxl + fpx, "F′"), (cxl - 2 * fpx, "2F"), (cxl + 2 * fpx, "2F′")):
        g.line(X, ax - 10, X, ax + 10, p["axis"], 2)
        g.text(X, ax + 40, lab, 22, p["muted"])
    g.arrow(ox, ax, ox, otip, p["a2"], 5)
    g.text(ox, otip - 18, "object", 22, p["a2"])
    g.arrow(ix, ax, ix, itip, p["a3"], 5)
    g.text(ix, itip + 34, "image (real, inverted)", 22, p["a3"])
    # three construction rays
    g.line(ox, otip, cxl, otip, p["a5"], 3)
    g.line(cxl, otip, ix, itip, p["a5"], 3)
    g.line(ox, otip, cxl + (ax - otip) * (ix - ox) // (ax - otip) if False else cxl, ax, p["a4"], 3)
    g.line(cxl, ax, ix, itip, p["a4"], 3)
    g.line(ox, otip, cxl, itip if itip <= ax + 210 else ax + 210, p["a3"], 2, dash="9 7")
    g.line(cxl, itip if itip <= ax + 210 else ax + 210, ix, itip, p["a3"], 2, dash="9 7")
    g.text((ox + cxl) // 2, ax + 76, "u = " + u, 22, p["ink"])
    g.text((cxl + ix) // 2, ax + 76, "v", 22, p["ink"])
    g.text(90, 120, "f = " + f, 24, p["a1"], "start")
    g.text(600, 80, "thin-lens imaging (u > f)", 22, p["muted"])
    return g.emit()

# ---------------------------------------------------------------- 5 · SOLID STATE
def ss_miller(pal, h=2, k=1):
    g = Fig(pal)
    p = pal
    ox, oy, sp, NX, NY = 240, 580, 100, 6, 4
    g.arrow(ox - 60, oy, ox + 100, oy, p["axis"], 3)
    g.text(ox - 30, oy + 36, "a", 24, p["muted"])
    g.arrow(ox - 60, oy, ox - 60, oy - 100, p["axis"], 3)
    g.text(ox - 96, oy - 60, "b", 24, p["muted"])
    for i in range(NX + 1):
        for j in range(NY + 1):
            g.dot(ox + i * sp, oy - j * sp, 6, p["ink"])
    def clipseg(m):
        pts = []
        for xv in (-0.0, NX):
            yv = (m - h * xv) / k
            if -0.001 <= yv <= NY + 0.001:
                pts.append((xv, yv))
        for yv in (0.0, NY):
            xv = (m - k * yv) / h
            if -0.001 <= xv <= NX + 0.001 and all(abs(xv - a) > 1e-6 or abs(yv - b) > 1e-6 for a, b in pts):
                pts.append((xv, yv))
        pts = pts[:2]
        return [(ox + a * sp, oy - b * sp) for a, b in pts]
    midprev = None
    for m in (1, 2, 3):
        seg = clipseg(m)
        if len(seg) == 2:
            (X1, Y1), (X2, Y2) = seg
            g.line(X1, Y1, X2, Y2, p["a2"], 26, cap="butt")
            g.line(X1, Y1, X2, Y2, p["a2"], 3)
            g.parts[-2] = g.parts[-2].replace('stroke-width="26"', 'stroke-width="26" opacity="0.18"')
            mid = ((X1 + X2) / 2, (Y1 + Y2) / 2)
            if midprev:
                g.arrow(midprev[0], midprev[1], mid[0], mid[1], p["a3"], 2)
                g.text((midprev[0] + mid[0]) / 2 + 42, (midprev[1] + mid[1]) / 2, "d", 24, p["a3"])
            midprev = mid
    g.text(ox + 30, oy - NY * sp - 70, "(%d%d) lattice planes" % (h, k), 26, p["a2"], "start")
    g.text(ox + 44, oy + 46, "a/h = a/%d" % h, 20, p["muted"], "start")
    return g.emit()

# ---------------------------------------------------------------- 6 · MATH (contour)
def mp_contour_poles(pal, poles=2):
    g = Fig(pal)
    p = pal
    cx, ry, R = 600, 540, 400
    g.arrow(110, ry, 1090, ry, p["axis"], 3)
    g.arrow(cx, 660, cx, 70, p["axis"], 3)
    g.text(1094, ry + 8, "Re z", 24, p["ink"], "start")
    g.text(cx - 12, 66, "Im z", 24, p["ink"], "end")
    g.path("M %d %d A %d %d 0 0 1 %d %d" % (cx - R, ry, R, R, cx + R, ry), p["a1"], 4)
    g.line(cx - R, ry, cx + R, ry, p["a1"], 4)
    g.arrow_path("M %d %d A %d %d 0 0 1 %d %d" % (cx + R - 4, ry - 30, R, R, cx + R - 82, ry - 92), p["a1"], 4)
    g.arrow(cx - 240, ry, cx - 140, ry, p["a1"], 4)  # CCW: -R -> R along axis
    g.text(cx + R + 8, ry - 60, "C_R", 26, p["a1"], "start")
    g.text(cx - R, ry + 40, "−R", 22, p["muted"])
    g.text(cx + R, ry + 40, "R", 22, p["muted"])
    g.text(cx, ry + 40, "0", 22, p["muted"])
    ppts = [(cx - 110, ry - 230, "z₁ = ia"), (cx + 160, ry - 330, "z₂ = ib")][:poles]
    for X, Y, lab in ppts:
        g.cross(X, Y, 9, p["a3"], 4)
        g.text(X, Y - 22, lab, 22, p["a3"])
    g.text(300, 94, "upper half-plane residue contour", 22, p["muted"])
    return g.emit()

# ---------------------------------------------------------------- 7 · THERMO
def th_carnot(pal, T_h="T_H", T_c="T_C"):
    g = Fig(pal)
    p = pal
    ox, oy = 230, 580
    g.arrow(ox, oy, 1090, oy, p["axis"], 3)
    g.arrow(ox, oy, ox, 110, p["axis"], 3)
    g.text(1094, oy + 8, "V", 26, p["ink"], "start")
    g.text(ox - 16, 104, "P", 26, p["ink"], "end")
    hot = "M330 205 C 430 230 545 272 690 345"
    cold = "M565 505 C 690 468 830 448 990 444"
    g.path(hot, p["a3"], 4)
    g.path(cold, p["a1"], 4)
    S1, S2, S3, S4 = (388, 218), (612, 318), (915, 449), (622, 484)
    g.path("M612 318 C 745 372 845 415 915 449", p["a2"], 3, dash="10 8")
    g.path("M622 484 C 545 445 460 350 388 218", p["a2"], 3, dash="10 8")
    for (X, Y), lab, dx, dy in ((S1, "1", -30, -12), (S2, "2", 22, -14), (S3, "3", 24, 4), (S4, "4", -34, 10)):
        g.dot(X, Y, 7, p["ink"])
        g.text(X + dx, Y + dy, lab, 26, p["ink"], weight="bold")
    g.arrow_path("M455 237 C 505 257 545 274 590 292", p["a3"], 3)
    g.arrow_path("M860 452 C 800 456 745 462 690 470", p["a1"], 3)
    g.arrow_path("M742 372 C 792 394 838 416 872 433", p["a2"], 3)
    g.arrow_path("M520 424 C 490 380 460 330 432 280", p["a2"], 3)
    g.text(742, 336, "isotherm " + T_h, 22, p["a3"], "start")
    g.text(1000, 470, T_c, 22, p["a1"], "start")
    g.text(296, 176, "adiabats (dashed)", 22, p["a2"], "start")
    g.text(600, 650, "Carnot cycle — 1→2 isothermal, 2→3 adiabatic", 22, p["muted"])
    return g.emit()

# ---------------------------------------------------------------- 8 · EM
def em_gauss_pillbox(pal, sigma="σ"):
    g = Fig(pal)
    p = pal
    g.rect(300, 190, 600, 26, p["ink"], 3, fill=p["grid"])
    g.rect(300, 470, 600, 26, p["ink"], 3, fill=p["grid"])
    for x in range(360, 900, 90):
        g.text(x, 185, "+", 26, p["a3"])
        g.text(x, 522, "−", 26, p["a1"])
    g.text(918, 212, "+" + sigma, 26, p["a3"], "start")
    g.text(918, 494, "−" + sigma, 26, p["a1"], "start")
    for x in (400, 520, 640, 760):
        g.arrow(x, 240, x, 450, p["a2"], 3)
    g.text(810, 350, "E", 30, p["a2"], "start")
    g.rect(430, 148, 130, 100, p["a5"], 3, dash="9 7")
    g.dot(495, 203, 0.1)
    g.line(560, 175, 700, 175, p["a5"], 2, dash="4 6")
    g.text(710, 182, "Gaussian pillbox, face area A", 22, p["a5"], "start")
    g.text(600, 650, "infinite sheets: E = %s/ε₀ (outside) — pillbox proof" % sigma, 22, p["muted"])
    g.text(600, 80, "parallel-plate field + Gaussian surface", 22, p["muted"])
    return g.emit()

# ---------------------------------------------------------------- 9 · ATOMIC
def am_zeeman(pal, note="ΔE = g_J·μ_B·B"):
    g = Fig(pal)
    p = pal
    g.arrow(120, 560, 120, 130, p["axis"], 3)
    g.text(96, 128, "E", 26, p["ink"], "end")
    g.text(305, 84, "B = 0", 26, p["muted"])
    g.text(860, 84, "B ≠ 0", 26, p["muted"])
    g.line(660, 110, 660, 560, p["dash"], 1, dash="4 10")
    g.line(180, 240, 430, 240, p["a1"], 4)
    g.text(445, 247, "¹P₁", 24, p["a1"], "start")
    g.line(180, 470, 430, 470, p["a1"], 4)
    g.text(445, 477, "¹S₀", 24, p["a1"], "start")
    g.arrow(240, 240, 240, 470, p["a2"], 3, dash="8 6")
    g.text(258, 362, "ν₀", 24, p["a2"], "start")
    upy = [(200, "+1"), (250, "0"), (300, "−1")]
    for Y, m in upy:
        g.line(700, Y, 1010, Y, p["a1"], 4)
        g.text(1024, Y + 7, "m_J=" + m if m != "−1" else "m_J=−1", 20, p["muted"], "start")
    g.line(700, 480, 1010, 480, p["a1"], 4)
    g.text(1024, 487, "m_J=0", 20, p["muted"], "start")
    g.line(700, 200, 700, 300, p["dash"], 2, dash="3 6")
    for (X0, Y0, lab) in ((780, 200, "σ⁺"), (860, 250, "π"), (940, 300, "σ⁻")):
        g.arrow(X0, Y0, X0, 480, p["a2"], 3)
        g.text(X0, 516, lab, 22, p["a2"])
    g.text(855, 560, "normal Zeeman triplet", 24, p["muted"])
    g.text(600, 640, note, 24, p["muted"])
    return g.emit()

# ---------------------------------------------------------------- 10 · NUCLEAR
def nu_semf(pal, markers=1):
    g = Fig(pal)
    p = pal
    ox, oy = 200, 580
    X = lambda A: ox + A * 3.5
    Y = lambda E: oy - E * 53
    g.arrow(ox, oy, 1080, oy, p["axis"], 3)
    g.arrow(ox, oy, ox, 90, p["axis"], 3)
    g.text(1084, oy + 8, "A", 26, p["ink"], "start")
    g.text(ox - 18, 84, "B/A (MeV)", 24, p["ink"], "end")
    for e in (2, 4, 6, 8):
        g.line(ox, Y(e), 1060, Y(e), p["grid"], 1, dash="3 9")
        g.text(ox - 16, Y(e) + 7, str(e), 20, p["muted"], "end")
    for A in (50, 100, 150, 200):
        g.line(X(A), oy - 8, X(A), oy + 8, p["axis"], 2)
        g.text(X(A), oy + 34, str(A), 20, p["muted"])
    pts = [(2, 1.11), (4, 7.07), (6, 5.33), (12, 7.68), (16, 7.98), (27, 8.33),
           (40, 8.55), (56, 8.79), (62, 8.79), (75, 8.73), (105, 8.59),
           (140, 8.38), (185, 8.10), (215, 7.89), (238, 7.59)]
    g.poly([(X(a), Y(e)) for a, e in pts], p["a2"], 4)
    if markers:
        g.dot(X(62), Y(8.79), 8, p["a3"])
        g.text(X(62) + 24, Y(8.79) - 16, "Fe peak (8.79)", 22, p["a3"], "start")
        g.dot(X(238), Y(7.59), 7, p["a1"])
        g.text(X(238) - 20, Y(7.59) - 18, "²³⁵U", 22, p["a1"], "end")
        g.dot(X(2), Y(1.11), 7, p["a4"])
        g.text(X(2) + 18, Y(1.11) + 26, "²H", 22, p["a4"], "start")
        g.arrow_path("M340 505 C 350 420 370 250 410 130", p["a4"], 3, dash="9 7")
        g.text(258, 512, "fusion", 22, p["a4"])
        g.arrow_path("M990 240 C 860 170 650 115 470 120", p["a3"], 3, dash="9 7")
        g.text(830, 130, "fission", 22, p["a3"])
    g.text(600, 650, "semi-empirical mass formula — binding per nucleon", 22, p["muted"])
    return g.emit()

# ---------------------------------------------------------------- 11 · WAVES
def wv_dispersion(pal, k0f=0.55):
    g = Fig(pal)
    p = pal
    ox, oy = 230, 580
    g.arrow(ox, oy, 1080, oy, p["axis"], 3)
    g.arrow(ox, oy, ox, 90, p["axis"], 3)
    g.text(1084, oy + 8, "k", 26, p["ink"], "start")
    g.text(ox - 18, 84, "ω", 26, p["ink"], "end")
    QX, QY = 780.0, 420.0
    pts = []
    for i in range(81):
        k = math.pi * i / 80.0
        pts.append((ox + k / math.pi * QX, oy - QY * math.sin(k / 2)))
    g.poly(pts, p["a1"], 4)
    k0 = k0f * math.pi
    px, py = ox + k0f * QX, oy - QY * math.sin(k0 / 2)
    # phase velocity: true chord from origin through k0 point, extended 1.34×
    ex, ey = ox + (px - ox) * 1.34, oy - (oy - py) * 1.34
    g.line(ox, oy, ex, ey, p["a2"], 2, dash="9 7")
    g.text(ex + 12, ey + 4, "v_p = ω/k", 22, p["a2"], "start")
    # group velocity: tangent at k0, px-slope (QY/QX)·0.5·cos(k0/2)
    m = (QY / QX) * 0.5 * math.cos(k0 / 2)
    g.line(px - 190, py + 190 * m, px + 190, py - 190 * m, p["a4"], 2, dash="3 7")
    g.text(px + 160, py - 190 * m + 38, "v_g = dω/dk", 22, p["a4"], "start")
    g.dot(px, py, 7, p["a3"])
    g.text(px, py + 34, "k₀", 22, p["a3"])
    g.text(ox + QX, oy + 36, "π", 20, p["muted"])
    g.line(ox + QX, oy - 8, ox + QX, oy + 8, p["axis"], 2)
    g.text(600, 650, "monatomic chain: ω(k) = 2ω₀·|sin(ka/2)|", 22, p["muted"])
    return g.emit()

# ---------------------------------------------------------------- 12 · GA / DATA
def ga_bar_chart(pal, s1=(62, 70, 58, 80), s2=(18, 22, 20, 31),
                 cats=("2017", "2019", "2021", "2023"),
                 l1="Appeared (×10³)", l2="Qualified (×10³)", unit="×10³"):
    g = Fig(pal)
    p = pal
    ox, oy = 250, 580
    sc = 5.0
    g.arrow(ox, oy, 1090, oy, p["axis"], 3)
    g.arrow(ox, oy, ox, 100, p["axis"], 3)
    g.text(ox - 20, 88, unit, 22, p["ink"], "end")
    for v in range(10, 91, 10):
        y = oy - v * sc
        g.line(ox, y, 1070, y, p["grid"], 1, dash="3 9")
        g.text(ox - 16, y + 7, str(v), 18, p["muted"], "end")
    for c, a, b in zip(cats, s1, s2):
        cx = 360 + (cats.index(c)) * 200
        for dx, val, col in ((-70, a, p["a1"]), (6, b, p["a2"])):
            h = val * sc
            g.rect(cx + dx, oy - h, 64, h, None, 0, fill=col)
            g.parts[-1] = g.parts[-1].replace('stroke="None"', 'stroke="none"')
            g.text(cx + dx + 32, oy - h - 12, str(val), 20, p["ink"])
        g.text(cx, oy + 36, c, 24, p["ink"])
    g.rect(292, 118, 26, 26, None, 0, fill=p["a1"])
    g.parts[-1] = g.parts[-1].replace('stroke="None"', 'stroke="none"')
    g.text(330, 138, l1, 22, p["ink"], "start")
    g.rect(292, 158, 26, 26, None, 0, fill=p["a2"])
    g.parts[-1] = g.parts[-1].replace('stroke="None"', 'stroke="none"')
    g.text(330, 178, l2, 22, p["ink"], "start")
    g.text(600, 650, "exam-year wise candidates", 22, p["muted"])
    return g.emit()

TEMPLATES = [
    ("qm-well-states",    "QM — infinite well: levels + ψₙ",            "quantum",     qm_well_states,    dict(levels=4)),
    ("cm-phase-portrait", "CM — pendulum phase portrait + separatrix",  "classical",   cm_phase_portrait, dict(orbits=3)),
    ("el-opamp-inverting","Electronics — inverting op-amp",             "electronics", el_opamp_inverting, dict(rin="10 kΩ", rf="100 kΩ")),
    ("op-thin-lens",      "Optics — thin-lens real imaging",            "atomic",      op_thin_lens,      dict(u="30 cm", f="15 cm")),
    ("ss-miller-planes",  "Solid state — (21) lattice planes + d",      "solidstate",  ss_miller,         dict(h=2, k=1)),
    ("mp-contour-poles",  "Math — residue contour, 2 poles",            "mathphys",    mp_contour_poles,  dict(poles=2)),
    ("th-carnot-pv",      "Thermo — Carnot P–V cycle",                  "thermo",      th_carnot,         dict(T_h="T_H", T_c="T_C")),
    ("em-gauss-pillbox",  "EM — parallel plates + Gaussian pillbox",    "emtheory",    em_gauss_pillbox,  dict(sigma="σ")),
    ("am-zeeman-triplet", "Atomic — normal Zeeman fan",                 "atomic",      am_zeeman,         dict(note="ΔE = g_J·μ_B·B")),
    ("nu-semf-curve",     "Nuclear — SEMF B/A curve, fission/fusion",   "nuclear",     nu_semf,           dict(markers=1)),
    ("wv-dispersion",     "Waves — ω(k): v_p vs v_g",                   "classical",   wv_dispersion,     dict(k0f=0.55)),
    ("ga-bar-chart",      "GA — grouped bar data chart",                "aptitude",    ga_bar_chart,      dict()),
]
