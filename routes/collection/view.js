const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.get('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);

    if (ID != -1) {
        //let viewCollection = 'select * from MyCollectionLists where ID = ?';
        let viewCollectionCard = 'select distinct m.*, p.card_cover as collection_cover from MyCollectionLists m join Collections c on m.collection_id=c.collection_id join Posts p on c.post_id=p.post_id where ID = ?';
        let viewCollectionCard2 = 'select * from MyCollectionLists where collection_id not in (select collection_id from Collections where ID = ?)';
        let collection_detail = 'select count(*) as count from Collections where collection_id = ?';
        let result = await db.execute(viewCollectionCard, ID);
        let result2 = await db.execute(viewCollectionCard2, ID);

        for (i = 0; i < result.length; i++) {
            let data = await db.execute(collection_detail, result[i].collection_id);
            result[i].collection_counts = data[0].count;
        }

        for (i = 0; i < result2.length; i++) {
            result2[i].collection_cover = null;
            result2[i].collection_counts = null;
            result.push(result2[i]);
        }

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
