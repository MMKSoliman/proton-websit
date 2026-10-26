const REEL_PRICE_PER_UNIT = 5; 
let activePlatforms = {}; 
let currentPlatformKey = null;

document.addEventListener("DOMContentLoaded", async function() {
    const token = localStorage.getItem("access_token") || new URLSearchParams(window.location.search).get('token');
    const brandSelector = document.getElementById("brand-selector");

    if (token && !localStorage.getItem("access_token")) {
        localStorage.setItem("access_token", token);
    }

    if (!brandSelector) return;

    try {
        const response = await fetch("https://api.protonag.com/brands/my-brands", {
            method: "GET",
            headers: { "Authorization": "Bearer " + (localStorage.getItem("access_token") || "") },
            credentials: 'include'
        });
        
        if (response.ok) {
            const brandsList = await response.json();
            brandSelector.innerHTML = '<option value="">-- اختر البراند --</option>';
            
            brandsList.forEach(brand => {
                const option = document.createElement("option");
                option.value = brand.brand_id;
                option.textContent = brand.brand_name;
                option.dataset.brandName = brand.brand_name;
                brandSelector.appendChild(option);
            });

            const addNewOption = document.createElement("option");
            addNewOption.value = "new_brand";
            addNewOption.textContent = "+ إضافة براند جديد";
            addNewOption.style.color = "#00f2fe";
            brandSelector.appendChild(addNewOption);

            const savedBrandId = localStorage.getItem("selected_brand_id");
            if (savedBrandId) {
                brandSelector.value = savedBrandId;
                await loadBrandConnections(savedBrandId);
            }
        }
    } catch (error) {
        console.error("Error fetching brands:", error);
    }

    brandSelector.addEventListener("change", async function() {
        if (this.value === "new_brand") {
            window.location.href = "./onboarding.html?mode=new_brand&step=2";
        } else if (this.value) {
            localStorage.setItem("selected_brand_id", this.value);
            const selectedOption = this.options[this.selectedIndex];
            if (selectedOption && selectedOption.dataset.brandName) {
                localStorage.setItem("selected_brand_name", selectedOption.dataset.brandName);
            }
            await loadBrandConnections(this.value);
        } else {
            localStorage.removeItem("selected_brand_id");
            localStorage.removeItem("selected_brand_name");
            resetPlatformsUI();
        }
    });

    // معالجة العودة بعد المصادقة وتطبيق الخدمة المحفوظة مسبقاً
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('connected')) {
        const activeBrand = localStorage.getItem("selected_brand_id");
        if (activeBrand) {
            await loadBrandConnections(activeBrand);
            await applyPendingSavedServices();
        }
    }
});

