data = open('/home/user/_audit/ampdeck_data_src.js').read().strip('\n')
engine = '''
/* ═══════════════════════════════════════════════════════════════════════
   NEURAL AMP DECK (part 2: brain) — ported from the donor page, redesigned.
   72 GitHub-hosted tracks + 6 live radio streams, categories, search,
   prev/next/shuffle/loop, seek bar, volume, auto-reconnect watch-dog.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
'use strict';
if (typeof document === 'undefined' || !document.addEventListener) return;

var GH_BASE = 'https://raw.githubusercontent.com/xiao-zen-xo-hash/Neural-link/main/';
/*DATA*/

var MP_CAT_MAP = {};
MP_CATEGORIES.forEach(function (c) {
  if (c.keys) c.keys.forEach(function (k) { MP_CAT_MAP[k] = c.key; });
});

var LS = {
  get: function (k, d) { try { var v = localStorage.getItem('ampdeck:' + k); return v === null ? d : v; } catch (e) { return d; } },
  set: function (k, v) { try { localStorage.setItem('ampdeck:' + k, v); } catch (e) {} }
};

var TOTAL_SOURCES = Object.keys(NEURAL_TRACKS).length + RADIO_CHANNELS.length;

/* ------------------------------ audio core ------------------------------ */
var audio = document.createElement('audio');
audio.id = 'ampAudio';
audio.preload = 'auto';
audio.style.display = 'none';
document.body.appendChild(audio);

var state = {
  key: LS.get('last', 'gh_dark_academia'),
  playing: false,
  loop: LS.get('loop', '1') === '1',
  cat: 'all',
  query: '',
  list: [],            // current visible entries = transport order
  reconnectTimer: null
};

function entryUrl(key) {
  if (key.indexOf('radio_') === 0) {
    var ch = RADIO_CHANNELS[+key.slice(6)];
    return ch ? ch.url : '';
  }
  var t = NEURAL_TRACKS[key];
  return t ? GH_BASE + t.file : '';
}
function entryName(key) {
  if (key.indexOf('radio_') === 0) {
    var ch = RADIO_CHANNELS[+key.slice(6)];
    return ch ? ch.name : '';
  }
  var t = NEURAL_TRACKS[key];
  return t ? t.name : '';
}
function isRadio(key) { return key.indexOf('radio_') === 0; }

/* ------------------------------ markup ------------------------------ */
var deck, launcher;

function buildLauncher() {
  launcher = document.createElement('button');
  launcher.id = 'ampLauncher';
  launcher.className = 'quick-btn';
  launcher.type = 'button';
  launcher.textContent = '🎧';
  launcher.title = 'Neural Amp Deck — 78 tracks & radio';
  var dock = document.querySelector('.quick-dock');
  if (dock) { dock.appendChild(launcher); }
  else {
    var solo = document.createElement('div');
    solo.className = 'quick-dock';
    solo.appendChild(launcher);
    document.body.appendChild(solo);
  }
  launcher.addEventListener('click', toggleDeck);
}

function buildDeck() {
  deck = document.createElement('div');
  deck.id = 'ampDeck';
  deck.setAttribute('role', 'dialog');
  deck.setAttribute('aria-label', 'music deck');
  deck.innerHTML =
    '<div class="amp-head">' +
      '<div class="amp-vinyl"></div>' +
      '<div class="amp-np"><div class="amp-np-kicker">NEURAL LINK AUDIO · AMP DECK</div>' +
      '<div class="amp-np-title"><span id="ampNpText">pick a track — ' + TOTAL_SOURCES + ' sources ready</span></div>' +
      '<div class="amp-live">LIVE RADIO</div></div>' +
      '<button class="amp-close" type="button" title="Close deck (Esc)">✕</button>' +
    '</div>' +
    '<div class="amp-transport">' +
      '<button class="amp-tbtn" id="ampShuf" type="button" title="Shuffle">🔀</button>' +
      '<button class="amp-tbtn" id="ampPrev" type="button" title="Previous">⏮</button>' +
      '<button class="amp-tbtn amp-play" id="ampPlay" type="button" title="Play / pause">▶</button>' +
      '<button class="amp-tbtn" id="ampNext" type="button" title="Next">⏭</button>' +
      '<button class="amp-tbtn" id="ampLoop" type="button" title="Loop current">🔁</button>' +
    '</div>' +
    '<div class="amp-progress"><span id="ampCur">0:00</span>' +
      '<div class="amp-bar" id="ampBar"><div class="amp-fill" id="ampFill"></div></div>' +
      '<span id="ampTot">--:--</span></div>' +
    '<div class="amp-volume">🔊<input type="range" min="0" max="100" id="ampVol"><span id="ampVolPct">80%</span></div>' +
    '<div class="amp-status" id="ampStatus"></div>' +
    '<div class="amp-search"><input id="ampSearch" type="text" placeholder="⌕  search ' + TOTAL_SOURCES + ' sources…" aria-label="search tracks"></div>' +
    '<div class="amp-cats" id="ampCats"></div>' +
    '<div class="amp-list" id="ampList"></div>';
  document.body.appendChild(deck);

  deck.querySelector('.amp-close').addEventListener('click', closeDeck);
  byId('ampPlay').addEventListener('click', togglePlay);
  byId('ampNext').addEventListener('click', next);
  byId('ampPrev').addEventListener('click', prev);
  byId('ampShuf').addEventListener('click', shuffle);
  byId('ampLoop').addEventListener('click', function () {
    state.loop = !state.loop;
    LS.set('loop', state.loop ? '1' : '0');
    this.classList.toggle('on', state.loop);
  });
  byId('ampLoop').classList.toggle('on', state.loop);

  var vol = byId('ampVol');
  vol.value = Math.round(parseFloat(LS.get('vol', '0.8')) * 100);
  applyVolume();
  vol.addEventListener('input', function () { LS.set('vol', String(vol.value / 100)); applyVolume(); });

  byId('ampSearch').addEventListener('input', function () { state.query = this.value; renderList(); });

  byId('ampBar').addEventListener('pointerdown', function (e) {
    if (isRadio(state.key)) return;
    if (!isFinite(audio.duration) || !audio.duration) return;
    var r = this.getBoundingClientRect();
    var frac = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    try { audio.currentTime = frac * audio.duration; } catch (err) {}
  });

  renderCats();
  renderList();
}

function byId(id) { return document.getElementById(id); }

function applyVolume() {
  var v = Math.round(parseFloat(LS.get('vol', '0.8')) * 100);
  audio.volume = Math.min(1, Math.max(0, v / 100));
  var pct = byId('ampVolPct'); if (pct) pct.textContent = v + '%';
}

/* ------------------------------ catalogue ------------------------------ */
function entriesFor(cat, query) {
  var out = [];
  var push = function (key) { out.push({ key: key, name: entryName(key), tag: isRadio(key) ? 'radio' : (MP_CAT_MAP[key] || ''), radio: isRadio(key) }); };
  if (cat === 'radio') {
    RADIO_CHANNELS.forEach(function (_, i) { push('radio_' + i); });
  } else {
    var catKeys = cat === 'all' ? null : (MP_CATEGORIES.filter(function (c) { return c.key === cat; })[0] || {}).keys;
    Object.keys(NEURAL_TRACKS).forEach(function (k) {
      if (catKeys && catKeys.indexOf(k) < 0) return;
      push(k);
    });
    if (cat === 'all') RADIO_CHANNELS.forEach(function (_, i) { push('radio_' + i); });
  }
  var q = (query || '').toLowerCase().trim();
  if (q) out = out.filter(function (e) { return e.name.toLowerCase().indexOf(q) >= 0; });
  return out;
}

function renderCats() {
  var box = byId('ampCats');
  box.innerHTML = '';
  MP_CATEGORIES.forEach(function (cat) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'amp-chip' + (cat.isRadio ? ' radio-chip' : '') + (state.cat === cat.key ? ' active' : '');
    b.textContent = cat.label;
    b.addEventListener('click', function () { state.cat = cat.key; renderCats(); renderList(); });
    box.appendChild(b);
  });
}

function renderList() {
  var list = byId('ampList');
  list.innerHTML = '';
  state.list = entriesFor(state.cat, state.query);
  if (!state.list.length) {
    var d = document.createElement('div');
    d.className = 'amp-empty';
    d.textContent = 'no tracks match that filter';
    list.appendChild(d);
    paintTransport();
    return;
  }
  state.list.forEach(function (e) {
    var row = document.createElement('div');
    row.className = 'amp-row' + (e.key === state.key ? ' current' : '');
    row.setAttribute('data-key', e.key);
    var eq = document.createElement('div'); eq.className = 'amp-eq';
    eq.innerHTML = '<i></i><i></i><i></i>';
    var nm = document.createElement('div'); nm.className = 'amp-row-name'; nm.textContent = e.name;
    var tg = document.createElement('div'); tg.className = 'amp-row-tag' + (e.radio ? ' is-radio' : '');
    tg.textContent = e.radio ? 'RADIO' : (e.tag || 'TRACK').toUpperCase();
    row.appendChild(eq); row.appendChild(nm); row.appendChild(tg);
    row.addEventListener('click', function () { playKey(e.key); });
    list.appendChild(row);
  });
  paintTransport();
}

/* ------------------------------ transport/playback ------------------------------ */
function setStatus(txt, cls) {
  var s = byId('ampStatus');
  if (!s) return;
  s.textContent = txt || '';
  s.className = 'amp-status' + (cls ? ' ' + cls : '');
}
function setNowPlaying() {
  var np = byId('ampNpText');
  if (np) np.textContent = state.key ? entryName(state.key) : 'pick a track';
  deck.classList.toggle('radio-mode', isRadio(state.key));
}
function playKey(key) {
  state.key = key;
  LS.set('last', key);
  clearTimeout(state.reconnectTimer);
  var url = entryUrl(key);
  if (!url) return;
  audio.src = url;
  audio.load();
  state.playing = true;
  var p = audio.play();
  setStatus('buffering…', 'warn');
  if (p && p.catch) p.then(function () { setStatus('', ''); }).catch(function () {
    setStatus('⚠ tap ▶ once more — browser wants a gesture', 'warn');
    state.playing = false; paintTransport();
  });
  setNowPlaying(); renderListKeep(key);
}
function renderListKeep(key) {
  var rows = byId('ampList').querySelectorAll('.amp-row');
  for (var i = 0; i < rows.length; i++) rows[i].classList.toggle('current', rows[i].getAttribute('data-key') === key);
  paintTransport();
}
function togglePlay() {
  if (!audio.src) { playKey(state.key); return; }
  if (audio.paused) {
    audio.play().then(function () { state.playing = true; paintTransport(); }).catch(function () {});
  } else {
    audio.pause(); state.playing = false; paintTransport();
  }
}
function stepTo(d) {
  if (!state.list.length) return;
  var i = -1;
  for (var n = 0; n < state.list.length; n++) if (state.list[n].key === state.key) { i = n; break; }
  var nxt = state.list[(i + d + state.list.length) % state.list.length];
  playKey(nxt.key);
}
function next() { stepTo(1); }
function prev() { stepTo(-1); }
function shuffle() {
  var all = entriesFor('all', '');
  var pick = all[Math.floor(Math.random() * all.length)];
  playKey(pick.key);
}
function paintTransport() {
  deck.classList.toggle('playing', !!state.playing);
  var pb = byId('ampPlay'); if (pb) pb.textContent = state.playing ? '⏸' : '▶';
  if (launcher) launcher.classList.toggle('amp-pulse', !!state.playing);
}

/* ------------------------------ audio events ------------------------------ */
function fmt(t) {
  if (!isFinite(t)) return '--:--';
  t = Math.floor(t);
  return Math.floor(t / 60) + ':' + ('0' + (t % 60)).slice(-2);
}
audio.addEventListener('timeupdate', function () {
  if (isRadio(state.key) || !isFinite(audio.duration)) { byId('ampFill').style.width = '0%'; return; }
  byId('ampCur').textContent = fmt(audio.currentTime);
  byId('ampTot').textContent = fmt(audio.duration);
  byId('ampFill').style.width = (audio.duration ? (audio.currentTime / audio.duration * 100) : 0) + '%';
});
audio.addEventListener('loadedmetadata', function () {
  byId('ampTot').textContent = isRadio(state.key) ? 'LIVE' : fmt(audio.duration);
  byId('ampCur').textContent = '0:00';
});
audio.addEventListener('ended', function () {
  if (state.loop && !isRadio(state.key)) { try { audio.currentTime = 0; } catch (e) {} audio.play().catch(function () {}); }
  else next();
});
audio.addEventListener('playing', function () { state.playing = true; paintTransport(); setStatus('', ''); });
audio.addEventListener('pause', function () { /* pause event also fires on transient stalls */ });
function reconnectSoon() {
  clearTimeout(state.reconnectTimer);
  if (!state.playing) return;
  state.reconnectTimer = setTimeout(function () {
    if (!state.playing || !audio.src) return;
    var t = 0; try { t = audio.currentTime; } catch (e) {}
    setStatus('↻ reconnecting…', 'warn');
    var bust = audio.src.indexOf('?') < 0 ? '?t=' + Date.now() : audio.src.split('?')[0] + '?t=' + Date.now();
    audio.src = bust;
    audio.load();
    audio.play().then(function () {
      try { if (!isRadio(state.key) && t > 5) audio.currentTime = t; } catch (e) {}
      setStatus('', '');
    }).catch(function () { setStatus('⚠ reconnect failed — tap ▶', 'warn'); });
  }, 2500);
}
audio.addEventListener('stalled', reconnectSoon);
audio.addEventListener('error', function () { if (state.playing) reconnectSoon(); });

/* ------------------------------ deck open/close ------------------------------ */
function openDeck() {
  deck.classList.add('open');
  renderCats(); renderList();
  setNowPlaying();
  setTimeout(function () {
    var cur = byId('ampList').querySelector('.amp-row.current');
    if (cur && typeof cur.scrollIntoView === 'function') cur.scrollIntoView({ block: 'nearest' });
  }, 30);
}
function closeDeck() { deck.classList.remove('open'); }
function toggleDeck() { deck.classList.contains('open') ? closeDeck() : openDeck(); }
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && deck && deck.classList.contains('open')) closeDeck();
});

/* ------------------------------ boot ------------------------------ */
buildLauncher();
buildDeck();
setNowPlaying();
window.AMP_DECK = {
  open: openDeck, close: closeDeck, toggle: toggleDeck,
  play: playKey, next: next, prev: prev, shuffle: shuffle,
  state: function () { return { key: state.key, playing: state.playing, cat: state.cat, visible: state.list.length, loop: state.loop }; },
  counts: function () { return { tracks: Object.keys(NEURAL_TRACKS).length, radio: RADIO_CHANNELS.length, cats: MP_CATEGORIES.length }; },
  alive: function () { return !!(launcher && deck && byId('ampList')); }
};
})();
'''

out = data + engine.replace('/*DATA*/', '')
# splice data inside IIFE: data currently at top-level; move INSIDE the IIFE after GH_BASE line
out = engine.replace('/*DATA*/', data)
banner = '''/* ============================================================================
   ROUND 29 — NEURAL AMP DECK (part 2: brain + data)
   Music player ported from the donor page (72 GitHub-repo tracks + 6 live
   radio streams), redesigned to tracker design language. Zero base edits —
   launcher mounts onto the existing quick-dock, deck is injected markup.
   ============================================================================ */
'''
master = banner + out + '\n'
open('/home/user/_audit/ins27_js.js', 'w').write(master)
print('ins27_js.js bytes:', len(master))
assert '</scr' + 'ipt>' not in master
print('no wrapper breakers OK')
