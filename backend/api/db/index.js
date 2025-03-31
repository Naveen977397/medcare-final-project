import pkg from 'pg';
import util from 'util'
// import config from '../../config/index.js';
import dotenv from 'dotenv';

dotenv.config();
const {Pool} = pkg;


const sql_pool = new Pool({
    user: process.env.dbUser,
    database: process.env.database,
    password: process.env.dbPassword,
    port: process.env.dbPort,
    max: process.env.max,
    idleTimeoutMillis: process.env.idleTimeoutMillis,
    connectionTimeoutMillis: process.env.connectionTimeoutMillis
});

const pool = {
    query: (sql,args) =>{
        return util.promisify(sql_pool.query).call(sql_pool,sql,args);
    }
}

export default pool;