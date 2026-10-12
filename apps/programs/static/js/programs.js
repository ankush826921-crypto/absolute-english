document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       COURSE FILTER
    ========================= */

    const filterButtons = document.querySelectorAll(".filter-btn");
    const courseCards = document.querySelectorAll(".course-card");

    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const selectedLevel = this.getAttribute("data-filter");

            // Active button
            filterButtons.forEach(function (btn) {
                btn.classList.remove("active");
            });

            this.classList.add("active");

            // Filter courses
            courseCards.forEach(function (card) {

                const cardLevel = card.getAttribute("data-level");

                if (
                    selectedLevel === "all" ||
                    cardLevel === selectedLevel
                ) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }

            });

        });

    });


    /* =========================
       ENQUIRE NOW
    ========================= */

    const enquireButtons = document.querySelectorAll(".enquire-btn");

    enquireButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            alert(
                "Thank you for your interest! Our team will contact you soon."
            );

        });

    });

});