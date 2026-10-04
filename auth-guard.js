document.addEventListener("DOMContentLoaded", function() {
    // 1. إذا كنا في صفحة تسجيل الدخول أو الرئيسية العامة، لا تقم بإعادة التوجيه
    const currentPath = window.location.pathname;
    if (currentPath.includes("auth.html") || currentPath.includes("index.html") || currentPath === "/") {
        return;
    }

    // 2. التحقق من وجود التوكن محلياً للحماية السريعة
    const token = localStorage.getItem("access_token") || localStorage.getItem("access_token");
    if (!token) {
        // إذا لم يكن مسجلاً، يتم توجيهه لصفحة الدخول مرة واحدة فقط مع حفظ الرابط الحالي للعودة إليه لاحقاً
        window.location.href = "./auth.html?next=" + encodeURIComponent(currentPath);
        return;
    }

    // ملاحظة: تم الاعتماد على ملف header.js المركزي لجلب بيانات المستخدم والتحقق من صلاحية التوكن 
    // لمنع حدوث أي تعارض أو طلبات مكررة تنشئ لوب إعادة التوجيه.
});
