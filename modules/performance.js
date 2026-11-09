export function renderPerformance(container) {
    container.innerHTML = `
        <div class="module-header-title">
                <img src="./Dash-P.webp" alt="Icon">
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
    `;
}
