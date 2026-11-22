/* Lavage extérieur : grand titre, puis un bandeau pleine largeur ; basse pression, surfaces (avant/après réels),
   gouttières (la ligne de toit devient gouttière), vitres et offres. */
import { html } from '../../outils/gabarit.mjs';
import { ligneToit } from '../gabarits/toit.mjs';
import { fin, avantApres, imageAlt } from '../gabarits/blocs.mjs';
import { existsSync } from 'node:fs';

export const page = { cle: 'lavage-exterieur', fichier: 'lavage-exterieur', imagePartage: 'equipe-hauteur-1280.webp' };

const existe = (n) => existsSync(new URL(`../../assets/images/${n}-1280.webp`, import.meta.url)) || existsSync(new URL(`../../assets/images/${n}-1168.webp`, import.meta.url));
const BANDEAU = existe('grok/lavage-ouverture') ? 'grok/lavage-ouverture' : 'equipe-hauteur';
const GOUTTIERE = existe('grok/gouttiere') ? 'grok/gouttiere' : 'gouttiere-feuilles';
const VITRES = existe('grok/vitres') ? 'grok/vitres' : 'vitres-immeuble';

export default (c) => html`
<section class="page-tete page-tete--lavage" id="debut">
  <div class="conteneur lavage-tete">
    <p class="surtitre" data-anime="gsap">${c.t('lavage.surtitre')}</p>
    <h1 data-grille="typo"><span class="ligne-masque"><span class="page-ligne">${c.t('lavage.titre1')}</span></span><span class="ligne-masque"><span class="page-ligne">${c.tb('lavage.titre2')}</span></span></h1>
    <div class="lavage-tete-bas">
      <p class="page-intro masque-ecran-tres-bas" data-anime="gsap">${c.t('lavage.texte')}</p>
      <div class="hero-actions" data-anime="gsap">
        ${c.lien('contact', { ancre: 'estimation', params: 'service=lavage', classe: 'bouton', texte: c.t('commun.actionEntete'), attrs: 'data-action-principale data-survol="magnetique"' })}
      </div>
      <p class="hero-info" data-info-cle data-anime="gsap"><span class="pastille-saison" aria-hidden="true"></span>${c.t('lavage.info')}</p>
    </div>
  </div>
  ${c.media({ nom: BANDEAU, alt: imageAlt(c, BANDEAU), cadrage: BANDEAU === 'equipe-hauteur' ? '55% 42%' : '50% 55%', priorite: true, classe: 'lavage-bandeau', sizes: '100vw', attrs: 'data-iris-centre data-fx="parallaxe" data-fx-force="8"' })}
</section>

<section class="section basse-pression" id="basse-pression">
  <div class="conteneur bp-grille">
    <div>
      <h2 data-anime="lignes">${c.tb('lavage.bassePression.titre')}</h2>
      <ol class="points" data-anime="cascade">
        <li><span class="etape-num" aria-hidden="true">1</span><p>${c.t('lavage.bassePression.p1')}</p></li>
        <li><span class="etape-num" aria-hidden="true">2</span><p>${c.t('lavage.bassePression.p2')}</p></li>
        <li><span class="etape-num" aria-hidden="true">3</span><p>${c.t('lavage.bassePression.p3')}</p></li>
      </ol>
      <div class="encadre" data-anime>
        <h3>${c.t('lavage.bassePression.complet')}</h3>
        <ul class="liste-coches"><li>${c.t('lavage.bassePression.c1')}</li><li>${c.t('lavage.bassePression.c2')}</li><li>${c.t('lavage.bassePression.c3')}</li></ul>
      </div>
    </div>
    <div class="bp-photos">
      ${c.media({ nom: 'entree-asphalte', alt: imageAlt(c, 'entree-asphalte'), cadrage: '50% 60%', classe: 'bp-1', sizes: '(max-width: 760px) 92vw, 40vw', ratio: '4 / 3', attrs: 'data-anime="rideau"' })}
      ${c.media({ nom: 'lavage-facade', alt: imageAlt(c, 'lavage-facade'), cadrage: '30% 50%', classe: 'bp-2', sizes: '(max-width: 760px) 60vw, 22vw', ratio: '1 / 1', attrs: 'data-fx="vitesse"' })}
    </div>
  </div>
</section>

<section class="section section--glace surfaces" id="surfaces">
  <div class="conteneur surfaces-grille">
    <div>
      <h2 data-anime="lignes">${c.tb('lavage.surfaces.titre')}</h2>
      <p data-anime>${c.t('lavage.surfaces.texte')}</p>
      <div class="filtres" role="group" aria-label="${c.s('lavage.surfaces.filtres')}" data-filtres=".surfaces-liste > li">
        ${c.donnees.lavage.surfaces.map((s, i) => html`<button type="button" data-filtre="${s.cle}" aria-pressed="${i === 0 ? 'true' : 'false'}">${s.nom}</button>`)}
      </div>
      <ul class="surfaces-liste" data-anime="cascade">${c.donnees.lavage.surfaces.flatMap((s, i) => s.items.map((it) => html`<li data-type="${s.cle}"${i ? ' hidden' : ''}>${it}</li>`))}</ul>
    </div>
    ${avantApres(c, { id: 'aa-lavage' })}
  </div>
</section>

<section class="section gouttieres" id="gouttieres">
  ${ligneToit({ variante: 'eau', classe: 'gouttieres-toit', attrs: 'data-effet="gouttiere-eau" data-visuel data-grille="fil"' })}
  <div class="conteneur gouttieres-grille">
    <div>
      <h2 data-anime="lignes">${c.tb('lavage.gouttieres.titre')}</h2>
      <p data-anime>${c.t('lavage.gouttieres.texte')}</p>
      <p class="vapeur-jamais-titre" data-anime>${c.t('lavage.gouttieres.verifs')}</p>
      <ul class="verifs" data-anime="cascade">
        <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5 10 17 19 7"/></svg>${c.t('lavage.gouttieres.v1')}</li>
        <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5 10 17 19 7"/></svg>${c.t('lavage.gouttieres.v2')}</li>
        <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5 10 17 19 7"/></svg>${c.t('lavage.gouttieres.v3')}</li>
      </ul>
      <p data-anime>${c.t('lavage.gouttieres.frequence')}</p>
      <p class="encadre" data-anime>${c.t('lavage.gouttieres.parefeuilles')}</p>
    </div>
    <div class="gouttieres-photos">
      ${c.media({ nom: GOUTTIERE, alt: imageAlt(c, GOUTTIERE), cadrage: '50% 50%', classe: 'gp-1', sizes: '(max-width: 760px) 92vw, 36vw', ratio: '4 / 5', attrs: 'data-anime="rideau"' })}
      ${c.media({ nom: 'gouttiere-debris', alt: imageAlt(c, 'gouttiere-debris'), cadrage: '50% 50%', classe: 'gp-2', sizes: '(max-width: 760px) 50vw, 18vw', ratio: '3 / 4', attrs: 'data-fx="vitesse"' })}
    </div>
  </div>
</section>

<section class="section section--glace vitres" id="vitres">
  <div class="conteneur vitres-grille">
    <div class="vitres-photos" data-anime="cascade">
      ${c.media({ nom: 'vitres-perche', alt: imageAlt(c, 'vitres-perche'), cadrage: '60% 45%', classe: 'vp-1', sizes: '(max-width: 760px) 46vw, 22vw', ratio: '4 / 5' })}
      ${c.media({ nom: VITRES, alt: imageAlt(c, VITRES), cadrage: '50% 40%', classe: 'vp-2', sizes: '(max-width: 760px) 46vw, 22vw', ratio: '4 / 5' })}
    </div>
    <div>
      <h2 data-anime="lignes">${c.tb('lavage.vitres.titre')}</h2>
      <p data-anime>${c.t('lavage.vitres.texte')}</p>
      ${c.media({ nom: 'vitres-apres-construction', alt: imageAlt(c, 'vitres-apres-construction'), cadrage: '50% 50%', classe: 'vitres-chantier', sizes: '(max-width: 760px) 92vw, 30vw', ratio: '16 / 9', attrs: 'data-fx="zoom"' })}
    </div>
  </div>
</section>

${fin(c, { titre: 'offres.titre', texte: 'offres.texte', action: 'lavage.fin.action', params: 'service=lavage', couleurs: ['#ffc46b', '#eef4ff', '#4d8dff'], avecOffres: true })}
`;
