const express = require('express');
const router = express.Router();

const ActualController = require('../controllers/ActualTotalLoadController.js')

// Erotima 1a    
router.get('/:AreaName/:Resolution/date/:_date_str', ActualController.GetDate )

//erotima 1b 
router.get('/:AreaName/:Resolution/month/:_date_str', ActualController.GetMonth)

//erotima 1c
router.get('/:AreaName/:Resolution/year/:Year/', ActualController.GetYear)


module.exports = router;
