(function() {
    // 1. حقن كود تتبع Google Analytics مباشرة في الـ head
    const gaScript1 = document.createElement('script');
    gaScript1.async = true;
    gaScript1.src = 'https://www.googletagmanager.com/gtag/js?id=G-RPSNN0T3PW';
    document.head.appendChild(gaScript1);

    const gaScript2 = document.createElement('script');
    gaScript2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-RPSNN0T3PW');
    `;
    document.head.appendChild(gaScript2);

    // 2. حقن تنسيقات الـ CSS الخاصة بالهيدر واللوجو والقوائم المنسدلة
    const style = document.createElement('style');
    style.innerHTML = `
        .proton-global-header {
            position: fixed !important;
            top: 15px !important;
            right: 20px !important;
            left: 20px !important;
            display: flex !important;
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: center !important;
            z-index: 999999 !important;
            pointer-events: none !important;
            gap: 12px !important;
            direction: ltr !important;
            box-sizing: border-box !important;
        }

        .proton-header-brand {
            pointer-events: auto !important;
            display: flex !important;
            align-items: center !important;
            text-decoration: none !important;
            flex-shrink: 0 !important;
            order: 1 !important;
        }

        .proton-logo-img {
            height: 57px !important;
            max-width: 255px !important;
            width: auto !important;
            object-fit: contain !important;
            display: block !important;
            filter: drop-shadow(0 2px 8px rgba(0, 229, 255, 0.3)) !important;
            transition: transform 0.3s ease, filter 0.3s ease !important;
        }

        .proton-header-brand:hover .proton-logo-img {
            transform: scale(1.03) !important;
            filter: drop-shadow(0 4px 14px rgba(0, 229, 255, 0.5)) !important;
        }

        .proton-header-actions {
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
            pointer-events: auto !important;
            direction: rtl !important;
            order: 2 !important;
        }

        .proton-header-btn {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 8px !important;
            background: rgba(20, 20, 20, 0.85) !important;
            border: 1px solid rgba(255, 255, 255, 0.15) !important;
            padding: 8px 14px !important;
            border-radius: 50px !important;
            color: #fff !important;
            text-decoration: none !important;
            font-family: inherit !important;
            font-size: 13.5px !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            transition: all 0.3s ease !important;
            cursor: pointer !important;
            box-sizing: border-box !important;
            white-space: nowrap !important;
            outline: none !important;
        }

        .proton-header-btn:hover {
            border-color: rgba(0, 229, 255, 0.5) !important;
            background: rgba(30, 30, 30, 0.95) !important;
            box-shadow: 0 4px 15px rgba(0, 229, 255, 0.15) !important;
        }

        .proton-header-btn img,
        .proton-header-btn svg {
            width: 18px !important;
            height: 18px !important;
            border-radius: 50% !important;
            object-fit: cover !important;
            flex-shrink: 0 !important;
        }

        .proton-dropdown-container {
            position: relative !important;
            pointer-events: auto !important;
        }

        .proton-dropdown-menu {
            position: absolute !important;
            top: 48px !important;
            right: 0 !important;
            background: rgba(20, 20, 25, 0.95) !important;
            border: 1px solid rgba(255, 255, 255, 0.12) !important;
            border-radius: 12px !important;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6) !important;
            width: 200px !important;
            display: none;
            flex-direction: column !important;
            overflow: hidden !important;
            z-index: 1000000 !important;
            backdrop-filter: blur(15px) !important;
            -webkit-backdrop-filter: blur(15px) !important;
            direction: rtl !important;
        }

        .proton-dropdown-menu.active {
            display: flex !important;
        }

        .proton-dropdown-item {
            padding: 10px 14px !important;
            color: #ccc !important;
            text-decoration: none !important;
            font-size: 13px !important;
            transition: background 0.2s, color 0.2s !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
        }

        .proton-dropdown-item:hover {
            background: rgba(0, 229, 255, 0.1) !important;
            color: #fff !important;
        }

        .proton-dropdown-item.logout {
            color: #ff4d4d !important;
        }

        .proton-dropdown-item.logout:hover {
            background: rgba(255, 77, 77, 0.12) !important;
        }

        @media (max-width: 650px) {
            .proton-global-header {
                top: 10px !important;
                right: 10px !important;
                left: 10px !important;
                gap: 6px !important;
            }

            .proton-logo-img {
                height: 42px !important;
                max-width: 165px !important;
            }

            .proton-header-actions {
                gap: 6px !important;
            }

            .proton-header-btn {
                padding: 6px 10px !important;
                font-size: 12px !important;
                gap: 5px !important;
            }

            .proton-header-btn img,
            .proton-header-btn svg {
                width: 15px !important;
                height: 15px !important;
            }

            .proton-dropdown-menu {
                width: 160px !important;
                top: 40px !important;
            }
        }
    `;
    document.head.appendChild(style);

    // 3. إنشاء هيكل الهيدر HTML مع الترتيب الصحيح
    const headerWrapper = document.createElement('div');
    headerWrapper.className = 'proton-global-header';
    
    headerWrapper.innerHTML = `
        <a href="./index.html" class="proton-header-brand" title="الرئيسية - Proton">
            <img src="./logo_06.webp" alt="Proton Logo" class="proton-logo-img">
        </a>

        <div class="proton-header-actions">
            <div class="proton-dropdown-container">
                <button class="proton-header-btn" id="homeDropdownBtn" title="الرئيسية والصفحات">
                    <img src="./home.webp" alt="Proton Home" style="border-radius: 0; object-fit: contain;">
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
                    <img src="./User-W.webp" alt="User" id="userAvatarIcon">
                    <span id="userAuthText">جاري التحقق...</span>
                </button>
                <div class="proton-dropdown-menu" id="userDropdownMenu"></div>
            </div>
        </div>
    `;

    function initHeader() {
        if (!document.body.contains(headerWrapper)) {
            document.body.prepend(headerWrapper);
        }

        const homeBtn = document.getElementById('homeDropdownBtn');
        const pagesMenu = document.getElementById('pagesDropdownMenu');
        const userBtn = document.getElementById('userDropdownBtn');
        const userMenu = document.getElementById('userDropdownMenu');

        if (homeBtn && pagesMenu) {
            homeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                pagesMenu.classList.toggle('active');
                if (userMenu) userMenu.classList.remove('active');
            });
        }

        if (userBtn && userMenu) {
            userBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userMenu.classList.toggle('active');
                if (pagesMenu) pagesMenu.classList.remove('active');
            });
        }

        window.addEventListener('click', () => {
            if (pagesMenu) pagesMenu.classList.remove('active');
            if (userMenu) userMenu.classList.remove('active');
        });

        checkUserAuthState();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeader);
    } else {
        initHeader();
    }

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

        if (!userAuthText || !userAvatarIcon || !userMenu) return;

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
                    userAvatarIcon.src = "./User-W.webp";
                }

                userMenu.innerHTML = `
                    ${settingsLink}
                    <a href="#" class="proton-dropdown-item logout" id="logoutBtn">تسجيل الخروج</a>
                `;

                const logoutBtn = document.getElementById('logoutBtn');
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('user_id');
                        localStorage.removeItem('user_name');
                        localStorage.removeItem('user_picture');
                        document.cookie = 'access_token=; Max-Age=0; path=/;';
                        window.location.href = './auth.html';
                    });
                }

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
        iconEl.src = './User-W.webp';
        menuEl.innerHTML = `
            <a href="./auth.html" class="proton-dropdown-item">تسجيل الدخول</a>
            ${sLink}
        `;
    }
})();
