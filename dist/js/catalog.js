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
import { addToCart } from './cart.js';
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 12;
const sortSelect = document.querySelector('.catalogSort');
const searchInput = document.querySelector('.catalogSearch');
const nextButton = document.querySelector('.catalogNext');
const previousButton = document.querySelector('.catalogPrevious');
const toggleFilters = document.getElementById('toggleFilters');
const filtersPanel = document.getElementById('filtersPanel');
const categoryFilter = document.querySelector('.filterCategory');
const colorFilter = document.querySelector('.filterColor');
const sizeFilter = document.querySelector('.filterSize');
const salesFilter = document.getElementById('filterSales');
const resetButton = document.getElementById('resetFilters');
function updateResultsCount() {
    const element = document.querySelector('.catalogResults');
    if (filteredProducts.length === 0) {
        element.innerHTML = `Product not found`;
        return;
    }
    const start = (currentPage - 1) * productsPerPage + 1;
    const end = Math.min(currentPage * productsPerPage, filteredProducts.length);
    element.innerHTML = `Showing ${start}-${end} of ${filteredProducts.length} results`;
}
(_a = document.querySelector('.catalogProducts')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', (element) => {
    var _a;
    const imgage = element.target.closest('.productInformation');
    if (imgage) {
        element.stopPropagation();
        const card = imgage.closest('.productCard');
        const id = (_a = card === null || card === void 0 ? void 0 : card.dataset) === null || _a === void 0 ? void 0 : _a.id;
        if (id) {
            window.location.href = `./product.html?id=${id}`;
        }
    }
});
(_b = document.querySelector('.catalogProducts')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('addToCart')) {
        e.stopPropagation();
        const card = target.closest('.productCard');
        const id = card.dataset.id;
        if (!id) {
            return;
        }
        ;
        const product = allProducts.find(p => p.id === id);
        if (!product) {
            return;
        }
        ;
        addToCart(product);
    }
});
function renderProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        const container = document.querySelector('.catalogProducts');
        const start = (currentPage - 1) * productsPerPage;
        const paginated = filteredProducts.slice(start, start + productsPerPage);
        container.innerHTML = paginated.map(product => `
        <div class="productCard" data-id="${product.id}">
         ${product.salesStatus ? '<span class="sale">SALE</span>' : ''}
         <img class="productInformation" src="${product.imageUrl}" alt="${product.name}">
         <h3>${product.name}</h3>
         <p>$${product.price}</p>
         <button class="btn addToCart">Add To Cart</button>
        </div>
    `).join('');
        updateResultsCount();
    });
}
function loadTopBestSets() {
    const element = document.querySelector('.bestSets');
    if (!element)
        return;
    const topProducts = [...allProducts].sort((a, b) => b.rating - a.rating).slice(0, 5);
    element.innerHTML = topProducts.map(product => `
        <div class='bestSetItem'>
        <img src="${product.imageUrl}" alt="${product.name}" class="bestSetImg">
        <div class="bestSetInfo">
            <h4 class="bestSetName">${product.name}</h4>
            <p class="bestSetRating">${renderStars(product.rating)}</p>
            <p class="bestSetPrice">$${product.price}</p>
        </div>
        </div>
        `).join('');
}
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '☆';
    }
    return stars;
}
function loadProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch('../assets/data.json');
        const data = yield res.json();
        allProducts = data.data;
        filteredProducts = [...allProducts];
        renderProducts();
        loadTopBestSets();
    });
}
loadProducts();
sortSelect.addEventListener('change', () => {
    const value = sortSelect.value;
    if (value === 'priceAscending') {
        filteredProducts.sort((a, b) => a.price - b.price);
    }
    else if (value === 'priceDescending') {
        filteredProducts.sort((a, b) => b.price - a.price);
    }
    else if (value === 'rating') {
        filteredProducts.sort((a, b) => b.rating - a.rating);
    }
    else if (value === 'popularity') {
        filteredProducts.sort((a, b) => b.popularity - a.popularity);
    }
    currentPage = 1;
    renderProducts();
});
searchInput.addEventListener('input', () => {
    const value = searchInput.value.toLowerCase();
    if (!value) {
        return;
    }
    filteredProducts = allProducts.filter(product => product.name.toLowerCase().includes(value));
    currentPage = 1;
    renderProducts();
});
function applyFilters() {
    const categorySelect = categoryFilter.value;
    const colorSelect = colorFilter.value;
    const sizeSelect = sizeFilter.value;
    const salesOnly = salesFilter === null || salesFilter === void 0 ? void 0 : salesFilter.checked;
    filteredProducts = allProducts.filter(product => {
        return (!categorySelect || product.category === categorySelect)
            && (!colorSelect || product.color === colorSelect)
            && (!sizeSelect || product.size === sizeSelect)
            && (!salesOnly || product.salesStatus === true);
    });
    currentPage = 1;
    renderProducts();
}
resetButton.addEventListener('click', () => {
    categoryFilter.value = '';
    colorFilter.value = '';
    sizeFilter.value = '';
    salesFilter.checked = false;
    filteredProducts = [...allProducts];
    currentPage = 1;
    renderProducts();
});
nextButton === null || nextButton === void 0 ? void 0 : nextButton.addEventListener('click', () => {
    if (currentPage * productsPerPage < filteredProducts.length) {
        currentPage++;
        renderProducts();
    }
});
previousButton === null || previousButton === void 0 ? void 0 : previousButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderProducts();
    }
});
toggleFilters.addEventListener('click', () => {
    filtersPanel.classList.toggle('hidden');
    toggleFilters.textContent = filtersPanel.classList.contains('hidden') ? 'SHOW FILTERS' : 'HIDE FILTERS';
});
categoryFilter.addEventListener('change', applyFilters);
colorFilter.addEventListener('change', applyFilters);
sizeFilter.addEventListener('change', applyFilters);
salesFilter.addEventListener('change', applyFilters);
