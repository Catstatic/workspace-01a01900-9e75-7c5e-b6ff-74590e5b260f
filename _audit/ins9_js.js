/* ============================================================
   GAMEFORGE (round 10) — unlimited & difficulty-true break games
   - Equation Sprint: infinite question queue.
       · built-in procedural physics generator (works offline)
       · optional ✦ AI batch prefetch when AI is configured —
         strict JSON validation, AI-GENERATED badge, and any failure
         silently falls back to the local generator (never blocks play)
   - Gravitational Slingshot: the 5 handcrafted challenges + 55
       seeded, unique generated sectors (hazard asteroids, twin suns,
       needle gates, crossfire wells)
   - Real difficulty wiring: level now changes attempts, gravity
     strength, gate size and per-question pace — not just a label.
   Official data is never touched; everything lives in GameForge.
   ============================================================ */
(function(){
  const LEVELS = ['noobie','adept','elite','godhood'];
  function lix(level){ const i = LEVELS.indexOf(level); return i < 0 ? 1 : i; }
  function gfToast(msg){ try{ if(typeof showToast === 'function') showToast(msg); }catch(e){} }

  /* deterministic rng — used for slingshot sectors so sector N is the same on every visit */
  function mulberry32(seed){ let a = seed >>> 0; return function(){ a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function ri(rnd,min,max){ return min + Math.floor(rnd() * (max - min + 1)); }
  function fmt(x){ const r = Math.round(x * 100) / 100; return String(r); }

  /* ---------- Equation Sprint: procedural generator ---------- */
  function mcqNum(rnd, q, correct, unit, wrongs){
    const cu = unit || '';
    const cStr = fmt(correct) + cu;
    const w = [];
    (wrongs || []).forEach(v => { const s = fmt(v) + cu; if (s !== cStr && !w.includes(s)) w.push(s); });
    const fillers = [correct * 2, correct / 2, correct + 2, correct * 1.5, correct + 1, correct - 1, correct * 3];
    let k = 0;
    while (w.length < 3 && k < 60){ const cand = fmt(fillers[k % fillers.length] + Math.floor(k / fillers.length) + 1) + cu; if (cand !== cStr && !w.includes(cand)) w.push(cand); k++; }
    const opts = [cStr].concat(w.slice(0, 3));
    for (let i = opts.length - 1; i > 0; i--){ const j = Math.floor(rnd() * (i + 1)); const t = opts[i]; opts[i] = opts[j]; opts[j] = t; }
    return {q, o: opts, a: opts.indexOf(cStr)};
  }
  function mcqText(rnd, q, correct, wrongs){
    const w = []; (wrongs || []).forEach(s => { s = String(s); if (s !== correct && !w.includes(s)) w.push(s); });
    const pads = ['none of these', 'the exact opposite', 'it stays undefined', 'zero everywhere'];
    let pk = 0;
    while (w.length < 3 && pk < pads.length * 2){ const cand = pads[pk % pads.length] + (pk >= pads.length ? ' (' + (pk + 1) + ')' : ''); if (cand !== correct && !w.includes(cand)) w.push(cand); pk++; }
    const opts = [correct].concat(w.slice(0, 3));
    for (let i = opts.length - 1; i > 0; i--){ const j = Math.floor(rnd() * (i + 1)); const t = opts[i]; opts[i] = opts[j]; opts[j] = t; }
    return {q, o: opts, a: opts.indexOf(correct)};
  }
  /* families: tier = minimum difficulty index that unlocks them */
  const FAMILIES = [
    {tier:0, make(rnd){ const m = ri(rnd,2,14), a = ri(rnd,2,12); return mcqNum(rnd,'F = m·a · m = '+m+' kg, a = '+a+' m/s² · F = ?', m*a, ' N', [m+a, 2*m*a, m+a+2]); }},
    {tier:0, make(rnd){ const I = ri(rnd,1,12), R = ri(rnd,2,20); return mcqNum(rnd,'A '+R+' Ω resistor carries '+I+' A. V = ?', I*R, ' V', [I+R, R-I+8, 2*I*R]); }},
    {tier:0, make(rnd){ const V = ri(rnd,2,24)*10, I = ri(rnd,1,8); return mcqNum(rnd,'A device runs at '+V+' V drawing '+I+' A. Power P = ?', V*I, ' W', [V+I, V*I*2, V*10+I]); }},
    {tier:0, make(rnd){ const m = ri(rnd,2,15), v = ri(rnd,2,12); return mcqNum(rnd,'Momentum p = m·v · m = '+m+' kg, v = '+v+' m/s · p = ?', m*v, ' kg·m/s', [m+v, 2*m*v, m*m]); }},
    {tier:0, make(rnd){ const u = ri(rnd,0,6), v = u+ri(rnd,5,22), t = ri(rnd,2,9); return mcqNum(rnd,'v = u + a·t · u = '+u+', v = '+v+' m/s, t = '+t+' s · a = ?', (v-u)/t, ' m/s²', [(v-u)*t, (v+u)/t, v/t+1]); }},
    {tier:0, fixed:true, make(rnd){ const v=['For a photon moving through vacuum, E = ?','A photon carrying momentum p has energy…','The relativistic energy of a photon equals…']; return mcqText(rnd,v[ri(rnd,0,2)],'pc',['mc','pc²','p/c']); }},
    {tier:0, fixed:true, make(rnd){ const v=['E = mc² — if the mass doubles, the energy…','E = mc² — doubling the rest mass changes E by…','Rest-energy follows E = mc²; m becomes 2m, so E…']; return mcqText(rnd,v[ri(rnd,0,2)],'doubles',['halves','quadruples','stays unchanged']); }},
    {tier:1, make(rnd){ const m = ri(rnd,2,14)*1, v = ri(rnd,2,12); return mcqNum(rnd,'Kinetic energy ½m·v² · m = '+m+' kg, v = '+v+' m/s · KE = ?', 0.5*m*v*v, ' J', [m*v*v, m*v, 0.5*m*v]); }},
    {tier:1, make(rnd){ const a = ri(rnd,2,8)*1, t = ri(rnd,2,8); return mcqNum(rnd,'From rest, a = '+a+' m/s² for t = '+t+' s · distance s = ½a·t² = ?', 0.5*a*t*t, ' m', [a*t*t, a*t, 0.5*a*t]); }},
    {tier:1, make(rnd){ const f = ri(rnd,2,20), l = ri(rnd,2,15); return mcqNum(rnd,'Wave: v = f·λ · f = '+f+' Hz, λ = '+l+' m · v = ?', f*l, ' m/s', [f+l, f*l*2, l-f+10]); }},
    {tier:1, make(rnd){ const m = ri(rnd,1,12), h = ri(rnd,2,18); return mcqNum(rnd,'PE = m·g·h with g = 10 m/s² · m = '+m+' kg, h = '+h+' m · PE = ?', m*10*h, ' J', [m*h, m*10+h, m*h*10*2]); }},
    {tier:1, fixed:true, make(rnd){ const v=['Δx·Δp ≥ ℏ/2 expresses the…','Which principle is written Δx·Δp ≥ ℏ/2 ?','Heisenberg\u2019s famous limit Δx·Δp ≥ ℏ/2 is the…']; return mcqText(rnd,v[ri(rnd,0,2)],'uncertainty principle',['Pauli exclusion rule','equivalence principle','Doppler law']); }},
    {tier:2, make(rnd){ const k = ri(rnd,2,9); const v=['Coulomb force F ∝ 1/r²','Gravitational field g ∝ 1/r²','Point-charge electric field E ∝ 1/r²','Light intensity from a point source I ∝ 1/r²']; return mcqText(rnd,v[ri(rnd,0,3)]+' — the distance grows ×'+k+'. The quantity becomes…','1/'+(k*k)+' of before',['1/'+k+' of before','×'+k+' of before','×'+(k*k)+' of before']); }},
    {tier:2, make(rnd){ const a = ri(rnd,3,12), b = ri(rnd,2,a-1); return mcqNum(rnd,'Infinite 1D well: Eₙ ∝ n² · E'+a+' / E'+b+' = ?', (a*a)/(b*b), '', [a/b, 2*a/b, (a*a)/(b*b)*2]); }},
    {tier:2, make(rnd){ const hf = ri(rnd,3,14), phi = ri(rnd,1,hf-2); return mcqNum(rnd,'Photoelectric effect: Kmax = h·f − φ · h·f = '+hf+' eV, φ = '+phi+' eV · Kmax = ?', hf-phi, ' eV', [hf+phi, hf, phi]); }},
    {tier:2, fixed:true, make(rnd){ const v=['When a particle\'s momentum doubles, its de Broglie wavelength…','λ = h/p — the momentum p doubles, so λ…','A particle\'s de Broglie wavelength if p → 2p: it…']; return mcqText(rnd,v[ri(rnd,0,2)],'halves',['doubles','stays the same','becomes zero']); }},
    {tier:2, fixed:true, make(rnd){ const v=['Z = Σ exp(−E/kT) is called the…','The canonical partition function is written…','In statistical mechanics, Σ exp(−E/kT) defines the…']; return mcqText(rnd,v[ri(rnd,0,2)],'partition function',['wave function','action integral','density matrix']); }},
    {tier:3, make(rnd){ const k = ri(rnd,2,5), n = ri(rnd,2,4); const v=['A quantity scales as x^'+n,'Energy here scales as x^'+n,'Some rate scales as x^'+n]; return mcqText(rnd,v[ri(rnd,0,2)]+'. If x increases ×'+k+', it scales by…', Math.pow(k,n)+'×',[ (k*n+1)+'×', Math.pow(k,n+1)+'×', k+'×']); }},
    {tier:3, make(rnd){ const T = ri(rnd,2,9)*100+ri(rnd,0,19)*10; return mcqText(rnd,'Ideal gas at fixed V: pressure doubles when T rises from '+T+' K to…',(T*2)+' K',[T+100+' K',(T*4)+' K',(T+273)+' K']); }},
    {tier:3, fixed:true, make(rnd){ const v=['Canonical ensemble weights are exp(−E/kT). Raising T makes the distribution…','Boltzmann weights read exp(−E/kT). If T increases, the state distribution becomes…']; const q=v[ri(rnd,0,1)]; return mcqText(rnd,q,'flatter — more high-E states',['sharper around E = 0','unchanged','perfectly uniform, independent of E']); }},
    {tier:1, make(rnd){ const c = ri(rnd,1,9)*10, t = ri(rnd,1,8); return mcqNum(rnd,'Charge delivered: Q = I·t · I = '+c+' A, t = '+t+' s · Q = ?', c*t, ' C', [c+t, c*t*2, c-t]); }},
    {tier:2, make(rnd){ const lam = ri(rnd,20,90)*10; return mcqText(rnd,'Visible photon λ = '+lam+' nm. Roughly, E = 1240/λ eV gives…', (1240/lam).toFixed(2)+' eV', [(lam/1240).toFixed(2)+' eV', (1240*lam/1000).toFixed(2)+' eV', (12400/lam).toFixed(2)+' eV']); }},
    {tier:3, make(rnd){ const B = ri(rnd,2,9)/10, r = ri(rnd,5,30); return mcqNum(rnd,'Circular motion: r = '+r+' m, a(centripetal) = v²/r = '+B+'0 m/s² · v = ?', Math.sqrt(B*10*r).toFixed(1), ' m/s', [ (B*10*r).toFixed(1), (B*r).toFixed(1), Math.sqrt(B*r).toFixed(1) ]); }}
  ];
  function genEquation(level){
    const rnd = Math.random;
    const li = lix(level);
    const max = FAMILIES.length; /* tier flags handle the gating */
    for (let tries = 0; tries < 24; tries++){
      const fam = FAMILIES[ri(rnd, 0, max - 1)];
      if (fam.tier > li) continue;
      if (li >= 2 && fam.fixed && rnd() < 0.72) continue; /* higher levels favour the huge numeric families */
      return fam.make(rnd);
    }
    return FAMILIES[0].make(rnd);
  }

  /* ---------- Equation Sprint: optional ✦ AI batch prefetch ---------- */
  let aiInFlight = false, aiDown = false, aiAnnounced = false, aiWarned = false;
  function aiConfigured(){
    try{
      const s = JSON.parse(localStorage.getItem('csirnet_ai_settings_v1') || '{}');
      return !!(s && s.model && (s.key || s.format === 'custom'));
    }catch(e){ return false; }
  }
  function parseAiBatch(text){
    if (!text) return [];
    const i = text.indexOf('['), j = text.lastIndexOf(']');
    if (i < 0 || j <= i) return [];
    let arr; try{ arr = JSON.parse(text.slice(i, j + 1)); }catch(e){ return []; }
    if (!Array.isArray(arr)) return [];
    return arr.map(o => {
      if (!o || typeof o.q !== 'string' || !Array.isArray(o.o) || o.o.length !== 4) return null;
      const q = String(o.q).trim();
      const opts = o.o.map(x => String(x).trim()).filter(Boolean);
      if (q.length < 12 || q.length > 300 || opts.length !== 4) return null;
      if (new Set(opts.map(x => x.toLowerCase())).size !== 4) return null;
      const a = Number(o.a);
      if (!Number.isInteger(a) || a < 0 || a > 3) return null;
      return {q: q.slice(0, 300), o: opts.map(x => x.slice(0, 90)), a, ai: true};
    }).filter(Boolean);
  }
  async function prefetchAi(qs, index, level){
    if (aiInFlight || aiDown) return;
    if (!window.AiEngine || typeof window.AiEngine.call !== 'function' || !aiConfigured()) return;
    aiInFlight = true;
    const pace = {noobie:'very easy plug-in numbers', adept:'single-step', elite:'two-step or conceptual', godhood:'GATE-tricky with very close distractors'}[level] || 'single-step';
    try{
      const res = await window.AiEngine.call({
        systemPrompt: 'You write concise multiple-choice physics questions for a quick-reaction training game inside a CSIR-NET/GATE Physics tracker. You return strict JSON only.',
        messages: [{role:'user', content:'Return ONLY a JSON array of exactly 8 objects, no markdown, no commentary. Each object: {"q": question text (≤ 240 chars, plain-text formulas like F = m·a or λ = h/p allowed), "o": array of EXACTLY 4 distinct concise answer options (include units when numeric), "a": index 0-3 marking the correct option}. Difficulty: ' + pace + '. Mix topics: mechanics, electromagnetism, thermodynamics, optics, modern/quantum physics, mathematical physics. Ensure the marked answer is truly correct.'}],
        temperature: 0.8, maxTokens: 1500
      });
      const good = parseAiBatch(res && res.text);
      if (!good.length) throw new Error('AI returned no usable questions');
      good.forEach(q => { const pos = Math.min(index + 1 + Math.floor(Math.random() * 3), qs.length); qs.splice(pos, 0, q); });
      if (window.AiUsage && typeof window.AiUsage.track === 'function') window.AiUsage.track('break games', 'equation-ai-batch');
      if (!aiAnnounced){ aiAnnounced = true; gfToast('✦ AI question bank online — fresh questions blended into Equation Sprint.'); }
    }catch(err){
      aiDown = true;
      if (!aiWarned){ aiWarned = true; gfToast('AI question bank unavailable (' + String((err && err.message) || err).slice(0, 90) + ') — built-in unlimited generator active.'); }
    }finally{ aiInFlight = false; }
  }

  function equationQueue(level, base, hard){
    const qs = (base || []).concat(hard || []);
    for (let i = qs.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); const t = qs[i]; qs[i] = qs[j]; qs[j] = t; }
    while (qs.length < 10) qs.push(genEquation(level));
    return qs;
  }
  function equationPoke(qs, index, level){
    while (qs.length - index < 6 && qs.length < 200) qs.push(genEquation(level));
    const aiReady = qs.reduce((n, q) => n + (q.ai ? 1 : 0), 0);
    if (aiReady < 6 && (index % 2 === 0)) prefetchAi(qs, index, level);
  }
  function equationPace(level){ return {noobie:0, adept:30, elite:18, godhood:10}[level] !== undefined ? {noobie:0, adept:30, elite:18, godhood:10}[level] : 30; }
  function equationStatus(qs, level){
    const ai = qs.reduce((n, q) => n + (q.ai ? 1 : 0), 0);
    const pace = equationPace(level);
    const bits = ['Unlimited questions · local generator live'];
    if (ai) bits.unshift('✦ ' + ai + ' AI-GENERATED queued');
    else if (aiConfigured() && !aiDown) bits.unshift('✦ AI bank warming up');
    bits.push(pace ? '⏱ ' + pace + 's per question (' + level.toUpperCase() + ')' : 'relaxed pace (' + level.toUpperCase() + ')');
    return bits.join(' · ');
  }

  /* ---------- Gravitational Slingshot: 60 unique sectors + rules ---------- */
  const HANDCRAFTED = [
    {name:'FIRST ASSIST',start:[.13,.72],goal:[.84,.25],planets:[{x:.50,y:.52,r:22,m:1.1,c:'#72dfff'}]},
    {name:'LAGRANGE TURN',start:[.12,.76],goal:[.86,.24],planets:[{x:.44,y:.48,r:22,m:1.2,c:'#77e6ff'},{x:.68,y:.63,r:15,m:.7,c:'#c4ff72'}]},
    {name:'DOUBLE SLING',start:[.12,.78],goal:[.88,.22],planets:[{x:.36,y:.55,r:19,m:1.2,c:'#a78bff'},{x:.64,y:.46,r:23,m:1.35,c:'#ffe19a'}]},
    {name:'NEUTRON PASS',start:[.10,.70],goal:[.88,.32],planets:[{x:.47,y:.44,r:27,m:1.7,c:'#ff8e9e'},{x:.71,y:.70,r:13,m:.5,c:'#78e5ff'}]},
    {name:'BLACK-HOLE GATE',start:[.10,.82],goal:[.90,.18],planets:[{x:.50,y:.50,r:31,m:2.5,c:'#a88cff'},{x:.28,y:.32,r:12,m:.55,c:'#ffe19a'},{x:.73,y:.70,r:12,m:.55,c:'#79e6ff'}]}
  ];
  const GF_COLORS = ['#72dfff','#a78bff','#ffe19a','#ff8e9e','#78e5ff','#c4ff72','#ffa96b'];
  const TWISTS = [
    {key:'OPEN DRIFT',   note:'a classic assist window'},
    {key:'TWIN SUNS',    note:'two heavy wells pull across the lane'},
    {key:'ASTEROID FIELD', note:'red rocks are hazards — contact destroys the run'},
    {key:'NEEDLE GATE',  note:'the docking gate is tighter than regulation'},
    {key:'HEAVY WELL',   note:'one dominant mass — respect the pull'},
    {key:'CROSSFIRE',    note:'overlapping wells bend every trajectory'}
  ];
  const PREFIX = ['VIOLET','COLD','SILENT','BROKEN','OUTER','INNER','NEON','DYING','HOWLING','GLASS'];
  function genSector(n){
    const rnd = mulberry32(0xA57E0 + n * 7919);
    const twist = TWISTS[n % TWISTS.length];
    const start = [+(0.09 + rnd() * 0.06).toFixed(3), +(0.68 + rnd() * 0.16).toFixed(3)];
    const goal  = [+(0.82 + rnd() * 0.10).toFixed(3), +(0.14 + rnd() * 0.14).toFixed(3)];
    const clearOf = (x, y) => Math.hypot(x - start[0], y - start[1]) > 0.2 && Math.hypot(x - goal[0], y - goal[1]) > 0.2;
    const spaced = (x, y, pts, d) => pts.every(p => Math.hypot(x - p.x, y - p.y) >= d);
    let count = 1 + Math.min(3, Math.floor((n - 4) / 8));
    if (twist.key === 'TWIN SUNS' || twist.key === 'CROSSFIRE') count = Math.max(count, 2);
    const planets = []; let guard = 0;
    while (planets.length < count && guard++ < 80){
      const x = +(0.26 + rnd() * 0.5).toFixed(3), y = +(0.24 + rnd() * 0.52).toFixed(3);
      if (!clearOf(x, y) || !spaced(x, y, planets, 0.17)) continue;
      const heavy = twist.key === 'HEAVY WELL' && planets.length === 0;
      planets.push({x, y, r: heavy ? 30 : ri(rnd, 12, 26), m: heavy ? +(2.2 + rnd() * 0.6).toFixed(2) : +(0.6 + rnd() * 1.5).toFixed(2), c: GF_COLORS[ri(rnd, 0, GF_COLORS.length - 1)]});
    }
    if (twist.key === 'TWIN SUNS' && planets.length){ planets[0].m = +(planets[0].m + 0.8).toFixed(2); planets[0].r = Math.max(planets[0].r, 24); }
    let hazards = 0;
    if (twist.key === 'ASTEROID FIELD' || n >= 14) hazards = Math.min(3, 1 + Math.floor((n - 8) / 12));
    const hz = []; guard = 0;
    while (hz.length < hazards && guard++ < 80){
      const x = +(0.3 + rnd() * 0.44).toFixed(3), y = +(0.26 + rnd() * 0.48).toFixed(3);
      if (!clearOf(x, y) || !spaced(x, y, planets, 0.14) || !spaced(x, y, hz, 0.12)) continue;
      hz.push({x, y, r: ri(rnd, 9, 14), m: +(0.4 + rnd() * 0.5).toFixed(2), c: '#ff5b6a', h: true});
    }
    const gateScale = twist.key === 'NEEDLE GATE' ? 0.8 : Math.min(1, +(Math.max(0.55, 1.06 - n * 0.008)).toFixed(2));
    return {name: PREFIX[n % PREFIX.length] + ' ' + twist.key + ' · SEC ' + String(n).padStart(2, '0'),
            start, goal, planets: planets.concat(hz), gateScale, twistNote: twist.note};
  }
  function gravityLevels(){
    const out = HANDCRAFTED.slice();
    for (let n = 6; n <= 60; n++) out.push(genSector(n));
    return out;
  }
  const GRAV_RULES = {
    noobie:  {attempts:5, pull:0.85, gate:1.30},
    adept:   {attempts:3, pull:1.00, gate:1.00},
    elite:   {attempts:2, pull:1.15, gate:0.85},
    godhood: {attempts:2, pull:1.32, gate:0.66}
  };
  function gravityRules(level, challenge){
    const b = GRAV_RULES[level] || GRAV_RULES.adept;
    const gate = challenge && challenge.gateScale ? b.gate * challenge.gateScale : b.gate;
    return {attempts: b.attempts, pull: b.pull, gate: +gate.toFixed(2)};
  }

  window.GameForge = {
    equationQueue, equationPoke, equationPace, equationStatus,
    gravityLevels, gravityRules,
    _parseAiBatch: parseAiBatch, _genEquation: genEquation, _genSector: genSector
  };
})();
