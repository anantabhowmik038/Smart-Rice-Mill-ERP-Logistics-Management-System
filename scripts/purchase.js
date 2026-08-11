document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // ELEMENTS
    // ==========================================

    const purchaseForm =
        document.getElementById("purchaseForm");

    const supplierSelect =
        document.getElementById("supplier");

    const phoneInput =
        document.getElementById("phone");

    const paddyWeightInput =
        document.getElementById("paddy-weight");

    const moistureInput =
        document.getElementById("moisture");

    const priceInput =
        document.getElementById("price");

    const paymentStatus =
        document.getElementById("payment-status");

    const paidAmountInput =
        document.getElementById("paid-amount");

    const partialPaymentField =
        document.getElementById("partialPaymentField");

    const paymentBalanceText =
        document.getElementById("paymentBalanceText");

    const savePurchaseBtn =
        document.getElementById("savePurchaseBtn");

    const purchaseTableBody =
        document.getElementById("purchaseTableBody");


    // Summary

    const todayPurchaseValue =
        document.getElementById("todayPurchaseValue");

    const todayPaddyQtyValue =
        document.getElementById("todayPaddyQtyValue");

    const dueBillsValue =
        document.getElementById("dueBillsValue");


    // ==========================================
    // EDIT MODE
    // ==========================================

    let editingPurchaseId = null;


    // ==========================================
    // SUPPLIERS
    // ==========================================

    function getSuppliers() {

        return (
            JSON.parse(
                localStorage.getItem("suppliers")
            ) || []
        );

    }


    // ==========================================
    // DEFAULT PURCHASES
    // ==========================================

    const defaultPurchases = [

        {
            id: 1,
            purchaseId: "P-1024",
            supplierId: 1,
            supplierName: "Rahim Farmer",
            phone: "01700000001",
            weight: 650,
            moisture: 14,
            pricePerKg: 42,
            totalPrice: 27300,
            payment: "paid",
            paidAmount: 27300,
            dueAmount: 0,
            date: "2026-07-01"
        },

        {
            id: 2,
            purchaseId: "P-1023",
            supplierId: 2,
            supplierName: "Karim Supplier",
            phone: "01800000002",
            weight: 900,
            moisture: 18,
            pricePerKg: 42,
            totalPrice: 37800,
            payment: "due",
            paidAmount: 0,
            dueAmount: 37800,
            date: "2026-07-01"
        },

        {
            id: 3,
            purchaseId: "P-1022",
            supplierId: 3,
            supplierName: "Molla Agro",
            phone: "01900000003",
            weight: 500,
            moisture: 15,
            pricePerKg: 42,
            totalPrice: 21000,
            payment: "paid",
            paidAmount: 21000,
            dueAmount: 0,
            date: "2026-06-30"
        }

    ];


    // ==========================================
    // LOAD PURCHASES
    // ==========================================

    const storedPurchases =
        localStorage.getItem("purchases");


    let purchases;


    if (storedPurchases === null) {

        purchases =
            defaultPurchases;

    } else {

        purchases =
            JSON.parse(storedPurchases) || [];

    }


    // ==========================================
    // FIX / MIGRATE OLD PURCHASE DATA
    // ==========================================

    let dataChanged = false;


    purchases =
        purchases.map(
            function (purchase, index) {

                // Missing internal ID

                if (
                    purchase.id === undefined ||
                    purchase.id === null
                ) {

                    purchase.id =
                        Date.now() + index;

                    dataChanged = true;

                }


                // Missing Purchase ID

                if (!purchase.purchaseId) {

                    purchase.purchaseId =
                        "P-" +
                        (2000 + index);

                    dataChanged = true;

                }


                // Missing total price

                if (
                    purchase.totalPrice === undefined ||
                    purchase.totalPrice === null
                ) {

                    purchase.totalPrice =
                        Number(purchase.weight || 0) *
                        Number(purchase.pricePerKg || 0);

                    dataChanged = true;

                }


                // Old PAID record

                if (
                    purchase.payment === "paid" &&
                    (
                        purchase.paidAmount === undefined ||
                        purchase.dueAmount === undefined
                    )
                ) {

                    purchase.paidAmount =
                        purchase.totalPrice;

                    purchase.dueAmount = 0;

                    dataChanged = true;

                }


                // Old DUE record

                if (
                    purchase.payment === "due" &&
                    (
                        purchase.paidAmount === undefined ||
                        purchase.dueAmount === undefined
                    )
                ) {

                    purchase.paidAmount = 0;

                    purchase.dueAmount =
                        purchase.totalPrice;

                    dataChanged = true;

                }


                // Old PARTIAL record
                // Exact previous paid amount was not saved.
                // Keep paidAmount null until user edits it.

                if (
                    purchase.payment === "partial" &&
                    (
                        purchase.paidAmount === undefined ||
                        purchase.dueAmount === undefined
                    )
                ) {

                    purchase.paidAmount = null;

                    purchase.dueAmount =
                        purchase.totalPrice;

                    dataChanged = true;

                }


                return purchase;

            }
        );


    savePurchases();


    // ==========================================
    // SAVE
    // ==========================================

    function savePurchases() {

        localStorage.setItem(
            "purchases",
            JSON.stringify(purchases)
        );

    }


    // ==========================================
    // SAFE TEXT
    // ==========================================

    function escapeHTML(value) {

        const element =
            document.createElement("div");

        element.textContent =
            String(value);

        return element.innerHTML;

    }


    // ==========================================
    // MONEY FORMAT
    // ==========================================

    function formatMoney(amount) {

        return (
            "৳" +
            Number(amount || 0)
                .toLocaleString(
                    "en-US",
                    {
                        maximumFractionDigits: 2
                    }
                )
        );

    }


    // ==========================================
    // DATE FORMAT
    // ==========================================

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
    // TODAY
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


    // ==========================================
    // SUPPLIER DROPDOWN
    // ==========================================

    function loadSupplierDropdown() {

        const suppliers =
            getSuppliers();


        supplierSelect.innerHTML = `

            <option value=""
                    selected
                    disabled>

                Select supplier/farmer name

            </option>

        `;


        suppliers.forEach(
            function (supplier) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    supplier.id;


                option.textContent =
                    supplier.name;


                supplierSelect.appendChild(
                    option
                );

            }
        );


        if (suppliers.length === 0) {

            const option =
                document.createElement(
                    "option"
                );


            option.disabled = true;

            option.textContent =
                "No supplier available";


            supplierSelect.appendChild(
                option
            );

        }

    }


    // ==========================================
    // SUPPLIER SELECT -> PHONE
    // ==========================================

    supplierSelect.addEventListener(
        "change",
        function () {

            const suppliers =
                getSuppliers();


            const supplier =
                suppliers.find(
                    function (item) {

                        return (
                            Number(item.id) ===
                            Number(
                                supplierSelect.value
                            )
                        );

                    }
                );


            if (supplier) {

                phoneInput.value =
                    supplier.phone;

            } else {

                phoneInput.value = "";

            }

        }
    );


    // ==========================================
    // PAYMENT STATUS
    // ==========================================

    paymentStatus.addEventListener(
        "change",
        function () {

            updatePartialPaymentField();

        }
    );


    function updatePartialPaymentField() {

        if (
            paymentStatus.value ===
            "partial"
        ) {

            partialPaymentField.hidden =
                false;

        } else {

            partialPaymentField.hidden =
                true;

            paidAmountInput.value = "";

            paymentBalanceText.textContent =
                "";

        }

    }


    // ==========================================
    // LIVE PARTIAL PAYMENT CALCULATION
    // ==========================================

    function updatePaymentPreview() {

        if (
            paymentStatus.value !==
            "partial"
        ) {

            paymentBalanceText.textContent =
                "";

            return;

        }


        const weight =
            Number(
                paddyWeightInput.value
            );


        const price =
            Number(
                priceInput.value
            );


        const paid =
            Number(
                paidAmountInput.value
            );


        const total =
            weight * price;


        if (
            total <= 0 ||
            !paidAmountInput.value
        ) {

            paymentBalanceText.textContent =
                "";

            return;

        }


        const remaining =
            total - paid;


        if (
            paid <= 0 ||
            paid >= total
        ) {

            paymentBalanceText.textContent =
                "Paid amount must be more than ৳0 and less than total amount.";

            paymentBalanceText.className =
                "payment-error";

            return;

        }


        paymentBalanceText.textContent =
            "Total: " +
            formatMoney(total) +
            " | Remaining Due: " +
            formatMoney(remaining);


        paymentBalanceText.className =
            "payment-success";

    }


    paddyWeightInput.addEventListener(
        "input",
        updatePaymentPreview
    );


    priceInput.addEventListener(
        "input",
        updatePaymentPreview
    );


    paidAmountInput.addEventListener(
        "input",
        updatePaymentPreview
    );


    // ==========================================
    // PAYMENT TEXT
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
    // PURCHASE ID
    // ==========================================

    function generatePurchaseId() {

        let highestNumber = 1024;


        purchases.forEach(
            function (purchase) {

                if (!purchase.purchaseId) {
                    return;
                }


                const number =
                    Number(
                        purchase.purchaseId
                            .replace(
                                "P-",
                                ""
                            )
                    );


                if (
                    !isNaN(number) &&
                    number > highestNumber
                ) {

                    highestNumber =
                        number;

                }

            }
        );


        return (
            "P-" +
            (highestNumber + 1)
        );

    }


    // ==========================================
    // SUMMARY CARDS
    // ==========================================

    function updateSummaryCards() {

        const today =
            getTodayDate();


        let todayPurchase = 0;

        let todayPaddyQuantity = 0;

        let totalDue = 0;


        purchases.forEach(
            function (purchase) {

                if (
                    purchase.date === today
                ) {

                    todayPurchase +=
                        Number(
                            purchase.totalPrice || 0
                        );


                    todayPaddyQuantity +=
                        Number(
                            purchase.weight || 0
                        );

                }


                totalDue +=
                    Number(
                        purchase.dueAmount || 0
                    );

            }
        );


        todayPurchaseValue.textContent =
            formatMoney(
                todayPurchase
            );


        todayPaddyQtyValue.textContent =
            Number(
                todayPaddyQuantity
            ).toLocaleString(
                "en-US",
                {
                    maximumFractionDigits: 2
                }
            ) +
            " kg";


        dueBillsValue.textContent =
            formatMoney(
                totalDue
            );

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
                ".purchase-toast"
            );


        if (oldToast) {

            oldToast.remove();

        }


        const toast =
            document.createElement(
                "div"
            );


        toast.className =
            "purchase-toast " + type;


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
    // DISPLAY TABLE
    // ==========================================

    function displayPurchases() {

        purchaseTableBody.innerHTML =
            "";


        purchases.forEach(
            function (purchase) {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>

                        ${escapeHTML(
                            purchase.supplierName
                        )}

                    </td>


                    <td>

                        ${escapeHTML(
                            purchase.weight
                        )} kg

                    </td>


                    <td>

                        ${formatMoney(
                            purchase.totalPrice
                        )}

                    </td>


                    <td>

                        <span
                            class="status-badge
                            ${getPaymentClass(
                                purchase.payment
                            )}"
                        >

                            ${getPaymentText(
                                purchase.payment
                            )}

                        </span>

                    </td>


                    <td>

                        ${formatDate(
                            purchase.date
                        )}

                    </td>


                    <td>

                        <button
                            class="purchase-edit-button"
                            type="button"
                            data-action="edit"
                            data-id="${purchase.id}"
                        >
                            Edit
                        </button>


                        <button
                            class="purchase-delete-button"
                            type="button"
                            data-action="delete"
                            data-id="${purchase.id}"
                        >
                            Delete
                        </button>

                    </td>

                `;


                purchaseTableBody.appendChild(
                    row
                );

            }
        );

    }


    // ==========================================
    // SAVE / UPDATE
    // ==========================================

    purchaseForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const suppliers =
                getSuppliers();


            const selectedSupplier =
                suppliers.find(
                    function (supplier) {

                        return (
                            Number(
                                supplier.id
                            ) ===
                            Number(
                                supplierSelect.value
                            )
                        );

                    }
                );


            if (!selectedSupplier) {

                showToast(
                    "Please select a supplier or farmer.",
                    "error"
                );

                return;

            }


            const weight =
                Number(
                    paddyWeightInput.value
                );


            const moisture =
                Number(
                    moistureInput.value
                );


            const pricePerKg =
                Number(
                    priceInput.value
                );


            const payment =
                paymentStatus.value;


            if (
                weight <= 0
            ) {

                showToast(
                    "Please enter a valid paddy weight.",
                    "error"
                );

                return;

            }


            if (
                moisture < 0 ||
                moisture > 100 ||
                moistureInput.value === ""
            ) {

                showToast(
                    "Please enter a valid moisture percentage.",
                    "error"
                );

                return;

            }


            if (
                pricePerKg <= 0
            ) {

                showToast(
                    "Please enter a valid price per kg.",
                    "error"
                );

                return;

            }


            if (!payment) {

                showToast(
                    "Please select payment status.",
                    "error"
                );

                return;

            }


            const totalPrice =
                weight *
                pricePerKg;


            let paidAmount = 0;

            let dueAmount = 0;


            // Fully Paid

            if (
                payment === "paid"
            ) {

                paidAmount =
                    totalPrice;

                dueAmount = 0;

            }


            // Fully Due

            if (
                payment === "due"
            ) {

                paidAmount = 0;

                dueAmount =
                    totalPrice;

            }


            // Partial Payment

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
                    paidAmount >= totalPrice
                ) {

                    showToast(
                        "Enter a valid partial paid amount.",
                        "error"
                    );

                    return;

                }


                dueAmount =
                    totalPrice -
                    paidAmount;

            }


            // ==================================
            // UPDATE
            // ==================================

            if (
                editingPurchaseId !== null
            ) {

                const index =
                    purchases.findIndex(
                        function (purchase) {

                            return (
                                purchase.id ===
                                editingPurchaseId
                            );

                        }
                    );


                if (index !== -1) {

                    const oldPurchase =
                        purchases[index];


                    purchases[index] = {

                        id:
                            oldPurchase.id,

                        purchaseId:
                            oldPurchase.purchaseId,

                        supplierId:
                            selectedSupplier.id,

                        supplierName:
                            selectedSupplier.name,

                        phone:
                            selectedSupplier.phone,

                        weight:
                            weight,

                        moisture:
                            moisture,

                        pricePerKg:
                            pricePerKg,

                        totalPrice:
                            totalPrice,

                        payment:
                            payment,

                        paidAmount:
                            paidAmount,

                        dueAmount:
                            dueAmount,

                        date:
                            oldPurchase.date

                    };

                }


                savePurchases();

                displayPurchases();

                updateSummaryCards();

                resetPurchaseForm();


                showToast(
                    "Purchase updated successfully!"
                );

                return;

            }


            // ==================================
            // NEW PURCHASE
            // ==================================

            const newPurchase = {

                id:
                    Date.now(),

                purchaseId:
                    generatePurchaseId(),

                supplierId:
                    selectedSupplier.id,

                supplierName:
                    selectedSupplier.name,

                phone:
                    selectedSupplier.phone,

                weight:
                    weight,

                moisture:
                    moisture,

                pricePerKg:
                    pricePerKg,

                totalPrice:
                    totalPrice,

                payment:
                    payment,

                paidAmount:
                    paidAmount,

                dueAmount:
                    dueAmount,

                date:
                    getTodayDate()

            };


            purchases.push(
                newPurchase
            );


            savePurchases();

            displayPurchases();

            updateSummaryCards();

            resetPurchaseForm();


            showToast(
                "Purchase saved successfully!"
            );

        }
    );


    // ==========================================
    // TABLE EVENTS
    // ==========================================

    purchaseTableBody.addEventListener(
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

                editPurchase(id);

            }


            if (
                button.dataset.action ===
                "delete"
            ) {

                deletePurchase(id);

            }

        }
    );


    // ==========================================
    // EDIT
    // ==========================================

    function editPurchase(id) {

        const purchase =
            purchases.find(
                function (item) {

                    return (
                        item.id === id
                    );

                }
            );


        if (!purchase) {

            showToast(
                "Purchase record not found.",
                "error"
            );

            return;

        }


        const suppliers =
            getSuppliers();


        const supplierExists =
            suppliers.some(
                function (supplier) {

                    return (
                        Number(
                            supplier.id
                        ) ===
                        Number(
                            purchase.supplierId
                        )
                    );

                }
            );


        if (!supplierExists) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                purchase.supplierId;


            option.textContent =
                purchase.supplierName;


            supplierSelect.appendChild(
                option
            );

        }


        supplierSelect.value =
            purchase.supplierId;


        phoneInput.value =
            purchase.phone;


        paddyWeightInput.value =
            purchase.weight;


        moistureInput.value =
            purchase.moisture;


        priceInput.value =
            purchase.pricePerKg;


        paymentStatus.value =
            purchase.payment;


        updatePartialPaymentField();


        if (
            purchase.payment ===
            "partial"
        ) {

            if (
                purchase.paidAmount !==
                null
            ) {

                paidAmountInput.value =
                    purchase.paidAmount;

            } else {

                paidAmountInput.value =
                    "";

            }


            updatePaymentPreview();

        }


        editingPurchaseId =
            purchase.id;


        savePurchaseBtn.innerHTML = `

            <span aria-hidden="true">
                ▣
            </span>

            Update Purchase

        `;


        supplierSelect.focus();


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }


    // ==========================================
    // DELETE
    // ==========================================

    function deletePurchase(id) {

        const exists =
            purchases.some(
                function (purchase) {

                    return (
                        purchase.id === id
                    );

                }
            );


        if (!exists) {

            showToast(
                "Purchase record not found.",
                "error"
            );

            return;

        }


        purchases =
            purchases.filter(
                function (purchase) {

                    return (
                        purchase.id !== id
                    );

                }
            );


        savePurchases();

        displayPurchases();

        updateSummaryCards();


        if (
            editingPurchaseId === id
        ) {

            resetPurchaseForm();

        }


        showToast(
            "Purchase deleted successfully!"
        );

    }


    // ==========================================
    // RESET FORM
    // ==========================================

    function resetPurchaseForm() {

        purchaseForm.reset();


        phoneInput.value = "";


        partialPaymentField.hidden =
            true;


        paidAmountInput.value = "";


        paymentBalanceText.textContent =
            "";


        editingPurchaseId = null;


        savePurchaseBtn.innerHTML = `

            <span aria-hidden="true">
                ▣
            </span>

            Save Purchase

        `;

    }


    // ==========================================
    // EXTRA UI DESIGN
    // ==========================================

    const style =
        document.createElement(
            "style"
        );


    style.textContent = `

        /* SUPPLIER ROW */

        .supplier-selection-row {

            display: flex !important;

            align-items: stretch;

            gap: 10px;

            width: 100%;

        }


        .supplier-selection-row select {

            flex: 1 1 auto;

            width: auto !important;

            min-width: 0;

        }


        /* ADD SUPPLIER */

        .add-supplier-button {

            display: inline-flex;

            align-items: center;

            justify-content: center;

            gap: 5px;

            padding: 0 15px;

            min-height: 42px;

            border:
                1px solid #15913a;

            border-radius: 6px;

            background-color:
                #ffffff;

            color:
                #15913a;

            text-decoration: none;

            white-space: nowrap;

            font-size: 13px;

            font-weight: 600;

            transition:
                0.2s ease;

        }


        .add-supplier-button:hover {

            background-color:
                #15913a;

            color:
                #ffffff;

        }


        /* READ ONLY PHONE */

        #phone[readonly] {

            background-color:
                #f5f8f6;

            cursor:
                not-allowed;

        }


        /* PAYMENT INFO */

        #paymentBalanceText {

            display: block;

            margin-top: 7px;

            font-size: 12px;

            font-weight: 600;

        }


        #paymentBalanceText.payment-success {

            color:
                #15913a;

        }


        #paymentBalanceText.payment-error {

            color:
                #c62828;

        }


        /* EDIT */

        .purchase-edit-button {

            padding:
                7px 15px;

            border:
                1px solid #15913a;

            border-radius:
                6px;

            background:
                #ffffff;

            color:
                #15913a;

            font-weight:
                600;

            cursor:
                pointer;

        }


        .purchase-edit-button:hover {

            background-color:
                #edf8f0;

        }


        /* DELETE */

        .purchase-delete-button {

            margin-left:
                6px;

            padding:
                7px 15px;

            border:
                1px solid #efb8b8;

            border-radius:
                6px;

            background-color:
                #fff5f5;

            color:
                #c62828;

            font-weight:
                600;

            cursor:
                pointer;

        }


        .purchase-delete-button:hover {

            background-color:
                #fdeaea;

        }


        /* TOAST */

        .purchase-toast {

            position:
                fixed;

            top:
                25px;

            right:
                25px;

            min-width:
                280px;

            display:
                flex;

            align-items:
                center;

            gap:
                12px;

            padding:
                14px 18px;

            background-color:
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
                opacity 0.3s ease,
                transform 0.3s ease;

        }


        .purchase-toast.show {

            opacity:
                1;

            transform:
                translateX(0);

        }


        .purchase-toast .toast-icon {

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

            background-color:
                #e7f5eb;

            color:
                #15913a;

            font-weight:
                bold;

        }


        .purchase-toast.error {

            border-left-color:
                #d32f2f;

            color:
                #8f1d1d;

        }


        .purchase-toast.error
        .toast-icon {

            background-color:
                #fdeaea;

            color:
                #d32f2f;

        }


        @media
        (max-width: 700px) {

            .supplier-selection-row {

                flex-direction:
                    column;

            }


            .add-supplier-button {

                width:
                    100%;

            }

        }

    `;


    document.head.appendChild(
        style
    );


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    loadSupplierDropdown();

    displayPurchases();

    updateSummaryCards();

});