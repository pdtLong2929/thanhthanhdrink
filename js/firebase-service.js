import { db, auth } from "./firebase-config.js";
import { collection, getDocs, addDoc, query, where, updateDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// State could be handled differently in a larger app, 
// but for simplicity, we'll keep products and reviews in a store object
export const store = {
    products: [],
    reviews: [],
    categories: [],
    siteContent: null
};

export async function fetchDataFromFirebase(callbacks) {
    try {
        const [productsSnapshot, reviewsSnapshot, siteContentSnapshot] = await Promise.all([
            getDocs(collection(db, "products")),
            getDocs(collection(db, "reviews")),
            getDoc(doc(db, "siteContent", "main"))
        ]);

        store.products = productsSnapshot.docs.map(doc => doc.data());
        store.reviews = reviewsSnapshot.docs.map(doc => doc.data());
        
        // Use static categories since Admin panel no longer manages them
        store.categories = [
            { id: 'tra', name: 'Trà Trái Cây', order: 1 },
            { id: 'suachua', name: 'Sữa Chua', order: 2 },
            { id: 'smoothie', name: 'Smoothie', order: 3 }
        ];
        
        if (siteContentSnapshot.exists()) {
            store.siteContent = siteContentSnapshot.data();
        }

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

export async function addToCart(cartItem) {
    const user = auth.currentUser;
    if (!user) return false;

    try {
        // Check if exact item already exists
        const q = query(
            collection(db, "carts"),
            where("uid", "==", user.uid),
            where("productId", "==", cartItem.productId),
            where("size", "==", cartItem.size),
            where("sugar", "==", cartItem.sugar),
            where("ice", "==", cartItem.ice)
        );
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            // Item exists, increment quantity
            const existingDoc = querySnapshot.docs[0];
            const currentQuantity = existingDoc.data().quantity || 1;
            await updateDoc(doc(db, "carts", existingDoc.id), {
                quantity: currentQuantity + 1,
                timestamp: new Date()
            });
        } else {
            // Item doesn't exist, add new with quantity 1
            await addDoc(collection(db, "carts"), {
                uid: user.uid,
                productId: cartItem.productId,
                name: cartItem.name,
                image: cartItem.image,
                size: cartItem.size,
                sugar: cartItem.sugar,
                ice: cartItem.ice,
                price: cartItem.price,
                quantity: 1,
                timestamp: new Date()
            });
        }
        return true;
    } catch (e) {
        console.error("Lỗi khi thêm vào giỏ:", e);
        return false;
    }
}
