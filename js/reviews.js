import { store } from './firebase-service.js';

let currentReviewSort = 'default';

export function initReviewsPage() {
    const sortSelect = document.getElementById('review-sort');
    const reviewsGrid = document.getElementById('reviews-grid');

    if (!reviewsGrid) return;

    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentReviewSort = e.target.value;
            renderReviewsPage();
        });
    }

    renderReviewsPage();
}

function renderReviewsPage() {
    const grid = document.getElementById('reviews-grid');
    if (!grid) return;

    let filtered = [...store.reviews];

    if (currentReviewSort === 'rating-desc') {
        filtered.sort((a, b) => b.rating - a.rating);
    } else if (currentReviewSort === 'rating-asc') {
        filtered.sort((a, b) => a.rating - b.rating);
    }

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

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <h4 style="margin: 0 0 5px 0; font-size: 1.1rem; color: var(--primary-dark);">${review.name}</h4>
                    <span style="font-size: 0.85rem; color: var(--text-light);">${review.date}</span>
                </div>
                <div style="display: flex; gap: 2px;">${starsHtml}</div>
            </div>
            <p style="margin: 0; color: var(--text-color); line-height: 1.6;">"${review.text}"</p>
        `;
        grid.appendChild(card);
    });
}
