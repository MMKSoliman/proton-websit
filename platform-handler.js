// platform-handler.js - إدارة المنصات، الخدمات الأربع (posts, reels, comments, messages)، واحتساب الأسعار
const REEL_PRICE_PER_UNIT = 5; 
let activePlatforms = {}; 
let currentPlatformKey = null;

document.addEventListener("DOMContentLoaded", async function() {
    const token = localStorage.getItem("access_token") || new URLSearchParams(window.location.search).get('token');
    const brandSelector = document.getElementById("brand-selector");

    // التعامل مع العودة من المصادقة وفتح الـ Modal الخاص بالمنصة المربوطة تلقائياً
const urlParams = new URLSearchParams(window.location.search);
const connectedPlatform = urlParams.get('connected');

if (connectedPlatform) {
    const activeBrand = localStorage.getItem("selected_brand_id");
    if (activeBrand) {
        await loadBrandConnections(activeBrand);
        
        // فتح نافذة تحديد الخدمات تلقائياً للمنصة المربوطة
        const platformMap = {
            'facebook': { title: 'Facebook Pages', icon: './FB-W.png' },
            'instagram': { title: 'Instagram Business', icon: './Insta-W.png' },
            'tiktok': { title: 'TikTok Business', icon: './TT-W.png' },
            'linkedin': { title: 'LinkedIn Page', icon: './L in-W.png' },
            'x': { title: 'X Platform', icon: './X-W.png' }
        };

        if (platformMap[connectedPlatform]) {
            setTimeout(() => {
                openPlatformModal(connectedPlatform, platformMap[connectedPlatform].title, platformMap[connectedPlatform].icon);
            }, 300);
        }
    }
}

    if (token && !localStorage.getItem("access_token")) {
        localStorage.setItem("access_token", token);
    }

    if (!brandSelector) return;

    // جلب قائمة البراندات والأنشطة التجارية
    try {
        const response = await fetch("https://api.protonag.com/brands/my-brands", {
            method: "GET",
            headers: { 
                "Authorization": "Bearer " + (localStorage.getItem("access_token") || "")
            },
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
        } else {
            brandSelector.innerHTML = '<option value="">لا توجد أنشطة مسجلة</option>';
        }
    } catch (error) {
        console.error("Error fetching brands:", error);
        brandSelector.innerHTML = '<option value="">خطأ في الاتصال</option>';
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

    // التعامل مع بارامتر النجاح بعد العودة من ربط ميتا
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('connected') === 'success') {
        const activeBrand = localStorage.getItem("selected_brand_id");
        if (activeBrand) {
            await loadBrandConnections(activeBrand);
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
        }
    });

    try {
        const response = await fetch(`https://api.protonag.com/social/connections/${brandId}`, {
            method: "GET",
            headers: { 
                "Authorization": "Bearer " + (localStorage.getItem("access_token") || "")
            },
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
                    let details = [];
                    
                    if (conn.posts) { pTotal += 25; details.push('نشر منشورات وصور'); }
                    if (conn.reels) { 
                        const rc = conn.rc || 5; 
                        const cost = rc * REEL_PRICE_PER_UNIT; 
                        pTotal += cost; 
                        details.push(`${rc} ريلز ($${cost})`); 
                    }
                    if (conn.comments) { pTotal += (key === 'tiktok' ? 20 : 15); details.push('الرد على التعليقات'); }
                    if (conn.messages) { pTotal += (key === 'tiktok' ? 25 : 20); details.push('الرد على الرسائل'); }

                    activePlatforms[key] = {
                        total: pTotal,
                        details: details,
                        raw: conn
                    };

                    if (btn) {
                        btn.textContent = `تم الربط ($${pTotal})`;
                        btn.classList.add('connected');
                    }
                    if (disconnectBtn) disconnectBtn.style.display = 'inline-block';
                } else {
                    if (btn) {
                        btn.textContent = "ربط المنصة";
                        btn.classList.remove('connected');
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

// دالة بدء ربط ميتا الحقيقي
async function connectMetaPlatform(platformKey) {
    const selectedBrandId = localStorage.getItem("selected_brand_id");
    if (!selectedBrandId) {
        alert("يرجى اختيار النشاط التجاري (البراند) أولاً قبل ربط المنصات.");
        return;
    }

    try {
        const res = await fetch(`https://api.protonag.com/social/meta/login/${selectedBrandId}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + (localStorage.getItem("access_token") || "")
            },
            credentials: 'include'
        });

        if (res.ok) {
            const data = await res.json();
            if (data.auth_url) {
                window.location.href = data.auth_url;
            }
        } else {
            alert("تعذر بدء عملية المصادقة مع ميتا.");
        }
    } catch (err) {
        console.error("Meta login error:", err);
        alert("حدث خطأ في الاتصال بالخادم.");
    }
}

// فتح نافذة تخصيص الخدمات الأربع
function openPlatformModal(key, title, iconUrl) {
    const selectedBrandId = localStorage.getItem("selected_brand_id");
    if (!selectedBrandId) {
        alert("يرجى اختيار النشاط التجاري (البراند) أولاً قبل ربط المنصات.");
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
                <input type="checkbox" id="srv_posts" ${hasPosts ? 'checked' : ''} onchange="calculateModalTotal()">
                <span>النشر التلقائي للمنشورات + صورة</span>
            </label>
            <span class="service-price">$25</span>
        </div>
        <div class="service-row">
            <label class="service-left">
                <input type="checkbox" id="srv_reels" ${hasReels ? 'checked' : ''} onchange="toggleReelsDropdown()">
                <span>إضافة ريلز شهرياً:</span>
                <select id="reels_count" class="reels-select" ${!hasReels ? 'disabled' : ''} onchange="calculateModalTotal()">
                    ${generateReelsOptions(reelsCountVal)}
                </select>
            </label>
            <span class="service-price" id="reels_price_text">$${reelsCountVal * REEL_PRICE_PER_UNIT}</span>
        </div>
        <div class="service-row">
            <label class="service-left">
                <input type="checkbox" id="srv_comments" ${hasComments ? 'checked' : ''} onchange="calculateModalTotal()">
                <span>التفاعل والرد على التعليقات</span>
            </label>
            <span class="service-price">$15</span>
        </div>
        <div class="service-row">
            <label class="service-left">
                <input type="checkbox" id="srv_messages" ${hasMessages ? 'checked' : ''} onchange="calculateModalTotal()">
                <span>الرد على الرسائل الخاصة</span>
            </label>
            <span class="service-price">$20</span>
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
    calculateModalTotal();
}

function calculateModalTotal() {
    const postsChecked = document.getElementById('srv_posts').checked;
    const reelsChecked = document.getElementById('srv_reels').checked;
    const reelsCount = parseInt(document.getElementById('reels_count').value) || 5;
    const commentsChecked = document.getElementById('srv_comments').checked;
    const messagesChecked = document.getElementById('srv_messages').checked;

    let subTotal = 0;
    if (postsChecked) subTotal += 25;
    if (reelsChecked) {
        const rCost = reelsCount * REEL_PRICE_PER_UNIT;
        subTotal += rCost;
        document.getElementById('reels_price_text').textContent = `$${rCost}`;
    } else {
        document.getElementById('reels_price_text').textContent = `$0`;
    }
    if (commentsChecked) subTotal += 15;
    if (messagesChecked) subTotal += 20;
}

function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
}

// تأكيد الحفظ للخدمات الأربع عبر الـ API
async function confirmPlatformSelection() {
    if (!currentPlatformKey) return;

    const posts = document.getElementById('srv_posts').checked;
    const reels = document.getElementById('srv_reels').checked;
    const rc = parseInt(document.getElementById('reels_count').value) || 5;
    const comments = document.getElementById('srv_comments').checked;
    const messages = document.getElementById('srv_messages').checked;

    const existingRecord = activePlatforms[currentPlatformKey] ? activePlatforms[currentPlatformKey].raw : null;
    
    if (!existingRecord || !existingRecord.account_id) {
        alert("يرجى ربط المنصة أساساً (تسجيل الدخول عبر الحساب) قبل تعديل الخدمات.");
        closeAuthModal();
        return;
    }

    try {
        const res = await fetch("https://api.protonag.com/social/meta/update-services", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + (localStorage.getItem("access_token") || "")
            },
            body: JSON.stringify({
                account_id: existingRecord.account_id,
                posts: posts,
                reels: reels,
                rc: rc,
                comments: comments,
                messages: messages
            }),
            credentials: 'include'
        });

        if (res.ok) {
            closeAuthModal();
            const activeBrand = localStorage.getItem("selected_brand_id");
            if (activeBrand) await loadBrandConnections(activeBrand);
        } else {
            alert("حدث خطأ أثناء حفظ تفاصيل الخدمات.");
        }
    } catch (err) {
        console.error("Error saving services:", err);
        alert("تعذر الاتصال بالخادم.");
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

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}
