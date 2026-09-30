/* =========================================
   ABSOLUTE ENGLISH — REGISTER PAGE
   Multi-Step Flow + 6-Box OTP
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

        // Smooth scroll card to top
        const card = form.closest(".auth-card");
        if (card) {
            card.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    /* =========================================
       Registration Fields
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
    let otpSent = false;
    const DEMO_OTP = "123456";

    /* =========================================
       6-BOX OTP — Behaviour
       ========================================= */
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
       Send OTP → Go to Step 2
       ========================================= */
    const sendOtp = () => {
        otpSent = true;
        phoneVerified = false;
        clearOtpBoxes();

        // Show phone number in step 2
        if (otpPhoneDisplay && phone.value.trim()) {
            otpPhoneDisplay.textContent = `Enter the 6-digit code sent to ${phone.value.trim()}`;
        }

        if (otpAlert) {
            AuthUI.clearAlert(otpAlert);
            AuthUI.showAlert(
                otpAlert,
                "OTP sent. For this demo, use 123456.",
                "success"
            );
        }
        if (resendMessage) resendMessage.textContent = "";

        // 🎯 GO TO STEP 2
        goToStep(2);

        setTimeout(() => otpBoxes[0]?.focus(), 350);
    };

    /* =========================================
       Phone Blur → Trigger OTP
       ========================================= */
    if (phone) {
        phone.addEventListener("input", () => {
            // If user edits phone, reset verification
            if (phoneVerified) {
                phoneVerified = false;
                otpSent = false;
                clearOtpBoxes();
            }
        });

        phone.addEventListener("blur", () => {
            if (phoneVerified) return;
            if (!phone.value.trim()) return;

            if (!AuthUI.validatePhone(phone.value)) {
                AuthUI.setFieldState(phone.closest(".field"), "Enter a valid phone number.");
                return;
            }

            AuthUI.setFieldState(phone.closest(".field"), "");
            sendOtp();
        });
    }

    /* =========================================
       Back to Step 1
       ========================================= */
    if (backToStep1) {
        backToStep1.addEventListener("click", () => {
            clearOtpBoxes();
            if (otpAlert) AuthUI.clearAlert(otpAlert);
            goToStep(1);
            phone?.focus();
        });
    }

    /* =========================================
       Verify OTP → Go to Step 3
       ========================================= */
    if (verifyOtpButton) {
        verifyOtpButton.addEventListener("click", () => {
            if (otpAlert) AuthUI.clearAlert(otpAlert);

            const entered = otpHidden ? otpHidden.value.trim() : "";

            if (!entered) {
                otpBoxes.forEach(b => b.classList.add("is-invalid"));
                AuthUI.showAlert(otpAlert, "Enter the 6-digit OTP.");
                return;
            }

            if (!/^\d{6}$/.test(entered)) {
                otpBoxes.forEach(b => b.classList.add("is-invalid"));
                AuthUI.showAlert(otpAlert, "OTP must be exactly 6 digits.");
                return;
            }

            if (entered !== DEMO_OTP) {
                otpBoxes.forEach(b => b.classList.add("is-invalid"));
                AuthUI.showAlert(otpAlert, "Invalid OTP. Please check and try again.");
                return;
            }

            /* SUCCESS */
            phoneVerified = true;
            otpBoxes.forEach(b => b.classList.remove("is-invalid"));

            AuthUI.showAlert(otpAlert, "Phone verified ✓", "success");

            setTimeout(() => {
                // 🎯 GO TO STEP 3
                goToStep(3);
                password?.focus();
                AuthUI.showAlert(alertBox, "Phone verified. Create your account.", "success");
            }, 700);
        });
    }

    /* =========================================
       Resend OTP
       ========================================= */
    if (resendOtpButton) {
        resendOtpButton.addEventListener("click", () => {
            if (!AuthUI.validatePhone(phone.value)) {
                if (resendMessage) resendMessage.textContent = "Enter a valid phone number first.";
                return;
            }

            phoneVerified = false;
            clearOtpBoxes();

            if (otpAlert) {
                AuthUI.clearAlert(otpAlert);
                AuthUI.showAlert(otpAlert, "New OTP sent. For demo, use 123456.", "success");
            }
            if (resendMessage) resendMessage.textContent = "A new OTP has been sent.";

            setTimeout(() => otpBoxes[0]?.focus(), 250);
        });
    }

    /* =========================================
       Password Meter
       ========================================= */
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

    /* =========================================
       Clear validation while typing
       ========================================= */
    [fullName, email, phone, confirm].forEach((input) => {
        if (!input) return;
        input.addEventListener("input", () => {
            AuthUI.setFieldState(input.closest(".field"));
        });
    });

    /* =========================================
       Submit
       ========================================= */
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        AuthUI.clearAlert(alertBox);

        if (!phoneVerified) {
            // Should not happen since we control steps, but safety net
            goToStep(2);
            return;
        }

        if (!validateBasicFields()) {
            goToStep(1);
            return;
        }

        if (!validatePasswordFields()) return;

        if (createAccountButton) createAccountButton.classList.add("is-loading");

        setTimeout(() => {
            if (createAccountButton) createAccountButton.classList.remove("is-loading");
            AuthUI.markDemoSuccess(
                "Account verified! Backend connection coming soon."
            );
        }, 1000);
    });

});