const REEL_PRICE_PER_UNIT = 1500; let activePlatforms = {}; let currentPlatformKey = null;

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
                    if (conn.posts) pTotal += 5000;
                    if (conn.reels) pTotal += (conn.rc || 1) * REEL_PRICE_PER_UNIT;
                    if (conn.comments) pTotal += (key === 'tiktok' ? 1500 : 3000);
                    if (conn.messages) pTotal += (key === 'tiktok' ? 3000 : 4500);

                    activePlatforms[key] = {
                        total: pTotal,
                        raw: conn
                    };

                    if (btn) {
                        btn.textContent = `تم الربط (EGP${pTotal})`;
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
    const map = { 'facebook': './FB-W.webp', 'instagram': './Insta-W.webp', 'tiktok': './TT-W.webp', 'linkedin': './L in-W.webp', 'x': './X-W.webp' };
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
    const reelsCountVal = existing ? (existing.rc || 1) : 1;
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

        <div class="service-row">
            <label class="service-left">
                <input type="checkbox" id="srv_reels" ${hasReels ? 'checked' : ''} onchange="toggleReelsDropdown()">
                <div class="service-info">
                    <div class="reels-title-wrapper">
                        <span class="service-title">   إدارة الريلز</span>
                        <select id="reels_count" class="reels-select" ${!hasReels ? 'disabled' : ''}>
                            ${generateReelsOptions(reelsCountVal)}
                        </select>
                    </div>
                </div>
            </label>
            <span class="service-price">EGP1500 / ريل</span>
        </div>

        <div class="service-row">
            <label class="service-left">
                <input type="checkbox" id="srv_comments" ${hasComments ? 'checked' : ''}>
                <div class="service-info">
                    <span class="service-title">إدارة التعليقات</span>
                </div>
            </label>
            <span class="service-price">EGP3000</span>
        </div>

        <div class="service-row">
            <label class="service-left">
                <input type="checkbox" id="srv_messages" ${hasMessages ? 'checked' : ''}>
                <div class="service-info">
                    <span class="service-title">إدارة الرسائل</span>
                </div>
            </label>
            <span class="service-price">EGP4500</span>
        </div>
        
        <div class="service-details-link-container">
            <a href="javascript:void(0);" onclick="openServiceDetailsModal()" class="service-desc service-details-link">تفاصيل الخدمات</a>
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

// دوال الكارت المنبثق لتفاصيل الخدمات
function openServiceDetailsModal() {
    let modal = document.getElementById('serviceModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'serviceModal';
        modal.className = 'proton-modal';
        modal.innerHTML = `
            <div class="proton-modal-content">
                <div class="proton-modal-header">
                    <h3>تفاصيل الخدمات الشاملة</h3>
                    <span class="proton-close-btn" onclick="closeServiceDetailsModal()">&times;</span>
                </div>
                <div class="proton-modal-body">
                    <h4>1. إدارة المحتوى</h4>
                    <p>يشمل إعداد خطة محتوى متكاملة، كتابة النصوص التسويقية، وتصميم الجدول الزمني للنشر.</p>
                    <h4>2. إدارة الريلز</h4>
                    <p>يشمل التصوير، المونتاج الاحترافي، وإضافة المؤثرات البصرية والصوتية.</p>
                    <h4>3. إدارة التعليقات</h4>
                    <p>المتابعة المستمرة والتفاعل والرد الفوري على تعليقات العملاء.</p>
                    <h4>4. إدارة الرسائل</h4>
                    <p>تحليل الرسائل، الرد السريع، وتقفيل المبيعات عبر المحادثات الخاصة.</p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    modal.style.display = 'flex';
}

function closeServiceDetailsModal() {
    const modal = document.getElementById('serviceModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

window.addEventListener('click', function(event) {
    const modal = document.getElementById('serviceModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

async function confirmPlatformSelection() {
    if (!currentPlatformKey) return;

    const posts = document.getElementById('srv_posts').checked;
    const reels = document.getElementById('srv_reels').checked;
    const rc = parseInt(document.getElementById('reels_count').value) || 1;
    const comments = document.getElementById('srv_comments').checked;
    const messages = document.getElementById('srv_messages').checked;

    const selectedBrandId = localStorage.getItem("selected_brand_id");
    const existingRecord = activePlatforms[currentPlatformKey] ? activePlatforms[currentPlatformKey].raw : null;

    localStorage.setItem("pending_services", JSON.stringify({
        platform: currentPlatformKey,
        posts, reels, rc, comments, messages
    }));

    // إذا كانت الخدمات مسجلة مسبقاً، قم بتحديثها مباشرة دون إعادة توجيه للـ OAuth
    if (existingRecord && existingRecord.account_id) {
        let updateEndpoint = "https://api.protonag.com/social/meta/update-services"; // افتراضي
        if (currentPlatformKey === 'tiktok') {
            updateEndpoint = "https://api.protonag.com/social/tiktok/update-services";
        } else if (currentPlatformKey === 'linkedin') {
            updateEndpoint = "https://api.protonag.com/social/linkedin/update-services";
        } else if (currentPlatformKey === 'x') {
            updateEndpoint = "https://api.protonag.com/social/x/update-services";
        }

        await fetch(updateEndpoint, {
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

    // توجيه المستخدم لربط الحساب الجديد بناءً على المنصة المختارة
    let loginEndpoint = "";
    if (currentPlatformKey === 'facebook' || currentPlatformKey === 'instagram') {
        loginEndpoint = `https://api.protonag.com/social/meta/login/${selectedBrandId}`;
    } else if (currentPlatformKey === 'tiktok') {
        loginEndpoint = `https://api.protonag.com/social/tiktok/login/${selectedBrandId}`;
    } else if (currentPlatformKey === 'linkedin') {
        loginEndpoint = `https://api.protonag.com/social/linkedin/login/${selectedBrandId}`;
    } else if (currentPlatformKey === 'x') {
        loginEndpoint = `https://api.protonag.com/social/x/login/${selectedBrandId}`;
    }

    if (loginEndpoint) {
        const res = await fetch(loginEndpoint, {
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

async function disconnectPlatform(platformKey) {
    const selectedBrandId = localStorage.getItem("selected_brand_id");
    if (!selectedBrandId) {
        alert("يرجى اختيار النشاط التجاري أولاً.");
        return;
    }

    if (!confirm(`هل أنت متأكد من رغبتك في إلغاء ربط منصة ${getPlatformTitle(platformKey)}؟`)) {
        return;
    }

    try {
        const response = await fetch(`https://api.protonag.com/social/disconnect/${selectedBrandId}/${platformKey}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + (localStorage.getItem("access_token") || "")
            },
            credentials: 'include'
        });

        if (response.ok) {
            // إعادة تحميل وتحديث اتصالات البراند لتفريغ الزر وتحديث الإجمالي فوراً
            await loadBrandConnections(selectedBrandId);
        } else {
            alert("حدث خطأ أثناء محاولة إلغاء الربط.");
        }
    } catch (error) {
        console.error("Error disconnecting platform:", error);
    }
}

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
    const brandId = localStorage.getItem("selected_brand_id") || "غير محدد";
    const total = document.getElementById('totalPrice').textContent;
    const count = document.getElementById('selectedCount').textContent;
    
    const username = localStorage.getItem("user_name") || localStorage.getItem("username") || "مستخدم بروتون";
    const userId = localStorage.getItem("user_id") || localStorage.getItem("id") || "غير محدد";

    let message = `مرحباً، أود إتمام الطلب وتفعيل الخطة للنشاط التجاري: *${brandName}*.\n\n`;
    message += `👤 *بيانات العميل:*\n`;
    message += `- اسم المستخدم: ${username}\n`;
    message += `- معرف المستخدم (User ID): ${userId}\n`;
    message += `- معرف البراند (Brand ID): ${brandId}\n\n`;
    
    message += `📋 *تفاصيل الفاتورة والاشتراكات:*\n`;

    const platformNames = {
        'facebook': 'Facebook Pages',
        'instagram': 'Instagram Business',
        'tiktok': 'TikTok Business',
        'linkedin': 'LinkedIn Page',
        'x': 'X Platform'
    };

    Object.keys(activePlatforms).forEach(key => {
        const plat = activePlatforms[key];
        const raw = plat.raw || {};
        const pName = platformNames[key] || key;
        
        // تحديد أسعار التعليقات والرسائل حسب المنصة
        const commentsPrice = (key === 'tiktok' ? 1500 : 3000);
        const messagesPrice = (key === 'tiktok' ? 3000 : 4500);

        message += `\n🔹 *${pName}* (EGP${plat.total}):\n`;
        if (raw.posts) {
            message += `  - إدارة المحتوى (EGP5000)\n`;
        }
        if (raw.reels) {
            const rc = raw.rc || 1;
            const reelsTotal = rc * 1500;
            message += `  - إدارة الريلز: ${rc} ريل (EGP${reelsTotal})\n`;
        }
        if (raw.comments) {
            message += `  - إدارة التعليقات (EGP${commentsPrice})\n`;
        }
        if (raw.messages) {
            message += `  - إدارة الرسائل (EGP${messagesPrice})\n`;
        }
    });

    message += `\n-------------------\n`;
    message += `📊 *إجمالي المنصات المربوطة:* ${count}\n`;
    message += `💰 *الإجمالي الشهري الكلي:* EGP${total}\n\n`;
    message += `يرجى استكمال إجراءات التفعيل.`;

    const url = `https://wa.me/+201066581983?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    
    setTimeout(() => {
        window.location.href = "./dashboard.html";
    }, 1000);
}
