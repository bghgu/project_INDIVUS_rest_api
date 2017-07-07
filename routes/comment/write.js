const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');
const notice = require('../module/notice.js');

router.post('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const postId = req.body.post_id;
    let writeComment = 'insert into Comments set ?';
    if (ID != -1) {
        let data = {
            post_id: postId,
            ID: ID,
            contents: req.body.contents,
        };
        let result = await db.execute(writeComment, data);
        result = notice.post_comment(ID, postId, result.insertId);
        if(result) {
            res.status(201).send({
                message: 'comment writing success'
            });
        }else {
            res.status(405).send({
                message: 'comment writing failed'
            });
        }
    } else {
        res.status(401).send({
            message: "access denied"
        });
    }

});

module.exports = router;
