const fs = require("fs");
const utils = require("./util");

/**
 * Serves static files using streams
 * Serves error page in case specified static file does not exist
 * @param {*} request
 * @param {*} response
 * @returns void
 */
function serveStatic(request, response) {
    const file = utils.getStaticFile(request.url);
    if (!!file && !!file.path && fs.existsSync(file.path)) {
        response.writeHead(200, file.headers);
        return fs.createReadStream(file.path).pipe(response);
    }
    response.writeHead(302, { "Location": "/error.html" });
    response.end();
}

/**
 * Serves API responses in JSON format
 * @param {*} request
 * @param {*} response
 * @returns void
 */
function serveApi(request, response) {
    const url = utils.parseUrl(request.url);
    response.writeHead(200, { "Content-Type": "applicaition/json" });
    response.write(JSON.stringify(url));
    response.end();
}

module.exports = (request, response) => {
    const url = utils.parseUrl(request.url);
    if (url && url.route && url.route.indexOf("/api/") === 0) {
        return serveApi(request, response);
    }
    return serveStatic(request, response);
}