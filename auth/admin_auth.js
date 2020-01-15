const User          = require("../models/user");
const credentials   = require('../config/credentials')

module.exports = (req, res, next) => {
      
    User.findOne({where: {username: username}}).then(user => {
        if (user){
          if(user.username == credentials.admin_user.email){
            next()
          }
          else{
            res.sendStatus(401).send("Not authorized")
          }
        }
        else{
          res.sendStatus(400).send("Bad request")
        }
      })
    }
    

