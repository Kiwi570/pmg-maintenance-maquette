# PMG Maintenance · maquette

Maquette de présentation du nouveau site de PMG Maintenance (entretien extérieur de bâtiment, Ottawa-Gatineau), direction « Au bord du toit ».
Adresse de la maquette : https://pmg-maintenance-maquette.vercel.app (à mettre dans le module Wix « Intégrer un site »).

## Pages (v1)

| Page | Ouverture | Contenu |
|---|---|---|
| Accueil `/` | plein cadre de nuit, ligne de toit d'ampoules C9 | services de la saison (onglets), repère des 24 po, vapeur, lumières (couleurs à composer), avant/après, sécurité, avis, zone desservie, estimation et offres |
| Toiture l'hiver `/toiture-hiver` | scindée claire, « 24 po » en très grand sur une photo de chantier | signes d'alerte, repère des 24 po, déneigement en 4 étapes, déglaçage à la vapeur, sécurité, FAQ |
| Lumières de Noël `/lumieres-de-noel` | l'outil d'abord : une vraie maison illuminée, la ligne de toit prend les couleurs choisies (avec l'image Grok « lumieres-facade », les ampoules se posent sur la façade elle-même) | 5 couleurs C9, service de l'automne au printemps, réalisations filtrables, garantie |
| Lavage extérieur `/lavage-exterieur` | grand titre puis bandeau pleine largeur (l'équipe sur ses échelles) | basse pression, surfaces et avant/après réels, gouttières, vitres, offres |
| Contact `/contact` | carte de la zone et recherche d'une ville | estimation gratuite en 4 étapes avec récapitulatif, coordonnées, paiement |
| 404 | « Cette page est restée sous la neige » | |

Toutes les pages existent en français et en anglais (`/en/…`). La saison du jour choisit l'information clé de l'accueil et l'onglet ouvert ; pour une présentation, `?saison=automne`, `?saison=hiver` ou `?saison=printemps` la force.

Pages du site actuel non reprises en v1 (disponibles en v2) : Témoignages (48 avis, page 2 comprise), Rabais, Villes desservies et Paiement en pages à part (leur contenu est repris en sections), pages de services séparées pour les gouttières, les vitres et le déglaçage.

## À fournir par le client (à compléter)

- Mentions légales : raison sociale, adresse, numéro d'entreprise du Québec (NEQ) ou équivalent, responsable de la publication.
- Politique de confidentialité (Loi 25 au Québec ; LPRPDE au fédéral).
- Hébergeur : Vercel Inc., adresse à vérifier sur le site de Vercel au moment de la mise en ligne.
- Assurances : attestation de la police de 5 000 000 $ si elle doit être montrée.
- Logo : aucun logo n'a été trouvé sur le site actuel. La maquette utilise une marque provisoire (un pignon et trois ampoules) à remplacer par le vrai logo s'il existe.
- Crédits photos : toutes les photos de la v1 viennent du site actuel de PMG Maintenance. Aucune image générée n'est utilisée ; si des images Grok sont ajoutées (document `_suivi/pmg-maintenance-images-grok.docx`), elles porteront la mention « Illustration générée », à garder sur le site final.

### Retiré ou remplacé faute d'information

- Tarifs : aucun prix publié ; remplacé par « soumission écrite gratuite » et les critères de prix du site actuel (toiture, lavage).
- Horaires : aucun horaire publié ; aucun statut « ouvert maintenant » n'est affiché.
- Réseaux sociaux et avis Google : aucun lien sur le site actuel ; non affichés.

### Points à confirmer

- Année de fondation : le site dit « depuis 2015 » (accueil, pages hiver) et « établie en 2014 » (autres pages). La maquette affiche 2015.
- Charges de neige : la page Déneigement indique que « 8 pouces de neige fraîche ≈ 20 lb/pi² », « 16 pouces de neige tassée ≈ 20 lb/pi² » et « 4 pouces de glace ≈ 20 lb/pi² », et recommande de déneiger vers 24 pouces. Ces équivalences paraissent incohérentes entre elles et avec le seuil de 24 po (à vérifier, par exemple auprès de la Régie du bâtiment du Québec). La maquette ne calcule donc aucune charge : l'outil s'appuie seulement sur le repère des 24 po, les signes d'alerte et la pluie annoncée.
- « Premier à avoir introduit le déglaçage professionnel à la vapeur dans la région » : non affiché, à confirmer avant de l'utiliser.
- Les citations d'avis sont recopiées du site actuel (pages Témoignages, Déglaçage, Gouttières, Vitres) : à relire mot pour mot avant la mise en ligne.
- « Limoges » figure dans les deux listes de villes (Québec et Ontario) ; « Montréal » apparaît dans des métadonnées du site actuel ; « Discovery » est écrit pour Discover.
- Le lien « Pour envoyer un texto » du site actuel lance un appel : dans la maquette, il ouvre bien les messages (`sms:`).

## À la mise en ligne définitive

- Retirer : la balise `noindex` (dans `source/gabarits/commun.mjs`) et l'en-tête `X-Robots-Tag` (dans `vercel.json`), les formulaires simulés (brancher l'envoi réel), les mentions « à compléter » du pied de page une fois les textes fournis.
- Remplacer : la marque provisoire par le vrai logo, les phrases d'attente par les vraies informations.
- Garder : la mention « Illustration générée » sur chaque image créée par IA.

## Structure technique

Site statique (HTML, CSS, JavaScript), sans étape de construction sur Vercel.

- `donnees/` : tous les textes (`textes/fr.json`, `textes/en.json`) et les données (saisons, avis, villes, offres, lavage, lumières, textes alternatifs).
- `source/` : gabarits et pages ; `node outils/generer.mjs` écrit les pages HTML (ne jamais modifier les `.html` à la main).
- `assets/` : styles (`css/site.css`), effets (`js/site.js`), images, polices (Archivo, hébergées avec le site).
- `_audit/` : audit automatique et son rapport ; `_suivi/` : relevé du site actuel, directions, document Grok.
- Images : pipeline de la bibliothèque des maquettes (`plan-images.json` puis `produire.mjs`).
