/* Blocs qui reviennent d'une page à l'autre : même style, disposition adaptée. */
import { html, brut } from '../../outils/gabarit.mjs';
import { ligneToit } from './toit.mjs';

/* Le repère des 24 po : épaisseur sur une coupe de toit, signes d'alerte, pluie annoncée → avis. */
const toitY = (t) => `110,${235 - t} 320,${95 - t} 530,${235 - t} 530,235 320,95 110,235`;
export function jauge(c, { titre, texte, id = 'repere', fond = 'glace' }) {
  const ep = 14, t = Math.round(ep * (40 / 24));
  return html`<section class="section section--${fond} jauge" id="${id}">
  <div class="conteneur jauge-grille">
    <div class="jauge-texte">
      <h2 data-anime="lignes">${c.tb(titre)}</h2>
      <p data-anime>${c.t(texte)}</p>
      <div class="jauge-controles" data-jauge data-anime>
        <label class="jauge-label" for="${id}-ep">${c.t('jauge.epaisseur')} <output for="${id}-ep" data-jauge-sortie>${ep} ${c.s('jauge.unitePo')}</output></label>
        <input type="range" id="${id}-ep" min="0" max="36" step="1" value="${ep}" data-jauge-ep data-unite="${c.s('jauge.unitePo')}">
        <fieldset class="jauge-signes">
          <legend>${c.t('jauge.signes')}</legend>
          ${c.donnees.toiture.signesNeige.map((s, i) => html`<label class="case"><input type="checkbox" name="signe" value="${i}" data-jauge-signe> <span>${s}</span></label>`)}
          <label class="case"><input type="checkbox" name="pluie" data-jauge-pluie> <span>${c.t('jauge.pluie')}</span></label>
        </fieldset>
      </div>
    </div>
    <div class="jauge-visuel" data-visuel data-effet="jauge-neige">
      <div class="jauge-scene" data-niveau="ok" data-pluie="non">
      <svg class="jauge-coupe" viewBox="0 0 640 360" role="img" aria-label="${c.s('jauge.coupe')}">
        <defs><linearGradient id="${id}-ciel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1a2a"/><stop offset="1" stop-color="#22406a"/></linearGradient>
        <pattern id="${id}-bardeau" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#1b3048"/><path d="M0 9.5 H10" stroke="#152639" stroke-width="1.5"/></pattern>
        <radialGradient id="${id}-fen" cx=".5" cy=".55" r=".75"><stop offset="0" stop-color="#ffe4ac"/><stop offset="1" stop-color="#f0a64a"/></radialGradient></defs>
        <rect x="0" y="0" width="640" height="360" rx="18" fill="url(#${id}-ciel)"/>

        <rect x="414" y="112" width="34" height="80" fill="#5a3b35"/><rect x="409" y="104" width="44" height="12" rx="6" fill="#f3f6f9"/>
        <polygon points="128,232 320,104 512,232" fill="url(#${id}-bardeau)"/>
        <circle cx="320" cy="186" r="15" fill="#e6edf5"/><circle cx="320" cy="186" r="11" fill="url(#${id}-fen)" opacity=".75"/>
        <rect x="150" y="232" width="340" height="128" fill="url(#${id}-bardeau)"/>
        <g class="jauge-fenetres">${brut([[186, 262], [398, 262]].map(([x, y]) => `<rect x="${x - 4}" y="${y - 4}" width="64" height="58" rx="2" fill="#e6edf5"/><rect x="${x}" y="${y}" width="56" height="50" fill="url(#${id}-fen)"/><path d="M${x + 28} ${y} V${y + 50} M${x} ${y + 25} H${x + 56}" stroke="#e6edf5" stroke-width="3"/>`).join(''))}</g>
        <rect x="296" y="276" width="48" height="70" rx="2" fill="#e6edf5"/><rect x="300" y="280" width="40" height="66" fill="#5a3b35"/><circle cx="332" cy="314" r="2.4" fill="#e8c27a"/>
        <g class="jauge-regle"><rect x="196" y="108" width="9" height="69" rx="2" fill="#e6edf5"/>${brut(Array.from({ length: 7 }, (_, k) => `<path d="M205 ${175 - k * 10} h${k === 4 ? -16 : k % 2 ? -4 : -7}" stroke="${k === 4 ? '#ff5b14' : '#0c1a2a'}" stroke-width="${k === 4 ? 3 : 1.6}"/>`).join(''))}</g>
        <polygon class="jauge-neige" data-jauge-neige points="${toitY(t)}" fill="#f3f6f9"/>
        <path class="jauge-toit" d="M100 240 L320 92 L540 240" fill="none" stroke="#ff5b14" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>
        <polyline class="jauge-repere" points="${'110,195 320,55 530,195'}" fill="none" stroke="#ffc46b" stroke-width="2" stroke-dasharray="8 7"/>
        <text x="336" y="44" class="jauge-repere-texte" fill="#ffc46b">${c.s('jauge.repere')}</text>
        <path d="M0 340 Q 160 330 320 338 T 640 334 V342 Q640 360 622 360 H18 Q0 360 0 342 Z" fill="#dfe8f2"/>
        <g class="jauge-alerte" transform="translate(40 36)"><path d="M0 -20 L20 16 H-20 Z" fill="#ff5b14" stroke="#ff5b14" stroke-width="6" stroke-linejoin="round"/><path d="M0 -6 V4 M0 9 V10" stroke="#0c1a2a" stroke-width="4" stroke-linecap="round"/></g>
      </svg>
      <svg class="jauge-meteo" viewBox="0 0 640 360" aria-hidden="true" focusable="false">
        <g class="jauge-flocons" fill="#f3f6f9" data-boucle-css>${brut([[60, 40], [140, 90], [210, 30], [420, 50], [520, 100], [590, 40], [470, 20], [300, 22], [90, 150], [560, 170], [30, 200], [610, 210]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${2 + (i % 3)}" style="--i:${i}"/>`).join(''))}</g>
        <g class="jauge-pluie" data-boucle-css>${brut('<line x1="40" y1="30" x2="34" y2="46" style="--i:0"/><line x1="110" y1="70" x2="104" y2="86" style="--i:1"/><line x1="170" y1="20" x2="164" y2="36" style="--i:2"/><line x1="240" y1="60" x2="234" y2="76" style="--i:3"/><line x1="300" y1="15" x2="294" y2="31" style="--i:4"/><line x1="370" y1="48" x2="364" y2="64" style="--i:5"/><line x1="430" y1="22" x2="424" y2="38" style="--i:6"/><line x1="500" y1="64" x2="494" y2="80" style="--i:7"/><line x1="560" y1="26" x2="554" y2="42" style="--i:8"/><line x1="610" y1="70" x2="604" y2="86" style="--i:9"/><line x1="80" y1="120" x2="74" y2="136" style="--i:10"/><line x1="590" y1="140" x2="584" y2="156" style="--i:11"/><line x1="200" y1="110" x2="194" y2="126" style="--i:12"/><line x1="470" y1="120" x2="464" y2="136" style="--i:13"/>')}</g>
      </svg>
      </div>
      <div class="jauge-verdict" data-jauge-niveau="ok">
        <p class="jauge-verdict-titre">${c.t('jauge.verdict')}</p>
        <p class="jauge-etat" data-jauge-etat aria-live="polite" data-ok="${c.s('jauge.ok')}" data-attention="${c.s('jauge.attention')}" data-depasse="${c.s('jauge.depasse')}" data-pluie="${c.s('jauge.pluieConseil')}" data-alerte="${c.s('jauge.alerte')}">${c.t('jauge.ok')}</p>
        ${c.lien('contact', { ancre: 'estimation', params: 'service=deneigement', classe: 'bouton', texte: c.t('jauge.action') })}
      </div>
    </div>
  </div>
  <p class="conteneur jauge-note">${c.t('jauge.note')}</p>
