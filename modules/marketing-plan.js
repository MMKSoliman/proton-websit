/**
 * Dynamic Marketing Plan Module - The 1-Page Marketing Plan Framework
 * Proton Automated Platform
 */

export async function renderMarketingPlan(container) {
    container.innerHTML = `
        <!-- الهيدر الرئيسي للوحدة مع تضمين لوجو بروتون -->
        <div class="module-header-title">
            <div class="proton-logo-wrapper">
                <img src="../Sta-P.webp" alt="Proton Logo" class="proton-header-logo-img">
            </div>
            <div class="header-titles-group">
                <h2>الخطة التسويقية الاستراتيجية</h2>
                <p class="module-subtitle">إطار العمل الاستراتيجي المعتمد لرحلة نمو العميل، والمربوط بآليات الأتمتة الذكية في Proton.</p>
            </div>
            <button id="print-plan-btn" class="proton-btn-print">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                طباعة الخطة
            </button>
        </div>

        <!-- بادة العميل المخصصة تحت الهيدر مع قائمة اختيار البراندات -->
        <div class="client-brand-badge-card">
            <div class="client-brand-info">
                <div class="brand-logo-wrapper">
                    <img id="brand-logo-preview" src="../Sta-P.webp" alt="Brand Logo" class="brand-logo-img">
                </div>
                <div class="platform-text">
                    <h4 id="brand-name-display">اختر النشاط التجاري</h4>
                    <p>اختر البراند المطلوب عرض خطته التسويقية</p>
                </div>
                <select id="brand-selector" class="brand-select-input">
                    <option value="">جاري جلب برانداتك...</option>
                </select>
            </div>
        </div>

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

    document.getElementById('print-plan-btn').addEventListener('click', () => {
        window.print();
    });

    await loadUserBrands();
}

/**
 * جلب البراندات الخاصة بالمستخدم الحالي باستخدام الـ JWT Token
 */
async function loadUserBrands() {
    try {
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

        const response = await fetch('https://api.protonag.com/v1/user-brands', {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
                
        if (!response.ok) throw new Error("Failed to fetch user brands");

        const data = await response.json();
        const brands = data.brands || [];
        const selector = document.getElementById('brand-selector');
        
        if (!brands || brands.length === 0) {
            selector.innerHTML = '<option value="">لا توجد براندات مضافة حالياً</option>';
            clearPlanDataDisplay();
            return;
        }

        selector.innerHTML = brands.map(b => `<option value="${b.brand_id}">${b.brand_name}</option>`).join('');

        const firstBrandId = brands[0].brand_id;
        await fetchAndPopulatePlanData(firstBrandId);

        selector.addEventListener('change', async (e) => {
            const selectedBrandId = e.target.value;
            if (selectedBrandId) {
                await fetchAndPopulatePlanData(selectedBrandId);
            }
        });

    } catch (error) {
        console.error("Error loading user brands:", error);
        document.getElementById('brand-selector').innerHTML = '<option value="">خطأ في تحميل البراندات</option>';
    }
}

/**
 * جلب وتعبئة تفاصيل الخطة التسويقية للبراند المحدد باستخدام الـ JWT Token
 */
async function fetchAndPopulatePlanData(brandId) {
    try {
        setLoadingState(true);
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

        const response = await fetch(`https://api.protonag.com/v1/marketing-plan/${brandId}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error("Network response was not ok");
        
        const planData = await response.json();

        const logoImg = document.getElementById('brand-logo-preview');
        if (logoImg) {
            logoImg.src = (planData.logo_url && planData.logo_url.trim() !== "") ? planData.logo_url : "../Sta-P.webp";
        }

        const brandNameEl = document.getElementById('brand-name-display');
        if (brandNameEl) {
            brandNameEl.innerText = planData.brand_name || "Proton Partner Brand";
        }

        document.getElementById('data-target-market').innerText = planData.target_market || 'لا توجد بيانات متاحة';
        document.getElementById('data-brand-message').innerText = planData.brand_message || 'لا توجد بيانات متاحة';
        document.getElementById('data-reach-channels').innerText = planData.reach_channels || 'لا توجد بيانات متاحة';
        document.getElementById('data-lead-capture').innerText = planData.lead_capture || 'لا توجد بيانات متاحة';
        document.getElementById('data-lead-nurturing').innerText = planData.lead_nurturing || 'لا توجد بيانات متاحة';
        document.getElementById('data-sales-conversion').innerText = planData.sales_conversion || 'لا توجد بيانات متاحة';
        document.getElementById('data-delight-experience').innerText = planData.delight_experience || 'لا توجد بيانات متاحة';
        document.getElementById('data-increase-clv').innerText = planData.increase_clv || 'لا توجد بيانات متاحة';
        document.getElementById('data-referral-system').innerText = planData.referral_system || 'لا توجد بيانات متاحة';

    } catch (error) {
        console.error("Error loading plan details:", error);
    } finally {
        setLoadingState(false);
    }
}

function setLoadingState(isLoading) {
    const contentIds = [
        'data-target-market', 'data-brand-message', 'data-reach-channels',
        'data-lead-capture', 'data-lead-nurturing', 'data-sales-conversion',
        'data-delight-experience', 'data-increase-clv', 'data-referral-system'
    ];
    
    contentIds.forEach(id => {
        const el = document.getElementById(id);
        if (el && isLoading && el.innerText === 'جاري جلب البيانات...') {
            el.style.opacity = '0.6';
        } else if (el) {
            el.style.opacity = '1';
        }
    });
}

function clearPlanDataDisplay() {
    const contentIds = [
        'data-target-market', 'data-brand-message', 'data-reach-channels',
        'data-lead-capture', 'data-lead-nurturing', 'data-sales-conversion',
        'data-delight-experience', 'data-increase-clv', 'data-referral-system'
    ];
    contentIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = '-';
    });
}
