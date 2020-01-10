const jwt = require('jsonwebtoken');
const credentials = require('../config/credentials')

module.exports = (req, res, next) => {
    try {
        const token =  req.headers['x-observatory-auth'];
        const decoded = jwt.verify(token, credentials.secret);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};