</section>`;
}

/* Assurance, couverture, travail en hauteur, soumission écrite. */
export function securite(c, { titre = 'accueil.securite.titre', image = 'equipe-hauteur', fond = 'glace' } = {}) {
  const items = [['cnesst', 'M4 20 L12 4 L20 20 Z M12 10 V15 M12 17.5 V18'], ['hauteur', 'M6 21 V4 M18 21 V4 M6 8 H18 M6 13 H18 M6 18 H18'], ['soumission', 'M6 3 H15 L19 7 V21 H6 Z M9 11 H16 M9 15 H16'], ['proprio', 'M12 12 A4 4 0 1 0 12 4 A4 4 0 1 0 12 12 Z M4 21 C4 16 8 14 12 14 C16 14 20 16 20 21']];
  return html`<section class="section section--${fond} securite" id="securite">
  <div class="conteneur securite-grille">
    <div class="securite-texte">
      <h2 data-anime="lignes">${c.tb(titre)}</h2>
      <p class="securite-montant"><strong>${c.l === 'fr' ? html`<span data-compteur="5000000">5 000 000</span>&nbsp;$` : html`$<span data-compteur="5000000">5,000,000</span>`}</strong> <span>${c.t('accueil.securite.montantTexte')}</span></p>
      <ul class="securite-liste" data-anime="cascade">${items.map(([k, d]) => html`<li>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <div><h3>${c.t(`securite.${k}Titre`)}</h3><p>${c.t(`securite.${k}`)}</p></div>
      </li>`)}</ul>
    </div>
    ${c.media({ nom: image, alt: imageAlt(c, image), cadrage: '55% 40%', classe: 'securite-media', sizes: '(max-width: 760px) 100vw, 45vw', attrs: 'data-fx="parallaxe"' })}
  </div>
