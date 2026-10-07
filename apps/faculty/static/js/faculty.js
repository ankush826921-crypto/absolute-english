(function () {
    "use strict";

    const api = window.LinguaFacultyAPI;

    if (!api) return;

    // Escape HTML to prevent unsafe content
    const escapeHTML = (value) =>
        String(value ?? "").replace(/[&<>"']/g, (character) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[character]);

    // Show placeholder when detail is missing
    const detail = (value) =>
        value === null || value === undefined || value === ""
            ? "Details to be added"
            : escapeHTML(value);

    // Render list items as tags
    const list = (items) =>
        Array.isArray(items) && items.length
            ? items
                  .map(
                      (item) =>
                          `<span class="faculty-tag">${escapeHTML(item)}</span>`
                  )
                  .join("")
            : '<span class="faculty-detail-placeholder">Details to be added</span>';

    // Render trainer card
    function renderTrainer(trainer) {
        const image = trainer.image
            ? `
                <img
                    src="${escapeHTML(trainer.image)}"
                    alt="Stock demo portrait for fictional trainer ${escapeHTML(trainer.name)}"
                    loading="lazy"
                >
            `
            : `
                <div
                    class="faculty-photo-placeholder"
                    aria-label="Trainer photo to be added"
                >
                    <i class="fa-solid fa-user" aria-hidden="true"></i>
                    <span>Photo to be added</span>
                </div>
            `;

        const metric = (value) =>
            value === null || value === undefined || value === ""
                ? "To be added"
                : escapeHTML(value);

        const demoNotice = trainer.demo
            ? `
                
            `
            : "";

        const demoStamp = "";

        const rating = trainer.rating
            ? `
                <span
                    class="faculty-rating-stars"
                    aria-label="${escapeHTML(trainer.rating)} out of 5"
                >
                    ★★★★★
                </span>
                ${metric(trainer.rating)}
            `
            : metric(trainer.rating);

        return `
            <article class="faculty-trainer-card">

                <!-- Trainer Photo -->
                <div class="faculty-trainer-card__photo">
                    ${image}
                    ${demoStamp}
                </div>

                <!-- Trainer Details -->
                <div class="faculty-trainer-card__body">

                    ${demoNotice}

                    <p class="faculty-eyebrow">
                        English trainer
                    </p>

                    <h3>
                        ${detail(trainer.name)}
                    </h3>

                    <p class="faculty-trainer-card__designation">
                        ${detail(trainer.designation)}
                    </p>

                    

                    <!-- Trainer Metrics -->
                    <dl class="faculty-trainer-metrics">

                        <div>
                            <dt>Experience</dt>
                            <dd>${metric(trainer.experience)}</dd>
                        </div>

                        <div>
                            <dt>Rating</dt>
                            <dd>${rating}</dd>
                        </div>

                        <div>
                            <dt>Students</dt>
                            <dd>${metric(trainer.students)}</dd>
                        </div>

                    </dl>

                    <!-- Specializations -->
                    <div class="faculty-trainer-detail">
                        <h4>Specializations</h4>

                        <div class="faculty-tags">
                            ${list(trainer.specialization)}
                        </div>
                    </div>

                    <!-- English Varieties -->
                    <div class="faculty-trainer-detail">
                        <h4>English varieties</h4>

                        <div class="faculty-tags">
                            ${list(trainer.languages)}
                        </div>
                    </div>

                    <!-- Card Actions -->
                    <div class="faculty-card__actions">

                        <a
                            class="faculty-button faculty-button--outline"
                            href="/faculty/profile/?id=${encodeURIComponent(trainer.id)}"
                        >
                            View Profile
                        </a>

                        <a
                            class="faculty-button faculty-button--outline"
                            href="/faculty/courses/?instructor=${encodeURIComponent(trainer.id)}"
                        >
                            View Courses
                        </a>

                        <a
                            class="faculty-button faculty-button--primary"
                            href="/faculty/trial/class/?teacher=${encodeURIComponent(trainer.id)}"
                        >
                            Book Trial Class
                        </a>

                    </div>

                </div>
            </article>
        `;
    }

    // Load trainer after page loads
    document.addEventListener("DOMContentLoaded", async () => {
        const card = document.querySelector("#faculty-card");
        const loading = document.querySelector("#faculty-loading");
        const error = document.querySelector("#faculty-error");

        if (!card || !loading || !error) return;

        async function loadTrainer() {
            loading.hidden = false;
            error.hidden = true;
            card.replaceChildren();

            try {
                const trainers = await api.getTeachers();

                if (!trainers || !trainers.length) {
                    throw new Error("No trainer record returned");
                }

                card.innerHTML = renderTrainer(trainers[0]);

                // Handle image loading error
                const image = card.querySelector("img");

                if (image) {
                    image.addEventListener(
                        "error",
                        () => {
                            image.hidden = true;

                            image.parentElement.innerHTML = `
                                <div
                                    class="faculty-photo-placeholder"
                                    aria-label="Trainer photo unavailable"
                                >
                                    <i
                                        class="fa-solid fa-user"
                                        aria-hidden="true"
                                    ></i>

                                    <span>
                                        Demo portrait unavailable
                                    </span>
                                </div>

                                <span class="faculty-demo-stamp">
                                    Demo profile
                                </span>
                            `;
                        },
                        { once: true }
                    );
                }
            } catch (loadError) {
                console.error(
                    "Unable to load the trainer profile:",
                    loadError
                );

                error.hidden = false;
            } finally {
                loading.hidden = true;
            }
        }

        // Retry button
        document
            .querySelector("[data-retry-faculty]")
            ?.addEventListener("click", loadTrainer);

        // Initial load
        loadTrainer();
    });
})();