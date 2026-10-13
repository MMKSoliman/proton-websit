<script>
document.addEventListener("DOMContentLoaded", function() {
    // إزالة أي سايدبار قديم تقليدي لتجنب التداخل
    document.querySelectorAll('aside:not(#floating-sidebar), .sidebar').forEach(el => el.remove());

    const sleekSidebar = `
    <aside id="floating-sidebar" style="position: fixed; right: 16px; top: 16px; bottom: 16px; width: 280px; background: rgba(18, 18, 20, 0.75); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); display: flex; flex-direction: column; z-index: 9999; padding: 20px; font-family: inherit; direction: rtl;">
        <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; align-items: center; justify-content: space-between;">
            <span style="color: #ffffff; font-weight: bold; font-size: 16px;">لوحة التحكم</span>
            <span style="width: 8px; height: 8px; background: #22d3ee; border-radius: 50%; box-shadow: 0 0 10px rgba(34,211,238,0.8);"></span>
        </div>
        <nav style="flex: 1; display: flex; flex-direction: column; gap: 12px; overflow-y: auto;">
            <a href="connect-social.html" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; color: #ffffff; text-decoration: none; font-size: 14px; transition: all 0.3s;">
                <span>إدارة المنصات</span>
                <span style="width: 6px; height: 6px; background: #22d3ee; border-radius: 50%;"></span>
            </a>
        </nav>
        <div style="margin-top: auto; padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.1); display: flex; flex-direction: column; gap: 10px;">
            <div style="padding: 10px; background: rgba(34, 211, 238, 0.05); border: 1px solid rgba(34, 211, 238, 0.15); border-radius: 10px; text-align: center;">
                <span style="font-size: 11px; color: #22d3ee; display: block; font-weight: 600;">الباقة الحالية</span>
                <span style="font-size: 13px; color: #ffffff; font-weight: bold;">شهرياً</span>
            </div>
            <button style="width: 100%; padding: 10px; border: none; border-radius: 10px; background: linear-gradient(135deg, #06b6d4, #3b82f6); color: #ffffff; font-weight: 600; font-size: 13px; cursor: pointer; box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);">ترقية الآن</button>
        </div>
    </aside>`;
    document.body.insertAdjacentHTML('beforeend', sleekSidebar);
    
    // إضافة مسافة يسار/يمين للمحتوى الرئيسي لكي لا يختفي تحته
    if(document.body.firstElementChild) {
        document.body.style.paddingRight = "310px";
    }
});
</script>
