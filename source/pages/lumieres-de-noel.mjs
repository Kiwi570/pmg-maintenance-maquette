/* Lumières de Noël : l'outil d'abord. La façade illustrée (dessinée en code) s'allume avec les couleurs choisies ;
   les vraies réalisations de PMG suivent plus bas. */
import { html, brut } from '../../outils/gabarit.mjs';
import { fin, choixC9, imageAlt } from '../gabarits/blocs.mjs';
import { facadeMaison } from '../gabarits/facade.mjs';

export const page = { cle: 'lumieres-de-noel', fichier: 'lumieres-de-noel', imagePartage: 'noel-heure-bleue-1600.webp' };

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
      ${facadeMaison(c, { id: 'facade', classe: 'facade-maison--grande', cible: 'data-c9-cible-page', priorite: true })}
    </div>
  </div>
</section>

<section class="section couleurs" id="couleurs">
  <div class="conteneur">
    <div class="saisons-tete">
      <h2 data-anime="lignes">${c.tb('lumieres.couleurs.titre')}</h2>
      <p data-anime>${c.t('lumieres.couleurs.texte')}</p>
    </div>
    <div class="couleurs-grille">
      <figure class="couleurs-photo-cadre">
        ${c.media({ nom: 'ampoule-c9-blanc-chaud', alt: imageAlt(c, 'ampoule-c9-blanc-chaud'), cadrage: '50% 50%', classe: 'couleurs-photo', sizes: '(max-width: 760px) 60vw, 26vw', ratio: '1 / 1', attrs: 'data-fx="zoom"' })}
      </figure>
      <div class="couleurs-panneau">
        <svg class="couleurs-fil" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true" data-visuel><path d="M0 2 Q 10 9 20 6 T 40 6 T 60 6 T 80 6 T 100 2" vector-effect="non-scaling-stroke"/></svg>
        <ul class="ampoules-grille" data-ampoules-balance>${c.donnees.c9.map((k, i) => html`<li class="ampoule-carte" style="--c:${k.couleur};--i:${i}">
          <svg viewBox="0 0 60 110" aria-hidden="true" data-visuel><circle class="ac-halo" cx="30" cy="66" r="30"/><rect x="21" y="4" width="18" height="22" rx="3" class="ac-douille"/><path class="ac-verre" d="M30 24 C 52 34 50 78 30 104 C 10 78 8 34 30 24 Z"/><path class="ac-facette" d="M30 28 L30 100 M18 44 L42 44 M16 64 L44 64 M20 84 L40 84"/></svg>
          <p>${k.nom}</p>
        </li>`)}</ul>
        <p class="couleurs-note"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5 10 17 19 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>${c.t('accueil.lumieres.note')}</p>
      </div>
    </div>
  </div>
</section>

<section class="section section--glace service-lumieres" id="service">
  <div class="conteneur">
    <div class="saisons-tete">
      <h2 data-anime="lignes">${c.tb('lumieres.service.titre')}</h2>
      <p data-anime>${c.t('lumieres.service.texte')}</p>
    </div>
    <div class="frise" data-frise>
      <span class="frise-trait" aria-hidden="true" data-visuel></span>
      <ol class="etapes etapes--frise" data-anime="cascade">${c.donnees.lumieres.etapes.map((e, i) => html`<li class="etape" style="--c:${['#ffc46b', '#ff3b30', '#2fd06a', '#4d8dff'][i]}"><span class="etape-num" aria-hidden="true">${String(i + 1)}</span><h3>${e.titre}</h3><p>${e.texte}</p></li>`)}</ol>
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
