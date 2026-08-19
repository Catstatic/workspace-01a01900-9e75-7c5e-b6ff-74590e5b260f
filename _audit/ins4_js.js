/* ============================================================
   SIMULATOR / REVIEW / WEAK-PRACTICE AI (Step 4)
   Hooks the RESULT shell (post-exam review) and the LIVE exam
   shell via function wrapping — the original grading, scoring,
   attempt limits and PYQ data are never modified. AI receives
   read-only context; during a LIVE exam the official answer is
   never included and the tutor is hint-first.
   ============================================================ */
(function(){
  const SAI_CTX = 15000;
  const OPT_LETTERS = ['A','B','C','D'];

  /* ---------- read-only getters over tracker internals ---------- */
  function getPaper(id){ try{ return getSimPaper(id); }catch(e){ return null; } }
  function getAttempts(){ try{ return (state && state.simAttempts) || []; }catch(e){ return []; } }
  function getSession(){ try{ return simSession; }catch(e){ return null; } }
  function markingOf(paper, q){ try{ return getSimMarking(paper, q); }catch(e){ return {correct:'?', wrong:'?'}; } }
  function esc(s){ return window.ContentAi ? String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;') : String(s||''); }
  function md(s){ return window.ContentAi ? window.ContentAi.md(s) : '<p>' + esc(s) + '</p>'; }
  function math(el){ if(typeof renderMathInElement === 'function'){ try{ renderMathInElement(el, {delimiters:[{left:'$$',right:'$$',display:true},{left:'\\[',right:'\\]',display:true},{left:'\\(',right:'\\)',display:false},{left:'$',right:'$',display:false}], throwOnError:false}); }catch(e){} } }
  function toast(m){ if(typeof showToast === 'function') showToast(m); }

  /* ---------- question description (text or official crop image) ---------- */
  function isCropQuestion(paper, q){
    try{ return !!gateSourceCropPath(paper, q); }catch(e){ return false; }
  }
  function cropImageData(paper, q){
    try{
      const url = gateSourceCropURL(gateSourceCropPath(paper, q));
      if(/^data:image\//.test(url) && url.length < 400000) return url;
    }catch(e){}
    return '';
  }
  function questionKind(q){
    if(q.note && /numerical answer type/i.test(q.note)) return 'NAT';
    if(q.opts && q.opts.length === 4 && q.opts.every(o => /^\([A-D]\)$/.test(String(o).trim()))) return 'MCQ (options shown on official paper image)';
    return 'MCQ';
  }
  function answerLetter(i){ return i != null && i >= 0 && i <= 3 ? OPT_LETTERS[i] : '—'; }
  function answerText(paper, q, idx){
    if(idx == null || idx < 0 || idx > 3) return 'not recorded';
    const crop = isCropQuestion(paper, q);
    return 'Option ' + answerLetter(idx) + (crop ? '' : ': "' + String(q.opts[idx] || '').slice(0, 160) + '"');
  }
  function simQuestionTypeLocal(q){ return questionKind(q); }

  /* ---------- context builders (JSON-ish, size-capped) ---------- */
  function questionContext(paper, q, attempt, live){
    const crop = isCropQuestion(paper, q);
    const ctx = {
      exam: paper.label,
      questionNumber: q.n,
      part: q.part,
      type: questionKind(q),
      marking: '+' + markingOf(paper, q).correct + ' correct / −' + markingOf(paper, q).wrong + ' wrong',
      question: crop ? '[The question text is the attached official paper image]' : String(q.q || '').slice(0, 900),
      conceptsMentioned: q.label || undefined
    };
    if(!crop && q.opts) ctx.options = q.opts.map((o, i) => answerLetter(i) + ') ' + String(o).slice(0, 160));
    if(q.note) ctx.officialNote = String(q.note).slice(0, 240);
    if(live){
      ctx.mode = 'LIVE EXAM — the official answer is deliberately withheld; give hints, not solutions';
    }else if(attempt){
      const given = attempt.answers[q.n];
      ctx.yourAnswer = given === undefined ? 'not attempted' : answerText(paper, q, given);
      ctx.officialAnswer = answerText(paper, q, q.ans);
      ctx.outcome = given === undefined ? 'skipped' : (given === q.ans ? 'correct' : 'wrong');
      ctx.timeSpentSec = Math.round((attempt.timePerQ || {})[q.n] || 0);
    }
    return ctx;
  }
  function attemptSummary(attempt, paper){
    const pb = attempt.partBreakdown || {};
    const partLines = Object.keys(paper.partCounts || {}).map(k => {
      const b = pb[k] || {};
      return 'Part ' + k + ': attempted ' + (b.attempted || 0) + '/' + (b.total || 0) + ', correct ' + (b.correct || 0) + ', wrong ' + (b.wrong || 0) + ', score ' + Number(b.score || 0).toFixed(2);
    }).join('\n');
    const rows = paper.questions.map(q => {
      const given = attempt.answers[q.n];
      const status = given === undefined ? 'skipped' : (given === q.ans ? 'correct' : 'wrong');
      const t = Math.round((attempt.timePerQ || {})[q.n] || 0);
      if(status === 'correct') return null;
      return {n:q.n, part:q.part, status, timeSec:t,
        question: isCropQuestion(paper, q) ? '[image-based question]' : String(q.q || '').slice(0, 260),
        type: questionKind(q),
        yourAnswer: given === undefined ? '—' : answerLetter(given),
        officialAnswer: answerLetter(q.ans)};
    }).filter(Boolean);
    const prevAttempts = getAttempts().filter(a => a && a.paperId === attempt.paperId && a.id !== attempt.id);
    return {
      exam: attempt.paperLabel,
      examType: /gate/i.test(attempt.paperId + ' ' + attempt.paperLabel) ? 'GATE Physics' : 'CSIR-NET Physics (Parts A/B/C)',
      score: attempt.score + ' / ' + attempt.maxScore,
      correctWrongSkipped: attempt.correct + ' / ' + attempt.wrong + ' / ' + attempt.skipped,
      accuracyOnAttempted: (attempt.correct + attempt.wrong) > 0 ? Math.round(attempt.correct / (attempt.correct + attempt.wrong) * 100) + '%' : 'n/a',
      officialAttemptLimits: (function(){ try{ return simUsesOfficialLimits(paper) ? JSON.stringify(SIM_LIMITS) : 'paper-specific'; }catch(e){ return 'official CSIR limits apply'; } })(),
      officialMarkingScheme: 'Part A +2/−0.5 (max 15 of 20), Part B +3.5/−0.875 (max 20 of 25), Part C +5/−1.25 (max 20 of 30); GATE papers use +1 or +2 with 1/3 or 2/3 negative',
      partBreakdown: partLines,
      previousAttemptsOnThisPaper: prevAttempts.length,
      bestPreviousScore: prevAttempts.length ? Math.max.apply(null, prevAttempts.map(a => a.score)) : null,
      aiActivity: (window.AiUsage && window.AiUsage.top(5)) || [],
      wrongAndSkippedQuestions: rows.slice(0, 45),
      omittedFromDetail: Math.max(0, rows.length - 45) + ' (listed as counts only)'
    };
  }

  /* ---------- shared card plumbing (reuses Step-3 CSS) ---------- */
  let saiRunning = 0;
  function addSaiCard(host, title, meta){
    const card = document.createElement('div');
    card.className = 'cai-card';
    card.innerHTML =
      '<div class="cai-head"><span class="cai-mode">' + esc(title) + '</span>' +
      '<span class="cai-badge">AI-GENERATED · ADVISORY</span>' +
      '<span class="cai-meta">' + esc(meta || '') + '</span></div>' +
      '<div class="cai-actions">' +
      '<button type="button" class="cai-btn" data-act="copy">COPY</button>' +
      '<button type="button" class="cai-btn" data-act="del">DELETE</button></div>' +
      '<div class="cai-body"></div>';
    host.appendChild(card);
    card.querySelector('[data-act="copy"]').addEventListener('click', () => {
      const txt = card.querySelector('.cai-body').innerText || '';
      if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(() => toast('AI response copied'), () => toast('Copy failed'));
    });
    card.querySelector('[data-act="del"]').addEventListener('click', () => card.remove());
    return card;
  }
  async function saiRun(host, title, meta, prompt, context, image){
    if(saiRunning > 0){ toast('An AI request is already running — wait for it or cancel it.'); return null; }
    saiRunning++;
    const card = addSaiCard(host, title, meta);
    const controller = new AbortController();
    const body = card.querySelector('.cai-body');
    body.innerHTML = '<div class="cai-pending"><span class="cai-spinner" aria-hidden="true"></span><span class="cai-pending-msg">Contacting provider…</span><button type="button" class="cai-btn" data-act="cancel">CANCEL</button></div>';
    body.querySelector('[data-act="cancel"]').addEventListener('click', () => controller.abort());
    card.scrollIntoView && card.scrollIntoView({behavior:'smooth', block:'nearest'});
    try{
      const res = await callAi({prompt, context, image, signal:controller.signal, maxContextChars:SAI_CTX,
        onStatus:s => { const p = body.querySelector('.cai-pending-msg'); if(p) p.textContent = s; }});
      body.innerHTML = md(res.text);
      math(body);
      card._answerText = res.text;
      return card;
    }catch(err){
      const cancelled = err && err.name === 'AiAbortError' && err.kind === 'cancelled';
      body.innerHTML = '<div class="cai-error">' + (cancelled ? '⛔ ' : '⚠ ') + esc(err && err.message ? err.message : String(err)) + '</div>';
      return null;
    }finally{
      saiRunning--;
    }
  }

  /* ---------- per-question review tools ---------- */
  const REVIEW_TOOLS = {
    solution: {label:'✦ SOLUTION', prompt:c =>
      'Provide a complete step-by-step solution. The official answer is ' + c.officialAnswer + ' — explain rigorously why it is correct. ' +
      (c.yourAnswer && c.yourAnswer !== 'not attempted' ? 'The student answered ' + c.yourAnswer + ' — explain exactly where that reasoning fails. ' : 'The student did not attempt it — show the cleanest path in. ') +
      'Finish with the core concept name and a one-line exam takeaway. Never suggest the official answer is wrong without saying "verify with the official key first".'},
    options:  {label:'✦ WHY OPTIONS', prompt:c =>
      'Analyze all four options for this ' + c.type + ' question. The official answer is ' + c.officialAnswer + '. ' +
      'For the correct option, justify it briefly. For EVERY distractor, name the specific misconception or arithmetic slip it exploits (sign error, factor of 2, wrong limit, unit slip). Keep it tabular if possible.'},
    gap:      {label:'✦ CONCEPT GAP', prompt:c =>
      'The student answered ' + c.yourAnswer + ' but the official answer is ' + c.officialAnswer + ' (time spent: ' + (c.timeSpentSec || 0) + 's). ' +
      'Identify the ONE specific concept gap this mistake reveals, give a 4-line micro-lesson that fixes it, then suggest one mini practice task to close it this week.'},
    hint:     {label:'✦ HINT', prompt:c =>
      'Give a graduated hint for this question WITHOUT revealing or computing the final answer: name the governing principle and only the first productive step or simplification. The student must still solve it.'}
  };

  function decorateReviewShell(attemptId){
    const attempt = getAttempts().find(a => a && a.id === attemptId);
    const paper = attempt && getPaper(attempt.paperId);
    const main = document.getElementById('resultMain');
    if(!attempt || !paper || !main) return;
    if(document.getElementById('simAiBar')) document.getElementById('simAiBar').remove();
    if(document.getElementById('simAiPanelHost')) document.getElementById('simAiPanelHost').remove();

    /* attempt-level toolbar */
    const bar = document.createElement('div');
    bar.className = 'sim-ai-bar';
    bar.id = 'simAiBar';
    bar.innerHTML =
      '<span class="content-ai-tag">AI COACH · OPTIONAL</span>' +
      '<button type="button" class="cai-btn" data-sai="analyze">ANALYZE MY ATTEMPT</button>' +
      '<button type="button" class="cai-btn" data-sai="plan">7-DAY REVISION PLAN</button>' +
      '<button type="button" class="cai-btn" data-sai="weak">WEAK-AREA PRACTICE SET</button>' +
      '<span class="sim-ai-note">Advice only — your official answers, score (' + attempt.score.toFixed(2) + '/' + attempt.maxScore.toFixed(2) + ') and marking scheme are never shown to the AI as editable data and never change.</span>';
    const hero = main.querySelector('.result-hero');
    (hero ? hero : main.firstChild).insertAdjacentElement('afterend', bar);

    const hostWrap = document.createElement('div');
    hostWrap.id = 'simAiPanelHost';
    hostWrap.className = 'sim-ai-panel-wrap';
    bar.insertAdjacentElement('afterend', hostWrap);

    bar.addEventListener('click', e => {
      const b = e.target.closest('button[data-sai]'); if(!b) return;
      const sum = attemptSummary(attempt, paper);
      if(window.AiUsage) window.AiUsage.track(attempt.paperLabel, 'attempt-' + b.dataset.sai);
      if(b.dataset.sai === 'analyze'){
        saiRun(hostWrap, 'ATTEMPT ANALYSIS', attempt.paperLabel + ' · ' + new Date(attempt.submittedAt).toLocaleString(),
          'Analyze this exam attempt for a CSIR-NET/GATE aspirant. Produce: 1) Overall reading (score vs attempt pattern — was negative marking controlled?), 2) Mistake taxonomy from the wrong list (concept gap vs careless/rushed vs wild guess — use the time data), 3) Weakest part diagnosis with the part that bleeds the most marks, 4) Time-management verdict, 5) Exactly 3 concrete actions before the next attempt. Never question official answer keys; treat them as ground truth.',
          JSON.stringify(sum));
      }else if(b.dataset.sai === 'plan'){
        saiRun(hostWrap, '7-DAY REVISION PLAN', attempt.paperLabel,
          'Build a personalized 7-day revision plan from this attempt analysis. Rules: weight days toward the weakest parts, keep one flashcard/recall block and one mixed timed practice block daily, map each day to specific syllabus topics implied by the wrong questions, and keep day 7 as a light review + formula-sheet day. Then list "watch items" — the 3 mistakes most likely to repeat. Official scores/answers stay as they are; this plan only guides study.',
          JSON.stringify(sum));
      }else if(b.dataset.sai === 'weak'){
        generateWeakPractice(attemptId, hostWrap);
      }
    });

    /* per-question tool rows */
    const reviewQs = main.querySelectorAll('#reviewList .review-q');
    reviewQs.forEach((el, i) => {
      const q = paper.questions[i]; if(!q || el.querySelector('.sai-tool-row')) return;
      const row = document.createElement('div');
      row.className = 'sai-tool-row';
      row.innerHTML =
        '<button type="button" class="sai-btn" data-tool="solution" title="Full step-by-step solution">SOLUTION</button>' +
        '<button type="button" class="sai-btn" data-tool="options" title="Why each option is right/wrong">WHY OPTIONS</button>' +
        '<button type="button" class="sai-btn" data-tool="gap" title="What this mistake reveals">CONCEPT GAP</button>' +
        '<button type="button" class="sai-btn" data-tool="hint" title="Graduated hint without the answer">HINT</button>' +
        '<button type="button" class="sai-btn" data-tool="doubt" title="Ask your own doubt about this question">DOUBT…</button>';
      el.appendChild(row);
      row.addEventListener('click', e => {
        const b = e.target.closest('button[data-tool]'); if(!b) return;
        const tool = b.dataset.tool;
        if(tool === 'doubt'){ openReviewAi(attemptId, q.n, el); return; }
        if(window.AiUsage) window.AiUsage.track(attempt.paperLabel + ' · Q' + q.n + ' · Part ' + q.part, 'review-' + tool);
        const ctx = questionContext(paper, q, attempt, false);
        const image = isCropQuestion(paper, q) ? cropImageData(paper, q) : '';
        saiRun(el, REVIEW_TOOLS[tool].label.replace('✦ ', ''), attempt.paperLabel + ' · Q' + q.n + ' · Part ' + q.part + (ctx.outcome ? ' · ' + ctx.outcome : ''),
          REVIEW_TOOLS[tool].prompt(ctx), JSON.stringify(ctx), image);
      });
    });
    math(main);
  }

  /* ---------- live-exam decoration ---------- */
  function decorateExamAi(){
    const shell = document.getElementById('examShell');
    const session = getSession();
    if(!shell || !shell.classList.contains('active') || !session) return;
    const nav = document.querySelector('#examMain .exam-nav-btns');
    if(!nav || document.getElementById('simLiveAiBtn')) return;
    const btn = document.createElement('button');
    btn.className = 'sim-btn ghost sai-live-btn';
    btn.id = 'simLiveAiBtn';
    btn.type = 'button';
    btn.textContent = '✦ AI DOUBT (HINT-SAFE)';
    btn.title = 'Ask the AI about this question — it will give hints, not the answer';
    btn.addEventListener('click', () => openSimAi());
    nav.insertBefore(btn, nav.firstChild);
  }

  /* ---------- per-question doubt chat (review & live) ---------- */
  function openChatPanel(host, title, noteText){
    let panel = host.querySelector('.sim-ai-panel');
    if(!panel){
      panel = document.createElement('div');
      panel.className = 'sim-ai-panel cai-card';
      panel.innerHTML =
        '<div class="cai-head"><span class="cai-mode">' + esc(title) + '</span><span class="cai-badge">AI-GENERATED</span></div>' +
        (noteText ? '<div class="exam-ai-live-note">' + esc(noteText) + '</div>' : '') +
        '<div class="cai-body sai-chat-log"></div>' +
        '<div class="cai-followup"><textarea placeholder="Ask about this question — a step, a formula, your approach… (Enter to send)" aria-label="Doubt"></textarea>' +
        '<div class="cai-followup-row"><button type="button" class="cai-btn" data-act="closechat">CLOSE</button><button type="button" class="cai-btn primary" data-act="sendchat">ASK</button></div></div>';
      host.appendChild(panel);
      panel._history = [];
      if(window.AiImage) window.AiImage.wire(panel, panel.querySelector('.cai-followup-row'));
      panel.querySelector('[data-act="sendchat"]').addEventListener('click', () => panel._send());
      panel.querySelector('[data-act="closechat"]').addEventListener('click', () => panel.remove());
      panel.querySelector('textarea').addEventListener('keydown', e => {
        if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); panel._send(); }
      });
    }
    panel.scrollIntoView && panel.scrollIntoView({behavior:'smooth', block:'nearest'});
    panel.querySelector('textarea').focus();
    return panel;
  }
  async function chatSend(panel, asker){
    const ta = panel.querySelector('textarea');
    const q = (ta.value || '').trim();
    if(!q) return;
    ta.value = '';
    panel._pendingImage = window.AiImage ? window.AiImage.take(panel) : '';
    const log = panel.querySelector('.sai-chat-log');
    log.insertAdjacentHTML('beforeend', '<div class="cai-thread-q">YOU: ' + esc(q) + (panel._pendingImage ? ' <span class="cai-hint">[image attached]</span>' : '') + '</div>');
    const controller = new AbortController();
    const pending = document.createElement('div');
    pending.className = 'cai-pending';
    pending.innerHTML = '<span class="cai-spinner" aria-hidden="true"></span><span class="cai-pending-msg">Thinking…</span><button type="button" class="cai-btn">CANCEL</button>';
    pending.querySelector('button').addEventListener('click', () => controller.abort());
    log.appendChild(pending);
    try{
      const res = await asker(q, controller.signal, panel._history);
      panel._pendingImage = '';
      pending.remove();
      log.insertAdjacentHTML('beforeend', '<div class="sai-a">' + md(res.text) + '</div>');
      math(log);
      panel._history.push({role:'user', text:q}, {role:'assistant', text:res.text});
      if(window.AiUsage && panel._usage) window.AiUsage.track(panel._usage.subject, panel._usage.mode);
    }catch(err){
      pending.remove();
      log.insertAdjacentHTML('beforeend', '<div class="cai-error">⚠ ' + esc(err && err.message ? err.message : String(err)) + '</div>');
    }
    log.scrollTop = log.scrollHeight;
  }

  /* review doubt chat — official answer included (exam is over) */
  function openReviewAi(attemptId, qNum, hostEl){
    const attempt = getAttempts().find(a => a && a.id === attemptId);
    const paper = attempt && getPaper(attempt.paperId);
    const q = paper && paper.questions.find(x => x.n === qNum);
    const host = hostEl || (function(){
      const list = document.querySelectorAll('#reviewList .review-q');
      const idx = paper ? paper.questions.findIndex(x => x.n === qNum) : -1;
      return idx >= 0 ? list[idx] : null;
    })();
    if(!attempt || !paper || !q || !host){ toast('Open the attempt review first.'); return; }
    const panel = openChatPanel(host, 'AI DOUBT SOLVER · Q' + qNum, 'Exam is over — the official answer may be discussed.');
    panel._usage = {subject:paper.label, mode:'review-doubt'};
    const ctx = questionContext(paper, q, attempt, false);
    panel._send = () => chatSend(panel, (question, signal, history) => callAi({
      prompt: question, context: JSON.stringify(ctx), history, signal,
      image: (panel._pendingImage || '') || (isCropQuestion(paper, q) ? cropImageData(paper, q) : ''), maxContextChars: SAI_CTX
    }));
  }

  /* live-exam doubt chat — official answer withheld, hint-first */
  function openSimAi(){
    const session = getSession();
    if(!session){ toast('Start a simulator session first.'); return; }
    const paper = getPaper(session.paperId);
    const q = paper && paper.questions.find(x => x.n === session.currentQ);
    const examMain = document.getElementById('examMain');
    if(!paper || !q || !examMain) return;
    const panel = openChatPanel(examMain, 'AI DOUBT · Q' + q.n + ' (LIVE)', 'Live exam: the AI is hint-first and the official answer is never sent. Attempt limits and scoring are untouched.');
    panel._usage = {subject:paper.label, mode:'live-doubt'};
    const ctx = questionContext(paper, q, null, true);
    panel._send = () => chatSend(panel, (question, signal, history) => callAi({
      prompt: question, context: JSON.stringify(ctx), history, signal,
      systemPrompt: 'You are a careful CSIR-NET/GATE Physics tutor assisting a student DURING a live mock exam. The official answer is withheld from you. Be hint-first: give the governing principle and the first productive step, point out what to double-check, but do NOT deliver a complete final solution unless the student explicitly insists twice. Check units and signs.',
      image: (panel._pendingImage || '') || (isCropQuestion(paper, q) ? cropImageData(paper, q) : ''), maxContextChars: SAI_CTX
    }));
  }

  /* ---------- weak-area practice generation ---------- */
  function splitAnswerKey(text){
    const src = String(text || '');
    const m = src.match(/\n?\s*(?:#{1,4}\s*|\*\*)?answer key(?:\*\*)?\s*:?\s*\n/i);
    if(!m) return {main:text, key:''};
    return {main: src.slice(0, m.index).trim(), key: src.slice(m.index).trim()};
  }
  async function generateWeakPractice(attemptId, host){
    const attempt = attemptId ? getAttempts().find(a => a && a.id === attemptId)
                              : getAttempts().slice().sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))[0];
    const paper = attempt && getPaper(attempt.paperId);
    const outHost = host || document.getElementById('simAiPanelHost');
    if(!attempt || !paper || !outHost){ toast('Finish a simulator attempt first — the AI builds practice from your weak areas.'); return; }
    const sum = attemptSummary(attempt, paper);
    const card = await saiRun(outHost, 'WEAK-AREA PRACTICE', attempt.paperLabel + ' · original AI questions',
      'Create 6 ORIGINAL practice questions targeting this student\'s weak areas from the attempt data: exactly 2 single-correct MCQs at Part-B difficulty (3.5 marks, −0.875), 2 single-correct MCQs at Part-C difficulty (5 marks, −1.25), and 2 numerical-answer questions, ordered easy to hard. Start the response with the line "AI-generated practice — not official CSIR/GATE content." Do not copy or imitate actual PYQ wording. After ALL questions, add a clearly separated section headed "Answer key" with one-line solutions.',
      JSON.stringify(sum));
    if(card){
      const parts = splitAnswerKey(card._answerText || '');
      if(parts.key){
        const body = card.querySelector('.cai-body');
        body.innerHTML = md(parts.main) +
          '<button type="button" class="cai-btn sai-key-toggle">SHOW ANSWER KEY</button>' +
          '<div class="sai-key-block">' + md(parts.key) + '</div>';
        const toggle = body.querySelector('.sai-key-toggle');
        const keyBlock = body.querySelector('.sai-key-block');
        toggle.addEventListener('click', () => {
          const open = keyBlock.classList.toggle('open');
          toggle.textContent = open ? 'HIDE ANSWER KEY' : 'SHOW ANSWER KEY';
        });
        math(body);
      }
      toast('Weak-area practice generated — AI set, separate from official PYQs.');
    }
  }

  /* ---------- exports (old-tracker compatible names) ---------- */
  window.openReviewAi = openReviewAi;
  window.askReviewAi = function(attemptId, qNum, question){
    openReviewAi(attemptId, qNum);
    const attempt = getAttempts().find(a => a && a.id === attemptId);
    const paper = attempt && getPaper(attempt.paperId);
    const idx = paper ? paper.questions.findIndex(x => x.n === qNum) : -1;
    const els = document.querySelectorAll('#reviewList .review-q');
    const panel = idx >= 0 && els[idx] ? els[idx].querySelector('.sim-ai-panel') : null;
    if(panel && question){ panel.querySelector('textarea').value = String(question); }
  };
  window.openSimAi = openSimAi;
  window.askSimAi = function(question){ openSimAi(); const panels = document.querySelectorAll('#examMain .sim-ai-panel'); const p = panels[panels.length - 1]; if(p && question){ p.querySelector('textarea').value = question; } };
  window.generateWeakPractice = generateWeakPractice;
  window.SimAi = {
    decorateReview: decorateReviewShell,
    decorateExam: decorateExamAi,
    questionContext, attemptSummary, splitAnswerKey, questionKind, answerText,
    reviewTools: REVIEW_TOOLS
  };

  /* ---------- wrap tracker entry points (originals untouched) ---------- */
  if(typeof window.viewSimResult === 'function'){
    const origView = window.viewSimResult;
    window.viewSimResult = function(attemptId){
      const r = origView.apply(this, arguments);
      try{ decorateReviewShell(attemptId); }catch(e){}
      return r;
    };
  }
  if(typeof window.renderExamQuestion === 'function'){
    const origRender = window.renderExamQuestion;
    window.renderExamQuestion = function(){
      const r = origRender.apply(this, arguments);
      try{ decorateExamAi(); }catch(e){}
      return r;
    };
  }
})();
