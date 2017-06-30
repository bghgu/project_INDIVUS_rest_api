const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.post('/:post_id', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const postId = req.params.post_id;

    let writeComment = 'insert into Comments set ?';
    let data = {
        post_id: postId,
        ID: ID,
        contents: req.body.contents,
    };

    let result = await db.execute3(writeComment, data);
    //console.log(result);
    res.status(201).send({message: 'comment writing success'});
});

module.exports = router;
