const User          = require("../models/user");
const credentials   = require('../config/credentials')

module.exports = (req, res, next) => {
      
        if ( req.session.admin==true  ) {
            next();
        }         
        else{
            return res.status(401).json({
                "Error 401": "Not authorized"
            });
        }
    }
     
