document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       SMART RICE MILL ERP
       INVENTORY MANAGEMENT

       DESIGN PRINCIPLES

       - Transaction-driven inventory
       - Batch/source traceability
       - Safety stock monitoring
       - Immutable stock history
       - Corrections through reversal
         instead of deleting transactions
    ========================================= */


    /* =========================================
       PRODUCTS
    ========================================= */

    const PRODUCTS = {

        paddy: {

            label:
                "Accepted Paddy",

            tableLabel:
                "Accepted Paddy (Usable)",

            note:
                "Quality-approved paddy available for production"

        },


        wholeRice: {

            label:
                "Whole Rice",

            tableLabel:
                "Whole Rice",

            note:
                "Finished whole rice from production"

        },


        khud: {

            label:
                "Khud / Broken Rice",

            tableLabel:
                "Khud / Broken Rice",

            note:
                "Broken-rice production output"

        },


        tush: {

            label:
                "Tush / Husk",

            tableLabel:
                "Tush / Husk",

            note:
                "Rice husk production output"

        },


        bran: {

            label:
                "Rice Bran",

            tableLabel:
                "Rice Bran",

            note:
                "Rice bran production output"

        }

    };


    const PRODUCT_KEYS =
        Object.keys(PRODUCTS);


    /* =========================================
       DEFAULT SAFETY STOCK

       Configurable mill settings.
       These quantities are NOT claimed as
       fixed research-derived values.
    ========================================= */

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
       ELEMENTS
    ========================================= */

    const adjustmentForm =
        document.getElementById(
            "adjustmentForm"
        );


    if (!adjustmentForm) {
        return;
    }


    const adjustmentProductSelect =
        document.getElementById(
            "adjustmentProduct"
        );


    const adjustmentTypeSelect =
        document.getElementById(
            "adjustmentType"
        );


    const adjustmentQuantityInput =
        document.getElementById(
            "adjustmentQuantity"
        );


    const adjustmentDateInput =
        document.getElementById(
            "adjustmentDate"
        );


    const adjustmentReasonInput =
        document.getElementById(
            "adjustmentReason"
        );


    const adjustmentStockHelp =
        document.getElementById(
            "adjustmentStockHelp"
        );


    const safetyStockForm =
        document.getElementById(
            "safetyStockForm"
        );


    const safetyProductSelect =
        document.getElementById(
            "safetyProduct"
        );


    const safetyQuantityInput =
        document.getElementById(
            "safetyQuantity"
        );


    const adjustmentHistoryTableBody =
        document.getElementById(
            "adjustmentHistoryTableBody"
        );


    const paddyStockValue =
        document.getElementById(
            "paddyStockValue"
        );


    const riceStockValue =
        document.getElementById(
            "riceStockValue"
        );


    const byproductStockValue =
        document.getElementById(
            "byproductStockValue"
        );


    const lowStockValue =
        document.getElementById(
            "lowStockValue"
        );


    const inventoryTableBody =
        document.getElementById(
            "inventoryTableBody"
        );


    const movementSearch =
        document.getElementById(
            "movementSearch"
        );


    const movementProductFilter =
        document.getElementById(
            "movementProductFilter"
        );


    const movementTableBody =
        document.getElementById(
            "movementTableBody"
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
       REVERSAL STATE
    ========================================= */

    let pendingReverseAdjustmentId =
        null;


    /* =========================================
       TODAY
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
       STORAGE
    ========================================= */

    function safeParseStorage(
        key,
        fallback = []
    ) {

        try {

            return (
                JSON.parse(
                    localStorage.getItem(
                        key
                    )
                ) ??
                fallback
            );

        }
        catch {

            return fallback;

        }

    }


    /* =========================================
       PURCHASES
    ========================================= */

    function getPurchases() {

        return safeParseStorage(
            "purchases",
            []
        );

    }


    /* =========================================
       QUALITY
    ========================================= */

    function getQualityInspections() {

        return safeParseStorage(
            "qualityInspections",
            []
        );

    }


    /* =========================================
       PRODUCTION
    ========================================= */

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


        return safeParseStorage(
            "productions",
            []
        );

    }


    /* =========================================
       SALES
    ========================================= */

    function getSalesRecords() {

        const records =
            safeParseStorage(
                "salesRecords",
                null
            );


        if (
            Array.isArray(
                records
            )
        ) {

            return records;

        }


        return safeParseStorage(
            "sales",
            []
        );

    }


    /* =========================================
       SAFETY STOCK
    ========================================= */

    function loadSafetyStock() {

        const stored =
            safeParseStorage(
                "inventorySafetyStock",
                {}
            );


        return {

            ...DEFAULT_SAFETY_STOCK,

            ...stored

        };

    }


    let safetyStock =
        loadSafetyStock();


    function saveSafetyStock() {

        localStorage.setItem(
            "inventorySafetyStock",
            JSON.stringify(
                safetyStock
            )
        );

    }


    /* =========================================
       LOAD ADJUSTMENTS
    ========================================= */

    function loadAdjustments() {

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

                let status =
                    adjustment.status ||
                    "active";


                if (
                    adjustment.reversalOf
                ) {

                    status =
                        "reversal";

                }


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

                        adjustment.type ===
                        "out"

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
                        getTodayDate(),


                    reason:

                        adjustment.reason ||
                        "Inventory adjustment",


                    status:
                        status,


                    reversalOf:

                        adjustment.reversalOf ||
                        null,


                    reversedBy:

                        adjustment.reversedBy ||
                        null,


                    createdAt:

                        adjustment.createdAt ||
                        adjustment.id ||
                        Date.now()

                };

            }
        );

    }


    let adjustments =
        loadAdjustments();


    function saveAdjustments() {

        localStorage.setItem(
            "inventoryAdjustments",
            JSON.stringify(
                adjustments
            )
        );

    }


    /* =========================================
       ADJUSTMENT ID
    ========================================= */

    function generateAdjustmentId() {

        const numbers =
            adjustments

                .map(
                    function (
                        adjustment
                    ) {

                        const match =
                            String(
                                adjustment.adjustmentId ||
                                ""
                            ).match(
                                /^ADJ-(\d+)$/i
                            );


                        return (
                            match

                                ?

                                Number(
                                    match[1]
                                )

                                :

                                0
                        );

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
            `ADJ-${String(
                next
            ).padStart(
                3,
                "0"
            )}`
        );

    }


    /* =========================================
       NORMALIZE PRODUCT
    ========================================= */

    function normalizeProductKey(
        value
    ) {

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
            ].includes(
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
            ].includes(
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
            ].includes(
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
            ].includes(
                normalized
            )
        ) {

            return "tush";

        }


        if (
            [
                "bran",
                "ricebran"
            ].includes(
                normalized
            )
        ) {

            return "bran";

        }


        return null;

    }


    /* =========================================
       ACCEPTED PADDY STOCK-IN
    ========================================= */

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
                                inspection.decision ===
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
                                0
                            ),


                        date:

                            purchase.purchaseDate ||
                            purchase.date ||
                            getTodayDate(),


                        source:
                            "Quality-Approved Purchase",


                        reference:

                            purchase.purchaseId ||
                            "—",


                        note:

                            `${purchase.supplierName || "Supplier"} · ${purchase.paddyType || "Paddy"}`,


                        createdAt:

                            Number(
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
       PRODUCTION MOVEMENTS
    ========================================= */

    function getProductionMovements() {

        const movements =
            [];


        getProductionRecords().forEach(
            function (
                record,
                index
            ) {

                const date =
                    record.productionDate ||
                    record.date ||
                    getTodayDate();


                const reference =
                    record.batchId ||
                    record.batch ||
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
                            `Consumed from ${record.purchaseId || "accepted purchase"}`,

                        createdAt:
                            baseCreatedAt + 0.01

                    });

                }


                const outputs = [

                    {
                        key:
                            "wholeRice",

                        quantity:

                            Number(
                                record.riceProduced ||
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

                                `Output from ${record.purchaseId || "source purchase"}`,


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
       SALES MOVEMENTS
    ========================================= */

    function getSalesMovements() {

        const movements =
            [];


        getSalesRecords().forEach(
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

                        `SALE-OUT-${sale.saleId || sale.id || index}`,


                    product:
                        product,


                    direction:
                        "out",


                    quantity:
                        quantityKg,


                    date:

                        sale.saleDate ||
                        sale.date ||
                        getTodayDate(),


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
       ADJUSTMENT MOVEMENTS

       Reversed original transactions remain
       in history. Their reversal transaction
       offsets the quantity.
    ========================================= */

    function getAdjustmentMovements() {

        return adjustments.map(
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
       ALL MOVEMENTS
    ========================================= */

    function buildMovements() {

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

                        PRODUCT_KEYS.includes(
                            movement.product
                        )

                        &&

                        Number(
                            movement.quantity
                        ) >
                        0

                    );

                }
            )

            .sort(
                function (
                    a,
                    b
                ) {

                    const dateCompare =
                        String(
                            a.date ||
                            ""
                        ).localeCompare(
                            String(
                                b.date ||
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
                            a.createdAt ||
                            0
                        )

                        -

                        Number(
                            b.createdAt ||
                            0
                        )
                    );

                }
            );

    }


    /* =========================================
       RUNNING BALANCE
    ========================================= */

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
       INVENTORY STATE
    ========================================= */

    function buildInventoryState() {

        const movements =
            attachRunningBalances(
                buildMovements()
            );


        const state = {};


        PRODUCT_KEYS.forEach(
            function (
                key
            ) {

                state[key] = {

                    quantity:
                        0,

                    lastMovement:
                        "",

                    safetyStock:

                        Number(
                            safetyStock[key] ||
                            0
                        )

                };

            }
        );


        movements.forEach(
            function (
                movement
            ) {

                state[
                    movement.product
                ].quantity =
                    movement.balanceAfter;


                state[
                    movement.product
                ].lastMovement =
                    movement.date;

            }
        );


        return {

            state,
            movements

        };

    }


    /* =========================================
       STATUS
    ========================================= */

    function getInventoryStatus(
        quantity,
        threshold
    ) {

        const stock =
            Number(
                quantity
            );


        const safety =
            Number(
                threshold ||
                0
            );


        if (
            stock < 0
        ) {

            return {

                text:
                    "Data Check",

                className:
                    "status-check"

            };

        }


        if (
            stock === 0
        ) {

            return {

                text:
                    "Out of Stock",

                className:
                    "status-out"

            };

        }


        if (
            stock <=
            safety
        ) {

            return {

                text:
                    "Low Stock",

                className:
                    "status-low"

            };

        }


        return {

            text:
                "Healthy",

            className:
                "status-healthy"

        };

    }


    /* =========================================
       SUMMARY
    ========================================= */

    function updateSummaryCards() {

        const inventory =
            buildInventoryState()
                .state;


        const paddy =
            Number(
                inventory.paddy.quantity
            );


        const wholeRice =
            Number(
                inventory.wholeRice.quantity
            );


        const byproducts =

            Number(
                inventory.khud.quantity
            )

            +

            Number(
                inventory.tush.quantity
            )

            +

            Number(
                inventory.bran.quantity
            );


        let lowCount =
            0;


        PRODUCT_KEYS.forEach(
            function (
                key
            ) {

                const status =
                    getInventoryStatus(

                        inventory[key]
                            .quantity,

                        inventory[key]
                            .safetyStock

                    );


                if (
                    status.text !==
                    "Healthy"
                ) {

                    lowCount +=
                        1;

                }

            }
        );


        paddyStockValue.textContent =
            `${formatNumber(
                paddy
            )} kg`;


        riceStockValue.textContent =
            `${formatNumber(
                wholeRice
            )} kg`;


        byproductStockValue.textContent =
            `${formatNumber(
                byproducts
            )} kg`;


        lowStockValue.textContent =
            `${lowCount} ${
                lowCount === 1
                    ? "Item"
                    : "Items"
            }`;

    }


    /* =========================================
       CURRENT INVENTORY
    ========================================= */

    function displayCurrentInventory() {

        const inventory =
            buildInventoryState()
                .state;


        inventoryTableBody.innerHTML =
            "";


        PRODUCT_KEYS.forEach(
            function (
                key
            ) {

                const product =
                    PRODUCTS[key];


                const item =
                    inventory[key];


                const status =
                    getInventoryStatus(
                        item.quantity,
                        item.safetyStock
                    );


                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>

                        <span class="inventory-product-name">

                            ${escapeHTML(
                                product.tableLabel
                            )}

                        </span>


                        <span class="inventory-product-note">

                            ${escapeHTML(
                                product.note
                            )}

                        </span>

                    </td>


                    <td>

                        <span class="inventory-stock-value">

                            ${formatNumber(
                                item.quantity
                            )} kg

                        </span>

                    </td>


                    <td>

                        ${formatNumber(
                            item.safetyStock
                        )} kg

                    </td>


                    <td>

                        ${
                            item.lastMovement

                                ?

                                formatDate(
                                    item.lastMovement
                                )

                                :

                                "—"
                        }

                    </td>


                    <td>

                        <span
                            class="
                                inventory-status
                                ${status.className}
                            "
                        >

                            ${status.text}

                        </span>

                    </td>

                `;


                inventoryTableBody.appendChild(
                    row
                );

            }
        );

    }


    /* =========================================
       ADJUSTMENT STATUS
    ========================================= */

    function getAdjustmentStatusInfo(
        adjustment
    ) {

        if (
            adjustment.reversalOf
        ) {

            return {

                text:
                    "Reversal",

                className:
                    "adjustment-reversal"

            };

        }


        if (
            adjustment.status ===
            "reversed"
        ) {

            return {

                text:
                    "Reversed",

                className:
                    "adjustment-reversed"

            };

        }


        return {

            text:
                "Active",

            className:
                "adjustment-active"

        };

    }


    /* =========================================
       REVERSAL ACTION HTML
    ========================================= */

    function getAdjustmentActionHTML(
        adjustment
    ) {

        /*
            Reversal transactions themselves
            cannot be reversed again.

            Reversed original records also
            cannot be reversed twice.
        */

        if (
            adjustment.reversalOf ||
            adjustment.status ===
            "reversed"
        ) {

            return "—";

        }


        const waitingForConfirmation =

            Number(
                pendingReverseAdjustmentId
            )

            ===

            Number(
                adjustment.id
            );


        if (
            waitingForConfirmation
        ) {

            return `

                <span class="adjustment-reverse-question">
                    Reverse?
                </span>


                <button
                    class="adjustment-confirm-reverse-button"
                    type="button"
                    data-action="confirm-reverse"
                    data-id="${adjustment.id}"
                >
                    Confirm
                </button>


                <button
                    class="adjustment-cancel-reverse-button"
                    type="button"
                    data-action="cancel-reverse"
                    data-id="${adjustment.id}"
                >
                    Cancel
                </button>

            `;

        }


        return `

            <button
                class="adjustment-reverse-button"
                type="button"
                data-action="request-reverse"
                data-id="${adjustment.id}"
            >
                Reverse
            </button>

        `;

    }


    /* =========================================
       ADJUSTMENT HISTORY
    ========================================= */

    function displayAdjustmentHistory() {

        adjustmentHistoryTableBody.innerHTML =
            "";


        if (
            adjustments.length ===
            0
        ) {

            adjustmentHistoryTableBody.innerHTML = `

                <tr class="adjustment-empty-row">

                    <td colspan="8">

                        No manual stock adjustments have been recorded.

                    </td>

                </tr>

            `;


            return;

        }


        [
            ...adjustments
        ]

            .sort(
                function (
                    a,
                    b
                ) {

                    return (

                        String(
                            b.date
                        ).localeCompare(
                            String(
                                a.date
                            )
                        )

                        ||

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
                    adjustment
                ) {

                    const status =
                        getAdjustmentStatusInfo(
                            adjustment
                        );


                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `

                        <td>

                            <span class="adjustment-id">

                                ${escapeHTML(
                                    adjustment.adjustmentId
                                )}

                            </span>

                        </td>


                        <td>

                            ${formatDate(
                                adjustment.date
                            )}

                        </td>


                        <td>

                            ${escapeHTML(
                                PRODUCTS[
                                    adjustment.product
                                ]?.label ||
                                adjustment.product
                            )}

                        </td>


                        <td>

                            <span
                                class="
                                    adjustment-type-badge
                                    ${
                                        adjustment.type ===
                                        "in"

                                            ?

                                            "adjustment-in"

                                            :

                                            "adjustment-out"
                                    }
                                "
                            >

                                ${
                                    adjustment.type ===
                                    "in"

                                        ?

                                        "Stock In"

                                        :

                                        "Stock Out"
                                }

                            </span>

                        </td>


                        <td>

                            ${
                                adjustment.type ===
                                "in"

                                    ?

                                    "+"

                                    :

                                    "-"
                            }${formatNumber(
                                adjustment.quantity
                            )} kg

                        </td>


                        <td>

                            ${escapeHTML(
                                adjustment.reason
                            )}

                        </td>


                        <td>

                            <span
                                class="
                                    adjustment-status
                                    ${status.className}
                                "
                            >

                                ${status.text}

                            </span>

                        </td>


                        <td class="adjustment-action-cell">

                            ${getAdjustmentActionHTML(
                                adjustment
                            )}

                        </td>

                    `;


                    adjustmentHistoryTableBody.appendChild(
                        row
                    );

                }
            );

    }


    /* =========================================
       REQUEST REVERSAL
    ========================================= */

    function requestAdjustmentReversal(
        id
    ) {

        pendingReverseAdjustmentId =
            id;


        displayAdjustmentHistory();

    }


    /* =========================================
       CANCEL REVERSAL
    ========================================= */

    function cancelAdjustmentReversal() {

        pendingReverseAdjustmentId =
            null;


        displayAdjustmentHistory();

    }


    /* =========================================
       CONFIRM REVERSAL
    ========================================= */

    function confirmAdjustmentReversal(
        id
    ) {

        const adjustment =
            adjustments.find(
                function (
                    item
                ) {

                    return (
                        Number(
                            item.id
                        )

                        ===

                        Number(
                            id
                        )
                    );

                }
            );


        if (!adjustment) {

            pendingReverseAdjustmentId =
                null;


            displayAdjustmentHistory();


            showToast(
                "Adjustment record not found.",
                "error"
            );


            return;

        }


        if (
            adjustment.status ===
            "reversed" ||
            adjustment.reversalOf
        ) {

            pendingReverseAdjustmentId =
                null;


            displayAdjustmentHistory();


            showToast(
                "This adjustment cannot be reversed.",
                "error"
            );


            return;

        }


        /*
            Original Stock In
            → reversal is Stock Out

            Original Stock Out
            → reversal is Stock In
        */

        const reverseType =

            adjustment.type ===
            "in"

                ?

                "out"

                :

                "in";


        /*
            If reversal creates Stock Out,
            verify current inventory first.
        */

        if (
            reverseType ===
            "out"
        ) {

            const inventory =
                buildInventoryState()
                    .state;


            const currentStock =
                Number(
                    inventory[
                        adjustment.product
                    ].quantity
                );


            if (
                adjustment.quantity >
                currentStock
            ) {

                pendingReverseAdjustmentId =
                    null;


                displayAdjustmentHistory();


                showToast(

                    `Cannot reverse ${adjustment.adjustmentId}. Current ${PRODUCTS[
                        adjustment.product
                    ].label} stock is only ${formatNumber(
                        currentStock
                    )} kg.`,

                    "error"

                );


                return;

            }

        }


        const reversalId =
            generateAdjustmentId();


        const reversalRecord = {

            id:
                Date.now(),


            adjustmentId:
                reversalId,


            product:
                adjustment.product,


            type:
                reverseType,


            quantity:
                adjustment.quantity,


            date:
                getTodayDate(),


            reason:

                `Reversal of ${adjustment.adjustmentId}: ${adjustment.reason}`,


            status:
                "reversal",


            reversalOf:
                adjustment.adjustmentId,


            reversedBy:
                null,


            createdAt:
                Date.now()

        };


        adjustment.status =
            "reversed";


        adjustment.reversedBy =
            reversalId;


        adjustments.push(
            reversalRecord
        );


        pendingReverseAdjustmentId =
            null;


        saveAdjustments();


        refreshInventory();


        showToast(

            `${adjustment.adjustmentId} reversed through ${reversalId}.`

        );

    }


    /* =========================================
       MOVEMENT LEDGER
    ========================================= */

    function displayMovementLedger() {

        const searchText =
            movementSearch.value
                .trim()
                .toLowerCase();


        const productFilter =
            movementProductFilter.value;


        const movements =
            buildInventoryState()
                .movements;


        const filtered =
            movements.filter(
                function (
                    movement
                ) {

                    const searchable = `

                        ${PRODUCTS[movement.product]?.label || ""}
                        ${movement.source}
                        ${movement.reference}
                        ${movement.note}

                    `.toLowerCase();


                    const searchMatch =
                        searchable.includes(
                            searchText
                        );


                    const productMatch =

                        productFilter ===
                        "all"

                        ||

                        movement.product ===
                        productFilter;


                    return (
                        searchMatch &&
                        productMatch
                    );

                }
            );


        movementTableBody.innerHTML =
            "";


        if (
            filtered.length ===
            0
        ) {

            movementTableBody.innerHTML = `

                <tr class="movement-empty-row">

                    <td colspan="8">

                        No stock movements match the current filter.

                    </td>

                </tr>

            `;


            return;

        }


        [
            ...filtered
        ]

            .reverse()

            .forEach(
                function (
                    movement
                ) {

                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `

                        <td>

                            ${formatDate(
                                movement.date
                            )}

                        </td>


                        <td>

                            ${escapeHTML(
                                PRODUCTS[
                                    movement.product
                                ].label
                            )}

                        </td>


                        <td>

                            <span
                                class="
                                    movement-badge
                                    ${
                                        movement.direction ===
                                        "in"

                                            ?

                                            "movement-in"

                                            :

                                            "movement-out"
                                    }
                                "
                            >

                                ${
                                    movement.direction ===
                                    "in"

                                        ?

                                        "Stock In"

                                        :

                                        "Stock Out"
                                }

                            </span>

                        </td>


                        <td>

                            ${
                                movement.direction ===
                                "in"

                                    ?

                                    "+"

                                    :

                                    "-"
                            }${formatNumber(
                                movement.quantity
                            )} kg

                        </td>


                        <td>

                            <strong>

                                ${formatNumber(
                                    movement.balanceAfter
                                )} kg

                            </strong>

                        </td>


                        <td>

                            <span class="movement-source">

                                ${escapeHTML(
                                    movement.source
                                )}

                            </span>

                        </td>


                        <td>

                            <span class="movement-reference">

                                ${escapeHTML(
                                    movement.reference
                                )}

                            </span>

                        </td>


                        <td>

                            ${escapeHTML(
                                movement.note
                            )}

                        </td>

                    `;


                    movementTableBody.appendChild(
                        row
                    );

                }
            );

    }


    /* =========================================
       REFRESH
    ========================================= */

    function refreshInventory() {

        updateSummaryCards();

        displayAdjustmentHistory();

        displayCurrentInventory();

        displayMovementLedger();

        updateAdjustmentStockHelp();

    }


    /* =========================================
       CURRENT STOCK HELP
    ========================================= */

    function updateAdjustmentStockHelp() {

        const product =
            adjustmentProductSelect.value;


        if (
            !product ||
            !PRODUCTS[product]
        ) {

            adjustmentStockHelp.textContent =
                "Select a product to view current stock.";

            return;

        }


        const inventory =
            buildInventoryState()
                .state;


        adjustmentStockHelp.textContent =

            `Current stock: ${formatNumber(
                inventory[product]
                    .quantity
            )} kg`;

    }


    /* =========================================
       VALIDATE ADJUSTMENT
    ========================================= */

    function validateAdjustment() {

        const product =
            adjustmentProductSelect.value;


        const type =
            adjustmentTypeSelect.value;


        const quantity =
            Number(
                adjustmentQuantityInput.value
            );


        const date =
            adjustmentDateInput.value;


        const reason =
            adjustmentReasonInput.value
                .trim();


        if (
            !product ||
            !PRODUCTS[product]
        ) {

            return (
                "Please select a product."
            );

        }


        if (
            ![
                "in",
                "out"
            ].includes(
                type
            )
        ) {

            return (
                "Please select an adjustment type."
            );

        }


        if (
            !Number.isFinite(
                quantity
            ) ||
            quantity <= 0
        ) {

            return (
                "Adjustment quantity must be greater than zero."
            );

        }


        if (!date) {

            return (
                "Please select the adjustment date."
            );

        }


        if (
            reason.length <
            5
        ) {

            return (
                "Please provide a clear reason for the stock adjustment."
            );

        }


        if (
            type ===
            "out"
        ) {

            const inventory =
                buildInventoryState()
                    .state;


            const available =
                Number(
                    inventory[
                        product
                    ].quantity
                );


            if (
                quantity >
                available
            ) {

                return (

                    `Stock-out cannot exceed the current available stock of ${formatNumber(
                        available
                    )} kg.`

                );

            }

        }


        return "";

    }


    /* =========================================
       SAVE ADJUSTMENT
    ========================================= */

    adjustmentForm.addEventListener(
        "submit",
        function (
            event
        ) {

            event.preventDefault();


            pendingReverseAdjustmentId =
                null;


            const error =
                validateAdjustment();


            if (error) {

                showToast(
                    error,
                    "error"
                );

                return;

            }


            const adjustment = {

                id:
                    Date.now(),


                adjustmentId:
                    generateAdjustmentId(),


                product:
                    adjustmentProductSelect.value,


                type:
                    adjustmentTypeSelect.value,


                quantity:

                    Number(
                        adjustmentQuantityInput.value
                    ),


                date:
                    adjustmentDateInput.value,


                reason:

                    adjustmentReasonInput.value
                        .trim(),


                status:
                    "active",


                reversalOf:
                    null,


                reversedBy:
                    null,


                createdAt:
                    Date.now()

            };


            adjustments.push(
                adjustment
            );


            saveAdjustments();


            const savedId =
                adjustment.adjustmentId;


            adjustmentForm.reset();


            adjustmentDateInput.value =
                getTodayDate();


            refreshInventory();


            showToast(
                `${savedId} saved successfully.`
            );

        }
    );


    /* =========================================
       ADJUSTMENT HISTORY ACTIONS
    ========================================= */

    adjustmentHistoryTableBody.addEventListener(
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


            if (
                action ===
                "request-reverse"
            ) {

                requestAdjustmentReversal(
                    id
                );

                return;

            }


            if (
                action ===
                "confirm-reverse"
            ) {

                confirmAdjustmentReversal(
                    id
                );

                return;

            }


            if (
                action ===
                "cancel-reverse"
            ) {

                cancelAdjustmentReversal();

            }

        }
    );


    /* =========================================
       SAFETY STOCK
    ========================================= */

    safetyProductSelect.addEventListener(
        "change",
        function () {

            const product =
                safetyProductSelect.value;


            if (
                !product ||
                !PRODUCTS[product]
            ) {

                safetyQuantityInput.value =
                    "";

                return;

            }


            safetyQuantityInput.value =
                Number(
                    safetyStock[
                        product
                    ] ||
                    0
                );

        }
    );


    safetyStockForm.addEventListener(
        "submit",
        function (
            event
        ) {

            event.preventDefault();


            const product =
                safetyProductSelect.value;


            const quantity =
                Number(
                    safetyQuantityInput.value
                );


            if (
                !product ||
                !PRODUCTS[product]
            ) {

                showToast(
                    "Please select a product.",
                    "error"
                );

                return;

            }


            if (
                !Number.isFinite(
                    quantity
                ) ||
                quantity < 0
            ) {

                showToast(
                    "Safety stock level cannot be negative.",
                    "error"
                );

                return;

            }


            safetyStock[
                product
            ] =
                quantity;


            saveSafetyStock();


            refreshInventory();


            showToast(

                `${PRODUCTS[product].label} safety stock updated to ${formatNumber(
                    quantity
                )} kg.`

            );

        }
    );


    /* =========================================
       FILTERS
    ========================================= */

    movementSearch.addEventListener(
        "input",
        displayMovementLedger
    );


    movementProductFilter.addEventListener(
        "change",
        displayMovementLedger
    );


    adjustmentProductSelect.addEventListener(
        "change",
        updateAdjustmentStockHelp
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
                ".inventory-toast"
            );


        if (oldToast) {

            oldToast.remove();

        }


        const toast =
            document.createElement(
                "div"
            );


        toast.className =
            `inventory-toast ${type}`;


        toast.innerHTML = `

            <span class="inventory-toast-icon">

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
       MOBILE SIDEBAR
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
                pendingReverseAdjustmentId !==
                null
            ) {

                pendingReverseAdjustmentId =
                    null;


                displayAdjustmentHistory();


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

        }
    );


    /* =========================================
       INITIALIZE
    ========================================= */

    adjustmentDateInput.value =
        getTodayDate();


    refreshInventory();

});