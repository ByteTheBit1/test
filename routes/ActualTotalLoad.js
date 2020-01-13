const express           = require('express');
const router            = express.Router();
const isLoggedIn        = require('../auth/user_auth')
const ActualController  = require('../controllers/ActualTotalLoadController.js')

// Erotima 1a    
router.get('/:AreaName/:Resolution/date/:_date_str',    isLoggedIn, ActualController.GetDate )
router.get('/:AreaName/:Resolution/date' ,              isLoggedIn, ActualController.GetCurrentDate)

//erotima 1b 
router.get('/:AreaName/:Resolution/month/:_date_str',   isLoggedIn, ActualController.GetMonth)

//erotima 1c
router.get('/:AreaName/:Resolution/year/:Year/',        isLoggedIn, ActualController.GetYear)


module.exports = router;
