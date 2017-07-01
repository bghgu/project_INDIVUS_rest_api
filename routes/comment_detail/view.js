const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.get('/:comment_id', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const commentId = req.params.comment_id;

    if(ID != -1){
      let viewCommentDetail = 'select * from CommentDetails where comment_id = ?';

      let result = await db.execute(viewCommentDetail, commentId);
      res.status(200).send({
          result,
          message: "comment detail view success"
      });
    }
    else {
        res.status(401).send({
            message : "access denied"
        });
    }


});

module.exports = router;
