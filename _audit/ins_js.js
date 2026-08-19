/* ============================================================
   AI FOUNDATION — provider-agnostic settings, adapters & validation
   Step 1: settings panel, provider/format registry, config validation,
   connection test. The shared request engine (callAi) lands in Step 2
   and consumes window.AiFoundation.
   Storage: AI settings live in their own localStorage key, outside the
   main tracker state, so Download Backup NEVER includes the API key.
   ============================================================ */
const AI_SETTINGS_KEY = 'csirnet_ai_settings_v1';

const AI_FORMATS = {
  'openai-chat':      {label:'OpenAI Chat Completions'},
  'openai-responses': {label:'OpenAI Responses API'},
  'gemini':           {label:'Gemini Generative Language'},
  'anthropic':        {label:'Anthropic Messages'},
  'openai-compatible':{label:'OpenAI-compatible'},
  'custom':           {label:'Custom'}
};

/* models[] are SUGGESTIONS (verified 2026-08) — the Model field stays free-text, so any model id your provider supports works.
   tags/defaultTag mark free vs paid picks; prefer "free tier"/"free" options if you have no paid plan. Providers marked "paid" have no free API tier. */
const AI_PROVIDERS = {
  openai:      {label:'OpenAI (paid — no free tier)',   format:'openai-chat',       endpoint:'https://api.openai.com/v1/chat/completions',        models:['gpt-5.4-mini','gpt-5.4-nano','gpt-4.1-mini','gpt-5.4'],
    tags:{'gpt-5.4-mini':'paid · balanced pick','gpt-5.4-nano':'paid · cheapest','gpt-4.1-mini':'paid · older, stable','gpt-5.4':'paid · flagship'}, org:true,  headers:false},
  gemini:      {label:'Google Gemini (free tier)',      format:'gemini',            endpoint:'https://generativelanguage.googleapis.com/v1beta',  models:['gemini-3.6-flash','gemini-3.5-flash','gemini-3.5-flash-lite','gemini-3.1-flash-lite','gemini-3-flash-preview'],
    tags:{'gemini-3.6-flash':'free tier · newest — recommended','gemini-3.5-flash':'free tier · strongest flash','gemini-3.5-flash-lite':'free tier · fastest','gemini-3.1-flash-lite':'free tier · most quota-friendly','gemini-3-flash-preview':'free tier · preview'}, org:false, headers:false},
  anthropic:   {label:'Anthropic Claude (paid)',        format:'anthropic',         endpoint:'https://api.anthropic.com/v1/messages',             models:['claude-haiku-4-5','claude-sonnet-5','claude-opus-5'],
    tags:{'claude-haiku-4-5':'paid · cheapest','claude-sonnet-5':'paid · balanced','claude-opus-5':'paid · strongest'}, org:false, headers:false},
  openrouter:  {label:'OpenRouter (free :free models)', format:'openai-compatible', endpoint:'https://openrouter.ai/api/v1/chat/completions',     models:['meta-llama/llama-3.3-70b-instruct:free','openai/gpt-oss-120b:free','google/gemma-4-31b-it:free','qwen/qwen3-next-80b-a3b-instruct:free','deepseek/deepseek-r1:free','qwen/qwen3-coder:free','nvidia/nemotron-3-ultra-550b-a55b:free'],
    defaultTag:'free · roster rotates, check openrouter.ai/models', org:false, headers:false},
  groq:        {label:'Groq (free tier)',               format:'openai-compatible', endpoint:'https://api.groq.com/openai/v1/chat/completions',   models:['llama-3.3-70b-versatile','llama-3.1-8b-instant','openai/gpt-oss-120b','openai/gpt-oss-20b','moonshotai/kimi-k2-instruct','qwen/qwen3.6-27b','minimaxai/minimax-m2.7'],
    defaultTag:'free tier', org:false, headers:false},
  deepseek:    {label:'DeepSeek (pay-as-you-go)',       format:'openai-compatible', endpoint:'https://api.deepseek.com/chat/completions',         models:['deepseek-chat','deepseek-reasoner'],
    tags:{'deepseek-chat':'paid · very cheap · latest V-series','deepseek-reasoner':'paid · very cheap · latest R-series'}, org:false, headers:false},
  mistral:     {label:'Mistral (free experiment tier)', format:'openai-compatible', endpoint:'https://api.mistral.ai/v1/chat/completions',        models:['mistral-small-latest','mistral-medium-latest','magistral-small-latest','magistral-medium-latest','mistral-large-latest','devstral-small-latest'],
    defaultTag:'free tier · rate-limited', org:false, headers:false},
  together:    {label:'Together AI (paid, low cost)',   format:'openai-compatible', endpoint:'https://api.together.xyz/v1/chat/completions',      models:['meta-llama/Llama-3.3-70B-Instruct-Turbo','openai/gpt-oss-120b','Qwen/Qwen2.5-72B-Instruct-Turbo'],
    defaultTag:'paid · low cost', org:false, headers:false},
  compatible:  {label:'Other OpenAI-compatible',        format:'openai-compatible', endpoint:'',                                                 models:[], org:false, headers:true},
  custom:      {label:'Custom provider',                format:'custom',            endpoint:'',                                                 models:[], org:false, headers:true}
};

