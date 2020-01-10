exports.GetDay = (req, res) => {
    let _date_str = req.params._date_str.split("-")
    let _Year =  parseInt(_date_str[0])
    let _Month = parseInt(_date_str[1])
    let _Day =   parseInt(_date_str[2])
    if( (!_Month) || ( !_Day)){
        return res.status(400).json({"Error 400":"Bad request" })
      }
    let _AreaName = req.params._AreaName
    let _Resolution=req.params._Resolution
    let _ProductionType=req.params._ProductionType

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

}

exports.GetMonth = (req, res) => {
    let _date_str = req.params._date_str.split("-")
    let _Year =  parseInt(_date_str[0])
    let _Month = parseInt(_date_str[1])
    if(  !_Month){
        return res.status(400).json({"Error 400":"Bad request" })
      }
    let _AreaName = req.params._AreaName
    let _Resolution=req.params._Resolution
    let _ProductionType=req.params._ProductionType

 

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

       cursor.toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });

}

exports.GetYear = (req,res,next)=>{

    let _AreaName = req.params._AreaName
    let _Resolution=req.params._Resolution
    let _ProductionType=req.params._ProductionType
    let _Year = parseInt(req.params._Year)   

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

}
