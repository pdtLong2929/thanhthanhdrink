import { app, auth, db, storage } from './firebase-config.js';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

const provider = new GoogleAuthProvider();

function showDialog(message, type = 'alert') {
    return new Promise((resolve) => {
        const modal = document.getElementById('custom-dialog-modal');
        const icon = document.getElementById('dialog-icon');
        const title = document.getElementById('dialog-title');
        const msg = document.getElementById('dialog-message');
        const okBtn = document.getElementById('dialog-ok-btn');
        const cancelBtn = document.getElementById('dialog-cancel-btn');

        msg.textContent = message;

        if (type === 'confirm') {
            icon.innerHTML = '<i class="ph-fill ph-question" style="color: #f59e0b;"></i>';
            title.textContent = "Xác nhận";
            cancelBtn.style.display = 'inline-block';
        } else if (type === 'success') {
            icon.innerHTML = '<i class="ph-fill ph-check-circle" style="color: #10b981;"></i>';
            title.textContent = "Thành công";
            cancelBtn.style.display = 'none';
        } else if (type === 'error') {
            icon.innerHTML = '<i class="ph-fill ph-warning-circle" style="color: #ef4444;"></i>';
            title.textContent = "Lỗi";
            cancelBtn.style.display = 'none';
        } else {
            icon.innerHTML = '<i class="ph-fill ph-info" style="color: #3b82f6;"></i>';
            title.textContent = "Thông báo";
            cancelBtn.style.display = 'none';
        }

        modal.style.display = 'block';

        const cleanup = () => {
            modal.style.display = 'none';
            okBtn.onclick = null;
            cancelBtn.onclick = null;
        };

        okBtn.onclick = () => {
            cleanup();
            resolve(true);
        };

        cancelBtn.onclick = () => {
            cleanup();
            resolve(false);
        };
    });
}
// DOM Elements
const loginOverlay = document.getElementById('login-overlay');
const adminApp = document.getElementById('admin-app');
const loginBtn = document.getElementById('admin-login-btn');
const logoutBtn = document.getElementById('admin-logout-btn');
const adminEmail = document.getElementById('admin-email');
const adminError = document.getElementById('admin-error');

// Tabs
const navItems = document.querySelectorAll('.admin-nav-item');
const tabContents = document.querySelectorAll('.tab-content');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(nav => nav.classList.remove('active'));
        tabContents.forEach(tab => tab.classList.remove('active'));
        
        item.classList.add('active');
        document.getElementById(item.getAttribute('data-target')).classList.add('active');
    });
});

// Auth State Observer
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Basic security check: in a real app, verify admin role in Firebase Rules or a specific collection
        // For this demo, we assume any logged in user can access, OR we can check an 'admins' collection
        try {
            // Check if user is admin (optional: create an 'admins' collection and add the uid there)
            const adminDoc = await getDoc(doc(db, "admins", user.uid));
            if (!adminDoc.exists()) {
                throw new Error("User is not an admin");
            }
            
            loginOverlay.style.display = 'none';
            adminApp.style.display = 'block';
            adminEmail.textContent = user.email;
            
            fetchProducts();
        } catch(e) {
            console.error(e);
            adminError.style.display = 'block';
            adminError.textContent = "Tài khoản của bạn không có quyền Admin!";
            signOut(auth);
        }
    } else {
        loginOverlay.style.display = 'flex';
        adminApp.style.display = 'none';
        adminError.style.display = 'none';
    }
});

loginBtn.addEventListener('click', () => {
    signInWithPopup(auth, provider).catch(error => {
        console.error("Login failed", error);
    });
});

logoutBtn.addEventListener('click', () => {
    signOut(auth);
});

// ================= UPLOAD IMAGES =================
const hiddenFileInput = document.getElementById('hidden-file-input');
const hiddenMultiFileInput = document.getElementById('hidden-multi-file-input');
let currentUploadTarget = null;

document.querySelectorAll('.upload-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        currentUploadTarget = e.currentTarget.getAttribute('data-target');
        hiddenFileInput.click();
    });
});

document.querySelectorAll('.upload-multi-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        currentUploadTarget = e.currentTarget.getAttribute('data-target');
        hiddenMultiFileInput.click();
    });
});

hiddenFileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file || !currentUploadTarget) return;
    
    try {
        const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
        const btn = document.querySelector(`[data-target="${currentUploadTarget}"]`);
        const originalText = btn.textContent;
        btn.textContent = 'Đang tải...';
        btn.disabled = true;
        
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        
        document.getElementById(currentUploadTarget).value = downloadURL;
        
        btn.textContent = originalText;
        btn.disabled = false;
        hiddenFileInput.value = '';
    } catch(err) {
        console.error("Lỗi upload:", err);
        await showDialog(`Có lỗi xảy ra khi tải ảnh lên. Chi tiết: ${err.message || err.code || err}`, 'error');
    }
});

hiddenMultiFileInput.addEventListener('change', async (e) => {
    const files = e.target.files;
    if (!files.length || !currentUploadTarget) return;
    
    try {
        const btn = document.querySelector(`[data-target="${currentUploadTarget}"]`);
        const originalText = btn.textContent;
        btn.textContent = 'Đang tải...';
        btn.disabled = true;
        
        const urls = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            urls.push(downloadURL);
        }
        
        const targetEl = document.getElementById(currentUploadTarget);
        const existingVal = targetEl.value.trim();
        if (existingVal) {
            targetEl.value = existingVal + '\n' + urls.join('\n');
        } else {
            targetEl.value = urls.join('\n');
        }
        
        btn.textContent = originalText;
        btn.disabled = false;
        hiddenMultiFileInput.value = '';
    } catch(err) {
        console.error("Lỗi upload:", err);
        await showDialog(`Có lỗi xảy ra khi tải ảnh lên nhiều ảnh. Chi tiết: ${err.message || err.code || err}`, 'error');
    }
});




