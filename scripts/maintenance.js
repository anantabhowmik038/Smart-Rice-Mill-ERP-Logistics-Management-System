document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       SMART RICE MILL ERP
       MACHINE MAINTENANCE MANAGEMENT

       RESEARCH BASIS
       --------------
       1. Pertiwi, Hermawan & Prahmawati (2019)
          Preventive maintenance for paddy seed
          production machinery.

          DOI:
          10.1088/1757-899X/557/1/012075

       2. Wahab et al. (2026)
          Rice milling machine maintenance:
          preventive + corrective maintenance.

          DOI:
          10.24256/kharaj.v8i1.8905

       3. Igbokwe & Harold (2022)
          Food manufacturing maintenance:
          preventive maintenance,
          corrective maintenance,
          downtime cost,
          equipment-failure cost,
          maintenance reliability.

          DOI:
          10.9734/acri/2022/v22i8543

       SYSTEM LOGIC
       ------------
       Next Service Date
       = Last Service Date
       + Maintenance Interval

       Maintenance records remain separate from
       ordinary expense records to avoid duplicate
       financial transactions.

       Expense & Salary and Reports can read
       maintenanceRecords directly.
    ========================================= */


    /* =========================================
       ELEMENTS
    ========================================= */

    const maintenanceForm =
        document.getElementById(
            "maintenanceForm"
        );


    if (!maintenanceForm) {
        return;
    }


    const machineNameSelect =
        document.getElementById(
            "machineName"
        );


    const machineComponentSelect =
        document.getElementById(
            "machineComponent"
        );


    const maintenanceTypeSelect =
        document.getElementById(
            "maintenanceType"
        );


    const serviceActivitySelect =
        document.getElementById(
            "serviceActivity"
        );


    const lastServiceDateInput =
        document.getElementById(
            "lastServiceDate"
        );


    const maintenanceIntervalInput =
        document.getElementById(
            "maintenanceInterval"
        );


    const nextServiceDateInput =
        document.getElementById(
            "nextServiceDate"
        );


    const machineStatusSelect =
        document.getElementById(
            "machineStatus"
        );


    const damageSeveritySelect =
        document.getElementById(
            "damageSeverity"
        );


    const downtimeHoursInput =
        document.getElementById(
            "downtimeHours"
        );


    const sparePartSelect =
        document.getElementById(
            "sparePartUsed"
        );


    const maintenanceCostInput =
        document.getElementById(
            "maintenanceCost"
        );


    const responsiblePersonSelect =
        document.getElementById(
            "responsiblePerson"
        );


    const paymentMethodSelect =
        document.getElementById(
            "paymentMethod"
        );


    const paymentStatusSelect =
        document.getElementById(
            "paymentStatus"
        );


    const maintenanceStatusSelect =
        document.getElementById(
            "maintenanceStatus"
        );


    const maintenanceNotesInput =
        document.getElementById(
            "maintenanceNotes"
        );


    const maintenanceFormTitle =
        document.getElementById(
            "maintenanceFormTitle"
        );


    const saveMaintenanceBtn =
        document.getElementById(
            "saveMaintenanceBtn"
        );


    const cancelMaintenanceEditBtn =
        document.getElementById(
            "cancelMaintenanceEditBtn"
        );


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


    const lastServiceMachine =
        document.getElementById(
            "lastServiceMachine"
        );


    const maintenanceAlert =
        document.getElementById(
            "maintenanceAlert"
        );


    const maintenanceAlertText =
        document.getElementById(
            "maintenanceAlertText"
        );


    const maintenanceTableBody =
        document.getElementById(
            "maintenanceTableBody"
        );


    const maintenanceSearch =
        document.getElementById(
            "maintenanceSearch"
        );


    const scheduleFilter =
        document.getElementById(
            "scheduleFilter"
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

    let editingMaintenanceId =
        null;


    let pendingDeleteId =
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
       MACHINE MASTER

       Six core prototype machines.
    ========================================= */

    const DEFAULT_MACHINES = [

        {
            id: "MAC-001",

            name: "Rice Huller",

            components: [
                "Rubber Roll",
                "Drive Belt",
                "Bearing",
                "Motor"
            ],

            spareParts: [
                "Rubber Roll",
                "Drive Belt",
                "Bearing Set",
                "Motor Coupling"
            ]
        },


        {
            id: "MAC-002",

            name: "Polishing Machine",

            components: [
                "Polishing Roller",
                "Drive Belt",
                "Bearing",
                "Motor"
            ],

            spareParts: [
                "Polishing Roller",
                "Drive Belt",
                "Bearing Set",
                "Motor Coupling"
            ]
        },


        {
            id: "MAC-003",

            name: "Dryer Machine",

            components: [
                "Blower Fan",
                "Burner",
                "Motor",
                "Temperature Sensor"
            ],

            spareParts: [
                "Fan Bearing",
                "Burner Nozzle",
                "Motor Belt",
                "Temperature Sensor"
            ]
        },


        {
            id: "MAC-004",

            name: "De-stoner",

            components: [
                "Screen",
                "Vibrating Motor",
                "Bearing"
            ],

            spareParts: [
                "Screen Mesh",
                "Bearing Set",
                "Motor Mount"
            ]
        },


        {
            id: "MAC-005",

            name: "Grading Machine",

            components: [
                "Sieve",
                "Motor",
                "Drive Belt",
                "Bearing"
            ],

            spareParts: [
                "Sieve Screen",
                "Drive Belt",
                "Bearing Set"
            ]
        },


        {
            id: "MAC-006",

            name: "Packaging Machine",

            components: [
                "Conveyor",
                "Sealing Unit",
                "Load Cell",
                "Motor"
            ],

            spareParts: [
                "Conveyor Belt",
                "Sealing Element",
                "Load Cell",
                "Motor Coupling"
            ]
        }

    ];


    function loadMachines() {

        const stored =
            safeParseStorage(
                "machineMaster",
                null
            );


        if (
            Array.isArray(stored) &&
            stored.length > 0
        ) {

            return stored;
        }


        localStorage.setItem(
            "machineMaster",
            JSON.stringify(
                DEFAULT_MACHINES
            )
        );


        return [
            ...DEFAULT_MACHINES
        ];

    }


    let machines =
        loadMachines();


    /* =========================================
       RESPONSIBLE PERSONS
    ========================================= */

    const DEFAULT_RESPONSIBLE_PEOPLE = [

        {
            name: "Hasan",
            role: "Maintenance Technician"
        },

        {
            name: "Karim",
            role: "Technician"
        },

        {
            name: "Rahim",
            role: "Machine Operator"
        },

        {
            name: "Kamal",
            role: "Driver / Operator"
        }

    ];


    function loadResponsiblePeople() {

        const peopleMap =
            new Map();


        DEFAULT_RESPONSIBLE_PEOPLE.forEach(
            function (person) {

                peopleMap.set(
                    person.name.toLowerCase(),
                    person
                );

            }
        );


        const employees =
            safeParseStorage(
                "employees",
                []
            );


        if (Array.isArray(employees)) {

            employees.forEach(
                function (employee) {

                    const name =
                        String(
                            employee.name ||
                            employee.employeeName ||
                            ""
                        ).trim();


                    if (!name) {
                        return;
                    }


                    peopleMap.set(
                        name.toLowerCase(),
                        {
                            name: name,

                            role:
                                employee.role ||
                                employee.designation ||
                                "Employee"
                        }
                    );

                }
            );

        }


        return Array.from(
            peopleMap.values()
        );

    }


    let responsiblePeople =
        loadResponsiblePeople();


    /* =========================================
       DATE HELPERS
    ========================================= */

    function getTodayDate() {

        const date =
            new Date();


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


    function calculateNextServiceDate(
        lastServiceDate,
        intervalDays
    ) {

        if (
            !lastServiceDate ||
            !intervalDays
        ) {

            return "";
        }


        const date =
            new Date(
                `${lastServiceDate}T00:00:00`
            );


        date.setDate(
            date.getDate() +
            Number(intervalDays)
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
            `${year}-${month}-${day}`
        );

    }


    function daysBetween(
        fromDate,
        toDate
    ) {

        const from =
            new Date(
                `${fromDate}T00:00:00`
            );


        const to =
            new Date(
                `${toDate}T00:00:00`
            );


        return Math.round(
            (
                to.getTime() -
                from.getTime()
            )
            /
            86400000
        );

    }


    /* =========================================
       SCHEDULE STATUS

       < 0 days  = Overdue
       0 days    = Due Today
       1-7 days  = Due Soon
       > 7 days  = Scheduled
    ========================================= */

    function getScheduleStatus(
        nextServiceDate
    ) {

        if (!nextServiceDate) {

            return {
                key: "scheduled",
                label: "Not Set"
            };

        }


        const difference =
            daysBetween(
                getTodayDate(),
                nextServiceDate
            );


        if (difference < 0) {

            return {
                key: "overdue",
                label: "Overdue"
            };

        }


        if (difference === 0) {

            return {
                key: "due",
                label: "Due Today"
            };

        }


        if (difference <= 7) {

            return {
                key: "due",
                label: "Due Soon"
            };

        }


        return {
            key: "scheduled",
            label: "Scheduled"
        };

    }


    /* =========================================
       MONEY
    ========================================= */

    function formatMoney(value) {

        return (
            `৳${Number(
                value || 0
            ).toLocaleString(
                "en-US",
                {
                    maximumFractionDigits: 2
                }
            )}`
        );

    }


    /* =========================================
       SAFE HTML
    ========================================= */

    function escapeHTML(value) {

        const div =
            document.createElement(
                "div"
            );


        div.textContent =
            String(
                value ?? ""
            );


        return div.innerHTML;

    }


    /* =========================================
       RECORD NORMALIZATION
    ========================================= */

    function loadMaintenanceRecords() {

        let records =
            safeParseStorage(
                "maintenanceRecords",
                null
            );


        if (!Array.isArray(records)) {

            records =
                safeParseStorage(
                    "maintenance",
                    []
                );

        }


        if (!Array.isArray(records)) {
            return [];
        }


        return records.map(
            function (
                record,
                index
            ) {

                const lastDate =

                    record.lastServiceDate ||
                    record.maintenanceDate ||
                    record.serviceDate ||
                    record.date ||
                    getTodayDate();


                let interval =
                    Number(
                        record.maintenanceInterval ??
                        record.intervalDays ??
                        0
                    );


                if (
                    interval <= 0 &&
                    record.nextServiceDate &&
                    record.nextServiceDate >
                    lastDate
                ) {

                    interval =
                        daysBetween(
                            lastDate,
                            record.nextServiceDate
                        );

                }


                if (interval <= 0) {

                    interval = 30;

                }


                const nextDate =

                    record.nextServiceDate ||

                    calculateNextServiceDate(
                        lastDate,
                        interval
                    );


                const cost =
                    Number(
                        record.maintenanceCost ??
                        record.cost ??
                        record.totalCost ??
                        0
                    );


                return {

                    id:
                        record.id ??
                        Date.now() + index,


                    maintenanceId:

                        record.maintenanceId ||
                        `MNT-${String(
                            index + 1
                        ).padStart(
                            3,
                            "0"
                        )}`,


                    machineName:

                        record.machineName ||
                        record.machine ||
                        "Unknown Machine",


                    component:

                        record.component ||
                        record.machineComponent ||
                        "General",


                    maintenanceType:

                        record.maintenanceType ||
                        record.type ||
                        "Preventive",


                    serviceActivity:

                        record.serviceActivity ||
                        record.activity ||
                        "Inspection",


                    lastServiceDate:
                        lastDate,


                    maintenanceInterval:
                        interval,


                    nextServiceDate:
                        nextDate,


                    machineStatus:

                        record.machineStatus ||
                        "Operational",


                    damageSeverity:

                        record.damageSeverity ||
                        "None",


                    downtimeHours:

                        Number(
                            record.downtimeHours ||
                            record.downtime ||
                            0
                        ),


                    sparePartUsed:

                        record.sparePartUsed ||
                        record.sparePart ||
                        "None",


                    maintenanceCost:
                        cost,


                    cost:
                        cost,


                    responsiblePerson:

                        record.responsiblePerson ||
                        record.technician ||
                        record.responsible ||
                        "Not Assigned",


                    paymentMethod:

                        record.paymentMethod ||
                        "Not Applicable",


                    paymentStatus:

                        record.paymentStatus ||
                        "Not Applicable",


                    maintenanceStatus:

                        record.maintenanceStatus ||
                        record.status ||
                        "Completed",


                    notes:

                        record.notes ||
                        "",


                    maintenanceDate:
                        lastDate,


                    serviceDate:
                        lastDate,


                    date:
                        lastDate,


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


    let maintenanceRecords =
        loadMaintenanceRecords();


    function saveMaintenanceRecords() {

        localStorage.setItem(
            "maintenanceRecords",
            JSON.stringify(
                maintenanceRecords
            )
        );

    }


    /* =========================================
       ID GENERATOR
    ========================================= */

    function generateMaintenanceId() {

        const numbers =
            maintenanceRecords

                .map(
                    function (record) {

                        const match =
                            String(
                                record.maintenanceId ||
                                ""
                            ).match(
                                /^MNT-(\d+)$/i
                            );


                        return (
                            match
                                ? Number(match[1])
                                : 0
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
            `MNT-${String(
                next
            ).padStart(
                3,
                "0"
            )}`
        );

    }


    /* =========================================
       POPULATE MACHINES
    ========================================= */

    function populateMachines() {

        machineNameSelect.innerHTML = `

            <option value=""
                    selected
                    disabled>

                Select machine

            </option>

        `;


        machines.forEach(
            function (machine) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    machine.name;


                option.textContent =
                    machine.name;


                machineNameSelect.appendChild(
                    option
                );

            }
        );

    }


    /* =========================================
       MACHINE DEPENDENCIES
    ========================================= */

    function loadMachineDependencies(
        machineName
    ) {

        const machine =
            machines.find(
                function (item) {

                    return (
                        item.name ===
                        machineName
                    );

                }
            );


        machineComponentSelect.innerHTML =
            "";


        sparePartSelect.innerHTML =
            "";


        if (!machine) {

            machineComponentSelect.disabled =
                true;


            sparePartSelect.disabled =
                true;


            machineComponentSelect.innerHTML = `

                <option value="">
                    Select machine first
                </option>

            `;


            sparePartSelect.innerHTML = `

                <option value="">
                    Select machine first
                </option>

            `;


            return;

        }


        machineComponentSelect.disabled =
            false;


        sparePartSelect.disabled =
            false;


        machineComponentSelect.innerHTML = `

            <option value=""
                    selected
                    disabled>

                Select component

            </option>

        `;


        machine.components.forEach(
            function (component) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    component;


                option.textContent =
                    component;


                machineComponentSelect.appendChild(
                    option
                );

            }
        );


        sparePartSelect.innerHTML = `

            <option value="None">
                None
            </option>

        `;


        machine.spareParts.forEach(
            function (sparePart) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    sparePart;


                option.textContent =
                    sparePart;


                sparePartSelect.appendChild(
                    option
                );

            }
        );

    }


    machineNameSelect.addEventListener(
        "change",
        function () {

            loadMachineDependencies(
                machineNameSelect.value
            );

        }
    );


    /* =========================================
       MAINTENANCE ACTIVITIES
    ========================================= */

    const ACTIVITIES = {

        Preventive: [

            "Inspection",
            "Cleaning",
            "Lubrication",
            "Calibration",
            "Routine Part Replacement"

        ],


        Corrective: [

            "Repair",
            "Emergency Repair",
            "Component Replacement",
            "Electrical Repair",
            "Mechanical Adjustment"

        ]

    };


    function loadServiceActivities(
        type
    ) {

        serviceActivitySelect.innerHTML =
            "";


        if (!ACTIVITIES[type]) {

            serviceActivitySelect.disabled =
                true;


            serviceActivitySelect.innerHTML = `

                <option value="">
                    Select maintenance type first
                </option>

            `;


            return;

        }


        serviceActivitySelect.disabled =
            false;


        serviceActivitySelect.innerHTML = `

            <option value=""
                    selected
                    disabled>

                Select service activity

            </option>

        `;


        ACTIVITIES[type].forEach(
            function (activity) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    activity;


                option.textContent =
                    activity;


                serviceActivitySelect.appendChild(
                    option
                );

            }
        );

    }


    maintenanceTypeSelect.addEventListener(
        "change",
        function () {

            loadServiceActivities(
                maintenanceTypeSelect.value
            );

        }
    );


    /* =========================================
       RESPONSIBLE PEOPLE
    ========================================= */

    function populateResponsiblePeople() {

        responsiblePersonSelect.innerHTML = `

            <option value=""
                    selected
                    disabled>

                Select responsible person

            </option>

        `;


        responsiblePeople.forEach(
            function (person) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    person.name;


                option.textContent =
                    `${person.name} — ${person.role}`;


                responsiblePersonSelect.appendChild(
                    option
                );

            }
        );

    }


    /* =========================================
       NEXT SERVICE AUTO-CALCULATION
    ========================================= */

    function updateNextServiceDate() {

        const lastDate =
            lastServiceDateInput.value;


        const interval =
            Number(
                maintenanceIntervalInput.value
            );


        nextServiceDateInput.value =

            calculateNextServiceDate(
                lastDate,
                interval
            );

    }


    lastServiceDateInput.addEventListener(
        "change",
        updateNextServiceDate
    );


    maintenanceIntervalInput.addEventListener(
        "input",
        updateNextServiceDate
    );


    /* =========================================
       PAYMENT LOGIC
    ========================================= */

    function updatePaymentLogic() {

        const cost =
            Number(
                maintenanceCostInput.value ||
                0
            );


        if (cost === 0) {

            if (
                !paymentStatusSelect.value ||
                paymentStatusSelect.value ===
                "Not Applicable"
            ) {

                paymentStatusSelect.value =
                    "Not Applicable";


                paymentMethodSelect.value =
                    "Not Applicable";

            }

        }

    }


    maintenanceCostInput.addEventListener(
        "input",
        updatePaymentLogic
    );


    paymentStatusSelect.addEventListener(
        "change",
        function () {

            if (
                paymentStatusSelect.value ===
                "Not Applicable"
            ) {

                paymentMethodSelect.value =
                    "Not Applicable";

            }

        }
    );


    /* =========================================
       VALIDATION
    ========================================= */

    function validateForm() {

        if (!machineNameSelect.value) {
            return "Please select a machine.";
        }


        if (!machineComponentSelect.value) {
            return "Please select a machine component.";
        }


        if (!maintenanceTypeSelect.value) {
            return "Please select a maintenance type.";
        }


        if (!serviceActivitySelect.value) {
            return "Please select a service activity.";
        }


        if (!lastServiceDateInput.value) {
            return "Please select the last service date.";
        }


        if (
            lastServiceDateInput.value >
            getTodayDate()
        ) {

            return "Last service date cannot be in the future.";

        }


        const interval =
            Number(
                maintenanceIntervalInput.value
            );


        if (
            !Number.isInteger(interval) ||
            interval < 1 ||
            interval > 3650
        ) {

            return "Maintenance interval must be between 1 and 3650 days.";

        }


        if (!machineStatusSelect.value) {
            return "Please select the machine status.";
        }


        if (!damageSeveritySelect.value) {
            return "Please select the damage severity.";
        }


        if (
            damageSeveritySelect.value ===
            "Critical"

            &&

            machineStatusSelect.value ===
            "Operational"
        ) {

            return "A machine with Critical damage cannot remain Operational.";

        }


        const downtime =
            Number(
                downtimeHoursInput.value
            );


        if (
            !Number.isFinite(downtime) ||
            downtime < 0
        ) {

            return "Downtime cannot be negative.";

        }


        const cost =
            Number(
                maintenanceCostInput.value
            );


        if (
            !Number.isFinite(cost) ||
            cost < 0
        ) {

            return "Maintenance cost cannot be negative.";

        }


        if (!responsiblePersonSelect.value) {
            return "Please select a responsible person.";
        }


        if (!paymentStatusSelect.value) {
            return "Please select a payment status.";
        }


        if (!paymentMethodSelect.value) {
            return "Please select a payment method.";
        }


        if (
            cost > 0

            &&

            paymentStatusSelect.value ===
            "Not Applicable"
        ) {

            return "A maintenance record with cost must have Paid or Due payment status.";

        }


        if (
            cost > 0

            &&

            paymentMethodSelect.value ===
            "Not Applicable"
        ) {

            return "Please select a valid payment method for a paid maintenance cost.";

        }


        if (!maintenanceStatusSelect.value) {
            return "Please select the maintenance status.";
        }


        return "";

    }


    /* =========================================
       SAVE / UPDATE
    ========================================= */

    maintenanceForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const error =
                validateForm();


            if (error) {

                showToast(
                    error,
                    "error"
                );


                return;

            }


            const cost =
                Number(
                    maintenanceCostInput.value
                );


            const existingIndex =
                maintenanceRecords.findIndex(
                    function (record) {

                        return (
                            Number(record.id) ===
                            Number(editingMaintenanceId)
                        );

                    }
                );


            const existing =

                existingIndex >= 0

                    ?

                    maintenanceRecords[
                        existingIndex
                    ]

                    :

                    null;


            const record = {

                id:

                    existing
                        ? existing.id
                        : Date.now(),


                maintenanceId:

                    existing
                        ? existing.maintenanceId
                        : generateMaintenanceId(),


                machineName:
                    machineNameSelect.value,


                component:
                    machineComponentSelect.value,


                maintenanceType:
                    maintenanceTypeSelect.value,


                serviceActivity:
                    serviceActivitySelect.value,


                lastServiceDate:
                    lastServiceDateInput.value,


                maintenanceInterval:

                    Number(
                        maintenanceIntervalInput.value
                    ),


                nextServiceDate:
                    nextServiceDateInput.value,


                machineStatus:
                    machineStatusSelect.value,


                damageSeverity:
                    damageSeveritySelect.value,


                downtimeHours:

                    Number(
                        downtimeHoursInput.value
                    ),


                sparePartUsed:

                    sparePartSelect.value ||
                    "None",


                maintenanceCost:
                    cost,


                cost:
                    cost,


                responsiblePerson:
                    responsiblePersonSelect.value,


                paymentMethod:
                    paymentMethodSelect.value,


                paymentStatus:
                    paymentStatusSelect.value,


                maintenanceStatus:
                    maintenanceStatusSelect.value,


                notes:

                    maintenanceNotesInput.value
                        .trim(),


                maintenanceDate:
                    lastServiceDateInput.value,


                serviceDate:
                    lastServiceDateInput.value,


                date:
                    lastServiceDateInput.value,


                createdAt:

                    existing
                        ? existing.createdAt
                        : Date.now()

            };


            if (existing) {

                maintenanceRecords[
                    existingIndex
                ] =
                    record;


                showToast(
                    `${record.maintenanceId} updated successfully.`
                );

            }
            else {

                maintenanceRecords.push(
                    record
                );


                showToast(
                    `${record.maintenanceId} saved successfully.`
                );

            }


            saveMaintenanceRecords();

            resetMaintenanceForm();

            refreshMaintenancePage();

        }
    );


    /* =========================================
       RESET FORM
    ========================================= */

    function resetMaintenanceForm() {

        editingMaintenanceId =
            null;


        maintenanceForm.reset();


        lastServiceDateInput.value =
            getTodayDate();


        downtimeHoursInput.value =
            0;


        maintenanceCostInput.value =
            0;


        nextServiceDateInput.value =
            "";


        machineComponentSelect.disabled =
            true;


        machineComponentSelect.innerHTML = `

            <option value="">
                Select machine first
            </option>

        `;


        sparePartSelect.disabled =
            true;


        sparePartSelect.innerHTML = `

            <option value="">
                Select machine first
            </option>

        `;


        serviceActivitySelect.disabled =
            true;


        serviceActivitySelect.innerHTML = `

            <option value="">
                Select maintenance type first
            </option>

        `;


        maintenanceFormTitle.textContent =
            "Add Maintenance Record";


        saveMaintenanceBtn.innerHTML = `

            <span aria-hidden="true">
                ▣
            </span>

            Save Maintenance

        `;


        cancelMaintenanceEditBtn.hidden =
            true;

    }


    cancelMaintenanceEditBtn.addEventListener(
        "click",
        resetMaintenanceForm
    );


    /* =========================================
       EDIT RECORD
    ========================================= */

    function editMaintenanceRecord(id) {

        const record =
            maintenanceRecords.find(
                function (item) {

                    return (
                        Number(item.id) ===
                        Number(id)
                    );

                }
            );


        if (!record) {
            return;
        }


        editingMaintenanceId =
            record.id;


        machineNameSelect.value =
            record.machineName;


        loadMachineDependencies(
            record.machineName
        );


        if (
            !Array.from(
                machineComponentSelect.options
            ).some(
                option =>
                    option.value ===
                    record.component
            )
        ) {

            const option =
                new Option(
                    record.component,
                    record.component
                );


            machineComponentSelect.add(
                option
            );

        }


        machineComponentSelect.value =
            record.component;


        maintenanceTypeSelect.value =
            record.maintenanceType;


        loadServiceActivities(
            record.maintenanceType
        );


        if (
            !Array.from(
                serviceActivitySelect.options
            ).some(
                option =>
                    option.value ===
                    record.serviceActivity
            )
        ) {

            serviceActivitySelect.add(
                new Option(
                    record.serviceActivity,
                    record.serviceActivity
                )
            );

        }


        serviceActivitySelect.value =
            record.serviceActivity;


        lastServiceDateInput.value =
            record.lastServiceDate;


        maintenanceIntervalInput.value =
            record.maintenanceInterval;


        nextServiceDateInput.value =
            record.nextServiceDate;


        machineStatusSelect.value =
            record.machineStatus;


        damageSeveritySelect.value =
            record.damageSeverity;


        downtimeHoursInput.value =
            record.downtimeHours;


        if (
            !Array.from(
                sparePartSelect.options
            ).some(
                option =>
                    option.value ===
                    record.sparePartUsed
            )
        ) {

            sparePartSelect.add(
                new Option(
                    record.sparePartUsed,
                    record.sparePartUsed
                )
            );

        }


        sparePartSelect.value =
            record.sparePartUsed;


        maintenanceCostInput.value =
            record.maintenanceCost;


        ensureResponsiblePersonOption(
            record.responsiblePerson
        );


        responsiblePersonSelect.value =
            record.responsiblePerson;


        paymentMethodSelect.value =
            record.paymentMethod;


        paymentStatusSelect.value =
            record.paymentStatus;


        maintenanceStatusSelect.value =
            record.maintenanceStatus;


        maintenanceNotesInput.value =
            record.notes;


        maintenanceFormTitle.textContent =

            `Edit Maintenance — ${record.maintenanceId}`;


        saveMaintenanceBtn.innerHTML = `

            <span aria-hidden="true">
                ✓
            </span>

            Update Maintenance

        `;


        cancelMaintenanceEditBtn.hidden =
            false;


        maintenanceForm.scrollIntoView(
            {
                behavior: "smooth",
                block: "start"
            }
        );

    }


    function ensureResponsiblePersonOption(
        personName
    ) {

        if (!personName) {
            return;
        }


        const exists =
            Array.from(
                responsiblePersonSelect.options
            ).some(
                function (option) {

                    return (
                        option.value ===
                        personName
                    );

                }
            );


        if (!exists) {

            responsiblePersonSelect.add(
                new Option(
                    personName,
                    personName
                )
            );

        }

    }


    /* =========================================
       LATEST RECORD BY MACHINE
    ========================================= */

    function getLatestRecordByMachine() {

        const map =
            new Map();


        maintenanceRecords.forEach(
            function (record) {

                const current =
                    map.get(
                        record.machineName
                    );


                if (!current) {

                    map.set(
                        record.machineName,
                        record
                    );


                    return;

                }


                if (
                    record.lastServiceDate >
                    current.lastServiceDate
                ) {

                    map.set(
                        record.machineName,
                        record
                    );


                    return;

                }


                if (
                    record.lastServiceDate ===
                    current.lastServiceDate

                    &&

                    Number(record.createdAt) >
                    Number(current.createdAt)
                ) {

                    map.set(
                        record.machineName,
                        record
                    );

                }

            }
        );


        return map;

    }


    /* =========================================
       SUMMARY + ALERT
    ========================================= */

    function updateSummary() {

        const latestRecords =
            getLatestRecordByMachine();


        let activeMachineCount =
            0;


        machines.forEach(
            function (machine) {

                const latest =
                    latestRecords.get(
                        machine.name
                    );


                if (
                    !latest ||
                    latest.machineStatus !==
                    "Out of Service"
                ) {

                    activeMachineCount += 1;

                }

            }
        );


        const attentionRecords =
            [];


        latestRecords.forEach(
            function (record) {

                const schedule =
                    getScheduleStatus(
                        record.nextServiceDate
                    );


                if (
                    schedule.key ===
                    "overdue"

                    ||

                    schedule.key ===
                    "due"
                ) {

                    attentionRecords.push(
                        {
                            record,
                            schedule
                        }
                    );

                }

            }
        );


        activeMachinesValue.textContent =
            activeMachineCount;


        maintenanceDueValue.textContent =
            attentionRecords.length;


        const completedRecords =
            maintenanceRecords

                .filter(
                    function (record) {

                        return (
                            record.maintenanceStatus ===
                            "Completed"
                        );

                    }
                )

                .sort(
                    function (a, b) {

                        return (
                            b.lastServiceDate
                                .localeCompare(
                                    a.lastServiceDate
                                )
                        );

                    }
                );


        if (
            completedRecords.length > 0
        ) {

            const latestCompleted =
                completedRecords[0];


            lastServiceValue.textContent =
                formatDate(
                    latestCompleted.lastServiceDate
                );


            lastServiceMachine.textContent =

                `${latestCompleted.machineName} · ${latestCompleted.serviceActivity}`;

        }
        else {

            lastServiceValue.textContent =
                "—";


            lastServiceMachine.textContent =
                "No completed maintenance record";

        }


        if (
            attentionRecords.length === 0
        ) {

            maintenanceAlert.hidden =
                true;


            maintenanceAlertText.textContent =
                "";


            return;

        }


        maintenanceAlert.hidden =
            false;


        maintenanceAlertText.textContent =

            attentionRecords

                .map(
                    function (item) {

                        return (
                            `${item.record.machineName} (${item.schedule.label})`
                        );

                    }
                )

                .join(", ")

            + ".";

    }


    /* =========================================
       BADGE HELPERS
    ========================================= */

    function machineStatusClass(status) {

        if (status === "Operational") {
            return "machine-operational";
        }


        if (status === "Maintenance") {
            return "machine-maintenance";
        }


        return "machine-out";

    }


    function scheduleClass(key) {

        if (key === "overdue") {
            return "schedule-overdue";
        }


        if (key === "due") {
            return "schedule-due";
        }


        return "schedule-scheduled";

    }


    /* =========================================
       INLINE DELETE
       NO alert() / confirm()
    ========================================= */

    function actionHTML(record) {

        if (
            Number(pendingDeleteId) ===
            Number(record.id)
        ) {

            return `

                <span class="maintenance-delete-question">
                    Delete?
                </span>

                <button
                    class="maintenance-confirm-button"
                    type="button"
                    data-maintenance-action="confirm-delete"
                    data-id="${record.id}"
                >
                    Confirm
                </button>

                <button
                    class="maintenance-cancel-button"
                    type="button"
                    data-maintenance-action="cancel-delete"
                    data-id="${record.id}"
                >
                    Cancel
                </button>

            `;

        }


        return `

            <button
                class="maintenance-edit-button"
                type="button"
                data-maintenance-action="edit"
                data-id="${record.id}"
            >
                Edit
            </button>

            <button
                class="maintenance-delete-button"
                type="button"
                data-maintenance-action="delete"
                data-id="${record.id}"
            >
                Delete
            </button>

        `;

    }


    /* =========================================
       DISPLAY RECORDS
    ========================================= */

    function displayMaintenanceRecords() {

        const searchText =
            maintenanceSearch.value
                .trim()
                .toLowerCase();


        const filter =
            scheduleFilter.value;


        const filteredRecords =
            maintenanceRecords

                .filter(
                    function (record) {

                        const schedule =
                            getScheduleStatus(
                                record.nextServiceDate
                            );


                        if (
                            filter !== "all" &&
                            schedule.key !== filter
                        ) {

                            return false;

                        }


                        if (!searchText) {

                            return true;

                        }


                        const searchable =
                            [
                                record.maintenanceId,
                                record.machineName,
                                record.component,
                                record.maintenanceType,
                                record.serviceActivity,
                                record.responsiblePerson
                            ]
                            .join(" ")
                            .toLowerCase();


                        return searchable.includes(
                            searchText
                        );

                    }
                )

                .sort(
                    function (a, b) {

                        if (
                            a.lastServiceDate !==
                            b.lastServiceDate
                        ) {

                            return (
                                b.lastServiceDate
                                    .localeCompare(
                                        a.lastServiceDate
                                    )
                            );

                        }


                        return (
                            Number(b.createdAt) -
                            Number(a.createdAt)
                        );

                    }
                );


        maintenanceTableBody.innerHTML =
            "";


        if (
            filteredRecords.length === 0
        ) {

            maintenanceTableBody.innerHTML = `

                <tr class="maintenance-empty-row">

                    <td colspan="11">

                        No maintenance records match the current filter.

                    </td>

                </tr>

            `;


            return;

        }


        filteredRecords.forEach(
            function (record) {

                const schedule =
                    getScheduleStatus(
                        record.nextServiceDate
                    );


                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>

                        <span class="maintenance-id">

                            ${escapeHTML(
                                record.maintenanceId
                            )}

                        </span>

                    </td>


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
                                record.maintenanceType
                            )}

                        </span>

                        <span class="maintenance-secondary-text">

                            ${escapeHTML(
                                record.serviceActivity
                            )}

                        </span>

                    </td>


                    <td>

                        ${formatDate(
                            record.lastServiceDate
                        )}

                    </td>


                    <td>

                        ${formatDate(
                            record.nextServiceDate
                        )}

                        <span class="maintenance-secondary-text">

                            ${record.maintenanceInterval} days

                        </span>

                    </td>


                    <td>

                        ${Number(
                            record.downtimeHours
                        ).toLocaleString(
                            "en-US",
                            {
                                maximumFractionDigits: 2
                            }
                        )} hrs

                    </td>


                    <td>

                        <span class="maintenance-primary-text">

                            ${formatMoney(
                                record.maintenanceCost
                            )}

                        </span>

                        <span class="maintenance-secondary-text">

                            ${escapeHTML(
                                record.sparePartUsed ||
                                "None"
                            )}

                        </span>

                    </td>


                    <td>

                        <span class="maintenance-primary-text">

                            ${escapeHTML(
                                record.responsiblePerson
                            )}

                        </span>

                        <span class="maintenance-secondary-text">

                            ${escapeHTML(
                                record.maintenanceStatus
                            )}

                        </span>

                    </td>


                    <td>

                        <span
                            class="
                                maintenance-badge
                                ${machineStatusClass(
                                    record.machineStatus
                                )}
                            "
                        >

                            ${escapeHTML(
                                record.machineStatus
                            )}

                        </span>

                    </td>


                    <td>

                        <span
                            class="
                                maintenance-badge
                                ${scheduleClass(
                                    schedule.key
                                )}
                            "
                        >

                            ${escapeHTML(
                                schedule.label
                            )}

                        </span>

                    </td>


                    <td>

                        <div class="maintenance-table-actions">

                            ${actionHTML(
                                record
                            )}

                        </div>

                    </td>

                `;


                maintenanceTableBody.appendChild(
                    row
                );

            }
        );

    }


    maintenanceSearch.addEventListener(
        "input",
        displayMaintenanceRecords
    );


    scheduleFilter.addEventListener(
        "change",
        displayMaintenanceRecords
    );


    /* =========================================
       TABLE ACTIONS
    ========================================= */

    maintenanceTableBody.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    "button[data-maintenance-action]"
                );


            if (!button) {
                return;
            }


            const id =
                Number(
                    button.dataset.id
                );


            const action =
                button.dataset
                    .maintenanceAction;


            if (action === "edit") {

                editMaintenanceRecord(
                    id
                );


                return;

            }


            if (action === "delete") {

                pendingDeleteId =
                    id;


                displayMaintenanceRecords();


                return;

            }


            if (
                action ===
                "cancel-delete"
            ) {

                pendingDeleteId =
                    null;


                displayMaintenanceRecords();


                return;

            }


            if (
                action ===
                "confirm-delete"
            ) {

                const record =
                    maintenanceRecords.find(
                        function (item) {

                            return (
                                Number(item.id) ===
                                id
                            );

                        }
                    );


                maintenanceRecords =
                    maintenanceRecords.filter(
                        function (item) {

                            return (
                                Number(item.id) !==
                                id
                            );

                        }
                    );


                pendingDeleteId =
                    null;


                saveMaintenanceRecords();

                refreshMaintenancePage();


                showToast(

                    record

                        ?

                        `${record.maintenanceId} deleted successfully.`

                        :

                        "Maintenance record deleted successfully."

                );

            }

        }
    );


    /* =========================================
       REFRESH
    ========================================= */

    function refreshMaintenancePage() {

        updateSummary();

        displayMaintenanceRecords();

    }


    /* =========================================
       TOAST
    ========================================= */

    function showToast(
        message,
        type = "success"
    ) {

        const existing =
            document.querySelector(
                ".maintenance-toast"
            );


        if (existing) {
            existing.remove();
        }


        const toast =
            document.createElement(
                "div"
            );


        toast.className =
            `maintenance-toast ${type}`;


        toast.innerHTML = `

            <span class="maintenance-toast-icon">

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


    /* =========================================
       ESCAPE
    ========================================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key !== "Escape") {
                return;
            }


            if (pendingDeleteId !== null) {

                pendingDeleteId =
                    null;


                displayMaintenanceRecords();


                return;

            }


            closeSidebar();

        }
    );


    /* =========================================
       INITIALIZE
    ========================================= */

    populateMachines();

    populateResponsiblePeople();


    lastServiceDateInput.value =
        getTodayDate();


    downtimeHoursInput.value =
        0;


    maintenanceCostInput.value =
        0;


    saveMaintenanceRecords();


    refreshMaintenancePage();

});