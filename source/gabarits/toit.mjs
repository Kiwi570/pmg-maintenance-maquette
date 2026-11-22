/* Ligne de toit : l'idée de la direction « Au bord du toit ».
   Un bord de toit avec un pignon au centre, tracé en SVG étiré sur toute la largeur (trait d'épaisseur constante),
   et des éléments posés le long du tracé en pourcentages (ils gardent leur taille quelle que soit la largeur) :
   - ampoules : ampoules C9 qui pendent sous le bord du toit (couleurs posées par --c, allumées par .allumee) ;
   - glacons : glaçons qui pendent sous les avant-toits ;
   - eau : gouttière où l'eau s'écoule.
   Elle revient à quelques endroits seulement : ouverture et appel final (ampoules), vapeur (glaçons), gouttières (eau). */
import { html, brut } from '../../outils/gabarit.mjs';

/* Tracé en pourcentages (x de 0 à 100, y de 0 à 100) : avant-toit, pignon, avant-toit. */
const TRACE = [[0, 82], [34, 82], [50, 14], [66, 82], [100, 82]];
const RAPPORT = 9; /* largeur / hauteur supposée, pour répartir les ampoules à intervalles réguliers */

function points(n, segments = TRACE) {
  const segs = [];
  let total = 0;
  for (let i = 1; i < segments.length; i++) {
    const [x0, y0] = segments[i - 1], [x1, y1] = segments[i];
    const l = Math.hypot((x1 - x0) * RAPPORT, y1 - y0);
    segs.push({ x0, y0, x1, y1, l, debut: total });
    total += l;
  }
  return Array.from({ length: n }, (_, k) => {
    const d = ((k + 0.5) / n) * total;
    const s = segs.find((g) => d >= g.debut && d <= g.debut + g.l) || segs[segs.length - 1];
    const t = (d - s.debut) / s.l;
    return [+(s.x0 + (s.x1 - s.x0) * t).toFixed(2), +(s.y0 + (s.y1 - s.y0) * t).toFixed(2)];
  });
}

const chemin = 'M' + TRACE.map(([x, y]) => `${x} ${y}`).join(' L');

/**
 * @param {object} o
 * @param {'ampoules'|'glacons'|'eau'} o.variante
 * @param {number} [o.n] nombre d'éléments
 * @param {string} [o.classe] classes en plus
 * @param {string} [o.attrs] attributs en plus (data-effet, data-iris-centre…)
 * @param {string[]} [o.couleurs] couleurs de départ des ampoules, répétées
 * @param {string} [o.label] nom pour les lecteurs d'écran (sinon décoratif)
 */
export function ligneToit({ variante = 'ampoules', n = 31, classe = '', attrs = '', couleurs = ['#ffc46b'], label = '' } = {}) {
  let elements = '';
  if (variante === 'ampoules') {
    elements = points(n).map(([x, y], i) => `<span class="c9" style="--x:${x}%;--y:${y}%;--i:${i};--c:${couleurs[i % couleurs.length]}"></span>`).join('');
  } else if (variante === 'glacons') {
    /* Glaçons sous les avant-toits seulement (pas sous les pentes du pignon), longueurs variées mais fixes. */
    const L = [62, 38, 80, 48, 30, 70, 44, 90, 36, 58, 28, 74, 50, 40, 84, 34];
    const xs = [];
    for (let x = 1.5; x < 33; x += 2.6) xs.push(x);
    for (let x = 67.5; x < 99; x += 2.6) xs.push(x);
    elements = xs.map((x, i) => `<span class="glacon" style="--x:${x.toFixed(1)}%;--y:82%;--l:${L[i % L.length]}%;--i:${i}"></span>`).join('');
  } else if (variante === 'eau') {
    elements = '<span class="goutte" style="--x:99%;--y:82%"></span>';
  }
  const role = label ? brut(`role="img" aria-label="${label}"`) : brut('aria-hidden="true"');
  return html`<div class="toit toit--${variante} ${classe}" ${role}${brut(attrs ? ' ' + attrs : '')}>
  <svg class="toit-trait" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false"><path d="${chemin}" pathLength="1" vector-effect="non-scaling-stroke"/>${variante === 'eau' ? brut(`<path class="toit-eau" d="M0 82 L34 82 M66 82 L100 82" pathLength="1" vector-effect="non-scaling-stroke"/>`) : ''}</svg>
  ${brut(elements)}
</div>`;
}
