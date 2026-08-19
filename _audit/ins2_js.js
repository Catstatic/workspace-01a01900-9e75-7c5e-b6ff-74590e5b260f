/* ============================================================
   AI REQUEST ENGINE (Step 2) — provider adapters, normalized
   request/response, cancellation, timeout, safe retries.
   Consumes window.AiFoundation (Step 1). Never logs secrets;
   never sends tracker data unless a caller passes it explicitly.
   ============================================================ */
const AI_ENGINE_LIMITS = { hardChars: 60000, defaultContextChars: 16000, retries: 2 };
const AI_DEFAULT_SYSTEM_PROMPT = 'You are a careful CSIR-NET / GATE Physics tutor. Explain step by step, state your assumptions, check units and signs, and finish with a concise exam takeaway. You advise only — never invent or alter official answers, scores, or marking schemes; if a request would change official question data, refuse and explain.';

/* ---------- context length protection ---------- */
function aiCountMessagesChars(messages){
  return (messages || []).reduce((sum, m) => {
    if(typeof m.content === 'string') return sum + m.content.length;
    if(Array.isArray(m.content)) return sum + m.content.reduce((s, p) => s + (p && p.text ? p.text.length : 0), 0);
    return sum;
  }, 0);
}
function aiTruncateText(text, max){
  text = String(text || '');
  if(text.length <= max) return text;
  const head = Math.floor(max * 0.7);
  return text.slice(0, head) + '\n\n[… ' + (text.length - max) + ' characters omitted to fit the context budget …]\n\n' + text.slice(-(max - head));
}
function aiApplyContextBudget(messages, maxChars){
  if(!Array.isArray(messages)) return [];
  let total = aiCountMessagesChars(messages);
  if(total <= maxChars) return messages.slice();
  const out = messages.slice();
  /* oldest-first preservation: system + first user message kept, trim middle history first */
  let i = out.length > 2 ? 1 : 0;
  while(total > maxChars && out.length > 2 && i < out.length - 1){
    const removed = out.splice(i, 1)[0];
    total -= (typeof removed.content === 'string' ? removed.content.length : aiCountMessagesChars([removed]));
  }
  if(total > maxChars && out.length){
    const last = out[out.length - 1];
    const others = total - (typeof last.content === 'string' ? last.content.length : aiCountMessagesChars([last]));
    if(typeof last.content === 'string') last.content = aiTruncateText(last.content, Math.max(2000, maxChars - others));
    else if(Array.isArray(last.content)){
      const ti = last.content.findIndex(p => p && p.type === 'text');
      if(ti >= 0) last.content[ti] = Object.assign({}, last.content[ti], {text: aiTruncateText(last.content[ti].text, Math.max(2000, maxChars - others))});
    }
  }
  return out;
}

