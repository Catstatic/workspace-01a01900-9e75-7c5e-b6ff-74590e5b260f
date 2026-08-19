/* UNIT23 — FOCUSFRAME (R27) pure-layer: reading model, state machine,
   persistence codec, prefs, sweep exclusion registration, master hygiene.
   Runs the published master ins25_js.js in node (no DOM → pure layer only). */
'use strict';
const fs = require('fs');
let pass = 0, fail = 0;
const ok = (cond, msg) => { if (cond) { pass++; } else { fail++; console.log('  FAIL:', msg); } };

const MASTER = fs.readFileSync('/home/user/_audit/ins25_js.js', 'utf8');
const PROJECT = fs.readFileSync('/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html', 'utf8');
const ORIG = fs.existsSync('/tmp/orig_tracker.html') ? fs.readFileSync('/tmp/orig_tracker.html', 'utf8') : '';

/* --- load pure layer (master early-returns when document is undefined) --- */
eval(MASTER);
const FG = globalThis.__focusframe;
ok(FG && typeof FG === 'object', 'pure layer exported on globalThis.__focusframe');
ok(FG.VERSION === 'R27', 'version stamped R27');

/* --- reading model --- */
ok(FG.estimateSeconds({words:400}) === 120, 'plain words: 400 @200wpm = 120s (got ' + FG.estimateSeconds({words:400}) + ')');
ok(FG.estimateSeconds({words:400, eq:2}) === 160, 'display-eq adder: +2×20s = 160s');
ok(FG.estimateSeconds({words:600}, 120) === 300, 'slow WPM: 600 @120 = 300s');
ok(FG.estimateSeconds({words:300, fig:2}, 260) === 99, 'fast WPM + figures: 300@260≈69.2s +30s = 99s (got ' + FG.estimateSeconds({words:300, fig:2}, 260) + ')');
ok(FG.estimateSeconds({words:200, ex:3}) === 90, 'worked-example adder: 60s +30s = 90s');
ok(FG.estimateSeconds({words:1}) === 60, 'floor clamp: tiny content = 60s (1 min minimum)');
ok(FG.estimateSeconds({words:99999999}) === 10800, 'ceiling clamp: absurd content = 10800s (180 min)');
ok(FG.estimateSeconds({words:400}, 999) === 120, 'invalid WPM falls back to 200');
ok(FG.estimateSeconds({words:400}, 160) === 150, 'study pace 160wpm: 400 words = 150s');
ok(FG.estimateSeconds({words:0, eq:0, fig:0, ex:0}) === 60, 'empty bracket still minimum 60s');

/* --- formatting --- */
ok(FG.fmtMin(120) === '≈ 2 MIN', 'fmtMin 120s');
ok(FG.fmtMin(60) === '≈ 1 MIN', 'fmtMin floor: 60s shows ≈ 1 MIN never 0');
ok(FG.fmtMin(10800) === '≈ 180 MIN', 'fmtMin ceiling');
ok(FG.fmtClock(83) === '1:23', 'fmtClock pads seconds');
ok(FG.fmtClock(0) === '0:00', 'fmtClock zero');
ok(FG.fmtClock(3600) === '60:00', 'fmtClock hour rolled into minutes');

/* --- range model (boundaries 0..n, enclosed [s,e), s<e always) --- */
const r1 = FG.clampRange(0, 0, 5);   ok(r1.s === 0 && r1.e === 1, 'collapsed range expanded to 1 block');
const r2 = FG.clampRange(9, 9, 5);   ok(r2.s === 4 && r2.e === 5, 'overflow pulled inside');
const r3 = FG.clampRange(-3, 99, 5); ok(r3.s === 0 && r3.e === 5, 'under/overshoot clamped to full');
const r4 = FG.clampRange(4, 1, 5);   ok(r4.s < r4.e, 'inverted repaired: ' + JSON.stringify(r4));
const r5 = FG.clampRange(0, 0, 0);   ok(r5.s === 0 && r5.e === 0, 'empty document stays inert');

/* --- snap --- */
ok(FG.nearestBoundary(95, [0,100,200]) === 1, 'snap to nearest (95→idx1)');
ok(FG.nearestBoundary(49, [0,100,200]) === 0, 'snap down (49→idx0)');
ok(FG.nearestBoundary(50, [0,100,200]) === 0, 'tie breaks to earlier boundary');
ok(FG.nearestBoundary(99999, [0,100,200]) === 2, 'beyond end → last boundary');
ok(FG.nearestBoundary(5, []) === 0, 'empty bounds safe');

/* --- session state machine --- */
let s = FG.newSession(120);
ok(s.phase === 'ready' && s.est === 120 && s.elapsed === 0, 'new session ready');
FG.toggle(s, 1000);
ok(s.phase === 'running' && s.stamp === 1000, 'click starts the clock');
FG.tick(s, 1000 + 30*1000);
ok(s.phase === 'running', 'halfway still running');
ok(Math.round(FG.elapsedOf(s, 1000+30*1000)) === 30, 'elapsed 30s');
ok(Math.round(FG.remainingOf(s, 1000+30*1000)) === 90, 'remaining 90s');
FG.toggle(s, 1000 + 30*1000);
ok(s.phase === 'paused' && Math.round(s.elapsed) === 30, 'click pauses, elapsed banked');
FG.toggle(s, 1000 + 999*1000);
ok(s.phase === 'running' && Math.round(s.elapsed) === 30, 'resume keeps banked elapsed');
FG.tick(s, 1000 + 999*1000 + 91*1000);
ok(s.phase === 'done' && s.elapsed === s.est, 'target reached → done, elapsed pinned to estimate');
const before = JSON.stringify(s);
FG.toggle(s, 0);
ok(JSON.stringify(s) === before, 'click in done state is a no-op (complete is explicit)');

