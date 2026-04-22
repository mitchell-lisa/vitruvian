/* ============================================================
   nda-gate.js — Reusable NDA click-wrap gate
   ============================================================
   Drop into any HTML page that should be NDA-protected:
     <script src="nda-gate.js" defer></script>
   Optionally customize the CTA text on the gate by adding to <body>:
     <body data-nda-cta="Enter Data Room">
   Defaults to "Access Materials".

   Behavior:
   - On load, checks localStorage for prior NDA acceptance.
   - If accepted within last 7 days, page renders normally with audit
     ribbon. Otherwise injects a fixed-position modal that locks scroll.
   - On accept, POSTs signer record to Supabase nda_signers table and
     dismisses the gate.
   ============================================================ */

(function () {
  'use strict';

  var SUPABASE_URL = 'https://dndlfrlnpzmxcufzwoxx.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_Rk00cCRtItBi2xnlMD4r9w_gHyy8V9H';
  var STORAGE_KEY  = 'modulor.nda.last';
  var SEVEN_DAYS   = 1000 * 60 * 60 * 24 * 7;

  var ctaLabel = (document.body && document.body.getAttribute('data-nda-cta')) || 'Access Materials';

  // -------- Inject CSS --------
  var css =
    '.nda-gate{position:fixed;inset:0;z-index:9999;background:#222426;display:flex;align-items:center;justify-content:center;transition:opacity .5s ease;}' +
    '.nda-gate.dismissed{opacity:0;pointer-events:none;}' +
    '.nda-box{max-width:560px;width:100%;padding:48px 40px;text-align:center;}' +
    '.nda-box img{height:clamp(28px,7vw,40px);width:auto;max-width:80%;margin-bottom:20px;filter:invert(1);mix-blend-mode:screen;}' +
    '.nda-box h2{font-size:24px;margin-bottom:16px;color:#fafafa;}' +
    '.nda-box p{max-width:100%;margin-bottom:20px;font-size:15px;color:#888;}' +
    '.nda-text{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:24px;text-align:left;font-size:13px;line-height:1.75;color:#888;max-height:220px;overflow-y:auto;margin-bottom:24px;}' +
    '.nda-text strong{color:#ccc;}' +
    '.nda-check{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:24px;cursor:pointer;}' +
    '.nda-check input{width:18px;height:18px;accent-color:#3D7A5A;cursor:pointer;}' +
    '.nda-check label{font-size:14px;color:#ccc;cursor:pointer;user-select:none;}' +
    '.nda-btn{display:inline-block;padding:14px 40px;font-size:15px;font-weight:700;font-family:inherit;background:#3D7A5A;color:#0D1012;border:none;border-radius:8px;cursor:pointer;opacity:.3;pointer-events:none;transition:all .2s ease;}' +
    '.nda-btn.enabled{opacity:1;pointer-events:auto;}' +
    '.nda-back{display:inline-block;margin-top:20px;font-size:13px;color:#666;text-decoration:none;transition:color .15s;}' +
    '.nda-back:hover{color:#aaa;}' +
    '.nda-fields{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;text-align:left;}' +
    '.nda-fields .full{grid-column:1 / -1;}' +
    '.nda-field label{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#888;margin-bottom:6px;}' +
    '.nda-field input{width:100%;padding:10px 12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.12);border-radius:6px;color:#fafafa;font-size:14px;font-family:inherit;transition:border-color .15s;}' +
    '.nda-field input:focus{outline:none;border-color:rgba(61,122,90,0.5);}' +
    '.nda-field input.error{border-color:#A94A3B;}' +
    '@media (max-width:520px){.nda-fields{grid-template-columns:1fr;}}' +
    '@media (max-width:768px){.nda-box{padding:32px 20px;}.nda-box h2{font-size:20px;}.nda-text{padding:18px;font-size:12px;max-height:200px;}}' +
    '.audit-ribbon{position:fixed;bottom:12px;right:12px;z-index:100;padding:6px 10px;background:rgba(26,29,35,0.9);border:1px solid rgba(61,122,90,0.25);border-radius:4px;font-size:10px;color:#888;font-family:"SF Mono",Menlo,monospace;letter-spacing:.02em;max-width:280px;display:none;}' +
    '.audit-ribbon strong{color:#3D7A5A;}' +
    '@media (max-width:768px){.audit-ribbon{bottom:8px;right:8px;left:8px;max-width:none;font-size:9px;padding:5px 8px;}}' +
    '@media print{.nda-gate{display:none !important;}.audit-ribbon{display:none !important;}}';

  var style = document.createElement('style');
  style.id = 'nda-gate-style';
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  // -------- Inject audit ribbon (always present, hidden until signed) --------
  var ribbon = document.createElement('div');
  ribbon.className = 'audit-ribbon';
  ribbon.id = 'auditRibbon';
  document.body.appendChild(ribbon);

  // -------- Auto-admit check --------
  var prior = null;
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && parsed.email && parsed.ts && (Date.now() - parsed.ts < SEVEN_DAYS)) {
        prior = parsed;
      }
    }
  } catch (e) { /* localStorage unavailable */ }

  function showAuditRibbon(record) {
    ribbon.style.display = 'block';
    ribbon.innerHTML =
      '<strong>Access logged</strong><br>' +
      escapeHtml(record.name) + ' &middot; ' + escapeHtml(record.org) + '<br>' +
      escapeHtml(record.email) + '<br>' +
      new Date(record.ts).toISOString();
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  if (prior) {
    showAuditRibbon(prior);
    return; // Page renders normally
  }

  // -------- Inject gate markup --------
  document.body.style.overflow = 'hidden';

  var gateHtml =
    '<div class="nda-gate" id="ndaGate">' +
      '<div class="nda-box">' +
        '<img src="modulor-wordmark.png" alt="Modulor">' +
        '<h2>Confidential Material</h2>' +
        '<p>This document contains proprietary information about Modulor, including product design, technical specifications, intellectual property, and business strategy. Please identify yourself and accept the terms below before proceeding.</p>' +
        '<div class="nda-fields">' +
          '<div class="nda-field"><label for="ndaName">Full name</label><input type="text" id="ndaName" autocomplete="name" placeholder="Jane Doe"></div>' +
          '<div class="nda-field"><label for="ndaOrg">Organization</label><input type="text" id="ndaOrg" autocomplete="organization" placeholder="Firm / team"></div>' +
          '<div class="nda-field full"><label for="ndaEmail">Work email</label><input type="email" id="ndaEmail" autocomplete="email" placeholder="jane@firm.com"></div>' +
        '</div>' +
        '<div class="nda-text">' +
          '<strong>Non-Disclosure Agreement</strong><br><br>' +
          'This Agreement is entered into between <strong>Modulor, Inc.</strong>, a Delaware corporation ("Modulor" or the "Disclosing Party"), and the individual or entity identified above ("Recipient"). By accessing this document, Recipient agrees to the following terms:<br><br>' +
          '<strong>1. Confidential Information.</strong> "Confidential Information" means all non-public information disclosed by Modulor through this material &mdash; including product designs, technical specifications, engineering details, patent claims and filings, market analysis, financial data, team information, pricing, and business strategy &mdash; whether marked confidential or not.<br><br>' +
          '<strong>2. Non-Disclosure.</strong> Recipient shall not disclose, publish, or disseminate any Confidential Information to any third party without prior written consent from Modulor, except to Recipient\'s employees, advisors, or affiliates who have a need to know for evaluation purposes and are bound by confidentiality obligations at least as restrictive as these.<br><br>' +
          '<strong>3. Non-Use.</strong> Recipient shall use Confidential Information solely to evaluate a potential business or investment relationship with Modulor, and for no other purpose.<br><br>' +
          '<strong>4. No Copies or Derivative Works.</strong> Recipient shall not copy, reproduce, screenshot, re-host, or create derivative works from this material or any portion thereof without prior written consent from Modulor.<br><br>' +
          '<strong>5. Exclusions.</strong> Confidential Information does not include information that (a) is or becomes publicly available through no breach by Recipient; (b) was lawfully known to Recipient prior to disclosure by Modulor; (c) is independently developed without reference to Confidential Information; or (d) is received from a third party without a duty of confidentiality.<br><br>' +
          '<strong>6. Return of Materials.</strong> Upon Modulor\'s written request, Recipient shall return or destroy all copies of Confidential Information in Recipient\'s possession or control.<br><br>' +
          '<strong>7. Duration.</strong> The obligations in this Agreement remain in effect for two (2) years from the date of acceptance, except that obligations with respect to trade secrets survive indefinitely for as long as the information remains a trade secret under applicable law.<br><br>' +
          '<strong>8. No License; No Obligation.</strong> Nothing in this Agreement grants Recipient any license or rights to any Modulor intellectual property, nor obligates either party to enter into any further agreement, investment, or commercial relationship.<br><br>' +
          '<strong>9. Governing Law.</strong> This Agreement is governed by the laws of the State of Delaware, without regard to conflict-of-law principles. Any dispute arising hereunder shall be resolved in the state or federal courts located in Delaware.<br><br>' +
          'By checking the box below, Recipient acknowledges having read, understood, and agreed to be bound by these terms.' +
        '</div>' +
        '<div class="nda-check"><input type="checkbox" id="ndaCheckbox"><label for="ndaCheckbox">I have read and agree to the Non-Disclosure Agreement</label></div>' +
        '<button class="nda-btn" id="ndaBtn">' + escapeHtml(ctaLabel) + '</button>' +
        '<div><a href="index.html" class="nda-back">&larr; Back to home (decline)</a></div>' +
      '</div>' +
    '</div>';

  var wrapper = document.createElement('div');
  wrapper.innerHTML = gateHtml;
  document.body.appendChild(wrapper.firstElementChild);

  var gate = document.getElementById('ndaGate');
  var checkbox = document.getElementById('ndaCheckbox');
  var btn = document.getElementById('ndaBtn');
  var nameF = document.getElementById('ndaName');
  var orgF = document.getElementById('ndaOrg');
  var emailF = document.getElementById('ndaEmail');

  function emailOk(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());
  }
  function formComplete() {
    return checkbox.checked &&
      nameF.value.trim().length >= 2 &&
      orgF.value.trim().length >= 2 &&
      emailOk(emailF.value);
  }
  function refresh() {
    btn.classList.toggle('enabled', formComplete());
    [nameF, orgF, emailF].forEach(function (el) { el.classList.remove('error'); });
  }
  [checkbox, nameF, orgF, emailF].forEach(function (el) {
    el.addEventListener('input', refresh);
    el.addEventListener('change', refresh);
  });

  function dismiss(record) {
    gate.classList.add('dismissed');
    document.body.style.overflow = '';
    setTimeout(function () { gate.style.display = 'none'; }, 600);
    showAuditRibbon(record);
  }

  btn.addEventListener('click', function () {
    if (!formComplete()) {
      if (!nameF.value.trim()) nameF.classList.add('error');
      if (!orgF.value.trim()) orgF.classList.add('error');
      if (!emailOk(emailF.value)) emailF.classList.add('error');
      return;
    }
    var record = {
      name:  nameF.value.trim(),
      org:   orgF.value.trim(),
      email: emailF.value.trim(),
      ts:    Date.now(),
      ua:    navigator.userAgent,
      ref:   document.referrer || 'direct',
      tz:    (Intl.DateTimeFormat().resolvedOptions().timeZone) || '',
      page:  location.pathname
    };
    try {
      var log = JSON.parse(localStorage.getItem('modulor.nda.log') || '[]');
      log.push(record);
      localStorage.setItem('modulor.nda.log', JSON.stringify(log));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch (e) { /* localStorage unavailable */ }

    if (SUPABASE_URL && SUPABASE_KEY) {
      fetch(SUPABASE_URL + '/rest/v1/nda_signers', {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': 'Bearer ' + SUPABASE_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          name:       record.name,
          org:        record.org,
          email:      record.email,
          user_agent: record.ua,
          referrer:   record.ref,
          timezone:   record.tz,
          page:       record.page
        })
      }).catch(function () { /* non-blocking */ });
    }

    dismiss(record);
  });
})();
