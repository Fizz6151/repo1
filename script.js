document.addEventListener('DOMContentLoaded', () => {

  // Animate SVG income bars growing from 0
  const bars = document.querySelectorAll('.bar');
  if (bars.length) {
    const vals = document.querySelectorAll('.val');
    bars.forEach(b => { b.style.transition = 'height 1s cubic-bezier(.2,.8,.2,1), y 1s cubic-bezier(.2,.8,.2,1)'; });
    vals.forEach(v => { v.style.opacity = 0; v.style.transition = 'opacity .6s ease'; });

    const grow = () => {
      bars.forEach((bar, i) => {
        const h = parseFloat(bar.dataset.h);
        setTimeout(() => {
          bar.setAttribute('height', h);
          bar.setAttribute('y', 280 - h);
          if (vals[i]) setTimeout(() => vals[i].style.opacity = 1, 400);
        }, i * 140);
      });
    };

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { grow(); obs.disconnect(); } });
    }, { threshold: 0.3 });
    obs.observe(bars[0].closest('svg'));
  }

  // Reveal terminal / stat cards on scroll
  const revealTargets = document.querySelectorAll('.terminal, .stat-card, .about-panel, .feature-card, .phone-frame, .tg-copy, .id-card-outer');
  revealTargets.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
  });
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealTargets.forEach(el => revealObs.observe(el));

  // 3D skills carousel — drag to rotate, auto-spins when idle
  const ring = document.getElementById('skillsRing');
  if (ring) {
    let dragging = false, startX = 0, rotation = 0, startRotation = 0, autoSpin = true;

    const applyRotation = () => { ring.style.transform = `rotateY(${rotation}deg)`; };

    const down = (x) => { dragging = true; autoSpin = false; startX = x; startRotation = rotation; ring.classList.add('dragging'); };
    const move = (x) => { if (!dragging) return; rotation = startRotation + (x - startX) * 0.4; applyRotation(); };
    const up = () => { dragging = false; ring.classList.remove('dragging'); setTimeout(() => autoSpin = true, 2200); };

    ring.addEventListener('mousedown', e => down(e.clientX));
    window.addEventListener('mousemove', e => move(e.clientX));
    window.addEventListener('mouseup', up);

    ring.addEventListener('touchstart', e => down(e.touches[0].clientX), { passive: true });
    window.addEventListener('touchmove', e => { if (dragging) move(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchend', up);

    (function spin(){
      if (autoSpin) { rotation += 0.09; applyRotation(); }
      requestAnimationFrame(spin);
    })();
  }

});
