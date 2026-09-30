/* =========================================================
   ABSOLUTE ENGLISH — HOME PAGE JS
   Clean · No Auto-Scroll · Buttons Only
========================================================= */

document.addEventListener('DOMContentLoaded', function () {

    /* =====================================================
       1. COUNTER ANIMATION
    ===================================================== */

    const statNumbers = document.querySelectorAll('.stat-item h3');
    let counterAnimated = false;

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
                if (entry.isIntersecting && !counterAnimated) {
                    animateCounters();
                    counterAnimated = true;
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }


    /* =====================================================
       2. SCROLL REVEAL ANIMATIONS
    ===================================================== */

    const animateElements = document.querySelectorAll(
        '.language-card, .course-card, .feature-card'
    );

    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
        revealObserver.observe(element);
    });


    /* =====================================================
       3. HERO BACKGROUND SLIDESHOW
    ===================================================== */

    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');

    if (slides.length > 0) {

        let currentSlide = 0;
        let slideInterval;
        const slideDelay = 5000;

        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            slides[index].classList.add('active');
            if (dots[index]) dots[index].classList.add('active');

            currentSlide = index;
        }

        function nextSlide() {
            const next = (currentSlide + 1) % slides.length;
            showSlide(next);
        }

        function startAutoplay() {
            if (slideInterval) clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, slideDelay);
        }

        function stopAutoplay() {
            if (slideInterval) {
                clearInterval(slideInterval);
                slideInterval = null;
            }
        }

        // Dot click
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function () {
                stopAutoplay();
                showSlide(index);
                startAutoplay();
            });
        });

        // Pause on hover / touch
        const heroSection = document.getElementById('heroSection');

        if (heroSection) {
            heroSection.addEventListener('mouseenter', stopAutoplay);
            heroSection.addEventListener('mouseleave', startAutoplay);
            heroSection.addEventListener('touchstart', stopAutoplay);
            heroSection.addEventListener('touchend', function () {
                setTimeout(startAutoplay, 3000);
            });
        }

        // Init
        showSlide(0);
        startAutoplay();
    }


    /* =====================================================
       5. TESTIMONIALS SLIDER — BUTTONS ONLY
    ===================================================== */

    const testiContainer = document.getElementById('testimonialsScrollContainer');
    const testiLeft = document.getElementById('testimonialsScrollLeft');
    const testiRight = document.getElementById('testimonialsScrollRight');

    if (testiContainer) {

        if (testiLeft) {
            testiLeft.addEventListener('click', function () {
                testiContainer.scrollBy({ left: -320, behavior: 'smooth' });
            });
        }

        if (testiRight) {
            testiRight.addEventListener('click', function () {
                testiContainer.scrollBy({ left: 320, behavior: 'smooth' });
            });
        }

        function updateTestiButtons() {
            if (!testiLeft || !testiRight) return;

            const scrollLeft = testiContainer.scrollLeft;
            const maxScroll = testiContainer.scrollWidth - testiContainer.clientWidth;

            testiLeft.disabled = scrollLeft <= 10;
            testiRight.disabled = scrollLeft >= maxScroll - 10;
        }

        testiContainer.addEventListener('scroll', updateTestiButtons);
        window.addEventListener('resize', updateTestiButtons);

        setTimeout(updateTestiButtons, 100);
    }

});