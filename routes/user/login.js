const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.post('/', async(req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let query = 'select * from Signup where email = ?';
    let data = await db.execute(query, email);
    //아이디가 존재하지 않을 경우
    if (data.length == 0) {
        res.status(401).send({message: 'wrong email'});
    }
    //비밀번호가 틀릴 경우
    else if (password != data[0].password) {
        res.status(401).send({message: 'wrong password'});
    } else {
        const token = jwt.sign(data[0].ID);
        res.status(200).send({
            message: 'login success',
            token: token
        });
    }
});

module.exports = router;
