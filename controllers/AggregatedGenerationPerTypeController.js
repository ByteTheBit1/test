Querries = require('../Querries/AggregatedGenerationPerTypeQuerries')


exports.GetDay = (req, res) => {
    // simple counter to count all requests for specific user
    if(!req.session.counter){req.session.counter=1}
    else{
        req.session.counter++
        console.log('request number:',req.session.counter)
      }

    let _date_str = req.params._date_str.split("-")
    let _Year =  parseInt(_date_str[0])
    let _Month = parseInt(_date_str[1])
    let _Day =   parseInt(_date_str[2])
    if( (!_Month) || ( !_Day)){
        return res.status(400).json({"Error 400":"Bad request" })
      }
    let _AreaName = req.params._AreaName
    let _Resolution=req.params._Resolution
    let _ProductionType=req.params._ProductionType

          var collection = db.collection('AggregatedGenerationPerType')

          const agg = Querries.Get_Date_Querry(_AreaName,_Resolution,_Year,_Month,_Day)


    var cursor = collection.aggregate(agg)

       cursor.toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        if(result.length==0) {
            return res.status(403).json({
                error:'Error 403 : No data'
                });
            } 
        res.send(result);
    });

}

exports.GetMonth = (req, res) => {
    // simple counter to count all requests for specific user
    if(!req.session.counter){req.session.counter=1}
    else{
        req.session.counter++
        console.log('request number:',req.session.counter)
      }

    let _date_str = req.params._date_str.split("-")
    let _Year =  parseInt(_date_str[0])
    let _Month = parseInt(_date_str[1])
    if(  !_Month){
        return res.status(400).json({"Error 400":"Bad request" })
      }
    let _AreaName = req.params._AreaName
    let _Resolution=req.params._Resolution
    let _ProductionType=req.params._ProductionType

 

          var collection = db.collection('AggregatedGenerationPerType')

          const agg = Querries.Get_Month_Querry (_AreaName,_Resolution,_Year,_Month)


    var cursor = collection.aggregate(agg)

       cursor.toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });

}

exports.GetYear = (req,res,next)=>{
// simple counter to count all requests for specific user
        if(!req.session.counter){req.session.counter=1}
        else{
            req.session.counter++
            console.log('request number:',req.session.counter)
          }
        
    let _AreaName = req.params._AreaName
    let _Resolution=req.params._Resolution
    let _ProductionType=req.params._ProductionType
    let _Year = parseInt(req.params._Year)   

          var collection = db.collection('AggregatedGenerationPerType')

          const agg = Querries.Get_Year_Querry (_AreaName,_Resolution,_Year)


    var cursor = collection.aggregate(agg)

       cursor.toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        if(result.length==0) {
            return res.status(403).json({
                error:'Error 403 : No data'
                });
            } 
        res.send(result);
    });

}
