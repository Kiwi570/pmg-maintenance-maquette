/* Effets propres à PMG Maintenance (direction « Au bord du toit »). Le socle gère l'ouverture, les transitions,
   l'en-tête, le menu, les boucles, les mesures et la bibliothèque d'effets. Ici, seulement ce qui est propre au client :
   - ligne-de-toit : les ampoules C9 s'allument une à une le long du bord du toit ;
   - neige : neige fine sur l'ouverture de l'accueil ;
   - jauge-neige : le repère des 24 po (épaisseur, signes d'alerte, pluie annoncée) ;
   - barrage-vapeur : les glaçons fondent au défilement ;
   - ampoules-c9 : le visiteur compose les couleurs de sa ligne de toit ;
   - avant-apres : réglet qu'on glisse sur les vraies photos ;
   - carte-zone : la rivière se trace, les localités s'allument, recherche d'une ville ;
   plus les onglets des saisons, les filtres et le formulaire en étapes. */
import { demarrer, boucle, etat, versObjet, quand, rafraichir } from './socle/index.js?v=1';

const gsap = window.gsap;
const ST = window.ScrollTrigger;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const souris = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const petit = () => window.innerWidth < 761;

/* ---------- Ligne de toit : ampoules qui s'allument ---------- */
function allumer(toit, { pas = 40, delai = 0 } = {}) {
  if (!toit || toit.__allume) return;
  toit.__allume = true;
  $$('.c9, .c9-svg', toit).forEach((b, i) => setTimeout(() => b.classList.add('allumee'), delai + i * pas));
}
function toutAllumer() { $$('.c9, .c9-svg').forEach((b) => b.classList.add('allumee')); $$('.toit, [data-c9-cible-page]').forEach((t) => (t.__allume = true)); }
function lignesDeToit() {
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    allumer(e.target, { pas: 32 });
  }), { threshold: 0.5 });
  $$('.toit--ampoules').filter((t) => !t.closest('[data-ouverture]') && !t.classList.contains('hero-toit') && !t.hasAttribute('data-c9-cible-page')).forEach((t) => io.observe(t));
}

function eau() {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); e.target.classList.add('coule'); } }), { threshold: 0.5 });
  $$('.toit--eau').forEach((t) => io.observe(t));
}

/* ---------- Neige fine sur l'ouverture ---------- */
function neige() {
  const cv = $('[data-neige]');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
  let w = 0, h = 0, flocons = [];
  const taille = () => {
    const r = cv.getBoundingClientRect();
    w = r.width; h = r.height;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(170, (w * h) / (petit() ? 7000 : 8000)));
    flocons = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, r: 0.8 + Math.random() * 2.4, v: 16 + Math.random() * 40, o: Math.random() * Math.PI * 2, a: 0.35 + Math.random() * 0.55 }));
  };
  taille();
  new ResizeObserver(taille).observe(cv);
  boucle(cv, (dt, t) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#f3f6f9';
    for (const f of flocons) {
      f.y += f.v * dt; f.x += Math.sin(t * 0.6 + f.o) * 10 * dt;
      if (f.y > h + 4) { f.y = -4; f.x = Math.random() * w; }
      ctx.globalAlpha = f.a;
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  });
}

