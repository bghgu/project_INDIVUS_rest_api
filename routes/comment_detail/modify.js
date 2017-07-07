const express = require('express');
const router = express.Router();
const pool = require('../../config/db_pool.js');
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.post('/', async(req, res, next) => {
  const ID = jwt.verify(req.headers.authorization);
  const commentDetailId = req.body.comment_detail_id;

  if(ID != -1){
    let readCommentDetail = 'select * from CommentDetails where comment_detail_id = ? and ID = ?';
    let commentDetailExist = await db.execute3(readCommentDetail, commentDetailId, ID);

    if(commentDetailExist.length===0)
        res.status(404).send({message: 'comment detail does not exist'});
    else{
        let modifyCommentDetail = 'update CommentDetails set ? where comment_detail_id = ?';
        let data = {
          contents: req.body.contents,
        }
        let result = await db.execute3(modifyCommentDetail, data, commentDetailId);
        res.status(200).send({message: 'comment detail modify success'});
    }
  }
  else {
      res.status(401).send({
          message : "access denied"
      });
  }

});

module.exports = router;
