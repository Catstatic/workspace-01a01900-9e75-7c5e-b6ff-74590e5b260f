#!/usr/bin/env python3
"""PAPERFORGE S5 audit-solve — independent re-derivation of every number that
appears in LEGION CS-I keys. MCQ rows assert the recomputed value equals the
numeric face of the KEYED option (robust to letter rotation, 1% default band
for display rounding; tighter/looser via per-row tol). Scheme rows re-assert
the official SIM_LIMITS arithmetic. Any mismatch halts the forge."""
import math, json, re, subprocess, sys

checks = []

def chk(qid, recomputed, expected_note, tol=0.0):
    checks.append((qid, recomputed, expected_note, tol))

# ---------- PART A (+2 / -0.5, attempt 15 of 20) ----------
chk('PF-CS-A01', 30+12, 42)                                    # series next
chk('PF-CS-A02', 55/10, 5.5)                                   # mean 1..10
chk('PF-CS-A03', 300/12*3.6, 90.0)                             # train km/h
chk('PF-CS-A04', 840/1.2, 700.0)                               # cost price
chk('PF-CS-A05', 3/8, 0.375)                                   # two heads of three
chk('PF-CS-A07', 24*2, 48)                                     # adjacent pair
chk('PF-CS-A09', abs(30*3-5.5*15), 7.5)                        # clock 3:15
chk('PF-CS-A10', 100*101/2, 5050)                              # Gauss sum
chk('PF-CS-A11', (6+4)/2, 5.0)                                 # still water
chk('PF-CS-A12', 500*1.2*0.8, 480.0)                           # successive %
qual = [18/62, 22/70, 20/58, 31/80]
chk('PF-CS-A15', [2017, 2019, 2021, 2023][qual.index(max(qual))], 2023)  # max pass %
chk('PF-CS-A16', (2*12-12)/(3-2), 12)                          # son age
chk('PF-CS-A17', 1/(1/12+1/6), 4.0)                            # joint work
a = 3
for k in range(1, 6): a = 2*a + k
chk('PF-CS-A18', a, 153)                                       # x2+k series
chk('PF-CS-A19', 20**2, 400)                                   # first 20 odds
chk('PF-CS-A20', 12*(4-2), 24)                                 # two-face cubes

# ---------- PART B (+3.5 / -0.875, attempt 20 of 25) ----------
chk('PF-CS-B04', math.hypot(3*5, -4*5), 25.0)                  # torque magnitude
chk('PF-CS-B09', 4*math.pi*1e-7*500*2*1000, 1.2566)            # solenoid mT
chk('PF-CS-B11', 1240/500, 2.48)                               # photon eV
chk('PF-CS-B15', 273.16, 273.16)                               # triple point
chk('PF-CS-B16', 100*(1-300/600), 50.0)                        # Carnot %
chk('PF-CS-B17', 334/273, 1.2234)                              # kJ/K melt
chk('PF-CS-B20', 2**4, 16)                                     # 4-bit states
chk('PF-CS-B22', (27/8)**(1/3), 1.5)                           # radius ratio
chk('PF-CS-B23', 4*2, 8)                                       # diamond atoms
chk('PF-CS-B24', 1.1, 1.1)                                     # Si gap eV

