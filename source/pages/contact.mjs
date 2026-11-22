/* Contact : la zone desservie en ouverture (carte animée et recherche), l'estimation gratuite en quatre étapes
   avec récapitulatif en direct (simulée), puis coordonnées et paiement. */
import { html } from '../../outils/gabarit.mjs';
import { carteZone, rechercheZone } from '../gabarits/blocs.mjs';

export const page = { cle: 'contact', fichier: 'contact', imagePartage: 'noel-multicolore-1600.webp' };

const SERVICES = [
  { saison: 'automne', cle: 'gouttieres', fr: 'Nettoyage de gouttières', en: 'Gutter cleaning' },
  { saison: 'automne', cle: 'lumieres', fr: 'Installation des lumières de Noël', en: 'Christmas light installation' },
  { saison: 'hiver', cle: 'deneigement', fr: 'Déneigement de toiture', en: 'Roof snow removal' },
  { saison: 'hiver', cle: 'deglacage', fr: 'Déglaçage à la vapeur', en: 'Steam ice dam removal' },
  { saison: 'printemps', cle: 'gouttieres-printemps', fr: 'Nettoyage de gouttières (printemps)', en: 'Gutter cleaning (spring)' },
  { saison: 'printemps', cle: 'lavage', fr: 'Lavage extérieur complet (basse pression, vitres, gouttières)', en: 'Complete exterior wash (soft wash, windows, gutters)' },
  { saison: 'printemps', cle: 'pression', fr: 'Lavage à pression (autres surfaces)', en: 'Pressure washing (other surfaces)' },
  { saison: 'printemps', cle: 'vitres', fr: 'Lavage des vitres extérieures', en: 'Exterior window cleaning' },
  { saison: 'printemps', cle: 'stationnement', fr: 'Lavage de stationnement', en: 'Parking lot washing' },
];

