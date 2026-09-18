import { db } from "./firebase-config.js";
import { collection, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const reviews = [
    { name: "Minh Tuấn", date: "22/08/2026", rating: 5, image: null, text: "Nước ngon xỉu, trà trái cây rất fresh, k bị gắt đường. Đóng gói chỉn chu, 10đ nhé mng!" },
    { name: "Lan Ngọc", date: "15/08/2026", rating: 5, image: null, text: "Sữa chua ở đây làm đỉnh thực sự, chua dịu ăn k bị ngấy. Sẽ ủng hộ shop dài dài." },
    { name: "Hoàng Phong", date: "10/08/2026", rating: 4, image: null, text: "Smoothie bơ chuối béo ngậy mlem mlem, tuy nhiên shipper giao hơi lâu tí." },
    { name: "Thảo Vy", date: "05/08/2026", rating: 5, image: null, text: "Trà cam bưởi cực cuốn lunnn, múi bưởi to đùng mà kbiet sao k bị đắng. Mình hay gọi hẳn size L." },
    { name: "Đức Tài", date: "02/08/2026", rating: 3, image: null, text: "Cũng bthg thui, mình gọi 50% đường mà uống vẫn hơi ngọt, chắc mng nên gọi 25% th là vừa." },
    { name: "Khánh Linh", date: "28/07/2026", rating: 5, image: null, text: "Ưng cái là cho tuỳ chỉnh đường đá, đồ uống healthy đúng gu tui." },
    { name: "Tuấn Anh", date: "20/07/2026", rating: 4, image: null, text: "Nước ok nma quán đông quá đii, chờ hơi lâu á." },
    { name: "Mai Trang", date: "15/07/2026", rating: 5, image: null, text: "Trà dâu tây dính vl =))) dâu nhiều mà tươi roi rói, recommended mng nha" },
    { name: "Bảo Nhi", date: "10/07/2026", rating: 5, image: null, text: "Trà khế nho xanh mới ra uống đã phết, lạ miệng mà thanh mát, giá cũng ổn." },
    { name: "Quốc Hưng", date: "08/07/2026", rating: 5, image: null, text: "Đồ uống xịn, cốc đẹp, view quán cũng chill nữa. Nói chung là 10/10." },
    { name: "Phương Linh", date: "05/07/2026", rating: 4, image: null, text: "Món mãng cầu tắc dứa ngon nè, uống tỉnh cả người, nma hơi nhiều đá" },
    { name: "Thanh Hải", date: "01/07/2026", rating: 5, image: null, text: "Đã thử cả 3 dòng trà, sữa chua vs smoothie thì kết smoothie nhất, đặc nín và thơm cực." }
];

const products = [
    // Trà Trái Cây (7 món)
    {
        id: "p1", category: "TRÀ TRÁI CÂY", name: "Thanh Nho Hạ", ingredients: "Khế, nho xanh", desc: "Hương vị chua chua ngọt dịu tươi mới.", longDesc: "Trà Khế Nho Xanh mang đến sự kết hợp độc đáo giữa vị chua nhẹ của khế và ngọt thanh của nho xanh.", tags: ["MỚI", "34 kcal"], image: "images/products/khenhoxanh.png", priceM: "55", priceL: "65", nutritionM: { calo: 34, protein: 0.6, carbs: 8.3, fat: 0.2 }, nutritionL: { calo: 48, protein: 0.9, carbs: 11.6, fat: 0.3 }
    },
    {
        id: "p2", category: "TRÀ TRÁI CÂY", name: "Thanh Citrus", ingredients: "Cam, bưởi", desc: "Cặp đôi họ cam quýt kinh điển, nhiều vitamin C nhất menu.", longDesc: "Cam vàng vắt tay lấy nước, bưởi da xanh tách tép nguyên múi thả vào ly. Trà ô long nhẹ hương giữ cho vị bưởi không bị đắng.", tags: ["BÁN CHẠY", "31 kcal"], image: "images/products/cambuoi.png", priceM: "55", priceL: "65", nutritionM: { calo: 31, protein: 0.6, carbs: 7.7, fat: 0.0 }, nutritionL: { calo: 44, protein: 0.9, carbs: 11.1, fat: 0.1 }
    },
    {
        id: "p3", category: "TRÀ TRÁI CÂY", name: "Thanh Đào Mộng", ingredients: "Mận, đào", desc: "Hương vị mùa hè rực rỡ với mận Hà Nội và đào tươi.", longDesc: "Mận hậu chua thanh kết hợp cùng đào miếng giòn ngọt. Nước cốt trà lài nhẹ nhàng tôn lên hương trái cây nguyên bản.", tags: ["BÁN CHẠY", "31 kcal"], image: "images/products/mandao.png", priceM: "55", priceL: "65", nutritionM: { calo: 31, protein: 0.6, carbs: 7.6, fat: 0.2 }, nutritionL: { calo: 44, protein: 0.8, carbs: 10.8, fat: 0.3 }
    },
    {
        id: "p4", category: "TRÀ TRÁI CÂY", name: "Thanh Xoài Chanh", ingredients: "Xoài, chanh dây", desc: "Vị chua ngọt bùng nổ, cực kỳ giải khát cho ngày nắng.", longDesc: "Xoài cát cát xay nhuyễn cùng nước cốt chanh dây tươi (giữ hạt). Vị chua ngọt đậm đà, uống tới đâu tỉnh tới đó.", tags: ["BÁN CHẠY", "56 kcal"], image: "images/products/xoaichanhday.png", priceM: "55", priceL: "65", nutritionM: { calo: 56, protein: 1.1, carbs: 13.5, fat: 0.4 }, nutritionL: { calo: 80, protein: 1.5, carbs: 19.4, fat: 0.6 }
    },
    {
        id: "p5", category: "TRÀ TRÁI CÂY", name: "Thanh Cầu Tuyết", ingredients: "Mãng cầu", desc: "Sự kết hợp độc đáo của 3 loại trái cây nhiệt đới.", longDesc: "Mãng cầu xiêm dằm nhuyễn, thơm (dứa) ép lấy nước và điểm xuyết hương tắc thơm lừng. Rất kích thích vị giác.", tags: ["ĐẶC TRƯNG", "47 kcal"], image: "images/products/mangcau.png", priceM: "55", priceL: "65", nutritionM: { calo: 47, protein: 0.7, carbs: 12.0, fat: 0.2 }, nutritionL: { calo: 68, protein: 1.0, carbs: 17.2, fat: 0.3 }
    },
    {
        id: "p6", category: "TRÀ TRÁI CÂY", name: "Thanh Lựu Mơ", ingredients: "Lựu, dâu, hibiscus", desc: "Màu đỏ đẹp mắt, vị chua thanh, giàu chất chống oxy hóa.", longDesc: "Nước ép lựu đỏ nguyên chất hòa quyện cùng dâu tây tươi và trà hoa Hibiscus chua nhẹ. Cực kỳ tốt cho làn da.", tags: ["MỚI", "49 kcal"], image: "images/products/luudauhibicus.png", priceM: "55", priceL: "65", nutritionM: { calo: 49, protein: 1.0, carbs: 11.1, fat: 0.7 }, nutritionL: { calo: 70, protein: 1.4, carbs: 15.8, fat: 0.9 }
    },
    {
        id: "p7", category: "TRÀ TRÁI CÂY", name: "Thanh Bưởi Sương", ingredients: "Bưởi, chanh vàng", desc: "Phiên bản thanh nhẹ, ít calo nhất menu.", longDesc: "Chỉ sử dụng chanh vàng Mỹ thơm dịu không đắng và tép bưởi tươi. Rất phù hợp cho người đang kiểm soát cân nặng.", tags: ["ÍT CALO", "27 kcal"], image: "images/products/buoichanhvang.png", priceM: "55", priceL: "65", nutritionM: { calo: 27, protein: 0.6, carbs: 6.9, fat: 0.0 }, nutritionL: { calo: 39, protein: 0.8, carbs: 9.9, fat: 0.0 }
    },
    
    // Smoothie (5 món)
    {
        id: "p8", category: "SMOOTHIE", name: "Thanh Xoài Pink", ingredients: "Thanh long, xoài", desc: "Màu sắc rực rỡ và hương vị thanh mát.", longDesc: "Thanh long ruột đỏ mix cùng xoài chín mọng, tạo nên ly smoothie dẻo mịn và màu sắc tuyệt đẹp.", tags: ["MỚI", "81 kcal"], image: "images/products/xoaithanhlong.png", priceM: "65", priceL: "75", nutritionM: { calo: 81, protein: 2.7, carbs: 16.5, fat: 0.9 }, nutritionL: { calo: 119, protein: 3.9, carbs: 24.5, fat: 1.3 }
    },
    {
        id: "p9", category: "SMOOTHIE", name: "Thanh Bơ Mịn", ingredients: "Bơ, chuối", desc: "Sinh tố béo ngậy, no lâu cho một buổi sáng đầy năng lượng.", longDesc: "Bơ sáp loại 1 kết hợp với chuối sứ chín muồi. Thơm béo ngậy mà không hề thêm sữa đặc, vị béo hoàn toàn tự nhiên.", tags: ["BÁN CHẠY", "122 kcal"], image: "images/products/bochuoi.png", priceM: "65", priceL: "75", nutritionM: { calo: 122, protein: 3.0, carbs: 18.7, fat: 5.1 }, nutritionL: { calo: 198, protein: 4.5, carbs: 30.6, fat: 8.3 }
    },
    {
        id: "p10", category: "SMOOTHIE", name: "Thanh Dâu Mộng", ingredients: "Thanh long, dâu", desc: "Bùng nổ vị chua ngọt tươi mát.", longDesc: "Thanh long đỏ và dâu tây đông lạnh xay mịn màng. Cực nhiều vitamin và chất chống oxy hóa.", tags: ["ĐẶC TRƯNG", "73 kcal"], image: "images/products/dauthanhlong.png", priceM: "85", priceL: "95", nutritionM: { calo: 73, protein: 2.8, carbs: 13.9, fat: 0.9 }, nutritionL: { calo: 105, protein: 3.9, carbs: 20.4, fat: 1.2 }
    },
    {
        id: "p11", category: "SMOOTHIE", name: "Thanh Mướt", ingredients: "Chuối, dâu, xoài", desc: "Ba hương vị nhiệt đới hòa quyện.", longDesc: "Sự kết hợp hoàn hảo của chuối béo ngọt, dâu chua thanh và xoài thơm lừng.", tags: ["BÁN CHẠY", "83 kcal"], image: "images/products/chuoidauxoai.png", priceM: "85", priceL: "95", nutritionM: { calo: 83, protein: 2.6, carbs: 18.0, fat: 0.8 }, nutritionL: { calo: 124, protein: 3.7, carbs: 27.4, fat: 1.2 }
    },
    {
        id: "p12", category: "SMOOTHIE", name: "Thanh Berry bốn mùa", ingredients: "Chuối & các loại berry", desc: "Lớp nền chuối béo ngọt ôm lấy vị chua nhẹ của quả mọng.", longDesc: "Chuối sứ mềm ngọt giúp làm dịu vị chua gắt của việt quất và mâm xôi, tạo thành món uống bổ dưỡng giàu chất xơ.", tags: ["SIGNATURE", "98 kcal"], image: "images/products/chuoiberry.png", priceM: "85", priceL: "95", nutritionM: { calo: 98, protein: 2.8, carbs: 22.1, fat: 0.8 }, nutritionL: { calo: 147, protein: 4.0, carbs: 33.4, fat: 1.1 }
    },

    // Sữa Chua (5 món)
    {
        id: "p13", category: "SỮA CHUA", name: "Thanh Bơ Vàng", ingredients: "Chuối, xoài, bơ", desc: "Sữa chua siêu béo và mịn màng.", longDesc: "Sự kết hợp giữa sữa chua lên men, chuối ngọt, xoài thơm và bơ béo ngậy.", tags: ["MỚI", "122 kcal"], image: "images/products/chuoixoaibo.png", priceM: "55", priceL: "65", nutritionM: { calo: 122, protein: 4.3, carbs: 16.9, fat: 5.0 }, nutritionL: { calo: 183, protein: 6.4, carbs: 23.9, fat: 8.2 }
    },
    {
        id: "p14", category: "SỮA CHUA", name: "Thanh Bưởi Hồng", ingredients: "Thanh long, bưởi, xoài", desc: "Hương vị thanh mát giải nhiệt hoàn hảo.", longDesc: "Lợi khuẩn từ sữa chua cộng với vitamin từ thanh long, bưởi và xoài.", tags: ["THANH LỌC", "99 kcal"], image: "images/products/thanhlongbuoixoai.png", priceM: "55", priceL: "65", nutritionM: { calo: 99, protein: 4.2, carbs: 13.6, fat: 3.5 }, nutritionL: { calo: 147, protein: 6.2, carbs: 20.2, fat: 5.3 }
    },
    {
        id: "p15", category: "SỮA CHUA", name: "Thanh Nho Mát", ingredients: "Chuối, nho xanh", desc: "Vị giòn sần sật từ quả nho tươi mát.", longDesc: "Sữa chua mềm mịn với chuối và nho xanh tạo sự tương phản trong kết cấu nhai.", tags: ["ÍT NGỌT", "117 kcal"], image: "images/products/chuoinho.png", priceM: "55", priceL: "65", nutritionM: { calo: 117, protein: 4.2, carbs: 19.2, fat: 3.5 }, nutritionL: { calo: 172, protein: 6.2, carbs: 28.0, fat: 5.2 }
    },
    {
        id: "p16", category: "SỮA CHUA", name: "Thanh Đa Sắc", ingredients: "Dâu, táo, kiwi", desc: "Sữa chua lên men tự nhiên với mix 3 loại trái cây.", longDesc: "Sữa chua nhà làm sánh mịn, chua dịu kết hợp cùng mứt dâu, táo giòn và kiwi tươi chua ngọt.", tags: ["BÁN CHẠY", "90 kcal"], image: "images/products/dautaokiwi.png", priceM: "65", priceL: "75", nutritionM: { calo: 90, protein: 3.9, carbs: 11.9, fat: 3.5 }, nutritionL: { calo: 135, protein: 5.9, carbs: 17.9, fat: 5.2 }
    },
    {
        id: "p17", category: "SỮA CHUA", name: "Thanh Berry Tươi", ingredients: "Các loại berry", desc: "Đậm đà hương vị quả mọng, chua ngọt kích thích.", longDesc: "Mix 3 loại quả mọng: Việt quất, mâm xôi, dâu tây được nấu thành mứt nhẹ, ăn kèm sữa chua beo béo cực ghiền.", tags: ["ĐẶC TRƯNG", "76 kcal"], image: "images/products/cacloaiberry.png", priceM: "65", priceL: "75", nutritionM: { calo: 76, protein: 3.8, carbs: 8.3, fat: 3.4 }, nutritionL: { calo: 116, protein: 5.8, carbs: 13.1, fat: 5.1 }
    }
];

async function seedDatabase() {
    const statusText = document.getElementById('status');
    try {
        // Đã comment phần đẩy sản phẩm để tránh ghi đè menu mà người dùng đã chỉnh sửa trên Firebase
        /*
        statusText.innerHTML = "Đang đẩy sản phẩm...";
        for (const product of products) {
            await setDoc(doc(db, "products", product.id), product);
        }
        */

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
