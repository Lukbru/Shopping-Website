var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { addToCart } from './cart.js';
let products = [];
let isDragging = false;
let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationFrameId;
const slider = document.querySelector('.travelSlider');
const slides = document.querySelector('.travelSlides');
function renderSelectedProducts() {
    const container = document.querySelector('.productGrid');
    const selected = products.slice(0, 4);
    container.innerHTML = selected.map(p => `<article class="productCard" data-id="${p.id}">
      <img src="${resolveImage(p.imageUrl)}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>$${p.price}</p>
      <button class="btn addToCart">Add To Cart</button>
    </article>
  `).join('');
}
function renderNewProducts() {
    const container = document.querySelector('.newProducts');
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
function loadProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch('./assets/data.json');
        const data = yield res.json();
        products = data.data;
        renderSelectedProducts();
        renderNewProducts();
    });
}
document.addEventListener('click', (e) => {
    const target = e.target;
    const card = target.closest('.productCard');
    if (!card)
        return;
    const id = card.dataset.id;
    const product = products.find(p => p.id === id);
    if (!product)
        return;
    if (target.classList.contains('addToCart')) {
        addToCart(product);
    }
    if (target.classList.contains('viewProduct') || target.tagName === 'IMG' || target.tagName === 'H3') {
        window.location.href = `./html/product.html?id=${id}`;
    }
});
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});
function resolveImage(path) {
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        return path.replace('../', './');
    }
    return path;
}
function getPositionX(event) {
    if (event instanceof MouseEvent)
        return event.clientX;
    return event.touches[0].clientX;
}
function setSliderPosition() {
    slides.style.transform = `translateX(${currentTranslate}px)`;
}
function animation() {
    setSliderPosition();
    if (isDragging)
        requestAnimationFrame(animation);
}
function clampPosition(value) {
    const maxTranslate = 0;
    const minTranslate = -(slides.scrollWidth - slider.clientWidth);
    return Math.max(minTranslate, Math.min(maxTranslate, value));
}
function dragStart(event) {
    isDragging = true;
    startX = getPositionX(event);
    slider.style.cursor = 'grabbing';
    animationFrameId = requestAnimationFrame(animation);
}
function dragMove(event) {
    if (!isDragging)
        return;
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
slides.querySelectorAll('img').forEach(img => {
    img.addEventListener('dragstart', (e) => e.preventDefault());
});
