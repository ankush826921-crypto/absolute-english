document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#loginForm");
  if (!form) return;

  const email = document.querySelector("#loginEmail");
  const password = document.querySelector("#loginPassword");
  const remember = form.querySelector('input[name="remember"]');
  const alert = document.querySelector("#loginAlert");

  const validate = () => {
    let valid = true;
    const emailField = email.closest(".field");
    const passwordField = password.closest(".field");

    if (!email.value.trim()) {
      AuthUI.setFieldState(emailField, "Enter your email or username.");
      valid = false;
    } else {
      AuthUI.setFieldState(emailField);
    }

    if (!password.value) {
      AuthUI.setFieldState(passwordField, "Enter your password.");
      valid = false;
    } else {
      AuthUI.setFieldState(passwordField);
    }

    return valid;
  };

  [email, password].forEach((input) => {
    input.addEventListener("input", () => {
      AuthUI.clearAlert(alert);
      const field = input.closest(".field");
      if (input.value.trim()) AuthUI.setFieldState(field);
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    AuthUI.clearAlert(alert);

    if (!validate()) {
      AuthUI.showAlert(alert, "Check the highlighted fields and try again.");
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add("is-loading");
    }

    try {
      const { ok, result } = await AuthUI.postApi('/accounts/api/login/', {
        email: email.value.trim(),
        password: password.value,
        remember: remember ? remember.checked : false
      });

      if (ok && result.status === 'success') {
        AuthUI.showAlert(alert, result.message || "Logged in successfully!", "success");
        setTimeout(() => {
          window.location.href = result.redirect_url || "/";
        }, 500);
      } else {
        let errMsg = "Invalid email or password.";
        if (result.message) {
          errMsg = result.message;
        } else if (result.errors) {
          if (typeof result.errors === 'string') errMsg = result.errors;
          else if (result.errors.detail) errMsg = Array.isArray(result.errors.detail) ? result.errors.detail[0] : result.errors.detail;
          else if (result.errors.email) errMsg = Array.isArray(result.errors.email) ? result.errors.email[0] : result.errors.email;
          else if (result.errors.non_field_errors) errMsg = result.errors.non_field_errors[0];
        }
        AuthUI.showAlert(alert, errMsg, "error");
      }
    } catch (err) {
      AuthUI.showAlert(alert, "An error occurred. Please check your network connection.", "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove("is-loading");
      }
    }
  });
});