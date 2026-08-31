import { db, auth } from "./firebase-config.js";
import { collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// State could be handled differently in a larger app, 
// but for simplicity, we'll keep products and reviews in a store object
export const store = {
    products: [],
    reviews: []
};

export async function fetchDataFromFirebase(callbacks) {
    try {
        const productsSnapshot = await getDocs(collection(db, "products"));
        store.products = productsSnapshot.docs.map(doc => doc.data());

        const reviewsSnapshot = await getDocs(collection(db, "reviews"));
        store.reviews = reviewsSnapshot.docs.map(doc => doc.data());

        store.products.sort((a, b) => {
            const idA = parseInt(a.id.replace('p', ''));
            const idB = parseInt(b.id.replace('p', ''));
            return idA - idB;
        });

        if (callbacks) {
            callbacks.forEach(cb => cb());
        }
    } catch (error) {
        console.error("Error fetching data from Firebase:", error);
    }
}

export async function submitDirectOrder(orderItem, customerInfo) {
    const user = auth.currentUser;
    if (!user) return false;

    try {
        await addDoc(collection(db, "orders"), {
            uid: user.uid,
            items: [orderItem],
            total: parseInt(orderItem.price),
            timestamp: new Date(),
            customerName: customerInfo.name,
            customerPhone: customerInfo.phone,
            customerAddress: customerInfo.address
        });
        return true;
    } catch (e) {
        console.error("Lỗi khi đặt hàng:", e);
        return false;
    }
}
