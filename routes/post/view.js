const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.post('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const postId = req.body.post_id;
    console.log(req.body);
    const viewPost = 'select p.*, s.username, p2.jobs, p2.profile_photo from Posts p join Profiles p2 on p.ID_creator = p2.ID join Signup s on s.ID = p2.ID where post_id = ?';
    const comment = 'select count(*) as count from Comments where post_id = ?';
    const collectionCounts = 'select count(*) as count from Collections where post_id = ?';
    const recommend = 'select distinct p.post_id, p.card_cover, p.title, p.sub_title from Post_Keycards pk join Posts p on pk.post_id = p.post_id where keycard_id in (select keycard_id from Post_Keycards where post_id = ?)'
    const contentList = 'select type, contents from Contents where post_id = ?';
    //토큰 검증이 성공할 경우
    if(ID != -1) {
        let result = await db.execute(viewPost, postId);
        //조회수 1증가
        viewCount = result[0].view_counts + 1;
        let countUpdate = 'update Posts set view_counts = ? where post_id = ?';
        await db.execute3(countUpdate, viewCount, postId);
        if(result.length != 0) {
            let count = await db.execute(comment, postId);
            let count2 = await db.execute(collectionCounts, postId);
            let recomment_list = await db.execute(recommend, postId);
            let contents = await db.execute(contentList, postId);
            if(count != undefined) {
                result[0].comment_counts = count[0].count;
                result[0].collection_counts = count2[0].count;
                result[0].recommends = recomment_list;
                result[0].contents = contents;
                res.status(201).send({
                    ID_creator : result[0].ID_creator,
                    post_id : result[0].post_id,
                    title : result[0].title,
                    sub_title : result[0].sub_title,
                    explain : result[0].explain,
                    comment : result[0].comment,
                    card_cover : result[0].card_cover,
                    content_type : result[0].content_type,
                    posting_date : result[0].posting_date,
                    like_counts : result[0].like_counts,
                    category_id : result[0].category_id,
                    collection_counts : result[0].collection_counts,
                    view_counts : result[0].view_counts,
                    username : result[0].username,
                    jobs : result[0].jobs,
                    profile_photo : result[0].profile_photo,
                    comment_counts : result[0].comment_counts,
                    recommends : result[0].recommends,
                    contents : result[0].contents
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
