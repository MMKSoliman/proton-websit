export function renderBrands(container) {
    container.innerHTML = `
        <div class="module-header-title">
                <img src="./Branding-P.webp" alt="Icon">
                <h2>إدارة البراندات والهوية البصرية</h2>
            </div>
            <p>استعرض البراندات الخاصة بك، عدل الألوان، اللوجو، ونبرة الصوت بكل سهولة.</p>
            <button class="action-btn-primary" style="margin-top: 15px; background: linear-gradient(135deg, #00d2ff, #3a7bd5); border:none; padding:10px 20px; border-radius:8px; color:#fff; cursor:pointer;">➕ إضافة براند جديد</button>
    `;
}
