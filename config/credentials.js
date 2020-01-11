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
    session:{
        secret: "Another One Bytes the Bit",
        expires_in: 60 * 60 * 1000  // counts milliseconds =>  set to 1 hour
    }
}
