const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.post('/:post_id', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const postId = req.params.post_id;

    if(ID != -1){
      let writeComment = 'insert into Comments set ?';
      let data = {
          post_id: postId,
          ID: ID,
          contents: req.body.contents,
      };

      let result = await db.execute(writeComment, data);
      //console.log(result);
      res.status(201).send({message: 'comment writing success'});
    }
    else {
        res.status(401).send({
            message : "access denied"
        });
    }

});

module.exports = router;
