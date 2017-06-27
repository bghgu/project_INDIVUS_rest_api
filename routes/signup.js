const express = require('express');
const router = express.Router();
const pool = require('../config/db_pool.js');
const jwt = require('jsonwebtoken');
const async = require('async');

router.post('/', async function(req, res) {
    console.log(req.body);
    try {
        var connection = await pool.getConnection();

        let checkEmail = 'select email from Signup where email = ?';
        let dupEmail = await connection.query(checkEmail, req.body.email);

        if(dupEmail.length!==0)
            res.status(405).send({message: 'email already exists'}); //중복되는 사용자이름을 사용할 수 없으므로 405로 응답합니다.
        else{
            let insertNewUser = 'insert into Signup set ?';
            let newUser = {
                email: req.body.email,
                password: req.body.password,
                username: req.body.username,
            };

            let inserted = await connection.query(insertNewUser, newUser);

            let insertIdToProfiles = 'insert into Profiles(ID) values(?)';
            let profilesId = await connection.query(insertIdToProfiles, inserted.insertId);

            console.log(inserted);

            res.status(201).send({result: inserted.insertId});
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
