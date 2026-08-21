document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       SMART RICE MILL ERP
       CUSTOMER MANAGEMENT

       CUSTOMER MASTER
       ----------------
       Stores:
       - Customer ID
       - Name
       - Phone
       - Buyer type
       - Division
       - District
       - Upazila
       - Detailed address

       SALES INTEGRATION
       -----------------
       Sales records automatically calculate:
       - Active buyers
       - Invoice count
       - Purchase value
       - Outstanding due
       - Last purchase date

       REFERENTIAL INTEGRITY
       ---------------------
       Customers linked to invoice history
       cannot be deleted.

       LEGACY DATA MIGRATION
       ---------------------
       The original seeded customer types are
       restored one time so normalization does
       not accidentally convert all legacy
       customers to "Business".
    ========================================= */


    /* =========================================
       BD LOCATION API
    ========================================= */

    const BD_API_BASE =
        "https://bdapis.com/api/v1.2";


    const BANGLADESH_DIVISIONS = [

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
       LEGACY TYPE MIGRATION

       One-time recovery for the original
       prototype seed customers.

       After this migration completes,
       later manual user edits are respected.
    ========================================= */

    const CUSTOMER_TYPE_MIGRATION_KEY =
        "customerTypeMigrationV2Completed";


    const LEGACY_CUSTOMER_TYPE_RECOVERY = {

        "CUS-001":
            "Dealer",

        "CUS-002":
            "Retailer",

        "CUS-003":
            "Business"

    };


    /* =========================================
       ELEMENTS
    ========================================= */

    const customerForm =
        document.getElementById(
            "customerForm"
        );


    if (!customerForm) {
        return;
    }


    const customerNameInput =
        document.getElementById(
            "customerName"
        );


    const customerPhoneInput =
        document.getElementById(
            "customerPhone"
        );


    const customerTypeSelect =
        document.getElementById(
            "customerType"
        );


    const customerDivisionSelect =
        document.getElementById(
            "customerDivision"
        );


    const customerDistrictSelect =
        document.getElementById(
            "customerDistrict"
        );


    const customerUpazilaSelect =
        document.getElementById(
            "customerUpazila"
        );


    const customerAddressInput =
        document.getElementById(
            "customerAddress"
        );


    const customerFormTitle =
        document.getElementById(
            "customerFormTitle"
        );


    const saveCustomerBtn =
        document.getElementById(
            "saveCustomerBtn"
        );


    const cancelCustomerEditBtn =
        document.getElementById(
            "cancelCustomerEditBtn"
        );


    const totalCustomersValue =
        document.getElementById(
            "totalCustomersValue"
        );


    const activeBuyersValue =
        document.getElementById(
            "activeBuyersValue"
        );


    const totalCustomerDueValue =
        document.getElementById(
            "totalCustomerDueValue"
        );


    const customerSearch =
        document.getElementById(
            "customerSearch"
        );


    const customerTypeFilter =
        document.getElementById(
            "customerTypeFilter"
        );


    const customerTableBody =
        document.getElementById(
            "customerTableBody"
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
       STATE
    ========================================= */

    let editingCustomerInternalId =
        null;


    let pendingDeleteCustomerInternalId =
        null;


    let currentDivisionDistricts =
        [];


    /* =========================================
       STORAGE
    ========================================= */

    function safeParseStorage(
        key,
        fallback = []
    ) {

        try {

            const stored =
                localStorage.getItem(
                    key
                );


            if (
                stored === null
            ) {

                return fallback;

            }


            return (
                JSON.parse(
                    stored
                ) ??
                fallback
            );

        }
        catch {

            return fallback;

        }

    }


    /* =========================================
       SAFE HTML
    ========================================= */

    function escapeHTML(value) {

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


    /* =========================================
       MONEY
    ========================================= */

    function formatMoney(value) {

        return (

            `৳${Number(
                value || 0
            ).toLocaleString(
                "en-US",
                {
                    maximumFractionDigits:
                        2
                }
            )}`

        );

    }


    /* =========================================
       DATE
    ========================================= */

    function formatDate(value) {

        if (!value) {

            return "—";

        }


        const date =
            new Date(
                `${value}T00:00:00`
            );


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
       CUSTOMER TYPE
    ========================================= */

    function normalizeCustomerType(
        value
    ) {

        const type =
            String(
                value || ""
            ).trim();


        const allowed = [

            "Dealer",
            "Wholesaler",
            "Retailer",
            "Business"

        ];


        if (
            allowed.includes(
                type
            )
        ) {

            return type;

        }


        return "Business";

    }


    /* =========================================
       RAW CUSTOMERS
    ========================================= */

    function loadRawCustomers() {

        let data =
            safeParseStorage(
                "customers",
                null
            );


        if (
            !Array.isArray(data)
        ) {

            data =
                safeParseStorage(
                    "customerRecords",
                    []
                );

        }


        return Array.isArray(data)
            ? data
            : [];

    }


    /* =========================================
       CUSTOMER NORMALIZATION
    ========================================= */

    function normalizeCustomers() {

        const raw =
            loadRawCustomers();


        const existingCodes =
            raw
                .map(
                    function (
                        customer
                    ) {

                        return (

                            customer.customerId ||
                            customer.customerCode ||
                            ""

                        );

                    }
                )
                .filter(Boolean);


        let highestCode =
            existingCodes
                .map(
                    function (
                        code
                    ) {

                        const match =
                            String(
                                code
                            ).match(
                                /^CUS-(\d+)$/i
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
                .reduce(
                    function (
                        max,
                        number
                    ) {

                        return Math.max(
                            max,
                            number
                        );

                    },
                    0
                );


        let normalized =
            raw.map(
                function (
                    customer,
                    index
                ) {

                    let customerId =

                        customer.customerId ||
                        customer.customerCode ||
                        "";


                    if (!customerId) {

                        highestCode +=
                            1;


                        customerId =

                            `CUS-${String(
                                highestCode
                            ).padStart(
                                3,
                                "0"
                            )}`;

                    }


                    return {

                        id:

                            customer.id ??
                            Date.now() +
                            index,


                        customerId:
                            customerId,


                        name:

                            customer.name ||
                            customer.customerName ||
                            `Customer ${index + 1}`,


                        phone:

                            customer.phone ||
                            customer.phoneNumber ||
                            "",


                        type:

                            normalizeCustomerType(

                                customer.type ||
                                customer.customerType

                            ),


                        division:

                            customer.division ||
                            "",


                        district:

                            customer.district ||
                            customer.location ||
                            "",


                        upazila:

                            customer.upazila ||
                            customer.subDistrict ||
                            "",


                        address:

                            customer.address ||
                            customer.detailedAddress ||
                            "",


                        createdAt:

                            customer.createdAt ||
                            customer.id ||
                            Date.now() +
                            index

                    };

                }
            );


        /* =====================================
           ONE-TIME LEGACY TYPE RECOVERY
        ====================================== */

        const migrationCompleted =

            localStorage.getItem(
                CUSTOMER_TYPE_MIGRATION_KEY
            )

            ===

            "true";


        if (
            !migrationCompleted
        ) {

            normalized =
                normalized.map(
                    function (
                        customer
                    ) {

                        const recoveredType =

                            LEGACY_CUSTOMER_TYPE_RECOVERY[
                                customer.customerId
                            ];


                        if (
                            recoveredType
                        ) {

                            return {

                                ...customer,

                                type:
                                    recoveredType

                            };

                        }


                        return customer;

                    }
                );


            localStorage.setItem(
                CUSTOMER_TYPE_MIGRATION_KEY,
                "true"
            );

        }


        localStorage.setItem(
            "customers",
            JSON.stringify(
                normalized
            )
        );


        return normalized;

    }


    let customers =
        normalizeCustomers();


    function saveCustomers() {

        localStorage.setItem(
            "customers",
            JSON.stringify(
                customers
            )
        );

    }


    /* =========================================
       CUSTOMER ID
    ========================================= */

    function generateCustomerId() {

        const numbers =
            customers
                .map(
                    function (
                        customer
                    ) {

                        const match =
                            String(
                                customer.customerId ||
                                ""
                            ).match(
                                /^CUS-(\d+)$/i
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
                .filter(Boolean);


        const nextNumber =

            numbers.length > 0

                ?

                Math.max(
                    ...numbers
                ) + 1

                :

                1;


        return (

            `CUS-${String(
                nextNumber
            ).padStart(
                3,
                "0"
            )}`

        );

    }


    /* =========================================
       SALES
    ========================================= */

    function getSalesRecords() {

        let sales =
            safeParseStorage(
                "salesRecords",
                null
            );


        if (
            !Array.isArray(sales)
        ) {

            sales =
                safeParseStorage(
                    "sales",
                    []
                );

        }


        return Array.isArray(sales)
            ? sales
            : [];

    }


    /* =========================================
       CUSTOMER ↔ SALES MATCH
    ========================================= */

    function saleBelongsToCustomer(
        sale,
        customer
    ) {

        const saleCustomerId =
            sale.customerId;


        /*
            Current sales module stores
            the internal customer ID.
        */

        if (
            saleCustomerId !==
            undefined &&
            saleCustomerId !==
            null &&
            String(
                saleCustomerId
            ) ===
            String(
                customer.id
            )
        ) {

            return true;

        }


        /*
            Support customer code linkage.
        */

        const saleCustomerCode =

            sale.customerCode ||
            sale.customerReference;


        if (
            saleCustomerCode &&
            String(
                saleCustomerCode
            ) ===
            String(
                customer.customerId
            )
        ) {

            return true;

        }


        /*
            Legacy invoice fallback:
            customer name matching.
        */

        const saleName =
            String(

                sale.customerName ||
                sale.customer ||
                ""

            )
            .trim()
            .toLowerCase();


        return (

            saleName !== ""

            &&

            saleName ===
            String(
                customer.name
            )
            .trim()
            .toLowerCase()

        );

    }


    /* =========================================
       CUSTOMER SALES STATS
    ========================================= */

    function getCustomerSalesStats(
        customer
    ) {

        const allSales =
            getSalesRecords()
                .filter(
                    function (
                        sale
                    ) {

                        return saleBelongsToCustomer(
                            sale,
                            customer
                        );

                    }
                );


        const activeSales =
            allSales.filter(
                function (
                    sale
                ) {

                    return (
                        sale.status !==
                        "voided"
                    );

                }
            );


        let purchaseValue =
            0;


        let outstandingDue =
            0;


        let lastPurchase =
            "";


        activeSales.forEach(
            function (
                sale
            ) {

                const total =

                    Number(
                        sale.totalAmount ||
                        sale.total ||
                        0
                    );


                const paid =

                    Number(
                        sale.amountPaid ||
                        0
                    );


                purchaseValue +=
                    total;


                outstandingDue +=
                    Number(

                        sale.dueAmount ??

                        Math.max(
                            total -
                            paid,
                            0
                        )

                    );


                const saleDate =

                    sale.saleDate ||
                    sale.invoiceDate ||
                    sale.date ||
                    "";


                if (
                    saleDate &&
                    (
                        !lastPurchase ||
                        saleDate >
                        lastPurchase
                    )
                ) {

                    lastPurchase =
                        saleDate;

                }

            }
        );


        return {

            /*
                Includes voided invoices because
                historical invoice linkage still
                exists and must protect the
                customer master record.
            */

            totalInvoiceHistory:
                allSales.length,


            /*
                Only non-voided invoices count
                as current customer purchases.
            */

            activeInvoiceCount:
                activeSales.length,


            purchaseValue:
                purchaseValue,


            outstandingDue:
                outstandingDue,


            lastPurchase:
                lastPurchase

        };

    }


    /* =========================================
       SUMMARY
    ========================================= */

    function updateSummaryCards() {

        let activeBuyers =
            0;


        let totalDue =
            0;


        customers.forEach(
            function (
                customer
            ) {

                const stats =
                    getCustomerSalesStats(
                        customer
                    );


                if (
                    stats.activeInvoiceCount >
                    0
                ) {

                    activeBuyers +=
                        1;

                }


                totalDue +=
                    stats.outstandingDue;

            }
        );


        totalCustomersValue.textContent =
            customers.length;


        activeBuyersValue.textContent =
            activeBuyers;


        totalCustomerDueValue.textContent =
            formatMoney(
                totalDue
            );

    }


    /* =========================================
       LOCATION CACHE
    ========================================= */

    function getDivisionCacheKey(
        division
    ) {

        return (

            `bdLocationDivision_${String(
                division
            ).toLowerCase()}`

        );

    }


    /* =========================================
       DIVISION DROPDOWN
    ========================================= */

    function populateDivisionDropdown() {

        customerDivisionSelect.innerHTML = `

            <option value=""
                    selected
                    disabled>

                Select division

            </option>

        `;


        BANGLADESH_DIVISIONS.forEach(
            function (
                division
            ) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    division;


                option.textContent =
                    division;


                customerDivisionSelect.appendChild(
                    option
                );

            }
        );

    }


    /* =========================================
       LOAD DISTRICTS / UPAZILAS
    ========================================= */

    async function loadDivisionData(
        division
    ) {

        if (!division) {

            return [];

        }


        const cacheKey =
            getDivisionCacheKey(
                division
            );


        const cached =
            safeParseStorage(
                cacheKey,
                null
            );


        if (
            Array.isArray(cached) &&
            cached.length >
            0
        ) {

            currentDivisionDistricts =
                cached;


            return cached;

        }


        try {

            const response =
                await fetch(

                    `${BD_API_BASE}/division/${encodeURIComponent(
                        division.toLowerCase()
                    )}`

                );


            if (!response.ok) {

                throw new Error(
                    "Location service unavailable"
                );

            }


            const result =
                await response.json();


            const data =
                Array.isArray(
                    result.data
                )

                    ?

                    result.data

                    :

                    [];


            if (
                data.length ===
                0
            ) {

                throw new Error(
                    "No district data returned"
                );

            }


            localStorage.setItem(
                cacheKey,
                JSON.stringify(
                    data
                )
            );


            currentDivisionDistricts =
                data;


            return data;

        }
        catch {

            currentDivisionDistricts =
                [];


            showToast(
                "District data could not be loaded. Check the internet connection and try again.",
                "error"
            );


            return [];

        }

    }


    /* =========================================
       RESET LOCATION DROPDOWNS
    ========================================= */

    function resetDistrictDropdown() {

        customerDistrictSelect.innerHTML = `

            <option value=""
                    selected>

                Select district

            </option>

        `;


        customerDistrictSelect.disabled =
            true;

    }


    function resetUpazilaDropdown() {

        customerUpazilaSelect.innerHTML = `

            <option value=""
                    selected>

                Select upazila

            </option>

        `;


        customerUpazilaSelect.disabled =
            true;

    }


    /* =========================================
       DISTRICTS
    ========================================= */

    function populateDistrictDropdown(
        districts,
        selectedDistrict = ""
    ) {

        resetDistrictDropdown();

        resetUpazilaDropdown();


        if (
            !Array.isArray(
                districts
            ) ||
            districts.length ===
            0
        ) {

            return;

        }


        districts.forEach(
            function (
                district
            ) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    district.district;


                option.textContent =
                    district.district;


                customerDistrictSelect.appendChild(
                    option
                );

            }
        );


        customerDistrictSelect.disabled =
            false;


        if (
            selectedDistrict
        ) {

            customerDistrictSelect.value =
                selectedDistrict;

        }

    }


    /* =========================================
       UPAZILAS
    ========================================= */

    function populateUpazilaDropdown(
        districtName,
        selectedUpazila = ""
    ) {

        resetUpazilaDropdown();


        const district =
            currentDivisionDistricts.find(
                function (
                    item
                ) {

                    return (

                        String(
                            item.district
                        ).toLowerCase()

                        ===

                        String(
                            districtName
                        ).toLowerCase()

                    );

                }
            );


        if (
            !district ||
            !Array.isArray(
                district.upazilla
            )
        ) {

            return;

        }


        district.upazilla.forEach(
            function (
                upazila
            ) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    upazila;


                option.textContent =
                    upazila;


                customerUpazilaSelect.appendChild(
                    option
                );

            }
        );


        customerUpazilaSelect.disabled =
            false;


        if (
            selectedUpazila
        ) {

            customerUpazilaSelect.value =
                selectedUpazila;

        }

    }


    /* =========================================
       LOCATION EVENTS
    ========================================= */

    customerDivisionSelect.addEventListener(
        "change",
        async function () {

            resetDistrictDropdown();

            resetUpazilaDropdown();


            const districts =
                await loadDivisionData(
                    customerDivisionSelect.value
                );


            populateDistrictDropdown(
                districts
            );

        }
    );


    customerDistrictSelect.addEventListener(
        "change",
        function () {

            populateUpazilaDropdown(
                customerDistrictSelect.value
            );

        }
    );


    /* =========================================
       PHONE INPUT
    ========================================= */

    customerPhoneInput.addEventListener(
        "input",
        function () {

            customerPhoneInput.value =
                customerPhoneInput.value
                    .replace(
                        /\D/g,
                        ""
                    )
                    .slice(
                        0,
                        11
                    );

        }
    );


    /* =========================================
       VALIDATION
    ========================================= */

    function validateCustomerForm() {

        const name =
            customerNameInput.value
                .trim();


        const phone =
            customerPhoneInput.value
                .trim();


        const type =
            customerTypeSelect.value;


        const division =
            customerDivisionSelect.value;


        const district =
            customerDistrictSelect.value;


        const upazila =
            customerUpazilaSelect.value;


        const address =
            customerAddressInput.value
                .trim();


        if (
            name.length <
            2
        ) {

            return (
                "Customer name must contain at least 2 characters."
            );

        }


        const phonePattern =
            /^01[3-9]\d{8}$/;


        if (
            !phonePattern.test(
                phone
            )
        ) {

            return (
                "Enter a valid 11-digit Bangladesh mobile number."
            );

        }


        const duplicatePhone =
            customers.some(
                function (
                    customer
                ) {

                    return (

                        customer.phone ===
                        phone

                        &&

                        Number(
                            customer.id
                        )

                        !==

                        Number(
                            editingCustomerInternalId
                        )

                    );

                }
            );


        if (
            duplicatePhone
        ) {

            return (
                "A customer with this phone number already exists."
            );

        }


        if (!type) {

            return (
                "Please select a customer type."
            );

        }


        if (!division) {

            return (
                "Please select a division."
            );

        }


        if (!district) {

            return (
                "Please select a district."
            );

        }


        if (!upazila) {

            return (
                "Please select an upazila."
            );

        }


        if (
            address.length <
            3
        ) {

            return (
                "Please enter the detailed delivery address."
            );

        }


        return "";

    }


    /* =========================================
       ADD MODE
    ========================================= */

    function setAddMode() {

        editingCustomerInternalId =
            null;


        customerFormTitle.textContent =
            "Add Customer";


        saveCustomerBtn.innerHTML = `

            <span aria-hidden="true">
                ▣
            </span>

            Save Customer

        `;


        cancelCustomerEditBtn.hidden =
            true;

    }


    /* =========================================
       RESET FORM
    ========================================= */

    function resetCustomerForm() {

        customerForm.reset();


        resetDistrictDropdown();

        resetUpazilaDropdown();


        setAddMode();

    }


    /* =========================================
       BUILD CUSTOMER
    ========================================= */

    function buildCustomer(
        existingCustomer = null
    ) {

        return {

            id:

                existingCustomer

                    ?

                    existingCustomer.id

                    :

                    Date.now(),


            customerId:

                existingCustomer

                    ?

                    existingCustomer.customerId

                    :

                    generateCustomerId(),


            name:

                customerNameInput.value
                    .trim(),


            phone:

                customerPhoneInput.value
                    .trim(),


            type:

                customerTypeSelect.value,


            division:

                customerDivisionSelect.value,


            district:

                customerDistrictSelect.value,


            upazila:

                customerUpazilaSelect.value,


            address:

                customerAddressInput.value
                    .trim(),


            createdAt:

                existingCustomer

                    ?

                    existingCustomer.createdAt

                    :

                    Date.now()

        };

    }


    /* =========================================
       SAVE / UPDATE CUSTOMER
    ========================================= */

    customerForm.addEventListener(
        "submit",
        function (
            event
        ) {

            event.preventDefault();


            pendingDeleteCustomerInternalId =
                null;


            const error =
                validateCustomerForm();


            if (error) {

                showToast(
                    error,
                    "error"
                );


                return;

            }


            if (
                editingCustomerInternalId !==
                null
            ) {

                const index =
                    customers.findIndex(
                        function (
                            customer
                        ) {

                            return (

                                Number(
                                    customer.id
                                )

                                ===

                                Number(
                                    editingCustomerInternalId
                                )

                            );

                        }
                    );


                if (
                    index ===
                    -1
                ) {

                    showToast(
                        "Customer record not found.",
                        "error"
                    );


                    return;

                }


                customers[index] =
                    buildCustomer(
                        customers[index]
                    );


                showToast(
                    `${customers[index].customerId} updated successfully.`
                );

            }
            else {

                const newCustomer =
                    buildCustomer();


                customers.push(
                    newCustomer
                );


                showToast(
                    `${newCustomer.customerId} saved successfully.`
                );

            }


            saveCustomers();


            updateSummaryCards();

            displayCustomers();

            resetCustomerForm();

        }
    );


    /* =========================================
       EDIT CUSTOMER
    ========================================= */

    async function editCustomer(
        internalId
    ) {

        pendingDeleteCustomerInternalId =
            null;


        const customer =
            customers.find(
                function (
                    item
                ) {

                    return (

                        Number(
                            item.id
                        )

                        ===

                        Number(
                            internalId
                        )

                    );

                }
            );


        if (!customer) {

            showToast(
                "Customer record not found.",
                "error"
            );


            return;

        }


        editingCustomerInternalId =
            customer.id;


        customerNameInput.value =
            customer.name;


        customerPhoneInput.value =
            customer.phone;


        customerTypeSelect.value =
            customer.type;


        customerAddressInput.value =
            customer.address;


        customerDivisionSelect.value =
            customer.division ||
            "";


        if (
            customer.division
        ) {

            const districts =
                await loadDivisionData(
                    customer.division
                );


            populateDistrictDropdown(
                districts,
                customer.district
            );


            if (
                customer.district
            ) {

                populateUpazilaDropdown(
                    customer.district,
                    customer.upazila
                );

            }

        }
        else {

            resetDistrictDropdown();

            resetUpazilaDropdown();

        }


        customerFormTitle.textContent =

            `Edit Customer — ${customer.customerId}`;


        saveCustomerBtn.innerHTML = `

            <span aria-hidden="true">
                ✓
            </span>

            Update Customer

        `;


        cancelCustomerEditBtn.hidden =
            false;


        displayCustomers();


        customerForm.scrollIntoView(
            {
                behavior:
                    "smooth",

                block:
                    "center"
            }
        );

    }


    /* =========================================
       CANCEL EDIT
    ========================================= */

    cancelCustomerEditBtn.addEventListener(
        "click",
        function () {

            resetCustomerForm();


            showToast(
                "Edit cancelled."
            );

        }
    );


    /* =========================================
       DELETE REQUEST

       Extra safeguard remains even though
       Protected customers do not display
       the Delete button.
    ========================================= */

    function requestDeleteCustomer(
        internalId
    ) {

        const customer =
            customers.find(
                function (
                    item
                ) {

                    return (

                        Number(
                            item.id
                        )

                        ===

                        Number(
                            internalId
                        )

                    );

                }
            );


        if (!customer) {

            return;

        }


        const stats =
            getCustomerSalesStats(
                customer
            );


        if (
            stats.totalInvoiceHistory >
            0
        ) {

            showToast(

                `${customer.customerId} is protected because invoice history is linked to this customer.`,

                "error"

            );


            return;

        }


        pendingDeleteCustomerInternalId =
            internalId;


        displayCustomers();

    }


    /* =========================================
       CANCEL DELETE
    ========================================= */

    function cancelDeleteCustomer() {

        pendingDeleteCustomerInternalId =
            null;


        displayCustomers();

    }


    /* =========================================
       CONFIRM DELETE
    ========================================= */

    function confirmDeleteCustomer(
        internalId
    ) {

        const customer =
            customers.find(
                function (
                    item
                ) {

                    return (

                        Number(
                            item.id
                        )

                        ===

                        Number(
                            internalId
                        )

                    );

                }
            );


        if (!customer) {

            pendingDeleteCustomerInternalId =
                null;


            displayCustomers();


            return;

        }


        /*
            Final referential-integrity check.
        */

        const stats =
            getCustomerSalesStats(
                customer
            );


        if (
            stats.totalInvoiceHistory >
            0
        ) {

            pendingDeleteCustomerInternalId =
                null;


            displayCustomers();


            showToast(
                "Customer has invoice history and cannot be deleted.",
                "error"
            );


            return;

        }


        customers =
            customers.filter(
                function (
                    item
                ) {

                    return (

                        Number(
                            item.id
                        )

                        !==

                        Number(
                            internalId
                        )

                    );

                }
            );


        pendingDeleteCustomerInternalId =
            null;


        saveCustomers();


        if (
            Number(
                editingCustomerInternalId
            )

            ===

            Number(
                internalId
            )
        ) {

            resetCustomerForm();

        }


        updateSummaryCards();

        displayCustomers();


        showToast(
            `${customer.customerId} deleted successfully.`
        );

    }


    /* =========================================
       ACTION COLUMN

       No invoice history:
       Edit | Delete

       Has invoice history:
       Edit | Protected
    ========================================= */

    function getCustomerActionHTML(
        customer
    ) {

        const stats =
            getCustomerSalesStats(
                customer
            );


        /*
            Existing invoice relationship means
            the customer master record should
            remain available for traceability.
        */

        if (
            stats.totalInvoiceHistory >
            0
        ) {

            return `

                <button
                    class="customer-edit-button"
                    type="button"
                    data-action="edit"
                    data-id="${customer.id}"
                >
                    Edit
                </button>


                <span
                    class="customer-protected-badge"
                    title="This customer has linked invoice history and cannot be deleted."
                >
                    Protected
                </span>

            `;

        }


        const waiting =

            Number(
                pendingDeleteCustomerInternalId
            )

            ===

            Number(
                customer.id
            );


        if (waiting) {

            return `

                <span class="customer-delete-question">
                    Delete?
                </span>


                <button
                    class="customer-confirm-delete-button"
                    type="button"
                    data-action="confirm-delete"
                    data-id="${customer.id}"
                >
                    Confirm
                </button>


                <button
                    class="customer-cancel-delete-button"
                    type="button"
                    data-action="cancel-delete"
                    data-id="${customer.id}"
                >
                    Cancel
                </button>

            `;

        }


        return `

            <button
                class="customer-edit-button"
                type="button"
                data-action="edit"
                data-id="${customer.id}"
            >
                Edit
            </button>


            <button
                class="customer-delete-button"
                type="button"
                data-action="request-delete"
                data-id="${customer.id}"
            >
                Delete
            </button>

        `;

    }


    /* =========================================
       DISPLAY CUSTOMERS
    ========================================= */

    function displayCustomers() {

        const searchText =
            customerSearch.value
                .trim()
                .toLowerCase();


        const typeFilter =
            customerTypeFilter.value;


        const filtered =
            customers.filter(
                function (
                    customer
                ) {

                    const searchable = `

                        ${customer.customerId}
                        ${customer.name}
                        ${customer.phone}
                        ${customer.type}
                        ${customer.division}
                        ${customer.district}
                        ${customer.upazila}
                        ${customer.address}

                    `.toLowerCase();


                    const matchesSearch =
                        searchable.includes(
                            searchText
                        );


                    const matchesType =

                        typeFilter ===
                        "all"

                        ||

                        customer.type ===
                        typeFilter;


                    return (

                        matchesSearch &&
                        matchesType

                    );

                }
            );


        customerTableBody.innerHTML =
            "";


        if (
            filtered.length ===
            0
        ) {

            customerTableBody.innerHTML = `

                <tr class="customer-empty-row">

                    <td colspan="10">

                        No customers match the current filter.

                    </td>

                </tr>

            `;


            return;

        }


        filtered.forEach(
            function (
                customer
            ) {

                const stats =
                    getCustomerSalesStats(
                        customer
                    );


                const locationPrimary =

                    customer.upazila

                        ?

                        `${customer.upazila}, ${customer.district}`

                        :

                        customer.district ||
                        "Location not updated";


                const locationSecondary =

                    customer.division

                        ?

                        `${customer.division} Division`

                        :

                        "Legacy customer record";


                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>

                        <span class="customer-code">

                            ${escapeHTML(
                                customer.customerId
                            )}

                        </span>

                    </td>


                    <td>

                        <span class="customer-name">

                            ${escapeHTML(
                                customer.name
                            )}

                        </span>

                    </td>


                    <td>

                        ${escapeHTML(
                            customer.phone ||
                            "—"
                        )}

                    </td>


                    <td class="customer-location">

                        ${escapeHTML(
                            locationPrimary
                        )}

                        <small>

                            ${escapeHTML(
                                locationSecondary
                            )}

                        </small>

                    </td>


                    <td>

                        ${escapeHTML(
                            customer.type
                        )}

                    </td>


                    <td>

                        ${stats.activeInvoiceCount}

                    </td>


                    <td>

                        <span class="customer-financial-value">

                            ${formatMoney(
                                stats.purchaseValue
                            )}

                        </span>

                    </td>


                    <td>

                        <span
                            class="
                                ${
                                    stats.outstandingDue >
                                    0

                                        ?

                                        "customer-due-active"

                                        :

                                        "customer-due-zero"
                                }
                            "
                        >

                            ${formatMoney(
                                stats.outstandingDue
                            )}

                        </span>

                    </td>


                    <td>

                        ${
                            stats.lastPurchase

                                ?

                                formatDate(
                                    stats.lastPurchase
                                )

                                :

                                `<span class="customer-no-purchase">
                                    No purchase
                                </span>`
                        }

                    </td>


                    <td class="customer-action-cell">

                        ${getCustomerActionHTML(
                            customer
                        )}

                    </td>

                `;


                customerTableBody.appendChild(
                    row
                );

            }
        );

    }


    /* =========================================
       TABLE ACTIONS
    ========================================= */

    customerTableBody.addEventListener(
        "click",
        async function (
            event
        ) {

            const button =
                event.target.closest(
                    "button[data-action]"
                );


            if (!button) {

                return;

            }


            const id =
                Number(
                    button.dataset.id
                );


            const action =
                button.dataset.action;


            if (
                action ===
                "edit"
            ) {

                await editCustomer(
                    id
                );


                return;

            }


            if (
                action ===
                "request-delete"
            ) {

                requestDeleteCustomer(
                    id
                );


                return;

            }


            if (
                action ===
                "confirm-delete"
            ) {

                confirmDeleteCustomer(
                    id
                );


                return;

            }


            if (
                action ===
                "cancel-delete"
            ) {

                cancelDeleteCustomer();

            }

        }
    );


    /* =========================================
       SEARCH / FILTER
    ========================================= */

    customerSearch.addEventListener(
        "input",
        function () {

            pendingDeleteCustomerInternalId =
                null;


            displayCustomers();

        }
    );


    customerTypeFilter.addEventListener(
        "change",
        function () {

            pendingDeleteCustomerInternalId =
                null;


            displayCustomers();

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
                ".customer-toast"
            );


        if (oldToast) {

            oldToast.remove();

        }


        const toast =
            document.createElement(
                "div"
            );


        toast.className =
            `customer-toast ${type}`;


        toast.innerHTML = `

            <span class="customer-toast-icon">

                ${
                    type ===
                    "error"

                        ?

                        "!"

                        :

                        "✓"
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
       ESCAPE KEY
    ========================================= */

    document.addEventListener(
        "keydown",
        function (
            event
        ) {

            if (
                event.key !==
                "Escape"
            ) {

                return;

            }


            if (
                pendingDeleteCustomerInternalId !==
                null
            ) {

                pendingDeleteCustomerInternalId =
                    null;


                displayCustomers();


                return;

            }


            if (
                editingCustomerInternalId !==
                null
            ) {

                resetCustomerForm();


                return;

            }


            closeSidebar();

        }
    );


    /* =========================================
       RESIZE
    ========================================= */

    window.addEventListener(
        "resize",
        function () {

            if (
                window.innerWidth >
                1000
            ) {

                closeSidebar();

            }

        }
    );


    /* =========================================
       INITIALIZE
    ========================================= */

    populateDivisionDropdown();

    resetDistrictDropdown();

    resetUpazilaDropdown();

    setAddMode();

    updateSummaryCards();

    displayCustomers();

});