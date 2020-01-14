const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username : {
        type :String, 
        required: true,
        unique: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        // 'match' is regular expression to get a string like e-mail (something@something.sm)
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { 
        type: String, 
        required: true 
    },
    api_key :{
        type: String,
    }
});

module.exports = mongoose.model('user', userSchema);