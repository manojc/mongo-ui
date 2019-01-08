(async (undefined) => {
    "use strict";
    window.__mongodbui__ = window.__mongodbui__ || {};
    const utils = window.__mongodbui__.utils;
    utils.postData("/api/data", "GET")
        .then(response => document.getElementById("collections").innerHTML = JSON.stringify(response, null, 4))
        .catch(error => console.log(error));
    window.__mongodbui__.home = window.__mongodbui__.home || {};
})();