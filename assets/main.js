/* Aust Media – meny, aktiv side og kontaktskjema */
(function () {
  var d = document;

  // Mobilmeny (hamburger)
  var toggle = d.querySelector('.nav-toggle');
  var menu = d.getElementById('hovedmeny');
  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('open', open);
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
  }

  // Undermenyer (Tjenester)
  var subs = [];
  Array.prototype.forEach.call(d.querySelectorAll('.sub-toggle'), function (btn) {
    var li = btn.parentNode;
    function set(open) {
      btn.setAttribute('aria-expanded', String(open));
      li.classList.toggle('open', open);
    }
    subs.push({ li: li, set: set });
    btn.addEventListener('click', function () {
      set(btn.getAttribute('aria-expanded') !== 'true');
    });
    li.addEventListener('focusout', function (e) {
      if (!li.contains(e.relatedTarget)) set(false);
    });
    li.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
        e.stopPropagation();
        set(false);
        btn.focus();
      }
    });
  });

  d.addEventListener('click', function (e) {
    subs.forEach(function (s) { if (!s.li.contains(e.target)) s.set(false); });
  });
  d.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu && menu.classList.contains('open')) {
      setMenu(false);
      toggle.focus();
    }
  });

  // Marker aktiv side i menyen
  var path = location.pathname.replace(/index\.html$/, '');
  if (path.slice(-1) !== '/') path += '/';
  Array.prototype.forEach.call(d.querySelectorAll('.nav-menu a'), function (a) {
    if (a.getAttribute('href') === path) a.setAttribute('aria-current', 'page');
  });

  // Kontaktskjema: send via Formspree uten å forlate siden, videresend til /takk/
  var form = d.getElementById('kontaktskjema');
  if (form && window.fetch && window.FormData) {
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type=submit]');
      btn.disabled = true;
      status.textContent = 'Sender …';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (r.ok) { window.location.href = '/takk/'; return; }
          throw new Error('status ' + r.status);
        })
        .catch(function () {
          status.textContent = 'Beklager, meldingen ble ikke sendt. Send e-post til post@austmedia.no eller ring 412 02 192.';
          btn.disabled = false;
        });
    });
  }
})();
