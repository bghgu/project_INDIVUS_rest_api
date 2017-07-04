const express = require('express');
const router = express.Router();
const pool = require('../../../config/db_pool.js');
const async = require('async');
const jwt = require('../../module/jwt.js');
const db = require('../../module/pool.js');

router.post('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const followingId = req.body.following_id;

    if(ID != -1){
      let readFollowing = 'select ID from Following where ID = ? and following_id = ?';
      let followingExist = await db.execute3(readFollowing, ID, followingId);

      if (followingExist.length === 0)
          res.status(404).send({
              message: 'following does not exist'
          });
      else {
          let deleteFollowing = 'delete from Following where ID = ? and following_id = ?';
          let result = await db.execute3(deleteFollowing, ID, followingId);

          let deleteFollower = 'delete from Follower where ID = ? and follower_id = ?';
          let result2 = await db.execute3(deleteFollower, followingId, ID);

          let updateBool = 'update Following set follower_boolean = 0 where ID = ? and following_id = ?';
          let updateResult = await db.execute3(updateBool, followingId, ID);

          let updateBool2 = 'update Follower set following_boolean = 0 where ID = ? and follower_id = ?';
          let updateResult2 = await db.execute3(updateBool2, ID, followingId);

          console.log(result);
          res.status(200).send({
              message: 'following delete success'
          });
      }
    }
    else {
        res.status(401).send({
            message : "access denied"
        });
    }

});

module.exports = router;
