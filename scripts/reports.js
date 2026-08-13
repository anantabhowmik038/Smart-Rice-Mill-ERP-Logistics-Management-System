document.addEventListener(
    "DOMContentLoaded",
    function () {

        // ==========================================
        // ELEMENTS
        // ==========================================

        const reportsFilterForm =
            document.getElementById(
                "reportsFilterForm"
            );

        const reportTypeSelect =
            document.getElementById(
                "report-type"
            );

        const fromDateInput =
            document.getElementById(
                "from-date"
            );

        const toDateInput =
            document.getElementById(
                "to-date"
            );


        const exportReportButton =
            document.getElementById(
                "exportReportButton"
            );
        const downloadPdfButton =
            document.getElementById(
                "downloadPdfButton"
            );

        const printReportButton =
            document.getElementById(
                "printReportButton"
            );


        const reportMetaText =
            document.getElementById(
                "reportMetaText"
            );


        // Summary
        const reportSalesValue =
            document.getElementById(
                "reportSalesValue"
            );

        const reportSalesMeta =
            document.getElementById(
                "reportSalesMeta"
            );

        const reportPurchaseValue =
            document.getElementById(
                "reportPurchaseValue"
            );

        const reportPurchaseMeta =
            document.getElementById(
                "reportPurchaseMeta"
            );

        const reportInventoryValue =
            document.getElementById(
                "reportInventoryValue"
            );

        const reportInventoryMeta =
            document.getElementById(
                "reportInventoryMeta"
            );

        const reportProfitValue =
            document.getElementById(
                "reportProfitValue"
            );

        const reportProfitMeta =
            document.getElementById(
                "reportProfitMeta"
            );


        // Charts
        const salesTrendSvg =
            document.getElementById(
                "salesTrendSvg"
            );

        const salesTrendLabels =
            document.getElementById(
                "salesTrendLabels"
            );

        const profitLossChart =
            document.getElementById(
                "profitLossChart"
            );


        // Details
        const reportDetailsTitle =
            document.getElementById(
                "reportDetailsTitle"
            );

        const reportDetailsMeta =
            document.getElementById(
                "reportDetailsMeta"
            );

        const detailsTableHead =
            document.getElementById(
                "detailsTableHead"
            );

        const detailsTableBody =
            document.getElementById(
                "detailsTableBody"
            );


        // History
        const generatedReportsTableBody =
            document.getElementById(
                "generatedReportsTableBody"
            );


        // Profile
        const reportsTopbarUserName =
            document.getElementById(
                "reportsTopbarUserName"
            );


        // ==========================================
        // CURRENT REPORT STATE
        // ==========================================

        let currentReport = null;


        // ==========================================
        // SAFE LOCAL STORAGE
        // ==========================================

        function getStorageArray(
            key
        ) {

            try {

                const value =
                    JSON.parse(
                        localStorage.getItem(
                            key
                        ) ||
                        "[]"
                    );


                return Array.isArray(
                    value
                )
                    ? value
                    : [];

            } catch (error) {

                console.error(
                    "Could not read " + key,
                    error
                );


                return [];

            }

        }


        // ==========================================
        // ALL SYSTEM DATA
        // ==========================================

        function getSystemData() {

            return {

                purchases:
                    getStorageArray(
                        "purchases"
                    ),

                productions:
                    getStorageArray(
                        "productions"
                    ),

                adjustments:
                    getStorageArray(
                        "inventoryAdjustments"
                    ),

                sales:
                    getStorageArray(
                        "sales"
                    ),

                expenses:
                    getStorageArray(
                        "expenses"
                    ),

                salaries:
                    getStorageArray(
                        "salaries"
                    ),

                deliveries:
                    getStorageArray(
                        "deliveries"
                    ),

                maintenance:
                    getStorageArray(
                        "maintenanceRecords"
                    )

            };

        }


        // ==========================================
        // DATE
        // ==========================================

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
                year +
                "-" +
                month +
                "-" +
                day
            );

        }


        function getMonthStart(
            dateString
        ) {

            return (
                dateString.slice(
                    0,
                    7
                ) +
                "-01"
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
                    value +
                    "T00:00:00"
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


        function formatMonth(
            value
        ) {

            if (!value) {

                return "—";

            }


            const date =
                new Date(
                    value +
                    "-01T00:00:00"
                );


            return date.toLocaleDateString(
                "en-GB",
                {
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


        function isInDateRange(
            date,
            fromDate,
            toDate
        ) {

            return (
                date &&
                date >= fromDate &&
                date <= toDate
            );

        }


        function isSalaryInRange(
            salaryMonth,
            fromDate,
            toDate
        ) {

            if (!salaryMonth) {

                return false;

            }


            const fromMonth =
                fromDate.slice(
                    0,
                    7
                );


            const toMonth =
                toDate.slice(
                    0,
                    7
                );


            return (
                salaryMonth >=
                    fromMonth &&
                salaryMonth <=
                    toMonth
            );

        }


        // ==========================================
        // FORMAT
        // ==========================================

        function formatMoney(
            value
        ) {

            return (
                "৳" +
                Number(
                    value || 0
                ).toLocaleString(
                    "en-BD",
                    {
                        maximumFractionDigits:
                            2
                    }
                )
            );

        }


        function formatQuantity(
            value
        ) {

            return Number(
                value || 0
            ).toLocaleString(
                "en-BD",
                {
                    maximumFractionDigits:
                        2
                }
            );

        }


        function formatCompactMoney(
            value
        ) {

            const amount =
                Number(value) || 0;


            const absolute =
                Math.abs(
                    amount
                );


            if (
                absolute >= 1000000
            ) {

                return (
                    "৳" +
                    (
                        amount /
                        1000000
                    ).toFixed(1) +
                    "M"
                );

            }


            if (
                absolute >= 1000
            ) {

                return (
                    "৳" +
                    (
                        amount /
                        1000
                    ).toFixed(1) +
                    "K"
                );

            }


            return formatMoney(
                amount
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


        function titleCase(
            value
        ) {

            return String(
                value || ""
            )
                .replace(
                    /-/g,
                    " "
                )
                .replace(
                    /\b\w/g,
                    function (
                        character
                    ) {

                        return character
                            .toUpperCase();

                    }
                );

        }


        // ==========================================
        // PROFILE
        // ==========================================

        function getProfileName() {

            try {

                const profile =
                    JSON.parse(
                        localStorage.getItem(
                            "riceMillProfile"
                        ) ||
                        "{}"
                    );


                return (
                    profile.fullName ||
                    "Admin User"
                );

            } catch (error) {

                return "Admin User";

            }

        }


        function loadProfile() {

            reportsTopbarUserName
                .textContent =
                getProfileName();

        }


        // ==========================================
        // INVENTORY
        // Same logic as Inventory module
        // ==========================================

        function calculateInventory(
            data
        ) {

            let purchasedPaddy =
                0;

            let productionInputPaddy =
                0;

            let riceProduced =
                0;

            let khudProduced =
                0;

            let tushProduced =
                0;


            data.purchases.forEach(
                function (
                    purchase
                ) {

                    purchasedPaddy +=
                        Number(
                            purchase.weight ||
                            0
                        );

                }
            );


            data.productions.forEach(
                function (
                    production
                ) {

                    productionInputPaddy +=
                        Number(
                            production.inputPaddy ||
                            0
                        );


                    riceProduced +=
                        Number(
                            production.riceProduced ||
                            0
                        );


                    khudProduced +=
                        Number(
                            production.khudProduced ||
                            0
                        );


                    tushProduced +=
                        Number(
                            production.tushProduced ||
                            0
                        );

                }
            );


            function soldQuantity(
                product
            ) {

                return data.sales
                    .filter(
                        function (
                            sale
                        ) {

                            return (
                                sale.product ===
                                product
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
                                Number(
                                    sale.quantity ||
                                    0
                                )
                            );

                        },
                        0
                    );

            }


            function adjustmentTotal(
                product
            ) {

                return data.adjustments
                    .filter(
                        function (
                            adjustment
                        ) {

                            return (
                                adjustment.product ===
                                product
                            );

                        }
                    )
                    .reduce(
                        function (
                            total,
                            adjustment
                        ) {

                            const quantity =
                                Number(
                                    adjustment.quantity ||
                                    0
                                );


                            if (
                                adjustment.type ===
                                "add"
                            ) {

                                return (
                                    total +
                                    quantity
                                );

                            }


                            if (
                                adjustment.type ===
                                "remove"
                            ) {

                                return (
                                    total -
                                    quantity
                                );

                            }


                            return total;

                        },
                        0
                    );

            }


            return {

                paddy:
                    Math.max(
                        0,
                        purchasedPaddy -
                        productionInputPaddy +
                        adjustmentTotal(
                            "paddy"
                        )
                    ),

                rice:
                    Math.max(
                        0,
                        riceProduced -
                        soldQuantity(
                            "rice"
                        ) +
                        adjustmentTotal(
                            "rice"
                        )
                    ),

                khud:
                    Math.max(
                        0,
                        khudProduced -
                        soldQuantity(
                            "khud"
                        ) +
                        adjustmentTotal(
                            "khud"
                        )
                    ),

                tush:
                    Math.max(
                        0,
                        tushProduced -
                        soldQuantity(
                            "tush"
                        ) +
                        adjustmentTotal(
                            "tush"
                        )
                    )

            };

        }


        // ==========================================
        // FILTER DATA
        // ==========================================

        function filterSystemData(
            data,
            fromDate,
            toDate
        ) {

            return {

                purchases:
                    data.purchases.filter(
                        function (
                            item
                        ) {

                            return isInDateRange(
                                item.date,
                                fromDate,
                                toDate
                            );

                        }
                    ),

                productions:
                    data.productions.filter(
                        function (
                            item
                        ) {

                            return isInDateRange(
                                item.date,
                                fromDate,
                                toDate
                            );

                        }
                    ),

                adjustments:
                    data.adjustments.filter(
                        function (
                            item
                        ) {

                            return isInDateRange(
                                item.date,
                                fromDate,
                                toDate
                            );

                        }
                    ),

                sales:
                    data.sales.filter(
                        function (
                            item
                        ) {

                            return isInDateRange(
                                item.date,
                                fromDate,
                                toDate
                            );

                        }
                    ),

                expenses:
                    data.expenses.filter(
                        function (
                            item
                        ) {

                            return isInDateRange(
                                item.date,
                                fromDate,
                                toDate
                            );

                        }
                    ),

                salaries:
                    data.salaries.filter(
                        function (
                            item
                        ) {

                            return isSalaryInRange(
                                item.month,
                                fromDate,
                                toDate
                            );

                        }
                    ),

                deliveries:
                    data.deliveries.filter(
                        function (
                            item
                        ) {

                            const date =
                                item.createdDate ||
                                item.deliveredDate ||
                                item.updatedDate;


                            return isInDateRange(
                                date,
                                fromDate,
                                toDate
                            );

                        }
                    ),

                maintenance:
                    data.maintenance.filter(
                        function (
                            item
                        ) {

                            return isInDateRange(
                                item.lastServiceDate,
                                fromDate,
                                toDate
                            );

                        }
                    )

            };

        }


        // ==========================================
        // FINANCIAL TOTALS
        // ==========================================

        function calculateFinancials(
            filteredData
        ) {

            const sales =
                filteredData.sales.reduce(
                    function (
                        total,
                        sale
                    ) {

                        const amount =
                            sale.totalAmount !==
                                undefined
                                ?
                                Number(
                                    sale.totalAmount ||
                                    0
                                )
                                :
                                (
                                    Number(
                                        sale.quantity ||
                                        0
                                    ) *
                                    Number(
                                        sale.pricePerKg ||
                                        0
                                    )
                                );


                        return (
                            total +
                            amount
                        );

                    },
                    0
                );


            const purchases =
                filteredData.purchases.reduce(
                    function (
                        total,
                        purchase
                    ) {

                        return (
                            total +
                            Number(
                                purchase.totalPrice ||
                                (
                                    Number(
                                        purchase.weight ||
                                        0
                                    ) *
                                    Number(
                                        purchase.pricePerKg ||
                                        0
                                    )
                                )
                            )
                        );

                    },
                    0
                );


            const expenses =
                filteredData.expenses.reduce(
                    function (
                        total,
                        expense
                    ) {

                        return (
                            total +
                            Number(
                                expense.amount ||
                                0
                            )
                        );

                    },
                    0
                );


            const salaries =
                filteredData.salaries.reduce(
                    function (
                        total,
                        salary
                    ) {

                        return (
                            total +
                            Number(
                                salary.amount ||
                                0
                            )
                        );

                    },
                    0
                );


            return {

                sales:
                    sales,

                purchases:
                    purchases,

                expenses:
                    expenses,

                salaries:
                    salaries,

                net:
                    sales -
                    purchases -
                    expenses -
                    salaries

            };

        }


        // ==========================================
        // SUMMARY
        // ==========================================

        function updateSummary(
            financials,
            filteredData,
            inventory
        ) {

            const totalInventory =
                Object.values(
                    inventory
                ).reduce(
                    function (
                        total,
                        value
                    ) {

                        return (
                            total +
                            Number(
                                value ||
                                0
                            )
                        );

                    },
                    0
                );


            reportSalesValue.textContent =
                formatMoney(
                    financials.sales
                );


            reportSalesMeta.textContent =
                filteredData.sales.length +
                (
                    filteredData.sales.length ===
                    1
                        ?
                        " invoice"
                        :
                        " invoices"
                );


            reportPurchaseValue.textContent =
                formatMoney(
                    financials.purchases
                );


            reportPurchaseMeta.textContent =
                filteredData.purchases.length +
                (
                    filteredData.purchases.length ===
                    1
                        ?
                        " purchase"
                        :
                        " purchases"
                );


            reportInventoryValue.textContent =
                formatQuantity(
                    totalInventory
                ) +
                " kg";


            reportInventoryMeta.textContent =
                (
                    totalInventory /
                    1000
                ).toFixed(
                    2
                ) +
                " tons current stock";


            reportProfitValue.textContent =
                formatMoney(
                    financials.net
                );


            reportProfitMeta.textContent =
                "Selected period";


            reportProfitValue.classList
                .toggle(
                    "reports-negative-value",
                    financials.net < 0
                );

        }


        // ==========================================
        // SIX MONTHS
        // ==========================================

        function getSixMonthBuckets(
            toDate
        ) {

            const date =
                new Date(
                    toDate +
                    "T00:00:00"
                );


            const buckets =
                [];


            for (
                let offset = -5;
                offset <= 0;
                offset++
            ) {

                const itemDate =
                    new Date(
                        date.getFullYear(),
                        date.getMonth() +
                            offset,
                        1
                    );


                const year =
                    itemDate.getFullYear();


                const month =
                    String(
                        itemDate.getMonth() +
                        1
                    ).padStart(
                        2,
                        "0"
                    );


                buckets.push(
                    {
                        key:
                            year +
                            "-" +
                            month,

                        label:
                            itemDate
                                .toLocaleDateString(
                                    "en-GB",
                                    {
                                        month:
                                            "short"
                                    }
                                )
                    }
                );

            }


            return buckets;

        }


        function getMonthValue(
            records,
            monthKey,
            dateField,
            valueFunction
        ) {

            return records
                .filter(
                    function (
                        record
                    ) {

                        const date =
                            record[
                                dateField
                            ];


                        return (
                            date &&
                            String(
                                date
                            ).slice(
                                0,
                                7
                            ) ===
                            monthKey
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
                            valueFunction(
                                record
                            )
                        );

                    },
                    0
                );

        }


        // ==========================================
        // SALES CHART
        // ==========================================

        function renderSalesTrend(
            data,
            toDate
        ) {

            const buckets =
                getSixMonthBuckets(
                    toDate
                );


            const values =
                buckets.map(
                    function (
                        bucket
                    ) {

                        return getMonthValue(
                            data.sales,
                            bucket.key,
                            "date",
                            function (
                                sale
                            ) {

                                return Number(
                                    sale.totalAmount ||
                                    (
                                        Number(
                                            sale.quantity ||
                                            0
                                        ) *
                                        Number(
                                            sale.pricePerKg ||
                                            0
                                        )
                                    )
                                );

                            }
                        );

                    }
                );


            const maximum =
                Math.max(
                    ...values,
                    1
                );


            const left =
                40;

            const right =
                560;

            const top =
                25;

            const bottom =
                180;


            let svg = "";


            for (
                let line = 0;
                line < 5;
                line++
            ) {

                const y =
                    top +
                    (
                        line *
                        (
                            (
                                bottom -
                                top
                            ) /
                            4
                        )
                    );


                svg += `

                    <line
                        x1="${left}"
                        y1="${y}"
                        x2="${right}"
                        y2="${y}"
                        stroke="#e5e9eb"
                        stroke-width="1"
                    />

                `;

            }


            const points =
                values.map(
                    function (
                        value,
                        index
                    ) {

                        const x =
                            left +
                            (
                                index *
                                (
                                    (
                                        right -
                                        left
                                    ) /
                                    5
                                )
                            );


                        const y =
                            bottom -
                            (
                                (
                                    value /
                                    maximum
                                ) *
                                (
                                    bottom -
                                    top
                                )
                            );


                        return {
                            x:
                                x,

                            y:
                                y,

                            value:
                                value
                        };

                    }
                );


            svg += `

                <polyline
                    points="${
                        points
                            .map(
                                function (
                                    point
                                ) {

                                    return (
                                        point.x +
                                        "," +
                                        point.y
                                    );

                                }
                            )
                            .join(" ")
                    }"
                    fill="none"
                    stroke="#15913a"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />

            `;


            points.forEach(
                function (
                    point,
                    index
                ) {

                    svg += `

                        <circle
                            cx="${point.x}"
                            cy="${point.y}"
                            r="5"
                            fill="#ffffff"
                            stroke="#15913a"
                            stroke-width="3"
                        >

                            <title>

                                ${
                                    buckets[
                                        index
                                    ].label
                                }:
                                ${
                                    formatMoney(
                                        point.value
                                    )
                                }

                            </title>

                        </circle>

                    `;

                }
            );


            salesTrendSvg.innerHTML =
                svg;


            salesTrendLabels.innerHTML =
                buckets.map(
                    function (
                        bucket
                    ) {

                        return (
                            "<span>" +
                            escapeHTML(
                                bucket.label
                            ) +
                            "</span>"
                        );

                    }
                ).join("");

        }


        // ==========================================
        // PROFIT / LOSS CHART
        // ==========================================

        function renderProfitLossChart(
            data,
            toDate
        ) {

            const buckets =
                getSixMonthBuckets(
                    toDate
                );


            const monthlyNet =
                buckets.map(
                    function (
                        bucket
                    ) {

                        const sales =
                            getMonthValue(
                                data.sales,
                                bucket.key,
                                "date",
                                function (
                                    sale
                                ) {

                                    return Number(
                                        sale.totalAmount ||
                                        (
                                            Number(
                                                sale.quantity ||
                                                0
                                            ) *
                                            Number(
                                                sale.pricePerKg ||
                                                0
                                            )
                                        )
                                    );

                                }
                            );


                        const purchases =
                            getMonthValue(
                                data.purchases,
                                bucket.key,
                                "date",
                                function (
                                    purchase
                                ) {

                                    return Number(
                                        purchase.totalPrice ||
                                        0
                                    );

                                }
                            );


                        const expenses =
                            getMonthValue(
                                data.expenses,
                                bucket.key,
                                "date",
                                function (
                                    expense
                                ) {

                                    return Number(
                                        expense.amount ||
                                        0
                                    );

                                }
                            );


                        const salaries =
                            data.salaries
                                .filter(
                                    function (
                                        salary
                                    ) {

                                        return (
                                            salary.month ===
                                            bucket.key
                                        );

                                    }
                                )
                                .reduce(
                                    function (
                                        total,
                                        salary
                                    ) {

                                        return (
                                            total +
                                            Number(
                                                salary.amount ||
                                                0
                                            )
                                        );

                                    },
                                    0
                                );


                        return (
                            sales -
                            purchases -
                            expenses -
                            salaries
                        );

                    }
                );


            const maximum =
                Math.max(
                    ...monthlyNet.map(
                        function (
                            value
                        ) {

                            return Math.abs(
                                value
                            );

                        }
                    ),
                    1
                );


            profitLossChart.innerHTML =
                buckets.map(
                    function (
                        bucket,
                        index
                    ) {

                        const value =
                            monthlyNet[
                                index
                            ];


                        const height =
                            Math.max(
                                4,
                                (
                                    Math.abs(
                                        value
                                    ) /
                                    maximum
                                ) *
                                145
                            );


                        return `

                            <div class="report-bar-item">

                                <span class="report-bar-value"
                                      title="${formatMoney(
                                          value
                                      )}">

                                    ${formatCompactMoney(
                                        value
                                    )}

                                </span>

                                <div
                                    class="report-bar ${
                                        value < 0
                                            ?
                                            "loss"
                                            :
                                            ""
                                    }"
                                    style="height:${height}px"
                                    title="${
                                        bucket.label
                                    }: ${
                                        formatMoney(
                                            value
                                        )
                                    }"
                                >
                                </div>

                                <span class="report-bar-month">

                                    ${
                                        escapeHTML(
                                            bucket.label
                                        )
                                    }

                                </span>

                            </div>

                        `;

                    }
                ).join("");

        }


        // ==========================================
        // STATUS
        // ==========================================

        function statusBadge(
            text,
            status
        ) {

            const safeStatus =
                String(
                    status ||
                    ""
                )
                    .toLowerCase()
                    .replace(
                        /\s+/g,
                        "-"
                    );


            return `

                <span class="
                    report-status
                    report-status-${escapeHTML(
                        safeStatus
                    )}
                ">

                    ${escapeHTML(
                        text
                    )}

                </span>

            `;

        }


        // ==========================================
        // STOCK STATUS
        // ==========================================

        function stockStatus(
            stock
        ) {

            if (
                Number(stock) <= 0
            ) {

                return {
                    text:
                        "Out of Stock",

                    status:
                        "due"
                };

            }


            if (
                Number(stock) < 100
            ) {

                return {
                    text:
                        "Low Stock",

                    status:
                        "pending"
                };

            }


            return {
                text:
                    "Active",

                status:
                    "operational"
            };

        }


        // ==========================================
        // SCHEDULE STATUS
        // ==========================================

        function maintenanceSchedule(
            record
        ) {

            const today =
                getTodayDate();


            if (
                !record.nextServiceDate
            ) {

                return {
                    text:
                        "Unknown",

                    status:
                        "pending"
                };

            }


            if (
                record.nextServiceDate <
                today
            ) {

                return {
                    text:
                        "Overdue",

                    status:
                        "overdue"
                };

            }


            if (
                record.nextServiceDate ===
                today
            ) {

                return {
                    text:
                        "Due Today",

                    status:
                        "pending"
                };

            }


            return {
                text:
                    "Scheduled",

                status:
                    "operational"
            };

        }


        // ==========================================
        // DETAILS TABLE
        // ==========================================

        function setDetailsTable(
            title,
            meta,
            headers,
            rows
        ) {

            reportDetailsTitle.textContent =
                title;


            reportDetailsMeta.textContent =
                meta;


            detailsTableHead.innerHTML = `

                <tr>

                    ${
                        headers.map(
                            function (
                                header
                            ) {

                                return (
                                    "<th>" +
                                    escapeHTML(
                                        header
                                    ) +
                                    "</th>"
                                );

                            }
                        ).join("")
                    }

                </tr>

            `;


            if (
                rows.length === 0
            ) {

                detailsTableBody.innerHTML = `

                    <tr class="reports-empty-row">

                        <td colspan="${headers.length}">

                            No records found for the selected period.

                        </td>

                    </tr>

                `;


                return;

            }


            detailsTableBody.innerHTML =
                rows.map(
                    function (
                        row
                    ) {

                        return `

                            <tr>

                                ${
                                    row.map(
                                        function (
                                            cell
                                        ) {

                                            if (
                                                cell &&
                                                cell.isHTML
                                            ) {

                                                return (
                                                    "<td>" +
                                                    cell.value +
                                                    "</td>"
                                                );

                                            }


                                            return (
                                                "<td>" +
                                                escapeHTML(
                                                    cell
                                                ) +
                                                "</td>"
                                            );

                                        }
                                    ).join("")
                                }

                            </tr>

                        `;

                    }
                ).join("");

        }


        // ==========================================
        // REPORT DETAILS
        // ==========================================

        function renderReportDetails(
            type,
            filtered,
            allData,
            inventory,
            financials,
            fromDate,
            toDate
        ) {

            let headers = [];

            let rows = [];

            let title = "";

            const rangeText =
                formatDate(
                    fromDate
                ) +
                " - " +
                formatDate(
                    toDate
                );


            // --------------------------------------
            // OVERALL
            // --------------------------------------

            if (
                type ===
                "all"
            ) {

                title =
                    "Overall Report";


                headers = [
                    "Module",
                    "Metric",
                    "Value"
                ];


                const totalInventory =
                    Object.values(
                        inventory
                    ).reduce(
                        function (
                            total,
                            value
                        ) {

                            return (
                                total +
                                Number(
                                    value ||
                                    0
                                )
                            );

                        },
                        0
                    );


                const totalProduction =
                    filtered.productions
                        .reduce(
                            function (
                                total,
                                item
                            ) {

                                return (
                                    total +
                                    Number(
                                        item.riceProduced ||
                                        0
                                    )
                                );

                            },
                            0
                        );


                rows = [

                    [
                        "Sales",
                        "Revenue",
                        formatMoney(
                            financials.sales
                        )
                    ],

                    [
                        "Purchase",
                        "Paddy Purchase Cost",
                        formatMoney(
                            financials.purchases
                        )
                    ],

                    [
                        "Expense",
                        "Operating Expenses",
                        formatMoney(
                            financials.expenses
                        )
                    ],

                    [
                        "Salary",
                        "Salary Expense",
                        formatMoney(
                            financials.salaries
                        )
                    ],

                    [
                        "Finance",
                        "Estimated Net Balance",
                        formatMoney(
                            financials.net
                        )
                    ],

                    [
                        "Inventory",
                        "Current Total Stock",
                        formatQuantity(
                            totalInventory
                        ) +
                        " kg"
                    ],

                    [
                        "Production",
                        "Rice Produced",
                        formatQuantity(
                            totalProduction
                        ) +
                        " kg"
                    ],

                    [
                        "Delivery",
                        "Delivery Records",
                        filtered.deliveries.length
                    ],

                    [
                        "Maintenance",
                        "Maintenance Records",
                        filtered.maintenance.length
                    ]

                ];

            }


            // --------------------------------------
            // SALES
            // --------------------------------------

            if (
                type ===
                "sales"
            ) {

                title =
                    "Sales Report";


                headers = [
                    "Invoice",
                    "Customer",
                    "Product",
                    "Quantity",
                    "Total",
                    "Payment",
                    "Date"
                ];


                rows =
                    filtered.sales.map(
                        function (
                            sale
                        ) {

                            const total =
                                Number(
                                    sale.totalAmount ||
                                    (
                                        Number(
                                            sale.quantity ||
                                            0
                                        ) *
                                        Number(
                                            sale.pricePerKg ||
                                            0
                                        )
                                    )
                                );


                            return [

                                sale.invoiceId ||
                                    "—",

                                sale.customerName ||
                                    "—",

                                titleCase(
                                    sale.product
                                ),

                                formatQuantity(
                                    sale.quantity
                                ) +
                                " kg",

                                formatMoney(
                                    total
                                ),

                                {
                                    isHTML:
                                        true,

                                    value:
                                        statusBadge(
                                            titleCase(
                                                sale.payment
                                            ),
                                            sale.payment
                                        )
                                },

                                formatDate(
                                    sale.date
                                )

                            ];

                        }
                    );

            }


            // --------------------------------------
            // PURCHASE
            // --------------------------------------

            if (
                type ===
                "purchase"
            ) {

                title =
                    "Purchase Report";


                headers = [
                    "Purchase ID",
                    "Supplier",
                    "Paddy",
                    "Moisture",
                    "Total",
                    "Due",
                    "Payment",
                    "Date"
                ];


                rows =
                    filtered.purchases.map(
                        function (
                            purchase
                        ) {

                            return [

                                purchase.purchaseId ||
                                    "—",

                                purchase.supplierName ||
                                    "—",

                                formatQuantity(
                                    purchase.weight
                                ) +
                                " kg",

                                formatQuantity(
                                    purchase.moisture
                                ) +
                                "%",

                                formatMoney(
                                    purchase.totalPrice
                                ),

                                formatMoney(
                                    purchase.dueAmount
                                ),

                                {
                                    isHTML:
                                        true,

                                    value:
                                        statusBadge(
                                            titleCase(
                                                purchase.payment
                                            ),
                                            purchase.payment
                                        )
                                },

                                formatDate(
                                    purchase.date
                                )

                            ];

                        }
                    );

            }


            // --------------------------------------
            // INVENTORY
            // --------------------------------------

            if (
                type ===
                "inventory"
            ) {

                title =
                    "Inventory Report";


                headers = [
                    "Product",
                    "Current Stock",
                    "Unit",
                    "Status",
                    "As Of"
                ];


                rows =
                    Object.keys(
                        inventory
                    ).map(
                        function (
                            key
                        ) {

                            const status =
                                stockStatus(
                                    inventory[
                                        key
                                    ]
                                );


                            return [

                                titleCase(
                                    key
                                ),

                                formatQuantity(
                                    inventory[
                                        key
                                    ]
                                ),

                                "kg",

                                {
                                    isHTML:
                                        true,

                                    value:
                                        statusBadge(
                                            status.text,
                                            status.status
                                        )
                                },

                                formatDate(
                                    getTodayDate()
                                )

                            ];

                        }
                    );

            }


            // --------------------------------------
            // PRODUCTION
            // --------------------------------------

            if (
                type ===
                "production"
            ) {

                title =
                    "Production Report";


                headers = [
                    "Batch",
                    "Supplier",
                    "Input Paddy",
                    "Rice",
                    "Khud",
                    "Tush",
                    "Waste",
                    "Date"
                ];


                rows =
                    filtered.productions.map(
                        function (
                            production
                        ) {

                            return [

                                production.batchId ||
                                    "—",

                                production.supplierName ||
                                    "—",

                                formatQuantity(
                                    production.inputPaddy
                                ) +
                                " kg",

                                formatQuantity(
                                    production.riceProduced
                                ) +
                                " kg",

                                formatQuantity(
                                    production.khudProduced
                                ) +
                                " kg",

                                formatQuantity(
                                    production.tushProduced
                                ) +
                                " kg",

                                formatQuantity(
                                    production.waste
                                ) +
                                " kg",

                                formatDate(
                                    production.date
                                )

                            ];

                        }
                    );

            }


            // --------------------------------------
            // EXPENSE & SALARY
            // --------------------------------------

            if (
                type ===
                "expense"
            ) {

                title =
                    "Expense & Salary Report";


                headers = [
                    "Category",
                    "Description / Employee",
                    "Amount",
                    "Paid",
                    "Due",
                    "Status",
                    "Date / Month"
                ];


                const expenseRows =
                    filtered.expenses.map(
                        function (
                            expense
                        ) {

                            const paid =
                                expense.status ===
                                "paid"
                                    ?
                                    Number(
                                        expense.amount ||
                                        0
                                    )
                                    :
                                    0;


                            const due =
                                expense.status ===
                                "due"
                                    ?
                                    Number(
                                        expense.amount ||
                                        0
                                    )
                                    :
                                    0;


                            return [

                                titleCase(
                                    expense.type
                                ),

                                expense.description ||
                                    "Expense",

                                formatMoney(
                                    expense.amount
                                ),

                                formatMoney(
                                    paid
                                ),

                                formatMoney(
                                    due
                                ),

                                {
                                    isHTML:
                                        true,

                                    value:
                                        statusBadge(
                                            titleCase(
                                                expense.status
                                            ),
                                            expense.status
                                        )
                                },

                                formatDate(
                                    expense.date
                                )

                            ];

                        }
                    );


                const salaryRows =
                    filtered.salaries.map(
                        function (
                            salary
                        ) {

                            return [

                                "Salary",

                                (
                                    salary.employeeName ||
                                    "Employee"
                                ) +
                                " — " +
                                titleCase(
                                    salary.role
                                ),

                                formatMoney(
                                    salary.amount
                                ),

                                formatMoney(
                                    salary.paidAmount
                                ),

                                formatMoney(
                                    salary.dueAmount
                                ),

                                {
                                    isHTML:
                                        true,

                                    value:
                                        statusBadge(
                                            titleCase(
                                                salary.status
                                            ),
                                            salary.status
                                        )
                                },

                                formatMonth(
                                    salary.month
                                )

                            ];

                        }
                    );


                rows = [
                    ...expenseRows,
                    ...salaryRows
                ];

            }


            // --------------------------------------
            // DELIVERY
            // --------------------------------------

            if (
                type ===
                "delivery"
            ) {

                title =
                    "Delivery Report";


                headers = [
                    "Delivery ID",
                    "Customer",
                    "Product",
                    "Quantity",
                    "Destination",
                    "Distance",
                    "Status",
                    "Date"
                ];


                rows =
                    filtered.deliveries.map(
                        function (
                            delivery
                        ) {

                            const date =
                                delivery.createdDate ||
                                delivery.deliveredDate ||
                                delivery.updatedDate;


                            return [

                                delivery.deliveryId ||
                                    "—",

                                delivery.customerName ||
                                    "—",

                                titleCase(
                                    delivery.product
                                ),

                                formatQuantity(
                                    delivery.quantity
                                ) +
                                " kg",

                                delivery.destination ||
                                    "—",

                                delivery.routeDistanceKm !==
                                    null &&
                                delivery.routeDistanceKm !==
                                    undefined
                                    ?
                                    formatQuantity(
                                        delivery.routeDistanceKm
                                    ) +
                                    " km"
                                    :
                                    "—",

                                {
                                    isHTML:
                                        true,

                                    value:
                                        statusBadge(
                                            titleCase(
                                                delivery.status
                                            ),
                                            delivery.status
                                        )
                                },

                                formatDate(
                                    date
                                )

                            ];

                        }
                    );

            }


            // --------------------------------------
            // MAINTENANCE
            // --------------------------------------

            if (
                type ===
                "maintenance"
            ) {

                title =
                    "Maintenance Report";


                headers = [
                    "Machine",
                    "Component",
                    "Type",
                    "Activity",
                    "Cost",
                    "Responsible",
                    "Schedule",
                    "Service Date"
                ];


                rows =
                    filtered.maintenance.map(
                        function (
                            record
                        ) {

                            const schedule =
                                maintenanceSchedule(
                                    record
                                );


                            return [

                                record.machineName ||
                                    "—",

                                record.component ||
                                    "—",

                                titleCase(
                                    record.maintenanceType
                                ),

                                titleCase(
                                    record.serviceType
                                ),

                                formatMoney(
                                    record.cost
                                ),

                                record.technicianName ||
                                    record.technician ||
                                    "—",

                                {
                                    isHTML:
                                        true,

                                    value:
                                        statusBadge(
                                            schedule.text,
                                            schedule.status
                                        )
                                },

                                formatDate(
                                    record.lastServiceDate
                                )

                            ];

                        }
                    );

            }


            // --------------------------------------
            // PROFIT / LOSS
            // --------------------------------------

            if (
                type ===
                "profit-loss"
            ) {

                title =
                    "Profit & Loss Report";


                headers = [
                    "Financial Item",
                    "Amount"
                ];


                rows = [

                    [
                        "Sales Revenue",
                        formatMoney(
                            financials.sales
                        )
                    ],

                    [
                        "Less: Paddy Purchases",
                        formatMoney(
                            financials.purchases
                        )
                    ],

                    [
                        "Less: Operating Expenses",
                        formatMoney(
                            financials.expenses
                        )
                    ],

                    [
                        "Less: Salary Expenses",
                        formatMoney(
                            financials.salaries
                        )
                    ],

                    [
                        "Estimated Net Balance",
                        formatMoney(
                            financials.net
                        )
                    ]

                ];

            }


            setDetailsTable(
                title,
                (
                    type ===
                    "inventory"
                        ?
                        "Current inventory snapshot"
                        :
                        rangeText
                ),
                headers,
                rows
            );


            return {
                title:
                    title,

                headers:
                    headers,

                rows:
                    rows.map(
                        function (
                            row
                        ) {

                            return row.map(
                                function (
                                    cell
                                ) {

                                    if (
                                        cell &&
                                        cell.isHTML
                                    ) {

                                        const div =
                                            document.createElement(
                                                "div"
                                            );


                                        div.innerHTML =
                                            cell.value;


                                        return div.textContent
                                            .trim();

                                    }


                                    return String(
                                        cell ?? ""
                                    );

                                }
                            );

                        }
                    )
            };

        }


        // ==========================================
        // REPORT TYPE NAME
        // ==========================================

        function getReportName(
            type
        ) {

            const names = {

                all:
                    "Overall Report",

                sales:
                    "Sales Report",

                purchase:
                    "Purchase Report",

                inventory:
                    "Inventory Report",

                production:
                    "Production Report",

                expense:
                    "Expense & Salary Report",

                delivery:
                    "Delivery Report",

                maintenance:
                    "Maintenance Report",

                "profit-loss":
                    "Profit & Loss Report"

            };


            return (
                names[type] ||
                "Report"
            );

        }


        // ==========================================
        // GENERATE
        // ==========================================

        function generateReport(
            saveHistory
        ) {

            const type =
                reportTypeSelect.value;


            const fromDate =
                fromDateInput.value;


            const toDate =
                toDateInput.value;


            if (
                !fromDate ||
                !toDate
            ) {

                showToast(
                    "Please select both dates.",
                    "error"
                );


                return;

            }


            if (
                fromDate >
                toDate
            ) {

                showToast(
                    "From Date cannot be after To Date.",
                    "error"
                );


                return;

            }


            const allData =
                getSystemData();


            const filteredData =
                filterSystemData(
                    allData,
                    fromDate,
                    toDate
                );


            const inventory =
                calculateInventory(
                    allData
                );


            const financials =
                calculateFinancials(
                    filteredData
                );


            updateSummary(
                financials,
                filteredData,
                inventory
            );


            renderSalesTrend(
                allData,
                toDate
            );


            renderProfitLossChart(
                allData,
                toDate
            );


            const detailReport =
                renderReportDetails(
                    type,
                    filteredData,
                    allData,
                    inventory,
                    financials,
                    fromDate,
                    toDate
                );


            reportMetaText.textContent =
                getReportName(
                    type
                ) +
                " • " +
                formatDate(
                    fromDate
                ) +
                " to " +
                formatDate(
                    toDate
                );


            currentReport = {

                type:
                    type,

                name:
                    detailReport.title,

                fromDate:
                    fromDate,

                toDate:
                    toDate,

                headers:
                    detailReport.headers,

                rows:
                    detailReport.rows

            };


            if (
                saveHistory
            ) {

                saveGeneratedReport(
                    currentReport
                );


                showToast(
                    "Report generated successfully!"
                );

            }

        }


        // ==========================================
        // FORM
        // ==========================================

        reportsFilterForm.addEventListener(
            "submit",
            function (
                event
            ) {

                event.preventDefault();


                generateReport(
                    true
                );

            }
        );


        // ==========================================
        // REPORT HISTORY
        // ==========================================

        function getGeneratedReports() {

            return getStorageArray(
                "generatedReports"
            );

        }


        function saveGeneratedReport(
            report
        ) {

            const reports =
                getGeneratedReports();


            reports.unshift(
                {
                    id:
                        Date.now(),

                    type:
                        report.type,

                    name:
                        report.name,

                    fromDate:
                        report.fromDate,

                    toDate:
                        report.toDate,

                    generatedBy:
                        getProfileName(),

                    generatedAt:
                        new Date()
                            .toISOString(),

                    status:
                        "ready"
                }
            );


            localStorage.setItem(
                "generatedReports",
                JSON.stringify(
                    reports.slice(
                        0,
                        30
                    )
                )
            );


            displayGeneratedReports();

        }


        function displayGeneratedReports() {

            const reports =
                getGeneratedReports();


            if (
                reports.length ===
                0
            ) {

                generatedReportsTableBody
                    .innerHTML = `

                        <tr class="reports-empty-row">

                            <td colspan="5">

                                No report has been generated yet.

                            </td>

                        </tr>

                    `;


                return;

            }


            generatedReportsTableBody
                .innerHTML =
                reports
                    .slice(
                        0,
                        10
                    )
                    .map(
                        function (
                            report
                        ) {

                            return `

                                <tr>

                                    <td>
                                        ${escapeHTML(
                                            report.name
                                        )}
                                    </td>

                                    <td>

                                        ${escapeHTML(
                                            formatDate(
                                                report.fromDate
                                            )
                                        )}

                                        -

                                        ${escapeHTML(
                                            formatDate(
                                                report.toDate
                                            )
                                        )}

                                    </td>

                                    <td>
                                        ${escapeHTML(
                                            report.generatedBy
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

                                        ${
                                            statusBadge(
                                                "Ready",
                                                "ready"
                                            )
                                        }

                                    </td>

                                </tr>

                            `;

                        }
                    )
                    .join("");

        }


        // ==========================================
        // CSV EXPORT
        // ==========================================

        function csvCell(
            value
        ) {

            return (
                '"' +
                String(
                    value ?? ""
                )
                    .replace(
                        /"/g,
                        '""'
                    ) +
                '"'
            );

        }


        exportReportButton.addEventListener(
            "click",
            function () {

                if (
                    !currentReport
                ) {

                    showToast(
                        "Generate a report first.",
                        "error"
                    );


                    return;

                }


                const rows = [

                    currentReport.headers,

                    ...currentReport.rows

                ];


                const csv =
                    rows
                        .map(
                            function (
                                row
                            ) {

                                return row
                                    .map(
                                        csvCell
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
                            "\uFEFF",
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
                    currentReport.type +
                    "-report-" +
                    currentReport.fromDate +
                    "-to-" +
                    currentReport.toDate +
                    ".csv";


                document.body.appendChild(
                    link
                );


                link.click();


                link.remove();


                URL.revokeObjectURL(
                    url
                );


                showToast(
                    "Report CSV exported successfully!"
                );

            }
        );

            // ==========================================
    // PDF DOWNLOAD
    // ==========================================

    downloadPdfButton.addEventListener(
        "click",
        async function () {

            if (
                !currentReport
            ) {

                showToast(
                    "Generate a report first.",
                    "error"
                );


                return;

            }


            if (
                typeof html2pdf ===
                "undefined"
            ) {

                showToast(
                    "PDF library could not be loaded.",
                    "error"
                );


                return;

            }


            const reportPage =
                document.querySelector(
                    ".reports-page"
                );


            if (
                !reportPage
            ) {

                showToast(
                    "Report content could not be found.",
                    "error"
                );


                return;

            }


            const oldButtonText =
                downloadPdfButton.textContent;


            downloadPdfButton.disabled =
                true;


            downloadPdfButton.textContent =
                "Preparing PDF...";


            document.body.classList.add(
                "pdf-export-mode"
            );


            const safeReportName =
                currentReport.type
                    .replace(
                        /[^a-zA-Z0-9-]/g,
                        "-"
                    );


            const fileName =

                safeReportName +

                "-report-" +

                currentReport.fromDate +

                "-to-" +

                currentReport.toDate +

                ".pdf";


            const options = {

                margin: [
                    8,
                    8,
                    8,
                    8
                ],

                filename:
                    fileName,

                image: {

                    type:
                        "jpeg",

                    quality:
                        0.98

                },

                html2canvas: {

                    scale:
                        2,

                    useCORS:
                        true,

                    scrollY:
                        0,

                    backgroundColor:
                        "#ffffff"

                },

                jsPDF: {

                    unit:
                        "mm",

                    format:
                        "a4",

                    orientation:
                        "portrait"

                },

                pagebreak: {

                    mode: [
                        "css",
                        "legacy"
                    ]

                }

            };


            try {

                await html2pdf()
                    .set(
                        options
                    )
                    .from(
                        reportPage
                    )
                    .save();


                showToast(
                    "Report PDF downloaded successfully!"
                );

            } catch (error) {

                console.error(
                    "PDF generation failed:",
                    error
                );


                showToast(
                    "Could not generate the PDF.",
                    "error"
                );

            } finally {

                document.body.classList.remove(
                    "pdf-export-mode"
                );


                downloadPdfButton.disabled =
                    false;


                downloadPdfButton.textContent =
                    oldButtonText;

            }

        }
    );

        // ==========================================
        // PRINT
        // ==========================================

        printReportButton.addEventListener(
            "click",
            function () {

                if (
                    !currentReport
                ) {

                    showToast(
                        "Generate a report first.",
                        "error"
                    );


                    return;

                }


                window.print();

            }
        );


        // ==========================================
        // TOAST
        // ==========================================

        function showToast(
            message,
            type = "success"
        ) {

            const oldToast =
                document.querySelector(
                    ".reports-toast"
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
                "reports-toast " +
                type;


            toast.textContent =
                message;


            document.body.appendChild(
                toast
            );


            setTimeout(
                function () {

                    toast.classList.add(
                        "show"
                    );

                },
                30
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
                        300
                    );

                },
                2400
            );

        }


        // ==========================================
        // DEFAULT DATE RANGE
        // Current month
        // ==========================================

        function setDefaultDateRange() {

            const today =
                getTodayDate();


            fromDateInput.value =
                getMonthStart(
                    today
                );


            toDateInput.value =
                today;

        }


        // ==========================================
        // INITIAL
        // ==========================================

        loadProfile();


        setDefaultDateRange();


        displayGeneratedReports();


        generateReport(
            false
        );

    }
);