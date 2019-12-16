const express = require('express');
const router = express.Router();
const ActualTotalLoadValueModel = require('../models/ActualTotalLoadModel');
const mongoose = require('mongoose');
const ResolutionCodeModel = require('../models/ResolutionCodeModel');


//GET METHOD route -> Year/Month/Day
router.get('/:AreaName_req/:Resolution_req/:Year_req/:Month_req/:Day_req',(req,res,next)=>{
          const Area=req.params.AreaName_req;
          const Reso=req.paramsResolution_req;
          const Y   =req.params.Year_req;
          const M   =req.params.Month_req;
          const D   =req.params.Day_req;

          //ActualTotalLoadValueInstance.findOne( { $where : "this. } ) -> continue tomorrow

    res.json({ 
        "Source" : "entso-e",
        "Dataset" : "ActualTotalLoad",
        "AreaName" : "Greece",
        "AreaTypeCode" : "CTY",
        "MapCode" : "GR",
        "ResolutionCode" : "PT60M",
        "Year" : "2018",
        "Month" : "1",
        "Day" : "1",
        "DateTimeUTC" : "2018-01-01 01:00:00.0000000",
        "ActualTotalLoadValue" : "4767.82",
        "UpdateTimeUTC" : "2018-09-04 11:16:37.0000000",


        "Area= ": Area,
        "Resolution ": Reso,
        "Year=   ": Y,
        "Month= ": M,
        "Day= ":D
         });

   });

//POST METHOD route
router.post('/:AreaName/:Resolution/:Year/:Month/:Day',(req,res,next)=>{
    const ActualTotalLoadValueInstance = new ActualTotalLoadValueModel({// we create a new object type ActualTotalLoadModel
        Id : req.body.Id,
        EntityCreatedAt : req.body.EntityCreatedAt,
        EntityModifiedAt : req.body.EntityModifiedAt,
        ActionTaskID :req.body.ActionTaskID, 
        Status: req.body.Status, 
        Year: req.body.Year,
        Month : req.body.Month,
        Day : req.body.Day,
        DateTime : req.body.DateTime,
        AreaName : req.body.AreaName,
        UpdateTime : req.body.UpdateTime,
        TotalLoadValue : req.body.TotalLoadValue,
        AreaTypeCodeId : req.body.AreaTypeCodeId,
        AreaCodeId : req.body.AreaCodeId, 
        ResolutionCodeId : req.body.ResolutionCodeId,
        MapCodeId : req.body.MapCodeId,
        RowHash: req.body.RowHash
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
router.patch('/:AreaName/:Resolution/:Year/:Month/:Day',  (req, res,next) =>{
    res.status(200).json({
  });
});

//DELETE METHOD route
router.delete('/:AreaName/:Resolution/:Year/:Month/:Day', (req,res,next)=>{
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