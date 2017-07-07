const express = require('express');
const router = express.Router();
const pool = require('../../config/db_pool.js');
const async = require('async');
const db = require('../module/pool.js');
const jwt = require('../module/jwt.js');

router.post('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);

    if(ID != -1){
      let readProfile = 'select ID from Profiles where ID = ?';
      let profileExist = await db.execute(readProfile, ID);

      if (profileExist.length === 0)
          res.status(404).send({
              message: 'profile does not exist'
          });
      else {
          let deleteProfile = 'delete from Profiles where ID = ?';
          let result = await db.execute(deleteProfile, ID);
          console.log(result);
          res.status(200).send({
              message: 'delete success'
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
