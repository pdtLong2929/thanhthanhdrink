import { db } from "./firebase-config.js";
import { collection, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const reviews = [
    { name: "Minh Tuấn", date: "22/08/2026", rating: 5, image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=200&h=200", text: "Trà trái cây rất tươi, uống thanh mát không bị gắt đường. Đóng gói đẹp!" },
    { name: "Lan Ngọc", date: "15/08/2026", rating: 5, image: null, text: "Sữa chua ở đây làm mình bất ngờ, chua dịu và thơm. Sẽ ủng hộ dài dài." },
    { name: "Hoàng Phong", date: "10/08/2026", rating: 4, image: "https://images.unsplash.com/photo-1595981267035-7b04d84d515a?auto=format&fit=crop&q=80&w=200&h=200", text: "Smoothie bơ chuối rất ngon và no, tuy nhiên giao hàng hơi lâu một chút." },
    { name: "Thảo Vy", date: "05/08/2026", rating: 5, image: null, text: "Trà cam bưởi cực đỉnh, múi bưởi to và không bị đắng. Mình hay gọi size L." },
    { name: "Đức Tài", date: "02/08/2026", rating: 3, image: null, text: "Bình thường, hơi ngọt so với mình mặc dù đã gọi 50% đường." },
    { name: "Khánh Linh", date: "28/07/2026", rating: 5, image: "https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?auto=format&fit=crop&q=80&w=200&h=200", text: "Thích nhất là được tuỳ chỉnh 100% đường đá, đồ uống healthy đúng gu." },
    { name: "Tuấn Anh", date: "20/07/2026", rating: 4, image: null, text: "Nước ngon nhưng quán hơi đông vào giờ tan tầm." },
    { name: "Mai Trang", date: "15/07/2026", rating: 5, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=200&h=200", text: "Trà dâu tây rất tuyệt, dâu nhiều và tươi. 10 điểm!" }
];

const products = [
    // Trà Trái Cây (7 món)
    {
        id: "p1", category: "TRÀ TRÁI CÂY", name: "Trà Khế Nho Xanh", ingredients: "Khế, nho xanh", desc: "Hương vị chua chua ngọt dịu tươi mới.", longDesc: "Trà Khế Nho Xanh mang đến sự kết hợp độc đáo giữa vị chua nhẹ của khế và ngọt thanh của nho xanh.", tags: ["MỚI", "120 kcal"], image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", priceM: "55", priceL: "65", nutritionM: { calo: 120, sugar: 25, fiber: 2.0, protein: 0.5, vitc: 80 }, nutritionL: { calo: 150, sugar: 32, fiber: 2.5, protein: 0.7, vitc: 100 }
    },
    {
        id: "p2", category: "TRÀ TRÁI CÂY", name: "Trà Cam Bưởi", ingredients: "Cam, Bưởi", desc: "Cặp đôi họ cam quýt kinh điển, nhiều vitamin C nhất menu.", longDesc: "Cam vàng vắt tay lấy nước, bưởi da xanh tách tép nguyên múi thả vào ly. Trà ô long nhẹ hương giữ cho vị bưởi không bị đắng.", tags: ["BÁN CHẠY", "142 kcal"], image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", priceM: "55", priceL: "65", nutritionM: { calo: 142, sugar: 30, fiber: 2.8, protein: 0.8, vitc: 96 }, nutritionL: { calo: 178, sugar: 38, fiber: 3.5, protein: 1.0, vitc: 120 }
    },
    {
        id: "p3", category: "TRÀ TRÁI CÂY", name: "Trà Mận Đào", ingredients: "Mận, Đào", desc: "Hương vị mùa hè rực rỡ với mận Hà Nội và đào tươi.", longDesc: "Mận hậu chua thanh kết hợp cùng đào miếng giòn ngọt. Nước cốt trà lài nhẹ nhàng tôn lên hương trái cây nguyên bản.", tags: ["BÁN CHẠY", "156 kcal"], image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", priceM: "55", priceL: "65", nutritionM: { calo: 156, sugar: 32, fiber: 3.0, protein: 0.5, vitc: 45 }, nutritionL: { calo: 195, sugar: 40, fiber: 3.8, protein: 0.7, vitc: 56 }
    },
    {
        id: "p4", category: "TRÀ TRÁI CÂY", name: "Trà Xoài Chanh Dây", ingredients: "Xoài, Chanh dây", desc: "Vị chua ngọt bùng nổ, cực kỳ giải khát cho ngày nắng.", longDesc: "Xoài cát cát xay nhuyễn cùng nước cốt chanh dây tươi (giữ hạt). Vị chua ngọt đậm đà, uống tới đâu tỉnh tới đó.", tags: ["BÁN CHẠY", "163 kcal"], image: "https://images.unsplash.com/photo-1546173159-315724a31696?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", priceM: "55", priceL: "65", nutritionM: { calo: 163, sugar: 35, fiber: 2.5, protein: 1.2, vitc: 80 }, nutritionL: { calo: 204, sugar: 44, fiber: 3.1, protein: 1.5, vitc: 100 }
    },
    {
        id: "p5", category: "TRÀ TRÁI CÂY", name: "Trà Mãng Cầu Tắc Dứa", ingredients: "Mãng cầu, Tắc, Dứa", desc: "Sự kết hợp độc đáo của 3 loại trái cây nhiệt đới.", longDesc: "Mãng cầu xiêm dằm nhuyễn, thơm (dứa) ép lấy nước và điểm xuyết hương tắc thơm lừng. Rất kích thích vị giác.", tags: ["ĐẶC TRƯNG", "171 kcal"], image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", priceM: "55", priceL: "65", nutritionM: { calo: 171, sugar: 34, fiber: 4.2, protein: 1.0, vitc: 85 }, nutritionL: { calo: 215, sugar: 42, fiber: 5.2, protein: 1.3, vitc: 106 }
    },
    {
        id: "p6", category: "TRÀ TRÁI CÂY", name: "Trà Lựu Dâu Hibiscus", ingredients: "Lựu, Dâu, Hibiscus", desc: "Màu đỏ đẹp mắt, vị chua thanh, giàu chất chống oxy hóa.", longDesc: "Nước ép lựu đỏ nguyên chất hòa quyện cùng dâu tây tươi và trà hoa Hibiscus chua nhẹ. Cực kỳ tốt cho làn da.", tags: ["MỚI", "134 kcal"], image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", priceM: "55", priceL: "65", nutritionM: { calo: 134, sugar: 28, fiber: 2.0, protein: 0.5, vitc: 65 }, nutritionL: { calo: 168, sugar: 35, fiber: 2.5, protein: 0.6, vitc: 81 }
    },
    {
        id: "p7", category: "TRÀ TRÁI CÂY", name: "Trà Bưởi Chanh Vàng", ingredients: "Bưởi, Chanh vàng", desc: "Phiên bản thanh nhẹ, ít calo nhất menu.", longDesc: "Chỉ sử dụng chanh vàng Mỹ thơm dịu không đắng và tép bưởi tươi. Rất phù hợp cho người đang kiểm soát cân nặng.", tags: ["ÍT CALO", "118 kcal"], image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", priceM: "55", priceL: "65", nutritionM: { calo: 118, sugar: 22, fiber: 1.8, protein: 0.4, vitc: 110 }, nutritionL: { calo: 148, sugar: 28, fiber: 2.2, protein: 0.5, vitc: 135 }
    },
    
    // Smoothie (5 món)
    {
        id: "p8", category: "SMOOTHIE", name: "Smoothie Thanh Long Xoài", ingredients: "Thanh long, xoài", desc: "Màu sắc rực rỡ và hương vị thanh mát.", longDesc: "Thanh long ruột đỏ mix cùng xoài chín mọng, tạo nên ly smoothie dẻo mịn và màu sắc tuyệt đẹp.", tags: ["MỚI", "210 kcal"], image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", priceM: "65", priceL: "75", nutritionM: { calo: 210, sugar: 38, fiber: 4.5, protein: 3.5, vitc: 60 }, nutritionL: { calo: 260, sugar: 48, fiber: 5.5, protein: 4.5, vitc: 75 }
    },
    {
        id: "p9", category: "SMOOTHIE", name: "Smoothie Bơ Chuối", ingredients: "Bơ, chuối", desc: "Sinh tố béo ngậy, no lâu cho một buổi sáng đầy năng lượng.", longDesc: "Bơ sáp loại 1 kết hợp với chuối sứ chín muồi. Thơm béo ngậy mà không hề thêm sữa đặc, vị béo hoàn toàn tự nhiên.", tags: ["BÁN CHẠY", "280 kcal"], image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", priceM: "65", priceL: "75", nutritionM: { calo: 280, sugar: 25, fiber: 6.0, protein: 4.0, vitc: 20 }, nutritionL: { calo: 350, sugar: 32, fiber: 7.5, protein: 5.0, vitc: 25 }
    },
    {
        id: "p10", category: "SMOOTHIE", name: "Smoothie Thanh Long Dâu", ingredients: "Thanh long, dâu", desc: "Bùng nổ vị chua ngọt tươi mát.", longDesc: "Thanh long đỏ và dâu tây đông lạnh xay mịn màng. Cực nhiều vitamin và chất chống oxy hóa.", tags: ["ĐẶC TRƯNG", "225 kcal"], image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", priceM: "85", priceL: "95", nutritionM: { calo: 225, sugar: 35, fiber: 5.0, protein: 3.0, vitc: 85 }, nutritionL: { calo: 280, sugar: 44, fiber: 6.2, protein: 3.8, vitc: 106 }
    },
    {
        id: "p11", category: "SMOOTHIE", name: "Smoothie Chuối Dâu Xoài", ingredients: "Chuối, dâu, xoài", desc: "Ba hương vị nhiệt đới hòa quyện.", longDesc: "Sự kết hợp hoàn hảo của chuối béo ngọt, dâu chua thanh và xoài thơm lừng.", tags: ["BÁN CHẠY", "240 kcal"], image: "https://images.unsplash.com/photo-1546173159-315724a31696?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", priceM: "85", priceL: "95", nutritionM: { calo: 240, sugar: 40, fiber: 4.8, protein: 3.2, vitc: 70 }, nutritionL: { calo: 300, sugar: 50, fiber: 6.0, protein: 4.0, vitc: 88 }
    },
    {
        id: "p12", category: "SMOOTHIE", name: "Smoothie Chuối & Các Loại Berry", ingredients: "Chuối & berry", desc: "Lớp nền chuối béo ngọt ôm lấy vị chua nhẹ của quả mọng.", longDesc: "Chuối sứ mềm ngọt giúp làm dịu vị chua gắt của việt quất và mâm xôi, tạo thành món uống bổ dưỡng giàu chất xơ.", tags: ["SIGNATURE", "235 kcal"], image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", priceM: "85", priceL: "95", nutritionM: { calo: 235, sugar: 36, fiber: 5.5, protein: 3.5, vitc: 65 }, nutritionL: { calo: 295, sugar: 45, fiber: 6.8, protein: 4.4, vitc: 81 }
    },

    // Sữa Chua (5 món)
    {
        id: "p13", category: "SỮA CHUA", name: "Sữa Chua Chuối Xoài Bơ", ingredients: "Chuối, xoài, bơ", desc: "Sữa chua siêu béo và mịn màng.", longDesc: "Sự kết hợp giữa sữa chua lên men, chuối ngọt, xoài thơm và bơ béo ngậy.", tags: ["MỚI", "245 kcal"], image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", priceM: "55", priceL: "65", nutritionM: { calo: 245, sugar: 32, fiber: 4.0, protein: 6.0, vitc: 40 }, nutritionL: { calo: 305, sugar: 40, fiber: 5.0, protein: 7.5, vitc: 50 }
    },
    {
        id: "p14", category: "SỮA CHUA", name: "Sữa Chua Thanh Long Bưởi Xoài", ingredients: "Thanh long, bưởi, xoài", desc: "Hương vị thanh mát giải nhiệt hoàn hảo.", longDesc: "Lợi khuẩn từ sữa chua cộng với vitamin từ thanh long, bưởi và xoài.", tags: ["THANH LỌC", "190 kcal"], image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", priceM: "55", priceL: "65", nutritionM: { calo: 190, sugar: 30, fiber: 3.5, protein: 5.5, vitc: 75 }, nutritionL: { calo: 235, sugar: 38, fiber: 4.4, protein: 6.8, vitc: 94 }
    },
    {
        id: "p15", category: "SỮA CHUA", name: "Sữa Chua Chuối Nho Xanh", ingredients: "Chuối, nho xanh", desc: "Vị giòn sần sật từ quả nho tươi mát.", longDesc: "Sữa chua mềm mịn với chuối và nho xanh tạo sự tương phản trong kết cấu nhai.", tags: ["ÍT NGỌT", "210 kcal"], image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", priceM: "55", priceL: "65", nutritionM: { calo: 210, sugar: 34, fiber: 3.0, protein: 5.8, vitc: 35 }, nutritionL: { calo: 260, sugar: 42, fiber: 3.8, protein: 7.2, vitc: 44 }
    },
    {
        id: "p16", category: "SỮA CHUA", name: "Sữa Chua Dâu Táo Kiwi", ingredients: "Dâu, táo, kiwi", desc: "Sữa chua lên men tự nhiên với mix 3 loại trái cây.", longDesc: "Sữa chua nhà làm sánh mịn, chua dịu kết hợp cùng mứt dâu, táo giòn và kiwi tươi chua ngọt.", tags: ["BÁN CHẠY", "198 kcal"], image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", priceM: "65", priceL: "75", nutritionM: { calo: 198, sugar: 36, fiber: 3.5, protein: 5.2, vitc: 55 }, nutritionL: { calo: 248, sugar: 45, fiber: 4.4, protein: 6.5, vitc: 68 }
    },
    {
        id: "p17", category: "SỮA CHUA", name: "Sữa Chua Các Loại Berry", ingredients: "Các loại berry", desc: "Đậm đà hương vị quả mọng, chua ngọt kích thích.", longDesc: "Mix 3 loại quả mọng: Việt quất, mâm xôi, dâu tây được nấu thành mứt nhẹ, ăn kèm sữa chua beo béo cực ghiền.", tags: ["ĐẶC TRƯNG", "187 kcal"], image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", priceM: "65", priceL: "75", nutritionM: { calo: 187, sugar: 34, fiber: 4.0, protein: 5.5, vitc: 70 }, nutritionL: { calo: 235, sugar: 42, fiber: 5.0, protein: 6.8, vitc: 88 }
    }
];

async function seedDatabase() {
    const statusText = document.getElementById('status');
    try {
        statusText.innerHTML = "Đang đẩy sản phẩm...";
        for (const product of products) {
            await setDoc(doc(db, "products", product.id), product);
        }

        statusText.innerHTML = "Đang đẩy đánh giá...";
        let i = 1;
        for (const review of reviews) {
            await setDoc(doc(db, "reviews", `r${i}`), review);
            i++;
        }
        
        statusText.innerHTML = "Đồng bộ thành công! Bạn có thể đóng trang này và làm mới trang chủ.";
        statusText.style.color = "green";
    } catch (e) {
        console.error("Lỗi đồng bộ:", e);
        statusText.innerHTML = "Đồng bộ thất bại. Vui lòng xem Console để biết chi tiết lỗi (Có thể do bạn chưa bật quyền ghi trên Firebase).";
        statusText.style.color = "red";
    }
}

seedDatabase();
