const http = require("http");
const router = require("./routes");
const handler = require("./server-listener-handler");
const defaultConfig = require("./default-config");

module.exports = class MongodbUI {

    /**
     * setup the app with config values
     * uses default config if config object is invalid
     * Returns `this` to get builder pattern
     * @param {*} config
     * @returns MongodbUI
     * @memberof MongodbUI
     */
    setup(config) {
        this._config = { ...config, ...defaultConfig };
        return this;
    }

    /**
     * Creates server using config provided
     * Uses default config options if config values are invalid
     * @param {*} [config=null]
     * @returns Promise<void>
     * @memberof MongodbUI
     */
    start(config = null) {
        this.setup(config);
        return http
            .createServer(router)
            .listen(this._config.port, handler);
    }
}