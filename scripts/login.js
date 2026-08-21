document.addEventListener(
    "DOMContentLoaded",
    function () {

    // ==========================================
    // ELEMENTS
    // ==========================================

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


    // ==========================================
    // DEMO ACCOUNT
    // ==========================================

    const DEMO_EMAIL =
        "admin@ricemill.com";


    const DEMO_PASSWORD =
        "123456";


    // ==========================================
    // MESSAGE
    // ==========================================

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


    // ==========================================
    // DEMO AUTO FILL
    // ==========================================

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


    // ==========================================
    // SHOW / HIDE PASSWORD
    // ==========================================

    passwordToggle.addEventListener(
        "click",
        function () {

            const isPassword =
                passwordInput.type ===
                "password";


            if (isPassword) {

                passwordInput.type =
                    "text";


                passwordToggle.textContent =
                    "Hide";


                passwordToggle.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            } else {

                passwordInput.type =
                    "password";


                passwordToggle.textContent =
                    "Show";


                passwordToggle.setAttribute(
                    "aria-label",
                    "Show password"
                );

            }

        }
    );


    // ==========================================
    // CLEAR MESSAGE WHILE TYPING
    // ==========================================

    emailInput.addEventListener(
        "input",
        clearMessage
    );


    passwordInput.addEventListener(
        "input",
        clearMessage
    );


    // ==========================================
    // LOGIN
    // ==========================================

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                emailInput.value
                    .trim()
                    .toLowerCase();


            const password =
                passwordInput.value;


            // ==================================
            // VALIDATION
            // ==================================

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


            if (email === "") {

                showMessage(
                    "Please enter your email address.",
                    "error"
                );


                emailInput.focus();


                return;

            }


            if (password === "") {

                showMessage(
                    "Please enter your password.",
                    "error"
                );


                passwordInput.focus();


                return;

            }


            // ==================================
            // DEMO AUTHENTICATION
            // ==================================

            if (
                email ===
                    DEMO_EMAIL &&
                password ===
                    DEMO_PASSWORD
            ) {

                // Save session

                sessionStorage.setItem(
                    "isLoggedIn",
                    "true"
                );


                sessionStorage.setItem(
                    "currentUser",
                    JSON.stringify({

                        name:
                            "Admin User",

                        email:
                            DEMO_EMAIL,

                        role:
                            "Rice Mill Owner"

                    })
                );


                showMessage(
                    "Login successful. Opening dashboard...",
                    "success"
                );


                loginButton.disabled =
                    true;


                loginButton.innerHTML = `

                    <span>
                        Signing In...
                    </span>

                `;


                setTimeout(
                    function () {

                        window.location.href =
                            "./pages/dashboard.html";

                    },
                    450
                );


                return;

            }


            // ==================================
            // INVALID LOGIN
            // ==================================

            showMessage(
                "Invalid email or password. Please use the demo credentials.",
                "error"
            );


            passwordInput.value =
                "";


            passwordInput.focus();

        }
    );

});