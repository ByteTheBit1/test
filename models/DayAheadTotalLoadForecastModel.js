const mongoose=require('mongoose');
const DayAheadTotalLoadForecastSchema = mongoose.Schema({

    Id : String,
    EntityCreatedAt : string,
    EntityModifiedAt : string,
    ActionTaskID : string,
    Status : NULL, 
    Year : NumberInt,
    Month : NumberInt, 
    Day : NumberInt,
    DateTime : ISODate,
    AreaName : string ,
    UpdateTime : ISODate,
    TotalLoadValue : NumberDecimal, 
    AreaTypeCodeId : string, 
    AreaCodeId : string, 
    ResolutionCodeId : string, 
    MapCodeId : string, 
    RowHash: string
});

module.exports = mongoose.model("DayAheadTotalLoadForecast",DayAheadTotalLoadForecastSchema);