const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.post('/', async (req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const commentId = req.body.comment_id;

    if(ID != -1){
      let readComment = 'select * from Comments where comment_id = ? and ID = ?';
      let commentExist = await db.execute3(readComment, commentId, ID);

      if(commentExist.length===0)
          res.status(404).send({message: 'comment does not exist'});
      else{
          let deleteComment = 'delete from Comments where comment_id = ?';
          let result = await db.execute(deleteComment, commentId);
          res.status(200).send({message: 'comment delete success'});
      }
    }
    else {
        res.status(401).send({
            message : "access denied"
        });
    }

});

module.exports = router;
