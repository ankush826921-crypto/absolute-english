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
// LANGUAGES - TRUE INFINITE LOOP
// (Auto-Scroll + Buttons)
// ========================================

document.addEventListener('DOMContentLoaded', function () {

    const container = document.getElementById('homeScrollContainer');
    const leftBtn = document.getElementById('homeScrollLeft');
    const rightBtn = document.getElementById('homeScrollRight');

    if (!container) return;

    // Clone cards for infinite loop
    const cards = container.children;
    const totalCards = cards.length;

    for (let i = 0; i < totalCards; i++) {

        const clone = cards[i].cloneNode(true);
        container.appendChild(clone);
    }

    let scrollInterval;
    let isHovered = false;
    let speed = 1.5;
    let isTransitioning = false;

    function autoScroll() {

        if (!isHovered && container && !isTransitioning) {

            const maxScroll = container.scrollWidth - container.clientWidth;
            const currentScroll = container.scrollLeft;

            if (currentScroll >= maxScroll / 2) {

                isTransitioning = true;

                container.scrollTo({
                    left: 0,
                    behavior: 'instant'
                });

                setTimeout(() => {
                    isTransitioning = false;
                }, 50);

            } else {

                container.scrollBy({
                    left: 1 * speed,
                    behavior: 'smooth'
                });
            }
        }
    }

    function startScroll() {

        if (scrollInterval) {
            clearInterval(scrollInterval);
        }

        scrollInterval = setInterval(autoScroll, 25);
    }

    function stopScroll() {

        if (scrollInterval) {

            clearInterval(scrollInterval);
            scrollInterval = null;
        }
    }


    // Mouse Events

    container.addEventListener('mouseenter', function () {

        isHovered = true;
        stopScroll();
    });

    container.addEventListener('mouseleave', function () {

        isHovered = false;
        startScroll();
    });
    // ========================================
// MOUSE / TRACKPAD HORIZONTAL SCROLL
// ========================================

container.addEventListener('wheel', function (e) {

    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();

        container.scrollLeft += e.deltaY;
    }

}, { passive: false });


// ========================================
// MOUSE DRAG SCROLL
// ========================================

let isDragging = false;
let startX = 0;
let startScrollLeft = 0;

container.addEventListener('mousedown', function (e) {

    isDragging = true;
    startX = e.pageX;
    startScrollLeft = container.scrollLeft;

    container.style.cursor = 'grabbing';

    stopScroll();

});

container.addEventListener('mousemove', function (e) {

    if (!isDragging) return;

    e.preventDefault();

    const x = e.pageX;
    const walk = x - startX;

    container.scrollLeft = startScrollLeft - walk;

});

container.addEventListener('mouseup', function () {

    isDragging = false;

    container.style.cursor = 'grab';

    setTimeout(startScroll, 3000);

});

container.addEventListener('mouseleave', function () {

    if (isDragging) {
        isDragging = false;
        container.style.cursor = 'grab';
        startScroll();
    }

});


    // Touch Events

    container.addEventListener('touchstart', function () {

        isHovered = true;
        stopScroll();
    });

    container.addEventListener('touchend', function () {

        setTimeout(function () {

            isHovered = false;
            startScroll();

        }, 3000);
    });


    // ========================================
    // SCROLL BUTTONS
    // ========================================

    if (leftBtn) {

        leftBtn.addEventListener('click', function () {

            container.scrollBy({
                left: -320,
                behavior: 'smooth'
            });

            stopScroll();

            setTimeout(startScroll, 3000);
        });
    }

    if (rightBtn) {

        rightBtn.addEventListener('click', function () {

            container.scrollBy({
                left: 320,
                behavior: 'smooth'
            });

            stopScroll();

            setTimeout(startScroll, 3000);
        });
    }


    // Update button states

    function updateButtons() {

        if (!leftBtn || !rightBtn) return;

        const scrollLeft = container.scrollLeft;
        const maxScroll = container.scrollWidth - container.clientWidth;

        leftBtn.disabled = scrollLeft <= 10;
        rightBtn.disabled = scrollLeft >= maxScroll - 10;
    }

    container.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);

    setTimeout(updateButtons, 100);

    startScroll();

});


// ========================================
// COURSES - TRUE INFINITE LOOP
// (Auto-Scroll + Buttons)
// ========================================

