const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.post('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);

    if(ID != -1){
      let newCollection = 'insert into MyCollectionLists set ?';
      let data = {
          collection_name: req.body.collection_name,
          ID: ID,
      };

      let result = await db.execute(newCollection, data);
      //console.log(result);
      res.status(201).send({message: 'collection create success'});
    }
    else {
        res.status(401).send({
            message : "access denied"
        });
    }

});

module.exports = router;
