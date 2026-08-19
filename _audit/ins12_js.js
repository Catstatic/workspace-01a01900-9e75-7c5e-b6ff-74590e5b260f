/* ============================================================
   ROUND 13 — BOOT COMMAND CENTER
   On startup the tracker greets you with a full-screen command
   deck: the LIVE Daily Command Center card is temporarily mounted
   into the overlay (all its buttons and the 60s auto-refresh keep
   working — it goes back to the dashboard untouched when you close),
   plus a "FOOD FOR THOUGHT" quote bank — 64 original lines, a
   deterministic pick of the day, and a shuffle for a fresh pull.
   Pure presentation: no official data is read or written.
   ROUND 22 ADOPT: the overlay now also ships as static document markup
   (ins22_html, first element of the body) so the command deck paints with
   the very first frame; show() adopts that node instead of building late.
   ============================================================ */
(function(){
  const QUOTES=[
    "Momentum is just consistency wearing a lab coat.",
    "Entropy always rises; log your hours before the room cools.",
    "A wavefunction collapses under observation. So does an excuse.",
    "Escape velocity is one honest hour, repeated without mercy.",
    "Friction opposes every motion — rename your resistance and push anyway.",
    "Superposition is not a revision plan. Collapse into one problem.",
    "Light never waits for permission from the medium. Neither should you.",
    "Potential energy means nothing until released. Open the book.",
    "Every physicist was once a student who refused to skip the derivation.",
    "Photons do not negotiate. Deadlines should not either.",
    "The ground state is no place to aim. Absorb some ambition.",
    "Inertia is the default orbit; thrust is a decision.",
    "Motivation visits with the weather; discipline shows up in all seasons.",
    "You do not rise to your ambition; you fall to your routine.",
    "Small reps, loud results. The log never lies.",
    "Boredom is the price of mastery. Pay it daily.",
    "The plan you half-follow beats the perfect plan you only admire.",
    "Do the ugly problem first; the day tastes better after.",
    "Your future self is watching today's replay. Make it worth the footage.",
    "Consistency is compound interest no market can crash.",
    "Stop auditioning for motivation; you are already hired.",
    "Willpower is a muscle — today's session is the leg day.",
    "Nobody suddenly becomes ready. They become tired of not being ready.",
    "Discipline is remembering what you want most when you want it least.",
    "Ranks are minted on ordinary Tuesdays, not on result day.",
    "The paper checks what you practiced, not what you intended.",
    "PYQs are messages from every examiner who came before. Read them twice.",
    "Fear the comfortable chapter; it hides the question you will miss.",
    "One mock reviewed deeply beats five mocks glanced at.",
    "Negative marks are tuition paid to haste. Study with brakes.",
    "Speed is accuracy that has practiced; accuracy is speed that has thought.",
    "You are not competing with lakhs; you are negotiating with yesterday.",
    "A solved problem teaches once; an unsolved one teaches until you listen.",
    "Results are lag indicators. Your hours are the lead indicator.",
    "The White Room raises products; you are building an original.",
    "Every protagonist was average in episode one. Train in today's episode.",
    "Power-ups are montages of very boring mornings.",
    "The rival you keep losing to gets weaker every hour you refuse to quit.",
    "Awakenings happen at the edge of surrender — arrive there prepared.",
    "Even the chosen one had to study the scrolls first.",
    "Your arc does not need an audience. It needs reps.",
    "Shadows grow wherever light is aimed with focus.",
    "Be the plot twist in your own slow-burn season.",
    "Episode one hundred starts today; the animation budget is your time.",
    "Breathe in four counts; even gamma rays obey a frequency.",
    "The fog clears for the observer who stays still long enough.",
    "Rest is not retreat; it is reloading with intent.",
    "A quiet desk hears more than a loud mind.",
    "Worry is interest paid on a debt not yet owed.",
    "Still water solves reflections first. Sit with the problem.",
    "The clock is only loud when the mind is empty of work.",
    "Patience is speed wearing a slower mask.",
    "You cannot fail a day you fully showed up for.",
    "Silence the feed; the formula you need is already in the book.",
    "You are the experiment and the scientist — write honest lab notes.",
    "Certainty is expensive; pay for it with verification.",
    "The map of the syllabus is not the territory of the exam.",
    "Every expert answer was once a naive question somebody kept.",
    "Curiosity compounds faster than fear.",
    "A year from now you will simply be older — or older and qualified.",
    "Greatness is heavy; lift it in sets.",
    "The universe keeps no attendance, but it audits effort precisely.",
    "Between the stimulus and the result sits a chapter. Read it.",
    "When it gets hard, congratulations — you found the real exam."
  ];
  const SKIP_KEY="csir_boot_skip_v1";
  function todayKey(){const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
  function dayIndexFor(d){const n=Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/86400000);return ((n%QUOTES.length)+QUOTES.length)%QUOTES.length;}
  const dayIndex=()=>dayIndexFor(new Date());
  function readSkip(){try{return localStorage.getItem(SKIP_KEY)||"";}catch(e){return "";}}
  function writeSkip(){try{localStorage.setItem(SKIP_KEY,todayKey());}catch(e){}}
  function shouldShow(skipVal,today){return skipVal!==today;}
  let placeholder=null,lastRandom=-1,escHandler=null;

  function setQuote(el,text){
    if(!el)return;
    el.classList.remove("boot-swap");void el.offsetWidth;el.textContent="\u201C"+text+"\u201D";el.classList.add("boot-swap");
  }
  function anotherQuote(el){
    let i,tries=0;
    do{i=Math.floor(Math.random()*QUOTES.length);tries++;}while((i===lastRandom||i===dayIndex())&&tries<24);
    lastRandom=i;setQuote(el,QUOTES[i]);
  }
  function show(force){
    if(force!==true&&!shouldShow(readSkip(),todayKey()))return;
    if(typeof document==="undefined"||!document.body)return;
    const dateStr=new Date().toLocaleDateString([], {weekday:"long",day:"numeric",month:"long",year:"numeric"}).toUpperCase();
    let ov=document.getElementById("bootCenterOverlay");          /* ROUND 22 ADOPT: static overlay ships in the markup, first frame */
    if(ov&&ov.__bootWired)return;                                 /* already live */
    if(!ov){ov=document.createElement("div");
    ov.id="bootCenterOverlay";ov.className="boot-overlay";ov.setAttribute("role","dialog");ov.setAttribute("aria-modal","true");ov.setAttribute("aria-label","Boot command center");
    ov.innerHTML=
      '<div class="boot-shell"><div class="boot-card">'+
        '<div class="boot-head"><div><div class="boot-eyebrow">BOOT SEQUENCE // DAILY COMMAND CENTER</div>'+
        '<div class="boot-title">COMMAND DECK ONLINE</div><div class="boot-date" id="bootDate">'+dateStr+' · SHIFT BEGINS</div></div>'+
        '<button class="boot-close" id="bootClose" aria-label="Close command deck">\u00D7</button></div>'+
        '<div class="boot-quote"><div class="boot-quote-label"><span>FOOD FOR THOUGHT</span><button class="boot-quote-another" id="bootAnother">\u21BB ANOTHER</button></div>'+
        '<div class="boot-quote-text" id="bootQuoteText"></div></div>'+
        '<div class="boot-cc-slot" id="bootCcSlot"></div>'+
        '<div class="boot-actions"><button class="boot-enter" id="bootEnter">ENTER THE LAB \u2192</button>'+
        '<label class="boot-skip"><input type="checkbox" id="bootSkipToday"> SKIP TODAY\u2019S GREETING</label></div>'+
        '<div class="boot-foot">ESC / CLICK OUTSIDE TO DISMISS · THE COMMAND CENTER LIVES IN YOUR DASHBOARD · THIS CARD IS THE LIVE ONE, NOT A COPY</div>'+
      '</div></div>';
    document.body.appendChild(ov);}else{
      ov.style.display="";                                      /* undo the guardian’s instant skip-hide */
      const dEl=ov.querySelector("#bootDate");if(dEl)dEl.textContent=dateStr+" \u00B7 SHIFT BEGINS";
    }
    document.body.classList.add("boot-open");
    const qEl=ov.querySelector("#bootQuoteText");
    qEl.textContent="\u201C"+QUOTES[dayIndex()]+"\u201D";
    /* mount the LIVE daily command center card (put back on close) */
    const slot=ov.querySelector("#bootCcSlot");
    if(slot)slot.innerHTML="";                                   /* drop the static shimmer */
    const card=document.getElementById("commandCenterCard");
    if(card&&card.parentNode){
      placeholder=document.createComment("boot-cc-home");
      card.parentNode.insertBefore(placeholder,card);
      slot.appendChild(card);
    }else{
      const fb=document.createElement("div");fb.className="boot-cc-fallback";
      fb.textContent="COMMAND CORE OFFLINE — the dashboard carries the triage when it comes online.";
      slot.replaceWith(fb);
    }
    const hide=()=>hideOverlay();
    ov.querySelector("#bootClose").addEventListener("click",hide);
    ov.querySelector("#bootEnter").addEventListener("click",hide);
    ov.querySelector("#bootAnother").addEventListener("click",()=>anotherQuote(qEl));
    ov.addEventListener("click",e=>{if(e.target===ov)hide();});
    escHandler=e=>{if(e.key==="Escape")hide();};
    document.addEventListener("keydown",escHandler);
    ov.__bootWired=true;
    const enterBtn=ov.querySelector("#bootEnter");
    if(enterBtn&&typeof enterBtn.focus==="function")try{enterBtn.focus();}catch(e){}
  }
  function hideOverlay(){
    if(typeof document==="undefined")return;
    const ov=document.getElementById("bootCenterOverlay");
    if(!ov)return;
    const skip=ov.querySelector("#bootSkipToday");
    if(skip&&skip.checked)writeSkip();
    const card=ov.querySelector("#commandCenterCard");
    if(card&&placeholder&&placeholder.parentNode)placeholder.parentNode.insertBefore(card,placeholder);
    if(placeholder&&placeholder.parentNode)placeholder.parentNode.removeChild(placeholder);
    placeholder=null;
    if(escHandler){document.removeEventListener("keydown",escHandler);escHandler=null;}
    document.body.classList.remove("boot-open");
    ov.parentNode.removeChild(ov);
  }
  function boot(){
    try{show(false);}catch(e){/* never block the tracker on a greeting */}
  }
  if(typeof document!=="undefined"){
    if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
  }
  window.__bootCenter={show:()=>show(true),hide:hideOverlay,quoteForDay:d=>QUOTES[dayIndexFor(d)],_quotes:QUOTES,_dayIndex:dayIndex,_shouldShow:shouldShow,_skipKey:SKIP_KEY};
})();
