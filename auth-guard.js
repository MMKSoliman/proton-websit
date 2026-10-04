document.addEventListener("DOMContentLoaded", function() {
    // تحقق إذا كنا في صفحة تسجيل الدخول بالفعل، فلا تفعل شيئاً لتجنب التكرار
    if (window.location.pathname.includes("login.html")) {
        return;
    }

    fetch("https://api.protonag.com/auth/me", {
        method: "GET",
        credentials: "include"
    })
    .then(response => {
        if (!response.ok) {
            // توجيه لصفحة تسجيل الدخول مرة واحدة فقط
            window.location.href = "https://protonag.com/login.html?next=" + encodeURIComponent(window.location.pathname);
            throw new Error("Not authenticated");
        }
        return response.json();
    })
    .then(data => {
        if(document.getElementById("user-name")) {
            document.getElementById("user-name").textContent = data.full_name || "مستخدم";
        }
        if(document.getElementById("user-avatar") && data.profile_picture) {
            document.getElementById("user-avatar").src = data.profile_picture;
        }
    })
    .catch(error => console.error("Auth error:", error));
        // احتياطياً، لو حدث خطأ في الاتصال بالسيرفر أو التحقق، يمكنك توجيهه للوجين
        // window.location.href = "https://protonag.com/auth.html";
    });

    // تفعيل القائمة المنسدلة
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

    // زر تسجيل الخروج
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function(e) {
            e.preventDefault();
            document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=protonag.com;";
            window.location.href = "https://protonag.com/auth.html";
        });
    }
});
