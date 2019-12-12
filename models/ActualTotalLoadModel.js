const mongoose=require('mongoose');
const ActualTotalLoadValueSchema = mongoose.Schema({

    Source: String,
    Dataset: String,
    AreaName: String,
    AreaTypeCode: String,
    MapCode: String,
    ResolutionCode: String,
    Year: Number,
    Month: Number,
    Day: Number,
    DateTimeUTC: String,
    ActualTotalLoadValue: Number,
    UpdateTimeUTC: String
});

module.exports = mongoose.model("ActualTotalLoad",ActualTotalLoadValueSchema);