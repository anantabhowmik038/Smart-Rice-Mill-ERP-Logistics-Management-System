document.addEventListener(
    "DOMContentLoaded",
    async function () {

        // ==========================================
        // FORM ELEMENTS
        // ==========================================

        const customerForm =
            document.getElementById(
                "customerForm"
            );

        const customerFormTitle =
            document.getElementById(
                "customerFormTitle"
            );

        const customerName =
            document.getElementById(
                "customer-name"
            );

        const phoneNumber =
            document.getElementById(
                "phone-number"
            );

        const customerType =
            document.getElementById(
                "customer-type"
            );

        const paymentStatus =
            document.getElementById(
                "payment-status"
            );

        const customerAddress =
            document.getElementById(
                "customer-address"
            );

        const customerDivisionSelect =
            document.getElementById(
                "customer-division"
            );

        const customerDistrictSelect =
            document.getElementById(
                "customer-district"
            );

        const customerUpazilaSelect =
            document.getElementById(
                "customer-upazila"
            );

        const customerLocationMessage =
            document.getElementById(
                "customerLocationMessage"
            );

        const saveCustomerBtn =
            document.getElementById(
                "saveCustomerBtn"
            );


        // ==========================================
        // TABLE / SUMMARY
        // ==========================================

        const customerTableBody =
            document.getElementById(
                "customerTableBody"
            );

        const totalCustomersValue =
            document.getElementById(
                "totalCustomersValue"
            );


        // ==========================================
        // STATE
        // ==========================================

        let editingCustomerId =
            null;

        let locationServiceReady =
            false;


        // ==========================================
        // DEFAULT LEGACY DATA
        // ==========================================

        const defaultCustomers = [

            {
                id: 1,
                name: "ABC Traders",
                phone: "01700000011",
                city: "Dhaka",
                type: "dealer",
                payment: "due"
            },

            {
                id: 2,
                name: "Bhowmik Store",
                phone: "01800000012",
                city: "Khulna",
                type: "retailer",
                payment: "paid"
            },

            {
                id: 3,
                name: "Dhaka Foods",
                phone: "01900000013",
                city: "Dhaka",
                type: "business",
                payment: "paid"
            }

        ];


        // ==========================================
        // LOAD CUSTOMER DATA
        // ==========================================

        function loadCustomers() {

            const storedCustomers =
                localStorage.getItem(
                    "customers"
                );


            if (
                storedCustomers === null
            ) {

                return defaultCustomers.map(
                    function (customer) {

                        return {
                            ...customer
                        };

                    }
                );

            }


            try {

                const parsedCustomers =
                    JSON.parse(
                        storedCustomers
                    );


                if (
                    Array.isArray(
                        parsedCustomers
                    )
                ) {

                    return parsedCustomers;

                }

            } catch (error) {

                console.error(
                    "Customer data could not be parsed:",
                    error
                );

            }


            return [];

        }


        let customers =
            loadCustomers();


        // ==========================================
        // FIX LEGACY RECORDS WITHOUT ID
        // ==========================================

        let oldDataUpdated =
            false;


        customers =
            customers.map(
                function (
                    customer,
                    index
                ) {

                    if (
                        customer.id ===
                        undefined ||
                        customer.id ===
                        null
                    ) {

                        customer.id =
                            Date.now() +
                            index;

                        oldDataUpdated =
                            true;

                    }


                    return customer;

                }
            );


        // ==========================================
        // LOCAL STORAGE
        // ==========================================

        function saveCustomersToLocalStorage() {

            localStorage.setItem(
                "customers",
                JSON.stringify(
                    customers
                )
            );

        }


        if (
            localStorage.getItem(
                "customers"
            ) === null ||
            oldDataUpdated
        ) {

            saveCustomersToLocalStorage();

        }


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
        // CUSTOMER TYPE TEXT
        // ==========================================

        function getCustomerTypeText(
            type
        ) {

            if (
                type === "dealer"
            ) {

                return "Dealer";

            }


            if (
                type === "retailer"
            ) {

                return "Retailer";

            }


            if (
                type === "business"
            ) {

                return "Business";

            }


            if (
                type === "wholesaler"
            ) {

                return "Wholesaler";

            }


            return type || "—";

        }


        // ==========================================
        // PAYMENT TEXT
        // ==========================================

        function getPaymentText(
            payment
        ) {

            if (
                payment === "paid"
            ) {

                return "Paid";

            }


            if (
                payment === "due"
            ) {

                return "Due";

            }


            if (
                payment === "partial"
            ) {

                return "Partially Paid";

            }


            return payment || "—";

        }


        // ==========================================
        // PAYMENT CLASS
        // ==========================================

        function getPaymentClass(
            payment
        ) {

            if (
                payment === "paid"
            ) {

                return "status-paid";

            }


            if (
                payment === "due" ||
                payment === "partial"
            ) {

                return "status-due";

            }


            return "";

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
                    ".customer-toast"
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
                "customer-toast " +
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

            customerLocationMessage
                .textContent =
                message;


            customerLocationMessage
                .className =
                "customer-location-message " +
                type;

        }


        // ==========================================
        // SORT LOCATION RECORDS
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
        // LOAD DIVISION
        // ==========================================

        function loadDivisionDropdown(
            selectedId = ""
        ) {

            customerDivisionSelect
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
                        document
                            .createElement(
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


                    customerDivisionSelect
                        .appendChild(
                            option
                        );

                }
            );

        }


        // ==========================================
        // LOAD DISTRICT
        // ==========================================

        function loadDistrictDropdown(
            divisionId,
            selectedId = ""
        ) {

            customerDistrictSelect
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


            customerUpazilaSelect
                .innerHTML = `

                    <option
                        value=""
                        selected
                        disabled
                    >
                        Select upazila
                    </option>

                `;


            customerUpazilaSelect
                .disabled =
                true;


            if (
                !divisionId
            ) {

                customerDistrictSelect
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
                        document
                            .createElement(
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


                    customerDistrictSelect
                        .appendChild(
                            option
                        );

                }
            );


            customerDistrictSelect
                .disabled =
                false;

        }


        // ==========================================
        // LOAD UPAZILA
        // ==========================================

        function loadUpazilaDropdown(
            districtId,
            selectedId = ""
        ) {

            customerUpazilaSelect
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

                customerUpazilaSelect
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
                        document
                            .createElement(
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


                    customerUpazilaSelect
                        .appendChild(
                            option
                        );

                }
            );


            customerUpazilaSelect
                .disabled =
                false;

        }


        // ==========================================
        // INITIALIZE LOCATION SERVICE
        // ==========================================

        async function
            initializeLocationService() {

            customerDivisionSelect
                .disabled =
                true;

            customerDistrictSelect
                .disabled =
                true;

            customerUpazilaSelect
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

                await window
                    .BDLocations
                    .init();


                locationServiceReady =
                    true;


                loadDivisionDropdown();


                customerDivisionSelect
                    .disabled =
                    false;


                setLocationMessage(
                    "Bangladesh location data ready. Select Division, District and Upazila.",
                    "success"
                );

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

        customerDivisionSelect
            .addEventListener(
                "change",
                function () {

                    loadDistrictDropdown(
                        customerDivisionSelect
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

        customerDistrictSelect
            .addEventListener(
                "change",
                function () {

                    loadUpazilaDropdown(
                        customerDistrictSelect
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
                        customerDivisionSelect
                            .value
                    );


            const district =
                window
                    .BDLocations
                    .findDistrictById(
                        customerDistrictSelect
                            .value
                    );


            const upazila =
                window
                    .BDLocations
                    .findUpazilaById(
                        customerUpazilaSelect
                            .value
                    );


            if (
                !division ||
                !district ||
                !upazila
            ) {

                return null;

            }


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
                        )

            };

        }


        // ==========================================
        // UPAZILA CHANGE
        // ==========================================

        customerUpazilaSelect
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
                        " selected.",
                        "success"
                    );

                }
            );


        // ==========================================
        // EDIT LOCATION
        // ==========================================

        function populateCustomerLocation(
            customer
        ) {

            if (
                !locationServiceReady
            ) {

                return;

            }


            // New structured record
            if (
                customer.divisionId &&
                customer.districtId &&
                customer.upazilaId
            ) {

                loadDivisionDropdown(
                    customer.divisionId
                );


                customerDivisionSelect
                    .disabled =
                    false;


                loadDistrictDropdown(
                    customer.divisionId,
                    customer.districtId
                );


                loadUpazilaDropdown(
                    customer.districtId,
                    customer.upazilaId
                );


                setLocationMessage(
                    (
                        customer.upazilaName ||
                        "Selected Upazila"
                    ) +
                    ", " +
                    (
                        customer.districtName ||
                        "Selected District"
                    ) +
                    " loaded.",
                    "success"
                );


                return;

            }


            // ======================================
            // OLD CUSTOMER: CITY ONLY
            // ======================================

            if (
                customer.city
            ) {

                const district =
                    window
                        .BDLocations
                        .findDistrictByName(
                            customer.city
                        );


                if (
                    district
                ) {

                    const division =
                        window
                            .BDLocations
                            .getDivisionForDistrict(
                                district
                            );


                    if (
                        division
                    ) {

                        loadDivisionDropdown(
                            division.id
                        );


                        customerDivisionSelect
                            .disabled =
                            false;


                        loadDistrictDropdown(
                            division.id,
                            district.id
                        );


                        loadUpazilaDropdown(
                            district.id
                        );


                        setLocationMessage(
                            "Old city matched to " +
                            window
                                .BDLocations
                                .getName(
                                    district
                                ) +
                            ". Select the correct Upazila before updating.",
                            "info"
                        );


                        return;

                    }

                }

            }


            // Could not migrate automatically
            loadDivisionDropdown();


            customerDivisionSelect
                .disabled =
                false;


            loadDistrictDropdown(
                null
            );


            setLocationMessage(
                "This customer has no structured location. Select Division, District and Upazila.",
                "info"
            );

        }


        // ==========================================
        // LOCATION DISPLAY
        // ==========================================

        function getCustomerLocationHTML(
            customer
        ) {

            if (
                customer.upazilaName &&
                customer.districtName
            ) {

                return `

                    <div class="customer-location-cell">

                        <span class="customer-location-main">

                            ${escapeHTML(
                                customer.upazilaName
                            )},
                            ${escapeHTML(
                                customer.districtName
                            )}

                        </span>

                        <span class="customer-location-secondary">

                            ${escapeHTML(
                                customer.divisionName ||
                                ""
                            )}

                        </span>

                    </div>

                `;

            }


            if (
                customer.city
            ) {

                return `

                    <div class="customer-location-cell">

                        <span class="customer-location-main">

                            ${escapeHTML(
                                customer.city
                            )}

                        </span>

                        <span class="legacy-location-label">
                            Legacy location
                        </span>

                    </div>

                `;

            }


            return `

                <div class="customer-location-cell">

                    <span class="customer-location-main">
                        Not Set
                    </span>

                    <span class="legacy-location-label">
                        Update required
                    </span>

                </div>

            `;

        }


        // ==========================================
        // SUMMARY
        // ==========================================

        function updateCustomerSummary() {

            totalCustomersValue
                .textContent =
                customers.length;

        }


        // ==========================================
        // DISPLAY CUSTOMERS
        // ==========================================

        function displayCustomers() {

            customerTableBody
                .innerHTML =
                "";


            if (
                customers.length ===
                0
            ) {

                customerTableBody
                    .innerHTML = `

                        <tr class="customer-empty-row">

                            <td colspan="7">
                                No customer records found.
                            </td>

                        </tr>

                    `;


                updateCustomerSummary();

                return;

            }


            customers.forEach(
                function (
                    customer
                ) {

                    const row =
                        document
                            .createElement(
                                "tr"
                            );


                    row.innerHTML = `

                        <td>
                            ${escapeHTML(
                                customer.name
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                customer.phone
                            )}
                        </td>

                        <td>
                            ${getCustomerLocationHTML(
                                customer
                            )}
                        </td>

                        <td class="customer-address-cell">

                            ${escapeHTML(
                                customer.address ||
                                "—"
                            )}

                        </td>

                        <td>

                            ${escapeHTML(
                                getCustomerTypeText(
                                    customer.type
                                )
                            )}

                        </td>

                        <td>

                            <span
                                class="
                                    status-badge
                                    ${getPaymentClass(
                                        customer.payment
                                    )}
                                "
                            >

                                ${escapeHTML(
                                    getPaymentText(
                                        customer.payment
                                    )
                                )}

                            </span>

                        </td>

                        <td>

                            <div class="customer-action-group">

                                <button
                                    class="edit-button"
                                    type="button"
                                    data-action="edit"
                                    data-id="${customer.id}"
                                >
                                    Edit
                                </button>

                                <button
                                    class="
                                        edit-button
                                        customer-delete-button
                                    "
                                    type="button"
                                    data-action="delete"
                                    data-id="${customer.id}"
                                >
                                    Delete
                                </button>

                            </div>

                        </td>

                    `;


                    customerTableBody
                        .appendChild(
                            row
                        );

                }
            );


            updateCustomerSummary();

        }


        // ==========================================
        // SAVE / UPDATE CUSTOMER
        // ==========================================

        customerForm
            .addEventListener(
                "submit",
                function (
                    event
                ) {

                    event
                        .preventDefault();


                    const name =
                        customerName
                            .value
                            .trim();


                    const phone =
                        phoneNumber
                            .value
                            .trim();


                    const type =
                        customerType
                            .value;


                    const payment =
                        paymentStatus
                            .value;


                    const address =
                        customerAddress
                            .value
                            .trim();


                    // ==================================
                    // LOCATION VALIDATION
                    // ==================================

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


                    // ==================================
                    // DUPLICATE PHONE
                    // ==================================

                    const duplicatePhone =
                        customers.some(
                            function (
                                customer
                            ) {

                                return (
                                    customer.phone ===
                                    phone &&
                                    customer.id !==
                                    editingCustomerId
                                );

                            }
                        );


                    if (
                        duplicatePhone
                    ) {

                        showToast(
                            "This phone number already exists.",
                            "error"
                        );

                        return;

                    }


                    // ==================================
                    // UPDATE CUSTOMER
                    // ==================================

                    if (
                        editingCustomerId !==
                        null
                    ) {

                        const customerIndex =
                            customers
                                .findIndex(
                                    function (
                                        customer
                                    ) {

                                        return (
                                            customer.id ===
                                            editingCustomerId
                                        );

                                    }
                                );


                        if (
                            customerIndex !==
                            -1
                        ) {

                            customers[
                                customerIndex
                            ] = {

                                id:
                                    editingCustomerId,

                                name:
                                    name,

                                phone:
                                    phone,


                                // Old code compatibility
                                city:
                                    location
                                        .districtName,


                                // Structured location
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


                                address:
                                    address,

                                type:
                                    type,

                                payment:
                                    payment

                            };

                        }


                        saveCustomersToLocalStorage();

                        displayCustomers();

                        resetForm();


                        showToast(
                            "Customer updated successfully!"
                        );


                        return;

                    }


                    // ==================================
                    // NEW CUSTOMER
                    // ==================================

                    const newCustomer = {

                        id:
                            Date.now(),

                        name:
                            name,

                        phone:
                            phone,


                        // Backward compatibility
                        city:
                            location
                                .districtName,


                        // Structured location
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


                        address:
                            address,

                        type:
                            type,

                        payment:
                            payment

                    };


                    customers.push(
                        newCustomer
                    );


                    saveCustomersToLocalStorage();

                    displayCustomers();

                    resetForm();


                    showToast(
                        "Customer saved successfully!"
                    );

                }
            );


        // ==========================================
        // TABLE BUTTON EVENT
        // ==========================================

        customerTableBody
            .addEventListener(
                "click",
                function (
                    event
                ) {

                    const button =
                        event.target
                            .closest(
                                "button"
                            );


                    if (
                        !button
                    ) {

                        return;

                    }


                    const customerId =
                        Number(
                            button
                                .dataset
                                .id
                        );


                    const action =
                        button
                            .dataset
                            .action;


                    if (
                        action ===
                        "edit"
                    ) {

                        editCustomer(
                            customerId
                        );

                    }


                    if (
                        action ===
                        "delete"
                    ) {

                        deleteCustomer(
                            customerId
                        );

                    }

                }
            );


        // ==========================================
        // EDIT CUSTOMER
        // ==========================================

        function editCustomer(
            id
        ) {

            const customer =
                customers.find(
                    function (
                        customer
                    ) {

                        return (
                            customer.id ===
                            id
                        );

                    }
                );


            if (
                !customer
            ) {

                showToast(
                    "Customer record not found.",
                    "error"
                );

                return;

            }


            customerName.value =
                customer.name ||
                "";


            phoneNumber.value =
                customer.phone ||
                "";


            customerType.value =
                customer.type ||
                "";


            paymentStatus.value =
                customer.payment ||
                "";


            customerAddress.value =
                customer.address ||
                "";


            populateCustomerLocation(
                customer
            );


            editingCustomerId =
                customer.id;


            customerFormTitle
                .textContent =
                "Update Customer";


            saveCustomerBtn
                .innerHTML = `

                    <span aria-hidden="true">
                        ▣
                    </span>

                    Update Customer

                `;


            customerName.focus();


            window.scrollTo(
                {

                    top:
                        0,

                    behavior:
                        "smooth"

                }
            );

        }


        // ==========================================
        // DELETE CUSTOMER
        // ==========================================

        // ==========================================
