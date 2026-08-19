/* ============================================================
   CONTENT VAULT AI (Step 3) — explain / tutor / derivation /
   formula sheet / worked examples / mistakes / practice /
   flashcards / revision + selection mode + saved library.
   Reads ONLY window.LOCAL_CONTENT_DATA (official vault notes)
   and the user's text selection. Writes ONLY to its own
   localStorage key — official notes & PYQ data are never
   modified and AI output is always labelled AI-GENERATED.
   ============================================================ */
(function(){
  const LIB_KEY = 'csirnet_ai_library_v1';
  const LIB_MAX = 60, LIB_MAX_BYTES = 500000;
  const CTX_CHARS = 14000;

  /* ---------- safe escaping + markdown (no DOM dependency) ---------- */
  function caiEsc(s){
    return String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  /* Protect LaTeX segments before escaping markdown punctuation. */
  function caiInline(value){
    const math = [];
    let s = String(value || '').replace(/(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|\$(?!\s)[^$\n]+\$)/g,
      m => { math.push(caiEsc(m)); return '@@CAIMATH' + (math.length - 1) + '@@'; });
    s = caiEsc(s);
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>');
    math.forEach((m, i) => { s = s.replace('@@CAIMATH' + i + '@@', () => m); });
    return s;
  }
  function caiMd(text){
    const lines = String(text || '').replace(/\r/g, '').split('\n');
    let out = '', inList = false, inCode = false, code = [], inTable = false;
    const closeList = () => { if(inList){ out += '</ul>'; inList = false; } };
    const closeCode = () => { if(inCode){ out += '<pre><code>' + caiEsc(code.join('\n')) + '</code></pre>'; code = []; inCode = false; } };
    const closeTable = () => { if(inTable){ out += '</table>'; inTable = false; } };
    lines.forEach(line => {
      const trimmed = line.trim();
      if(/^```/.test(trimmed)){ if(inCode){ closeCode(); } else { closeList(); closeTable(); inCode = true; code = []; } return; }
      if(inCode){ code.push(line); return; }
      if(/^\|.*\|\s*$/.test(trimmed)){
        const cells = trimmed.slice(1, -1).split('|').map(c => c.trim());
        if(/^\|?\s*:?-{2,}/.test(trimmed.replace(/\|/g,' '))){ return; } /* separator row */
        closeList();
        if(!inTable){ out += '<table>'; inTable = true; out += '<tr>' + cells.map(c => '<th>' + caiInline(c) + '</th>').join('') + '</tr>'; }
        else out += '<tr>' + cells.map(c => '<td>' + caiInline(c) + '</td>').join('') + '</tr>';
        return;
      }
      closeTable();
      if(/^#{1,4}\s+/.test(trimmed)){ closeList(); out += '<h4>' + caiInline(trimmed.replace(/^#{1,4}\s+/, '')) + '</h4>'; return; }
      if(/^\s*[-*+]\s+/.test(line)){ if(!inList){ out += '<ul>'; inList = true; } out += '<li>' + caiInline(line.replace(/^\s*[-*+]\s+/, '')) + '</li>'; return; }
      if(/^\s*\d+[.)]\s+/.test(line)){ if(!inList){ out += '<ul>'; inList = true; } out += '<li>' + caiInline(line.replace(/^\s*\d+[.)]\s+/, '')) + '</li>'; return; }
      if(/^\s*>\s?/.test(line)){ closeList(); out += '<blockquote>' + caiInline(line.replace(/^\s*>\s?/, '')) + '</blockquote>'; return; }
      closeList();
      if(!trimmed) return;
      out += '<p>' + caiInline(line) + '</p>';
    });
    closeList(); closeCode(); closeTable();
    return out;
  }
  function caiRenderMath(el){
    if(typeof renderMathInElement === 'function'){
      try{
        renderMathInElement(el, {delimiters:[
          {left:'$$', right:'$$', display:true},
          {left:'\\[', right:'\\]', display:true},
          {left:'\\(', right:'\\)', display:false},
          {left:'$', right:'$', display:false}
        ], throwOnError:false, strict:false});
      }catch(e){}
    }
  }

  /* ---------- saved library (own key, never in tracker backups) ---------- */
  function libLoad(){
    try{ const v = JSON.parse(localStorage.getItem(LIB_KEY) || '[]'); return Array.isArray(v) ? v : []; }
    catch(e){ return []; }
  }
  function libSave(list){
    list = list.slice(-LIB_MAX);
    let json = JSON.stringify(list);
    while(json.length > LIB_MAX_BYTES && list.length > 1){ list.shift(); json = JSON.stringify(list); }
    if(list.length === 1 && json.length > LIB_MAX_BYTES){
      list[0] = Object.assign({}, list[0], {text: String(list[0].text || '').slice(0, LIB_MAX_BYTES - 6000) + '\n[…truncated to fit the local AI library]'});
      json = JSON.stringify(list);
    }
    try{ localStorage.setItem(LIB_KEY, json); }catch(e){ try{ localStorage.setItem(LIB_KEY, JSON.stringify(list.slice(-10))); }catch(e2){} }
  }
  function libAdd(entry){
    const list = libLoad().filter(e => e.id !== entry.id);
    list.push(entry); libSave(list);
  }
  function libRemove(id){ libSave(libLoad().filter(e => e.id !== id)); }

  /* ---------- prompt modes ---------- */
  const CONTENT_AI_MODES = {
    explain:   {label:'EXPLAIN TOPIC',    prompt:f => 'Explain the physics topic "' + f + '" for a CSIR-NET/GATE aspirant. Structure: 1) Core idea in 2-3 lines, 2) Key equations with every symbol defined, 3) One short worked numeric example, 4) Two exam traps. Use clean Markdown with LaTeX ($...$, $$...$$).'},
    tutor:     {label:'CONCEPT TUTOR',    prompt:f => 'Act as a Socratic tutor for "' + f + '". Teach the concept in small numbered steps with intuition first, formalism second. End with exactly 3 check-understanding questions — do NOT answer them yet.'},
    derivation:{label:'DERIVATION',       prompt:f => 'Give a rigorous step-by-step derivation of the main result(s) around "' + f + '", at CSIR-NET/GATE level. State every assumption, keep units explicit, and put the final result in a $$...$$ block.'},
    formula:   {label:'FORMULA SHEET',    prompt:f => 'Create a compact formula sheet for "' + f + '" as a Markdown table with columns: | Quantity | Formula | Symbols & validity conditions |. Only exam-relevant formulas supported by the context.'},
    example:   {label:'WORKED EXAMPLES',  prompt:f => 'Create 2 fully worked CSIR-NET/GATE-style problems on "' + f + '" with complete step-by-step solutions. Mark each final answer clearly and add a "Pitfall" note about sign/unit errors.'},
    mistakes:  {label:'COMMON MISTAKES',  prompt:f => 'List the 6 most common student mistakes about "' + f + '" in CSIR-NET/GATE and how to avoid each. Be concrete: signs, limits, approximations, units, tricky cases.'},
    practice:  {label:'PRACTICE QUESTIONS', prompt:f => 'Create 5 ORIGINAL practice questions on "' + f + '": exactly 3 single-correct MCQs (options A-D) and 2 numerical-answer questions, ordered easy to hard. After all questions, add a section "Answer key" with one-line justifications. These are AI-generated practice questions — do not copy or imitate official PYQs, and start the response with the line "AI-generated practice set — not official PYQ content."'},
    flashcards:{label:'FLASHCARDS',       prompt:f => 'Create 8 flashcards for "' + f + '". Format each exactly as:\n**Q:** ...\n**A:** ...\nKeep answers under 2 lines. Cover definitions, formulas, and at least one tricky fact.'},
    revision:  {label:'REVISION SUMMARY', prompt:f => 'Write a rapid revision summary of "' + f + '": 8-12 must-remember bullet points with formulas, then a "60-second self-quiz" of 3 short prompts with answers at the very end.'},
    selection: {label:'EXPLAIN SELECTION',prompt:() => 'Explain this excerpt from my study notes for a CSIR-NET/GATE aspirant: clarify the idea, expand any algebra steps the notes skip, define every symbol, and finish with one exam tip.'},
    ask:       {label:'ASK AI',           prompt:(f, q) => q},
    check:     {label:'ANSWER CHECK',     prompt:(f, q) => 'Here are my answers / working for the practice set you generated:\n\n' + q + '\n\nCheck each answer against your own answer key. For every mistake show the correct reasoning briefly. End with a score estimate and the 2 weakest sub-topics I should revise.'}
  };

  /* ---------- DOM mount ---------- */
  let mounted = false, selText = '', running = 0;
  const $ = id => document.getElementById(id);
  function subjectFile(){ const s = $('contentSubject'); return s && s.value ? s.value : ''; }
  function subjectLabel(){
    const s = $('contentSubject');
    if(s && s.selectedOptions && s.selectedOptions[0]) return s.selectedOptions[0].textContent;
    return subjectFile().replace(/\.md$/i, '');
  }
  function noteText(){ const d = window.LOCAL_CONTENT_DATA || {}; return d[subjectFile()] || ''; }
  function truncInfo(len){
    if(len <= CTX_CHARS) return {text:null, label:'all ' + len.toLocaleString() + ' chars'};
    return {text:true, label:'≈' + CTX_CHARS.toLocaleString() + ' of ' + len.toLocaleString() + ' chars (start+end kept)'};
  }
  function selectionOnlyOn(){ const c = $('caiSelectionOnly'); return !!(c && c.checked); }
  function refreshScopeLabel(){
    const el = $('caiScopeLabel'); if(!el) return;
    const mode = '(choose a mode above)';
    if(selectionOnlyOn()){
      el.textContent = selText
        ? 'Will send: your selected text only (' + selText.length.toLocaleString() + ' chars) · official notes stay on this device ' + mode
        : 'Selection-only is ON — select some text inside the notes first (drag over it).';
      return;
    }
    const md = noteText();
    if(!md){ el.textContent = 'No subject note loaded — pick a subject in the vault.'; return; }
    const t = truncInfo(md.length);
    el.textContent = 'Will send: note "' + subjectLabel() + '" (' + t.label + ')' +
      (selText ? ' + your ' + selText.length.toLocaleString() + '-char selection as priority focus' : '') + ' · nothing else leaves the browser';
  }

  function mount(){
    if(mounted) return true;
    const vault = $('contentVault');
    const controls = vault && vault.querySelector('.content-vault-controls');
    const layout = vault && vault.querySelector('.content-vault-layout');
    if(!vault || !controls || !layout) return false;
    mounted = true;

    const bar = document.createElement('div');
    bar.className = 'content-ai-bar';
    bar.id = 'contentAiBar';
    bar.innerHTML =
      '<span class="content-ai-tag">AI STUDY ASSIST · OPTIONAL</span>' +
      ['explain','tutor','derivation','formula','example','mistakes','practice','flashcards','revision']
        .map(m => '<button type="button" class="cai-btn" data-mode="' + m + '" title="' + caiEsc(CONTENT_AI_MODES[m].label) + ' on the current subject">' + CONTENT_AI_MODES[m].label + '</button>').join('') +
      '<button type="button" class="cai-btn" data-mode="selection" id="caiSelectionBtn" disabled title="Select text inside the notes to enable">EXPLAIN SELECTION</button>' +
      '<button type="button" class="cai-btn primary" id="caiAskBtn" title="Ask your own question about this subject">ASK…</button>' +
      '<span id="caiAskRow" hidden>' +
      '<input id="caiAskInput" type="text" placeholder="Your question about this subject…" aria-label="Your question about this subject" style="border:1px solid var(--line,#ccd2dc);border-radius:7px;background:var(--bg-3,#f2f4f8);color:var(--ink-0,#111);padding:7px 9px;font:500 .64rem/1 \'DM Mono\',monospace;min-width:210px;">' +
      '<button type="button" class="cai-btn primary" id="caiAskSend">SEND</button></span>' +
      '<button type="button" class="cai-btn" id="caiSavedBtn" title="Locally saved AI responses">SAVED (0)</button>' +
      '<label class="cai-scope" title="Privacy: send only the text you selected, never the whole note"><input type="checkbox" id="caiSelectionOnly">SELECTION ONLY</label>' +
      '<span class="cai-status" id="caiScopeLabel" aria-live="polite"></span>';
    controls.insertAdjacentElement('afterend', bar);

    const panel = document.createElement('div');
    panel.className = 'content-ai-panel';
    panel.id = 'contentAiPanel';
    panel.innerHTML =
      '<div class="cai-saved-list" id="caiSavedList" aria-label="Saved AI responses"></div>' +
      '<div class="cai-empty" id="caiEmpty">AI answers appear here — clearly labelled, separate from the official notes above. Your API key (set in ✦ AI settings) is used only for requests you start.</div>';
    layout.insertAdjacentElement('afterend', panel);

    bar.addEventListener('click', e => {
      const btn = e.target.closest('button');
      if(!btn) return;
      if(btn.dataset.mode){ runMode(btn.dataset.mode, null, btn); }
      else if(btn.id === 'caiAskBtn'){
        const row = $('caiAskInput').closest('span');
        row.hidden = !row.hidden;
        if(!row.hidden) $('caiAskInput').focus();
      }
      else if(btn.id === 'caiAskSend'){ sendAsk(); }
      else if(btn.id === 'caiSavedBtn') toggleSavedList();
    });
    $('caiAskInput').addEventListener('keydown', e => {
      if(e.key === 'Enter'){ e.preventDefault(); sendAsk(); }
    });
    function sendAsk(){
      const inp = $('caiAskInput');
      const q = (inp.value || '').trim();
      if(!q) return;
      inp.value = '';
      runMode('ask', q, null, null);
    }
    $('caiSelectionOnly').addEventListener('change', refreshScopeLabel);
    $('contentSubject').addEventListener('change', refreshScopeLabel);
    if(!window.__caiSelListener){
      window.__caiSelListener = true;
      let t = null;
      document.addEventListener('selectionchange', () => {
        clearTimeout(t);
        t = setTimeout(() => {
          selText = '';
          const sel = window.getSelection && window.getSelection();
          const reader = $('contentReader');
          if(sel && reader && !sel.isCollapsed && sel.rangeCount){
            const r = sel.getRangeAt(0);
            if(reader.contains(r.commonAncestorContainer)) selText = String(sel.toString() || '').replace(/\s+/g, ' ').trim().slice(0, 8000);
          }
          const b = $('caiSelectionBtn');
          if(b){ b.disabled = !selText; b.title = selText ? 'Explain the selected ' + selText.length.toLocaleString() + ' characters' : 'Select text inside the notes to enable'; }
          refreshScopeLabel();
        }, 180);
      });
    }
    refreshScopeLabel();
    return true;
  }

  /* ---------- run a mode ---------- */
  function setBusy(on){
    running += on ? 1 : -1;
    document.querySelectorAll('#contentAiBar .cai-btn').forEach(b => { if(b.id !== 'caiSavedBtn') b.disabled = on ? true : (b.id === 'caiSelectionBtn' ? !selText : false); });
  }
  function buildContext(mode){
    const md = noteText();
    if(mode === 'selection' || selectionOnlyOn()){
      return {context: selText, note: 'selected text only', subject: subjectLabel()};
    }
    return {context: md, note: truncInfo(md.length).label, subject: subjectLabel()};
  }
  async function runMode(mode, question, btn, regenerate){
    if(running > 0 && !regenerate){ if(typeof showToast === 'function') showToast('An AI request is already running — cancel it or wait.'); return; }
    const M = CONTENT_AI_MODES[mode]; if(!M) return;
    const focusInput = question || '';
    let focus = focusInput;
    if(!focus){
      focus = (window.getSelection && selectionOnlyOn() && selText) ? 'the selected excerpt' : subjectLabel();
    }
    if(mode === 'selection' && !selText){ if(typeof showToast === 'function') showToast('Select some text inside the notes first.'); return; }
    if(mode !== 'selection' && selectionOnlyOn() && !selText){ if(typeof showToast === 'function') showToast('Selection-only is ON but no text is selected.'); return; }
    if(!subjectFile()){ if(typeof showToast === 'function') showToast('Pick a subject in the Content Vault first.'); return; }

    const ctx = buildContext(mode);
    const prompt = M.prompt(focus, question);
    setBusy(true);
    const controller = new AbortController();
    const card = regenerate || addCard({mode, label:M.label, question: question || focus, subject: ctx.subject});
    setCardPending(card, controller);
    try{
      const res = await callAi({
        prompt, context: ctx.context, signal: controller.signal,
        maxContextChars: CTX_CHARS,
        onStatus: s => { const p = card.querySelector('.cai-pending-msg'); if(p) p.textContent = s; }
      });
      card._history = [{role:'user', text:prompt + (ctx.context ? '\n\n[context: ' + ctx.note + ']' : '')}, {role:'assistant', text:res.text}];
      card._context = ctx.context;
      setCardAnswer(card, res.text, res, ctx);
      if(window.AiUsage) window.AiUsage.track(ctx.subject || 'general', mode);
    }catch(err){
      setCardError(card, err);
    }finally{
      setBusy(false);
    }
  }

  /* ---------- cards ---------- */
  function addCard(d){
    const panel = $('contentAiPanel');
    const empty = $('caiEmpty'); if(empty) empty.remove();
    const card = document.createElement('div');
    card.className = 'cai-card';
    card.dataset.mode = d.mode;
    card._meta = d;
    card._history = [];
    card.innerHTML =
      '<div class="cai-head"><span class="cai-mode">' + caiEsc(d.label) + '</span>' +
      '<span class="cai-badge">AI-GENERATED</span>' +
      '<span class="cai-meta"></span></div>' +
      '<div class="cai-actions">' +
      '<button type="button" class="cai-btn" data-act="copy">COPY</button>' +
      '<button type="button" class="cai-btn" data-act="regen">REGENERATE</button>' +
      '<button type="button" class="cai-btn" data-act="save">SAVE</button>' +
      '<button type="button" class="cai-btn" data-act="del">DELETE</button></div>' +
      '<div class="cai-body"></div>' +
      '<div class="cai-followup"><textarea placeholder="Follow-up on this answer… (Enter to send, Shift+Enter for newline)" aria-label="Follow-up question"></textarea>' +
      '<div class="cai-followup-row"><span class="cai-hint">Follow-ups remember this card\'s conversation · nothing is saved unless you press SAVE</span>' +
      (d.mode === 'practice' ? '<button type="button" class="cai-btn" data-act="check">CHECK MY ANSWERS</button>' : '') +
      '<button type="button" class="cai-btn primary" data-act="send">SEND</button></div></div>';
    card.querySelector('.cai-meta').textContent = d.subject + ' · ' + new Date().toLocaleString();
    panel.insertBefore(card, panel.children[1] || null);
    card.querySelector('.cai-actions').addEventListener('click', e => onCardAction(e, card));
    card.querySelector('[data-act="send"]').addEventListener('click', () => sendFollowup(card));
    const chk = card.querySelector('[data-act="check"]');
    if(chk) chk.addEventListener('click', () => checkAnswers(card));
    card.querySelector('.cai-followup textarea').addEventListener('keydown', e => {
      if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); sendFollowup(card); }
    });
    if(window.AiImage) window.AiImage.wire(card, card.querySelector('.cai-followup-row'));
    if(card.scrollIntoView){ try{ card.scrollIntoView({behavior:'smooth', block:'nearest'}); }catch(e){ card.scrollIntoView(); } }
    return card;
  }
  function setCardPending(card, controller){
    const body = card.querySelector('.cai-body');
    body.innerHTML = '<div class="cai-pending"><span class="cai-spinner" aria-hidden="true"></span><span class="cai-pending-msg">Contacting provider…</span><button type="button" class="cai-btn" data-act="cancel">CANCEL</button></div>';
    body.querySelector('[data-act="cancel"]').addEventListener('click', () => controller.abort());
  }
  function setCardAnswer(card, text, res, ctx, append){
    const body = card.querySelector('.cai-body');
    const html = '<div class="cai-answer">' + caiMd(text) + '</div>';
    if(append){ body.insertAdjacentHTML('beforeend', html); }
    else{
      body.innerHTML = html;
      if(ctx){
        body.insertAdjacentHTML('afterbegin',
          '<div class="cai-hint">Context sent: ' + caiEsc(ctx.subject) + ' · ' + caiEsc(ctx.note) + ' · model: ' + caiEsc(res && res.model ? res.model : '') + '</div>');
      }
    }
    body.querySelectorAll('.cai-answer').forEach(caiRenderMath);
    card._answerText = append ? (card._answerText || '') + '\n\n' + text : text;
    if(window.AiChapters) window.AiChapters.decorate(card);
  }
  function setCardError(card, err){
    const body = card.querySelector('.cai-body');
    const cancelled = err && err.name === 'AiAbortError' && err.kind === 'cancelled';
    body.innerHTML = '<div class="cai-error">' + (cancelled ? '⛔ ' : '⚠ ') + caiEsc(err && err.message ? err.message : String(err)) +
      (cancelled ? '' : '\nFix the issue in ✦ AI settings, then press REGENERATE.') + '</div>';
  }
  function onCardAction(e, card){
    const act = e.target.closest('button') && e.target.closest('button').dataset.act;
    if(!act) return;
    if(act === 'copy'){
      const txt = card.querySelector('.cai-body') ? card.querySelector('.cai-body').innerText : (card._answerText || '');
      const done = ok => { if(typeof showToast === 'function') showToast(ok ? 'AI response copied' : 'Copy failed — select the text manually'); };
      if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(() => done(true), () => done(false));
      else done(false);
    }
    else if(act === 'regen'){
      const d = card._meta;
      card._history = [];
      card.querySelectorAll('.cai-thread-q').forEach(n => n.remove());
      runMode(d.mode, d.mode === 'ask' ? d.question : null, null, card);
    }
    else if(act === 'save'){
      if(!card._answerText){ if(typeof showToast === 'function') showToast('Nothing to save yet — wait for an answer first.'); return; }
      const d = card._meta;
      const entry = {id: card._libId || ('cai' + Date.now() + Math.floor(Math.random() * 999)),
        mode: d.mode, label: d.label, subject: d.subject, question: d.question || '',
        text: card._answerText,
        createdAt: card._createdAt || Date.now(), updatedAt: Date.now()};
      card._libId = entry.id; card._createdAt = entry.createdAt;
      libAdd(entry);
      e.target.textContent = 'SAVED ✓';
      updateSavedCount();
      if(typeof showToast === 'function') showToast('Saved locally (never in backups, never uploaded)');
    }
    else if(act === 'del'){
      if(card._libId) libRemove(card._libId);
      card.remove();
      updateSavedCount();
      if(!$('contentAiPanel').querySelector('.cai-card')){
        $('contentAiPanel').insertAdjacentHTML('beforeend', '<div class="cai-empty" id="caiEmpty">AI answers appear here — clearly labelled, separate from the official notes above.</div>');
      }
    }
  }
  async function sendFollowup(card){
    const ta = card.querySelector('.cai-followup textarea');
    const q = (ta.value || '').trim();
    if(!q) return;
    ta.value = '';
    const img = window.AiImage ? window.AiImage.take(card) : '';
    const body = card.querySelector('.cai-body');
    body.insertAdjacentHTML('beforeend', '<div class="cai-thread-q">YOU: ' + caiEsc(q) + (img ? ' <span class="cai-hint">[image attached]</span>' : '') + '</div>');
    const controller = new AbortController();
    const pending = document.createElement('div');
    pending.className = 'cai-pending';
    pending.innerHTML = '<span class="cai-spinner" aria-hidden="true"></span><span class="cai-pending-msg">Thinking…</span><button type="button" class="cai-btn">CANCEL</button>';
    pending.querySelector('button').addEventListener('click', () => controller.abort());
    body.appendChild(pending);
    body.scrollTop = body.scrollHeight;
    try{
      const res = await callAi({prompt:q, context:card._context || '', image:img, history:card._history || [], signal:controller.signal, maxContextChars:CTX_CHARS,
        onStatus:s => { const p = pending.querySelector('.cai-pending-msg'); if(p) p.textContent = s; }});
      pending.remove();
      setCardAnswer(card, res.text, res, null, true);
      card._history = (card._history || []).concat([{role:'user', text:q}, {role:'assistant', text:res.text}]);
    }catch(err){
      pending.remove();
      const div = document.createElement('div'); div.className = 'cai-error';
      div.textContent = (err && err.message) ? err.message : String(err);
      body.appendChild(div);
    }
    body.scrollTop = body.scrollHeight;
  }
  async function checkAnswers(card){
    const ta = card.querySelector('.cai-followup textarea');
    const q = (ta.value || '').trim();
    if(!q){ if(typeof showToast === 'function') showToast('Type your answers into the follow-up box first, then press CHECK MY ANSWERS.'); ta.focus(); return; }
    ta.value = '';
    const chkImg = window.AiImage ? window.AiImage.take(card) : '';
    const body = card.querySelector('.cai-body');
    body.insertAdjacentHTML('beforeend', '<div class="cai-thread-q">MY ANSWERS: ' + caiEsc(q.slice(0, 400)) + (q.length > 400 ? '…' : '') + (chkImg ? ' <span class="cai-hint">[work photo attached]</span>' : '') + '</div>');
    const controller = new AbortController();
    const pending = document.createElement('div');
    pending.className = 'cai-pending';
    pending.innerHTML = '<span class="cai-spinner" aria-hidden="true"></span><span class="cai-pending-msg">Checking…</span><button type="button" class="cai-btn">CANCEL</button>';
    pending.querySelector('button').addEventListener('click', () => controller.abort());
    body.appendChild(pending);
    try{
      const res = await callAi({prompt: CONTENT_AI_MODES.check.prompt('', q) + (chkImg ? '\n\n(My handwritten working is attached as an image — read it carefully and mark step-by-step.)' : ''), context:card._context || '', image:chkImg, history: card._history || [], signal:controller.signal, maxContextChars:CTX_CHARS});
      pending.remove();
      setCardAnswer(card, res.text, res, null, true);
      card._history = (card._history || []).concat([{role:'user', text:'[answer check] ' + q}, {role:'assistant', text:res.text}]);
    }catch(err){
      pending.remove();
      const div = document.createElement('div'); div.className = 'cai-error';
      div.textContent = (err && err.message) ? err.message : String(err);
      body.appendChild(div);
    }
  }

  /* ---------- saved list ---------- */
  function updateSavedCount(){
    const b = $('caiSavedBtn'); if(b) b.textContent = 'SAVED (' + libLoad().length + ')';
  }
  function toggleSavedList(){
    const list = $('caiSavedList'); if(!list) return;
    if(list.classList.contains('open')){ list.classList.remove('open'); return; }
    const items = libLoad().slice().reverse();
    list.innerHTML = '<div class="cai-hint" style="margin-bottom:6px;">Saved locally in this browser only — ' + items.length + ' of max ' + LIB_MAX + ' oldest-first. These never enter tracker backups or official notes.</div>' +
      (items.length ? '' : '<div class="cai-hint">Nothing saved yet — press SAVE on any AI card.</div>') +
      items.map(e => '<div class="cai-saved-item" data-id="' + caiEsc(e.id) + '"><span class="cai-saved-title">' + caiEsc(e.label) + ' — ' + caiEsc((e.question || '').slice(0, 60)) + '</span><span class="cai-saved-sub">' + caiEsc(e.subject || '') + ' · ' + new Date(e.updatedAt).toLocaleDateString() + '</span><button type="button" class="cai-btn" data-load="' + caiEsc(e.id) + '">OPEN</button><button type="button" class="cai-btn" data-forget="' + caiEsc(e.id) + '">DELETE</button></div>').join('');
    list.classList.add('open');
    list.querySelectorAll('[data-load]').forEach(b => b.addEventListener('click', () => {
      const e2 = libLoad().find(x => x.id === b.dataset.load); if(!e2) return;
      const card = addCard({mode:e2.mode, label:e2.label, question:e2.question, subject:e2.subject});
      card._libId = e2.id; card._createdAt = e2.createdAt;
      setCardAnswer(card, e2.text, {model:'(saved)'}, null, false);
      const saveBtn = card.querySelector('[data-act="save"]'); if(saveBtn) saveBtn.textContent = 'SAVED ✓';
      list.classList.remove('open');
    }));
    list.querySelectorAll('[data-forget]').forEach(b => b.addEventListener('click', () => {
      libRemove(b.dataset.forget);
      toggleSavedList(); toggleSavedList();
      updateSavedCount();
    }));
  }

  /* ---------- programmatic API (old-tracker compatible) ---------- */
  window.openContentAi = function(){
    if(!mounted && !mount()){ if(typeof showToast === 'function') showToast('Open the Content Vault panel first.'); return; }
    const bar = $('contentAiBar');
    if(bar){ bar.scrollIntoView({behavior:'smooth', block:'center'}); bar.focus && bar.focus(); }
  };
  window.askContentAi = function(question, mode){
    if(!mounted && !mount()){ if(typeof showToast === 'function') showToast('Open the Content Vault panel first.'); return; }
    runMode(mode || 'ask', String(question || ''), null, null);
  };
  window.ContentAi = {run:runMode, modes:CONTENT_AI_MODES, lib:{load:libLoad, remove:libRemove, add:libAdd}, md:caiMd};

  /* ---------- init (vault is built by earlier scripts; retry briefly if not ready) ---------- */
  let tries = 0;
  const boot = () => {
    if(mount()){ updateSavedCount(); return; }
    if(++tries < 20) setTimeout(boot, 250);
  };
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
