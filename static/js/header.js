// Header animations
document.addEventListener('DOMContentLoaded', function() {
    const pageHeader = document.querySelector('.page-header');
    
    if (pageHeader) {
        window.addEventListener('scroll', function() {
            const scrolled = window.scrollY;
            if (scrolled < pageHeader.offsetHeight) {
                pageHeader.style.transform = `translateY(${scrolled * 0.3}px)`;
                pageHeader.style.opacity = 1 - (scrolled / pageHeader.offsetHeight);
            }
        });
    }
});