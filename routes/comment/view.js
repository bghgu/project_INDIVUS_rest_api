const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.post('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const postId = req.body.post_id;
    const viewComment = 'select distinct c.*, p.jobs, p.profile_photo, s.username from Comments c join Profiles p on c.ID=p.ID join Signup s on s.ID=p.ID where post_id = ?';
    const count = 'select count(*) as count from CommentDetails where comment_id = ?';
    const checkLikes = 'select * from CommentLikes where ID = ? and comment_id = ?';
    if (ID != -1) {
        let result = await db.execute(viewComment, postId);
        for(i = 0; i < result.length; i++) {
            comment_counts = await db.execute3(count, result[i].comment_id.count);
            let is_like_clicked = await db.execute3(checkLikes, ID, result[i].comment_id);
            result[i].comment_counts = comment_counts[0].count;
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
