document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       SMART RICE MILL ERP
       LIVE INTEGRATED DASHBOARD

       IMPORTANT
       ---------
       Inventory values use the SAME transaction
       calculation used by inventory.js:

       Accepted Purchase
            ↓
       Production
            ↓
       Sales
            ↓
       Manual Adjustment / Reversal
            ↓
       Current Inventory
    ========================================== */


    /* =========================================
       1. ELEMENTS
    ========================================== */

    const sidebar =
        document.getElementById("sidebar");

    const menuButton =
        document.getElementById("menuButton");

    const sidebarBackdrop =
        document.getElementById("sidebarBackdrop");

    const lastUpdatedText =
        document.getElementById("lastUpdatedText");

    const summaryCards =
        document.querySelectorAll(".summary-card");

    const salesChart =
        document.querySelector(".sales-chart-svg");

    const salesPolyline =
        salesChart
            ? salesChart.querySelector("polyline")
            : null;

    const salesPoints =
        salesChart
            ? salesChart.querySelectorAll(".sales-point")
            : [];

    const salesAxisLabels =
        document.querySelectorAll(
            ".sales-axis-labels span"
        );

    const inventoryBarItems =
        document.querySelectorAll(
            ".bar-chart .bar-item"
        );

    const lowStockKey =
        document.querySelector(
            ".low-stock-key"
        );

    const activityTableBody =
        document.querySelector(
            ".activity-table tbody"
        );


    /* =========================================
       2. INVENTORY PRODUCTS
    ========================================== */

    const PRODUCTS = {

        paddy: {
            label: "Accepted Paddy",
            chartLabel: "Paddy"
        },

        wholeRice: {
            label: "Whole Rice",
            chartLabel: "Rice"
        },

        khud: {
            label: "Khud / Broken Rice",
            chartLabel: "Khud"
        },

        bran: {
            label: "Rice Bran",
            chartLabel: "Bran"
        },

        tush: {
            label: "Tush / Husk",
            chartLabel: "Tush"
        },

        waste: {
            label: "Waste",
            chartLabel: "Waste"
        }

    };


    const INVENTORY_PRODUCT_KEYS = [

        "paddy",
        "wholeRice",
        "khud",
        "tush",
        "bran"

    ];


    const DEFAULT_SAFETY_STOCK = {

        paddy:
            500,

        wholeRice:
            300,

        khud:
            50,

        tush:
            100,

        bran:
            50

    };


    /* =========================================
       3. STORAGE HELPERS
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
                JSON.parse(value)
                ??
                fallback
            );

        }
        catch {

            return fallback;

        }

    }


    function getPurchases() {

        const purchases =
            safeParseStorage(
                "purchases",
                []
            );


        return Array.isArray(
            purchases
        )
            ?
            purchases
            :
            [];

    }


    function getQualityInspections() {

        const records =
            safeParseStorage(
                "qualityInspections",
                []
            );


        return Array.isArray(
            records
        )
            ?
            records
            :
            [];

    }


    function getProductionRecords() {

        const mainRecords =
            safeParseStorage(
                "productionRecords",
                null
            );


        if (
            Array.isArray(
                mainRecords
            )
        ) {

            return mainRecords;

        }


        const fallbackRecords =
            safeParseStorage(
                "productions",
                []
            );


        return Array.isArray(
            fallbackRecords
        )
            ?
            fallbackRecords
            :
            [];

    }


    function getSalesRecords() {

        const mainRecords =
            safeParseStorage(
                "salesRecords",
                null
            );


        if (
            Array.isArray(
                mainRecords
            )
        ) {

            return mainRecords;

        }


        const fallbackRecords =
            safeParseStorage(
                "sales",
                []
            );


        return Array.isArray(
            fallbackRecords
        )
            ?
            fallbackRecords
            :
            [];

    }


    function getDeliveryRecords() {

        const possibleKeys = [

            "deliveryRecords",
            "deliveries"

        ];


        for (
            const key
            of possibleKeys
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
            ) {

                return records;

            }

        }


        return [];

    }


    function getMaintenanceRecords() {

        const possibleKeys = [

            "maintenanceRecords",
            "machineMaintenanceRecords",
            "maintenanceHistory"

        ];


        for (
            const key
            of possibleKeys
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
            ) {

                return records;

            }

        }


        return [];

    }


    function loadAdjustments() {

        const records =
            safeParseStorage(
                "inventoryAdjustments",
                []
            );


        if (
            !Array.isArray(
                records
            )
        ) {

            return [];

        }


        return records.map(
            function (
                adjustment,
                index
            ) {

                return {

                    id:

                        adjustment.id
                        ??
                        Date.now() +
                        index,


                    adjustmentId:

                        adjustment.adjustmentId
                        ||
                        `ADJ-${String(
                            index + 1
                        ).padStart(
                            3,
                            "0"
                        )}`,


                    product:

                        adjustment.product
                        ||
                        "wholeRice",


                    type:

                        adjustment.type ===
                        "out"

                            ?

                            "out"

                            :

                            "in",


                    quantity:

                        Number(
                            adjustment.quantity
                            ||
                            0
                        ),


                    date:

                        adjustment.date
                        ||
                        "",


                    reason:

                        adjustment.reason
                        ||
                        "Inventory adjustment",


                    status:

                        adjustment.status
                        ||
                        "active",


                    reversalOf:

                        adjustment.reversalOf
                        ||
                        null,


                    reversedBy:

                        adjustment.reversedBy
                        ||
                        null,


                    createdAt:

                        adjustment.createdAt
                        ||
                        adjustment.id
                        ||
                        index

                };

            }
        );

    }


    function loadSafetyStock() {

        const stored =
            safeParseStorage(
                "inventorySafetyStock",
                {}
            );


        return {

            ...DEFAULT_SAFETY_STOCK,

            ...(
                stored &&
                typeof stored === "object" &&
                !Array.isArray(stored)

                    ?

                    stored

                    :

                    {}
            )

        };

    }


    /* =========================================
       4. GENERIC HELPERS
    ========================================== */

    function normalizeText(value) {

        return String(
            value ?? ""
        )
            .trim()
            .toLowerCase();

    }


    function stringValue(
        ...values
    ) {

        for (
            const value
            of values
        ) {

            if (
                value !== null &&
                value !== undefined &&
                String(value).trim() !== ""
            ) {

                return String(value)
                    .trim();

            }

        }


        return "";

    }


    function numberValue(
        ...values
    ) {

        for (
            const value
            of values
        ) {

            if (
                value === null ||
                value === undefined ||
                value === ""
            ) {

                continue;

            }


            const cleaned =
                String(value)
                    .replace(
                        /[৳,\s]/g,
                        ""
                    );


            const number =
                Number(cleaned);


            if (
                Number.isFinite(
                    number
                )
            ) {

                return number;

            }

        }


        return 0;

    }


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


    function formatNumber(value) {

        return Number(
            value || 0
        )
            .toLocaleString(
                "en-US",
                {
                    maximumFractionDigits:
                        2
                }
            );

    }


    function formatMoney(value) {

        return (
            "৳"
            +
            Number(
                value || 0
            )
                .toLocaleString(
                    "en-IN",
                    {
                        maximumFractionDigits:
                            2
                    }
                )
        );

    }


    function formatKg(value) {

        return (
            formatNumber(
                value
            )
            +
            " kg"
        );

    }


    /* =========================================
       5. DATE HELPERS
    ========================================== */

    function getToday() {

        const now =
            new Date();


        return new Date(

            now.getFullYear(),

            now.getMonth(),

            now.getDate()

        );

    }


    function parseDate(value) {

        if (!value) {
            return null;
        }


        const raw =
            String(value)
                .trim();


        let match =
            raw.match(
                /^(\d{4})-(\d{1,2})-(\d{1,2})/
            );


        if (match) {

            return new Date(

                Number(
                    match[1]
                ),

                Number(
                    match[2]
                ) - 1,

                Number(
                    match[3]
                )

            );

        }


        match =
            raw.match(
                /^(\d{1,2})\/(\d{1,2})\/(\d{4})/
            );


        if (match) {

            return new Date(

                Number(
                    match[3]
                ),

                Number(
                    match[1]
                ) - 1,

                Number(
                    match[2]
                )

            );

        }


        const parsed =
            new Date(raw);


        if (
            Number.isNaN(
                parsed.getTime()
            )
        ) {

            return null;

        }


        return new Date(

            parsed.getFullYear(),

            parsed.getMonth(),

            parsed.getDate()

        );

    }


    function isSameDate(
        firstDate,
        secondDate
    ) {

        if (
            !firstDate ||
            !secondDate
        ) {

            return false;

        }


        return (

            firstDate.getFullYear() ===
                secondDate.getFullYear()

            &&

            firstDate.getMonth() ===
                secondDate.getMonth()

            &&

            firstDate.getDate() ===
                secondDate.getDate()

        );

    }


    function getRecordDate(
        record,
        fields
    ) {

        for (
            const field
            of fields
        ) {

            const date =
                parseDate(
                    record[field]
                );


            if (date) {

                return date;

            }

        }


        return null;

    }


    function getRecordTime(record) {

        return stringValue(

            record.time,

            record.createdTime,

            record.transactionTime,

            record.purchaseTime,

            record.invoiceTime,

            record.saleTime,

            record.deliveryTime,

            record.productionTime

        );

    }


    function getDateTimeValue(
        date,
        time
    ) {

        if (!date) {
            return 0;
        }


        const result =
            new Date(
                date.getTime()
            );


        if (time) {

            const match =
                String(time)
                    .match(
                        /(\d{1,2}):(\d{2})\s*(AM|PM)?/i
                    );


            if (match) {

                let hour =
                    Number(
                        match[1]
                    );


                const minute =
                    Number(
                        match[2]
                    );


                const meridiem =
                    match[3]

                        ?

                        match[3]
                            .toUpperCase()

                        :

                        "";


                if (
                    meridiem === "PM" &&
                    hour < 12
                ) {

                    hour += 12;

                }


                if (
                    meridiem === "AM" &&
                    hour === 12
                ) {

                    hour = 0;

                }


                result.setHours(

                    hour,

                    minute,

                    0,

                    0

                );

            }

        }


        return result.getTime();

    }


    function formatActivityTime(
        date,
        time
    ) {

        if (time) {
            return time;
        }


        if (
            date &&
            isSameDate(
                date,
                getToday()
            )
        ) {

            return "Today";

        }


        if (date) {

            return date
                .toLocaleDateString(
                    "en-GB",
                    {
                        day:
                            "2-digit",

                        month:
                            "short"
                    }
                );

        }


        return "—";

    }


    /* =========================================
       6. NORMALIZE INVENTORY PRODUCT KEY

       Same logic as inventory.js
    ========================================== */

    function normalizeProductKey(value) {

        const normalized =
            String(
                value || ""
            )
                .trim()
                .toLowerCase()
                .replace(
                    /[\s_-]+/g,
                    ""
                );


        if (
            [
                "paddy",
                "acceptedpaddy",
                "rawpaddy"
            ]
                .includes(
                    normalized
                )
        ) {

            return "paddy";

        }


        if (
            [
                "rice",
                "wholerice",
                "finishedrice",
                "milledrice"
            ]
                .includes(
                    normalized
                )
        ) {

            return "wholeRice";

        }


        if (
            [
                "khud",
                "brokenrice",
                "khudbrokenrice"
            ]
                .includes(
                    normalized
                )
        ) {

            return "khud";

        }


        if (
            [
                "tush",
                "husk",
                "ricehusk",
                "tushhusk"
            ]
                .includes(
                    normalized
                )
        ) {

            return "tush";

        }


        if (
            [
                "bran",
                "ricebran"
            ]
                .includes(
                    normalized
                )
        ) {

            return "bran";

        }


        return null;

    }


    /* =========================================
       7. ACCEPTED PADDY MOVEMENTS

       A purchase becomes usable inventory only
       after Quality Inspection = accepted.
    ========================================== */

    function getAcceptedPaddyMovements() {

        const purchases =
            getPurchases();


        const inspections =
            getQualityInspections();


        const acceptedIds =
            new Set(

                inspections

                    .filter(
                        function (
                            inspection
                        ) {

                            return (
                                normalizeText(
                                    inspection.decision
                                )
                                ===
                                "accepted"
                            );

                        }
                    )

                    .map(
                        function (
                            inspection
                        ) {

                            return String(
                                inspection.purchaseId
                            );

                        }
                    )

            );


        return purchases

            .filter(
                function (
                    purchase
                ) {

                    return acceptedIds.has(

                        String(
                            purchase.purchaseId
                        )

                    );

                }
            )

            .map(
                function (
                    purchase,
                    index
                ) {

                    return {

                        movementId:

                            `PURCHASE-IN-${purchase.purchaseId}`,


                        product:
                            "paddy",


                        direction:
                            "in",


                        quantity:

                            Number(
                                purchase.weight ||
                                purchase.paddyWeight ||
                                0
                            ),


                        date:

                            purchase.purchaseDate ||
                            purchase.date ||
                            "",


                        source:
                            "Quality-Approved Purchase",


                        reference:

                            purchase.purchaseId ||
                            "—",


                        note:

                            `${
                                purchase.supplierName ||
                                "Supplier"
                            } · ${
                                purchase.paddyType ||
                                "Paddy"
                            }`,


                        createdAt:

                            Number(
                                purchase.createdAt ||
                                purchase.id ||
                                index
                            )

                    };

                }
            )

            .filter(
                function (
                    movement
                ) {

                    return (
                        movement.quantity >
                        0
                    );

                }
            );

    }


    /* =========================================
       8. PRODUCTION MOVEMENTS

       Same fields used by inventory.js.
    ========================================== */

    function getProductionMovements() {

        const movements =
            [];


        getProductionRecords()
            .forEach(
                function (
                    record,
                    index
                ) {

                    const date =

                        record.productionDate ||
                        record.date ||
                        "";


                    const reference =

                        record.batchId ||
                        record.batch ||
                        record.productionId ||
                        `PROD-${index + 1}`;


                    const baseCreatedAt =

                        Number(
                            record.createdAt ||
                            record.id ||
                            index
                        );


                    const inputPaddy =

                        Number(
                            record.inputPaddy ||
                            record.paddyInput ||
                            record.inputPaddyQuantity ||
                            0
                        );


                    if (
                        inputPaddy > 0
                    ) {

                        movements.push({

                            movementId:

                                `${reference}-PADDY-OUT`,


                            product:
                                "paddy",


                            direction:
                                "out",


                            quantity:
                                inputPaddy,


                            date:
                                date,


                            source:
                                "Production",


                            reference:
                                reference,


                            note:

                                `Consumed from ${
                                    record.purchaseId ||
                                    "accepted purchase"
                                }`,


                            createdAt:

                                baseCreatedAt +
                                0.01

                        });

                    }


                    const outputs = [

                        {

                            key:
                                "wholeRice",

                            quantity:

                                Number(
                                    record.riceProduced ||
                                    record.wholeRiceProduced ||
                                    record.rice ||
                                    0
                                )

                        },


                        {

                            key:
                                "khud",

                            quantity:

                                Number(
                                    record.khudProduced ||
                                    record.khud ||
                                    record.brokenRice ||
                                    0
                                )

                        },


                        {

                            key:
                                "tush",

                            quantity:

                                Number(
                                    record.tushProduced ||
                                    record.tush ||
                                    record.husk ||
                                    0
                                )

                        },


                        {

                            key:
                                "bran",

                            quantity:

                                Number(
                                    record.branProduced ||
                                    record.riceBranProduced ||
                                    record.bran ||
                                    0
                                )

                        }

                    ];


                    outputs.forEach(
                        function (
                            output,
                            outputIndex
                        ) {

                            if (
                                output.quantity <=
                                0
                            ) {

                                return;

                            }


                            movements.push({

                                movementId:

                                    `${reference}-${output.key}-IN`,


                                product:
                                    output.key,


                                direction:
                                    "in",


                                quantity:
                                    output.quantity,


                                date:
                                    date,


                                source:
                                    "Production",


                                reference:
                                    reference,


                                note:

                                    `Output from ${
                                        record.purchaseId ||
                                        "source purchase"
                                    }`,


                                createdAt:

                                    baseCreatedAt +
                                    0.02 +
                                    outputIndex /
                                    1000

                            });

                        }
                    );

                }
            );


        return movements;

    }


    /* =========================================
       9. SALES STOCK-OUT MOVEMENTS

       Same stock deduction used by inventory.js.
    ========================================== */

    function getSalesMovements() {

        const movements =
            [];


        getSalesRecords()
            .forEach(
                function (
                    sale,
                    index
                ) {

                    const product =
                        normalizeProductKey(

                            sale.productKey ||
                            sale.product ||
                            sale.productType ||
                            sale.item ||
                            sale.riceType

                        );


                    if (!product) {
                        return;
                    }


                    let quantityKg =
                        Number(

                            sale.quantityKg ||
                            sale.weightKg ||
                            0

                        );


                    if (
                        quantityKg <= 0
                    ) {

                        const unit =
                            String(
                                sale.unit ||
                                ""
                            )
                                .trim()
                                .toLowerCase();


                        if (
                            unit === "kg" ||
                            unit === "kilogram" ||
                            unit === "kilograms"
                        ) {

                            quantityKg =
                                Number(

                                    sale.quantity ||
                                    sale.weight ||
                                    0

                                );

                        }

                    }


                    if (
                        quantityKg <= 0 &&
                        Number(
                            sale.bagWeightKg
                        ) > 0 &&
                        Number(
                            sale.quantity ||
                            sale.bags
                        ) > 0
                    ) {

                        quantityKg =

                            Number(
                                sale.bagWeightKg
                            )

                            *

                            Number(
                                sale.quantity ||
                                sale.bags
                            );

                    }


                    if (
                        quantityKg <= 0
                    ) {

                        return;

                    }


                    movements.push({

                        movementId:

                            `SALE-OUT-${
                                sale.saleId ||
                                sale.id ||
                                index
                            }`,


                        product:
                            product,


                        direction:
                            "out",


                        quantity:
                            quantityKg,


                        date:

                            sale.saleDate ||
                            sale.invoiceDate ||
                            sale.date ||
                            "",


                        source:
                            "Sales",


                        reference:

                            sale.saleId ||
                            sale.invoiceId ||
                            sale.invoiceNumber ||
                            `SALE-${index + 1}`,


                        note:

                            sale.customerName

                                ?

                                `Sold to ${sale.customerName}`

                                :

                                "Sales stock issue",


                        createdAt:

                            Number(
                                sale.createdAt ||
                                sale.id ||
                                index
                            )

                    });

                }
            );


        return movements;

    }


    /* =========================================
       10. ADJUSTMENT + REVERSAL MOVEMENTS
    ========================================== */

    function getAdjustmentMovements() {

        return loadAdjustments()
            .map(
                function (
                    adjustment
                ) {

                    const isReversal =
                        Boolean(
                            adjustment.reversalOf
                        );


                    return {

                        movementId:

                            `ADJUSTMENT-${adjustment.id}`,


                        product:
                            adjustment.product,


                        direction:
                            adjustment.type,


                        quantity:

                            Number(
                                adjustment.quantity
                            ),


                        date:
                            adjustment.date,


                        source:

                            isReversal

                                ?

                                "Adjustment Reversal"

                                :

                                "Stock Adjustment",


                        reference:
                            adjustment.adjustmentId,


                        note:
                            adjustment.reason,


                        createdAt:
                            adjustment.createdAt

                    };

                }
            );

    }


    /* =========================================
       11. BUILD ALL INVENTORY MOVEMENTS
    ========================================== */

    function buildInventoryMovements() {

        const movements = [

            ...getAcceptedPaddyMovements(),

            ...getProductionMovements(),

            ...getSalesMovements(),

            ...getAdjustmentMovements()

        ];


        return movements

            .filter(
                function (
                    movement
                ) {

                    return (

                        INVENTORY_PRODUCT_KEYS
                            .includes(
                                movement.product
                            )

                        &&

                        Number(
                            movement.quantity
                        ) > 0

                    );

                }
            )

            .sort(
                function (
                    first,
                    second
                ) {

                    const dateCompare =

                        String(
                            first.date ||
                            ""
                        )
                            .localeCompare(
                                String(
                                    second.date ||
                                    ""
                                )
                            );


                    if (
                        dateCompare !==
                        0
                    ) {

                        return dateCompare;

                    }


                    return (

                        Number(
                            first.createdAt ||
                            0
                        )

                        -

                        Number(
                            second.createdAt ||
                            0
                        )

                    );

                }
            );

    }


    /* =========================================
       12. RUNNING BALANCES
    ========================================== */

    function attachRunningBalances(
        movements
    ) {

        const balances = {

            paddy:
                0,

            wholeRice:
                0,

            khud:
                0,

            tush:
                0,

            bran:
                0

        };


        return movements.map(
            function (
                movement
            ) {

                const signedQuantity =

                    movement.direction ===
                    "in"

                        ?

                        movement.quantity

                        :

                        -movement.quantity;


                balances[
                    movement.product
                ] +=
                    signedQuantity;


                return {

                    ...movement,

                    balanceAfter:

                        balances[
                            movement.product
                        ]

                };

            }
        );

    }


    /* =========================================
       13. CURRENT INVENTORY STATE
    ========================================== */

    function buildInventoryState() {

        const safetyStock =
            loadSafetyStock();


        const movements =
            attachRunningBalances(
                buildInventoryMovements()
            );


        const state = {

            paddy: {

                quantity:
                    0,

                safetyStock:

                    Number(
                        safetyStock.paddy ||
                        0
                    )

            },


            wholeRice: {

                quantity:
                    0,

                safetyStock:

                    Number(
                        safetyStock.wholeRice ||
                        0
                    )

            },


            khud: {

                quantity:
                    0,

                safetyStock:

                    Number(
                        safetyStock.khud ||
                        0
                    )

            },


            tush: {

                quantity:
                    0,

                safetyStock:

                    Number(
                        safetyStock.tush ||
                        0
                    )

            },


            bran: {

                quantity:
                    0,

                safetyStock:

                    Number(
                        safetyStock.bran ||
                        0
                    )

            },


            waste: {

                quantity:
                    0,

                safetyStock:
                    0

            }

        };


        movements.forEach(
            function (
                movement
            ) {

                if (
                    !state[
                        movement.product
                    ]
                ) {

                    return;

                }


                state[
                    movement.product
                ].quantity =
                    movement.balanceAfter;

            }
        );


        return {

            state:
                state,

            movements:
                movements

        };

    }


    /* =========================================
       14. INVENTORY STATUS
    ========================================== */

    function isLowStock(
        quantity,
        safetyStock
    ) {

        const stock =
            Number(
                quantity ||
                0
            );


        const safety =
            Number(
                safetyStock ||
                0
            );


        /*
           Matches Inventory page logic:
           zero/out-of-stock also needs attention.
        */

        if (
            safety <= 0
        ) {

            return false;

        }


        return (
            stock <= safety
        );

    }


    /* =========================================
       15. PURCHASE VALUES
    ========================================== */

    function getPurchaseAmount(
        record
    ) {

        const explicit =
            numberValue(

                record.totalPurchaseAmount,

                record.totalAmount,

                record.purchaseAmount,

                record.amount,

                record.total

            );


        if (
            explicit > 0
        ) {

            return explicit;

        }


        const weight =
            numberValue(

                record.weight,

                record.paddyWeight,

                record.quantity

            );


        const price =
            numberValue(

                record.pricePerKg,

                record.price

            );


        return (
            weight *
            price
        );

    }


    function getPurchaseQuantity(
        record
    ) {

        return numberValue(

            record.weight,

            record.paddyWeight,

            record.quantity

        );

    }


    /* =========================================
       16. SALES VALUES
    ========================================== */

    function getSalesAmount(
        record
    ) {

        return numberValue(

            record.totalAmount,

            record.invoiceAmount,

            record.salesAmount,

            record.amount,

            record.total

        );

    }


    function getSalesQuantity(
        record
    ) {

        let quantity =
            numberValue(

                record.quantityKg,

                record.weightKg

            );


        if (
            quantity > 0
        ) {

            return quantity;

        }


        const unit =
            normalizeText(
                record.unit
            );


        if (
            unit === "kg" ||
            unit === "kilogram" ||
            unit === "kilograms"
        ) {

            quantity =
                numberValue(

                    record.quantity,

                    record.weight

                );


            if (
                quantity > 0
            ) {

                return quantity;

            }

        }


        const bags =
            numberValue(

                record.quantity,

                record.bags

            );


        const bagWeight =
            numberValue(
                record.bagWeightKg
            );


        if (
            bags > 0 &&
            bagWeight > 0
        ) {

            return (
                bags *
                bagWeight
            );

        }


        return 0;

    }


    /* =========================================
       17. DELIVERY STATUS
    ========================================== */

    function isPendingDelivery(
        record
    ) {

        const status =
            normalizeText(

                record.deliveryStatus ||

                record.status

            );


        return (

            status === "pending"

            ||

            status.includes(
                "on the way"
            )

            ||

            status.includes(
                "in transit"
            )

            ||

            status.includes(
                "running"
            )

        );

    }


    /* =========================================
       18. DASHBOARD KPI CALCULATION
    ========================================== */

    function calculateDashboardKPIs() {

        const today =
            getToday();


        const purchases =
            getPurchases();


        const sales =
            getSalesRecords();


        const deliveries =
            getDeliveryRecords();


        const inventory =
            buildInventoryState()
                .state;


        const todayPurchases =
            purchases.filter(
                function (
                    record
                ) {

                    const date =
                        getRecordDate(
                            record,
                            [
                                "purchaseDate",
                                "date",
                                "createdAt"
                            ]
                        );


                    return isSameDate(
                        date,
                        today
                    );

                }
            );


        const todaySales =
            sales.filter(
                function (
                    record
                ) {

                    const date =
                        getRecordDate(
                            record,
                            [
                                "saleDate",
                                "invoiceDate",
                                "date",
                                "createdAt"
                            ]
                        );


                    return isSameDate(
                        date,
                        today
                    );

                }
            );


        const todayPurchaseAmount =
            todayPurchases.reduce(
                function (
                    total,
                    record
                ) {

                    return (
                        total +
                        getPurchaseAmount(
                            record
                        )
                    );

                },
                0
            );


        const todaySalesAmount =
            todaySales.reduce(
                function (
                    total,
                    record
                ) {

                    return (
                        total +
                        getSalesAmount(
                            record
                        )
                    );

                },
                0
            );


        const pendingDeliveryCount =
            deliveries.filter(
                isPendingDelivery
            )
                .length;


        return {

            todayPurchaseAmount:
                todayPurchaseAmount,

            todaySalesAmount:
                todaySalesAmount,

            wholeRiceStock:

                Number(
                    inventory
                        .wholeRice
                        .quantity ||
                    0
                ),

            pendingDeliveries:
                pendingDeliveryCount

        };

    }


    /* =========================================
       19. SUMMARY CARDS
    ========================================== */

    function renderSummaryCards() {

        const kpis =
            calculateDashboardKPIs();


        summaryCards.forEach(
            function (
                card
            ) {

                const href =
                    card.getAttribute(
                        "href"
                    );


                const valueElement =
                    card.querySelector(
                        ".summary-details h2"
                    );


                if (!valueElement) {
                    return;
                }


                if (
                    href ===
                    "purchase.html"
                ) {

                    valueElement.textContent =
                        formatMoney(
                            kpis
                                .todayPurchaseAmount
                        );

                }


                if (
                    href ===
                    "sales.html"
                ) {

                    valueElement.textContent =
                        formatMoney(
                            kpis
                                .todaySalesAmount
                        );

                }


                if (
                    href ===
                    "inventory.html"
                ) {

                    valueElement.textContent =
                        formatKg(
                            kpis
                                .wholeRiceStock
                        );

                }


                if (
                    href ===
                    "delivery.html"
                ) {

                    valueElement.textContent =
                        String(
                            kpis
                                .pendingDeliveries
                        );

                }

            }
        );

    }


    /* =========================================
       20. LAST 7 DAYS
    ========================================== */

    function getLastSevenDays() {

        const today =
            getToday();


        const days =
            [];


        for (
            let offset = 6;
            offset >= 0;
            offset--
        ) {

            days.push(

                new Date(

                    today.getFullYear(),

                    today.getMonth(),

                    today.getDate() -
                    offset

                )

            );

        }


        return days;

    }


    /* =========================================
       21. SALES CHART
    ========================================== */

    function renderSalesChart() {

        if (
            !salesChart ||
            !salesPolyline
        ) {

            return;

        }


        const sales =
            getSalesRecords();


        const days =
            getLastSevenDays();


        const values =
            days.map(
                function (
                    day
                ) {

                    return sales

                        .filter(
                            function (
                                record
                            ) {

                                const date =
                                    getRecordDate(
                                        record,
                                        [
                                            "saleDate",
                                            "invoiceDate",
                                            "date",
                                            "createdAt"
                                        ]
                                    );


                                return isSameDate(
                                    date,
                                    day
                                );

                            }
                        )

                        .reduce(
                            function (
                                total,
                                record
                            ) {

                                return (

                                    total +

                                    getSalesAmount(
                                        record
                                    )

                                );

                            },
                            0
                        );

                }
            );


        const maximum =
            Math.max(
                ...values,
                1
            );


        const xStart =
            20;

        const xEnd =
            470;

        const yTop =
            25;

        const yBottom =
            135;


        const xStep =
            (
                xEnd -
                xStart
            )
            /
            6;


        const points =
            values.map(
                function (
                    value,
                    index
                ) {

                    const x =

                        xStart +

                        xStep *
                        index;


                    const ratio =
                        value /
                        maximum;


                    const y =

                        yBottom -

                        ratio *
                        (
                            yBottom -
                            yTop
                        );


                    return {

                        x:
                            Math.round(x),

                        y:
                            Math.round(y),

                        value:
                            value

                    };

                }
            );


        salesPolyline.setAttribute(

            "points",

            points

                .map(
                    function (
                        point
                    ) {

                        return (
                            `${point.x},${point.y}`
                        );

                    }
                )

                .join(" ")

        );


        salesPoints.forEach(
            function (
                group,
                index
            ) {

                const point =
                    points[index];


                if (!point) {
                    return;
                }


                const circle =
                    group.querySelector(
                        "circle"
                    );


                const title =
                    group.querySelector(
                        "title"
                    );


                if (circle) {

                    circle.setAttribute(
                        "cx",
                        point.x
                    );


                    circle.setAttribute(
                        "cy",
                        point.y
                    );

                }


                if (title) {

                    title.textContent =

                        `${
                            days[index]
                                .toLocaleDateString(
                                    "en-GB",
                                    {
                                        weekday:
                                            "long"
                                    }
                                )
                        }: ${
                            formatMoney(
                                point.value
                            )
                        }`;

                }

            }
        );


        salesAxisLabels.forEach(
            function (
                label,
                index
            ) {

                if (
                    !days[index]
                ) {

                    return;

                }


                label.textContent =
                    days[index]
                        .toLocaleDateString(
                            "en-GB",
                            {
                                weekday:
                                    "short"
                            }
                        );

            }
        );

    }


    /* =========================================
       22. INVENTORY CHART

       Exact inventory state from the same
       transaction logic as Inventory page.
    ========================================== */

    function renderInventoryChart() {

        const inventory =
            buildInventoryState()
                .state;


        const chartItems = [

            {
                key:
                    "paddy",

                label:
                    "Paddy"
            },

            {
                key:
                    "wholeRice",

                label:
                    "Rice"
            },

            {
                key:
                    "khud",

                label:
                    "Khud"
            },

            {
                key:
                    "bran",

                label:
                    "Bran"
            },

            {
                key:
                    "tush",

                label:
                    "Tush"
            },

            {
                key:
                    "waste",

                label:
                    "Waste"
            }

        ];


        const values =
            chartItems.map(
                function (
                    item
                ) {

                    return Math.max(

                        0,

                        Number(
                            inventory[
                                item.key
                            ]?.quantity ||
                            0
                        )

                    );

                }
            );


        const maximum =
            Math.max(
                ...values,
                1
            );


        let lowStockCount =
            0;


        chartItems.forEach(
            function (
                item,
                index
            ) {

                const barItem =
                    inventoryBarItems[
                        index
                    ];


                if (!barItem) {
                    return;
                }


                const record =

                    inventory[
                        item.key
                    ]

                    ||

                    {
                        quantity:
                            0,

                        safetyStock:
                            0
                    };


                const quantity =
                    Math.max(

                        0,

                        Number(
                            record.quantity ||
                            0
                        )

                    );


                const safetyStock =
                    Math.max(

                        0,

                        Number(
                            record.safetyStock ||
                            0
                        )

                    );


                const lowStock =

                    item.key !==
                    "waste"

                    &&

                    isLowStock(

                        quantity,

                        safetyStock

                    );


                if (
                    lowStock
                ) {

                    lowStockCount++;

                }


                let height =
                    (
                        quantity /
                        maximum
                    )
                    *
                    88;


                if (
                    quantity > 0
                ) {

                    height =
                        Math.max(
                            8,
                            height
                        );

                }


                const bar =
                    barItem.querySelector(
                        ".bar"
                    );


                const label =
                    barItem.querySelector(
                        ".bar-label"
                    );


                if (bar) {

                    bar.dataset.height =
                        String(

                            Math.min(

                                88,

                                Math.round(
                                    height
                                )

                            )

                        );


                    bar.style.height =
                        "0%";


                    bar.classList.toggle(

                        "warning-bar",

                        lowStock

                    );


                    bar.classList.toggle(

                        "neutral-bar",

                        item.key ===
                        "waste"

                    );

                }


                if (label) {

                    label.textContent =
                        item.label;


                    label.classList.toggle(

                        "warning-label",

                        lowStock

                    );

                }


                let title =

                    `${item.label}: ${formatKg(
                        quantity
                    )}`;


                if (
                    safetyStock > 0
                ) {

                    title +=

                        ` | Safety Stock: ${formatKg(
                            safetyStock
                        )}`;

                }


                if (
                    lowStock
                ) {

                    title +=
                        " — Low Stock";

                }


                barItem.title =
                    title;

            }
        );


        if (
            lowStockKey
        ) {

            lowStockKey.innerHTML = `

                <span class="low-stock-dot"></span>

                Low Stock (${lowStockCount})

            `;

        }


        animateInventoryBars();

    }


    /* =========================================
       23. INVENTORY BAR ANIMATION
    ========================================== */

    function animateInventoryBars() {

        const bars =
            document.querySelectorAll(
                ".bar[data-height]"
            );


        bars.forEach(
            function (
                bar
            ) {

                const height =
                    Number(
                        bar.dataset.height
                    );


                if (
                    !Number.isFinite(
                        height
                    )
                ) {

                    bar.style.height =
                        "0%";

                    return;

                }


                requestAnimationFrame(
                    function () {

                        bar.style.height =

                            `${Math.min(
                                100,
                                Math.max(
                                    0,
                                    height
                                )
                            )}%`;

                    }
                );

            }
        );

    }


    /* =========================================
       24. STATUS STYLE
    ========================================== */

    function getStatusClass(
        status
    ) {

        const normalized =
            normalizeText(
                status
            );


        if (
            normalized.includes(
                "paid"
            )

            ||

            normalized.includes(
                "accepted"
            )

            ||

            normalized.includes(
                "completed"
            )

            ||

            normalized.includes(
                "delivered"
            )
        ) {

            return "status-completed";

        }


        if (
            normalized.includes(
                "due"
            )

            ||

            normalized.includes(
                "pending"
            )

            ||

            normalized.includes(
                "partial"
            )

            ||

            normalized.includes(
                "review"
            )

            ||

            normalized.includes(
                "way"
            )

            ||

            normalized.includes(
                "overdue"
            )

            ||

            normalized.includes(
                "reject"
            )
        ) {

            return "status-due";

        }


        return "status-completed";

    }


    /* =========================================
       25. PURCHASE ACTIVITY
    ========================================== */

    function buildPurchaseActivities() {

        return getPurchases()
            .map(
                function (
                    record,
                    index
                ) {

                    const date =
                        getRecordDate(
                            record,
                            [
                                "purchaseDate",
                                "date",
                                "createdAt"
                            ]
                        );


                    const time =
                        getRecordTime(
                            record
                        );


                    const supplier =
                        stringValue(

                            record.supplierName,

                            record.supplier,

                            record.farmerName,

                            "Supplier"

                        );


                    const quantity =
                        getPurchaseQuantity(
                            record
                        );


                    const status =
                        stringValue(

                            record.paymentStatus,

                            record.status,

                            "Recorded"

                        );


                    return {

                        activity:

                            `Purchased paddy from ${supplier}`,


                        module:
                            "Purchase",


                        amount:

                            quantity > 0

                                ?

                                formatKg(
                                    quantity
                                )

                                :

                                formatMoney(
                                    getPurchaseAmount(
                                        record
                                    )
                                ),


                        status:
                            status,


                        date:
                            date,


                        time:
                            time,


                        timestamp:

                            getDateTimeValue(
                                date,
                                time
                            ),


                        order:
                            index

                    };

                }
            );

    }


    /* =========================================
       26. QUALITY ACTIVITY
    ========================================== */

    function buildQualityActivities() {

        return getQualityInspections()
            .map(
                function (
                    record,
                    index
                ) {

                    const date =
                        getRecordDate(
                            record,
                            [
                                "inspectionDate",
                                "date",
                                "createdAt"
                            ]
                        );


                    const time =
                        getRecordTime(
                            record
                        );


                    const purchaseId =
                        stringValue(

                            record.purchaseId,

                            record.id,

                            "Purchase"

                        );


                    const decision =
                        stringValue(

                            record.decision,

                            record.status,

                            "Inspected"

                        );


                    const grade =
                        stringValue(
                            record.grade
                        );


                    return {

                        activity:

                            `Quality inspection completed for ${purchaseId}`,


                        module:
                            "Quality",


                        amount:

                            grade

                                ?

                                `Grade ${grade}`

                                :

                                "Inspection",


                        status:
                            decision,


                        date:
                            date,


                        time:
                            time,


                        timestamp:

                            getDateTimeValue(
                                date,
                                time
                            ),


                        order:
                            index

                    };

                }
            );

    }


    /* =========================================
       27. PRODUCTION ACTIVITY
    ========================================== */

    function buildProductionActivities() {

        return getProductionRecords()
            .map(
                function (
                    record,
                    index
                ) {

                    const date =
                        getRecordDate(
                            record,
                            [
                                "productionDate",
                                "date",
                                "createdAt"
                            ]
                        );


                    const time =
                        getRecordTime(
                            record
                        );


                    const id =
                        stringValue(

                            record.batchId,

                            record.productionId,

                            record.batch,

                            `PROD-${index + 1}`

                        );


                    const wholeRice =
                        numberValue(

                            record.riceProduced,

                            record.wholeRiceProduced,

                            record.rice

                        );


                    return {

                        activity:

                            `Production batch ${id} completed`,


                        module:
                            "Production",


                        amount:

                            wholeRice > 0

                                ?

                                formatKg(
                                    wholeRice
                                )

                                :

                                "Completed",


                        status:

                            stringValue(

                                record.productionStatus,

                                record.status,

                                "Completed"

                            ),


                        date:
                            date,


                        time:
                            time,


                        timestamp:

                            getDateTimeValue(
                                date,
                                time
                            ),


                        order:
                            index

                    };

                }
            );

    }


    /* =========================================
       28. SALES ACTIVITY
    ========================================== */

    function buildSalesActivities() {

        return getSalesRecords()
            .map(
                function (
                    record,
                    index
                ) {

                    const date =
                        getRecordDate(
                            record,
                            [
                                "saleDate",
                                "invoiceDate",
                                "date",
                                "createdAt"
                            ]
                        );


                    const time =
                        getRecordTime(
                            record
                        );


                    const invoiceId =
                        stringValue(

                            record.invoiceId,

                            record.invoiceNumber,

                            record.saleId,

                            record.id,

                            `INV-${index + 1}`

                        );


                    const customer =
                        stringValue(

                            record.customerName,

                            record.customer,

                            "Customer"

                        );


                    const quantity =
                        getSalesQuantity(
                            record
                        );


                    return {

                        activity:

                            `Generated invoice ${invoiceId} for ${customer}`,


                        module:
                            "Sales",


                        amount:

                            quantity > 0

                                ?

                                formatKg(
                                    quantity
                                )

                                :

                                formatMoney(
                                    getSalesAmount(
                                        record
                                    )
                                ),


                        status:

                            stringValue(

                                record.paymentStatus,

                                record.status,

                                "Active"

                            ),


                        date:
                            date,


                        time:
                            time,


                        timestamp:

                            getDateTimeValue(
                                date,
                                time
                            ),


                        order:
                            index

                    };

                }
            );

    }


    /* =========================================
       29. DELIVERY ACTIVITY
    ========================================== */

    function buildDeliveryActivities() {

        return getDeliveryRecords()
            .map(
                function (
                    record,
                    index
                ) {

                    const date =
                        getRecordDate(
                            record,
                            [
                                "deliveryDate",
                                "date",
                                "createdAt"
                            ]
                        );


                    const time =
                        getRecordTime(
                            record
                        );


                    const deliveryId =
                        stringValue(

                            record.deliveryId,

                            record.deliveryID,

                            record.id,

                            `DLV-${index + 1}`

                        );


                    const customer =
                        stringValue(

                            record.customerName,

                            record.customer,

                            "Customer"

                        );


                    const quantity =
                        numberValue(

                            record.quantity,

                            record.quantityKg,

                            record.qty

                        );


                    return {

                        activity:

                            `Delivery ${deliveryId} for ${customer}`,


                        module:
                            "Delivery",


                        amount:

                            quantity > 0

                                ?

                                formatKg(
                                    quantity
                                )

                                :

                                "Delivery",


                        status:

                            stringValue(

                                record.deliveryStatus,

                                record.status,

                                "Pending"

                            ),


                        date:
                            date,


                        time:
                            time,


                        timestamp:

                            getDateTimeValue(
                                date,
                                time
                            ),


                        order:
                            index

                    };

                }
            );

    }


    /* =========================================
       30. MAINTENANCE ACTIVITY
    ========================================== */

    function buildMaintenanceActivities() {

        return getMaintenanceRecords()
            .map(
                function (
                    record,
                    index
                ) {

                    const date =
                        getRecordDate(
                            record,
                            [
                                "lastServiceDate",
                                "maintenanceDate",
                                "date",
                                "createdAt"
                            ]
                        );


                    const time =
                        getRecordTime(
                            record
                        );


                    const machine =
                        stringValue(

                            record.machineName,

                            record.machine,

                            "Machine"

                        );


                    const cost =
                        numberValue(

                            record.maintenanceCost,

                            record.cost,

                            record.amount

                        );


                    return {

                        activity:

                            `Maintenance record for ${machine}`,


                        module:
                            "Maintenance",


                        amount:

                            cost > 0

                                ?

                                formatMoney(
                                    cost
                                )

                                :

                                "Service",


                        status:

                            stringValue(

                                record.maintenanceStatus,

                                record.status,

                                "Recorded"

                            ),


                        date:
                            date,


                        time:
                            time,


                        timestamp:

                            getDateTimeValue(
                                date,
                                time
                            ),


                        order:
                            index

                    };

                }
            );

    }


    /* =========================================
       31. RECENT ACTIVITY
    ========================================== */

    function renderRecentActivity() {

        if (
            !activityTableBody
        ) {

            return;

        }


        const activities = [

            ...buildPurchaseActivities(),

            ...buildQualityActivities(),

            ...buildProductionActivities(),

            ...buildSalesActivities(),

            ...buildDeliveryActivities(),

            ...buildMaintenanceActivities()

        ];


        activities.sort(
            function (
                first,
                second
            ) {

                if (
                    second.timestamp !==
                    first.timestamp
                ) {

                    return (

                        second.timestamp -

                        first.timestamp

                    );

                }


                return (

                    second.order -

                    first.order

                );

            }
        );


        const recent =
            activities.slice(
                0,
                6
            );


        activityTableBody.innerHTML =
            "";


        if (
            recent.length ===
            0
        ) {

            activityTableBody.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        style="
                            text-align: center;
                            color: #7c8780;
                            padding: 28px 15px;
                        "
                    >

                        No operational transactions recorded yet.

                    </td>

                </tr>

            `;


            return;

        }


        recent.forEach(
            function (
                activity
            ) {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>

                        ${escapeHTML(
                            activity.activity
                        )}

                    </td>


                    <td>

                        ${escapeHTML(
                            activity.module
                        )}

                    </td>


                    <td>

                        ${escapeHTML(
                            activity.amount
                        )}

                    </td>


                    <td>

                        <span
                            class="
                                status-badge
                                ${getStatusClass(
                                    activity.status
                                )}
                            "
                        >

                            ${escapeHTML(
                                activity.status
                            )}

                        </span>

                    </td>


                    <td>

                        ${escapeHTML(

                            formatActivityTime(

                                activity.date,

                                activity.time

                            )

                        )}

                    </td>

                `;


                activityTableBody.appendChild(
                    row
                );

            }
        );

    }


    /* =========================================
       32. NOTIFICATION BADGE
    ========================================== */

    function renderNotificationBadge() {

        const badges =
            document.querySelectorAll(
                ".notification-count"
            );


        let count =
            Number(
                localStorage.getItem(
                    "activeNotificationCount"
                )
            );


        if (
            !Number.isFinite(
                count
            ) ||
            count < 0
        ) {

            count = 0;

        }


        if (
            count === 0
        ) {

            const history =
                safeParseStorage(
                    "notificationAlertHistory",
                    []
                );


            if (
                Array.isArray(
                    history
                )
            ) {

                count =
                    history.filter(
                        function (
                            alert
                        ) {

                            return (
                                normalizeText(
                                    alert.status
                                )
                                ===
                                "active"
                            );

                        }
                    )
                        .length;

            }

        }


        badges.forEach(
            function (
                badge
            ) {

                badge.textContent =

                    count > 99

                        ?

                        "99+"

                        :

                        String(
                            count
                        );


                badge.style.display =

                    count > 0

                        ?

                        "flex"

                        :

                        "none";

            }
        );

    }


    /* =========================================
       33. PROFILE / MILL NAME
    ========================================== */

    function renderSharedProfileData() {

        const profileKeys = [

            "adminProfile",

            "profileData",

            "userProfile"

        ];


        for (
            const key
            of profileKeys
        ) {

            const profile =
                safeParseStorage(
                    key,
                    null
                );


            if (
                !profile ||
                typeof profile !== "object" ||
                Array.isArray(profile)
            ) {

                continue;

            }


            const name =
                stringValue(

                    profile.fullName,

                    profile.name,

                    profile.userName

                );


            const topbarName =
                document.querySelector(
                    ".user-information strong"
                );


            if (
                topbarName &&
                name
            ) {

                topbarName.textContent =
                    name;

            }


            break;

        }


        const settingsKeys = [

            "riceMillSettings",

            "systemSettings",

            "millSettings"

        ];


        for (
            const key
            of settingsKeys
        ) {

            const settings =
                safeParseStorage(
                    key,
                    null
                );


            if (
                !settings ||
                typeof settings !== "object" ||
                Array.isArray(settings)
            ) {

                continue;

            }


            const millName =
                stringValue(

                    settings.millName,

                    settings.riceMillName,

                    settings.businessName

                );


            const sidebarName =
                document.querySelector(
                    ".sidebar-brand h2"
                );


            if (
                sidebarName &&
                millName
            ) {

                sidebarName.textContent =
                    millName;

            }


            break;

        }

    }


    /* =========================================
       34. LAST UPDATED
    ========================================== */

    function updateLastUpdatedTime() {

        if (
            !lastUpdatedText
        ) {

            return;

        }


        const now =
            new Date();


        const date =
            now.toLocaleDateString(
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


        const time =
            now.toLocaleTimeString(
                "en-US",
                {
                    hour:
                        "2-digit",

                    minute:
                        "2-digit",

                    hour12:
                        true
                }
            );


        lastUpdatedText.textContent =

            `Last updated: ${date}, ${time}`;

    }


    /* =========================================
       35. COMPLETE DASHBOARD REFRESH
    ========================================== */

    function refreshDashboard() {

        renderSharedProfileData();

        renderSummaryCards();

        renderSalesChart();

        renderInventoryChart();

        renderRecentActivity();

        renderNotificationBadge();

        updateLastUpdatedTime();

    }


    /* =========================================
       36. MOBILE SIDEBAR
    ========================================== */

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
        menuButton &&
        sidebar
    ) {

        menuButton.addEventListener(
            "click",
            function () {

                if (
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
                event.key ===
                "Escape"
            ) {

                closeSidebar();

            }

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

        }
    );


    /* =========================================
       37. SUMMARY CARD KEYBOARD SUPPORT
    ========================================== */

    summaryCards.forEach(
        function (
            card
        ) {

            card.addEventListener(
                "keydown",
                function (
                    event
                ) {

                    if (
                        event.key ===
                        "Enter"

                        ||

                        event.key ===
                        " "
                    ) {

                        event.preventDefault();

                        card.click();

                    }

                }
            );

        }
    );


    /* =========================================
       38. REFRESH WHEN RETURNING TO DASHBOARD
    ========================================== */

    window.addEventListener(
        "focus",
        refreshDashboard
    );


    window.addEventListener(
        "pageshow",
        refreshDashboard
    );


    window.addEventListener(
        "storage",
        refreshDashboard
    );


    /* =========================================
       39. INITIALIZE
    ========================================== */

    refreshDashboard();

});