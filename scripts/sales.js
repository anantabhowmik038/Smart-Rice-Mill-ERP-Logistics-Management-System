document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // ELEMENTS
    // ==========================================

    const salesForm =
        document.getElementById("salesForm");

    const customerSelect =
        document.getElementById("customer-name");

    const productSelect =
        document.getElementById("product");

    const availableStockInput =
        document.getElementById("available-stock");

    const quantityInput =
        document.getElementById("quantity");

    const priceInput =
        document.getElementById("price");

    const totalAmountInput =
        document.getElementById("total-amount");

    const paymentStatus =
        document.getElementById("payment-status");

    const salesPartialField =
        document.getElementById("salesPartialField");

    const paidAmountInput =
        document.getElementById("paid-amount");

    const salesBalanceText =
        document.getElementById("salesBalanceText");

    const deliveryRequired =
        document.getElementById("delivery-required");

    const generateInvoiceBtn =
        document.getElementById("generateInvoiceBtn");

    const salesTableBody =
        document.getElementById("salesTableBody");


    // Summary

    const todaySalesValue =
        document.getElementById("todaySalesValue");

    const invoiceCountValue =
        document.getElementById("invoiceCountValue");

    const salesDueValue =
        document.getElementById("salesDueValue");


    // ==========================================
    // EDIT MODE
    // ==========================================

    let editingSaleId = null;


    // ==========================================
    // LOAD SALES
    // ==========================================

    let sales =
        JSON.parse(
            localStorage.getItem("sales")
        ) || [];


    sales =
        sales.map(
            function (sale, index) {

                if (
                    sale.id === undefined ||
                    sale.id === null
                ) {

                    sale.id =
                        Date.now() + index;

                }


                return sale;

            }
        );


    saveSales();


    // ==========================================
    // LOCAL STORAGE DATA
    // ==========================================

    function getCustomers() {

        return (
            JSON.parse(
                localStorage.getItem("customers")
            ) || []
        );

    }


    function getProductions() {

        return (
            JSON.parse(
                localStorage.getItem("productions")
            ) || []
        );

    }


    function getAdjustments() {

        return (
            JSON.parse(
                localStorage.getItem(
                    "inventoryAdjustments"
                )
            ) || []
        );

    }


    function saveSales() {

        localStorage.setItem(
            "sales",
            JSON.stringify(sales)
        );

    }


    // ==========================================
    // SAFE TEXT
    // ==========================================

    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            String(value);

        return div.innerHTML;

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
            ).padStart(2, "0");


        const day =
            String(
                today.getDate()
            ).padStart(2, "0");


        return (
            year +
            "-" +
            month +
            "-" +
            day
        );

    }


    function formatDate(dateValue) {

        if (!dateValue) {

            return "";

        }


        const date =
            new Date(
                dateValue +
                "T00:00:00"
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


    // ==========================================
    // MONEY
    // ==========================================

    function formatMoney(amount) {

        return (
            "৳" +
            Number(
                amount || 0
            ).toLocaleString(
                "en-US",
                {
                    maximumFractionDigits: 2
                }
            )
        );

    }


    // ==========================================
    // CUSTOMER DROPDOWN
    // ==========================================

    function loadCustomers() {

        const customers =
            getCustomers();


        customerSelect.innerHTML = `

            <option value=""
                    selected
                    disabled>

                Select customer name

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


            option.disabled = true;


            option.textContent =
                "No customer available";


            customerSelect.appendChild(
                option
            );

        }

    }


    // ==========================================
    // MANUAL ADJUSTMENT
    // ==========================================

    function getAdjustmentTotal(product) {

        const adjustments =
            getAdjustments();


        let total = 0;


        adjustments.forEach(
            function (adjustment) {

                if (
                    adjustment.product !==
                    product
                ) {

                    return;

                }


                const quantity =
                    Number(
                        adjustment.quantity || 0
                    );


                if (
                    adjustment.type ===
                    "add"
                ) {

                    total += quantity;

                }


                if (
                    adjustment.type ===
                    "remove"
                ) {

                    total -= quantity;

                }

            }
        );


        return total;

    }


    // ==========================================
    // BASE PRODUCTION STOCK
    // ==========================================

    function getProducedStock(product) {

        const productions =
            getProductions();


        let total = 0;


        productions.forEach(
            function (production) {

                if (
                    product === "rice"
                ) {

                    total +=
                        Number(
                            production.riceProduced || 0
                        );

                }


                if (
                    product === "khud"
                ) {

                    total +=
                        Number(
                            production.khudProduced || 0
                        );

                }


                if (
                    product === "tush"
                ) {

                    total +=
                        Number(
                            production.tushProduced || 0
                        );

                }

            }
        );


        return total;

    }


    // ==========================================
    // SOLD QUANTITY
    // ==========================================

    function getSoldQuantity(
        product,
        excludedSaleId = null
    ) {

        let sold = 0;


        sales.forEach(
            function (sale) {

                if (
                    sale.id ===
                    excludedSaleId
                ) {

                    return;

                }


                if (
                    sale.product ===
                    product
                ) {

                    sold +=
                        Number(
                            sale.quantity || 0
                        );

                }

            }
        );


        return sold;

    }


    // ==========================================
    // AVAILABLE STOCK
    // ==========================================

    function getAvailableStock(
        product,
        excludedSaleId = null
    ) {

        if (!product) {

            return 0;

        }


        const produced =
            getProducedStock(
                product
            );


        const adjustment =
            getAdjustmentTotal(
                product
            );


        const sold =
            getSoldQuantity(
                product,
                excludedSaleId
            );


        return Math.max(
            0,
            produced +
            adjustment -
            sold
        );

    }


    // ==========================================
    // PRODUCT CHANGE
    // ==========================================

    productSelect.addEventListener(
        "change",
        function () {

            updateAvailableStock();

        }
    );


    function updateAvailableStock() {

        if (!productSelect.value) {

            availableStockInput.value =
                "";

            return;

        }


        const stock =
            getAvailableStock(
                productSelect.value,
                editingSaleId
            );


        availableStockInput.value =
            stock.toLocaleString(
                "en-US",
                {
                    maximumFractionDigits: 2
                }
            ) +
            " kg";

    }


    // ==========================================
    // TOTAL CALCULATION
    // ==========================================

    quantityInput.addEventListener(
        "input",
        updateTotalAmount
    );


    priceInput.addEventListener(
        "input",
        updateTotalAmount
    );


    function updateTotalAmount() {

        const quantity =
            Number(
                quantityInput.value || 0
            );


        const price =
            Number(
                priceInput.value || 0
            );


        const total =
            quantity *
            price;


        totalAmountInput.value =
            formatMoney(
                total
            );


        updatePartialPreview();

    }


    // ==========================================
    // PAYMENT STATUS
    // ==========================================

    paymentStatus.addEventListener(
        "change",
        function () {

            if (
                paymentStatus.value ===
                "partial"
            ) {

                salesPartialField.hidden =
                    false;

            } else {

                salesPartialField.hidden =
                    true;


                paidAmountInput.value =
                    "";


                salesBalanceText.textContent =
                    "";

            }

        }
    );


    paidAmountInput.addEventListener(
        "input",
        updatePartialPreview
    );


    function updatePartialPreview() {

        if (
            paymentStatus.value !==
            "partial"
        ) {

            return;

        }


        const quantity =
            Number(
                quantityInput.value || 0
            );


        const price =
            Number(
                priceInput.value || 0
            );


        const paid =
            Number(
                paidAmountInput.value || 0
            );


        const total =
            quantity *
            price;


        if (
            total <= 0 ||
            !paidAmountInput.value
        ) {

            salesBalanceText.textContent =
                "";

            return;

        }


        if (
            paid <= 0 ||
            paid >= total
        ) {

            salesBalanceText.textContent =
                "Paid amount must be greater than ৳0 and less than total.";


            salesBalanceText.className =
                "sales-balance-error";


            return;

        }


        const due =
            total -
            paid;


        salesBalanceText.textContent =
            "Total: " +
            formatMoney(total) +
            " | Remaining Due: " +
            formatMoney(due);


        salesBalanceText.className =
            "sales-balance-success";

    }


    // ==========================================
    // INVOICE ID
    // ==========================================

    function generateInvoiceId() {

        let highest = 1000;


        sales.forEach(
            function (sale) {

                if (!sale.invoiceId) {

                    return;

                }


                const number =
                    Number(
                        sale.invoiceId.replace(
                            "INV-",
                            ""
                        )
                    );


                if (
                    !isNaN(number) &&
                    number > highest
                ) {

                    highest =
                        number;

                }

            }
        );


        return (
            "INV-" +
            (highest + 1)
        );

    }


    // ==========================================
    // PAYMENT
    // ==========================================

    function getPaymentText(payment) {

        if (payment === "paid") {
            return "Paid";
        }

        if (payment === "due") {
            return "Due";
        }

        if (payment === "partial") {
            return "Partially Paid";
        }

        return payment;

    }


    function getPaymentClass(payment) {

        if (payment === "paid") {

            return "status-paid";

        }


        return "status-due";

    }


    // ==========================================
    // PRODUCT NAME
    // ==========================================

    function getProductName(product) {

        if (product === "rice") {
            return "Rice";
        }

        if (product === "khud") {
            return "Khud";
        }

        if (product === "tush") {
            return "Tush";
        }

        return product;

    }


    // ==========================================
    // SUMMARY
    // ==========================================

    function updateSummary() {

        const today =
            getTodayDate();


        let todaySales = 0;

        let dueAmount = 0;


        sales.forEach(
            function (sale) {

                if (
                    sale.date === today
                ) {

                    todaySales +=
                        Number(
                            sale.totalAmount || 0
                        );

                }


                dueAmount +=
                    Number(
                        sale.dueAmount || 0
                    );

            }
        );


        todaySalesValue.textContent =
            formatMoney(
                todaySales
            );


        invoiceCountValue.textContent =
            sales.length;


        salesDueValue.textContent =
            formatMoney(
                dueAmount
            );

    }


    // ==========================================
    // DISPLAY TABLE
    // ==========================================

    function displaySales() {

        salesTableBody.innerHTML =
            "";


        sales.forEach(
            function (sale) {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        ${escapeHTML(
                            sale.invoiceId
                        )}
                    </td>


                    <td>
                        ${escapeHTML(
                            sale.customerName
                        )}
                    </td>


                    <td>
                        ${getProductName(
                            sale.product
                        )}
                    </td>


                    <td>
                        ${Number(
                            sale.quantity
                        ).toLocaleString(
                            "en-US",
                            {
                                maximumFractionDigits: 2
                            }
                        )} kg
                    </td>


                    <td>
                        ${formatMoney(
                            sale.totalAmount
                        )}
                    </td>


                    <td>

                        <span
                            class="status-badge
                            ${getPaymentClass(
                                sale.payment
                            )}"
                        >

                            ${getPaymentText(
                                sale.payment
                            )}

                        </span>

                    </td>


                    <td>
                        ${
                            sale.deliveryRequired ===
                            "yes"
                                ? "Yes"
                                : "No"
                        }
                    </td>


                    <td>
                        ${formatDate(
                            sale.date
                        )}
                    </td>


                    <td>

                        <button
                            class="sales-edit-button"
                            type="button"
                            data-action="edit"
                            data-id="${sale.id}"
                        >
                            Edit
                        </button>


                        <button
                            class="sales-delete-button"
                            type="button"
                            data-action="delete"
                            data-id="${sale.id}"
                        >
                            Delete
                        </button>

                    </td>

                `;


                salesTableBody.appendChild(
                    row
                );

            }
        );

    }


    // ==========================================
    // SAVE / UPDATE
    // ==========================================

    salesForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const customers =
                getCustomers();


            const customer =
                customers.find(
                    function (customer) {

                        return (
                            Number(customer.id) ===
                            Number(
                                customerSelect.value
                            )
                        );

                    }
                );


            if (!customer) {

                showToast(
                    "Please select a customer.",
                    "error"
                );

                return;

            }


            const product =
                productSelect.value;


            if (!product) {

                showToast(
                    "Please select a product.",
                    "error"
                );

                return;

            }


            const quantity =
                Number(
                    quantityInput.value
                );


            if (
                quantityInput.value === "" ||
                quantity <= 0
            ) {

                showToast(
                    "Please enter a valid quantity.",
                    "error"
                );

                return;

            }


            const availableStock =
                getAvailableStock(
                    product,
                    editingSaleId
                );


            if (
                quantity >
                availableStock
            ) {

                showToast(
                    "Only " +
                    availableStock.toLocaleString(
                        "en-US",
                        {
                            maximumFractionDigits: 2
                        }
                    ) +
                    " kg stock is available.",
                    "error"
                );

                return;

            }


            const price =
                Number(
                    priceInput.value
                );


            if (
                priceInput.value === "" ||
                price <= 0
            ) {

                showToast(
                    "Please enter a valid price per kg.",
                    "error"
                );

                return;

            }


            const payment =
                paymentStatus.value;


            if (!payment) {

                showToast(
                    "Please select payment status.",
                    "error"
                );

                return;

            }


            if (
                !deliveryRequired.value
            ) {

                showToast(
                    "Please select delivery requirement.",
                    "error"
                );

                return;

            }


            const totalAmount =
                quantity *
                price;


            let paidAmount = 0;

            let dueAmount = 0;


            if (
                payment === "paid"
            ) {

                paidAmount =
                    totalAmount;

            }


            if (
                payment === "due"
            ) {

                dueAmount =
                    totalAmount;

            }


            if (
                payment === "partial"
            ) {

                paidAmount =
                    Number(
                        paidAmountInput.value
                    );


                if (
                    !paidAmountInput.value ||
                    paidAmount <= 0 ||
                    paidAmount >= totalAmount
                ) {

                    showToast(
                        "Enter a valid partial paid amount.",
                        "error"
                    );

                    return;

                }


                dueAmount =
                    totalAmount -
                    paidAmount;

            }


            // ==================================
            // UPDATE
            // ==================================

            if (
                editingSaleId !== null
            ) {

                const index =
                    sales.findIndex(
                        function (sale) {

                            return (
                                sale.id ===
                                editingSaleId
                            );

                        }
                    );


                if (index !== -1) {

                    const oldSale =
                        sales[index];


                    sales[index] = {

                        id:
                            oldSale.id,

                        invoiceId:
                            oldSale.invoiceId,

                        customerId:
                            customer.id,

                        customerName:
                            customer.name,

                        product:
                            product,

                        quantity:
                            quantity,

                        pricePerKg:
                            price,

                        totalAmount:
                            totalAmount,

                        payment:
                            payment,

                        paidAmount:
                            paidAmount,

                        dueAmount:
                            dueAmount,

                        deliveryRequired:
                            deliveryRequired.value,

                        date:
                            oldSale.date

                    };

                }


                saveSales();

                displaySales();

                updateSummary();

                resetSalesForm();


                showToast(
                    "Invoice updated successfully!"
                );


                return;

            }


            // ==================================
            // NEW SALE
            // ==================================

            const newSale = {

                id:
                    Date.now(),

                invoiceId:
                    generateInvoiceId(),

                customerId:
                    customer.id,

                customerName:
                    customer.name,

                product:
                    product,

                quantity:
                    quantity,

                pricePerKg:
                    price,

                totalAmount:
                    totalAmount,

                payment:
                    payment,

                paidAmount:
                    paidAmount,

                dueAmount:
                    dueAmount,

                deliveryRequired:
                    deliveryRequired.value,

                date:
                    getTodayDate()

            };


            sales.push(
                newSale
            );


            saveSales();

            displaySales();

            updateSummary();

            resetSalesForm();


            showToast(
                "Invoice generated successfully!"
            );

        }
    );


    // ==========================================
    // TABLE ACTIONS
    // ==========================================

    salesTableBody.addEventListener(
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

                editSale(id);

            }


            if (
                button.dataset.action ===
                "delete"
            ) {

                deleteSale(id);

            }

        }
    );


    // ==========================================
    // EDIT
    // ==========================================

    function editSale(id) {

        const sale =
            sales.find(
                function (sale) {

                    return (
                        sale.id === id
                    );

                }
            );


        if (!sale) {

            showToast(
                "Invoice record not found.",
                "error"
            );

            return;

        }


        editingSaleId =
            sale.id;


        const customerExists =
            Array.from(
                customerSelect.options
            ).some(
                function (option) {

                    return (
                        Number(option.value) ===
                        Number(sale.customerId)
                    );

                }
            );


        if (!customerExists) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                sale.customerId;


            option.textContent =
                sale.customerName;


            customerSelect.appendChild(
                option
            );

        }


        customerSelect.value =
            sale.customerId;


        productSelect.value =
            sale.product;


        quantityInput.value =
            sale.quantity;


        priceInput.value =
            sale.pricePerKg;


        paymentStatus.value =
            sale.payment;


        deliveryRequired.value =
            sale.deliveryRequired;


        if (
            sale.payment ===
            "partial"
        ) {

            salesPartialField.hidden =
                false;


            paidAmountInput.value =
                sale.paidAmount;

        } else {

            salesPartialField.hidden =
                true;

        }


        updateAvailableStock();

        updateTotalAmount();

        updatePartialPreview();


        generateInvoiceBtn.innerHTML = `

            <span aria-hidden="true">
                ▣
            </span>

            Update Invoice

        `;


        customerSelect.focus();


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }


    // ==========================================
    // DELETE
    // ==========================================

    function deleteSale(id) {

        const exists =
            sales.some(
                function (sale) {

                    return (
                        sale.id === id
                    );

                }
            );


        if (!exists) {

            showToast(
                "Invoice record not found.",
                "error"
            );

            return;

        }


        sales =
            sales.filter(
                function (sale) {

                    return (
                        sale.id !== id
                    );

                }
            );


        saveSales();

        displaySales();

        updateSummary();


        if (
            editingSaleId === id
        ) {

            resetSalesForm();

        }


        showToast(
            "Invoice deleted successfully!"
        );

    }


    // ==========================================
    // RESET
    // ==========================================

    function resetSalesForm() {

        salesForm.reset();


        editingSaleId = null;


        availableStockInput.value =
            "";


        totalAmountInput.value =
            "";


        paidAmountInput.value =
            "";


        salesPartialField.hidden =
            true;


        salesBalanceText.textContent =
            "";


        generateInvoiceBtn.innerHTML = `

            <span aria-hidden="true">
                ▣
            </span>

            Generate Invoice

        `;

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
            "sales-toast " +
            type;


        toast.innerHTML = `

            <span class="toast-icon">

                ${
                    type === "success"
                        ? "✓"
                        : "!"
                }

            </span>

            <span>
                ${escapeHTML(message)}
            </span>

        `;


        document.body.appendChild(
            toast
        );


        setTimeout(
            function () {

                toast.classList.add(
                    "show"
                );

            },
            50
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
            2500
        );

    }


    // ==========================================
    // DESIGN
    // ==========================================

    const style =
        document.createElement(
            "style"
        );


    style.textContent = `

        .customer-selection-row {

            display: flex;

            align-items: stretch;

            gap: 10px;

        }


        .customer-selection-row select {

            flex: 1;

            min-width: 0;

        }


        .add-customer-button {

            display: inline-flex;

            align-items: center;

            justify-content: center;

            gap: 5px;

            padding: 0 15px;

            border:
                1px solid #15913a;

            border-radius:
                6px;

            background:
                #ffffff;

            color:
                #15913a;

            font-size:
                13px;

            font-weight:
                600;

            text-decoration:
                none;

            white-space:
                nowrap;

        }


        .add-customer-button:hover {

            background:
                #15913a;

            color:
                #ffffff;

        }


        #available-stock[readonly],
        #total-amount[readonly] {

            background:
                #f5f8f6;

            cursor:
                not-allowed;

        }


        #salesBalanceText {

            display: block;

            margin-top: 7px;

            font-size: 12px;

            font-weight: 600;

        }


        .sales-balance-success {

            color: #15913a;

        }


        .sales-balance-error {

            color: #c62828;

        }


        .sales-edit-button,
        .sales-delete-button {

            padding: 7px 12px;

            border-radius: 6px;

            font-weight: 600;

            cursor: pointer;

        }


        .sales-edit-button {

            border:
                1px solid #15913a;

            background:
                #ffffff;

            color:
                #15913a;

        }


        .sales-delete-button {

            margin-left: 5px;

            border:
                1px solid #efb8b8;

            background:
                #fff5f5;

            color:
                #c62828;

        }


        .sales-toast {

            position: fixed;

            top: 25px;

            right: 25px;

            min-width: 280px;

            display: flex;

            align-items: center;

            gap: 12px;

            padding: 14px 18px;

            background:
                #ffffff;

            color:
                #17351f;

            border-left:
                5px solid #15913a;

            border-radius:
                8px;

            box-shadow:
                0 6px 20px
                rgba(0, 0, 0, 0.15);

            font-size:
                14px;

            font-weight:
                600;

            z-index:
                9999;

            opacity:
                0;

            transform:
                translateX(30px);

            transition:
                0.3s ease;

        }


        .sales-toast.show {

            opacity:
                1;

            transform:
                translateX(0);

        }


        .sales-toast .toast-icon {

            width:
                26px;

            height:
                26px;

            display:
                flex;

            align-items:
                center;

            justify-content:
                center;

            border-radius:
                50%;

            background:
                #e7f5eb;

            color:
                #15913a;

        }


        .sales-toast.error {

            border-left-color:
                #d32f2f;

            color:
                #8f1d1d;

        }


        .sales-toast.error
        .toast-icon {

            background:
                #fdeaea;

            color:
                #d32f2f;

        }


        @media
        (max-width: 700px) {

            .customer-selection-row {

                flex-direction:
                    column;

            }


            .add-customer-button {

                min-height:
                    42px;

            }

        }

    `;


    document.head.appendChild(
        style
    );


    // ==========================================
    // INITIAL
    // ==========================================

    loadCustomers();

    displaySales();

    updateSummary();

});