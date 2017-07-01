const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.get('/:collection_id', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const collectionId = req.params.collection_id;

    if(ID != -1){
      let viewCollectionDetail = 'select p.* from MyCollectionLists m join Collections c on m.collection_id = c.collection_id join Posts p on p.post_id = c.post_id where c.collection_id = ? and ID = ?';

      let result = await db.execute3(viewCollectionDetail, collectionId, ID);
      console.log(result);
      res.status(200).send({
          result
      });
    }
    else {
        res.status(401).send({
            message : "access denied"
        });
    }

});

module.exports = router;
