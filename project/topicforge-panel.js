/* TOPICFORGE panel renderer (T0–T2) — renders window.TOPICFORGE_MAP into
   #panel-topicforge, lazy-loads the forged lane banks (T1 quantum pilot;
   T2 classical + mathphys with inline-SVG figures), and runs 25-problem
   CSIR-marked mock cockpits fully offline. CSS is injected at runtime so the
   deliverable carries no new inline <style> blocks. */
(function(){
'use strict';
if (!window.TOPICFORGE_MAP || !document.getElementById('panel-topicforge')) return;
var MAP = window.TOPICFORGE_MAP;

var css = ''
+'.tf-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px;margin-top:14px;}'
+'.tf-lane{background:var(--bg-2);border:1px solid var(--line);border-radius:12px;padding:14px 16px;display:flex;flex-direction:column;gap:8px;}'
+'.tf-lane-head{display:flex;justify-content:space-between;align-items:baseline;gap:10px;}'
+'.tf-lane-title{font-family:var(--font-display,"Space Grotesk",sans-serif);font-size:.95rem;color:var(--ink-0);}'
+'.tf-lane-total{font-family:var(--font-mono,"DM Mono",monospace);font-size:.62rem;color:var(--accent);}'
+'.tf-weight{font-size:.62rem;color:var(--ink-2);font-family:var(--font-mono,"DM Mono",monospace);}'
+'.tf-sub{display:grid;grid-template-columns:130px 1fr 44px;gap:8px;align-items:center;margin:2px 0;}'
+'.tf-sub-label{font-size:.66rem;color:var(--ink-1);text-align:right;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}'
+'.tf-track{height:14px;background:var(--bg-3,transparent);border:1px solid var(--line);position:relative;overflow:hidden;border-radius:4px;}'
+'.tf-fill{height:100%;background:color-mix(in srgb,var(--accent) 55%,transparent);}'
+'.tf-fill.tf-apex{background:color-mix(in srgb,var(--gold,#d9a441) 60%,transparent);}'
+'.tf-sub-n{font-family:var(--font-mono,"DM Mono",monospace);font-size:.6rem;color:var(--ink-1);}'
+'.tf-lock{margin-top:6px;display:inline-block;font-family:var(--font-mono,"DM Mono",monospace);font-size:.56rem;letter-spacing:.08em;padding:4px 9px;border:1px dashed var(--line);border-radius:999px;color:var(--ink-2);}'
+'.tf-shelf{margin-top:22px;}'
+'.tf-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;}'
+'.tf-chip{border:1px solid var(--line);border-radius:10px;padding:7px 11px;font-size:.66rem;color:var(--ink-1);background:var(--bg-2);}'
+'.tf-chip b{color:var(--ink-0);font-weight:600;}'
+'.tf-chip .tf-s{color:var(--accent);font-family:var(--font-mono,"DM Mono",monospace);font-size:.58rem;}'
+'.tf-chip-live{border-color:var(--accent);background:color-mix(in srgb,var(--accent) 8%,var(--bg-2));}'
+'.tf-chip-play{margin-top:6px;padding:5px 14px;}'
+'.tf-note{margin-top:16px;padding:11px 14px;border-left:3px solid var(--accent);background:color-mix(in srgb,var(--accent) 6%,transparent);color:var(--ink-1);font-size:.74rem;line-height:1.55;}'
+'.tf-assump{margin-top:12px;font-size:.66rem;color:var(--ink-2);line-height:1.6;}'
+'.tf-aichi{display:inline-block;font-family:var(--font-mono,monospace);font-size:.52rem;letter-spacing:.14em;padding:2px 7px;border:1px solid var(--gold,#d9a441);border-radius:999px;color:var(--gold,#d9a441);vertical-align:middle;}'
+'.tf-fleet{margin-top:10px;display:flex;flex-direction:column;gap:10px;}'
+'.tf-fleet-head{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-family:var(--font-mono,monospace);font-size:.6rem;letter-spacing:.1em;color:var(--accent);}'
+'.tf-mock{display:grid;grid-template-columns:1fr auto;gap:8px 14px;align-items:center;background:color-mix(in srgb,var(--bg-2) 80%,transparent);border:1px solid var(--line);border-radius:10px;padding:10px 14px;}'
+'.tf-mock-title{font-size:.8rem;color:var(--ink-0);font-weight:600;}'
+'.tf-mock-meta{display:flex;flex-wrap:wrap;gap:6px 12px;font-family:var(--font-mono,monospace);font-size:.58rem;color:var(--ink-2);margin-top:4px;}'
+'.tf-mock-stats{font-family:var(--font-mono,monospace);font-size:.6rem;color:var(--ink-1);margin-top:4px;}'
+'.tf-mock-stats b{color:var(--accent);}'
+'.tf-play{font:inherit;font-family:var(--font-mono,monospace);font-size:.66rem;letter-spacing:.12em;padding:9px 18px;border-radius:8px;border:1px solid var(--accent);background:color-mix(in srgb,var(--accent) 14%,transparent);color:var(--accent);cursor:pointer;grid-row:span 2;}'
+'.tf-play:hover{background:color-mix(in srgb,var(--accent) 26%,transparent);}'
+'.tf-run{position:fixed;inset:0;z-index:10000;background:rgba(6,8,12,.72);backdrop-filter:blur(3px);display:flex;align-items:flex-start;justify-content:center;padding:18px;overflow:auto;}'
+'.tf-run-shell{width:min(880px,100%);background:var(--bg-1,#10141b);border:1px solid var(--line);border-radius:14px;padding:18px 22px 26px;display:flex;flex-direction:column;gap:14px;}'
+'.tf-run-head{display:flex;align-items:center;gap:10px;flex-wrap:wrap;border-bottom:1px solid var(--line);padding-bottom:12px;}'
+'.tf-run-id{font-family:var(--font-mono,monospace);font-size:.72rem;color:var(--ink-0);letter-spacing:.08em;}'
+'.tf-timer{margin-left:auto;font-family:var(--font-mono,monospace);font-size:.95rem;color:var(--accent);border:1px solid var(--line);border-radius:8px;padding:4px 12px;}'
+'.tf-timer.tf-hot{color:#e5534b;border-color:#e5534b;}'
+'.tf-prog{font-family:var(--font-mono,monospace);font-size:.62rem;color:var(--ink-2);}'
+'.tf-run-x{margin-left:6px;background:none;border:1px solid var(--line);color:var(--ink-2);border-radius:8px;padding:4px 10px;cursor:pointer;font-size:.8rem;}'
+'.tf-qmeta{font-family:var(--font-mono,monospace);font-size:.6rem;color:var(--ink-2);letter-spacing:.08em;display:flex;gap:10px;flex-wrap:wrap;}'
+'.tf-chipd{padding:2px 8px;border:1px solid var(--line);border-radius:999px;}'
+'.tf-chipd.tf-seed{color:#7ee787;border-color:#27452f;}'
+'.tf-chipd.tf-standard{color:var(--accent);}'
+'.tf-chipd.tf-apex{color:var(--gold,#d9a441);border-color:color-mix(in srgb,var(--gold,#d9a441) 45%,transparent);}'
+'.tf-qstem{font-size:.92rem;line-height:1.75;color:var(--ink-0);}'
+'.tf-qopts{display:flex;flex-direction:column;gap:8px;}'
+'.tf-qopt{display:grid;grid-template-columns:34px 1fr;gap:10px;align-items:center;text-align:left;background:var(--bg-2);border:1px solid var(--line);border-radius:10px;padding:10px 14px;cursor:pointer;font-size:.84rem;color:var(--ink-1);line-height:1.55;}'
+'.tf-qopt:hover{border-color:var(--accent);}'
+'.tf-qopt .tf-oletter{font-family:var(--font-mono,monospace);font-size:.72rem;color:var(--accent);text-align:center;border:1px solid var(--line);border-radius:6px;padding:3px 0;}'
+'.tf-qopt.sel{border-color:var(--accent);background:color-mix(in srgb,var(--accent) 12%,transparent);color:var(--ink-0);}'
+'.tf-qopt.sel .tf-oletter{background:var(--accent);color:#0b0e13;border-color:var(--accent);}'
+'.tf-run-foot{display:flex;align-items:center;gap:10px;flex-wrap:wrap;border-top:1px solid var(--line);padding-top:12px;}'
+'.tf-nav{font:inherit;font-family:var(--font-mono,monospace);font-size:.64rem;letter-spacing:.1em;padding:8px 14px;border-radius:8px;border:1px solid var(--line);background:var(--bg-2);color:var(--ink-1);cursor:pointer;}'
+'.tf-pal{display:flex;flex-wrap:wrap;gap:5px;flex:1;justify-content:center;}'
+'.tf-pal button{width:28px;height:26px;font-family:var(--font-mono,monospace);font-size:.58rem;border:1px solid var(--line);border-radius:6px;background:var(--bg-2);color:var(--ink-2);cursor:pointer;}'
+'.tf-pal button.ans{background:color-mix(in srgb,var(--accent) 22%,transparent);color:var(--accent);border-color:var(--accent);}'
+'.tf-pal button.cur{outline:2px solid var(--gold,#d9a441);}'
+'.tf-subm{font:inherit;font-family:var(--font-mono,monospace);font-size:.68rem;letter-spacing:.14em;padding:10px 20px;border-radius:8px;border:1px solid #2ea043;background:#1f6f3522;color:#7ee787;cursor:pointer;}'
+'.tf-subm.armed{background:#7d2b2b;color:#ffb3ad;border-color:#e5534b;}'
+'.tf-res-big{font-family:var(--font-display,sans-serif);font-size:2rem;color:var(--ink-0);}'
+'.tf-res-big b{color:var(--accent);}'
+'.tf-res-sub{font-family:var(--font-mono,monospace);font-size:.62rem;color:var(--ink-1);line-height:1.8;}'
+'.tf-filters{display:flex;gap:8px;flex-wrap:wrap;}'
+'.tf-filters button{font:inherit;font-family:var(--font-mono,monospace);font-size:.6rem;letter-spacing:.08em;padding:6px 12px;border-radius:999px;border:1px solid var(--line);background:var(--bg-2);color:var(--ink-2);cursor:pointer;}'
+'.tf-filters button.on{border-color:var(--accent);color:var(--accent);}'
+'.tf-rev{border:1px solid var(--line);border-left-width:4px;border-radius:10px;padding:12px 16px;display:flex;flex-direction:column;gap:9px;}'
+'.tf-rev.good{border-left-color:#2ea043;}'
+'.tf-rev.bad{border-left-color:#e5534b;}'
+'.tf-rev.skip{border-left-color:var(--ink-2);}'
+'.tf-rev-head{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-family:var(--font-mono,monospace);font-size:.58rem;color:var(--ink-2);}'
+'.tf-rev-pt{margin-left:auto;font-size:.68rem;}'
+'.tf-rev-opt{display:grid;grid-template-columns:30px 1fr;gap:10px;align-items:center;padding:7px 11px;border:1px solid var(--line);border-radius:8px;font-size:.8rem;color:var(--ink-1);line-height:1.5;}'
+'.tf-rev-opt .tf-oletter{text-align:center;font-family:var(--font-mono,monospace);font-size:.66rem;color:var(--ink-2);}'
+'.tf-rev-opt.corr{border-color:#2ea043;background:#1f6f3518;color:#9fe8ae;}'
+'.tf-rev-opt.corr .tf-oletter{color:#7ee787;}'
+'.tf-rev-opt.you{border-color:#e5534b;background:#7d2b2b18;}'
+'.tf-rev-opt.you.corr{border-color:#2ea043;}'
+'.tf-sol{font-size:.78rem;line-height:1.7;color:var(--ink-1);background:color-mix(in srgb,var(--accent) 5%,transparent);border-radius:8px;padding:9px 13px;}'
+'.tf-sol-lab{font-family:var(--font-mono,monospace);font-size:.54rem;letter-spacing:.14em;color:var(--accent);margin-bottom:4px;}'
+'.tf-fig{margin:2px auto 10px;max-width:340px;text-align:center;border:1px solid var(--line);border-radius:10px;padding:8px;background:color-mix(in srgb,var(--bg-2) 60%,transparent);}'
+'.tf-fig svg{max-width:100%;height:auto;display:block;margin:0 auto;}'
+'.tf-end{align-self:center;}';

function injectCss(){
  var st = document.createElement('style');
  st.setAttribute('data-tf', '1');
  st.textContent = css;
  document.head.appendChild(st);
}

function esc(s){ return String(s).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

function render(){
  var host = document.getElementById('tfLanes');
  if (!host || host.dataset.done === '1') return;
  host.dataset.done = '1';
  var physTotal = MAP.lanes.filter(l => l.id !== 'aptitude').reduce((a,l) => a + l.total, 0);
  var gaTotal = (MAP.lanes.find(l => l.id === 'aptitude') || { total: 0 }).total;

  host.innerHTML = MAP.lanes.map(function(l){
    var max = Math.max.apply(null, l.rows.map(r => r.hits).concat([1]));
    var base = l.id === 'aptitude' ? gaTotal : physTotal;
    var w = (100 * l.total / (base || 1)).toFixed(1);
    var subs = l.rows.slice(0, 6).map(function(r){
      var apexPct = r.hits ? Math.round(100 * (r.diff.apex || 0) / r.hits) : 0;
      return '<div class="tf-sub"><div class="tf-sub-label" title="' + esc(r.id) + '">' + esc(r.id) + '</div>'
        + '<div class="tf-track"><div class="tf-fill' + (apexPct >= 50 ? ' tf-apex' : '') + '" style="width:' + Math.max(2, Math.round(100 * r.hits / max)) + '%"></div></div>'
        + '<div class="tf-sub-n">' + r.hits + '</div></div>';
    }).join('');
    if (l.rows.length > 6) subs += '<div class="tf-weight">+ ' + (l.rows.length - 6) + ' more subtopics tracked</div>';
    return '<div class="tf-lane" data-lane="' + esc(l.id) + '">'
      + '<div class="tf-lane-head"><div class="tf-lane-title">' + esc(l.title) + '</div>'
      + '<div class="tf-lane-total">' + l.total + ' Qs mined</div></div>'
      + '<div class="tf-weight">' + w + '% of ' + (l.id === 'aptitude' ? 'GA/Part-A' : 'physics') + ' signal · ' + l.rows.length + ' subtopics</div>'
      + subs
      + '<span class="tf-lock">🔒 5 mocks × 25 — forges at T' + (l.id === 'quantum' ? '1 (proposed pilot)' : '2–5') + ' after map approval</span>'
      + '</div>';
  }).join('');

  var shelf = document.getElementById('tfDrills');
  if (shelf){
    shelf.innerHTML = MAP.drills.map(function(c){
      return '<div class="tf-chip"><b>#' + c.rank + ' ' + esc(c.id) + '</b> · ' + c.hits + ' hits · <span class="tf-s">' + c.sessions + ' sessions · ' + esc(c.exams) + '</span><br><span class="tf-s">' + esc(c.forgeId) + ' — T6</span></div>';
    }).join('');
  }

  var u = document.getElementById('tfUnclass');
  if (u){
    var m = MAP.meta;
    u.innerHTML = '<b>MAP HONESTY:</b> ' + m.universe.total + ' questions mined (' + m.universe.csir + ' CSIR × ' + m.universe.csirSessions.length + ' sessions · ' + m.universe.gate + ' GATE × ' + m.universe.gateSessions.length + ' banks, 2016–2026). '
      + m.classifiedPct + '% rule-classified into a lane/subtopic. ' + (m.universe.unclassCsir + m.universe.unclassGate) + ' questions resisted keyword rules (pure-formula stems) — counted openly above, not dropped; they join lanes manually at T1 tagging. '
      + 'Drill roster: ' + MAP.drills.length + ' concepts each crossing ≥3 distinct exam sessions.'
      + '<div class="tf-assump">' + m.assumptions.map(a => '· ' + esc(a)).join('<br>') + '</div>';
  }
}

/* ===================== T1: PLAYABLE FLEET ENGINE =====================
   Lazy-loads lane banks (companions self-mount + ping the renderer),
   renders live mock cards on the quantum lane, and runs the mock in an
   in-panel cockpit: 55:00 timer, CSIR marking (seed/standard +3.5/-0.875;
   apex +5/0), palette, double-click-confirmed submit, attempt history in
   the OWN 'tf:' localStorage namespace (3-hour sim stats untouched). */
var BANK_SRC = {
  quantum:   './topicforge-bank-quantum.js',
  classical: './topicforge-bank-classical.js',
  mathphys:  './topicforge-bank-mathphys.js',
  emtheory:  './topicforge-bank-emtheory.js',
  thermo:    './topicforge-bank-thermo.js',
  electronics: './topicforge-bank-electronics.js',
  atomic:    './topicforge-bank-atomic.js',
  nuclear:   './topicforge-bank-nuclear.js',
  solidstate: './topicforge-bank-solidstate.js',
  drills:    './topicforge-bank-drills.js'
};
var bankRequested = {};
function ensureBank(){
  Object.keys(BANK_SRC).forEach(function(lane){
    if (bankRequested[lane] || (window.TOPICFORGE_BANKS && window.TOPICFORGE_BANKS[lane])) return;
    bankRequested[lane] = true;
    var sc = document.createElement('script');
    sc.src = BANK_SRC[lane];
    sc.setAttribute('data-tf-bank', lane);
    document.head.appendChild(sc);
  });
}
function findMock(id){
  var banks = window.TOPICFORGE_BANKS || {}, found = null;
  Object.keys(banks).forEach(function(lane){
    (banks[lane].mocks || []).forEach(function(m){ if (m.id === id) found = { mock: m, bank: banks[lane] }; });
  });
  return found;
}
function attKey(id){ return 'tf:att:' + id; }
function attemptsFor(id){
  try { var a = JSON.parse(localStorage.getItem(attKey(id)) || '[]'); return Array.isArray(a) ? a : []; }
  catch(e){ return []; }
}
function saveAttempt(id, att){
  try {
    var a = attemptsFor(id);
    a.push(att);
    while (a.length > 20) a.shift();
    localStorage.setItem(attKey(id), JSON.stringify(a));
  } catch(e){}
}
function bestPct(id){
  var a = attemptsFor(id), best = null;
  a.forEach(function(t){ var p = 100 * t.score / t.max; if (best === null || p > best) best = p; });
  return best;
}
/* tiny realm-safe math renderer (same $/$ $ delimiters as the vault engine):
   splits text, KaTeX-renders each segment into a span; raw-text fallback when
   KaTeX is absent or a segment fails (throwOnError:false keeps UX graceful). */
function setMathText(el, txt){
  if (!el) return;
  if (!window.katex || !window.katex.renderToString){ el.textContent = txt; return; }
  var rest = String(txt), m;
  var re = /(\$\$[\s\S]+?\$\$)|(\$[^$\n]+?\$)/g;
  var last = 0, out = [];
  while ((m = re.exec(rest))){
    if (m.index > last) out.push({ t: rest.slice(last, m.index), math: false });
    if (m[1]) out.push({ t: m[1].slice(2, -2), math: true, disp: true });
    else out.push({ t: m[2].slice(1, -1), math: true, disp: false });
    last = re.lastIndex;
  }
  if (last < rest.length) out.push({ t: rest.slice(last), math: false });
  el.textContent = '';
  out.forEach(function(pt){
    if (!pt.math){ el.appendChild(document.createTextNode(pt.t)); return; }
    var html = null;
    try { html = window.katex.renderToString(pt.t, { displayMode: !!pt.disp, throwOnError: false }); }
    catch (e){ html = null; }
    if (html === null){ el.appendChild(document.createTextNode(pt.disp ? '$$' + pt.t + '$$' : '$' + pt.t + '$')); return; }
    var span = document.createElement('span');
    span.innerHTML = html;
    el.appendChild(span);
  });
}

function laneBank(laneId){ return (window.TOPICFORGE_BANKS || {})[laneId] || null; }

function renderFleet(){
  ensureBank();
  Array.prototype.forEach.call(document.querySelectorAll('.tf-lane'), function(laneCard){
    var laneId = laneCard.getAttribute('data-lane');
    if (!BANK_SRC[laneId]) return; /* lanes whose stage has not forged keep their lock badge */
    var bank = laneBank(laneId);
    var old = laneCard.querySelector('.tf-fleet');
    if (old) old.remove();
    var lock = laneCard.querySelector('.tf-lock');
    if (!bank){
      if (lock) lock.textContent = '⏳ ' + laneId + ' fleet loading…';
      return;
    }
    if (lock) lock.remove();
    var fleet = document.createElement('div');
    fleet.className = 'tf-fleet';
    var head = document.createElement('div');
    head.className = 'tf-fleet-head';
    var stageLabel = bank.meta.stage === 'T1-pilot' ? 'T1 PILOT' : bank.meta.stage;
    head.innerHTML = '⚔️ ' + stageLabel + ' FORGED — ' + bank.mocks.length + ' MOCKS × 25 · stamp 6·12·7 &nbsp;<span class="tf-aichi">AI-GENERATED</span>';
    fleet.appendChild(head);
    bank.mocks.forEach(function(m){
    var atts = attemptsFor(m.id);
    var best = bestPct(m.id);
    var card = document.createElement('div');
    card.className = 'tf-mock';
    var left = document.createElement('div');
    var title = document.createElement('div');
    title.className = 'tf-mock-title';
    title.textContent = m.id + ' · ' + m.title;
    left.appendChild(title);
    var meta = document.createElement('div');
    meta.className = 'tf-mock-meta';
    meta.textContent = '25 problems · ' + m.minutes + ' min · max ' + bank.meta.maxScore + ' · +3.5/−0.875 (B-style), +5/0 apex · subs: ' + m.focus.join(', ');
    left.appendChild(meta);
    var stats = document.createElement('div');
    stats.className = 'tf-mock-stats';
    stats.innerHTML = atts.length
      ? 'attempts: <b>' + atts.length + '</b> · best: <b>' + (best === null ? '—' : best.toFixed(1) + '%') + '</b> · last: <b>' + (100 * atts[atts.length-1].score / atts[atts.length-1].max).toFixed(1) + '%</b>'
      : 'not yet attempted';
    left.appendChild(stats);
    card.appendChild(left);
    var play = document.createElement('button');
    play.className = 'tf-play';
    play.type = 'button';
    play.textContent = '▶ RUN';
    play.setAttribute('data-tf-play', m.id);
    play.addEventListener('click', function(){ openMock(m.id); });
    card.appendChild(play);
    fleet.appendChild(card);
    });
    laneCard.appendChild(fleet);
  });
  upgradeDrillShelf();
}

/* ---------------- drill shelf (roster ranks) ----------------
   Roster chips stay static until their drill bank lands; once the forgeId
   resolves through findMock(), the matching chip goes live in place —
   original rank/sessions/T6 text untouched, stats + RUN appended. */
function upgradeDrillShelf(){
  var shelf = document.getElementById('tfDrills');
  if (!shelf || !MAP || !MAP.drills) return;
  var chips = shelf.querySelectorAll('.tf-chip');
  MAP.drills.forEach(function(c, i){
    var chip = chips[i];
    if (!chip) return;
    if (!findMock(c.forgeId)){
      chip.classList.remove('tf-chip-live');
      var dead = chip.querySelectorAll('.tf-chip-stats, .tf-play');
      Array.prototype.forEach.call(dead, function(d){ d.remove(); });
      return;
    }
    chip.classList.add('tf-chip-live');
    var st = chip.querySelector('.tf-chip-stats');
    if (!st){
      st = document.createElement('div');
      st.className = 'tf-mock-stats tf-chip-stats';
      chip.appendChild(st);
      var play = document.createElement('button');
      play.className = 'tf-play tf-chip-play';
      play.type = 'button';
      play.textContent = '▶ RUN';
      play.setAttribute('data-tf-play', c.forgeId);
      play.addEventListener('click', function(){ openMock(c.forgeId); });
      chip.appendChild(play);
    }
    var atts = attemptsFor(c.forgeId), best = bestPct(c.forgeId);
    st.innerHTML = atts.length
      ? 'attempts: <b>' + atts.length + '</b> · best: <b>' + (best === null ? '—' : best.toFixed(1) + '%') + '</b>'
      : '25 problems · 55 min · max 98 · stamp 6·12·7';
  });
}

/* ---------------- the mock cockpit ---------------- */
var RUN = null;
var R = {};
function buildRunDom(){
  if (R.el) return;
  var el = document.createElement('div');
  el.className = 'tf-run';
  el.id = 'tfRun';
  el.style.display = 'none';
  el.innerHTML = '<div class="tf-run-shell">'
    + '<div class="tf-run-head"><span class="tf-run-id"></span><span class="tf-aichi">AI-GENERATED PRACTICE</span>'
    + '<span class="tf-timer"></span><span class="tf-prog"></span><button class="tf-run-x" type="button" title="Close">✕</button></div>'
    + '<div class="tf-run-body"></div>'
    + '<div class="tf-run-foot"><button class="tf-nav" data-tf="prev" type="button">‹ PREV</button>'
    + '<div class="tf-pal"></div><button class="tf-nav" data-tf="next" type="button">NEXT ›</button>'
    + '<button class="tf-subm" type="button">SUBMIT</button></div></div>';
  document.body.appendChild(el);
  R.el = el;
  R.body = el.querySelector('.tf-run-body');
  R.pal = el.querySelector('.tf-pal');
  R.timer = el.querySelector('.tf-timer');
  R.prog = el.querySelector('.tf-prog');
  R.rid = el.querySelector('.tf-run-id');
  R.subm = el.querySelector('.tf-subm');
  el.querySelector('.tf-run-x').addEventListener('click', function(){ closeMock(); });
  el.querySelector('[data-tf="prev"]').addEventListener('click', function(){ if (RUN && RUN.idx > 0){ RUN.idx--; paintQ(); } });
  el.querySelector('[data-tf="next"]').addEventListener('click', function(){ if (RUN && RUN.idx < RUN.mock.problems.length - 1){ RUN.idx++; paintQ(); } });
  R.subm.addEventListener('click', function(){
    if (!RUN) return;
    if (!RUN.armed){ RUN.armed = true; R.subm.classList.add('armed'); R.subm.textContent = 'CONFIRM SUBMIT · MARKS LOCK'; return; }
    finalizeRun(false);
  });
}
function fmtClock(s){
  var m = Math.floor(s / 60), r = s % 60;
  return (m < 10 ? '0' : '') + m + ':' + (r < 10 ? '0' : '') + r;
}
function tick(){
  if (!RUN) return;
  RUN.secondsLeft--;
  if (RUN.secondsLeft <= 0){ RUN.secondsLeft = 0; paintClock(); finalizeRun(true); return; }
  paintClock();
}
function paintClock(){
  R.timer.textContent = fmtClock(RUN.secondsLeft);
  if (RUN.secondsLeft <= 300) R.timer.classList.add('tf-hot'); else R.timer.classList.remove('tf-hot');
}
function openMock(id){
  if (RUN) return;
  var hit = findMock(id);
  if (!hit) return;
  var bank = hit.bank, mock = hit.mock;
  buildRunDom();
  RUN = { bank: bank, mock: mock, idx: 0, answers: {}, armed: false,
          secondsLeft: (mock.minutes || 55) * 60, timer: null, phase: 'run', filter: 'all' };
  R.rid.textContent = mock.id + ' — ' + mock.title;
  R.subm.classList.remove('armed'); R.subm.textContent = 'SUBMIT';
  R.el.style.display = 'flex';
  paintClock();
  var N = mock.problems.length, html = '';
  for (var i = 0; i < N; i++) html += '<button type="button" data-q="' + i + '">' + (i + 1) + '</button>';
  R.pal.innerHTML = html;
  Array.prototype.forEach.call(R.pal.querySelectorAll('button'), function(b){
    b.addEventListener('click', function(){ RUN.idx = Number(b.getAttribute('data-q')); paintQ(); });
  });
  RUN.timer = setInterval(tick, 1000);
  paintQ();
}
function paintQ(){
  if (!RUN) return;
  var m = RUN.mock, i = RUN.idx, p = m.problems[i];
  R.prog.textContent = 'Q ' + (i + 1) + ' / ' + m.problems.length;
  R.body.innerHTML = '';
  var meta = document.createElement('div');
  meta.className = 'tf-qmeta';
  meta.innerHTML = '<span class="tf-chipd tf-' + p.diff + '">' + p.diff.toUpperCase() + '</span>'
    + '<span class="tf-chipd">' + p.sub + '</span><span class="tf-chipd">' + p.concept + '</span>'
    + '<span class="tf-chipd">' + (p.diff === 'apex' ? '+5 / 0' : '+3.5 / −0.875') + '</span>';
  R.body.appendChild(meta);
  if (p.fig){
    var fig = document.createElement('div');
    fig.className = 'tf-fig';
    fig.innerHTML = p.fig;
    R.body.appendChild(fig);
  }
  var stem = document.createElement('div');
  stem.className = 'tf-qstem';
  setMathText(stem, p.q);
  R.body.appendChild(stem);
  var opts = document.createElement('div');
  opts.className = 'tf-qopts';
  p.o.forEach(function(otx, oi){
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'tf-qopt' + (RUN.answers[i] === oi ? ' sel' : '');
    var L = document.createElement('span');
    L.className = 'tf-oletter'; L.textContent = 'ABCD'[oi];
    var T = document.createElement('span');
    setMathText(T, otx);
    b.appendChild(L); b.appendChild(T);
    b.addEventListener('click', function(){
      RUN.answers[i] = oi;
      RUN.armed = false; R.subm.classList.remove('armed'); R.subm.textContent = 'SUBMIT';
      paintQ();
    });
    opts.appendChild(b);
  });
  R.body.appendChild(opts);
  paintPal();
}
function paintPal(){
  if (!RUN) return;
  Array.prototype.forEach.call(R.pal.querySelectorAll('button'), function(b){
    var qi = Number(b.getAttribute('data-q'));
    b.classList.toggle('ans', RUN.answers[qi] !== undefined);
    b.classList.toggle('cur', qi === RUN.idx);
  });
}
function scoreRun(){
  var s = { score: 0, correct: 0, wrong: 0, skip: 0 };
  RUN.mock.problems.forEach(function(p, i){
    var sch = RUN.bank.meta.scheme[p.diff];
    if (RUN.answers[i] === undefined) s.skip++;
    else if (RUN.answers[i] === p.a){ s.correct++; s.score += sch.p; }
    else { s.wrong++; s.score += sch.n; }
  });
  s.score = Math.round(s.score * 1000) / 1000;
  return s;
}
function finalizeRun(auto){
  if (!RUN) return;
  if (RUN.timer){ clearInterval(RUN.timer); RUN.timer = null; }
  var s = scoreRun();
  var att = {
    ts: Date.now(), auto: !!auto, score: s.score, max: RUN.bank.meta.maxScore,
    correct: s.correct, wrong: s.wrong, skip: s.skip,
    timeSec: RUN.mock.minutes * 60 - RUN.secondsLeft,
    answers: RUN.answers
  };
  saveAttempt(RUN.mock.id, att);
  RUN.result = att;
  RUN.phase = 'review';
  paintReview();
  renderFleet();
}
function paintReview(){
  var res = RUN.result, bank = RUN.bank;
  R.subm.style.display = 'none';
  R.pal.innerHTML = '';
  R.body.innerHTML = '';
  var head = document.createElement('div');
  head.innerHTML = '<div class="tf-res-big"><b>' + res.score + '</b> / ' + res.max + '</div>'
    + '<div class="tf-res-sub">attempt saved · namespace tf: (3-hr sim stats untouched) · correct ' + res.correct
    + ' · wrong ' + res.wrong + ' · skipped ' + res.skip + ' · time ' + fmtClock(res.timeSec)
    + (res.auto ? ' · AUTO-SUBMITTED (timer hit 0:00)' : '') + '</div>'
    + '<div class="tf-res-sub">CSIR marking applied: seed/standard +3.5 / −0.875 · apex +5 / 0</div>';
  R.body.appendChild(head);
  var fr = document.createElement('div');
  fr.className = 'tf-filters';
  [['all','ALL 25'],['wrong','WRONG'],['skip','SKIPPED']].forEach(function(f){
    var b = document.createElement('button');
    b.type = 'button'; b.textContent = f[1];
    if (RUN.filter === f[0]) b.classList.add('on');
    b.addEventListener('click', function(){ RUN.filter = f[0]; paintReview(); });
    fr.appendChild(b);
  });
  var end = document.createElement('button');
  end.className = 'tf-nav tf-end';
  end.type = 'button';
  end.textContent = '↩ BACK TO FLEET';
  end.addEventListener('click', function(){ closeMock(); });
  fr.appendChild(end);
  R.body.appendChild(fr);
  var submStyle = '';
  RUN.mock.problems.forEach(function(p, i){
    var picked = res.answers[i];
    var cls = picked === undefined ? 'skip' : (picked === p.a ? 'good' : 'bad');
    if (RUN.filter === 'wrong' && cls !== 'bad') return;
    if (RUN.filter === 'skip' && cls !== 'skip') return;
    var sch = bank.meta.scheme[p.diff];
    var pts = picked === undefined ? '—' : (picked === p.a ? '+' + sch.p : '' + sch.n);
    var card = document.createElement('div');
    card.className = 'tf-rev ' + cls;
    var h = document.createElement('div');
    h.className = 'tf-rev-head';
    h.innerHTML = '<span>Q' + (i + 1) + '</span><span class="tf-chipd tf-' + p.diff + '">' + p.diff.toUpperCase() + '</span>'
      + '<span class="tf-chipd">' + p.sub + '</span><span class="tf-chipd">' + p.concept + '</span>'
      + '<span class="tf-rev-pt">' + pts + '</span>';
    card.appendChild(h);
    if (p.fig){
      var fig = document.createElement('div');
      fig.className = 'tf-fig';
      fig.innerHTML = p.fig;
      card.appendChild(fig);
    }
    var stem = document.createElement('div');
    stem.className = 'tf-qstem';
    setMathText(stem, p.q);
    card.appendChild(stem);
    p.o.forEach(function(otx, oi){
      var d = document.createElement('div');
      d.className = 'tf-rev-opt' + (oi === p.a ? ' corr' : '') + (picked === oi ? ' you' : '');
      var L = document.createElement('span');
      L.className = 'tf-oletter'; L.textContent = 'ABCD'[oi] + (oi === p.a ? ' ✓' : '') + (picked === oi && oi !== p.a ? ' ✗' : '');
      var T = document.createElement('span');
      setMathText(T, otx);
      d.appendChild(L); d.appendChild(T);
      card.appendChild(d);
    });
    var sol = document.createElement('div');
    sol.className = 'tf-sol';
    var lab = document.createElement('div');
    lab.className = 'tf-sol-lab';
    lab.textContent = 'SOLUTION · AI-GENERATED';
    var body = document.createElement('div');
    setMathText(body, p.sol);
    sol.appendChild(lab); sol.appendChild(body);
    card.appendChild(sol);
    var chk = document.createElement('div');
    chk.className = 'tf-sol';
    var lab2 = document.createElement('div');
    lab2.className = 'tf-sol-lab';
    lab2.textContent = 'INDEPENDENT DOUBLE-CHECK';
    var body2 = document.createElement('div');
    setMathText(body2, p.vfy);
    chk.appendChild(lab2); chk.appendChild(body2);
    card.appendChild(chk);
    R.body.appendChild(card);
  });
}
function closeMock(){
  if (RUN && RUN.timer){ clearInterval(RUN.timer); }
  RUN = null;
  if (R.el) R.el.style.display = 'none';
  if (R.subm) R.subm.style.display = '';
  renderFleet();
}

function renderAll(){ render(); renderFleet(); }

injectCss();
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderAll);
else renderAll();
var tab = document.querySelector('.tab-btn[data-tab="topicforge"]');
if (tab) tab.addEventListener('click', function(){ setTimeout(renderAll, 0); });
window.TOPICFORGE_PANEL_RENDER = renderAll;
})();
