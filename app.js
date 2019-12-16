const express=require('express');
const app = express();
const bodyParser = require('body-parser'); // Body parser supports url,json formats,makes data easier to handle
const mongoose = require('mongoose');   

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://user:user@cluster0-0pwss.mongodb.net/test?retryWrites=true&w=majority');

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
const ActualTotalLoadRouter = require('./routes/ActualTotalLoad');
const AggregatedGenerationPerTypeRouter = require('./routes/AggregatedGenerationPerType');
const DayAheadTotalLoadForecastRouter = require('./routes/DayAheadTotalLoadForecast')
app.use('/ActualTotalLoad',ActualTotalLoadRouter);
app.use('/DayAheadTotalLoadForecast',DayAheadTotalLoadForecastRouter);
app.use('/AggregatedGenerationPerType',AggregatedGenerationPerTypeRouter);

// if u reach this line,no router was able to handle the request,so we return an error message.Morgan was used
app.use((req,res,next)=>{
    const error = new Error('Not found')
    error.status(404);
    next(error);
});

// Function to handle all errors from all files(from db or 404).Morgan was used
app.use((error,req,res,next)=>{
    res.status(error.status||500);
    res.json({
        error:{
            message:"U fucked up"
        }
    });
});
module.exports = app;