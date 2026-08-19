#!/usr/bin/env python3
"""PAPERFORGE S6 audit — ORACLE A/B/C prophecy papers.
Asserts: (1) PROVENANCE — every subject question is byte-faithful to exactly one
audited source question in LEGION I/II (stem, type, option-set, keyed option,
marks); (2) STRUCTURE — GATE pattern per paper (65 Q, GA 5×1M+5×2M + subject
25×1M/30×2M, maxScore 100, blueprint lane/type targets); (3) GA sets exclusive
per paper + 14 independent numeric recomputations of GA keys; (4) within-paper
uniqueness + overlap report. Any mismatch halts the forge."""
import json, re, subprocess, sys

BASE = '/home/user/_audit/paperforge/'
PROJ = '/home/user/project/'
fails = []
def note(x): fails.append(x)

def load_bank(file, key):
    out = subprocess.run(['node', '-e',
        'global.window={};require("%s");const B=window.FORGE_BANKS["%s"];process.stdout.write(JSON.stringify(B))'
        % (PROJ + file, key)], capture_output=True, text=True)
    if out.returncode != 0:
        print('bank dump failed', file, out.stderr[:300]); sys.exit(1)
    return json.loads(out.stdout)

# ---- provenance: build source fingerprint map ----
src = {}
for f, k in [('paperforge-bank-legion1.js', 'pf-legion-1'), ('paperforge-bank-legion2.js', 'pf-legion-2')]:
    for q in load_bank(f, k)['questions']:
        fp = json.dumps([q['stem'], q['type'], sorted(q.get('opts') or ['~']), q['marks']], sort_keys=True)
        keyface = (q['opts'][q['ans']] if q['type'] == 'MCQ'
                   else json.dumps(sorted(q['ans'])) if q['type'] == 'MSQ' else str(q['ans']))
        src[fp] = (q['id'], keyface, k)

# ---- blueprint mirror (must match forge_oracle.js apportionment) ----
bp = json.load(open(PROJ + 'paperforge-blueprint.json'))['combined']
SUBJ = ['mathphys', 'classical', 'emtheory', 'quantum', 'thermo', 'electronics', 'atnuc', 'solidstate']
merged = dict(bp['laneTotals']); merged['atnuc'] = bp['laneTotals']['atomic'] + bp['laneTotals']['nuclear']
def apportion(weights, total):
    s = sum(weights); exact = [w * total / s for w in weights]
    out = [int(x) for x in exact]; left = total - sum(out)
    order = sorted(range(len(weights)), key=lambda i: (-(exact[i] - out[i]), i))
    for i in order:
        if left <= 0: break
        out[i] += 1; left -= 1
    return out
lane_t = dict(zip(SUBJ, apportion([merged[l] for l in SUBJ], 55)))
tp = bp['types']
type_t = dict(zip(['MCQ', 'MSQ', 'NAT'], apportion([tp['PH:MCQ'], tp['PH:MSQ'], tp['PH:NAT']], 55)))
LANE_CODE = {'mathphys': 'MP', 'classical': 'CM', 'emtheory': 'EM', 'quantum': 'QM',
             'thermo': 'TH', 'electronics': 'EL', 'atnuc': 'AN', 'solidstate': 'SS'}

