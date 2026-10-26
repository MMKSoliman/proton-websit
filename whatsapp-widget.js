document.addEventListener("DOMContentLoaded", function() {
    // 1. إضافة تنسيقات الـ CSS الخاصة بالزر المخصص والعنصر المنبثق
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
            background: rgba(22, 27, 34, 0.85);
            border: 1px solid rgba(0, 229, 255, 0.3);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
            cursor: pointer;
            text-decoration: none;
            overflow: hidden;
            transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s ease;
        }

        /* صورة شعار بروتون داخل الزر */
        .proton-whatsapp-btn img {
            width: 36px;
            height: 36px;
            object-fit: contain;
            transition: transform 0.6s ease;
        }

        /* لفة كاملة وزيادة التوهج عند مرور الماوس أو اللمس */
        .proton-whatsapp-btn:hover {
            transform: rotate(360deg);
            border-color: rgba(0, 229, 255, 0.8);
            box-shadow: 0 0 20px rgba(0, 229, 255, 0.4);
        }

        /* فقرة الرسالة التفاعلية بجانب الأيقونة */
        .proton-whatsapp-tooltip {
            position: absolute;
            right: 75px;
            bottom: 10px;
            background: #161b22;
            color: #ffffff;
            padding: 12px 16px;
            border-radius: 12px;
            border: 1px solid rgba(0, 229, 255, 0.25);
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            transform: translateX(10px);
            transition: opacity 0.3s ease, transform 0.3s ease;
            max-width: 280px;
        }

        .proton-whatsapp-tooltip .tooltip-title {
            font-size: 0.88rem;
            font-weight: 800;
            color: #00e5ff;
            margin-bottom: 2px;
            display: block;
        }

        .proton-whatsapp-tooltip .tooltip-desc {
            font-size: 0.78rem;
            color: rgba(255, 255, 255, 0.8);
            display: block;
        }

        /* إظهار الرسالة عند الوقوف على الزر */
        .proton-whatsapp-container:hover .proton-whatsapp-tooltip {
            opacity: 1;
            transform: translateX(0);
        }

        /* تكييف الموبايل */
        @media (max-width: 768px) {
            .proton-whatsapp-container {
                bottom: 16px;
                right: 16px;
            }
            .proton-whatsapp-btn {
                width: 52px;
                height: 52px;
            }
            .proton-whatsapp-btn img {
                width: 30px;
                height: 30px;
            }
            .proton-whatsapp-tooltip {
                display: none;
            }
        }
    `;
    document.head.appendChild(styleElement);

    // 2. إعدادات رقم الهاتف والرابط
    const phoneNumber = "201066581983"; // <--- ضع رقم هاتفك هنا بكود الدولة
    const defaultMessage = "مرحباً، لدي استفسار بخصوص خدمات أتمتة بروتون (Proton).";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

    // 3. بناء هيكل الأيقونة مع استبدال الأيقونة العادية بصورة براند بروتون
    const widgetHTML = `
        <div class="proton-whatsapp-container">
            <div class="proton-whatsapp-tooltip">
                <span class="tooltip-title">هل لديك استفسار؟</span>
                <span class="tooltip-desc">تواصل معنا الآن عبر واتساب 💬</span>
            </div>
            <a href="${whatsappUrl}" target="_blank" class="proton-whatsapp-btn" aria-label="تواصل عبر واتساب">
                <img src="./WA-W.webp" alt="Proton WhatsApp" onerror="this.src='./favicon.png'">
            </a>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', widgetHTML);
});
