/* =========================================
   ABSOLUTE ENGLISH — PASSWORD RECOVERY
   Forgot · Verify OTP · Reset (Real Backend API)
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
        element.className = `form-alert ${type} is-visible`;
    }

    function clearAlert(element) {
        if (!element) return;
        element.textContent = "";
        element.className = "form-alert";
    }

    /* =========================================
       1. FORGOT PASSWORD FORM
       ========================================= */

    if (forgotForm) {
        const emailInput = document.getElementById("forgotEmail");
        const alertBox = document.getElementById("forgotAlert");

        if (emailInput) {
            emailInput.addEventListener("input", () => {
                clearAlert(alertBox);
                const field = emailInput.closest(".field");
                if (field) {
                    field.classList.remove("is-invalid", "is-valid");
                }
            });
        }

        forgotForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            clearAlert(alertBox);

            const email = emailInput ? emailInput.value.trim() : "";
            const field = emailInput ? emailInput.closest(".field") : null;

            if (!email) {
                if (field) field.classList.add("is-invalid");
                showAlert(alertBox, "Please enter your email address.", "error");
                return;
            }

            if (!isValidEmail(email)) {
                if (field) field.classList.add("is-invalid");
                showAlert(alertBox, "Please enter a valid email address.", "error");
                return;
            }

            if (field) field.classList.add("is-valid");

            const submitBtn = forgotForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.classList.add("is-loading");
            }

            try {
                const { ok, result } = await AuthUI.postApi('/accounts/api/forgot-password/', { email });

                if (ok && result.status === 'success') {
                    showAlert(alertBox, result.message || "Verification code sent to your email.", "success");

                    setTimeout(() => {
                        window.location.href = result.redirect_url || "/accounts/verify-otp/";
                    }, 800);
                } else {
                    let errMsg = result.message || "Email address not found.";
                    if (result.errors?.email) {
                        errMsg = Array.isArray(result.errors.email) ? result.errors.email[0] : result.errors.email;
                    }
                    if (field) field.classList.add("is-invalid");
                    showAlert(alertBox, errMsg, "error");
                }
            } catch (err) {
                showAlert(alertBox, "Network error. Please try again.", "error");
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.classList.remove("is-loading");
                }
            }
        });
    }

    /* =========================================
       2. OTP VERIFICATION FORM
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

        setTimeout(() => otpBoxes[0]?.focus(), 300);

        otpForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            clearAlert(alertBox);

            const otp = otpHidden ? otpHidden.value.trim() : "";

            if (!/^\d{6}$/.test(otp)) {
                otpBoxes.forEach(b => b.classList.add("is-invalid"));
                showAlert(alertBox, "Please enter a valid 6-digit OTP.", "error");
                return;
            }

            const submitBtn = otpForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.classList.add("is-loading");
            }

            try {
                const { ok, result } = await AuthUI.postApi('/accounts/api/verify-otp/', {
                    otp: otp,
                    purpose: 'password_reset'
                });

                if (ok && result.status === 'success') {
                    showAlert(alertBox, "OTP verified successfully.", "success");
                    setTimeout(() => {
                        window.location.href = result.redirect_url || "/accounts/reset-password/";
                    }, 700);
                } else {
                    otpBoxes.forEach(b => b.classList.add("is-invalid"));
                    showAlert(alertBox, result.message || "Invalid OTP. Please check and try again.", "error");
                }
            } catch (err) {
                showAlert(alertBox, "Server error. Please try again.", "error");
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.classList.remove("is-loading");
                }
            }
        });

        const resendButton = document.getElementById("resendOtp");
        if (resendButton) {
            resendButton.addEventListener("click", async () => {
                clearBoxes();
                clearAlert(alertBox);

                try {
                    const { ok, result } = await AuthUI.postApi('/accounts/api/send-otp/', {
                        purpose: 'password_reset'
                    });

                    if (ok && result.status === 'success') {
                        showAlert(alertBox, result.message || "A new OTP code has been sent to your email.", "success");
                    } else {
                        showAlert(alertBox, result.message || "Failed to resend OTP.", "error");
                    }
                } catch (err) {
                    showAlert(alertBox, "Failed to resend OTP.", "error");
                }
                setTimeout(() => otpBoxes[0]?.focus(), 250);
            });
        }
    }

    /* =========================================
       3. RESET PASSWORD FORM
       ========================================= */

    if (resetForm) {
        const password = document.getElementById("newPassword");
        const confirmPassword = document.getElementById("confirmNewPassword");
        const alertBox = document.getElementById("resetAlert");
        const fill = document.getElementById("passwordMeterFill");
        const label = document.getElementById("passwordMeterLabel");

        if (password && fill && label && window.AuthUI) {
            password.addEventListener("input", () => {
                AuthUI.updatePasswordMeter(password, fill, label);

                if (confirmPassword && confirmPassword.value) {
                    const field = confirmPassword.closest(".field");
                    if (field) {
                        field.classList.toggle("is-invalid", confirmPassword.value !== password.value);
                        field.classList.toggle("is-valid", confirmPassword.value === password.value);
                    }
                }
            });
        }

        [password, confirmPassword].forEach(input => {
            if (!input) return;
            input.addEventListener("input", () => clearAlert(alertBox));
        });

        resetForm.addEventListener("submit", async (event) => {
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

            const submitBtn = resetForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.classList.add("is-loading");
            }

            try {
                const { ok, result } = await AuthUI.postApi('/accounts/api/reset-password/', {
                    password: passwordValue,
                    confirm_password: confirmValue
                });

                if (ok && result.status === 'success') {
                    showAlert(alertBox, "Password updated successfully!", "success");
                    setTimeout(() => {
                        window.location.href = result.redirect_url || "/accounts/password-success/";
                    }, 700);
                } else {
                    let errMsg = result.message || "Failed to reset password.";
                    if (result.errors) {
                        if (result.errors.password) errMsg = Array.isArray(result.errors.password) ? result.errors.password[0] : result.errors.password;
                        else if (result.errors.confirm_password) errMsg = Array.isArray(result.errors.confirm_password) ? result.errors.confirm_password[0] : result.errors.confirm_password;
                    }
                    showAlert(alertBox, errMsg, "error");
                }
            } catch (err) {
                showAlert(alertBox, "An unexpected error occurred.", "error");
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.classList.remove("is-loading");
                }
            }
        });
    }

});