(function (window) {
    "use strict";

    const API_BASE = "/faculty/api";

    async function request(path, options) {
        const response = await fetch(`${API_BASE}${path}`, options);

        if (!response.ok) {
            throw new Error(`Faculty API returned ${response.status}`);
        }

        return response.json();
    }

    const api = {
        API_BASE,

        getEnglishTypes: () => [
            "American English",
            "British English"
        ],

        getTeachers: async () => {
    const data = await request("/");

    if (!data.faculty) {
        return [];
    }

    return [{
        ...data.faculty,

        // Image: if db does not contain the image 
        image: data.faculty.image || "/static/images/default-faculty.jpg",

        // Frontend field names
        specialization: data.faculty.specializations || [],
        languages: [
            "American English",
            "British English"
        ],

        // UI expects this format
        students: data.faculty.students
            ? `${data.faculty.students}+`
            : ""
    }];
},

        getTeacher: async (id) => {
    const data = await request("/");

    if (!data.faculty) {
        return null;
    }

    return {
        ...data.faculty,

        // Image: if db does not contain the image 
        image: data.faculty.image || "/static/images/default-faculty.jpg",



        specialization: data.faculty.specializations || [],
        languages: [
            "American English",
            "British English"
        ],
        students: data.faculty.students
            ? `${data.faculty.students}+`
            : ""
    };
},

        getCoursesByTeacher: async (teacherId) => {
    const data = await request("/courses/");

    return (data.courses || []).map((course) => ({
        ...course,

        instructor: course.faculty || "To be added",

        highlights: [
            "Guided speaking practice",
            "Pronunciation and listening",
            "Practical communication"
        ],

        demo: false
    }));
},

        submitTrialRequest: (data) => {
            const csrfToken = document.querySelector(
        '[name=csrfmiddlewaretoken]'
    )?.value; 
            return request("/trial-booking/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken
                },
                body: JSON.stringify(data)
            });
        }
    };

    window.LinguaFacultyAPI = Object.freeze(api);

})(window);