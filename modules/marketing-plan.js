/**
 * Dynamic Marketing Plan Module - The 1-Page Marketing Plan Framework
 * Proton Automated Platform
 */

export async function renderMarketingPlan(container) {
    container.innerHTML = `
        <div class="module-header-title">
            <div class="brand-header-info">
                <!-- لوجو بروتون بجوار لوجو العميل -->
                <img src="../Sta-P.webp" alt="Proton Logo" class="proton-logo-print">
                <img id="brand-logo-preview" src="" alt="Client Logo" class="brand-logo-img" style="display:none;">
                <div>
                    <h2>الخطة التسويقية الاستراتيجية (1-Page Canvas)</h2>
                    <p class="module-subtitle">إطار العمل الاستراتيجي المعتمد لرحلة نمو العميل، والمربوط بآليات الأتمتة الذكية في Proton.</p>
                </div>
            </div>
            <button id="print-plan-btn" class="proton-btn-print">🖨️ طباعة الخطة (A4)</button>
        </div>

        <!-- حاوية الشبكة الرئيسية للخطة التسويقية -->
        <div class="marketing-canvas-container">
            
            <!-- المرحلة الأولى: قبل (العملاء المحتملون) -->
            <div class="canvas-phase phase-before">
                <div class="phase-header">
                    <span class="phase-badge">مرحلة 1: قَبْل</span>
                    <h3>العملاء المحتملون (Prospects)</h3>
                </div>
                <div class="phase-cards-grid">
                    <div class="canvas-card">
                        <div class="card-num">01</div>
                        <h4>سوقي المستهدف</h4>
                        <p class="card-desc">الدوافع النفسية والسلوكية للجمهور</p>
                        <div class="card-content" id="data-target-market">جاري جلب البيانات...</div>
                    </div>
                    <div class="canvas-card">
                        <div class="card-num">02</div>
                        <h4>رسالتي للسوق</h4>
                        <p class="card-desc">القيمة الفريدة ونبرة الصوت (UVP)</p>
                        <div class="card-content" id="data-brand-message">جاري جلب البيانات...</div>
                    </div>
                    <div class="canvas-card">
                        <div class="card-num">03</div>
                        <h4>وسائل الوصول</h4>
                        <p class="card-desc">منصات ومنافذ النشر المستهدفة</p>
                        <div class="card-content" id="data-reach-channels">جاري جلب البيانات...</div>
                    </div>
                </div>
            </div>

            <!-- المرحلة الثانية: أثناء (العملاء المهتمون) -->
            <div class="canvas-phase phase-during">
                <div class="phase-header">
                    <span class="phase-badge badge-during">مرحلة 2: أَثْنَاء</span>
                    <h3>العملاء المهتمون (Leads)</h3>
                </div>
                <div class="phase-cards-grid">
                    <div class="canvas-card">
                        <div class="card-num">04</div>
                        <h4>استدراج المهتمين</h4>
                        <p class="card-desc">عرض القيمة وجذب بيانات التواصل</p>
                        <div class="card-content" id="data-lead-capture">جاري جلب البيانات...</div>
                    </div>
                    <div class="canvas-card">
                        <div class="card-num">05</div>
                        <h4>احتضان وتغذية المهتمين</h4>
                        <p class="card-desc">سلسلة الردود والمتابعة الذكية تلقائياً</p>
                        <div class="card-content" id="data-lead-nurturing">جاري جلب البيانات...</div>
                    </div>
                    <div class="canvas-card">
                        <div class="card-num">06</div>
                        <h4>تحويل المهتمين إلى مشترين</h4>
                        <p class="card-desc">استراتيجيات إغلاق المبيعات والحجز</p>
                        <div class="card-content" id="data-sales-conversion">جاري جلب البيانات...</div>
                    </div>
                </div>
            </div>

            <!-- المرحلة الثالثة: بعد (العملاء الفعليون) -->
            <div class="canvas-phase phase-after">
                <div class="phase-header">
                    <span class="phase-badge badge-after">مرحلة 3: بَعْد</span>
                    <h3>العملاء الفعليون (Customers)</h3>
                </div>
                <div class="phase-cards-grid">
                    <div class="canvas-card">
                        <div class="card-num">07</div>
                        <h4>تجربة عميل مميزة</h4>
                        <p class="card-desc">الانطباع الأول وتقديم القيمة الفائقة</p>
                        <div class="card-content" id="data-delight-experience">جاري جلب البيانات...</div>
                    </div>
                    <div class="canvas-card">
                        <div class="card-num">08</div>
                        <h4>رفع القيمة الدائمة (CLV)</h4>
                        <p class="card-desc">إعادة الشراء والخدمات المكملة</p>
                        <div class="card-content" id="data-increase-clv">جاري جلب البيانات...</div>
                    </div>
                    <div class="canvas-card">
                        <div class="card-num">09</div>
                        <h4>تنسيق الإحالات والتوصيات</h4>
                        <p class="card-desc">تحويل العملاء إلى مسوقين للبراند</p>
                        <div class="card-content" id="data-referral-system">جاري جلب البيانات...</div>
                    </div>
                </div>
            </div>

        </div>
    `;

    // تفعيل زر الطباعة
    document.getElementById('print-plan-btn').addEventListener('click', () => {
        window.print();
    });

    await fetchAndPopulatePlanData();
}