</section>`;
}

export const imageAlt = (c, nom) => (c.donnees.alts[nom] || '');

/* Avis : citations courtes, dans la langue de la page, et ruban de noms. */
export function avis(c, { filtre } = {}) {
  const liste = (c.donnees.avis[c.l] || []).filter((a) => !a.seulPage && (!filtre || filtre.includes(a.service)));
  const ruban = c.donnees.avis.ruban;
  return html`<section class="section avis" id="avis">
  <div class="conteneur">
    <div class="avis-tete">
      <h2 data-anime="lignes">${c.tb('accueil.avis.titre')}</h2>
      <p data-anime>${c.t('accueil.avis.texte')}</p>
    </div>
    <div class="avis-defile" tabindex="0" role="region" aria-label="${c.s('commun.avisDefiler')}"><ul class="avis-grille" data-anime="cascade">${liste.map((a) => html`<li class="avis-carte">
      <svg class="avis-toit" viewBox="0 0 60 24" aria-hidden="true" data-visuel><path d="M2 22 L30 3 L58 22" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <blockquote><p>${a.texte}</p></blockquote>
      <p class="avis-auteur"><strong>${a.nom}</strong> · ${a.ville}<br><span>${a.service}</span></p>
    </li>`)}</ul></div>
  </div>
  <div class="ruban-section">
    <p class="visuellement-cache">${c.t('accueil.avis.ruban')}</p>
    <div class="ruban" id="ruban-avis" data-boucle-css data-ruban aria-hidden="true"><p>${ruban.join('  ·  ')}  ·  ${ruban.join('  ·  ')}  ·  </p></div>
    <button type="button" class="ruban-pause" data-pause-pour="ruban-avis" data-libelle-pause="${c.s('commun.pause')}" data-libelle-lecture="${c.s('commun.lecture')}"><span data-libelle-bouton>${c.t('commun.pause')}</span></button>
  </div>
