document.addEventListener("DOMContentLoaded", () => {
    fetch('footer.html')
        .then(res => res.text())
        .then(data => {
            const footer = document.getElementById('footer-container');
            if(footer) footer.innerHTML = data;
        });

    initDashboard();
});

// مصفوفة الوحدات والأيقونات (جاهزة ومجهزة لتضاف أي أيقونة جديدة تلقائياً)
const dashboardModules = [
    {
        id: 'performance',
        name: 'تقارير الأداء ونظرة عامة',
        icon: './home.webp', // تم توحيدها مؤقتاً لاسم home.webp
        render: () => `
            <div class="module-header-title">
                <img src="./home.webp" alt="Icon">
                <h2>تقارير الأداء ونظرة عامة</h2>
            </div>
            <div class="analytics-overview-card">
                <div class="analytics-grid">
                    <div class="metric-box">
                        <h4>المتابعين الحاليين</h4>
                        <p class="number">12,450</p>
                    </div>
                    <div class="metric-box">
                        <h4>المنشورات</h4>
                        <p class="number">148</p>
                    </div>
                    <div class="metric-box">
                        <h4>التعليقات التفاعلية</h4>
                        <p class="number">1,230</p>
                    </div>
                    <div class="metric-box">
                        <h4>الرسائل المُعالجة</h4>
                        <p class="number">850</p>
                    </div>
                    <div class="metric-box">
                        <h4>معدل النمو</h4>
                        <p class="number" style="color: #00ff88;">+18.4%</p>
                    </div>
                </div>

                <div class="neon-tip-box">
                    <span>💡</span>
                    <p><strong>توصية ذكية لتحسين الأداء:</strong> لوحظ زيادة التفاعل على منشورات الفيديو بين الساعة 7 و 9 مساءً؛ يُنصح بجدولة منشورات المنتجات الجديدة خلال هذه الفترة لرفع معدل التحويل.</p>
                </div>

                <div class="top-posts-section">
                    <h3>🔥 أعلى 3 منشورات تفاعلاً</h3>
                    <div class="posts-links-list">
                        <a href="#" class="post-link-item"><span>منشور إطلاق العون الجديد - تفاعل قياسي</span> <span>↗</span></a>
                        <a href="#" class="post-link-item"><span>فيديو توضيحي لمميزات المنتج الرئيسي</span> <span>↗</span></a>
                        <a href="#" class="post-link-item"><span>قصص نجاح العملاء والتقييمات</span> <span>↗</span></a>
                    </div>
                </div>
            </div>
        `
    },
    {
        id: 'brands',
        name: 'إدارة البراندات',
        icon: './home.webp',
        render: () => `
            <div class="module-header-title">
                <img src="./home.webp" alt="Icon">
                <h2>إدارة البراندات والهوية البصرية</h2>
            </div>
            <p>استعرض البراندات الخاصة بك، عدل الألوان، اللوجو، ونبرة الصوت بكل سهولة.</p>
            <button class="action-btn-primary" style="margin-top: 15px; background: linear-gradient(135deg, #00d2ff, #3a7bd5); border:none; padding:10px 20px; border-radius:8px; color:#fff; cursor:pointer;">➕ إضافة براند جديد</button>
        `
    },
    {
        id: 'channels',
        name: 'المنصات المربوطة',
        icon: './home.webp',
        render: () => `
            <div class="module-header-title">
                <img src="./home.webp" alt="Icon">
                <h2>المنصات المربوطة</h2>
            </div>
            <p>حالة ربط حسابات السوشيال ميديا وصلاحيات الوصول النشطة.</p>
            <a href="./connect-social.html" style="color: #00d2ff; display:inline-block; margin-top:15px; text-decoration:none;">إدارة وتعديل منصات التواصل الآن 🔗</a>
        `
    },
    {
        id: 'posts',
        name: 'مراجعة المنشورات',
        icon: './home.webp',
        render: () => `
            <div class="module-header-title">
                <img src="./home.webp" alt="Icon">
                <h2>مراجعة المنشورات والتدقيق الذكي</h2>
            </div>
            <p>المنشورات التي تمت جدولتها ومراجعتها آلياً لتتطابق مع الهوية والخطط التسويقية.</p>
        `
    },
    {
        id: 'marketing-plan',
        name: 'الخطة التسويقية',
        icon: './home.webp',
        render: () => `
            <div class="module-header-title">
                <img src="./home.webp" alt="Icon">
                <h2>الخطة التسويقية الاستراتيجية</h2>
            </div>
            <p>عرض الخطة الحالية مع تقرير التدقيق النفسي والسلوكي والخيارات المتاحة.</p>
        `
    },
    {
        id: 'content-calendar',
        name: 'خطة المحتوى والمنتجات',
        icon: './home.webp',
        render: () => `
            <div class="module-header-title">
                <img src="./home.webp" alt="Icon">
                <h2>خطة المحتوى وجدولة المنتجات</h2>
            </div>
            <p>إدارة المنتجات، الصور، والتقويم الزمني للمحتوى التلقائي ونشر العروض.</p>
        `
    },
    {
        id: 'billing',
        name: 'الفواتير والاشتراكات',
        icon: './home.webp',
        render: () => `
            <div class="module-header-title">
                <img src="./home.webp" alt="Icon">
                <h2>الفواتير والاشتراكات</h2>
            </div>
            <p>سجل الفواتير الشهرية وتفاصيل الاستهلاك وباقات بروتون.</p>
        `
    }
];

function initDashboard() {
    const dockContainer = document.getElementById('sidebarDock');
    if (!dockContainer) return;
    dockContainer.innerHTML = '';

    dashboardModules.forEach((mod, index) => {
        const btn = document.createElement('button');
        btn.className = `dock-icon-btn ${index === 0 ? 'active' : ''}`;
        btn.setAttribute('data-id', mod.id);
        btn.setAttribute('data-tooltip', mod.name); // تفعيل رسالة التوضيح باسم الكارت
        btn.innerHTML = `<img src="${mod.icon}" alt="${mod.name}">`;

        btn.addEventListener('click', () => {
            document.querySelectorAll('.dock-icon-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderActiveModule(mod.id);
        });

        dockContainer.appendChild(btn);
    });

    renderActiveModule(dashboardModules[0].id);
}

function renderActiveModule(moduleId) {
    const activeModule = dashboardModules.find(m => m.id === moduleId);
    const contentArea = document.getElementById('activeContentArea');
    
    if (activeModule && contentArea) {
        contentArea.innerHTML = activeModule.render();
    }
}
