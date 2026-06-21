import { addToCart } from './cart.js';

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
};
let products: Product[] = [];
let isDragging = false;
let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationFrameId: number;

const slider = document.querySelector('.travelSlider') as HTMLElement;
const slides = document.querySelector('.travelSlides') as HTMLElement;

function renderSelectedProducts() {
  const container = document.querySelector('.productGrid') as HTMLElement;
  const selected = products.slice(0, 4);

  container.innerHTML = selected.map(p => 
    `<article class="productCard" data-id="${p.id}">
      <img src="${resolveImage(p.imageUrl)}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>$${p.price}</p>
      <button class="btn addToCart">Add To Cart</button>
    </article>
  `).join('');
}

function renderNewProducts() {
  const container = document.querySelector('.newProducts') as HTMLElement;

  const shuffled = [...products].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 4);

  container.innerHTML = selected.map(p => `
    <article class="productCard" data-id="${p.id}">
      <img src="${resolveImage(p.imageUrl)}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>$${p.price}</p>
      <button class="btn viewProduct">View Product</button>
    </article>
  `).join('');
}

async function loadProducts() {
  const res = await fetch('./assets/data.json');
  const data = await res.json();
  products = data.data;

  renderSelectedProducts();
  renderNewProducts();
}

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const card = target.closest('.productCard') as HTMLElement;
  if (!card) return;

  const id = card.dataset.id;
  const product = products.find(p => p.id === id);
  if (!product) return;

  if (target.classList.contains('addToCart')) {
    addToCart(product);
  }

  if (target.classList.contains('viewProduct') ||target.tagName === 'IMG' ||target.tagName === 'H3') {
    window.location.href = `./html/product.html?id=${id}`;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
});

function resolveImage(path: string): string {
  if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/'){
    return path.replace('../', './');
  }
  return path;
}

function getPositionX(event: MouseEvent | TouchEvent): number {
  if (event instanceof MouseEvent) return event.clientX;
  return event.touches[0].clientX;
}

function setSliderPosition() {
  slides.style.transform = `translateX(${currentTranslate}px)`;
}

function animation() {
  setSliderPosition();
  if (isDragging) requestAnimationFrame(animation);
}

function clampPosition(value: number):number {
  const maxTranslate = 0;
  const minTranslate = -(slides.scrollWidth - slider.clientWidth);
  return Math.max(minTranslate, Math.min(maxTranslate, value));
}

function dragStart(event: MouseEvent | TouchEvent) {
  isDragging = true;
  startX = getPositionX(event);
  slider.style.cursor = 'grabbing';
  animationFrameId = requestAnimationFrame(animation);
}

function dragMove(event: MouseEvent | TouchEvent) {
  if (!isDragging) return;
  const currentX = getPositionX(event);
  const diff = currentX - startX;
  currentTranslate = clampPosition(prevTranslate + diff);
}

function dragEnd() {
  isDragging = false;
  cancelAnimationFrame(animationFrameId);
  prevTranslate = currentTranslate;
  slider.style.cursor = 'grab';
}

slider.addEventListener('mousedown', dragStart);
slider.addEventListener('mousemove', dragMove);
slider.addEventListener('mouseup', dragEnd);
slider.addEventListener('mouseleave', dragEnd);
slider.addEventListener('touchstart', dragStart);
slider.addEventListener('touchmove', dragMove);
slider.addEventListener('touchend', dragEnd);

slides.querySelectorAll('img').forEach(img=>{
  img.addEventListener('dragstart', (e)=>e.preventDefault());
});