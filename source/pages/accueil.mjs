/* Accueil : ouverture de nuit d'hiver, services de la saison, repère des 24 po, vapeur, lumières,
   avant/après, sécurité, avis, zone et appel final. La ligne de toit (ampoules, glaçons) relie l'ouverture,
   la nuit d'hiver et l'appel final. */
import { html, brut } from '../../outils/gabarit.mjs';
import { ligneToit } from '../gabarits/toit.mjs';
import { jauge, securite, avis, carteZone, rechercheZone, fin, avantApres, choixC9, imageAlt } from '../gabarits/blocs.mjs';
import { existsSync } from 'node:fs';

/* Ouverture : l'illustration de la maison enneigée si elle est arrivée, sinon une vraie photo de PMG. */
const HERO = existsSync(new URL('../../assets/images/grok/accueil-ouverture-1280.webp', import.meta.url)) ? 'grok/accueil-ouverture' : 'noel-blanc-chaud';

export const page = { cle: 'accueil', fichier: 'index', imagePartage: 'noel-blanc-chaud-1280.webp' };

export default (c) => html`
<section class="hero ecran" id="debut">
  ${c.media({ nom: HERO, alt: imageAlt(c, HERO), cadrage: '62% 50%', cadrageMobile: '50% 62%', priorite: true, classe: 'hero-media', sizes: '100vw', attrs: 'data-fx="parallaxe" data-fx-force="6"' })}
  <canvas class="hero-neige" data-neige data-effet="neige" aria-hidden="true" data-audit-ignorer></canvas>
  <div class="hero-texte conteneur">
    <p class="surtitre" data-anime="gsap">${c.t('accueil.hero.surtitre')}</p>
    <h1 class="hero-titre" data-grille="typo"><span class="ligne-masque"><span class="hero-ligne">${c.t('accueil.hero.titre1')}</span></span><span class="ligne-masque"><span class="hero-ligne">${c.tb('accueil.hero.titre2')}</span></span></h1>
    <p class="hero-intro masque-ecran-tres-bas" data-anime="gsap">${c.t('accueil.hero.texte')}</p>
    <div class="hero-actions" data-anime="gsap">
      ${c.lien('contact', { ancre: 'estimation', classe: 'bouton', texte: c.t('accueil.hero.action'), attrs: 'data-action-principale data-survol="magnetique"' })}
      <a class="bouton bouton--contour" href="${c.site.contact.sms}">${c.t('accueil.hero.texter')}</a>
    </div>
    <p class="hero-info" data-info-cle data-anime="gsap"><span class="pastille-saison" aria-hidden="true"></span><span class="saison-si saison-si--hiver">${c.t('accueil.hero.infoHiver')}</span><span class="saison-si saison-si--automne">${c.t('accueil.hero.infoAutomne')}</span><span class="saison-si saison-si--printemps">${c.t('accueil.hero.infoPrintemps')}</span></p>
  </div>
  ${ligneToit({ variante: 'ampoules', n: 37, classe: 'hero-toit', couleurs: ['#ffc46b', '#ff3b30', '#2fd06a', '#ffc46b', '#4d8dff'], attrs: 'data-iris-centre data-effet="ligne-de-toit" data-grille="fil" data-scintille data-boucle-css' })}
</section>

<section class="section saisons" id="saisons">
  <div class="conteneur">
    <div class="saisons-tete">
      <h2 data-anime="lignes">${c.tb('accueil.saison.titre')}</h2>
      <p data-anime>${c.t('accueil.saison.texte')}</p>
    </div>
    <div class="saisons-onglets" role="tablist" aria-label="${c.s('accueil.saison.onglets')}" data-onglets-saison>
      ${c.donnees.saisons.map((s) => html`<button type="button" role="tab" id="onglet-${s.cle}" aria-controls="saison-${s.cle}" data-saison-onglet="${s.cle}">${c.t(`commun.saisons.${s.cle}`)}</button>`)}
    </div>
    ${c.donnees.saisons.map((s) => html`<div class="saisons-panneau" id="saison-${s.cle}" role="tabpanel" aria-labelledby="onglet-${s.cle}" data-saison-panneau="${s.cle}">
      <ul class="cartes-services" data-anime="cascade">${s.cartes.map((k) => html`<li class="carte-service">
        ${c.media({ nom: k.image, alt: '', cadrage: k.cadrage, classe: 'carte-service-media', sizes: '(max-width: 760px) 92vw, 30vw', ratio: '4 / 3', attrs: 'data-fx="zoom" data-fx-force="12"' })}
        <h3>${c.lien(k.page, { ancre: k.ancre, texte: k.titre, classe: 'carte-lien' })}</h3>
        <p>${k.texte}</p>
      </li>`)}</ul>
    </div>`)}
  </div>
</section>

${jauge(c, { titre: 'accueil.jauge.titre', texte: 'accueil.jauge.texte', id: 'repere' })}

<section class="section section--nuit vapeur" id="vapeur">
  ${ligneToit({ variante: 'glacons', classe: 'vapeur-toit', attrs: 'data-effet="barrage-vapeur" data-visuel' })}
  <div class="conteneur vapeur-grille">
    <div class="vapeur-texte">
      <h2 data-anime="lignes">${c.tb('accueil.vapeur.titre')}</h2>
      <p data-anime>${c.t('accueil.vapeur.texte')}</p>
      <p class="vapeur-jamais-titre" data-anime>${c.t('accueil.vapeur.jamais')}</p>
      <ul class="liste-rayee" data-rature>${c.donnees.toiture.jamais.map((j) => html`<li><span>${j}</span></li>`)}</ul>
      <p class="vapeur-delai" data-anime>${c.t('accueil.vapeur.delai')}</p>
      <p data-anime>${c.lien('toiture-hiver', { ancre: 'vapeur', classe: 'lien-fleche', texte: c.t('accueil.vapeur.lien') })}</p>
    </div>
    <div class="vapeur-images">
      ${c.media({ nom: 'vapeur-toit', alt: imageAlt(c, 'vapeur-toit'), cadrage: '50% 35%', classe: 'vapeur-principale', sizes: '(max-width: 760px) 92vw, 36vw', attrs: 'data-anime="rideau"' })}
      ${c.media({ nom: 'vapeur-chantier-nuit', alt: imageAlt(c, 'vapeur-chantier-nuit'), cadrage: '55% 40%', classe: 'vapeur-seconde', sizes: '(max-width: 760px) 60vw, 20vw', attrs: 'data-fx="vitesse"' })}
    </div>
  </div>
</section>

<section class="section section--nuit lumieres" id="lumieres">
  <div class="conteneur lumieres-grille">
    <div class="lumieres-texte">
      <h2 data-anime="lignes">${c.tb('accueil.lumieres.titre')}</h2>
      <p data-anime>${c.t('accueil.lumieres.texte')}</p>
      ${choixC9(c, { id: 'c9-accueil' })}
      <p class="lumieres-note" data-anime>${c.t('accueil.lumieres.note')} <strong>${c.t('accueil.lumieres.dispo')}</strong>.</p>
      <p class="lumieres-actions" data-anime>
        ${c.lien('contact', { ancre: 'estimation', params: 'service=lumieres', classe: 'bouton', texte: c.t('accueil.lumieres.action') })}
        ${c.lien('lumieres-de-noel', { ancre: 'realisations', classe: 'lien-fleche', texte: c.t('accueil.lumieres.lien') })}
      </p>
    </div>
    <div class="lumieres-photo">
      ${c.media({ nom: 'noel-blanc-chaud', alt: imageAlt(c, 'noel-blanc-chaud'), cadrage: '50% 45%', classe: 'lumieres-media', sizes: '(max-width: 760px) 92vw, 50vw', attrs: 'data-fx="parallaxe"' })}
      ${ligneToit({ variante: 'ampoules', n: 25, classe: 'lumieres-toit', couleurs: ['#ffc46b', '#ff3b30', '#2fd06a'], attrs: 'data-effet="ampoules-c9" data-c9-cible data-grille="manipuler retour"' })}
    </div>
  </div>
</section>

<section class="section avant-apres" id="avant-apres">
  <div class="conteneur aa-grille">
    <div class="aa-texte">
      <h2 data-anime="lignes">${c.tb('accueil.avantApres.titre')}</h2>
      <p data-anime>${c.t('accueil.avantApres.texte')}</p>
      <p data-anime>${c.lien('lavage-exterieur', { ancre: 'surfaces', classe: 'lien-fleche', texte: c.t('accueil.avantApres.lien') })}</p>
    </div>
    ${avantApres(c, { id: 'aa-accueil', paires: c.donnees.lavage.paires.slice(0, 3) })}
  </div>
</section>

${securite(c)}

${avis(c)}

<section class="section section--glace zone" id="zone">
  <div class="conteneur zone-grille">
    <div class="zone-texte">
      <h2 data-anime="lignes">${c.tb('accueil.zone.titre')}</h2>
      <p data-anime>${c.t('accueil.zone.texte')}</p>
      ${rechercheZone(c, { id: 'zone-accueil' })}
    </div>
    ${carteZone(c)}
  </div>
</section>

${fin(c, { titre: 'accueil.fin.titre', texte: 'accueil.fin.texte', action: 'accueil.fin.action', couleurs: ['#ffc46b', '#ff3b30', '#2fd06a', '#4d8dff', '#eef4ff'], avecOffres: true })}
`;
