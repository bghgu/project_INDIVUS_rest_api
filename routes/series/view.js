const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.get('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);

    if(ID != -1){
      let viewWorkroom = 'select s.*, p.card_cover from Series s join Posts p on s.post_id=p.post_id where s.ID_creator = ?';

      let result = await db.execute(viewWorkroom, ID);
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
