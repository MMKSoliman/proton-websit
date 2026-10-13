document.addEventListener("DOMContentLoaded", function() {
    const sidebarHTML = `
    <aside class="fixed right-4 top-4 bottom-4 w-72 bg-[#121214]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 p-4">
        <div class="mb-6 pb-4 border-b border-white/10">
            <span class="text-white font-bold text-lg">لوحة التحكم</span>
        </div>
        <nav class="flex-1 space-y-3">
            <a href="connect-social.html" class="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all">
                <span class="text-sm font-medium">إدارة المنصات</span>
                <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
            </a>
        </nav>
        <div class="mt-auto pt-4 border-t border-white/10">
            <button class="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-sm">ترقية الآن</button>
        </div>
    </aside>`;
    document.body.insertAdjacentHTML('beforeend', sidebarHTML);
});
