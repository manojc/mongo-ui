window.__mongodbui__ = ((mongodbui, undefined) => {
    "use strict";

    class ApiClient {

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
    }

    mongodbui.apiClient = new ApiClient();
    return mongodbui;

})(window.__mongodbui__ || {});