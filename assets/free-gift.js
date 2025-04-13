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