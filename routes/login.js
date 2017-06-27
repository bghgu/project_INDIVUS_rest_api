const express = require('express');
const router = express.Router();
const pool = require('../config/db_pool.js');
const jwt = require('jsonwebtoken');
const aws = require('aws-sdk');
const async = require('async');
aws.config.loadFromPath('./config/awsConfig.json');
const mysql = require('mysql');

router.post('/', async function(req, res) {
    console.log(req.body);
    try {
        var connection = await pool.getConnection();
        const email = req.body.email;
        const password = req.body.password;
        let query = 'select * from Signup where email = ?';
        let data = await connection.query(query, email) || null;
        if(password != data[0].password) res.status(401).send({message: 'wrong email or password'});
        else {
            console.log(data[0].ID);
            //jwt 발급하고 성공메세지 보내주기
            const secretKey = req.app.get('jwt-secret');
            console.log(secretKey);
            const options = {
                algorithm : "HS256",
                expiresIn : 60 * 60 * 24 * 30//30 days
            };
            const payload = {
                user_id : data[0].ID
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
