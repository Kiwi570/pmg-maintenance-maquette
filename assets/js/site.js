/* Effets propres à PMG Maintenance (direction « Au bord du toit »). Le socle gère l'ouverture, les transitions,
   l'en-tête, le menu, les boucles, les mesures et la bibliothèque d'effets. Ici, seulement ce qui est propre au client :
   - ligne-de-toit : les ampoules C9 s'allument une à une le long du bord du toit ;
   - neige : neige fine sur l'ouverture de l'accueil ;
   - jauge-neige : le repère des 24 po (épaisseur, signes d'alerte, pluie annoncée) ;
   - barrage-vapeur : la vapeur fait fondre les glaçons (bouton, survol, doigt) ;
   - ampoules-c9 : le visiteur compose les couleurs de sa ligne de toit ;
   - avant-apres : réglet qu'on glisse sur les vraies photos ;
   - carte-zone : la rivière se trace, les localités s'allument, recherche d'une ville ;
   plus les onglets des saisons, les filtres et le formulaire en étapes. */
import { demarrer, boucle, etat, versObjet, quand, rafraichir } from './socle/index.js?v=2';

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
function toutAllumer() { $$('.c9, .c9-svg').filter((b) => !b.closest('[data-manuel]')).forEach((b) => b.classList.add('allumee')); $$('.toit, [data-c9-cible-page]').forEach((t) => (t.__allume = true)); }
function lignesDeToit() {
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    allumer(e.target, { pas: 32 });
  }), { threshold: 0.5 });
  $$('.toit--ampoules, [data-facade]').filter((t) => !t.closest('[data-ouverture]') && !t.classList.contains('hero-toit') && !t.hasAttribute('data-c9-cible-page') && !t.hasAttribute('data-manuel')).forEach((t) => io.observe(t));
}

