import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { auth, db } from "./firebase-config.js";
import { collection, query, where, getDocs, deleteDoc, doc, addDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

let currentUserId = null;
let currentCartItems = [];
let selectedCartItems = new Set();
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

    // Handle Checkout - Open Modal
    document.getElementById('checkout-btn')?.addEventListener('click', () => {
        if (!currentUserId || currentCartItems.length === 0) return;
        if (selectedCartItems.size === 0) {
            alert("Vui lòng chọn ít nhất 1 món để thanh toán!");
            return;
        }
        document.getElementById('checkout-modal').style.display = 'flex';
    });

});


window.recalculateTotal = function() {
    let total = 0;
    currentCartItems.forEach(item => {
        if (selectedCartItems.has(item.docId)) {
            const qty = item.quantity || 1;
            total += parseInt(item.price) * qty;
        }
    });
    document.getElementById('cart-total').textContent = total + 'k';
    
    // Update select all checkbox state
    const allCheckbox = document.getElementById('select-all-checkbox');
    if (allCheckbox && currentCartItems.length > 0) {
        allCheckbox.checked = selectedCartItems.size === currentCartItems.length;
    }
}

window.toggleSelectAll = function(checked) {
    if (checked) {
        currentCartItems.forEach(item => selectedCartItems.add(item.docId));
    } else {
        selectedCartItems.clear();
    }
    
    document.querySelectorAll('.cart-item-checkbox').forEach(cb => {
        cb.checked = checked;
    });
    
    window.recalculateTotal();
}

window.toggleCartItem = function(docId, checked) {
    if (checked) {
        selectedCartItems.add(docId);
    } else {
        selectedCartItems.delete(docId);
    }
    window.recalculateTotal();
}

window.updateCartQuantity = async function(docId, delta) {
    const item = currentCartItems.find(i => i.docId === docId);
    if (!item) return;
    
    const newQty = (item.quantity || 1) + delta;
    if (newQty <= 0) {
        const confirmDelete = confirm("Bạn có chắc muốn xóa món này khỏi giỏ hàng?");
        if (confirmDelete) {
            await window.deleteCartItem(docId);
        }
        return;
    }
    
    // Optimistic UI update
    item.quantity = newQty;
    document.getElementById(`qty-${docId}`).textContent = newQty;
    window.recalculateTotal();
    
    // Background Firebase update
    try {
        await updateDoc(doc(db, "carts", docId), { quantity: newQty });
    } catch (e) {
        console.error("Lỗi cập nhật số lượng:", e);
    }
}

window.deleteCartItem = async function(docId) {
    try {
        await deleteDoc(doc(db, "carts", docId));
        selectedCartItems.delete(docId);
        await loadCartData(); // Reload whole cart
    } catch (e) {
        console.error("Lỗi xóa món:", e);
        alert("Không thể xóa món này. Vui lòng thử lại.");
    }
}

