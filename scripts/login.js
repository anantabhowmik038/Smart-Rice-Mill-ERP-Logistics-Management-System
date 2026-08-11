document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const loginMessage = document.getElementById("loginMessage");

        if (email === "admin@ricemill.com" && password === "123456") {

            // Save login session
            sessionStorage.setItem("isLoggedIn", "true");

            // Go to dashboard
            window.location.href = "./pages/dashboard.html";

        } else {

            loginMessage.textContent = "Invalid email or password.";

        }

    });

});