document.addEventListener('DOMContentLoaded', function () {

    const container = document.getElementById('coursesScrollContainer');
    const leftBtn = document.getElementById('coursesScrollLeft');
    const rightBtn = document.getElementById('coursesScrollRight');

    if (!container) return;

    // Clone cards for infinite loop
    const cards = container.children;
    const totalCards = cards.length;

    for (let i = 0; i < totalCards; i++) {

        const clone = cards[i].cloneNode(true);
        container.appendChild(clone);
    }

    let scrollInterval;
    let isHovered = false;
    let speed = 1.5;
    let isTransitioning = false;

    function autoScroll() {

        if (!isHovered && container && !isTransitioning) {

            const maxScroll = container.scrollWidth - container.clientWidth;
            const currentScroll = container.scrollLeft;

            if (currentScroll >= maxScroll / 2) {

                isTransitioning = true;

                container.scrollTo({
                    left: 0,
                    behavior: 'instant'
                });

                setTimeout(() => {
                    isTransitioning = false;
                }, 50);

            } else {

                container.scrollBy({
                    left: 1 * speed,
                    behavior: 'smooth'
                });
            }
        }
    }

    function startScroll() {

        if (scrollInterval) {
            clearInterval(scrollInterval);
        }

        scrollInterval = setInterval(autoScroll, 25);
    }

    function stopScroll() {

        if (scrollInterval) {

            clearInterval(scrollInterval);
            scrollInterval = null;
        }
    }


    // Mouse Events

    container.addEventListener('mouseenter', function () {

        isHovered = true;
        stopScroll();
    });

    container.addEventListener('mouseleave', function () {

        isHovered = false;
        startScroll();
    });


    // Touch Events

    container.addEventListener('touchstart', function () {

        isHovered = true;
        stopScroll();
    });

    container.addEventListener('touchend', function () {

        setTimeout(function () {

            isHovered = false;
            startScroll();

        }, 3000);
    });


    // ========================================
    // SCROLL BUTTONS
    // ========================================

    if (leftBtn) {

        leftBtn.addEventListener('click', function () {

            container.scrollBy({
                left: -320,
                behavior: 'smooth'
            });

            stopScroll();

            setTimeout(startScroll, 3000);
        });
    }

    if (rightBtn) {

        rightBtn.addEventListener('click', function () {

            container.scrollBy({
                left: 320,
                behavior: 'smooth'
            });

            stopScroll();

            setTimeout(startScroll, 3000);
        });
    }


    // Update button states

    function updateButtons() {

        if (!leftBtn || !rightBtn) return;

        const scrollLeft = container.scrollLeft;
        const maxScroll = container.scrollWidth - container.clientWidth;

        leftBtn.disabled = scrollLeft <= 10;
        rightBtn.disabled = scrollLeft >= maxScroll - 10;
    }

    container.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);

    setTimeout(updateButtons, 100);

    startScroll();

});


// ========================================
// TESTIMONIALS - MANUAL SCROLL
// (No Auto-Scroll)
// ========================================

document.addEventListener('DOMContentLoaded', function () {

    const container = document.getElementById('testimonialsScrollContainer');
    const leftBtn = document.getElementById('testimonialsScrollLeft');
    const rightBtn = document.getElementById('testimonialsScrollRight');

    if (!container || !leftBtn || !rightBtn) return;


    // Left Button

    leftBtn.addEventListener('click', function () {

        container.scrollBy({
            left: -320,
            behavior: 'smooth'
        });
    });


    // Right Button

    rightBtn.addEventListener('click', function () {

        container.scrollBy({
            left: 320,
            behavior: 'smooth'
        });
    });


    // Update button states

    function updateButtons() {

        const scrollLeft = container.scrollLeft;
        const maxScroll = container.scrollWidth - container.clientWidth;

        leftBtn.disabled = scrollLeft <= 10;
        rightBtn.disabled = scrollLeft >= maxScroll - 10;
    }

    container.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);

    setTimeout(updateButtons, 100);


    // Keyboard Controls

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

    let currentSlide = 0;
    let slideInterval;

    const slideDelay = 5000;


    // Show Slide

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


    // Next Slide

    function nextSlide() {

        const next = (currentSlide + 1) % slides.length;

        showSlide(next);
    }


    // Start Autoplay

    function startAutoplay() {

        if (slideInterval) {
            clearInterval(slideInterval);
        }

        slideInterval = setInterval(nextSlide, slideDelay);
    }


    // Stop Autoplay

    function stopAutoplay() {

        if (slideInterval) {

            clearInterval(slideInterval);
            slideInterval = null;
        }
    }


    // Dot Click Events

    dots.forEach((dot, index) => {

        dot.addEventListener('click', function () {

            stopAutoplay();

            showSlide(index);

            startAutoplay();
        });
    });


    // Hero Mouse / Touch Events

    const heroSection = document.getElementById('heroSection');

    if (heroSection) {

        heroSection.addEventListener('mouseenter', stopAutoplay);

        heroSection.addEventListener('mouseleave', startAutoplay);

        heroSection.addEventListener('touchstart', stopAutoplay);

        heroSection.addEventListener('touchend', function () {

            setTimeout(startAutoplay, 3000);
        });
    }


    // Hero Keyboard Controls

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


    // Initialize

    showSlide(0);

    startAutoplay();

});

