const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Token = require('../model/authToken');
const { errorResponse } = require('../utils/apiResponse');
const { CONFIG } = require('../config/config');
const User = require('../model/user');
const authentication = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return errorResponse(req, res, 401, "Authorization forbidden: No token provided");
        }

        // Verify the token and get the decoded data
        const decoded = jwt.verify(token, CONFIG.jwtSecret);

        // Check if the token is expired
        const currentTime = Math.floor(Date.now() / 1000);

        // Find the token in the database (if applicable)
        const userToken = await Token.findOne({ userId: decoded.userId, token: token });
        if (!userToken) {
            return errorResponse(req, res, 401, "Invalid token");
        }

        if (decoded.exp < currentTime) {
            return errorResponse(req, res, 400, "Token has expired");
        }

        // Find the user from the decoded token's userId
        const user = await User.findById(decoded.userId);
        if (!user) {
            return errorResponse(req, res, 401, "Permission denied");
        }

        // If all checks pass, move to the next middleware
        req.user = user; // Store user info in the request for further use
        next();
    } catch (error) {
        console.log(error);
        if (error.name === "TokenExpiredError") {
            return errorResponse(req, res, 400, "Token has expired");
        } else if (error.name === "JsonWebTokenError") {
            return errorResponse(req, res, 401, "Invalid token");
        } else {
            return errorResponse(req, res, 500, "Server error");
        }
    }
};

module.exports = {
    authentication
};
