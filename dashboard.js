// استيراد وحدات الكروت المستقلة
import { renderPerformance } from './modules/performance.js';
import { renderBrands } from './modules/brands.js';
import { renderChannels } from './modules/channels.js';
import { renderPosts } from './modules/posts.js';
import { renderMarketingPlan } from './modules/marketing-plan.js';
import { renderContentPlan } from './modules/content-plan.js';
import { renderBilling } from './modules/billing.js';

document.addEventListener("DOMContentLoaded", () => {
    fetch('footer.html')
        .then(res => res.text())
        .then(data => {
            const footer = document.getElementById('footer-container');
            if(footer) footer.innerHTML = data;
        });

    initDashboard();
});

// مصفوفة الأيقونات والربط بدوال الكروت
const dashboardModules = [
    { id: 'performance', name: 'تقارير الأداء ونظرة عامة', icon: '../home.webp', render: renderPerformance },
    { id: 'brands', name: 'إدارة البراندات', icon: '../home.webp', render: renderBrands },
    { id: 'channels', name: 'المنصات المربوطة', icon: '../home.webp', render: renderChannels },
    { id: 'posts', name: 'مراجعة المنشورات', icon: '../home.webp', render: renderPosts },
    { id: 'marketing-plan', name: 'الخطة التسويقية', icon: '../home.webp', render: renderMarketingPlan },
    { id: 'content-plan', name: 'خطة المحتوى والمنتجات', icon: '../home.webp', render: renderContentPlan },
    { id: 'billing', name: 'الفواتير والاشتراكات', icon: '../home.webp', render: renderBilling }
];

function initDashboard() {
    const dockContainer = document.getElementById('sidebarDock');
    if (!dockContainer) return;
    dockContainer.innerHTML = '';

    dashboardModules.forEach((mod, index) => {
        const btn = document.createElement('button');
        btn.className = `dock-icon-btn ${index === 0 ? 'active' : ''}`;
        btn.setAttribute('data-id', mod.id);
        btn.setAttribute('data-tooltip', mod.name);
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
        contentArea.innerHTML = ''; // تفريغ المساحة قبل الحقن
        activeModule.render(contentArea); // استدعاء دالة الكارت المعزول
    }
}
