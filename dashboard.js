// جلب الفوتر
document.addEventListener("DOMContentLoaded", () => {
    fetch('footer.html')
        .then(res => res.text())
        .then(data => {
            const footer = document.getElementById('footer-container');
            if(footer) footer.innerHTML = data;
        });

    initDashboard();
});

// مصفوفة تعريف الأيقونات والعناصر (قابلة للتوسعة تلقائياً للإضافة المستقبلية)
const dashboardModules = [
    {
        id: 'performance',
        name: 'تقارير الأداء والنمو',
        icon: './home.webp',
        render: () => `
            <div class="analytics-overview-card">
                <h2>📊 تقارير الأداء ونظرة عامة</h2>
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
            <div>
                <h2>🏢 إدارة البراندات والهوية البصرية</h2>
                <p>استعرض البراندات الخاصة بك، عدل الألوان، اللوجو، ونبرة الصوت بكل سهولة.</p>
                <button class="action-btn-primary" style="margin-top: 15px;">➕ إضافة براند جديد</button>
            </div>
        `
    },
    {
        id: 'channels',
        name: 'المنصات المربوطة',
        icon: './home.webp',
        render: () => `
            <div>
                <h2>🔗 منصات التواصل المربوطة</h2>
                <p>حالة ربط حسابات السوشيال ميديا وصلاحيات الوصول النشطة.</p>
                <a href="./connect-social.html" class="action-link-inline" style="color: #00d2ff; display:inline-block; margin-top:15px;">إدارة وتعديل منصات التواصل الآن 🔗</a>
            </div>
        `
    },
    {
        id: 'posts',
        name: 'مراجعة المنشورات',
        icon: './home.webp',
        render: () => `
            <div>
                <h2>✍️ مراجعة المنشورات والتدقيق الذكي</h2>
                <p>المنشورات التي تمت جدولتها ومراجعتها آلياً لتتطابق مع الهوية والخطط التسويقية.</p>
            </div>
        `
    },
    {
        id: 'marketing-plan',
        name: 'الخطة التسويقية',
        icon: './home.webp',
        render: () => `
            <div>
                <h2>📈 الخطة التسويقية الاستراتيجية</h2>
                <p>عرض الخطة الحالية مع تقرير التدقيق النفسي والسلوكي والخيارات المتاحة.</p>
            </div>
        `
    },
    {
        id: 'content-calendar',
        name: 'خطة المحتوى والمنتجات',
        icon: './home.webp',
        render: () => `
            <div>
                <h2>📅 خطة المحتوى وجدولة المنتجات</h2>
                <p>إدارة المنتجات، الصور، والتقويم الزمني للمحتوى التلقائي ونشر العروض.</p>
            </div>
        `
    },
    {
        id: 'billing',
        name: 'الفواتير والاشتراكات',
        icon: './home.webp',
        render: () => `
            <div>
                <h2>💳 الفواتير والاشتراكات</h2>
                <p>سجل الفواتير الشهرية وتفاصيل الاستهلاك وباقات بروتون.</p>
            </div>
        `
    }
];

// بناء شريط الأيقونات والعرض الافتتاحي تلقائياً
function initDashboard() {
    const dockContainer = document.getElementById('sidebarDock');
    dockContainer.innerHTML = '';

    dashboardModules.forEach((mod, index) => {
        const btn = document.createElement('button');
        btn.className = `dock-icon-btn ${index === 0 ? 'active' : ''}`;
        btn.setAttribute('data-id', mod.id);
        btn.innerHTML = `<img src="${mod.icon}" alt="${mod.name}" title="${mod.name}">`;

        // حدث الضغط للتنقل وتفعيل الأيقونة وتغيير الكارت
        btn.addEventListener('click', () => {
            document.querySelectorAll('.dock-icon-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderActiveModule(mod.id);
        });

        dockContainer.appendChild(btn);
    });

    // افتح أول وحدة (تقارير الأداء) تلقائياً عند تحميل الصفحة
    renderActiveModule(dashboardModules[0].id);
}

// دالة عرض محتوى الكارت النشط داخل المساحة الخضراء
function renderActiveModule(moduleId) {
    const activeModule = dashboardModules.find(m => m.id === moduleId);
    const contentArea = document.getElementById('activeContentArea');
    
    if (activeModule && contentArea) {
        contentArea.innerHTML = activeModule.render();
    }
}
