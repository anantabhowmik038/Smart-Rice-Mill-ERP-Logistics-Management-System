document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       SMART RICE MILL ERP
       SALES & INVOICE MANAGEMENT

       RESEARCH-SUPPORTED DESIGN

       1. Trivedi et al. (2018)
          ERP implementation in rice mills:
          integrated ERP, SCM, CRM and
          supply-chain visibility.

       2. Mogbojuri et al. (2022)
          Food-processing inventory:
          FIFO/LIFO identified among important
          inventory strategies.

       3. Azis et al. (2026)
          BERASKU:
          stock, price, distribution,
          digital records and traceability.

       4. Deb et al. (2020)
          Bangladesh rice supply chain:
          price transmission occurs across
          farm, wholesale and retail markets.

       Therefore:
       - price is entered per transaction
       - stock is validated from inventory
       - oldest stock sources are allocated first
       - invoice keeps allocation references
       - invoice voiding preserves audit history
    ========================================= */


    /* =========================================
       PRODUCTS
    ========================================= */

    const PRODUCTS = {

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


    /* =========================================
       ELEMENTS
    ========================================= */

    const salesForm =
        document.getElementById(
            "salesForm"
        );


    if (!salesForm) {
        return;
    }


    const saleDateInput =
        document.getElementById(
            "saleDate"
        );


    const customerSelect =
        document.getElementById(
            "customerSelect"
        );


    const saleProductSelect =
        document.getElementById(
            "saleProduct"
        );


    const availableStockInput =
        document.getElementById(
            "availableStock"
        );


    const saleQuantityInput =
        document.getElementById(
            "saleQuantity"
        );


    const pricePerKgInput =
        document.getElementById(
            "pricePerKg"
        );


    const totalAmountInput =
        document.getElementById(
            "totalAmount"
        );


    const paymentStatusSelect =
        document.getElementById(
            "paymentStatus"
        );


    const amountPaidInput =
        document.getElementById(
            "amountPaid"
        );


    const amountPaidHelp =
        document.getElementById(
            "amountPaidHelp"
        );


    const remainingDueInput =
        document.getElementById(
            "remainingDue"
        );


    const deliveryRequiredSelect =
        document.getElementById(
            "deliveryRequired"
        );


    const salesNotesInput =
        document.getElementById(
            "salesNotes"
        );


    const fifoPreview =
        document.getElementById(
            "fifoPreview"
        );


    const todaySalesValue =
        document.getElementById(
            "todaySalesValue"
        );


    const invoiceCountValue =
        document.getElementById(
            "invoiceCountValue"
        );


    const customerDueValue =
        document.getElementById(
            "customerDueValue"
        );


    const salesSearch =
        document.getElementById(
            "salesSearch"
        );


    const salesStatusFilter =
        document.getElementById(
            "salesStatusFilter"
        );


    const salesTableBody =
        document.getElementById(
            "salesTableBody"
        );


    const invoiceModalBackdrop =
        document.getElementById(
            "invoiceModalBackdrop"
        );


    const closeInvoiceModalBtn =
        document.getElementById(
            "closeInvoiceModalBtn"
        );


    const invoiceModalDoneBtn =
        document.getElementById(
            "invoiceModalDoneBtn"
        );


    const invoiceModalSubtitle =
        document.getElementById(
            "invoiceModalSubtitle"
        );


    const modalCustomer =
        document.getElementById(
            "modalCustomer"
        );


    const modalProduct =
        document.getElementById(
            "modalProduct"
        );


    const modalQuantity =
        document.getElementById(
            "modalQuantity"
        );


    const modalTotal =
        document.getElementById(
            "modalTotal"
        );


    const modalPaid =
        document.getElementById(
            "modalPaid"
        );


    const modalDue =
        document.getElementById(
            "modalDue"
        );


    const modalAllocationList =
        document.getElementById(
            "modalAllocationList"
        );


    const modalDelivery =
        document.getElementById(
            "modalDelivery"
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

    let pendingVoidInvoiceId =
        null;


    /* =========================================
       SAFE STORAGE
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
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    }


    /* =========================================
       FORMAT
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


    function formatMoney(value) {

        return (
            `৳${Number(
                value || 0
            ).toLocaleString(
                "en-US",
                {
                    maximumFractionDigits:
                        2
                }
            )}`
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
       NORMALIZE PRODUCT
    ========================================= */

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
                "rice",
                "wholerice",
                "finishedrice",
                "milledrice"
            ].includes(normalized)
        ) {
            return "wholeRice";
        }


        if (
            [
                "khud",
                "brokenrice",
                "khudbrokenrice"
            ].includes(normalized)
        ) {
            return "khud";
        }


        if (
            [
                "tush",
                "husk",
                "ricehusk",
                "tushhusk"
            ].includes(normalized)
        ) {
            return "tush";
        }


        if (
            [
                "bran",
                "ricebran"
            ].includes(normalized)
        ) {
            return "bran";
        }


        return null;

    }


    /* =========================================
       CUSTOMERS
    ========================================= */

    function loadCustomers() {

        let data =
            safeParseStorage(
                "customers",
                null
            );


        if (!Array.isArray(data)) {

            data =
                safeParseStorage(
                    "customerRecords",
                    []
                );

        }


        return data
            .map(
                function (
                    customer,
                    index
                ) {

                    return {

                        id:

                            customer.id ??
                            customer.customerId ??
                            index + 1,


                        customerCode:

                            customer.customerCode ||
                            customer.code ||
                            "",


                        name:

                            customer.name ||
                            customer.customerName ||
                            `Customer ${index + 1}`,


                        phone:

                            customer.phone ||
                            customer.phoneNumber ||
                            "",


                        address:

                            customer.address ||
                            ""

                    };

                }
            )
            .filter(
                function (customer) {

                    return Boolean(
                        customer.name
                    );

                }
            );

    }


    let customers =
        loadCustomers();


    function populateCustomers() {

        customerSelect.innerHTML = `

            <option value=""
                    selected
                    disabled>

                Select customer

            </option>

        `;


        customers.forEach(
            function (customer) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    customer.id;


                option.textContent =

                    customer.phone

                        ?

                        `${customer.name} — ${customer.phone}`

                        :

                        customer.name;


                customerSelect.appendChild(
                    option
                );

            }
        );


        if (
            customers.length === 0
        ) {

            const option =
                document.createElement(
                    "option"
                );


            option.disabled =
                true;


            option.textContent =
                "No customers found — add a customer first";


            customerSelect.appendChild(
                option
            );

        }

    }


    function findCustomer(id) {

        return customers.find(
            function (customer) {

                return (
                    String(customer.id) ===
                    String(id)
                );

            }
        );

    }


    /* =========================================
       PRODUCTION
    ========================================= */

    function getProductionRecords() {

        const main =
            safeParseStorage(
                "productionRecords",
                null
            );


        if (Array.isArray(main)) {
            return main;
        }


        return safeParseStorage(
            "productions",
            []
        );

    }


    function getProductionQuantity(
        record,
        product
    ) {

        if (
            product ===
            "wholeRice"
        ) {

            return Number(
                record.riceProduced ||
                record.rice ||
                0
            );

        }


        if (
            product ===
            "khud"
        ) {

            return Number(
                record.khudProduced ||
                record.khud ||
                record.brokenRice ||
                0
            );

        }


        if (
            product ===
            "tush"
        ) {

            return Number(
                record.tushProduced ||
                record.tush ||
                record.husk ||
                0
            );

        }


        if (
            product ===
            "bran"
        ) {

            return Number(
                record.branProduced ||
                record.bran ||
                0
            );

        }


        return 0;

    }


    /* =========================================
       ADJUSTMENTS
    ========================================= */

    function getAdjustments() {

        const data =
            safeParseStorage(
                "inventoryAdjustments",
                []
            );


        return Array.isArray(data)
            ? data
            : [];

    }


    /* =========================================
       SALES NORMALIZATION
    ========================================= */

    function normalizePaymentStatus(value) {

        const status =
            String(
                value || ""
            ).toLowerCase();


        if (
            status === "paid"
        ) {
            return "paid";
        }


        if (
            status === "partial" ||
            status === "partially paid"
        ) {
            return "partial";
        }


        return "due";

    }


    function loadSales() {

        let data =
            safeParseStorage(
                "salesRecords",
                null
            );


        if (!Array.isArray(data)) {

            data =
                safeParseStorage(
                    "sales",
                    []
                );

        }


        return data.map(
            function (
                sale,
                index
            ) {

                const productKey =
                    normalizeProductKey(

                        sale.productKey ||
                        sale.product ||
                        sale.productType ||
                        sale.riceType

                    );


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
                        ).toLowerCase();


                    if (
                        unit === "kg" ||
                        unit === "kilogram" ||
                        unit === "kilograms"
                    ) {

                        quantityKg =
                            Number(
                                sale.quantity ||
                                0
                            );

                    }

                }


                const pricePerKg =
                    Number(
                        sale.pricePerKg ||
                        sale.unitPrice ||
                        sale.price ||
                        0
                    );


                const totalAmount =
                    Number(
                        sale.totalAmount ||
                        sale.total ||
                        (
                            quantityKg *
                            pricePerKg
                        ) ||
                        0
                    );


                const paymentStatus =
                    normalizePaymentStatus(
                        sale.paymentStatus ||
                        sale.payment
                    );


                let amountPaid =
                    Number(
                        sale.amountPaid ||
                        0
                    );


                if (
                    paymentStatus ===
                    "paid"
                ) {

                    amountPaid =
                        totalAmount;

                }


                if (
                    paymentStatus ===
                    "due"
                ) {

                    amountPaid =
                        0;

                }


                const dueAmount =
                    Math.max(
                        Number(
                            sale.dueAmount ??
                            (
                                totalAmount -
                                amountPaid
                            )
                        ),
                        0
                    );


                return {

                    id:

                        sale.id ??
                        Date.now() +
                        index,


                    invoiceId:

                        sale.invoiceId ||
                        sale.invoiceNumber ||
                        sale.saleId ||
                        `INV-${String(
                            index + 1
                        ).padStart(
                            3,
                            "0"
                        )}`,


                    customerId:

                        sale.customerId ||
                        "",


                    customerName:

                        sale.customerName ||
                        sale.customer ||
                        "Not Recorded",


                    productKey:
                        productKey,


                    quantityKg:
                        quantityKg,


                    pricePerKg:
                        pricePerKg,


                    totalAmount:
                        totalAmount,


                    paymentStatus:
                        paymentStatus,


                    amountPaid:
                        amountPaid,


                    dueAmount:
                        dueAmount,


                    deliveryRequired:

                        sale.deliveryRequired === true ||
                        sale.deliveryRequired === "yes" ||
                        sale.delivery === "yes",


                    deliveryStatus:

                        sale.deliveryStatus ||
                        (
                            sale.deliveryRequired === true ||
                            sale.deliveryRequired === "yes"

                                ?

                                "pending"

                                :

                                "not-required"
                        ),


                    saleDate:

                        sale.saleDate ||
                        sale.invoiceDate ||
                        sale.date ||
                        getTodayDate(),


                    notes:

                        sale.notes ||
                        "",


                    fifoAllocations:

                        Array.isArray(
                            sale.fifoAllocations
                        )

                            ?

                            sale.fifoAllocations

                            :

                            [],


                    status:

                        sale.status ===
                        "voided"

                            ?

                            "voided"

                            :

                            "active",


                    voidedDate:

                        sale.voidedDate ||
                        null,


                    voidedAt:

                        sale.voidedAt ||
                        null,


                    createdAt:

                        sale.createdAt ||
                        sale.id ||
                        Date.now()

                };

            }
        );

    }


    let salesRecords =
        loadSales();


    function saveSales() {

        localStorage.setItem(
            "salesRecords",
            JSON.stringify(
                salesRecords
            )
        );

    }


    /*
        Immediately normalize old records
        into the new key so Inventory and
        Delivery modules can use one source.
    */

    saveSales();


    /* =========================================
       INVOICE ID
    ========================================= */

    function generateInvoiceId() {

        const numbers =
            salesRecords

                .map(
                    function (sale) {

                        const match =
                            String(
                                sale.invoiceId ||
                                ""
                            ).match(
                                /^INV-(\d+)$/i
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
            `INV-${String(
                next
            ).padStart(
                3,
                "0"
            )}`
        );

    }


    /* =========================================
       AVAILABLE INVENTORY
    ========================================= */

    function getProductionStock(
        product
    ) {

        return getProductionRecords()
            .reduce(
                function (
                    total,
                    record
                ) {

                    return (

                        total +
                        getProductionQuantity(
                            record,
                            product
                        )

                    );

                },
                0
            );

    }


    function getAdjustmentNet(
        product
    ) {

        return getAdjustments()
            .filter(
                function (adjustment) {

                    return (
                        normalizeProductKey(
                            adjustment.product
                        ) ===
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


                    return (

                        adjustment.type ===
                        "out"

                            ?

                            total - quantity

                            :

                            total + quantity

                    );

                },
                0
            );

    }


    function getActiveSalesQuantity(
        product
    ) {

        return salesRecords

            .filter(
                function (sale) {

                    return (

                        sale.status !==
                        "voided"

                        &&

                        sale.productKey ===
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
                            sale.quantityKg ||
                            0
                        )
                    );

                },
                0
            );

    }


    function getAvailableStock(
        product
    ) {

        if (!PRODUCTS[product]) {
            return 0;
        }


        return (

            getProductionStock(
                product
            )

            +

            getAdjustmentNet(
                product
            )

            -

            getActiveSalesQuantity(
                product
            )

        );

    }


    /* =========================================
       FIFO EVENTS
    ========================================= */

    function buildFIFOEvents(
        product
    ) {

        const events =
            [];


        /*
            Production outputs = FIFO supply lots.
        */

        getProductionRecords().forEach(
            function (
                record,
                index
            ) {

                const quantity =
                    getProductionQuantity(
                        record,
                        product
                    );


                if (
                    quantity <= 0
                ) {
                    return;
                }


                events.push({

                    type:
                        "supply",

                    sourceType:
                        "Production",

                    reference:

                        record.batchId ||
                        record.batch ||
                        `PROD-${index + 1}`,

                    purchaseReference:

                        record.purchaseId ||
                        "",

                    quantity:
                        quantity,

                    date:

                        record.productionDate ||
                        record.date ||
                        getTodayDate(),

                    createdAt:

                        Number(
                            record.createdAt ||
                            record.id ||
                            index
                        )

                });

            }
        );


        /*
            Manual Stock In creates an
            additional traceable stock source.

            Manual Stock Out consumes FIFO stock.
        */

        getAdjustments().forEach(
            function (
                adjustment,
                index
            ) {

                if (
                    normalizeProductKey(
                        adjustment.product
                    ) !==
                    product
                ) {
                    return;
                }


                const quantity =
                    Number(
                        adjustment.quantity ||
                        0
                    );


                if (
                    quantity <= 0
                ) {
                    return;
                }


                events.push({

                    type:

                        adjustment.type ===
                        "out"

                            ?

                            "consume"

                            :

                            "supply",

                    sourceType:

                        adjustment.type ===
                        "out"

                            ?

                            "Stock Adjustment Out"

                            :

                            "Stock Adjustment",

                    reference:

                        adjustment.adjustmentId ||
                        `ADJ-${index + 1}`,

                    purchaseReference:
                        "",

                    quantity:
                        quantity,

                    date:

                        adjustment.date ||
                        getTodayDate(),

                    createdAt:

                        Number(
                            adjustment.createdAt ||
                            adjustment.id ||
                            index
                        )

                });

            }
        );


        /*
            Active invoices consume stock.

            Voided invoices have zero current
            stock effect and are therefore not
            included in the FIFO balance.
        */

        salesRecords.forEach(
            function (
                sale,
                index
            ) {

                if (
                    sale.status ===
                    "voided" ||
                    sale.productKey !==
                    product ||
                    sale.quantityKg <=
                    0
                ) {
                    return;
                }


                events.push({

                    type:
                        "consume",

                    sourceType:
                        "Sales",

                    reference:
                        sale.invoiceId,

                    purchaseReference:
                        "",

                    quantity:
                        sale.quantityKg,

                    date:
                        sale.saleDate,

                    createdAt:

                        Number(
                            sale.createdAt ||
                            sale.id ||
                            index
                        )

                });

            }
        );


        return events.sort(
            function (a, b) {

                const dateCompare =
                    String(
                        a.date
                    ).localeCompare(
                        String(
                            b.date
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
       REMAINING FIFO LOTS
    ========================================= */

    function getRemainingFIFOLots(
        product
    ) {

        const lots =
            [];


        const events =
            buildFIFOEvents(
                product
            );


        events.forEach(
            function (event) {

                if (
                    event.type ===
                    "supply"
                ) {

                    lots.push({

                        sourceType:
                            event.sourceType,

                        reference:
                            event.reference,

                        purchaseReference:
                            event.purchaseReference,

                        date:
                            event.date,

                        originalQuantity:
                            event.quantity,

                        remainingQuantity:
                            event.quantity

                    });


                    return;

                }


                let remainingToConsume =
                    event.quantity;


                for (
                    const lot of
                    lots
                ) {

                    if (
                        remainingToConsume <=
                        0
                    ) {
                        break;
                    }


                    if (
                        lot.remainingQuantity <=
                        0
                    ) {
                        continue;
                    }


                    const quantityUsed =
                        Math.min(
                            lot.remainingQuantity,
                            remainingToConsume
                        );


                    lot.remainingQuantity -=
                        quantityUsed;


                    remainingToConsume -=
                        quantityUsed;

                }

            }
        );


        return lots.filter(
            function (lot) {

                return (
                    lot.remainingQuantity >
                    0.000001
                );

            }
        );

    }


    /* =========================================
       ALLOCATE FIFO
    ========================================= */

    function allocateFIFO(
        product,
        requestedQuantity
    ) {

        const quantity =
            Number(
                requestedQuantity ||
                0
            );


        const lots =
            getRemainingFIFOLots(
                product
            );


        const allocations =
            [];


        let remaining =
            quantity;


        for (
            const lot of
            lots
        ) {

            if (
                remaining <=
                0
            ) {
                break;
            }


            const allocated =
                Math.min(
                    lot.remainingQuantity,
                    remaining
                );


            if (
                allocated <=
                0
            ) {
                continue;
            }


            allocations.push({

                sourceType:
                    lot.sourceType,

                reference:
                    lot.reference,

                purchaseReference:
                    lot.purchaseReference,

                sourceDate:
                    lot.date,

                quantityKg:
                    allocated

            });


            remaining -=
                allocated;

        }


        return {

            allocations:
                allocations,

            requestedQuantity:
                quantity,

            allocatedQuantity:

                quantity -
                remaining,

            unallocatedQuantity:
                remaining

        };

    }


    /* =========================================
       AVAILABLE STOCK UI
    ========================================= */

    function updateAvailableStock() {

        const product =
            saleProductSelect.value;


        if (
            !product ||
            !PRODUCTS[product]
        ) {

            availableStockInput.value =
                "Select product first";


            updateFIFOPreview();

            return;

        }


        const stock =
            getAvailableStock(
                product
            );


        availableStockInput.value =
            `${formatNumber(
                stock
            )} kg`;


        updateFIFOPreview();

    }


    /* =========================================
       MONEY CALCULATION
    ========================================= */

    function calculateInvoiceAmounts() {

        const quantity =
            Math.max(
                Number(
                    saleQuantityInput.value ||
                    0
                ),
                0
            );


        const price =
            Math.max(
                Number(
                    pricePerKgInput.value ||
                    0
                ),
                0
            );


        const total =
            quantity *
            price;


        const paymentStatus =
            paymentStatusSelect.value;


        let paid =
            0;


        if (
            paymentStatus ===
            "paid"
        ) {

            paid =
                total;


            amountPaidInput.disabled =
                true;


            amountPaidInput.value =
                total > 0
                    ? total.toFixed(2)
                    : "0";


            amountPaidHelp.textContent =
                "Full invoice amount will be recorded as paid.";

        }
        else if (
            paymentStatus ===
            "due"
        ) {

            paid =
                0;


            amountPaidInput.disabled =
                true;


            amountPaidInput.value =
                "0";


            amountPaidHelp.textContent =
                "The full invoice amount will remain due.";

        }
        else if (
            paymentStatus ===
            "partial"
        ) {

            amountPaidInput.disabled =
                false;


            paid =
                Math.max(
                    Number(
                        amountPaidInput.value ||
                        0
                    ),
                    0
                );


            amountPaidHelp.textContent =
                "Enter the amount received from the customer.";

        }
        else {

            amountPaidInput.disabled =
                true;


            amountPaidInput.value =
                "0";


            amountPaidHelp.textContent =
                "Select payment status first.";

        }


        const due =
            Math.max(
                total -
                paid,
                0
            );


        totalAmountInput.value =
            formatMoney(
                total
            );


        remainingDueInput.value =
            formatMoney(
                due
            );


        return {

            quantity,
            price,
            total,
            paid,
            due

        };

    }


    /* =========================================
       FIFO PREVIEW
    ========================================= */

    function updateFIFOPreview() {

        const product =
            saleProductSelect.value;


        const quantity =
            Number(
                saleQuantityInput.value ||
                0
            );


        fifoPreview.classList.remove(
            "fifo-error"
        );


        if (
            !product ||
            !PRODUCTS[product]
        ) {

            fifoPreview.innerHTML =
                "Select a product and enter quantity to preview stock allocation.";


            return;

        }


        const available =
            getAvailableStock(
                product
            );


        if (
            quantity <= 0
        ) {

            const lots =
                getRemainingFIFOLots(
                    product
                );


            if (
                lots.length === 0
            ) {

                fifoPreview.innerHTML =

                    `No traceable ${escapeHTML(
                        PRODUCTS[product].label
                    )} stock is currently available.`;


                return;

            }


            fifoPreview.innerHTML =

                `Available: <strong>${formatNumber(
                    available
                )} kg</strong>. Enter quantity to see FIFO source allocation.`;


            return;

        }


        if (
            quantity >
            available
        ) {

            fifoPreview.classList.add(
                "fifo-error"
            );


            fifoPreview.innerHTML =

                `Requested ${formatNumber(
                    quantity
                )} kg exceeds the available stock of ${formatNumber(
                    available
                )} kg.`;


            return;

        }


        const allocation =
            allocateFIFO(
                product,
                quantity
            );


        if (
            allocation.unallocatedQuantity >
            0.000001
        ) {

            fifoPreview.classList.add(
                "fifo-error"
            );


            fifoPreview.innerHTML =

                `Inventory quantity exists, but ${formatNumber(
                    allocation.unallocatedQuantity
                )} kg cannot be traced to an available FIFO source. Review inventory movements.`;


            return;

        }


        fifoPreview.innerHTML = `

            <div class="fifo-allocation-list">

                ${allocation.allocations
                    .map(
                        function (item) {

                            return `

                                <span class="fifo-allocation-chip">

                                    ${escapeHTML(
                                        item.reference
                                    )}
                                    ·
                                    ${formatDate(
                                        item.sourceDate
                                    )}
                                    ·
                                    <strong>
                                        ${formatNumber(
                                            item.quantityKg
                                        )} kg
                                    </strong>

                                </span>

                            `;

                        }
                    )
                    .join("")}

            </div>

        `;

    }


    /* =========================================
       VALIDATION
    ========================================= */

    function validateInvoice() {

        if (
            !saleDateInput.value
        ) {

            return (
                "Please select the invoice date."
            );

        }


        if (
            saleDateInput.value >
            getTodayDate()
        ) {

            return (
                "Invoice date cannot be in the future."
            );

        }


        const customer =
            findCustomer(
                customerSelect.value
            );


        if (!customer) {

            return (
                "Please select a valid customer."
            );

        }


        const product =
            saleProductSelect.value;


        if (
            !product ||
            !PRODUCTS[product]
        ) {

            return (
                "Please select a product."
            );

        }


        const amounts =
            calculateInvoiceAmounts();


        if (
            !Number.isFinite(
                amounts.quantity
            ) ||
            amounts.quantity <= 0
        ) {

            return (
                "Sale quantity must be greater than zero."
            );

        }


        const available =
            getAvailableStock(
                product
            );


        if (
            amounts.quantity >
            available
        ) {

            return (

                `Requested quantity exceeds the available stock of ${formatNumber(
                    available
                )} kg.`

            );

        }


        if (
            !Number.isFinite(
                amounts.price
            ) ||
            amounts.price <= 0
        ) {

            return (
                "Price per kg must be greater than zero."
            );

        }


        if (
            !paymentStatusSelect.value
        ) {

            return (
                "Please select a payment status."
            );

        }


        if (
            paymentStatusSelect.value ===
            "partial"
        ) {

            if (
                amounts.paid <= 0
            ) {

                return (
                    "Enter the amount received for a partially paid invoice."
                );

            }


            if (
                amounts.paid >=
                amounts.total
            ) {

                return (
                    "For partial payment, amount paid must be less than the total invoice amount."
                );

            }

        }


        if (
            !deliveryRequiredSelect.value
        ) {

            return (
                "Please select whether delivery is required."
            );

        }


        const fifo =
            allocateFIFO(
                product,
                amounts.quantity
            );


        if (
            fifo.unallocatedQuantity >
            0.000001
        ) {

            return (
                "The requested stock cannot be fully traced to available FIFO sources. Review Inventory first."
            );

        }


        return "";

    }


    /* =========================================
       BUILD INVOICE
    ========================================= */

    function buildInvoice() {

        const customer =
            findCustomer(
                customerSelect.value
            );


        const product =
            saleProductSelect.value;


        const amounts =
            calculateInvoiceAmounts();


        const fifo =
            allocateFIFO(
                product,
                amounts.quantity
            );


        return {

            id:
                Date.now(),


            invoiceId:
                generateInvoiceId(),


            customerId:
                customer.id,


            customerName:
                customer.name,


            customerPhone:
                customer.phone,


            customerAddress:
                customer.address,


            productKey:
                product,


            product:
                PRODUCTS[product]
                    .label,


            quantityKg:
                amounts.quantity,


            unit:
                "kg",


            pricePerKg:
                amounts.price,


            totalAmount:
                amounts.total,


            paymentStatus:
                paymentStatusSelect.value,


            amountPaid:
                amounts.paid,


            dueAmount:
                amounts.due,


            deliveryRequired:

                deliveryRequiredSelect.value ===
                "yes",


            deliveryStatus:

                deliveryRequiredSelect.value ===
                "yes"

                    ?

                    "pending"

                    :

                    "not-required",


            saleDate:
                saleDateInput.value,


            notes:
                salesNotesInput.value
                    .trim(),


            fifoAllocations:
                fifo.allocations,


            status:
                "active",


            voidedDate:
                null,


            voidedAt:
                null,


            createdAt:
                Date.now()

        };

    }


    /* =========================================
       SUMMARY
    ========================================= */

    function updateSummaryCards() {

        const today =
            getTodayDate();


        let todaySales =
            0;


        let activeInvoices =
            0;


        let totalDue =
            0;


        salesRecords.forEach(
            function (sale) {

                if (
                    sale.status ===
                    "voided"
                ) {
                    return;
                }


                activeInvoices +=
                    1;


                totalDue +=
                    Number(
                        sale.dueAmount ||
                        0
                    );


                if (
                    sale.saleDate ===
                    today
                ) {

                    todaySales +=
                        Number(
                            sale.totalAmount ||
                            0
                        );

                }

            }
        );


        todaySalesValue.textContent =
            formatMoney(
                todaySales
            );


        invoiceCountValue.textContent =
            activeInvoices;


        customerDueValue.textContent =
            formatMoney(
                totalDue
            );

    }


    /* =========================================
       PAYMENT LABEL
    ========================================= */

    function getPaymentInfo(status) {

        if (
            status === "paid"
        ) {

            return {
                text: "Paid",
                className: "payment-paid"
            };

        }


        if (
            status === "partial"
        ) {

            return {
                text: "Partial",
                className: "payment-partial"
            };

        }


        return {
            text: "Due",
            className: "payment-due"
        };

    }


    /* =========================================
       ACTION HTML
    ========================================= */

    function getInvoiceActionHTML(sale) {

        if (
            sale.status ===
            "voided"
        ) {

            return `

                <button
                    class="invoice-view-button"
                    type="button"
                    data-action="view"
                    data-id="${sale.id}"
                >
                    View
                </button>

            `;

        }


        const waiting =

            Number(
                pendingVoidInvoiceId
            )

            ===

            Number(
                sale.id
            );


        if (waiting) {

            return `

                <span class="invoice-void-question">
                    Void?
                </span>


                <button
                    class="invoice-confirm-void-button"
                    type="button"
                    data-action="confirm-void"
                    data-id="${sale.id}"
                >
                    Confirm
                </button>


                <button
                    class="invoice-cancel-void-button"
                    type="button"
                    data-action="cancel-void"
                    data-id="${sale.id}"
                >
                    Cancel
                </button>

            `;

        }


        return `

            <button
                class="invoice-view-button"
                type="button"
                data-action="view"
                data-id="${sale.id}"
            >
                View
            </button>


            <button
                class="invoice-void-button"
                type="button"
                data-action="request-void"
                data-id="${sale.id}"
            >
                Void
            </button>

        `;

    }


    /* =========================================
       TABLE
    ========================================= */

    function displaySales() {

        const searchText =
            salesSearch.value
                .trim()
                .toLowerCase();


        const statusFilter =
            salesStatusFilter.value;


        const filtered =
            salesRecords.filter(
                function (sale) {

                    const searchable = `

                        ${sale.invoiceId}
                        ${sale.customerName}
                        ${sale.product}
                        ${sale.productKey}

                    `.toLowerCase();


                    const matchesSearch =
                        searchable.includes(
                            searchText
                        );


                    const matchesStatus =

                        statusFilter ===
                        "all"

                        ||

                        sale.status ===
                        statusFilter;


                    return (
                        matchesSearch &&
                        matchesStatus
                    );

                }
            );


        salesTableBody.innerHTML =
            "";


        if (
            filtered.length ===
            0
        ) {

            salesTableBody.innerHTML = `

                <tr class="sales-empty-row">

                    <td colspan="13">

                        No sales invoices match the current filter.

                    </td>

                </tr>

            `;


            return;

        }


        [...filtered]

            .sort(
                function (a, b) {

                    return (

                        String(
                            b.saleDate
                        ).localeCompare(
                            String(
                                a.saleDate
                            )
                        )

                        ||

                        Number(
                            b.createdAt ||
                            b.id
                        )

                        -

                        Number(
                            a.createdAt ||
                            a.id
                        )

                    );

                }
            )

            .forEach(
                function (sale) {

                    const payment =
                        getPaymentInfo(
                            sale.paymentStatus
                        );


                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `

                        <td>

                            <span class="invoice-number">

                                ${escapeHTML(
                                    sale.invoiceId
                                )}

                            </span>

                        </td>


                        <td>

                            ${formatDate(
                                sale.saleDate
                            )}

                        </td>


                        <td>

                            ${escapeHTML(
                                sale.customerName
                            )}

                        </td>


                        <td>

                            ${escapeHTML(
                                sale.product ||
                                PRODUCTS[
                                    sale.productKey
                                ]?.label ||
                                "—"
                            )}

                        </td>


                        <td>

                            ${formatNumber(
                                sale.quantityKg
                            )} kg

                        </td>


                        <td>

                            ${formatMoney(
                                sale.pricePerKg
                            )}

                        </td>


                        <td>

                            <strong>

                                ${formatMoney(
                                    sale.totalAmount
                                )}

                            </strong>

                        </td>


                        <td>

                            ${formatMoney(
                                sale.amountPaid
                            )}

                        </td>


                        <td>

                            ${formatMoney(
                                sale.dueAmount
                            )}

                        </td>


                        <td>

                            <span
                                class="
                                    payment-badge
                                    ${payment.className}
                                "
                            >

                                ${payment.text}

                            </span>

                        </td>


                        <td>

                            <span
                                class="
                                    delivery-badge
                                    ${
                                        sale.deliveryRequired

                                            ?

                                            "delivery-required"

                                            :

                                            "delivery-not-required"
                                    }
                                "
                            >

                                ${
                                    sale.deliveryRequired

                                        ?

                                        "Required"

                                        :

                                        "Not Required"
                                }

                            </span>

                        </td>


                        <td>

                            <span
                                class="
                                    invoice-status-badge
                                    ${
                                        sale.status ===
                                        "voided"

                                            ?

                                            "status-voided"

                                            :

                                            "status-active"
                                    }
                                "
                            >

                                ${
                                    sale.status ===
                                    "voided"

                                        ?

                                        "Voided"

                                        :

                                        "Active"
                                }

                            </span>

                        </td>


                        <td class="sales-action-cell">

                            ${getInvoiceActionHTML(
                                sale
                            )}

                        </td>

                    `;


                    salesTableBody.appendChild(
                        row
                    );

                }
            );

    }


    /* =========================================
       RESET FORM
    ========================================= */

    function resetSalesForm() {

        salesForm.reset();


        saleDateInput.value =
            getTodayDate();


        availableStockInput.value =
            "Select product first";


        amountPaidInput.value =
            "0";


        amountPaidInput.disabled =
            true;


        amountPaidHelp.textContent =
            "Select payment status first.";


        totalAmountInput.value =
            "৳0";


        remainingDueInput.value =
            "৳0";


        fifoPreview.classList.remove(
            "fifo-error"
        );


        fifoPreview.innerHTML =
            "Select a product and enter quantity to preview stock allocation.";

    }


    /* =========================================
       SUBMIT
    ========================================= */

    salesForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            pendingVoidInvoiceId =
                null;


            const error =
                validateInvoice();


            if (error) {

                showToast(
                    error,
                    "error"
                );

                return;

            }


            const invoice =
                buildInvoice();


            salesRecords.push(
                invoice
            );


            saveSales();


            updateSummaryCards();

            displaySales();

            resetSalesForm();


            showToast(

                `${invoice.invoiceId} generated successfully. Inventory stock has been reserved for this sale.`

            );

        }
    );


    /* =========================================
       VOID INVOICE
    ========================================= */

    function requestVoidInvoice(id) {

        pendingVoidInvoiceId =
            id;


        displaySales();

    }


    function cancelVoidInvoice() {

        pendingVoidInvoiceId =
            null;


        displaySales();

    }


    function confirmVoidInvoice(id) {

        const sale =
            salesRecords.find(
                function (item) {

                    return (
                        Number(item.id) ===
                        Number(id)
                    );

                }
            );


        if (!sale) {

            pendingVoidInvoiceId =
                null;


            displaySales();


            showToast(
                "Invoice record not found.",
                "error"
            );


            return;

        }


        if (
            sale.status ===
            "voided"
        ) {

            pendingVoidInvoiceId =
                null;


            displaySales();


            showToast(
                "This invoice is already voided.",
                "error"
            );


            return;

        }


        sale.status =
            "voided";


        sale.voidedDate =
            getTodayDate();


        sale.voidedAt =
            Date.now();


        /*
            Delivery must not continue for
            a voided invoice.
        */

        if (
            sale.deliveryRequired
        ) {

            sale.deliveryStatus =
                "cancelled";

        }


        pendingVoidInvoiceId =
            null;


        saveSales();


        updateSummaryCards();

        updateAvailableStock();

        displaySales();


        showToast(

            `${sale.invoiceId} voided successfully. The stock has been restored to inventory.`

        );

    }


    /* =========================================
       VIEW INVOICE
    ========================================= */

    function showInvoice(id) {

        const sale =
            salesRecords.find(
                function (item) {

                    return (
                        Number(item.id) ===
                        Number(id)
                    );

                }
            );


        if (!sale) {
            return;
        }


        invoiceModalSubtitle.textContent =

            `${sale.invoiceId} · ${formatDate(
                sale.saleDate
            )} · ${
                sale.status === "voided"
                    ? "Voided"
                    : "Active"
            }`;


        modalCustomer.textContent =
            sale.customerName;


        modalProduct.textContent =

            sale.product ||
            PRODUCTS[
                sale.productKey
            ]?.label ||
            "—";


        modalQuantity.textContent =
            `${formatNumber(
                sale.quantityKg
            )} kg`;


        modalTotal.textContent =
            formatMoney(
                sale.totalAmount
            );


        modalPaid.textContent =
            formatMoney(
                sale.amountPaid
            );


        modalDue.textContent =
            formatMoney(
                sale.dueAmount
            );


        modalAllocationList.innerHTML =
            "";


        if (
            sale.fifoAllocations.length ===
            0
        ) {

            modalAllocationList.innerHTML = `

                <div class="modal-allocation-item">

                    <span>
                        No FIFO allocation information available
                        for this legacy invoice.
                    </span>

                </div>

            `;

        }
        else {

            sale.fifoAllocations.forEach(
                function (allocation) {

                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "modal-allocation-item";


                    item.innerHTML = `

                        <span>

                            ${escapeHTML(
                                allocation.reference
                            )}
                            ·
                            ${formatDate(
                                allocation.sourceDate
                            )}

                        </span>


                        <strong>

                            ${formatNumber(
                                allocation.quantityKg
                            )} kg

                        </strong>

                    `;


                    modalAllocationList.appendChild(
                        item
                    );

                }
            );

        }


        modalDelivery.textContent =

            sale.deliveryRequired

                ?

                `Delivery required · Status: ${String(
                    sale.deliveryStatus
                ).replace("-", " ")}`

                :

                "Delivery not required";


        invoiceModalBackdrop.hidden =
            false;


        document.body.style.overflow =
            "hidden";

    }


    function closeInvoiceModal() {

        invoiceModalBackdrop.hidden =
            true;


        document.body.style.overflow =
            "";

    }


    /* =========================================
       TABLE ACTIONS
    ========================================= */

    salesTableBody.addEventListener(
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
                action === "view"
            ) {

                showInvoice(id);

                return;

            }


            if (
                action ===
                "request-void"
            ) {

                requestVoidInvoice(id);

                return;

            }


            if (
                action ===
                "confirm-void"
            ) {

                confirmVoidInvoice(id);

                return;

            }


            if (
                action ===
                "cancel-void"
            ) {

                cancelVoidInvoice();

            }

        }
    );


    /* =========================================
       MODAL EVENTS
    ========================================= */

    closeInvoiceModalBtn.addEventListener(
        "click",
        closeInvoiceModal
    );


    invoiceModalDoneBtn.addEventListener(
        "click",
        closeInvoiceModal
    );


    invoiceModalBackdrop.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                invoiceModalBackdrop
            ) {

                closeInvoiceModal();

            }

        }
    );


    /* =========================================
       FORM EVENTS
    ========================================= */

    saleProductSelect.addEventListener(
        "change",
        updateAvailableStock
    );


    saleQuantityInput.addEventListener(
        "input",
        function () {

            calculateInvoiceAmounts();

            updateFIFOPreview();

        }
    );


    pricePerKgInput.addEventListener(
        "input",
        calculateInvoiceAmounts
    );


    paymentStatusSelect.addEventListener(
        "change",
        calculateInvoiceAmounts
    );


    amountPaidInput.addEventListener(
        "input",
        calculateInvoiceAmounts
    );


    salesSearch.addEventListener(
        "input",
        function () {

            pendingVoidInvoiceId =
                null;


            displaySales();

        }
    );


    salesStatusFilter.addEventListener(
        "change",
        function () {

            pendingVoidInvoiceId =
                null;


            displaySales();

        }
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
                ".sales-toast"
            );


        if (oldToast) {
            oldToast.remove();
        }


        const toast =
            document.createElement(
                "div"
            );


        toast.className =
            `sales-toast ${type}`;


        toast.innerHTML = `

            <span class="sales-toast-icon">

                ${
                    type === "error"
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
            2800
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
            invoiceModalBackdrop.hidden
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
                !invoiceModalBackdrop.hidden
            ) {

                closeInvoiceModal();

                return;

            }


            if (
                pendingVoidInvoiceId !==
                null
            ) {

                pendingVoidInvoiceId =
                    null;


                displaySales();


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

    saleDateInput.value =
        getTodayDate();


    populateCustomers();

    calculateInvoiceAmounts();

    updateAvailableStock();

    updateSummaryCards();

    displaySales();

});