// auth-guard.js - الحارس الصارم لحماية الصفحات بدون أي تعارض
(async function() {
    // التقاط التوكن من الرابط إن وجد وتخزينه محلياً بشكل آمن داخل النطاق
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    if (tokenFromUrl) {
        localStorage.setItem("access_token", tokenFromUrl);
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    const currentPath = window.location.pathname;
    
    // الصفحات المستثناة التي لا تتطلب تسجيل دخول
    if (currentPath.includes("auth.html") || currentPath.includes("index.html") || currentPath.includes("privacy.html") || currentPath.includes("terms.html") || currentPath === "/") {
        return;
    }

    const token = localStorage.getItem("access_token");
    
    // 1. إذا لم يكن هناك توكن نهائياً، طرد مباشر وفوري لصفحة الدخول
    if (!token) {
        window.location.href = "./auth.html";
        return;
    }

    try {
        // 2. التحقق من صحة التوكن والبراند عبر الـ API بشكل متزامن
        const response = await fetch("https://api.protonag.com/auth/me", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        });

        // إذا كان التوكن منتهي أو غير صالح (401)
        if (response.status === 401) {
            localStorage.removeItem("access_token");
            window.location.href = "./auth.html";
            return;
        }

        if (!response.ok) {
            throw new Error("Failed to authenticate");
        }

        const data = await response.json();

        // 3. التحقق الصارم من وجود البراند (الـ Onboarding)
        if (data.has_brand === false && !currentPath.includes("onboarding.html")) {
            window.location.href = "./onboarding.html";
            return;
        }

        // تحديث بيانات الواجهة إن وجدت
        if (document.getElementById("full_name")) {
            document.getElementById("full_name").textContent = data.full_name || "مستخدم";
        }
        if (document.getElementById("user-avatar") && data.profile_picture) {
            document.getElementById("user-avatar").src = data.profile_picture;
        }

    } catch (error) {
        console.error("Auth guard error:", error);
        localStorage.removeItem("access_token");
        window.location.href = "./auth.html";
    }
})();
