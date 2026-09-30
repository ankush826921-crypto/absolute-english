/* =========================================
   ABSOLUTE ENGLISH — PASSWORD RECOVERY
   Forgot · Verify OTP · Reset
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const forgotForm = document.getElementById("forgotPasswordForm");
    const otpForm = document.getElementById("otpForm");
    const resetForm = document.getElementById("resetPasswordForm");

    /* =========================================
       HELPERS
       ========================================= */

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showAlert(element, message, type = "error") {
        if (!element) return;
        element.textContent = message;
        element.className = `form-alert ${type}`;
    }

    function clearAlert(element) {
        if (!element) return;
        element.textContent = "";
        element.className = "form-alert";
    }

    /* =========================================
       1. FORGOT PASSWORD
       ========================================= */

    if (forgotForm) {
        const emailInput = document.getElementById("forgotEmail");
        const alertBox = document.getElementById("forgotAlert");

        // Clear validation on typing
        if (emailInput) {
            emailInput.addEventListener("input", () => {
                clearAlert(alertBox);
                const field = emailInput.closest(".field");
                if (field) {
                    field.classList.remove("is-invalid", "is-valid");
                }
            });
        }

        forgotForm.addEventListener("submit", (event) => {
            event.preventDefault();
            clearAlert(alertBox);

            const email = emailInput ? emailInput.value.trim() : "";
            const field = emailInput ? emailInput.closest(".field") : null;

            // Required
            if (!email) {
                if (field) field.classList.add("is-invalid");
                showAlert(alertBox, "Please enter your email address.", "error");
                return;
            }

            // Valid email
            if (!isValidEmail(email)) {
                if (field) field.classList.add("is-invalid");
                showAlert(alertBox, "Please enter a valid email address.", "error");
                return;
            }

            if (field) field.classList.add("is-valid");

            showAlert(
                alertBox,
                "Verification code sent. Opening next step…",
                "success"
            );

            setTimeout(() => {
                window.location.href = "/accounts/verify-otp/";
            }, 700);
        });
    }


    /* =========================================
       2. OTP VERIFICATION (6-BOX)
       ========================================= */

    if (otpForm) {
        const otpBoxes = document.querySelectorAll(".otp-box");
        const otpHidden = document.getElementById("otpCode");
        const alertBox = document.getElementById("otpAlert");

        const syncHidden = () => {
            if (otpHidden) {
                otpHidden.value = [...otpBoxes].map(b => b.value).join("");
            }
        };

        const clearBoxes = () => {
            otpBoxes.forEach(b => {
                b.value = "";
                b.classList.remove("is-filled", "is-invalid");
            });
            syncHidden();
        };

        // Behaviour per box
        otpBoxes.forEach((box, index) => {
            box.addEventListener("input", (e) => {
                const val = e.target.value.replace(/\D/g, "");
                e.target.value = val.slice(0, 1);

                if (e.target.value) {
                    e.target.classList.add("is-filled");
                    if (index < otpBoxes.length - 1) {
                        otpBoxes[index + 1].focus();
                    }
                } else {
                    e.target.classList.remove("is-filled");
                }

                box.classList.remove("is-invalid");
                clearAlert(alertBox);
                syncHidden();
            });

            box.addEventListener("keydown", (e) => {
                if (e.key === "Backspace" && !e.target.value && index > 0) {
                    otpBoxes[index - 1].focus();
                    otpBoxes[index - 1].value = "";
                    otpBoxes[index - 1].classList.remove("is-filled");
                    syncHidden();
                }
                if (e.key === "ArrowLeft" && index > 0) {
                    otpBoxes[index - 1].focus();
                }
                if (e.key === "ArrowRight" && index < otpBoxes.length - 1) {
                    otpBoxes[index + 1].focus();
                }
            });

            box.addEventListener("paste", (e) => {
                e.preventDefault();
                const pasted = (e.clipboardData || window.clipboardData)
                    .getData("text")
                    .replace(/\D/g, "")
                    .slice(0, 6);

                [...pasted].forEach((digit, i) => {
                    if (otpBoxes[i]) {
                        otpBoxes[i].value = digit;
                        otpBoxes[i].classList.add("is-filled");
                    }
                });

                syncHidden();
                otpBoxes[Math.min(pasted.length, otpBoxes.length - 1)]?.focus();
            });
        });

        // Auto-focus first box
        setTimeout(() => otpBoxes[0]?.focus(), 300);

        // Submit
        otpForm.addEventListener("submit", (event) => {
            event.preventDefault();
            clearAlert(alertBox);

            const otp = otpHidden ? otpHidden.value.trim() : "";

            if (!/^\d{6}$/.test(otp)) {
                otpBoxes.forEach(b => b.classList.add("is-invalid"));
                showAlert(alertBox, "Please enter a valid 6-digit OTP.", "error");
                return;
            }

            showAlert(alertBox, "OTP verified successfully.", "success");

            setTimeout(() => {
                window.location.href = "/accounts/reset-password/";
            }, 700);
        });

        // Resend
        const resendButton = document.getElementById("resendOtp");

        if (resendButton) {
            resendButton.addEventListener("click", () => {
                clearBoxes();
                showAlert(alertBox, "A new OTP has been sent.", "success");
                setTimeout(() => otpBoxes[0]?.focus(), 250);
            });
        }
    }


    /* =========================================
       3. RESET PASSWORD
       ========================================= */

    if (resetForm) {
        const password = document.getElementById("newPassword");
        const confirmPassword = document.getElementById("confirmNewPassword");
        const alertBox = document.getElementById("resetAlert");
        const fill = document.getElementById("passwordMeterFill");
        const label = document.getElementById("passwordMeterLabel");

        // Password meter
        if (password && fill && label && window.AuthUI) {
            password.addEventListener("input", () => {
                AuthUI.updatePasswordMeter(password, fill, label);

                // Live confirm check
                if (confirmPassword && confirmPassword.value) {
                    const field = confirmPassword.closest(".field");
                    if (field) {
                        field.classList.toggle(
                            "is-invalid",
                            confirmPassword.value !== password.value
                        );
                        field.classList.toggle(
                            "is-valid",
                            confirmPassword.value === password.value
                        );
                    }
                }
            });
        }

        // Clear alerts on typing
        [password, confirmPassword].forEach(input => {
            if (!input) return;
            input.addEventListener("input", () => clearAlert(alertBox));
        });

        resetForm.addEventListener("submit", (event) => {
            event.preventDefault();
            clearAlert(alertBox);

            const passwordValue = password ? password.value : "";
            const confirmValue = confirmPassword ? confirmPassword.value : "";

            if (passwordValue.length < 8) {
                showAlert(alertBox, "Password must be at least 8 characters.", "error");
                return;
            }

            if (passwordValue !== confirmValue) {
                showAlert(alertBox, "Passwords do not match.", "error");
                return;
            }

            showAlert(alertBox, "Password updated successfully.", "success");

            setTimeout(() => {
                window.location.href = "/accounts/password-success/";
            }, 700);
        });
    }

});