window.__mongodbui__ = ((mongodbui, undefined) => {
    "use strict";

    /**
     * utility class for extra functionality
     * @class utility
     */
    class Utility {

        /**
         * function to perform AJAX calls
         * Wrapper over XMLHttpRequest to return promise
         * @param {*} url
         * @param {*} method
         * @param {*} data
         * @returns Promise
         * @memberof utility
         */
        http(url, method = "GET", data = null) {
            return new Promise((resolve, reject) => {
                try {
                    var http = new XMLHttpRequest();
                    http.onreadystatechange = () => http.readyState == 4 && http.status == 200 && resolve(JSON.parse(http.responseText));
                    http.open(method, url, true);
                    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    http.send(JSON.stringify(data));
                } catch (error) {
                    reject(error);
                }
            });
        }

        /**
         * template injector
         * injects given template in specified outlet
         * default outlet is main outlet
         * @param {*} name
         * @param {string} [outlet="outlet"]
         * @memberof utility
         */
        injectTemplate(name, outlet = "outlet") {
            document.getElementById(outlet).innerHTML = document.getElementById(name).innerHTML;
        }
    }

    mongodbui.utility = new Utility();

    return mongodbui;

})(window.__mongodbui__ || {});