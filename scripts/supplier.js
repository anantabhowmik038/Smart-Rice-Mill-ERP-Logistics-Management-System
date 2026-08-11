document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // FORM ELEMENTS
    // ==========================================

    const supplierForm =
        document.getElementById("supplierForm");

    const supplierName =
        document.getElementById("supplier-name");

    const phoneNumber =
        document.getElementById("phone-number");

    const address =
        document.getElementById("address");

    const supplierType =
        document.getElementById("supplier-type");

    const paymentStatus =
        document.getElementById("payment-status");

    const saveSupplierBtn =
        document.getElementById("saveSupplierBtn");

    const supplierTableBody =
        document.getElementById("supplierTableBody");


    // ==========================================
    // EDIT MODE
    // ==========================================

    let editingSupplierId = null;


    // ==========================================
    // DEFAULT DATA
    // ==========================================

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


    // ==========================================
    // LOAD DATA FROM LOCAL STORAGE
    // ==========================================

    const storedSuppliers =
        localStorage.getItem("suppliers");


    let suppliers;


    if (storedSuppliers === null) {

        suppliers = defaultSuppliers;

        saveSuppliersToLocalStorage();

    } else {

        suppliers =
            JSON.parse(storedSuppliers) || [];

    }


    // ==========================================
    // FIX OLD RECORDS WITHOUT ID
    // ==========================================

    let oldDataUpdated = false;


    suppliers = suppliers.map(
        function (supplier, index) {

            if (
                supplier.id === undefined ||
                supplier.id === null
            ) {

                supplier.id =
                    Date.now() + index;

                oldDataUpdated = true;

            }

            return supplier;

        }
    );


    if (oldDataUpdated) {

        saveSuppliersToLocalStorage();

    }


    // ==========================================
    // SAVE LOCAL STORAGE
    // ==========================================

    function saveSuppliersToLocalStorage() {

        localStorage.setItem(
            "suppliers",
            JSON.stringify(suppliers)
        );

    }


    // ==========================================
    // TYPE TEXT
    // ==========================================

    function getTypeText(type) {

        if (type === "farmer") {
            return "Farmer";
        }

        if (type === "supplier") {
            return "Supplier";
        }

        if (type === "farmer-supplier") {
            return "Farmer & Supplier";
        }

        return type;

    }


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


    // ==========================================
    // PAYMENT CLASS
    // ==========================================

    function getPaymentClass(payment) {

        if (payment === "paid") {
            return "status-paid";
        }

        if (payment === "due") {
            return "status-due";
        }

        if (payment === "partial") {
            return "status-due";
        }

        return "";

    }


    // ==========================================
    // SAFE TEXT
    // ==========================================

    function escapeHTML(value) {

        const element =
            document.createElement("div");

        element.textContent = value;

        return element.innerHTML;

    }


    // ==========================================
    // TOAST MESSAGE
    // ==========================================

    function showToast(message, type = "success") {

        const oldToast =
            document.querySelector(".supplier-toast");


        if (oldToast) {

            oldToast.remove();

        }


        const toast =
            document.createElement("div");


        toast.className =
            "supplier-toast " + type;


        if (type === "success") {

            toast.innerHTML = `

                <span class="toast-icon">
                    ✓
                </span>

                <span>
                    ${message}
                </span>

            `;

        } else {

            toast.innerHTML = `

                <span class="toast-icon">
                    !
                </span>

                <span>
                    ${message}
                </span>

            `;

        }


        document.body.appendChild(toast);


        setTimeout(function () {

            toast.classList.add("show");

        }, 50);


        setTimeout(function () {

            toast.classList.remove("show");


            setTimeout(function () {

                toast.remove();

            }, 300);

        }, 2500);

    }


    // ==========================================
    // DISPLAY TABLE
    // ==========================================

    function displaySuppliers() {

        supplierTableBody.innerHTML = "";


        suppliers.forEach(function (supplier) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${escapeHTML(supplier.name)}
                </td>

                <td>
                    ${getTypeText(supplier.type)}
                </td>

                <td>
                    ${escapeHTML(supplier.phone)}
                </td>

                <td>
                    ${escapeHTML(supplier.address)}
                </td>

                <td>

                    <span
                        class="status-badge
                        ${getPaymentClass(supplier.payment)}"
                    >

                        ${getPaymentText(supplier.payment)}

                    </span>

                </td>

                <td>

                    <button
                        class="edit-button"
                        type="button"
                        data-action="edit"
                        data-id="${supplier.id}"
                    >
                        Edit
                    </button>


                    <button
                        class="edit-button delete-button"
                        type="button"
                        data-action="delete"
                        data-id="${supplier.id}"
                    >
                        Delete
                    </button>

                </td>

            `;


            supplierTableBody.appendChild(row);

        });

    }


    // ==========================================
    // ADD / UPDATE SUPPLIER
    // ==========================================

    supplierForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                supplierName.value.trim();

            const phone =
                phoneNumber.value.trim();

            const supplierAddress =
                address.value.trim();

            const type =
                supplierType.value;

            const payment =
                paymentStatus.value;


            // ==================================
            // DUPLICATE PHONE CHECK
            // ==================================

            const duplicatePhone =
                suppliers.some(
                    function (supplier) {

                        return (
                            supplier.phone === phone &&
                            supplier.id !== editingSupplierId
                        );

                    }
                );


            if (duplicatePhone) {

                showToast(
                    "This phone number already exists.",
                    "error"
                );

                return;

            }


            // ==================================
            // UPDATE EXISTING SUPPLIER
            // ==================================

            if (editingSupplierId !== null) {

                const supplierIndex =
                    suppliers.findIndex(
                        function (supplier) {

                            return (
                                supplier.id ===
                                editingSupplierId
                            );

                        }
                    );


                if (supplierIndex !== -1) {

                    suppliers[supplierIndex] = {

                        id: editingSupplierId,

                        name: name,

                        phone: phone,

                        address: supplierAddress,

                        type: type,

                        payment: payment

                    };

                }


                saveSuppliersToLocalStorage();

                displaySuppliers();

                resetForm();


                showToast(
                    "Supplier updated successfully!"
                );

                return;

            }


            // ==================================
            // ADD NEW SUPPLIER
            // ==================================

            const newSupplier = {

                id: Date.now(),

                name: name,

                phone: phone,

                address: supplierAddress,

                type: type,

                payment: payment

            };


            suppliers.push(newSupplier);


            saveSuppliersToLocalStorage();

            displaySuppliers();

            resetForm();


            showToast(
                "Supplier saved successfully!"
            );

        }
    );


    // ==========================================
    // TABLE BUTTON EVENTS
    // ==========================================

    supplierTableBody.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest("button");


            if (!button) {
                return;
            }


            const supplierId =
                Number(button.dataset.id);

            const action =
                button.dataset.action;


            if (action === "edit") {

                editSupplier(supplierId);

            }


            if (action === "delete") {

                deleteSupplier(supplierId);

            }

        }
    );


    // ==========================================
    // EDIT SUPPLIER
    // ==========================================

    function editSupplier(id) {

        const supplier =
            suppliers.find(
                function (supplier) {

                    return supplier.id === id;

                }
            );


        if (!supplier) {

            showToast(
                "Supplier record not found.",
                "error"
            );

            return;

        }


        supplierName.value =
            supplier.name;

        phoneNumber.value =
            supplier.phone;

        address.value =
            supplier.address;

        supplierType.value =
            supplier.type;

        paymentStatus.value =
            supplier.payment;


        editingSupplierId =
            supplier.id;


        saveSupplierBtn.innerHTML = `

            <span aria-hidden="true">
                ▣
            </span>

            Update Supplier

        `;


        supplierName.focus();


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }


    // ==========================================
    // DELETE SUPPLIER
    // ==========================================

    function deleteSupplier(id) {

        const supplierExists =
            suppliers.some(
                function (supplier) {

                    return supplier.id === id;

                }
            );


        if (!supplierExists) {

            showToast(
                "Supplier record not found.",
                "error"
            );

            return;

        }


        suppliers =
            suppliers.filter(
                function (supplier) {

                    return supplier.id !== id;

                }
            );


        saveSuppliersToLocalStorage();

        displaySuppliers();


        if (editingSupplierId === id) {

            resetForm();

        }


        showToast(
            "Supplier deleted successfully!"
        );

    }


    // ==========================================
    // RESET FORM
    // ==========================================

    function resetForm() {

        supplierForm.reset();

        editingSupplierId = null;


        saveSupplierBtn.innerHTML = `

            <span aria-hidden="true">
                ▣
            </span>

            Save Supplier

        `;

    }


    // ==========================================
    // EXTRA DESIGN
    // ==========================================

    const supplierStyle =
        document.createElement("style");


    supplierStyle.textContent = `

        /* DELETE BUTTON */

        .supplier-table .delete-button {

            margin-left: 6px;

            color: #c62828;

            border-color: #efb8b8;

            background-color: #fff5f5;

        }


        .supplier-table .delete-button:hover {

            background-color: #fdeaea;

        }


        /* TOAST */

        .supplier-toast {

            position: fixed;

            top: 25px;
            right: 25px;

            min-width: 280px;

            display: flex;
            align-items: center;
            gap: 12px;

            padding: 14px 18px;

            background-color: #ffffff;

            color: #17351f;

            border-left: 5px solid #15913a;

            border-radius: 8px;

            box-shadow:
                0 6px 20px
                rgba(0, 0, 0, 0.15);

            font-size: 14px;
            font-weight: 600;

            z-index: 9999;

            opacity: 0;

            transform: translateX(30px);

            transition:
                opacity 0.3s ease,
                transform 0.3s ease;

        }


        .supplier-toast.show {

            opacity: 1;

            transform: translateX(0);

        }


        .supplier-toast .toast-icon {

            width: 26px;
            height: 26px;

            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 50%;

            background-color: #e7f5eb;

            color: #15913a;

            font-weight: bold;

        }


        .supplier-toast.error {

            border-left-color: #d32f2f;

            color: #8f1d1d;

        }


        .supplier-toast.error .toast-icon {

            background-color: #fdeaea;

            color: #d32f2f;

        }

    `;


    document.head.appendChild(
        supplierStyle
    );


    // ==========================================
    // INITIAL DISPLAY
    // ==========================================

    displaySuppliers();

});