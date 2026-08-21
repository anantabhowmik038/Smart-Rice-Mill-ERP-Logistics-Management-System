document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       SMART RICE MILL ERP
       PROFILE & SYSTEM SETTINGS

       IMPORTANT STORAGE KEYS
       ----------------------
       adminProfile
       riceMillSettings
       millLocation

       millLocation is intentionally stored
       separately so the Delivery module can use
       the configured mill as its starting point.

       Password:
       No plaintext password is stored.
       A SHA-256 prototype hash is used instead.
       Production deployment should use
       server-side authentication and hashing.
    ========================================= */


    /* =========================================
       ELEMENTS
    ========================================= */

    const profileForm =
        document.getElementById("profileForm");


    const systemSettingsForm =
        document.getElementById("systemSettingsForm");


    if (
        !profileForm ||
        !systemSettingsForm
    ) {

        return;

    }


    const fullNameInput =
        document.getElementById("fullName");


    const profileEmailInput =
        document.getElementById("profileEmail");


    const profilePhoneInput =
        document.getElementById("profilePhone");


    const currentPasswordInput =
        document.getElementById("currentPassword");


    const newPasswordInput =
        document.getElementById("newPassword");


    const confirmPasswordInput =
        document.getElementById("confirmPassword");


    const profileDisplayName =
        document.getElementById("profileDisplayName");


    const profilePhotoInput =
        document.getElementById("profilePhotoInput");


    const avatarUploadButton =
        document.getElementById("avatarUploadButton");


    const profileAvatarImage =
        document.getElementById("profileAvatarImage");


    const profileAvatarFallback =
        document.getElementById("profileAvatarFallback");


    const topbarAvatar =
        document.getElementById("topbarAvatar");


    const topbarUserName =
        document.getElementById("topbarUserName");


    const riceMillNameInput =
        document.getElementById("riceMillName");


    const millDivisionSelect =
        document.getElementById("millDivision");


    const millDistrictSelect =
        document.getElementById("millDistrict");


    const millUpazilaSelect =
        document.getElementById("millUpazila");


    const detailedMillAddressInput =
        document.getElementById("detailedMillAddress");


    const millContactNumberInput =
        document.getElementById("millContactNumber");


    const defaultCurrencySelect =
        document.getElementById("defaultCurrency");


    const notificationPreferenceSelect =
        document.getElementById("notificationPreference");


    const locationStatus =
        document.getElementById("locationStatus");


    const sidebarMillName =
        document.getElementById("sidebarMillName");


    const menuButton =
        document.getElementById("menuButton");


    const sidebar =
        document.getElementById("sidebar");


    const sidebarBackdrop =
        document.getElementById("sidebarBackdrop");


    /* =========================================
       CONSTANTS
    ========================================= */

    const BD_API_BASE =
        "https://bdapis.com/api/v1.2";


    const DEFAULT_PROFILE = {

        fullName:
            "Admin User",

        email:
            "admin@ricemill.com",

        phone:
            "+880 1712 345678",

        role:
            "Rice Mill Owner",

        photo:
            ""

    };


    const DEFAULT_SETTINGS = {

        millName:
            "Smart Rice Mill",

        division:
            "Dhaka",

        district:
            "Kishoreganj",

        upazila:
            "Karimganj",

        detailedAddress:
            "",

        contactNumber:
            "+880 1712 345678",

        currency:
            "BDT",

        notificationPreference:
            "email-in-app"

    };


    /*
       Fallback only.
       Live BD API supplies the complete
       Bangladesh administrative dataset.
    */

    const FALLBACK_LOCATION_DATA = {

        Dhaka: {

            Kishoreganj: [

                "Austagram",
                "Bajitpur",
                "Bhairab",
                "Hossainpur",
                "Itna",
                "Karimganj",
                "Katiadi",
                "Kuliarchar",
                "Mithamain",
                "Nikli",
                "Pakundia",
                "Tarail"

            ]

        }

    };


    const FALLBACK_DIVISIONS = [

        "Barishal",
        "Chattogram",
        "Dhaka",
        "Khulna",
        "Mymensingh",
        "Rajshahi",
        "Rangpur",
        "Sylhet"

    ];


    /* =========================================
       STATE
    ========================================= */

    let profilePhotoData =
        "";


    let divisionLocationCache =
        {};


    /* =========================================
       STORAGE HELPER
    ========================================= */

    function safeParseStorage(
        key,
        fallback
    ) {

        try {

            const value =
                localStorage.getItem(key);


            if (
                value === null
            ) {

                return fallback;

            }


            return (
                JSON.parse(value) ??
                fallback
            );

        }
        catch {

            return fallback;

        }

    }


    /* =========================================
       LOAD PROFILE
    ========================================= */

    function loadProfile() {

        const stored =
            safeParseStorage(
                "adminProfile",
                {}
            );


        return {

            ...DEFAULT_PROFILE,
            ...stored

        };

    }


    /* =========================================
       LOAD SYSTEM SETTINGS
    ========================================= */

    function loadSettings() {

        const stored =
            safeParseStorage(
                "riceMillSettings",
                {}
            );


        const oldMillLocation =
            safeParseStorage(
                "millLocation",
                {}
            );


        return {

            ...DEFAULT_SETTINGS,
            ...stored,

            division:

                stored.division ||
                oldMillLocation.division ||
                DEFAULT_SETTINGS.division,


            district:

                stored.district ||
                oldMillLocation.district ||
                DEFAULT_SETTINGS.district,


            upazila:

                stored.upazila ||
                oldMillLocation.upazila ||
                DEFAULT_SETTINGS.upazila,


            detailedAddress:

                stored.detailedAddress ||
                oldMillLocation.detailedAddress ||
                DEFAULT_SETTINGS.detailedAddress

        };

    }


    let currentProfile =
        loadProfile();


    let currentSettings =
        loadSettings();


    /* =========================================
       SAFE HTML
    ========================================= */

    function escapeHTML(value) {

        const element =
            document.createElement("div");


        element.textContent =
            String(value ?? "");


        return element.innerHTML;

    }


    /* =========================================
       PHONE VALIDATION
    ========================================= */

    function normalizePhone(value) {

        return String(value || "")
            .replace(/[^\d+]/g, "")
            .trim();

    }


    function isValidBangladeshPhone(value) {

        const normalized =
            normalizePhone(value)
                .replace(/^\+/, "");


        return (

            /^01[3-9]\d{8}$/.test(
                normalized
            )

            ||

            /^8801[3-9]\d{8}$/.test(
                normalized
            )

        );

    }


    /* =========================================
       EMAIL VALIDATION
    ========================================= */

    function isValidEmail(value) {

        return (
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(
                    String(value)
                        .trim()
                )
        );

    }


    /* =========================================
       DISPLAY PROFILE
    ========================================= */

    function renderProfile() {

        fullNameInput.value =
            currentProfile.fullName;


        profileEmailInput.value =
            currentProfile.email;


        profilePhoneInput.value =
            currentProfile.phone;


        profileDisplayName.textContent =
            currentProfile.fullName;


        topbarUserName.textContent =
            currentProfile.fullName;


        profilePhotoData =
            currentProfile.photo || "";


        renderProfilePhoto();

    }


    /* =========================================
       PROFILE PHOTO
    ========================================= */

    function renderProfilePhoto() {

        if (
            profilePhotoData
        ) {

            profileAvatarImage.src =
                profilePhotoData;


            profileAvatarImage.hidden =
                false;


            profileAvatarFallback.hidden =
                true;


            if (
                topbarAvatar
            ) {

                topbarAvatar.textContent =
                    "";


                topbarAvatar.classList.add(
                    "has-profile-photo"
                );


                topbarAvatar.style.backgroundImage =
                    `url("${profilePhotoData}")`;

            }

        }
        else {

            profileAvatarImage.hidden =
                true;


            profileAvatarFallback.hidden =
                false;


            if (
                topbarAvatar
            ) {

                topbarAvatar.classList.remove(
                    "has-profile-photo"
                );


                topbarAvatar.style.backgroundImage =
                    "";


                topbarAvatar.textContent =
                    "👤";

            }

        }

    }


    avatarUploadButton.addEventListener(
        "click",
        function () {

            profilePhotoInput.click();

        }
    );


    profilePhotoInput.addEventListener(
        "change",
        function () {

            const file =
                profilePhotoInput.files[0];


            if (!file) {
                return;
            }


            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                showToast(
                    "Please select a valid image file.",
                    "error"
                );


                profilePhotoInput.value =
                    "";


                return;

            }


            if (
                file.size >
                2 * 1024 * 1024
            ) {

                showToast(
                    "Profile image must be smaller than 2 MB.",
                    "error"
                );


                profilePhotoInput.value =
                    "";


                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    profilePhotoData =
                        event.target.result;


                    renderProfilePhoto();


                    showToast(
                        "Profile photo selected. Click Update Profile to save it."
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );


    /* =========================================
       PASSWORD VISIBILITY
    ========================================= */

    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    "[data-password-target]"
                );


            if (!button) {
                return;
            }


            const input =
                document.getElementById(
                    button.dataset.passwordTarget
                );


            if (!input) {
                return;
            }


            const showing =
                input.type ===
                "text";


            input.type =
                showing
                    ? "password"
                    : "text";


            button.textContent =
                showing
                    ? "◉"
                    : "◎";

        }
    );


    /* =========================================
       SHA-256
    ========================================= */

    async function sha256(value) {

        const encoded =
            new TextEncoder()
                .encode(value);


        const buffer =
            await crypto.subtle.digest(
                "SHA-256",
                encoded
            );


        return Array
            .from(
                new Uint8Array(buffer)
            )
            .map(
                byte =>
                    byte
                        .toString(16)
                        .padStart(2, "0")
            )
            .join("");

    }


    /* =========================================
       PASSWORD CHANGE
    ========================================= */

    async function processPasswordChange() {

        const currentPassword =
            currentPasswordInput.value;


        const newPassword =
            newPasswordInput.value;


        const confirmPassword =
            confirmPasswordInput.value;


        const passwordChangeRequested =

            currentPassword.length > 0 ||
            newPassword.length > 0 ||
            confirmPassword.length > 0;


        if (
            !passwordChangeRequested
        ) {

            return {
                ok: true,
                changed: false
            };

        }


        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {

            return {

                ok: false,

                message:
                    "Enter Current Password, New Password and Confirm Password to change the password."

            };

        }


        if (
            newPassword.length < 6
        ) {

            return {

                ok: false,

                message:
                    "New password must contain at least 6 characters."

            };

        }


        if (
            newPassword !==
            confirmPassword
        ) {

            return {

                ok: false,

                message:
                    "New Password and Confirm Password do not match."

            };

        }


        if (
            currentPassword ===
            newPassword
        ) {

            return {

                ok: false,

                message:
                    "New password must be different from the current password."

            };

        }


        /*
           Prototype credential hash.

           If the user never changed the password,
           the original demo password is 123456.

           Only its SHA-256 hash is compared.
        */

        const storedHash =
            localStorage.getItem(
                "smartRiceMillAdminPasswordHash"
            );


        const expectedHash =

            storedHash ||

            await sha256(
                "123456"
            );


        const enteredCurrentHash =
            await sha256(
                currentPassword
            );


        if (
            enteredCurrentHash !==
            expectedHash
        ) {

            return {

                ok: false,

                message:
                    "Current password is incorrect."

            };

        }


        const newHash =
            await sha256(
                newPassword
            );


        localStorage.setItem(
            "smartRiceMillAdminPasswordHash",
            newHash
        );


        localStorage.setItem(
            "smartRiceMillAdminEmail",
            profileEmailInput.value
                .trim()
                .toLowerCase()
        );


        return {
            ok: true,
            changed: true
        };

    }


    /* =========================================
       PROFILE FORM
    ========================================= */

    profileForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const fullName =
                fullNameInput.value
                    .trim();


            const email =
                profileEmailInput.value
                    .trim()
                    .toLowerCase();


            const phone =
                profilePhoneInput.value
                    .trim();


            if (
                fullName.length < 2
            ) {

                showToast(
                    "Please enter a valid full name.",
                    "error"
                );


                return;

            }


            if (
                !isValidEmail(email)
            ) {

                showToast(
                    "Please enter a valid email address.",
                    "error"
                );


                return;

            }


            if (
                !isValidBangladeshPhone(
                    phone
                )
            ) {

                showToast(
                    "Please enter a valid Bangladesh phone number.",
                    "error"
                );


                return;

            }


            const passwordResult =
                await processPasswordChange();


            if (
                !passwordResult.ok
            ) {

                showToast(
                    passwordResult.message,
                    "error"
                );


                return;

            }


            currentProfile = {

                fullName:
                    fullName,

                email:
                    email,

                phone:
                    phone,

                role:
                    "Rice Mill Owner",

                photo:
                    profilePhotoData,

                updatedAt:
                    new Date().toISOString()

            };


            localStorage.setItem(
                "adminProfile",
                JSON.stringify(
                    currentProfile
                )
            );


            /*
               Compatibility keys for other pages.
            */

            localStorage.setItem(
                "currentUserProfile",
                JSON.stringify(
                    currentProfile
                )
            );


            localStorage.setItem(
                "smartRiceMillAdminEmail",
                email
            );


            profileDisplayName.textContent =
                fullName;


            topbarUserName.textContent =
                fullName;


            renderProfilePhoto();


            /*
               Password inputs ALWAYS clear.
            */

            currentPasswordInput.value =
                "";


            newPasswordInput.value =
                "";


            confirmPasswordInput.value =
                "";


            showToast(

                passwordResult.changed

                    ?

                    "Profile and password updated successfully."

                    :

                    "Profile updated successfully."

            );

        }
    );


    /* =========================================
       LOCATION API
    ========================================= */

    async function fetchJSON(url) {

        const response =
            await fetch(
                url,
                {
                    method: "GET",
                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );


        if (
            !response.ok
        ) {

            throw new Error(
                `Location API returned ${response.status}`
            );

        }


        return response.json();

    }


    /* =========================================
       DIVISION OPTIONS
    ========================================= */

    function populateDivisionOptions(
        divisions,
        selectedDivision = ""
    ) {

        millDivisionSelect.innerHTML = `

            <option value="">
                Select division
            </option>

        `;


        divisions.forEach(
            function (division) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    division;


                option.textContent =
                    division;


                millDivisionSelect.appendChild(
                    option
                );

            }
        );


        if (
            selectedDivision &&
            divisions.includes(
                selectedDivision
            )
        ) {

            millDivisionSelect.value =
                selectedDivision;

        }

    }


    /* =========================================
       LOAD DIVISIONS
    ========================================= */

    async function loadDivisions(
        selectedDivision = ""
    ) {

        try {

            const result =
                await fetchJSON(
                    `${BD_API_BASE}/divisions`
                );


            const divisions =
                Array.isArray(result.data)

                    ?

                    result.data
                        .map(
                            item =>
                                item.division
                        )
                        .filter(Boolean)

                    :

                    [];


            if (
                divisions.length === 0
            ) {

                throw new Error(
                    "No divisions returned."
                );

            }


            populateDivisionOptions(
                divisions,
                selectedDivision
            );


            return true;

        }
        catch (error) {

            populateDivisionOptions(
                FALLBACK_DIVISIONS,
                selectedDivision
            );


            locationStatus.classList.add(
                "error"
            );


            locationStatus.textContent =
                "Live location service is unavailable. Saved mill location remains available.";


            return false;

        }

    }


    /* =========================================
       LOAD DISTRICTS
    ========================================= */

    async function loadDistricts(
        division,
        selectedDistrict = ""
    ) {

        millDistrictSelect.disabled =
            true;


        millUpazilaSelect.disabled =
            true;


        millDistrictSelect.innerHTML = `

            <option value="">
                Loading districts...
            </option>

        `;


        millUpazilaSelect.innerHTML = `

            <option value="">
                Select district first
            </option>

        `;


        if (!division) {

            millDistrictSelect.innerHTML = `

                <option value="">
                    Select division first
                </option>

            `;


            return;

        }


        try {

            let districtRecords =
                divisionLocationCache[
                    division
                ];


            if (
                !Array.isArray(
                    districtRecords
                )
            ) {

                const result =
                    await fetchJSON(

                        `${BD_API_BASE}/division/${encodeURIComponent(
                            division.toLowerCase()
                        )}`

                    );


                districtRecords =
                    Array.isArray(result.data)
                        ? result.data
                        : [];


                divisionLocationCache[
                    division
                ] =
                    districtRecords;

            }


            if (
                districtRecords.length === 0
            ) {

                throw new Error(
                    "No districts returned."
                );

            }


            millDistrictSelect.innerHTML = `

                <option value="">
                    Select district
                </option>

            `;


            districtRecords.forEach(
                function (record) {

                    const district =
                        record.district;


                    if (!district) {
                        return;
                    }


                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        district;


                    option.textContent =
                        district;


                    millDistrictSelect.appendChild(
                        option
                    );

                }
            );


            millDistrictSelect.disabled =
                false;


            if (
                selectedDistrict
            ) {

                const exists =
                    Array
                        .from(
                            millDistrictSelect.options
                        )
                        .some(
                            option =>
                                option.value ===
                                selectedDistrict
                        );


                if (exists) {

                    millDistrictSelect.value =
                        selectedDistrict;

                }

            }


            return true;

        }
        catch (error) {

            const fallbackDistricts =
                Object.keys(
                    FALLBACK_LOCATION_DATA[
                        division
                    ] || {}
                );


            millDistrictSelect.innerHTML = `

                <option value="">
                    Select district
                </option>

            `;


            fallbackDistricts.forEach(
                function (district) {

                    const option =
                        new Option(
                            district,
                            district
                        );


                    millDistrictSelect.add(
                        option
                    );

                }
            );


            if (
                selectedDistrict &&
                !fallbackDistricts.includes(
                    selectedDistrict
                )
            ) {

                millDistrictSelect.add(
                    new Option(
                        selectedDistrict,
                        selectedDistrict
                    )
                );

            }


            if (
                selectedDistrict
            ) {

                millDistrictSelect.value =
                    selectedDistrict;

            }


            millDistrictSelect.disabled =
                false;


            return false;

        }

    }


    /* =========================================
       LOAD UPAZILAS
    ========================================= */

    async function loadUpazilas(
        division,
        district,
        selectedUpazila = ""
    ) {

        millUpazilaSelect.disabled =
            true;


        millUpazilaSelect.innerHTML = `

            <option value="">
                Loading upazilas...
            </option>

        `;


        if (
            !division ||
            !district
        ) {

            millUpazilaSelect.innerHTML = `

                <option value="">
                    Select district first
                </option>

            `;


            return;

        }


        try {

            let upazilas =
                [];


            const cachedRecords =
                divisionLocationCache[
                    division
                ];


            if (
                Array.isArray(
                    cachedRecords
                )
            ) {

                const districtRecord =
                    cachedRecords.find(
                        item =>
                            item.district ===
                            district
                    );


                if (
                    districtRecord &&
                    Array.isArray(
                        districtRecord.upazilla
                    )
                ) {

                    upazilas =
                        districtRecord.upazilla;

                }

            }


            if (
                upazilas.length === 0
            ) {

                const result =
                    await fetchJSON(

                        `${BD_API_BASE}/district/${encodeURIComponent(
                            district.toLowerCase()
                        )}`

                    );


                const data =
                    result.data;


                if (
                    Array.isArray(data)
                ) {

                    /*
                       API variants may return
                       district object inside array.
                    */

                    data.forEach(
                        function (item) {

                            if (
                                Array.isArray(
                                    item.upazilla
                                )
                            ) {

                                upazilas.push(
                                    ...item.upazilla
                                );

                            }
                            else if (
                                typeof item ===
                                "string"
                            ) {

                                upazilas.push(
                                    item
                                );

                            }

                        }
                    );

                }
                else if (
                    data &&
                    Array.isArray(
                        data.upazilla
                    )
                ) {

                    upazilas =
                        data.upazilla;

                }

            }


            upazilas = [

                ...new Set(
                    upazilas
                        .filter(Boolean)
                )

            ];


            if (
                upazilas.length === 0
            ) {

                throw new Error(
                    "No upazilas returned."
                );

            }


            populateUpazilaOptions(
                upazilas,
                selectedUpazila
            );


            return true;

        }
        catch (error) {

            let fallbackUpazilas =

                FALLBACK_LOCATION_DATA[
                    division
                ]?.[
                    district
                ]

                || [];


            fallbackUpazilas = [
                ...fallbackUpazilas
            ];


            if (
                selectedUpazila &&
                !fallbackUpazilas.includes(
                    selectedUpazila
                )
            ) {

                fallbackUpazilas.push(
                    selectedUpazila
                );

            }


            populateUpazilaOptions(
                fallbackUpazilas,
                selectedUpazila
            );


            return false;

        }

    }


    function populateUpazilaOptions(
        upazilas,
        selectedUpazila
    ) {

        millUpazilaSelect.innerHTML = `

            <option value="">
                Select upazila
            </option>

        `;


        upazilas.forEach(
            function (upazila) {

                const option =
                    new Option(
                        upazila,
                        upazila
                    );


                millUpazilaSelect.add(
                    option
                );

            }
        );


        millUpazilaSelect.disabled =
            false;


        if (
            selectedUpazila
        ) {

            const exists =
                Array
                    .from(
                        millUpazilaSelect.options
                    )
                    .some(
                        option =>
                            option.value ===
                            selectedUpazila
                    );


            if (
                !exists
            ) {

                millUpazilaSelect.add(
                    new Option(
                        selectedUpazila,
                        selectedUpazila
                    )
                );

            }


            millUpazilaSelect.value =
                selectedUpazila;

        }

    }


    /* =========================================
       LOCATION EVENTS
    ========================================= */

    millDivisionSelect.addEventListener(
        "change",
        async function () {

            await loadDistricts(
                millDivisionSelect.value
            );


            updateLocationStatus();

        }
    );


    millDistrictSelect.addEventListener(
        "change",
        async function () {

            await loadUpazilas(
                millDivisionSelect.value,
                millDistrictSelect.value
            );


            updateLocationStatus();

        }
    );


    millUpazilaSelect.addEventListener(
        "change",
        updateLocationStatus
    );


    /* =========================================
       LOCATION STATUS
    ========================================= */

    function updateLocationStatus() {

        const division =
            millDivisionSelect.value;


        const district =
            millDistrictSelect.value;


        const upazila =
            millUpazilaSelect.value;


        if (
            division &&
            district &&
            upazila
        ) {

            locationStatus.classList.remove(
                "error"
            );


            locationStatus.textContent =

                `${upazila}, ${district}, ${division} loaded as the current mill location.`;


            return;

        }


        locationStatus.textContent =
            "Select Division, District and Upazila.";

    }


    /* =========================================
       INITIALIZE LOCATION
    ========================================= */

    async function initializeLocation() {

        locationStatus.classList.remove(
            "error"
        );


        locationStatus.textContent =
            "Loading Bangladesh location data...";


        await loadDivisions(
            currentSettings.division
        );


        await loadDistricts(
            currentSettings.division,
            currentSettings.district
        );


        await loadUpazilas(
            currentSettings.division,
            currentSettings.district,
            currentSettings.upazila
        );


        updateLocationStatus();

    }


    /* =========================================
       RENDER SETTINGS
    ========================================= */

    function renderSettings() {

        riceMillNameInput.value =
            currentSettings.millName;


        detailedMillAddressInput.value =
            currentSettings.detailedAddress;


        millContactNumberInput.value =
            currentSettings.contactNumber;


        defaultCurrencySelect.value =
            currentSettings.currency;


        notificationPreferenceSelect.value =
            currentSettings.notificationPreference;


        sidebarMillName.textContent =
            currentSettings.millName;

    }


    /* =========================================
       SETTINGS VALIDATION
    ========================================= */

    function validateSettings() {

        const millName =
            riceMillNameInput.value
                .trim();


        if (
            millName.length < 2
        ) {

            return (
                "Please enter a valid rice mill name."
            );

        }


        if (
            !millDivisionSelect.value
        ) {

            return (
                "Please select the rice mill division."
            );

        }


        if (
            !millDistrictSelect.value
        ) {

            return (
                "Please select the rice mill district."
            );

        }


        if (
            !millUpazilaSelect.value
        ) {

            return (
                "Please select the rice mill upazila."
            );

        }


        if (
            !isValidBangladeshPhone(
                millContactNumberInput.value
            )
        ) {

            return (
                "Please enter a valid rice mill contact number."
            );

        }


        return "";

    }


    /* =========================================
       SAVE SYSTEM SETTINGS
    ========================================= */

    systemSettingsForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const error =
                validateSettings();


            if (error) {

                showToast(
                    error,
                    "error"
                );


                return;

            }


            const division =
                millDivisionSelect.value;


            const district =
                millDistrictSelect.value;


            const upazila =
                millUpazilaSelect.value;


            const detailedAddress =
                detailedMillAddressInput.value
                    .trim();


            const locationDisplayName =

                `${upazila}, ${district}, ${division}`;


            const locationQuery =

                detailedAddress

                    ?

                    `${detailedAddress}, ${upazila}, ${district}, ${division}, Bangladesh`

                    :

                    `${upazila}, ${district}, ${division}, Bangladesh`;


            currentSettings = {

                millName:
                    riceMillNameInput.value
                        .trim(),

                division:
                    division,

                district:
                    district,

                upazila:
                    upazila,

                detailedAddress:
                    detailedAddress,

                contactNumber:
                    millContactNumberInput.value
                        .trim(),

                currency:
                    defaultCurrencySelect.value,

                notificationPreference:
                    notificationPreferenceSelect.value,

                locationDisplayName:
                    locationDisplayName,

                locationQuery:
                    locationQuery,

                updatedAt:
                    new Date().toISOString()

            };


            localStorage.setItem(
                "riceMillSettings",
                JSON.stringify(
                    currentSettings
                )
            );


            /*
               Cross-module location key.

               Delivery should use this as its
               configured starting point.
            */

            const millLocation = {

                division:
                    division,

                district:
                    district,

                upazila:
                    upazila,

                detailedAddress:
                    detailedAddress,

                displayName:
                    locationDisplayName,

                query:
                    locationQuery,

                country:
                    "Bangladesh",

                source:
                    "System Settings",

                updatedAt:
                    new Date().toISOString()

            };


            localStorage.setItem(
                "millLocation",
                JSON.stringify(
                    millLocation
                )
            );


            /*
               Additional compatibility keys.
            */

            localStorage.setItem(
                "systemSettings",
                JSON.stringify(
                    currentSettings
                )
            );


            localStorage.setItem(
                "riceMillName",
                currentSettings.millName
            );


            sidebarMillName.textContent =
                currentSettings.millName;


            updateLocationStatus();


            showToast(
                "System settings saved successfully."
            );

        }
    );


    /* =========================================
       TOAST
    ========================================= */

    function showToast(
        message,
        type = "success"
    ) {

        const oldToast =
            document.querySelector(
                ".settings-toast"
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
            `settings-toast ${type}`;


        toast.innerHTML = `

            <span class="settings-toast-icon">

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
       SIDEBAR
    ========================================= */

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
    ========================================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Escape"
            ) {

                closeSidebar();

            }

        }
    );


    /* =========================================
       INITIALIZE
    ========================================= */

    /*
       Password inputs are intentionally blank.
    */

    currentPasswordInput.value =
        "";


    newPasswordInput.value =
        "";


    confirmPasswordInput.value =
        "";


    renderProfile();

    renderSettings();

    initializeLocation();

});