async function loadBrandConnections(brandId) {
    const platforms = ['facebook', 'instagram', 'tiktok', 'linkedin', 'x'];
    
    platforms.forEach(key => {
        const btn = document.getElementById(`btn-${key}`);
        if (btn) {
            btn.disabled = false;
            btn.textContent = "ربط المنصة";
            btn.classList.remove('connected');
            btn.onclick = () => openPlatformModal(key, getPlatformTitle(key), getPlatformIcon(key));
        }
    });

    try {
        const response = await fetch(`https://api.protonag.com/social/connections/${brandId}`, {
            method: "GET",
            headers: { "Authorization": "Bearer " + (localStorage.getItem("access_token") || "") },
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            const connections = data.connections || {};

            activePlatforms = {};

            platforms.forEach(key => {
                const btn = document.getElementById(`btn-${key}`);
                const disconnectBtn = document.getElementById(`disconnect-${key}`);

                if (connections[key]) {
                    const conn = connections[key];
                    let pTotal = 0;
                    if (conn.posts) pTotal += 25;
                    if (conn.reels) pTotal += (conn.rc || 5) * REEL_PRICE_PER_UNIT;
                    if (conn.comments) pTotal += (key === 'tiktok' ? 20 : 15);
                    if (conn.messages) pTotal += (key === 'tiktok' ? 25 : 20);

                    activePlatforms[key] = {
                        total: pTotal,
                        raw: conn
                    };

                    if (btn) {
                        btn.textContent = `تم الربط ($${pTotal})`;
                        btn.classList.add('connected');
                        btn.onclick = () => openPlatformModal(key, getPlatformTitle(key), getPlatformIcon(key));
                    }
                    if (disconnectBtn) disconnectBtn.style.display = 'inline-block';
                } else {
                    if (btn) {
                        btn.textContent = "ربط المنصة";
                        btn.classList.remove('connected');
                        btn.onclick = () => openPlatformModal(key, getPlatformTitle(key), getPlatformIcon(key));
                    }
                    if (disconnectBtn) disconnectBtn.style.display = 'none';
                }
            });

            updateMainSummary();
        }
    } catch (err) {
        console.error("Error loading connections:", err);
    }
}

function getPlatformTitle(key) {
    const map = { 'facebook': 'Facebook Pages', 'instagram': 'Instagram Business', 'tiktok': 'TikTok Business', 'linkedin': 'LinkedIn Page', 'x': 'X Platform' };
    return map[key] || key;
}

function getPlatformIcon(key) {
    const map = { 'facebook': './FB-W.png', 'instagram': './Insta-W.png', 'tiktok': './TT-W.png', 'linkedin': './L in-W.png', 'x': './X-W.png' };
    return map[key] || './favicon.png';
}

function resetPlatformsUI() {
    const platforms = ['facebook', 'instagram', 'tiktok', 'linkedin', 'x'];
    platforms.forEach(key => {
        const btn = document.getElementById(`btn-${key}`);
        const disconnectBtn = document.getElementById(`disconnect-${key}`);
        if (btn) {
            btn.disabled = true;
            btn.textContent = "اختر براند أولاً";
            btn.classList.remove('connected');
        }
        if (disconnectBtn) disconnectBtn.style.display = 'none';
    });
    activePlatforms = {};
    updateMainSummary();
}

function openPlatformModal(key, title, iconUrl) {
    const selectedBrandId = localStorage.getItem("selected_brand_id");
    if (!selectedBrandId) {
        alert("يرجى اختيار النشاط التجاري (البراند) أولاً.");
        return;
    }

    currentPlatformKey = key;
    document.getElementById('modalTitle').textContent = `تحديد خدمات ${title}`;
    document.getElementById('modalIcon').src = iconUrl;

    const container = document.getElementById('servicesContainer');
    container.innerHTML = ''; 

    const existing = activePlatforms[key] ? activePlatforms[key].raw : null;
    const hasPosts = existing ? existing.posts : true;
    const hasReels = existing ? existing.reels : true;
    const reelsCountVal = existing ? (existing.rc || 5) : 5;
    const hasComments = existing ? existing.comments : true;
    const hasMessages = existing ? existing.messages : true;

    container.innerHTML = `
        <div class="service-row">
    <label class="service-left">
        <input type="checkbox" id="srv_posts" ${hasPosts ? 'checked' : ''}>
        <div class="service-info">
            <span class="service-title">إدارة المحتوى</span>
        </div>
    </label>
    <span class="service-price">EGP5000</span>
</div>
<p class="service-desc">يشمل خطة وكتابة المحتوى والنشر</p>
<div class="service-row">
    <label class="service-left">
        <input type="checkbox" id="srv_reels" ${hasReels ? 'checked' : ''} onchange="toggleReelsDropdown()">
        <div class="service-info">
            <div class="reels-title-wrapper">
                <span class="service-title">إدارة الريلز</span>
                <select id="reels_count" class="reels-select" ${!hasReels ? 'disabled' : ''}>
                    ${generateReelsOptions(reelsCountVal)}
                </select>
            </div>
        </div>
    </label>
    <span class="service-price">EGP1500 / ريل</span>
</div>
<p class="service-desc">يشمل التصوير والمونتاج والمؤثرات</p>
<div class="service-row">
    <label class="service-left">
        <input type="checkbox" id="srv_comments" ${hasComments ? 'checked' : ''}>
        <div class="service-info">
            <span class="service-title">إدارة التعليقات</span>
            <p class="service-desc">يشمل التفاعل والرد على التعليقات</p>
        </div>
    </label>
    <span class="service-price">EGP3000</span>
</div>

<div class="service-row">
    <label class="service-left">
        <input type="checkbox" id="srv_messages" ${hasMessages ? 'checked' : ''}>
        <div class="service-info">
            <span class="service-title">إدارة الرسائل</span>
            <p class="service-desc">يشمل التحليل والرد وتقفيل المبيعات</p>
        </div>
    </label>
    <span class="service-price">EGP4500</span>
</div>
    `;

    document.getElementById('authModal').style.display = 'flex';
}

function generateReelsOptions(selectedValue) {
    let options = '';
    for (let i = 1; i <= 30; i++) {
        options += `<option value="${i}" ${i === selectedValue ? 'selected' : ''}>${i}</option>`;
    }
    return options;
}

function toggleReelsDropdown() {
    const isChecked = document.getElementById('srv_reels').checked;
    const select = document.getElementById('reels_count');
    select.disabled = !isChecked;
}

function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
}

