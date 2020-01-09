const express = require('express');
const router = express.Router();
const controller = require('../controllers/AggregatedGenerationPerTypeController')


//Erotima 2a
router.get('/:_AreaName/:_ProductionType/:_Resolution/date/:_date_str', controller.GetDay )




//Erotima 2b
router.get('/:_AreaName/:_ProductionType/:_Resolution/month/:_date_str', controller.GetMonth )






//Erotima 2c
router.get('/:_AreaName/:_ProductionType/:_Resolution/year/:_Year', controller.GetYear )

module.exports = router;