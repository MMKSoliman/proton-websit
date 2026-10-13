<!-- Sidebar Container (Floating & Dark Glassmorphism) -->
<aside id="app-sidebar" class="fixed right-4 top-4 bottom-4 w-72 bg-[#121214]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 p-4 transition-all duration-300">
    
    <!-- Header / Brand Selector Area -->
    <div class="mb-6 pb-4 border-b border-white/10">
        <div id="brand-selector-container" class="w-full">
            <!-- يتم حقن قائمة العلامات التجارية أو القائمة المنسدلة هنا -->
        </div>
    </div>

    <!-- Navigation / Platform Links Area -->
    <nav class="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
        <a href="connect-social.html" class="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 text-white transition-all group">
            <span class="text-sm font-medium">إدارة المنصات</span>
            <span class="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"></span>
        </a>
        <!-- بقية روابط القائمة بنفس التصميم العصري -->
    </nav>

    <!-- Footer / Subscription or Action Area -->
    <div class="mt-auto pt-4 border-t border-white/10 space-y-2">
        <div class="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center">
            <span class="text-xs text-cyan-400 font-semibold block">الباقة الحالية</span>
            <span class="text-sm text-white font-bold">شهرياً</span>
        </div>
        <button class="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-sm shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all">
            ترقية الآن
        </button>
    </div>
</aside>

<style>
    /* تخصيص السكرول بار ليكون ناعماً ومتوافقاً مع التصميم الداكن */
    .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.2);
    }
</style>
