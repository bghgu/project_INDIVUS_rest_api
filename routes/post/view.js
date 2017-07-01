const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.get('/:post_id', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const postId = req.params.post_id;
    const viewPost = 'select * from Posts where post_id = ?';
    //토큰 검증이 성공할 경우
    if(ID != -1) {
        let result = await db.execute(viewPost, postId);
        res.status(201).send({
            result,
        });
    //토큰 검증이 실패할 경우
    }else {
        res.status(401).send({
            message : "access denied"
        });
    }
});

module.exports = router;
