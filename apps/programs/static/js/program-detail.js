document.addEventListener("DOMContentLoaded", function () {

    const popup = document.getElementById("enquiryPopup");
    const closeButton = document.getElementById("closeEnquiry");
    const enquiryButtons = document.querySelectorAll(".enquire-btn");
    const enquiryForm = document.getElementById("enquiryForm");


    // =========================
    // OPEN ENQUIRY POPUP
    // =========================

    enquiryButtons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            event.preventDefault();

            popup.classList.add("active");

        });

    });


    // =========================
    // CLOSE ENQUIRY POPUP
    // =========================

    closeButton.addEventListener("click", function () {

        popup.classList.remove("active");

    });


    // =========================
    // CLOSE POPUP OUTSIDE MODAL
    // =========================

    popup.addEventListener("click", function (event) {

        if (event.target === popup) {

            popup.classList.remove("active");

        }

    });


    // =========================
    // FORM SUBMIT
    // =========================

    enquiryForm.addEventListener("submit", function () {

        // Form will be submitted to Django

    });

});