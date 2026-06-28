// Récupération des éléments HTML de la page panier.
const cartItemsList = document.getElementById('cartItemsList');
const subtotal = document.getElementById('subtotal');
const cartGrandTotal = document.getElementById('cartGrandTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

// Retourne le chemin de l'image en fonction du nom du produit.
function getProductImage(name) {
  const images = {
    'Montre connectée': 'image_produit/montre.png',
    'Casque sans fil': 'image_produit/casque.png',
    'Tasse thermos': 'image_produit/tasse.png',
  };
  return images[name] || 'https://via.placeholder.com/120x120?text=Produit';
}

function formatPrice(value) {
  return value.toFixed(2).replace('.', ',') + ' €';
}

// Récupère le panier depuis le localStorage.
function getCart() {
  const stored = localStorage.getItem('eShopCart');
  return stored ? JSON.parse(stored) : [];
}

// Sauvegarde le panier dans le localStorage.
function saveCart(cart) {
  localStorage.setItem('eShopCart', JSON.stringify(cart));
}

// Met à jour l'affichage complet de la page panier.
function renderCart() {
  const cart = getCart();
  cartItemsList.innerHTML = '';

  if (cart.length === 0) {
    cartItemsList.innerHTML = '<p class="empty-message">Votre panier est vide.</p>';
    subtotal.textContent = '0,00 €';
    cartGrandTotal.textContent = '0,00 €';
    checkoutBtn.disabled = true;
    return;
  }

  let total = 0;

  // Crée un élément pour chaque article du panier.
  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const itemElement = document.createElement('div');
    itemElement.className = 'cart-item-full';
    itemElement.innerHTML = `
      <div class="item-image">
        <img src="${getProductImage(item.name)}" alt="${item.name}">
      </div>
      <div class="item-details">
        <h3>${item.name}</h3>
        <p class="item-price">${formatPrice(item.price)}</p>
      </div>
      <div class="item-quantity">
        <label for="qty-${index}">Quantité :</label>
        <div class="quantity-controls">
          <button class="qty-btn minus-btn" data-index="${index}" data-action="decrease">−</button>
          <input type="number" id="qty-${index}" class="qty-input" value="${item.quantity}" min="1" data-index="${index}">
          <button class="qty-btn plus-btn" data-index="${index}" data-action="increase">+</button>
        </div>
      </div>
      <div class="item-subtotal">
        <p>${formatPrice(item.price * item.quantity)}</p>
      </div>
      <div class="item-actions">
        <button class="remove-btn" data-index="${index}">Supprimer</button>
      </div>
    `;

    cartItemsList.appendChild(itemElement);
  });

  // Mise à jour des totaux.
  subtotal.textContent = formatPrice(total);
  cartGrandTotal.textContent = formatPrice(total);
  checkoutBtn.disabled = false;
}

// Change la quantité d'un article.
function updateQuantity(index, newQuantity) {
  const cart = getCart();
  if (newQuantity <= 0) {
    cart.splice(index, 1);
  } else {
    cart[index].quantity = parseInt(newQuantity, 10);
  }
  saveCart(cart);
  renderCart();
}

// Supprime un article du panier.
function removeItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

// Gère le clic sur les boutons de quantité.
document.addEventListener('click', (event) => {
  // Boutons +/-
  if (event.target.classList.contains('qty-btn')) {
    const index = parseInt(event.target.dataset.index, 10);
    const action = event.target.dataset.action;
    const input = document.getElementById(`qty-${index}`);
    let newQty = parseInt(input.value, 10);

    if (action === 'increase') {
      newQty += 1;
    } else if (action === 'decrease') {
      newQty -= 1;
    }

    updateQuantity(index, newQty);
  }

  // Boutons supprimer
  if (event.target.classList.contains('remove-btn')) {
    const index = parseInt(event.target.dataset.index, 10);
    removeItem(index);
  }
});

// Gère le changement direct dans l'input de quantité.
document.addEventListener('change', (event) => {
  if (event.target.classList.contains('qty-input')) {
    const index = parseInt(event.target.dataset.index, 10);
    const newQty = parseInt(event.target.value, 10);
    updateQuantity(index, newQty);
  }
});

// Gère le clic sur le bouton valider la commande.
checkoutBtn.addEventListener('click', () => {
  alert('Commande validée ! Merci de votre achat.');
  localStorage.removeItem('eShopCart');
  window.location.href = 'index.html';
});

// Affiche le panier au chargement de la page.
renderCart();
