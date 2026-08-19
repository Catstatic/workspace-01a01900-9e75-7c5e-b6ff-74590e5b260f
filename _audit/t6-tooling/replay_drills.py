import re
parts=[open(f'/tmp/parts-dr/d{i}.js').read().rstrip().rstrip(',') for i in range(1,11)]
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
]
H = open('/tmp/drill_header.txt').read()
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
def retag(m):
    qn=int(m.group(2))
    d='seed' if qn<=6 else ('standard' if qn<=18 else 'apex')
    return m.group(1)+"'"+d+"'"
s=re.sub(r"(\{id:'drill-[a-z0-9-]+-Q(\d+)',[^\n]*?diff:)'[a-z]+'", retag, s)
s=s.replace("concept:'geometric-wait'","concept:'first-success-time'")
s=s.replace("'even, odd, even, ... — cosine ground, sine first excited'","'alternating even/odd — cosine ground, then sine'")
s=s.replace("q:'Sixty percent of $250$ equals'","q:'Computing exact percents fluently: sixty percent of $250$ equals'")
s=s.replace("q:'One barn equals'","q:'In the cross-section unit taught to every nuclear physicist, one barn equals'")
s=s.replace("q:'An ideal op-amp has'","q:'In the ideal op-amp model, the device is defined as having'")
s=re.sub(r"\\{3,}",r"\\\\",s)
reps=[
("q:'A particle with $E < V_0$","q:'A particle with $E \\\\lt V_0$"),
("perfect transmission even for $E < V_0$ wells","perfect transmission even for $E \\\\lt V_0$ wells"),
("$Z$ diverges for $\\\\beta < 0$","$Z$ diverges for $\\\\beta \\\\lt 0$"),
("$\\\\beta < 0$ would make","$\\\\beta \\\\lt 0$ would make"),
("with $p_1 > p_0$ forces","with $p_1 \\\\gt p_0$ forces"),
("formal $T < 0$","formal $T \\\\lt 0$"),
("$e^{-\\\\varepsilon/kT} > 1$ requires $T < 0$","$e^{-\\\\varepsilon/kT} \\\\gt 1$ requires $T \\\\lt 0$"),
("$p_1 > 1/2$ — formal","$p_1 \\\\gt 1/2$ — formal"),
("$p_1 > 1/2$ marks population","$p_1 \\\\gt 1/2$ marks population"),
("'$p_1 > 1/4$'","'$p_1 \\\\gt 1/4$'"),
("'$p_1 > 0$ any nonzero excitation'","'$p_1 \\\\gt 0$ any nonzero excitation'"),
("Every trajectory with $b < R$","Every trajectory with $b \\\\lt R$"),
("($\\\\theta_{lab} < 90^{\\\\circ}$)","($\\\\theta_{lab} \\\\lt 90^{\\\\circ}$)"),
("$V_+ > V_-$ drives","$V_+ \\\\gt V_-$ drives"),
("racing needs $t_{pulse} > t_{pd}$","racing needs $t_{pulse} \\\\gt t_{pd}$"),
]
miss=[]
for a,b in reps:
    if s.count(a)!=1: miss.append(a[:50])
    else: s=s.replace(a,b)
V='<svg viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">'
BG='<rect x="0" y="0" width="150" height="100" fill="#0b0e13"/>'
seq=['1000','1100','1110','1111','0111','0011']
fig=V+BG+'<text x="8" y="16" fill="#9db2c8" font-size="6">ones walk in, then walk out</text>'
fig+=''.join(f'<text x="{12+i*23}" y="60" fill="#6ea8fe" font-size="7">{t}</text>' for i,t in enumerate(seq))
fig+='<line x1="12" y1="52" x2="140" y2="52" stroke="#405060" stroke-width="1"/><text x="12" y="78" fill="#d9a441" font-size="6">2n states, unit distance</text></svg>'
pat=re.compile(r"(\n\{id:'drill-flipflop-counters-01-Q09',[^\n]*\n)")
g=pat.findall(s)
if len(g)==1: s=pat.sub(lambda m: m.group(1)+"fig:'"+fig+"',\n", s, count=1)
else: miss.append('figQ09')
open('/home/user/project/topicforge-bank-drills.js','w').write(s)
print('REPLAY DONE | misses:', miss if miss else 'NONE')
