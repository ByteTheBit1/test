    const mongoose=require('mongoose');
    const ActualTotalLoadValueSchema = mongoose.Schema({

    
    Id : String,
    EntityCreatedAt : String,
    EntityModifiedAt : String, 
    MapCodeText:String,
    MapCodeNote : String

});

module.exports = mongoose.model("ActualTotalLoad",ActualTotalLoadValueSchema);