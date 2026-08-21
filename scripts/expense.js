document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       SMART RICE MILL ERP
       EXPENSE & SALARY MANAGEMENT
    ========================================= */


    /* =========================================
       ELEMENTS
    ========================================= */

    const expenseForm =
        document.getElementById(
            "expenseForm"
        );


    const salaryForm =
        document.getElementById(
            "salaryForm"
        );


    if (
        !expenseForm ||
        !salaryForm
    ) {

        return;

    }


    const expenseTypeSelect =
        document.getElementById(
            "expenseType"
        );


    const expenseAmountInput =
        document.getElementById(
            "expenseAmount"
        );


    const expenseDateInput =
        document.getElementById(
            "expenseDate"
        );


    const expenseDescriptionInput =
        document.getElementById(
            "expenseDescription"
        );


    const expensePaymentMethodSelect =
        document.getElementById(
            "expensePaymentMethod"
        );


    const expensePaymentStatusSelect =
        document.getElementById(
            "expensePaymentStatus"
        );


    const expenseFormTitle =
        document.getElementById(
            "expenseFormTitle"
        );


    const saveExpenseBtn =
        document.getElementById(
            "saveExpenseBtn"
        );


    const cancelExpenseEditBtn =
        document.getElementById(
            "cancelExpenseEditBtn"
        );


    const salaryEmployeeSelect =
        document.getElementById(
            "salaryEmployee"
        );


    const salaryRoleInput =
        document.getElementById(
            "salaryRole"
        );


    const salaryMonthInput =
        document.getElementById(
            "salaryMonth"
        );


    const salaryAmountInput =
        document.getElementById(
            "salaryAmount"
        );


    const salaryPaymentStatusSelect =
        document.getElementById(
            "salaryPaymentStatus"
        );


    const salaryPaidAmountInput =
        document.getElementById(
            "salaryPaidAmount"
        );


    const salaryFormTitle =
        document.getElementById(
            "salaryFormTitle"
        );


    const saveSalaryBtn =
        document.getElementById(
            "saveSalaryBtn"
        );


    const cancelSalaryEditBtn =
        document.getElementById(
            "cancelSalaryEditBtn"
        );


    const expenseTableBody =
        document.getElementById(
            "expenseTableBody"
        );


    const salaryTableBody =
        document.getElementById(
            "salaryTableBody"
        );


    const todayExpenseValue =
        document.getElementById(
            "todayExpenseValue"
        );


    const salaryDueValue =
        document.getElementById(
            "salaryDueValue"
        );


    const maintenanceCostValue =
        document.getElementById(
            "maintenanceCostValue"
        );


    const financeRecordsGrid =
        document.querySelector(
            ".finance-records-grid"
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

    let editingExpenseId =
        null;


    let editingSalaryId =
        null;


    let pendingExpenseDeleteId =
        null;


    let pendingSalaryDeleteId =
        null;


    /* =========================================
       STORAGE
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


            if (
                value === null
            ) {

                return fallback;

            }


            return (
                JSON.parse(
                    value
                ) ??
                fallback
            );

        }
        catch {

            return fallback;

        }

    }


    /* =========================================
       SAFE HTML
    ========================================= */

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
       DATE HELPERS
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


    function getCurrentMonth() {

        const today =
            new Date();


        return (

            `${today.getFullYear()}-${String(
                today.getMonth() + 1
            ).padStart(
                2,
                "0"
            )}`

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
                `${value}T00:00:00`
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


        const [
            year,
            month
        ] =
            value.split(
                "-"
            );


        const date =
            new Date(
                Number(year),
                Number(month) - 1,
                1
            );


        return date.toLocaleDateString(
            "en-US",
            {
                month:
                    "short",

                year:
                    "numeric"
            }
        );

    }


    /* =========================================
       MONEY
    ========================================= */

    function formatMoney(
        value
    ) {

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
       EMPLOYEES
    ========================================= */

    const DEFAULT_EMPLOYEES = [

        {
            id:
                "EMP-001",

            name:
                "Rahim",

            role:
                "Labour",

            baseSalary:
                45000
        },


        {
            id:
                "EMP-002",

            name:
                "Kamal",

            role:
                "Driver",

            baseSalary:
                18000
        }

    ];


    function loadEmployees() {

        const keys = [

            "employees",
            "employeeRecords",
            "staffRecords"

        ];


        for (
            const key of
            keys
        ) {

            const data =
                safeParseStorage(
                    key,
                    null
                );


            if (
                Array.isArray(data) &&
                data.length >
                0
            ) {

                return data.map(
                    function (
                        employee,
                        index
                    ) {

                        return {

                            id:

                                employee.id ||
                                employee.employeeId ||
                                `EMP-${String(
                                    index + 1
                                ).padStart(
                                    3,
                                    "0"
                                )}`,


                            name:

                                employee.name ||
                                employee.employeeName ||
                                `Employee ${index + 1}`,


                            role:

                                employee.role ||
                                employee.designation ||
                                "Employee",


                            baseSalary:

                                Number(
                                    employee.baseSalary ||
                                    employee.salary ||
                                    0
                                )

                        };

                    }
                );

            }

        }


        localStorage.setItem(
            "employees",
            JSON.stringify(
                DEFAULT_EMPLOYEES
            )
        );


        return [
            ...DEFAULT_EMPLOYEES
        ];

    }


    let employees =
        loadEmployees();


    /* =========================================
       LOAD EXPENSES
    ========================================= */

    function loadExpenseRecords() {

        let records =
            safeParseStorage(
                "expenseRecords",
                null
            );


        if (
            !Array.isArray(
                records
            )
        ) {

            records =
                safeParseStorage(
                    "expenses",
                    []
                );

        }


        if (
            !Array.isArray(
                records
            )
        ) {

            return [];

        }


        return records.map(
            function (
                record,
                index
            ) {

                const amount =
                    Number(
                        record.amount ||
                        record.totalAmount ||
                        0
                    );


                const status =

                    String(
                        record.paymentStatus ||
                        record.status ||
                        "paid"
                    )
                    .toLowerCase();


                return {

                    id:

                        record.id ??
                        Date.now() +
                        index,


                    expenseId:

                        record.expenseId ||
                        `EXP-${String(
                            index + 1
                        ).padStart(
                            3,
                            "0"
                        )}`,


                    expenseType:

                        record.expenseType ||
                        record.type ||
                        record.category ||
                        "Other",


                    amount:
                        amount,


                    expenseDate:

                        record.expenseDate ||
                        record.date ||
                        getTodayDate(),


                    date:

                        record.expenseDate ||
                        record.date ||
                        getTodayDate(),


                    description:

                        record.description ||
                        "",


                    paymentMethod:

                        record.paymentMethod ||
                        record.method ||
                        "Cash",


                    paymentStatus:
                        status,


                    status:
                        status,


                    paidAmount:

                        status === "paid"
                            ? amount
                            : 0,


                    dueAmount:

                        status === "due"
                            ? amount
                            : 0,


                    createdAt:

                        Number(
                            record.createdAt ||
                            record.id ||
                            Date.now()
                        )

                };

            }
        );

    }


    let expenseRecords =
        loadExpenseRecords();


    function saveExpenseRecords() {

        localStorage.setItem(
            "expenseRecords",
            JSON.stringify(
                expenseRecords
            )
        );

    }


    /* =========================================
       LOAD SALARY
    ========================================= */

    function loadSalaryRecords() {

        let records =
            safeParseStorage(
                "salaryRecords",
                null
            );


        if (
            !Array.isArray(
                records
            )
        ) {

            records =
                safeParseStorage(
                    "salaries",
                    []
                );

        }


        if (
            !Array.isArray(
                records
            )
        ) {

            return [];

        }


        return records.map(
            function (
                record,
                index
            ) {

                const salary =
                    Number(
                        record.salary ||
                        record.salaryAmount ||
                        record.amount ||
                        0
                    );


                const status =

                    String(
                        record.paymentStatus ||
                        record.status ||
                        "due"
                    )
                    .toLowerCase();


                let paidAmount =
                    Number(
                        record.paidAmount ||
                        0
                    );


                if (
                    status === "paid"
                ) {

                    paidAmount =
                        salary;

                }


                if (
                    status === "due"
                ) {

                    paidAmount =
                        0;

                }


                const dueAmount =
                    Math.max(
                        salary -
                        paidAmount,
                        0
                    );


                const month =

                    record.salaryMonth ||
                    record.month ||
                    getCurrentMonth();


                return {

                    id:

                        record.id ??
                        Date.now() +
                        index,


                    salaryId:

                        record.salaryId ||
                        `SAL-${String(
                            index + 1
                        ).padStart(
                            3,
                            "0"
                        )}`,


                    employeeId:

                        record.employeeId ||
                        "",


                    employeeName:

                        record.employeeName ||
                        record.employee ||
                        record.name ||
                        "Employee",


                    role:

                        record.role ||
                        record.designation ||
                        "Employee",


                    salaryMonth:
                        month,


                    month:
                        month,


                    salary:
                        salary,


                    salaryAmount:
                        salary,


                    amount:
                        salary,


                    paymentStatus:
                        status,


                    status:
                        status,


                    paidAmount:
                        paidAmount,


                    dueAmount:
                        dueAmount,


                    salaryDate:
                        `${month}-01`,


                    date:
                        `${month}-01`,


                    createdAt:

                        Number(
                            record.createdAt ||
                            record.id ||
                            Date.now()
                        )

                };

            }
        );

    }


    let salaryRecords =
        loadSalaryRecords();


    function saveSalaryRecords() {

        localStorage.setItem(
            "salaryRecords",
            JSON.stringify(
                salaryRecords
            )
        );

    }


    /* =========================================
       MAINTENANCE
    ========================================= */

    function getMaintenanceRecords() {

        let records =
            safeParseStorage(
                "maintenanceRecords",
                null
            );


        if (
            !Array.isArray(
                records
            )
        ) {

            records =
                safeParseStorage(
                    "maintenance",
                    []
                );

        }


        return Array.isArray(
            records
        )
            ? records
            : [];

    }


    function getMaintenanceCost(
        record
    ) {

        return Number(

            record.cost ??
            record.maintenanceCost ??
            record.totalCost ??
            record.amount ??
            0

        );

    }


    /* =========================================
       RECORD CODE GENERATOR
    ========================================= */

    function generateRecordCode(
        records,
        property,
        prefix
    ) {

        const numbers =
            records
                .map(
                    function (
                        record
                    ) {

                        const match =
                            String(
                                record[property] ||
                                ""
                            ).match(
                                new RegExp(
                                    `^${prefix}-(\\d+)$`,
                                    "i"
                                )
                            );


                        return (
                            match
                                ? Number(
                                    match[1]
                                )
                                : 0
                        );

                    }
                )
                .filter(Boolean);


        const nextNumber =

            numbers.length > 0

                ?

                Math.max(
                    ...numbers
                ) + 1

                :

                1;


        return (

            `${prefix}-${String(
                nextNumber
            ).padStart(
                3,
                "0"
            )}`

        );

    }


    /* =========================================
       EMPLOYEE DROPDOWN
    ========================================= */

    function populateEmployees() {

        salaryEmployeeSelect.innerHTML = `

            <option value=""
                    selected
                    disabled>

                Select employee

            </option>

        `;


        employees.forEach(
            function (
                employee
            ) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    employee.id;


                option.textContent =

                    `${employee.name} — ${employee.role}`;


                salaryEmployeeSelect.appendChild(
                    option
                );

            }
        );

    }


    salaryEmployeeSelect.addEventListener(
        "change",
        function () {

            const employee =
                employees.find(
                    function (
                        item
                    ) {

                        return (

                            String(
                                item.id
                            )

                            ===

                            String(
                                salaryEmployeeSelect.value
                            )

                        );

                    }
                );


            if (!employee) {

                salaryRoleInput.value =
                    "";

                return;

            }


            salaryRoleInput.value =
                employee.role;


            if (
                Number(
                    employee.baseSalary
                ) > 0
            ) {

                salaryAmountInput.value =
                    employee.baseSalary;

            }


            updateSalaryPaymentFields();

        }
    );


    /* =========================================
       SALARY STATUS LOGIC
    ========================================= */

    function updateSalaryPaymentFields() {

        const status =
            salaryPaymentStatusSelect.value;


        const salary =
            Number(
                salaryAmountInput.value ||
                0
            );


        if (
            status === "paid"
        ) {

            salaryPaidAmountInput.disabled =
                true;


            salaryPaidAmountInput.value =
                salary > 0
                    ? salary
                    : "";

        }
        else if (
            status === "due"
        ) {

            salaryPaidAmountInput.disabled =
                true;


            salaryPaidAmountInput.value =
                0;

        }
        else if (
            status === "partial"
        ) {

            salaryPaidAmountInput.disabled =
                false;


            if (
                Number(
                    salaryPaidAmountInput.value
                ) >= salary
            ) {

                salaryPaidAmountInput.value =
                    "";

            }

        }
        else {

            salaryPaidAmountInput.disabled =
                true;


            salaryPaidAmountInput.value =
                "";

        }

    }


    salaryPaymentStatusSelect.addEventListener(
        "change",
        updateSalaryPaymentFields
    );


    salaryAmountInput.addEventListener(
        "input",
        updateSalaryPaymentFields
    );


    /* =========================================
       SUMMARY
    ========================================= */

    function updateSummaryCards() {

        const today =
            getTodayDate();


        const todayExpense =
            expenseRecords

                .filter(
                    function (
                        record
                    ) {

                        return (
                            record.expenseDate ===
                            today
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
                            Number(
                                record.amount ||
                                0
                            )
                        );

                    },
                    0
                );


        const salaryDue =
            salaryRecords.reduce(
                function (
                    total,
                    record
                ) {

                    return (
                        total +
                        Number(
                            record.dueAmount ||
                            0
                        )
                    );

                },
                0
            );


        const maintenanceCost =
            getMaintenanceRecords()
                .reduce(
                    function (
                        total,
                        record
                    ) {

                        return (
                            total +
                            getMaintenanceCost(
                                record
                            )
                        );

                    },
                    0
                );


        todayExpenseValue.textContent =
            formatMoney(
                todayExpense
            );


        salaryDueValue.textContent =
            formatMoney(
                salaryDue
            );


        maintenanceCostValue.textContent =
            formatMoney(
                maintenanceCost
            );

    }


    /* =========================================
       EXPENSE VALIDATION
    ========================================= */

    function validateExpenseForm() {

        if (
            !expenseTypeSelect.value
        ) {

            return "Please select an expense type.";

        }


        const amount =
            Number(
                expenseAmountInput.value
            );


        if (
            !Number.isFinite(
                amount
            ) ||
            amount <= 0
        ) {

            return "Expense amount must be greater than zero.";

        }


        if (
            !expenseDateInput.value
        ) {

            return "Please select the expense date.";

        }


        if (
            expenseDescriptionInput.value
                .trim()
                .length < 3
        ) {

            return "Please enter a meaningful expense description.";

        }


        if (
            !expensePaymentMethodSelect.value
        ) {

            return "Please select a payment method.";

        }


        if (
            !expensePaymentStatusSelect.value
        ) {

            return "Please select a payment status.";

        }


        return "";

    }


    /* =========================================
       SAVE EXPENSE
    ========================================= */

    expenseForm.addEventListener(
        "submit",
        function (
            event
        ) {

            event.preventDefault();


            const error =
                validateExpenseForm();


            if (error) {

                showToast(
                    error,
                    "error"
                );

                return;

            }


            const amount =
                Number(
                    expenseAmountInput.value
                );


            const status =
                expensePaymentStatusSelect.value;


            const existingIndex =
                expenseRecords.findIndex(
                    function (
                        record
                    ) {

                        return (

                            Number(
                                record.id
                            )

                            ===

                            Number(
                                editingExpenseId
                            )

                        );

                    }
                );


            const existing =

                existingIndex >= 0

                    ?

                    expenseRecords[
                        existingIndex
                    ]

                    :

                    null;


            const record = {

                id:

                    existing
                        ? existing.id
                        : Date.now(),


                expenseId:

                    existing
                        ? existing.expenseId
                        : generateRecordCode(
                            expenseRecords,
                            "expenseId",
                            "EXP"
                        ),


                expenseType:
                    expenseTypeSelect.value,


                amount:
                    amount,


                expenseDate:
                    expenseDateInput.value,


                date:
                    expenseDateInput.value,


                description:

                    expenseDescriptionInput.value
                        .trim(),


                paymentMethod:
                    expensePaymentMethodSelect.value,


                paymentStatus:
                    status,


                status:
                    status,


                paidAmount:

                    status === "paid"
                        ? amount
                        : 0,


                dueAmount:

                    status === "due"
                        ? amount
                        : 0,


                createdAt:

                    existing
                        ? existing.createdAt
                        : Date.now()

            };


            if (existing) {

                expenseRecords[
                    existingIndex
                ] =
                    record;


                showToast(
                    `${record.expenseId} updated successfully.`
                );

            }
            else {

                expenseRecords.push(
                    record
                );


                showToast(
                    `${record.expenseId} saved successfully.`
                );

            }


            saveExpenseRecords();

            updateSummaryCards();

            displayExpenseRecords();

            resetExpenseForm();

        }
    );


    function resetExpenseForm() {

        editingExpenseId =
            null;


        expenseForm.reset();


        expenseDateInput.value =
            getTodayDate();


        expenseFormTitle.textContent =
            "Add Expense";


        saveExpenseBtn.innerHTML = `

            <span aria-hidden="true">
                ▣
            </span>

            Save Expense

        `;


        cancelExpenseEditBtn.hidden =
            true;

    }


    cancelExpenseEditBtn.addEventListener(
        "click",
        resetExpenseForm
    );


    function editExpense(
        id
    ) {

        const record =
            expenseRecords.find(
                function (
                    item
                ) {

                    return (
                        Number(item.id) ===
                        Number(id)
                    );

                }
            );


        if (!record) {

            return;

        }


        editingExpenseId =
            record.id;


        expenseTypeSelect.value =
            record.expenseType;


        expenseAmountInput.value =
            record.amount;


        expenseDateInput.value =
            record.expenseDate;


        expenseDescriptionInput.value =
            record.description;


        expensePaymentMethodSelect.value =
            record.paymentMethod;


        expensePaymentStatusSelect.value =
            record.paymentStatus;


        expenseFormTitle.textContent =

            `Edit Expense — ${record.expenseId}`;


        saveExpenseBtn.innerHTML = `

            <span aria-hidden="true">
                ✓
            </span>

            Update Expense

        `;


        cancelExpenseEditBtn.hidden =
            false;


        expenseForm.scrollIntoView(
            {
                behavior:
                    "smooth",

                block:
                    "center"
            }
        );

    }


    function expenseActionHTML(
        record
    ) {

        if (
            Number(
                pendingExpenseDeleteId
            ) ===
            Number(
                record.id
            )
        ) {

            return `

                <span class="delete-question">
                    Delete?
                </span>

                <button
                    class="finance-confirm-button"
                    type="button"
                    data-expense-action="confirm-delete"
                    data-id="${record.id}"
                >
                    Confirm
                </button>

                <button
                    class="finance-cancel-button"
                    type="button"
                    data-expense-action="cancel-delete"
                    data-id="${record.id}"
                >
                    Cancel
                </button>

            `;

        }


        return `

            <button
                class="finance-edit-button"
                type="button"
                data-expense-action="edit"
                data-id="${record.id}"
            >
                Edit
            </button>

            <button
                class="finance-delete-button"
                type="button"
                data-expense-action="delete"
                data-id="${record.id}"
            >
                Delete
            </button>

        `;

    }


    function displayExpenseRecords() {

        expenseTableBody.innerHTML =
            "";


        if (
            expenseRecords.length === 0
        ) {

            expenseTableBody.innerHTML = `

                <tr class="finance-empty-row">

                    <td colspan="6">
                        No expense records available.
                    </td>

                </tr>

            `;


            return;

        }


        [
            ...expenseRecords
        ]

            .sort(
                function (
                    a,
                    b
                ) {

                    if (
                        a.expenseDate !==
                        b.expenseDate
                    ) {

                        return (
                            b.expenseDate.localeCompare(
                                a.expenseDate
                            )
                        );

                    }


                    return (
                        Number(
                            b.createdAt
                        )
                        -
                        Number(
                            a.createdAt
                        )
                    );

                }
            )

            .forEach(
                function (
                    record
                ) {

                    const statusClass =

                        record.paymentStatus ===
                        "paid"

                            ?

                            "status-paid"

                            :

                            "status-due";


                    const statusText =

                        record.paymentStatus ===
                        "paid"

                            ?

                            "Paid"

                            :

                            "Due";


                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `

                        <td>

                            <span class="finance-primary-text">
                                ${escapeHTML(
                                    record.expenseType
                                )}
                            </span>

                            <span
                                class="finance-secondary-text"
                                title="${escapeHTML(
                                    record.description
                                )}"
                            >
                                ${escapeHTML(
                                    record.description
                                )}
                            </span>

                        </td>

                        <td>
                            ${formatMoney(
                                record.amount
                            )}
                        </td>

                        <td>
                            ${formatDate(
                                record.expenseDate
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                record.paymentMethod
                            )}
                        </td>

                        <td>

                            <span
                                class="
                                    finance-status
                                    ${statusClass}
                                "
                            >
                                ${statusText}
                            </span>

                        </td>

                        <td>

                            <div class="finance-table-actions">

                                ${expenseActionHTML(
                                    record
                                )}

                            </div>

                        </td>

                    `;


                    expenseTableBody.appendChild(
                        row
                    );

                }
            );

    }


    expenseTableBody.addEventListener(
        "click",
        function (
            event
        ) {

            const button =
                event.target.closest(
                    "button[data-expense-action]"
                );


            if (!button) {

                return;

            }


            const id =
                Number(
                    button.dataset.id
                );


            const action =
                button.dataset.expenseAction;


            if (
                action === "edit"
            ) {

                editExpense(
                    id
                );

                return;

            }


            if (
                action === "delete"
            ) {

                pendingExpenseDeleteId =
                    id;


                displayExpenseRecords();

                return;

            }


            if (
                action === "cancel-delete"
            ) {

                pendingExpenseDeleteId =
                    null;


                displayExpenseRecords();

                return;

            }


            if (
                action === "confirm-delete"
            ) {

                expenseRecords =
                    expenseRecords.filter(
                        function (
                            item
                        ) {

                            return (
                                Number(item.id)
                                !==
                                id
                            );

                        }
                    );


                pendingExpenseDeleteId =
                    null;


                saveExpenseRecords();

                updateSummaryCards();

                displayExpenseRecords();


                showToast(
                    "Expense deleted successfully."
                );

            }

        }
    );


    /* =========================================
       SALARY VALIDATION
    ========================================= */

    function validateSalaryForm() {

        if (
            !salaryEmployeeSelect.value
        ) {

            return "Please select an employee.";

        }


        if (
            !salaryMonthInput.value
        ) {

            return "Please select the salary month.";

        }


        const salary =
            Number(
                salaryAmountInput.value
            );


        if (
            !Number.isFinite(
                salary
            ) ||
            salary <= 0
        ) {

            return "Salary amount must be greater than zero.";

        }


        const status =
            salaryPaymentStatusSelect.value;


        if (!status) {

            return "Please select a payment status.";

        }


        if (
            status === "partial"
        ) {

            const paid =
                Number(
                    salaryPaidAmountInput.value
                );


            if (
                !Number.isFinite(
                    paid
                ) ||
                paid <= 0
            ) {

                return "Enter the amount already paid.";

            }


            if (
                paid >= salary
            ) {

                return "Paid amount must be less than salary amount for Partially Paid status.";

            }

        }


        return "";

    }


    /* =========================================
       SAVE SALARY
    ========================================= */

    salaryForm.addEventListener(
        "submit",
        function (
            event
        ) {

            event.preventDefault();


            const error =
                validateSalaryForm();


            if (error) {

                showToast(
                    error,
                    "error"
                );

                return;

            }


            const employee =
                employees.find(
                    function (
                        item
                    ) {

                        return (
                            String(item.id)
                            ===
                            String(
                                salaryEmployeeSelect.value
                            )
                        );

                    }
                );


            if (!employee) {

                showToast(
                    "Employee record could not be found.",
                    "error"
                );

                return;

            }


            const salary =
                Number(
                    salaryAmountInput.value
                );


            const status =
                salaryPaymentStatusSelect.value;


            let paidAmount =
                0;


            if (
                status === "paid"
            ) {

                paidAmount =
                    salary;

            }
            else if (
                status === "partial"
            ) {

                paidAmount =
                    Number(
                        salaryPaidAmountInput.value
                    );

            }


            const dueAmount =
                Math.max(
                    salary -
                    paidAmount,
                    0
                );


            const existingIndex =
                salaryRecords.findIndex(
                    function (
                        record
                    ) {

                        return (
                            Number(record.id)
                            ===
                            Number(
                                editingSalaryId
                            )
                        );

                    }
                );


            const existing =

                existingIndex >= 0

                    ?

                    salaryRecords[
                        existingIndex
                    ]

                    :

                    null;


            const record = {

                id:

                    existing
                        ? existing.id
                        : Date.now(),


                salaryId:

                    existing
                        ? existing.salaryId
                        : generateRecordCode(
                            salaryRecords,
                            "salaryId",
                            "SAL"
                        ),


                employeeId:
                    employee.id,


                employeeName:
                    employee.name,


                role:
                    employee.role,


                salaryMonth:
                    salaryMonthInput.value,


                month:
                    salaryMonthInput.value,


                salary:
                    salary,


                salaryAmount:
                    salary,


                amount:
                    salary,


                paymentStatus:
                    status,


                status:
                    status,


                paidAmount:
                    paidAmount,


                dueAmount:
                    dueAmount,


                salaryDate:
                    `${salaryMonthInput.value}-01`,


                date:
                    `${salaryMonthInput.value}-01`,


                createdAt:

                    existing
                        ? existing.createdAt
                        : Date.now()

            };


            if (
                existing
            ) {

                salaryRecords[
                    existingIndex
                ] =
                    record;


                showToast(
                    `${record.salaryId} updated successfully.`
                );

            }
            else {

                salaryRecords.push(
                    record
                );


                showToast(
                    `${record.salaryId} saved successfully.`
                );

            }


            saveSalaryRecords();

            updateSummaryCards();

            displaySalaryRecords();

            resetSalaryForm();

        }
    );


    function resetSalaryForm() {

        editingSalaryId =
            null;


        salaryForm.reset();


        salaryMonthInput.value =
            getCurrentMonth();


        salaryRoleInput.value =
            "";


        salaryPaidAmountInput.value =
            "";


        salaryPaidAmountInput.disabled =
            true;


        salaryFormTitle.textContent =
            "Add Salary";


        saveSalaryBtn.innerHTML = `

            <span aria-hidden="true">
                ▣
            </span>

            Save Salary

        `;


        cancelSalaryEditBtn.hidden =
            true;

    }


    cancelSalaryEditBtn.addEventListener(
        "click",
        resetSalaryForm
    );


    function editSalary(
        id
    ) {

        const record =
            salaryRecords.find(
                function (
                    item
                ) {

                    return (
                        Number(item.id)
                        ===
                        Number(id)
                    );

                }
            );


        if (!record) {

            return;

        }


        editingSalaryId =
            record.id;


        salaryEmployeeSelect.value =
            record.employeeId;


        salaryRoleInput.value =
            record.role;


        salaryMonthInput.value =
            record.salaryMonth;


        salaryAmountInput.value =
            record.salary;


        salaryPaymentStatusSelect.value =
            record.paymentStatus;


        updateSalaryPaymentFields();


        if (
            record.paymentStatus ===
            "partial"
        ) {

            salaryPaidAmountInput.value =
                record.paidAmount;

        }


        salaryFormTitle.textContent =

            `Edit Salary — ${record.salaryId}`;


        saveSalaryBtn.innerHTML = `

            <span aria-hidden="true">
                ✓
            </span>

            Update Salary

        `;


        cancelSalaryEditBtn.hidden =
            false;


        salaryForm.scrollIntoView(
            {
                behavior:
                    "smooth",

                block:
                    "center"
            }
        );

    }


    function salaryActionHTML(
        record
    ) {

        if (
            Number(
                pendingSalaryDeleteId
            )
            ===
            Number(
                record.id
            )
        ) {

            return `

                <span class="delete-question">
                    Delete?
                </span>

                <button
                    class="finance-confirm-button"
                    type="button"
                    data-salary-action="confirm-delete"
                    data-id="${record.id}"
                >
                    Confirm
                </button>

                <button
                    class="finance-cancel-button"
                    type="button"
                    data-salary-action="cancel-delete"
                    data-id="${record.id}"
                >
                    Cancel
                </button>

            `;

        }


        return `

            <button
                class="finance-edit-button"
                type="button"
                data-salary-action="edit"
                data-id="${record.id}"
            >
                Edit
            </button>

            <button
                class="finance-delete-button"
                type="button"
                data-salary-action="delete"
                data-id="${record.id}"
            >
                Delete
            </button>

        `;

    }


    function displaySalaryRecords() {

        salaryTableBody.innerHTML =
            "";


        if (
            salaryRecords.length === 0
        ) {

            salaryTableBody.innerHTML = `

                <tr class="finance-empty-row">

                    <td colspan="7">
                        No salary records available.
                    </td>

                </tr>

            `;


            return;

        }


        [
            ...salaryRecords
        ]

            .sort(
                function (
                    a,
                    b
                ) {

                    if (
                        a.salaryMonth !==
                        b.salaryMonth
                    ) {

                        return (
                            b.salaryMonth.localeCompare(
                                a.salaryMonth
                            )
                        );

                    }


                    return (
                        Number(
                            b.createdAt
                        )
                        -
                        Number(
                            a.createdAt
                        )
                    );

                }
            )

            .forEach(
                function (
                    record
                ) {

                    let statusClass =
                        "status-due";


                    let statusText =
                        "Due";


                    if (
                        record.paymentStatus ===
                        "paid"
                    ) {

                        statusClass =
                            "status-paid";


                        statusText =
                            "Paid";

                    }
                    else if (
                        record.paymentStatus ===
                        "partial"
                    ) {

                        statusClass =
                            "status-partial";


                        statusText =
                            "Partial";

                    }


                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `

                        <td>

                            <span class="finance-primary-text">

                                ${escapeHTML(
                                    record.employeeName
                                )}

                            </span>

                            <span class="finance-secondary-text">

                                ${escapeHTML(
                                    record.role
                                )}

                            </span>

                        </td>

                        <td>
                            ${formatMonth(
                                record.salaryMonth
                            )}
                        </td>

                        <td>
                            ${formatMoney(
                                record.salary
                            )}
                        </td>

                        <td>
                            ${formatMoney(
                                record.paidAmount
                            )}
                        </td>

                        <td>
                            ${formatMoney(
                                record.dueAmount
                            )}
                        </td>

                        <td>

                            <span
                                class="
                                    finance-status
                                    ${statusClass}
                                "
                            >
                                ${statusText}
                            </span>

                        </td>

                        <td>

                            <div class="finance-table-actions">

                                ${salaryActionHTML(
                                    record
                                )}

                            </div>

                        </td>

                    `;


                    salaryTableBody.appendChild(
                        row
                    );

                }
            );

    }


    salaryTableBody.addEventListener(
        "click",
        function (
            event
        ) {

            const button =
                event.target.closest(
                    "button[data-salary-action]"
                );


            if (!button) {

                return;

            }


            const id =
                Number(
                    button.dataset.id
                );


            const action =
                button.dataset.salaryAction;


            if (
                action === "edit"
            ) {

                editSalary(
                    id
                );

                return;

            }


            if (
                action === "delete"
            ) {

                pendingSalaryDeleteId =
                    id;


                displaySalaryRecords();

                return;

            }


            if (
                action === "cancel-delete"
            ) {

                pendingSalaryDeleteId =
                    null;


                displaySalaryRecords();

                return;

            }


            if (
                action === "confirm-delete"
            ) {

                salaryRecords =
                    salaryRecords.filter(
                        function (
                            item
                        ) {

                            return (
                                Number(item.id)
                                !==
                                id
                            );

                        }
                    );


                pendingSalaryDeleteId =
                    null;


                saveSalaryRecords();

                updateSummaryCards();

                displaySalaryRecords();


                showToast(
                    "Salary record deleted successfully."
                );

            }

        }
    );


    /* =========================================
       MINIMIZE / MAXIMIZE
       UPDATED BEHAVIOR

       Maximize now stays completely inside
       .finance-records-grid.

       It never moves over the forms above.
    ========================================= */

    function restoreAllRecordCards() {

        document
            .querySelectorAll(
                ".finance-record-card"
            )
            .forEach(
                function (
                    card
                ) {

                    card.classList.remove(
                        "is-maximized"
                    );

                }
            );


        if (
            financeRecordsGrid
        ) {

            financeRecordsGrid.classList.remove(
                "has-maximized-card"
            );

        }


        document
            .querySelectorAll(
                '[data-card-action="maximize"]'
            )
            .forEach(
                function (
                    button
                ) {

                    button.textContent =
                        "⛶";


                    button.title =
                        "Maximize";

                }
            );

    }


    document.addEventListener(
        "click",
        function (
            event
        ) {

            const button =
                event.target.closest(
                    ".record-window-button"
                );


            if (!button) {

                return;

            }


            const targetId =
                button.dataset.cardTarget;


            const action =
                button.dataset.cardAction;


            const card =
                document.getElementById(
                    targetId
                );


            if (!card) {

                return;

            }


            /* =================================
               MINIMIZE
            ================================== */

            if (
                action === "minimize"
            ) {

                /*
                   If currently maximized,
                   return it to normal records
                   grid first.
                */

                if (
                    card.classList.contains(
                        "is-maximized"
                    )
                ) {

                    restoreAllRecordCards();

                }


                card.classList.toggle(
                    "is-minimized"
                );


                button.title =

                    card.classList.contains(
                        "is-minimized"
                    )

                        ?

                        "Restore"

                        :

                        "Minimize";


                return;

            }


            /* =================================
               MAXIMIZE
            ================================== */

            if (
                action === "maximize"
            ) {

                const alreadyMaximized =
                    card.classList.contains(
                        "is-maximized"
                    );


                /*
                   Clicking maximize again =
                   restore normal 50/50 view.
                */

                if (
                    alreadyMaximized
                ) {

                    restoreAllRecordCards();

                    return;

                }


                /*
                   Restore other cards first.
                */

                restoreAllRecordCards();


                /*
                   A maximized card must not
                   remain minimized.
                */

                card.classList.remove(
                    "is-minimized"
                );


                const minimizeButton =
                    card.querySelector(
                        '[data-card-action="minimize"]'
                    );


                if (
                    minimizeButton
                ) {

                    minimizeButton.title =
                        "Minimize";

                }


                /*
                   Expand across BOTH lower
                   records columns.
                */

                card.classList.add(
                    "is-maximized"
                );


                if (
                    financeRecordsGrid
                ) {

                    financeRecordsGrid.classList.add(
                        "has-maximized-card"
                    );

                }


                button.textContent =
                    "↙";


                button.title =
                    "Restore";

            }

        }
    );


    /* =========================================
       ESCAPE = RESTORE MAXIMIZED TABLE
    ========================================= */

    document.addEventListener(
        "keydown",
        function (
            event
        ) {

            if (
                event.key !== "Escape"
            ) {

                return;

            }


            const maximizedCard =
                document.querySelector(
                    ".finance-record-card.is-maximized"
                );


            if (
                maximizedCard
            ) {

                restoreAllRecordCards();

                return;

            }


            if (
                pendingExpenseDeleteId !==
                null
            ) {

                pendingExpenseDeleteId =
                    null;


                displayExpenseRecords();

                return;

            }


            if (
                pendingSalaryDeleteId !==
                null
            ) {

                pendingSalaryDeleteId =
                    null;


                displaySalaryRecords();

                return;

            }


            closeSidebar();

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
                ".finance-toast"
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
            `finance-toast ${type}`;


        toast.innerHTML = `

            <span class="finance-toast-icon">

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
    ========================================= */

    expenseDateInput.value =
        getTodayDate();


    salaryMonthInput.value =
        getCurrentMonth();


    populateEmployees();


    saveExpenseRecords();

    saveSalaryRecords();


    updateSummaryCards();


    displayExpenseRecords();

    displaySalaryRecords();

});