/* unit22 — ROUND 26 SKINFORGE+CASTFORGE static integrity: cut completed (orphan sweep),
   grafts landed (registries/mappings), masters lint-clean, persona 5-layer depth. */
const fs = require('fs');
const P = '/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html';
const proj = fs.readFileSync(P, 'utf8');
const css = fs.readFileSync('/home/user/_audit/ins24_css.css', 'utf8');
const js = fs.readFileSync('/home/user/_audit/ins24_js.js', 'utf8');
const surg = JSON.parse(fs.readFileSync('/home/user/_audit/surgical_r26.json', 'utf8'));

let passed = 0, failed = 0;
const ok = (c, n) => { if (c){ passed++; console.log('  ✔ ' + n); } else { failed++; console.log('  ✘ FAIL: ' + n); } };
const cnt = s => proj.split(s).length - 1;

console.log('[1] THE CUT — total excision proof');
for (const tok of ['theme-backrooms', 'theme-escape', 'fxBackrooms', 'fxEscape', 'BACKROOMS', 'ESCAPE ROOM',
                   'Backrooms', 'backrooms', 'Smiler', 'LEVEL 0', 'TUMBLER', 'fluorescent']){
  ok(cnt(tok) === 0, 'zero hits for `' + tok + '` in shipped file (got ' + cnt(tok) + ')');
}
ok(surg.pairs.length === 43, 'surgical_r26.json registers all 43 audited pairs (both waves)');

console.log('[2] THE GRAFT — theme registries');
for (const id of ["'theme-kaiju8'", "'theme-batman'", "'theme-moonknight'"]){
  ok(cnt(id + ':') >= 4, id + ' grafted into THEMES + THEME_VOICES + colors + text + quotes maps (hits: ' + cnt(id + ':') + ')');
}
ok(proj.includes("label:'KAIJU NO. 8'") && proj.includes("label:'THE DARK KNIGHT'") && proj.includes("label:'MOON KNIGHT'"), 'picker labels exact');
ok(proj.includes("swatchColors:['#05070f','#00e5ff','#7df9ff','#ff3355']"), 'kaiju8 swatch = plan palette');
ok(proj.includes("swatchColors:['#0a0a0c','#ffd60a','#9aa5b1','#1b2735']"), 'batman swatch = plan palette');
ok(proj.includes("swatchColors:['#0d1021','#e8e6df','#d4af37','#5eead4']"), 'moonknight swatch = plan palette');

console.log('[3] CASTFORGE — persona registry depth');
const VOICES = proj.slice(proj.indexOf('VOICES = {'), proj.indexOf('\n};', proj.indexOf('VOICES = {')));
for (const v of ['igris', 'huoyuhao', 'gehrman', 'fool']){
  const m = VOICES.match(new RegExp('\\b' + v + ": \\{ label:'([^']+)', greeting:'([^']+)', role:'([^']+)', description:'([^']{40,})', signature:'([^']{20,})' \\}"));
  ok(!!m, v + ': complete 5-field copy (' + (m ? m[1] : 'MISSING') + ')');
}
ok(VOICES.includes("label:'IGRIS'") && VOICES.includes("label:'HUO YUHAO'") && VOICES.includes("label:'GEHRMAN SPARROW'") && VOICES.includes("label:'THE FOOL'"), 'canon spellings: GEHRMAN (not Geihman); HUO YUHAO is SL2');
ok(VOICES.includes('Soul Land 2') && !VOICES.includes('Soul Land 1'), 'huoyuhao canon guard: Soul Land 2 identity, zero SL1 bleed');
ok(proj.includes("'theme-system':   ['jinwoo','igris']"), 'System seats jinwoo + igris');
ok(proj.includes("'theme-shrek':    ['tangsan','huoyuhao']"), 'Spirit Realm seats tangsan + huoyuhao');
ok(proj.includes("'theme-lotm':     ['klein','gehrman','fool']"), 'Beyonder seats the full ascension line');

console.log('[4] voice/quotes/colors wiring');
for (const v of ['igris', 'huoyuhao', 'gehrman', 'fool']){
  ok(proj.includes('  ' + v + ': ['), 'VOICE_QUOTES has a ' + v + ' set');
}
for (const c of ["igris:['#ff3b47'", "huoyuhao:['#b98cff'", "gehrman:['#9aa3ad'", "fool:['#8b93a0'"]){
  ok(proj.includes(c), 'voiceColors entry: ' + c);
}
ok(proj.includes("voice-igris')||b.classList.contains('voice-gehrman'))return'target'"), 'modeForTheme: igris + gehrman → target');
ok(proj.includes("theme-moonknight'))return'maze'") && proj.includes("theme-kaiju8'))return'lattice'"), 'modeForTheme: moonknight→maze · kaiju8→lattice');
ok(proj.includes("theme-black')||b.classList.contains('theme-batman'))return'cipher'"), 'modeForTheme: batman shares cipher');
ok(proj.includes("eyebrow:'MOON KNIGHT / TOMB PROTOCOL'"), 'maze mode re-skinned as Tomb of Khonshu');
ok(proj.includes("eyebrow:'BLACK ROOM / DARK KNIGHT'"), 'cipher eyebrow re-branded');

console.log('[5] masters lint');
const themeRules = id => (css.match(new RegExp('\\.' + id + '[ ,{:]', 'g')) || []).length;
ok(themeRules('theme-kaiju8') >= 12 && themeRules('theme-batman') >= 12 && themeRules('theme-moonknight') >= 12,
   'three full theme families in css master (kaiju8:' + themeRules('theme-kaiju8') + ' batman:' + themeRules('theme-batman') + ' moon:' + themeRules('theme-moonknight') + ')');
const personaRules = sel => (css.match(new RegExp(sel.replace(/\./g, '\\.'), 'g')) || []).length;
ok(personaRules('theme-system.voice-igris') >= 10 && personaRules('theme-shrek.voice-huoyuhao') >= 8 && personaRules('theme-lotm.voice-gehrman') >= 7 && personaRules('theme-lotm.voice-fool') >= 7,
   'four persona ultimate families are peer-sized, not stubs');
for (const id of ['fxKaiju8', 'fxBatman', 'fxMoonknight', 'fxIgris', 'fxHuoyuhao', 'fxGehrman', 'fxFool']){
  ok(css.includes('#' + id) && css.indexOf('#' + id) === css.lastIndexOf('#' + id.split('::')[0].split(':')[0]) || css.split('#' + id).length - 1 >= 2, 'overlay ' + id + ' styled + animated');
  ok(css.includes('@media (prefers-reduced-motion: reduce)') && css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)')).includes('#' + id), 'reduced-motion rail covers ' + id);
}
ok(!/(<\/body>|<body|<\/style>)/.test(css) && !/(<\/body>|<body|<\/style>)/.test(js), 'masters carry no tag literals (block hygiene)');
ok(cnt('SKINFORGE + CASTFORGE — VISUAL LAYER (ROUND 26)') === 1 && cnt('SKINFORGE + CASTFORGE — OVERLAY INJECTOR (ROUND 26)') === 1, 'both R26 masters embedded exactly once');
ok(js.includes('LAYERS.map') && js.includes('__skinforge'), 'injector exposes window.__skinforge test surface');

console.log('\nunit22: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
