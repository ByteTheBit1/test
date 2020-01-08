const express = require('express');
const router = express.Router();
const assert = require('assert')
const URL = 'mongodb+srv://user:user@cluster0-0pwss.mongodb.net/test?retryWrites=true&w=majority'
const MongoClient = require('mongodb').MongoClient


//Erotima 3a
router.get('/:_AreaName/:_Resolution/date/:_date_str',(req,res,next)=>{

    let _date_str = req.params._date_str.split("-")
    let _Year =  parseInt(_date_str[0])
    let _Month = parseInt(_date_str[1])
    let _Day =   parseInt(_date_str[2])
    let _AreaName = req.params._AreaName
    let _Resolution=req.params._Resolution

    
    console.log(_Year,_Month,_Day)

   MongoClient.connect(URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true}, 
        async (err, client) => {
          if (err) throw err; 
          else console.log('connected to db');
          assert.equal(null, err) 
          const db = client.db('energy')
          let collection = db.collection('DayAheadTotalLoadForecast')
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
                Dataset :'DayAheadTotalLoadForecast',
                AreaName: '$AreaName',
                AreaTypeCode: '$Area_Type_Code.AreaTypeCodeText',
                MapCode:'$Map_Code.MapCodeText',
                ResolutionCode : '$resolution_codes.ResolutionCodeText',
                Year :   { $toString: "$Year" },
                Month :  { $toString: "$Month" },
                Day :    { $toString: "$Day" },
                DateTimeUTC: '$DateTime',
                DayAheadTotalLoadForecast: { $toString: "$TotalLoadValue" },
                UpdateTimeUTC: '$UpdateTime'
              }
            },
            {
              $sort: {
                'DateTime': 1
              }
            }
          ];
          let cursor = collection.aggregate(agg)
    
          await cursor.toArray((error, result) => {
            if(error) {
                return res.status(500).send(error);
            }
            res.send(result);
        });
    
      })// connection ends here
      
    })

    








    //erotima 3b
router.get('/:AreaName/:Resolution/month/:_date_str', (req, res) => {
    const _AreaName=req.params.AreaName
    const _Resolution=req.params.Resolution
    let _date_str = req.params._date_str.split("-")
    let _Year =  parseInt(_date_str[0])
    let _Month = parseInt(_date_str[1])
  
    MongoClient.connect(URL,{
      useNewUrlParser: true,
      useUnifiedTopology: true}, 
      async (err, client) => {
        if (err) throw err; 
        else console.log('connected to db');
        assert.equal(null, err) 
        const db = client.db('energy')
        let collection = db.collection('DayAheadTotalLoadForecast')
        const agg =
      [
        {$match: {
          AreaName: _AreaName,
          Month: _Month,
          Year: _Year
        }}, {$group: {
          _id: {
            Day:"$Day",
            Year:"$Year",
            Month:"$Month", 
            AreaName: "$AreaName",
            AreaTypeCodeId:"$AreaTypeCodeId",
            AreaCodeId:"$AreaCodeId",
            ResolutionCodeId:"$ResolutionCodeId",
            MapCodeId:"$MapCodeId"
          },
          DayAheadTotalLoadForecast: {
            $sum: "$TotalLoadValue"
          },
        }}, {$lookup: {
              'from': 'ResolutionCode', 
              'localField': '_id.ResolutionCodeId', 
              'foreignField': 'Id', 
              'as': 'resolution_codes'
            }}, {$unwind: {
          path: '$resolution_codes'
        }}, {$match: {
          'resolution_codes.ResolutionCodeText': _Resolution
        }}, {$lookup: {
          from: 'MapCode',
          localField: '_id.MapCodeId',
          foreignField: 'Id',
          as: 'Map_Code'
        }}, {$unwind: {
          path: '$Map_Code'
        }}, {$lookup: {
          from: 'AreaTypeCode',
          localField: '_id.AreaTypeCodeId',
          foreignField: 'Id',
          as: 'Area_Type_Code'
        }}, {$unwind: {
        
        
              path:'$Area_Type_Code'
        
        
            }}, {$project: {
          _id:0,
          Source: 'entso-e',
          Dataset: 'DayAheadTotalLoadForecast',
          AreaName: '$_id.AreaName',
          AreaTypeCode: '$Area_Type_Code.AreaTypeCodeText',
          MapCode: '$Map_Code.MapCodeText',
          ResolutionCode: '$resolution_codes.ResolutionCodeText',
          Year: { $toString:'$_id.Year'},
          Month: { $toString:'$_id.Month'},
          Day: { $toString:'$_id.Day'},
          DayAheadTotalLoadForecastByDayValue: { $toString:'$DayAheadTotalLoadForecast'}
        }}, {$sort: {
          Day: 1
        }}];
  
        let cursor = collection.aggregate(agg)
  
        await cursor.toArray((error, result) => {
          if(error) {
              return res.status(500).send(error);
          }
          res.send(result);
      });
  
    })// connection ends here
  })









  
