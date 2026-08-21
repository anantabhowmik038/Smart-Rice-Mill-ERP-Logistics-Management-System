document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       SMART RICE MILL ERP
       FARMER & SUPPLIER MANAGEMENT

       UI LANGUAGE:
       ENGLISH ONLY
    ========================================= */


    /* =========================================
       ELEMENTS
    ========================================= */

    const supplierForm =
        document.getElementById("supplierForm");

    if (!supplierForm) {
        return;
    }


    const supplierNameInput =
        document.getElementById("supplierName");

    const supplierPhoneInput =
        document.getElementById("supplierPhone");

    const supplierTypeSelect =
        document.getElementById("supplierType");

    const supplierDivisionSelect =
        document.getElementById("supplierDivision");

    const supplierDistrictSelect =
        document.getElementById("supplierDistrict");

    const supplierUpazilaSelect =
        document.getElementById("supplierUpazila");

    const supplierAddressInput =
        document.getElementById("supplierAddress");


    const manualAreaField =
        document.getElementById("manualAreaField");

    const manualAreaInput =
        document.getElementById("manualArea");


    const manualLocationFallback =
        document.getElementById("manualLocationFallback");

    const manualDivisionInput =
        document.getElementById("manualDivision");

    const manualDistrictInput =
        document.getElementById("manualDistrict");

    const manualUpazilaInput =
        document.getElementById("manualUpazila");


    const divisionField =
        document.getElementById("divisionField");

    const districtField =
        document.getElementById("districtField");

    const upazilaField =
        document.getElementById("upazilaField");


    const locationLoadStatus =
        document.getElementById("locationLoadStatus");


    const supplierFormTitle =
        document.getElementById("supplierFormTitle");

    const saveSupplierBtn =
        document.getElementById("saveSupplierBtn");

    const cancelSupplierEditBtn =
        document.getElementById("cancelSupplierEditBtn");


    const totalFarmersValue =
        document.getElementById("totalFarmersValue");

    const totalSuppliersValue =
        document.getElementById("totalSuppliersValue");

    const supplierDueValue =
        document.getElementById("supplierDueValue");


    const supplierSearch =
        document.getElementById("supplierSearch");

    const supplierTypeFilter =
        document.getElementById("supplierTypeFilter");

    const supplierTableBody =
        document.getElementById("supplierTableBody");


    const historyModalBackdrop =
        document.getElementById("historyModalBackdrop");

    const closeHistoryModalBtn =
        document.getElementById("closeHistoryModalBtn");

    const historyModalSubtitle =
        document.getElementById("historyModalSubtitle");

    const historyPurchaseCount =
        document.getElementById("historyPurchaseCount");

    const historyPurchaseValue =
        document.getElementById("historyPurchaseValue");

    const historyDueValue =
        document.getElementById("historyDueValue");

    const historyTableBody =
        document.getElementById("historyTableBody");


    const menuButton =
        document.getElementById("menuButton");

    const sidebar =
        document.getElementById("sidebar");

    const sidebarBackdrop =
        document.getElementById("sidebarBackdrop");


    /* =========================================
       BANGLADESH LOCATION DATA
    ========================================= */

    const LOCATION_DATA_ENDPOINT = [
        "https:",
        "",
        "raw.githubusercontent.com",
        "open-admin-data",
        "bangladesh-administrative-divisions",
        "main",
        "data",
        "hierarchy.json"
    ].join("/");


    const LOCATION_CACHE_KEY =
        "bdAdminHierarchyV1";


    let locationHierarchy =
        [];


    let locationReady =
        false;


    let manualLocationMode =
        false;


    /* =========================================
       DEFAULT SUPPLIERS
    ========================================= */

    const defaultSuppliers = [

        {
            id: 1,

            supplierCode:
                "SUP-001",

            name:
                "Rahim Farmer",

            phone:
                "01700000001",

            type:
                "farmer",

            division:
                "Rangpur",

            divisionId:
                "",

            district:
                "Dinajpur",

            districtId:
                "",

            upazila:
                "Dinajpur Sadar",

            upazilaId:
                "",

            address:
                "Dinajpur"
        },


        {
            id: 2,

            supplierCode:
                "SUP-002",

            name:
                "Karim Supplier",

            phone:
                "01800000002",

            type:
                "supplier",

            division:
                "Rajshahi",

            divisionId:
                "",

            district:
                "Bogura",

            districtId:
                "",

            upazila:
                "Bogura Sadar",

            upazilaId:
                "",

            address:
                "Bogura"
        },


        {
            id: 3,

            supplierCode:
                "SUP-003",

            name:
                "Molla Agro",

            phone:
                "01900000003",

            type:
                "supplier",

            division:
                "Rajshahi",

            divisionId:
                "",

            district:
                "Naogaon",

            districtId:
                "",

            upazila:
                "Naogaon Sadar",

            upazilaId:
                "",

            address:
                "Naogaon"
        }

    ];


    /* =========================================
       EDIT STATE
    ========================================= */

    let editingSupplierId =
        null;


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
       MONEY
    ========================================= */

    function formatMoney(amount) {

        return (
            "৳" +
            Number(
                amount || 0
            ).toLocaleString(
                "en-US",
                {
                    maximumFractionDigits: 2
                }
            )
        );

    }


    /* =========================================
       NUMBER
    ========================================= */

    function formatNumber(value) {

        return Number(
            value || 0
        ).toLocaleString(
            "en-US",
            {
                maximumFractionDigits: 2
            }
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
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    }


    /* =========================================
       ENGLISH LOCATION NAME ONLY
    ========================================= */

    function getEnglishName(item) {

        if (!item) {
            return "";
        }


        /*
            Dataset may return:
            name: "Dhaka"

            OR:

            name: {
                en: "Dhaka",
                local: "ঢাকা"
            }
        */


        if (
            typeof item.name ===
            "string"
        ) {

            return item.name.trim();

        }


        if (
            item.name &&
            typeof item.name ===
            "object"
        ) {

            return (
                item.name.en ||
                item.name.english ||
                ""
            ).trim();

        }


        return (
            item.en_name ||
            item.english_name ||
            ""
        ).trim();

    }


    /* =========================================
       IMPORTANT:
       LOCATION LABEL IS ENGLISH ONLY
    ========================================= */

    function createLocationLabel(item) {

        const englishName =
            getEnglishName(item);


        return (
            englishName ||
            "Unknown"
        );

    }


    /* =========================================
       LOCATION STRUCTURE HELPERS
    ========================================= */

    function getDivisionDistricts(division) {

        if (!division) {
            return [];
        }


        return (
            division.district ||
            division.districts ||
            []
        );

    }


    function getDistrictUpazilas(district) {

        if (!district) {
            return [];
        }


        return (
            district.upazila ||
            district.upazilas ||
            []
        );

    }


    /* =========================================
       INITIALIZE LOCATION DATA
    ========================================= */

    async function initializeLocationData() {

        locationLoadStatus.textContent =
            "Loading Bangladesh locations...";


        /*
            FIRST:
            Try saved location data.
        */

        const cached =
            localStorage.getItem(
                LOCATION_CACHE_KEY
            );


        if (cached) {

            try {

                const parsed =
                    JSON.parse(cached);


                if (
                    Array.isArray(parsed) &&
                    parsed.length > 0
                ) {

                    locationHierarchy =
                        parsed;


                    activateLocationDropdowns();

                    return;

                }

            }
            catch {

                localStorage.removeItem(
                    LOCATION_CACHE_KEY
                );

            }

        }


        /*
            SECOND:
            Download location hierarchy.
        */

        try {

            const response =
                await fetch(
                    LOCATION_DATA_ENDPOINT,
                    {
                        cache: "force-cache"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Unable to load location data."
                );

            }


            const result =
                await response.json();


            const data =

                Array.isArray(result)

                    ?

                    result

                    :

                    result.data;


            if (
                !Array.isArray(data) ||
                data.length === 0
            ) {

                throw new Error(
                    "Invalid location data."
                );

            }


            locationHierarchy =
                data;


            try {

                localStorage.setItem(
                    LOCATION_CACHE_KEY,
                    JSON.stringify(
                        locationHierarchy
                    )
                );

            }
            catch {

                /*
                    Cache failure does not stop
                    the location feature.
                */

            }


            activateLocationDropdowns();

        }
        catch {

            enableManualLocationMode();

        }

    }


    /* =========================================
       ACTIVATE LOCATION DROPDOWNS
    ========================================= */

    function activateLocationDropdowns() {

        locationReady =
            true;


        manualLocationMode =
            false;


        divisionField.hidden =
            false;


        districtField.hidden =
            false;


        upazilaField.hidden =
            false;


        manualLocationFallback.hidden =
            true;


        manualDivisionInput.required =
            false;


        manualDistrictInput.required =
            false;


        manualUpazilaInput.required =
            false;


        supplierDivisionSelect.required =
            true;


        supplierDistrictSelect.required =
            true;


        supplierUpazilaSelect.required =
            true;


        locationLoadStatus.classList.remove(
            "error"
        );


        locationLoadStatus.classList.add(
            "ready"
        );


        locationLoadStatus.textContent =
            "Location list ready";


        populateDivisions();

    }


    /* =========================================
       MANUAL LOCATION FALLBACK
    ========================================= */

    function enableManualLocationMode() {

        locationReady =
            false;


        manualLocationMode =
            true;


        divisionField.hidden =
            true;


        districtField.hidden =
            true;


        upazilaField.hidden =
            true;


        manualAreaField.hidden =
            true;


        manualLocationFallback.hidden =
            false;


        manualDivisionInput.required =
            true;


        manualDistrictInput.required =
            true;


        manualUpazilaInput.required =
            true;


        supplierDivisionSelect.required =
            false;


        supplierDistrictSelect.required =
            false;


        supplierUpazilaSelect.required =
            false;


        locationLoadStatus.classList.remove(
            "ready"
        );


        locationLoadStatus.classList.add(
            "error"
        );


        locationLoadStatus.textContent =
            "Offline — manual location enabled";

    }


    /* =========================================
       POPULATE DIVISIONS
    ========================================= */

    function populateDivisions(
        selectedId = "",
        selectedName = ""
    ) {

        supplierDivisionSelect.innerHTML = `

            <option
                value=""
                selected
                disabled
            >
                Select division
            </option>

        `;


        locationHierarchy.forEach(
            function (division) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    division.id;


                /*
                    ENGLISH ONLY
                */

                option.textContent =
                    createLocationLabel(
                        division
                    );


                supplierDivisionSelect.appendChild(
                    option
                );

            }
        );


        supplierDivisionSelect.disabled =
            false;


        if (selectedId) {

            supplierDivisionSelect.value =
                String(selectedId);

        }
        else if (selectedName) {

            const match =
                locationHierarchy.find(
                    function (division) {

                        return (

                            getEnglishName(
                                division
                            ).toLowerCase() ===

                            selectedName
                                .trim()
                                .toLowerCase()

                        );

                    }
                );


            if (match) {

                supplierDivisionSelect.value =
                    String(match.id);

            }

        }

    }


    /* =========================================
       GET SELECTED DIVISION
    ========================================= */

    function getSelectedDivision() {

        return locationHierarchy.find(
            function (division) {

                return (
                    String(
                        division.id
                    ) ===

                    String(
                        supplierDivisionSelect.value
                    )
                );

            }
        );

    }


    /* =========================================
       POPULATE DISTRICTS
    ========================================= */

    function populateDistricts(
        selectedId = "",
        selectedName = ""
    ) {

        const division =
            getSelectedDivision();


        supplierDistrictSelect.innerHTML = `

            <option
                value=""
                selected
                disabled
            >
                Select district
            </option>

        `;


        supplierUpazilaSelect.innerHTML = `

            <option
                value=""
                selected
                disabled
            >
                Select district first
            </option>

        `;


        supplierUpazilaSelect.disabled =
            true;


        manualAreaField.hidden =
            true;


        manualAreaInput.value =
            "";


        manualAreaInput.required =
            false;


        if (!division) {

            supplierDistrictSelect.disabled =
                true;

            return;

        }


        const districts =
            getDivisionDistricts(
                division
            );


        districts.forEach(
            function (district) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    district.id;


                /*
                    ENGLISH ONLY
                */

                option.textContent =
                    createLocationLabel(
                        district
                    );


                supplierDistrictSelect.appendChild(
                    option
                );

            }
        );


        supplierDistrictSelect.disabled =
            false;


        if (selectedId) {

            supplierDistrictSelect.value =
                String(selectedId);

        }
        else if (selectedName) {

            const match =
                districts.find(
                    function (district) {

                        return (

                            getEnglishName(
                                district
                            ).toLowerCase() ===

                            selectedName
                                .trim()
                                .toLowerCase()

                        );

                    }
                );


            if (match) {

                supplierDistrictSelect.value =
                    String(match.id);

            }

        }

    }


    /* =========================================
       GET SELECTED DISTRICT
    ========================================= */

    function getSelectedDistrict() {

        const division =
            getSelectedDivision();


        if (!division) {
            return null;
        }


        return getDivisionDistricts(
            division
        ).find(
            function (district) {

                return (
                    String(
                        district.id
                    ) ===

                    String(
                        supplierDistrictSelect.value
                    )
                );

            }
        );

    }


    /* =========================================
       POPULATE UPAZILAS
    ========================================= */

    function populateUpazilas(
        selectedId = "",
        selectedName = ""
    ) {

        const district =
            getSelectedDistrict();


        supplierUpazilaSelect.innerHTML = `

            <option
                value=""
                selected
                disabled
            >
                Select upazila / thana
            </option>

        `;


        manualAreaField.hidden =
            true;


        manualAreaInput.value =
            "";


        manualAreaInput.required =
            false;


        if (!district) {

            supplierUpazilaSelect.disabled =
                true;

            return;

        }


        const upazilas =
            getDistrictUpazilas(
                district
            );


        upazilas.forEach(
            function (upazila) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    upazila.id;


                /*
                    ENGLISH ONLY
                */

                option.textContent =
                    createLocationLabel(
                        upazila
                    );


                supplierUpazilaSelect.appendChild(
                    option
                );

            }
        );


        /*
            Manual thana/city-area option.
        */

        const manualOption =
            document.createElement(
                "option"
            );


        manualOption.value =
            "__manual__";


        manualOption.textContent =
            "Other / City Area / Thana";


        supplierUpazilaSelect.appendChild(
            manualOption
        );


        supplierUpazilaSelect.disabled =
            false;


        if (selectedId) {

            const exists =
                upazilas.some(
                    function (upazila) {

                        return (
                            String(
                                upazila.id
                            ) ===
                            String(
                                selectedId
                            )
                        );

                    }
                );


            if (exists) {

                supplierUpazilaSelect.value =
                    String(selectedId);

                return;

            }

        }


        if (selectedName) {

            const match =
                upazilas.find(
                    function (upazila) {

                        return (

                            getEnglishName(
                                upazila
                            ).toLowerCase() ===

                            selectedName
                                .trim()
                                .toLowerCase()

                        );

                    }
                );


            if (match) {

                supplierUpazilaSelect.value =
                    String(match.id);

            }
            else if (
                selectedName !==
                "Not Recorded"
            ) {

                supplierUpazilaSelect.value =
                    "__manual__";


                manualAreaField.hidden =
                    false;


                manualAreaInput.required =
                    true;


                manualAreaInput.value =
                    selectedName;

            }

        }

    }


    /* =========================================
       LOCATION EVENTS
    ========================================= */

    supplierDivisionSelect.addEventListener(
        "change",
        function () {

            populateDistricts();

        }
    );


    supplierDistrictSelect.addEventListener(
        "change",
        function () {

            populateUpazilas();

        }
    );


    supplierUpazilaSelect.addEventListener(
        "change",
        function () {

            const isManual =

                supplierUpazilaSelect.value ===
                "__manual__";


            manualAreaField.hidden =
                !isManual;


            manualAreaInput.required =
                isManual;


            if (!isManual) {

                manualAreaInput.value =
                    "";

            }

        }
    );


    /* =========================================
       GET LOCATION VALUES
    ========================================= */

    function getLocationValues() {

        /*
            Offline/manual mode.
        */

        if (manualLocationMode) {

            return {

                divisionId:
                    "",

                division:
                    manualDivisionInput.value
                        .trim(),

                districtId:
                    "",

                district:
                    manualDistrictInput.value
                        .trim(),

                upazilaId:
                    "",

                upazila:
                    manualUpazilaInput.value
                        .trim()

            };

        }


        const division =
            getSelectedDivision();


        const district =
            getSelectedDistrict();


        const upazilas =

            district

                ?

                getDistrictUpazilas(
                    district
                )

                :

                [];


        let selectedUpazila =
            null;


        if (
            supplierUpazilaSelect.value !==
            "__manual__"
        ) {

            selectedUpazila =
                upazilas.find(
                    function (upazila) {

                        return (
                            String(
                                upazila.id
                            ) ===

                            String(
                                supplierUpazilaSelect.value
                            )
                        );

                    }
                );

        }


        return {

            divisionId:
                division?.id || "",

            division:
                getEnglishName(
                    division
                ),

            districtId:
                district?.id || "",

            district:
                getEnglishName(
                    district
                ),

            upazilaId:
                selectedUpazila?.id || "",

            upazila:

                supplierUpazilaSelect.value ===
                "__manual__"

                    ?

                    manualAreaInput.value
                        .trim()

                    :

                    getEnglishName(
                        selectedUpazila
                    )

        };

    }


    /* =========================================
       SUPPLIER CODE
    ========================================= */

    function formatSupplierCode(number) {

        return (
            `SUP-${String(
                number
            ).padStart(
                3,
                "0"
            )}`
        );

    }


    function parseStrictSupplierCode(code) {

        const match =
            String(
                code || ""
            )
            .trim()
            .match(
                /^SUP-(\d{3})$/i
            );


        return (
            match
                ? Number(match[1])
                : null
        );

    }


    function normalizeSupplierCodes(data) {

        const usedNumbers =
            new Set();


        let nextNumber =
            1;


        const firstPass =
            data.map(
                function (supplier) {

                    const parsed =
                        parseStrictSupplierCode(
                            supplier.supplierCode
                        );


                    if (
                        parsed !== null &&
                        !usedNumbers.has(parsed)
                    ) {

                        usedNumbers.add(
                            parsed
                        );


                        nextNumber =
                            Math.max(
                                nextNumber,
                                parsed + 1
                            );


                        return {

                            ...supplier,

                            supplierCode:
                                formatSupplierCode(
                                    parsed
                                )

                        };

                    }


                    return {

                        ...supplier,

                        supplierCode:
                            ""

                    };

                }
            );


        return firstPass.map(
            function (supplier) {

                if (
                    supplier.supplierCode
                ) {

                    return supplier;

                }


                while (
                    usedNumbers.has(
                        nextNumber
                    )
                ) {

                    nextNumber += 1;

                }


                const code =
                    formatSupplierCode(
                        nextNumber
                    );


                usedNumbers.add(
                    nextNumber
                );


                nextNumber +=
                    1;


                return {

                    ...supplier,

                    supplierCode:
                        code

                };

            }
        );

    }


    function getNextSupplierCode() {

        const numbers =
            suppliers
                .map(
                    function (supplier) {

                        const match =
                            String(
                                supplier.supplierCode ||
                                ""
                            ).match(
                                /^SUP-(\d+)$/i
                            );


                        return (
                            match
                                ? Number(match[1])
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
            formatSupplierCode(
                nextNumber
            )
        );

    }


    /* =========================================
       LOAD SUPPLIERS
    ========================================= */

    function loadSuppliers() {

        const stored =
            localStorage.getItem(
                "suppliers"
            );


        let data;


        if (stored === null) {

            data =
                [...defaultSuppliers];

        }
        else {

            try {

                data =
                    JSON.parse(
                        stored
                    ) || [];

            }
            catch {

                data =
                    [...defaultSuppliers];

            }

        }


        data =
            data.map(
                function (
                    supplier,
                    index
                ) {

                    const normalizedType =

                        String(
                            supplier.type ||
                            ""
                        ).toLowerCase() ===
                        "farmer"

                            ?

                            "farmer"

                            :

                            "supplier";


                    const oldDistrict =
                        supplier.district ||
                        supplier.address ||
                        "Not Recorded";


                    return {

                        id:

                            supplier.id ??

                            index + 1,


                        supplierCode:

                            supplier.supplierCode ||
                            "",


                        name:

                            supplier.name ||

                            `Partner ${index + 1}`,


                        phone:

                            supplier.phone ||
                            "",


                        type:
                            normalizedType,


                        division:

                            supplier.division ||
                            "Not Recorded",


                        divisionId:

                            supplier.divisionId ||
                            "",


                        district:

                            oldDistrict,


                        districtId:

                            supplier.districtId ||
                            "",


                        upazila:

                            supplier.upazila ||
                            supplier.thana ||
                            "Not Recorded",


                        upazilaId:

                            supplier.upazilaId ||
                            "",


                        address:

                            supplier.address ||
                            oldDistrict

                    };

                }
            );


        data =
            normalizeSupplierCodes(
                data
            );


        localStorage.setItem(
            "suppliers",
            JSON.stringify(data)
        );


        return data;

    }


    let suppliers =
        loadSuppliers();


    /* =========================================
       SAVE SUPPLIERS
    ========================================= */

    function saveSuppliers() {

        localStorage.setItem(
            "suppliers",
            JSON.stringify(
                suppliers
            )
        );

    }


    /* =========================================
       PURCHASES
    ========================================= */

    function getPurchases() {

        try {

            return (
                JSON.parse(
                    localStorage.getItem(
                        "purchases"
                    )
                ) || []
            );

        }
        catch {

            return [];

        }

    }


    /* =========================================
       SUPPLIER PURCHASES
    ========================================= */

    function getSupplierPurchases(
        supplier
    ) {

        return getPurchases().filter(
            function (purchase) {

                const idMatch =

                    Number(
                        purchase.supplierId
                    ) ===

                    Number(
                        supplier.id
                    );


                const nameMatch =

                    !purchase.supplierId &&

                    String(
                        purchase.supplierName ||
                        ""
                    )
                    .trim()
                    .toLowerCase() ===

                    String(
                        supplier.name ||
                        ""
                    )
                    .trim()
                    .toLowerCase();


                return (
                    idMatch ||
                    nameMatch
                );

            }
        );

    }


    /* =========================================
       FINANCIAL SUMMARY
    ========================================= */

    function getSupplierFinancials(
        supplier
    ) {

        const purchases =
            getSupplierPurchases(
                supplier
            );


        let totalValue =
            0;


        let totalDue =
            0;


        purchases.forEach(
            function (purchase) {

                totalValue +=
                    Number(
                        purchase.totalPrice ||
                        0
                    );


                totalDue +=
                    Number(
                        purchase.dueAmount ||
                        0
                    );

            }
        );


        return {

            count:
                purchases.length,

            totalValue:
                totalValue,

            totalDue:
                totalDue

        };

    }


    /* =========================================
       SUMMARY CARDS
    ========================================= */

    function updateSummaryCards() {

        const farmerCount =
            suppliers.filter(
                function (supplier) {

                    return (
                        supplier.type ===
                        "farmer"
                    );

                }
            ).length;


        const supplierCount =
            suppliers.filter(
                function (supplier) {

                    return (
                        supplier.type ===
                        "supplier"
                    );

                }
            ).length;


        let totalDue =
            0;


        suppliers.forEach(
            function (supplier) {

                totalDue +=
                    getSupplierFinancials(
                        supplier
                    ).totalDue;

            }
        );


        totalFarmersValue.textContent =
            farmerCount;


        totalSuppliersValue.textContent =
            supplierCount;


        supplierDueValue.textContent =
            formatMoney(
                totalDue
            );

    }


    /* =========================================
       DISPLAY TABLE
    ========================================= */

    function displaySuppliers() {

        const searchText =
            supplierSearch.value
                .trim()
                .toLowerCase();


        const typeFilter =
            supplierTypeFilter.value;


        const filtered =
            suppliers.filter(
                function (supplier) {

                    const searchable = `
                        ${supplier.name}
                        ${supplier.phone}
                        ${supplier.division}
                        ${supplier.district}
                        ${supplier.upazila}
                        ${supplier.address}
                    `.toLowerCase();


                    const matchesSearch =
                        searchable.includes(
                            searchText
                        );


                    const matchesType =

                        typeFilter === "all" ||

                        supplier.type ===
                        typeFilter;


                    return (
                        matchesSearch &&
                        matchesType
                    );

                }
            );


        supplierTableBody.innerHTML =
            "";


        if (
            filtered.length ===
            0
        ) {

            supplierTableBody.innerHTML = `

                <tr class="supplier-empty-row">

                    <td colspan="10">

                        No farmer or supplier
                        matches the current search.

                    </td>

                </tr>

            `;


            return;

        }


        filtered.forEach(
            function (supplier) {

                const financials =
                    getSupplierFinancials(
                        supplier
                    );


                const hasDue =
                    financials.totalDue > 0;


                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>

                        <strong>
                            ${escapeHTML(
                                supplier.supplierCode
                            )}
                        </strong>

                    </td>


                    <td>

                        <span class="partner-name">

                            ${escapeHTML(
                                supplier.name
                            )}

                        </span>

                    </td>


                    <td>

                        <span
                            class="
                                partner-type-badge
                                ${
                                    supplier.type ===
                                    "farmer"

                                        ?

                                        "partner-farmer"

                                        :

                                        "partner-supplier"
                                }
                            "
                        >

                            ${
                                supplier.type ===
                                "farmer"

                                    ?

                                    "Farmer"

                                    :

                                    "Supplier"
                            }

                        </span>

                    </td>


                    <td>

                        ${escapeHTML(
                            supplier.phone
                        )}

                    </td>


                    <td>

                        <span class="location-primary">

                            ${escapeHTML(
                                supplier.upazila
                            )},
                            ${escapeHTML(
                                supplier.district
                            )}

                        </span>


                        <span class="location-secondary">

                            ${escapeHTML(
                                supplier.division
                            )}
                            Division

                        </span>


                        <span
                            class="location-address"
                            title="${escapeHTML(
                                supplier.address
                            )}"
                        >

                            ${escapeHTML(
                                supplier.address
                            )}

                        </span>

                    </td>


                    <td>

                        ${financials.count}

                    </td>


                    <td>

                        ${formatMoney(
                            financials.totalValue
                        )}

                    </td>


                    <td>

                        ${formatMoney(
                            financials.totalDue
                        )}

                    </td>


                    <td>

                        <span
                            class="
                                partner-payment-status
                                ${
                                    hasDue

                                        ?

                                        "partner-due"

                                        :

                                        "partner-clear"
                                }
                            "
                        >

                            ${
                                hasDue

                                    ?

                                    "Due"

                                    :

                                    "Clear"
                            }

                        </span>

                    </td>


                    <td class="supplier-action-cell">

                        <button
                            class="partner-history-button"
                            type="button"
                            data-action="history"
                            data-id="${supplier.id}"
                        >
                            History
                        </button>


                        <button
                            class="partner-edit-button"
                            type="button"
                            data-action="edit"
                            data-id="${supplier.id}"
                        >
                            Edit
                        </button>


                        <button
                            class="partner-delete-button"
                            type="button"
                            data-action="delete"
                            data-id="${supplier.id}"
                        >
                            Delete
                        </button>

                    </td>

                `;


                supplierTableBody.appendChild(
                    row
                );

            }
        );

    }


    /* =========================================
       INTERNAL SUPPLIER ID
    ========================================= */

    function createInternalSupplierId() {

        return Date.now();

    }


    /* =========================================
       PHONE NORMALIZATION
    ========================================= */

    function normalizePhone(phone) {

        return String(
            phone
        ).replace(
            /\s+/g,
            ""
        );

    }


    /* =========================================
       VALIDATION
    ========================================= */

    function validateForm() {

        const name =
            supplierNameInput.value
                .trim();


        const phone =
            normalizePhone(
                supplierPhoneInput.value
            );


        if (
            name.length < 2
        ) {

            return (
                "Please enter a valid farmer or supplier name."
            );

        }


        if (
            !/^01[3-9]\d{8}$/.test(
                phone
            )
        ) {

            return (
                "Enter a valid 11-digit Bangladesh mobile number."
            );

        }


        const duplicatePhone =
            suppliers.some(
                function (supplier) {

                    return (

                        normalizePhone(
                            supplier.phone
                        ) ===
                        phone

                        &&

                        Number(
                            supplier.id
                        ) !==

                        Number(
                            editingSupplierId
                        )

                    );

                }
            );


        if (duplicatePhone) {

            return (
                "This phone number is already used by another farmer or supplier."
            );

        }


        if (
            !supplierTypeSelect.value
        ) {

            return (
                "Please select Farmer or Supplier."
            );

        }


        if (!manualLocationMode) {

            if (
                !supplierDivisionSelect.value
            ) {

                return (
                    "Please select a division."
                );

            }


            if (
                !supplierDistrictSelect.value
            ) {

                return (
                    "Please select a district."
                );

            }


            if (
                !supplierUpazilaSelect.value
            ) {

                return (
                    "Please select an upazila or thana."
                );

            }


            if (
                supplierUpazilaSelect.value ===
                "__manual__"

                &&

                manualAreaInput.value
                    .trim()
                    .length < 2
            ) {

                return (
                    "Please enter the city area or thana."
                );

            }

        }
        else {

            if (
                manualDivisionInput.value
                    .trim()
                    .length < 2
            ) {

                return (
                    "Please enter a division."
                );

            }


            if (
                manualDistrictInput.value
                    .trim()
                    .length < 2
            ) {

                return (
                    "Please enter a district."
                );

            }


            if (
                manualUpazilaInput.value
                    .trim()
                    .length < 2
            ) {

                return (
                    "Please enter an upazila or thana."
                );

            }

        }


        if (
            supplierAddressInput.value
                .trim()
                .length < 3
        ) {

            return (
                "Please enter the detailed address."
            );

        }


        return "";

    }


    /* =========================================
       BUILD SUPPLIER RECORD
    ========================================= */

    function buildSupplierRecord(
        existingSupplier = null
    ) {

        const location =
            getLocationValues();


        return {

            id:

                existingSupplier

                    ?

                    existingSupplier.id

                    :

                    createInternalSupplierId(),


            supplierCode:

                existingSupplier

                    ?

                    existingSupplier.supplierCode

                    :

                    getNextSupplierCode(),


            name:
                supplierNameInput.value
                    .trim(),


            phone:
                normalizePhone(
                    supplierPhoneInput.value
                ),


            type:
                supplierTypeSelect.value,


            divisionId:
                location.divisionId,


            division:
                location.division,


            districtId:
                location.districtId,


            district:
                location.district,


            upazilaId:
                location.upazilaId,


            upazila:
                location.upazila,


            address:
                supplierAddressInput.value
                    .trim()

        };

    }


    /* =========================================
       ADD MODE
    ========================================= */

    function setAddMode() {

        editingSupplierId =
            null;


        supplierFormTitle.textContent =
            "Add Farmer / Supplier";


        saveSupplierBtn.innerHTML = `

            <span aria-hidden="true">
                ▣
            </span>

            Save Partner

        `;


        cancelSupplierEditBtn.hidden =
            true;

    }


    /* =========================================
       RESET LOCATION
    ========================================= */

    function resetLocationFields() {

        manualAreaField.hidden =
            true;


        manualAreaInput.value =
            "";


        manualAreaInput.required =
            false;


        if (manualLocationMode) {

            manualDivisionInput.value =
                "";

            manualDistrictInput.value =
                "";

            manualUpazilaInput.value =
                "";

            return;

        }


        populateDivisions();


        supplierDistrictSelect.innerHTML = `

            <option
                value=""
                selected
                disabled
            >
                Select division first
            </option>

        `;


        supplierDistrictSelect.disabled =
            true;


        supplierUpazilaSelect.innerHTML = `

            <option
                value=""
                selected
                disabled
            >
                Select district first
            </option>

        `;


        supplierUpazilaSelect.disabled =
            true;

    }


    /* =========================================
       RESET FORM
    ========================================= */

    function resetSupplierForm() {

        supplierForm.reset();


        resetLocationFields();


        setAddMode();

    }


    /* =========================================
       LOAD LOCATION FOR EDIT
    ========================================= */

    function loadSupplierLocationForEdit(
        supplier
    ) {

        if (
            manualLocationMode ||
            !locationReady
        ) {

            manualDivisionInput.value =

                supplier.division ===
                "Not Recorded"

                    ?

                    ""

                    :

                    supplier.division;


            manualDistrictInput.value =

                supplier.district ===
                "Not Recorded"

                    ?

                    ""

                    :

                    supplier.district;


            manualUpazilaInput.value =

                supplier.upazila ===
                "Not Recorded"

                    ?

                    ""

                    :

                    supplier.upazila;


            return;

        }


        populateDivisions(
            supplier.divisionId,
            supplier.division
        );


        populateDistricts(
            supplier.districtId,
            supplier.district
        );


        populateUpazilas(
            supplier.upazilaId,
            supplier.upazila
        );

    }


    /* =========================================
       EDIT SUPPLIER
    ========================================= */

    function editSupplier(id) {

        const supplier =
            suppliers.find(
                function (item) {

                    return (
                        Number(
                            item.id
                        ) ===
                        Number(id)
                    );

                }
            );


        if (!supplier) {

            showToast(
                "Farmer or supplier record not found.",
                "error"
            );

            return;

        }


        editingSupplierId =
            supplier.id;


        supplierNameInput.value =
            supplier.name;


        supplierPhoneInput.value =
            supplier.phone;


        supplierTypeSelect.value =
            supplier.type;


        supplierAddressInput.value =
            supplier.address;


        loadSupplierLocationForEdit(
            supplier
        );


        supplierFormTitle.textContent =
            "Edit Farmer / Supplier";


        saveSupplierBtn.innerHTML = `

            <span aria-hidden="true">
                ✓
            </span>

            Update Partner

        `;


        cancelSupplierEditBtn.hidden =
            false;


        supplierForm.scrollIntoView(
            {
                behavior: "smooth",
                block: "center"
            }
        );

    }


    /* =========================================
       DELETE SUPPLIER
    ========================================= */

    function deleteSupplier(id) {

        const supplier =
            suppliers.find(
                function (item) {

                    return (
                        Number(
                            item.id
                        ) ===
                        Number(id)
                    );

                }
            );


        if (!supplier) {
            return;
        }


        const linkedPurchases =
            getSupplierPurchases(
                supplier
            );


        if (
            linkedPurchases.length > 0
        ) {

            showToast(
                "This partner already has purchase records. Keep the record to preserve purchase history.",
                "error"
            );

            return;

        }


        const confirmed =
            window.confirm(
                `Delete ${supplier.name}?`
            );


        if (!confirmed) {
            return;
        }


        suppliers =
            suppliers.filter(
                function (item) {

                    return (
                        Number(
                            item.id
                        ) !==
                        Number(id)
                    );

                }
            );


        saveSuppliers();

        updateSummaryCards();

        displaySuppliers();


        if (
            Number(
                editingSupplierId
            ) ===
            Number(id)
        ) {

            resetSupplierForm();

        }


        showToast(
            "Farmer / supplier deleted successfully."
        );

    }


    /* =========================================
       PURCHASE HISTORY
    ========================================= */

    function showPurchaseHistory(id) {

        const supplier =
            suppliers.find(
                function (item) {

                    return (
                        Number(
                            item.id
                        ) ===
                        Number(id)
                    );

                }
            );


        if (!supplier) {
            return;
        }


        const purchases =
            getSupplierPurchases(
                supplier
            );


        const financials =
            getSupplierFinancials(
                supplier
            );


        historyModalSubtitle.textContent =

            `${supplier.name} · ${supplier.upazila}, ${supplier.district}`;


        historyPurchaseCount.textContent =
            purchases.length;


        historyPurchaseValue.textContent =
            formatMoney(
                financials.totalValue
            );


        historyDueValue.textContent =
            formatMoney(
                financials.totalDue
            );


        historyTableBody.innerHTML =
            "";


        if (
            purchases.length === 0
        ) {

            historyTableBody.innerHTML = `

                <tr>

                    <td
                        colspan="7"
                        style="
                            text-align:center;
                            padding:28px;
                            color:#7d8780;
                        "
                    >
                        No paddy purchases have been
                        recorded for this partner.
                    </td>

                </tr>

            `;

        }
        else {

            [...purchases]

                .sort(
                    function (a, b) {

                        return String(
                            b.purchaseDate ||
                            b.date ||
                            ""
                        ).localeCompare(
                            String(
                                a.purchaseDate ||
                                a.date ||
                                ""
                            )
                        );

                    }
                )

                .forEach(
                    function (purchase) {

                        const row =
                            document.createElement(
                                "tr"
                            );


                        row.innerHTML = `

                            <td>
                                ${escapeHTML(
                                    purchase.purchaseId ||
                                    "—"
                                )}
                            </td>


                            <td>
                                ${formatDate(
                                    purchase.purchaseDate ||
                                    purchase.date
                                )}
                            </td>


                            <td>
                                ${escapeHTML(
                                    purchase.paddyType ||
                                    "—"
                                )}
                            </td>


                            <td>
                                ${formatNumber(
                                    purchase.weight
                                )} kg
                            </td>


                            <td>
                                ${formatMoney(
                                    purchase.totalPrice
                                )}
                            </td>


                            <td>

                                ${
                                    purchase.payment ===
                                    "paid"

                                        ?

                                        "Paid"

                                        :

                                        purchase.payment ===
                                        "partial"

                                            ?

                                            "Partially Paid"

                                            :

                                            "Due"
                                }

                            </td>


                            <td>
                                ${formatMoney(
                                    purchase.dueAmount
                                )}
                            </td>

                        `;


                        historyTableBody.appendChild(
                            row
                        );

                    }
                );

        }


        historyModalBackdrop.hidden =
            false;


        document.body.style.overflow =
            "hidden";

    }


    /* =========================================
       CLOSE HISTORY
    ========================================= */

    function closePurchaseHistory() {

        historyModalBackdrop.hidden =
            true;


        document.body.style.overflow =
            "";

    }


    /* =========================================
       TOAST
    ========================================= */

    function showToast(
        message,
        type = "success"
    ) {

        const oldToast =
            document.querySelector(
                ".supplier-toast"
            );


        if (oldToast) {
            oldToast.remove();
        }


        const toast =
            document.createElement(
                "div"
            );


        toast.className =
            `supplier-toast ${type}`;


        toast.innerHTML = `

            <span class="supplier-toast-icon">

                ${
                    type === "error"
                        ? "!"
                        : "✓"
                }

            </span>


            <span>
                ${escapeHTML(message)}
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
       FORM SUBMIT
    ========================================= */

    supplierForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const errorMessage =
                validateForm();


            if (errorMessage) {

                showToast(
                    errorMessage,
                    "error"
                );

                return;

            }


            if (
                editingSupplierId !==
                null
            ) {

                const index =
                    suppliers.findIndex(
                        function (supplier) {

                            return (
                                Number(
                                    supplier.id
                                ) ===

                                Number(
                                    editingSupplierId
                                )
                            );

                        }
                    );


                if (
                    index === -1
                ) {

                    showToast(
                        "Farmer or supplier record not found.",
                        "error"
                    );

                    return;

                }


                suppliers[index] =
                    buildSupplierRecord(
                        suppliers[index]
                    );


                showToast(
                    "Farmer / supplier updated successfully."
                );

            }
            else {

                suppliers.push(
                    buildSupplierRecord()
                );


                showToast(
                    "Farmer / supplier saved successfully."
                );

            }


            saveSuppliers();

            updateSummaryCards();

            displaySuppliers();

            resetSupplierForm();

        }
    );


    /* =========================================
       CANCEL EDIT
    ========================================= */

    cancelSupplierEditBtn.addEventListener(
        "click",
        function () {

            resetSupplierForm();


            showToast(
                "Edit cancelled."
            );

        }
    );


    /* =========================================
       SEARCH / FILTER
    ========================================= */

    supplierSearch.addEventListener(
        "input",
        displaySuppliers
    );


    supplierTypeFilter.addEventListener(
        "change",
        displaySuppliers
    );


    /* =========================================
       TABLE ACTIONS
    ========================================= */

    supplierTableBody.addEventListener(
        "click",
        function (event) {

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
                action === "history"
            ) {

                showPurchaseHistory(id);

            }


            if (
                action === "edit"
            ) {

                editSupplier(id);

            }


            if (
                action === "delete"
            ) {

                deleteSupplier(id);

            }

        }
    );


    /* =========================================
       HISTORY MODAL
    ========================================= */

    closeHistoryModalBtn.addEventListener(
        "click",
        closePurchaseHistory
    );


    historyModalBackdrop.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                historyModalBackdrop
            ) {

                closePurchaseHistory();

            }

        }
    );


    /* =========================================
       MOBILE SIDEBAR
    ========================================= */

    function openSidebar() {

        if (!sidebar) {
            return;
        }


        sidebar.classList.add(
            "open"
        );


        if (sidebarBackdrop) {

            sidebarBackdrop.classList.add(
                "show"
            );

        }


        if (menuButton) {

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


        if (sidebarBackdrop) {

            sidebarBackdrop.classList.remove(
                "show"
            );

        }


        if (menuButton) {

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

        }


        if (
            historyModalBackdrop.hidden
        ) {

            document.body.style.overflow =
                "";

        }

    }


    if (menuButton) {

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


    if (sidebarBackdrop) {

        sidebarBackdrop.addEventListener(
            "click",
            closeSidebar
        );

    }


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
                !historyModalBackdrop.hidden
            ) {

                closePurchaseHistory();

                return;

            }


            closeSidebar();

        }
    );


    window.addEventListener(
        "resize",
        function () {

            if (
                window.innerWidth > 1000
            ) {

                closeSidebar();

            }

        }
    );


    /* =========================================
       INITIALIZE
    ========================================= */

    setAddMode();

    updateSummaryCards();

    displaySuppliers();

    initializeLocationData();

});