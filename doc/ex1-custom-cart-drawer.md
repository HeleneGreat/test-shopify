# Exercice 1 : Personnalisation du cart drawer avec seuils promotionnels et ajout automatique d'un cadeau en temps réel
- [1. Intégration technique](#intégration-technique)
- [2. Affichage dynamique des messages promotionnels](#affichage-dynamique-des-messages-promotionnels)
- [3. Ajout automatique du produit cadeau sans refresh de la page](#ajout-automatique-du-produit-cadeau-sans-refresh-de-la-page)
- [4. Performance et maintenabilité](#performance-et-maintenabilité)


## Intégration technique
- *Intégrer une nouvelle section dans le template Liquid du cart drawer (basé sur le thème Dawn).*
- *Récupérer et surveiller en temps réel le total du panier via la variable globale cart ou l'API AJAX de Shopify.*

[settings_data.json](../config/settings_data.json) Activation du panier à tiroir par défaut dans le thème
```json
"cart_type": "drawer",
```

J'ai créé deux snippets, qui affichent chacun une barre de progression, pour indiquer combien il reste à l'utilisateur pour bénéficier de la livraison gratuite ou du produit offert.
Il est possible de personnaliser les snippets selon les besoins, c'est pourquoi j'ai préféré utiliser cette solution. Pour cela, depuis le back-office de notre boutique Shopify, aller dans "Boutique en ligne" puis "Thèmes".
Choisir le thème "Dawn" et cliquer sur le bouton "Personnaliser".
Cliquer sur l'icône des paramètres : 
- Barre de livraison : par défaut, la barre est activée. Il est possible de personnaliser sa couleur, ainsi que le montant minimum à partir duquel la livraison est gratuite.
- Barre de cadeau : les mêmes paramètres sont personnalisables.

[settings_schema.json](../config/settings_schema.json) Ajout du nouveau snippet dans la configuration
```json
, {
    "name": "Barre de livraison par HeleneGreat",
    "settings":
    [
      {
        "type": "checkbox",
        "id": "show_shipping_bar",
        "label": "Afficher la barre de livraison dans le panier",
        "default": true
      },
      {
        "type": "number",
        "id": "minimum_free_shipping",
        "label": "Montant minimum pour la livraison gratuite",
        "default": 50
      },
      {
        "type": "color",
        "id": "shipping_bar_color",
        "label": "Couleur de la barre de progression",
        "default": "#DFD52E"
      }
    ]
  }, {
    "name": "Barre de cadeau gratuit par HeleneGreat",
    "settings":
    [
      {
        "type": "checkbox",
        "id": "show_gift_bar",
        "label": "Afficher la barre de cadeau dans le panier",
        "default": true
      },
      {
        "type": "number",
        "id": "minimum_free_gift",
        "label": "Montant minimum pour le cadeau gratuit",
        "default": 100
      },
      {
        "type": "color",
        "id": "gift_bar_color",
        "label": "Couleur de la barre de progression",
        "default": "#2EDFAC"
      },
      {
        "type": "product",
        "id": "gift_product",
        "label": "Produit cadeau",
        "info": "Sélectionnez le produit qui sera offert lorsque le seuil est atteint.",
      }
    ]
  }
```

[cart-drawer.liquid](../snippets/cart-drawer.liquid) Dans le fichier de base du panier, ces lignes permettent d'afficher les deux barres de progression si elles ont été activées :
```php
# Le panier ne doit pas être vide et la barre de livraison doit être activée
{% if cart != empty and settings.show_shipping_bar %}
    {% render 'free-shipping-bar.liquid' %}
{% endif %}

# Le panier ne doit pas être vide et la barre de cadeau gratuit doit être activée pour afficher la barre de progression pour le cadeau gratuit 
{% if cart != empty and settings.show_gift_bar %}
  {% render 'free-gift-bar.liquid' %}
{% endif %}
```

## Affichage dynamique des messages promotionnels
- *Calculer la différence entre le total du panier et chaque seuil (50 € et 100 €).*
- *Afficher les messages incitatifs en fonction du montant actuel. Exemple :*
  - *si total < 50 € : « Plus que [50 – total] € pour bénéficier de la livraison gratuite. »*
  - *si total < 100 € : « Plus que [100 – total] € pour recevoir un cadeau offert. »*
- *une fois le seuil atteint, masquer ou remplacer les messages par un message de félicitations.*

[free-shipping-bar.liquid](../snippets/free-shipping-bar.liquid) Création d'un nouveau snippet pour gérer la bar de progression :
```php
{% # Récupération de la couleur de la barre de progression depuis les paramètres du thème  %}
{% assign progress_shipping_bar_color = settings.shipping_bar_color %}
{% # Inclusion du fichier CSS externe pour la barre de progression %}
{{ 'shipping-gift-bars.css' | asset_url | stylesheet_tag }}

<div class="upsell-container">
  {% # Montant minimum pour le cadeau offert %}
  {% assign gift_value = settings.minimum_free_gift | times: 100 %}
  {% # Total actuel du panier %}
  {% assign cart_total = cart.total_price %}
  {% # Montant restant avant d'obtenir le cadeau offert : on soustrait le montant du cadeau au cas où il est > 0€ %}
  {% assign gift_value_left = gift_value | minus: cart_total | minus: gift_product.price %}
  {% # Pourcentage de progression %}
  {% assign gift_percentage_fraction = cart_total | times: 100 | divided_by: gift_value %}


  <p class="shipping-message">
    {% if shipping_value_left > 0 %}
      <span class="free_shipping_notice">Plus que {{ shipping_value_left | money }} pour bénéficier de la livraison gratuite.</span>
    {% elsif  shipping_value_left <= 0 %}
      <span>Vous bénéficiez de la <b>livraison gratuite</b> !</span>
    {% endif %}
  </p>

  <div class="progress-bar">
    {% # Barre de progression dynamique %}
    <div class="progress-bar-done shipping" data-progress="loading"><span></span></div>
    {% # Icône affichée lorsque la livraison gratuite est atteinte %}
    <div class="free-shipping-icon {% if shipping_value_left <= 0 %} iconicion shipping {% endif %}"> 
      <?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
      <svg class="" fill="#000000" width="30px" height="30px" viewBox="0 -64 640 640" xmlns="http://www.w3.org/2000/svg"><path d="M624 352h-16V243.9c0-12.7-5.1-24.9-14.1-33.9L494 110.1c-9-9-21.2-14.1-33.9-14.1H416V48c0-26.5-21.5-48-48-48H112C85.5 0 64 21.5 64 48v48H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h272c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H40c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h208c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h208c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H64v128c0 53 43 96 96 96s96-43 96-96h128c0 53 43 96 96 96s96-43 96-96h48c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zM160 464c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm320 0c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm80-208H416V144h44.1l99.9 99.9V256z"/></svg>
    </div>
  </div>
</div>

{% # Définition des variables CSS personnalisées pour la barre de progression %}
<style>
  :root {
      --progress-shipping-bar-color: {{ progress_shipping_bar_color }};
      --progress-shipping-bar-color-lighten-10: {{ progress_shipping_bar_color | color_lighten: 10 }};
      --progress-shipping-bar-color-lighten-20: {{ progress_shipping_bar_color | color_lighten: 20 }};
      --shipping-percentage: {{ shipping_percentage_fraction }}%;
  }
</style>
```

[free-gift-bar.liquid](../snippets/free-gift-bar.liquid) La barre de progression pour l'obtention d'un produit offert :
```php
{% # Récupération de la couleur de la barre de progression depuis les paramètres du thème %}
{% assign progress_gift_bar_color = settings.gift_bar_color %}
{% # Inclusion du fichier CSS externe pour la barre de progression %}
{{ 'shipping-gift-bars.css' | asset_url | stylesheet_tag }}
{% # Récupération de l'ID du produit offert %}
{% assign gift_product_id = settings.gift_product.variants.first.id %}

<div class="upsell-container">
  {% # Définition des variables pour le calcul de la progression. Les montants sont multipliés par 100 car les prix sont stockés en centimes. %}
  {% assign gift_value = settings.minimum_free_gift | times: 100 %} {% # Montant minimum pour la livraison gratuite %}
  {% assign cart_total = cart.total_price %} {% # Total actuel du panier %}
  {% assign gift_value_left = gift_value | minus: cart_total %} {% # Montant restant avant d'obtenir la livraison gratuite %}
  {% assign gift_percentage_fraction = cart_total | times: 100 | divided_by:gift_value %} {% # Pourcentage de progression %}

  <p class="gift-message">
    {% if gift_value_left > 0 %}
      <span class="free_gift_notice">Plus que {{ gift_value_left | money }} pour recevoir un cadeau offert.</span>
    {% elsif  gift_value_left <= 0 %}
      <span>Vous recevrez un <b>cadeau offert</b> !</span>
    {% endif %}
  </p>

  <div class="progress-bar">
    {% # Barre de progression dynamique %}
    <div class="progress-bar-done gift" data-progress="loading"><span></span></div>
    {% # Icône affichée lorsque la livraison gratuite est atteinte %}
    <div class="free-gift-icon {% if gift_value_left <= 0 %} iconicion gift {% endif %}"> 
      <?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
      <svg fill="#000000" viewBox="-50 -50 640 640" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><title>ionicons-v5-n</title><path d="M346,110a34,34,0,0,0-68,0v34h34A34,34,0,0,0,346,110Z" style="fill:none"></path><path d="M234,110a34,34,0,1,0-34,34h34Z" style="fill:none"></path><path d="M234,144h44V256H442a22,22,0,0,0,22-22V166a22,22,0,0,0-22-22H382.18A77.95,77.95,0,0,0,256,55.79,78,78,0,0,0,129.81,144H70a22,22,0,0,0-22,22v68a22,22,0,0,0,22,22H234Zm44-34a34,34,0,1,1,34,34H278Zm-112,0a34,34,0,1,1,68,0v34H200A34,34,0,0,1,166,110Z"></path><path d="M278,480H410a22,22,0,0,0,22-22V288H278Z"></path><path d="M80,458a22,22,0,0,0,22,22H234V288H80Z"></path></g></svg>
    </div>
  </div>
</div>

{% # Définition des variables CSS personnalisées pour la barre de progression %}
<style>
  :root {
      --progress-gift-bar-color: {{ progress_gift_bar_color }};
      --progress-gift-bar-color-lighten-10: {{ progress_gift_bar_color | color_lighten: 10 }};
      --progress-gift-bar-color-lighten-20: {{ progress_gift_bar_color | color_lighten: 20 }};
      --gift-percentage: {{ gift_percentage_fraction }}%;
  }
</style>

{% # Récupération des variables du snippet pour les injecter aux variables JS %}
<script>
  window.freeGiftSettings = {
    giftProductId: {{ gift_product_id }},
    minimumCartValue: {{ gift_value }}
  };
</script>

{% # Inclusion du fichier JS externe pour l'ajout du produit offert dans le panier %}
<script src="{{ 'free-gift.js' | asset_url }}" defer="defer"></script>
```


[shipping-bar.css](../assets/shipping-bar.css) Séparation du CSS associé avec notamment récupération des valeurs paramétrables dans le snippet
```css
/* Barre de progression pour les frais de livraison gratuits */
.progress-bar-done.shipping{
    background-color: var(--progress-shipping-bar-color);
    background-image: repeating-linear-gradient(
        to left,
        var(--progress-shipping-bar-color),
        var(--progress-shipping-bar-color-lighten-10),
        var(--progress-shipping-bar-color-lighten-20)
    );
    box-shadow: 0 5px 5px -6px var(--progress-shipping-bar-color);
    width: var(--shipping-percentage);
}

/* Barre de progression pour le cadeau offert */
.progress-bar-done.gift{
    background-color: var(--progress-gift-bar-color);
    background-image: repeating-linear-gradient(
        to left,
        var(--progress-gift-bar-color),
        var(--progress-gift-bar-color-lighten-10),
        var(--progress-gift-bar-color-lighten-20)
    );
    box-shadow: 0 5px 5px -6px var(--progress-gift-bar-color);
    width: var(--gift-percentage);
}
```

## Ajout automatique du produit cadeau sans refresh de la page
- *Dès que le total atteint 100 € ou plus et que le produit cadeau n'est pas dans le panier, déclencher une requête AJAX pour ajouter automatiquement le produit cadeau.*
- *Veiller à ce que l'ajout s'effectue en temps réel dans le cart drawer (mise à jour dynamique de l'interface) sans rechargement de la page.*
- *Afficher une confirmation visuelle pour informer l'utilisateur de l'ajout du cadeau.*

**Problèmes rencontrés :**
Pour le choix du produit offert, j'avais pris par hasard de la cire pour ski, mais je n'arrivais pas à l'ajouter au panier. L'erreur venait que ce produit avait des variants. Une fois l'ID du produit par défaut modifié, je n'avais plus l'erreur.

**Autres pistes envisagées**
- J'avais trouvé une première solution, où quand le seuil est atteint, le produit offert est bien ajouté au panier, et supprimé si le montant du panier diminue. Par contre, je n'arrivais pas à modifier le prix du produit, ou lui donner un attribut de type remise.
- J'ai aussi vu qu'avec le système de réductions, on peut créer une réduction du type "Buy X, Get Y", ce qui est beaucoup plus facile et personnalisable pour le ou la gérant·e.
Cependant on ne peut pas l'appliquer par défaut à tous les produits du catalogue, et je n'ai pas trouvé s'il est possible de modifier ce comportement. Ça aurait été parfait, puisque ça gérait déjà l'ajout/suppression du panier, le message promotionnel et le prix rayé remplacé par 0€.
- Finalement j'ai opté pour une solution : créer un produit cadeau à 0€, qui n'est pas référencé sur la boutique.


Suite à l'entretien, j'ai retravaillé sur mon snippet car l'ajout du cadeau ne fonctionnait pas.
J'ai tout de suite identifié l'un des problèmes : j'avais utilisé un produit non référencé sur la boutique, qui n'était donc pas disponible via l'API de Shopify. Suite à ces modifications, il fallait alors recharger une fois la page pour que le cadeau soit ajouté dans le panier, une deuxième fois pour que le nombre à côté de l'icône panier soit mis à jour. Mais le cadeau est disponible aux clients.

Pour ne pas avoir à recharger la page, j'ai écouté mais aussi déclenché les différents évènements du panier. Je ne l'avais pas fait soit au bon endroit, soit la syntaxe des évènements n'était pas la bonne.
J'ai posté sur Discord et [Shopify.dev](https://community.shopify.dev/t/how-to-update-cart-without-reload-after-adding-a-gift-product/13145) pour demander de l'aide, mais il s'avère que la réponse qu'on m'a donnée n'existait pas.
J'ai enfin trouvé une solution, en écoutant tous les évènements possible du cart. J'y ai parfois ajouté un timeout, car sinon ils se déclenchait après l'exécution de mon code.

[free-gift.js](../assets/free-gift.js)
```js
document.addEventListener("DOMContentLoaded", function () {
    // Récupérer les variables injectées par le snippet
      const settings = window.freeGiftSettings; 
      const giftProductId = settings.giftProductId; // Identifiant du produit cadeau
      const minimumCartValue = settings.minimumCartValue; // Montant minimum du panier pour ajouter un cadeau
      let giftAdded = false; // Savoir si le cadeau est déjà ajouté
      let isUpdatingCart = false; // Empêche les requêtes multiples simultanées


      // Vérifier l'état du panier
      function checkCartForGift() {
        // Récupérer les informations du panier via l'API /cart.js      
        fetch("/cart.js")
          .then(response => response.json())
          .then(cart => {
            let cartTotal = cart.total_price; // Montant total du panier
            let giftItem = cart.items.find(item => item.id === giftProductId); // Trouver l'article cadeau dans le panier
            // Si le montant du panier est supérieur ou égal au montant minimum et que le cadeau n'est pas dans le panier, on l'ajoute
            if (cartTotal >= minimumCartValue && !giftItem && !giftAdded) {
              addGiftToCart();
            // Si le montant du panier est inférieur au montant minimum et que le cadeau est dans le panier, on le retire
            } else if (cartTotal < minimumCartValue && giftItem) {
              removeGiftFromCart(giftItem.key);
            }
          })
          .catch(error => console.error("Erreur lors de la récupération du panier :", error));
      }
  
      // Fonction pour ajouter le cadeau au panier
      function addGiftToCart() {
        if (isUpdatingCart) return;
        isUpdatingCart = true;
        fetch("/cart/add.js", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: [{
              id: giftProductId, // ID du produit cadeau
              quantity: 1, // Quantité du cadeau à ajouter
              properties: { is_gift: true } // Propriété personnalisée pour indiquer que c'est un cadeau
            }]
          })
        })
          .then(response => response.json())
          .then(() => {
            giftAdded = true; // Met à jour l'état pour indiquer que le cadeau est ajouté
            updateCartDrawer();
          })
          .catch(error => console.error("Erreur lors de l'ajout du cadeau :", error))
          .finally(() => {
            isUpdatingCart = false;
          });
      }
  
      // Fonction pour retirer le cadeau du panier
      function removeGiftFromCart(itemKey) {
        if (isUpdatingCart) return;
        isUpdatingCart = true;
        fetch("/cart/change.js", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: itemKey, // Utiliser la clé unique de l'article dans le panier
            quantity: 0 // Quantité du cadeau dans le panier (mettre à zéro)
          })
        })
          .then(response => response.json())
          .then(() => {
            giftAdded = false; // Met à jour l'état pour indiquer que le cadeau est retiré
            updateCartDrawer();
          })
          .catch(error => console.error("Erreur lors du retrait du cadeau :", error))
          .finally(() => {
            isUpdatingCart = false;
          });
      }

      // Déclenche l'événement de mise à jour du panier après l'ajout ou le retrait du cadeau
      function updateCartDrawer() {
        const drawerItems = document.querySelector('cart-drawer-items');
        if (drawerItems && typeof drawerItems.onCartUpdate === 'function') {
          drawerItems.onCartUpdate();
        } else {
          document.dispatchEvent(new Event('cart:updated'));
        }
      }
  
      // Fonction pour initialiser et écouter les événements du panier
      function initializeCartEvents() {
        // Vérification initiale du panier au chargement de la page
        checkCartForGift();
        // Écoute les événements personnalisés pour les mises à jour du panier
        document.addEventListener("cart:updated", checkCartForGift);
        // Détecte les ajouts de produits au panier
        document.querySelectorAll('form[action^="/cart/add"]').forEach(form => {
          form.addEventListener('submit', function () {
            setTimeout(checkCartForGift, 1500); // Délai pour éviter le spam
          });
        });
        // Détecte les changements de quantité depuis le panier
        document.addEventListener('change', function (e) {
          if (e.target.matches('input[data-quantity-variant-id]')) {
            setTimeout(checkCartForGift, 1000); // Attendre 1 seconde avant de vérifier le panier
          }
        });
      }
    
      // Initialisation des événements
      initializeCartEvents();
  });
```
J'en ai aussi profité pour ajouter une sécurité dans le template du produit offert si le montant du cadeau est > 0€, et réparer l'ID du produit offert, qui est récupéré selon le paramétrage de la boutique :
```php
{% # Récupération de l'ID du produit offert %}
{% assign gift_product_id = settings.gift_product.variants.first.id %}

{% # Montant restant avant d'obtenir le cadeau offert : on soustrait le montant du cadeau au cas où il est > 0€ %}
{% assign gift_value_left = gift_value | minus: cart_total | minus: gift_product.price %}
```

Il me reste qu'un point à améliorer : déréférencer le cadeau de la boutique tout en le gardant accessible via l'API des produits.


## Performance et maintenabilité
- *Optimiser le code JavaScript pour garantir une mise à jour fluide et réactive du cart drawer.*
- *Commenter le code pour expliquer la logique (calcul des seuils, gestion des appels AJAX, mise à jour de l'interface).*



**Sources :** https://shopify.dev/docs/api/ajax/reference/cart
**Sources :** https://websensepro.com/blog/how-to-add-free-shipping-upsell-in-shopify-cart-without-app/


[![⬉ Retour au README](https://img.shields.io/badge/⬉%20Retour-README-blue)](../README.md)  [![Exercice suivant : Exercice 2 →](https://img.shields.io/badge/Exercice%20suivant%20→-Exercice%202-green)](./ex2-stock-automatisation-flow.md)
