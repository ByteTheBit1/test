const express = require('express');
const router = express.Router();




             /*        1a       */
// Ta sxolia sto dateObj einai peiramatismos gia to current date
// Gia Optional Metablites vazoume erotimatiko ? sto telos tou onomatos tous,alla meta 
// pagideuetai edo pera to querry kai den paei sta alla get
// Logika mporoume na kanoume mono ena get me tetoio styl:

/* get('/:AreaName/:Resolution/:Year?/:Month?/:Day?', (req,res,next) =>{
      edo pera kanoume to 1a kai meta kanoume next() etsi oste na pame sto 1b ktlp
})
*/

// Erotima 1a    
router.get('/:AreaName/:Resolution/date/:_date_str', (req, res) => {
  let _date_str = req.params._date_str.split("-")
  let _Year =  parseInt(_date_str[0])
  let _Month = parseInt(_date_str[1])
  let _Day =   parseInt(_date_str[2])
  let _AreaName = req.params.AreaName
  let _Resolution=req.params.Resolution
    /*let dateObj = new Date();
    let _Year = parseInt(req.params.Year)   || dateObj.getUTCFullYear();
    let _Month = parseInt(req.params.Month) || dateObj.getUTCMonth() + 1; //months from 1-12
    let _Day = parseInt(req.params.Day)     || dateObj.getUTCDate();

     console.log(_Year,_Month,_Day) // -> Checks for DATE Value  */

 
      let collection = db.collection('ActualTotalLoad')
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
      let cursor = collection.aggregate(agg)

       cursor.toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        if(result.length==0) {
          return res.status(403).json({
              error:'Error 403 : No data'
              });
          } 
        res.send(result);
    });
})






//erotima 1b 
router.get('/:AreaName/:Resolution/month/:_date_str', (req, res) => {
  let _date_str = req.params._date_str.split("-")
  let _Year =  parseInt(_date_str[0])
  let _Month = parseInt(_date_str[1])
  const _AreaName=req.params.AreaName
  const _Resolution=req.params.Resolution

      let collection = db.collection('ActualTotalLoad')
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
        ActualTotalLoadPerDay: {
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
        Dataset: 'ActualTotalLoad',
        AreaName: '$_id.AreaName',
        AreaTypeCode: '$Area_Type_Code.AreaTypeCodeText',
        MapCode: '$Map_Code.MapCodeText',
        ResolutionCode: '$resolution_codes.ResolutionCodeText',
        Year: { $toString:'$_id.Year'},
        Month: { $toString:'$_id.Month'},
        Day: { $toString:'$_id.Day'},
        ActualTotalLoadByDayValue: { $toString:'$ActualTotalLoadPerDay'}
      }}, {$sort: {
        Day: 1
      }}];

      let cursor = collection.aggregate(agg)

       cursor.toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        if(result.length==0) {
          return res.status(403).json({
              error:'Error 403 : No data'
              });
          } 
        res.send(result);
    });

})



//erotima 1c
router.get('/:AreaName/:Resolution/year/:Year/', (req, res) => {
  const _AreaName=req.params.AreaName
  const _Resolution=req.params.Resolution
  const _Year = parseInt(req.params.Year)

      let collection = db.collection('ActualTotalLoad')
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
        ActualTotalLoadByMonthValue: {
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
        Dataset: 'ActualTotalLoad',
        AreaName: '$_id.AreaName',
        AreaTypeCode: '$Area_Type_Code.AreaTypeCodeText',
        MapCode: '$Map_Code.MapCodeText',
        ResolutionCode: '$resolution_codes.ResolutionCodeText',
        Year: { $toString:'$_id.Year'},
        Month: { $toString:'$_id.Month'},
        ActualTotalLoadByMonthValue: { $toString:'$ActualTotalLoadByMonthValue'}
      }}, {$sort: {
        Month: 1
      }}];
      let cursor = collection.aggregate(agg)

       cursor.toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        if(result.length==0) {
          return res.status(403).json({
              error:'Error 403 : No data'
              });
          } 
        res.send(result);
    });

})


module.exports = router;
