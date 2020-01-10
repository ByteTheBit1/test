const express = require('express');
const router = express.Router();
const controller = require('../controllers/ActualvsForecastController.js')
const isLoggedIn        = require('../auth/user_auth')


//Erotima 4a
router.get('/:_AreaName/:_Resolution/date/:_date_str',isLoggedIn, controller.GetDate)

//erotima 4b
router.get('/:AreaName/:Resolution/month/:_date_str',isLoggedIn, controller.GetMonth)

//erotima 4c
router.get('/:AreaName/:Resolution/year/:_Year',isLoggedIn, controller.GetYear)


module.exports = router;