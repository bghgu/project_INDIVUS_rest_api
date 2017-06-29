const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../../module/jwt.js');
const db = require('../../module/pool.js');

router.get('/:id', async(req, res, next) => {
    //const ID = jwt.verify(req.headers.authorization);
    const ID = req.params.id;
    const followerList = 'select follower_id from Follower where ID = ?';
    let result = await db.execute(followerList, ID);
    console.log(result);
    res.status(200).send({
        result
    });
});

module.exports = router;
