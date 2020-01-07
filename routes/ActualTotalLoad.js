var express = require('express');
var app = express();

var router = express.Router();
var assert = require('assert')
const URL = 'mongodb+srv://user:user@cluster0-0pwss.mongodb.net/test?retryWrites=true&w=majority'
const MongoClient = require('mongodb').MongoClient
//const CircularJSON = require('circular-json');
//const {parse, stringify} = require('flatted/cjs');



// Erotima 1a
router.get('/:AreaName/:Resolution/:Year/:Month/:Day', (req, res) => {
  const _AreaName=req.params.AreaName
  const _Resolution=req.params.Resolution
  const _Year = parseInt(req.params.Year)
  const _Month = parseInt(req.params.Month)
  const _Day = parseInt(req.params.Day)

  MongoClient.connect(URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true}, 
    async (err, client) => {
      if (err) throw err; 
      else console.log('connected to db');
      assert.equal(null, err) 
      const db = client.db('energy')
      var collection = db.collection('ActualTotalLoad')
      const agg = [
        { 
          $match : 
          {
            AreaName: _AreaName,
            Day : _Day,
            Month: _Month,
            Year: _Year
          }
      },

        {
          $lookup:
          {
            from: 'ResolutionCode',
            localField: 'ResolutionCodeId',
            foreignField : 'Id',
            as: "resolution_codes"
          }
        },
        {
          $unwind: {path : "$resolution_codes"}
        },

        { 
          $match : {'resolution_codes.ResolutionCodeText' : _Resolution}
        },
        {
          $lookup: {
            from: 'MapCode', 
            localField: 'MapCodeId', 
            foreignField: 'Id', 
            as : 'Map_Code'
          }
        }, {
          $unwind: {
            path: '$Map_Code'
          }
        }, {
          $lookup: {
            from: 'AreaTypeCode', 
            localField: 'AreaTypeCodeId', 
            foreignField: 'Id', 
            as: 'Area_Type_Code'
          }
        }, {
          $unwind: {
            path: '$Area_Type_Code'
          }
        }, 
        {
          $project : 
          {
            _id:0,
            Source :'entso-e',
            Dataset :'ActualTotalLoad',
            AreaName: '$AreaName',
            AreaTypeCode: '$Area_Type_Code.AreaTypeCodeText',
            MapCode:'$Map_Code.MapCodeText',
            ResolutionCode : '$resolution_codes.ResolutionCodeText',
            Year :   { $toString: "$Year" },
            Month :  { $toString: "$Month" },
            Day :    { $toString: "$Day" },
            DateTimeUTC: '$DateTime',
            ActualTotalLoadValue: { $toString: "$TotalLoadValue" },
            UpdateTimeUTC: '$UpdateTime'
          }
        },
        {
          $sort: {
            'DateTime': 1
          }
        }
      ];
      var cursor = collection.aggregate(agg)

      await cursor.toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });

  })// connection ends here
})






