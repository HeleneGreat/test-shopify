# Exercice 4 : réduction automatique de 10 % sur une collection

## Détection de la collection et application de la remise
- *Créer une promotion automatique “Soldes” de 10% pour tous les produits appartenant à la collection Promotions.*
- *Identifier les produits appartenant à la collection ciblée.*
- *Calculer le prix remisé en appliquant la réduction de 10 % sur le prix d'origine et afficher le nom de la promotion (“Soldes”), en automatique, dans un label.*

**1er essai : promotions**
Dans le B.O, création d'une collection "Promotions", sur tous les produits ayant un type "snowboard". Puis création d'une promotion de type "Montant réduit sur les produits", nommée "Soldes" : 
- réduction automatique
- valeur de réduction : pourcentage -> 10%
- s'applique à la collection Promotions
- aucune exigence d'achat minimale
- cumul : tout
--> l'ancien et le nouveau prix, ainsi que le nom de la promotion s'affichent uniquement dans le panier. Le pourcentage de réduction ne s'affiche pas.

Problème rencontré : j'ai passé beaucoup de temps à chercher comment afficher ces promotions. Par exemple, dans card-product.liquid, je ne rentrais jamais dans la condition suivante, alors que mon produit était bien concerné par une promotion : 
```php 
elsif card_product.compare_at_price > card_product.price and card_product.available -%}
```
J'ai perdu beaucoup de temps avant d'apprendre que les remises automatiques ne sont appliquées que dans le panier, et ne sont donc pas disponible sur la fiche ou la carte produit. C'est là que j'ai découvert les metafields.

**2ème essai : metafields**
1. Création d'un metafield de collection : "Titre badge", de type "Texte sur une seule ligne".
2. Création de la collection "Promotions", à laquelle je donne le Titre Badge de "Soldes".
3. Création d'une réduction "Soldes" de type "Montant réduit sur les produits", qui s'applique sur les produits de la collection Promotions


## Affichage du prix barré et du prix remisé
- *Sur la fiche produit et sur les pages de collection, afficher le prix d'origine barré et le prix remisé à côté.*
- *S'assurer que le format d'affichage reste cohérent et lisible, en utilisant les bonnes pratiques de Shopify et en respectant le style du thème.*
- *S’assurer que le label change en cas de changement du nom de la promotion automatique.*
- *S’assurer que la remise change en cas de changement du pourcentage de la remise dans la promotion automatique.*

Malgré l'utilisation des metafields, il m'est toujours impossible d'afficher le prix réduit et le badge "Soldes" sur la fiche produit via les différents templates (price.liquid, card-product.liquid, cart-drawer.liquid..). J'ai même recopié/adapté le code d'un autre candidat, sans succès.
Je ne comprends pas, est-ce qu'il y aurait un paramétrage que j'aurai manqué ?
Le forum de Shopify n'est accessible qu'avec un compte payant.

J'ai enfin réussi à affiché le badge "Soldes" sur la fiche et la carte produit. La découverte d'un équivalent à var_dump pour liquid m'a beaucoup aidé : ``` {{ c | json }} ```
En inspectant le HTML, je voyais bien que le badge était là, mais n'apparaissait pas, à cause de la classe 'price__badge-sale' qui était en 'display:none;'. J'ai enlevé la classe car je n'ai pas trouvé comment activer l'affichage des badges.


## Mise à jour dynamique lors de l'ajout au panier
- *Vérifier que lorsque le produit est ajouté au panier, le prix remisé est bien pris en compte dans le résumé du panier et que le prix d'origine est toujours affiché comme barré (le cas échéant).*

Avec l'utilisation des metafields, la promotion est bien appliquée dans le panier. Le prix d'origine est barré, et l'étiquette "Soldes" est affichée. Idem lors du paiement.


## Performance et maintenabilité
- *Optimiser le code pour ne pas impacter les performances du site.*
- *Commenter la logique d'intégration afin de faciliter la maintenance.*

Fichiers modifiés :
[price.liquid](../snippets/price.liquid)
[card-product.liquid](../snippets/card-product.liquid)
