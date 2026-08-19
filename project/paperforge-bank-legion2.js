/* 🏭 PAPERFORGE S4 — LEGION II bank (60 originals · AI-GENERATED · double-solved)
   Built by _audit/paperforge/replay_pf2.js — do not hand-edit; edit pf2_p1..pf2_p6.js and replay. */
window.FORGE_BANKS = window.FORGE_BANKS || {};
window.FORGE_BANKS["pf-legion-2"] = {
 "id": "pf-legion-2",
 "label": "🏭 PAPERFORGE — LEGION II · GATE pattern (Quantum · Thermo · Electronics · Atomic/Nuclear · Solid State)",
 "series": "PAPERFORGE",
 "stage": "S4",
 "minted": "2026-08-18",
 "aiGenerated": true,
 "note": "AI-GENERATED original forge bank — zero PYQ photocopies. Every question double-solved (author-solve + audit re-derivation; journal: _audit/paperforge/forge_journal_legion2.md).",
 "durationSec": 9900,
 "totalQ": 60,
 "maxScore": 98,
 "partCounts": {
  "QM": 20,
  "TH": 14,
  "EL": 10,
  "AN": 8,
  "SS": 8
 },
 "typeTally": {
  "MCQ": 35,
  "MSQ": 8,
  "NAT": 17
 },
 "questions": [
  {
   "id": "PF-QM-01",
   "n": 1,
   "lane": "quantum",
   "sub": "square-well",
   "type": "MCQ",
   "marks": 1,
   "diff": "seed",
   "fig": "qm-well-states",
   "stem": "The figure shows the lowest energy levels and wavefunctions of a particle in the infinite well $0<x<L$. For the state $n=2$, the expectation value $\\langle x\\rangle$ is",
   "opts": [
    "$L/2$",
    "$2L/3$",
    "$3L/4$",
    "$L/4$"
   ],
   "ans": 0,
   "sol": "$|\\psi_2|^2$ is symmetric about $x=L/2$, so $\\langle x\\rangle=L/2$ (true for every $n$). Direct check: $\\frac{2}{L}\\int_0^L x\\sin^2(2\\pi x/L)\\,dx=L/2$.",
   "tags": [
    "expectation-value",
    "symmetry"
   ],
   "correctMarks": 1,
   "wrongMarks": 0.333,
   "figSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1200 700\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\"><defs><marker id=\"m405060\" viewBox=\"0 0 10 10\" refX=\"8\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 z\" fill=\"#405060\"/></marker></defs><rect x=\"0\" y=\"0\" width=\"1200\" height=\"700\" fill=\"#0b0e13\"/><line x1=\"330\" y1=\"600\" x2=\"870\" y2=\"600\" stroke=\"#405060\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"870\" y1=\"600\" x2=\"1010\" y2=\"600\" stroke=\"#405060\" stroke-width=\"3\" stroke-linecap=\"round\" marker-end=\"url(#m405060)\"/><text x=\"1020\" y=\"608\" font-size=\"26\" fill=\"#9db2c8\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">x</text><text x=\"330\" y=\"634\" font-size=\"24\" fill=\"#6b7c8f\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">0</text><text x=\"870\" y=\"634\" font-size=\"24\" fill=\"#6b7c8f\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">L</text><line x1=\"330\" y1=\"600\" x2=\"330\" y2=\"90\" stroke=\"#405060\" stroke-width=\"5\" stroke-linecap=\"round\"/><line x1=\"330\" y1=\"580\" x2=\"306\" y2=\"580\" stroke=\"#6b7c8f\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"330\" y1=\"579.86\" x2=\"306\" y2=\"579.86\" stroke=\"#6b7c8f\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"330\" y1=\"579.71\" x2=\"306\" y2=\"579.71\" stroke=\"#6b7c8f\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"330\" y1=\"579.57\" x2=\"306\" y2=\"579.57\" stroke=\"#6b7c8f\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"330\" y1=\"579.43\" x2=\"306\" y2=\"579.43\" stroke=\"#6b7c8f\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"330\" y1=\"579.29\" x2=\"306\" y2=\"579.29\" stroke=\"#6b7c8f\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"330\" y1=\"579.14\" x2=\"306\" y2=\"579.14\" stroke=\"#6b7c8f\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"330\" y1=\"579\" x2=\"306\" y2=\"579\" stroke=\"#6b7c8f\" stroke-width=\"2\" stroke-linecap=\"round\"/><text x=\"304\" y=\"96\" font-size=\"30\" fill=\"#6b7c8f\" text-anchor=\"end\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">∞</text><line x1=\"870\" y1=\"600\" x2=\"870\" y2=\"90\" stroke=\"#405060\" stroke-width=\"5\" stroke-linecap=\"round\"/><line x1=\"870\" y1=\"580\" x2=\"894\" y2=\"580\" stroke=\"#6b7c8f\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"870\" y1=\"579.86\" x2=\"894\" y2=\"579.86\" stroke=\"#6b7c8f\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"870\" y1=\"579.71\" x2=\"894\" y2=\"579.71\" stroke=\"#6b7c8f\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"870\" y1=\"579.57\" x2=\"894\" y2=\"579.57\" stroke=\"#6b7c8f\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"870\" y1=\"579.43\" x2=\"894\" y2=\"579.43\" stroke=\"#6b7c8f\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"870\" y1=\"579.29\" x2=\"894\" y2=\"579.29\" stroke=\"#6b7c8f\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"870\" y1=\"579.14\" x2=\"894\" y2=\"579.14\" stroke=\"#6b7c8f\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"870\" y1=\"579\" x2=\"894\" y2=\"579\" stroke=\"#6b7c8f\" stroke-width=\"2\" stroke-linecap=\"round\"/><text x=\"896\" y=\"96\" font-size=\"30\" fill=\"#6b7c8f\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">∞</text><text x=\"304\" y=\"590\" font-size=\"24\" fill=\"#6b7c8f\" text-anchor=\"end\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">V(x)</text><line x1=\"330\" y1=\"533.89\" x2=\"870\" y2=\"533.89\" stroke=\"#6b7c8f\" stroke-width=\"1\" stroke-dasharray=\"5 9\" stroke-linecap=\"round\"/><path d=\"M330 533.89 L339 532.27 L348 530.65 L357 529.04 L366 527.44 L375 525.87 L384 524.31 L393 522.78 L402 521.28 L411 519.82 L420 518.39 L429 517.01 L438 515.67 L447 514.38 L456 513.15 L465 511.97 L474 510.85 L483 509.8 L492 508.81 L501 507.89 L510 507.04 L519 506.27 L528 505.57 L537 504.95 L546 504.41 L555 503.95 L564 503.57 L573 503.27 L582 503.06 L591 502.93 L600 502.89 L609 502.93 L618 503.06 L627 503.27 L636 503.57 L645 503.95 L654 504.41 L663 504.95 L672 505.57 L681 506.27 L690 507.04 L699 507.89 L708 508.81 L717 509.8 L726 510.85 L735 511.97 L744 513.15 L753 514.38 L762 515.67 L771 517.01 L780 518.39 L789 519.82 L798 521.28 L807 522.78 L816 524.31 L825 525.87 L834 527.44 L843 529.04 L852 530.65 L861 532.27 L870 533.89\" fill=\"none\" stroke=\"#6ea8fe\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><text x=\"906\" y=\"539.89\" font-size=\"22\" fill=\"#6ea8fe\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">n=1</text><text x=\"906\" y=\"565.89\" font-size=\"20\" fill=\"#6b7c8f\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">E₁</text><line x1=\"330\" y1=\"380.56\" x2=\"870\" y2=\"380.56\" stroke=\"#6b7c8f\" stroke-width=\"1\" stroke-dasharray=\"5 9\" stroke-linecap=\"round\"/><path d=\"M330 380.56 L339 377.63 L348 374.73 L357 371.9 L366 369.17 L375 366.56 L384 364.1 L393 361.82 L402 359.75 L411 357.9 L420 356.31 L429 354.98 L438 353.93 L447 353.17 L456 352.71 L465 352.56 L474 352.71 L483 353.17 L492 353.93 L501 354.98 L510 356.31 L519 357.9 L528 359.75 L537 361.82 L546 364.1 L555 366.56 L564 369.17 L573 371.9 L582 374.73 L591 377.63 L600 380.56 L609 383.48 L618 386.38 L627 389.21 L636 391.94 L645 394.56 L654 397.01 L663 399.29 L672 401.36 L681 403.21 L690 404.8 L699 406.13 L708 407.19 L717 407.94 L726 408.4 L735 408.56 L744 408.4 L753 407.94 L762 407.19 L771 406.13 L780 404.8 L789 403.21 L798 401.36 L807 399.29 L816 397.01 L825 394.56 L834 391.94 L843 389.21 L852 386.38 L861 383.48 L870 380.56\" fill=\"none\" stroke=\"#d9a441\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><text x=\"906\" y=\"386.56\" font-size=\"22\" fill=\"#d9a441\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">n=2</text><text x=\"906\" y=\"412.56\" font-size=\"20\" fill=\"#6b7c8f\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">E₂</text><line x1=\"330\" y1=\"125\" x2=\"870\" y2=\"125\" stroke=\"#6b7c8f\" stroke-width=\"1\" stroke-dasharray=\"5 9\" stroke-linecap=\"round\"/><path d=\"M330 125 L339 121.09 L348 117.27 L357 113.65 L366 110.31 L375 107.32 L384 104.77 L393 102.72 L402 101.22 L411 100.31 L420 100 L429 100.31 L438 101.22 L447 102.72 L456 104.77 L465 107.32 L474 110.31 L483 113.65 L492 117.27 L501 121.09 L510 125 L519 128.91 L528 132.73 L537 136.35 L546 139.69 L555 142.68 L564 145.23 L573 147.28 L582 148.78 L591 149.69 L600 150 L609 149.69 L618 148.78 L627 147.28 L636 145.23 L645 142.68 L654 139.69 L663 136.35 L672 132.73 L681 128.91 L690 125 L699 121.09 L708 117.27 L717 113.65 L726 110.31 L735 107.32 L744 104.77 L753 102.72 L762 101.22 L771 100.31 L780 100 L789 100.31 L798 101.22 L807 102.72 L816 104.77 L825 107.32 L834 110.31 L843 113.65 L852 117.27 L861 121.09 L870 125\" fill=\"none\" stroke=\"#2ea043\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><text x=\"906\" y=\"131\" font-size=\"22\" fill=\"#2ea043\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">n=3</text><text x=\"906\" y=\"157\" font-size=\"20\" fill=\"#6b7c8f\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">E₃</text><text x=\"330\" y=\"70\" font-size=\"22\" fill=\"#6b7c8f\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">ψₙ(x) on quantized levels</text></svg>"
  },
  {
   "id": "PF-QM-02",
   "n": 2,
   "lane": "quantum",
   "sub": "operators",
   "type": "MCQ",
   "marks": 1,
   "diff": "seed",
   "stem": "The commutator $[\\hat{x},\\hat{p}^2]$ equals",
   "opts": [
    "$i\\hbar\\hat{p}$",
    "$2i\\hbar\\hat{p}$",
    "$-2i\\hbar\\hat{p}$",
    "$i\\hbar\\hat{p}^2$"
   ],
   "ans": 1,
   "sol": "$[x,p^2]=[x,p]\\,p+p\\,[x,p]=i\\hbar p+i\\hbar p=2i\\hbar p$. Only terms linear in $\\hat p$ survive.",
   "tags": [
    "commutator"
   ],
   "correctMarks": 1,
   "wrongMarks": 0.333
  },
  {
   "id": "PF-QM-03",
   "n": 3,
   "lane": "quantum",
   "sub": "hydrogen",
   "type": "NAT",
   "marks": 1,
   "diff": "standard",
   "stem": "A hydrogen atom makes the transition $n=3\\to n=1$. The energy of the emitted photon, in units of $13.6\\,\\mathrm{eV}$, is",
   "ans": "0.88 to 0.90",
   "sol": "$\\Delta E=13.6(1-1/9)=13.6\\times8/9=12.09\\,\\mathrm{eV}$, which is $0.889$ in units of $13.6\\,\\mathrm{eV}$.",
   "tags": [
    "bohr-levels"
   ],
   "correctMarks": 1,
   "wrongMarks": 0
  },
  {
   "id": "PF-QM-04",
   "n": 4,
   "lane": "quantum",
   "sub": "harmonic-oscillator",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "For the ground state of the one-dimensional harmonic oscillator, the product $\\Delta x\\,\\Delta p$ equals",
   "opts": [
    "$3\\hbar/2$",
    "$\\hbar/4$",
    "$\\hbar/2$",
    "$\\hbar$"
   ],
   "ans": 2,
   "sol": "The Gaussian ground state saturates the Heisenberg bound: $\\Delta x=\\sqrt{\\hbar/(2m\\omega)}$, $\\Delta p=\\sqrt{m\\omega\\hbar/2}$, so $\\Delta x\\Delta p=\\hbar/2$.",
   "tags": [
    "uncertainty"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-QM-05",
   "n": 5,
   "lane": "quantum",
   "sub": "hydrogen",
   "type": "MCQ",
   "marks": 1,
   "diff": "seed",
   "stem": "Ignoring spin, the degeneracy of the hydrogen-atom level with principal quantum number $n=3$ is",
   "opts": [
    "$9$",
    "$18$",
    "$3$",
    "$6$"
   ],
   "ans": 0,
   "sol": "$\\sum_{l=0}^{n-1}(2l+1)=n^2$. For $n=3$: $1+3+5=9$. The factor $2$ from spin is excluded by the question.",
   "tags": [
    "degeneracy"
   ],
   "correctMarks": 1,
   "wrongMarks": 0.333
  },
  {
   "id": "PF-QM-06",
   "n": 6,
   "lane": "quantum",
   "sub": "formalism",
   "type": "MSQ",
   "marks": 2,
   "diff": "standard",
   "stem": "For a bound stationary state $\\psi(x,t)=\\phi(x)\\,e^{-iEt/\\hbar}$ of a one-dimensional Hamiltonian, which of the following statements is/are TRUE?",
   "opts": [
    "$\\langle p\\rangle=0$",
    "The probability density $|\\psi|^2$ is time independent",
    "$\\Delta E=0$",
    "$\\langle x\\rangle$ must vanish"
   ],
   "ans": [
    0,
    1,
    2
   ],
   "sol": "For a discrete eigenstate $\\langle p\\rangle=m\\,d\\langle x\\rangle/dt=0$; the phase cancels in $|\\psi|^2$; an energy eigenstate has zero spread. $\\langle x\\rangle$ need not vanish, e.g. in an asymmetric well.",
   "tags": [
    "stationary-state"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-QM-07",
   "n": 7,
   "lane": "quantum",
   "sub": "box-3d",
   "type": "NAT",
   "marks": 1,
   "diff": "standard",
   "stem": "A particle is confined to a cubical box of side $L$. The degeneracy of the level whose energy is $E=6\\,\\pi^2\\hbar^2/(2mL^2)$ is",
   "ans": "3",
   "sol": "With $E_0=\\pi^2\\hbar^2/(2mL^2)$, $E/E_0=n_x^2+n_y^2+n_z^2=6=4+1+1$, so $(n_x,n_y,n_z)$ is a permutation of $(2,1,1)$: exactly $3$ states.",
   "tags": [
    "degeneracy",
    "3d-box"
   ],
   "correctMarks": 1,
   "wrongMarks": 0
  },
  {
   "id": "PF-QM-08",
   "n": 8,
   "lane": "quantum",
   "sub": "spin",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "A spin-$\\frac{1}{2}$ particle is prepared in the eigenstate $|S_z;+\\rangle$. A measurement of $S_x$ yields $+\\hbar/2$ with probability",
   "opts": [
    "$1/3$",
    "$1/2$",
    "$1$",
    "$1/4$"
   ],
   "ans": 1,
   "sol": "$|+x\\rangle=(|+z\\rangle+|-z\\rangle)/\\sqrt{2}$, hence $P=|\\langle+x|+z\\rangle|^2=1/2$.",
   "tags": [
    "spin-half",
    "measurement"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-QM-09",
   "n": 9,
   "lane": "quantum",
   "sub": "harmonic-oscillator",
   "type": "MCQ",
   "marks": 1,
   "diff": "seed",
   "stem": "For the harmonic-oscillator ladder operators, the commutator $[\\hat{a},\\hat{a}^\\dagger]$ equals",
   "opts": [
    "$i\\hbar$",
    "$0$",
    "$1$",
    "$-1$"
   ],
   "ans": 2,
   "sol": "With $\\hat a=(m\\omega\\hat x+i\\hat p)/\\sqrt{2m\\omega\\hbar}$ and $[\\hat x,\\hat p]=i\\hbar$, direct expansion gives $[\\hat a,\\hat a^\\dagger]=1$.",
   "tags": [
    "ladder-operators"
   ],
   "correctMarks": 1,
   "wrongMarks": 0.333
  },
  {
   "id": "PF-QM-10",
   "n": 10,
   "lane": "quantum",
   "sub": "harmonic-oscillator",
   "type": "NAT",
   "marks": 2,
   "diff": "apex",
   "stem": "A harmonic oscillator with $\\hbar\\omega=1\\,\\mathrm{eV}$ is in the eigenstate $n=2$. The expectation value of its kinetic energy, in eV, is",
   "ans": "1.25",
   "sol": "Virial theorem for the oscillator: $\\langle T\\rangle=E_n/2=(n+\\tfrac12)\\hbar\\omega/2=(2.5\\,\\mathrm{eV})/2=1.25\\,\\mathrm{eV}$.",
   "tags": [
    "virial",
    "kinetic-energy"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-QM-11",
   "n": 11,
   "lane": "quantum",
   "sub": "de-broglie",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "An electron is accelerated from rest through a potential difference of $100\\,\\mathrm{V}$. Its de Broglie wavelength is approximately",
   "opts": [
    "$1.23\\,\\mathrm{nm}$",
    "$12.3\\,\\mathrm{nm}$",
    "$0.0123\\,\\mathrm{nm}$",
    "$0.123\\,\\mathrm{nm}$"
   ],
   "ans": 3,
   "sol": "$\\lambda=h/\\sqrt{2meV}=12.27/\\sqrt{V}$ in angstrom, so $\\lambda=12.27/10\\,\\text{\\AA}=0.123\\,\\mathrm{nm}$.",
   "tags": [
    "de-broglie"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-QM-12",
   "n": 12,
   "lane": "quantum",
   "sub": "tunneling",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "A particle with $E<V_0$ crosses a rectangular barrier of width $a$ with transmission $T\\approx e^{-2\\kappa a}$, $\\kappa=\\sqrt{2m(V_0-E)}/\\hbar$. If the barrier width is doubled (everything else unchanged), the transmission becomes approximately",
   "opts": [
    "$T^2$",
    "$2T$",
    "$\\sqrt{T}$",
    "$T/2$"
   ],
   "ans": 0,
   "sol": "$T(a)\\sim e^{-2\\kappa a}$ so $T(2a)=e^{-4\\kappa a}=T^2$: tunneling probability is exponentially sensitive to width.",
   "tags": [
    "tunneling",
    "wkb"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-QM-13",
   "n": 13,
   "lane": "quantum",
   "sub": "formalism",
   "type": "MSQ",
   "marks": 2,
   "diff": "standard",
   "stem": "Which statements about a Hermitian operator $\\hat{A}$ on a finite-dimensional Hilbert space is/are TRUE?",
   "opts": [
    "All eigenvalues of $\\hat{A}$ are real",
    "Eigenvectors belonging to distinct eigenvalues are orthogonal",
    "The eigenvectors of $\\hat{A}$ can be chosen as a complete orthonormal basis",
    "$\\hat{A}\\hat{B}$ is Hermitian for every Hermitian $\\hat{B}$"
   ],
   "ans": [
    0,
    1,
    2
   ],
   "sol": "The spectral theorem gives the first three. The product fails in general: $(AB)^\\dagger=BA\\neq AB$ unless $A$ and $B$ commute.",
   "tags": [
    "hermitian",
    "spectral-theorem"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-QM-14",
   "n": 14,
   "lane": "quantum",
   "sub": "hydrogen",
   "type": "NAT",
   "marks": 2,
   "diff": "standard",
   "stem": "For the hydrogen ground state ($1s$ orbital), the ratio $\\langle r\\rangle/a_0$ equals",
   "ans": "1.5",
   "sol": "With $\\psi_{1s}=(\\pi a_0^3)^{-1/2}e^{-r/a_0}$: $\\langle r\\rangle=\\int_0^\\infty 4\\pi r^3|\\psi_{1s}|^2\\,dr=\\frac{3}{2}a_0$, so the ratio is $1.5$.",
   "tags": [
    "expectation-value",
    "hydrogen-1s"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-QM-15",
   "n": 15,
   "lane": "quantum",
   "sub": "perturbation",
   "type": "MCQ",
   "marks": 2,
   "diff": "apex",
   "stem": "A particle sits in the ground state of the infinite well $0<x<L$. A weak perturbation $H^{\\prime}=\\epsilon\\,\\delta(x-L/2)$ is switched on. The first-order shift of the ground-state energy is",
   "opts": [
    "$\\epsilon/L$",
    "$2\\epsilon/L$",
    "$\\epsilon/(2L)$",
    "$0$"
   ],
   "ans": 1,
   "sol": "$\\Delta E^{(1)}=\\langle 1|H^{\\prime}|1\\rangle=\\epsilon\\,|\\psi_1(L/2)|^2=\\epsilon\\cdot\\frac{2}{L}\\sin^2(\\pi/2)=2\\epsilon/L$.",
   "tags": [
    "first-order-shift"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-QM-16",
   "n": 16,
   "lane": "quantum",
   "sub": "identical-particles",
   "type": "MCQ",
   "marks": 2,
   "diff": "apex",
   "stem": "Two non-interacting identical spin-$\\frac{1}{2}$ fermions are placed in the infinite well $0<x<L$; let $E_1=\\pi^2\\hbar^2/(2mL^2)$ be the one-particle ground energy. The ground-state energy of the two-fermion system is",
   "opts": [
    "$4E_1$",
    "$E_1$",
    "$2E_1$",
    "$3E_1$"
   ],
   "ans": 2,
   "sol": "The spin singlet lets both fermions occupy $n=1$ with an antisymmetric spin state, giving $E=2E_1$. Forcing antisymmetry in space would push one particle to $n=2$, costing $5E_1$.",
   "tags": [
    "fermions",
    "pauli"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-QM-17",
   "n": 17,
   "lane": "quantum",
   "sub": "symmetry",
   "type": "MSQ",
   "marks": 2,
   "diff": "standard",
   "stem": "For the Hamiltonian $H=\\hat{p}^2/2m+V(r)$ with a central potential $V(r)$ and no spin-orbit coupling, which quantities is/are constants of motion?",
   "opts": [
    "Every component $L_i$ of orbital angular momentum",
    "$\\hat{L}^2$",
    "Parity",
    "The linear-momentum component $p_x$"
   ],
   "ans": [
    0,
    1,
    2
   ],
   "sol": "Rotational invariance gives $[H,L_i]=[H,L^2]=0$, and $V(r)$ is parity-even. Translation invariance is broken by $V(r)$, so $p_x$ is not conserved.",
   "tags": [
    "conservation-laws"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-QM-18",
   "n": 18,
   "lane": "quantum",
   "sub": "square-well",
   "type": "NAT",
   "marks": 2,
   "diff": "standard",
   "stem": "A particle in the infinite well $0<x<L$ occupies the state $n=1$. The probability of finding it in the middle half of the well, $L/4<x<3L/4$, is",
   "ans": "0.80 to 0.83",
   "sol": "$P=\\frac{2}{L}\\int_{L/4}^{3L/4}\\sin^2(\\pi x/L)\\,dx=\\tfrac12+\\tfrac{1}{\\pi}\\sin(\\pi/2)=0.5+0.3183=0.8183$.",
   "tags": [
    "probability-density"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-QM-19",
   "n": 19,
   "lane": "quantum",
   "sub": "selection-rules",
   "type": "MCQ",
   "marks": 1,
   "diff": "seed",
   "stem": "Which hydrogen-atom transition is allowed as an electric-dipole ($E1$) transition?",
   "opts": [
    "$3d\\to2s$",
    "$1s\\to1s$",
    "$2s\\to1s$",
    "$2p\\to1s$"
   ],
   "ans": 3,
   "sol": "$E1$ requires $\\Delta l=\\pm1$ (with parity change). Only $2p\\to1s$ has $\\Delta l=-1$; the others violate the rule.",
   "tags": [
    "dipole-transition"
   ],
   "correctMarks": 1,
   "wrongMarks": 0.333
  },
  {
   "id": "PF-QM-20",
   "n": 20,
   "lane": "quantum",
   "sub": "spin",
   "type": "MCQ",
   "marks": 2,
   "diff": "apex",
   "stem": "A spin-$\\frac{1}{2}$ particle of gyromagnetic ratio $\\gamma$ sits in a static field $B\\hat{z}$, initialized in $|S_x;+\\rangle$; write $\\omega=\\gamma B$. At time $t=\\pi/(2\\omega)$, an $S_x$ measurement again yields $+\\hbar/2$ with probability",
   "opts": [
    "$1/2$",
    "$1/4$",
    "$0$",
    "$1$"
   ],
   "ans": 0,
   "sol": "The spin precesses in the $xy$-plane; the return probability is $P=\\cos^2(\\omega t/2)=\\cos^2(\\pi/4)=1/2$.",
   "tags": [
    "larmor-precession"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-TH-21",
   "n": 21,
   "lane": "thermo",
   "sub": "carnot",
   "type": "MCQ",
   "marks": 1,
   "diff": "seed",
   "fig": "th-carnot-pv",
   "stem": "The figure shows a Carnot cycle drawn in the $P$–$V$ plane. The area enclosed by the loop equals, per cycle,",
   "opts": [
    "the heat absorbed from the hot reservoir",
    "the net work done by the gas",
    "the entropy delivered to the cold reservoir",
    "zero, because the cycle is reversible"
   ],
   "ans": 1,
   "sol": "$W=\\oint P\\,dV$ is literally the loop area. It is nonzero; reversibility is a statement about entropy generation, not about the enclosed area.",
   "tags": [
    "carnot",
    "pv-diagram"
   ],
   "correctMarks": 1,
   "wrongMarks": 0.333,
   "figSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1200 700\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\"><defs><marker id=\"m405060\" viewBox=\"0 0 10 10\" refX=\"8\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 z\" fill=\"#405060\"/></marker><marker id=\"me5534b\" viewBox=\"0 0 10 10\" refX=\"8\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 z\" fill=\"#e5534b\"/></marker><marker id=\"m6ea8fe\" viewBox=\"0 0 10 10\" refX=\"8\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 z\" fill=\"#6ea8fe\"/></marker><marker id=\"md9a441\" viewBox=\"0 0 10 10\" refX=\"8\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 z\" fill=\"#d9a441\"/></marker></defs><rect x=\"0\" y=\"0\" width=\"1200\" height=\"700\" fill=\"#0b0e13\"/><line x1=\"230\" y1=\"580\" x2=\"1090\" y2=\"580\" stroke=\"#405060\" stroke-width=\"3\" stroke-linecap=\"round\" marker-end=\"url(#m405060)\"/><line x1=\"230\" y1=\"580\" x2=\"230\" y2=\"110\" stroke=\"#405060\" stroke-width=\"3\" stroke-linecap=\"round\" marker-end=\"url(#m405060)\"/><text x=\"1094\" y=\"588\" font-size=\"26\" fill=\"#9db2c8\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">V</text><text x=\"214\" y=\"104\" font-size=\"26\" fill=\"#9db2c8\" text-anchor=\"end\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">P</text><path d=\"M330 205 C 430 230 545 272 690 345\" fill=\"none\" stroke=\"#e5534b\" stroke-width=\"4\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><path d=\"M565 505 C 690 468 830 448 990 444\" fill=\"none\" stroke=\"#6ea8fe\" stroke-width=\"4\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><path d=\"M612 318 C 745 372 845 415 915 449\" fill=\"none\" stroke=\"#d9a441\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\" stroke-dasharray=\"10 8\"/><path d=\"M622 484 C 545 445 460 350 388 218\" fill=\"none\" stroke=\"#d9a441\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\" stroke-dasharray=\"10 8\"/><circle cx=\"388\" cy=\"218\" r=\"7\" fill=\"#9db2c8\"/><text x=\"358\" y=\"206\" font-size=\"26\" fill=\"#9db2c8\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\" font-weight=\"bold\">1</text><circle cx=\"612\" cy=\"318\" r=\"7\" fill=\"#9db2c8\"/><text x=\"634\" y=\"304\" font-size=\"26\" fill=\"#9db2c8\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\" font-weight=\"bold\">2</text><circle cx=\"915\" cy=\"449\" r=\"7\" fill=\"#9db2c8\"/><text x=\"939\" y=\"453\" font-size=\"26\" fill=\"#9db2c8\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\" font-weight=\"bold\">3</text><circle cx=\"622\" cy=\"484\" r=\"7\" fill=\"#9db2c8\"/><text x=\"588\" y=\"494\" font-size=\"26\" fill=\"#9db2c8\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\" font-weight=\"bold\">4</text><path d=\"M455 237 C 505 257 545 274 590 292\" fill=\"none\" stroke=\"#e5534b\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\" marker-end=\"url(#me5534b)\"/><path d=\"M860 452 C 800 456 745 462 690 470\" fill=\"none\" stroke=\"#6ea8fe\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\" marker-end=\"url(#m6ea8fe)\"/><path d=\"M742 372 C 792 394 838 416 872 433\" fill=\"none\" stroke=\"#d9a441\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\" marker-end=\"url(#md9a441)\"/><path d=\"M520 424 C 490 380 460 330 432 280\" fill=\"none\" stroke=\"#d9a441\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\" marker-end=\"url(#md9a441)\"/><text x=\"742\" y=\"336\" font-size=\"22\" fill=\"#e5534b\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">isotherm T_H</text><text x=\"1000\" y=\"470\" font-size=\"22\" fill=\"#6ea8fe\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">T_C</text><text x=\"296\" y=\"176\" font-size=\"22\" fill=\"#d9a441\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">adiabats (dashed)</text><text x=\"600\" y=\"650\" font-size=\"22\" fill=\"#6b7c8f\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">Carnot cycle — 1→2 isothermal, 2→3 adiabatic</text></svg>"
  },
  {
   "id": "PF-TH-22",
   "n": 22,
   "lane": "thermo",
   "sub": "entropy",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "One mole of an ideal gas expands isothermally to twice its initial volume. The entropy change of the gas is",
   "opts": [
    "$11.53\\,\\mathrm{J\\,K^{-1}}$",
    "$2.88\\,\\mathrm{J\\,K^{-1}}$",
    "$5.76\\,\\mathrm{J\\,K^{-1}}$",
    "$8.31\\,\\mathrm{J\\,K^{-1}}$"
   ],
   "ans": 2,
   "sol": "$\\Delta S=nR\\ln(V_f/V_i)=R\\ln2=8.314\\times0.6931=5.76\\,\\mathrm{J\\,K^{-1}}$. The temperature ($300\\,\\mathrm{K}$ or any other) drops out of the result.",
   "tags": [
    "isothermal",
    "entropy"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-TH-23",
   "n": 23,
   "lane": "thermo",
   "sub": "radiation",
   "type": "NAT",
   "marks": 2,
   "diff": "standard",
   "stem": "Blackbody radiation fills an evacuated cavity held at $T=10^{4}\\,\\mathrm{K}$. Using the radiation constant $a=7.566\\times10^{-16}\\,\\mathrm{J\\,m^{-3}\\,K^{-4}}$, the radiation pressure on the cavity walls, in $\\mathrm{N\\,m^{-2}}$, is",
   "ans": "2.45 to 2.60",
   "sol": "$p=u/3=aT^4/3=7.566\\times10^{-16}\\times10^{16}/3=7.566/3=2.522\\,\\mathrm{N\\,m^{-2}}$. The factor $1/3$ is the photon equation of state.",
   "tags": [
    "blackbody",
    "pressure"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-TH-24",
   "n": 24,
   "lane": "thermo",
   "sub": "maxwell-relations",
   "type": "MCQ",
   "marks": 1,
   "diff": "standard",
   "stem": "Which Maxwell relation follows from the Gibbs free energy $G(T,P)$?",
   "opts": [
    "$(\\partial S/\\partial P)_T=(\\partial V/\\partial T)_P$",
    "$(\\partial S/\\partial V)_T=(\\partial P/\\partial T)_V$",
    "$(\\partial T/\\partial V)_S=-(\\partial P/\\partial S)_V$",
    "$(\\partial S/\\partial P)_T=-(\\partial V/\\partial T)_P$"
   ],
   "ans": 3,
   "sol": "From $dG=-S\\,dT+V\\,dP$, equality of mixed partials gives $(\\partial S/\\partial P)_T=-(\\partial V/\\partial T)_P$. The third option comes from the Helmholtz energy $F(T,V)$, the fourth from $U(S,V)$.",
   "tags": [
    "maxwell-relations"
   ],
   "correctMarks": 1,
   "wrongMarks": 0.333
  },
  {
   "id": "PF-TH-25",
   "n": 25,
   "lane": "thermo",
   "sub": "second-law",
   "type": "MSQ",
   "marks": 2,
   "diff": "standard",
   "stem": "Which statements is/are consistent with the second law of thermodynamics?",
   "opts": [
    "No cyclic engine can convert heat drawn from a single reservoir entirely into work (Kelvin–Planck)",
    "Heat cannot by itself flow from a colder body to a hotter one (Clausius)",
    "The entropy of an isolated system never decreases",
    "A Carnot engine working between two reservoirs can exceed the efficiency $1-T_c/T_h$"
   ],
   "ans": [
    0,
    1,
    2
   ],
   "sol": "The first three are the classic equivalent statements. Carnot efficiency is the universality bound; beating it would violate the second law.",
   "tags": [
    "second-law"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-TH-26",
   "n": 26,
   "lane": "thermo",
   "sub": "fermi-gas",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "For a three-dimensional free-electron gas, $E_F\\propto n^{2/3}$. If the electron number density is increased by a factor of $8$, the Fermi energy is multiplied by",
   "opts": [
    "$4$",
    "$8$",
    "$16$",
    "$2$"
   ],
   "ans": 0,
   "sol": "$E_F\\propto n^{2/3}$ gives the factor $8^{2/3}=4$. Squaring $k_F$ (which doubles) is the quick route to the same answer.",
   "tags": [
    "fermi-energy",
    "scaling"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-TH-27",
   "n": 27,
   "lane": "thermo",
   "sub": "einstein-solid",
   "type": "NAT",
   "marks": 2,
   "diff": "apex",
   "stem": "A monatomic Einstein solid contains one mole of atoms (three independent oscillators each) with $\\hbar\\omega/k_B=100\\,\\mathrm{K}$. At $T=300\\,\\mathrm{K}$, the molar heat capacity ratio $C_V/R$ is",
   "ans": "2.94 to 3.00",
   "sol": "$C_V=3R\\,x^2e^x/(e^x-1)^2$ with $x=100/300=1/3$: the Einstein factor is $0.9907$, so $C_V/R=3\\times0.9907=2.972$.",
   "tags": [
    "einstein-model",
    "heat-capacity"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-TH-28",
   "n": 28,
   "lane": "thermo",
   "sub": "two-level",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "A two-level system has energies $0$ and $\\epsilon$. In thermal equilibrium at the temperature for which $\\epsilon/k_BT=1$, its mean energy is",
   "opts": [
    "$\\epsilon$",
    "$0.269\\,\\epsilon$",
    "$0.500\\,\\epsilon$",
    "$0.731\\,\\epsilon$"
   ],
   "ans": 1,
   "sol": "$Z=1+e^{-1}$ and $\\langle E\\rangle=\\epsilon e^{-1}/Z=\\epsilon/(e+1)=0.269\\,\\epsilon$. The distractors are the high-$T$ limit and $1-0.269$.",
   "tags": [
    "partition-function"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-TH-29",
   "n": 29,
   "lane": "thermo",
   "sub": "gibbs-paradox",
   "type": "MCQ",
   "marks": 1,
   "diff": "standard",
   "stem": "The Gibbs paradox in the entropy of mixing is resolved within classical statistics by",
   "opts": [
    "adding anharmonic corrections to the interaction potential",
    "quantizing the allowed energy levels",
    "dividing the phase-space volume by $N!$ for indistinguishable particles",
    "including relativistic corrections to the dispersion relation"
   ],
   "ans": 2,
   "sol": "The $1/N!$ factor recognizes that permuting identical particles is not a new microstate; mixing identical gases then carries zero entropy change and extensivity is restored.",
   "tags": [
    "gibbs-paradox",
    "correct-boltzmann-counting"
   ],
   "correctMarks": 1,
   "wrongMarks": 0.333
  },
  {
   "id": "PF-TH-30",
   "n": 30,
   "lane": "thermo",
   "sub": "phase-transitions",
   "type": "MSQ",
   "marks": 2,
   "diff": "apex",
   "stem": "Which statements about phase transitions is/are TRUE?",
   "opts": [
    "A first-order transition absorbs or releases latent heat",
    "At a continuous transition a response function (susceptibility) can diverge",
    "Mean-field theory yields the order-parameter exponent $\\beta=\\tfrac12$",
    "The two-dimensional Ising model on a square lattice has no finite-temperature phase transition"
   ],
   "ans": [
    0,
    1,
    2
   ],
   "sol": "Latent heat, diverging fluctuations and $\\beta=1/2$ are textbook results. Onsager’s exact solution gives the 2D Ising model a genuine ordering transition at finite $T_c$, so the last claim fails.",
   "tags": [
    "ising",
    "critical-phenomena"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-TH-31",
   "n": 31,
   "lane": "thermo",
   "sub": "van-der-waals",
   "type": "NAT",
   "marks": 2,
   "diff": "standard",
   "stem": "A van der Waals gas has $a=0.364\\,\\mathrm{Pa\\,m^6\\,mol^{-2}}$ and $b=4.27\\times10^{-5}\\,\\mathrm{m^3\\,mol^{-1}}$. Its critical temperature $T_c=8a/(27Rb)$, in kelvin, is",
   "ans": "301 to 306",
   "sol": "$T_c=8\\times0.364/(27\\times8.314\\times4.27\\times10^{-5})=2.912/9.585\\times10^{3}=303.8\\,\\mathrm{K}$.",
   "tags": [
    "critical-point"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-TH-32",
   "n": 32,
   "lane": "thermo",
   "sub": "maxwell-distribution",
   "type": "MCQ",
   "marks": 1,
   "diff": "seed",
   "stem": "An ideal Maxwell gas is heated so that its absolute temperature quadruples. The most probable speed $v_p=\\sqrt{2k_BT/m}$ is multiplied by",
   "opts": [
    "$4$",
    "$16$",
    "$\\sqrt{2}$",
    "$2$"
   ],
   "ans": 3,
   "sol": "$v_p\\propto\\sqrt{T}$, and $\\sqrt{4}=2$. The same factor applies to $\\bar v$ and $v_{rms}$ by the common $\\sqrt{T}$ scaling.",
   "tags": [
    "speed-distribution"
   ],
   "correctMarks": 1,
   "wrongMarks": 0.333
  },
  {
   "id": "PF-TH-33",
   "n": 33,
   "lane": "thermo",
   "sub": "equipartition",
   "type": "NAT",
   "marks": 1,
   "diff": "standard",
   "stem": "Using $k_B=8.617\\times10^{-2}\\,\\mathrm{meV\\,K^{-1}}$, the mean translational kinetic energy per molecule of a monatomic ideal gas at $T=300\\,\\mathrm{K}$, in meV, is",
   "ans": "38.3 to 39.3",
   "sol": "$\\langle K\\rangle=\\tfrac32 k_BT=1.5\\times8.617\\times10^{-2}\\times300=38.78\\,\\mathrm{meV}$.",
   "tags": [
    "equipartition"
   ],
   "correctMarks": 1,
   "wrongMarks": 0
  },
  {
   "id": "PF-TH-34",
   "n": 34,
   "lane": "thermo",
   "sub": "free-expansion",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "An ideal gas undergoes free (Joule) expansion into an evacuated chamber, doubling its volume. Regarding its temperature, the gas",
   "opts": [
    "shows zero temperature change",
    "warms, because its entropy rises",
    "oscillates in temperature until equilibrium sets in",
    "cools, because it pushes back the vacuum"
   ],
   "ans": 0,
   "sol": "Against vacuum $W=0$, and with insulating walls $Q=0$, so $\\Delta U=0$; for an ideal gas $U$ depends only on $T$, hence $\\Delta T=0$ while $\\Delta S=nR\\ln2>0$.",
   "tags": [
    "joule-expansion"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-EL-35",
   "n": 35,
   "lane": "electronics",
   "sub": "opamp",
   "type": "MCQ",
   "marks": 1,
   "diff": "seed",
   "stem": "An ideal op-amp in a negative-feedback amplifier is analyzed using which pair of rules?",
   "opts": [
    "the output current is zero, and the open-loop gain is zero",
    "the inputs draw no current, and feedback forces the two input voltages equal",
    "the inputs draw no current, and the output is always saturated",
    "the two inputs are joined by a real short, and the gain is infinite at all frequencies"
   ],
   "ans": 1,
   "sol": "Golden rules: $i_+=i_-=0$, and negative feedback enforces the virtual short $v_+=v_-$. Saturation is a failure mode, not an analysis rule.",
   "tags": [
    "golden-rules"
   ],
   "correctMarks": 1,
   "wrongMarks": 0.333
  },
  {
   "id": "PF-EL-36",
   "n": 36,
   "lane": "electronics",
   "sub": "opamp",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "fig": "el-opamp-inverting",
   "stem": "In the inverting amplifier of the figure, $R_{in}=10\\,\\mathrm{k\\Omega}$ and $R_f=100\\,\\mathrm{k\\Omega}$. With $v_{in}=+0.5\\,\\mathrm{V}$, the output $v_{out}$ is",
   "opts": [
    "$-0.05\\,\\mathrm{V}$",
    "$+50\\,\\mathrm{V}$",
    "$-5\\,\\mathrm{V}$",
    "$+5\\,\\mathrm{V}$"
   ],
   "ans": 2,
   "sol": "Virtual earth at the inverting node: $v_{out}=-(R_f/R_{in})\\,v_{in}=-10\\times0.5=-5\\,\\mathrm{V}$. The sign flip is what makes the amplifier inverting.",
   "tags": [
    "inverting-amplifier"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667,
   "figSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1200 700\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\"><rect x=\"0\" y=\"0\" width=\"1200\" height=\"700\" fill=\"#0b0e13\"/><path d=\"M560 250 L560 490 L800 370 Z\" fill=\"none\" stroke=\"#6ea8fe\" stroke-width=\"4\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><text x=\"600\" y=\"306\" font-size=\"30\" fill=\"#9db2c8\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">−</text><text x=\"600\" y=\"452\" font-size=\"28\" fill=\"#9db2c8\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">+</text><circle cx=\"205\" cy=\"300\" r=\"9\" fill=\"none\" stroke=\"#9db2c8\" stroke-width=\"3\"/><text x=\"190\" y=\"262\" font-size=\"24\" fill=\"#9db2c8\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">V_in</text><line x1=\"214\" y1=\"300\" x2=\"315\" y2=\"300\" stroke=\"#9db2c8\" stroke-width=\"3\" stroke-linecap=\"round\"/><path d=\"M315 300 L328.33 315 L341.67 285 L355 315 L368.33 285 L381.67 315 L395 285 L408.33 315 L421.67 285 L435 315 L448.33 285 L461.67 315 L475 300\" fill=\"none\" stroke=\"#d9a441\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><line x1=\"475\" y1=\"300\" x2=\"560\" y2=\"300\" stroke=\"#9db2c8\" stroke-width=\"3\" stroke-linecap=\"round\"/><circle cx=\"475\" cy=\"300\" r=\"6\" fill=\"#9db2c8\"/><text x=\"395\" y=\"268\" font-size=\"24\" fill=\"#d9a441\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">R_in</text><line x1=\"560\" y1=\"440\" x2=\"490\" y2=\"440\" stroke=\"#9db2c8\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"490\" y1=\"440\" x2=\"490\" y2=\"515\" stroke=\"#9db2c8\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"490\" y1=\"515\" x2=\"490\" y2=\"541\" stroke=\"#9db2c8\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"456\" y1=\"541\" x2=\"524\" y2=\"541\" stroke=\"#9db2c8\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"468\" y1=\"552\" x2=\"512\" y2=\"552\" stroke=\"#9db2c8\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"480\" y1=\"563\" x2=\"500\" y2=\"563\" stroke=\"#9db2c8\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"475\" y1=\"300\" x2=\"475\" y2=\"185\" stroke=\"#9db2c8\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"475\" y1=\"185\" x2=\"520\" y2=\"185\" stroke=\"#9db2c8\" stroke-width=\"3\" stroke-linecap=\"round\"/><path d=\"M520 185 L534.17 200 L548.33 170 L562.5 200 L576.67 170 L590.83 200 L605 170 L619.17 200 L633.33 170 L647.5 200 L661.67 170 L675.83 200 L690 185\" fill=\"none\" stroke=\"#d9a441\" stroke-width=\"3\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><line x1=\"690\" y1=\"185\" x2=\"850\" y2=\"185\" stroke=\"#9db2c8\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"850\" y1=\"185\" x2=\"850\" y2=\"370\" stroke=\"#9db2c8\" stroke-width=\"3\" stroke-linecap=\"round\"/><text x=\"605\" y=\"152\" font-size=\"24\" fill=\"#d9a441\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">R_f</text><line x1=\"800\" y1=\"370\" x2=\"920\" y2=\"370\" stroke=\"#9db2c8\" stroke-width=\"3\" stroke-linecap=\"round\"/><circle cx=\"850\" cy=\"370\" r=\"6\" fill=\"#9db2c8\"/><circle cx=\"925\" cy=\"370\" r=\"9\" fill=\"none\" stroke=\"#9db2c8\" stroke-width=\"3\"/><text x=\"948\" y=\"378\" font-size=\"24\" fill=\"#9db2c8\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">V_out</text><text x=\"600\" y=\"600\" font-size=\"24\" fill=\"#6b7c8f\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">A_v = −R_f/R_in   (10 kΩ → 100 kΩ)</text><text x=\"600\" y=\"80\" font-size=\"22\" fill=\"#6b7c8f\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">inverting amplifier</text></svg>"
  },
  {
   "id": "PF-EL-37",
   "n": 37,
   "lane": "electronics",
   "sub": "filters",
   "type": "NAT",
   "marks": 2,
   "diff": "standard",
   "stem": "A first-order $RC$ low-pass filter uses $R=1.59\\,\\mathrm{k\\Omega}$ and $C=100\\,\\mathrm{nF}$. Its $-3\\,\\mathrm{dB}$ cutoff frequency, in Hz, is",
   "ans": "990 to 1012",
   "sol": "$f_c=1/(2\\pi RC)=1/(2\\pi\\times1590\\times10^{-7})=1001\\,\\mathrm{Hz}$.",
   "tags": [
    "cutoff-frequency"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-EL-38",
   "n": 38,
   "lane": "electronics",
   "sub": "diode",
   "type": "MCQ",
   "marks": 1,
   "diff": "seed",
   "stem": "A silicon diode (forward drop $0.7\\,\\mathrm{V}$) is wired in series with a $1\\,\\mathrm{k\\Omega}$ resistor across a $5\\,\\mathrm{V}$ supply. The forward current is approximately",
   "opts": [
    "$5.0\\,\\mathrm{mA}$",
    "$4.3\\,\\mu\\mathrm{A}$",
    "$0.7\\,\\mathrm{mA}$",
    "$4.3\\,\\mathrm{mA}$"
   ],
   "ans": 3,
   "sol": "$I=(5-0.7)/(1\\,\\mathrm{k\\Omega})=4.3\\,\\mathrm{mA}$. Ignoring the diode drop (the $5.0\\,\\mathrm{mA}$ answer) overstates the current.",
   "tags": [
    "diode-circuit"
   ],
   "correctMarks": 1,
   "wrongMarks": 0.333
  },
  {
   "id": "PF-EL-39",
   "n": 39,
   "lane": "electronics",
   "sub": "bjt",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "An $npn$ transistor biased in the active region has $\\beta=100$ and base current $I_B=20\\,\\mu\\mathrm{A}$. Its collector current is",
   "opts": [
    "$2\\,\\mathrm{mA}$",
    "$20\\,\\mathrm{mA}$",
    "$200\\,\\mathrm{mA}$",
    "$0.2\\,\\mathrm{mA}$"
   ],
   "ans": 0,
   "sol": "$I_C=\\beta I_B=100\\times20\\,\\mu\\mathrm{A}=2\\,\\mathrm{mA}$, valid while the collector junction stays reverse biased (active region).",
   "tags": [
    "current-gain"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-EL-40",
   "n": 40,
   "lane": "electronics",
   "sub": "feedback",
   "type": "MSQ",
   "marks": 2,
   "diff": "apex",
   "stem": "A voltage amplifier employs series-derived negative feedback with loop gain much larger than one. Which effects of the feedback is/are expected?",
   "opts": [
    "the closed-loop gain is stabilized against device-parameter spread",
    "the input impedance of the amplifier is increased",
    "the amplifier bandwidth is extended",
    "harmonic distortion is increased"
   ],
   "ans": [
    0,
    1,
    2
   ],
   "sol": "Negative feedback buys stability, raises input impedance for series mixing, and stretches bandwidth by the loop gain; distortion is reduced, not increased.",
   "tags": [
    "negative-feedback"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-EL-41",
   "n": 41,
   "lane": "electronics",
   "sub": "timer-555",
   "type": "NAT",
   "marks": 2,
   "diff": "standard",
   "stem": "A 555 timer in astable mode uses $R_A=R_B=10\\,\\mathrm{k\\Omega}$ and $C=10\\,\\mathrm{nF}$. Its oscillation frequency $f=1.44/[(R_A+2R_B)\\,C]$, in Hz, is",
   "ans": "4750 to 4850",
   "sol": "$R_A+2R_B=3\\times10^{4}\\,\\Omega$, so $f=1.44/(3\\times10^{4}\\times10^{-8})=1.44/(3\\times10^{-4})=4800\\,\\mathrm{Hz}$.",
   "tags": [
    "astable-multivibrator"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-EL-42",
   "n": 42,
   "lane": "electronics",
   "sub": "zener",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "A $12\\,\\mathrm{V}$ source feeds a $5.6\\,\\mathrm{V}$ Zener regulator through a series resistor $R_s=320\\,\\Omega$. The load across the Zener draws $10\\,\\mathrm{mA}$. The Zener current is",
   "opts": [
    "$0\\,\\mathrm{mA}$",
    "$10\\,\\mathrm{mA}$",
    "$20\\,\\mathrm{mA}$",
    "$30\\,\\mathrm{mA}$"
   ],
   "ans": 1,
   "sol": "Series current $I_s=(12-5.6)/320=20\\,\\mathrm{mA}$; after supplying the $10\\,\\mathrm{mA}$ load the Zener carries $I_Z=20-10=10\\,\\mathrm{mA}$.",
   "tags": [
    "voltage-regulator"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-EL-43",
   "n": 43,
   "lane": "electronics",
   "sub": "digital",
   "type": "MCQ",
   "marks": 1,
   "diff": "seed",
   "stem": "The output of a two-input XOR gate is HIGH precisely when",
   "opts": [
    "at least one input is HIGH",
    "both inputs are LOW",
    "the two inputs differ",
    "both inputs are HIGH"
   ],
   "ans": 2,
   "sol": "$Y=A\\bar{B}+\\bar{A}B$: the output is $1$ only for the mixed input pairs $(0,1)$ and $(1,0)$. The last option describes OR, not XOR.",
   "tags": [
    "logic-gates"
   ],
   "correctMarks": 1,
   "wrongMarks": 0.333
  },
  {
   "id": "PF-EL-44",
   "n": 44,
   "lane": "electronics",
   "sub": "digital",
   "type": "NAT",
   "marks": 1,
   "diff": "seed",
   "stem": "The decimal value of the binary number $1011_2$ is",
   "ans": "11",
   "sol": "$1011_2=1\\times8+0\\times4+1\\times2+1\\times1=11$.",
   "tags": [
    "number-systems"
   ],
   "correctMarks": 1,
   "wrongMarks": 0
  },
  {
   "id": "PF-AN-45",
   "n": 45,
   "lane": "atnuc",
   "sub": "zeeman",
   "type": "MCQ",
   "marks": 1,
   "diff": "standard",
   "fig": "am-zeeman-triplet",
   "stem": "The figure sketches the normal Zeeman effect for the spectral line $^1P_1\\to{}^1S_0$. In a weak magnetic field, into how many components does this line split?",
   "opts": [
    "$5$",
    "$1$",
    "$2$",
    "$3$"
   ],
   "ans": 3,
   "sol": "Selection rule $\\Delta m_J=0,\\pm1$ with equal level splitting $g_J\\mu_BB$ collapses the fan into three equispaced lines ($\\pi$, $\\sigma^+$, $\\sigma^-$): a triplet, as the figure shows.",
   "tags": [
    "zeeman-effect"
   ],
   "correctMarks": 1,
   "wrongMarks": 0.333,
   "figSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1200 700\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\"><defs><marker id=\"m405060\" viewBox=\"0 0 10 10\" refX=\"8\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 z\" fill=\"#405060\"/></marker><marker id=\"md9a441\" viewBox=\"0 0 10 10\" refX=\"8\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 z\" fill=\"#d9a441\"/></marker></defs><rect x=\"0\" y=\"0\" width=\"1200\" height=\"700\" fill=\"#0b0e13\"/><line x1=\"120\" y1=\"560\" x2=\"120\" y2=\"130\" stroke=\"#405060\" stroke-width=\"3\" stroke-linecap=\"round\" marker-end=\"url(#m405060)\"/><text x=\"96\" y=\"128\" font-size=\"26\" fill=\"#9db2c8\" text-anchor=\"end\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">E</text><text x=\"305\" y=\"84\" font-size=\"26\" fill=\"#6b7c8f\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">B = 0</text><text x=\"860\" y=\"84\" font-size=\"26\" fill=\"#6b7c8f\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">B ≠ 0</text><line x1=\"660\" y1=\"110\" x2=\"660\" y2=\"560\" stroke=\"#6b7c8f\" stroke-width=\"1\" stroke-dasharray=\"4 10\" stroke-linecap=\"round\"/><line x1=\"180\" y1=\"240\" x2=\"430\" y2=\"240\" stroke=\"#6ea8fe\" stroke-width=\"4\" stroke-linecap=\"round\"/><text x=\"445\" y=\"247\" font-size=\"24\" fill=\"#6ea8fe\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">¹P₁</text><line x1=\"180\" y1=\"470\" x2=\"430\" y2=\"470\" stroke=\"#6ea8fe\" stroke-width=\"4\" stroke-linecap=\"round\"/><text x=\"445\" y=\"477\" font-size=\"24\" fill=\"#6ea8fe\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">¹S₀</text><line x1=\"240\" y1=\"240\" x2=\"240\" y2=\"470\" stroke=\"#d9a441\" stroke-width=\"3\" stroke-linecap=\"round\" marker-end=\"url(#md9a441)\" stroke-dasharray=\"8 6\"/><text x=\"258\" y=\"362\" font-size=\"24\" fill=\"#d9a441\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">ν₀</text><line x1=\"700\" y1=\"200\" x2=\"1010\" y2=\"200\" stroke=\"#6ea8fe\" stroke-width=\"4\" stroke-linecap=\"round\"/><text x=\"1024\" y=\"207\" font-size=\"20\" fill=\"#6b7c8f\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">m_J=+1</text><line x1=\"700\" y1=\"250\" x2=\"1010\" y2=\"250\" stroke=\"#6ea8fe\" stroke-width=\"4\" stroke-linecap=\"round\"/><text x=\"1024\" y=\"257\" font-size=\"20\" fill=\"#6b7c8f\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">m_J=0</text><line x1=\"700\" y1=\"300\" x2=\"1010\" y2=\"300\" stroke=\"#6ea8fe\" stroke-width=\"4\" stroke-linecap=\"round\"/><text x=\"1024\" y=\"307\" font-size=\"20\" fill=\"#6b7c8f\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">m_J=−1</text><line x1=\"700\" y1=\"480\" x2=\"1010\" y2=\"480\" stroke=\"#6ea8fe\" stroke-width=\"4\" stroke-linecap=\"round\"/><text x=\"1024\" y=\"487\" font-size=\"20\" fill=\"#6b7c8f\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">m_J=0</text><line x1=\"700\" y1=\"200\" x2=\"700\" y2=\"300\" stroke=\"#6b7c8f\" stroke-width=\"2\" stroke-dasharray=\"3 6\" stroke-linecap=\"round\"/><line x1=\"780\" y1=\"200\" x2=\"780\" y2=\"480\" stroke=\"#d9a441\" stroke-width=\"3\" stroke-linecap=\"round\" marker-end=\"url(#md9a441)\"/><text x=\"780\" y=\"516\" font-size=\"22\" fill=\"#d9a441\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">σ⁺</text><line x1=\"860\" y1=\"250\" x2=\"860\" y2=\"480\" stroke=\"#d9a441\" stroke-width=\"3\" stroke-linecap=\"round\" marker-end=\"url(#md9a441)\"/><text x=\"860\" y=\"516\" font-size=\"22\" fill=\"#d9a441\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">π</text><line x1=\"940\" y1=\"300\" x2=\"940\" y2=\"480\" stroke=\"#d9a441\" stroke-width=\"3\" stroke-linecap=\"round\" marker-end=\"url(#md9a441)\"/><text x=\"940\" y=\"516\" font-size=\"22\" fill=\"#d9a441\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">σ⁻</text><text x=\"855\" y=\"560\" font-size=\"24\" fill=\"#6b7c8f\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">normal Zeeman triplet</text><text x=\"600\" y=\"640\" font-size=\"24\" fill=\"#6b7c8f\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">ΔE = g_J·μ_B·B</text></svg>"
  },
  {
   "id": "PF-AN-46",
   "n": 46,
   "lane": "atnuc",
   "sub": "moseley",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "By Moseley law the $K\\alpha$ frequency scales as $\\nu\\propto(Z-1)^2$. Moving the target from aluminium ($Z=13$) to manganese ($Z=25$) multiplies the $K\\alpha$ frequency by",
   "opts": [
    "$4$",
    "$8$",
    "$16$",
    "$2$"
   ],
   "ans": 0,
   "sol": "Ratio $=(25-1)^2/(13-1)^2=(24/12)^2=2^2=4$.",
   "tags": [
    "x-ray-spectra"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-AN-47",
   "n": 47,
   "lane": "atnuc",
   "sub": "radioactivity",
   "type": "NAT",
   "marks": 2,
   "diff": "seed",
   "stem": "A radioactive sample has a half-life of $5$ days. The fraction of the original nuclei remaining after $15$ days is",
   "ans": "0.125",
   "sol": "Fifteen days is three half-lives: $N/N_0=(1/2)^3=1/8=0.125$.",
   "tags": [
    "half-life"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-AN-48",
   "n": 48,
   "lane": "atnuc",
   "sub": "nuclear-structure",
   "type": "MSQ",
   "marks": 2,
   "diff": "apex",
   "stem": "Which statements about nuclear structure and decay is/are TRUE?",
   "opts": [
    "the strong nuclear force is short-ranged",
    "saturation of the binding energy per nucleon indicates each nucleon binds only to its near neighbours",
    "the semi-empirical mass formula by itself explains the magic numbers",
    "in $\\beta^-$ decay a neutron converts to a proton, emitting an electron and an antineutrino"
   ],
   "ans": [
    0,
    1,
    3
   ],
   "sol": "Short range and saturation are the force hallmarks, and $\\beta^-$ is $n\\to p+e^-+\\bar\\nu_e$. Magic numbers require the shell model; the smooth SEMF cannot generate them.",
   "tags": [
    "semf",
    "beta-decay"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-AN-49",
   "n": 49,
   "lane": "atnuc",
   "sub": "angular-momentum",
   "type": "MCQ",
   "marks": 1,
   "diff": "standard",
   "stem": "The number of $m_j$ sublevels of the atomic level $2P_{3/2}$ is",
   "opts": [
    "$3$",
    "$4$",
    "$6$",
    "$2$"
   ],
   "ans": 1,
   "sol": "Degeneracy $=2j+1$; with $j=3/2$ this is $4$. Spin-orbit splits $2P$ into $j=1/2$ (twofold) and $j=3/2$ (fourfold).",
   "tags": [
    "fine-structure"
   ],
   "correctMarks": 1,
   "wrongMarks": 0.333
  },
  {
   "id": "PF-AN-50",
   "n": 50,
   "lane": "atnuc",
   "sub": "alpha-decay",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "Given $M(^{238}\\mathrm{U})=238.0508\\,u$, $M(^{234}\\mathrm{Th})=234.0436\\,u$ and $M(^4\\mathrm{He})=4.0026\\,u$, with $1\\,u=931.5\\,\\mathrm{MeV}/c^2$, the $Q$ value of $^{238}\\mathrm{U}\\to{}^{234}\\mathrm{Th}+\\alpha$ is",
   "opts": [
    "$0.93\\,\\mathrm{MeV}$",
    "$0.43\\,\\mathrm{MeV}$",
    "$4.28\\,\\mathrm{MeV}$",
    "$42.8\\,\\mathrm{MeV}$"
   ],
   "ans": 2,
   "sol": "$Q=(238.0508-234.0436-4.0026)\\,u\\times931.5=0.0046\\times931.5=4.28\\,\\mathrm{MeV}$.",
   "tags": [
    "q-value"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-AN-51",
   "n": 51,
   "lane": "atnuc",
   "sub": "term-symbols",
   "type": "MCQ",
   "marks": 2,
   "diff": "apex",
   "stem": "By Hund rules, the ground term arising from the carbon configuration $1s^2\\,2s^2\\,2p^2$ is",
   "opts": [
    "$^1D_2$",
    "$^3D_1$",
    "$^1S_0$",
    "$^3P_0$"
   ],
   "ans": 3,
   "sol": "Maximize spin: $S=1$ (triplet). Within the Pauli limits for $p^2$, maximize $L$: $L=1$ ($P$). A less-than-half-filled subshell gives $J=|L-S|=0$, so $^3P_0$.",
   "tags": [
    "hund-rules",
    "ls-coupling"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-AN-52",
   "n": 52,
   "lane": "atnuc",
   "sub": "rydberg",
   "type": "NAT",
   "marks": 1,
   "diff": "standard",
   "stem": "Using the Rydberg constant $R_H=1.097\\times10^{7}\\,\\mathrm{m^{-1}}$, the wavelength of the Balmer-$\\alpha$ line of hydrogen ($n=3\\to n=2$), in nm, is",
   "ans": "654 to 658",
   "sol": "$1/\\lambda=R_H(1/4-1/9)=5R_H/36$, so $\\lambda=36/(5R_H)=36/(5.485\\times10^{7})=6.563\\times10^{-7}\\,\\mathrm{m}=656.3\\,\\mathrm{nm}$.",
   "tags": [
    "balmer-series"
   ],
   "correctMarks": 1,
   "wrongMarks": 0
  },
  {
   "id": "PF-SS-53",
   "n": 53,
   "lane": "solidstate",
   "sub": "crystal-structure",
   "type": "MCQ",
   "marks": 1,
   "diff": "seed",
   "stem": "The atomic packing fraction of the body-centred cubic (BCC) structure is",
   "opts": [
    "$0.68$",
    "$0.74$",
    "$0.79$",
    "$0.52$"
   ],
   "ans": 0,
   "sol": "Two atoms per cell touch along the body diagonal, $4r=\\sqrt{3}\\,a$: $f=\\frac{2\\cdot\\frac43\\pi r^3}{a^3}=\\frac{\\sqrt3\\,\\pi}{8}=0.68$. ($0.74$ is FCC; $0.52$ is simple cubic.)",
   "tags": [
    "packing-fraction"
   ],
   "correctMarks": 1,
   "wrongMarks": 0.333
  },
  {
   "id": "PF-SS-54",
   "n": 54,
   "lane": "solidstate",
   "sub": "diffraction",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "X-rays of wavelength $1.54\\,\\text{\\AA}$ give a first-order Bragg reflection from a set of lattice planes at $\\theta=15^\\circ$. The interplanar spacing is closest to",
   "opts": [
    "$1.49\\,\\text{\\AA}$",
    "$2.97\\,\\text{\\AA}$",
    "$5.95\\,\\text{\\AA}$",
    "$0.77\\,\\text{\\AA}$"
   ],
   "ans": 1,
   "sol": "Bragg: $\\lambda=2d\\sin\\theta$, so $d=1.54/(2\\sin15^\\circ)=1.54/0.5176=2.97\\,\\text{\\AA}$.",
   "tags": [
    "bragg-law"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-SS-55",
   "n": 55,
   "lane": "solidstate",
   "sub": "hall-effect",
   "type": "NAT",
   "marks": 2,
   "diff": "standard",
   "stem": "Copper has conduction-electron density $n=8.5\\times10^{28}\\,\\mathrm{m^{-3}}$. The magnitude of its Hall coefficient $R_H=1/(ne)$, in units of $10^{-11}\\,\\mathrm{m^3\\,C^{-1}}$, is",
   "ans": "7.2 to 7.5",
   "sol": "$R_H=1/(8.5\\times10^{28}\\times1.602\\times10^{-19})=1/(1.362\\times10^{10})=7.35\\times10^{-11}\\,\\mathrm{m^3\\,C^{-1}}$.",
   "tags": [
    "hall-coefficient"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-SS-56",
   "n": 56,
   "lane": "solidstate",
   "sub": "band-theory",
   "type": "MSQ",
   "marks": 2,
   "diff": "standard",
   "stem": "Which statements of band theory is/are TRUE?",
   "opts": [
    "a completely filled band carries no net current",
    "the resistivity of an intrinsic semiconductor decreases as temperature rises",
    "in an intrinsic semiconductor the electron and hole densities are equal",
    "light doping changes the lattice constant of a semiconductor dramatically"
   ],
   "ans": [
    0,
    1,
    2
   ],
   "sol": "Filled-band states cancel in $\\pm k$ pairs; thermal activation across the gap lowers $\\rho(T)$; charge neutrality gives $n=p$ intrinsically. Dopants at parts-per-million leave the lattice essentially unchanged.",
   "tags": [
    "semiconductors"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-SS-57",
   "n": 57,
   "lane": "solidstate",
   "sub": "superconductivity",
   "type": "MCQ",
   "marks": 1,
   "diff": "standard",
   "stem": "The Meissner effect in a superconductor is the",
   "opts": [
    "jump of the specific heat at $T_c$ with no latent heat",
    "vanishing of electrical resistance below $T_c$",
    "expulsion of magnetic flux from the bulk below $T_c$",
    "quantization of trapped flux in units of $h/e$"
   ],
   "ans": 2,
   "sol": "Meissner–Ochsenfeld: an applied field is actively expelled so $B=0$ in the bulk (type I, below $H_c$). Zero resistance alone would freeze flux in, not push it out.",
   "tags": [
    "meissner"
   ],
   "correctMarks": 1,
   "wrongMarks": 0.333
  },
  {
   "id": "PF-SS-58",
   "n": 58,
   "lane": "solidstate",
   "sub": "debye",
   "type": "NAT",
   "marks": 2,
   "diff": "seed",
   "stem": "In the low-temperature Debye regime a solid obeys $C_V=\\beta T^3$. If $C_V=0.040\\,\\mathrm{J\\,mol^{-1}\\,K^{-1}}$ at $T=2\\,\\mathrm{K}$, its value at $T=4\\,\\mathrm{K}$, in $\\mathrm{J\\,mol^{-1}\\,K^{-1}}$, is",
   "ans": "0.32",
   "sol": "$C_V\\propto T^3$ and $(4/2)^3=8$, so $C_V(4\\,\\mathrm{K})=8\\times0.040=0.32\\,\\mathrm{J\\,mol^{-1}\\,K^{-1}}$.",
   "tags": [
    "debye-t3"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-SS-59",
   "n": 59,
   "lane": "solidstate",
   "sub": "fermi-surface",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "For a three-dimensional free-electron gas with $n=8.5\\times10^{28}\\,\\mathrm{m^{-3}}$, the Fermi wavevector $k_F=(3\\pi^2n)^{1/3}$ is approximately",
   "opts": [
    "$2.7\\times10^{10}\\,\\mathrm{m^{-1}}$",
    "$8.5\\times10^{9}\\,\\mathrm{m^{-1}}$",
    "$4.3\\times10^{9}\\,\\mathrm{m^{-1}}$",
    "$1.36\\times10^{10}\\,\\mathrm{m^{-1}}$"
   ],
   "ans": 3,
   "sol": "$3\\pi^2n=29.61\\times8.5\\times10^{28}=2.517\\times10^{30}\\,\\mathrm{m^{-3}}$; the cube root gives $k_F=1.36\\times10^{10}\\,\\mathrm{m^{-1}}$.",
   "tags": [
    "fermi-wavevector"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-SS-60",
   "n": 60,
   "lane": "solidstate",
   "sub": "crystal-structure",
   "type": "NAT",
   "marks": 1,
   "diff": "seed",
   "stem": "An FCC metal has lattice constant $a=4.05\\,\\text{\\AA}$. Its nearest-neighbour distance, in $\\text{\\AA}$, is",
   "ans": "2.84 to 2.88",
   "sol": "FCC atoms touch along a face diagonal: $d=a/\\sqrt2=4.05/1.4142=2.864\\,\\text{\\AA}$.",
   "tags": [
    "nearest-neighbour"
   ],
   "correctMarks": 1,
   "wrongMarks": 0
  }
 ]
};
