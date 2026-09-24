(function () {
    "use strict";

    // ==============================
    // API
    // ==============================

    const api = window.LinguaFacultyAPI;

    if (!api) {
        console.error(
            "LinguaFacultyAPI not found. Make sure api.js loads before faculty-courses.js."
        );
        return;
    }


    // ==============================
    // PAGE INITIALIZATION
    // ==============================

    document.addEventListener("DOMContentLoaded", async () => {

        // ==============================
        // DOM ELEMENTS
        // ==============================

        const loading = document.querySelector("#courses-loading");
        const grid = document.querySelector("#course-grid");
        const empty = document.querySelector("#courses-empty");
        const error = document.querySelector("#courses-error");
        const title = document.querySelector("#courses-title");
        const subtitle = document.querySelector("#courses-subtitle");
        const backButton = document.querySelector("#courses-back");
        const emptyTrial = document.querySelector("#empty-trial");


        // ==============================
        // GET INSTRUCTOR ID
        // ==============================

        const params = new URLSearchParams(
            window.location.search
        );

        const teacherId = params.get("instructor") || params.get("teacher");


        // ==============================
        // CHECK REQUIRED ELEMENTS
        // ==============================

        if (!loading || !grid) {
            console.error(
                "Courses page elements not found."
            );
            return;
        }


        // ==============================
        // CHECK INSTRUCTOR ID
        // ==============================

        if (!teacherId) {

            loading.hidden = true;

            if (error) {
                error.hidden = false;
            }

            return;
        }


        // ==============================
        // LOAD COURSES
        // ==============================

        try {

            const courses =
                await api.getCoursesByTeacher(
                    teacherId
                );


            // Hide loading

            loading.hidden = true;


            // ==============================
            // NO COURSES
            // ==============================

            if (!courses || courses.length === 0) {

                if (empty) {
                    empty.hidden = false;
                }

                return;
            }


            // ==============================
            // UPDATE HEADER
            // ==============================

            try {

                const teacher =
                    await api.getTeacher(
                        teacherId
                    );

                if (teacher) {

                    if (title) {
                        title.textContent =
                            `${teacher.name}'s Courses`;
                    }

                    if (subtitle) {
                        subtitle.textContent =
                            `Explore courses taught by ${teacher.name}.`;
                    }

                }

            } catch (teacherError) {

                console.warn(
                    "Teacher information could not be loaded:",
                    teacherError
                );

            }


            // ==============================
            // RENDER COURSES
            // ==============================

            grid.innerHTML = courses
                .map(createCourseCard)
                .join("");


        } catch (err) {

            console.error(
                "Unable to load courses:",
                err
            );


            // Hide loading

            loading.hidden = true;


            // Show error

            if (error) {
                error.hidden = false;
            }

        }

    });


    // ==============================
    // CREATE COURSE CARD
    // ==============================

    function createCourseCard(course) {

        return `
            <article class="faculty-course-card">

                <div class="faculty-course-card__top">

                    <h2>
                        ${course.name}
                    </h2>

                    <span class="faculty-level">
                        ${course.level}
                    </span>

                </div>


                <p>
                    ${course.description}
                </p>


                <div class="faculty-course-meta">

                    <span>
                        <strong>Duration:</strong>
                        ${course.duration}
                    </span>

                    <span>
                        <strong>Language:</strong>
                        ${course.language}
                    </span>

                    <span>
                        <strong>Mode:</strong>
                        ${course.mode}
                    </span>

                </div>


                 <a
                     href="/faculty/trial/class/"
                     class="faculty-button faculty-button--primary"
                 >
                     Trial Class
                 </a>

            </article>
        `;
    }

})();