async function loadCartData() {
    if (!currentUserId) return;

    const cartQ = query(collection(db, "carts"), where("uid", "==", currentUserId));
    const querySnapshot = await getDocs(cartQ);

    const cartContainer = document.getElementById('cart-items-container');
    const emptyState = document.getElementById('cart-empty-state');
    const cartContent = document.getElementById('cart-content');

    cartContainer.innerHTML = '';
    currentCartItems = [];

    if (querySnapshot.empty) {
        emptyState.style.display = 'block';
        cartContent.style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    cartContent.style.display = 'block';
    
    // Select All Header
    cartContainer.innerHTML = `
        <div style="display: flex; align-items: center; padding: 10px 15px; margin-bottom: 10px; border-bottom: 1px solid rgba(0,0,0,0.05);">
            <input type="checkbox" id="select-all-checkbox" style="width: 18px; height: 18px; cursor: pointer; accent-color: var(--primary-dark);" checked onchange="window.toggleSelectAll(this.checked)">
            <label for="select-all-checkbox" style="margin-left: 10px; font-weight: 600; cursor: pointer; color: var(--primary-dark);">Chọn tất cả</label>
        </div>
    `;

    querySnapshot.forEach((docSnap) => {
        const item = docSnap.data();
        item.docId = docSnap.id;
        item.quantity = item.quantity || 1;
        currentCartItems.push(item);
        
        // By default select all if newly loaded
        selectedCartItems.add(item.docId);

        cartContainer.innerHTML += `
            <div style="display: flex; align-items: center; gap: 15px; padding: 15px; border: 1px solid rgba(0,0,0,0.05); border-radius: 12px; background: #fff; margin-bottom: 10px;">
                <input type="checkbox" class="cart-item-checkbox" checked onchange="window.toggleCartItem('${item.docId}', this.checked)" style="width: 18px; height: 18px; cursor: pointer; accent-color: var(--primary-dark);">
                <img src="${item.image}" alt="${item.name}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px;">
                <div style="flex: 1;">
                    <h4 style="margin: 0; color: var(--primary-dark); font-size: 1.1rem;">${item.name}</h4>
                    <p style="margin: 5px 0 0 0; font-size: 0.9rem; color: var(--text-muted);">Size: ${item.size} | ${item.sugar} | ${item.ice}</p>
                    <div style="font-weight: 600; color: var(--primary-dark); margin-top: 5px;">${item.price}k</div>
                </div>
                
                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 10px;">
                    <button onclick="window.deleteCartItem('${item.docId}')" style="background: none; border: none; cursor: pointer; color: #f44336; padding: 5px;" title="Xóa món">
                        <i class="ph ph-trash" style="font-size: 1.2rem;"></i>
                    </button>
                    
                    <div style="display: flex; align-items: center; background: rgba(0,0,0,0.03); border-radius: 20px; padding: 2px;">
                        <button onclick="window.updateCartQuantity('${item.docId}', -1)" style="width: 25px; height: 25px; border-radius: 50%; border: none; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);"><i class="ph ph-minus"></i></button>
                        <span id="qty-${item.docId}" style="width: 30px; text-align: center; font-weight: 600; font-size: 0.9rem;">${item.quantity}</span>
                        <button onclick="window.updateCartQuantity('${item.docId}', 1)" style="width: 25px; height: 25px; border-radius: 50%; border: none; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); color: var(--primary-dark);"><i class="ph ph-plus"></i></button>
                    </div>
                </div>
            </div>
        `;
    });
    
    window.recalculateTotal();
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

window.showSuccessModal = function(title, message, btnText, redirectFn) {
    document.getElementById('success-modal-title').textContent = title;
    document.getElementById('success-modal-msg').textContent = message;
    const btn = document.getElementById('success-modal-btn');
    btn.textContent = btnText;
    btn.onclick = () => {
        redirectFn();
        return false;
    };
    document.getElementById('success-modal').style.display = 'flex';
}

window.submitCartOrder = async function() {
    if (!currentUserId || currentCartItems.length === 0) return;
    
    const itemsToOrder = currentCartItems.filter(item => selectedCartItems.has(item.docId));
    
    if (itemsToOrder.length === 0) {
        alert("Vui lòng chọn ít nhất 1 món để đặt hàng!");
        document.getElementById('checkout-modal').style.display = 'none';
        return;
    }

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

    try {
        const orderTotal = itemsToOrder.reduce((sum, item) => sum + (parseInt(item.price) * (item.quantity || 1)), 0);
        
        // Ensure quantity is saved in the order
        const finalizedItems = itemsToOrder.map(i => ({
            productId: i.productId || "",
            name: i.name,
            image: i.image,
            size: i.size,
            sugar: i.sugar,
            ice: i.ice,
            price: i.price,
            quantity: i.quantity || 1
        }));

        await addDoc(collection(db, "orders"), {
            uid: currentUserId,
            items: finalizedItems,
            total: orderTotal,
            timestamp: new Date(),
            customerName: name,
            customerPhone: phone,
            customerAddress: address
        });

        // Delete only ordered items from carts
        for (const item of itemsToOrder) {
            await deleteDoc(doc(db, "carts", item.docId));
        }

        document.getElementById('checkout-modal').style.display = 'none';
        document.getElementById('checkout-form').reset();
        
        loadCartData();
        loadHistoryData();
        
        window.showSuccessModal("Thành công!", "Đã đặt hàng thành công.", "Xem đơn hàng", () => {
            document.getElementById('success-modal').style.display = 'none';
            // switch to history tab
            const historyTab = document.querySelector('.sidebar-item[data-target="tab-history"]');
            if (historyTab) historyTab.click();
        });

    } catch (error) {
        console.error("Lỗi khi thanh toán:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
        btn.textContent = "Xác nhận đặt hàng";
        btn.disabled = false;
    }
}
