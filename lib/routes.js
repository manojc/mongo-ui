const fs = require("fs");
const utils = require("./utils");

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
            .on('data', (chunk) => { body.push(chunk); })
            .on('end', async () => {
                body = Buffer.concat(body).toString();
                const url = utils.parseUrl(request.url);
                response.writeHead(200, { "Content-Type": "application/json" });
                response.write(JSON.stringify({
                    data: await restApis(JSON.parse(body)),
                    status: "200",
                    message: null,
                    isSuccess: true
                }));
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

async function restApis(query) {
    query = query || { pageSize: 10, pageNumber: 1 };
    let collections = (await utils.db().listCollections().toArray()) || [];
    collections = collections.reduce((list, item) => {
        if (!query || !query.name || (query.name.trim() && item.name.indexOf(query.name.trim()) > -1)) {
            list.push(item.name);
        }
        return list;
    }, []);
    const count = collections.length;
    collections = collections.slice(((query.pageNumber - 1) * query.pageSize), (query.pageNumber * query.pageSize));
    return {
        collections: collections,
        count: count
    };
}

module.exports = (request, response) => {
    const url = utils.parseUrl(request.url);
    if (url && url.route && url.route.indexOf("api/") === 0) {
        return serveRestApis(request, response);
    }
    return serveStatic(request, response);
}