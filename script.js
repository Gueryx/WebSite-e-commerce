// Tableau qui contient les articles ajoutés au panier.
// Les données sont sauvegardées dans localStorage pour persister entre les pages.
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutButton = document.getElementById('checkoutButton');
const cartButton = document.getElementById('cartButton');
const cartPanel = document.getElementById('cartPanel');
const searchInput = document.getElementById('productSearch');
const searchResults = document.getElementById('searchResults');
const productCards = Array.from(document.querySelectorAll('.product-card'));

const catalog = [
  {
    name: 'Montre connectée',
    href: 'produit-montre.html',
    price: '79,99 €',
    keywords: 'montre connectee smartwatch sport fitness'
  },
  {
    name: 'Casque sans fil',
    href: 'produit-casque.html',
    price: '280,00 €',
    keywords: 'casque audio sans fil bluetooth musique'
  },
  {
    name: 'Tasse thermos',
    href: 'produit-tasse.html',
    price: '24,50 €',
    keywords: 'tasse thermos boisson chaude froide voyage'
  }
];

// Récupération des éléments HTML utilisés pour afficher le panier.
// Formate un montant en euros avec une virgule et le symbole €.
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

// Met à jour l'affichage du panier dans la colonne droite.
function renderCart() {
  const cart = getCart();
  cartItems.innerHTML = '';

  if (cart.length === 0) {
    // Affiche un message lorsque le panier est vide.
    cartItems.innerHTML = '<p class="empty-cart">Votre panier est vide.</p>';
    cartCount.textContent = '0';
    cartTotal.textContent = '0,00 €';
    checkoutButton.disabled = true;
    return;
  }

  let total = 0;

  // Génère un élément pour chaque produit dans le panier.
  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <div>${item.quantity} x ${formatPrice(item.price)}</div>
      </div>
      <button type="button" data-index="${index}">Supprimer</button>
    `;

    cartItems.appendChild(row);
  });

  // Mise à jour du nombre total d'articles et du total du panier.
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartTotal.textContent = formatPrice(total);
  checkoutButton.disabled = false;
}

// Ajoute un produit au panier ou augmente sa quantité si le produit existe déjà.
function addToCart(name, price) {
  const cart = getCart();
  const existing = cart.find((item) => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  saveCart(cart);
  renderCart();
}

// Supprime un produit du panier en utilisant son index dans le tableau.
function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

// Affiche ou masque le panneau du panier.
function toggleCartPanel() {
  cartPanel.classList.toggle('open');
}

function filterProducts(query) {
  const normalized = query.trim().toLowerCase();

  productCards.forEach((card) => {
    const text = card.textContent.toLowerCase();
    const matches = !normalized || text.includes(normalized);
    card.classList.toggle('hidden', !matches);
  });
}

function renderSearchResults(query) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    searchResults.innerHTML = '';
    searchResults.classList.remove('open');
    return;
  }

  const matches = catalog.filter((product) => {
    const haystack = `${product.name} ${product.keywords}`.toLowerCase();
    return haystack.includes(normalized);
  });

  if (matches.length === 0) {
    searchResults.innerHTML = '<div class="search-empty">Aucun produit trouvé</div>';
  } else {
    searchResults.innerHTML = matches
      .map((product) => `
        <button type="button" class="search-result-item" data-href="${product.href}">
          <strong>${product.name}</strong>
          <span>${product.price}</span>
        </button>
      `)
      .join('');
  }

  searchResults.classList.add('open');
}

function onSearchInput(event) {
  const query = event.target.value;
  filterProducts(query);
  renderSearchResults(query);
}

function onSearchResultClick(event) {
  const item = event.target.closest('.search-result-item');
  if (!item) return;

  event.preventDefault();
  window.location.href = item.dataset.href;
}

// Écoute le clic sur un bouton "Ajouter" d'un produit.
function onAddToCartClick(event) {
  const button = event.target.closest('.add-to-cart');
  if (!button) return;
  const name = button.dataset.name;
  const price = parseFloat(button.dataset.price);
  addToCart(name, price);
}

// Écoute le clic sur un bouton "Supprimer" du panier.
function onRemoveClick(event) {
  const button = event.target.closest('.cart-item button');
  if (!button) return;
  const index = parseInt(button.dataset.index, 10);
  removeFromCart(index);
}

// Simule une validation de commande et vide le panier.
function onCheckout() {
  const cart = getCart();
  if (cart.length === 0) return;
  // Redirige vers la page panier.
  window.location.href = 'cart.html';
}

// Gestion centralisée des clics dans la page.
// Permet de capter à la fois l'ajout au panier et la suppression d'un article.
document.body.addEventListener('click', (event) => {
  onSearchResultClick(event);
  onAddToCartClick(event);
  onRemoveClick(event);
});

// Événements pour la recherche et le panier.
if (searchInput) {
  searchInput.addEventListener('input', onSearchInput);
  searchInput.addEventListener('focus', () => {
    renderSearchResults(searchInput.value);
  });
}

document.addEventListener('click', (event) => {
  if (!searchInput?.contains(event.target) && !searchResults?.contains(event.target)) {
    searchResults.classList.remove('open');
  }
});

cartButton.addEventListener('click', toggleCartPanel);
checkoutButton.addEventListener('click', onCheckout);

// Affiche le panier initialement (vide).
renderCart();
