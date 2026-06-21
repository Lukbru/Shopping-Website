export {};
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
}
let allProducts: Product[] = [];
let filteredProducts: Product[] = [];
let currentPage = 1;
const productsPerPage = 12;

const sortSelect = document.querySelector('.catalogSort') as HTMLSelectElement;
const searchInput = document.querySelector('.catalogSearch') as HTMLInputElement;
const nextButton = document.querySelector('.catalogNext');
const previousButton = document.querySelector('.catalogPrevious');
const toggleFilters = document.getElementById('toggleFilters') as HTMLButtonElement;
const filtersPanel = document.getElementById('filtersPanel') as HTMLElement;

const categoryFilter = document.querySelector('.filterCategory') as HTMLSelectElement;
const colorFilter = document.querySelector('.filterColor') as HTMLSelectElement;
const sizeFilter = document.querySelector('.filterSize') as HTMLSelectElement;
const salesFilter = document.getElementById('filterSales') as HTMLInputElement;
const resetButton = document.getElementById('resetFilters') as HTMLButtonElement;

function updateResultsCount() {
    const element = document.querySelector('.catalogResults') as HTMLElement;
    if (filteredProducts.length === 0) {
     element.innerHTML = `Product not found`;
     return;
    }
    const start = (currentPage - 1) * productsPerPage + 1;
    const end = Math.min(currentPage * productsPerPage, filteredProducts.length);
    element.innerHTML = `Showing ${start}-${end} of ${filteredProducts.length} results`;
}

document.querySelector('.catalogProducts')?.addEventListener('click', (element)=>{
    const imgage = (element.target as HTMLElement).closest('.productInformation');
    if (imgage) {
        element.stopPropagation();
        const card = imgage.closest('.productCard') as HTMLElement | null;
        const id = card?.dataset?.id;
        if (id) {
            window.location.href = `./product.html?id=${id}`;
        }
    }
});

document.querySelector('.catalogProducts')?.addEventListener('click', (e)=>{
  const target = e.target as HTMLElement;
  if (target.classList.contains('addToCart')) {
    e.stopPropagation();
    const card = target.closest('.productCard') as HTMLElement;
    const id = card.dataset.id;
    if (!id) {
        return
    };
    const product = allProducts.find(p=>p.id === id);
    if (!product) {
        return
    };
    addToCart(product);
  }
});

async function renderProducts() {
    const container = document.querySelector('.catalogProducts') as HTMLElement;
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
}

function loadTopBestSets(){
    const element = document.querySelector('.bestSets') as HTMLElement;
    if (!element) return;
    const topProducts = [...allProducts].sort((a,b)=>b.rating - a.rating).slice(0,5);
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

function renderStars(rating: number): string {
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

async function loadProducts() {
    const res = await fetch('../assets/data.json');
    const data = await res.json();
    allProducts = data.data;
    filteredProducts = [...allProducts];
    renderProducts();
    loadTopBestSets();
}
loadProducts();

sortSelect.addEventListener('change', () => {
    const value = sortSelect.value;
    if (value === 'priceAscending') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (value === 'priceDescending') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (value === 'rating') {
        filteredProducts.sort((a, b) => b.rating - a.rating);
    } else if (value === 'popularity') {
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
    currentPage=1;
    renderProducts();
});

function applyFilters() {
    const categorySelect = categoryFilter.value;
    const colorSelect = colorFilter.value;
    const sizeSelect = sizeFilter.value;
    const salesOnly = salesFilter?.checked;

    filteredProducts = allProducts.filter(product => {
        return (!categorySelect || product.category === categorySelect) 
        && (!colorSelect || product.color === colorSelect) 
        && (!sizeSelect || product.size === sizeSelect)
        && (!salesOnly || product.salesStatus === true);
    });
    currentPage = 1;
    renderProducts();
}

resetButton.addEventListener('click', ()=> {
    categoryFilter.value= '';
    colorFilter.value = '';
    sizeFilter.value = '';
    salesFilter.checked = false;
    filteredProducts = [...allProducts];
    currentPage=1;
    renderProducts();
});

nextButton?.addEventListener('click', () => {
    if (currentPage * productsPerPage < filteredProducts.length) {
        currentPage++;
        renderProducts();
    }
});
previousButton?.addEventListener('click', () => {
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