function aiDefaultSettings(){
  return {provider:'gemini', format:'gemini', endpoint:AI_PROVIDERS.gemini.endpoint, model:'', key:'', org:'', headers:'', temperature:0.2, maxTokens:4096, timeout:45};
}
/* Models providers have blocked or retired for current API keys → auto-fixed on load (with a notice). */
const AI_RETIRED_MODELS = {
  gemini:{'gemini-2.5-flash':'gemini-3.6-flash','gemini-2.5-flash-lite':'gemini-3.1-flash-lite','gemini-2.5-pro':'gemini-3.6-flash','gemini-2.0-flash':'gemini-3.6-flash','gemini-2.0-flash-lite':'gemini-3.1-flash-lite','gemini-1.5-flash':'gemini-3.6-flash','gemini-1.5-pro':'gemini-3.6-flash'}
};
function aiMigrateRetiredModel(cfg){
  const map = AI_RETIRED_MODELS[cfg.provider];
  if(map && map[cfg.model]){
    const from = cfg.model;
    cfg.model = map[from];
    try{ localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(cfg)); }catch(e){}
    const note = '✦ AI model auto-updated to ' + cfg.model + ' — Google retired ' + from + ' for new API keys. Change it anytime in ✦ AI Settings → Model.';
    setTimeout(function(){ try{ if(typeof showToast === 'function') showToast(note); else console.info('[AI]', note); }catch(e){} }, 1500);
  }
  return cfg;
}
function loadAiSettings(){
  try{
    const raw = localStorage.getItem(AI_SETTINGS_KEY);
    if(!raw) return aiDefaultSettings();
    return aiMigrateRetiredModel(Object.assign(aiDefaultSettings(), JSON.parse(raw)));
  }catch(e){ return aiDefaultSettings(); }
}
function validateAiConfig(cfg){
  const errors = [];
  const provider = AI_PROVIDERS[cfg.provider];
  if(!provider) errors.push('Pick a provider.');
  if(!AI_FORMATS[cfg.format]) errors.push('Pick an API format.');
  const endpoint = String(cfg.endpoint || '').trim();
  if(!endpoint){
    errors.push('Endpoint / base URL is required.');
  }else if(!/^https?:\/\//i.test(endpoint)){
    errors.push('Endpoint must start with https:// or http://.');
  }
  if(!String(cfg.model || '').trim()) errors.push('Model name is required.');
  if(!String(cfg.key || '').trim() && cfg.format !== 'custom') errors.push('API key is required for this provider.');
  if(cfg.headers && String(cfg.headers).trim()){
    try{
      const parsed = JSON.parse(cfg.headers);
      if(!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) errors.push('Extra headers must be a JSON object.');
    }catch(e){ errors.push('Extra headers are not valid JSON.'); }
  }
  const temp = Number(cfg.temperature);
  if(!Number.isFinite(temp) || temp < 0 || temp > 2) errors.push('Temperature must be between 0 and 2.');
  const maxTok = Number(cfg.maxTokens);
  if(!Number.isInteger(maxTok) || maxTok < 64 || maxTok > 128000) errors.push('Max output tokens must be an integer between 64 and 128000.');
  const timeout = Number(cfg.timeout);
  if(!Number.isFinite(timeout) || timeout < 5 || timeout > 180) errors.push('Timeout must be between 5 and 180 seconds.');
  return {ok: errors.length === 0, errors};
}

