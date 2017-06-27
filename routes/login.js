const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const async = require('async');
const pool = require('../config/db_pool.js');

router.post('/', async function(req, res) {
    try {
        const email = req.body.email;
        const password = req.body.password;
        var connection = await pool.getConnection();
        let query = 'select * from Signup where email = ?';
        let data = await connection.query(query, email) || null;
        //아이디가 존재하지 않을 경우
        if(data.length == 0) {
            res.status(401).send({message: 'wrong email'});
        }
        //비밀번호가 틀릴 경우
        else if(password != data[0].password) {
            res.status(401).send({message: 'wrong password'});
        }
        else {
            //jwt 발급하고 성공메세지 보내주기
            const secretKey = req.app.get('jwt-secret');
            const options = {
                algorithm : "HS256",
                expiresIn : 60 * 60 * 24 * 30//30 days
            };
            const payload = {
                user_id : data[0].ID
            };
            const token = jwt.sign(payload, secretKey, options);
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