export default (c) => html`
<section class="page-tete page-tete--contact section--glace" id="debut">
  <div class="conteneur page-tete-grille contact-tete">
    <div>
      <h1 data-grille="typo"><span class="ligne-masque"><span class="page-ligne">${c.t('contact.titre1')}</span></span><span class="ligne-masque"><span class="page-ligne">${c.tb('contact.titre2')}</span></span></h1>
      <p class="page-intro masque-ecran-tres-bas" data-anime="gsap">${c.t('contact.texte')}</p>
      <p class="contact-numero masque-ecran-tres-bas" data-anime="gsap"><a href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a></p>
      <div class="hero-actions" data-anime="gsap">
        <a class="bouton" href="#estimation" data-action-principale>${c.t('contact.action')}</a>
        <a class="bouton bouton--contour" href="${c.site.contact.sms}">${c.t('commun.texter')}</a>
      </div>
      <p class="hero-info" data-info-cle data-anime="gsap"><span class="pastille-saison" aria-hidden="true"></span>${c.t('contact.info')}</p>
    </div>
    <div class="contact-zone" data-iris-centre>
      ${carteZone(c)}
      ${rechercheZone(c, { id: 'zone-contact' })}
    </div>
  </div>
</section>

<section class="section estimation" id="estimation">
  <div class="conteneur estimation-grille">
    <div>
      <h2 data-anime="lignes">${c.tb('contact.estimation.titre')}</h2>
      <ol class="puces-etapes" aria-label="${c.s('contact.estimation.etapes')}" data-anime="cascade">
        ${['e1', 'e2', 'e3', 'e4'].map((e, i) => html`<li data-puce><span>${String(i + 1)}</span>${c.t(`contact.estimation.${e}`)}</li>`)}
      </ol>
      <form class="formulaire" data-formulaire data-etapes action="#" novalidate data-effet="formulaire-etapes">
        <fieldset data-etape>
          <legend>${c.t('contact.estimation.e1')}</legend>
          ${['automne', 'hiver', 'printemps'].map((s) => html`<div class="groupe-services">
            <p class="groupe-titre">${c.t(`commun.saisons.${s}`)}</p>
            ${SERVICES.filter((x) => x.saison === s).map((x) => html`<label class="case"><input type="checkbox" name="services" value="${x.cle}" data-service="${x.cle}"> <span>${x[c.l]}</span></label>`)}
          </div>`)}
          <p class="champ-erreur" data-erreur-services hidden role="alert">${c.t('contact.estimation.aucunService')}</p>
          <div class="champ"><label for="f-propriete">${c.t('contact.estimation.propriete')}</label>
            <select id="f-propriete" name="propriete">
              <option value="residentielle">${c.t('contact.estimation.residentielle')}</option>
              <option value="commerciale">${c.t('contact.estimation.commerciale')}</option>
              <option value="institutionnelle">${c.t('contact.estimation.institutionnelle')}</option>
            </select></div>
          <p class="etape-actions"><button type="button" class="bouton" data-suivant>${c.t('contact.estimation.suivant')}</button></p>
        </fieldset>
        <fieldset data-etape hidden>
          <legend>${c.t('contact.estimation.e2')}</legend>
          <div class="champ"><label for="f-rue">${c.t('contact.estimation.rue')}</label><input id="f-rue" name="rue" autocomplete="street-address" required></div>
          <div class="champ-ligne">
            <div class="champ"><label for="f-ville">${c.t('contact.estimation.ville')}</label><input id="f-ville" name="ville" list="zone-contact-liste" autocomplete="address-level2" required></div>
            <div class="champ"><label for="f-cp">${c.t('contact.estimation.codePostal')}</label><input id="f-cp" name="cp" autocomplete="postal-code"></div>
          </div>
          <p class="etape-actions"><button type="button" class="bouton bouton--contour" data-precedent>${c.t('contact.estimation.precedent')}</button><button type="button" class="bouton" data-suivant>${c.t('contact.estimation.suivant')}</button></p>
        </fieldset>
        <fieldset data-etape hidden>
          <legend>${c.t('contact.estimation.e3')}</legend>
          <div class="champ"><label for="f-nom">${c.t('contact.estimation.nom')}</label><input id="f-nom" name="nom" autocomplete="name" required></div>
          <div class="champ"><label for="f-entreprise">${c.t('contact.estimation.entreprise')}</label><input id="f-entreprise" name="entreprise" autocomplete="organization"></div>
          <div class="champ"><label for="f-email">${c.t('contact.estimation.email')}</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
          <div class="champ"><label for="f-tel">${c.t('contact.estimation.tel')}</label><input id="f-tel" name="tel" type="tel" autocomplete="tel"></div>
          <div class="champ"><label for="f-pref">${c.t('contact.estimation.preference')}</label>
            <select id="f-pref" name="preference"><option value="courriel">${c.t('contact.estimation.prefCourriel')}</option><option value="telephone">${c.t('contact.estimation.prefTel')}</option><option value="texto">${c.t('contact.estimation.prefTexto')}</option></select></div>
          <p class="etape-actions"><button type="button" class="bouton bouton--contour" data-precedent>${c.t('contact.estimation.precedent')}</button><button type="button" class="bouton" data-suivant>${c.t('contact.estimation.suivant')}</button></p>
        </fieldset>
        <fieldset data-etape hidden>
          <legend>${c.t('contact.estimation.e4')}</legend>
          <div class="champ"><label for="f-code">${c.t('contact.estimation.code')}</label>
            <select id="f-code" name="code"><option value="">${c.t('contact.estimation.codeAucun')}</option><option value="2SERVICES">2SERVICES</option><option value="VOISINS25">VOISINS25</option></select></div>
          <div class="champ"><label for="f-referent">${c.t('contact.estimation.referent')}</label><input id="f-referent" name="referent" autocomplete="off"></div>
          <div class="champ"><label for="f-source">${c.t('contact.estimation.source')}</label>
            <select id="f-source" name="source"><option value="">${c.t('contact.estimation.sourceChoisir')}</option><option>${c.t('contact.estimation.sourceRecherche')}</option><option>${c.t('contact.estimation.sourceReference')}</option><option>${c.t('contact.estimation.sourceVoisin')}</option><option>${c.t('contact.estimation.sourceAutre')}</option></select></div>
          <div class="champ"><label for="f-message">${c.t('contact.estimation.message')}</label><textarea id="f-message" name="message" rows="4"></textarea></div>
          <p class="mention-donnees">${c.t('contact.estimation.donnees')} <a href="#pied-legal" data-sans-transition>${c.t('contact.estimation.politique')}</a></p>
          <p class="etape-actions"><button type="button" class="bouton bouton--contour" data-precedent>${c.t('contact.estimation.precedent')}</button><button type="submit" class="bouton">${c.t('contact.estimation.envoyer')}</button></p>
          <p data-message-envoi role="status" tabindex="-1" hidden data-texte="${c.s('contact.estimation.envoye')}"></p>
        </fieldset>
      </form>
    </div>
    <aside class="recap" data-recap data-vide="${c.s('contact.estimation.recapVide')}" data-desservie="${c.s('contact.estimation.desservie')}" data-nonlistee="${c.s('contact.estimation.nonListee')}" data-remise="${c.s('contact.estimation.recapRemise')}" aria-live="polite">
      <svg class="recap-toit" viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true" data-visuel data-grille="fil"><path d="M0 22 H34 L50 3 L66 22 H100" fill="none" stroke="currentColor" stroke-width="3" vector-effect="non-scaling-stroke"/></svg>
      <h3>${c.t('contact.estimation.recap')}</h3>
      <ul class="recap-services" data-recap-services><li class="vide">${c.t('contact.estimation.recapVide')}</li></ul>
      <p><span class="recap-libelle">${c.t('contact.estimation.recapVille')}</span> <span data-recap-ville>—</span></p>
      <p><span class="recap-libelle">${c.t('contact.estimation.recapCode')}</span> <span data-recap-code>—</span></p>
    </aside>
  </div>
</section>

<section class="section section--nuit coordonnees" id="coordonnees">
  <div class="conteneur coord-grille">
    <div>
      <h2 data-anime="lignes">${c.tb('contact.coordonnees.titre')}</h2>
      <p data-anime>${c.t('contact.coordonnees.texte')}</p>
    </div>
    <ul class="coord-cartes" data-anime="cascade">
      <li><p class="coord-libelle">${c.t('commun.telephone')}</p><a class="coord-valeur" href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a></li>
      <li><p class="coord-libelle">${c.t('commun.sansFrais')}</p><a class="coord-valeur" href="tel:${c.site.contact.sansFraisLien}">${c.site.contact.sansFrais}</a></li>
      <li><p class="coord-libelle">${c.t('commun.textos')}</p><a class="coord-valeur" href="${c.site.contact.sms}">${c.site.contact.telephone}</a></li>
      <li><p class="coord-libelle">${c.t('commun.courriel')}</p><p class="coord-valeur selectionnable">${c.site.contact.email}</p></li>
      <li class="coord-large"><p class="coord-libelle">${c.t('commun.adresse')}</p><p class="coord-valeur">${c.site.contact.adresse}</p></li>
      <li class="coord-large"><p class="coord-libelle">${c.t('contact.paiement.titre')}</p><p>${c.t('contact.paiement.texte')}</p></li>
    </ul>
  </div>
</section>
`;
