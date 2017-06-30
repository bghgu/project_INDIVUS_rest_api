const express = require('express');
const router = express.Router();
const pool = require('../../config/db_pool.js');
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.put('/:comment_id', async(req, res, next) => {
  const ID = jwt.verify(req.headers.authorization);
  const commentId = req.params.comment_id;

  let readComment = 'select * from Comments where comment_id = ? and ID = ?';
  let commentExist = await db.execute3(readComment, commentId, ID);

  if(commentExist.length===0)
      res.status(404).send({message: 'comment does not exist'});
  else{
      let modifyComment = 'update Comments set ? where comment_id = ?';
      let data = {
        contents: req.body.contents,
      }
      let result = await db.execute3(modifyComment, data, commentId);
      res.status(200).send({message: 'comment modify success'});
  }

});

module.exports = router;
