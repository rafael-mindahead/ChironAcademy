import 'dotenv/config'

import mysql from 'mysql2/promise'


const database = mysql.createPool({

  host:
    process.env.DB_HOST,

  port:
    process.env.DB_PORT,

  user:
    process.env.DB_USER,

  password:
    process.env.DB_PASSWORD,

  database:
    process.env.DB_NAME,

  charset:
    'utf8mb4',


  waitForConnections: true,

  connectionLimit: 10,

  queueLimit: 0

})


export default database