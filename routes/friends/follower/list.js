const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../../module/jwt.js');
const db = require('../../module/pool.js');

router.get('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const followerList = 'select distinct f.*, p.jobs, p.profile_photo, s.username from Follower f join Profiles p on f.follower_id=p.ID join Signup s on s.ID=p.ID where f.ID = ?';
    if (ID != -1) {
        let result = await db.execute(followerList, ID);
        res.status(200).send({
            result
        });
    } else {
        res.status(401).send({
            message: "access denied"
        });
    }

});

module.exports = router;
