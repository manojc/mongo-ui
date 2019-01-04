module.exports = function listenerhandler(error) {
    return new Promise((resolve, reject) => {
        if (!!error) {
            return reject(error);
        }
        resolve();
    });
}