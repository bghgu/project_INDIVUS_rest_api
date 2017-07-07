const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.get('/', async(req, res) => {
    const ID = jwt.verify(req.headers.authorization);
    const list_category = 'select * from Categorys order by category_like desc';
    const list_keycard = 'select * from Keycards order by like_counts desc LIMIT 10';
    let result = [];
    //토큰 검증이 성공할 경우
    if(ID != -1) {
        let category_result = await db.FindAll(list_category);
        let keycard_result = await db.FindAll(list_keycard);
        res.status(200).send({
            category_result, keycard_result
        });
    //토큰 검증이 실패할 경우
    }else {
        res.status(401).send({
            message : "access denied"
        });
    }
});

module.exports = router;
