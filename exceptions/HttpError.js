class HttpError extends Error {
    constructor (err) {
        super(err.msg);
        this.statusCode = err.statusCode;
    }
}


module.exports = HttpError  