/* ---------- Façade illustrée : interrupteur (les ampoules s'éteignent puis se rallument en chenillard) ---------- */
function interrupteurs() {
  $$('[data-interrupteur]').forEach((b) => {
    const fac = b.closest('[data-facade]');
    b.addEventListener('click', () => {
      const allume = b.dataset.allume === 'oui';
      allumerFacade(fac, !allume);
    });
  });
}
function allumerFacade(fac, oui) {
  const b = $('[data-interrupteur]', fac), amp = $$('.c9-svg', fac);
  if (!b || (b.dataset.allume === 'oui') === oui) return;
  b.dataset.allume = oui ? 'oui' : 'non';
  clearTimeout(fac.__minuterie);
  (fac.__minuteries || []).forEach(clearTimeout);
  const ordre = oui ? amp : [...amp].reverse();
  fac.__minuteries = ordre.map((a, i) => setTimeout(() => a.classList.toggle('allumee', oui), i * (oui ? 30 : 14)));
  fac.classList.toggle('eteinte', !oui);
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
  /* À la souris, les flocons s'écartent autour du pointeur (un souffle), puis reprennent leur chute. */
  let px = -999, py = -999;
  if (souris) {
    const hero = cv.parentElement;
    hero.addEventListener('pointermove', (e) => { const r = cv.getBoundingClientRect(); px = e.clientX - r.left; py = e.clientY - r.top; });
    hero.addEventListener('pointerleave', () => { px = py = -999; });
  }
  boucle(cv, (dt, t) => {
    dt = Math.min(dt, 0.05);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#f3f6f9';
    for (const f of flocons) {
      const dx = f.x - px, dy = f.y - py, d2 = dx * dx + dy * dy;
      if (d2 < 14400) { const d = Math.sqrt(d2) || 1, k = (1 - d / 120) * 900 * dt; f.px = (f.px || 0) + (dx / d) * k; f.py = (f.py || 0) + (dy / d) * k; }
      if (f.px) { f.x += f.px * dt; f.px *= 0.92; if (Math.abs(f.px) < 0.5) f.px = 0; }
      if (f.py) { f.y += f.py * dt; f.py *= 0.92; if (Math.abs(f.py) < 0.5) f.py = 0; }
      f.y += f.v * dt; f.x += Math.sin(t * 0.6 + f.o) * 10 * dt;
      if (f.x < -6) f.x = w + 4; else if (f.x > w + 6) f.x = -4;
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
      const scene = $('.jauge-scene', section);
      if (scene) { scene.dataset.niveau = niveau; scene.dataset.pluie = pluie ? 'oui' : 'non'; }
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

/* ---------- Barrage de glace : la vapeur fait fondre les glaçons (bouton, survol, doigt) ---------- */
function vapeurs() {
  $$('[data-vapeur-jeu]').forEach((jeu) => {
    const cv = $('.vapeur-canvas', jeu), ctx = cv.getContext('2d');
    const toit = $('.vapeur-toit', jeu), btn = $('[data-vapeur-bouton]', jeu), astuce = $('.vapeur-astuce', jeu);
    const gl = $$('.glacon', toit).map((el) => ({ el, f: 0, x: 0, l: 0, palier: 0 }));
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let W = 0, H = 0, bord = 0, src = null, balai = null, fini = false, goutteDans = 0.6;
    const vap = [], gouttes = [];
    /* Bouffée de vapeur : un disque flou dessiné une fois, puis réutilisé. */
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = 64;
    const sc = sprite.getContext('2d'), gr = sc.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(243,246,249,1)'); gr.addColorStop(0.45, 'rgba(230,238,246,.55)'); gr.addColorStop(1, 'rgba(230,238,246,0)');
    sc.fillStyle = gr; sc.fillRect(0, 0, 64, 64);
    const mesurer = () => {
      const r = cv.getBoundingClientRect(), rt = toit.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bord = rt.top - r.top + rt.height * 0.82;
      gl.forEach((g) => { const b = g.el.getBoundingClientRect(); g.x = b.left - r.left + b.width / 2; g.l = g.el.offsetHeight; });
    };
    mesurer();
    new ResizeObserver(mesurer).observe(jeu);
    const poser = (g) => { g.el.style.transform = g.f > 0.001 ? `scaleY(${(1 - 0.92 * g.f).toFixed(3)})` : ''; };
    const goutte = (g) => gouttes.push({ x: g.x + (Math.random() - 0.5) * 2, y: bord + g.l * (1 - 0.92 * g.f), vy: 20 + Math.random() * 40 });
    const etatJeu = (f) => {
      fini = f;
      jeu.classList.toggle('fini', f);
      btn.dataset.etat = f ? 'fini' : 'pret';
    };
    const fondre = (e, dt) => {
      for (const g of gl) {
        const d = Math.abs(g.x - e.x);
        if (d > 64 || g.f >= 1) continue;
        g.f = Math.min(1, g.f + dt * 9 * (1 - d / 110));
        poser(g);
        const p = Math.floor(g.f * 4);
        if (p > g.palier) { g.palier = p; goutte(g); }
      }
    };
    const bouffee = (e, dt, force = 1) => {
      const n = Math.max(1, Math.round(dt * 70 * force));
      for (let i = 0; i < n && vap.length < 260; i++) vap.push({ x: e.x + (Math.random() - 0.5) * 30, y: bord + (Math.random() - 0.3) * 14, vx: (Math.random() - 0.5) * 50, vy: -40 - Math.random() * 60, r: 10 + Math.random() * 10, age: 0, vie: 0.9 + Math.random() * 0.8 });
    };
    boucle(cv, (dt) => {
      dt = Math.min(dt, 0.05);
      if (balai) {
        balai.x += balai.v * dt;
        if (balai.x > balai.fin) { balai = null; btn.classList.remove('actif'); }
      }
      for (const e of [src, balai]) if (e) { bouffee(e, dt, e === balai ? 1.5 : 1); fondre(e, dt); }
      /* L'eau s'égoutte de temps en temps au bout d'un glaçon. */
      goutteDans -= dt;
      if (goutteDans <= 0) { const g = gl[Math.floor(Math.random() * gl.length)]; if (g && g.f < 0.95) goutte(g); goutteDans = 0.5 + Math.random() * 1.2; }
      if (!fini && gl.length && gl.every((g) => g.f >= 0.97)) etatJeu(true);
      ctx.clearRect(0, 0, W, H);
      for (let i = vap.length - 1; i >= 0; i--) {
        const p = vap[i];
        p.age += dt;
        if (p.age >= p.vie) { vap.splice(i, 1); continue; }
        p.x += p.vx * dt; p.y += p.vy * dt; p.vy *= 0.985; p.r += dt * 26;
        ctx.globalAlpha = 0.42 * (1 - p.age / p.vie) * Math.min(1, p.age * 6);
        ctx.drawImage(sprite, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#cfe8f8';
      for (let i = gouttes.length - 1; i >= 0; i--) {
        const d = gouttes[i];
        d.vy += 900 * dt; d.y += d.vy * dt;
        if (d.y > H) { gouttes.splice(i, 1); continue; }
        ctx.globalAlpha = Math.max(0, 1 - (d.y - bord) / (H - bord + 1)) * 0.9;
        ctx.beginPath(); ctx.ellipse(d.x, d.y, 1.6, 3.2, 0, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    });
    /* Survol à la souris, ou doigt glissé le long des glaçons. */
    const suivre = (ev) => {
      if (ev.target.closest('.vapeur-commande')) { src = null; return; }
      const r = cv.getBoundingClientRect(), x = ev.clientX - r.left, y = ev.clientY - r.top;
      src = y > bord - 110 && y < bord + 110 ? { x, y: bord } : null;
    };
    jeu.addEventListener('pointermove', suivre);
    jeu.addEventListener('pointerdown', suivre);
    ['pointerleave', 'pointerup', 'pointercancel'].forEach((t) => jeu.addEventListener(t, () => { src = null; }));
    const balayer = (fin = W + 40, duree = 2.6) => { balai = { x: -40, v: (fin + 40) / duree, fin }; btn.classList.add('actif'); };
    btn.addEventListener('click', () => {
      if (!fini) { balayer(); return; }
      etatJeu(false);
      gl.forEach((g, i) => {
        g.palier = 0;
        if (gsap) gsap.to(g, { f: 0, duration: 0.8, delay: i * 0.02, ease: 'back.out(2.2)', onUpdate: () => poser(g) });
        else { g.f = 0; poser(g); }
      });
    });
    /* À la première entrée dans l'écran, une bouffée passe sur les premiers glaçons pour montrer le geste. */
    if (etat.arrivee !== 'retour' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const io = new IntersectionObserver((es) => {
        if (!es[0].isIntersecting) return;
        io.disconnect();
        setTimeout(() => { mesurer(); balayer(W * 0.17, 1.4); }, 500);
      }, { threshold: 0.8 });
      io.observe(toit);
    }
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
        const halo = b.classList.contains('c9-svg') && b.querySelector('.c9-halo');
        if (halo) halo.setAttribute('fill', `url(#halo-${c.slice(1)})`);
        if (!vague) { b.style.setProperty('--c', c); return; }
        setTimeout(() => { b.classList.remove('allumee'); b.style.setProperty('--c', c); requestAnimationFrame(() => b.classList.add('allumee')); }, i * 22);
      }));
    };
    btns.forEach((b) => b.addEventListener('click', () => {
      cibles.forEach((t) => { if (t.hasAttribute('data-facade') && t.classList.contains('eteinte')) { $('[data-interrupteur]', t).dataset.allume = 'oui'; t.classList.remove('eteinte'); } });
      const on = b.getAttribute('aria-pressed') === 'true';
      if (on && btns.filter((x) => x.getAttribute('aria-pressed') === 'true').length === 1) return;
      b.setAttribute('aria-pressed', on ? 'false' : 'true');
      if (gsap) gsap.fromTo(b, { scale: 0.92 }, { scale: 1, duration: 0.35, ease: 'back.out(3)', clearProps: 'transform' });
      appliquer(true);
    }));
    appliquer(false);
  });
}

/* ---------- Cinq couleurs : les ampoules se balancent (survol, toucher, puis une vague à l'entrée) ---------- */
function balancer(li) {
  li.classList.remove('balance');
  void li.offsetWidth;
  li.classList.add('balance');
}
function ampoulesBalance() {
  $$('[data-ampoules-balance]').forEach((ul) => {
    const lis = $$('li', ul);
    lis.forEach((li) => {
      li.addEventListener('animationend', () => li.classList.remove('balance'));
      li.addEventListener(souris ? 'pointerenter' : 'click', () => balancer(li));
    });
    if (etat.arrivee === 'retour') return;
    const io = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      lis.forEach((li, i) => setTimeout(() => balancer(li), 300 + i * 120));
    }, { threshold: 0.6 });
    io.observe(ul);
  });
}

/* ---------- Frise du service : le trait avance au défilement, les étapes s'allument au passage ---------- */
function frises() {
  $$('[data-frise]').forEach((fr) => {
    const etapes = $$('.etape', fr), trait = $('.frise-trait', fr);
    const toutes = () => etapes.forEach((e) => e.classList.add('allumee'));
    let seuils = [];
    /* Le trait va du centre de la première pastille au centre de la dernière. */
    const mesurer = () => {
      const r = fr.getBoundingClientRect();
      const cx = etapes.map((e) => { const n = $('.etape-num', e).getBoundingClientRect(); return n.left + n.width / 2 - r.left; });
      const g = cx[0], d = cx[cx.length - 1];
      fr.style.setProperty('--frise-g', g + 'px');
      fr.style.setProperty('--frise-l', Math.max(0, d - g) + 'px');
      seuils = cx.map((x) => (d > g ? (x - g) / (d - g) : 0));
    };
    mesurer();
    new ResizeObserver(mesurer).observe(fr);
    if (!gsap || !ST || etat.arrivee === 'retour') { fr.style.setProperty('--frise-p', 1); toutes(); return; }
    if (getComputedStyle(trait).display === 'none') {
      const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); e.target.classList.add('allumee'); } }), { threshold: 0.7 });
      etapes.forEach((e) => io.observe(e));
      return;
    }
    fr.style.setProperty('--frise-p', 0);
    ST.create({
      trigger: fr, start: 'top 80%', end: 'bottom 50%', scrub: 0.4,
      onRefresh: mesurer,
      onUpdate: (st) => {
        const p = st.progress;
        fr.style.setProperty('--frise-p', p.toFixed(4));
        etapes.forEach((e, i) => e.classList.toggle('allumee', p >= seuils[i] - 0.005));
      },
    });
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
    /* Une ampoule du récapitulatif par service : elle s'allume quand le service est coché. */
    const ampoules = $$('.recap-toit .c9', recap);
    $$('input[name="services"]', f).forEach((c, i) => ampoules[i] && ampoules[i].classList.toggle('allumee', c.checked));
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
    vapeurs();
    ratures();
    compositeurs();
    interrupteurs();
    ampoulesBalance();
    frises();
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
  /* Le chiffre de l'ouverture compte jusqu'à sa valeur (24 po). */
  $$('#debut [data-compte-arrivee]').forEach((el) => {
    const fin = +el.dataset.compteArrivee, o = { v: 0 };
    el.textContent = '0';
    tl.fromTo(o, { v: 0 }, { v: fin, duration: 1.3, ease: 'power2.out', onUpdate: () => { el.textContent = Math.round(o.v); } }, t + 0.35);
  });
  /* Raclette du bandeau de lavage. */
  const r = $('#debut [data-raclette]');
  if (r && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const o = { v: 0 };
    r.classList.add('a-nettoyer');
    r.style.setProperty('--net', '0%');
    tl.to(o, { v: 100, duration: 1.5, ease: 'power2.inOut', onUpdate: () => r.style.setProperty('--net', o.v.toFixed(2) + '%'), onComplete: () => r.classList.remove('a-nettoyer') }, t + 0.55);
  }
}
