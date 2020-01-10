const express           = require('express');
const router            = express.Router();
const controller        = require('../controllers/DayAheadTotalLoadForecastController.js')
const isLoggedIn        = require('../auth/user_auth')


//Erotima 3a
router.get('/:_AreaName/:_Resolution/date/:_date_str',isLoggedIn, controller.GetDay)


//erotima 3b
router.get('/:AreaName/:Resolution/month/:_date_str',isLoggedIn, controller.GetMonth )


//erotima 3c
router.get('/:AreaName/:Resolution/year/:Year/',isLoggedIn, controller.GetYear )


module.exports = router;