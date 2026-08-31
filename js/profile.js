import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { auth, db } from "./firebase-config.js";
import { collection, query, where, getDocs, deleteDoc, doc, addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

let currentUserId = null;
let currentCartItems = [];
let currentOrders = []; // Add global state for orders

document.addEventListener('DOMContentLoaded', () => {
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const tabPanes = document.querySelectorAll('.tab-pane');

    // Tab Switching Logic
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all
            sidebarItems.forEach(i => i.classList.remove('active'));
            tabPanes.forEach(t => t.classList.remove('active'));

            // Add active class to clicked
            item.classList.add('active');
            const targetId = item.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });



    // Handle Authentication State
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUserId = user.uid;
            // User is signed in, fill data
            const displayName = user.displayName || "Thành viên mới";
            const email = user.email || "Không có email";
            const photoURL = user.photoURL || "https://placehold.co/150x150/b5e4dc/3c7363?text=" + displayName.charAt(0);

            document.getElementById('profile-name').textContent = displayName;
            document.getElementById('profile-email').textContent = email;
            document.getElementById('profile-avatar').src = photoURL;

            document.getElementById('profile-input-name').value = displayName;
            document.getElementById('profile-input-email').value = email;

            // Load Cart and History
            loadCartData();
            loadHistoryData();
        } else {
            // Not signed in, redirect to home page
            window.location.href = 'index.html';
        }
    });

    // Handle Checkout
    document.getElementById('checkout-btn')?.addEventListener('click', async () => {
        if (!currentUserId || currentCartItems.length === 0) return;

        try {
            const checkoutBtn = document.getElementById('checkout-btn');
            checkoutBtn.textContent = "Đang xử lý...";
            checkoutBtn.disabled = true;

            // Add to orders
            const orderTotal = currentCartItems.reduce((sum, item) => sum + parseInt(item.price), 0);
            await addDoc(collection(db, "orders"), {
                uid: currentUserId,
                items: currentCartItems,
                total: orderTotal,
                timestamp: new Date()
            });

            // Delete from carts
            for (const item of currentCartItems) {
                await deleteDoc(doc(db, "carts", item.docId));
            }

            alert("Đặt hàng thành công!");
            loadCartData();
            loadHistoryData();
            checkoutBtn.textContent = "Thanh toán";
            checkoutBtn.disabled = false;
        } catch (error) {
            console.error("Lỗi khi thanh toán:", error);
            alert("Có lỗi xảy ra khi thanh toán.");
            document.getElementById('checkout-btn').textContent = "Thanh toán";
            document.getElementById('checkout-btn').disabled = false;
        }
    });
});

