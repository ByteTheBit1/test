const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MongoClient = require("mongodb").MongoClient;





/*
router.get("/:Id",  (req, res, next) => {
    const id = req.params.Id;
     ResolutionCodeModel.findById(id)
      .exec()
      .then(doc => {
        console.log("From database", doc);
        if (doc) {
          res.status(200).json(doc);
        } else {
          res
            .status(404)
            .json({ message: "No valid entry found for provided ID" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  });

  */


router.get("/kati",(req,res,next) =>{
  const agg = [
    {
      '$lookup': {
        'from': 'ResolutionCode', 
        'localField': 'ResolutionCodeId', 
        'foreignField': 'Id', 
        'as': 'Resolution_Code'
      }
    }, {
      '$unwind': {
        'path': '$Resolution_Code'
      }
    }, {
      '$lookup': {
        'from': 'MapCode', 
        'localField': 'MapCodeId', 
        'foreignField': 'Id', 
        'as': 'Map_Code'
      }
    }, {
      '$unwind': {
        'path': '$Map_Code'
      }
    }, {
      '$lookup': {
        'from': 'AreaTypeCode', 
        'localField': 'AreaTypeCodeId', 
        'foreignField': 'Id', 
        'as': 'Area_Type_Code'
      }
    }, {
      '$unwind': {
        'path': '$Area_Type_Code'
      }
    }, {
      '$match': {
        'Year': 2018, 
        'Month': 1, 
        'Day': 1, 
        'AreaName': 'Luxembourg', 
        'Resolution_Code.ResolutionCodeText': 'PT15M'
      }
    }, {
      '$project': {
        '_id': 0, 
        'AreaName': 1, 
        'Area_Type_Code.AreaTypeCodeText': 1, 
        'Map_Code.MapCodeText': 1, 
        'Resolution_Code.ResolutionCodeText': 1, 
        'Year': 1, 
        'Month': 1, 
        'Day': 1, 
        'DateTime': 1, 
        'TotalLoadValue': 1, 
        'UpdateTime': 1
      }
    }, {
      '$sort': {
        'DateTime': 1
      }
    }, {
      '$out': 'giorgos testarismatares'
    }
  ];
  
  MongoClient.connect(
    'mongodb+srv://user:user@cluster0-0pwss.mongodb.net/test?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true },
    function(connectErr, client) {
      assert.equal(null, connectErr);
      const coll = client.db('energy').collection('ActualTotalLoad');
      coll.aggregate(agg, (cmdErr, result) => {
        assert.equal(null, cmdErr);
        res.send(result);
      });
      client.close();
    });
})

  router.get("/", (req, res, next) => {
    ResolutionCodeModel.find()
      .exec()
      .then(docs => {
        console.log(docs);
        //   if (docs.length >= 0) {
        res.status(200).json(docs);
        //   } else {
        //       res.status(404).json({
        //           message: 'No entries found'
        //       });
        //   }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });





//  ProductionType

module.exports = router;