const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.post('/:comment_id', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const commentId = req.params.comment_id;

    let writeCommentDetail = 'insert into CommentDetails set ?';
    let data = {
        comment_id: commentId,
        ID: ID,
        contents: req.body.contents,
    };

    let result = await db.execute3(writeCommentDetail, data);
    //console.log(result);
    res.status(201).send({message: 'comment detail writing success'});
});

module.exports = router;
