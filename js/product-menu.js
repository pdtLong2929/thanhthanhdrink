import { store } from './firebase-service.js';

let currentProduct = null;
let currentProductIndex = 0;
let currentTab = 'ALL';
let currentSearch = '';
let currentSort = 'default';

export function renderProductsToGrid(gridElement, productList, fullMenu = false) {
    gridElement.innerHTML = '';
    productList.forEach((product, i) => {
        if (!product) return;
        
        let tagsHtml = '';
        if (product.tags) {
            product.tags.forEach(t => {
                if (t === 'Mới') tagsHtml += `<span class="tag-badge accent">${t}</span>`;
                else if (t === 'Best Seller') tagsHtml += `<span class="tag-badge special">${t}</span>`;
                else tagsHtml += `<span class="tag-badge">${t}</span>`;
            });
        }

        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-id', product.id);
        
        const realIndex = store.products.findIndex(p => p.id === product.id);
        
        card.onclick = () => {
            if (realIndex !== -1) {
                currentProductIndex = realIndex;
                openModal(realIndex);
            }
        };

        if (!fullMenu) {
            card.innerHTML = `
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                    <div class="product-tags">${tagsHtml}</div>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-ingredients" style="font-size: 0.8rem; color: var(--text-light); border-bottom: 1px dashed rgba(0,0,0,0.1); padding-bottom: 12px; margin-bottom: 12px; min-height: auto;">${product.ingredients}</p>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem;">
                        <div style="color: var(--text-color);">
                            <span style="font-size: 0.7rem; color: var(--text-light);">M</span> <strong>${product.priceM}</strong> &nbsp; <span style="font-size: 0.7rem; color: var(--text-light);">L</span> <strong>${product.priceL}</strong>
                        </div>
                        <button style="width: 24px; height: 24px; border-radius: 50%; background: var(--mint-bg); color: var(--primary-dark); border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; pointer-events: none;"><i class="ph ph-plus"></i></button>
                    </div>
                </div>
            `;
        } else {
            const sales = 100 + (product.name.length * 20);
            const rating = (4.5 + (product.name.length % 5) * 0.1).toFixed(1);

            card.innerHTML = `
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <div class="product-tags">${tagsHtml}</div>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-ingredients">${product.ingredients}</p>
                    
                    <div class="product-stats">
                        <span><i class="ph-fill ph-star"></i> ${rating}</span>
                        <span>•</span>
                        <span>${sales} đã bán</span>
                    </div>

                    <div class="product-bottom">
                        <div class="product-prices">
                            M <strong>${product.priceM}</strong> &nbsp; L <strong>${product.priceL}</strong>
                        </div>
                        <button class="add-btn"><i class="ph ph-plus"></i></button>
                    </div>
                </div>
            `;
        }
        gridElement.appendChild(card);
    });
}

export function initProductGrid() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    const featuredProducts = [store.products[1], store.products[2], store.products[3], store.products[4], store.products[7], store.products[8], store.products[15], store.products[16]].filter(p => p !== undefined);
    renderProductsToGrid(grid, featuredProducts, false);
}

export function initFullMenu() {
    const searchInput = document.getElementById('menu-search');
    const sortSelect = document.getElementById('menu-sort');
    const tabsContainer = document.getElementById('menu-tabs');
    
    if (!tabsContainer || !searchInput || !sortSelect) return;

    // Build tabs dynamically
    tabsContainer.innerHTML = '';
    
    // "All" tab
    const allBtn = document.createElement('button');
    allBtn.className = 'menu-tab-btn active';
    allBtn.setAttribute('data-tab', 'ALL');
    allBtn.style = 'padding: 8px 16px; border-radius: 20px; border: 1px solid var(--primary-dark); background: var(--primary-dark); color: white; font-weight: 600; cursor: pointer; transition: 0.3s;';
    allBtn.textContent = `Tất cả (${store.products.length})`;
    tabsContainer.appendChild(allBtn);

    // Category tabs
    const cats = store.categories || [];
    cats.forEach(cat => {
        const count = store.products.filter(p => p.category === cat.id).length;
        const btn = document.createElement('button');
        btn.className = 'menu-tab-btn';
        btn.setAttribute('data-tab', cat.id);
        btn.style = 'padding: 8px 16px; border-radius: 20px; border: 1px solid rgba(82,162,159,0.3); background: transparent; color: var(--text-color); cursor: pointer; transition: 0.3s;';
        btn.textContent = `${cat.name} (${count})`;
        tabsContainer.appendChild(btn);
    });

    const tabs = document.querySelectorAll('.menu-tab-btn');

    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam) currentTab = tabParam;

    tabs.forEach(tab => {
        if (tab.getAttribute('data-tab') === currentTab) {
            tab.style.background = 'var(--primary-dark)';
            tab.style.color = 'white';
            tab.style.border = '1px solid var(--primary-dark)';
            tab.classList.add('active');
        } else {
            tab.style.background = 'transparent';
            tab.style.color = 'var(--text-color)';
            tab.style.border = '1px solid rgba(82,162,159,0.3)';
            tab.classList.remove('active');
        }

        tab.addEventListener('click', (e) => {
            currentTab = e.target.getAttribute('data-tab');

            const newUrl = new URL(window.location);
            newUrl.searchParams.set('tab', currentTab);
            window.history.pushState({}, '', newUrl);

            tabs.forEach(t => {
                t.style.background = 'transparent';
                t.style.color = 'var(--text-color)';
                t.style.border = '1px solid rgba(82,162,159,0.3)';
                t.classList.remove('active');
            });
            e.target.style.background = 'var(--primary-dark)';
            e.target.style.color = 'white';
            e.target.style.border = '1px solid var(--primary-dark)';
            e.target.classList.add('active');

            renderFullMenu();
        });
    });

    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase();
        renderFullMenu();
    });

    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderFullMenu();
    });

    renderFullMenu();
}

