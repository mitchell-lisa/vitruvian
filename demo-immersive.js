/* =============================================================
   VITRUVIAN — Immersive Demo Scripts
   View tab switching + Session walkthrough controller.
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
