let Querries = require('../Querries/AggregatedGenerationPerTypeQuerries')
const {Parser}           =  require('json2csv')



exports.GetDay = (req, res) => {

        //Check Date format
        if( (/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(req.params._date_str)) == false ){
            return res.status(400).json({" Bad request":"Date should be in YYYY-MM-DD format" })}

    let _date_str = req.params._date_str.split("-")
    let _Year =  parseInt(_date_str[0])
    let _Month = parseInt(_date_str[1])
    let _Day =   parseInt(_date_str[2])
    if( (!_Month) || ( !_Day)){
        return res.status(400).json({"Error 400":"Bad request" })
      }
    let _AreaName       = req.params._AreaName
    let _Resolution     = req.params._Resolution
    let _ProductionType = req.params._ProductionType
    let collection      = db.collection('AggregatedGenerationPerType')
    let agg    = Querries.Get_Date_Querry(_AreaName,_ProductionType,_Resolution,_Year,_Month,_Day)
    let cursor = collection.aggregate(agg)

/* send a csv response here */
        if(req.query.format=='csv'){
            res.setHeader('Content-Type', 'text/csv');
            //res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
        
            let fields = ['Source', 'Dataset','AreaName',"AreaTypeCode","MapCode","ResolutionCode","Year",
                        "Month","Day","DateTimeUTC","ProductionType","ActualGenerationOutputValue","UpdateTimeUTC"];//all field names
            
            let json2csvParser = new Parser({ fields });

            cursor.toArray((error, result) => {
            if(result.length==0) {
                return res.status(403).send('Error 403 : No data')} 
            res.send(json2csvParser.parse(result));
        });
        }   
/* JSON response here*/
        else{ // format will be json or undefined or random string
            res.setHeader('Content-Type', 'application/json');
            cursor.toArray((error, result) => {
                if(result.length==0) {
                return res.status(403).json({
                    error:'Error 403 : No data'
                    });
                } 
                res.send(result);
        });
        }
}

exports.GetMonth = (req, res) => {

        //Check Date format
        if( (/([12]\d{3}-(0[1-9]|1[0-2]) )/.test(req.params._date_str)) == false ){
            return res.status(400).json({" Bad request":"Invalid Date"  })}
    let _date_str = req.params._date_str.split("-")
    let _Year   = parseInt(_date_str[0])
    let _Month  = parseInt(_date_str[1])
    if(  !_Month){
        return res.status(400).json({"Error 400":"Bad request" })
      }
    let _AreaName   = req.params._AreaName
    let _Resolution = req.params._Resolution
    let _ProductionType = req.params._ProductionType
    let collection      = db.collection('AggregatedGenerationPerType')
    let agg = Querries.Get_Month_Querry (_AreaName,_ProductionType,_Resolution,_Year,_Month)

    let cursor = collection.aggregate(agg)

/* send a csv response here */
if(req.query.format == 'csv'){
    res.setHeader('Content-Type', 'text/csv');
    //res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');

    let fields = ['Source', 'Dataset','AreaName',"AreaTypeCode","MapCode","ResolutionCode","Year",
                "Month","Day","ProductionType","ActualGenerationOutputByDayValue"];//all field names
    
    let json2csvParser = new Parser({ fields });

    cursor.toArray((error, result) => {
    if(result.length==0) {
        return res.status(403).send('Error 403 : No data')} 
    res.send(json2csvParser.parse(result));
    });
}   
/* JSON response here*/
else{ // format will be json or undefined or random string
    res.setHeader('Content-Type', 'application/json');
    cursor.toArray((error, result) => {
        if(result.length==0) {
        return res.status(403).json({
            error:'Error 403 : No data'
            });
        } 
        res.send(result);
    });
}
}

exports.GetYear = (req,res,next)=>{

          const _Year = parseInt(req.params.Year)
          if(_Year<1950 || _Year>2050){ 
            return res.status(400).json({
              "Error 400":"Bad request",
              "Details":"Invalid Year"
            })
          }
    let _AreaName   = req.params._AreaName
    let _Resolution = req.params._Resolution
    let _ProductionType = req.params._ProductionType
    let collection = db.collection('AggregatedGenerationPerType')
    let agg = Querries.Get_Year_Querry (_AreaName,_ProductionType,_Resolution,_Year)
    let cursor = collection.aggregate(agg)


/* send a csv response here */
        if(req.query.format =='csv'){
            res.setHeader('Content-Type', 'text/csv');
            //res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');

            let fields = ['Source', 'Dataset','AreaName',"AreaTypeCode","MapCode","ResolutionCode","Year",
                        "Month","Day","ProductionType","ActualGenerationOutputByMonthValue"];//all field names
            
            let json2csvParser = new Parser({ fields });

            cursor.toArray((error, result) => {
            if(result.length == 0) {
                return res.status(403).send('Error 403 : No data')} 
            res.send(json2csvParser.parse(result));
            });
        }   
/* JSON response here*/
        else{ // format will be json or undefined or random string
            res.setHeader('Content-Type', 'application/json');
            cursor.toArray((error, result) => {
                if(result.length == 0) {
                return res.status(403).json({
                    error:'Error 403 : No data'
                    });
                } 
                res.send(result);
            });
        }
}
