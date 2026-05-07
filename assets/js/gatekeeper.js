// NexMart Gatekeeper - Security System
(function() {
    const ACCESS_CODE = "imam77"; // Kode akses Anda
    const AUTH_KEY = "nexmart_auth_token";

    function checkAuth() {
        if (localStorage.getItem(AUTH_KEY) === "authorized") {
            return;
        }

        const overlay = document.createElement('div');
        overlay.id = "security-gate";
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #0f172a;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            font-family: 'Inter', sans-serif;
            text-align: center;
        `;

        overlay.innerHTML = `
            <div class="glass" style="padding: 40px; border-radius: 20px; max-width: 400px; width: 90%; border: 1px solid rgba(255,255,255,0.1);">
                <i class="fa-solid fa-lock" style="font-size: 3rem; color: #00f2ff; margin-bottom: 20px;"></i>
                <h2 style="margin-bottom: 10px;">Akses Terbatas</h2>
                <p style="color: #94a3b8; margin-bottom: 30px; font-size: 0.9rem;">NexMart sedang dalam tahap pengembangan pribadi. Masukkan kode akses untuk melanjutkan.</p>
                <input type="password" id="gate-code" placeholder="Masukkan Kode" style="width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #334155; background: #1e293b; color: white; margin-bottom: 20px; text-align: center; outline: none;">
                <button id="unlock-btn" class="btn btn-primary" style="width: 100%; justify-content: center;">Buka Kunci</button>
                <p id="gate-error" style="color: #ef4444; margin-top: 15px; font-size: 0.8rem; display: none;">Kode salah, silakan coba lagi.</p>
            </div>
        `;

        document.body.appendChild(overlay);

        document.getElementById('unlock-btn').addEventListener('click', () => {
            const code = document.getElementById('gate-code').value;
            if (code === ACCESS_CODE) {
                localStorage.setItem(AUTH_KEY, "authorized");
                overlay.style.opacity = "0";
                setTimeout(() => overlay.remove(), 300);
            } else {
                const error = document.getElementById('gate-error');
                error.style.display = "block";
                document.getElementById('gate-code').value = "";
            }
        });

        // Allow Enter key
        document.getElementById('gate-code').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') document.getElementById('unlock-btn').click();
        });
    }

    // Run check
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAuth);
    } else {
        checkAuth();
    }
})();
