document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       SMART RICE MILL ERP
       QUALITY INSPECTION
    ========================================= */


    /* =========================================
       ELEMENTS
    ========================================= */

    const qualityForm =
        document.getElementById("qualityForm");

    if (!qualityForm) {
        return;
    }


    const purchaseIdSelect =
        document.getElementById("purchaseId");

    const supplierNameInput =
        document.getElementById("supplierName");

    const purchaseMoistureInput =
        document.getElementById("purchaseMoisture");

    const inspectionMoistureInput =
        document.getElementById("inspectionMoisture");

    const impurityInput =
        document.getElementById("impurity");

    const brokenPaddyInput =
        document.getElementById("brokenPaddy");

    const gradeSelect =
        document.getElementById("grade");

    const decisionSelect =
        document.getElementById("decision");

    const inspectionDateInput =
        document.getElementById("inspectionDate");

    const inspectionNotesInput =
        document.getElementById("inspectionNotes");


    const inspectionFormTitle =
        document.getElementById("inspectionFormTitle");

    const saveInspectionBtn =
        document.getElementById("saveInspectionBtn");

    const cancelInspectionEditBtn =
        document.getElementById("cancelInspectionEditBtn");


    const acceptedCountValue =
        document.getElementById("acceptedCountValue");

    const reviewCountValue =
        document.getElementById("reviewCountValue");

    const rejectedCountValue =
        document.getElementById("rejectedCountValue");

    const averageMoistureValue =
        document.getElementById("averageMoistureValue");


    const qualitySearch =
        document.getElementById("qualitySearch");

    const decisionFilter =
        document.getElementById("decisionFilter");

    const qualityTableBody =
        document.getElementById("qualityTableBody");


    const menuButton =
        document.getElementById("menuButton");

    const sidebar =
        document.getElementById("sidebar");

    const sidebarBackdrop =
        document.getElementById("sidebarBackdrop");


    /* =========================================
       STATE
    ========================================= */

    let editingInspectionId =
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
            ).padStart(2, "0");

        const day =
            String(
                today.getDate()
            ).padStart(2, "0");

        return `${year}-${month}-${day}`;

    }


    /* =========================================
       SAFE HTML
    ========================================= */

    function escapeHTML(value) {

        const element =
            document.createElement("div");

        element.textContent =
            String(value ?? "");

        return element.innerHTML;

    }


    /* =========================================
       NUMBER FORMAT
    ========================================= */

    function formatNumber(value) {

        return Number(
            value || 0
        ).toLocaleString(
            "en-US",
            {
                maximumFractionDigits: 2
            }
        );

    }


    /* =========================================
       DATE FORMAT
    ========================================= */

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


    /* =========================================
       PURCHASE DATA
    ========================================= */

    function getPurchases() {

        try {

            return (
                JSON.parse(
                    localStorage.getItem("purchases")
                ) || []
            );

        }
        catch {

            return [];

        }

    }


    /* =========================================
       DEFAULT / LEGACY INSPECTIONS
    ========================================= */

    const defaultInspections = [

        {
            id: 1,

            purchaseId:
                "P-1024",

            supplierName:
                "Rahim Farmer",

            moisture:
                14,

            impurity:
                2,

            brokenPaddy:
                3,

            grade:
                "A",

            decision:
                "accepted",

            inspectionDate:
                "2026-07-01",

            notes:
                ""
        },

        {
            id: 2,

            purchaseId:
                "P-1023",

            supplierName:
                "Karim Supplier",

            moisture:
                18,

            impurity:
                4,

            brokenPaddy:
                6,

            grade:
                "B",

            decision:
                "review",

            inspectionDate:
                "2026-07-01",

            notes:
                ""
        }

    ];


    /* =========================================
       LOAD INSPECTIONS
    ========================================= */

    function loadInspections() {

        const stored =
            localStorage.getItem(
                "qualityInspections"
            );

        let data;


        if (stored === null) {

            data =
                [...defaultInspections];

        }
        else {

            try {

                data =
                    JSON.parse(stored) || [];

            }
            catch {

                data =
                    [...defaultInspections];

            }

        }


        data =
            data.map(
                function (inspection, index) {

                    let decision =
                        String(
                            inspection.decision ||
                            ""
                        ).toLowerCase();


                    if (
                        decision === "under review" ||
                        decision === "pending"
                    ) {

                        decision =
                            "review";

                    }


                    if (
                        ![
                            "accepted",
                            "review",
                            "rejected"
                        ].includes(decision)
                    ) {

                        decision =
                            "review";

                    }


                    return {

                        id:

                            inspection.id ??

                            Date.now() + index,


                        purchaseId:

                            inspection.purchaseId ||
                            `P-${2000 + index}`,


                        supplierName:

                            inspection.supplierName ||
                            inspection.supplier ||
                            "Not Recorded",


                        moisture:

                            Number(
                                inspection.moisture ||
                                0
                            ),


                        impurity:

                            Number(
                                inspection.impurity ||
                                0
                            ),


                        brokenPaddy:

                            Number(
                                inspection.brokenPaddy ||
                                inspection.broken ||
                                0
                            ),


                        grade:

                            String(
                                inspection.grade ||
                                "B"
                            ).toUpperCase(),


                        decision:
                            decision,


                        inspectionDate:

                            inspection.inspectionDate ||
                            inspection.date ||
                            getTodayDate(),


                        notes:

                            inspection.notes ||
                            inspection.inspectionNotes ||
                            ""

                    };

                }
            );


        localStorage.setItem(
            "qualityInspections",
            JSON.stringify(data)
        );


        return data;

    }


    let inspections =
        loadInspections();


    /* =========================================
       SAVE INSPECTIONS
    ========================================= */

    function saveInspections() {

        localStorage.setItem(
            "qualityInspections",
            JSON.stringify(inspections)
        );

    }


    /* =========================================
       FIND PURCHASE
    ========================================= */

    function findPurchase(purchaseId) {

        return getPurchases().find(
            function (purchase) {

                return (
                    String(
                        purchase.purchaseId
                    ) ===
                    String(purchaseId)
                );

            }
        );

    }


    /* =========================================
       LOAD PURCHASE DROPDOWN
    ========================================= */

    function loadPurchaseDropdown(
        selectedPurchaseId = ""
    ) {

        const purchases =
            getPurchases();


        purchaseIdSelect.innerHTML = `

            <option
                value=""
                disabled
            >
                Select purchase ID
            </option>

        `;


        purchases.forEach(
            function (purchase) {

                const alreadyInspected =
                    inspections.some(
                        function (inspection) {

                            return (
                                inspection.purchaseId ===
                                    purchase.purchaseId

                                &&

                                Number(
                                    inspection.id
                                ) !==

                                Number(
                                    editingInspectionId
                                )
                            );

                        }
                    );


                /*
                    Do not offer a purchase that
                    already has an inspection,
                    unless this is the record
                    currently being edited.
                */

                if (
                    alreadyInspected &&
                    purchase.purchaseId !==
                        selectedPurchaseId
                ) {

                    return;

                }


                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    purchase.purchaseId;


                option.textContent =

                    `${purchase.purchaseId} — ${purchase.supplierName}`;


                purchaseIdSelect.appendChild(
                    option
                );

            }
        );


        if (
            purchases.length === 0
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
                "No purchase records available";

            purchaseIdSelect.appendChild(
                option
            );

        }


        purchaseIdSelect.value =
            selectedPurchaseId || "";

    }


    /* =========================================
       LOAD PURCHASE DETAILS
    ========================================= */

    function loadSelectedPurchaseDetails() {

        const purchase =
            findPurchase(
                purchaseIdSelect.value
            );


        if (!purchase) {

            supplierNameInput.value =
                "";

            purchaseMoistureInput.value =
                "";

            if (
                editingInspectionId === null
            ) {

                inspectionMoistureInput.value =
                    "";

            }

            return;

        }


        supplierNameInput.value =
            purchase.supplierName ||
            "";


        const purchaseMoisture =
            Number(
                purchase.moisture || 0
            );


        purchaseMoistureInput.value =
            `${formatNumber(purchaseMoisture)}%`;


        /*
            Auto-fill inspection moisture
            as a starting value.
            User can still change it if the
            inspection reading differs.
        */

        if (
            editingInspectionId === null ||
            !inspectionMoistureInput.value
        ) {

            inspectionMoistureInput.value =
                purchaseMoisture;

        }

    }


    /* =========================================
       SUMMARY CARDS
    ========================================= */

    function updateSummaryCards() {

        const accepted =
            inspections.filter(
                function (inspection) {

                    return (
                        inspection.decision ===
                        "accepted"
                    );

                }
            ).length;


        const review =
            inspections.filter(
                function (inspection) {

                    return (
                        inspection.decision ===
                        "review"
                    );

                }
            ).length;


        const rejected =
            inspections.filter(
                function (inspection) {

                    return (
                        inspection.decision ===
                        "rejected"
                    );

                }
            ).length;


        const moistureValues =
            inspections
                .map(
                    function (inspection) {

                        return Number(
                            inspection.moisture
                        );

                    }
                )
                .filter(
                    function (value) {

                        return Number.isFinite(value);

                    }
                );


        const averageMoisture =

            moistureValues.length > 0

                ?

                moistureValues.reduce(
                    function (sum, value) {

                        return sum + value;

                    },
                    0
                ) /
                moistureValues.length

                :

                0;


        acceptedCountValue.textContent =
            accepted;


        reviewCountValue.textContent =
            review;


        rejectedCountValue.textContent =
            rejected;


        averageMoistureValue.textContent =
            `${formatNumber(averageMoisture)}%`;

    }


    /* =========================================
       DECISION TEXT
    ========================================= */

    function getDecisionText(decision) {

        if (
            decision === "accepted"
        ) {

            return "Accepted";

        }


        if (
            decision === "rejected"
        ) {

            return "Rejected";

        }


        return "Under Review";

    }


    /* =========================================
       DECISION CLASS
    ========================================= */

    function getDecisionClass(decision) {

        if (
            decision === "accepted"
        ) {

            return "decision-accepted";

        }


        if (
            decision === "rejected"
        ) {

            return "decision-rejected";

        }


        return "decision-review";

    }


    /* =========================================
       DISPLAY TABLE
    ========================================= */

    function displayInspections() {

        const searchText =
            qualitySearch.value
                .trim()
                .toLowerCase();


        const filter =
            decisionFilter.value;


        const filtered =
            inspections.filter(
                function (inspection) {

                    const searchable =

                        `${inspection.purchaseId}
                         ${inspection.supplierName}
                         ${inspection.grade}`
                            .toLowerCase();


                    const matchesSearch =
                        searchable.includes(
                            searchText
                        );


                    const matchesDecision =

                        filter === "all" ||

                        inspection.decision ===
                        filter;


                    return (
                        matchesSearch &&
                        matchesDecision
                    );

                }
            );


        qualityTableBody.innerHTML =
            "";


        if (
            filtered.length ===
            0
        ) {

            qualityTableBody.innerHTML = `

                <tr class="quality-empty-row">

                    <td colspan="9">

                        No quality inspection records
                        match the current filter.

                    </td>

                </tr>

            `;


            return;

        }


        [...filtered]

            .sort(
                function (a, b) {

                    return (

                        String(
                            b.inspectionDate
                        ).localeCompare(
                            String(
                                a.inspectionDate
                            )
                        )

                        ||

                        Number(b.id) -
                        Number(a.id)

                    );

                }
            )

            .forEach(
                function (inspection) {

                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `

                        <td>

                            <strong>
                                ${escapeHTML(
                                    inspection.purchaseId
                                )}
                            </strong>

                        </td>


                        <td>

                            ${escapeHTML(
                                inspection.supplierName
                            )}

                        </td>


                        <td>

                            ${formatNumber(
                                inspection.moisture
                            )}%

                        </td>


                        <td>

                            ${formatNumber(
                                inspection.impurity
                            )}%

                        </td>


                        <td>

                            ${formatNumber(
                                inspection.brokenPaddy
                            )}%

                        </td>


                        <td>

                            <span class="grade-badge">

                                ${escapeHTML(
                                    inspection.grade
                                )}

                            </span>

                        </td>


                        <td>

                            <span
                                class="
                                    decision-badge
                                    ${getDecisionClass(
                                        inspection.decision
                                    )}
                                "
                            >

                                ${getDecisionText(
                                    inspection.decision
                                )}

                            </span>

                        </td>


                        <td>

                            ${formatDate(
                                inspection.inspectionDate
                            )}

                        </td>


                        <td class="quality-action-cell">

                            <button
                                type="button"
                                class="quality-edit-button"
                                data-action="edit"
                                data-id="${inspection.id}"
                            >
                                Edit
                            </button>


                            <button
                                type="button"
                                class="quality-delete-button"
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


    /* =========================================
       VALIDATE PERCENTAGE
    ========================================= */

    function isValidPercentage(value) {

        return (
            Number.isFinite(value) &&
            value >= 0 &&
            value <= 100
        );

    }


    /* =========================================
       VALIDATION
    ========================================= */

    function validateForm() {

        if (
            !purchaseIdSelect.value
        ) {

            return (
                "Please select a purchase ID."
            );

        }


        const moisture =
            Number(
                inspectionMoistureInput.value
            );


        const impurity =
            Number(
                impurityInput.value
            );


        const broken =
            Number(
                brokenPaddyInput.value
            );


        if (
            !isValidPercentage(
                moisture
            )
        ) {

            return (
                "Moisture percentage must be between 0 and 100."
            );

        }


        if (
            !isValidPercentage(
                impurity
            )
        ) {

            return (
                "Impurity percentage must be between 0 and 100."
            );

        }


        if (
            !isValidPercentage(
                broken
            )
        ) {

            return (
                "Broken paddy percentage must be between 0 and 100."
            );

        }


        if (
            !gradeSelect.value
        ) {

            return (
                "Please select a quality grade."
            );

        }


        if (
            !decisionSelect.value
        ) {

            return (
                "Please select an inspection decision."
            );

        }


        if (
            !inspectionDateInput.value
        ) {

            return (
                "Please select the inspection date."
            );

        }


        /*
            One inspection per purchase batch.
        */

        const duplicate =
            inspections.some(
                function (inspection) {

                    return (
                        inspection.purchaseId ===
                            purchaseIdSelect.value

                        &&

                        Number(
                            inspection.id
                        ) !==

                        Number(
                            editingInspectionId
                        )
                    );

                }
            );


        if (duplicate) {

            return (
                "This purchase batch already has a quality inspection record."
            );

        }


        return "";

    }


    /* =========================================
       BUILD INSPECTION RECORD
    ========================================= */

    function buildInspectionRecord(
        existingInspection = null
    ) {

        const purchase =
            findPurchase(
                purchaseIdSelect.value
            );


        return {

            id:

                existingInspection

                    ?

                    existingInspection.id

                    :

                    Date.now(),


            purchaseId:
                purchaseIdSelect.value,


            supplierName:

                purchase

                    ?

                    purchase.supplierName

                    :

                    supplierNameInput.value,


            moisture:
                Number(
                    inspectionMoistureInput.value
                ),


            impurity:
                Number(
                    impurityInput.value
                ),


            brokenPaddy:
                Number(
                    brokenPaddyInput.value
                ),


            grade:
                gradeSelect.value,


            decision:
                decisionSelect.value,


            inspectionDate:
                inspectionDateInput.value,


            notes:
                inspectionNotesInput.value
                    .trim()

        };

    }


    /* =========================================
       ADD MODE
    ========================================= */

    function setAddMode() {

        editingInspectionId =
            null;


        inspectionFormTitle.textContent =
            "Record Quality Inspection";


        saveInspectionBtn.innerHTML = `

            <span aria-hidden="true">
                ▣
            </span>

            Save Inspection

        `;


        cancelInspectionEditBtn.hidden =
            true;


        purchaseIdSelect.disabled =
            false;

    }


    /* =========================================
       DEFAULT DATE
    ========================================= */

    function setDefaultDate() {

        if (
            !inspectionDateInput.value
        ) {

            inspectionDateInput.value =
                getTodayDate();

        }

    }


    /* =========================================
       RESET FORM
    ========================================= */

    function resetInspectionForm() {

        qualityForm.reset();


        supplierNameInput.value =
            "";


        purchaseMoistureInput.value =
            "";


        setAddMode();

        setDefaultDate();

        loadPurchaseDropdown();

    }


    /* =========================================
       EDIT
    ========================================= */

    function editInspection(id) {

        const inspection =
            inspections.find(
                function (item) {

                    return (
                        Number(item.id) ===
                        Number(id)
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


        editingInspectionId =
            inspection.id;


        loadPurchaseDropdown(
            inspection.purchaseId
        );


        purchaseIdSelect.value =
            inspection.purchaseId;


        loadSelectedPurchaseDetails();


        supplierNameInput.value =
            inspection.supplierName;


        inspectionMoistureInput.value =
            inspection.moisture;


        impurityInput.value =
            inspection.impurity;


        brokenPaddyInput.value =
            inspection.brokenPaddy;


        gradeSelect.value =
            inspection.grade;


        decisionSelect.value =
            inspection.decision;


        inspectionDateInput.value =
            inspection.inspectionDate;


        inspectionNotesInput.value =
            inspection.notes || "";


        /*
            Purchase relation should not be
            changed while editing.
        */

        purchaseIdSelect.disabled =
            true;


        inspectionFormTitle.textContent =
            "Edit Quality Inspection";


        saveInspectionBtn.innerHTML = `

            <span aria-hidden="true">
                ✓
            </span>

            Update Inspection

        `;


        cancelInspectionEditBtn.hidden =
            false;


        qualityForm.scrollIntoView(
            {
                behavior: "smooth",
                block: "center"
            }
        );

    }


    /* =========================================
       DELETE
    ========================================= */

    function deleteInspection(id) {

        const inspection =
            inspections.find(
                function (item) {

                    return (
                        Number(item.id) ===
                        Number(id)
                    );

                }
            );


        if (!inspection) {
            return;
        }


        const confirmed =
            window.confirm(

                `Delete quality inspection for ${inspection.purchaseId}?`

            );


        if (!confirmed) {
            return;
        }


        inspections =
            inspections.filter(
                function (item) {

                    return (
                        Number(item.id) !==
                        Number(id)
                    );

                }
            );


        saveInspections();

        updateSummaryCards();

        displayInspections();


        if (
            Number(editingInspectionId) ===
            Number(id)
        ) {

            resetInspectionForm();

        }
        else {

            loadPurchaseDropdown();

        }


        showToast(
            "Quality inspection deleted successfully."
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
            `quality-toast ${type}`;


        toast.innerHTML = `

            <span class="quality-toast-icon">

                ${
                    type === "error"
                        ? "!"
                        : "✓"
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
       PURCHASE CHANGE
    ========================================= */

    purchaseIdSelect.addEventListener(
        "change",
        loadSelectedPurchaseDetails
    );


    /* =========================================
       FORM SUBMIT
    ========================================= */

    qualityForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const validationMessage =
                validateForm();


            if (validationMessage) {

                showToast(
                    validationMessage,
                    "error"
                );

                return;

            }


            if (
                editingInspectionId !==
                null
            ) {

                const index =
                    inspections.findIndex(
                        function (inspection) {

                            return (
                                Number(
                                    inspection.id
                                ) ===

                                Number(
                                    editingInspectionId
                                )
                            );

                        }
                    );


                if (
                    index === -1
                ) {

                    showToast(
                        "Inspection record not found.",
                        "error"
                    );

                    return;

                }


                inspections[index] =
                    buildInspectionRecord(
                        inspections[index]
                    );


                showToast(
                    "Quality inspection updated successfully."
                );

            }
            else {

                inspections.push(
                    buildInspectionRecord()
                );


                showToast(
                    "Quality inspection saved successfully."
                );

            }


            saveInspections();

            updateSummaryCards();

            displayInspections();

            resetInspectionForm();

        }
    );


    /* =========================================
       CANCEL EDIT
    ========================================= */

    cancelInspectionEditBtn.addEventListener(
        "click",
        function () {

            resetInspectionForm();

            showToast(
                "Edit cancelled."
            );

        }
    );


    /* =========================================
       SEARCH
    ========================================= */

    qualitySearch.addEventListener(
        "input",
        displayInspections
    );


    decisionFilter.addEventListener(
        "change",
        displayInspections
    );


    /* =========================================
       TABLE ACTIONS
    ========================================= */

    qualityTableBody.addEventListener(
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


            const action =
                button.dataset.action;


            if (
                action === "edit"
            ) {

                editInspection(id);

            }


            if (
                action === "delete"
            ) {

                deleteInspection(id);

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
                event.key === "Escape"
            ) {

                closeSidebar();

            }

        }
    );


    window.addEventListener(
        "resize",
        function () {

            if (
                window.innerWidth > 1000
            ) {

                closeSidebar();

            }

        }
    );


    /* =========================================
       INITIALIZE
    ========================================= */

    setAddMode();

    setDefaultDate();

    loadPurchaseDropdown();

    updateSummaryCards();

    displayInspections();

});