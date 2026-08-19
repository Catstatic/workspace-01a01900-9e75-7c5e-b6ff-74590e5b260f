import re
parts=[open(f'/home/user/_audit/t6-tooling/d{i}.js').read().rstrip().rstrip(',') for i in range(1,29)]
mocks=[
 ('drill-dice-coins-probability-01','Dice, Coins & Core Probability','dice-coins-probability'),
 ('drill-ratio-percentage-01','Ratios, Percentages & Mixtures','ratio-percentage'),
 ('drill-harmonic-oscillator-01','Harmonic Oscillator: Spectrum to Quenches','harmonic-oscillator'),
 ('drill-wells-bound-states-01','Wells & Bound States: Boxes, Deltas, Tunnels','wells-bound-states'),
 ('drill-clocks-calendars-01','Clocks & Calendars','clocks-calendars'),
 ('drill-series-completion-01','Series Completion: Number, Letter, Mixed','series-completion'),
 ('drill-partition-function-two-level-01','Partition Function of Two-Level Systems','partition-function-two-level'),
 ('drill-scattering-cross-section-01','Scattering & Cross-Sections','scattering-cross-section'),
 ('drill-opamp-golden-rules-01','Op-Amp Golden Rules in Action','opamp-golden-rules'),
 ('drill-flipflop-counters-01','Flip-Flops, Counters & Modulus Design','flipflop-counters'),
 ('drill-contour-residues-01','Contour Integration & Residues','contour-residues'),
 ('drill-debye-t3-01','Debye T-Cubed Physics','debye-t3'),
 ('drill-perturbation-theory-01','Perturbation Theory: Shifts & Mixing','perturbation-theory'),
 ('drill-band-effective-mass-01','Bands, Effective Mass & Holes','band-effective-mass'),
 ('drill-bragg-laue-diffraction-01','Bragg & Laue Diffraction','bragg-laue-diffraction'),
 ('drill-normal-modes-01','Normal Modes of Coupled Oscillators','normal-modes'),
 ('drill-commutator-identities-01','Commutator Algebra & Identities','commutator-identities'),
 ('drill-zeeman-patterns-01','Zeeman Patterns & Splitting','zeeman-patterns'),
 ('drill-radioactive-decay-01','Radioactive Decay & Activity','radioactive-decay'),
 ('drill-hall-effect-01','Hall Effect Transport','hall-effect'),
 ('drill-pn-junction-diode-01','PN Junction & Diode Circuits','pn-junction-diode'),
 ('drill-group-vs-phase-velocity-01','Group vs Phase Velocity','group-vs-phase-velocity'),
 ('drill-hydrogen-spectra-01','Hydrogen Spectra & Series','hydrogen-spectra'),
 ('drill-data-graphs-01','Data & Graphs: Reading Numbers','data-graphs'),
 ('drill-carnot-cycles-01','Carnot Cycles & COP','carnot-cycles'),
 ('drill-digital-counters-01','Digital Counters & Modulus','digital-counters'),
 ('drill-semf-fission-01','SEMF, Binding & Fission Energy','semf-fission'),
 ('drill-entropy-calculations-01','Entropy Bookkeeping','entropy-calculations'),
]
H = open('/home/user/_audit/t6-tooling/drill_header_b.txt').read()
out=[H]
for (mid,t,slug),probs in zip(mocks,parts):
    out.append(f"""  {{
    id: '{mid}', lane: 'drills', stage: 'T6',
    title: '{t}',
    focus: ['{slug}'],
    minutes: 55,
    problems: [
{probs}
    ]
  }},
""")
out.append("""  ]
};
window.TOPICFORGE_BANKS = Object.assign(window.TOPICFORGE_BANKS || {}, { drills: DR });
if (typeof window.TOPICFORGE_PANEL_RENDER === 'function') { try { window.TOPICFORGE_PANEL_RENDER(); } catch (e) {} }
})();
""")
s=''.join(out)
# stamp enforcement: diff tag strictly by Q number (Q1-6 seed, Q7-18 standard, Q19-25 apex)
def retag(m):
    qn=int(m.group(2))
    d='seed' if qn<=6 else ('standard' if qn<=18 else 'apex')
    return m.group(1)+"'"+d+"'"
s=re.sub(r"(\{id:'drill-[a-z0-9-]+-Q(\d+)',[^\n]*?diff:)'[a-z]+'", retag, s)
# flipflop Q09 waveform fig (kept from T6a for content parity)
miss=[]
V='<svg viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">'
BG='<rect x="0" y="0" width="150" height="100" fill="#0b0e13"/>'
seq=['1000','1100','1110','1111','0111','0011']
fig=V+BG+'<text x="8" y="16" fill="#9db2c8" font-size="6">ones walk in, then walk out</text>'
fig+=''.join(f'<text x="{12+i*23}" y="60" fill="#6ea8fe" font-size="7">{t}</text>' for i,t in enumerate(seq))
fig+='<line x1="12" y1="52" x2="140" y2="52" stroke="#405060" stroke-width="1"/><text x="12" y="78" fill="#d9a441" font-size="6">2n states, unit distance</text></svg>'
pat=re.compile(r"(\n\{id:'drill-flipflop-counters-01-Q09',[^\n]*\n)")
g=pat.findall(s)
if len(g)==1 and "drill-flipflop-counters-01-Q09',sub" in s and re.search(r"\{id:'drill-flipflop-counters-01-Q09'[^\n]*\n(?!fig)", s):
    s=pat.sub(lambda m: m.group(1)+"fig:'"+fig+"',\n", s, count=1)
else:
    miss.append('figQ09')
# sanity: no runs of 3+ backslashes except exactly-4 pmatrix row-breaks
bad=[m.start() for m in re.finditer(r'(?<!\\)\\{3}(?!\\)', s)]
if bad: miss.append('3-run@%d'%len(bad))
open('/home/user/project/topicforge-bank-drills.js','w').write(s)
print('REPLAY B DONE | bytes:', len(s), '| misses:', miss if miss else 'NONE')
