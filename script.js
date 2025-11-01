
// script.js - simple interactivity, WebAudio melody and lightbox
(function(){
  // Lightbox
  document.querySelectorAll('.photo img').forEach(img=>{
    img.addEventListener('click',e=>{
      showLightbox(e.target.src);
    });
  });
})();
function showLightbox(src){
  const lb = document.getElementById('lightbox');
  const im = document.getElementById('lightboxImg');
  im.src = src; lb.classList.remove('hidden');
}
function hideLightbox(){ document.getElementById('lightbox').classList.add('hidden') }

// WebAudio: simple melody loop (no external audio)
let audioCtx, gainNode, isPlaying=false;
const playBtn = document.getElementById('playBtn');
const stopBtn = document.getElementById('stopBtn');

playBtn?.addEventListener('click', ()=>{
  if(!isPlaying) startTune();
});
stopBtn?.addEventListener('click', ()=>{
  stopTune();
});

function startTune(){
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  gainNode = gainNode || audioCtx.createGain();
  gainNode.gain.value = 0.08;
  gainNode.connect(audioCtx.destination);
  // create a little arpeggio using oscillators
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  let t = audioCtx.currentTime;
  const now = t;
  for(let i=0;i<8;i++){
    const o = audioCtx.createOscillator();
    o.type = 'sine';
    o.frequency.value = notes[i%notes.length];
    o.connect(gainNode);
    o.start(now + i*0.25);
    o.stop(now + i*0.25 + 0.22);
  }
  isPlaying = true;
  // small timer to allow quiet loop by replaying
  window.tuneTimer = setInterval(()=>{ if(audioCtx) startTune(); }, 2000);
}

function stopTune(){
  if(window.tuneTimer) clearInterval(window.tuneTimer);
  if(audioCtx && audioCtx.state!=='closed'){ audioCtx.close(); }
  audioCtx = null; gainNode = null; isPlaying=false;
}

// Canvas background animation
const canvas = document.getElementById('bg');
if(canvas){
  const ctx = canvas.getContext('2d');
  function resize(){ canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
  resize(); window.addEventListener('resize', resize);
  const stars = Array.from({length:90}).map(()=>({x:Math.random(),y:Math.random(),r:Math.random()*1.2}));
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // gradient
    const g = ctx.createLinearGradient(0,0,0,canvas.height);
    g.addColorStop(0,'#09203f'); g.addColorStop(1,'#0f1724');
    ctx.fillStyle = g; ctx.fillRect(0,0,canvas.width,canvas.height);
    // stars
    ctx.fillStyle = '#fff';
    stars.forEach(s=>{
      s.y += 0.0008;
      if(s.y>1) s.y = 0;
      ctx.globalAlpha = 0.6 * (0.3 + s.r/1.2);
      ctx.beginPath(); ctx.arc(s.x*canvas.width, s.y*canvas.height, s.r,0,Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
}