async function loadCartData() {
    if (!currentUserId) return;

    const cartQ = query(collection(db, "carts"), where("uid", "==", currentUserId));
    const querySnapshot = await getDocs(cartQ);

    const cartContainer = document.getElementById('cart-items-container');
    const emptyState = document.getElementById('cart-empty-state');
    const cartContent = document.getElementById('cart-content');
    const totalEl = document.getElementById('cart-total');

    cartContainer.innerHTML = '';
    currentCartItems = [];
    let total = 0;

    if (querySnapshot.empty) {
        emptyState.style.display = 'block';
        cartContent.style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    cartContent.style.display = 'block';

    querySnapshot.forEach((docSnap) => {
        const item = docSnap.data();
        item.docId = docSnap.id;
        currentCartItems.push(item);
        total += parseInt(item.price);

        cartContainer.innerHTML += `
            <div style="display: flex; align-items: center; gap: 15px; padding: 15px; border: 1px solid rgba(0,0,0,0.05); border-radius: 12px; background: #fff;">
                <img src="${item.image}" alt="${item.name}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px;">
                <div style="flex: 1;">
                    <h4 style="margin: 0; color: var(--primary-dark); font-size: 1.1rem;">${item.name}</h4>
                    <p style="margin: 5px 0 0 0; font-size: 0.9rem; color: var(--text-muted);">Size: ${item.size} | ${item.sugar} | ${item.ice}</p>
                </div>
                <div style="font-weight: 600; color: var(--primary-dark); font-size: 1.1rem;">${item.price}k</div>
            </div>
        `;
    });
    totalEl.textContent = total + 'k';
}

async function loadHistoryData() {
    if (!currentUserId) return;

    const orderQ = query(collection(db, "orders"), where("uid", "==", currentUserId));
    const querySnapshot = await getDocs(orderQ);

    const historyContainer = document.getElementById('history-items-container');
    const emptyState = document.getElementById('history-empty-state');

    historyContainer.innerHTML = '';

    if (querySnapshot.empty) {
        emptyState.style.display = 'block';
        historyContainer.style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    historyContainer.style.display = 'flex';

    // Sort client-side by timestamp descending
    const orders = [];
    querySnapshot.forEach(docSnap => {
        orders.push(docSnap.data());
    });
    orders.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());

    orders.forEach((order, index) => {
        const dateStr = new Date(order.timestamp.toMillis()).toLocaleString('vi-VN');
        const itemsListStr = order.items.map(i => `${i.name} (x1)`).join(', ');

        historyContainer.innerHTML += `
            <div onclick="showOrderDetails(${index})" style="padding: 20px; border: 1px solid rgba(0,0,0,0.05); border-radius: 12px; background: #fff; cursor: pointer; transition: 0.2s; box-shadow: 0 2px 5px rgba(0,0,0,0.02);" onmouseover="this.style.boxShadow='0 4px 15px rgba(0,0,0,0.08)'" onmouseout="this.style.boxShadow='0 2px 5px rgba(0,0,0,0.02)'">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px dashed rgba(0,0,0,0.1); padding-bottom: 10px;">
                    <span style="color: var(--text-muted); font-size: 0.9rem;">${dateStr}</span>
                    <span style="color: #2e7d32; font-weight: 600; background: #e8f5e9; padding: 4px 10px; border-radius: 12px; font-size: 0.85rem;">Thành công</span>
                </div>
                <p style="margin: 0 0 10px 0; color: var(--primary-dark);">${itemsListStr}</p>
                <div style="text-align: right; font-weight: 700; color: var(--primary-dark); font-size: 1.1rem;">Tổng: ${order.total}k</div>
            </div>
        `;
    });
    
    // Save to global scope for the modal
    currentOrders = orders;
}

window.showOrderDetails = function(index) {
    const order = currentOrders[index];
    if (!order) return;

    const dateStr = new Date(order.timestamp.toMillis()).toLocaleString('vi-VN');
    
    let itemsHtml = order.items.map(item => `
        <div style="display: flex; gap: 15px; margin-bottom: 15px; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 15px;">
            <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
            <div style="flex: 1;">
                <h4 style="margin: 0 0 5px 0; color: var(--primary-dark);">${item.name}</h4>
                <p style="margin: 0; font-size: 0.85rem; color: var(--text-light);">Size: ${item.size} | Đường: ${item.sugar} | Đá: ${item.ice}</p>
            </div>
            <div style="font-weight: 600; color: var(--primary-dark);">${item.price}k</div>
        </div>
    `).join('');

    const contentHtml = `
        <div style="margin-bottom: 20px;">
            <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 5px;">Ngày đặt: <strong style="color: var(--primary-dark);">${dateStr}</strong></div>
            <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 5px;">Người nhận: <strong style="color: var(--primary-dark);">${order.customerName || 'Không có tên'}</strong></div>
            <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 5px;">SĐT: <strong style="color: var(--primary-dark);">${order.customerPhone || 'Không có sđt'}</strong></div>
            <div style="font-size: 0.9rem; color: var(--text-muted);">Địa chỉ: <strong style="color: var(--primary-dark);">${order.customerAddress || 'Không có địa chỉ'}</strong></div>
        </div>
        
        <h4 style="margin-bottom: 15px; border-bottom: 2px solid rgba(82,162,159,0.2); padding-bottom: 10px; color: var(--primary-dark);">Danh sách món</h4>
        
        <div style="max-height: 250px; overflow-y: auto; padding-right: 5px;">
            ${itemsHtml}
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; font-size: 1.2rem; font-weight: 700; color: var(--primary-dark);">
            <span>Tổng cộng:</span>
            <span>${order.total}k</span>
        </div>
    `;

    document.getElementById('order-details-content').innerHTML = contentHtml;
    document.getElementById('order-details-modal').style.display = 'flex';
}
