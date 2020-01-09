const express=require('express');
const app = express();
const bodyParser = require('body-parser'); // Body parser supports url,json formats,makes data easier to handle
const URL = 'mongodb+srv://user:user@cluster0-0pwss.mongodb.net/test?retryWrites=true&w=majority'
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


/// MEGALI PROSOXI STO GLOBAL VARIABLE EDO PERA
db = null // global variable to hold the connection 

MongoClient.connect(URL, {useNewUrlParser: true,useUnifiedTopology: true }, 
                    function(err, client) {
                        if (err) throw err; 
                        else console.log('connected to energy db');
                        assert.equal(null, err) 
                        db = client.db('energy') // once connected, assign the connection to the global variable
            })

//mongoose.connect('mongodb+srv://user:user@cluster0-0pwss.mongodb.net/energy?retryWrites=true&w=majority');
/*mongoose.connect('mongodb://localhost/Energy', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }); */
/* Function to eliminate CORS errors (postman never gets CORS errors).We also grant access to everybody
// bodyParser was used
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Acess-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept,Authorization"
    );
    if(req.method == 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,DELETE,PATCH');
        return res.status(200).json({});
    }
})*/

//morgan is a package for errors
const morgan = require('morgan');
app.use(morgan('dev'));


//Declare Routers 
const test = require('./routes/test');
app.use('/test',test);

const ActualTotalLoadRouter = require('./routes/ActualTotalLoad');
const AggregatedGenerationPerTypeRouter = require('./routes/AggregatedGenerationPerType');
const DayAheadTotalLoadForecastRouter = require('./routes/DayAheadTotalLoadForecast');
const ActualvsForecastRouter = require('./routes/ActualvsForecast');
app.use('/energy/api/ActualTotalLoad',ActualTotalLoadRouter);
app.use('/energy/api/DayAheadTotalLoadForecast',DayAheadTotalLoadForecastRouter);
app.use('/energy/api/AggregatedGenerationPerType',AggregatedGenerationPerTypeRouter);
app.use('/energy/api/ActualvsForecast',ActualvsForecastRouter);

// if u reach this line,no router was able to handle the request,so we return an error message.Morgan was used
app.use((req,res,next)=>{
    const error = new Error('400 : Bad request')
    error.status==400;
    next(error);
});

// Function to handle all errors from all files(from db or 404).Morgan was used
app.use((error,req,res,next)=>{
    res.status(error.status||400);
    //if(error.status==403) new Error('Error 403 : No data')
    res.json({
        error:{
            message:error.message
        }
    });
});
module.exports = app;