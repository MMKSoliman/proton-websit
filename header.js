(function() {
    // 1. حقن تنسيقات الـ CSS الخاصة بالهيدر واللوجو والقوائم المنسدلة
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
            gap: 12px;
            /* تثبيت الاتجاه ليكون اللوجو يسار والأزرار يمين بغض النظر عن dir=rtl */
            direction: ltr !important;
        }

        /* حاوية اللوجو في جهة اليسار */
        .proton-header-brand {
            pointer-events: auto;
            display: flex;
            align-items: center;
            text-decoration: none;
            flex-shrink: 0;
        }

        .proton-logo-img {
            height: 38px;
            max-width: 170px;
            width: auto;
            object-fit: contain;
            display: block;
            filter: drop-shadow(0 2px 8px rgba(0, 229, 255, 0.3));
            transition: transform 0.3s ease, filter 0.3s ease;
        }

        .proton-header-brand:hover .proton-logo-img {
            transform: scale(1.03);
            filter: drop-shadow(0 4px 14px rgba(0, 229, 255, 0.5));
        }

        /* الأزرار والقوائم في جهة اليمين */
        .proton-header-actions {
            display: flex;
            align-items: center;
            gap: 10px;
            pointer-events: auto;
            direction: rtl !important; /* إبقاء النصوص والأيقونات داخل الأزرار بالاتجاه العربي */
        }

        .proton-header-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: rgba(20, 20, 20, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.15);
            padding: 8px 14px;
            border-radius: 50px;
            color: #fff;
            text-decoration: none;
            font-family: inherit;
            font-size: 13.5px;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            cursor: pointer;
            box-sizing: border-box;
            white-space: nowrap;
        }

        .proton-header-btn:hover {
            border-color: rgba(0, 229, 255, 0.5);
            background: rgba(30, 30, 30, 0.95);
            box-shadow: 0 4px 15px rgba(0, 229, 255, 0.15);
        }

        .proton-header-btn img,
        .proton-header-btn svg {
            width: 18px !important;
            height: 18px !important;
            border-radius: 50%;
            object-fit: cover;
            flex-shrink: 0;
        }

        .proton-dropdown-container {
            position: relative;
            pointer-events: auto;
        }

        .proton-dropdown-menu {
            position: absolute;
            top: 45px;
            right: 0;
            background: rgba(20, 20, 25, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
            width: 200px;
            display: none;
            flex-direction: column;
            overflow: hidden;
            z-index: 10000;
            backdrop-filter: blur(15px);
            direction: rtl !important;
        }

        .proton-dropdown-menu.active {
            display: flex;
        }

        .proton-dropdown-item {
            padding: 10px 14px;
            color: #ccc;
            text-decoration: none;
            font-size: 13px;
            transition: background 0.2s, color 0.2s;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .proton-dropdown-item:hover {
            background: rgba(0, 229, 255, 0.1);
            color: #fff;
        }

        .proton-dropdown-item.logout {
            color: #ff4d4d;
        }

        .proton-dropdown-item.logout:hover {
            background: rgba(255, 77, 77, 0.12);
        }

        /* تجاوب ممتاز لشاشات الموبايل */
        @media (max-width: 650px) {
            .proton-global-header {
                top: 10px;
                right: 10px;
                left: 10px;
                gap: 6px;
            }

            .proton-logo-img {
                height: 28px;
                max-width: 110px;
            }

            .proton-header-actions {
                gap: 6px;
            }

            .proton-header-btn {
                padding: 6px 10px;
                font-size: 12px;
                gap: 5px;
            }

            .proton-header-btn img,
            .proton-header-btn svg {
                width: 15px !important;
                height: 15px !important;
            }

            .proton-dropdown-menu {
                width: 160px;
                top: 40px;
            }
        }
    `;
    document.head.appendChild(style);

    // 2. إنشاء هيكل الهيدر HTML
    const headerWrapper = document.createElement('div');
    headerWrapper.className = 'proton-global-header';
    
    headerWrapper.innerHTML = `
        <!-- أزرار الإجراءات في اليمين -->
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
                    <a href="./privacy.html" class="proton-dropdown-item">سياسة الخصوصية</a>
                    <a href="./terms.html" class="proton-dropdown-item">شروط الإستخدام</a>
                </div>
            </div>

            <div class="proton-dropdown-container" id="userAuthContainer">
                <button class="proton-header-btn" id="userDropdownBtn">
                    <img src="./login.png" alt="User" id="userAvatarIcon">
                    <span id="userAuthText">جاري التحقق...</span>
                </button>
                <div class="proton-dropdown-menu" id="userDropdownMenu"></div>
            </div>
        </div>

        <!-- اللوجو في اليسار مربوط بالصفحة الرئيسية -->
        <a href="./index.html" class="proton-header-brand" title="الرئيسية - Proton">
            <img src="./logo_06.png" alt="Proton Logo" class="proton-logo-img">
        </a>
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

    // دالة لاستخراج التوكن وحفظه بالمتصفح
    function getAuthToken() {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenParam = urlParams.get('token');
        if (tokenParam) {
            localStorage.setItem('access_token', tokenParam);
            urlParams.delete('token');
            const newRelativePathQuery = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
            window.history.replaceState(null, '', newRelativePathQuery);
            return tokenParam;
        }

        let token = localStorage.getItem('access_token');
        if (token) return token;

        const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'));
        if (match) return match[2];

        return null;
    }

    async function checkUserAuthState() {
        const token = getAuthToken();
        const userAuthText = document.getElementById('userAuthText');
        const userAvatarIcon = document.getElementById('userAvatarIcon');
        const userMenu = document.getElementById('userDropdownMenu');

        const settingsLink = `<a href="./account-settings.html" class="proton-dropdown-item">إعدادات الحساب</a>`;

        if (!token) {
            setUserLoggedOut(userAuthText, userAvatarIcon, userMenu, settingsLink);
            return;
        }

        try {
            const response = await fetch('https://api.protonag.com/auth/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                
                if (data.user_id) {
                    localStorage.setItem('user_id', data.user_id);
                }
                
                if (data.user_name) {
                    localStorage.setItem('user_name', data.user_name);
                    userAuthText.textContent = data.user_name.split(' ')[0];
                } else if (data.full_name) {
                    localStorage.setItem('user_name', data.full_name);
                    userAuthText.textContent = data.full_name.split(' ')[0];
                } else {
                    userAuthText.textContent = 'حسابي';
                }
                
                if (data.profile_picture) {
                    localStorage.setItem('user_picture', data.profile_picture);
                    userAvatarIcon.src = data.profile_picture;
                } else {
                    userAvatarIcon.src = "./login.png";
                }

                userMenu.innerHTML = `
                    ${settingsLink}
                    <a href="#" class="proton-dropdown-item logout" id="logoutBtn">تسجيل الخروج</a>
                `;

                document.getElementById('logoutBtn').addEventListener('click', (e) => {
                    e.preventDefault();
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user_id');
                    localStorage.removeItem('user_name');
                    localStorage.removeItem('user_picture');
                    document.cookie = 'access_token=; Max-Age=0; path=/;';
                    window.location.href = './auth.html';
                });

            } else {
                const cachedName = localStorage.getItem('user_name');
                const cachedPic = localStorage.getItem('user_picture');
                
                if (cachedName && cachedPic) {
                    userAuthText.textContent = cachedName.split(' ')[0];
                    userAvatarIcon.src = cachedPic;
                } else {
                    throw new Error("Invalid session");
                }
            }
        } catch (err) {
            console.error("Auth check error:", err);
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_id');
            localStorage.removeItem('user_name');
            localStorage.removeItem('user_picture');
            setUserLoggedOut(userAuthText, userAvatarIcon, userMenu, settingsLink);
        }
    }

    function setUserLoggedOut(textEl, iconEl, menuEl, sLink) {
        textEl.textContent = 'تسجيل الدخول';
        iconEl.src = './login.png';
        menuEl.innerHTML = `
            <a href="./auth.html" class="proton-dropdown-item">تسجيل الدخول</a>
            ${sLink}
        `;
    }
})();
