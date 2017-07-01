const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.get('/:keyword', async(req, res) => {
    const ID = jwt.verify(req.headers.authorization);
    const keyword = req.params.keyword;
    const search = 'select * from Posts where title = ?';
    //토큰 검증이 성공할 경우
    if(ID != -1) {
        let result = await db.execute(search, keyword);
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
