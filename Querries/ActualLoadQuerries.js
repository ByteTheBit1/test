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
          return Q
      
      },

    Get_Month_Querry    : function(_AreaName,_Resolution,_Year,_Month,_Day){
        Q= [
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
          return Q
    },
       
    Get_Year_Querry     : function(_AreaName,_Resolution,_Year){
         Q= [{$match: {
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
       
           return Q
       
       }
       
}// export module ends here