Ce document décrit les tests automatisés exécutés via GitHub Actions afin de valider le bon fonctionnement du front-end avant intégration ou déploiement. L'objectif de ces tests est de garantir que chaque modification du front-end est :
- conforme aux standards de qualité,
- installable,
- buildable,
- prête à être déployée.

Les tests sont déclenchés automatiquement lors des push et pull request  sur les branches principales du projet.
Avoir de lancer les tests , il faut avoir des pré-requis telles que :
- Le projet doit contenir un dossier `frontend/web`.
- Le fichier `.github/workflows/ci.yml` doit être présent.
- Node.js 20 est utilisé pour tous les tests.
- Les dépendances doivent être correctement définies dans package.json et package-lock.json.
Nous avons écrits des tests automatisés avec différents buts :
 Test 1 — Installation des dépendances
L’objectif de ce test est de vérifier que le projet peut être installé sans erreur.  Pour exécuter ce test , il faut :
1. Exécuter `npm ci`.  
Les résultats attendues par ce test sont :
- Aucune erreur d’installation.
- Le dossier `node_modules` est généré.


 Test 2 — Vérification de la qualité du code (optionnel)
L’objectif de ce test est d'assurer que le code respecte les standards définis.  Pour exécuter ce test , il faut :
1. Exécuter `npx prettier --check .`  
2. Exécuter `npx eslint . --max-warnings=0`  
Les résultats attendues par ce test sont :
- Aucun fichier mal formaté.
- Aucun warning ou erreur ESLint.

Test 3 — Restauration du cache Next.js
L’objectif de ce test est d'optimiser le temps de build et vérifier la cohérence du cache. Pour exécuter ce test , il faut :
- Restaurer `.next/cache` via `actions/cache`.  
Les résultats attendues par ce test sont :
- Le cache est restauré si disponible.
- Le workflow continue même si le cache est absent.

Test 4 — Build du projet
L’objectif de ce test est de vérifier que le front-end peut être compilé sans erreur.  Pour exécuter ce test , il faut :
- Exécuter `npm run build`.  
Les résultats attendues par ce test sont :
- Le build Next.js se termine sans erreur.
- Le dossier `.next` est généré.

Test 5 — Export des artefacts
L’objectif de ce test est de vérifier que les fichiers nécessaires au déploiement sont bien générés et archivés. Pour exécuter ce test , il faut :
- Uploader les artefacts : .next, public, package.json, next.config.*.  
Les résultats attendues par ce test sont :
- Les artefacts apparaissent dans l’onglet Artifacts du workflow GitHub Actions.

Les tests sont exécutés automatiquement lors de :
- push sur : `main`, `master`, `dev`, `frontend`, `dev-reset`
- pull_request vers : `main`, `master`, `dev`, `dev-reset`
- Exécution manuelle via “Run workflow”
La recette est considérée comme réussie si :
- Tous les jobs CI passent au vert,
- Le build est généré sans erreur,
- Les artefacts sont correctement uploadés,
- Aucun warning bloquant n’est détecté.




