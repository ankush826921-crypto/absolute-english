(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  window.AuthUI = {
    $,
    $$,

    getPreferredTheme() {
      try {
        return localStorage.getItem("theme") || "light";
      } catch (e) {
        return "light";
      }
    },

    applyTheme(theme) {
      const isDark = theme === "dark";
      if (isDark) {
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.removeAttribute("data-theme");
      }

      const themeIcons = $$("#themeIcon, .theme-icon");
      themeIcons.forEach((icon) => {
        if (isDark) {
          icon.classList.remove("fa-moon");
          icon.classList.add("fa-sun");
        } else {
          icon.classList.remove("fa-sun");
          icon.classList.add("fa-moon");
        }
      });
    },

    toggleTheme() {
      const currentTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("theme", newTheme);
      } catch (e) {}
      this.applyTheme(newTheme);
    },

    initTheme() {
      this.applyTheme(this.getPreferredTheme());

      const toggles = $$("#themeToggle, .theme-toggle");
      toggles.forEach((btn) => {
        btn.addEventListener("click", () => this.toggleTheme());
      });

      window.addEventListener("storage", (event) => {
        if (event.key === "theme") {
          this.applyTheme(event.newValue || "light");
        }
      });
    },

    showAlert(element, message, type = "error") {
      if (!element) return;
      element.textContent = message;
      element.classList.toggle("success", type === "success");
      element.classList.add("is-visible");
    },

    clearAlert(element) {
      if (!element) return;
      element.textContent = "";
      element.classList.remove("is-visible", "success");
    },

    setFieldState(field, message = "") {
      if (!field) return;
      const input = $("input", field);
      const messageEl = $(".field-message", field);
      const invalid = Boolean(message);

      field.classList.toggle("is-invalid", invalid);
      field.classList.toggle("is-valid", !invalid && Boolean(input?.value));
      if (messageEl) messageEl.textContent = message;
      if (input) input.setAttribute("aria-invalid", String(invalid));
    },

    validateEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    },

    validatePhone(value) {
      return /^[0-9+\-\s()]{7,20}$/.test(value.trim());
    },

    passwordScore(value) {
      let score = 0;
      if (value.length >= 8) score++;
      if (/[a-z]/.test(value)) score++;
      if (/[A-Z]/.test(value)) score++;
      if (/\d/.test(value)) score++;
      if (/[^A-Za-z0-9]/.test(value)) score++;
      return score;
    },

    updatePasswordMeter(input, fill, label) {
      if (!input || !fill || !label) return;
      
      const val = input.value;
      if (!val) {
        fill.style.width = "0%";
        fill.style.setProperty("--meter-color", "transparent");
        label.textContent = "Use at least 8 characters.";
        label.style.color = "var(--text-light)";
        return;
      }

      const score = this.passwordScore(val);
      const widths = ["0%", "20%", "40%", "60%", "80%", "100%"];
      const labels = ["", "Very weak", "Weak", "Fair", "Strong", "Excellent"];
      
      fill.style.width = widths[score];
      label.textContent = labels[score] || "Use at least 8 characters.";

      let colorVar = "var(--danger, #dc3545)";
      if (score === 3) {
        colorVar = "var(--amber, #ffc107)";
      } else if (score >= 4) {
        colorVar = "var(--success, #198754)";
      }

      fill.style.setProperty("--meter-color", colorVar);
      fill.style.background = colorVar;
      label.style.color = colorVar;
    },

    setupPasswordToggles() {
      $$(".password-toggle").forEach((button) => {
        button.addEventListener("click", () => {
          const inputId = button.getAttribute("aria-controls");
          const input = document.getElementById(inputId);
          if (!input) return;
          const hidden = input.type === "password";
          input.type = hidden ? "text" : "password";
          button.textContent = hidden ? "Hide" : "Show";
          button.setAttribute("aria-label", hidden ? "Hide password" : "Show password");
        });
      });
    },

    markDemoSuccess(message = "Demo action completed.") {
      const alert = $(".form-alert");
      this.showAlert(alert, message, "success");
    }
  };

  // Immediately apply preferred theme as early as script is executed
  AuthUI.applyTheme(AuthUI.getPreferredTheme());

  document.addEventListener("DOMContentLoaded", () => {
    AuthUI.initTheme();
    AuthUI.setupPasswordToggles();

    $$("[data-demo-link]").forEach((link) => {
      link.addEventListener("click", (event) => {
        const target = link.dataset.demoLink;
        if (target) {
          event.preventDefault();
          window.location.href = target;
        }
      });
    });
  });
})();