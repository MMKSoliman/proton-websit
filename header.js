(function() {
    // 1. حقن تنسيقات الـ CSS الخاصة بالهيدر والقوائم المنسدلة
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
            pointer-events: none;
        }
        .proton-header-actions {
            display: flex;
            align-items: center;
            gap: 12px;
            pointer-events: auto;
            margin-left: auto;
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
        .proton-header-btn img,
        .proton-header-btn svg {
            width: 20px !important;
            height: 20px !important;
            border-radius: 50%;
            object-fit: cover;
        }
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
            width: 210px;
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
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .proton-dropdown-item:hover {
            background: rgba(255,255,255,0.08);
            color: #fff;
        }
        .proton-dropdown-item.logout {
            color: #ff4d4d;
        }
        .proton-dropdown-item.logout:hover {
            background: rgba(255, 77, 77, 0.1);
        }
    `;
    document.head.appendChild(style);

    // 2. إنشاء هيكل الهيدر HTML
    const headerWrapper = document.createElement('div');
    headerWrapper.className = 'proton-global-header';
    
    headerWrapper.innerHTML = `
        <div></div>
        <div class="proton-header-actions">
            <div class="proton-dropdown-container">
                <button class="proton-header-btn" id="homeDropdownBtn" title="الرئيسية والصفحات">
                    <img src="./home.png" alt="Proton Home" style="border-radius: 0; object-fit: contain;">
                    <span>الرئيسية</span>
                </button>
                <div class="proton-dropdown-menu" id="pagesDropdownMenu">
                    <a href="./index.html" class="proton-dropdown-item">الرئيسية</a>
                    <a href="./dashboard.html" class="proton-dropdown-item">لوحة التحليلات</a>
                    <a href="./connect-social.html" class="proton-dropdown-item">ربط المنصات</a>
                    <a href="./onboarding.html" class="proton-dropdown-item">إعداد الحساب</a>
                </div>
            </div>

            <div class="proton-dropdown-container" id="userAuthContainer">
                <button class="proton-header-btn" id="userDropdownBtn">
                    <img src="./logout.png" alt="User" id="userAvatarIcon">
                    <span id="userAuthText">جاري التحقق...</span>
                </button>
                <div class="proton-dropdown-menu" id="userDropdownMenu"></div>
            </div>
        </div>
    `;

    document.addEventListener('DOMContentLoaded', () => {
        document.body.prepend(headerWrapper);

        const homeBtn = document.getElementById('homeDropdownBtn');
        const pagesMenu = document.getElementById('pagesDropdownMenu');
        const userBtn = document.getElementById('userDropdownBtn');
        const userMenu = document.getElementById('userDropdownMenu');

        homeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            pagesMenu.classList.toggle('active');
            userMenu.classList.remove('active');
        });

        userBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userMenu.classList.toggle('active');
            pagesMenu.classList.remove('active');
        });

        window.addEventListener('click', () => {
            pagesMenu.classList.remove('active');
            userMenu.classList.remove('active');
        });

        checkUserAuthState();
    });

    // دالة مساعدة لالتقاط التوكن من الـ URL أو الـ LocalStorage أو الـ Cookies
    function getAuthToken() {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenParam = urlParams.get('token');
        if (tokenParam) {
            localStorage.setItem('access_token', tokenParam);
            return tokenParam;
        }

        let token = localStorage.getItem('access_token');
        if (token) return token;

        // البحث في الكوكيز
        const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'));
        if (match) return match[2];

        return null;
    }

    async function checkUserAuthState() {
        const token = getAuthToken();
        const userAuthText = document.getElementById('userAuthText');
        const userAvatarIcon = document.getElementById('userAvatarIcon');
        const userMenu = document.getElementById('userDropdownMenu');

        const privacyLink = `<a href="./privacy.html" class="proton-dropdown-item">سياسة الخصوصية</a>`;
        const termsLink = `<a href="./terms.html" class="proton-dropdown-item">شروط الإستخدام</a>`;
        const settingsLink = `<a href="./onboarding.html" class="proton-dropdown-item">إعدادات الحساب</a>`;

        if (!token) {
            userAuthText.textContent = 'تسجيل الدخول';
            userAvatarIcon.src = './logout.png';
            userMenu.innerHTML = `
                <a href="./auth.html" class="proton-dropdown-item">تسجيل الدخول</a>
                ${settingsLink}
                ${privacyLink}
                ${termsLink}
            `;
            return;
        }

        try {
            // تصحيح مسار الـ API ليتوافق مع هيكل الـ Backend لديك
            const response = await fetch('https://protonag.com/api/auth/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                
                if (data.full_name) {
                    const firstName = data.full_name.split(' ')[0];
                    userAuthText.textContent = firstName;
                } else {
                    userAuthText.textContent = 'حسابي';
                }
                
                if (data.profile_picture) {
                    userAvatarIcon.src = data.profile_picture;
                } else {
                    userAvatarIcon.src = 'https://www.svgrepo.com/show/498369/profile-circle.svg';
                }

                userMenu.innerHTML = `
                    ${settingsLink}
                    ${privacyLink}
                    ${termsLink}
                    <a href="#" class="proton-dropdown-item logout" id="logoutBtn">تسجيل الدخول الخروج</a>
                `;

                document.getElementById('logoutBtn').addEventListener('click', (e) => {
                    e.preventDefault();
                    localStorage.removeItem('access_token');
                    document.cookie = 'access_token=; Max-Age=0; path=/;';
                    window.location.href = './auth.html';
                });

            } else {
                localStorage.removeItem('access_token');
                userAuthText.textContent = 'تسجيل الدخول';
                userAvatarIcon.src = './logout.png';
                userMenu.innerHTML = `
                    <a href="./auth.html" class="proton-dropdown-item">تسجيل الدخول</a>
                    ${settingsLink}
                    ${privacyLink}
                    ${termsLink}
                `;
            }
        } catch (err) {
            console.error("Auth check error:", err);
            userAuthText.textContent = 'حسابي';
            userMenu.innerHTML = `
                <a href="./auth.html" class="proton-dropdown-item">تسجيل الدخول</a>
                ${settingsLink}
                ${privacyLink}
                ${termsLink}
            `;
        }
    }
})();
