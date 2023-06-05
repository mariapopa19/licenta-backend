const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");

dotenv.config();

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader) {
        const error = new Error('Nu este autentificat.');
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }

    if(!decodedToken) {
        const error = new Error('Nu este autentificat.');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
};