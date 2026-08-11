document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // FORM ELEMENTS
    // ==========================================

    const customerForm =
        document.getElementById("customerForm");

    const customerName =
        document.getElementById("customer-name");

    const phoneNumber =
        document.getElementById("phone-number");

    const city =
        document.getElementById("city");

    const customerType =
        document.getElementById("customer-type");

    const paymentStatus =
        document.getElementById("payment-status");

    const saveCustomerBtn =
        document.getElementById("saveCustomerBtn");

    const customerTableBody =
        document.getElementById("customerTableBody");


    // ==========================================
    // EDIT MODE
    // ==========================================

    let editingCustomerId = null;


    // ==========================================
    // DEFAULT CUSTOMER DATA
    // ==========================================

    const defaultCustomers = [

        {
            id: 1,
            name: "ABC Traders",
            phone: "01700000011",
            city: "Dhaka",
            type: "dealer",
            payment: "due"
        },

        {
            id: 2,
            name: "Bhowmik Store",
            phone: "01800000012",
            city: "Khulna",
            type: "retailer",
            payment: "paid"
        },

        {
            id: 3,
            name: "Dhaka Foods",
            phone: "01900000013",
            city: "Dhaka",
            type: "business",
            payment: "paid"
        }

    ];


    // ==========================================
    // LOAD LOCAL STORAGE DATA
    // ==========================================

    const storedCustomers =
        localStorage.getItem("customers");

    let customers;


    if (storedCustomers === null) {

        customers = defaultCustomers;

        saveCustomersToLocalStorage();

    } else {

        customers =
            JSON.parse(storedCustomers) || [];

    }


    // ==========================================
    // FIX OLD RECORDS WITHOUT ID
    // ==========================================

    let oldDataUpdated = false;


    customers = customers.map(
        function (customer, index) {

            if (
                customer.id === undefined ||
                customer.id === null
            ) {

                customer.id =
                    Date.now() + index;

                oldDataUpdated = true;

            }

            return customer;

        }
    );


    if (oldDataUpdated) {

        saveCustomersToLocalStorage();

    }


    // ==========================================
    // SAVE LOCAL STORAGE
    // ==========================================

    function saveCustomersToLocalStorage() {

        localStorage.setItem(
            "customers",
            JSON.stringify(customers)
        );

    }


    // ==========================================
    // CUSTOMER TYPE TEXT
    // ==========================================

    function getCustomerTypeText(type) {

        if (type === "dealer") {
            return "Dealer";
        }

        if (type === "retailer") {
            return "Retailer";
        }

        if (type === "business") {
            return "Business";
        }

        if (type === "wholesaler") {
            return "Wholesaler";
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
    // PROFESSIONAL TOAST
    // ==========================================

    function showToast(message, type = "success") {

        const oldToast =
            document.querySelector(".customer-toast");


        if (oldToast) {

            oldToast.remove();

        }


        const toast =
            document.createElement("div");


        toast.className =
            "customer-toast " + type;


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
    // DISPLAY CUSTOMERS
    // ==========================================

    function displayCustomers() {

        customerTableBody.innerHTML = "";


        customers.forEach(function (customer) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${escapeHTML(customer.name)}
                </td>

                <td>
                    ${escapeHTML(customer.phone)}
                </td>

                <td>
                    ${escapeHTML(customer.city)}
                </td>

                <td>
                    ${getCustomerTypeText(customer.type)}
                </td>

                <td>

                    <span
                        class="status-badge
                        ${getPaymentClass(customer.payment)}"
                    >
                        ${getPaymentText(customer.payment)}
                    </span>

                </td>

                <td>

                    <button
                        class="edit-button"
                        type="button"
                        data-action="edit"
                        data-id="${customer.id}"
                    >
                        Edit
                    </button>


                    <button
                        class="edit-button customer-delete-button"
                        type="button"
                        data-action="delete"
                        data-id="${customer.id}"
                    >
                        Delete
                    </button>

                </td>

            `;


            customerTableBody.appendChild(row);

        });

    }


    // ==========================================
    // ADD / UPDATE CUSTOMER
    // ==========================================

    customerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                customerName.value.trim();

            const phone =
                phoneNumber.value.trim();

            const customerCity =
                city.value.trim();

            const type =
                customerType.value;

            const payment =
                paymentStatus.value;


            // ==================================
            // DUPLICATE PHONE CHECK
            // ==================================

            const duplicatePhone =
                customers.some(
                    function (customer) {

                        return (
                            customer.phone === phone &&
                            customer.id !== editingCustomerId
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
            // UPDATE CUSTOMER
            // ==================================

            if (editingCustomerId !== null) {

                const customerIndex =
                    customers.findIndex(
                        function (customer) {

                            return (
                                customer.id ===
                                editingCustomerId
                            );

                        }
                    );


                if (customerIndex !== -1) {

                    customers[customerIndex] = {

                        id: editingCustomerId,

                        name: name,

                        phone: phone,

                        city: customerCity,

                        type: type,

                        payment: payment

                    };

                }


                saveCustomersToLocalStorage();

                displayCustomers();

                resetForm();


                showToast(
                    "Customer updated successfully!"
                );

                return;

            }


            // ==================================
            // ADD NEW CUSTOMER
            // ==================================

            const newCustomer = {

                id: Date.now(),

                name: name,

                phone: phone,

                city: customerCity,

                type: type,

                payment: payment

            };


            customers.push(newCustomer);


            saveCustomersToLocalStorage();

            displayCustomers();

            resetForm();


            showToast(
                "Customer saved successfully!"
            );

        }
    );


    // ==========================================
    // TABLE BUTTON EVENTS
    // ==========================================

    customerTableBody.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest("button");


            if (!button) {
                return;
            }


            const customerId =
                Number(button.dataset.id);

            const action =
                button.dataset.action;


            if (action === "edit") {

                editCustomer(customerId);

            }


            if (action === "delete") {

                deleteCustomer(customerId);

            }

        }
    );


    // ==========================================
    // EDIT CUSTOMER
    // ==========================================

    function editCustomer(id) {

        const customer =
            customers.find(
                function (customer) {

                    return customer.id === id;

                }
            );


        if (!customer) {

            showToast(
                "Customer record not found.",
                "error"
            );

            return;

        }


        customerName.value =
            customer.name;

        phoneNumber.value =
            customer.phone;

        city.value =
            customer.city;

        customerType.value =
            customer.type;

        paymentStatus.value =
            customer.payment;


        editingCustomerId =
            customer.id;


        saveCustomerBtn.innerHTML = `

            <span aria-hidden="true">
                ▣
            </span>

            Update Customer

        `;


        customerName.focus();


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }


    // ==========================================
    // DELETE CUSTOMER
    // ==========================================

    function deleteCustomer(id) {

        const customerExists =
            customers.some(
                function (customer) {

                    return customer.id === id;

                }
            );


        if (!customerExists) {

            showToast(
                "Customer record not found.",
                "error"
            );

            return;

        }


        customers =
            customers.filter(
                function (customer) {

                    return customer.id !== id;

                }
            );


        saveCustomersToLocalStorage();

        displayCustomers();


        if (editingCustomerId === id) {

            resetForm();

        }


        showToast(
            "Customer deleted successfully!"
        );

    }


    // ==========================================
    // RESET FORM
    // ==========================================

    function resetForm() {

        customerForm.reset();

        editingCustomerId = null;


        saveCustomerBtn.innerHTML = `

            <span aria-hidden="true">
                ▣
            </span>

            Save Customer

        `;

    }


    // ==========================================
    // EXTRA DESIGN
    // ==========================================

    const customerStyle =
        document.createElement("style");


    customerStyle.textContent = `

        /* DELETE BUTTON */

        .customer-table .customer-delete-button {

            margin-left: 6px;

            color: #c62828;

            border-color: #efb8b8;

            background-color: #fff5f5;

        }


        .customer-table .customer-delete-button:hover {

            background-color: #fdeaea;

        }


        /* TOAST */

        .customer-toast {

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


        .customer-toast.show {

            opacity: 1;

            transform: translateX(0);

        }


        .customer-toast .toast-icon {

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


        .customer-toast.error {

            border-left-color: #d32f2f;

            color: #8f1d1d;

        }


        .customer-toast.error .toast-icon {

            background-color: #fdeaea;

            color: #d32f2f;

        }

    `;


    document.head.appendChild(
        customerStyle
    );


    // ==========================================
    // INITIAL DISPLAY
    // ==========================================

    displayCustomers();

});