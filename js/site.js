(function(){
  var reduziert = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Menü
  var burger = document.querySelector('.burger'), menue = document.getElementById('menue');
  if (burger) burger.addEventListener('click', function(){
    var offen = menue.classList.toggle('offen');
    burger.setAttribute('aria-expanded', offen ? 'true' : 'false');
  });
  menue.addEventListener('click', function(e){ if (e.target.tagName === 'A') { menue.classList.remove('offen'); burger.setAttribute('aria-expanded','false'); } });

  function hin(sel){
    var el = document.querySelector(sel); if (!el) return;
    var y = el.getBoundingClientRect().top + window.pageYOffset - 72;
    window.scrollTo({top: y, behavior: reduziert ? 'auto' : 'smooth'});
  }

  // Reiter Kaufen / Mieten
  var tabs = document.querySelectorAll('[role=tab]');
  function reiter(name){
    tabs.forEach(function(t){
      var an = t.id === 't-' + name;
      t.setAttribute('aria-selected', an ? 'true' : 'false');
      t.tabIndex = an ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !an;
    });
  }
  tabs.forEach(function(t){
    t.addEventListener('click', function(){ reiter(t.id.slice(2)); });
    t.addEventListener('keydown', function(e){
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        var n = t.id === 't-kauf' ? 'miete' : 'kauf'; reiter(n); document.getElementById('t-' + n).focus();
      }
    });
  });

  // Klingeltableau: Knopf drücken, kurz leuchten, dann zum Anliegen
  document.querySelectorAll('.klingel').forEach(function(k){
    k.addEventListener('click', function(){
      document.querySelectorAll('.klingel').forEach(function(x){ x.classList.remove('gedrueckt'); });
      k.classList.add('gedrueckt');
      if (k.dataset.reiter) reiter(k.dataset.reiter);
      setTimeout(function(){ hin(k.dataset.ziel); }, reduziert ? 0 : 260);
      setTimeout(function(){ k.classList.remove('gedrueckt'); }, 1400);
    });
  });

  // Regler
  [['flaeche',' m²'],['miete',' €'],['einheiten','']].forEach(function(r){
    var i = document.getElementById(r[0]); if (!i) return;
    var o = i.parentNode.querySelector('output');
    var f = function(){ o.textContent = (r[0]==='einheiten' && +i.value>=60 ? '60+' : i.value) + r[1]; };
    i.addEventListener('input', f); f();
  });

  // Hof Recker: Wohnung wählen
  var info = document.querySelector('.we-info');
  document.querySelectorAll('.we').forEach(function(b){
    b.setAttribute('aria-pressed','false');
    b.addEventListener('click', function(){
      document.querySelectorAll('.we').forEach(function(x){ x.setAttribute('aria-pressed','false'); });
      b.setAttribute('aria-pressed','true');
      info.innerHTML = '<b>Wohnung ' + b.dataset.we + '</b><br>' + b.dataset.info +
        '<br><button type="button" class="senden" data-we-anfrage="' + b.dataset.we + '">Exposé und Preis anfragen</button>';
    });
  });
  info.addEventListener('click', function(e){
    var a = e.target.closest('[data-we-anfrage]'); if (!a) return;
    var f = document.getElementById('k-n'); f.value = 'Hof Recker, Wohnung ' + a.dataset.weAnfrage;
    hin('#kontakt'); setTimeout(function(){ document.getElementById('k-t').focus({preventScroll:true}); }, 600);
  });

  // Exposé anfragen bei Objekten
  document.querySelectorAll('[data-anfrage]').forEach(function(a){
    a.addEventListener('click', function(e){
      e.preventDefault();
      document.getElementById('k-n').value = 'Exposé: ' + a.dataset.anfrage;
      hin('#kontakt');
    });
  });

  // Schaden melden: Formular vorwählen
  document.querySelectorAll('[data-anfrage-verwaltung]').forEach(function(b){
    b.addEventListener('click', function(){ document.getElementById('v5').checked = true; aktualisiereVerw(); hin('#verw-form'); });
  });
  var feldEinheiten = document.getElementById('feld-einheiten');
  function aktualisiereVerw(){
    var schaden = document.getElementById('v5').checked;
    feldEinheiten.hidden = schaden || document.getElementById('v3').checked;
    document.getElementById('vn').placeholder = schaden ? 'Adresse, Wohnung und was passiert ist' : 'z. B. Verwalterwechsel zum Jahresende';
  }
  document.querySelectorAll('input[name=vw]').forEach(function(r){ r.addEventListener('change', aktualisiereVerw); });

  // Stellen: Bewerbung vorwählen
  document.querySelectorAll('.stelle').forEach(function(s){
    s.addEventListener('click', function(){
      var sel = document.getElementById('bw-stelle');
      Array.prototype.forEach.call(sel.options, function(o){ if (o.text === s.dataset.stelle) sel.value = o.value; });
      hin('#bewerbung');
    });
  });

  // Demo-Formulare
  document.querySelectorAll('form[data-demo]').forEach(function(f){
    f.addEventListener('submit', function(e){
      e.preventDefault();
      var pflicht = f.querySelector('[required]');
      if (pflicht && !pflicht.value.trim()) {
        pflicht.setAttribute('aria-invalid','true');
        pflicht.placeholder = 'Bitte Telefon oder E-Mail angeben';
        pflicht.focus(); return;
      }
      f.classList.add('gesendet');
      var d = f.querySelector('.danke'); if (d) { d.setAttribute('tabindex','-1'); d.focus(); }
    });
  });

  // Sanftes Einblenden
  var els = document.querySelectorAll('.reveal');
  if (reduziert || !('IntersectionObserver' in window)) { els.forEach(function(e){ e.classList.add('da'); }); }
  else {
    var io = new IntersectionObserver(function(es){ es.forEach(function(en){ if (en.isIntersecting) { en.target.classList.add('da'); io.unobserve(en.target); } }); }, {rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(e){ io.observe(e); });
  }
})();
document.querySelectorAll('.datei input').forEach(function(i){i.addEventListener('change',function(){var em=i.parentNode.querySelector('em');if(i.files.length)em.textContent=i.files[0].name;});});
