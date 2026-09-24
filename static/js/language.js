// =========================================================
// ABSOLUTE ENGLISH — GLOBAL THEME TOGGLE
// Handles BOTH buttons:
//   • #themeToggle  (navbar me)
//   • #modeToggle   (floating button)
// Har click pe: SIRF theme change (dark ↔ light)
// Language change NAHI karta
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    const THEME_KEY = "absoluteEnglishTheme";


    /* =====================================================
       1. GET / APPLY THEME
       ===================================================== */

    function getTheme() {
        return localStorage.getItem(THEME_KEY) || "dark";
    }

    function applyTheme(theme) {
        const body = document.body;

        // Body pe white-mode class toggle
        if (theme === "light") {
            body.classList.add("white-mode");
        } else {
            body.classList.remove("white-mode");
        }

        // localStorage me save
        localStorage.setItem(THEME_KEY, theme);

        // Saare theme icons update karo (navbar + floating)
        document.querySelectorAll(
            "#themeIcon, #modeToggle i, .theme-icon"
        ).forEach(function (icon) {
            if (icon) {
                icon.className = theme === "light"
                    ? "fas fa-sun"
                    : "fas fa-moon";
            }
        });
    }


    /* =====================================================
       2. INITIAL LOAD — Saved theme apply karo
       ===================================================== */

    applyTheme(getTheme());


    /* =====================================================
       3. BUTTON HANDLER — Har click pe theme toggle
       ===================================================== */

    function attachToggle(btn) {
        if (!btn || btn.dataset.attached === "1") return;
        btn.dataset.attached = "1";

        btn.addEventListener("click", function (e) {
            e.preventDefault();

            // Theme toggle
            const newTheme = getTheme() === "light" ? "dark" : "light";
            applyTheme(newTheme);

            // Chhota animation
            btn.style.transform = "scale(0.85) rotate(15deg)";
            setTimeout(function () {
                btn.style.transform = "";
            }, 220);
        });

        btn.title = "Click: Toggle theme";
    }


    /* ---- DONO BUTTONS pe attach ---- */
    attachToggle(document.getElementById("themeToggle"));   // navbar
    // attachToggle(document.getElementById("modeToggle"));    // floating


    /* =====================================================
       4. SMOOTH SCROLL
       ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = link.getAttribute("href");
            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);
            if (target) {
                event.preventDefault();
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });


    /* =====================================================
       5. LANGUAGE CARD HOVER
       ===================================================== */

    const languageCards = document.querySelectorAll(".language-card");

    languageCards.forEach(function (card) {
        card.addEventListener("mouseenter", function () {
            const logo = card.querySelector(".country-logo");
            if (logo) logo.style.transform = "scale(1.08)";
        });

        card.addEventListener("mouseleave", function () {
            const logo = card.querySelector(".country-logo");
            if (logo) logo.style.transform = "";
        });

        card.addEventListener("touchstart", function () {
            card.classList.add("card-touch");
        }, { passive: true });

        card.addEventListener("touchend", function () {
            setTimeout(function () {
                card.classList.remove("card-touch");
            }, 200);
        }, { passive: true });
    });


    /* =====================================================
       6. FEATURE CARD HOVER
       ===================================================== */

    document.querySelectorAll(".feature-card").forEach(function (card) {
        card.addEventListener("mouseenter", function () {
            const icon = card.querySelector(".feature-icon");
            if (icon) icon.style.transform = "scale(1.08)";
        });

        card.addEventListener("mouseleave", function () {
            const icon = card.querySelector(".feature-icon");
            if (icon) icon.style.transform = "";
        });
    });


    /* =====================================================
       7. SCROLL REVEAL
       ===================================================== */

    const revealElements = document.querySelectorAll(
        ".language-card, .feature-card, .learning-box, .learning-content, .cta-content"
    );

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );

        revealElements.forEach(function (element) {
            element.classList.add("reveal-item");
            observer.observe(element);
        });
    } else {
        revealElements.forEach(function (element) {
            element.classList.add("is-visible");
        });
    }


    /* =====================================================
       8. BUTTON CLICK EFFECT
       ===================================================== */

    document.querySelectorAll(".primary-btn, .secondary-btn, .learn-btn")
        .forEach(function (button) {
            button.addEventListener("click", function () {
                button.style.transform = "scale(0.96)";
                setTimeout(function () {
                    button.style.transform = "";
                }, 120);
            });
        });

});