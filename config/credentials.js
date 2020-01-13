module.exports = {
    host: "localhost",
    secret: "ByteTheBit  2020",
    database: {
        db_name: "energy",
        username: "user",
        password: "user"
    },
    admin_user: {
        password: "admin",
        email: "admin@admin.com"
    },
    One_hour :60 * 60 * 1000,       //counts milliseconds   
    session_options:{
        secret: "Another One Bytes the Bit",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            maxAge: this.One_hour,     // set to 1 hour   
            httpOnly: false
    }
    }
}
