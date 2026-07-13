# Déploiement WebNova Marketplace

Le dépôt contient un site statique compatible avec Vercel et GitHub Pages.

## Avant publication

1. Exécuter les validations documentées dans `README.md`.
2. Relire `PLATFORM_SETUP.md`.
3. Faire valider les mentions légales et les informations de l’entreprise.
4. Connecter le paiement, l’authentification, la base de données, le stockage
   privé et les emails transactionnels.
5. Remplacer les contenus de démonstration par les fichiers et visuels vendus.
6. Tester le paiement, le remboursement et les autorisations de téléchargement
   dans un environnement de test.
7. Vérifier que les prix indicatifs ont été remplacés par les prix définitifs et
   que seules les notes issues de commandes réelles sont publiées.

## Déploiement statique

La branche `main` déclenche le workflow GitHub Pages existant. Le fichier
`CNAME` cible `webnova.company`.

Vercel peut également importer le dépôt sans commande de build et servir la
racine du projet. Le fichier `vercel.json` configure les en-têtes de sécurité,
le cache et les redirections principales.

## Important

La version actuelle fournit l’expérience complète de la boutique côté
interface. Elle ne doit pas accepter de paiements réels avant la connexion des
services serveur décrits dans `PLATFORM_SETUP.md`.
