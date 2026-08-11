document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // ELEMENTS
    // ==========================================

    const inventoryAdjustmentForm =
        document.getElementById("inventoryAdjustmentForm");

    const productSelect =
        document.getElementById("product");

    const adjustmentTypeSelect =
        document.getElementById("adjustment-type");

    const adjustmentQuantityInput =
        document.getElementById("adjustment-quantity");

    const adjustmentDateInput =
        document.getElementById("adjustment-date");

    const adjustmentReasonInput =
        document.getElementById("adjustment-reason");

    const saveAdjustmentBtn =
        document.getElementById("saveAdjustmentBtn");

    const inventoryTableBody =
        document.getElementById("inventoryTableBody");

    const adjustmentTableBody =
        document.getElementById("adjustmentTableBody");


    // Summary Cards

    const riceStockValue =
        document.getElementById("riceStockValue");

    const paddyStockValue =
        document.getElementById("paddyStockValue");

    const lowStockValue =
        document.getElementById("lowStockValue");


    // ==========================================
    // SETTINGS
    // ==========================================

    const LOW_STOCK_LIMIT = 100;

    let editingAdjustmentId = null;


    // ==========================================
    // GET PURCHASE DATA
    // ==========================================

    function getPurchases() {

        return (
            JSON.parse(
                localStorage.getItem("purchases")
            ) || []
        );

    }


    // ==========================================
    // GET PRODUCTION DATA
    // ==========================================

    function getProductions() {

        return (
            JSON.parse(
                localStorage.getItem("productions")
            ) || []
        );

    }


    // ==========================================
    // GET SALES DATA
    // ==========================================

    function getSales() {

        return (
            JSON.parse(
                localStorage.getItem("sales")
            ) || []
        );

    }


    // ==========================================
    // LOAD MANUAL ADJUSTMENTS
    // ==========================================

    let adjustments =
        JSON.parse(
            localStorage.getItem(
                "inventoryAdjustments"
            )
        ) || [];


    // ==========================================
    // FIX OLD ADJUSTMENTS WITHOUT ID
    // ==========================================

    adjustments =
        adjustments.map(
            function (adjustment, index) {

                if (
                    adjustment.id === undefined ||
                    adjustment.id === null
                ) {

                    adjustment.id =
                        Date.now() + index;

                }


                return adjustment;

            }
        );


    saveAdjustments();


    // ==========================================
    // SAVE ADJUSTMENTS
    // ==========================================

    function saveAdjustments() {

        localStorage.setItem(
            "inventoryAdjustments",
            JSON.stringify(adjustments)
        );

    }


    // ==========================================
    // TODAY DATE
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
    // FORMAT DATE
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
    // PRODUCT NAME
    // ==========================================

    function getProductText(product) {

        if (product === "paddy") {
            return "Paddy";
        }

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
    // MANUAL STOCK ADJUSTMENT TOTAL
    // ==========================================

    function getManualAdjustment(product) {

        let adjustmentTotal = 0;


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

                    adjustmentTotal +=
                        quantity;

                }


                if (
                    adjustment.type ===
                    "remove"
                ) {

                    adjustmentTotal -=
                        quantity;

                }

            }
        );


        return adjustmentTotal;

    }


    // ==========================================
    // TOTAL SOLD QUANTITY
    // ==========================================

    function getSoldQuantity(product) {

        const sales =
            getSales();


        let totalSold = 0;


        sales.forEach(
            function (sale) {

                if (
                    sale.product ===
                    product
                ) {

                    totalSold +=
                        Number(
                            sale.quantity || 0
                        );

                }

            }
        );


        return totalSold;

    }


    // ==========================================
    // CALCULATE CURRENT INVENTORY
    // ==========================================

    function calculateInventory() {

        const purchases =
            getPurchases();


        const productions =
            getProductions();


        // --------------------------------------
        // Purchase Data
        // --------------------------------------

        let purchasedPaddy = 0;


        purchases.forEach(
            function (purchase) {

                purchasedPaddy +=
                    Number(
                        purchase.weight || 0
                    );

            }
        );


        // --------------------------------------
        // Production Data
        // --------------------------------------

        let productionInputPaddy = 0;

        let riceProduced = 0;

        let khudProduced = 0;

        let tushProduced = 0;


        productions.forEach(
            function (production) {

                productionInputPaddy +=
                    Number(
                        production.inputPaddy || 0
                    );


                riceProduced +=
                    Number(
                        production.riceProduced || 0
                    );


                khudProduced +=
                    Number(
                        production.khudProduced || 0
                    );


                tushProduced +=
                    Number(
                        production.tushProduced || 0
                    );

            }
        );


        // --------------------------------------
        // Sales Data
        // --------------------------------------

        const riceSold =
            getSoldQuantity("rice");


        const khudSold =
            getSoldQuantity("khud");


        const tushSold =
            getSoldQuantity("tush");


        // --------------------------------------
        // Final Paddy Stock
        // --------------------------------------

        let paddyStock =

            purchasedPaddy

            -

            productionInputPaddy

            +

            getManualAdjustment(
                "paddy"
            );


        // --------------------------------------
        // Final Rice Stock
        // --------------------------------------

        let riceStock =

            riceProduced

            -

            riceSold

            +

            getManualAdjustment(
                "rice"
            );


        // --------------------------------------
        // Final Khud Stock
        // --------------------------------------

        let khudStock =

            khudProduced

            -

            khudSold

            +

            getManualAdjustment(
                "khud"
            );


        // --------------------------------------
        // Final Tush Stock
        // --------------------------------------

        let tushStock =

            tushProduced

            -

            tushSold

            +

            getManualAdjustment(
                "tush"
            );


        // Prevent negative display

        paddyStock =
            Math.max(
                0,
                paddyStock
            );


        riceStock =
            Math.max(
                0,
                riceStock
            );


        khudStock =
            Math.max(
                0,
                khudStock
            );


        tushStock =
            Math.max(
                0,
                tushStock
            );


        return {

            paddy: paddyStock,

            rice: riceStock,

            khud: khudStock,

            tush: tushStock

        };

    }


    // ==========================================
    // STOCK STATUS
    // ==========================================

    function getStockStatus(stock) {

        if (stock <= 0) {

            return {

                text:
                    "Out of Stock",

                className:
                    "inventory-status-out"

            };

        }


        if (
            stock <
            LOW_STOCK_LIMIT
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
                "Active",

            className:
                "status-active"

        };

    }


    // ==========================================
    // DISPLAY CURRENT INVENTORY
    // ==========================================

    function displayInventory() {

        const inventory =
            calculateInventory();


        inventoryTableBody.innerHTML =
            "";


        const products = [

            {
                key: "paddy",
                name: "Paddy"
            },

            {
                key: "rice",
                name: "Rice"
            },

            {
                key: "khud",
                name: "Khud"
            },

            {
                key: "tush",
                name: "Tush"
            }

        ];


        products.forEach(
            function (product) {

                const stock =
                    Number(
                        inventory[
                            product.key
                        ] || 0
                    );


                const status =
                    getStockStatus(
                        stock
                    );


                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>

                        ${product.name}

                    </td>


                    <td>

                        ${stock.toLocaleString(
                            "en-US",
                            {
                                maximumFractionDigits: 2
                            }
                        )}

                    </td>


                    <td>

                        kg

                    </td>


                    <td>

                        ${formatDate(
                            getTodayDate()
                        )}

                    </td>


                    <td>

                        <span
                            class="status-badge
                            ${status.className}"
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


        updateSummaryCards(
            inventory
        );

    }


    // ==========================================
    // SUMMARY CARDS
    // ==========================================

    function updateSummaryCards(
        inventory
    ) {

        riceStockValue.textContent =
            Number(
                inventory.rice
            ).toLocaleString(
                "en-US",
                {
                    maximumFractionDigits: 2
                }
            ) +
            " kg";


        paddyStockValue.textContent =
            Number(
                inventory.paddy
            ).toLocaleString(
                "en-US",
                {
                    maximumFractionDigits: 2
                }
            ) +
            " kg";


        let lowStockCount = 0;


        Object.values(
            inventory
        ).forEach(
            function (stock) {

                if (
                    Number(stock) <
                    LOW_STOCK_LIMIT
                ) {

                    lowStockCount++;

                }

            }
        );


        lowStockValue.textContent =
            lowStockCount +
            (
                lowStockCount === 1
                    ? " Item"
                    : " Items"
            );

    }


    // ==========================================
    // DISPLAY ADJUSTMENT HISTORY
    // ==========================================

    function displayAdjustments() {

        adjustmentTableBody.innerHTML =
            "";


        adjustments.forEach(
            function (adjustment) {

                const row =
                    document.createElement(
                        "tr"
                    );


                const adjustmentText =

                    adjustment.type ===
                    "add"

                        ? "Add Stock"

                        : "Remove Stock";


                row.innerHTML = `

                    <td>

                        ${getProductText(
                            adjustment.product
                        )}

                    </td>


                    <td>

                        ${adjustmentText}

                    </td>


                    <td>

                        ${Number(
                            adjustment.quantity
                        ).toLocaleString(
                            "en-US",
                            {
                                maximumFractionDigits: 2
                            }
                        )} kg

                    </td>


                    <td>

                        ${escapeHTML(
                            adjustment.reason
                        )}

                    </td>


                    <td>

                        ${formatDate(
                            adjustment.date
                        )}

                    </td>


                    <td>

                        <button
                            class="inventory-edit-button"
                            type="button"
                            data-action="edit"
                            data-id="${adjustment.id}"
                        >

                            Edit

                        </button>


                        <button
                            class="inventory-delete-button"
                            type="button"
                            data-action="delete"
                            data-id="${adjustment.id}"
                        >

                            Delete

                        </button>

                    </td>

                `;


                adjustmentTableBody.appendChild(
                    row
                );

            }
        );

    }


    // ==========================================
    // SAVE / UPDATE STOCK ADJUSTMENT
    // ==========================================

    inventoryAdjustmentForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const product =
                productSelect.value;


            const type =
                adjustmentTypeSelect.value;


            const quantity =
                Number(
                    adjustmentQuantityInput.value
                );


            const date =
                adjustmentDateInput.value;


            const reason =
                adjustmentReasonInput.value.trim();


            // ----------------------------------
            // Validation
            // ----------------------------------

            if (!product) {

                showToast(
                    "Please select a product.",
                    "error"
                );

                return;

            }


            if (!type) {

                showToast(
                    "Please select an adjustment type.",
                    "error"
                );

                return;

            }


            if (
                adjustmentQuantityInput.value ===
                    "" ||
                quantity <= 0
            ) {

                showToast(
                    "Please enter a valid quantity.",
                    "error"
                );

                return;

            }


            if (!date) {

                showToast(
                    "Please select adjustment date.",
                    "error"
                );

                return;

            }


            if (!reason) {

                showToast(
                    "Please enter an adjustment reason.",
                    "error"
                );

                return;

            }


            // ==================================
            // REMOVE STOCK VALIDATION
            // ==================================

            if (
                type === "remove"
            ) {

                const inventory =
                    calculateInventory();


                const availableStock =
                    Number(
                        inventory[
                            product
                        ] || 0
                    );


                let oldAdjustmentEffect =
                    0;


                if (
                    editingAdjustmentId !==
                    null
                ) {

                    const oldAdjustment =
                        adjustments.find(
                            function (
                                adjustment
                            ) {

                                return (
                                    adjustment.id ===
                                    editingAdjustmentId
                                );

                            }
                        );


                    if (
                        oldAdjustment &&
                        oldAdjustment.product ===
                            product
                    ) {

                        if (
                            oldAdjustment.type ===
                            "add"
                        ) {

                            oldAdjustmentEffect =
                                Number(
                                    oldAdjustment.quantity
                                );

                        } else {

                            oldAdjustmentEffect =
                                -Number(
                                    oldAdjustment.quantity
                                );

                        }

                    }

                }


                const stockBeforeCurrentEdit =

                    availableStock

                    -

                    oldAdjustmentEffect;


                if (
                    quantity >
                    stockBeforeCurrentEdit
                ) {

                    showToast(
                        "Cannot remove more than available stock.",
                        "error"
                    );

                    return;

                }

            }


            // ==================================
            // UPDATE
            // ==================================

            if (
                editingAdjustmentId !==
                null
            ) {

                const index =
                    adjustments.findIndex(
                        function (
                            adjustment
                        ) {

                            return (
                                adjustment.id ===
                                editingAdjustmentId
                            );

                        }
                    );


                if (index !== -1) {

                    adjustments[index] = {

                        id:
                            editingAdjustmentId,

                        product:
                            product,

                        type:
                            type,

                        quantity:
                            quantity,

                        date:
                            date,

                        reason:
                            reason

                    };

                }


                saveAdjustments();

                displayInventory();

                displayAdjustments();

                resetAdjustmentForm();


                showToast(
                    "Stock adjustment updated successfully!"
                );


                return;

            }


            // ==================================
            // NEW ADJUSTMENT
            // ==================================

            const newAdjustment = {

                id:
                    Date.now(),

                product:
                    product,

                type:
                    type,

                quantity:
                    quantity,

                date:
                    date,

                reason:
                    reason

            };


            adjustments.push(
                newAdjustment
            );


            saveAdjustments();

            displayInventory();

            displayAdjustments();

            resetAdjustmentForm();


            showToast(
                "Stock adjustment saved successfully!"
            );

        }
    );


    // ==========================================
    // TABLE BUTTON EVENTS
    // ==========================================

    adjustmentTableBody.addEventListener(
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

                editAdjustment(id);

            }


            if (
                button.dataset.action ===
                "delete"
            ) {

                deleteAdjustment(id);

            }

        }
    );


    // ==========================================
    // EDIT ADJUSTMENT
    // ==========================================

    function editAdjustment(id) {

        const adjustment =
            adjustments.find(
                function (adjustment) {

                    return (
                        adjustment.id ===
                        id
                    );

                }
            );


        if (!adjustment) {

            showToast(
                "Adjustment record not found.",
                "error"
            );

            return;

        }


        productSelect.value =
            adjustment.product;


        adjustmentTypeSelect.value =
            adjustment.type;


        adjustmentQuantityInput.value =
            adjustment.quantity;


        adjustmentDateInput.value =
            adjustment.date;


        adjustmentReasonInput.value =
            adjustment.reason;


        editingAdjustmentId =
            adjustment.id;


        saveAdjustmentBtn.innerHTML = `

            <span aria-hidden="true">
                ▣
            </span>

            Update Adjustment

        `;


        productSelect.focus();


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }


    // ==========================================
    // DELETE ADJUSTMENT
    // ==========================================

    function deleteAdjustment(id) {

        const exists =
            adjustments.some(
                function (adjustment) {

                    return (
                        adjustment.id ===
                        id
                    );

                }
            );


        if (!exists) {

            showToast(
                "Adjustment record not found.",
                "error"
            );

            return;

        }


        adjustments =
            adjustments.filter(
                function (adjustment) {

                    return (
                        adjustment.id !==
                        id
                    );

                }
            );


        saveAdjustments();

        displayInventory();

        displayAdjustments();


        if (
            editingAdjustmentId ===
            id
        ) {

            resetAdjustmentForm();

        }


        showToast(
            "Stock adjustment deleted successfully!"
        );

    }


    // ==========================================
    // RESET FORM
    // ==========================================

    function resetAdjustmentForm() {

        inventoryAdjustmentForm.reset();


        adjustmentDateInput.value =
            getTodayDate();


        editingAdjustmentId =
            null;


        saveAdjustmentBtn.innerHTML = `

            <span aria-hidden="true">
                ▣
            </span>

            Save Adjustment

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
            "inventory-toast " +
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

                ${escapeHTML(
                    message
                )}

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
    // EXTRA DESIGN
    // ==========================================

    const style =
        document.createElement(
            "style"
        );


    style.textContent = `

        .inventory-status-out {

            background-color: #fdeaea;

            color: #c62828;

            border: 1px solid #efb8b8;

        }


        .inventory-edit-button {

            padding: 7px 15px;

            border: 1px solid #15913a;

            border-radius: 6px;

            background: #ffffff;

            color: #15913a;

            font-weight: 600;

            cursor: pointer;

        }


        .inventory-edit-button:hover {

            background-color:
                #edf8f0;

        }


        .inventory-delete-button {

            margin-left: 6px;

            padding: 7px 15px;

            border:
                1px solid #efb8b8;

            border-radius: 6px;

            background-color:
                #fff5f5;

            color: #c62828;

            font-weight: 600;

            cursor: pointer;

        }


        .inventory-delete-button:hover {

            background-color:
                #fdeaea;

        }


        .inventory-toast {

            position: fixed;

            top: 25px;

            right: 25px;

            min-width: 280px;

            display: flex;

            align-items: center;

            gap: 12px;

            padding: 14px 18px;

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


        .inventory-toast.show {

            opacity: 1;

            transform:
                translateX(0);

        }


        .inventory-toast .toast-icon {

            width: 26px;

            height: 26px;

            display: flex;

            align-items: center;

            justify-content: center;

            border-radius: 50%;

            background-color:
                #e7f5eb;

            color:
                #15913a;

            font-weight: bold;

        }


        .inventory-toast.error {

            border-left-color:
                #d32f2f;

            color:
                #8f1d1d;

        }


        .inventory-toast.error
        .toast-icon {

            background-color:
                #fdeaea;

            color:
                #d32f2f;

        }

    `;


    document.head.appendChild(
        style
    );


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    adjustmentDateInput.value =
        getTodayDate();


    displayInventory();

    displayAdjustments();

});