const express           =   require('express');
const app               =   express();
const bodyParser        =   require('body-parser'); // Body parser supports url,json formats,makes data easier to handle
const MongoClient       =   require('mongodb').MongoClient
const assert            =   require('assert')
const credentials       =   require('./config/credentials')
const cookieParser      =   require('cookie-parser')
const mongoose          =   require('mongoose')
const cors              =   require('cors')
const session           =   require('express-session')
const MongoStore        =   require('connect-mongo')(session);


app.use(cors())


const URL  =    'mongodb+srv://'
                +credentials.database.username+':'
                +credentials.database.password+
                '@cluster0-0pwss.mongodb.net/energy?retryWrites=true&w=majority'

 mongoose.connect(URL)


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

app.use(cookieParser());
// see -> ./config/credentials for details
app.use(session({
    secret: credentials.session.secret,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection:mongoose.connection }),
    cookie: {
        secure: false,
        maxAge: credentials.session.expires_in,   // set to 1 hour
        httpOnly: false
    }
}));



//Declare Routers 
const ActualTotalLoadRouter             = require('./routes/ActualTotalLoad');
const AggregatedGenerationPerTypeRouter = require('./routes/AggregatedGenerationPerType');
const DayAheadTotalLoadForecastRouter   = require('./routes/DayAheadTotalLoadForecast');
const ActualvsForecastRouter            = require('./routes/ActualvsForecast');
const UserRouter                        = require('./routes/user')
app.use('/energy/api/ActualTotalLoad',ActualTotalLoadRouter);
app.use('/energy/api/DayAheadTotalLoadForecast',DayAheadTotalLoadForecastRouter);
app.use('/energy/api/AggregatedGenerationPerType',AggregatedGenerationPerTypeRouter);
app.use('/energy/api/ActualvsForecast',ActualvsForecastRouter);
app.use('/energy/api/user',UserRouter);


// if u reach this line,no router was able to handle the request,so we return an error message.
app.use((req,res,)=>{
    res.status(400).json({
            "error 400": "Bad request"
        
    })
});



module.exports = app;