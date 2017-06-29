const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../../module/jwt.js');
const db = require('../../module/pool.js');

router.post('/:follower_id', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const followerId = req.params.follower_id;
    const followerAdd = 'insert into Follower set ?';
    let data = {
        ID: ID,
        follower_id: followerId,
    }

    let result = await db.execute(followerAdd, data);
    res.status(200).send({
        result,
        message: "follower add success"
    });
});

module.exports = router;