//erotima 3c
router.get('/:AreaName/:Resolution/year/:Year/', (req, res) => {
    const _AreaName=req.params.AreaName
    const _Resolution=req.params.Resolution
    const _Year = parseInt(req.params.Year)
  
    MongoClient.connect(URL,{
      useNewUrlParser: true,
      useUnifiedTopology: true}, 
      async (err, client) => {
        if (err) throw err; 
        else console.log('connected to db');
        assert.equal(null, err) 
        const db = client.db('energy')
        let collection = db.collection('DayAheadTotalLoadForecast')
        const agg = [{$match: {
          AreaName: _AreaName,
          Year: _Year
        }}, {$group: {
          _id: {
            Year:"$Year",
            Month:"$Month", 
            AreaName: "$AreaName",
            AreaTypeCodeId:"$AreaTypeCodeId",
            AreaCodeId:"$AreaCodeId",
            ResolutionCodeId:"$ResolutionCodeId",
            MapCodeId:"$MapCodeId"
          },
          DayAheadTotalLoadForecastByMonthValue: {
            $sum: "$TotalLoadValue"
          },
        }}, {$lookup: {
              'from': 'ResolutionCode', 
              'localField': '_id.ResolutionCodeId', 
              'foreignField': 'Id', 
              'as': 'resolution_codes'
            }}, {$unwind: {
          path: '$resolution_codes'
        }}, {$match: {
          'resolution_codes.ResolutionCodeText': _Resolution
        }}, {$lookup: {
          from: 'MapCode',
          localField: '_id.MapCodeId',
          foreignField: 'Id',
          as: 'Map_Code'
        }}, {$unwind: {
          path: '$Map_Code'
        }}, {$lookup: {
          from: 'AreaTypeCode',
          localField: '_id.AreaTypeCodeId',
          foreignField: 'Id',
          as: 'Area_Type_Code'
        }}, {$unwind: {
        
        
              path:'$Area_Type_Code'
        
        
            }}, {$project: {
          _id:0,
          Source: 'entso-e',
          Dataset: 'DayAheadTotalLoadForecast',
          AreaName: '$_id.AreaName',
          AreaTypeCode: '$Area_Type_Code.AreaTypeCodeText',
          MapCode: '$Map_Code.MapCodeText',
          ResolutionCode: '$resolution_codes.ResolutionCodeText',
          Year: { $toString:'$_id.Year'},
          Month: { $toString:'$_id.Month'},
          DayAheadTotalLoadForecastByMonthValue: { $toString:'$DayAheadTotalLoadForecastByMonthValue'}
        }}, {$sort: {
          Month: 1
        }}];
        let cursor = collection.aggregate(agg)
  
        await cursor.toArray((error, result) => {
          if(error) {
              return res.status(500).send(error);
          }
          res.send(result);
      });
  
    })// connection ends here
  })





module.exports = router;