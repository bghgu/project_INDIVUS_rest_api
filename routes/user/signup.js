const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');
const hash = require('../module/hash.js');

router.post('/check', async(req, res, next) => {
    const email = req.body.email;
    const username = req.body.username;
    console.log(req.body);
    const checkEmail = 'select email from Signup where email = ?';
    const checkUsername = 'select username from Signup where username = ?';

    if (email != undefined) {
        let dupEmail = await db.execute(checkEmail, email);
        if (dupEmail.length !== 0) {
            res.status(405).send({
                message: 'email already exists'
            });
        } else {
            res.status(200).send({
                message: "email check success"
            });
        }
    } else if (username != undefined) {
        let dupUsername = await db.execute(checkUsername, username);
        if (dupUsername.length !== 0) {
            res.status(405).send({
                message: 'username already exists'
            });
        } else {
            res.status(200).send({
                message: "username check success"
            });
        }
    } else {
        res.status(400).send({
            message: 'bad request'
        });
    }
});

router.post('/', async(req, res, next) => {
    const email = req.body.email;
    let password = req.body.password;
    const username = req.body.username;
    const insertNewUser = 'insert into Signup set ?';
    const insertIdToProfiles = 'insert into Profiles(ID) values(?)';

    password = hash.encoding(password);

    let newUser = {
        email: email,
        password: password,
        username: username,
    };

    let inserted = await db.execute(insertNewUser, newUser);
    let profilesId = await db.execute(insertIdToProfiles, inserted.insertId);

    res.status(201).send({
        message: "success",
        id: inserted.insertId
    });

});

module.exports = router;
