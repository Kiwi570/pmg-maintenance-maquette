/* Toiture l'hiver : déneigement et déglaçage à la vapeur.
   Ouverture scindée, claire, avec le repère « 24 po » en très grand sur la photo d'un vrai chantier. */
import { html, brut } from '../../outils/gabarit.mjs';
import { ligneToit } from '../gabarits/toit.mjs';
import { jauge, securite, fin, imageAlt, vapeurJeu } from '../gabarits/blocs.mjs';

export const page = { cle: 'toiture-hiver', fichier: 'toiture-hiver', imagePartage: 'vapeur-bord-toit-1500.webp' };

export default (c) => html`
<section class="page-tete page-tete--toiture" id="debut">
  <div class="conteneur page-tete-grille">
    <div>
      <p class="surtitre" data-anime="gsap">${c.t('toiture.surtitre')}</p>
      <h1 data-grille="typo"><span class="ligne-masque"><span class="page-ligne">${c.t('toiture.titre1')}</span></span><span class="ligne-masque"><span class="page-ligne">${c.tb('toiture.titre2')}</span></span></h1>
      <p class="page-intro masque-ecran-tres-bas" data-anime="gsap">${c.t('toiture.texte')}</p>
      <div class="hero-actions" data-anime="gsap">
        ${c.lien('contact', { ancre: 'estimation', params: 'service=deneigement', classe: 'bouton', texte: c.t('commun.actionEntete'), attrs: 'data-action-principale data-survol="magnetique"' })}
        <a class="bouton bouton--contour" href="${c.site.contact.sms}">${c.t('accueil.hero.texter')}</a>
      </div>
      <p class="hero-info" data-info-cle data-anime="gsap"><span class="pastille-saison" aria-hidden="true"></span>${c.t('toiture.info')}</p>
    </div>
    <div class="toiture-visuel">
      ${c.media({ nom: 'vapeur-bord-toit', alt: imageAlt(c, 'vapeur-bord-toit'), cadrage: '50% 30%', priorite: true, classe: 'page-tete-media toiture-media', sizes: '(max-width: 760px) 100vw, 44vw', attrs: 'data-iris-centre data-fx="parallaxe" data-fx-force="6"' })}
      <p class="toiture-chiffre" data-anime="gsap"><strong><span data-compte-arrivee="${c.s('toiture.chiffre').split(/\s/)[0]}">${c.s('toiture.chiffre').split(/\s/)[0]}</span> ${c.s('toiture.chiffre').split(/\s/).slice(1).join(' ')}</strong><span class="masque-ecran-bas">${c.t('toiture.chiffreTexte')}</span></p>
    </div>
  </div>
</section>

<section class="section section--glace signes" id="signes">
  <div class="conteneur">
    <h2 data-anime="lignes">${c.tb('toiture.signes.titre')}</h2>
    <div class="signes-grille">
      <article class="signe-carte">
        ${c.media({ nom: 'deneigement-maison', alt: imageAlt(c, 'deneigement-maison'), cadrage: '50% 40%', classe: 'signe-media', sizes: '(max-width: 760px) 92vw, 40vw', ratio: '16 / 9', attrs: 'data-fx="zoom"' })}
        <h3>${c.t('toiture.signes.neige')}</h3>
        <ul class="liste-coches" data-anime="cascade">${c.donnees.toiture.signesNeige.map((s) => html`<li>${s}</li>`)}</ul>
      </article>
      <article class="signe-carte">
        ${c.media({ nom: 'glacons', alt: imageAlt(c, 'glacons'), cadrage: '50% 35%', classe: 'signe-media', sizes: '(max-width: 760px) 92vw, 40vw', ratio: '16 / 9', attrs: 'data-fx="zoom"' })}
        <h3>${c.t('toiture.signes.glace')}</h3>
        <ul class="liste-coches" data-anime="cascade">${c.donnees.toiture.signesGlace.map((s) => html`<li>${s}</li>`)}</ul>
      </article>
    </div>
    <p class="signes-note" data-anime>${c.t('toiture.signes.note')}</p>
  </div>
</section>

${jauge(c, { titre: 'toiture.jauge.titre', texte: 'toiture.jauge.texte', id: 'repere', fond: 'fond' })}

<section class="section section--glace deneigement" id="deneigement">
  <div class="conteneur">
    <div class="deneigement-tete">
      <h2 data-anime="lignes">${c.tb('toiture.deneigement.titre')}</h2>
      <p data-anime>${c.t('toiture.deneigement.texte')}</p>
    </div>
    <ol class="etapes" data-anime="cascade">${c.donnees.toiture.etapes.map((e, i) => html`<li class="etape"><span class="etape-num" aria-hidden="true">${String(i + 1)}</span><h3>${e.titre}</h3><p>${e.texte}</p></li>`)}</ol>
    <div class="deneigement-bas">
      ${c.media({ nom: 'deneigement-lucarnes', alt: imageAlt(c, 'deneigement-lucarnes'), cadrage: '62% 50%', classe: 'deneigement-media', sizes: '(max-width: 760px) 92vw, 50vw', ratio: '16 / 9', attrs: 'data-anime="rideau"' })}
      <div class="encadres">
        <p class="encadre" data-anime>${c.t('toiture.deneigement.quand')}</p>
        <p class="encadre encadre--attention" data-anime>${c.t('toiture.deneigement.eviter')}</p>
        ${c.media({ nom: 'perimetre-securise', alt: imageAlt(c, 'perimetre-securise'), cadrage: '30% 55%', classe: 'perimetre-media', sizes: '(max-width: 760px) 92vw, 30vw', ratio: '16 / 9', attrs: 'data-fx="vitesse"' })}
      </div>
    </div>
  </div>
</section>

<section class="section section--nuit vapeur vapeur--page" id="vapeur">
  ${vapeurJeu(c)}
  <div class="conteneur vapeur-grille">
    <div class="vapeur-texte">
      <h2 data-anime="lignes">${c.tb('toiture.vapeur.titre')}</h2>
      <p data-anime>${c.t('toiture.vapeur.texte')}</p>
      <p class="vapeur-jamais-titre" data-anime>${c.t('toiture.vapeur.protege')}</p>
      <ul class="pastilles" data-anime="cascade">${c.donnees.toiture.protege.map((p) => html`<li>${p}</li>`)}</ul>
      <p class="vapeur-jamais-titre" data-anime>${c.t('accueil.vapeur.jamais')}</p>
      <ul class="liste-rayee" data-rature>${c.donnees.toiture.jamais.map((j) => html`<li><span>${j}</span></li>`)}</ul>
      <p data-anime>${c.t('toiture.vapeur.aussi')} ${c.t('toiture.vapeur.calcium')}</p>
    </div>
    <div class="vapeur-mosaique">
      ${c.media({ nom: 'vapeur-maison', alt: imageAlt(c, 'vapeur-maison'), cadrage: '60% 40%', classe: 'vm-1', sizes: '(max-width: 760px) 92vw, 40vw', ratio: '4 / 3', attrs: 'data-anime="rideau"' })}
      ${c.media({ nom: 'vapeur-toit-plat', alt: imageAlt(c, 'vapeur-toit-plat'), cadrage: '70% 50%', classe: 'vm-2', sizes: '(max-width: 760px) 45vw, 20vw', ratio: '1 / 1', attrs: 'data-fx="vitesse"' })}
      ${c.media({ nom: 'vapeur-immeuble', alt: imageAlt(c, 'vapeur-immeuble'), cadrage: '55% 35%', classe: 'vm-3', sizes: '(max-width: 760px) 45vw, 20vw', ratio: '1 / 1', attrs: 'data-fx="vitesse"' })}
    </div>
  </div>
</section>

${securite(c, { fond: 'fond' })}

<section class="section section--glace faq" id="faq">
  <div class="conteneur faq-grille">
    <div class="faq-tete">
      <h2 data-anime="lignes">${c.tb('toiture.faq')}</h2>
      <div class="encadre encadre--prix" data-anime>
        <h3>${c.tb('toiture.prix.titre')}</h3>
        <p>${c.t('toiture.prix.texte')}</p>
      </div>
      ${c.media({ nom: 'glacons-soleil', alt: imageAlt(c, 'glacons-soleil'), cadrage: '50% 50%', classe: 'faq-media', sizes: '(max-width: 760px) 92vw, 30vw', ratio: '16 / 9', attrs: 'data-fx="zoom"' })}
    </div>
    <div class="faq-liste" data-anime="cascade">${c.donnees.toiture.faq.map((f) => html`<details class="faq-item"><summary>${f.q}</summary><p>${f.r}</p></details>`)}</div>
  </div>
</section>

${fin(c, { titre: 'toiture.fin.titre', texte: 'toiture.fin.texte', action: 'toiture.fin.action', params: 'service=deneigement', couleurs: ['#ffc46b', '#eef4ff'] })}
`;
