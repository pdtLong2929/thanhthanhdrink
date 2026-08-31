// ==========================================
// MOCK DATA
// ==========================================
import { db } from "./firebase-config.js";
import { collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { auth } from "./firebase-config.js";

// Global data variables to be populated from Firestore
let products = [];
let reviews = [];

let currentProduct = null;
let currentSize = 'M';

// ==========================================
// INITIALIZATION
// ==========================================
async function fetchDataFromFirebase() {
    try {
        const productsSnapshot = await getDocs(collection(db, "products"));
        products = productsSnapshot.docs.map(doc => doc.data());

        const reviewsSnapshot = await getDocs(collection(db, "reviews"));
        reviews = reviewsSnapshot.docs.map(doc => doc.data());

        // Cần đảm bảo thứ tự của sản phẩm, có thể sort theo id
        products.sort((a, b) => {
            const idA = parseInt(a.id.replace('p', ''));
            const idB = parseInt(b.id.replace('p', ''));
            return idA - idB;
        });

        initProductGrid();
        initReviewsSlider();
        updateSliderButtons(); // Khởi tạo nút slider
        initFullMenu(); // Initialize the full menu section AFTER data is loaded
        initReviewsPage(); // Initialize reviews page AFTER data is loaded
    } catch (error) {
        console.error("Error fetching data from Firebase:", error);
    }
}

// Khởi tạo ứng dụng sau khi DOM load
document.addEventListener('DOMContentLoaded', () => {
    fetchDataFromFirebase();
    initHeroSlider();
    initHeroSlider();
    initAboutSlider();
    initModal();
    initScrollspy();

    // Gán sự kiện đóng modal
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    document.getElementById('overlay').addEventListener('click', closeModal);

    // Gán sự kiện chuyển ảnh modal
    document.querySelector('.slider-btn.prev').addEventListener('click', prevModalProduct);
    document.querySelector('.slider-btn.next').addEventListener('click', nextModalProduct);

    // Header shadow on scroll
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 10) {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        } else {
            header.style.boxShadow = 'none';
        }
    });

    // Option buttons toggle
    document.querySelectorAll('.opt-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const group = this.closest('.option-btns');
            group.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// ==========================================
// RENDER FUNCTIONS
// ==========================================

function initHeroSlider() {
    const slides = document.querySelectorAll('#hero-slides-wrapper .banner-slide');
    const dots = document.querySelectorAll('#hero-dots .dot');
    if (!slides.length) return;

    let currentSlide = 0;
    const totalSlides = slides.length;
    let slideInterval;

    function goToSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));

        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % totalSlides);
    }

    // Initialize auto slide
    function startSlide() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopSlide() {
        clearInterval(slideInterval);
    }

    // Dot click events
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopSlide();
            goToSlide(index);
            startSlide();
        });
    });

    startSlide();
}

function initAboutSlider() {
    const slides = document.querySelectorAll('#about-slides-wrapper .banner-slide');
    const texts = document.querySelectorAll('.about-text-slide');
    const dots = document.querySelectorAll('#about-dots .dot');
    if (!slides.length) return;

    let currentSlide = 0;
    const totalSlides = slides.length;
    let slideInterval;

    function goToSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        if (texts.length) texts.forEach(t => t.classList.remove('active'));

        slides[index].classList.add('active');
        dots[index].classList.add('active');
        if (texts.length && texts[index]) texts[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % totalSlides);
    }

    // Initialize auto slide
    function startSlide() {
        slideInterval = setInterval(nextSlide, 6000); // slightly different timing
    }

    function stopSlide() {
        clearInterval(slideInterval);
    }

    // Dot click events
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopSlide();
            goToSlide(index);
            startSlide();
        });
    });

    startSlide();
}

function initReviewsSlider() {
    const sliderContainer = document.getElementById('reviews-slider');
    if (!sliderContainer) return;

    let currentIndex = 0;

    function showReview(index) {
        sliderContainer.style.opacity = 0;

        setTimeout(() => {
            sliderContainer.innerHTML = '';
            const card = createReviewCard(reviews[index]);
            card.style.width = '100%';
            card.style.boxSizing = 'border-box';
            sliderContainer.appendChild(card);
            sliderContainer.style.opacity = 1;
        }, 500);
    }

    showReview(currentIndex);

    setInterval(() => {
        currentIndex = (currentIndex + 1) % reviews.length;
        showReview(currentIndex);
    }, 4000);
}

function createReviewCard(review) {
    const card = document.createElement('div');
    card.className = 'review-card';

    let starsHtml = '';
    for (let i = 0; i < 5; i++) {
        if (i < review.rating) {
            starsHtml += '<i class="ph-fill ph-star"></i>';
        } else {
            starsHtml += '<i class="ph ph-star"></i>';
        }
    }

    card.innerHTML = `
        <div class="stars">${starsHtml}</div>
        <p class="review-text">"${review.text}"</p>
        <p class="review-author">— ${review.name}</p>
    `;
    return card;
}