// ================= PRODUCTS =================
let allProducts = [];

async function fetchProducts() {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        allProducts = [];
        
        const migrationMap = {
            "TRÀ TRÁI CÂY": "tra",
            "SỮA CHUA": "suachua",
            "SMOOTHIE": "smoothie"
        };
        
        for (const document of querySnapshot.docs) {
            let data = document.data();
            // Data migration for old categories
            if (migrationMap[data.category]) {
                data.category = migrationMap[data.category];
                await updateDoc(doc(db, "products", document.id), { category: data.category });
            }
            allProducts.push({ _docId: document.id, ...data });
        }
        
        allProducts.sort((a, b) => parseInt(a.id.replace('p', '')) - parseInt(b.id.replace('p', '')));
        renderProductsTable();
    } catch (e) {
        console.error("Lỗi khi tải danh sách món", e);
    }
}

function renderProductsTable() {
    const tbody = document.querySelector('#products-table tbody');
    tbody.innerHTML = '';
    
    allProducts.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${p.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.category || '-'}</td>
            <td>${p.priceM}</td>
            <td>${p.priceL}</td>
            <td>
                <button class="action-btn edit-btn" data-docid="${p._docId}"><i class="ph ph-pencil-simple"></i></button>
                <button class="action-btn delete-btn" data-docid="${p._docId}"><i class="ph ph-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const docId = e.currentTarget.getAttribute('data-docid');
            openProductModal(docId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const docId = e.currentTarget.getAttribute('data-docid');
            if (await showDialog("Bạn có chắc muốn xóa món này?", 'confirm')) {
                await deleteDoc(doc(db, "products", docId));
                fetchProducts();
            }
        });
    });
}

// Modal handling
const productModal = document.getElementById('product-form-modal');
document.getElementById('btn-add-product').addEventListener('click', () => openProductModal(null));
document.getElementById('close-product-modal').addEventListener('click', () => productModal.style.display = 'none');

function openProductModal(docId) {
    productModal.style.display = 'block';
    const form = document.getElementById('product-form');
    form.reset();
    
    if (docId) {
        document.getElementById('product-modal-title').textContent = "Sửa món ăn";
        const p = allProducts.find(item => item._docId === docId);
        if (p) {
            document.getElementById('prodDocId').value = p._docId;
            document.getElementById('prodId').value = p.id || '';
            document.getElementById('prodName').value = p.name || '';
            document.getElementById('prodCategory').value = p.category || 'TRÀ TRÁI CÂY';
            document.getElementById('prodPriceM').value = p.priceM || '';
            document.getElementById('prodPriceL').value = p.priceL || '';
            document.getElementById('prodCaloM').value = p.caloM || '';
            document.getElementById('prodCaloL').value = p.caloL || '';
            document.getElementById('prodImage').value = p.image || '';
            document.getElementById('prodIngredients').value = p.ingredients || '';
            document.getElementById('prodDesc').value = p.description || '';
            document.getElementById('prodShortDesc').value = p.modal_desc || '';
            
            document.getElementById('prodSugar').value = p.nutrition ? p.nutrition.sugar : '';
            document.getElementById('prodFiber').value = p.nutrition ? p.nutrition.fiber : '';
            document.getElementById('prodProtein').value = p.nutrition ? p.nutrition.protein : '';
            document.getElementById('prodVitC').value = p.nutrition ? p.nutrition.vitaminC : '';
            
            document.getElementById('prodTags').value = p.tags ? p.tags.join(', ') : '';
        }
    } else {
        document.getElementById('product-modal-title').textContent = "Thêm món mới";
        document.getElementById('prodDocId').value = '';
    }
}

document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const docId = document.getElementById('prodDocId').value;
    const newDocId = docId || 'prod_' + Date.now();
    
    const tagsVal = document.getElementById('prodTags').value;
    const tags = tagsVal ? tagsVal.split(',').map(t => t.trim()).filter(t => t) : [];
    
    const productData = {
        id: document.getElementById('prodId').value,
        name: document.getElementById('prodName').value,
        category: document.getElementById('prodCategory').value,
        priceM: document.getElementById('prodPriceM').value,
        priceL: document.getElementById('prodPriceL').value,
        caloM: document.getElementById('prodCaloM').value,
        caloL: document.getElementById('prodCaloL').value,
        image: document.getElementById('prodImage').value,
        ingredients: document.getElementById('prodIngredients').value,
        description: document.getElementById('prodDesc').value,
        modal_desc: document.getElementById('prodShortDesc').value,
        tags: tags,
        nutrition: {
            sugar: parseFloat(document.getElementById('prodSugar').value) || 0,
            fiber: parseFloat(document.getElementById('prodFiber').value) || 0,
            protein: parseFloat(document.getElementById('prodProtein').value) || 0,
            vitaminC: parseFloat(document.getElementById('prodVitC').value) || 0
        }
    };
    
    try {
        await setDoc(doc(db, "products", docId || productData.id), productData); // Use custom ID if new
        await showDialog("Đã lưu món ăn!", 'success');
        productModal.style.display = 'none';
        fetchProducts();
    } catch(err) {
        console.error(err);
        await showDialog(`Lỗi khi lưu món ăn. Chi tiết: ${err.message || err.code || err}`, 'error');
    }
});
