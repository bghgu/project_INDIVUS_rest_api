const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.post('/', async (req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const postId = req.body.post_id;

    if(ID != -1){
      let readSeriesDetail = 'select * from Posts where post_id = ? and ID_creator = ?';
      let seriesDetailExist = await db.execute3(readSeriesDetail, postId, ID);
      console.log(seriesDetailExist);

      if(seriesDetailExist.length===0)
          res.status(404).send({message: 'series detail does not exist'});
      else{
          let deleteSeriesDetail = 'delete from Posts where post_id = ? and ID_creator = ?';
          let result = await db.execute3(deleteSeriesDetail, postId, ID);

          res.status(200).send({message: 'series detail delete success'});
      }
    }
    else {
        res.status(401).send({
            message : "access denied"
        });
    }
});

module.exports = router;
