import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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
const db = getFirestore(app);

export { app, auth, db };
