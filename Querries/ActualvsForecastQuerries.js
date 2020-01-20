module.exports ={ 

    Get_Date_Querry     : function(_AreaName,_Resolution,_Year,_Month,_Day){
        Q= [
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
          return Q
      
      },

    Get_Month_Querry    : function(_AreaName,_Resolution,_Year,_Month,_Day){
        Q=  [
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
          return Q
    },
       
    Get_Year_Querry     : function(_AreaName,_Resolution,_Year){
         Q=  [
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
              DayAheadTotalLoadForecastByMonthValue: { $toString:'$DayAheadTotalLoadForecast'},
              ActualTotalLoadByMonthValue : { $toString:'$ActualTotalLoadByDayValue'}
            }}, 
    
            {$sort: {Month: 1}
        }];
       
           return Q
       
       }
       
/* 
WORKING ON NEW QUERRIES

[{$match: {
  AreaName: 'Greece',
  Month: 1,
  Year: 2018
}}, {$lookup: {
  from: 'ResolutionCode',
  localField: '_id.ResolutionCodeId',
  foreignField: 'Id',
  as: 'resolution_codes'
}}, {$unwind: {

    path:'$resolution_codes'

  }}, {$match: {

    'resolution_codes.ResolutionCodeText': 'PT60M'
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
  path: '$Area_Type_Code'
}}, {$lookup: {
  from: 'ActualTotalLoad',
  'let': {
    actualTotalLoadValue: '$TotalLoadValue',
    area_Type_Id_Actual: '$AreaTypeCodeId',
    reso_Code_Id_Actual: '$ResolutionCodeId',
    map_Code_Id_Actual: '$MapCodeId',
    area_Name_Actual: '$AreaName',
    y: '$Year',
    m: '$Month',
    d: '$Day'
  },
  pipeline: [
    {
      $match: {
        $expr: {
          $and: [
            {
              $eq: [
                '$AreaTypeCodeId',
                '$$area_Type_Id_Actual'
              ]
            },
            {
              $eq: [
                '$ResolutionCodeId',
                '$$reso_Code_Id_Actual'
              ]
            },
            {
              $eq: [
                '$MapCodeId',
                '$$map_Code_Id_Actual'
              ]
            },
            {
              $eq: [
                '$AreaName',
                '$$area_Name_Actual'
              ]
            },
            {
              $eq: [
                '$Year',
                '$$y'
              ]
            },
            {
              $eq: [
                '$Month',
                '$$m'
              ]
            },
            {
              $eq: [
                '$Day',
                '$$d'
              ]
            }
          ]
        }
      }
    },
    {
      $project: {
        _id: 0
      }
    }
  ],
  as: 'Actual_Total_Load'
}}, {$unwind: {
  path: '$Actual_Total_Load'
}}, {$group: {
  _id: {
    Day: '$Day',
    Year: '$Year',
    Month: '$Month',
    AreaName: '$AreaName',
    AreaCodeId: '$AreaCodeId',
    MapCodeId: '$MapCodeId'
  },
  DayAheadTotalLoadForecast: {
    $sum: '$TotalLoadValue'
  },
  ActualTotalLoadByDayValue: {
    $sum: '$Actual_Total_Load.TotalLoadValue'
  },

      AreaTypeCode: {$first:'$Area_Type_Code.AreaTypeCodeText'},
    MapCode: {$first:'$Map_Code.MapCodeText'},


}}, {$project: {
  _id: 0,
  Source: 'entso-e',
  Dataset: 'ActualVSForecastedTotalLoad',
  AreaName: '$_id.AreaName',
  AreaTypeCode: '$AreaTypeCode',
  MapCode: '$MapCode',
  ResolutionCode: '$resolution_codes.ResolutionCodeText',
  Year: {
    $toString: '$_id.Year'
  },
  Month: {
    $toString: '$_id.Month'
  },
  Day: {
    $toString: '$_id.Day'
  },
  DayAheadTotalLoadForecastByDayValue: {
    $toString: '$DayAheadTotalLoadForecast'
  },
  ActualTotalLoadByDayValue: {
    $toString: '$ActualTotalLoadByDayValue'
  }
}}, {$sort: {
  Day: 1
}}]

*/
