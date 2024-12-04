const { ERROR_MESSAGE } = require("../helper/error.message");
const { errorResponse } = require("../utils/apiResponse");
const { status } = require('http-status');

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return errorResponse(req, res, 400, error.details[0].message);
        }
        next();
    }
}


module.exports = {
    validate,
}