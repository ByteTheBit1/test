
    const mongoose=require('mongoose');
    const ActualTotalLoadValueSchema = mongoose.Schema({
    
        Id : String,
        EntityCreatedAt : String, 
        EntityModifiedAt : String,
        ProductionTypeText : String,
        ProductionTypeNote : String

},
{ 
    collection : 'ProductionType' 
});

module.exports = mongoose.model("ActualTotalLoad",ActualTotalLoadValueSchema);