/* ---------- provider adapters: build -----------
   Common input: {cfg, messages, systemPrompt, temperature, maxTokens}
   messages: [{role:'user'|'assistant', content: string | parts[]}]
   parts[] item: {type:'text',text} | {type:'image', dataUrl}
------------------------------------------------ */
function aiToOpenAiContent(content){
  if(typeof content === 'string') return content;
  return content.map(p => p.type === 'image'
    ? {type:'image_url', image_url:{url: p.dataUrl}}
    : {type:'text', text: p.text || ''});
}
function aiToOpenAiMessages(req){
  const out = [];
  if(req.systemPrompt) out.push({role:'system', content:req.systemPrompt});
  req.messages.forEach(m => out.push({role: m.role === 'assistant' ? 'assistant' : 'user', content: aiToOpenAiContent(m.content)}));
  return out;
}
const AiAdapters = {
  'openai-chat': {
    build(req){
      return {url:req.cfg.endpoint, init:{method:'POST',
        headers:Object.assign({'Content-Type':'application/json'}, window.AiFoundation.authHeaders(req.cfg)),
        body:JSON.stringify({model:req.cfg.model, messages:aiToOpenAiMessages(req), temperature:req.temperature, max_tokens:req.maxTokens})}};
    },
    parse(data){
      const msg = data && data.choices && data.choices[0] && data.choices[0].message;
      return {text:(msg && typeof msg.content === 'string' ? msg.content : '') || '',
              usage:(data && data.usage) || null, finish:(data && data.choices && data.choices[0] && data.choices[0].finish_reason) || null};
    }
  },
  'openai-compatible': {
    build(req){ return AiAdapters['openai-chat'].build(req); },
    parse(data){ return AiAdapters['openai-chat'].parse(data); }
  },
  'openai-responses': {
    build(req){
      const input = [];
      req.messages.forEach(m => {
        const content = (typeof m.content === 'string' ? [{type:'input_text', text:m.content}] : m.content.map(p =>
          p.type === 'image' ? {type:'input_image', image_url:p.dataUrl} : {type:'input_text', text:p.text || ''}));
        input.push({role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.role === 'assistant' ? content.map(c => c.type === 'input_text' ? {type:'output_text', text:c.text} : c) : content});
      });
      const body = {model:req.cfg.model, input, max_output_tokens:req.maxTokens, store:false};
      if(req.systemPrompt) body.instructions = req.systemPrompt;
      if(req.cfg.model && !/\b(o\d|gpt-5|reasoning)/i.test(req.cfg.model)) body.temperature = req.temperature;
      return {url:req.cfg.endpoint, init:{method:'POST',
        headers:Object.assign({'Content-Type':'application/json'}, window.AiFoundation.authHeaders(req.cfg)),
        body:JSON.stringify(body)}};
    },
    parse(data){
      let text = '';
      if(data && typeof data.output_text === 'string') text = data.output_text;
      else if(data && Array.isArray(data.output)){
        data.output.forEach(item => { (item.content || []).forEach(c => { if(c.type === 'output_text' && c.text) text += c.text; }); });
      }
      return {text, usage:(data && data.usage) || null, finish:(data && data.status) || null};
    }
  },
  'gemini': {
    build(req){
      const base = String(req.cfg.endpoint || '').replace(/\/+$/, '');
      const url = base + '/models/' + encodeURIComponent(req.cfg.model) + ':generateContent?key=' + encodeURIComponent(req.cfg.key);
      const contents = req.messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: (typeof m.content === 'string' ? [{text:m.content}] : m.content.map(p =>
          p.type === 'image' ? {inline_data:{mime_type:(String(p.dataUrl).match(/^data:([^;]+)/) || [])[1] || 'image/png',
                                data:String(p.dataUrl).split(',')[1] || ''}} : {text:p.text || ''}))
      }));
      const body = {contents, generationConfig:{temperature:req.temperature, maxOutputTokens:req.maxTokens}};
      if(req.systemPrompt) body.systemInstruction = {parts:[{text:req.systemPrompt}]};
      return {url, init:{method:'POST', headers:Object.assign({'Content-Type':'application/json'}, window.AiFoundation.extraHeaders(req.cfg)), body:JSON.stringify(body)}};
    },
    parse(data){
      const parts = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts;
      const text = Array.isArray(parts) ? parts.map(p => p.text || '').join('') : '';
      const usage = data && data.usageMetadata ? {prompt_tokens:data.usageMetadata.promptTokenCount, completion_tokens:data.usageMetadata.candidatesTokenCount, total_tokens:data.usageMetadata.totalTokenCount} : null;
      return {text, usage, finish:(data && data.candidates && data.candidates[0] && data.candidates[0].finishReason) || null};
    }
  },
  'anthropic': {
    build(req){
      const messages = req.messages.map(m => ({role: m.role === 'assistant' ? 'assistant' : 'user',
        content: (typeof m.content === 'string' ? m.content : m.content.map(p =>
          p.type === 'image' ? {type:'image', source:{type:'base64',
            media_type:(String(p.dataUrl).match(/^data:([^;]+)/) || [])[1] || 'image/png',
            data:String(p.dataUrl).split(',')[1] || ''}} : {type:'text', text:p.text || ''}))}));
      const body = {model:req.cfg.model, max_tokens:req.maxTokens, messages};
      if(req.systemPrompt) body.system = req.systemPrompt;
      if(req.temperature != null) body.temperature = req.temperature;
      return {url:req.cfg.endpoint, init:{method:'POST',
        headers:Object.assign({'Content-Type':'application/json', 'x-api-key':req.cfg.key, 'anthropic-version':'2023-06-01', 'anthropic-dangerous-direct-browser-access':'true'}, window.AiFoundation.extraHeaders(req.cfg)),
        body:JSON.stringify(body)}};
    },
    parse(data){
      const text = data && Array.isArray(data.content) ? data.content.filter(b => b.type === 'text').map(b => b.text || '').join('') : '';
      return {text, usage:(data && data.usage) || null, finish:(data && data.stop_reason) || null};
    }
  },
  'custom': {
    build(req){
      /* Custom format: OpenAI-shaped request by default; extra headers/body configurable later. */
      return AiAdapters['openai-chat'].build(req);
    },
    parse(data){
      const shaped = AiAdapters['openai-chat'].parse(data);
      if(shaped.text) return shaped;
      /* last-resort normalization for near-compatible custom endpoints */
      const text = (data && (data.output_text || data.response || data.text || data.answer)) || '';
      return {text: typeof text === 'string' ? text : '', usage:null, finish:null};
    }
  }
};

