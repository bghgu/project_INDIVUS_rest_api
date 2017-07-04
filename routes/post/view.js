const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.post('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const postId = req.body.post_id;
    const viewPost = 'select p.*, s.username, p2.jobs, p2.profile_photo from Posts p join Profiles p2 on p.ID_creator = p2.ID join Signup s on s.ID = p2.ID where post_id = ?';
    const comment = 'select count(*) as count from Comments where post_id = ?';
    const recommend = 'select distinct p.post_id, p.card_cover, p.title, p.sub_title from Post_Keycards pk join Posts p on pk.post_id = p.post_id where keycard_id in (select keycard_id from Post_Keycards where post_id = ?)'
    const contentList = 'select type, contents from Contents where post_id = ?';
    //토큰 검증이 성공할 경우
    if(ID != -1) {
        let result = await db.execute(viewPost, postId);
        if(result.length != 0) {
            let count = await db.execute(comment, postId);
            let recomment_list = await db.execute(recommend, postId);
            let contents = await db.execute(contentList, postId);
            if(count != undefined) {
                result[0].comment_counts = count[0].count;
                result[0].recommends = recomment_list;
                result[0].contents = contents;
                res.status(201).send({
                    result,
                });
            }
        }else {
            res.status(401).send({
                message : "no post"
            });
        }
    //토큰 검증이 실패할 경우
    }else {
        res.status(401).send({
            message : "access denied"
        });
    }
});

module.exports = router;
