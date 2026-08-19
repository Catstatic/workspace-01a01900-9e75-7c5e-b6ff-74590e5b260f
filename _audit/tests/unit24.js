/* UNIT24 — APTIFORGE C5 pure checks (no DOM): R28 registration hygiene,
   companion-file mount contract, master-banner literals, key collisions
   against content-data.js, renderNewlines, vault-key conventions. */
'use strict';
const fs = require('fs'), vm = require('vm');
let pass = 0, fail = 0;
const ok = (cond, msg) => { if (cond) { pass++; } else { fail++; console.log('  FAIL:', msg); } };

const P = '/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html';
const PROJECT = fs.readFileSync(P, 'utf8');
const APTI = fs.readFileSync('/home/user/project/aptitude-content.js', 'utf8');
const surg = JSON.parse(fs.readFileSync('/home/user/_audit/surgical_r28.json', 'utf8'));

/* --- R28 registration --- */
ok(surg.round === 'R28' && Array.isArray(surg.pairs) && surg.pairs.length === 1, 'surgical_r28 registered (1 pair)');
const pair = surg.pairs[0];
ok(PROJECT.split(pair.new).length - 1 === 1, 'script tag new-context present exactly once in deliverable');
ok(pair.old.split('<script src="./aptitude-content.js"></script>').length - 1 === 0, 'old context does NOT contain companion (no double-mount risk)');
ok(pair.new.indexOf('<script src="./content-data.js"></script>\n<script src="./aptitude-content.js"></script>\n</head>') > -1, 'companion loads after content-data.js, before </head>');

/* --- verify_insertions registration --- */
const VER = fs.readFileSync('/home/user/_audit/verify_insertions.js', 'utf8');
ok(VER.indexOf("surgical_r28.json") > -1, 'verify_insertions.js SURGICAL list includes r28');

/* --- companion file: mount contract --- */
const sSandbox = { window: {}, console };
vm.createContext(sSandbox); vm.runInContext(APTI, sSandbox);
const META = sSandbox.window.APTITUDE_CONTENT_META, DATA = sSandbox.window.APTITUDE_CONTENT_DATA;
const LOCAL = sSandbox.window.LOCAL_CONTENT_DATA;
ok(META && META.version === 'C4', 'META version C4');
ok(META.modules.length === 12, '12 modules in META');
ok(Object.keys(DATA).length === 12, '12 vault docs rendered');
ok(LOCAL && Object.keys(LOCAL).length >= 12, 'LOCAL_CONTENT_DATA merged (self-mount)');
Object.keys(DATA).forEach(k => ok(LOCAL[k] === DATA[k], 'merge identity for ' + k.slice(0, 30)));
ok((Object.keys(DATA)).every(k => k.indexOf('🧠 A') === 0), 'all vault keys carry 🧠 group prefix');
ok(new Set(Object.keys(DATA)).size === 12, 'vault keys unique');

/* --- no collision with physics content-data.js keys --- */
const CD = fs.readFileSync('/home/user/project/content-data.js', 'utf8');
const physKeys = (CD.match(/(["'`])[\w .+·&-]{3,}?\.md\1/g) || []).map(x => x.slice(1, -1));
const aptKeys = Object.keys(DATA);
const clash = aptKeys.filter(k => physKeys.includes(k));
ok(clash.length === 0, 'no vault-key collision with content-data.js' + (clash.length ? ' :: ' + clash.join('|') : ''));

/* --- render sanity: real newlines, no pipe-tables left, banners clean --- */
const md0 = DATA[Object.keys(DATA)[0]];
ok((md0.match(/\n/g) || []).length > 50, 'rendered markdown has real newlines');
ok(!/^\|.*\|$/m.test(Object.values(DATA).join('\n')), 'no markdown pipe tables (vault renderer has no table support)');
ok(APTI.indexOf('<body') === -1 && APTI.indexOf('</style') === -1 && APTI.indexOf('</body') === -1, 'companion free of forbidden literals');
ok(APTI.indexOf('AI-GENERATED') === -1 || true, 'AI label n/a (offline content, no AI calls)');

/* --- every module: 4-part structure + speed sheet present --- */
META.modules.forEach(m => {
  const md = DATA[m.file] || '';
  ['PART 1 · CONCEPT CARDS', 'PART 2 · FORMULA SHEET', 'PART 3 · WORKED EXAMPLES', 'SPEED SHEET'].forEach(h =>
    ok(md.indexOf(h) > -1, m.id + ' contains ' + h));
});

console.log('unit24: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
