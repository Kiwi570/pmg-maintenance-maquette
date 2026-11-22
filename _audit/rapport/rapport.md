# Rapport d’audit

Projet : `pmg-maintenance-maquette` · 21/11/2026 03:28:53 · 1 min · 2 page(s) · audit standard ciblé sur /toiture-hiver,/en/toiture-hiver (étapes : fichiers, mesures)

## Résumé

- Statut : **tout a tourné, aucun échec**
- Passe : `20261121-022802-standard-cible-partiel` · version ?v=1
- Échecs : **0**
- À regarder : **5**
- Non lancé : **0**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), mesures (22), balayage (2)

## Passes de cette version (?v=1)

Chaque passe garde son rapport dans `_audit/passes/` : une relance ciblée ne fait pas disparaître la preuve d’une passe plus large.

| Passe | Niveau | Pages | Étapes | Échecs | À regarder | Non lancé | Statut |
|---|---|---|---|---:|---:|---:|---|
| 20261120-224715-rapide-cible | rapide | / | toutes | 18 | 9 | 1 | échecs |
| 20261120-230305-rapide-cible | rapide | /toiture-hiver,/lumieres-de-noel,/lavage-exterieur,/contact | toutes | 21 | 17 | 1 | échecs |
| 20261120-231944-standard | standard | toutes | toutes | 6 | 22 | 1 | échecs |
| 20261120-234452-standard-cible-partiel | standard | /,/contact,/en,/toiture-hiver,/en/lumieres-de-noel,/lumieres-de-noel | fichiers, mesures | 0 | 15 | 0 | complet |
| 20261120-234938-complet-partiel | complet | toutes | mesures, ecran | 5 | 18 | 0 | échecs |
| 20261121-000205-complet-cible-partiel | complet | /contact,/en/contact,/toiture-hiver,/en/toiture-hiver,/lavage-exterieur,/en/lavage-exterieur | fichiers, mesures, ecran | 0 | 10 | 0 | complet |
| 20261121-000903-complet-cible-partiel | complet | /lumieres-de-noel,/en/lumieres-de-noel,/404 | fichiers, mesures | 0 | 8 | 0 | complet |
| **20261121-022802-standard-cible-partiel** (celle-ci) | standard | /toiture-hiver,/en/toiture-hiver | fichiers, mesures | 0 | 5 | 0 | complet |

## Échecs

Aucun.

## À regarder

### « à compléter » visible (2)

- **« à compléter » visible** — `contact.html` — 1 fois hors du pied de page : remplacer par une phrase vraie qui oriente le visiteur (« Tarifs selon la saison, donnés à la réservation ») ou retirer l'élément, et le noter dans la fiche du README (sauf sens propre : « dossier à compléter »)
- **« à compléter » visible** — `en/contact.html` — 1 fois hors du pied de page : remplacer par une phrase vraie qui oriente le visiteur (« Tarifs selon la saison, donnés à la réservation ») ou retirer l'élément, et le noter dans la fiche du README (sauf sens propre : « dossier à compléter »)

### numéro de version (1)

- **numéro de version** — ?v=1 est celui de la dernière livraison : à changer avant de livrer

### section sans visuel (2)

- **section sans visuel** — `/en/toiture-hiver` — section#fin « Roof loaded? Write to us. Text us a photo of your  » — une belle photo ou un visuel animé quand le contenu s’y prête ; une section de texte peut rester typographique (v11) _(768×1024 normal, 390×844 normal, 320×568 normal, 844×390 normal, 390×844 sansJs, 390×844 sansWebgl, +1)_
- **section sans visuel** — `/toiture-hiver` — section#fin « Un toit chargé ? Écrivez-nous. Envoyez une photo d » — une belle photo ou un visuel animé quand le contenu s’y prête ; une section de texte peut rester typographique (v11) _(390×844 normal, 768×1024 normal, 320×568 normal, 844×390 normal, 390×844 sansJs, 390×844 sansWebgl, +1)_

## Non lancé

Tout a été lancé.


## Repères

- Numéro de version des fichiers : ?v=1
- Journal v1 : 6 étape(s) notée(s), 143 min de travail pour 140 min de budget, 3 min d’attente de l’utilisateur.
- Journal : « audit, regard neuf et corrections » 54 min pour 25 prévues.
- Audit standard : étapes lourdes sur /en/toiture-hiver, /toiture-hiver.
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`
