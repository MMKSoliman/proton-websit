document.addEventListener("DOMContentLoaded", function() {
    // إزالة أي سايدبار قديم تقليدي لتجنب التداخل
    document.querySelectorAll('aside:not(#floating-sidebar), .sidebar').forEach(el => el.remove());

    const sleekSidebar = document.createElement('aside');
    sleekSidebar.id = 'floating-sidebar';
    
    // تطبيق التصميم الزجاجي المتناسق مع هوية بروتون
    Object.assign(sleekSidebar.style, {
        position: 'fixed',
        right: '16px',
        top: '16px',
        bottom: '16px',
        width: '280px',
        background: 'rgba(13, 17, 23, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(0, 229, 255, 0.2)',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: '9999',
        padding: '20px',
        fontFamily: "'Cairo', sans-serif",
        direction: 'rtl',
        color: '#ffffff',
        transition: 'all 0.3s ease-in-out'
    });

    sleekSidebar.innerHTML = `
        <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; align-items: center; justify-content: space-between;">
            <span style="color: #ffffff; font-weight: 800; font-size: 16px;">لوحة التحكم</span>
            <span style="width: 8px; height: 8px; background: #00e5ff; border-radius: 50%; box-shadow: 0 0 10px rgba(0,229,255,0.8);"></span>
        </div>
        <nav style="flex: 1; display: flex; flex-direction: column; gap: 12px; overflow-y: auto;">
            <a href="connect-social.html" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: rgba(0, 229, 255, 0.05); border: 1px solid rgba(0, 229, 255, 0.15); border-radius: 12px; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; transition: all 0.3s;">
                <span>إدارة المنصات</span>
                <span style="width: 6px; height: 6px; background: #00e5ff; border-radius: 50%;"></span>
            </a>
        </nav>
        <div style="margin-top: auto; padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.1); display: flex; flex-direction: column; gap: 10px;">
            <div style="padding: 10px; background: rgba(0, 229, 255, 0.05); border: 1px solid rgba(0, 229, 255, 0.15); border-radius: 10px; text-align: center;">
                <span style="font-size: 11px; color: #00e5ff; display: block; font-weight: 600;">الباقة الحالية</span>
                <span style="font-size: 13px; color: #ffffff; font-weight: bold;">شهرياً</span>
            </div>
            <button style="width: 100%; padding: 10px; border: none; border-radius: 10px; background: linear-gradient(135deg, #00e5ff, #0088ff); color: #ffffff; font-weight: 800; font-size: 13px; cursor: pointer; box-shadow: 0 4px 12px rgba(0, 229, 255, 0.3); transition: transform 0.2s;">ترقية الآن</button>
        </div>
    `;

    document.body.appendChild(sleekSidebar);
    
    // إضافة مسافة للمحتوى الرئيسي لكي لا يختفي تحته في الشاشات الكبيرة
    if (window.innerWidth > 992) {
        document.body.style.paddingRight = "310px";
    }
});
