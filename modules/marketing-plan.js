/**
 * Dynamic Marketing Plan Module - The 1-Page Marketing Plan Framework
 * Proton Automated Platform
 */

export async function renderMarketingPlan(container) {
    // 1. هيكل HTML التفاعلي المقسم إلى 3 مراحل و9 كروت
    container.innerHTML = `
        <div class="module-header-title">
            <img src="../Sta-P.webp" alt="Marketing Plan Icon">
            <h2>الخطة التسويقية الاستراتيجية (1-Page Canvas)</h2>
        </div>
        <p class="module-subtitle">إطار العمل الاستراتيجي المعتمد لرحلة نمو العميل، والمربوط بآليات الأتمتة الذكية في Proton.</p>

        <!-- حاوية الشبكة الرئيسية للخطة التسويقية -->
        <div class="marketing-canvas-container">
            
            <!-- المرحلة الأولى: قبل (العملاء المحتملون) -->
            <div class="canvas-phase phase-before">
                <div class="phase-header">
                    <span class="phase-badge">مرحلة 1: قَبْل</span>
                    <h3>العملاء المحتملون (Prospects)</h3>
                </div>
                <div class="phase-cards-grid">
                    <div class="canvas-card" id="card-target-market">
                        <div class="card-num">01</div>
                        <h4>سوقي المستهدف</h4>
                        <p class="card-desc">الدوافع النفسية والسلوكية للجمهور</p>
                        <div class="card-content" id="data-target-market">جاري جلب البيانات...</div>
                    </div>
                    <div class="canvas-card" id="card-brand-message">
                        <div class="card-num">02</div>
                        <h4>رسالتي للسوق</h4>
                        <p class="card-desc">القيمة الفريدة ونبرة الصوت (UVP)</p>
                        <div class="card-content" id="data-brand-message">جاري جلب البيانات...</div>
                    </div>
                    <div class="canvas-card" id="card-reach-channels">
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
                    <div class="canvas-card" id="card-lead-capture">
                        <div class="card-num">04</div>
                        <h4>استدراج المهتمين</h4>
                        <p class="card-desc">عرض القيمة وجذب بيانات التواصل</p>
                        <div class="card-content" id="data-lead-capture">جاري جلب البيانات...</div>
                    </div>
                    <div class="canvas-card" id="card-lead-nurturing">
                        <div class="card-num">05</div>
                        <h4>احتضان وتغذية المهتمين</h4>
                        <p class="card-desc">سلسلة الردود والمتابعة الذكية تلقائياً</p>
                        <div class="card-content" id="data-lead-nurturing">جاري جلب البيانات...</div>
                    </div>
                    <div class="canvas-card" id="card-sales-conversion">
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
                    <div class="canvas-card" id="card-delight-experience">
                        <div class="card-num">07</div>
                        <h4>تجربة عميل مميزة</h4>
                        <p class="card-desc">الانطباع الأول وتقديم القيمة الفائقة</p>
                        <div class="card-content" id="data-delight-experience">جاري جلب البيانات...</div>
                    </div>
                    <div class="canvas-card" id="card-increase-clv">
                        <div class="card-num">08</div>
                        <h4>رفع القيمة الدائمة (CLV)</h4>
                        <p class="card-desc">إعادة الشراء والخدمات المكملة</p>
                        <div class="card-content" id="data-increase-clv">جاري جلب البيانات...</div>
                    </div>
                    <div class="canvas-card" id="card-referral-system">
                        <div class="card-num">09</div>
                        <h4>تنسيق الإحالات والتوصيات</h4>
                        <p class="card-desc">تحويل العملاء إلى مسوقين للبراند</p>
                        <div class="card-content" id="data-referral-system">جاري جلب البيانات...</div>
                    </div>
                </div>
            </div>

        </div>
    `;

    // 2. استدعاء دالة جلب البيانات وحقنها في الخانات التسع
    await fetchAndPopulatePlanData();
}

/**
 * دالة جلب بيانات الخطة من قاعدة البيانات أو n8n Webhook
 */
async function fetchAndPopulatePlanData() {
    const token = localStorage.getItem('access_token');
    
    // يمكن الاستدعاء من FastApi Endpoint أو n8n Webhook مباشرة:
    // const API_URL = 'https://api.protonag.com/v1/marketing-plan/current';
    // أو رابط سيناريو n8n:
    // const API_URL = 'https://n8n.protonag.com/webhook/get-marketing-plan';

    try {
        /*
        // السطر الفعلي للـ Fetch (موقوف مؤقتاً لحين ربط الـ Backend):
        const response = await fetch('https://api.protonag.com/v1/marketing-plan', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? 'Bearer ' + token : ''
            }
        });
        const planData = await response.json();
        */

        // 3. متطلبات ومخرجات السيناريو (Mock Data لتوضيح أسماء المتغيرات القادمة من n8n/DB)
        const planData = {
            target_market: "أصحاب الشركات الصغيرة والتاجر العربي الذي يعاني من ضيق الوقت للرد على الرسائل والتعليقات.",
            brand_message: "Proton هو شريك النمو الرقمي الذي يدير ويضاعف مبيعاتك أوتوماتيكياً بدون استنزاف ووقت.",
            reach_channels: "إعلانات Instagram الموجهة، محتوى LinkedIn الاستراتيجي، وحملات إعادة الاستهداف.",
            lead_capture: "دليل مجاني أو تدقيق مجاني لحسابات السوشيال ميديا مقابل تسجيل رقم الواتساب.",
            lead_nurturing: "سلسلة رسائل واتساب وآلية n8n التلقائية للرد على الاستفسارات فور وقوعها.",
            sales_conversion: "تقديم عرض استشاري مصغر وتجربة آليات الرد الآلي حية أمام العميل.",
            delight_experience: "لوحة تحكم تفاعلية هادئة، وتقارير أداء أسبوعية تصدر آلياً.",
            increase_clv: "توفير باقات جدولة المنتجات المتقدمة، وربط المتاجر الإلكترونية المتعددة.",
            referral_system: "خصم 20% لكل عميل يجلب نشاطاً تجارياً آخر للاشتراك في Proton."
        };

        // 4. حقن التكست داخل كل مربع ديناميكياً
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
        console.error("Marketing Plan Sync Error:", error);
    }
}