</section>`;
}

/* Carte schématique de la zone, de part et d'autre de la rivière des Outaouais, et recherche d'une localité. */
export function carteZone(c, { id = 'carte' } = {}) {
  const v = c.donnees.villes;
  const riv = 'M' + v.riviere.map(([x, y]) => `${x} ${y}`).join(' L');
  const H = v.hauteur;
  return html`<div class="zone-carte" data-visuel data-effet="carte-zone" data-boucle-css>
  <div class="zone-plan">
  <svg viewBox="0 0 ${v.largeur} ${H}" role="img" aria-label="${c.s('zone.carte')}">
    <defs><clipPath id="${id}-cadre"><rect x="0" y="0" width="${v.largeur}" height="${H}" rx="22"/></clipPath></defs>
    <g clip-path="url(#${id}-cadre)">
      <rect x="0" y="0" width="${v.largeur}" height="${H}" class="zone-fond"/>
      <path class="zone-rive zone-rive--qc" d="${riv} L${v.largeur + 20} ${v.riviere[v.riviere.length - 1][1]} L${v.largeur + 20} -20 L-20 -20 L-20 ${v.riviere[0][1]} Z"/>
      <path class="zone-rive zone-rive--on" d="${riv} L${v.largeur + 20} ${v.riviere[v.riviere.length - 1][1]} L${v.largeur + 20} ${H + 20} L-20 ${H + 20} L-20 ${v.riviere[0][1]} Z"/>
    </g>
    <path class="zone-riviere" d="${riv}" pathLength="1" fill="none"/>
    <text class="zone-province" x="40" y="60">${c.s('zone.qc')}</text>
    <text class="zone-province" x="40" y="${H - 40}">${c.s('zone.on')}</text>
    ${v.points.map((p, i) => html`<g class="zone-point zone-point--${p.p}${p.nom === "L'Ange-Gardien" ? ' zone-point--siege' : ''}" style="--i:${i}" data-ville="${p.nom}">
      <title>${p.nom}</title>
      <circle cx="${p.x}" cy="${p.y}" r="${p.nom === "L'Ange-Gardien" ? 11 : 6}"/>
      ${p.etiquette ? html`<text x="${p.x + (p.dx ?? 12)}" y="${p.y + (p.dy ?? 5)}" text-anchor="${p.ancre || 'start'}">${p.nom}</text>` : ''}
    </g>`)}
  </svg>
  ${v.points.filter((p) => p.nom === "L'Ange-Gardien").map((p) => html`<span class="zone-onde" aria-hidden="true" style="left:${(p.x / v.largeur * 100).toFixed(2)}%;top:${(p.y / H * 100).toFixed(2)}%"></span>`)}
  </div>
  <p class="zone-schema">${c.t('zone.schema')} · ${c.t('zone.depart')}</p>
</div>`;
}
export function rechercheZone(c, { id = 'zone' } = {}) {
  const v = c.donnees.villes;
  return html`<div class="zone-recherche" data-zone data-oui="${c.s('zone.oui')}" data-non="${c.s('zone.non')}" data-qc="${c.s('zone.qc')}" data-on="${c.s('zone.on')}">
  <label for="${id}-ville">${c.t('zone.recherche')}</label>
  <input id="${id}-ville" type="search" list="${id}-liste" autocomplete="off" placeholder="${c.s('zone.exemple')}" data-zone-champ>
  <datalist id="${id}-liste">${[...v.qc, ...v.on].map((n) => html`<option value="${n}"></option>`)}</datalist>
  <p class="zone-reponse" data-zone-reponse aria-live="polite"></p>
  <details class="zone-listes">
    <summary>${c.t('zone.listeQc')} · ${c.t('zone.listeOn')}</summary>
    <div class="zone-colonnes">
      <div><p class="zone-col-titre">${c.t('zone.qc')}</p><p data-zone-qc='${JSON.stringify(v.qc)}'>${v.qc.join(', ')}</p></div>
      <div><p class="zone-col-titre">${c.t('zone.on')}</p><p data-zone-on='${JSON.stringify(v.on)}'>${v.on.join(', ')}</p></div>
    </div>
  </details>
