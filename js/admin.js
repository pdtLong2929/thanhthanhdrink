import { app, auth, db, storage } from './firebase-config.js';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

const provider = new GoogleAuthProvider();

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
            
            initAdminData();
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
        alert(`Có lỗi xảy ra khi tải ảnh lên. Chi tiết: ${err.message || err.code || err}`);
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
        alert(`Có lỗi xảy ra khi tải ảnh lên nhiều ảnh. Chi tiết: ${err.message || err.code || err}`);
    }
});


// ================= SITE CONTENT =================
async function initAdminData() {
    await fetchCategories();
    await fetchSiteContent();
    await fetchProducts();
}

async function fetchSiteContent() {
    try {
        const docSnap = await getDoc(doc(db, "siteContent", "main"));
        if (docSnap.exists()) {
            const data = docSnap.data();
            
            // Populate form
            const fields = [
                'heroTitle', 'heroDescription', 'heroBadge', 'heroLogo',
                'storyBadge', 'storyTitle', 'storyDesc',
                'missionBadge', 'missionTitle', 'missionDesc',
                'menuBadge', 'menuTitle', 'menuDesc',
                'aboutBadge1', 'aboutTitle1', 'aboutDesc1', 'aboutImg1',
                'aboutBadge2', 'aboutTitle2', 'aboutDesc2', 'aboutImg2',
                'aboutBadge3', 'aboutTitle3', 'aboutDesc3', 'aboutImg3',
                'footerAddress', 'footerPhone', 'footerEmail', 'footerHours'
            ];
            
            fields.forEach(field => {
                const el = document.getElementById(field);
                if (el && data[field]) el.value = data[field];
            });
            
            if (data.heroBanners && Array.isArray(data.heroBanners)) {
                document.getElementById('heroBanners').value = data.heroBanners.join('\n');
            }
        }
    } catch (e) {
        console.error("Lỗi khi tải nội dung tĩnh", e);
    }
}

document.getElementById('site-content-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const heroBannersRaw = document.getElementById('heroBanners').value;
    const heroBanners = heroBannersRaw.split('\n').map(l => l.trim()).filter(l => l);
    
    const data = {
        heroTitle: document.getElementById('heroTitle').value,
        heroDescription: document.getElementById('heroDescription').value,
        heroBadge: document.getElementById('heroBadge').value,
        heroLogo: document.getElementById('heroLogo').value,
        heroBanners: heroBanners,
        storyBadge: document.getElementById('storyBadge').value,
        storyTitle: document.getElementById('storyTitle').value,
        storyDesc: document.getElementById('storyDesc').value,
        missionBadge: document.getElementById('missionBadge').value,
        missionTitle: document.getElementById('missionTitle').value,
        missionDesc: document.getElementById('missionDesc').value,
        menuBadge: document.getElementById('menuBadge').value,
        menuTitle: document.getElementById('menuTitle').value,
        menuDesc: document.getElementById('menuDesc').value,
        aboutBadge1: document.getElementById('aboutBadge1').value,
        aboutTitle1: document.getElementById('aboutTitle1').value,
        aboutDesc1: document.getElementById('aboutDesc1').value,
        aboutImg1: document.getElementById('aboutImg1').value,
        aboutBadge2: document.getElementById('aboutBadge2').value,
        aboutTitle2: document.getElementById('aboutTitle2').value,
        aboutDesc2: document.getElementById('aboutDesc2').value,
        aboutImg2: document.getElementById('aboutImg2').value,
        aboutBadge3: document.getElementById('aboutBadge3').value,
        aboutTitle3: document.getElementById('aboutTitle3').value,
        aboutDesc3: document.getElementById('aboutDesc3').value,
        aboutImg3: document.getElementById('aboutImg3').value,
        footerAddress: document.getElementById('footerAddress').value,
        footerPhone: document.getElementById('footerPhone').value,
        footerEmail: document.getElementById('footerEmail').value,
        footerHours: document.getElementById('footerHours').value,
    };
    
    try {
        await setDoc(doc(db, "siteContent", "main"), data);
        alert("Đã lưu nội dung thành công!");
    } catch(err) {
        console.error(err);
        alert(`Lỗi khi lưu nội dung. Chi tiết: ${err.message || err.code || err}`);
    }
});


