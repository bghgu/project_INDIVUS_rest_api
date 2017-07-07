const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');
const notice = require('../module/notice.js');

router.post('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const collectionName = req.body.collection_name;
    if (ID != -1) {
        let newCollection = 'insert into MyCollectionLists(collection_name, ID) values(?, ?)';
        let result = await db.execute3(newCollection, collectionName, ID);
        res.status(201).send({
            message: 'collection create success'
        });
    } else {
        res.status(401).send({
            message: "access denied"
        });
    }
});

module.exports = router;
