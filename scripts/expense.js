document.addEventListener(
    "DOMContentLoaded",
    function () {

        // ==========================================
        // EXPENSE FORM ELEMENTS
        // ==========================================

        const expenseForm =
            document.getElementById(
                "expenseForm"
            );

        const expenseFormTitle =
            document.getElementById(
                "expenseFormTitle"
            );

        const expenseType =
            document.getElementById(
                "expense-type"
            );

        const expenseAmount =
            document.getElementById(
                "expense-amount"
            );

        const expenseDate =
            document.getElementById(
                "expense-date"
            );

        const expenseDescription =
            document.getElementById(
                "expense-description"
            );

        const paymentMethod =
            document.getElementById(
                "payment-method"
            );

        const expenseStatus =
            document.getElementById(
                "expense-status"
            );

        const saveExpenseButton =
            document.getElementById(
                "saveExpenseButton"
            );


        // ==========================================
        // SALARY FORM ELEMENTS
        // ==========================================

        const salaryForm =
            document.getElementById(
                "salaryForm"
            );

        const salaryFormTitle =
            document.getElementById(
                "salaryFormTitle"
            );

        const employeeSelect =
            document.getElementById(
                "employee-name"
            );

        const employeeRole =
            document.getElementById(
                "employee-role"
            );

        const salaryMonth =
            document.getElementById(
                "salary-month"
            );

        const salaryAmount =
            document.getElementById(
                "salary-amount"
            );

        const salaryStatus =
            document.getElementById(
                "salary-status"
            );

        const salaryPaidAmount =
            document.getElementById(
                "salary-paid-amount"
            );

        const saveSalaryButton =
            document.getElementById(
                "saveSalaryButton"
            );


        // ==========================================
        // TABLE ELEMENTS
        // ==========================================

        const expenseTableBody =
            document.getElementById(
                "expenseTableBody"
            );

        const salaryTableBody =
            document.getElementById(
                "salaryTableBody"
            );


        // ==========================================
        // SUMMARY ELEMENTS
        // ==========================================

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


        // ==========================================
        // TOPBAR
        // ==========================================

        const expenseTopbarUserName =
            document.getElementById(
                "expenseTopbarUserName"
            );


        // ==========================================
        // RECORD WINDOW ELEMENT
        // ==========================================

        const recordsGrid =
            document.getElementById(
                "recordsGrid"
            );


        // ==========================================
        // EDIT STATE
        // ==========================================

        let editingExpenseId =
            null;

        let editingSalaryId =
            null;


        // ==========================================
        // ID COMPARISON
        // ==========================================

        function sameId(
            first,
            second
        ) {

            return (
                String(first) ===
                String(second)
            );

        }


        // ==========================================
        // DATE HELPERS
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


        function getCurrentMonth() {

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


            return (
                year +
                "-" +
                month
            );

        }


        function formatDate(
            dateString
        ) {

            if (!dateString) {

                return "—";

            }


            const date =
                new Date(
                    dateString +
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


        function formatMonth(
            monthString
        ) {

            if (!monthString) {

                return "—";

            }


            const parts =
                monthString.split(
                    "-"
                );


            if (
                parts.length !== 2
            ) {

                return monthString;

            }


            const date =
                new Date(
                    Number(parts[0]),
                    Number(parts[1]) - 1,
                    1
                );


            return date.toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    year: "numeric"
                }
            );

        }


        // ==========================================
        // MONEY FORMAT
        // ==========================================

        function formatMoney(
            amount
        ) {

            const number =
                Number(amount) || 0;


            return (
                "৳" +
                number.toLocaleString(
                    "en-BD",
                    {
                        maximumFractionDigits: 2
                    }
                )
            );

        }


        // ==========================================
        // SAFE HTML
        // ==========================================

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


        // ==========================================
        // TOAST
        // ==========================================

        function showToast(
            message,
            type = "success"
        ) {

            const previousToast =
                document.querySelector(
                    ".finance-toast"
                );


            if (previousToast) {

                previousToast.remove();

            }


            const toast =
                document.createElement(
                    "div"
                );


            toast.className =
                "finance-toast " +
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
        // DEFAULT EMPLOYEES
        // ==========================================

        const defaultEmployees = [

            {
                id: 1001,
                name: "Kamal",
                role: "driver",
                phone: "01700000001",
                status: "active"
            },

            {
                id: 1002,
                name: "Rahim",
                role: "labour",
                phone: "01700000002",
                status: "active"
            },

            {
                id: 1003,
                name: "Karim",
                role: "operator",
                phone: "01700000003",
                status: "active"
            },

            {
                id: 1004,
                name: "Hasan",
                role: "manager",
                phone: "01700000004",
                status: "active"
            },

            {
                id: 1005,
                name: "Salma",
                role: "accountant",
                phone: "01700000005",
                status: "active"
            }

        ];


        // ==========================================
        // DEFAULT EXPENSES
        // ==========================================

        const defaultExpenses = [

            {
                id: 1,
                type: "electricity",
                amount: 12000,
                date: "2026-07-01",
                description:
                    "Monthly electricity bill",
                paymentMethod: "cash",
                status: "paid"
            },

            {
                id: 2,
                type: "truck-rent",
                amount: 8000,
                date: "2026-07-01",
                description:
                    "Truck rent for rice delivery",
                paymentMethod: "cash",
                status: "paid"
            },

            {
                id: 3,
                type: "labour-cost",
                amount: 5000,
                date: "2026-07-01",
                description:
                    "Temporary labour payment",
                paymentMethod: "cash",
                status: "due"
            }

        ];


        // ==========================================
        // DEFAULT SALARIES
        // ==========================================

        const defaultSalaries = [

            {
                id: 1,
                employeeId: 1002,
                employeeName: "Rahim",
                role: "labour",
                month: "2026-07",
                amount: 45000,
                status: "due",
                paidAmount: 0,
                dueAmount: 45000
            },

            {
                id: 2,
                employeeId: 1001,
                employeeName: "Kamal",
                role: "driver",
                month: "2026-07",
                amount: 18000,
                status: "paid",
                paidAmount: 18000,
                dueAmount: 0
            }

        ];


        // ==========================================
        // LOAD EMPLOYEES
        // ==========================================

        function loadEmployees() {

            const stored =
                localStorage.getItem(
                    "employees"
                );


            if (stored === null) {

                const initialEmployees =
                    defaultEmployees.map(
                        function (employee) {

                            return {
                                ...employee
                            };

                        }
                    );


                localStorage.setItem(
                    "employees",
                    JSON.stringify(
                        initialEmployees
                    )
                );


                return initialEmployees;

            }


            try {

                const parsed =
                    JSON.parse(stored);


                if (
                    Array.isArray(parsed)
                ) {

                    return parsed;

                }

            } catch (error) {

                console.error(
                    "Employee data could not be parsed:",
                    error
                );

            }


            return [];

        }


        // ==========================================
        // LOAD EXPENSES
        // ==========================================

        function loadExpenses() {

            const stored =
                localStorage.getItem(
                    "expenses"
                );


            if (stored === null) {

                const initialExpenses =
                    defaultExpenses.map(
                        function (expense) {

                            return {
                                ...expense
                            };

                        }
                    );


                localStorage.setItem(
                    "expenses",
                    JSON.stringify(
                        initialExpenses
                    )
                );


                return initialExpenses;

            }


            try {

                const parsed =
                    JSON.parse(stored);


                if (
                    Array.isArray(parsed)
                ) {

                    return parsed;

                }

            } catch (error) {

                console.error(
                    "Expense data could not be parsed:",
                    error
                );

            }


            return [];

        }


        // ==========================================
        // LOAD SALARIES
        // ==========================================

        function loadSalaries() {

            const stored =
                localStorage.getItem(
                    "salaries"
                );


            if (stored === null) {

                const initialSalaries =
                    defaultSalaries.map(
                        function (salary) {

                            return {
                                ...salary
                            };

                        }
                    );


                localStorage.setItem(
                    "salaries",
                    JSON.stringify(
                        initialSalaries
                    )
                );


                return initialSalaries;

            }


            try {

                const parsed =
                    JSON.parse(stored);


                if (
                    Array.isArray(parsed)
                ) {

                    return parsed;

                }

            } catch (error) {

                console.error(
                    "Salary data could not be parsed:",
                    error
                );

            }


            return [];

        }


        // ==========================================
        // DATA STATE
        // ==========================================

        let employees =
            loadEmployees();


        let expenses =
            loadExpenses();


        let salaries =
            loadSalaries();


        // ==========================================
        // SAVE STORAGE
        // ==========================================

        function saveEmployees() {

            localStorage.setItem(
                "employees",
                JSON.stringify(
                    employees
                )
            );

        }


        function saveExpenses() {

            localStorage.setItem(
                "expenses",
                JSON.stringify(
                    expenses
                )
            );

        }


        function saveSalaries() {

            localStorage.setItem(
                "salaries",
                JSON.stringify(
                    salaries
                )
            );

        }


        // ==========================================
        // MIGRATE EXPENSE DATA
        // ==========================================

        expenses =
            expenses.map(
                function (
                    expense,
                    index
                ) {

                    if (
                        expense.id === undefined ||
                        expense.id === null
                    ) {

                        expense.id =
                            Date.now() +
                            index;

                    }


                    expense.amount =
                        Number(
                            expense.amount
                        ) || 0;


                    return expense;

                }
            );


        // ==========================================
        // MIGRATE SALARY DATA
        // ==========================================

        salaries =
            salaries.map(
                function (
                    salary,
                    index
                ) {

                    if (
                        salary.id === undefined ||
                        salary.id === null
                    ) {

                        salary.id =
                            Date.now() +
                            index;

                    }


                    salary.amount =
                        Number(
                            salary.amount
                        ) || 0;


                    let employee =
                        employees.find(
                            function (
                                employee
                            ) {

                                return sameId(
                                    employee.id,
                                    salary.employeeId
                                );

                            }
                        );


                    // ==================================
                    // Legacy Employee Name Match
                    // ==================================

                    if (
                        !employee &&
                        salary.employeeName
                    ) {

                        employee =
                            employees.find(
                                function (
                                    employee
                                ) {

                                    return (
                                        employee.name
                                            .trim()
                                            .toLowerCase() ===

                                        String(
                                            salary.employeeName
                                        )
                                            .trim()
                                            .toLowerCase()
                                    );

                                }
                            );

                    }


                    // ==================================
                    // Create Legacy Employee
                    // ==================================

                    if (
                        !employee &&
                        salary.employeeName
                    ) {

                        employee = {

                            id:
                                Date.now() +
                                5000 +
                                index,

                            name:
                                salary.employeeName,

                            role:
                                salary.role ||
                                "labour",

                            phone:
                                "",

                            status:
                                "active"

                        };


                        employees.push(
                            employee
                        );

                    }


                    if (employee) {

                        salary.employeeId =
                            employee.id;


                        salary.employeeName =
                            employee.name;


                        salary.role =
                            employee.role;

                    }


                    // ==================================
                    // Salary Calculation
                    // ==================================

                    if (
                        salary.status ===
                        "paid"
                    ) {

                        salary.paidAmount =
                            salary.amount;


                        salary.dueAmount =
                            0;

                    } else if (
                        salary.status ===
                        "due"
                    ) {

                        salary.paidAmount =
                            0;


                        salary.dueAmount =
                            salary.amount;

                    } else if (
                        salary.status ===
                        "partial"
                    ) {

                        salary.paidAmount =
                            Number(
                                salary.paidAmount
                            ) || 0;


                        salary.dueAmount =
                            Math.max(
                                0,
                                salary.amount -
                                salary.paidAmount
                            );

                    } else {

                        salary.status =
                            "due";


                        salary.paidAmount =
                            0;


                        salary.dueAmount =
                            salary.amount;

                    }


                    return salary;

                }
            );


        saveEmployees();

        saveExpenses();

        saveSalaries();


        // ==========================================
        // ROLE TEXT
        // ==========================================

        function getRoleText(
            role
        ) {

            const labels = {

                labour:
                    "Labour",

                driver:
                    "Driver",

                operator:
                    "Machine Operator",

                manager:
                    "Manager",

                accountant:
                    "Accountant",

                technician:
                    "Technician"

            };


            return (
                labels[role] ||
                role ||
                "—"
            );

        }


        // ==========================================
        // EXPENSE TYPE TEXT
        // ==========================================

        function getExpenseTypeText(
            type
        ) {

            const labels = {

                electricity:
                    "Electricity Bill",

                "truck-rent":
                    "Truck Rent",

                "labour-cost":
                    "Labour Cost",

                maintenance:
                    "Maintenance",

                fuel:
                    "Fuel Cost",

                office:
                    "Office Expense",

                other:
                    "Other Expense"

            };


            return (
                labels[type] ||
                type ||
                "—"
            );

        }


        // ==========================================
        // PAYMENT METHOD TEXT
        // ==========================================

        function getPaymentMethodText(
            method
        ) {

            const labels = {

                cash:
                    "Cash",

                bank:
                    "Bank Transfer",

                "mobile-banking":
                    "Mobile Banking",

                cheque:
                    "Cheque"

            };


            return (
                labels[method] ||
                method ||
                "—"
            );

        }


        // ==========================================
        // STATUS TEXT
        // ==========================================

        function getStatusText(
            status
        ) {

            if (
                status ===
                "paid"
            ) {

                return "Paid";

            }


            if (
                status ===
                "due"
            ) {

                return "Due";

            }


            if (
                status ===
                "partial"
            ) {

                return "Partial";

            }


            return "—";

        }


        // ==========================================
        // STATUS CLASS
        // ==========================================

        function getStatusClass(
            status
        ) {

            if (
                status ===
                "paid"
            ) {

                return "finance-status-paid";

            }


            if (
                status ===
                "due"
            ) {

                return "finance-status-due";

            }


            if (
                status ===
                "partial"
            ) {

                return "finance-status-partial";

            }


            return "";

        }


        // ==========================================
        // EMPLOYEE DROPDOWN
        // ==========================================

        function populateEmployeeDropdown(
            selectedEmployeeId = ""
        ) {

            employeeSelect.innerHTML = `

                <option
                    value=""
                    disabled
                    ${
                        selectedEmployeeId
                            ? ""
                            : "selected"
                    }
                >
                    Select employee
                </option>

            `;


            const activeEmployees =
                employees
                    .filter(
                        function (
                            employee
                        ) {

                            return (
                                employee.status !==
                                "inactive"
                            );

                        }
                    )
                    .sort(
                        function (
                            first,
                            second
                        ) {

                            return String(
                                first.name
                            ).localeCompare(
                                String(
                                    second.name
                                )
                            );

                        }
                    );


            activeEmployees.forEach(
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
                        employee.name +
                        " — " +
                        getRoleText(
                            employee.role
                        );


                    if (
                        sameId(
                            employee.id,
                            selectedEmployeeId
                        )
                    ) {

                        option.selected =
                            true;

                    }


                    employeeSelect
                        .appendChild(
                            option
                        );

                }
            );

        }


        // ==========================================
        // EMPLOYEE CHANGE
        // ==========================================

        employeeSelect.addEventListener(
            "change",
            function () {

                const employee =
                    employees.find(
                        function (
                            employee
                        ) {

                            return sameId(
                                employee.id,
                                employeeSelect.value
                            );

                        }
                    );


                if (!employee) {

                    employeeRole.value =
                        "";

                    return;

                }


                employeeRole.value =
                    getRoleText(
                        employee.role
                    );

            }
        );


        // ==========================================
        // SUMMARY
        // ==========================================

        function updateSummary() {

            const today =
                getTodayDate();


            const todayExpense =
                expenses
                    .filter(
                        function (
                            expense
                        ) {

                            return (
                                expense.date ===
                                today
                            );

                        }
                    )
                    .reduce(
                        function (
                            total,
                            expense
                        ) {

                            return (
                                total +
                                Number(
                                    expense.amount
                                )
                            );

                        },
                        0
                    );


            const salaryDue =
                salaries.reduce(
                    function (
                        total,
                        salary
                    ) {

                        return (
                            total +
                            Number(
                                salary.dueAmount ||
                                0
                            )
                        );

                    },
                    0
                );


            const maintenanceCost =
                expenses
                    .filter(
                        function (
                            expense
                        ) {

                            return (
                                expense.type ===
                                "maintenance"
                            );

                        }
                    )
                    .reduce(
                        function (
                            total,
                            expense
                        ) {

                            return (
                                total +
                                Number(
                                    expense.amount
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


        // ==========================================
        // DISPLAY EXPENSES
        // ==========================================

        function displayExpenses() {

            expenseTableBody.innerHTML =
                "";


            if (
                expenses.length ===
                0
            ) {

                expenseTableBody.innerHTML = `

                    <tr class="finance-empty-row">

                        <td colspan="6">
                            No expense records found.
                        </td>

                    </tr>

                `;


                updateSummary();

                return;

            }


            const sortedExpenses =
                [
                    ...expenses
                ].sort(
                    function (
                        first,
                        second
                    ) {

                        return (
                            new Date(
                                second.date
                            ) -
                            new Date(
                                first.date
                            )
                        );

                    }
                );


            sortedExpenses.forEach(
                function (
                    expense
                ) {

                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `

                        <td>

                            <span class="record-primary-text">

                                ${escapeHTML(
                                    getExpenseTypeText(
                                        expense.type
                                    )
                                )}

                            </span>

                            <span class="record-secondary-text">

                                ${escapeHTML(
                                    expense.description ||
                                    "No description"
                                )}

                            </span>

                        </td>


                        <td>

                            ${formatMoney(
                                expense.amount
                            )}

                        </td>


                        <td>

                            ${escapeHTML(
                                formatDate(
                                    expense.date
                                )
                            )}

                        </td>


                        <td>

                            ${escapeHTML(
                                getPaymentMethodText(
                                    expense.paymentMethod
                                )
                            )}

                        </td>


                        <td>

                            <span
                                class="
                                    finance-status-badge
                                    ${getStatusClass(
                                        expense.status
                                    )}
                                "
                            >

                                ${escapeHTML(
                                    getStatusText(
                                        expense.status
                                    )
                                )}

                            </span>

                        </td>


                        <td>

                            <div class="finance-action-group">

                                <button
                                    class="finance-edit-button"
                                    type="button"
                                    data-expense-action="edit"
                                    data-id="${expense.id}"
                                >
                                    Edit
                                </button>


                                <button
                                    class="finance-delete-button"
                                    type="button"
                                    data-expense-action="delete"
                                    data-id="${expense.id}"
                                >
                                    Delete
                                </button>

                            </div>

                        </td>

                    `;


                    expenseTableBody
                        .appendChild(
                            row
                        );

                }
            );


            updateSummary();

        }


        // ==========================================
        // DISPLAY SALARIES
        // ==========================================

        function displaySalaries() {

            salaryTableBody.innerHTML =
                "";


            if (
                salaries.length ===
                0
            ) {

                salaryTableBody.innerHTML = `

                    <tr class="finance-empty-row">

                        <td colspan="6">
                            No salary records found.
                        </td>

                    </tr>

                `;


                updateSummary();

                return;

            }


            const sortedSalaries =
                [
                    ...salaries
                ].sort(
                    function (
                        first,
                        second
                    ) {

                        return String(
                            second.month ||
                            ""
                        ).localeCompare(
                            String(
                                first.month ||
                                ""
                            )
                        );

                    }
                );


            sortedSalaries.forEach(
                function (
                    salary
                ) {

                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `

                        <td>

                            <span class="record-primary-text">

                                ${escapeHTML(
                                    salary.employeeName
                                )}

                            </span>

                            <span class="record-secondary-text">

                                ${escapeHTML(
                                    getRoleText(
                                        salary.role
                                    )
                                )}

                            </span>

                        </td>


                        <td>

                            ${escapeHTML(
                                formatMonth(
                                    salary.month
                                )
                            )}

                        </td>


                        <td>

                            ${formatMoney(
                                salary.amount
                            )}

                        </td>


                        <td>

                            ${formatMoney(
                                salary.dueAmount
                            )}

                        </td>


                        <td>

                            <span
                                class="
                                    finance-status-badge
                                    ${getStatusClass(
                                        salary.status
                                    )}
                                "
                            >

                                ${escapeHTML(
                                    getStatusText(
                                        salary.status
                                    )
                                )}

                            </span>

                        </td>


                        <td>

                            <div class="finance-action-group">

                                <button
                                    class="finance-edit-button"
                                    type="button"
                                    data-salary-action="edit"
                                    data-id="${salary.id}"
                                >
                                    Edit
                                </button>


                                <button
                                    class="finance-delete-button"
                                    type="button"
                                    data-salary-action="delete"
                                    data-id="${salary.id}"
                                >
                                    Delete
                                </button>

                            </div>

                        </td>

                    `;


                    salaryTableBody
                        .appendChild(
                            row
                        );

                }
            );


            updateSummary();

        }


        // ==========================================
        // EXPENSE SUBMIT
        // ==========================================

        expenseForm.addEventListener(
            "submit",
            function (
                event
            ) {

                event.preventDefault();


                const amount =
                    Number(
                        expenseAmount.value
                    );


                if (
                    !Number.isFinite(
                        amount
                    ) ||
                    amount <= 0
                ) {

                    showToast(
                        "Expense amount must be greater than zero.",
                        "error"
                    );

                    return;

                }


                if (
                    !expenseDescription
                        .value
                        .trim()
                ) {

                    showToast(
                        "Please enter an expense description.",
                        "error"
                    );

                    return;

                }


                const expenseData = {

                    type:
                        expenseType.value,

                    amount:
                        amount,

                    date:
                        expenseDate.value,

                    description:
                        expenseDescription
                            .value
                            .trim(),

                    paymentMethod:
                        paymentMethod.value,

                    status:
                        expenseStatus.value

                };


                // ==================================
                // UPDATE EXPENSE
                // ==================================

                if (
                    editingExpenseId !==
                    null
                ) {

                    const index =
                        expenses.findIndex(
                            function (
                                expense
                            ) {

                                return sameId(
                                    expense.id,
                                    editingExpenseId
                                );

                            }
                        );


                    if (
                        index !== -1
                    ) {

                        expenses[index] = {

                            id:
                                expenses[index].id,

                            ...expenseData

                        };

                    }


                    saveExpenses();

                    displayExpenses();

                    resetExpenseForm();


                    showToast(
                        "Expense updated successfully!"
                    );


                    return;

                }


                // ==================================
                // NEW EXPENSE
                // ==================================

                expenses.push(
                    {

                        id:
                            Date.now(),

                        ...expenseData

                    }
                );


                saveExpenses();

                displayExpenses();

                resetExpenseForm();


                showToast(
                    "Expense saved successfully!"
                );

            }
        );


        // ==========================================
        // SALARY STATUS CONTROL
        // ==========================================

        function updateSalaryPaidAmountField() {

            const amount =
                Number(
                    salaryAmount.value
                ) || 0;


            // Paid
            if (
                salaryStatus.value ===
                "paid"
            ) {

                salaryPaidAmount.value =
                    amount > 0
                        ? amount
                        : "";


                salaryPaidAmount.disabled =
                    true;


                return;

            }


            // Due
            if (
                salaryStatus.value ===
                "due"
            ) {

                salaryPaidAmount.value =
                    0;


                salaryPaidAmount.disabled =
                    true;


                return;

            }


            // Partial / Unselected
            salaryPaidAmount.disabled =
                false;

        }


        salaryStatus.addEventListener(
            "change",
            updateSalaryPaidAmountField
        );


        salaryAmount.addEventListener(
            "input",
            function () {

                if (
                    salaryStatus.value ===
                        "paid" ||
                    salaryStatus.value ===
                        "due"
                ) {

                    updateSalaryPaidAmountField();

                }

            }
        );


        // ==========================================
        // SALARY SUBMIT
        // ==========================================

        salaryForm.addEventListener(
            "submit",
            function (
                event
            ) {

                event.preventDefault();


                const selectedEmployee =
                    employees.find(
                        function (
                            employee
                        ) {

                            return sameId(
                                employee.id,
                                employeeSelect.value
                            );

                        }
                    );


                if (
                    !selectedEmployee
                ) {

                    showToast(
                        "Please select an employee.",
                        "error"
                    );

                    return;

                }


                const amount =
                    Number(
                        salaryAmount.value
                    );


                if (
                    !Number.isFinite(
                        amount
                    ) ||
                    amount <= 0
                ) {

                    showToast(
                        "Salary amount must be greater than zero.",
                        "error"
                    );

                    return;

                }


                if (
                    !salaryStatus.value
                ) {

                    showToast(
                        "Please select a salary payment status.",
                        "error"
                    );

                    return;

                }


                let paidAmount =
                    Number(
                        salaryPaidAmount.value
                    );


                // Fully Paid
                if (
                    salaryStatus.value ===
                    "paid"
                ) {

                    paidAmount =
                        amount;

                }


                // Fully Due
                if (
                    salaryStatus.value ===
                    "due"
                ) {

                    paidAmount =
                        0;

                }


                // Partial
                if (
                    salaryStatus.value ===
                    "partial"
                ) {

                    if (
                        !Number.isFinite(
                            paidAmount
                        ) ||
                        paidAmount <= 0 ||
                        paidAmount >= amount
                    ) {

                        showToast(
                            "For partial payment, paid amount must be greater than 0 and less than total salary.",
                            "error"
                        );

                        return;

                    }

                }


                const dueAmount =
                    Math.max(
                        0,
                        amount -
                        paidAmount
                    );


                // ==================================
                // Duplicate Employee + Month
                // ==================================

                const duplicate =
                    salaries.some(
                        function (
                            salary
                        ) {

                            return (

                                sameId(
                                    salary.employeeId,
                                    selectedEmployee.id
                                ) &&

                                salary.month ===
                                salaryMonth.value &&

                                !sameId(
                                    salary.id,
                                    editingSalaryId
                                )

                            );

                        }
                    );


                if (
                    duplicate
                ) {

                    showToast(
                        "Salary for this employee and month already exists.",
                        "error"
                    );

                    return;

                }


                const salaryData = {

                    employeeId:
                        selectedEmployee.id,

                    employeeName:
                        selectedEmployee.name,

                    role:
                        selectedEmployee.role,

                    month:
                        salaryMonth.value,

                    amount:
                        amount,

                    status:
                        salaryStatus.value,

                    paidAmount:
                        paidAmount,

                    dueAmount:
                        dueAmount

                };


                // ==================================
                // UPDATE SALARY
                // ==================================

                if (
                    editingSalaryId !==
                    null
                ) {

                    const index =
                        salaries.findIndex(
                            function (
                                salary
                            ) {

                                return sameId(
                                    salary.id,
                                    editingSalaryId
                                );

                            }
                        );


                    if (
                        index !== -1
                    ) {

                        salaries[index] = {

                            id:
                                salaries[index].id,

                            ...salaryData

                        };

                    }


                    saveSalaries();

                    displaySalaries();

                    resetSalaryForm();


                    showToast(
                        "Salary record updated successfully!"
                    );


                    return;

                }


                // ==================================
                // NEW SALARY
                // ==================================

                salaries.push(
                    {

                        id:
                            Date.now(),

                        ...salaryData

                    }
                );


                saveSalaries();

                displaySalaries();

                resetSalaryForm();


                showToast(
                    "Salary record saved successfully!"
                );

            }
        );


        // ==========================================
        // EXPENSE TABLE ACTION
        // ==========================================

        expenseTableBody.addEventListener(
            "click",
            function (
                event
            ) {

                const button =
                    event.target.closest(
                        "button"
                    );


                if (!button) {

                    return;

                }


                const id =
                    button.dataset.id;


                const action =
                    button.dataset
                        .expenseAction;


                if (
                    action ===
                    "edit"
                ) {

                    editExpense(
                        id
                    );

                }


                if (
                    action ===
                    "delete"
                ) {

                    deleteExpense(
                        id
                    );

                }

            }
        );


        // ==========================================
        // SALARY TABLE ACTION
        // ==========================================

        salaryTableBody.addEventListener(
            "click",
            function (
                event
            ) {

                const button =
                    event.target.closest(
                        "button"
                    );


                if (!button) {

                    return;

                }


                const id =
                    button.dataset.id;


                const action =
                    button.dataset
                        .salaryAction;


                if (
                    action ===
                    "edit"
                ) {

                    editSalary(
                        id
                    );

                }


                if (
                    action ===
                    "delete"
                ) {

                    deleteSalary(
                        id
                    );

                }

            }
        );


        // ==========================================
        // EDIT EXPENSE
        // ==========================================

        function editExpense(
            id
        ) {

            const expense =
                expenses.find(
                    function (
                        expense
                    ) {

                        return sameId(
                            expense.id,
                            id
                        );

                    }
                );


            if (!expense) {

                showToast(
                    "Expense record not found.",
                    "error"
                );

                return;

            }


            expenseType.value =
                expense.type;


            expenseAmount.value =
                expense.amount;


            expenseDate.value =
                expense.date;


            expenseDescription.value =
                expense.description ||
                "";


            paymentMethod.value =
                expense.paymentMethod;


            expenseStatus.value =
                expense.status;


            editingExpenseId =
                expense.id;


            expenseFormTitle.textContent =
                "Update Expense";


            saveExpenseButton.innerHTML = `

                <span aria-hidden="true">
                    ▣
                </span>

                Update Expense

            `;


            expenseForm.scrollIntoView(
                {
                    behavior:
                        "smooth",

                    block:
                        "center"
                }
            );

        }


        // ==========================================
        // DELETE EXPENSE
        // ==========================================

        function deleteExpense(
            id
        ) {

            const exists =
                expenses.some(
                    function (
                        expense
                    ) {

                        return sameId(
                            expense.id,
                            id
                        );

                    }
                );


            if (!exists) {

                showToast(
                    "Expense record not found.",
                    "error"
                );

                return;

            }


            expenses =
                expenses.filter(
                    function (
                        expense
                    ) {

                        return !sameId(
                            expense.id,
                            id
                        );

                    }
                );


            saveExpenses();

            displayExpenses();


            if (
                editingExpenseId !==
                    null &&
                sameId(
                    editingExpenseId,
                    id
                )
            ) {

                resetExpenseForm();

            }


            showToast(
                "Expense deleted successfully!"
            );

        }


        // ==========================================
        // EDIT SALARY
        // ==========================================

        function editSalary(
            id
        ) {

            const salary =
                salaries.find(
                    function (
                        salary
                    ) {

                        return sameId(
                            salary.id,
                            id
                        );

                    }
                );


            if (!salary) {

                showToast(
                    "Salary record not found.",
                    "error"
                );

                return;

            }


            populateEmployeeDropdown(
                salary.employeeId
            );


            const employee =
                employees.find(
                    function (
                        employee
                    ) {

                        return sameId(
                            employee.id,
                            salary.employeeId
                        );

                    }
                );


            employeeRole.value =
                employee
                    ? getRoleText(
                        employee.role
                    )
                    : getRoleText(
                        salary.role
                    );


            salaryMonth.value =
                salary.month;


            salaryAmount.value =
                salary.amount;


            salaryStatus.value =
                salary.status;


            salaryPaidAmount.disabled =
                false;


            salaryPaidAmount.value =
                salary.paidAmount;


            editingSalaryId =
                salary.id;


            updateSalaryPaidAmountField();


            salaryFormTitle.textContent =
                "Update Salary";


            saveSalaryButton.innerHTML = `

                <span aria-hidden="true">
                    ▣
                </span>

                Update Salary

            `;


            salaryForm.scrollIntoView(
                {
                    behavior:
                        "smooth",

                    block:
                        "center"
                }
            );

        }


        // ==========================================
        // DELETE SALARY
        // ==========================================

        function deleteSalary(
            id
        ) {

            const exists =
                salaries.some(
                    function (
                        salary
                    ) {

                        return sameId(
                            salary.id,
                            id
                        );

                    }
                );


            if (!exists) {

                showToast(
                    "Salary record not found.",
                    "error"
                );

                return;

            }


            salaries =
                salaries.filter(
                    function (
                        salary
                    ) {

                        return !sameId(
                            salary.id,
                            id
                        );

                    }
                );


            saveSalaries();

            displaySalaries();


            if (
                editingSalaryId !==
                    null &&
                sameId(
                    editingSalaryId,
                    id
                )
            ) {

                resetSalaryForm();

            }


            showToast(
                "Salary record deleted successfully!"
            );

        }


        // ==========================================
        // RESET EXPENSE FORM
        // ==========================================

        function resetExpenseForm() {

            expenseForm.reset();


            editingExpenseId =
                null;


            expenseDate.value =
                getTodayDate();


            expenseFormTitle.textContent =
                "Add Expense";


            saveExpenseButton.innerHTML = `

                <span aria-hidden="true">
                    ▣
                </span>

                Save Expense

            `;

        }


        // ==========================================
        // RESET SALARY FORM
        // ==========================================

        function resetSalaryForm() {

            salaryForm.reset();


            editingSalaryId =
                null;


            populateEmployeeDropdown();


            employeeRole.value =
                "";


            salaryMonth.value =
                getCurrentMonth();


            salaryPaidAmount.disabled =
                false;


            salaryPaidAmount.value =
                "";


            salaryFormTitle.textContent =
                "Add Salary";


            saveSalaryButton.innerHTML = `

                <span aria-hidden="true">
                    ▣
                </span>

                Save Salary

            `;

        }


        // ==========================================
        // RECORD CARD WINDOW CONTROLS
        // Collapse + Expand / Restore
        // ==========================================

        recordsGrid.addEventListener(
            "click",
            function (
                event
            ) {

                const button =
                    event.target.closest(
                        "[data-record-action]"
                    );


                if (!button) {

                    return;

                }


                const card =
                    button.closest(
                        ".records-card"
                    );


                if (!card) {

                    return;

                }


                const action =
                    button.dataset
                        .recordAction;


                if (
                    action ===
                    "collapse"
                ) {

                    toggleRecordCollapse(
                        card
                    );

                    return;

                }


                if (
                    action ===
                    "maximize"
                ) {

                    toggleRecordMaximize(
                        card
                    );

                }

            }
        );


        // ==========================================
        // COLLAPSE RECORD CARD
        // ==========================================

        function toggleRecordCollapse(
            card
        ) {

            const collapseButton =
                card.querySelector(
                    '[data-record-action="collapse"]'
                );


            const isCurrentlyCollapsed =
                card.classList.contains(
                    "is-collapsed"
                );


            // ======================================
            // Expand Collapsed Card
            // ======================================

            if (
                isCurrentlyCollapsed
            ) {

                card.classList.remove(
                    "is-collapsed"
                );


                collapseButton.textContent =
                    "−";


                collapseButton.title =
                    "Collapse";


                collapseButton.setAttribute(
                    "aria-label",
                    "Collapse record table"
                );


                return;

            }


            // ======================================
            // Collapse Card
            // ======================================

            card.classList.add(
                "is-collapsed"
            );


            collapseButton.textContent =
                "+";


            collapseButton.title =
                "Show table";


            collapseButton.setAttribute(
                "aria-label",
                "Show record table"
            );

        }


        // ==========================================
        // MAXIMIZE / RESTORE RECORD CARD
        // ==========================================

        function toggleRecordMaximize(
            card
        ) {

            const maximizeButton =
                card.querySelector(
                    '[data-record-action="maximize"]'
                );


            const collapseButton =
                card.querySelector(
                    '[data-record-action="collapse"]'
                );


            const isCurrentlyMaximized =
                card.classList.contains(
                    "is-maximized"
                );


            // ======================================
            // RESTORE
            // ======================================

            if (
                isCurrentlyMaximized
            ) {

                card.classList.remove(
                    "is-maximized"
                );


                recordsGrid.classList.remove(
                    "has-maximized-card"
                );


                maximizeButton.textContent =
                    "⛶";


                maximizeButton.title =
                    "Expand";


                maximizeButton.setAttribute(
                    "aria-label",
                    "Expand record table"
                );


                return;

            }


            // ======================================
            // Remove Previous Maximize
            // ======================================

            const previousMaximizedCard =
                recordsGrid.querySelector(
                    ".records-card.is-maximized"
                );


            if (
                previousMaximizedCard
            ) {

                previousMaximizedCard
                    .classList
                    .remove(
                        "is-maximized"
                    );

            }


            // ======================================
            // Automatically Open Collapsed Card
            // ======================================

            card.classList.remove(
                "is-collapsed"
            );


            collapseButton.textContent =
                "−";


            collapseButton.title =
                "Collapse";


            collapseButton.setAttribute(
                "aria-label",
                "Collapse record table"
            );


            // ======================================
            // Maximize Selected Card
            // ======================================

            card.classList.add(
                "is-maximized"
            );


            recordsGrid.classList.add(
                "has-maximized-card"
            );


            maximizeButton.textContent =
                "↙";


            maximizeButton.title =
                "Restore";


            maximizeButton.setAttribute(
                "aria-label",
                "Restore record table"
            );

        }


        // ==========================================
        // LOAD PROFILE NAME
        // ==========================================

        function loadProfileName() {

            try {

                const profile =
                    JSON.parse(
                        localStorage.getItem(
                            "riceMillProfile"
                        ) ||
                        "{}"
                    );


                if (
                    profile.fullName
                ) {

                    expenseTopbarUserName
                        .textContent =
                        profile.fullName;

                }

            } catch (error) {

                console.error(
                    "Profile information could not be loaded:",
                    error
                );

            }

        }


        // ==========================================
        // INITIAL VALUES
        // ==========================================

        expenseDate.value =
            getTodayDate();


        salaryMonth.value =
            getCurrentMonth();


        populateEmployeeDropdown();


        // ==========================================
        // INITIAL DISPLAY
        // ==========================================

        displayExpenses();

        displaySalaries();

        loadProfileName();

    }
);