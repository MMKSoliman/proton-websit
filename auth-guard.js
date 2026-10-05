// auth-guard.js - ملف التحقق المركزي لحماية الصفحات ومنع اللوب
document.addEventListener("DOMContentLoaded", function() {
    const currentPath = window.location.pathname;
    
    // إذا كنا في صفحة تسجيل الدخول أو الرئيسية العامة، لا تفعل شيئاً
    if (currentPath.includes("auth.html") || currentPath.includes("index.html") || currentPath === "/") {
        return;
    }

    // البحث عن التوكن
    const token = localStorage.getItem("access_token");
    
    // إذا لم يكن هناك توكن، نوجهه لصفحة الدخول مرة واحدة فقط وبشروط تمنع التكرار (تمنع اللوب)
    if (!token) {
        if (!sessionStorage.getItem("redirected_to_auth")) {
            sessionStorage.setItem("redirected_to_auth", "true");
            window.location.href = "./auth.html";
        }
        return;
    } else {
        // إذا وجدنا توكن، نمسح علامة التحويل لعمل الموقع بسلاسة
        sessionStorage.removeItem("redirected_to_auth");
    }

    // التحقق الهادئ من بيانات المستخدم دون عمل ريفريش أو لوب عند الخطأ
    fetch("https://api.protonag.com/accounts/me", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (response.status === 401) {
            // التوكن منتهي الصلاحية حقاً، نمسحه ونوجهه لصفحة الدخول مرة واحدة
            localStorage.removeItem("access_token");
            window.location.href = "./auth.html";
            return;
        }
        if (response.ok) {
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
        console.warn("Auth check warning:", error);
        // تم منع أي توجيه عشوائي هنا لمنع حدوث اللوب تماماً
    });
});
