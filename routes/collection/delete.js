const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.delete('/:collection_id', async (req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const collectionId = req.params.collection_id;

    if(ID != -1){
      let readCollection = 'select * from MyCollectionLists where collection_id = ? and ID = ?';
      let collectionExist = await db.execute3(readCollection, collectionId, ID);

      if(collectionExist.length===0)
          res.status(404).send({message: 'collection does not exist'});
      else{
          let deleteCollection = 'delete from MyCollectionLists where collection_id = ?';
          let result = await db.execute(deleteCollection, collectionId);
          res.status(200).send({message: 'collection delete success'});
      }
    }
    else {
        res.status(401).send({
            message : "access denied"
        });
    }

});

module.exports = router;
