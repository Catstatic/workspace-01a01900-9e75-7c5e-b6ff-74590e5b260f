/* ============================================================
   FINAL HARDENING (Step 6)
   - Clear-all AI history control in AI Settings
   - Unhandled-rejection safety net for async AI handlers
   - Standalone-HTML clone hygiene (inputs never serialize
     values; belts-and-braces scrub of live AI form state)
   ============================================================ */
(function(){
  const AI_LIB_KEY = 'csirnet_ai_library_v1';
  function aiHistoryCount(){
    try{ const v = JSON.parse(localStorage.getItem(AI_LIB_KEY) || '[]'); return Array.isArray(v) ? v.length : 0; }
    catch(e){ return 0; }
  }
  function refreshAiHistoryBtn(){
    const b = document.getElementById('aiClearHistoryBtn');
    if(b) b.textContent = 'CLEAR AI HISTORY (' + aiHistoryCount() + ')';
  }
  window.aiClearHistory = function(){
    const n = aiHistoryCount();
    if(n === 0){ if(typeof showToast === 'function') showToast('No saved AI history to clear.'); return; }
    if(!window.confirm('Delete all ' + n + ' locally saved AI responses? This cannot be undone.')) return;
    localStorage.removeItem(AI_LIB_KEY);
    if(window.AiUsage) window.AiUsage.clear();
    refreshAiHistoryBtn();
    const cnt = document.getElementById('caiSavedBtn');
    if(cnt) cnt.textContent = 'SAVED (0)';
    const list = document.getElementById('caiSavedList');
    if(list) list.classList.remove('open');
    if(typeof showToast === 'function') showToast('AI history deleted from this browser.');
  };

  /* keep the count fresh whenever the settings dialog opens */
  if(typeof window.openAiSettings === 'function' && !window.openAiSettings.__hardened){
    const origOpen = window.openAiSettings;
    const wrapped = function(){
      const r = origOpen.apply(this, arguments);
      try{ refreshAiHistoryBtn(); }catch(e){}
      return r;
    };
    wrapped.__hardened = true;
    window.openAiSettings = wrapped;
  }

  /* last-resort net: an async AI handler that ever throws outside its
     own try/catch must surface as a toast, not a console-only failure */
  if(!window.__aiRejectionGuard){
    window.__aiRejectionGuard = true;
    window.addEventListener('unhandledrejection', ev => {
      const r = ev && ev.reason;
      const msg = (r && r.message) ? r.message : String(r || 'unknown error');
      if(typeof showToast === 'function') showToast('AI action failed: ' + msg.slice(0, 160));
      ev.preventDefault();
    });
  }

  /* standalone-HTML downloads: scrub any live AI form values from the
     clone so the saved page never carries typed keys or transcripts */
  if(typeof window.downloadStandaloneHTML === 'function' && !window.downloadStandaloneHTML.__hardened){
    const origDl = window.downloadStandaloneHTML;
    const wrappedDl = async function(){
      const scrubIds = ['aiApiKey', 'aiOrg', 'aiHeaders', 'vaiTranscript', 'caiAskInput'];
      const stash = scrubIds.map(id => {
        const el = document.getElementById(id);
        if(!el) return null;
        const v = el.value; el.value = '';
        return {el, v};
      });
      try{ return await origDl.apply(this, arguments); }
      finally{ stash.forEach(s => { if(s) s.el.value = s.v; }); }
    };
    wrappedDl.__hardened = true;
    window.downloadStandaloneHTML = wrappedDl;
  }

  refreshAiHistoryBtn();
})();
