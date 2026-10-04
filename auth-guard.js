document.addEventListener("DOMContentLoaded", function() {
    // 1. إذا كنا في صفحة تسجيل الدخول، لا تفعل شيئاً
    if (window.location.pathname.includes("auth.html")) {
        return;
    }

    // 2. جلب التوكن من التخزين المحلي
    const token = localStorage.getItem("access_token");
    if (!token) {
        // إذا لم يكن هناك توكن، توجه لصفحة تسجيل الدخول مرة واحدة فقط
        window.location.href = "https://protonag.com/auth.html?next=" + encodeURIComponent(window.location.pathname);
        return;
    }

    // 3. التحقق من صحة التوكن عبر جلب بيانات المستخدم
    fetch("https://api.protonag.com/accounts/me", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            // التوكن غير صالح أو انتهى، امسحه ووجهه للوجن
            localStorage.removeItem("access_token");
            window.location.href = "https://protonag.com/auth.html";
            throw new Error("Invalid token");
        }
        return response.json();
    })
    .then(data => {
        if (document.getElementById("full_name")) {
            document.getElementById("full_name").textContent = data.full_name || "مستخدم";
        }
        if (document.getElementById("user-avatar") && data.profile_picture) {
            document.getElementById("user-avatar").src = data.profile_picture;
        }
    })
    .catch(error => {
        console.warn("Auth check error:", error);
    });

    // 4. تفعيل القائمة المنسدلة للبروفايل
    const trigger = document.getElementById("user-profile-trigger");
    const menu = document.getElementById("user-dropdown-menu");

    if (trigger && menu) {
        trigger.addEventListener("click", function(e) {
            e.stopPropagation();
            menu.style.display = menu.style.display === "block" ? "none" : "block";
        });
        
        document.addEventListener("click", function() {
            menu.style.display = "none";
        });
    }

    // 5. زر تسجيل الخروج
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function(e) {
            e.preventDefault();
            localStorage.removeItem("access_token");
            window.location.href = "https://protonag.com/auth.html";
        });
    }
});
