const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.post('/', async (req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    let reqPostId = req.body.post_id;

    if(ID != -1){
      const readPost = 'select post_id from Posts where post_id = ? and ID_creator = ?';
      let postExist = await db.execute3(readPost, reqPostId, ID);
      /* DB에 요청한 userId가 존재하지 않으면(없는 사용자의 정보를 요청한다면) */
      if(postExist.length==0)
          res.status(404).send({message: 'post does not exist'});
      else{
          let deletePost = 'delete from Posts where post_id = ?';
          let result = await db.execute(deletePost, reqPostId);
          res.status(200).send({message: 'delete success'});
      }
    }
    else {
        res.status(401).send({
            message : "access denied"
        });
    }

});

module.exports = router;
