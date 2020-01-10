const express           = require('express');
const router            = express.Router();
const controller        = require('../controllers/AggregatedGenerationPerTypeController')
const isLoggedIn        = require('../auth/user_auth')

//Erotima 2a
router.get('/:_AreaName/:_ProductionType/:_Resolution/date/:_date_str',isLoggedIn, controller.GetDay )

//Erotima 2b
router.get('/:_AreaName/:_ProductionType/:_Resolution/month/:_date_str',isLoggedIn, controller.GetMonth )

//Erotima 2c
router.get('/:_AreaName/:_ProductionType/:_Resolution/year/:_Year',isLoggedIn, controller.GetYear )

module.exports = router;