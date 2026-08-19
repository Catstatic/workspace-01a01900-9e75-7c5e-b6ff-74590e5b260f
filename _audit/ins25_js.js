/* ============================================================================
   FOCUSFRAME — TEAL GOAL BRACKETS & READING TIMER (ROUND 27 · part 2: brain)
   Spec: project/FOCUSFRAME_PLAN.md
   Pure layer (FG.*) is DOM-free and node-testable; the DOM layer mounts only
   when a document exists. House rules: no network, no AI, no dependencies,
   all state namespaced under fg: keys (excluded from backup payloads by the
   registered surgical_r27 pair), content text color/typography NEVER styled.
   ============================================================================ */
(function(){
'use strict';

/* ============================ pure layer ============================ */
var FG = {};
FG.VERSION = 'R27';
FG.WPMS = [120,160,200,260];
FG.DEFAULT_WPM = 200;
FG.TINTS = [0.035,0.05,0.065,0.085,0.11]; /* slider steps; index 2 = whisper */
FG.DEFAULT_TINT = 2;
FG.MIN_SEC = 60;
FG.MAX_SEC = 180*60;
FG.PHASES = ['ready','running','paused','done'];

FG.clamp = function(v,lo,hi){ v = Number(v); if(!isFinite(v)) v = 0; return v<lo?lo:(v>hi?hi:v); };

FG.wordCount = function(text){
  if(text == null) return 0;
  var t = String(text).trim();
  if(!t) return 0;
  return t.split(/\s+/).length;
};

/* counts: {words, eq, fig, ex} · wpm · -> seconds, clamped to [60, 10800] */
FG.estimateSeconds = function(counts, wpm){
  var c = counts || {};
  wpm = FG.WPMS.indexOf(+wpm) >= 0 ? +wpm : FG.DEFAULT_WPM;
  var words = FG.clamp(c.words||0, 0, 1e8);
  var eq    = FG.clamp(c.eq   ||0, 0, 1e6);
  var fig   = FG.clamp(c.fig  ||0, 0, 1e6);
  var ex    = FG.clamp(c.ex   ||0, 0, 1e6);
  var sec = (words/wpm)*60 + 20*eq + 15*fig + 10*ex;
  return Math.round(FG.clamp(sec, FG.MIN_SEC, FG.MAX_SEC));
};

FG.fmtMin = function(sec){ return '≈ ' + Math.max(1, Math.round(sec/60)) + ' MIN'; };
FG.fmtClock = function(sec){
  sec = Math.max(0, Math.round(Number(sec)||0));
  var m = Math.floor(sec/60), s = sec%60;
  return m + ':' + (s<10?'0':'') + s;
};

/* ---- goal range: boundaries 0..n · enclosed blocks = [s, e) · s < e ---- */
FG.clampRange = function(s, e, n){
  n = Math.max(0, Math.round(Number(n)||0));
  if(n === 0) return {s:0, e:0};
  s = FG.clamp(Math.round(Number(s)||0), 0, n-1);
  e = FG.clamp(Math.round(Number(e)||0), 1, n);
  if(s >= e){ if(s >= n-1){ s = n-1; e = n; } else { e = s+1; } }
  return {s:s, e:e};
};

/* nearest snap boundary index for content-Y (bounds = ascending Y array) */
FG.nearestBoundary = function(y, bounds){
  if(!bounds || !bounds.length) return 0;
  y = Number(y)||0;
  var best = 0, bd = Math.abs(y - bounds[0]);
  for(var i=1;i<bounds.length;i++){
    var d = Math.abs(y - bounds[i]);
    if(d < bd){ bd = d; best = i; }
  }
  return best;
};

/* ---- reading session state machine ---- */
FG.newSession = function(estSec){
  return {phase:'ready', est:FG.clamp(Math.round(Number(estSec)||FG.MIN_SEC), FG.MIN_SEC, FG.MAX_SEC), elapsed:0, stamp:0};
};
FG.elapsedOf = function(sess, now){
  if(!sess) return 0;
  if(sess.phase === 'running') return sess.elapsed + Math.max(0,(now - sess.stamp))/1000;
  return sess.elapsed;
};
FG.remainingOf = function(sess, now){
  if(!sess) return 0;
  return Math.max(0, sess.est - FG.elapsedOf(sess, now));
};
/* ready→running · running→paused · paused→running · done→done */
FG.toggle = function(sess, now){
  sess = sess || FG.newSession(FG.MIN_SEC);
  now = Number(now)||0;
  if(sess.phase === 'ready'){ sess.phase='running'; sess.elapsed=0; sess.stamp=now; }
  else if(sess.phase === 'running'){ sess.elapsed = sess.elapsed + Math.max(0,(now-sess.stamp))/1000; sess.phase='paused'; sess.stamp=0; }
  else if(sess.phase === 'paused'){ sess.phase='running'; sess.stamp=now; }
  return sess;
};
/* advance clock; flips running→done when the window is reached */
FG.tick = function(sess, now){
  if(!sess || sess.phase !== 'running') return sess;
  var e = sess.elapsed + Math.max(0,(now - sess.stamp))/1000;
  if(e >= sess.est){ sess.phase='done'; sess.elapsed = sess.est; sess.stamp=0; }
  return sess;
};
FG.encodeSession = function(sess){ try{ return JSON.stringify(sess); }catch(_){ return null; } };
FG.decodeSession = function(raw, estSec){
  var fresh = FG.newSession(estSec);
  if(!raw) return fresh;
  var o;
  try{ o = JSON.parse(raw); }catch(_){ return fresh; }
  if(!o || typeof o !== 'object') return fresh;
  if(FG.PHASES.indexOf(o.phase) < 0) return fresh;
  var est = FG.clamp(Math.round(Number(o.est)||0), FG.MIN_SEC, FG.MAX_SEC);
  var el  = FG.clamp(Number(o.elapsed)||0, 0, est);
  var st  = FG.clamp(Number(o.stamp)||0, 0, 4e12);
  return {phase:o.phase, est:est, elapsed:el, stamp: o.phase==='running' ? st : 0};
};
FG.labelFor = function(sess, now){
  if(!sess) return '';
  if(sess.phase === 'ready')   return FG.fmtMin(sess.est) + ' · CLICK TO START';
  if(sess.phase === 'running') return FG.fmtClock(FG.remainingOf(sess,now)) + ' LEFT · ' + FG.fmtClock(FG.elapsedOf(sess,now)) + ' READ';
  if(sess.phase === 'paused')  return '⏸ PAUSED · ' + FG.fmtClock(FG.remainingOf(sess,now)) + ' LEFT';
  return '✔ GOAL WINDOW DONE';
};
FG.validPrefs = function(raw){
  var p = {wpm:FG.DEFAULT_WPM, tint:FG.DEFAULT_TINT}, o = null;
  try{ o = raw ? JSON.parse(raw) : null; }catch(_){ o = null; }
  if(o && typeof o === 'object'){
    if(FG.WPMS.indexOf(+o.wpm) >= 0) p.wpm = +o.wpm;
    if(typeof o.tint !== 'undefined') p.tint = Math.round(FG.clamp(o.tint, 0, FG.TINTS.length-1));
  }
  return p;
};

/* export for unit tests (and the app); stop here when there is no DOM */
if(typeof globalThis !== 'undefined') globalThis.__focusframe = FG;
if(typeof document === 'undefined' || !document.createElement) return;

/* ============================ DOM layer ============================ */
var raf = window.requestAnimationFrame || function(f){ return setTimeout(f,16); };
var LS = window.localStorage;
function lsGet(k){ try{ return LS.getItem(k); }catch(_){ return null; } }
function lsSet(k,v){ try{ LS.setItem(k,v); }catch(_){} }
function lsDel(k){ try{ LS.removeItem(k); }catch(_){} }
function toast(msg){ if(typeof window.showToast==='function'){ try{ window.showToast(msg); }catch(_){} } }

var KEY_PREFS = 'fg:prefs';
var KEY_GOALS = 'fg:goals';
var KEY_LOG   = 'fg:log';
var keySession = function(item){ return 'fg:session:'+item; };

var reader=null, layer=null, lineS=null, lineE=null, chip=null, chipMain=null, wpmSel=null, tintInp=null, doneBtn=null, toggleBtn=null, controls=null, subjectSel=null;
var enabled=false, blocks=[], boundsItem=[], goal={s:0,e:0}, itemKey='', prefs=FG.validPrefs(lsGet(KEY_PREFS)), session=null, tickTimer=0, mutating=false, rafQueued=0;

function savePrefs(){ lsSet(KEY_PREFS, JSON.stringify(prefs)); }
function loadGoals(){ var raw=lsGet(KEY_GOALS); if(!raw) return {}; try{ var o=JSON.parse(raw); return (o&&typeof o==='object')?o:{}; }catch(_){ return {}; } }
function saveGoal(){ var g=loadGoals(); g[itemKey]={s:goal.s,e:goal.e}; lsSet(KEY_GOALS, JSON.stringify(g)); }
function clearGoal(){ var g=loadGoals(); delete g[itemKey]; lsSet(KEY_GOALS, JSON.stringify(g)); }
function loadSession(){ session = FG.decodeSession(lsGet(keySession(itemKey)), currentEstimate()); }
function saveSession(){ if(session){ session.est = session.est; lsSet(keySession(itemKey), FG.encodeSession(session)); } }
function logCompletion(){
  var raw=lsGet(KEY_LOG), arr=[];
  try{ arr = raw?JSON.parse(raw):[]; if(!Array.isArray(arr)) arr=[]; }catch(_){ arr=[]; }
  arr.push({item:itemKey, minutes:Math.round(session.est/60), elapsed:Math.round(session.elapsed), at:new Date().toISOString()});
  if(arr.length>200) arr = arr.slice(-200);
  lsSet(KEY_LOG, JSON.stringify(arr));
}

/* ---- content scan: words / display-eq / figures / worked examples ---- */
function countsFor(range){
  var words=0, eq=0, fig=0, ex=0;
  for(var i=range.s;i<range.e;i++){
    var b=blocks[i]; if(!b) continue;
    words += FG.wordCount(b.textContent||'');
    eq  += b.querySelectorAll('.katex-display, .content-math-block').length;
    fig += b.querySelectorAll('img, figure').length;
    ex  += b.querySelectorAll('.example, .worked-example, .content-worked-example').length;
    if(b.matches && b.matches('.katex-display, .content-math-block')) eq++;
    if(b.matches && b.matches('img, figure')) fig++;
    if(b.matches && b.matches('.example, .worked-example, .content-worked-example')) ex++;
  }
  return {words:words, eq:eq, fig:fig, ex:ex};
}
function currentEstimate(){ return FG.estimateSeconds(countsFor(goal), prefs.wpm); }

/* ---- geometry ---- */
function collectBlocks(){
  if(!reader) return [];
  var out=[], kids=reader.children;
  for(var i=0;i<kids.length;i++){
    var el=kids[i];
    if(el.nodeType!==1) continue;
    if(el.hasAttribute('data-fg')) continue;
    if(el.classList.contains('content-vault-status')) continue;
    out.push(el);
  }
  return out;
}
function measure(){
  blocks = collectBlocks();
  var bnds=[], i, lastBottom=0;
  for(i=0;i<blocks.length;i++){
    bnds.push(blocks[i].offsetTop);
    lastBottom = Math.max(lastBottom, blocks[i].offsetTop + blocks[i].offsetHeight);
  }
  bnds.push(lastBottom);
  boundsItem = bnds;
  if(layer) layer.style.height = lastBottom+'px';
  goal = FG.clampRange(goal.s, goal.e, blocks.length);
}

/* ---- tint application: ONLY background; text never styled ---- */
/* tint strength as explicit classes — foreground/text never styled */
function applyTintStep(){
  if(!reader) return;
  for(var i=0;i<FG.TINTS.length;i++) reader.classList.remove('fg-tint-'+i);
  reader.classList.add('fg-tint-'+prefs.tint);
}
function removeTintStep(){
  if(!reader) return;
  for(var i=0;i<FG.TINTS.length;i++) reader.classList.remove('fg-tint-'+i);
}
function applyTint(){
  for(var i=0;i<blocks.length;i++){
    if(i>=goal.s && i<goal.e) blocks[i].classList.add('fg-in-goal');
    else blocks[i].classList.remove('fg-in-goal');
  }
}

/* ---- chip ---- */
function renderChip(){
  if(!chip || !session) return;
  var now = Date.now();
  chipMain.textContent = FG.labelFor(session, now);
  chip.classList.toggle('fg-chip-running', session.phase==='running');
  chip.classList.toggle('fg-chip-done', session.phase==='done');
  doneBtn.style.display = session.phase==='done' ? '' : 'none';
}
/* single clock-advance path — used by the live interval AND the test hook */
function tickOnce(now){
  if(!session) return;
  var was = session.phase;
  FG.tick(session, now);
  if(was==='running' && session.phase==='done'){
    stopTicking(); saveSession();
    toast('⏱ Focus window reached — mark complete when ready.');
  }
  renderChip();
}
function startTicking(){
  stopTicking();
  tickTimer = setInterval(function(){ tickOnce(Date.now()); }, 1000);
  saveSession();
}
function stopTicking(){ if(tickTimer){ clearInterval(tickTimer); tickTimer=0; } }
/* fold the live clock into elapsed without changing phase */
function foldClock(){
  if(session && session.phase==='running'){
    session.elapsed = FG.elapsedOf(session, Date.now());
    session.stamp = Date.now();
  }
}

/* ---- full placement refresh ---- */
function place(){
  if(!enabled || !layer) return;
  var n=boundsItem.length-1;
  goal = FG.clampRange(goal.s, goal.e, n);
  var sy = boundsItem[goal.s]||0, ey = boundsItem[goal.e]||sy;
  lineS.style.top = sy+'px';
  lineE.style.top = ey+'px';
  lineS.setAttribute('aria-valuemax', String(n));
  lineE.setAttribute('aria-valuemax', String(n));
  lineS.setAttribute('aria-valuenow', String(goal.s));
  lineE.setAttribute('aria-valuenow', String(goal.e));
  lineS.setAttribute('aria-valuetext', 'goal starts before block '+(goal.s+1)+' of '+n);
  lineE.setAttribute('aria-valuetext', 'goal ends after block '+goal.e+' of '+n);
  chip.style.top = (ey+8)+'px';
  applyTintStep();
  applyTint();
  if(session){ foldClock(); session.est = currentEstimate(); } /* spec: timer auto-sizes to enclosed content, live, in every phase */
  if(session && session.phase==='paused') session.stamp = 0;
  renderChip();
}
function queuePlace(){
  if(rafQueued) return;
  rafQueued=1;
  raf(function(){ rafQueued=0; measure(); place(); });
}

/* ---- persistence + re-arm after vault re-render ---- */
function armGoal(){
  var saved = loadGoals()[itemKey];
  goal = saved ? FG.clampRange(saved.s, saved.e, blocks.length) : {s:0, e:blocks.length};
  goal = FG.clampRange(goal.s, goal.e, blocks.length);
}
function onReaderMutations(){
  if(mutating || !enabled) return;
  /* vault re-render wipes reader.innerHTML — our overlay is included. Rebuild it. */
  if(!layer || !reader.contains(layer)){
    mutating=true;
    measure();
    buildOverlay();           /* buildOverlay sets mutating=false at end… */
    mutating=false;
    armGoal();
    goal = FG.clampRange(goal.s, goal.e, blocks.length);
  }
  queuePlace();
}

/* ---- drag engine ---- */
var dragWhich=null;
function contentY(ev){
  var r = reader.getBoundingClientRect();
  return (ev.clientY - r.top) + (reader.scrollTop||0);
}
function dragTo(ev){
  var idx = FG.nearestBoundary(contentY(ev), boundsItem);
  if(dragWhich==='s') goal.s = Math.min(idx, goal.e-1);
  else goal.e = Math.max(idx, goal.s+1);
  goal = FG.clampRange(goal.s, goal.e, boundsItem.length-1);
  var sy=boundsItem[goal.s]||0, ey=boundsItem[goal.e]||sy;
  lineS.style.top=sy+'px'; lineE.style.top=ey+'px'; chip.style.top=(ey+8)+'px';
  applyTint();
  if(session){ foldClock(); session.est=currentEstimate(); if(session.phase==='paused') session.stamp=0; renderChip(); }
}
function bindDrag(line, which){
  line.addEventListener('pointerdown', function(ev){
    ev.preventDefault();
    dragWhich=which;
    line.classList.add('fg-dragging');
    if(line.setPointerCapture && ev.pointerId!=null){ try{ line.setPointerCapture(ev.pointerId); }catch(_){}}
  });
  line.addEventListener('pointermove', function(ev){ if(dragWhich===which) dragTo(ev); });
  function drop(ev){
    if(dragWhich!==which) return;
    dragWhich=null;
    line.classList.remove('fg-dragging');
    if(line.releasePointerCapture && ev && ev.pointerId!=null){ try{ line.releasePointerCapture(ev.pointerId); }catch(_){}}
    saveGoal(); measure(); place();
  }
  line.addEventListener('pointerup', drop);
  line.addEventListener('pointercancel', drop);
  line.addEventListener('keydown', function(ev){
    var d=0;
    if(ev.key==='ArrowUp') d=-1; else if(ev.key==='ArrowDown') d=1;
    else if(ev.key==='Home') d=-9999; else if(ev.key==='End') d=9999;
    else return;
    ev.preventDefault();
    var n=boundsItem.length-1;
    if(which==='s') goal.s = d<0 ? Math.max(0, goal.s+d) : Math.min(goal.e-1, goal.s+d);
    else goal.e = d<0 ? Math.max(goal.s+1, goal.e+d) : Math.min(n, goal.e+d);
    goal = FG.clampRange(goal.s, goal.e, n);
    saveGoal(); place();
  });
}

/* ---- build/teardown ---- */
function buildOverlay(){
  mutating=true;
  layer = document.createElement('div');
  layer.className='fg-layer'; layer.setAttribute('data-fg','layer');

  lineS = document.createElement('div');
  lineS.className='fg-line fg-line-start'; lineS.setAttribute('data-fg','line');
  lineS.tabIndex=0; lineS.setAttribute('role','slider'); lineS.setAttribute('aria-label','Goal start line');
  lineS.setAttribute('aria-valuemin','0');
  lineS.innerHTML='<span class="fg-tag">GOAL START ▲ <span class="fg-grip">⠿</span></span>';

  lineE = document.createElement('div');
  lineE.className='fg-line fg-line-end'; lineE.setAttribute('data-fg','line');
  lineE.tabIndex=0; lineE.setAttribute('role','slider'); lineE.setAttribute('aria-label','Goal end line');
  lineE.setAttribute('aria-valuemin','0');
  lineE.innerHTML='<span class="fg-tag">GOAL END ▼ <span class="fg-grip">⠿</span></span>';

  chip = document.createElement('div');
  chip.className='fg-chip'; chip.setAttribute('data-fg','chip');

  chipMain = document.createElement('button');
  chipMain.type='button'; chipMain.className='fg-chip-main';
  chipMain.setAttribute('aria-live','polite');

  wpmSel = document.createElement('select');
  wpmSel.setAttribute('aria-label','Reading speed (words per minute)');
  for(var i=0;i<FG.WPMS.length;i++){
    var o=document.createElement('option');
    o.value=String(FG.WPMS[i]); o.textContent=String(FG.WPMS[i])+' wpm';
    wpmSel.appendChild(o);
  }
  wpmSel.value=String(prefs.wpm);

  var tintWrap=document.createElement('label');
  tintWrap.className='fg-tint-wrap'; tintWrap.textContent='tint ';
  tintInp=document.createElement('input');
  tintInp.type='range'; tintInp.className='fg-tint';
  tintInp.min='0'; tintInp.max=String(FG.TINTS.length-1); tintInp.step='1';
  tintInp.value=String(prefs.tint);
  tintInp.setAttribute('aria-label','Goal tint strength');
  tintWrap.appendChild(tintInp);

  doneBtn=document.createElement('button');
  doneBtn.type='button'; doneBtn.className='fg-chip-complete';
  doneBtn.textContent='MARK COMPLETE'; doneBtn.style.display='none';

  chip.appendChild(chipMain); chip.appendChild(wpmSel); chip.appendChild(tintWrap); chip.appendChild(doneBtn);
  layer.appendChild(lineS); layer.appendChild(lineE); layer.appendChild(chip);
  reader.appendChild(layer);
  mutating=false;

  bindDrag(lineS,'s'); bindDrag(lineE,'e');
  wpmSel.addEventListener('change', function(){
    prefs.wpm = +wpmSel.value; savePrefs();
    if(session && session.phase!=='running'){ session.est=currentEstimate(); }
    renderChip();
  });
  tintInp.addEventListener('input', function(){
    prefs.tint = Math.round(FG.clamp(+tintInp.value,0,FG.TINTS.length-1)); savePrefs();
    applyTintStep();
  });
  chipMain.addEventListener('click', function(){
    if(!session) session = FG.newSession(currentEstimate());
    var was = session.phase;
    FG.toggle(session, Date.now());
    if(session.phase==='running') startTicking(); else stopTicking();
    if(was==='ready' && session.phase==='running') toast('📖 Reading time started — stay in the bracket.');
    saveSession(); renderChip();
  });
  doneBtn.addEventListener('click', function(){
    logCompletion();
    clearGoal();
    stopTicking();
    session = null;                 /* null BEFORE disable() so it is never re-persisted */
    lsDel(keySession(itemKey));
    toast('✔ Focus session logged — bracket cleared.');
    disable();
  });
}

function enable(){
  if(enabled || !reader) return;
  enabled=true;
  reader.classList.add('fg-armed');
  itemKey = subjectSel && subjectSel.value ? subjectSel.value : 'default';
  measure();
  buildOverlay();
  armGoal();
  loadSession();
  if(session && session.phase==='running'){ session.stamp = Date.now(); startTicking(); } /* crash-safe resume: frozen elapsed, fresh stamp */
  goal = FG.clampRange(goal.s, goal.e, blocks.length);
  place();
  if(toggleBtn){ toggleBtn.setAttribute('aria-pressed','true'); }
  startObserver();
}
function disable(){
  if(!enabled) return;
  enabled=false;
  stopTicking();
  foldClock();          /* bank live seconds before persisting */
  saveSession();
  stopObserver();
  for(var i=0;i<blocks.length;i++) blocks[i].classList.remove('fg-in-goal');
  mutating=true;
  if(layer && layer.parentNode) layer.parentNode.removeChild(layer);
  layer=null; lineS=null; lineE=null; chip=null; chipMain=null; wpmSel=null; tintInp=null; doneBtn=null;
  reader.classList.remove('fg-armed');
  removeTintStep();
  mutating=false;
  if(toggleBtn){ toggleBtn.setAttribute('aria-pressed','false'); }
}
function toggle(){ if(enabled) disable(); else enable(); }

/* ---- observer: vault re-renders (subject/search) wipe our overlay → re-arm ---- */
var observer=null;
function startObserver(){
  if(!window.MutationObserver) return;
  stopObserver();
  observer = new MutationObserver(function(muts){
    if(mutating || !enabled) return;
    for(var i=0;i<muts.length;i++){ if(muts[i].type!=='childList') continue; onReaderMutations(); return; }
  });
  observer.observe(reader, {childList:true});
}
function stopObserver(){ if(observer){ observer.disconnect(); observer=null; } }

function onSubjectChange(){
  if(!enabled) return;
  saveGoal(); saveSession(); stopTicking();
  itemKey = subjectSel && subjectSel.value ? subjectSel.value : 'default';
  session=null;
  armGoal();                            /* each content item remembers its own bracket */
  goal = FG.clampRange(goal.s, goal.e, blocks.length);
  loadSession();
  if(session && session.phase==='running'){ session.phase='paused'; session.stamp=0; } /* item switch: hold the clock */
  saveSession(); place();
}

/* ---- hotkeys: Ctrl/Cmd+J always; Ctrl/Cmd+F only while inside the vault ---- */
function onKey(ev){
  if(!(ev.ctrlKey||ev.metaKey) || ev.altKey || ev.shiftKey) return;
  var k = (ev.key||'').toLowerCase();
  var t = ev.target;
  var typing = t && (t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.isContentEditable);
  if(typing) return;
  if(k==='j'){ ev.preventDefault(); toggle(); return; }
  if(k==='f'){
    if(enabled){ ev.preventDefault(); toggle(); return; }
    var r = document.getElementById('contentReader');
    var inside = r && (r.contains(t) || (t===r));
    var vault = document.getElementById('contentVault');
    if(!inside && vault && vault.contains(t)) inside=true;
    if(!inside && r){ try{ inside = !!(r.offsetWidth||r.offsetHeight||(r.getClientRects&&r.getClientRects().length)); }catch(_){ inside=false; } }
    if(inside){ ev.preventDefault(); toggle(); }
    /* otherwise: leave the browser's own find alone */
  }
}

/* ---- boot ---- */
function boot(){
  reader = document.getElementById('contentReader');
  controls = document.querySelector('.content-vault-controls');
  if(!reader || !controls) return false;
  subjectSel = document.getElementById('contentSubject');
  toggleBtn = document.getElementById('fgToggleBtn');
  if(!toggleBtn){
    toggleBtn = document.createElement('button');
    toggleBtn.type='button'; toggleBtn.id='fgToggleBtn';
    toggleBtn.textContent='⛶ GOAL';
    toggleBtn.title='Focus goal brackets (Ctrl+J)';
    toggleBtn.setAttribute('aria-pressed','false');
    controls.appendChild(toggleBtn);
    toggleBtn.addEventListener('click', toggle);
  }
  if(subjectSel){ subjectSel.addEventListener('change', onSubjectChange); }
  document.addEventListener('keydown', onKey, true); /* capture, but non-preempting unless handled */
  window.addEventListener('resize', function(){ if(enabled) queuePlace(); });
  window.addEventListener('beforeunload', function(){ if(enabled){ foldClock(); saveSession(); saveGoal(); } });
  document.addEventListener('visibilitychange', function(){ if(enabled && document.hidden) saveSession(); });
  return true;
}
if(!boot()){
  var tries=0;
  var bootTimer=setInterval(function(){
    tries++;
    if(boot() || tries>40) clearInterval(bootTimer);
  },500);
}

/* debug/testing handle */
FG._debug = {
  state: function(){ return {enabled:enabled, goal:{s:goal.s,e:goal.e}, n:blocks.length, itemKey:itemKey, prefs:prefs, session:session, bounds:boundsItem.slice()}; },
  enable: enable, disable: disable, toggle: toggle,
  forceTick: function(now){ tickOnce(now); },   /* same completion path as the live interval */
  recompute: function(){ measure(); place(); },
  els: function(){ return {layer:layer, lineS:lineS, lineE:lineE, chip:chip, chipMain:chipMain, doneBtn:doneBtn, toggleBtn:toggleBtn}; }
};

})();
