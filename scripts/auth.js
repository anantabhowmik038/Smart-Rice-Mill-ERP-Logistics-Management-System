document.addEventListener("DOMContentLoaded", function () {

    
    // 1. LOGIN PROTECTION
    

    const isLoggedIn = sessionStorage.getItem("isLoggedIn");

    if (isLoggedIn !== "true") {

        window.location.href = "../index.html";
        return;

    }


    // 2. LOGOUT FUNCTION
    

    const logoutLinks = document.querySelectorAll(".logout-link");

    logoutLinks.forEach(function (logoutLink) {

        logoutLink.href = "#";

        logoutLink.addEventListener("click", function (event) {

            event.preventDefault();

            sessionStorage.removeItem("isLoggedIn");

            window.location.href = "../index.html";

        });

    });



    // 3. GET SIDEBAR NAVIGATION
    

    const sidebarNavigation =
        document.querySelector(".sidebar-navigation");

    if (!sidebarNavigation) {
        return;
    }



    // 4. FUNCTION FOR CREATING NAVIGATION LINK
    

    function createNavigationLink(
        href,
        icon,
        text,
        className = "navigation-link"
    ) {

        const link = document.createElement("a");

        link.className = className;
        link.href = href;

        link.innerHTML = `
            <span class="navigation-icon">${icon}</span>
            <span class="navigation-text">${text}</span>
            <span class="navigation-arrow">›</span>
        `;

        return link;

    }

    // 5. FIND EXISTING MAIN LINKS
    

    const dashboardLink =
        sidebarNavigation.querySelector(
            'a[href="dashboard.html"]'
        );

    const purchaseLink =
        sidebarNavigation.querySelector(
            'a[href="purchase.html"]'
        );

    const salesLink =
        sidebarNavigation.querySelector(
            'a[href="sales.html"]'
        );

    const reportsLink =
        sidebarNavigation.querySelector(
            'a[href="reports.html"]'
        );

    const settingsLink =
        sidebarNavigation.querySelector(
            'a[href="profile.html"]'
        );


    // 6. NOTIFICATIONS LINK
    

    if (
        dashboardLink &&
        !sidebarNavigation.querySelector(
            'a[href="notifications.html"]'
        )
    ) {

        const notificationsLink =
            createNavigationLink(
                "notifications.html",
                "🔔",
                "Notifications",
                "navigation-link sub-navigation-link"
            );

        dashboardLink.insertAdjacentElement(
            "afterend",
            notificationsLink
        );

    }


   
    // 7. PURCHASE SUB MODULES
    

    if (purchaseLink) {

        let lastPurchaseLink = purchaseLink;


        // Farmer & Supplier
        if (
            !sidebarNavigation.querySelector(
                'a[href="supplier.html"]'
            )
        ) {

            const supplierLink =
                createNavigationLink(
                    "supplier.html",
                    "👥",
                    "Farmer & Supplier",
                    "navigation-link sub-navigation-link"
                );

            lastPurchaseLink.insertAdjacentElement(
                "afterend",
                supplierLink
            );

            lastPurchaseLink = supplierLink;

        }


        // Quality Inspection
        if (
            !sidebarNavigation.querySelector(
                'a[href="quality.html"]'
            )
        ) {

            const qualityLink =
                createNavigationLink(
                    "quality.html",
                    "✓",
                    "Quality Inspection",
                    "navigation-link sub-navigation-link"
                );

            lastPurchaseLink.insertAdjacentElement(
                "afterend",
                qualityLink
            );

        }

    }


    
    // 8. SALES SUB MODULE
   

    if (
        salesLink &&
        !sidebarNavigation.querySelector(
            'a[href="customer.html"]'
        )
    ) {

        const customerLink =
            createNavigationLink(
                "customer.html",
                "👤",
                "Customers",
                "navigation-link sub-navigation-link"
            );

        salesLink.insertAdjacentElement(
            "afterend",
            customerLink
        );

    }


    
    // 9. REPORTS / FINANCE SUB MODULE
    

    if (
        reportsLink &&
        !sidebarNavigation.querySelector(
            'a[href="expense.html"]'
        )
    ) {

        const expenseLink =
            createNavigationLink(
                "expense.html",
                "৳",
                "Expense & Salary",
                "navigation-link sub-navigation-link"
            );

        reportsLink.insertAdjacentElement(
            "afterend",
            expenseLink
        );

    }


   
    // 10. SETTINGS SUB MODULES
    

    if (settingsLink) {

        let lastSettingsLink = settingsLink;


        // User Role Management
        if (
            !sidebarNavigation.querySelector(
                'a[href="users.html"]'
            )
        ) {

            const usersLink =
                createNavigationLink(
                    "users.html",
                    "👥",
                    "User Roles",
                    "navigation-link sub-navigation-link"
                );

            lastSettingsLink.insertAdjacentElement(
                "afterend",
                usersLink
            );

            lastSettingsLink = usersLink;

        }


        // Machine Maintenance
        if (
            !sidebarNavigation.querySelector(
                'a[href="maintenance.html"]'
            )
        ) {

            const maintenanceLink =
                createNavigationLink(
                    "maintenance.html",
                    "🔧",
                    "Maintenance",
                    "navigation-link sub-navigation-link"
                );

            lastSettingsLink.insertAdjacentElement(
                "afterend",
                maintenanceLink
            );

        }

    }


    // 11. ACTIVE PAGE
   

    const currentPage =
        window.location.pathname.split("/").pop();


    const navigationLinks =
        sidebarNavigation.querySelectorAll(
            ".navigation-link"
        );


    navigationLinks.forEach(function (link) {

        link.classList.remove("active");

        const linkPage =
            link.getAttribute("href");

        if (linkPage === currentPage) {

            link.classList.add("active");

        }

    });


    // 12. SUB NAVIGATION DESIGN
    
    const style =
        document.createElement("style");

    style.textContent = `

        .sub-navigation-link {
            padding-left: 42px;
            font-size: 14px;
        }

        .sub-navigation-link .navigation-icon {
            font-size: 15px;
        }

        .sub-navigation-link .navigation-text {
            font-size: 14px;
        }

    `;

    document.head.appendChild(style);

});