function renderFullMenu() {
    const grid = document.getElementById('full-menu-grid');
    const countDisplay = document.getElementById('menu-count');
    if (!grid) return;

    let filtered = store.products;

    if (currentTab !== 'ALL') {
        filtered = filtered.filter(p => p.category === currentTab);
    }
    if (currentSearch) {
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(currentSearch) ||
            p.ingredients.toLowerCase().includes(currentSearch)
        );
    }
    if (currentSort === 'price-asc') {
        filtered.sort((a, b) => parseInt(a.priceM) - parseInt(b.priceM));
    } else if (currentSort === 'price-desc') {
        filtered.sort((a, b) => parseInt(b.priceM) - parseInt(a.priceM));
    } else if (currentSort === 'calo-asc') {
        filtered.sort((a, b) => a.nutritionM.calo - b.nutritionM.calo);
    }

    countDisplay.textContent = filtered.length;
    renderProductsToGrid(grid, filtered, true);
}

export function openModal(index) {
    if (!store.products[index]) return;
    renderModalData(index);
    document.getElementById('product-modal').classList.add('active');
    document.getElementById('overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

export function closeModal() {
    document.getElementById('product-modal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
    document.body.style.overflow = '';
}

export function renderModalData(index) {
    const product = store.products[index];
    currentProduct = product;
    
    document.getElementById('modal-img').src = product.image;
    document.getElementById('modal-title').textContent = product.name;
    document.getElementById('modal-desc').textContent = product.ingredients;

    let tagsHtml = '';
    if (product.tags) {
        product.tags.forEach(t => {
            if (t === 'Mới') tagsHtml += `<span class="tag-badge accent">${t}</span>`;
            else if (t === 'Best Seller') tagsHtml += `<span class="tag-badge special">${t}</span>`;
            else tagsHtml += `<span class="tag-badge">${t}</span>`;
        });
    }
    document.getElementById('modal-tags').innerHTML = tagsHtml;

    document.getElementById('price-m').innerHTML = `${product.priceM}<sup>k</sup>`;
    document.getElementById('calo-m').textContent = `${product.nutritionM.calo} kcal`;
    document.getElementById('price-l').innerHTML = `${product.priceL}<sup>k</sup>`;
    document.getElementById('calo-l').textContent = `${product.nutritionL.calo} kcal`;

    const sizeMBtn = document.querySelector('.size-btn[data-size="M"]');
    if (sizeMBtn) sizeMBtn.click();
}

export function updateNutrition(size) {
    if (!currentProduct) return;
    const data = size === 'M' ? currentProduct.nutritionM : currentProduct.nutritionL;
    document.getElementById('current-size-label').textContent = `SIZE ${size}`;
    updateNutriBar('sugar', data.sugar, 60, 'g');
    updateNutriBar('fiber', data.fiber, 10, 'g');
    updateNutriBar('protein', data.protein, 10, 'g');
    updateNutriBar('vitc', data.vitc, 150, 'mg');
}

function updateNutriBar(id, val, max, unit) {
    const percentage = Math.min((val / max) * 100, 100);
    const bar = document.getElementById(`bar-${id}`);
    const valElem = document.getElementById(`val-${id}`);
    if (bar) bar.style.width = `${percentage}%`;
    if (valElem) valElem.textContent = `${val} ${unit}`;
}

export function prevModalProduct() {
    currentProductIndex = (currentProductIndex - 1 + store.products.length) % store.products.length;
    renderModalData(currentProductIndex);
}

export function nextModalProduct() {
    currentProductIndex = (currentProductIndex + 1) % store.products.length;
    renderModalData(currentProductIndex);
}

export function getCurrentProduct() {
    return currentProduct;
}
