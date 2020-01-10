var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user.js/index.js.js');
const bcrypt = require("bcrypt")
const express = require('express');
const httpStatus = require('lib/httpStatus');

router.post('/', function (req, res) {
  User.create({
      name : req.body.name,
      email : req.body.email,
      password : req.body.password
    },
    function (err, user) {
      if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
      res.status(httpStatus.OK).send(user);
    });
});

router.get('/', function (req, res) {
  User.find({}, function (err, users) {
    if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
    res.status(httpStatus.OK).send(users);
  }).select('-password -__v').sort({name: 1});
});

router.get('/:id', function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
    if (!user) return res.status(httpStatus.NOT_FOUND).send('User not found');
    res.status(httpStatus.OK).send(user);
  }).select('-password -__v');
});

router.delete('/:id', function (req, res) {
  User.findByIdAndRemove(req.params.id, function (err, user) {
    if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
    res.status(httpStatus.OK).send("User: "+ user.name +" was deleted.");
  });
});

router.put('/:id', function (req, res) {
  User.findByIdAndUpdate(req.params.id, {
    $set: { email: req.body.email, name: req.body.name }}, {new:false}, function (err, user) {
    if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
    res.status(httpStatus.NO_CONTENT).send(user);
  });
});

router.post('/login', function(req, res) {
    const {application, email, password} = req.body
    if (!application || !email || !password) {
      return res.status(httpStatus.BAD_REQUEST).send({ auth: false, error: 'Invalid parameters in request' });
    }
    User.findOne({ email }, function (error, user) {
      if (error) {
        const message = `Server error: ${error.message}`
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ auth: false, error: message });
      } else {
        if (user) {
          const {_id, email, password} = user
          const passwordMatch = bcrypt.compareSync(req.body.password, password);
          if (passwordMatch) {
            // sign and return a new token
            const payload = {id: _id}
            const signingOptions = {
              subject: email,
              audience: application
            }
            const signedToken = jwtModule.sign(payload, signingOptions)
            return res.status(httpStatus.OK).send({ auth: true, token: signedToken });
          } else {
            return res.status(httpStatus.UNAUTHORIZED).send({ auth: false, token: null });
          }
        } else {
          const message = `User not found (email: ${req.body.email})`
          return res.status(httpStatus.NOT_FOUND).send({ auth: false, error: message });
        }
      }
    });
  });
  
  router.post('/register', function(req, res) {
    const {application, email, name, password} = req.body
    if (!application || !email || !name || !password) {
      return res.status(httpStatus.BAD_REQUEST).send({ registered: false, error: 'Invalid parameters in request' });
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    User.create({
        name : name,
        email : email,
        password : hashedPassword
      },
      function (error, user) {
        if (error) {
          const message = `Server error: ${error.message}`
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ registered: false, error: message });
        }
        // if user created, return a signed token
        const payload = {id: user._id}
        const options = {subject: email, audience: application}
        const signedToken = jwtModule.sign(payload, options)
        res.status(httpStatus.OK).send({ registered: true, token: signedToken });
      });
  
  });
  
  router.get('/me', verifyToken, function(req, res, next) {
    User.findById(req.userId, { password: 0 }, function (error, user) {
      if (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${error.message}`);
      }
      if (user) {
        res.status(httpStatus.OK).send({id: user.id, email: user.email, name: user.name});
      } else {
        return res.status(httpStatus.NOT_FOUND).send(`User not found (_id: ${req.userId})`);
      }
    });
  });



module.exports = router