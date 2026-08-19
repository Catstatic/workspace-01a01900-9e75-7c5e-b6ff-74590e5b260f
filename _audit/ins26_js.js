/* ============================================================================
   ROUND 28 — GLOBAL SHORTCUT DECK (TAB JUMPER + AI SETTINGS + READING TOOL)
   User-requested hotkeys, implemented in the house pattern: every shortcut
   acts by clicking the real, pre-existing button, so base handlers stay the
   single source of truth. No network, no dependencies, zero base-code edits.
     Ctrl+1 .. Ctrl+9   -> sections 1..9  (Dashboard .. Doctrine)
     Ctrl+0             -> section 10     (Data)
     Ctrl+Shift+1 .. 7  -> sections 11..17 (History .. Topic Drills)
     Ctrl+A             -> AI Settings toggle (the aiSettingsBtn button)
     Ctrl+R             -> Content section (Resources tab) + toggle FOCUSFRAME
                           teal goal-bracket reading lines (the fgToggleBtn)
   Typing guard: shortcuts stand down while focus is inside INPUT / TEXTAREA /
   SELECT / contentEditable, so search boxes and notes keep native behaviour
   (native select-all etc. are never stolen inside a field).
   ============================================================================ */
(function () {
  'use strict';
  if (typeof document === 'undefined' || !document.addEventListener) return;

  function tabButtons() {
    /* primary nav row; DOM order = section order */
    var bar = document.getElementById('tabbarInner');
    if (!bar) return [];
    return Array.prototype.slice.call(bar.querySelectorAll('[data-tab]'));
  }

  function goSection(n /* 1-based */) {
    var btns = tabButtons();
    var b = btns[n - 1];
    if (b) b.click();
  }

  function toggleAISettings() {
    var b = document.getElementById('aiSettingsBtn');
    if (b) b.click();
  }

  function callReadingTool() {
    /* 1. land on the section that hosts the Content Vault reader */
    var resBtn = document.querySelector('[data-tab="resources"]');
    if (resBtn) resBtn.click();
    /* 2. the teal bracket toggle is created lazily with the reader —
          poll briefly, then click the real button */
    var tries = 0;
    (function hunt() {
      var fg = document.getElementById('fgToggleBtn');
      if (fg) {
        fg.click();
        var vault = document.getElementById('contentVault');
        if (vault && vault.scrollIntoView) {
          vault.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return;
      }
      if (++tries < 20) setTimeout(hunt, 120);
    })();
  }

  function isTypingTarget(t) {
    if (!t) return false;
    var tag = t.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || !!t.isContentEditable;
  }

  document.addEventListener('keydown', function (e) {
    if (e.repeat) return;
    if (!(e.ctrlKey || e.metaKey)) return;          /* Cmd-covered for macOS */
    if (e.altKey) return;                           /* keep Alt combos free   */
    if (isTypingTarget(e.target)) return;           /* never fight a text field */

    var code = e.code || '';
    var k = (e.key || '').toLowerCase();

    /* --- Ctrl+A : AI settings ------------------------------------------- */
    if (!e.shiftKey && (code === 'KeyA' || k === 'a')) {
      e.preventDefault();
      toggleAISettings();
      return;
    }
    /* --- Ctrl+R : teal reading-bracket tool in the content section ------ */
    if (!e.shiftKey && (code === 'KeyR' || k === 'r')) {
      e.preventDefault();                           /* beats browser reload   */
      callReadingTool();
      return;
    }
    /* --- Ctrl(+Shift)+digit : section jumper ---------------------------- */
    var m = code.match(/^Digit([0-9])$/);
    if (!m) m = k.match(/^([0-9])$/);
    if (!m) return;
    var d = +m[1];
    if (e.shiftKey) {
      if (d >= 1 && d <= 7) { e.preventDefault(); goSection(10 + d); } /* 11..17 */
      return;
    }
    e.preventDefault();
    goSection(d === 0 ? 10 : d);                                     /* 1..9, 0->10 */
  }, true);

  /* ------------------------------ tooltip advertising ------------------- */
  function advertise() {
    var btns = tabButtons();
    var hint = function (n) {
      if (n <= 9) return 'Ctrl+' + n;
      if (n === 10) return 'Ctrl+0';
      return 'Ctrl+Shift+' + (n - 10);
    };
    btns.forEach(function (b, i) {
      var h = hint(i + 1);
      if (b.title.indexOf(h) < 0) b.title = (b.title ? b.title + ' · ' : '') + h;
    });
    var ai = document.getElementById('aiSettingsBtn');
    if (ai && ai.title.indexOf('Ctrl+A') < 0) ai.title = (ai.title ? ai.title + ' · ' : '') + 'Ctrl+A';
  }
  function advertiseFg() {
    var fg = document.getElementById('fgToggleBtn');
    if (fg && fg.title.indexOf('Ctrl+R') < 0) fg.title += ' · Ctrl+R';
  }
  try { advertise(); } catch (e) {}
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { advertise(); advertiseFg(); });
  }
  setTimeout(advertiseFg, 1500);
  setTimeout(advertiseFg, 4000);

  window.__hotkeyDeck = { goSection: goSection, aiSettings: toggleAISettings, readingTool: callReadingTool };
})();
