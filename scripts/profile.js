document.addEventListener(
    "DOMContentLoaded",
    async function () {

        // ==========================================
        // PROFILE ELEMENTS
        // ==========================================

        const profileInformationForm =
            document.getElementById(
                "profileInformationForm"
            );

        const profileFullName =
            document.getElementById(
                "profile-full-name"
            );

        const profileEmail =
            document.getElementById(
                "profile-email"
            );

        const profilePhone =
            document.getElementById(
                "profile-phone"
            );

        const currentPassword =
            document.getElementById(
                "current-password"
            );

        const newPassword =
            document.getElementById(
                "new-password"
            );

        const confirmPassword =
            document.getElementById(
                "confirm-password"
            );

        const profileDisplayName =
            document.getElementById(
                "profileDisplayName"
            );

        const topbarProfileName =
            document.getElementById(
                "topbarProfileName"
            );

        const profileCameraButton =
            document.getElementById(
                "profileCameraButton"
            );


        // ==========================================
        // SYSTEM SETTINGS ELEMENTS
        // ==========================================

        const systemSettingsForm =
            document.getElementById(
                "systemSettingsForm"
            );

        const riceMillName =
            document.getElementById(
                "rice-mill-name"
            );

        const riceMillAddress =
            document.getElementById(
                "rice-mill-address"
            );

        const riceMillContact =
            document.getElementById(
                "rice-mill-contact"
            );

        const defaultCurrency =
            document.getElementById(
                "default-currency"
            );

        const notificationPreference =
            document.getElementById(
                "notification-preference"
            );


        // ==========================================
        // LOCATION ELEMENTS
        // ==========================================

        const millDivisionSelect =
            document.getElementById(
                "mill-division"
            );

        const millDistrictSelect =
            document.getElementById(
                "mill-district"
            );

        const millUpazilaSelect =
            document.getElementById(
                "mill-upazila"
            );

        const millLocationMessage =
            document.getElementById(
                "millLocationMessage"
            );


        // ==========================================
        // STATE
        // ==========================================

        let locationServiceReady =
            false;


        // ==========================================
        // SAFE TEXT
        // ==========================================

        function escapeHTML(
            value
        ) {

            const element =
                document.createElement(
                    "div"
                );


            element.textContent =
                String(
                    value ?? ""
                );


            return element.innerHTML;

        }


        // ==========================================
        // TOAST
        // ==========================================

        function showToast(
            message,
            type = "success"
        ) {

            const oldToast =
                document.querySelector(
                    ".profile-toast"
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
                "profile-toast " +
                type;


            toast.innerHTML = `

                <span class="toast-icon">

                    ${
                        type ===
                        "success"
                            ? "✓"
                            : "!"
                    }

                </span>

                <span>

                    ${escapeHTML(
                        message
                    )}

                </span>

            `;


            document.body
                .appendChild(
                    toast
                );


            setTimeout(
                function () {

                    toast.classList
                        .add(
                            "show"
                        );

                },
                50
            );


            setTimeout(
                function () {

                    toast.classList
                        .remove(
                            "show"
                        );


                    setTimeout(
                        function () {

                            toast.remove();

                        },
                        300
                    );

                },
                2500
            );

        }


        // ==========================================
        // LOCATION MESSAGE
        // ==========================================

        function setLocationMessage(
            message,
            type = "info"
        ) {

            millLocationMessage
                .textContent =
                message;


            millLocationMessage
                .className =
                "mill-location-message " +
                type;

        }


        // ==========================================
        // LOAD PROFILE
        // ==========================================

        function loadProfile() {

            const savedProfile =
                JSON.parse(
                    localStorage.getItem(
                        "riceMillProfile"
                    ) ||
                    "{}"
                );


            profileFullName.value =
                savedProfile.fullName ||
                "Admin User";


            profileEmail.value =
                savedProfile.email ||
                "admin@ricemill.com";


            profilePhone.value =
                savedProfile.phone ||
                "+880 1712 345678";


            updateProfileDisplay();

        }


        // ==========================================
        // UPDATE PROFILE DISPLAY
        // ==========================================

        function updateProfileDisplay() {

            const name =
                profileFullName
                    .value
                    .trim() ||
                "Admin User";


            profileDisplayName
                .textContent =
                name;


            topbarProfileName
                .textContent =
                name;

        }


        // ==========================================
        // PROFILE SUBMIT
        // ==========================================

        profileInformationForm
            .addEventListener(
                "submit",
                function (
                    event
                ) {

                    event.preventDefault();


                    const fullName =
                        profileFullName
                            .value
                            .trim();


                    const email =
                        profileEmail
                            .value
                            .trim();


                    const phone =
                        profilePhone
                            .value
                            .trim();


                    if (
                        !fullName ||
                        !email ||
                        !phone
                    ) {

                        showToast(
                            "Please complete the profile information.",
                            "error"
                        );

                        return;

                    }


                    // ==================================
                    // PASSWORD FIELD VALIDATION
                    // ==================================

                    if (
                        newPassword.value ||
                        confirmPassword.value
                    ) {

                        if (
                            newPassword.value !==
                            confirmPassword.value
                        ) {

                            showToast(
                                "New password and confirm password do not match.",
                                "error"
                            );

                            return;

                        }


                        if (
                            newPassword.value.length <
                            6
                        ) {

                            showToast(
                                "New password must contain at least 6 characters.",
                                "error"
                            );

                            return;

                        }

                    }


                    // ==================================
                    // SAVE PROFILE DETAILS
                    // ==================================

                    const profileData = {

                        fullName:
                            fullName,

                        email:
                            email,

                        phone:
                            phone

                    };


                    localStorage.setItem(
                        "riceMillProfile",
                        JSON.stringify(
                            profileData
                        )
                    );


                    updateProfileDisplay();


                    // Password inputs are not stored
                    // in localStorage for security.

                    currentPassword.value =
                        "";

                    newPassword.value =
                        "";

                    confirmPassword.value =
                        "";


                    showToast(
                        "Profile information updated successfully!"
                    );

                }
            );


        // ==========================================
        // CAMERA BUTTON
        // ==========================================

        profileCameraButton
            .addEventListener(
                "click",
                function () {

                    showToast(
                        "Profile picture upload is not included in the current prototype.",
                        "error"
                    );

                }
            );


        // ==========================================
        // GET RICE MILL SETTINGS
        // ==========================================

        function getRiceMillSettings() {

            try {

                return JSON.parse(
                    localStorage.getItem(
                        "riceMillSettings"
                    ) ||
                    "{}"
                );

            } catch (
                error
            ) {

                console.error(
                    "Rice mill settings could not be parsed:",
                    error
                );


                return {};

            }

        }


        // ==========================================
        // SORT LOCATION DATA
        // ==========================================

        function sortLocations(
            items
        ) {

            return [
                ...items
            ].sort(
                function (
                    first,
                    second
                ) {

                    const firstName =
                        window
                            .BDLocations
                            .getName(
                                first
                            );


                    const secondName =
                        window
                            .BDLocations
                            .getName(
                                second
                            );


                    return firstName
                        .localeCompare(
                            secondName
                        );

                }
            );

        }


        // ==========================================
        // LOAD DIVISIONS
        // ==========================================

        function loadDivisionDropdown(
            selectedId = ""
        ) {

            millDivisionSelect
                .innerHTML = `

                    <option
                        value=""
                        disabled
                        ${
                            selectedId
                                ? ""
                                : "selected"
                        }
                    >
                        Select division
                    </option>

                `;


            const divisions =
                sortLocations(
                    window
                        .BDLocations
                        .getDivisions()
                );


            divisions.forEach(
                function (
                    division
                ) {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        division.id;


                    option.textContent =
                        window
                            .BDLocations
                            .getName(
                                division
                            );


                    if (
                        String(
                            division.id
                        ) ===
                        String(
                            selectedId
                        )
                    ) {

                        option.selected =
                            true;

                    }


                    millDivisionSelect
                        .appendChild(
                            option
                        );

                }
            );

        }


        // ==========================================
        // LOAD DISTRICTS
        // ==========================================

        function loadDistrictDropdown(
            divisionId,
            selectedId = ""
        ) {

            millDistrictSelect
                .innerHTML = `

                    <option
                        value=""
                        disabled
                        ${
                            selectedId
                                ? ""
                                : "selected"
                        }
                    >
                        Select district
                    </option>

                `;


            millUpazilaSelect
                .innerHTML = `

                    <option
                        value=""
                        selected
                        disabled
                    >
                        Select upazila
                    </option>

                `;


            millUpazilaSelect
                .disabled =
                true;


            if (
                !divisionId
            ) {

                millDistrictSelect
                    .disabled =
                    true;

                return;

            }


            const districts =
                sortLocations(
                    window
                        .BDLocations
                        .getDistrictsByDivision(
                            divisionId
                        )
                );


            districts.forEach(
                function (
                    district
                ) {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        district.id;


                    option.textContent =
                        window
                            .BDLocations
                            .getName(
                                district
                            );


                    if (
                        String(
                            district.id
                        ) ===
                        String(
                            selectedId
                        )
                    ) {

                        option.selected =
                            true;

                    }


                    millDistrictSelect
                        .appendChild(
                            option
                        );

                }
            );


            millDistrictSelect
                .disabled =
                false;

        }


        // ==========================================
        // LOAD UPAZILAS
        // ==========================================

        function loadUpazilaDropdown(
            districtId,
            selectedId = ""
        ) {

            millUpazilaSelect
                .innerHTML = `

                    <option
                        value=""
                        disabled
                        ${
                            selectedId
                                ? ""
                                : "selected"
                        }
                    >
                        Select upazila
                    </option>

                `;


            if (
                !districtId
            ) {

                millUpazilaSelect
                    .disabled =
                    true;

                return;

            }


            const upazilas =
                sortLocations(
                    window
                        .BDLocations
                        .getUpazilasByDistrict(
                            districtId
                        )
                );


            upazilas.forEach(
                function (
                    upazila
                ) {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        upazila.id;


                    option.textContent =
                        window
                            .BDLocations
                            .getName(
                                upazila
                            );


                    if (
                        String(
                            upazila.id
                        ) ===
                        String(
                            selectedId
                        )
                    ) {

                        option.selected =
                            true;

                    }


                    millUpazilaSelect
                        .appendChild(
                            option
                        );

                }
            );


            millUpazilaSelect
                .disabled =
                false;

        }


        // ==========================================
        // SELECT DEFAULT MILL LOCATION
        // ==========================================

        function loadDefaultMillLocation() {

            const division =
                window
                    .BDLocations
                    .findDivisionByName(
                        "Dhaka"
                    );


            if (
                !division
            ) {

                return;

            }


            const district =
                window
                    .BDLocations
                    .findDistrictByName(
                        "Kishoreganj",
                        division.id
                    );


            if (
                !district
            ) {

                return;

            }


            const upazila =
                window
                    .BDLocations
                    .findUpazilaByName(
                        "Karimganj",
                        district.id
                    );


            if (
                !upazila
            ) {

                return;

            }


            loadDivisionDropdown(
                division.id
            );


            millDivisionSelect
                .disabled =
                false;


            loadDistrictDropdown(
                division.id,
                district.id
            );


            loadUpazilaDropdown(
                district.id,
                upazila.id
            );


            setLocationMessage(
                "Default location loaded: Karimganj, Kishoreganj, Dhaka.",
                "success"
            );

        }


        // ==========================================
        // LOAD SAVED SETTINGS
        // ==========================================

        function loadSavedSettings() {

            const settings =
                getRiceMillSettings();


            riceMillName.value =
                settings.riceMillName ||
                "Smart Rice Mill";


            riceMillAddress.value =
                settings.address ||
                settings.riceMillAddress ||
                "";


            riceMillContact.value =
                settings.contact ||
                settings.riceMillContact ||
                "+880 1712 345678";


            defaultCurrency.value =
                settings.currency ||
                settings.defaultCurrency ||
                "BDT";


            notificationPreference.value =
                settings.notificationPreference ||
                "email-in-app";


            // ======================================
            // Saved structured mill location
            // ======================================

            if (
                settings.location &&
                settings.location.divisionId &&
                settings.location.districtId &&
                settings.location.upazilaId
            ) {

                const division =
                    window
                        .BDLocations
                        .findDivisionById(
                            settings.location
                                .divisionId
                        );


                const district =
                    window
                        .BDLocations
                        .findDistrictById(
                            settings.location
                                .districtId
                        );


                const upazila =
                    window
                        .BDLocations
                        .findUpazilaById(
                            settings.location
                                .upazilaId
                        );


                if (
                    division &&
                    district &&
                    upazila
                ) {

                    loadDivisionDropdown(
                        division.id
                    );


                    millDivisionSelect
                        .disabled =
                        false;


                    loadDistrictDropdown(
                        division.id,
                        district.id
                    );


                    loadUpazilaDropdown(
                        district.id,
                        upazila.id
                    );


                    setLocationMessage(
                        window
                            .BDLocations
                            .getName(
                                upazila
                            ) +
                        ", " +
                        window
                            .BDLocations
                            .getName(
                                district
                            ) +
                        ", " +
                        window
                            .BDLocations
                            .getName(
                                division
                            ) +
                        " loaded as the current mill location.",
                        "success"
                    );


                    return;

                }

            }


            loadDefaultMillLocation();

        }


        // ==========================================
        // INITIALIZE LOCATION SERVICE
        // ==========================================

        async function
            initializeLocationService() {

            millDivisionSelect
                .disabled =
                true;

            millDistrictSelect
                .disabled =
                true;

            millUpazilaSelect
                .disabled =
                true;


            setLocationMessage(
                "Loading Bangladesh location data...",
                "info"
            );


            if (
                !window.BDLocations
            ) {

                setLocationMessage(
                    "Bangladesh location service could not be loaded.",
                    "error"
                );


                showToast(
                    "Location service could not be loaded.",
                    "error"
                );


                return;

            }


            try {

                const loaded =
                    await window
                        .BDLocations
                        .init();


                if (
                    loaded === false
                ) {

                    throw new Error(
                        "Location service returned false."
                    );

                }


                locationServiceReady =
                    true;


                millDivisionSelect
                    .disabled =
                    false;


                loadSavedSettings();

            } catch (
                error
            ) {

                console.error(
                    "Location service error:",
                    error
                );


                setLocationMessage(
                    "Bangladesh location data could not be loaded.",
                    "error"
                );


                showToast(
                    "Bangladesh location data could not be loaded.",
                    "error"
                );

            }

        }


        // ==========================================
        // DIVISION CHANGE
        // ==========================================

        millDivisionSelect
            .addEventListener(
                "change",
                function () {

                    loadDistrictDropdown(
                        millDivisionSelect
                            .value
                    );


                    setLocationMessage(
                        "Division selected. Now select the district.",
                        "info"
                    );

                }
            );


        // ==========================================
        // DISTRICT CHANGE
        // ==========================================

        millDistrictSelect
            .addEventListener(
                "change",
                function () {

                    loadUpazilaDropdown(
                        millDistrictSelect
                            .value
                    );


                    setLocationMessage(
                        "District selected. Now select the upazila.",
                        "info"
                    );

                }
            );


        // ==========================================
        // GET SELECTED LOCATION
        // ==========================================

        function getSelectedLocation() {

            if (
                !locationServiceReady
            ) {

                return null;

            }


            const division =
                window
                    .BDLocations
                    .findDivisionById(
                        millDivisionSelect
                            .value
                    );


            const district =
                window
                    .BDLocations
                    .findDistrictById(
                        millDistrictSelect
                            .value
                    );


            const upazila =
                window
                    .BDLocations
                    .findUpazilaById(
                        millUpazilaSelect
                            .value
                    );


            if (
                !division ||
                !district ||
                !upazila
            ) {

                return null;

            }


            const coordinates =
                window
                    .BDLocations
                    .getCoordinates(
                        upazila
                    );


            return {

                divisionId:
                    division.id,

                divisionName:
                    window
                        .BDLocations
                        .getName(
                            division
                        ),

                districtId:
                    district.id,

                districtName:
                    window
                        .BDLocations
                        .getName(
                            district
                        ),

                upazilaId:
                    upazila.id,

                upazilaName:
                    window
                        .BDLocations
                        .getName(
                            upazila
                        ),

                lat:
                    coordinates
                        ? Number(
                            coordinates.lat
                        )
                        : null,

                lng:
                    coordinates
                        ? Number(
                            coordinates.lng
                        )
                        : null

            };

        }


        // ==========================================
        // UPAZILA CHANGE
        // ==========================================

        millUpazilaSelect
            .addEventListener(
                "change",
                function () {

                    const location =
                        getSelectedLocation();


                    if (
                        !location
                    ) {

                        return;

                    }


                    setLocationMessage(
                        location.upazilaName +
                        ", " +
                        location.districtName +
                        ", " +
                        location.divisionName +
                        " selected as the mill location.",
                        "success"
                    );

                }
            );


        // ==========================================
        // SAVE SYSTEM SETTINGS
        // ==========================================

        systemSettingsForm
            .addEventListener(
                "submit",
                function (
                    event
                ) {

                    event.preventDefault();


                    if (
                        !locationServiceReady
                    ) {

                        showToast(
                            "Location data is not ready yet.",
                            "error"
                        );

                        return;

                    }


                    const location =
                        getSelectedLocation();


                    if (
                        !location
                    ) {

                        showToast(
                            "Please select Division, District and Upazila.",
                            "error"
                        );

                        return;

                    }


                    const millName =
                        riceMillName
                            .value
                            .trim();


                    const address =
                        riceMillAddress
                            .value
                            .trim();


                    const contact =
                        riceMillContact
                            .value
                            .trim();


                    if (
                        !millName ||
                        !address ||
                        !contact
                    ) {

                        showToast(
                            "Please complete all required mill settings.",
                            "error"
                        );

                        return;

                    }


                    // ==================================
                    // PRESERVE EXISTING SETTINGS
                    // ==================================

                    const existingSettings =
                        getRiceMillSettings();


                    const updatedSettings = {

                        ...existingSettings,

                        riceMillName:
                            millName,

                        address:
                            address,

                        contact:
                            contact,

                        currency:
                            defaultCurrency
                                .value,

                        notificationPreference:
                            notificationPreference
                                .value,

                        location: {

                            divisionId:
                                location
                                    .divisionId,

                            divisionName:
                                location
                                    .divisionName,

                            districtId:
                                location
                                    .districtId,

                            districtName:
                                location
                                    .districtName,

                            upazilaId:
                                location
                                    .upazilaId,

                            upazilaName:
                                location
                                    .upazilaName,

                            lat:
                                location
                                    .lat,

                            lng:
                                location
                                    .lng,

                            detailedAddress:
                                address

                        }

                    };


                    localStorage.setItem(
                        "riceMillSettings",
                        JSON.stringify(
                            updatedSettings
                        )
                    );


                    setLocationMessage(
                        location.upazilaName +
                        ", " +
                        location.districtName +
                        " saved as the central rice mill location.",
                        "success"
                    );


                    showToast(
                        "System settings saved successfully!"
                    );

                }
            );


        // ==========================================
        // INITIAL LOAD
        // ==========================================

        loadProfile();

        await initializeLocationService();

    }
);