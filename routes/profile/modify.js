const express = require('express');
const router = express.Router();
const pool = require('../../config/db_pool.js');
const async = require('async');
const db = require('../module/pool.js');


router.post('/:id', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);

    if(ID != -1){
      let readProfile = 'select ID from Profiles where ID = ?';
      let profileExist = await db.execute(readProfile, ID);

      if (profileExist.length === 0)
          res.status(404).send({
              message: 'profile does not exist'
          });
      else {
          let modifyProfile = 'update Profiles set ? where ID = ?';

          let data = {
              //profile_photo: req.file ? req.file.location : null,
              name: req.body.name,
              jobs: req.body.jobs,
              birth: req.body.birth,
              tel: req.body.tel,
              active_Area: req.body.active_Area,
              //condition_message: req.body.condition_message,
              //awards: req.body.awards,
              //page: req.body.page,
              //gender: req.body.gender,
              //background_Image: req.file ? req.file.location : null

          };

          let result = await db.execute3(modifyProfile, data, ID);

          console.log(result);
          res.status(200).send({
              message: 'modify success'
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
