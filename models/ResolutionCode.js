
    const mongoose=require('mongoose');
    const ResolutionCodeSchema = mongoose.Schema({

        _id: ObjectId,
        Id : String,
        EntityCreatedAt : String,
        EntityModifiedAt : String,
        ResolutionCodeText : String, 
        ResolutionCodeNote : String
    

});

module.exports = mongoose.model("ResolutionCode",ResolutionCodeSchema);