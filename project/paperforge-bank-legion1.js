/* 🏭 PAPERFORGE S3 — LEGION I bank (60 originals · AI-GENERATED · double-solved)
   Built by _audit/paperforge/replay_pf.js — do not hand-edit; edit pf_p1..pf_p6.js and replay. */
window.FORGE_BANKS = window.FORGE_BANKS || {};
window.FORGE_BANKS["pf-legion-1"] = {
 "id": "pf-legion-1",
 "label": "🏭 PAPERFORGE — LEGION I · GATE pattern (Math · Classical · EM)",
 "series": "PAPERFORGE",
 "stage": "S3",
 "minted": "2026-08-17",
 "aiGenerated": true,
 "note": "AI-GENERATED original forge bank — zero PYQ photocopies. Every question double-solved (author-solve + audit re-derivation; journal: _audit/paperforge/forge_journal.md).",
 "durationSec": 9900,
 "totalQ": 60,
 "maxScore": 98,
 "partCounts": {
  "MP": 20,
  "CM": 20,
  "EM": 20
 },
 "typeTally": {
  "MCQ": 35,
  "MSQ": 8,
  "NAT": 17
 },
 "questions": [
  {
   "id": "PF-MP-01",
   "n": 1,
   "lane": "mathphys",
   "sub": "linear-algebra",
   "type": "MCQ",
   "marks": 1,
   "diff": "seed",
   "stem": "Let $A=\\begin{pmatrix}2&1\\\\1&2\\end{pmatrix}$. The eigenvalues of $A^{3}$ are",
   "opts": [
    "$1$ and $27$",
    "$3$ and $27$",
    "$1$ and $3$",
    "$1$ and $9$"
   ],
   "ans": 0,
   "sol": "$\\det(A-\\lambda I)=(2-\\lambda)^2-1=0\\Rightarrow\\lambda=1,\\,3$. Eigenvalues of $A^3$ are the cubes: $1$ and $27$. Check: $\\det A^3=(\\det A)^3=27=1\\times27$ ✓",
   "tags": [
    "eigenvalues",
    "matrix-power"
   ],
   "correctMarks": 1,
   "wrongMarks": 0.333
  },
  {
   "id": "PF-MP-02",
   "n": 2,
   "lane": "mathphys",
   "sub": "linear-algebra",
   "type": "NAT",
   "marks": 1,
   "diff": "standard",
   "stem": "Let $M=\\begin{pmatrix}1&2&3\\\\0&4&5\\\\0&0&6\\end{pmatrix}$ and define $\\lambda=\\dfrac{\\det M}{\\det M^{T}}$. The value of $\\lambda$ is",
   "ans": "1",
   "sol": "$M$ is upper triangular: $\\det M=1\\cdot4\\cdot6=24$. Since $\\det M^T=\\det M$ always, $\\lambda=24/24=1$.",
   "tags": [
    "determinant",
    "transpose"
   ],
   "correctMarks": 1,
   "wrongMarks": 0
  },
  {
   "id": "PF-MP-03",
   "n": 3,
   "lane": "mathphys",
   "sub": "linear-algebra",
   "type": "MSQ",
   "marks": 2,
   "diff": "standard",
   "stem": "Consider $S=\\begin{pmatrix}3&0&0\\\\0&1&2\\\\0&2&1\\end{pmatrix}$. Which of the following statements is/are TRUE?",
   "opts": [
    "All eigenvalues of $S$ are real",
    "$S$ is positive definite",
    "The eigenvalue $3$ has algebraic multiplicity two",
    "$\\mathrm{Tr}\\,S=5$"
   ],
   "ans": [
    0,
    2,
    3
   ],
   "sol": "$S$ is block-diagonal: $[3]\\oplus\\begin{pmatrix}1&2\\\\2&1\\end{pmatrix}$, whose block eigenvalues are $1\\pm2=3,\\,-1$. Spectrum: $\\{3,3,-1\\}$. Real symmetric $\\Rightarrow$ real spectrum (A ✓). $-1<0$ so NOT positive definite (B ✗). $\\lambda=3$ has multiplicity 2 (C ✓). $\\mathrm{Tr}\\,S=3+1+1=5$, also $3+3-1=5$ (D ✓).",
   "tags": [
    "symmetric-matrix",
    "spectrum",
    "trace"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-MP-04",
   "n": 4,
   "lane": "mathphys",
   "sub": "linear-algebra",
   "type": "MCQ",
   "marks": 2,
   "diff": "apex",
   "stem": "A real $3\\times3$ matrix $N$ satisfies $N^{3}=0$ but $N^{2}\\neq0$. The rank of $N^{2}$ is",
   "opts": [
    "$0$",
    "$1$",
    "$2$",
    "$3$"
   ],
   "ans": 1,
   "sol": "$N$ is nilpotent; its Jordan form consists of nilpotent blocks. $N^2\\neq0$ needs a block of size $\\ge3$; the matrix is $3\\times3$, so $N\\sim J_3(0)$ exactly. Then $N^2\\sim J_3(0)^2$, which has a single non-zero super-superdiagonal entry: rank $1$. Check: nullity chain $3\\to2\\to1$ forces ranks $2,1,0$ ✓",
   "tags": [
    "nilpotent",
    "jordan",
    "rank"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-MP-05",
   "n": 5,
   "lane": "mathphys",
   "sub": "complex-analysis",
   "type": "MCQ",
   "marks": 1,
   "diff": "seed",
   "stem": "The residue of $f(z)=\\dfrac{\\cos z}{z^{3}}$ at $z=0$ is",
   "opts": [
    "$0$",
    "$1$",
    "$-\\dfrac{1}{2}$",
    "$\\dfrac{1}{2}$"
   ],
   "ans": 2,
   "sol": "$\\cos z=1-\\dfrac{z^2}{2!}+\\cdots\\Rightarrow f(z)=\\dfrac{1}{z^3}-\\dfrac{1}{2z}+\\cdots$ The $z^{-1}$ coefficient is $-\\tfrac12$. Check: pole of order 3, $\\operatorname{Res}=\\tfrac{1}{2!}\\lim_{z\\to0}(\\cos z)''=-\\tfrac12$ ✓",
   "tags": [
    "residue",
    "laurent"
   ],
   "correctMarks": 1,
   "wrongMarks": 0.333
  },
  {
   "id": "PF-MP-06",
   "n": 6,
   "lane": "mathphys",
   "sub": "complex-analysis",
   "type": "NAT",
   "marks": 2,
   "diff": "standard",
   "fig": "mp-contour-poles",
   "stem": "Evaluate $\\displaystyle\\oint_{C_R}\\frac{dz}{z^{2}+4z+13}$ where $C_R$ is the circle $|z|=4$ traversed counter-clockwise (figure: both poles enclosed — poles marked at $z_{1,2}=-2\\pm3i$). Give the exact numerical value.",
   "ans": "0",
   "sol": "Poles at $z=-2\\pm3i$, $|z|=\\sqrt{13}\\approx3.61<4$: both inside $C_R$. Residues: $\\dfrac{1}{z_+-z_-}=\\dfrac{1}{6i}$ and $\\dfrac{1}{z_--z_+}=-\\dfrac{1}{6i}$ — they cancel exactly. The integral is $2\\pi i\\times0=0$.",
   "tags": [
    "contour",
    "residue-cancellation"
   ],
   "correctMarks": 2,
   "wrongMarks": 0,
   "figSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1200 700\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\"><defs><marker id=\"m405060\" viewBox=\"0 0 10 10\" refX=\"8\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 z\" fill=\"#405060\"/></marker><marker id=\"m6ea8fe\" viewBox=\"0 0 10 10\" refX=\"8\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 z\" fill=\"#6ea8fe\"/></marker></defs><rect x=\"0\" y=\"0\" width=\"1200\" height=\"700\" fill=\"#0b0e13\"/><line x1=\"110\" y1=\"540\" x2=\"1090\" y2=\"540\" stroke=\"#405060\" stroke-width=\"3\" stroke-linecap=\"round\" marker-end=\"url(#m405060)\"/><line x1=\"600\" y1=\"660\" x2=\"600\" y2=\"70\" stroke=\"#405060\" stroke-width=\"3\" stroke-linecap=\"round\" marker-end=\"url(#m405060)\"/><text x=\"1094\" y=\"548\" font-size=\"24\" fill=\"#9db2c8\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">Re z</text><text x=\"588\" y=\"66\" font-size=\"24\" fill=\"#9db2c8\" text-anchor=\"end\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">Im z</text><path d=\"M 200 540 A 400 400 0 0 1 1000 540\" fill=\"none\" stroke=\"#6ea8fe\" stroke-width=\"4\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><line x1=\"200\" y1=\"540\" x2=\"1000\" y2=\"540\" stroke=\"#6ea8fe\" stroke-width=\"4\" stroke-linecap=\"round\"/><path d=\"M 996 510 A 400 400 0 0 1 918 448\" fill=\"none\" stroke=\"#6ea8fe\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" marker-end=\"url(#m6ea8fe)\"/><line x1=\"360\" y1=\"540\" x2=\"460\" y2=\"540\" stroke=\"#6ea8fe\" stroke-width=\"4\" stroke-linecap=\"round\" marker-end=\"url(#m6ea8fe)\"/><text x=\"1008\" y=\"480\" font-size=\"26\" fill=\"#6ea8fe\" text-anchor=\"start\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">C_R</text><text x=\"200\" y=\"580\" font-size=\"22\" fill=\"#6b7c8f\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">−R</text><text x=\"1000\" y=\"580\" font-size=\"22\" fill=\"#6b7c8f\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">R</text><text x=\"600\" y=\"580\" font-size=\"22\" fill=\"#6b7c8f\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">0</text><line x1=\"481\" y1=\"301\" x2=\"499\" y2=\"319\" stroke=\"#e5534b\" stroke-width=\"4\" stroke-linecap=\"round\"/><line x1=\"481\" y1=\"319\" x2=\"499\" y2=\"301\" stroke=\"#e5534b\" stroke-width=\"4\" stroke-linecap=\"round\"/><text x=\"490\" y=\"288\" font-size=\"22\" fill=\"#e5534b\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">z₁ = ia</text><line x1=\"751\" y1=\"201\" x2=\"769\" y2=\"219\" stroke=\"#e5534b\" stroke-width=\"4\" stroke-linecap=\"round\"/><line x1=\"751\" y1=\"219\" x2=\"769\" y2=\"201\" stroke=\"#e5534b\" stroke-width=\"4\" stroke-linecap=\"round\"/><text x=\"760\" y=\"188\" font-size=\"22\" fill=\"#e5534b\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">z₂ = ib</text><text x=\"300\" y=\"94\" font-size=\"22\" fill=\"#6b7c8f\" text-anchor=\"middle\" font-family=\"Consolas,DejaVu Sans Mono,Menlo,monospace\">upper half-plane residue contour</text></svg>"
  },
  {
   "id": "PF-MP-07",
   "n": 7,
   "lane": "mathphys",
   "sub": "complex-analysis",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "$\\displaystyle\\int_{0}^{\\infty}\\frac{dx}{x^{4}+1}$ equals",
   "opts": [
    "$\\dfrac{\\pi}{2\\sqrt2}$",
    "$\\dfrac{\\pi}{\\sqrt2}$",
    "$\\dfrac{\\pi\\sqrt2}{3}$",
    "$\\dfrac{\\pi}{4}$"
   ],
   "ans": 0,
   "sol": "Even integrand: $\\int_{-\\infty}^{\\infty}=2I$. Upper half-plane poles of $1/(z^4+1)$ are $z_0=e^{i\\pi/4},e^{i3\\pi/4}$, each simple with $\\operatorname{Res}=1/(4z_0^3)=-z_0/4$ (using $z_0^4=-1$). Sum $=-\\tfrac14(e^{i\\pi/4}+e^{i3\\pi/4})=-\\tfrac{i\\sqrt2}{4}$. Then $2I=2\\pi i\\left(-\\tfrac{i\\sqrt2}{4}\\right)=\\tfrac{\\pi\\sqrt2}{2}=\\tfrac{\\pi}{\\sqrt2}$, so $I=\\tfrac{\\pi}{2\\sqrt2}$. Check: $\\int_0^\\infty\\tfrac{dx}{1+x^n}=\\tfrac{\\pi}{n}\\csc\\tfrac{\\pi}{n}$ at $n=4$ gives $\\tfrac{\\pi}{4}\\sqrt2=\\tfrac{\\pi}{2\\sqrt2}$ ✓",
   "tags": [
    "real-integral",
    "residue-method"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-MP-08",
   "n": 8,
   "lane": "mathphys",
   "sub": "ode-pde",
   "type": "MCQ",
   "marks": 1,
   "diff": "seed",
   "stem": "The solution of $y''+4y=0$ with $y(0)=0$, $y'(0)=8$ is",
   "opts": [
    "$y=8\\sin 2x$",
    "$y=4\\sin 2x$",
    "$y=2\\sin 4x$",
    "$y=4\\sin 4x$"
   ],
   "ans": 1,
   "sol": "$y=A\\cos2x+B\\sin2x$; $y(0)=A=0$; $y'(0)=2B=8\\Rightarrow B=4$. Check: $y''=-16\\sin2x=-4y$ ✓",
   "tags": [
    "ode",
    "initial-value"
   ],
   "correctMarks": 1,
   "wrongMarks": 0.333
  },
  {
   "id": "PF-MP-09",
   "n": 9,
   "lane": "mathphys",
   "sub": "fourier",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "The $2\\pi$-periodic square wave $f(x)=+1$ for $0<x<\\pi$ and $f(x)=-1$ for $-\\pi<x<0$ has Fourier series $\\sum_{n\\ge1}b_n\\sin nx$. The coefficient $b_3$ is",
   "opts": [
    "$\\dfrac{4}{\\pi}$",
    "$0$",
    "$\\dfrac{4}{3\\pi}$",
    "$\\dfrac{2}{3\\pi}$"
   ],
   "ans": 2,
   "sol": "Only sine terms survive (odd function). $b_n=\\dfrac{1}{\\pi}\\int_{-\\pi}^{\\pi}f\\sin nx\\,dx=\\dfrac{2}{\\pi}\\int_0^\\pi\\sin nx\\,dx=\\dfrac{2}{n\\pi}(1-\\cos n\\pi)$, which is $\\dfrac{4}{n\\pi}$ for odd $n$. Hence $b_3=\\dfrac{4}{3\\pi}$. Check: standard series $\\tfrac{4}{\\pi}\\left(\\sin x+\\tfrac{\\sin3x}{3}+\\cdots\\right)$ ✓",
   "tags": [
    "fourier-series",
    "square-wave"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-MP-10",
   "n": 10,
   "lane": "mathphys",
   "sub": "probability",
   "type": "NAT",
   "marks": 1,
   "diff": "standard",
   "stem": "A fair die is rolled twice and $X$ is the larger of the two outcomes. Compute $36\\,E[X]$ and report the integer.",
   "ans": "161",
   "sol": "$P(X=k)=P(\\max=k)=\\dfrac{2k-1}{36}$. So $E[X]=\\dfrac{1}{36}\\sum_{k=1}^{6}k(2k-1)=\\dfrac{2\\cdot91-21}{36}=\\dfrac{161}{36}$, giving $36E[X]=161$.",
   "tags": [
    "expectation",
    "order-statistic"
   ],
   "correctMarks": 1,
   "wrongMarks": 0
  },
  {
   "id": "PF-MP-11",
   "n": 11,
   "lane": "mathphys",
   "sub": "special-functions",
   "type": "MCQ",
   "marks": 1,
   "diff": "seed",
   "stem": "The Legendre polynomials are generated by $(1-2tx+x^{2})^{-1/2}=\\sum_{n\\ge0}P_{n}(t)\\,x^{n}$. The value of $P_{2}(1)$ is",
   "opts": [
    "$\\dfrac32$",
    "$-\\dfrac12$",
    "$\\dfrac12$",
    "$1$"
   ],
   "ans": 3,
   "sol": "At $t=1$: $(1-2x+x^{2})^{-1/2}=(1-x)^{-1}=\\sum_{n\\ge0}x^{n}$, so every $P_n(1)=1$. Hence $P_2(1)=1$. (Cross-form: $P_2(t)=\\tfrac12(3t^2-1)$, $P_2(1)=1$ ✓)",
   "tags": [
    "legendre",
    "generating-function"
   ],
   "correctMarks": 1,
   "wrongMarks": 0.333
  },
  {
   "id": "PF-MP-12",
   "n": 12,
   "lane": "mathphys",
   "sub": "vector-calculus",
   "type": "NAT",
   "marks": 2,
   "diff": "standard",
   "stem": "Let $\\mathbf{F}=x\\hat{x}+y\\hat{y}+z\\hat{z}$ and let $S$ be the sphere of radius $1$ centred at the origin. If $\\Phi=\\oint_S\\mathbf{F}\\cdot d\\mathbf{S}$, report $\\Phi/\\pi$.",
   "ans": "4",
   "sol": "$\\nabla\\cdot\\mathbf{F}=3$, so by the divergence theorem $\\Phi=3\\,V=3\\cdot\\tfrac{4\\pi}{3}=4\\pi$; hence $\\Phi/\\pi=4$.",
   "tags": [
    "divergence-theorem",
    "flux"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-MP-13",
   "n": 13,
   "lane": "mathphys",
   "sub": "complex-analysis",
   "type": "MSQ",
   "marks": 2,
   "diff": "standard",
   "stem": "Which of the following functions is/are analytic on an open subset of $\\mathbb{C}$?",
   "opts": [
    "$f(z)=\\bar{z}$",
    "$f(z)=e^{z}$",
    "$f(z)=1/z$ on $\\mathbb{C}\\setminus\\{0\\}$",
    "$f(z)=|z|^{2}$"
   ],
   "ans": [
    1,
    2
   ],
   "sol": "$e^z$ is entire ✓; $1/z$ is analytic on its domain $\\mathbb{C}\\setminus\\{0\\}$ ✓. $\\bar z$ fails Cauchy–Riemann everywhere; $|z|^2=x^2+y^2$ satisfies CR only at the single point $z=0$, hence is analytic on NO open set.",
   "tags": [
    "analyticity",
    "cauchy-riemann"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-MP-14",
   "n": 14,
   "lane": "mathphys",
   "sub": "ode-pde",
   "type": "MCQ",
   "marks": 1,
   "diff": "seed",
   "stem": "A string of length $L$, fixed at both ends, obeys $u_{tt}=c^{2}u_{xx}$. The angular frequency of the second harmonic (mode $n=2$) is",
   "opts": [
    "$\\dfrac{2\\pi c}{L}$",
    "$\\dfrac{4\\pi c}{L}$",
    "$\\dfrac{\\pi c}{2L}$",
    "$\\dfrac{\\pi c}{L}$"
   ],
   "ans": 0,
   "sol": "Fixed–fixed modes: $u_n=\\sin\\tfrac{n\\pi x}{L}\\cos\\omega_n t$ with $\\omega_n=\\tfrac{n\\pi c}{L}$. For $n=2$: $\\omega_2=\\tfrac{2\\pi c}{L}$.",
   "tags": [
    "wave-equation",
    "normal-modes"
   ],
   "correctMarks": 1,
   "wrongMarks": 0.333
  },
  {
   "id": "PF-MP-15",
   "n": 15,
   "lane": "mathphys",
   "sub": "fourier",
   "type": "NAT",
   "marks": 2,
   "diff": "standard",
   "stem": "With the convention $F(k)=\\displaystyle\\int_{-\\infty}^{\\infty}f(x)\\,e^{-ikx}dx$, let $f(x)=e^{-3|x|}$. Report $F(0)$ rounded to two decimals.",
   "ans": "0.66 to 0.67",
   "sol": "$F(0)=\\displaystyle\\int_{-\\infty}^{\\infty}e^{-3|x|}dx=2\\int_0^\\infty e^{-3x}dx=\\dfrac{2}{3}=0.667$ (2 d.p. $0.67$; both in gate window).",
   "tags": [
    "fourier-transform",
    "convention-explicit"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-MP-16",
   "n": 16,
   "lane": "mathphys",
   "sub": "group-theory",
   "type": "MCQ",
   "marks": 1,
   "diff": "seed",
   "stem": "The number of generators of the cyclic group $\\mathbb{Z}_{12}$ is",
   "opts": [
    "$2$",
    "$4$",
    "$6$",
    "$12$"
   ],
   "ans": 1,
   "sol": "Generators are the elements coprime to 12: $\\{1,5,7,11\\}$; count $=\\varphi(12)=12\\left(1-\\tfrac12\\right)\\left(1-\\tfrac13\\right)=4$.",
   "tags": [
    "group-theory",
    "euler-totient"
   ],
   "correctMarks": 1,
   "wrongMarks": 0.333
  },
  {
   "id": "PF-MP-17",
   "n": 17,
   "lane": "mathphys",
   "sub": "ode-pde",
   "type": "MCQ",
   "marks": 2,
   "diff": "apex",
   "stem": "For $xy''+y'-y=0$, the indicial exponent(s) for a Frobenius expansion about $x=0$ is/are",
   "opts": [
    "$r=0\\ \\text{and}\\ r=1$",
    "$r=\\pm i$",
    "$r=0\\ \\text{(a double root)}$",
    "$r=\\pm1$"
   ],
   "ans": 2,
   "sol": "Set $y=\\sum a_n x^{n+r}$. The lowest power $x^{r-1}$ collects $[r(r-1)+r]\\,a_0=r^{2}a_0=0$: indicial equation $r^{2}=0$, double root $r=0$. Hence one Frobenius series plus a logarithmic second solution. (This is the Bessel-$\\nu{=}0$ pattern.)",
   "tags": [
    "frobenius",
    "indicial"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-MP-18",
   "n": 18,
   "lane": "mathphys",
   "sub": "probability",
   "type": "MSQ",
   "marks": 2,
   "diff": "standard",
   "stem": "If $X\\sim\\mathrm{Poisson}(\\lambda)$, which of the following is/are TRUE?",
   "opts": [
    "$E[X]=\\lambda$",
    "$\\mathrm{Var}(X)=\\lambda$",
    "The distribution of $X$ is symmetric about $\\lambda$",
    "$P(X=0)=e^{-\\lambda}$"
   ],
   "ans": [
    0,
    1,
    3
   ],
   "sol": "Poisson: mean $=$ variance $=\\lambda$ (A,B ✓) and $P(X=k)=e^{-\\lambda}\\lambda^{k}/k!$ gives $P(X=0)=e^{-\\lambda}$ (D ✓). The pmf is right-skewed for any finite $\\lambda$ (C ✗).",
   "tags": [
    "poisson",
    "moments"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-MP-19",
   "n": 19,
   "lane": "mathphys",
   "sub": "ode-pde",
   "type": "NAT",
   "marks": 1,
   "diff": "standard",
   "stem": "If $\\mathcal{L}\\{f(t)\\}=\\dfrac{1}{s^{2}+4}$, evaluate $f(\\pi/4)$ exactly (report the decimal value, 2 d.p.).",
   "ans": "0.5",
   "sol": "$\\mathcal{L}^{-1}\\{1/(s^2+4)\\}=\\tfrac12\\sin2t$. Then $f(\\pi/4)=\\tfrac12\\sin(\\pi/2)=\\tfrac12=0.5$.",
   "tags": [
    "laplace",
    "inverse-transform"
   ],
   "correctMarks": 1,
   "wrongMarks": 0
  },
  {
   "id": "PF-MP-20",
   "n": 20,
   "lane": "mathphys",
   "sub": "vector-calculus",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "For $\\mathbf{F}=(xy,\\,yz,\\,zx)$, the value of $\\nabla\\times\\mathbf{F}$ at the point $(1,1,1)$ is",
   "opts": [
    "$(-1,1,-1)$",
    "$(0,0,0)$",
    "$(1,1,1)$",
    "$(-1,-1,-1)$"
   ],
   "ans": 3,
   "sol": "$\\nabla\\times\\mathbf{F}=(\\partial_y R-\\partial_z Q,\\;\\partial_z P-\\partial_x R,\\;\\partial_x Q-\\partial_y P)$ with $P=xy,Q=yz,R=zx$: $\\;=(0-y,\\;0-z,\\;0-x)=(-y,-z,-x)$. At $(1,1,1)$: $(-1,-1,-1)$.",
   "tags": [
    "curl",
    "vector-calculus"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-CM-21",
   "n": 21,
   "lane": "classical",
   "sub": "newtonian",
   "type": "MCQ",
   "marks": 1,
   "diff": "seed",
   "stem": "An ideal Atwood machine carries masses $m$ and $3m$ over a massless frictionless pulley. The acceleration of the system is",
   "opts": [
    "$\\dfrac{g}{2}$",
    "$\\dfrac{2g}{3}$",
    "$\\dfrac{3g}{4}$",
    "$\\dfrac{g}{3}$"
   ],
   "ans": 0,
   "sol": "$a=\\dfrac{(3m-m)g}{3m+m}=\\dfrac{2}{4}g=\\dfrac{g}{2}$.",
   "tags": [
    "atwood",
    "newton-second"
   ],
   "correctMarks": 1,
   "wrongMarks": 0.333
  },
  {
   "id": "PF-CM-22",
   "n": 22,
   "lane": "classical",
   "sub": "newtonian",
   "type": "NAT",
   "marks": 1,
   "diff": "standard",
   "stem": "A projectile is launched at $v=20$ m/s at $\\theta=30^{\\circ}$ on level ground. Using $g=10$ m/s$^{2}$, report the range in metres (2 d.p.).",
   "ans": "34.63 to 34.66",
   "sol": "$R=\\dfrac{v^{2}\\sin2\\theta}{g}=\\dfrac{400\\sin60^{\\circ}}{10}=40\\times\\tfrac{\\sqrt3}{2}=20\\sqrt3=34.641$ m.",
   "tags": [
    "projectile",
    "range"
   ],
   "correctMarks": 1,
   "wrongMarks": 0
  },
  {
   "id": "PF-CM-23",
   "n": 23,
   "lane": "classical",
   "sub": "lagrangian",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "A bead slides on a frictionless circular hoop of radius $R$ rotating about its vertical diameter with angular velocity $\\omega=\\sqrt{2g/R}$. The equilibrium angle $\\theta$ (measured from the downward vertical) is",
   "opts": [
    "$45^{\\circ}$",
    "$60^{\\circ}$",
    "$90^{\\circ}$",
    "$30^{\\circ}$"
   ],
   "ans": 1,
   "sol": "Effective potential balance gives $\\cos\\theta=\\dfrac{g}{R\\omega^{2}}=\\dfrac{g}{R\\cdot2g/R}=\\dfrac12$, so $\\theta=60^{\\circ}$. (The $\\omega^{2}\\!R\\sin\\theta$ centrifugal term balances $g\\sin\\theta$ projection.)",
   "tags": [
    "rotating-hoop",
    "equilibrium"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-CM-24",
   "n": 24,
   "lane": "classical",
   "sub": "central-orbits",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "A particle of mass $m$ moves in the central potential $U(r)=-k/r$ with angular momentum $L$. The radius of the circular orbit is",
   "opts": [
    "$\\dfrac{mk}{L^{2}}$",
    "$\\dfrac{L\\sqrt{k}}{m}$",
    "$\\dfrac{L^{2}}{mk}$",
    "$\\dfrac{L^{2}}{2mk}$"
   ],
   "ans": 2,
   "sol": "Circular orbit: $U_{\\mathrm{eff}}=\\dfrac{L^{2}}{2mr^{2}}-\\dfrac{k}{r}$, $\\dfrac{dU_{\\mathrm{eff}}}{dr}=0\\Rightarrow\\dfrac{L^{2}}{mr^{3}}=\\dfrac{k}{r^{2}}$, so $r_{0}=\\dfrac{L^{2}}{mk}$. Check: this equals the Bohr radius structure ✓",
   "tags": [
    "central-force",
    "circular-orbit"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-CM-25",
   "n": 25,
   "lane": "classical",
   "sub": "central-orbits",
   "type": "MSQ",
   "marks": 2,
   "diff": "standard",
   "stem": "For motion in a general central potential $U(r)$, which statements is/are TRUE?",
   "opts": [
    "The angular momentum $\\mathbf{L}$ is conserved",
    "For conservative $U(r)$ the total energy is conserved",
    "Every bound orbit is a closed curve",
    "For $U(r)\\propto1/r$ the Laplace–Runge–Lenz vector is conserved"
   ],
   "ans": [
    0,
    1,
    3
   ],
   "sol": "Central force $\\Rightarrow$ torque-free $\\Rightarrow\\mathbf{L}$ const (A ✓); time-independent conservative force conserves $E$ (B ✓). Bound orbits close only for $U\\propto1/r$ and $U\\propto r^{2}$ (Bertrand) — not in general (C ✗). The LRL vector conservation is the signature $1/r$ symmetry (D ✓).",
   "tags": [
    "central-force",
    "conservation",
    "bertrand"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-CM-26",
   "n": 26,
   "lane": "classical",
   "sub": "small-oscillations",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "Two identical masses $m$ are joined to fixed walls and to each other by three identical springs of constant $k$ (wall–mass–mass–wall, all collinear). The ratio $\\omega_{2}/\\omega_{1}$ of the out-of-phase to in-phase normal mode frequencies is",
   "opts": [
    "$3$",
    "$\\sqrt{2}$",
    "$2$",
    "$\\sqrt{3}$"
   ],
   "ans": 3,
   "sol": "In-phase: centre spring unstretched, $\\omega_1^2=k/m$. Out-of-phase: centre spring stretch doubles, restoring adds $2kx$ → $\\omega_2^2=3k/m$. Ratio $=\\sqrt{3}$.",
   "tags": [
    "coupled-oscillators",
    "normal-modes"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-CM-27",
   "n": 27,
   "lane": "classical",
   "sub": "hamiltonian",
   "type": "MCQ",
   "marks": 1,
   "diff": "seed",
   "stem": "For the Hamiltonian $H=\\dfrac{p^{2}}{2m}+V(q)$, Hamilton's equation for $\\dot{q}$ gives",
   "opts": [
    "$\\dot{q}=\\dfrac{p}{m}$",
    "$\\dot{q}=-\\dfrac{p}{m}$",
    "$\\dot{q}=\\dfrac{\\partial V}{\\partial q}$",
    "$\\dot{q}=\\dfrac{1}{m}\\dfrac{\\partial V}{\\partial q}$"
   ],
   "ans": 0,
   "sol": "$\\dot q=\\dfrac{\\partial H}{\\partial p}=\\dfrac{p}{m}$ — canonical momentum equals kinematic momentum here.",
   "tags": [
    "hamilton-equations"
   ],
   "correctMarks": 1,
   "wrongMarks": 0.333
  },
  {
   "id": "PF-CM-28",
   "n": 28,
   "lane": "classical",
   "sub": "rigid-body",
   "type": "NAT",
   "marks": 2,
   "diff": "standard",
   "stem": "A solid sphere rolls without slipping down a plane inclined at $30^{\\circ}$. Using $g=10$ m/s$^{2}$, report its acceleration in m/s$^{2}$ (2 d.p.).",
   "ans": "3.55 to 3.60",
   "sol": "$a=\\dfrac{g\\sin\\theta}{1+I/(mR^{2})}=\\dfrac{10\\times\\tfrac12}{1+2/5}=\\dfrac{5}{7/5}=\\dfrac{25}{7}=3.571$ m/s$^{2}$.",
   "tags": [
    "rolling",
    "incline"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-CM-29",
   "n": 29,
   "lane": "classical",
   "sub": "canonical",
   "type": "MCQ",
   "marks": 2,
   "diff": "apex",
   "stem": "The transformation $Q=\\ln p$, $P=-qp$ between conjugate pairs $(q,p)\\to(Q,P)$ is canonical. The Poisson bracket $\\{Q,P\\}_{q,p}$ equals",
   "opts": [
    "$\\dfrac{q}{p}$",
    "$1$",
    "$-1$",
    "$0$"
   ],
   "ans": 1,
   "sol": "$\\{Q,P\\}_{q,p}=\\partial_qQ\\,\\partial_pP-\\partial_pQ\\,\\partial_qP=(0)(-q)-\\left(\\tfrac1p\\right)(-p)=1$. Unity bracket is exactly the canonicality condition ✓",
   "tags": [
    "poisson-bracket",
    "canonical-transform"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-CM-30",
   "n": 30,
   "lane": "classical",
   "sub": "small-oscillations",
   "type": "MSQ",
   "marks": 2,
   "diff": "standard",
   "stem": "For a holonomic system with $n$ generalized coordinates oscillating about stable equilibrium, which statements is/are TRUE?",
   "opts": [
    "Each normal coordinate oscillates at a single definite frequency",
    "There are exactly $n$ normal modes (counting degenerate ones with multiplicity)",
    "All normal-mode frequencies are necessarily distinct",
    "Normal-mode eigenvectors can be chosen orthogonal with respect to the mass (kinetic) matrix"
   ],
   "ans": [
    0,
    1,
    3
   ],
   "sol": "Normal coordinates diagonalize both quadratic forms: $Q_k\\propto\\cos(\\omega_kt+\\phi_k)$ (A ✓); $n$ modes with multiplicity (B ✓); degeneracies are possible e.g. isotropic systems (C ✗); the secular problem is a generalized eigenvalue equation, so modes are $M$-orthogonal (D ✓).",
   "tags": [
    "normal-modes",
    "diagonalization"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-CM-31",
   "n": 31,
   "lane": "classical",
   "sub": "rigid-body",
   "type": "MCQ",
   "marks": 1,
   "diff": "seed",
   "stem": "The moment of inertia of a uniform solid sphere of mass $M$ and radius $R$ about a diameter is",
   "opts": [
    "$\\dfrac{1}{2}MR^{2}$",
    "$\\dfrac{7}{5}MR^{2}$",
    "$\\dfrac{2}{5}MR^{2}$",
    "$\\dfrac{2}{3}MR^{2}$"
   ],
   "ans": 2,
   "sol": "$I=\\int r_{\\perp}^{2}dm=\\dfrac{2}{5}MR^{2}$ for a solid sphere ($\\tfrac23MR^2$ is the hollow shell; $\\tfrac12MR^2$ a disk/cylinder about its axis; $\\tfrac75MR^2$ the sphere about a tangent — parallel axis check ✓).",
   "tags": [
    "moment-of-inertia"
   ],
   "correctMarks": 1,
   "wrongMarks": 0.333
  },
  {
   "id": "PF-CM-32",
   "n": 32,
   "lane": "classical",
   "sub": "relativity",
   "type": "NAT",
   "marks": 2,
   "diff": "standard",
   "stem": "A muon with proper lifetime $\\tau_{0}=2.2\\,\\mu$s travels at $0.99c$. Report its laboratory-frame lifetime in $\\mu$s (1 d.p.).",
   "ans": "15.4 to 15.7",
   "sol": "$\\gamma=1/\\sqrt{1-0.99^{2}}=1/\\sqrt{0.0199}=7.089$. Lab lifetime $\\tau=\\gamma\\tau_{0}=7.089\\times2.2=15.60\\,\\mu$s.",
   "tags": [
    "time-dilation",
    "muon"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-CM-33",
   "n": 33,
   "lane": "classical",
   "sub": "rigid-body",
   "type": "MCQ",
   "marks": 2,
   "diff": "apex",
   "stem": "A rigid body with principal moments $I_{1}<I_{2}<I_{3}$ rotates freely (zero torque). Steady rotation is STABLE about",
   "opts": [
    "all three principal axes",
    "the $I_{2}$ axis only",
    "the $I_{1}$ axis only",
    "the $I_{1}$ and $I_{3}$ axes"
   ],
   "ans": 3,
   "sol": "Euler equations give $\\ddot\\theta\\propto-\\left[\\tfrac{(I_{3}-I_{1})(I_{2}-I_{1})}{I_{2}I_{3}}\\right]$-type restoring coefficients about $I_1$ and $I_3$; about $I_2$ the coefficient sign flips (intermediate-axis theorem — tennis-racket instability). Stable: $I_1, I_3$.",
   "tags": [
    "euler-equations",
    "stability"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-CM-34",
   "n": 34,
   "lane": "classical",
   "sub": "lagrangian",
   "type": "MCQ",
   "marks": 1,
   "diff": "seed",
   "stem": "The principle of virtual work for a system in static equilibrium with ideal constraints states that the virtual work of",
   "opts": [
    "the applied forces alone vanishes for any virtual displacement consistent with the constraints",
    "the constraint forces is maximal",
    "the applied forces equals the kinetic energy",
    "all forces, including constraints, vanishes"
   ],
   "ans": 0,
   "sol": "Ideal (workless) constraints drop out of $\\delta W=\\sum_i\\mathbf{F}^{\\rm appl}_i\\cdot\\delta\\mathbf{r}_i$; equilibrium $\\Leftrightarrow$ virtual work of applied forces vanishes for every constraint-consistent $\\delta\\mathbf r$.",
   "tags": [
    "virtual-work",
    "dAlembert"
   ],
   "correctMarks": 1,
   "wrongMarks": 0.333
  },
  {
   "id": "PF-CM-35",
   "n": 35,
   "lane": "classical",
   "sub": "newtonian",
   "type": "NAT",
   "marks": 2,
   "diff": "standard",
   "stem": "A puck on a frictionless horizontal table at the Earth's north pole moves horizontally at $10$ m/s. Taking $\\omega_{\\oplus}=7.27\\times10^{-5}$ rad/s, report the magnitude of its Coriolis acceleration in units of $10^{-3}$ m/s$^{2}$ (2 d.p.).",
   "ans": "1.45 to 1.46",
   "sol": "At the pole the horizontal velocity is perpendicular to $\\boldsymbol\\omega$: $a_{\\rm Cor}=2\\omega v^{\\prime}=2\\times7.27\\times10^{-5}\\times10=1.454\\times10^{-3}$ m/s$^{2}$, i.e. $1.45$ in units of $10^{-3}$ m/s$^{2}$ (2 d.p.).",
   "tags": [
    "coriolis",
    "rotating-frame"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-CM-36",
   "n": 36,
   "lane": "classical",
   "sub": "fluids",
   "type": "MCQ",
   "marks": 1,
   "diff": "seed",
   "stem": "An open tank has water filled to height $h$ above a small side orifice. The efflux speed (Torricelli) is",
   "opts": [
    "$\\sqrt{gh}$",
    "$\\sqrt{2gh}$",
    "$2\\sqrt{gh}$",
    "$\\sqrt{\\dfrac{gh}{2}}$"
   ],
   "ans": 1,
   "sol": "Bernoulli between the free surface and the jet (both at atmospheric pressure, surface speed $\\approx0$): $\\tfrac12 v^{2}=gh\\Rightarrow v=\\sqrt{2gh}$.",
   "tags": [
    "bernoulli",
    "torricelli"
   ],
   "correctMarks": 1,
   "wrongMarks": 0.333
  },
  {
   "id": "PF-CM-37",
   "n": 37,
   "lane": "classical",
   "sub": "relativity",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "A particle has rest energy $mc^{2}=0.3$ GeV and momentum $pc=0.4$ GeV. Its total energy is",
   "opts": [
    "$0.12$ GeV",
    "$0.4$ GeV",
    "$0.5$ GeV",
    "$0.7$ GeV"
   ],
   "ans": 2,
   "sol": "$E=\\sqrt{(pc)^{2}+(mc^{2})^{2}}=\\sqrt{0.16+0.09}=\\sqrt{0.25}=0.5$ GeV. (3-4-5 triangle ✓)",
   "tags": [
    "energy-momentum",
    "relativity"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-CM-38",
   "n": 38,
   "lane": "classical",
   "sub": "central-orbits",
   "type": "MCQ",
   "marks": 2,
   "diff": "apex",
   "stem": "The apsidal angle (angle between successive perihelion and aphelion) for a nearly circular orbit in the 2-D isotropic harmonic-oscillator potential $U(r)=\\tfrac12kr^{2}$ is",
   "opts": [
    "$\\pi$",
    "$2\\pi$",
    "$\\dfrac{\\pi}{4}$",
    "$\\dfrac{\\pi}{2}$"
   ],
   "ans": 3,
   "sol": "For a power-law force $F\\propto r^{n}$ the apsidal angle for nearly circular orbits is $\\pi/\\sqrt{3+n}$. Oscillator: $n=1\\Rightarrow\\pi/\\sqrt4=\\pi/2$. (Kepler check: $n=-2\\Rightarrow\\pi$; closed ellipses ✓.)",
   "tags": [
    "apsidal-angle",
    "bertrand"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-CM-39",
   "n": 39,
   "lane": "classical",
   "sub": "newtonian",
   "type": "NAT",
   "marks": 2,
   "diff": "standard",
   "stem": "An Atwood machine carries $m_1=1$ kg and $m_2=2$ kg; the pulley is a uniform disk of mass $M=2$ kg (rope does not slip). Taking $g=9.8$ m/s$^{2}$, report the acceleration in m/s$^{2}$ (2 d.p.).",
   "ans": "2.43 to 2.47",
   "sol": "$a=\\dfrac{(m_2-m_1)g}{m_1+m_2+I/R^{2}}=\\dfrac{(1)(9.8)}{1+2+1}=\\dfrac{9.8}{4}=2.45$ m/s$^{2}$ (disk: $I=\\tfrac12MR^{2}$).",
   "tags": [
    "atwood",
    "massive-pulley"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-CM-40",
   "n": 40,
   "lane": "classical",
   "sub": "hamiltonian",
   "type": "MSQ",
   "marks": 2,
   "diff": "apex",
   "stem": "By Noether's theorem, which continuous-symmetry → conservation-law pairings are correct?",
   "opts": [
    "Time-translation $\\to$ energy conservation",
    "Space-translation $\\to$ linear momentum conservation",
    "Rotation $\\to$ angular momentum conservation",
    "Parity $\\to$ action conservation"
   ],
   "ans": [
    0,
    1,
    2
   ],
   "sol": "A, B, C are the three canonical spacetime examples of Noether's theorem. Parity is a DISCRETE symmetry — Noether's theorem (first) does not yield a conserved current for it, and \"action conservation\" is not a law (D ✗).",
   "tags": [
    "noether",
    "symmetries"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-EM-41",
   "n": 41,
   "lane": "emtheory",
   "sub": "electrostatics",
   "type": "MCQ",
   "marks": 1,
   "diff": "seed",
   "stem": "A point charge $q$ sits at the centre of a cube. The electric flux through ONE face of the cube is",
   "opts": [
    "$\\dfrac{q}{6\\varepsilon_{0}}$",
    "$\\dfrac{q}{24\\varepsilon_{0}}$",
    "$0$",
    "$\\dfrac{q}{\\varepsilon_{0}}$"
   ],
   "ans": 0,
   "sol": "Gauss: total flux $q/\\varepsilon_0$; by the 6-fold symmetry each face carries $q/(6\\varepsilon_0)$. (Corner placement would give $q/(24\\varepsilon_0)$ — the distractor.)",
   "tags": [
    "gauss-law",
    "flux"
   ],
   "correctMarks": 1,
   "wrongMarks": 0.333
  },
  {
   "id": "PF-EM-42",
   "n": 42,
   "lane": "emtheory",
   "sub": "electrostatics",
   "type": "MCQ",
   "marks": 1,
   "diff": "seed",
   "stem": "An infinite line charge of density $\\lambda$ produces, at perpendicular distance $s$, an electric field of magnitude",
   "opts": [
    "$\\dfrac{\\lambda}{4\\pi\\varepsilon_{0}s}$",
    "$\\dfrac{\\lambda}{2\\pi\\varepsilon_{0}s}$",
    "$\\dfrac{\\lambda}{2\\pi\\varepsilon_{0}s^{2}}$",
    "$\\dfrac{\\lambda}{\\pi\\varepsilon_{0}s}$"
   ],
   "ans": 1,
   "sol": "Cylindrical Gauss pillbox of length $\\ell$: $E\\,(2\\pi s\\ell)=\\lambda\\ell/\\varepsilon_0\\Rightarrow E=\\dfrac{\\lambda}{2\\pi\\varepsilon_0 s}$.",
   "tags": [
    "gauss-law",
    "line-charge"
   ],
   "correctMarks": 1,
   "wrongMarks": 0.333
  },
  {
   "id": "PF-EM-43",
   "n": 43,
   "lane": "emtheory",
   "sub": "electrostatics",
   "type": "NAT",
   "marks": 2,
   "diff": "standard",
   "stem": "A coaxial cable has inner radius $a=1$ mm and outer radius $b=2$ mm. Report its capacitance per unit length in pF/m (1 d.p.).",
   "ans": "80.0 to 80.5",
   "sol": "$C^{\\prime}=\\dfrac{2\\pi\\varepsilon_0}{\\ln(b/a)}=\\dfrac{2\\pi\\times8.854\\times10^{-12}}{\\ln2}=\\dfrac{5.563\\times10^{-11}}{0.6931}=8.03\\times10^{-11}$ F/m $=80.3$ pF/m.",
   "tags": [
    "capacitance",
    "coaxial"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-EM-44",
   "n": 44,
   "lane": "emtheory",
   "sub": "electrostatics",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "A point charge $q$ is held a distance $d$ above an infinite grounded conducting plane. The magnitude of the force on the charge is",
   "opts": [
    "$\\dfrac{q^{2}}{8\\pi\\varepsilon_{0}d^{2}}$",
    "$\\dfrac{q^{2}}{32\\pi\\varepsilon_{0}d^{2}}$",
    "$\\dfrac{q^{2}}{16\\pi\\varepsilon_{0}d^{2}}$",
    "$\\dfrac{q^{2}}{4\\pi\\varepsilon_{0}d^{2}}$"
   ],
   "ans": 2,
   "sol": "Image method: image $-q$ at depth $d$; separation $2d$: $F=\\dfrac{q^{2}}{4\\pi\\varepsilon_0(2d)^{2}}=\\dfrac{q^{2}}{16\\pi\\varepsilon_0 d^{2}}$, attractive.",
   "tags": [
    "image-charges",
    "method-of-images"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-EM-45",
   "n": 45,
   "lane": "emtheory",
   "sub": "magnetostatics",
   "type": "NAT",
   "marks": 1,
   "diff": "standard",
   "stem": "A circular loop of radius $0.1$ m carries $5$ A. Report the magnetic field at its centre in $\\mu$T (1 d.p.).",
   "ans": "31.3 to 31.5",
   "sol": "$B=\\dfrac{\\mu_0 I}{2R}=\\dfrac{(4\\pi\\times10^{-7})(5)}{2\\times0.1}=\\pi\\times10^{-5}=3.14\\times10^{-5}\\,\\mathrm{T}=31.4\\,\\mu$T.",
   "tags": [
    "biot-savart",
    "loop-centre"
   ],
   "correctMarks": 1,
   "wrongMarks": 0
  },
  {
   "id": "PF-EM-46",
   "n": 46,
   "lane": "emtheory",
   "sub": "magnetostatics",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "An ideal toroid has $N$ turns carrying current $I$. At a point inside the core at radius $r$ (between inner and outer radii), the field magnitude is",
   "opts": [
    "$\\dfrac{\\mu_{0}NI}{2r}$",
    "$\\dfrac{\\mu_{0}NI}{4\\pi r}$",
    "$\\mu_{0}NI$",
    "$\\dfrac{\\mu_{0}NI}{2\\pi r}$"
   ],
   "ans": 3,
   "sol": "Ampère loop of radius $r$ through the core encloses all $N$ turns: $B\\cdot2\\pi r=\\mu_0 NI\\Rightarrow B=\\dfrac{\\mu_0 NI}{2\\pi r}$.",
   "tags": [
    "ampere-law",
    "toroid"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-EM-47",
   "n": 47,
   "lane": "emtheory",
   "sub": "magnetostatics",
   "type": "MSQ",
   "marks": 2,
   "diff": "standard",
   "stem": "In magnetostatics, which statements is/are TRUE?",
   "opts": [
    "$\\nabla\\cdot\\mathbf{B}=0$",
    "$\\mathbf{B}$-field lines always form closed loops",
    "The magnetic force on a moving charge does no work",
    "$\\nabla\\times\\mathbf{B}=0$ wherever current density is non-zero"
   ],
   "ans": [
    0,
    1,
    2
   ],
   "sol": "No magnetic monopoles: $\\nabla\\cdot\\mathbf B=0$ (A ✓); lines are closed (B ✓). $\\mathbf F_m=q\\mathbf v\\times\\mathbf B\\perp\\mathbf v\\Rightarrow$ zero work (C ✓). Ampère: $\\nabla\\times\\mathbf B=\\mu_0\\mathbf J\\neq0$ where $\\mathbf J\\neq0$ (D ✗).",
   "tags": [
    "maxwell-static",
    "magnetic-work"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-EM-48",
   "n": 48,
   "lane": "emtheory",
   "sub": "induction",
   "type": "NAT",
   "marks": 2,
   "diff": "standard",
   "stem": "A conducting rod of length $1$ m slides at $5$ m/s on frictionless rails across a uniform $B=2$ T perpendicular to the rail plane. The loop resistance is $4\\,\\Omega$. Report the dissipated power in watts (integer).",
   "ans": "25",
   "sol": "EMF $\\mathcal E=BLv=2\\times1\\times5=10$ V; $P=\\mathcal E^{2}/R=100/4=25$ W. (Equals mechanical power $F_{\\rm mag}v$: $B I L v=B\\,(\\mathcal E/R)\\,L\\,v=2\\cdot2.5\\cdot1\\cdot5=25$ ✓)",
   "tags": [
    "motional-emf",
    "lenz-power"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-EM-49",
   "n": 49,
   "lane": "emtheory",
   "sub": "maxwell",
   "type": "MCQ",
   "marks": 1,
   "diff": "standard",
   "stem": "A parallel-plate capacitor is being charged by a conduction current $I$. The displacement current between the plates equals",
   "opts": [
    "$I$",
    "$2I$",
    "$0$",
    "$\\dfrac{I}{2}$"
   ],
   "ans": 0,
   "sol": "$I_d=\\varepsilon_0\\dfrac{d\\Phi_E}{dt}=\\dfrac{dQ_{\\rm enc}}{dt}=I$ — exactly the conduction current, which is what makes $\\nabla\\times\\mathbf B=\\mu_0\\mathbf J+\\mu_0\\varepsilon_0\\partial_t\\mathbf E$ consistent on either spanning surface.",
   "tags": [
    "displacement-current",
    "maxwell"
   ],
   "correctMarks": 1,
   "wrongMarks": 0.333
  },
  {
   "id": "PF-EM-50",
   "n": 50,
   "lane": "emtheory",
   "sub": "waves",
   "type": "MCQ",
   "marks": 1,
   "diff": "standard",
   "stem": "A plane electromagnetic wave in vacuum has peak electric field $E_{0}=100$ V/m. Its peak magnetic field $B_{0}$ is about",
   "opts": [
    "$1.00\\times10^{-5}$ T",
    "$3.33\\times10^{-7}$ T",
    "$3.33\\times10^{7}$ T",
    "$3.00\\times10^{-7}$ T"
   ],
   "ans": 1,
   "sol": "$B_0=E_0/c=100/(3\\times10^{8})=3.33\\times10^{-7}$ T.",
   "tags": [
    "em-wave",
    "impedance-relation"
   ],
   "correctMarks": 1,
   "wrongMarks": 0.333
  },
  {
   "id": "PF-EM-51",
   "n": 51,
   "lane": "emtheory",
   "sub": "maxwell",
   "type": "MSQ",
   "marks": 2,
   "diff": "standard",
   "stem": "At the interface between two dielectric media, with NO free surface charge and NO free surface current, which quantities are continuous across the boundary?",
   "opts": [
    "Tangential component of $\\mathbf{E}$",
    "Normal component of $\\mathbf{D}$",
    "Normal component of $\\mathbf{B}$",
    "Tangential component of $\\mathbf{E}$ is NOT continuous"
   ],
   "ans": [
    0,
    1,
    2
   ],
   "sol": "$\\nabla\\times\\mathbf E=0$ (electrostatic regime) ⇒ $E_{\\|}$ continuous ✓. $\\nabla\\cdot\\mathbf D=\\rho_f$: no free surface charge ⇒ $D_\\perp$ continuous ✓. $\\nabla\\cdot\\mathbf B=0$ always ⇒ $B_\\perp$ continuous ✓. (D asserts the false converse.)",
   "tags": [
    "boundary-conditions",
    "interfaces"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-EM-52",
   "n": 52,
   "lane": "emtheory",
   "sub": "waves",
   "type": "MCQ",
   "marks": 2,
   "diff": "apex",
   "stem": "The skin depth in copper ($\\sigma=5.8\\times10^{7}$ S/m, $\\mu\\approx\\mu_{0}$) at $f=1$ MHz is closest to",
   "opts": [
    "$0.66\\,\\mu$m",
    "$6.6\\,\\mu$m",
    "$66\\,\\mu$m",
    "$660\\,\\mu$m"
   ],
   "ans": 2,
   "sol": "$\\delta=\\sqrt{\\dfrac{2}{\\mu_0\\sigma\\omega}}=\\sqrt{\\dfrac{2}{(4\\pi\\times10^{-7})(5.8\\times10^{7})(2\\pi\\times10^{6})}}=\\sqrt{\\dfrac{2}{4.579\\times10^{8}}}=6.6\\times10^{-5}$ m $=66\\,\\mu$m.",
   "tags": [
    "skin-depth",
    "good-conductor"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-EM-53",
   "n": 53,
   "lane": "emtheory",
   "sub": "waves",
   "type": "NAT",
   "marks": 2,
   "diff": "standard",
   "stem": "A plane wave in vacuum has peak field $E_{0}=60$ V/m. Report its average intensity (power per unit area) in W/m$^{2}$ (2 d.p.).",
   "ans": "4.76 to 4.79",
   "sol": "$\\langle S\\rangle=\\dfrac{E_0^{2}}{2\\mu_0 c}=\\dfrac{3600}{2\\times(4\\pi\\times10^{-7})\\times3\\times10^{8}}=\\dfrac{3600}{753.98}=4.77$ W/m$^{2}$.",
   "tags": [
    "poynting",
    "intensity"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  },
  {
   "id": "PF-EM-54",
   "n": 54,
   "lane": "emtheory",
   "sub": "waves",
   "type": "MCQ",
   "marks": 2,
   "diff": "apex",
   "stem": "A rectangular waveguide has broad dimension $a=2$ cm. The cutoff frequency of the dominant TE$_{10}$ mode is",
   "opts": [
    "$15.0$ GHz",
    "$3.75$ GHz",
    "$5.0$ GHz",
    "$7.5$ GHz"
   ],
   "ans": 3,
   "sol": "$f_c=\\dfrac{c}{2a}=\\dfrac{3\\times10^{8}}{2\\times0.02}=7.5\\times10^{9}$ Hz $=7.5$ GHz.",
   "tags": [
    "waveguide",
    "cutoff"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-EM-55",
   "n": 55,
   "lane": "emtheory",
   "sub": "dielectrics",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "A parallel-plate capacitor (plate area $A$, separation $d$, empty capacitance $C_{0}=\\varepsilon_{0}A/d$) has a dielectric slab of constant $\\kappa=3$ and thickness $d/2$ inserted parallel to the plates. The new capacitance is",
   "opts": [
    "$1.5\\,C_{0}$",
    "$2\\,C_{0}$",
    "$3\\,C_{0}$",
    "$C_{0}$"
   ],
   "ans": 0,
   "sol": "Series combination: air gap $d/2$ ($C=2C_0$) and dielectric slab ($C=2\\kappa C_0=6C_0$): $C=\\dfrac{(2C_0)(6C_0)}{2C_0+6C_0}=\\dfrac{12}{8}C_0=1.5\\,C_0$. (General: $C=\\tfrac{2\\kappa}{1+\\kappa}C_0$.)",
   "tags": [
    "dielectric-slab",
    "series-capacitance"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-EM-56",
   "n": 56,
   "lane": "emtheory",
   "sub": "electrostatics",
   "type": "NAT",
   "marks": 1,
   "diff": "standard",
   "stem": "Air breaks down at about $E=3\\times10^{6}$ V/m. Report the electrostatic energy density (J/m$^{3}$) at this field (1 d.p.).",
   "ans": "39.5 to 40.1",
   "sol": "$u=\\tfrac12\\varepsilon_0 E^{2}=\\tfrac12\\times8.854\\times10^{-12}\\times9\\times10^{12}=\\tfrac12\\times79.7=39.8$ J/m$^{3}$.",
   "tags": [
    "energy-density",
    "electrostatics"
   ],
   "correctMarks": 1,
   "wrongMarks": 0
  },
  {
   "id": "PF-EM-57",
   "n": 57,
   "lane": "emtheory",
   "sub": "electrostatics",
   "type": "MCQ",
   "marks": 1,
   "diff": "seed",
   "stem": "Far from an electric dipole, the ratio of the equatorial field magnitude to the axial field magnitude (at the same distance) is",
   "opts": [
    "$\\dfrac14$",
    "$\\dfrac12$",
    "$2$",
    "$1$"
   ],
   "ans": 1,
   "sol": "$E_{\\rm axial}=\\dfrac{2p}{4\\pi\\varepsilon_0 r^{3}}$, $E_{\\rm equat}=\\dfrac{p}{4\\pi\\varepsilon_0 r^{3}}$ ⇒ ratio $=\\tfrac12$.",
   "tags": [
    "dipole-field",
    "scaling"
   ],
   "correctMarks": 1,
   "wrongMarks": 0.333
  },
  {
   "id": "PF-EM-58",
   "n": 58,
   "lane": "emtheory",
   "sub": "electrostatics",
   "type": "MCQ",
   "marks": 2,
   "diff": "apex",
   "stem": "A point charge $q$ is placed at distance $a>R$ from the centre of a grounded conducting sphere of radius $R$. The image charge is located at distance (from the centre)",
   "opts": [
    "$\\dfrac{a^{2}}{R}$",
    "$\\dfrac{R}{a}$",
    "$\\dfrac{R^{2}}{a}$",
    "$\\dfrac{a}{R}$"
   ],
   "ans": 2,
   "sol": "Standard result: image $q^{\\prime}=-qR/a$ sits at $b=R^{2}/a$ on the radial line to the charge. Check limits: $a\\to R^{+}$ gives $b\\to R^{-}$ (image meets surface) ✓",
   "tags": [
    "image-charges",
    "sphere"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-EM-59",
   "n": 59,
   "lane": "emtheory",
   "sub": "magnetostatics",
   "type": "MCQ",
   "marks": 2,
   "diff": "standard",
   "stem": "Two long parallel wires a distance $d$ apart each carry current $I$ in the SAME direction. The force per unit length between them is",
   "opts": [
    "$\\dfrac{\\mu_{0}I^{2}}{2\\pi d}$, repulsive",
    "$\\dfrac{\\mu_{0}I^{2}}{4\\pi d}$, attractive",
    "$\\dfrac{\\mu_{0}I^{2}}{4\\pi d^{2}}$, attractive",
    "$\\dfrac{\\mu_{0}I^{2}}{2\\pi d}$, attractive"
   ],
   "ans": 3,
   "sol": "Wire 2 sits in $B=\\mu_0 I/(2\\pi d)$ of wire 1: $F/\\ell=IB=\\mu_0 I^{2}/(2\\pi d)$; parallel currents attract (right-hand rule + $\\mathbf I\\ell\\times\\mathbf B$ direction).",
   "tags": [
    "force-between-wires",
    "ampere"
   ],
   "correctMarks": 2,
   "wrongMarks": 0.667
  },
  {
   "id": "PF-EM-60",
   "n": 60,
   "lane": "emtheory",
   "sub": "magnetostatics",
   "type": "NAT",
   "marks": 2,
   "diff": "apex",
   "stem": "For a uniform field $\\mathbf B=B_{0}\\hat{z}$, one may choose the symmetric-gauge vector potential $\\mathbf A=\\tfrac{1}{2}\\mathbf B\\times\\mathbf r$. With $B_{0}=0.5$ T, evaluate $|\\mathbf A|$ at the point $(x,y,z)=(0.4,\\,0,\\,7)$ m, in T·m (2 d.p.).",
   "ans": "0.1",
   "sol": "$|\\mathbf A|=\\tfrac12 B_{0}r_{\\perp}$ where $r_{\\perp}=\\sqrt{x^{2}+y^{2}}=0.4$ m (z is along $\\mathbf B$, does not enter): $|\\mathbf A|=\\tfrac12\\times0.5\\times0.4=0.1$ T·m. Check: symmetries of uniform $B$ respected ✓",
   "tags": [
    "vector-potential",
    "gauge"
   ],
   "correctMarks": 2,
   "wrongMarks": 0
  }
 ]
};
