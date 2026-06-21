var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b;
import { addToCart, updateCartCounter } from './cart.js';
let allProducts = [];
let currentProduct = null;
let qty = 1;
let selectedRating = 0;
const qtyElement = document.getElementById('qty'); //! it isnt null
const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.tabContent');
const stars = document.querySelectorAll('.starCount span');
const submitButton = document.getElementById('submitReview');
const message = document.getElementById('reviewMessage');
const reviewProductName = document.querySelector('.reviewProductName');
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        var _a;
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const id = tab.getAttribute('data-tab');
        (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.classList.add('active');
    });
});
(_a = document.getElementById('plus')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    qty++;
    qtyElement.textContent = qty.toString();
});
(_b = document.getElementById('minus')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
    if (qty > 1)
        qty--;
    qtyElement.textContent = qty.toString();
});
function loadRelatedProducts(current) {
    const container = document.querySelector('.relatedProducts');
    const random = allProducts.filter(p => p.id !== current.id).sort(() => 0.5 - Math.random()).slice(0, 4);
    container.innerHTML = random.map(product => `<div class="productCard" data-id="${product.id}">
            ${product.salesStatus ? '<span class="sale">SALE</span>' : ''}
            <img src="${product.imageUrl}">
            <h4>${product.name}</h4>
            <p>$${product.price}</p>
            <button class="btn addToCart">Add To Cart</button>
        </div>
    `).join('');
}
function getProductId() {
    const element = new URLSearchParams(window.location.search);
    return element.get('id');
}
function renderReviewStars(rating) {
    const container = document.querySelector('.productRating');
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    container.innerHTML = '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
}
function renderProduct(product) {
    document.querySelector('.productName').textContent = product.name;
    document.querySelector('.productPrice').textContent = `$${product.price}`;
    document.querySelector('.mainImage').src = product.imageUrl;
    renderReviewStars(product.rating);
    if (reviewProductName) {
        reviewProductName.textContent = product.name;
    }
}
document.addEventListener('click', (e) => {
    var _a, _b;
    const target = e.target;
    if (!target.classList.contains('addToCart'))
        return;
    const size = ((_a = document.querySelector('.productSize')) === null || _a === void 0 ? void 0 : _a.value) || '';
    const color = ((_b = document.querySelector('.productColor')) === null || _b === void 0 ? void 0 : _b.value) || '';
    if (currentProduct && target.closest('.productDetailsContainer')) {
        addToCart(Object.assign(Object.assign({}, currentProduct), { size, color, quantity: qty }));
        updateCartCounter();
        return;
    }
    const card = target.closest('.productCard');
    if (!card)
        return;
    const id = card.dataset.id;
    if (!id)
        return;
    const product = allProducts.find(p => p.id === id);
    if (!product)
        return;
    addToCart(Object.assign(Object.assign({}, product), { size, color, quantity: 1 }));
    updateCartCounter();
});
function loadProduct() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch('../assets/data.json');
        const data = yield res.json();
        allProducts = data.data;
        const id = getProductId();
        const product = allProducts.find(p => p.id === id);
        if (!product) {
            alert('Product not found');
            return;
        }
        currentProduct = product;
        renderProduct(product);
        loadRelatedProducts(product);
        updateCartCounter();
    });
}
stars.forEach(star => {
    star.addEventListener('click', () => {
        selectedRating = Number(star.getAttribute('data-value'));
        stars.forEach(s => {
            const val = Number(s.getAttribute('data-value'));
            s.textContent = val <= selectedRating ? '★' : '☆';
        });
    });
});
submitButton.addEventListener('click', () => {
    const name = document.getElementById('reviewName').value;
    const email = document.getElementById('reviewEmail').value;
    const text = document.getElementById('reviewText').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || !email || !text || selectedRating === 0) {
        message.textContent = 'Error Message - Fill All Forms';
        message.style.color = 'red';
        setTimeout(() => { message.textContent = ''; }, 5000);
        return;
    }
    if (!emailRegex.test(email)) {
        message.textContent = 'Error Message - Email';
        message.style.color = 'red';
        setTimeout(() => { message.textContent = ''; }, 5000);
        return;
    }
    message.textContent = 'Succes Message';
    message.style.color = 'green';
    setTimeout(() => { message.textContent = ''; }, 5000);
});
loadProduct();
