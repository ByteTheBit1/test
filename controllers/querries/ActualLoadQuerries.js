module.exports = [
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
]


/*GetDateQuerry =[
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




  module.exports.GetDateQ = "GetDateQuerry"

  */