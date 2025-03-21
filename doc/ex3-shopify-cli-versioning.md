# Exercice 3 : Utilisation de Shopify CLI et gestion de version

## Utilisation de Shopify CLI
- *Cloner le thème Dawn et intégrer les modifications apportées dans l'exercice 1 (et le cas échéant, les liens avec l'exercice 2).*
- *Documenter l'installation et la configuration de votre environnement de développement local (dépendances, commandes pour lancer le thème en mode développement, etc.).*

Commandes utilisées pour installer et modifier Shopify en local
```bash
npm install -g @shopify/cli@latest
npm install -g @shopify/theme 

shopify version
shopify app init  

# Récupérer les fichiers du thème de ma boutique, qui est configurée avec le thème Dawn
shopify theme pull --store test-technique-shop.myshopify.com

# Push les modifications en temps réel sur un thème de développement/test, et fourni l'url d'aperçu en local
shopify theme dev

# Push les modifications locales vers le thème de production
shopify theme push
```

## Gestion de version avec GitHub
- *Créer un dépôt GitHub pour héberger l'ensemble du projet.*
- *Effectuer des commits réguliers avec des messages clairs, détaillant les étapes du développement (ajout de la fonctionnalité de seuil, implémentation de l'ajout automatique du cadeau, configuration du flux Shopify Flow, etc.).*
- *Optionnel : mettre en place un pipeline CI/CD (par exemple via GitHub Actions) pour lancer des tests automatisés ou vérifier la qualité du code.*

Création d'un [dépôt Github](https://github.com/HeleneGreat/test-shopify) pour le projet.
Utilisation de différentes commandes git pour versionner le projet, tel que : 
```git
# Création d'un dépôt sur GitHub puis récupération en local
git init
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/HeleneGreat/test.git
git push -u origin main
# Création d'une branche pour l'exercice 3
git branche ex3-shopify-cli-versioning
# Envoi de la branche locale sur le dépôt distant
git push --set-upstream origin ex3-shopify-cli-versioning
# Exemple de commit
git -m "free gift bar snippet creation"
# Envoi des commits locaux sur le dépôt distant
git push
# Sur GitHub, dans Pull requests, créer une PR avec les derniers commmits.
# Normalement il est recommandé que la personne qui fait la PR ne soit pas celle qui la merge, mais là je travaille seule. 
# Je supprime la branche qui a été mergée.


```

## Documentation et processus collaboratif
- *Rédiger un README global qui récapitule l'ensemble du test, en expliquant :*
    - *Le contexte et les objectifs globaux.*
    - *La structure du projet.*
    - *Les instructions pour cloner, installer et tester le projet en local.*
    - *Un lien vers la documentation détaillée de chacun des exercices.*
- *Mentionner les bonnes pratiques mises en oeuvre (commentaires de code, gestion de branches, revue de code, etc.).*

J'ai choisi de diviser ma documentation selon les exercices, pour que ce soit plus lisible. J'ai ajouter des liens entre les fichiers pour faciliter la navigation.

Pour ce qui est des bonnes pratiques, j'ai commenté mes modifications et j'ai refactorisé mon code quand c'était possible. J'ai regardé sur la documentation de liquid ce qu'il était possible de faire, c'est comme ça que j'ai découvert notamment l'instruction *unless*.


[![⬉ Retour au README](https://img.shields.io/badge/⬉%20Retour-README-blue)](../README.md)  [![← Exercice précédent : Exercice 2](https://img.shields.io/badge/←%20Exercice%20précédent-Exercice%202-green)](./ex2-stock-automatisation-flow.md)  [![Exercice suivant : Exercice 4 →](https://img.shields.io/badge/Exercice%20suivant%20→-Exercice%204-green)](./ex4-collection-automated-promotion.md)