document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       SMART RICE MILL ERP
       SHARED AUTH + CANONICAL SIDEBAR

       Permanent rule:
       - Only Purchase, Sales and Settings have arrows.
       - Parent text/icon opens the parent page.
       - Arrow button opens/closes the submenu.
       - Parent/child page starts with its submenu open.
       - Other pages start with that submenu closed.

       This script rebuilds the sidebar navigation on
       every page so page-specific sidebar HTML can no
       longer conflict with the shared submenu behavior.
    ========================================== */


    /* =========================================
       1. LOGIN PROTECTION
    ========================================== */

    const isLoggedIn =
        sessionStorage.getItem("isLoggedIn");


    if (isLoggedIn !== "true") {

        window.location.href =
            "../index.html";

        return;

    }


    /* =========================================
       2. LOGOUT
    ========================================== */

    document
        .querySelectorAll(".logout-link")
        .forEach(function (logoutLink) {

            logoutLink.href =
                "#";


            logoutLink.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    sessionStorage.removeItem(
                        "isLoggedIn"
                    );


                    sessionStorage.removeItem(
                        "currentUser"
                    );


                    window.location.href =
                        "../index.html";

                }
            );

        });


    /* =========================================
       3. SIDEBAR NAVIGATION
    ========================================== */

    const sidebarNavigation =
        document.querySelector(
            ".sidebar-navigation"
        );


    if (!sidebarNavigation) {
        return;
    }


    const currentPage =
        window.location.pathname
            .split("/")
            .pop()

        ||

        "dashboard.html";


    /* =========================================
       4. CANONICAL MENU
    ========================================== */

    const MENU_ITEMS = [

        {
            type: "link",
            href: "dashboard.html",
            icon: "⌂",
            label: "Dashboard"
        },

        {
            type: "link",
            href: "notifications.html",
            icon: "🔔",
            label: "Notifications"
        },

        {
            type: "group",
            key: "purchase",
            href: "purchase.html",
            icon: "🛒",
            label: "Purchase",

            children: [

                {
                    href: "supplier.html",
                    icon: "👥",
                    label: "Farmer & Supplier"
                },

                {
                    href: "quality.html",
                    icon: "✓",
                    label: "Quality Inspection"
                }

            ]
        },

        {
            type: "link",
            href: "production.html",
            icon: "▥",
            label: "Production"
        },

        {
            type: "link",
            href: "inventory.html",
            icon: "▣",
            label: "Inventory"
        },

        {
            type: "group",
            key: "sales",
            href: "sales.html",
            icon: "◇",
            label: "Sales",

            children: [

                {
                    href: "customer.html",
                    icon: "👤",
                    label: "Customers"
                }

            ]
        },

        {
            type: "link",
            href: "delivery.html",
            icon: "▱",
            label: "Delivery"
        },

        {
            type: "link",
            href: "reports.html",
            icon: "▥",
            label: "Reports"
        },

        {
            type: "link",
            href: "expense.html",
            icon: "৳",
            label: "Expense & Salary"
        },

        {
            type: "group",
            key: "settings",
            href: "profile.html",
            icon: "⚙",
            label: "Settings",

            children: [

                {
                    href: "users.html",
                    icon: "👥",
                    label: "User Roles"
                }

            ]
        },

        {
            type: "link",
            href: "maintenance.html",
            icon: "🔧",
            label: "Maintenance"
        }

    ];


    /* =========================================
       5. HELPERS
    ========================================== */

    function isCurrentPage(href) {

        return (
            currentPage ===
            href
        );

    }


    function isGroupCurrent(item) {

        return (

            isCurrentPage(
                item.href
            )

            ||

            item.children.some(
                function (child) {

                    return (
                        isCurrentPage(
                            child.href
                        )
                    );

                }
            )

        );

    }


    function createIcon(icon) {

        const span =
            document.createElement(
                "span"
            );


        span.className =
            "navigation-icon";


        span.textContent =
            icon;


        return span;

    }


    function createText(label) {

        const span =
            document.createElement(
                "span"
            );


        span.className =
            "navigation-text";


        span.textContent =
            label;


        return span;

    }


    /* =========================================
       6. SIMPLE MAIN LINK
    ========================================== */

    function createSimpleLink(item) {

        const link =
            document.createElement(
                "a"
            );


        link.className =
            "navigation-link erp-simple-link";


        link.href =
            item.href;


        if (
            isCurrentPage(
                item.href
            )
        ) {

            link.classList.add(
                "active"
            );

        }


        link.appendChild(
            createIcon(
                item.icon
            )
        );


        link.appendChild(
            createText(
                item.label
            )
        );


        return link;

    }


    /* =========================================
       7. SUBMENU LINK
    ========================================== */

    function createChildLink(child) {

        const link =
            document.createElement(
                "a"
            );


        link.className =

            "navigation-link " +
            "sub-navigation-link " +
            "erp-sub-navigation-link";


        link.href =
            child.href;


        if (
            isCurrentPage(
                child.href
            )
        ) {

            link.classList.add(
                "active"
            );

        }


        link.appendChild(
            createIcon(
                child.icon
            )
        );


        link.appendChild(
            createText(
                child.label
            )
        );


        return link;

    }


    /* =========================================
       8. SET GROUP OPEN / CLOSED
    ========================================== */

    function setGroupState(
        group,
        open
    ) {

        const submenu =
            group.querySelector(
                ".erp-submenu"
            );


        const toggle =
            group.querySelector(
                ".erp-submenu-toggle"
            );


        const chevron =
            group.querySelector(
                ".erp-chevron"
            );


        if (
            !submenu ||
            !toggle ||
            !chevron
        ) {

            return;

        }


        group.classList.toggle(
            "open",
            open
        );


        /*
           THIS directly controls visibility.
           No old CSS or old HTML arrow logic.
        */

        submenu.hidden =
            !open;


        toggle.setAttribute(
            "aria-expanded",
            String(open)
        );


        chevron.textContent =
            open
                ? "⌄"
                : "›";

    }


    /* =========================================
       9. CREATE GROUP
    ========================================== */

    function createGroup(item) {

        const group =
            document.createElement(
                "div"
            );


        group.className =
            "erp-nav-group";


        group.dataset.group =
            item.key;


        /* Parent row */

        const row =
            document.createElement(
                "div"
            );


        row.className =
            "erp-nav-parent-row";


        /* Parent link */

        const parentLink =
            document.createElement(
                "a"
            );


        parentLink.className =
            "navigation-link erp-nav-parent-link";


        parentLink.href =
            item.href;


        const parentIsCurrent =
            isCurrentPage(
                item.href
            );


        const childIsCurrent =
            item.children.some(
                function (child) {

                    return (
                        isCurrentPage(
                            child.href
                        )
                    );

                }
            );


        if (
            parentIsCurrent
        ) {

            parentLink.classList.add(
                "active"
            );

        }
        else if (
            childIsCurrent
        ) {

            parentLink.classList.add(
                "erp-parent-context-active"
            );

        }


        parentLink.appendChild(
            createIcon(
                item.icon
            )
        );


        parentLink.appendChild(
            createText(
                item.label
            )
        );


        /* Arrow button */

        const toggle =
            document.createElement(
                "button"
            );


        toggle.type =
            "button";


        toggle.className =
            "erp-submenu-toggle";


        toggle.setAttribute(
            "aria-label",
            `Toggle ${item.label} submenu`
        );


        /* Chevron */

        const chevron =
            document.createElement(
                "span"
            );


        chevron.className =
            "erp-chevron";


        chevron.textContent =
            "›";


        toggle.appendChild(
            chevron
        );


        row.appendChild(
            parentLink
        );


        row.appendChild(
            toggle
        );


        /* Submenu */

        const submenu =
            document.createElement(
                "div"
            );


        submenu.className =
            "erp-submenu";


        item.children.forEach(
            function (child) {

                submenu.appendChild(
                    createChildLink(
                        child
                    )
                );

            }
        );


        group.appendChild(
            row
        );


        group.appendChild(
            submenu
        );


        /* =====================================
           DEFAULT STATE

           Parent page:
           Purchase page -> open
           Sales page -> open
           Settings page -> open

           Child page:
           Supplier / Quality -> Purchase open
           Customer -> Sales open
           User Roles -> Settings open
        ====================================== */

        const startsOpen =
            isGroupCurrent(
                item
            );


        setGroupState(
            group,
            startsOpen
        );


        /* =====================================
           ARROW CLICK
        ====================================== */

        toggle.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();


                const shouldOpen =

                    !group.classList
                        .contains(
                            "open"
                        );


                setGroupState(
                    group,
                    shouldOpen
                );

            }
        );


        return group;

    }


    /* =========================================
       10. REBUILD COMPLETE SIDEBAR
    ========================================== */

    /*
       Critical fix:

       Remove the different sidebar HTML
       contained inside individual pages.

       Then rebuild ONE consistent sidebar.
    */

    sidebarNavigation.innerHTML =
        "";


    MENU_ITEMS.forEach(
        function (item) {

            if (
                item.type ===
                "group"
            ) {

                sidebarNavigation.appendChild(
                    createGroup(
                        item
                    )
                );

            }
            else {

                sidebarNavigation.appendChild(
                    createSimpleLink(
                        item
                    )
                );

            }

        }
    );


    /* =========================================
       11. SHARED STYLE OVERRIDES
    ========================================== */

    const styleId =
        "smart-rice-mill-canonical-sidebar-style";


    if (
        !document.getElementById(
            styleId
        )
    ) {

        const style =
            document.createElement(
                "style"
            );


        style.id =
            styleId;


        style.textContent = `

            /* =====================================
               NORMAL MAIN MENU
            ===================================== */

            .sidebar-navigation
            .erp-simple-link {

                grid-template-columns:
                    30px
                    minmax(0, 1fr)
                    !important;

            }


            /* =====================================
               GROUP
            ===================================== */

            .erp-nav-group {

                width: 100%;

            }


            .erp-nav-parent-row {

                position: relative;

                width: 100%;

                display: flex;

                align-items: stretch;

            }


            /* =====================================
               PARENT LINK

               The arrow is NOT inside this link.
            ===================================== */

            .erp-nav-parent-link {

                flex:
                    1 1 auto;

                width:
                    auto !important;

                min-width:
                    0;

                grid-template-columns:
                    30px
                    minmax(0, 1fr)
                    !important;

                padding-right:
                    48px !important;

            }


            /*
               Child page active:
               parent gets soft highlight.
            */

            .erp-nav-parent-link
            .navigation-text {

                min-width: 0;

            }


            .erp-nav-parent-link.erp-parent-context-active {

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.065
                    );

            }


            /* =====================================
               DEDICATED ARROW BUTTON

               Very important:
               Button is outside <a>.
               Therefore clicking arrow cannot
               navigate away from current page.
            ===================================== */

            .erp-submenu-toggle {

                position: absolute;

                top: 50%;

                right: 9px;

                z-index: 50;


                width: 38px;

                height: 38px;


                display:
                    inline-flex;

                align-items:
                    center;

                justify-content:
                    center;


                padding: 0;


                color: #ffffff;

                background:
                    transparent;


                border: 0;

                border-radius:
                    7px;


                font: inherit;

                cursor: pointer;


                transform:
                    translateY(-50%);


                pointer-events:
                    auto !important;

            }


            .erp-submenu-toggle:hover {

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.10
                    );

            }


            .erp-submenu-toggle:focus-visible {

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.10
                    );

                outline: none;

            }


            /* =====================================
               ARROW CHARACTER
            ===================================== */

            .erp-chevron {

                display: block;


                color: inherit;


                font-size:
                    18px;

                font-weight:
                    700;

                line-height:
                    1;


                transform:
                    none !important;


                pointer-events:
                    none;


                user-select:
                    none;

            }


            /* =====================================
               SUBMENU VISIBILITY

               JS controls hidden directly.
            ===================================== */

            .erp-submenu[hidden] {

                display:
                    none !important;

            }


            .erp-submenu:not([hidden]) {

                display:
                    block !important;

            }


            /* =====================================
               SUBMENU CONTAINER
            ===================================== */

            .erp-submenu {

                position: relative;


                margin-left:
                    31px;


                padding-left:
                    13px;

            }


            /* Vertical connector */

            .erp-submenu::before {

                content: "";


                position: absolute;


                top: 0;

                bottom: 8px;

                left: 0;


                width: 1px;


                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.18
                    );

            }


            /* =====================================
               CHILD LINK
            ===================================== */

            .sidebar-navigation
            .erp-sub-navigation-link {

                position: relative;


                width:
                    calc(100% - 4px)
                    !important;


                min-height:
                    44px !important;


                margin-left:
                    0 !important;


                padding-left:
                    15px !important;


                display:
                    grid !important;


                grid-template-columns:
                    25px
                    minmax(0, 1fr)
                    !important;


                align-items:
                    center;

            }


            /* Horizontal connector */

            .erp-sub-navigation-link::before {

                content: "";


                position: absolute;


                left: -13px;

                top: 50%;


                width: 12px;

                height: 1px;


                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.18
                    );

            }


            .erp-sub-navigation-link
            .navigation-icon {

                font-size:
                    14px !important;

            }


            .erp-sub-navigation-link
            .navigation-text {

                font-size:
                    13px !important;

            }


            /* =====================================
               REMOVE ALL OLD ARROWS

               Only our dedicated button remains.
            ===================================== */

            .sidebar-navigation
            .navigation-arrow {

                display:
                    none !important;

            }

        `;


        document.head.appendChild(
            style
        );

    }

});