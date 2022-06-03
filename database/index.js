const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host: process.env.DATABASE_URL,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: 'crawler',
    connectionLimit: 5,
});


const getConnection = async () => {
    try {
        const conn = await pool.getConnection();
        return conn;
    } catch (error) {
        console.error(`connection error : ${error.message}`);
        return null;
    }
};

const releaseConnection = async (conn) => {
    try {
        await conn.release();
    } catch (error) {
        console.error(`release error : ${error.message}`);
    }
};

const connection_test = async()=>{
    try{
        console.log('connection pool test start');
        const conn = await getConnection();
        await conn.beginTransaction();
        await conn.commit();
        console.log('connection pool test end');
        return true;
    }catch(err){
        console.log('connection test error: ',err);
        return false;
    }
}

module.exports = {
    connection_test,
    getConnection,
    releaseConnection,
};

//USER : 확인해보고 있으면
