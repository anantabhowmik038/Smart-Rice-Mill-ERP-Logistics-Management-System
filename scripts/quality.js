document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // ELEMENTS
    // ==========================================

    const qualityForm =
        document.getElementById("qualityForm");

    const purchaseSelect =
        document.getElementById("purchase-id");

    const supplierNameInput =
        document.getElementById("supplier-name");

    const moistureInput =
        document.getElementById("moisture");

    const impurityInput =
        document.getElementById("impurity");

    const brokenPaddyInput =
        document.getElementById("broken-paddy");

    const gradeSelect =
        document.getElementById("grade");

    const decisionSelect =
        document.getElementById("decision");

    const saveInspectionBtn =
        document.getElementById("saveInspectionBtn");

    const qualityTableBody =
        document.getElementById("qualityTableBody");


    // Summary Cards

    const acceptedBatchesValue =
        document.getElementById("acceptedBatchesValue");

    const rejectedBatchesValue =
        document.getElementById("rejectedBatchesValue");

    const averageMoistureValue =
        document.getElementById("averageMoistureValue");


    // ==========================================
    // EDIT MODE
    // ==========================================

    let editingInspectionId = null;


    // ==========================================
    // GET PURCHASES
    // ==========================================

    function getPurchases() {

        return (
            JSON.parse(
                localStorage.getItem("purchases")
            ) || []
        );

    }


    // ==========================================
    // DEFAULT QUALITY DATA
    // ==========================================

    const defaultInspections = [

        {
            id: 1,

            inspectionId: "Q-1001",

            purchaseId: "P-1024",

            supplierName: "Rahim Farmer",

            moisture: 14,

            impurity: 2,

            brokenPaddy: 3,

            grade: "A",

            decision: "accepted",

            date: "2026-07-01"
        },


        {
            id: 2,

            inspectionId: "Q-1002",

            purchaseId: "P-1023",

            supplierName: "Karim Supplier",

            moisture: 18,

            impurity: 5,

            brokenPaddy: 6,

            grade: "B",

            decision: "review",

            date: "2026-07-01"
        }

    ];


    // ==========================================
    // LOAD QUALITY DATA
    // ==========================================

    const storedInspections =
        localStorage.getItem(
            "qualityInspections"
        );


    let inspections;


    if (storedInspections === null) {

        inspections =
            defaultInspections;

        saveInspections();

    } else {

        inspections =
            JSON.parse(
                storedInspections
            ) || [];

    }


    // ==========================================
    // FIX OLD RECORDS
    // ==========================================

    let dataUpdated = false;


    inspections =
        inspections.map(
            function (inspection, index) {

                if (
                    inspection.id === undefined ||
                    inspection.id === null
                ) {

                    inspection.id =
                        Date.now() + index;

                    dataUpdated = true;

                }


                if (!inspection.inspectionId) {

                    inspection.inspectionId =
                        "Q-" +
                        (2000 + index);

                    dataUpdated = true;

                }


                return inspection;

            }
        );


    if (dataUpdated) {

        saveInspections();

    }


    // ==========================================
    // SAVE QUALITY DATA
    // ==========================================

    function saveInspections() {

        localStorage.setItem(
            "qualityInspections",
            JSON.stringify(inspections)
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
    // GENERATE INSPECTION ID
    // ==========================================

    function generateInspectionId() {

        let highestNumber = 1000;


        inspections.forEach(
            function (inspection) {

                if (!inspection.inspectionId) {
                    return;
                }


                const number =
                    Number(
                        inspection.inspectionId
                            .replace(
                                "Q-",
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
            "Q-" +
            (highestNumber + 1)
        );

    }


    // ==========================================
    // LOAD PURCHASE DROPDOWN
    // ==========================================

    function loadPurchaseDropdown() {

        const purchases =
            getPurchases();


        purchaseSelect.innerHTML = `

            <option value=""
                    selected
                    disabled>

                Select purchase id

            </option>

        `;


        purchases.forEach(
            function (purchase) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    purchase.purchaseId;


                option.textContent =
                    purchase.purchaseId +
                    " — " +
                    purchase.supplierName;


                purchaseSelect.appendChild(
                    option
                );

            }
        );


        if (purchases.length === 0) {

            const option =
                document.createElement(
                    "option"
                );


            option.disabled = true;


            option.textContent =
                "No purchase available";


            purchaseSelect.appendChild(
                option
            );

        }

    }


    // ==========================================
    // PURCHASE SELECT
    // ==========================================

    purchaseSelect.addEventListener(
        "change",
        function () {

            loadSelectedPurchase();

        }
    );


    function loadSelectedPurchase() {

        const purchases =
            getPurchases();


        const selectedPurchase =
            purchases.find(
                function (purchase) {

                    return (
                        purchase.purchaseId ===
                        purchaseSelect.value
                    );

                }
            );


        if (!selectedPurchase) {

            supplierNameInput.value = "";

            moistureInput.value = "";

            return;

        }


        // Supplier automatically

        supplierNameInput.value =
            selectedPurchase.supplierName;


        // Purchase moisture automatically

        moistureInput.value =
            selectedPurchase.moisture;

    }


    // ==========================================
    // DECISION TEXT
    // ==========================================

    function getDecisionText(decision) {

        if (decision === "accepted") {

            return "Accepted";

        }


        if (decision === "review") {

            return "Review";

        }


        if (decision === "rejected") {

            return "Rejected";

        }


        return decision;

    }


    // ==========================================
    // DECISION CLASS
    // ==========================================

    function getDecisionClass(decision) {

        if (decision === "accepted") {

            return "status-accepted";

        }


        if (decision === "review") {

            return "status-review";

        }


        if (decision === "rejected") {

            return "quality-status-rejected";

        }


        return "";

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
                ".quality-toast"
            );


        if (oldToast) {

            oldToast.remove();

        }


        const toast =
            document.createElement(
                "div"
            );


        toast.className =
            "quality-toast " + type;


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
    // SUMMARY CARDS
    // ==========================================

    function updateSummaryCards() {

        let acceptedCount = 0;

        let rejectedCount = 0;

        let totalMoisture = 0;


        inspections.forEach(
            function (inspection) {

                if (
                    inspection.decision ===
                    "accepted"
                ) {

                    acceptedCount++;

                }


                if (
                    inspection.decision ===
                    "rejected"
                ) {

                    rejectedCount++;

                }


                totalMoisture +=
                    Number(
                        inspection.moisture || 0
                    );

            }
        );


        let averageMoisture = 0;


        if (inspections.length > 0) {

            averageMoisture =
                totalMoisture /
                inspections.length;

        }


        acceptedBatchesValue.textContent =
            acceptedCount;


        rejectedBatchesValue.textContent =
            rejectedCount;


        averageMoistureValue.textContent =
            averageMoisture
                .toFixed(1)
                .replace(".0", "") +
            "%";

    }


    // ==========================================
    // DISPLAY TABLE
    // ==========================================

    function displayInspections() {

        qualityTableBody.innerHTML = "";


        inspections.forEach(
            function (inspection) {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>

                        ${escapeHTML(
                            inspection.purchaseId
                        )}

                    </td>


                    <td>

                        ${escapeHTML(
                            inspection.supplierName
                        )}

                    </td>


                    <td>

                        ${escapeHTML(
                            inspection.moisture
                        )}%

                    </td>


                    <td>

                        ${escapeHTML(
                            inspection.grade
                        )}

                    </td>


                    <td>

                        <span
                            class="status-badge
                            ${getDecisionClass(
                                inspection.decision
                            )}"
                        >

                            ${getDecisionText(
                                inspection.decision
                            )}

                        </span>

                    </td>


                    <td>

                        ${formatDate(
                            inspection.date
                        )}

                    </td>


                    <td>

                        <button
                            class="quality-edit-button"
                            type="button"
                            data-action="edit"
                            data-id="${inspection.id}"
                        >

                            Edit

                        </button>


                        <button
                            class="quality-delete-button"
                            type="button"
                            data-action="delete"
                            data-id="${inspection.id}"
                        >

                            Delete

                        </button>

                    </td>

                `;


                qualityTableBody.appendChild(
                    row
                );

            }
        );

    }


    // ==========================================
    // SAVE / UPDATE
    // ==========================================

    qualityForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const purchaseId =
                purchaseSelect.value;


            const supplierName =
                supplierNameInput.value.trim();


            const moisture =
                Number(
                    moistureInput.value
                );


            const impurity =
                Number(
                    impurityInput.value
                );


            const brokenPaddy =
                Number(
                    brokenPaddyInput.value
                );


            const grade =
                gradeSelect.value;


            const decision =
                decisionSelect.value;


            // ==================================
            // VALIDATION
            // ==================================

            if (!purchaseId) {

                showToast(
                    "Please select a purchase ID.",
                    "error"
                );

                return;

            }


            if (!supplierName) {

                showToast(
                    "Supplier information was not found.",
                    "error"
                );

                return;

            }


            if (
                moistureInput.value === "" ||
                moisture < 0 ||
                moisture > 100
            ) {

                showToast(
                    "Enter a valid moisture percentage.",
                    "error"
                );

                return;

            }


            if (
                impurityInput.value === "" ||
                impurity < 0 ||
                impurity > 100
            ) {

                showToast(
                    "Enter a valid impurity percentage.",
                    "error"
                );

                return;

            }


            if (
                brokenPaddyInput.value === "" ||
                brokenPaddy < 0 ||
                brokenPaddy > 100
            ) {

                showToast(
                    "Enter a valid broken paddy percentage.",
                    "error"
                );

                return;

            }


            if (!grade) {

                showToast(
                    "Please select a grade.",
                    "error"
                );

                return;

            }


            if (!decision) {

                showToast(
                    "Please select a decision.",
                    "error"
                );

                return;

            }


            // ==================================
            // PREVENT DUPLICATE INSPECTION
            // ==================================

            const duplicateInspection =
                inspections.some(
                    function (inspection) {

                        return (
                            inspection.purchaseId ===
                                purchaseId &&
                            inspection.id !==
                                editingInspectionId
                        );

                    }
                );


            if (duplicateInspection) {

                showToast(
                    "This purchase already has a quality inspection.",
                    "error"
                );

                return;

            }


            // ==================================
            // UPDATE
            // ==================================

            if (
                editingInspectionId !== null
            ) {

                const index =
                    inspections.findIndex(
                        function (inspection) {

                            return (
                                inspection.id ===
                                editingInspectionId
                            );

                        }
                    );


                if (index !== -1) {

                    const oldInspection =
                        inspections[index];


                    inspections[index] = {

                        id:
                            oldInspection.id,

                        inspectionId:
                            oldInspection.inspectionId,

                        purchaseId:
                            purchaseId,

                        supplierName:
                            supplierName,

                        moisture:
                            moisture,

                        impurity:
                            impurity,

                        brokenPaddy:
                            brokenPaddy,

                        grade:
                            grade,

                        decision:
                            decision,

                        date:
                            oldInspection.date

                    };

                }


                saveInspections();

                displayInspections();

                updateSummaryCards();

                resetQualityForm();


                showToast(
                    "Inspection updated successfully!"
                );

                return;

            }


            // ==================================
            // NEW INSPECTION
            // ==================================

            const newInspection = {

                id:
                    Date.now(),

                inspectionId:
                    generateInspectionId(),

                purchaseId:
                    purchaseId,

                supplierName:
                    supplierName,

                moisture:
                    moisture,

                impurity:
                    impurity,

                brokenPaddy:
                    brokenPaddy,

                grade:
                    grade,

                decision:
                    decision,

                date:
                    getTodayDate()

            };


            inspections.push(
                newInspection
            );


            saveInspections();

            displayInspections();

            updateSummaryCards();

            resetQualityForm();


            showToast(
                "Inspection saved successfully!"
            );

        }
    );


    // ==========================================
    // TABLE BUTTON EVENTS
    // ==========================================

    qualityTableBody.addEventListener(
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

                editInspection(id);

            }


            if (
                button.dataset.action ===
                "delete"
            ) {

                deleteInspection(id);

            }

        }
    );


    // ==========================================
    // EDIT
    // ==========================================

    function editInspection(id) {

        const inspection =
            inspections.find(
                function (item) {

                    return (
                        item.id === id
                    );

                }
            );


        if (!inspection) {

            showToast(
                "Inspection record not found.",
                "error"
            );

            return;

        }


        // ======================================
        // Historical purchase may be deleted
        // ======================================

        const optionExists =
            Array.from(
                purchaseSelect.options
            ).some(
                function (option) {

                    return (
                        option.value ===
                        inspection.purchaseId
                    );

                }
            );


        if (!optionExists) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                inspection.purchaseId;


            option.textContent =
                inspection.purchaseId +
                " — " +
                inspection.supplierName;


            purchaseSelect.appendChild(
                option
            );

        }


        purchaseSelect.value =
            inspection.purchaseId;


        supplierNameInput.value =
            inspection.supplierName;


        moistureInput.value =
            inspection.moisture;


        impurityInput.value =
            inspection.impurity;


        brokenPaddyInput.value =
            inspection.brokenPaddy;


        gradeSelect.value =
            inspection.grade;


        decisionSelect.value =
            inspection.decision;


        editingInspectionId =
            inspection.id;


        saveInspectionBtn.innerHTML = `

            <span aria-hidden="true">
                ▣
            </span>

            Update Inspection

        `;


        purchaseSelect.focus();


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }


    // ==========================================
    // DELETE
    // ==========================================

    function deleteInspection(id) {

        const exists =
            inspections.some(
                function (inspection) {

                    return (
                        inspection.id === id
                    );

                }
            );


        if (!exists) {

            showToast(
                "Inspection record not found.",
                "error"
            );

            return;

        }


        inspections =
            inspections.filter(
                function (inspection) {

                    return (
                        inspection.id !== id
                    );

                }
            );


        saveInspections();

        displayInspections();

        updateSummaryCards();


        if (
            editingInspectionId === id
        ) {

            resetQualityForm();

        }


        showToast(
            "Inspection deleted successfully!"
        );

    }


    // ==========================================
    // RESET
    // ==========================================

    function resetQualityForm() {

        qualityForm.reset();


        supplierNameInput.value =
            "";


        moistureInput.value =
            "";


        editingInspectionId =
            null;


        saveInspectionBtn.innerHTML = `

            <span aria-hidden="true">
                ▣
            </span>

            Save Inspection

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

        /* READ ONLY SUPPLIER */

        #supplier-name[readonly] {

            background-color: #f5f8f6;

            cursor: not-allowed;

        }


        /* EDIT BUTTON */

        .quality-edit-button {

            padding: 7px 15px;

            border: 1px solid #15913a;

            border-radius: 6px;

            background-color: #ffffff;

            color: #15913a;

            font-weight: 600;

            cursor: pointer;

        }


        .quality-edit-button:hover {

            background-color: #edf8f0;

        }


        /* DELETE */

        .quality-delete-button {

            margin-left: 6px;

            padding: 7px 15px;

            border: 1px solid #efb8b8;

            border-radius: 6px;

            background-color: #fff5f5;

            color: #c62828;

            font-weight: 600;

            cursor: pointer;

        }


        .quality-delete-button:hover {

            background-color: #fdeaea;

        }


        /* REJECTED STATUS */

        .quality-status-rejected {

            background-color: #fdeaea;

            color: #c62828;

            border: 1px solid #efb8b8;

        }


        /* TOAST */

        .quality-toast {

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


        .quality-toast.show {

            opacity: 1;

            transform: translateX(0);

        }


        .quality-toast .toast-icon {

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


        .quality-toast.error {

            border-left-color: #d32f2f;

            color: #8f1d1d;

        }


        .quality-toast.error .toast-icon {

            background-color: #fdeaea;

            color: #d32f2f;

        }

    `;


    document.head.appendChild(
        style
    );

    
    // INITIAL LOAD
    
    loadPurchaseDropdown();

    displayInspections();

    updateSummaryCards();

});