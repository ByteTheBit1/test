ActualLoadQuerries =  require('../Querries/ActualLoadQuerries');


exports.GetDate=(req, res) => {
  // simple counter to count all requests for specific user
  if(!req.session.counter){req.session.counter=1}
  else{req.session.counter++}

    let _date_str = req.params._date_str.split("-")
    let _Year =  parseInt(_date_str[0])
    let _Month = parseInt(_date_str[1])
    let _Day =   parseInt(_date_str[2])
    if( (!_Month) || ( !_Day)){
      return res.status(400).json({"Error 400":"Bad request" })
    }

    let _AreaName = req.params.AreaName
    let _Resolution=req.params.Resolution
      /*let dateObj = new Date();
      let _Year = parseInt(req.params.Year)   || dateObj.getUTCFullYear();
      let _Month = parseInt(req.params.Month) || dateObj.getUTCMonth() + 1; //months from 1-12
      let _Day = parseInt(req.params.Day)     || dateObj.getUTCDate();
  
       console.log(_Year,_Month,_Day) // -> Checks for DATE Value  */
  
   
        let collection = db.collection('ActualTotalLoad')
        const agg = ActualLoadQuerries.Get_Date_Querry(_AreaName,_Resolution,_Year,_Month,_Day)
        let cursor = collection.aggregate(agg)
  
         cursor.toArray((error, result) => {
          if(error) {
              return res.status(400).send(error);
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
  else{req.session.counter++}

    let _date_str = req.params._date_str.split("-")
    let _Year =  parseInt(_date_str[0])
    let _Month = parseInt(_date_str[1])
    if(  ( !_Month)){
      return res.status(400).json({"Error 400":"Bad request" })
    }
    const _AreaName=req.params.AreaName
    const _Resolution=req.params.Resolution
  
        let collection = db.collection('ActualTotalLoad')
        const agg =ActualLoadQuerries.Get_Month_Querry(_AreaName,_Resolution,_Year,_Month)
     ;
  
        let cursor = collection.aggregate(agg)
  
         cursor.toArray((error, result) => {
          if(error) {
              return res.status(400).send(error);
          }
          if(result.length==0) {
            return res.status(403).json({
                error:'Error 403 : No data'
                });
            } 
          res.send(result);
      });
  
  }


  exports.GetYear = (req, res) => {
    // simple counter to count all requests for specific user
  if(!req.session.counter){req.session.counter=1}
  else{req.session.counter++}

    
    const _AreaName=req.params.AreaName
    const _Resolution=req.params.Resolution
    const _Year = parseInt(req.params.Year)
  
        let collection = db.collection('ActualTotalLoad')
        const agg = ActualLoadQuerries.Get_Year_Querry(_AreaName,_Resolution,_Year)
        let cursor = collection.aggregate(agg)
  
         cursor.toArray((error, result) => {
          if(error) {
              return res.status(400).send(error);
          }
          if(result.length==0) {
            return res.status(403).json({
                error:'Error 403 : No data'
                });
            } 
          res.send(result);
      });
  
  }