function renderProductsToGrid(gridElement, productsToRender, isFullMenu = false) {
    gridElement.innerHTML = '';

    window.addToCart = async function (index) {
        const user = auth.currentUser;
        if (!user) {
            // Nếu chưa đăng nhập, mở modal đăng nhập
            document.getElementById('auth-modal').style.display = 'flex';
            return;
        }

        const product = products[index];
        const sizeSelected = document.querySelector('.size-btn.active').textContent;
        const sugarSelected = document.querySelectorAll('.option-group')[0].querySelector('.opt-btn.active').textContent;
        const iceSelected = document.querySelectorAll('.option-group')[1].querySelector('.opt-btn.active').textContent;
        const price = sizeSelected === 'M' ? product.priceM : product.priceL;

        try {
            await addDoc(collection(db, "carts"), {
                uid: user.uid,
                productId: product.id,
                name: product.name,
                image: product.image,
                size: sizeSelected,
                sugar: sugarSelected,
                ice: iceSelected,
                price: price,
                timestamp: new Date()
            });
            alert('Đã thêm "' + product.name + '" vào giỏ hàng!');
            closeModal();
        } catch (e) {
            console.error("Lỗi khi thêm vào giỏ hàng: ", e);
            alert("Có lỗi xảy ra, vui lòng thử lại sau!");
        }
    };

    productsToRender.forEach((product) => {
        const productIndex = products.findIndex(p => p.id === product.id);
        const card = document.createElement('div');
        card.className = 'product-card';
        card.onclick = () => openModal(productIndex);

        let tagsHtml = '';
        if (product.tags[0]) {
            let badgeClass = product.tags[0] === 'BÁN CHẠY' ? 'accent' : (product.tags[0] === 'ÍT CALO' ? 'special' : (product.tags[0] === 'MỚI' ? 'special' : 'accent'));
            // Hardcode some colors to match image
            if (product.tags[0] === 'MỚI') badgeClass = 'bg-mint-dark text-white';
            tagsHtml += `<span class="tag-badge ${badgeClass}" style="${badgeClass.includes('bg-') ? 'background: var(--primary-dark); color: white;' : ''}">${product.tags[0]}</span>`;
        }
        if (product.tags[1]) {
            tagsHtml += `<span class="tag-badge" style="margin-left: auto; background: white; color: black;">${product.tags[1]}</span>`;
        }

        if (isFullMenu) {
            // Simplified card for full menu
            card.innerHTML = `
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <div class="product-tags">${tagsHtml}</div>
                </div>
                <div class="product-info" style="padding: 16px;">
                    <h3 class="product-title" style="font-size: 1rem; color: var(--primary-dark); margin-bottom: 4px;">${product.name}</h3>
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
            // Random fake stats based on ID to remain consistent
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

function initProductGrid() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    // Món nổi bật: Chọn 8 món ngẫu nhiên hoặc 8 món đầu
    const featuredProducts = [products[1], products[2], products[3], products[4], products[7], products[8], products[15], products[16]].filter(p => p !== undefined);
    renderProductsToGrid(grid, featuredProducts, false);
}

// FULL MENU LOGIC
let currentTab = 'ALL';
let currentSearch = '';
let currentSort = 'default';

function initFullMenu() {
    const searchInput = document.getElementById('menu-search');
    const sortSelect = document.getElementById('menu-sort');
    const tabs = document.querySelectorAll('.menu-tab-btn');

    if (!searchInput) return;

    // Parse URL parameter to see if a specific tab was requested
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam) {
        currentTab = tabParam;
    }

    tabs.forEach(tab => {
        // Set active state on load if matches currentTab
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

            // Update URL without reloading
            const newUrl = new URL(window.location);
            newUrl.searchParams.set('tab', currentTab);
            window.history.pushState({}, '', newUrl);

            // Update UI
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

    // Initial render
    renderFullMenu();
}

function switchMenuTab(tabName) {
    const tabBtn = document.querySelector(`.menu-tab-btn[data-tab="${tabName}"]`);
    if (tabBtn) tabBtn.click();
}

function renderFullMenu() {
    const grid = document.getElementById('full-menu-grid');
    const countDisplay = document.getElementById('menu-count');
    if (!grid) return;

    let filtered = products;

    // Filter by tab
    if (currentTab !== 'ALL') {
        filtered = filtered.filter(p => p.category === currentTab);
    }

    // Filter by search
    if (currentSearch) {
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(currentSearch) ||
            p.ingredients.toLowerCase().includes(currentSearch)
        );
    }

    // Sort
    if (currentSort === 'price-asc') {
        filtered.sort((a, b) => parseInt(a.priceM) - parseInt(b.priceM));
    } else if (currentSort === 'price-desc') {
        filtered.sort((a, b) => parseInt(b.priceM) - parseInt(a.priceM));
    } else if (currentSort === 'calo-asc') {
        filtered.sort((a, b) => a.nutritionM.calo - b.nutritionM.calo);
    } // default: no sort change (keeps array order)

    countDisplay.textContent = filtered.length;
    renderProductsToGrid(grid, filtered, true);
}

// ==========================================
// MODAL LOGIC
// ==========================================
let currentProductIndex = 0;

function initModal() {
    const overlay = document.getElementById('overlay');
    const closeBtn = document.querySelector('.close-modal');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');

    overlay.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);

    prevBtn.addEventListener('click', () => {
        currentProductIndex = (currentProductIndex - 1 + products.length) % products.length;
        renderModalData(currentProductIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentProductIndex = (currentProductIndex + 1) % products.length;
        renderModalData(currentProductIndex);
    });

    // Size buttons
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const size = this.getAttribute('data-size');
            updateNutrition(size);
        });
    });

    // Modal action buttons
    document.getElementById('modal-btn-add-cart')?.addEventListener('click', () => {
        window.addToCart(currentProductIndex);
    });

    document.getElementById('modal-btn-order')?.addEventListener('click', () => {
        const user = auth.currentUser;
        if (!user) {
            document.getElementById('auth-modal').style.display = 'flex';
            return;
        }
        document.getElementById('checkout-modal').style.display = 'flex';
    });
}

function openModal(index) {
    currentProductIndex = index;
    renderModalData(index);

    document.getElementById('product-modal').classList.add('active');
    document.getElementById('overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('product-modal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
    document.body.style.overflow = '';
}

function renderModalData(index) {
    const product = products[index];
    currentProduct = product;

    document.getElementById('modal-img').src = product.image;
    document.getElementById('modal-category').textContent = product.category;
    document.getElementById('modal-title').textContent = product.name;
    document.getElementById('modal-desc').textContent = product.desc;
    document.getElementById('modal-long-desc').textContent = product.longDesc;

    // Tags
    const tagsContainer = document.getElementById('modal-tags');
    tagsContainer.innerHTML = '';
    if (product.tags[0]) tagsContainer.innerHTML += `<span class="tag">${product.tags[0]}</span>`;
    tagsContainer.innerHTML += `<span class="tag">Tươi mát</span>`;

    // Ingredients
    const ingContainer = document.getElementById('modal-ingredients');
    ingContainer.innerHTML = '';
    const ingredientsList = product.ingredients.split(', ');
    if (product.category === "TRÀ TRÁI CÂY") ingredientsList.push('Trà ủ lạnh');
    else if (product.category === "SỮA CHUA") ingredientsList.push('Sữa chua nhà làm');
    else ingredientsList.push('Sữa tươi');

    ingredientsList.forEach(ing => {
        ingContainer.innerHTML += `<span class="ing-badge">${ing}</span>`;
    });

    // Sizes
    document.getElementById('price-m').innerHTML = `${product.priceM}<sup>k</sup>`;
    document.getElementById('calo-m').textContent = `${product.nutritionM.calo} kcal`;
    document.getElementById('price-l').innerHTML = `${product.priceL}<sup>k</sup>`;
    document.getElementById('calo-l').textContent = `${product.nutritionL.calo} kcal`;

    // Reset to size M
    document.querySelector('.size-btn[data-size="M"]').click();
}

function updateNutrition(size) {
    if (!currentProduct) return;

    const data = size === 'M' ? currentProduct.nutritionM : currentProduct.nutritionL;

    document.getElementById('current-size-label').textContent = `SIZE ${size}`;

    // Sugar: max 60g
    updateNutriBar('sugar', data.sugar, 60, 'g');
    // Fiber: max 10g
    updateNutriBar('fiber', data.fiber, 10, 'g');
    // Protein: max 10g
    updateNutriBar('protein', data.protein, 10, 'g');
    // Vit C: max 150mg
    updateNutriBar('vitc', data.vitc, 150, 'mg');
}

function updateNutriBar(id, val, max, unit) {
    const percentage = Math.min((val / max) * 100, 100);
    document.getElementById(`bar-${id}`).style.width = `${percentage}%`;
    document.getElementById(`val-${id}`).textContent = `${val} ${unit}`;
}

// ==========================================
// SCROLLSPY
// ==========================================
function initScrollspy() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navigation a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        // Handle case where top is active
        if (scrollY < 100) {
            navLinks.forEach(link => link.classList.remove('active'));
            document.querySelector('.navigation a[href="#home"]').classList.add('active');
        }
    });
}
// ==========================================
// REVIEWS PAGE LOGIC
// ==========================================
let currentReviewFilter = 'all';
let currentReviewSort = 'default';

function initReviewsPage() {
    const filterTabs = document.querySelectorAll('#review-filters .menu-tab-btn');
    const sortSelect = document.getElementById('review-sort');
    const reviewsGrid = document.getElementById('reviews-grid');

    if (!reviewsGrid) return; // Not on reviews page

    filterTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            currentReviewFilter = e.target.getAttribute('data-filter');

            // Update UI
            filterTabs.forEach(t => {
                t.style.background = 'transparent';
                t.style.color = 'var(--text-color)';
                t.classList.remove('active');
            });
            e.target.style.background = 'var(--primary-dark)';
            e.target.style.color = 'white';
            e.target.classList.add('active');

            renderReviewsPage();
        });
    });

    sortSelect.addEventListener('change', (e) => {
        currentReviewSort = e.target.value;
        renderReviewsPage();
    });

    // Initial render
    renderReviewsPage();
}

function renderReviewsPage() {
    const grid = document.getElementById('reviews-grid');
    if (!grid) return;

    let filtered = [...reviews];

    // Filter
    if (currentReviewFilter === 'with-image') {
        filtered = filtered.filter(r => r.image !== null);
    } else if (currentReviewFilter === 'without-image') {
        filtered = filtered.filter(r => r.image === null);
    }

    // Sort
    if (currentReviewSort === 'rating-desc') {
        filtered.sort((a, b) => b.rating - a.rating);
    } else if (currentReviewSort === 'rating-asc') {
        filtered.sort((a, b) => a.rating - b.rating);
    } // default is newest (keep array order)

    grid.innerHTML = '';

    filtered.forEach(review => {
        const card = document.createElement('div');
        card.className = 'review-card';
        card.style.background = 'white';
        card.style.padding = '20px';
        card.style.borderRadius = '16px';
        card.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.gap = '15px';

        let starsHtml = '';
        for (let i = 0; i < 5; i++) {
            if (i < review.rating) {
                starsHtml += '<i class="ph-fill ph-star" style="color: #FACC15;"></i>';
            } else {
                starsHtml += '<i class="ph ph-star" style="color: #E5E7EB;"></i>';
            }
        }

        const imageHtml = review.image ? `<img src="${review.image}" alt="Review image" style="width: 100%; height: 200px; object-fit: cover; border-radius: 12px;">` : '';

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <h4 style="margin: 0 0 5px 0; font-size: 1.1rem; color: var(--primary-dark);">${review.name}</h4>
                    <span style="font-size: 0.85rem; color: var(--text-light);">${review.date}</span>
                </div>
                <div style="display: flex; gap: 2px;">${starsHtml}</div>
            </div>
            ${imageHtml}
            <p style="margin: 0; color: var(--text-color); line-height: 1.6;">"${review.text}"</p>
        `;

        grid.appendChild(card);
    });
}

window.submitDirectOrder = async function () {
    const user = auth.currentUser;
    if (!user) return;

    const name = document.getElementById('checkout-name').value;
    const phone = document.getElementById('checkout-phone').value;
    const address = document.getElementById('checkout-address').value;
    const btn = document.getElementById('checkout-submit-btn');

    if (!name || !phone || !address) {
        alert("Vui lòng điền đủ thông tin!");
        return;
    }

    btn.textContent = "Đang xử lý...";
    btn.disabled = true;

    const product = products[currentProductIndex];
    const sizeSelected = document.querySelector('.size-btn.active').textContent;
    const sugarSelected = document.querySelectorAll('.option-group')[0].querySelector('.opt-btn.active').textContent;
    const iceSelected = document.querySelectorAll('.option-group')[1].querySelector('.opt-btn.active').textContent;
    const price = sizeSelected === 'M' ? product.priceM : product.priceL;

    const orderItem = {
        productId: product.id,
        name: product.name,
        image: product.image,
        size: sizeSelected,
        sugar: sugarSelected,
        ice: iceSelected,
        price: price
    };

    try {
        await addDoc(collection(db, "orders"), {
            uid: user.uid,
            items: [orderItem],
            total: parseInt(price),
            timestamp: new Date(),
            customerName: name,
            customerPhone: phone,
            customerAddress: address
        });

        alert("Đặt hàng thành công!");
        document.getElementById('checkout-modal').style.display = 'none';
        document.getElementById('checkout-form').reset();
        closeModal();
    } catch (e) {
        console.error("Lỗi khi đặt hàng:", e);
        alert("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
        btn.textContent = "Xác nhận đặt hàng";
        btn.disabled = false;
    }
};
