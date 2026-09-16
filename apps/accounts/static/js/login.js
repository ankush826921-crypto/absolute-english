document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#loginForm");
  if (!form) return;

  const email = document.querySelector("#loginEmail");
  const password = document.querySelector("#loginPassword");
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

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    AuthUI.clearAlert(alert);

    if (!validate()) {
      AuthUI.showAlert(alert, "Check the highlighted fields and try again.");
      return;
    }

    // Frontend-only demo: no real authentication request is made.
    AuthUI.markDemoSuccess("Login details look valid. Backend authentication is not connected yet.");
  });
});
