const Client=  require("pg").Client;

require('dotenv').config()

const db=new Client({

    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
    
})
db.connect()
module.exports=db