/* -------- test-connection request builders (no generation engine yet) -------- */
function aiModelsBaseUrl(endpoint){
  let base = String(endpoint || '').trim().replace(/\/+$/, '');
  base = base.replace(/\/chat\/completions$/i, '').replace(/\/responses$/i, '').replace(/\/messages$/i, '');
  return base;
}
function aiParseExtraHeaders(cfg){
  if(!cfg.headers || !String(cfg.headers).trim()) return {};
  try{ const h = JSON.parse(cfg.headers); return (h && typeof h === 'object' && !Array.isArray(h)) ? h : {}; }
  catch(e){ return {}; }
}
function aiAuthHeaders(cfg){
  const h = {};
  if(cfg.key) h['Authorization'] = 'Bearer ' + cfg.key;
  if(cfg.org && String(cfg.org).trim()) h['OpenAI-Organization'] = String(cfg.org).trim();
  return Object.assign(h, aiParseExtraHeaders(cfg));
}
function aiBuildTestRequest(cfg){
  const format = cfg.format;
  if(format === 'gemini'){
    const base = String(cfg.endpoint || '').replace(/\/+$/, '');
    return {url: base + '/models?key=' + encodeURIComponent(cfg.key), init:{method:'GET'}};
  }
  if(format === 'anthropic'){
    return {url: cfg.endpoint, init:{method:'POST',
      headers:Object.assign({'Content-Type':'application/json','x-api-key':cfg.key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'}, aiParseExtraHeaders(cfg)),
      body:JSON.stringify({model:cfg.model, max_tokens:1, messages:[{role:'user', content:'ping'}]})}};
  }
  if(format === 'openai-responses'){
    return {url: cfg.endpoint, init:{method:'POST',
      headers:Object.assign({'Content-Type':'application/json'}, aiAuthHeaders(cfg)),
      body:JSON.stringify({model:cfg.model, input:'ping', max_output_tokens:16, store:false})}};
  }
  /* openai-chat / openai-compatible / custom-with-openai-shape: cheap authenticated model-list ping */
  return {url: aiModelsBaseUrl(cfg.endpoint) + '/models', init:{method:'GET', headers:aiAuthHeaders(cfg)}};
}
function aiExtractErrorMessage(data, status, providerId){
  let msg = '';
  if(data && typeof data === 'object'){
    if(data.error && typeof data.error.message === 'string') msg = data.error.message;
    else if(typeof data.message === 'string') msg = data.message;
  }
  msg = String(msg || '').slice(0, 220);
  if(status === 401 || status === 403) return 'Authentication failed (HTTP ' + status + '). Check the API key and any organization field.' + (msg ? ' Provider said: ' + msg : '');
  if(status === 429) return 'Rate limit reached (HTTP 429). Wait a moment and try again.' + (msg ? ' Provider said: ' + msg : '');
  if(status === 404){
    const tip = (providerId === 'gemini')
      ? ' Fix: Google retires older models for newer API keys — open ✦ AI Settings → Model and pick a current one (e.g. gemini-3.6-flash, gemini-3.5-flash, gemini-3.5-flash-lite, gemini-3.1-flash-lite; all on the free tier).'
      : ' Fix: open ✦ AI Settings → Model — the suggestions list shows current models for this provider; you may also type any model id your provider supports.';
    return 'Endpoint or model not found (HTTP 404). Check the base URL and model name.' + (msg ? ' Provider said: ' + msg : '') + tip;
  }
  return 'Request failed (HTTP ' + status + ').' + (msg ? ' Provider said: ' + msg : '');
}
function aiSetConnState(state, msg){
  const dot = document.getElementById('aiConnDot');
  const out = document.getElementById('aiConnStatus');
  if(dot) dot.className = 'ai-conn-dot' + (state ? ' ' + state : '');
  if(out) out.textContent = msg;
}

/* -------- dialog wiring -------- */
let aiSettingsPreviousFocus = null;
function openAiSettings(){
  const shell = document.getElementById('aiSettingsShell');
  if(!shell) return;
  aiSettingsPreviousFocus = document.activeElement;
  const providerSel = document.getElementById('aiProvider');
  providerSel.innerHTML = Object.keys(AI_PROVIDERS).map(id =>
    '<option value="' + id + '">' + escapeHtml(AI_PROVIDERS[id].label) + '</option>').join('');
  const cfg = loadAiSettings();
  providerSel.value = AI_PROVIDERS[cfg.provider] ? cfg.provider : 'gemini';
  document.getElementById('aiApiFormat').value = cfg.format;
  document.getElementById('aiEndpoint').value = cfg.endpoint || '';
  document.getElementById('aiModel').value = cfg.model || '';
  document.getElementById('aiApiKey').value = cfg.key || '';
  document.getElementById('aiOrg').value = cfg.org || '';
  document.getElementById('aiHeaders').value = cfg.headers || '';
  document.getElementById('aiTemperature').value = cfg.temperature;
  document.getElementById('aiMaxTokens').value = cfg.maxTokens;
  document.getElementById('aiTimeout').value = cfg.timeout;
  aiRefreshProviderUi(false);
  aiSetConnState('', cfg.key ? 'Saved settings loaded — not tested this session.' : 'Not configured yet. Pick a provider and paste an API key.');
  shell.classList.add('active');
  shell.addEventListener('keydown', aiSettingsKeyTrap);
  const keyField = document.getElementById('aiApiKey');
  if(keyField) keyField.focus();
}
function closeAiSettings(){
  const shell = document.getElementById('aiSettingsShell');
  if(!shell) return;
  shell.classList.remove('active');
  shell.removeEventListener('keydown', aiSettingsKeyTrap);
  if(aiSettingsPreviousFocus && aiSettingsPreviousFocus.focus) aiSettingsPreviousFocus.focus();
}
function aiSettingsKeyTrap(e){
  if(e.key === 'Escape'){ e.preventDefault(); closeAiSettings(); return; }
  if(e.key !== 'Tab') return;
  const card = document.querySelector('#aiSettingsShell .ai-settings-card');
  if(!card) return;
  const focusables = Array.from(card.querySelectorAll('button, input, select, textarea, summary, [tabindex]'))
    .filter(el => !el.disabled && el.offsetParent !== null);
  if(!focusables.length) return;
  const first = focusables[0], last = focusables[focusables.length - 1];
  if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
  else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
}
function aiRefreshProviderUi(keepModel){
  const providerId = document.getElementById('aiProvider').value;
  const provider = AI_PROVIDERS[providerId] || AI_PROVIDERS.gemini;
  const formatSel = document.getElementById('aiApiFormat');
  formatSel.value = provider.format;
  const endpointField = document.getElementById('aiEndpoint');
  if(!endpointField.value || aiIsKnownEndpoint(endpointField.value)) endpointField.value = provider.endpoint;
  const modelField = document.getElementById('aiModel');
  if(!keepModel) modelField.value = provider.models[0] || '';
  document.getElementById('aiModelSuggestions').innerHTML = provider.models
    .map(m => { const t = (provider.tags && provider.tags[m]) || provider.defaultTag || ''; return '<option value="' + escapeHtml(m) + '"' + (t ? ' label="' + escapeHtml(t) + '"' : '') + '></option>'; }).join('');
  document.getElementById('aiOrgRow').style.display = provider.org ? '' : 'none';
  document.getElementById('aiHeadersRow').style.display = (provider.headers || formatSel.value === 'custom') ? '' : 'none';
}
function aiIsKnownEndpoint(url){
  return Object.keys(AI_PROVIDERS).some(id => AI_PROVIDERS[id].endpoint && AI_PROVIDERS[id].endpoint === url);
}
function aiProviderChanged(){ aiRefreshProviderUi(false); aiSetConnState('', 'Not tested yet.'); }
function aiFormatChanged(){
  document.getElementById('aiHeadersRow').style.display =
    (document.getElementById('aiApiFormat').value === 'custom' || AI_PROVIDERS[document.getElementById('aiProvider').value].headers) ? '' : 'none';
  aiSetConnState('', 'Not tested yet.');
}
function aiToggleKeyVisibility(){
  const field = document.getElementById('aiApiKey');
  const btn = document.getElementById('aiKeyToggle');
  const show = field.type === 'password';
  field.type = show ? 'text' : 'password';
  btn.textContent = show ? 'HIDE' : 'SHOW';
}
function aiCollectForm(){
  return {
    provider: document.getElementById('aiProvider').value,
    format: document.getElementById('aiApiFormat').value,
    endpoint: document.getElementById('aiEndpoint').value.trim(),
    model: document.getElementById('aiModel').value.trim(),
    key: document.getElementById('aiApiKey').value.trim(),
    org: document.getElementById('aiOrg').value.trim(),
    headers: document.getElementById('aiHeaders').value.trim(),
    temperature: Number(document.getElementById('aiTemperature').value),
    maxTokens: Number(document.getElementById('aiMaxTokens').value),
    timeout: Number(document.getElementById('aiTimeout').value)
  };
}
function aiSaveSettings(silent){
  const cfg = aiCollectForm();
  const check = validateAiConfig(cfg);
  if(!check.ok){
    aiSetConnState('bad', check.errors[0]);
    showToast('AI settings need attention: ' + check.errors[0]);
    return false;
  }
  localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(cfg));
  aiSetConnState('ok', 'Settings saved locally on this device.');
  if(!silent){ showToast('AI settings saved locally'); closeAiSettings(); }
  return true;
}
function aiClearSettings(){
  localStorage.removeItem(AI_SETTINGS_KEY);
  ['aiApiKey','aiOrg','aiHeaders'].forEach(id => { const el = document.getElementById(id); if(el) el.value = ''; });
  const cfg = aiDefaultSettings();
  document.getElementById('aiProvider').value = 'gemini';
  aiRefreshProviderUi(false);
  document.getElementById('aiTemperature').value = cfg.temperature;
  document.getElementById('aiMaxTokens').value = cfg.maxTokens;
  document.getElementById('aiTimeout').value = cfg.timeout;
  aiSetConnState('', 'Settings cleared from this browser.');
  showToast('AI settings cleared');
}
async function aiTestConnection(){
  const cfg = aiCollectForm();
  const check = validateAiConfig(cfg);
  if(!check.ok){ aiSetConnState('bad', check.errors[0]); return; }
  if(cfg.format === 'custom'){
    aiSetConnState('ok', 'Configuration is valid. Fully custom formats are not pinged automatically — they will be exercised by your first AI request.');
    return;
  }
  const btn = document.getElementById('aiTestBtn');
  btn.disabled = true;
  aiSetConnState('busy', 'Contacting ' + (AI_PROVIDERS[cfg.provider].label) + '…');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), Math.min(Math.max(Number(cfg.timeout) || 45, 5), 180) * 1000);
  try{
    const req = aiBuildTestRequest(cfg);
    req.init.signal = controller.signal;
    const res = await fetch(req.url, req.init);
    const data = await res.json().catch(() => ({}));
    if(res.ok){
      aiSetConnState('ok', 'Connection OK — ' + AI_PROVIDERS[cfg.provider].label + ' accepted the credentials.');
    }else{
      aiSetConnState('bad', aiExtractErrorMessage(data, res.status, cfg.provider));
    }
  }catch(err){
    if(err && err.name === 'AbortError'){
      aiSetConnState('bad', 'Timed out after ' + cfg.timeout + 's. Check the endpoint URL or your network.');
    }else{
      aiSetConnState('bad', 'Network error: the endpoint could not be reached from this browser. This is usually a CORS policy on the provider side, an offline connection, or an ad-blocker. Nothing was proxied or retried elsewhere.');
    }
  }finally{
    clearTimeout(timer);
    btn.disabled = false;
  }
}
/* Shared handle for the Step 2 request engine. */
window.AiFoundation = {
  key: AI_SETTINGS_KEY,
  providers: AI_PROVIDERS,
  formats: AI_FORMATS,
  getConfig: loadAiSettings,
  validate: validateAiConfig,
  modelsBaseUrl: aiModelsBaseUrl,
  authHeaders: aiAuthHeaders,
  extraHeaders: aiParseExtraHeaders,
  extractError: aiExtractErrorMessage
};