/* ---------- Saisons : onglets ---------- */
function onglets(liste, { attr, panneaux, actif, surChange }) {
  const choisir = (cle, focus = false) => {
    liste.forEach((b) => {
      const oui = b.getAttribute(attr) === cle;
      b.setAttribute('aria-selected', oui ? 'true' : 'false');
      b.tabIndex = oui ? 0 : -1;
      if (oui && focus) b.focus();
    });
    panneaux(cle);
    surChange && surChange(cle);
  };
  liste.forEach((b, i) => {
    b.addEventListener('click', () => choisir(b.getAttribute(attr)));
    b.addEventListener('keydown', (e) => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();
      const n = e.key === 'Home' ? 0 : e.key === 'End' ? liste.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + liste.length) % liste.length;
      choisir(liste[n].getAttribute(attr), true);
    });
  });
  choisir(actif);
}
function saisons() {
  const btns = $$('[data-saison-onglet]');
  if (!btns.length) return;
  onglets(btns, {
    attr: 'data-saison-onglet',
    actif: document.documentElement.dataset.saison || 'hiver',
    panneaux: (cle) => $$('[data-saison-panneau]').forEach((p) => {
      const oui = p.dataset.saisonPanneau === cle;
      if (oui && !p.classList.contains('actif') && p.__vu) {
        p.classList.add('actif');
        if (gsap) gsap.fromTo($$('.carte-service', p), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' });
      } else p.classList.toggle('actif', oui);
      p.__vu = true;
    }),
    surChange: () => rafraichir && rafraichir(),
  });
}

/* ---------- Repère des 24 po ---------- */
function jauges() {
  $$('[data-jauge]').forEach((bloc) => {
    const section = bloc.closest('section');
    const ep = $('[data-jauge-ep]', bloc), sortie = $('[data-jauge-sortie]', bloc);
    const neigeP = $('[data-jauge-neige]', section), etatP = $('[data-jauge-etat]', section), verdict = $('.jauge-verdict', section);
    const unite = ep.dataset.unite || 'po';
    const maj = () => {
      const v = +ep.value, t = Math.round(v * (40 / 24));
      sortie.textContent = `${v} ${unite}`;
      neigeP.setAttribute('points', `110,${235 - t} 320,${95 - t} 530,${235 - t} 530,235 320,95 110,235`);
      const signe = $$('[data-jauge-signe]', bloc).some((c) => c.checked), pluie = $('[data-jauge-pluie]', bloc)?.checked;
      const niveau = signe ? 'alerte' : v >= 24 ? 'depasse' : pluie ? 'pluie' : v >= 18 ? 'attention' : 'ok';
      verdict.dataset.jaugeNiveau = niveau === 'pluie' ? 'attention' : niveau;
      etatP.textContent = etatP.dataset[niveau];
    };
    bloc.addEventListener('input', maj);
    bloc.addEventListener('change', maj);
    maj();
    /* À l'entrée dans l'écran, la neige s'accumule de 0 à la valeur de départ (une fois). */
    if (gsap && etat.arrivee !== 'retour') {
      const cible = +ep.value, o = { v: 0 };
      const io = new IntersectionObserver((es) => {
        if (!es[0].isIntersecting) return;
        io.disconnect();
        gsap.to(o, { v: cible, duration: 1.6, ease: 'power2.out', onUpdate: () => { ep.value = Math.round(o.v); maj(); } });
      }, { threshold: 0.45 });
      ep.value = 0; maj();
      io.observe(section.querySelector('.jauge-visuel'));
    }
  });
}

/* ---------- Glaçons qui fondent au défilement ---------- */
function glacons() {
  if (!gsap || !ST) return;
  $$('.toit--glacons').forEach((toit) => {
    const g = $$('.glacon', toit);
    const section = toit.closest('section');
    gsap.fromTo(g, { scaleY: 1 }, { scaleY: 0.22, ease: 'none', stagger: { each: 0.03, from: 'random' },
      scrollTrigger: { trigger: section, start: 'top 75%', end: 'bottom 45%', scrub: 0.6 } });
  });
}

/* ---------- Liste rayée (ce qu'on ne met jamais sur le toit) ---------- */
function ratures() {
  $$('[data-rature]').forEach((l) => {
    $$('span', l).forEach((s, i) => s.style.setProperty('--i', i));
    const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { io.disconnect(); l.classList.add('vu'); } }, { threshold: 0.6 });
    io.observe(l);
  });
}

