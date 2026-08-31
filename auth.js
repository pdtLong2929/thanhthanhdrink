import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOaDDacOZNJT-W_ma9ZRT2KB-IGk1H2lc",
  authDomain: "thanhthanhtea-e1feb.firebaseapp.com",
  projectId: "thanhthanhtea-e1feb",
  storageBucket: "thanhthanhtea-e1feb.firebasestorage.app",
  messagingSenderId: "754380937369",
  appId: "1:754380937369:web:2765e9b1ef9314de144008",
  measurementId: "G-Q9SZ82ZFNT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
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

// Global function to open modal (so inline onclick handlers still work)
window.openAuthModal = () => {
    if (authModal) authModal.style.display = "flex";
};

// Listen to auth state changes
onAuthStateChanged(auth, (user) => {
    if (!headerAuthSection) return;

    if (user) {
        // User is signed in.
        const displayName = user.displayName || "User";
        const photoURL = user.photoURL || "https://placehold.co/40x40/b5e4dc/3c7363?text=" + displayName.charAt(0);
        
        headerAuthSection.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <img src="${photoURL}" alt="Avatar" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover;">
                <span style="font-weight: 600; color: var(--primary-dark);">${displayName}</span>
                <button onclick="handleLogout()" class="btn-outline pill-btn" style="padding: 5px 15px; font-size: 0.9rem; margin-left: 10px;">Đăng xuất</button>
            </div>
        `;
    } else {
        // User is signed out.
        headerAuthSection.innerHTML = `
            <a href="#" class="btn-primary pill-btn" onclick="openAuthModal(); return false;">Đăng nhập / Đăng ký</a>
        `;
    }
});
