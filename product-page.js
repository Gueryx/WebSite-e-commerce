function addToCartFromProduct() {
  const button = document.querySelector('.add-to-cart');
  if (!button) return;

  button.addEventListener('click', () => {
    const cart = JSON.parse(localStorage.getItem('eShopCart') || '[]');
    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);

    const existing = cart.find((item) => item.name === name);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1 });
    }

    localStorage.setItem('eShopCart', JSON.stringify(cart));
    window.location.href = 'cart.html';
  });
}

addToCartFromProduct();
