/* smoke34 (jsdom) — ROUND 28 GLOBAL SHORTCUT DECK: Ctrl+1..9/0 tab jumper,
   Ctrl+Shift+1..7 (sections 11-17), Ctrl+A AI settings, Ctrl+R teal-bracket
   reading tool. Asserts: real buttons get clicked (source of truth), typing
   guard, Alt guard, preventDefault (reload/select-all beaten), lazy-FG poll,
   tooltip advertising, deck export. */
const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');

let passed = 0, failed = 0;
const ok = (c, n) => { if (c) { passed++; } else { failed++; console.log('  ✘ FAIL: ' + n); } };

const master = fs.readFileSync('/home/user/_audit/ins26_js.js', 'utf8');

const TABS = ['dashboard','resources','roadmap','weekly','method','mocks','pyq','calculator','preexam','rules','data','history','focus','intel','gateonly','priority','topicforge'];
const bar = TABS.map(t => '<button class="tab-btn" data-tab="' + t + '" title="">' + t + '</button>').join('');
const html = '<!DOCTYPE html><html><body>' +
  '<div id="tabbarInner">' + bar + '</div>' +
  '<button id="aiSettingsBtn" title="AI settings"></button>' +
  '<div id="aiSettingsShell"></div>' +
  '<input id="box" type="text">' +
  '</body></html>';

const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => errors.push(String(e)));
const dom = new JSDOM(html, { url: 'https://tracker.test/', runScripts: 'dangerously', virtualConsole: vc, pretendToBeVisual: true });
const w = dom.window, doc = w.document;

/* emulate base handlers: clicking a tab marks it active; ai button toggles shell */
const clicks = {};
doc.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => {
  clicks[b.dataset.tab] = (clicks[b.dataset.tab] || 0) + 1;
  doc.querySelectorAll('[data-tab]').forEach(x => x.classList.remove('active'));
  b.classList.add('active');
}));
doc.getElementById('aiSettingsBtn').addEventListener('click', () => doc.getElementById('aiSettingsShell').classList.toggle('active'));
/* resources tab click makes the FG bracket button appear lazily (like the real reader build) */
doc.querySelector('[data-tab="resources"]').addEventListener('click', () => {
  setTimeout(() => {
    if (doc.getElementById('fgToggleBtn')) return;
    const fg = doc.createElement('button');
    fg.id = 'fgToggleBtn'; fg.title = 'Focus goal brackets'; fg.setAttribute('aria-pressed', 'false');
    fg.addEventListener('click', () => fg.setAttribute('aria-pressed', fg.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'));
    doc.body.appendChild(fg);
  }, 80);
});

w.eval(master);

const key = (opts, target) => {
  const ev = new w.KeyboardEvent('keydown', Object.assign({ bubbles: true, cancelable: true }, opts));
  (target || doc.body).dispatchEvent(ev);
  return ev;
};
const active = () => { const a = doc.querySelector('[data-tab].active'); return a ? a.dataset.tab : null; };

setTimeout(() => {
  ok(typeof w.__hotkeyDeck === 'object' && typeof w.__hotkeyDeck.goSection === 'function', 'deck exported on window');

  key({ ctrlKey: true, code: 'Digit1', key: '1' });
  ok(active() === 'dashboard', 'Ctrl+1 -> section 1 (Dashboard)');
  key({ ctrlKey: true, code: 'Digit2', key: '2' });
  ok(active() === 'resources', 'Ctrl+2 -> section 2 (Resources/Content)');
  key({ ctrlKey: true, code: 'Digit9', key: '9' });
  ok(active() === 'preexam', 'Ctrl+9 -> section 9 (Final 30 Days)');
  key({ ctrlKey: true, code: 'Digit0', key: '0' });
  ok(active() === 'rules', 'Ctrl+0 -> section 10 (Doctrine)');
  key({ ctrlKey: true, code: 'Digit1', key: '1', shiftKey: true });
  ok(active() === 'data', 'Ctrl+Shift+1 -> section 11 (Data)');
  key({ ctrlKey: true, code: 'Digit7', key: '7', shiftKey: true });
  ok(active() === 'topicforge', 'Ctrl+Shift+7 -> section 17 (Topic Drills) - LAST section');
  key({ ctrlKey: true, code: 'Digit8', key: '8', shiftKey: true });
  ok(active() === 'topicforge', 'Ctrl+Shift+8 is a no-op (out of range, no crash)');

  /* guards */
  doc.querySelectorAll('[data-tab]').forEach(x => x.classList.remove('active'));
  const before = JSON.stringify(clicks);
  key({ ctrlKey: true, code: 'Digit3', key: '3' }, doc.getElementById('box'));
  ok(JSON.stringify(clicks) === before && active() === null, 'typing guard: Ctrl+3 inside INPUT steals nothing');
  key({ ctrlKey: true, altKey: true, code: 'Digit2', key: '2' });
  ok(JSON.stringify(clicks) === before, 'Alt guard: Ctrl+Alt+2 steals nothing');

  /* Ctrl+A AI settings */
  let ev = key({ ctrlKey: true, code: 'KeyA', key: 'a' });
  ok(ev.defaultPrevented, 'Ctrl+A preventDefault (select-all beaten, global scope)');
  ok(doc.getElementById('aiSettingsShell').classList.contains('active'), 'Ctrl+A -> AI Settings OPENED');
  key({ ctrlKey: true, code: 'KeyA', key: 'a' });
  ok(!doc.getElementById('aiSettingsShell').classList.contains('active'), 'Ctrl+A again -> AI Settings closed (toggle)');
  const boxEv = key({ ctrlKey: true, code: 'KeyA', key: 'a' }, doc.getElementById('box'));
  ok(!boxEv.defaultPrevented, 'Ctrl+A inside INPUT passes through (native select-all intact)');
  ok(!doc.getElementById('aiSettingsShell').classList.contains('active'), 'Ctrl+A inside INPUT does not touch settings');

  /* Ctrl+R reading tool */
  ev = key({ ctrlKey: true, code: 'KeyR', key: 'r' });
  ok(ev.defaultPrevented, 'Ctrl+R preventDefault (browser reload beaten)');
  ok(active() === 'resources', 'Ctrl+R lands on the Resources/Content section');
  setTimeout(() => {
    const fg = doc.getElementById('fgToggleBtn');
    ok(!!fg, 'fg toggle button appeared');
    ok(fg && fg.getAttribute('aria-pressed') === 'true', 'Ctrl+R toggled the teal goal brackets ON');
    key({ ctrlKey: true, code: 'KeyR', key: 'r' });
    setTimeout(() => {
      ok(doc.getElementById('fgToggleBtn').getAttribute('aria-pressed') === 'false', 'Ctrl+R again toggles brackets OFF');

      /* tooltip advertising */
      const tb = doc.querySelector('[data-tab="dashboard"]');
      ok((tb.title || '').indexOf('Ctrl+1') >= 0, 'tab tooltip advertises Ctrl+1');
      ok((doc.getElementById('aiSettingsBtn').title || '').indexOf('Ctrl+A') >= 0, 'AI button tooltip advertises Ctrl+A');

      ok(errors.length === 0, 'no jsdom page errors');
      console.log('smoke34: ' + passed + ' passed, ' + failed + ' failed');
      process.exit(failed ? 1 : 0);
    }, 500);
  }, 700);
}, 120);
