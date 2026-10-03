document.addEventListener("DOMContentLoaded", function() {
    // 1. جلب بيانات المستخدم من الباك إند لتعبئة الاسم والصورة
    fetch("https://api.protonag.com/auth/me", {
        method: "GET",
        credentials: "include" // مهم لإرسال الكوكي الآمنة
    })
    .then(response => {
        if (!response.ok) {
            // لو غير مسجل دخول، يتم توجيهه لتسجيل الدخول مع حفظ الرابط الحالي في الـ next
            const currentUrl = window.location.href;
            window.location.href = `https://protonag.com/login.html?next=${encodeURIComponent(currentUrl)}`;
            throw new Error("Not authenticated");
        }
        return response.json();
    })
    .then(data => {
        // تعبئة الاسم والصورة الحقيقيين القادمين من فيسبوك أو جوجل أو الداتا
        if(document.getElementById("user-name")) {
            document.getElementById("user-name").textContent = data.full_name;
        }
        if(document.getElementById("user-avatar") && data.profile_picture) {
            document.getElementById("user-avatar").src = data.profile_picture;
        }
    })
    .catch(error => console.error("Auth check failed:", error));

    // 2. تفعيل إظهار وإخفاء القائمة المنسدلة عند الضغط على الصورة/الاسم
    const trigger = document.getElementById("user-profile-trigger");
    const menu = document.getElementById("user-dropdown-menu");

    if (trigger && menu) {
        trigger.addEventListener("click", function(e) {
            e.stopPropagation();
            menu.style.display = menu.style.display === "block" ? "none" : "block";
        });

        // إغلاق القائمة عند الضغط في أي مكان خارجها
        document.addEventListener("click", function() {
            menu.style.display = "none";
        });
    }

    // 3. برمجة زر تسجيل الخروج
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function(e) {
            e.preventDefault();
            // مسح الكوكي أو طلب مسار تسجيل الخروج من الباك إند
            document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=protonag.com;";
            window.location.href = "https://protonag.com/login.html";
        });
    }
});