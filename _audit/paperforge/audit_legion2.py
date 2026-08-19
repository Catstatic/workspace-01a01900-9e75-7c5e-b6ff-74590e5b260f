#!/usr/bin/env python3
"""PAPERFORGE S4 audit-solve — independent re-derivation of every number that
appears in Legion II answers. NAT rows assert the recomputed value lands inside
the bank window; MCQ rows assert the recomputed value equals the numeric face
of the KEYED option (robust to letter rotation). Any mismatch halts the forge."""
import math, json, re, subprocess, sys

checks = []

def chk(qid, recomputed, expected, kind="nat", tol=0.0):
    checks.append((qid, recomputed, expected, kind, tol))

# ---------- NAT keys (window or point) ----------
chk('PF-QM-03', 13.6*(1-1/9)/13.6, 8/9)                        # H 3->1 / 13.6 eV
chk('PF-QM-07', 3, 3)                                          # perms of (2,1,1)
chk('PF-QM-10', (2+0.5)*1/2, 1.25)                             # virial <T>, hbar*omega=1 eV
chk('PF-QM-14', 3/2, 1.5)                                      # <r>/a0 for 1s
chk('PF-QM-18', 0.5+1/math.pi, 0.81831)                        # middle-half probability
chk('PF-TH-23', 7.566e-16*1e16/3, 2.522)                       # photon pressure at 1e4 K
chk('PF-TH-27', 3*(1/3)**2*math.exp(1/3)/(math.exp(1/3)-1)**2, 2.9722)  # Einstein Cv/R
chk('PF-TH-31', 8*0.364/(27*8.314*4.27e-5), 303.80)            # vdW Tc
chk('PF-TH-33', 1.5*8.617e-2*300, 38.7765)                     # equipartition meV
chk('PF-EL-37', 1/(2*math.pi*1590*100e-9), 1000.97)            # RC cutoff Hz
chk('PF-EL-41', 1.44/(3e4*10e-9), 4800.0)                      # 555 astable Hz
chk('PF-EL-44', int('1011', 2), 11)                            # binary
chk('PF-AN-47', 0.5**3, 0.125)                                 # 3 half-lives
chk('PF-AN-52', 36/(5*1.097e7)*1e9, 656.34)                    # Balmer-alpha nm
chk('PF-SS-55', 1/(8.5e28*1.602e-19)/1e-11, 7.3516)            # Hall coeff /1e-11
chk('PF-SS-58', 0.040*(4/2)**3, 0.32)                          # Debye T^3
chk('PF-SS-60', 4.05/math.sqrt(2), 2.8637)                     # FCC neighbour

# ---------- MCQ keyed-option groundings ----------
chk('PF-QM-08', 0.5, 0.5, "mcq", 1e-12)                        # |<+x|+z>|^2
chk('PF-QM-20', math.cos(math.pi/4)**2, 0.5, "mcq", 1e-12)     # Larmor return prob
chk('PF-QM-11', 12.27/math.sqrt(100)/10, 0.123, "mcq", 1e-9)   # de Broglie nm
chk('PF-TH-22', 8.314*math.log(2), 5.7628, "mcq", 1e-3)        # nR ln2
chk('PF-TH-26', 8**(2/3), 4.0, "mcq", 1e-12)                   # E_F scaling
chk('PF-TH-28', 1/(math.e+1), 0.26894, "mcq", 1e-4)            # two-level <E>/eps
chk('PF-TH-32', math.sqrt(4), 2.0, "mcq", 1e-12)               # v_p ~ sqrt T
chk('PF-EL-36', -10*0.5, -5.0, "mcq", 1e-12)                   # inverting amp
chk('PF-EL-38', (5-0.7)/1, 4.3, "mcq", 1e-12)                  # diode mA
chk('PF-EL-39', 100*20e-3, 2.0, "mcq", 1e-12)                  # beta*I_B mA
chk('PF-EL-42', (12-5.6)/320*1000-10, 10.0, "mcq", 1e-9)       # Zener mA
chk('PF-AN-46', ((25-1)/(13-1))**2, 4.0, "mcq", 1e-12)         # Moseley
chk('PF-AN-50', (238.0508-234.0436-4.0026)*931.5, 4.2849, "mcq", 1e-3)  # Q alpha
chk('PF-SS-53', math.sqrt(3)*math.pi/8, 0.68017, "mcq", 1e-4)  # BCC packing
chk('PF-SS-54', 1.54/(2*math.sin(math.radians(15))), 2.9745, "mcq", 1e-3)  # Bragg
chk('PF-SS-59', (3*math.pi**2*8.5e28)**(1/3), 1.3602e10, "mcq", 1e6)  # k_F

# ---------- dump bank keys ----------
out = subprocess.run(['node', '-e',
    'global.window={};require("/home/user/project/paperforge-bank-legion2.js");'
    'const B=window.FORGE_BANKS["pf-legion-2"];'
    'process.stdout.write(JSON.stringify(B.questions.map(q=>({id:q.id,type:q.type,ans:q.ans,opts:q.opts||null}))))'],
    capture_output=True, text=True)
if out.returncode != 0:
    print("node bank dump failed:", out.stderr[:400]); sys.exit(1)
bmap = {q['id']: q for q in json.loads(out.stdout)}

def opt_number(txt):
    """Numeric face of an option string, matched LEFT to right:
    '1/2', '-5', '5.76\\,\\mathrm{J\\,K^{-1}}', '1.36\\times10^{10}\\,\\mathrm{m^{-1}}'."""
    s = txt.strip()
    if s.startswith('$'):
        s = s[1:]
    s = s.lstrip()
    m = re.match(r'(-?\d+(?:\.\d+)?)(?:\s*/\s*(\d+(?:\.\d+)?))?(?:\\times10\^\{(-?\d+)\})?', s)
    if not m:
        return None
    v = float(m.group(1))
    if m.group(2):
        v /= float(m.group(2))
    if m.group(3):
        v *= 10 ** int(m.group(3))
    return v

fails, checked = [], 0
for qid, recomputed, expect, kind, tol in checks:
    rec = bmap.get(qid)
    if rec is None:
        fails.append(qid + ": missing from bank"); continue
    if kind == "nat":
        s = str(rec['ans'])
        if ' to ' in s:
            lo, hi = map(float, s.split(' to '))
            ok = lo - 1e-12 <= recomputed <= hi + 1e-12
        else:
            ok = abs(float(s) - recomputed) <= (abs(recomputed) * 2e-3 + tol + 1e-12)
        if not ok:
            fails.append("%s: recompute %s outside bank window '%s'" % (qid, recomputed, s))
        checked += 1
    else:  # mcq grounding: keyed option face vs recomputed (display-rounded tol)
        face = opt_number(rec['opts'][rec['ans']])
        if face is None:
            fails.append(qid + ": keyed option not numeric-faced: " + rec['opts'][rec['ans']])
        elif not (abs(face - recomputed) <= max(0.005 * abs(recomputed), 0.005) + 1e-12):
            fails.append("%s: keyed face %s != recompute %s" % (qid, face, recomputed))
        checked += 1

print("audit-solve: %d recomputations checked, %d matching bank keys/windows"
      % (checked, checked - len(fails)))
if fails:
    print("AUDIT FAILURES:"); [print("  ✗", f) for f in fails]; sys.exit(1)
print("✔ AUDIT-SOLVE PASSED — every Legion II answer number independently re-derived & matching.")
