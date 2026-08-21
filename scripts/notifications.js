document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       SMART RICE MILL ERP
       LIVE NOTIFICATION ENGINE

       Alerts are generated from:
       1. Inventory safety stock
       2. Supplier purchase dues
       3. Customer invoice dues
       4. Salary dues
       5. Pending / On-the-Way deliveries
       6. Maintenance due / overdue
       7. Rejected / Under Review quality batches

       No alert is manually hard-coded.

       History is preserved in:
       notificationAlertHistory
    ========================================== */


    /* =========================================
       ELEMENTS
    ========================================== */

    const lowStockCount =
        document.getElementById(
            "lowStockCount"
        );


    const duePaymentCount =
        document.getElementById(
            "duePaymentCount"
        );


    const pendingDeliveryCount =
        document.getElementById(
            "pendingDeliveryCount"
        );


    const attentionCount =
        document.getElementById(
            "attentionCount"
        );


    const notificationBadge =
        document.getElementById(
            "notificationBadge"
        );


    const priorityAlertList =
        document.getElementById(
            "priorityAlertList"
        );


    const alertTableBody =
        document.getElementById(
            "alertTableBody"
        );


    const alertSearch =
        document.getElementById(
            "alertSearch"
        );


    const alertTypeFilter =
        document.getElementById(
            "alertTypeFilter"
        );


    const alertStatusFilter =
        document.getElementById(
            "alertStatusFilter"
        );


    const refreshAlertsBtn =
        document.getElementById(
            "refreshAlertsBtn"
        );


    const topbarUserName =
        document.getElementById(
            "topbarUserName"
        );


    const sidebarMillName =
        document.getElementById(
            "sidebarMillName"
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
    ========================================== */

    let activeAlerts = [];
    let alertHistory = [];


    /* =========================================
       STORAGE HELPERS
    ========================================== */

    function safeParse(value) {

        try {

            return JSON.parse(value);

        }
        catch {

            return null;

        }

    }


    function getStorageValue(key) {

        const value =
            localStorage.getItem(key);


        if (value === null) {
            return null;
        }


        return safeParse(value);

    }


    function firstArray(keys) {

        for (
            const key of keys
        ) {

            const value =
                getStorageValue(key);


            if (
                Array.isArray(value)
            ) {

                return value;

            }


            if (
                value &&
                Array.isArray(value.records)
            ) {

                return value.records;

            }


            if (
                value &&
                Array.isArray(value.items)
            ) {

                return value.items;

            }

        }


        return [];

    }


    function firstObject(keys) {

        for (
            const key of keys
        ) {

            const value =
                getStorageValue(key);


            if (
                value &&
                !Array.isArray(value) &&
                typeof value === "object"
            ) {

                return value;

            }

        }


        return {};

    }


    /* =========================================
       FALLBACK STORAGE DISCOVERY

       Makes the notification page more tolerant
       if older project files used slightly
       different storage-key names.
    ========================================== */

    function discoverBestArray(
        fieldGroups
    ) {

        let bestArray = [];
        let bestScore = 0;


        for (
            let i = 0;
            i < localStorage.length;
            i++
        ) {

            const key =
                localStorage.key(i);


            if (!key) {
                continue;
            }


            const value =
                safeParse(
                    localStorage.getItem(
                        key
                    )
                );


            if (
                !Array.isArray(value) ||
                value.length === 0
            ) {

                continue;
            }


            const sample =
                value.find(
                    item =>
                        item &&
                        typeof item === "object"
                );


            if (!sample) {
                continue;
            }


            let score = 0;


            fieldGroups.forEach(
                function (group) {

                    const matched =
                        group.some(
                            field =>
                                Object.prototype
                                    .hasOwnProperty
                                    .call(
                                        sample,
                                        field
                                    )
                        );


                    if (matched) {
                        score++;
                    }

                }
            );


            if (
                score > bestScore
            ) {

                bestScore =
                    score;


                bestArray =
                    value;

            }

        }


        return bestArray;

    }


    function getArray(
        keys,
        fieldGroups
    ) {

        const direct =
            firstArray(keys);


        if (
            direct.length > 0
        ) {

            return direct;

        }


        return discoverBestArray(
            fieldGroups
        );

    }


    /* =========================================
       GENERIC HELPERS
    ========================================== */

    function numberValue(
        ...values
    ) {

        for (
            const value of values
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
                    .replace(/[৳,\s]/g, "");


            const number =
                Number(cleaned);


            if (
                Number.isFinite(number)
            ) {

                return number;

            }

        }


        return 0;

    }


    function stringValue(
        ...values
    ) {

        for (
            const value of values
        ) {

            if (
                value !== null &&
                value !== undefined &&
                String(value).trim() !== ""
            ) {

                return String(value).trim();

            }

        }


        return "";

    }


    function normalizeText(value) {

        return String(
            value || ""
        )
            .trim()
            .toLowerCase();

    }


    function escapeHTML(value) {

        const div =
            document.createElement("div");


        div.textContent =
            String(value ?? "");


        return div.innerHTML;

    }


    function formatMoney(value) {

        return (
            "৳" +
            Math.max(
                0,
                numberValue(value)
            ).toLocaleString(
                "en-BD",
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
                    "en-BD",
                    {
                        maximumFractionDigits: 2
                    }
                )
            +
            " kg"
        );

    }


    function pad2(number) {

        return String(number)
            .padStart(
                2,
                "0"
            );

    }


    function toISODate(date) {

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


    function todayISO() {

        return toISODate(
            new Date()
        );

    }


    function parseDate(value) {

        if (!value) {
            return null;
        }


        const raw =
            String(value)
                .trim();


        const isoMatch =
            raw.match(
                /^(\d{4})-(\d{2})-(\d{2})/
            );


        if (isoMatch) {

            return new Date(
                Number(isoMatch[1]),
                Number(isoMatch[2]) - 1,
                Number(isoMatch[3])
            );

        }


        const usMatch =
            raw.match(
                /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
            );


        if (usMatch) {

            return new Date(
                Number(usMatch[3]),
                Number(usMatch[1]) - 1,
                Number(usMatch[2])
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


    function dateDifferenceDays(
        targetDate
    ) {

        if (!targetDate) {
            return null;
        }


        const today =
            parseDate(
                todayISO()
            );


        const milliseconds =
            targetDate.getTime()
            -
            today.getTime();


        return Math.ceil(
            milliseconds /
            86400000
        );

    }


    function formatDate(value) {

        const date =
            parseDate(value);


        if (!date) {

            return "—";

        }


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
       PROFILE + SETTINGS
    ========================================== */

    function renderHeaderInformation() {

        const profile =
            firstObject(
                [
                    "adminProfile",
                    "profileData"
                ]
            );


        const settings =
            firstObject(
                [
                    "riceMillSettings",
                    "systemSettings"
                ]
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
       SOURCE ARRAYS
    ========================================== */

    function getPurchaseRecords() {

        return getArray(

            [
                "paddyPurchaseRecords",
                "purchaseRecords",
                "paddyPurchases",
                "purchases",
                "smartRiceMillPurchases"
            ],

            [
                [
                    "purchaseId",
                    "purchaseID",
                    "id"
                ],

                [
                    "supplierName",
                    "supplier",
                    "farmerName"
                ],

                [
                    "paddyWeight",
                    "weight",
                    "quantity"
                ],

                [
                    "paymentStatus",
                    "remainingDue",
                    "dueAmount"
                ]
            ]

        );

    }


    function getSalesRecords() {

        return getArray(

            [
                "salesInvoices",
                "invoiceRecords",
                "salesRecords",
                "invoices",
                "smartRiceMillSales"
            ],

            [
                [
                    "invoiceId",
                    "invoiceID",
                    "invoice"
                ],

                [
                    "customerName",
                    "customer"
                ],

                [
                    "totalAmount",
                    "total",
                    "amount"
                ],

                [
                    "paymentStatus",
                    "dueAmount",
                    "remainingDue"
                ]
            ]

        );

    }


    function getDeliveryRecords() {

        return getArray(

            [
                "deliveryRecords",
                "deliveries",
                "smartRiceMillDeliveries"
            ],

            [
                [
                    "deliveryId",
                    "deliveryID"
                ],

                [
                    "customerName",
                    "customer"
                ],

                [
                    "deliveryStatus",
                    "status"
                ],

                [
                    "driverName",
                    "driver",
                    "truckNumber"
                ]
            ]

        );

    }


    function getMaintenanceRecords() {

        return getArray(

            [
                "maintenanceRecords",
                "machineMaintenanceRecords",
                "maintenanceHistory"
            ],

            [
                [
                    "machineName",
                    "machine"
                ],

                [
                    "nextServiceDate",
                    "nextService"
                ],

                [
                    "maintenanceType",
                    "serviceActivity"
                ],

                [
                    "maintenanceStatus",
                    "machineStatus"
                ]
            ]

        );

    }


    function getSalaryRecords() {

        return getArray(

            [
                "salaryRecords",
                "payrollRecords",
                "salaryHistory"
            ],

            [
                [
                    "employee",
                    "employeeName"
                ],

                [
                    "salaryAmount",
                    "salary"
                ],

                [
                    "paidAmount",
                    "dueAmount",
                    "due"
                ],

                [
                    "paymentStatus",
                    "status"
                ]
            ]

        );

    }


    function getQualityRecords() {

        return getArray(

            [
                "qualityInspectionRecords",
                "qualityInspections",
                "inspectionRecords",
                "qualityRecords"
            ],

            [
                [
                    "purchaseId",
                    "purchaseID"
                ],

                [
                    "decision"
                ],

                [
                    "grade"
                ],

                [
                    "moisture",
                    "impurity"
                ]
            ]

        );

    }


    /* =========================================
       INVENTORY NORMALIZATION
    ========================================== */

    function normalizeProductName(value) {

        const text =
            normalizeText(value);


        if (
            text.includes("paddy")
        ) {
            return "Accepted Paddy";
        }


        if (
            text.includes("whole") ||
            text === "rice"
        ) {
            return "Whole Rice";
        }


        if (
            text.includes("khud") ||
            text.includes("broken")
        ) {
            return "Khud / Broken Rice";
        }


        if (
            text.includes("tush") ||
            text.includes("husk")
        ) {
            return "Tush / Husk";
        }


        if (
            text.includes("bran")
        ) {
            return "Rice Bran";
        }


        return stringValue(
            value,
            "Unknown Product"
        );

    }


    function getInventoryRecords() {

        const direct =
            getArray(

                [
                    "currentInventory",
                    "inventoryProducts",
                    "inventoryRecords",
                    "inventoryStock",
                    "stockRecords"
                ],

                [
                    [
                        "product",
                        "productName",
                        "name"
                    ],

                    [
                        "availableStock",
                        "stock",
                        "quantity",
                        "balance"
                    ],

                    [
                        "safetyStock",
                        "minimumLevel",
                        "minStock"
                    ]
                ]

            );


        if (
            direct.length > 0
        ) {

            return direct.map(
                function (record) {

                    return {

                        product:
                            normalizeProductName(
                                stringValue(
                                    record.product,
                                    record.productName,
                                    record.name
                                )
                            ),

                        availableStock:
                            numberValue(
                                record.availableStock,
                                record.stock,
                                record.quantity,
                                record.balance,
                                record.currentStock
                            ),

                        safetyStock:
                            numberValue(
                                record.safetyStock,
                                record.minimumLevel,
                                record.minStock,
                                record.minimumStock,
                                record.threshold
                            ),

                        lastMovement:
                            stringValue(
                                record.lastMovement,
                                record.lastUpdated,
                                record.date
                            )

                    };

                }
            );

        }


        /*
           Fallback:
           derive available stock from ledger.
        */

        const ledger =
            firstArray(
                [
                    "stockMovementLedger",
                    "inventoryLedger",
                    "stockLedger",
                    "inventoryTransactions"
                ]
            );


        const safetyRaw =
            firstObject(
                [
                    "safetyStockLevels",
                    "inventorySafetyLevels"
                ]
            );


        const products =
            {};


        ledger.forEach(
            function (entry) {

                const product =
                    normalizeProductName(
                        stringValue(
                            entry.product,
                            entry.productName
                        )
                    );


                if (!product) {
                    return;
                }


                const balance =
                    numberValue(
                        entry.balanceAfter,
                        entry.balance,
                        entry.availableStock
                    );


                products[product] = {

                    product:
                        product,

                    availableStock:
                        balance,

                    safetyStock:
                        0,

                    lastMovement:
                        stringValue(
                            entry.date,
                            entry.createdAt
                        )

                };

            }
        );


        Object.keys(products)
            .forEach(
                function (product) {

                    const directLevel =
                        safetyRaw[
                            product
                        ];


                    const normalizedKey =
                        Object.keys(
                            safetyRaw
                        )
                        .find(
                            key =>
                                normalizeProductName(
                                    key
                                )
                                ===
                                product
                        );


                    products[
                        product
                    ].safetyStock =
                        numberValue(
                            directLevel,
                            normalizedKey
                                ? safetyRaw[
                                    normalizedKey
                                ]
                                : 0
                        );

                }
            );


        return Object.values(
            products
        );

    }


    /* =========================================
       DUE CALCULATIONS
    ========================================== */

    function calculatePurchaseDue(
        record
    ) {

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
                record.total,
                record.amount
            )

            ||

            (
                numberValue(
                    record.paddyWeight,
                    record.weight,
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


        const paymentStatus =
            normalizeText(
                record.paymentStatus
            );


        if (
            paymentStatus.includes("due") ||
            paymentStatus.includes("partial")
        ) {

            return Math.max(
                0,
                total - paid
            )

            || total;

        }


        return Math.max(
            0,
            total - paid
        );

    }


    function calculateSalesDue(
        record
    ) {

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
                record.total,
                record.amount,
                record.invoiceAmount
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

            return Math.max(
                0,
                total - paid
            )

            || total;

        }


        return Math.max(
            0,
            total - paid
        );

    }


    function calculateSalaryDue(
        record
    ) {

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
                record.paymentStatus,
                record.status
            );


        if (
            status.includes("due") ||
            status.includes("partial")
        ) {

            return Math.max(
                0,
                salary - paid
            )

            || salary;

        }


        return Math.max(
            0,
            salary - paid
        );

    }


    /* =========================================
       ALERT CREATOR
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
       LOW STOCK ALERTS
    ========================================== */

    function buildLowStockAlerts() {

        const inventory =
            getInventoryRecords();


        const alerts = [];


        inventory.forEach(
            function (item) {

                const stock =
                    numberValue(
                        item.availableStock
                    );


                const safety =
                    numberValue(
                        item.safetyStock
                    );


                /*
                   Ignore products with no
                   configured safety stock.
                */

                if (
                    safety <= 0
                ) {

                    return;

                }


                if (
                    stock <= safety
                ) {

                    const product =
                        normalizeProductName(
                            item.product
                        );


                    alerts.push(
                        makeAlert({

                            key:
                                `stock:${product}`,

                            type:
                                "Low Stock",

                            title:
                                "Low Stock",

                            message:

                                `${product} stock is ${formatQuantity(stock)}; configured safety stock is ${formatQuantity(safety)}.`,

                            source:
                                "Inventory",

                            reference:
                                product,

                            priority:
                                stock <= 0
                                    ? "High"
                                    : "High",

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
       PURCHASE DUE ALERTS
    ========================================== */

    function buildSupplierDueAlerts() {

        const purchases =
            getPurchaseRecords();


        const alerts = [];


        purchases.forEach(
            function (record, index) {

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
                        `PUR-${index + 1}`
                    );


                const supplier =
                    stringValue(
                        record.supplierName,
                        record.supplier,
                        record.farmerName,
                        record.partnerName,
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

                            `${supplier} has ${formatMoney(due)} outstanding from paddy procurement.`,

                        source:
                            "Purchase",

                        reference:
                            purchaseId,

                        priority:
                            "Medium",

                        date:
                            stringValue(
                                record.purchaseDate,
                                record.date,
                                todayISO()
                            ),

                        targetPage:
                            "purchase.html"

                    })
                );

            }
        );


        return alerts;

    }


    /* =========================================
       CUSTOMER DUE ALERTS
    ========================================== */

    function buildCustomerDueAlerts() {

        const sales =
            getSalesRecords();


        const alerts = [];


        sales.forEach(
            function (record, index) {

                const status =
                    normalizeText(
                        record.status,
                        record.invoiceStatus
                    );


                if (
                    status.includes("void") ||
                    status.includes("cancel")
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
                        record.invoiceID,
                        record.invoice,
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

                            `${customer} has ${formatMoney(due)} outstanding on invoice ${invoiceId}.`,

                        source:
                            "Sales",

                        reference:
                            invoiceId,

                        priority:
                            "Medium",

                        date:
                            stringValue(
                                record.invoiceDate,
                                record.saleDate,
                                record.date,
                                todayISO()
                            ),

                        targetPage:
                            "sales.html"

                    })
                );

            }
        );


        return alerts;

    }


    /* =========================================
       SALARY DUE ALERTS
    ========================================== */

    function buildSalaryDueAlerts() {

        const salaries =
            getSalaryRecords();


        const alerts = [];


        salaries.forEach(
            function (record, index) {

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


                const month =
                    stringValue(
                        record.salaryMonth,
                        record.month,
                        ""
                    );


                const reference =
                    stringValue(
                        record.salaryId,
                        record.id,
                        `SAL-${index + 1}`
                    );


                alerts.push(
                    makeAlert({

                        key:
                            `salary-due:${reference}`,

                        type:
                            "Salary Due",

                        title:
                            "Salary Payment Due",

                        message:

                            `${employee}${month ? ` (${month})` : ""} has ${formatMoney(due)} salary due.`,

                        source:
                            "Expense & Salary",

                        reference:
                            reference,

                        priority:
                            "Medium",

                        date:
                            stringValue(
                                record.date,
                                record.salaryDate,
                                todayISO()
                            ),

                        targetPage:
                            "expense.html"

                    })
                );

            }
        );


        return alerts;

    }


    /* =========================================
       DELIVERY ALERTS
    ========================================== */

    function buildDeliveryAlerts() {

        const deliveries =
            getDeliveryRecords();


        const alerts = [];


        deliveries.forEach(
            function (record, index) {

                const status =
                    normalizeText(
                        record.deliveryStatus,
                        record.status
                    );


                const isPending =

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
                    );


                if (!isPending) {
                    return;
                }


                const deliveryId =
                    stringValue(
                        record.deliveryId,
                        record.deliveryID,
                        record.id,
                        `DEL-${index + 1}`
                    );


                const customer =
                    stringValue(
                        record.customerName,
                        record.customer,
                        "Customer"
                    );


                const destination =
                    stringValue(
                        record.destination,
                        record.deliveryAddress,
                        record.upazila,
                        ""
                    );


                alerts.push(
                    makeAlert({

                        key:
                            `delivery:${deliveryId}`,

                        type:
                            "Delivery",

                        title:
                            status.includes("way")
                                ||
                            status.includes("transit")
                                ?
                                "Delivery On the Way"
                                :
                                "Pending Delivery",

                        message:

                            `${customer}'s delivery ${deliveryId} is ${status || "pending"}${destination ? ` for ${destination}` : ""}.`,

                        source:
                            "Delivery",

                        reference:
                            deliveryId,

                        priority:
                            "Medium",

                        date:
                            stringValue(
                                record.deliveryDate,
                                record.date,
                                todayISO()
                            ),

                        targetPage:
                            "delivery.html"

                    })
                );

            }
        );


        return alerts;

    }


    /* =========================================
       MAINTENANCE ALERTS
    ========================================== */

    function buildMaintenanceAlerts() {

        const maintenance =
            getMaintenanceRecords();


        const alerts = [];


        maintenance.forEach(
            function (record, index) {

                const maintenanceStatus =
                    normalizeText(
                        record.maintenanceStatus
                    );


                if (
                    maintenanceStatus.includes(
                        "completed"
                    )

                    ||

                    maintenanceStatus.includes(
                        "cancel"
                    )
                ) {

                    return;

                }


                const nextDate =
                    parseDate(
                        stringValue(
                            record.nextServiceDate,
                            record.nextService
                        )
                    );


                if (!nextDate) {
                    return;
                }


                const days =
                    dateDifferenceDays(
                        nextDate
                    );


                /*
                   Alert:
                   overdue or due within 7 days.
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
                        "Machine"
                    );


                const reference =
                    stringValue(
                        record.maintenanceId,
                        record.recordId,
                        record.id,
                        `MNT-${index + 1}`
                    );


                let message =
                    "";


                let title =
                    "";


                let priority =
                    "Medium";


                if (
                    days < 0
                ) {

                    title =
                        "Maintenance Overdue";


                    priority =
                        "High";


                    message =

                        `${machine} service is overdue by ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"}.`;

                }
                else if (
                    days === 0
                ) {

                    title =
                        "Maintenance Due Today";


                    priority =
                        "High";


                    message =

                        `${machine} is scheduled for service today.`;

                }
                else {

                    title =
                        "Upcoming Maintenance";


                    message =

                        `${machine} is due for service in ${days} day${days === 1 ? "" : "s"}.`;

                }


                alerts.push(
                    makeAlert({

                        key:
                            `maintenance:${reference}`,

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
                                nextDate
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
       QUALITY ALERTS
    ========================================== */

    function buildQualityAlerts() {

        const quality =
            getQualityRecords();


        const alerts = [];


        quality.forEach(
            function (record, index) {

                const decision =
                    normalizeText(
                        record.decision,
                        record.status
                    );


                const isRejected =
                    decision.includes(
                        "reject"
                    );


                const isReview =
                    decision.includes(
                        "review"
                    );


                if (
                    !isRejected &&
                    !isReview
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
                        record.supplier,
                        ""
                    );


                alerts.push(
                    makeAlert({

                        key:
                            `quality:${purchaseId}`,

                        type:
                            "Quality",

                        title:
                            isRejected
                                ?
                                "Rejected Paddy Batch"
                                :
                                "Quality Review Required",

                        message:

                            `${purchaseId}${supplier ? ` from ${supplier}` : ""} is ${isRejected ? "rejected" : "under review"} and requires attention.`,

                        source:
                            "Quality Inspection",

                        reference:
                            purchaseId,

                        priority:
                            isRejected
                                ?
                                "High"
                                :
                                "Medium",

                        date:
                            stringValue(
                                record.inspectionDate,
                                record.date,
                                todayISO()
                            ),

                        targetPage:
                            "quality.html"

                    })
                );

            }
        );


        return alerts;

    }


    /* =========================================
       BUILD ALL ACTIVE ALERTS
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
       ALERT ID
    ========================================== */

    function nextAlertId(
        history
    ) {

        const numbers =
            history
                .map(
                    function (alert) {

                        const match =
                            String(
                                alert.alertId ||
                                ""
                            )
                            .match(
                                /^ALT-(\d+)$/i
                            );


                        return match
                            ?
                            Number(
                                match[1]
                            )
                            :
                            0;

                    }
                )
                .filter(Boolean);


        const next =
            numbers.length
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


    /* =========================================
       HISTORY
    ========================================== */

    function loadAlertHistory() {

        const history =
            getStorageValue(
                "notificationAlertHistory"
            );


        return Array.isArray(
            history
        )
            ?
            history
            :
            [];

    }


    function saveAlertHistory() {

        localStorage.setItem(

            "notificationAlertHistory",

            JSON.stringify(
                alertHistory
            )

        );

    }


    function syncHistoryWithActiveAlerts() {

        const now =
            new Date()
                .toISOString();


        let history =
            loadAlertHistory();


        /*
           Resolve alerts whose underlying
           ERP condition no longer exists.
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
           Add/update current active alerts.
        */

        activeAlerts.forEach(
            function (alert) {

                const index =
                    history.findIndex(
                        item =>
                            item.key ===
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

                        status:
                            "Active",

                        createdAt:
                            history[index]
                                .createdAt,

                        lastDetectedAt:
                            now,

                        resolvedAt:
                            null

                    };

                }
                else {

                    history.push({

                        ...alert,

                        alertId:
                            nextAlertId(
                                history
                            ),

                        status:
                            "Active",

                        createdAt:
                            now,

                        lastDetectedAt:
                            now,

                        resolvedAt:
                            null

                    });

                }

            }
        );


        alertHistory =
            history;


        saveAlertHistory();

    }


    /* =========================================
       PRIORITY SORT
    ========================================== */

    function priorityWeight(
        priority
    ) {

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


    function sortAlerts(
        records
    ) {

        return [...records]
            .sort(
                function (a, b) {

                    const priorityDifference =

                        priorityWeight(
                            b.priority
                        )

                        -

                        priorityWeight(
                            a.priority
                        );


                    if (
                        priorityDifference !== 0
                    ) {

                        return priorityDifference;

                    }


                    const dateA =
                        parseDate(
                            a.date
                        );


                    const dateB =
                        parseDate(
                            b.date
                        );


                    return (
                        (dateB?.getTime() || 0)
                        -
                        (dateA?.getTime() || 0)
                    );

                }
            );

    }


    /* =========================================
       KPI
    ========================================== */

    function updateKPIs() {

        const lowStock =
            activeAlerts.filter(
                alert =>
                    alert.type ===
                    "Low Stock"
            ).length;


        const due =
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
            ).length;


        const delivery =
            activeAlerts.filter(
                alert =>
                    alert.type ===
                    "Delivery"
            ).length;


        const highPriority =
            activeAlerts.filter(
                alert =>
                    alert.priority ===
                    "High"
            ).length;


        lowStockCount.textContent =
            lowStock;


        duePaymentCount.textContent =
            due;


        pendingDeliveryCount.textContent =
            delivery;


        attentionCount.textContent =
            highPriority;


        if (
            notificationBadge
        ) {

            const total =
                activeAlerts.length;


            notificationBadge.textContent =
                total > 99
                    ?
                    "99+"
                    :
                    total;


            notificationBadge.style.display =
                total > 0
                    ?
                    "inline-flex"
                    :
                    "none";

        }


        /*
           Shared badge value that can later
           be used by dashboard/header code.
        */

        localStorage.setItem(
            "activeNotificationCount",
            String(
                activeAlerts.length
            )
        );

    }


    /* =========================================
       ICON
    ========================================== */

    function getAlertIcon(
        type
    ) {

        if (
            type === "Low Stock"
        ) {

            return {
                icon: "▣",
                className: "alert-icon-danger"
            };

        }


        if (
            type === "Supplier Due" ||
            type === "Customer Due" ||
            type === "Salary Due"
        ) {

            return {
                icon: "৳",
                className: "alert-icon-warning"
            };

        }


        if (
            type === "Delivery"
        ) {

            return {
                icon: "🚚",
                className: "alert-icon-info"
            };

        }


        if (
            type === "Maintenance"
        ) {

            return {
                icon: "🔧",
                className: "alert-icon-warning"
            };

        }


        return {
            icon: "✓",
            className: "alert-icon-warning"
        };

    }


    /* =========================================
       PRIORITY FEED
    ========================================== */

    function renderPriorityFeed() {

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


                const item =
                    document.createElement(
                        "article"
                    );


                item.className =
                    "priority-alert-item";


                item.innerHTML = `

                    <div class="
                        priority-alert-icon
                        ${icon.className}
                    ">
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

                        <span class="
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
                        ">
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
                    item
                );

            }
        );

    }


    /* =========================================
       TYPE CLASS
    ========================================== */

    function getTypeClass(
        type
    ) {

        if (
            type === "Low Stock"
        ) {
            return "type-stock";
        }


        if (
            type === "Supplier Due" ||
            type === "Customer Due" ||
            type === "Salary Due"
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
       TABLE
    ========================================== */

    function renderAlertTable() {

        const search =
            normalizeText(
                alertSearch.value
            );


        const selectedType =
            alertTypeFilter.value;


        const selectedStatus =
            alertStatusFilter.value;


        const filtered =
            alertHistory

                .filter(
                    function (alert) {

                        if (
                            selectedType !== "all" &&
                            alert.type !== selectedType
                        ) {

                            return false;

                        }


                        if (
                            selectedStatus !== "all" &&
                            alert.status !== selectedStatus
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


                        return searchable.includes(
                            search
                        );

                    }
                )

                .sort(
                    function (a, b) {

                        if (
                            a.status !==
                            b.status
                        ) {

                            return a.status ===
                                "Active"
                                ?
                                -1
                                :
                                1;

                        }


                        return (
                            priorityWeight(
                                b.priority
                            )
                            -
                            priorityWeight(
                                a.priority
                            )
                        );

                    }
                );


        alertTableBody.innerHTML =
            "";


        if (
            filtered.length === 0
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


        filtered.forEach(
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

                        <span class="
                            alert-type-badge
                            ${getTypeClass(
                                alert.type
                            )}
                        ">

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

                        <span class="
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
                        ">

                            ${escapeHTML(
                                alert.priority
                            )}

                        </span>

                    </td>


                    <td>

                        <span class="
                            alert-status-badge

                            ${
                                alert.status === "Active"
                                    ?
                                    "status-active"
                                    :
                                    "status-resolved"
                            }
                        ">

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
       GO TO SOURCE
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
       FILTER EVENTS
    ========================================== */

    alertSearch.addEventListener(
        "input",
        renderAlertTable
    );


    alertTypeFilter.addEventListener(
        "change",
        renderAlertTable
    );


    alertStatusFilter.addEventListener(
        "change",
        renderAlertTable
    );


    /* =========================================
       REFRESH ENGINE
    ========================================== */

    function refreshAlertEngine(
        showMessage = false
    ) {

        activeAlerts =
            generateActiveAlerts();


        syncHistoryWithActiveAlerts();


        updateKPIs();

        renderPriorityFeed();

        renderAlertTable();


        if (
            showMessage
        ) {

            showToast(
                `${activeAlerts.length} active alert${activeAlerts.length === 1 ? "" : "s"} detected from current ERP records.`
            );

        }

    }


    refreshAlertsBtn.addEventListener(
        "click",
        function () {

            refreshAlertEngine(
                true
            );

        }
    );


    /* =========================================
       STORAGE UPDATE

       Useful when another tab modifies ERP data.
    ========================================== */

    window.addEventListener(
        "storage",
        function () {

            refreshAlertEngine();

        }
    );


    /* =========================================
       TOAST
    ========================================== */

    function showToast(
        message
    ) {

        const existing =
            document.querySelector(
                ".notification-toast"
            );


        if (
            existing
        ) {

            existing.remove();

        }


        const toast =
            document.createElement(
                "div"
            );


        toast.className =
            "notification-toast";


        toast.innerHTML = `

            <span>
                ✓
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
                    220
                );

            },
            2500
        );

    }


    /* =========================================
       MOBILE SIDEBAR
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
       INITIALIZE
    ========================================== */

    renderHeaderInformation();

    refreshAlertEngine();

});