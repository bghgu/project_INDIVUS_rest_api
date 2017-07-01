const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.delete('/:collection_id/:post_id', async (req, res, next) => {
    const collectionId = req.params.collection_id;
    const postId = req.params.post_id;

    let readCollectionDetail = 'select * from Collections where collection_id = ? and post_id = ?';
    let collectionDetailExist = await db.execute3(readCollectionDetail, collectionId, postId);

    if(collectionDetailExist.length===0)
        res.status(404).send({message: 'collection detail does not exist'});
    else{
        let deleteCollectionDetail = 'delete from Collections where collection_id = ? and post_id = ?';
        let result = await db.execute3(deleteCollectionDetail, collectionId, postId);
        res.status(200).send({message: 'collection detail delete success'});
    }
});

module.exports = router;
