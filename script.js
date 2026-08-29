// ==========================================
// MOCK DATA
// ==========================================

const reviews = [
    { name: "Minh Tuấn", date: "22/08/2026", rating: 5, image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=200&h=200", text: "Trà trái cây rất tươi, uống thanh mát không bị gắt đường. Đóng gói đẹp!" },
    { name: "Lan Ngọc", date: "15/08/2026", rating: 5, image: null, text: "Sữa chua ở đây làm mình bất ngờ, chua dịu và thơm. Sẽ ủng hộ dài dài." },
    { name: "Hoàng Phong", date: "10/08/2026", rating: 4, image: "https://images.unsplash.com/photo-1595981267035-7b04d84d515a?auto=format&fit=crop&q=80&w=200&h=200", text: "Smoothie bơ chuối rất ngon và no, tuy nhiên giao hàng hơi lâu một chút." },
    { name: "Thảo Vy", date: "05/08/2026", rating: 5, image: null, text: "Trà cam bưởi cực đỉnh, múi bưởi to và không bị đắng. Mình hay gọi size L." },
    { name: "Đức Tài", date: "02/08/2026", rating: 3, image: null, text: "Bình thường, hơi ngọt so với mình mặc dù đã gọi 50% đường." },
    { name: "Khánh Linh", date: "28/07/2026", rating: 5, image: "https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?auto=format&fit=crop&q=80&w=200&h=200", text: "Thích nhất là được tuỳ chỉnh 100% đường đá, đồ uống healthy đúng gu." },
    { name: "Tuấn Anh", date: "20/07/2026", rating: 4, image: null, text: "Nước ngon nhưng quán hơi đông vào giờ tan tầm." },
    { name: "Mai Trang", date: "15/07/2026", rating: 5, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=200&h=200", text: "Trà dâu tây rất tuyệt, dâu nhiều và tươi. 10 điểm!" }
];

const products = [
    // Trà Trái Cây (7 món)
    {
        id: "p1", category: "TRÀ TRÁI CÂY", name: "Trà Khế Nho Xanh", ingredients: "Khế, nho xanh", desc: "Hương vị chua chua ngọt dịu tươi mới.", longDesc: "Trà Khế Nho Xanh mang đến sự kết hợp độc đáo giữa vị chua nhẹ của khế và ngọt thanh của nho xanh.", tags: ["MỚI", "120 kcal"], image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", priceM: "55", priceL: "65", nutritionM: { calo: 120, sugar: 25, fiber: 2.0, protein: 0.5, vitc: 80 }, nutritionL: { calo: 150, sugar: 32, fiber: 2.5, protein: 0.7, vitc: 100 }
    },
    {
        id: "p2", category: "TRÀ TRÁI CÂY", name: "Trà Cam Bưởi", ingredients: "Cam, Bưởi", desc: "Cặp đôi họ cam quýt kinh điển, nhiều vitamin C nhất menu.", longDesc: "Cam vàng vắt tay lấy nước, bưởi da xanh tách tép nguyên múi thả vào ly. Trà ô long nhẹ hương giữ cho vị bưởi không bị đắng.", tags: ["BÁN CHẠY", "142 kcal"], image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", priceM: "55", priceL: "65", nutritionM: { calo: 142, sugar: 30, fiber: 2.8, protein: 0.8, vitc: 96 }, nutritionL: { calo: 178, sugar: 38, fiber: 3.5, protein: 1.0, vitc: 120 }
    },
    {
        id: "p3", category: "TRÀ TRÁI CÂY", name: "Trà Mận Đào", ingredients: "Mận, Đào", desc: "Hương vị mùa hè rực rỡ với mận Hà Nội và đào tươi.", longDesc: "Mận hậu chua thanh kết hợp cùng đào miếng giòn ngọt. Nước cốt trà lài nhẹ nhàng tôn lên hương trái cây nguyên bản.", tags: ["BÁN CHẠY", "156 kcal"], image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", priceM: "55", priceL: "65", nutritionM: { calo: 156, sugar: 32, fiber: 3.0, protein: 0.5, vitc: 45 }, nutritionL: { calo: 195, sugar: 40, fiber: 3.8, protein: 0.7, vitc: 56 }
    },
    {
        id: "p4", category: "TRÀ TRÁI CÂY", name: "Trà Xoài Chanh Dây", ingredients: "Xoài, Chanh dây", desc: "Vị chua ngọt bùng nổ, cực kỳ giải khát cho ngày nắng.", longDesc: "Xoài cát cát xay nhuyễn cùng nước cốt chanh dây tươi (giữ hạt). Vị chua ngọt đậm đà, uống tới đâu tỉnh tới đó.", tags: ["BÁN CHẠY", "163 kcal"], image: "https://images.unsplash.com/photo-1546173159-315724a31696?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", priceM: "55", priceL: "65", nutritionM: { calo: 163, sugar: 35, fiber: 2.5, protein: 1.2, vitc: 80 }, nutritionL: { calo: 204, sugar: 44, fiber: 3.1, protein: 1.5, vitc: 100 }
    },
    {
        id: "p5", category: "TRÀ TRÁI CÂY", name: "Trà Mãng Cầu Tắc Dứa", ingredients: "Mãng cầu, Tắc, Dứa", desc: "Sự kết hợp độc đáo của 3 loại trái cây nhiệt đới.", longDesc: "Mãng cầu xiêm dằm nhuyễn, thơm (dứa) ép lấy nước và điểm xuyết hương tắc thơm lừng. Rất kích thích vị giác.", tags: ["ĐẶC TRƯNG", "171 kcal"], image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", priceM: "55", priceL: "65", nutritionM: { calo: 171, sugar: 34, fiber: 4.2, protein: 1.0, vitc: 85 }, nutritionL: { calo: 215, sugar: 42, fiber: 5.2, protein: 1.3, vitc: 106 }
    },
    {
        id: "p6", category: "TRÀ TRÁI CÂY", name: "Trà Lựu Dâu Hibiscus", ingredients: "Lựu, Dâu, Hibiscus", desc: "Màu đỏ đẹp mắt, vị chua thanh, giàu chất chống oxy hóa.", longDesc: "Nước ép lựu đỏ nguyên chất hòa quyện cùng dâu tây tươi và trà hoa Hibiscus chua nhẹ. Cực kỳ tốt cho làn da.", tags: ["MỚI", "134 kcal"], image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", priceM: "55", priceL: "65", nutritionM: { calo: 134, sugar: 28, fiber: 2.0, protein: 0.5, vitc: 65 }, nutritionL: { calo: 168, sugar: 35, fiber: 2.5, protein: 0.6, vitc: 81 }
    },
    {
        id: "p7", category: "TRÀ TRÁI CÂY", name: "Trà Bưởi Chanh Vàng", ingredients: "Bưởi, Chanh vàng", desc: "Phiên bản thanh nhẹ, ít calo nhất menu.", longDesc: "Chỉ sử dụng chanh vàng Mỹ thơm dịu không đắng và tép bưởi tươi. Rất phù hợp cho người đang kiểm soát cân nặng.", tags: ["ÍT CALO", "118 kcal"], image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", priceM: "55", priceL: "65", nutritionM: { calo: 118, sugar: 22, fiber: 1.8, protein: 0.4, vitc: 110 }, nutritionL: { calo: 148, sugar: 28, fiber: 2.2, protein: 0.5, vitc: 135 }
    },
    
    // Smoothie (5 món)
    {
        id: "p8", category: "SMOOTHIE", name: "Smoothie Thanh Long Xoài", ingredients: "Thanh long, xoài", desc: "Màu sắc rực rỡ và hương vị thanh mát.", longDesc: "Thanh long ruột đỏ mix cùng xoài chín mọng, tạo nên ly smoothie dẻo mịn và màu sắc tuyệt đẹp.", tags: ["MỚI", "210 kcal"], image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", priceM: "65", priceL: "75", nutritionM: { calo: 210, sugar: 38, fiber: 4.5, protein: 3.5, vitc: 60 }, nutritionL: { calo: 260, sugar: 48, fiber: 5.5, protein: 4.5, vitc: 75 }
    },
    {
        id: "p9", category: "SMOOTHIE", name: "Smoothie Bơ Chuối", ingredients: "Bơ, chuối", desc: "Sinh tố béo ngậy, no lâu cho một buổi sáng đầy năng lượng.", longDesc: "Bơ sáp loại 1 kết hợp với chuối sứ chín muồi. Thơm béo ngậy mà không hề thêm sữa đặc, vị béo hoàn toàn tự nhiên.", tags: ["BÁN CHẠY", "280 kcal"], image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", priceM: "65", priceL: "75", nutritionM: { calo: 280, sugar: 25, fiber: 6.0, protein: 4.0, vitc: 20 }, nutritionL: { calo: 350, sugar: 32, fiber: 7.5, protein: 5.0, vitc: 25 }
    },
    {
        id: "p10", category: "SMOOTHIE", name: "Smoothie Thanh Long Dâu", ingredients: "Thanh long, dâu", desc: "Bùng nổ vị chua ngọt tươi mát.", longDesc: "Thanh long đỏ và dâu tây đông lạnh xay mịn màng. Cực nhiều vitamin và chất chống oxy hóa.", tags: ["ĐẶC TRƯNG", "225 kcal"], image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", priceM: "85", priceL: "95", nutritionM: { calo: 225, sugar: 35, fiber: 5.0, protein: 3.0, vitc: 85 }, nutritionL: { calo: 280, sugar: 44, fiber: 6.2, protein: 3.8, vitc: 106 }
    },
    {
        id: "p11", category: "SMOOTHIE", name: "Smoothie Chuối Dâu Xoài", ingredients: "Chuối, dâu, xoài", desc: "Ba hương vị nhiệt đới hòa quyện.", longDesc: "Sự kết hợp hoàn hảo của chuối béo ngọt, dâu chua thanh và xoài thơm lừng.", tags: ["BÁN CHẠY", "240 kcal"], image: "https://images.unsplash.com/photo-1546173159-315724a31696?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", priceM: "85", priceL: "95", nutritionM: { calo: 240, sugar: 40, fiber: 4.8, protein: 3.2, vitc: 70 }, nutritionL: { calo: 300, sugar: 50, fiber: 6.0, protein: 4.0, vitc: 88 }
    },
    {
        id: "p12", category: "SMOOTHIE", name: "Smoothie Chuối & Các Loại Berry", ingredients: "Chuối & berry", desc: "Lớp nền chuối béo ngọt ôm lấy vị chua nhẹ của quả mọng.", longDesc: "Chuối sứ mềm ngọt giúp làm dịu vị chua gắt của việt quất và mâm xôi, tạo thành món uống bổ dưỡng giàu chất xơ.", tags: ["SIGNATURE", "235 kcal"], image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", priceM: "85", priceL: "95", nutritionM: { calo: 235, sugar: 36, fiber: 5.5, protein: 3.5, vitc: 65 }, nutritionL: { calo: 295, sugar: 45, fiber: 6.8, protein: 4.4, vitc: 81 }
    },

    // Sữa Chua (5 món)
    {
        id: "p13", category: "SỮA CHUA", name: "Sữa Chua Chuối Xoài Bơ", ingredients: "Chuối, xoài, bơ", desc: "Sữa chua siêu béo và mịn màng.", longDesc: "Sự kết hợp giữa sữa chua lên men, chuối ngọt, xoài thơm và bơ béo ngậy.", tags: ["MỚI", "245 kcal"], image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", priceM: "55", priceL: "65", nutritionM: { calo: 245, sugar: 32, fiber: 4.0, protein: 6.0, vitc: 40 }, nutritionL: { calo: 305, sugar: 40, fiber: 5.0, protein: 7.5, vitc: 50 }
    },
    {
        id: "p14", category: "SỮA CHUA", name: "Sữa Chua Thanh Long Bưởi Xoài", ingredients: "Thanh long, bưởi, xoài", desc: "Hương vị thanh mát giải nhiệt hoàn hảo.", longDesc: "Lợi khuẩn từ sữa chua cộng với vitamin từ thanh long, bưởi và xoài.", tags: ["THANH LỌC", "190 kcal"], image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", priceM: "55", priceL: "65", nutritionM: { calo: 190, sugar: 30, fiber: 3.5, protein: 5.5, vitc: 75 }, nutritionL: { calo: 235, sugar: 38, fiber: 4.4, protein: 6.8, vitc: 94 }
    },
    {
        id: "p15", category: "SỮA CHUA", name: "Sữa Chua Chuối Nho Xanh", ingredients: "Chuối, nho xanh", desc: "Vị giòn sần sật từ quả nho tươi mát.", longDesc: "Sữa chua mềm mịn với chuối và nho xanh tạo sự tương phản trong kết cấu nhai.", tags: ["ÍT NGỌT", "210 kcal"], image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", priceM: "55", priceL: "65", nutritionM: { calo: 210, sugar: 34, fiber: 3.0, protein: 5.8, vitc: 35 }, nutritionL: { calo: 260, sugar: 42, fiber: 3.8, protein: 7.2, vitc: 44 }
    },
    {
        id: "p16", category: "SỮA CHUA", name: "Sữa Chua Dâu Táo Kiwi", ingredients: "Dâu, táo, kiwi", desc: "Sữa chua lên men tự nhiên với mix 3 loại trái cây.", longDesc: "Sữa chua nhà làm sánh mịn, chua dịu kết hợp cùng mứt dâu, táo giòn và kiwi tươi chua ngọt.", tags: ["BÁN CHẠY", "198 kcal"], image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", priceM: "65", priceL: "75", nutritionM: { calo: 198, sugar: 36, fiber: 3.5, protein: 5.2, vitc: 55 }, nutritionL: { calo: 248, sugar: 45, fiber: 4.4, protein: 6.5, vitc: 68 }
    },
    {
        id: "p17", category: "SỮA CHUA", name: "Sữa Chua Các Loại Berry", ingredients: "Các loại berry", desc: "Đậm đà hương vị quả mọng, chua ngọt kích thích.", longDesc: "Mix 3 loại quả mọng: Việt quất, mâm xôi, dâu tây được nấu thành mứt nhẹ, ăn kèm sữa chua beo béo cực ghiền.", tags: ["ĐẶC TRƯNG", "187 kcal"], image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", priceM: "65", priceL: "75", nutritionM: { calo: 187, sugar: 34, fiber: 4.0, protein: 5.5, vitc: 70 }, nutritionL: { calo: 235, sugar: 42, fiber: 5.0, protein: 6.8, vitc: 88 }
    }
];


let currentProduct = null;
let currentSize = 'M';

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initReviewsSlider();
    initProductGrid(); // Init default 8 items for featured
    initFullMenu(); // Initialize the full menu section
    initModal();
    initScrollspy();
    initReviewsPage();
    
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
        btn.addEventListener('click', function() {
            const group = this.closest('.option-btns');
            group.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// ==========================================
// RENDER FUNCTIONS
// ==========================================

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
    for(let i=0; i<5; i++) {
        if(i < review.rating) {
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
    const featuredProducts = [products[1], products[2], products[3], products[4], products[7], products[8], products[15], products[16]];
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
        btn.addEventListener('click', function() {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const size = this.getAttribute('data-size');
            updateNutrition(size);
        });
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
    if(product.tags[0]) tagsContainer.innerHTML += `<span class="tag">${product.tags[0]}</span>`;
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
    if(!currentProduct) return;
    
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
        if(scrollY < 100) {
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
        for(let i=0; i<5; i++) {
            if(i < review.rating) {
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
