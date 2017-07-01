const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.get('/:post_id', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const postId = req.params.post_id;

    if(ID != -1){
      let viewComment = 'select * from Comments where post_id = ?';

      let result = await db.execute(viewComment, postId);
      res.status(200).send({
          message: "comment view success"
      });
    }
    else {
        res.status(401).send({
            message : "access denied"
        });
    }
  
});

module.exports = router;
