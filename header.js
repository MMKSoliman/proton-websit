(function() {
    // 1. حقن تنسيقات الـ CSS الخاصة بالهيدر العلوي لضمان عدم التعارض وتثبيتها في أقصى اليمين
    const style = document.createElement('style');
    style.innerHTML = `
        .proton-global-header {
            position: fixed;
            top: 15px;
            right: 20px;
            left: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 9999;
            pointer-events: none; /* للسماح بالنقر على ما تحت الفراغ إن وجد */
        }
        .proton-header-actions {
            display: flex;
            align-items: center;
            gap: 12px;
            pointer-events: auto;
            margin-left: auto; /* دفع العناصر لأقصى اليمين في اتجاه RTL */
        }
        .proton-header-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(20, 20, 20, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.15);
            padding: 8px 14px;
            border-radius: 50px;
            color: #fff;
            text-decoration: none;
            font-family: inherit;
            font-size: 14px;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            cursor: pointer;
        }
        .proton-header-btn:hover {
            border-color: rgba(0, 255, 200, 0.5);
            background: rgba(30, 30, 30, 0.95);
        }
        .proton-header-btn img {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            object-fit: cover;
        }
        /* القائمة المنسدلة لأيقونة الموقع */
        .proton-dropdown-container {
            position: relative;
            pointer-events: auto;
        }
        .proton-dropdown-menu {
            position: absolute;
            top: 45px;
            right: 0;
            background: #1a1a1a;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            width: 200px;
            display: none;
            flex-direction: column;
            overflow: hidden;
            z-index: 10000;
        }
        .proton-dropdown-menu.active {
            display: flex;
        }
        .proton-dropdown-item {
            padding: 10px 15px;
            color: #ccc;
            text-decoration: none;
            font-size: 13px;
            transition: background 0.2s;
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .proton-dropdown-item:hover {
            background: rgba(255,255,255,0.08);
            color: #fff;
        }
    `;
    document.head.appendChild(style);

    // 2. إنشاء هيكل الهيدر HTML
    const headerWrapper = document.createElement('div');
    headerWrapper.className = 'proton-global-header';
    
    headerWrapper.innerHTML = `
        <!-- أقصى اليسار أو حسب التنسيق: أزرار التحكم -->
        <div></div>
        
        <div class="proton-header-actions">
            <!-- أيقونة الموقع الرئيسية مع القائمة المنسدلة لجميع الصفحات -->
            <div class="proton-dropdown-container">
                <button class="proton-header-btn" id="homeDropdownBtn" title="الرئيسية والصفحات">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    <span>الرئيسية</span>
                </button>
                <div class="proton-dropdown-menu" id="pagesDropdownMenu">
                    <a href="./index.html" class="proton-dropdown-item">الرئيسية</a>
                    <a href="./dashboard.html" class="proton-dropdown-item">لوحة التحليلات</a>
                    <a href="./connect-social.html" class="proton-dropdown-item">ربط المنصات</a>
                    <a href="./onboarding.html" class="proton-dropdown-item">إعداد الحساب</a>
                </div>
            </div>

            <!-- أيقونة المستخدم (تتغير تلقائياً حسب حالة تسجيل الدخول) -->
            <a href="./index.html" class="proton-header-btn" id="userAuthBtn">
                <img src="https://protonag.com/logout.png" alt="User" id="userAvatarIcon">
                <span id="userAuthText">تسجيل الدخول</span>
            </a>
        </div>
    `;

    // إدراج الهيدر في بداية الـ body تلقائياً
    document.addEventListener('DOMContentLoaded', () => {
        document.body.prepend(headerWrapper);

        // تفاعلات القائمة المنسدلة للرئيسية
        const homeBtn = document.getElementById('homeDropdownBtn');
        const pagesMenu = document.getElementById('pagesDropdownMenu');

        homeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            pagesMenu.classList.toggle('active');
        });

        window.addEventListener('click', () => {
            pagesMenu.classList.remove('active');
        });

        // 3. التحقق من حالة تسجيل الدخول عبر جلب بيانات المستخدم من الباك إند
        checkUserAuthState();
    });

    async function checkUserAuthState() {
        const token = localStorage.getItem('access_token');
        const userAuthText = document.getElementById('userAuthText');
        const userAuthBtn = document.getElementById('userAuthBtn');
        const userAvatarIcon = document.getElementById('userAvatarIcon');

        if (!token) {
            // غير مسجل دخول
            userAuthText.textContent = 'تسجيل الدخول';
            userAuthBtn.href = './index.html'; // أو صفحة الدخول الخاصة بك
            return;
        }

        try {
            const response = await fetch('https://api.protonag.com/v1/auth/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });

            if (response.ok) {
                const data = await response.json();
                // مسجل دخول: عرض الاسم الأول وصورة الحساب
                if (data.full_name) {
                    const firstName = data.full_name.split(' ')[0];
                    userAuthText.textContent = firstName;
                } else {
                    userAuthText.textContent = 'حسابي';
                }
                
                if (data.profile_picture) {
                    userAvatarIcon.src = data.profile_picture;
                }

                // عند الضغط يوجهه للوحة التحكم مباشرة بدلاً من صفحة الدخول
                userAuthBtn.href = './dashboard.html';
            } else {
                // توكن منتهي أو غير صالح
                localStorage.removeItem('access_token');
                userAuthText.textContent = 'تسجيل الدخول';
                userAuthBtn.href = './index.html';
            }
        } catch (err) {
            console.error("Auth check error:", err);
        }
    }
})();