// DELETE CUSTOMER
// ==========================================

function deleteCustomer(
    id
) {

    const customer =
        customers.find(
            function (
                customer
            ) {

                return (
                    customer.id ===
                    id
                );

            }
        );


    if (
        !customer
    ) {

        showToast(
            "Customer record not found.",
            "error"
        );

        return;

    }


    // ======================================
    // DELETE DIRECTLY
    // ======================================

    customers =
        customers.filter(
            function (
                customer
            ) {

                return (
                    customer.id !==
                    id
                );

            }
        );


    // Save updated data
    saveCustomersToLocalStorage();


    // Refresh customer table
    displayCustomers();


    // If currently editing this customer
    if (
        editingCustomerId ===
        id
    ) {

        resetForm();

    }


    // Success message
    showToast(
        "Customer deleted successfully!"
    );

}

        // ==========================================
        // RESET LOCATION
        // ==========================================

        function resetLocationFields() {

            if (
                !locationServiceReady
            ) {

                return;

            }


            loadDivisionDropdown();


            customerDivisionSelect
                .disabled =
                false;


            customerDistrictSelect
                .innerHTML = `

                    <option
                        value=""
                        selected
                        disabled
                    >
                        Select district
                    </option>

                `;


            customerUpazilaSelect
                .innerHTML = `

                    <option
                        value=""
                        selected
                        disabled
                    >
                        Select upazila
                    </option>

                `;


            customerDistrictSelect
                .disabled =
                true;


            customerUpazilaSelect
                .disabled =
                true;


            setLocationMessage(
                "Select Division, District and Upazila.",
                "success"
            );

        }


        // ==========================================
        // RESET FORM
        // ==========================================

        function resetForm() {

            customerForm
                .reset();


            editingCustomerId =
                null;


            customerFormTitle
                .textContent =
                "Save Customer";


            saveCustomerBtn
                .innerHTML = `

                    <span aria-hidden="true">
                        ▣
                    </span>

                    Save Customer

                `;


            resetLocationFields();

        }


        // ==========================================
        // INITIAL DISPLAY
        // ==========================================

        displayCustomers();


        // ==========================================
        // INITIAL LOCATION SERVICE
        // ==========================================

        await initializeLocationService();

    }
);