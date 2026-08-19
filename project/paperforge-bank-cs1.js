/* 🏭 PAPERFORGE S5 — LEGION CS-I bank (75 originals · AI-GENERATED · double-solved)
   Built by _audit/paperforge/replay_pfcs.js — do not hand-edit; edit pfcs_p1..pfcs_p7.js and replay. */
window.FORGE_BANKS = window.FORGE_BANKS || {};
window.FORGE_BANKS["pf-cs-1"] = {
 "id": "pf-cs-1",
 "label": "🏭 PAPERFORGE — LEGION CS-I · CSIR-NET pattern (A: Aptitude · B: Core · C: Advanced)",
 "series": "PAPERFORGE",
 "stage": "S5",
 "minted": "2026-08-18",
 "aiGenerated": true,
 "note": "AI-GENERATED original forge bank — zero PYQ photocopies. Official CSIR scheme mirrored from the tracker’s own SIM_LIMITS (A 15/20 +2/−0.5 · B 20/25 +3.5/−0.875 · C 20/30 +5/−1.25). Every question double-solved (journal: _audit/paperforge/forge_journal_cs1.md). Attempt caps enforced at answer time, CLEAR frees a slot.",
 "durationSec": 10800,
 "totalQ": 75,
 "maxScore": 200,
 "limits": {
  "A": {
   "max": 15,
   "total": 20,
   "correct": 2,
   "wrong": 0.5
  },
  "B": {
   "max": 20,
   "total": 25,
   "correct": 3.5,
   "wrong": 0.875
  },
  "C": {
   "max": 20,
   "total": 30,
   "correct": 5,
   "wrong": 1.25
  }
 },
 "partCounts": {
  "A": 20,
  "B": 25,
  "C": 30
 },
 "typeTally": {
  "MCQ": 75,
  "MSQ": 0,
  "NAT": 0
 },
 "questions": [
  {
   "id": "PF-CS-A01",
   "n": 1,
   "part": "A",
   "lane": "aptitude",
   "sub": "number-series",
   "type": "MCQ",
   "marks": 2,
   "diff": "seed",
   "stem": "Find the next term of the series: $2,\\,6,\\,12,\\,20,\\,30,\\,?$",
   "opts": [
    "$42$",
    "$44$",
    "$36$",
    "$40$"
   ],
   "ans": 0,
   "sol": "Differences are $4,6,8,10$ — increasing by $2$. Next difference $12$, giving $30+12=42$ (equivalently the terms are $n^2+n$).",
   "tags": [
    "series"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.5
  },
  {
   "id": "PF-CS-A02",
   "n": 2,
   "part": "A",
   "lane": "aptitude",
   "sub": "averages",
   "type": "MCQ",
   "marks": 2,
   "diff": "seed",
   "stem": "The average of the first ten natural numbers is",
   "opts": [
    "$5.0$",
    "$5.5$",
    "$6.0$",
    "$4.5$"
   ],
   "ans": 1,
   "sol": "Sum $=10\\times11/2=55$, average $=55/10=5.5$. For $1$ to $n$ the mean is $(n+1)/2$.",
   "tags": [
    "average"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.5
  },
  {
   "id": "PF-CS-A03",
   "n": 3,
   "part": "A",
   "lane": "aptitude",
   "sub": "speed-distance",
   "type": "MCQ",
   "marks": 2,
   "diff": "seed",
   "stem": "A $300\\,\\mathrm{m}$ long train crosses a pole in $12\\,\\mathrm{s}$. The speed of the train is",
   "opts": [
    "$60\\,\\mathrm{km/h}$",
    "$75\\,\\mathrm{km/h}$",
    "$90\\,\\mathrm{km/h}$",
    "$120\\,\\mathrm{km/h}$"
   ],
   "ans": 2,
   "sol": "Speed $=300/12=25\\,\\mathrm{m/s}=25\\times3.6=90\\,\\mathrm{km/h}$.",
   "tags": [
    "speed"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.5
  },
  {
   "id": "PF-CS-A04",
   "n": 4,
   "part": "A",
   "lane": "aptitude",
   "sub": "profit-loss",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "An article is sold for Rs. $840$ at a profit of $20\\%$ on the cost price. The cost price is",
   "opts": [
    "Rs. $700$",
    "Rs. $672$",
    "Rs. $714$",
    "Rs. $750$"
   ],
   "ans": 0,
   "sol": "$CP=SP/1.2=840/1.2=700$. (Rs. $672$ would follow from wrongly taking $80\\%$ of $840$.)",
   "tags": [
    "percentage"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.5
  },
  {
   "id": "PF-CS-A05",
   "n": 5,
   "part": "A",
   "lane": "aptitude",
   "sub": "probability",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "Three fair coins are tossed. The probability of getting exactly two heads is",
   "opts": [
    "$1/4$",
    "$3/8$",
    "$1/2$",
    "$5/8$"
   ],
   "ans": 1,
   "sol": "Favourable outcomes $\\{HHT,HTH,THH\\}$: $3$ of $2^3=8$, so $P=3/8=0.375$.",
   "tags": [
    "binomial"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.5
  },
  {
   "id": "PF-CS-A06",
   "n": 6,
   "part": "A",
   "lane": "aptitude",
   "sub": "coding",
   "type": "MCQ",
   "marks": 2,
   "diff": "seed",
   "stem": "In a code, each letter is shifted one step forward in the alphabet, so CODE becomes DPEF. By the same rule, GATE becomes",
   "opts": [
    "GBUF",
    "HBVE",
    "HBUF",
    "HZUF"
   ],
   "ans": 2,
   "sol": "$G\\to H$, $A\\to B$, $T\\to U$, $E\\to F$, giving HBUF.",
   "tags": [
    "letter-shift"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.5
  },
  {
   "id": "PF-CS-A07",
   "n": 7,
   "part": "A",
   "lane": "aptitude",
   "sub": "permutations",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "The number of ways to arrange $5$ distinct books on a shelf so that $2$ particular books are always adjacent is",
   "opts": [
    "$72$",
    "$120$",
    "$24$",
    "$48$"
   ],
   "ans": 3,
   "sol": "Glue the pair into one block: $4!$ arrangements of the block plus three books, times $2!$ inside the block: $24\\times2=48$.",
   "tags": [
    "arrangement"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.5
  },
  {
   "id": "PF-CS-A08",
   "n": 8,
   "part": "A",
   "lane": "aptitude",
   "sub": "geometry",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "Two similar triangles have corresponding sides in the ratio $3:2$. The ratio of their areas is",
   "opts": [
    "$9:4$",
    "$27:8$",
    "$6:4$",
    "$3:2$"
   ],
   "ans": 0,
   "sol": "Areas scale as the square of the length ratio: $3^2:2^2=9:4$.",
   "tags": [
    "similarity"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.5
  },
  {
   "id": "PF-CS-A09",
   "n": 9,
   "part": "A",
   "lane": "aptitude",
   "sub": "clocks",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "The angle between the hour and minute hands of a clock at $3{:}15$ is",
   "opts": [
    "$0^\\circ$",
    "$7.5^\\circ$",
    "$15^\\circ$",
    "$30^\\circ$"
   ],
   "ans": 1,
   "sol": "$|30H-5.5M|=|90-82.5|=7.5^\\circ$: the hour hand has moved a quarter of the way from $3$ toward $4$.",
   "tags": [
    "clock-angle"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.5
  },
  {
   "id": "PF-CS-A10",
   "n": 10,
   "part": "A",
   "lane": "aptitude",
   "sub": "series",
   "type": "MCQ",
   "marks": 2,
   "diff": "seed",
   "stem": "The sum $1+2+3+\\cdots+100$ equals",
   "opts": [
    "$4950$",
    "$5000$",
    "$5050$",
    "$5150$"
   ],
   "ans": 2,
   "sol": "$n(n+1)/2$ with $n=100$: $100\\times101/2=5050$ (the Gauss pairing trick).",
   "tags": [
    "arithmetic-series"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.5
  },
  {
   "id": "PF-CS-A11",
   "n": 11,
   "part": "A",
   "lane": "aptitude",
   "sub": "boats-streams",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "A boatman rows at $6\\,\\mathrm{km/h}$ downstream and $4\\,\\mathrm{km/h}$ upstream on the same river. His rowing speed in still water is",
   "opts": [
    "$5.5\\,\\mathrm{km/h}$",
    "$10\\,\\mathrm{km/h}$",
    "$4.5\\,\\mathrm{km/h}$",
    "$5\\,\\mathrm{km/h}$"
   ],
   "ans": 3,
   "sol": "Still-water speed $=(u+d)/2=(6+4)/2=5\\,\\mathrm{km/h}$ (the current is the other half of the difference, $1\\,\\mathrm{km/h}$).",
   "tags": [
    "relative-speed"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.5
  },
  {
   "id": "PF-CS-A12",
   "n": 12,
   "part": "A",
   "lane": "aptitude",
   "sub": "percentage",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "A number is increased by $20\\%$ and the result is then decreased by $20\\%$. If the original number was $500$, the final number is",
   "opts": [
    "$480$",
    "$520$",
    "$460$",
    "$500$"
   ],
   "ans": 0,
   "sol": "Net factor $1.2\\times0.8=0.96$, a net $4\\%$ loss: $500\\times0.96=480$. The operations do not cancel because the bases differ.",
   "tags": [
    "successive-change"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.5
  },
  {
   "id": "PF-CS-A13",
   "n": 13,
   "part": "A",
   "lane": "aptitude",
   "sub": "probability",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "Two fair dice are thrown. The probability that the sum of the faces is $7$ is",
   "opts": [
    "$5/36$",
    "$1/6$",
    "$7/36$",
    "$1/9$"
   ],
   "ans": 1,
   "sol": "Six ordered pairs give sum $7$: $(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)$, so $P=6/36=1/6$.",
   "tags": [
    "dice"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.5
  },
  {
   "id": "PF-CS-A14",
   "n": 14,
   "part": "A",
   "lane": "aptitude",
   "sub": "syllogism",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "Statements: (i) All physicists are researchers. (ii) Some researchers are poets. Which conclusion necessarily follows?",
   "opts": [
    "All poets are researchers",
    "No physicist is a poet",
    "Some researchers are physicists",
    "Some poets are physicists"
   ],
   "ans": 2,
   "sol": "“All physicists are researchers” inverts to “some researchers are physicists”, which must hold in every model. The poet clauses never connect poets to physicists, so the other options can all be false.",
   "tags": [
    "logic"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.5
  },
  {
   "id": "PF-CS-A15",
   "n": 15,
   "part": "A",
   "lane": "aptitude",
   "sub": "data-interpretation",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "fig": "ga-bar-chart",
   "stem": "The chart shows, year-wise, candidates appeared and qualified (in thousands). The qualifying percentage (qualified $\\div$ appeared) was highest in the year",
   "opts": [
    "$2017$",
    "$2019$",
    "$2021$",
    "$2023$"
   ],
   "ans": 3,
   "sol": "Ratios: $18/62=29.0\\%$, $22/70=31.4\\%$, $20/58=34.5\\%$, $31/80=38.8\\%$. The maximum is $2023$ despite $2021$ having fewer total candidates.",
   "tags": [
    "bar-chart",
    "ratio"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.5,
   "figSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1200 700\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\"><defs><marker id=\"m405060\" viewBox=\"0 0 10 10\" refX=\"8\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 z\" fill=\"#405060\"/></marker></defs><rect x=\"0\" y=\"0\" width=\"1200\" height=\"700\" fill=\"#0b0e13\"/><line x1=\"250\" y1=\"580\" x2=\"1090\" y2=\"580\" stroke=\"#405060\" stroke-width=\"3\" stroke-linecap=\"round\" marker-end=\"url(#m405060)\"/><line x1=\"250\" y1=\"580\" x2=\"250\" y2=\"100\" stroke=\"#405060\" stroke-width=\"3\" stroke-linecap=\"round\" marker-end=\"url(#m405060)\"/><text x=\"230\" y=\"88\" font-size=\"22\" fill=\"#9db2c8\" text-anchor=\"end\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">×10³</text><line x1=\"250\" y1=\"530\" x2=\"1070\" y2=\"530\" stroke=\"#405060\" stroke-width=\"1\" stroke-dasharray=\"3 9\" stroke-linecap=\"round\"/><text x=\"234\" y=\"537\" font-size=\"18\" fill=\"#6b7c8f\" text-anchor=\"end\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">10</text><line x1=\"250\" y1=\"480\" x2=\"1070\" y2=\"480\" stroke=\"#405060\" stroke-width=\"1\" stroke-dasharray=\"3 9\" stroke-linecap=\"round\"/><text x=\"234\" y=\"487\" font-size=\"18\" fill=\"#6b7c8f\" text-anchor=\"end\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">20</text><line x1=\"250\" y1=\"430\" x2=\"1070\" y2=\"430\" stroke=\"#405060\" stroke-width=\"1\" stroke-dasharray=\"3 9\" stroke-linecap=\"round\"/><text x=\"234\" y=\"437\" font-size=\"18\" fill=\"#6b7c8f\" text-anchor=\"end\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">30</text><line x1=\"250\" y1=\"380\" x2=\"1070\" y2=\"380\" stroke=\"#405060\" stroke-width=\"1\" stroke-dasharray=\"3 9\" stroke-linecap=\"round\"/><text x=\"234\" y=\"387\" font-size=\"18\" fill=\"#6b7c8f\" text-anchor=\"end\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">40</text><line x1=\"250\" y1=\"330\" x2=\"1070\" y2=\"330\" stroke=\"#405060\" stroke-width=\"1\" stroke-dasharray=\"3 9\" stroke-linecap=\"round\"/><text x=\"234\" y=\"337\" font-size=\"18\" fill=\"#6b7c8f\" text-anchor=\"end\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">50</text><line x1=\"250\" y1=\"280\" x2=\"1070\" y2=\"280\" stroke=\"#405060\" stroke-width=\"1\" stroke-dasharray=\"3 9\" stroke-linecap=\"round\"/><text x=\"234\" y=\"287\" font-size=\"18\" fill=\"#6b7c8f\" text-anchor=\"end\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">60</text><line x1=\"250\" y1=\"230\" x2=\"1070\" y2=\"230\" stroke=\"#405060\" stroke-width=\"1\" stroke-dasharray=\"3 9\" stroke-linecap=\"round\"/><text x=\"234\" y=\"237\" font-size=\"18\" fill=\"#6b7c8f\" text-anchor=\"end\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">70</text><line x1=\"250\" y1=\"180\" x2=\"1070\" y2=\"180\" stroke=\"#405060\" stroke-width=\"1\" stroke-dasharray=\"3 9\" stroke-linecap=\"round\"/><text x=\"234\" y=\"187\" font-size=\"18\" fill=\"#6b7c8f\" text-anchor=\"end\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">80</text><line x1=\"250\" y1=\"130\" x2=\"1070\" y2=\"130\" stroke=\"#405060\" stroke-width=\"1\" stroke-dasharray=\"3 9\" stroke-linecap=\"round\"/><text x=\"234\" y=\"137\" font-size=\"18\" fill=\"#6b7c8f\" text-anchor=\"end\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">90</text><rect x=\"290\" y=\"270\" width=\"64\" height=\"310\" rx=\"0\" fill=\"#6ea8fe\" stroke=\"#9db2c8\" stroke-width=\"0\"/><text x=\"322\" y=\"258\" font-size=\"20\" fill=\"#9db2c8\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">62</text><rect x=\"366\" y=\"490\" width=\"64\" height=\"90\" rx=\"0\" fill=\"#d9a441\" stroke=\"#9db2c8\" stroke-width=\"0\"/><text x=\"398\" y=\"478\" font-size=\"20\" fill=\"#9db2c8\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">18</text><text x=\"360\" y=\"616\" font-size=\"24\" fill=\"#9db2c8\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">2017</text><rect x=\"490\" y=\"230\" width=\"64\" height=\"350\" rx=\"0\" fill=\"#6ea8fe\" stroke=\"#9db2c8\" stroke-width=\"0\"/><text x=\"522\" y=\"218\" font-size=\"20\" fill=\"#9db2c8\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">70</text><rect x=\"566\" y=\"470\" width=\"64\" height=\"110\" rx=\"0\" fill=\"#d9a441\" stroke=\"#9db2c8\" stroke-width=\"0\"/><text x=\"598\" y=\"458\" font-size=\"20\" fill=\"#9db2c8\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">22</text><text x=\"560\" y=\"616\" font-size=\"24\" fill=\"#9db2c8\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">2019</text><rect x=\"690\" y=\"290\" width=\"64\" height=\"290\" rx=\"0\" fill=\"#6ea8fe\" stroke=\"#9db2c8\" stroke-width=\"0\"/><text x=\"722\" y=\"278\" font-size=\"20\" fill=\"#9db2c8\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">58</text><rect x=\"766\" y=\"480\" width=\"64\" height=\"100\" rx=\"0\" fill=\"#d9a441\" stroke=\"#9db2c8\" stroke-width=\"0\"/><text x=\"798\" y=\"468\" font-size=\"20\" fill=\"#9db2c8\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">20</text><text x=\"760\" y=\"616\" font-size=\"24\" fill=\"#9db2c8\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">2021</text><rect x=\"890\" y=\"180\" width=\"64\" height=\"400\" rx=\"0\" fill=\"#6ea8fe\" stroke=\"#9db2c8\" stroke-width=\"0\"/><text x=\"922\" y=\"168\" font-size=\"20\" fill=\"#9db2c8\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">80</text><rect x=\"966\" y=\"425\" width=\"64\" height=\"155\" rx=\"0\" fill=\"#d9a441\" stroke=\"#9db2c8\" stroke-width=\"0\"/><text x=\"998\" y=\"413\" font-size=\"20\" fill=\"#9db2c8\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">31</text><text x=\"960\" y=\"616\" font-size=\"24\" fill=\"#9db2c8\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">2023</text><rect x=\"292\" y=\"118\" width=\"26\" height=\"26\" rx=\"0\" fill=\"#6ea8fe\" stroke=\"#9db2c8\" stroke-width=\"0\"/><text x=\"330\" y=\"138\" font-size=\"22\" fill=\"#9db2c8\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">Appeared (×10³)</text><rect x=\"292\" y=\"158\" width=\"26\" height=\"26\" rx=\"0\" fill=\"#d9a441\" stroke=\"#9db2c8\" stroke-width=\"0\"/><text x=\"330\" y=\"178\" font-size=\"22\" fill=\"#9db2c8\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">Qualified (×10³)</text><text x=\"600\" y=\"650\" font-size=\"22\" fill=\"#6b7c8f\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">exam-year wise candidates</text></svg>"
  },
  {
   "id": "PF-CS-A16",
   "n": 16,
   "part": "A",
   "lane": "aptitude",
   "sub": "ages",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "A father is three times as old as his son. In $12$ years he will be twice as old as his son. The present age of the son is",
   "opts": [
    "$12$ years",
    "$16$ years",
    "$8$ years",
    "$10$ years"
   ],
   "ans": 0,
   "sol": "Let the son be $s$: $3s+12=2(s+12)$ gives $s=12$ (father $36$ now, $48$ then; son $24$ then).",
   "tags": [
    "linear-equation"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.5
  },
  {
   "id": "PF-CS-A17",
   "n": 17,
   "part": "A",
   "lane": "aptitude",
   "sub": "work-time",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "$A$ can finish a job in $12$ days and $B$ in $6$ days. Working together, they finish it in",
   "opts": [
    "$3$ days",
    "$4$ days",
    "$6$ days",
    "$8$ days"
   ],
   "ans": 1,
   "sol": "Rates add: $1/12+1/6=1/12+2/12=3/12=1/4$ of the job per day, hence $4$ days.",
   "tags": [
    "combined-work"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.5
  },
  {
   "id": "PF-CS-A18",
   "n": 18,
   "part": "A",
   "lane": "aptitude",
   "sub": "number-series",
   "type": "MCQ",
   "marks": 2,
   "diff": "apex",
   "stem": "Find the next term of the series: $3,\\,7,\\,16,\\,35,\\,74,\\,?$",
   "opts": [
    "$163$",
    "$148$",
    "$153$",
    "$158$"
   ],
   "ans": 2,
   "sol": "Each step doubles and adds a growing increment: $\\times2+1,\\times2+2,\\times2+3,\\times2+4$, so next $\\times2+5$: $74\\times2+5=153$.",
   "tags": [
    "series"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.5
  },
  {
   "id": "PF-CS-A19",
   "n": 19,
   "part": "A",
   "lane": "aptitude",
   "sub": "series",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "The sum of the first $20$ odd natural numbers is",
   "opts": [
    "$420$",
    "$440$",
    "$380$",
    "$400$"
   ],
   "ans": 3,
   "sol": "First $n$ odd numbers sum to $n^2$: $20^2=400$. Direct check: $1+3+\\cdots+39=20\\times(1+39)/2=400$.",
   "tags": [
    "odd-numbers"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.5
  },
  {
   "id": "PF-CS-A20",
   "n": 20,
   "part": "A",
   "lane": "aptitude",
   "sub": "cubes",
   "type": "MCQ",
   "marks": 2,
   "diff": "apex",
   "stem": "A solid cube is painted on all faces and cut into $64$ equal smaller cubes. The number of smaller cubes with exactly two painted faces is",
   "opts": [
    "$24$",
    "$32$",
    "$8$",
    "$16$"
   ],
   "ans": 0,
   "sol": "$64=4^3$ gives $n=4$. Two-face cubes live on edges excluding corners: $12\\times(n-2)=12\\times2=24$. ($8$ corner cubes have three faces painted.)",
   "tags": [
    "spatial"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.5
  },
  {
   "id": "PF-CS-B01",
   "n": 21,
   "part": "B",
   "lane": "mathphys",
   "sub": "vector-calculus",
   "type": "MCQ",
   "marks": 3.5,
   "diff": "seed",
   "stem": "For any twice-differentiable scalar field $\\phi(\\mathbf{r})$, the field $\\nabla\\times(\\nabla\\phi)$ is",
   "opts": [
    "divergence-free only in two dimensions",
    "identically zero",
    "$\\nabla^2\\phi$",
    "equal to $-\\nabla\\phi$"
   ],
   "ans": 1,
   "sol": "Curl of a gradient vanishes identically: components are differences of mixed partials, which cancel by symmetry of second derivatives. It holds in any dimension.",
   "tags": [
    "curl-gradient"
   ],
   "correctMarks": 3.5,
   "wrongMarks": 0.875
  },
  {
   "id": "PF-CS-B02",
   "n": 22,
   "part": "B",
   "lane": "mathphys",
   "sub": "linear-algebra",
   "type": "MCQ",
   "marks": 3.5,
   "diff": "standard",
   "stem": "The eigenvalues of the rotation matrix $\\begin{pmatrix}\\cos\\theta&-\\sin\\theta\\\\ \\sin\\theta&\\phantom{-}\\cos\\theta\\end{pmatrix}$ are",
   "opts": [
    "$\\pm i\\sin\\theta$",
    "$\\pm1$",
    "$e^{\\pm i\\theta}$",
    "$\\pm\\cos\\theta$"
   ],
   "ans": 2,
   "sol": "$\\lambda^2-2\\lambda\\cos\\theta+1=0$ gives $\\lambda=\\cos\\theta\\pm i\\sin\\theta=e^{\\pm i\\theta}$, both of unit modulus as any rotation demands.",
   "tags": [
    "eigenvalues",
    "rotation"
   ],
   "correctMarks": 3.5,
   "wrongMarks": 0.875
  },
  {
   "id": "PF-CS-B03",
   "n": 23,
   "part": "B",
   "lane": "mathphys",
   "sub": "fourier-series",
   "type": "MCQ",
   "marks": 3.5,
   "diff": "apex",
   "stem": "The Fourier series of $f(x)=x^2$ on $(-\\pi,\\pi)$, evaluated at the endpoint $x=\\pi$, converges to",
   "opts": [
    "$2\\pi^2$",
    "$0$",
    "$\\pi^2/2$",
    "$\\pi^2$"
   ],
   "ans": 3,
   "sol": "Dirichlet: the series converges to $\\tfrac12[f(\\pi^-)+f(-\\pi^+)]=\\tfrac12(\\pi^2+\\pi^2)=\\pi^2$, since the periodic extension is continuous there.",
   "tags": [
    "dirichlet-theorem"
   ],
   "correctMarks": 3.5,
   "wrongMarks": 0.875
  },
  {
   "id": "PF-CS-B04",
   "n": 24,
   "part": "B",
   "lane": "classical",
   "sub": "torque",
   "type": "MCQ",
   "marks": 3.5,
   "diff": "standard",
   "stem": "A force $\\mathbf{F}=5\\hat{k}\\,\\mathrm{N}$ acts at the point $\\mathbf{r}=(4\\hat{i}+3\\hat{j})\\,\\mathrm{m}$. The magnitude of the torque about the origin is",
   "opts": [
    "$25\\,\\mathrm{N\\,m}$",
    "$35\\,\\mathrm{N\\,m}$",
    "$15\\,\\mathrm{N\\,m}$",
    "$20\\,\\mathrm{N\\,m}$"
   ],
   "ans": 0,
   "sol": "$\\boldsymbol\\tau=\\mathbf r\\times\\mathbf F=15\\hat i-20\\hat j\\,\\mathrm{N\\,m}$, so $|\\boldsymbol\\tau|=\\sqrt{15^2+20^2}=25\\,\\mathrm{N\\,m}$.",
   "tags": [
    "cross-product"
   ],
   "correctMarks": 3.5,
   "wrongMarks": 0.875
  },
  {
   "id": "PF-CS-B05",
   "n": 25,
   "part": "B",
   "lane": "classical",
   "sub": "gravitation",
   "type": "MCQ",
   "marks": 3.5,
   "diff": "standard",
   "stem": "For a body moving in a bound Kepler orbit (ellipse), its total mechanical energy is",
   "opts": [
    "zero",
    "negative",
    "sign-changing over one orbit",
    "positive"
   ],
   "ans": 1,
   "sol": "Bound orbits have $E<0$: the semi-major axis is $a=-GMm/(2E)$, which is positive only for negative $E$; $E=0$ is the parabolic escape threshold.",
   "tags": [
    "orbits",
    "energy"
   ],
   "correctMarks": 3.5,
   "wrongMarks": 0.875
  },
  {
   "id": "PF-CS-B06",
   "n": 26,
   "part": "B",
   "lane": "classical",
   "sub": "atwood",
   "type": "MCQ",
   "marks": 3.5,
   "diff": "standard",
   "stem": "An ideal Atwood machine carries masses $2m$ and $m$. The acceleration of the masses is",
   "opts": [
    "$2g/3$",
    "$g/6$",
    "$g/3$",
    "$g/2$"
   ],
   "ans": 2,
   "sol": "$a=(m_1-m_2)g/(m_1+m_2)=(2m-m)g/(3m)=g/3$. The string tension is $4mg/3$.",
   "tags": [
    "constraint-motion"
   ],
   "correctMarks": 3.5,
   "wrongMarks": 0.875
  },
  {
   "id": "PF-CS-B07",
   "n": 27,
   "part": "B",
   "lane": "emtheory",
   "sub": "electrostatics",
   "type": "MCQ",
   "marks": 3.5,
   "diff": "seed",
   "stem": "The electric field of an infinite line charge of uniform density $\\lambda$, at perpendicular distance $r$ from the line, falls off as",
   "opts": [
    "$r^0$ (independent of $r$)",
    "$e^{-r}$",
    "$1/r^2$",
    "$1/r$"
   ],
   "ans": 3,
   "sol": "Gauss law on a coaxial cylinder: $E\\cdot2\\pi rL=\\lambda L/\\varepsilon_0$, so $E=\\lambda/(2\\pi\\varepsilon_0 r)\\propto1/r$.",
   "tags": [
    "gauss-law"
   ],
   "correctMarks": 3.5,
   "wrongMarks": 0.875
  },
  {
   "id": "PF-CS-B08",
   "n": 28,
   "part": "B",
   "lane": "emtheory",
   "sub": "capacitance",
   "type": "MCQ",
   "marks": 3.5,
   "diff": "standard",
   "fig": "em-gauss-pillbox",
   "stem": "In the parallel-plate arrangement of the figure ($E=\\sigma/\\varepsilon_0$ between the plates), the plate separation is halved while area and charge are kept fixed. The capacitance",
   "opts": [
    "is doubled",
    "stays unchanged",
    "quadruples",
    "is halved"
   ],
   "ans": 0,
   "sol": "$C=\\varepsilon_0 A/d$: halving $d$ doubles $C$. (The field $E=\\sigma/\\varepsilon_0$ is set by the charge density and is itself unchanged.)",
   "tags": [
    "parallel-plate"
   ],
   "correctMarks": 3.5,
   "wrongMarks": 0.875,
   "figSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1200 700\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\"><defs><marker id=\"md9a441\" viewBox=\"0 0 10 10\" refX=\"8\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 z\" fill=\"#d9a441\"/></marker></defs><rect x=\"0\" y=\"0\" width=\"1200\" height=\"700\" fill=\"#0b0e13\"/><rect x=\"300\" y=\"190\" width=\"600\" height=\"26\" rx=\"0\" fill=\"#405060\" stroke=\"#9db2c8\" stroke-width=\"3\"/><rect x=\"300\" y=\"470\" width=\"600\" height=\"26\" rx=\"0\" fill=\"#405060\" stroke=\"#9db2c8\" stroke-width=\"3\"/><text x=\"360\" y=\"185\" font-size=\"26\" fill=\"#e5534b\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">+</text><text x=\"360\" y=\"522\" font-size=\"26\" fill=\"#6ea8fe\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">−</text><text x=\"450\" y=\"185\" font-size=\"26\" fill=\"#e5534b\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">+</text><text x=\"450\" y=\"522\" font-size=\"26\" fill=\"#6ea8fe\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">−</text><text x=\"540\" y=\"185\" font-size=\"26\" fill=\"#e5534b\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">+</text><text x=\"540\" y=\"522\" font-size=\"26\" fill=\"#6ea8fe\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">−</text><text x=\"630\" y=\"185\" font-size=\"26\" fill=\"#e5534b\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">+</text><text x=\"630\" y=\"522\" font-size=\"26\" fill=\"#6ea8fe\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">−</text><text x=\"720\" y=\"185\" font-size=\"26\" fill=\"#e5534b\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">+</text><text x=\"720\" y=\"522\" font-size=\"26\" fill=\"#6ea8fe\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">−</text><text x=\"810\" y=\"185\" font-size=\"26\" fill=\"#e5534b\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">+</text><text x=\"810\" y=\"522\" font-size=\"26\" fill=\"#6ea8fe\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">−</text><text x=\"918\" y=\"212\" font-size=\"26\" fill=\"#e5534b\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">+σ</text><text x=\"918\" y=\"494\" font-size=\"26\" fill=\"#6ea8fe\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">−σ</text><line x1=\"400\" y1=\"240\" x2=\"400\" y2=\"450\" stroke=\"#d9a441\" stroke-width=\"3\" stroke-linecap=\"round\" marker-end=\"url(#md9a441)\"/><line x1=\"520\" y1=\"240\" x2=\"520\" y2=\"450\" stroke=\"#d9a441\" stroke-width=\"3\" stroke-linecap=\"round\" marker-end=\"url(#md9a441)\"/><line x1=\"640\" y1=\"240\" x2=\"640\" y2=\"450\" stroke=\"#d9a441\" stroke-width=\"3\" stroke-linecap=\"round\" marker-end=\"url(#md9a441)\"/><line x1=\"760\" y1=\"240\" x2=\"760\" y2=\"450\" stroke=\"#d9a441\" stroke-width=\"3\" stroke-linecap=\"round\" marker-end=\"url(#md9a441)\"/><text x=\"810\" y=\"350\" font-size=\"30\" fill=\"#d9a441\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">E</text><rect x=\"430\" y=\"148\" width=\"130\" height=\"100\" rx=\"0\" fill=\"none\" stroke=\"#7ee787\" stroke-width=\"3\" stroke-dasharray=\"9 7\"/><circle cx=\"495\" cy=\"203\" r=\"0.1\" fill=\"#9db2c8\"/><line x1=\"560\" y1=\"175\" x2=\"700\" y2=\"175\" stroke=\"#7ee787\" stroke-width=\"2\" stroke-dasharray=\"4 6\" stroke-linecap=\"round\"/><text x=\"710\" y=\"182\" font-size=\"22\" fill=\"#7ee787\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">Gaussian pillbox, face area A</text><text x=\"600\" y=\"650\" font-size=\"22\" fill=\"#6b7c8f\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">infinite sheets: E = σ/ε₀ (outside) — pillbox proof</text><text x=\"600\" y=\"80\" font-size=\"22\" fill=\"#6b7c8f\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">parallel-plate field + Gaussian surface</text></svg>"
  },
  {
   "id": "PF-CS-B09",
   "n": 29,
   "part": "B",
   "lane": "emtheory",
   "sub": "magnetostatics",
   "type": "MCQ",
   "marks": 3.5,
   "diff": "standard",
   "stem": "A long ideal solenoid with $n=500$ turns per metre carries $I=2\\,\\mathrm{A}$. The magnetic field inside it is",
   "opts": [
    "$0.13\\,\\mathrm{mT}$",
    "$1.26\\,\\mathrm{mT}$",
    "$12.6\\,\\mathrm{mT}$",
    "$126\\,\\mathrm{mT}$"
   ],
   "ans": 1,
   "sol": "$B=\\mu_0nI=4\\pi\\times10^{-7}\\times500\\times2=4\\pi\\times10^{-4}=1.26\\times10^{-3}\\,\\mathrm{T}=1.26\\,\\mathrm{mT}$.",
   "tags": [
    "solenoid"
   ],
   "correctMarks": 3.5,
   "wrongMarks": 0.875
  },
  {
   "id": "PF-CS-B10",
   "n": 30,
   "part": "B",
   "lane": "emtheory",
   "sub": "em-waves",
   "type": "MCQ",
   "marks": 3.5,
   "diff": "seed",
   "stem": "For a plane electromagnetic wave in vacuum, the ratio of the electric to magnetic field amplitudes $E_0/B_0$ equals",
   "opts": [
    "$\\sqrt{\\mu_0/\\varepsilon_0}/c$ only",
    "$1/c$",
    "$c$",
    "$c^2$"
   ],
   "ans": 2,
   "sol": "Faraday induction on a plane wave gives $E_0=cB_0$, hence $E_0/B_0=c=3\\times10^{8}\\,\\mathrm{m/s}$.",
   "tags": [
    "plane-wave"
   ],
   "correctMarks": 3.5,
   "wrongMarks": 0.875
  },
  {
   "id": "PF-CS-B11",
   "n": 31,
   "part": "B",
   "lane": "quantum",
   "sub": "photons",
   "type": "MCQ",
   "marks": 3.5,
   "diff": "standard",
   "stem": "The energy of a photon of wavelength $500\\,\\mathrm{nm}$ is approximately",
   "opts": [
    "$4.96\\,\\mathrm{eV}$",
    "$6.20\\,\\mathrm{eV}$",
    "$1.24\\,\\mathrm{eV}$",
    "$2.48\\,\\mathrm{eV}$"
   ],
   "ans": 3,
   "sol": "$E=hc/\\lambda=1240\\,\\mathrm{eV\\,nm}/500\\,\\mathrm{nm}=2.48\\,\\mathrm{eV}$.",
   "tags": [
    "photon-energy"
   ],
   "correctMarks": 3.5,
   "wrongMarks": 0.875
  },
  {
   "id": "PF-CS-B12",
   "n": 32,
   "part": "B",
   "lane": "quantum",
   "sub": "square-well",
   "type": "MCQ",
   "marks": 3.5,
   "diff": "standard",
   "stem": "If the width of a one-dimensional infinite potential well is doubled, its ground-state energy becomes",
   "opts": [
    "one quarter",
    "twice",
    "four times",
    "one half"
   ],
   "ans": 0,
   "sol": "$E_1=\\pi^2\\hbar^2/(2mL^2)\\propto1/L^2$; doubling $L$ divides $E_1$ by $4$.",
   "tags": [
    "scaling"
   ],
   "correctMarks": 3.5,
   "wrongMarks": 0.875
  },
  {
   "id": "PF-CS-B13",
   "n": 33,
   "part": "B",
   "lane": "quantum",
   "sub": "formalism",
   "type": "MCQ",
   "marks": 3.5,
   "diff": "seed",
   "stem": "For a quantum state $\\psi(\\mathbf{r},t)$, the quantity $|\\psi(\\mathbf{r},t)|^2$ represents",
   "opts": [
    "the expectation value of the position operator",
    "the probability density for finding the particle near $\\mathbf r$ at time $t$",
    "the total energy density of the particle",
    "the classical trajectory smoothed over one period"
   ],
   "ans": 1,
   "sol": "Born rule: $|\\psi|^2d^3r$ is the probability of locating the particle in $d^3r$; normalisation $\\int|\\psi|^2d^3r=1$ makes it a density, not a probability itself.",
   "tags": [
    "born-rule"
   ],
   "correctMarks": 3.5,
   "wrongMarks": 0.875
  },
  {
   "id": "PF-CS-B14",
   "n": 34,
   "part": "B",
   "lane": "quantum",
   "sub": "harmonic-oscillator",
   "type": "MCQ",
   "marks": 3.5,
   "diff": "standard",
   "stem": "For the harmonic-oscillator raising operator, $\\hat{a}^\\dagger|2\\rangle$ equals",
   "opts": [
    "$\\sqrt{3}\\,|1\\rangle$",
    "$\\sqrt{2}\\,|1\\rangle$",
    "$\\sqrt{3}\\,|3\\rangle$",
    "$2\\,|3\\rangle$"
   ],
   "ans": 2,
   "sol": "$\\hat a^\\dagger|n\\rangle=\\sqrt{n+1}\\,|n+1\\rangle$, so $n=2$ gives $\\sqrt{3}\\,|3\\rangle$.",
   "tags": [
    "ladder-operators"
   ],
   "correctMarks": 3.5,
   "wrongMarks": 0.875
  },
  {
   "id": "PF-CS-B15",
   "n": 35,
   "part": "B",
   "lane": "thermo",
   "sub": "phase-equilibria",
   "type": "MCQ",
   "marks": 3.5,
   "diff": "seed",
   "stem": "The triple-point temperature of water is",
   "opts": [
    "$373.15\\,\\mathrm{K}$",
    "$0.00\\,\\mathrm{K}$",
    "$273.15\\,\\mathrm{K}$",
    "$273.16\\,\\mathrm{K}$"
   ],
   "ans": 3,
   "sol": "By definition (and former SI fixing) the water triple point is $273.16\\,\\mathrm{K}=0.01^\\circ$C — note it sits $0.01$ K above the ice point $273.15\\,\\mathrm{K}$.",
   "tags": [
    "triple-point"
   ],
   "correctMarks": 3.5,
   "wrongMarks": 0.875
  },
  {
   "id": "PF-CS-B16",
   "n": 36,
   "part": "B",
   "lane": "thermo",
   "sub": "carnot",
   "type": "MCQ",
   "marks": 3.5,
   "diff": "seed",
   "stem": "A Carnot engine operates between reservoirs at $600\\,\\mathrm{K}$ and $300\\,\\mathrm{K}$. Its efficiency is",
   "opts": [
    "$50\\%$",
    "$67\\%$",
    "$25\\%$",
    "$33\\%$"
   ],
   "ans": 0,
   "sol": "$\\eta=1-T_c/T_h=1-300/600=0.5=50\\%$.",
   "tags": [
    "efficiency"
   ],
   "correctMarks": 3.5,
   "wrongMarks": 0.875
  },
  {
   "id": "PF-CS-B17",
   "n": 37,
   "part": "B",
   "lane": "thermo",
   "sub": "entropy",
   "type": "MCQ",
   "marks": 3.5,
   "diff": "standard",
   "stem": "One kilogram of ice melts reversibly at $273\\,\\mathrm{K}$, absorbing a latent heat $L=334\\,\\mathrm{kJ}$. The entropy change of the ice-water system is",
   "opts": [
    "$0.82\\,\\mathrm{kJ\\,K^{-1}}$",
    "$1.22\\,\\mathrm{kJ\\,K^{-1}}$",
    "$334\\,\\mathrm{kJ\\,K^{-1}}$",
    "$0$"
   ],
   "ans": 1,
   "sol": "Reversible isothermal phase change: $\\Delta S=L/T=334/273=1.22\\,\\mathrm{kJ\\,K^{-1}}$. It is not zero — entropy is not conserved, only energy is.",
   "tags": [
    "latent-heat"
   ],
   "correctMarks": 3.5,
   "wrongMarks": 0.875
  },
  {
   "id": "PF-CS-B18",
   "n": 38,
   "part": "B",
   "lane": "electronics",
   "sub": "amplifiers",
   "type": "MCQ",
   "marks": 3.5,
   "diff": "standard",
   "stem": "A single-stage common-emitter transistor amplifier introduces, between base input and collector output, a voltage phase shift of",
   "opts": [
    "$0^\\circ$",
    "$90^\\circ$",
    "$180^\\circ$",
    "$270^\\circ$"
   ],
   "ans": 2,
   "sol": "Rising base voltage raises collector current and drops the collector node: output and input are inverted, i.e. $180^\\circ$ out of phase (mid-band).",
   "tags": [
    "common-emitter"
   ],
   "correctMarks": 3.5,
   "wrongMarks": 0.875
  },
  {
   "id": "PF-CS-B19",
   "n": 39,
   "part": "B",
   "lane": "electronics",
   "sub": "sources",
   "type": "MCQ",
   "marks": 3.5,
   "diff": "seed",
   "stem": "An ideal voltage source has internal resistance",
   "opts": [
    "equal to the load resistance",
    "$1\\,\\Omega$",
    "infinite",
    "zero"
   ],
   "ans": 3,
   "sol": "The terminal voltage of an ideal voltage source never sags with load, which forces internal resistance $R_{int}=0$. (An ideal current source instead has infinite internal resistance.)",
   "tags": [
    "thevenin"
   ],
   "correctMarks": 3.5,
   "wrongMarks": 0.875
  },
  {
   "id": "PF-CS-B20",
   "n": 40,
   "part": "B",
   "lane": "electronics",
   "sub": "digital",
   "type": "MCQ",
   "marks": 3.5,
   "diff": "standard",
   "stem": "A 4-bit binary ripple counter passes through how many distinct states before repeating?",
   "opts": [
    "$16$",
    "$32$",
    "$4$",
    "$8$"
   ],
   "ans": 0,
   "sol": "$2^4=16$ states, $0000$ through $1111$, then it wraps.",
   "tags": [
    "counters"
   ],
   "correctMarks": 3.5,
   "wrongMarks": 0.875
  },
  {
   "id": "PF-CS-B21",
   "n": 41,
   "part": "B",
   "lane": "atnuc",
   "sub": "nuclear-structure",
   "type": "MCQ",
   "marks": 3.5,
   "diff": "seed",
   "stem": "Two nuclei are isotopes of each other when they have the same",
   "opts": [
    "mass number $A$",
    "atomic number $Z$ with different mass numbers",
    "neutron number $N$ with different atomic numbers",
    "binding energy per nucleon"
   ],
   "ans": 1,
   "sol": "Isotopes share $Z$ (same element, same chemistry) while $N$ and hence $A$ differ, e.g. $^{12}$C and $^{14}$C. Equal $N$ defines isotones; equal $A$ defines isobars.",
   "tags": [
    "isotopes"
   ],
   "correctMarks": 3.5,
   "wrongMarks": 0.875
  },
  {
   "id": "PF-CS-B22",
   "n": 42,
   "part": "B",
   "lane": "atnuc",
   "sub": "nuclear-size",
   "type": "MCQ",
   "marks": 3.5,
   "diff": "standard",
   "stem": "With the nuclear radius law $R=R_0A^{1/3}$, the radius ratio $R(^{27}\\mathrm{Al})/R(^{8}\\mathrm{Be})$ is",
   "opts": [
    "$3.0$",
    "$3.375$",
    "$1.5$",
    "$2.25$"
   ],
   "ans": 2,
   "sol": "$R\\propto A^{1/3}$, so the ratio is $(27/8)^{1/3}=3/2=1.5$.",
   "tags": [
    "radius-law"
   ],
   "correctMarks": 3.5,
   "wrongMarks": 0.875
  },
  {
   "id": "PF-CS-B23",
   "n": 43,
   "part": "B",
   "lane": "solidstate",
   "sub": "crystal-structure",
   "type": "MCQ",
   "marks": 3.5,
   "diff": "standard",
   "stem": "The number of atoms per conventional (cubic) unit cell of the diamond structure is",
   "opts": [
    "$16$",
    "$2$",
    "$4$",
    "$8$"
   ],
   "ans": 3,
   "sol": "Diamond = FCC lattice ($4$ lattice points) with a two-atom basis, giving $4\\times2=8$ atoms per conventional cell.",
   "tags": [
    "diamond"
   ],
   "correctMarks": 3.5,
   "wrongMarks": 0.875
  },
  {
   "id": "PF-CS-B24",
   "n": 44,
   "part": "B",
   "lane": "solidstate",
   "sub": "semiconductors",
   "type": "MCQ",
   "marks": 3.5,
   "diff": "seed",
   "stem": "The band gap of silicon at room temperature is approximately",
   "opts": [
    "$1.1\\,\\mathrm{eV}$",
    "$5.5\\,\\mathrm{eV}$",
    "$0.03\\,\\mathrm{eV}$",
    "$0.67\\,\\mathrm{eV}$"
   ],
   "ans": 0,
   "sol": "$E_g(\\mathrm{Si})\\approx1.1\\,\\mathrm{eV}$ at $300\\,\\mathrm{K}$; $0.67\\,\\mathrm{eV}$ is germanium and $5.5\\,\\mathrm{eV}$ diamond’s insulator-scale gap.",
   "tags": [
    "band-gap"
   ],
   "correctMarks": 3.5,
   "wrongMarks": 0.875
  },
  {
   "id": "PF-CS-B25",
   "n": 45,
   "part": "B",
   "lane": "solidstate",
   "sub": "band-theory",
   "type": "MCQ",
   "marks": 3.5,
   "diff": "standard",
   "stem": "Bloch theorem states that the one-electron wavefunction in a perfect crystal can be written as",
   "opts": [
    "a localised Wannier function centred on every site simultaneously",
    "$\\psi(\\mathbf r)=e^{i\\mathbf k\\cdot\\mathbf r}u_{\\mathbf k}(\\mathbf r)$ with $u_{\\mathbf k}$ having the lattice periodicity",
    "$\\psi(\\mathbf r)=A\\sin(\\mathbf k\\cdot\\mathbf r)$ with uniform amplitude",
    "a plane wave truncated at the first Brillouin zone boundary"
   ],
   "ans": 1,
   "sol": "Bloch states are lattice-periodic envelopes $u_{\\mathbf k}(\\mathbf r+\\mathbf R)=u_{\\mathbf k}(\\mathbf r)$ modulating a plane wave $e^{i\\mathbf k\\cdot\\mathbf r}$, the crystalline analogue of Floquet theory.",
   "tags": [
    "bloch-theorem"
   ],
   "correctMarks": 3.5,
   "wrongMarks": 0.875
  },
  {
   "id": "PF-CS-C01",
   "n": 46,
   "part": "C",
   "lane": "mathphys",
   "sub": "complex-analysis",
   "type": "MCQ",
   "marks": 5,
   "diff": "standard",
   "stem": "The value of the contour integral $\\displaystyle\\oint_{|z-i|=1}\\frac{dz}{z^2+1}$ is",
   "opts": [
    "$\\pi/2$",
    "$0$",
    "$\\pi$",
    "$2\\pi$"
   ],
   "ans": 2,
   "sol": "Only the pole $z=i$ lies inside the circle $|z-i|=1$; $\\operatorname{Res}_{z=i}\\frac{1}{(z-i)(z+i)}=\\frac{1}{2i}$, so the integral is $2\\pi i\\times\\frac{1}{2i}=\\pi$.",
   "tags": [
    "residue-theorem"
   ],
   "correctMarks": 5,
   "wrongMarks": 1.25
  },
  {
   "id": "PF-CS-C02",
   "n": 47,
   "part": "C",
   "lane": "mathphys",
   "sub": "fourier-transform",
   "type": "MCQ",
   "marks": 5,
   "diff": "standard",
   "stem": "The Fourier transform $\\tilde f(k)=\\int_{-\\infty}^{\\infty}e^{-ikx}f(x)\\,dx$ of $f(x)=e^{-2|x|}$, evaluated at $k=0$, is",
   "opts": [
    "$2$",
    "$4$",
    "$1/2$",
    "$1$"
   ],
   "ans": 3,
   "sol": "$\\tilde f(0)=\\int_{-\\infty}^{\\infty}e^{-2|x|}dx=2\\int_0^\\infty e^{-2x}dx=2\\times\\tfrac12=1$ (equivalently $2a/(a^2+k^2)$ at $a=2,k=0$).",
   "tags": [
    "fourier-transform"
   ],
   "correctMarks": 5,
   "wrongMarks": 1.25
  },
  {
   "id": "PF-CS-C03",
   "n": 48,
   "part": "C",
   "lane": "mathphys",
   "sub": "linear-algebra",
   "type": "MCQ",
   "marks": 5,
   "diff": "apex",
   "stem": "For the nilpotent matrix $A=\\begin{pmatrix}0&1\\\\0&0\\end{pmatrix}$, the exponential $e^{A}$ equals",
   "opts": [
    "$\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}$",
    "$\\begin{pmatrix}e&1\\\\0&e\\end{pmatrix}$",
    "$\\begin{pmatrix}1&0\\\\1&1\\end{pmatrix}$",
    "$\\begin{pmatrix}e&0\\\\0&e\\end{pmatrix}$"
   ],
   "ans": 0,
   "sol": "$A^2=0$ kills every term past linear order: $e^A=I+A=\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}$.",
   "tags": [
    "matrix-exponential",
    "nilpotent"
   ],
   "correctMarks": 5,
   "wrongMarks": 1.25
  },
  {
   "id": "PF-CS-C04",
   "n": 49,
   "part": "C",
   "lane": "mathphys",
   "sub": "vector-calculus",
   "type": "MCQ",
   "marks": 5,
   "diff": "standard",
   "stem": "The circulation $\\oint\\mathbf{F}\\cdot d\\mathbf{l}$ of $\\mathbf{F}=(-y,\\,x,\\,0)$ around the unit circle $x^2+y^2=1$ (counter-clockwise, $z=0$ plane) is",
   "opts": [
    "$\\pi$",
    "$2\\pi$",
    "$4\\pi$",
    "$0$"
   ],
   "ans": 1,
   "sol": "$(\\nabla\\times\\mathbf F)_z=\\partial_x(x)-\\partial_y(-y)=2$; Stokes gives $2\\times\\text{area}=2\\pi$. Direct: $x=\\cos t,y=\\sin t$ yields $\\int_0^{2\\pi}(x^2+y^2)dt=2\\pi$.",
   "tags": [
    "stokes-theorem"
   ],
   "correctMarks": 5,
   "wrongMarks": 1.25
  },
  {
   "id": "PF-CS-C05",
   "n": 50,
   "part": "C",
   "lane": "classical",
   "sub": "rockets",
   "type": "MCQ",
   "marks": 5,
   "diff": "standard",
   "stem": "A rocket ejects exhaust at $u=2\\,\\mathrm{km/s}$ (relative to the rocket). Ignoring gravity and drag, the speed gained when the mass ratio is $m_0/m=3$ is",
   "opts": [
    "$6.0\\,\\mathrm{km/s}$",
    "$1.6\\,\\mathrm{km/s}$",
    "$2.2\\,\\mathrm{km/s}$",
    "$3.0\\,\\mathrm{km/s}$"
   ],
   "ans": 2,
   "sol": "Tsiolkovsky: $\\Delta v=u\\ln(m_0/m)=2\\ln3=2\\times1.0986=2.20\\,\\mathrm{km/s}$.",
   "tags": [
    "variable-mass"
   ],
   "correctMarks": 5,
   "wrongMarks": 1.25
  },
  {
   "id": "PF-CS-C06",
   "n": 51,
   "part": "C",
   "lane": "classical",
   "sub": "central-forces",
   "type": "MCQ",
   "marks": 5,
   "diff": "apex",
   "stem": "A particle moves in the isotropic three-dimensional harmonic potential $V(r)=\\tfrac12 kr^2$. The shape of a generic bound orbit is",
   "opts": [
    "a precessing rosette that never closes",
    "a parabola with vertex at the force centre",
    "an ellipse with the force centre at one focus",
    "an ellipse centred on the force centre"
   ],
   "ans": 3,
   "sol": "For the isotropic oscillator the solution is $\\mathbf r(t)=\\mathbf A\\cos\\omega t+\\mathbf B\\sin\\omega t$: an ellipse geometrically centred on the centre of force. (Kepler’s law $1/r$ instead puts the centre at a focus.)",
   "tags": [
    "bertrand",
    "orbits"
   ],
   "correctMarks": 5,
   "wrongMarks": 1.25
  },
  {
   "id": "PF-CS-C07",
   "n": 52,
   "part": "C",
   "lane": "classical",
   "sub": "projectile",
   "type": "MCQ",
   "marks": 5,
   "diff": "seed",
   "stem": "A projectile is launched at $v=20\\,\\mathrm{m/s}$ at $45^\\circ$ to the horizontal. Taking $g=10\\,\\mathrm{m/s^2}$, its range on level ground is",
   "opts": [
    "$40\\,\\mathrm{m}$",
    "$60\\,\\mathrm{m}$",
    "$80\\,\\mathrm{m}$",
    "$20\\,\\mathrm{m}$"
   ],
   "ans": 0,
   "sol": "$R=v^2\\sin(2\\theta)/g=400\\times1/10=40\\,\\mathrm{m}$ — $45^\\circ$ maximises $\\sin 2\\theta$.",
   "tags": [
    "kinematics"
   ],
   "correctMarks": 5,
   "wrongMarks": 1.25
  },
  {
   "id": "PF-CS-C08",
   "n": 53,
   "part": "C",
   "lane": "classical",
   "sub": "oscillations",
   "type": "MCQ",
   "marks": 5,
   "diff": "apex",
   "stem": "A damped oscillator follows $x(t)=A_0e^{-t/2\\tau}\\cos\\omega t$. After $t=10\\,\\mathrm{s}$ with $\\tau=2\\,\\mathrm{s}$, the fraction of its initial energy remaining is",
   "opts": [
    "$e^{-2.5}$",
    "$e^{-5}$",
    "$e^{-10}$",
    "$e^{-20}$"
   ],
   "ans": 1,
   "sol": "Energy is quadratic in amplitude: $E/E_0=e^{-t/\\tau}=e^{-10/2}=e^{-5}\\approx6.7\\times10^{-3}$. The amplitude halves the exponent rate of the energy.",
   "tags": [
    "damping",
    "energy-decay"
   ],
   "correctMarks": 5,
   "wrongMarks": 1.25
  },
  {
   "id": "PF-CS-C09",
   "n": 54,
   "part": "C",
   "lane": "emtheory",
   "sub": "electrostatics",
   "type": "MCQ",
   "marks": 5,
   "diff": "standard",
   "stem": "A thin spherical shell of radius $R$ carries total charge $Q$. The electrostatic potential at any point inside the shell (taking $V(\\infty)=0$) is",
   "opts": [
    "$kQ/R^2$",
    "zero",
    "$kQ/R$, the same everywhere inside",
    "$kQ/r$, varying with interior radius $r$"
   ],
   "ans": 2,
   "sol": "Inside, $E=0$, so $V$ is constant; matching at the surface fixes the constant at $kQ/R$. Zero would follow only by wrongly setting $V=0$ wherever $E=0$.",
   "tags": [
    "shell-theorem"
   ],
   "correctMarks": 5,
   "wrongMarks": 1.25
  },
  {
   "id": "PF-CS-C10",
   "n": 55,
   "part": "C",
   "lane": "emtheory",
   "sub": "capacitance",
   "type": "MCQ",
   "marks": 5,
   "diff": "standard",
   "stem": "A $2\\,\\mu\\mathrm{F}$ capacitor charged to $100\\,\\mathrm{V}$ is disconnected from the source and connected in parallel (like plates together) with an uncharged $3\\,\\mu\\mathrm{F}$ capacitor. The common voltage across the pair is",
   "opts": [
    "$20\\,\\mathrm{V}$",
    "$60\\,\\mathrm{V}$",
    "$50\\,\\mathrm{V}$",
    "$40\\,\\mathrm{V}$"
   ],
   "ans": 3,
   "sol": "Charge is conserved: $Q=2\\,\\mu\\mathrm{F}\\times100\\,\\mathrm{V}=200\\,\\mu\\mathrm{C}$ over $C_{tot}=5\\,\\mu\\mathrm{F}$ gives $V=200/5=40\\,\\mathrm{V}$. (Energy is not conserved — some is lost in redistribution.)",
   "tags": [
    "charge-sharing"
   ],
   "correctMarks": 5,
   "wrongMarks": 1.25
  },
  {
   "id": "PF-CS-C11",
   "n": 56,
   "part": "C",
   "lane": "emtheory",
   "sub": "method-of-images",
   "type": "MCQ",
   "marks": 5,
   "diff": "apex",
   "stem": "A point charge $q$ sits a distance $d$ above an infinite grounded conducting plane. The magnitude of the force attracting it to the plane is",
   "opts": [
    "$q^2/(16\\pi\\varepsilon_0 d^2)$",
    "$q^2/(32\\pi\\varepsilon_0 d^2)$",
    "$q^2/(4\\pi\\varepsilon_0 d^2)$",
    "$q^2/(8\\pi\\varepsilon_0 d^2)$"
   ],
   "ans": 0,
   "sol": "Image charge $-q$ at distance $2d$: $F=q^2/[4\\pi\\varepsilon_0(2d)^2]=q^2/(16\\pi\\varepsilon_0 d^2)$. The halves in plane distance and Coulomb law together give the factor $16$.",
   "tags": [
    "image-charges"
   ],
   "correctMarks": 5,
   "wrongMarks": 1.25
  },
  {
   "id": "PF-CS-C12",
   "n": 57,
   "part": "C",
   "lane": "emtheory",
   "sub": "optics",
   "type": "MCQ",
   "marks": 5,
   "diff": "standard",
   "fig": "op-thin-lens",
   "stem": "For the thin-lens arrangement of the figure ($f=15\\,\\mathrm{cm}$, object at $u=30\\,\\mathrm{cm}$), the image distance $v$ and magnification $m$ are",
   "opts": [
    "$v=15\\,\\mathrm{cm},\\ m=-2$",
    "$v=30\\,\\mathrm{cm},\\ m=-1$",
    "$v=10\\,\\mathrm{cm},\\ m=-1/2$",
    "$v=30\\,\\mathrm{cm},\\ m=+1$"
   ],
   "ans": 1,
   "sol": "$1/v=1/f-1/u=1/15-1/30=1/30$, so $v=30\\,\\mathrm{cm}$ and $m=-v/u=-1$: a real, inverted, same-size image, exactly what the ray diagram shows.",
   "tags": [
    "thin-lens"
   ],
   "correctMarks": 5,
   "wrongMarks": 1.25,
   "figSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1200 700\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\"><defs><marker id=\"m405060\" viewBox=\"0 0 10 10\" refX=\"8\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 z\" fill=\"#405060\"/></marker><marker id=\"m6ea8fe\" viewBox=\"0 0 10 10\" refX=\"8\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 z\" fill=\"#6ea8fe\"/></marker><marker id=\"md9a441\" viewBox=\"0 0 10 10\" refX=\"8\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 z\" fill=\"#d9a441\"/></marker><marker id=\"me5534b\" viewBox=\"0 0 10 10\" refX=\"8\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 z\" fill=\"#e5534b\"/></marker></defs><rect x=\"0\" y=\"0\" width=\"1200\" height=\"700\" fill=\"#0b0e13\"/><line x1=\"90\" y1=\"400\" x2=\"1110\" y2=\"400\" stroke=\"#405060\" stroke-width=\"3\" stroke-linecap=\"round\" marker-end=\"url(#m405060)\"/><ellipse cx=\"600\" cy=\"400\" rx=\"38\" ry=\"210\" fill=\"none\" stroke=\"#6ea8fe\" stroke-width=\"4\"/><line x1=\"600\" y1=\"186\" x2=\"600\" y2=\"158\" stroke=\"#6ea8fe\" stroke-width=\"3\" stroke-linecap=\"round\" marker-end=\"url(#m6ea8fe)\"/><line x1=\"600\" y1=\"614\" x2=\"600\" y2=\"642\" stroke=\"#6ea8fe\" stroke-width=\"3\" stroke-linecap=\"round\" marker-end=\"url(#m6ea8fe)\"/><line x1=\"420\" y1=\"390\" x2=\"420\" y2=\"410\" stroke=\"#405060\" stroke-width=\"2\" stroke-linecap=\"round\"/><text x=\"420\" y=\"440\" font-size=\"22\" fill=\"#6b7c8f\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">F</text><line x1=\"780\" y1=\"390\" x2=\"780\" y2=\"410\" stroke=\"#405060\" stroke-width=\"2\" stroke-linecap=\"round\"/><text x=\"780\" y=\"440\" font-size=\"22\" fill=\"#6b7c8f\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">F′</text><line x1=\"240\" y1=\"390\" x2=\"240\" y2=\"410\" stroke=\"#405060\" stroke-width=\"2\" stroke-linecap=\"round\"/><text x=\"240\" y=\"440\" font-size=\"22\" fill=\"#6b7c8f\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">2F</text><line x1=\"960\" y1=\"390\" x2=\"960\" y2=\"410\" stroke=\"#405060\" stroke-width=\"2\" stroke-linecap=\"round\"/><text x=\"960\" y=\"440\" font-size=\"22\" fill=\"#6b7c8f\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">2F′</text><line x1=\"300\" y1=\"400\" x2=\"300\" y2=\"270\" stroke=\"#d9a441\" stroke-width=\"5\" stroke-linecap=\"round\" marker-end=\"url(#md9a441)\"/><text x=\"300\" y=\"252\" font-size=\"22\" fill=\"#d9a441\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">object</text><line x1=\"1050\" y1=\"400\" x2=\"1050\" y2=\"595\" stroke=\"#e5534b\" stroke-width=\"5\" stroke-linecap=\"round\" marker-end=\"url(#me5534b)\"/><text x=\"1050\" y=\"629\" font-size=\"22\" fill=\"#e5534b\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">image (real, inverted)</text><line x1=\"300\" y1=\"270\" x2=\"600\" y2=\"270\" stroke=\"#7ee787\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"600\" y1=\"270\" x2=\"1050\" y2=\"595\" stroke=\"#7ee787\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"300\" y1=\"270\" x2=\"600\" y2=\"400\" stroke=\"#2ea043\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"600\" y1=\"400\" x2=\"1050\" y2=\"595\" stroke=\"#2ea043\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"300\" y1=\"270\" x2=\"600\" y2=\"595\" stroke=\"#e5534b\" stroke-width=\"2\" stroke-dasharray=\"9 7\" stroke-linecap=\"round\"/><line x1=\"600\" y1=\"595\" x2=\"1050\" y2=\"595\" stroke=\"#e5534b\" stroke-width=\"2\" stroke-dasharray=\"9 7\" stroke-linecap=\"round\"/><text x=\"450\" y=\"476\" font-size=\"22\" fill=\"#9db2c8\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">u = 30 cm</text><text x=\"825\" y=\"476\" font-size=\"22\" fill=\"#9db2c8\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">v</text><text x=\"90\" y=\"120\" font-size=\"24\" fill=\"#6ea8fe\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">f = 15 cm</text><text x=\"600\" y=\"80\" font-size=\"22\" fill=\"#6b7c8f\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">thin-lens imaging (u &gt; f)</text></svg>"
  },
  {
   "id": "PF-CS-C13",
   "n": 58,
   "part": "C",
   "lane": "quantum",
   "sub": "tunneling",
   "type": "MCQ",
   "marks": 5,
   "diff": "apex",
   "stem": "Outside a finite-width barrier the wavefunction decays as $\\psi\\sim e^{-\\kappa x}$. The ratio of the probability densities $|\\psi(a+1/\\kappa)|^2/|\\psi(a)|^2$ at two points one penetration depth apart is",
   "opts": [
    "$e^{-1/2}$",
    "$e^{-1}$",
    "$e^{-2}$",
    "$1/2$"
   ],
   "ans": 2,
   "sol": "$|\\psi|^2\\sim e^{-2\\kappa x}$, so the ratio over $\\Delta x=1/\\kappa$ is $e^{-2\\kappa/\\kappa}=e^{-2}\\approx0.135$. Probability decays twice as fast as amplitude.",
   "tags": [
    "evanescent-wave"
   ],
   "correctMarks": 5,
   "wrongMarks": 1.25
  },
  {
   "id": "PF-CS-C14",
   "n": 59,
   "part": "C",
   "lane": "quantum",
   "sub": "hydrogen",
   "type": "MCQ",
   "marks": 5,
   "diff": "standard",
   "stem": "For the hydrogen $1s$ state, the most probable value of the radial distance $r$ (peak of the radial probability distribution) is",
   "opts": [
    "$\\tfrac{3}{2}a_0$",
    "$2a_0$",
    "$a_0/2$",
    "$a_0$"
   ],
   "ans": 3,
   "sol": "The radial density $P(r)=4r^2e^{-2r/a_0}/a_0^3$ peaks where $dP/dr=0$: $2r-2r^2/a_0=0$, i.e. $r=a_0$. Note $\\langle r\\rangle=\\tfrac32a_0$ is the mean, not the peak.",
   "tags": [
    "radial-distribution"
   ],
   "correctMarks": 5,
   "wrongMarks": 1.25
  },
  {
   "id": "PF-CS-C15",
   "n": 60,
   "part": "C",
   "lane": "quantum",
   "sub": "perturbation",
   "type": "MCQ",
   "marks": 5,
   "diff": "apex",
   "stem": "A harmonic oscillator of mass $m$ and frequency $\\omega$ is perturbed by $H^{\\prime}=bx^2$. The first-order shift of its ground-state energy is",
   "opts": [
    "$b\\hbar/(2m\\omega)$",
    "$b\\hbar/(m\\omega)$",
    "$2b\\hbar/(m\\omega)$",
    "$b\\hbar/(4m\\omega)$"
   ],
   "ans": 0,
   "sol": "$\\Delta E^{(1)}=\\langle0|bx^2|0\\rangle=b\\,\\frac{\\hbar}{2m\\omega}(2n+1)\\big|_{n=0}=b\\hbar/(2m\\omega)$, using $\\langle x^2\\rangle_0=\\hbar/(2m\\omega)$.",
   "tags": [
    "first-order-correction"
   ],
   "correctMarks": 5,
   "wrongMarks": 1.25
  },
  {
   "id": "PF-CS-C16",
   "n": 61,
   "part": "C",
   "lane": "quantum",
   "sub": "uncertainty",
   "type": "MCQ",
   "marks": 5,
   "diff": "standard",
   "stem": "For the harmonic-oscillator eigenstate $n=3$, the product $\\Delta x\\,\\Delta p$ equals",
   "opts": [
    "$3\\hbar$",
    "$\\tfrac72\\hbar$",
    "$\\tfrac52\\hbar$",
    "$4\\hbar$"
   ],
   "ans": 1,
   "sol": "Every oscillator eigenstate gives $\\Delta x\\Delta p=(n+\\tfrac12)\\hbar$; for $n=3$ this is $\\tfrac72\\hbar$. Only $n=0$ saturates the $\\hbar/2$ bound.",
   "tags": [
    "heisenberg"
   ],
   "correctMarks": 5,
   "wrongMarks": 1.25
  },
  {
   "id": "PF-CS-C17",
   "n": 62,
   "part": "C",
   "lane": "thermo",
   "sub": "otto-cycle",
   "type": "MCQ",
   "marks": 5,
   "diff": "standard",
   "stem": "An ideal Otto cycle with compression ratio $r=8$ uses a gas with $\\gamma=1.4$. Its efficiency is closest to",
   "opts": [
    "$71\\%$",
    "$50\\%$",
    "$56.5\\%$",
    "$62\\%$"
   ],
   "ans": 2,
   "sol": "$\\eta=1-r^{1-\\gamma}=1-8^{-0.4}=1-1/2.297=1-0.4353=0.565$, i.e. about $56.5\\%$.",
   "tags": [
    "heat-engine"
   ],
   "correctMarks": 5,
   "wrongMarks": 1.25
  },
  {
   "id": "PF-CS-C18",
   "n": 63,
   "part": "C",
   "lane": "thermo",
   "sub": "radiation",
   "type": "MCQ",
   "marks": 5,
   "diff": "standard",
   "stem": "The entropy of blackbody radiation in a cavity of volume $V=10^{-3}\\,\\mathrm{m^3}$ at $T=1000\\,\\mathrm{K}$ is (with $a=7.566\\times10^{-16}\\,\\mathrm{J\\,m^{-3}\\,K^{-4}}$) approximately",
   "opts": [
    "$3.0\\times10^{-10}\\,\\mathrm{J\\,K^{-1}}$",
    "$4.0\\times10^{-9}\\,\\mathrm{J\\,K^{-1}}$",
    "$1.0\\times10^{-12}\\,\\mathrm{J\\,K^{-1}}$",
    "$1.0\\times10^{-9}\\,\\mathrm{J\\,K^{-1}}$"
   ],
   "ans": 3,
   "sol": "$S=\\tfrac43 aT^3V=\\tfrac43\\times7.566\\times10^{-16}\\times10^{9}\\times10^{-3}=\\tfrac43\\times7.566\\times10^{-10}=1.01\\times10^{-9}\\,\\mathrm{J\\,K^{-1}}$.",
   "tags": [
    "photon-gas"
   ],
   "correctMarks": 5,
   "wrongMarks": 1.25
  },
  {
   "id": "PF-CS-C19",
   "n": 64,
   "part": "C",
   "lane": "thermo",
   "sub": "ideal-gas",
   "type": "MCQ",
   "marks": 5,
   "diff": "standard",
   "stem": "One mole of a diatomic ideal gas (rigid rotator) is heated at constant volume from $300\\,\\mathrm{K}$ to $600\\,\\mathrm{K}$. The change in its internal energy is closest to",
   "opts": [
    "$6.2\\,\\mathrm{kJ}$",
    "$8.7\\,\\mathrm{kJ}$",
    "$12.5\\,\\mathrm{kJ}$",
    "$3.7\\,\\mathrm{kJ}$"
   ],
   "ans": 0,
   "sol": "$\\Delta U=nC_V\\Delta T=1\\times\\tfrac52R\\times300=2.5\\times8.314\\times300=6235\\,\\mathrm{J}=6.2\\,\\mathrm{kJ}$; constant volume means all heat goes into $U$ with $C_V=5R/2$.",
   "tags": [
    "equipartition"
   ],
   "correctMarks": 5,
   "wrongMarks": 1.25
  },
  {
   "id": "PF-CS-C20",
   "n": 65,
   "part": "C",
   "lane": "thermo",
   "sub": "mixing",
   "type": "MCQ",
   "marks": 5,
   "diff": "apex",
   "stem": "One mole of He and one mole of Ar, initially in equal volumes at the same $T$ and $P$, are allowed to mix isothermally. The entropy of mixing is",
   "opts": [
    "$5.76\\,\\mathrm{J\\,K^{-1}}$",
    "$11.53\\,\\mathrm{J\\,K^{-1}}$",
    "$23.05\\,\\mathrm{J\\,K^{-1}}$",
    "$0$ because the gases stay at the same temperature"
   ],
   "ans": 1,
   "sol": "Each gas doubles its accessible volume independently: $\\Delta S=R\\ln2+R\\ln2=2R\\ln2=11.53\\,\\mathrm{J\\,K^{-1}}$. Distinct gases mix irreversibly; identical gases would give zero (Gibbs).",
   "tags": [
    "entropy-of-mixing"
   ],
   "correctMarks": 5,
   "wrongMarks": 1.25
  },
  {
   "id": "PF-CS-C21",
   "n": 66,
   "part": "C",
   "lane": "electronics",
   "sub": "bridges",
   "type": "MCQ",
   "marks": 5,
   "diff": "standard",
   "stem": "A Wheatstone bridge has $R_1=1\\,\\mathrm{k\\Omega}$, $R_2=2\\,\\mathrm{k\\Omega}$ in one arm pair and $R_4=6\\,\\mathrm{k\\Omega}$ opposite to the unknown $R_3$. The value of $R_3$ that balances the bridge is",
   "opts": [
    "$12\\,\\mathrm{k\\Omega}$",
    "$1.5\\,\\mathrm{k\\Omega}$",
    "$3\\,\\mathrm{k\\Omega}$",
    "$6\\,\\mathrm{k\\Omega}$"
   ],
   "ans": 2,
   "sol": "Balance condition $R_1/R_2=R_3/R_4$: $R_3=R_4\\times R_1/R_2=6\\times1/2=3\\,\\mathrm{k\\Omega}$.",
   "tags": [
    "wheatstone"
   ],
   "correctMarks": 5,
   "wrongMarks": 1.25
  },
  {
   "id": "PF-CS-C22",
   "n": 67,
   "part": "C",
   "lane": "electronics",
   "sub": "opamp",
   "type": "MCQ",
   "marks": 5,
   "diff": "standard",
   "stem": "An op-amp has a gain–bandwidth product of $1\\,\\mathrm{MHz}$. Wired as a non-inverting amplifier with closed-loop gain $100$, its small-signal bandwidth is",
   "opts": [
    "$100\\,\\mathrm{kHz}$",
    "$1\\,\\mathrm{MHz}$",
    "$1\\,\\mathrm{kHz}$",
    "$10\\,\\mathrm{kHz}$"
   ],
   "ans": 3,
   "sol": "$GBW=A_{CL}\\times f_{-3dB}$ is constant for dominant-pole roll-off: $f=1\\,\\mathrm{MHz}/100=10\\,\\mathrm{kHz}$.",
   "tags": [
    "gain-bandwidth"
   ],
   "correctMarks": 5,
   "wrongMarks": 1.25
  },
  {
   "id": "PF-CS-C23",
   "n": 68,
   "part": "C",
   "lane": "atnuc",
   "sub": "semf",
   "type": "MCQ",
   "marks": 5,
   "diff": "apex",
   "fig": "nu-semf-curve",
   "stem": "In the semi-empirical mass formula (curve sketched in the figure), the Coulomb term is $-a_cZ^2A^{-1/3}$ with $a_c=0.7\\,\\mathrm{MeV}$. Its magnitude for $^{40}$Ca ($Z=20$, $A=40$) is closest to",
   "opts": [
    "$82\\,\\mathrm{MeV}$",
    "$112\\,\\mathrm{MeV}$",
    "$164\\,\\mathrm{MeV}$",
    "$41\\,\\mathrm{MeV}$"
   ],
   "ans": 0,
   "sol": "$a_cZ^2A^{-1/3}=0.7\\times400/40^{1/3}=280/3.42=81.9\\,\\mathrm{MeV}\\approx82\\,\\mathrm{MeV}$ — the repulsion driving the curve down at large $A$.",
   "tags": [
    "liquid-drop"
   ],
   "correctMarks": 5,
   "wrongMarks": 1.25,
   "figSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1200 700\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\"><defs><marker id=\"m405060\" viewBox=\"0 0 10 10\" refX=\"8\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 z\" fill=\"#405060\"/></marker><marker id=\"m2ea043\" viewBox=\"0 0 10 10\" refX=\"8\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 z\" fill=\"#2ea043\"/></marker><marker id=\"me5534b\" viewBox=\"0 0 10 10\" refX=\"8\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 z\" fill=\"#e5534b\"/></marker></defs><rect x=\"0\" y=\"0\" width=\"1200\" height=\"700\" fill=\"#0b0e13\"/><line x1=\"200\" y1=\"580\" x2=\"1080\" y2=\"580\" stroke=\"#405060\" stroke-width=\"3\" stroke-linecap=\"round\" marker-end=\"url(#m405060)\"/><line x1=\"200\" y1=\"580\" x2=\"200\" y2=\"90\" stroke=\"#405060\" stroke-width=\"3\" stroke-linecap=\"round\" marker-end=\"url(#m405060)\"/><text x=\"1084\" y=\"588\" font-size=\"26\" fill=\"#9db2c8\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">A</text><text x=\"182\" y=\"84\" font-size=\"24\" fill=\"#9db2c8\" text-anchor=\"end\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">B/A (MeV)</text><line x1=\"200\" y1=\"474\" x2=\"1060\" y2=\"474\" stroke=\"#405060\" stroke-width=\"1\" stroke-dasharray=\"3 9\" stroke-linecap=\"round\"/><text x=\"184\" y=\"481\" font-size=\"20\" fill=\"#6b7c8f\" text-anchor=\"end\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">2</text><line x1=\"200\" y1=\"368\" x2=\"1060\" y2=\"368\" stroke=\"#405060\" stroke-width=\"1\" stroke-dasharray=\"3 9\" stroke-linecap=\"round\"/><text x=\"184\" y=\"375\" font-size=\"20\" fill=\"#6b7c8f\" text-anchor=\"end\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">4</text><line x1=\"200\" y1=\"262\" x2=\"1060\" y2=\"262\" stroke=\"#405060\" stroke-width=\"1\" stroke-dasharray=\"3 9\" stroke-linecap=\"round\"/><text x=\"184\" y=\"269\" font-size=\"20\" fill=\"#6b7c8f\" text-anchor=\"end\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">6</text><line x1=\"200\" y1=\"156\" x2=\"1060\" y2=\"156\" stroke=\"#405060\" stroke-width=\"1\" stroke-dasharray=\"3 9\" stroke-linecap=\"round\"/><text x=\"184\" y=\"163\" font-size=\"20\" fill=\"#6b7c8f\" text-anchor=\"end\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">8</text><line x1=\"375\" y1=\"572\" x2=\"375\" y2=\"588\" stroke=\"#405060\" stroke-width=\"2\" stroke-linecap=\"round\"/><text x=\"375\" y=\"614\" font-size=\"20\" fill=\"#6b7c8f\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">50</text><line x1=\"550\" y1=\"572\" x2=\"550\" y2=\"588\" stroke=\"#405060\" stroke-width=\"2\" stroke-linecap=\"round\"/><text x=\"550\" y=\"614\" font-size=\"20\" fill=\"#6b7c8f\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">100</text><line x1=\"725\" y1=\"572\" x2=\"725\" y2=\"588\" stroke=\"#405060\" stroke-width=\"2\" stroke-linecap=\"round\"/><text x=\"725\" y=\"614\" font-size=\"20\" fill=\"#6b7c8f\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">150</text><line x1=\"900\" y1=\"572\" x2=\"900\" y2=\"588\" stroke=\"#405060\" stroke-width=\"2\" stroke-linecap=\"round\"/><text x=\"900\" y=\"614\" font-size=\"20\" fill=\"#6b7c8f\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">200</text><path d=\"M207 521.17 L214 205.29 L221 297.51 L242 172.96 L256 157.06 L294.5 138.51 L340 126.85 L396 114.13 L417 114.13 L462.5 117.31 L567.5 124.73 L690 135.86 L847.5 150.7 L952.5 161.83 L1033 177.73\" fill=\"none\" stroke=\"#d9a441\" stroke-width=\"4\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><circle cx=\"417\" cy=\"114.13\" r=\"8\" fill=\"#e5534b\"/><text x=\"441\" y=\"98.13\" font-size=\"22\" fill=\"#e5534b\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">Fe peak (8.79)</text><circle cx=\"1033\" cy=\"177.73\" r=\"7\" fill=\"#6ea8fe\"/><text x=\"1013\" y=\"159.73\" font-size=\"22\" fill=\"#6ea8fe\" text-anchor=\"end\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">²³⁵U</text><circle cx=\"207\" cy=\"521.17\" r=\"7\" fill=\"#2ea043\"/><text x=\"225\" y=\"547.17\" font-size=\"22\" fill=\"#2ea043\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">²H</text><path d=\"M340 505 C 350 420 370 250 410 130\" fill=\"none\" stroke=\"#2ea043\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\" marker-end=\"url(#m2ea043)\" stroke-dasharray=\"9 7\"/><text x=\"258\" y=\"512\" font-size=\"22\" fill=\"#2ea043\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">fusion</text><path d=\"M990 240 C 860 170 650 115 470 120\" fill=\"none\" stroke=\"#e5534b\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\" marker-end=\"url(#me5534b)\" stroke-dasharray=\"9 7\"/><text x=\"830\" y=\"130\" font-size=\"22\" fill=\"#e5534b\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">fission</text><text x=\"600\" y=\"650\" font-size=\"22\" fill=\"#6b7c8f\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">semi-empirical mass formula — binding per nucleon</text></svg>"
  },
  {
   "id": "PF-CS-C24",
   "n": 69,
   "part": "C",
   "lane": "atnuc",
   "sub": "radioactivity",
   "type": "MCQ",
   "marks": 5,
   "diff": "apex",
   "stem": "The activity of $1\\,\\mathrm{mg}$ of $^{24}$Na (half-life $15\\,\\mathrm{h}$), is closest to",
   "opts": [
    "$1.6\\times10^{14}\\,\\mathrm{Bq}$",
    "$3.2\\times10^{14}\\,\\mathrm{Bq}$",
    "$3.2\\times10^{12}\\,\\mathrm{Bq}$",
    "$8.0\\times10^{13}\\,\\mathrm{Bq}$"
   ],
   "ans": 1,
   "sol": "$N=10^{-3}/24\\times6.022\\times10^{23}=2.51\\times10^{19}$, $\\lambda=\\ln2/(15\\times3600)=1.28\\times10^{-5}\\,\\mathrm{s^{-1}}$, so $A=\\lambda N=3.2\\times10^{14}\\,\\mathrm{Bq}$.",
   "tags": [
    "activity"
   ],
   "correctMarks": 5,
   "wrongMarks": 1.25
  },
  {
   "id": "PF-CS-C25",
   "n": 70,
   "part": "C",
   "lane": "solidstate",
   "sub": "fermi-gas",
   "type": "MCQ",
   "marks": 5,
   "diff": "standard",
   "stem": "A metal has Fermi energy $E_F=5\\,\\mathrm{eV}$. Its Fermi temperature $T_F=E_F/k_B$ is closest to",
   "opts": [
    "$5.8\\times10^{2}\\,\\mathrm{K}$",
    "$5.8\\times10^{3}\\,\\mathrm{K}$",
    "$5.8\\times10^{4}\\,\\mathrm{K}$",
    "$5.8\\times10^{5}\\,\\mathrm{K}$"
   ],
   "ans": 2,
   "sol": "$T_F=5\\,\\mathrm{eV}/(8.617\\times10^{-5}\\,\\mathrm{eV/K})=5.8\\times10^{4}\\,\\mathrm{K}$ — far above melting, which is why $T\\ll T_F$ degeneracy holds in metals.",
   "tags": [
    "degeneracy"
   ],
   "correctMarks": 5,
   "wrongMarks": 1.25
  },
  {
   "id": "PF-CS-C26",
   "n": 71,
   "part": "C",
   "lane": "solidstate",
   "sub": "crystal-structure",
   "type": "MCQ",
   "marks": 5,
   "diff": "standard",
   "stem": "The coordination number (number of nearest neighbours of an atom) in the face-centred cubic structure is",
   "opts": [
    "$14$",
    "$6$",
    "$8$",
    "$12$"
   ],
   "ans": 3,
   "sol": "Each FCC atom touches $12$ face-diagonal neighbours ($4$ in its own plane layer, $4$ above, $4$ below); $8$ is BCC and $6$ simple cubic.",
   "tags": [
    "coordination"
   ],
   "correctMarks": 5,
   "wrongMarks": 1.25
  },
  {
   "id": "PF-CS-C27",
   "n": 72,
   "part": "C",
   "lane": "solidstate",
   "sub": "effective-mass",
   "type": "MCQ",
   "marks": 5,
   "diff": "apex",
   "stem": "Near the bottom of a band the dispersion is $E(k)=E_0+\\alpha k^2$ with $\\alpha=1.0\\times10^{-38}\\,\\mathrm{J\\,m^2}$. The effective mass $m^*=\\hbar^2/(d^2E/dk^2)$ is",
   "opts": [
    "$5.6\\times10^{-31}\\,\\mathrm{kg}$",
    "$1.1\\times10^{-30}\\,\\mathrm{kg}$",
    "$2.2\\times10^{-30}\\,\\mathrm{kg}$",
    "$1.1\\times10^{-31}\\,\\mathrm{kg}$"
   ],
   "ans": 0,
   "sol": "$d^2E/dk^2=2\\alpha$, so $m^*=\\hbar^2/(2\\alpha)=(1.055\\times10^{-34})^2/(2\\times10^{-38})=1.113\\times10^{-68}/(2\\times10^{-38})=5.6\\times10^{-31}\\,\\mathrm{kg}$.",
   "tags": [
    "band-curvature"
   ],
   "correctMarks": 5,
   "wrongMarks": 1.25
  },
  {
   "id": "PF-CS-C28",
   "n": 73,
   "part": "C",
   "lane": "solidstate",
   "sub": "diffraction",
   "type": "MCQ",
   "marks": 5,
   "diff": "standard",
   "stem": "X-rays of wavelength $1.0\\,\\text{\\AA}$ show a second-order Bragg reflection from a set of planes at $\\theta=30^\\circ$. The interplanar spacing is",
   "opts": [
    "$1.0\\,\\text{\\AA}$",
    "$2.0\\,\\text{\\AA}$",
    "$4.0\\,\\text{\\AA}$",
    "$0.5\\,\\text{\\AA}$"
   ],
   "ans": 1,
   "sol": "$n\\lambda=2d\\sin\\theta$ with $n=2$: $d=2\\times1.0/(2\\sin30^\\circ)=2/(2\\times0.5)=2.0\\,\\text{\\AA}$.",
   "tags": [
    "bragg-law"
   ],
   "correctMarks": 5,
   "wrongMarks": 1.25
  },
  {
   "id": "PF-CS-C29",
   "n": 74,
   "part": "C",
   "lane": "electronics",
   "sub": "digital",
   "type": "MCQ",
   "marks": 5,
   "diff": "standard",
   "stem": "A JK flip-flop is wired with $J=K=1$. On every active clock edge, its output $Q$",
   "opts": [
    "stays fixed at $0$",
    "stays fixed at $1$",
    "toggles to its complement",
    "follows the clock waveform exactly"
   ],
   "ans": 2,
   "sol": "$J=K=1$ is the toggle mode: $Q_{next}=\\bar Q$ each active edge — the basic divide-by-two cell of ripple counters.",
   "tags": [
    "flip-flops"
   ],
   "correctMarks": 5,
   "wrongMarks": 1.25
  },
  {
   "id": "PF-CS-C30",
   "n": 75,
   "part": "C",
   "lane": "thermo",
   "sub": "kinetic-theory",
   "type": "MCQ",
   "marks": 5,
   "diff": "standard",
   "stem": "The rms speed of $\\mathrm{O_2}$ molecules (molar mass $0.032\\,\\mathrm{kg/mol}$) at $T=300\\,\\mathrm{K}$ is closest to",
   "opts": [
    "$968\\,\\mathrm{m/s}$",
    "$279\\,\\mathrm{m/s}$",
    "$342\\,\\mathrm{m/s}$",
    "$484\\,\\mathrm{m/s}$"
   ],
   "ans": 3,
   "sol": "$v_{rms}=\\sqrt{3RT/M}=\\sqrt{3\\times8.314\\times300/0.032}=\\sqrt{2.338\\times10^{5}}=484\\,\\mathrm{m/s}$.",
   "tags": [
    "maxwell-distribution"
   ],
   "correctMarks": 5,
   "wrongMarks": 1.25
  }
 ]
};