/* ---------- error taxonomy ---------- */
class AiHttpError extends Error{
  constructor(status, message){ super(message); this.name = 'AiHttpError'; this.status = status; }
}
class AiAbortError extends Error{
  constructor(kind){ super(kind === 'cancelled' ? 'Request cancelled.' : 'Request timed out — try again or raise the timeout in AI Settings.'); this.name = 'AiAbortError'; this.kind = kind; }
}
function aiIsRetriable(err){
  if(err instanceof AiHttpError) return err.status === 408 || err.status === 409 || err.status === 425 || err.status === 429 || err.status >= 500;
  if(err instanceof AiAbortError) return err.kind === 'timeout';
  return err instanceof TypeError; /* fetch network failure — possibly transient */
}
function aiFriendlyNetworkError(err){
  if(err instanceof AiAbortError) return err;
  if(err instanceof AiHttpError) return err;
  if(err instanceof TypeError || /failed to fetch/i.test(String(err && err.message))){
    return new Error('Network error: the AI endpoint could not be reached from this browser. Usually a CORS policy on the provider side, an offline connection, or an ad-blocker blocking the call. No proxy was used. Check the endpoint in AI Settings, or try a provider that allows direct browser requests.');
  }
  return err instanceof Error ? err : new Error(String(err));
}
function aiAbortableSleep(ms, signal){
  return new Promise((res, rej) => {
    const t = setTimeout(() => { cleanup(); res(); }, ms);
    const onAbort = () => { clearTimeout(t); cleanup(); rej(new AiAbortError('cancelled')); };
    const cleanup = () => { if(signal) signal.removeEventListener('abort', onAbort); };
    if(signal){ if(signal.aborted){ clearTimeout(t); rej(new AiAbortError('cancelled')); } else signal.addEventListener('abort', onAbort); }
  });
}

/* ---------- single attempt ---------- */
async function aiAttempt(req, timeoutMs, externalSignal){
  const adapter = AiAdapters[req.cfg.format];
  const built = adapter.build(req);
  const controller = new AbortController();
  const onExternal = () => controller.abort('cancelled');
  if(externalSignal){
    if(externalSignal.aborted) throw new AiAbortError('cancelled');
    externalSignal.addEventListener('abort', onExternal);
  }
  const timer = setTimeout(() => controller.abort('timeout'), timeoutMs);
  try{
    const res = await fetch(built.url, Object.assign({}, built.init, {signal: controller.signal}));
    const data = await res.json().catch(() => ({}));
    if(!res.ok){
      if(res.status === 402) throw new AiHttpError(402, 'Provider needs payment/credits (HTTP 402). Top up your ' + (window.AiFoundation.providers[req.cfg.provider] || {}).label + ' account.');
      throw new AiHttpError(res.status, window.AiFoundation.extractError(data, res.status, req.cfg.provider));
    }
    const out = adapter.parse(data);
    if(!out.text && data && data.promptFeedback && data.promptFeedback.blockReason)
      throw new Error('The provider blocked this request (' + data.promptFeedback.blockReason + '). Try rephrasing or removing sensitive content.');
    return {
      text: String(out.text || '').trim() || '(The provider returned an empty response.)',
      usage: out.usage || null,
      finish: out.finish || null,
      provider: req.cfg.provider,
      model: req.cfg.model
    };
  }catch(err){
    if(controller.signal.aborted && !(err instanceof AiHttpError)){
      throw new AiAbortError(externalSignal && externalSignal.aborted ? 'cancelled' : 'timeout');
    }
    throw err;
  }finally{
    clearTimeout(timer);
    if(externalSignal) externalSignal.removeEventListener('abort', onExternal);
  }
}

