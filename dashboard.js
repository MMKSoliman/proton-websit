// جلب محتوى الفوتر الخارجي
document.addEventListener("DOMContentLoaded", () => {
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            const footerContainer = document.getElementById('footer-container');
            if (footerContainer) footerContainer.innerHTML = data;
        })
        .catch(err => console.error("Footer Load Error:", err));

    // جلب بيانات وع trạngة الداشبورد عند التحميل
    fetchDashboardStatus();
});

// دالة جلب الحالة من الـ Backend
async function fetchDashboardStatus() {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    if (tokenFromUrl) {
        localStorage.setItem("access_token", tokenFromUrl);
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    const token = localStorage.getItem('access_token');

    try {
        const response = await fetch('https://api.protonag.com/v1/dashboard/status', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? 'Bearer ' + token : ''
            }
        });

        if (response.ok) {
            const data = await response.json();
            
            if (data.status_text && document.getElementById('statusBadge')) {
                document.getElementById('statusBadge').textContent = data.status_text;
            }
            if (data.title && document.getElementById('cardTitle')) {
                document.getElementById('cardTitle').textContent = data.title;
            }
            if (data.subtitle && document.getElementById('cardSubtitle')) {
                document.getElementById('cardSubtitle').textContent = data.subtitle;
            }
        }
    } catch (error) {
        console.error("Dashboard Sync Error:", error);
    }
}

// نظام النوافذ المنبثقة التفاعلية للأيقونات (Modules Handler)
function openModule(moduleName) {
    const modal = document.getElementById('moduleContentModal');
    const innerContainer = document.getElementById('dynamicModuleInner');
    
    let contentHTML = '';

    switch(moduleName) {
        case 'brands':
            contentHTML = `
                <h3>إدارة البراندات والهوية البصرية</h3>
                <p>استعرض البراندات الخاصة بك وقم بتعديل اللوجو، الألوان، ونبرة الصوت.</p>
                <div class="module-action-box">
                    <button class="btn-sub">إضافة براند جديد</button>
                </div>`;
            break;
        case 'channels':
            contentHTML = `
                <h3>منصات التواصل المربوطة</h3>
                <p>حالة ربط الحسابات ومنصات السوشيال ميديا الخاصة بنشاطك.</p>
                <a href="./connect-social.html" class="action-link-inline">🔗 إدارة وربط الحسابات</a>`;
            break;
        case 'posts':
            contentHTML = `
                <h3>منصة المراجعة والتدقيق الذكي للمنشورات</h3>
                <p>المنشورات التي تمت جدولتها ومراجعتها آلياً لتتطابق مع خطتك التسويقية.</p>`;
            break;
        case 'marketing-plan':
            contentHTML = `
                <h3>الخطة التسويقية الاستراتيجية</h3>
                <p>عرض الخطة الحالية مع تقرير التدقيق وخيارات التعديل المخصصة.</p>`;
            break;
        case 'content-calendar':
            contentHTML = `
                <h3>خطة المحتوى وجدولة المنتجات</h3>
                <p>إدارة المنتجات، الصور، والتقويم الزمني للمحتوى التلقائي.</p>`;
            break;
        case 'analytics':
            contentHTML = `
                <h3>تقارير الأداء ونمو المتابعين</h3>
                <p>مقارنة المتابعين، عدد الردود، والرسائل التي تمت معالجتها بواسطة النظام.</p>`;
            break;
        case 'billing':
            contentHTML = `
                <h3>سجل الاشتراكات والفواتير</h3>
                <p>تفاصيل باقتك الحالية والفواتير الشهرية السابقة.</p>`;
            break;
        default:
            contentHTML = `<h3>محتوى غير متوفر</h3>`;
    }

    innerContainer.innerHTML = contentHTML;
    modal.style.display = 'flex';
}

function closeModule() {
    const modal = document.getElementById('moduleContentModal');
    if (modal) modal.style.display = 'none';
}
