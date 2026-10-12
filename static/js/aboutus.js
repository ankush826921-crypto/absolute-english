document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Scroll Reveal Animation
    function reveal() {
        var reveals = document.querySelectorAll(".reveal");
        for (var i = 0; i < reveals.length; i++) {
            var windowHeight = window.innerHeight;
            var elementTop = reveals[i].getBoundingClientRect().top;
            var elementVisible = 100;

            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add("active");
            }
        }
    }
    
    window.addEventListener("scroll", reveal);
    reveal(); // Trigger on load in case elements are already in view

    // 2. Number Counter Animation for Achievements
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the slower

    const startCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target + "+";
                }
            };
            updateCount();
        });
    }

    // Trigger counter when achievements section is visible
    let counterStarted = false;
    
    const checkCounterScroll = () => {
        const achievementSection = document.querySelector('.achievements');
        if (achievementSection) {
            const sectionPos = achievementSection.getBoundingClientRect().top;
            const screenPos = window.innerHeight;

            if (sectionPos < screenPos && !counterStarted) {
                startCounters();
                counterStarted = true;
            }
        }
    };

    window.addEventListener('scroll', checkCounterScroll);
    checkCounterScroll(); // Trigger on load in case section is already in view
});