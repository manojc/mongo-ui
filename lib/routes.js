const fs = require("fs");
const utils = require("./utils");
const RestApiRoutes = require("./rest-api-routes");
const apiRoutes = new RestApiRoutes();

/**
 * Serves static files using streams
 * Serves error page in case specified static file does not exist
 * @param {*} request
 * @param {*} response
 * @returns void
 */
function serveStatic(request, response) {
    try {
        const file = utils.getStaticFile(request.url);
        if (!!file && !!file.path && fs.existsSync(file.path)) {
            response.writeHead(200, file.headers);
            return fs.createReadStream(file.path).pipe(response);
        }
        response.writeHead(302, { "Location": "/error.html" });
        response.end();
    } catch (error) {
        console.log("mongodb-ui - ", error.stack);
        response.writeHead(302, { "Location": "/error.html" });
        response.end();
    }
}

/**
 * Serves API responses in JSON format
 * @param {*} request
 * @param {*} response
 * @returns void
 */
async function serveRestApis(request, response) {
    try {
        let body = [];
        request
            .on('error', (err) => { throw err })
            .on('data', (chunk) => body.push(chunk))
            .on('end', async () => {
                const url = utils.parseUrl(request.url);
                response.writeHead(200, { "Content-Type": "application/json" });
                response.write(await restApis(url, Buffer.concat(body).toString()));
                response.end();
            });
    } catch (error) {
        console.log("mongodb-ui - ", error.stack);
        response.write(JSON.stringify({
            data: null,
            status: "500",
            message: "mongodb-ui - Error occurred while serving the request",
            isSuccess: false
        }));
        response.end();
    }
}

async function restApis(url, body) {
    switch (url.route.toLowerCase()) {
        case "api/collections":
            return await apiRoutes.getCollections(url, JSON.parse(body));
            break;
        case "api/documents":
            return await apiRoutes.getDocuments(url, JSON.parse(body));
            break;
        default:
            return JSON.stringify(apiRoutes.response);
            break;
    }
}

module.exports = (request, response) => {
    const url = utils.parseUrl(request.url);
    if (url && url.route && url.route.indexOf("api/") === 0) {
        return serveRestApis(request, response);
    }
    return serveStatic(request, response);
}