</div>`;
}

/* Offres réelles du site actuel (codes promo, référence). */
export function offres(c, { fond = 'fond', titre = true } = {}) {
  return html`<div class="offres">
  <article class="offre"><p class="offre-code">2SERVICES</p><p>${c.t('offres.deuxServices')}</p>${c.lien('contact', { ancre: 'estimation', params: 'code=2SERVICES', classe: 'offre-lien', texte: c.t('offres.utiliser') })}</article>
  <article class="offre"><p class="offre-code">VOISINS25</p><p>${c.t('offres.voisins')}</p><p class="offre-detail">${c.t('offres.voisinsDetail')}</p>${c.lien('contact', { ancre: 'estimation', params: 'code=VOISINS25', classe: 'offre-lien', texte: c.t('offres.utiliser') })}</article>
  <article class="offre"><p class="offre-code">${c.t('offres.referenceTitre')}</p><p>${c.t('offres.reference')}</p><p class="offre-detail">${c.t('offres.referenceDetail')}</p></article>
</div>`;
}

/* Appel final de nuit : la ligne de toit s'allume en entier. */
export function fin(c, { titre, texte, action, params = '', couleurs = ['#ffc46b'], avecOffres = false }) {
  return html`<section class="section section--nuit fin" id="fin">
  ${ligneToit({ variante: 'ampoules', n: 37, classe: 'fin-toit', couleurs, attrs: 'data-effet="ligne-de-toit" data-visuel data-grille="fil" data-scintille data-boucle-css' })}
  <div class="conteneur fin-grille">
    <div>
      <h2 data-anime="lignes">${c.tb(titre)}</h2>
      <p data-anime>${c.t(texte)}</p>
      <p class="fin-actions" data-anime>
        ${c.lien('contact', { ancre: 'estimation', params, classe: 'bouton', texte: c.t(action), attrs: 'data-survol="magnetique"' })}
        <a class="bouton bouton--contour" href="${c.site.contact.sms}">${c.t('accueil.hero.texter')}</a>
      </p>
    </div>
    ${avecOffres ? offres(c) : finCarte(c)}
  </div>
</section>`;
}

/* Carte de contact de l'appel final (pages sans offres) : le numéro en grand, les autres moyens, la zone. */
function finCarte(c) {
  const k = c.site.contact, v = c.donnees.villes;
  const sansFrais = '+1' + k.sansFrais.replace(/\D/g, '').slice(-10);
  return html`<div class="fin-carte" data-anime>
  <svg class="fin-carte-toit" viewBox="0 0 120 40" aria-hidden="true"><path d="M2 36 H38 L60 6 L82 36 H118" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/></svg>
  <p class="fin-carte-titre">${c.t('commun.finCarte.titre')}</p>
  <a class="fin-carte-tel" href="tel:${k.telephoneLien}">${k.telephone}</a>
  <ul class="fin-carte-liste">
    <li><span>${c.t('commun.sansFrais')}</span> <a href="tel:${sansFrais}">${k.sansFrais}</a></li>
    <li><span>${c.t('commun.textos')}</span> <a href="${k.sms}">${c.t('commun.finCarte.textos')}</a></li>
    <li><span>${c.t('commun.courriel')}</span> <span class="selectionnable">${k.email}</span></li>
  </ul>
  <p class="fin-carte-zone">${c.s('commun.finCarte.zone').replace('{qc}', v.qc.length).replace('{on}', v.on.length)}</p>
