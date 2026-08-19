/* topicforge_taxonomy.js — lane × subtopic rule tables + concept-drill rule set.
   Pure data. Every rule is an auditable regex source string, matched case-insensitive
   against normalized question text (stem + options, whitespace-collapsed). */
'use strict';
const R = s => new RegExp(s, 'i');

module.exports = { R,
LANES: [
 { id: 'mathphys', title: 'Mathematical Physics', subs: [
   ['linear-algebra', ['eigen', 'matrix|matrices', 'determinant', 'trace of', 'invertible', 'rank of']],
   ['vector-calculus', ['\\bcurl\\b', 'divergence', 'stokes', "gauss'?s? (divergence )?theorem", 'line integral', 'surface integral', 'gradient', '\\bnabla\\b']],
   ['complex-analysis', ['residue', 'contour', 'analytic', 'cauchy', '\\bpole', 'laurent', 'conformal', 'argument principle']],
   ['ode-pde', ['differential equation', 'frobenius', 'series solution', 'wave equation', 'heat equation', 'diffusion equation', '\\bpde\\b', '\\bode\\b']],
   ['special-functions', ['legendre', 'bessel', 'hermite', 'laguerre', 'spherical harmonic', 'gamma function', 'beta function', 'generating function']],
   ['fourier-laplace', ['fourier transform', 'fourier series', 'laplace transform', 'convolution']],
   ['greens-functions', ["green'?s function"]],
   ['probability', ['probability', 'random variable', 'poisson distribution', 'gaussian distribution', 'normal distribution', 'variance', 'standard deviation', 'expectation value', 'bayes', 'distribution function']],
   ['group-theory', ['\\bgroup\\b', 'representation', 'su\\(2\\)', 'so\\(3\\)', 'symmetry group', 'point group', 'permutation group']]
 ] },
 { id: 'classical', title: 'Classical Mechanics', subs: [
   ['constraints', ['constraint', "d'?alembert", 'virtual work', 'holonomic', 'generalized force']],
   ['lagrangian', ['lagrang', 'euler-lagrange', 'generalized coordinate', 'cyclic coordinate']],
   ['central-orbits', ['kepler', 'orbit', 'central force', 'inverse square', 'apsidal', 'effective potential', 'areal velocity', 'perihelion']],
   ['small-oscillations', ['normal mode', 'small oscillation', 'coupled oscillator', 'frequency of (the )?oscillat', 'eigenfrequenc']],
   ['rigid-body', ['moment of inertia', 'inertia tensor', 'torque', 'angular velocity', 'precession', 'gyroscop', 'euler angles', 'rigid body', 'rolling']],
   ['hamiltonian', ['hamiltonian', "hamilton'?s equation", 'phase[ -]space', 'canonical equation']],
   ['canonical-pb', ['poisson bracket', 'canonical transformation', 'generating function', 'liouville', 'action[- ]angle', 'action variable']],
   ['relativity', ['lorentz transform', 'relativistic', 'proper time', 'time dilation', 'length contraction', 'rest (mass|energy|frame)', 'inertial frame', 'four[- ](vector|momentum)', 'simultaneit', 'twin paradox']],
   ['fluids', ['fluid', 'bernoulli', 'viscos', 'reynolds', 'streamline', 'laminar']]
 ] },
 { id: 'emtheory', title: 'Electromagnetic Theory', subs: [
   ['electrostatics', ['electrostatic', 'coulomb', 'electric field', 'point charge', "gauss'?s? law", 'electric potential', 'electric flux', 'charge distribution', 'electric dipole']],
   ['images-multipole', ['method of images', 'image charge', 'multipole', 'quadrupole', 'monopole']],
   ['boundary-value', ["laplace'?s? equation", 'boundary (condition|value)', 'conducting (sphere|shell|cylinder)', 'separation of variables', 'uniqueness theorem']],
   ['magnetostatics', ['magnetic field', 'ampere', 'biot[- ]savart', 'vector potential', 'magnetostatic', 'current[- ](loop|carrying)', 'solenoid', 'toroid', 'magnetic dipole']],
   ['dielectrics', ['dielectric', 'polarization', 'susceptibility', 'displacement (vector|field)', 'bound charge', 'permittivity', 'capacitor']],
   ['maxwell-poynting', ['maxwell', 'poynting', 'displacement current', 'electromagnetic wave', 'plane (electromagnetic )?wave', 'em wave', 'electromagnetic field']],
   ['waves-media', ['refractive index', 'skin depth', 'conducting medium', 'plasma frequency', 'dispersion relation', 'phase velocity', 'group velocity', 'wave propagat', 'attenuat']],
   ['fresnel-polarization', ['fresnel', 'brewster', 'total internal reflection', 'reflection coefficient', 'circularly polarized', 'linearly polarized', 'unpolarized', 'malus']],
   ['waveguides', ['waveguide', 'transmission line', 'cut[- ]?off frequency', '\\bte\\s?\\d*\\s?mode', '\\btm\\s?\\d*\\s?mode', 'coaxial']],
   ['radiation', ['radiat', 'larmor', 'oscillating dipole', 'antenna', 'radiation resistance']]
 ] },
 { id: 'quantum', title: 'Quantum Mechanics', subs: [
   ['operators-commutators', ['commutator', '\\boperator', 'expectation value', 'hermitian', 'observable', 'eigen(state|value|function)', 'uncertainty']],
   ['harmonic-oscillator', ['harmonic oscillator', 'ladder operator', 'raising (and|operator)', 'lowering operator', 'annihilation', 'creation operator', 'zero[- ]point']],
   ['angular-spin', ['angular momentum', '\\bspin\\b', 'spinor', 'pauli', 'clebsch', 'addition of angular', 'spin precession']],
   ['hydrogen-atom', ['hydrogenic', 'hydrogen (atom|ion|spectrum)', 'bohr (radius|model|orbit)', 'radial (wave)?function', 'rydberg', 'balmer', 'lyman']],
   ['perturbation', ['perturb']],
   ['variational-wkb', ['variational', 'trial (wave)?function', '\\bwkb\\b', 'turning point', 'connection formula']],
   ['wells-tunneling', ['(in)?finite (square )?well', 'potential (well|step|barrier)', 'tunn?el', 'transmission (coefficient|probability|amplitude)', 'reflection (coefficient|probability|amplitude)', 'bound state', 'particle in a box', 'delta[- ]function potential']],
   ['two-level', ['two[- ]level', 'rabi', 'bloch (sphere|vector)', 'superposition', 'qubit']],
   ['scattering', ['scatter', 'born approximation', 'partial wave', 'phase shift', 'cross[- ]section', 'impact parameter']],
   ['identical-particles', ['identical particle', 'symmetric (state|wavefunction|spin)', 'antisymmetric', 'exchange (symmetry|operator|integral)', 'pauli exclusion', 'slater determinant', 'fermion', 'boson']]
 ] },
 { id: 'thermo', title: 'Thermo & Statistical Mechanics', subs: [
   ['laws-maxwell', ['first law', 'second law', 'third law', 'thermodynamic', 'maxwell relation', 'entropy', 'reversible|irreversible', 'helmholtz', 'gibbs free', 'enthalpy', 'internal energy', 'adiabatic', 'isothermal', 'isobaric', 'isochoric', 'heat capacity', 'specific heat']],
   ['engines-cycles', ['carnot', 'heat engine', 'efficiency', 'refrigerat', 'otto', 'diesel cycle', 'stirling', 'heat pump', '\\bengine']],
   ['phase-transitions', ['phase transition', 'clapeyron', 'clausius', 'latent heat', 'critical (point|temperature)', 'phase diagram', 'van der waals', 'coexistence', 'triple point', 'first[- ]order']],
   ['kinetic-theory', ['kinetic theory', 'maxwell[- ]boltzmann (distribution|speed|velocity)', 'mean free path', 'rms (velocity|speed)', 'most probable', 'equipartition', 'root mean square', 'velocity distribution', 'speed distribution']],
   ['ensembles-partition', ['partition function', 'canonical ensemble', 'grand canonical', 'microcanonical', 'boltzmann (factor|distribution)', 'ensemble average', 'occupation number']],
   ['quantum-stats', ['bose[- ]einstein', 'fermi[- ]dirac', 'fermi (level|energy|temperature|momentum|sphere)', 'chemical potential', 'degenerate', 'density of states']],
   ['blackbody', ['black ?body', 'stefan', "planck'?s? (law|radiation|distribution|formula)", 'wien', 'rayleigh', 'radiation (pressure|energy density)', 'photon gas']],
   ['bec', ['condensat', '\\bbec\\b', 'bose gas']],
   ['fluctuations', ['fluctuation', 'brownian', 'thermal noise']],
   ['ising-critical', ['ising', 'mean field', 'critical exponent', 'magnetization', 'spontaneous']]
 ] },
 { id: 'electronics', title: 'Electronics & Experimental', subs: [
   ['diode-circuits', ['diode', 'rectifier', 'zener', 'clipper', 'clamp', 'p-n junction']],
   ['bjt-fet-amplifiers', ['\\bbjt\\b', 'transistor', 'common[- ](emitter|base|collector)', '\\bfet\\b', 'mosfet', 'current gain', 'biasing', 'h-?parameter', 'amplif']],
   ['opamp', ['op[- ]?amp', 'operational amplifier', 'integrator circuit', 'differentiator', '(low|high|band)[- ]pass filter', 'slew rate']],
   ['digital-logic', ['flip[- ]?flop', 'counter', 'logic gate', 'boolean', 'adder', 'multiplexer', 'decoder', 'shift register', '\\bmod-?\\d+', 'karnaugh|k-?map', '\\bxor\\b', '\\bnand\\b', '\\bnor\\b', 'logic circuit', 'truth table', 'binary']],
   ['adc-dac', ['\\badc\\b', '\\bdac\\b', 'analog[- ]to[- ]digital', 'digital[- ]to[- ]analog', 'quantization']],
   ['oscillators', ['oscillator', 'wien bridge', 'astable', 'bistable', 'schmitt', '\\b555\\b', 'multivibrator']],
   ['experimental-methods', ['error (analysis|propagation)', 'least[- ]square', 'uncertainty', '(accuracy|precision) of', 'standard error', 'significant figure']]
 ] },
 { id: 'atomic', title: 'Atomic & Molecular', subs: [
   ['fine-hyperfine', ['fine structure', 'hyperfine', 'lamb shift']],
   ['coupling-terms', ['ls[- ]coupling', 'jj[- ]coupling', 'term (symbol|value)', 'lande', 'spectroscopic (term|notation)', 'multiplicity', 'russell']],
   ['zeeman-stark', ['zeeman', 'stark effect', 'paschen[- ]back']],
   ['selection-rules', ['selection rule', 'allowed transition', 'forbidden transition', 'transition probability', 'metastable']],
   ['mol-spectra', ['rotational (spectrum|level|transition|constant|energy)', 'vibrational (spectrum|level|transition|frequency|energy)', 'raman', 'microwave (spectrum|transition)', 'infrared', 'molecular (spectra|spectrum|orbit)', 'dissociation energy', 'franck[- ]condon', 'stokes line', 'morse potential']],
   ['laser', ['laser', 'population inversion', 'stimulated emission', 'spontaneous emission', 'einstein (a|b) coefficient', 'optical pumping', 'q-?switch']],
   ['nmr-esr', ['\\bnmr\\b', '\\besr\\b', '(nuclear|electron) (spin )?(magnetic )?resonance', 'larmor (frequency|precession)', 'gyromagnetic', 'g-?factor']]
 ] },
 { id: 'nuclear', title: 'Nuclear & Particle', subs: [
   ['semf-binding', ['binding energy', 'semi[- ]?empirical mass', 'mass formula', 'separation energy', 'liquid drop model']],
   ['shell-model', ['shell model', 'magic number', 'nuclear (spin|parity|ground state|level|shape)', 'shell closure', 'collective model']],
   ['decay-activity', ['half[- ]life', 'decay constant', 'activity', 'radioactiv', 'alpha decay', 'beta (decay|particle|spectrum)', 'gamma (decay|ray|emission)', 'mean life', 'daughter', 'decays']],
   ['reactions-qvalue', ['q[- ]?value', 'reaction', 'threshold (energy|kinetic)', 'endoergic', 'exoergic', 'compound nucleus', 'cross section']],
   ['fission-fusion', ['fission', 'fusion', 'chain reaction', 'moderator', '(nuclear )?reactor', 'breeder']],
   ['detectors-accelerators', ['detector', 'accelerator', 'cyclotron', 'synchrotron', 'geiger', 'scintillation', 'proportional counter', 'bubble chamber']],
   ['conservation-quark', ['conservation (law|of)|conserved', 'quark', 'lepton', 'baryon', 'meson', 'strangeness', 'isospin', 'parity', 'gell[- ]mann', 'eightfold', 'helicity', 'neutrino', 'charge conjugation', 'time reversal', 'muon', 'pion', 'kaon']],
   ['decay-kinematics', ['decay (width|rate|mode)', 'lifetime', 'branching ratio', 'cent(er|re)[- ]of[- ]mass', 'mandelstam', 'available energy', 'feynman']]
 ] },
 { id: 'solidstate', title: 'Solid State / Condensed Matter', subs: [
   ['crystal-structure', ['crystal', 'lattice', '\\bbasis\\b', 'miller', 'bravais', 'unit cell', 'packing (fraction|efficiency)', 'coordination number', '\\bfcc\\b', '\\bbcc\\b', 'interplanar', 'nearest neighbou?r']],
   ['reciprocal-diffraction', ['reciprocal (lattice|vector)', 'diffraction', 'bragg', 'laue', 'structure factor', 'x-?ray', 'brillouin zone']],
   ['phonons-specheat', ['phonon', 'einstein (model|temperature|frequency)', 'debye', 'acoustic (mode|branch)', 'optical (mode|branch)', 'specific heat', 'heat capacity']],
   ['free-electron', ['free electron', 'density of states', 'drude', 'sommerfeld', 'fermi (surface|sphere|wave)']],
   ['band-theory', ['band (theory|gap|structure|width)', 'energy band', 'kronig[- ]penney', 'bloch', 'effective mass', 'nearly free', 'forbidden band']],
   ['semiconductors', ['semiconductor', 'intrinsic', 'extrinsic', 'dop(ed|ing)', 'hall (effect|coefficient|voltage|mobility)', 'carrier (concentration|density)', '\\bmobility\\b', 'p-?type', 'n-?type', 'hole concentration']],
   ['magnetism', ['diamagnet', 'paramagnet', 'ferromagnet', 'antiferromagnet', 'curie', 'weiss', 'susceptibility', 'domain', 'hysteresis']],
   ['superconductivity', ['superconduct', 'meissner', 'critical (magnetic )?field', 'cooper pair', '\\bbcs\\b', 'london equation']]
 ] },
 { id: 'aptitude', title: 'General Aptitude (GA / Part A)', ga: true, subs: [
   ['verbal', ['grammar', 'tense', 'article', 'synonym', 'antonym', 'comprehension', 'passage', 'vocabulary', 'idiom', 'phrase', 'sentence', 'word.{0,12}(mean|opposite|closest)', 'sequenc(e|ing) of sentences']],
   ['quant-core', ['ratio', 'percentage|percent', 'profit|loss', 'interest', 'speed|distance|train', 'time and work|work', 'average|mean of', 'mixture', 'divisib|remainder|hcf|lcm', 'fraction', 'salary|wage|cost price|selling', 'number']],
   ['data-interpretation', ['graph|chart|pie chart|bar (chart|graph)|table (below|given|shown)|data (show|given|interpretation)|histogram']],
   ['probability-combinatorics', ['probability|dice|coin|cards|permutation|combination|random(ly)? (select|choose|draw|pick)|median|mode\\b|arrang']],
   ['series-patterns', ['series|next (number|term)|missing (number|term|letter)|sequence of numbers|pattern']],
   ['logical-reasoning', ['analogy|coding|coded|blood relation|direction|puzzle|seating|syllogism|conclusion follows|statement.{0,20}conclusion|logical|odd one out|rank|queue']],
   ['spatial', ['fold(ing|ed)|rotation|figure|cube|net of|pattern completion|embedded figure|paper (cut|fold)|shape|symmetr|mirror']],
   ['everyday-science', ['vitamin|disease|plant|animal|atmospher|metal|acid|everyday|daily life|boiling|human body|instrument|water']]
 ] }
],
CONCEPTS: [
 ['partition-function-two-level', ['partition function', 'two[- ]level system']],
 ['normal-modes', ['normal mode']],
 ['lorentz-arithmetic', ['lorentz transform', 'lorentz factor', 'time dilation', 'length contraction']],
 ['perturbation-theory', ['perturbation']],
 ['spin-precession', ['spin precession', 'larmor precession']],
 ['opamp-golden-rules', ['op[- ]?amp', 'operational amplifier']],
 ['flipflop-counters', ['flip[- ]?flop', 'mod-?\\d+ counter', 'shift register', '\\bcounter']],
 ['zeeman-patterns', ['zeeman']],
 ['bragg-laue-diffraction', ['bragg', 'laue', 'x-?ray diffraction']],
 ['debye-t3', ['debye', 'low[- ]temperature specific heat']],
 ['radioactive-decay', ['half[- ]life', 'radioactiv', 'decay constant', 'secular equilibrium']],
 ['qvalue-thresholds', ['q[- ]?value', 'threshold (energy|kinetic)']],
 ['contour-residues', ['residue', 'contour']],
 ['commutator-identities', ['commutator', 'commutation relation']],
 ['maxwell-relations', ['maxwell relation']],
 ['group-vs-phase-velocity', ['group velocity', 'phase velocity']],
 ['carnot-cycles', ['carnot', 'otto cycle', 'diesel cycle', 'heat engine']],
 ['method-of-images', ['method of images', 'image charge']],
 ['wells-bound-states', ['(in)?finite (square )?well', 'potential well', 'particle in a box', 'bound state']],
 ['scattering-cross-section', ['scattering cross[- ]section', 'differential cross[- ]section', 'phase shift']],
 ['harmonic-oscillator', ['harmonic oscillator']],
 ['hydrogen-spectra', ['balmer', 'lyman', 'paschen series', 'rydberg']],
 ['semf-fission', ['semi[- ]?empirical mass', 'binding energy per nucleon', 'fission']],
 ['hall-effect', ['hall (effect|coefficient|voltage)']],
 ['band-effective-mass', ['effective mass', 'band gap', 'energy band']],
 ['pn-junction-diode', ['p-n junction', 'zener', 'rectifier']],
 ['digital-counters', ['mod-?\\d+', 'ripple counter', 'jk flip', 'd flip']],
 ['entropy-calculations', ['entropy (change|of mixing|increase)']],
 ['series-completion', ['series', 'next (number|term)', 'missing (number|term)']],
 ['clocks-calendars', ['clock', 'calendar', 'day of the week']],
 ['dice-coins-probability', ['dice', 'coin(s)? (is|are) (tossed|thrown)', 'probability']],
 ['data-graphs', ['pie chart', 'bar (chart|graph)', 'line graph']],
 ['ratio-percentage', ['percentage', 'percent', 'ratio of']]
]
};
