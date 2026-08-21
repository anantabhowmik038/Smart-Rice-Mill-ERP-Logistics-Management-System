document.addEventListener("DOMContentLoaded", async function () {


    /* =========================================
       SMART RICE MILL ERP
       USER ROLE MANAGEMENT
    ========================================== */


    /* =========================================
       SETTINGS SUBMENU
       PERMANENT ARROW FIX
    ========================================== */

    const settingsMenuGroup =
        document.getElementById(
            "settingsMenuGroup"
        );


    const settingsToggle =
        document.getElementById(
            "settingsToggle"
        );


    const settingsSubmenu =
        document.getElementById(
            "settingsSubmenu"
        );


    function setSettingsMenuState(
        isOpen
    ) {

        if (
            !settingsMenuGroup ||
            !settingsToggle
        ) {

            return;

        }


        settingsMenuGroup.classList.toggle(
            "open",
            isOpen
        );


        settingsToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );


        if (
            settingsSubmenu
        ) {

            settingsSubmenu.setAttribute(
                "aria-hidden",
                String(!isOpen)
            );

        }

    }


    /*
       User Roles is a child of Settings,
       therefore Settings starts OPEN.
    */

    setSettingsMenuState(
        true
    );


    if (
        settingsToggle
    ) {

        settingsToggle.addEventListener(
            "click",
            function (event) {

                /*
                   Prevent Settings link from
                   being activated when only
                   arrow button is clicked.
                */

                event.preventDefault();

                event.stopPropagation();


                const isCurrentlyOpen =
                    settingsMenuGroup
                        .classList
                        .contains(
                            "open"
                        );


                setSettingsMenuState(
                    !isCurrentlyOpen
                );

            }
        );

    }


    /* =========================================
       ELEMENTS
    ========================================== */

    const userForm =
        document.getElementById(
            "userForm"
        );


    if (!userForm) {
        return;
    }


    const userFullNameInput =
        document.getElementById(
            "userFullName"
        );


    const userEmailInput =
        document.getElementById(
            "userEmail"
        );


    const userPhoneInput =
        document.getElementById(
            "userPhone"
        );


    const userRoleSelect =
        document.getElementById(
            "userRole"
        );


    const userStatusSelect =
        document.getElementById(
            "userStatus"
        );


    const userPasswordInput =
        document.getElementById(
            "userPassword"
        );


    const passwordRequiredMark =
        document.getElementById(
            "passwordRequiredMark"
        );


    const passwordHelper =
        document.getElementById(
            "passwordHelper"
        );


    const userPasswordToggle =
        document.getElementById(
            "userPasswordToggle"
        );


    const rolePermissionPreview =
        document.getElementById(
            "rolePermissionPreview"
        );


    const userFormTitle =
        document.getElementById(
            "userFormTitle"
        );


    const saveUserBtn =
        document.getElementById(
            "saveUserBtn"
        );


    const cancelUserEditBtn =
        document.getElementById(
            "cancelUserEditBtn"
        );


    const totalUsersValue =
        document.getElementById(
            "totalUsersValue"
        );


    const adminUsersValue =
        document.getElementById(
            "adminUsersValue"
        );


    const managerUsersValue =
        document.getElementById(
            "managerUsersValue"
        );


    const driverUsersValue =
        document.getElementById(
            "driverUsersValue"
        );


    const userTableBody =
        document.getElementById(
            "userTableBody"
        );


    const userSearch =
        document.getElementById(
            "userSearch"
        );


    const roleFilter =
        document.getElementById(
            "roleFilter"
        );


    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    const topbarUserName =
        document.getElementById(
            "topbarUserName"
        );


    const sidebarMillName =
        document.getElementById(
            "sidebarMillName"
        );


    const menuButton =
        document.getElementById(
            "menuButton"
        );


    const sidebar =
        document.getElementById(
            "sidebar"
        );


    const sidebarBackdrop =
        document.getElementById(
            "sidebarBackdrop"
        );


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
       STATE
    ========================================== */

    let userRecords =
        [];


    let editingUserId =
        null;


    let pendingDeleteId =
        null;


    /* =========================================
       STORAGE
    ========================================== */

    function safeParseStorage(
        key,
        fallback = []
    ) {

        try {

            const value =
                localStorage.getItem(
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
                ) ??
                fallback
            );

        }
        catch {

            return fallback;

        }

    }


    /* =========================================
       SHA-256
    ========================================== */

    async function sha256(
        value
    ) {

        const data =
            new TextEncoder()
                .encode(
                    value
                );


        const hashBuffer =
            await crypto.subtle.digest(
                "SHA-256",
                data
            );


        return Array
            .from(
                new Uint8Array(
                    hashBuffer
                )
            )
            .map(
                function (byte) {

                    return byte
                        .toString(16)
                        .padStart(
                            2,
                            "0"
                        );

                }
            )
            .join("");

    }


    /* =========================================
       PROFILE
    ========================================== */

    function getAdminProfile() {

        return safeParseStorage(

            "adminProfile",

            {

                fullName:
                    "Admin User",

                email:
                    "admin@ricemill.com",

                phone:
                    "+880 1712 345678"

            }

        );

    }


    /* =========================================
       HEADER
    ========================================== */

    function renderHeaderSettings() {

        const profile =
            getAdminProfile();


        const settings =
            safeParseStorage(
                "riceMillSettings",
                {}
            );


        if (
            topbarUserName
        ) {

            topbarUserName.textContent =
                profile.fullName ||
                "Admin User";

        }


        if (
            sidebarMillName
        ) {

            sidebarMillName.textContent =

                settings.millName ||
                "Smart Rice Mill";

        }

    }


    /* =========================================
       DEFAULT USERS
    ========================================== */

    async function createDefaultUsers() {

        const profile =
            getAdminProfile();


        const ownerPasswordHash =

            localStorage.getItem(
                "smartRiceMillAdminPasswordHash"
            )

            ||

            await sha256(
                "123456"
            );


        const managerHash =
            await sha256(
                "manager123"
            );


        const driverHash =
            await sha256(
                "driver123"
            );


        const baseTime =
            Date.now();


        return [


            {

                id:
                    baseTime,

                userId:
                    "USR-001",

                fullName:

                    profile.fullName ||
                    "Admin User",

                email:

                    String(
                        profile.email ||
                        "admin@ricemill.com"
                    )
                    .toLowerCase(),

                phone:

                    profile.phone ||
                    "+880 1712 345678",

                role:
                    "Owner",

                status:
                    "Active",

                passwordHash:
                    ownerPasswordHash,

                protected:
                    true,

                permissions:
                    ROLE_PERMISSIONS.Owner,

                createdAt:
                    baseTime

            },


            {

                id:
                    baseTime + 1,

                userId:
                    "USR-002",

                fullName:
                    "Manager User",

                email:
                    "manager@ricemill.com",

                phone:
                    "01710000002",

                role:
                    "Manager",

                status:
                    "Active",

                passwordHash:
                    managerHash,

                protected:
                    false,

                permissions:
                    ROLE_PERMISSIONS.Manager,

                createdAt:
                    baseTime + 1

            },


            {

                id:
                    baseTime + 2,

                userId:
                    "USR-003",

                fullName:
                    "Driver User",

                email:
                    "driver@ricemill.com",

                phone:
                    "01710000003",

                role:
                    "Driver",

                status:
                    "Active",

                passwordHash:
                    driverHash,

                protected:
                    false,

                permissions:
                    ROLE_PERMISSIONS.Driver,

                createdAt:
                    baseTime + 2

            }


        ];

    }


    /* =========================================
       LOAD USERS
    ========================================== */

    async function loadUsers() {

        let stored =
            safeParseStorage(
                "userAccounts",
                null
            );


        if (
            !Array.isArray(
                stored
            )
        ) {

            stored =
                safeParseStorage(
                    "users",
                    null
                );

        }


        if (
            !Array.isArray(
                stored
            )

            ||

            stored.length === 0
        ) {

            stored =
                await createDefaultUsers();

        }


        const normalized =
            [];


        for (
            let index = 0;
            index < stored.length;
            index++
        ) {

            const record =
                stored[index];


            const role =
                record.role ||
                "Operator";


            normalized.push({


                id:

                    record.id ??
                    Date.now() + index,


                userId:

                    record.userId

                    ||

                    `USR-${String(
                        index + 1
                    ).padStart(
                        3,
                        "0"
                    )}`,


                fullName:

                    record.fullName ||
                    record.name ||
                    `User ${index + 1}`,


                email:

                    String(
                        record.email ||
                        ""
                    )
                    .toLowerCase(),


                phone:

                    record.phone ||
                    record.phoneNumber ||
                    "",


                role:
                    role,


                status:

                    record.status ||
                    "Active",


                passwordHash:

                    record.passwordHash ||
                    "",


                protected:

                    Boolean(
                        record.protected
                    )

                    ||

                    role === "Owner",


                permissions:

                    ROLE_PERMISSIONS[
                        role
                    ]

                    ||

                    [],


                createdAt:

                    Number(
                        record.createdAt ||
                        record.id ||
                        Date.now()
                    )

            });

        }


        const hasOwner =
            normalized.some(
                function (record) {

                    return (
                        record.role ===
                        "Owner"
                    );

                }
            );


        if (
            !hasOwner
        ) {

            const defaults =
                await createDefaultUsers();


            normalized.unshift(
                defaults[0]
            );

        }


        userRecords =
            normalized;


        syncOwnerWithProfile();

        saveUsers();

    }


    /* =========================================
       OWNER SYNC
    ========================================== */

    function syncOwnerWithProfile() {

        const profile =
            getAdminProfile();


        const owner =
            userRecords.find(
                function (record) {

                    return (
                        record.role ===
                        "Owner"
                    );

                }
            );


        if (!owner) {
            return;
        }


        owner.fullName =

            profile.fullName ||
            owner.fullName;


        owner.email =

            String(
                profile.email ||
                owner.email
            )
            .toLowerCase();


        owner.phone =

            profile.phone ||
            owner.phone;


        owner.status =
            "Active";


        owner.protected =
            true;


        owner.permissions =
            ROLE_PERMISSIONS.Owner;

    }


    /* =========================================
       SAVE
    ========================================== */

    function saveUsers() {

        localStorage.setItem(

            "userAccounts",

            JSON.stringify(
                userRecords
            )

        );


        localStorage.setItem(

            "systemUsers",

            JSON.stringify(
                userRecords
            )

        );

    }


    /* =========================================
       SAFE HTML
    ========================================== */

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


    /* =========================================
       PHONE
    ========================================== */

    function normalizePhone(
        value
    ) {

        return String(
            value || ""
        )
        .replace(
            /[^\d+]/g,
            ""
        )
        .trim();

    }


    function normalizePhoneForComparison(
        value
    ) {

        let phone =
            normalizePhone(
                value
            )
            .replace(
                /^\+/,
                ""
            );


        if (
            phone.startsWith(
                "880"
            )
        ) {

            phone =
                phone.slice(
                    3
                );

        }


        return phone;

    }


    function isValidBangladeshPhone(
        value
    ) {

        const normalized =
            normalizePhone(
                value
            )
            .replace(
                /^\+/,
                ""
            );


        return (

            /^01[3-9]\d{8}$/
                .test(
                    normalized
                )

            ||

            /^8801[3-9]\d{8}$/
                .test(
                    normalized
                )

        );

    }


    /* =========================================
       EMAIL
    ========================================== */

    function isValidEmail(
        value
    ) {

        return (
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(
                    String(
                        value
                    )
                    .trim()
                )
        );

    }


    /* =========================================
       GENERATE USER ID
    ========================================== */

    function generateUserId() {

        const numbers =
            userRecords

            .map(
                function (record) {

                    const match =
                        String(
                            record.userId ||
                            ""
                        )
                        .match(
                            /^USR-(\d+)$/i
                        );


                    return (
                        match
                            ? Number(
                                match[1]
                            )
                            : 0
                    );

                }
            )

            .filter(
                Boolean
            );


        const next =
            numbers.length > 0

                ?

                Math.max(
                    ...numbers
                ) + 1

                :

                1;


        return (
            `USR-${String(
                next
            ).padStart(
                3,
                "0"
            )}`
        );

    }


    /* =========================================
       ROLE ACCESS PREVIEW
    ========================================== */

    function updateRolePermissionPreview() {

        const role =
            userRoleSelect.value;


        if (
            !role

            ||

            !ROLE_PERMISSIONS[
                role
            ]
        ) {

            rolePermissionPreview.innerHTML = `

                <div>

                    <strong>
                        Role Access
                    </strong>

                    <span>
                        Select a role to preview module permissions.
                    </span>

                </div>

            `;


            return;

        }


        rolePermissionPreview.innerHTML = `

            <div>

                <strong>
                    ${escapeHTML(role)} Access
                </strong>

                <span>
                    ${escapeHTML(
                        ROLE_PERMISSIONS[
                            role
                        ].join(" • ")
                    )}
                </span>

            </div>

        `;

    }


    userRoleSelect.addEventListener(
        "change",
        updateRolePermissionPreview
    );


    /* =========================================
       PASSWORD VISIBILITY
    ========================================== */

    userPasswordToggle.addEventListener(
        "click",
        function () {

            const visible =
                userPasswordInput.type ===
                "text";


            userPasswordInput.type =

                visible
                    ? "password"
                    : "text";


            userPasswordToggle.textContent =

                visible
                    ? "◉"
                    : "◎";

        }
    );


    /* =========================================
       SUMMARY
    ========================================== */

    function updateSummary() {

        totalUsersValue.textContent =
            userRecords.length;


        adminUsersValue.textContent =

            userRecords.filter(
                function (record) {

                    return (

                        record.role ===
                        "Owner"

                        ||

                        record.role ===
                        "Admin"

                    );

                }
            ).length;


        managerUsersValue.textContent =

            userRecords.filter(
                function (record) {

                    return (
                        record.role ===
                        "Manager"
                    );

                }
            ).length;


        driverUsersValue.textContent =

            userRecords.filter(
                function (record) {

                    return (
                        record.role ===
                        "Driver"
                    );

                }
            ).length;

    }


    /* =========================================
       VALIDATION
    ========================================== */

    function validateUserForm() {

        const fullName =
            userFullNameInput.value
                .trim();


        const email =
            userEmailInput.value
                .trim()
                .toLowerCase();


        const phone =
            userPhoneInput.value
                .trim();


        if (
            fullName.length < 2
        ) {

            return (
                "Please enter a valid full name."
            );

        }


        if (
            !isValidEmail(
                email
            )
        ) {

            return (
                "Please enter a valid email address."
            );

        }


        if (
            !isValidBangladeshPhone(
                phone
            )
        ) {

            return (
                "Please enter a valid Bangladesh phone number."
            );

        }


        if (
            !userRoleSelect.value
        ) {

            return (
                "Please select a user role."
            );

        }


        if (
            !userStatusSelect.value
        ) {

            return (
                "Please select a user status."
            );

        }


        const duplicateEmail =
            userRecords.some(
                function (record) {

                    return (

                        record.email
                            .toLowerCase()

                        ===

                        email

                        &&

                        Number(
                            record.id
                        )

                        !==

                        Number(
                            editingUserId
                        )

                    );

                }
            );


        if (
            duplicateEmail
        ) {

            return (
                "This email address is already assigned to another user."
            );

        }


        const normalizedPhone =
            normalizePhoneForComparison(
                phone
            );


        const duplicatePhone =
            userRecords.some(
                function (record) {

                    return (

                        normalizePhoneForComparison(
                            record.phone
                        )

                        ===

                        normalizedPhone

                        &&

                        Number(
                            record.id
                        )

                        !==

                        Number(
                            editingUserId
                        )

                    );

                }
            );


        if (
            duplicatePhone
        ) {

            return (
                "This phone number is already assigned to another user."
            );

        }


        if (
            editingUserId === null

            &&

            userPasswordInput.value
                .length < 6
        ) {

            return (
                "New user password must contain at least 6 characters."
            );

        }


        if (
            editingUserId !== null

            &&

            userPasswordInput.value.length > 0

            &&

            userPasswordInput.value.length < 6
        ) {

            return (
                "New password must contain at least 6 characters."
            );

        }


        return "";

    }


    /* =========================================
       SAVE USER
    ========================================== */

    userForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const error =
                validateUserForm();


            if (
                error
            ) {

                showToast(
                    error,
                    "error"
                );


                return;

            }


            const existingIndex =
                userRecords.findIndex(
                    function (record) {

                        return (

                            Number(
                                record.id
                            )

                            ===

                            Number(
                                editingUserId
                            )

                        );

                    }
                );


            const existing =

                existingIndex >= 0

                    ?

                    userRecords[
                        existingIndex
                    ]

                    :

                    null;


            if (
                existing &&
                existing.protected
            ) {

                showToast(

                    "The protected Owner account is managed from Profile & Settings.",

                    "error"

                );


                resetUserForm();

                return;

            }


            let passwordHash =

                existing
                    ? existing.passwordHash
                    : "";


            if (
                userPasswordInput.value
            ) {

                passwordHash =
                    await sha256(
                        userPasswordInput.value
                    );

            }


            const role =
                userRoleSelect.value;


            const record = {


                id:

                    existing
                        ? existing.id
                        : Date.now(),


                userId:

                    existing
                        ? existing.userId
                        : generateUserId(),


                fullName:

                    userFullNameInput.value
                        .trim(),


                email:

                    userEmailInput.value
                        .trim()
                        .toLowerCase(),


                phone:

                    userPhoneInput.value
                        .trim(),


                role:
                    role,


                status:

                    userStatusSelect.value,


                passwordHash:
                    passwordHash,


                protected:
                    false,


                permissions:

                    ROLE_PERMISSIONS[
                        role
                    ]

                    ||

                    [],


                createdAt:

                    existing
                        ? existing.createdAt
                        : Date.now(),


                updatedAt:

                    new Date()
                        .toISOString()

            };


            if (
                existing
            ) {

                userRecords[
                    existingIndex
                ] =
                    record;


                showToast(

                    `${record.userId} updated successfully.`

                );

            }
            else {

                userRecords.push(
                    record
                );


                showToast(

                    `${record.userId} created successfully.`

                );

            }


            saveUsers();

            resetUserForm();

            refreshPage();

        }
    );


    /* =========================================
       RESET FORM
    ========================================== */

    function resetUserForm() {

        editingUserId =
            null;


        userForm.reset();


        userPasswordInput.type =
            "password";


        userPasswordToggle.textContent =
            "◉";


        passwordRequiredMark.hidden =
            false;


        passwordHelper.textContent =
            "Required for a new user.";


        userFormTitle.textContent =
            "Add User";


        saveUserBtn.innerHTML = `

            <span aria-hidden="true">
                ▣
            </span>

            Add User

        `;


        cancelUserEditBtn.hidden =
            true;


        updateRolePermissionPreview();

    }


    cancelUserEditBtn.addEventListener(
        "click",
        resetUserForm
    );


    /* =========================================
       EDIT
    ========================================== */

    function editUser(
        id
    ) {

        const record =
            userRecords.find(
                function (item) {

                    return (

                        Number(
                            item.id
                        )

                        ===

                        Number(
                            id
                        )

                    );

                }
            );


        if (!record) {
            return;
        }


        if (
            record.protected
        ) {

            showToast(

                "Owner profile information is managed from Profile & Settings.",

                "error"

            );


            return;

        }


        editingUserId =
            record.id;


        userFullNameInput.value =
            record.fullName;


        userEmailInput.value =
            record.email;


        userPhoneInput.value =
            record.phone;


        userRoleSelect.value =
            record.role;


        userStatusSelect.value =
            record.status;


        userPasswordInput.value =
            "";


        passwordRequiredMark.hidden =
            true;


        passwordHelper.textContent =

            "Optional during edit. Leave blank to keep the current password.";


        userFormTitle.textContent =

            `Edit User — ${record.userId}`;


        saveUserBtn.innerHTML = `

            <span aria-hidden="true">
                ✓
            </span>

            Update User

        `;


        cancelUserEditBtn.hidden =
            false;


        updateRolePermissionPreview();


        userForm.scrollIntoView(
            {
                behavior:
                    "smooth",

                block:
                    "center"
            }
        );

    }


    /* =========================================
       ROLE CLASS
    ========================================== */

    function getRoleClass(
        role
    ) {

        const map = {

            Owner:
                "role-owner",

            Admin:
                "role-admin",

            Manager:
                "role-manager",

            Accountant:
                "role-accountant",

            Operator:
                "role-operator",

            Driver:
                "role-driver"

        };


        return (
            map[role] ||
            "role-operator"
        );

    }


    /* =========================================
       ACCESS SUMMARY
    ========================================== */

    function getAccessSummary(
        role
    ) {

        if (
            role === "Owner"
        ) {

            return (
                "Full system administration and all ERP modules."
            );

        }


        if (
            role === "Admin"
        ) {

            return (
                "Full operational access except Owner-only account control."
            );

        }


        if (
            role === "Manager"
        ) {

            return (
                "Procurement, quality, production, inventory, sales, delivery, reports and maintenance."
            );

        }


        if (
            role === "Accountant"
        ) {

            return (
                "Sales, customers, finance, expense, salary and management reports."
            );

        }


        if (
            role === "Operator"
        ) {

            return (
                "Purchase, supplier, quality inspection, production, inventory and maintenance."
            );

        }


        if (
            role === "Driver"
        ) {

            return (
                "Delivery operations and delivery-related notifications."
            );

        }


        return (
            "Limited access."
        );

    }


    /* =========================================
       ACTION HTML
    ========================================== */

    function actionHTML(
        record
    ) {

        if (
            record.protected
        ) {

            return `

                <span class="user-protected-badge">
                    🔒 Protected
                </span>

            `;

        }


        if (
            Number(
                pendingDeleteId
            )

            ===

            Number(
                record.id
            )
        ) {

            return `

                <span class="user-delete-question">
                    Delete?
                </span>

                <button
                    class="user-confirm-button"
                    type="button"
                    data-user-action="confirm-delete"
                    data-id="${record.id}"
                >
                    Confirm
                </button>

                <button
                    class="user-cancel-button"
                    type="button"
                    data-user-action="cancel-delete"
                    data-id="${record.id}"
                >
                    Cancel
                </button>

            `;

        }


        const toggleLabel =

            record.status ===
            "Active"

                ?

                "Deactivate"

                :

                "Activate";


        return `

            <button
                class="user-edit-button"
                type="button"
                data-user-action="edit"
                data-id="${record.id}"
            >
                Edit
            </button>

            <button
                class="user-toggle-button"
                type="button"
                data-user-action="toggle-status"
                data-id="${record.id}"
            >
                ${toggleLabel}
            </button>

            <button
                class="user-delete-button"
                type="button"
                data-user-action="delete"
                data-id="${record.id}"
            >
                Delete
            </button>

        `;

    }


    /* =========================================
       DISPLAY USERS
    ========================================== */

    function displayUsers() {

        const searchText =
            userSearch.value
                .trim()
                .toLowerCase();


        const selectedRole =
            roleFilter.value;


        const selectedStatus =
            statusFilter.value;


        const filtered =
            userRecords

            .filter(
                function (record) {

                    if (
                        selectedRole !==
                        "all"

                        &&

                        record.role !==
                        selectedRole
                    ) {

                        return false;

                    }


                    if (
                        selectedStatus !==
                        "all"

                        &&

                        record.status !==
                        selectedStatus
                    ) {

                        return false;

                    }


                    if (
                        !searchText
                    ) {

                        return true;

                    }


                    const searchable =
                        [

                            record.userId,
                            record.fullName,
                            record.email,
                            record.phone,
                            record.role,
                            record.status

                        ]
                        .join(" ")
                        .toLowerCase();


                    return searchable.includes(
                        searchText
                    );

                }
            )

            .sort(
                function (a, b) {

                    if (
                        a.role === "Owner"

                        &&

                        b.role !== "Owner"
                    ) {

                        return -1;

                    }


                    if (
                        b.role === "Owner"

                        &&

                        a.role !== "Owner"
                    ) {

                        return 1;

                    }


                    return String(
                        a.userId
                    )
                    .localeCompare(
                        String(
                            b.userId
                        )
                    );

                }
            );


        userTableBody.innerHTML =
            "";


        if (
            filtered.length === 0
        ) {

            userTableBody.innerHTML = `

                <tr class="users-empty-row">

                    <td colspan="7">

                        No user records match the current filters.

                    </td>

                </tr>

            `;


            return;

        }


        filtered.forEach(
            function (record) {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>

                        <span class="user-id">

                            ${escapeHTML(
                                record.userId
                            )}

                        </span>

                    </td>


                    <td>

                        <span class="user-primary-text">

                            ${escapeHTML(
                                record.fullName
                            )}

                        </span>

                        <span class="user-secondary-text">

                            ${
                                record.protected
                                    ? "Primary system owner"
                                    : "System user"
                            }

                        </span>

                    </td>


                    <td>

                        <span class="user-primary-text">

                            ${escapeHTML(
                                record.email
                            )}

                        </span>

                        <span class="user-secondary-text">

                            ${escapeHTML(
                                record.phone
                            )}

                        </span>

                    </td>


                    <td>

                        <span
                            class="
                                user-role-badge
                                ${getRoleClass(
                                    record.role
                                )}
                            "
                        >

                            ${escapeHTML(
                                record.role
                            )}

                        </span>

                    </td>


                    <td>

                        <div class="user-access-text">

                            ${escapeHTML(
                                getAccessSummary(
                                    record.role
                                )
                            )}

                        </div>

                    </td>


                    <td>

                        <span
                            class="
                                user-status-badge

                                ${
                                    record.status ===
                                    "Active"

                                        ?

                                        "status-active"

                                        :

                                        "status-inactive"
                                }
                            "
                        >

                            ${escapeHTML(
                                record.status
                            )}

                        </span>

                    </td>


                    <td>

                        <div class="user-action-buttons">

                            ${actionHTML(
                                record
                            )}

                        </div>

                    </td>

                `;


                userTableBody.appendChild(
                    row
                );

            }
        );

    }


    /* =========================================
       FILTERS
    ========================================== */

    userSearch.addEventListener(
        "input",
        displayUsers
    );


    roleFilter.addEventListener(
        "change",
        displayUsers
    );


    statusFilter.addEventListener(
        "change",
        displayUsers
    );


    /* =========================================
       TABLE ACTIONS
    ========================================== */

    userTableBody.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    "button[data-user-action]"
                );


            if (!button) {
                return;
            }


            const id =
                Number(
                    button.dataset.id
                );


            const action =
                button.dataset
                    .userAction;


            const record =
                userRecords.find(
                    function (item) {

                        return (

                            Number(
                                item.id
                            )

                            ===

                            id

                        );

                    }
                );


            if (!record) {
                return;
            }


            if (
                record.protected
            ) {

                showToast(

                    "The Owner account is protected.",

                    "error"

                );


                return;

            }


            if (
                action ===
                "edit"
            ) {

                editUser(
                    id
                );


                return;

            }


            if (
                action ===
                "toggle-status"
            ) {

                record.status =

                    record.status ===
                    "Active"

                        ?

                        "Inactive"

                        :

                        "Active";


                record.updatedAt =
                    new Date()
                        .toISOString();


                saveUsers();

                refreshPage();


                showToast(

                    `${record.userId} is now ${record.status}.`

                );


                return;

            }


            if (
                action ===
                "delete"
            ) {

                pendingDeleteId =
                    id;


                displayUsers();


                return;

            }


            if (
                action ===
                "cancel-delete"
            ) {

                pendingDeleteId =
                    null;


                displayUsers();


                return;

            }


            if (
                action ===
                "confirm-delete"
            ) {

                userRecords =
                    userRecords.filter(
                        function (item) {

                            return (

                                Number(
                                    item.id
                                )

                                !==

                                id

                            );

                        }
                    );


                pendingDeleteId =
                    null;


                saveUsers();

                refreshPage();


                showToast(

                    `${record.userId} deleted successfully.`

                );

            }

        }
    );


    /* =========================================
       REFRESH
    ========================================== */

    function refreshPage() {

        syncOwnerWithProfile();

        saveUsers();

        updateSummary();

        displayUsers();

    }


    /* =========================================
       TOAST
    ========================================== */

    function showToast(
        message,
        type = "success"
    ) {

        const oldToast =
            document.querySelector(
                ".users-toast"
            );


        if (
            oldToast
        ) {

            oldToast.remove();

        }


        const toast =
            document.createElement(
                "div"
            );


        toast.className =
            `users-toast ${type}`;


        toast.innerHTML = `

            <span class="users-toast-icon">

                ${
                    type === "error"
                        ? "!"
                        : "✓"
                }

            </span>

            <span>

                ${escapeHTML(
                    message
                )}

            </span>

        `;


        document.body.appendChild(
            toast
        );


        requestAnimationFrame(
            function () {

                toast.classList.add(
                    "show"
                );

            }
        );


        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );


                setTimeout(
                    function () {

                        toast.remove();

                    },
                    250
                );

            },
            2800
        );

    }


    /* =========================================
       MOBILE SIDEBAR
    ========================================== */

    function openSidebar() {

        if (!sidebar) {
            return;
        }


        sidebar.classList.add(
            "open"
        );


        if (
            sidebarBackdrop
        ) {

            sidebarBackdrop.classList.add(
                "show"
            );

        }


        if (
            menuButton
        ) {

            menuButton.setAttribute(
                "aria-expanded",
                "true"
            );

        }


        document.body.style.overflow =
            "hidden";

    }


    function closeSidebar() {

        if (!sidebar) {
            return;
        }


        sidebar.classList.remove(
            "open"
        );


        if (
            sidebarBackdrop
        ) {

            sidebarBackdrop.classList.remove(
                "show"
            );

        }


        if (
            menuButton
        ) {

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

        }


        document.body.style.overflow =
            "";

    }


    if (
        menuButton
    ) {

        menuButton.addEventListener(
            "click",
            function () {

                if (
                    sidebar &&
                    sidebar.classList.contains(
                        "open"
                    )
                ) {

                    closeSidebar();

                }
                else {

                    openSidebar();

                }

            }
        );

    }


    if (
        sidebarBackdrop
    ) {

        sidebarBackdrop.addEventListener(
            "click",
            closeSidebar
        );

    }


    /* =========================================
       ESCAPE
    ========================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key !==
                "Escape"
            ) {

                return;

            }


            if (
                pendingDeleteId !==
                null
            ) {

                pendingDeleteId =
                    null;


                displayUsers();


                return;

            }


            closeSidebar();

        }
    );


    /* =========================================
       INITIALIZE
    ========================================== */

    renderHeaderSettings();


    await loadUsers();


    resetUserForm();


    refreshPage();

});