(function () {
    "use strict";

    const api = window.LinguaFacultyAPI;
    if (!api) return;
    const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);

    function createCourseCard(course, trainer) {
        const title = course.title || course.name || "Course title to be added";
        const englishType = course.english_type || course.englishType || course.language || "English type to be added";
        const level = course.level || "Level to be added";
        const meta = [
            ["English type", englishType],
            ["Duration", course.duration || "To be added"],
            ["Instructor", course.instructor || trainer.name || "To be added"],
            ["Level", level]
        ];
        const highlights = Array.isArray(course.highlights) && course.highlights.length
            ? `<ul class="faculty-course-highlights">${course.highlights.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>`
            : '<p class="faculty-detail-placeholder">Course highlights to be added</p>';
        const demoBadge = course.demo ? '<span class="faculty-course-demo-badge">DEMO COURSE</span>' : "";
        return `
            <article class="faculty-course-card">
                ${demoBadge}
                <p class="faculty-eyebrow">${escapeHTML(englishType)}</p>
                <h2>${escapeHTML(title)}</h2>
                <p class="faculty-course-description">${escapeHTML(course.description || "Course description to be added")}</p>
                <dl class="faculty-course-meta">${meta.map(([label, value]) => `<div><dt>${escapeHTML(label)}</dt><dd>${escapeHTML(value)}</dd></div>`).join("")}</dl>
                <h3>Course highlights</h3>
                ${highlights}
                <a class="faculty-button faculty-button--primary" href="/faculty/trial/class/?teacher=${encodeURIComponent(trainer.id)}">Ask about this course</a>
            </article>`;
    }

    document.addEventListener("DOMContentLoaded", async () => {
        const params = new URLSearchParams(window.location.search);
        const trainerId = params.get("instructor") || params.get("teacher") || params.get("id") || "1";
        const loading = document.querySelector("#courses-loading");
        const grid = document.querySelector("#course-grid");
        const empty = document.querySelector("#courses-empty");
        const error = document.querySelector("#courses-error");
        const title = document.querySelector("#courses-title");
        const subtitle = document.querySelector("#courses-subtitle");
        if (!loading || !grid || !empty || !error) return;

        async function loadCourses() {
            loading.hidden = false;
            empty.hidden = true;
            error.hidden = true;
            grid.replaceChildren();
            try {
                const [trainer, courses] = await Promise.all([
                    api.getTeacher(trainerId),
                    api.getCoursesByTeacher(trainerId)
                ]);
                if (title) title.textContent = trainer.name ? `${trainer.name}’s English courses` : "English courses";
                if (subtitle) subtitle.textContent = trainer.demo ? "Fictional sample courses for frontend testing." : (trainer.name ? `Courses led by ${trainer.name}.` : "Course details will appear here when they are available.");
                if (!Array.isArray(courses) || !courses.length) {
                    empty.hidden = false;
                    return;
                }
                grid.innerHTML = courses.map((course) => createCourseCard(course, trainer)).join("");
            } catch (loadError) {
                console.error("Unable to load courses:", loadError);
                error.hidden = false;
            } finally {
                loading.hidden = true;
            }
        }

        document.querySelector("[data-retry-courses]")?.addEventListener("click", loadCourses);
        loadCourses();
    });
})();