banks = {k: load_bank('paperforge-bank-oracle-%s.js' % k, 'pf-oracle-' + k) for k in 'abc'}
ga_srcids = {}
for k, B in banks.items():
    Q = B['questions']
    if len(Q) != 65: note(k + ': count %d != 65' % len(Q))
    ids = [q['id'] for q in Q]
    if len(set(ids)) != len(ids): note(k + ': duplicate oracle ids')
    for i, q in enumerate(Q):
        if q['n'] != i + 1: note(k + ' ' + q['id'] + ': n drift')
        if not re.fullmatch(r'PF-OR-[ABC]-\d\d', q['id']): note(k + ': bad id ' + q['id'])
        if q.get('part') != ('GA' if q['n'] <= 10 else 'PH'): note(k + ' ' + q['id'] + ': bad part')
    ga = [q for q in Q if q['part'] == 'GA']; ph = [q for q in Q if q['part'] == 'PH']
    # GA structure
    if len(ga) != 10: note(k + ': GA count ' + str(len(ga)))
    if [q['marks'] for q in ga].count(1) != 5 or [q['marks'] for q in ga].count(2) != 5:
        note(k + ': GA marks split wrong')
    if any(q['type'] != 'MCQ' for q in ga): note(k + ': GA non-MCQ present')
    ga_srcids[k] = set(q['srcId'] for q in ga)
    # subject structure
    if len(ph) != 55: note(k + ': subject count ' + str(len(ph)))
    m1 = sum(1 for q in ph if q['marks'] == 1); m2 = sum(1 for q in ph if q['marks'] == 2)
    if m1 != 25 or m2 != 30: note(k + ': subject marks split %d/%d != 25/30' % (m1, m2))
    if B['maxScore'] != 100: note(k + ': maxScore %s != 100' % B['maxScore'])
    if B['durationSec'] != 10800: note(k + ': duration != 3h')
    # marks/negativity rule
    for q in Q:
        want_w = (0.333 if q['marks'] == 1 else 0.667) if q['type'] == 'MCQ' else 0
        if q['correctMarks'] != q['marks'] or abs(q['wrongMarks'] - want_w) > 1e-9:
            note(k + ' ' + q['id'] + ': marking rule drift')
    # lane counts exact
    lc = {}
    for q in ph: lc[q['code'] if 'code' in q else LANE_CODE[q['lane']]] = lc.get(q['code'] if 'code' in q else LANE_CODE[q['lane']], 0) + 1
    for l in SUBJ:
        got = lc.get(LANE_CODE[l], 0)
        if got != lane_t[l]: note(k + ': lane %s %d != blueprint %d' % (l, got, lane_t[l]))
    # type mix within tolerance
    tc = {'MCQ': 0, 'MSQ': 0, 'NAT': 0}
    for q in ph: tc[q['type']] += 1
    for t in tc:
        if abs(tc[t] - type_t[t]) > 2: note(k + ': type %s %d vs blueprint %d (±2)' % (t, tc[t], type_t[t]))
    # provenance: subject questions byte-faithful to source
    seen = set()
    for q in ph:
        fp = json.dumps([q['stem'], q['type'], sorted(q.get('opts') or ['~']), q['marks']], sort_keys=True)
        if fp not in src: note(k + ' ' + q['id'] + ': NOT FOUND verbatim in source pools'); continue
        sid, keyface, sb = src[fp]
        myface = (q['opts'][q['ans']] if q['type'] == 'MCQ'
                  else json.dumps(sorted(q['ans'])) if q['type'] == 'MSQ' else str(q['ans']))
        if myface != keyface: note(k + ' ' + q['id'] + ': KEY DRIFT vs ' + sid)
        if q.get('srcBank') != sb or q.get('srcId') != sid:
            note(k + ' ' + q['id'] + ': wrong source tag %s/%s vs %s/%s' % (q.get('srcBank'), q.get('srcId'), sb, sid))
        if q['srcId'] in seen: note(k + ': within-paper dup ' + q['srcId'])
        seen.add(q['srcId'])

# GA exclusivity across papers
if ga_srcids['a'] & ga_srcids['b'] or ga_srcids['b'] & ga_srcids['c'] or ga_srcids['a'] & ga_srcids['c']:
    note('GA sets not exclusive across papers')

# ---- GA numeric recomputations (T1) ----
def opt_number(txt):
    s = txt.strip()
    if '$' in s and not s.startswith('$'): s = s[s.index('$'):]
    if s.startswith('$'): s = s[1:]
    s = s.lstrip()
    m = re.match(r'(-?\d+(?:\.\d+)?)(?:\s*/\s*(\d+(?:\.\d+)?))?(?:\\times10\^\{(-?\d+)\})?', s)
    if not m: return None
    v = float(m.group(1))
    if m.group(2): v /= float(m.group(2))
    if m.group(3): v *= 10 ** int(m.group(3))
    return v

import math
GA_CHECKS = {
    'PF-GA-A6': 10000 * 1.1 ** 2, 'PF-GA-A7': 54 / 3.6 * 30 - 240, 'PF-GA-A8': 6 / 45,
    'PF-GA-A9': 5 * 20 - 4 * 18, 'PF-GA-A10': math.hypot(12, 9),
    'PF-GA-B6': 100 / 8, 'PF-GA-B7': 6 * 10 / 4, 'PF-GA-B8': 40 * 5 / 8 - 40 * 3 / 8,
    'PF-GA-B9': 6 / 36,
    'PF-GA-C6': 2 * 60 * 40 / 100, 'PF-GA-C7': 45 / 0.75, 'PF-GA-C8': 10 * 4,
    'PF-GA-C9': abs(30 * 6 - 5.5 * 30), 'PF-GA-C10': 10 * 11 * 21 / 6,
}
gmap = {}
for k, B in banks.items():
    for q in B['questions']:
        if q['part'] == 'GA': gmap[q['srcId']] = q
for gid, rec in GA_CHECKS.items():
    q = gmap.get(gid)
    if not q: note(gid + ': missing from papers'); continue
    face = opt_number(q['opts'][q['ans']])
    if face is None: note(gid + ': GA key not numeric-faced'); continue
    if abs(face - rec) > max(0.01 * abs(rec), 0.005) + 1e-12:
        note('%s: recompute %s != keyed face %s' % (gid, rec, face))

# overlap report (informational)
for i, x in enumerate('ab'):
    for y in 'bc'[i:]:
        A = set(q['srcId'] for q in banks[x]['questions'])
        Bs = set(q['srcId'] for q in banks[y]['questions'])
        print('overlap %s/%s: %d shared' % (x, y, len(A & Bs)))

print('oracle audit: %d checks failing' % len(fails))
if fails:
    print('AUDIT FAILURES:'); [print('  ✗', f) for f in fails]; sys.exit(1)
print('✔ ORACLE AUDIT PASSED — provenance byte-faithful to audited legions, blueprint targets met, GA freshly re-derived.')
