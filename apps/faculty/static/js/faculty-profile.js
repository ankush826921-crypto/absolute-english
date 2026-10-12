(function () {
    "use strict";

    const api = window.LinguaFacultyAPI;
    if (!api) return;
    const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
    const text = (value) => value ? escapeHTML(value) : "Details to be added";
    const items = (values) => Array.isArray(values) && values.length
        ? values.map((value) => `<li>${escapeHTML(value)}</li>`).join("")
        : '<li class="faculty-detail-placeholder">Details to be added</li>';
    const tags = (values) => Array.isArray(values) && values.length
        ? values.map((value) => `<span class="faculty-tag">${escapeHTML(value)}</span>`).join("")
        : '<span class="faculty-detail-placeholder">Details to be added</span>';

    document.addEventListener("DOMContentLoaded", async () => {
        const params = new URLSearchParams(window.location.search);
        const trainerId = params.get("id") || params.get("instructor") || params.get("teacher") || "1";
        const loading = document.querySelector("#profile-loading");
        const content = document.querySelector("#profile-content");
        const error = document.querySelector("#profile-error");
        try {
            const trainer = await api.getTeacher(trainerId);
            document.title = `${trainer.name || "Trainer Profile"} | Absolute English`;
            const photo = trainer.image
                ? `<img src="${escapeHTML(trainer.image)}" alt="Stock demo portrait for fictional trainer ${escapeHTML(trainer.name)}">`
                : '<div class="faculty-photo-placeholder" aria-label="Trainer photo to be added"><i class="fa-solid fa-user" aria-hidden="true"></i><span>Photo to be added</span></div>';
            const metric = (value) => value === null || value === undefined || value === "" ? "To be added" : escapeHTML(value);
            const demoNotice = trainer.demo
                ? ``
                : "";
            const demoStamp = "";
            content.innerHTML = `
                ${demoNotice}
                <section class="faculty-profile-hero">
                    <div class="faculty-profile-hero__image">${photo}${demoStamp}</div>
                    <div class="faculty-profile-hero__content">
                        <p class="faculty-eyebrow">English trainer</p>
                        <h1>${text(trainer.name)}</h1>
                        <p class="faculty-profile-hero__designation">${text(trainer.designation)}</p>
                        <p class="faculty-profile-summary">${text(trainer.bio)}</p>
                        
                        <a class="faculty-button faculty-button--primary" href="/faculty/trial/class/?teacher=${encodeURIComponent(trainer.id)}">Book a trial class</a>
                    </div>
                </section>
                <section class="faculty-profile-grid" aria-label="Trainer details">
                    <article class="faculty-profile-panel faculty-profile-panel--bio"><h2>About</h2><p>${text(trainer.bio)}</p><h2>Teaching methodology</h2><p>${text(trainer.methodology)}</p></article>
                    <article class="faculty-profile-panel"><h2>Languages taught</h2><div class="faculty-tags">${tags(trainer.languages)}</div></article>
                    <article class="faculty-profile-panel"><h2>Qualifications</h2><ul>${items(trainer.qualifications)}</ul></article>
                    <article class="faculty-profile-panel"><h2>Certifications</h2><ul>${items(trainer.certifications)}</ul></article>
                    <article class="faculty-profile-panel"><h2>Specializations</h2><div class="faculty-tags">${tags(trainer.specialization)}</div></article>
                    <article class="faculty-profile-panel"><h2>Availability</h2><p class="faculty-availability">${text(trainer.availability)}</p><a class="faculty-button faculty-button--outline" href="/faculty/courses/?instructor=${encodeURIComponent(trainer.id)}">View courses</a></article>
                </section>`;
            const image = content.querySelector(".faculty-profile-hero__image img");
            if (image) image.addEventListener("error", () => {
                image.parentElement.innerHTML = '<div class="faculty-photo-placeholder" aria-label="Trainer photo unavailable"><i class="fa-solid fa-user" aria-hidden="true"></i><span>Demo portrait unavailable</span></div><span class="faculty-demo-stamp">Demo profile</span>';
            }, { once: true });
        } catch (loadError) {
            console.error("Unable to load the trainer profile:", loadError);
            error.hidden = false;
        } finally {
            loading.hidden = true;
        }
    });
})();