// ========================================
// LANGUAGES PAGE - HORIZONTAL SCROLL
// ========================================

document.addEventListener('DOMContentLoaded', function() {

    const container = document.getElementById('scrollContainer');
    const scrollLeftBtn = document.getElementById('scrollLeft');
    const scrollRightBtn = document.getElementById('scrollRight');

    if (!container) return;

    // ========================================
    // MOUSE WHEEL / TRACKPAD SCROLL
    // ========================================

    container.addEventListener('wheel', function(e) {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            container.scrollLeft += e.deltaY;
        }
    }, { passive: false });

    // ========================================
    // SCROLL BUTTONS
    // ========================================

    if (scrollLeftBtn) {
        scrollLeftBtn.addEventListener('click', function() {
            container.scrollBy({
                left: -320,
                behavior: 'smooth'
            });
        });
    }

    if (scrollRightBtn) {
        scrollRightBtn.addEventListener('click', function() {
            container.scrollBy({
                left: 320,
                behavior: 'smooth'
            });
        });
    }

    // ========================================
    // MOUSE DRAG SCROLL
    // ========================================

    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;

    container.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.pageX;
        startScrollLeft = container.scrollLeft;
        container.style.cursor = 'grabbing';
    });

    container.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX;
        const walk = x - startX;
        container.scrollLeft = startScrollLeft - walk;
    });

    container.addEventListener('mouseup', function() {
        isDragging = false;
        container.style.cursor = 'grab';
    });

    container.addEventListener('mouseleave', function() {
        if (isDragging) {
            isDragging = false;
            container.style.cursor = 'grab';
        }
    });

    // ========================================
    // TOUCH SWIPE SUPPORT
    // ========================================

    let touchStartX = 0;
    let touchStartY = 0;

    container.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    container.addEventListener('touchend', function(e) {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;

        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                container.scrollBy({
                    left: 320,
                    behavior: 'smooth'
                });
            } else {
                container.scrollBy({
                    left: -320,
                    behavior: 'smooth'
                });
            }
        }
    }, { passive: true });

    // ========================================
    // KEYBOARD ARROW KEYS
    // ========================================

    document.addEventListener('keydown', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        if (e.key === 'ArrowLeft') {
            container.scrollBy({
                left: -320,
                behavior: 'smooth'
            });
        } else if (e.key === 'ArrowRight') {
            container.scrollBy({
                left: 320,
                behavior: 'smooth'
            });
        }
    });

    // ========================================
    // UPDATE BUTTON STATES
    // ========================================

    function updateButtons() {
        if (!scrollLeftBtn || !scrollRightBtn) return;

        const scrollLeft = container.scrollLeft;
        const maxScroll = container.scrollWidth - container.clientWidth;

        scrollLeftBtn.disabled = scrollLeft <= 10;
        scrollRightBtn.disabled = scrollLeft >= maxScroll - 10;
    }

    container.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);
    setTimeout(updateButtons, 100);

});