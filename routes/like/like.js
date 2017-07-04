const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.post('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const post_id = req.body.post_id;
    const comment_id = req.body.comment_id;
    const comment_detail_id = req.body.comment_detail_id;
    const creator_id = req.body.creator_id;
    let data;
    let query, select, update;
    let like_counts = 0;
    if (ID != -1) {
        if (post_id != undefined) {
            data = post_id;
            query = 'insert into PostLikes(post_id, ID) values (?, ?)';
            select = 'select like_counts from Posts where post_id = ?';
            update = 'update Posts set like_counts = ? where post_id = ?';
        } else if (comment_id != undefined) {
            data = comment_id;
            query = 'insert into CommentLikes(comment_id, ID) values(?, ?)';
            select = 'select like_counts from Comments where comment_id = ?';
            update = 'update Comments set like_counts = ? where comment_id = ?';
        } else if (comment_detail_id != undefined) {
            data = comment_detail_id;
            query = 'insert into CommentDetailLikes(creator_detail_id, ID) values(?, ?)';
            select = 'select like_counts from CommentDetails where comment_detail_id = ?';
            update = 'update CommentDetails set like_counts = ? where comment_detail_id = ?';
        } else if (creator_id != undefined) {
            data = creator_id;
            query = 'insert into CreatorLikes(creator_id, ID) values(?, ?)';
            select = 'select like_counts from Profiles where ID = ?';
            update = 'update Profiles set like_counts = ? where ID = ?';
        } else {
            res.status(400).send({
                message: 'bad request'
            });
        }
        let result = await db.execute3(query, data, ID);
        if(result != undefined) {
            let count = await db.execute(select, data);
            like_counts = count[0].like_counts + 1;
            await db.execute3(update, like_counts, data);
            res.status(201).send({
                message : "like success",
                like_counts : like_counts
            });
        }else {
            res.status(201).send({
                message: "like failed"
            });
        }
    } else {
        res.status(401).send({
            message: "access denied"
        });
    }
});

module.exports = router;
