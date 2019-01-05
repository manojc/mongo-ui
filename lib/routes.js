const fs = require("fs");
const path = require("path");
const utils = require("./util");

function serveStatic(request, response) {
    const url = utils.parseUrl(request.url);
    const route = url.route.indexOf(".css") > -1 || url.route.indexOf(".js") > -1 ?
        url.route :
        `${url.route || "home"}.html`;
    const filePath = path.join(__dirname, "/../public/", route);
    if (fs.existsSync(filePath)) {
        response.writeHead(200, { "Content-Type": "text/html" });
        return fs.createReadStream(filePath).pipe(response);
    }
    response.writeHead(302, { "Location": "/" });
    response.end();
}

function serveApi(request, response) {
    const url = utils.parseUrl(request.url);
    const readStream = fs.createReadStream(path.join(__dirname, "/../views/home.html"));
    response.writeHead(200, { "Content-Type": "applicaition/json" });
    response.write(JSON.stringify(url));
    response.end();
}

module.exports = (request, response) => {
    const url = utils.parseUrl(request.url);
    if (url.route.indexOf("/api/") === 0) {
        return serveApi(request, response);
    }
    return serveStatic(request, response);
}