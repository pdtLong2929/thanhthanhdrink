import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { auth } from "./firebase-config.js";

const provider = new GoogleAuthProvider();

// DOM Elements
const loginBtn = document.getElementById("google-login-btn");
const authModal = document.getElementById("auth-modal");
const headerAuthSection = document.getElementById("header-auth-section");

// Handle Google Login
if (loginBtn) {
    loginBtn.addEventListener("click", () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log("Logged in:", result.user);
                authModal.style.display = "none";
            })
            .catch((error) => {
                console.error("Login Error:", error);
                alert("Đăng nhập thất bại. Vui lòng thử lại!");
            });
    });
}

// Global function to handle logout
window.handleLogout = () => {
    signOut(auth).then(() => {
        console.log("Logged out");
    }).catch((error) => {
        console.error("Logout Error:", error);
    });
};

// Global function to open modal with optional custom notice message & title
window.openAuthModal = (message, title) => {
    const modal = document.getElementById("auth-modal");
    if (!modal) return;

    const titleEl = document.getElementById("auth-modal-title") || modal.querySelector(".auth-title");
    const subEl = document.getElementById("auth-modal-subtitle") || modal.querySelector(".auth-subtitle");
    const noticeEl = document.getElementById("auth-modal-notice");
    const noticeText = document.getElementById("auth-modal-notice-text");

    if (title && titleEl) {
        titleEl.textContent = title;
    } else if (titleEl) {
        titleEl.textContent = "Đăng nhập / Đăng ký";
    }

    if (message) {
        if (noticeEl) {
            if (noticeText) noticeText.textContent = message;
            else noticeEl.textContent = message;
            noticeEl.style.display = "flex";
        } else if (subEl) {
            subEl.textContent = message;
        }
        if (subEl && noticeEl) {
            subEl.textContent = "Vui lòng đăng nhập tài khoản Google để tiếp tục.";
        }
    } else {
        if (noticeEl) noticeEl.style.display = "none";
        if (subEl) subEl.textContent = "Vui lòng đăng nhập để tiếp tục";
    }

    modal.style.display = "flex";
};

// Listen to auth state changes
onAuthStateChanged(auth, (user) => {
    const mobileAuthCta = document.querySelector('.mobile-auth-cta');
    
    if (user) {
        // User is signed in.
        const displayName = user.displayName || "User";
        const photoURL = user.photoURL || "https://placehold.co/40x40/b5e4dc/3c7363?text=" + displayName.charAt(0);
        
        if (headerAuthSection) {
            headerAuthSection.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="${photoURL}" alt="Avatar" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; cursor: pointer;" onclick="window.location.href='profile.html'" title="Trang cá nhân">
                    <span style="font-weight: 600; color: var(--primary-dark); cursor: pointer;" onclick="window.location.href='profile.html'" title="Trang cá nhân">${displayName}</span>
                    <button onclick="handleLogout()" class="btn-outline pill-btn" style="padding: 5px 15px; font-size: 0.9rem; margin-left: 10px;">Đăng xuất</button>
                </div>
            `;
        }
        
        if (mobileAuthCta) {
            mobileAuthCta.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 15px;">
                    <img src="${photoURL}" alt="Avatar" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; cursor: pointer;" onclick="window.location.href='profile.html'" title="Trang cá nhân">
                    <span style="font-weight: 600; color: var(--primary-dark); cursor: pointer; flex: 1; text-align: left;" onclick="window.location.href='profile.html'" title="Trang cá nhân">${displayName}</span>
                    <button onclick="handleLogout(); const nav = document.querySelector('.navigation'); if(nav) nav.classList.remove('active');" class="btn-outline pill-btn" style="padding: 5px 15px; font-size: 0.9rem;">Đăng xuất</button>
                </div>
            `;
        }
    } else {
        // User is signed out.
        if (headerAuthSection) {
            headerAuthSection.innerHTML = `
                <a href="#" class="btn-primary pill-btn" onclick="openAuthModal(); return false;">Đăng nhập / Đăng ký</a>
            `;
        }
        if (mobileAuthCta) {
            mobileAuthCta.innerHTML = `
                <a href="#" class="btn-primary pill-btn" style="width: 100%; text-align: center;"
                    onclick="openAuthModal(); const nav = document.querySelector('.navigation'); if(nav) nav.classList.remove('active'); return false;">Đăng nhập / Đăng ký</a>
            `;
        }
    }
});
