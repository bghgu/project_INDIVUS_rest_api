const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.get('/', async(req, res) => {
    const ID = jwt.verify(req.headers.authorization);
    const profile = 'select * from Profiles where ID = ?';
    const follower = 'select count(*) as follower_counts from Follower where follower_id = ?';
    const following = 'select count(*) as following_counts from Following where ID = ?';
    //토큰 검증이 성공할 경우
    if(ID != -1) {
        let result = await db.execute(profile, ID);
        let follower_counts = await db.execute(follower, ID);
        let following_counts = await db.execute(following, ID);
        res.status(200).send({
            ID : result[0].ID,
            profile_photo : result[0].profile_photo,
            name : result[0].name,
            jobs : result[0].jobs,
            birth : result[0].birth,
            tel : result[0].tel,
            active_Area : result[0].active_Area,
            follower_counts : follower_counts[0].follower_counts,
            following_counts : following_counts[0].following_counts,
            condition_message : result[0].condition_message,
            awards : result[0].awards,
            gender : result[0].gender,
            email : result[0].email,
            background_Image : result[0].background_Image,
        });
    //토큰 검증이 실패할 경우
    }else {
        res.status(401).send({
            message : "access denied"
        });
    }
});

module.exports = router;
