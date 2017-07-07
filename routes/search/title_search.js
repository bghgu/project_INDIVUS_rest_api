const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.post('/', async(req, res) => {
    const ID = jwt.verify(req.headers.authorization);
    const keyword = req.body.keyword;
    const search = "select p.*, p2.jobs, p2.profile_photo, s.username from Posts p join Profiles p2 on p.ID_creator = p2.ID join Signup s on s.ID = p2.ID where p.title Like '%" + keyword + "%'";
    const comment = 'select count(*) as count from Comments where post_id = ?';
    let result = [];
    //토큰 검증이 성공할 경우
    if (ID != -1) {
        let data = await db.FindAll(search);
        for(let i = 0; i < data.length; i++) {
            array = data[i];
            let count = await db.execute(comment, array.post_id);
            array.comment_counts = count[0].count;
            result.push(array);
        }
        if(result != undefined) {
            res.status(200).send({
                result
            });
        }else {
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
