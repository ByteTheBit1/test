const express = require('express');
const router = express.Router();
const ActualTotalLoadValueModel = require('../models/ActualTotalLoadModel');
const mongoose = require('mongoose');

//GET METHOD route
router.get('/',(req,res,next)=>{
    req.status(200).json({

    });
});

//POST METHOD route
router.post('/',(req,res,next)=>{
    const ActualTotalLoadValueInstance = new ActualTotalLoadValueModel({// we create a new object type ActualTotalLoadModel
        Source: req.body.Source,
        Dataset: req.body.Dataset,
        AreaName: req.body.AreaName,
        AreaTypeCode: req.AreaTypeCode,
        MapCode: req.body.MapCode,
        ResolutionCode: req.body.ResolutionCode,
        Year: req.body.Year,
        Month: req.body.Month,
        Day: req.body.Day,
        DateTimeUTC: req.body.DateTimeUTC,
        ActualTotalLoadValue: req.body.ActualTotalLoadValue,
        UpdateTimeUTC: req.body.UpdateTimeUTC
    });
    product
    .save()             // save the new instance of TotalLoad in DB
    .then(result=>{     // just show me the results in the log !!!!DELETE LATER!!!! (for testing onlys)
        console.log(result);
    })
    .catch(err=>{       // catch any potential errors here
        console.log(err); 
    })
    
    res.status(201).json({
        message:"New entry was created",
        entry: ActualTotalLoadValueInstance
    });
});

// PATCH method route
router.patch('/',  (req, res,next) =>{
    res.status(200).json({
  });
});

//DELETE METHOD route
router.delete('/', (req,res,next)=>{
    res.status(200).json({
    });
});

//Querry testing - get id column and then if (id=....) get something
router.get('/Id',(req,res,next)=>{
    if(id>4000){
        res.status(200).json({
            message:'Just testing the querries'
        });
    }
    else{
        res.status(200).json({
        message:"still testing"
        });
    }
});

module.exports = router;