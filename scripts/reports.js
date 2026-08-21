document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       SMART RICE MILL ERP
       REPORTS & ANALYTICS

       RESEARCH-SUPPORTED DESIGN
       -------------------------

       Verdouw, Robbemond & Wolfert (2015)
       - ERP integration
       - sector-specific business processes
       - integrated management information

       Alfazah et al. (2020)
       - rice procurement monitoring dashboard
       - indicators
       - historical monitoring
       - web-based monitoring system

       Chopra et al. (2017)
       - agri-food supply-chain performance
         indicators
       - stakeholder/process performance

       Azis, Irjayanti & Murti (2026)
       - integrated rice information system
       - real-time reporting
       - inventory visibility
       - distribution monitoring
       - decision support and traceability

       IMPORTANT FINANCIAL RULE
       ------------------------
       Estimated Operating Balance is:

       Sales Revenue
       - Paddy Procurement Cost
       - Operating Expenses
       - Salary Expense

       This is NOT formal accounting profit.
       No claim of COGS-based net profit is made.
    ========================================= */


    /* =========================================
       REPORT LABELS
    ========================================= */

    const REPORT_LABELS = {

        overall:
            "Overall Management Report",

        procurement:
            "Procurement Report",

        quality:
            "Quality Report",

        production:
            "Production Report",

        inventory:
            "Inventory Report",

        sales:
            "Sales Report",

        delivery:
            "Delivery Report",

        financial:
            "Financial Operations Report",

        maintenance:
            "Maintenance Report"

    };


    /* =========================================
       INVENTORY PRODUCTS
    ========================================= */

    const INVENTORY_PRODUCTS = {

        paddy: {
            label:
                "Accepted Paddy"
        },

        wholeRice: {
            label:
                "Whole Rice"
        },

        khud: {
            label:
                "Khud / Broken Rice"
        },

        tush: {
            label:
                "Tush / Husk"
        },

        bran: {
            label:
                "Rice Bran"
        }

    };


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

    const reportFilterForm =
        document.getElementById(
            "reportFilterForm"
        );


    if (!reportFilterForm) {
        return;
    }


    const reportTypeSelect =
        document.getElementById(
            "reportType"
        );


    const reportFromDateInput =
        document.getElementById(
            "reportFromDate"
        );


    const reportToDateInput =
        document.getElementById(
            "reportToDate"
        );


    const selectedReportRange =
        document.getElementById(
            "selectedReportRange"
        );


    const exportCsvBtn =
        document.getElementById(
            "exportCsvBtn"
        );


    const savePdfBtn =
        document.getElementById(
            "savePdfBtn"
        );


    const salesRevenueValue =
        document.getElementById(
            "salesRevenueValue"
        );


    const salesInvoiceCount =
        document.getElementById(
            "salesInvoiceCount"
        );


    const procurementCostValue =
        document.getElementById(
            "procurementCostValue"
        );


    const purchaseCountValue =
        document.getElementById(
            "purchaseCountValue"
        );


    const operatingBalanceValue =
        document.getElementById(
            "operatingBalanceValue"
        );


    const currentInventoryValue =
        document.getElementById(
            "currentInventoryValue"
        );


    const lowStockSummary =
        document.getElementById(
            "lowStockSummary"
        );


    const recoveryRateValue =
        document.getElementById(
            "recoveryRateValue"
        );


    const productionQuantityValue =
        document.getElementById(
            "productionQuantityValue"
        );


    const qualityAcceptanceValue =
        document.getElementById(
            "qualityAcceptanceValue"
        );


    const qualityInspectionValue =
        document.getElementById(
            "qualityInspectionValue"
        );


    const customerDueValue =
        document.getElementById(
            "customerDueValue"
        );


    const supplierDueValue =
        document.getElementById(
            "supplierDueValue"
        );


    const deliveryCompletionValue =
        document.getElementById(
            "deliveryCompletionValue"
        );


    const deliveryCountValue =
        document.getElementById(
            "deliveryCountValue"
        );


    const maintenanceCountValue =
        document.getElementById(
            "maintenanceCountValue"
        );


    const maintenanceCostValue =
        document.getElementById(
            "maintenanceCostValue"
        );


    const reportResultTitle =
        document.getElementById(
            "reportResultTitle"
        );


    const reportResultRange =
        document.getElementById(
            "reportResultRange"
        );


    const reportTableBody =
        document.getElementById(
            "reportTableBody"
        );


    const reportHistoryBody =
        document.getElementById(
            "reportHistoryBody"
        );


    const salesTrendCanvas =
        document.getElementById(
            "salesTrendCanvas"
        );


    const cashFlowCanvas =
        document.getElementById(
            "cashFlowCanvas"
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
       REPORT STATE
    ========================================= */

    let currentReportRows =
        [];


    let currentMetrics =
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
                JSON.parse(value) ??
                fallback
            );

        }
        catch {

            return fallback;

        }

    }


    function firstArrayFromKeys(
        keys
    ) {

        for (
            const key of
            keys
        ) {

            const value =
                safeParseStorage(
                    key,
                    null
                );


            if (
                Array.isArray(value)
            ) {

                return value;

            }

        }


        return [];

    }


    /* =========================================
       DATA SOURCES
    ========================================= */

    function getPurchases() {

        return firstArrayFromKeys(
            [
                "purchases",
                "purchaseRecords"
            ]
        );

    }


    function getQualityInspections() {

        return firstArrayFromKeys(
            [
                "qualityInspections",
                "inspectionRecords"
            ]
        );

    }


    function getProductions() {

        return firstArrayFromKeys(
            [
                "productionRecords",
                "productions"
            ]
        );

    }


    function getSales() {

        return firstArrayFromKeys(
            [
                "salesRecords",
                "sales"
            ]
        );

    }


    function getDeliveries() {

        return firstArrayFromKeys(
            [
                "deliveryRecords",
                "deliveries"
            ]
        );

    }


    function getMaintenanceRecords() {

        return firstArrayFromKeys(
            [
                "maintenanceRecords",
                "maintenance"
            ]
        );

    }


    function getAdjustments() {

        return firstArrayFromKeys(
            [
                "inventoryAdjustments"
            ]
        );

    }


    /* =========================================
       EXPENSE / SALARY SOURCES

       Supports separate or combined prototype
       storage structures.
    ========================================= */

    function getExpenseRecords() {

        const result =
            [];


        firstArrayFromKeys(
            [
                "expenseRecords",
                "expenses"
            ]
        )
        .forEach(
            function (
                record
            ) {

                result.push(
                    {
                        ...record,
                        normalizedType:
                            "expense"
                    }
                );

            }
        );


        firstArrayFromKeys(
            [
                "expenseSalaryRecords",
                "financeRecords"
            ]
        )
        .forEach(
            function (
                record
            ) {

                const type =
                    String(
                        record.type ||
                        record.category ||
                        ""
                    )
                    .toLowerCase();


                if (
                    !type.includes(
                        "salary"
                    )
                ) {

                    result.push(
                        {
                            ...record,
                            normalizedType:
                                "expense"
                        }
                    );

                }

            }
        );


        return result;

    }


    function getSalaryRecords() {

        const result =
            [];


        firstArrayFromKeys(
            [
                "salaryRecords",
                "salaries"
            ]
        )
        .forEach(
            function (
                record
            ) {

                result.push(
                    {
                        ...record,
                        normalizedType:
                            "salary"
                    }
                );

            }
        );


        firstArrayFromKeys(
            [
                "expenseSalaryRecords",
                "financeRecords"
            ]
        )
        .forEach(
            function (
                record
            ) {

                const type =
                    String(
                        record.type ||
                        record.category ||
                        ""
                    )
                    .toLowerCase();


                if (
                    type.includes(
                        "salary"
                    )
                ) {

                    result.push(
                        {
                            ...record,
                            normalizedType:
                                "salary"
                        }
                    );

                }

            }
        );


        return result;

    }


    /* =========================================
       DATE HELPERS
    ========================================= */

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
            `${year}-${month}-${day}`
        );

    }


    function getMonthStartDate() {

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


        return (
            `${year}-${month}-01`
        );

    }


    function formatDate(
        value
    ) {

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


    function formatDateTime(
        value
    ) {

        if (!value) {

            return "—";

        }


        return new Date(
            value
        ).toLocaleString(
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


    function normalizeDateValue(
        value
    ) {

        if (!value) {

            return "";

        }


        const text =
            String(
                value
            );


        if (
            /^\d{4}-\d{2}-\d{2}/.test(
                text
            )
        ) {

            return text.slice(
                0,
                10
            );

        }


        const parsed =
            new Date(
                value
            );


        if (
            Number.isNaN(
                parsed.getTime()
            )
        ) {

            return "";

        }


        const year =
            parsed.getFullYear();


        const month =
            String(
                parsed.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        const day =
            String(
                parsed.getDate()
            ).padStart(
                2,
                "0"
            );


        return (
            `${year}-${month}-${day}`
        );

    }


    function recordDate(
        record,
        candidates
    ) {

        for (
            const key of
            candidates
        ) {

            if (
                record[key]
            ) {

                return normalizeDateValue(
                    record[key]
                );

            }

        }


        return "";

    }


    function dateIsWithinRange(
        date,
        fromDate,
        toDate
    ) {

        if (!date) {

            return false;

        }


        return (
            date >= fromDate &&
            date <= toDate
        );

    }


    /* =========================================
       FORMAT
    ========================================= */

    function formatNumber(
        value
    ) {

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


    function formatMoney(
        value
    ) {

        const number =
            Number(
                value || 0
            );


        const sign =
            number < 0
                ? "-"
                : "";


        return (

            `${sign}৳${Math.abs(
                number
            ).toLocaleString(
                "en-US",
                {
                    maximumFractionDigits:
                        2
                }
            )}`

        );

    }


    function formatPercentage(
        value
    ) {

        if (
            value === null ||
            value === undefined ||
            !Number.isFinite(
                Number(value)
            )
        ) {

            return "—";

        }


        return (
            `${Number(
                value
            ).toFixed(
                2
            )}%`
        );

    }


    /* =========================================
       SAFE HTML
    ========================================= */

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


    /* =========================================
       PURCHASE NORMALIZATION
    ========================================= */

    function getPurchaseAmount(
        purchase
    ) {

        const stored =

            Number(
                purchase.totalPurchaseAmount ??
                purchase.totalAmount ??
                purchase.amount ??
                purchase.total ??
                0
            );


        if (
            stored > 0
        ) {

            return stored;

        }


        const weight =
            Number(
                purchase.weight ??
                purchase.paddyWeight ??
                purchase.quantityKg ??
                0
            );


        const price =
            Number(
                purchase.pricePerKg ??
                purchase.price ??
                0
            );


        return (
            weight *
            price
        );

    }


    function getPurchaseWeight(
        purchase
    ) {

        return Number(

            purchase.weight ??
            purchase.paddyWeight ??
            purchase.quantityKg ??
            purchase.quantity ??
            0

        );

    }


    function getPurchaseDue(
        purchase
    ) {

        return Math.max(

            Number(
                purchase.remainingDue ??
                purchase.dueAmount ??
                purchase.due ??
                0
            ),
            0

        );

    }


    /* =========================================
       PRODUCTION NORMALIZATION
    ========================================= */

    function getProductionInput(
        record
    ) {

        return Number(

            record.inputPaddy ??
            record.paddyInput ??
            record.inputPaddyQuantity ??
            0

        );

    }


    function getWholeRiceOutput(
        record
    ) {

        return Number(

            record.riceProduced ??
            record.rice ??
            record.wholeRice ??
            0

        );

    }


    function getKhudOutput(
        record
    ) {

        return Number(

            record.khudProduced ??
            record.khud ??
            record.brokenRice ??
            0

        );

    }


    function getTushOutput(
        record
    ) {

        return Number(

            record.tushProduced ??
            record.tush ??
            record.husk ??
            0

        );

    }


    function getBranOutput(
        record
    ) {

        return Number(

            record.branProduced ??
            record.bran ??
            0

        );

    }


    /* =========================================
       SALES NORMALIZATION
    ========================================= */

    function saleIsActive(
        sale
    ) {

        return (
            sale.status !==
            "voided"
        );

    }


    function getSaleAmount(
        sale
    ) {

        return Number(

            sale.totalAmount ??
            sale.total ??
            0

        );

    }


    function getSaleDue(
        sale
    ) {

        const total =
            getSaleAmount(
                sale
            );


        const paid =
            Number(
                sale.amountPaid ??
                0
            );


        return Math.max(

            Number(
                sale.dueAmount ??
                (
                    total -
                    paid
                )
            ),
            0

        );

    }


    /* =========================================
       EXPENSE NORMALIZATION
    ========================================= */

    function getFinancialRecordAmount(
        record
    ) {

        return Number(

            record.amount ??
            record.totalAmount ??
            record.cost ??
            record.salary ??
            record.netSalary ??
            0

        );

    }


    /* =========================================
       MAINTENANCE COST
    ========================================= */

    function getMaintenanceCost(
        record
    ) {

        return Number(

            record.cost ??
            record.maintenanceCost ??
            record.totalCost ??
            record.amount ??
            0

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
       CURRENT INVENTORY

       Mirrors the transaction-driven inventory
       logic used by Inventory Management.
    ========================================= */

    function calculateCurrentInventory() {

        const state = {

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

                                String(
                                    inspection.decision ||
                                    ""
                                ).toLowerCase()

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


        purchases.forEach(
            function (
                purchase
            ) {

                if (
                    acceptedIds.has(
                        String(
                            purchase.purchaseId
                        )
                    )
                ) {

                    state.paddy +=
                        getPurchaseWeight(
                            purchase
                        );

                }

            }
        );


        getProductions().forEach(
            function (
                production
            ) {

                state.paddy -=
                    getProductionInput(
                        production
                    );


                state.wholeRice +=
                    getWholeRiceOutput(
                        production
                    );


                state.khud +=
                    getKhudOutput(
                        production
                    );


                state.tush +=
                    getTushOutput(
                        production
                    );


                state.bran +=
                    getBranOutput(
                        production
                    );

            }
        );


        getSales()
            .filter(
                saleIsActive
            )
            .forEach(
                function (
                    sale
                ) {

                    const product =
                        normalizeProductKey(

                            sale.productKey ||
                            sale.product ||
                            sale.productType

                        );


                    if (
                        !product ||
                        product ===
                        "paddy"
                    ) {

                        return;

                    }


                    state[product] -=
                        Number(

                            sale.quantityKg ??
                            sale.quantity ??
                            0

                        );

                }
            );


        getAdjustments().forEach(
            function (
                adjustment
            ) {

                const product =
                    normalizeProductKey(
                        adjustment.product
                    );


                if (!product) {

                    return;

                }


                const quantity =
                    Number(
                        adjustment.quantity ||
                        0
                    );


                if (
                    adjustment.type ===
                    "out"
                ) {

                    state[product] -=
                        quantity;

                }
                else {

                    state[product] +=
                        quantity;

                }

            }
        );


        return state;

    }


    /* =========================================
       SAFETY STOCK
    ========================================= */

    function getSafetyStock() {

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


    /* =========================================
       BUILD METRICS
    ========================================= */

    function calculateMetrics(
        fromDate,
        toDate
    ) {

        const purchases =
            getPurchases();


        const periodPurchases =
            purchases.filter(
                function (
                    purchase
                ) {

                    return dateIsWithinRange(

                        recordDate(
                            purchase,
                            [
                                "purchaseDate",
                                "date"
                            ]
                        ),

                        fromDate,
                        toDate

                    );

                }
            );


        const purchaseCost =
            periodPurchases.reduce(
                function (
                    total,
                    purchase
                ) {

                    return (
                        total +
                        getPurchaseAmount(
                            purchase
                        )
                    );

                },
                0
            );


        const purchaseWeight =
            periodPurchases.reduce(
                function (
                    total,
                    purchase
                ) {

                    return (
                        total +
                        getPurchaseWeight(
                            purchase
                        )
                    );

                },
                0
            );


        const supplierDue =
            purchases.reduce(
                function (
                    total,
                    purchase
                ) {

                    return (
                        total +
                        getPurchaseDue(
                            purchase
                        )
                    );

                },
                0
            );


        /* =====================================
           SALES
        ====================================== */

        const activeSales =
            getSales()
                .filter(
                    saleIsActive
                );


        const periodSales =
            activeSales.filter(
                function (
                    sale
                ) {

                    return dateIsWithinRange(

                        recordDate(
                            sale,
                            [
                                "saleDate",
                                "invoiceDate",
                                "date"
                            ]
                        ),

                        fromDate,
                        toDate

                    );

                }
            );


        const salesRevenue =
            periodSales.reduce(
                function (
                    total,
                    sale
                ) {

                    return (
                        total +
                        getSaleAmount(
                            sale
                        )
                    );

                },
                0
            );


        const customerDue =
            activeSales.reduce(
                function (
                    total,
                    sale
                ) {

                    return (
                        total +
                        getSaleDue(
                            sale
                        )
                    );

                },
                0
            );


        /* =====================================
           QUALITY
        ====================================== */

        const periodInspections =
            getQualityInspections()
                .filter(
                    function (
                        inspection
                    ) {

                        return dateIsWithinRange(

                            recordDate(
                                inspection,
                                [
                                    "inspectionDate",
                                    "date"
                                ]
                            ),

                            fromDate,
                            toDate

                        );

                    }
                );


        const acceptedInspections =
            periodInspections.filter(
                function (
                    inspection
                ) {

                    return (

                        String(
                            inspection.decision ||
                            ""
                        ).toLowerCase()

                        ===

                        "accepted"

                    );

                }
            ).length;


        const rejectedInspections =
            periodInspections.filter(
                function (
                    inspection
                ) {

                    return (

                        String(
                            inspection.decision ||
                            ""
                        ).toLowerCase()

                        ===

                        "rejected"

                    );

                }
            ).length;


        const qualityAcceptanceRate =

            periodInspections.length >
            0

                ?

                (
                    acceptedInspections /
                    periodInspections.length
                ) *
                100

                :

                null;


        /* =====================================
           PRODUCTION
        ====================================== */

        const periodProductions =
            getProductions()
                .filter(
                    function (
                        production
                    ) {

                        return dateIsWithinRange(

                            recordDate(
                                production,
                                [
                                    "productionDate",
                                    "date"
                                ]
                            ),

                            fromDate,
                            toDate

                        );

                    }
                );


        const productionInput =
            periodProductions.reduce(
                function (
                    total,
                    record
                ) {

                    return (
                        total +
                        getProductionInput(
                            record
                        )
                    );

                },
                0
            );


        const wholeRiceProduced =
            periodProductions.reduce(
                function (
                    total,
                    record
                ) {

                    return (
                        total +
                        getWholeRiceOutput(
                            record
                        )
                    );

                },
                0
            );


        const khudProduced =
            periodProductions.reduce(
                function (
                    total,
                    record
                ) {

                    return (
                        total +
                        getKhudOutput(
                            record
                        )
                    );

                },
                0
            );


        const tushProduced =
            periodProductions.reduce(
                function (
                    total,
                    record
                ) {

                    return (
                        total +
                        getTushOutput(
                            record
                        )
                    );

                },
                0
            );


        const branProduced =
            periodProductions.reduce(
                function (
                    total,
                    record
                ) {

                    return (
                        total +
                        getBranOutput(
                            record
                        )
                    );

                },
                0
            );


        const recoveryRate =

            productionInput >
            0

                ?

                (
                    wholeRiceProduced /
                    productionInput
                ) *
                100

                :

                null;


        /* =====================================
           EXPENSE
        ====================================== */

        const periodExpenses =
            getExpenseRecords()
                .filter(
                    function (
                        record
                    ) {

                        return dateIsWithinRange(

                            recordDate(
                                record,
                                [
                                    "expenseDate",
                                    "paymentDate",
                                    "date"
                                ]
                            ),

                            fromDate,
                            toDate

                        );

                    }
                );


        const operatingExpense =
            periodExpenses.reduce(
                function (
                    total,
                    record
                ) {

                    return (
                        total +
                        getFinancialRecordAmount(
                            record
                        )
                    );

                },
                0
            );


        /* =====================================
           SALARY
        ====================================== */

        const periodSalaries =
            getSalaryRecords()
                .filter(
                    function (
                        record
                    ) {

                        return dateIsWithinRange(

                            recordDate(
                                record,
                                [
                                    "salaryDate",
                                    "paymentDate",
                                    "date"
                                ]
                            ),

                            fromDate,
                            toDate

                        );

                    }
                );


        const salaryExpense =
            periodSalaries.reduce(
                function (
                    total,
                    record
                ) {

                    return (
                        total +
                        getFinancialRecordAmount(
                            record
                        )
                    );

                },
                0
            );


        const operatingBalance =

            salesRevenue
            -
            purchaseCost
            -
            operatingExpense
            -
            salaryExpense;


        /* =====================================
           DELIVERY
        ====================================== */

        const periodDeliveries =
            getDeliveries()
                .filter(
                    function (
                        delivery
                    ) {

                        return dateIsWithinRange(

                            recordDate(
                                delivery,
                                [
                                    "deliveryDate",
                                    "date"
                                ]
                            ),

                            fromDate,
                            toDate

                        );

                    }
                );


        const deliveredCount =
            periodDeliveries.filter(
                function (
                    delivery
                ) {

                    return (
                        delivery.status ===
                        "delivered"
                    );

                }
            ).length;


        const cancelledDeliveries =
            periodDeliveries.filter(
                function (
                    delivery
                ) {

                    return (
                        delivery.status ===
                        "cancelled"
                    );

                }
            ).length;


        const validDeliveryCount =

            periodDeliveries.length
            -
            cancelledDeliveries;


        const deliveryCompletionRate =

            validDeliveryCount >
            0

                ?

                (
                    deliveredCount /
                    validDeliveryCount
                ) *
                100

                :

                null;


        const totalRoadDistance =
            periodDeliveries.reduce(
                function (
                    total,
                    delivery
                ) {

                    return (
                        total +
                        Number(
                            delivery.distanceKm ||
                            0
                        )
                    );

                },
                0
            );


        /* =====================================
           MAINTENANCE
        ====================================== */

        const periodMaintenance =
            getMaintenanceRecords()
                .filter(
                    function (
                        record
                    ) {

                        return dateIsWithinRange(

                            recordDate(
                                record,
                                [
                                    "maintenanceDate",
                                    "serviceDate",
                                    "date"
                                ]
                            ),

                            fromDate,
                            toDate

                        );

                    }
                );


        const maintenanceCost =
            periodMaintenance.reduce(
                function (
                    total,
                    record
                ) {

                    return (
                        total +
                        getMaintenanceCost(
                            record
                        )
                    );

                },
                0
            );


        /* =====================================
           INVENTORY CURRENT SNAPSHOT
        ====================================== */

        const inventory =
            calculateCurrentInventory();


        const safetyStock =
            getSafetyStock();


        const inventoryValues =
            Object.values(
                inventory
            );


        const currentInventoryTotal =
            inventoryValues.reduce(
                function (
                    total,
                    quantity
                ) {

                    return (
                        total +
                        Number(
                            quantity ||
                            0
                        )
                    );

                },
                0
            );


        let lowStockCount =
            0;


        Object.keys(
            INVENTORY_PRODUCTS
        )
        .forEach(
            function (
                key
            ) {

                if (
                    Number(
                        inventory[key] ||
                        0
                    )

                    <=

                    Number(
                        safetyStock[key] ||
                        0
                    )
                ) {

                    lowStockCount +=
                        1;

                }

            }
        );


        return {

            fromDate,
            toDate,

            purchaseCount:
                periodPurchases.length,

            purchaseCost,
            purchaseWeight,
            supplierDue,

            salesCount:
                periodSales.length,

            salesRevenue,
            customerDue,

            inspectionCount:
                periodInspections.length,

            acceptedInspections,
            rejectedInspections,
            qualityAcceptanceRate,

            productionCount:
                periodProductions.length,

            productionInput,
            wholeRiceProduced,
            khudProduced,
            tushProduced,
            branProduced,
            recoveryRate,

            operatingExpense,
            salaryExpense,
            operatingBalance,

            deliveryCount:
                periodDeliveries.length,

            deliveredCount,
            cancelledDeliveries,
            deliveryCompletionRate,
            totalRoadDistance,

            maintenanceCount:
                periodMaintenance.length,

            maintenanceCost,

            inventory,
            safetyStock,
            currentInventoryTotal,
            lowStockCount

        };

    }


    /* =========================================
       UPDATE KPI CARDS
    ========================================= */

    function updateKpis(
        metrics
    ) {

        salesRevenueValue.textContent =
            formatMoney(
                metrics.salesRevenue
            );


        salesInvoiceCount.textContent =

            `${metrics.salesCount} active ${
                metrics.salesCount ===
                1
                    ? "invoice"
                    : "invoices"
            }`;


        procurementCostValue.textContent =
            formatMoney(
                metrics.purchaseCost
            );


        purchaseCountValue.textContent =

            `${metrics.purchaseCount} ${
                metrics.purchaseCount ===
                1
                    ? "purchase"
                    : "purchases"
            }`;


        operatingBalanceValue.textContent =
            formatMoney(
                metrics.operatingBalance
            );


        operatingBalanceValue.style.color =

            metrics.operatingBalance <
            0

                ?

                "#c23939"

                :

                "#16833a";


        currentInventoryValue.textContent =

            `${formatNumber(
                metrics.currentInventoryTotal
            )} kg`;


        lowStockSummary.textContent =

            `${metrics.lowStockCount} low-stock ${
                metrics.lowStockCount ===
                1
                    ? "item"
                    : "items"
            }`;


        recoveryRateValue.textContent =
            formatPercentage(
                metrics.recoveryRate
            );


        productionQuantityValue.textContent =

            metrics.productionCount >
            0

                ?

                `${formatNumber(
                    metrics.wholeRiceProduced
                )} kg whole rice from ${formatNumber(
                    metrics.productionInput
                )} kg paddy`

                :

                "No production in selected period";


        qualityAcceptanceValue.textContent =
            formatPercentage(
                metrics.qualityAcceptanceRate
            );


        qualityInspectionValue.textContent =

            `${metrics.inspectionCount} ${
                metrics.inspectionCount ===
                1
                    ? "inspection"
                    : "inspections"
            }`;


        customerDueValue.textContent =
            formatMoney(
                metrics.customerDue
            );


        supplierDueValue.textContent =
            formatMoney(
                metrics.supplierDue
            );


        deliveryCompletionValue.textContent =
            formatPercentage(
                metrics.deliveryCompletionRate
            );


        deliveryCountValue.textContent =

            `${metrics.deliveredCount} delivered from ${metrics.deliveryCount} records`;


        maintenanceCountValue.textContent =
            metrics.maintenanceCount;


        maintenanceCostValue.textContent =

            `${formatMoney(
                metrics.maintenanceCost
            )} maintenance cost`;

    }


    /* =========================================
       REPORT ROW
    ========================================= */

    function createReportRow(
        module,
        metric,
        value,
        interpretation,
        tone = ""
    ) {

        return {

            module,
            metric,
            value,
            interpretation,
            tone

        };

    }


    /* =========================================
       BUILD REPORT ROWS
    ========================================= */

    function buildReportRows(
        type,
        metrics
    ) {

        const rows =
            [];


        const addProcurementRows =
            function () {

                rows.push(

                    createReportRow(
                        "Purchase",
                        "Purchase Records",
                        metrics.purchaseCount,
                        "Number of paddy purchases recorded in the selected period."
                    ),

                    createReportRow(
                        "Purchase",
                        "Paddy Purchased",
                        `${formatNumber(
                            metrics.purchaseWeight
                        )} kg`,
                        "Total incoming paddy quantity purchased in the selected period."
                    ),

                    createReportRow(
                        "Purchase",
                        "Procurement Cost",
                        formatMoney(
                            metrics.purchaseCost
                        ),
                        "Total paddy procurement value for the selected period."
                    ),

                    createReportRow(
                        "Purchase",
                        "Outstanding Supplier Due",
                        formatMoney(
                            metrics.supplierDue
                        ),
                        "Current unpaid supplier liability derived from purchase records.",
                        metrics.supplierDue > 0
                            ? "warning"
                            : "positive"
                    )

                );

            };


        const addQualityRows =
            function () {

                rows.push(

                    createReportRow(
                        "Quality",
                        "Inspection Records",
                        metrics.inspectionCount,
                        "Quality inspections recorded within the selected period."
                    ),

                    createReportRow(
                        "Quality",
                        "Accepted Batches",
                        metrics.acceptedInspections,
                        "Batches approved for production."
                    ),

                    createReportRow(
                        "Quality",
                        "Rejected Batches",
                        metrics.rejectedInspections,
                        "Batches rejected during quality inspection.",
                        metrics.rejectedInspections > 0
                            ? "warning"
                            : "positive"
                    ),

                    createReportRow(
                        "Quality",
                        "Acceptance Rate",
                        formatPercentage(
                            metrics.qualityAcceptanceRate
                        ),
                        "Accepted inspections ÷ total inspections × 100."
                    )

                );

            };


        const addProductionRows =
            function () {

                rows.push(

                    createReportRow(
                        "Production",
                        "Production Batches",
                        metrics.productionCount,
                        "Production batches completed in the selected period."
                    ),

                    createReportRow(
                        "Production",
                        "Paddy Input",
                        `${formatNumber(
                            metrics.productionInput
                        )} kg`,
                        "Accepted paddy consumed by production."
                    ),

                    createReportRow(
                        "Production",
                        "Whole Rice Output",
                        `${formatNumber(
                            metrics.wholeRiceProduced
                        )} kg`,
                        "Measured whole-rice output."
                    ),

                    createReportRow(
                        "Production",
                        "Khud / Broken Rice",
                        `${formatNumber(
                            metrics.khudProduced
                        )} kg`,
                        "Measured broken-rice output."
                    ),

                    createReportRow(
                        "Production",
                        "Tush / Husk",
                        `${formatNumber(
                            metrics.tushProduced
                        )} kg`,
                        "Measured husk output."
                    ),

                    createReportRow(
                        "Production",
                        "Rice Bran",
                        `${formatNumber(
                            metrics.branProduced
                        )} kg`,
                        "Measured rice-bran output."
                    ),

                    createReportRow(
                        "Production",
                        "Whole Rice Recovery",
                        formatPercentage(
                            metrics.recoveryRate
                        ),
                        "Whole rice output ÷ paddy input × 100."
                    )

                );

            };


        const addInventoryRows =
            function () {

                Object.keys(
                    INVENTORY_PRODUCTS
                )
                .forEach(
                    function (
                        key
                    ) {

                        const quantity =
                            Number(
                                metrics.inventory[key] ||
                                0
                            );


                        const threshold =
                            Number(
                                metrics.safetyStock[key] ||
                                0
                            );


                        const isLow =
                            quantity <=
                            threshold;


                        rows.push(

                            createReportRow(
                                "Inventory",
                                INVENTORY_PRODUCTS[key]
                                    .label,
                                `${formatNumber(
                                    quantity
                                )} kg`,
                                `Safety stock: ${formatNumber(
                                    threshold
                                )} kg · ${
                                    isLow
                                        ? "Low-stock attention required."
                                        : "Stock is above configured safety level."
                                }`,
                                isLow
                                    ? "warning"
                                    : "positive"
                            )

                        );

                    }
                );

            };


        const addSalesRows =
            function () {

                rows.push(

                    createReportRow(
                        "Sales",
                        "Active Invoices",
                        metrics.salesCount,
                        "Non-voided sales invoices within the selected period."
                    ),

                    createReportRow(
                        "Sales",
                        "Sales Revenue",
                        formatMoney(
                            metrics.salesRevenue
                        ),
                        "Gross invoice value of active sales within the selected period."
                    ),

                    createReportRow(
                        "Sales",
                        "Outstanding Customer Due",
                        formatMoney(
                            metrics.customerDue
                        ),
                        "Current unpaid amount from active customer invoices.",
                        metrics.customerDue > 0
                            ? "warning"
                            : "positive"
                    )

                );

            };


        const addDeliveryRows =
            function () {

                rows.push(

                    createReportRow(
                        "Delivery",
                        "Delivery Records",
                        metrics.deliveryCount,
                        "Deliveries created in the selected period."
                    ),

                    createReportRow(
                        "Delivery",
                        "Delivered",
                        metrics.deliveredCount,
                        "Deliveries reaching Delivered status."
                    ),

                    createReportRow(
                        "Delivery",
                        "Cancelled",
                        metrics.cancelledDeliveries,
                        "Cancelled delivery records retained for traceability.",
                        metrics.cancelledDeliveries > 0
                            ? "warning"
                            : ""
                    ),

                    createReportRow(
                        "Delivery",
                        "Completion Rate",
                        formatPercentage(
                            metrics.deliveryCompletionRate
                        ),
                        "Delivered ÷ non-cancelled delivery records × 100."
                    ),

                    createReportRow(
                        "Delivery",
                        "Recorded Road Distance",
                        `${formatNumber(
                            metrics.totalRoadDistance
                        )} km`,
                        "Combined road-distance values stored with selected delivery records."
                    )

                );

            };


        const addFinancialRows =
            function () {

                rows.push(

                    createReportRow(
                        "Finance",
                        "Sales Revenue",
                        formatMoney(
                            metrics.salesRevenue
                        ),
                        "Gross active invoice value in the selected period."
                    ),

                    createReportRow(
                        "Finance",
                        "Paddy Procurement Cost",
                        formatMoney(
                            metrics.purchaseCost
                        ),
                        "Selected-period paddy procurement spending."
                    ),

                    createReportRow(
                        "Finance",
                        "Operating Expenses",
                        formatMoney(
                            metrics.operatingExpense
                        ),
                        "Operating expense records in the selected period."
                    ),

                    createReportRow(
                        "Finance",
                        "Salary Expense",
                        formatMoney(
                            metrics.salaryExpense
                        ),
                        "Salary records in the selected period."
                    ),

                    createReportRow(
                        "Finance",
                        "Estimated Operating Balance",
                        formatMoney(
                            metrics.operatingBalance
                        ),
                        "Sales − Procurement − Operating Expenses − Salary. Operational estimate only; not formal accounting profit.",
                        metrics.operatingBalance < 0
                            ? "negative"
                            : "positive"
                    )

                );

            };


        const addMaintenanceRows =
            function () {

                rows.push(

                    createReportRow(
                        "Maintenance",
                        "Maintenance Records",
                        metrics.maintenanceCount,
                        "Maintenance activities recorded in the selected period."
                    ),

                    createReportRow(
                        "Maintenance",
                        "Maintenance Cost",
                        formatMoney(
                            metrics.maintenanceCost
                        ),
                        "Recorded maintenance expenditure in the selected period."
                    )

                );

            };


        if (
            type ===
            "procurement"
        ) {

            addProcurementRows();

        }
        else if (
            type ===
            "quality"
        ) {

            addQualityRows();

        }
        else if (
            type ===
            "production"
        ) {

            addProductionRows();

        }
        else if (
            type ===
            "inventory"
        ) {

            addInventoryRows();

        }
        else if (
            type ===
            "sales"
        ) {

            addSalesRows();

        }
        else if (
            type ===
            "delivery"
        ) {

            addDeliveryRows();

        }
        else if (
            type ===
            "financial"
        ) {

            addFinancialRows();

        }
        else if (
            type ===
            "maintenance"
        ) {

            addMaintenanceRows();

        }
        else {

            addProcurementRows();

            addQualityRows();

            addProductionRows();

            addInventoryRows();

            addSalesRows();

            addDeliveryRows();

            addFinancialRows();

            addMaintenanceRows();

        }


        return rows;

    }


    /* =========================================
       DISPLAY REPORT
    ========================================= */

    function displayReportRows(
        rows
    ) {

        reportTableBody.innerHTML =
            "";


        if (
            rows.length ===
            0
        ) {

            reportTableBody.innerHTML = `

                <tr class="report-empty-row">

                    <td colspan="4">

                        No report metrics are available.

                    </td>

                </tr>

            `;


            return;

        }


        rows.forEach(
            function (
                row
            ) {

                const tr =
                    document.createElement(
                        "tr"
                    );


                let valueClass =
                    "report-value";


                if (
                    row.tone ===
                    "positive"
                ) {

                    valueClass +=
                        " report-positive-value";

                }
                else if (
                    row.tone ===
                    "warning"
                ) {

                    valueClass +=
                        " report-warning-value";

                }
                else if (
                    row.tone ===
                    "negative"
                ) {

                    valueClass +=
                        " report-negative-value";

                }


                tr.innerHTML = `

                    <td>

                        ${escapeHTML(
                            row.module
                        )}

                    </td>


                    <td>

                        ${escapeHTML(
                            row.metric
                        )}

                    </td>


                    <td>

                        <span class="${valueClass}">

                            ${escapeHTML(
                                row.value
                            )}

                        </span>

                    </td>


                    <td>

                        ${escapeHTML(
                            row.interpretation
                        )}

                    </td>

                `;


                reportTableBody.appendChild(
                    tr
                );

            }
        );

    }


    /* =========================================
       VALIDATE FILTER
    ========================================= */

    function validateFilter() {

        const fromDate =
            reportFromDateInput.value;


        const toDate =
            reportToDateInput.value;


        if (
            !fromDate ||
            !toDate
        ) {

            return (
                "Please select both From Date and To Date."
            );

        }


        if (
            fromDate >
            toDate
        ) {

            return (
                "From Date cannot be later than To Date."
            );

        }


        return "";

    }


    /* =========================================
       RENDER REPORT
    ========================================= */

    function renderCurrentReport() {

        const error =
            validateFilter();


        if (error) {

            showToast(
                error,
                "error"
            );


            return false;

        }


        const type =
            reportTypeSelect.value;


        const fromDate =
            reportFromDateInput.value;


        const toDate =
            reportToDateInput.value;


        currentMetrics =
            calculateMetrics(
                fromDate,
                toDate
            );


        currentReportRows =
            buildReportRows(
                type,
                currentMetrics
            );


        const title =
            REPORT_LABELS[type];


        const formattedRange =

            `${formatDate(
                fromDate
            )} – ${formatDate(
                toDate
            )}`;


        selectedReportRange.textContent =

            `${title} · ${formattedRange}`;


        reportResultTitle.textContent =
            title;


        reportResultRange.textContent =
            formattedRange;


        updateKpis(
            currentMetrics
        );


        displayReportRows(
            currentReportRows
        );


        drawCharts();


        return true;

    }


    /* =========================================
       GENERATE REPORT
    ========================================= */

    reportFilterForm.addEventListener(
        "submit",
        function (
            event
        ) {

            event.preventDefault();


            if (
                !renderCurrentReport()
            ) {

                return;

            }


            saveReportHistory();


            displayReportHistory();


            showToast(
                `${REPORT_LABELS[
                    reportTypeSelect.value
                ]} generated successfully.`
            );

        }
    );


    /* =========================================
       REPORT HISTORY
    ========================================= */

    function loadReportHistory() {

        const data =
            safeParseStorage(
                "generatedReportHistory",
                []
            );


        return Array.isArray(
            data
        )
            ? data
            : [];

    }


    let reportHistory =
        loadReportHistory();


    function saveReportHistory() {

        const entry = {

            id:
                Date.now(),


            reportType:
                reportTypeSelect.value,


            reportName:

                REPORT_LABELS[
                    reportTypeSelect.value
                ],


            fromDate:
                reportFromDateInput.value,


            toDate:
                reportToDateInput.value,


            generatedBy:
                "Admin User",


            generatedAt:
                new Date()
                    .toISOString(),


            status:
                "Generated"

        };


        reportHistory.unshift(
            entry
        );


        reportHistory =
            reportHistory.slice(
                0,
                20
            );


        localStorage.setItem(
            "generatedReportHistory",
            JSON.stringify(
                reportHistory
            )
        );

    }


    function displayReportHistory() {

        reportHistoryBody.innerHTML =
            "";


        if (
            reportHistory.length ===
            0
        ) {

            reportHistoryBody.innerHTML = `

                <tr class="report-empty-row">

                    <td colspan="6">

                        No report has been generated yet.

                    </td>

                </tr>

            `;


            return;

        }


        reportHistory.forEach(
            function (
                report
            ) {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>

                        ${escapeHTML(
                            report.reportName
                        )}

                    </td>


                    <td>

                        ${formatDate(
                            report.fromDate
                        )}
                        –
                        ${formatDate(
                            report.toDate
                        )}

                    </td>


                    <td>

                        ${escapeHTML(
                            report.generatedBy
                        )}

                    </td>


                    <td>

                        ${formatDateTime(
                            report.generatedAt
                        )}

                    </td>


                    <td>

                        <span class="generated-status-badge">

                            Generated

                        </span>

                    </td>


                    <td>

                        <button
                            class="report-load-button"
                            type="button"
                            data-report-id="${report.id}"
                        >
                            Load
                        </button>

                    </td>

                `;


                reportHistoryBody.appendChild(
                    row
                );

            }
        );

    }


    reportHistoryBody.addEventListener(
        "click",
        function (
            event
        ) {

            const button =
                event.target.closest(
                    "button[data-report-id]"
                );


            if (!button) {

                return;

            }


            const id =
                Number(
                    button.dataset.reportId
                );


            const report =
                reportHistory.find(
                    function (
                        item
                    ) {

                        return (
                            Number(
                                item.id
                            )

                            ===

                            id
                        );

                    }
                );


            if (!report) {

                return;

            }


            reportTypeSelect.value =
                report.reportType;


            reportFromDateInput.value =
                report.fromDate;


            reportToDateInput.value =
                report.toDate;


            renderCurrentReport();


            window.scrollTo(
                {
                    top:
                        0,

                    behavior:
                        "smooth"
                }
            );

        }
    );


    /* =========================================
       MONTH HELPERS
    ========================================= */

    function getSixMonthPeriods(
        endDateValue
    ) {

        const end =
            new Date(
                `${endDateValue}T00:00:00`
            );


        const result =
            [];


        for (
            let offset = 5;
            offset >= 0;
            offset--
        ) {

            const date =
                new Date(
                    end.getFullYear(),
                    end.getMonth() - offset,
                    1
                );


            const year =
                date.getFullYear();


            const month =
                date.getMonth() + 1;


            const key =

                `${year}-${String(
                    month
                ).padStart(
                    2,
                    "0"
                )}`;


            const label =
                date.toLocaleDateString(
                    "en-US",
                    {
                        month:
                            "short"
                    }
                );


            result.push(
                {
                    key,
                    label
                }
            );

        }


        return result;

    }


    function getMonthlyTrendData() {

        const periods =
            getSixMonthPeriods(
                reportToDateInput.value
            );


        const salesValues =
            periods.map(
                function (
                    period
                ) {

                    return getSales()

                        .filter(
                            saleIsActive
                        )

                        .filter(
                            function (
                                sale
                            ) {

                                const date =
                                    recordDate(
                                        sale,
                                        [
                                            "saleDate",
                                            "invoiceDate",
                                            "date"
                                        ]
                                    );


                                return (
                                    date.slice(
                                        0,
                                        7
                                    )

                                    ===

                                    period.key
                                );

                            }
                        )

                        .reduce(
                            function (
                                total,
                                sale
                            ) {

                                return (
                                    total +
                                    getSaleAmount(
                                        sale
                                    )
                                );

                            },
                            0
                        );

                }
            );


        const purchaseValues =
            periods.map(
                function (
                    period
                ) {

                    return getPurchases()

                        .filter(
                            function (
                                purchase
                            ) {

                                const date =
                                    recordDate(
                                        purchase,
                                        [
                                            "purchaseDate",
                                            "date"
                                        ]
                                    );


                                return (
                                    date.slice(
                                        0,
                                        7
                                    )

                                    ===

                                    period.key
                                );

                            }
                        )

                        .reduce(
                            function (
                                total,
                                purchase
                            ) {

                                return (
                                    total +
                                    getPurchaseAmount(
                                        purchase
                                    )
                                );

                            },
                            0
                        );

                }
            );


        return {

            labels:

                periods.map(
                    function (
                        period
                    ) {

                        return period.label;

                    }
                ),


            salesValues,
            purchaseValues

        };

    }


    /* =========================================
       CANVAS
    ========================================= */

    function prepareCanvas(
        canvas
    ) {

        const rect =
            canvas.getBoundingClientRect();


        const ratio =
            window.devicePixelRatio ||
            1;


        canvas.width =
            Math.max(
                rect.width,
                300
            ) *
            ratio;


        canvas.height =
            Math.max(
                rect.height,
                220
            ) *
            ratio;


        const context =
            canvas.getContext(
                "2d"
            );


        context.setTransform(
            ratio,
            0,
            0,
            ratio,
            0,
            0
        );


        context.clearRect(
            0,
            0,
            rect.width,
            rect.height
        );


        return {

            context,
            width:
                rect.width,

            height:
                rect.height

        };

    }


    function compactMoney(
        value
    ) {

        const number =
            Number(
                value ||
                0
            );


        if (
            Math.abs(number) >=
            1000000
        ) {

            return (
                `৳${(
                    number /
                    1000000
                ).toFixed(
                    1
                )}M`
            );

        }


        if (
            Math.abs(number) >=
            1000
        ) {

            return (
                `৳${(
                    number /
                    1000
                ).toFixed(
                    1
                )}K`
            );

        }


        return (
            `৳${Math.round(
                number
            )}`
        );

    }


    /* =========================================
       LINE CHART
    ========================================= */

    function drawSalesTrend(
        labels,
        values
    ) {

        const {
            context,
            width,
            height
        } =
            prepareCanvas(
                salesTrendCanvas
            );


        const padding = {

            left:
                58,

            right:
                24,

            top:
                28,

            bottom:
                42

        };


        const chartWidth =

            width -
            padding.left -
            padding.right;


        const chartHeight =

            height -
            padding.top -
            padding.bottom;


        const maxValue =

            Math.max(
                ...values,
                1
            );


        context.font =
            "11px Arial";


        context.strokeStyle =
            "#e2e8e4";


        context.fillStyle =
            "#7d8981";


        context.lineWidth =
            1;


        const gridCount =
            4;


        for (
            let i = 0;
            i <= gridCount;
            i++
        ) {

            const y =

                padding.top +
                (
                    chartHeight /
                    gridCount
                ) *
                i;


            context.beginPath();

            context.moveTo(
                padding.left,
                y
            );

            context.lineTo(
                width -
                padding.right,
                y
            );

            context.stroke();


            const gridValue =

                maxValue *
                (
                    1 -
                    i /
                    gridCount
                );


            context.fillText(
                compactMoney(
                    gridValue
                ),
                5,
                y + 4
            );

        }


        const points =
            [];


        labels.forEach(
            function (
                label,
                index
            ) {

                const x =

                    labels.length ===
                    1

                        ?

                        padding.left +
                        chartWidth /
                        2

                        :

                        padding.left +
                        (
                            chartWidth /
                            (
                                labels.length -
                                1
                            )
                        ) *
                        index;


                const value =
                    values[index];


                const y =

                    padding.top +
                    chartHeight -
                    (
                        value /
                        maxValue
                    ) *
                    chartHeight;


                points.push(
                    {
                        x,
                        y
                    }
                );


                context.fillStyle =
                    "#78847c";


                context.textAlign =
                    "center";


                context.fillText(
                    label,
                    x,
                    height - 15
                );

            }
        );


        context.strokeStyle =
            "#15913a";


        context.lineWidth =
            3;


        context.beginPath();


        points.forEach(
            function (
                point,
                index
            ) {

                if (
                    index === 0
                ) {

                    context.moveTo(
                        point.x,
                        point.y
                    );

                }
                else {

                    context.lineTo(
                        point.x,
                        point.y
                    );

                }

            }
        );


        context.stroke();


        points.forEach(
            function (
                point,
                index
            ) {

                context.beginPath();

                context.arc(
                    point.x,
                    point.y,
                    4.5,
                    0,
                    Math.PI * 2
                );


                context.fillStyle =
                    "#ffffff";


                context.fill();


                context.lineWidth =
                    2.5;


                context.strokeStyle =
                    "#15913a";


                context.stroke();


                if (
                    values[index] >
                    0
                ) {

                    context.fillStyle =
                        "#435047";


                    context.font =
                        "10px Arial";


                    context.fillText(
                        compactMoney(
                            values[index]
                        ),
                        point.x,
                        point.y - 10
                    );

                }

            }
        );

    }


    /* =========================================
       GROUPED BAR CHART
    ========================================= */

    function drawCashFlowChart(
        labels,
        salesValues,
        purchaseValues
    ) {

        const {
            context,
            width,
            height
        } =
            prepareCanvas(
                cashFlowCanvas
            );


        const padding = {

            left:
                58,

            right:
                20,

            top:
                28,

            bottom:
                42

        };


        const chartWidth =

            width -
            padding.left -
            padding.right;


        const chartHeight =

            height -
            padding.top -
            padding.bottom;


        const maxValue =

            Math.max(
                ...salesValues,
                ...purchaseValues,
                1
            );


        const gridCount =
            4;


        context.font =
            "11px Arial";


        for (
            let i = 0;
            i <= gridCount;
            i++
        ) {

            const y =

                padding.top +
                (
                    chartHeight /
                    gridCount
                ) *
                i;


            context.strokeStyle =
                "#e2e8e4";


            context.lineWidth =
                1;


            context.beginPath();

            context.moveTo(
                padding.left,
                y
            );

            context.lineTo(
                width -
                padding.right,
                y
            );

            context.stroke();


            context.fillStyle =
                "#7c8780";


            context.textAlign =
                "left";


            context.fillText(

                compactMoney(

                    maxValue *
                    (
                        1 -
                        i /
                        gridCount
                    )

                ),

                5,
                y + 4

            );

        }


        const groupWidth =

            chartWidth /
            labels.length;


        const barWidth =

            Math.min(
                22,
                groupWidth *
                0.26
            );


        labels.forEach(
            function (
                label,
                index
            ) {

                const centerX =

                    padding.left +
                    groupWidth *
                    index +
                    groupWidth /
                    2;


                const saleHeight =

                    (
                        salesValues[index] /
                        maxValue
                    ) *
                    chartHeight;


                const purchaseHeight =

                    (
                        purchaseValues[index] /
                        maxValue
                    ) *
                    chartHeight;


                context.fillStyle =
                    "#15913a";


                context.fillRect(

                    centerX -
                    barWidth -
                    2,

                    padding.top +
                    chartHeight -
                    saleHeight,

                    barWidth,
                    saleHeight

                );


                context.fillStyle =
                    "#2c73b8";


                context.fillRect(

                    centerX +
                    2,

                    padding.top +
                    chartHeight -
                    purchaseHeight,

                    barWidth,
                    purchaseHeight

                );


                context.fillStyle =
                    "#78847c";


                context.font =
                    "11px Arial";


                context.textAlign =
                    "center";


                context.fillText(
                    label,
                    centerX,
                    height - 15
                );

            }
        );

    }


    /* =========================================
       DRAW CHARTS
    ========================================= */

    function drawCharts() {

        const data =
            getMonthlyTrendData();


        drawSalesTrend(
            data.labels,
            data.salesValues
        );


        drawCashFlowChart(
            data.labels,
            data.salesValues,
            data.purchaseValues
        );

    }


    /* =========================================
       CSV EXPORT
    ========================================= */

    function csvEscape(
        value
    ) {

        const text =
            String(
                value ??
                ""
            );


        return (

            `"${text.replace(
                /"/g,
                '""'
            )}"`

        );

    }


    exportCsvBtn.addEventListener(
        "click",
        function () {

            if (
                !currentReportRows.length
            ) {

                showToast(
                    "Generate a report before exporting.",
                    "error"
                );


                return;

            }


            const lines = [

                [
                    "Module",
                    "Metric",
                    "Value",
                    "Interpretation"
                ]

            ];


            currentReportRows.forEach(
                function (
                    row
                ) {

                    lines.push(
                        [
                            row.module,
                            row.metric,
                            row.value,
                            row.interpretation
                        ]
                    );

                }
            );


            const csv =
                lines

                    .map(
                        function (
                            line
                        ) {

                            return line
                                .map(
                                    csvEscape
                                )
                                .join(
                                    ","
                                );

                        }
                    )

                    .join(
                        "\n"
                    );


            const blob =
                new Blob(
                    [
                        "\uFEFF" +
                        csv
                    ],
                    {
                        type:
                            "text/csv;charset=utf-8;"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                url;


            link.download =

                `${reportTypeSelect.value}-report-${reportFromDateInput.value}-to-${reportToDateInput.value}.csv`;


            document.body.appendChild(
                link
            );


            link.click();


            link.remove();


            URL.revokeObjectURL(
                url
            );


            showToast(
                "CSV report exported successfully."
            );

        }
    );


    /* =========================================
       PRINT / SAVE PDF

       Uses browser print engine so user can
       choose "Save as PDF" without an extra
       paid library or backend.
    ========================================= */

    savePdfBtn.addEventListener(
        "click",
        function () {

            if (
                !currentReportRows.length
            ) {

                showToast(
                    "Generate a report before printing.",
                    "error"
                );


                return;

            }


            openPrintableReport();

        }
    );


    function openPrintableReport() {

        const printWindow =
            window.open(
                "",
                "_blank",
                "width=1000,height=800"
            );


        if (!printWindow) {

            showToast(
                "The print window was blocked by the browser.",
                "error"
            );


            return;

        }


        const title =
            REPORT_LABELS[
                reportTypeSelect.value
            ];


        const range =

            `${formatDate(
                reportFromDateInput.value
            )} – ${formatDate(
                reportToDateInput.value
            )}`;


        const tableRows =
            currentReportRows
                .map(
                    function (
                        row
                    ) {

                        return `

                            <tr>

                                <td>
                                    ${escapeHTML(
                                        row.module
                                    )}
                                </td>

                                <td>
                                    ${escapeHTML(
                                        row.metric
                                    )}
                                </td>

                                <td>
                                    ${escapeHTML(
                                        row.value
                                    )}
                                </td>

                                <td>
                                    ${escapeHTML(
                                        row.interpretation
                                    )}
                                </td>

                            </tr>

                        `;

                    }
                )
                .join(
                    ""
                );


        printWindow.document.write(`

            <!DOCTYPE html>

            <html>

            <head>

                <title>${escapeHTML(
                    title
                )}</title>

                <style>

                    body {
                        font-family: Arial, sans-serif;
                        padding: 32px;
                        color: #17231c;
                    }

                    h1 {
                        margin: 0;
                        font-size: 24px;
                    }

                    .subtitle {
                        margin-top: 5px;
                        color: #66726a;
                        font-size: 13px;
                    }

                    .system-name {
                        margin-top: 4px;
                        color: #148039;
                        font-size: 13px;
                        font-weight: 700;
                    }

                    .summary {
                        margin-top: 24px;
                        display: grid;
                        grid-template-columns:
                            repeat(4, 1fr);
                        gap: 10px;
                    }

                    .summary div {
                        border: 1px solid #d9e1dc;
                        border-radius: 7px;
                        padding: 12px;
                    }

                    .summary span {
                        display: block;
                        color: #6e7972;
                        font-size: 11px;
                    }

                    .summary strong {
                        display: block;
                        margin-top: 5px;
                        font-size: 15px;
                    }

                    .notice {
                        margin-top: 16px;
                        padding: 10px;
                        border: 1px solid #dce4df;
                        background: #f7faf8;
                        font-size: 11px;
                        line-height: 1.5;
                    }

                    table {
                        width: 100%;
                        margin-top: 24px;
                        border-collapse: collapse;
                        font-size: 11px;
                    }

                    th,
                    td {
                        border: 1px solid #d9e0dc;
                        padding: 9px;
                        text-align: left;
                        vertical-align: top;
                    }

                    th {
                        background: #f5f8f6;
                    }

                    footer {
                        margin-top: 25px;
                        color: #7b857f;
                        font-size: 10px;
                    }

                    @media print {

                        body {
                            padding: 10px;
                        }

                    }

                </style>

            </head>


            <body>

                <h1>
                    ${escapeHTML(
                        title
                    )}
                </h1>


                <div class="system-name">
                    Smart Rice Mill ERP &amp; Logistics Management System
                </div>


                <div class="subtitle">
                    ${escapeHTML(
                        range
                    )}
                </div>


                <div class="summary">

                    <div>
                        <span>Sales Revenue</span>
                        <strong>
                            ${escapeHTML(
                                formatMoney(
                                    currentMetrics.salesRevenue
                                )
                            )}
                        </strong>
                    </div>

                    <div>
                        <span>Procurement Cost</span>
                        <strong>
                            ${escapeHTML(
                                formatMoney(
                                    currentMetrics.purchaseCost
                                )
                            )}
                        </strong>
                    </div>

                    <div>
                        <span>Operating Balance</span>
                        <strong>
                            ${escapeHTML(
                                formatMoney(
                                    currentMetrics.operatingBalance
                                )
                            )}
                        </strong>
                    </div>

                    <div>
                        <span>Current Inventory</span>
                        <strong>
                            ${escapeHTML(
                                formatNumber(
                                    currentMetrics.currentInventoryTotal
                                )
                            )} kg
                        </strong>
                    </div>

                </div>


                <div class="notice">

                    Estimated Operating Balance =
                    Sales Revenue − Paddy Procurement Cost −
                    Operating Expenses − Salary Expense.

                    This is an operational ERP prototype indicator,
                    not a formal accounting profit or COGS statement.

                </div>


                <table>

                    <thead>

                        <tr>

                            <th>Module</th>

                            <th>Metric</th>

                            <th>Value</th>

                            <th>Interpretation</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${tableRows}

                    </tbody>

                </table>


                <footer>

                    Generated:
                    ${escapeHTML(
                        formatDateTime(
                            new Date()
                                .toISOString()
                        )
                    )}
                    · Generated by Admin User

                </footer>

            </body>

            </html>

        `);


        printWindow.document.close();


        printWindow.focus();


        setTimeout(
            function () {

                printWindow.print();

            },
            350
        );

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
                ".report-toast"
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
            `report-toast ${type}`;


        toast.innerHTML = `

            <span class="report-toast-icon">

                ${
                    type ===
                    "error"
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
            3000
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
       RESIZE CHARTS
    ========================================= */

    let resizeTimer =
        null;


    window.addEventListener(
        "resize",
        function () {

            if (
                window.innerWidth >
                1000
            ) {

                closeSidebar();

            }


            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(
                    function () {

                        drawCharts();

                    },
                    150
                );

        }
    );


    /* =========================================
       INITIALIZE
    ========================================= */

    reportFromDateInput.value =
        getMonthStartDate();


    reportToDateInput.value =
        getTodayDate();


    reportTypeSelect.value =
        "overall";


    renderCurrentReport();


    displayReportHistory();

});