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
    route = urlData[1];
    return {
        host: host,
        route: route,
        params: params
    };
}

module.exports = {
    parseUrl: parseUrl
};