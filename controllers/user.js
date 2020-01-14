const mongoose      = require("mongoose");
const bcrypt        = require("bcrypt");
const jwt           = require('jsonwebtoken');
const RandExp       = require('../node_modules/randexp'); 
const User          = require("../models/user");
const credentials   = require('../config/credentials')


exports.user_signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(400).json({
          message: "Mail exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: "something went wrong"
            });
          } else {
            let possible_key = new RandExp('/[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}/').gen()
            /* Check if key = unique (search in DB if there a matching key)
            let flag=0
            while(flag==0){
            User.find({ api_key: possible_key }).exec()
            .then(k => {
                if  (k.length >= 1) {
                    possible_key = new RandExp('/[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}/').gen() // generate new key
                }
                else{ flag = 1 } // the generated key is unique (flag = 1)
              })
              } */
            key = toString(possible_key)  // this key is unique
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              username : req.body.username,
              email: req.body.email,
              password: hash,
              api_key: key
              
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
};

exports.user_login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          let expiration
          // admin check
          if(req.body.email==credentials.admin_user.email){ 
              expiration="12h",
              req.session.admin=true 
            }
          else{ expiration = "1h"}
          const token = jwt.sign(
            {
              email:  user[0].email,
              userId: user[0]._id
            },
            credentials.secret,
            {
              expiresIn: expiration
            }
          );

          return res.status(200).json({
            message: "Auth successful",
            token: token
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.user_delete = (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};


exports.user_patch = (req, res, next) => {
  User.find({ _id: req.params.userId })
  .then(user => {
    if (user.length == 0 ) {
      return res.status(400).json({
        message: "User Does not exist"
      });
    }
    else {
      let updateObject = req.body; // {last_name : "smith", age: 44}
      let id = req.params.id;
      db.users.update({_id  : ObjectId(id)}, {$set: updateObject});
}
})}

/*

jwt-blacklist cannot be installed for unkown reason :(

exports.logout = (req,res,next) => {
      const token =  req.headers['x-observatory-auth'];
      jwtBlacklist.blacklist(token);
}
*/
