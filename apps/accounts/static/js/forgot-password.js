document.addEventListener("DOMContentLoaded", () => {
    const forgotForm = document.getElementById("forgotPasswordForm");
    const otpForm = document.getElementById("otpForm");
    const resetForm = document.getElementById("resetPasswordForm");

    /*
     * ---------------------------------------------------------
     * FORGOT PASSWORD
     * ---------------------------------------------------------
     */
    if (forgotForm) {
        forgotForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const email = document.getElementById("forgotEmail");
            const alertBox = document.getElementById("forgotAlert");

            if (!email || !email.value.trim()) {
                showAlert(
                    alertBox,
                    "Please enter your email address.",
                    "error"
                );
                return;
            }

            if (!isValidEmail(email.value.trim())) {
                showAlert(
                    alertBox,
                    "Please enter a valid email address.",
                    "error"
                );
                return;
            }

            showAlert(
                alertBox,
                "Demo mode: verification code step opened.",
                "success"
            );

            setTimeout(() => {
                window.location.href = "/accounts/verify-otp/";
            }, 500);
        });
    }

    /*
     * ---------------------------------------------------------
     * OTP VERIFICATION
     * ---------------------------------------------------------
     */
    if (otpForm) {
        const otpInput = document.getElementById("otpCode");

        if (otpInput) {
            otpInput.addEventListener("input", () => {
                otpInput.value = otpInput.value
                    .replace(/\D/g, "")
                    .slice(0, 6);
            });
        }

        otpForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const alertBox = document.getElementById("otpAlert");
            const otp = otpInput ? otpInput.value.trim() : "";

            if (!/^\d{6}$/.test(otp)) {
                showAlert(
                    alertBox,
                    "Please enter a valid 6-digit OTP.",
                    "error"
                );
                return;
            }

            showAlert(
                alertBox,
                "OTP verified successfully in demo mode.",
                "success"
            );

            setTimeout(() => {
                window.location.href = "/accounts/reset-password/";
            }, 500);
        });

        const resendButton = document.getElementById("resendOtp");

        if (resendButton) {
            resendButton.addEventListener("click", () => {
                const alertBox = document.getElementById("otpAlert");

                showAlert(
                    alertBox,
                    "Demo mode: a new OTP would be sent here.",
                    "success"
                );
            });
        }
    }

    /*
     * ---------------------------------------------------------
     * RESET PASSWORD
     * ---------------------------------------------------------
     */
    if (resetForm) {
        const password = document.getElementById("newPassword");
        const confirmPassword =
            document.getElementById("confirmNewPassword");
        const alertBox = document.getElementById("resetAlert");
        const fill = document.getElementById("passwordMeterFill");
        const label = document.getElementById("passwordMeterLabel");

        if (password && fill && label && window.AuthUI) {
            password.addEventListener("input", () => {
                AuthUI.updatePasswordMeter(password, fill, label);
            });
        }

        resetForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const passwordValue = password
                ? password.value
                : "";

            const confirmValue = confirmPassword
                ? confirmPassword.value
                : "";

            if (passwordValue.length < 8) {
                showAlert(
                    alertBox,
                    "Password must contain at least 8 characters.",
                    "error"
                );
                return;
            }

            if (passwordValue !== confirmValue) {
                showAlert(
                    alertBox,
                    "Passwords do not match.",
                    "error"
                );
                return;
            }

            showAlert(
                alertBox,
                "Password updated successfully in demo mode.",
                "success"
            );

            setTimeout(() => {
                window.location.href =
                    "/accounts/password-success/";
            }, 500);
        });
    }

    /*
     * ---------------------------------------------------------
     * HELPERS
     * ---------------------------------------------------------
     */

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showAlert(element, message, type) {
        if (!element) {
            return;
        }

        element.textContent = message;
        element.className = `form-alert ${type}`;
    }
});