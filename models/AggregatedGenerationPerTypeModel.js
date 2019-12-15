const mongoose=require('mongoose');
const AggregatedGenerationPerTypeSchema = mongoose.Schema({


    Id:string, 
    EntityCreatedAt : string, 
    EntityModifiedAt : string, 
    ActionTaskID : string, 
    Status : string, 
    Year : NumberInt, 
    Month : NumberInt,
    Day: NumberInt, 
    DateTime : string, 
    AreaName : string,
    UpdateTime : string, 
    ActualGenerationOutput : NumberDecimal, 
    ActualConsuption : NumberDecimal,
    AreaTypeCodeId : string, 
    AreaCodeId : string,
    ResolutionCodeId : string,
    MapCodeId : string,
    ProductionTypeId :string,
    RowHash: string,
});

    module.exports = mongoose.model("AggregatedGenerationPerType",AggregatedGenerationPerTypeSchema);