const MongoStore = require('rate-limit-mongo');

module.exports = {

limiter_all: {
    windowMs: 15 * 60 * 1000,       // 15 minutes
    max: 100 ,
    statusCode :402,
    message: "Out of quota! Details: You have sended too many requests.Try again later",
    store : new MongoStore({ 
        uri:'mongodb+srv://user:user@cluster0-0pwss.mongodb.net/energy?retryWrites=true&w=majority',
        user: "user",
        password: "user",
        windowMs: 60 * 60 * 1000    // 1 hour
        })
},                                  // limit each IP to 100 requests per windowMs
limit_signup:{
    windowMs: 60 * 60 * 1000,       // 1 hour window
    max: 5,                         // start blocking after 5 requests
    message: "Out of quota! Details: Too many accounts created from credentials user, please try again after an hour",
    statusCode : 402 , 
    store : new MongoStore({ 
        uri:'mongodb+srv://user:user@cluster0-0pwss.mongodb.net/energy?retryWrites=true&w=majority',
        user: "user",
        password: "user",
        windowMs: 3 * 60 * 60 * 1000     // 3 hours
        })
  },
limiter_all_daily:{
    windowMs: 12 * 60 * 60 * 1000,       // 12 hours
    max: 3000 ,
    statusCode :402,
    message: "Out of quota! Details: You have exceeded the daily request limit.Try again tomorrow",
    store : new MongoStore({ 
        uri:'mongodb+srv://user:user@cluster0-0pwss.mongodb.net/energy?retryWrites=true&w=majority',
        user: "user",
        password: "user",
        windowMs: 48 * 60 * 60 * 1000 // 2 Days
        })    
    }
}


