const mongoose=require('mongoose');
const ActualTotalLoadValueSchema = mongoose.Schema({

    Id : String,
    EntityCreatedAt : String,
    EntityModifiedAt : String,
    ActionTaskID :String, 
    Status: String, 
    Year: Number,
    Month : Number,
    Day : Number,
    DateTime : String,
    AreaName : String,
    UpdateTime : String,
    TotalLoadValue : Number,
    AreaTypeCodeId : String,
    AreaCodeId : String, 
    ResolutionCodeId : String,
    MapCodeId : String,
    RowHash: String
});

module.exports = mongoose.model("ActualTotalLoad",ActualTotalLoadValueSchema);