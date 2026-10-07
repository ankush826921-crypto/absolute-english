/* =========================================
   ABSOLUTE ENGLISH — REGISTER PAGE
   Multi-Step Flow + Real Backend OTP & Auth
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#registerForm");
    if (!form) return;

    /* =========================================
       STEP MANAGER
       ========================================= */
    const step1 = form.querySelector(".form-step-1");
    const step2 = form.querySelector(".form-step-2");
    const step3 = form.querySelector(".form-step-3");

    const goToStep = (n) => {
        [step1, step2, step3].forEach((step, i) => {
            if (step) step.hidden = (i + 1 !== n);
        });

        const card = form.closest(".auth-card");
        if (card) {
            card.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    /* =========================================
       Fields
       ========================================= */
    const fullName = document.querySelector("#fullName");
    const email = document.querySelector("#registerEmail");
    const phone = document.querySelector("#phone");

    const password = document.querySelector("#registerPassword");
    const confirm = document.querySelector("#confirmPassword");
    const terms = document.querySelector("#terms");

    const alertBox = document.querySelector("#registerAlert");
    const fill = document.querySelector("#passwordMeterFill");
    const label = document.querySelector("#passwordMeterLabel");

    /* =========================================
       OTP Elements
       ========================================= */
    const otpBoxes = document.querySelectorAll(".otp-box");
    const otpHidden = document.querySelector("#registrationOtp");
    const verifyOtpButton = document.querySelector("#verifyRegistrationOtp");
    const resendOtpButton = document.querySelector("#resendRegistrationOtp");
    const otpAlert = document.querySelector("#registrationOtpAlert");
    const resendMessage = document.querySelector("#resendMessage");
    const backToStep1 = document.querySelector("#backToStep1");
    const otpPhoneDisplay = document.querySelector("#otpPhoneDisplay");

    const createAccountButton = form.querySelector('button[type="submit"]');

    /* =========================================
       State
       ========================================= */
    let phoneVerified = false;
    let isSendingOtp = false;

    const syncHiddenOtp = () => {
        if (otpHidden) {
            otpHidden.value = [...otpBoxes].map(b => b.value).join("");
        }
    };

    const clearOtpBoxes = () => {
        otpBoxes.forEach(b => {
            b.value = "";
            b.classList.remove("is-filled", "is-invalid");
        });
        syncHiddenOtp();
    };

    otpBoxes.forEach((box, index) => {
        box.addEventListener("input", (e) => {
            const val = e.target.value.replace(/\D/g, "");
            e.target.value = val.slice(0, 1);

            if (e.target.value) {
                e.target.classList.add("is-filled");
                if (index < otpBoxes.length - 1) otpBoxes[index + 1].focus();
            } else {
                e.target.classList.remove("is-filled");
            }

            box.classList.remove("is-invalid");
            if (otpAlert) AuthUI.clearAlert(otpAlert);

            syncHiddenOtp();
        });

        box.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && !e.target.value && index > 0) {
                otpBoxes[index - 1].focus();
                otpBoxes[index - 1].value = "";
                otpBoxes[index - 1].classList.remove("is-filled");
                syncHiddenOtp();
            }
            if (e.key === "ArrowLeft" && index > 0) otpBoxes[index - 1].focus();
            if (e.key === "ArrowRight" && index < otpBoxes.length - 1) {
                otpBoxes[index + 1].focus();
            }
        });

        box.addEventListener("paste", (e) => {
            e.preventDefault();
            const pasted = (e.clipboardData || window.clipboardData)
                .getData("text").replace(/\D/g, "").slice(0, 6);

            [...pasted].forEach((digit, i) => {
                if (otpBoxes[i]) {
                    otpBoxes[i].value = digit;
                    otpBoxes[i].classList.add("is-filled");
                }
            });

            syncHiddenOtp();
            otpBoxes[Math.min(pasted.length, otpBoxes.length - 1)]?.focus();
        });
    });

    /* =========================================
       Validation
       ========================================= */
    const validateBasicFields = () => {
        let valid = true;
        const checks = [
            [fullName, fullName.value.trim().length >= 2, "Enter your full name."],
            [email, AuthUI.validateEmail(email.value), "Enter a valid email address."],
            [phone, AuthUI.validatePhone(phone.value), "Enter a valid phone number."],
        ];

        checks.forEach(([input, ok, msg]) => {
            AuthUI.setFieldState(input.closest(".field"), ok ? "" : msg);
            if (!ok) valid = false;
        });

        return valid;
    };

    const validatePasswordFields = () => {
        let valid = true;

        const passOk = AuthUI.passwordScore(password.value) >= 3;
        AuthUI.setFieldState(
            password.closest(".field"),
            passOk ? "" : "Use a stronger password (8+ characters recommended)."
        );
        if (!passOk) valid = false;

        const confirmOk = Boolean(confirm.value) && confirm.value === password.value;
        AuthUI.setFieldState(
            confirm.closest(".field"),
            confirmOk ? "" : "Passwords do not match."
        );
        if (!confirmOk) valid = false;

        if (!terms.checked) {
            AuthUI.showAlert(alertBox, "Please accept the terms and conditions.");
            valid = false;
        }

        return valid;
    };

    /* =========================================
       Send OTP via API
       ========================================= */
    const sendOtp = async () => {
        if (isSendingOtp) return;
        isSendingOtp = true;
        phoneVerified = false;
        clearOtpBoxes();

        const phoneVal = phone.value.trim();
        if (otpPhoneDisplay) {
            otpPhoneDisplay.textContent = `Enter the 6-digit code sent to ${phoneVal}`;
        }

        try {
            const { ok, result } = await AuthUI.postApi('/accounts/api/send-otp/', {
                target: phoneVal,
                purpose: 'registration'
            });

            if (ok && result.status === 'success') {
                if (otpAlert) {
                    AuthUI.clearAlert(otpAlert);
                    AuthUI.showAlert(otpAlert, result.message || "OTP code sent to your phone number via SMS.", "success");
                }
                if (resendMessage) resendMessage.textContent = "";

                goToStep(2);
                setTimeout(() => otpBoxes[0]?.focus(), 350);
            } else {
                let errMsg = "Failed to send OTP.";
                if (result.errors?.target) errMsg = Array.isArray(result.errors.target) ? result.errors.target[0] : result.errors.target;
                else if (result.message) errMsg = result.message;

                AuthUI.setFieldState(phone.closest(".field"), errMsg);
                AuthUI.showAlert(alertBox, errMsg);
            }
        } catch (err) {
            AuthUI.showAlert(alertBox, "Failed to connect to server. Please try again.");
        } finally {
            isSendingOtp = false;
        }
    };

    /* =========================================
       Send OTP Button Click
       ========================================= */
    const sendOtpBtn = document.querySelector("#sendRegistrationOtpBtn");
    if (sendOtpBtn) {
        sendOtpBtn.addEventListener("click", () => {
            AuthUI.clearAlert(alertBox);
            if (!validateBasicFields()) {
                AuthUI.showAlert(alertBox, "Please fill in all highlighted fields correctly.");
                return;
            }
            sendOtp();
        });
    }

    if (phone) {
        phone.addEventListener("input", () => {
            AuthUI.clearAlert(alertBox);
            AuthUI.setFieldState(phone.closest(".field"));
            if (phoneVerified) {
                phoneVerified = false;
                clearOtpBoxes();
            }
        });
    }

    if (backToStep1) {
        backToStep1.addEventListener("click", () => {
            clearOtpBoxes();
            if (otpAlert) AuthUI.clearAlert(otpAlert);
            AuthUI.clearAlert(alertBox);
            goToStep(1);
            phone?.focus();
        });
    }

    /* =========================================
       Verify OTP Button
       ========================================= */
    if (verifyOtpButton) {
        verifyOtpButton.addEventListener("click", async () => {
            if (otpAlert) AuthUI.clearAlert(otpAlert);

            const entered = otpHidden ? otpHidden.value.trim() : "";

            if (!entered || !/^\d{6}$/.test(entered)) {
                otpBoxes.forEach(b => b.classList.add("is-invalid"));
                AuthUI.showAlert(otpAlert, "Please enter a valid 6-digit OTP.");
                return;
            }

            verifyOtpButton.disabled = true;

            try {
                const { ok, result } = await AuthUI.postApi('/accounts/api/verify-otp/', {
                    target: phone.value.trim(),
                    otp: entered,
                    purpose: 'registration'
                });

                if (ok && result.status === 'success') {
                    phoneVerified = true;
                    otpBoxes.forEach(b => b.classList.remove("is-invalid"));
                    AuthUI.showAlert(otpAlert, "Phone verified successfully ✓", "success");

                    setTimeout(() => {
                        goToStep(3);
                        password?.focus();
                        AuthUI.showAlert(alertBox, "Phone verified. Create your password to finish.", "success");
                    }, 600);
                } else {
                    otpBoxes.forEach(b => b.classList.add("is-invalid"));
                    AuthUI.showAlert(otpAlert, result.message || "Invalid OTP code. Please try again.", "error");
                }
            } catch (err) {
                AuthUI.showAlert(otpAlert, "Network error. Please try again.", "error");
            } finally {
                verifyOtpButton.disabled = false;
            }
        });
    }

    if (resendOtpButton) {
        resendOtpButton.addEventListener("click", () => {
            if (!AuthUI.validatePhone(phone.value)) {
                if (resendMessage) resendMessage.textContent = "Enter a valid phone number first.";
                return;
            }
            sendOtp();
        });
    }

    if (password) {
        password.addEventListener("input", () => {
            AuthUI.updatePasswordMeter(password, fill, label);

            if (confirm && confirm.value) {
                AuthUI.setFieldState(
                    confirm.closest(".field"),
                    confirm.value === password.value ? "" : "Passwords do not match."
                );
            }
        });
    }

    [fullName, email, phone, confirm].forEach((input) => {
        if (!input) return;
        input.addEventListener("input", () => {
            AuthUI.clearAlert(alertBox);
            AuthUI.setFieldState(input.closest(".field"));
        });
    });

    /* =========================================
       Final Account Creation Submit
       ========================================= */
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        AuthUI.clearAlert(alertBox);

        if (!phoneVerified) {
            goToStep(2);
            AuthUI.showAlert(otpAlert, "Please verify your phone number first.");
            return;
        }

        if (!validateBasicFields()) {
            goToStep(1);
            return;
        }

        if (!validatePasswordFields()) return;

        if (createAccountButton) {
            createAccountButton.disabled = true;
            createAccountButton.classList.add("is-loading");
        }

        try {
            const { ok, result } = await AuthUI.postApi('/accounts/api/register/', {
                full_name: fullName.value.trim(),
                email: email.value.trim(),
                phone: phone.value.trim(),
                password: password.value,
                confirm_password: confirm.value
            });

            if (ok && result.status === 'success') {
                AuthUI.showAlert(alertBox, "Account created successfully! Redirecting…", "success");
                setTimeout(() => {
                    window.location.href = result.redirect_url || "/";
                }, 800);
            } else {
                let errMsg = result.message || "Failed to create account.";
                if (result.errors) {
                    if (result.errors.email) errMsg = Array.isArray(result.errors.email) ? result.errors.email[0] : result.errors.email;
                    else if (result.errors.phone) errMsg = Array.isArray(result.errors.phone) ? result.errors.phone[0] : result.errors.phone;
                    else if (result.errors.password) errMsg = Array.isArray(result.errors.password) ? result.errors.password[0] : result.errors.password;
                    else if (typeof result.errors === 'string') errMsg = result.errors;
                }
                AuthUI.showAlert(alertBox, errMsg, "error");
            }
        } catch (err) {
            AuthUI.showAlert(alertBox, "An unexpected error occurred during account creation.", "error");
        } finally {
            if (createAccountButton) {
                createAccountButton.disabled = false;
                createAccountButton.classList.remove("is-loading");
            }
        }
    });

});