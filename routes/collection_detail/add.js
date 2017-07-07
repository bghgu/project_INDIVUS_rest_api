const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');
const notice = require('../module/notice.js');

router.post('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    let addCollectionDetail = 'insert into Collections set ?';
    const post_id = req.body.post_id;
    const collection_id = req.body.collection_id;
    if (ID != -1) {
        let data = {
            collection_id : collection_id,
            post_id : post_id
        };
        let result = await db.execute3(addCollectionDetail, data);
        notice.post_collection(ID, post_id, collection_id);
        res.status(200).send({
            message: "collection detail add success"
        });
    } else {
        res.status(401).send({
            message: "access denied"
        });
    }
});

module.exports = router
