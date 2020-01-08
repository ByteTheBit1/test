const express = require('express');
const router = express.Router();

//Erotima 2c
router.get('/:_AreaName/:_ProductionType/:_Resolution/:_Year',(req,res,next)=>{

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
            AreaName: req.params._AreaName,
            Year: req.params._Year
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
            'resolution_codes.ResolutionCodeText': req.params._Resolution
        }
    }, {
        $lookup: {
            from: 'ProductionType',
            localField: '_id.ProductionTypeId',
            foreignField: 'Id',
            as: 'Producton_Type'
        }
    }, {
        $unwind: {
            path: '$Producton_Type'
        }
    }, {
        $match:{
            '$Producton_Type.ProductionTypeText':_ProductionType
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
            Year: {
                $toString: '$_id.Year'
            },
            Month: {
                $toString: '$_id.Month'
            },
            ProductionType: '$Producton_Type.ProductionTypeText',
            ActualGenerationOutputByMonthValue: {
                $toString: '$ActualGenerationOutputByMonthValue'
            }
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