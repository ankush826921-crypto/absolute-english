document.addEventListener("DOMContentLoaded", function () {

    const navbar = document.querySelector(".navbar");

    if (!navbar) {
        console.log("Navbar not found!");
        return;
    }

    console.log("Navbar loaded successfully");


    // Navbar ki original position
    let navbarOriginalTop = navbar.offsetTop;

    // Navbar ki height
    let navbarHeight = navbar.offsetHeight;


    // ========================================
    // SCROLL FUNCTION
    // ========================================

    function handleNavbar() {

        const scrollY =
            window.pageYOffset ||
            document.documentElement.scrollTop;

        /*
         * Jab navbar ki original position
         * viewport ke top tak aa jaye
         */
        if (scrollY >= navbarOriginalTop) {

            if (!navbar.classList.contains("navbar-fixed")) {

                navbar.classList.add("navbar-fixed");

                /*
                 * Fixed hone ke baad content jump na kare
                 */
                document.body.style.paddingTop =
                    navbarHeight + "px";
            }

        } else {

            if (navbar.classList.contains("navbar-fixed")) {

                navbar.classList.remove("navbar-fixed");

                document.body.style.paddingTop = "0px";
            }
        }
    }


    // ========================================
    // SCROLL EVENT
    // ========================================

    window.addEventListener("scroll", handleNavbar);


    // ========================================
    // RESIZE
    // ========================================

    window.addEventListener("resize", function () {

        /*
         * Resize ke baad position dobara calculate
         */
        navbarOriginalTop = navbar.offsetTop;
        navbarHeight = navbar.offsetHeight;

        if (navbar.classList.contains("navbar-fixed")) {

            document.body.style.paddingTop =
                navbarHeight + "px";
        }

    });


    // Initial check
    handleNavbar();


    // ========================================
    // ACTIVE LINK
    // ========================================

    const currentPath = window.location.pathname;

    const navLinks =
        document.querySelectorAll(
            ".navbar-nav .nav-link"
        );

    navLinks.forEach(function (link) {

        const href = link.getAttribute("href");

        if (href === currentPath) {
            link.classList.add("active");
        }

    });


    // ========================================
    // MOBILE MENU
    // ========================================

    const navCollapse =
        document.querySelector(".navbar-collapse");

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            if (
                window.innerWidth <= 991 &&
                navCollapse &&
                typeof bootstrap !== "undefined"
            ) {

                const bsCollapse =
                    bootstrap.Collapse.getInstance(
                        navCollapse
                    );

                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }

        });

    });


    // ========================================
    // DARK MODE
    // ========================================

    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");

    function applyNavbarTheme(theme) {
        if (theme === "dark") {
            document.documentElement.setAttribute("data-theme", "dark");
            if (themeIcon) {
                themeIcon.classList.remove("fa-moon");
                themeIcon.classList.add("fa-sun");
            }
        } else {
            document.documentElement.removeAttribute("data-theme");
            if (themeIcon) {
                themeIcon.classList.remove("fa-sun");
                themeIcon.classList.add("fa-moon");
            }
        }
    }

    // Apply saved theme
    const savedTheme = localStorage.getItem("theme");
    applyNavbarTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            const currentTheme = document.documentElement.getAttribute("data-theme");
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            localStorage.setItem("theme", newTheme);
            applyNavbarTheme(newTheme);
        });
    }

    // Sync if theme changed in another tab or window
    window.addEventListener("storage", function (event) {
        if (event.key === "theme") {
            applyNavbarTheme(event.newValue || "light");
        }
    });

});