document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");
    const submitButton = document.querySelector(".contact-submit-btn");

    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const subject = document.getElementById("subject");
    const message = document.getElementById("message");
    const consent = document.getElementById("consent");

    const successMessage = document.getElementById("successMessage");

    if (
        !form ||
        !submitButton ||
        !fullName ||
        !email ||
        !subject ||
        !message ||
        !consent
    ) {
        return;
    }

    form.addEventListener("submit", function (event) {
        let isValid = true;

        const requiredFields = [
            fullName,
            email,
            subject,
            message
        ];

        requiredFields.forEach(function (field) {
            field.style.borderColor = "";

            if (!field.value.trim()) {
                field.style.borderColor = "#ef476f";
                isValid = false;
            }
        });

        // Validate email format
        if (email.value.trim() && !email.validity.valid) {
            email.style.borderColor = "#ef476f";
            isValid = false;
        }

        // Consent is required
        if (!consent.checked) {
            consent.focus();
            isValid = false;
        }

        // Stop submission only if validation fails
        if (!isValid) {
            event.preventDefault();

            if (successMessage) {
                successMessage.classList.remove("show");
            }

            return;
        }

        // Allow the valid form to submit to Django
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <span>Sending...</span>
            <i class="fas fa-spinner fa-spin"></i>
        `;
    });
});