async function confirmPlatformSelection() {
    if (!currentPlatformKey) return;

    const posts = document.getElementById('srv_posts').checked;
    const reels = document.getElementById('srv_reels').checked;
    const rc = parseInt(document.getElementById('reels_count').value) || 5;
    const comments = document.getElementById('srv_comments').checked;
    const messages = document.getElementById('srv_messages').checked;

    const selectedBrandId = localStorage.getItem("selected_brand_id");
    const existingRecord = activePlatforms[currentPlatformKey] ? activePlatforms[currentPlatformKey].raw : null;

    // حفظ الاختيارات مؤقتاً لتطبيقها بعد الرجوع من OAuth
    localStorage.setItem("pending_services", JSON.stringify({
        platform: currentPlatformKey,
        posts, reels, rc, comments, messages
    }));

    if (existingRecord && existingRecord.account_id) {
        // تحديث المربوط حالياً مباشرةً
        await fetch("https://api.protonag.com/social/meta/update-services", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + (localStorage.getItem("access_token") || "")
            },
            body: JSON.stringify({ account_id: existingRecord.account_id, posts, reels, rc, comments, messages }),
            credentials: 'include'
        });
        closeAuthModal();
        await loadBrandConnections(selectedBrandId);
        return;
    }

    closeAuthModal();

    // التوجيه لمصادقة ميتا عند الربط لأول مرة
    if (currentPlatformKey === 'facebook' || currentPlatformKey === 'instagram') {
        const res = await fetch(`https://api.protonag.com/social/meta/login/${selectedBrandId}`, {
            method: "GET",
            headers: { "Authorization": "Bearer " + (localStorage.getItem("access_token") || "") },
            credentials: 'include'
        });
        if (res.ok) {
            const data = await res.json();
            if (data.auth_url) window.location.href = data.auth_url;
        }
    }
}

// تطبيق الخدمة المحفوظة مسبقاً عند العودة فوراً
async function applyPendingSavedServices() {
    const pendingStr = localStorage.getItem("pending_services");
    if (!pendingStr) return;

    try {
        const pending = JSON.parse(pendingStr);
        const record = activePlatforms[pending.platform] ? activePlatforms[pending.platform].raw : null;

        if (record && record.account_id) {
            await fetch("https://api.protonag.com/social/meta/update-services", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + (localStorage.getItem("access_token") || "")
                },
                body: JSON.stringify({
                    account_id: record.account_id,
                    posts: pending.posts,
                    reels: pending.reels,
                    rc: pending.rc,
                    comments: pending.comments,
                    messages: pending.messages
                }),
                credentials: 'include'
            });

            localStorage.removeItem("pending_services");
            const activeBrand = localStorage.getItem("selected_brand_id");
            if (activeBrand) await loadBrandConnections(activeBrand);
        }
    } catch (e) {
        console.error("Error applying pending services:", e);
    }
}

function updateMainSummary() {
    let count = 0;
    let totalSum = 0;

    Object.keys(activePlatforms).forEach(key => {
        count++;
        totalSum += activePlatforms[key].total;
    });

    document.getElementById('selectedCount').textContent = count;
    document.getElementById('totalPrice').textContent = totalSum;
}

function redirectToWhatsApp() {
    const brandName = localStorage.getItem("selected_brand_name") || "النشاط التجاري";
    const total = document.getElementById('totalPrice').textContent;
    const count = document.getElementById('selectedCount').textContent;

    let message = `مرحباً، أود إتمام الطلب وتفعيل الخطة للنشاط التجاري: *${brandName}*.\n`;
    message += `- عدد المنصات المربوطة: ${count}\n`;
    message += `- الإجمالي الشهري: $${total}\n\nيرجى استكمال إجراءات التفعيل.`;

    const url = `https://wa.me/+201066581983?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  // التوجيه التلقائي إلى لوحة التحكم
    setTimeout(() => {
        window.location.href = "./dashboard.html";
    }, 1000);
} // <- هذا هو قوس إغلاق الدالة الوحيد في النهاية
