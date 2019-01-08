((window, undefined) => {
    "use strict";
    window.__mongodbui__ = window.__mongodbui__ || {};

    function postData(url, method, data) {
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
    window.__mongodbui__.utils = window.__mongodbui__.utils || {
        postData: postData
    };
})(window);