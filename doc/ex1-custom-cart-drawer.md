# Exercice 1 : Personnalisation du cart drawer avec seuils promotionnels et ajout automatique d'un cadeau en temps réel

## 1) Livraison gratuite
Ce snippet affiche une barre de progression dans le panier indiquant combien il reste à l'utilisateur pour bénéficier de la livraison gratuite. Il est conçu pour être utilisé dans un thème Shopify, en particulier avec le thème Dawn.

### Fichiers à modifier
[settings_data.json](../config/settings_data.json) Activation du panier à tiroir par défaut dans le thème
```json
"cart_type": "drawer",
```
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
  }
```

[cart-drawer.liquid](../snippets/cart-drawer.liquid) Dans le fichier de base du panier, ajouter ces lignes :
```php
# Le panier ne doit pas être vide et la barre de livraison doit être activée
{% if cart != empty and settings.show_shipping_bar %}
    {% render 'free-shipping-bar.liquid' %}
{% endif %}
```

[free-shipping-bar.liquid](../snippets/free-shipping-bar.liquid) Création d'un nouveau snippet pour gérer la bar de progression :
```php
{% comment %} Récupération de la couleur de la barre de progression depuis les paramètres du thème {% endcomment %}
{% assign progress_bar_color = settings.shipping_bar_color %}
{% comment %} Inclusion du fichier CSS externe pour la barre de progression {% endcomment %}
{{ 'shipping-bar.css' | asset_url | stylesheet_tag }}

<div class="upsell-container">
  {% # Définition des variables pour le calcul de la progression. Les montants sont multipliés par 100 car les prix sont stockés en centimes. %}
  {% assign shipping_value = settings.minimum_free_shipping | times: 100 %} {% # Montant minimum pour la livraison gratuite %}
  {% assign cart_total = cart.total_price %} {% # Total actuel du panier %}
  {% assign shipping_value_left = shipping_value | minus: cart_total %} {% # Montant restant avant d'obtenir la livraison gratuite %}
  {% assign shipping_percentage_fraction = cart_total | times: 100 | divided_by: shipping_value %} {% # Pourcentage de progression %}
  <p class="shipping-message">
    {% if shipping_value_left > 0 %}
      <span class="free_shipping_notice">Plus que {{ shipping_value_left | money }} pour bénéficier de la livraison gratuite.</span>
    {% elsif  shipping_value_left <= 0 %}
      <span>Vous bénéficiez de la livraison gratuite !</span>
    {% endif %}
  </p>

  <div class="progress-bar">
    {% # Barre de progression dynamique %}
    <div class="progress-bar-done" data-progress="loading"><span></span></div>
    {% # Icône affichée lorsque la livraison gratuite est atteinte %}
    <div class="free-shipping-icon {% if shipping_value_left <= 0 %} iconicion {% endif %}"> 
      <?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
      <svg class="" fill="#000000" width="30px" height="30px" viewBox="0 -64 640 640" xmlns="http://www.w3.org/2000/svg"><path d="M624 352h-16V243.9c0-12.7-5.1-24.9-14.1-33.9L494 110.1c-9-9-21.2-14.1-33.9-14.1H416V48c0-26.5-21.5-48-48-48H112C85.5 0 64 21.5 64 48v48H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h272c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H40c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h208c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h208c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H64v128c0 53 43 96 96 96s96-43 96-96h128c0 53 43 96 96 96s96-43 96-96h48c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zM160 464c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm320 0c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm80-208H416V144h44.1l99.9 99.9V256z"/></svg>
    </div>
  </div>
</div>

{% # Définition des variables CSS personnalisées pour la barre de progression %}
<style>
  :root {
      --progress-bar-color: {{ progress_bar_color }};
      --progress-bar-color-lighten-10: {{ progress_bar_color | color_lighten: 10 }};
      --progress-bar-color-lighten-20: {{ progress_bar_color | color_lighten: 20 }};
      --shipping-percentage: {{ shipping_percentage_fraction }}%;
  }
</style>
```
[shipping-bar.css](../assets/shipping-bar.css) Séparation du CSS associé
```css
.upsell-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;
}
.progress-bar{
    background-color: #E2E4E3;
    display: flex;
    height: 1em;
    width: 100%;
    border-radius: 0.75em;
    padding: 3px;
    position: relative;
    align-items: center;
}
/* C'est ici que sont récupérées les valeurs transmises par le snippet */
.progress-bar-done{
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    background-color: var(--progress-bar-color);
    background-image: repeating-linear-gradient(
        to left,
        var(--progress-bar-color),
        var(--progress-bar-color-lighten-10),
        var(--progress-bar-color-lighten-20)
    );
    box-shadow: 0 5px 5px -6px var(--progress-bar-color);
    border-radius: 0.75em;
    height: 100%;
    transition: 1s ease 0.3s;
    max-width: 100%;
    width: var(--shipping-percentage);
}
.free-shipping-icon{
    position: absolute;
    right: 0;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background-color: #E2E4E3;
    display: flex;
    align-items: center;
    justify-content: center;
}
.progress-bar::before{
    content: ' ';
}
.iconicion{
    box-shadow: 0 0 10px rgba(62, 101, 207, 0.5);
    border: 1px solid black;
    transition: 1s ease 0.7s;
}
```

### Mise en place pour la boutique en ligne
Il est possible de personnaliser la barre de progression. Pour cela, depuis le back-office de notre boutique Shopify, aller dans "Boutique en ligne" puis "Thèmes".
Choisir le thème "Dawn" et cliquer sur le bouton "Personnaliser".
Cliquer sur l'icône des paramètres : 
- Barre de livraison : par défaut, la barre est activée. Il est possible de personnaliser sa couleur, ainsi que le montant minimum à partir duquel la livraison est gratuite.

**Sources :** cet exercice a été réalisé à partir d'un tutoriel de [WebSensePro](https://websensepro.com/blog/how-to-add-free-shipping-upsell-in-shopify-cart-without-app/), et adapté à mes besoins.

## 2) Cadeau gratuit

Sur le même principe que la livraison gratuite, ce snippet ajoute une barre de progression dans le panier indiquant combien il reste à l'utilisateur pour bénéficier d'un cadeau gratuit.

**Problèmes rencontrés :**
Pour le choix du produit offert, j'avais pris par hasard de la cire pour ski, mais je n'arrivais pas à l'ajouter au panier. L'erreur venait que ce produit avait des variants. Une fois l'ID du produit par défaut modifié, je n'avais plus l'erreur.

**Pistes envisagées**
Réductions "Buy X get Y" dans le back office. Problème : il faudrait sélectionner manuellement tous les produits.

**Sources :** https://shopify.dev/docs/api/ajax/reference/cart