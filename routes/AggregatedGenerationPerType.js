const express = require('express');
const router = express.Router();
const assert = require('assert')
const URL = 'mongodb+srv://user:user@cluster0-0pwss.mongodb.net/test?retryWrites=true&w=majority'
const MongoClient = require('mongodb').MongoClient


//Erotima 2a
router.get('/:_AreaName/:_ProductionType/:_Resolution/:_Year/:_Month/:_Day',(req,res,next)=>{
    let _AreaName = req.params._AreaName
    let _Resolution=req.params._Resolution
    let _ProductionType=req.params._ProductionType
    let _Year = parseInt(req.params._Year)   
    let _Month = parseInt(req.params._Month) 
    let _Day = parseInt(req.params._Day)    

    MongoClient.connect(URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true}, 
        async (err, client) => {
          if (err) throw err; 
          else console.log('connected to db');
          assert.equal(null, err) 
          const db = client.db('energy')
          var collection = db.collection('AggregatedGenerationPerType')

          const agg = [{
        $match: {
            AreaName: _AreaName,
            Day: _Day,
            Month: _Month,
            Year: _Year
          }}, {
        $lookup: {
            from: 'ResolutionCode',
            localField: 'ResolutionCodeId',
            foreignField: 'Id',
            as: 'resolution_codes'
          }}, {$unwind: {path: '$resolution_codes'}
        }, {
            $match: {'resolution_codes.ResolutionCodeText': _Resolution}
        }, {
        $lookup: {
            from: 'ProductionType',
            localField: 'ProductionTypeId',
            foreignField: 'Id',
            as: 'Production_Type'
          }}, {$unwind: { path: '$Production_Type'}
        }, {
        $match: { 'Production_Type.ProductionTypeText': _ProductionType}
        }, {
        $lookup: {
            from: 'MapCode',
            localField: 'MapCodeId',
            foreignField: 'Id',
            as: 'Map_Code'
          }}, {$unwind: {path: '$Map_Code'
          }}, {
        $lookup: {
            from: 'AreaTypeCode',
            localField: 'AreaTypeCodeId',
            foreignField: 'Id',
            as: 'Area_Type_Code'
          }}, {$unwind: {path: '$Area_Type_Code'
          }}, {
        $project: {
            _id: 0,
            Source: 'entso-e',
            Dataset: 'AggregatedGenerationPerType',
            AreaName: '$AreaName',
            AreaTypeCode: '$Area_Type_Code.AreaTypeCodeText',
            MapCode: '$Map_Code.MapCodeText',
            ResolutionCode: '$resolution_codes.ResolutionCodeText',
            Year:  { $toString: '$Year'},
            Month: {$toString: '$Month' },
            Day:   {$toString: '$Day'},
            ProductionType: _ProductionType,
            DateTimeUTC: '$DateTime',
            ActualGenerationOutputValue: {$toString: '$ActualGenerationOutput' },
            UpdateTimeUTC: '$UpdateTime'
          }}, 
          {
        $sort: { DateTime: 1 }
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












































//Erotima 2b
router.get('/:_AreaName/:_ProductionType/:_Resolution/:_Year/:_Month',(req,res,next)=>{

    let _AreaName = req.params._AreaName
    let _Resolution=req.params._Resolution
    let _ProductionType=req.params._ProductionType
    let _Year = parseInt(req.params._Year)  
    let _Month = parseInt(req.params._Month)   
 


    MongoClient.connect(URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true}, 
        async (err, client) => {
          if (err) throw err; 
          else console.log('connected to db');
          assert.equal(null, err) 
          const db = client.db('energy')
          var collection = db.collection('AggregatedGenerationPerType')

          const agg = [{
        $match: {
            AreaName: _AreaName,
            Year: _Year,
            Month:_Month
        }
    }, {
        $group: {
            _id: {
                Year: '$Year',
                Month: '$Month',
                Day:'$Day',
                AreaName: '$AreaName',
                AreaTypeCodeId: '$AreaTypeCodeId',
                AreaCodeId: '$AreaCodeId',
                ResolutionCodeId: '$ResolutionCodeId',
                MapCodeId: '$MapCodeId',
                ProductionTypeId: '$ProductionTypeId'
            },
            ActualGenerationOutputByDayValue: {
                $sum: '$ActualGenerationOutput'
            }
        }
    }, {
        $lookup: {
            from: 'ResolutionCode',
            localField: '_id.ResolutionCodeId',
            foreignField: 'Id',
            as: 'resolution_codes'
        }
    }, {
        $unwind: {
            path: '$resolution_codes'
        }
    }, {
        $match: {
            'resolution_codes.ResolutionCodeText': _Resolution
        }
    }, {
        $lookup: {
            from: 'ProductionType',
            localField: '_id.ProductionTypeId',
            foreignField: 'Id',
            as: 'Production_Type'
        }
    }, {
        $unwind: {
            path: '$Production_Type'
        }
    }, {
        $match:{
            'Production_Type.ProductionTypeText':_ProductionType
        }
    },{
        $lookup: {
            from: 'MapCode',
            localField: '_id.MapCodeId',
            foreignField: 'Id',
            as: 'Map_Code'
        }
    }, {
        $unwind: {
            path: '$Map_Code'
        }
    }, {
        $lookup: {
            from: 'AreaTypeCode',
            localField: '_id.AreaTypeCodeId',
            foreignField: 'Id',
            as: 'Area_Type_Code'
        }
    }, {
        $unwind: {
            path: '$Area_Type_Code'
        }
    }, 
    {
        $project: {
            _id: 0,
            Source: 'entso-e',
            Dataset: 'AggregatedGenerationPerType',
            AreaName: '$_id.AreaName',
            AreaTypeCode: '$Area_Type_Code.AreaTypeCodeText',
            MapCode: '$Map_Code.MapCodeText',
            ResolutionCode: '$resolution_codes.ResolutionCodeText',
            Year:  { $toString: '$_id.Year'},
            Month: {$toString: '$_id.Month'},
            Day: {$toString: '$_id.Day'},
            ProductionType: '$Production_Type.ProductionTypeText',
            ActualGenerationOutputByDayValue: {$toString: '$ActualGenerationOutputByDayValue'}
        }
    }, {
        $sort: {
            Month: 1
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

module.exports = router;








































//Erotima 2c
router.get('/:_AreaName/:_ProductionType/:_Resolution/:_Year',(req,res,next)=>{

    let _AreaName = req.params._AreaName
    let _Resolution=req.params._Resolution
    let _ProductionType=req.params._ProductionType
    let _Year = parseInt(req.params._Year)   


    MongoClient.connect(URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true}, 
        async (err, client) => {
          if (err) throw err; 
          else console.log('connected to db');
          assert.equal(null, err) 
          const db = client.db('energy')
          var collection = db.collection('AggregatedGenerationPerType')

          const agg = [{
        $match: {
            AreaName: _AreaName,
            Year: _Year
        }
    }, {
        $group: {
            _id: {
                Year: '$Year',
                Month: '$Month',
                AreaName: '$AreaName',
                AreaTypeCodeId: '$AreaTypeCodeId',
                AreaCodeId: '$AreaCodeId',
                ResolutionCodeId: '$ResolutionCodeId',
                MapCodeId: '$MapCodeId',
                ProductionTypeId: '$ProductionTypeId'
            },
            ActualGenerationOutputByMonthValue: {
                $sum: '$ActualGenerationOutput'
            }
        }
    }, {
        $lookup: {
            from: 'ResolutionCode',
            localField: '_id.ResolutionCodeId',
            foreignField: 'Id',
            as: 'resolution_codes'
        }
    }, {
        $unwind: {
            path: '$resolution_codes'
        }
    }, {
        $match: {
            'resolution_codes.ResolutionCodeText': _Resolution
        }
    }, {
        $lookup: {
            from: 'ProductionType',
            localField: '_id.ProductionTypeId',
            foreignField: 'Id',
            as: 'Production_Type'
        }
    }, {
        $unwind: {
            path: '$Production_Type'
        }
    }, {
        $match:{
            'Production_Type.ProductionTypeText':_ProductionType
        }
    },{
        $lookup: {
            from: 'MapCode',
            localField: '_id.MapCodeId',
            foreignField: 'Id',
            as: 'Map_Code'
        }
    }, {
        $unwind: {
            path: '$Map_Code'
        }
    }, {
        $lookup: {
            from: 'AreaTypeCode',
            localField: '_id.AreaTypeCodeId',
            foreignField: 'Id',
            as: 'Area_Type_Code'
        }
    }, {
        $unwind: {
            path: '$Area_Type_Code'
        }
    }, 
    {
        $project: {
            _id: 0,
            Source: 'entso-e',
            Dataset: 'AggregatedGenerationPerType',
            AreaName: '$_id.AreaName',
            AreaTypeCode: '$Area_Type_Code.AreaTypeCodeText',
            MapCode: '$Map_Code.MapCodeText',
            ResolutionCode: '$resolution_codes.ResolutionCodeText',
            Year:  { $toString: '$_id.Year'},
            Month: {$toString: '$_id.Month'},
            ProductionType: '$Production_Type.ProductionTypeText',
            ActualGenerationOutputByMonthValue: {$toString: '$ActualGenerationOutputByMonthValue'}
        }
    }, {
        $sort: {
            Month: 1
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

module.exports = router;