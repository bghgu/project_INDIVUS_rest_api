const express = require('express');
const router = express.Router();
const pool = require('../config/db_pool.js');
const jwt = require('jsonwebtoken');

router.post('/', async function(req, res) {
    try {
        var connection = await pool.getConnection();
        const email = req.body.email;
        const password = req.body.password;
        let query = 'select id, password from User where email = ?';
        let user_info = await connection.query(query, email) || null;
        if(password!=user_info[0].password) res.status(401).send({message: 'wrong email or password'});
        else {
            //jwt 발급하고 성공메세지 보내주기
            const secretKey = req.app.get('jwt-secret');
            console.log(secretKey);
            const options = {
                algorithm : "HS256",
                expiresIn : 60 * 60 //1 hours
            };
            const payload = {
                user_id : user_info[0].id
            };
            const token = jwt.sign(payload, secretKey, options);
            console.log(token);
            res.status(200).send({message : 'login success', token : token});
        }
    }
    catch(err) {
        console.log(err);
        res.status(500).send({message: err });
    }
    finally {
        pool.releaseConnection(connection);
    }
});

module.exports = router;
