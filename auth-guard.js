// auth-guard.js المعدل للتحقق من التوكن والبراند
document.addEventListener("DOMContentLoaded", function() {
    const currentPath = window.location.pathname;
    
    // استثناء صفحات تسجيل الدخول والرئيسية وملف الـ onboarding نفسه لمنع اللوب
    if (currentPath.includes("auth.html") || currentPath.includes("index.html") || currentPath.includes("onboarding.html") || currentPath === "/") {
        return;
    }

    const token = localStorage.getItem("access_token");
    
    if (!token) {
        if (!sessionStorage.getItem("redirected_to_auth")) {
            sessionStorage.setItem("redirected_to_auth", "true");
            window.location.href = "./auth.html";
        }
        return;
    } else {
        sessionStorage.removeItem("redirected_to_auth");
    }

    // التحقق من بيانات المستخدم والبراند عبر الـ API
    fetch("https://api.protonag.com/auth/me", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (response.status === 401) {
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
            // تحديث الواجهة بالاسم والصورة
            if (document.getElementById("full_name")) {
                document.getElementById("full_name").textContent = data.full_name || "مستخدم";
            }
            if (document.getElementById("user-avatar") && data.profile_picture) {
                document.getElementById("user-avatar").src = data.profile_picture;
            }

            // التحقق من وجود براند للمستخدم، وإذا لم يكن موجوداً يتم توجيهه لإتمام الـ Onboarding إجبارياً
            if (data.has_brand === false && !currentPath.includes("onboarding.html")) {
                window.location.href = "./onboarding.html";
            }
        }
    })
    .catch(error => {
        console.warn("Auth check warning:", error);
    });
});
