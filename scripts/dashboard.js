document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       SMART RICE MILL ERP
       DASHBOARD PAGE SCRIPT
    ========================================= */


    /* =========================================
       1. ELEMENTS
    ========================================= */

    const sidebar =
        document.getElementById("sidebar");

    const menuButton =
        document.getElementById("menuButton");

    const sidebarBackdrop =
        document.getElementById("sidebarBackdrop");

    const lastUpdatedText =
        document.getElementById("lastUpdatedText");

    const navigationLinks =
        document.querySelectorAll(".navigation-link");

    const inventoryBars =
        document.querySelectorAll(".bar[data-height]");


    /* =========================================
       2. LAST UPDATED DATE AND TIME
    ========================================= */

    function updateLastUpdatedTime() {

        if (!lastUpdatedText) {
            return;
        }


        const now =
            new Date();


        const dateOptions = {
            day: "2-digit",
            month: "short",
            year: "numeric"
        };


        const timeOptions = {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        };


        const formattedDate =
            now.toLocaleDateString(
                "en-GB",
                dateOptions
            );


        const formattedTime =
            now.toLocaleTimeString(
                "en-US",
                timeOptions
            );


        lastUpdatedText.textContent =
            `Last updated: ${formattedDate}, ${formattedTime}`;

    }


    updateLastUpdatedTime();


    /* =========================================
       3. INVENTORY BAR ANIMATION
    ========================================= */

    function animateInventoryBars() {

        inventoryBars.forEach(function (bar) {

            const height =
                Number(
                    bar.dataset.height
                );


            if (
                Number.isNaN(height) ||
                height < 0 ||
                height > 100
            ) {

                bar.style.height =
                    "0%";

                return;

            }


            requestAnimationFrame(function () {

                bar.style.height =
                    `${height}%`;

            });

        });

    }


    setTimeout(
        animateInventoryBars,
        150
    );


    /* =========================================
       4. OPEN MOBILE SIDEBAR
    ========================================= */

    function openSidebar() {

        if (!sidebar) {
            return;
        }


        sidebar.classList.add("open");


        if (sidebarBackdrop) {

            sidebarBackdrop.classList.add(
                "show"
            );

        }


        if (menuButton) {

            menuButton.setAttribute(
                "aria-expanded",
                "true"
            );

        }


        document.body.style.overflow =
            "hidden";

    }


    /* =========================================
       5. CLOSE MOBILE SIDEBAR
    ========================================= */

    function closeSidebar() {

        if (!sidebar) {
            return;
        }


        sidebar.classList.remove("open");


        if (sidebarBackdrop) {

            sidebarBackdrop.classList.remove(
                "show"
            );

        }


        if (menuButton) {

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

        }


        document.body.style.overflow =
            "";

    }


    /* =========================================
       6. MENU BUTTON
    ========================================= */

    if (
        menuButton &&
        sidebar
    ) {

        menuButton.addEventListener(
            "click",
            function () {

                const isOpen =
                    sidebar.classList.contains(
                        "open"
                    );


                if (isOpen) {

                    closeSidebar();

                }
                else {

                    openSidebar();

                }

            }
        );

    }


    /* =========================================
       7. BACKDROP CLICK
    ========================================= */

    if (sidebarBackdrop) {

        sidebarBackdrop.addEventListener(
            "click",
            closeSidebar
        );

    }


    /* =========================================
       8. CLOSE SIDEBAR AFTER MOBILE NAVIGATION
    ========================================= */

    navigationLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                if (
                    window.innerWidth <= 1000
                ) {

                    closeSidebar();

                }

            }
        );

    });


    /* =========================================
       9. ESCAPE KEY CLOSES SIDEBAR
    ========================================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                sidebar &&
                sidebar.classList.contains(
                    "open"
                )
            ) {

                closeSidebar();

            }

        }
    );


    /* =========================================
       10. WINDOW RESIZE
    ========================================= */

    window.addEventListener(
        "resize",
        function () {

            if (
                window.innerWidth > 1000
            ) {

                closeSidebar();

            }

        }
    );


    /* =========================================
       11. ACTIVE NAVIGATION FALLBACK

       auth.js already manages the active page.
       This code is only a safe fallback.
    ========================================= */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop();


    navigationLinks.forEach(function (link) {

        const linkPage =
            link.getAttribute("href");


        if (
            linkPage === currentPage
        ) {

            navigationLinks.forEach(
                function (navLink) {

                    navLink.classList.remove(
                        "active"
                    );

                }
            );


            link.classList.add(
                "active"
            );

        }

    });


    /* =========================================
       12. SUMMARY CARD KEYBOARD SUPPORT
    ========================================= */

    const summaryCards =
        document.querySelectorAll(
            ".summary-card"
        );


    summaryCards.forEach(function (card) {

        card.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    card.click();

                }

            }
        );

    });

});