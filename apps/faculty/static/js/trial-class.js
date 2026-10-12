(function () {
    "use strict";

    const api = window.LinguaFacultyAPI;
    if (!api) return;

    document.addEventListener("DOMContentLoaded", async () => {
        const form = document.querySelector("#trial-form");
        const loading = document.querySelector("#trial-loading");
        const fatalError = document.querySelector("#trial-error");
        const status = document.querySelector("#form-status");
        const courseSelect = document.querySelector("#trial-course");
        const params = new URLSearchParams(window.location.search);
        const trainerId = params.get("teacher") || params.get("instructor") || params.get("id") || "1";
        if (!form || !loading || !fatalError || !status) return;

        const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
        })[character]);
        const setStatus = (message, kind) => {
            status.textContent = message;
            status.className = `faculty-form__notice faculty-form__notice--${kind}`;
            status.hidden = false;
        };

        try {
            const languageSelect = form.elements.english_type;
            const englishTypes = api.getEnglishTypes ? api.getEnglishTypes() : ["American English", "British English"];
            englishTypes.forEach((englishType) => {
                const option = document.createElement("option");
                option.value = englishType;
                option.textContent = englishType;
                languageSelect.append(option);
            });
            const courses = await api.getCoursesByTeacher(trainerId);
            if (Array.isArray(courses) && courseSelect) {
                courses.forEach((course) => {
                    const option = document.createElement("option");
                    option.value = course.id ?? course.slug ?? course.title ?? course.name ?? "";
                    option.textContent = course.title || course.name || "Course";
                    courseSelect.append(option);
                });
            }
            loading.hidden = true;
            form.hidden = false;
        } catch (loadError) {
            console.error("Unable to prepare the trial request form:", loadError);
            loading.hidden = true;
            fatalError.hidden = false;
            return;
        }

        const dateField = form.elements.preferred_date;
        const today = new Date();
        dateField.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            status.hidden = true;
            form.querySelectorAll(".faculty-field-error").forEach((error) => { error.textContent = ""; });
            form.querySelectorAll(".is-invalid").forEach((field) => field.classList.remove("is-invalid"));

            const formData = Object.fromEntries(new FormData(form).entries());

const payload = {
    student_name: formData.student_name,
    email: formData.email,
    phone: formData.phone,
    faculty: trainerId,
    course: formData.course || "",
    english_type: formData.english_type === "American English"
        ? "american"
        : "british",
    preferred_date: formData.preferred_date,
    preferred_time: formData.preferred_time,
    message: formData.message || ""
};
            let valid = true;
            for (const field of form.querySelectorAll("[required]")) {
                const message = field.value.trim() ? "" : "This field is required.";
                if (!message) continue;
                valid = false;
                field.classList.add("is-invalid");
                field.parentElement.querySelector(".faculty-field-error").textContent = message;
            }

            const email = form.elements.email;
            if (email.value && !email.validity.valid) {
                valid = false;
                email.classList.add("is-invalid");
                email.parentElement.querySelector(".faculty-field-error").textContent = "Enter a valid email address.";
            }
            const phone = form.elements.phone;
            if (phone.value && !/^[0-9+()\s.-]{7,24}$/.test(phone.value.trim())) {
                valid = false;
                phone.classList.add("is-invalid");
                phone.parentElement.querySelector(".faculty-field-error").textContent = "Enter a valid phone number.";
            }
            if (dateField.value && dateField.value < dateField.min) {
                valid = false;
                dateField.classList.add("is-invalid");
                dateField.parentElement.querySelector(".faculty-field-error").textContent = "Choose today or a future date.";
            }
            if (!valid) {
                setStatus("Please correct the highlighted fields.", "error");
                form.querySelector(".is-invalid")?.focus();
                return;
            }

            const button = form.querySelector("[type=submit]");
            const buttonLabel = button.querySelector("span");
            button.disabled = true;
            button.setAttribute("aria-busy", "true");
            buttonLabel.textContent = "Submitting…";
            try {
                const result = await api.submitTrialRequest(payload);
                if (result?.mode === "preview") {
                    setStatus("Your request passed frontend validation. It has not been sent or saved; Django submission can be connected later.", "success");
                } else {
                    setStatus("Your trial class request has been received.", "success");
                    form.reset();
                }
            } catch (submitError) {
                console.error("Unable to submit the trial request:", submitError);
                setStatus("We couldn’t submit your request. Please try again.", "error");
            } finally {
                button.disabled = false;
                button.removeAttribute("aria-busy");
                buttonLabel.textContent = "Book my trial class";
            }
        });
    });
})();