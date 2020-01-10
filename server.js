/*const https             =   require('https');
const express           =   require('express');
const app               =   express();
const bodyParser        =   require('body-parser'); // Body parser supports url,json formats,makes data easier to handle
const MongoClient       =   require('mongodb').MongoClient
const assert            =   require('assert')
//const SequelizeStore    =   require("connect-session-sequelize")(session.Store)
//const session           =   require('express-session')



const URL  = 'mongodb+srv://user:user@cluster0-0pwss.mongodb.net/test?retryWrites=true&w=majority'



//Add bodyParser middleware to parse POST request body
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


/// MEGALI PROSOXI STO GLOBAL VARIABLE EDO PERA
db = null // -> global variable to hold the connection 

MongoClient.connect(URL, 
    {useNewUrlParser: true,useUnifiedTopology: true }, 
    function(err, client) {
                        if (err) throw err; 
                        else console.log('connected to energy db');
                        assert.equal(null, err) 
                        db = client.db('energy') // once connected, assign the connection to the global variable
            })


/*
Session configuration and store session cookie in db
--------------------------------------------------------------------------------------------
Documentation1: https://www.npmjs.com/package/express-session
Documentation2:https://www.npmjs.com/package/connect-session-sequelize

const myConnectionStore = new SequelizeStore({
    db: sequelize
})
sessionOptions.store = myConnectionStore;
myConnectionStore.sync();
app.use(session(sessionOptions));
*/


/*morgan is a package for errors
const morgan = require('morgan');
app.use(morgan('dev'));


//Declare Routers 
const ActualTotalLoadRouter = require('./routes/ActualTotalLoad');
const AggregatedGenerationPerTypeRouter = require('./routes/AggregatedGenerationPerType');
const DayAheadTotalLoadForecastRouter = require('./routes/DayAheadTotalLoadForecast');
const ActualvsForecastRouter = require('./routes/ActualvsForecast');
app.use('/energy/api/ActualTotalLoad',ActualTotalLoadRouter);
app.use('/energy/api/DayAheadTotalLoadForecast',DayAheadTotalLoadForecastRouter);
app.use('/energy/api/AggregatedGenerationPerType',AggregatedGenerationPerTypeRouter);
app.use('/energy/api/ActualvsForecast',ActualvsForecastRouter);

// if u reach this line,no router was able to handle the request,so we return an error message.
app.use((req,res,next)=>{
    res.status(400).json({
            "error 400": "Bad request"
        
    })
    next(error);
});

/* Function to handle all errors from all files(from db or 404).Morgan was used
app.use((error,req,res,next)=>{
    res.status(error.status||400);
    //if(error.status==403) new Error('Error 403 : No data')
    res.json({
        error:{
            message:error.message
        }
    });
});

var fs = require('fs');

// SET UP KEY FOR HTTPS   
//     (pro tip: fs.readFileSync - unlike fs.readFile, fs.readFileSync 
//               will block the entire process until it completes.
//               In a busy server, however, using a synchronous function 
//               during a request will force the server to deal with the requests one by one!!!!)
var key = fs.readFileSync('./SSL KEYS/15886504_stas.com.key');
var cert = fs.readFileSync( './SSL KEYS/15886504_stas.com.cert' );
var options = {key: key,   cert: cert  };


https.createServer(options, app).listen(process.env.PORT || 3000);

*/