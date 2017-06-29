const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../../module/jwt.js');
const db = require('../../module/pool.js');

router.post('/:following_id', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const followingId = req.params.following_id;
    const followingAdd = 'insert into Following set ?';
    let data = {
        ID: ID,
        following_id: followingId,
    }

    let result = await db.execute(followingAdd, data);
    res.status(200).send({
        result
    });
});

module.exports = router;
