const http = require("http");
const MongoClient = require('mongodb').MongoClient;
const router = require("./routes");
const utils = require("./utils");

class MongodbUI {

    /**
     * setup the app with config values & db connection
     * uses default config if config object is invalid
     * Returns `this` to get builder pattern
     * @param {*} config
     * @returns MongodbUI
     * @memberof MongodbUI
     */
    async setup(config) {
        try {
            // override default config if provided
            this._config = { ...config, ...utils.config };
            // initialise global config object
            global.__mongodbui__ = global.__mongodbui__ || {};
            // get db connection
            const connection = await MongoClient.connect(this._config.mongoDbUrl, { useNewUrlParser: true });
            // store db object in global config
            global.__mongodbui__.connection = global.__mongodbui__.connection || await connection.db(this._config.dbName);
            // store app config in global config
            global.__mongodbui__.config = global.__mongodbui__.config || this._config;
        } catch (error) {
            console.error(error.stack);
            throw error;
        }
    }

    /**
     * Creates server using config provided
     * Uses default config options if config values are invalid
     * @param {*} [config=null]
     * @returns Promise<void>
     * @memberof MongodbUI
     */
    async start(config = null) {
        try {
            await this.setup(config);
            return http
                .createServer(router)
                .listen(this._config.port, utils.listenerHandler);
        } catch (error) {
            console.error(error.stack);
            throw error;
        }
    }
}

module.exports = new MongodbUI();