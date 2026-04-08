/* =============================================================
   VITRUVIAN — Immersive Demo Section Scripts
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

      // Toggle active class on tabs
      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');

      // Toggle active class on panels
      var panels = document.querySelectorAll('.view-panel');
      panels.forEach(function (p) { p.classList.remove('active'); });

      var activePanel = document.getElementById('view-' + target);
      if (activePanel) {
        activePanel.classList.add('active');
      }
    });
  });
})();


/* === SESSION WALKTHROUGH CONTROLLER === */
(function () {
  'use strict';

  var TOTAL_STEPS = 8;
  var currentStep = 0;
  var animInterval = null;

  // DOM references
  var prevBtn = document.getElementById('sPrev');
  var nextBtn = document.getElementById('sNext');
  var dots = document.querySelectorAll('.session-dot');
  if (!prevBtn || !nextBtn || !dots.length) return;

  // SVG element references (may or may not exist depending on HTML)
  var cable = document.getElementById('s-cable');
  var cuff = document.getElementById('s-cuff');

  // Live data text elements
  var forceEl = document.getElementById('s-force');
  var romEl = document.getElementById('s-rom');
  var holdEl = document.getElementById('s-hold');

  // Gauge
  var gaugeFill = document.getElementById('s-gauge-fill');

  /* ---- Helpers ---- */

  function clearAnim() {
    if (animInterval) {
      clearInterval(animInterval);
      animInterval = null;
    }
  }

  function updateDots(step) {
    dots.forEach(function (d, i) {
      var dotStep = parseInt(d.getAttribute('data-step'), 10);
      d.classList.toggle('active', dotStep <= step);
      d.classList.toggle('current', dotStep === step);
    });
  }

  function updateButtons(step) {
    prevBtn.disabled = step === 0;

    if (step === 0) {
      nextBtn.textContent = 'Start Session';
    } else if (step === TOTAL_STEPS - 1) {
      nextBtn.textContent = 'Reset';
    } else {
      nextBtn.textContent = 'Next';
    }
  }

  function showStepContent(step) {
    for (var i = 0; i < TOTAL_STEPS; i++) {
      var panel = document.getElementById('sStep' + i);
      if (panel) {
        panel.classList.toggle('active', i === step);
      }
    }
  }

  function resetSVG() {
    if (cable) {
      cable.style.stroke = '#888';
      cable.style.opacity = '0.4';
      cable.style.strokeWidth = '2';
      cable.setAttribute('x2', '350');
      cable.setAttribute('y2', '268');
    }
    if (cuff) {
      cuff.style.stroke = '#666';
      cuff.style.fill = 'none';
      cuff.setAttribute('cx', '350');
      cuff.setAttribute('cy', '268');
    }
    if (forceEl) forceEl.textContent = '0.0 lb';
    if (romEl) romEl.textContent = '0\u00B0';
    if (holdEl) holdEl.textContent = '0s';
    if (gaugeFill) gaugeFill.style.width = '0%';
  }

  /* ---- Step-specific behaviour ---- */

  function applyStep(step) {
    resetSVG();

    // Step 4 — Stretch Execute: run the force/ROM animation
    if (step === 4) {
      if (cable) {
        cable.style.stroke = '#4ade80';
        cable.style.opacity = '1';
        cable.style.strokeWidth = '2.5';
      }
      if (cuff) {
        cuff.style.stroke = '#4ade80';
        cuff.style.fill = 'rgba(74,222,128,0.15)';
      }

      var tick = 0;
      var maxTicks = 188; // ~15 seconds at 80ms interval

      animInterval = setInterval(function () {
        tick++;
        var p = Math.min(tick / maxTicks, 1);

        // Animate force 0 → 8.2 lb
        var force = (8.2 * p).toFixed(1);
        // Animate ROM 0° → 42°
        var rom = Math.floor(42 * p);
        // Animate hold time (ramp starts, then hold begins at ~50%)
        var holdSec = p > 0.5 ? Math.floor((p - 0.5) * 2 * 30) : 0;

        if (forceEl) forceEl.textContent = force + ' lb';
        if (romEl) romEl.textContent = rom + '\u00B0';
        if (holdEl) holdEl.textContent = holdSec + 's';
        if (gaugeFill) gaugeFill.style.width = (p * 100) + '%';

        // Animate SVG cable endpoint and cuff along an arc
        if (cable && cuff) {
          var angle = p * 42 * Math.PI / 180;
          var pivotX = 250;
          var pivotY = 268;
          var radius = 100;
          var cx = pivotX + radius * Math.cos(0.05 - angle);
          var cy = pivotY - radius * Math.sin(angle);

          cable.setAttribute('x2', String(Math.round(cx)));
          cable.setAttribute('y2', String(Math.round(cy)));
          cuff.setAttribute('cx', String(Math.round(cx)));
          cuff.setAttribute('cy', String(Math.round(cy)));
        }

        if (tick >= maxTicks) {
          clearInterval(animInterval);
          animInterval = null;
        }
      }, 80);

      return;
    }

    // Step 5 — Response Monitor: pulsing state
    if (step === 5) {
      if (cable) {
        cable.style.stroke = '#4ade80';
        cable.style.opacity = '0.7';
      }
      if (cuff) {
        cuff.style.stroke = '#4ade80';
        cuff.style.fill = 'rgba(74,222,128,0.10)';
      }
      // Set live data to monitoring values
      if (forceEl) forceEl.textContent = '8.2 lb';
      if (romEl) romEl.textContent = '42\u00B0';
      if (holdEl) holdEl.textContent = '30s';
      if (gaugeFill) gaugeFill.style.width = '100%';

      // Pulse the cable opacity
      var pulseUp = true;
      var opacity = 0.7;
      animInterval = setInterval(function () {
        if (pulseUp) {
          opacity += 0.02;
          if (opacity >= 1.0) pulseUp = false;
        } else {
          opacity -= 0.02;
          if (opacity <= 0.5) pulseUp = true;
        }
        if (cable) cable.style.opacity = String(opacity.toFixed(2));
      }, 60);

      return;
    }

    // All other steps: SVG stays in reset state.
    // Individual step panels handle their own static content via HTML.
  }

  /* ---- Navigation ---- */

  function goToStep(step) {
    clearAnim();
    currentStep = step;
    updateDots(step);
    updateButtons(step);
    showStepContent(step);
    applyStep(step);
  }

  nextBtn.addEventListener('click', function () {
    if (currentStep === TOTAL_STEPS - 1) {
      goToStep(0);
    } else {
      goToStep(currentStep + 1);
    }
  });

  prevBtn.addEventListener('click', function () {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  });

  dots.forEach(function (d) {
    d.addEventListener('click', function () {
      var target = parseInt(d.getAttribute('data-step'), 10);
      if (!isNaN(target) && target >= 0 && target < TOTAL_STEPS) {
        goToStep(target);
      }
    });
  });

  // Initialise at step 0
  goToStep(0);
})();