</div>`;
}

/* Avant / après : réglet qu'on glisse, onglets par surface (vraies photos du client). */
export function avantApres(c, { id = 'avant-apres', paires } = {}) {
  const liste = paires || c.donnees.lavage.paires;
  return html`<div class="aa" data-aa>
  ${liste.length > 1 ? html`<div class="aa-onglets" role="tablist" aria-label="${c.s('lavage.surfaces.filtres')}">${liste.map((p, i) => html`<button type="button" role="tab" id="${id}-onglet-${p.cle}" aria-controls="${id}-${p.cle}" aria-selected="${i === 0 ? 'true' : 'false'}" tabindex="${i === 0 ? '0' : '-1'}" data-aa-onglet="${p.cle}">${p.titre}</button>`)}</div>` : ''}
  ${liste.map((p, i) => html`<div class="aa-paire" id="${id}-${p.cle}" role="tabpanel" aria-labelledby="${id}-onglet-${p.cle}" data-aa-paire="${p.cle}"${i ? brut(' hidden') : ''} style="--ratio:${p.ratio}" data-effet="avant-apres">
    ${c.media({ nom: p.avant, alt: `${c.s('commun.avant')} : ${p.titre}`, classe: 'aa-avant', sizes: '(max-width: 760px) 92vw, 44vw' })}
    <div class="aa-apres-cadre">${c.media({ nom: p.apres, alt: `${c.s('commun.apres')} : ${p.titre}`, classe: 'aa-apres', sizes: '(max-width: 760px) 92vw, 44vw' })}</div>
    <span class="aa-etiquette aa-etiquette--avant" aria-hidden="true">${c.t('commun.avant')}</span>
    <span class="aa-etiquette aa-etiquette--apres" aria-hidden="true">${c.t('commun.apres')}</span>
    <span class="aa-poignee" aria-hidden="true"></span>
    <input class="aa-reglet" type="range" min="0" max="100" value="50" aria-label="${c.s('commun.glisser')} : ${p.titre}" data-aa-reglet>
  </div>`)}
  <p class="aa-consigne">${c.t('commun.glisser')}</p>
</div>`;
}

/* Choix des couleurs C9. */
export function choixC9(c, { id = 'c9' } = {}) {
  return html`<div class="c9-choix" role="group" aria-labelledby="${id}-titre" data-c9-choix>
  <p class="c9-choix-titre" id="${id}-titre">${c.t('accueil.lumieres.choix')}</p>
  <div class="c9-boutons">${c.donnees.c9.map((k, i) => html`<button type="button" class="c9-bouton" aria-pressed="${i === 0 || i === 2 || i === 3 ? 'true' : 'false'}" data-c9="${k.couleur}" style="--c:${k.couleur}"><span class="c9-pastille" aria-hidden="true"></span>${k.nom}</button>`)}</div>
  <p class="c9-consigne"><span class="si-souris">${c.t('commun.cliquerCouleurs')}</span><span class="si-toucher">${c.t('commun.toucherCouleurs')}</span></p>
</div>`;
}

/* Barrage de glace interactif : la vapeur fait fondre les glaçons (bouton, survol ou doigt), l'eau s'égoutte,
   puis on recommence. Le canvas dessine la vapeur et les gouttes ; les glaçons sont ceux de la ligne de toit. */
export function vapeurJeu(c) {
  return html`<div class="vapeur-jeu" data-vapeur-jeu data-effet="barrage-vapeur" data-visuel>
  ${ligneToit({ variante: 'glacons', classe: 'vapeur-toit' })}
  <canvas class="vapeur-canvas" aria-hidden="true" data-audit-ignorer></canvas>
  <div class="vapeur-commande">
    <button type="button" class="bouton-vapeur" data-vapeur-bouton data-etat="pret"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 20c-2-2 2-4 0-6s2-4 0-6M12 20c-2-2 2-4 0-6s2-4 0-6M17 20c-2-2 2-4 0-6s2-4 0-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span class="si-pret">${c.t('commun.vapeur.bouton')}</span><span class="si-fini">${c.t('commun.vapeur.encore')}</span></button>
    <p class="vapeur-astuce" aria-live="polite"><span class="si-pret"><span class="si-souris">${c.t('commun.vapeur.astuceSouris')}</span><span class="si-toucher">${c.t('commun.vapeur.astuceToucher')}</span></span><span class="si-fini">${c.t('commun.vapeur.fini')}</span></p>
  </div>
</div>`;
}
