const ActualLoadQuerries =  require('../Querries/ActualLoadQuerries');
const {Parser}           =  require('json2csv')


exports.GetDate=(req, res) => {
  
  // simple counter to count all requests for specific user
  if(!req.session.counter){req.session.counter=1}
  else{
    req.session.counter++
    console.log('request number:',req.session.counter)

  }
    let _AreaName   = req.params.AreaName
    let _Resolution = req.params.Resolution 
    let _date_str = req.params._date_str.split("-")
    let _Year =  parseInt(_date_str[0])
    let _Month = parseInt(_date_str[1])
    let _Day =   parseInt(_date_str[2])
    if( (!_Month) || ( !_Day)){
      return res.status(400).json({"Error 400":"Bad request" })
    }
    let collection  = db.collection('ActualTotalLoad')
    let agg         = ActualLoadQuerries.Get_Date_Querry(_AreaName,_Resolution,_Year,_Month,_Day)
    let cursor      = collection.aggregate(agg)
    let format = req.query.format
    if(!format){ format = 'json' }

    /* send a csv response here */
    if(format =='csv'){  
        res.setHeader('Content-Type', 'text/csv');
        //res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
       
        let fields = ['Source', 'Dataset','AreaName',"AreaTypeCode","MapCode","ResolutionCode","Year",
                    "Month","Day","DateTimeUTC","ActualTotalLoadValue","UpdateTimeUTC"];//all field names
        
       let json2csvParser = new Parser({ fields });

        cursor.toArray((error, result) => {
          if(result.length==0) {
            return res.status(403).json({
                error:'Error 403 : No data'
                });
            } 
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

  exports.GetCurrentDate=(req, res) => {
    // simple counter to count all requests for specific user
    if(!req.session.counter){req.session.counter=1}
    else{
      req.session.counter++
      console.log('request number:',req.session.counter)
    }
      let _AreaName  = req.params.AreaName
      let _Resolution= req.params.Resolution
      let dateObj   =  new Date();
      let _Year     =  dateObj.getUTCFullYear();
      let _Month    =  dateObj.getUTCMonth() + 1; //months from 1-12
      let _Day      =  dateObj.getUTCDate();
    
         //console.log(_Year,_Month,_Day) // -> Checks for DATE Value  */
    
     
          let collection = db.collection('ActualTotalLoad')
          const agg = ActualLoadQuerries.Get_Date_Querry(_AreaName,_Resolution,_Year,_Month,_Day)
          let cursor = collection.aggregate(agg)
    
/* send a csv response here */
    if(req.query.format=='csv'){
      res.setHeader('Content-Type', 'text/csv');
      //res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
     
      let fields = ['Source', 'Dataset','AreaName',"AreaTypeCode","MapCode","ResolutionCode","Year",
                  "Month","Day","DateTimeUTC","ActualTotalLoadValue","UpdateTimeUTC"];//all field names
      
     let json2csvParser = new Parser({ fields });

      cursor.toArray((error, result) => {
        if(result.length==0) {
          return res.status(403).json({
              error:'Error 403 : No data'
              });
          } 
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
    // simple counter to count all requests for specific user
  if(!req.session.counter){req.session.counter=1}
  else{
    req.session.counter++
    console.log('request number:',req.session.counter)

  }

    let _date_str = req.params._date_str.split("-")
    let _Year =  parseInt(_date_str[0])
    let _Month = parseInt(_date_str[1])
    if(  ( !_Month)){
      return res.status(400).json({"Error 400":"Bad request" })
    }
    let _AreaName=req.params.AreaName
    let _Resolution=req.params.Resolution
    let collection = db.collection('ActualTotalLoad')
    let agg =ActualLoadQuerries.Get_Month_Querry(_AreaName,_Resolution,_Year,_Month)
    let cursor = collection.aggregate(agg)
  
/* send a csv response here */
    if(req.query.format=='csv'){
      res.setHeader('Content-Type', 'text/csv');
      //res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
    
      let fields = ['Source', 'Dataset','AreaName',"AreaTypeCode","MapCode","ResolutionCode","Year",
                  "Month","Day","ActualTotalLoadByDayValue"];//all field names
      
      let json2csvParser = new Parser({ fields });

      cursor.toArray((error, result) => {
        if(result.length==0) {
          return res.status(403).json({
              error:'Error 403 : No data'
              });
          } 
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

  


  exports.GetYear = (req, res) => {
    // simple counter to count all requests for specific user
  if(!req.session.counter){req.session.counter=1}
  else{
    req.session.counter++;       
    console.log('request number:',req.session.counter)
}

    
    const _AreaName=req.params.AreaName
    const _Resolution=req.params.Resolution
    const _Year = parseInt(req.params.Year)

    const collection = db.collection('ActualTotalLoad')
    const agg = ActualLoadQuerries.Get_Year_Querry(_AreaName,_Resolution,_Year)
    const cursor = collection.aggregate(agg)
  
 /* send a csv response here */
      if(req.query.format=='csv'){
        res.setHeader('Content-Type', 'text/csv');
        //res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');

        let fields = ['Source', 'Dataset','AreaName',"AreaTypeCode","MapCode","ResolutionCode","Year",
                    "Month","ActualTotalLoadByMonthValue"];//all field names
        
        let json2csvParser = new Parser({ fields });

        cursor.toArray((error, result) => {
          if(result.length==0) {
            return res.status(403).json({
                error:'Error 403 : No data'
                });
            } 
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