// Single elastic tech-mesh network covering the hero, warping around the mouse
(function(){
  const canvas = document.getElementById('flow-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const hero = document.querySelector('.hero');
  let w, h, dpr = Math.min(window.devicePixelRatio || 1, 2);
  let mouse = { x:-9999, y:-9999 };
  let nodes = [], cols, rows, spacing;

  function buildGrid(){
    spacing = w < 700 ? 68 : 86;
    cols = Math.ceil(w/spacing)+2;
    rows = Math.ceil(h/spacing)+2;
    nodes = [];
    for(let r=0;r<rows;r++){
      for(let c=0;c<cols;c++){
        const bx = c*spacing - spacing/2 + (r%2? spacing/2:0);
        const by = r*spacing - spacing/2;
        nodes.push({ bx, by, x:bx, y:by, vx:0, vy:0, r, c });
      }
    }
  }
  function idx(r,c){ return r*cols+c; }

  function resize(){
    w = hero.offsetWidth; h = hero.offsetHeight;
    canvas.width = w*dpr; canvas.height = h*dpr;
    canvas.style.width = w+'px'; canvas.style.height = h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    buildGrid();
  }
  resize();
  window.addEventListener('resize', resize);
  hero.addEventListener('mousemove', (e)=>{
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
  });
  hero.addEventListener('mouseleave', ()=>{ mouse.x=-9999; mouse.y=-9999; });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const RADIUS = 190, REPEL = 0.9, SPRING = 0.06, DAMP = 0.86;

  function step(t){
    ctx.clearRect(0,0,w,h);

    nodes.forEach(n=>{
      const dx = n.x - mouse.x, dy = n.y - mouse.y;
      const dist = Math.sqrt(dx*dx+dy*dy);
      if(dist < RADIUS){
        const force = (1 - dist/RADIUS) * REPEL;
        n.vx += (dx/(dist||1)) * force * 6;
        n.vy += (dy/(dist||1)) * force * 6;
      }
      n.vx += (n.bx - n.x) * SPRING;
      n.vy += (n.by - n.y) * SPRING;
      n.vx *= DAMP; n.vy *= DAMP;
      n.x += n.vx; n.y += n.vy;
    });

    // connective mesh lines: horizontal, vertical, one diagonal per cell
    ctx.lineWidth = 1;
    for(let r=0;r<rows;r++){
      for(let c=0;c<cols;c++){
        const n = nodes[idx(r,c)];
        const right = c<cols-1 ? nodes[idx(r,c+1)] : null;
        const down = r<rows-1 ? nodes[idx(r+1,c)] : null;
        const diag = (r<rows-1 && c<cols-1) ? nodes[idx(r+1,c+1)] : null;
        [right, down, diag].forEach(other=>{
          if(!other) return;
          const dNear = Math.min(
            Math.hypot(n.x-mouse.x, n.y-mouse.y),
            Math.hypot(other.x-mouse.x, other.y-mouse.y)
          );
          const glow = Math.max(0, 1 - dNear/RADIUS);
          const alpha = 0.05 + glow*0.35;
          const useGold = glow > 0.15;
          ctx.strokeStyle = useGold ? `rgba(176,141,87,${alpha})` : `rgba(92,138,118,${alpha})`;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y); ctx.lineTo(other.x, other.y);
          ctx.stroke();
        });
      }
    }
    // nodes
    nodes.forEach(n=>{
      const dist = Math.hypot(n.x-mouse.x, n.y-mouse.y);
      const glow = Math.max(0, 1 - dist/RADIUS);
      const size = 1.1 + glow*2.2;
      ctx.beginPath();
      ctx.arc(n.x, n.y, size, 0, Math.PI*2);
      ctx.fillStyle = glow>0.15 ? `rgba(220,199,146,${0.4+glow*0.6})` : `rgba(92,138,118,${0.25+glow*0.4})`;
      ctx.fill();
    });

    requestAnimationFrame(step);
  }
  if(!reduceMotion) requestAnimationFrame(step);
})();

// scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach((e,idx)=>{
    if(e.isIntersecting){
      setTimeout(()=>e.target.classList.add('in'), (idx%4)*70);
      io.unobserve(e.target);
    }
  });
},{threshold:0.12});
revealEls.forEach(el=>io.observe(el));

// faq accordion
document.querySelectorAll('.faq-item').forEach(item=>{
  item.addEventListener('click',()=>{
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
    if(!wasOpen) item.classList.add('open');
  });
});
