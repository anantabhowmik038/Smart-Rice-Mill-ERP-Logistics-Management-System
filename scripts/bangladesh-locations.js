(function () {

    // ==========================================
    // BANGLADESH LOCATION DATA SERVICE
    // ==========================================

    const DATA_URLS = {

        divisions:
            "https://raw.githubusercontent.com/open-admin-data/bangladesh-administrative-divisions/refs/heads/main/data/all-division.json",

        districts:
            "https://raw.githubusercontent.com/open-admin-data/bangladesh-administrative-divisions/refs/heads/main/data/all-district.json",

        upazilas:
            "https://raw.githubusercontent.com/open-admin-data/bangladesh-administrative-divisions/refs/heads/main/data/all-upazila.json"

    };


    const CACHE_KEY =
        "smartRiceMillBDLocationsV1";


    const CACHE_TIME_KEY =
        "smartRiceMillBDLocationsCacheTimeV1";


    const CACHE_MAX_AGE =
        7 * 24 * 60 * 60 * 1000;


    let divisions = [];

    let districts = [];

    let upazilas = [];


    // ==========================================
    // NORMALIZE TEXT
    // ==========================================

    function normalizeText(value) {

        return String(value || "")
            .toLowerCase()
            .replace(/upazila/g, "")
            .replace(/sadar/g, "sadar")
            .replace(/[^a-z0-9]/g, "")
            .trim();

    }


    // ==========================================
    // GET ENGLISH NAME
    // ==========================================

    function getName(item) {

        if (!item) {
            return "";
        }


        if (
            item.name &&
            typeof item.name === "object"
        ) {

            return (
                item.name.en ||
                item.name.local ||
                ""
            );

        }


        return item.name || "";

    }


    // ==========================================
    // GET BANGLA NAME
    // ==========================================

    function getBanglaName(item) {

        if (
            item &&
            item.name &&
            typeof item.name === "object"
        ) {

            return (
                item.name.local ||
                ""
            );

        }


        return "";

    }


    // ==========================================
    // GET PARENT ID
    // ==========================================

    function getParentId(item) {

        if (!item) {
            return null;
        }


        if (
            item.parent &&
            item.parent.id
        ) {

            return item.parent.id;

        }


        if (item.parent_id) {

            return item.parent_id;

        }


        if (item.division_id) {

            return item.division_id;

        }


        if (item.district_id) {

            return item.district_id;

        }


        return null;

    }


    // ==========================================
    // GET COORDINATES
    // ==========================================

    function getCoordinates(item) {

        if (!item) {

            return null;

        }


        const lat =
            Number(
                item.geo?.lat ??
                item.lat ??
                item.latitude
            );


        const lng =
            Number(
                item.geo?.lon ??
                item.geo?.lng ??
                item.lon ??
                item.lng ??
                item.longitude
            );


        if (
            !Number.isFinite(lat) ||
            !Number.isFinite(lng)
        ) {

            return null;

        }


        return {

            lat: lat,

            lng: lng

        };

    }


    // ==========================================
    // SORT BY NAME
    // ==========================================

    function sortByName(items) {

        return [...items].sort(
            function (a, b) {

                return getName(a)
                    .localeCompare(
                        getName(b)
                    );

            }
        );

    }


    // ==========================================
    // LOAD CACHE
    // ==========================================

    function loadCache() {

        try {

            const cacheTime =
                Number(
                    localStorage.getItem(
                        CACHE_TIME_KEY
                    )
                );


            const cachedData =
                JSON.parse(
                    localStorage.getItem(
                        CACHE_KEY
                    )
                );


            if (
                !cachedData ||
                !cacheTime
            ) {

                return false;

            }


            const cacheAge =
                Date.now() -
                cacheTime;


            if (
                cacheAge >
                CACHE_MAX_AGE
            ) {

                return false;

            }


            if (
                !Array.isArray(
                    cachedData.divisions
                ) ||
                !Array.isArray(
                    cachedData.districts
                ) ||
                !Array.isArray(
                    cachedData.upazilas
                )
            ) {

                return false;

            }


            divisions =
                cachedData.divisions;


            districts =
                cachedData.districts;


            upazilas =
                cachedData.upazilas;


            return true;

        } catch (error) {

            console.error(
                "Location cache error:",
                error
            );


            return false;

        }

    }


    // ==========================================
    // SAVE CACHE
    // ==========================================

    function saveCache() {

        try {

            localStorage.setItem(
                CACHE_KEY,
                JSON.stringify({

                    divisions:
                        divisions,

                    districts:
                        districts,

                    upazilas:
                        upazilas

                })
            );


            localStorage.setItem(
                CACHE_TIME_KEY,
                String(
                    Date.now()
                )
            );

        } catch (error) {

            console.error(
                "Unable to cache location data:",
                error
            );

        }

    }


    // ==========================================
    // FETCH JSON
    // ==========================================

    async function fetchJSON(url) {

        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Unable to load Bangladesh location data."
            );

        }


        return response.json();

    }


    // ==========================================
    // INITIALIZE
    // ==========================================

    async function init() {

        if (
            divisions.length > 0 &&
            districts.length > 0 &&
            upazilas.length > 0
        ) {

            return true;

        }


        if (loadCache()) {

            return true;

        }


        try {

            const results =
                await Promise.all([

                    fetchJSON(
                        DATA_URLS.divisions
                    ),

                    fetchJSON(
                        DATA_URLS.districts
                    ),

                    fetchJSON(
                        DATA_URLS.upazilas
                    )

                ]);


            divisions =
                Array.isArray(results[0])
                    ? results[0]
                    : [];


            districts =
                Array.isArray(results[1])
                    ? results[1]
                    : [];


            upazilas =
                Array.isArray(results[2])
                    ? results[2]
                    : [];


            if (
                divisions.length === 0 ||
                districts.length === 0 ||
                upazilas.length === 0
            ) {

                throw new Error(
                    "Bangladesh location dataset is incomplete."
                );

            }


            saveCache();


            return true;

        } catch (error) {

            console.error(
                "BD location loading error:",
                error
            );


            // Old cache থাকলে network fail হলেও use করবে

            try {

                const cachedData =
                    JSON.parse(
                        localStorage.getItem(
                            CACHE_KEY
                        )
                    );


                if (
                    cachedData &&
                    Array.isArray(
                        cachedData.divisions
                    ) &&
                    Array.isArray(
                        cachedData.districts
                    ) &&
                    Array.isArray(
                        cachedData.upazilas
                    )
                ) {

                    divisions =
                        cachedData.divisions;


                    districts =
                        cachedData.districts;


                    upazilas =
                        cachedData.upazilas;


                    return true;

                }

            } catch (cacheError) {

                console.error(
                    cacheError
                );

            }


            return false;

        }

    }


    // ==========================================
    // GET DIVISIONS
    // ==========================================

    function getDivisions() {

        return sortByName(
            divisions
        );

    }


    // ==========================================
    // GET DISTRICTS
    // ==========================================

    function getDistrictsByDivision(
        divisionId
    ) {

        return sortByName(
            districts.filter(
                function (district) {

                    return (
                        String(
                            getParentId(
                                district
                            )
                        ) ===
                        String(
                            divisionId
                        )
                    );

                }
            )
        );

    }


    // ==========================================
    // GET UPAZILAS
    // ==========================================

    function getUpazilasByDistrict(
        districtId
    ) {

        return sortByName(
            upazilas.filter(
                function (upazila) {

                    return (
                        String(
                            getParentId(
                                upazila
                            )
                        ) ===
                        String(
                            districtId
                        )
                    );

                }
            )
        );

    }


    // ==========================================
    // FIND BY ID
    // ==========================================

    function findDivisionById(id) {

        return divisions.find(
            function (item) {

                return (
                    String(item.id) ===
                    String(id)
                );

            }
        ) || null;

    }


    function findDistrictById(id) {

        return districts.find(
            function (item) {

                return (
                    String(item.id) ===
                    String(id)
                );

            }
        ) || null;

    }


    function findUpazilaById(id) {

        return upazilas.find(
            function (item) {

                return (
                    String(item.id) ===
                    String(id)
                );

            }
        ) || null;

    }


    // ==========================================
    // FIND BY NAME
    // ==========================================

    function findByName(
        items,
        name
    ) {

        const target =
            normalizeText(name);


        if (!target) {

            return null;

        }


        // Exact normalized match

        let result =
            items.find(
                function (item) {

                    return (
                        normalizeText(
                            getName(item)
                        ) === target
                    );

                }
            );


        if (result) {

            return result;

        }


        // Partial match fallback

        result =
            items.find(
                function (item) {

                    const itemName =
                        normalizeText(
                            getName(item)
                        );


                    return (
                        itemName.includes(
                            target
                        ) ||
                        target.includes(
                            itemName
                        )
                    );

                }
            );


        return result || null;

    }


    function findDivisionByName(name) {

        return findByName(
            divisions,
            name
        );

    }


    function findDistrictByName(
        name,
        divisionId = null
    ) {

        let list =
            districts;


        if (divisionId) {

            list =
                getDistrictsByDivision(
                    divisionId
                );

        }


        return findByName(
            list,
            name
        );

    }


    function findUpazilaByName(
        name,
        districtId = null
    ) {

        let list =
            upazilas;


        if (districtId) {

            list =
                getUpazilasByDistrict(
                    districtId
                );

        }


        return findByName(
            list,
            name
        );

    }


    // ==========================================
    // GET DIVISION OF DISTRICT
    // ==========================================

    function getDivisionForDistrict(
        district
    ) {

        if (!district) {

            return null;

        }


        return findDivisionById(
            getParentId(
                district
            )
        );

    }


    // ==========================================
    // GET DISTRICT OF UPAZILA
    // ==========================================

    function getDistrictForUpazila(
        upazila
    ) {

        if (!upazila) {

            return null;

        }


        return findDistrictById(
            getParentId(
                upazila
            )
        );

    }


    // ==========================================
    // PUBLIC SERVICE
    // ==========================================

    window.BDLocations = {

        init:
            init,

        getName:
            getName,

        getBanglaName:
            getBanglaName,

        getCoordinates:
            getCoordinates,

        getParentId:
            getParentId,

        getDivisions:
            getDivisions,

        getDistrictsByDivision:
            getDistrictsByDivision,

        getUpazilasByDistrict:
            getUpazilasByDistrict,

        findDivisionById:
            findDivisionById,

        findDistrictById:
            findDistrictById,

        findUpazilaById:
            findUpazilaById,

        findDivisionByName:
            findDivisionByName,

        findDistrictByName:
            findDistrictByName,

        findUpazilaByName:
            findUpazilaByName,

        getDivisionForDistrict:
            getDivisionForDistrict,

        getDistrictForUpazila:
            getDistrictForUpazila

    };

})();