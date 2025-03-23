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
          let giftInCart = cart.items.some(item => item.id === giftProductId); // Vérifier si le cadeau est déjà dans le panier

          // Si le montant du panier est supérieur ou égal au montant minimum et que le cadeau n'est pas dans le panier, on l'ajoute
          if (cartTotal >= minimumCartValue && !giftInCart) {
            addGiftToCart();
          // Si le montant du panier est inférieur au montant minimum et que le cadeau est dans le panier, on le retire
          } else if (cartTotal < minimumCartValue && giftInCart) {
            removeGiftFromCart();
          }
        });
    }

    // Fonction pour ajouter le cadeau au panier
    function addGiftToCart() {
      fetch("/cart/add.js", {
        method: "POST", // Utiliser la méthode POST pour ajouter un produit
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: giftProductId, // ID du produit cadeau
          quantity: 1 // Quantité du cadeau à ajouter
        })
      })
        .then(response => response.json())
        .then(() => {
          // console.log("Cadeau ajouté !");
          updateCartUI(); // Mettre à jour l'interface utilisateur du panier
        });
    }

    // Fonction pour retirer le cadeau du panier
    function removeGiftFromCart() {
      fetch("/cart/change.js", {
        method: "POST", // Utiliser la méthode POST pour changer la quantité d'un produit dans le panier
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: giftProductId, // ID du produit cadeau
          quantity: 0 // Quantité du cadeau dans le panier (mettre à zéro)
        })
      })
        .then(response => response.json())
        .then(() => {
          // console.log("Cadeau retiré !");
          updateCartUI(); // Mettre à jour l'interface utilisateur du panier
        });
    }

    // Fonction pour mettre à jour l'interface du panier
    function updateCartUI() {
          document.dispatchEvent(new Event('cart:updated'));
    }

    // Ecouteur d'événement qui vérifie l'état du panier chaque fois qu'il est mis à jour
    document.addEventListener("cart:updated", checkCartForGift);

    // Effectuer la première vérification du panier au chargement de la page
    checkCartForGift();

});
