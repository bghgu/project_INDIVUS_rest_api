const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.post('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const post_id = req.body.post_id;
    const comment_id = req.body.comment_id;
    const creator_id = req.body.creator_id;
    let data;
    let query;

    if(ID != -1){
      if (post_id != undefined) {
          data = post_id;
          query = 'insert into PostLikes(post_id, ID) values (?, ?)';
      } else if (comment_id != undefined) {
          data = comment_id;
          query = 'insert into CreatorLikes(creator_id, ID) values(?, ?)';
      } else if (creator_id != undefined) {
          data = creator_id;
          query = 'insert into CommentLikes(comment_id, ID) values(?, ?)';
      } else {
          res.status(400).send({
              message: 'bad request'
          });
      }
      let result = await db.execute3(query, data, ID);
      res.status(201).send({
          message: "like success"
      });
    }
    else {
        res.status(401).send({
            message : "access denied"
        });
    }

});

module.exports = router;
