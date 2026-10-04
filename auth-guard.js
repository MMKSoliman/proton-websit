document.addEventListener("DOMContentLoaded", function() {
    const currentPath = window.location.pathname;
    
    // إذا كنا في صفحة الدخول أو الرئيسية العامة، لا تفعل شيئاً
    if (currentPath.includes("auth.html") || currentPath.includes("index.html") || currentPath === "/") {
        return;
    }

    // فحص التوكن بالاحتمالين لضمان عدم ضياعه
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");
    
    if (!token) {
        // إذا لم يكن مسجلاً، يتم توجيهه لصفحة الدخول مرة واحدة فقط
        window.location.href = "./auth.html?next=" + encodeURIComponent(currentPath);
        return;
    }

    // التحقق من صحة التوكن مع الخادم بهدوء دون الدخول في لوب
    fetch("https://api.protonag.com/accounts/me", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (response.status === 401) {
            // التوكن منتهي أو غير صالح حقاً
            localStorage.removeItem("access_token");
            localStorage.removeItem("token");
            window.location.href = "./auth.html";
        } else if (response.ok) {
            return response.json();
        }
    })
    .then(data => {
        if (data) {
            if (document.getElementById("full_name")) {
                document.getElementById("full_name").textContent = data.full_name || "مستخدم";
            }
            if (document.getElementById("user-avatar") && data.profile_picture) {
                document.getElementById("user-avatar").src = data.profile_picture;
            }
        }
    })
    .catch(error => {
        console.warn("Auth check network warning:", error);
        // لا تقم بإعادة التوجيه عند حدوث خطأ في الشبكة لكي لا ندخل في لوب!
    });
});
