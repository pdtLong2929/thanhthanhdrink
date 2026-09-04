import { fetchDataFromFirebase, submitDirectOrder, addToCart, store } from './firebase-service.js';
import { initHeroSlider, initAboutSlider, initScrollspy } from './ui-components.js';
import { initProductGrid, initFullMenu, closeModal, updateNutrition, prevModalProduct, nextModalProduct, getCurrentProduct, updateCategoryCounts, updatePrice } from './product-menu.js';
import { initReviewsPage } from './reviews.js';
import { auth } from './firebase-config.js';


function initApp() {
    // 1. Mobile Menu
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navigation = document.querySelector('.navigation');

    if (mobileToggle && navigation) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navigation.classList.toggle('active');
        });

        navigation.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navigation.classList.remove('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (!navigation.contains(e.target) && !mobileToggle.contains(e.target)) {
                navigation.classList.remove('active');
            }
        });
    }

    // 2. Fetch Data and Init Components
    fetchDataFromFirebase([
        () => { try { initHeroSlider(); } catch (err) { console.error("Hero Slider Error:", err); } },
        () => { try { initAboutSlider(); } catch (err) { console.error("About Slider Error:", err); } },
        initProductGrid,
        initFullMenu,
        initReviewsPage,
        updateCategoryCounts
    ]).catch(err => console.error("Firebase Error:", err));

    try { initScrollspy(); } catch (err) { console.error("Scrollspy Error:", err); }

    // 3. Modal Events
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.addEventListener('click', closeModal);

    const prevBtn = document.querySelector('.slider-btn.prev');
    if (prevBtn) prevBtn.addEventListener('click', prevModalProduct);

    const nextBtn = document.querySelector('.slider-btn.next');
    if (nextBtn) nextBtn.addEventListener('click', nextModalProduct);

    // 4. Header Shadow on Scroll
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (header) {
            header.style.boxShadow = window.scrollY > 10 ? '0 2px 10px rgba(0,0,0,0.05)' : 'none';
        }
    });

    // 5. Option Buttons
    document.querySelectorAll('.opt-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const group = this.closest('.option-btns');
            if (group) {
                group.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // 6. Size Buttons
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const size = this.getAttribute('data-size');
            updateNutrition(size);
        });
    });

    // Toppings
    document.querySelectorAll('.topping-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            this.classList.toggle('active');
            if (this.classList.contains('active')) {
                this.style.background = 'rgba(82,162,159,0.3)';
                this.style.borderStyle = 'solid';
            } else {
                this.style.background = 'transparent';
                this.style.borderStyle = 'dashed';
            }
            updatePrice();
        });
    });


    // 8. Add to Cart Button handling
    const addCartBtn = document.getElementById('modal-btn-add-cart');
    if(addCartBtn) {
        addCartBtn.addEventListener('click', async () => {
            const user = auth.currentUser;
            if (!user) {
                closeModal();
                if (typeof window.openAuthModal === 'function') {
                    window.openAuthModal("Vui lòng đăng nhập để thêm món vào giỏ hàng!", "Yêu cầu đăng nhập");
                } else {
                    const authModalEl = document.getElementById('auth-modal');
                    if (authModalEl) authModalEl.style.display = 'flex';
                }
                return;
            }
            
            addCartBtn.textContent = "Đang xử lý...";
            addCartBtn.disabled = true;

            const currentProduct = getCurrentProduct();
            if (!currentProduct) return;

            const sizeSelectedBtn = document.querySelector('.size-btn.active');
            const sizeSelected = sizeSelectedBtn ? sizeSelectedBtn.textContent : 'M';
            
            const optionGroups = document.querySelectorAll('.option-group');
            const sugarSelected = optionGroups.length > 0 && optionGroups[0].querySelector('.opt-btn.active') ? optionGroups[0].querySelector('.opt-btn.active').textContent : '100%';
            const iceSelected = optionGroups.length > 1 && optionGroups[1].querySelector('.opt-btn.active') ? optionGroups[1].querySelector('.opt-btn.active').textContent : 'Bình thường';
            
            let toppingPrice = 0;
            const toppings = Array.from(document.querySelectorAll('.topping-btn.active')).map(btn => {
                toppingPrice += parseInt(btn.getAttribute('data-price') || 0);
                return btn.textContent.trim().split('\n')[0];
            });

            let milkSelected = null;
            if (currentProduct.category === 'smoothie' || currentProduct.category === 'SMOOTHIE') {
                const activeMilk = document.querySelector('.milk-btn.active');
                if (activeMilk) milkSelected = activeMilk.textContent;
            }

            const basePrice = sizeSelected === 'M' ? currentProduct.priceM : currentProduct.priceL;
            const price = parseInt(basePrice) + toppingPrice;

            const cartItem = {
                productId: currentProduct.id,
                name: currentProduct.name,
                image: currentProduct.image,
                size: sizeSelected,
                sugar: sugarSelected,
                ice: iceSelected,
                toppings: toppings,
                milk: milkSelected,
                price: price
            };

            const success = await addToCart(cartItem);
            if(success) {
                closeModal();
                window.showSuccessModal("Thành công!", "Đã thêm sản phẩm vào giỏ hàng.", "Xem giỏ hàng", "profile.html#cart");
            } else {
                alert("Có lỗi xảy ra, vui lòng thử lại!");
            }
            
            addCartBtn.innerHTML = '<i class="ph ph-shopping-cart" style="margin-right: 5px;"></i> Thêm vào giỏ';
            addCartBtn.disabled = false;
        });
    }

    // 7. Order Button handling
    const orderBtn = document.getElementById('modal-btn-order');
    if(orderBtn) {
        orderBtn.addEventListener('click', () => {
            const user = auth.currentUser;
            if (!user) {
                closeModal();
                if (typeof window.openAuthModal === 'function') {
                    window.openAuthModal("Vui lòng đăng nhập để tiến hành đặt hàng!", "Yêu cầu đăng nhập");
                } else {
                    const authModalEl = document.getElementById('auth-modal');
                    if (authModalEl) authModalEl.style.display = 'flex';
                }
            } else {
                document.getElementById('checkout-modal').style.display = 'flex';
            }
        });
    }
}

