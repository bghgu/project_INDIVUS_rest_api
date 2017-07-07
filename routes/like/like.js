const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');
const notice = require('../module/notice.js');

router.post('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const post_id = req.body.post_id;
    const comment_id = req.body.comment_id;
    const comment_detail_id = req.body.comment_detail_id;
    const creator_id = req.body.creator_id;
    let data;
    let query, select, update, check, noLike;
    let like_counts = 0;
    if (ID != -1) {
        if (post_id != undefined) {
            data = post_id;
            query = 'insert into PostLikes(post_id, ID) values (?, ?)';
            select = 'select like_counts from Posts where post_id = ?';
            update = 'update Posts set like_counts = ? where post_id = ?';
            check = 'select * from PostLikes where ID = ? and post_id = ?';
            noLike = 'delete from PostLikes where like_id = ?';
            notice.post_like(ID, post_id);
        } else if (comment_id != undefined) {
            data = comment_id;
            query = 'insert into CommentLikes(comment_id, ID) values(?, ?)';
            select = 'select like_counts from Comments where comment_id = ?';
            update = 'update Comments set like_counts = ? where comment_id = ?';
            check = 'select * from CommentLikes where ID = ? and comment_id = ?';
            noLike = 'delete from CommentLikes where like_id = ?';
            notice.comment_like(ID, comment_id);
        } else if (comment_detail_id != undefined) {
            data = comment_detail_id;
            query = 'insert into CommentDetailLikes(comment_detail_id, ID) values(?, ?)';
            select = 'select like_counts from CommentDetails where comment_detail_id = ?';
            update = 'update CommentDetails set like_counts = ? where comment_detail_id = ?';
            check = 'select * from CommentDetailLikes where ID = ? and comment_detail_id = ?';
            noLike = 'delete from CommentDetailLikes where like_id = ?';
            notice.commentDetail_like(ID, comment_detail_id);
        } else {
            res.status(400).send({
                message: 'bad request'
            });
        }
        //좋아요 했는지 체크
        let like_check = await db.execute3(check, ID, data);
        //좋아요
        if(like_check.length == 0) {
            //좋아요 DB 입력
            let result = await db.execute3(query, data, ID);
            if(result != undefined) {
                //현재 count
                let count = await db.execute(select, data);
                //좋아요 카운트 +1;
                like_counts = count[0].like_counts + 1;
                //count 반영
                await db.execute3(update, like_counts, data);
                res.status(201).send({
                    message : "like success",
                    like_counts : like_counts
                });
            }else {
                res.status(403).send({
                    message: "like failed"
                });
            }
        }
        //좋아요 취소
        else {
            //좋아요 DB 삭제
            let result = await db.execute3(noLike, like_check[0].like_id);
            if(result != undefined) {
                //현재 count
                let count = await db.execute(select, data);
                //좋아요 카운트 - 1;
                like_counts = count[0].like_counts - 1;
                //count 반영
                await db.execute3(update, like_counts, data);
                res.status(201).send({
                    message : "none like success",
                    like_counts : like_counts
                });
            }else {
                res.status(403).send({
                    message: "none like failed"
                });
            }
        }
    } else {
        res.status(401).send({
            message: "access denied"
        });
    }
});

module.exports = router;
