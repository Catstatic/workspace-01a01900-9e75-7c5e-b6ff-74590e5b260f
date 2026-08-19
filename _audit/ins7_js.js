/* ============================================================
   AI IMAGE ATTACH (transfer of readAiImage / readReviewImage)
   User-picked diagram/question/attempt photos for AI doubt
   chats. Images stay client-side until the user sends a
   message; oversized images are downscaled to keep provider
   payloads sane; nothing is stored or uploaded otherwise.
   ============================================================ */
(function(){
  const MAX_DIM = 1568, MAX_BYTES = 900 * 1024;

  function fmtBytes(n){ return n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB'; }

  /* Downscale when a canvas is available; otherwise pass through.
     If the host can't decode images at all, fail open after a beat. */
  function maybeDownscale(dataUrl, cb){
    let done = false;
    const finish = url => { if(!done){ done = true; cb(url); } };
    setTimeout(() => finish(dataUrl), 1500);
    try{
      const img = new Image();
      img.onload = () => {
        try{
          const w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
          const big = Math.max(w, h);
          if(big <= MAX_DIM && dataUrl.length <= MAX_BYTES * 1.37) return finish(dataUrl);
          const scale = MAX_DIM / big;
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(w * scale);
          canvas.height = Math.round(h * scale);
          const ctx = canvas.getContext('2d');
          if(!ctx) return finish(dataUrl);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const out = canvas.toDataURL('image/jpeg', 0.86);
          finish(out && out.startsWith('data:image') ? out : dataUrl);
        }catch(e){ finish(dataUrl); }
      };
      img.onerror = () => finish(dataUrl);
      img.src = dataUrl;
    }catch(e){ finish(dataUrl); }
  }

  /* Wire an attach control set onto a chat panel/card.
     Returns nothing; hostEl gains _imageData staging + stage UI. */
  function wireAttach(hostEl, rowEl){
    if(!hostEl || !rowEl || rowEl.querySelector('.ai-img-attach-btn')) return;
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*'; input.hidden = true;
    input.setAttribute('aria-label', 'Attach an image for the AI');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cai-btn ai-img-attach-btn';
    btn.title = 'Attach a question photo / diagram / your handwritten attempt (sent only with your next message)';
    btn.textContent = '📎 IMAGE';
    const stage = document.createElement('div');
    stage.className = 'ai-img-stage';
    stage.innerHTML = '<img class="ai-img-thumb" alt="Attached image preview"><span class="ai-img-meta"></span><button type="button" class="ai-img-clear">REMOVE</button>';
    const meta = stage.querySelector('.ai-img-meta');
    const thumb = stage.querySelector('.ai-img-thumb');
    rowEl.parentNode.insertBefore(stage, rowEl);
    rowEl.insertBefore(input, rowEl.firstChild);
    rowEl.insertBefore(btn, rowEl.firstChild);
    btn.addEventListener('click', () => input.click());
    stage.querySelector('.ai-img-clear').addEventListener('click', () => {
      hostEl._imageData = '';
      input.value = '';
      stage.classList.remove('on');
    });
    input.addEventListener('change', () => {
      const file = input.files && input.files[0];
      if(!file) return;
      if(!/^image\//.test(file.type)){ if(typeof showToast === 'function') showToast('Pick an image file (PNG/JPG/…).'); input.value=''; return; }
      const reader = new FileReader();
      reader.onload = () => {
        maybeDownscale(String(reader.result || ''), finalUrl => {
          if(!/^data:image\//.test(finalUrl)){ if(typeof showToast === 'function') showToast('Could not read that image.'); return; }
          hostEl._imageData = finalUrl;
          thumb.src = finalUrl;
          meta.textContent = file.name + ' · ' + fmtBytes(Math.round(finalUrl.length * 0.75)) + ' · goes with your NEXT message only';
          stage.classList.add('on');
        });
      };
      reader.onerror = () => { if(typeof showToast === 'function') showToast('Could not read that image.'); };
      reader.readAsDataURL(file);
    });
  }

  /* Consume a staged image for an outgoing message and clear the stage. */
  function takeStaged(hostEl){
    const url = hostEl && hostEl._imageData ? hostEl._imageData : '';
    if(hostEl){
      hostEl._imageData = '';
      const stage = hostEl.querySelector ? hostEl.querySelector('.ai-img-stage') : null;
      if(stage) stage.classList.remove('on');
      const input = hostEl.querySelector ? hostEl.querySelector('input[type="file"]') : null;
      if(input) input.value = '';
    }
    return url;
  }

  window.AiImage = {wire: wireAttach, take: takeStaged, limit: MAX_DIM};
})();
