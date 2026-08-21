document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       SMART RICE MILL ERP
       TRUCK & DELIVERY MANAGEMENT

       RESEARCH / DESIGN BASIS

       1. Md. Saiful Islam (2026)
          Web-based Real-time Bus Tracking System
          for Enhanced Commuter Experience and
          Efficient Fleet Management.
          DOI: 10.2139/ssrn.6766801

          Supports:
          - GPS location updates
          - web-based tracking
          - estimated arrival information
          - route / fleet monitoring

       2. Azis, Irjayanti & Murti (2026)
          Advancing Traceability and Sustainability
          through a Digital Information System in
          Indonesia's Rice Supply Chain.
          DOI: 10.1007/s43621-025-02544-4

          Supports:
          - distribution monitoring
          - real-time data
          - digital documentation
          - rice-flow traceability

       IMPLEMENTATION

       - Leaflet + OpenStreetMap
       - Nominatim address geocoding
       - OSRM road routing

       IMPORTANT:
       Browser GPS capture demonstrates the
       coordinate-update workflow.

       True multi-device real-time GPS tracking
       requires the backend/API to receive
       coordinates from the driver's device.
    ========================================= */


    /* =========================================
       MILL LOCATION

       Existing project starting location:
       Karimganj, Kishoreganj
    ========================================= */

    const MILL_LOCATION = {

        name:
            "Karimganj, Kishoreganj",

        address:
            "Karimganj, Kishoreganj, Dhaka Division, Bangladesh",

        lat:
            24.4701,

        lng:
            90.8771

    };


    /* =========================================
       LOCATION SERVICES
    ========================================= */

    const BD_API_BASE =
        "https://bdapis.com/api/v1.2";


    const NOMINATIM_URL =
        "https://nominatim.openstreetmap.org/search";


    const OSRM_URL =
        "https://router.project-osrm.org/route/v1/driving";


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
       DEMO FLEET

       These are prototype fleet records.
       Later they can be replaced by a separate
       Fleet / Vehicle Management module.
    ========================================= */

    const DEFAULT_TRUCKS = [

        {
            id:
                "TRK-001",

            number:
                "Dhaka Metro-Ta 11-1234",

            capacityKg:
                3000
        },


        {
            id:
                "TRK-002",

            number:
                "Dhaka Metro-Ta 12-5678",

            capacityKg:
                5000
        },


        {
            id:
                "TRK-003",

            number:
                "Kishoreganj-Ta 11-2468",

            capacityKg:
                2500
        }

    ];


    const DEFAULT_DRIVERS = [

        {
            id:
                "DRV-001",

            name:
                "Rahim Uddin",

            phone:
                "01711000001"
        },


        {
            id:
                "DRV-002",

            name:
                "Karim Mia",

            phone:
                "01711000002"
        },


        {
            id:
                "DRV-003",

            name:
                "Hasan Ali",

            phone:
                "01711000003"
        }

    ];


    /* =========================================
       ELEMENTS
    ========================================= */

    const deliveryForm =
        document.getElementById(
            "deliveryForm"
        );


    if (!deliveryForm) {
        return;
    }


    const deliveryInvoiceSelect =
        document.getElementById(
            "deliveryInvoice"
        );


    const deliveryCustomerInput =
        document.getElementById(
            "deliveryCustomer"
        );


    const deliveryPhoneInput =
        document.getElementById(
            "deliveryPhone"
        );


    const deliveryDivisionSelect =
        document.getElementById(
            "deliveryDivision"
        );


    const deliveryDistrictSelect =
        document.getElementById(
            "deliveryDistrict"
        );


    const deliveryUpazilaSelect =
        document.getElementById(
            "deliveryUpazila"
        );


    const deliveryAddressInput =
        document.getElementById(
            "deliveryAddress"
        );


    const deliveryTruckSelect =
        document.getElementById(
            "deliveryTruck"
        );


    const deliveryDriverSelect =
        document.getElementById(
            "deliveryDriver"
        );


    const deliveryProductInput =
        document.getElementById(
            "deliveryProduct"
        );


    const deliveryQuantityInput =
        document.getElementById(
            "deliveryQuantity"
        );


    const truckCapacityHelp =
        document.getElementById(
            "truckCapacityHelp"
        );


    const previewRouteBtn =
        document.getElementById(
            "previewRouteBtn"
        );


    const runningDeliveriesValue =
        document.getElementById(
            "runningDeliveriesValue"
        );


    const deliveredTodayValue =
        document.getElementById(
            "deliveredTodayValue"
        );


    const pendingDeliveriesValue =
        document.getElementById(
            "pendingDeliveriesValue"
        );


    const routePlannerDescription =
        document.getElementById(
            "routePlannerDescription"
        );


    const destinationMetric =
        document.getElementById(
            "destinationMetric"
        );


    const distanceMetric =
        document.getElementById(
            "distanceMetric"
        );


    const durationMetric =
        document.getElementById(
            "durationMetric"
        );


    const resetMapBtn =
        document.getElementById(
            "resetMapBtn"
        );


    const trackingDeliveryValue =
        document.getElementById(
            "trackingDeliveryValue"
        );


    const currentPositionValue =
        document.getElementById(
            "currentPositionValue"
        );


    const gpsUpdateValue =
        document.getElementById(
            "gpsUpdateValue"
        );


    const captureGpsBtn =
        document.getElementById(
            "captureGpsBtn"
        );


    const deliverySearch =
        document.getElementById(
            "deliverySearch"
        );


    const deliveryStatusFilter =
        document.getElementById(
            "deliveryStatusFilter"
        );


    const deliveryTableBody =
        document.getElementById(
            "deliveryTableBody"
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

    let currentDivisionDistricts =
        [];


    let currentRouteInfo =
        null;


    let selectedTrackingDeliveryId =
        null;


    let pendingCancelDeliveryId =
        null;


    /* =========================================
       MAP STATE
    ========================================= */

    let map =
        null;


    let millMarker =
        null;


    let destinationMarker =
        null;


    let truckMarker =
        null;


    let routeLayer =
        null;


    /* =========================================
       STORAGE
    ========================================= */

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
       DATE
    ========================================= */

    function getTodayDate() {

        const today =
            new Date();


        const year =
            today.getFullYear();


        const month =
            String(
                today.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        const day =
            String(
                today.getDate()
            ).padStart(
                2,
                "0"
            );


        return (
            `${year}-${month}-${day}`
        );

    }


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


    function formatDateTime(value) {

        if (!value) {

            return "—";

        }


        const date =
            new Date(
                value
            );


        return date.toLocaleString(
            "en-GB",
            {
                day:
                    "2-digit",

                month:
                    "short",

                year:
                    "numeric",

                hour:
                    "2-digit",

                minute:
                    "2-digit"
            }
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
                maximumFractionDigits:
                    2
            }
        );

    }


    /* =========================================
       SALES RECORDS
    ========================================= */

    function getSalesRecords() {

        let records =
            safeParseStorage(
                "salesRecords",
                null
            );


        if (
            !Array.isArray(
                records
            )
        ) {

            records =
                safeParseStorage(
                    "sales",
                    []
                );

        }


        return Array.isArray(
            records
        )
            ? records
            : [];

    }


    let salesRecords =
        getSalesRecords();


    function saveSalesRecords() {

        localStorage.setItem(
            "salesRecords",
            JSON.stringify(
                salesRecords
            )
        );

    }


    /* =========================================
       CUSTOMERS
    ========================================= */

    function getCustomers() {

        let records =
            safeParseStorage(
                "customers",
                null
            );


        if (
            !Array.isArray(
                records
            )
        ) {

            records =
                safeParseStorage(
                    "customerRecords",
                    []
                );

        }


        return Array.isArray(
            records
        )
            ? records
            : [];

    }


    let customers =
        getCustomers();


    /* =========================================
       FLEET
    ========================================= */

    function loadFleetTrucks() {

        const stored =
            safeParseStorage(
                "fleetTrucks",
                null
            );


        if (
            Array.isArray(stored) &&
            stored.length >
            0
        ) {

            return stored;

        }


        localStorage.setItem(
            "fleetTrucks",
            JSON.stringify(
                DEFAULT_TRUCKS
            )
        );


        return [
            ...DEFAULT_TRUCKS
        ];

    }


    function loadFleetDrivers() {

        const stored =
            safeParseStorage(
                "fleetDrivers",
                null
            );


        if (
            Array.isArray(stored) &&
            stored.length >
            0
        ) {

            return stored;

        }


        localStorage.setItem(
            "fleetDrivers",
            JSON.stringify(
                DEFAULT_DRIVERS
            )
        );


        return [
            ...DEFAULT_DRIVERS
        ];

    }


    let trucks =
        loadFleetTrucks();


    let drivers =
        loadFleetDrivers();


    /* =========================================
       DELIVERY RECORDS
    ========================================= */

    function loadDeliveries() {

        let records =
            safeParseStorage(
                "deliveryRecords",
                null
            );


        if (
            !Array.isArray(
                records
            )
        ) {

            records =
                safeParseStorage(
                    "deliveries",
                    []
                );

        }


        if (
            !Array.isArray(
                records
            )
        ) {

            return [];

        }


        return records.map(
            function (
                delivery,
                index
            ) {

                return {

                    id:

                        delivery.id ??
                        Date.now() +
                        index,


                    deliveryId:

                        delivery.deliveryId ||
                        `DLV-${String(
                            index + 1
                        ).padStart(
                            3,
                            "0"
                        )}`,


                    invoiceId:

                        delivery.invoiceId ||
                        delivery.invoice ||
                        "",


                    saleId:

                        delivery.saleId ||
                        null,


                    customerId:

                        delivery.customerId ||
                        null,


                    customerName:

                        delivery.customerName ||
                        delivery.customer ||
                        "",


                    customerPhone:

                        delivery.customerPhone ||
                        "",


                    productKey:

                        delivery.productKey ||
                        "",


                    product:

                        delivery.product ||
                        "",


                    quantityKg:

                        Number(
                            delivery.quantityKg ||
                            delivery.quantity ||
                            0
                        ),


                    truckId:

                        delivery.truckId ||
                        "",


                    truckNumber:

                        delivery.truckNumber ||
                        delivery.truck ||
                        "",


                    truckCapacityKg:

                        Number(
                            delivery.truckCapacityKg ||
                            0
                        ),


                    driverId:

                        delivery.driverId ||
                        "",


                    driverName:

                        delivery.driverName ||
                        delivery.driver ||
                        "",


                    driverPhone:

                        delivery.driverPhone ||
                        "",


                    division:

                        delivery.division ||
                        "",


                    district:

                        delivery.district ||
                        "",


                    upazila:

                        delivery.upazila ||
                        "",


                    address:

                        delivery.address ||
                        "",


                    destinationLat:

                        Number(
                            delivery.destinationLat ||
                            0
                        ),


                    destinationLng:

                        Number(
                            delivery.destinationLng ||
                            0
                        ),


                    distanceKm:

                        Number(
                            delivery.distanceKm ||
                            0
                        ),


                    durationMinutes:

                        Number(
                            delivery.durationMinutes ||
                            0
                        ),


                    status:

                        delivery.status ||
                        "pending",


                    deliveryDate:

                        delivery.deliveryDate ||
                        delivery.date ||
                        getTodayDate(),


                    dispatchDate:

                        delivery.dispatchDate ||
                        null,


                    startDate:

                        delivery.startDate ||
                        null,


                    deliveredDate:

                        delivery.deliveredDate ||
                        null,


                    cancelledDate:

                        delivery.cancelledDate ||
                        null,


                    currentLat:

                        delivery.currentLat !==
                        undefined

                            ?

                            Number(
                                delivery.currentLat
                            )

                            :

                            null,


                    currentLng:

                        delivery.currentLng !==
                        undefined

                            ?

                            Number(
                                delivery.currentLng
                            )

                            :

                            null,


                    lastLocationUpdate:

                        delivery.lastLocationUpdate ||
                        null,


                    createdAt:

                        delivery.createdAt ||
                        delivery.id ||
                        Date.now()

                };

            }
        );

    }


    let deliveryRecords =
        loadDeliveries();


    function saveDeliveries() {

        localStorage.setItem(
            "deliveryRecords",
            JSON.stringify(
                deliveryRecords
            )
        );

    }


    /* =========================================
       DELIVERY ID
    ========================================= */

    function generateDeliveryId() {

        const numbers =
            deliveryRecords

                .map(
                    function (
                        delivery
                    ) {

                        const match =
                            String(
                                delivery.deliveryId ||
                                ""
                            ).match(
                                /^DLV-(\d+)$/i
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


        const next =

            numbers.length >
            0

                ?

                Math.max(
                    ...numbers
                ) + 1

                :

                1;


        return (

            `DLV-${String(
                next
            ).padStart(
                3,
                "0"
            )}`

        );

    }


    /* =========================================
       FIND DATA
    ========================================= */

    function findSaleByInvoice(
        invoiceId
    ) {

        return salesRecords.find(
            function (
                sale
            ) {

                const code =

                    sale.invoiceId ||
                    sale.invoiceNumber ||
                    sale.saleId;


                return (
                    String(
                        code
                    )

                    ===

                    String(
                        invoiceId
                    )
                );

            }
        );

    }


    function findCustomerForSale(
        sale
    ) {

        if (!sale) {

            return null;

        }


        const byInternalId =
            customers.find(
                function (
                    customer
                ) {

                    return (

                        sale.customerId !==
                        undefined

                        &&

                        String(
                            customer.id
                        )

                        ===

                        String(
                            sale.customerId
                        )

                    );

                }
            );


        if (
            byInternalId
        ) {

            return byInternalId;

        }


        const saleName =
            String(
                sale.customerName ||
                sale.customer ||
                ""
            )
            .trim()
            .toLowerCase();


        return customers.find(
            function (
                customer
            ) {

                return (

                    String(
                        customer.name ||
                        customer.customerName ||
                        ""
                    )
                    .trim()
                    .toLowerCase()

                    ===

                    saleName

                );

            }
        ) || null;

    }


    function findTruck(
        id
    ) {

        return trucks.find(
            function (
                truck
            ) {

                return (
                    String(
                        truck.id
                    )

                    ===

                    String(
                        id
                    )
                );

            }
        );

    }


    function findDriver(
        id
    ) {

        return drivers.find(
            function (
                driver
            ) {

                return (
                    String(
                        driver.id
                    )

                    ===

                    String(
                        id
                    )
                );

            }
        );

    }


    function findDelivery(
        id
    ) {

        return deliveryRecords.find(
            function (
                delivery
            ) {

                return (

                    Number(
                        delivery.id
                    )

                    ===

                    Number(
                        id
                    )

                );

            }
        );

    }


    /* =========================================
       DELIVERY REQUIRED
    ========================================= */

    function requiresDelivery(
        sale
    ) {

        return (

            sale.deliveryRequired ===
            true

            ||

            String(
                sale.deliveryRequired ||
                sale.delivery ||
                ""
            ).toLowerCase() ===
            "yes"

        );

    }


    /* =========================================
       INVOICE ALREADY ASSIGNED
    ========================================= */

    function invoiceHasCurrentDelivery(
        invoiceId
    ) {

        return deliveryRecords.some(
            function (
                delivery
            ) {

                return (

                    String(
                        delivery.invoiceId
                    )

                    ===

                    String(
                        invoiceId
                    )

                    &&

                    delivery.status !==
                    "cancelled"

                );

            }
        );

    }


    /* =========================================
       ELIGIBLE INVOICES
    ========================================= */

    function getEligibleInvoices() {

        return salesRecords.filter(
            function (
                sale
            ) {

                const invoiceId =

                    sale.invoiceId ||
                    sale.invoiceNumber ||
                    sale.saleId;


                if (
                    !invoiceId
                ) {

                    return false;

                }


                if (
                    sale.status ===
                    "voided"
                ) {

                    return false;

                }


                if (
                    !requiresDelivery(
                        sale
                    )
                ) {

                    return false;

                }


                if (
                    invoiceHasCurrentDelivery(
                        invoiceId
                    )
                ) {

                    return false;

                }


                return true;

            }
        );

    }


    /* =========================================
       POPULATE INVOICES
    ========================================= */

    function populateInvoices() {

        const previousValue =
            deliveryInvoiceSelect.value;


        deliveryInvoiceSelect.innerHTML = `

            <option value=""
                    selected
                    disabled>

                Select delivery invoice

            </option>

        `;


        const eligible =
            getEligibleInvoices();


        eligible.forEach(
            function (
                sale
            ) {

                const invoiceId =

                    sale.invoiceId ||
                    sale.invoiceNumber ||
                    sale.saleId;


                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    invoiceId;


                option.textContent =

                    `${invoiceId} — ${sale.customerName || "Customer"} — ${formatNumber(
                        sale.quantityKg ||
                        sale.quantity ||
                        0
                    )} kg`;


                deliveryInvoiceSelect.appendChild(
                    option
                );

            }
        );


        if (
            eligible.length ===
            0
        ) {

            const option =
                document.createElement(
                    "option"
                );


            option.disabled =
                true;


            option.textContent =
                "No unassigned delivery-required invoices";


            deliveryInvoiceSelect.appendChild(
                option
            );

        }


        if (
            previousValue &&
            eligible.some(
                function (
                    sale
                ) {

                    return (

                        String(
                            sale.invoiceId
                        )

                        ===

                        String(
                            previousValue
                        )

                    );

                }
            )
        ) {

            deliveryInvoiceSelect.value =
                previousValue;

        }

    }


    /* =========================================
       RESOURCE AVAILABILITY
    ========================================= */

    function isActiveDeliveryStatus(
        status
    ) {

        return (

            status ===
            "pending"

            ||

            status ===
            "dispatched"

            ||

            status ===
            "on-way"

        );

    }


    function isTruckBusy(
        truckId
    ) {

        return deliveryRecords.some(
            function (
                delivery
            ) {

                return (

                    String(
                        delivery.truckId
                    )

                    ===

                    String(
                        truckId
                    )

                    &&

                    isActiveDeliveryStatus(
                        delivery.status
                    )

                );

            }
        );

    }


    function isDriverBusy(
        driverId
    ) {

        return deliveryRecords.some(
            function (
                delivery
            ) {

                return (

                    String(
                        delivery.driverId
                    )

                    ===

                    String(
                        driverId
                    )

                    &&

                    isActiveDeliveryStatus(
                        delivery.status
                    )

                );

            }
        );

    }


    /* =========================================
       POPULATE FLEET
    ========================================= */

    function populateTrucks() {

        deliveryTruckSelect.innerHTML = `

            <option value=""
                    selected
                    disabled>

                Select available truck

            </option>

        `;


        trucks.forEach(
            function (
                truck
            ) {

                const option =
                    document.createElement(
                        "option"
                    );


                const busy =
                    isTruckBusy(
                        truck.id
                    );


                option.value =
                    truck.id;


                option.disabled =
                    busy;


                option.textContent =

                    `${truck.id} — ${truck.number} — ${formatNumber(
                        truck.capacityKg
                    )} kg${
                        busy
                            ? " — Busy"
                            : ""
                    }`;


                deliveryTruckSelect.appendChild(
                    option
                );

            }
        );

    }


    function populateDrivers() {

        deliveryDriverSelect.innerHTML = `

            <option value=""
                    selected
                    disabled>

                Select available driver

            </option>

        `;


        drivers.forEach(
            function (
                driver
            ) {

                const option =
                    document.createElement(
                        "option"
                    );


                const busy =
                    isDriverBusy(
                        driver.id
                    );


                option.value =
                    driver.id;


                option.disabled =
                    busy;


                option.textContent =

                    `${driver.id} — ${driver.name}${
                        busy
                            ? " — Busy"
                            : ""
                    }`;


                deliveryDriverSelect.appendChild(
                    option
                );

            }
        );

    }


    /* =========================================
       TRUCK CAPACITY HELP
    ========================================= */

    deliveryTruckSelect.addEventListener(
        "change",
        function () {

            const truck =
                findTruck(
                    deliveryTruckSelect.value
                );


            if (!truck) {

                truckCapacityHelp.textContent =
                    "Select a truck to view capacity.";


                return;

            }


            truckCapacityHelp.textContent =

                `Maximum payload: ${formatNumber(
                    truck.capacityKg
                )} kg`;

        }
    );


    /* =========================================
       LOCATION DROPDOWNS
    ========================================= */

    function populateDivisionDropdown() {

        deliveryDivisionSelect.innerHTML = `

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


                deliveryDivisionSelect.appendChild(
                    option
                );

            }
        );

    }


    function resetDistrictDropdown() {

        deliveryDistrictSelect.innerHTML = `

            <option value="">
                Select district
            </option>

        `;


        deliveryDistrictSelect.disabled =
            true;

    }


    function resetUpazilaDropdown() {

        deliveryUpazilaSelect.innerHTML = `

            <option value="">
                Select upazila
            </option>

        `;


        deliveryUpazilaSelect.disabled =
            true;

    }


    function getDivisionCacheKey(
        division
    ) {

        return (

            `bdLocationDivision_${String(
                division
            ).toLowerCase()}`

        );

    }


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
            Array.isArray(
                cached
            )

            &&

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
                    "Location service failed"
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
                    "No location data"
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
                "District data could not be loaded. Check your internet connection.",
                "error"
            );


            return [];

        }

    }


    function populateDistrictDropdown(
        districts,
        selectedDistrict = ""
    ) {

        resetDistrictDropdown();

        resetUpazilaDropdown();


        if (
            !Array.isArray(
                districts
            )

            ||

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


                deliveryDistrictSelect.appendChild(
                    option
                );

            }
        );


        deliveryDistrictSelect.disabled =
            false;


        if (
            selectedDistrict
        ) {

            deliveryDistrictSelect.value =
                selectedDistrict;

        }

    }


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
            !district

            ||

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


                deliveryUpazilaSelect.appendChild(
                    option
                );

            }
        );


        deliveryUpazilaSelect.disabled =
            false;


        if (
            selectedUpazila
        ) {

            deliveryUpazilaSelect.value =
                selectedUpazila;

        }

    }


    deliveryDivisionSelect.addEventListener(
        "change",
        async function () {

            resetDistrictDropdown();

            resetUpazilaDropdown();

            clearCurrentRoute();


            const districts =
                await loadDivisionData(
                    deliveryDivisionSelect.value
                );


            populateDistrictDropdown(
                districts
            );

        }
    );


    deliveryDistrictSelect.addEventListener(
        "change",
        function () {

            populateUpazilaDropdown(
                deliveryDistrictSelect.value
            );


            clearCurrentRoute();

        }
    );


    deliveryUpazilaSelect.addEventListener(
        "change",
        clearCurrentRoute
    );


    deliveryAddressInput.addEventListener(
        "input",
        clearCurrentRoute
    );


    /* =========================================
       LOAD INVOICE
    ========================================= */

    deliveryInvoiceSelect.addEventListener(
        "change",
        async function () {

            const sale =
                findSaleByInvoice(
                    deliveryInvoiceSelect.value
                );


            await loadSaleIntoForm(
                sale
            );

        }
    );


    async function loadSaleIntoForm(
        sale
    ) {

        clearCurrentRoute();


        if (!sale) {

            resetInvoiceDetails();

            return;

        }


        const customer =
            findCustomerForSale(
                sale
            );


        deliveryCustomerInput.value =

            sale.customerName ||
            customer?.name ||
            "";


        deliveryPhoneInput.value =

            sale.customerPhone ||
            customer?.phone ||
            "";


        deliveryProductInput.value =

            sale.product ||
            sale.productName ||
            sale.productKey ||
            "";


        deliveryQuantityInput.value =

            `${formatNumber(
                sale.quantityKg ||
                sale.quantity ||
                0
            )} kg`;


        if (!customer) {

            resetDestinationFields();


            routePlannerDescription.textContent =
                "Customer profile was not found. Enter the delivery destination manually.";


            return;

        }


        deliveryAddressInput.value =
            customer.address ||
            customer.detailedAddress ||
            "";


        const division =
            customer.division ||
            "";


        const district =
            customer.district ||
            "";


        const upazila =
            customer.upazila ||
            "";


        if (
            division
        ) {

            deliveryDivisionSelect.value =
                division;


            const districts =
                await loadDivisionData(
                    division
                );


            populateDistrictDropdown(
                districts,
                district
            );


            if (
                district
            ) {

                populateUpazilaDropdown(
                    district,
                    upazila
                );

            }

        }
        else {

            resetDistrictDropdown();

            resetUpazilaDropdown();

        }


        routePlannerDescription.textContent =

            `${sale.invoiceId || "Invoice"} customer destination loaded. Preview the road route before saving.`;


        if (
            division &&
            district &&
            upazila
        ) {

            await previewCurrentRoute(
                false
            );

        }

    }


    /* =========================================
       RESET INVOICE DETAILS
    ========================================= */

    function resetInvoiceDetails() {

        deliveryCustomerInput.value =
            "";


        deliveryPhoneInput.value =
            "";


        deliveryProductInput.value =
            "";


        deliveryQuantityInput.value =
            "";


        resetDestinationFields();


        clearCurrentRoute();

    }


    function resetDestinationFields() {

        deliveryDivisionSelect.value =
            "";


        resetDistrictDropdown();

        resetUpazilaDropdown();


        deliveryAddressInput.value =
            "";

    }


    /* =========================================
       MAP INITIALIZATION
    ========================================= */

    function initializeMap() {

        const mapElement =
            document.getElementById(
                "deliveryMap"
            );


        if (
            !window.L
        ) {

            mapElement.innerHTML =

                "<div style='padding:20px;'>Map library could not be loaded.</div>";


            return;

        }


        map =
            L.map(
                "deliveryMap"
            )
            .setView(
                [
                    MILL_LOCATION.lat,
                    MILL_LOCATION.lng
                ],
                8
            );


        L.tileLayer(
            "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom:
                    19,

                attribution:
                    "&copy; OpenStreetMap contributors"
            }
        )
        .addTo(
            map
        );


        millMarker =
            L.marker(
                [
                    MILL_LOCATION.lat,
                    MILL_LOCATION.lng
                ]
            )
            .addTo(
                map
            )
            .bindPopup(
                "Smart Rice Mill<br>Karimganj, Kishoreganj"
            );

    }


    /* =========================================
       MAP LAYERS
    ========================================= */

    function clearRouteLayers() {

        if (!map) {

            return;

        }


        if (
            routeLayer
        ) {

            map.removeLayer(
                routeLayer
            );


            routeLayer =
                null;

        }


        if (
            destinationMarker
        ) {

            map.removeLayer(
                destinationMarker
            );


            destinationMarker =
                null;

        }

    }


    function clearTruckMarker() {

        if (
            map &&
            truckMarker
        ) {

            map.removeLayer(
                truckMarker
            );


            truckMarker =
                null;

        }

    }


    function clearCurrentRoute() {

        currentRouteInfo =
            null;


        clearRouteLayers();


        destinationMetric.textContent =
            "Not selected";


        distanceMetric.textContent =
            "—";


        durationMetric.textContent =
            "—";

    }


    /* =========================================
       DESTINATION QUERY
    ========================================= */

    function buildDestinationQuery() {

        const parts = [

            deliveryAddressInput.value
                .trim(),

            deliveryUpazilaSelect.value,

            deliveryDistrictSelect.value,

            deliveryDivisionSelect.value,

            "Bangladesh"

        ];


        return parts
            .filter(Boolean)
            .join(
                ", "
            );

    }


    /* =========================================
       GEOCODING
    ========================================= */

    async function geocodeDestination() {

        const query =
            buildDestinationQuery();


        if (!query) {

            return null;

        }


        const cacheKey =

            `deliveryGeocode_${query
                .toLowerCase()
                .replace(
                    /[^a-z0-9]+/g,
                    "_"
                )}`;


        const cached =
            safeParseStorage(
                cacheKey,
                null
            );


        if (
            cached &&
            cached.lat &&
            cached.lng
        ) {

            return cached;

        }


        const queries = [

            query,


            [
                deliveryUpazilaSelect.value,
                deliveryDistrictSelect.value,
                deliveryDivisionSelect.value,
                "Bangladesh"
            ]
            .filter(Boolean)
            .join(
                ", "
            ),


            [
                deliveryDistrictSelect.value,
                deliveryDivisionSelect.value,
                "Bangladesh"
            ]
            .filter(Boolean)
            .join(
                ", "
            )

        ];


        for (
            const currentQuery of
            queries
        ) {

            if (!currentQuery) {

                continue;

            }


            try {

                const url =

                    `${NOMINATIM_URL}?format=jsonv2&limit=1&countrycodes=bd&q=${encodeURIComponent(
                        currentQuery
                    )}`;


                const response =
                    await fetch(
                        url
                    );


                if (!response.ok) {

                    continue;

                }


                const result =
                    await response.json();


                if (
                    !Array.isArray(
                        result
                    )

                    ||

                    result.length ===
                    0
                ) {

                    continue;

                }


                const location = {

                    lat:
                        Number(
                            result[0].lat
                        ),


                    lng:
                        Number(
                            result[0].lon
                        ),


                    displayName:
                        result[0].display_name ||
                        currentQuery

                };


                localStorage.setItem(
                    cacheKey,
                    JSON.stringify(
                        location
                    )
                );


                return location;

            }
            catch {

                continue;

            }

        }


        return null;

    }


    /* =========================================
       ROAD ROUTE
    ========================================= */

    async function fetchRoadRoute(
        destination
    ) {

        const url =

            `${OSRM_URL}/${MILL_LOCATION.lng},${MILL_LOCATION.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson&steps=false`;


        const response =
            await fetch(
                url
            );


        if (!response.ok) {

            throw new Error(
                "Routing service unavailable"
            );

        }


        const data =
            await response.json();


        if (
            data.code !==
            "Ok"

            ||

            !Array.isArray(
                data.routes
            )

            ||

            data.routes.length ===
            0
        ) {

            throw new Error(
                "No road route found"
            );

        }


        const route =
            data.routes[0];


        return {

            distanceKm:

                Number(
                    route.distance
                ) /
                1000,


            durationMinutes:

                Number(
                    route.duration
                ) /
                60,


            geometry:
                route.geometry

        };

    }


    /* =========================================
       ROUTE COLOR
    ========================================= */

    function getRouteColor(
        status
    ) {

        if (
            status ===
            "on-way"
        ) {

            return "#ef8500";

        }


        if (
            status ===
            "delivered"
        ) {

            return "#14933a";

        }


        if (
            status ===
            "cancelled"
        ) {

            return "#c74747";

        }


        if (
            status ===
            "dispatched"
        ) {

            return "#277cae";

        }


        return "#607d8b";

    }


    /* =========================================
       DRAW ROUTE
    ========================================= */

    function drawRoute(
        destination,
        route,
        status = "pending"
    ) {

        if (!map) {

            return;

        }


        clearRouteLayers();


        destinationMarker =
            L.marker(
                [
                    destination.lat,
                    destination.lng
                ]
            )
            .addTo(
                map
            )
            .bindPopup(
                "Delivery Destination"
            );


        const coordinates =

            route.geometry.coordinates.map(
                function (
                    coordinate
                ) {

                    return [

                        coordinate[1],
                        coordinate[0]

                    ];

                }
            );


        routeLayer =
            L.polyline(
                coordinates,
                {
                    color:
                        getRouteColor(
                            status
                        ),

                    weight:
                        5,

                    opacity:
                        0.85
                }
            )
            .addTo(
                map
            );


        const group =
            L.featureGroup(
                [
                    millMarker,
                    destinationMarker,
                    routeLayer
                ]
            );


        map.fitBounds(
            group.getBounds(),
            {
                padding:
                    [
                        25,
                        25
                    ]
            }
        );

    }


    /* =========================================
       PREVIEW CURRENT ROUTE
    ========================================= */

    async function previewCurrentRoute(
        showErrors = true
    ) {

        const division =
            deliveryDivisionSelect.value;


        const district =
            deliveryDistrictSelect.value;


        const upazila =
            deliveryUpazilaSelect.value;


        const address =
            deliveryAddressInput.value
                .trim();


        if (
            !division ||
            !district ||
            !upazila ||
            !address
        ) {

            if (
                showErrors
            ) {

                showToast(
                    "Complete the delivery destination before previewing the route.",
                    "error"
                );

            }


            return false;

        }


        previewRouteBtn.disabled =
            true;


        previewRouteBtn.textContent =
            "Loading Route...";


        try {

            const destination =
                await geocodeDestination();


            if (!destination) {

                throw new Error(
                    "Destination could not be located on the map."
                );

            }


            const route =
                await fetchRoadRoute(
                    destination
                );


            currentRouteInfo = {

                destinationLat:
                    destination.lat,


                destinationLng:
                    destination.lng,


                destinationName:
                    destination.displayName,


                distanceKm:
                    route.distanceKm,


                durationMinutes:
                    route.durationMinutes

            };


            drawRoute(
                destination,
                route,
                "pending"
            );


            destinationMetric.textContent =
                `${upazila}, ${district}`;


            distanceMetric.textContent =
                `${formatNumber(
                    route.distanceKm
                )} km`;


            durationMetric.textContent =
                formatDuration(
                    route.durationMinutes
                );


            routePlannerDescription.textContent =
                "Road route calculated from the rice mill to the customer destination.";


            return true;

        }
        catch (
            error
        ) {

            clearCurrentRoute();


            if (
                showErrors
            ) {

                showToast(
                    error.message ||
                    "Route could not be calculated.",
                    "error"
                );

            }


            return false;

        }
        finally {

            previewRouteBtn.disabled =
                false;


            previewRouteBtn.textContent =
                "Preview Road Route";

        }

    }


    previewRouteBtn.addEventListener(
        "click",
        function () {

            previewCurrentRoute(
                true
            );

        }
    );


    /* =========================================
       FORMAT DURATION
    ========================================= */

    function formatDuration(
        minutes
    ) {

        const totalMinutes =
            Math.round(
                Number(
                    minutes ||
                    0
                )
            );


        if (
            totalMinutes <
            60
        ) {

            return (
                `${totalMinutes} min`
            );

        }


        const hours =
            Math.floor(
                totalMinutes /
                60
            );


        const remainingMinutes =
            totalMinutes %
            60;


        return (

            `${hours} hr ${
                remainingMinutes >
                0

                    ?

                    `${remainingMinutes} min`

                    :

                    ""
            }`

        ).trim();

    }


    /* =========================================
       VALIDATE DELIVERY
    ========================================= */

    function validateDelivery() {

        const sale =
            findSaleByInvoice(
                deliveryInvoiceSelect.value
            );


        if (!sale) {

            return (
                "Please select a valid sales invoice."
            );

        }


        const truck =
            findTruck(
                deliveryTruckSelect.value
            );


        if (!truck) {

            return (
                "Please select a truck."
            );

        }


        const driver =
            findDriver(
                deliveryDriverSelect.value
            );


        if (!driver) {

            return (
                "Please select a driver."
            );

        }


        if (
            isTruckBusy(
                truck.id
            )
        ) {

            return (
                "The selected truck is already assigned to an active delivery."
            );

        }


        if (
            isDriverBusy(
                driver.id
            )
        ) {

            return (
                "The selected driver is already assigned to an active delivery."
            );

        }


        const quantity =
            Number(
                sale.quantityKg ||
                sale.quantity ||
                0
            );


        if (
            quantity >
            Number(
                truck.capacityKg
            )
        ) {

            return (

                `Delivery quantity is ${formatNumber(
                    quantity
                )} kg, but the selected truck capacity is only ${formatNumber(
                    truck.capacityKg
                )} kg.`

            );

        }


        if (
            !deliveryDivisionSelect.value ||
            !deliveryDistrictSelect.value ||
            !deliveryUpazilaSelect.value
        ) {

            return (
                "Complete the customer delivery location."
            );

        }


        if (
            deliveryAddressInput.value
                .trim()
                .length <
            3
        ) {

            return (
                "Enter the detailed delivery address."
            );

        }


        return "";

    }


    /* =========================================
       SAVE DELIVERY
    ========================================= */

    deliveryForm.addEventListener(
        "submit",
        async function (
            event
        ) {

            event.preventDefault();


            pendingCancelDeliveryId =
                null;


            let error =
                validateDelivery();


            if (error) {

                showToast(
                    error,
                    "error"
                );


                return;

            }


            if (
                !currentRouteInfo
            ) {

                const routeLoaded =
                    await previewCurrentRoute(
                        true
                    );


                if (
                    !routeLoaded
                ) {

                    return;

                }

            }


            error =
                validateDelivery();


            if (error) {

                showToast(
                    error,
                    "error"
                );


                return;

            }


            const sale =
                findSaleByInvoice(
                    deliveryInvoiceSelect.value
                );


            const customer =
                findCustomerForSale(
                    sale
                );


            const truck =
                findTruck(
                    deliveryTruckSelect.value
                );


            const driver =
                findDriver(
                    deliveryDriverSelect.value
                );


            const deliveryId =
                generateDeliveryId();


            const record = {

                id:
                    Date.now(),


                deliveryId:
                    deliveryId,


                invoiceId:

                    sale.invoiceId ||
                    sale.invoiceNumber ||
                    sale.saleId,


                saleId:

                    sale.id ||
                    null,


                customerId:

                    customer?.id ||
                    sale.customerId ||
                    null,


                customerName:

                    sale.customerName ||
                    customer?.name ||
                    "",


                customerPhone:

                    sale.customerPhone ||
                    customer?.phone ||
                    "",


                productKey:

                    sale.productKey ||
                    "",


                product:

                    sale.product ||
                    sale.productName ||
                    sale.productKey ||
                    "",


                quantityKg:

                    Number(
                        sale.quantityKg ||
                        sale.quantity ||
                        0
                    ),


                truckId:
                    truck.id,


                truckNumber:
                    truck.number,


                truckCapacityKg:
                    Number(
                        truck.capacityKg
                    ),


                driverId:
                    driver.id,


                driverName:
                    driver.name,


                driverPhone:
                    driver.phone,


                division:
                    deliveryDivisionSelect.value,


                district:
                    deliveryDistrictSelect.value,


                upazila:
                    deliveryUpazilaSelect.value,


                address:

                    deliveryAddressInput.value
                        .trim(),


                destinationLat:
                    currentRouteInfo.destinationLat,


                destinationLng:
                    currentRouteInfo.destinationLng,


                distanceKm:
                    currentRouteInfo.distanceKm,


                durationMinutes:
                    currentRouteInfo.durationMinutes,


                status:
                    "pending",


                deliveryDate:
                    getTodayDate(),


                dispatchDate:
                    null,


                startDate:
                    null,


                deliveredDate:
                    null,


                cancelledDate:
                    null,


                currentLat:
                    null,


                currentLng:
                    null,


                lastLocationUpdate:
                    null,


                createdAt:
                    Date.now()

            };


            deliveryRecords.push(
                record
            );


            updateSaleDeliveryStatus(
                record.invoiceId,
                "pending"
            );


            saveDeliveries();


            refreshDeliveryUI();


            resetDeliveryForm();


            showToast(

                `${deliveryId} created successfully. Delivery status is Pending.`

            );

        }
    );


    /* =========================================
       UPDATE SALES DELIVERY STATUS
    ========================================= */

    function updateSaleDeliveryStatus(
        invoiceId,
        status
    ) {

        const sale =
            findSaleByInvoice(
                invoiceId
            );


        if (!sale) {

            return;

        }


        sale.deliveryStatus =
            status;


        saveSalesRecords();

    }


    /* =========================================
       RESET FORM
    ========================================= */

    function resetDeliveryForm() {

        deliveryForm.reset();


        resetInvoiceDetails();


        populateInvoices();

        populateTrucks();

        populateDrivers();


        truckCapacityHelp.textContent =
            "Select a truck to view capacity.";

    }


    /* =========================================
       SUMMARY
    ========================================= */

    function updateSummaryCards() {

        const today =
            getTodayDate();


        const running =
            deliveryRecords.filter(
                function (
                    delivery
                ) {

                    return (

                        delivery.status ===
                        "dispatched"

                        ||

                        delivery.status ===
                        "on-way"

                    );

                }
            ).length;


        const deliveredToday =
            deliveryRecords.filter(
                function (
                    delivery
                ) {

                    return (

                        delivery.status ===
                        "delivered"

                        &&

                        delivery.deliveredDate ===
                        today

                    );

                }
            ).length;


        const pending =
            deliveryRecords.filter(
                function (
                    delivery
                ) {

                    return (
                        delivery.status ===
                        "pending"
                    );

                }
            ).length;


        runningDeliveriesValue.textContent =
            running;


        deliveredTodayValue.textContent =
            deliveredToday;


        pendingDeliveriesValue.textContent =
            pending;

    }


    /* =========================================
       STATUS INFO
    ========================================= */

    function getStatusInfo(
        status
    ) {

        if (
            status ===
            "dispatched"
        ) {

            return {

                text:
                    "Dispatched",

                className:
                    "status-dispatched"

            };

        }


        if (
            status ===
            "on-way"
        ) {

            return {

                text:
                    "On the Way",

                className:
                    "status-on-way"

            };

        }


        if (
            status ===
            "delivered"
        ) {

            return {

                text:
                    "Delivered",

                className:
                    "status-delivered"

            };

        }


        if (
            status ===
            "cancelled"
        ) {

            return {

                text:
                    "Cancelled",

                className:
                    "status-cancelled"

            };

        }


        return {

            text:
                "Pending",

            className:
                "status-pending"

        };

    }


    /* =========================================
       STATUS TRANSITION
    ========================================= */

    function changeDeliveryStatus(
        delivery,
        newStatus
    ) {

        if (!delivery) {

            return;

        }


        const now =
            new Date()
                .toISOString();


        if (
            newStatus ===
            "dispatched"
        ) {

            if (
                delivery.status !==
                "pending"
            ) {

                return;

            }


            delivery.status =
                "dispatched";


            delivery.dispatchDate =
                now;


            updateSaleDeliveryStatus(
                delivery.invoiceId,
                "dispatched"
            );

        }
        else if (
            newStatus ===
            "on-way"
        ) {

            if (
                delivery.status !==
                "dispatched"
            ) {

                return;

            }


            delivery.status =
                "on-way";


            delivery.startDate =
                now;


            updateSaleDeliveryStatus(
                delivery.invoiceId,
                "on-way"
            );

        }
        else if (
            newStatus ===
            "delivered"
        ) {

            if (
                delivery.status !==
                "on-way"
            ) {

                return;

            }


            delivery.status =
                "delivered";


            delivery.deliveredDate =
                getTodayDate();


            updateSaleDeliveryStatus(
                delivery.invoiceId,
                "delivered"
            );

        }


        saveDeliveries();


        refreshDeliveryUI();


        if (
            Number(
                selectedTrackingDeliveryId
            )

            ===

            Number(
                delivery.id
            )
        ) {

            trackDelivery(
                delivery.id
            );

        }


        showToast(

            `${delivery.deliveryId} updated to ${getStatusInfo(
                delivery.status
            ).text}.`

        );

    }


    /* =========================================
       CANCEL DELIVERY
    ========================================= */

    function requestCancelDelivery(
        id
    ) {

        pendingCancelDeliveryId =
            id;


        displayDeliveries();

    }


    function keepDelivery() {

        pendingCancelDeliveryId =
            null;


        displayDeliveries();

    }


    function confirmCancelDelivery(
        id
    ) {

        const delivery =
            findDelivery(
                id
            );


        if (!delivery) {

            return;

        }


        if (
            ![
                "pending",
                "dispatched"
            ].includes(
                delivery.status
            )
        ) {

            showToast(
                "This delivery can no longer be cancelled from its current status.",
                "error"
            );


            return;

        }


        delivery.status =
            "cancelled";


        delivery.cancelledDate =
            getTodayDate();


        /*
            Invoice remains active and delivery
            required, so make it available for a
            new delivery assignment.
        */

        updateSaleDeliveryStatus(
            delivery.invoiceId,
            "pending"
        );


        pendingCancelDeliveryId =
            null;


        saveDeliveries();


        refreshDeliveryUI();


        if (
            Number(
                selectedTrackingDeliveryId
            )

            ===

            Number(
                delivery.id
            )
        ) {

            trackDelivery(
                delivery.id
            );

        }


        showToast(

            `${delivery.deliveryId} cancelled. The invoice can be assigned to a new delivery.`

        );

    }


    /* =========================================
       ACTION HTML
    ========================================= */

    function getDeliveryActionHTML(
        delivery
    ) {

        const trackButton = `

            <button
                class="delivery-action-button track-button"
                type="button"
                data-action="track"
                data-id="${delivery.id}"
            >
                Track
            </button>

        `;


        if (
            delivery.status ===
            "pending"
        ) {

            if (
                Number(
                    pendingCancelDeliveryId
                )

                ===

                Number(
                    delivery.id
                )
            ) {

                return `

                    ${trackButton}

                    <span class="cancel-question">
                        Cancel?
                    </span>

                    <button
                        class="delivery-action-button confirm-cancel-button"
                        type="button"
                        data-action="confirm-cancel"
                        data-id="${delivery.id}"
                    >
                        Confirm
                    </button>

                    <button
                        class="delivery-action-button keep-delivery-button"
                        type="button"
                        data-action="keep"
                        data-id="${delivery.id}"
                    >
                        Keep
                    </button>

                `;

            }


            return `

                ${trackButton}

                <button
                    class="delivery-action-button dispatch-button"
                    type="button"
                    data-action="dispatch"
                    data-id="${delivery.id}"
                >
                    Dispatch
                </button>

                <button
                    class="delivery-action-button cancel-delivery-button"
                    type="button"
                    data-action="request-cancel"
                    data-id="${delivery.id}"
                >
                    Cancel
                </button>

            `;

        }


        if (
            delivery.status ===
            "dispatched"
        ) {

            if (
                Number(
                    pendingCancelDeliveryId
                )

                ===

                Number(
                    delivery.id
                )
            ) {

                return `

                    ${trackButton}

                    <span class="cancel-question">
                        Cancel?
                    </span>

                    <button
                        class="delivery-action-button confirm-cancel-button"
                        type="button"
                        data-action="confirm-cancel"
                        data-id="${delivery.id}"
                    >
                        Confirm
                    </button>

                    <button
                        class="delivery-action-button keep-delivery-button"
                        type="button"
                        data-action="keep"
                        data-id="${delivery.id}"
                    >
                        Keep
                    </button>

                `;

            }


            return `

                ${trackButton}

                <button
                    class="delivery-action-button start-trip-button"
                    type="button"
                    data-action="start-trip"
                    data-id="${delivery.id}"
                >
                    Start Trip
                </button>

                <button
                    class="delivery-action-button cancel-delivery-button"
                    type="button"
                    data-action="request-cancel"
                    data-id="${delivery.id}"
                >
                    Cancel
                </button>

            `;

        }


        if (
            delivery.status ===
            "on-way"
        ) {

            return `

                ${trackButton}

                <button
                    class="delivery-action-button delivered-button"
                    type="button"
                    data-action="delivered"
                    data-id="${delivery.id}"
                >
                    Delivered
                </button>

            `;

        }


        return trackButton;

    }


    /* =========================================
       DISPLAY DELIVERIES
    ========================================= */

    function displayDeliveries() {

        const searchText =
            deliverySearch.value
                .trim()
                .toLowerCase();


        const statusFilter =
            deliveryStatusFilter.value;


        const filtered =
            deliveryRecords.filter(
                function (
                    delivery
                ) {

                    const searchable = `

                        ${delivery.deliveryId}
                        ${delivery.invoiceId}
                        ${delivery.customerName}
                        ${delivery.truckNumber}
                        ${delivery.driverName}
                        ${delivery.district}
                        ${delivery.upazila}
                        ${delivery.product}

                    `.toLowerCase();


                    const matchesSearch =
                        searchable.includes(
                            searchText
                        );


                    const matchesStatus =

                        statusFilter ===
                        "all"

                        ||

                        delivery.status ===
                        statusFilter;


                    return (

                        matchesSearch &&
                        matchesStatus

                    );

                }
            );


        deliveryTableBody.innerHTML =
            "";


        if (
            filtered.length ===
            0
        ) {

            deliveryTableBody.innerHTML = `

                <tr class="delivery-empty-row">

                    <td colspan="12">

                        No delivery records match the current filter.

                    </td>

                </tr>

            `;


            return;

        }


        [
            ...filtered
        ]

            .sort(
                function (
                    a,
                    b
                ) {

                    return (

                        Number(
                            b.createdAt
                        )

                        -

                        Number(
                            a.createdAt
                        )

                    );

                }
            )

            .forEach(
                function (
                    delivery
                ) {

                    const status =
                        getStatusInfo(
                            delivery.status
                        );


                    const destination =

                        `${delivery.upazila || ""}${
                            delivery.upazila
                                ? ", "
                                : ""
                        }${delivery.district || ""}`;


                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `

                        <td>

                            <span class="delivery-code">

                                ${escapeHTML(
                                    delivery.deliveryId
                                )}

                            </span>

                        </td>


                        <td>

                            <span class="delivery-invoice-code">

                                ${escapeHTML(
                                    delivery.invoiceId
                                )}

                            </span>

                        </td>


                        <td>

                            ${escapeHTML(
                                delivery.customerName
                            )}

                        </td>


                        <td>

                            ${escapeHTML(
                                delivery.truckNumber
                            )}

                        </td>


                        <td>

                            ${escapeHTML(
                                delivery.driverName
                            )}

                        </td>


                        <td class="delivery-destination-text"
                            title="${escapeHTML(
                                delivery.address
                            )}">

                            ${escapeHTML(
                                destination ||
                                delivery.address
                            )}

                        </td>


                        <td>

                            ${escapeHTML(
                                delivery.product
                            )}

                            /

                            ${formatNumber(
                                delivery.quantityKg
                            )} kg

                        </td>


                        <td>

                            ${
                                delivery.distanceKm >
                                0

                                    ?

                                    `${formatNumber(
                                        delivery.distanceKm
                                    )} km`

                                    :

                                    "—"
                            }

                        </td>


                        <td>

                            ${
                                delivery.lastLocationUpdate

                                    ?

                                    formatDateTime(
                                        delivery.lastLocationUpdate
                                    )

                                    :

                                    "Not updated"
                            }

                        </td>


                        <td>

                            <span
                                class="
                                    delivery-status-badge
                                    ${status.className}
                                "
                            >

                                ${status.text}

                            </span>

                        </td>


                        <td>

                            ${formatDate(
                                delivery.deliveryDate
                            )}

                        </td>


                        <td class="delivery-action-cell">

                            ${getDeliveryActionHTML(
                                delivery
                            )}

                        </td>

                    `;


                    deliveryTableBody.appendChild(
                        row
                    );

                }
            );

    }


    /* =========================================
       TABLE ACTIONS
    ========================================= */

    deliveryTableBody.addEventListener(
        "click",
        function (
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


            const delivery =
                findDelivery(
                    id
                );


            if (
                action ===
                "track"
            ) {

                trackDelivery(
                    id
                );


                return;

            }


            if (
                action ===
                "dispatch"
            ) {

                changeDeliveryStatus(
                    delivery,
                    "dispatched"
                );


                return;

            }


            if (
                action ===
                "start-trip"
            ) {

                changeDeliveryStatus(
                    delivery,
                    "on-way"
                );


                return;

            }


            if (
                action ===
                "delivered"
            ) {

                changeDeliveryStatus(
                    delivery,
                    "delivered"
                );


                return;

            }


            if (
                action ===
                "request-cancel"
            ) {

                requestCancelDelivery(
                    id
                );


                return;

            }


            if (
                action ===
                "confirm-cancel"
            ) {

                confirmCancelDelivery(
                    id
                );


                return;

            }


            if (
                action ===
                "keep"
            ) {

                keepDelivery();

            }

        }
    );


    /* =========================================
       TRACK DELIVERY
    ========================================= */

    async function trackDelivery(
        id
    ) {

        const delivery =
            findDelivery(
                id
            );


        if (!delivery) {

            return;

        }


        selectedTrackingDeliveryId =
            delivery.id;


        trackingDeliveryValue.textContent =
            `${delivery.deliveryId} · ${getStatusInfo(
                delivery.status
            ).text}`;


        if (
            delivery.currentLat !==
            null

            &&

            delivery.currentLng !==
            null
        ) {

            currentPositionValue.textContent =

                `${Number(
                    delivery.currentLat
                ).toFixed(
                    5
                )}, ${Number(
                    delivery.currentLng
                ).toFixed(
                    5
                )}`;


            gpsUpdateValue.textContent =
                formatDateTime(
                    delivery.lastLocationUpdate
                );

        }
        else {

            currentPositionValue.textContent =
                "Not updated";


            gpsUpdateValue.textContent =
                "—";

        }


        captureGpsBtn.disabled =

            ![
                "dispatched",
                "on-way"
            ].includes(
                delivery.status
            );


        destinationMetric.textContent =

            `${delivery.upazila || ""}${
                delivery.upazila
                    ? ", "
                    : ""
            }${delivery.district || ""}`;


        distanceMetric.textContent =

            delivery.distanceKm >
            0

                ?

                `${formatNumber(
                    delivery.distanceKm
                )} km`

                :

                "—";


        durationMetric.textContent =

            delivery.durationMinutes >
            0

                ?

                formatDuration(
                    delivery.durationMinutes
                )

                :

                "—";


        routePlannerDescription.textContent =

            `Tracking ${delivery.deliveryId} for ${delivery.customerName}.`;


        try {

            const destination = {

                lat:
                    delivery.destinationLat,

                lng:
                    delivery.destinationLng

            };


            const route =
                await fetchRoadRoute(
                    destination
                );


            drawRoute(
                destination,
                route,
                delivery.status
            );


            drawTruckMarker(
                delivery
            );

        }
        catch {

            if (
                map &&
                delivery.destinationLat &&
                delivery.destinationLng
            ) {

                clearRouteLayers();


                destinationMarker =
                    L.marker(
                        [
                            delivery.destinationLat,
                            delivery.destinationLng
                        ]
                    )
                    .addTo(
                        map
                    );


                map.fitBounds(
                    [

                        [
                            MILL_LOCATION.lat,
                            MILL_LOCATION.lng
                        ],

                        [
                            delivery.destinationLat,
                            delivery.destinationLng
                        ]

                    ],
                    {
                        padding:
                            [
                                25,
                                25
                            ]
                    }
                );


                drawTruckMarker(
                    delivery
                );

            }

        }

    }


    /* =========================================
       DRAW TRUCK GPS MARKER
    ========================================= */

    function drawTruckMarker(
        delivery
    ) {

        clearTruckMarker();


        if (
            !map ||
            delivery.currentLat ===
            null ||
            delivery.currentLng ===
            null
        ) {

            return;

        }


        truckMarker =
            L.circleMarker(
                [
                    delivery.currentLat,
                    delivery.currentLng
                ],
                {
                    radius:
                        9,

                    color:
                        "#ffffff",

                    weight:
                        3,

                    fillColor:
                        "#e67900",

                    fillOpacity:
                        1
                }
            )
            .addTo(
                map
            )
            .bindPopup(

                `${escapeHTML(
                    delivery.deliveryId
                )}<br>Current Truck Position`

            );


        truckMarker.openPopup();

    }


    /* =========================================
       GPS CAPTURE
    ========================================= */

    captureGpsBtn.addEventListener(
        "click",
        function () {

            if (
                selectedTrackingDeliveryId ===
                null
            ) {

                showToast(
                    "Select Track on a delivery record first.",
                    "error"
                );


                return;

            }


            const delivery =
                findDelivery(
                    selectedTrackingDeliveryId
                );


            if (!delivery) {

                return;

            }


            if (
                ![
                    "dispatched",
                    "on-way"
                ].includes(
                    delivery.status
                )
            ) {

                showToast(
                    "GPS updates are enabled only for dispatched or on-the-way deliveries.",
                    "error"
                );


                return;

            }


            if (
                !navigator.geolocation
            ) {

                showToast(
                    "This browser does not support GPS location capture.",
                    "error"
                );


                return;

            }


            captureGpsBtn.disabled =
                true;


            captureGpsBtn.textContent =
                "Capturing GPS...";


            navigator.geolocation.getCurrentPosition(

                function (
                    position
                ) {

                    delivery.currentLat =
                        position.coords.latitude;


                    delivery.currentLng =
                        position.coords.longitude;


                    delivery.lastLocationUpdate =
                        new Date()
                            .toISOString();


                    saveDeliveries();


                    displayDeliveries();


                    trackDelivery(
                        delivery.id
                    );


                    showToast(
                        `${delivery.deliveryId} GPS position updated successfully.`
                    );


                    captureGpsBtn.textContent =
                        "Capture Current Device GPS";


                    captureGpsBtn.disabled =
                        false;

                },


                function (
                    error
                ) {

                    captureGpsBtn.textContent =
                        "Capture Current Device GPS";


                    captureGpsBtn.disabled =
                        false;


                    let message =
                        "GPS position could not be captured.";


                    if (
                        error.code ===
                        1
                    ) {

                        message =
                            "Location permission was denied.";

                    }
                    else if (
                        error.code ===
                        2
                    ) {

                        message =
                            "Device location is currently unavailable.";

                    }
                    else if (
                        error.code ===
                        3
                    ) {

                        message =
                            "GPS location request timed out.";

                    }


                    showToast(
                        message,
                        "error"
                    );

                },


                {
                    enableHighAccuracy:
                        true,

                    timeout:
                        10000,

                    maximumAge:
                        30000
                }

            );

        }
    );


    /* =========================================
       RESET MAP
    ========================================= */

    function resetMap() {

        selectedTrackingDeliveryId =
            null;


        clearRouteLayers();

        clearTruckMarker();


        destinationMetric.textContent =
            "Not selected";


        distanceMetric.textContent =
            "—";


        durationMetric.textContent =
            "—";


        trackingDeliveryValue.textContent =
            "None";


        currentPositionValue.textContent =
            "Not updated";


        gpsUpdateValue.textContent =
            "—";


        captureGpsBtn.disabled =
            true;


        routePlannerDescription.textContent =
            "Select an invoice to preview its customer delivery route.";


        if (
            map
        ) {

            map.setView(
                [
                    MILL_LOCATION.lat,
                    MILL_LOCATION.lng
                ],
                8
            );

        }

    }


    resetMapBtn.addEventListener(
        "click",
        resetMap
    );


    /* =========================================
       FILTERS
    ========================================= */

    deliverySearch.addEventListener(
        "input",
        function () {

            pendingCancelDeliveryId =
                null;


            displayDeliveries();

        }
    );


    deliveryStatusFilter.addEventListener(
        "change",
        function () {

            pendingCancelDeliveryId =
                null;


            displayDeliveries();

        }
    );


    /* =========================================
       REFRESH UI
    ========================================= */

    function refreshDeliveryUI() {

        salesRecords =
            getSalesRecords();


        customers =
            getCustomers();


        updateSummaryCards();

        populateInvoices();

        populateTrucks();

        populateDrivers();

        displayDeliveries();

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
                ".delivery-toast"
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
            `delivery-toast ${type}`;


        toast.innerHTML = `

            <span class="delivery-toast-icon">

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
            3000
        );

    }


    /* =========================================
       SIDEBAR
    ========================================= */

    function openSidebar() {

        if (
            !sidebar
        ) {

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

        if (
            !sidebar
        ) {

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
                pendingCancelDeliveryId !==
                null
            ) {

                pendingCancelDeliveryId =
                    null;


                displayDeliveries();


                return;

            }


            closeSidebar();

        }
    );


    window.addEventListener(
        "resize",
        function () {

            if (
                window.innerWidth >
                1000
            ) {

                closeSidebar();

            }


            if (
                map
            ) {

                setTimeout(
                    function () {

                        map.invalidateSize();

                    },
                    100
                );

            }

        }
    );


    /* =========================================
       INITIALIZE
    ========================================= */

    populateDivisionDropdown();

    resetDistrictDropdown();

    resetUpazilaDropdown();


    initializeMap();


    refreshDeliveryUI();

});