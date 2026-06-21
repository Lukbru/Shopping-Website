
type Product = {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
    color: string;
    size: string;
    salesStatus: boolean;
    rating: number;
    popularity: number;
}
export type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  size?: string;
  color?: string;
}
export function getCart(): CartItem[] {
  return JSON.parse(localStorage.getItem('cart') ?? '[]');
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateTotals() {
  const totalEl = document.getElementById('total');
  const discountEl = document.getElementById('discount');
  const shippingEl = document.getElementById('shipping');
  const discountedEl = document.getElementById('discounted');
  const discountRow = document.getElementById('discountRow');

  if (!totalEl || !discountEl || !shippingEl || !discountedEl) return;
  const cart = getCart();
  const total = cart.reduce((sum, item)=>sum + item.price * item.quantity, 0);
  const discount = total > 3000 ? total * 0.1 : 0;
  const shipping = cart.length ? 30 : 0;
  const discounted = total - discount + shipping;

  totalEl.textContent = `$${total}`;
  discountEl.textContent = `$${discount}`;
  shippingEl.textContent = `$${shipping}`;
  discountedEl.textContent = `$${discounted}`;

  if (discountRow) {
    if (discount === 0) {
      discountRow.classList.add('hidden');
    } else {
      discountRow.classList.remove('hidden');
    }
  }
}

function renderCart() {
  const container = document.getElementById('cartItems')!;
  if (!container) return;
  const cart = getCart();
  if (cart.length === 0) {
    document.getElementById('message')!.textContent ='Your cart is empty. Use the catalog to add new items.';
    container.innerHTML = '';
    updateTotals();
    return;
  }
  container.innerHTML = cart.map(item => 
    `<div class="cartRow" data-id="${item.id}">
      <img src="${item.imageUrl}">
      <span>${item.name}</span>
      <span>$${item.price}</span>
      <div class="quantityControl">
        <button class="minus">-</button>
        <span>${item.quantity}</span>
        <button class="plus">+</button>
      </div>
      <span>$${item.price * item.quantity}</span>
      <button class="delete">🗑</button>
    </div>
  `).join('');
  updateTotals();
}

export function updateCartCounter() {
  const cart = getCart();
  const count = cart.reduce((sum, item)=>sum + item.quantity, 0);
  const counter = document.querySelector('.cartCount');
  if (!counter) return;
  counter.textContent = count.toString();
  if (count > 0) {
    counter.classList.add('visible');
  } else {
    counter.classList.remove('visible');
  }
}

document.getElementById('cartItems')?.addEventListener('click', (e)=>{
  const target = e.target as HTMLElement;
  const row = target.closest('.cartRow') as HTMLElement;
  if (!row) return;
  const id = row.dataset.id!;
  let cart = getCart();
  const item = cart.find(p=>p.id === id);
  if (!item) return;
  if (target.classList.contains('plus')) {
    item.quantity++;
  }
  if (target.classList.contains('minus')) {
    if (item.quantity > 1) item.quantity--;
  }
  if (target.classList.contains('delete')) {
    cart = cart.filter(p=>p.id !== id);
  }
  saveCart(cart);
  renderCart();
  updateCartCounter();
});

document.getElementById('clearCart')?.addEventListener('click', ()=>{
  localStorage.removeItem('cart');
  renderCart();
  updateCartCounter();
});

document.getElementById('checkout')?.addEventListener('click', ()=>{
  localStorage.removeItem('cart');
  renderCart();
  updateCartCounter();
  document.getElementById('message')!.textContent ='Thank you for your purchase.';
});

export function addToCart(product: Product & { quantity?: number }) {
  const cart = getCart();
  const qty = product.quantity ?? 1;
  const existing = cart.find(p => p.id === product.id && p.size === product.size && p.color === product.color);
  if (existing) {
    existing.quantity+=qty;
  } else {
    cart.push({       
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        size: product.size,
        color: product.color,
        quantity: qty});
  }
  saveCart(cart);
  updateCartCounter();
}

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  updateCartCounter();
});