const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.get('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const profile = 'select * from Profiles where ID = ?';
    let result = await db.execute(profile, ID);
    res.status(200).send({result});
});

module.exports = router;
