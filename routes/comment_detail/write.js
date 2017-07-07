const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');
const notice = require('../module/notice.js');

router.post('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const commentId = req.body.comment_id;
    let writeCommentDetail = 'insert into CommentDetails set ?';
    let post = 'select post_id from Comments where comment_id = ?';
    if (ID != -1) {
        let data = {
            ID: ID,
            comment_id: commentId,
            contents: req.body.contents,
        };
        let result = await db.execute3(writeCommentDetail, data);
        let post_id = await db.execute(post, commentId);
        console.log();
        notice.comment_commentDetail(ID, commentId, result.insertId);
        notice.post_commentDetail(ID, post_id[0].post_id, commentId);
        res.status(201).send({
            message: 'comment detail writing success'
        });
    } else {
        res.status(401).send({
            message: "access denied"
        });
    }


});

module.exports = router;
