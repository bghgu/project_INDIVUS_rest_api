const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.post('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const collectionId = req.body.collection_id;
    let viewCollectionDetail = 'select p.* from MyCollectionLists m join Collections c on m.collection_id = c.collection_id join Posts p on p.post_id = c.post_id where c.collection_id = ? and ID = ?';
    if (ID != -1) {
        let result = await db.execute3(viewCollectionDetail, collectionId, ID);
        console.log(result);
        res.status(200).send({
            result
        });
    } else {
        res.status(401).send({
            message: "access denied"
        });
    }

});

module.exports = router;
