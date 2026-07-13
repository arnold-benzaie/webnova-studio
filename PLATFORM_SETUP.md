# WebNova Marketplace — activation de la vente réelle

L’interface de la marketplace, le catalogue, le panier, la wishlist, le checkout,
l’espace client, l’Academy et les pages juridiques sont prêts. Les connexions
ci-dessous sont volontairement absentes du code public tant que les prestataires
et identifiants privés ne sont pas validés.

## 1. Paiement FastSpring

FastSpring est le prestataire visé, mais aucune intégration de production ne doit
être présentée comme active avant l’approbation de la boutique WebNova.

La demande précédente concernant les services d’agence PUBLIC-MAP ayant été
refusée, WebNova doit être soumise uniquement si elle constitue réellement une
boutique distincte de produits numériques standardisés. Il ne faut pas utiliser
un autre domaine pour masquer ou contourner le modèle d’activité refusé.

Avant une nouvelle demande :

- fabriquer et vérifier les fichiers réellement vendus ;
- publier le nom légal, l’adresse et le numéro d’enregistrement de l’entreprise ;
- créer les produits FastSpring avec des noms et prix identiques aux fiches WebNova ;
- associer à chaque produit au moins une livraison numérique réelle ;
- configurer le domaine autorisé et le Store Builder Library ;
- effectuer les commandes de test et vérifier les emails, remboursements et téléchargements ;
- obtenir une confirmation écrite de FastSpring sur l’éligibilité de cette activité distincte.

Le webhook FastSpring doit créer la commande uniquement après confirmation
serveur. Aucun succès de paiement ne doit être accepté depuis le navigateur seul.

## 2. Comptes clients

Connecter un service public d’authentification tel que Supabase Auth, Clerk ou
Auth0. Les pages `account.html`, `orders.html` et `downloads.html` ne doivent
afficher que les données du client authentifié.

## 3. Stockage et livraison sécurisée

- conserver les fichiers payants dans un stockage privé ;
- enregistrer les métadonnées produit et commande dans une base de données ;
- générer des liens signés à durée limitée après contrôle de la commande ;
- limiter et journaliser les téléchargements anormaux ;
- envoyer le reçu et le lien d’accès par email transactionnel.

## 4. Données à fournir

- fichiers ZIP, PDF, vidéos et miniatures définitives ;
- prix et taxes validés ;
- nom légal, adresse et numéro d’enregistrement de l’entreprise ;
- politique de remboursement validée juridiquement ;
- identifiants du prestataire de paiement, de l’email et de l’authentification ;
- Google Analytics et bannière de consentement si le suivi est activé.

## 5. Vérifications avant ouverture

- tester paiement accepté, refusé, remboursé et doublon de webhook ;
- vérifier qu’un client ne peut pas télécharger la commande d’un autre client ;
- tester expiration et renouvellement des liens signés ;
- vérifier les emails, factures, taxes et devises ;
- faire relire les textes juridiques par un professionnel qualifié à Maurice.

Consulter également `FASTSPRING_REVIEW.md` avant tout nouvel envoi à FastSpring.
