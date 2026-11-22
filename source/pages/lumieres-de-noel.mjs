/* Lumières de Noël : l'outil d'abord. La façade s'allume avec les couleurs choisies :
   les ampoules sont posées sur sa ligne de toit, dans le repère de l'image
   (SVG au même cadrage que l'image : viewBox aux dimensions de l'image, preserveAspectRatio « slice »). */
import { html, brut } from '../../outils/gabarit.mjs';
import { fin, choixC9, imageAlt } from '../gabarits/blocs.mjs';
import { ligneToit } from '../gabarits/toit.mjs';
import { existsSync, readFileSync } from 'node:fs';

export const page = { cle: 'lumieres-de-noel', fichier: 'lumieres-de-noel', imagePartage: 'noel-heure-bleue-1600.webp' };

const racine = new URL('../../', import.meta.url);
const FACADE = existsSync(new URL('assets/images/grok/lumieres-facade-1280.webp', racine)) && existsSync(new URL('donnees/facade.json', racine))
  ? JSON.parse(readFileSync(new URL('donnees/facade.json', racine), 'utf8')) : null;

/* Points répartis à intervalles réguliers le long d'une ligne brisée (pixels de l'image). */
function lelong(trace, pas) {
  const pts = [];
  for (let i = 1; i < trace.length; i++) {
    const [x0, y0] = trace[i - 1], [x1, y1] = trace[i];
    const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / pas));
    for (let k = i === 1 ? 0 : 1; k <= n; k++) pts.push([x0 + ((x1 - x0) * k) / n, y0 + ((y1 - y0) * k) / n]);
  }
  return pts;
}

/* Une ampoule C9 en SVG : douille, verre à facettes, halo. r = taille de base en pixels de l'image. */
function ampoule([x, y], i, r, couleur) {
  const f = (v) => v.toFixed(1);
  const verre = `M0 ${f(r * 0.6)} C ${f(r)} ${f(r * 0.9)} ${f(r * 0.9)} ${f(r * 2.2)} 0 ${f(r * 2.6)} C ${f(-r * 0.9)} ${f(r * 2.2)} ${f(-r)} ${f(r * 0.9)} 0 ${f(r * 0.6)} Z`;
  return `<g class="c9-svg" style="--c:${couleur};--i:${i}" transform="translate(${f(x)} ${f(y)})"><circle class="c9-halo" cy="${f(r * 1.6)}" r="${f(r * 2.8)}"/><rect class="c9-douille" x="${f(-r * 0.35)}" y="0" width="${f(r * 0.7)}" height="${f(r * 0.65)}"/><path class="c9-verre" d="${verre}"/></g>`;
}

function facade(c) {
  const f = FACADE, cols = ['#ffc46b', '#ff3b30', '#2fd06a'];
  const pts = f.traces.flatMap((t) => lelong(t, f.pas));
  return html`<svg class="facade-ampoules" viewBox="0 0 ${f.largeur} ${f.hauteur}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" data-c9-cible-page data-effet="ampoules-c9" data-grille="manipuler retour">
    ${f.traces.map((t) => html`<polyline class="facade-fil" points="${t.map((p) => p.join(',')).join(' ')}"/>`)}
    ${brut(pts.map((p, i) => ampoule(p, i, f.r, cols[i % cols.length])).join(''))}
  </svg>`;
}