/* ---------- public engine ----------
   callAi({prompt, context, image, messages, history, systemPrompt,
           temperature, maxTokens, timeout, signal, config, maxContextChars, retries})
   - prompt+context+image  → builds a single user message (old-style callers)
   - messages              → full control (new-style callers)
   - history               → [{role,text}] conversation prefix
   Resolves {text, usage, finish, provider, model}.
------------------------------------------------ */
async function callAi(options){
  const opts = options || {};
  /* Step-3+ convenience: accept legacy positional-style via AiEngine.ask */
  const cfg = opts.config || window.AiFoundation.getConfig();
  const providerLabel = (window.AiFoundation.providers[cfg.provider] || {label:cfg.provider}).label;
  if(!AiAdapters[cfg.format]) throw new Error('Unknown API format "' + cfg.format + '". Open AI Settings and pick a supported format.');
  const check = window.AiFoundation.validate(cfg);
  if(!check.ok){
    const err = new Error('AI is not fully configured: ' + check.errors[0] + ' Open the ✦ AI settings to fix it.');
    err.name = 'AiConfigError';
    throw err;
  }
  /* assemble messages */
  let messages = [];
  if(Array.isArray(opts.history)) opts.history.forEach(h => messages.push({role:h.role === 'assistant' ? 'assistant' : 'user', content:String(h.text != null ? h.text : h.content || '')}));
  if(Array.isArray(opts.messages)) messages = messages.concat(opts.messages);
  if(opts.prompt != null || opts.context != null){
    const parts = [];
    let text = '';
    if(opts.context){ text += 'Context:\n' + String(opts.context) + '\n\n'; }
    text += String(opts.prompt == null ? '' : opts.prompt);
    parts.push({type:'text', text});
    if(opts.image && /^data:image\//.test(String(opts.image))) parts.push({type:'image', dataUrl:String(opts.image)});
    messages.push({role:'user', content: parts.length > 1 ? parts : text});
  }
  if(!messages.length) throw new Error('Nothing to send — provide a prompt or messages.');
  const budget = Math.min(Math.max(Number(opts.maxContextChars) || AI_ENGINE_LIMITS.defaultContextChars, 2000), AI_ENGINE_LIMITS.hardChars);
  messages = aiApplyContextBudget(messages, budget);
  const req = {
    cfg,
    messages,
    systemPrompt: opts.systemPrompt || AI_DEFAULT_SYSTEM_PROMPT,
    temperature: opts.temperature != null ? Number(opts.temperature) : Number(cfg.temperature),
    maxTokens: Math.min(Math.max(Number(opts.maxTokens) || Number(cfg.maxTokens) || 4096, 64), 128000)
  };
  const timeoutMs = Math.min(Math.max(Number(opts.timeout) || Number(cfg.timeout) || 45, 5), 180) * 1000;
  const retries = opts.retries != null ? Math.max(0, Math.min(3, opts.retries)) : AI_ENGINE_LIMITS.retries;
  let attempt = 0, lastErr = null;
  while(attempt <= retries){
    if(opts.signal && opts.signal.aborted) throw new AiAbortError('cancelled');
    try{
      if(opts.onStatus) opts.onStatus(attempt === 0 ? 'Contacting ' + providerLabel + '…' : 'Retrying ' + providerLabel + ' (' + attempt + '/' + retries + ')…');
      return await aiAttempt(req, timeoutMs, opts.signal);
    }catch(err){
      lastErr = err;
      if(err instanceof AiAbortError && err.kind === 'cancelled') throw err;
      if(opts.signal && opts.signal.aborted) throw new AiAbortError('cancelled');
      if(!aiIsRetriable(err)) throw aiFriendlyNetworkError(err);
      attempt++;
      if(attempt > retries) break;
      if(opts.onStatus) opts.onStatus('Temporary failure — retrying in ' + (attempt * 2) + 's…');
      await aiAbortableSleep(attempt * 2000, opts.signal);
    }
  }
  throw aiFriendlyNetworkError(lastErr);
}

/* Convenience wrapper mirroring the old tracker signature:
   askAi(prompt, context, image, history, options) → string */
async function askAi(prompt, context, image, history, options){
  const res = await callAi(Object.assign({}, options || {}, {prompt, context, image, history}));
  return res.text;
}

window.AiEngine = {
  call: callAi,
  ask: askAi,
  adapters: AiAdapters,
  limits: AI_ENGINE_LIMITS,
  budget: aiApplyContextBudget,
  defaultSystemPrompt: AI_DEFAULT_SYSTEM_PROMPT
};
