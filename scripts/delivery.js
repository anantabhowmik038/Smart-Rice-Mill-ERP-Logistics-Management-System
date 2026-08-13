document.addEventListener(
    "DOMContentLoaded",
    async function () {

    // ==========================================
    // ELEMENTS
    // ==========================================

    const deliveryForm =
        document.getElementById(
            "deliveryForm"
        );


    const invoiceSelect =
        document.getElementById(
            "sales-invoice"
        );


    const customerInput =
        document.getElementById(
            "delivery-customer"
        );


    // Starting Point Display

    const startLocationText =
        document.getElementById(
            "startLocationText"
        );


    const startLocationMeta =
        document.getElementById(
            "startLocationMeta"
        );


    // Destination

    const destinationDivisionSelect =
        document.getElementById(
            "destination-division"
        );


    const destinationDistrictSelect =
        document.getElementById(
            "destination-district"
        );


    const destinationUpazilaSelect =
        document.getElementById(
            "destination-upazila"
        );


    const destinationDetailsInput =
        document.getElementById(
            "destination-details"
        );


    const locationDataMessage =
        document.getElementById(
            "locationDataMessage"
        );


    // Other Form Fields

    const truckSelect =
        document.getElementById(
            "truck-number"
        );


    const driverSelect =
        document.getElementById(
            "driver-name"
        );


    const productInput =
        document.getElementById(
            "delivery-product"
        );


    const quantityInput =
        document.getElementById(
            "delivery-quantity"
        );


    const statusSelect =
        document.getElementById(
            "delivery-status"
        );


    const saveDeliveryBtn =
        document.getElementById(
            "saveDeliveryBtn"
        );


    // Table

    const deliveryTableBody =
        document.getElementById(
            "deliveryTableBody"
        );


    // Summary

    const runningValue =
        document.getElementById(
            "runningDeliveriesValue"
        );


    const deliveredTodayValue =
        document.getElementById(
            "deliveredTodayValue"
        );


    const pendingValue =
        document.getElementById(
            "pendingDeliveriesValue"
        );


    // Map

    const resetMapBtn =
        document.getElementById(
            "resetMapBtn"
        );


    const mapRouteInformation =
        document.getElementById(
            "mapRouteInformation"
        );


    const millMapText =
        document.getElementById(
            "millMapText"
        );


    const destinationMapText =
        document.getElementById(
            "destinationMapText"
        );


    const routeDistanceText =
        document.getElementById(
            "routeDistanceText"
        );


    const routeDurationText =
        document.getElementById(
            "routeDurationText"
        );


    // ==========================================
    // STATE
    // ==========================================

    let editingDeliveryId =
        null;


    let millLocation =
        null;


    let deliveryMap =
        null;


    let millMarker =
        null;


    let destinationMarker =
        null;


    // Main colored road line

    let roadRouteLine =
        null;


    // White border behind road line

    let roadRouteOutline =
        null;


    // Straight line only if road API fails

    let fallbackRouteLine =
        null;


    let currentRouteData =
        null;


    let currentDestination =
        null;


    let routeRequestNumber =
        0;


    let deliveries =
        JSON.parse(
            localStorage.getItem(
                "deliveries"
            )
        ) || [];


    // ==========================================
    // LOCAL STORAGE HELPERS
    // ==========================================

    function getSales() {

        return (
            JSON.parse(
                localStorage.getItem(
                    "sales"
                )
            ) || []
        );

    }


    function getCustomers() {

        return (
            JSON.parse(
                localStorage.getItem(
                    "customers"
                )
            ) || []
        );

    }


    function saveDeliveries() {

        localStorage.setItem(
            "deliveries",
            JSON.stringify(
                deliveries
            )
        );

    }


    // ==========================================
    // SAFE TEXT
    // ==========================================

    function escapeHTML(value) {

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


    // ==========================================
    // DATE
    // ==========================================

    function getTodayDate() {

        const date =
            new Date();


        const year =
            date.getFullYear();


        const month =
            String(
                date.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        const day =
            String(
                date.getDate()
            ).padStart(
                2,
                "0"
            );


        return (
            year +
            "-" +
            month +
            "-" +
            day
        );

    }


    function formatDate(value) {

        if (!value) {

            return "";

        }


        return new Date(
            value +
            "T00:00:00"
        ).toLocaleDateString(
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


    // ==========================================
    // PRODUCT
    // ==========================================

    function getProductName(value) {

        if (value === "rice") {
            return "Rice";
        }


        if (value === "khud") {
            return "Khud";
        }


        if (value === "tush") {
            return "Tush";
        }


        return value || "";

    }


    // ==========================================
    // DRIVER
    // ==========================================

    function getDriverName(value) {

        if (value === "kamal") {
            return "Kamal";
        }


        if (value === "jalal") {
            return "Jalal";
        }


        if (value === "rahim") {
            return "Rahim";
        }


        return value || "";

    }


    // ==========================================
    // STATUS
    // ==========================================

    function getStatusText(status) {

        if (status === "pending") {
            return "Pending";
        }


        if (status === "on-the-way") {
            return "On the Way";
        }


        if (status === "delivered") {
            return "Delivered";
        }


        return status || "";

    }


    function getStatusClass(status) {

        if (status === "pending") {

            return "status-pending";

        }


        if (status === "on-the-way") {

            return "status-on-way";

        }


        if (status === "delivered") {

            return "delivery-status-delivered";

        }


        return "";

    }


    // ==========================================
    // ROUTE COLOR
    // ==========================================

    function getRouteColor(status) {

        if (status === "delivered") {

            return "#15913a";

        }


        if (status === "on-the-way") {

            return "#f08c00";

        }


        return "#607d8b";

    }


    // ==========================================
    // FORMAT DRIVE TIME
    // ==========================================

    function formatDuration(seconds) {

        if (
            !Number.isFinite(
                seconds
            )
        ) {

            return "Unavailable";

        }


        const totalMinutes =
            Math.max(
                1,
                Math.round(
                    seconds / 60
                )
            );


        const hours =
            Math.floor(
                totalMinutes / 60
            );


        const minutes =
            totalMinutes % 60;


        if (hours === 0) {

            return (
                minutes +
                " min"
            );

        }


        if (minutes === 0) {

            return (
                hours +
                " hr"
            );

        }


        return (
            hours +
            " hr " +
            minutes +
            " min"
        );

    }


    // ==========================================
    // MIGRATE OLD DELIVERY RECORDS
    // ==========================================

    deliveries =
        deliveries.map(
            function (
                delivery,
                index
            ) {

                if (
                    delivery.id ===
                        undefined ||
                    delivery.id ===
                        null
                ) {

                    delivery.id =
                        Date.now() +
                        index;

                }


                if (!delivery.deliveryId) {

                    delivery.deliveryId =
                        "DEL-" +
                        (1001 + index);

                }


                if (!delivery.createdDate) {

                    delivery.createdDate =
                        getTodayDate();

                }


                if (!delivery.updatedDate) {

                    delivery.updatedDate =
                        delivery.createdDate;

                }


                return delivery;

            }
        );


    saveDeliveries();


    // ==========================================
    // BANGLADESH LOCATION SERVICE
    // ==========================================

    if (!window.BDLocations) {

        locationDataMessage.textContent =
            "Bangladesh location service is missing.";


        locationDataMessage.className =
            "location-message-error";


        showToast(
            "Bangladesh location service is missing.",
            "error"
        );


        return;

    }


    const locationLoaded =
        await window.BDLocations.init();


    if (!locationLoaded) {

        locationDataMessage.textContent =
            "Bangladesh location data could not be loaded.";


        locationDataMessage.className =
            "location-message-error";


        showToast(
            "Location data could not be loaded.",
            "error"
        );


        return;

    }


    locationDataMessage.textContent =
        "Bangladesh location data ready.";


    locationDataMessage.className =
        "location-message-success";


    // ==========================================
    // CREATE LOCATION OBJECT
    // ==========================================

    function createLocationObject(
        division,
        district,
        upazila
    ) {

        const coordinates =
            window.BDLocations
                .getCoordinates(
                    upazila
                );


        return {

            divisionId:
                division.id,

            divisionName:
                window.BDLocations
                    .getName(
                        division
                    ),

            districtId:
                district.id,

            districtName:
                window.BDLocations
                    .getName(
                        district
                    ),

            upazilaId:
                upazila.id,

            upazilaName:
                window.BDLocations
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
    // RICE MILL LOCATION
    // ==========================================

    function resolveMillLocation() {

        const settings =
            JSON.parse(
                localStorage.getItem(
                    "riceMillSettings"
                )
            ) || {};


        // Already saved central location

        if (
            settings.location &&
            settings.location.divisionId &&
            settings.location.districtId &&
            settings.location.upazilaId
        ) {

            const division =
                window.BDLocations
                    .findDivisionById(
                        settings.location
                            .divisionId
                    );


            const district =
                window.BDLocations
                    .findDistrictById(
                        settings.location
                            .districtId
                    );


            const upazila =
                window.BDLocations
                    .findUpazilaById(
                        settings.location
                            .upazilaId
                    );


            if (
                division &&
                district &&
                upazila
            ) {

                return createLocationObject(
                    division,
                    district,
                    upazila
                );

            }

        }


        // Default:
        // Dhaka → Kishoreganj → Karimganj

        const division =
            window.BDLocations
                .findDivisionByName(
                    "Dhaka"
                );


        if (!division) {

            return null;

        }


        const district =
            window.BDLocations
                .findDistrictByName(
                    "Kishoreganj",
                    division.id
                );


        if (!district) {

            return null;

        }


        const upazila =
            window.BDLocations
                .findUpazilaByName(
                    "Karimganj",
                    district.id
                );


        if (!upazila) {

            return null;

        }


        const location =
            createLocationObject(
                division,
                district,
                upazila
            );


        settings.location = {

            divisionId:
                location.divisionId,

            divisionName:
                location.divisionName,

            districtId:
                location.districtId,

            districtName:
                location.districtName,

            upazilaId:
                location.upazilaId,

            upazilaName:
                location.upazilaName

        };


        localStorage.setItem(
            "riceMillSettings",
            JSON.stringify(
                settings
            )
        );


        return location;

    }


    millLocation =
        resolveMillLocation();


    if (
        !millLocation ||
        !Number.isFinite(
            millLocation.lat
        ) ||
        !Number.isFinite(
            millLocation.lng
        )
    ) {

        showToast(
            "Rice mill location could not be resolved.",
            "error"
        );


        return;

    }


    // ==========================================
    // DISPLAY MILL LOCATION
    // ==========================================

    startLocationText.textContent =

        millLocation.upazilaName +
        ", " +
        millLocation.districtName;


    startLocationMeta.textContent =

        millLocation.divisionName +
        " Division, Bangladesh";


    millMapText.textContent =

        millLocation.upazilaName +
        ", " +
        millLocation.districtName;


    // ==========================================
    // LOAD DIVISION
    // ==========================================

    function loadDivisionDropdown() {

        destinationDivisionSelect
            .innerHTML = `

                <option
                    value=""
                    selected
                    disabled
                >
                    Select division
                </option>

            `;


        window.BDLocations
            .getDivisions()
            .forEach(
                function (division) {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        division.id;


                    option.textContent =
                        window.BDLocations
                            .getName(
                                division
                            );


                    destinationDivisionSelect
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
        selectedDistrictId = null
    ) {

        destinationDistrictSelect
            .innerHTML = `

                <option
                    value=""
                    selected
                    disabled
                >
                    Select district
                </option>

            `;


        destinationUpazilaSelect
            .innerHTML = `

                <option
                    value=""
                    selected
                    disabled
                >
                    Select upazila
                </option>

            `;


        destinationUpazilaSelect.disabled =
            true;


        if (!divisionId) {

            destinationDistrictSelect.disabled =
                true;


            return;

        }


        window.BDLocations
            .getDistrictsByDivision(
                divisionId
            )
            .forEach(
                function (district) {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        district.id;


                    option.textContent =
                        window.BDLocations
                            .getName(
                                district
                            );


                    destinationDistrictSelect
                        .appendChild(
                            option
                        );

                }
            );


        destinationDistrictSelect.disabled =
            false;


        if (selectedDistrictId) {

            destinationDistrictSelect.value =
                selectedDistrictId;

        }

    }


    // ==========================================
    // LOAD UPAZILA
    // ==========================================

    function loadUpazilaDropdown(
        districtId,
        selectedUpazilaId = null
    ) {

        destinationUpazilaSelect
            .innerHTML = `

                <option
                    value=""
                    selected
                    disabled
                >
                    Select upazila
                </option>

            `;


        if (!districtId) {

            destinationUpazilaSelect.disabled =
                true;


            return;

        }


        window.BDLocations
            .getUpazilasByDistrict(
                districtId
            )
            .forEach(
                function (upazila) {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        upazila.id;


                    option.textContent =
                        window.BDLocations
                            .getName(
                                upazila
                            );


                    destinationUpazilaSelect
                        .appendChild(
                            option
                        );

                }
            );


        destinationUpazilaSelect.disabled =
            false;


        if (selectedUpazilaId) {

            destinationUpazilaSelect.value =
                selectedUpazilaId;

        }

    }


    // ==========================================
    // GET DESTINATION
    // ==========================================

    function getSelectedDestination() {

        const division =
            window.BDLocations
                .findDivisionById(
                    destinationDivisionSelect
                        .value
                );


        const district =
            window.BDLocations
                .findDistrictById(
                    destinationDistrictSelect
                        .value
                );


        const upazila =
            window.BDLocations
                .findUpazilaById(
                    destinationUpazilaSelect
                        .value
                );


        if (
            !division ||
            !district ||
            !upazila
        ) {

            return null;

        }


        return createLocationObject(
            division,
            district,
            upazila
        );

    }


    // ==========================================
    // SET DESTINATION
    // ==========================================

    async function setDestinationLocation(
        divisionId,
        districtId,
        upazilaId
    ) {

        destinationDivisionSelect.value =
            divisionId;


        loadDistrictDropdown(
            divisionId,
            districtId
        );


        loadUpazilaDropdown(
            districtId,
            upazilaId
        );


        return await showSelectedRoute();

    }


    // ==========================================
    // LOCATION EVENTS
    // ==========================================

    destinationDivisionSelect
        .addEventListener(
            "change",
            function () {

                loadDistrictDropdown(
                    destinationDivisionSelect
                        .value
                );


                clearDestinationMap();

            }
        );


    destinationDistrictSelect
        .addEventListener(
            "change",
            function () {

                loadUpazilaDropdown(
                    destinationDistrictSelect
                        .value
                );


                clearDestinationMap();

            }
        );


    destinationUpazilaSelect
        .addEventListener(
            "change",
            async function () {

                await showSelectedRoute();

            }
        );


    // ==========================================
    // INITIALIZE MAP
    // ==========================================

    function initializeMap() {

        if (
            typeof L ===
            "undefined"
        ) {

            showToast(
                "Leaflet map library could not be loaded.",
                "error"
            );


            return;

        }


        deliveryMap =
            L.map(
                "deliveryMap",
                {

                    zoomControl:
                        true,

                    scrollWheelZoom:
                        true

                }
            )
            .setView(
                [

                    millLocation.lat,

                    millLocation.lng

                ],
                9
            );


        // ======================================
        // CUSTOM PANES
        // Keeps road line ABOVE map tiles
        // ======================================

        deliveryMap.createPane(
            "roadOutlinePane"
        );


        deliveryMap.getPane(
            "roadOutlinePane"
        ).style.zIndex =
            450;


        deliveryMap.createPane(
            "roadRoutePane"
        );


        deliveryMap.getPane(
            "roadRoutePane"
        ).style.zIndex =
            460;


        // ======================================
        // OpenStreetMap Tiles
        // ======================================

        L.tileLayer(

            "https://tile.openstreetmap.org/{z}/{x}/{y}.png",

            {

                maxZoom:
                    19,

                attribution:
                    "&copy; OpenStreetMap contributors"

            }

        ).addTo(
            deliveryMap
        );


        // ======================================
        // Rice Mill Marker
        // ======================================

        millMarker =
            L.circleMarker(
                [

                    millLocation.lat,

                    millLocation.lng

                ],
                {

                    radius:
                        10,

                    weight:
                        3,

                    color:
                        "#ffffff",

                    fillColor:
                        "#15913a",

                    fillOpacity:
                        1

                }
            )
            .addTo(
                deliveryMap
            )
            .bindPopup(

                "<strong>Smart Rice Mill</strong><br>" +

                escapeHTML(
                    millLocation.upazilaName
                ) +

                ", " +

                escapeHTML(
                    millLocation.districtName
                )

            );


        millMarker.bindTooltip(
            "Smart Rice Mill",
            {

                direction:
                    "top",

                offset:
                    [0, -10]

            }
        );


        setTimeout(
            function () {

                if (deliveryMap) {

                    deliveryMap
                        .invalidateSize();

                }

            },
            300
        );

    }


    // ==========================================
    // REMOVE ROUTE LAYERS
    // ==========================================

    function removeRouteLayers() {

        if (!deliveryMap) {

            return;

        }


        if (destinationMarker) {

            deliveryMap.removeLayer(
                destinationMarker
            );


            destinationMarker =
                null;

        }


        if (roadRouteLine) {

            deliveryMap.removeLayer(
                roadRouteLine
            );


            roadRouteLine =
                null;

        }


        if (roadRouteOutline) {

            deliveryMap.removeLayer(
                roadRouteOutline
            );


            roadRouteOutline =
                null;

        }


        if (fallbackRouteLine) {

            deliveryMap.removeLayer(
                fallbackRouteLine
            );


            fallbackRouteLine =
                null;

        }

    }


    // ==========================================
    // CONVERT OSRM GEOJSON → LEAFLET LAT LNG
    // ==========================================

    function convertRouteCoordinates(
        geometry
    ) {

        if (
            !geometry ||
            geometry.type !==
                "LineString" ||
            !Array.isArray(
                geometry.coordinates
            )
        ) {

            return [];

        }


        return geometry.coordinates
            .map(
                function (coordinate) {

                    if (
                        !Array.isArray(
                            coordinate
                        ) ||
                        coordinate.length <
                            2
                    ) {

                        return null;

                    }


                    // GeoJSON / OSRM:
                    // [longitude, latitude]
                    //
                    // Leaflet Polyline:
                    // [latitude, longitude]

                    const lng =
                        Number(
                            coordinate[0]
                        );


                    const lat =
                        Number(
                            coordinate[1]
                        );


                    if (
                        !Number.isFinite(
                            lat
                        ) ||
                        !Number.isFinite(
                            lng
                        )
                    ) {

                        return null;

                    }


                    return [
                        lat,
                        lng
                    ];

                }
            )
            .filter(
                function (item) {

                    return (
                        item !==
                        null
                    );

                }
            );

    }


    // ==========================================
    // STRAIGHT DISTANCE FALLBACK
    // ==========================================

    function calculateStraightDistance(
        lat1,
        lon1,
        lat2,
        lon2
    ) {

        const earthRadius =
            6371;


        function toRadians(
            value
        ) {

            return (
                value *
                Math.PI /
                180
            );

        }


        const dLat =
            toRadians(
                lat2 -
                lat1
            );


        const dLon =
            toRadians(
                lon2 -
                lon1
            );


        const a =

            Math.sin(
                dLat / 2
            ) ** 2

            +

            Math.cos(
                toRadians(
                    lat1
                )
            )

            *

            Math.cos(
                toRadians(
                    lat2
                )
            )

            *

            Math.sin(
                dLon / 2
            ) ** 2;


        const c =
            2 *
            Math.atan2(
                Math.sqrt(a),
                Math.sqrt(
                    1 - a
                )
            );


        return (
            earthRadius *
            c
        );

    }


    // ==========================================
    // ROUTE CACHE
    // ==========================================

    const ROUTE_CACHE_KEY =
        "smartRiceMillRoadRouteCacheV2";


    function getRouteCache() {

        try {

            return (
                JSON.parse(
                    localStorage.getItem(
                        ROUTE_CACHE_KEY
                    )
                ) || {}
            );

        } catch (error) {

            return {};

        }

    }


    function saveRouteCache(
        cache
    ) {

        try {

            localStorage.setItem(
                ROUTE_CACHE_KEY,
                JSON.stringify(
                    cache
                )
            );

        } catch (error) {

            console.error(
                "Route cache error:",
                error
            );

        }

    }


    function createRouteCacheKey(
        destination
    ) {

        return (

            String(
                millLocation.upazilaId
            )

            +

            "-"

            +

            String(
                destination.upazilaId
            )

        );

    }


    // ==========================================
    // GET ROAD ROUTE FROM OSRM
    // ==========================================

    async function getRoadRoute(
        destination
    ) {

        const cache =
            getRouteCache();


        const cacheKey =
            createRouteCacheKey(
                destination
            );


        // Use cached route

        if (
            cache[cacheKey] &&
            cache[cacheKey].geometry
        ) {

            return cache[
                cacheKey
            ];

        }


        // OSRM requires:
        // longitude,latitude

        const startCoordinates =

            millLocation.lng +

            "," +

            millLocation.lat;


        const destinationCoordinates =

            destination.lng +

            "," +

            destination.lat;


        const url =

            "https://router.project-osrm.org/route/v1/driving/" +

            startCoordinates +

            ";" +

            destinationCoordinates +

            "?overview=full" +

            "&geometries=geojson" +

            "&steps=false";


        const response =
            await fetch(
                url
            );


        if (!response.ok) {

            throw new Error(
                "OSRM routing request failed."
            );

        }


        const data =
            await response.json();


        if (
            data.code !==
                "Ok" ||
            !Array.isArray(
                data.routes
            ) ||
            data.routes.length ===
                0
        ) {

            throw new Error(
                "No road route found."
            );

        }


        const route =
            data.routes[0];


        if (
            !route.geometry ||
            !Array.isArray(
                route.geometry.coordinates
            )
        ) {

            throw new Error(
                "Route geometry missing."
            );

        }


        const result = {

            geometry:
                route.geometry,

            distanceMeters:
                Number(
                    route.distance
                ),

            durationSeconds:
                Number(
                    route.duration
                ),

            savedAt:
                Date.now()

        };


        cache[cacheKey] =
            result;


        saveRouteCache(
            cache
        );


        return result;

    }


    // ==========================================
    // DRAW VISIBLE ROAD ROUTE
    // ==========================================

    function drawRoadRoute(
        routeData,
        status
    ) {

        const routeCoordinates =
            convertRouteCoordinates(
                routeData.geometry
            );


        if (
            routeCoordinates.length <
            2
        ) {

            throw new Error(
                "Invalid road route coordinates."
            );

        }


        // ======================================
        // WHITE OUTLINE
        // Makes route easy to see on roads
        // ======================================

        roadRouteOutline =
            L.polyline(
                routeCoordinates,
                {

                    pane:
                        "roadOutlinePane",

                    color:
                        "#ffffff",

                    weight:
                        12,

                    opacity:
                        0.95,

                    lineCap:
                        "round",

                    lineJoin:
                        "round",

                    interactive:
                        false

                }
            )
            .addTo(
                deliveryMap
            );


        // ======================================
        // MAIN ROAD ROUTE
        // ======================================

        const lineOptions = {

            pane:
                "roadRoutePane",

            color:
                getRouteColor(
                    status
                ),

            weight:
                7,

            opacity:
                1,

            lineCap:
                "round",

            lineJoin:
                "round"

        };


        // Pending = dashed road line

        if (
            status ===
            "pending"
        ) {

            lineOptions.dashArray =
                "13 9";

        }


        roadRouteLine =
            L.polyline(
                routeCoordinates,
                lineOptions
            )
            .addTo(
                deliveryMap
            );


        // Route tooltip

        roadRouteLine.bindTooltip(

            "Delivery Route",

            {

                sticky:
                    true

            }

        );


        // Make sure visible

        roadRouteOutline
            .bringToFront();


        roadRouteLine
            .bringToFront();


        // Fit map exactly around road

        const routeBounds =
            roadRouteLine
                .getBounds();


        deliveryMap
            .invalidateSize();


        deliveryMap.fitBounds(
            routeBounds,
            {

                padding:
                    [55, 55],

                maxZoom:
                    14

            }
        );

    }


    // ==========================================
    // SHOW SELECTED ROAD ROUTE
    // ==========================================

    async function showSelectedRoute() {

        const destination =
            getSelectedDestination();


        if (
            !destination ||
            !deliveryMap
        ) {

            return null;

        }


        if (
            !Number.isFinite(
                destination.lat
            ) ||
            !Number.isFinite(
                destination.lng
            )
        ) {

            showToast(
                "Destination coordinates were not found.",
                "error"
            );


            return null;

        }


        const requestNumber =
            ++routeRequestNumber;


        currentDestination =
            destination;


        currentRouteData =
            null;


        removeRouteLayers();


        // ======================================
        // DESTINATION MARKER
        // ======================================

        destinationMarker =
            L.circleMarker(
                [

                    destination.lat,

                    destination.lng

                ],
                {

                    radius:
                        10,

                    weight:
                        3,

                    color:
                        "#ffffff",

                    fillColor:
                        "#f08c00",

                    fillOpacity:
                        1

                }
            )
            .addTo(
                deliveryMap
            )
            .bindPopup(

                "<strong>Destination</strong><br>" +

                escapeHTML(
                    destination.upazilaName
                ) +

                ", " +

                escapeHTML(
                    destination.districtName
                )

            );


        destinationMarker.bindTooltip(
            "Delivery Destination",
            {

                direction:
                    "top",

                offset:
                    [0, -10]

            }
        );


        // ======================================
        // LOADING INFORMATION
        // ======================================

        destinationMapText.textContent =

            destination.upazilaName +

            ", " +

            destination.districtName;


        routeDistanceText.textContent =
            "Calculating...";


        routeDurationText.textContent =
            "Calculating...";


        mapRouteInformation.textContent =
            "Finding the vehicle road route...";


        locationDataMessage.textContent =
            "Calculating road route...";


        locationDataMessage.className =
            "location-message-info";


        // ======================================
        // ROAD ROUTE
        // ======================================

        try {

            const routeData =
                await getRoadRoute(
                    destination
                );


            if (
                requestNumber !==
                routeRequestNumber
            ) {

                return null;

            }


            currentRouteData = {

                ...routeData,

                source:
                    "road"

            };


            // ==================================
            // DRAW ACTUAL ROAD POLYLINE
            // ==================================

            drawRoadRoute(
                routeData,
                statusSelect.value ||
                "pending"
            );


            // ==================================
            // DISTANCE
            // ==================================

            const distanceKm =

                routeData
                    .distanceMeters /

                1000;


            routeDistanceText.textContent =

                distanceKm.toFixed(
                    1
                )

                +

                " km";


            // ==================================
            // DRIVE TIME
            // ==================================

            routeDurationText.textContent =

                formatDuration(
                    routeData
                        .durationSeconds
                );


            mapRouteInformation.textContent =

                millLocation.upazilaName +

                ", " +

                millLocation.districtName +

                " → " +

                destination.upazilaName +

                ", " +

                destination.districtName +

                " • " +

                distanceKm.toFixed(
                    1
                ) +

                " km road route";


            locationDataMessage.textContent =
                "Vehicle road route displayed successfully.";


            locationDataMessage.className =
                "location-message-success";


            destinationMarker
                .bringToFront();


            destinationMarker
                .openPopup();


            return currentRouteData;

        } catch (error) {

            console.error(
                "Road route error:",
                error
            );


            if (
                requestNumber !==
                routeRequestNumber
            ) {

                return null;

            }


            // ==================================
            // FALLBACK
            // Only if road service fails
            // ==================================

            const straightDistance =

                calculateStraightDistance(

                    millLocation.lat,

                    millLocation.lng,

                    destination.lat,

                    destination.lng

                );


            currentRouteData = {

                source:
                    "fallback",

                distanceMeters:
                    straightDistance *
                    1000,

                durationSeconds:
                    null,

                geometry:
                    null

            };


            fallbackRouteLine =
                L.polyline(
                    [

                        [

                            millLocation.lat,

                            millLocation.lng

                        ],

                        [

                            destination.lat,

                            destination.lng

                        ]

                    ],
                    {

                        color:
                            "#c62828",

                        weight:
                            5,

                        opacity:
                            0.9,

                        dashArray:
                            "8 8",

                        lineCap:
                            "round"

                    }
                )
                .addTo(
                    deliveryMap
                );


            deliveryMap.fitBounds(
                fallbackRouteLine
                    .getBounds(),
                {

                    padding:
                        [55, 55],

                    maxZoom:
                        12

                }
            );


            routeDistanceText.textContent =

                "~" +

                straightDistance.toFixed(
                    1
                )

                +

                " km";


            routeDurationText.textContent =
                "Unavailable";


            mapRouteInformation.textContent =
                "Road routing service unavailable — fallback line shown.";


            locationDataMessage.textContent =
                "Road route could not be loaded. Red dashed fallback line is shown.";


            locationDataMessage.className =
                "location-message-warning";


            return currentRouteData;

        }

    }


    // ==========================================
    // UPDATE ROAD LINE STATUS COLOR
    // ==========================================

    function updateRouteColor() {

        if (!roadRouteLine) {

            return;

        }


        const status =
            statusSelect.value ||
            "pending";


        const options = {

            color:
                getRouteColor(
                    status
                ),

            weight:
                7,

            opacity:
                1

        };


        if (
            status ===
            "pending"
        ) {

            options.dashArray =
                "13 9";

        } else {

            options.dashArray =
                null;

        }


        roadRouteLine.setStyle(
            options
        );


        roadRouteLine
            .bringToFront();

    }


    statusSelect
        .addEventListener(
            "change",
            function () {

                updateRouteColor();

            }
        );


    // ==========================================
    // CLEAR MAP
    // ==========================================

    function clearDestinationMap() {

        routeRequestNumber++;


        currentDestination =
            null;


        currentRouteData =
            null;


        removeRouteLayers();


        destinationMapText.textContent =
            "Not selected";


        routeDistanceText.textContent =
            "—";


        routeDurationText.textContent =
            "—";


        mapRouteInformation.textContent =
            "Select destination location to preview the road route.";


        if (deliveryMap) {

            deliveryMap.setView(
                [

                    millLocation.lat,

                    millLocation.lng

                ],
                9
            );


            setTimeout(
                function () {

                    deliveryMap
                        .invalidateSize();

                },
                100
            );

        }

    }


    resetMapBtn
        .addEventListener(
            "click",
            clearDestinationMap
        );


    // ==========================================
    // GENERATE DELIVERY ID
    // ==========================================

    function generateDeliveryId() {

        let highest =
            1000;


        deliveries.forEach(
            function (delivery) {

                if (
                    !delivery.deliveryId
                ) {

                    return;

                }


                const number =
                    Number(
                        delivery
                            .deliveryId
                            .replace(
                                "DEL-",
                                ""
                            )
                    );


                if (
                    Number.isFinite(
                        number
                    ) &&
                    number >
                        highest
                ) {

                    highest =
                        number;

                }

            }
        );


        return (
            "DEL-" +
            (highest + 1)
        );

    }


    // ==========================================
    // LOAD INVOICES
    // ==========================================

    function loadInvoices() {

        invoiceSelect.innerHTML = `

            <option
                value=""
                selected
                disabled
            >

                Select delivery invoice

            </option>

        `;


        getSales()
            .filter(
                function (sale) {

                    return (
                        sale.deliveryRequired ===
                        "yes"
                    );

                }
            )
            .forEach(
                function (sale) {

                    const alreadyUsed =
                        deliveries.some(
                            function (delivery) {

                                return (

                                    delivery.invoiceId ===
                                        sale.invoiceId

                                    &&

                                    delivery.id !==
                                        editingDeliveryId

                                );

                            }
                        );


                    if (alreadyUsed) {

                        return;

                    }


                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        sale.invoiceId;


                    option.textContent =

                        sale.invoiceId +

                        " — " +

                        sale.customerName +

                        " — " +

                        getProductName(
                            sale.product
                        );


                    invoiceSelect
                        .appendChild(
                            option
                        );

                }
            );


        if (
            invoiceSelect.options.length ===
            1
        ) {

            const option =
                document.createElement(
                    "option"
                );


            option.disabled =
                true;


            option.textContent =
                "No delivery invoice available";


            invoiceSelect
                .appendChild(
                    option
                );

        }

    }


    // ==========================================
    // INVOICE CHANGE
    // ==========================================

    invoiceSelect
        .addEventListener(
            "change",
            function () {

                loadSelectedInvoice();

            }
        );


    // ==========================================
    // LOAD SELECTED INVOICE
    // ==========================================

    async function loadSelectedInvoice() {

        const sale =
            getSales()
                .find(
                    function (item) {

                        return (
                            item.invoiceId ===
                            invoiceSelect.value
                        );

                    }
                );


        if (!sale) {

            return;

        }


        customerInput.value =
            sale.customerName;


        productInput.value =
            getProductName(
                sale.product
            );


        quantityInput.value =

            Number(
                sale.quantity
            ).toLocaleString(
                "en-US",
                {

                    maximumFractionDigits:
                        2

                }
            )

            +

            " kg";


        statusSelect.value =
            "pending";


        const customer =
            getCustomers()
                .find(
                    function (item) {

                        return (

                            Number(
                                item.id
                            )

                            ===

                            Number(
                                sale.customerId
                            )

                        );

                    }
                );


        // Structured Customer Location

        if (
            customer &&
            customer.divisionId &&
            customer.districtId &&
            customer.upazilaId
        ) {

            await setDestinationLocation(

                customer.divisionId,

                customer.districtId,

                customer.upazilaId

            );


            return;

        }


        // Old customer city support

        if (
            customer &&
            customer.city
        ) {

            const district =
                window.BDLocations
                    .findDistrictByName(
                        customer.city
                    );


            if (district) {

                const division =
                    window.BDLocations
                        .getDivisionForDistrict(
                            district
                        );


                if (division) {

                    destinationDivisionSelect.value =
                        division.id;


                    loadDistrictDropdown(

                        division.id,

                        district.id

                    );


                    loadUpazilaDropdown(
                        district.id
                    );


                    clearDestinationMap();


                    locationDataMessage.textContent =
                        "Customer district loaded. Select destination upazila.";


                    locationDataMessage.className =
                        "location-message-info";


                    return;

                }

            }

        }


        clearDestinationMap();


        locationDataMessage.textContent =
            "Select the customer's destination location.";


        locationDataMessage.className =
            "location-message-info";

    }


    // ==========================================
    // SUMMARY
    // ==========================================

    function updateSummary() {

        const today =
            getTodayDate();


        let running =
            0;


        let pending =
            0;


        let deliveredToday =
            0;


        deliveries.forEach(
            function (delivery) {

                if (
                    delivery.status ===
                    "on-the-way"
                ) {

                    running++;

                }


                if (
                    delivery.status ===
                    "pending"
                ) {

                    pending++;

                }


                if (
                    delivery.status ===
                        "delivered" &&
                    delivery.deliveredDate ===
                        today
                ) {

                    deliveredToday++;

                }

            }
        );


        runningValue.textContent =
            running;


        pendingValue.textContent =
            pending;


        deliveredTodayValue.textContent =
            deliveredToday;

    }


    // ==========================================
    // TABLE
    // ==========================================

    function displayDeliveries() {

        deliveryTableBody.innerHTML =
            "";


        deliveries.forEach(
            function (delivery) {

                const destinationText =

                    delivery.destinationLocation

                        ?

                        (

                            delivery
                                .destinationLocation
                                .upazilaName

                            +

                            ", "

                            +

                            delivery
                                .destinationLocation
                                .districtName

                        )

                        :

                        (
                            delivery.destination ||
                            "Legacy destination"
                        );


                let distanceText =
                    "";


                if (
                    Number.isFinite(
                        Number(
                            delivery.routeDistanceKm
                        )
                    )
                ) {

                    distanceText =

                        Number(
                            delivery.routeDistanceKm
                        ).toFixed(
                            1
                        )

                        +

                        " km road route";

                }


                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>

                        ${escapeHTML(
                            delivery.deliveryId
                        )}

                    </td>


                    <td>

                        ${escapeHTML(
                            delivery.invoiceId
                        )}

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
                            getDriverName(
                                delivery.driver
                            )
                        )}

                    </td>


                    <td>

                        <strong
                            class="table-primary-text"
                        >

                            ${escapeHTML(
                                destinationText
                            )}

                        </strong>


                        ${
                            distanceText

                            ?

                            `

                            <span
                                class="table-secondary-text"
                            >

                                ${escapeHTML(
                                    distanceText
                                )}

                            </span>

                            `

                            :

                            ""
                        }

                    </td>


                    <td>

                        ${escapeHTML(
                            getProductName(
                                delivery.product
                            )
                        )}

                        /

                        ${Number(
                            delivery.quantity
                        ).toLocaleString(
                            "en-US",
                            {
                                maximumFractionDigits:
                                    2
                            }
                        )}

                        kg

                    </td>


                    <td>

                        <span
                            class="
                                status-badge
                                ${getStatusClass(
                                    delivery.status
                                )}
                            "
                        >

                            ${getStatusText(
                                delivery.status
                            )}

                        </span>

                    </td>


                    <td>

                        ${formatDate(
                            delivery.createdDate
                        )}

                    </td>


                    <td>

                        <div class="table-action-group">

                            <button
                                type="button"
                                class="delivery-edit-button"
                                data-action="edit"
                                data-id="${delivery.id}"
                            >

                                Edit

                            </button>


                            <button
                                type="button"
                                class="delivery-delete-button"
                                data-action="delete"
                                data-id="${delivery.id}"
                            >

                                Delete

                            </button>

                        </div>

                    </td>

                `;


                deliveryTableBody
                    .appendChild(
                        row
                    );

            }
        );

    }


    // ==========================================
    // SAVE / UPDATE
    // ==========================================

    deliveryForm
        .addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const sale =
                    getSales()
                        .find(
                            function (item) {

                                return (
                                    item.invoiceId ===
                                    invoiceSelect.value
                                );

                            }
                        );


                if (!sale) {

                    showToast(
                        "Please select a sales invoice.",
                        "error"
                    );


                    return;

                }


                const destination =
                    getSelectedDestination();


                if (!destination) {

                    showToast(
                        "Please select Division, District and Upazila.",
                        "error"
                    );


                    return;

                }


                if (!truckSelect.value) {

                    showToast(
                        "Please select a truck.",
                        "error"
                    );


                    return;

                }


                if (!driverSelect.value) {

                    showToast(
                        "Please select a driver.",
                        "error"
                    );


                    return;

                }


                if (!statusSelect.value) {

                    showToast(
                        "Please select delivery status.",
                        "error"
                    );


                    return;

                }


                const duplicate =
                    deliveries.some(
                        function (delivery) {

                            return (

                                delivery.invoiceId ===
                                    sale.invoiceId

                                &&

                                delivery.id !==
                                    editingDeliveryId

                            );

                        }
                    );


                if (duplicate) {

                    showToast(
                        "Delivery already exists for this invoice.",
                        "error"
                    );


                    return;

                }


                const routeMatchesDestination =

                    currentDestination

                    &&

                    String(
                        currentDestination.upazilaId
                    )

                    ===

                    String(
                        destination.upazilaId
                    );


                if (
                    !currentRouteData ||
                    !routeMatchesDestination
                ) {

                    await showSelectedRoute();

                }


                const routeDistanceKm =

                    currentRouteData

                    &&

                    Number.isFinite(
                        currentRouteData
                            .distanceMeters
                    )

                        ?

                        currentRouteData
                            .distanceMeters /
                        1000

                        :

                        null;


                const estimatedDurationMinutes =

                    currentRouteData

                    &&

                    Number.isFinite(
                        currentRouteData
                            .durationSeconds
                    )

                        ?

                        Math.round(

                            currentRouteData
                                .durationSeconds /

                            60

                        )

                        :

                        null;


                // ==================================
                // UPDATE
                // ==================================

                if (
                    editingDeliveryId !==
                    null
                ) {

                    const index =
                        deliveries.findIndex(
                            function (delivery) {

                                return (
                                    delivery.id ===
                                    editingDeliveryId
                                );

                            }
                        );


                    if (index !== -1) {

                        const old =
                            deliveries[index];


                        deliveries[index] = {

                            id:
                                old.id,

                            deliveryId:
                                old.deliveryId,

                            saleId:
                                sale.id,

                            invoiceId:
                                sale.invoiceId,

                            customerId:
                                sale.customerId,

                            customerName:
                                sale.customerName,

                            product:
                                sale.product,

                            quantity:
                                Number(
                                    sale.quantity
                                ),

                            truckNumber:
                                truckSelect.value,

                            driver:
                                driverSelect.value,

                            startLocation:
                                millLocation,

                            destinationLocation:
                                destination,

                            destinationDetails:
                                destinationDetailsInput
                                    .value
                                    .trim(),

                            destination:

                                destination.upazilaName +

                                ", " +

                                destination.districtName,

                            routeDistanceKm:
                                routeDistanceKm,

                            estimatedDurationMinutes:
                                estimatedDurationMinutes,

                            routeSource:

                                currentRouteData

                                    ? currentRouteData
                                        .source

                                    : null,

                            status:
                                statusSelect.value,

                            createdDate:
                                old.createdDate,

                            updatedDate:
                                getTodayDate(),

                            deliveredDate:

                                statusSelect.value ===
                                "delivered"

                                    ?

                                    (

                                        old.status ===
                                            "delivered"

                                        &&

                                        old.deliveredDate

                                            ?

                                            old.deliveredDate

                                            :

                                            getTodayDate()

                                    )

                                    :

                                    null

                        };

                    }


                    saveDeliveries();

                    displayDeliveries();

                    updateSummary();

                    resetForm();


                    showToast(
                        "Delivery updated successfully!"
                    );


                    return;

                }


                // ==================================
                // NEW DELIVERY
                // ==================================

                const newDelivery = {

                    id:
                        Date.now(),

                    deliveryId:
                        generateDeliveryId(),

                    saleId:
                        sale.id,

                    invoiceId:
                        sale.invoiceId,

                    customerId:
                        sale.customerId,

                    customerName:
                        sale.customerName,

                    product:
                        sale.product,

                    quantity:
                        Number(
                            sale.quantity
                        ),

                    truckNumber:
                        truckSelect.value,

                    driver:
                        driverSelect.value,

                    startLocation:
                        millLocation,

                    destinationLocation:
                        destination,

                    destinationDetails:
                        destinationDetailsInput
                            .value
                            .trim(),

                    destination:

                        destination.upazilaName +

                        ", " +

                        destination.districtName,

                    routeDistanceKm:
                        routeDistanceKm,

                    estimatedDurationMinutes:
                        estimatedDurationMinutes,

                    routeSource:

                        currentRouteData

                            ? currentRouteData
                                .source

                            : null,

                    status:
                        statusSelect.value,

                    createdDate:
                        getTodayDate(),

                    updatedDate:
                        getTodayDate(),

                    deliveredDate:

                        statusSelect.value ===
                        "delivered"

                            ?

                            getTodayDate()

                            :

                            null

                };


                deliveries.push(
                    newDelivery
                );


                saveDeliveries();

                displayDeliveries();

                updateSummary();

                resetForm();


                showToast(
                    "Delivery saved successfully!"
                );

            }
        );


    // ==========================================
    // TABLE ACTION
    // ==========================================

    deliveryTableBody
        .addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "button"
                    );


                if (!button) {

                    return;

                }


                const id =
                    Number(
                        button.dataset.id
                    );


                if (
                    button.dataset.action ===
                    "edit"
                ) {

                    editDelivery(
                        id
                    );

                }


                if (
                    button.dataset.action ===
                    "delete"
                ) {

                    deleteDelivery(
                        id
                    );

                }

            }
        );


    // ==========================================
    // EDIT
    // ==========================================

    async function editDelivery(id) {

        const delivery =
            deliveries.find(
                function (item) {

                    return (
                        item.id ===
                        id
                    );

                }
            );


        if (!delivery) {

            showToast(
                "Delivery record not found.",
                "error"
            );


            return;

        }


        editingDeliveryId =
            delivery.id;


        loadInvoices();


        const invoiceExists =
            Array.from(
                invoiceSelect.options
            )
            .some(
                function (option) {

                    return (
                        option.value ===
                        delivery.invoiceId
                    );

                }
            );


        if (!invoiceExists) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                delivery.invoiceId;


            option.textContent =

                delivery.invoiceId +

                " — " +

                delivery.customerName;


            invoiceSelect
                .appendChild(
                    option
                );

        }


        invoiceSelect.value =
            delivery.invoiceId;


        customerInput.value =
            delivery.customerName;


        productInput.value =
            getProductName(
                delivery.product
            );


        quantityInput.value =

            Number(
                delivery.quantity
            ).toLocaleString(
                "en-US",
                {

                    maximumFractionDigits:
                        2

                }
            )

            +

            " kg";


        truckSelect.value =
            delivery.truckNumber;


        driverSelect.value =
            delivery.driver;


        statusSelect.value =
            delivery.status;


        destinationDetailsInput.value =
            delivery.destinationDetails ||
            "";


        if (
            delivery.destinationLocation
        ) {

            await setDestinationLocation(

                delivery
                    .destinationLocation
                    .divisionId,

                delivery
                    .destinationLocation
                    .districtId,

                delivery
                    .destinationLocation
                    .upazilaId

            );

        } else {

            destinationDivisionSelect.value =
                "";


            loadDistrictDropdown(
                null
            );


            clearDestinationMap();


            locationDataMessage.textContent =
                "Old delivery record. Select Division, District and Upazila before updating.";


            locationDataMessage.className =
                "location-message-info";

        }


        saveDeliveryBtn.innerHTML = `

            <span>
                ▣
            </span>

            Update Delivery

        `;


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
    // DELETE
    // ==========================================

    function deleteDelivery(id) {

        const exists =
            deliveries.some(
                function (delivery) {

                    return (
                        delivery.id ===
                        id
                    );

                }
            );


        if (!exists) {

            showToast(
                "Delivery record not found.",
                "error"
            );


            return;

        }


        deliveries =
            deliveries.filter(
                function (delivery) {

                    return (
                        delivery.id !==
                        id
                    );

                }
            );


        saveDeliveries();

        displayDeliveries();

        updateSummary();


        if (
            editingDeliveryId ===
            id
        ) {

            resetForm();

        } else {

            loadInvoices();

        }


        showToast(
            "Delivery deleted successfully!"
        );

    }


    // ==========================================
    // RESET FORM
    // ==========================================

    function resetForm() {

        deliveryForm.reset();


        editingDeliveryId =
            null;


        customerInput.value =
            "";


        productInput.value =
            "";


        quantityInput.value =
            "";


        destinationDistrictSelect
            .innerHTML = `

                <option
                    value=""
                    selected
                    disabled
                >
                    Select district
                </option>

            `;


        destinationUpazilaSelect
            .innerHTML = `

                <option
                    value=""
                    selected
                    disabled
                >
                    Select upazila
                </option>

            `;


        destinationDistrictSelect.disabled =
            true;


        destinationUpazilaSelect.disabled =
            true;


        clearDestinationMap();


        saveDeliveryBtn.innerHTML = `

            <span>
                ▣
            </span>

            Save Delivery

        `;


        loadInvoices();


        locationDataMessage.textContent =
            "Bangladesh location data ready.";


        locationDataMessage.className =
            "location-message-success";

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
                ".delivery-toast"
            );


        if (oldToast) {

            oldToast.remove();

        }


        const toast =
            document.createElement(
                "div"
            );


        toast.className =

            "delivery-toast " +

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
    // MAP RESIZE FIX
    // ==========================================

    window.addEventListener(
        "load",
        function () {

            setTimeout(
                function () {

                    if (deliveryMap) {

                        deliveryMap
                            .invalidateSize();

                    }

                },
                500
            );

        }
    );


    window.addEventListener(
        "resize",
        function () {

            if (deliveryMap) {

                deliveryMap
                    .invalidateSize();

            }

        }
    );


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    loadDivisionDropdown();

    initializeMap();

    loadInvoices();

    displayDeliveries();

    updateSummary();

});