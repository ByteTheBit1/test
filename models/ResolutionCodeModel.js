
    const mongoose=require('mongoose');
    const ResolutionCodeSchema = new mongoose.Schema({

        _id: mongoose.Schema.Types.ObjectId,
        Id : String,
        EntityCreatedAt : String,
        EntityModifiedAt : String,
        ResolutionCodeText : String, 
        ResolutionCodeNote : String
    

});

module.exports = mongoose.model("ResolutionCode",ResolutionCodeSchema);