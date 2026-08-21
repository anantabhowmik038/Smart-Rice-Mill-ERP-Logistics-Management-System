document.addEventListener("DOMContentLoaded", function () {
    const REPORT_LABELS = {
        overall: "Overall Management Report",
        procurement: "Procurement Report",
        quality: "Quality Report",
        production: "Production Report",
        inventory: "Inventory Report",
        sales: "Sales Report",
        delivery: "Delivery Report",
        financial: "Financial Operations Report",
        maintenance: "Maintenance Report"
    };

    const INVENTORY_PRODUCTS = {
        paddy: "Accepted Paddy",
        wholeRice: "Whole Rice",
        khud: "Khud / Broken Rice",
        tush: "Tush / Husk",
        bran: "Rice Bran"
    };

    const DEFAULT_SAFETY_STOCK = {
        paddy: 500,
        wholeRice: 300,
        khud: 50,
        tush: 100,
        bran: 50
    };

    const $ = (id) => document.getElementById(id);

    const reportFilterForm = $("reportFilterForm");

    if (!reportFilterForm) {
        return;
    }

    const reportTypeSelect = $("reportType");
    const reportFromDateInput = $("reportFromDate");
    const reportToDateInput = $("reportToDate");
    const selectedReportRange = $("selectedReportRange");

    const exportCsvBtn = $("exportCsvBtn");
    const savePdfBtn = $("savePdfBtn");

    const salesRevenueValue = $("salesRevenueValue");
    const salesInvoiceCount = $("salesInvoiceCount");

    const procurementCostValue = $("procurementCostValue");
    const purchaseCountValue = $("purchaseCountValue");

    const operatingBalanceValue = $("operatingBalanceValue");

    const currentInventoryValue = $("currentInventoryValue");
    const lowStockSummary = $("lowStockSummary");

    const recoveryRateValue = $("recoveryRateValue");
    const productionQuantityValue = $("productionQuantityValue");

    const qualityAcceptanceValue = $("qualityAcceptanceValue");
    const qualityInspectionValue = $("qualityInspectionValue");

    const customerDueValue = $("customerDueValue");
    const supplierDueValue = $("supplierDueValue");

    const deliveryCompletionValue = $("deliveryCompletionValue");
    const deliveryCountValue = $("deliveryCountValue");

    const maintenanceCountValue = $("maintenanceCountValue");
    const maintenanceCostValue = $("maintenanceCostValue");

    const reportResultTitle = $("reportResultTitle");
    const reportResultRange = $("reportResultRange");

    const reportTableBody = $("reportTableBody");
    const reportHistoryBody = $("reportHistoryBody");

    const salesTrendCanvas = $("salesTrendCanvas");
    const cashFlowCanvas = $("cashFlowCanvas");

    const menuButton = $("menuButton");
    const sidebar = $("sidebar");
    const sidebarBackdrop = $("sidebarBackdrop");

    let currentReportRows = [];
    let currentMetrics = null;


    /* =========================================
       STORAGE HELPERS
    ========================================== */

    function safeParseStorage(
        key,
        fallback = []
    ) {
        try {
            const raw =
                localStorage.getItem(
                    key
                );

            return raw === null
                ? fallback
                : (
                    JSON.parse(
                        raw
                    )
                    ??
                    fallback
                );
        }
        catch {
            return fallback;
        }
    }


    function firstNonEmptyArray(
        keys
    ) {
        let lastEmpty = [];

        for (
            const key of keys
        ) {
            const value =
                safeParseStorage(
                    key,
                    null
                );

            if (
                Array.isArray(
                    value
                )
            ) {
                if (
                    value.length
                ) {
                    return value;
                }

                lastEmpty =
                    value;
            }
        }

        return lastEmpty;
    }


    const getPurchases =
        () =>
            firstNonEmptyArray(
                [
                    "purchases",
                    "purchaseRecords"
                ]
            );


    const getQualityInspections =
        () =>
            firstNonEmptyArray(
                [
                    "qualityInspections",
                    "inspectionRecords"
                ]
            );


    const getProductions =
        () =>
            firstNonEmptyArray(
                [
                    "productionRecords",
                    "productions"
                ]
            );


    const getSales =
        () =>
            firstNonEmptyArray(
                [
                    "salesRecords",
                    "sales"
                ]
            );


    const getDeliveries =
        () =>
            firstNonEmptyArray(
                [
                    "deliveryRecords",
                    "deliveries"
                ]
            );


    const getMaintenanceRecords =
        () =>
            firstNonEmptyArray(
                [
                    "maintenanceRecords",
                    "machineMaintenanceRecords",
                    "maintenance"
                ]
            );


    const getAdjustments =
        () =>
            firstNonEmptyArray(
                [
                    "inventoryAdjustments"
                ]
            );


    function getExpenseRecords() {
        const result = [];


        firstNonEmptyArray(
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


        firstNonEmptyArray(
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
                        record.type
                        ||
                        record.category
                        ||
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
        const result = [];


        firstNonEmptyArray(
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


        firstNonEmptyArray(
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
                        record.type
                        ||
                        record.category
                        ||
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
       DATE / FORMAT HELPERS
    ========================================== */

    function localISODate(
        date = new Date()
    ) {
        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            )
            .padStart(
                2,
                "0"
            );

        const day =
            String(
                date.getDate()
            )
            .padStart(
                2,
                "0"
            );

        return (
            `${year}-${month}-${day}`
        );
    }


    function getTodayDate() {
        return localISODate(
            new Date()
        );
    }


    function getMonthStartDate() {
        const now =
            new Date();

        return (
            `${now.getFullYear()}-`
            +
            `${String(
                now.getMonth() + 1
            )
            .padStart(
                2,
                "0"
            )}-01`
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
            /^\d{4}-\d{2}-\d{2}/
                .test(
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


        return localISODate(
            parsed
        );
    }


    function recordDate(
        record,
        candidates
    ) {
        for (
            const key of candidates
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
        return Boolean(
            date
            &&
            date >= fromDate
            &&
            date <= toDate
        );
    }


    function formatDate(
        value
    ) {
        if (!value) {
            return "—";
        }


        return new Date(
            `${value}T00:00:00`
        )
        .toLocaleDateString(
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
        )
        .toLocaleString(
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


    function numberValue(
        ...values
    ) {
        for (
            const value of values
        ) {
            if (
                value === null
                ||
                value === undefined
                ||
                value === ""
            ) {
                continue;
            }


            const number =
                Number(
                    String(
                        value
                    )
                    .replace(
                        /[৳,\s]/g,
                        ""
                    )
                );


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


    function formatNumber(
        value
    ) {
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
            `${sign}৳`
            +
            Math.abs(
                number
            )
            .toLocaleString(
                "en-US",
                {
                    maximumFractionDigits:
                        2
                }
            )
        );
    }


    function formatPercentage(
        value
    ) {
        if (
            value === null
            ||
            value === undefined
            ||
            !Number.isFinite(
                Number(
                    value
                )
            )
        ) {
            return "—";
        }


        return (
            `${Number(
                value
            )
            .toFixed(
                2
            )}%`
        );
    }


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
       PURCHASE
    ========================================== */

    function getPurchaseAmount(
        purchase
    ) {
        const stored =
            numberValue(
                purchase.totalPurchaseAmount,
                purchase.totalAmount,
                purchase.purchaseAmount,
                purchase.amount,
                purchase.total
            );


        if (
            stored > 0
        ) {
            return stored;
        }


        return (
            numberValue(
                purchase.weight,
                purchase.paddyWeight,
                purchase.quantityKg,
                purchase.quantity
            )
            *
            numberValue(
                purchase.pricePerKg,
                purchase.price
            )
        );
    }


    function getPurchaseWeight(
        purchase
    ) {
        return numberValue(
            purchase.weight,
            purchase.paddyWeight,
            purchase.quantityKg,
            purchase.quantity
        );
    }


    function getPurchaseDue(
        purchase
    ) {
        const explicit =
            numberValue(
                purchase.remainingDue,
                purchase.dueAmount,
                purchase.due,
                purchase.balanceDue
            );


        if (
            explicit > 0
        ) {
            return explicit;
        }


        const status =
            String(
                purchase.paymentStatus
                ||
                ""
            )
            .toLowerCase();


        if (
            status.includes(
                "paid"
            )
            &&
            !status.includes(
                "partial"
            )
        ) {
            return 0;
        }


        return Math.max(
            0,

            getPurchaseAmount(
                purchase
            )
            -
            numberValue(
                purchase.paidAmount,
                purchase.amountPaid
            )
        );
    }


    /* =========================================
       PRODUCTION
    ========================================== */

    function getProductionInput(
        record
    ) {
        return numberValue(
            record.inputPaddy,
            record.paddyInput,
            record.inputPaddyQuantity
        );
    }


    function getWholeRiceOutput(
        record
    ) {
        return numberValue(
            record.riceProduced,
            record.wholeRiceProduced,
            record.rice,
            record.wholeRice
        );
    }


    function getKhudOutput(
        record
    ) {
        return numberValue(
            record.khudProduced,
            record.khud,
            record.brokenRice
        );
    }


    function getTushOutput(
        record
    ) {
        return numberValue(
            record.tushProduced,
            record.tush,
            record.husk
        );
    }


    function getBranOutput(
        record
    ) {
        return numberValue(
            record.branProduced,
            record.riceBranProduced,
            record.bran
        );
    }


    /* =========================================
       SALES
    ========================================== */

    function saleIsActive(
        sale
    ) {
        const status =
            String(
                sale.status
                ||
                ""
            )
            .toLowerCase();


        return ![
            "voided",
            "void",
            "cancelled"
        ]
        .includes(
            status
        );
    }


    function getSaleAmount(
        sale
    ) {
        return numberValue(
            sale.totalAmount,
            sale.invoiceAmount,
            sale.salesAmount,
            sale.amount,
            sale.total
        );
    }


    function getSaleDue(
        sale
    ) {
        const explicit =
            numberValue(
                sale.remainingDue,
                sale.dueAmount,
                sale.due,
                sale.balanceDue
            );


        if (
            explicit > 0
        ) {
            return explicit;
        }


        const status =
            String(
                sale.paymentStatus
                ||
                ""
            )
            .toLowerCase();


        if (
            status.includes(
                "paid"
            )
            &&
            !status.includes(
                "partial"
            )
        ) {
            return 0;
        }


        return Math.max(
            0,

            getSaleAmount(
                sale
            )
            -
            numberValue(
                sale.amountPaid,
                sale.paidAmount
            )
        );
    }


    function getSaleQuantityKg(
        sale
    ) {
        let quantity =
            numberValue(
                sale.quantityKg,
                sale.weightKg
            );


        if (
            quantity > 0
        ) {
            return quantity;
        }


        const unit =
            String(
                sale.unit
                ||
                ""
            )
            .toLowerCase();


        if (
            [
                "kg",
                "kilogram",
                "kilograms"
            ]
            .includes(
                unit
            )
        ) {
            quantity =
                numberValue(
                    sale.quantity,
                    sale.weight
                );


            if (
                quantity > 0
            ) {
                return quantity;
            }
        }


        const bagWeight =
            numberValue(
                sale.bagWeightKg
            );


        if (
            bagWeight > 0
        ) {
            return (
                bagWeight
                *
                numberValue(
                    sale.quantity,
                    sale.bags
                )
            );
        }


        return numberValue(
            sale.quantity
        );
    }


    /* =========================================
       EXPENSE / MAINTENANCE
    ========================================== */

    function getFinancialRecordAmount(
        record
    ) {
        return numberValue(
            record.amount,
            record.totalAmount,
            record.cost,
            record.salary,
            record.netSalary
        );
    }


    function getMaintenanceCost(
        record
    ) {
        return numberValue(
            record.cost,
            record.maintenanceCost,
            record.totalCost,
            record.amount
        );
    }


    /* =========================================
       PRODUCT NORMALIZATION
    ========================================== */

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
       INVENTORY
    ========================================== */

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


        const acceptedIds =
            new Set(
                getQualityInspections()
                    .filter(
                        function (
                            item
                        ) {
                            return (
                                String(
                                    item.decision
                                    ||
                                    item.status
                                    ||
                                    ""
                                )
                                .toLowerCase()
                                ===
                                "accepted"
                            );
                        }
                    )
                    .map(
                        function (
                            item
                        ) {
                            return String(
                                item.purchaseId
                            );
                        }
                    )
            );


        getPurchases()
            .forEach(
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


        getProductions()
            .forEach(
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
                            sale.productKey
                            ||
                            sale.product
                            ||
                            sale.productType
                            ||
                            sale.item
                            ||
                            sale.riceType
                        );


                    if (
                        !product
                        ||
                        product ===
                        "paddy"
                    ) {
                        return;
                    }


                    state[product] -=
                        getSaleQuantityKg(
                            sale
                        );
                }
            );


        getAdjustments()
            .forEach(
                function (
                    adjustment
                ) {
                    const product =
                        normalizeProductKey(
                            adjustment.product
                        );


                    if (
                        !product
                    ) {
                        return;
                    }


                    const quantity =
                        numberValue(
                            adjustment.quantity
                        );


                    state[product] +=
                        adjustment.type ===
                        "out"

                            ?

                            -quantity

                            :

                            quantity;
                }
            );


        return state;
    }


    function getSafetyStock() {
        const stored =
            safeParseStorage(
                "inventorySafetyStock",
                {}
            );


        return {
            ...DEFAULT_SAFETY_STOCK,

            ...(
                stored
                &&
                typeof stored ===
                "object"
                &&
                !Array.isArray(
                    stored
                )

                    ?

                    stored

                    :

                    {}
            )
        };
    }


    /* =========================================
       CALCULATE METRICS
    ========================================== */

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
                    sum,
                    item
                ) {
                    return (
                        sum
                        +
                        getPurchaseAmount(
                            item
                        )
                    );
                },
                0
            );


        const purchaseWeight =
            periodPurchases.reduce(
                function (
                    sum,
                    item
                ) {
                    return (
                        sum
                        +
                        getPurchaseWeight(
                            item
                        )
                    );
                },
                0
            );


        const supplierDue =
            purchases.reduce(
                function (
                    sum,
                    item
                ) {
                    return (
                        sum
                        +
                        getPurchaseDue(
                            item
                        )
                    );
                },
                0
            );


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
                    sum,
                    item
                ) {
                    return (
                        sum
                        +
                        getSaleAmount(
                            item
                        )
                    );
                },
                0
            );


        const customerDue =
            activeSales.reduce(
                function (
                    sum,
                    item
                ) {
                    return (
                        sum
                        +
                        getSaleDue(
                            item
                        )
                    );
                },
                0
            );


        const periodInspections =
            getQualityInspections()
                .filter(
                    function (
                        item
                    ) {
                        return dateIsWithinRange(

                            recordDate(
                                item,
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
                    item
                ) {
                    return (
                        String(
                            item.decision
                            ||
                            ""
                        )
                        .toLowerCase()
                        ===
                        "accepted"
                    );
                }
            )
            .length;


        const rejectedInspections =
            periodInspections.filter(
                function (
                    item
                ) {
                    return (
                        String(
                            item.decision
                            ||
                            ""
                        )
                        .toLowerCase()
                        ===
                        "rejected"
                    );
                }
            )
            .length;


        const qualityAcceptanceRate =
            periodInspections.length

                ?

                (
                    acceptedInspections
                    /
                    periodInspections.length
                )
                *
                100

                :

                null;


        const periodProductions =
            getProductions()
                .filter(
                    function (
                        item
                    ) {
                        return dateIsWithinRange(

                            recordDate(
                                item,
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
                    sum,
                    item
                ) {
                    return (
                        sum
                        +
                        getProductionInput(
                            item
                        )
                    );
                },
                0
            );


        const wholeRiceProduced =
            periodProductions.reduce(
                function (
                    sum,
                    item
                ) {
                    return (
                        sum
                        +
                        getWholeRiceOutput(
                            item
                        )
                    );
                },
                0
            );


        const khudProduced =
            periodProductions.reduce(
                function (
                    sum,
                    item
                ) {
                    return (
                        sum
                        +
                        getKhudOutput(
                            item
                        )
                    );
                },
                0
            );


        const tushProduced =
            periodProductions.reduce(
                function (
                    sum,
                    item
                ) {
                    return (
                        sum
                        +
                        getTushOutput(
                            item
                        )
                    );
                },
                0
            );


        const branProduced =
            periodProductions.reduce(
                function (
                    sum,
                    item
                ) {
                    return (
                        sum
                        +
                        getBranOutput(
                            item
                        )
                    );
                },
                0
            );


        const recoveryRate =
            productionInput

                ?

                (
                    wholeRiceProduced
                    /
                    productionInput
                )
                *
                100

                :

                null;


        const periodExpenses =
            getExpenseRecords()
                .filter(
                    function (
                        item
                    ) {
                        return dateIsWithinRange(

                            recordDate(
                                item,
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
                    sum,
                    item
                ) {
                    return (
                        sum
                        +
                        getFinancialRecordAmount(
                            item
                        )
                    );
                },
                0
            );


        const periodSalaries =
            getSalaryRecords()
                .filter(
                    function (
                        item
                    ) {
                        return dateIsWithinRange(

                            recordDate(
                                item,
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
                    sum,
                    item
                ) {
                    return (
                        sum
                        +
                        getFinancialRecordAmount(
                            item
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


        const periodDeliveries =
            getDeliveries()
                .filter(
                    function (
                        item
                    ) {
                        return dateIsWithinRange(

                            recordDate(
                                item,
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
                    item
                ) {
                    return (
                        String(
                            item.status
                            ||
                            item.deliveryStatus
                            ||
                            ""
                        )
                        .toLowerCase()
                        ===
                        "delivered"
                    );
                }
            )
            .length;


        const cancelledDeliveries =
            periodDeliveries.filter(
                function (
                    item
                ) {
                    return (
                        String(
                            item.status
                            ||
                            item.deliveryStatus
                            ||
                            ""
                        )
                        .toLowerCase()
                        ===
                        "cancelled"
                    );
                }
            )
            .length;


        const validDeliveryCount =
            periodDeliveries.length
            -
            cancelledDeliveries;


        const deliveryCompletionRate =
            validDeliveryCount

                ?

                (
                    deliveredCount
                    /
                    validDeliveryCount
                )
                *
                100

                :

                null;


        const totalRoadDistance =
            periodDeliveries.reduce(
                function (
                    sum,
                    item
                ) {
                    return (
                        sum
                        +
                        numberValue(
                            item.distanceKm,
                            item.roadDistance
                        )
                    );
                },
                0
            );


        const periodMaintenance =
            getMaintenanceRecords()
                .filter(
                    function (
                        item
                    ) {
                        return dateIsWithinRange(

                            recordDate(
                                item,
                                [
                                    "maintenanceDate",
                                    "serviceDate",
                                    "lastServiceDate",
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
                    sum,
                    item
                ) {
                    return (
                        sum
                        +
                        getMaintenanceCost(
                            item
                        )
                    );
                },
                0
            );


        const inventory =
            calculateCurrentInventory();


        const safetyStock =
            getSafetyStock();


        const currentInventoryTotal =
            Object.values(
                inventory
            )
            .reduce(
                function (
                    sum,
                    quantity
                ) {
                    return (
                        sum
                        +
                        Number(
                            quantity || 0
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
                        inventory[key]
                        ||
                        0
                    )
                    <=
                    Number(
                        safetyStock[key]
                        ||
                        0
                    )
                ) {
                    lowStockCount++;
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
    ========================================== */

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
            metrics.operatingBalance < 0
                ? "#c23939"
                : "#16833a";


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
            metrics.productionCount

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
       REPORT ROWS
    ========================================== */

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


    function buildReportRows(
        type,
        metrics
    ) {
        const rows = [];


        const addProcurement =
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


        const addQuality =
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
                        "Accepted inspections / total inspections x 100."
                    )

                );
            };


        const addProduction =
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
                        "Whole rice output / paddy input x 100."
                    )

                );
            };


        const addInventory =
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
                                metrics.inventory[key]
                                ||
                                0
                            );


                        const threshold =
                            Number(
                                metrics.safetyStock[key]
                                ||
                                0
                            );


                        const isLow =
                            quantity <=
                            threshold;


                        rows.push(

                            createReportRow(
                                "Inventory",

                                INVENTORY_PRODUCTS[key],

                                `${formatNumber(
                                    quantity
                                )} kg`,

                                `Safety stock: ${formatNumber(
                                    threshold
                                )} kg - ${
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


        const addSales =
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


        const addDelivery =
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
                        "Delivered / non-cancelled delivery records x 100."
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


        const addFinancial =
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
                        "Sales - Procurement - Operating Expenses - Salary. Operational estimate only; not formal accounting profit.",
                        metrics.operatingBalance < 0
                            ? "negative"
                            : "positive"
                    )

                );
            };


        const addMaintenance =
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


        const reportFunctions = {
            procurement:
                addProcurement,

            quality:
                addQuality,

            production:
                addProduction,

            inventory:
                addInventory,

            sales:
                addSales,

            delivery:
                addDelivery,

            financial:
                addFinancial,

            maintenance:
                addMaintenance
        };


        if (
            type ===
            "overall"
        ) {
            addProcurement();

            addQuality();

            addProduction();

            addInventory();

            addSales();

            addDelivery();

            addFinancial();

            addMaintenance();
        }
        else if (
            reportFunctions[type]
        ) {
            reportFunctions[type]();
        }


        return rows;
    }


    function displayReportRows(
        rows
    ) {
        reportTableBody.innerHTML =
            "";


        if (
            !rows.length
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
                const tableRow =
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


                if (
                    row.tone ===
                    "warning"
                ) {
                    valueClass +=
                        " report-warning-value";
                }


                if (
                    row.tone ===
                    "negative"
                ) {
                    valueClass +=
                        " report-negative-value";
                }


                tableRow.innerHTML = `

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


                reportTableBody
                    .appendChild(
                        tableRow
                    );
            }
        );
    }


    /* =========================================
       REPORT RENDERING
    ========================================== */

    function validateFilter() {
        const fromDate =
            reportFromDateInput.value;


        const toDate =
            reportToDateInput.value;


        if (
            !fromDate
            ||
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


    function renderCurrentReport() {
        const error =
            validateFilter();


        if (
            error
        ) {
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
            REPORT_LABELS[type]
            ||
            REPORT_LABELS.overall;


        const range =
            `${formatDate(
                fromDate
            )} – ${formatDate(
                toDate
            )}`;


        selectedReportRange.textContent =
            `${title} · ${range}`;


        reportResultTitle.textContent =
            title;


        reportResultRange.textContent =
            range;


        updateKpis(
            currentMetrics
        );


        displayReportRows(
            currentReportRows
        );


        drawCharts();


        return true;
    }


    reportFilterForm
        .addEventListener(
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
                    `${
                        REPORT_LABELS[
                            reportTypeSelect.value
                        ]
                    } generated successfully.`
                );
            }
        );


    /* =========================================
       REPORT HISTORY
    ========================================== */

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
        reportHistory.unshift(
            {
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
            }
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
            !reportHistory.length
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

                        ${escapeHTML(
                            formatDate(
                                report.fromDate
                            )
                        )}

                        –

                        ${escapeHTML(
                            formatDate(
                                report.toDate
                            )
                        )}

                    </td>

                    <td>
                        ${escapeHTML(
                            report.generatedBy
                            ||
                            "Admin User"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            formatDateTime(
                                report.generatedAt
                            )
                        )}
                    </td>

                    <td>

                        <span class="report-history-status">

                            ${escapeHTML(
                                report.status
                                ||
                                "Generated"
                            )}

                        </span>

                    </td>

                    <td>

                        <button
                            type="button"
                            class="report-history-view-button"
                            data-report-id="${escapeHTML(
                                report.id
                            )}"
                        >
                            View
                        </button>

                    </td>

                `;


                reportHistoryBody
                    .appendChild(
                        row
                    );
            }
        );
    }


    reportHistoryBody
        .addEventListener(
            "click",
            function (
                event
            ) {
                const button =
                    event.target.closest(
                        "[data-report-id]"
                    );


                if (
                    !button
                ) {
                    return;
                }


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
                                Number(
                                    button.dataset.reportId
                                )
                            );
                        }
                    );


                if (
                    !report
                ) {
                    return;
                }


                reportTypeSelect.value =
                    report.reportType
                    ||
                    "overall";


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
       CSV EXPORT
    ========================================== */

    function csvEscape(
        value
    ) {
        return (
            `"${String(
                value ?? ""
            )
            .replace(
                /"/g,
                '""'
            )}"`
        );
    }


    function downloadBlob(
        content,
        mimeType,
        fileName
    ) {
        const blob =
            new Blob(
                [
                    content
                ],
                {
                    type:
                        mimeType
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
            fileName;


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        setTimeout(
            function () {
                URL.revokeObjectURL(
                    url
                );
            },
            500
        );
    }


    exportCsvBtn
        .addEventListener(
            "click",
            function () {
                if (
                    !renderCurrentReport()
                ) {
                    return;
                }


                if (
                    !currentReportRows.length
                ) {
                    showToast(
                        "Generate a report before exporting.",
                        "error"
                    );


                    return;
                }


                const rows = [

                    [
                        "Module",
                        "Metric",
                        "Value",
                        "Interpretation"
                    ],

                    ...currentReportRows.map(
                        function (
                            row
                        ) {
                            return [
                                row.module,
                                row.metric,
                                row.value,
                                row.interpretation
                            ];
                        }
                    )

                ];


                const csv =
                    "\uFEFF"
                    +
                    rows
                        .map(
                            function (
                                row
                            ) {
                                return row
                                    .map(
                                        csvEscape
                                    )
                                    .join(
                                        ","
                                    );
                            }
                        )
                        .join(
                            "\r\n"
                        );


                const fileName =
                    `${reportTypeSelect.value}-report-${reportFromDateInput.value}-to-${reportToDateInput.value}.csv`;


                downloadBlob(
                    csv,
                    "text/csv;charset=utf-8",
                    fileName
                );


                showToast(
                    "CSV report exported successfully."
                );
            }
        );


    /* =========================================
       CHART DATA
    ========================================== */

    function getLastMonths(
        endDateValue,
        count = 6
    ) {
        const end =
            new Date(
                `${endDateValue}T00:00:00`
            );


        const months = [];


        for (
            let index =
                count - 1;

            index >= 0;

            index--
        ) {
            const date =
                new Date(
                    end.getFullYear(),
                    end.getMonth() - index,
                    1
                );


            const last =
                new Date(
                    date.getFullYear(),
                    date.getMonth() + 1,
                    0
                );


            months.push(
                {
                    label:
                        date.toLocaleDateString(
                            "en-US",
                            {
                                month:
                                    "short"
                            }
                        ),

                    start:
                        localISODate(
                            date
                        ),

                    end:
                        localISODate(
                            last
                        )
                }
            );
        }


        return months;
    }


    function monthlyAmount(
        records,
        month,
        dateFields,
        amountGetter,
        filterFunction =
            function () {
                return true;
            }
    ) {
        return records
            .filter(
                filterFunction
            )
            .reduce(
                function (
                    sum,
                    record
                ) {
                    const date =
                        recordDate(
                            record,
                            dateFields
                        );


                    return dateIsWithinRange(
                        date,
                        month.start,
                        month.end
                    )

                        ?

                        sum
                        +
                        amountGetter(
                            record
                        )

                        :

                        sum;
                },
                0
            );
    }


    function resizeCanvas(
        canvas,
        height = 220
    ) {
        if (
            !canvas
        ) {
            return null;
        }


        const ratio =
            window.devicePixelRatio
            ||
            1;


        const width =
            Math.max(
                320,

                canvas.parentElement
                    ?.clientWidth
                ||
                600
            );


        canvas.width =
            Math.floor(
                width
                *
                ratio
            );


        canvas.height =
            Math.floor(
                height
                *
                ratio
            );


        canvas.style.width =
            `${width}px`;


        canvas.style.height =
            `${height}px`;


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


        return {
            ctx:
                context,

            width,

            height
        };
    }


    function drawLineChart(
        canvas,
        labels,
        values
    ) {
        const setup =
            resizeCanvas(
                canvas
            );


        if (
            !setup
        ) {
            return;
        }


        const {
            ctx,
            width,
            height
        } = setup;


        const padding = {
            left:
                52,

            right:
                18,

            top:
                20,

            bottom:
                38
        };


        const chartWidth =
            width
            -
            padding.left
            -
            padding.right;


        const chartHeight =
            height
            -
            padding.top
            -
            padding.bottom;


        const maximum =
            Math.max(
                ...values,
                1
            );


        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        ctx.font =
            "11px Arial";


        ctx.fillStyle =
            "#66726a";


        ctx.strokeStyle =
            "#dfe6e2";


        ctx.lineWidth =
            1;


        for (
            let index =
                0;

            index <=
                4;

            index++
        ) {
            const y =
                padding.top
                +
                (
                    chartHeight
                    /
                    4
                )
                *
                index;


            const value =
                maximum
                -
                (
                    maximum
                    /
                    4
                )
                *
                index;


            ctx.beginPath();


            ctx.moveTo(
                padding.left,
                y
            );


            ctx.lineTo(
                width
                -
                padding.right,
                y
            );


            ctx.stroke();


            ctx.fillText(
                formatNumber(
                    value
                ),
                4,
                y + 4
            );
        }


        const points =
            values.map(
                function (
                    value,
                    index
                ) {
                    return {
                        x:
                            padding.left
                            +
                            (
                                labels.length ===
                                1

                                    ?

                                    chartWidth
                                    /
                                    2

                                    :

                                    (
                                        chartWidth
                                        /
                                        (
                                            labels.length
                                            -
                                            1
                                        )
                                    )
                                    *
                                    index
                            ),

                        y:
                            padding.top
                            +
                            chartHeight
                            -
                            (
                                value
                                /
                                maximum
                            )
                            *
                            chartHeight
                    };
                }
            );


        ctx.strokeStyle =
            "#16833a";


        ctx.lineWidth =
            2.5;


        ctx.beginPath();


        points.forEach(
            function (
                point,
                index
            ) {
                if (
                    index ===
                    0
                ) {
                    ctx.moveTo(
                        point.x,
                        point.y
                    );
                }
                else {
                    ctx.lineTo(
                        point.x,
                        point.y
                    );
                }
            }
        );


        ctx.stroke();


        points.forEach(
            function (
                point,
                index
            ) {
                ctx.fillStyle =
                    "#16833a";


                ctx.beginPath();


                ctx.arc(
                    point.x,
                    point.y,
                    4,
                    0,
                    Math.PI * 2
                );


                ctx.fill();


                ctx.fillStyle =
                    "#66726a";


                ctx.textAlign =
                    "center";


                ctx.fillText(
                    labels[index],
                    point.x,
                    height - 12
                );
            }
        );


        ctx.textAlign =
            "start";
    }


    function drawComparisonChart(
        canvas,
        labels,
        salesValues,
        purchaseValues
    ) {
        const setup =
            resizeCanvas(
                canvas
            );


        if (
            !setup
        ) {
            return;
        }


        const {
            ctx,
            width,
            height
        } = setup;


        const padding = {
            left:
                52,

            right:
                18,

            top:
                20,

            bottom:
                38
        };


        const chartWidth =
            width
            -
            padding.left
            -
            padding.right;


        const chartHeight =
            height
            -
            padding.top
            -
            padding.bottom;


        const maximum =
            Math.max(
                ...salesValues,
                ...purchaseValues,
                1
            );


        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        ctx.font =
            "11px Arial";


        ctx.fillStyle =
            "#66726a";


        ctx.strokeStyle =
            "#dfe6e2";


        for (
            let index =
                0;

            index <=
                4;

            index++
        ) {
            const y =
                padding.top
                +
                (
                    chartHeight
                    /
                    4
                )
                *
                index;


            ctx.beginPath();


            ctx.moveTo(
                padding.left,
                y
            );


            ctx.lineTo(
                width
                -
                padding.right,
                y
            );


            ctx.stroke();
        }


        const groupWidth =
            chartWidth
            /
            labels.length;


        const barWidth =
            Math.min(
                22,
                groupWidth
                *
                0.25
            );


        labels.forEach(
            function (
                label,
                index
            ) {
                const center =
                    padding.left
                    +
                    groupWidth
                    *
                    index
                    +
                    groupWidth
                    /
                    2;


                const salesHeight =
                    (
                        salesValues[index]
                        /
                        maximum
                    )
                    *
                    chartHeight;


                const purchaseHeight =
                    (
                        purchaseValues[index]
                        /
                        maximum
                    )
                    *
                    chartHeight;


                ctx.fillStyle =
                    "#16833a";


                ctx.fillRect(
                    center
                    -
                    barWidth
                    -
                    2,

                    padding.top
                    +
                    chartHeight
                    -
                    salesHeight,

                    barWidth,

                    salesHeight
                );


                ctx.fillStyle =
                    "#2f76b7";


                ctx.fillRect(
                    center
                    +
                    2,

                    padding.top
                    +
                    chartHeight
                    -
                    purchaseHeight,

                    barWidth,

                    purchaseHeight
                );


                ctx.fillStyle =
                    "#66726a";


                ctx.textAlign =
                    "center";


                ctx.fillText(
                    label,
                    center,
                    height - 12
                );
            }
        );


        ctx.textAlign =
            "start";
    }


    function drawCharts() {
        if (
            !reportToDateInput.value
        ) {
            return;
        }


        const months =
            getLastMonths(
                reportToDateInput.value,
                6
            );


        const salesValues =
            months.map(
                function (
                    month
                ) {
                    return monthlyAmount(
                        getSales(),
                        month,
                        [
                            "saleDate",
                            "invoiceDate",
                            "date"
                        ],
                        getSaleAmount,
                        saleIsActive
                    );
                }
            );


        const purchaseValues =
            months.map(
                function (
                    month
                ) {
                    return monthlyAmount(
                        getPurchases(),
                        month,
                        [
                            "purchaseDate",
                            "date"
                        ],
                        getPurchaseAmount
                    );
                }
            );


        const labels =
            months.map(
                function (
                    month
                ) {
                    return month.label;
                }
            );


        drawLineChart(
            salesTrendCanvas,
            labels,
            salesValues
        );


        drawComparisonChart(
            cashFlowCanvas,
            labels,
            salesValues,
            purchaseValues
        );
    }


    /* =========================================
       DIRECT PDF EXPORT
       jsPDF 2.5.1
       NO PRINT DIALOG
       NO html2pdf
       NO hidden HTML capture
    ========================================== */

    let jsPdfLoadingPromise =
        null;


    function loadExternalScript(
        src
    ) {
        return new Promise(
            function (
                resolve,
                reject
            ) {
                const existing =
                    document.querySelector(
                        `script[src="${src}"]`
                    );


                if (
                    existing
                ) {
                    if (
                        existing.dataset.loaded ===
                        "true"
                    ) {
                        resolve();

                        return;
                    }


                    if (
                        window.jspdf
                        &&
                        typeof window.jspdf.jsPDF ===
                        "function"
                    ) {
                        resolve();

                        return;
                    }


                    existing.addEventListener(
                        "load",
                        resolve,
                        {
                            once:
                                true
                        }
                    );


                    existing.addEventListener(
                        "error",
                        reject,
                        {
                            once:
                                true
                        }
                    );


                    return;
                }


                const script =
                    document.createElement(
                        "script"
                    );


                script.src =
                    src;


                script.async =
                    true;


                script.addEventListener(
                    "load",
                    function () {
                        script.dataset.loaded =
                            "true";


                        resolve();
                    },
                    {
                        once:
                            true
                    }
                );


                script.addEventListener(
                    "error",
                    reject,
                    {
                        once:
                            true
                    }
                );


                document.head.appendChild(
                    script
                );
            }
        );
    }


    async function ensureJsPdfLoaded() {
        if (
            window.jspdf
            &&
            typeof window.jspdf.jsPDF ===
            "function"
        ) {
            return;
        }


        if (
            !jsPdfLoadingPromise
        ) {
            jsPdfLoadingPromise =
                loadExternalScript(
                    "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
                )
                .then(
                    function () {
                        if (
                            !window.jspdf
                            ||
                            typeof window.jspdf.jsPDF !==
                            "function"
                        ) {
                            throw new Error(
                                "jsPDF failed to initialize."
                            );
                        }
                    }
                );
        }


        await jsPdfLoadingPromise;
    }


    function toPdfText(
        value
    ) {
        return String(
            value ?? ""
        )
        .replace(
            /৳/g,
            "BDT "
        )
        .replace(
            /[–—−]/g,
            "-"
        )
        .replace(
            /÷/g,
            "/"
        )
        .replace(
            /×/g,
            "x"
        )
        .replace(
            /[“”]/g,
            "\""
        )
        .replace(
            /[‘’]/g,
            "'"
        )
        .replace(
            /·/g,
            "-"
        );
    }


    function addPdfPageHeader(
        doc,
        title,
        range,
        continuation =
            false
    ) {
        doc.setTextColor(
            23,
            35,
            28
        );


        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.setFontSize(
            continuation
                ? 13
                : 18
        );


        doc.text(
            toPdfText(
                title
            ),
            14,
            continuation
                ? 15
                : 17
        );


        doc.setFont(
            "helvetica",
            "normal"
        );


        doc.setTextColor(
            22,
            131,
            58
        );


        doc.setFontSize(
            9.5
        );


        doc.text(
            "Smart Rice Mill ERP & Logistics Management System",
            14,
            continuation
                ? 21
                : 24
        );


        doc.setTextColor(
            100,
            114,
            106
        );


        doc.setFontSize(
            8.5
        );


        doc.text(
            toPdfText(
                range
            ),
            14,
            continuation
                ? 27
                : 30
        );


        doc.setDrawColor(
            220,
            228,
            223
        );


        doc.line(
            14,
            continuation
                ? 31
                : 34,

            196,

            continuation
                ? 31
                : 34
        );


        return continuation
            ? 37
            : 40;
    }


    function drawPdfCard(
        doc,
        x,
        y,
        width,
        height,
        label,
        value,
        valueColor =
            [
                23,
                35,
                28
            ]
    ) {
        doc.setFillColor(
            249,
            252,
            250
        );


        doc.setDrawColor(
            220,
            228,
            223
        );


        doc.roundedRect(
            x,
            y,
            width,
            height,
            2,
            2,
            "FD"
        );


        doc.setFont(
            "helvetica",
            "normal"
        );


        doc.setTextColor(
            105,
            118,
            110
        );


        doc.setFontSize(
            7.5
        );


        doc.text(
            toPdfText(
                label
            ),
            x + 3,
            y + 5
        );


        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.setTextColor(
            ...valueColor
        );


        doc.setFontSize(
            10.5
        );


        doc.text(
            toPdfText(
                value
            ),
            x + 3,
            y + 12
        );
    }


    function canvasToDataUrl(
        canvas
    ) {
        try {
            if (
                !canvas
                ||
                !canvas.width
                ||
                !canvas.height
            ) {
                return "";
            }


            return canvas.toDataURL(
                "image/png",
                1
            );
        }
        catch {
            return "";
        }
    }


    /* =========================================
       FIXED PDF TABLE HEADER

       White background is used intentionally.
       Each cell resets drawing/text state so
       Metric / Value / Interpretation can never
       inherit a dark fill from another PDF item.
    ========================================== */

    function drawPdfTableHeader(
        doc,
        y,
        widths
    ) {
        const startX =
            14;


        const rowHeight =
            9;


        const headers = [
            "Module",
            "Metric",
            "Value",
            "Interpretation"
        ];


        let cursorX =
            startX;


        headers.forEach(
            function (
                header,
                index
            ) {
                /*
                   Explicit white background.
                   Do not inherit any previous fill state.
                */

                doc.setFillColor(
                    255,
                    255,
                    255
                );


                doc.setDrawColor(
                    185,
                    199,
                    191
                );


                doc.setLineWidth(
                    0.25
                );


                doc.rect(
                    cursorX,
                    y,
                    widths[index],
                    rowHeight,
                    "FD"
                );


                /*
                   Reset font and text color for
                   every single header cell.
                */

                doc.setFont(
                    "helvetica",
                    "bold"
                );


                doc.setFontSize(
                    7.8
                );


                doc.setTextColor(
                    23,
                    35,
                    28
                );


                doc.text(
                    header,
                    cursorX + 2.2,
                    y + 5.7
                );


                cursorX +=
                    widths[index];
            }
        );


        /*
           Green accent line underneath the header.
        */

        doc.setDrawColor(
            22,
            131,
            58
        );


        doc.setLineWidth(
            0.45
        );


        doc.line(
            startX,
            y + rowHeight,
            startX
            +
            widths.reduce(
                function (
                    total,
                    width
                ) {
                    return (
                        total
                        +
                        width
                    );
                },
                0
            ),
            y + rowHeight
        );


        return (
            y
            +
            rowHeight
        );
    }


    function drawPdfTableRow(
        doc,
        y,
        row,
        widths
    ) {
        const x =
            14;


        const padding =
            2;


        const lineHeight =
            3.6;


        const values = [

            toPdfText(
                row.module
            ),

            toPdfText(
                row.metric
            ),

            toPdfText(
                row.value
            ),

            toPdfText(
                row.interpretation
            )

        ];


        doc.setFont(
            "helvetica",
            "normal"
        );


        doc.setFontSize(
            7.2
        );


        const wrapped =
            values.map(
                function (
                    value,
                    index
                ) {
                    return doc.splitTextToSize(
                        value,

                        widths[index]
                        -
                        padding * 2
                    );
                }
            );


        const maximumLines =
            Math.max(
                ...wrapped.map(
                    function (
                        lines
                    ) {
                        return lines.length;
                    }
                )
            );


        const rowHeight =
            Math.max(
                9,

                maximumLines
                *
                lineHeight
                +
                padding * 2
            );


        let cursorX =
            x;


        wrapped.forEach(
            function (
                lines,
                index
            ) {
                /*
                   Reset white fill and border for every cell.
                   This also prevents header styling from
                   leaking into data rows.
                */

                doc.setFillColor(
                    255,
                    255,
                    255
                );


                doc.setDrawColor(
                    220,
                    227,
                    223
                );


                doc.setLineWidth(
                    0.2
                );


                doc.rect(
                    cursorX,
                    y,
                    widths[index],
                    rowHeight,
                    "FD"
                );


                doc.setFont(
                    "helvetica",
                    "normal"
                );


                doc.setFontSize(
                    7.2
                );


                doc.setTextColor(
                    45,
                    55,
                    49
                );


                doc.text(
                    lines,
                    cursorX + padding,
                    y + padding + 2.8,
                    {
                        lineHeightFactor:
                            1.15
                    }
                );


                cursorX +=
                    widths[index];
            }
        );


        return (
            y
            +
            rowHeight
        );
    }


    async function downloadPdfReport() {
        if (
            !renderCurrentReport()
        ) {
            return;
        }


        if (
            !currentReportRows.length
            ||
            !currentMetrics
        ) {
            showToast(
                "Generate a report before downloading PDF.",
                "error"
            );


            return;
        }


        const originalButtonText =
            savePdfBtn.textContent;


        savePdfBtn.disabled =
            true;


        savePdfBtn.textContent =
            "Generating PDF...";


        try {
            await ensureJsPdfLoaded();


            const {
                jsPDF
            } =
                window.jspdf;


            const doc =
                new jsPDF(
                    {
                        orientation:
                            "portrait",

                        unit:
                            "mm",

                        format:
                            "a4",

                        compress:
                            true
                    }
                );


            const type =
                reportTypeSelect.value;


            const title =
                REPORT_LABELS[type]
                ||
                REPORT_LABELS.overall;


            const range =
                `${formatDate(
                    reportFromDateInput.value
                )} - ${formatDate(
                    reportToDateInput.value
                )}`;


            let y =
                addPdfPageHeader(
                    doc,
                    title,
                    range,
                    false
                );


            /* =====================================
               MAIN KPI CARDS
            ====================================== */

            const cardGap =
                3;


            const cardWidth =
                (
                    182
                    -
                    cardGap * 3
                )
                /
                4;


            const cardHeight =
                18;


            const cardXs = [

                14,

                14
                +
                cardWidth
                +
                cardGap,

                14
                +
                (
                    cardWidth
                    +
                    cardGap
                )
                *
                2,

                14
                +
                (
                    cardWidth
                    +
                    cardGap
                )
                *
                3

            ];


            drawPdfCard(
                doc,
                cardXs[0],
                y,
                cardWidth,
                cardHeight,
                "Sales Revenue",
                formatMoney(
                    currentMetrics.salesRevenue
                )
            );


            drawPdfCard(
                doc,
                cardXs[1],
                y,
                cardWidth,
                cardHeight,
                "Paddy Procurement",
                formatMoney(
                    currentMetrics.purchaseCost
                )
            );


            drawPdfCard(
                doc,
                cardXs[2],
                y,
                cardWidth,
                cardHeight,
                "Operating Balance",
                formatMoney(
                    currentMetrics.operatingBalance
                ),

                currentMetrics.operatingBalance < 0

                    ?

                    [
                        194,
                        57,
                        57
                    ]

                    :

                    [
                        22,
                        131,
                        58
                    ]
            );


            drawPdfCard(
                doc,
                cardXs[3],
                y,
                cardWidth,
                cardHeight,
                "Current Inventory",
                `${formatNumber(
                    currentMetrics.currentInventoryTotal
                )} kg`
            );


            y +=
                cardHeight
                +
                5;


            /* =====================================
               OPERATIONAL CARDS
            ====================================== */

            const smallGap =
                3;


            const smallWidth =
                (
                    182
                    -
                    smallGap * 2
                )
                /
                3;


            const operationalRows = [

                [
                    [
                        "Whole Rice Recovery",
                        formatPercentage(
                            currentMetrics.recoveryRate
                        )
                    ],

                    [
                        "Quality Acceptance",
                        formatPercentage(
                            currentMetrics.qualityAcceptanceRate
                        )
                    ],

                    [
                        "Low-stock Items",
                        currentMetrics.lowStockCount
                    ]
                ],

                [
                    [
                        "Customer Receivables",
                        formatMoney(
                            currentMetrics.customerDue
                        )
                    ],

                    [
                        "Supplier Payables",
                        formatMoney(
                            currentMetrics.supplierDue
                        )
                    ],

                    [
                        "Delivery Completion",
                        formatPercentage(
                            currentMetrics.deliveryCompletionRate
                        )
                    ]
                ]

            ];


            operationalRows.forEach(
                function (
                    row
                ) {
                    row.forEach(
                        function (
                            item,
                            index
                        ) {
                            drawPdfCard(
                                doc,

                                14
                                +
                                index
                                *
                                (
                                    smallWidth
                                    +
                                    smallGap
                                ),

                                y,

                                smallWidth,

                                15,

                                item[0],

                                item[1]
                            );
                        }
                    );


                    y +=
                        18;
                }
            );


            /* =====================================
               FINANCIAL NOTICE
            ====================================== */

            doc.setFillColor(
                248,
                250,
                249
            );


            doc.setDrawColor(
                220,
                228,
                223
            );


            doc.roundedRect(
                14,
                y,
                182,
                15,
                2,
                2,
                "FD"
            );


            doc.setFont(
                "helvetica",
                "bold"
            );


            doc.setFontSize(
                7.5
            );


            doc.setTextColor(
                23,
                35,
                28
            );


            doc.text(
                "Financial interpretation:",
                17,
                y + 5
            );


            doc.setFont(
                "helvetica",
                "normal"
            );


            doc.setTextColor(
                75,
                86,
                80
            );


            doc.text(

                doc.splitTextToSize(

                    "Estimated Operating Balance = Sales Revenue - Paddy Procurement Cost - Operating Expenses - Salary Expense. This is an operational ERP prototype indicator, not formal accounting profit.",

                    150

                ),

                17,

                y + 9,

                {
                    lineHeightFactor:
                        1.1
                }

            );


            y +=
                20;


            /* =====================================
               CHARTS
            ====================================== */

            const salesChart =
                canvasToDataUrl(
                    salesTrendCanvas
                );


            const comparisonChart =
                canvasToDataUrl(
                    cashFlowCanvas
                );


            if (
                salesChart
                ||
                comparisonChart
            ) {
                doc.setFont(
                    "helvetica",
                    "bold"
                );


                doc.setTextColor(
                    23,
                    35,
                    28
                );


                doc.setFontSize(
                    10
                );


                doc.text(
                    "Management Charts",
                    14,
                    y
                );


                y +=
                    4;


                const chartWidth =
                    88;


                const chartHeight =
                    40;


                if (
                    salesChart
                ) {
                    doc.setDrawColor(
                        220,
                        228,
                        223
                    );


                    doc.rect(
                        14,
                        y,
                        chartWidth,
                        chartHeight
                    );


                    doc.addImage(
                        salesChart,
                        "PNG",
                        16,
                        y + 2,
                        chartWidth - 4,
                        chartHeight - 4,
                        undefined,
                        "FAST"
                    );
                }


                if (
                    comparisonChart
                ) {
                    doc.setDrawColor(
                        220,
                        228,
                        223
                    );


                    doc.rect(
                        108,
                        y,
                        chartWidth,
                        chartHeight
                    );


                    doc.addImage(
                        comparisonChart,
                        "PNG",
                        110,
                        y + 2,
                        chartWidth - 4,
                        chartHeight - 4,
                        undefined,
                        "FAST"
                    );
                }


                y +=
                    chartHeight
                    +
                    8;
            }


            /* =====================================
               DETAILS TABLE
            ====================================== */

            if (
                y >
                245
            ) {
                doc.addPage();


                y =
                    addPdfPageHeader(
                        doc,
                        title,
                        range,
                        true
                    );
            }


            doc.setFont(
                "helvetica",
                "bold"
            );


            doc.setTextColor(
                23,
                35,
                28
            );


            doc.setFontSize(
                10
            );


            doc.text(
                `${toPdfText(
                    title
                )} Details`,
                14,
                y
            );


            y +=
                4;


            const widths = [
                24,
                41,
                31,
                86
            ];


            y =
                drawPdfTableHeader(
                    doc,
                    y,
                    widths
                );


            for (
                const row of currentReportRows
            ) {
                doc.setFont(
                    "helvetica",
                    "normal"
                );


                doc.setFontSize(
                    7.2
                );


                const wrapped = [

                    doc.splitTextToSize(
                        toPdfText(
                            row.module
                        ),
                        widths[0] - 4
                    ),

                    doc.splitTextToSize(
                        toPdfText(
                            row.metric
                        ),
                        widths[1] - 4
                    ),

                    doc.splitTextToSize(
                        toPdfText(
                            row.value
                        ),
                        widths[2] - 4
                    ),

                    doc.splitTextToSize(
                        toPdfText(
                            row.interpretation
                        ),
                        widths[3] - 4
                    )

                ];


                const estimatedHeight =
                    Math.max(

                        9,

                        Math.max(
                            ...wrapped.map(
                                function (
                                    lines
                                ) {
                                    return lines.length;
                                }
                            )
                        )
                        *
                        3.6
                        +
                        4

                    );


                if (
                    y
                    +
                    estimatedHeight
                    >
                    280
                ) {
                    doc.addPage();


                    y =
                        addPdfPageHeader(
                            doc,
                            title,
                            range,
                            true
                        );


                    y =
                        drawPdfTableHeader(
                            doc,
                            y,
                            widths
                        );
                }


                y =
                    drawPdfTableRow(
                        doc,
                        y,
                        row,
                        widths
                    );
            }


            /* =====================================
               FOOTER + PAGE NUMBERS
            ====================================== */

            const totalPages =
                doc.getNumberOfPages();


            for (
                let page =
                    1;

                page <=
                    totalPages;

                page++
            ) {
                doc.setPage(
                    page
                );


                doc.setDrawColor(
                    225,
                    231,
                    227
                );


                doc.line(
                    14,
                    287,
                    196,
                    287
                );


                doc.setFont(
                    "helvetica",
                    "normal"
                );


                doc.setFontSize(
                    7.2
                );


                doc.setTextColor(
                    120,
                    130,
                    124
                );


                doc.text(

                    `Generated ${toPdfText(
                        formatDateTime(
                            new Date()
                                .toISOString()
                        )
                    )} | Admin User`,

                    14,

                    292

                );


                doc.text(

                    `Page ${page} of ${totalPages}`,

                    196,

                    292,

                    {
                        align:
                            "right"
                    }

                );
            }


            const fileName =
                `${type}-report-${reportFromDateInput.value}-to-${reportToDateInput.value}.pdf`;


            doc.save(
                fileName
            );


            showToast(
                "PDF report downloaded successfully."
            );
        }
        catch (
            error
        ) {
            console.error(
                "PDF export failed:",
                error
            );


            showToast(
                "PDF could not be generated. Check your internet connection, refresh the page and try again.",
                "error"
            );
        }
        finally {
            savePdfBtn.disabled =
                false;


            savePdfBtn.textContent =
                originalButtonText;
        }
    }


    savePdfBtn.addEventListener(
        "click",
        downloadPdfReport
    );


    /* =========================================
       TOAST
    ========================================== */

    function showToast(
        message,
        type =
            "success"
    ) {
        document.querySelector(
            ".report-toast"
        )
        ?.remove();


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
       MOBILE SIDEBAR
    ========================================== */

    function openSidebar() {
        if (
            !sidebar
        ) {
            return;
        }


        sidebar.classList.add(
            "open"
        );


        sidebarBackdrop
            ?.classList.add(
                "show"
            );


        menuButton
            ?.setAttribute(
                "aria-expanded",
                "true"
            );


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


        sidebarBackdrop
            ?.classList.remove(
                "show"
            );


        menuButton
            ?.setAttribute(
                "aria-expanded",
                "false"
            );


        document.body.style.overflow =
            "";
    }


    menuButton
        ?.addEventListener(
            "click",
            function () {
                sidebar
                    ?.classList.contains(
                        "open"
                    )

                    ?

                    closeSidebar()

                    :

                    openSidebar();
            }
        );


    sidebarBackdrop
        ?.addEventListener(
            "click",
            closeSidebar
        );


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
                    drawCharts,
                    150
                );
        }
    );


    /* =========================================
       INITIALIZE
    ========================================== */

    savePdfBtn.textContent =
        "Download PDF";


    reportFromDateInput.value =
        getMonthStartDate();


    reportToDateInput.value =
        getTodayDate();


    reportTypeSelect.value =
        "overall";


    renderCurrentReport();


    displayReportHistory();
});