export default (c) => html`
<section class="page-tete page-tete--lumieres section--nuit" id="debut">
  <div class="conteneur page-tete-grille lumieres-tete">
    <div>
      <p class="surtitre" data-anime="gsap">${c.t('lumieres.surtitre')}</p>
      <h1 data-grille="typo"><span class="ligne-masque"><span class="page-ligne">${c.t('lumieres.titre1')}</span></span><span class="ligne-masque"><span class="page-ligne">${c.tb('lumieres.titre2')}</span></span></h1>
      <p class="page-intro masque-ecran-bas" data-anime="gsap">${c.t('lumieres.texte')}</p>
      <div class="hero-actions" data-anime="gsap">
        ${c.lien('contact', { ancre: 'estimation', params: 'service=lumieres', classe: 'bouton', texte: c.t('lumieres.action'), attrs: 'data-action-principale data-survol="magnetique"' })}
      </div>
      <p class="hero-info" data-info-cle data-anime="gsap"><span class="pastille-saison" aria-hidden="true"></span>${c.t('lumieres.info')}</p>
      <div data-anime="gsap">${choixC9(c, { id: 'c9-page' })}</div>
    </div>
    <div class="facade" data-iris-centre>
      ${FACADE
        ? html`${c.media({ nom: 'grok/lumieres-facade', alt: c.s('lumieres.alt'), cadrage: '50% 50%', priorite: true, classe: 'facade-media', sizes: '(max-width: 760px) 100vw, 50vw' })}${facade(c)}<p class="facade-note">${c.t('lumieres.simulation')}</p>`
        : c.media({ nom: 'noel-heure-bleue', alt: c.loc({ fr: 'Maison de brique à l\u2019heure bleue, arbres et ligne de toit illuminés par PMG', en: 'Brick house at blue hour, trees and roofline lit by PMG' }), cadrage: '60% 50%', priorite: true, classe: 'facade-media', sizes: '(max-width: 760px) 100vw, 50vw', attrs: 'data-fx="parallaxe" data-fx-force="6"' })}${ligneToit({ variante: 'ampoules', n: 27, classe: 'facade-toit', couleurs: ['#ffc46b', '#ff3b30', '#2fd06a'], attrs: 'data-c9-cible-page data-effet="ampoules-c9" data-grille="manipuler retour"' })}
    </div>
  </div>
</section>

<section class="section couleurs" id="couleurs">
  <div class="conteneur">
    <div class="saisons-tete">
      <h2 data-anime="lignes">${c.tb('lumieres.couleurs.titre')}</h2>
      <p data-anime>${c.t('lumieres.couleurs.texte')}</p>
    </div>
    <ul class="ampoules-grille" data-anime="cascade">${c.donnees.c9.map((k) => html`<li class="ampoule-carte" style="--c:${k.couleur}">
      <svg viewBox="0 0 60 110" aria-hidden="true" data-visuel><circle class="ac-halo" cx="30" cy="66" r="30"/><rect x="21" y="4" width="18" height="22" rx="3" class="ac-douille"/><path class="ac-verre" d="M30 24 C 52 34 50 78 30 104 C 10 78 8 34 30 24 Z"/><path class="ac-facette" d="M30 28 L30 100 M18 44 L42 44 M16 64 L44 64 M20 84 L40 84"/></svg>
      <p>${k.nom}</p>
    </li>`)}</ul>
    <div class="couleurs-bas">
      ${c.media({ nom: 'ampoule-c9-blanc-chaud', alt: imageAlt(c, 'ampoule-c9-blanc-chaud'), cadrage: '50% 50%', classe: 'couleurs-photo', sizes: '(max-width: 760px) 50vw, 18vw', ratio: '1 / 1', attrs: 'data-fx="zoom"' })}
      <p class="encadre" data-anime>${c.t('accueil.lumieres.note')}</p>
    </div>
  </div>
</section>

<section class="section section--glace service-lumieres" id="service">
  <div class="conteneur">
    <div class="saisons-tete">
      <h2 data-anime="lignes">${c.tb('lumieres.service.titre')}</h2>
      <p data-anime>${c.t('lumieres.service.texte')}</p>
    </div>
    <div class="frise">
      <svg class="frise-trait" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true" data-visuel><path d="M0 5 H100" vector-effect="non-scaling-stroke"/></svg>
      <ol class="etapes etapes--frise" data-anime="cascade">${c.donnees.lumieres.etapes.map((e, i) => html`<li class="etape"><span class="etape-num" aria-hidden="true">${String(i + 1)}</span><h3>${e.titre}</h3><p>${e.texte}</p></li>`)}</ol>
    </div>
  </div>
</section>

<section class="section section--nuit realisations" id="realisations">
  <div class="conteneur">
    <div class="saisons-tete">
      <h2 data-anime="lignes">${c.tb('lumieres.realisations.titre')}</h2>
      <div class="filtres" role="group" aria-label="${c.s('lumieres.realisations.filtres')}" data-filtres=".galerie-noel > li">
        <button type="button" data-filtre="tout" aria-pressed="true">${c.t('lumieres.realisations.tout')}</button>
        <button type="button" data-filtre="residentiel" aria-pressed="false">${c.t('lumieres.realisations.residentiel')}</button>
        <button type="button" data-filtre="commercial" aria-pressed="false">${c.t('lumieres.realisations.commercial')}</button>
      </div>
    </div>
    <ul class="galerie-noel" data-anime="cascade">${c.donnees.lumieres.galerie.map((g, i) => html`<li data-type="${g.type}" class="${i === 0 ? 'grand' : ''}">
      ${c.media({ nom: g.image, alt: g.alt, cadrage: g.cadrage, classe: 'galerie-media', sizes: i === 0 ? '(max-width: 760px) 92vw, 60vw' : '(max-width: 760px) 92vw, 30vw', attrs: 'data-fx="zoom" data-fx-force="10"' })}
    </li>`)}</ul>
  </div>
</section>

<section class="section garantie" id="garantie">
  <div class="conteneur garantie-grille">
    <div>
      <h2 data-anime="lignes">${c.tb('lumieres.garantie.titre')}</h2>
      <p data-anime>${c.t('lumieres.garantie.texte')}</p>
    </div>
    <ul class="avis-grille avis-grille--deux" data-anime="cascade">${(c.donnees.avis[c.l] || []).filter((a) => /Noël|Christmas/.test(a.service)).map((a) => html`<li class="avis-carte">
      <svg class="avis-toit" viewBox="0 0 60 24" aria-hidden="true" data-visuel><path d="M2 22 L30 3 L58 22" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <blockquote><p>${a.texte}</p></blockquote>
      <p class="avis-auteur"><strong>${a.nom}</strong> · ${a.ville}</p>
    </li>`)}</ul>
  </div>
</section>

${fin(c, { titre: 'lumieres.fin.titre', texte: 'lumieres.fin.texte', action: 'lumieres.fin.action', params: 'service=lumieres', couleurs: ['#ffc46b', '#ff3b30', '#2fd06a', '#4d8dff', '#eef4ff'] })}
`;
