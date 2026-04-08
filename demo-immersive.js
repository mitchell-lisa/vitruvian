/* =============================================================
   VITRUVIAN — Immersive Demo Scripts
   View tab switching + Session walkthrough + Filmstrip player.
   ============================================================= */

/* === VIEW TAB SWITCHING === */
(function () {
  'use strict';

  var tabs = document.querySelectorAll('.view-tab');
  if (!tabs.length) return;

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = tab.getAttribute('data-view');

      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');

      var panels = document.querySelectorAll('.view-panel');
      panels.forEach(function (p) { p.classList.remove('active'); });

      var activePanel = document.getElementById('view-' + target);
      if (activePanel) activePanel.classList.add('active');
    });
  });
})();


/* === FILMSTRIP PLAYER === */
(function () {
  'use strict';

  var TOTAL_FRAMES = 10;
  var FRAME_INTERVAL = 600; // ms between frames — slow enough to feel like stop-motion
  var currentFrame = 0;
  var playing = false;
  var playTimer = null;

  var frameImg = document.getElementById('session-frame');
  var playBtn = document.getElementById('playBtn');
  var playBar = document.getElementById('playBar');
  var playLabel = document.getElementById('playLabel');
  if (!frameImg || !playBtn) return;

  // Preload all frames
  var framePaths = [];
  var preloaded = [];
  for (var i = 1; i <= TOTAL_FRAMES; i++) {
    var num = i < 10 ? '0' + i : '' + i;
    var path = 'images/frames/frame-' + num + '.png';
    framePaths.push(path);
    var img = new Image();
    img.src = path;
    preloaded.push(img);
  }

  function updateDisplay() {
    frameImg.src = framePaths[currentFrame];
    if (playBar) playBar.style.width = ((currentFrame + 1) / TOTAL_FRAMES * 100) + '%';
    if (playLabel) playLabel.textContent = 'Frame ' + (currentFrame + 1) + ' / ' + TOTAL_FRAMES;
  }

  function play() {
    playing = true;
    playBtn.classList.add('playing');
    playBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';

    playTimer = setInterval(function () {
      currentFrame++;
      if (currentFrame >= TOTAL_FRAMES) {
        // Loop: play forward then hold on last frame briefly, then restart
        currentFrame = 0;
      }
      updateDisplay();
    }, FRAME_INTERVAL);
  }

  function pause() {
    playing = false;
    playBtn.classList.remove('playing');
    playBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>';
    if (playTimer) { clearInterval(playTimer); playTimer = null; }
  }

  playBtn.addEventListener('click', function () {
    if (playing) {
      pause();
    } else {
      play();
    }
  });

  // Click on progress bar to scrub
  var progressTrack = playBar ? playBar.parentElement : null;
  if (progressTrack) {
    progressTrack.style.cursor = 'pointer';
    progressTrack.addEventListener('click', function (e) {
      var rect = progressTrack.getBoundingClientRect();
      var pct = (e.clientX - rect.left) / rect.width;
      currentFrame = Math.min(Math.floor(pct * TOTAL_FRAMES), TOTAL_FRAMES - 1);
      updateDisplay();
    });
  }

  updateDisplay();
})();


/* === SESSION WALKTHROUGH CONTROLLER === */
(function () {
  'use strict';

  var TOTAL_STEPS = 8;
  var currentStep = 0;
  var animInterval = null;

  var prevBtn = document.getElementById('sPrev');
  var nextBtn = document.getElementById('sNext');
  var dots = document.querySelectorAll('.session-dot');
  if (!prevBtn || !nextBtn || !dots.length) return;

  var forceEl = document.getElementById('s-force');
  var romEl = document.getElementById('s-rom');
  var holdEl = document.getElementById('s-hold');
  var gaugeFill = document.getElementById('s-gauge-fill');

  function clearAnim() {
    if (animInterval) { clearInterval(animInterval); animInterval = null; }
  }

  function updateDots(step) {
    dots.forEach(function (d) {
      var s = parseInt(d.getAttribute('data-step'), 10);
      d.classList.toggle('active', s <= step);
      d.classList.toggle('current', s === step);
    });
  }

  function updateButtons(step) {
    prevBtn.disabled = step === 0;
    nextBtn.textContent = step === 0 ? 'Start Session' : step === TOTAL_STEPS - 1 ? 'Reset' : 'Next';
  }

  function showStepContent(step) {
    for (var i = 0; i < TOTAL_STEPS; i++) {
      var panel = document.getElementById('sStep' + i);
      if (panel) panel.classList.toggle('active', i === step);
    }
  }

  function resetData() {
    if (forceEl) forceEl.textContent = '0.0 lb';
    if (romEl) romEl.textContent = '0\u00B0';
    if (holdEl) holdEl.textContent = '0s';
    if (gaugeFill) gaugeFill.style.width = '0%';
  }

  function applyStep(step) {
    resetData();

    // Step 4 — Stretch Execute: animate force/ROM numbers
    if (step === 4) {
      var tick = 0;
      var maxTicks = 188;

      animInterval = setInterval(function () {
        tick++;
        var p = Math.min(tick / maxTicks, 1);
        var force = (8.2 * p).toFixed(1);
        var rom = Math.floor(42 * p);
        var holdSec = p > 0.5 ? Math.floor((p - 0.5) * 2 * 30) : 0;

        if (forceEl) forceEl.textContent = force + ' lb';
        if (romEl) romEl.textContent = rom + '\u00B0';
        if (holdEl) holdEl.textContent = holdSec + 's';
        if (gaugeFill) gaugeFill.style.width = (p * 100) + '%';

        if (tick >= maxTicks) { clearInterval(animInterval); animInterval = null; }
      }, 80);
      return;
    }

    // Step 5 — Response Monitor
    if (step === 5) {
      if (forceEl) forceEl.textContent = '8.2 lb';
      if (romEl) romEl.textContent = '42\u00B0';
      if (holdEl) holdEl.textContent = '30s';
      if (gaugeFill) gaugeFill.style.width = '100%';
      return;
    }
  }

  function goToStep(step) {
    clearAnim();
    currentStep = step;
    updateDots(step);
    updateButtons(step);
    showStepContent(step);
    applyStep(step);
  }

  nextBtn.addEventListener('click', function () {
    goToStep(currentStep === TOTAL_STEPS - 1 ? 0 : currentStep + 1);
  });

  prevBtn.addEventListener('click', function () {
    if (currentStep > 0) goToStep(currentStep - 1);
  });

  dots.forEach(function (d) {
    d.addEventListener('click', function () {
      var target = parseInt(d.getAttribute('data-step'), 10);
      if (!isNaN(target) && target >= 0 && target < TOTAL_STEPS) goToStep(target);
    });
  });

  goToStep(0);
})();
