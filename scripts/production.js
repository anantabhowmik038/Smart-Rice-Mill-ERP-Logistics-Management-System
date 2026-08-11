document.addEventListener("DOMContentLoaded", function () {

    // ELEMENTS
    
    const productionForm =
        document.getElementById("productionForm");

    const acceptedBatchSelect =
        document.getElementById("accepted-batch");

    const supplierInput =
        document.getElementById("production-supplier");

    const inputPaddyInput =
        document.getElementById("input-paddy");

    const riceProducedInput =
        document.getElementById("rice-produced");

    const khudProducedInput =
        document.getElementById("khud-produced");

    const tushProducedInput =
        document.getElementById("tush-produced");

    const wasteInput =
        document.getElementById("waste");

    const productionDateInput =
        document.getElementById("production-date");

    const productionBalanceText =
        document.getElementById("productionBalanceText");

    const saveProductionBtn =
        document.getElementById("saveProductionBtn");

    const productionTableBody =
        document.getElementById("productionTableBody");


    // Summary Cards

    const totalInputPaddyValue =
        document.getElementById("totalInputPaddyValue");

    const totalRiceProducedValue =
        document.getElementById("totalRiceProducedValue");

    const wastePercentageValue =
        document.getElementById("wastePercentageValue");

    // EDIT MODE

    let editingProductionId = null;

    // GET PURCHASES

    function getPurchases() {

        return (
            JSON.parse(
                localStorage.getItem("purchases")
            ) || []
        );

    }

    // GET QUALITY INSPECTIONS
    

    function getQualityInspections() {

        return (
            JSON.parse(
                localStorage.getItem("qualityInspections")
            ) || []
        );

    }

    // LOAD PRODUCTIONS

    const storedProductions =
        localStorage.getItem("productions");


    let productions;


    if (storedProductions === null) {

        productions = [];

        saveProductions();

    } else {

        productions =
            JSON.parse(storedProductions) || [];

    }

    // MIGRATE OLD RECORDS


    let productionDataUpdated = false;


    productions =
        productions.map(
            function (production, index) {

                if (
                    production.id === undefined ||
                    production.id === null
                ) {

                    production.id =
                        Date.now() + index;

                    productionDataUpdated = true;

                }


                if (!production.batchId) {

                    production.batchId =
                        "B-" +
                        (1024 + index);

                    productionDataUpdated = true;

                }


                if (
                    production.totalOutput === undefined
                ) {

                    production.totalOutput =
                        Number(production.riceProduced || 0) +
                        Number(production.khudProduced || 0) +
                        Number(production.tushProduced || 0) +
                        Number(production.waste || 0);

                    productionDataUpdated = true;

                }


                return production;

            }
        );


    if (productionDataUpdated) {

        saveProductions();

    }

    // SAVE PRODUCTIONS
    
    function saveProductions() {

        localStorage.setItem(
            "productions",
            JSON.stringify(productions)
        );

    }

    // SAFE TEXT


    function escapeHTML(value) {

        const element =
            document.createElement("div");

        element.textContent =
            String(value);

        return element.innerHTML;

    }

    // TODAY

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

    // DATE FORMAT


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


    // GENERATE PRODUCTION BATCH ID

    function generateBatchId() {

        let highestNumber = 1023;


        productions.forEach(
            function (production) {

                if (!production.batchId) {

                    return;

                }


                const batchNumber =
                    Number(
                        production.batchId
                            .replace(
                                "B-",
                                ""
                            )
                    );


                if (
                    !isNaN(batchNumber) &&
                    batchNumber > highestNumber
                ) {

                    highestNumber =
                        batchNumber;

                }

            }
        );


        return (
            "B-" +
            (highestNumber + 1)
        );

    }

    // LOAD ACCEPTED QUALITY BATCHES

    function loadAcceptedBatches() {

        const inspections =
            getQualityInspections();


        const purchases =
            getPurchases();


        acceptedBatchSelect.innerHTML = `

            <option value=""
                    selected
                    disabled>

                Select accepted batch

            </option>

        `;


        const acceptedInspections =
            inspections.filter(
                function (inspection) {

                    return (
                        inspection.decision ===
                        "accepted"
                    );

                }
            );


        acceptedInspections.forEach(
            function (inspection) {

                const purchase =
                    purchases.find(
                        function (purchase) {

                            return (
                                purchase.purchaseId ===
                                inspection.purchaseId
                            );

                        }
                    );


                if (!purchase) {

                    return;

                }


                // Prevent same accepted purchase
                // from being produced twice.

                const alreadyProduced =
                    productions.some(
                        function (production) {

                            return (
                                production.purchaseId ===
                                    inspection.purchaseId &&
                                production.id !==
                                    editingProductionId
                            );

                        }
                    );


                if (alreadyProduced) {

                    return;

                }


                const option =
                    document.createElement("option");


                option.value =
                    inspection.purchaseId;


                option.textContent =
                    inspection.purchaseId +
                    " — " +
                    inspection.supplierName +
                    " — Grade " +
                    inspection.grade;


                acceptedBatchSelect.appendChild(
                    option
                );

            }
        );


        if (
            acceptedBatchSelect.options.length === 1
        ) {

            const option =
                document.createElement("option");


            option.disabled = true;


            option.textContent =
                "No accepted batch available";


            acceptedBatchSelect.appendChild(
                option
            );

        }

    }

    // SELECT ACCEPTED BATCH

    acceptedBatchSelect.addEventListener(
        "change",
        function () {

            loadSelectedAcceptedBatch();

        }
    );


    function loadSelectedAcceptedBatch() {

        const purchaseId =
            acceptedBatchSelect.value;


        const purchases =
            getPurchases();


        const inspections =
            getQualityInspections();


        const purchase =
            purchases.find(
                function (purchase) {

                    return (
                        purchase.purchaseId ===
                        purchaseId
                    );

                }
            );


        const inspection =
            inspections.find(
                function (inspection) {

                    return (
                        inspection.purchaseId ===
                            purchaseId &&
                        inspection.decision ===
                            "accepted"
                    );

                }
            );


        if (
            !purchase ||
            !inspection
        ) {

            supplierInput.value = "";

            inputPaddyInput.value = "";

            return;

        }


        supplierInput.value =
            purchase.supplierName;


        inputPaddyInput.value =
            purchase.weight;


        updateProductionBalance();

    }

    // PRODUCTION BALANCE PREVIEW

    function updateProductionBalance() {

        const inputPaddy =
            Number(
                inputPaddyInput.value || 0
            );


        const rice =
            Number(
                riceProducedInput.value || 0
            );


        const khud =
            Number(
                khudProducedInput.value || 0
            );


        const tush =
            Number(
                tushProducedInput.value || 0
            );


        const waste =
            Number(
                wasteInput.value || 0
            );


        const totalOutput =
            rice +
            khud +
            tush +
            waste;


        if (inputPaddy <= 0) {

            productionBalanceText.textContent =
                "";

            return;

        }


        const remaining =
            inputPaddy -
            totalOutput;


        if (totalOutput > inputPaddy) {

            productionBalanceText.textContent =
                "Output exceeds input paddy by " +
                Math.abs(remaining).toFixed(2) +
                " kg";


            productionBalanceText.className =
                "production-balance-error";


            return;

        }


        productionBalanceText.textContent =
            "Total Output: " +
            totalOutput.toFixed(2) +
            " kg | Remaining/Loss: " +
            remaining.toFixed(2) +
            " kg";


        productionBalanceText.className =
            "production-balance-success";

    }


    riceProducedInput.addEventListener(
        "input",
        updateProductionBalance
    );


    khudProducedInput.addEventListener(
        "input",
        updateProductionBalance
    );


    tushProducedInput.addEventListener(
        "input",
        updateProductionBalance
    );


    wasteInput.addEventListener(
        "input",
        updateProductionBalance
    );


    // SUMMARY CARDS

    function updateSummaryCards() {

        let totalInputPaddy = 0;

        let totalRiceProduced = 0;

        let totalWaste = 0;


        productions.forEach(
            function (production) {

                totalInputPaddy +=
                    Number(
                        production.inputPaddy || 0
                    );


                totalRiceProduced +=
                    Number(
                        production.riceProduced || 0
                    );


                totalWaste +=
                    Number(
                        production.waste || 0
                    );

            }
        );


        let wastePercentage = 0;


        if (totalInputPaddy > 0) {

            wastePercentage =
                (
                    totalWaste /
                    totalInputPaddy
                ) * 100;

        }


        totalInputPaddyValue.textContent =
            totalInputPaddy.toLocaleString(
                "en-US",
                {
                    maximumFractionDigits: 2
                }
            ) +
            " kg";


        totalRiceProducedValue.textContent =
            totalRiceProduced.toLocaleString(
                "en-US",
                {
                    maximumFractionDigits: 2
                }
            ) +
            " kg";


        wastePercentageValue.textContent =
            wastePercentage
                .toFixed(1)
                .replace(".0", "") +
            "%";

    }

    // TOAST

    function showToast(
        message,
        type = "success"
    ) {

        const oldToast =
            document.querySelector(
                ".production-toast"
            );


        if (oldToast) {

            oldToast.remove();

        }


        const toast =
            document.createElement("div");


        toast.className =
            "production-toast " + type;


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

    // DISPLAY PRODUCTION TABLE
   

    function displayProductions() {

        productionTableBody.innerHTML =
            "";


        productions.forEach(
            function (production) {

                const byProducts =
                    Number(
                        production.khudProduced || 0
                    ) +
                    Number(
                        production.tushProduced || 0
                    ) +
                    Number(
                        production.waste || 0
                    );


                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>

                        ${escapeHTML(
                            production.batchId
                        )}

                    </td>


                    <td>

                        ${Number(
                            production.inputPaddy
                        ).toLocaleString(
                            "en-US"
                        )} kg

                    </td>


                    <td>

                        ${Number(
                            production.riceProduced
                        ).toLocaleString(
                            "en-US"
                        )} kg

                    </td>


                    <td>

                        ${byProducts.toLocaleString(
                            "en-US",
                            {
                                maximumFractionDigits: 2
                            }
                        )} kg

                    </td>


                    <td>

                        ${formatDate(
                            production.date
                        )}

                    </td>


                    <td>

                        <button
                            class="production-edit-button"
                            type="button"
                            data-action="edit"
                            data-id="${production.id}"
                        >

                            Edit

                        </button>


                        <button
                            class="production-delete-button"
                            type="button"
                            data-action="delete"
                            data-id="${production.id}"
                        >

                            Delete

                        </button>

                    </td>

                `;


                productionTableBody.appendChild(
                    row
                );

            }
        );

    }

    // SAVE / UPDATE PRODUCTION
    

    productionForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const purchaseId =
                acceptedBatchSelect.value;


            if (!purchaseId) {

                showToast(
                    "Please select an accepted quality batch.",
                    "error"
                );

                return;

            }


            const purchases =
                getPurchases();


            const inspections =
                getQualityInspections();


            const purchase =
                purchases.find(
                    function (purchase) {

                        return (
                            purchase.purchaseId ===
                            purchaseId
                        );

                    }
                );


            const inspection =
                inspections.find(
                    function (inspection) {

                        return (
                            inspection.purchaseId ===
                                purchaseId &&
                            inspection.decision ===
                                "accepted"
                        );

                    }
                );


            if (
                !purchase ||
                !inspection
            ) {

                showToast(
                    "Accepted purchase information was not found.",
                    "error"
                );

                return;

            }


            const inputPaddy =
                Number(
                    inputPaddyInput.value
                );


            const riceProduced =
                Number(
                    riceProducedInput.value
                );


            const khudProduced =
                Number(
                    khudProducedInput.value
                );


            const tushProduced =
                Number(
                    tushProducedInput.value
                );


            const waste =
                Number(
                    wasteInput.value
                );


            const productionDate =
                productionDateInput.value;


            
            // VALIDATION
           

            if (
                riceProducedInput.value === "" ||
                riceProduced < 0
            ) {

                showToast(
                    "Please enter a valid rice quantity.",
                    "error"
                );

                return;

            }


            if (
                khudProducedInput.value === "" ||
                khudProduced < 0
            ) {

                showToast(
                    "Please enter a valid khud quantity.",
                    "error"
                );

                return;

            }


            if (
                tushProducedInput.value === "" ||
                tushProduced < 0
            ) {

                showToast(
                    "Please enter a valid tush quantity.",
                    "error"
                );

                return;

            }


            if (
                wasteInput.value === "" ||
                waste < 0
            ) {

                showToast(
                    "Please enter a valid waste quantity.",
                    "error"
                );

                return;

            }


            if (!productionDate) {

                showToast(
                    "Please select production date.",
                    "error"
                );

                return;

            }


            const totalOutput =
                riceProduced +
                khudProduced +
                tushProduced +
                waste;


            if (
                totalOutput >
                inputPaddy
            ) {

                showToast(
                    "Total production output cannot exceed input paddy.",
                    "error"
                );

                return;

            }

            // DUPLICATE PRODUCTION

            const duplicateProduction =
                productions.some(
                    function (production) {

                        return (
                            production.purchaseId ===
                                purchaseId &&
                            production.id !==
                                editingProductionId
                        );

                    }
                );


            if (duplicateProduction) {

                showToast(
                    "Production already exists for this accepted batch.",
                    "error"
                );

                return;

            }

            // UPDATE

            if (
                editingProductionId !== null
            ) {

                const index =
                    productions.findIndex(
                        function (production) {

                            return (
                                production.id ===
                                editingProductionId
                            );

                        }
                    );


                if (index !== -1) {

                    const oldProduction =
                        productions[index];


                    productions[index] = {

                        id:
                            oldProduction.id,

                        batchId:
                            oldProduction.batchId,

                        purchaseId:
                            purchaseId,

                        inspectionId:
                            inspection.inspectionId,

                        supplierName:
                            purchase.supplierName,

                        inputPaddy:
                            inputPaddy,

                        riceProduced:
                            riceProduced,

                        khudProduced:
                            khudProduced,

                        tushProduced:
                            tushProduced,

                        waste:
                            waste,

                        totalOutput:
                            totalOutput,

                        date:
                            productionDate

                    };

                }


                saveProductions();

                displayProductions();

                updateSummaryCards();

                resetProductionForm();


                showToast(
                    "Production updated successfully!"
                );

                return;

            }

            // NEW PRODUCTION
            
            const newProduction = {

                id:
                    Date.now(),

                batchId:
                    generateBatchId(),

                purchaseId:
                    purchaseId,

                inspectionId:
                    inspection.inspectionId,

                supplierName:
                    purchase.supplierName,

                inputPaddy:
                    inputPaddy,

                riceProduced:
                    riceProduced,

                khudProduced:
                    khudProduced,

                tushProduced:
                    tushProduced,

                waste:
                    waste,

                totalOutput:
                    totalOutput,

                date:
                    productionDate

            };


            productions.push(
                newProduction
            );


            saveProductions();

            displayProductions();

            updateSummaryCards();

            resetProductionForm();


            showToast(
                "Production saved successfully!"
            );

        }
    );


    
    // TABLE EVENTS
    

    productionTableBody.addEventListener(
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

                editProduction(id);

            }


            if (
                button.dataset.action ===
                "delete"
            ) {

                deleteProduction(id);

            }

        }
    );


    
    // EDIT PRODUCTION
    

    function editProduction(id) {

        const production =
            productions.find(
                function (production) {

                    return (
                        production.id === id
                    );

                }
            );


        if (!production) {

            showToast(
                "Production record not found.",
                "error"
            );

            return;

        }


        editingProductionId =
            production.id;


        // Reload dropdown so current
        // production batch becomes available.

        loadAcceptedBatches();


        const optionExists =
            Array.from(
                acceptedBatchSelect.options
            ).some(
                function (option) {

                    return (
                        option.value ===
                        production.purchaseId
                    );

                }
            );


        if (!optionExists) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                production.purchaseId;


            option.textContent =
                production.purchaseId +
                " — " +
                production.supplierName;


            acceptedBatchSelect.appendChild(
                option
            );

        }


        acceptedBatchSelect.value =
            production.purchaseId;


        supplierInput.value =
            production.supplierName;


        inputPaddyInput.value =
            production.inputPaddy;


        riceProducedInput.value =
            production.riceProduced;


        khudProducedInput.value =
            production.khudProduced;


        tushProducedInput.value =
            production.tushProduced;


        wasteInput.value =
            production.waste;


        productionDateInput.value =
            production.date;


        saveProductionBtn.innerHTML = `

            <span aria-hidden="true">
                ▣
            </span>

            Update Production

        `;


        updateProductionBalance();


        acceptedBatchSelect.focus();


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }

    // DELETE PRODUCTION
    function deleteProduction(id) {

        const productionExists =
            productions.some(
                function (production) {

                    return (
                        production.id === id
                    );

                }
            );


        if (!productionExists) {

            showToast(
                "Production record not found.",
                "error"
            );

            return;

        }


        productions =
            productions.filter(
                function (production) {

                    return (
                        production.id !== id
                    );

                }
            );


        saveProductions();

        displayProductions();

        updateSummaryCards();


        if (
            editingProductionId === id
        ) {

            resetProductionForm();

        } else {

            loadAcceptedBatches();

        }


        showToast(
            "Production deleted successfully!"
        );

    }

    // RESET FORM

    function resetProductionForm() {

        productionForm.reset();


        editingProductionId = null;


        supplierInput.value = "";

        inputPaddyInput.value = "";


        productionBalanceText.textContent =
            "";


        productionDateInput.value =
            getTodayDate();


        saveProductionBtn.innerHTML = `

            <span aria-hidden="true">
                ▣
            </span>

            Save Production

        `;


        loadAcceptedBatches();

    }

    // EXTRA UI DESIGN

    const style =
        document.createElement("style");


    style.textContent = `

        /* READ ONLY FIELDS */

        #production-supplier[readonly],
        #input-paddy[readonly] {

            background-color: #f5f8f6;

            cursor: not-allowed;

        }


        /* PRODUCTION BALANCE */

        #productionBalanceText {

            display: block;

            margin-top: 7px;

            font-size: 12px;

            font-weight: 600;

        }


        .production-balance-success {

            color: #15913a;

        }


        .production-balance-error {

            color: #c62828;

        }


        /* EDIT BUTTON */

        .production-edit-button {

            padding: 7px 15px;

            border: 1px solid #15913a;

            border-radius: 6px;

            background-color: #ffffff;

            color: #15913a;

            font-weight: 600;

            cursor: pointer;

        }


        .production-edit-button:hover {

            background-color: #edf8f0;

        }


        /* DELETE BUTTON */

        .production-delete-button {

            margin-left: 6px;

            padding: 7px 15px;

            border: 1px solid #efb8b8;

            border-radius: 6px;

            background-color: #fff5f5;

            color: #c62828;

            font-weight: 600;

            cursor: pointer;

        }


        .production-delete-button:hover {

            background-color: #fdeaea;

        }


        /* TOAST */

        .production-toast {

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


        .production-toast.show {

            opacity: 1;

            transform: translateX(0);

        }


        .production-toast .toast-icon {

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


        .production-toast.error {

            border-left-color: #d32f2f;

            color: #8f1d1d;

        }


        .production-toast.error .toast-icon {

            background-color: #fdeaea;

            color: #d32f2f;

        }

    `;


    document.head.appendChild(
        style
    );


  
    // INITIAL LOAD
    

    productionDateInput.value =
        getTodayDate();


    loadAcceptedBatches();

    displayProductions();

    updateSummaryCards();

});