async function fetchAndPopulatePlanData() {
    try {
        // جلب البيانات (من جدول marketing_plans والـ brands)
        const planData = {
            logo_url: "", // رابط لوجو العميل القادم من جدول brands
            target_market: "أصحاب الشركات الصغيرة والتاجر العربي الذي يعاني من ضيق الوقت للرد على الرسائل والتعليقات.",
            brand_message: "Proton هو شريك النمو الرقمي الذي يدير ويضاعف مبيعاتك أوتوماتيكياً بدون استنزاف ووقت.",
            reach_channels: "إعلانات Instagram الموجهة، محتوى LinkedIn الاستراتيجي، وحملات إعادة الاستهداف.",
            lead_capture: "دليل مجاني أو تدقيق مجاني لحسابات السوشيال ميديا مقابل تسجيل رقم الواتساب.",
            lead_nurturing: "سلسلة رسائل واتساب وآلية n8n التلقائية للرد على الاستفسارات فور وقوعها.",
            sales_conversion: "تقديم عرض استشاري مصغر وتجربة آليات الرد الآلي حية أمام العميل.",
            delight_experience: "لوحة تحكم تفاعلية هادئة، وتقارير أسبوعية تصدر آلياً.",
            increase_clv: "توفير باقات جدولة المنتجات المتقدمة، وربط المتاجر الإلكترونية المتعددة.",
            referral_system: "خصم 20% لكل عميل يجلب نشاطاً تجارياً آخر للاشتراك في Proton."
        };

        if (planData.logo_url) {
            const logoImg = document.getElementById('brand-logo-preview');
            logoImg.src = planData.logo_url;
            logoImg.style.display = 'block';
        }

        document.getElementById('data-target-market').innerText = planData.target_market;
        document.getElementById('data-brand-message').innerText = planData.brand_message;
        document.getElementById('data-reach-channels').innerText = planData.reach_channels;
        document.getElementById('data-lead-capture').innerText = planData.lead_capture;
        document.getElementById('data-lead-nurturing').innerText = planData.lead_nurturing;
        document.getElementById('data-sales-conversion').innerText = planData.sales_conversion;
        document.getElementById('data-delight-experience').innerText = planData.delight_experience;
        document.getElementById('data-increase-clv').innerText = planData.increase_clv;
        document.getElementById('data-referral-system').innerText = planData.referral_system;

    } catch (error) {
        console.error("Error loading plan:", error);
    }
}
