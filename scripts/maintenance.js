document.addEventListener(
    "DOMContentLoaded",
    function () {

        // ==========================================
        // FORM ELEMENTS
        // ==========================================

        const maintenanceForm =
            document.getElementById(
                "maintenanceForm"
            );

        const maintenanceFormTitle =
            document.getElementById(
                "maintenanceFormTitle"
            );

        const machineName =
            document.getElementById(
                "machine-name"
            );

        const componentName =
            document.getElementById(
                "component-name"
            );

        const maintenanceType =
            document.getElementById(
                "maintenance-type"
            );

        const serviceType =
            document.getElementById(
                "service-type"
            );

        const lastServiceDate =
            document.getElementById(
                "last-service-date"
            );

        const maintenanceInterval =
            document.getElementById(
                "maintenance-interval"
            );

        const nextServiceDate =
            document.getElementById(
                "next-service-date"
            );

        const machineStatus =
            document.getElementById(
                "machine-status"
            );

        const damageSeverity =
            document.getElementById(
                "damage-severity"
            );

        const downtimeHours =
            document.getElementById(
                "downtime-hours"
            );


        // ==========================================
        // SPARE PART ELEMENTS
        // ==========================================

        const sparePartSelect =
            document.getElementById(
                "spare-part-select"
            );

        const otherSparePartField =
            document.getElementById(
                "otherSparePartField"
            );

        const otherSparePart =
            document.getElementById(
                "other-spare-part"
            );


        // ==========================================
        // MAINTENANCE COST
        // ==========================================

        const maintenanceCost =
            document.getElementById(
                "maintenance-cost"
            );


        // ==========================================
        // TECHNICIAN ELEMENTS
        // ==========================================

        const technicianSelect =
            document.getElementById(
                "technician-select"
            );

        const externalTechnicianField =
            document.getElementById(
                "externalTechnicianField"
            );

        const externalTechnicianName =
            document.getElementById(
                "external-technician-name"
            );


        // ==========================================
        // PAYMENT / STATUS
        // ==========================================

        const maintenancePaymentMethod =
            document.getElementById(
                "maintenance-payment-method"
            );

        const maintenancePaymentStatus =
            document.getElementById(
                "maintenance-payment-status"
            );

        const maintenanceStatus =
            document.getElementById(
                "maintenance-status"
            );

        const maintenanceNotes =
            document.getElementById(
                "maintenance-notes"
            );

        const saveMaintenanceButton =
            document.getElementById(
                "saveMaintenanceButton"
            );


        // ==========================================
        // TABLE
        // ==========================================

        const maintenanceTableBody =
            document.getElementById(
                "maintenanceTableBody"
            );


        // ==========================================
        // SUMMARY
        // ==========================================

        const activeMachinesValue =
            document.getElementById(
                "activeMachinesValue"
            );

        const maintenanceDueValue =
            document.getElementById(
                "maintenanceDueValue"
            );

        const lastServiceValue =
            document.getElementById(
                "lastServiceValue"
            );


        // ==========================================
        // ALERT
        // ==========================================

        const maintenanceAlertBox =
            document.getElementById(
                "maintenanceAlertBox"
            );

        const maintenanceAlertText =
            document.getElementById(
                "maintenanceAlertText"
            );


        // ==========================================
        // TOPBAR
        // ==========================================

        const maintenanceTopbarUserName =
            document.getElementById(
                "maintenanceTopbarUserName"
            );


        // ==========================================
        // EDIT STATE
        // ==========================================

        let editingMaintenanceId =
            null;


        // ==========================================
        // DEFAULT EMPLOYEES
        // Used only if central employees
        // data does not exist yet.
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
        // MACHINE MASTER DATA
        // ==========================================

        const machines = [

            {
                id:
                    "polishing-machine",

                name:
                    "Polishing Machine",

                active:
                    true,

                components: [
                    "Polishing Roller",
                    "Abrasive Stone",
                    "Belt",
                    "Bearing"
                ],

                spareParts: [
                    "Polishing Roller",
                    "Abrasive Stone",
                    "Drive Belt",
                    "Bearing"
                ]
            },


            {
                id:
                    "dryer-machine",

                name:
                    "Dryer Machine",

                active:
                    true,

                components: [
                    "Burner",
                    "Blower Fan",
                    "Conveyor",
                    "Temperature Unit"
                ],

                spareParts: [
                    "Burner Nozzle",
                    "Blower Fan",
                    "Fan Bearing",
                    "Conveyor Belt",
                    "Temperature Sensor"
                ]
            },


            {
                id:
                    "husker-machine",

                name:
                    "Husker Machine",

                active:
                    true,

                components: [
                    "Rubber Roll",
                    "Husking Chamber",
                    "Belt",
                    "Bearing"
                ],

                spareParts: [
                    "Rubber Roll",
                    "Drive Belt",
                    "Bearing",
                    "Husking Chamber Part"
                ]
            },


            {
                id:
                    "separator-machine",

                name:
                    "Separator Machine",

                active:
                    true,

                components: [
                    "Screen",
                    "Separator Motor",
                    "Belt",
                    "Bearing"
                ],

                spareParts: [
                    "Separator Screen",
                    "Motor",
                    "Drive Belt",
                    "Bearing"
                ]
            },


            {
                id:
                    "grader-machine",

                name:
                    "Grader Machine",

                active:
                    true,

                components: [
                    "Grading Screen",
                    "Vibrator Motor",
                    "Belt",
                    "Bearing"
                ],

                spareParts: [
                    "Grading Screen",
                    "Vibrator Motor",
                    "Drive Belt",
                    "Bearing"
                ]
            },


            {
                id:
                    "packaging-machine",

                name:
                    "Packaging Machine",

                active:
                    true,

                components: [
                    "Sealing Unit",
                    "Weighing Unit",
                    "Conveyor Belt",
                    "Sensor"
                ],

                spareParts: [
                    "Sealing Element",
                    "Weighing Sensor",
                    "Conveyor Belt",
                    "Control Sensor"
                ]
            }

        ];


        // ==========================================
        // DEFAULT MAINTENANCE DATA
        // ==========================================

        const defaultMaintenanceRecords = [

            {
                id:
                    1,

                machineId:
                    "polishing-machine",

                machineName:
                    "Polishing Machine",

                component:
                    "Belt",

                maintenanceType:
                    "preventive",

                serviceType:
                    "inspection",

                lastServiceDate:
                    "2026-06-25",

                maintenanceInterval:
                    30,

                nextServiceDate:
                    "2026-07-25",

                machineStatus:
                    "operational",

                damageSeverity:
                    "minor",

                downtimeHours:
                    1,

                sparePart:
                    "None",

                sparePartType:
                    "none",

                cost:
                    5000,

                technicianType:
                    "employee",

                technicianEmployeeId:
                    1004,

                technicianName:
                    "Hasan",

                paymentMethod:
                    "cash",

                paymentStatus:
                    "paid",

                status:
                    "completed",

                notes:
                    "Routine inspection completed."
            },


            {
                id:
                    2,

                machineId:
                    "dryer-machine",

                machineName:
                    "Dryer Machine",

                component:
                    "Blower Fan",

                maintenanceType:
                    "corrective",

                serviceType:
                    "repair",

                lastServiceDate:
                    "2026-06-20",

                maintenanceInterval:
                    30,

                nextServiceDate:
                    "2026-07-20",

                machineStatus:
                    "under-maintenance",

                damageSeverity:
                    "moderate",

                downtimeHours:
                    4,

                sparePart:
                    "Fan Bearing",

                sparePartType:
                    "catalog",

                cost:
                    8000,

                technicianType:
                    "employee",

                technicianEmployeeId:
                    1003,

                technicianName:
                    "Karim",

                paymentMethod:
                    "cash",

                paymentStatus:
                    "due",

                status:
                    "pending",

                notes:
                    "Repair follow-up required."
            }

        ];


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


        // ==========================================
        // DATE FORMAT
        // ==========================================

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
                    day:
                        "2-digit",

                    month:
                        "short",

                    year:
                        "numeric"
                }
            );

        }


        // ==========================================
        // ADD DAYS
        // ==========================================

        function addDays(
            dateString,
            days
        ) {

            const numberOfDays =
                Number(days);


            if (
                !dateString ||
                !Number.isFinite(
                    numberOfDays
                ) ||
                numberOfDays <= 0
            ) {

                return "";

            }


            const date =
                new Date(
                    dateString +
                    "T00:00:00"
                );


            date.setDate(
                date.getDate() +
                numberOfDays
            );


            const year =
                date.getFullYear();


            const month =
                String(
                    date.getMonth() + 1
                ).padStart(
                    2,
                    "0"
                );


            const day =
                String(
                    date.getDate()
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


        // ==========================================
        // DAYS BETWEEN
        // ==========================================

        function daysBetween(
            firstDate,
            secondDate
        ) {

            const first =
                new Date(
                    firstDate +
                    "T00:00:00"
                );


            const second =
                new Date(
                    secondDate +
                    "T00:00:00"
                );


            const difference =
                second.getTime() -
                first.getTime();


            return Math.ceil(
                difference /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            );

        }


        // ==========================================
        // MONEY
        // ==========================================

        function formatMoney(
            amount
        ) {

            const value =
                Number(amount) || 0;


            return (
                "৳" +
                value.toLocaleString(
                    "en-BD",
                    {
                        maximumFractionDigits:
                            2
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

            const oldToast =
                document.querySelector(
                    ".maintenance-toast"
                );


            if (oldToast) {

                oldToast.remove();

            }


            const toast =
                document.createElement(
                    "div"
                );


            toast.className =
                "maintenance-toast " +
                type;


            toast.innerHTML = `

                <span class="toast-icon">

                    ${
                        type ===
                        "success"
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
                "Employee"
            );

        }


        // ==========================================
        // LOAD EMPLOYEES
        // ==========================================

        function loadEmployees() {

            const stored =
                localStorage.getItem(
                    "employees"
                );


            if (
                stored === null
            ) {

                const initialEmployees =
                    defaultEmployees.map(
                        function (
                            employee
                        ) {

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
                    JSON.parse(
                        stored
                    );


                if (
                    Array.isArray(
                        parsed
                    )
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


        let employees =
            loadEmployees();


        // ==========================================
        // TECHNICIAN DROPDOWN
        // ==========================================

        function populateTechnicianDropdown(
            selectedValue = ""
        ) {

            technicianSelect.innerHTML = `

                <option
                    value=""
                    disabled
                    ${
                        selectedValue
                            ? ""
                            : "selected"
                    }
                >
                    Select responsible person
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
                        "employee:" +
                        employee.id;


                    option.textContent =
                        employee.name +
                        " — " +
                        getRoleText(
                            employee.role
                        );


                    if (
                        selectedValue ===
                        option.value
                    ) {

                        option.selected =
                            true;

                    }


                    technicianSelect
                        .appendChild(
                            option
                        );

                }
            );


            const externalOption =
                document.createElement(
                    "option"
                );


            externalOption.value =
                "external";


            externalOption.textContent =
                "External Technician / Other";


            if (
                selectedValue ===
                "external"
            ) {

                externalOption.selected =
                    true;

            }


            technicianSelect
                .appendChild(
                    externalOption
                );

        }


        // ==========================================
        // EXTERNAL TECHNICIAN FIELD
        // ==========================================

        function updateExternalTechnicianField() {

            if (
                technicianSelect.value ===
                "external"
            ) {

                externalTechnicianField
                    .classList
                    .remove(
                        "hidden"
                    );


                externalTechnicianName.required =
                    true;


                return;

            }


            externalTechnicianField
                .classList
                .add(
                    "hidden"
                );


            externalTechnicianName.required =
                false;


            externalTechnicianName.value =
                "";

        }


        technicianSelect.addEventListener(
            "change",
            updateExternalTechnicianField
        );


        // ==========================================
        // MACHINE DROPDOWN
        // ==========================================

        function populateMachineDropdown(
            selectedMachineId = ""
        ) {

            machineName.innerHTML = `

                <option
                    value=""
                    disabled
                    ${
                        selectedMachineId
                            ? ""
                            : "selected"
                    }
                >
                    Select machine
                </option>

            `;


            machines.forEach(
                function (
                    machine
                ) {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        machine.id;


                    option.textContent =
                        machine.name;


                    if (
                        sameId(
                            machine.id,
                            selectedMachineId
                        )
                    ) {

                        option.selected =
                            true;

                    }


                    machineName.appendChild(
                        option
                    );

                }
            );

        }


        // ==========================================
        // COMPONENT DROPDOWN
        // ==========================================

        function populateComponentDropdown(
            machineId,
            selectedComponent = ""
        ) {

            componentName.innerHTML = `

                <option
                    value=""
                    disabled
                    ${
                        selectedComponent
                            ? ""
                            : "selected"
                    }
                >
                    Select component
                </option>

            `;


            const machine =
                machines.find(
                    function (
                        machine
                    ) {

                        return sameId(
                            machine.id,
                            machineId
                        );

                    }
                );


            if (!machine) {

                componentName.disabled =
                    true;

                return;

            }


            machine.components.forEach(
                function (
                    component
                ) {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        component;


                    option.textContent =
                        component;


                    if (
                        component ===
                        selectedComponent
                    ) {

                        option.selected =
                            true;

                    }


                    componentName.appendChild(
                        option
                    );

                }
            );


            componentName.disabled =
                false;

        }


        // ==========================================
        // SPARE PART DROPDOWN
        // ==========================================

        function populateSparePartDropdown(
            machineId,
            selectedSparePart = ""
        ) {

            sparePartSelect.innerHTML =
                "";


            const machine =
                machines.find(
                    function (
                        machine
                    ) {

                        return sameId(
                            machine.id,
                            machineId
                        );

                    }
                );


            if (!machine) {

                sparePartSelect.innerHTML = `

                    <option
                        value=""
                        selected
                        disabled
                    >
                        Select machine first
                    </option>

                `;


                sparePartSelect.disabled =
                    true;


                hideOtherSparePartField();


                return;

            }


            const defaultOption =
                document.createElement(
                    "option"
                );


            defaultOption.value =
                "";


            defaultOption.disabled =
                true;


            defaultOption.textContent =
                "Select spare part";


            sparePartSelect.appendChild(
                defaultOption
            );


            // None
            const noneOption =
                document.createElement(
                    "option"
                );


            noneOption.value =
                "none";


            noneOption.textContent =
                "None";


            sparePartSelect.appendChild(
                noneOption
            );


            // Machine Specific Parts
            machine.spareParts.forEach(
                function (
                    part
                ) {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        part;


                    option.textContent =
                        part;


                    sparePartSelect.appendChild(
                        option
                    );

                }
            );


            // Other
            const otherOption =
                document.createElement(
                    "option"
                );


            otherOption.value =
                "other";


            otherOption.textContent =
                "Other";


            sparePartSelect.appendChild(
                otherOption
            );


            sparePartSelect.disabled =
                false;


            // ======================================
            // Existing / Edit Selection
            // ======================================

            if (
                !selectedSparePart
            ) {

                defaultOption.selected =
                    true;


                hideOtherSparePartField();


                return;

            }


            if (
                selectedSparePart ===
                "None"
            ) {

                sparePartSelect.value =
                    "none";


                hideOtherSparePartField();


                return;

            }


            const catalogMatch =
                machine.spareParts
                    .includes(
                        selectedSparePart
                    );


            if (
                catalogMatch
            ) {

                sparePartSelect.value =
                    selectedSparePart;


                hideOtherSparePartField();


                return;

            }


            // Legacy / custom part
            sparePartSelect.value =
                "other";


            showOtherSparePartField(
                selectedSparePart
            );

        }


        // ==========================================
        // OTHER SPARE PART FIELD
        // ==========================================

        function showOtherSparePartField(
            value = ""
        ) {

            otherSparePartField
                .classList
                .remove(
                    "hidden"
                );


            otherSparePart.required =
                true;


            otherSparePart.value =
                value;

        }


        function hideOtherSparePartField() {

            otherSparePartField
                .classList
                .add(
                    "hidden"
                );


            otherSparePart.required =
                false;


            otherSparePart.value =
                "";

        }


        sparePartSelect.addEventListener(
            "change",
            function () {

                if (
                    sparePartSelect.value ===
                    "other"
                ) {

                    showOtherSparePartField();


                    return;

                }


                hideOtherSparePartField();

            }
        );


        // ==========================================
        // MACHINE CHANGE
        // ==========================================

        machineName.addEventListener(
            "change",
            function () {

                populateComponentDropdown(
                    machineName.value
                );


                populateSparePartDropdown(
                    machineName.value
                );

            }
        );


        // ==========================================
        // NEXT SERVICE AUTO CALCULATION
        // ==========================================

        function calculateNextServiceDate() {

            nextServiceDate.value =
                addDays(
                    lastServiceDate.value,
                    maintenanceInterval.value
                );

        }


        lastServiceDate.addEventListener(
            "change",
            calculateNextServiceDate
        );


        maintenanceInterval.addEventListener(
            "input",
            calculateNextServiceDate
        );


        // ==========================================
        // LABEL HELPERS
        // ==========================================

        function getMaintenanceTypeText(
            type
        ) {

            if (
                type ===
                "preventive"
            ) {

                return "Preventive";

            }


            if (
                type ===
                "corrective"
            ) {

                return "Corrective";

            }


            return "—";

        }


        function getServiceText(
            type
        ) {

            const labels = {

                inspection:
                    "Inspection",

                cleaning:
                    "Cleaning",

                lubrication:
                    "Lubrication",

                "oil-change":
                    "Oil Change",

                repair:
                    "Repair",

                "parts-replacement":
                    "Parts Replacement"

            };


            return (
                labels[type] ||
                type ||
                "—"
            );

        }


        function getMachineStatusText(
            status
        ) {

            const labels = {

                operational:
                    "Operational",

                "under-maintenance":
                    "Maintenance",

                breakdown:
                    "Breakdown"

            };


            return (
                labels[status] ||
                status ||
                "—"
            );

        }


        function getMachineStatusClass(
            status
        ) {

            if (
                status ===
                "operational"
            ) {

                return "machine-operational";

            }


            if (
                status ===
                "under-maintenance"
            ) {

                return "machine-maintenance";

            }


            return "machine-breakdown";

        }


        // ==========================================
        // LOAD MAINTENANCE RECORDS
        // ==========================================

        function loadMaintenanceRecords() {

            const stored =
                localStorage.getItem(
                    "maintenanceRecords"
                );


            if (
                stored === null
            ) {

                const initialRecords =
                    defaultMaintenanceRecords.map(
                        function (
                            record
                        ) {

                            return {
                                ...record
                            };

                        }
                    );


                localStorage.setItem(
                    "maintenanceRecords",
                    JSON.stringify(
                        initialRecords
                    )
                );


                return initialRecords;

            }


            try {

                const parsed =
                    JSON.parse(
                        stored
                    );


                if (
                    Array.isArray(
                        parsed
                    )
                ) {

                    return parsed;

                }

            } catch (error) {

                console.error(
                    "Maintenance data could not be parsed:",
                    error
                );

            }


            return [];

        }


        let maintenanceRecords =
            loadMaintenanceRecords();


        // ==========================================
        // MIGRATE OLD RECORDS
        // ==========================================

        maintenanceRecords =
            maintenanceRecords.map(
                function (
                    record,
                    index
                ) {

                    if (
                        record.id ===
                            undefined ||
                        record.id ===
                            null
                    ) {

                        record.id =
                            Date.now() +
                            index;

                    }


                    record.cost =
                        Number(
                            record.cost
                        ) || 0;


                    record.downtimeHours =
                        Number(
                            record.downtimeHours
                        ) || 0;


                    record.maintenanceInterval =
                        Number(
                            record.maintenanceInterval
                        ) || 30;


                    if (
                        !record.nextServiceDate &&
                        record.lastServiceDate
                    ) {

                        record.nextServiceDate =
                            addDays(
                                record.lastServiceDate,
                                record.maintenanceInterval
                            );

                    }


                    if (
                        !record.sparePart
                    ) {

                        record.sparePart =
                            "None";

                    }


                    // ==================================
                    // Migrate old technician text
                    // ==================================

                    if (
                        !record.technicianName &&
                        record.technician
                    ) {

                        record.technicianName =
                            record.technician;

                    }


                    if (
                        !record.technicianName
                    ) {

                        record.technicianName =
                            "Unknown";

                    }


                    if (
                        !record.technicianType
                    ) {

                        const matchingEmployee =
                            employees.find(
                                function (
                                    employee
                                ) {

                                    return (
                                        employee.name
                                            .trim()
                                            .toLowerCase() ===

                                        record
                                            .technicianName
                                            .trim()
                                            .toLowerCase()
                                    );

                                }
                            );


                        if (
                            matchingEmployee
                        ) {

                            record.technicianType =
                                "employee";


                            record.technicianEmployeeId =
                                matchingEmployee.id;

                        } else {

                            record.technicianType =
                                "external";


                            record.technicianEmployeeId =
                                null;

                        }

                    }


                    return record;

                }
            );


        // ==========================================
        // SAVE RECORDS
        // ==========================================

        function saveMaintenanceRecords() {

            localStorage.setItem(
                "maintenanceRecords",
                JSON.stringify(
                    maintenanceRecords
                )
            );

        }


        saveMaintenanceRecords();


        // ==========================================
        // SCHEDULE STATUS
        // ==========================================

        function getScheduleStatus(
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

                    className:
                        ""

                };

            }


            if (
                record.nextServiceDate <
                today
            ) {

                return {

                    text:
                        "Overdue",

                    className:
                        "schedule-overdue"

                };

            }


            if (
                record.nextServiceDate ===
                today
            ) {

                return {

                    text:
                        "Due Today",

                    className:
                        "schedule-due"

                };

            }


            const remainingDays =
                daysBetween(
                    today,
                    record.nextServiceDate
                );


            if (
                remainingDays <= 7
            ) {

                return {

                    text:
                        "Due in " +
                        remainingDays +
                        "d",

                    className:
                        "schedule-soon"

                };

            }


            return {

                text:
                    "Scheduled",

                className:
                    "schedule-ok"

            };

        }


        // ==========================================
        // LATEST RECORD PER MACHINE
        // ==========================================

        function getLatestRecordsByMachine() {

            const latestMap =
                new Map();


            maintenanceRecords.forEach(
                function (
                    record
                ) {

                    const existing =
                        latestMap.get(
                            record.machineId
                        );


                    if (
                        !existing ||
                        String(
                            record.lastServiceDate
                        ) >
                        String(
                            existing.lastServiceDate
                        )
                    ) {

                        latestMap.set(
                            record.machineId,
                            record
                        );

                    }

                }
            );


            return Array.from(
                latestMap.values()
            );

        }


        // ==========================================
        // SUMMARY
        // ==========================================

        function updateSummary() {

            const activeMachines =
                machines.filter(
                    function (
                        machine
                    ) {

                        return machine.active;

                    }
                ).length;


            const latestRecords =
                getLatestRecordsByMachine();


            const today =
                getTodayDate();


            const dueRecords =
                latestRecords.filter(
                    function (
                        record
                    ) {

                        return (
                            record.nextServiceDate &&
                            record.nextServiceDate <=
                                today
                        );

                    }
                );


            const completedRecords =
                maintenanceRecords
                    .filter(
                        function (
                            record
                        ) {

                            return (
                                record.status ===
                                "completed"
                            );

                        }
                    )
                    .sort(
                        function (
                            first,
                            second
                        ) {

                            return String(
                                second.lastServiceDate
                            ).localeCompare(
                                String(
                                    first.lastServiceDate
                                )
                            );

                        }
                    );


            activeMachinesValue.textContent =
                activeMachines;


            maintenanceDueValue.textContent =
                dueRecords.length;


            lastServiceValue.textContent =
                completedRecords.length
                    ? formatDate(
                        completedRecords[0]
                            .lastServiceDate
                    )
                    : "—";


            updateMaintenanceAlert(
                latestRecords
            );

        }


        // ==========================================
        // ALERT
        // ==========================================

        function updateMaintenanceAlert(
            latestRecords
        ) {

            const today =
                getTodayDate();


            const attentionRecords =
                latestRecords.filter(
                    function (
                        record
                    ) {

                        if (
                            !record.nextServiceDate
                        ) {

                            return false;

                        }


                        if (
                            record.nextServiceDate <=
                            today
                        ) {

                            return true;

                        }


                        return (
                            daysBetween(
                                today,
                                record.nextServiceDate
                            ) <= 7
                        );

                    }
                );


            if (
                attentionRecords.length ===
                0
            ) {

                maintenanceAlertBox.hidden =
                    true;


                return;

            }


            const names =
                attentionRecords
                    .slice(
                        0,
                        3
                    )
                    .map(
                        function (
                            record
                        ) {

                            return (
                                record.machineName +
                                " (" +
                                getScheduleStatus(
                                    record
                                ).text +
                                ")"
                            );

                        }
                    );


            maintenanceAlertText.textContent =
                names.join(", ") +
                (
                    attentionRecords.length >
                    3
                        ? " and more."
                        : "."
                );


            maintenanceAlertBox.hidden =
                false;

        }


        // ==========================================
        // DISPLAY RECORDS
        // ==========================================

        function displayMaintenanceRecords() {

            maintenanceTableBody.innerHTML =
                "";


            if (
                maintenanceRecords.length ===
                0
            ) {

                maintenanceTableBody.innerHTML = `

                    <tr class="maintenance-empty-row">

                        <td colspan="9">

                            No maintenance records found.

                        </td>

                    </tr>

                `;


                updateSummary();


                return;

            }


            const sortedRecords =
                [
                    ...maintenanceRecords
                ].sort(
                    function (
                        first,
                        second
                    ) {

                        return String(
                            second.lastServiceDate
                        ).localeCompare(
                            String(
                                first.lastServiceDate
                            )
                        );

                    }
                );


            sortedRecords.forEach(
                function (
                    record
                ) {

                    const schedule =
                        getScheduleStatus(
                            record
                        );


                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `

                        <td>

                            <span class="maintenance-primary-text">

                                ${escapeHTML(
                                    record.machineName
                                )}

                            </span>

                            <span class="maintenance-secondary-text">

                                ${escapeHTML(
                                    record.component
                                )}

                            </span>

                        </td>


                        <td>

                            <span class="maintenance-primary-text">

                                ${escapeHTML(
                                    getMaintenanceTypeText(
                                        record.maintenanceType
                                    )
                                )}

                            </span>

                            <span class="maintenance-secondary-text">

                                ${escapeHTML(
                                    getServiceText(
                                        record.serviceType
                                    )
                                )}

                            </span>

                        </td>


                        <td>

                            ${escapeHTML(
                                formatDate(
                                    record.lastServiceDate
                                )
                            )}

                        </td>


                        <td>

                            ${escapeHTML(
                                formatDate(
                                    record.nextServiceDate
                                )
                            )}

                        </td>


                        <td>

                            <span class="maintenance-primary-text">

                                ${formatMoney(
                                    record.cost
                                )}

                            </span>

                            <span class="maintenance-secondary-text">

                                ${escapeHTML(
                                    record.sparePart ||
                                    "None"
                                )}

                            </span>

                        </td>


                        <td>

                            <span class="maintenance-primary-text">

                                ${escapeHTML(
                                    record.technicianName ||
                                    "—"
                                )}

                            </span>

                            <span class="maintenance-secondary-text">

                                ${
                                    record.technicianType ===
                                    "external"
                                        ? "External"
                                        : "Employee"
                                }

                            </span>

                        </td>


                        <td>

                            <span
                                class="
                                    maintenance-badge
                                    ${getMachineStatusClass(
                                        record.machineStatus
                                    )}
                                "
                            >

                                ${escapeHTML(
                                    getMachineStatusText(
                                        record.machineStatus
                                    )
                                )}

                            </span>

                        </td>


                        <td>

                            <span
                                class="
                                    maintenance-badge
                                    ${schedule.className}
                                "
                            >

                                ${escapeHTML(
                                    schedule.text
                                )}

                            </span>

                        </td>


                        <td>

                            <div class="maintenance-action-group">

                                <button
                                    class="maintenance-edit-button"
                                    type="button"
                                    data-action="edit"
                                    data-id="${record.id}"
                                >
                                    Edit
                                </button>


                                <button
                                    class="maintenance-delete-button"
                                    type="button"
                                    data-action="delete"
                                    data-id="${record.id}"
                                >
                                    Delete
                                </button>

                            </div>

                        </td>

                    `;


                    maintenanceTableBody
                        .appendChild(
                            row
                        );

                }
            );


            updateSummary();

        }


        // ==========================================
        // EXPENSE STORAGE
        // ==========================================

        function loadExpensesForSync() {

            const stored =
                localStorage.getItem(
                    "expenses"
                );


            if (!stored) {

                return [];

            }


            try {

                const parsed =
                    JSON.parse(
                        stored
                    );


                return Array.isArray(
                    parsed
                )
                    ? parsed
                    : [];

            } catch (error) {

                console.error(
                    "Expense data could not be read:",
                    error
                );


                return [];

            }

        }


        // ==========================================
        // REMOVE LINKED EXPENSE
        // ==========================================

        function removeLinkedExpense(
            maintenanceId
        ) {

            const expenses =
                loadExpensesForSync();


            const updatedExpenses =
                expenses.filter(
                    function (
                        expense
                    ) {

                        return !(
                            expense.sourceType ===
                                "maintenance" &&

                            sameId(
                                expense.sourceId,
                                maintenanceId
                            )
                        );

                    }
                );


            if (
                updatedExpenses.length !==
                expenses.length
            ) {

                localStorage.setItem(
                    "expenses",
                    JSON.stringify(
                        updatedExpenses
                    )
                );

            }

        }


        // ==========================================
        // SYNC TO EXPENSE
        // ==========================================

        function syncMaintenanceExpense(
            record
        ) {

            /*
                Only completed maintenance
                becomes actual expense.
            */

            if (
                record.status !==
                    "completed" ||
                Number(record.cost) <= 0
            ) {

                removeLinkedExpense(
                    record.id
                );


                return;

            }


            const expenses =
                loadExpensesForSync();


            const linkedIndex =
                expenses.findIndex(
                    function (
                        expense
                    ) {

                        return (
                            expense.sourceType ===
                                "maintenance" &&

                            sameId(
                                expense.sourceId,
                                record.id
                            )
                        );

                    }
                );


            const expenseData = {

                id:
                    linkedIndex !== -1
                        ? expenses[
                            linkedIndex
                        ].id
                        : (
                            "maintenance-" +
                            record.id
                        ),

                type:
                    "maintenance",

                amount:
                    Number(
                        record.cost
                    ),

                date:
                    record.lastServiceDate,

                description:
                    record.machineName +
                    " - " +
                    record.component +
                    " - " +
                    getServiceText(
                        record.serviceType
                    ),

                paymentMethod:
                    record.paymentMethod,

                status:
                    record.paymentStatus,

                sourceType:
                    "maintenance",

                sourceId:
                    record.id

            };


            if (
                linkedIndex === -1
            ) {

                expenses.push(
                    expenseData
                );

            } else {

                expenses[linkedIndex] =
                    expenseData;

            }


            localStorage.setItem(
                "expenses",
                JSON.stringify(
                    expenses
                )
            );

        }


        // ==========================================
        // GET SELECTED SPARE PART
        // ==========================================

        function getSelectedSparePart() {

            if (
                sparePartSelect.value ===
                "none"
            ) {

                return {

                    name:
                        "None",

                    type:
                        "none"

                };

            }


            if (
                sparePartSelect.value ===
                "other"
            ) {

                const customPart =
                    otherSparePart.value
                        .trim();


                if (
                    !customPart
                ) {

                    return null;

                }


                return {

                    name:
                        customPart,

                    type:
                        "other"

                };

            }


            if (
                !sparePartSelect.value
            ) {

                return null;

            }


            return {

                name:
                    sparePartSelect.value,

                type:
                    "catalog"

            };

        }


        // ==========================================
        // GET RESPONSIBLE PERSON
        // ==========================================

        function getResponsiblePerson() {

            const value =
                technicianSelect.value;


            if (!value) {

                return null;

            }


            if (
                value ===
                "external"
            ) {

                const technicianName =
                    externalTechnicianName
                        .value
                        .trim();


                if (
                    !technicianName
                ) {

                    return null;

                }


                return {

                    type:
                        "external",

                    employeeId:
                        null,

                    name:
                        technicianName

                };

            }


            if (
                value.startsWith(
                    "employee:"
                )
            ) {

                const employeeId =
                    value.replace(
                        "employee:",
                        ""
                    );


                const employee =
                    employees.find(
                        function (
                            employee
                        ) {

                            return sameId(
                                employee.id,
                                employeeId
                            );

                        }
                    );


                if (!employee) {

                    return null;

                }


                return {

                    type:
                        "employee",

                    employeeId:
                        employee.id,

                    name:
                        employee.name

                };

            }


            return null;

        }


        // ==========================================
        // FORM SUBMIT
        // ==========================================

        maintenanceForm.addEventListener(
            "submit",
            function (
                event
            ) {

                event.preventDefault();


                const selectedMachine =
                    machines.find(
                        function (
                            machine
                        ) {

                            return sameId(
                                machine.id,
                                machineName.value
                            );

                        }
                    );


                if (
                    !selectedMachine
                ) {

                    showToast(
                        "Please select a machine.",
                        "error"
                    );


                    return;

                }


                const selectedSparePart =
                    getSelectedSparePart();


                if (
                    !selectedSparePart
                ) {

                    showToast(
                        "Please select or enter the spare part information.",
                        "error"
                    );


                    return;

                }


                const responsiblePerson =
                    getResponsiblePerson();


                if (
                    !responsiblePerson
                ) {

                    showToast(
                        "Please select or enter the responsible person.",
                        "error"
                    );


                    return;

                }


                const interval =
                    Number(
                        maintenanceInterval.value
                    );


                const cost =
                    Number(
                        maintenanceCost.value
                    );


                const downtime =
                    Number(
                        downtimeHours.value
                    );


                if (
                    !Number.isFinite(
                        interval
                    ) ||
                    interval <= 0
                ) {

                    showToast(
                        "Maintenance interval must be greater than zero.",
                        "error"
                    );


                    return;

                }


                if (
                    !Number.isFinite(
                        cost
                    ) ||
                    cost < 0
                ) {

                    showToast(
                        "Maintenance cost cannot be negative.",
                        "error"
                    );


                    return;

                }


                if (
                    !Number.isFinite(
                        downtime
                    ) ||
                    downtime < 0
                ) {

                    showToast(
                        "Downtime cannot be negative.",
                        "error"
                    );


                    return;

                }


                const calculatedNextDate =
                    addDays(
                        lastServiceDate.value,
                        interval
                    );


                const recordData = {

                    machineId:
                        selectedMachine.id,

                    machineName:
                        selectedMachine.name,

                    component:
                        componentName.value,

                    maintenanceType:
                        maintenanceType.value,

                    serviceType:
                        serviceType.value,

                    lastServiceDate:
                        lastServiceDate.value,

                    maintenanceInterval:
                        interval,

                    nextServiceDate:
                        calculatedNextDate,

                    machineStatus:
                        machineStatus.value,

                    damageSeverity:
                        damageSeverity.value,

                    downtimeHours:
                        downtime,

                    sparePart:
                        selectedSparePart.name,

                    sparePartType:
                        selectedSparePart.type,

                    cost:
                        cost,

                    technicianType:
                        responsiblePerson.type,

                    technicianEmployeeId:
                        responsiblePerson.employeeId,

                    technicianName:
                        responsiblePerson.name,

                    // Backward compatibility
                    technician:
                        responsiblePerson.name,

                    paymentMethod:
                        maintenancePaymentMethod
                            .value,

                    paymentStatus:
                        maintenancePaymentStatus
                            .value,

                    status:
                        maintenanceStatus.value,

                    notes:
                        maintenanceNotes.value
                            .trim()

                };


                // ==================================
                // UPDATE
                // ==================================

                if (
                    editingMaintenanceId !==
                    null
                ) {

                    const index =
                        maintenanceRecords
                            .findIndex(
                                function (
                                    record
                                ) {

                                    return sameId(
                                        record.id,
                                        editingMaintenanceId
                                    );

                                }
                            );


                    if (
                        index !== -1
                    ) {

                        maintenanceRecords[
                            index
                        ] = {

                            id:
                                maintenanceRecords[
                                    index
                                ].id,

                            ...recordData

                        };


                        syncMaintenanceExpense(
                            maintenanceRecords[
                                index
                            ]
                        );

                    }


                    saveMaintenanceRecords();


                    displayMaintenanceRecords();


                    resetMaintenanceForm();


                    showToast(
                        "Maintenance record updated successfully!"
                    );


                    return;

                }


                // ==================================
                // NEW RECORD
                // ==================================

                const newRecord = {

                    id:
                        Date.now(),

                    ...recordData

                };


                maintenanceRecords.push(
                    newRecord
                );


                syncMaintenanceExpense(
                    newRecord
                );


                saveMaintenanceRecords();


                displayMaintenanceRecords();


                resetMaintenanceForm();


                if (
                    newRecord.status ===
                        "completed" &&
                    newRecord.cost > 0
                ) {

                    showToast(
                        "Maintenance saved and cost synced to Expenses!"
                    );

                } else {

                    showToast(
                        "Maintenance record saved successfully!"
                    );

                }

            }
        );


        // ==========================================
        // TABLE ACTIONS
        // ==========================================

        maintenanceTableBody.addEventListener(
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


                const action =
                    button.dataset.action;


                const id =
                    button.dataset.id;


                if (
                    action ===
                    "edit"
                ) {

                    editMaintenanceRecord(
                        id
                    );

                }


                if (
                    action ===
                    "delete"
                ) {

                    deleteMaintenanceRecord(
                        id
                    );

                }

            }
        );


        // ==========================================
        // EDIT
        // ==========================================

        function editMaintenanceRecord(
            id
        ) {

            const record =
                maintenanceRecords.find(
                    function (
                        record
                    ) {

                        return sameId(
                            record.id,
                            id
                        );

                    }
                );


            if (!record) {

                showToast(
                    "Maintenance record not found.",
                    "error"
                );


                return;

            }


            populateMachineDropdown(
                record.machineId
            );


            populateComponentDropdown(
                record.machineId,
                record.component
            );


            populateSparePartDropdown(
                record.machineId,
                record.sparePart
            );


            maintenanceType.value =
                record.maintenanceType;


            serviceType.value =
                record.serviceType;


            lastServiceDate.value =
                record.lastServiceDate;


            maintenanceInterval.value =
                record.maintenanceInterval;


            nextServiceDate.value =
                record.nextServiceDate;


            machineStatus.value =
                record.machineStatus;


            damageSeverity.value =
                record.damageSeverity;


            downtimeHours.value =
                record.downtimeHours;


            maintenanceCost.value =
                record.cost;


            // ======================================
            // Responsible Person
            // ======================================

            if (
                record.technicianType ===
                    "employee" &&
                record.technicianEmployeeId !==
                    null &&
                record.technicianEmployeeId !==
                    undefined
            ) {

                populateTechnicianDropdown(
                    "employee:" +
                    record.technicianEmployeeId
                );


                externalTechnicianField
                    .classList
                    .add(
                        "hidden"
                    );


                externalTechnicianName.required =
                    false;


                externalTechnicianName.value =
                    "";

            } else {

                populateTechnicianDropdown(
                    "external"
                );


                externalTechnicianField
                    .classList
                    .remove(
                        "hidden"
                    );


                externalTechnicianName.required =
                    true;


                externalTechnicianName.value =
                    record.technicianName ||
                    record.technician ||
                    "";

            }


            maintenancePaymentMethod.value =
                record.paymentMethod;


            maintenancePaymentStatus.value =
                record.paymentStatus;


            maintenanceStatus.value =
                record.status;


            maintenanceNotes.value =
                record.notes ||
                "";


            editingMaintenanceId =
                record.id;


            maintenanceFormTitle.textContent =
                "Update Maintenance Record";


            saveMaintenanceButton.innerHTML = `

                <span aria-hidden="true">
                    ▣
                </span>

                Update Maintenance

            `;


            maintenanceForm.scrollIntoView(
                {
                    behavior:
                        "smooth",

                    block:
                        "center"
                }
            );

        }


        // ==========================================
        // DELETE
        // ==========================================

        function deleteMaintenanceRecord(
            id
        ) {

            const exists =
                maintenanceRecords.some(
                    function (
                        record
                    ) {

                        return sameId(
                            record.id,
                            id
                        );

                    }
                );


            if (!exists) {

                showToast(
                    "Maintenance record not found.",
                    "error"
                );


                return;

            }


            maintenanceRecords =
                maintenanceRecords.filter(
                    function (
                        record
                    ) {

                        return !sameId(
                            record.id,
                            id
                        );

                    }
                );


            removeLinkedExpense(
                id
            );


            saveMaintenanceRecords();


            displayMaintenanceRecords();


            if (
                editingMaintenanceId !==
                    null &&
                sameId(
                    editingMaintenanceId,
                    id
                )
            ) {

                resetMaintenanceForm();

            }


            showToast(
                "Maintenance record deleted successfully!"
            );

        }


        // ==========================================
        // RESET FORM
        // ==========================================

        function resetMaintenanceForm() {

            maintenanceForm.reset();


            editingMaintenanceId =
                null;


            populateMachineDropdown();


            componentName.innerHTML = `

                <option
                    value=""
                    selected
                    disabled
                >
                    Select machine first
                </option>

            `;


            componentName.disabled =
                true;


            sparePartSelect.innerHTML = `

                <option
                    value=""
                    selected
                    disabled
                >
                    Select machine first
                </option>

            `;


            sparePartSelect.disabled =
                true;


            hideOtherSparePartField();


            populateTechnicianDropdown();


            externalTechnicianField
                .classList
                .add(
                    "hidden"
                );


            externalTechnicianName.required =
                false;


            externalTechnicianName.value =
                "";


            lastServiceDate.value =
                getTodayDate();


            downtimeHours.value =
                0;


            nextServiceDate.value =
                "";


            maintenanceFormTitle.textContent =
                "Add Maintenance Record";


            saveMaintenanceButton.innerHTML = `

                <span aria-hidden="true">
                    ▣
                </span>

                Save Maintenance

            `;

        }


        // ==========================================
        // PROFILE NAME
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

                    maintenanceTopbarUserName
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
        // INITIAL LOAD
        // ==========================================

        populateMachineDropdown();


        populateTechnicianDropdown();


        lastServiceDate.value =
            getTodayDate();


        downtimeHours.value =
            0;


        displayMaintenanceRecords();


        loadProfileName();

    }
);