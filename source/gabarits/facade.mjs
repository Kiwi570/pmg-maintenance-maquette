/* Façade illustrée, dessinée en code : une maison enneigée à l'heure bleue, avec garage, épinette et cheminée.
   Sa vraie ligne de toit (avant-toits, pignon, garage) porte des ampoules C9 que le visiteur colore avec le
   sélecteur de couleurs (data-c9-cible) ; un interrupteur les éteint et les rallume.
   Sert sur l'accueil (section Lumières) et en ouverture de la page Lumières de Noël, sans aucune image. */
import { html, brut } from '../../outils/gabarit.mjs';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

/* Le décor (ciel étoilé, maison, épinette décorée, neige au sol) ne change jamais : il est écrit une fois en fichier SVG et
   affiché comme une image, que le navigateur garde en mémoire sans la redessiner au défilement. */
const FICHIER = new URL('../../assets/images/facade-maison.svg', import.meta.url);
function ecrireFond(svg) {
  if (existsSync(FICHIER) && readFileSync(FICHIER, 'utf8') === svg) return;
  writeFileSync(FICHIER, svg);
}

const W = 960, H = 600;
const f = (v) => (Math.round(v * 10) / 10).toString();

/* Points répartis à intervalles réguliers le long d'une ligne brisée. */
function lelong(trace, pas) {
  const pts = [];
  for (let i = 1; i < trace.length; i++) {
    const [x0, y0] = trace[i - 1], [x1, y1] = trace[i];
    const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / pas));
    for (let k = i === 1 ? 0 : 1; k <= n; k++) pts.push([x0 + ((x1 - x0) * k) / n, y0 + ((y1 - y0) * k) / n]);
  }
  return pts;
}

/* Une ampoule C9 : douille, verre à facettes, reflet, halo. */
function ampoule([x, y], i, r, couleur) {
  const verre = `M0 ${f(r * 0.6)} C ${f(r)} ${f(r * 0.9)} ${f(r * 0.9)} ${f(r * 2.2)} 0 ${f(r * 2.7)} C ${f(-r * 0.9)} ${f(r * 2.2)} ${f(-r)} ${f(r * 0.9)} 0 ${f(r * 0.6)} Z`;
  return `<g class="c9-svg" style="--c:${couleur};--i:${i}" transform="translate(${f(x)} ${f(y)})"><circle class="c9-halo" cy="${f(r * 1.7)}" r="${f(r * 4.2)}" fill="url(#halo-${couleur.slice(1)})"/><rect class="c9-douille" x="${f(-r * 0.38)}" y="0" width="${f(r * 0.76)}" height="${f(r * 0.7)}" rx="1"/><path class="c9-verre" d="${verre}"/><path class="c9-reflet" d="M${f(-r * 0.3)} ${f(r * 1.1)} Q ${f(-r * 0.45)} ${f(r * 1.6)} ${f(-r * 0.2)} ${f(r * 2.1)}"/></g>`;
}

