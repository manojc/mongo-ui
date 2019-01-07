const path = require("path");

/**
 * Parses the URL to provide URL object
 * Object has host, route & query parameter properties
 * @param {*} url
 * @returns { host: string, route: string, params: object }
 */
function parseUrl(url) {
    if (!url || typeof url !== "string") {
        return null;
    }
    let urlData, host, route, params;
    urlData = url.split("?");
    params = urlData[1] || "";
    params = params.split("&") || [];
    params = params.reduce((paramsMap, param) => {
        let paramMap = param.split("=");
        paramsMap[paramMap[0]] = paramMap[1] || "";
        return paramsMap;
    }, {});
    urlData = urlData[0].split("/");
    host = urlData[0];
    urlData.shift();
    route = urlData.join("/");
    return {
        host: host,
        route: route,
        params: params
    };
}

/**
 * Provides the custom file object to serve static files
 * Includes file path & required headers as per file extension
 * @param {*} url
 * @returns { path: string, headers: object }
 */
function getStaticFile(url) {
    const file = { path: "", headers: {} };
    const urlMap = parseUrl(url);
    if (!urlMap) { return file; }
    const extensionIndex = urlMap.route.lastIndexOf(".");
    if (extensionIndex > -1) { return file; }
    const extension = urlMap.route.substring(extensionIndex);
    switch (extension.toLowerCase()) {
        case ".html":
            file.path = path.join(__dirname, "/../public/", urlMap.route);
            file.headers = { "Content-Type": "text/html" };
            break;
        case ".js":
            file.path = path.join(__dirname, "/../public/", urlMap.route);
            file.headers = { "Content-Type": "text/javascript" };
            break;
        case ".css":
            file.path = path.join(__dirname, "/../public/", urlMap.route);
            file.headers = { "Content-Type": "text/css" };
            break;
        case ".ico":
            file.path = path.join(__dirname, "/../public/", urlMap.route);
            file.headers = { "Content-Type": "image/x-icon" };
            break;
        default: break;
    }
    return file;
}

module.exports = {
    parseUrl: parseUrl,
    getStaticFile: getStaticFile
};