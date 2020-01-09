exports.GetDate =(req,res,next)=>{

    let _date_str = req.params._date_str.split("-")
    let _Year =  parseInt(_date_str[0])
    let _Month = parseInt(_date_str[1])
    let _Day =   parseInt(_date_str[2])
    let _AreaName = req.params._AreaName
    let _Resolution=req.params._Resolution

    
    console.log(_Year,_Month,_Day)

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
            }, {
                $lookup: {
                    from: 'ActualTotalLoad',
                    let:{
                        actualTotalLoadValue:"$TotalLoadValue",
                        area_Type_Id_Actual:"$AreaTypeCodeId",
                        reso_Code_Id_Actual:"$ResolutionCodeId",
                        map_Code_Id_Actual:"$MapCodeId",
                        area_Name_Actual:"$AreaName",
                        y:"$Year",
                        m:"$Month",
                        d:"$Day"
                    },
                    pipeline: [
                        { $match:
                           { $expr:
                              { $and:
                                 [
                                   { $eq: [ "$AreaTypeCodeId",  "$$area_Type_Id_Actual" ] },
                                   { $eq: [ "$ResolutionCodeId",  "$$reso_Code_Id_Actual" ] },
                                   { $eq: [ "$MapCodeId",  "$$map_Code_Id_Actual" ] },
                                   { $eq: [ "$AreaName",  "$$area_Name_Actual" ] },
                                   { $eq: [ "$Year",  "$$y" ] },
                                   { $eq: [ "$Month",  "$$m" ] },
                                   { $eq: [ "$Day",  "$$d" ] },
                                 ]
                              }
                           }
                        },
                        { $project: {  
                            _id: 0
                        } }
                     ],
                     as: "Actual_Total_Load"
                }
              },{
                $unwind: {
                  path: '$Actual_Total_Load'
                }
              },{
              $project : 
              {
                _id:0,
                Source :'entso-e',
                Dataset :'ActualVSForecastedTotalLoad',
                AreaName: '$AreaName',
                AreaTypeCode: '$Area_Type_Code.AreaTypeCodeText',
                MapCode:'$Map_Code.MapCodeText',
                ResolutionCode : '$resolution_codes.ResolutionCodeText',
                Year :   { $toString: "$Year" },
                Month :  { $toString: "$Month" },
                Day :    { $toString: "$Day" },
                DateTimeUTC: '$DateTime',
                DayAheadTotalLoadForecastValue: { $toString: "$TotalLoadValue" },
                ActualTotalLoadValue: { $toString: "$Actual_Total_Load.ActualTotalLoadValue" }
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
    
      
    }

    exports.GetMonth = (req, res) => {
        const _AreaName=req.params.AreaName
        const _Resolution=req.params.Resolution
        let _date_str = req.params._date_str.split("-")
        let _Year =  parseInt(_date_str[0])
        let _Month = parseInt(_date_str[1])
      
            let collection = db.collection('DayAheadTotalLoadForecast')
            const agg =
          [
            {$match: {
              AreaName: _AreaName,
              Month: _Month,
              Year: _Year
            }},{
                $lookup: {
                    from: 'ActualTotalLoad',
                    let:{
                        actualTotalLoadValue:"$TotalLoadValue",
                        area_Type_Id_Actual:"$AreaTypeCodeId",
                        reso_Code_Id_Actual:"$ResolutionCodeId",
                        map_Code_Id_Actual:"$MapCodeId",
                        area_Name_Actual:"$AreaName",
                        y:"$Year",
                        m:"$Month",
                        d:"$Day"
                    },
                    pipeline: [
                        { $match:
                           { $expr:
                              { $and:
                                 [
                                   { $eq: [ "$AreaTypeCodeId",  "$$area_Type_Id_Actual" ] },
                                   { $eq: [ "$ResolutionCodeId",  "$$reso_Code_Id_Actual" ] },
                                   { $eq: [ "$MapCodeId",  "$$map_Code_Id_Actual" ] },
                                   { $eq: [ "$AreaName",  "$$area_Name_Actual" ] },
                                   { $eq: [ "$Year",  "$$y" ] },
                                   { $eq: [ "$Month",  "$$m" ] },
                                   { $eq: [ "$Day",  "$$d" ] },
                                 ]
                              }
                           }
                        },
                        { $project: {  
                            _id: 0
                        } }
                     ],
                     as: "Actual_Total_Load"
                }
              },{
                $unwind: {
                  path: '$Actual_Total_Load'
                }
              },{
        $group: {
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
              ActualTotalLoadByDayValue:{
                  $sum : "$Actual_Total_Load.TotalLoadValue"
              }
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
            }}, {
                $unwind: { path:'$Area_Type_Code'}
            }, {
        $project: {
              _id:0,
              Source: 'entso-e',
              Dataset: 'ActualVSForecastedTotalLoad',
              AreaName: '$_id.AreaName',
              AreaTypeCode: '$Area_Type_Code.AreaTypeCodeText',
              MapCode: '$Map_Code.MapCodeText',
              ResolutionCode: '$resolution_codes.ResolutionCodeText',
              Year: { $toString:'$_id.Year'},
              Month: { $toString:'$_id.Month'},
              Day: { $toString:'$_id.Day'},
              DayAheadTotalLoadForecastByDayValue: { $toString:'$DayAheadTotalLoadForecast'},
              ActualTotalLoadByDayValue : { $toString:'$ActualTotalLoadByDayValue'}
            }}, 
    
            {$sort: {Day: 1}
        }];
      
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
      
      }


    exports.GetYear = (req, res) => {
        const _AreaName=req.params.AreaName
        const _Resolution=req.params.Resolution
        let _Year =  parseInt(req.params._Year)
      
            let collection = db.collection('DayAheadTotalLoadForecast')
            const agg =
          [
            {$match: {
              AreaName: _AreaName,
              Year: _Year
            }},{
                $lookup: {
                    from: 'ActualTotalLoad',
                    let:{
                        actualTotalLoadValue:"$TotalLoadValue",
                        area_Type_Id_Actual:"$AreaTypeCodeId",
                        reso_Code_Id_Actual:"$ResolutionCodeId",
                        map_Code_Id_Actual:"$MapCodeId",
                        area_Name_Actual:"$AreaName",
                        y:"$Year",
                        m:"$Month"
                    },
                    pipeline: [
                        { $match:
                           { $expr:
                              { $and:
                                 [
                                   { $eq: [ "$AreaTypeCodeId",  "$$area_Type_Id_Actual" ] },
                                   { $eq: [ "$ResolutionCodeId",  "$$reso_Code_Id_Actual" ] },
                                   { $eq: [ "$MapCodeId",  "$$map_Code_Id_Actual" ] },
                                   { $eq: [ "$AreaName",  "$$area_Name_Actual" ] },
                                   { $eq: [ "$Year",  "$$y" ] },
                                   { $eq: [ "$Month",  "$$m" ] }
                                 ]
                              }
                           }
                        },
                        { $project: {  
                            _id: 0
                        } }
                     ],
                     as: "Actual_Total_Load"
                }
              },{
                $unwind: {
                  path: '$Actual_Total_Load'
                }
              },{
        $group: {
              _id: {
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
              ActualTotalLoadByDayValue:{
                  $sum : "$Actual_Total_Load.TotalLoadValue"
              }
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
            }}, {
                $unwind: { path:'$Area_Type_Code'}
            }, {
        $project: {
              _id:0,
              Source: 'entso-e',
              Dataset: 'ActualVSForecastedTotalLoad',
              AreaName: '$_id.AreaName',
              AreaTypeCode: '$Area_Type_Code.AreaTypeCodeText',
              MapCode: '$Map_Code.MapCodeText',
              ResolutionCode: '$resolution_codes.ResolutionCodeText',
              Year: { $toString:'$_id.Year'},
              Month: { $toString:'$_id.Month'},
              DayAheadTotalLoadForecastByDayValue: { $toString:'$DayAheadTotalLoadForecast'},
              ActualTotalLoadByDayValue : { $toString:'$ActualTotalLoadByDayValue'}
            }}, 
    
            {$sort: {Month: 1}
        }];
      
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
      
      }