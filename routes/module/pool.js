const pool = require('../../config/db_pool.js');
const async = require('async');
//DB 통신 모듈화
//매개변수
//1번째 : query문
//2번째 : data(json 형식 가능)
module.exports = {
    execute : async (...args) => {
        const query = args[0];
        const data = args[1];
        let result;
        try {
            var connection = await pool.getConnection();
            result = await connection.query(query, data) || null;
        }
        catch(err) {
            next(err);
        }
        finally {
            pool.releaseConnection(connection);
            return result;
        }
    },
    FindAll : async (...args) => {
        const query = args[0];
        let result;
        try {
            var connection = await pool.getConnection();
            result = await connection.query(query) || null;
        }
        catch(err) {
            next(err);
        }
        finally {
            pool.releaseConnection(connection);
            return result;
        }
    }
};
