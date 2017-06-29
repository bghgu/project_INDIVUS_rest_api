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
    const checkUsername = 'select username from Signup where username = ?';

    const insertNewUser = 'insert into Signup set ?';
    const insertIdToProfiles = 'insert into Profiles(ID) values(?)';

    let dupEmail = await db.execute(checkEmail, email);
    let dupUsername = await db.execute(checkUsername, username);

    if (dupEmail.length !== 0) {
        res.status(405).send({message: 'email already exists'});
    }
    else if (dupUsername.length !== 0) {
        res.status(405).send({message: 'username already exists'});
    }
    else {
        let newUser = {
            email: email,
            password: password,
            username: username,
        };
        let inserted = await db.execute(insertNewUser, newUser);
        let profilesId = await db.execute(insertIdToProfiles, inserted.insertId);
        res.status(201).send({
            message: "success",
            id : inserted.insertId
        });
    }
});

module.exports = router;
