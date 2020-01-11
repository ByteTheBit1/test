const mongoose      = require("mongoose");
const bcrypt        = require("bcrypt");
const jwt           = require('jsonwebtoken');
//const jwtBlacklist  = require('jwt-blacklist')(jwt);  cannot be installed for unkown reason :(
const User          = require("../models/user");
const credentials   = require('../config/credentials')


exports.user_signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
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


/*

jwt-blacklist cannot be installed for unkown reason :(

exports.logout = (req,res,next) => {
      const token =  req.headers['x-observatory-auth'];
      jwtBlacklist.blacklist(token);
}
*/
