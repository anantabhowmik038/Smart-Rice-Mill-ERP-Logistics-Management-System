document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* =========================================
           SMART RICE MILL ERP
           LOGIN + USER ACCOUNT AUTHENTICATION
        ========================================== */


        /* =========================================
           ELEMENTS
        ========================================== */

        const loginForm =
            document.getElementById(
                "loginForm"
            );

        const emailInput =
            document.getElementById(
                "email"
            );

        const passwordInput =
            document.getElementById(
                "password"
            );

        const loginMessage =
            document.getElementById(
                "loginMessage"
            );

        const loginButton =
            document.getElementById(
                "loginButton"
            );

        const passwordToggle =
            document.getElementById(
                "passwordToggle"
            );

        const demoFillButton =
            document.getElementById(
                "demoFillButton"
            );


        if (
            !loginForm ||
            !emailInput ||
            !passwordInput ||
            !loginMessage ||
            !loginButton
        ) {
            return;
        }


        /* =========================================
           DEMO OWNER ACCOUNT
        ========================================== */

        const DEMO_EMAIL =
            "admin@ricemill.com";

        const DEMO_PASSWORD =
            "123456";


        /* =========================================
           ROLE PERMISSIONS
           SAME RULES AS USER ROLES MODULE
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
           MESSAGE
        ========================================== */

        function showMessage(
            message,
            type
        ) {

            loginMessage.textContent =
                message;

            loginMessage.className =
                "login-message " +
                type;

        }


        function clearMessage() {

            loginMessage.textContent =
                "";

            loginMessage.className =
                "login-message";

        }


        /* =========================================
           LOGIN NOTICE FROM AUTH.JS
        ========================================== */

        const loginNotice =
            sessionStorage.getItem(
                "loginNotice"
            );


        if (
            loginNotice
        ) {

            showMessage(
                loginNotice,
                "error"
            );

            sessionStorage.removeItem(
                "loginNotice"
            );

        }


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
                    )
                    ??
                    fallback
                );

            }
            catch {

                return fallback;

            }

        }


        function getUserAccounts() {

            const keys = [
                "userAccounts",
                "systemUsers",
                "users"
            ];


            for (
                const key of keys
            ) {

                const records =
                    safeParseStorage(
                        key,
                        null
                    );


                if (
                    Array.isArray(
                        records
                    )
                    &&
                    records.length > 0
                ) {

                    return records;

                }

            }


            return [];

        }


        /* =========================================
           SHA-256
           MATCHES users.js
        ========================================== */

        async function sha256(
            value
        ) {

            if (
                !window.crypto ||
                !window.crypto.subtle
            ) {

                throw new Error(
                    "Secure password hashing is unavailable in this browser context."
                );

            }


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
                    function (
                        byte
                    ) {

                        return byte
                            .toString(
                                16
                            )
                            .padStart(
                                2,
                                "0"
                            );

                    }
                )
                .join("");

        }


        /* =========================================
           ROLE NORMALIZATION
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


        /* =========================================
           SESSION
        ========================================== */

        function createSession(
            user
        ) {

            const role =
                normalizeRole(
                    user.role
                );


            const permissions =
                Array.isArray(
                    user.permissions
                )

                    ?

                    user.permissions

                    :

                    (
                        ROLE_PERMISSIONS[
                            role
                        ]
                        ||
                        []
                    );


            const sessionUser = {

                userId:
                    user.userId
                    ||
                    "USR-001",

                name:
                    user.fullName
                    ||
                    user.name
                    ||
                    "System User",

                fullName:
                    user.fullName
                    ||
                    user.name
                    ||
                    "System User",

                email:
                    String(
                        user.email
                        ||
                        ""
                    )
                    .toLowerCase(),

                phone:
                    user.phone
                    ||
                    "",

                role:
                    role,

                displayRole:
                    role ===
                    "Owner"

                        ?

                        "Rice Mill Owner"

                        :

                        role,

                status:
                    "Active",

                permissions:
                    permissions

            };


            sessionStorage.setItem(
                "isLoggedIn",
                "true"
            );


            sessionStorage.setItem(
                "currentUser",
                JSON.stringify(
                    sessionUser
                )
            );

        }


        /* =========================================
           BUTTON STATE
        ========================================== */

        function setSigningInState(
            active
        ) {

            loginButton.disabled =
                active;


            if (
                active
            ) {

                loginButton.innerHTML = `

                    <span>
                        Signing In...
                    </span>

                `;

            }
            else {

                loginButton.innerHTML = `

                    <span>
                        Sign In
                    </span>

                    <span
                        class="login-arrow"
                        aria-hidden="true"
                    >
                        →
                    </span>

                `;

            }

        }


        /* =========================================
           DEMO AUTO FILL
        ========================================== */

        if (
            demoFillButton
        ) {

            demoFillButton.addEventListener(
                "click",
                function () {

                    emailInput.value =
                        DEMO_EMAIL;


                    passwordInput.value =
                        DEMO_PASSWORD;


                    clearMessage();


                    emailInput.focus();


                    showMessage(
                        "Demo credentials are ready. Click Sign In.",
                        "success"
                    );

                }
            );

        }


        /* =========================================
           SHOW / HIDE PASSWORD
        ========================================== */

        if (
            passwordToggle
        ) {

            passwordToggle.addEventListener(
                "click",
                function () {

                    const isPassword =
                        passwordInput.type ===
                        "password";


                    passwordInput.type =
                        isPassword
                            ? "text"
                            : "password";


                    passwordToggle.textContent =
                        isPassword
                            ? "Hide"
                            : "Show";


                    passwordToggle.setAttribute(
                        "aria-label",

                        isPassword
                            ? "Hide password"
                            : "Show password"
                    );

                }
            );

        }


        /* =========================================
           CLEAR MESSAGE WHILE TYPING
        ========================================== */

        emailInput.addEventListener(
            "input",
            clearMessage
        );


        passwordInput.addEventListener(
            "input",
            clearMessage
        );


        /* =========================================
           LOGIN
        ========================================== */

        loginForm.addEventListener(
            "submit",
            async function (
                event
            ) {

                event.preventDefault();


                const email =
                    emailInput.value
                        .trim()
                        .toLowerCase();


                const password =
                    passwordInput.value;


                /* =================================
                   BASIC VALIDATION
                ================================= */

                if (
                    email === "" &&
                    password === ""
                ) {

                    showMessage(
                        "Please enter your email address and password.",
                        "error"
                    );


                    emailInput.focus();

                    return;

                }


                if (
                    email === ""
                ) {

                    showMessage(
                        "Please enter your email address.",
                        "error"
                    );


                    emailInput.focus();

                    return;

                }


                if (
                    password === ""
                ) {

                    showMessage(
                        "Please enter your password.",
                        "error"
                    );


                    passwordInput.focus();

                    return;

                }


                setSigningInState(
                    true
                );


                try {

                    const users =
                        getUserAccounts();


                    const matchedUser =
                        users.find(
                            function (
                                user
                            ) {

                                return (
                                    String(
                                        user.email
                                        ||
                                        ""
                                    )
                                    .trim()
                                    .toLowerCase()

                                    ===

                                    email
                                );

                            }
                        );


                    /* =================================
                       REGISTERED ERP USER
                    ================================= */

                    if (
                        matchedUser
                    ) {

                        const enteredHash =
                            await sha256(
                                password
                            );


                        const storedHash =
                            String(
                                matchedUser.passwordHash
                                ||
                                ""
                            );


                        if (
                            !storedHash ||
                            enteredHash !==
                            storedHash
                        ) {

                            showMessage(
                                "Invalid email or password.",
                                "error"
                            );


                            passwordInput.value =
                                "";


                            passwordInput.focus();


                            setSigningInState(
                                false
                            );


                            return;

                        }


                        const status =
                            String(
                                matchedUser.status
                                ||
                                "Active"
                            )
                            .toLowerCase();


                        if (
                            status !==
                            "active"
                        ) {

                            showMessage(
                                "Your account is inactive. Please contact the administrator.",
                                "error"
                            );


                            passwordInput.value =
                                "";


                            setSigningInState(
                                false
                            );


                            return;

                        }


                        createSession(
                            matchedUser
                        );


                        showMessage(
                            "Login successful. Opening dashboard...",
                            "success"
                        );


                        setTimeout(
                            function () {

                                window.location.href =
                                    "./pages/dashboard.html";

                            },
                            350
                        );


                        return;

                    }


                    /* =================================
                       FALLBACK DEMO OWNER

                       Used only when no registered
                       account exists for this email.

                       It does NOT bypass a changed
                       Owner password.
                    ================================= */

                    if (
                        email ===
                        DEMO_EMAIL
                        &&
                        password ===
                        DEMO_PASSWORD
                    ) {

                        createSession(
                            {
                                userId:
                                    "USR-001",

                                fullName:
                                    "Admin User",

                                email:
                                    DEMO_EMAIL,

                                role:
                                    "Owner",

                                status:
                                    "Active",

                                permissions:
                                    ROLE_PERMISSIONS
                                        .Owner
                            }
                        );


                        showMessage(
                            "Login successful. Opening dashboard...",
                            "success"
                        );


                        setTimeout(
                            function () {

                                window.location.href =
                                    "./pages/dashboard.html";

                            },
                            350
                        );


                        return;

                    }


                    /* =================================
                       INVALID LOGIN
                    ================================= */

                    showMessage(
                        "Invalid email or password.",
                        "error"
                    );


                    passwordInput.value =
                        "";


                    passwordInput.focus();


                    setSigningInState(
                        false
                    );

                }
                catch (
                    error
                ) {

                    console.error(
                        "Login error:",
                        error
                    );


                    showMessage(
                        "Login could not be completed. Please refresh the page and try again.",
                        "error"
                    );


                    setSigningInState(
                        false
                    );

                }

            }
        );

    }
);