window.submitDirectOrder = async function () {
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

    const currentProduct = getCurrentProduct();
    if (!currentProduct) {
        btn.textContent = "Xác nhận đặt hàng";
        btn.disabled = false;
        return;
    }

    const sizeSelectedBtn = document.querySelector('.size-btn.active');
    const sizeSelected = sizeSelectedBtn ? sizeSelectedBtn.textContent : 'M';
    
    const optionGroups = document.querySelectorAll('.option-group');
    const sugarSelected = optionGroups.length > 0 && optionGroups[0].querySelector('.opt-btn.active') ? optionGroups[0].querySelector('.opt-btn.active').textContent : '100%';
    const iceSelected = optionGroups.length > 1 && optionGroups[1].querySelector('.opt-btn.active') ? optionGroups[1].querySelector('.opt-btn.active').textContent : 'Bình thường';
    
    let toppingPrice = 0;
    const toppings = Array.from(document.querySelectorAll('.topping-btn.active')).map(btn => {
        toppingPrice += parseInt(btn.getAttribute('data-price') || 0);
        return btn.textContent.trim().split('\n')[0];
    });

    let milkSelected = null;
    if (currentProduct.category === 'smoothie' || currentProduct.category === 'SMOOTHIE') {
        const activeMilk = document.querySelector('.milk-btn.active');
        if (activeMilk) milkSelected = activeMilk.textContent;
    }

    const basePrice = sizeSelected === 'M' ? currentProduct.priceM : currentProduct.priceL;
    const price = parseInt(basePrice) + toppingPrice;

    const orderItem = {
        productId: currentProduct.id,
        name: currentProduct.name,
        image: currentProduct.image,
        size: sizeSelected,
        sugar: sugarSelected,
        ice: iceSelected,
        toppings: toppings,
        milk: milkSelected,
        price: price
    };

    const success = await submitDirectOrder(orderItem, {name, phone, address});
    if(success) {
        document.getElementById('checkout-modal').style.display = 'none';
        document.getElementById('checkout-form').reset();
        closeModal();
        window.showSuccessModal("Thành công!", "Đã đặt hàng thành công.", "Xem đơn hàng", "profile.html#history");
    } else {
        alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
    btn.textContent = "Xác nhận đặt hàng";
    btn.disabled = false;
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

window.showSuccessModal = function(title, message, btnText, redirectUrl) {
    document.getElementById('success-modal-title').textContent = title;
    document.getElementById('success-modal-msg').textContent = message;
    const btn = document.getElementById('success-modal-btn');
    btn.textContent = btnText;
    btn.onclick = () => {
        window.location.href = redirectUrl;
        return false;
    };
    document.getElementById('success-modal').style.display = 'flex';
}
