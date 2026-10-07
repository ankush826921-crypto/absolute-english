document.addEventListener("DOMContentLoaded", function () {

    console.log("GALLERY JS WORKING");

    const gallery =
        document.querySelector(".gallery-page");

    if (!gallery) {
        console.log("Gallery page not found");
        return;
    }

    const cards =
        Array.from(
            gallery.querySelectorAll(".gallery-card")
        );

    const filters =
        gallery.querySelectorAll(
            ".gallery-filter"
        );

    let activeCategory = "all";

    const lightbox =
        document.getElementById(
            "galleryLightbox"
        );

    const lightboxImage =
        document.getElementById(
            "galleryLightboxImage"
        );

    const lightboxTitle =
        document.getElementById(
            "galleryLightboxTitle"
        );

    const lightboxCategory =
        document.getElementById(
            "galleryLightboxCategory"
        );

    const closeButton =
        document.getElementById(
            "galleryLightboxClose"
        );

    const prevButton =
        document.getElementById(
            "galleryLightboxPrev"
        );

    const nextButton =
        document.getElementById(
            "galleryLightboxNext"
        );

    const recommendedModal =
        document.getElementById(
            "galleryRecommendedModal"
        );

    const recommendedGrid =
        document.getElementById(
            "galleryRecommendedGrid"
        );

    const recommendedClose =
        document.getElementById(
            "galleryRecommendedClose"
        );

    let visibleCards = [];
    let currentIndex = 0;


    /* =====================================================
       UPDATE VISIBLE CARDS
       ===================================================== */

    function updateVisibleCards() {

        visibleCards =
            cards.filter(function (card) {

                return !card.classList.contains(
                    "gallery-hidden"
                );

            });

    }


    /* =====================================================
       VIEW MORE BUTTON CONTROL
       ALL = HIDDEN
       CATEGORY = VISIBLE
       ===================================================== */

    function updateViewMoreButtons() {

        const exploreButtons =
            gallery.querySelectorAll(
                ".gallery-explore-button"
            );

        exploreButtons.forEach(
            function (button) {

                if (activeCategory === "all") {

                    button.style.display = "none";

                } else {

                    button.style.display = "flex";

                }

            }
        );

    }


    /* =====================================================
       LIGHTBOX
       ===================================================== */

    function openLightbox(card) {

        if (!card || !lightbox) {
            return;
        }

        updateVisibleCards();

        currentIndex =
            visibleCards.indexOf(card);

        if (currentIndex === -1) {
            currentIndex = 0;
        }

        showImage();

        lightbox.classList.add("active");

        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "gallery-lightbox-open"
        );

        console.log(
            "LIGHTBOX OPENED"
        );

    }


    function showImage() {

        if (!visibleCards.length) {
            return;
        }

        const card =
            visibleCards[currentIndex];

        if (!card) {
            return;
        }

        const image =
            card.querySelector(
                ".gallery-image"
            );

        const title =
            card.querySelector(
                "h2"
            );

        const category =
            card.querySelector(
                ".gallery-category"
            );

        if (
            image &&
            lightboxImage
        ) {

            lightboxImage.src =
                image.currentSrc ||
                image.src;

            lightboxImage.alt =
                image.alt ||
                "Gallery preview";

        }

        if (lightboxTitle) {

            lightboxTitle.textContent =
                title
                    ? title.textContent.trim()
                    : "";

        }

        if (lightboxCategory) {

            lightboxCategory.textContent =
                category
                    ? category.textContent.trim()
                    : "";

        }

    }


    function closeLightbox() {

        if (!lightbox) {
            return;
        }

        lightbox.classList.remove(
            "active"
        );

        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "gallery-lightbox-open"
        );

    }


    function nextImage() {

        updateVisibleCards();

        if (!visibleCards.length) {
            return;
        }

        currentIndex =
            (
                currentIndex + 1
            ) %
            visibleCards.length;

        showImage();

    }


    function previousImage() {

        updateVisibleCards();

        if (!visibleCards.length) {
            return;
        }

        currentIndex =
            (
                currentIndex -
                1 +
                visibleCards.length
            ) %
            visibleCards.length;

        showImage();

    }


    /* =====================================================
       RECOMMENDED IMAGES
       ===================================================== */

    function openRecommendedImages(
        selectedCard
    ) {

        if (
            !recommendedModal ||
            !recommendedGrid ||
            !selectedCard
        ) {
            return;
        }

        const selectedCategory =
            selectedCard.dataset.category;

        if (!selectedCategory) {

            console.log(
                "Selected card has no category"
            );

            return;
        }

        console.log(
            "Recommendation category:",
            selectedCategory
        );

        const recommendedCards =
            cards.filter(function (card) {

                return (
                    card !== selectedCard &&
                    card.dataset.category ===
                        selectedCategory
                );

            });

        console.log(
            "Recommended cards:",
            recommendedCards.length
        );

        recommendedGrid.innerHTML = "";

        if (
            recommendedCards.length === 0
        ) {

            recommendedGrid.innerHTML = `
                <div class="gallery-recommended-empty">
                    No more images available
                    in this category.
                </div>
            `;

            openRecommendedModal();

            return;
        }


        recommendedCards.forEach(
            function (card) {

                const image =
                    card.querySelector(
                        ".gallery-image"
                    );

                const title =
                    card.querySelector(
                        "h2"
                    );

                const category =
                    card.querySelector(
                        ".gallery-category"
                    );

                if (!image) {
                    return;
                }

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "gallery-recommended-item";

                const imageUrl =
                    image.currentSrc ||
                    image.src;

                const imageAlt =
                    image.alt ||
                    "Gallery image";

                const imageTitle =
                    title
                        ? title.textContent.trim()
                        : "Gallery Image";

                const categoryName =
                    category
                        ? category.textContent.trim()
                        : "";

                item.innerHTML = `
                    <img
                        src="${imageUrl}"
                        alt="${imageAlt}"
                        loading="lazy"
                    >

                    <div
                        class="gallery-recommended-item-title"
                    >
                        ${imageTitle}
                    </div>

                    <div
                        class="gallery-recommended-item-category"
                    >
                        ${categoryName}
                    </div>
                `;

                item.addEventListener(
                    "click",
                    function () {

                        closeRecommendedImages();

                        openLightbox(
                            card
                        );

                    }
                );

                recommendedGrid.appendChild(
                    item
                );

            }
        );

        openRecommendedModal();

    }


    function openRecommendedModal() {

        if (!recommendedModal) {
            return;
        }

        recommendedModal.classList.add(
            "active"
        );

        recommendedModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "gallery-recommended-open"
        );

    }


    function closeRecommendedImages() {

        if (!recommendedModal) {
            return;
        }

        recommendedModal.classList.remove(
            "active"
        );

        recommendedModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "gallery-recommended-open"
        );

    }


    /* =====================================================
       RECOMMENDED CLOSE
       ===================================================== */

    if (recommendedClose) {

        recommendedClose.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                closeRecommendedImages();

            }
        );

    }


    if (recommendedModal) {

        recommendedModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    recommendedModal
                ) {

                    closeRecommendedImages();

                }

            }
        );

    }


    /* =====================================================
       FILTER BUTTONS
       ===================================================== */

    filters.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const category =
                        button.dataset.category;

                    activeCategory =
                        category;

                    console.log(
                        "Active category:",
                        activeCategory
                    );


                    /* Remove active from all */

                    filters.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    /* Add active to clicked */

                    button.classList.add(
                        "active"
                    );


                    /* Show / hide cards */

                    cards.forEach(
                        function (card) {

                            const cardCategory =
                                card.dataset.category;

                            if (
                                category === "all" ||
                                cardCategory === category
                            ) {

                                card.classList.remove(
                                    "gallery-hidden"
                                );

                            } else {

                                card.classList.add(
                                    "gallery-hidden"
                                );

                            }

                        }
                    );


                    updateVisibleCards();

                    /* 
                       IMPORTANT:
                       All = hide View more
                       Category = show View more
                    */

                    updateViewMoreButtons();

                }
            );

        }
    );


    /* =====================================================
       GALLERY CLICK HANDLER
       ===================================================== */

    gallery.addEventListener(
        "click",
        function (event) {


            /* ---------------------------------------------
               VIEW MORE BUTTON
               --------------------------------------------- */

            const exploreButton =
                event.target.closest(
                    ".gallery-explore-button"
                );

            if (exploreButton) {

                event.preventDefault();
                event.stopPropagation();

                /*
                   Safety check:
                   View More should never open
                   when All filter is active.
                */

                if (activeCategory === "all") {
                    return;
                }

                const card =
                    exploreButton.closest(
                        ".gallery-card"
                    );

                openRecommendedImages(
                    card
                );

                return;

            }


            /* ---------------------------------------------
               TOP RIGHT IMAGE BUTTON
               --------------------------------------------- */

            const openButton =
                event.target.closest(
                    ".gallery-open-button"
                );

            if (openButton) {

                event.preventDefault();
                event.stopPropagation();

                const card =
                    openButton.closest(
                        ".gallery-card"
                    );

                openLightbox(
                    card
                );

                return;

            }


            /* ---------------------------------------------
               IMAGE CLICK
               --------------------------------------------- */

            const image =
                event.target.closest(
                    ".gallery-image"
                );

            if (image) {

                const card =
                    image.closest(
                        ".gallery-card"
                    );

                openLightbox(
                    card
                );

            }

        }
    );


    /* =====================================================
       LIGHTBOX CLOSE
       ===================================================== */

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                closeLightbox();

            }
        );

    }


    /* =====================================================
       NEXT IMAGE
       ===================================================== */

    if (nextButton) {

        nextButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                nextImage();

            }
        );

    }


    /* =====================================================
       PREVIOUS IMAGE
       ===================================================== */

    if (prevButton) {

        prevButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                previousImage();

            }
        );

    }


    /* =====================================================
       CLOSE LIGHTBOX ON BACKGROUND CLICK
       ===================================================== */

    if (lightbox) {

        lightbox.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === lightbox
                ) {

                    closeLightbox();

                }

            }
        );

    }


    /* =====================================================
       KEYBOARD CONTROLS
       ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {


            /* Recommended modal */

            if (
                recommendedModal &&
                recommendedModal.classList.contains(
                    "active"
                )
            ) {

                if (
                    event.key === "Escape"
                ) {

                    closeRecommendedImages();

                    return;
                }

            }


            /* Lightbox */

            if (
                !lightbox ||
                !lightbox.classList.contains(
                    "active"
                )
            ) {

                return;
            }


            if (
                event.key === "Escape"
            ) {

                closeLightbox();

            }


            if (
                event.key === "ArrowRight"
            ) {

                nextImage();

            }


            if (
                event.key === "ArrowLeft"
            ) {

                previousImage();

            }

        }
    );


    /* =====================================================
       INITIAL STATE
       ===================================================== */

    updateVisibleCards();

    /*
       Page initially opens on All.
       Therefore View More is hidden initially.
    */

    updateViewMoreButtons();


    console.log(
        "Gallery initialized successfully"
    );

});