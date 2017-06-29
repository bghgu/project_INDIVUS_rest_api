const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../../module/jwt.js');
const db = require('../../module/pool.js');

router.get('/:id', async(req, res, next) => {
    //const ID = jwt.verify(req.headers.authorization);
    const ID = req.params.id;
    const followingList = 'select following_id from Following where ID = ?';
    let result = await db.execute(followingList, ID);
    res.status(200).send({
        result
    });
});

module.exports = router;
