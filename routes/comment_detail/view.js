const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.post('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const commentId = req.body.comment_id;
    const viewCommentDetail = 'select distinct c.*, p.jobs, p.profile_photo, s.username from CommentDetails c join Profiles p on c.ID=p.ID join Signup s on s.ID=p.ID where c.comment_id = ? and c.ID = ?';
    const checkLikes = 'select * from CommentDetailLikes where ID = ? and comment_detail_id = ?';
    if (ID != -1) {
        let result = await db.execute3(viewCommentDetail, commentId, ID);
        for(i = 0; i < result.length; i++) {
            let is_like_clicked = await db.execute3(checkLikes, ID, result[i].comment_detail_id);
            result[i].is_like_clicked = is_like_clicked.length != 0 ? 1 : 0;
        }
        res.status(200).send({
            result
        });
    } else {
        res.status(401).send({
            message: "access denied"
        });
    }
});

module.exports = router;
