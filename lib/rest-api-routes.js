const fs = require("fs");
const utils = require("./utils");

module.exports = class RestApiRoutes {

    constructor() {
        this.response = { data: null, status: "200", message: null, isSuccess: true }
    }

    async getCollections(url, body) {
        const response = { ...this.response };
        body = body || { ps: 10, pn: 1 };
        let collections = await utils.db().listCollections({ name: { $regex: new RegExp(body.n) } }).toArray();
        collections = collections || [];
        const c = collections.length;
        collections = collections.map(item => item.name);
        collections = collections.slice(((body.pn - 1) * body.ps), (body.pn * body.ps));
        for (let index = 0; index < collections.length; index++) {
            collections[index] = {
                name: collections[index],
                count: await utils.db().collection(collections[index]).countDocuments()
            };
        }
        response.data = { collections: collections, c: c };
        return JSON.stringify(response);
    }

    async getDocuments(url, body) {
        const response = { ...this.response };
        body = body || { ps: 10, pn: 1 };
        let documents = (await utils.db()
            .collection(body.n)
            .find(body.q || {}, body.s || {})
            .skip(((body.pn - 1) * body.ps))
            .limit((body.pn * body.ps))
            .toArray()) || [];
        const c = await utils.db().collection(body.n).countDocuments();
        response.data = { documents: documents, c: c };
        return JSON.stringify(response);
    }
}