const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.post('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const postId = req.body.post_id;

    if(ID != -1){
      let viewComment = 'select distinct c.*, p.jobs, p.profile_photo, s.username from Comments c join Profiles p on c.ID=p.ID join Signup s on s.ID=p.ID where post_id = ?';
      let _count = '';
      let result = await db.execute(viewComment, postId);
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
const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.post('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const postId = req.body.post_id;

    if(ID != -1){
      let viewComment = 'select distinct c.*, p.jobs, p.profile_photo, s.username from Comments c join Profiles p on c.ID=p.ID join Signup s on s.ID=p.ID where post_id = ?';
      let _count = '';
      let result = await db.execute(viewComment, postId);
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
