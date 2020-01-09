const express = require('express');
const router = express.Router();
const controller = require('../controllers/DayAheadTotalLoadForecastController.js')

//Erotima 3a
router.get('/:_AreaName/:_Resolution/date/:_date_str', controller.GetDay)


//erotima 3b
router.get('/:AreaName/:Resolution/month/:_date_str', controller.GetMonth )


//erotima 3c
router.get('/:AreaName/:Resolution/year/:Year/', controller.GetYear )


module.exports = router;