/* --- codec round-trip + hostile input --- */
const enc = FG.encodeSession({phase:'paused', est:300, elapsed:42.5, stamp:0});
const dec = FG.decodeSession(enc, 999);
ok(dec.phase === 'paused' && dec.est === 300 && Math.abs(dec.elapsed-42.5) < 1e-9, 'session round-trip exact');
ok(FG.decodeSession('not json{', 120).phase === 'ready', 'corrupt payload → fresh ready session');
ok(FG.decodeSession('{"phase":"weird"}', 120).phase === 'ready', 'unknown phase → fresh ready session');
const over = FG.decodeSession('{"phase":"paused","est":300,"elapsed":9999}', 120);
ok(over.elapsed === 300, 'elapsed clamped to estimate on decode');
ok(FG.decodeSession('{"phase":"running","est":300,"elapsed":10,"stamp":123}', 120).stamp === 123, 'running keeps stamp for crash-safe resume');
ok(FG.decodeSession('{"phase":"paused","est":300,"elapsed":10,"stamp":123}', 120).stamp === 0, 'paused stamp zeroed');

/* --- labels --- */
ok(FG.labelFor(FG.newSession(150), 0) === '≈ 3 MIN · CLICK TO START', 'ready label shows waiting time');
const runS = {phase:'running', est:120, elapsed:0, stamp:1000};
ok(FG.labelFor(runS, 1000+30*1000) === '1:30 LEFT · 0:30 READ', 'running label = countdown + elapsed (got "' + FG.labelFor(runS, 31000) + '")');
ok(FG.labelFor({phase:'paused', est:120, elapsed:30, stamp:0}, 0) === '⏸ PAUSED · 1:30 LEFT', 'paused label');
ok(FG.labelFor({phase:'done', est:120, elapsed:120, stamp:0}, 0).indexOf('DONE') > 0, 'done label');

/* --- prefs --- */
const p1 = FG.validPrefs(null);               ok(p1.wpm === 200 && p1.tint === 2, 'prefs default 200wpm / whisper tint step 2');
const p2 = FG.validPrefs('{"wpm":160,"tint":0}'); ok(p2.wpm === 160 && p2.tint === 0, 'prefs persisted values honored');
const p3 = FG.validPrefs('{"wpm":333,"tint":99}'); ok(p3.wpm === 200 && p3.tint === 4, 'prefs invalid clamped to range');
ok(FG.validPrefs('garbage').wpm === 200, 'prefs corrupt → defaults');

/* --- word counter --- */
ok(FG.wordCount('') === 0 && FG.wordCount('   ') === 0, 'empty text = 0 words');
ok(FG.wordCount('one  two\nthree\t four') === 4, 'whitespace-split word counting');

/* --- surgical registration: backup sweep excludes fg:* --- */
const surg = JSON.parse(fs.readFileSync('/home/user/_audit/surgical_r27.json', 'utf8'));
ok(surg.round === 'R27' && Array.isArray(surg.pairs) && surg.pairs.length === 1, 'surgical_r27 registered (1 pair)');
const pair = surg.pairs[0];
ok(ORIG.length === 0 || ORIG.split(pair.old).length - 1 === 1, 'sweep old unique in baseline');
ok(PROJECT.split(pair.new).length - 1 === 1, 'sweep new present exactly once in deliverable');
ok(pair.new.indexOf("indexOf('fg:')===0") > -1, 'sweep skips fg:-prefixed keys');

/* --- master hygiene --- */
ok(MASTER.indexOf('<body') === -1 && MASTER.indexOf('</style') === -1 && MASTER.indexOf('</body') === -1, 'js master banner free of forbidden literals');
const cssM = fs.readFileSync('/home/user/_audit/ins25_css.css', 'utf8');
ok(cssM.indexOf('<body') === -1 && cssM.indexOf('</style') === -1 && cssM.indexOf('</body') === -1, 'css master banner free of forbidden literals');
const keyLits = MASTER.match(/'fg:[a-z:]+'/g) || [];
ok(keyLits.length >= 4, 'namespaced fg: keys in use (' + keyLits.length + ')');
ok((MASTER.match(/localStorage\.\w+\(\s*'[^']+'\s*\)/g) || []).every(x => x.indexOf("'fg:") > -1), 'every literal localStorage access is fg:-namespaced');
const fgRule = cssM.split('.fg-in-goal')[1];
const fgBody = fgRule ? fgRule.slice(0, fgRule.indexOf('}')) : '';
ok(/background-image/.test(fgBody) && !/(^|[\s{;])color\s*:/.test(fgBody), 'tint rule touches ONLY background — never text color');
ok(/prefers-reduced-motion/.test(cssM), 'reduced-motion guard present (glow pulse off)');

console.log('unit23: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