# ---------- PART C (+5 / -1.25, attempt 20 of 30) ----------
chk('PF-CS-C02', 2*0.5, 1.0)                                   # FT at k=0
chk('PF-CS-C05', 2*math.log(3), 2.1972)                        # rocket km/s
chk('PF-CS-C07', 400*1/10, 40.0)                               # range m
chk('PF-CS-C10', 2*100/(2+3), 40.0)                            # charge sharing V
chk('PF-CS-C17', 100*(1-8**(-0.4)), 56.471)                    # Otto %
chk('PF-CS-C18', 4/3*7.566e-16*1e9*1e-3, 1.0088e-9)            # photon S
chk('PF-CS-C19', 2.5*8.314*300/1000, 6.2355)                   # kJ diatomic
chk('PF-CS-C20', 2*8.314*math.log(2), 11.5263)                 # mixing J/K
chk('PF-CS-C21', 6*1/2, 3.0)                                   # Wheatstone kOhm
chk('PF-CS-C22', 1e6/100/1000, 10.0)                           # GBP kHz
chk('PF-CS-C23', 0.7*20**2/40**(1/3), 81.872)                  # SEMF MeV
_N = 1e-3/24*6.022e23; _lam = math.log(2)/(15*3600)
chk('PF-CS-C24', _N*_lam, 3.22e14)                             # activity Bq
chk('PF-CS-C25', 5/8.617e-5, 58048.0)                          # Fermi temp K
chk('PF-CS-C26', 12, 12)                                       # FCC coordination
chk('PF-CS-C27', (1.055e-34)**2/(2*1.0e-38), 5.565e-31)        # effective mass
chk('PF-CS-C28', 2*1.0/(2*math.sin(math.radians(30))), 2.0)    # Bragg 2nd order
chk('PF-CS-C30', math.sqrt(3*8.314*300/0.032), 483.55)         # rms O2 m/s

# ---------- scheme arithmetic re-asserted against SIM_LIMITS ----------
SCHEME = {  # mirrored from the tracker's SIM_LIMITS block (never edited there)
  'A': dict(max=15, total=20, correct=2,   wrong=0.5),
  'B': dict(max=20, total=25, correct=3.5, wrong=0.875),
  'C': dict(max=20, total=30, correct=5,   wrong=1.25)}

def opt_number(txt):
    s = txt.strip()
    # tolerate leading label text like 'Rs. $700$' — math face lives in $..$
    if '$' in s and not s.startswith('$'):
        s = s[s.index('$'):]
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

out = subprocess.run(['node', '-e',
    'global.window={};require("/home/user/project/paperforge-bank-cs1.js");'
    'const B=window.FORGE_BANKS["pf-cs-1"];'
    'process.stdout.write(JSON.stringify({limits:B.limits,maxScore:B.maxScore,'
    'q:B.questions.map(q=>({id:q.id,part:q.part,marks:q.marks,cw:q.correctMarks,ww:q.wrongMarks,ans:q.ans,opts:q.opts}))}))'],
    capture_output=True, text=True)
if out.returncode != 0:
    print("node bank dump failed:", out.stderr[:400]); sys.exit(1)
bank = json.loads(out.stdout)
bmap = {q['id']: q for q in bank['q']}

fails, checked = [], 0
for qid, recomputed, note, tol in checks:
    rec = bmap.get(qid)
    if rec is None:
        fails.append(qid + ": missing from bank"); continue
    face = opt_number(rec['opts'][rec['ans']])
    if face is None:
        fails.append(qid + ": keyed option not numeric-faced: " + rec['opts'][rec['ans']])
    else:
        band = max(tol, 0.01 * abs(recomputed), 0.005)
        if abs(face - recomputed) > band:
            fails.append("%s: keyed face %s != recompute %s (%s)" % (qid, face, recomputed, note))
    checked += 1

# scheme check: every question carries official part marks; capped max = 200
for q in bank['q']:
    lim = SCHEME[q['part']]
    if q['marks'] != lim['correct'] or q['cw'] != lim['correct'] or q['ww'] != lim['wrong']:
        fails.append("%s: scheme drift marks=%s cw=%s ww=%s vs official %s/%s"
                     % (q['id'], q['marks'], q['cw'], q['ww'], lim['correct'], lim['wrong']))
if bank['limits'] != SCHEME:
    fails.append("embedded limits drift from SIM_LIMITS: " + json.dumps(bank['limits']))
capped = sum(SCHEME[p]['max'] * SCHEME[p]['correct'] for p in 'ABC')
if bank['maxScore'] != capped or capped != 200:
    fails.append("capped maxScore %s != 200" % bank['maxScore'])
checked += len(bank['q']) + 2

print("audit-solve: %d recomputations + %d scheme assertions checked, %d matching"
      % (len(checks), checked - len(checks), checked - len(fails)))
if fails:
    print("AUDIT FAILURES:"); [print("  ✗", f) for f in fails]; sys.exit(1)
print("✔ AUDIT-SOLVE PASSED — every CS-I answer number independently re-derived; scheme mirrors SIM_LIMITS exactly.")
