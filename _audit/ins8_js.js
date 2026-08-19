/* ============================================================
   CHAPTER NAVIGATOR + AI USAGE ANALYTICS (final transfers)
   - AiChapters: jump-strip from headings of long AI answers
     (transfer+improve noteNavigator — works on any AI card,
     not just saved video notes).
   - AiUsage: local-only per-subject AI interaction counters
     (transfer+improve state.aiTopicInteractions) feeding the
     weak-practice / analysis context. Own storage key — never
     in tracker backups; cleared with CLEAR AI HISTORY.
   ============================================================ */
(function(){
  /* ---------- chapter navigator ---------- */
  function decorateChapters(card){
    if(!card || card._chaptersDone) return;
    card._chaptersDone = true;
    const body = card.querySelector('.cai-body');
    if(!body) return;
    const heads = Array.from(body.querySelectorAll('h4')).slice(0, 30);
    if(heads.length < 3) return;
    const strip = document.createElement('div');
    strip.className = 'ai-chapters';
    strip.appendChild(Object.assign(document.createElement('span'), {className:'ai-chapters-tag', textContent:'CHAPTERS'}));
    heads.forEach(h => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ai-chapter-btn';
      const label = h.textContent.replace(/[{}[\]()]/g, '').trim();
      b.textContent = (label.length > 26 ? label.slice(0, 25) + '…' : label) || 'Section';
      b.title = label;
      b.addEventListener('click', () => {
        if(h.scrollIntoView){ try{ h.scrollIntoView({behavior:'smooth', block:'start'}); }catch(e){ h.scrollIntoView(); } }
        h.classList.remove('ai-chapter-hi');
        void h.offsetWidth;
        h.classList.add('ai-chapter-hi');
        setTimeout(() => h.classList.remove('ai-chapter-hi'), 1300);
      });
      strip.appendChild(b);
    });
    const hint = body.querySelector(':scope > .cai-hint');
    if(hint) hint.insertAdjacentElement('afterend', strip);
    else body.insertBefore(strip, body.firstChild);
  }

  /* ---------- AI usage analytics (local-only) ---------- */
  const USE_KEY = 'csirnet_ai_usage_v1';
  function useLoad(){
    try{
      const v = JSON.parse(localStorage.getItem(USE_KEY) || '{}');
      return (v && typeof v === 'object' && !Array.isArray(v)) ? v : {};
    }catch(e){ return {}; }
  }
  function useSave(obj){
    const keys = Object.keys(obj);
    if(keys.length > 100){   /* cap: drop least-recently-used subjects */
      keys.sort((a, b) => (obj[a].last || 0) - (obj[b].last || 0));
      keys.slice(0, keys.length - 100).forEach(k => delete obj[k]);
    }
    try{ localStorage.setItem(USE_KEY, JSON.stringify(obj)); }catch(e){}
  }
  window.AiChapters = {decorate: decorateChapters};
  window.AiUsage = {
    key: USE_KEY,
    track(subject, mode){
      const all = useLoad();
      const k = String(subject || 'general').trim().slice(0, 80) || 'general';
      const e = all[k] || {count:0, modes:{}, last:0};
      e.count++;
      e.modes[String(mode || 'ask')] = (e.modes[String(mode || 'ask')] || 0) + 1;
      e.last = Date.now();
      all[k] = e;
      useSave(all);
    },
    top(n){
      return Object.entries(useLoad())
        .sort((a, b) => (b[1].count - a[1].count) || ((b[1].last || 0) - (a[1].last || 0)))
        .slice(0, n || 5)
        .map(([subject, e]) => ({subject, aiInteractions:e.count, modes:e.modes, last:e.last}));
    },
    clear(){ localStorage.removeItem(USE_KEY); }
  };
})();
