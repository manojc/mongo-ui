const mongodbUI = require("../lib/index");

(async () => {
    try {
        await mongodbUI.start();
        console.log("server started!");        
    } catch (error) {
        console.error(error);
    }
})();