/* ============================================================
   ROUND 23 — CTRL+G THEME GAME SHORTCUT
   Global hotkey for the break/theme game: Ctrl+G (or Cmd+G) toggles
   it exactly like pressing the ♞ BREAK GAME button — by clicking the
   real button, so the base handler (open/close, mode pick, timers)
   stays the single source of truth. Advertised on the button title.
   ============================================================ */
(function(){
'use strict';
if(typeof document==='undefined'||!document.addEventListener)return;
function toggleThemeGame(){
  var btn=document.getElementById('gameToggleBtn'); /* base handler owns open/close */
  if(!btn)return;
  btn.click();
}
document.addEventListener('keydown',function(e){
  var k=(e.key||'').toLowerCase();
  if((e.ctrlKey||e.metaKey)&&k==='g'&&!e.altKey&&!e.shiftKey){
    e.preventDefault(); /* beat the browser's find-next */
    toggleThemeGame();
  }
},true);
/* advertise the hotkey on the launcher tooltip */
function advertise(){
  var btn=document.getElementById('gameToggleBtn');
  if(btn&&btn.title&&btn.title.indexOf('Ctrl+G')<0)btn.title=btn.title+' · Ctrl+G';
}
try{advertise();}catch(e){}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',advertise);
window.__hotkeyG={toggle:toggleThemeGame};
})();
