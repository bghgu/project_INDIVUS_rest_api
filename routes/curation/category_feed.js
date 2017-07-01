const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.get('/', async(req, res) => {
    const ID = jwt.verify(req.headers.authorization);
    const feed = 'select DISTINCT p2.*, s.username from Favorits f join Post_Categorys p on f.category_id = p.category_id join Posts p2 on p.post_id = p2.post_id join Signup s on p2.ID = s.ID where f.ID = ?';
    //토큰 검증이 성공할 경우
    if(ID != -1) {
        let result = await db.execute(feed, ID);
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
