document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#registerForm");

    if (!form) {
        return;
    }

    /* =========================================
       Registration Fields
       ========================================= */

    const fullName = document.querySelector("#fullName");
    const email = document.querySelector("#registerEmail");
    const phone = document.querySelector("#phone");

    const password = document.querySelector("#registerPassword");
    const confirm = document.querySelector("#confirmPassword");
    const terms = document.querySelector("#terms");

    const alert = document.querySelector("#registerAlert");

    const fill = document.querySelector("#passwordMeterFill");
    const label = document.querySelector("#passwordMeterLabel");

    /* =========================================
       OTP Elements
       ========================================= */

    const otpSection = document.querySelector("#registrationOtpSection");
    const otpInput = document.querySelector("#registrationOtp");
    const verifyOtpButton = document.querySelector("#verifyRegistrationOtp");
    const resendOtpButton = document.querySelector("#resendRegistrationOtp");

    const otpAlert = document.querySelector("#registrationOtpAlert");
    const resendMessage = document.querySelector("#resendMessage");

    /* =========================================
       Fields After OTP
       ========================================= */

    const passwordField = password
        ? password.closest(".field")
        : null;

    const passwordMeter = document.querySelector(".password-meter");

    const confirmField = confirm
        ? confirm.closest(".field")
        : null;

    const termsField = terms
        ? terms.closest(".checkbox-line")
        : null;

    const createAccountButton = form.querySelector(
        'button[type="submit"]'
    );

    /* =========================================
       OTP State
       ========================================= */

    let phoneVerified = false;
    let otpSent = false;

    // Frontend demo OTP only.
    // Real SMS OTP will be connected during backend integration.
    const DEMO_OTP = "123456";

    /* =========================================
       Initial Registration State
       ========================================= */

    const lockRegistrationFields = () => {
        if (passwordField) {
            passwordField.hidden = true;
        }

        if (passwordMeter) {
            passwordMeter.hidden = true;
        }

        if (confirmField) {
            confirmField.hidden = true;
        }

        if (termsField) {
            termsField.hidden = true;
        }

        if (createAccountButton) {
            createAccountButton.hidden = true;
        }

        if (password) {
            password.disabled = true;
            password.value = "";
        }

        if (confirm) {
            confirm.disabled = true;
            confirm.value = "";
        }

        if (terms) {
            terms.disabled = true;
            terms.checked = false;
        }

        if (createAccountButton) {
            createAccountButton.disabled = true;
        }

        // Reset password meter visuals on lock
        if (password && fill && label) {
            AuthUI.updatePasswordMeter(password, fill, label);
        }
    };

    const unlockRegistrationFields = () => {
        if (passwordField) {
            passwordField.hidden = false;
        }

        if (passwordMeter) {
            passwordMeter.hidden = false;
        }

        if (confirmField) {
            confirmField.hidden = false;
        }

        if (termsField) {
            termsField.hidden = false;
        }

        if (createAccountButton) {
            createAccountButton.hidden = false;
        }

        if (password) {
            password.disabled = false;
        }

        if (confirm) {
            confirm.disabled = false;
        }

        if (terms) {
            terms.disabled = false;
        }

        if (createAccountButton) {
            createAccountButton.disabled = false;
        }
    };

    // OTP must be completed before password section becomes available.
    lockRegistrationFields();

    /* =========================================
       Helper: Show OTP Section
       ========================================= */

    const showOtpSection = () => {
        if (!otpSection) {
            return;
        }

        otpSection.hidden = false;

        otpSection.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });

        if (otpInput) {
            setTimeout(() => {
                otpInput.focus();
            }, 300);
        }
    };

    /* =========================================
       Helper: Hide OTP Section
       ========================================= */

    const hideOtpSection = () => {
        if (!otpSection) {
            return;
        }

        otpSection.hidden = true;
    };

    /* =========================================
       Helper: Send Demo OTP
       ========================================= */

    const sendOtp = () => {
        if (!phone) {
            return;
        }

        otpSent = true;
        phoneVerified = false;

        if (otpInput) {
            otpInput.value = "";

            otpInput.classList.remove(
                "is-invalid",
                "is-valid"
            );
        }

        if (otpAlert) {
            AuthUI.clearAlert(otpAlert);

            AuthUI.showAlert(
                otpAlert,
                "OTP sent successfully. For this demo, use 123456.",
                "success"
            );
        }

        if (resendMessage) {
            resendMessage.textContent = "";
        }

        showOtpSection();
    };

    /* =========================================
       Validate Basic Registration Fields
       ========================================= */

    const validateBasicFields = () => {
        let valid = true;

        const checks = [
            [
                fullName,
                fullName.value.trim().length >= 2,
                "Enter your full name.",
            ],

            [
                email,
                AuthUI.validateEmail(email.value),
                "Enter a valid email address.",
            ],

            [
                phone,
                AuthUI.validatePhone(phone.value),
                "Enter a valid phone number.",
            ],
        ];

        checks.forEach(([input, isValid, message]) => {
            AuthUI.setFieldState(
                input.closest(".field"),
                isValid ? "" : message
            );

            if (!isValid) {
                valid = false;
            }
        });

        return valid;
    };

    /* =========================================
       Validate Password Section
       ========================================= */

    const validatePasswordFields = () => {
        let valid = true;

        const passwordValid =
            AuthUI.passwordScore(password.value) >= 3;

        AuthUI.setFieldState(
            password.closest(".field"),
            passwordValid
                ? ""
                : "Use a stronger password (8+ characters recommended)."
        );

        if (!passwordValid) {
            valid = false;
        }

        const confirmValid =
            Boolean(confirm.value) &&
            confirm.value === password.value;

        AuthUI.setFieldState(
            confirm.closest(".field"),
            confirmValid
                ? ""
                : "Passwords do not match."
        );

        if (!confirmValid) {
            valid = false;
        }

        if (!terms.checked) {
            AuthUI.showAlert(
                alert,
                "Please accept the terms and conditions."
            );

            valid = false;
        }

        return valid;
    };

    /* =========================================
       Password Meter & Confirm Matching
       ========================================= */

    if (password) {
        password.addEventListener("input", () => {
            AuthUI.updatePasswordMeter(
                password,
                fill,
                label
            );

            if (confirm && confirm.value) {
                AuthUI.setFieldState(
                    confirm.closest(".field"),
                    confirm.value === password.value
                        ? ""
                        : "Passwords do not match."
                );
            }
        });
    }

    /* =========================================
       Clear Validation While Typing
       ========================================= */

    [
        fullName,
        email,
        phone,
        confirm,
    ].forEach((input) => {
        if (!input) {
            return;
        }

        input.addEventListener("input", () => {
            AuthUI.setFieldState(
                input.closest(".field")
            );
        });
    });

    /* =========================================
       PHONE NUMBER INPUT
       ========================================= */

    if (phone) {
        phone.addEventListener("input", () => {
            /*
             * Changing the phone number invalidates
             * the previous OTP verification.
             */

            phoneVerified = false;
            otpSent = false;

            hideOtpSection();

            lockRegistrationFields();

            if (otpInput) {
                otpInput.value = "";

                otpInput.classList.remove(
                    "is-invalid",
                    "is-valid"
                );
            }

            if (otpAlert) {
                AuthUI.clearAlert(otpAlert);
            }

            if (resendMessage) {
                resendMessage.textContent = "";
            }
        });

        /* =========================================
           PHONE NUMBER BLUR
           ========================================= */

        phone.addEventListener("blur", () => {
            /*
             * OTP starts immediately after a valid
             * phone number is entered.
             */

            if (phoneVerified) {
                return;
            }

            if (!phone.value.trim()) {
                return;
            }

            if (!AuthUI.validatePhone(phone.value)) {
                AuthUI.setFieldState(
                    phone.closest(".field"),
                    "Enter a valid phone number."
                );

                return;
            }

            AuthUI.setFieldState(
                phone.closest(".field"),
                ""
            );

            sendOtp();
        });
    }

    /* =========================================
       Registration Submit
       ========================================= */

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        AuthUI.clearAlert(alert);

        /*
         * OTP verification is mandatory.
         */

        if (!phoneVerified) {
            AuthUI.showAlert(
                alert,
                "Please verify your phone number before creating your account."
            );

            showOtpSection();

            return;
        }

        /*
         * Validate password + confirmation + terms.
         */

        if (!validatePasswordFields()) {
            if (!alert.classList.contains("is-visible")) {
                AuthUI.showAlert(
                    alert,
                    "Check the highlighted fields and try again."
                );
            }

            return;
        }

        /*
         * Frontend demo success.
         * Backend account creation will be connected later.
         */

        AuthUI.markDemoSuccess(
            "Account details verified successfully. Backend account creation is not connected yet."
        );
    });

    /* =========================================
       VERIFY OTP
       ========================================= */

    if (verifyOtpButton) {
        verifyOtpButton.addEventListener("click", () => {
            if (!otpInput) {
                return;
            }

            if (otpAlert) {
                AuthUI.clearAlert(otpAlert);
            }

            const enteredOtp = otpInput.value.trim();

            /* OTP required */

            if (!enteredOtp) {
                AuthUI.setFieldState(
                    otpInput.closest(".field"),
                    "Enter the 6-digit OTP."
                );

                return;
            }

            /* OTP must be 6 digits */

            if (!/^\d{6}$/.test(enteredOtp)) {
                AuthUI.setFieldState(
                    otpInput.closest(".field"),
                    "OTP must contain exactly 6 digits."
                );

                return;
            }

            /* Check demo OTP */

            if (enteredOtp !== DEMO_OTP) {
                AuthUI.setFieldState(
                    otpInput.closest(".field"),
                    "Invalid OTP. Please try again."
                );

                if (otpAlert) {
                    AuthUI.showAlert(
                        otpAlert,
                        "The OTP is incorrect. Please check the code and try again."
                    );
                }

                return;
            }

            /* =========================================
               OTP VERIFIED
               ========================================= */

            phoneVerified = true;
            otpSent = true;

            AuthUI.setFieldState(
                otpInput.closest(".field"),
                ""
            );

            otpInput.classList.remove("is-invalid");
            otpInput.classList.add("is-valid");

            if (otpAlert) {
                AuthUI.showAlert(
                    otpAlert,
                    "Phone number verified successfully.",
                    "success"
                );
            }

            /*
             * Hide OTP and unlock the rest of
             * the registration form.
             */

            setTimeout(() => {
                hideOtpSection();

                unlockRegistrationFields();

                if (password) {
                    password.focus();
                }

                AuthUI.showAlert(
                    alert,
                    "Phone verified. You can now create your account.",
                    "success"
                );
            }, 700);
        });
    }

    /* =========================================
       RESEND OTP
       ========================================= */

    if (resendOtpButton) {
        resendOtpButton.addEventListener("click", () => {
            if (!phone.value.trim()) {
                if (resendMessage) {
                    resendMessage.textContent =
                        "Enter your phone number first.";
                }

                return;
            }

            if (!AuthUI.validatePhone(phone.value)) {
                if (resendMessage) {
                    resendMessage.textContent =
                        "Enter a valid phone number first.";
                }

                return;
            }

            otpSent = true;
            phoneVerified = false;

            lockRegistrationFields();

            if (otpInput) {
                otpInput.value = "";

                otpInput.classList.remove(
                    "is-invalid",
                    "is-valid"
                );
            }

            if (otpAlert) {
                AuthUI.clearAlert(otpAlert);

                AuthUI.showAlert(
                    otpAlert,
                    "A new OTP has been sent. For this demo, use 123456.",
                    "success"
                );
            }

            if (resendMessage) {
                resendMessage.textContent =
                    "A new OTP has been sent.";
            }

            showOtpSection();
        });
    }

    /* =========================================
       OTP INPUT
       ========================================= */

    if (otpInput) {
        otpInput.addEventListener("input", () => {
            otpInput.value =
                otpInput.value.replace(/\D/g, "");

            if (otpInput.value.length > 6) {
                otpInput.value =
                    otpInput.value.slice(0, 6);
            }

            AuthUI.setFieldState(
                otpInput.closest(".field")
            );
        });

        otpInput.addEventListener("keydown", (event) => {
            if (
                event.key === "Enter" &&
                verifyOtpButton
            ) {
                event.preventDefault();

                verifyOtpButton.click();
            }
        });
    }
});