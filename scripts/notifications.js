document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       SMART RICE MILL ERP
       INTEGRATED NOTIFICATION ENGINE

       Sources:
       - Inventory transactions
       - Purchase supplier dues
       - Sales customer dues
       - Salary dues
       - Delivery status
       - Maintenance schedules
       - Quality inspections
    ========================================== */


    /* =========================================
       1. ELEMENTS
    ========================================== */

    const lowStockCount =
        document.getElementById("lowStockCount");

    const duePaymentCount =
        document.getElementById("duePaymentCount");

    const pendingDeliveryCount =
        document.getElementById("pendingDeliveryCount");

    const attentionCount =
        document.getElementById("attentionCount");

    const notificationBadge =
        document.getElementById("notificationBadge");

    const priorityAlertList =
        document.getElementById("priorityAlertList");

    const alertTableBody =
        document.getElementById("alertTableBody");

    const alertSearch =
        document.getElementById("alertSearch");

    const alertTypeFilter =
        document.getElementById("alertTypeFilter");

    const alertStatusFilter =
        document.getElementById("alertStatusFilter");

    const refreshAlertsBtn =
        document.getElementById("refreshAlertsBtn");

    const topbarUserName =
        document.getElementById("topbarUserName");

    const sidebarMillName =
        document.getElementById("sidebarMillName");

    const menuButton =
        document.getElementById("menuButton");

    const sidebar =
        document.getElementById("sidebar");

    const sidebarBackdrop =
        document.getElementById("sidebarBackdrop");


    let activeAlerts = [];
    let alertHistory = [];


    /* =========================================
       2. INVENTORY CONSTANTS
    ========================================== */

    const PRODUCTS = {

        paddy: {
            label: "Accepted Paddy"
        },

        wholeRice: {
            label: "Whole Rice"
        },

        khud: {
            label: "Khud / Broken Rice"
        },

        tush: {
            label: "Tush / Husk"
        },

        bran: {
            label: "Rice Bran"
        }

    };


    const PRODUCT_KEYS = [
        "paddy",
        "wholeRice",
        "khud",
        "tush",
        "bran"
    ];


    const DEFAULT_SAFETY_STOCK = {

        paddy: 500,

        wholeRice: 300,

        khud: 50,

        tush: 100,

        bran: 50

    };


    /* =========================================
       3. STORAGE HELPERS
    ========================================== */

    function safeParseStorage(
        key,
        fallback = null
    ) {

        try {

            const value =
                localStorage.getItem(key);


            if (value === null) {
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


    function firstNonEmptyArray(keys) {

        let emptyArray = [];


        for (const key of keys) {

            const value =
                safeParseStorage(
                    key,
                    null
                );


            let array = null;


            if (Array.isArray(value)) {

                array =
                    value;

            }
            else if (
                value &&
                typeof value === "object"
            ) {

                if (
                    Array.isArray(
                        value.records
                    )
                ) {

                    array =
                        value.records;

                }
                else if (
                    Array.isArray(
                        value.items
                    )
                ) {

                    array =
                        value.items;

                }
                else if (
                    Array.isArray(
                        value.data
                    )
                ) {

                    array =
                        value.data;

                }

            }


            if (!array) {
                continue;
            }


            if (array.length > 0) {

                return array;

            }


            emptyArray =
                array;

        }


        return emptyArray;

    }


    function mergeArrays(keys) {

        const merged = [];

        const seen =
            new Set();


        keys.forEach(
            function (key) {

                const data =
                    safeParseStorage(
                        key,
                        null
                    );


                if (
                    !Array.isArray(data)
                ) {
                    return;
                }


                data.forEach(
                    function (record) {

                        if (
                            !record ||
                            typeof record !== "object"
                        ) {
                            return;
                        }


                        const identity =
                            String(

                                record.maintenanceId ??
                                record.deliveryId ??
                                record.machineId ??
                                record.id ??
                                ""

                            )
                            +
                            "|"
                            +
                            String(
                                record.machineName ??
                                record.name ??
                                ""
                            )
                            +
                            "|"
                            +
                            String(
                                record.nextServiceDate ??
                                record.date ??
                                ""
                            );


                        const keyValue =
                            identity !== "||"

                                ?

                                identity

                                :

                                JSON.stringify(
                                    record
                                );


                        if (
                            seen.has(
                                keyValue
                            )
                        ) {

                            return;

                        }


                        seen.add(
                            keyValue
                        );


                        merged.push(
                            record
                        );

                    }
                );

            }
        );


        return merged;

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


    function stringValue(...values) {

        for (const value of values) {

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


    function numberValue(...values) {

        for (const value of values) {

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


    function formatMoney(value) {

        return (
            "৳"
            +
            numberValue(value)
                .toLocaleString(
                    "en-IN",
                    {
                        maximumFractionDigits: 2
                    }
                )
        );

    }


    function formatQuantity(value) {

        return (
            numberValue(value)
                .toLocaleString(
                    "en-US",
                    {
                        maximumFractionDigits: 2
                    }
                )
            +
            " kg"
        );

    }


    /* =========================================
       5. DATE HELPERS
    ========================================== */

    function pad2(value) {

        return String(value)
            .padStart(
                2,
                "0"
            );

    }


    function todayISO() {

        const date =
            new Date();


        return (
            date.getFullYear()
            +
            "-"
            +
            pad2(
                date.getMonth() + 1
            )
            +
            "-"
            +
            pad2(
                date.getDate()
            )
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

                Number(match[1]),

                Number(match[2]) - 1,

                Number(match[3])

            );

        }


        match =
            raw.match(
                /^(\d{1,2})\/(\d{1,2})\/(\d{4})/
            );


        if (match) {

            return new Date(

                Number(match[3]),

                Number(match[1]) - 1,

                Number(match[2])

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


    function toISODate(date) {

        if (!date) {
            return todayISO();
        }


        return (
            date.getFullYear()
            +
            "-"
            +
            pad2(
                date.getMonth() + 1
            )
            +
            "-"
            +
            pad2(
                date.getDate()
            )
        );

    }


    function formatDate(value) {

        const date =
            parseDate(value);


        if (!date) {
            return "—";
        }


        return date
            .toLocaleDateString(
                "en-GB",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );

    }


    function daysFromToday(date) {

        if (!date) {
            return null;
        }


        const today =
            parseDate(
                todayISO()
            );


        return Math.ceil(

            (
                date.getTime()
                -
                today.getTime()
            )

            /

            86400000

        );

    }


    /* =========================================
       6. MODULE DATA
    ========================================== */

    function getPurchases() {

        return firstNonEmptyArray(
            [
                "purchases",
                "purchaseRecords",
                "paddyPurchases"
            ]
        );

    }


    function getQualityInspections() {

        return firstNonEmptyArray(
            [
                "qualityInspections",
                "qualityInspectionRecords",
                "qualityRecords"
            ]
        );

    }


    function getProductionRecords() {

        return firstNonEmptyArray(
            [
                "productionRecords",
                "productions"
            ]
        );

    }


    function getSalesRecords() {

        return firstNonEmptyArray(
            [
                "salesRecords",
                "sales",
                "salesInvoices",
                "invoiceRecords"
            ]
        );

    }


    function getDeliveryRecords() {

        /*
           Important:
           Skip empty alias arrays.

           This fixes:
           Delivery page = 1
           Notifications = 0
        */

        return firstNonEmptyArray(
            [
                "deliveryRecords",
                "deliveries",
                "deliveryHistory"
            ]
        );

    }


    function getSalaryRecords() {

        return firstNonEmptyArray(
            [
                "salaryRecords",
                "payrollRecords",
                "salaryHistory"
            ]
        );

    }


    function getMaintenanceRecords() {

        /*
           Maintenance data may exist in more
           than one storage collection.

           Merge them and later keep only the
           latest schedule per machine.
        */

        return mergeArrays(
            [
                "maintenanceRecords",
                "machineMaintenanceRecords",
                "maintenanceHistory",
                "machineMaintenance",
                "machines",
                "machineRecords"
            ]
        );

    }


    /* =========================================
       7. INVENTORY SAFETY STOCK
    ========================================== */

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
       8. INVENTORY ADJUSTMENTS
    ========================================== */

    function getInventoryAdjustments() {

        const data =
            safeParseStorage(
                "inventoryAdjustments",
                []
            );


        if (
            !Array.isArray(data)
        ) {

            return [];

        }


        return data.map(
            function (
                adjustment,
                index
            ) {

                return {

                    id:

                        adjustment.id ??
                        Date.now() +
                        index,


                    adjustmentId:

                        adjustment.adjustmentId ||
                        `ADJ-${String(
                            index + 1
                        ).padStart(
                            3,
                            "0"
                        )}`,


                    product:

                        adjustment.product ||
                        "wholeRice",


                    type:

                        adjustment.type === "out"

                            ?

                            "out"

                            :

                            "in",


                    quantity:

                        Number(
                            adjustment.quantity ||
                            0
                        ),


                    date:

                        adjustment.date ||
                        todayISO(),


                    reason:

                        adjustment.reason ||
                        "Inventory adjustment",


                    reversalOf:

                        adjustment.reversalOf ||
                        null,


                    createdAt:

                        adjustment.createdAt ||
                        adjustment.id ||
                        index

                };

            }
        );

    }


    /* =========================================
       9. PRODUCT NORMALIZATION
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
                .includes(normalized)
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
                .includes(normalized)
        ) {

            return "wholeRice";

        }


        if (
            [
                "khud",
                "brokenrice",
                "khudbrokenrice"
            ]
                .includes(normalized)
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
                .includes(normalized)
        ) {

            return "tush";

        }


        if (
            [
                "bran",
                "ricebran"
            ]
                .includes(normalized)
        ) {

            return "bran";

        }


        return null;

    }


    /* =========================================
       10. ACCEPTED PADDY MOVEMENTS
    ========================================== */

    function getAcceptedPaddyMovements() {

        const purchases =
            getPurchases();


        const inspections =
            getQualityInspections();


        const acceptedPurchaseIds =
            new Set(

                inspections

                    .filter(
                        function (inspection) {

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
                        function (inspection) {

                            return String(
                                inspection.purchaseId
                            );

                        }
                    )

            );


        return purchases

            .filter(
                function (purchase) {

                    return acceptedPurchaseIds
                        .has(
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

                        product:
                            "paddy",

                        direction:
                            "in",

                        quantity:

                            numberValue(

                                purchase.weight,

                                purchase.paddyWeight,

                                purchase.quantity

                            ),

                        date:

                            purchase.purchaseDate ||
                            purchase.date ||
                            "",

                        createdAt:

                            numberValue(

                                purchase.createdAt,

                                purchase.id,

                                index

                            )

                    };

                }
            )

            .filter(
                movement =>
                    movement.quantity > 0
            );

    }


    /* =========================================
       11. PRODUCTION MOVEMENTS
    ========================================== */

    function getProductionMovements() {

        const movements = [];


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


                    const createdAt =

                        numberValue(

                            record.createdAt,

                            record.id,

                            index

                        );


                    const inputPaddy =
                        numberValue(

                            record.inputPaddy,

                            record.paddyInput,

                            record.inputPaddyQuantity

                        );


                    if (
                        inputPaddy > 0
                    ) {

                        movements.push({

                            product:
                                "paddy",

                            direction:
                                "out",

                            quantity:
                                inputPaddy,

                            date:
                                date,

                            createdAt:
                                createdAt + 0.01

                        });

                    }


                    const outputs = [

                        {
                            product:
                                "wholeRice",

                            quantity:

                                numberValue(

                                    record.riceProduced,

                                    record.wholeRiceProduced,

                                    record.rice

                                )
                        },

                        {
                            product:
                                "khud",

                            quantity:

                                numberValue(

                                    record.khudProduced,

                                    record.khud,

                                    record.brokenRice

                                )
                        },

                        {
                            product:
                                "tush",

                            quantity:

                                numberValue(

                                    record.tushProduced,

                                    record.tush,

                                    record.husk

                                )
                        },

                        {
                            product:
                                "bran",

                            quantity:

                                numberValue(

                                    record.branProduced,

                                    record.riceBranProduced,

                                    record.bran

                                )
                        }

                    ];


                    outputs.forEach(
                        function (
                            output,
                            outputIndex
                        ) {

                            if (
                                output.quantity <= 0
                            ) {

                                return;

                            }


                            movements.push({

                                product:
                                    output.product,

                                direction:
                                    "in",

                                quantity:
                                    output.quantity,

                                date:
                                    date,

                                createdAt:

                                    createdAt
                                    +
                                    0.02
                                    +
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
       12. SALES MOVEMENTS
    ========================================== */

    function getSalesMovements() {

        const movements = [];


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
                        numberValue(

                            sale.quantityKg,

                            sale.weightKg

                        );


                    if (
                        quantityKg <= 0
                    ) {

                        const unit =
                            normalizeText(
                                sale.unit
                            );


                        if (
                            unit === "kg" ||
                            unit === "kilogram" ||
                            unit === "kilograms"
                        ) {

                            quantityKg =
                                numberValue(

                                    sale.quantity,

                                    sale.weight

                                );

                        }

                    }


                    if (
                        quantityKg <= 0 &&
                        numberValue(
                            sale.bagWeightKg
                        ) > 0 &&
                        numberValue(
                            sale.quantity,
                            sale.bags
                        ) > 0
                    ) {

                        quantityKg =

                            numberValue(
                                sale.bagWeightKg
                            )

                            *

                            numberValue(
                                sale.quantity,
                                sale.bags
                            );

                    }


                    if (
                        quantityKg <= 0
                    ) {

                        return;

                    }


                    movements.push({

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

                        createdAt:

                            numberValue(

                                sale.createdAt,

                                sale.id,

                                index

                            )

                    });

                }
            );


        return movements;

    }


    /* =========================================
       13. ADJUSTMENT MOVEMENTS
    ========================================== */

    function getAdjustmentMovements() {

        return getInventoryAdjustments()
            .map(
                function (adjustment) {

                    return {

                        product:
                            adjustment.product,

                        direction:
                            adjustment.type,

                        quantity:
                            adjustment.quantity,

                        date:
                            adjustment.date,

                        createdAt:
                            adjustment.createdAt

                    };

                }
            );

    }


    /* =========================================
       14. CURRENT INVENTORY STATE
    ========================================== */

    function buildInventoryState() {

        const safetyStock =
            loadSafetyStock();


        const movements = [

            ...getAcceptedPaddyMovements(),

            ...getProductionMovements(),

            ...getSalesMovements(),

            ...getAdjustmentMovements()

        ]
            .filter(
                function (movement) {

                    return (

                        PRODUCT_KEYS.includes(
                            movement.product
                        )

                        &&

                        numberValue(
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
                            first.date || ""
                        )
                            .localeCompare(
                                String(
                                    second.date || ""
                                )
                            );


                    if (
                        dateCompare !== 0
                    ) {

                        return dateCompare;

                    }


                    return (

                        numberValue(
                            first.createdAt
                        )

                        -

                        numberValue(
                            second.createdAt
                        )

                    );

                }
            );


        const state = {};


        PRODUCT_KEYS.forEach(
            function (key) {

                state[key] = {

                    quantity:
                        0,

                    safetyStock:

                        numberValue(
                            safetyStock[key]
                        ),

                    lastMovement:
                        ""

                };

            }
        );


        movements.forEach(
            function (movement) {

                const signedQuantity =

                    movement.direction === "in"

                        ?

                        movement.quantity

                        :

                        -movement.quantity;


                state[
                    movement.product
                ].quantity +=
                    signedQuantity;


                state[
                    movement.product
                ].lastMovement =
                    movement.date;

            }
        );


        return state;

    }


    /* =========================================
       15. CREATE ALERT
    ========================================== */

    function makeAlert({
        key,
        type,
        title,
        message,
        source,
        reference,
        priority,
        date,
        targetPage
    }) {

        return {

            key:
                key,

            type:
                type,

            title:
                title,

            message:
                message,

            source:
                source,

            reference:
                reference || "—",

            priority:
                priority,

            status:
                "Active",

            date:
                date || todayISO(),

            targetPage:
                targetPage

        };

    }


    /* =========================================
       16. LOW STOCK ALERTS
    ========================================== */

    function buildLowStockAlerts() {

        const inventory =
            buildInventoryState();


        const alerts = [];


        PRODUCT_KEYS.forEach(
            function (key) {

                const item =
                    inventory[key];


                const quantity =
                    numberValue(
                        item.quantity
                    );


                const safety =
                    numberValue(
                        item.safetyStock
                    );


                if (
                    safety <= 0
                ) {

                    return;

                }


                if (
                    quantity <= safety
                ) {

                    alerts.push(

                        makeAlert({

                            key:
                                `stock:${key}`,

                            type:
                                "Low Stock",

                            title:

                                quantity <= 0

                                    ?

                                    "Out of Stock"

                                    :

                                    "Low Stock",

                            message:

                                `${PRODUCTS[key].label} stock is ${formatQuantity(
                                    quantity
                                )}; configured safety stock is ${formatQuantity(
                                    safety
                                )}.`,

                            source:
                                "Inventory",

                            reference:
                                PRODUCTS[key]
                                    .label,

                            priority:
                                "High",

                            date:

                                item.lastMovement ||
                                todayISO(),

                            targetPage:
                                "inventory.html"

                        })

                    );

                }

            }
        );


        return alerts;

    }


    /* =========================================
       17. PURCHASE DUE
    ========================================== */

    function calculatePurchaseDue(record) {

        const explicit =
            numberValue(

                record.remainingDue,

                record.dueAmount,

                record.due,

                record.balanceDue

            );


        if (
            explicit > 0
        ) {

            return explicit;

        }


        const total =

            numberValue(

                record.totalPurchaseAmount,

                record.totalAmount,

                record.purchaseAmount,

                record.amount,

                record.total

            )

            ||

            (
                numberValue(

                    record.weight,

                    record.paddyWeight,

                    record.quantity

                )

                *

                numberValue(

                    record.pricePerKg,

                    record.price

                )
            );


        const paid =
            numberValue(

                record.paidAmount,

                record.amountPaid

            );


        const status =
            normalizeText(
                record.paymentStatus
            );


        if (
            status.includes("due") ||
            status.includes("partial")
        ) {

            return (
                Math.max(
                    0,
                    total - paid
                )
                ||
                total
            );

        }


        return Math.max(
            0,
            total - paid
        );

    }


    function buildSupplierDueAlerts() {

        const alerts = [];


        getPurchases()
            .forEach(
                function (
                    record,
                    index
                ) {

                    const due =
                        calculatePurchaseDue(
                            record
                        );


                    if (
                        due <= 0
                    ) {

                        return;

                    }


                    const purchaseId =
                        stringValue(

                            record.purchaseId,

                            record.purchaseID,

                            record.id,

                            `P-${index + 1}`

                        );


                    const supplier =
                        stringValue(

                            record.supplierName,

                            record.supplier,

                            record.farmerName,

                            "Supplier"

                        );


                    alerts.push(

                        makeAlert({

                            key:

                                `supplier-due:${purchaseId}`,

                            type:
                                "Supplier Due",

                            title:
                                "Supplier Payment Due",

                            message:

                                `${supplier} has ${formatMoney(
                                    due
                                )} outstanding from paddy procurement.`,

                            source:
                                "Purchase",

                            reference:
                                purchaseId,

                            priority:
                                "Medium",

                            date:

                                record.purchaseDate ||
                                record.date ||
                                todayISO(),

                            targetPage:
                                "purchase.html"

                        })

                    );

                }
            );


        return alerts;

    }


    /* =========================================
       18. CUSTOMER DUE
    ========================================== */

    function calculateSalesDue(record) {

        const explicit =
            numberValue(

                record.remainingDue,

                record.dueAmount,

                record.due,

                record.balanceDue

            );


        if (
            explicit > 0
        ) {

            return explicit;

        }


        const total =
            numberValue(

                record.totalAmount,

                record.invoiceAmount,

                record.amount,

                record.total

            );


        const paid =
            numberValue(

                record.paidAmount,

                record.amountPaid

            );


        const status =
            normalizeText(
                record.paymentStatus
            );


        if (
            status.includes("due") ||
            status.includes("partial")
        ) {

            return (
                Math.max(
                    0,
                    total - paid
                )
                ||
                total
            );

        }


        return Math.max(
            0,
            total - paid
        );

    }


    function buildCustomerDueAlerts() {

        const alerts = [];


        getSalesRecords()
            .forEach(
                function (
                    record,
                    index
                ) {

                    const recordStatus =
                        normalizeText(
                            record.status
                        );


                    if (
                        recordStatus.includes(
                            "cancel"
                        )

                        ||

                        recordStatus.includes(
                            "void"
                        )
                    ) {

                        return;

                    }


                    const due =
                        calculateSalesDue(
                            record
                        );


                    if (
                        due <= 0
                    ) {

                        return;

                    }


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


                    alerts.push(

                        makeAlert({

                            key:

                                `customer-due:${invoiceId}`,

                            type:
                                "Customer Due",

                            title:
                                "Customer Receivable Due",

                            message:

                                `${customer} has ${formatMoney(
                                    due
                                )} outstanding on invoice ${invoiceId}.`,

                            source:
                                "Sales",

                            reference:
                                invoiceId,

                            priority:
                                "Medium",

                            date:

                                record.saleDate ||
                                record.invoiceDate ||
                                record.date ||
                                todayISO(),

                            targetPage:
                                "sales.html"

                        })

                    );

                }
            );


        return alerts;

    }


    /* =========================================
       19. SALARY DUE
    ========================================== */

    function calculateSalaryDue(record) {

        const explicit =
            numberValue(

                record.due,

                record.dueAmount,

                record.remainingDue

            );


        if (
            explicit > 0
        ) {

            return explicit;

        }


        const salary =
            numberValue(

                record.salaryAmount,

                record.salary,

                record.amount

            );


        const paid =
            numberValue(

                record.paidAmount,

                record.amountPaid

            );


        const status =
            normalizeText(

                record.paymentStatus ||
                record.status

            );


        if (
            status.includes("due") ||
            status.includes("partial")
        ) {

            return (
                Math.max(
                    0,
                    salary - paid
                )
                ||
                salary
            );

        }


        return Math.max(
            0,
            salary - paid
        );

    }


    function buildSalaryDueAlerts() {

        const alerts = [];


        getSalaryRecords()
            .forEach(
                function (
                    record,
                    index
                ) {

                    const due =
                        calculateSalaryDue(
                            record
                        );


                    if (
                        due <= 0
                    ) {

                        return;

                    }


                    const employee =
                        stringValue(

                            record.employeeName,

                            record.employee,

                            record.name,

                            "Employee"

                        );


                    const salaryId =
                        stringValue(

                            record.salaryId,

                            record.id,

                            `SAL-${index + 1}`

                        );


                    const month =
                        stringValue(

                            record.salaryMonth,

                            record.month

                        );


                    alerts.push(

                        makeAlert({

                            key:

                                `salary-due:${salaryId}`,

                            type:
                                "Salary Due",

                            title:
                                "Salary Payment Due",

                            message:

                                `${employee}${
                                    month
                                        ?
                                        ` (${month})`
                                        :
                                        ""
                                } has ${formatMoney(
                                    due
                                )} salary due.`,

                            source:
                                "Expense & Salary",

                            reference:
                                salaryId,

                            priority:
                                "Medium",

                            date:

                                record.date ||
                                record.salaryDate ||
                                todayISO(),

                            targetPage:
                                "expense.html"

                        })

                    );

                }
            );


        return alerts;

    }


    /* =========================================
       20. DELIVERY ALERTS
    ========================================== */

    function isPendingDelivery(record) {

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
                "on-the-way"
            )

            ||

            status.includes(
                "in transit"
            )

            ||

            status.includes(
                "running"
            )

            ||

            status.includes(
                "assigned"
            )

        );

    }


    function buildDeliveryAlerts() {

        const alerts = [];


        getDeliveryRecords()
            .forEach(
                function (
                    record,
                    index
                ) {

                    if (
                        !isPendingDelivery(
                            record
                        )
                    ) {

                        return;

                    }


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


                    const status =
                        normalizeText(

                            record.deliveryStatus ||
                            record.status ||
                            "pending"

                        );


                    const onTheWay =

                        status.includes(
                            "way"
                        )

                        ||

                        status.includes(
                            "transit"
                        )

                        ||

                        status.includes(
                            "running"
                        );


                    const destination =
                        stringValue(

                            record.destination,

                            record.deliveryAddress,

                            record.upazila

                        );


                    alerts.push(

                        makeAlert({

                            key:

                                `delivery:${deliveryId}`,

                            type:
                                "Delivery",

                            title:

                                onTheWay

                                    ?

                                    "Delivery On the Way"

                                    :

                                    "Pending Delivery",

                            message:

                                `${customer}'s delivery ${deliveryId} is ${
                                    status || "pending"
                                }${
                                    destination
                                        ?
                                        ` for ${destination}`
                                        :
                                        ""
                                }.`,

                            source:
                                "Delivery",

                            reference:
                                deliveryId,

                            priority:
                                "Medium",

                            date:

                                record.deliveryDate ||
                                record.date ||
                                todayISO(),

                            targetPage:
                                "delivery.html"

                        })

                    );

                }
            );


        return alerts;

    }


    /* =========================================
       21. MAINTENANCE SCHEDULE
    ========================================== */

    function calculateNextServiceDate(record) {

        const storedNextDate =
            parseDate(

                record.nextServiceDate ||
                record.nextService ||
                record.nextMaintenanceDate

            );


        if (storedNextDate) {

            return storedNextDate;

        }


        const lastServiceDate =
            parseDate(

                record.lastServiceDate ||
                record.maintenanceDate ||
                record.serviceDate

            );


        const interval =
            numberValue(

                record.maintenanceInterval,

                record.intervalDays,

                record.serviceInterval

            );


        if (
            !lastServiceDate ||
            interval <= 0
        ) {

            return null;

        }


        const calculated =
            new Date(
                lastServiceDate
            );


        calculated.setDate(

            calculated.getDate()
            +
            interval

        );


        return calculated;

    }


    function maintenanceRecordTimestamp(
        record
    ) {

        const lastDate =
            parseDate(

                record.lastServiceDate ||
                record.maintenanceDate ||
                record.serviceDate ||
                record.date

            );


        if (lastDate) {

            return lastDate.getTime();

        }


        return numberValue(

            record.createdAt,

            record.id

        );

    }


    function getLatestMaintenanceByMachine() {

        const latest =
            new Map();


        getMaintenanceRecords()
            .forEach(
                function (
                    record,
                    index
                ) {

                    const machine =
                        stringValue(

                            record.machineName,

                            record.machine,

                            record.name,

                            record.machineId,

                            `Machine-${index + 1}`

                        );


                    const machineKey =
                        normalizeText(machine);


                    if (!machineKey) {
                        return;
                    }


                    const existing =
                        latest.get(
                            machineKey
                        );


                    if (
                        !existing ||
                        maintenanceRecordTimestamp(
                            record
                        )
                        >=
                        maintenanceRecordTimestamp(
                            existing
                        )
                    ) {

                        latest.set(
                            machineKey,
                            record
                        );

                    }

                }
            );


        return Array.from(
            latest.values()
        );

    }


    function buildMaintenanceAlerts() {

        const alerts = [];


        getLatestMaintenanceByMachine()
            .forEach(
                function (
                    record,
                    index
                ) {

                    const status =
                        normalizeText(

                            record.maintenanceStatus ||
                            record.status

                        );


                    /*
                       Cancelled schedule should not alert.

                       IMPORTANT:
                       "Completed" is NOT ignored.

                       A completed maintenance record can
                       still have a next service date that
                       is now overdue.
                    */

                    if (
                        status.includes(
                            "cancel"
                        )
                    ) {

                        return;

                    }


                    const nextService =
                        calculateNextServiceDate(
                            record
                        );


                    if (!nextService) {
                        return;
                    }


                    const days =
                        daysFromToday(
                            nextService
                        );


                    /*
                       Show:
                       - overdue
                       - today
                       - within next 7 days
                    */

                    if (
                        days === null ||
                        days > 7
                    ) {

                        return;

                    }


                    const machine =
                        stringValue(

                            record.machineName,

                            record.machine,

                            record.name,

                            "Machine"

                        );


                    const reference =
                        stringValue(

                            record.maintenanceId,

                            record.recordId,

                            record.machineId,

                            record.id,

                            `MNT-${index + 1}`

                        );


                    let title =
                        "Upcoming Maintenance";


                    let message =

                        `${machine} is due for service in ${days} day${
                            days === 1
                                ?
                                ""
                                :
                                "s"
                        }.`;


                    let priority =
                        "Medium";


                    if (
                        days < 0
                    ) {

                        title =
                            "Maintenance Overdue";


                        message =

                            `${machine} service is overdue by ${Math.abs(
                                days
                            )} day${
                                Math.abs(days) === 1
                                    ?
                                    ""
                                    :
                                    "s"
                            }.`;


                        priority =
                            "High";

                    }
                    else if (
                        days === 0
                    ) {

                        title =
                            "Maintenance Due Today";


                        message =

                            `${machine} is scheduled for service today.`;


                        priority =
                            "High";

                    }


                    alerts.push(

                        makeAlert({

                            key:

                                `maintenance:${
                                    normalizeText(machine)
                                        .replace(
                                            /\s+/g,
                                            "-"
                                        )
                                }`,

                            type:
                                "Maintenance",

                            title:
                                title,

                            message:
                                message,

                            source:
                                "Maintenance",

                            reference:
                                reference,

                            priority:
                                priority,

                            date:
                                toISODate(
                                    nextService
                                ),

                            targetPage:
                                "maintenance.html"

                        })

                    );

                }
            );


        return alerts;

    }


    /* =========================================
       22. QUALITY ALERTS
    ========================================== */

    function buildQualityAlerts() {

        const alerts = [];


        getQualityInspections()
            .forEach(
                function (
                    record,
                    index
                ) {

                    const decision =
                        normalizeText(

                            record.decision ||
                            record.status

                        );


                    const rejected =
                        decision.includes(
                            "reject"
                        );


                    const review =
                        decision.includes(
                            "review"
                        );


                    if (
                        !rejected &&
                        !review
                    ) {

                        return;

                    }


                    const purchaseId =
                        stringValue(

                            record.purchaseId,

                            record.purchaseID,

                            record.id,

                            `QIN-${index + 1}`

                        );


                    const supplier =
                        stringValue(

                            record.supplierName,

                            record.supplier

                        );


                    alerts.push(

                        makeAlert({

                            key:

                                `quality:${purchaseId}`,

                            type:
                                "Quality",

                            title:

                                rejected

                                    ?

                                    "Rejected Paddy Batch"

                                    :

                                    "Quality Review Required",

                            message:

                                `${purchaseId}${
                                    supplier
                                        ?
                                        ` from ${supplier}`
                                        :
                                        ""
                                } is ${
                                    rejected
                                        ?
                                        "rejected"
                                        :
                                        "under review"
                                } and requires attention.`,

                            source:
                                "Quality Inspection",

                            reference:
                                purchaseId,

                            priority:

                                rejected

                                    ?

                                    "High"

                                    :

                                    "Medium",

                            date:

                                record.inspectionDate ||
                                record.date ||
                                todayISO(),

                            targetPage:
                                "quality.html"

                        })

                    );

                }
            );


        return alerts;

    }


    /* =========================================
       23. GENERATE ACTIVE ALERTS
    ========================================== */

    function generateActiveAlerts() {

        return [

            ...buildLowStockAlerts(),

            ...buildSupplierDueAlerts(),

            ...buildCustomerDueAlerts(),

            ...buildSalaryDueAlerts(),

            ...buildDeliveryAlerts(),

            ...buildMaintenanceAlerts(),

            ...buildQualityAlerts()

        ];

    }


    /* =========================================
       24. HISTORY
    ========================================== */

    function loadAlertHistory() {

        const history =
            safeParseStorage(
                "notificationAlertHistory",
                []
            );


        return Array.isArray(history)
            ?
            history
            :
            [];

    }


    function generateNextAlertId(
        history
    ) {

        const numbers =
            history

                .map(
                    function (record) {

                        const match =
                            String(
                                record.alertId ||
                                ""
                            )
                                .match(
                                    /^ALT-(\d+)$/i
                                );


                        return match
                            ?
                            Number(match[1])
                            :
                            0;

                    }
                )

                .filter(Boolean);


        const next =
            numbers.length > 0

                ?

                Math.max(
                    ...numbers
                ) + 1

                :

                1;


        return (
            "ALT-"
            +
            String(next)
                .padStart(
                    4,
                    "0"
                )
        );

    }


    function syncHistory() {

        const now =
            new Date()
                .toISOString();


        let history =
            loadAlertHistory();


        /*
           Resolve conditions that disappeared.
        */

        history =
            history.map(
                function (record) {

                    const stillActive =
                        activeAlerts.some(
                            alert =>
                                alert.key ===
                                record.key
                        );


                    if (
                        record.status === "Active" &&
                        !stillActive
                    ) {

                        return {

                            ...record,

                            status:
                                "Resolved",

                            resolvedAt:
                                now

                        };

                    }


                    return record;

                }
            );


        /*
           Insert/update active alerts.
        */

        activeAlerts.forEach(
            function (alert) {

                const index =
                    history.findIndex(
                        record =>
                            record.key ===
                            alert.key
                    );


                if (
                    index >= 0
                ) {

                    history[index] = {

                        ...history[index],

                        ...alert,

                        alertId:
                            history[index]
                                .alertId,

                        createdAt:
                            history[index]
                                .createdAt ||
                            now,

                        lastDetectedAt:
                            now,

                        resolvedAt:
                            null,

                        status:
                            "Active"

                    };

                }
                else {

                    history.push({

                        ...alert,

                        alertId:
                            generateNextAlertId(
                                history
                            ),

                        createdAt:
                            now,

                        lastDetectedAt:
                            now,

                        resolvedAt:
                            null,

                        status:
                            "Active"

                    });

                }

            }
        );


        alertHistory =
            history;


        localStorage.setItem(

            "notificationAlertHistory",

            JSON.stringify(
                history
            )

        );

    }


    /* =========================================
       25. PRIORITY
    ========================================== */

    function priorityWeight(priority) {

        if (
            priority === "High"
        ) {

            return 3;

        }


        if (
            priority === "Medium"
        ) {

            return 2;

        }


        return 1;

    }


    function sortAlerts(records) {

        return [...records]
            .sort(
                function (
                    first,
                    second
                ) {

                    const priorityDifference =

                        priorityWeight(
                            second.priority
                        )

                        -

                        priorityWeight(
                            first.priority
                        );


                    if (
                        priorityDifference !== 0
                    ) {

                        return priorityDifference;

                    }


                    const firstDate =
                        parseDate(
                            first.date
                        );


                    const secondDate =
                        parseDate(
                            second.date
                        );


                    return (

                        (
                            secondDate
                                ?.getTime()
                            ||
                            0
                        )

                        -

                        (
                            firstDate
                                ?.getTime()
                            ||
                            0
                        )

                    );

                }
            );

    }


    /* =========================================
       26. KPI
    ========================================== */

    function updateKPIs() {

        const lowStock =
            activeAlerts.filter(
                alert =>
                    alert.type ===
                    "Low Stock"
            )
                .length;


        const duePayments =
            activeAlerts.filter(
                alert =>
                    [
                        "Supplier Due",
                        "Customer Due",
                        "Salary Due"
                    ]
                        .includes(
                            alert.type
                        )
            )
                .length;


        const pendingDeliveries =
            activeAlerts.filter(
                alert =>
                    alert.type ===
                    "Delivery"
            )
                .length;


        const highPriority =
            activeAlerts.filter(
                alert =>
                    alert.priority ===
                    "High"
            )
                .length;


        if (lowStockCount) {

            lowStockCount.textContent =
                String(lowStock);

        }


        if (duePaymentCount) {

            duePaymentCount.textContent =
                String(
                    duePayments
                );

        }


        if (pendingDeliveryCount) {

            pendingDeliveryCount.textContent =
                String(
                    pendingDeliveries
                );

        }


        if (attentionCount) {

            attentionCount.textContent =
                String(
                    highPriority
                );

        }


        const total =
            activeAlerts.length;


        localStorage.setItem(

            "activeNotificationCount",

            String(total)

        );


        if (
            notificationBadge
        ) {

            notificationBadge.textContent =

                total > 99

                    ?

                    "99+"

                    :

                    String(total);


            notificationBadge.style.display =

                total > 0

                    ?

                    "inline-flex"

                    :

                    "none";

        }

    }


    /* =========================================
       27. ALERT ICONS
    ========================================== */

    function getAlertIcon(type) {

        if (
            type === "Low Stock"
        ) {

            return {
                icon: "▣",
                className:
                    "alert-icon-danger"
            };

        }


        if (
            [
                "Supplier Due",
                "Customer Due",
                "Salary Due"
            ]
                .includes(type)
        ) {

            return {
                icon: "৳",
                className:
                    "alert-icon-warning"
            };

        }


        if (
            type === "Delivery"
        ) {

            return {
                icon: "🚚",
                className:
                    "alert-icon-info"
            };

        }


        if (
            type === "Maintenance"
        ) {

            return {
                icon: "🔧",
                className:
                    "alert-icon-warning"
            };

        }


        return {
            icon: "✓",
            className:
                "alert-icon-warning"
        };

    }


    /* =========================================
       28. PRIORITY FEED
    ========================================== */

    function renderPriorityFeed() {

        if (!priorityAlertList) {
            return;
        }


        priorityAlertList.innerHTML =
            "";


        const records =
            sortAlerts(
                activeAlerts
            )
                .slice(
                    0,
                    5
                );


        if (
            records.length === 0
        ) {

            priorityAlertList.innerHTML = `

                <div class="no-active-alerts">

                    <div class="no-active-alerts-icon">
                        ✓
                    </div>

                    <strong>
                        No active operational alerts
                    </strong>

                    <p>
                        Current ERP records do not require immediate attention.
                    </p>

                </div>

            `;


            return;

        }


        records.forEach(
            function (alert) {

                const icon =
                    getAlertIcon(
                        alert.type
                    );


                const article =
                    document.createElement(
                        "article"
                    );


                article.className =
                    "priority-alert-item";


                article.innerHTML = `

                    <div
                        class="
                            priority-alert-icon
                            ${icon.className}
                        "
                    >
                        ${icon.icon}
                    </div>


                    <div class="priority-alert-content">

                        <h3>
                            ${escapeHTML(
                                alert.title
                            )}
                        </h3>

                        <p>
                            ${escapeHTML(
                                alert.message
                            )}
                        </p>

                        <div class="priority-alert-meta">

                            <span>
                                ${escapeHTML(
                                    alert.source
                                )}
                            </span>

                            <span>
                                ${escapeHTML(
                                    alert.reference
                                )}
                            </span>

                            <span>
                                ${formatDate(
                                    alert.date
                                )}
                            </span>

                        </div>

                    </div>


                    <div class="priority-alert-actions">

                        <span
                            class="
                                alert-priority-badge
                                ${
                                    alert.priority === "High"

                                        ?

                                        "priority-high"

                                        :

                                        alert.priority === "Medium"

                                            ?

                                            "priority-medium"

                                            :

                                            "priority-low"
                                }
                            "
                        >
                            ${escapeHTML(
                                alert.priority
                            )}
                        </span>


                        <button
                            type="button"
                            class="alert-view-button"
                            data-target-page="${escapeHTML(
                                alert.targetPage
                            )}"
                        >
                            View
                        </button>

                    </div>

                `;


                priorityAlertList.appendChild(
                    article
                );

            }
        );

    }


    /* =========================================
       29. TYPE CLASS
    ========================================== */

    function getTypeClass(type) {

        if (
            type === "Low Stock"
        ) {

            return "type-stock";

        }


        if (
            [
                "Supplier Due",
                "Customer Due",
                "Salary Due"
            ]
                .includes(type)
        ) {

            return "type-payment";

        }


        if (
            type === "Delivery"
        ) {

            return "type-delivery";

        }


        if (
            type === "Maintenance"
        ) {

            return "type-maintenance";

        }


        return "type-quality";

    }


    /* =========================================
       30. ALERT TABLE
    ========================================== */

    function renderAlertTable() {

        if (!alertTableBody) {
            return;
        }


        const search =
            normalizeText(
                alertSearch
                    ?.value
            );


        const type =
            alertTypeFilter
                ?.value
            ||
            "all";


        const status =
            alertStatusFilter
                ?.value
            ||
            "all";


        const records =
            alertHistory

                .filter(
                    function (alert) {

                        if (
                            type !== "all" &&
                            alert.type !== type
                        ) {

                            return false;

                        }


                        if (
                            status !== "all" &&
                            alert.status !== status
                        ) {

                            return false;

                        }


                        if (!search) {

                            return true;

                        }


                        const searchable =
                            [

                                alert.alertId,

                                alert.type,

                                alert.title,

                                alert.message,

                                alert.source,

                                alert.reference,

                                alert.priority,

                                alert.status

                            ]
                                .join(" ")
                                .toLowerCase();


                        return searchable
                            .includes(
                                search
                            );

                    }
                )

                .sort(
                    function (
                        first,
                        second
                    ) {

                        if (
                            first.status !==
                            second.status
                        ) {

                            return (
                                first.status ===
                                "Active"

                                    ?

                                    -1

                                    :

                                    1
                            );

                        }


                        return (

                            priorityWeight(
                                second.priority
                            )

                            -

                            priorityWeight(
                                first.priority
                            )

                        );

                    }
                );


        alertTableBody.innerHTML =
            "";


        if (
            records.length === 0
        ) {

            alertTableBody.innerHTML = `

                <tr class="alert-empty-row">

                    <td colspan="9">
                        No alert records match the current filters.
                    </td>

                </tr>

            `;


            return;

        }


        records.forEach(
            function (alert) {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>

                        <span class="alert-id">
                            ${escapeHTML(
                                alert.alertId
                            )}
                        </span>

                    </td>


                    <td>

                        <span
                            class="
                                alert-type-badge
                                ${getTypeClass(
                                    alert.type
                                )}
                            "
                        >
                            ${escapeHTML(
                                alert.type
                            )}
                        </span>

                    </td>


                    <td>

                        <span class="alert-primary-text">
                            ${escapeHTML(
                                alert.title
                            )}
                        </span>

                        <span class="alert-secondary-text">
                            ${escapeHTML(
                                alert.message
                            )}
                        </span>

                    </td>


                    <td>
                        ${escapeHTML(
                            alert.source
                        )}
                    </td>


                    <td>

                        <span class="alert-reference">
                            ${escapeHTML(
                                alert.reference
                            )}
                        </span>

                    </td>


                    <td>

                        <span
                            class="
                                alert-priority-badge
                                ${
                                    alert.priority === "High"

                                        ?

                                        "priority-high"

                                        :

                                        alert.priority === "Medium"

                                            ?

                                            "priority-medium"

                                            :

                                            "priority-low"
                                }
                            "
                        >
                            ${escapeHTML(
                                alert.priority
                            )}
                        </span>

                    </td>


                    <td>

                        <span
                            class="
                                alert-status-badge
                                ${
                                    alert.status === "Active"

                                        ?

                                        "status-active"

                                        :

                                        "status-resolved"
                                }
                            "
                        >
                            ${escapeHTML(
                                alert.status
                            )}
                        </span>

                    </td>


                    <td>
                        ${formatDate(
                            alert.date
                        )}
                    </td>


                    <td>

                        <button
                            type="button"
                            class="table-view-button"
                            data-target-page="${escapeHTML(
                                alert.targetPage
                            )}"
                        >
                            View
                        </button>

                    </td>

                `;


                alertTableBody.appendChild(
                    row
                );

            }
        );

    }


    /* =========================================
       31. PROFILE / MILL NAME
    ========================================== */

    function renderHeaderInformation() {

        const profile =
            safeParseStorage(
                "adminProfile",
                {}
            );


        const settings =
            safeParseStorage(
                "riceMillSettings",
                {}
            );


        if (
            topbarUserName
        ) {

            topbarUserName.textContent =
                stringValue(

                    profile.fullName,

                    profile.name,

                    "Admin User"

                );

        }


        if (
            sidebarMillName
        ) {

            sidebarMillName.textContent =
                stringValue(

                    settings.millName,

                    settings.businessName,

                    "Smart Rice Mill"

                );

        }

    }


    /* =========================================
       32. TOAST
    ========================================== */

    function showToast(message) {

        const oldToast =
            document.querySelector(
                ".notification-toast"
            );


        if (oldToast) {

            oldToast.remove();

        }


        const toast =
            document.createElement(
                "div"
            );


        toast.className =
            "notification-toast";


        toast.innerHTML = `

            <span>✓</span>

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
                    220
                );

            },
            2500
        );

    }


    /* =========================================
       33. REFRESH ENGINE
    ========================================== */

    function refreshAlertEngine(
        showMessage = false
    ) {

        activeAlerts =
            generateActiveAlerts();


        syncHistory();

        updateKPIs();

        renderPriorityFeed();

        renderAlertTable();


        if (showMessage) {

            showToast(

                `${activeAlerts.length} active alert${
                    activeAlerts.length === 1
                        ?
                        ""
                        :
                        "s"
                } detected from current ERP records.`

            );

        }

    }


    /* =========================================
       34. VIEW SOURCE
    ========================================== */

    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    "[data-target-page]"
                );


            if (!button) {
                return;
            }


            const target =
                button.dataset.targetPage;


            if (target) {

                window.location.href =
                    target;

            }

        }
    );


    /* =========================================
       35. FILTER EVENTS
    ========================================== */

    if (alertSearch) {

        alertSearch.addEventListener(
            "input",
            renderAlertTable
        );

    }


    if (alertTypeFilter) {

        alertTypeFilter.addEventListener(
            "change",
            renderAlertTable
        );

    }


    if (alertStatusFilter) {

        alertStatusFilter.addEventListener(
            "change",
            renderAlertTable
        );

    }


    if (refreshAlertsBtn) {

        refreshAlertsBtn.addEventListener(
            "click",
            function () {

                refreshAlertEngine(
                    true
                );

            }
        );

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


        document.body.style.overflow =
            "";

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


    /* =========================================
       37. LIVE REFRESH
    ========================================== */

    window.addEventListener(
        "storage",
        function () {

            refreshAlertEngine();

        }
    );


    window.addEventListener(
        "focus",
        function () {

            refreshAlertEngine();

        }
    );


    window.addEventListener(
        "pageshow",
        function () {

            refreshAlertEngine();

        }
    );


    /* =========================================
       38. INITIALIZE
    ========================================== */

    renderHeaderInformation();

    refreshAlertEngine();

});