/* ---------- Ampoules C9 : le visiteur compose sa ligne de toit ---------- */
function compositeurs() {
  $$('[data-c9-choix]').forEach((choix) => {
    const zone = choix.closest('section, main');
    const cibles = $$('[data-c9-cible], [data-c9-cible-page]', zone);
    const btns = $$('[data-c9]', choix);
    const appliquer = (vague) => {
      const cols = btns.filter((b) => b.getAttribute('aria-pressed') === 'true').map((b) => b.dataset.c9);
      cibles.forEach((t) => $$('.c9, .c9-svg', t).forEach((b, i) => {
        const c = cols[i % cols.length];
        if (!vague) { b.style.setProperty('--c', c); return; }
        setTimeout(() => { b.classList.remove('allumee'); b.style.setProperty('--c', c); requestAnimationFrame(() => b.classList.add('allumee')); }, i * 22);
      }));
    };
    btns.forEach((b) => b.addEventListener('click', () => {
      const on = b.getAttribute('aria-pressed') === 'true';
      if (on && btns.filter((x) => x.getAttribute('aria-pressed') === 'true').length === 1) return;
      b.setAttribute('aria-pressed', on ? 'false' : 'true');
      if (gsap) gsap.fromTo(b, { scale: 0.92 }, { scale: 1, duration: 0.35, ease: 'back.out(3)', clearProps: 'transform' });
      appliquer(true);
    }));
    appliquer(false);
  });
}

/* ---------- Avant / après ---------- */
function avantApres() {
  $$('[data-aa]').forEach((aa) => {
    const paires = $$('[data-aa-paire]', aa);
    paires.forEach((p) => {
      const r = $('[data-aa-reglet]', p);
      const maj = () => p.style.setProperty('--pos', r.value + '%');
      r.addEventListener('input', maj);
      maj();
    });
    const btns = $$('[data-aa-onglet]', aa);
    if (btns.length) onglets(btns, { attr: 'data-aa-onglet', actif: btns[0].dataset.aaOnglet, panneaux: (cle) => paires.forEach((p) => (p.hidden = p.dataset.aaPaire !== cle)) });
    /* Une démonstration à l'entrée dans l'écran, arrêtée au premier geste. */
    if (gsap && etat.arrivee !== 'retour') {
      const p = paires[0], r = $('[data-aa-reglet]', p), o = { v: 50 };
      let tw = null;
      const stop = () => { tw && tw.kill(); };
      ['pointerdown', 'keydown', 'touchstart'].forEach((ev) => aa.addEventListener(ev, stop, { once: true, passive: true }));
      const io = new IntersectionObserver((es) => {
        if (!es[0].isIntersecting) return;
        io.disconnect();
        tw = gsap.timeline({ onUpdate: () => { r.value = Math.round(o.v); p.style.setProperty('--pos', o.v + '%'); } })
          .to(o, { v: 18, duration: 0.9, ease: 'power2.inOut' }).to(o, { v: 82, duration: 1.2, ease: 'power2.inOut' }).to(o, { v: 50, duration: 0.8, ease: 'power2.inOut' });
      }, { threshold: 0.6 });
      io.observe(p);
    }
  });
}

/* ---------- Zone : carte et recherche ---------- */
const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/^(st|ste) /, (m) => (m === 'st ' ? 'saint ' : 'sainte '));
function zones() {
  $$('.zone-carte').forEach((carte) => {
    const riv = $('.zone-riviere', carte);
    if (gsap && etat.arrivee !== 'retour') gsap.set(riv, { strokeDasharray: 1, strokeDashoffset: 1 });
    const io = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      carte.classList.add('vu');
      if (gsap && etat.arrivee !== 'retour') gsap.to(riv, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' });
    }, { threshold: 0.35 });
    io.observe(carte);
  });
  $$('[data-zone]').forEach((z) => {
    const champ = $('[data-zone-champ]', z), rep = $('[data-zone-reponse]', z);
    const qc = JSON.parse($('[data-zone-qc]', z).dataset.zoneQc), on = JSON.parse($('[data-zone-on]', z).dataset.zoneOn);
    const tous = [...qc.map((n) => ({ n, p: z.dataset.qc })), ...on.map((n) => ({ n, p: z.dataset.on }))];
    const chercher = () => {
      const q = norm(champ.value);
      $$('.zone-point.trouvee').forEach((g) => g.classList.remove('trouvee'));
      if (q.length < 3) { rep.textContent = ''; rep.className = 'zone-reponse'; return; }
      const t = tous.find((v) => norm(v.n) === q) || tous.find((v) => norm(v.n).startsWith(q)) || tous.find((v) => norm(v.n).includes(q));
      if (t) {
        rep.textContent = z.dataset.oui.replace('{ville}', t.n).replace('{province}', t.p);
        rep.className = 'zone-reponse oui';
        $$(`.zone-point[data-ville="${CSS.escape(t.n)}"]`).forEach((g) => g.classList.add('trouvee'));
      } else {
        rep.textContent = z.dataset.non.replace('{ville}', champ.value.trim());
        rep.className = 'zone-reponse';
      }
    };
    champ.addEventListener('input', chercher);
    champ.addEventListener('change', chercher);
  });
}