/* Petit générateur pseudo-aléatoire stable (même dessin à chaque génération). */
function hasard(graine) {
  let s = graine;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

/* Épinette : trois étages de branches, neige sur chaque étage. */
function epinette(x, base, h, l, teinte, neige = true) {
  const etages = [[0, 1], [0.3, 0.78], [0.56, 0.54]];
  return etages.map(([d, k]) => {
    const yb = base - h * d, yh = yb - h * 0.5, demi = (l / 2) * k;
    const sapin = `<path d="M${f(x)} ${f(yh)} L${f(x + demi)} ${f(yb)} Q${f(x)} ${f(yb - 8)} ${f(x - demi)} ${f(yb)} Z" fill="${teinte}"/>`;
    const blanc = neige ? `<path class="f-neige-branche" d="M${f(x)} ${f(yh + 2)} L${f(x + demi * 0.55)} ${f(yh + (yb - yh) * 0.55)} Q${f(x + demi * 0.2)} ${f(yh + (yb - yh) * 0.48)} ${f(x)} ${f(yh + (yb - yh) * 0.52)} Q${f(x - demi * 0.2)} ${f(yh + (yb - yh) * 0.48)} ${f(x - demi * 0.55)} ${f(yh + (yb - yh) * 0.55)} Z"/>` : '';
    return sapin + blanc;
  }).join('') + `<rect x="${f(x - 5)}" y="${f(base - 4)}" width="10" height="14" fill="${teinte}"/>`;
}

/* Fenêtre éclairée : cadre, vitre chaude, croisillons. */
function fenetre(x, y, w, h, id, volets = false) {
  const v = volets ? `<rect class="f-volet" x="${f(x - 16)}" y="${f(y)}" width="12" height="${f(h)}" rx="1"/><rect class="f-volet" x="${f(x + w + 4)}" y="${f(y)}" width="12" height="${f(h)}" rx="1"/>` : '';
  return `${v}<rect class="f-cadre" x="${f(x - 4)}" y="${f(y - 4)}" width="${f(w + 8)}" height="${f(h + 8)}" rx="2"/><rect class="f-vitre" x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="url(#${id}-fen)"/><path class="f-croisillon" d="M${f(x + w / 2)} ${f(y)} V${f(y + h)} M${f(x)} ${f(y + h / 2)} H${f(x + w)}"/><rect class="f-appui" x="${f(x - 7)}" y="${f(y + h + 3)}" width="${f(w + 14)}" height="6" rx="3"/>`;
}

/**
 * @param {object} c contexte de page
 * @param {object} o
 * @param {string} o.id préfixe unique des dégradés
 * @param {string} [o.classe]
 * @param {string} [o.cible] attribut de cible des couleurs : data-c9-cible (section) ou data-c9-cible-page (ouverture)
 */
export function facadeMaison(c, { id = 'facade', classe = '', cible = 'data-c9-cible', priorite = false } = {}) {
  const alea = hasard(7);
  /* Ciel : étoiles et lune. */
  const etoiles = Array.from({ length: 40 }, (_, i) => {
    const x = alea() * W, y = alea() * 230, r = 0.7 + alea() * 1.5;
    if (x > 160 && x < 920 && y > 120) return '';
    return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" opacity="${f(0.45 + (i % 4) * 0.15)}"/>`;
  }).join('');
  /* Forêt au loin, sur la ligne d'horizon. */
  const foret = Array.from({ length: 26 }, (_, i) => {
    const x = i * 38 + alea() * 18 - 10, h = 70 + alea() * 70;
    return epinette(x, 476, h, h * 0.55, '#0c1c31', false);
  }).join('');
  /* Guirlande de l'épinette (décor fixe, pas reliée au sélecteur). */
  const minis = Array.from({ length: 22 }, (_, i) => {
    const t = i / 21, y = 312 + t * 190, demi = 12 + t * 56, x = 112 + Math.sin(i * 1.7) * demi * 0.8;
    return `<circle cx="${f(x)}" cy="${f(y)}" r="2.6"/>`;
  });
  const mini = `<g fill="#ffd27f">${minis.join('')}</g>`;

  /* Ligne de toit : avant-toit, pignon, avant-toit, puis garage. */
  const traces = [
    [[182, 297], [318, 297], [430, 141], [542, 297], [678, 297]],
    [[644, 379], [896, 379]],
  ];
  const cols = ['#ffc46b', '#ff3b30', '#2fd06a'];
  const C9 = (c.donnees.c9 || []).map((k) => k.couleur);
  const pts = traces.flatMap((t) => lelong(t, 29));
  const ampoules = pts.map((p, i) => ampoule(p, i, 7, cols[i % cols.length])).join('');
  const fils = traces.map((t) => `<polyline class="f-fil" points="${t.map(([x, y]) => `${x},${y}`).join(' ')}"/>`).join('');

  const fond = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <style>.f-cadre{fill:#e6edf5}.f-croisillon{stroke:#e6edf5;stroke-width:3;fill:none}.f-appui{fill:#f3f6f9}.f-volet{fill:#172438}.f-neige-branche{fill:#e8eff7;opacity:.9}.f-reflets ellipse{fill:#ffc46b;opacity:.16}</style>
  <defs>
    <linearGradient id="${id}-ciel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#071326"/><stop offset=".55" stop-color="#142a50"/><stop offset=".82" stop-color="#2d4a7a"/><stop offset="1" stop-color="#4a6797"/></linearGradient>
    <linearGradient id="${id}-neige" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3f6f9"/><stop offset="1" stop-color="#bccbe0"/></linearGradient>
    <linearGradient id="${id}-sol" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9d7e8"/><stop offset="1" stop-color="#8ea6c4"/></linearGradient>
    <radialGradient id="${id}-fen" cx=".5" cy=".55" r=".75"><stop offset="0" stop-color="#ffe4ac"/><stop offset=".7" stop-color="#f6b65c"/><stop offset="1" stop-color="#d98b3a"/></radialGradient>
    <radialGradient id="${id}-lune" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#eef4ff" stop-opacity=".35"/><stop offset="1" stop-color="#eef4ff" stop-opacity="0"/></radialGradient>
    <pattern id="${id}-bardeau" width="12" height="11" patternUnits="userSpaceOnUse"><rect width="12" height="11" fill="#2b3c57"/><path d="M0 10.5 H12" stroke="#22324a" stroke-width="1.6"/></pattern>
    <pattern id="${id}-garage" width="20" height="25" patternUnits="userSpaceOnUse"><rect width="20" height="25" fill="#3b4f6f"/><path d="M0 24.5 H20" stroke="#2b3c57" stroke-width="2"/></pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#${id}-ciel)"/>
  <g fill="#eef4ff">${etoiles}</g>
  <circle cx="838" cy="92" r="72" fill="url(#${id}-lune)"/>
  <circle cx="838" cy="92" r="24" fill="#eef4ff" opacity=".92"/>
  <circle cx="827" cy="85" r="5" fill="#cfdbea" opacity=".6"/><circle cx="846" cy="101" r="3.5" fill="#cfdbea" opacity=".55"/>
  <g class="f-foret">${foret}</g>
  <path d="M0 470 Q 240 458 480 470 T 960 466 L960 600 L0 600 Z" fill="#a9bdd6"/>

  <!-- Cheminée et fumée -->
  <rect x="548" y="142" width="30" height="62" fill="#5a3b35"/><path d="M548 156 H578 M548 170 H578 M548 184 H578" stroke="#47302b" stroke-width="2"/>
  <rect x="544" y="134" width="38" height="11" rx="5.5" fill="url(#${id}-neige)"/>

  <!-- Maison : murs, toit enneigé, pignon -->
  <rect x="210" y="290" width="440" height="232" fill="url(#${id}-bardeau)"/>
  <path d="M180 293 L276 190 L584 190 L680 293 Z" fill="url(#${id}-neige)"/>
  <path d="M180 293 L276 190" stroke="#ffffff" stroke-opacity=".5" stroke-width="2"/>
  <rect x="178" y="290" width="504" height="9" rx="2" fill="#16243a"/>
  <path d="M338 293 L430 169 L522 293 Z" fill="url(#${id}-bardeau)"/>
  <path d="M312 299 L430 136 L548 299 L524 299 L430 170 L336 299 Z" fill="url(#${id}-neige)"/>
  <path d="M314 297 L430 138 L546 297" fill="none" stroke="#16243a" stroke-width="5" stroke-linejoin="round"/>
  <circle cx="430" cy="238" r="24" class="f-cadre"/><circle cx="430" cy="238" r="19" fill="url(#${id}-fen)"/><path class="f-croisillon" d="M430 219 V257 M411 238 H449"/>

  <!-- Étage -->
  ${fenetre(246, 320, 54, 58, id)}${fenetre(403, 320, 54, 58, id)}${fenetre(560, 320, 54, 58, id)}
  <rect x="210" y="398" width="440" height="6" fill="#22324a"/>
  <!-- Rez-de-chaussée : fenêtres à volets, porte et couronne -->
  ${fenetre(238, 424, 84, 62, id, true)}${fenetre(538, 424, 84, 62, id, true)}
  <rect x="380" y="394" width="100" height="12" rx="4" fill="url(#${id}-neige)"/><rect x="384" y="405" width="92" height="5" fill="#16243a"/>
  <rect x="402" y="416" width="56" height="106" rx="2" fill="#e6edf5"/><rect x="407" y="421" width="46" height="101" fill="#8c2f22"/>
  <path d="M413 432 Q430 422 447 432 V444 H413 Z" fill="url(#${id}-fen)"/>
  <circle cx="430" cy="468" r="11" fill="none" stroke="#1f6b43" stroke-width="6"/><path d="M425 478 L430 474 L435 478 L433 486 L430 481 L427 486 Z" fill="#e0342b"/>
  <circle cx="449" cy="476" r="2.2" fill="#e8c27a"/>

  <!-- Garage -->
  <rect x="650" y="372" width="232" height="150" fill="url(#${id}-bardeau)"/>
  <path d="M640 375 L690 322 L850 322 L900 375 Z" fill="url(#${id}-neige)"/>
  <rect x="638" y="372" width="264" height="8" rx="2" fill="#16243a"/>
  <rect x="682" y="414" width="168" height="108" rx="2" fill="#e6edf5"/><rect x="688" y="420" width="156" height="102" fill="url(#${id}-garage)"/>
  <g fill="url(#${id}-fen)">${[0, 1, 2, 3].map((k) => `<rect x="${f(698 + k * 37)}" y="428" width="28" height="13" rx="1.5"/>`).join('')}</g>

  <!-- Lumière des fenêtres sur la neige -->
  <g class="f-reflets"><ellipse cx="280" cy="532" rx="70" ry="9"/><ellipse cx="580" cy="532" rx="70" ry="9"/><ellipse cx="430" cy="534" rx="40" ry="8"/></g>
  <!-- Sol enneigé, allée, bancs de neige -->
  <path d="M0 520 Q 160 506 330 518 Q 430 526 520 516 Q 720 504 960 516 L960 600 L0 600 Z" fill="url(#${id}-sol)"/>
  <path d="M404 522 H456 L500 600 H360 Z" fill="#9fb4cf"/>
  <path d="M190 526 Q 230 500 270 516 Q 300 498 336 520 Z M528 520 Q 560 498 598 516 Q 630 502 664 524 Z" fill="url(#${id}-neige)"/>
  <!-- Épinette décorée -->
  <g class="f-epinette">${epinette(112, 522, 250, 150, '#0f2b2a')}</g>
  ${mini}

</svg>`;
  const svg = `<svg class="facade-svg" viewBox="0 0 ${W} ${H}" focusable="false" aria-hidden="true">
  <defs>${C9.map((k) => `<radialGradient id="halo-${k.slice(1)}"><stop offset="0" stop-color="${k}" stop-opacity=".95"/><stop offset=".4" stop-color="${k}" stop-opacity=".55"/><stop offset="1" stop-color="${k}" stop-opacity="0"/></radialGradient>`).join('')}</defs>
  <g class="f-fils">${fils}</g>
  <g class="f-ampoules">${ampoules}</g>
</svg>`;
  ecrireFond(fond);
  return html`<figure class="facade-maison ${classe}" ${brut(cible)} data-effet="ampoules-c9" data-grille="manipuler retour" data-visuel data-boucle-css data-facade>
  <img class="facade-fond" src="/assets/images/facade-maison.svg?v=${c.site.version}" alt="" width="960" height="600" decoding="async"${brut(priorite ? ' fetchpriority="high"' : ' loading="lazy"')}>${brut(svg)}<span class="facade-fumee" aria-hidden="true"><i></i><i></i><i></i></span><span class="facade-neige" aria-hidden="true"></span>
  <figcaption class="facade-note">${c.t('commun.facade.note')}</figcaption>
  <button type="button" class="facade-interrupteur" data-interrupteur data-allume="oui"><span class="interrupteur-piste" aria-hidden="true"><span></span></span><span class="si-allume">${c.t('commun.facade.eteindre')}</span><span class="si-eteint">${c.t('commun.facade.allumer')}</span></button>
</figure>`;
}
