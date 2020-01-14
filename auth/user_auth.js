const jwt = require('jsonwebtoken');
const credentials = require('../config/credentials')

module.exports = (req, res, next) => {
    try {
        const token =  req.headers['x-observatory-auth'];
        const decoded = jwt.verify(token, credentials.secret);
        req.userData = decoded;
        if( req.query.api_key != req.session.api_key || (req.session.admin) ){ 
            return res.status(401).json({
                401: 'Auth failed',
                Details: 'Provide a valid api key' })
        }
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};