/* ---------- Filtres (réalisations, surfaces) ---------- */
function filtres() {
  $$('[data-filtres]').forEach((f) => {
    const btns = $$('button[data-filtre]', f);
    const items = $$(f.dataset.filtres);
    btns.forEach((b) => b.addEventListener('click', () => {
      btns.forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
      const v = b.dataset.filtre;
      const garder = items.filter((it) => v === 'tout' || it.dataset.type === v);
      if (gsap) {
        gsap.to(items, { opacity: 0, duration: 0.18, onComplete: () => {
          items.forEach((it) => (it.hidden = !garder.includes(it)));
          rafraichir && rafraichir();
          gsap.fromTo(garder, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.04, ease: 'power3.out' });
        } });
      } else items.forEach((it) => (it.hidden = !garder.includes(it)));
    }));
  });
}

/* ---------- Formulaire d'estimation en étapes ---------- */
function estimation() {
  const f = $('[data-etapes]');
  if (!f) return;
  const etapes = $$('[data-etape]', f), puces = $$('[data-puce]', f.closest('section'));
  let n = 0;
  const recap = $('[data-recap]');
  const montrer = (i, focus = true) => {
    const avant = f.offsetHeight;
    etapes.forEach((e, k) => (e.hidden = k !== i));
    puces.forEach((p, k) => { p.classList.toggle('faite', k < i); p.toggleAttribute('aria-current', k === i); if (k === i) p.setAttribute('aria-current', 'step'); });
    n = i;
    if (gsap) gsap.fromTo(f, { height: avant }, { height: f.scrollHeight, duration: 0.35, ease: 'power2.out', clearProps: 'height', onComplete: () => rafraichir && rafraichir() });
    if (focus) { const t = $('legend, h3', etapes[i]); if (t) { t.tabIndex = -1; t.focus({ preventScroll: true }); } }
  };
  const valide = (i) => {
    const e = etapes[i];
    if (i === 0) {
      const ok = $$('input[name="services"]', e).some((c) => c.checked);
      const err = $('[data-erreur-services]', e);
      err.hidden = ok;
      if (!ok) { $('input[name="services"]', e).focus(); return false; }
      return true;
    }
    let premier = null;
    $$('[required]', e).forEach((c) => {
      const v = c.value.trim();
      const bad = !v || (c.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v));
      c.toggleAttribute('aria-invalid', bad);
      if (bad && !premier) premier = c;
    });
    if (premier) { premier.focus(); return false; }
    return true;
  };
  f.addEventListener('click', (e) => {
    const b = e.target.closest('[data-suivant], [data-precedent]');
    if (!b) return;
    e.preventDefault();
    if (b.hasAttribute('data-suivant')) { if (valide(n)) montrer(Math.min(etapes.length - 1, n + 1)); }
    else montrer(Math.max(0, n - 1));
  });
  /* Récapitulatif en direct. */
  const majRecap = () => {
    if (!recap) return;
    const services = $$('input[name="services"]:checked', f).map((c) => c.closest('label').textContent.trim());
    $('[data-recap-services]', recap).innerHTML = services.length ? services.map((s) => `<li>${s.replace(/</g, '&lt;')}</li>`).join('') : `<li class="vide">${recap.dataset.vide}</li>`;
    const ville = $('[name="ville"]', f).value.trim();
    const v = $('[data-recap-ville]', recap);
    if (ville) {
      const z = $('[data-zone]');
      const tous = z ? [...JSON.parse($('[data-zone-qc]', z).dataset.zoneQc), ...JSON.parse($('[data-zone-on]', z).dataset.zoneOn)] : [];
      const ok = tous.some((t) => norm(t) === norm(ville));
      v.textContent = `${ville} · ${ok ? recap.dataset.desservie : recap.dataset.nonlistee}`;
    } else v.textContent = '—';
    const code = $('[name="code"]', f).value;
    $('[data-recap-code]', recap).textContent = code ? `${code} · ${recap.dataset.remise}` : '—';
  };
  f.addEventListener('input', majRecap);
  f.addEventListener('change', majRecap);
  /* Préremplissage par l'adresse : ?service=lumieres, ?code=VOISINS25. */
  const params = new URLSearchParams(location.search);
  const s = params.get('service');
  if (s) $$(`input[name="services"][data-service="${CSS.escape(s)}"]`, f).forEach((c) => (c.checked = true));
  const code = params.get('code');
  if (code && $(`[name="code"] option[value="${CSS.escape(code)}"]`, f)) $('[name="code"]', f).value = code;
  majRecap();
  montrer(0, false);
  /* Envoi simulé : le socle (formulaires.js) vérifie les champs et affiche le message ; ici, rien de plus. */
}

