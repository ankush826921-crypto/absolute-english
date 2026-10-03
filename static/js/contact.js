document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("contactForm");
    const submitButton = document.querySelector(".contact-submit-btn");

    if (!form || !submitButton) {
        return;
    }

    form.addEventListener("submit", function (event) {
        const fullName = document.getElementById("fullName");
        const email = document.getElementById("email");
        const subject = document.getElementById("subject");
        const message = document.getElementById("message");
        const consent = document.getElementById("consent");

        let isValid = true;

        [fullName, email, subject, message].forEach(function (field) {
            field.style.borderColor = "";

            if (!field.value.trim()) {
                field.style.borderColor = "#ef476f";
                isValid = false;
            }
        });

        if (email.value.trim() && !email.validity.valid) {
            email.style.borderColor = "#ef476f";
            isValid = false;
        }

        if (!consent.checked) {
            consent.focus();
            isValid = false;
        }

        if (!isValid) {
            event.preventDefault();
            return;
        }

        submitButton.disabled = true;
        submitButton.innerHTML = `
            <span>Sending...</span>
            <i class="fas fa-spinner fa-spin"></i>
        `;
    });

});
