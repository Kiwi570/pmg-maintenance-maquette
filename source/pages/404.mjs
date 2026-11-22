/* Page 404 aux couleurs du client, avec son image. Une seule version (langue par défaut). */
import { html } from '../../outils/gabarit.mjs';
import { ligneToit } from '../gabarits/toit.mjs';
import { imageAlt } from '../gabarits/blocs.mjs';
import { existsSync } from 'node:fs';

const IMAGE = existsSync(new URL('../../assets/images/grok/page-404-1280.webp', import.meta.url)) ? 'grok/page-404' : 'glacons-soleil';

export const page = { cle: '404', fichier: '404', langues: ['fr'], partage: false };

export default (c) => html`
<section class="page-tete page-tete--404 section--nuit" id="debut">
  <div class="conteneur page-tete-grille">
    <div>
      <h1 data-anime="lignes" data-grille="typo">${c.tb('introuvable.titre')}</h1>
      <p data-anime>${c.t('introuvable.texte')}</p>
      <p data-anime>${c.lien('accueil', { classe: 'bouton', texte: c.t('introuvable.retour'), attrs: 'data-action-principale' })}</p>
      <p class="hero-info" data-info-cle data-anime>${c.site.contact.telephone} · ${c.site.contact.email}</p>
    </div>
    ${c.media({ nom: IMAGE, alt: imageAlt(c, IMAGE), priorite: true, classe: 'page-tete-media', sizes: '(max-width: 760px) 100vw, 45vw', attrs: 'data-iris-centre' })}
  </div>
  ${ligneToit({ variante: 'glacons', classe: 'page-toit', attrs: 'data-effet="barrage-vapeur"' })}
</section>
`;
