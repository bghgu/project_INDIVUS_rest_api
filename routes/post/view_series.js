const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

/*
다음화 보기
*/

router.post('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const title = req.body.title;
    const post_id = req.body.post_id;
    const list = 'select card_cover, title, sub_title, view_counts, posting_date from Posts where title = ? and ID_creator = ?';
    //토큰 검증이 성공할 경우
    if(ID != -1) {
        let result = await db.execute3(list, title, post_id);
        if(result.length != 0) {
            res.status(201).send({
                result,
            });
        }else {
            res.status(401).send({
                message : "no series"
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
