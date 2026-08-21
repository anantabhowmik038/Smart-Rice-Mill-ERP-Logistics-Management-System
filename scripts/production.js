document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       SMART RICE MILL ERP
       PRODUCTION MANAGEMENT

       RESEARCH-BASED YIELD MODEL

       Research baseline:
       Whole Rice  = 64%
       Broken Rice = 6%
       Husk        = 22%
       Bran        = 8%

       IMPORTANT:
       Expected output = planning benchmark.
       Actual production = official ERP record.
    ========================================= */


    /* =========================================
       RESEARCH BASELINE
    ========================================= */

    const RESEARCH_BASELINE = {

        wholeRiceRate: 64,

        khudRate: 6,

        huskRate: 22,

        branRate: 8,

        compactMillRecoveryBenchmark: 65

    };


    /* =========================================
       BRRI MOISTURE BENCHMARKS
    ========================================= */

    const BRRI_MOISTURE_BENCHMARKS = {

        dhan71: [

            {
                moisture: 9.1,
                headRice: 59.0,
                brokenRice: 8.5
            },

            {
                moisture: 10.2,
                headRice: 63.0,
                brokenRice: 5.0
            },

            {
                moisture: 11.3,
                headRice: 62.5,
                brokenRice: 6.1
            },

            {
                moisture: 12.3,
                headRice: 60.0,
                brokenRice: 9.2
            },

            {
                moisture: 13.2,
                headRice: 58.8,
                brokenRice: 11.2
            },

            {
                moisture: 13.9,
                headRice: 56.6,
                brokenRice: 13.3
            }

        ],


        dhan82: [

            {
                moisture: 9.2,
                headRice: 59.0,
                brokenRice: 8.0
            },

            {
                moisture: 10.3,
                headRice: 62.0,
                brokenRice: 5.5
            },

            {
                moisture: 11.2,
                headRice: 61.2,
                brokenRice: 6.8
            },

            {
                moisture: 12.3,
                headRice: 60.3,
                brokenRice: 8.7
            },

            {
                moisture: 13.2,
                headRice: 58.0,
                brokenRice: 12.5
            },

            {
                moisture: 14.1,
                headRice: 55.8,
                brokenRice: 14.7
            }

        ]

    };


    /* =========================================
       ELEMENTS
    ========================================= */

    const productionForm =
        document.getElementById("productionForm");

    if (!productionForm) {
        return;
    }


    const acceptedBatchSelect =
        document.getElementById("acceptedBatch");

    const productionSupplierInput =
        document.getElementById("productionSupplier");

    const productionPaddyTypeInput =
        document.getElementById("productionPaddyType");

    const productionGradeInput =
        document.getElementById("productionGrade");

    const inspectionMoistureInput =
        document.getElementById("inspectionMoisture");

    const inputPaddyInput =
        document.getElementById("inputPaddy");


    const expectedRiceElement =
        document.getElementById("expectedRice");

    const expectedKhudElement =
        document.getElementById("expectedKhud");

    const expectedTushElement =
        document.getElementById("expectedTush");

    const expectedBranElement =
        document.getElementById("expectedBran");

    const yieldModelLabel =
        document.getElementById("yieldModelLabel");

    const moistureGuidance =
        document.getElementById("moistureGuidance");


    const riceProducedInput =
        document.getElementById("riceProduced");

    const khudProducedInput =
        document.getElementById("khudProduced");

    const tushProducedInput =
        document.getElementById("tushProduced");

    const branProducedInput =
        document.getElementById("branProduced");


    const recoveryRateInput =
        document.getElementById("recoveryRate");

    const riceVarianceInput =
        document.getElementById("riceVariance");

    const processLossInput =
        document.getElementById("processLoss");

    const processLossHelp =
        document.getElementById("processLossHelp");


    const productionDateInput =
        document.getElementById("productionDate");

    const productionNotesInput =
        document.getElementById("productionNotes");


    const productionFormTitle =
        document.getElementById("productionFormTitle");

    const saveProductionBtn =
        document.getElementById("saveProductionBtn");

    const cancelProductionEditBtn =
        document.getElementById("cancelProductionEditBtn");


    const todayInputValue =
        document.getElementById("todayInputValue");

    const todayRiceValue =
        document.getElementById("todayRiceValue");

    const averageRecoveryValue =
        document.getElementById("averageRecoveryValue");

    const averageLossValue =
        document.getElementById("averageLossValue");


    const productionSearch =
        document.getElementById("productionSearch");

    const productionTableBody =
        document.getElementById("productionTableBody");


    const menuButton =
        document.getElementById("menuButton");

    const sidebar =
        document.getElementById("sidebar");

    const sidebarBackdrop =
        document.getElementById("sidebarBackdrop");


    /* =========================================
       STATE
    ========================================= */

    let editingProductionId =
        null;


    /*
        Stores which production row is waiting
        for inline delete confirmation.

        This replaces window.confirm().
    */

    let pendingDeleteProductionId =
        null;


    /* =========================================
       TODAY
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
       SIGNED NUMBER
    ========================================= */

    function formatSignedNumber(value) {

        const number =
            Number(
                value || 0
            );


        if (number > 0) {

            return (
                `+${formatNumber(
                    number
                )}`
            );

        }


        return formatNumber(
            number
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
       PURCHASES
    ========================================= */

    function getPurchases() {

        try {

            return (
                JSON.parse(
                    localStorage.getItem(
                        "purchases"
                    )
                ) || []
            );

        }
        catch {

            return [];

        }

    }


    /* =========================================
       QUALITY INSPECTIONS
    ========================================= */

    function getQualityInspections() {

        try {

            return (
                JSON.parse(
                    localStorage.getItem(
                        "qualityInspections"
                    )
                ) || []
            );

        }
        catch {

            return [];

        }

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

                    String(
                        purchaseId
                    )
                );

            }
        );

    }


    /* =========================================
       FIND INSPECTION
    ========================================= */

    function findInspection(purchaseId) {

        return getQualityInspections().find(
            function (inspection) {

                return (
                    String(
                        inspection.purchaseId
                    ) ===

                    String(
                        purchaseId
                    )
                );

            }
        );

    }


    /* =========================================
       EXPECTED OUTPUT
    ========================================= */

    function calculateResearchExpectedOutput(
        inputPaddy
    ) {

        const input =
            Number(
                inputPaddy || 0
            );


        return {

            wholeRice:

                input *
                RESEARCH_BASELINE.wholeRiceRate /
                100,


            khud:

                input *
                RESEARCH_BASELINE.khudRate /
                100,


            tush:

                input *
                RESEARCH_BASELINE.huskRate /
                100,


            bran:

                input *
                RESEARCH_BASELINE.branRate /
                100

        };

    }


    /* =========================================
       IDENTIFY BRRI VARIETY
    ========================================= */

    function identifyBRRIVariety(
        paddyType
    ) {

        const normalized =
            String(
                paddyType || ""
            )
            .toLowerCase()
            .replace(
                /\s+/g,
                ""
            );


        if (
            normalized.includes(
                "dhan71"
            )
        ) {

            return "dhan71";

        }


        if (
            normalized.includes(
                "dhan82"
            )
        ) {

            return "dhan82";

        }


        return null;

    }


    /* =========================================
       NEAREST MOISTURE BENCHMARK
    ========================================= */

    function getNearestBRRIBenchmark(
        variety,
        moisture
    ) {

        const table =
            BRRI_MOISTURE_BENCHMARKS[
                variety
            ];


        if (
            !table ||
            table.length === 0
        ) {

            return null;

        }


        const measuredMoisture =
            Number(
                moisture
            );


        if (
            !Number.isFinite(
                measuredMoisture
            )
        ) {

            return null;

        }


        return table.reduce(
            function (
                nearest,
                current
            ) {

                const currentDifference =
                    Math.abs(
                        current.moisture -
                        measuredMoisture
                    );


                const nearestDifference =
                    Math.abs(
                        nearest.moisture -
                        measuredMoisture
                    );


                return (

                    currentDifference <
                    nearestDifference

                        ?

                        current

                        :

                        nearest

                );

            }
        );

    }


    /* =========================================
       MOISTURE GUIDANCE
    ========================================= */

    function updateMoistureGuidance() {

        const purchase =
            findPurchase(
                acceptedBatchSelect.value
            );


        const inspection =
            findInspection(
                acceptedBatchSelect.value
            );


        moistureGuidance.classList.remove(
            "optimum",
            "warning"
        );


        if (
            !purchase ||
            !inspection
        ) {

            moistureGuidance.textContent =
                "Select an accepted batch to view moisture-related research guidance.";

            return;

        }


        const moisture =
            Number(
                inspection.moisture
            );


        const variety =
            identifyBRRIVariety(
                purchase.paddyType
            );


        if (variety) {

            const benchmark =
                getNearestBRRIBenchmark(
                    variety,
                    moisture
                );


            if (benchmark) {

                const varietyName =

                    variety === "dhan71"

                        ?

                        "BRRI dhan71"

                        :

                        "BRRI dhan82";


                moistureGuidance.textContent =

                    `${varietyName} research benchmark nearest to ${formatNumber(
                        moisture
                    )}% moisture: ${formatNumber(
                        benchmark.moisture
                    )}% tested moisture produced ${formatNumber(
                        benchmark.headRice
                    )}% head rice and ${formatNumber(
                        benchmark.brokenRice
                    )}% broken rice.`;


                if (
                    moisture >= 10 &&
                    moisture <= 11.3
                ) {

                    moistureGuidance.classList.add(
                        "optimum"
                    );

                }
                else {

                    moistureGuidance.classList.add(
                        "warning"
                    );

                }


                return;

            }

        }


        if (
            Number.isFinite(
                moisture
            ) &&
            moisture >= 10 &&
            moisture <= 11.3
        ) {

            moistureGuidance.textContent =

                `${formatNumber(
                    moisture
                )}% moisture is within the high head-rice recovery zone reported in BRRI experiments on dhan71 and dhan82. This is research guidance only; the selected paddy variety may behave differently.`;


            moistureGuidance.classList.add(
                "optimum"
            );

        }
        else {

            moistureGuidance.textContent =

                `${formatNumber(
                    moisture
                )}% moisture is outside the approximately 10–11.3% high head-rice recovery zone reported for BRRI dhan71/dhan82. Variety and milling conditions can change actual recovery.`;


            moistureGuidance.classList.add(
                "warning"
            );

        }

    }


    /* =========================================
       EXPECTED OUTPUT UI
    ========================================= */

    function updateExpectedOutput() {

        const inputPaddy =
            getInputPaddyQuantity();


        const expected =
            calculateResearchExpectedOutput(
                inputPaddy
            );


        expectedRiceElement.textContent =
            `${formatNumber(
                expected.wholeRice
            )} kg`;


        expectedKhudElement.textContent =
            `${formatNumber(
                expected.khud
            )} kg`;


        expectedTushElement.textContent =
            `${formatNumber(
                expected.tush
            )} kg`;


        expectedBranElement.textContent =
            `${formatNumber(
                expected.bran
            )} kg`;


        if (
            inputPaddy > 0
        ) {

            yieldModelLabel.textContent =

                `Bangladesh semi-automatic mill baseline: 64% whole rice, 6% broken rice, 22% husk and 8% bran.`;

        }
        else {

            yieldModelLabel.textContent =
                "Bangladesh semi-automatic rice mill baseline";

        }


        updateMoistureGuidance();


        return expected;

    }


    /* =========================================
       LOAD PRODUCTION RECORDS
    ========================================= */

    function loadProductionRecords() {

        let stored =
            localStorage.getItem(
                "productionRecords"
            );


        if (stored === null) {

            stored =
                localStorage.getItem(
                    "productions"
                );

        }


        let data;


        if (stored === null) {

            data = [];

        }
        else {

            try {

                data =
                    JSON.parse(
                        stored
                    ) || [];

            }
            catch {

                data = [];

            }

        }


        data =
            data.map(
                function (
                    record,
                    index
                ) {

                    const inputPaddy =
                        Number(
                            record.inputPaddy ||
                            record.paddyInput ||
                            0
                        );


                    const riceProduced =
                        Number(
                            record.riceProduced ||
                            record.rice ||
                            0
                        );


                    const khudProduced =
                        Number(
                            record.khudProduced ||
                            record.khud ||
                            record.brokenRice ||
                            0
                        );


                    const tushProduced =
                        Number(
                            record.tushProduced ||
                            record.tush ||
                            record.husk ||
                            0
                        );


                    const branProduced =
                        Number(
                            record.branProduced ||
                            record.bran ||
                            0
                        );


                    const totalRecordedOutput =

                        riceProduced +
                        khudProduced +
                        tushProduced +
                        branProduced;


                    const processLoss =
                        Math.max(
                            inputPaddy -
                            totalRecordedOutput,
                            0
                        );


                    const recoveryRate =

                        inputPaddy > 0

                            ?

                            (
                                riceProduced /
                                inputPaddy
                            ) * 100

                            :

                            0;


                    const lossRate =

                        inputPaddy > 0

                            ?

                            (
                                processLoss /
                                inputPaddy
                            ) * 100

                            :

                            0;


                    const expected =
                        calculateResearchExpectedOutput(
                            inputPaddy
                        );


                    const riceVariance =
                        riceProduced -
                        expected.wholeRice;


                    return {

                        id:

                            record.id ??

                            Date.now() +
                            index,


                        batchId:

                            record.batchId ||
                            record.batch ||

                            `PROD-${String(
                                index + 1
                            ).padStart(
                                3,
                                "0"
                            )}`,


                        purchaseId:

                            record.purchaseId ||
                            record.qualityBatch ||
                            "",


                        supplierName:

                            record.supplierName ||
                            record.supplier ||
                            "Not Recorded",


                        paddyType:

                            record.paddyType ||
                            "Not Recorded",


                        qualityGrade:

                            record.qualityGrade ||
                            record.grade ||
                            "—",


                        inspectionMoisture:

                            Number(
                                record.inspectionMoisture ||
                                record.moisture ||
                                0
                            ),


                        inputPaddy:
                            inputPaddy,


                        riceProduced:
                            riceProduced,


                        khudProduced:
                            khudProduced,


                        tushProduced:
                            tushProduced,


                        branProduced:
                            branProduced,


                        expectedRice:

                            Number(
                                record.expectedRice ??
                                expected.wholeRice
                            ),


                        expectedKhud:

                            Number(
                                record.expectedKhud ??
                                expected.khud
                            ),


                        expectedTush:

                            Number(
                                record.expectedTush ??
                                expected.tush
                            ),


                        expectedBran:

                            Number(
                                record.expectedBran ??
                                expected.bran
                            ),


                        riceVariance:

                            Number(
                                record.riceVariance ??
                                riceVariance
                            ),


                        processLoss:
                            processLoss,


                        recoveryRate:
                            recoveryRate,


                        lossRate:
                            lossRate,


                        productionDate:

                            record.productionDate ||
                            record.date ||
                            getTodayDate(),


                        notes:

                            record.notes ||
                            "",


                        createdAt:

                            record.createdAt ||
                            record.id ||
                            Date.now()

                    };

                }
            );


        localStorage.setItem(
            "productionRecords",
            JSON.stringify(
                data
            )
        );


        return data;

    }


    let productionRecords =
        loadProductionRecords();


    /* =========================================
       SAVE PRODUCTION RECORDS
    ========================================= */

    function saveProductionRecords() {

        localStorage.setItem(
            "productionRecords",
            JSON.stringify(
                productionRecords
            )
        );

    }


    /* =========================================
       ACCEPTED QUALITY BATCHES
    ========================================= */

    function getAcceptedQualityBatches() {

        return getQualityInspections()

            .filter(
                function (inspection) {

                    return (
                        inspection.decision ===
                        "accepted"
                    );

                }
            )

            .filter(
                function (inspection) {

                    return Boolean(
                        findPurchase(
                            inspection.purchaseId
                        )
                    );

                }
            );

    }


    /* =========================================
       LOAD ACCEPTED BATCH DROPDOWN
    ========================================= */

    function loadAcceptedBatchDropdown(
        selectedPurchaseId = ""
    ) {

        const acceptedInspections =
            getAcceptedQualityBatches();


        acceptedBatchSelect.innerHTML = `

            <option
                value=""
                disabled
                selected
            >
                Select accepted batch
            </option>

        `;


        acceptedInspections.forEach(
            function (inspection) {

                const alreadyProduced =
                    productionRecords.some(
                        function (record) {

                            return (

                                record.purchaseId ===
                                inspection.purchaseId

                                &&

                                Number(
                                    record.id
                                ) !==

                                Number(
                                    editingProductionId
                                )

                            );

                        }
                    );


                if (
                    alreadyProduced &&
                    inspection.purchaseId !==
                    selectedPurchaseId
                ) {

                    return;

                }


                const purchase =
                    findPurchase(
                        inspection.purchaseId
                    );


                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    inspection.purchaseId;


                option.textContent =

                    `${inspection.purchaseId} — ${purchase.supplierName} — Grade ${inspection.grade}`;


                acceptedBatchSelect.appendChild(
                    option
                );

            }
        );


        acceptedBatchSelect.value =
            selectedPurchaseId || "";

    }


    /* =========================================
       LOAD SELECTED BATCH DETAILS
    ========================================= */

    function loadSelectedBatchDetails() {

        const purchase =
            findPurchase(
                acceptedBatchSelect.value
            );


        const inspection =
            findInspection(
                acceptedBatchSelect.value
            );


        if (
            !purchase ||
            !inspection
        ) {

            productionSupplierInput.value =
                "";

            productionPaddyTypeInput.value =
                "";

            productionGradeInput.value =
                "";

            inspectionMoistureInput.value =
                "";

            inputPaddyInput.value =
                "";


            updateExpectedOutput();

            calculateActualProduction();

            return;

        }


        productionSupplierInput.value =
            purchase.supplierName ||
            "";


        productionPaddyTypeInput.value =
            purchase.paddyType ||
            "Not Recorded";


        productionGradeInput.value =
            `Grade ${inspection.grade || "—"}`;


        inspectionMoistureInput.value =
            `${formatNumber(
                inspection.moisture
            )}%`;


        inputPaddyInput.value =
            `${formatNumber(
                purchase.weight
            )} kg`;


        updateExpectedOutput();

        calculateActualProduction();

    }


    /* =========================================
       INPUT PADDY
    ========================================= */

    function getInputPaddyQuantity() {

        const purchase =
            findPurchase(
                acceptedBatchSelect.value
            );


        return Number(
            purchase?.weight ||
            0
        );

    }


    /* =========================================
       ACTUAL PRODUCTION CALCULATION
    ========================================= */

    function calculateActualProduction() {

        const inputPaddy =
            getInputPaddyQuantity();


        const rice =
            Math.max(
                Number(
                    riceProducedInput.value ||
                    0
                ),
                0
            );


        const khud =
            Math.max(
                Number(
                    khudProducedInput.value ||
                    0
                ),
                0
            );


        const tush =
            Math.max(
                Number(
                    tushProducedInput.value ||
                    0
                ),
                0
            );


        const bran =
            Math.max(
                Number(
                    branProducedInput.value ||
                    0
                ),
                0
            );


        const expected =
            calculateResearchExpectedOutput(
                inputPaddy
            );


        const totalOutput =
            rice +
            khud +
            tush +
            bran;


        const processLoss =
            inputPaddy -
            totalOutput;


        const recoveryRate =

            inputPaddy > 0

                ?

                (
                    rice /
                    inputPaddy
                ) * 100

                :

                0;


        const riceVariance =
            rice -
            expected.wholeRice;


        const variancePercentagePoints =

            inputPaddy > 0

                ?

                (
                    riceVariance /
                    inputPaddy
                ) * 100

                :

                0;


        recoveryRateInput.value =
            `${formatNumber(
                recoveryRate
            )}%`;


        riceVarianceInput.value =

            `${formatSignedNumber(
                riceVariance
            )} kg (${formatSignedNumber(
                variancePercentagePoints
            )} pp)`;


        processLossInput.value =
            `${formatNumber(
                processLoss
            )} kg`;


        const processLossField =
            processLossInput.closest(
                ".calculated-field"
            );


        if (
            processLoss < 0
        ) {

            processLossField.classList.add(
                "calculation-error"
            );


            processLossHelp.textContent =

                `Recorded outputs exceed input paddy by ${formatNumber(
                    Math.abs(
                        processLoss
                    )
                )} kg.`;

        }
        else {

            processLossField.classList.remove(
                "calculation-error"
            );


            const lossRate =

                inputPaddy > 0

                    ?

                    (
                        processLoss /
                        inputPaddy
                    ) * 100

                    :

                    0;


            processLossHelp.textContent =

                `${formatNumber(
                    lossRate
                )}% of input paddy`;

        }


        return {

            inputPaddy,

            rice,

            khud,

            tush,

            bran,

            totalOutput,

            processLoss,

            recoveryRate,

            riceVariance,

            variancePercentagePoints,

            expected

        };

    }


    /* =========================================
       SUMMARY
    ========================================= */

    function updateSummaryCards() {

        const today =
            getTodayDate();


        let todayInput =
            0;


        let todayRice =
            0;


        let totalRecovery =
            0;


        let totalLossRate =
            0;


        productionRecords.forEach(
            function (record) {

                if (
                    record.productionDate ===
                    today
                ) {

                    todayInput +=
                        Number(
                            record.inputPaddy ||
                            0
                        );


                    todayRice +=
                        Number(
                            record.riceProduced ||
                            0
                        );

                }


                totalRecovery +=
                    Number(
                        record.recoveryRate ||
                        0
                    );


                totalLossRate +=
                    Number(
                        record.lossRate ||
                        0
                    );

            }
        );


        const count =
            productionRecords.length;


        const averageRecovery =

            count > 0

                ?

                totalRecovery /
                count

                :

                0;


        const averageLoss =

            count > 0

                ?

                totalLossRate /
                count

                :

                0;


        todayInputValue.textContent =
            `${formatNumber(
                todayInput
            )} kg`;


        todayRiceValue.textContent =
            `${formatNumber(
                todayRice
            )} kg`;


        averageRecoveryValue.textContent =
            `${formatNumber(
                averageRecovery
            )}%`;


        averageLossValue.textContent =
            `${formatNumber(
                averageLoss
            )}%`;

    }


    /* =========================================
       BATCH ID
    ========================================= */

    function generateBatchId() {

        const numbers =
            productionRecords

                .map(
                    function (record) {

                        const match =
                            String(
                                record.batchId ||
                                ""
                            ).match(
                                /^PROD-(\d+)$/i
                            );


                        return (
                            match

                                ?

                                Number(
                                    match[1]
                                )

                                :

                                0
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

            `PROD-${String(
                nextNumber
            ).padStart(
                3,
                "0"
            )}`

        );

    }


    /* =========================================
       VALIDATION
    ========================================= */

    function validateForm() {

        if (
            !acceptedBatchSelect.value
        ) {

            return (
                "Please select an accepted quality batch."
            );

        }


        const inspection =
            findInspection(
                acceptedBatchSelect.value
            );


        if (
            !inspection ||
            inspection.decision !==
            "accepted"
        ) {

            return (
                "Only accepted quality batches can enter production."
            );

        }


        const calculation =
            calculateActualProduction();


        if (
            calculation.inputPaddy <= 0
        ) {

            return (
                "The selected batch has no valid input paddy quantity."
            );

        }


        if (
            !Number.isFinite(
                calculation.rice
            ) ||
            calculation.rice <= 0
        ) {

            return (
                "Whole rice produced must be greater than zero."
            );

        }


        const outputFields = [

            {
                name:
                    "Khud / Broken Rice",

                value:
                    Number(
                        khudProducedInput.value ||
                        0
                    )
            },


            {
                name:
                    "Tush / Husk",

                value:
                    Number(
                        tushProducedInput.value ||
                        0
                    )
            },


            {
                name:
                    "Rice Bran",

                value:
                    Number(
                        branProducedInput.value ||
                        0
                    )
            }

        ];


        for (
            const field of
            outputFields
        ) {

            if (
                !Number.isFinite(
                    field.value
                ) ||
                field.value < 0
            ) {

                return (
                    `${field.name} quantity cannot be negative.`
                );

            }

        }


        if (
            calculation.processLoss < 0
        ) {

            return (
                "Total recorded output cannot exceed input paddy quantity."
            );

        }


        if (
            !productionDateInput.value
        ) {

            return (
                "Please select the production date."
            );

        }


        const duplicate =
            productionRecords.some(
                function (record) {

                    return (

                        record.purchaseId ===
                        acceptedBatchSelect.value

                        &&

                        Number(
                            record.id
                        ) !==

                        Number(
                            editingProductionId
                        )

                    );

                }
            );


        if (duplicate) {

            return (
                "This accepted purchase batch already has a production record."
            );

        }


        return "";

    }


    /* =========================================
       BUILD RECORD
    ========================================= */

    function buildProductionRecord(
        existingRecord = null
    ) {

        const purchase =
            findPurchase(
                acceptedBatchSelect.value
            );


        const inspection =
            findInspection(
                acceptedBatchSelect.value
            );


        const calculation =
            calculateActualProduction();


        const lossRate =

            calculation.inputPaddy > 0

                ?

                (
                    calculation.processLoss /
                    calculation.inputPaddy
                ) * 100

                :

                0;


        return {

            id:

                existingRecord

                    ?

                    existingRecord.id

                    :

                    Date.now(),


            batchId:

                existingRecord

                    ?

                    existingRecord.batchId

                    :

                    generateBatchId(),


            purchaseId:
                acceptedBatchSelect.value,


            supplierName:
                purchase.supplierName,


            paddyType:
                purchase.paddyType ||
                "Not Recorded",


            qualityGrade:
                inspection.grade ||
                "—",


            inspectionMoisture:
                Number(
                    inspection.moisture ||
                    0
                ),


            inputPaddy:
                calculation.inputPaddy,


            expectedRice:
                calculation.expected.wholeRice,


            expectedKhud:
                calculation.expected.khud,


            expectedTush:
                calculation.expected.tush,


            expectedBran:
                calculation.expected.bran,


            riceProduced:
                calculation.rice,


            khudProduced:
                calculation.khud,


            tushProduced:
                calculation.tush,


            branProduced:
                calculation.bran,


            recoveryRate:
                calculation.recoveryRate,


            riceVariance:
                calculation.riceVariance,


            processLoss:
                calculation.processLoss,


            lossRate:
                lossRate,


            researchBaseline: {

                wholeRiceRate:
                    RESEARCH_BASELINE.wholeRiceRate,

                khudRate:
                    RESEARCH_BASELINE.khudRate,

                huskRate:
                    RESEARCH_BASELINE.huskRate,

                branRate:
                    RESEARCH_BASELINE.branRate

            },


            productionDate:
                productionDateInput.value,


            notes:
                productionNotesInput.value
                    .trim(),


            createdAt:

                existingRecord

                    ?

                    existingRecord.createdAt

                    :

                    Date.now()

        };

    }


    /* =========================================
       VARIANCE CLASS
    ========================================= */

    function getVarianceClass(
        variance
    ) {

        const value =
            Number(
                variance || 0
            );


        if (value > 0) {

            return "variance-positive";

        }


        if (value < 0) {

            return "variance-negative";

        }


        return "variance-neutral";

    }


    /* =========================================
       ACTION BUTTON HTML
    ========================================= */

    function getActionButtons(record) {

        const isPendingDelete =

            Number(
                pendingDeleteProductionId
            ) ===

            Number(
                record.id
            );


        /*
            INLINE CONFIRMATION

            No alert()
            No confirm()
            No browser popup.
        */

        if (isPendingDelete) {

            return `

                <span class="production-delete-question">
                    Delete?
                </span>


                <button
                    class="production-confirm-delete-button"
                    type="button"
                    data-action="confirm-delete"
                    data-id="${record.id}"
                >
                    Confirm
                </button>


                <button
                    class="production-cancel-delete-button"
                    type="button"
                    data-action="cancel-delete"
                    data-id="${record.id}"
                >
                    Cancel
                </button>

            `;

        }


        return `

            <button
                class="production-edit-button"
                type="button"
                data-action="edit"
                data-id="${record.id}"
            >
                Edit
            </button>


            <button
                class="production-delete-button"
                type="button"
                data-action="request-delete"
                data-id="${record.id}"
            >
                Delete
            </button>

        `;

    }


    /* =========================================
       DISPLAY TABLE
    ========================================= */

    function displayProductionRecords() {

        const searchText =
            productionSearch.value
                .trim()
                .toLowerCase();


        const filtered =
            productionRecords.filter(
                function (record) {

                    const searchable = `

                        ${record.batchId}
                        ${record.purchaseId}
                        ${record.supplierName}
                        ${record.paddyType}

                    `.toLowerCase();


                    return searchable.includes(
                        searchText
                    );

                }
            );


        productionTableBody.innerHTML =
            "";


        if (
            filtered.length === 0
        ) {

            productionTableBody.innerHTML = `

                <tr class="production-empty-row">

                    <td colspan="12">
                        No production records found.
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
                            b.productionDate
                        ).localeCompare(
                            String(
                                a.productionDate
                            )
                        )

                        ||

                        Number(
                            b.createdAt ||
                            b.id
                        )

                        -

                        Number(
                            a.createdAt ||
                            a.id
                        )

                    );

                }
            )

            .forEach(
                function (record) {

                    const byProducts =

                        Number(
                            record.khudProduced ||
                            0
                        )

                        +

                        Number(
                            record.tushProduced ||
                            0
                        )

                        +

                        Number(
                            record.branProduced ||
                            0
                        );


                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `

                        <td>

                            <span class="production-batch-id">

                                ${escapeHTML(
                                    record.batchId
                                )}

                            </span>

                        </td>


                        <td>
                            ${escapeHTML(
                                record.purchaseId
                            )}
                        </td>


                        <td>
                            ${escapeHTML(
                                record.supplierName
                            )}
                        </td>


                        <td>
                            ${formatNumber(
                                record.inputPaddy
                            )} kg
                        </td>


                        <td>

                            <strong>

                                ${formatNumber(
                                    record.riceProduced
                                )} kg

                            </strong>

                        </td>


                        <td>
                            ${formatNumber(
                                record.expectedRice
                            )} kg
                        </td>


                        <td>

                            <span
                                class="
                                    variance-badge
                                    ${getVarianceClass(
                                        record.riceVariance
                                    )}
                                "
                            >

                                ${formatSignedNumber(
                                    record.riceVariance
                                )} kg

                            </span>

                        </td>


                        <td class="byproduct-cell">

                            ${formatNumber(
                                byProducts
                            )} kg

                            <small>

                                Khud ${formatNumber(
                                    record.khudProduced
                                )} ·
                                Tush ${formatNumber(
                                    record.tushProduced
                                )} ·
                                Bran ${formatNumber(
                                    record.branProduced
                                )}

                            </small>

                        </td>


                        <td>

                            <span class="recovery-badge">

                                ${formatNumber(
                                    record.recoveryRate
                                )}%

                            </span>

                        </td>


                        <td>

                            <span class="loss-badge">

                                ${formatNumber(
                                    record.processLoss
                                )} kg

                            </span>

                        </td>


                        <td>

                            ${formatDate(
                                record.productionDate
                            )}

                        </td>


                        <td class="production-action-cell">

                            ${getActionButtons(
                                record
                            )}

                        </td>

                    `;


                    productionTableBody.appendChild(
                        row
                    );

                }
            );

    }


    /* =========================================
       ADD MODE
    ========================================= */

    function setAddMode() {

        editingProductionId =
            null;


        productionFormTitle.textContent =
            "Record Production Batch";


        acceptedBatchSelect.disabled =
            false;


        cancelProductionEditBtn.hidden =
            true;


        saveProductionBtn.innerHTML = `

            <span aria-hidden="true">
                ▣
            </span>

            Save Production

        `;

    }


    /* =========================================
       DEFAULT DATE
    ========================================= */

    function setDefaultDate() {

        if (
            !productionDateInput.value
        ) {

            productionDateInput.value =
                getTodayDate();

        }

    }


    /* =========================================
       RESET FORM
    ========================================= */

    function resetProductionForm() {

        productionForm.reset();


        productionSupplierInput.value =
            "";

        productionPaddyTypeInput.value =
            "";

        productionGradeInput.value =
            "";

        inspectionMoistureInput.value =
            "";

        inputPaddyInput.value =
            "";


        riceProducedInput.value =
            "";

        khudProducedInput.value =
            "0";

        tushProducedInput.value =
            "0";

        branProducedInput.value =
            "0";


        recoveryRateInput.value =
            "0%";

        riceVarianceInput.value =
            "0 kg";

        processLossInput.value =
            "0 kg";


        expectedRiceElement.textContent =
            "0 kg";

        expectedKhudElement.textContent =
            "0 kg";

        expectedTushElement.textContent =
            "0 kg";

        expectedBranElement.textContent =
            "0 kg";


        yieldModelLabel.textContent =
            "Bangladesh semi-automatic rice mill baseline";


        moistureGuidance.classList.remove(
            "optimum",
            "warning"
        );


        moistureGuidance.textContent =
            "Select an accepted batch to view moisture-related research guidance.";


        processLossHelp.textContent =
            "Input paddy − all recorded outputs";


        processLossInput
            .closest(
                ".calculated-field"
            )
            .classList.remove(
                "calculation-error"
            );


        setAddMode();

        setDefaultDate();

        loadAcceptedBatchDropdown();

    }


    /* =========================================
       EDIT PRODUCTION
    ========================================= */

    function editProduction(id) {

        pendingDeleteProductionId =
            null;


        const record =
            productionRecords.find(
                function (item) {

                    return (
                        Number(
                            item.id
                        ) ===

                        Number(id)
                    );

                }
            );


        if (!record) {

            showToast(
                "Production record not found.",
                "error"
            );

            return;

        }


        editingProductionId =
            record.id;


        loadAcceptedBatchDropdown(
            record.purchaseId
        );


        acceptedBatchSelect.value =
            record.purchaseId;


        acceptedBatchSelect.disabled =
            true;


        loadSelectedBatchDetails();


        riceProducedInput.value =
            record.riceProduced;


        khudProducedInput.value =
            record.khudProduced;


        tushProducedInput.value =
            record.tushProduced;


        branProducedInput.value =
            record.branProduced;


        productionDateInput.value =
            record.productionDate;


        productionNotesInput.value =
            record.notes || "";


        calculateActualProduction();


        productionFormTitle.textContent =
            "Edit Production Batch";


        saveProductionBtn.innerHTML = `

            <span aria-hidden="true">
                ✓
            </span>

            Update Production

        `;


        cancelProductionEditBtn.hidden =
            false;


        displayProductionRecords();


        productionForm.scrollIntoView(
            {
                behavior: "smooth",
                block: "center"
            }
        );

    }


    /* =========================================
       REQUEST DELETE

       First click only changes row controls.
       Nothing is deleted yet.
    ========================================= */

    function requestDeleteProduction(id) {

        pendingDeleteProductionId =
            id;


        displayProductionRecords();

    }


    /* =========================================
       CANCEL DELETE
    ========================================= */

    function cancelDeleteProduction() {

        pendingDeleteProductionId =
            null;


        displayProductionRecords();

    }


    /* =========================================
       CONFIRM DELETE

       No browser confirmation popup.
    ========================================= */

    function confirmDeleteProduction(id) {

        const record =
            productionRecords.find(
                function (item) {

                    return (
                        Number(
                            item.id
                        ) ===

                        Number(id)
                    );

                }
            );


        if (!record) {

            pendingDeleteProductionId =
                null;


            displayProductionRecords();


            showToast(
                "Production record not found.",
                "error"
            );


            return;

        }


        productionRecords =
            productionRecords.filter(
                function (item) {

                    return (
                        Number(
                            item.id
                        ) !==

                        Number(id)
                    );

                }
            );


        pendingDeleteProductionId =
            null;


        saveProductionRecords();

        updateSummaryCards();


        if (
            Number(
                editingProductionId
            ) ===

            Number(id)
        ) {

            resetProductionForm();

        }
        else {

            loadAcceptedBatchDropdown();

        }


        displayProductionRecords();


        showToast(
            `${record.batchId} deleted successfully.`
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
                ".production-toast"
            );


        if (oldToast) {
            oldToast.remove();
        }


        const toast =
            document.createElement(
                "div"
            );


        toast.className =
            `production-toast ${type}`;


        toast.innerHTML = `

            <span class="production-toast-icon">

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
       EVENTS
    ========================================= */

    acceptedBatchSelect.addEventListener(
        "change",
        loadSelectedBatchDetails
    );


    [
        riceProducedInput,
        khudProducedInput,
        tushProducedInput,
        branProducedInput

    ].forEach(
        function (input) {

            input.addEventListener(
                "input",
                calculateActualProduction
            );

        }
    );


    productionSearch.addEventListener(
        "input",
        function () {

            pendingDeleteProductionId =
                null;


            displayProductionRecords();

        }
    );


    /* =========================================
       FORM SUBMIT
    ========================================= */

    productionForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            pendingDeleteProductionId =
                null;


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
                editingProductionId !==
                null
            ) {

                const index =
                    productionRecords.findIndex(
                        function (record) {

                            return (
                                Number(
                                    record.id
                                ) ===

                                Number(
                                    editingProductionId
                                )
                            );

                        }
                    );


                if (
                    index === -1
                ) {

                    showToast(
                        "Production record not found.",
                        "error"
                    );

                    return;

                }


                productionRecords[index] =
                    buildProductionRecord(
                        productionRecords[index]
                    );


                showToast(
                    "Production batch updated successfully."
                );

            }
            else {

                productionRecords.push(
                    buildProductionRecord()
                );


                showToast(
                    "Production batch saved successfully."
                );

            }


            saveProductionRecords();

            updateSummaryCards();

            displayProductionRecords();

            resetProductionForm();

        }
    );


    /* =========================================
       CANCEL EDIT
    ========================================= */

    cancelProductionEditBtn.addEventListener(
        "click",
        function () {

            pendingDeleteProductionId =
                null;


            resetProductionForm();


            displayProductionRecords();


            showToast(
                "Edit cancelled."
            );

        }
    );


    /* =========================================
       TABLE ACTIONS
    ========================================= */

    productionTableBody.addEventListener(
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

                editProduction(id);

                return;

            }


            if (
                action === "request-delete"
            ) {

                requestDeleteProduction(id);

                return;

            }


            if (
                action === "confirm-delete"
            ) {

                confirmDeleteProduction(id);

                return;

            }


            if (
                action === "cancel-delete"
            ) {

                cancelDeleteProduction();

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
                event.key !==
                "Escape"
            ) {

                return;

            }


            /*
                ESC also cancels inline delete.
            */

            if (
                pendingDeleteProductionId !==
                null
            ) {

                pendingDeleteProductionId =
                    null;


                displayProductionRecords();


                return;

            }


            closeSidebar();

        }
    );


    window.addEventListener(
        "resize",
        function () {

            if (
                window.innerWidth >
                1000
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

    loadAcceptedBatchDropdown();

    updateExpectedOutput();

    calculateActualProduction();

    updateSummaryCards();

    displayProductionRecords();

});