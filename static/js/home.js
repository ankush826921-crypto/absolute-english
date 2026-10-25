// ========================================
// HOME PAGE ANIMATIONS
// ========================================

document.addEventListener('DOMContentLoaded', function () {

    // ========================================
    // COUNTER ANIMATION
    // ========================================

    const statNumbers = document.querySelectorAll('.stat-item h3');
    let animated = false;

    function animateCounters() {

        statNumbers.forEach(stat => {

            const text = stat.textContent;
            const target = parseInt(text);

            if (!isNaN(target) && target > 0) {

                let current = 0;
                const increment = target / 50;

                const timer = setInterval(() => {

                    current += increment;

                    if (current >= target) {

                        stat.textContent = target + '+';
                        clearInterval(timer);

                    } else {

                        stat.textContent = Math.floor(current) + '+';
                    }

                }, 30);
            }
        });
    }

    const statsSection = document.querySelector('.hero-stats');

    if (statsSection) {

        const statsObserver = new IntersectionObserver(function (entries) {

            entries.forEach(entry => {

                if (entry.isIntersecting && !animated) {

                    animateCounters();
                    animated = true;
                }
            });

        }, {
            threshold: 0.5
        });

        statsObserver.observe(statsSection);
    }


    // ========================================
    // ANIMATE ELEMENTS ON SCROLL
    // ========================================

    const animateElements = document.querySelectorAll(
        '.language-card, .course-card, .feature-card'
    );

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';

                observer.unobserve(entry.target);
            }
        });

    }, observerOptions);

    animateElements.forEach(element => {

        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';

        observer.observe(element);
    });

});


// ========================================
// LANGUAGES SECTION
// AUTO-SCROLL: OFF
// BUTTONS: REMOVED
// ========================================

// No JavaScript is required for the language
// cards anymore.
//
// The language cards are now static.
// Their position/centering is handled by home.css.



// ========================================
// COURSES SECTION
// AUTO-SCROLL: OFF
// BUTTONS: REMOVED
// ========================================

// No JavaScript is required for the course
// cards anymore.
//
// The course cards are now static.
// Their position/centering is handled by home.css.



// ========================================
// TESTIMONIALS - MANUAL SCROLL
// (No Auto-Scroll)
// ========================================

document.addEventListener('DOMContentLoaded', function () {

    const container = document.getElementById('testimonialsScrollContainer');
    const leftBtn = document.getElementById('testimonialsScrollLeft');
    const rightBtn = document.getElementById('testimonialsScrollRight');

    if (!container || !leftBtn || !rightBtn) return;


    // ========================================
    // LEFT BUTTON
    // ========================================

    leftBtn.addEventListener('click', function () {

        container.scrollBy({
            left: -320,
            behavior: 'smooth'
        });

    });


    // ========================================
    // RIGHT BUTTON
    // ========================================

    rightBtn.addEventListener('click', function () {

        container.scrollBy({
            left: 320,
            behavior: 'smooth'
        });

    });


    // ========================================
    // UPDATE BUTTON STATES
    // ========================================

    function updateButtons() {

        const scrollLeft = container.scrollLeft;
        const maxScroll = container.scrollWidth - container.clientWidth;

        leftBtn.disabled = scrollLeft <= 10;
        rightBtn.disabled = scrollLeft >= maxScroll - 10;
    }

    container.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);

    setTimeout(updateButtons, 100);


    // ========================================
    // KEYBOARD CONTROLS
    // ========================================

    document.addEventListener('keydown', function (e) {

        if (
            e.target.tagName === 'INPUT' ||
            e.target.tagName === 'TEXTAREA'
        ) {
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

});


// ========================================
// HERO SECTION - BACKGROUND SLIDESHOW
// ========================================

document.addEventListener('DOMContentLoaded', function () {

    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');

    if (!slides.length || !dots.length) return;

    let currentSlide = 0;
    let slideInterval;

    const slideDelay = 5000;


    // ========================================
    // SHOW SLIDE
    // ========================================

    function showSlide(index) {

        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        slides[index].classList.add('active');
        dots[index].classList.add('active');

        currentSlide = index;
    }


    // ========================================
    // NEXT SLIDE
    // ========================================

    function nextSlide() {

        const next = (currentSlide + 1) % slides.length;

        showSlide(next);
    }


    // ========================================
    // START AUTOPLAY
    // ========================================

    function startAutoplay() {

        if (slideInterval) {
            clearInterval(slideInterval);
        }

        slideInterval = setInterval(nextSlide, slideDelay);
    }


    // ========================================
    // STOP AUTOPLAY
    // ========================================

    function stopAutoplay() {

        if (slideInterval) {

            clearInterval(slideInterval);
            slideInterval = null;
        }
    }


    // ========================================
    // DOT CLICK EVENTS
    // ========================================

    dots.forEach((dot, index) => {

        dot.addEventListener('click', function () {

            stopAutoplay();

            showSlide(index);

            startAutoplay();
        });

    });


    // ========================================
    // HERO MOUSE / TOUCH EVENTS
    // ========================================

    const heroSection = document.getElementById('heroSection');

    if (heroSection) {

        heroSection.addEventListener(
            'mouseenter',
            stopAutoplay
        );

        heroSection.addEventListener(
            'mouseleave',
            startAutoplay
        );

        heroSection.addEventListener(
            'touchstart',
            stopAutoplay
        );

        heroSection.addEventListener(
            'touchend',
            function () {

                setTimeout(startAutoplay, 3000);

            }
        );
    }


    // ========================================
    // HERO KEYBOARD CONTROLS
    // ========================================

    document.addEventListener('keydown', function (e) {

        if (e.key === 'ArrowLeft') {

            stopAutoplay();

            const prev =
                (currentSlide - 1 + slides.length) % slides.length;

            showSlide(prev);

            startAutoplay();

        } else if (e.key === 'ArrowRight') {

            stopAutoplay();

            nextSlide();

            startAutoplay();
        }

    });


    // ========================================
    // INITIALIZE
    // ========================================

    showSlide(0);
    startAutoplay();

});