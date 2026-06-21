import { addToCart, updateCartCounter } from './cart.js';
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
let currentProduct: Product | null = null;
let qty = 1;
let selectedRating = 0;
const qtyElement = document.getElementById('qty')!; //! it isnt null
const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.tabContent');
const stars = document.querySelectorAll('.starCount span');
const submitButton = document.getElementById('submitReview')!;
const message = document.getElementById('reviewMessage')!;
const reviewProductName = document.querySelector('.reviewProductName');

tabs.forEach(tab=>{
    tab.addEventListener('click', ()=>{
        tabs.forEach(t=>t.classList.remove('active'));
        contents.forEach(c=>c.classList.remove('active'));
        tab.classList.add('active');
        const id = tab.getAttribute('data-tab');
        document.getElementById(id!)?.classList.add('active');
    });
});

document.getElementById('plus')?.addEventListener('click', ()=>{
    qty++;
    qtyElement.textContent = qty.toString();
});

document.getElementById('minus')?.addEventListener('click', ()=>{
    if(qty > 1) qty--;
    qtyElement.textContent = qty.toString();
});

function loadRelatedProducts(current: Product) {
    const container = document.querySelector('.relatedProducts') as HTMLElement;
    const random = allProducts.filter(p=>p.id !== current.id).sort(()=>0.5 - Math.random()).slice(0, 4);
    container.innerHTML = random.map(product =>
        `<div class="productCard" data-id="${product.id}">
            ${product.salesStatus ? '<span class="sale">SALE</span>' : ''}
            <img src="${product.imageUrl}">
            <h4>${product.name}</h4>
            <p>$${product.price}</p>
            <button class="btn addToCart">Add To Cart</button>
        </div>
    `).join('');
}

function getProductId(): string | null {
    const element = new URLSearchParams(window.location.search);
    return element.get('id');
}

function renderReviewStars(rating: number) {
    const container = document.querySelector('.productRating') as HTMLElement;
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    container.innerHTML ='★'.repeat(fullStars) + '☆'.repeat(emptyStars);
}

function renderProduct(product: Product) {
    (document.querySelector('.productName') as HTMLElement).textContent = product.name;
    (document.querySelector('.productPrice') as HTMLElement).textContent = `$${product.price}`;
    (document.querySelector('.mainImage') as HTMLImageElement).src = product.imageUrl;
    renderReviewStars(product.rating);   
    if (reviewProductName) {
        reviewProductName.textContent = product.name;
    }
}

document.addEventListener('click', (e)=>{
    const target = e.target as HTMLElement;
    if (!target.classList.contains('addToCart')) return;

    const size = (document.querySelector('.productSize') as HTMLSelectElement)?.value || '';
    const color = (document.querySelector('.productColor') as HTMLSelectElement)?.value || '';
    if (currentProduct && target.closest('.productDetailsContainer')) {
        addToCart({...currentProduct,size,color, quantity: qty});
        updateCartCounter();
        return;
    }

    const card = target.closest('.productCard') as HTMLElement;
    if (!card) return;
    const id = card.dataset.id;
    if (!id) return;
    const product = allProducts.find(p=>p.id === id);
    if (!product) return;
    addToCart({...product,size,color, quantity: 1});
    updateCartCounter();
});

async function loadProduct(){
    const res = await fetch('../assets/data.json');
    const data = await res.json();
    allProducts = data.data;
    
    const id = getProductId();
    const product = allProducts.find(p=>p.id === id);
    if (!product) {
        alert('Product not found');
        return;
    }
    currentProduct = product;
    renderProduct(product);
    loadRelatedProducts(product);
    updateCartCounter();
}

stars.forEach(star=>{
    star.addEventListener('click', ()=>{
        selectedRating = Number(star.getAttribute('data-value'));
        stars.forEach(s=>{
            const val = Number(s.getAttribute('data-value'));
            s.textContent = val <= selectedRating ? '★' : '☆';
        });
    });
});

submitButton.addEventListener('click', ()=>{
    const name = (document.getElementById('reviewName') as HTMLInputElement).value;
    const email = (document.getElementById('reviewEmail') as HTMLInputElement).value;
    const text = (document.getElementById('reviewText') as HTMLTextAreaElement).value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || !email || !text || selectedRating === 0) {
        message.textContent = 'Error Message - Fill All Forms';
        message.style.color = 'red';
        setTimeout(() => { message.textContent = ''}, 5000);
        return;
    }
    if (!emailRegex.test(email)) {
        message.textContent = 'Error Message - Email';
        message.style.color = 'red';
        setTimeout(() => { message.textContent = ''}, 5000);
        return;
    }
    message.textContent = 'Succes Message';
    message.style.color = 'green';
    setTimeout(() => { message.textContent = ''}, 5000);
});

loadProduct();