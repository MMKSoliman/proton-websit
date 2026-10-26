document.addEventListener("DOMContentLoaded", function() {
    // 1. تنسيقات الـ CSS للأيقونة النيونية بدون دائرة خارجية
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
        .proton-whatsapp-container {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 99999;
            font-family: 'Cairo', sans-serif;
            direction: rtl;
        }

        .proton-whatsapp-btn {
            width: 60px;
            height: 60px;
            background: transparent;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            padding: 0;
            outline: none;
            position: relative;
            text-decoration: none;
            transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* التوهج الخلفي (Back-light) بدون إطار أو دائرة */
        .proton-whatsapp-btn::before {
            content: '';
            position: absolute;
            width: 45px;
            height: 45px;
            background: rgba(0, 229, 255, 0.4);
            border-radius: 50%;
            filter: blur(14px);
            z-index: 1;
            transition: all 0.4s ease;
        }

        .proton-whatsapp-btn img {
            width: 52px;
            height: 52px;
            object-fit: contain;
            position: relative;
            z-index: 2;
            transition: transform 0.6s ease;
        }

        /* لفة كاملة وتوهج مضاعف عند التحويم أو اللمس */
        .proton-whatsapp-btn:hover {
            transform: rotate(360deg);
        }

        .proton-whatsapp-btn:hover::before {
            background: rgba(0, 229, 255, 0.7);
            filter: blur(18px);
            width: 55px;
            height: 55px;
        }

        /* رسالة التلميح (Tooltip) الأنيقة */
        .proton-whatsapp-tooltip {
            position: absolute;
            right: 75px;
            bottom: 10px;
            background: #161b22;
            color: #ffffff;
            padding: 10px 14px;
            border-radius: 12px;
            border: 1px solid rgba(0, 229, 255, 0.3);
            box-shadow: 0 10px 25px rgba(0,0,0,0.6);
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            transform: translateX(10px);
            transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .proton-whatsapp-tooltip .tooltip-title {
            font-size: 0.85rem;
            font-weight: 800;
            color: #00e5ff;
            margin-bottom: 2px;
            display: block;
        }

        .proton-whatsapp-tooltip .tooltip-desc {
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.8);
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .proton-whatsapp-container:hover .proton-whatsapp-tooltip {
            opacity: 1;
            transform: translateX(0);
        }

        @media (max-width: 768px) {
            .proton-whatsapp-container {
                bottom: 16px;
                right: 16px;
            }
            .proton-whatsapp-tooltip {
                display: none;
            }
        }
    `;
    document.head.appendChild(styleElement);

    // 2. إعدادات رقم الهاتف والرسالة الافتراضية
    const phoneNumber = "201066581983"; // <--- اكتب رقمك هنا بكود الدولة (مثلاً 20مصر)
    const defaultMessage = "مرحباً، لدي استفسار بخصوص خدمات أتمتة بروتون (Proton).";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

    // 3. بناء الهيكل للزر المباشر
    const widgetHTML = `
        <div class="proton-whatsapp-container">
            <div class="proton-whatsapp-tooltip">
                <span class="tooltip-title">هل لديك استفسار؟</span>
                <span class="tooltip-desc">
                    تواصل معنا الآن عبر واتساب
                    <i class="fa-solid fa-comment-dots" style="color: #00e5ff;"></i>
                </span>
            </div>
            <a href="${whatsappUrl}" target="_blank" class="proton-whatsapp-btn" aria-label="تواصل عبر واتساب">
                <img src="./WA-P.webp" alt="Proton WhatsApp" onerror="this.src='./favicon.png'">
            </a>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', widgetHTML);
});
