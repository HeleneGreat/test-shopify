document.addEventListener("DOMContentLoaded", function () {
  // Récupérer les variables injectées par le snippet
    const settings = window.freeGiftSettings; 
    const giftProductId = settings.giftProductId; // Identifiant du produit cadeau
    const minimumCartValue = settings.minimumCartValue; // Montant minimum du panier pour ajouter un cadeau
    let giftAdded = false; // savoir si le cadeau est déjà ajouté

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
        });
    }

    // Fonction pour ajouter le cadeau au panier
    function addGiftToCart() {
      fetch("/cart/add.js", {
        method: "POST", // Utiliser la méthode POST pour ajouter un produit
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
          updateCartUI(); // Mettre à jour l'interface utilisateur du panier
        })
        .catch(error => console.error("Erreur lors de l'ajout du cadeau :", error));
    }

    // Fonction pour retirer le cadeau du panier
    function removeGiftFromCart(itemKey) {
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
          updateCartUI(); // Mettre à jour l'interface utilisateur du panier
        })
        .catch(error => console.error("Erreur lors du retrait du cadeau :", error));
    }

    // Met à jour l'interface du panier
    function updateCartUI() {
      document.dispatchEvent(new Event('cart:updated'));
    }

    // Écoute les mises à jour du panier
    document.addEventListener("cart:updated", checkCartForGift);

    // Effectuer la première vérification du panier au chargement de la page
    checkCartForGift();

});