// ================= CATEGORIES CRUD =================
async function fetchCategories() {
    try {
        const snapshot = await getDocs(collection(db, "categories"));
        const tbody = document.querySelector('#categories-table tbody');
        const prodCategorySelect = document.getElementById('prodCategory');
        
        if (!tbody || !prodCategorySelect) return;

        tbody.innerHTML = '';
        prodCategorySelect.innerHTML = '';
        
        const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        categories.sort((a, b) => (a.order || 0) - (b.order || 0));
        
        // Seed initial categories if empty
        if (categories.length === 0) {
            console.log("Seeding initial categories...");
            const defaults = [
                { id: 'tra', name: 'Trà Trái Cây', order: 1, priceRange: '55k / 65k' },
                { id: 'suachua', name: 'Sữa Chua', order: 2, priceRange: '55k / 65k' },
                { id: 'smoothie', name: 'Smoothie', order: 3, priceRange: '85k / 95k' }
            ];
            for (let c of defaults) {
                await setDoc(doc(db, "categories", c.id), c);
                categories.push(c);
            }
        }
        
        categories.forEach(cat => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${cat.iconUrl || ''}" alt="icon" style="width: 40px; height: 40px; object-fit: contain;"></td>
                <td>${cat.id}</td>
                <td>${cat.name}</td>
                <td>${cat.description || ''}</td>
                <td>${cat.order || 0}</td>
                <td>
                    <button class="btn-outline btn-edit-cat" data-id="${cat.id}">Sửa</button>
                    <button class="btn-outline btn-del-cat" data-id="${cat.id}" style="color: #ef4444; border-color: #ef4444;">Xóa</button>
                </td>
            `;
            tbody.appendChild(tr);
            
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            prodCategorySelect.appendChild(option);
        });

        document.querySelectorAll('.btn-edit-cat').forEach(btn => {
            btn.addEventListener('click', (e) => openCategoryModal(e.target.getAttribute('data-id'), categories));
        });
        document.querySelectorAll('.btn-del-cat').forEach(btn => {
            btn.addEventListener('click', (e) => deleteCategory(e.target.getAttribute('data-id')));
        });
    } catch(e) {
        console.error("Lỗi khi tải danh mục", e);
    }
}

const catModal = document.getElementById('category-form-modal');
document.getElementById('btn-add-category').addEventListener('click', () => {
    document.getElementById('category-form').reset();
    document.getElementById('catDocId').value = '';
    document.getElementById('catId').readOnly = false;
    document.getElementById('category-modal-title').textContent = "Thêm danh mục";
    catModal.style.display = 'flex';
});
document.getElementById('close-category-modal').addEventListener('click', () => {
    catModal.style.display = 'none';
});

function openCategoryModal(id, categories) {
    const cat = categories.find(c => c.id === id);
    if(!cat) return;
    
    document.getElementById('catDocId').value = cat.id;
    document.getElementById('catId').value = cat.id;
    document.getElementById('catId').readOnly = true;
    document.getElementById('catName').value = cat.name;
    document.getElementById('catDesc').value = cat.description || '';
    document.getElementById('catPriceRange').value = cat.priceRange || '';
    document.getElementById('catOrder').value = cat.order || 0;
    document.getElementById('catIcon').value = cat.iconUrl || '';
    
    document.getElementById('category-modal-title').textContent = "Sửa danh mục";
    catModal.style.display = 'flex';
}

document.getElementById('category-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('catId').value.trim();
    if(!id) return;
    
    const data = {
        name: document.getElementById('catName').value,
        description: document.getElementById('catDesc').value,
        priceRange: document.getElementById('catPriceRange').value,
        order: parseInt(document.getElementById('catOrder').value) || 0,
        iconUrl: document.getElementById('catIcon').value
    };
    
    try {
        await setDoc(doc(db, "categories", id), data);
        alert("Đã lưu danh mục thành công!");
        catModal.style.display = 'none';
        fetchCategories();
    } catch(err) {
        console.error(err);
        alert(`Lỗi khi lưu danh mục. Chi tiết: ${err.message || err.code || err}`);
    }
});

async function deleteCategory(id) {
    if(confirm("Bạn có chắc chắn muốn xóa danh mục này? Hãy chắc chắn không còn món ăn nào thuộc danh mục này!")) {
        try {
            await deleteDoc(doc(db, "categories", id));
            fetchCategories();
        } catch(e) {
            console.error(e);
            alert(`Lỗi khi xóa danh mục. Chi tiết: ${e.message || e.code || e}`);
        }
    }
}


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
            if (confirm("Bạn có chắc muốn xóa món này?")) {
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
        alert("Đã lưu món ăn!");
        productModal.style.display = 'none';
        fetchProducts();
    } catch(err) {
        console.error(err);
        alert(`Lỗi khi lưu món ăn. Chi tiết: ${err.message || err.code || err}`);
    }
});
