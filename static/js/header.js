// ========================================
// ABSOLUTE ENGLISH - MAIN JAVASCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', function() {

    // ──────────────────────────────────────
    // 1. PAGE HEADER SCROLL ANIMATION
    // ──────────────────────────────────────
    const pageHeader = document.querySelector('.page-header');
    
    if (pageHeader) {
        let ticking = false;  // Performance optimisation

        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    const scrolled = window.scrollY;
                    const headerHeight = pageHeader.offsetHeight;
                    
                    // Only animate if header is in view
                    if (scrolled < headerHeight) {
                        const progress = scrolled / headerHeight;
                        pageHeader.style.transform = `translateY(${progress * 30}px)`;
                        pageHeader.style.opacity = 1 - progress;
                    } else {
                        // Fully hidden after scroll
                        pageHeader.style.opacity = 0;
                        pageHeader.style.transform = `translateY(30px)`;
                    }
                    
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ──────────────────────────────────────
    // 2. LIVE CHAT BUTTON
    // ──────────────────────────────────────
    const liveChatBtn = document.getElementById('liveChatBtn');
    
    if (liveChatBtn) {
        liveChatBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Professional way: Show a modal or open chat widget
            // Option 1: Alert (demo)
            // alert('🚀 Live Chat feature coming soon!');
            
            // Option 2: Open chat link in new tab
            // window.open('https://your-chat-link.com', '_blank');
            
            // Option 3: Show a floating chat modal (future)
            // openChatModal();
            
            // Temporary: Toast message (more user-friendly)
            showToast('Live Chat feature is coming soon! 🚀');
        });
    }

    // ──────────────────────────────────────
    // 3. HEADER STICKY/ACTIVE STATE (Optional)
    // ──────────────────────────────────────
    const mainHeader = document.querySelector('.main-header');
    
    if (mainHeader) {
        let lastScroll = 0;
        
        window.addEventListener('scroll', function() {
            const currentScroll = window.scrollY;
            
            // Add shadow when scrolled past top header
            if (currentScroll > 50) {
                mainHeader.classList.add('header-scrolled');
            } else {
                mainHeader.classList.remove('header-scrolled');
            }
            
            // Hide/show header on scroll (optional)
            if (currentScroll > lastScroll && currentScroll > 100) {
                // Scrolling down - hide header
                // mainHeader.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up - show header
                // mainHeader.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });
    }

    // ──────────────────────────────────────
    // 4. TOAST NOTIFICATION (Helper)
    // ──────────────────────────────────────
    function showToast(message) {
        // Check if toast container exists, create if not
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                max-width: 350px;
            `;
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.style.cssText = `
            background: #6c5ce7;
            color: white;
            padding: 14px 24px;
            border-radius: 12px;
            font-weight: 500;
            box-shadow: 0 8px 30px rgba(0,0,0,0.2);
            margin-bottom: 10px;
            transform: translateX(120%);
            transition: transform 0.4s ease;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 0.95rem;
        `;
        toast.innerHTML = `
            <span style="font-size:1.2rem;">💬</span>
            ${message}
        `;
        toastContainer.appendChild(toast);

        // Slide in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 50);

        // Auto dismiss after 4 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(120%)';
            setTimeout(() => {
                toast.remove();
            }, 400);
        }, 4000);

        // Click to dismiss immediately
        toast.addEventListener('click', function() {
            toast.style.transform = 'translateX(120%)';
            setTimeout(() => {
                toast.remove();
            }, 400);
        });
    }

});

// ──────────────────────────────────────
// 5. OPTIONAL: Chat Modal (Future)
// ──────────────────────────────────────
/*
function openChatModal() {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(4px);
    `;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 30px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        text-align: center;
    `;
    
    modal.innerHTML = `
        <h2 style="color:#6c5ce7;">💬 Live Chat</h2>
        <p style="color:#666;margin:15px 0;">Our team is ready to help you!</p>
        <input type="text" placeholder="Type your message..." style="
            width:100%;padding:12px;border:2px solid #ddd;
            border-radius:10px;margin-bottom:10px;
        ">
        <button onclick="this.closest('.modal-overlay').remove()" style="
            background:#6c5ce7;color:white;border:none;
            padding:12px 24px;border-radius:10px;
            cursor:pointer;font-weight:600;
        ">Send</button>
        <button onclick="this.closest('.modal-overlay').remove()" style="
            background:transparent;color:#999;border:none;
            margin-left:10px;cursor:pointer;
        ">Close</button>
    `;
    
    overlay.className = 'modal-overlay';
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Close on overlay click
    overlay.addEventListener('click', function(e) {
        if (e.target === this) this.remove();
    });
}
*/