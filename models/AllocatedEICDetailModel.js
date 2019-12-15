
    const mongoose=require('mongoose');
    const AllocatedEICDetailSchema = mongoose.Schema({
    
        Id : String,
        EntityCreatedAt: String,
        EntityModifiedAt : String,
        MRID: String,
        DocStatusValue : String,
        AttributeInstanceComponent: String, 
        LongNames : String,
        DisplayNames : String, 
        LastRequestDateAndOrTime : String,
        DeactivateRequestDateAndOrTime : String,
        MarketParticipantStreetAddressCountry : String,
        MarketParticipantACERCode: String,
        MarketParticipantVATcode : String, 
        Description : String,
        EICParentMarketDocumentMRID : String,
        ELCResponsibleMarketParticipantMRID :String, 
        IsDeleted : NumberInt,
        AllocatedEICID: String

});

module.exports = mongoose.model("AllocatedEICDetail",AllocatedEICDetailSchema);