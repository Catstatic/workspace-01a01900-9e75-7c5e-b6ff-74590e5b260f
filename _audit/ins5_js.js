/* ============================================================
   VIDEO AI & STUDY ASSISTANT (Step 5 + direct transcript fetch)
   The AI never "watches" a video. Transcripts come from:
     1) FETCH — public YouTube caption tracks fetched by the
        browser via public caption APIs (Invidious/Piped
        instances, then a generic CORS proxy for timedtext).
        Only the PUBLIC video URL is sent to those services —
        never tracker data. Result is shown for review first.
     2) PASTE — the user's own transcript/notes (always works).
   Transcript text reaches the AI provider only when the user
   picks a mode. Playback stays external; nothing auto-uploads.
   ============================================================ */
(function(){
  const V_CTX = 24000;
  const FETCH_TIMEOUT_MS = 10000;

  /* ---- public caption helper services (no secrets; fail-over chain) ---- */
  const TRANSCRIPT_HELPERS = {
    invidious: ['https://inv.nadeko.net', 'https://yewtu.be', 'https://invidious.f5.si'],
    piped:     ['https://pipedapi.kavin.rocks', 'https://pipedapi.adminforge.de', 'https://api.piped.private.coffee'],
    corsProxy: 'https://api.allorigins.win/raw?url='
  };

  function esc(s){ return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
  function md(s){ return window.ContentAi ? window.ContentAi.md(s) : '<p>' + esc(s) + '</p>'; }
  function math(el){ if(typeof renderMathInElement === 'function'){ try{ renderMathInElement(el, {delimiters:[{left:'$$',right:'$$',display:true},{left:'\\[',right:'\\]',display:true},{left:'\\(',right:'\\)',display:false},{left:'$',right:'$',display:false}], throwOnError:false}); }catch(e){} } }
  function toast(m){ if(typeof showToast === 'function') showToast(m); }
  function currentSubjectLabel(){
    const s = document.getElementById('contentSubject');
    if(s && s.selectedOptions && s.selectedOptions[0]) return s.selectedOptions[0].textContent;
    return 'Study session';
  }

  /* ---------- YouTube id + transcript text parsing ---------- */
  function ytVideoId(url){
    const t = String(url || '').trim();
    const m = t.match(/(?:youtube\.com\/(?:watch\?[^#]*v=|live\/|shorts\/|embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    if(m) return m[1];
    if(/^[A-Za-z0-9_-]{11}$/.test(t)) return t;
    return null;
  }
  function decodeEntities(s){
    return String(s || '')
      .replace(/&#(\d+);/g, (m, n) => String.fromCharCode(Number(n)))
      .replace(/&#x([0-9a-f]+);/gi, (m, n) => String.fromCharCode(parseInt(n, 16)))
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ');
  }
  function cleanSpaced(s){ return s.replace(/\[.*?\]/g, ' ').replace(/\s+/g, ' ').trim(); }
  function parseTimedXml(xml){
    const out = [];
    const re = /<text\b[^>]*>([\s\S]*?)<\/text>/g;
    let m;
    while((m = re.exec(xml))) out.push(decodeEntities(m[1]));
    return cleanSpaced(out.join(' '));
  }
  function parseVtt(vtt){
    const lines = String(vtt || '').split('\n');
    const cues = [];
    lines.forEach(line => {
      const t = line.trim();
      if(!t || t === 'WEBVTT' || /^Kind:|^Language:|^NOTE/.test(t)) return;
      if(t.includes('-->')) return;                      /* cue timings */
      const clean = t.replace(/<[^>]+>/g, '');
      if(!clean.trim()) return;
      if(cues[cues.length - 1] !== clean) cues.push(clean);  /* rolling-caption dedupe */
    });
    return cleanSpaced(cues.join(' '));
  }
  function parseJson3(json){
    try{
      const data = typeof json === 'string' ? JSON.parse(json) : json;
      const ev = data && data.events;
      if(!Array.isArray(ev)) return '';
      return cleanSpaced(ev.map(e => (e.segs || []).map(s => s.utf8 || '').join('')).join(' ').replace(/\n/g, ' '));
    }catch(e){ return ''; }
  }
  function sniffParse(body){
    const t = String(body || '').trim();
    if(!t) return '';
    if(/^WEBVTT/.test(t)) return parseVtt(t);
    if(/^\{/.test(t)){ const j = parseJson3(t); if(j) return j; }
    if(/^<|^\?\?/.test(t) || /<transcript>|\/text>/.test(t)) return parseTimedXml(t);
    return '';
  }

  /* ---------- transcript fetching (failover chain) ---------- */
  function abortableFetch(url, ms, signal, opts){
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort('timeout'), ms || FETCH_TIMEOUT_MS);
    const onExt = () => controller.abort('cancelled');
    if(signal){ if(signal.aborted){ controller.abort('cancelled'); } else signal.addEventListener('abort', onExt); }
    return fetch(url, Object.assign({}, opts || {}, {signal: controller.signal}))
      .finally(() => { clearTimeout(timer); if(signal) signal.removeEventListener('abort', onExt); });
  }
  function pickCaptionTrack(captions){
    if(!Array.isArray(captions) || !captions.length) return null;
    const en = captions.filter(c => /en/i.test(c.languageCode || c.code || ''));
    return (en.find(c => !c.autoGenerated && !/asr/i.test(c.kind || '')) ) || en[0] || captions[0];
  }
  async function viaInvidious(id, onStatus, signal){
    for(const inst of TRANSCRIPT_HELPERS.invidious){
      onStatus('Trying Invidious (' + inst.replace(/^https:\/\//, '') + ')…');
      const r = await abortableFetch(inst + '/api/v1/captions/' + id, FETCH_TIMEOUT_MS, signal);
      if(!r.ok) continue;
      const data = await r.json().catch(() => null);
      const track = data && pickCaptionTrack(data.captions);
      if(!track) throw new Error('This video exposes no caption tracks.');
      const label = track.label || track.name || '';
      const r2 = await abortableFetch(inst + '/api/v1/captions/' + id + '?label=' + encodeURIComponent(label), FETCH_TIMEOUT_MS, signal);
      if(!r2.ok) continue;
      const text = sniffParse(await r2.text());
      if(text.length > 200) return {text, via: 'Invidious · ' + inst.replace(/^https:\/\//, '') + ' · track "' + label + '"'};
    }
    return null;
  }
  async function viaPiped(id, onStatus, signal){
    for(const inst of TRANSCRIPT_HELPERS.piped){
      onStatus('Trying Piped (' + inst.replace(/^https:\/\//, '') + ')…');
      const r = await abortableFetch(inst + '/streams/' + id, FETCH_TIMEOUT_MS, signal);
      if(!r.ok) continue;
      const data = await r.json().catch(() => null);
      const track = data && pickCaptionTrack(data.subtitles);
      if(!track || !track.url) continue;
      const r2 = await abortableFetch(track.url, FETCH_TIMEOUT_MS, signal);
      if(!r2.ok) continue;
      const text = sniffParse(await r2.text());
      if(text.length > 200) return {text, via: 'Piped · ' + inst.replace(/^https:\/\//, '')};
    }
    return null;
  }
  async function viaTimedtext(id, onStatus, signal){
    const base = 'https://video.google.com/timedtext?lang=en&v=' + id;
    for(const extra of ['', '&kind=asr']){
      onStatus('Trying YouTube timedtext via public proxy…');
      const r = await abortableFetch(TRANSCRIPT_HELPERS.corsProxy + encodeURIComponent(base + extra), FETCH_TIMEOUT_MS, signal);
      if(!r.ok) continue;
      const text = parseTimedXml(await r.text());
      if(text.length > 200) return {text, via: 'YouTube timedtext (proxied)' + (extra ? ' · auto-captions' : '')};
    }
    return null;
  }
  async function fetchTranscriptText(urlOrId, onStatus, signal){
    const id = ytVideoId(urlOrId);
    if(!id) throw new Error('That does not look like a YouTube link — paste a watch/share URL or just paste the transcript text below.');
    const attempts = [viaInvidious, viaPiped, viaTimedtext];
    let noCaptions = false;
    for(const attempt of attempts){
      if(signal && signal.aborted) throw new Error('cancelled');
      try{
        const got = await attempt(id, onStatus || (() => {}), signal);
        if(got && got.text && got.text.length > 200) return got;
      }catch(e){
        if(/no caption tracks/.test(e.message)) noCaptions = true;
        if(/cancelled/.test(e.message)) throw e;
        /* otherwise: keep falling through the chain */
      }
    }
    if(noCaptions) throw new Error('This video exposes no usable caption tracks to public services (captions may be disabled or the video is restricted). Paste the transcript manually instead — paste always works.');
    throw new Error('All public caption services failed just now (they rate-limit often). Wait a minute and retry, or paste the transcript manually — paste always works.');
  }

  /* ---------- generation modes ---------- */
  const VIDEO_MODES = {
    summary:   {label:'TOPIC SUMMARY',   prompt:t => 'Using ONLY the pasted source text, write a tight topic summary of this lecture: 8-14 bullets with the key definitions and results, each one line where possible. Mark anything the source only mentions briefly with "(brief in source)".'},
    formula:   {label:'FORMULA SHEET',   prompt:t => 'Build a formula sheet strictly from the pasted source: Markdown table | Quantity | Formula | Where used / conditions |. Include only formulas that actually appear or are directly derived in the source.'},
    flashcards:{label:'FLASHCARDS',      prompt:t => 'Create 10 flashcards from the pasted source. Format each exactly as:\n**Q:** ...\n**A:** ...\nAnswers under 2 lines; cover definitions, formulas, and traps mentioned in the source.'},
    checklist: {label:'REVISION CHECKLIST', prompt:t => 'Turn the pasted source into a revision checklist: grouped checkbox items ("[ ]") from foundations to advanced, plus a final "before the exam" 5-item rapid list.'},
    examples:  {label:'SOLVED EXAMPLES', prompt:t => 'Extract every solved example / worked calculation from the pasted source and present each cleanly: problem → full solution → answer. If the source has few, add at most 2 clearly-marked "AI-supplied" examples using only concepts the source covers.'},
    mistakes:  {label:'COMMON MISTAKES', prompt:t => 'From the pasted source, extract the mistakes/misconceptions the lecturer warns about, then add likely student mistakes on those same topics (mark these "likely mistake" honestly). Concrete: signs, units, limits.'},
    notes:     {label:'FULL NOTES (2 PARTS)', prompt:null, multi:true}
  };
  const NOTES_PARTS = [
    'You are creating university-textbook-level CSIR-NET Physical Sciences notes. The ONLY source is the pasted transcript/notes text below — the AI has NOT watched any video and must not pretend to. Write Part 1 of 2: from the foundations through the core theory, with clear section headings (#, ##), careful derivations, and any worked examples the source contains. Use Markdown with LaTeX ($...$, $$...$$). If the source is missing a connecting step, write "[gap in source]" rather than inventing content.',
    'Continue the SAME notes using the SAME source. Write Part 2 of 2 ONLY: advanced consequences, applications, remaining solved examples, common mistakes/pitfalls, a compact formula table, and a revision checklist. Do not repeat Part 1 content; continue seamlessly with new headings.'
  ];

  /* ---------- panel ---------- */
  let vaiRunning = 0;
  function openVideoAi(anchorEl, meta){
    const old = document.getElementById('videoAiPanel');
    if(old) old.remove();
    const panel = document.createElement('div');
    panel.className = 'vai-panel cai-card';
    panel.id = 'videoAiPanel';
    panel.innerHTML =
      '<div class="vai-head"><span class="vai-title">✦ VIDEO AI · ' + esc((meta.label || 'VIDEO').toUpperCase()) + '</span>' +
      '<span class="cai-badge">AI-GENERATED</span>' +
      '<button type="button" class="vai-close" id="vaiClose">CLOSE</button></div>' +
      '<div class="vai-src">' + (meta.url ? 'Video link (opens externally; never sent to the AI): ' + esc(meta.url) : 'Paste any YouTube link below — or any transcript/notes text.') + '</div>' +
      '<div class="vai-honesty"><b>How sources work here:</b> the AI can\'t watch video. FETCH pulls the video\'s <b>public captions</b> through public caption services — only the public link is sent to them, and the text lands below for your review first. Pasting a transcript manually always works if fetch fails. Whatever is in this box is the only thing the AI will use; anything the source doesn\'t cover is marked as a gap.</div>' +
      '<div class="vai-body">' +
      '<div class="vai-fetch-row">' +
      '<input id="vaiUrl" type="url" placeholder="https://www.youtube.com/watch?v=…" spellcheck="false" value="' + esc(meta.url || '') + '" aria-label="YouTube link">' +
      '<button type="button" class="cai-btn primary" id="vaiFetchBtn">⬇ FETCH TRANSCRIPT</button>' +
      '<button type="button" class="cai-btn" id="vaiFetchCancel" hidden>CANCEL</button>' +
      '</div>' +
      '<textarea id="vaiTranscript" placeholder="Fetched transcript appears here — or paste it manually…" aria-label="Transcript or raw notes"></textarea>' +
      '<div class="vai-meta-row"><span class="vai-count" id="vaiCount">0 chars</span>' +
      '<span class="cai-hint">long transcripts are trimmed to ' + (V_CTX / 1000).toFixed(0) + 'k chars keeping start+end · nothing uploads until you pick a mode</span></div>' +
      '<div class="vai-modes">' +
      Object.keys(VIDEO_MODES).map(k => '<button type="button" class="cai-btn" data-vmode="' + k + '">' + VIDEO_MODES[k].label + '</button>').join('') +
      '</div>' +
      '<div class="vai-status" id="vaiStatus" aria-live="polite"></div></div>' +
      '<div class="vai-out" id="vaiOut"></div>';
    anchorEl.insertAdjacentElement('afterend', panel);
    panel._meta = meta;
    panel._sourceNote = 'pasted transcript/notes';
    const ta = panel.querySelector('#vaiTranscript');
    const count = panel.querySelector('#vaiCount');
    ta.addEventListener('input', () => {
      count.textContent = ta.value.length.toLocaleString() + ' chars';
      panel._sourceNote = 'pasted/edited transcript';
    });
    panel.querySelector('#vaiClose').addEventListener('click', () => panel.remove());
    panel.querySelector('.vai-modes').addEventListener('click', e => {
      const b = e.target.closest('button[data-vmode]');
      if(b) runVideoMode(panel, b.dataset.vmode, null);
    });
    const fetchBtn = panel.querySelector('#vaiFetchBtn');
    const fetchCancel = panel.querySelector('#vaiFetchCancel');
    let fetchController = null;
    fetchBtn.addEventListener('click', async () => {
      const url = panel.querySelector('#vaiUrl').value.trim();
      const status = m => setVaiStatus(panel, m);
      if(fetchController){ fetchController.abort('cancelled'); return; }
      fetchController = new AbortController();
      fetchBtn.disabled = true;
      fetchCancel.hidden = false;
      try{
        const got = await fetchTranscriptText(url, status, fetchController.signal);
        ta.value = got.text;
        panel._sourceNote = 'auto-fetched transcript (' + got.via + ')';
        count.textContent = got.text.length.toLocaleString() + ' chars';
        status('Fetched ' + got.text.length.toLocaleString() + ' chars via ' + got.via + ' — review it above, then pick a mode below.');
      }catch(err){
        status((err && err.message === 'cancelled') ? 'Fetch cancelled.' : '⚠ ' + (err && err.message ? err.message : String(err)));
      }finally{
        fetchController = null;
        fetchBtn.disabled = false;
        fetchCancel.hidden = true;
      }
    });
    fetchCancel.addEventListener('click', () => { if(fetchController) fetchController.abort('cancelled'); });
    panel.scrollIntoView && panel.scrollIntoView({behavior:'smooth', block:'nearest'});
    (meta.url ? ta : panel.querySelector('#vaiUrl')).focus();
    return panel;
  }
  function setVaiStatus(panel, msg){ const s = panel.querySelector('#vaiStatus'); if(s) s.textContent = msg; }

  /* ---------- run a mode ---------- */
  async function runVideoMode(panel, mode, regenerate){
    if(vaiRunning > 0){ toast('A video-AI request is already running — wait or cancel it.'); return; }
    const M = VIDEO_MODES[mode]; if(!M) return;
    const ta = panel.querySelector('#vaiTranscript');
    const transcript = (ta.value || '').trim();
    if(transcript.length < 80){
      setVaiStatus(panel, 'Fetch or paste at least a paragraph of transcript first (' + transcript.length + ' chars now).');
      ta.focus();
      return;
    }
    const meta = panel._meta || {};
    const srcLabel = 'Source: ' + (panel._sourceNote || 'pasted transcript/notes') + ' (' + transcript.length.toLocaleString() + ' chars' + (transcript.length > V_CTX ? ', trimmed to ' + (V_CTX / 1000).toFixed(0) + 'k keeping start+end' : '') + ') · ' + (meta.url ? 'video link external, not sent ' : 'no video link ') + '· AI-generated — separate from official notes';
    const host = panel.querySelector('#vaiOut');
    const card = regenerate || addVideoCard(host, M.label, meta);
    const controller = new AbortController();
    vaiRunning++;
    const body = card.querySelector('.cai-body');
    body.innerHTML = '<div class="cai-pending"><span class="cai-spinner" aria-hidden="true"></span><span class="cai-pending-msg">Working…</span><button type="button" class="cai-btn" data-act="cancel">CANCEL</button></div>';
    body.querySelector('[data-act="cancel"]').addEventListener('click', () => controller.abort());
    try{
      let full = '';
      if(M.multi){
        for(let part = 0; part < NOTES_PARTS.length; part++){
          setVaiStatus(panel, 'Generating part ' + (part + 1) + ' of ' + NOTES_PARTS.length + ' — large notes take a while…');
          const res = await callAi({prompt:NOTES_PARTS[part], context:transcript, signal:controller.signal, maxContextChars:V_CTX,
            onStatus:s => { const p = body.querySelector('.cai-pending-msg'); if(p) p.textContent = 'Part ' + (part + 1) + '/2 · ' + s; }});
          full += (part ? '\n\n---\n\n' : '') + res.text;
          if(part === 0){
            card._partial = true;
            body.insertAdjacentHTML('afterbegin', '<div class="vai-part1">' + md(full) + '</div>');
            math(body);
          }
        }
      }else{
        setVaiStatus(panel, 'Generating ' + M.label.toLowerCase() + '…');
        const res = await callAi({prompt:M.prompt(transcript), context:transcript, signal:controller.signal, maxContextChars:V_CTX,
          onStatus:s => { const p = body.querySelector('.cai-pending-msg'); if(p) p.textContent = s; }});
        full = res.text;
      }
      body.innerHTML = '<div class="cai-hint">' + esc(srcLabel) + '</div>' + md(full);
      math(body);
      card._answerText = full;
      card._srcLabel = srcLabel;
      setVaiStatus(panel, 'Done — ' + full.length.toLocaleString() + ' chars. SAVE keeps it locally; nothing was saved or sent anywhere else.');
      if(window.AiUsage) window.AiUsage.track((panel._meta && panel._meta.label) || 'video', 'video-' + mode);
    }catch(err){
      const cancelled = err && err.name === 'AiAbortError' && err.kind === 'cancelled';
      if(cancelled && card._partial){
        body.insertAdjacentHTML('beforeend', '<div class="cai-error">⛔ Cancelled during generation — partial content above is kept; press REGENERATE to redo.</div>');
      }else{
        body.innerHTML = '<div class="cai-error">' + (cancelled ? '⛔ Cancelled.' : '⚠ ') + esc(err && err.message ? err.message : String(err)) + '</div>';
      }
      setVaiStatus(panel, cancelled ? 'Cancelled.' : 'Failed — fix the issue in ✦ AI settings and retry.');
    }finally{
      vaiRunning = 0;
    }
  }
  function addVideoCard(host, label, meta){
    const card = document.createElement('div');
    card.className = 'cai-card';
    card._meta = {mode:'video', label:'VIDEO · ' + label, subject:(meta && meta.label) || currentSubjectLabel(), url:(meta && meta.url) || ''};
    card.innerHTML =
      '<div class="cai-head"><span class="cai-mode">' + esc('VIDEO · ' + label) + '</span>' +
      '<span class="cai-badge">AI-GENERATED</span>' +
      '<span class="cai-meta">' + esc(card._meta.subject) + ' · ' + new Date().toLocaleString() + '</span></div>' +
      '<div class="cai-actions">' +
      '<button type="button" class="cai-btn" data-act="copy">COPY</button>' +
      '<button type="button" class="cai-btn" data-act="regen">REGENERATE</button>' +
      '<button type="button" class="cai-btn" data-act="save">SAVE LOCALLY</button>' +
      '<button type="button" class="cai-btn" data-act="del">DELETE</button></div>' +
      '<div class="cai-body"></div>';
    host.appendChild(card);
    card.querySelector('.cai-actions').addEventListener('click', e => {
      const act = e.target.closest('button') && e.target.closest('button').dataset.act;
      if(!act) return;
      if(act === 'copy'){
        const txt = card._answerText || card.querySelector('.cai-body').innerText || '';
        if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(() => toast('Copied'), () => toast('Copy failed'));
      }
      else if(act === 'regen'){
        const panel = card.closest('.vai-panel');
        const modeKey = Object.keys(VIDEO_MODES).find(k => 'VIDEO · ' + VIDEO_MODES[k].label === card._meta.label);
        if(panel && modeKey) runVideoMode(panel, modeKey, card);
        else toast('Reopen the video AI panel to regenerate.');
      }
      else if(act === 'save'){
        if(!card._answerText){ toast('Nothing to save yet.'); return; }
        if(window.ContentAi){
          window.ContentAi.lib.add({
            id: card._libId || ('vai' + Date.now() + Math.floor(Math.random() * 999)),
            mode: 'video', label: card._meta.label, subject: card._meta.subject,
            question: card._srcLabel || 'video transcript notes',
            text: card._answerText, createdAt: card._createdAt || Date.now(), updatedAt: Date.now()
          });
          card._libId = card._libId || ('vai' + Date.now());
          e.target.textContent = 'SAVED ✓';
          const cnt = document.getElementById('caiSavedBtn');
          if(cnt) cnt.textContent = 'SAVED (' + window.ContentAi.lib.load().length + ')';
          toast('Saved locally — find it in the vault AI bar → SAVED. Never in backups, never uploaded.');
        }
      }
      else if(act === 'del'){ card.remove(); }
    });
    return card;
  }

  /* ---------- decorate the vault's video cards ---------- */
  function decorateVideoCards(){
    document.querySelectorAll('.content-resource-video').forEach(card => {
      if(card.querySelector('.vai-btn')) return;
      const labelEl = card.querySelector('.content-resource-video-label');
      const linkEl = card.querySelector('a[href*="youtube"], a[href*="youtu.be"]');
      const label = labelEl ? labelEl.textContent.replace(/^CURATED VIDEO RESOURCE ·\s*/, '').trim() : currentSubjectLabel();
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'vai-btn';
      btn.textContent = '✦ AI NOTES FROM VIDEO';
      btn.title = 'Fetch captions or paste a transcript → summaries, flashcards, formula sheets & full notes';
      btn.addEventListener('click', () => openVideoAi(card, {label, url: linkEl ? linkEl.href : ''}));
      card.appendChild(btn);
    });
  }

  /* ---------- generic dock ---------- */
  function mountGenericDock(){
    const bar = document.getElementById('contentAiBar');
    if(!bar || document.getElementById('vaiDockBtn')) return false;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cai-btn';
    btn.id = 'vaiDockBtn';
    btn.textContent = 'VIDEO NOTES';
    btn.title = 'Fetch a video transcript or paste text → notes/flashcards';
    btn.addEventListener('click', () => {
      const panelHost = document.getElementById('contentAiPanel') || bar;
      openVideoAi(panelHost, {label: currentSubjectLabel(), url: ''});
    });
    bar.insertBefore(btn, bar.querySelector('#caiSavedBtn'));
    return true;
  }

  /* ---------- exports ---------- */
  window.extractVideoNotes = function(){
    if(mountGenericDock()){
      const b = document.getElementById('vaiDockBtn');
      if(b){ b.click(); return; }
    }
    const panelHost = document.getElementById('contentAiPanel') || document.getElementById('contentVault');
    if(panelHost) openVideoAi(panelHost, {label: currentSubjectLabel(), url: ''});
    else toast('Open the Content Vault first.');
  };
  window.VideoAi = {
    open: openVideoAi, decorate: decorateVideoCards, modes: VIDEO_MODES, parts: NOTES_PARTS,
    fetch: fetchTranscriptText, ytVideoId,
    parsers: {vtt: parseVtt, xml: parseTimedXml, json3: parseJson3, sniff: sniffParse}
  };

  /* ---------- init ---------- */
  let tries = 0, observed = false;
  const boot = () => {
    const reader = document.getElementById('contentReader');
    decorateVideoCards();
    mountGenericDock();
    if(reader && !observed){
      observed = true;
      let t = null;
      new MutationObserver(() => { clearTimeout(t); t = setTimeout(() => { decorateVideoCards(); }, 120); })
        .observe(reader, {childList:true});
    }
    if((!reader || !document.getElementById('vaiDockBtn')) && ++tries < 20) setTimeout(boot, 250);
  };
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
