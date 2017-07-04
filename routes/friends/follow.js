const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.post('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const followingId = req.body.following_id;

    if(ID != -1){
      let bool = 'select ID, following_id from Following where ID = ? and following_id = ?';
      let result3 = await db.execute3(bool, followingId, ID);

      if(result3.length == 0){
        let followingAdd = 'insert into Following set ?';
        let data = {
            ID: ID,
            following_id: followingId,
            follower_boolean: 0
        }
        let addResult = await db.execute(followingAdd, data);

        let followerAdd = 'insert into Follower set ?';
        let followerData = {
          ID: followingId,
          follower_id: ID,
          following_boolean: 0
        }
        let followerResult = await db.execute(followerAdd, followerData);
      }


      else{
        let followingBool = 'insert into Following set ?';
        let boolData = {
          ID: ID,
          following_id: followingId,
          follower_boolean: 1
        }
        let boolResult = await db.execute(followingBool, boolData);

        let updateBool = 'update Following set follower_boolean = 1 where ID = ? and following_id = ?';
        let updateResult = await db.execute3(updateBool, followingId, ID);


        let followerAdd = 'insert into Follower set ?';
        let followerData = {
          ID: followingId,
          follower_id: ID,
          following_boolean: 1,
        }
        let followerResult = await db.execute(followerAdd, followerData);

        let updateBool2 = 'update Follower set following_boolean = 1 where ID = ? and follower_id = ?';
        let updateResult2 = await db.execute3(updateBool2, ID, followingId);
      }

      res.status(200).send({
        message: "following & follower add success"
      });
    }
    else {
        res.status(401).send({
            message : "access denied"
        });
    }


});

module.exports = router;
