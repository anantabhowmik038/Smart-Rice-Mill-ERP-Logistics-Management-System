document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       SMART RICE MILL ERP
       PADDY PURCHASE MANAGEMENT
    ========================================= */


    /* =========================================
       ELEMENTS
    ========================================= */

    const purchaseForm =
        document.getElementById("purchaseForm");

    if (!purchaseForm) {
        return;
    }


    const supplierSelect =
        document.getElementById("supplier");

    const phoneInput =
        document.getElementById("phone");

    const purchaseDateInput =
        document.getElementById("purchase-date");

    const paddyTypeSelect =
        document.getElementById("paddy-type");

    const paddyWeightInput =
        document.getElementById("paddy-weight");

    const moistureInput =
        document.getElementById("moisture");

    const priceInput =
        document.getElementById("price");

    const totalAmountInput =
        document.getElementById("total-amount");

    const paymentStatusSelect =
        document.getElementById("payment-status");

    const partialPaymentField =
        document.getElementById("partialPaymentField");

    const paidAmountInput =
        document.getElementById("paid-amount");

    const dueAmountInput =
        document.getElementById("due-amount");

    const paymentBalanceText =
        document.getElementById("paymentBalanceText");

    const savePurchaseBtn =
        document.getElementById("savePurchaseBtn");

    const resetPurchaseBtn =
        document.getElementById("resetPurchaseBtn");

    const purchaseTableBody =
        document.getElementById("purchaseTableBody");


    const todayPurchaseValue =
        document.getElementById("todayPurchaseValue");

    const todayPaddyQtyValue =
        document.getElementById("todayPaddyQtyValue");

    const dueBillsValue =
        document.getElementById("dueBillsValue");


    const menuButton =
        document.getElementById("menuButton");

    const sidebar =
        document.getElementById("sidebar");

    const sidebarBackdrop =
        document.getElementById("sidebarBackdrop");


    /* =========================================
       DEFAULT SUPPLIERS
    ========================================= */

    const defaultSuppliers = [

        {
            id: 1,
            name: "Rahim Farmer",
            phone: "01700000001",
            address: "Dinajpur",
            type: "farmer",
            payment: "paid"
        },

        {
            id: 2,
            name: "Karim Supplier",
            phone: "01800000002",
            address: "Bogura",
            type: "supplier",
            payment: "due"
        },

        {
            id: 3,
            name: "Molla Agro",
            phone: "01900000003",
            address: "Naogaon",
            type: "supplier",
            payment: "paid"
        }

    ];


    /* =========================================
       DEFAULT PURCHASES
    ========================================= */

    const defaultPurchases = [

        {
            id: 1,

            purchaseId:
                "P-1024",

            supplierId:
                1,

            supplierName:
                "Rahim Farmer",

            phone:
                "01700000001",

            purchaseDate:
                "2026-07-01",

            date:
                "2026-07-01",

            paddyType:
                "BRRI dhan28",

            weight:
                650,

            moisture:
                14,

            pricePerKg:
                42,

            totalPrice:
                27300,

            payment:
                "paid",

            paidAmount:
                27300,

            dueAmount:
                0
        },


        {
            id: 2,

            purchaseId:
                "P-1023",

            supplierId:
                2,

            supplierName:
                "Karim Supplier",

            phone:
                "01800000002",

            purchaseDate:
                "2026-07-01",

            date:
                "2026-07-01",

            paddyType:
                "BRRI dhan29",

            weight:
                900,

            moisture:
                18,

            pricePerKg:
                42,

            totalPrice:
                37800,

            payment:
                "due",

            paidAmount:
                0,

            dueAmount:
                37800
        },


        {
            id: 3,

            purchaseId:
                "P-1022",

            supplierId:
                3,

            supplierName:
                "Molla Agro",

            phone:
                "01900000003",

            purchaseDate:
                "2026-06-30",

            date:
                "2026-06-30",

            paddyType:
                "Miniket",

            weight:
                500,

            moisture:
                15,

            pricePerKg:
                42,

            totalPrice:
                21000,

            payment:
                "paid",

            paidAmount:
                21000,

            dueAmount:
                0
        }

    ];


    /* =========================================
       EDIT MODE
    ========================================= */

    let editingPurchaseId =
        null;


    /* =========================================
       TODAY DATE
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
       GET SUPPLIERS
    ========================================= */

    function getSuppliers() {

        const stored =
            localStorage.getItem(
                "suppliers"
            );


        if (stored === null) {

            localStorage.setItem(
                "suppliers",
                JSON.stringify(
                    defaultSuppliers
                )
            );


            return [
                ...defaultSuppliers
            ];

        }


        try {

            return (
                JSON.parse(stored) ||
                []
            );

        }
        catch {

            localStorage.setItem(
                "suppliers",
                JSON.stringify(
                    defaultSuppliers
                )
            );


            return [
                ...defaultSuppliers
            ];

        }

    }


    /* =========================================
       LOAD PURCHASES
    ========================================= */

    function loadPurchases() {

        const stored =
            localStorage.getItem(
                "purchases"
            );


        let data;


        if (stored === null) {

            data = [
                ...defaultPurchases
            ];

        }
        else {

            try {

                data =
                    JSON.parse(
                        stored
                    ) || [];

            }
            catch {

                data = [
                    ...defaultPurchases
                ];

            }

        }


        data =
            data.map(
                function (
                    purchase,
                    index
                ) {

                    const weight =
                        Number(
                            purchase.weight ||
                            0
                        );


                    const pricePerKg =
                        Number(
                            purchase.pricePerKg ||
                            0
                        );


                    const totalPrice =

                        purchase.totalPrice ==
                        null

                            ?

                            weight *
                            pricePerKg

                            :

                            Number(
                                purchase.totalPrice ||
                                0
                            );


                    const payment =
                        purchase.payment ||
                        "due";


                    let paidAmount =
                        purchase.paidAmount;


                    let dueAmount =
                        purchase.dueAmount;


                    if (
                        paidAmount ==
                        null
                    ) {

                        paidAmount =

                            payment ===
                            "paid"

                                ?

                                totalPrice

                                :

                                0;

                    }


                    if (
                        dueAmount ==
                        null
                    ) {

                        dueAmount =
                            Math.max(
                                totalPrice -
                                Number(
                                    paidAmount ||
                                    0
                                ),
                                0
                            );

                    }


                    return {

                        ...purchase,


                        id:

                            purchase.id ??

                            Date.now() +
                            index,


                        purchaseId:

                            purchase.purchaseId ||

                            `P-${2000 + index}`,


                        purchaseDate:

                            purchase.purchaseDate ||

                            purchase.date ||

                            getTodayDate(),


                        date:

                            purchase.purchaseDate ||

                            purchase.date ||

                            getTodayDate(),


                        paddyType:

                            purchase.paddyType ||

                            "Not Recorded",


                        weight:
                            weight,


                        moisture:

                            Number(
                                purchase.moisture ||
                                0
                            ),


                        pricePerKg:
                            pricePerKg,


                        totalPrice:
                            totalPrice,


                        payment:
                            payment,


                        paidAmount:

                            Number(
                                paidAmount ||
                                0
                            ),


                        dueAmount:

                            Number(
                                dueAmount ||
                                0
                            )

                    };

                }
            );


        localStorage.setItem(
            "purchases",
            JSON.stringify(data)
        );


        return data;

    }


    let purchases =
        loadPurchases();


    /* =========================================
       SAVE PURCHASES
    ========================================= */

    function savePurchases() {

        localStorage.setItem(
            "purchases",
            JSON.stringify(
                purchases
            )
        );

    }


    /* =========================================
       QUALITY INSPECTIONS
    ========================================= */

    function getQualityInspections() {

        try {

            return (

                JSON.parse(
                    localStorage.getItem(
                        "qualityInspections"
                    )
                ) ||

                []

            );

        }
        catch {

            return [];

        }

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
                value ??
                ""
            );


        return (
            element.innerHTML
        );

    }


    /* =========================================
       MONEY FORMAT
    ========================================= */

    function formatMoney(amount) {

        return (

            "৳" +

            Number(
                amount ||
                0
            ).toLocaleString(
                "en-US",
                {
                    maximumFractionDigits:
                        2
                }
            )

        );

    }


    /* =========================================
       NUMBER FORMAT
    ========================================= */

    function formatNumber(value) {

        return (

            Number(
                value ||
                0
            ).toLocaleString(
                "en-US",
                {
                    maximumFractionDigits:
                        2
                }
            )

        );

    }


    /* =========================================
       DATE FORMAT
    ========================================= */

    function formatDate(
        dateValue
    ) {

        if (!dateValue) {

            return "—";

        }


        const date =
            new Date(
                `${dateValue}T00:00:00`
            );


        return (

            date.toLocaleDateString(
                "en-GB",
                {
                    day:
                        "2-digit",

                    month:
                        "short",

                    year:
                        "numeric"
                }
            )

        );

    }


    /* =========================================
       PAYMENT TEXT
    ========================================= */

    function getPaymentText(
        payment
    ) {

        if (
            payment ===
            "paid"
        ) {

            return "Paid";

        }


        if (
            payment ===
            "partial"
        ) {

            return "Partially Paid";

        }


        return "Due";

    }


    /* =========================================
       PAYMENT CLASS
    ========================================= */

    function getPaymentClass(
        payment
    ) {

        if (
            payment ===
            "paid"
        ) {

            return "status-paid";

        }


        if (
            payment ===
            "partial"
        ) {

            return "status-partial";

        }


        return "status-due";

    }


    /* =========================================
       QUALITY INFORMATION
    ========================================= */

    function getQualityInfo(
        purchaseId
    ) {

        const inspection =
            getQualityInspections()
                .find(
                    function (item) {

                        return (
                            item.purchaseId ===
                            purchaseId
                        );

                    }
                );


        if (!inspection) {

            return {

                text:
                    "Pending Inspection",

                className:
                    "quality-pending"

            };

        }


        const gradeText =

            inspection.grade

                ?

                ` · Grade ${
                    String(
                        inspection.grade
                    ).toUpperCase()
                }`

                :

                "";


        if (
            inspection.decision ===
            "accepted"
        ) {

            return {

                text:
                    `Accepted${gradeText}`,

                className:
                    "quality-accepted"

            };

        }


        if (
            inspection.decision ===
            "rejected"
        ) {

            return {

                text:
                    `Rejected${gradeText}`,

                className:
                    "quality-rejected"

            };

        }


        return {

            text:
                `Review${gradeText}`,

            className:
                "quality-review"

        };

    }


    /* =========================================
       SUPPLIER DROPDOWN
    ========================================= */

    function loadSupplierDropdown(
        selectedId = ""
    ) {

        const suppliers =
            getSuppliers();


        supplierSelect.innerHTML = `

            <option
                value=""
                disabled
            >
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


        if (
            suppliers.length ===
            0
        ) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                "";


            option.disabled =
                true;


            option.textContent =
                "No supplier available — add a supplier first";


            supplierSelect.appendChild(
                option
            );

        }


        supplierSelect.value =

            selectedId

                ?

                String(
                    selectedId
                )

                :

                "";


        updateSupplierPhone();

    }


    /* =========================================
       AUTO PHONE
    ========================================= */

    function updateSupplierPhone() {

        const supplier =
            getSuppliers()
                .find(
                    function (item) {

                        return (

                            Number(
                                item.id
                            ) ===

                            Number(
                                supplierSelect.value
                            )

                        );

                    }
                );


        phoneInput.value =

            supplier

                ?

                supplier.phone ||
                ""

                :

                "";

    }


    /* =========================================
       FINANCIAL CALCULATION
    ========================================= */

    function calculateFinancials() {

        const weight =
            Number(
                paddyWeightInput.value ||
                0
            );


        const price =
            Number(
                priceInput.value ||
                0
            );


        const total =

            weight > 0 &&
            price >= 0

                ?

                weight *
                price

                :

                0;


        totalAmountInput.value =

            total

                ?

                formatMoney(total)

                :

                "৳0";


        const payment =
            paymentStatusSelect.value;


        let paid =
            0;


        if (
            payment ===
            "paid"
        ) {

            paid =
                total;

        }


        if (
            payment ===
            "partial"
        ) {

            paid =
                Math.max(
                    Number(
                        paidAmountInput.value ||
                        0
                    ),
                    0
                );

        }


        const due =
            Math.max(
                total -
                paid,
                0
            );


        dueAmountInput.value =
            formatMoney(
                due
            );


        if (
            payment ===
            "partial"
        ) {

            paymentBalanceText.textContent =

                total > 0

                    ?

                    `Total ${formatMoney(total)} · Remaining ${formatMoney(due)}`

                    :

                    "Enter weight and price to calculate the balance.";

        }
        else {

            paymentBalanceText.textContent =
                "";

        }

    }


    /* =========================================
       PAYMENT FIELD
    ========================================= */

    function updatePaymentField() {

        const isPartial =

            paymentStatusSelect.value ===
            "partial";


        partialPaymentField.hidden =
            !isPartial;


        paidAmountInput.required =
            isPartial;


        if (!isPartial) {

            paidAmountInput.value =
                "";

        }


        calculateFinancials();

    }


    /* =========================================
       SUMMARY CARDS
    ========================================= */

    function updateSummaryCards() {

        const today =
            getTodayDate();


        let todayAmount =
            0;


        let todayWeight =
            0;


        let totalDue =
            0;


        purchases.forEach(
            function (purchase) {

                const purchaseDate =

                    purchase.purchaseDate ||

                    purchase.date;


                if (
                    purchaseDate ===
                    today
                ) {

                    todayAmount +=
                        Number(
                            purchase.totalPrice ||
                            0
                        );


                    todayWeight +=
                        Number(
                            purchase.weight ||
                            0
                        );

                }


                totalDue +=
                    Number(
                        purchase.dueAmount ||
                        0
                    );

            }
        );


        todayPurchaseValue.textContent =
            formatMoney(
                todayAmount
            );


        todayPaddyQtyValue.textContent =

            `${formatNumber(todayWeight)} kg`;


        dueBillsValue.textContent =
            formatMoney(
                totalDue
            );

    }


    /* =========================================
       DISPLAY PURCHASE TABLE
    ========================================= */

    function displayPurchases() {

        purchaseTableBody.innerHTML =
            "";


        if (
            purchases.length ===
            0
        ) {

            purchaseTableBody.innerHTML = `

                <tr class="empty-row">

                    <td colspan="10">

                        No purchase records found.
                        Add the first paddy purchase above.

                    </td>

                </tr>

            `;


            return;

        }


        [
            ...purchases
        ]

            .sort(
                function (
                    a,
                    b
                ) {

                    return (

                        String(
                            b.purchaseDate ||
                            b.date
                        ).localeCompare(
                            String(
                                a.purchaseDate ||
                                a.date
                            )
                        )

                        ||

                        Number(b.id) -
                        Number(a.id)

                    );

                }
            )

            .forEach(
                function (purchase) {

                    const quality =
                        getQualityInfo(
                            purchase.purchaseId
                        );


                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `

                        <td>

                            <strong>
                                ${escapeHTML(
                                    purchase.purchaseId
                                )}
                            </strong>

                        </td>


                        <td>

                            <span class="supplier-name-cell">

                                ${escapeHTML(
                                    purchase.supplierName
                                )}

                            </span>


                            <small>

                                ${escapeHTML(
                                    purchase.phone ||
                                    ""
                                )}

                            </small>

                        </td>


                        <td>

                            ${escapeHTML(
                                purchase.paddyType ||
                                "Not Recorded"
                            )}

                        </td>


                        <td>

                            ${formatNumber(
                                purchase.weight
                            )} kg

                        </td>


                        <td>

                            ${formatNumber(
                                purchase.moisture
                            )}%

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

                            <span
                                class="quality-badge
                                ${quality.className}"
                            >

                                ${escapeHTML(
                                    quality.text
                                )}

                            </span>

                        </td>


                        <td>

                            ${formatDate(
                                purchase.purchaseDate ||
                                purchase.date
                            )}

                        </td>


                        <td class="action-cell">

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


    /* =========================================
       GENERATE PURCHASE ID
    ========================================= */

    function generatePurchaseId() {

        const numericIds =

            purchases

                .map(
                    function (purchase) {

                        const match =

                            String(
                                purchase.purchaseId ||
                                ""
                            ).match(
                                /P-(\d+)/i
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

            Math.max(
                1024,
                ...numericIds
            ) + 1;


        return (
            `P-${next}`
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
            `purchase-toast ${type}`;


        toast.innerHTML = `

            <span class="toast-icon">

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

                ${escapeHTML(message)}

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
       DEFAULT DATE
    ========================================= */

    function setDefaultDate() {

        if (
            !purchaseDateInput.value
        ) {

            purchaseDateInput.value =
                getTodayDate();

        }

    }


    /* =========================================
       NORMAL ADD MODE
    ========================================= */

    function setAddMode() {

        editingPurchaseId =
            null;


        resetPurchaseBtn.hidden =
            true;


        savePurchaseBtn.innerHTML = `

            <span aria-hidden="true">
                ▣
            </span>

            Save Purchase

        `;

    }


    /* =========================================
       RESET FORM
    ========================================= */

    function resetPurchaseForm() {

        purchaseForm.reset();


        setDefaultDate();


        phoneInput.value =
            "";


        totalAmountInput.value =
            "৳0";


        dueAmountInput.value =
            "৳0";


        partialPaymentField.hidden =
            true;


        paidAmountInput.required =
            false;


        paymentBalanceText.textContent =
            "";


        loadSupplierDropdown();


        setAddMode();

    }


    /* =========================================
       VALIDATION
    ========================================= */

    function validateForm() {

        if (
            !supplierSelect.value
        ) {

            return (
                "Please select a supplier or farmer."
            );

        }


        if (
            !purchaseDateInput.value
        ) {

            return (
                "Please select the purchase date."
            );

        }


        if (
            !paddyTypeSelect.value
        ) {

            return (
                "Please select a paddy type."
            );

        }


        const weight =
            Number(
                paddyWeightInput.value
            );


        const moisture =
            Number(
                moistureInput.value
            );


        const price =
            Number(
                priceInput.value
            );


        if (
            !Number.isFinite(weight) ||
            weight <= 0
        ) {

            return (
                "Paddy weight must be greater than zero."
            );

        }


        if (
            !Number.isFinite(moisture) ||
            moisture < 0 ||
            moisture > 100
        ) {

            return (
                "Moisture percentage must be between 0 and 100."
            );

        }


        if (
            !Number.isFinite(price) ||
            price <= 0
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


        const total =
            weight *
            price;


        if (
            paymentStatusSelect.value ===
            "partial"
        ) {

            const paid =
                Number(
                    paidAmountInput.value
                );


            if (
                !Number.isFinite(paid) ||
                paid <= 0 ||
                paid >= total
            ) {

                return (
                    "For partial payment, paid amount must be greater than zero and less than the total amount."
                );

            }

        }


        return "";

    }


    /* =========================================
       BUILD PURCHASE RECORD
    ========================================= */

    function buildPurchaseRecord(
        existingPurchase = null
    ) {

        const supplier =
            getSuppliers()
                .find(
                    function (item) {

                        return (

                            Number(
                                item.id
                            ) ===

                            Number(
                                supplierSelect.value
                            )

                        );

                    }
                );


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


        const totalPrice =
            weight *
            pricePerKg;


        const payment =
            paymentStatusSelect.value;


        let paidAmount =
            0;


        if (
            payment ===
            "paid"
        ) {

            paidAmount =
                totalPrice;

        }


        if (
            payment ===
            "partial"
        ) {

            paidAmount =
                Number(
                    paidAmountInput.value
                );

        }


        const dueAmount =
            Math.max(
                totalPrice -
                paidAmount,
                0
            );


        const purchaseDate =
            purchaseDateInput.value;


        return {

            id:

                existingPurchase

                    ?

                    existingPurchase.id

                    :

                    Date.now(),


            purchaseId:

                existingPurchase

                    ?

                    existingPurchase.purchaseId

                    :

                    generatePurchaseId(),


            supplierId:
                supplier.id,


            supplierName:
                supplier.name,


            phone:
                supplier.phone ||
                "",


            purchaseDate:
                purchaseDate,


            date:
                purchaseDate,


            paddyType:
                paddyTypeSelect.value,


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
                dueAmount

        };

    }


    /* =========================================
       EDIT PURCHASE
    ========================================= */

    function editPurchase(id) {

        const purchase =
            purchases.find(
                function (item) {

                    return (

                        Number(
                            item.id
                        ) ===

                        Number(id)

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


        editingPurchaseId =
            purchase.id;


        loadSupplierDropdown(
            purchase.supplierId
        );


        purchaseDateInput.value =

            purchase.purchaseDate ||

            purchase.date ||

            getTodayDate();


        paddyTypeSelect.value =

            purchase.paddyType ===
            "Not Recorded"

                ?

                ""

                :

                purchase.paddyType;


        paddyWeightInput.value =
            purchase.weight;


        moistureInput.value =
            purchase.moisture;


        priceInput.value =
            purchase.pricePerKg;


        paymentStatusSelect.value =
            purchase.payment;


        updatePaymentField();


        if (
            purchase.payment ===
            "partial"
        ) {

            paidAmountInput.value =
                purchase.paidAmount ||
                "";

        }


        calculateFinancials();


        savePurchaseBtn.innerHTML = `

            <span aria-hidden="true">
                ✓
            </span>

            Update Purchase

        `;


        /* Cancel only visible during edit */

        resetPurchaseBtn.hidden =
            false;


        purchaseForm.scrollIntoView(
            {
                behavior:
                    "smooth",

                block:
                    "center"
            }
        );

    }


    /* =========================================
       DELETE PURCHASE
    ========================================= */

    function deletePurchase(id) {

        const purchase =
            purchases.find(
                function (item) {

                    return (

                        Number(
                            item.id
                        ) ===

                        Number(id)

                    );

                }
            );


        if (!purchase) {
            return;
        }


        const linkedInspection =

            getQualityInspections()
                .some(
                    function (inspection) {

                        return (

                            inspection.purchaseId ===
                            purchase.purchaseId

                        );

                    }
                );


        if (linkedInspection) {

            showToast(
                "This purchase has a linked quality inspection. Remove that inspection before deleting the purchase.",
                "error"
            );

            return;

        }


        const confirmed =
            window.confirm(

                `Delete purchase ${purchase.purchaseId} from ${purchase.supplierName}?`

            );


        if (!confirmed) {
            return;
        }


        purchases =
            purchases.filter(
                function (item) {

                    return (

                        Number(
                            item.id
                        ) !==

                        Number(id)

                    );

                }
            );


        savePurchases();

        displayPurchases();

        updateSummaryCards();


        if (
            Number(
                editingPurchaseId
            ) ===
            Number(id)
        ) {

            resetPurchaseForm();

        }


        showToast(
            "Purchase deleted successfully."
        );

    }


    /* =========================================
       INPUT EVENTS
    ========================================= */

    supplierSelect.addEventListener(
        "change",
        updateSupplierPhone
    );


    paddyWeightInput.addEventListener(
        "input",
        calculateFinancials
    );


    priceInput.addEventListener(
        "input",
        calculateFinancials
    );


    paidAmountInput.addEventListener(
        "input",
        calculateFinancials
    );


    paymentStatusSelect.addEventListener(
        "change",
        updatePaymentField
    );


    /* =========================================
       SAVE / UPDATE
    ========================================= */

    purchaseForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const errorMessage =
                validateForm();


            if (errorMessage) {

                showToast(
                    errorMessage,
                    "error"
                );

                return;

            }


            if (
                editingPurchaseId !==
                null
            ) {

                const index =
                    purchases.findIndex(
                        function (item) {

                            return (

                                Number(
                                    item.id
                                ) ===

                                Number(
                                    editingPurchaseId
                                )

                            );

                        }
                    );


                if (
                    index ===
                    -1
                ) {

                    showToast(
                        "Purchase record not found.",
                        "error"
                    );

                    return;

                }


                purchases[index] =
                    buildPurchaseRecord(
                        purchases[index]
                    );


                showToast(
                    "Purchase updated successfully."
                );

            }
            else {

                purchases.push(
                    buildPurchaseRecord()
                );


                showToast(
                    "Purchase saved successfully."
                );

            }


            savePurchases();

            displayPurchases();

            updateSummaryCards();

            resetPurchaseForm();

        }
    );


    /* =========================================
       CANCEL EDIT
    ========================================= */

    resetPurchaseBtn.addEventListener(
        "click",
        function () {

            resetPurchaseForm();

            showToast(
                "Edit cancelled."
            );

        }
    );


    /* =========================================
       TABLE EVENTS
    ========================================= */

    purchaseTableBody.addEventListener(
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


    document.addEventListener(
        "keydown",
        function (event) {

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
       INITIALIZE
    ========================================= */

    setDefaultDate();

    loadSupplierDropdown();

    updatePaymentField();

    displayPurchases();

    updateSummaryCards();

    /*
        Important:
        start page in ADD mode.
        Therefore Cancel Edit is hidden.
    */

    setAddMode();

});