/* ---------- Démarrage ---------- */
demarrer({
  preparer() {
    lignesDeToit();
    eau();
    neige();
    saisons();
    jauges();
    glacons();
    ratures();
    compositeurs();
    avantApres();
    zones();
    filtres();
    estimation();
  },
  /* Intro (environ 2,3 s) : la ligne de toit se trace, les ampoules s'allument, puis le logo glisse jusqu'à
     la ligne de toit de la page (ou l'objet d'ouverture) et le panneau s'ouvre depuis elle. */
  jouer() {
    if (!gsap) return null;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    const trait = $('.ouverture-toit .toit-trait path');
    if (trait) tl.fromTo(trait, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.55, ease: 'power2.inOut' }, 0.1);
    $$('.ouverture-toit .c9').forEach((b, i) => tl.call(() => b.classList.add('allumee'), null, 0.35 + i * 0.035));
    tl.to('.ouverture-nom, .ouverture-ligne, .ouverture-toit', { opacity: 0, duration: 0.25 }, 0.9);
    versObjet(tl, { a: 1.0 });
    arriveePage(tl, 1.55);
    return tl;
  },
  etatFinal() {
    toutAllumer();
    if (!gsap) return;
    gsap.set('.hero-ligne, .page-ligne', { yPercent: 0, y: 0 });
    gsap.set('#debut [data-anime="gsap"]', { opacity: 1, y: 0 });
  },
  arrivee() {
    if (!gsap) return;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    arriveePage(tl, 0.15);
  },
});

/* Premier écran : titre ligne à ligne, puis le reste ; la ligne de toit de l'ouverture s'allume. */
function arriveePage(tl, t) {
  const lignes = $$('.hero-ligne, .page-ligne');
  if (lignes.length) tl.fromTo(lignes, { yPercent: 110, y: 0 }, { yPercent: 0, y: 0, duration: 0.85, stagger: 0.12 }, t);
  const autres = $$('#debut [data-anime="gsap"]');
  if (autres.length) tl.fromTo(autres, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, t + 0.15);
  const toit = $('#debut .toit--ampoules, #debut [data-c9-cible-page]');
  if (toit) tl.call(() => allumer(toit, { pas: 28 }), null, t + 0.1);
}
