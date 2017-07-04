const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../../module/jwt.js');
const db = require('../../module/pool.js');

router.get('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);

    if(ID != -1){
      const followingList = 'select distinct f.*, p.jobs, p.profile_photo, s.username from Following f join Profiles p on f.following_id=p.ID join Signup s on s.ID=p.ID where f.ID = ?';
      let result = await db.execute(followingList, ID);
      res.status(200).send({
          result
      });
    }
    else {
        res.status(401).send({
            message : "access denied"
        });
    }

});

module.exports = router;
