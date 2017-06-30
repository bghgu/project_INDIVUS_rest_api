const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.get('/:post_id', async(req, res, next) => {

    const postId = req.params.post_id;
    const viewPost = 'select * from Posts where post_id = ?';
    let result = await db.execute(viewPost, postId);
    //console.log(result);
    res.status(200).send({
        result,
    });
});

module.exports = router;
