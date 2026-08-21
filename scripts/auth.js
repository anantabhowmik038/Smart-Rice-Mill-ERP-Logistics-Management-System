document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       SMART RICE MILL ERP
       FINAL AUTHORIZATION + ROLE UI
    ========================================== */


    /* =========================================
       ROLE PERMISSIONS
    ========================================== */

    const ROLE_PERMISSIONS = {

        Owner: [
            "Dashboard",
            "Notifications",
            "Purchase",
            "Farmer & Supplier",
            "Quality Inspection",
            "Production",
            "Inventory",
            "Sales",
            "Customers",
            "Delivery",
            "Reports",
            "Expense & Salary",
            "Settings",
            "User Roles",
            "Maintenance"
        ],

        Admin: [
            "Dashboard",
            "Notifications",
            "Purchase",
            "Farmer & Supplier",
            "Quality Inspection",
            "Production",
            "Inventory",
            "Sales",
            "Customers",
            "Delivery",
            "Reports",
            "Expense & Salary",
            "Settings",
            "Maintenance"
        ],

        Manager: [
            "Dashboard",
            "Notifications",
            "Purchase",
            "Farmer & Supplier",
            "Quality Inspection",
            "Production",
            "Inventory",
            "Sales",
            "Customers",
            "Delivery",
            "Reports",
            "Maintenance"
        ],

        Accountant: [
            "Dashboard",
            "Notifications",
            "Sales",
            "Customers",
            "Reports",
            "Expense & Salary"
        ],

        Operator: [
            "Dashboard",
            "Notifications",
            "Purchase",
            "Farmer & Supplier",
            "Quality Inspection",
            "Production",
            "Inventory",
            "Maintenance"
        ],

        Driver: [
            "Dashboard",
            "Notifications",
            "Delivery"
        ]

    };


    /* =========================================
       PAGE PERMISSIONS
    ========================================== */

    const PAGE_PERMISSIONS = {

        "dashboard.html":
            "Dashboard",

        "notifications.html":
            "Notifications",

        "purchase.html":
            "Purchase",

        "supplier.html":
            "Farmer & Supplier",

        "quality.html":
            "Quality Inspection",

        "production.html":
            "Production",

        "inventory.html":
            "Inventory",

        "sales.html":
            "Sales",

        "customer.html":
            "Customers",

        "delivery.html":
            "Delivery",

        "reports.html":
            "Reports",

        "expense.html":
            "Expense & Salary",

        "profile.html":
            "Settings",

        "users.html":
            "User Roles",

        "maintenance.html":
            "Maintenance"

    };


    /* =========================================
       CANONICAL SIDEBAR MENU
    ========================================== */

    const MENU_ITEMS = [

        {
            type: "link",
            permission: "Dashboard",
            href: "dashboard.html",
            icon: "⌂",
            label: "Dashboard"
        },

        {
            type: "link",
            permission: "Notifications",
            href: "notifications.html",
            icon: "🔔",
            label: "Notifications"
        },

        {
            type: "group",
            key: "purchase",
            permission: "Purchase",
            href: "purchase.html",
            icon: "🛒",
            label: "Purchase",

            children: [

                {
                    permission: "Farmer & Supplier",
                    href: "supplier.html",
                    icon: "👥",
                    label: "Farmer & Supplier"
                },

                {
                    permission: "Quality Inspection",
                    href: "quality.html",
                    icon: "✓",
                    label: "Quality Inspection"
                }

            ]
        },

        {
            type: "link",
            permission: "Production",
            href: "production.html",
            icon: "▥",
            label: "Production"
        },

        {
            type: "link",
            permission: "Inventory",
            href: "inventory.html",
            icon: "▣",
            label: "Inventory"
        },

        {
            type: "group",
            key: "sales",
            permission: "Sales",
            href: "sales.html",
            icon: "◇",
            label: "Sales",

            children: [

                {
                    permission: "Customers",
                    href: "customer.html",
                    icon: "👤",
                    label: "Customers"
                }

            ]
        },

        {
            type: "link",
            permission: "Delivery",
            href: "delivery.html",
            icon: "▱",
            label: "Delivery"
        },

        {
            type: "link",
            permission: "Reports",
            href: "reports.html",
            icon: "▥",
            label: "Reports"
        },

        {
            type: "link",
            permission: "Expense & Salary",
            href: "expense.html",
            icon: "৳",
            label: "Expense & Salary"
        },

        {
            type: "group",
            key: "settings",
            permission: "Settings",
            href: "profile.html",
            icon: "⚙",
            label: "Settings",

            children: [

                {
                    permission: "User Roles",
                    href: "users.html",
                    icon: "👥",
                    label: "User Roles"
                }

            ]
        },

        {
            type: "link",
            permission: "Maintenance",
            href: "maintenance.html",
            icon: "🔧",
            label: "Maintenance"
        }

    ];


    /* =========================================
       STORAGE HELPERS
    ========================================== */

    function safeParse(
        storage,
        key,
        fallback = null
    ) {

        try {

            const value =
                storage.getItem(
                    key
                );


            if (
                value === null
            ) {

                return fallback;

            }


            return (
                JSON.parse(
                    value
                )
                ??
                fallback
            );

        }
        catch {

            return fallback;

        }

    }


    function firstNonEmptyArray(
        keys
    ) {

        for (
            const key of keys
        ) {

            const value =
                safeParse(
                    localStorage,
                    key,
                    null
                );


            if (
                Array.isArray(
                    value
                )
                &&
                value.length > 0
            ) {

                return value;

            }

        }


        return [];

    }


    function getUserAccounts() {

        return firstNonEmptyArray(
            [
                "userAccounts",
                "systemUsers",
                "users"
            ]
        );

    }


    function getDeliveryRecords() {

        return firstNonEmptyArray(
            [
                "deliveryRecords",
                "deliveries"
            ]
        );

    }


    /* =========================================
       NORMALIZATION HELPERS
    ========================================== */

    function normalizeRole(
        role
    ) {

        const value =
            String(
                role || ""
            )
            .trim();


        if (
            value ===
            "Rice Mill Owner"
        ) {

            return "Owner";

        }


        if (
            ROLE_PERMISSIONS[
                value
            ]
        ) {

            return value;

        }


        return "Operator";

    }


    function normalizeText(
        value
    ) {

        return String(
            value || ""
        )
        .trim()
        .toLowerCase();

    }


    function escapeHTML(
        value
    ) {

        const div =
            document.createElement(
                "div"
            );


        div.textContent =
            String(
                value ?? ""
            );


        return div.innerHTML;

    }


    function humanizeText(
        value
    ) {

        let text =
            String(
                value || ""
            )
            .trim();


        if (
            !text
        ) {

            return "—";

        }


        text =
            text.replace(
                /([a-z])([A-Z])/g,
                "$1 $2"
            );


        text =
            text.replace(
                /[_-]+/g,
                " "
            );


        return text
            .split(/\s+/)
            .map(
                function (
                    word
                ) {

                    if (
                        !word
                    ) {

                        return "";

                    }


                    return (
                        word.charAt(0)
                            .toUpperCase()

                        +

                        word.slice(1)
                    );

                }
            )
            .join(" ");

    }


    /* =========================================
       LOGOUT
    ========================================== */

    function logoutWithMessage(
        message = ""
    ) {

        sessionStorage.removeItem(
            "isLoggedIn"
        );


        sessionStorage.removeItem(
            "currentUser"
        );


        if (
            message
        ) {

            sessionStorage.setItem(
                "loginNotice",
                message
            );

        }


        window.location.href =
            "../index.html";

    }


    /* =========================================
       LOGIN PROTECTION
    ========================================== */

    if (
        sessionStorage.getItem(
            "isLoggedIn"
        )
        !==
        "true"
    ) {

        window.location.href =
            "../index.html";


        return;

    }


    let currentUser =
        safeParse(
            sessionStorage,
            "currentUser",
            null
        );


    if (
        !currentUser
    ) {

        logoutWithMessage();

        return;

    }


    currentUser.role =
        normalizeRole(
            currentUser.role
        );


    if (
        !Array.isArray(
            currentUser.permissions
        )
    ) {

        currentUser.permissions =
            ROLE_PERMISSIONS[
                currentUser.role
            ]
            ||
            [];

    }


    /* =========================================
       LIVE USER VALIDATION
    ========================================== */

    const accounts =
        getUserAccounts();


    if (
        accounts.length > 0
    ) {

        const liveAccount =
            accounts.find(
                function (
                    account
                ) {

                    const sameId =

                        currentUser.userId

                        &&

                        account.userId

                        &&

                        String(
                            currentUser.userId
                        )

                        ===

                        String(
                            account.userId
                        );


                    const sameEmail =

                        normalizeText(
                            currentUser.email
                        )

                        ===

                        normalizeText(
                            account.email
                        );


                    return Boolean(
                        sameId
                        ||
                        sameEmail
                    );

                }
            );


        if (
            liveAccount
        ) {

            if (
                normalizeText(
                    liveAccount.status
                    ||
                    "Active"
                )
                !==
                "active"
            ) {

                logoutWithMessage(
                    "Your account is inactive. Please contact the administrator."
                );


                return;

            }


            const liveRole =
                normalizeRole(
                    liveAccount.role
                );


            currentUser = {

                ...currentUser,


                userId:
                    liveAccount.userId
                    ||
                    currentUser.userId,


                name:
                    liveAccount.fullName
                    ||
                    liveAccount.name
                    ||
                    currentUser.name
                    ||
                    "System User",


                fullName:
                    liveAccount.fullName
                    ||
                    liveAccount.name
                    ||
                    currentUser.fullName
                    ||
                    currentUser.name
                    ||
                    "System User",


                email:
                    String(
                        liveAccount.email
                        ||
                        currentUser.email
                        ||
                        ""
                    )
                    .toLowerCase(),


                phone:
                    liveAccount.phone
                    ||
                    currentUser.phone
                    ||
                    "",


                role:
                    liveRole,


                displayRole:
                    liveRole ===
                    "Owner"

                        ?

                        "Rice Mill Owner"

                        :

                        liveRole,


                status:
                    "Active",


                permissions:
                    Array.isArray(
                        liveAccount.permissions
                    )

                        ?

                        liveAccount.permissions

                        :

                        (
                            ROLE_PERMISSIONS[
                                liveRole
                            ]
                            ||
                            []
                        )

            };


            sessionStorage.setItem(
                "currentUser",
                JSON.stringify(
                    currentUser
                )
            );

        }
        else if (
            currentUser.role !==
            "Owner"
        ) {

            logoutWithMessage(
                "This user account no longer exists. Please contact the administrator."
            );


            return;

        }

    }


    /* =========================================
       CURRENT PAGE
    ========================================== */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()

        ||

        "dashboard.html";


    function hasPermission(
        permission
    ) {

        if (
            !permission
        ) {

            return true;

        }


        return (

            Array.isArray(
                currentUser.permissions
            )

            &&

            currentUser.permissions
                .includes(
                    permission
                )

        );

    }


    /* =========================================
       DIRECT URL PROTECTION
    ========================================== */

    const requiredPermission =
        PAGE_PERMISSIONS[
            currentPage
        ];


    if (
        requiredPermission

        &&

        !hasPermission(
            requiredPermission
        )
    ) {

        alert(
            `Access denied. Your ${currentUser.role} role does not have permission to open ${requiredPermission}.`
        );


        window.location.href =
            "dashboard.html";


        return;

    }


    /* =========================================
       LOGOUT LINKS
    ========================================== */

    function bindLogoutLinks() {

        document
            .querySelectorAll(
                ".logout-link"
            )
            .forEach(
                function (
                    link
                ) {

                    if (
                        link.dataset
                            .authLogoutBound
                        ===
                        "true"
                    ) {

                        return;

                    }


                    link.dataset
                        .authLogoutBound =
                        "true";


                    link.href =
                        "#";


                    link.addEventListener(
                        "click",
                        function (
                            event
                        ) {

                            event.preventDefault();

                            logoutWithMessage();

                        }
                    );

                }
            );

    }


    /* =========================================
       USER IDENTITY
    ========================================== */

    function getCurrentUserName() {

        return (

            currentUser.fullName

            ||

            currentUser.name

            ||

            "System User"

        );

    }


    function getCurrentUserRoleLabel() {

        return (

            currentUser.displayRole

            ||

            (
                currentUser.role ===
                "Owner"

                    ?

                    "Rice Mill Owner"

                    :

                    currentUser.role
            )

            ||

            "System User"

        );

    }


    function applyCurrentUserIdentity() {

        const name =
            getCurrentUserName();


        const role =
            getCurrentUserRoleLabel();


        document
            .querySelectorAll(
                "#topbarUserName,.topbar-user-name,[data-current-user-name],.user-information strong"
            )
            .forEach(
                function (
                    element
                ) {

                    element.textContent =
                        name;

                }
            );


        document
            .querySelectorAll(
                "#topbarUserRole,.topbar-user-role,[data-current-user-role],.user-information span"
            )
            .forEach(
                function (
                    element
                ) {

                    element.textContent =
                        role;

                }
            );

    }


    /* =========================================
       PROFILE ACCESS
    ========================================== */

    function applyProfileAccess() {

        document
            .querySelectorAll(
                ".user-profile"
            )
            .forEach(
                function (
                    link
                ) {

                    const arrow =
                        link.querySelector(
                            ".profile-arrow"
                        );


                    if (
                        hasPermission(
                            "Settings"
                        )
                    ) {

                        link.setAttribute(
                            "href",
                            "profile.html"
                        );


                        link.removeAttribute(
                            "aria-disabled"
                        );


                        link.setAttribute(
                            "aria-label",
                            "Open profile and settings"
                        );


                        link.style.cursor =
                            "";


                        if (
                            arrow
                        ) {

                            arrow.hidden =
                                false;

                        }

                    }
                    else {

                        link.removeAttribute(
                            "href"
                        );


                        link.setAttribute(
                            "aria-disabled",
                            "true"
                        );


                        link.setAttribute(
                            "aria-label",
                            `${getCurrentUserName()} — ${getCurrentUserRoleLabel()}`
                        );


                        link.style.cursor =
                            "default";


                        if (
                            arrow
                        ) {

                            arrow.hidden =
                                true;

                        }

                    }

                }
            );

    }


    /* =========================================
       DASHBOARD SHORTCUT ACCESS
    ========================================== */

    const DASHBOARD_SHORTCUT_PERMISSIONS = {

        "purchase.html":
            "Purchase",

        "sales.html":
            "Sales",

        "inventory.html":
            "Inventory",

        "delivery.html":
            "Delivery"

    };


    function applyDashboardShortcutAccess() {

        if (
            currentPage !==
            "dashboard.html"
        ) {

            return;

        }


        document
            .querySelectorAll(
                ".summary-card"
            )
            .forEach(
                function (
                    card
                ) {

                    if (
                        !card.dataset
                            .originalHref
                    ) {

                        const href =
                            card.getAttribute(
                                "href"
                            );


                        if (
                            href
                        ) {

                            card.dataset
                                .originalHref =
                                href;

                        }

                    }


                    const originalHref =
                        card.dataset
                            .originalHref;


                    if (
                        !originalHref
                    ) {

                        return;

                    }


                    const permission =
                        DASHBOARD_SHORTCUT_PERMISSIONS[
                            originalHref
                        ];


                    if (
                        !permission
                    ) {

                        return;

                    }


                    const allowed =
                        hasPermission(
                            permission
                        );


                    const arrow =
                        card.querySelector(
                            ".card-arrow"
                        );


                    card.style
                        .removeProperty(
                            "display"
                        );


                    if (
                        !card.dataset
                            .roleGuardBound
                    ) {

                        card.dataset
                            .roleGuardBound =
                            "true";


                        card.addEventListener(
                            "click",
                            function (
                                event
                            ) {

                                if (
                                    card.classList
                                        .contains(
                                            "role-restricted-card"
                                        )
                                ) {

                                    event.preventDefault();

                                    event.stopPropagation();

                                }

                            }
                        );

                    }


                    if (
                        allowed
                    ) {

                        card.setAttribute(
                            "href",
                            originalHref
                        );


                        card.classList.remove(
                            "role-restricted-card"
                        );


                        card.removeAttribute(
                            "aria-disabled"
                        );


                        card.removeAttribute(
                            "tabindex"
                        );


                        card.removeAttribute(
                            "role"
                        );


                        card.removeAttribute(
                            "title"
                        );


                        card.style.cursor =
                            "";


                        if (
                            arrow
                        ) {

                            arrow.hidden =
                                false;

                        }

                    }
                    else {

                        card.removeAttribute(
                            "href"
                        );


                        card.classList.add(
                            "role-restricted-card"
                        );


                        card.setAttribute(
                            "aria-disabled",
                            "true"
                        );


                        card.setAttribute(
                            "tabindex",
                            "-1"
                        );


                        card.setAttribute(
                            "role",
                            "group"
                        );


                        card.title =
                            "View-only dashboard metric for your current role.";


                        card.style.cursor =
                            "default";


                        if (
                            arrow
                        ) {

                            arrow.hidden =
                                true;

                        }

                    }

                }
            );


        /*
           Always restore original Dashboard layout.
        */

        const summaryGrid =
            document.querySelector(
                ".summary-grid"
            );


        if (
            summaryGrid
        ) {

            summaryGrid.style
                .removeProperty(
                    "grid-template-columns"
                );


            summaryGrid.style
                .removeProperty(
                    "display"
                );

        }


        const chartGrid =
            document.querySelector(
                ".chart-grid"
            );


        if (
            chartGrid
        ) {

            chartGrid.style
                .removeProperty(
                    "display"
                );


            chartGrid.style
                .removeProperty(
                    "grid-template-columns"
                );

        }


        /*
           Hide Reports shortcut from roles
           without Reports permission.
        */

        document
            .querySelectorAll(
                ".view-reports-link"
            )
            .forEach(
                function (
                    link
                ) {

                    if (
                        !link.dataset
                            .originalHref
                    ) {

                        const href =
                            link.getAttribute(
                                "href"
                            );


                        if (
                            href
                        ) {

                            link.dataset
                                .originalHref =
                                href;

                        }

                    }


                    if (
                        hasPermission(
                            "Reports"
                        )
                    ) {

                        link.style
                            .removeProperty(
                                "display"
                            );


                        if (
                            link.dataset
                                .originalHref
                        ) {

                            link.setAttribute(
                                "href",
                                link.dataset
                                    .originalHref
                            );

                        }

                    }
                    else {

                        link.style.setProperty(
                            "display",
                            "none",
                            "important"
                        );


                        link.removeAttribute(
                            "href"
                        );

                    }

                }
            );

    }


    /* =========================================
       DELIVERY DISPLAY HELPERS
    ========================================== */

    function getDeliveryStatus(
        record
    ) {

        return (

            record.deliveryStatus

            ||

            record.status

            ||

            "Pending"

        );

    }


    function getDeliveryId(
        record
    ) {

        return (

            record.deliveryId

            ||

            record.id

            ||

            "Delivery"

        );

    }


    function getDeliveryCustomer(
        record
    ) {

        return (

            record.customerName

            ||

            record.customer

            ||

            "Customer"

        );

    }


    function getDeliveryProduct(
        record
    ) {

        const value =

            record.product

            ||

            record.productName

            ||

            record.item

            ||

            "Delivery";


        return humanizeText(
            value
        );

    }


    function getDeliveryQuantity(
        record
    ) {

        const quantity =

            record.quantityKg

            ??

            record.quantity

            ??

            record.qty

            ??

            record.weight;


        if (
            quantity ===
            undefined

            ||

            quantity ===
            null

            ||

            quantity ===
            ""
        ) {

            return "—";

        }


        const text =
            String(
                quantity
            );


        return /kg/i
            .test(
                text
            )

            ?

            text

            :

            `${text} kg`;

    }


    function getDeliveryTimestamp(
        record
    ) {

        const values = [

            record.gpsUpdatedAt,

            record.lastGpsUpdate,

            record.updatedAt,

            record.deliveryDate,

            record.date,

            record.createdAt

        ];


        for (
            const value
            of values
        ) {

            if (
                !value
            ) {

                continue;

            }


            const parsed =
                new Date(
                    value
                );


            if (
                !Number.isNaN(
                    parsed.getTime()
                )
            ) {

                return parsed.getTime();

            }

        }


        return 0;

    }


    function formatDeliveryDate(
        record
    ) {

        const timestamp =
            getDeliveryTimestamp(
                record
            );


        if (
            !timestamp
        ) {

            return "—";

        }


        const date =
            new Date(
                timestamp
            );


        const today =
            new Date();


        if (
            date.getFullYear() ===
            today.getFullYear()

            &&

            date.getMonth() ===
            today.getMonth()

            &&

            date.getDate() ===
            today.getDate()
        ) {

            return "Today";

        }


        return date.toLocaleDateString(
            "en-GB",
            {
                day:
                    "2-digit",

                month:
                    "short",

                year:
                    "numeric"
            }
        );

    }


    /* =========================================
       DRIVER DASHBOARD ACTIVITY
    ========================================== */

    function applyDriverDashboardActivity() {

        if (
            currentUser.role !==
            "Driver"

            ||

            currentPage !==
            "dashboard.html"
        ) {

            return;

        }


        const tbody =
            document.querySelector(
                ".activity-table tbody"
            );


        if (
            !tbody
        ) {

            return;

        }


        const deliveries =
            [
                ...getDeliveryRecords()
            ]
            .sort(
                function (
                    first,
                    second
                ) {

                    return (

                        getDeliveryTimestamp(
                            second
                        )

                        -

                        getDeliveryTimestamp(
                            first
                        )

                    );

                }
            )
            .slice(
                0,
                6
            );


        tbody.innerHTML =
            "";


        if (
            deliveries.length ===
            0
        ) {

            tbody.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        style="
                            text-align:center;
                            padding:28px 16px;
                            color:#758078;
                        "
                    >

                        No delivery activity recorded yet.

                    </td>

                </tr>

            `;


            return;

        }


        deliveries.forEach(
            function (
                record
            ) {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>

                        ${escapeHTML(
                            `Delivery ${getDeliveryId(
                                record
                            )} for ${getDeliveryCustomer(
                                record
                            )}`
                        )}

                    </td>


                    <td>

                        Delivery

                    </td>


                    <td>

                        ${escapeHTML(
                            getDeliveryProduct(
                                record
                            )
                        )}

                        /

                        ${escapeHTML(
                            getDeliveryQuantity(
                                record
                            )
                        )}

                    </td>


                    <td>

                        <span class="status-badge">

                            ${escapeHTML(
                                humanizeText(
                                    getDeliveryStatus(
                                        record
                                    )
                                )
                            )}

                        </span>

                    </td>


                    <td>

                        ${escapeHTML(
                            formatDeliveryDate(
                                record
                            )
                        )}

                    </td>

                `;


                tbody.appendChild(
                    row
                );

            }
        );

    }


    /* =========================================
       ACTIVE DELIVERY COUNT
    ========================================== */

    function isActiveDelivery(
        record
    ) {

        const status =
            normalizeText(
                getDeliveryStatus(
                    record
                )
            );


        return (

            status ===
            "pending"

            ||

            status.includes(
                "dispatch"
            )

            ||

            status.includes(
                "on the way"
            )

            ||

            status.includes(
                "in transit"
            )

            ||

            status.includes(
                "running"
            )

            ||

            status.includes(
                "assigned"
            )

        );

    }


    function getDriverNotificationCount() {

        return getDeliveryRecords()
            .filter(
                isActiveDelivery
            )
            .length;

    }


    function getGlobalNotificationCount() {

        const count =
            Number(
                localStorage.getItem(
                    "activeNotificationCount"
                )
            );


        if (
            !Number.isFinite(
                count
            )

            ||

            count < 0
        ) {

            return 0;

        }


        return Math.floor(
            count
        );

    }


    function getVisibleNotificationCount() {

        return currentUser.role ===
            "Driver"

            ?

            getDriverNotificationCount()

            :

            getGlobalNotificationCount();

    }


    /* =========================================
       NOTIFICATION BADGE
    ========================================== */

    function syncNotificationBadges() {

        const count =
            getVisibleNotificationCount();


        document
            .querySelectorAll(
                ".notification-count"
            )
            .forEach(
                function (
                    badge
                ) {

                    badge.textContent =

                        count > 99

                            ?

                            "99+"

                            :

                            String(
                                count
                            );


                    badge.setAttribute(
                        "aria-label",
                        `${count} active notifications`
                    );


                    if (
                        count > 0
                    ) {

                        badge.style
                            .removeProperty(
                                "display"
                            );

                    }
                    else {

                        badge.style
                            .setProperty(
                                "display",
                                "none",
                                "important"
                            );

                    }

                }
            );

    }


    /* =========================================
       DOM HELPERS
    ========================================== */

    function findExactTextElement(
        text
    ) {

        const wanted =
            normalizeText(
                text
            );


        const elements =
            Array.from(
                document.querySelectorAll(
                    "h1,h2,h3,h4,p,span,strong,small,label"
                )
            );


        return (

            elements.find(
                function (
                    element
                ) {

                    return normalizeText(
                        element.textContent
                    )
                    ===
                    wanted;

                }
            )

            ||

            null

        );

    }


    function closestCard(
        element
    ) {

        if (
            !element
        ) {

            return null;

        }


        return (

            element.closest(
                "article"
            )

            ||

            element.closest(
                ".content-card"
            )

            ||

            element.closest(
                ".alert-card"
            )

            ||

            element.closest(
                ".notification-card"
            )

            ||

            element.parentElement

        );

    }


    function hideElement(
        element
    ) {

        if (
            !element
        ) {

            return;

        }


        element.style
            .setProperty(
                "display",
                "none",
                "important"
            );

    }


    function showElement(
        element
    ) {

        if (
            !element
        ) {

            return;

        }


        element.style
            .removeProperty(
                "display"
            );

    }


    /* =========================================
       DRIVER ALL ALERTS FILTER
    ========================================== */

    function findAllAlertsTable() {

        const tables =
            Array.from(
                document.querySelectorAll(
                    "table"
                )
            );


        return (

            tables.find(
                function (
                    table
                ) {

                    const headers =
                        Array.from(
                            table.querySelectorAll(
                                "thead th"
                            )
                        )
                        .map(
                            function (
                                header
                            ) {

                                return normalizeText(
                                    header.textContent
                                );

                            }
                        );


                    return (

                        headers.includes(
                            "alert id"
                        )

                        &&

                        headers.includes(
                            "alert type"
                        )

                        &&

                        headers.includes(
                            "source"
                        )

                    );

                }
            )

            ||

            null

        );

    }


    function filterDriverAllAlertsTable() {

        const table =
            findAllAlertsTable();


        if (
            !table
        ) {

            return;

        }


        table
            .querySelectorAll(
                "tbody tr"
            )
            .forEach(
                function (
                    row
                ) {

                    const cells =
                        row.querySelectorAll(
                            "td"
                        );


                    const source =

                        cells[3]

                            ?

                            normalizeText(
                                cells[3]
                                    .textContent
                            )

                            :

                            "";


                    const rowText =
                        normalizeText(
                            row.textContent
                        );


                    const isDelivery =

                        source ===
                        "delivery"

                        ||

                        rowText.includes(
                            "delivery"
                        )

                        ||

                        rowText.includes(
                            "dispatch"
                        );


                    if (
                        isDelivery
                    ) {

                        row.style
                            .removeProperty(
                                "display"
                            );

                    }
                    else {

                        row.style
                            .setProperty(
                                "display",
                                "none",
                                "important"
                            );

                    }

                }
            );


        const heading =
            findExactTextElement(
                "All Alerts"
            );


        if (
            heading
        ) {

            const container =

                heading.closest(
                    "article"
                )

                ||

                heading.closest(
                    ".content-card"
                )

                ||

                (
                    heading.parentElement
                    &&
                    heading.parentElement
                        .parentElement
                );


            const subtitle =
                container

                    ?

                    container.querySelector(
                        "p"
                    )

                    :

                    null;


            if (
                subtitle
            ) {

                subtitle.textContent =
                    "Delivery alert history available to the Driver role.";

            }

        }

    }


    /* =========================================
       DRIVER NOTIFICATION VIEW
    ========================================== */

    function applyDriverNotificationView() {

        if (
            currentUser.role !==
            "Driver"

            ||

            currentPage !==
            "notifications.html"
        ) {

            return;

        }


        [
            "Low Stock Alerts",
            "Due Payments",
            "Attention Required"
        ]
        .forEach(
            function (
                label
            ) {

                hideElement(
                    closestCard(
                        findExactTextElement(
                            label
                        )
                    )
                );

            }
        );


        const pendingCard =
            closestCard(
                findExactTextElement(
                    "Pending Deliveries"
                )
            );


        showElement(
            pendingCard
        );


        if (
            pendingCard
        ) {

            const value =
                pendingCard.querySelector(
                    "h2,strong"
                );


            if (
                value
            ) {

                value.textContent =
                    String(
                        getDriverNotificationCount()
                    );

            }

        }


        /*
           Priority Alert Feed is management-focused.
        */

        hideElement(
            closestCard(
                findExactTextElement(
                    "Priority Alert Feed"
                )
            )
        );


        filterDriverAllAlertsTable();

    }


    /* =========================================
       LEAFLET MAP REFLOW
    ========================================== */

    function refreshLeafletLayout() {

        document
            .querySelectorAll(
                ".leaflet-container"
            )
            .forEach(
                function (
                    mapContainer
                ) {

                    mapContainer.style
                        .setProperty(
                            "width",
                            "100%",
                            "important"
                        );


                    mapContainer.style
                        .setProperty(
                            "max-width",
                            "100%",
                            "important"
                        );

                }
            );


        /*
           Leaflet listens for the window resize
           event and recalculates map dimensions.
        */

        window.dispatchEvent(
            new Event(
                "resize"
            )
        );


        window.requestAnimationFrame(
            function () {

                window.requestAnimationFrame(
                    function () {

                        window.dispatchEvent(
                            new Event(
                                "resize"
                            )
                        );

                    }
                );

            }
        );


        window.setTimeout(
            function () {

                window.dispatchEvent(
                    new Event(
                        "resize"
                    )
                );

            },
            120
        );


        window.setTimeout(
            function () {

                window.dispatchEvent(
                    new Event(
                        "resize"
                    )
                );

            },
            300
        );

    }


    /* =========================================
       DRIVER DELIVERY VIEW
    ========================================== */

    function applyDriverDeliveryView() {

        if (
            currentUser.role !==
            "Driver"

            ||

            currentPage !==
            "delivery.html"
        ) {

            return;

        }


        /* =====================================
           HIDE CREATE DELIVERY
        ====================================== */

        const createHeading =
            findExactTextElement(
                "Create Delivery"
            );


        const createCard =
            closestCard(
                createHeading
            );


        hideElement(
            createCard
        );


        /* =====================================
           DELIVERY ROUTE CARD
        ====================================== */

        const routeHeading =
            findExactTextElement(
                "Delivery Route"
            );


        const routeCard =
            closestCard(
                routeHeading
            );


        if (
            routeCard
        ) {

            routeCard.style
                .setProperty(
                    "width",
                    "100%",
                    "important"
                );


            routeCard.style
                .setProperty(
                    "max-width",
                    "100%",
                    "important"
                );


            routeCard.style
                .setProperty(
                    "grid-column",
                    "1 / -1",
                    "important"
                );


            /*
               Change the old invoice-related text.
            */

            const paragraphs =
                Array.from(
                    routeCard.querySelectorAll(
                        "p"
                    )
                );


            const routeDescription =
                paragraphs.find(
                    function (
                        paragraph
                    ) {

                        const text =
                            normalizeText(
                                paragraph.textContent
                            );


                        return (

                            text.includes(
                                "select an invoice"
                            )

                            ||

                            text.includes(
                                "customer delivery route"
                            )

                        );

                    }
                );


            if (
                routeDescription
            ) {

                routeDescription.textContent =
                    "Select Track from a delivery record to preview its route and GPS information.";

            }

        }


        /* =====================================
           EXPAND THE MAIN DELIVERY GRID
        ====================================== */

        if (
            routeCard
            &&
            routeCard.parentElement
        ) {

            const parent =
                routeCard.parentElement;


            parent.style
                .setProperty(
                    "grid-template-columns",
                    "minmax(0, 1fr)",
                    "important"
                );


            parent.style
                .setProperty(
                    "width",
                    "100%",
                    "important"
                );

        }


        /* =====================================
           CONTROL CENTER DESCRIPTION
        ====================================== */

        const controlHeading =
            findExactTextElement(
                "Delivery Control Center"
            );


        if (
            controlHeading
        ) {

            const parent =
                controlHeading.parentElement;


            const description =
                parent

                    ?

                    parent.querySelector(
                        "p"
                    )

                    :

                    null;


            if (
                description
            ) {

                description.textContent =
                    "Track assigned deliveries, monitor routes, update GPS positions and review delivery progress.";

            }

        }


        /* =====================================
           MAP WIDTH / TILE FIX
        ====================================== */

        refreshLeafletLayout();

    }


    /* =========================================
       ROLE-SPECIFIC UI
    ========================================== */

    function applyRoleSpecificPageUi() {

        applyDashboardShortcutAccess();

        applyDriverDashboardActivity();

        applyDriverNotificationView();

        applyDriverDeliveryView();

    }


    /* =========================================
       SIDEBAR HELPERS
    ========================================== */

    const sidebarNavigation =
        document.querySelector(
            ".sidebar-navigation"
        );


    function isCurrentPage(
        href
    ) {

        return currentPage ===
            href;

    }


    function createIcon(
        icon
    ) {

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


    function createText(
        label
    ) {

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


    function getAllowedChildren(
        item
    ) {

        return (
            item.children
            ||
            []
        )
        .filter(
            function (
                child
            ) {

                return hasPermission(
                    child.permission
                );

            }
        );

    }


    /* =========================================
       SIMPLE SIDEBAR LINK
    ========================================== */

    function createSimpleLink(
        item
    ) {

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
       CHILD SIDEBAR LINK
    ========================================== */

    function createChildLink(
        child
    ) {

        const link =
            document.createElement(
                "a"
            );


        link.className =
            "navigation-link sub-navigation-link erp-sub-navigation-link";


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
       GROUP STATE
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
            !submenu

            ||

            !toggle

            ||

            !chevron
        ) {

            return;

        }


        group.classList.toggle(
            "open",
            open
        );


        submenu.hidden =
            !open;


        toggle.setAttribute(
            "aria-expanded",
            String(
                open
            )
        );


        chevron.textContent =

            open

                ?

                "⌄"

                :

                "›";

    }


    /* =========================================
       SIDEBAR GROUP
    ========================================== */

    function createGroup(
        item
    ) {

        const parentAllowed =
            hasPermission(
                item.permission
            );


        const allowedChildren =
            getAllowedChildren(
                item
            );


        if (
            !parentAllowed

            &&

            allowedChildren.length ===
            0
        ) {

            return null;

        }


        const group =
            document.createElement(
                "div"
            );


        group.className =
            "erp-nav-group";


        group.dataset.group =
            item.key;


        const row =
            document.createElement(
                "div"
            );


        row.className =
            "erp-nav-parent-row";


        const parentLink =
            document.createElement(
                "a"
            );


        parentLink.className =
            "navigation-link erp-nav-parent-link";


        parentLink.href =

            parentAllowed

                ?

                item.href

                :

                allowedChildren[0]
                    .href;


        const parentIsCurrent =

            parentAllowed

            &&

            isCurrentPage(
                item.href
            );


        const childIsCurrent =
            allowedChildren.some(
                function (
                    child
                ) {

                    return isCurrentPage(
                        child.href
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


        const submenu =
            document.createElement(
                "div"
            );


        submenu.className =
            "erp-submenu";


        allowedChildren.forEach(
            function (
                child
            ) {

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


        setGroupState(

            group,

            parentIsCurrent

            ||

            childIsCurrent

        );


        toggle.addEventListener(
            "click",
            function (
                event
            ) {

                event.preventDefault();

                event.stopPropagation();


                setGroupState(

                    group,

                    !group.classList
                        .contains(
                            "open"
                        )

                );

            }
        );


        return group;

    }


    /* =========================================
       REBUILD SIDEBAR
    ========================================== */

    function rebuildSidebar() {

        if (
            !sidebarNavigation
        ) {

            return;

        }


        sidebarNavigation.innerHTML =
            "";


        MENU_ITEMS.forEach(
            function (
                item
            ) {

                if (
                    item.type ===
                    "group"
                ) {

                    const group =
                        createGroup(
                            item
                        );


                    if (
                        group
                    ) {

                        sidebarNavigation
                            .appendChild(
                                group
                            );

                    }


                    return;

                }


                if (
                    hasPermission(
                        item.permission
                    )
                ) {

                    sidebarNavigation
                        .appendChild(
                            createSimpleLink(
                                item
                            )
                        );

                }

            }
        );

    }


    rebuildSidebar();


    /* =========================================
       SHARED SIDEBAR STYLE
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

            .sidebar-navigation
            .erp-simple-link {

                grid-template-columns:
                    30px
                    minmax(0, 1fr)
                    !important;

            }


            .erp-nav-group {

                width:
                    100%;

            }


            .erp-nav-parent-row {

                position:
                    relative;

                width:
                    100%;

                display:
                    flex;

                align-items:
                    stretch;

            }


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


            .erp-nav-parent-link
            .navigation-text {

                min-width:
                    0;

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


            .erp-submenu-toggle {

                position:
                    absolute;

                top:
                    50%;

                right:
                    9px;

                z-index:
                    50;

                width:
                    38px;

                height:
                    38px;

                display:
                    inline-flex;

                align-items:
                    center;

                justify-content:
                    center;

                padding:
                    0;

                color:
                    #ffffff;

                background:
                    transparent;

                border:
                    0;

                border-radius:
                    7px;

                cursor:
                    pointer;

                transform:
                    translateY(-50%);

                pointer-events:
                    auto !important;

            }


            .erp-submenu-toggle:hover,
            .erp-submenu-toggle:focus-visible {

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.10
                    );

                outline:
                    none;

            }


            .erp-chevron {

                display:
                    block;

                color:
                    inherit;

                font-size:
                    18px;

                font-weight:
                    700;

                line-height:
                    1;

                pointer-events:
                    none;

                user-select:
                    none;

            }


            .erp-submenu[hidden] {

                display:
                    none !important;

            }


            .erp-submenu:not([hidden]) {

                display:
                    block !important;

            }


            .erp-submenu {

                position:
                    relative;

                margin-left:
                    31px;

                padding-left:
                    13px;

            }


            .erp-submenu::before {

                content:
                    "";

                position:
                    absolute;

                top:
                    0;

                bottom:
                    8px;

                left:
                    0;

                width:
                    1px;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.18
                    );

            }


            .sidebar-navigation
            .erp-sub-navigation-link {

                position:
                    relative;

                width:
                    calc(100% - 4px)
                    !important;

                min-height:
                    44px
                    !important;

                margin-left:
                    0
                    !important;

                padding-left:
                    15px
                    !important;

                display:
                    grid
                    !important;

                grid-template-columns:
                    25px
                    minmax(0, 1fr)
                    !important;

                align-items:
                    center;

            }


            .erp-sub-navigation-link::before {

                content:
                    "";

                position:
                    absolute;

                left:
                    -13px;

                top:
                    50%;

                width:
                    12px;

                height:
                    1px;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.18
                    );

            }


            .sidebar-navigation
            .navigation-arrow {

                display:
                    none
                    !important;

            }


            .role-restricted-card {

                cursor:
                    default
                    !important;

            }


            .role-restricted-card:hover {

                transform:
                    none
                    !important;

            }

        `;


        document.head.appendChild(
            style
        );

    }


    /* =========================================
       FINAL ROLE UI ENFORCEMENT
    ========================================== */

    let roleUiTimer =
        null;


    function enforceRoleUi() {

        applyCurrentUserIdentity();

        applyProfileAccess();

        applyRoleSpecificPageUi();

        syncNotificationBadges();

        bindLogoutLinks();

    }


    function scheduleRoleUiEnforcement(
        delay = 0
    ) {

        clearTimeout(
            roleUiTimer
        );


        roleUiTimer =
            window.setTimeout(
                enforceRoleUi,
                delay
            );

    }


    /*
       Page-specific scripts render first.
       Then this final role layer is applied.
    */

    scheduleRoleUiEnforcement(
        0
    );


    /*
       One extra delayed pass helps Leaflet
       after the Delivery layout changes.
    */

    if (
        currentUser.role ===
        "Driver"

        &&

        currentPage ===
        "delivery.html"
    ) {

        window.setTimeout(
            function () {

                enforceRoleUi();

                refreshLeafletLayout();

            },
            180
        );

    }


    /* =========================================
       PAGE / FOCUS / STORAGE SYNC
    ========================================== */

    window.addEventListener(
        "pageshow",
        function () {

            scheduleRoleUiEnforcement(
                0
            );

        }
    );


    window.addEventListener(
        "focus",
        function () {

            scheduleRoleUiEnforcement(
                0
            );

        }
    );


    window.addEventListener(
        "storage",
        function () {

            scheduleRoleUiEnforcement(
                0
            );

        }
    );


    window.addEventListener(
        "notificationCountUpdated",
        function () {

            scheduleRoleUiEnforcement(
                0
            );

        }
    );


    /* =========================================
       DRIVER NOTIFICATION RE-RENDER SUPPORT
    ========================================== */

    if (
        currentUser.role ===
        "Driver"

        &&

        currentPage ===
        "notifications.html"
    ) {

        const observer =
            new MutationObserver(
                function (
                    mutations
                ) {

                    const childChange =
                        mutations.some(
                            function (
                                mutation
                            ) {

                                return mutation.type ===
                                    "childList";

                            }
                        );


                    if (
                        childChange
                    ) {

                        scheduleRoleUiEnforcement(
                            10
                        );

                    }

                }
            );


        observer.observe(
            document.body,
            {
                childList:
                    true,

                subtree:
                    true
            }
        );


        document.addEventListener(
            "change",
            function () {

                scheduleRoleUiEnforcement(
                    20
                );

            }
        );


        document.addEventListener(
            "input",
            function () {

                scheduleRoleUiEnforcement(
                    20
                );

            }
        );

    }

});