//erotima 1b 
router.get('/:AreaName/:Resolution/:Year/:Month', (req, res) => {
  const _AreaName=req.params.AreaName
  const _Resolution=req.params.Resolution
  const _Year = parseInt(req.params.Year)
  const _Month = parseInt(req.params.Month)

  MongoClient.connect(URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true}, 
    async (err, client) => {
      if (err) throw err; 
      else console.log('connected to db');
      assert.equal(null, err) 
      const db = client.db('energy')
      var collection = db.collection('ActualTotalLoad')
      const agg = [
        {
          $project :{
            _id:0,
            Source :'entso-e',
            Dataset :'ActualTotalLoad',
            AreaName: '$AreaName',
            AreaTypeCode: '$Area_Type_Code.AreaTypeCodeText',
            MapCode:'$Map_Code.MapCodeText',
            ResolutionCode : '$resolution_codes.ResolutionCodeText',
            Year : '$Year',
            Month : '$Month',
            Day : '$Day',
            DateTimeUTC: '$DateTime',
            ActualTotalLoadValue:"$TotalLoadValue",
            UpdateTimeUTC: '$UpdateTime'

      }},
      { 
        $match : 
        {
          AreaName: _AreaName,
          Day : _Day,
          Month: _Month,
          Year: _Year
        }
    },
      {$group: {
          _id : {Year : _Year, Month : _Month, Day : _Day},
          ActualTotalLoad : { "$sum" : "$TotalLoadValue"}
      }},
      {
        $lookup:
        {
          from: 'ResolutionCode',
          localField: 'ResolutionCodeId',
          foreignField : 'Id',
          as: "resolution_codes"
        }
      },
      {
        $unwind: {path : "$resolution_codes"}
      },

      { 
        $match : {'resolution_codes.ResolutionCodeText' : _Resolution}
      },
      {
        $lookup: {
          from: 'MapCode', 
          localField: 'MapCodeId', 
          foreignField: 'Id', 
          as : 'Map_Code'
        }
      }, {
        $unwind: {
          path: '$Map_Code'
        }
      }, {
        $lookup: {
          from: 'AreaTypeCode', 
          localField: 'AreaTypeCodeId', 
          foreignField: 'Id', 
          as: 'Area_Type_Code'
        }
      }, {
        $unwind: {
          path: '$Area_Type_Code'
        }
      }];

      var cursor = collection.aggregate(agg)

      await cursor.toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });

  })// connection ends here
})


/*
//erotima 1c
router.get('/:AreaName/:Resolution/:Year/:Month/:Day', (req, res) => {
  const _AreaName=req.params.AreaName
  const _Resolution=req.params.Resolution
  const _Year = parseInt(req.params.Year)
  const _Month = parseInt(req.params.Month)
  const _Day = parseInt(req.params.Day)

  MongoClient.connect(URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true}, 
    async (err, client) => {
      if (err) throw err; 
      else console.log('connected to db');
      assert.equal(null, err) 
      const db = client.db('energy')
      var collection = db.collection('ActualTotalLoad')
      const agg = [
        { 
          $match : 
          {
            AreaName: _AreaName,
            Day : _Day,
            Month: _Month,
            Year: _Year
          }
      },

        {
          $lookup:
          {
            from: 'ResolutionCode',
            localField: 'ResolutionCodeId',
            foreignField : 'Id',
            as: "resolution_codes"
          }
        },
        {
          $unwind: {path : "$resolution_codes"}
        },

        { 
          $match : {'resolution_codes.ResolutionCodeText' : _Resolution}
        },
        {
          $lookup: {
            from: 'MapCode', 
            localField: 'MapCodeId', 
            foreignField: 'Id', 
            as : 'Map_Code'
          }
        }, {
          $unwind: {
            path: '$Map_Code'
          }
        }, {
          $lookup: {
            from: 'AreaTypeCode', 
            localField: 'AreaTypeCodeId', 
            foreignField: 'Id', 
            as: 'Area_Type_Code'
          }
        }, {
          $unwind: {
            path: '$Area_Type_Code'
          }
        }, 
        {
          $project : 
          {
            _id:0,
            Source :'entso-e',
            Dataset :'ActualTotalLoad',
            AreaName: '$AreaName',
            AreaTypeCode: '$Area_Type_Code.AreaTypeCodeText',
            MapCode:'$Map_Code.MapCodeText',
            ResolutionCode : '$resolution_codes.ResolutionCodeText',
            Year : '$Year',
            Month : '$Month',
            Day : '$Day',
            DateTimeUTC: '$DateTime',
            ActualTotalLoadValue:"$TotalLoadValue",
            UpdateTimeUTC: '$UpdateTime'
          }
        },
        {
          $sort: {
            'DateTime': 1
          }
        }
      ];
      var cursor = collection.aggregate(agg)

      await cursor.toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });

  })// connection ends here
})

*/
module.exports = router;
