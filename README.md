# Petits exercices pour tester Shopify

URL de la boutique : https://test-technique-shop.myshopify.com/
Mot de passe : shawse

Commandes utilisées pour installer et modifier Shopify en local
```bash
npm install -g @shopify/cli@latest
npm install -g @shopify/theme 

shopify version
shopify app init  

# Récupérer les fichiers du thème de ma boutique
shopify theme pull --store test-technique-shop.myshopify.com

# Push les modifications en temps réel sur un thème de développement/test, et fourni l'url d'aperçu en local
shopify theme dev

# Push les modifications locales vers le thème de production
shopify theme push
```


## [Exercice 1](./doc/ex1-custom-cart-drawer.md) : Personnalisation du cart drawer avec seuils promotionnels et ajout automatique d'un cadeau en temps réel

## Exercice 2 : Automatisation de la gestion de stocks via Shopify Flow

## Exercice 3 : Utilisation de Shopify CLI et gestion de version

## [Exercice 4](./doc/ex4-collection-automated-promotion.md) : réduction automatique de 10 % sur une collection