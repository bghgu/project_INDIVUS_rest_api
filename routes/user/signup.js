const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.post('/', async(req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    const checkEmail = 'select email from Signup where email = ?';
    const insertIdToProfiles = 'insert into Profiles(ID) values(?)';
    const insertNewUser = 'insert into Signup set ?';
    let dupEmail = await db.execute(checkEmail, email);
    if (dupEmail.length !== 0) {
        //중복되는 사용자이름을 사용할 수 없으므로 405로 응답합니다.
        res.status(405).send({message: 'email already exists'});
    } else {
        let newUser = {
            email: email,
            password: password,
            username: username,
        };
        let inserted = await db.execute(insertNewUser, newUser);
        let profilesId = await db.execute(insertIdToProfiles, inserted.insertId);
        res.status(201).send({result: inserted.insertId});
    }
});

module.exports = router;
