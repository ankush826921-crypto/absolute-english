document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("contactForm");
    const successMessage = document.getElementById("successMessage");
    const submitButton = document.querySelector(".contact-submit-btn");

    if (!form || !successMessage || !submitButton) {
        return;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

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

        if (!consent.checked) {
            consent.focus();
            isValid = false;
        }

        if (!isValid) {
            successMessage.classList.remove("show");
            return;
        }

        submitButton.disabled = true;

        submitButton.innerHTML = `
            <span>Message Ready</span>
            <i class="fas fa-check"></i>
        `;

        successMessage.classList.add("show");

        setTimeout(function () {
            form.reset();

            submitButton.disabled = false;

            submitButton.innerHTML = `
                <span>Send Message</span>
                <i class="fas fa-paper-plane"></i>
            `;
        }, 2500);
    });

});