const express = require('express');
const router = express.Router();
const controller = require('../controllers/ActualvsForecastController.js')



//Erotima 4a
router.get('/:_AreaName/:_Resolution/date/:_date_str',controller.GetDate)

//erotima 4b
router.get('/:AreaName/:Resolution/month/:_date_str', controller.GetMonth)

//erotima 4c
router.get('/:AreaName/:Resolution/year/:_Year', controller.GetYear)


module.exports = router;