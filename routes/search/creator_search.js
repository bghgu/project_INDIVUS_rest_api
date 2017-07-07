const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.post('/', async(req, res) => {
    const ID = jwt.verify(req.headers.authorization);
    const keyword = req.body.keyword;
    console.log(keyword);
    const search = "select p.*, s.username from Profiles p join Signup s on p.ID = s.ID where s.username Like '%" + keyword + "%'";
    const follow = 'select count(*) as count from Follower where ID = ?';
    //토큰 검증이 성공할 경우
    if(ID != -1) {
        let result = await db.FindAll(search);
        console.log(result);
        for(i = 0 ; i < result.length; i++) {
            let follow_counts = await db.execute(follow, result[i].ID);
            console.log(follow_counts);
            result[i].follower_counts = follow_counts[0].count;
        }
        res.status(200).send({
            result
        });
    //토큰 검증이 실패할 경우
    }else {
        res.status(401).send({
            message : "access denied"
        });
    }
});

module.exports = router;
