// ===== LOCK SCREEN =====
(function () {
  const PASSCODE = '0505';
  const lockScreen  = document.getElementById('lock-screen');
  const lockBox     = document.getElementById('lock-box');
  const lockInput   = document.getElementById('passcode-input');
  const lockBtn     = document.getElementById('lock-btn');
  const lockError   = document.getElementById('lock-error');
  const lockHearts  = document.getElementById('lock-floating-hearts');
  const lockStars   = document.getElementById('lock-stars');

  // ── Generate stars on lock background ──
  (function buildStars() {
    let bg = '';
    for (let i = 0; i < 100; i++) {
      const x  = (Math.random() * 100).toFixed(1);
      const y  = (Math.random() * 100).toFixed(1);
      const sz = (0.5 + Math.random() * 1.8).toFixed(1);
      const palette = [
        'rgba(255,255,255,0.85)',
        'rgba(244,114,182,0.7)',
        'rgba(251,191,36,0.7)',
        'rgba(192,132,252,0.65)'
      ];
      const c = palette[Math.floor(Math.random() * palette.length)];
      bg += `radial-gradient(${sz}px ${sz}px at ${x}% ${y}%, ${c} 0%, transparent 100%),`;
    }
    lockStars.style.backgroundImage = bg.slice(0, -1);
  })();

  // ── Ambient hearts on lock screen ──
  const lockHeartSymbols = ['❤️','💕','💗','💖','💝','🌸'];
  function spawnLockHeart() {
    const h = document.createElement('div');
    h.style.cssText = `
      position:absolute;
      bottom:-40px;
      left:${Math.random() * 100}%;
      font-size:${0.7 + Math.random() * 1}rem;
      opacity:0.6;
      animation:floatUp ${5 + Math.random() * 5}s linear forwards;
      pointer-events:none;
    `;
    h.textContent = lockHeartSymbols[Math.floor(Math.random() * lockHeartSymbols.length)];
    lockHearts.appendChild(h);
    setTimeout(() => h.remove(), 10000);
  }
  setInterval(spawnLockHeart, 1200);

  // ── Validate passcode ──
  function tryUnlock() {
    const val = lockInput.value.trim();

    if (val === PASSCODE) {
      // Success
      lockBox.classList.remove('shake');
      lockBox.classList.add('success');
      lockError.classList.remove('visible');

      // Burst of hearts then fade out
      for (let i = 0; i < 20; i++) setTimeout(spawnLockHeart, i * 60);

      setTimeout(() => {
        lockScreen.classList.add('unlocking');
        setTimeout(() => {
          lockScreen.style.display = 'none';
          document.body.style.overflow = '';
        }, 850);
      }, 600);

    } else {
      // Wrong passcode
      lockInput.value = '';
      lockError.classList.add('visible');
      lockBox.classList.remove('shake');
      // Force reflow to restart animation
      void lockBox.offsetWidth;
      lockBox.classList.add('shake');
      lockInput.focus();

      // Hide error after 3 seconds
      setTimeout(() => lockError.classList.remove('visible'), 3000);
    }
  }

  lockBtn.addEventListener('click', tryUnlock);
  lockInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') tryUnlock();
    // Only allow digits
    if (!/^\d$/.test(e.key) && !['Backspace','Tab','ArrowLeft','ArrowRight','Delete'].includes(e.key)) {
      e.preventDefault();
    }
  });

  // Focus input on load
  window.addEventListener('DOMContentLoaded', () => {
    document.body.style.overflow = 'hidden';
    setTimeout(() => lockInput.focus(), 800);
  });
})();
