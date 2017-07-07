const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.get('/', async(req, res) => {
    const ID = jwt.verify(req.headers.authorization);
    let result = [];
    let array = [];
    let data;
    let comment_count;
    const feed = 'select distinct p.*, p2.profile_photo, p2.jobs , s.username from Following f join Posts p on f.following_id = p.ID_creator join Profiles p2 on p2.ID = p.ID_creator join Signup s on s.ID = p2.ID where f.ID = ?';
    const keycard = 'select k.keycard_id, k.keycard_name from Keycards k join Post_Keycards p on k.keycard_id = p.keycard_id where p.post_id = ?';
    const comment = 'select count(*) as count from Comments where post_id = ?';
    //토큰 검증이 성공할 경우
    if (ID != -1) {
        data = await db.execute(feed, ID);
        for(let i = 0; i < data.length; i++) {
            array = data[i];
            array.keycard = await db.execute(keycard, array.post_id);
            let count = await db.execute(comment, array.post_id);
            array.comment_counts = count[0].count;
            result.push(array);
        }
        if(result != undefined) {
            res.status(200).send({
                result
            });
        }
        else {
            res.status(401).send({
                message: "no feed"
            });
        }
        //토큰 검증이 실패할 경우
    } else {
        res.status(401).send({
            message: "access denied"
        });
    }
});

module.exports = router;
